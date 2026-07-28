import { Anton, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export default function Home() {
  return (
    <div className={`${anton.variable} ${plexSans.variable} ${plexMono.variable}`}>
      <style>{`
        :root {
          --pitch-night: #060605;
          --chalk: #F3F0E6;
          --chalk-dim: #C9C4B4;
          --amber: #E7A33E;
          --clay: #B24A38;
          --line: #23231F;
        }
        .go-page {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: var(--pitch-night);
          color: var(--chalk);
          font-family: var(--font-body), sans-serif;
          overflow-x: hidden;
        }
        .go-bg-photo {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          filter: grayscale(1) contrast(1.08) brightness(0.62);
          z-index: -2;
        }
        .go-bg-overlay {
          position: fixed;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(180deg, rgba(6,6,5,0.55) 0%, rgba(6,6,5,0.72) 38%, rgba(6,6,5,0.93) 78%, var(--pitch-night) 100%),
            radial-gradient(ellipse at center, rgba(6,6,5,0.15) 0%, rgba(6,6,5,0.55) 100%);
        }
        .go-main {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6vh 6vw;
          text-align: center;
        }
        .go-eyebrow {
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--amber);
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .go-eyebrow::before, .go-eyebrow::after {
          content: '';
          width: 28px;
          height: 1px;
          background: var(--amber);
          opacity: 0.5;
        }
        .go-h1 {
          font-family: var(--font-display), sans-serif;
          font-weight: 400;
          text-transform: uppercase;
          line-height: 0.98;
          letter-spacing: 0.005em;
          font-size: clamp(38px, 7.4vw, 92px);
          color: var(--chalk);
          margin: 0;
        }
        .go-accent { color: var(--amber); }
        .go-sub {
          max-width: 560px;
          margin: 26px auto 0;
          font-size: 16px;
          line-height: 1.6;
          color: var(--chalk-dim);
        }
        .go-scoreboard {
          margin: 52px auto 0;
          display: inline-flex;
          align-items: center;
          gap: 14px;
          padding: 18px 34px;
          border: 1px solid rgba(231,163,62,0.4);
          background: rgba(6,6,5,0.55);
          backdrop-filter: blur(6px);
        }
        .go-scoreboard .go-label {
          font-family: var(--font-mono), monospace;
          font-size: 13px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--chalk-dim);
        }
        .go-scoreboard .go-readout {
          font-family: var(--font-mono), monospace;
          font-weight: 500;
          font-size: clamp(18px, 2.6vw, 26px);
          letter-spacing: 0.14em;
          color: var(--amber);
          text-transform: uppercase;
        }
        .go-dot {
          animation: go-blink 1.6s steps(1) infinite;
        }
        @keyframes go-blink {
          0%, 45% { opacity: 1; }
          50%, 100% { opacity: 0.15; }
        }
        @media (prefers-reduced-motion: reduce) {
          .go-dot { animation: none; }
        }
        .go-ticker {
          margin-top: 64px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--chalk-dim);
        }
        .go-ticker span {
          padding: 0 18px;
          border-right: 1px solid var(--line);
        }
        .go-ticker span:last-child { border-right: none; }
        .go-footer {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 32px 6vw 40px;
          border-top: 1px solid var(--line);
        }
        .go-socials {
          display: flex;
          gap: 28px;
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .go-socials a {
          color: var(--chalk);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.15s, color 0.15s;
        }
        .go-socials a:hover { color: var(--amber); border-color: var(--amber); }
        .go-email {
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--clay);
        }
      `}</style>

      <div className="go-page">
        <img src="/hero.png" alt="" className="go-bg-photo" />
        <div className="go-bg-overlay" />

        <main className="go-main">
          <div className="go-eyebrow">Scouting report · Nairobi</div>
          <h1 className="go-h1">
            Kenya&apos;s women&apos;s
            <br />
            football <span className="go-accent">intelligence</span> hub
          </h1>
          <p className="go-sub">
            Player stats, team profiles, GPS tracking and scouting insights — built for coaches, scouts and clubs across Kenyan women&apos;s football.
          </p>

          <div className="go-scoreboard">
            <span className="go-label">Kickoff</span>
            <span className="go-readout">
              Launching soon<span className="go-dot"> ·</span>
            </span>
          </div>

          <div className="go-ticker">
            <span>Player stats</span>
            <span>Team profiles</span>
            <span>GPS tracking</span>
            <span>Scouting insights</span>
          </div>
        </main>

        <footer className="go-footer">
          <div className="go-socials">
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
            <a href="#">LinkedIn</a>
            <a href="#">Facebook</a>
          </div>
          <div className="go-email">gameoncollective@gmail.com</div>
        </footer>
      </div>
    </div>
  );
}
