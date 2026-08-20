// `source` distinguishes: 'gameon' (our own events), 'community'
// (other organizations' events we're surfacing), 'fixture' (real
// league matches — the "what's on this weekend" category).
//
// FKF Women's Premier League Match Week One fixtures (below) are
// REAL, from the official @fkfwpl / @football_kenya_federation
// announcement. Venues/kickoff times weren't published by the
// federation at time of posting — marked "Venue TBA" honestly
// rather than guessed. Update once FKF confirms.
export const EVENTS = [
  { id: 1, month: 'SEP', day: '12', type: 'Match', source: 'fixture', title: 'Gideons Starlets FC vs Ulinzi Starlets', location: 'Venue TBA', status: 'Match Week One' },
  { id: 2, month: 'SEP', day: '12', type: 'Match', source: 'fixture', title: 'Police Bullets FC vs Bungoma Queens FC', location: 'Venue TBA', status: 'Match Week One' },
  { id: 3, month: 'SEP', day: '12', type: 'Match', source: 'fixture', title: 'Mathare United Women vs Vihiga Queens FC', location: 'Venue TBA', status: 'Match Week One' },
  { id: 4, month: 'SEP', day: '13', type: 'Match', source: 'fixture', title: 'Elim White Ladies FC vs Zetech Sparks FC', location: 'Venue TBA', status: 'Match Week One' },
  { id: 5, month: 'SEP', day: '13', type: 'Match', source: 'fixture', title: 'Trinity Starlets FC vs Kibera Soccer Women', location: 'Venue TBA', status: 'Match Week One' },
  { id: 6, month: 'SEP', day: '13', type: 'Match', source: 'fixture', title: 'Kayole Starlet FC vs Shabana Starlets FC', location: 'Venue TBA', status: 'Match Week One' },
  { id: 7, month: 'AUG', day: '16', type: 'Workshop', source: 'gameon', title: 'Athlete Branding Clinic', location: 'Nairobi', status: 'Registration open' },
  { id: 8, month: 'JUN', day: '—', type: 'Milestone', source: 'gameon', title: 'GPS Lab — 3-vest pilot underway', location: 'Nairobi', status: 'In progress' },
  { id: 9, month: 'AUG', day: '20', type: 'Community', source: 'community', title: "Football Kenya Federation Women's Forum", location: 'Nairobi', status: 'Open to public' }
];