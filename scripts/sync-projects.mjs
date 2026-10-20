import { cp, mkdir, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
for (const [source, destination] of [['league-itemle', 'itemle'], ['lane-notes', 'lane-notes']]) {
  const from = resolve(root, '..', source);
  const to = resolve(root, 'public', 'projects', destination);
  await mkdir(to, { recursive: true });
  const allowed = new Set(['index.html', 'app.js', 'core.js', 'style.css', 'data.json', 'assets']);
  for (const entry of await readdir(from)) {
    if (!allowed.has(entry)) continue;
    await cp(resolve(from, entry), resolve(to, entry), { recursive: true });
  }
  console.log(`Synced ${source} → public/projects/${destination}`);
}
