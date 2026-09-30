# ShareACab 🚖 · Campus Cab Sharing Mobile Application

An offline-first, mobile-first ridesharing and cab pooling platform designed specifically for college and university campuses. Engineered with **Capacitor**, **React (Vite)**, and **TypeScript**.

Inspired by [devclub-iitd/ShareACab](https://github.com/devclub-iitd/ShareACab), this project reimagines campus ridesharing with a modern UI, zero external database setup friction, real-time multi-window peer synchronization, and integrated dynamic fare splitting.

---

## 📌 Problem Statement

During mid-semester breaks, end-term exams, and holiday departures:
1. **Severe Cab Shortage:** Cab aggregators (Uber, Ola, Rapido) face extreme surge pricing or no driver availability near campus.
2. **Expensive Solo Commutes:** Hundreds of students independently travel to identical transit hubs (IGI Airport, New Delhi Railway Station, ISBT Terminals), paying full solo fare.
3. **Safety for Late Night Travel:** Students (especially female peers) prefer traveling with verified college students rather than alone with unknown drivers.

---

## 🚀 Key Features

- **🎓 Verified Campus Identity:**
  - Integrated digital Student ID card with verified college roll number, hostel block, and photo badge.
- **🧭 Ride Discovery & Smart Filtering:**
  - Real-time ride pool cards showing origin, drop-off destination, departure time window, and vacancy status.
  - One-tap filters for transit hubs (Airport T3, NDLS, Anand Vihar ISBT).
  - **🛡️ "Female-Only" Safety Filter:** Option to view and organize women-only pools for safe travel during late hours.
- **➕ Host a Cab Pool:**
  - Campus pickup selector with custom gate/landmark input.
  - Vehicle selection: Sedan (4 seats), SUV (6 seats), Auto-Rickshaw (3 seats), Hatchback (3 seats).
  - Luggage allowances and departure time buffer.
- **💬 Real-Time In-Pool Coordination Chat:**
  - Dedicated chat channel for confirmed co-passengers.
  - One-tap quick coordination actions (*"Cab Booked: DL 01 AB 1234"*, *"Reached Main Gate"*, *"Running 5 mins late"*).
- **💰 Smart Fare & UPI Splitter:**
  - Dynamic calculator showing individual split vs solo fare, calculating net savings.
  - Direct deep-links to **Uber** and **Ola** apps.
  - One-tap UPI split request generator.
- **🚨 Campus Safety & SOS Hub:**
  - Direct dialers for Women's Helpline (1091), Campus North Gate Security Control Room, and National Emergency (112).
  - One-tap WhatsApp emergency ride tracking share.
- **⚡ Built-in Demo Evaluator Simulator:**
  - Test peer booking and seat countdowns on a single device or across two side-by-side browser windows in real-time.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 18 with TypeScript & Vite |
| **Mobile Runtime** | Capacitor 8 (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`) |
| **Styling** | Vanilla Modern CSS (Tailored HSL design system, Glassmorphism, Micro-animations) |
| **State & Persistence** | Offline-First LocalStorage Service with Repository pattern |
| **Realtime Sync** | Browser `BroadcastChannel` & cross-window storage synchronization |
| **Icons** | Lucide React |

---

## 💻 How to Run Locally

### 1. Web / Browser Mode (Fastest for testing & demos)

```bash
# Navigate to project
cd ShareaCab

# Start Vite development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

> **💡 Multi-Window Real-time Demo:**
> Open two browser windows side-by-side (Window A and Window B). In Window A, join a ride pool — Window B will update its seats, passenger list, and chat in real time without refreshing!

---

### 2. Android Studio / APK Build Mode

```bash
# Build production bundle
npm run build

# Sync web assets with Capacitor Android native container
npx cap sync

# Open project in Android Studio to build APK or run in Emulator / Phone
npx cap open android
```

---

## 📁 Project Architecture

```
ShareaCab/
├── android/                   # Generated native Android Gradle project
├── capacitor.config.ts         # Capacitor app configuration (ID: com.college.shareacab)
├── index.html                 # Mobile-first shell
├── src/
│   ├── components/            # Reusable UI widgets
│   │   ├── Header.tsx         # Header with quick user switcher, SOS & Fare Calc
│   │   ├── BottomNav.tsx      # iOS/Android style bottom navigation bar
│   │   ├── RideCard.tsx       # Interactive pool card with route visual
│   │   ├── FilterModal.tsx    # Destination & safety bottom sheet
│   │   ├── FareCalculatorModal.tsx # Dynamic fare & UPI split modal
│   │   └── SosModal.tsx       # Campus safety emergency hub
│   ├── context/
│   │   └── AppContext.tsx     # Global state, actions, and real-time listeners
│   ├── data/
│   │   ├── campusLocations.ts # Pre-seeded campus gates, hostels, transit hubs
│   │   └── mockData.ts        # Pre-seeded sample students and rides
│   ├── pages/
│   │   ├── ExplorePage.tsx    # Search & browse available pools
│   │   ├── CreateRidePage.tsx # Host a new cab pool
│   │   ├── RideDetailsModal.tsx # Full ride details, passenger list, join flow
│   │   ├── MyRidesPage.tsx    # Active bookings & environmental savings stats
│   │   ├── ChatPage.tsx       # In-pool coordination chat room
│   │   └── ProfilePage.tsx    # Digital Student ID & profile editor
│   ├── services/
│   │   ├── storageService.ts  # LocalStorage persistence layer
│   │   └── broadcastService.ts# Cross-tab realtime event dispatcher
│   ├── index.css              # Custom responsive mobile design system
│   ├── App.tsx                # Main application coordinator
│   └── main.tsx               # App bootstrap with AppProvider
└── package.json
```

---

## 🎯 Evaluator Demo Script (For Project Viva / Presentation)

When presenting to professors or judges:

1. **The Problem:** Explain how holidays cause cab shortages and how solo rides cost ₹800–₹1000 each.
2. **Student Identity:** Open the **Profile** tab to show the verified digital student ID card with hostel room, roll number, and ratings.
3. **Explore & Safety Filter:** Go to **Explore**, toggle the **"Female-Only"** filter to demonstrate campus safety.
4. **Live Booking Demo:** Open a ride (e.g., to Airport T3). Tap **"Simulate Join"** — show how the seat count drops and a new student peer is instantly added.
5. **Coordination Chat:** Tap **"Open Pool Chat"** — tap the quick action chip *"🚖 Cab Booked"* to show immediate in-app communication.
6. **Fare & Savings:** Tap the **"₹"** button in the header — demonstrate how ₹900 cab fare splits into ₹225/student, saving ₹675 per person.
