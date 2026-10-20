export const MAX_GUESSES = 6;
export function utcDay(date = new Date()) { return date.toISOString().slice(0,10); }
export function hash(value) { let n=2166136261;for(const c of value){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0; }
export function dailyItem(items,day){ if(!items.length)throw new Error('No items');return items[hash(`itemle:${day}`)%items.length]; }
export function normalize(value){return value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g,'');}
export function compare(guess,answer){const left=answer.components.map(c=>c.id);let shared=0;for(const c of guess.components){const i=left.indexOf(c.id);if(i!==-1){shared++;left.splice(i,1);}}return {correct:guess.id===answer.id,shared,cost:guess.gold===answer.gold?'same':guess.gold<answer.gold?'higher':'lower'};}
export function restore(raw,items,answer){try {const saved=JSON.parse(raw);if(!Array.isArray(saved)||saved.length>MAX_GUESSES)return [];const ids=new Set(items.map(i=>i.id));const valid=saved.filter(x=>typeof x==='string'&&ids.has(x));if(valid.length!==saved.length||new Set(valid).size!==valid.length)return [];const won=valid.indexOf(answer.id);return won<0?valid:valid.slice(0,won+1);}catch{return [];}}
export function shareText({day,mode,guesses,answer,items}){const won=guesses.includes(answer.id);return `Itemle ${mode==='daily'?day:'practice'} ${won?guesses.length:'X'}/6\n${guesses.map(id=>compare(items.find(i=>i.id===id),answer).correct?'🟩':'⬜').join('')}\nhttps://masonwang.dev/projects/itemle/index.html`;}
