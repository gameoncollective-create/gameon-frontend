// scripts/prerender.mjs — SEO pre-rendering for gameoncollective.com
//
// WHY THIS EXISTS
// The site is a React app: the HTML file Vercel sends is an empty
// <div id="root"></div>, and all content appears only after JavaScript runs.
// Google can usually cope, but most other crawlers (Bing, social previews,
// AI tools like ChatGPT, Perplexity, DeepSeek) read the raw HTML and see
// nothing. Every page also had the same title and description.
//
// WHAT IT DOES (runs automatically after `vite build`, see package.json)
// For every page — static pages, the 3 GameOn athletes, every player and
// every team — it writes dist/<page>/index.html with:
//   - its own <title>, meta description, canonical URL and social tags
//   - structured data (JSON-LD) so search engines know what the page is about
//   - the page's real text inside #root, so crawlers can read it
// React replaces that text with the full interactive page as soon as it loads,
// so visitors see exactly the same site as before.
// It also writes a complete sitemap.xml and an llms.txt summary for AI tools.
//
// Player and team data comes from the live API. If the API is asleep or
// unreachable during the build, those pages are skipped (with a warning)
// and everything else still builds — the deploy never fails because of this.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ATHLETES } from '../src/athletesData.js';
import { GPS_SESSIONS, GPS_STATS } from '../src/gpsData.js';
import { NEWS_POSTS } from '../src/newsData.js';
import { upcomingEvents } from '../src/eventsData.js';

const SITE = 'https://www.gameoncollective.com';
const BRAND = 'GameOn Collective';
const API = process.env.PRERENDER_API || 'https://gameon-fastapi.onrender.com';
const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const DEFAULT_IMAGE = `${SITE}/images/hero.jpg`;
const CONTACT_EMAIL = 'gameoncollective@gmail.com';
const SOCIALS = [
  'https://www.instagram.com/gameoncollective',
  'https://www.linkedin.com/company/107606595/',
  'https://www.youtube.com/@GameOnCollective',
  'https://web.facebook.com/profile.php?id=61577704242732',
];

// ---------- helpers ----------

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Keep descriptions under ~158 characters (what Google shows), ending on a
// full sentence where possible rather than mid-word.
const clip = (s, n = 158) => {
  s = String(s).replace(/\s+/g, ' ').trim();
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const lastStop = cut.lastIndexOf('. ');
  if (lastStop >= 80) return cut.slice(0, lastStop + 1);
  return cut.slice(0, n - 1).replace(/\s+\S*$/, '').replace(/[,:;]$/, '') + '…';
};

const link = (href, text) => `<a href="${href}">${esc(text)}</a>`;
const list = (items) => (items.length ? `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>` : '');

