import React, { useState } from 'react';
import { Search, Filter, Plus, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RideCard } from '../components/RideCard';
import { FilterModal } from '../components/FilterModal';

interface ExplorePageProps {
  onOpenCreate: () => void;
  onSelectRide: (rideId: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onOpenCreate, onSelectRide }) => {
  const { filteredRides, filters, setFilters } = useApp();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Clean filter chips without cringe emojis
  const destinationChips = [
    { label: 'All Destinations', value: '' },
    { label: 'Airport (T3/T2)', value: 'Airport (T3/T2)' },
    { label: 'Railway (NDLS)', value: 'NDLS' },
    { label: 'Domestic (T1)', value: 'T1' },
    { label: 'Anand Vihar', value: 'Anand Vihar' },
  ];

  const handleChipClick = (value: string) => {
    setFilters((prev) => ({ ...prev, destination: value || undefined }));
  };

  const displayedRides = filteredRides.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.destination.toLowerCase().includes(q) ||
      r.origin.toLowerCase().includes(q) ||
      r.host.name.toLowerCase().includes(q) ||
      (r.pickupLandmark && r.pickupLandmark.toLowerCase().includes(q))
    );
  });

  const activeFiltersCount = Object.keys(filters).filter((k) => (filters as any)[k] !== undefined).length;

  return (
    <div className="screen-scroll-container">
      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', height: '42px', fontSize: '0.86rem' }}
            placeholder="Search destination, gate, or peer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          className="icon-btn"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: activeFiltersCount > 0 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            borderColor: activeFiltersCount > 0 ? 'var(--primary)' : 'var(--border-subtle)',
            position: 'relative',
          }}
          onClick={() => setShowFilterModal(true)}
          title="Filter Rides"
        >
          <Filter size={16} style={{ color: activeFiltersCount > 0 ? '#818cf8' : '#cbd5e1' }} />
          {activeFiltersCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#6366f1',
              }}
            />
          )}
        </button>
      </div>

      {/* Filter Chips Carousel */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'none',
        }}
      >
        {destinationChips.map((chip, idx) => {
          const isSelected =
            (filters.destination || '') === chip.value || (!filters.destination && chip.value === '');
          return (
            <button
              key={idx}
              onClick={() => handleChipClick(chip.value)}
              style={{
                padding: '6px 13px',
                borderRadius: '20px',
                fontSize: '0.74rem',
                fontWeight: 600,
                border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? '#c7d2fe' : '#94a3b8',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#e2e8f0' }}>
          Available Pools ({displayedRides.length})
        </div>
        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Live campus network</div>
      </div>

      {/* Rides List */}
      {displayedRides.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayedRides.map((ride) => (
            <RideCard key={ride.id} ride={ride} onSelect={onSelectRide} />
          ))}
        </div>
      ) : (
        /* Empty State */
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
          <Compass size={36} style={{ color: '#475569' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.94rem', color: '#e2e8f0' }}>No Pools Found</div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '4px' }}>
              No shared ride matches this destination or filter.
            </div>
          </div>
          <button className="btn btn-primary" onClick={onOpenCreate} style={{ marginTop: '4px' }}>
            <Plus size={16} /> Host a Pool
          </button>
        </div>
      )}

      {showFilterModal && <FilterModal onClose={() => setShowFilterModal(false)} />}
    </div>
  );
};
