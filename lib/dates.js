// The five people who can "log in" by picking their name.
// Add or remove names here to change who can use the app.
export const USERS = ['Joris', 'Frederique', 'Jep', 'Maurice', 'Martine'];

// Fixed anchor point: the first Thursday on/after 2025-01-01.
// Every edition after this is exactly a multiple of 14 days from here,
// so the schedule stays stable forever without needing to store anything.
function getAnchor() {
  const d = new Date(Date.UTC(2025, 0, 1));
  while (d.getUTCDay() !== 4) {
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return d;
}

// Returns a Date (UTC midnight) for edition index n (n can be negative to look back).
export function editionDateForIndex(n) {
  const anchor = getAnchor();
  const d = new Date(anchor);
  d.setUTCDate(d.getUTCDate() + n * 14);
  return d;
}

// Formats a Date as YYYY-MM-DD (used as the storage key / URL param).
export function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

// Human-readable Dutch label, e.g. "donderdag 21 augustus 2026".
export function formatEditionLabel(d) {
  return d.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// The index of the next upcoming (or today's) edition.
export function getUpcomingIndex() {
  const anchor = getAnchor();
  const now = new Date();
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  let n = Math.floor((todayUTC - anchor.getTime()) / 86400000 / 14);
  while (editionDateForIndex(n).getTime() < todayUTC) {
    n += 1;
  }
  return n;
}
