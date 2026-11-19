// Builds public/projects/itemle/build-data.json for Builddle from an editorial list of core builds,
// checked against Riot Data Dragon. Every item name must match a purchasable Summoner's Rift item
// on the chosen patch, and every champion must exist, or the script stops.
// Usage: node scripts/build-builddle-bank.mjs [patch]   (default: latest Data Dragon version)
//
// Sources: the four builds marked "u.gg-reviewed" were checked by hand against public U.GG pages on
// 2026-10-21. The rest are editorial: common core builds written from general game knowledge, not
// scraped or computed from match data. Edit BUILDS below to change them.
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../public/projects/itemle/", import.meta.url);
const DD = "https://ddragon.leagueoflegends.com";

/** [championKey, role, item1, item2, item3] — item names exactly as Riot spells them. */
const BUILDS = [
  // ADC
  ["Ezreal", "ADC", "Trinity Force", "Manamune", "Ionian Boots of Lucidity"],
  ["Kaisa", "ADC", "Kraken Slayer", "Guinsoo's Rageblade", "Berserker's Greaves"],
  ["Ashe", "ADC", "Kraken Slayer", "Blade of The Ruined King", "Berserker's Greaves"],
  ["Vayne", "ADC", "Blade of The Ruined King", "Guinsoo's Rageblade", "Berserker's Greaves"],
  ["MissFortune", "ADC", "The Collector", "Infinity Edge", "Berserker's Greaves"],
  ["Jhin", "ADC", "The Collector", "Infinity Edge", "Rapid Firecannon"],
  ["Lucian", "ADC", "Essence Reaver", "Navori Flickerblade", "Infinity Edge"],
  // Mid
  ["Ahri", "Mid", "Luden's Echo", "Shadowflame", "Sorcerer's Shoes"],
  ["Lux", "Mid", "Luden's Echo", "Malignance", "Sorcerer's Shoes"],
  ["Syndra", "Mid", "Luden's Echo", "Shadowflame", "Rabadon's Deathcap"],
  ["Veigar", "Mid", "Luden's Echo", "Rabadon's Deathcap", "Sorcerer's Shoes"],
  ["Katarina", "Mid", "Stormsurge", "Rabadon's Deathcap", "Sorcerer's Shoes"],
  ["Akali", "Mid", "Lich Bane", "Rabadon's Deathcap", "Sorcerer's Shoes"],
  ["Zed", "Mid", "Youmuu's Ghostblade", "Edge of Night", "Serylda's Grudge"],
  ["Yasuo", "Mid", "Infinity Edge", "Berserker's Greaves", "Bloodthirster"],
  ["Yone", "Mid", "Blade of The Ruined King", "Infinity Edge", "Berserker's Greaves"],
  // Top
  ["Sett", "Top", "Stridebreaker", "Sterak's Gage", "Plated Steelcaps"],
  ["Fiora", "Top", "Ravenous Hydra", "Trinity Force", "Plated Steelcaps"],
  ["Jax", "Top", "Trinity Force", "Sterak's Gage", "Plated Steelcaps"],
  ["Camille", "Top", "Trinity Force", "Ravenous Hydra", "Plated Steelcaps"],
  ["Malphite", "Top", "Sunfire Aegis", "Thornmail", "Plated Steelcaps"],
  ["Mordekaiser", "Top", "Riftmaker", "Liandry's Torment", "Mercury's Treads"],
  ["Teemo", "Top", "Nashor's Tooth", "Liandry's Torment", "Sorcerer's Shoes"],
  ["Riven", "Top", "Eclipse", "Profane Hydra", "Ionian Boots of Lucidity"],
  ["Aatrox", "Top", "Sundered Sky", "Sterak's Gage", "Plated Steelcaps"],
  ["Nasus", "Top", "Trinity Force", "Iceborn Gauntlet", "Plated Steelcaps"],
  // Jungle
  ["LeeSin", "Jungle", "Eclipse", "Black Cleaver", "Ionian Boots of Lucidity"],
  ["Khazix", "Jungle", "Profane Hydra", "Youmuu's Ghostblade", "Edge of Night"],
  ["MasterYi", "Jungle", "Blade of The Ruined King", "Guinsoo's Rageblade", "Wit's End"],
  ["Graves", "Jungle", "The Collector", "Infinity Edge", "Lord Dominik's Regards"],
  ["Vi", "Jungle", "Eclipse", "Black Cleaver", "Sterak's Gage"],
  ["Warwick", "Jungle", "Blade of The Ruined King", "Sterak's Gage", "Spirit Visage"],
  ["Amumu", "Jungle", "Liandry's Torment", "Sunfire Aegis", "Plated Steelcaps"],
  ["Evelynn", "Jungle", "Lich Bane", "Shadowflame", "Sorcerer's Shoes"],
  // Support
  ["Thresh", "Support", "Celestial Opposition", "Locket of the Iron Solari", "Knight's Vow"],
  ["Leona", "Support", "Celestial Opposition", "Locket of the Iron Solari", "Plated Steelcaps"],
  ["Nautilus", "Support", "Celestial Opposition", "Locket of the Iron Solari", "Mercury's Treads"],
  ["Lulu", "Support", "Dream Maker", "Moonstone Renewer", "Ardent Censer"],
  ["Nami", "Support", "Dream Maker", "Moonstone Renewer", "Ionian Boots of Lucidity"],
  ["Soraka", "Support", "Dream Maker", "Moonstone Renewer", "Redemption"],
];

