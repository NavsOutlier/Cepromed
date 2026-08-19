import type { Trilha } from '../components/ScrollSequence';

/**
 * O hero toca as duas sequências emendadas: a cena de bancada abre, a
 * molécula fecha. Ao terminar, o canvas congela no último frame e a jornada
 * da amostra assume o mesmo palco (Journey em Hero.tsx) — por isso não há
 * imagem "final" separada: o próprio canvas é o fundo da segunda fase.
 */
export const TRILHAS_HERO: readonly Trilha[] = [
  { nome: 'cientista', frames: 192 },
  { nome: 'molecula', frames: 192 },
] as const;

