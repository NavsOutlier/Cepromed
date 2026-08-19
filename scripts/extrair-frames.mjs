/**
 * Extrai os frames das sequências do hero a partir dos vídeos originais.
 *
 *   node scripts/extrair-frames.mjs [fps]      # padrão: 12
 *
 * Lê `raw-assets/videos/v<nome>.mp4` e grava em
 * `raw-assets/sequencias-densas/<Nome>/`, que é a pasta que o
 * `gen:images` prefere na hora de gerar as variantes servidas.
 *
 * Frames reais do vídeo são sempre melhores que sintetizar os intermediários:
 * a 24 fps um clipe de 8 s tem 192 quadros, contra os 40 que vieram do ezgif.
 * O fps aqui é o de amostragem — quanto maior, mais suave a rolagem e mais
 * pesada a página. 12 fps (~96 frames por sequência) é o equilíbrio que
 * usamos; suba para 16 ou 24 se o peso não for problema.
 */
import ffmpeg from 'ffmpeg-static';
import { execFile } from 'node:child_process';
import { mkdir, readdir, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, '..');
const VIDEOS = path.join(ROOT, 'raw-assets', 'videos');
const SAIDA = path.join(ROOT, 'raw-assets', 'sequencias-densas');

const FPS = Number(process.argv[2] ?? 12);
if (!Number.isFinite(FPS) || FPS < 4 || FPS > 30) {
  console.error('fps deve estar entre 4 e 30.');
  process.exit(1);
}

if (!existsSync(VIDEOS)) {
  console.error(`${VIDEOS} não existe. Coloque os vídeos originais lá (v<nome>.mp4).`);
  process.exit(1);
}

const arquivos = (await readdir(VIDEOS)).filter((f) => /\.(mp4|mov|webm|m4v)$/i.test(f));
if (!arquivos.length) {
  console.error('Nenhum vídeo encontrado em raw-assets/videos/.');
  process.exit(1);
}

for (const arquivo of arquivos) {
  // "vcientista.mp4" -> "Cientista"
  const base = path.parse(arquivo).name.replace(/^v/i, '');
  const nome = base.charAt(0).toUpperCase() + base.slice(1);

  const destino = path.join(SAIDA, nome);
  await rm(destino, { recursive: true, force: true });
  await mkdir(destino, { recursive: true });

  const inicio = Date.now();
  await run(
    ffmpeg,
    [
      '-y',
      '-loglevel', 'error',
      '-i', path.join(VIDEOS, arquivo),
      '-vf', `fps=${FPS}`,
      '-q:v', '2',
      path.join(destino, '%03d.jpg'),
    ],
    { maxBuffer: 1 << 26 },
  );

  const gerados = await readdir(destino);
  const bytes = (
    await Promise.all(gerados.map(async (f) => (await stat(path.join(destino, f))).size))
  ).reduce((a, c) => a + c, 0);

  console.log(
    `${nome}: ${gerados.length} frames a ${FPS} fps, ` +
      `${(bytes / 1048576).toFixed(1)} MB, ${((Date.now() - inicio) / 1000).toFixed(0)}s`,
  );
}

console.log('\nAgora rode `npm run gen:images` para gerar as variantes servidas.');
