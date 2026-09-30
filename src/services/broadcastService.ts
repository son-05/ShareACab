import { saveRides, saveMessageForRide } from './storageService';

type EventCallback = (data: any) => void;

const DEFAULT_SERVER_IP = '10.81.247.118';
const DEFAULT_PORT = '5001';

export const getRelayServerHost = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('shareacab_relay_ip');
    if (saved) {
      // Clean up common user input variations (strip ws://, http://, :5001, trailing slashes)
      const clean = saved.trim().replace(/^https?:\/\//i, '').replace(/^wss?:\/\//i, '').split('/')[0].split(':')[0];
      if (clean) return clean;
    }
    if (window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return window.location.hostname;
    }
  }
  return DEFAULT_SERVER_IP;
};

export const setRelayServerHost = (host: string): void => {
  if (typeof window !== 'undefined') {
    const clean = host.trim().replace(/^https?:\/\//i, '').replace(/^wss?:\/\//i, '').split('/')[0].split(':')[0];
    localStorage.setItem('shareacab_relay_ip', clean);
  }
};

class BroadcastService {
  private channel: BroadcastChannel | null = null;
  private socket: WebSocket | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private isConnecting = false;
  public isConnected = false;
  private reconnectTimer: any = null;
  private pollTimer: any = null;
  private lastSyncTimestamp = 0;

  constructor() {
    // 1. Browser tab-to-tab sync via BroadcastChannel
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('shareacab_realtime_sync');
        this.channel.onmessage = (event) => {
          const { type, payload } = event.data || {};
          if (type && this.listeners.has(type)) {
            this.listeners.get(type)?.forEach((cb) => cb(payload));
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported', e);
      }
    }

    // 2. Connect to Relay Server (Dual: WebSocket + HTTP Sync)
    if (typeof window !== 'undefined') {
      this.connectWebSocket();
      this.startHttpPolling();
    }
  }

  public connectWebSocket() {
    if (this.isConnecting || (this.socket && this.socket.readyState === WebSocket.OPEN)) {
      return;
    }

    const host = getRelayServerHost();
    const wsUrl = `ws://${host}:${DEFAULT_PORT}`;

    try {
      this.isConnecting = true;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.isConnecting = false;
        console.log(`[WebSocket] Connected to ${wsUrl}`);
        this.emitLocal('CONNECTION_STATUS', { connected: true, host, mode: 'websocket' });
      };

      this.socket.onmessage = (event) => {
        try {
          const { type, payload } = JSON.parse(event.data);
          this.handleIncomingPayload(type, payload);
        } catch (err) {
          console.error('[WebSocket] parse error:', err);
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.isConnecting = false;
        this.emitLocal('CONNECTION_STATUS', { connected: false, host });
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
          this.connectWebSocket();
        }, 3000);
      };

      this.socket.onerror = () => {
        this.isConnecting = false;
      };
    } catch (e) {
      this.isConnecting = false;
      console.warn('[WebSocket] Connection failed', e);
    }
  }

  // Fast HTTP sync polling (runs every 1.5s as a bulletproof fallback if WebSocket is blocked)
  private startHttpPolling() {
    clearInterval(this.pollTimer);
    this.pollTimer = setInterval(async () => {
      const host = getRelayServerHost();
      const url = `http://${host}:${DEFAULT_PORT}/api/sync`;

      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.lastUpdated && data.lastUpdated > this.lastSyncTimestamp) {
            this.lastSyncTimestamp = data.lastUpdated;
            if (data.rides) {
              saveRides(data.rides);
              this.emitLocal('RIDE_UPDATED', data.rides);
            }
            if (data.messages) {
              Object.keys(data.messages).forEach((rideId) => {
                const msgs = data.messages[rideId];
                if (Array.isArray(msgs)) {
                  msgs.forEach((m) => {
                    saveMessageForRide(rideId, m);
                    this.emitLocal('MESSAGES_UPDATED', { rideId, message: m });
                  });
                }
              });
            }
            this.emitLocal('CONNECTION_STATUS', { connected: true, host, mode: 'http' });
          }
        }
      } catch {
        // Silent catch for background poll
      }
    }, 1500);
  }

  private handleIncomingPayload(type: string, payload: any) {
    if (!type) return;

    if (type === 'INITIAL_SYNC' && payload) {
      if (payload.rides) {
        saveRides(payload.rides);
        this.emitLocal('RIDE_UPDATED', payload.rides);
      }
      if (payload.messages) {
        Object.keys(payload.messages).forEach((rideId) => {
          const msgs = payload.messages[rideId];
          if (Array.isArray(msgs)) {
            msgs.forEach((m) => saveMessageForRide(rideId, m));
          }
        });
      }
    } else if (type === 'RIDE_UPDATED' && payload) {
      saveRides(payload);
      this.emitLocal('RIDE_UPDATED', payload);
    } else if (type === 'MESSAGES_UPDATED' && payload) {
      const { rideId, message } = payload;
      if (rideId && message) {
        saveMessageForRide(rideId, message);
        this.emitLocal('MESSAGES_UPDATED', payload);
      }
    } else if (type === 'PEER_ACTION') {
      this.emitLocal('PEER_ACTION', payload);
    }
  }

  // Subscribe to an event
  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  // Dual broadcast: sends via WebSocket AND HTTP POST
  broadcast(type: string, payload: any) {
    const host = getRelayServerHost();

    // 1. Send via WebSocket if open
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify({ type, payload }));
      } catch (err) {
        console.error('[WebSocket] send error:', err);
      }
    }

    // 2. ALSO send via HTTP POST so it never fails even if WebSocket is blocked
    try {
      fetch(`http://${host}:${DEFAULT_PORT}/api/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload }),
      }).catch(() => {});
    } catch {
      // Ignore network errors
    }

    // 3. Send to local browser tabs via BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage({ type, payload });
      } catch (err) {
        console.error('BroadcastChannel error:', err);
      }
    }

    // 4. Trigger local listeners in current window
    this.emitLocal(type, payload);
  }

  private emitLocal(type: string, payload: any) {
    if (this.listeners.has(type)) {
      this.listeners.get(type)?.forEach((cb) => cb(payload));
    }
  }
}

export const realtimeSync = new BroadcastService();
