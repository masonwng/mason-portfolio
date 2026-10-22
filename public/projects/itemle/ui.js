// Small, dependency-free helpers shared by recipe mode and Builddle.
export const $ = id => document.getElementById(id);
export function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
export function read(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
export function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
export function timeLabel(ms) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
export function itemImage(item) {
  const img = el('img'); img.src = `assets/items/${item.id}.png`; img.alt = item.name;
  img.width = 60; img.height = 60; return img;
}
let sound = read('itemle:sound', false), audio;
export function soundToggle(button) {
  const update = () => { button.textContent = sound ? 'sound on' : 'sound off'; button.setAttribute('aria-pressed', String(sound)); };
  button.onclick = () => { sound = !sound; write('itemle:sound', sound); update(); if (sound) playWin(); };
  update();
}
export function playWin() {
  if (!sound) return;
  try {
    audio ??= new AudioContext(); audio.resume().catch(() => {});
    [523.25, 659.25, 783.99].forEach((frequency, i) => {
      const oscillator = audio.createOscillator(), gain = audio.createGain(), t = audio.currentTime + i * .09;
      oscillator.frequency.value = frequency; gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(.035, t + .015); gain.gain.exponentialRampToValueAtTime(.001, t + .24);
      oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(t); oscillator.stop(t + .25);
    });
  } catch { /* Audio is optional, including in restricted browsers. */ }
}
export function celebrate(container, gold = false) {
  container.classList.remove('celebrate'); void container.offsetWidth; container.classList.add('celebrate');
  const burst = el('div', undefined, `particle-burst${gold ? ' gold' : ''}`); burst.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 18; i++) { const p = el('i'); const a = i * Math.PI * 2 / 18; p.style.setProperty('--x', `${Math.cos(a) * 140}px`); p.style.setProperty('--y', `${Math.sin(a) * 100}px`); p.style.setProperty('--r', `${i * 43}deg`); burst.append(p); }
  container.append(burst); setTimeout(() => burst.remove(), 1200); playWin();
}
export async function copyResult(text, status) {
  try { await navigator.clipboard.writeText(text); status.textContent = 'Result copied.'; }
  catch { status.textContent = `Copy unavailable. Select this result instead: ${text}`; }
}
