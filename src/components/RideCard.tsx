import React from 'react';
import { Clock, ArrowRight, UserCheck } from 'lucide-react';
import type { RidePool } from '../types';
import { useApp } from '../context/AppContext';

interface RideCardProps {
  ride: RidePool;
  onSelect: (rideId: string) => void;
}

export const RideCard: React.FC<RideCardProps> = ({ ride, onSelect }) => {
  const { currentUser } = useApp();

  const isHost = ride.hostId === currentUser.id;
  const isPassenger = ride.passengers.some((p) => p.user.id === currentUser.id);
  const perPersonFare = Math.round(ride.estimatedTotalFare / (ride.totalSeats || 4));

  // Format date readable
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="glass-card ride-card" onClick={() => onSelect(ride.id)}>
      {/* Top badges & Fare */}
      <div className="ride-card-header">
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span className="badge badge-vehicle">{ride.vehicleType}</span>
          {isHost && (
            <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#c7d2fe', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              Your Pool
            </span>
          )}
          {!isHost && isPassenger && (
            <span className="badge badge-open">
              <UserCheck size={11} /> Joined
            </span>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <div className="fare-tag">₹{perPersonFare}</div>
          <div className="fare-split-tag">/ person</div>
        </div>
      </div>

      {/* Visual Route */}
      <div className="route-visual">
        <div className="route-timeline-dots">
          <div className="dot-origin" />
          <div className="route-line" />
          <div className="dot-dest" />
        </div>
        <div className="route-text">
          <div>
            <div className="route-location-title">{ride.origin}</div>
            <div className="route-subtext">{ride.pickupLandmark || 'Campus'}</div>
          </div>
          <div>
            <div className="route-location-title" style={{ color: '#60a5fa' }}>
              {ride.destination}
            </div>
            <div className="route-subtext">Drop-off</div>
          </div>
        </div>
      </div>

      {/* Time & Seats row */}
      <div className="ride-specs-row">
        <div className="time-slot">
          <Clock size={14} style={{ color: '#818cf8' }} />
          <span>
            {formatDate(ride.departureDate)} · {ride.departureTimeStart} - {ride.departureTimeEnd}
          </span>
        </div>

        <span
          className={`badge ${ride.availableSeats > 0 ? 'badge-open' : 'badge-full'}`}
          style={{ fontSize: '0.7rem' }}
        >
          {ride.availableSeats > 0 ? `${ride.availableSeats} open` : 'Full'}
        </span>
      </div>

      {/* Host & View Action */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="host-pill">
          <img src={ride.host.avatar} alt={ride.host.name} className="host-avatar" />
          <span className="host-name">
            Hosted by <strong style={{ color: '#e2e8f0' }}>{ride.host.name}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: '#818cf8', fontWeight: 600 }}>
          <span>View</span>
          <ArrowRight size={13} />
        </div>
      </div>
    </div>
  );
};
