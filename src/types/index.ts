export interface User {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  hostel: string;
  phone: string;
  gender: 'female' | 'male' | 'other';
  avatar: string;
  ridesCompleted: number;
  rating: number;
}

export interface CampusLocation {
  id: string;
  name: string;
  type: 'campus_gate' | 'hostel' | 'academic' | 'transit_hub' | 'airport' | 'railway';
  popular: boolean;
  shortCode?: string;
}

export type VehicleType = 'Cab (Sedan)' | 'Cab (SUV)' | 'Auto-Rickshaw' | 'Cab (Hatchback)';
export type LuggageCapacity = 'Light (Handbags/Backpacks)' | 'Standard (1 Trolley/person)' | 'Heavy (Multiple bags)';
export type RideStatus = 'open' | 'full' | 'departed' | 'completed' | 'cancelled';

export interface Passenger {
  user: User;
  joinedAt: string;
  status: 'confirmed' | 'pending';
  pickupNote?: string;
}

export interface RidePool {
  id: string;
  hostId: string;
  host: User;
  origin: string;
  destination: string;
  pickupLandmark?: string;
  departureDate: string; // YYYY-MM-DD
  departureTimeStart: string; // HH:mm
  departureTimeEnd: string; // HH:mm
  totalSeats: number;
  availableSeats: number;
  vehicleType: VehicleType;
  luggageCapacity: LuggageCapacity;
  femaleOnly: boolean;
  status: RideStatus;
  estimatedTotalFare: number;
  passengers: Passenger[];
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  rideId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  quickActionType?: 'cab_booked' | 'reached_gate' | 'fare_shared' | 'delay';
}

export interface FilterOptions {
  destination?: string;
  origin?: string;
  date?: string;
  femaleOnly?: boolean;
  vehicleType?: string;
  availableOnly?: boolean;
}
