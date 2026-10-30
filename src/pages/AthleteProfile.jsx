import { Link, useParams } from 'react-router-dom';
import { ATHLETES } from '../athletesData.js';
import { GPS_SESSIONS, GPS_SESSION_STATS } from '../gpsData.js';
import FallbackImage from '../components/FallbackImage.jsx';

// Profile page for each GameOn athlete: /athletes/<slug>
//
// Every section only appears when it has real data, so nothing shows as
// "coming soon" or blank. To fill a profile, add the details to
// src/athletesData.js (hometown, height, story, quote, achievements,
// goals, instagram, tiktok). GPS numbers come from src/gpsData.js and
// update automatically after each match.

const lastName = (a) => a.name.replace(a.firstName, '').trim() || a.name;

const prettyDate = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

// "Session 03 — Police Bullets vs Mathare United Women" → "Police Bullets vs Mathare United Women"
const matchName = (date) => {
  const s = GPS_SESSIONS.find((x) => x.date === date);
  return s ? s.title.replace(/^Session\s*\d+\s*[—-]\s*/, '') : prettyDate(date);
};

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

function gpsSummary(slug) {
  const matches = Object.keys(GPS_SESSION_STATS)
    .sort()
    .filter((date) => GPS_SESSION_STATS[date][slug])
    .map((date) => ({ date, ...GPS_SESSION_STATS[date][slug] }));
  if (!matches.length) return null;

  const best = (key) =>
    matches.reduce((top, m) => (num(m[key]) !== null && (top === null || m[key] > top[key]) ? m : top), null);

  return {
    matches,
    since: matches[0].date,
    topSpeed: best('max_speed_kmh'),
    bestDistance: best('distance_km'),
    peakAccel: best('peak_accel_ms2'),
    mostSprints: best('sprints'),
  };
}

function StatTile({ label, value, unit, note }) {
  return (
    <div className="ap-stat">
      <div className="ap-stat-label">{label}</div>
      <div className="ap-stat-value">
        {value}
        {unit && <small> {unit}</small>}
      </div>
      {note && <div className="ap-stat-note">{note}</div>}
    </div>
  );
}

