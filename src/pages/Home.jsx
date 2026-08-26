import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameOnData } from '../DataContext.jsx';
import { api } from '../api.js';
import Reveal from '../components/Reveal.jsx';
import QuoteBreak from '../components/QuoteBreak.jsx';
import AthleteCard from '../components/AthleteCard.jsx';
import FallbackImage from '../components/FallbackImage.jsx';
import { ATHLETES } from '../athletesData.js';

const DI_TILES = [
  { label: 'Players', to: '/data/players', photo: '/images/tiles/players.jpg' },
  { label: 'Teams', to: '/data/teams', photo: '/images/tiles/teams.jpg' },
  { label: 'Standings', to: '/data/standings', photo: '/images/tiles/standings.jpg' },
  { label: 'Performance', to: '/data/gps', photo: '/images/tiles/performance.jpg' }
];

export default function Home() {
  const { store, allTeams } = useGameOnData();
  const totalPlayers = store.players.length;
  const totalTeams = allTeams.length;

  const teamNames = useMemo(() => allTeams.map(t => t.name).filter(Boolean), [allTeams]);
  const tickerNames = teamNames.length ? teamNames : ["Kenya Women's Premier League", 'National Super League', 'Division One'];
  const tickerList = [...tickerNames, ...tickerNames];

  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const debounceRef = useRef(null);
  const searchWrapRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!q.trim()) { setShowDrop(false); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await api(`/api/search?q=${encodeURIComponent(q.trim())}`);
        setResults(data.results || []);
        setShowDrop(true);
      } catch (e) { /* ignore */ }
    }, 220);
    return () => clearTimeout(debounceRef.current);
  }, [q]);

  useEffect(() => {
    function onClick(e) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) setShowDrop(false);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const apiOffline = store.loaded && !totalPlayers && !totalTeams;

  return (
    <>
      {/* HERO — full-bleed photo treatment */}
      <section className="photo-hero">
        <FallbackImage src="/images/hero.jpg" alt="" className="photo-hero-photo" />
        <div className="photo-hero-overlay"></div>
        <div className="photo-hero-inner">
          <div className="photo-hero-eyebrow">Kenya Women's Football</div>
          <h1>Find the players.<br />Know the teams.</h1>
          <p className="photo-hero-desc">A growing home for player and club profiles across Kenya's women's leagues, from the Premier League to Division One.</p>
          <div className="photo-hero-cta">
            <Link to="/data" className="btn">Explore the database →</Link>
          </div>
        </div>
        <div className="scroll-cue"><span className="bar"></span>Scroll</div>
      </section>

      {/* ABOUT — who's behind this */}
      <section id="about" className="light-section">
        <div className="container">
          <Reveal style={{ maxWidth: 780 }}>
            <div className="eyebrow">About GameOn</div>
            <h2 style={{ fontSize: 'clamp(2rem,4.2vw,3rem)', marginTop: 16 }}>We're building the infrastructure around the game.</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', marginTop: 20, lineHeight: 1.7 }}>
              GameOn Collective is a women's football platform based in Kenya. We bring together player and club data, athlete performance tracking, brand building and original football storytelling.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', marginTop: 16, lineHeight: 1.7 }}>
              Our goal is simple: make players easier to discover, performance easier to understand, and the women's game easier to follow.
            </p>
            <Link to="/services" className="view-link" style={{ display: 'inline-block', marginTop: 26 }}>About GameOn →</Link>
          </Reveal>
        </div>
      </section>

      {/* OUR PLAYERS — the 3 flagship athletes */}
      <section id="our-players" className="light-section">
        <div className="container">
          <Reveal style={{ maxWidth: 780, marginBottom: 44 }}>
            <div className="eyebrow">Athlete Program</div>
            <h2 style={{ fontSize: 'clamp(1.9rem,3.6vw,2.8rem)', marginTop: 16 }}>Working with players, not just profiling them.</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-dim)', marginTop: 18, lineHeight: 1.7 }}>
              We work directly with selected athletes on performance tracking, brand development and storytelling — building a clearer picture of the player on and off the pitch.
            </p>
          </Reveal>
          <Reveal className="athlete-grid">
            {ATHLETES.map(a => <AthleteCard key={a.slug} athlete={a} />)}
          </Reveal>
          <Reveal style={{ marginTop: 32 }}>
            <Link className="view-link" to="/services">Meet our players →</Link>
          </Reveal>
        </div>
      </section>

      {/* DATA INTELLIGENCE — search + 4-tile quick nav (dark section) */}
      <section style={{ paddingBottom: 44 }}>
        <div className="container">
          <Reveal style={{ maxWidth: 760 }}>
            <div className="eyebrow">Data Intelligence</div>
            <h2 style={{ fontSize: 'clamp(2.1rem,4.2vw,3.2rem)', marginTop: 16 }}>Search Kenya's women's football.</h2>
            <p className="sub" style={{ marginTop: 12 }}>Find players and clubs across Kenya's women's football pyramid.</p>
            <p className="sub" style={{ marginTop: 8 }}>Our database is growing as we add and update player, team and competition information across the women's game.</p>
          </Reveal>

          {apiOffline && (
            <Reveal style={{
              marginTop: 24, background: 'rgba(217,80,58,0.08)', border: '1px solid var(--coral)',
              color: 'var(--coral)', borderRadius: 8, padding: '14px 18px', fontFamily: 'var(--mono)',
              fontSize: '.82rem', maxWidth: 640
            }}>
              Can't reach the API right now — this page needs to run alongside your FastAPI backend to show live data.
            </Reveal>
          )}

          <Reveal className="hub-search" style={{ marginTop: 32 }}>
            <div ref={searchWrapRef} style={{ position: 'relative' }}>
              <input
                placeholder='Search players or clubs — e.g. "Vihiga Queens"'
                autoComplete="off"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
              {showDrop && (
                <div className="hub-search-drop show">
                  {results.length ? results.slice(0, 8).map(r => (
                    <Link key={r.type + r.id} to={`/data/${r.type === 'player' ? 'player/' + r.id : 'team/' + r.id}`}>
                      <span>{r.name}</span><span className="tag">{r.type}</span>
                    </Link>
                  )) : <div className="empty">No matches.</div>}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal className="hero-stats" style={{ borderTop: '1px solid var(--line)', marginTop: 38, paddingTop: 26 }}>
            <div><b>{totalPlayers || '—'}</b><span>Players tracked</span></div>
            <div><b>{totalTeams || '—'}</b><span>Clubs profiled</span></div>
            <div><b>4</b><span>Leagues covered</span></div>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="di-tiles">
            {DI_TILES.map(t => (
              <Link key={t.label} to={t.to} className="di-tile">
                <FallbackImage src={t.photo} alt="" className="di-tile-photo" />
                <span className="di-tile-label">{t.label}</span>
                <span className="di-tile-arrow">Open →</span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* QUOTE — moved here, right before "Let's make the difference" */}
      <QuoteBreak
        eyebrow="In their words"
        quote="Football was my stepping stone to a better life"
        attribution="Doreen Nabwire"
      />

      <section className="light-section" style={{ paddingTop: 60 }}>
        <div className="container">
          <Reveal style={{ maxWidth: 900 }}>
            <h2 style={{ fontSize: 'clamp(2.4rem,6vw,4.4rem)', marginBottom: 22 }}>Let's make the difference.</h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-dim)', maxWidth: '56ch', marginBottom: 26 }}>
              GameOn Collective is building the digital infrastructure for women's football in Africa — athlete brand building, athlete performance data, and data-driven storytelling, in one place.
            </p>
            <Link to="/services" className="btn btn-outline" style={{ borderColor: 'var(--line-2)' }}>See what we do →</Link>
          </Reveal>
        </div>
      </section>

      <div className="light-section ticker-wrap" style={{ borderColor: 'var(--line)' }}>
        <div className="ticker">
          {tickerList.map((n, i) => <span key={i}>{n}</span>)}
        </div>
      </div>

      {/* AUDIENCES — photo-backed dark band */}
      <section className="segment-band">
        <FallbackImage src="/images/segment-bg.jpg" alt="" className="segment-band-photo" />
        <div className="segment-band-overlay"></div>
        <div className="container">
          <Reveal className="section-head" as="div">
            <h2 style={{ fontSize: 'clamp(1.9rem,3.4vw,2.6rem)' }}>For scouts, agents, clubs, and everyone chasing talent.</h2>
            <p className="sub">Scouts, academies, clubs and sponsors — the people finding, developing, and backing talent.</p>
          </Reveal>
          <Reveal className="segment-grid">
            <div className="segment">
              <div className="seg-tag">Scouts</div>
              <h4>Compare talent, backed by data.</h4>
              <p>Scout scores, GPS metrics and side-by-side player comparisons — not just word of mouth.</p>
              <Link to="/data/compare">Open the compare tool →</Link>
            </div>
            <div className="segment">
              <div className="seg-tag">Academies</div>
              <h4>Track development, prove progress.</h4>
              <p>Player-level records that follow a prospect from first appearance to first call-up.</p>
              <Link to="/data/players">View player directory →</Link>
            </div>
            <div className="segment">
              <div className="seg-tag">Clubs</div>
              <h4>Bring your squad's data online.</h4>
              <p>Rosters, standings and performance tracking built for how your club actually runs.</p>
              <Link to="/data">Open the platform →</Link>
            </div>
            <div className="segment">
              <div className="seg-tag">Sponsors</div>
              <h4>Reach audiences that matter.</h4>
              <p>Sponsorship, content and campaign support inside a fast-growing sport.</p>
              <Link to="/services">See partnership options →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="light-section">
        <div className="container">
          <Reveal className="section-head" as="div">
            <h2 style={{ fontSize: 'clamp(1.9rem,3.4vw,2.6rem)' }}>Services</h2>
          </Reveal>
          <Reveal className="pillars cols-3">
            <div className="pillar">
              <div className="num">01</div>
              <h3>Brand Building</h3>
              <p>Helping players build a public identity backed by real performance — not just a highlight reel.</p>
              <Link to="/services">View services →</Link>
            </div>
            <div className="pillar">
              <div className="num">02</div>
              <h3>Social Media</h3>
              <p>Channel management, content calendars, and audience growth for athletes and clubs.</p>
              <Link to="/services">View services →</Link>
            </div>
            <div className="pillar">
              <div className="num">03</div>
              <h3>Content</h3>
              <p>Original photography, video, and storytelling — grounded in real numbers, not just narrative.</p>
              <Link to="/news">Read the latest →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ paddingBottom: 110 }}>
        <div className="container">
          <Reveal className="talk-block">
            <h2><span className="w1">LET'S</span> <span className="w2">TALK</span></h2>
            <p style={{ fontFamily: 'var(--mono)', color: 'var(--text-dim)', marginTop: 22, fontSize: '1rem' }}>
              Clubs · Federations · Brand partners · Scouts · Academies
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 32 }}>
              <Link to="/contact" className="btn btn-primary">Get in touch →</Link>
              <Link to="/services" className="btn btn-outline">Our services</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
