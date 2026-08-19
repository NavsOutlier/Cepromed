import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { useRef } from 'react';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
      {/* Background Image with Zoom-Out entry */}
      <motion.div
        initial={{ scale: 1.2, filter: "blur(10px)" }}
        animate={{ scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        style={{ scale: scrollYProgress.get() > 0 ? scale : undefined }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#923032]/70 via-black/40 to-black/60 z-10" />
        <img 
          src="/Cepromed.png" 
          alt="Equipe Cepromed"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto"
      >
        <div className="overflow-hidden mb-6">
          <motion.p 
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/90 text-sm md:text-base font-semibold tracking-[0.2em] uppercase"
          >
            Laboratório de Ensaios e Certificação
          </motion.p>
        </div>

        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.6
              }
            }
          }}
        >
          {["SEGURANÇA", "EM", "PRODUTOS", "PARA", "A", "SAÚDE"].map((word, index) => (
            <motion.span 
              key={index} 
              className="inline-block mr-[2vw]"
              variants={{
                hidden: { opacity: 0, y: 100, rotateX: -45 },
                visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
          className="mt-16"
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white bg-white/5 backdrop-blur-sm shadow-xl"
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
