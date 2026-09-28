// GameOn Collective — GPS Lab data
// Tracking started Sunday 27 September 2026.
//
// Only verified performance values are entered.
// Metrics not yet available remain null and display as "—".

export const TRACKING_START = '2026-09-27';
export const TOTAL_VESTS = 3;

// Vest assignment for each athlete.
// Slugs must match athletesData.js.
export const VEST_ASSIGNMENTS = {
  'marline-atieno': 1,
  'veronicah-nyambura': 2,
  'iddah-adhiambo': 3,
};

// GPS tracking sessions.
export const GPS_SESSIONS = [
  {
    title: 'Session 01 — GPS tracking session',
    date: '2026-09-27',
    detail: 'Mathare United Women FC · 3 athletes · 3 vests',
    status: 'completed',
  },
];

// Performance metrics displayed in the GPS Lab.
export const GPS_METRICS = [
  { key: 'distance_km', label: 'Total distance', unit: 'km' },
  { key: 'max_speed_kmh', label: 'Max speed', unit: 'km/h' },
  { key: 'peak_accel_ms2', label: 'Peak acceleration', unit: 'm/s²' },
  { key: 'hsr_m', label: 'High-speed running', unit: 'm' },
  { key: 'sprints', label: 'Sprints', unit: '' },
  { key: 'accelerations', label: 'Accelerations', unit: '' },
  { key: 'decelerations', label: 'Decelerations', unit: '' },
  { key: 'workload', label: 'Workload', unit: 'AU' },
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

// Verified GPS results from Session 01 — 27 September 2026.
export const GPS_STATS = {
  'marline-atieno': {
    sessions: 1,
    latest: {
      ...empty(),
      distance_km: 11.38,
      max_speed_kmh: 28.49,
      peak_accel_ms2: 5.0,
    },
    season: {
      ...empty(),
      distance_km: 11.38,
      max_speed_kmh: 28.49,
      peak_accel_ms2: 5.0,
    },
  },

  'veronicah-nyambura': {
    sessions: 1,
    latest: {
      ...empty(),
      distance_km: 13.48,
      max_speed_kmh: 27.51,
      peak_accel_ms2: 5.1,
    },
    season: {
      ...empty(),
      distance_km: 13.48,
      max_speed_kmh: 27.51,
      peak_accel_ms2: 5.1,
    },
  },

  'iddah-adhiambo': {
    sessions: 1,
    latest: {
      ...empty(),
      distance_km: 10.38,
      max_speed_kmh: 29.6,
      peak_accel_ms2: 5.7,
    },
    season: {
      ...empty(),
      distance_km: 10.38,
      max_speed_kmh: 29.6,
      peak_accel_ms2: 5.7,
    },
  },
};
