import React, { useState } from 'react';
import { Car, MapPin, Calendar, Clock, Luggage, IndianRupee, ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CAMPUS_ORIGINS, TRANSIT_DESTINATIONS, VEHICLE_OPTIONS } from '../data/campusLocations';
import type { VehicleType, LuggageCapacity } from '../types';

interface CreateRidePageProps {
  onBack: () => void;
  onSuccess: (newRideId: string) => void;
}

export const CreateRidePage: React.FC<CreateRidePageProps> = ({ onBack, onSuccess }) => {
  const { createRide } = useApp();

  // Helper for tomorrow date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [origin, setOrigin] = useState<string>(CAMPUS_ORIGINS[0].name);
  const [pickupLandmark, setPickupLandmark] = useState<string>('Near Campus Security Gate');
  const [destination, setDestination] = useState<string>(TRANSIT_DESTINATIONS[0].name);
  const [departureDate, setDepartureDate] = useState<string>(defaultDateStr);
  const [departureTimeStart, setDepartureTimeStart] = useState<string>('06:00');
  const [departureTimeEnd, setDepartureTimeEnd] = useState<string>('06:30');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Cab (Sedan)');
  const [totalSeats, setTotalSeats] = useState<number>(4);
  const [luggageCapacity, setLuggageCapacity] = useState<LuggageCapacity>('Standard (1 Trolley/person)');
  const [estimatedFare, setEstimatedFare] = useState<number>(850);
  const [notes, setNotes] = useState<string>('');

  const handleDestinationChange = (newDest: string) => {
    setDestination(newDest);
    if (newDest.includes('Airport')) {
      setEstimatedFare(vehicleType === 'Auto-Rickshaw' ? 450 : 900);
    } else if (newDest.includes('NDLS') || newDest.includes('Railway')) {
      setEstimatedFare(vehicleType === 'Auto-Rickshaw' ? 250 : 650);
    } else if (newDest.includes('ISBT') || newDest.includes('Anand Vihar')) {
      setEstimatedFare(vehicleType === 'Auto-Rickshaw' ? 220 : 550);
    } else {
      setEstimatedFare(700);
    }
  };

  const handleVehicleChange = (vType: VehicleType) => {
    setVehicleType(vType);
    if (vType === 'Cab (SUV)') {
      setTotalSeats(6);
    } else if (vType === 'Auto-Rickshaw') {
      setTotalSeats(3);
    } else {
      setTotalSeats(4);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rideId = createRide({
      origin,
      pickupLandmark,
      destination,
      departureDate,
      departureTimeStart,
      departureTimeEnd,
      vehicleType,
      totalSeats,
      luggageCapacity,
      femaleOnly: false,
      estimatedTotalFare: estimatedFare,
      notes: notes || `Leaving from ${origin} to ${destination}. Splitting fare equally.`,
    });

    onSuccess(rideId);
  };

  const perPersonSplit = Math.round(estimatedFare / Math.max(1, totalSeats));

  return (
    <div className="screen-scroll-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button className="icon-btn" onClick={onBack}>
          <ArrowLeft size={17} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Host a Cab Pool</h2>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Coordinate a shared cab and split fares with campus peers
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Pickup Origin */}
        <div className="form-group">
          <label className="form-label">
            <MapPin size={14} style={{ color: '#6366f1' }} /> Campus Pickup Location
          </label>
          <select
            className="form-select"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          >
            {CAMPUS_ORIGINS.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Specific Pickup Landmark */}
        <div className="form-group">
          <label className="form-label">Pickup Landmark / Gate Details</label>
          <input
            type="text"
            className="form-input"
            value={pickupLandmark}
            onChange={(e) => setPickupLandmark(e.target.value)}
            placeholder="e.g. Near Security Gate / Visitor Booth"
            required
          />
        </div>

        {/* Transit Destination */}
        <div className="form-group">
          <label className="form-label">
            <MapPin size={14} style={{ color: '#10b981' }} /> Drop-off Destination
          </label>
          <select
            className="form-select"
            value={destination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            required
          >
            {TRANSIT_DESTINATIONS.map((dest) => (
              <option key={dest.id} value={dest.name}>
                {dest.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date & Departure Window */}
        <div className="form-group">
          <label className="form-label">
            <Calendar size={14} style={{ color: '#818cf8' }} /> Departure Date
          </label>
          <input
            type="date"
            className="form-input"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">
              <Clock size={14} style={{ color: '#818cf8' }} /> Earliest Pickup
            </label>
            <input
              type="time"
              className="form-input"
              value={departureTimeStart}
              onChange={(e) => setDepartureTimeStart(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">
              <Clock size={14} style={{ color: '#818cf8' }} /> Latest Departure
            </label>
            <input
              type="time"
              className="form-input"
              value={departureTimeEnd}
              onChange={(e) => setDepartureTimeEnd(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="form-group">
          <label className="form-label">
            <Car size={14} style={{ color: '#818cf8' }} /> Vehicle Type
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {VEHICLE_OPTIONS.map((v) => {
              const isSelected = vehicleType === v.name;
              return (
                <div
                  key={v.id}
                  onClick={() => handleVehicleChange(v.name as VehicleType)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: isSelected ? '#c7d2fe' : '#e2e8f0' }}>
                    {v.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1px' }}>
                    {v.capacity} Seats
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Luggage Capacity */}
        <div className="form-group">
          <label className="form-label">
            <Luggage size={14} style={{ color: '#818cf8' }} /> Luggage Allowance
          </label>
          <select
            className="form-select"
            value={luggageCapacity}
            onChange={(e) => setLuggageCapacity(e.target.value as LuggageCapacity)}
          >
            <option value="Light (Handbags/Backpacks)">Light (Backpacks only)</option>
            <option value="Standard (1 Trolley/person)">Standard (1 Trolley + 1 Backpack)</option>
            <option value="Heavy (Multiple bags)">Heavy (Multiple large bags)</option>
          </select>
        </div>

        {/* Estimated Total Fare & Per Person Split preview */}
        <div className="form-group">
          <label className="form-label">
            <IndianRupee size={14} style={{ color: '#10b981' }} /> Estimated Total Fare (₹)
          </label>
          <input
            type="number"
            className="form-input"
            value={estimatedFare}
            min={100}
            step={50}
            onChange={(e) => setEstimatedFare(Number(e.target.value) || 0)}
            required
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '4px',
              padding: '8px 12px',
              background: 'rgba(16, 185, 129, 0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <span style={{ fontSize: '0.76rem', color: '#a7f3d0' }}>Per Person Share:</span>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#34d399' }}>
              ₹{perPersonSplit} / rider ({totalSeats} riders)
            </span>
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes for Co-Riders (Optional)</label>
          <textarea
            className="form-textarea"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Flight is at 10:30 AM, need to leave promptly."
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '6px' }}>
          <Check size={17} /> Host Cab Pool
        </button>
      </form>
    </div>
  );
};