const getJson = async url => { const r = await fetch(url); if (!r.ok) throw Error(`${r.status} ${url}`); return r.json(); };
const exists = async url => access(fileURLToPath(url)).then(() => true, () => false);
async function download(url, dest) {
  if (await exists(dest)) return false;
  const r = await fetch(url); if (!r.ok) throw Error(`${r.status} ${url}`);
  await writeFile(fileURLToPath(dest), Buffer.from(await r.arrayBuffer())); return true;
}

const patch = process.argv[2] ?? (await getJson(`${DD}/api/versions.json`))[0];
const [items, champions] = await Promise.all([
  getJson(`${DD}/cdn/${patch}/data/en_US/item.json`).then(d => d.data),
  getJson(`${DD}/cdn/${patch}/data/en_US/champion.json`).then(d => d.data),
]);
const bankUrl = new URL("build-data.json", root);
const bank = JSON.parse(await readFile(bankUrl, "utf8"));
const pool = new Map(bank.items.map(i => [i.id, i]));

// Purchasable Summoner's Rift items by exact name. Some items also have variant ids (e.g. 323107 for
// Redemption); prefer an id already in the pool, otherwise the shortest (standard) id.
const byName = new Map();
const better = (id, prior) => pool.has(id) !== pool.has(prior) ? pool.has(id) : id.length !== prior.length ? id.length < prior.length : id < prior;
for (const [id, item] of Object.entries(items)) {
  if (!item.maps?.["11"] || !item.gold?.purchasable || item.requiredChampion || item.requiredAlly) continue;
  const prior = byName.get(item.name);
  if (!prior || better(id, prior)) byName.set(item.name, id);
}

const problems = [];
const builds = bank.builds.filter(b => b.source !== "editorial").map(b => ({ ...b, source: "u.gg-reviewed" }));
const seen = new Set(builds.map(b => b.champion));
for (const [champion, role, ...names] of BUILDS) {
  const meta = champions[champion];
  if (!meta) { problems.push(`unknown champion ${champion}`); continue; }
  if (seen.has(champion)) { problems.push(`duplicate champion ${champion}`); continue; }
  seen.add(champion);
  const ids = names.map(name => byName.get(name) ?? (problems.push(`${champion}: no purchasable SR item named "${name}" on ${patch}`), null));
  if (ids.includes(null)) continue;
  builds.push({
    champion, role, items: ids,
    sourceUrl: `https://u.gg/lol/champions/${champion.toLowerCase()}/build`,
    championName: meta.name, championTags: meta.tags, source: "editorial",
  });
}
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }

// Every build item must be guessable, with current metadata and icons.
for (const id of builds.flatMap(b => b.items)) {
  const item = items[id];
  pool.set(id, { id, name: item.name, gold: item.gold.total, tags: item.tags ?? [], components: (item.from ?? []).map(c => ({ id: c, name: items[c]?.name ?? c })) });
}
await mkdir(new URL("assets/build-items/", root), { recursive: true });
let icons = 0;
for (const id of pool.keys()) icons += await download(`${DD}/cdn/${patch}/img/item/${id}.png`, new URL(`assets/build-items/${id}.png`, root));
for (const b of builds) icons += await download(`${DD}/cdn/${patch}/img/champion/${b.champion}.png`, new URL(`assets/champions/${b.champion}.png`, root));

const [major, minor] = patch.split(".");
const out = {
  ...bank,
  patch, displayPatch: `${Number(major) + 10}.${minor}`, reviewedOn: new Date().toISOString().slice(0, 10),
  provider: "Editorial question bank · Riot metadata",
  notice: "Core builds for common roles. Four were checked by hand against public U.GG pages; the rest are editorial picks from general game knowledge, not live usage statistics. Recommendations change by patch and matchup.",
  builds, items: [...pool.values()].sort((a, b) => a.name.localeCompare(b.name)),
  metadataUrl: `${DD}/cdn/${patch}/data/en_US/item.json`,
};
await writeFile(bankUrl, JSON.stringify(out, null, 2) + "\n");
console.log(`${builds.length} builds (${builds.filter(b => b.source === "editorial").length} editorial), ${out.items.length} items, ${icons} new icons, patch ${patch}`);
