
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ATHLETES } from '../../athletesData.js';
import {
  TRACKING_START,
  TOTAL_VESTS,
  VEST_ASSIGNMENTS,
  GPS_SESSIONS,
  GPS_METRICS,
  GPS_STATS,
  GPS_SESSION_STATS,
} from '../../gpsData.js';
import FallbackImage from '../../components/FallbackImage.jsx';

// Today's date in Nairobi.
function todayNairobi() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Nairobi',
  }).format(new Date());
}

function daysUntil(iso) {
  const a = Date.parse(todayNairobi() + 'T00:00:00Z');
  const b = Date.parse(iso + 'T00:00:00Z');
  return Math.round((b - a) / 86400000);
}

function prettyDate(
  iso,
  opts = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString(
    'en-GB',
    {
      ...opts,
      timeZone: 'UTC',
    }
  );
}

function fmt(value, unit) {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    !Number.isFinite(Number(value))
  ) {
    return '—';
  }

  const display =
    typeof value === 'number'
      ? Number(value.toFixed(2))
      : value;

  return unit ? `${display} ${unit}` : String(display);
}

function lastName(athlete) {
  return (
    athlete.name.replace(athlete.firstName, '').trim() ||
    athlete.name
  );
}

function seasonLabel(metric) {
  if (metric.key === 'max_speed_kmh') {
    return 'Top speed (best)';
  }

  if (metric.key === 'peak_accel_ms2') {
    return 'Peak acceleration (best)';
  }

  if (metric.key === 'workload') {
    return 'Total Player Load';
  }

  return `${metric.label} (total)`;
}

const SUM_METRICS = [
  'distance_km',
  'hsr_m',
  'sprints',
  'accelerations',
  'decelerations',
  'workload',
  'duration_min',
];

const MAX_METRICS = [
  'max_speed_kmh',
  'peak_accel_ms2',
];

// Only calculate a total when every recorded match
// has a verified value for that metric.
function combinedStats(slug) {
  const records = GPS_SESSIONS
    .filter(session => session.status === 'completed')
    .map(session => GPS_SESSION_STATS[session.date]?.[slug])
    .filter(Boolean);

  const result = {};

  GPS_METRICS.forEach(metric => {
    const values = records.map(record => record[metric.key]);

    const complete =
      records.length > 0 &&
      values.every(
        value =>
          typeof value === 'number' &&
          Number.isFinite(value)
      );

    if (!complete) {
      result[metric.key] = null;
      return;
    }

    if (SUM_METRICS.includes(metric.key)) {
      result[metric.key] = Number(
        values
          .reduce((sum, value) => sum + value, 0)
          .toFixed(2)
      );
    } else if (MAX_METRICS.includes(metric.key)) {
      result[metric.key] = Math.max(...values);
    } else {
      result[metric.key] = null;
    }
  });

  return result;
}

