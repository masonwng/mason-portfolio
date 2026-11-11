import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { dailyStats, backfillHistory, msUntilNextDaily, countdownLabel } from '../public/projects/itemle/stats.js';
import { shareText, dailyItem } from '../public/projects/itemle/core.js';
import { newAttack, answerAttack, attackQuestion, attackStage, multiplier, skipQuestion, MAX_STAGE } from '../public/projects/math-ascension/timeattack.mjs';
import { newRun, climbBar } from '../public/projects/math-ascension/core.mjs';
import { ACHIEVEMENTS, CARROTS, applyStatus, applyVisit, emptyProgress, restoreProgress, skyPhase } from '../app/lib/farm-achievements.mjs';

const { items } = JSON.parse(fs.readFileSync(new URL('../public/projects/itemle/data.json', import.meta.url)));

test('Itemdle stats: streaks survive until today is missed, and best streak spans gaps', () => {
  const history = { '2026-11-01': 1, '2026-11-02': 3, '2026-11-03': 2, '2026-11-08': 12, '2026-11-09': 4 };
  const s = dailyStats(history, '2026-11-10');
  assert.equal(s.wins, 5);
  assert.equal(s.current, 2, 'yesterday and the day before still count before today is played');
  assert.equal(s.best, 3);
  assert.deepEqual(s.distribution, [1, 1, 1, 1, 0, 0, 0, 0, 0, 1]);
  assert.equal(s.average, 4.4);
  assert.equal(dailyStats(history, '2026-11-12').current, 0, 'missing a full day breaks the streak');
  assert.deepEqual(dailyStats({ bad: 3, '2026-11-01': 0, '2026-11-02': 'x' }, '2026-11-02').wins, 0);
});

test('Itemdle stats: history backfills from saved daily rounds', () => {
  const day = '2026-11-05', answer = dailyItem(items, day), wrong = items.find(i => i.id !== answer.id);
  const filled = backfillHistory({}, { [day]: [wrong.id, answer.id], '2026-11-06': [wrong.id] }, d => dailyItem(items, d).id);
  assert.deepEqual(filled, { [day]: 2 }, 'unfinished rounds are not wins');
  assert.deepEqual(backfillHistory({ [day]: 1 }, { [day]: [wrong.id, answer.id] }, d => dailyItem(items, d).id), { [day]: 1 }, 'recorded results win');
});

test('Itemdle countdown counts to the next UTC midnight', () => {
  const now = Date.UTC(2026, 10, 11, 22, 59, 30);
  assert.equal(msUntilNextDaily(now), 60 * 60 * 1000 + 30 * 1000);
  assert.equal(countdownLabel(msUntilNextDaily(now)), '01:00:30');
  assert.equal(countdownLabel(-5), '00:00:00');
});

test('Itemdle share text marks near misses, rank, streak, and hard mode', () => {
  const answer = dailyItem(items, '2026-11-11');
  const near = items.find(i => i.id !== answer.id && i.components.some(c => answer.components.some(a => a.id === c.id)));
  const far = items.find(i => i.id !== answer.id && !i.components.some(c => answer.components.some(a => a.id === c.id)));
  const text = shareText({ day: '2026-11-11', mode: 'daily', guesses: [far.id, near.id, answer.id], answer, items, streak: 4, hard: true });
  assert.match(text, /^Itemdle 2026-11-11 · hard mode · 3 guesses · 💜 Master 4\/6/);
  assert.match(text, /⬜🟨🟩/);
  assert.match(text, /🔥 4-day streak/);
  assert.doesNotMatch(shareText({ day: 'x', mode: 'practice', guesses: [answer.id], answer, items, streak: 9 }), /streak/, 'practice rounds have no streak');
  assert.match(shareText({ day: 'x', mode: 'practice', guesses: [answer.id], answer, items }), /1 guess ·/);
});

