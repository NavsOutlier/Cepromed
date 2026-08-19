/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Accreditations } from './components/Accreditations';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-[#923032] selection:text-white">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Accreditations />
      </main>
      <Footer />
    </div>
  );
}
