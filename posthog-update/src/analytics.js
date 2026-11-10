// Analytics for gameoncollective.com: Google Analytics (GA4) + PostHog.
//
// Both only load once the visitor accepts cookies via the consent banner
// (src/components/CookieConsent.jsx). Until then every call below is a no-op,
// so components can call trackEvent() freely without checking consent.
//
// This is a single-page React app, so automatic page views would only fire
// once per visit. Instead, src/components/RouteTracker.jsx calls
// trackPageView() on every route change, with a proper page title.
//
// Internal traffic: open any page with ?internal=1 once on your own
// browser/phone and your visits are tagged traffic_type=internal in both GA
// and PostHog, so they can be filtered out. Use ?internal=0 to undo it.
//
// Settings (Vercel → Settings → Environment Variables):
//   VITE_GA_MEASUREMENT_ID  Google Analytics measurement ID (G-...)
//   VITE_POSTHOG_KEY        PostHog project token (phc_...)
//   VITE_POSTHOG_HOST       https://eu.i.posthog.com or https://us.i.posthog.com
// If a setting is missing, that tool simply isn't loaded.

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';
const INTERNAL_KEY = 'gameon_internal_traffic';

let loaded = false;
let posthogLoaded = false;

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

function loadGoogleAnalytics(internal) {
  if (!GA_MEASUREMENT_ID) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());

  const config = { send_page_view: false };
  if (internal) config.traffic_type = 'internal';
  gtag('config', GA_MEASUREMENT_ID, config);
}

// PostHog's standard loader: queues calls until the library arrives from
// PostHog's CDN, so no npm package is needed.
function loadPostHog(internal) {
  if (!POSTHOG_KEY) return;

  /* eslint-disable */
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  /* eslint-enable */

  window.posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only', // anonymous visitors don't create person records
    capture_pageview: false,            // RouteTracker sends page views on each route change
    capture_pageleave: true,
    autocapture: true,
    session_recording: {
      maskAllInputs: true,              // nothing typed into forms is ever recorded
    },
  });

  if (internal) window.posthog.register({ traffic_type: 'internal' });
  posthogLoaded = true;
}

export function loadAnalytics() {
  if (loaded) return;
  loaded = true;

  const internal = readInternalFlag();
  loadGoogleAnalytics(internal);
  loadPostHog(internal);

  // Count the page the visitor is on when they accept cookies.
  trackPageView();
}

export function trackPageView() {
  if (!loaded) return;
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }
  if (posthogLoaded) {
    window.posthog.capture('$pageview', { title: document.title });
  }
}

export function trackEvent(name, params = {}) {
  if (!loaded) return;
  if (window.gtag) window.gtag('event', name, params);
  if (posthogLoaded) window.posthog.capture(name, params);
}
