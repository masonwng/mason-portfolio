import { cp, mkdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const target = new URL('public/projects/math-ascension/vendor/', root);
await mkdir(target, { recursive: true });
for (const name of ['katex.mjs', 'katex.min.css', 'fonts']) await cp(new URL(`node_modules/katex/dist/${name}`, root), new URL(name, target), { recursive: true });
await cp(new URL('node_modules/katex/LICENSE', root), new URL('LICENSE', target));
