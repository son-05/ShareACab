import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { User, RidePool, ChatMessage, FilterOptions } from '../types';
import {
  getCurrentUser,
  setCurrentUser as persistCurrentUser,
  getAllUsers,
  getAllRides,
  saveRides,
  getMessagesForRide,
  saveMessageForRide,
  resetToDefaults,
} from '../services/storageService';
import { realtimeSync } from '../services/broadcastService';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  switchUser: (userId: string) => void;
  updateProfile: (updated: Partial<User>) => void;
  rides: RidePool[];
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  filteredRides: RidePool[];
  createRide: (newRide: Partial<RidePool>) => string;
  joinRide: (rideId: string, note?: string) => { success: boolean; message: string };
  leaveRide: (rideId: string) => void;
  getRide: (rideId: string) => RidePool | undefined;
  getRideMessages: (rideId: string) => ChatMessage[];
  sendMessage: (rideId: string, text: string, quickType?: ChatMessage['quickActionType']) => void;
  activeTab: 'explore' | 'my-rides' | 'create' | 'chats' | 'profile';
  setActiveTab: (tab: 'explore' | 'my-rides' | 'create' | 'chats' | 'profile') => void;
  selectedRideId: string | null;
  setSelectedRideId: (id: string | null) => void;
  activeChatRideId: string | null;
  setActiveChatRideId: (id: string | null) => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  simulatePeerJoin: (rideId: string) => void;
  resetAppStore: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrUser] = useState<User>(getCurrentUser);
  const [allUsers, setUsers] = useState<User[]>(getAllUsers);
  const [rides, setRidesState] = useState<RidePool[]>(getAllRides);
  const [activeTab, setActiveTab] = useState<'explore' | 'my-rides' | 'create' | 'chats' | 'profile'>('explore');
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [activeChatRideId, setActiveChatRideId] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync state with storage and other browser tabs/windows
  useEffect(() => {
    const unsubRideUpdate = realtimeSync.on('RIDE_UPDATED', (updatedRides) => {
      if (updatedRides) {
        setRidesState(updatedRides);
      }
    });

    const unsubBroadcast = realtimeSync.on('PEER_ACTION', (data: { message: string; type: any }) => {
      showToast(data.message, data.type || 'info');
      setRidesState(getAllRides());
    });

    return () => {
      unsubRideUpdate();
      unsubBroadcast();
    };
  }, []);

  const switchUser = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    if (target) {
      setCurrUser(target);
      persistCurrentUser(target);
      showToast(`Switched active profile to ${target.name} (${target.hostel})`, 'info');
    }
  };

  const updateProfile = (updated: Partial<User>) => {
    const newUserData = { ...currentUser, ...updated };
    setCurrUser(newUserData);
    persistCurrentUser(newUserData);
    setUsers(getAllUsers());
    showToast('Profile updated successfully!', 'success');
  };

  const createRide = (newRideData: Partial<RidePool>): string => {
    const newId = `ride_pool_${Date.now()}`;
    const totalSeats = newRideData.totalSeats || 4;
    const initialSeatsOccupied = 1; // The host occupies 1 seat

    const completeRide: RidePool = {
      id: newId,
      hostId: currentUser.id,
      host: currentUser,
      origin: newRideData.origin || 'Main Campus Gate (North)',
      destination: newRideData.destination || 'Indira Gandhi Int\'l Airport (T3/T2)',
      pickupLandmark: newRideData.pickupLandmark || 'Near Gate Security',
      departureDate: newRideData.departureDate || new Date().toISOString().split('T')[0],
      departureTimeStart: newRideData.departureTimeStart || '06:00',
      departureTimeEnd: newRideData.departureTimeEnd || '06:30',
      totalSeats: totalSeats,
      availableSeats: Math.max(0, totalSeats - initialSeatsOccupied),
      vehicleType: newRideData.vehicleType || 'Cab (Sedan)',
      luggageCapacity: newRideData.luggageCapacity || 'Standard (1 Trolley/person)',
      femaleOnly: newRideData.femaleOnly || false,
      status: 'open',
      estimatedTotalFare: newRideData.estimatedTotalFare || 800,
      notes: newRideData.notes || '',
      createdAt: new Date().toISOString(),
      passengers: [
        {
          user: currentUser,
          joinedAt: new Date().toISOString(),
          status: 'confirmed',
          pickupNote: 'Host / Organizer',
        },
      ],
    };

    const updated = [completeRide, ...rides];
    setRidesState(updated);
    saveRides(updated);

    // Initial system chat message
    saveMessageForRide(newId, {
      id: `msg_${Date.now()}`,
      rideId: newId,
      senderId: 'sys',
      senderName: 'Campus Bot',
      text: `Ride pool created by ${currentUser.name}. Fellow students can now request to join.`,
      timestamp: 'Just now',
      isSystem: true,
    });

    realtimeSync.broadcast('RIDE_UPDATED', updated);
    realtimeSync.broadcast('PEER_ACTION', {
      message: `New ride pool to ${completeRide.destination} created by ${currentUser.name}!`,
      type: 'info',
    });

    showToast('Ride pool hosted successfully!', 'success');
    return newId;
  };

  const joinRide = (rideId: string, note: string = ''): { success: boolean; message: string } => {
    const ride = rides.find((r) => r.id === rideId);
    if (!ride) return { success: false, message: 'Ride not found' };

    // Check if already in
    const isAlreadyPassenger = ride.passengers.some((p) => p.user.id === currentUser.id);
    if (isAlreadyPassenger) {
      return { success: false, message: 'You have already joined this ride pool.' };
    }

    // Check gender restriction
    if (ride.femaleOnly && currentUser.gender !== 'female') {
      return {
        success: false,
        message: 'This ride pool is designated for female students only for safety reasons.',
      };
    }

    if (ride.availableSeats <= 0) {
      return { success: false, message: 'Sorry, this cab pool is currently full!' };
    }

    const updatedRide: RidePool = {
      ...ride,
      availableSeats: ride.availableSeats - 1,
      status: ride.availableSeats - 1 === 0 ? 'full' : 'open',
      passengers: [
        ...ride.passengers,
        {
          user: currentUser,
          joinedAt: new Date().toISOString(),
          status: 'confirmed',
          pickupNote: note || 'Co-passenger',
        },
      ],
    };

    const updatedRides = rides.map((r) => (r.id === rideId ? updatedRide : r));
    setRidesState(updatedRides);
    saveRides(updatedRides);

    // Post to chat
    saveMessageForRide(rideId, {
      id: `msg_${Date.now()}`,
      rideId: rideId,
      senderId: 'sys',
      senderName: 'System',
      text: `${currentUser.name} (${currentUser.hostel}) joined the ride! Seats remaining: ${updatedRide.availableSeats}`,
      timestamp: 'Just now',
      isSystem: true,
    });

    realtimeSync.broadcast('RIDE_UPDATED', updatedRides);
    realtimeSync.broadcast('PEER_ACTION', {
      message: `${currentUser.name} joined ride to ${ride.destination}!`,
      type: 'success',
    });

    showToast(`You have joined the ride to ${ride.destination}!`, 'success');
    return { success: true, message: 'Joined successfully' };
  };

  const leaveRide = (rideId: string) => {
    const ride = rides.find((r) => r.id === rideId);
    if (!ride) return;

    if (ride.hostId === currentUser.id) {
      // Host cancelling ride
      const updated = rides.filter((r) => r.id !== rideId);
      setRidesState(updated);
      saveRides(updated);
      realtimeSync.broadcast('RIDE_UPDATED', updated);
      showToast('You cancelled your hosted ride pool.', 'info');
      return;
    }

    const updatedRide: RidePool = {
      ...ride,
      availableSeats: ride.availableSeats + 1,
      status: 'open',
      passengers: ride.passengers.filter((p) => p.user.id !== currentUser.id),
    };

    const updatedRides = rides.map((r) => (r.id === rideId ? updatedRide : r));
    setRidesState(updatedRides);
    saveRides(updatedRides);

    saveMessageForRide(rideId, {
      id: `msg_${Date.now()}`,
      rideId: rideId,
      senderId: 'sys',
      senderName: 'System',
      text: `${currentUser.name} left the ride pool. 1 seat has opened up.`,
      timestamp: 'Just now',
      isSystem: true,
    });

    realtimeSync.broadcast('RIDE_UPDATED', updatedRides);
    showToast('You left the ride pool.', 'info');
  };

  const getRide = (rideId: string) => {
    return rides.find((r) => r.id === rideId);
  };

  const getRideMessages = (rideId: string) => {
    return getMessagesForRide(rideId);
  };

  const sendMessage = (rideId: string, text: string, quickType?: ChatMessage['quickActionType']) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      rideId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActionType: quickType,
    };
    saveMessageForRide(rideId, newMsg);
    realtimeSync.broadcast('MESSAGES_UPDATED', { rideId, message: newMsg });
  };

  // Demo simulator: simulates another student joining the given ride
  const simulatePeerJoin = (rideId: string) => {
    const ride = rides.find((r) => r.id === rideId);
    if (!ride || ride.availableSeats <= 0) {
      showToast('Cannot simulate: Ride is already full!', 'error');
      return;
    }

    // Pick a user who hasn't joined yet
    const candidate = allUsers.find(
      (u) => !ride.passengers.some((p) => p.user.id === u.id) && (!ride.femaleOnly || u.gender === 'female')
    );

    if (!candidate) {
      showToast('All sample peers have already joined!', 'info');
      return;
    }

    const updatedRide: RidePool = {
      ...ride,
      availableSeats: ride.availableSeats - 1,
      status: ride.availableSeats - 1 === 0 ? 'full' : 'open',
      passengers: [
        ...ride.passengers,
        {
          user: candidate,
          joinedAt: new Date().toISOString(),
          status: 'confirmed',
          pickupNote: 'Carrying 1 trolley bag',
        },
      ],
    };

    const updatedRides = rides.map((r) => (r.id === rideId ? updatedRide : r));
    setRidesState(updatedRides);
    saveRides(updatedRides);

    saveMessageForRide(rideId, {
      id: `msg_sim_${Date.now()}`,
      rideId,
      senderId: candidate.id,
      senderName: candidate.name,
      senderAvatar: candidate.avatar,
      text: `Hi all! Just joined. I will meet at the pickup point on time!`,
      timestamp: 'Just now',
    });

    realtimeSync.broadcast('RIDE_UPDATED', updatedRides);
    realtimeSync.broadcast('PEER_ACTION', {
      message: `[Simulated] ${candidate.name} joined ride to ${ride.destination}!`,
      type: 'success',
    });
    showToast(`Simulated: ${candidate.name} joined the ride!`, 'success');
  };

  const resetFilters = () => setFilters({});

  const resetAppStore = () => {
    resetToDefaults();
    setCurrUser(getCurrentUser());
    setUsers(getAllUsers());
    setRidesState(getAllRides());
    showToast('Reset data to default mock records!', 'info');
  };

  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      if (filters.destination && !ride.destination.toLowerCase().includes(filters.destination.toLowerCase())) {
        return false;
      }
      if (filters.origin && !ride.origin.toLowerCase().includes(filters.origin.toLowerCase())) {
        return false;
      }
      if (filters.date && ride.departureDate !== filters.date) {
        return false;
      }
      if (filters.femaleOnly && !ride.femaleOnly) {
        return false;
      }
      if (filters.vehicleType && ride.vehicleType !== filters.vehicleType) {
        return false;
      }
      if (filters.availableOnly && ride.availableSeats <= 0) {
        return false;
      }
      return true;
    });
  }, [rides, filters]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        switchUser,
        updateProfile,
        rides,
        filters,
        setFilters,
        resetFilters,
        filteredRides,
        createRide,
        joinRide,
        leaveRide,
        getRide,
        getRideMessages,
        sendMessage,
        activeTab,
        setActiveTab,
        selectedRideId,
        setSelectedRideId,
        activeChatRideId,
        setActiveChatRideId,
        toast,
        showToast,
        simulatePeerJoin,
        resetAppStore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
