import { useCallback, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { ScrollSequence } from './ScrollSequence';
import { TRILHAS_HERO } from '../lib/sequencias';
import { Journey } from './Journey';

const TITULO = ['Segurança', 'em', 'produtos', 'para', 'a', 'saúde'];

/**
 * Fração do trilho dedicada à animação. Daí em diante a sequência congela no
 * último frame e a jornada da amostra assume o mesmo palco — uma máscara por
 * cima do canvas, não outra seção, então não existe costura entre as duas
 * fases. O atributo data-fim-animacao expõe o valor para os testes.
 */
const FIM_ANIMACAO = 0.535;

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pronto, setPronto] = useState(false);

  // O container tem muito mais que uma tela: a sobra é o "tempo" das duas
  // fases — primeiro a sequência, depois as etapas da jornada.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /**
   * A roda do mouse rola em saltos, não continuamente: alimentar a sequência
   * com o progresso cru faz a cena pular de um frame para outro. A mola
   * suaviza esses degraus e continua o movimento por alguns quadros depois
   * que o scroll para.
   */
  const progressoSuave = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0002,
  });

  // Fase 1: a sequência toca e congela no último frame ao chegar na fronteira.
  const progressoSequencia = useTransform(progressoSuave, [0, FIM_ANIMACAO, 1], [0, 1, 1]);
  // Fase 2: a jornada só começa a contar quando a animação termina.
  const progressoJornada = useTransform(scrollYProgress, [0, FIM_ANIMACAO, 1], [0, 0, 1]);

  const conteudoOpacidade = useTransform(scrollYProgress, [0, 0.06, 1], [1, 0, 0]);
  const conteudoY = useTransform(scrollYProgress, [0, 0.06, 1], ['0%', '-18%', '-18%']);
  // Invisível não pode ser clicável: os CTAs saem junto com o texto.
  const conteudoCliques = useTransform(conteudoOpacidade, (v) => (v < 0.05 ? 'none' : 'auto'));
  // Com o texto fora da tela o véu de contraste se abre e a sequência aparece.
  const veuOpacidade = useTransform(scrollYProgress, [0, 0.09, 1], [1, 0, 0]);
  // Na virada de fase, um véu lateral volta para dar contraste às etapas.
  const veuJornada = useTransform(
    scrollYProgress,
    [FIM_ANIMACAO - 0.03, FIM_ANIMACAO + 0.02, 1],
    [0, 1, 1],
  );

  // Sem useCallback esta prop muda a cada render e remonta a sequência inteira.
  const marcarPronto = useCallback(() => setPronto(true), []);

  return (
    <section
      ref={containerRef}
      id="inicio"
      data-tema="escuro"
      data-fim-animacao={FIM_ANIMACAO}
      className="relative h-[960vh] bg-zinc-950"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ScrollSequence
          trilhas={TRILHAS_HERO}
          progress={progressoSequencia}
          ancoraY="top"
          alt="Analista do Cepromed ajustando um microscópio óptico em bancada de laboratório; em seguida, um modelo molecular tridimensional gira lentamente e congela."
          className="absolute inset-0 h-full w-full object-cover"
          onFirstFrame={marcarPronto}
        />

        {/* Base de contraste presente nas duas fases. */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-brand-950/40" />
        {/* Reforço enquanto a chamada está na tela. */}
        <motion.div
          style={{ opacity: veuOpacidade }}
          className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/60"
        />
        {/* Véu da segunda fase: escurece a faixa do texto das etapas. */}
        <motion.div
          style={{ opacity: veuJornada }}
          className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/55 to-transparent"
        />

        <motion.div
          style={{ opacity: conteudoOpacidade, y: conteudoY, pointerEvents: conteudoCliques }}
          className="container-page relative flex h-full flex-col justify-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={pronto ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-brand-300 sm:text-sm"
          >
            Laboratório de ensaios e certificação
          </motion.p>

          <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-8xl">
            {TITULO.map((palavra, i) => (
              <span key={palavra} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                <motion.span
                  className="inline-block pr-[0.22em]"
                  initial={{ y: '110%' }}
                  animate={pronto ? { y: '0%' } : {}}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  {palavra}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={pronto ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 max-w-xl text-lg font-light leading-relaxed text-zinc-200 sm:text-xl"
          >
            Seringas, agulhas, equipos, luvas e preservativos ensaiados sob
            acreditação INMETRO na ABNT NBR ISO/IEC 17025 e habilitação ANVISA.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={pronto ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <a
              href="#contato"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-brand-700 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-brand-950/40 transition-colors hover:bg-brand-600"
            >
              Solicitar orçamento
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#escopos"
              className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              Ver escopos
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: conteudoOpacidade }}
          className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
        >
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white backdrop-blur-sm"
          >
            <ArrowDown className="h-5 w-5" />
          </motion.span>
        </motion.div>

        {/* Segunda fase: a jornada assume o palco sobre o frame congelado. */}
        <Journey progresso={progressoJornada} opacidade={veuJornada} />
      </div>
    </section>
  );
}
