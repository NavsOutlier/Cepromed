import { motion } from 'motion/react';
import { ArrowUpRight, GraduationCap, HeartPulse, Microscope } from 'lucide-react';
import { site } from '../lib/site';

const motivos = [
  {
    icone: Microscope,
    titulo: 'Trabalho técnico de verdade',
    texto: 'Ensaios normalizados, instrumentação analítica e método — não improviso.',
  },
  {
    icone: GraduationCap,
    titulo: 'Capacitação contínua',
    texto: 'Treinamento permanente é um objetivo declarado do nosso sistema de qualidade.',
  },
  {
    icone: HeartPulse,
    titulo: 'Impacto direto na saúde',
    texto: 'O que sai daqui define o que chega com segurança ao paciente.',
  },
];

export function Careers() {
  return (
    <section id="trabalhe-conosco" className="scroll-mt-24 bg-zinc-950 py-24 text-white sm:py-32">
      <div className="container-page grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
            Trabalhe conosco
          </p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Faça parte de uma equipe que responde pela segurança do paciente
          </h2>
          <p className="mb-10 max-w-lg text-lg font-light leading-relaxed text-zinc-400">
            Buscamos profissionais qualificados e engajados nas áreas de biologia, farmácia,
            química, engenharia e qualidade. Envie seu currículo com a vaga de interesse no assunto.
          </p>
          <a
            href={`mailto:${site.emailVagas}?subject=${encodeURIComponent('Currículo - área de interesse')}`}
            className="group inline-flex items-center gap-2 rounded-md bg-white px-8 py-4 text-sm font-semibold uppercase tracking-widest text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            Enviar currículo
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </motion.div>

        <motion.ul
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-4"
        >
          {motivos.map(({ icone: Icone, titulo, texto }) => (
            <motion.li
              key={titulo}
              variants={{ hidden: { opacity: 0, x: 32 }, visible: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex items-start gap-5 rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-7"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-700">
                <Icone className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              <div>
                <h3 className="mb-1.5 text-lg font-bold">{titulo}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{texto}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
