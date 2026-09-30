import React, { useState } from 'react';
import { X, ShieldAlert, PhoneCall, Share2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SosModalProps {
  onClose: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({ onClose }) => {
  const { currentUser } = useApp();
  const [copied, setCopied] = useState(false);

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `[Campus Ride Sharing Status] I am ${currentUser.name} (${currentUser.rollNo}, ${currentUser.hostel}). Currently coordinating a shared campus cab via ShareACab. Phone: ${currentUser.phone}.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'rgba(244, 63, 94, 0.15)',
                color: '#fb7185',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldAlert size={18} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffe4e6' }}>
              Campus Safety Hub
            </h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: '10px',
            padding: '11px',
            fontSize: '0.8rem',
            color: '#fecdd3',
          }}
        >
          Direct contact with campus security and emergency roadside services for late-night or transit assistance.
        </div>

        {/* Emergency Contacts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href="tel:112"
            className="btn btn-secondary"
            style={{
              justifyContent: 'space-between',
              textDecoration: 'none',
              padding: '10px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PhoneCall size={16} style={{ color: '#fb7185' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>National Emergency Services</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Police, Ambulance & Highway Patrol</div>
              </div>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>112</span>
          </a>

          <a
            href="tel:1091"
            className="btn btn-secondary"
            style={{
              justifyContent: 'space-between',
              textDecoration: 'none',
              padding: '10px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PhoneCall size={16} style={{ color: '#fb7185' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>Women's Safety Helpline</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>24x7 Toll-Free Assistance</div>
              </div>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>1091</span>
          </a>

          <a
            href="tel:01126591000"
            className="btn btn-secondary"
            style={{
              justifyContent: 'space-between',
              textDecoration: 'none',
              padding: '10px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PhoneCall size={16} style={{ color: '#6366f1' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>Campus Main Security</div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Security Control Room</div>
              </div>
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#818cf8' }}>Dial</span>
          </a>
        </div>

        {/* WhatsApp Ride Share */}
        <button
          onClick={handleShareWhatsapp}
          className="btn btn-primary btn-block"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', marginTop: '2px' }}
        >
          {copied ? (
            <>
              <Check size={16} /> Shared to WhatsApp!
            </>
          ) : (
            <>
              <Share2 size={16} /> Share Ride Status via WhatsApp
            </>
          )}
        </button>
      </div>
    </div>
  );
};
