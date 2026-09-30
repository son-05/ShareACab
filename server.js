import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import os from 'os';

const PORT = process.env.PORT || 5001;

// Find local IP address (prioritizes Wi-Fi / real network interfaces, ignores VMware / virtual)
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  
  // First pass: look specifically for Wi-Fi or Wireless
  for (const name of Object.keys(interfaces)) {
    const lower = name.toLowerCase();
    if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('wireless') || lower.includes('wlan')) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }

  // Second pass: any real adapter excluding VMware / VirtualBox / vEthernet
  for (const name of Object.keys(interfaces)) {
    const lower = name.toLowerCase();
    if (lower.includes('vmnet') || lower.includes('virtual') || lower.includes('vbox') || lower.includes('vethernet') || lower.includes('loopback')) {
      continue;
    }
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIp();

// In-memory synced state
let syncedRides = null;
let syncedMessages = {};
let lastUpdatedTimestamp = Date.now();

// Helper to broadcast to all open WebSockets
function broadcastToWebSockets(msg, senderWs = null) {
  wss.clients.forEach((client) => {
    if (client !== senderWs && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg));
    }
  });
}

function handleStateUpdate(type, payload) {
  lastUpdatedTimestamp = Date.now();
  if (type === 'RIDE_UPDATED' && payload) {
    syncedRides = payload;
  } else if (type === 'MESSAGES_UPDATED' && payload) {
    const { rideId, message } = payload;
    if (rideId && message) {
      if (!syncedMessages[rideId]) {
        syncedMessages[rideId] = [];
      }
      if (!syncedMessages[rideId].some((m) => m.id === message.id)) {
        syncedMessages[rideId].push(message);
      }
    }
  }
}

// HTTP Server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'online',
        app: 'ShareACab Realtime Relay',
        connectedDevices: wss.clients.size,
        serverIp: localIp,
        port: PORT,
        lastUpdated: lastUpdatedTimestamp,
      })
    );
    return;
  }

  // HTTP Sync endpoint: returns latest rides & messages
  if (req.url === '/api/sync' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        rides: syncedRides,
        messages: syncedMessages,
        lastUpdated: lastUpdatedTimestamp,
      })
    );
    return;
  }

  // HTTP Broadcast endpoint: allows phones to broadcast via standard HTTP POST
  if (req.url === '/api/broadcast' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const msg = JSON.parse(body);
        const { type, payload } = msg;
        handleStateUpdate(type, payload);
        broadcastToWebSockets(msg);
        console.log(`[HTTP POST] Broadcasted: ${type} to ${wss.clients.size} WebSockets`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, timestamp: lastUpdatedTimestamp }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`[+] New device connected from ${clientIp} (Total devices: ${wss.clients.size})`);

  // Send current synced state to newly connected client
  if (syncedRides || Object.keys(syncedMessages).length > 0) {
    ws.send(
      JSON.stringify({
        type: 'INITIAL_SYNC',
        payload: {
          rides: syncedRides,
          messages: syncedMessages,
        },
      })
    );
  }

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      const { type, payload } = msg;

      handleStateUpdate(type, payload);
      console.log(`[WS] Broadcasted: ${type} to ${wss.clients.size} devices`);
      broadcastToWebSockets(msg, ws);
    } catch (err) {
      console.error('Error handling WS message:', err);
    }
  });

  ws.on('close', () => {
    console.log(`[-] Device disconnected (Total devices: ${wss.clients.size})`);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n======================================================');
  console.log(`🚀 ShareACab Dual Relay (WebSocket + HTTP) RUNNING`);
  console.log(`📡 Local Port:      ${PORT}`);
  console.log(`🌐 Server IP:       ${localIp}`);
  console.log(`🔌 WebSocket URL:   ws://${localIp}:${PORT}`);
  console.log(`🩺 Health Check:    http://${localIp}:${PORT}/health`);
  console.log('======================================================\n');
  console.log('Ready for two-phone live real-time demo!\n');
});
