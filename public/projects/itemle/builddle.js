import { $, el, read, write, itemImage, timeLabel, soundToggle, celebrate, copyResult } from './ui.js';
import { attachSearch } from './search.js';
import { DIFFICULTIES, createRound, submitGuess, requestHint, score, visibleClues, findGuess, restoreRound } from './build-core.js';
import { loadBuildBank, currentPatch } from './build-provider.js';
let bank, round, mode = 'champions', difficulty = 'normal', latest = null, cached = false;
const buildImage = item => { const img = itemImage(item); img.src = `assets/build-items/${item.id}.png`; return img; };
const closeSearch = attachSearch($('guess'), $('suggestions'), () => bank?.items || [], () => round?.guesses || [], buildImage);
soundToggle($('sound'));
try { document.body.classList.toggle('dark', localStorage.getItem('itemle:theme') === 'dark'); } catch { /* optional */ }
$('theme').onclick = () => { document.body.classList.toggle('dark'); try { localStorage.setItem('itemle:theme', document.body.classList.contains('dark') ? 'dark' : 'light'); } catch { /* optional */ } };
function sourceStatus() {
  if (!bank) return;
  const age = Date.now() - Date.parse(`${bank.reviewedOn}T00:00:00Z`), old = latest && latest !== bank.patch || age > 21 * 86400000;
  $('source-status').textContent = `${old ? 'Historical snapshot · ' : ''}build patch ${bank.displayPatch} · reviewed ${bank.reviewedOn} · U.GG references / Riot metadata${cached ? ' · cached fallback' : ''}${latest ? ` · latest metadata ${latest}` : ' · live patch check unavailable'}`;
}
function persist() { if (!write(`builddle:round:${bank.patch}`, round)) $('message').textContent += ' Saving unavailable in this browser.'; }
function start() { const previous = round?.id; round = createRound(bank, mode, difficulty, Math.random, previous); $('guess').value = ''; $('message').textContent = ''; $('share-status').textContent = ''; closeSearch(); persist(); render(); }
function championImage(build) { const img = el('img'); img.src = `assets/champions/${build.champion}.png`; img.alt = build.championName; img.width = 44; img.height = 44; return img; }
function renderSlots(container, reveal) {
  container.replaceChildren(); const build = bank.builds[round.buildIndex]; let visible = 0;
  build.items.forEach((id, index) => {
    const item = bank.items.find(i => i.id === id), box = el('div', undefined, 'component');
    if (reveal || index !== round.slot && visible++ < DIFFICULTIES[difficulty].visible) box.append(buildImage(item), el('span', `${index + 1}. ${item.name}`));
    else box.append(el('div', index === round.slot ? '?' : '·', `unknown${index === round.slot ? ' target-slot' : ''}`), el('span', index === round.slot ? `${index + 1}. your answer` : `${index + 1}. hidden`));
    container.append(box);
  });
}
function render(fresh = false) {
  const over = round.status !== 'playing', build = bank.builds[round.buildIndex];
  $('champions').setAttribute('aria-pressed', mode === 'champions'); $('complete').setAttribute('aria-pressed', mode === 'complete'); $('difficulty').value = difficulty;
  $('build-question').hidden = false; $('guess-form').hidden = false; $('build-title').textContent = mode === 'champions' ? 'whose item is this?' : 'fill the missing slot';
  $('attempts').textContent = `${round.guesses.length} / ${DIFFICULTIES[difficulty].attempts} guesses`;
  $('champion').replaceChildren(); $('champion').hidden = mode !== 'complete'; $('build-slots').hidden = mode !== 'complete';
  if (mode === 'complete') { const name = el('div'); name.append(el('strong', build.championName), el('p', difficulty === 'hard' ? 'role hidden · core build' : `${build.role} · core build`)); $('champion').append(championImage(build), name); renderSlots($('build-slots'), over); }
  $('hints').replaceChildren();
  visibleClues(round, bank).forEach((clue, i) => { const li = el('li', undefined, fresh ? 'clue-reveal' : ''); if (clue.champion) li.append(championImage({ champion: clue.champion, championName: clue.name })); li.append(el('span', `${i + 1}. ${clue.text}`)); $('hints').append(li); });
  $('hint').disabled = over || round.hints >= DIFFICULTIES[difficulty].hints; $('hint').textContent = `hint (${DIFFICULTIES[difficulty].hints - round.hints} left)`;
  $('score').textContent = `${score(round)} points · ${DIFFICULTIES[difficulty].multiplier}×`; $('guess').disabled = over; $('submit').disabled = over;
  $('guesses').replaceChildren(); round.guesses.forEach(id => { const item = bank.items.find(i => i.id === id), correct = id === round.answerId, row = el('li', undefined, correct ? 'correct' : ''); row.append(buildImage(item), el('span', item.name, 'guess-name'), el('span', correct ? 'correct ✓' : 'not this one', 'guess-feedback')); $('guesses').prepend(row); });
  $('result').hidden = !over;
  if (over) {
    const item = bank.items.find(i => i.id === round.answerId), answer = el('div', undefined, 'answer-row'), copy = el('div'); copy.append(el('p', round.status === 'won' ? 'CORRECT!' : 'ROUND COMPLETE', 'victory-title'), el('strong', item.name)); answer.append(buildImage(item), copy); $('answer').replaceChildren(answer);
    $('round-summary').textContent = `${score(round)} points · ${round.guesses.length} guesses · ${round.hints} hints · ${timeLabel(round.finished - round.started)}`;
    renderSlots($('completed-build'), true); const source = el('a', `View ${build.championName}’s reference build ↗`); source.href = build.sourceUrl; source.target = '_blank'; source.rel = 'noopener noreferrer'; $('source-link').replaceChildren(source);
    if (fresh && round.status === 'won') celebrate($('result'));
    if (fresh) $('next').focus({ preventScroll: true });
  }
  const best = read('builddle:bests', {}); $('stats').textContent = `Best ${mode === 'champions' ? 'champion hints' : 'complete build'} / ${difficulty}: ${best?.[`${mode}:${difficulty}`] || 0} points · saved in this browser`;
}
$('guess-form').onsubmit = event => {
  event.preventDefault(); if (!round || round.status !== 'playing') return;
  const item = findGuess(bank, $('guess').value); if (!item) { $('message').textContent = 'Choose an item from the suggestions.'; return; }
  if (round.guesses.includes(item.id)) { $('message').textContent = 'Already tried that item.'; return; }
  round = submitGuess(round, item.id, bank); $('guess').value = ''; closeSearch(); $('message').textContent = round.status === 'won' ? 'Correct! Build solved.' : round.status === 'lost' ? 'Out of attempts. Here’s the full build.' : 'Not this one. Check the next clue.';
  if (round.status === 'won') { const saved = read('builddle:bests', {}), best = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {}; best[`${mode}:${difficulty}`] = Math.max(best[`${mode}:${difficulty}`] || 0, score(round)); write('builddle:bests', best); }
  persist(); render(true);
};
$('hint').onclick = () => { round = requestHint(round); persist(); render(true); };
$('champions').onclick = () => { if (bank && mode !== 'champions') { mode = 'champions'; start(); } };
$('complete').onclick = () => { if (bank && mode !== 'complete') { mode = 'complete'; start(); } };
$('difficulty').onchange = () => { if (bank) { difficulty = $('difficulty').value; start(); } };
$('next').onclick = () => { start(); $('guess').focus(); };
$('share').onclick = () => copyResult(`Builddle · ${mode === 'champions' ? 'champion hints' : 'complete build'} · ${difficulty}\n${round.status === 'won' ? 'Solved' : 'Round over'} · ${score(round)} points · ${round.guesses.length} guesses · ${round.hints} hints\n${timeLabel(round.finished - round.started)} · patch ${bank.displayPatch}\nhttps://masonwang.dev/projects/itemle/builddle.html`, $('share-status'));
async function load() {
  $('retry').hidden = true; $('source-status').textContent = 'Loading verified build references…'; $('difficulty').disabled = true;
  try { let storage; try { storage = localStorage; } catch { storage = null; } const result = await loadBuildBank({ storage }); bank = result.bank; cached = result.cached;
    round = restoreRound(JSON.stringify(read(`builddle:round:${bank.patch}`)), bank);
    if (round) { mode = round.mode; difficulty = round.difficulty; render(); } else start();
    $('difficulty').disabled = false; sourceStatus(); latest = await currentPatch(); sourceStatus();
  } catch (error) { $('source-status').textContent = error.message; $('retry').hidden = false; }
}
$('retry').onclick = load;
await load();
