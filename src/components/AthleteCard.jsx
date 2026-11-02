import { Link } from 'react-router-dom';
import FallbackImage from './FallbackImage.jsx';
import { GPS_SESSION_STATS } from '../gpsData.js';

// Headline GPS numbers for the card: matches tracked, best top speed and
// most distance in one match. Updates automatically from src/gpsData.js.
function gpsHeadline(slug) {
  const records = Object.values(GPS_SESSION_STATS)
    .map((match) => match[slug])
    .filter(Boolean);
  if (!records.length) return null;
  const best = (key) => {
    const values = records.map((r) => r[key]).filter((v) => typeof v === 'number');
    return values.length ? Math.max(...values) : null;
  };
  return { matches: records.length, topSpeed: best('max_speed_kmh'), distance: best('distance_km') };
}

export default function AthleteCard({ athlete }) {
  const gps = gpsHeadline(athlete.slug);

  return (
    <Link to={`/athletes/${athlete.slug}`} className="athlete-card">
      <div className="athlete-card-photo">
        {athlete.photo && (
          <FallbackImage
            src={athlete.photo}
            alt={athlete.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      {gps && (
        <span className="athlete-card-gps">
          GPS-tracked · {gps.matches} {gps.matches === 1 ? 'match' : 'matches'}
        </span>
      )}

      <div className="athlete-card-info">
        <div className="athlete-card-name">{athlete.name}</div>
        <div className="athlete-card-position">
          {athlete.position}
          {athlete.number ? ` · #${athlete.number}` : ''}
        </div>
        {gps && (gps.topSpeed || gps.distance) && (
          <div className="athlete-card-stats">
            {gps.topSpeed && (
              <div>
                <b>{gps.topSpeed}</b>
                <span>km/h top speed</span>
              </div>
            )}
            {gps.distance && (
              <div>
                <b>{gps.distance}</b>
                <span>km in a match</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
