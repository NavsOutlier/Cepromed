import { useEffect, useState, type RefObject } from 'react';

/** Proporção nativa do frame usado como fundo da jornada. */
export const FRAME_LARGURA = 1000;
export const FRAME_ALTURA = 563;

/**
 * Onde estão as esferas da molécula, em % da imagem original.
 *
 * Foram medidas na própria imagem (detecção de máximos de brilho e azul no
 * último frame), não chutadas: é por isso que os marcadores caem em cima das
 * esferas e não ao lado delas. Ficam todas na metade direita, para não
 * disputar espaço com o texto.
 *
 * Se o frame final mudar, remeça — as posições são específicas desta imagem.
 */
export const ANCORAS = [
  { x: 57.0, y: 13.3 },
  { x: 59.5, y: 42.5 },
  { x: 69.0, y: 38.9 },
  { x: 77.0, y: 25.7 },
  { x: 82.5, y: 84.1 },
  { x: 86.5, y: 28.3 },
] as const;

export type Ponto = { x: number; y: number };

/**
 * Converte as coordenadas da imagem em pixels do container, reproduzindo o
 * que o `object-cover` + `object-top` fazem: a imagem é escalada até cobrir a
 * caixa, centralizada na horizontal e presa no topo.
 *
 * Sem isso os marcadores descolariam das esferas assim que a janela mudasse
 * de proporção.
 */
export function useAncorasProjetadas(ref: RefObject<HTMLElement | null>): Ponto[] {
  const [pontos, setPontos] = useState<Ponto[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const medir = () => {
      const { width: cw, height: ch } = el.getBoundingClientRect();
      if (!cw || !ch) return;

      const escala = Math.max(cw / FRAME_LARGURA, ch / FRAME_ALTURA);
      const dw = FRAME_LARGURA * escala;
      const dh = FRAME_ALTURA * escala;
      const deslocX = (cw - dw) / 2; // centralizado
      const deslocY = 0; // object-top

      setPontos(
        ANCORAS.map(({ x, y }) => ({
          x: deslocX + (x / 100) * dw,
          y: deslocY + (y / 100) * dh,
        })),
      );
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    window.addEventListener('resize', medir);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', medir);
    };
  }, [ref]);

  return pontos;
}
