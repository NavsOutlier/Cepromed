import { motion } from 'motion/react';
import { FlaskConical, MapPin, Quote, Users } from 'lucide-react';
import { indicadores, principios } from '../lib/site';

const diferenciais = [
  {
    icone: FlaskConical,
    titulo: 'Cinco laboratórios',
    texto:
      'Ensaios físicos, mecânicos, químicos, microbiológicos e de biocompatibilidade na mesma unidade.',
  },
  {
    icone: Users,
    titulo: 'Corpo técnico próprio',
    texto:
      'Equipe técnica e gerencial mantida sob o Sistema de Gestão da Qualidade, conforme a ISO/IEC 17025.',
  },
];

const surgir = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export function About() {
  return (
    <section id="o-cepromed" data-tema="claro" className="scroll-mt-24 bg-zinc-50 py-24 sm:py-32">
      <div className="container-page">
        {/* Faixa de credibilidade: números antes do texto longo. */}
        <motion.dl
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-20 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4"
        >
          {indicadores.map((item) => (
            <motion.div key={item.label} variants={surgir} className="bg-white p-6 sm:p-8">
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block font-display text-2xl font-bold tracking-tight text-brand-700 sm:text-3xl">
                  {item.valor}
                </span>
                <span className="mt-2 block text-sm font-semibold text-zinc-900">{item.label}</span>
                <span className="mt-1 block text-sm leading-relaxed text-zinc-500">{item.detalhe}</span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          <motion.div
            variants={surgir}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
              Quem somos
            </p>
            <h2 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl">
              Ensaios e certificação para produtos médico-hospitalares
            </h2>
            <p className="mb-6 text-lg font-light leading-relaxed text-zinc-600">
              O Cepromed iniciou suas atividades em 2011, em Varginha (MG). Em 2019 mudou-se para
              sede própria às margens da Rodovia Fernão Dias, em Três Corações, no Sul de Minas
              Gerais.
            </p>
            <p className="mb-10 text-lg font-light leading-relaxed text-zinc-600">
              São 4.000 m² de área total e 950 m² construídos, distribuídos entre os laboratórios de
              ensaios físicos, mecânicos, químicos, microbiológicos e de biocompatibilidade, além de
              sala de reuniões, área de carga e descarga, triagem e armazenamento de amostras.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {diferenciais.map(({ icone: Icone, titulo, texto }) => (
                <div key={titulo} className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50">
                    <Icone className="h-6 w-6 text-brand-700" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="mb-1 text-lg font-bold">{titulo}</h3>
                    <p className="text-sm leading-relaxed text-zinc-500">{texto}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 flex items-center gap-2 text-sm text-zinc-500">
              <MapPin className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
              Acreditado pelo INMETRO para seringas, agulhas, equipos, luvas e preservativos.
            </p>
          </motion.div>

          <motion.div
            variants={surgir}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="space-y-8"
          >
            <picture>
              <source srcSet="/img/equipe.webp" type="image/webp" />
              <img
                src="/img/equipe.jpg"
                alt="Composição institucional do Cepromed: analistas em bancada de laboratório cercados por ícones de microscopia, laudos, certificação e atendimento."
                width={1800}
                height={1013}
                loading="lazy"
                decoding="async"
                className="aspect-[16/9] w-full rounded-2xl object-cover shadow-xl"
              />
            </picture>

            {/* Política, missão e visão vêm literalmente do site institucional. */}
            <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-xl sm:p-10">
              <div className="mb-8 flex items-center gap-4 border-b border-zinc-100 pb-6">
                <Quote className="h-7 w-7 shrink-0 text-brand-700" aria-hidden="true" />
                <h3 className="text-2xl font-bold">Política, missão e visão</h3>
              </div>

              <dl className="space-y-7">
                {principios.map((item, i) => (
                  <motion.div
                    key={item.titulo}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.1 }}
                  >
                    <dt className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                      {item.titulo}
                    </dt>
                    <dd className="leading-relaxed text-zinc-600">{item.texto}</dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
