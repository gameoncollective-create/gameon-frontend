# GameOn Collective — Frontend (React + Vite)

## Setup

```bash
npm install
npm run dev
```

This runs the dev server at `http://localhost:5173`. In dev, `/api/*` requests are proxied to `http://localhost:5002` (your FastAPI backend) — change the target in `vite.config.js` if your backend runs on a different port.

## Build for production

```bash
npm run build
```

Outputs to `dist/`.

## Deploying to Vercel

This includes a `vercel.json` with a rewrite rule so client-side routes (like `/data/players`) work correctly on direct load/refresh, not just when navigated to from within the app.

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

You'll also need to either:
- Deploy your FastAPI backend somewhere reachable, and set `API_BASE` in `src/api.js` to that URL, **or**
- Set up a Vercel rewrite/proxy from `/api/*` to your backend if it's hosted separately.

## Project structure

```
src/
  api.js              — fetch helpers + small formatting utilities
  DataContext.jsx      — loads players/teams/standings once, shares via React context
  App.jsx              — routes
  components/          — shared UI: Nav, Footer, TalentTile, PlayerCard, ScoutDial, StandingsTable, Reveal
  pages/                — Home, Services, News, Events, Contact
  pages/data/           — Data Intelligence Hub: Overview, Players, PlayerProfile, Teams, TeamProfile, Standings, Compare, GPSLab
  newsData.js           — placeholder news posts (no CMS yet — edit directly or replace with a real API)
  eventsData.js         — placeholder events/fixtures (same — edit directly or replace with a real API)
  styles.css            — all styles, using CSS custom properties for theming
```

## Customization

- **Colors/theme**: edit the CSS variables at the top of `styles.css` (`:root { ... }`). The `.light-section` class re-themes anything inside it by overriding those same variables — that's how the site mixes dark and light sections.
- **Fonts**: change the Google Fonts link in `index.html` and the `--display` / `--body` / `--mono` variables in `styles.css`.
- **News/Events content**: edit `src/newsData.js` and `src/eventsData.js` directly, or wire them to real API endpoints once you have them.

## Known gaps (carried over from the previous build)

- News and Events content is placeholder — needs real posts/fixtures before launch.
- Contact form doesn't send anywhere yet — needs a `POST /api/contact` backend endpoint.
- Contact info (email, social handles) is placeholder — confirm real ones.
- For full SEO/AI-crawler visibility, this still needs server-side rendering or static pre-rendering for player/team/standings pages — client-side React Router alone won't be enough (see the SEO section of the copy deck for details).
