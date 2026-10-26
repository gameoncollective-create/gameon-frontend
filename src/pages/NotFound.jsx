import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section style={{ paddingTop: 140, paddingBottom: 140 }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="eyebrow">404</div>
        <h1 style={{ fontSize: 'clamp(2.2rem,5vw,3.6rem)', margin: '16px 0 18px' }}>This page doesn't exist.</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.05rem', maxWidth: '48ch', margin: '0 auto 36px' }}>
          The link you followed may be broken, or the page may have moved. Try searching the database or head back home.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">Back to home →</Link>
          <Link to="/data" className="btn btn-outline">Explore the database</Link>
        </div>
      </div>
    </section>
  );
}
