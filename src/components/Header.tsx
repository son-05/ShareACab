import React, { useState } from 'react';
import { Shield, Car, Calculator, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenSos: () => void;
  onOpenFareCalc: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSos, onOpenFareCalc }) => {
  const { currentUser, allUsers, switchUser } = useApp();
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo-icon">
          <Car size={20} />
        </div>
        <div>
          <h1 className="header-title">ShareACab</h1>
          <div className="header-subtitle">
            <span>IIT Delhi Campus</span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        {/* Fare split calculator */}
        <button
          className="icon-btn"
          title="Fare Calculator"
          onClick={onOpenFareCalc}
        >
          <Calculator size={17} style={{ color: '#10b981' }} />
        </button>

        {/* Safety Hub */}
        <button
          className="icon-btn"
          title="Safety & Emergency"
          onClick={onOpenSos}
        >
          <Shield size={17} style={{ color: '#fb7185' }} />
        </button>

        {/* Switch Profile Avatar */}
        <div style={{ position: 'relative' }}>
          <div
            className="user-avatar-btn"
            title={`Active: ${currentUser.name} · Tap to switch`}
            onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
          >
            <img src={currentUser.avatar} alt={currentUser.name} />
          </div>

          {showProfileSwitcher && (
            <div
              style={{
                position: 'absolute',
                top: '44px',
                right: 0,
                width: '240px',
                background: '#121622',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                padding: '8px',
                zIndex: 100,
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#94a3b8',
                  padding: '4px 8px 6px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Switch Profile
              </div>

              {allUsers.map((u) => {
                const isActive = u.id === currentUser.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setShowProfileSwitcher(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      color: isActive ? '#c7d2fe' : '#e2e8f0',
                      transition: 'background 0.15s ease',
                      marginBottom: '2px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={u.avatar}
                        alt={u.name}
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{u.name}</div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{u.hostel.split('/')[1]?.trim() || u.hostel}</div>
                      </div>
                    </div>

                    {isActive ? (
                      <Check size={14} style={{ color: '#818cf8' }} />
                    ) : (
                      <ArrowRight size={13} style={{ color: '#64748b' }} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
