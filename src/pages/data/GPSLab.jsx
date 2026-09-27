import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ATHLETES } from '../../athletesData.js';
import {
  TRACKING_START, TOTAL_VESTS, VEST_ASSIGNMENTS,
  GPS_SESSIONS, GPS_METRICS, GPS_STATS,
} from '../../gpsData.js';
import FallbackImage from '../../components/FallbackImage.jsx';

// Today's date in Nairobi as YYYY-MM-DD, so the countdown flips at local midnight.
function todayNairobi() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Nairobi' }).format(new Date());
}

function daysUntil(iso) {
  const a = Date.parse(todayNairobi() + 'T00:00:00Z');
  const b = Date.parse(iso + 'T00:00:00Z');
  return Math.round((b - a) / 86400000);
}

function prettyDate(iso, opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });
}

function fmt(v, unit) {
  if (v === null || v === undefined || v === '') return '—';
  return unit ? `${v} ${unit}` : String(v);
}

function lastName(a) {
  return a.name.replace(a.firstName, '').trim() || a.name;
}

export default function GPSLab() {
  const athletes = ATHLETES.filter(a => VEST_ASSIGNMENTS[a.slug]);
  const [slug, setSlug] = useState(athletes[0]?.slug);
  const athlete = athletes.find(a => a.slug === slug) || athletes[0];

  const days = daysUntil(TRACKING_START);
  const completed = GPS_SESSIONS.filter(s => s.status === 'completed').length;
  const live = days <= 0 || completed > 0;

  const countdown =
    completed > 0 ? `${completed} session${completed > 1 ? 's' : ''} recorded`
    : days > 1 ? `Starts in ${days} days`
    : days === 1 ? 'Starts tomorrow'
    : 'Starts today';

  const stats = GPS_STATS[athlete?.slug] || { sessions: 0, latest: {}, season: {} };
  const hasData = stats.sessions > 0;

  return (
    <>
      {/* ---------- HERO ---------- */}
      <div className="gps-hero">
        <div className="eyebrow">GPS Lab · Powered by Titan</div>
        <h2 style={{ fontSize: 'clamp(2rem,4.4vw,3rem)', margin: '14px 0' }}>
          {live ? 'GPS tracking is live' : `GPS tracking starts ${prettyDate(TRACKING_START, { day: 'numeric', month: 'long' })}`}
        </h2>
        <p style={{ color: 'var(--text-dim)', maxWidth: '60ch' }}>
          {TOTAL_VESTS} Titan vests, {athletes.length} athletes. Distance covered, top speed, sprints and work rate
          captured every session, and made visible to scouts and coaches as the program grows.
        </p>
        <div className="gps-hero-stats">
          <div><b>{TOTAL_VESTS}</b><span>Vests</span></div>
          <div><b>{athletes.length}</b><span>Athletes</span></div>
          <div><b>{completed}</b><span>Sessions recorded</span></div>
        </div>
        <span className="gps-countdown">
          <i className={live ? 'dot live' : 'dot'} />
          {countdown}
        </span>
      </div>

      {/* ---------- ATHLETE PICKER ---------- */}
      <div className="section-head"><h2 style={{ fontSize: '1.6rem' }}>Athletes on the vests</h2></div>
      <div className="gps-picker" role="tablist" aria-label="Choose an athlete">
        {athletes.map(a => (
          <button
            key={a.slug}
            role="tab"
            aria-selected={a.slug === athlete.slug}
            className={'gps-pick' + (a.slug === athlete.slug ? ' active' : '')}
            onClick={() => setSlug(a.slug)}
          >
            <span className="gps-pick-photo">
              <FallbackImage src={a.photo} alt="" />
            </span>
            <span className="gps-pick-text">
              <b>{a.name}</b>
              <small>{a.position} · Vest {VEST_ASSIGNMENTS[a.slug]}</small>
            </span>
          </button>
        ))}
      </div>

      {/* ---------- PROFILE BANNER ---------- */}
      {athlete && (
        <>
          <div className="gps-banner">
            <div className="gps-banner-num" aria-hidden="true">{athlete.number}</div>
            <div className="gps-banner-copy">
              <div className="gps-banner-first">{athlete.firstName}</div>
              <div className="gps-banner-last">{lastName(athlete)}</div>
              <div className="gps-banner-meta">
                <span>{athlete.club}</span>
                <span>{athlete.position}</span>
                <span>#{athlete.number}</span>
              </div>
              <div className="gps-banner-actions">
                <span className="gps-vest-pill">Vest {VEST_ASSIGNMENTS[athlete.slug]}</span>
                <Link to={`/athletes/${athlete.slug}`} className="gps-outline-btn">Full profile →</Link>
              </div>
            </div>
            <div className="gps-banner-photo">
              <FallbackImage src={athlete.photo} alt={athlete.name} />
            </div>
          </div>

          {/* ---------- STATISTICS ---------- */}
          <div className="gps-stats">
            <div>
              <h3 className="gps-stats-title">Latest session</h3>
              {!hasData && (
                <p className="gps-note">
                  First numbers land after Session 01 on {prettyDate(TRACKING_START, { weekday: 'long', day: 'numeric', month: 'long' })}.
                </p>
              )}
              <div className="gps-metric-grid">
                {GPS_METRICS.map(m => (
                  <div className="gps-metric" key={m.key}>
                    <span>{m.label}</span>
                    <b className={hasData ? '' : 'muted'}>{fmt(stats.latest?.[m.key], m.unit)}</b>
                  </div>
                ))}
              </div>
            </div>

            <div className="gps-season">
              <h3 className="gps-stats-title">2026 season</h3>
              <div className="gps-season-row"><span>Sessions tracked</span><b>{stats.sessions}</b></div>
              {GPS_METRICS.filter(m => m.key !== 'duration_min').map(m => (
                <div className="gps-season-row" key={m.key}>
                  <span>{m.key === 'max_speed_kmh' ? 'Top speed (best)' : `${m.label} (total)`}</span>
                  <b className={hasData ? '' : 'muted'}>{fmt(stats.season?.[m.key], m.unit)}</b>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="gps-stripe" aria-hidden="true" />

      {/* ---------- SESSIONS ---------- */}
      <div className="section-head"><h2 style={{ fontSize: '1.6rem' }}>Sessions</h2></div>
      <div>
        {GPS_SESSIONS.length ? GPS_SESSIONS.map((s, i) => {
          const d = daysUntil(s.date);
          const label = s.status === 'completed' ? 'Completed'
            : d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : d > 1 ? 'Upcoming' : 'Awaiting data';
          return (
            <div className="panel gps-session" key={i}>
              <div className="gps-session-date">
                <b>{prettyDate(s.date, { day: 'numeric' })}</b>
                <span>{prettyDate(s.date, { month: 'short' })}</span>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 600 }}>{s.title}</div>
                <div className="gps-session-sub">{prettyDate(s.date)} · {s.detail}</div>
              </div>
              <span className="status-chip">{label}</span>
            </div>
          );
        }) : <div className="empty-state">No sessions scheduled yet.</div>}
      </div>
    </>
  );
}
