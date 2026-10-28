// Google Analytics (GA4) for gameoncollective.com.
//
// GA only loads once the visitor accepts cookies via the consent banner
// (src/components/CookieConsent.jsx). Until then every call below is a no-op,
// so components can call trackEvent() freely without checking consent.
//
// This is a single-page React app, so GA's automatic page_view would only
// fire once per visit. Instead, src/components/RouteTracker.jsx calls
// trackPageView() on every route change, with a proper page title.
//
// Internal traffic: open any page with ?internal=1 once on your own
// browser/phone and your visits are tagged traffic_type=internal, which the
// "Internal Traffic" data filter in GA Admin can then exclude. Use
// ?internal=0 to undo it.

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const INTERNAL_KEY = 'gameon_internal_traffic';

let loaded = false;

function readInternalFlag() {
  try {
    const param = new URLSearchParams(window.location.search).get('internal');
    if (param === '1') localStorage.setItem(INTERNAL_KEY, '1');
    if (param === '0') localStorage.removeItem(INTERNAL_KEY);
    return localStorage.getItem(INTERNAL_KEY) === '1';
  } catch (e) {
    return false;
  }
}

export function loadAnalytics() {
  if (loaded || !GA_MEASUREMENT_ID) return;
  loaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());

  const config = { send_page_view: false };
  if (readInternalFlag()) config.traffic_type = 'internal';
  gtag('config', GA_MEASUREMENT_ID, config);

  // Count the page the visitor is on when they accept cookies.
  trackPageView();
}

export function trackPageView() {
  if (!loaded || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });
}

export function trackEvent(name, params = {}) {
  if (!loaded || !window.gtag) return;
  window.gtag('event', name, params);
}
