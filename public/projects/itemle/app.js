import { puzzleRank, utcDay, dailyItem, normalize, compare, restore, shareText } from './core.js';
import { $, el, read, write, timeLabel, itemImage, soundToggle, celebrate, copyResult } from './ui.js';
import { attachSearch } from './search.js';
let data, items = [], answer, guesses = [], mode = 'daily', day = utcDay(), storageKey = '', timing, previousAnswer;
const closeSearch = attachSearch($('guess'), $('suggestions'), () => items, () => guesses);
soundToggle($('sound'));
function start(nextMode) {
  mode = nextMode; day = utcDay();
  const pool = items.filter(i => i.id !== previousAnswer);
  answer = mode === 'daily' ? dailyItem(items, day) : pool[crypto.getRandomValues(new Uint32Array(1))[0] % pool.length];
  previousAnswer = answer.id;
  storageKey = `itemle:${data.revision || data.version}:${day}`;
  // Keep the original daily key and array format so existing progress survives.
  guesses = mode === 'daily' ? restore(JSON.stringify(read(storageKey, [])), items, answer) : [];
  const savedTiming = mode === 'daily' ? read(`${storageKey}:timing`) : null;
  timing = savedTiming && Number.isFinite(savedTiming.start) ? savedTiming : { start: Date.now(), end: null };
  if (mode === 'daily') write(`${storageKey}:timing`, timing);
  $('daily').setAttribute('aria-pressed', mode === 'daily'); $('practice').setAttribute('aria-pressed', mode === 'practice');
  $('day').textContent = mode === 'daily' ? `${day} · UTC` : 'no daily limit';
  $('message').textContent = ''; $('share-status').textContent = ''; $('guess').value = ''; closeSearch(); render();
}
function stats() {
  const records = read('itemle:results', {});
  const entries = Object.entries(records && typeof records === 'object' ? records : {}).filter(([, v]) => typeof v === 'boolean');
  const days = new Set(entries.filter(([, won]) => won).map(([key]) => key.slice(-10)));
  let streak = 0, date = new Date(`${day}T00:00:00Z`);
  if (!days.has(day)) date.setUTCDate(date.getUTCDate() - 1);
  while (days.has(utcDay(date))) { streak++; date.setUTCDate(date.getUTCDate() - 1); }
  $('stats').textContent = `${entries.filter(([, won]) => won).length} daily wins · ${streak} day streak · saved on this browser`;
}
function render(fresh = false) {
  const won = guesses.includes(answer.id), revealed = won ? answer.components.length : Math.min(1 + guesses.length, answer.components.length);
  $('components').replaceChildren();
  answer.components.forEach((component, i) => {
    const box = el('div', undefined, `component${fresh && i === revealed - 1 ? ' clue-reveal' : ''}`);
    box.append(...(i < revealed ? [itemImage(component), el('span', component.name)] : [el('div', '?', 'unknown'), el('span', 'hidden component')])); $('components').append(box);
  });
  $('attempts').textContent = `${guesses.length} guesses · no limit`;
  $('clue').textContent = won || guesses.length >= 2 ? `total cost: ${answer.gold} gold${won || guesses.length >= 3 ? ` · ${answer.tags.join(' / ')}` : ''}` : 'total cost unlocks after two misses';
  $('guesses').replaceChildren();
  for (const [index, id] of guesses.entries()) {
    const guess = items.find(i => i.id === id), c = compare(guess, answer);
    const row = el('li', undefined, `${c.correct ? 'correct' : 'incorrect'}${fresh && index === guesses.length - 1 ? ' guess-reveal' : ''}`);
    const feedback = el('div', undefined, 'guess-feedback');
    feedback.append(el('span', c.correct ? 'correct ✓' : `answer costs ${c.cost === 'same' ? 'the same' : c.cost === 'higher' ? 'more ↑' : 'less ↓'}`, c.cost === 'same' ? 'match' : 'mismatch'), el('span', `${c.shared}/${answer.components.length} shared components`, c.shared === answer.components.length ? 'match' : ''));
    row.append(itemImage(guess), el('span', guess.name, 'guess-name'), feedback); $('guesses').prepend(row);
  }
  $('guess').disabled = won; $('submit').disabled = won; $('result').hidden = !won;
  if (won) {
    if (!timing.end) timing.end = Date.now();
    if (mode === 'daily') {
      write(`${storageKey}:timing`, timing);
      const saved = read('itemle:results', {}), records = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
      records[`${data.revision || data.version}:${day}`] = true; write('itemle:results', records);
    }
    const row = el('div', undefined, 'answer-row'), copy = el('div');
    copy.append(el('p', 'CORRECT!', 'victory-title'), el('strong', answer.name), el('p', `${guesses.length} guesses · ${timeLabel(timing.end - timing.start)}`)); row.append(itemImage(answer), copy);
    const rank = puzzleRank(guesses.length), badge = el('div', undefined, 'rank-result'), emblem = el('img');
    emblem.src = `assets/ranks/${rank.tier.toLowerCase()}.png`; emblem.alt = `${rank.tier} puzzle rank`; emblem.width = 100; emblem.height = 100;
    const rankCopy = el('div'); rankCopy.append(el('strong', `${rank.tier} · ${rank.score}/6 points`), el('p', 'Puzzle rank only — not your League rank.')); badge.append(emblem, rankCopy); $('answer').replaceChildren(row, badge);
    if (fresh) { celebrate($('result')); $('result').scrollIntoView({ block: 'nearest', behavior: 'instant' }); $('next').focus({ preventScroll: true }); }
  }
  stats();
}
$('guess-form').addEventListener('submit', event => {
  event.preventDefault(); if (!answer || guesses.includes(answer.id)) return;
  if (mode === 'daily' && utcDay() !== day) { start('daily'); $('message').textContent = 'New day, new recipe. Your previous round is saved.'; return; }
  const guess = items.find(i => normalize(i.name) === normalize($('guess').value));
  if (!guess) { $('message').textContent = 'Choose a finished item from the suggestions.'; return; }
  if (guesses.includes(guess.id)) { $('message').textContent = 'You already tried that one.'; return; }
  guesses.push(guess.id);
  const saved = mode !== 'daily' || write(storageKey, guesses);
  $('guess').value = ''; closeSearch(); $('message').textContent = `${guess.id === answer.id ? 'Correct! Recipe complete.' : `${guess.name} isn’t it. A new clue is ready.`}${saved ? '' : ' Saving unavailable in this browser.'}`; render(true);
});
$('daily').onclick = () => start('daily'); $('practice').onclick = () => start('practice');
$('next').onclick = () => { start('practice'); $('guess').focus(); };
$('share').onclick = () => copyResult(shareText({ day, mode, guesses, answer, items }) + `\nTime: ${timeLabel(timing.end - timing.start)}`, $('share-status'));
// The original theme preference was stored as a raw string, not JSON.
try { document.body.classList.toggle('dark', localStorage.getItem('itemle:theme') === 'dark'); } catch { /* optional */ }
$('theme').onclick = () => { document.body.classList.toggle('dark'); try { localStorage.setItem('itemle:theme', document.body.classList.contains('dark') ? 'dark' : 'light'); } catch { /* optional */ } };
$('submit').disabled = true; $('message').textContent = 'Loading item recipes…';
try {
  const response = await fetch('./data.json'); if (!response.ok) throw new Error('data'); data = await response.json(); items = data.items;
  if (!Array.isArray(items) || items.length < 2) throw new Error('items');
  $('version').textContent = data.version; start('daily');
} catch { $('message').textContent = 'Couldn’t load the items. Refresh to try again.'; $('daily').disabled = true; $('practice').disabled = true; }