async function fetchJSON(p, attempts = 2) {
  for (let i = 1; i <= attempts; i++) {
    try {
      // Render's free tier sleeps; the first request can take ~50s to wake it.
      const res = await fetch(API + p, { signal: AbortSignal.timeout(90_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`  [prerender] ${p} attempt ${i} failed: ${err.message}`);
    }
  }
  return null;
}

// ---------- page template ----------

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

function render({ route, title, description, image = DEFAULT_IMAGE, type = 'website', jsonld = [], body }) {
  const url = SITE + (route === '/' ? '/' : route);
  const desc = clip(description);
  let html = template;

  const set = (re, replacement) => {
    if (!re.test(html)) throw new Error(`Template is missing ${re}`);
    html = html.replace(re, replacement);
  };
  set(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  set(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(desc)}" />`);
  set(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
  set(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${type}" />`);
  set(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`);
  set(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(desc)}" />`);
  set(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);
  set(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${esc(image)}" />`);
  set(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(title)}" />`);
  set(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(desc)}" />`);
  set(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${esc(image)}" />`);

  const ld = [ORG_LD, ...jsonld]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)
    .join('\n');
  html = html.replace('</head>', `<meta property="og:locale" content="en_KE" />\n${ld}\n</head>`);

  const nav = `<nav>${[
    link('/', 'Home'),
    link('/data', 'Data Intelligence'),
    link('/data/players', 'Players'),
    link('/data/teams', 'Teams'),
    link('/data/standings', 'Standings'),
    link('/data/gps', 'GPS Lab'),
    link('/services', 'Services'),
    link('/news', 'News'),
    link('/contact', 'Contact'),
  ].join(' · ')}</nav>`;
  const content = `<div class="container" style="padding:32px 20px">${nav}<main>${body}</main><footer><p>${BRAND} — Kenya women's football intelligence. Nairobi, Kenya. ${link(`mailto:${CONTACT_EMAIL}`, CONTACT_EMAIL)}</p></footer></div>`;
  set(/<div id="root"><\/div>/, `<div id="root">${content}</div>`);

  const file = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  pages.push(route);
}

const pages = [];

const ORG_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: BRAND,
  alternateName: 'GameOn',
  url: SITE,
  logo: `${SITE}/android-chrome-512x512.png`,
  email: CONTACT_EMAIL,
  description:
    "GameOn Collective is a Kenyan sports data company building the first dedicated data platform for women's football in Kenya: player and club profiles, league standings, and GPS performance tracking.",
  foundingLocation: { '@type': 'Place', name: 'Nairobi, Kenya' },
  address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
  areaServed: 'Kenya',
  knowsAbout: [
    "women's football",
    'Kenya Women Premier League',
    'FKF Women National Super League',
    'football analytics',
    'GPS performance tracking',
    'athlete branding',
  ],
  sameAs: SOCIALS,
};

// ---------- data ----------

console.log('[prerender] fetching data from', API);
const [players, premier, nsl, zoneA, zoneB, standings] = await Promise.all([
  fetchJSON('/api/players'),
  fetchJSON('/api/premier/teams'),
  fetchJSON('/api/nsl/teams'),
  fetchJSON('/api/division-one/zone-a/teams'),
  fetchJSON('/api/division-one/zone-b/teams'),
  fetchJSON('/api/premier/standings'),
]);
const allPlayers = Array.isArray(players) ? players : [];
const allTeams = [premier, nsl, zoneA, zoneB].flatMap((t) => (Array.isArray(t) ? t : []));
const teamById = (id) => allTeams.find((t) => String(t.id) === String(id));
const leagueName = (l) =>
  ({ premier: "Kenya Women's Premier League", nsl: 'FKF Women National Super League' })[String(l || '').toLowerCase()] ||
  l ||
  'Kenyan women’s football';
if (!allPlayers.length) console.warn('[prerender] WARNING: no players from API — player pages skipped this build');
if (!allTeams.length) console.warn('[prerender] WARNING: no teams from API — team pages skipped this build');

const playerUrl = (p) => `/data/player/${p.id}`;
const teamUrl = (t) => `/data/team/${t.id}`;

// ---------- static pages ----------

const athleteLinks = ATHLETES.map((a) => link(`/athletes/${a.slug}`, `${a.name} — ${a.position || ''} · ${a.club}`));

render({
  route: '/',
  title: "GameOn Collective — Kenya Women's Football Data, Stats & GPS Tracking",
  description:
    "GameOn Collective is Kenya's data platform for women's football: player stats, club profiles, league standings and match GPS performance data.",
  jsonld: [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: BRAND,
      publisher: { '@id': `${SITE}/#organization` },
      inLanguage: 'en-KE',
    },
  ],
  body: `
    <h1>Kenya women's football data — find the players, know the teams</h1>
    <p>GameOn Collective is a Nairobi-based sports data company building the first dedicated data platform for women's football in Kenya. We track ${allPlayers.length || 'hundreds of'} players and ${allTeams.length || 'dozens of'} clubs across the Kenya Women's Premier League and the FKF Women National Super League, with goals, assists, appearances, league standings and player comparisons.</p>
    <p>Through our GPS Lab, Mathare United Women FC athletes play competitive matches wearing Titan GPS performance vests — among the first women footballers in Kenya to do so — and we publish their verified match data: distance covered, top speed, sprints, accelerations and player load.</p>
    <h2>Explore</h2>
    ${list([
      link('/data/players', 'Player directory — every tracked player in Kenyan women’s football'),
      link('/data/teams', 'Club profiles — Premier League and National Super League teams'),
      link('/data/standings', 'Kenya Women Premier League standings'),
      link('/data/gps', 'GPS Lab — match-by-match GPS performance data'),
      link('/data/compare', 'Compare two players head-to-head'),
    ])}
    <h2>GameOn athletes</h2>
    ${list(athleteLinks)}`,
});

render({
  route: '/services',
  title: `Services — Athlete Branding, GPS Tracking & Football Data | ${BRAND}`,
  description:
    'GameOn Collective works with Kenyan clubs, federations, brands and athletes: GPS performance tracking, player and club data, athlete brand building, content and sponsorship support for women’s football.',
  body: `
    <h1>Services</h1>
    <p>GameOn Collective helps Kenyan women's football grow through data and storytelling.</p>
    ${list([
      '<strong>GPS performance tracking</strong> — Titan GPS vests in competitive matches; distance, speed, sprints, accelerations, decelerations and player load.',
      '<strong>Football data</strong> — player and club profiles, league standings, goals, assists and appearances.',
      '<strong>Athlete brand building</strong> — profiles, social media content and sponsorship pitches backed by verified data.',
      '<strong>For clubs, federations and brand partners</strong> — scouting insight, workload monitoring and audience reach.',
    ])}
    <p>${link('/contact', 'Partner with us')}</p>`,
});

render({
  route: '/news',
  title: `News — Kenya Women's Football & GameOn Updates | ${BRAND}`,
  description:
    'News and updates from GameOn Collective: Kenyan women’s football, GPS Lab match reports, platform updates and athlete stories.',
  body: `
    <h1>News &amp; updates</h1>
    ${(NEWS_POSTS || [])
      .map(
        (n) => `<article><h2>${link(`/news/${n.slug}`, n.title)}</h2><p><em>${esc(n.category || '')}${n.date ? ' · ' + esc(n.date) : ''}</em></p><p>${esc(n.excerpt || '')}</p></article>`,
      )
      .join('')}`,
});

const upcoming = upcomingEvents();
const nextFixtures = upcoming.filter((e) => e.type === 'Match').slice(0, 3).map((e) => e.title).join(', ');

render({
  route: '/events',
  title: `Events — Kenyan Women's Football Fixtures & Milestones | ${BRAND}`,
  description: nextFixtures
    ? `Upcoming FKF Women's Premier League fixtures with venues and kick-off times: ${nextFixtures}.`
    : 'Kenyan women’s football fixtures, GameOn Collective events and milestones, including Kenya Women Premier League matches and GPS Lab sessions.',
  jsonld: upcoming
    .filter((e) => e.type === 'Match' && e.date)
    .map((e) => {
      const [home, away] = e.title.split(' vs ');
      const [venue, time] = String(e.location || '').split(' · ');
      const hhmm = (time || '').match(/(\d{1,2}):(\d{2})/);
      return {
        '@context': 'https://schema.org',
        '@type': 'SportsEvent',
        name: e.title,
        sport: 'Soccer',
        startDate: hhmm ? `${e.date}T${hhmm[1].padStart(2, '0')}:${hhmm[2]}:00+03:00` : e.date,
        eventStatus: 'https://schema.org/EventScheduled',
        location: { '@type': 'Place', name: venue || 'Kenya', address: { '@type': 'PostalAddress', addressCountry: 'KE' } },
        homeTeam: home ? { '@type': 'SportsTeam', name: home } : undefined,
        awayTeam: away ? { '@type': 'SportsTeam', name: away } : undefined,
        superEvent: { '@type': 'SportsEvent', name: "FKF Women's Premier League" },
      };
    }),
  body: `<h1>Kenyan women's football fixtures &amp; events</h1>
    ${upcoming.filter((e) => e.type === 'Match').length ? `<h2>Upcoming matches</h2>${list(upcoming.filter((e) => e.type === 'Match').map((e) => `<strong>${esc(e.title)}</strong> — ${esc(e.day)} ${esc(e.month)}, ${esc(e.location)} (${esc(e.status)})`))}` : '<p>No fixtures confirmed yet.</p>'}
    <p>${link('/data/standings', 'See the latest league standings')} · ${link('/data/gps', 'GPS Lab sessions')}</p>`,
});

render({
  route: '/contact',
  title: `Contact — Partner with ${BRAND}`,
  description:
    'Contact GameOn Collective in Nairobi, Kenya. For clubs, federations, brand partners, media and players interested in women’s football data, GPS tracking and athlete partnerships.',
  jsonld: [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      url: `${SITE}/contact`,
      about: { '@id': `${SITE}/#organization` },
    },
  ],
  body: `<h1>Contact GameOn Collective</h1><p>Based in Nairobi, Kenya. We work with clubs, federations, brand partners, media and players.</p><p>Email: ${link(`mailto:${CONTACT_EMAIL}`, CONTACT_EMAIL)}</p>${list(SOCIALS.map((s) => link(s, s.replace(/^https:\/\/(www\.|web\.)?/, ''))))}`,
});

render({
  route: '/privacy',
  title: `Privacy Policy | ${BRAND}`,
  description: 'How GameOn Collective collects, uses and protects personal and athlete performance data under Kenya’s Data Protection Act, 2019.',
  body: `<h1>Privacy Policy</h1><p>How GameOn Collective handles personal data and athlete performance data under Kenya's Data Protection Act, 2019. Questions: ${link(`mailto:${CONTACT_EMAIL}`, CONTACT_EMAIL)}.</p>`,
});

render({
  route: '/terms',
  title: `Terms of Service | ${BRAND}`,
  description: 'Terms of service for using gameoncollective.com and GameOn Collective’s women’s football data platform.',
  body: `<h1>Terms of Service</h1><p>Terms for using gameoncollective.com.</p>`,
});

// ---------- news articles ----------

for (const n of NEWS_POSTS || []) {
  if (!n.slug) continue;
  render({
    route: `/news/${n.slug}`,
    title: `${n.title} | ${BRAND}`,
    description: n.excerpt || n.title,
    type: 'article',
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: n.title,
        description: n.excerpt,
        datePublished: n.isoDate || undefined,
        articleSection: n.category,
        url: `${SITE}/news/${n.slug}`,
        image: DEFAULT_IMAGE,
        author: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
        inLanguage: 'en-KE',
      },
    ],
    body: `
      <article>
        <p><em>${esc(n.category || '')}${n.date ? ' · ' + esc(n.date) : ''}</em></p>
        <h1>${esc(n.title)}</h1>
        <p><strong>${esc(n.excerpt || '')}</strong></p>
        ${(n.content || []).map((c) => `<p>${esc(c)}</p>`).join('')}
      </article>
      <p>${link('/news', 'More news')} · ${link('/data/gps', 'GPS Lab data')}</p>`,
  });
}

// ---------- data hub ----------

const premierTable = Array.isArray(standings) && standings.length
  ? `<table><thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead><tbody>${standings
      .map((r) => {
        const t = allTeams.find((x) => x.name === r.team);
        return `<tr><td>${esc(r.position)}</td><td>${t ? link(teamUrl(t), r.team) : esc(r.team)}</td><td>${esc(r.played)}</td><td>${esc(r.won)}</td><td>${esc(r.drawn)}</td><td>${esc(r.lost)}</td><td>${esc(r.gd)}</td><td>${esc(r.points)}</td></tr>`;
      })
      .join('')}</tbody></table>`
  : '';

const topScorers = [...allPlayers].sort((a, b) => (b.goals || 0) - (a.goals || 0)).filter((p) => p.goals > 0).slice(0, 10);

render({
  route: '/data',
  title: `Data Intelligence — Kenya Women's Football Stats | ${BRAND}`,
  description: `Kenyan women's football statistics: ${allPlayers.length || 'hundreds of'} players, ${allTeams.length || 'dozens of'} clubs, Kenya Women Premier League standings, top scorers and GPS performance data.`,
  body: `
    <h1>Kenya women's football intelligence, live from the pitch</h1>
    <p>Player stats, scout scores, league standings, GPS performance data and head-to-head comparisons — ${allPlayers.length} players tracked, ${allTeams.length} clubs profiled.</p>
    ${topScorers.length ? `<h2>Top scorers</h2>${list(topScorers.map((p) => `${link(playerUrl(p), p.name)} — ${p.goals} goals, ${p.assists || 0} assists (${esc(teamById(p.team_id)?.name || '')})`))}` : ''}
    ${premierTable ? `<h2>Kenya Women's Premier League table</h2>${premierTable}` : ''}`,
});

render({
  route: '/data/players',
  title: `Player Directory — Kenyan Women Footballers | ${BRAND}`,
  description: `Directory of ${allPlayers.length || ''} Kenyan women footballers with positions, clubs, goals, assists and appearances across the Kenya Women's Premier League.`,
  body: `<h1>Player directory</h1><p>Every player we track in Kenyan women's football.</p>${list(
    allPlayers.map((p) => `${link(playerUrl(p), p.name)} — ${esc(p.position || '')}, ${esc(teamById(p.team_id)?.name || leagueName(p.league))}`),
  )}`,
});

render({
  route: '/data/teams',
  title: `Teams — Kenya Women's Premier League & NSL Clubs | ${BRAND}`,
  description: `Profiles of ${allTeams.length || ''} Kenyan women's football clubs in the Kenya Women's Premier League and FKF Women National Super League: coaches, history and squads.`,
  body: `<h1>Clubs</h1>${['Premier', 'NSL']
    .map((lg) => {
      const ts = allTeams.filter((t) => t.league === lg);
      return ts.length ? `<h2>${esc(leagueName(lg))}</h2>${list(ts.map((t) => `${link(teamUrl(t), t.name)}${t.city ? ' — ' + esc(t.city) : ''}`))}` : '';
    })
    .join('')}`,
});

render({
  route: '/data/standings',
  title: `Kenya Women's Premier League Standings 2026-27 | ${BRAND}`,
  description:
    "Latest Kenya Women's Premier League table: points, wins, draws, losses and goal difference for every club, plus National Super League standings.",
  body: `<h1>Kenya Women's Premier League standings</h1>${premierTable || '<p>Live league table for the Kenya Women\'s Premier League and National Super League.</p>'}`,
});

render({
  route: '/data/compare',
  title: `Compare Players Head-to-Head | ${BRAND}`,
  description: 'Compare two Kenyan women footballers side by side: goals, assists, appearances, scout score and GPS performance data.',
  body: `<h1>Compare players</h1><p>Choose any two players to compare goals, assists, appearances and GPS data. Browse the ${link('/data/players', 'player directory')}.</p>`,
});

// ---------- GPS Lab ----------

const fmt = (v, unit) => (typeof v === 'number' ? `${v}${unit ? ' ' + unit : ''}` : '—');
const gpsRows = ATHLETES.map((a) => {
  const s = GPS_STATS[a.slug];
  if (!s) return '';
  const t = s.season;
  return `<tr><td>${link(`/athletes/${a.slug}`, a.name)}</td><td>${s.sessions}</td><td>${fmt(t.distance_km, 'km')}</td><td>${fmt(t.max_speed_kmh, 'km/h')}</td><td>${fmt(t.peak_accel_ms2, 'm/s²')}</td></tr>`;
}).join('');
const sessionsDone = GPS_SESSIONS.filter((s) => s.status === 'completed');

render({
  route: '/data/gps',
  title: `GPS Lab — Women's Football GPS Performance Data, Kenya | ${BRAND}`,
  description: `Match-by-match GPS data for Kenyan women footballers in Titan GPS vests: distance, top speed, sprints and player load. ${sessionsDone.length} matches tracked.`,
  jsonld: [
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'GameOn Collective GPS Lab — Kenyan women’s football match GPS data',
      description:
        'Match-by-match GPS performance data (distance, top speed, peak acceleration, sprints, accelerations, decelerations, player load) for Mathare United Women FC athletes tracked with Titan GPS vests.',
      url: `${SITE}/data/gps`,
      creator: { '@id': `${SITE}/#organization` },
      temporalCoverage: `${sessionsDone[0]?.date || '2026-09-27'}/..`,
      spatialCoverage: { '@type': 'Place', name: 'Kenya' },
      keywords: ['women’s football', 'GPS tracking', 'Kenya', 'sports data'],
      isAccessibleForFree: true,
    },
  ],
  body: `
    <h1>GPS Lab — GPS performance data for Kenyan women's football</h1>
    <p>Three Mathare United Women FC athletes play competitive Kenya Women's Premier League matches wearing Titan GPS vests — among the first women footballers in Kenya to do so. We publish verified match data after every session.</p>
    <h2>Season totals</h2>
    <table><thead><tr><th>Athlete</th><th>Matches</th><th>Total distance</th><th>Top speed</th><th>Peak acceleration</th></tr></thead><tbody>${gpsRows}</tbody></table>
    <h2>Sessions</h2>
    ${list(sessionsDone.map((s) => `${esc(s.title)} — ${esc(s.date)} — ${esc(s.detail)}`))}`,
});

