import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, type MotionValue } from 'motion/react';

type Props = {
  /** Nome da pasta em public/img/sequencias (ex.: "cientista"). */
  name: string;
  frameCount: number;
  /** Progresso 0 -> 1 que mapeia o primeiro ao último frame. */
  progress: MotionValue<number>;
  /** Descrição da cena para leitores de tela. */
  alt: string;
  className?: string;
  /** Avisa o pai quando o primeiro frame já está pintado. */
  onFirstFrame?: () => void;
};

/** Telas pequenas e conexões econômicas recebem a variante leve. */
function pickVariant(): 'lg' | 'sm' {
  if (typeof window === 'undefined') return 'sm';
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return 'sm';
  return window.innerWidth <= 900 ? 'sm' : 'lg';
}

const frameUrl = (name: string, variant: string, i: number) =>
  `/img/sequencias/${name}/${variant}/${String(i + 1).padStart(3, '0')}.webp`;

/**
 * Reproduz uma sequência de frames em <canvas>, com o scroll no lugar da
 * linha do tempo. Os frames são pré-carregados em background; enquanto o
 * frame alvo não chegou, mantemos o último já disponível — nunca piscamos.
 *
 * Com "prefers-reduced-motion" a sequência não roda: fica no primeiro frame.
 */
export function ScrollSequence({ name, frameCount, progress, alt, className, onFirstFrame }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const drawnRef = useRef(-1);
  const rafRef = useRef(0);
  const [loaded, setLoaded] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const variant = pickVariant();
    const images: (HTMLImageElement | null)[] = new Array(frameCount).fill(null);
    framesRef.current = images;
    let cancelled = false;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });

    /** Desenha o frame `i` cobrindo o canvas, preservando a proporção. */
    const paint = (i: number) => {
      if (!canvas || !ctx) return;
      const img = images[i];
      if (!img) return;

      const { width: cw, height: ch } = canvas;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      drawnRef.current = i;
    };

    /** Do frame pedido, cai para o vizinho carregado mais próximo. */
    const paintNearest = (target: number) => {
      if (images[target]) return paint(target);
      for (let d = 1; d < frameCount; d++) {
        if (images[target - d]) return paint(target - d);
        if (images[target + d]) return paint(target + d);
      }
    };

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      paintNearest(drawnRef.current < 0 ? 0 : drawnRef.current);
    };

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = frameUrl(name, variant, i);
        img.onload = () => {
          if (cancelled) return resolve();
          images[i] = img;
          setLoaded((n) => n + 1);
          if (i === 0) {
            resize();
            onFirstFrame?.();
          } else if (i === drawnRef.current + 1 || drawnRef.current < 0) {
            paintNearest(i);
          }
          resolve();
        };
        img.onerror = () => resolve();
      });

    (async () => {
      await load(0);
      if (cancelled || reduceMotion) return;
      // Baixa o restante em lotes pequenos para não competir com o resto da página.
      const rest = Array.from({ length: frameCount - 1 }, (_, k) => k + 1);
      const BATCH = 6;
      for (let i = 0; i < rest.length; i += BATCH) {
        if (cancelled) return;
        await Promise.all(rest.slice(i, i + BATCH).map(load));
      }
    })();

    window.addEventListener('resize', resize);
    resize();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [name, frameCount, reduceMotion, onFirstFrame]);

  // O scroll só agenda o próximo desenho; pintar acontece no frame do browser.
  useMotionValueEvent(progress, 'change', (value) => {
    if (reduceMotion) return;
    const target = Math.min(frameCount - 1, Math.max(0, Math.round(value * (frameCount - 1))));
    if (target === drawnRef.current) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d', { alpha: false });
      const img = framesRef.current[target];
      if (!canvas || !ctx || !img) return;
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
      drawnRef.current = target;
    });
  });

  return (
    <>
      <canvas ref={canvasRef} className={className} aria-hidden="true" />
      {/* O canvas não é legível por leitores de tela; a cena é descrita aqui. */}
      <span className="sr-only">{alt}</span>
      <span className="sr-only" aria-live="polite">
        {loaded >= frameCount ? 'Sequência do laboratório carregada.' : ''}
      </span>
    </>
  );
}
