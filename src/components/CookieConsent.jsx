import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadAnalytics } from '../analytics.js';

const STORAGE_KEY = 'gameon_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let choice = null;
    try { choice = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }

    if (choice === 'accepted') {
      loadAnalytics();
    } else if (choice !== 'declined') {
      setVisible(true);
    }
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, 'accepted'); } catch (e) { /* ignore */ }
    loadAnalytics();
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(STORAGE_KEY, 'declined'); } catch (e) { /* ignore */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p>
        We use cookies to understand site traffic (Google Analytics). See our{' '}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
      <div className="cookie-banner-actions">
        <button type="button" className="btn btn-outline" onClick={decline}>Decline</button>
        <button type="button" className="btn btn-primary" onClick={accept}>Accept</button>
      </div>
    </div>
  );
}
