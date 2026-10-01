import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  get,
  Database,
} from 'firebase/database';
import { RidePool, ChatMessage } from '../types';
import { INITIAL_RIDES, INITIAL_MESSAGES } from '../data/mockData';

// User's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnd-p7BmNkYQPTDY1aXnEghCm3VTgwq_U",
  authDomain: "shareacab-demo.firebaseapp.com",
  databaseURL: "https://shareacab-demo-default-rtdb.firebaseio.com",
  projectId: "shareacab-demo",
  storageBucket: "shareacab-demo.firebasestorage.app",
  messagingSenderId: "753594505402",
  appId: "1:753594505402:web:b584342010cd5cc465ca83",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db: Database = getDatabase(app);

// Seed initial rides if database is fresh
export const initFirebaseDatabase = async () => {
  try {
    const ridesRef = ref(db, 'rides');
    const snapshot = await get(ridesRef);
    if (!snapshot.exists()) {
      await set(ridesRef, INITIAL_RIDES);
      console.log('[Firebase] Seeded initial rides to Realtime Database');
    }

    // Seed initial messages
    for (const rideId of Object.keys(INITIAL_MESSAGES)) {
      const msgRef = ref(db, `messages/${rideId}`);
      const msgSnap = await get(msgRef);
      if (!msgSnap.exists()) {
        const msgs = INITIAL_MESSAGES[rideId];
        await set(msgRef, msgs);
      }
    }
  } catch (err) {
    console.warn('[Firebase] Database init note:', err);
  }
};

// Real-time listener for all rides across devices
export const subscribeToRides = (callback: (rides: RidePool[]) => void) => {
  const ridesRef = ref(db, 'rides');
  return onValue(ridesRef, (snapshot) => {
    if (snapshot.exists()) {
      const val = snapshot.val();
      const list: RidePool[] = Array.isArray(val) ? val : Object.values(val);
      callback(list);
    } else {
      // If empty, seed
      set(ridesRef, INITIAL_RIDES);
      callback(INITIAL_RIDES);
    }
  });
};

// Push updated rides to Firebase
export const updateRidesInFirebase = async (rides: RidePool[]) => {
  try {
    const ridesRef = ref(db, 'rides');
    await set(ridesRef, rides);
  } catch (err) {
    console.error('[Firebase] update rides error:', err);
  }
};

// Real-time listener for chat messages in a specific ride pool
export const subscribeToChatMessages = (
  rideId: string,
  callback: (messages: ChatMessage[]) => void
) => {
  const msgRef = ref(db, `messages/${rideId}`);
  return onValue(msgRef, (snapshot) => {
    if (snapshot.exists()) {
      const val = snapshot.val();
      const list: ChatMessage[] = Array.isArray(val) ? val : Object.values(val);
      callback(list);
    } else {
      callback([]);
    }
  });
};

// Send a new message to Firebase
export const sendChatMessageToFirebase = async (
  rideId: string,
  message: ChatMessage
) => {
  try {
    const msgRef = ref(db, `messages/${rideId}`);
    const snapshot = await get(msgRef);
    let currentMsgs: ChatMessage[] = [];
    if (snapshot.exists()) {
      const val = snapshot.val();
      currentMsgs = Array.isArray(val) ? val : Object.values(val);
    }
    const updated = [...currentMsgs, message];
    await set(msgRef, updated);
  } catch (err) {
    console.error('[Firebase] send message error:', err);
  }
};

export { app, db };
