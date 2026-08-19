import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ScrollSequence } from './ScrollSequence';

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
 * Faixa de respiro entre o institucional e os escopos: a microscopia roda ao
 * fundo enquanto as três etapas do fluxo de ensaio se revezam por cima.
 */
export function Immersion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-zinc-950">
      <div className="sticky top-0 h-screen overflow-hidden">
        <ScrollSequence
          name="molecula"
          frameCount={40}
          progress={scrollYProgress}
          alt="Animação de um modelo molecular tridimensional girando lentamente."
          className="absolute inset-0 h-full w-full"
        />
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