// ---------- athletes ----------

for (const a of ATHLETES) {
  const s = GPS_STATS[a.slug];
  const season = s?.season || {};
  const latest = s?.latest || {};
  const gpsLine = s
    ? `Tracked in ${s.sessions} competitive matches with Titan GPS: ${fmt(season.distance_km, 'km')} total distance, top speed ${fmt(season.max_speed_kmh, 'km/h')}, peak acceleration ${fmt(season.peak_accel_ms2, 'm/s²')}.`
    : '';
  render({
    route: `/athletes/${a.slug}`,
    title: `${a.name} — ${a.position || 'Footballer'}, ${a.club} | ${BRAND}`,
    description: `${a.name} is a ${a.position ? a.position.toLowerCase() : 'footballer'} for ${a.club} in the Kenya Women's Premier League. Profile and match-by-match GPS performance data.`,
    image: a.photo ? SITE + a.photo : DEFAULT_IMAGE,
    type: 'profile',
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: a.name,
        url: `${SITE}/athletes/${a.slug}`,
        image: a.photo ? SITE + a.photo : undefined,
        jobTitle: `Professional footballer (${a.position || 'player'})`,
        nationality: 'Kenya',
        memberOf: { '@type': 'SportsTeam', name: a.club, sport: 'Soccer' },
        affiliation: { '@id': `${SITE}/#organization` },
        description: a.bio,
        homeLocation: a.hometown ? { '@type': 'Place', name: a.hometown } : undefined,
        height: a.height || undefined,
        award: Array.isArray(a.achievements) && a.achievements.length ? a.achievements : undefined,
        sameAs: [
          a.instagram && `https://www.instagram.com/${a.instagram.replace(/^@/, '')}`,
          a.tiktok && `https://www.tiktok.com/@${a.tiktok.replace(/^@/, '')}`,
        ].filter(Boolean),
      },
    ],
    body: `
      <h1>${esc(a.name)}</h1>
      <p>${esc(a.position || '')} · ${esc(a.club)}${a.number ? ' · #' + esc(a.number) : ''}</p>
      ${list([
        a.age && `Age: ${esc(a.age)}`,
        a.foot && `Preferred foot: ${esc(a.foot)}`,
        a.height && `Height: ${esc(a.height)}`,
        a.hometown && `Hometown: ${esc(a.hometown)}`,
      ].filter(Boolean))}
      <h2>${esc(a.firstName || a.name)}'s story</h2>
      ${(Array.isArray(a.story) && a.story.length ? a.story : [a.bio]).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('')}
      ${a.quote ? `<blockquote><p>“${esc(a.quote)}” — ${esc(a.name)}</p></blockquote>` : ''}
      ${Array.isArray(a.achievements) && a.achievements.length ? `<h2>Achievements</h2>${list(a.achievements.map(esc))}` : ''}
      ${a.goals ? `<h2>Goals</h2><p>${esc(a.goals)}</p>` : ''}
      ${s ? `<h2>GPS performance</h2><p>${esc(gpsLine)}</p><p>Latest match: ${fmt(latest.distance_km, 'km')} covered, top speed ${fmt(latest.max_speed_kmh, 'km/h')}, ${fmt(latest.sprints)} sprints.</p><p>${link('/data/gps', 'See full GPS Lab data')}</p>` : ''}`,
  });
}

