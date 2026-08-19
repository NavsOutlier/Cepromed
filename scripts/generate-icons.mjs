/**
 * Gera favicon, apple-touch-icon e a imagem de compartilhamento (Open Graph).
 *
 *   node scripts/generate-icons.mjs
 *
 * Fontes: public/img/logo-cepromed.png e o primeiro frame do hero.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const p = (...s) => path.join(ROOT, ...s);

const VINHO = '#923032';

/* ---------- favicon.svg ---------- */

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${VINHO}"/>
  <path d="M43.5 22.8a14.2 14.2 0 1 0 0 18.4" fill="none" stroke="#fff"
        stroke-width="7" stroke-linecap="round"/>
</svg>
`;
await writeFile(p('public', 'favicon.svg'), favicon, 'utf8');
console.log('favicon.svg');

/* ---------- apple-touch-icon.png (180x180) ---------- */

await sharp(Buffer.from(favicon)).resize(180, 180).png().toFile(p('public', 'apple-touch-icon.png'));
console.log('apple-touch-icon.png');

/* ---------- og-cepromed.jpg (1200x630) ---------- */

const W = 1200;
const H = 630;

const fundo = await sharp(p('public', 'img', 'sequencias', 'cientista', 'lg', '001.webp'))
  .resize(W, H, { fit: 'cover' })
  .toBuffer();

// Véu escuro para o texto ficar legível sobre a foto.
const veu = Buffer.from(
  `<svg width="${W}" height="${H}">
     <defs>
       <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0%" stop-color="#391112" stop-opacity="0.94"/>
         <stop offset="100%" stop-color="#09090b" stop-opacity="0.82"/>
       </linearGradient>
     </defs>
     <rect width="${W}" height="${H}" fill="url(#g)"/>
   </svg>`,
);

const texto = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
     <style>
       .t { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; fill: #ffffff; }
       .eyebrow { font-size: 26px; font-weight: 600; letter-spacing: 6px; fill: #eeb0b2; }
       .title { font-size: 76px; font-weight: 700; letter-spacing: -1.5px; }
       .sub { font-size: 30px; font-weight: 300; fill: #d4d4d8; }
     </style>
     <text class="t eyebrow" x="80" y="250">LABORATÓRIO CEPROMED</text>
     <text class="t title" x="80" y="345">Segurança em produtos</text>
     <text class="t title" x="80" y="425">para a saúde</text>
     <text class="t sub" x="80" y="495">Ensaios e certificação · ANVISA · REBLAS · INMETRO</text>
     <rect x="80" y="150" width="72" height="6" fill="${VINHO}"/>
   </svg>`,
);

await sharp(fundo)
  .composite([
    { input: veu, blend: 'over' },
    { input: texto, blend: 'over' },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(p('public', 'og-cepromed.jpg'));
console.log('og-cepromed.jpg');
