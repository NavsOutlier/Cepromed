import { useCallback, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { ScrollSequence } from './ScrollSequence';
import { TRILHAS_HERO } from '../lib/sequencias';

const TITULO = ['Segurança', 'em', 'produtos', 'para', 'a', 'saúde'];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pronto, setPronto] = useState(false);

  // O container tem mais que uma tela de altura: a sobra é o "tempo" da sequência.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const conteudoOpacidade = useTransform(scrollYProgress, [0, 0.18, 1], [1, 0, 0]);
  const conteudoY = useTransform(scrollYProgress, [0, 0.18, 1], ['0%', '-18%', '-18%']);
  // Com o texto fora da tela o véu de contraste não é mais necessário:
  // ele se abre e deixa a sequência aparecer no resto da rolagem.
  const veuOpacidade = useTransform(scrollYProgress, [0, 0.28, 1], [1, 0, 0]);

  // Sem useCallback esta prop muda a cada render e remonta a sequência inteira.
  const marcarPronto = useCallback(() => setPronto(true), []);

  return (
    <section ref={containerRef} id="inicio" data-tema="escuro" className="relative h-[420vh] bg-zinc-950">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ScrollSequence
          trilhas={TRILHAS_HERO}
          progress={scrollYProgress}
          alt="Analista do Cepromed ajustando um microscópio óptico em bancada de laboratório; em seguida, um modelo molecular tridimensional gira lentamente."
          ancoraY="top"
          className="absolute inset-0 h-full w-full object-cover"
          onFirstFrame={marcarPronto}
        />

        {/* Base compartilhada com a seção seguinte: na emenda o tom não salta. */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-brand-950/40" />
        {/* Reforço de contraste enquanto a chamada está na tela. */}
        <motion.div
          style={{ opacity: veuOpacidade }}
          className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/60"
        />

        <motion.div
          style={{ opacity: conteudoOpacidade, y: conteudoY }}
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
      </div>
    </section>
  );
}