export default function AthleteProfile() {
  const { slug } = useParams();
  const athlete = ATHLETES.find((a) => a.slug === slug);

  if (!athlete) {
    return (
      <section style={{ paddingBottom: 96 }}>
        <div className="container">
          <div className="empty-state">Athlete not found.</div>
        </div>
      </section>
    );
  }

  const gps = gpsSummary(athlete.slug);
  const facts = [
    ['Club', athlete.club],
    ['Position', athlete.position],
    ['Age', athlete.age],
    ['Preferred foot', athlete.foot],
    ['Height', athlete.height],
    ['Hometown', athlete.hometown],
  ].filter(([, v]) => v);
  const story = Array.isArray(athlete.story) && athlete.story.length ? athlete.story : [athlete.bio].filter(Boolean);
  const socials = [
    athlete.instagram && { label: 'Instagram', href: `https://www.instagram.com/${athlete.instagram.replace(/^@/, '')}`, handle: athlete.instagram },
    athlete.tiktok && { label: 'TikTok', href: `https://www.tiktok.com/@${athlete.tiktok.replace(/^@/, '')}`, handle: athlete.tiktok },
  ].filter(Boolean);

  return (
    <section className="ap" style={{ paddingBottom: 110 }}>
      <div className="container">
        <Link className="back-link" to="/services">← Back to athletes</Link>

        {/* ---------- HERO (same banner as the GPS Lab) ---------- */}
        <div className="gps-banner ap-banner">
          <div className="gps-banner-num" aria-hidden="true">{athlete.number}</div>
          <div className="gps-banner-copy">
            <div className="gps-banner-first">{athlete.firstName}</div>
            <h1 className="gps-banner-last">{lastName(athlete)}</h1>
            <div className="gps-banner-meta">
              <span>{athlete.club}</span>
              <span>{athlete.position}</span>
              <span>#{athlete.number}</span>
            </div>
            {gps && (
              <div className="gps-banner-actions">
                <span className="gps-vest-pill">GPS-tracked athlete</span>
              </div>
            )}
          </div>
          <div className="gps-banner-photo">
            <FallbackImage src={athlete.photo} alt={athlete.name} />
          </div>
        </div>

        {/* ---------- QUICK FACTS ---------- */}
        <dl className="ap-facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        {/* ---------- GPS PERFORMANCE ---------- */}
        {gps && (
          <div className="ap-section">
            <div className="section-head">
              <div>
                <div className="eyebrow">GPS Lab · Titan GPS</div>
                <h2 className="ap-h2">Match performance</h2>
              </div>
              <Link className="view-link" to="/data/gps">Full GPS data →</Link>
            </div>

            <div className="ap-stats">
              <StatTile label="Matches tracked" value={gps.matches.length} note={`Since ${prettyDate(gps.since)}`} />
              {gps.topSpeed && (
                <StatTile label="Top speed" value={gps.topSpeed.max_speed_kmh} unit="km/h" note={matchName(gps.topSpeed.date)} />
              )}
              {gps.bestDistance && (
                <StatTile label="Most distance in a match" value={gps.bestDistance.distance_km} unit="km" note={matchName(gps.bestDistance.date)} />
              )}
              {gps.peakAccel && (
                <StatTile label="Peak acceleration" value={gps.peakAccel.peak_accel_ms2} unit="m/s²" note={matchName(gps.peakAccel.date)} />
              )}
            </div>

            <div className="ap-table-wrap">
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>Match</th>
                    <th>Distance</th>
                    <th>Top speed</th>
                    <th>Sprints</th>
                  </tr>
                </thead>
                <tbody>
                  {[...gps.matches].reverse().map((m) => (
                    <tr key={m.date}>
                      <td>
                        <span className="ap-date">{prettyDate(m.date)}</span>
                        {matchName(m.date)}
                      </td>
                      <td>{num(m.distance_km) !== null ? `${m.distance_km} km` : '—'}</td>
                      <td>{num(m.max_speed_kmh) !== null ? `${m.max_speed_kmh} km/h` : '—'}</td>
                      <td>{num(m.sprints) !== null ? m.sprints : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------- STORY ---------- */}
        <div className="ap-section ap-story">
          <div>
            <div className="eyebrow">Profile</div>
            <h2 className="ap-h2">{athlete.firstName}'s story</h2>
            {story.map((p, i) => (
              <p key={i} className="ap-p">{p}</p>
            ))}
            {athlete.quote && (
              <blockquote className="ap-quote">
                <p>“{athlete.quote}”</p>
                <cite>— {athlete.name}</cite>
              </blockquote>
            )}
          </div>

          {(athlete.achievements?.length || athlete.goals) && (
            <aside className="ap-side">
              {athlete.achievements?.length > 0 && (
                <>
                  <h3 className="ap-h3">Achievements</h3>
                  <ul className="ap-list">
                    {athlete.achievements.map((a) => <li key={a}>{a}</li>)}
                  </ul>
                </>
              )}
              {athlete.goals && (
                <>
                  <h3 className="ap-h3">Goals</h3>
                  <p className="ap-p">{athlete.goals}</p>
                </>
              )}
            </aside>
          )}
        </div>

        {/* ---------- FOLLOW + PARTNER ---------- */}
        <div className="ap-cta">
          <div>
            <h3 className="ap-h3" style={{ marginBottom: 8 }}>Work with {athlete.firstName}</h3>
            <p className="ap-p" style={{ margin: 0 }}>
              Brand partnerships, sponsorship and media requests go through GameOn Collective.
            </p>
            {socials.length > 0 && (
              <div className="ap-socials">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label} · {s.handle}
                  </a>
                ))}
              </div>
            )}
          </div>
          <Link className="btn btn-primary" to="/contact">Get in touch →</Link>
        </div>
      </div>
    </section>
  );
}
