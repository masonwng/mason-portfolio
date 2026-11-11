// Pure helpers for the daily stats panel. No DOM or storage access, so they are easy to test.
import { utcDay } from './core.js';

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const shift = (day, by) => { const d = new Date(`${day}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + by); return utcDay(d); };

/**
 * @param {Record<string, number>} history  day -> guesses needed to win
 * @param {string} today                    UTC day, YYYY-MM-DD
 */
export function dailyStats(history, today) {
  const entries = Object.entries(history || {}).filter(([day, n]) => DAY.test(day) && Number.isInteger(n) && n > 0);
  const days = new Set(entries.map(([day]) => day));
  // The streak stays alive until today's puzzle is missed, so start from yesterday if today isn't solved yet.
  let current = 0, cursor = days.has(today) ? today : shift(today, -1);
  while (days.has(cursor)) { current++; cursor = shift(cursor, -1); }
  let best = 0, run = 0, previous = null;
  for (const day of [...days].sort()) { run = previous && shift(previous, 1) === day ? run + 1 : 1; best = Math.max(best, run); previous = day; }
  const distribution = Array.from({ length: 10 }, () => 0); // 1..9 guesses, then 10+
  for (const [, n] of entries) distribution[Math.min(n, 10) - 1]++;
  const total = entries.reduce((sum, [, n]) => sum + n, 0);
  return { wins: entries.length, current, best, distribution, average: entries.length ? Math.round(total / entries.length * 10) / 10 : 0 };
}

/** Rebuilds history from saved daily guess arrays (`itemle:<revision>:<day>`) for players who won before history existed. */
export function backfillHistory(history, savedRounds, answerFor) {
  const next = { ...(history || {}) };
  for (const [day, guesses] of Object.entries(savedRounds)) {
    if (next[day] || !Array.isArray(guesses)) continue;
    const index = guesses.indexOf(answerFor(day));
    if (index >= 0) next[day] = index + 1;
  }
  return next;
}

/** Milliseconds until the next UTC midnight, when a new daily recipe unlocks. */
export function msUntilNextDaily(now = Date.now()) {
  const next = new Date(now); next.setUTCHours(24, 0, 0, 0);
  return next.getTime() - now;
}

export function countdownLabel(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(n => String(n).padStart(2, '0')).join(':');
}
