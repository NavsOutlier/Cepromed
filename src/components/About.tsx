import { motion } from 'motion/react';
import { CheckCircle2, FlaskConical, Target, Users } from 'lucide-react';
import { indicadores } from '../lib/site';

const diferenciais = [
  {
    icone: FlaskConical,
    titulo: 'Estrutura própria',
    texto: 'Laboratórios de biocompatibilidade, microbiologia e ensaios mecânicos em instalação única.',
  },
  {
    icone: Users,
    titulo: 'Equipe especializada',
    texto: 'Analistas e responsáveis técnicos qualificados para ensaios in vivo e in vitro.',
  },
];

const objetivos = [
  'Garantir imparcialidade e confidencialidade em todos os ensaios realizados.',
  'Assegurar a melhoria contínua dos processos e do Sistema de Gestão da Qualidade.',
  'Atender integralmente aos requisitos de clientes e autoridades regulamentadoras.',
  'Capacitar permanentemente os colaboradores para a excelência técnica.',
];

const surgir = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export function About() {
  return (
    <section id="o-cepromed" className="scroll-mt-24 bg-zinc-50 py-24 sm:py-32">
      <div className="container-page">
        {/* Faixa de credibilidade: números antes do texto longo. */}
        <motion.dl
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-20 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 lg:grid-cols-4"
        >
          {indicadores.map((item) => (
            <motion.div key={item.label} variants={surgir} className="bg-white p-6 sm:p-8">
              <dt className="sr-only">{item.label}</dt>
              <dd>
                <span className="block font-display text-3xl font-bold tracking-tight text-brand-700 sm:text-4xl">
                  {item.valor}
                </span>
                <span className="mt-2 block text-sm font-semibold text-zinc-900">{item.label}</span>
                <span className="mt-1 block text-sm text-zinc-500">{item.detalhe}</span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
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
              Excelência em ensaios e certificações para a saúde
            </h2>
            <p className="mb-6 text-lg font-light leading-relaxed text-zinc-600">
              O Laboratório Cepromed é referência nacional em ensaios e certificação de produtos
              médico-hospitalares. Nosso compromisso é com a exatidão: seringas, agulhas, equipos,
              luvas e preservativos chegam ao usuário final com segurança e conformidade
              comprovadas.
            </p>
            <p className="mb-10 text-lg font-light leading-relaxed text-zinc-600">
              Contamos com estrutura de alta tecnologia e profissionais capacitados para atender às
              exigências da ANVISA, do INMETRO e das demais entidades normativas.
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

            <div className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-xl sm:p-10">
              <div className="mb-6 flex items-center gap-4 border-b border-zinc-100 pb-6">
                <Target className="h-7 w-7 text-brand-700" aria-hidden="true" />
                <h3 className="text-2xl font-bold">Objetivos da qualidade</h3>
              </div>
              <ul className="space-y-5">
                {objetivos.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                    <span className="leading-relaxed text-zinc-600">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
