import React, { useState } from 'react';
import { IndianRupee, MessageSquare, Car, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RideCard } from '../components/RideCard';

interface MyRidesPageProps {
  onSelectRide: (rideId: string) => void;
  onOpenCreate: () => void;
  onOpenChat: (rideId: string) => void;
}

export const MyRidesPage: React.FC<MyRidesPageProps> = ({ onSelectRide, onOpenCreate, onOpenChat }) => {
  const { rides, currentUser } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'hosted' | 'joined'>('all');

  const myRides = rides.filter((ride) => {
    const isHost = ride.hostId === currentUser.id;
    const isPassenger = ride.passengers.some((p) => p.user.id === currentUser.id);

    if (filterType === 'hosted') return isHost;
    if (filterType === 'joined') return isPassenger && !isHost;
    return isHost || isPassenger;
  });

  // Calculate approximate savings
  const totalMoneySaved = myRides.reduce((acc, r) => {
    const solo = r.estimatedTotalFare;
    const split = Math.round(solo / (r.totalSeats || 4));
    return acc + (solo - split);
  }, 0);

  return (
    <div className="screen-scroll-container">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>My Pools</h2>
        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
          Your active ride pools and co-riders
        </div>
      </div>

      {/* Savings & Rides Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 78, 59, 0.15) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '14px',
            padding: '12px 14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#34d399', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <IndianRupee size={13} /> Estimated Savings
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
            ₹{totalMoneySaved > 0 ? totalMoneySaved : 780}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>By splitting cab fares</div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(79, 70, 229, 0.15) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '14px',
            padding: '12px 14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#818cf8', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Car size={13} /> Active Pools
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#a5b4fc', fontFamily: 'var(--font-heading)', marginTop: '2px' }}>
            {myRides.length}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Booked or organized</div>
        </div>
      </div>

      {/* Filter Segment Tabs */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '10px',
          padding: '3px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <button
          onClick={() => setFilterType('all')}
          style={{
            flex: 1,
            padding: '7px',
            borderRadius: '7px',
            border: 'none',
            fontSize: '0.74rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: filterType === 'all' ? 'var(--primary-gradient)' : 'transparent',
            color: filterType === 'all' ? 'white' : '#94a3b8',
            transition: 'all 0.15s ease',
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilterType('hosted')}
          style={{
            flex: 1,
            padding: '7px',
            borderRadius: '7px',
            border: 'none',
            fontSize: '0.74rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: filterType === 'hosted' ? 'var(--primary-gradient)' : 'transparent',
            color: filterType === 'hosted' ? 'white' : '#94a3b8',
            transition: 'all 0.15s ease',
          }}
        >
          Hosted
        </button>
        <button
          onClick={() => setFilterType('joined')}
          style={{
            flex: 1,
            padding: '7px',
            borderRadius: '7px',
            border: 'none',
            fontSize: '0.74rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: filterType === 'joined' ? 'var(--primary-gradient)' : 'transparent',
            color: filterType === 'joined' ? 'white' : '#94a3b8',
            transition: 'all 0.15s ease',
          }}
        >
          Joined
        </button>
      </div>

      {/* Rides List */}
      {myRides.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {myRides.map((ride) => (
            <div key={ride.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <RideCard ride={ride} onSelect={onSelectRide} />
              <button
                className="btn btn-secondary"
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '0.76rem',
                  color: '#818cf8',
                  alignSelf: 'flex-end',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenChat(ride.id);
                }}
              >
                <MessageSquare size={13} /> Chat with Pool
              </button>
            </div>
          ))}
        </div>
      ) : (
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
          }}
        >
          <Car size={34} style={{ color: '#475569' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>No Pools in this Tab</div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '3px' }}>
              You don't have any ride pools in this category.
            </div>
          </div>
          <button className="btn btn-primary" onClick={onOpenCreate}>
            <Plus size={15} /> Host a Ride Pool
          </button>
        </div>
      )}
    </div>
  );
};
