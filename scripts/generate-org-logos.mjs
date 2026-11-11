// Renders the YAC logo (cjd.png and cus-fyc.png are the organizations' own logos, supplied by Mason).
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

const logos = {
  "yac.png": yac,
};

for (const [file, svg] of Object.entries(logos)) {
  await sharp(Buffer.from(svg)).png().toFile(out(file));
  console.log(`wrote public/media/logos/${file}`);
}
