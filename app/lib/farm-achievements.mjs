// Farm goals and achievements, driven by the status messages the 3D scene already emits.
// Plain JS so node --test can exercise it without a TypeScript build.

export const CARROTS = 12;
export const PIGS = 3;

/** @type {{id:string, icon:string, title:string, hint:string}[]} */
export const ACHIEVEMENTS = [
  { id: "harvest", icon: "🥕", title: "Green thumb", hint: `Pick all ${CARROTS} carrots` },
  { id: "splash", icon: "🐷", title: "Splash zone", hint: `Get all ${PIGS} pigs into the mud` },
  { id: "pusher", icon: "🌀", title: "Pig whisperer", hint: "Push pigs 25 times" },
  { id: "cow", icon: "🐄", title: "Cattle drive", hint: "Pick up a cow" },
  { id: "chicken", icon: "🐔", title: "Chicken wrangler", hint: "Pick up a chicken" },
  { id: "barn", icon: "🚪", title: "Open house", hint: "Open the barn doors" },
  { id: "night", icon: "🌙", title: "Night owl", hint: "Visit the farm at night" },
  { id: "farmhand", icon: "⭐", title: "Farmhand", hint: "Unlock every other achievement" },
];

/** @returns {{carrots:number, splashed:number[], pushes:number, unlocked:string[]}} */
export function emptyProgress() {
  return { carrots: 0, splashed: [], pushes: 0, unlocked: [] };
}

/** Restores saved progress, ignoring anything malformed. */
export function restoreProgress(raw) {
  const base = emptyProgress();
  if (!raw || typeof raw !== "object") return base;
  const ids = new Set(ACHIEVEMENTS.map(a => a.id));
  return {
    carrots: 0, // carrots reset with the scene, so the harvest counter starts fresh each visit
    splashed: [],
    pushes: Number.isSafeInteger(raw.pushes) && raw.pushes >= 0 ? raw.pushes : 0,
    unlocked: Array.isArray(raw.unlocked) ? raw.unlocked.filter(id => ids.has(id)) : [],
  };
}

const unlock = (progress, id, fresh) => {
  if (progress.unlocked.includes(id)) return progress;
  fresh.push(id);
  return { ...progress, unlocked: [...progress.unlocked, id] };
};

/**
 * Applies one scene status message. Returns the new progress and any achievements it unlocked.
 * @param {ReturnType<typeof emptyProgress>} progress
 * @param {string} message
 */
export function applyStatus(progress, message) {
  const fresh = [];
  let next = progress;
  if (message === "Carrot picked.") next = { ...next, carrots: Math.min(CARROTS, next.carrots + 1) };
  else if (message === "Carrot replanted.") next = { ...next, carrots: Math.max(0, next.carrots - 1) };
  else if (message === "Farm reset.") next = { ...next, carrots: 0, splashed: [] };
  else if (/^Pig \d+ got a push\.$/.test(message)) next = { ...next, pushes: next.pushes + 1 };
  else if (message === "Barn open.") next = unlock(next, "barn", fresh);
  else if (message === "Picked up a cow.") next = unlock(next, "cow", fresh);
  else if (message === "Picked up a chicken.") next = unlock(next, "chicken", fresh);
  const splash = /^Splash! Pig (\d+) made it/.exec(message);
  if (splash && !next.splashed.includes(Number(splash[1]))) next = { ...next, splashed: [...next.splashed, Number(splash[1])] };

  if (next.carrots >= CARROTS) next = unlock(next, "harvest", fresh);
  if (next.splashed.length >= PIGS) next = unlock(next, "splash", fresh);
  if (next.pushes >= 25) next = unlock(next, "pusher", fresh);
  return finish(next, fresh);
}

/** Night is 9pm–5am on the visitor's own clock. */
export const isNight = (hours = new Date().getHours()) => hours >= 21 || hours < 5;

export function applyVisit(progress, hours) {
  const fresh = [];
  return finish(isNight(hours) ? unlock(progress, "night", fresh) : progress, fresh);
}

function finish(progress, fresh) {
  const others = ACHIEVEMENTS.filter(a => a.id !== "farmhand").every(a => progress.unlocked.includes(a.id));
  const next = others ? unlock(progress, "farmhand", fresh) : progress;
  return { progress: next, unlocked: fresh };
}

/** Lighting phase for the farm from the visitor's local hour: day, golden (dawn/dusk), or night. */
export function skyPhase(hours = new Date().getHours()) {
  if (isNight(hours)) return "night";
  if (hours < 7 || hours >= 18) return "golden";
  return "day";
}
