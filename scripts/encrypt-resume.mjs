// Encrypts the résumé so it can live in this public repo and on the site without being readable.
// Usage: RESUME_PASSWORD=... node scripts/encrypt-resume.mjs path/to/resume.pdf
// Output: public/resume.enc = 16-byte salt | 12-byte IV | AES-256-GCM ciphertext (with 16-byte tag).
// The key is PBKDF2-SHA-256 of the password; app/components/resume-gate.tsx decrypts it in the browser.
// Never commit the plain PDF or the password.
import { pbkdf2Sync, randomBytes, createCipheriv } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const ITERATIONS = 600_000;
const [input] = process.argv.slice(2), password = process.env.RESUME_PASSWORD;
if (!input || !password) {
  console.error("Usage: RESUME_PASSWORD=... node scripts/encrypt-resume.mjs path/to/resume.pdf");
  process.exit(1);
}
const pdf = readFileSync(input);
if (pdf.subarray(0, 5).toString() !== "%PDF-") throw new Error(`${input} is not a PDF`);

const salt = randomBytes(16), iv = randomBytes(12);
const key = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256");
const cipher = createCipheriv("aes-256-gcm", key, iv);
const body = Buffer.concat([cipher.update(pdf), cipher.final(), cipher.getAuthTag()]);
const out = fileURLToPath(new URL("../public/resume.enc", import.meta.url));
writeFileSync(out, Buffer.concat([salt, iv, body]));
console.log(`wrote public/resume.enc (${pdf.length} → ${salt.length + iv.length + body.length} bytes)`);
