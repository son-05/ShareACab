import React, { useState } from 'react';
import {
  X,
  Clock,
  Luggage,
  Users,
  IndianRupee,
  MessageSquare,
  UserPlus,
  LogOut,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RideDetailsModalProps {
  rideId: string;
  onClose: () => void;
  onOpenChat: (rideId: string) => void;
  onOpenFareCalc: (fare: number) => void;
}

export const RideDetailsModal: React.FC<RideDetailsModalProps> = ({
  rideId,
  onClose,
  onOpenChat,
  onOpenFareCalc,
}) => {
  const { getRide, currentUser, joinRide, leaveRide } = useApp();
  const [pickupNote, setPickupNote] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const ride = getRide(rideId);
  if (!ride) return null;

  const isHost = ride.hostId === currentUser.id;
  const isPassenger = ride.passengers.some((p) => p.user.id === currentUser.id);
  const perPersonFare = Math.round(ride.estimatedTotalFare / (ride.totalSeats || 4));

  const handleJoin = () => {
    setIsJoining(true);
    const result = joinRide(ride.id, pickupNote);
    setIsJoining(false);
    if (result.success) {
      setPickupNote('');
    }
  };

  const handleLeave = () => {
    if (confirm(isHost ? 'Cancel this hosted pool?' : 'Leave this ride pool?')) {
      leaveRide(ride.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
              <span className={`badge ${ride.availableSeats > 0 ? 'badge-open' : 'badge-full'}`}>
                {ride.availableSeats > 0 ? `${ride.availableSeats} Seats Open` : 'Full'}
              </span>
              <span className="badge badge-vehicle">{ride.vehicleType}</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>Ride Pool Details</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Route Details Box */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '14px',
            border: '1px solid var(--border-subtle)',
            padding: '14px',
          }}
        >
          <div className="route-visual">
            <div className="route-timeline-dots">
              <div className="dot-origin" />
              <div className="route-line" style={{ height: '32px' }} />
              <div className="dot-dest" />
            </div>
            <div className="route-text">
              <div>
                <div style={{ fontSize: '0.68rem', color: '#818cf8', fontWeight: 700 }}>PICKUP</div>
                <div style={{ fontWeight: 600, fontSize: '0.94rem' }}>{ride.origin}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {ride.pickupLandmark || 'Campus'}
                </div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>DESTINATION</div>
                <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#60a5fa' }}>{ride.destination}</div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
              <Clock size={15} style={{ color: '#818cf8' }} />
              <span>
                {ride.departureDate} ({ride.departureTimeStart} - {ride.departureTimeEnd})
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#94a3b8' }}>
              <Luggage size={15} />
              <span>{ride.luggageCapacity.split('(')[0]}</span>
            </div>
          </div>
        </div>

        {/* Fare & Savings Card */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 78, 59, 0.15) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '14px',
            padding: '12px 14px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', color: '#a7f3d0', fontWeight: 700 }}>EQUAL SPLIT</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>₹{perPersonFare} / person</div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Total: ₹{ride.estimatedTotalFare}</div>
          </div>

          <button
            className="btn btn-secondary"
            style={{ fontSize: '0.76rem', padding: '7px 11px', color: '#34d399', borderColor: '#10b981' }}
            onClick={() => onOpenFareCalc(ride.estimatedTotalFare)}
          >
            <IndianRupee size={13} /> Splitter
          </button>
        </div>

        {/* Notes */}
        {ride.notes && (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              fontSize: '0.8rem',
              color: '#cbd5e1',
            }}
          >
            "{ride.notes}"
          </div>
        )}

        {/* Passengers & Host List */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={15} style={{ color: '#818cf8' }} /> Co-Passengers ({ride.passengers.length}/{ride.totalSeats})
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              {ride.availableSeats} open
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {ride.passengers.map((p) => (
              <div
                key={p.user.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={p.user.avatar}
                    alt={p.user.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>
                      {p.user.name}
                      {p.user.id === ride.hostId && <span style={{ color: '#818cf8', fontSize: '0.72rem' }}> (Host)</span>}
                      {p.user.id === currentUser.id && <span style={{ color: '#34d399', fontSize: '0.72rem' }}> (You)</span>}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      {p.user.hostel.split('/')[1]?.trim() || p.user.hostel}
                    </div>
                  </div>
                </div>

                <span style={{ fontSize: '0.7rem', color: '#a5b4fc', background: 'rgba(99, 102, 241, 0.12)', padding: '2px 7px', borderRadius: '6px' }}>
                  {p.pickupNote || 'Confirmed'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          {isPassenger ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 2 }}
                onClick={() => {
                  onClose();
                  onOpenChat(ride.id);
                }}
              >
                <MessageSquare size={17} /> Open Chat
              </button>
              <button
                className="btn btn-danger"
                style={{ flex: 1 }}
                onClick={handleLeave}
              >
                {isHost ? <Trash2 size={15} /> : <LogOut size={15} />}
                {isHost ? 'Cancel' : 'Leave'}
              </button>
            </div>
          ) : ride.availableSeats > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Pickup note (e.g. 1 trolley, meeting at gate)"
                value={pickupNote}
                onChange={(e) => setPickupNote(e.target.value)}
              />
              <button
                className="btn btn-primary btn-block"
                onClick={handleJoin}
                disabled={isJoining}
              >
                <UserPlus size={17} /> Join as {currentUser.name} (₹{perPersonFare})
              </button>
            </div>
          ) : (
            <div
              style={{
                padding: '11px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '10px',
                color: '#94a3b8',
                fontWeight: 600,
                fontSize: '0.84rem',
              }}
            >
              This pool is currently full
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
