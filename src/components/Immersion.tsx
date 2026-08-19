import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { FRAME_FINAL } from '../lib/sequencias';

const etapas = [
  {
    titulo: 'Amostra',
    texto: 'Cada lote entra identificado e rastreado, com cadeia de custódia registrada da recepção ao descarte.',
  },
  {
    titulo: 'Ensaio',
    texto: 'Métodos normalizados ABNT NBR e ISO, executados sob o Sistema de Gestão da Qualidade ISO/IEC 17025.',
  },
  {
    titulo: 'Laudo',
    texto: 'Resultado assinado por responsável técnico, com incerteza declarada e validade reconhecida pelos órgãos.',
  },
];

/** Uma etapa aparece, se mantém e sai conforme o scroll atravessa sua fatia. */
function Etapa({
  progress,
  indice,
  total,
  titulo,
  texto,
}: {
  progress: MotionValue<number>;
  indice: number;
  total: number;
  titulo: string;
  texto: string;
}) {
  const fatia = 1 / total;
  const inicio = indice * fatia;
  const opacity = useTransform(
    progress,
    [inicio, inicio + fatia * 0.2, inicio + fatia * 0.8, inicio + fatia],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [inicio, inicio + fatia], ['28px', '-28px']);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 max-w-xl">
      <span className="mb-4 block font-display text-sm font-semibold uppercase tracking-[0.3em] text-brand-300">
        {String(indice + 1).padStart(2, '0')} — {titulo}
      </span>
      <p className="text-2xl font-light leading-snug text-white sm:text-3xl lg:text-4xl">{texto}</p>
    </motion.div>
  );
}

/**
 * Faixa entre o institucional e os escopos. O fundo é exatamente o último
 * frame do hero, parado: quem chega aqui rolando vê a imagem que a sequência
 * acabou de deixar na tela, sem corte. Por cima passam as três etapas do
 * fluxo de ensaio.
 */
export function Immersion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section ref={containerRef} data-tema="escuro" className="relative h-[300vh] bg-zinc-950">
      <div className="sticky top-0 h-screen overflow-hidden">
        <picture>
          <source media="(max-width: 900px)" srcSet={FRAME_FINAL.sm} />
          <img
            src={FRAME_FINAL.lg}
            alt=""
            aria-hidden="true"
            width={1600}
            height={900}
            decoding="async"
            // object-top espelha o ancoraY="top" do hero: sem isso a emenda salta.
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-brand-950/40" />

        <div className="container-page relative flex h-full items-center">
          <div className="relative w-full">
            {etapas.map((etapa, i) => (
              <Etapa
                key={etapa.titulo}
                progress={scrollYProgress}
                indice={i}
                total={etapas.length}
                titulo={etapa.titulo}
                texto={etapa.texto}
              />
            ))}
          </div>
        </div>

        {/* Trilha de progresso da faixa. */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/15">
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="h-full origin-left bg-brand-500"
          />
        </div>
      </div>
    </section>
  );
}
