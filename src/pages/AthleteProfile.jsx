import { Link, useParams } from 'react-router-dom';
import { ATHLETES } from '../athletesData.js';
import FallbackImage from '../components/FallbackImage.jsx';

export default function AthleteProfile() {
  const { slug } = useParams();
  const athlete = ATHLETES.find(a => a.slug === slug);

  if (!athlete) {
    return (
      <section style={{ paddingBottom: 96 }}>
        <div className="empty-state">Athlete not found.</div>
      </section>
    );
  }

  return (
    <section style={{ paddingBottom: 110 }}>
      <div className="container">
        <Link className="back-link" to="/services">← Back to athletes</Link>
        <div className="athlete-profile">
          <div>
            <div className="athlete-profile-name">{athlete.name}</div>
            <div className="athlete-profile-number">{athlete.number}</div>
            <p className="athlete-profile-bio">{athlete.bio}</p>
            <div className="athlete-meta-row">
              <div className="meta-item">
                <div className="meta-label">Club</div>
                <div className="meta-value">{athlete.club}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Position</div>
                <div className="meta-value">{athlete.position}</div>
              </div>
            </div>
            <div className="athlete-meta-row">
              <div className="meta-item">
                <div className="meta-label">Birth Year</div>
                <div className="meta-value">{athlete.birthYear}</div>
              </div>
              <div className="meta-item">
                <div className="meta-label">Height</div>
                <div className="meta-value">{athlete.height}</div>
              </div>
            </div>
            <div className="athlete-follow">
              <div className="follow-label">Follow</div>
              <div className="follow-links">
                <span>Instagram — coming soon</span>
              </div>
            </div>
          </div>
          <div className="athlete-profile-photo">
            {athlete.photo && (
              <FallbackImage
                src={athlete.photo}
                alt={athlete.name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
