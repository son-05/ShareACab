import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ChatMessage } from '../types';
import { realtimeSync } from '../services/broadcastService';

interface ChatPageProps {
  onBackToExplore: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ onBackToExplore }) => {
  const {
    currentUser,
    rides,
    getRideMessages,
    sendMessage,
    activeChatRideId,
    setActiveChatRideId,
    getRide,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter rides user has joined or hosted
  const myRides = rides.filter(
    (r) => r.hostId === currentUser.id || r.passengers.some((p) => p.user.id === currentUser.id)
  );

  // Default to first ride if none selected
  const currentRideId = activeChatRideId || (myRides.length > 0 ? myRides[0].id : null);
  const currentRide = currentRideId ? getRide(currentRideId) : null;

  // Load and subscribe to real-time chat updates
  useEffect(() => {
    if (currentRideId) {
      setMessages(getRideMessages(currentRideId));
    }

    const unsub = realtimeSync.on('MESSAGES_UPDATED', (data: { rideId: string; message: ChatMessage }) => {
      if (data && data.rideId === currentRideId) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    return () => unsub();
  }, [currentRideId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || inputText).trim();
    if (!textToSend || !currentRideId) return;

    sendMessage(currentRideId, textToSend);
    setMessages(getRideMessages(currentRideId));
    setInputText('');
  };

  const sendQuickAction = (text: string) => {
    handleSend(undefined, text);
  };

  if (!currentRide || myRides.length === 0) {
    return (
      <div className="screen-scroll-container">
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Pool Coordination</h2>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Chat with co-passengers in your ride pools
          </div>
        </div>

        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '16px',
            border: '1px dashed rgba(255, 255, 255, 0.08)',
            marginTop: '20px',
          }}
        >
          <MessageSquare size={36} style={{ color: '#475569' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>No Active Chat Rooms</div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', maxWidth: '280px', marginTop: '4px' }}>
              Chat rooms activate when you host or join a cab pool to coordinate pickup with peers.
            </div>
          </div>
          <button className="btn btn-primary" onClick={onBackToExplore}>
            Browse Active Pools
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Pool Selector Strip (if user is in multiple pools) */}
      {myRides.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '8px 14px',
            background: 'rgba(16, 20, 32, 0.95)',
            borderBottom: '1px solid var(--border-subtle)',
            overflowX: 'auto',
            flexShrink: 0,
          }}
        >
          {myRides.map((r) => {
            const isSelected = r.id === currentRideId;
            return (
              <button
                key={r.id}
                onClick={() => setActiveChatRideId(r.id)}
                style={{
                  padding: '5px 11px',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.02)',
                  color: isSelected ? '#c7d2fe' : '#94a3b8',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {r.destination.split('(')[0].trim()}
              </button>
            );
          })}
        </div>
      )}

      {/* Chat Room Sub-Header */}
      <div
        style={{
          padding: '10px 14px',
          background: 'rgba(18, 22, 34, 0.95)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f1f5f9' }}>
            {currentRide.destination}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{currentRide.pickupLandmark || currentRide.origin}</span>
            <span>•</span>
            <span>{currentRide.departureTimeStart}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {currentRide.passengers.map((p) => (
            <img
              key={p.user.id}
              src={p.user.avatar}
              alt={p.user.name}
              title={`${p.user.name} (${p.user.hostel})`}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '2px solid #111520',
                marginLeft: '-5px',
                objectFit: 'cover',
              }}
            />
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="chat-bubble chat-bubble-system">
                {msg.text}
              </div>
            );
          }

          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`chat-bubble ${isMe ? 'chat-bubble-me' : 'chat-bubble-them'}`}
            >
              {!isMe && <div className="chat-sender-name">{msg.senderName}</div>}
              <div>{msg.text}</div>
              <div className="chat-time">{msg.timestamp}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          padding: '6px 12px',
          overflowX: 'auto',
          background: 'rgba(10, 12, 20, 0.8)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          scrollbarWidth: 'none',
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => sendQuickAction('Cab booked! Uber arriving in 10 mins.')}
          style={{
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            color: '#c7d2fe',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Cab Booked
        </button>

        <button
          onClick={() => sendQuickAction('I have reached the meeting point.')}
          style={{
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#6ee7b7',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Reached Point
        </button>

        <button
          onClick={() => sendQuickAction('Running 5 mins late, please wait!')}
          style={{
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            color: '#fcd34d',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          5 Mins Late
        </button>
      </div>

      {/* Input Field Bottom Row */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '8px 12px calc(var(--safe-bottom) + 70px) 12px',
          background: 'rgba(14, 18, 28, 0.95)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          className="form-input"
          placeholder="Message pool members..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ height: '40px', padding: '8px 12px', fontSize: '0.86rem' }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '40px', height: '40px', padding: 0, borderRadius: '10px', flexShrink: 0 }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
