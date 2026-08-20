import { NavLink, Outlet, useLocation } from 'react-router-dom';

const TABS = [
  { to: '/data', label: 'Overview', end: true },
  { to: '/data/players', label: 'Players' },
  { to: '/data/teams', label: 'Teams' },
  { to: '/data/standings', label: 'Standings' },
  { to: '/data/compare', label: 'Compare' },
  { to: '/data/gps', label: 'GPS Lab' }
];

export default function DataHubLayout() {
  const location = useLocation();
  // Player/team profile sub-routes should still highlight their parent tab.
  const isPlayerRoute = location.pathname.startsWith('/data/player/');
  const isTeamRoute = location.pathname.startsWith('/data/team/');

  return (
    <section style={{ paddingBottom: 0 }}>
      <div className="container">
        <div className="eyebrow">Data Intelligence</div>
        <h1 style={{ fontSize: 'clamp(2.2rem,4.6vw,3.2rem)', margin: '16px 0 14px' }}>Football intelligence, live from the pitch.</h1>
        <p style={{ color: 'var(--text-dim)', maxWidth: '62ch', marginBottom: 34, fontSize: '1rem' }}>
          Player stats, scout scores, league standings, GPS performance data and head-to-head comparisons — the same data platform we run for clubs and federations.
        </p>
        <div className="subtabs">
          {TABS.map(t => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) => {
                const forcedActive = (t.label === 'Players' && isPlayerRoute) || (t.label === 'Teams' && isTeamRoute);
                return (isActive || forcedActive) ? 'active' : '';
              }}
            >
              {t.label}
            </NavLink>
          ))}
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </section>
  );
}
