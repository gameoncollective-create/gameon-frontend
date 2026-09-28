// GPS Lab data — Titan by Hudl.
// Tracking kicks off Sunday 27 September 2026 with 3 vests.
//
// HOW TO UPDATE AFTER A SESSION
// 1. Add the session to GPS_SESSIONS (status: 'completed').
// 2. Fill in the athlete's numbers in GPS_STATS under `latest`
//    (last session) and `season` (season totals / bests).
//    Any metric left as null shows as "—" on the site.
 
export const TRACKING_START = '2026-09-27'; // YYYY-MM-DD, Nairobi time
export const TOTAL_VESTS = 3;
 
// Vest assignment for each athlete (slug from athletesData.js).
export const VEST_ASSIGNMENTS = {
  'marline-atieno': 1,
  'veronicah-nyambura': 2,
  'iddah-adhiambo': 3,
};
 
export const GPS_SESSIONS = [
  {
    title: 'Session 01 — First GPS tracking session',
    date: '2026-09-27',
    detail: 'Mathare United Women FC · 3 athletes · 3 vests',
    status: 'scheduled', // scheduled | completed
  },
];
 
// Metrics captured by Titan. `key` matches the fields in GPS_STATS.
export const GPS_METRICS = [
  { key: 'distance_km',     label: 'Total distance',      unit: 'km' },
  { key: 'max_speed_kmh',   label: 'Max speed',           unit: 'km/h' },
  { key: 'hsr_m',           label: 'High-speed running',  unit: 'm' },
  { key: 'sprints',         label: 'Sprints',             unit: '' },
  { key: 'accelerations',   label: 'Accelerations',       unit: '' },
  { key: 'decelerations',   label: 'Decelerations',       unit: '' },
  { key: 'workload',        label: 'Workload',            unit: 'AU' },
  { key: 'duration_min',    label: 'Session duration',    unit: 'min' },
];
 
const empty = () => ({
  distance_km: null, max_speed_kmh: null, hsr_m: null, sprints: null,
  accelerations: null, decelerations: null, workload: null, duration_min: null,
});
 
export const GPS_STATS = {
  'marline-atieno':     { sessions: 0, latest: empty(), season: empty() },
  'veronicah-nyambura': { sessions: 0, latest: empty(), season: empty() },
  'iddah-adhiambo':     { sessions: 0, latest: empty(), season: empty() },
};
