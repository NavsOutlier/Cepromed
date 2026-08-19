/**
 * Otimiza os assets de imagem do site.
 *
 *   node scripts/optimize-images.mjs
 *
 * - Fotos de serviço / institucionais -> WebP 1600px + fallback JPEG.
 * - Sequência de frames do hero -> WebP em duas larguras (1200 desktop / 700 mobile),
 *   renomeados para o padrão numérico que <ScrollSequence> espera.
 *
 * As fontes ficam em raw-assets/ (fora do build) e o resultado em public/img/.
 */
import sharp from 'sharp';
import { mkdir, readdir, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const p = (...s) => path.join(ROOT, ...s);
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

let saved = 0;
async function report(src, out) {
  const a = (await stat(src)).size;
  const b = (await stat(out)).size;
  saved += a - b;
  console.log(`  ${path.basename(out).padEnd(34)} ${kb(a).padStart(9)} -> ${kb(b).padStart(9)}`);
}

/** Foto avulsa: WebP + JPEG de fallback. */
async function photo(src, outBase, width) {
  const webp = `${outBase}.webp`;
  await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(webp);
  await sharp(src).resize({ width, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(`${outBase}.jpg`);
  await report(src, webp);
}

/** Sequência de frames -> WebP numerado, duas larguras. */
async function sequence(srcDir, outDir) {
  const frames = (await readdir(srcDir)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
  if (!frames.length) return console.log(`  (nenhum frame em ${srcDir})`);

  // Com as sequências adensadas há quase o dobro de frames; cada um pode ser
  // um pouco menor e mais comprimido sem perda visível, porque nenhum fica
  // muito tempo na tela.
  for (const [w, suffix] of [[1200, 'lg'], [700, 'sm']]) {
    const dir = path.join(outDir, suffix);
    await mkdir(dir, { recursive: true });
    let bytes = 0;
    for (const [i, file] of frames.entries()) {
      const out = path.join(dir, `${String(i + 1).padStart(3, '0')}.webp`);
      await sharp(path.join(srcDir, file))
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: suffix === 'lg' ? 62 : 55, effort: 5 })
        .toFile(out);
      bytes += (await stat(out)).size;
    }
    console.log(`  ${path.basename(outDir)}/${suffix}: ${frames.length} frames, ${kb(bytes)} total`);
  }
}

const RAW = p('raw-assets');
if (!existsSync(RAW)) {
  console.error('raw-assets/ não existe. Coloque os originais lá antes de rodar.');
  process.exit(1);
}

console.log('\nFotos institucionais e de serviço');
await mkdir(p('public', 'img', 'servicos'), { recursive: true });
for (const f of await readdir(path.join(RAW, 'servicos'))) {
  await photo(path.join(RAW, 'servicos', f), p('public', 'img', 'servicos', path.parse(f).name), 1600);
}
if (existsSync(path.join(RAW, 'equipe.png'))) {
  await photo(path.join(RAW, 'equipe.png'), p('public', 'img', 'equipe'), 1800);
}

console.log('\nSequências do hero');
// Se existirem frames adensados (scripts/interpolar-frames.mjs), são eles que
// vão para o site; senão, caímos nos originais.
const densas = path.join(RAW, 'sequencias-densas');
const fonteSeq = existsSync(densas) ? densas : path.join(RAW, 'sequencias');
console.log('  fonte:', path.relative(ROOT, fonteSeq));

for (const dir of await readdir(fonteSeq, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const out = p('public', 'img', 'sequencias', dir.name.toLowerCase());
  await rm(out, { recursive: true, force: true });
  await sequence(path.join(fonteSeq, dir.name), out);
}

console.log(`\nEconomia total nas fotos: ${kb(saved)}\n`);