// ---------- players ----------

for (const p of allPlayers) {
  const team = teamById(p.team_id);
  const club = team?.name || leagueName(p.league);
  const stats = `${p.goals || 0} goals, ${p.assists || 0} assists in ${p.appearances || 0} appearances`;
  render({
    route: playerUrl(p),
    title: `${p.name} — ${p.position || 'Player'}, ${club} | Stats | ${BRAND}`,
    description: `${p.name} is a ${String(p.position || 'player').toLowerCase()} for ${club} in the ${leagueName(p.league)}. Season stats: ${stats}.`,
    type: 'profile',
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: p.name,
        url: SITE + playerUrl(p),
        jobTitle: `Footballer (${p.position || 'player'})`,
        memberOf: team ? { '@type': 'SportsTeam', name: team.name, sport: 'Soccer', url: SITE + teamUrl(team) } : undefined,
      },
    ],
    body: `
      <h1>${esc(p.name)}</h1>
      <p>${esc(p.position || '')} · ${team ? link(teamUrl(team), team.name) : esc(club)} · ${esc(leagueName(p.league))}</p>
      <h2>Season statistics</h2>
      ${list([`Goals: ${p.goals || 0}`, `Assists: ${p.assists || 0}`, `Appearances: ${p.appearances || 0}`])}
      <p>${link('/data/players', 'All players')} · ${link(`/data/compare?player1=${p.id}`, 'Compare with another player')}</p>`,
  });
}

