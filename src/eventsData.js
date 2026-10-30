// `source` distinguishes: 'gameon' (our own events), 'community'
// (other organizations' events we're surfacing), 'fixture' (real
// league matches — the "what's on this weekend" category).
//
// `date` (YYYY-MM-DD) controls when an event disappears: the Events page
// only shows events from today onwards, so past fixtures drop off
// automatically and the page never looks out of date.
//
// HOW TO ADD NEXT WEEK'S FIXTURES: copy a line, change the date, day,
// month, teams, venue and time, and give it a new id.
//
// Matchweek 6 — FKF Women's Premier League, 31 Oct – 1 Nov 2026.
export const EVENTS = [
  { id: 101, date: '2026-10-31', month: 'OCT', day: '31', type: 'Match', source: 'fixture', title: 'Shabana Starlets vs Gideon Starlets', location: 'Green Stadium Awendo · 13:00 EAT', status: 'Matchweek 6' },
  { id: 102, date: '2026-10-31', month: 'OCT', day: '31', type: 'Match', source: 'fixture', title: 'Mathare United Women vs Bungoma Queens', location: 'Dandora Stadium · 14:00 EAT', status: 'GameOn athletes playing' },
  { id: 103, date: '2026-10-31', month: 'OCT', day: '31', type: 'Match', source: 'fixture', title: 'Police Bullets vs Ulinzi Starlets', location: 'Police Sacco Grounds · 14:00 EAT', status: 'Matchweek 6' },
  { id: 104, date: '2026-10-31', month: 'OCT', day: '31', type: 'Match', source: 'fixture', title: 'Elim White Ladies vs Vihiga Queens', location: 'Ndura Sports Complex · 15:00 EAT', status: 'Matchweek 6' },
  { id: 105, date: '2026-10-31', month: 'OCT', day: '31', type: 'Match', source: 'fixture', title: 'Trinity Starlets vs Zetech Sparks', location: 'Afraha Stadium · 15:00 EAT', status: 'Matchweek 6' },
  { id: 106, date: '2026-11-01', month: 'NOV', day: '1', type: 'Match', source: 'fixture', title: 'Kayole Starlet vs Kibera Soccer Women', location: 'Vapor Grounds · 15:00 EAT', status: 'Matchweek 6' },
];

// Events still to come (today or later), in date order.
export function upcomingEvents(list = EVENTS, today = new Date()) {
  const todayStr = today.toISOString().slice(0, 10);
  return list
    .filter(e => !e.date || e.date >= todayStr)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
}
