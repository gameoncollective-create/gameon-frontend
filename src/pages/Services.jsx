import { Link } from 'react-router-dom';
import AthleteCard from '../components/AthleteCard.jsx';
import { ATHLETES } from '../athletesData.js';
import Reveal from '../components/Reveal.jsx';

export default function Services() {
  return (
    <>
      <section style={{ paddingBottom: 60 }}>
        <div className="container">
          <div className="eyebrow">Services</div>
          <h1 style={{ fontSize: 'clamp(2.8rem,7vw,5.6rem)', margin: '20px 0 22px', maxWidth: '16ch' }}>
            Off-pitch growth for the people carrying the game.
          </h1>
          <p style={{ color: 'var(--text-dim)', maxWidth: '62ch', fontSize: '1.1rem' }}>
            Alongside our data platform, GameOn Collective runs hands-on brand and media services — turning performance data and matchday moments into something players and clubs can build a following, and a career, on.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="service-block">
            <div>
              <div className="service-index">Service 01</div>
              <h3>Athlete Brand Building</h3>
              <p>We help players and clubs define a public identity that matches who they actually are — on the pitch and off it — then build the assets to carry it.</p>
              <ul className="service-list">
                <li>Personal &amp; club brand strategy</li>
                <li>Athlete profile pages, powered by real performance data</li>
                <li>Sponsor-ready media kits and player one-pagers</li>
                <li>Guidance on partnerships and commercial opportunities</li>
              </ul>
              <Link to="/contact" className="btn btn-outline">Start a brand conversation →</Link>
            </div>
            <div className="service-visual tile-a">
              <span className="tag-word">BRAND</span>
              <div className="fg"><div className="metric">1:1</div><div className="metric-label">Data-backed player profile</div></div>
            </div>
          </Reveal>

          <Reveal className="service-block reverse">
            <div>
              <div className="service-index">Service 02</div>
              <h3>Social Media</h3>
              <p>Consistent, well-produced presence across platforms — so attention earned on matchday doesn't disappear by Monday.</p>
              <ul className="service-list">
                <li>Channel setup, strategy and content calendars</li>
                <li>Matchday coverage and highlight packaging</li>
                <li>Community management and audience growth</li>
                <li>Performance reporting tied back to real engagement data</li>
              </ul>
              <Link to="/contact" className="btn btn-outline">Talk social strategy →</Link>
            </div>
            <div className="service-visual tile-c">
              <span className="tag-word">SOCIAL</span>
              <div className="fg"><div className="metric">24/7</div><div className="metric-label">Content calendar coverage</div></div>
            </div>
          </Reveal>

          <Reveal className="service-block">
            <div>
              <div className="service-index">Service 03</div>
              <h3>Content Strategy</h3>
              <p>Original photography, video, and written storytelling from pitchside — built for players, clubs, federations, and the partners backing them.</p>
              <ul className="service-list">
                <li>Matchday photography and video coverage</li>
                <li>Player features and long-form storytelling</li>
                <li>Sponsor and partner campaign content</li>
                <li>Archival footage and season recap packages</li>
              </ul>
              <Link to="/contact" className="btn btn-outline">Commission content →</Link>
            </div>
            <div className="service-visual tile-d">
              <span className="tag-word">STORY</span>
              <div className="fg"><div className="metric">6+</div><div className="metric-label">Original stories published monthly</div></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 20 }}>
        <div className="container">
          <Reveal className="section-head" as="div">
            <h2 style={{ fontSize: 'clamp(2.2rem,4.6vw,3.4rem)' }}>Meet the first three.</h2>
            <p className="sub">Three Kenyan footballers. The first women in the country to train and play wearing GPS performance vests — brand, content, and weekly performance data, all built together.</p>
          </Reveal>
          <Reveal className="athlete-grid">
            {ATHLETES.map(a => <AthleteCard key={a.slug} athlete={a} />)}
          </Reveal>
        </div>
      </section>

      <section style={{ paddingTop: 0, paddingBottom: 110 }}>
        <div className="container">
          <div className="gps-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div className="eyebrow">Not sure where to start?</div>
              <h2 style={{ fontSize: '2.4rem', marginTop: 14 }}>Tell us about your club, brand, or federation.</h2>
            </div>
            <Link to="/contact" className="btn btn-primary">Contact us →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
