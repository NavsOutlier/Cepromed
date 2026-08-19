import { motion } from 'motion/react';
import { Activity, ArrowRight, FileCheck, Microscope, ShieldCheck, type LucideIcon } from 'lucide-react';
import { servicos, type Servico } from '../lib/site';
import { pedirOrcamento } from '../lib/orcamento';

const icones: Record<Servico['icone'], LucideIcon> = {
  microscope: Microscope,
  file: FileCheck,
  shield: ShieldCheck,
  activity: Activity,
};

function Card({ servico, indice }: { servico: Servico; indice: number }) {
  const Icone = icones[servico.icone];

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: indice * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-xl bg-zinc-900 shadow-sm transition-shadow duration-500 hover:shadow-2xl"
    >
      <picture>
        <source srcSet={`${servico.imagem}.webp`} type="image/webp" />
        <img
          src={`${servico.imagem}.jpg`}
          alt=""
          width={1600}
          height={1200}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-[1200ms] ease-out-expo group-hover:scale-105"
        />
      </picture>

      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />

      <div className="relative flex min-h-[26rem] flex-col justify-end p-8 sm:p-10">
        <span className="mb-6 flex h-13 w-13 items-center justify-center rounded-full bg-brand-700 p-3.5 shadow-lg transition-transform duration-500 group-hover:scale-110">
          <Icone className="h-6 w-6 text-white" strokeWidth={2} aria-hidden="true" />
        </span>

        <h3 className="mb-3 text-2xl font-bold tracking-tight text-white">{servico.titulo}</h3>

        {/* Sempre visível: em telas de toque não existe hover. */}
        <p className="mb-5 max-w-md font-light leading-relaxed text-zinc-300">{servico.descricao}</p>

        <ul className="flex flex-wrap gap-2">
          {servico.itens.map((item) => (
            <li
              key={item}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-zinc-100 backdrop-blur-sm"
            >
              {item}
            </li>
          ))}
        </ul>

        <a
          href="#contato"
          onClick={() => pedirOrcamento(servico.titulo)}
          className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:text-brand-300"
        >
          Solicitar este ensaio
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          <span className="sr-only"> — {servico.titulo}</span>
        </a>
      </div>
    </motion.article>
  );
}

export function Services() {
  return (
    <section id="escopos" className="scroll-mt-24 bg-white py-24 sm:py-32">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-16 max-w-3xl border-b border-zinc-200 pb-12"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            O que ensaiamos
          </p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Escopos e ensaios
          </h2>
          <p className="text-lg font-light text-zinc-600 sm:text-xl">
            Infraestrutura analítica para certificação e testes de produtos médico-hospitalares,
            em conformidade com os padrões nacionais e internacionais de saúde.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {servicos.map((servico, i) => (
            <Card key={servico.slug} servico={servico} indice={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
