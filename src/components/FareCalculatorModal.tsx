import React, { useState } from 'react';
import { X, Calculator, ExternalLink, TrendingDown, Share2, Check } from 'lucide-react';

interface FareCalculatorModalProps {
  onClose: () => void;
  initialFare?: number;
}

export const FareCalculatorModal: React.FC<FareCalculatorModalProps> = ({ onClose, initialFare = 800 }) => {
  const [totalFare, setTotalFare] = useState<number>(initialFare);
  const [passengersCount, setPassengersCount] = useState<number>(4);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const perPersonCost = Math.round(totalFare / Math.max(1, passengersCount));
  const soloCost = totalFare;
  const individualSavings = soloCost - perPersonCost;

  const openUber = () => {
    window.open('https://m.uber.com/ul/?action=setPickup&pickup=my_location', '_blank');
  };

  const openOla = () => {
    window.open('https://book.olacabs.com/', '_blank');
  };

  const handleShareUpi = () => {
    const upiLink = `upi://pay?pa=campus.cabshare@upi&pn=ShareACab%20Host&am=${perPersonCost}&cu=INR&tn=Cab%20Pool%20Share`;
    navigator.clipboard?.writeText(upiLink);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
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
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calculator size={17} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Fare & Split Calculator</h3>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Inputs */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Total Fare (₹)</label>
            <input
              type="number"
              className="form-input"
              value={totalFare}
              min={50}
              step={50}
              onChange={(e) => setTotalFare(Number(e.target.value) || 0)}
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Riders ({passengersCount})</label>
            <select
              className="form-select"
              value={passengersCount}
              onChange={(e) => setPassengersCount(Number(e.target.value))}
            >
              <option value={1}>1 Rider (Solo)</option>
              <option value={2}>2 Riders (50/50)</option>
              <option value={3}>3 Riders</option>
              <option value={4}>4 Riders (Sedan)</option>
              <option value={5}>5 Riders</option>
              <option value={6}>6 Riders (SUV XL)</option>
            </select>
          </div>
        </div>

        {/* Calculated Savings Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 78, 59, 0.2) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '14px',
            padding: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', color: '#a7f3d0', textTransform: 'uppercase', fontWeight: 700 }}>
              YOUR SPLIT
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-heading)' }}>
              ₹{perPersonCost}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingDown size={13} style={{ color: '#34d399' }} /> Saves ₹{individualSavings} vs solo travel
            </div>
          </div>

          <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '14px' }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Solo Cost</div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>₹{soloCost}</div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '3px' }}>Group</div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>{passengersCount} people</div>
          </div>
        </div>

        {/* Direct Cab Booking Links */}
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
            OPEN CAB PROVIDER:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={openUber}
              className="btn btn-secondary"
              style={{ flex: 1, background: '#090a0f', color: '#ffffff', border: '1px solid #1e2230', fontSize: '0.82rem' }}
            >
              <span>Uber</span>
              <ExternalLink size={13} />
            </button>
            <button
              onClick={openOla}
              className="btn btn-secondary"
              style={{ flex: 1, background: '#090a0f', color: '#facc15', border: '1px solid #1e2230', fontSize: '0.82rem' }}
            >
              <span>Ola</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

        {/* UPI Share Link */}
        <button
          onClick={handleShareUpi}
          className="btn btn-primary btn-block"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
        >
          {copiedUpi ? (
            <>
              <Check size={16} /> Copied UPI Link (₹{perPersonCost}/person)!
            </>
          ) : (
            <>
              <Share2 size={16} /> Copy UPI Split Request (₹{perPersonCost})
            </>
          )}
        </button>
      </div>
    </div>
  );
};
