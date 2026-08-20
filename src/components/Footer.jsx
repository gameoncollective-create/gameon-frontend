import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer>
      <div className="footer-wrap">
        <div>
          <div className="wordmark">
            <Logo />
            GAMEON COLLECTIVE
          </div>
          <p>Digital infrastructure for women's football in Africa — football intelligence, trusted data, athlete branding, and original storytelling.</p>
        </div>
        <div className="cols">
          <div>
            <h4>Platform</h4>
            <Link to="/data">Data Intelligence</Link>
            <Link to="/services">Services</Link>
            <Link to="/news">News &amp; Blog</Link>
            <Link to="/events">Events</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/contact">Contact</Link>
            <Link to="/data/players">Player directory</Link>
            <Link to="/data/standings">League standings</Link>
          </div>
        </div>
      </div>
      <p className="fine">GAMEON COLLECTIVE — KENYA WOMEN'S FOOTBALL INTELLIGENCE · DATA UPDATES AS NEW MATCHES ARE RECORDED</p>
    </footer>
  );
}
