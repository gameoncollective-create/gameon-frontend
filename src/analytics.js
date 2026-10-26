// Google Analytics is only loaded once the visitor accepts cookies via the
// consent banner (src/components/CookieConsent.jsx) — see src/main.jsx for
// the previous unconditional version this replaced.
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let loaded = false;

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
  gtag('config', GA_MEASUREMENT_ID);
}
