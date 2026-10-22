import { normalize } from './core.js';
export const DIFFICULTIES = {
  easy: { attempts: 8, hints: 3, multiplier: 1, visible: 2 },
  normal: { attempts: 5, hints: 2, multiplier: 1.5, visible: 1 },
  hard: { attempts: 3, hints: 1, multiplier: 2, visible: 0 },
};
export function validateBank(bank) {
  if (bank?.schemaVersion !== 1 || !/^\d+\.\d+\.\d+$/.test(bank.patch) || !/^\d{4}-\d{2}-\d{2}$/.test(bank.reviewedOn) || !Array.isArray(bank.items) || !Array.isArray(bank.builds) || !bank.builds.length) throw Error('Invalid build snapshot');
  const ids = new Set(bank.items.map(i => i.id));
  if (ids.size !== bank.items.length || bank.items.some(i => typeof i.id !== 'string' || !/^\d+$/.test(i.id) || typeof i.name !== 'string' || !Number.isFinite(i.gold) || !Array.isArray(i.tags))) throw Error('Invalid item metadata');
  if (bank.builds.some(b => !/^[A-Za-z0-9]+$/.test(b.champion) || typeof b.role !== 'string' || typeof b.championName !== 'string' || !Array.isArray(b.items) || b.items.length < 3 || new Set(b.items).size !== b.items.length || b.items.some(id => !ids.has(id)) || !/^https:\/\//.test(b.sourceUrl))) throw Error('Unverified or missing build relationships');
  return bank;
}
export function createRound(bank, mode = 'champions', difficulty = 'normal', random = Math.random, previous = '') {
  validateBank(bank); if (!DIFFICULTIES[difficulty]) throw Error('Unknown difficulty');
  const candidates = bank.builds.flatMap((build, buildIndex) => build.items.map((answerId, slot) => ({ buildIndex, answerId, slot, id: `${mode}:${buildIndex}:${slot}` }))).filter(q => q.id !== previous);
  const q = candidates[Math.floor(random() * candidates.length)];
  return { ...q, mode, difficulty, guesses: [], hints: 0, status: 'playing', started: Date.now(), finished: null };
}
export function score(round) { return round.status === 'lost' ? 0 : Math.max(0, Math.round((100 - Math.max(0, round.guesses.length - (round.status === 'won' ? 1 : 0)) * 15 - round.hints * 20) * DIFFICULTIES[round.difficulty].multiplier)); }
export function submitGuess(round, itemId, bank) {
  if (round.status !== 'playing' || round.guesses.includes(itemId) || !bank.items.some(i => i.id === itemId)) return round;
  const guesses = [...round.guesses, itemId]; const status = itemId === round.answerId ? 'won' : guesses.length >= DIFFICULTIES[round.difficulty].attempts ? 'lost' : 'playing';
  return { ...round, guesses, status, finished: status !== 'playing' ? Date.now() : null };
}
export function requestHint(round) { return round.status === 'playing' && round.hints < DIFFICULTIES[round.difficulty].hints ? { ...round, hints: round.hints + 1 } : round; }
export function cluesFor(round, bank) {
  const answer = bank.items.find(i => i.id === round.answerId), build = bank.builds[round.buildIndex];
  const related = bank.builds.filter(b => b.items.includes(answer.id));
  const clues = related.map(b => ({ text: `Appears in ${b.championName}’s reviewed ${b.role} core build.`, champion: b.champion, name: b.championName }));
  clues.push({ text: `Total cost: ${answer.gold} gold.` }, { text: `Item categories: ${answer.tags.join(', ')}.` }, { text: `The item name starts with “${answer.name[0]}”.` });
  if (round.mode === 'complete') return [{ text: `The missing item is in position ${round.slot + 1} of this published core sequence.` }, ...clues.filter(c => !c.champion)];
  // Start with the selected champion; the other verified relationships follow.
  return [...clues.filter(c => c.champion === build.champion), ...clues.filter(c => c.champion !== build.champion)];
}
export function visibleClues(round, bank) { const count = (round.difficulty === 'easy' ? 2 : 1) + round.hints + Math.min(round.guesses.length, 2); return cluesFor(round, bank).slice(0, count); }
export function findGuess(bank, value) { return bank.items.find(i => normalize(i.name) === normalize(value)); }
export function restoreRound(raw, bank) {
  try { const r = JSON.parse(raw), b = bank.builds[r?.buildIndex];
    if (!r || !['champions', 'complete'].includes(r.mode) || !DIFFICULTIES[r.difficulty] || !b || b.items[r.slot] !== r.answerId || r.id !== `${r.mode}:${r.buildIndex}:${r.slot}` || !Array.isArray(r.guesses) || new Set(r.guesses).size !== r.guesses.length || r.guesses.some(id => !bank.items.some(i => i.id === id)) || r.guesses.length > DIFFICULTIES[r.difficulty].attempts || !Number.isInteger(r.hints) || r.hints < 0 || r.hints > DIFFICULTIES[r.difficulty].hints || !Number.isFinite(r.started) || r.started < 0 || r.started > Date.now()) return null;
    const won = r.guesses.at(-1) === r.answerId, status = won ? 'won' : r.guesses.length === DIFFICULTIES[r.difficulty].attempts ? 'lost' : 'playing';
    if (r.guesses.slice(0, -1).includes(r.answerId) || r.status !== status || status === 'playing' && r.finished !== null || status !== 'playing' && (!Number.isFinite(r.finished) || r.finished < r.started)) return null;
    return r;
  } catch { return null; }
}
