import React from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSIT_DESTINATIONS, CAMPUS_ORIGINS } from '../data/campusLocations';

interface FilterModalProps {
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ onClose }) => {
  const { filters, setFilters, resetFilters } = useApp();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={17} style={{ color: '#818cf8' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Filter Pools</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Destination Filter */}
        <div className="form-group">
          <label className="form-label">Destination</label>
          <select
            className="form-select"
            value={filters.destination || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, destination: e.target.value || undefined }))}
          >
            <option value="">All Destinations</option>
            {TRANSIT_DESTINATIONS.map((dest) => (
              <option key={dest.id} value={dest.name}>
                {dest.name}
              </option>
            ))}
          </select>
        </div>

        {/* Origin Filter */}
        <div className="form-group">
          <label className="form-label">Pickup Point</label>
          <select
            className="form-select"
            value={filters.origin || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, origin: e.target.value || undefined }))}
          >
            <option value="">Any Campus Location</option>
            {CAMPUS_ORIGINS.map((orig) => (
              <option key={orig.id} value={orig.name}>
                {orig.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="form-group">
          <label className="form-label">Departure Date</label>
          <input
            type="date"
            className="form-input"
            value={filters.date || ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value || undefined }))}
          />
        </div>

        {/* Available seats only toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 13px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>Hide Full Pools</div>
          <input
            type="checkbox"
            checked={!!filters.availableOnly}
            onChange={(e) => setFilters((prev) => ({ ...prev, availableOnly: e.target.checked || undefined }))}
            style={{ width: '18px', height: '18px', accentColor: '#6366f1', cursor: 'pointer' }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={() => {
              resetFilters();
              onClose();
            }}
          >
            <RotateCcw size={15} /> Reset
          </button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
