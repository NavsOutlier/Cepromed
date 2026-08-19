import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import {
  ClipboardCheck,
  FileCheck,
  FlaskConical,
  Mail,
  Send,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { etapasProcesso, type Etapa } from '../lib/site';
import { FRAME_FINAL } from '../lib/sequencias';

const icones: Record<Etapa['icone'], LucideIcon> = {
  mail: Mail,
  truck: Truck,
  clipboard: ClipboardCheck,
  flask: FlaskConical,
  file: FileCheck,
  send: Send,
};

const TOTAL = etapasProcesso.length;

/**
 * A jornada da amostra, do pedido ao laudo de volta.
 *
 * O fundo é o último frame do hero, parado: quem chega aqui rolando vê a
 * imagem que a sequência acabou de deixar na tela, sem corte. Por cima, as
 * etapas se revezam enquanto a linha do tempo se preenche — o mesmo gesto de
 * rolar avança o processo, que é o ponto: mostrar que existe um caminho
 * definido entre despachar a amostra e receber o laudo.
 */
export function Immersion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ativa, setAtiva] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // A linha enche um pouco à frente da etapa atual, para o traço alcançar o nó
  // junto com o texto, e não depois dele.
  const preenchimento = useTransform(scrollYProgress, [0, 0.92], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const indice = Math.min(TOTAL - 1, Math.max(0, Math.floor(v * TOTAL)));
    if (indice !== ativa) setAtiva(indice);
  });

  const etapa = etapasProcesso[ativa];
  const Icone = icones[etapa.icone];

  return (
    <section
      ref={containerRef}
      data-tema="escuro"
      className="relative h-[500vh] bg-zinc-950"
      aria-labelledby="titulo-processo"
    >
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
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-brand-950/50" />

        <div className="container-page relative flex h-full flex-col justify-center py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-brand-300">
            Como funciona
          </p>
          <h2
            id="titulo-processo"
            className="mb-10 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Da sua amostra ao laudo na sua mão
          </h2>

          {/* Etapa em foco. Altura fixa para a linha do tempo não pular. */}
          <div className="relative min-h-[16rem] sm:min-h-[13rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={etapa.titulo}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute inset-x-0 top-0 max-w-2xl"
              >
                <div className="mb-4 flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-700 shadow-lg">
                    <Icone className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                  <div>
                    <span className="block font-display text-xs font-semibold uppercase tracking-[0.3em] text-brand-300">
                      Etapa {String(ativa + 1).padStart(2, '0')} de {String(TOTAL).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      {etapa.titulo}
                    </h3>
                  </div>
                </div>

                <p className="mb-3 text-xl font-light leading-snug text-white sm:text-2xl">
                  {etapa.resumo}
                </p>
                <p className="max-w-xl leading-relaxed text-zinc-300">{etapa.detalhe}</p>

                {etapa.prazo && (
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm text-zinc-100 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />
                    {etapa.prazo}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Linha do tempo: os nós ligados por um traço que se preenche. */}
          <ol className="relative mt-10 flex items-start justify-between gap-1">
            <div aria-hidden="true" className="absolute left-0 right-0 top-[11px] h-px bg-white/20" />
            <motion.div
              aria-hidden="true"
              style={{ scaleX: preenchimento }}
              className="absolute left-0 right-0 top-[11px] h-px origin-left bg-brand-500"
            />

            {etapasProcesso.map((item, i) => {
              const alcancada = i <= ativa;
              return (
                <li key={item.titulo} className="relative flex flex-1 flex-col items-center">
                  <span
                    className={`z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                      alcancada ? 'border-brand-400 bg-brand-500' : 'border-white/30 bg-zinc-900'
                    }`}
                  >
                    {alcancada && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    <span className="sr-only">
                      {i + 1}. {item.titulo}
                      {i === ativa ? ' (etapa atual)' : ''}
                    </span>
                  </span>
                  <span
                    className={`mt-3 hidden text-center text-xs font-medium leading-tight transition-colors duration-300 sm:block ${
                      alcancada ? 'text-white' : 'text-zinc-500'
                    }`}
                    aria-hidden="true"
                  >
                    {item.titulo}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
