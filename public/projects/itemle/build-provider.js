import { validateBank } from './build-core.js';
// Providers return the validated bank contract. Game logic knows nothing about URLs.
// This default is a checked-in editorial snapshot; there is no undocumented API.
export async function loadBuildBank({ fetcher = fetch, storage = null, now = Date.now() } = {}) {
  const key = 'builddle:bank:v1';
  try {
    const response = await fetcher('./build-data.json', { cache: 'no-cache', signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw Error('Build source unavailable');
    const bank = validateBank(await response.json());
    try { storage?.setItem(key, JSON.stringify({ savedAt: now, bank })); } catch { /* optional cache */ }
    return { bank, cached: false };
  } catch {
    try { const saved = JSON.parse(storage?.getItem(key)); if (saved && Number.isFinite(saved.savedAt) && now >= saved.savedAt && now - saved.savedAt < 7 * 86400000) return { bank: validateBank(saved.bank), cached: true }; } catch { /* invalid cache */ }
    throw Error('Build data couldn’t load. Retry, or play the original Itemdle mode.');
  }
}
export async function currentPatch(fetcher = fetch) {
  try { const r = await fetcher('https://ddragon.leagueoflegends.com/api/versions.json', { signal: AbortSignal.timeout(5000) }); if (!r.ok) return null; const versions = await r.json(); return typeof versions[0] === 'string' ? versions[0] : null; } catch { return null; }
}
