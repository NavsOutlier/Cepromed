import { motion } from 'motion/react';
import { Microscope, ShieldCheck, Activity, FileCheck, ArrowRight } from 'lucide-react';

const services = [
  {
    title: "Ensaios In Vitro e In Vivo",
    desc: "Testes biológicos e análises rigorosas em laboratório para atestar a segurança e eficácia de materiais médicos.",
    icon: Microscope,
    image: "https://cepromed.com.br/fotosempresa/203/20210908_164339-biocomp.jpg",
    link: "/2824/ensaios"
  },
  {
    title: "Liberação Paramétrica",
    desc: "Garantia de esterilidade e conformidade baseada em parâmetros físicos e químicos documentados, acelerando processos.",
    icon: FileCheck,
    image: "https://cepromed.com.br/fotosempresa/203/20210909_090347-microbiologia.jpg",
    link: "/2825/liberacao"
  },
  {
    title: "Ensaios em Luvas e Preservativos",
    desc: "Análises de resistência, tração e integridade estrutural (látex e cirúrgicas) para total segurança dos usuários.",
    icon: ShieldCheck,
    image: "https://cepromed.com.br/fotosempresa/203/20210908_164212-preservativo.jpg",
    link: "/2826/ensaios-mecanicos-em-luvas-cirurgicas"
  },
  {
    title: "Seringas, Agulhas e Equipos",
    desc: "Testes mecânicos e de vazão precisos para equipamentos de infusão e materiais perfurocortantes.",
    icon: Activity,
    image: "https://cepromed.com.br/fotosempresa/203/20210908_164104-seringa.jpg",
    link: "/2827/equipos-de-infusao"
  }
];

export function Services() {
  return (
    <section className="py-32 bg-white text-zinc-900 relative z-10" id="escopos">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-zinc-200 pb-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-[#923032]">
              Escopos e<br/>Ensaios
            </h2>
            <p className="text-zinc-600 text-lg md:text-xl font-light">
              Nossa infraestrutura integra tecnologia de ponta para a certificação e testes de produtos médico-hospitalares, garantindo conformidade com padrões globais de saúde.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative h-[420px] overflow-hidden rounded-xl bg-zinc-100 cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 z-10" />
              
              <motion.img 
                src={service.image} 
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 z-20 p-10 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-full bg-[#923032] flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                    <service.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 mb-6 bg-white/10 backdrop-blur-sm">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-3 text-white">{service.title}</h3>
                <p className="text-zinc-200 font-light translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
