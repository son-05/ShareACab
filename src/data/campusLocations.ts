import { CampusLocation } from '../types';

export const CAMPUS_ORIGINS: CampusLocation[] = [
  { id: 'gate_main', name: 'Main Campus Gate (North)', type: 'campus_gate', popular: true, shortCode: 'GATE-1' },
  { id: 'gate_south', name: 'South Gate (Hostel Side)', type: 'campus_gate', popular: true, shortCode: 'GATE-2' },
  { id: 'gate_west', name: 'West Gate (Metro Link)', type: 'campus_gate', popular: true, shortCode: 'GATE-3' },
  { id: 'hostel_nilgiri', name: 'Hostel Block A / Nilgiri', type: 'hostel', popular: false, shortCode: 'H-A' },
  { id: 'hostel_kailash', name: 'Hostel Block B / Kailash (Girls)', type: 'hostel', popular: true, shortCode: 'H-B' },
  { id: 'hostel_shivalik', name: 'Hostel Block C / Shivalik', type: 'hostel', popular: false, shortCode: 'H-C' },
  { id: 'hostel_himadri', name: 'Hostel Block D / Himadri (Girls)', type: 'hostel', popular: true, shortCode: 'H-D' },
  { id: 'student_center', name: 'Student Activity Center (SAC)', type: 'academic', popular: true, shortCode: 'SAC' },
  { id: 'central_library', name: 'Central Library Roundabout', type: 'academic', popular: false, shortCode: 'LIB' },
];

export const TRANSIT_DESTINATIONS: CampusLocation[] = [
  { id: 'dest_airport_t3', name: 'Indira Gandhi Int\'l Airport (T3/T2)', type: 'airport', popular: true, shortCode: 'IGI-T3' },
  { id: 'dest_airport_t1', name: 'Domestic Airport (T1)', type: 'airport', popular: true, shortCode: 'IGI-T1' },
  { id: 'dest_ndls', name: 'New Delhi Railway Station (NDLS)', type: 'railway', popular: true, shortCode: 'NDLS' },
  { id: 'dest_nizamuddin', name: 'Hazrat Nizamuddin Railway Station', type: 'railway', popular: true, shortCode: 'NZM' },
  { id: 'dest_old_delhi', name: 'Old Delhi Railway Station (DLI)', type: 'railway', popular: false, shortCode: 'DLI' },
  { id: 'dest_anand_vihar', name: 'Anand Vihar ISBT & Railway Terminal', type: 'transit_hub', popular: true, shortCode: 'ANVT' },
  { id: 'dest_kashmere_gate', name: 'Kashmere Gate ISBT', type: 'transit_hub', popular: false, shortCode: 'ISBT-KG' },
  { id: 'dest_cyber_hub', name: 'Cyber Hub / Metro Interchange', type: 'transit_hub', popular: true, shortCode: 'CYBER' },
];

export const VEHICLE_OPTIONS = [
  { id: 'sedan', name: 'Cab (Sedan)', capacity: 4, icon: 'Car', description: 'UberGo / Ola Prime Sedan (4 Seats)' },
  { id: 'suv', name: 'Cab (SUV / XL)', capacity: 6, icon: 'Truck', description: 'UberXL / Ertiga / Innova (6 Seats)' },
  { id: 'auto', name: 'Auto-Rickshaw', capacity: 3, icon: 'Zap', description: 'Budget local ride (3 Seats)' },
  { id: 'hatchback', name: 'Cab (Hatchback)', capacity: 3, icon: 'Car', description: 'Compact & economical (3 Seats)' },
];
