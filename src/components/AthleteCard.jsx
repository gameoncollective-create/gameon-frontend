import { Link } from 'react-router-dom';
import FallbackImage from './FallbackImage.jsx';

export default function AthleteCard({ athlete }) {
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
      <div className="athlete-card-info">
        <div className="athlete-card-name">{athlete.name}</div>
        <div className="athlete-card-position">{athlete.position}</div>
      </div>
    </Link>
  );
}
