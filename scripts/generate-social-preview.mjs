import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

// Keep this composition code-based so copy, layout, and colors stay easy to edit.
const root = fileURLToPath(new URL('../', import.meta.url));
const avatar = (await readFile(resolve(root, 'public/avatar-mason.png'))).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#faf9f6"/>
  <rect x="24" y="24" width="1152" height="582" rx="18" fill="none" stroke="#e2e2de" stroke-width="2"/>
  <text x="78" y="103" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700" letter-spacing="-2" fill="#25272a">mw.</text>
  <text x="78" y="247" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="600" letter-spacing="-3" fill="#25272a">hey, I’m</text>
  <text x="78" y="335" font-family="Arial, Helvetica, sans-serif" font-size="84" font-weight="600" letter-spacing="-4" fill="#25272a">Mason Wang.</text>
  <text x="81" y="404" font-family="Arial, Helvetica, sans-serif" font-size="27" fill="#686b70">Business + Computer Science</text>
  <text x="81" y="445" font-family="Arial, Helvetica, sans-serif" font-size="25" fill="#686b70">University of British Columbia</text>
  <circle cx="946" cy="312" r="181" fill="#edf0f3"/>
  <image href="data:image/png;base64,${avatar}" x="731" y="94" width="430" height="430"/>
  <path d="M80 491H650" stroke="#e2e2de" stroke-width="2"/>
  <text x="81" y="550" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#466d95">masonwang.dev</text>
  <path d="M1090 547l24-24m-22 0h22v22" fill="none" stroke="#466d95" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const output = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(resolve(root, 'public/social-preview.png'), output);
const info = await sharp(output).metadata();
console.log(`Created social-preview.png: ${info.width}×${info.height}, ${Math.round(output.length / 1024)} KB`);
