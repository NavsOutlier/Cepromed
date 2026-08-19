import { useEffect, useMemo, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, type MotionValue } from 'motion/react';

/** Uma pasta em public/img/sequencias e quantos frames ela tem. */
export type Trilha = { nome: string; frames: number };

type Props = {
  /** Trilhas tocadas em sequência, emendadas numa linha do tempo só. */
  trilhas: readonly Trilha[];
  /** Progresso 0 -> 1 que mapeia o primeiro ao último frame do conjunto. */
  progress: MotionValue<number>;
  /** Descrição da cena para leitores de tela. */
  alt: string;
  className?: string;
  /** Avisa o pai quando o primeiro frame já está pintado. */
  onFirstFrame?: () => void;
};

type Conexao = { saveData?: boolean; effectiveType?: string };

/**
 * Qual variante baixar e de quantos em quantos frames.
 *
 * Numa conexão fraca não adianta insistir nos 80 frames: até chegarem, a
 * pessoa já rolou. Preferimos uma animação com menos passos que responda
 * na hora — o desenho cai no vizinho carregado, então pular frames deixa o
 * movimento mais duro, nunca parado.
 *
 * Com "prefers-reduced-motion" a sequência continua rodando, e de propósito:
 * ela não se move sozinha, avança na medida exata do scroll de quem está
 * lendo. O que a preferência desliga aqui é a fluidez — menos frames, um
 * movimento mais seco — e, fora deste componente, tudo que anima por conta
 * própria (marquee, laço da seta, entradas).
 */
function escolherPerfil(reduzirMovimento: boolean): { variante: 'lg' | 'sm'; passo: number } {
  if (typeof window === 'undefined') return { variante: 'sm', passo: 4 };
  const conn = (navigator as Navigator & { connection?: Conexao }).connection;
  const tipo = conn?.effectiveType ?? '';

  const passoMinimo = reduzirMovimento ? 4 : 1;
  const comPasso = (variante: 'lg' | 'sm', passo: number) => ({
    variante,
    passo: Math.max(passo, passoMinimo),
  });

  if (conn?.saveData || /^(slow-)?2g$/.test(tipo)) return comPasso('sm', 4);
  if (tipo === '3g') return comPasso('sm', 2);
  return comPasso(window.innerWidth <= 900 ? 'sm' : 'lg', 1);
}

/** Caminho de cada frame do conjunto, na ordem em que serão tocados. */
export function urlsDasTrilhas(trilhas: readonly Trilha[], variante: string): string[] {
  return trilhas.flatMap(({ nome, frames }) =>
    Array.from(
      { length: frames },
      (_, i) => `/img/sequencias/${nome}/${variante}/${String(i + 1).padStart(3, '0')}.webp`,
    ),
  );
}

/**
 * Ordem de download que cobre a linha do tempo inteira antes de refiná-la:
 * primeiro um frame a cada 16, depois a cada 8, 4, 2 e enfim todos.
 *
 * Baixar 1,2,3…80 em ordem deixaria o fim da sequência sem imagem por muito
 * tempo — quem rolasse rápido veria o primeiro frame parado. Assim, com uma
 * dúzia de arquivos já existe imagem em qualquer ponto do scroll, e a
 * granularidade melhora sozinha enquanto o resto chega.
 */
export function ordemDeCarga(total: number): number[] {
  const ordem: number[] = [];
  const visto = new Set<number>();
  for (let passo = 16; passo >= 1; passo = passo >> 1) {
    for (let i = 0; i < total; i += passo) {
      if (!visto.has(i)) {
        visto.add(i);
        ordem.push(i);
      }
    }
  }
  // Garante o último frame cedo: é ele que emenda com a seção seguinte.
  const ultimo = total - 1;
  if (visto.has(ultimo)) ordem.splice(ordem.indexOf(ultimo), 1);
  ordem.splice(1, 0, ultimo);
  return ordem;
}

/**
 * Reproduz uma ou mais sequências de frames em <canvas>, com o scroll no lugar
 * da linha do tempo. Várias trilhas viram uma só: ao acabar a primeira, a
 * segunda continua sem corte.
 *
 * Enquanto o frame exato não chegou, desenhamos o vizinho carregado mais
 * próximo — a animação fica mais grosseira, nunca parada.
 */
