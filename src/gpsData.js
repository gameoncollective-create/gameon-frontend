
// GameOn Collective — GPS Lab data
// Tracking started Sunday 27 September 2026.
// Only verified performance values are entered.
// Unverified measurements remain null.

export const TRACKING_START = '2026-09-27';
export const TOTAL_VESTS = 3;

export const VEST_ASSIGNMENTS = {
  'marline-atieno': 1,
  'veronicah-nyambura': 2,
  'iddah-adhiambo': 3,
};

export const GPS_SESSIONS = [
  {
    title: 'Session 01 — Mathare United Women vs Kibera Soccer Women',
    date: '2026-09-27',
    detail: 'Mathare United Women FC vs Kibera Soccer Women · 3 athletes · 3 vests',
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

// Individual match records.
// Acceleration and deceleration counts reflect Titan's
// configured acceleration/deceleration zones.

export const GPS_SESSION_STATS = {
  '2026-09-27': {
    'marline-atieno': {
      ...empty(),
      distance_km: 11.38,
      max_speed_kmh: 28.49,
      peak_accel_ms2: 5.0,
      accelerations: 254,
      decelerations: 217,
      workload: 186.63,
    },
    'veronicah-nyambura': {
      ...empty(),
      distance_km: 13.48,
      max_speed_kmh: 27.51,
      peak_accel_ms2: 5.1,
      accelerations: 291,
      decelerations: 265,
      workload: 286.49,
    },
    'iddah-adhiambo': {
      ...empty(),
      distance_km: 10.38,
      max_speed_kmh: 29.60,
      peak_accel_ms2: 5.7,
      accelerations: 220,
      decelerations: 188,
      workload: 207.31,
    },
  },

  '2026-10-04': {
    'marline-atieno': {
      ...empty(),
      distance_km: 7.82,
      max_speed_kmh: 26.27,
      peak_accel_ms2: 5.2,
      workload: 127.36,
    },
    'veronicah-nyambura': {
      ...empty(),
      distance_km: 10.37,
      max_speed_kmh: 27.81,
      peak_accel_ms2: 4.9,
      workload: 239.45,
    },
    'iddah-adhiambo': {
      ...empty(),
      distance_km: 5.18,
      max_speed_kmh: 27.94,
      peak_accel_ms2: 4.8,
      workload: 107.96,
    },
  },
};

// Build the latest-session and season summaries
// from the individual match records.

const latestDate = '2026-10-04';
const sessionDates = Object.keys(GPS_SESSION_STATS).sort();

const athleteSlugs = Object.keys(VEST_ASSIGNMENTS);

const sumVerified = (records, key) => {
  const values = records
    .map((record) => record[key])
    .filter((value) => typeof value === 'number');

  // Do not present a partial total as a complete total.
  if (values.length !== records.length) return null;

  return values.reduce((total, value) => total + value, 0);
};

const maxVerified = (records, key) => {
  const values = records
    .map((record) => record[key])
    .filter((value) => typeof value === 'number');

  if (values.length !== records.length) return null;

  return Math.max(...values);
};

export const GPS_STATS = Object.fromEntries(
  athleteSlugs.map((slug) => {
    const records = sessionDates
      .map((date) => GPS_SESSION_STATS[date][slug])
      .filter(Boolean);

    return [
      slug,
      {
        sessions: records.length,

        latest: {
          ...empty(),
          ...GPS_SESSION_STATS[latestDate][slug],
        },

        season: {
          ...empty(),

          distance_km: Number(
            sumVerified(records, 'distance_km')?.toFixed(2)
          ),

          max_speed_kmh: maxVerified(records, 'max_speed_kmh'),

          peak_accel_ms2: maxVerified(records, 'peak_accel_ms2'),

          hsr_m: sumVerified(records, 'hsr_m'),
          sprints: sumVerified(records, 'sprints'),
          accelerations: sumVerified(records, 'accelerations'),
          decelerations: sumVerified(records, 'decelerations'),

          // Player Load is intentionally left blank in the
          // season summary until we decide how to present it.
          workload: null,

          duration_min: sumVerified(records, 'duration_min'),
        },
      },
    ];
  })
);
