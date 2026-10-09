
 // GameOn Collective — GPS Lab data
 // Tracking started Sunday 27 September 2026.
 // Only verified performance values are entered.

 export const TRACKING_START = '2026-09-27';
 export const TOTAL_VESTS = 3;

 export const VEST_ASSIGNMENTS = {
   'marline-atieno': 1,
   'veronicah-nyambura': 2,
   'iddah-adhiambo': 3,
 };

 export const GPS_SESSIONS = [
   {
     title: 'Session 01 — GPS tracking session',
     date: '2026-09-27',
     detail: 'Mathare United Women FC · 3 athletes · 3 vests',
     status: 'completed',
   },
   {
     title: 'Session 02 — Mathare United Women vs Kayole Starlets',
     date: '2026-10-04',
     detail: 'Mathare United Women FC 1–1 Kayole Starlets FC · 3 athletes · 3 vests',
     status: 'completed',
   },
 ];

 export const GPS_METRICS = [
   { key: 'distance_km', label: 'Total distance', unit: 'km' },
   { key: 'max_speed_kmh', label: 'Max speed', unit: 'km/h' },
   { key: 'peak_accel_ms2', label: 'Peak acceleration', unit: 'm/s²' },
   { key: 'hsr_m', label: 'High-speed running', unit: 'm' },
   { key: 'sprints', label: 'Sprints', unit: '' },
   { key: 'accelerations', label: 'Accelerations', unit: '' },
   { key: 'decelerations', label: 'Decelerations', unit: '' },
   { key: 'workload', label: 'Player Load', unit: 'AU' },
   { key: 'duration_min', label: 'Session duration', unit: 'min' },
 ];

 const empty = () => ({
   distance_km: null,
   max_speed_kmh: null,
   peak_accel_ms2: null,
   hsr_m: null,
   sprints: null,
   accelerations: null,
   decelerations: null,
   workload: null,
   duration_min: null,
 });

 export const GPS_STATS = {
   'marline-atieno': {
     sessions: 2,
     latest: {
       ...empty(),
       distance_km: 7.82,
       max_speed_kmh: 26.27,
       peak_accel_ms2: 5.2,
       workload: 127.36,
     },
     season: {
       ...empty(),
       distance_km: 19.20,
       max_speed_kmh: 28.49,
       peak_accel_ms2: 5.2,
     },
   },

   'veronicah-nyambura': {
     sessions: 2,
     latest: {
       ...empty(),
       distance_km: 10.37,
       max_speed_kmh: 27.81,
       peak_accel_ms2: 4.9,
       workload: 239.45,
     },
     season: {
       ...empty(),
       distance_km: 23.85,
       max_speed_kmh: 27.81,
       peak_accel_ms2: 5.1,
     },
   },

   'iddah-adhiambo': {
     sessions: 2,
     latest: {
       ...empty(),
       distance_km: 5.18,
       max_speed_kmh: 27.94,
       peak_accel_ms2: 4.8,
       workload: 107.96,
     },
     season: {
       ...empty(),
       distance_km: 15.56,
       max_speed_kmh: 29.60,
       peak_accel_ms2: 5.7,
     },
   },
 };
