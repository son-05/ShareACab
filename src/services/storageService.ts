import { User, RidePool, ChatMessage } from '../types';
import { CURRENT_USER, MOCK_USERS, INITIAL_RIDES, INITIAL_MESSAGES } from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'shareacab_current_user_v2',
  USERS: 'shareacab_users_v2',
  RIDES: 'shareacab_rides_v2',
  MESSAGES: 'shareacab_messages_v2',
};

const ALLOWED_USER_IDS = new Set(['usr_john', 'usr_jaison', 'usr_madhesh']);

// Initialize default storage with validation for the 3 allowed profiles
export const initStorage = () => {
  // Check if users exist and conform strictly to the 3 profiles: John, Jaison, Madhesh
  let needReset = false;
  const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!rawUsers) {
    needReset = true;
  } else {
    try {
      const parsed: User[] = JSON.parse(rawUsers);
      if (!Array.isArray(parsed) || parsed.length !== 3 || parsed.some((u) => !ALLOWED_USER_IDS.has(u.id))) {
        needReset = true;
      }
    } catch {
      needReset = true;
    }
  }

  if (needReset) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(CURRENT_USER));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
    localStorage.setItem(STORAGE_KEYS.RIDES, JSON.stringify(INITIAL_RIDES));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    return;
  }

  // Ensure current user is valid
  try {
    const rawCurrent = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!rawCurrent || !ALLOWED_USER_IDS.has(JSON.parse(rawCurrent).id)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(CURRENT_USER));
    }
  } catch {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(CURRENT_USER));
  }

  if (!localStorage.getItem(STORAGE_KEYS.RIDES)) {
    localStorage.setItem(STORAGE_KEYS.RIDES, JSON.stringify(INITIAL_RIDES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
  }
};

export const getCurrentUser = (): User => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      const user = JSON.parse(raw);
      if (ALLOWED_USER_IDS.has(user.id)) {
        return user;
      }
    }
    return CURRENT_USER;
  } catch {
    return CURRENT_USER;
  }
};

export const setCurrentUser = (user: User): void => {
  if (!ALLOWED_USER_IDS.has(user.id)) return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  // Also update in all users list
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getAllUsers = (): User[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (raw) {
      const parsed: User[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every((u) => ALLOWED_USER_IDS.has(u.id))) {
        return parsed;
      }
    }
    return MOCK_USERS;
  } catch {
    return MOCK_USERS;
  }
};

export const getAllRides = (): RidePool[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RIDES);
    return raw ? JSON.parse(raw) : INITIAL_RIDES;
  } catch {
    return INITIAL_RIDES;
  }
};

export const saveRides = (rides: RidePool[]): void => {
  localStorage.setItem(STORAGE_KEYS.RIDES, JSON.stringify(rides));
};

export const getRideById = (id: string): RidePool | undefined => {
  const rides = getAllRides();
  return rides.find((r) => r.id === id);
};

export const getMessagesForRide = (rideId: string): ChatMessage[] => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const all = raw ? JSON.parse(raw) : INITIAL_MESSAGES;
    return all[rideId] || [];
  } catch {
    return [];
  }
};

export const saveMessageForRide = (rideId: string, message: ChatMessage): void => {
  initStorage();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const all: Record<string, ChatMessage[]> = raw ? JSON.parse(raw) : INITIAL_MESSAGES;
    if (!all[rideId]) {
      all[rideId] = [];
    }
    all[rideId].push(message);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
  } catch (err) {
    console.error('Error saving message', err);
  }
};

export const resetToDefaults = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.RIDES);
  localStorage.removeItem(STORAGE_KEYS.MESSAGES);
  initStorage();
};