export default function GPSLab() {
  const athletes = ATHLETES.filter(
    athlete => VEST_ASSIGNMENTS[athlete.slug]
  );

  const [slug, setSlug] = useState(athletes[0]?.slug);

  // The newest match is selected when the page opens.
  const completedSessions = GPS_SESSIONS
    .filter(session => session.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date));

  const newestDate = completedSessions[0]?.date || 'all';

  const [selectedMatch, setSelectedMatch] = useState(
    newestDate
  );

  const athlete =
    athletes.find(a => a.slug === slug) || athletes[0];

  const days = daysUntil(TRACKING_START);
  const completed = completedSessions.length;
  const hasStarted = days <= 0 || completed > 0;

  const countdown =
    completed > 0
      ? `${completed} session${completed > 1 ? 's' : ''} recorded`
      : days > 1
        ? `Starts in ${days} days`
        : days === 1
          ? 'Starts tomorrow'
          : 'Starts today';

  const stats = GPS_STATS[athlete?.slug] || {
    sessions: 0,
    latest: {},
    season: {},
  };

  const hasData = stats.sessions > 0;

  const isAllMatches = selectedMatch === 'all';

  const activeSession = GPS_SESSIONS.find(
    session => session.date === selectedMatch
  );

  const displayedStats = athlete
    ? isAllMatches
      ? combinedStats(athlete.slug)
      : GPS_SESSION_STATS[selectedMatch]?.[athlete.slug] || {}
    : {};

  const statsTitle = isAllMatches
    ? 'All matches — combined statistics'
    : activeSession
      ? `Match statistics — ${prettyDate(
          activeSession.date,
          { day: 'numeric', month: 'long', year: 'numeric' }
        )}`
      : 'Match statistics';

  return (
    <>
      {/* ---------- HERO ---------- */}
      <div className="gps-hero">
        <div className="eyebrow">
          GameOn Collective · GPS Lab
        </div>

        <h2
          style={{
            fontSize: 'clamp(2rem,4.4vw,3rem)',
            margin: '14px 0',
          }}
        >
          {hasStarted
            ? 'GPS tracking is active'
            : `GPS tracking starts ${prettyDate(
                TRACKING_START,
                { day: 'numeric', month: 'long' }
              )}`}
        </h2>

        <p
          style={{
            color: 'var(--text-dim)',
            maxWidth: '60ch',
          }}
        >
          {TOTAL_VESTS} GPS vests, {athletes.length} athletes.
          Distance covered, top speed and performance data
          captured during matches and made visible to scouts
          and coaches as the program grows.
        </p>

        <div className="gps-hero-stats">
          <div>
            <b>{TOTAL_VESTS}</b>
            <span>GPS vests</span>
          </div>

          <div>
            <b>{athletes.length}</b>
            <span>Athletes</span>
          </div>

          <div>
            <b>{completed}</b>
            <span>Sessions recorded</span>
          </div>
        </div>

        <span className="gps-countdown">
          <i
            className={
              hasStarted ? 'dot live' : 'dot'
            }
          />
          {countdown}
        </span>
      </div>

      {/* ---------- ATHLETE PICKER ---------- */}
      <div className="section-head">
        <h2 style={{ fontSize: '1.6rem' }}>
          Tracked athletes
        </h2>
      </div>

      <div
        className="gps-picker"
        role="tablist"
        aria-label="Choose an athlete"
      >
        {athletes.map(a => (
          <button
            key={a.slug}
            type="button"
            role="tab"
            aria-selected={a.slug === athlete?.slug}
            className={
              'gps-pick' +
              (a.slug === athlete?.slug ? ' active' : '')
            }
            onClick={() => setSlug(a.slug)}
          >
            <span className="gps-pick-photo">
              <FallbackImage src={a.photo} alt="" />
            </span>

            <span className="gps-pick-text">
              <b>{a.name}</b>
              <small>
                {a.position} · Vest{' '}
                {VEST_ASSIGNMENTS[a.slug]}
              </small>
            </span>
          </button>
        ))}
      </div>

      {/* ---------- ATHLETE PROFILE ---------- */}
      {athlete && (
        <>
          <div className="gps-banner">
            <div
              className="gps-banner-num"
              aria-hidden="true"
            >
              {athlete.number}
            </div>

            <div className="gps-banner-copy">
              <div className="gps-banner-first">
                {athlete.firstName}
              </div>

              <div className="gps-banner-last">
                {lastName(athlete)}
              </div>

              <div className="gps-banner-meta">
                <span>{athlete.club}</span>
                <span>{athlete.position}</span>
                <span>#{athlete.number}</span>
              </div>

              <div className="gps-banner-actions">
                <span className="gps-vest-pill">
                  Vest {VEST_ASSIGNMENTS[athlete.slug]}
                </span>

                <Link
                  to={`/athletes/${athlete.slug}`}
                  className="gps-outline-btn"
                >
                  Full profile →
                </Link>
              </div>
            </div>

            <div className="gps-banner-photo">
              <FallbackImage
                src={athlete.photo}
                alt={athlete.name}
              />
            </div>
          </div>

          {/* ---------- MATCH SELECTOR ---------- */}
          <div
            style={{
              margin: '28px 0 24px',
              padding: '22px',
              background: 'var(--surface, #0c2940)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-dim)',
                marginBottom: '12px',
              }}
            >
              Select match or season summary
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              {GPS_SESSIONS
                .filter(s => s.status === 'completed')
                .map(session => {
                  const active =
                    selectedMatch === session.date;

                  return (
                    <button
                      key={session.date}
                      type="button"
                      onClick={() =>
                        setSelectedMatch(session.date)
                      }
                      aria-pressed={active}
                      style={{
                        cursor: 'pointer',
                        padding: '11px 16px',
                        borderRadius: '7px',
                        border: active
                          ? '1px solid #00d5c5'
                          : '1px solid rgba(255,255,255,0.2)',
                        background: active
                          ? '#00d5c5'
                          : 'transparent',
                        color: active
                          ? '#001a22'
                          : '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                      }}
                    >
                      {prettyDate(session.date, {
                        day: 'numeric',
                        month: 'short',
                      })}
                      {' · '}
                      {session.title
                        .replace(/^Session \d+ — /, '')}
                    </button>
                  );
                })}

              <button
                type="button"
                onClick={() => setSelectedMatch('all')}
                aria-pressed={isAllMatches}
                style={{
                  cursor: 'pointer',
                  padding: '11px 16px',
                  borderRadius: '7px',
                  border: isAllMatches
                    ? '1px solid #00d5c5'
                    : '1px solid rgba(255,255,255,0.2)',
                  background: isAllMatches
                    ? '#00d5c5'
                    : 'transparent',
                  color: isAllMatches
                    ? '#001a22'
                    : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                All Matches
              </button>
            </div>

            <p
              style={{
                color: 'var(--text-dim)',
                fontSize: '0.82rem',
                margin: '14px 0 0',
              }}
            >
              {isAllMatches
                ? 'Combined performance across all recorded matches. Distances and workloads are summed; top speed and peak acceleration show the best recorded values.'
                : activeSession?.detail}
            </p>
          </div>

          {/* ---------- STATISTICS ---------- */}
          <div className="gps-stats">
            <div>
              <h3 className="gps-stats-title">
                {statsTitle}
              </h3>

              {!hasData && (
                <p className="gps-note">
                  Performance data will appear here after
                  the athlete's first recorded GPS session.
                </p>
              )}

              <div className="gps-metric-grid">
                {GPS_METRICS.map(metric => (
                  <div
                    className="gps-metric"
                    key={metric.key}
                  >
                    <span>
                      {isAllMatches
                        ? seasonLabel(metric)
                        : metric.label}
                    </span>

                    <b
                      className={
                        hasData ? '' : 'muted'
                      }
                    >
                      {fmt(
                        displayedStats[metric.key],
                        metric.unit
                      )}
                    </b>
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--text-dim)',
                  marginTop: '14px',
                }}
              >
                — indicates a measurement that has not
                been verified for the selected period.
                Acceleration and deceleration counts use
                Titan's configured zones.
              </p>
            </div>

            {/* ---------- SEASON SUMMARY ---------- */}
            <div className="gps-season">
              <h3 className="gps-stats-title">
                2026 season
              </h3>

              <div className="gps-season-row">
                <span>Sessions tracked</span>
                <b>{stats.sessions}</b>
              </div>

              {GPS_METRICS
                .filter(m => m.key !== 'duration_min')
                .map(metric => (
                  <div
                    className="gps-season-row"
                    key={metric.key}
                  >
                    <span>{seasonLabel(metric)}</span>

                    <b className={hasData ? '' : 'muted'}>
                      {fmt(
                        combinedStats(athlete.slug)[
                          metric.key
                        ],
                        metric.unit
                      )}
                    </b>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      <div className="gps-stripe" aria-hidden="true" />

      {/* ---------- MATCH HISTORY ---------- */}
      <div className="section-head">
        <h2 style={{ fontSize: '1.6rem' }}>
          Sessions
        </h2>
      </div>

      <div>
        {GPS_SESSIONS.length ? (
          GPS_SESSIONS.map((session, index) => {
            const d = daysUntil(session.date);

            const label =
              session.status === 'completed'
                ? 'Completed'
                : d === 0
                  ? 'Today'
                  : d === 1
                    ? 'Tomorrow'
                    : d > 1
                      ? 'Upcoming'
                      : 'Awaiting data';

            const active =
              selectedMatch === session.date;

            return (
              <button
                key={session.date || index}
                type="button"
                onClick={() => {
                  if (session.status === 'completed') {
                    setSelectedMatch(session.date);

                    document
                      .querySelector('.gps-stats')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                  }
                }}
                disabled={
                  session.status !== 'completed'
                }
                className="panel gps-session"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  cursor:
                    session.status === 'completed'
                      ? 'pointer'
                      : 'default',
                  border: active
                    ? '1px solid #00d5c5'
                    : undefined,
                  color: 'inherit',
                  fontFamily: 'inherit',
                }}
              >
                <div className="gps-session-date">
                  <b>
                    {prettyDate(session.date, {
                      day: 'numeric',
                    })}
                  </b>

                  <span>
                    {prettyDate(session.date, {
                      month: 'short',
                    })}
                  </span>
                </div>

                <div
                  style={{
                    flex: 1,
                    minWidth: 200,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>
                    {session.title}
                  </div>

                  <div className="gps-session-sub">
                    {prettyDate(session.date)} ·{' '}
                    {session.detail}
                  </div>
                </div>

                <span className="status-chip">
                  {label}
                </span>
              </button>
            );
          })
        ) : (
          <div className="empty-state">
            No sessions recorded yet.
          </div>
        )}
      </div>
    </>
  );
}
