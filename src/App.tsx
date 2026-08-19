import { MotionConfig } from 'motion/react';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Immersion } from './components/Immersion';
import { Services } from './components/Services';
import { Accreditations } from './components/Accreditations';
import { Careers } from './components/Careers';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    // "user" faz o Motion seguir a preferência do sistema: o que anima sozinho
    // (laço da seta, entradas) para; o que responde ao scroll continua.
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white text-zinc-900 selection:bg-brand-700 selection:text-white">
        <Header />
        <main id="conteudo">
          <Hero />
          {/* Logo depois do hero: a jornada congela no frame em que a
              sequência parou, então a passagem é contínua. Qualquer seção
              entre as duas quebra essa emenda. */}
          <Immersion />
          <About />
          <Services />
          <Accreditations />
          <Careers />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
