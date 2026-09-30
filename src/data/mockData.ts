import { User, RidePool, ChatMessage } from '../types';

export const USER_JOHN: User = {
  id: 'usr_john',
  name: 'John',
  email: 'john@campus.edu.in',
  rollNo: '2023CSB1001',
  hostel: 'Hostel Block A / Nilgiri',
  phone: '+91 98765 11001',
  gender: 'male',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  ridesCompleted: 14,
  rating: 4.9,
};

export const USER_JAISON: User = {
  id: 'usr_jaison',
  name: 'Jaison',
  email: 'jaison@campus.edu.in',
  rollNo: '2023EEB1042',
  hostel: 'Hostel Block B / Kailash',
  phone: '+91 98112 22002',
  gender: 'male',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  ridesCompleted: 11,
  rating: 5.0,
};

export const USER_MADHESH: User = {
  id: 'usr_madhesh',
  name: 'Madhesh',
  email: 'madhesh@campus.edu.in',
  rollNo: '2022MEB1078',
  hostel: 'Hostel Block C / Shivalik',
  phone: '+91 97234 33003',
  gender: 'male',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ridesCompleted: 9,
  rating: 4.8,
};

export const CURRENT_USER: User = USER_JOHN;

export const MOCK_USERS: User[] = [USER_JOHN, USER_JAISON, USER_MADHESH];

// Helper to get formatted dates relative to today
const getFutureDate = (daysAhead: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

export const INITIAL_RIDES: RidePool[] = [
  {
    id: 'ride_pool_101',
    hostId: 'usr_john',
    host: USER_JOHN,
    origin: 'Main Campus Gate (North)',
    destination: 'Indira Gandhi Int\'l Airport (T3/T2)',
    pickupLandmark: 'Near Security Checkpost',
    departureDate: getFutureDate(1),
    departureTimeStart: '06:00',
    departureTimeEnd: '06:30',
    totalSeats: 4,
    availableSeats: 2,
    vehicleType: 'Cab (Sedan)',
    luggageCapacity: 'Standard (1 Trolley/person)',
    femaleOnly: false,
    status: 'open',
    estimatedTotalFare: 920,
    notes: 'Heading to T3 for morning flight. Booking via Uber Premier. Two seats open!',
    createdAt: new Date().toISOString(),
    passengers: [
      {
        user: USER_JOHN,
        joinedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        status: 'confirmed',
        pickupNote: 'Host / Organizer',
      },
      {
        user: USER_JAISON,
        joinedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        status: 'confirmed',
        pickupNote: '1 trolley bag + backpack',
      },
    ],
  },
  {
    id: 'ride_pool_102',
    hostId: 'usr_jaison',
    host: USER_JAISON,
    origin: 'Hostel Block B / Kailash',
    destination: 'New Delhi Railway Station (NDLS)',
    pickupLandmark: 'Hostel Gate Porch',
    departureDate: getFutureDate(1),
    departureTimeStart: '14:30',
    departureTimeEnd: '15:00',
    totalSeats: 4,
    availableSeats: 2,
    vehicleType: 'Cab (Sedan)',
    luggageCapacity: 'Standard (1 Trolley/person)',
    femaleOnly: false,
    status: 'open',
    estimatedTotalFare: 680,
    notes: 'Boarding the 5:15 PM Shatabdi Express. Need to reach station by 4:00 PM.',
    createdAt: new Date().toISOString(),
    passengers: [
      {
        user: USER_JAISON,
        joinedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        status: 'confirmed',
        pickupNote: 'Host',
      },
      {
        user: USER_MADHESH,
        joinedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        status: 'confirmed',
        pickupNote: 'Platform 1 side entry',
      },
    ],
  },
  {
    id: 'ride_pool_103',
    hostId: 'usr_madhesh',
    host: USER_MADHESH,
    origin: 'Student Activity Center (SAC)',
    destination: 'Domestic Airport (T1)',
    pickupLandmark: 'SAC Porch near Cafeteria',
    departureDate: getFutureDate(2),
    departureTimeStart: '09:00',
    departureTimeEnd: '09:30',
    totalSeats: 4,
    availableSeats: 3,
    vehicleType: 'Cab (Sedan)',
    luggageCapacity: 'Standard (1 Trolley/person)',
    femaleOnly: false,
    status: 'open',
    estimatedTotalFare: 840,
    notes: 'Afternoon flight from T1. Split equally between co-riders.',
    createdAt: new Date().toISOString(),
    passengers: [
      {
        user: USER_MADHESH,
        joinedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: 'confirmed',
        pickupNote: 'Host',
      },
    ],
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  ride_pool_101: [
    {
      id: 'msg_01',
      rideId: 'ride_pool_101',
      senderId: 'usr_john',
      senderName: 'John',
      text: 'Hey Jaison! Thanks for joining. Are you set for the 6:00 AM pickup at Main Gate?',
      timestamp: '08:30 AM',
    },
    {
      id: 'msg_02',
      rideId: 'ride_pool_101',
      senderId: 'usr_jaison',
      senderName: 'Jaison',
      text: 'Yes John, packing is done. I will be at the gate by 5:55 AM.',
      timestamp: '08:35 AM',
    },
    {
      id: 'msg_03',
      rideId: 'ride_pool_101',
      senderId: 'usr_john',
      senderName: 'John',
      text: 'Awesome. We have 2 seats open if Madhesh or anyone else needs to head to T3 as well.',
      timestamp: '08:42 AM',
    },
  ],
  ride_pool_102: [
    {
      id: 'msg_11',
      rideId: 'ride_pool_102',
      senderId: 'usr_jaison',
      senderName: 'Jaison',
      text: 'Hi Madhesh, will book the cab once we are 15 mins out.',
      timestamp: 'Yesterday',
    },
    {
      id: 'msg_12',
      rideId: 'ride_pool_102',
      senderId: 'usr_madhesh',
      senderName: 'Madhesh',
      text: 'Sounds great Jaison! I will meet you at Kailash hostel gate.',
      timestamp: '10:15 AM',
    },
  ],
};
