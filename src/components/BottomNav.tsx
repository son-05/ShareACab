import React from 'react';
import { Compass, CalendarCheck, Plus, MessageSquare, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, rides, currentUser } = useApp();

  // Calculate user's active rides count
  const myRidesCount = rides.filter(
    (r) => r.hostId === currentUser.id || r.passengers.some((p) => p.user.id === currentUser.id)
  ).length;

  return (
    <nav className="bottom-nav-bar">
      <button
        className={`nav-tab-item ${activeTab === 'explore' ? 'active' : ''}`}
        onClick={() => setActiveTab('explore')}
      >
        <div className="tab-icon-wrap">
          <Compass size={19} />
        </div>
        <span>Explore</span>
      </button>

      <button
        className={`nav-tab-item ${activeTab === 'my-rides' ? 'active' : ''}`}
        onClick={() => setActiveTab('my-rides')}
        style={{ position: 'relative' }}
      >
        <div className="tab-icon-wrap">
          <CalendarCheck size={19} />
        </div>
        <span>My Pools</span>
        {myRidesCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '8px',
              background: '#6366f1',
              color: 'white',
              fontSize: '0.6rem',
              fontWeight: 700,
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {myRidesCount}
          </span>
        )}
      </button>

      {/* Center Action: Host Ride */}
      <div className="nav-tab-center">
        <button
          className="tab-center-btn"
          title="Host a new pool"
          onClick={() => setActiveTab('create')}
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>
      </div>

      <button
        className={`nav-tab-item ${activeTab === 'chats' ? 'active' : ''}`}
        onClick={() => setActiveTab('chats')}
      >
        <div className="tab-icon-wrap">
          <MessageSquare size={19} />
        </div>
        <span>Chat</span>
      </button>

      <button
        className={`nav-tab-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
      >
        <div className="tab-icon-wrap">
          <UserIcon size={19} />
        </div>
        <span>Profile</span>
      </button>
    </nav>
  );
};
