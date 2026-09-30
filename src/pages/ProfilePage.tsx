import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Home,
  Star,
  Edit2,
  Check,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CAMPUS_ORIGINS } from '../data/campusLocations';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateProfile, allUsers, switchUser, resetAppStore } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [hostel, setHostel] = useState(currentUser.hostel);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, hostel });
    setIsEditing(false);
  };

  return (
    <div className="screen-scroll-container">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Profile & Account</h2>
        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
          Campus identity for cab sharing & ride coordination
        </div>
      </div>

      {/* User Identity Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #181d2c 0%, #101420 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '2px solid #6366f1',
                objectFit: 'cover',
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>{currentUser.name}</h3>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '2px 6px',
                    borderRadius: '6px',
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <ShieldCheck size={11} /> Verified
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#818cf8', fontWeight: 600 }}>
                {currentUser.rollNo}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                {currentUser.hostel}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px' }}>
              <Star size={13} fill="#facc15" /> {currentUser.rating}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{currentUser.ridesCompleted} rides</div>
          </div>
        </div>
      </div>

      {/* Switch Profiles Section (Strictly John, Jaison, Madhesh) */}
      <div className="glass-card">
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#e2e8f0' }}>Select Active Profile</div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            Switch between the 3 verified campus profiles
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {allUsers.map((u) => {
            const isActive = u.id === currentUser.id;
            return (
              <div
                key={u.id}
                onClick={() => {
                  switchUser(u.id);
                  setName(u.name);
                  setPhone(u.phone);
                  setHostel(u.hostel);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: isActive ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={u.avatar}
                    alt={u.name}
                    style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>{u.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {u.rollNo} · {u.hostel.split('/')[1]?.trim() || u.hostel}
                    </div>
                  </div>
                </div>

                {isActive ? (
                  <span style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 700 }}>ACTIVE</span>
                ) : (
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Select</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact & Hostel Information */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>Contact & Campus Info</div>
          <button
            className="icon-btn"
            style={{ width: '30px', height: '30px' }}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Check size={15} /> : <Edit2 size={15} />}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hostel</label>
              <select className="form-select" value={hostel} onChange={(e) => setHostel(e.target.value)}>
                {CAMPUS_ORIGINS.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '4px' }}>
              Save Details
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={15} style={{ color: '#818cf8' }} />
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Campus Email</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{currentUser.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={15} style={{ color: '#10b981' }} />
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Phone</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{currentUser.phone}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Home size={15} style={{ color: '#f59e0b' }} />
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Hostel Location</div>
                <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{currentUser.hostel}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Realtime Relay Connection Settings */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>Realtime Sync Server</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Connects both phones for live two-device chat</div>
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.68rem',
              fontWeight: 600,
              padding: '2px 7px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            Port 5001
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-input"
            style={{ fontSize: '0.82rem', padding: '8px 10px' }}
            placeholder="Laptop IP (e.g. 10.10.218.71)"
            defaultValue={localStorage.getItem('shareacab_relay_ip') || '10.10.218.71'}
            id="relay-server-ip-input"
          />
          <button
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
            onClick={() => {
              const val = (document.getElementById('relay-server-ip-input') as HTMLInputElement)?.value;
              if (val) {
                localStorage.setItem('shareacab_relay_ip', val.trim());
                window.location.reload();
              }
            }}
          >
            Connect
          </button>
        </div>
      </div>

      {/* Reset Cache Button */}
      <button
        onClick={resetAppStore}
        className="btn btn-secondary btn-block"
        style={{ fontSize: '0.78rem', color: '#94a3b8', borderStyle: 'dashed' }}
      >
        <RotateCcw size={13} /> Reset Mock Records
      </button>
    </div>
  );
};