// ---------- teams ----------

for (const t of allTeams) {
  const squad = allPlayers.filter((p) => String(p.team_id) === String(t.id));
  const row = Array.isArray(standings) ? standings.find((r) => r.team === t.name) : null;
  const facts = [
    t.city && `Based in ${t.city}`,
    t.founded_year && `founded ${t.founded_year}`,
    t.coach_name && `head coach ${t.coach_name}`,
  ].filter(Boolean).join(', ');
  render({
    route: teamUrl(t),
    title: `${t.name} — Squad, Stats & Standings | ${leagueName(t.league)} | ${BRAND}`,
    description: `${t.name}: ${leagueName(t.league)} club${t.city ? ' from ' + t.city : ''}. ${row ? `Currently ${row.position}${['st', 'nd', 'rd'][row.position - 1] || 'th'} with ${row.points} points. ` : ''}${t.description || ''}`,
    image: t.logo ? API + t.logo : DEFAULT_IMAGE,
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'SportsTeam',
        name: t.name,
        sport: 'Soccer',
        url: SITE + teamUrl(t),
        location: t.city ? { '@type': 'Place', name: `${t.city}, Kenya` } : undefined,
        coach: t.coach_name ? { '@type': 'Person', name: t.coach_name } : undefined,
        foundingDate: t.founded_year || undefined,
        memberOf: { '@type': 'SportsOrganization', name: leagueName(t.league) },
        athlete: squad.map((p) => ({ '@type': 'Person', name: p.name, url: SITE + playerUrl(p) })),
      },
    ],
    body: `
      <h1>${esc(t.name)}</h1>
      <p>${esc(leagueName(t.league))}${facts ? ' · ' + esc(facts) : ''}</p>
      ${t.description ? `<p>${esc(t.description)}</p>` : ''}
      ${row ? `<p>League position: ${row.position} · Played ${row.played} · Won ${row.won} · Drawn ${row.drawn} · Lost ${row.lost} · Points ${row.points}</p>` : ''}
      ${squad.length ? `<h2>Squad</h2>${list(squad.map((p) => `${link(playerUrl(p), p.name)} — ${esc(p.position || '')}`))}` : ''}`,
  });
}

