import { motion } from 'motion/react';
import { Menu, Search } from 'lucide-react';

export function Header() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-md border-b border-zinc-200 text-zinc-900"
    >
      <div className="flex items-center gap-2">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          src="https://cepromed.com.br/fotosempresa/203/images/logotipo-cepromed-topo1.png" 
          alt="Cepromed" 
          className="h-12 object-contain"
        />
      </div>

      <nav className="hidden lg:flex items-center gap-10 text-[11px] uppercase tracking-[0.15em] font-semibold text-zinc-600">
        <a href="#home" className="hover:text-[#923032] transition-colors">Home</a>
        <a href="#o-cepromed" className="hover:text-[#923032] transition-colors">O Cepromed</a>
        <a href="#escopos" className="hover:text-[#923032] transition-colors">Escopos</a>
        <a href="#trabalhe-conosco" className="hover:text-[#923032] transition-colors">Trabalhe Conosco</a>
        <a href="#ouvidoria" className="hover:text-[#923032] transition-colors">Ouvidoria</a>
      </nav>

      <div className="flex items-center gap-6">
        <button className="text-zinc-600 hover:text-[#923032] transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="lg:hidden text-zinc-600 hover:text-[#923032] transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <button className="hidden lg:block px-7 py-2.5 bg-[#923032] text-white rounded-sm text-xs uppercase tracking-widest hover:bg-[#7a2829] transition-colors duration-300 shadow-lg shadow-[#923032]/20">
          Contato
        </button>
      </div>
    </motion.header>
  );
}
