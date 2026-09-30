import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ExplorePage } from './pages/ExplorePage';
import { CreateRidePage } from './pages/CreateRidePage';
import { MyRidesPage } from './pages/MyRidesPage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { RideDetailsModal } from './pages/RideDetailsModal';
import { SosModal } from './components/SosModal';
import { FareCalculatorModal } from './components/FareCalculatorModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedRideId,
    setSelectedRideId,
    setActiveChatRideId,
    toast,
  } = useApp();

  const [showSosModal, setShowSosModal] = useState(false);
  const [showFareModal, setShowFareModal] = useState(false);
  const [calcFare, setCalcFare] = useState<number>(850);

  const handleOpenChat = (rideId: string) => {
    setActiveChatRideId(rideId);
    setActiveTab('chats');
  };

  const handleOpenFareCalc = (fare: number = 850) => {
    setCalcFare(fare);
    setShowFareModal(true);
  };

  return (
    <div className="mobile-shell">
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`toast-banner toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} style={{ color: '#34d399' }} />}
          {toast.type === 'error' && <AlertCircle size={18} style={{ color: '#fb7185' }} />}
          {toast.type === 'info' && <Info size={18} style={{ color: '#818cf8' }} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Mobile App Header */}
      <Header
        onOpenSos={() => setShowSosModal(true)}
        onOpenFareCalc={() => handleOpenFareCalc(800)}
      />

      {/* Page Views Router */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeTab === 'explore' && (
          <ExplorePage
            onOpenCreate={() => setActiveTab('create')}
            onSelectRide={(id) => setSelectedRideId(id)}
          />
        )}

        {activeTab === 'my-rides' && (
          <MyRidesPage
            onSelectRide={(id) => setSelectedRideId(id)}
            onOpenCreate={() => setActiveTab('create')}
            onOpenChat={handleOpenChat}
          />
        )}

        {activeTab === 'create' && (
          <CreateRidePage
            onBack={() => setActiveTab('explore')}
            onSuccess={(newRideId) => {
              setSelectedRideId(newRideId);
              setActiveTab('explore');
            }}
          />
        )}

        {activeTab === 'chats' && (
          <ChatPage onBackToExplore={() => setActiveTab('explore')} />
        )}

        {activeTab === 'profile' && <ProfilePage />}
      </main>

      {/* Bottom Tab Navigation Bar */}
      <BottomNav />

      {/* Modals & Bottom Sheets */}
      {selectedRideId && (
        <RideDetailsModal
          rideId={selectedRideId}
          onClose={() => setSelectedRideId(null)}
          onOpenChat={handleOpenChat}
          onOpenFareCalc={handleOpenFareCalc}
        />
      )}

      {showSosModal && <SosModal onClose={() => setShowSosModal(false)} />}

      {showFareModal && (
        <FareCalculatorModal
          initialFare={calcFare}
          onClose={() => setShowFareModal(false)}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
