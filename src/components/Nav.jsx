import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/data', label: 'Data Intelligence' },
  { to: '/services', label: 'Services' },
  { to: '/news', label: 'News' },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact' }
];

export default function Nav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <header className="site solid">
      <div className="nav-wrap">
        <Link to="/" className="wordmark">
          <Logo />
          GAMEON COLLECTIVE
        </Link>
        <nav className="links">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
          ))}
        </nav>
        <Link to="/contact" className="nav-cta">Partner with us</Link>
        <button className="burger" aria-label="Menu" onClick={() => setMobileOpen(o => !o)}>☰</button>
      </div>
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 66, left: 0, right: 0, zIndex: 59,
          background: 'var(--bg-raised)', borderTop: '1px solid var(--line)',
          maxHeight: 'calc(100vh - 66px)', overflowY: 'auto'
        }}>
          <div style={{ maxWidth: 1320, margin: '0 auto', padding: '8px 24px 16px', display: 'flex', flexDirection: 'column' }}>
            {LINKS.map(l => (
              <Link key={l.to} to={l.to} style={{
                textAlign: 'left', padding: '12px 0', color: 'var(--text)',
                fontFamily: 'var(--mono)', textTransform: 'uppercase', fontSize: '.8rem',
                borderBottom: '1px solid var(--line)'
              }}>{l.label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
