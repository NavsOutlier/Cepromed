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
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-brand-700 selection:text-white">
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <Immersion />
        <Services />
        <Accreditations />
        <Careers />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
