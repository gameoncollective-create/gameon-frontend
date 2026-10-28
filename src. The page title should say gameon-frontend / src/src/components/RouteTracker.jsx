import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGameOnData } from '../DataContext.jsx';
import { ATHLETES } from '../athletesData.js';
import { trackPageView } from '../analytics.js';

const SITE = 'GameOn Collective';
const DEFAULT_TITLE = "GameOn Collective — Kenya Women's Football Intelligence";

const STATIC_TITLES = {
  '/': DEFAULT_TITLE,
  '/services': 'Services',
  '/news': 'News & Blog',
  '/events': 'Events',
  '/contact': 'Contact',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/data': 'Data Intelligence',
  '/data/players': 'Player Directory',
  '/data/teams': 'Teams',
  '/data/standings': 'League Standings',
  '/data/compare': 'Compare Players',
  '/data/gps': 'GPS Lab',
};

// Returns { title, ready }. ready=false while a player/team name is still
// loading, so the page_view waits for the real name instead of logging a
// generic title.
function resolveTitle(pathname, { store, teamById, playerById }) {
  const path = pathname.replace(/\/+$/, '') || '/';

  if (STATIC_TITLES[path]) {
    const t = STATIC_TITLES[path];
    return { title: path === '/' ? t : `${t} | ${SITE}`, ready: true };
  }

  let m = path.match(/^\/athletes\/([^/]+)$/);
  if (m) {
    const athlete = ATHLETES.find(a => a.slug === m[1]);
    return { title: `${athlete ? athlete.name : 'Athlete'} | ${SITE}`, ready: true };
  }

  m = path.match(/^\/data\/player\/([^/]+)$/);
  if (m) {
    const player = playerById(m[1]);
    if (player) return { title: `${player.name} — Player Profile | ${SITE}`, ready: true };
    return { title: `Player Profile | ${SITE}`, ready: store.loaded };
  }

  m = path.match(/^\/data\/team\/([^/]+)$/);
  if (m) {
    const team = teamById(m[1]);
    if (team) return { title: `${team.name} — Team Profile | ${SITE}`, ready: true };
    return { title: `Team Profile | ${SITE}`, ready: store.loaded };
  }

  return { title: `Page Not Found | ${SITE}`, ready: true };
}

export default function RouteTracker() {
  const { pathname } = useLocation();
  const data = useGameOnData();
  const { title, ready } = resolveTitle(pathname, data);
  const lastTracked = useRef(null);

  useEffect(() => {
    document.title = title;
    if (!ready || lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    trackPageView();
  }, [pathname, title, ready]);

  return null;
}
