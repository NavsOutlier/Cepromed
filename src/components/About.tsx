import { motion } from 'motion/react';
import { Target, CheckCircle2, FlaskConical, Users } from 'lucide-react';

export function About() {
  return (
    <section className="py-32 bg-zinc-50 text-zinc-900 relative" id="o-cepromed">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-[#923032] font-semibold tracking-[0.2em] uppercase mb-4 text-sm">Quem Somos</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              Excelência em Ensaios e Certificações para a Saúde
            </h2>
            <p className="text-zinc-600 text-lg font-light leading-relaxed mb-6">
              O Laboratório Cepromed é uma referência nacional na prestação de serviços de ensaios e certificação de produtos médico-hospitalares. Nosso compromisso é com a exatidão, assegurando que materiais como seringas, agulhas, equipos, luvas e preservativos cheguem ao usuário final com máxima segurança e conformidade.
            </p>
            <p className="text-zinc-600 text-lg font-light leading-relaxed mb-10">
              Contamos com uma estrutura física de alta tecnologia e profissionais amplamente capacitados para atender às rigorosas exigências da ANVISA e outras entidades normativas globais.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#923032]/10 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-6 h-6 text-[#923032]" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Estrutura Física</h4>
                  <p className="text-zinc-500 text-sm">Laboratórios equipados com tecnologia analítica de ponta.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#923032]/10 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-[#923032]" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Equipe Especializada</h4>
                  <p className="text-zinc-500 text-sm">Profissionais qualificados para testes in vivo e in vitro.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#923032] rounded-2xl transform rotate-3 scale-105 opacity-10"></div>
            <div className="bg-white p-10 rounded-2xl shadow-2xl relative border border-zinc-100">
              <div className="flex items-center gap-4 mb-8 border-b border-zinc-100 pb-6">
                <Target className="w-8 h-8 text-[#923032]" />
                <h3 className="text-2xl font-bold">Objetivos da Qualidade</h3>
              </div>
              
              <ul className="space-y-6">
                {[
                  "Garantir a total imparcialidade e confidencialidade nos ensaios realizados.",
                  "Assegurar a melhoria contínua dos processos e do Sistema de Gestão da Qualidade.",
                  "Atender integralmente aos requisitos dos clientes e autoridades regulamentadoras (como ANVISA e INMETRO).",
                  "Capacitar permanentemente nossos colaboradores para a excelência técnica."
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-zinc-600 leading-relaxed">{item}</span>
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
