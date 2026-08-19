import { motion } from 'motion/react';

const accreditations = [
  { name: "ANVISA", logo: "https://cepromed.com.br/fotosempresa/203/images/anvisa-color.jpg" },
  { name: "ABNT", logo: "https://cepromed.com.br/fotosempresa/203/images/abnt-color.jpg" },
  { name: "INMETRO", logo: "https://cepromed.com.br/fotosempresa/203/images/inmetroensaios-color.jpg" },
  { name: "Ministério da Economia", logo: "https://cepromed.com.br/fotosempresa/203/images/ministerio-da-economia-color.jpg" },
  { name: "Sibratec", logo: "https://cepromed.com.br/fotosempresa/203/images/sibratec-color.jpg" },
  { name: "ABRAC", logo: "https://cepromed.com.br/fotosempresa/203/images/abrac-color.jpg" },
  { name: "REBLAS", logo: "https://cepromed.com.br/fotosempresa/203/images/reblas-color.jpg" }
];

export function Accreditations() {
  return (
    <section className="py-24 bg-white border-t border-zinc-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 mb-12 text-center">
        <p className="text-[#923032] font-semibold tracking-[0.2em] uppercase text-sm mb-2">Acreditações e Parcerias</p>
        <h2 className="text-2xl font-bold text-zinc-900">Reconhecimento Nacional</h2>
      </div>

      <div className="relative w-full flex overflow-hidden group">
        {/* We double the content to create a seamless infinite marquee effect */}
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          className="flex whitespace-nowrap items-center gap-16 md:gap-24 px-8"
        >
          {[...accreditations, ...accreditations].map((item, idx) => (
            <div 
              key={idx} 
              className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100"
            >
              <img 
                src={item.logo} 
                alt={item.name} 
                className="h-16 md:h-20 w-auto object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
