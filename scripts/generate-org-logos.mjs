// Renders the small organization logos used on the work and home pages.
// The SVGs below are the editable source; the PNGs in public/media/logos are the output.
// Text uses Inter when installed (falls back to any sans-serif). Run: node scripts/generate-org-logos.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const out = name => fileURLToPath(new URL(`../public/media/logos/${name}`, import.meta.url));
const size = 256;

// Young Architects for Change: recreated from the logo Mason supplied (white Y·A·C on black).
const yac = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#0b0b0b"/>
  <g fill="none" stroke="#fff" stroke-linecap="square" stroke-linejoin="miter">
    <!-- Y: the right arm runs on as the diagonal that splits A from C -->
    <path d="M22 26 L40 50 L40 76" stroke-width="9"/>
    <path d="M40 50 L66 18" stroke-width="5"/>
  </g>
  <!-- A, top right -->
  <path d="M61 46 L71 22 L81 46 M65 38 L77 38" fill="none" stroke="#fff" stroke-width="4.5" stroke-linejoin="miter"/>
  <!-- C, bottom right -->
  <path d="M79 58 A11 11 0 1 0 79 74" fill="none" stroke="#fff" stroke-width="5"/>
</svg>`;

// Simple monogram badges in the site's palette (not the organizations' own branding).
const monogram = (letters, sub, from, to) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
  <rect width="100" height="100" fill="url(#g)"/>
  <circle cx="84" cy="16" r="26" fill="#fff" opacity=".08"/>
  <text x="50" y="${sub ? 56 : 62}" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="700" font-size="${letters.length > 3 ? 26 : 32}" letter-spacing="-1" fill="#fff">${letters}</text>
  ${sub ? `<text x="50" y="76" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="600" font-size="11" letter-spacing="1.5" fill="#fff" opacity=".8">${sub}</text>` : ""}
</svg>`;

const logos = {
  "yac.png": yac,
  "cjd.png": monogram("CJD", "MENTORSHIP", "#0f766e", "#134e4a"),
  "cus-fyc.png": monogram("CUS", "FIRST YEAR", "#1d4ed8", "#1e3a8a"),
};

for (const [file, svg] of Object.entries(logos)) {
  await sharp(Buffer.from(svg)).png().toFile(out(file));
  console.log(`wrote public/media/logos/${file}`);
}