test('Time Attack: correct answers score by grade and combo, misses reset the combo', () => {
  let attack = { ...newAttack(12345), status: 'playing' };
  const solve = () => { const q = attackQuestion(attack); return answerAttack(attack, q.type === 'choice' ? q.options.find(o => o.text === q.answerText).id : q.answer); };
  const points = [];
  for (let i = 0; i < 6; i++) { const r = solve(); assert.ok(r.correct, `question ${i} should be solved`); points.push(r.points); attack = r.attack; }
  // Grade rises every two correct answers; the multiplier rises every three in a row.
  assert.deepEqual(points, [10, 10, 40, 40, 60, 90]);
  assert.equal(attack.score, 250);
  assert.equal(attack.bestCombo, 6);
  const miss = answerAttack(attack, '123456789');
  assert.equal(miss.correct, false);
  assert.equal(miss.attack.combo, 0);
  assert.equal(miss.attack.score, 250);
  assert.equal(miss.attack.index, attack.index + 1, 'a miss moves on to a new question');
  assert.equal(answerAttack(attack, '').valid, false, 'empty input costs nothing');
  assert.equal(skipQuestion(attack).combo, 0);
  assert.equal(answerAttack({ ...attack, status: 'over' }, '1').valid, false);
});

test('Time Attack: multiplier and grade are capped', () => {
  assert.deepEqual([0, 2, 3, 6, 12, 99].map(multiplier), [1, 1, 2, 3, 5, 5]);
  assert.equal(attackStage({ correct: 100 }), MAX_STAGE);
});

test('Math Ascension climb bar shows progress, a crash for One-Life, and the summit', () => {
  const base = newRun('challenge', 1);
  assert.equal(climbBar({ ...base, correct: 3, status: 'lost' }), '🟩🟩🟩💥' + '⬜'.repeat(10));
  assert.equal(climbBar({ ...base, correct: 0, status: 'playing' }), '🧗' + '⬜'.repeat(13));
  assert.equal(climbBar({ ...base, correct: 14, status: 'won' }), '🟩'.repeat(14) + '🏔️');
});

test('Farm achievements unlock from scene events and Farmhand needs all the others', () => {
  let progress = emptyProgress(), unlocked = [];
  const apply = msg => { const r = applyStatus(progress, msg); progress = r.progress; unlocked.push(...r.unlocked); };
  for (let i = 0; i < CARROTS - 1; i++) apply('Carrot picked.');
  apply('Carrot replanted.');
  assert.ok(!progress.unlocked.includes('harvest'));
  apply('Carrot picked.'); apply('Carrot picked.');
  assert.ok(progress.unlocked.includes('harvest'));
  for (const id of [1, 2, 2, 3]) apply(`Splash! Pig ${id} made it. Tap it to go again.`);
  for (let i = 0; i < 25; i++) apply(`Pig ${1 + i % 3} got a push.`);
  for (const msg of ['Barn open.', 'Picked up a cow.', 'Picked up a chicken.', 'Barn open.']) apply(msg);
  assert.deepEqual(unlocked, ['harvest', 'splash', 'pusher', 'barn', 'cow', 'chicken'], 'each badge unlocks once');
  const night = applyVisit(progress, 23);
  assert.deepEqual(night.unlocked, ['night', 'farmhand']);
  assert.equal(night.progress.unlocked.length, ACHIEVEMENTS.length);
  assert.deepEqual(applyVisit(progress, 12).unlocked, []);
  assert.equal(applyStatus({ ...progress, carrots: 5 }, 'Farm reset.').progress.carrots, 0);
});

test('Farm progress restore drops malformed data, and sky phases follow the clock', () => {
  assert.deepEqual(restoreProgress({ pushes: -1, unlocked: ['cow', 'hack', 7] }), { carrots: 0, splashed: [], pushes: 0, unlocked: ['cow'] });
  assert.deepEqual(restoreProgress('nope'), emptyProgress());
  assert.deepEqual([0, 4, 5, 6, 7, 12, 17, 18, 20, 21, 23].map(skyPhase), ['night', 'night', 'golden', 'golden', 'day', 'day', 'day', 'golden', 'golden', 'night', 'night']);
});
