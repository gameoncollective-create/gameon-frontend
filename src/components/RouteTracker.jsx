import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGameOnData } from '../DataContext.jsx';
import { ATHLETES } from '../athletesData.js';
import { NEWS_POSTS } from '../newsData.js';
import { trackPageView } from '../analytics.js';

const SITE = 'GameOn Collective';
// Keep these titles in sync with scripts/prerender.mjs (what search engines
// see before JavaScript runs).
const DEFAULT_TITLE = "GameOn Collective — Kenya Women's Football Data, Stats & GPS Tracking";
const LEAGUES = { premier: "Kenya Women's Premier League", nsl: 'FKF Women National Super League' };
const leagueName = (l) => LEAGUES[String(l || '').toLowerCase()] || l || "Kenyan women's football";

const STATIC_TITLES = {
  '/': DEFAULT_TITLE,
  '/services': 'Services — Athlete Branding, GPS Tracking & Football Data',
  '/news': "News — Kenya Women's Football & GameOn Updates",
  '/events': "Events — Kenyan Women's Football Fixtures & Milestones",
  '/contact': 'Contact — Partner with GameOn Collective',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/data': "Data Intelligence — Kenya Women's Football Stats",
  '/data/players': 'Player Directory — Kenyan Women Footballers',
  '/data/teams': "Teams — Kenya Women's Premier League & NSL Clubs",
  '/data/standings': "Kenya Women's Premier League Standings 2026-27",
  '/data/compare': 'Compare Players Head-to-Head',
  '/data/gps': "GPS Lab — Women's Football GPS Performance Data, Kenya",
};

// Returns { title, ready }. ready=false while a player/team name is still
// loading, so the page_view waits for the real name instead of logging a
// generic title.
function resolveTitle(pathname, { store, teamById, playerById }) {
  const path = pathname.replace(/\/+$/, '') || '/';

  if (STATIC_TITLES[path]) {
    const t = STATIC_TITLES[path];
    return { title: path === '/' || path === '/contact' ? t : `${t} | ${SITE}`, ready: true };
  }

  let m = path.match(/^\/news\/([^/]+)$/);
  if (m) {
    const post = NEWS_POSTS.find(p => p.slug === m[1]);
    return { title: post ? `${post.title} | ${SITE}` : `News | ${SITE}`, ready: true };
  }

  m = path.match(/^\/athletes\/([^/]+)$/);
  if (m) {
    const athlete = ATHLETES.find(a => a.slug === m[1]);
    if (!athlete) return { title: `Athlete | ${SITE}`, ready: true };
    return { title: `${athlete.name} — ${athlete.position || 'Footballer'}, ${athlete.club} | ${SITE}`, ready: true };
  }

  m = path.match(/^\/data\/player\/([^/]+)$/);
  if (m) {
    const player = playerById(m[1]);
    if (player) {
      const club = teamById(player.team_id)?.name || leagueName(player.league);
      return { title: `${player.name} — ${player.position || 'Player'}, ${club} | Stats | ${SITE}`, ready: true };
    }
    return { title: `Player Profile | ${SITE}`, ready: store.loaded };
  }

  m = path.match(/^\/data\/team\/([^/]+)$/);
  if (m) {
    const team = teamById(m[1]);
    if (team) return { title: `${team.name} — Squad, Stats & Standings | ${leagueName(team.league)} | ${SITE}`, ready: true };
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