export function ScrollSequence({ trilhas, progress, alt, className, onFirstFrame }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pintarRef = useRef<(alvo: number) => void>(() => {});
  const rafRef = useRef(0);
  const alvoRef = useRef(0);
  const [carregados, setCarregados] = useState(0);
  const reduzirMovimento = useReducedMotion();

  const total = useMemo(() => trilhas.reduce((n, t) => n + t.frames, 0), [trilhas]);
  // A identidade do array muda a cada render do pai; a chave estável é o conteúdo.
  const chave = useMemo(() => trilhas.map((t) => `${t.nome}:${t.frames}`).join('|'), [trilhas]);

  useEffect(() => {
    const { variante, passo } = escolherPerfil(reduzirMovimento === true);
    const urls = urlsDasTrilhas(trilhas, variante);
    const imagens: (HTMLImageElement | null)[] = new Array(total).fill(null);
    let desenhado = -1;
    let cancelado = false;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });

    /** Desenha o frame `i` cobrindo o canvas, preservando a proporção. */
    const pintar = (i: number) => {
      if (!canvas || !ctx) return;
      const img = imagens[i];
      if (!img) return;

      const { width: cw, height: ch } = canvas;
      const escala = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * escala;
      const dh = img.naturalHeight * escala;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      desenhado = i;
    };

    /** Do frame pedido, cai para o vizinho carregado mais próximo. */
    const pintarVizinho = (alvo: number) => {
      if (imagens[alvo]) return pintar(alvo);
      for (let d = 1; d < total; d++) {
        if (imagens[alvo - d]) return pintar(alvo - d);
        if (imagens[alvo + d]) return pintar(alvo + d);
      }
    };
    pintarRef.current = pintarVizinho;

    const redimensionar = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      pintarVizinho(desenhado < 0 ? alvoRef.current : desenhado);
    };

    const carregar = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = urls[i];
        img.onload = () => {
          if (cancelado) return resolve();
          imagens[i] = img;
          setCarregados((n) => n + 1);
          if (i === 0 && desenhado < 0) {
            redimensionar();
            onFirstFrame?.();
          }
          // Todo frame novo pode ser melhor que o que está na tela: se ele
          // fica mais perto do alvo atual, repinta.
          if (Math.abs(i - alvoRef.current) < Math.abs(desenhado - alvoRef.current)) {
            pintarVizinho(alvoRef.current);
          }
          resolve();
        };
        img.onerror = () => resolve();
      });

    (async () => {
      await carregar(0);
      if (cancelado) return;
      // Com passo > 1 baixamos só uma fatia dos frames; o resto é interpolado
      // pelo vizinho mais próximo na hora de pintar.
      const ultimo = total - 1;
      const ordem = ordemDeCarga(total).filter(
        (i) => i !== 0 && (passo === 1 || i % passo === 0 || i === ultimo),
      );
      const LOTE = 6;
      for (let i = 0; i < ordem.length; i += LOTE) {
        if (cancelado) return;
        await Promise.all(ordem.slice(i, i + LOTE).map(carregar));
      }
    })();

    window.addEventListener('resize', redimensionar);
    redimensionar();

    return () => {
      cancelado = true;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', redimensionar);
      pintarRef.current = () => {};
    };
    // `trilhas` entra pela chave estável, não pela identidade do array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, total, reduzirMovimento, onFirstFrame]);

  // O scroll só agenda o próximo desenho; pintar acontece no frame do browser.
  useMotionValueEvent(progress, 'change', (valor) => {
    const alvo = Math.min(total - 1, Math.max(0, Math.round(valor * (total - 1))));
    if (alvo === alvoRef.current) return;
    alvoRef.current = alvo;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => pintarRef.current(alvo));
  });

  return (
    <>
      <canvas ref={canvasRef} className={className} aria-hidden="true" />
      {/* O canvas não é legível por leitores de tela; a cena é descrita aqui. */}
      <span className="sr-only">{alt}</span>
      <span className="sr-only" aria-live="polite">
        {carregados >= total ? 'Sequência do laboratório carregada.' : ''}
      </span>
    </>
  );
}
