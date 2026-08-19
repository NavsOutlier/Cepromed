import type { Trilha } from '../components/ScrollSequence';

/**
 * O hero toca as duas sequências emendadas: a cena de bancada abre, a
 * molécula fecha. A seção seguinte congela exatamente no frame em que o
 * hero parou, então a passagem de uma para a outra não tem corte.
 */
export const TRILHAS_HERO: readonly Trilha[] = [
  { nome: 'cientista', frames: 96 },
  { nome: 'molecula', frames: 96 },
] as const;

export const TOTAL_FRAMES_HERO = TRILHAS_HERO.reduce((n, t) => n + t.frames, 0);

/** Último frame do hero — vira o fundo estático da seção 2. */
const ultima = TRILHAS_HERO[TRILHAS_HERO.length - 1];
const numeroFinal = String(ultima.frames).padStart(3, '0');

export const FRAME_FINAL = {
  lg: `/img/sequencias/${ultima.nome}/lg/${numeroFinal}.webp`,
  sm: `/img/sequencias/${ultima.nome}/sm/${numeroFinal}.webp`,
} as const;
