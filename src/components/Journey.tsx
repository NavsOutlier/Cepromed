import { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from 'motion/react';
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
import { useAncorasProjetadas } from '../lib/ancoras';

const icones: Record<Etapa['icone'], LucideIcon> = {
  mail: Mail,
  truck: Truck,
  clipboard: ClipboardCheck,
  flask: FlaskConical,
  file: FileCheck,
  send: Send,
};

const TOTAL = etapasProcesso.length;

type Props = {
  /** Progresso 0 -> 1 da jornada (já descontada a fase de animação). */
  progresso: MotionValue<number>;
  /** Opacidade do conjunto, controlada pelo Hero na virada de fase. */
  opacidade: MotionValue<number>;
};

/**
 * A jornada da amostra, do pedido ao laudo de volta.
 *
 * Não é uma seção: é a segunda fase do palco do hero. Quando a sequência
 * chega ao último frame, este overlay surge por cima do mesmo canvas — sem
 * troca de seção não há costura, e a molécula que a animação deixou na tela
 * é a mesma sobre a qual as etapas acendem.
 */
export function Journey({ progresso, opacidade }: Props) {
  const palcoRef = useRef<HTMLDivElement>(null);
  const [ativa, setAtiva] = useState(0);
  // Posição de cada esfera da molécula, já projetada para a tela.
  const ancoras = useAncorasProjetadas(palcoRef);

  // A linha enche um pouco à frente da etapa atual, para o traço alcançar o nó
  // junto com o texto, e não depois dele.
  const preenchimento = useTransform(progresso, [0, 0.92], [0, 1]);

  useMotionValueEvent(progresso, 'change', (v) => {
    const indice = Math.min(TOTAL - 1, Math.max(0, Math.floor(v * TOTAL)));
    if (indice !== ativa) setAtiva(indice);
  });

  const etapa = etapasProcesso[ativa];
  const Icone = icones[etapa.icone];

  return (
    <motion.div
      ref={palcoRef}
      style={{ opacity: opacidade }}
      className="pointer-events-none absolute inset-0"
    >
      {/* A rede liga as próprias esferas da molécula: cada etapa fica em
          cima de uma delas, e o traço acende conforme a jornada avança.
          Só a partir de 1280px: abaixo disso o texto avança sobre a área das
          esferas, e aí vale a linha do tempo simples embaixo. */}
      {ancoras.length === etapasProcesso.length && (
        <svg aria-hidden="true" className="absolute inset-0 hidden h-full w-full xl:block">
          {ancoras.slice(0, -1).map((p, i) => {
            const q = ancoras[i + 1];
            const percorrido = i < ativa;
            return (
              <line
                key={i}
                x1={p.x}
                y1={p.y}
                x2={q.x}
                y2={q.y}
                strokeWidth={percorrido ? 2 : 1}
                strokeDasharray={percorrido ? undefined : '4 6'}
                className={`transition-all duration-500 ${
                  percorrido ? 'stroke-brand-400/90' : 'stroke-white/25'
                }`}
              />
            );
          })}

          {ancoras.map((p, i) => {
            const alcancada = i <= ativa;
            const atual = i === ativa;
            return (
              <g key={i} className="transition-opacity duration-500">
                {atual && (
                  <circle cx={p.x} cy={p.y} r={26} className="fill-brand-500/15 stroke-brand-400/40" />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={atual ? 13 : 10}
                  strokeWidth={2}
                  className={`transition-all duration-500 ${
                    alcancada ? 'fill-brand-500 stroke-brand-300' : 'fill-zinc-900/70 stroke-white/35'
                  }`}
                />
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  className={`font-display text-[11px] font-bold transition-colors duration-500 ${
                    alcancada ? 'fill-white' : 'fill-white/50'
                  }`}
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      )}

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

        {/* Linha do tempo horizontal para telas onde a rede não cabe. */}
        <ol className="relative mt-10 flex items-start justify-between gap-1 xl:hidden">
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
    </motion.div>
  );
}