// ---------- sitemap.xml & llms.txt ----------

const today = new Date().toISOString().slice(0, 10);
const priority = (r) => (r === '/' ? '1.0' : r.startsWith('/data/player/') || r.startsWith('/data/team/') ? '0.6' : '0.8');
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((r) => `  <url><loc>${SITE}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod><priority>${priority(r)}</priority></url>`)
    .join('\n')}\n</urlset>\n`,
);

fs.writeFileSync(
  path.join(DIST, 'llms.txt'),
  `# GameOn Collective

> GameOn Collective is a sports data company based in Nairobi, Kenya, building the first dedicated data platform for women's football in Kenya. It publishes player and club profiles, Kenya Women's Premier League standings, and match GPS performance data from athletes wearing Titan GPS vests.

- Website: ${SITE}
- Contact: ${CONTACT_EMAIL}
- Location: Nairobi, Kenya
- Coverage: ${allPlayers.length} players and ${allTeams.length} clubs across the Kenya Women's Premier League and FKF Women National Super League
- GPS Lab: Mathare United Women FC athletes (${ATHLETES.map((a) => a.name).join(', ')}) tracked in ${sessionsDone.length} competitive matches since ${sessionsDone[0]?.date || 'September 2026'}

## Key pages
- [Data Intelligence](${SITE}/data): stats hub for Kenyan women's football
- [Player directory](${SITE}/data/players)
- [Club profiles](${SITE}/data/teams)
- [Kenya Women's Premier League standings](${SITE}/data/standings)
- [GPS Lab](${SITE}/data/gps): match-by-match GPS performance data
- [Services](${SITE}/services): GPS tracking, football data, athlete brand building
- [News](${SITE}/news)
- [Contact](${SITE}/contact)

## Athletes
${ATHLETES.map((a) => `- [${a.name}](${SITE}/athletes/${a.slug}): ${a.position || ''}, ${a.club}`).join('\n')}

## Social
${SOCIALS.map((s) => `- ${s}`).join('\n')}
`,
);

console.log(`[prerender] wrote ${pages.length} pages, sitemap.xml and llms.txt`);
