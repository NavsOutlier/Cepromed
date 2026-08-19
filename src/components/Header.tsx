import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { navegacao, site } from '../lib/site';

/** Marca a seção visível para destacar o item correspondente no menu. */
function useSecaoAtiva() {
  const [ativa, setAtiva] = useState('inicio');

  useEffect(() => {
    const ids = navegacao.map((n) => n.href.slice(1));
    const alvos = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visivel) setAtiva(visivel.target.id);
      },
      // A faixa central da tela decide quem está "ativo".
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    alvos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ativa;
}

/**
 * Tema da seção que está passando por baixo da barra.
 *
 * A barra branca por cima do hero cortava a cena no meio; sobre as faixas
 * escuras ela some e o conteúdo respira. Amarrar isso a um número fixo de
 * seções quebraria assim que a ordem mudasse — e deixaria a barra
 * transparente sobre um fundo claro, com o texto branco sumindo. Então cada
 * seção declara `data-tema` e a barra segue o que estiver embaixo dela.
 */
function useTemaDoFundo() {
  const [tema, setTema] = useState<'claro' | 'escuro'>('escuro');

  useEffect(() => {
    const secoes = [...document.querySelectorAll<HTMLElement>('[data-tema]')];
    if (!secoes.length) return;

    const medir = () => {
      // Uma sonda logo abaixo da barra: a seção que a contém manda no tema.
      const linha = window.scrollY + 72;
      let atual = secoes[0];
      for (const s of secoes) {
        if (s.offsetTop <= linha) atual = s;
      }
      setTema(atual.dataset.tema === 'claro' ? 'claro' : 'escuro');
    };

    medir();
    window.addEventListener('scroll', medir, { passive: true });
    window.addEventListener('resize', medir);
    return () => {
      window.removeEventListener('scroll', medir);
      window.removeEventListener('resize', medir);
    };
  }, []);

  return tema;
}

export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const ativa = useSecaoAtiva();
  const tema = useTemaDoFundo();

  // Menu aberto trava o scroll do fundo e fecha no Esc.
  useEffect(() => {
    if (!menuAberto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAberto(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuAberto]);

  const solido = tema === 'claro' || menuAberto;

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Pular para o conteúdo
      </a>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solido
            ? 'border-b border-zinc-200 bg-white/90 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-page flex items-center justify-between py-4">
          <a href="#inicio" className="flex items-center" aria-label={`${site.nome} — início`}>
            <img
              src="/img/logo-cepromed.png"
              alt={site.nome}
              width={180}
              height={48}
              className={`h-10 w-auto object-contain transition-[filter] duration-300 sm:h-12 ${
                solido ? '' : 'brightness-0 invert drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]'
              }`}
            />
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
            {navegacao.map((item) => {
              const atual = ativa === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={atual ? 'true' : undefined}
                  className={`relative text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${
                    solido
                      ? atual
                        ? 'text-brand-700'
                        : 'text-zinc-600 hover:text-brand-700'
                      : atual
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                  {atual && (
                    <motion.span
                      layoutId="nav-ativo"
                      className={`absolute -bottom-1.5 left-0 h-px w-full ${solido ? 'bg-brand-700' : 'bg-white'}`}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contato"
              className="hidden rounded-md bg-brand-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-brand-600 lg:block"
            >
              Orçamento
            </a>
            <button
              type="button"
              onClick={() => setMenuAberto((v) => !v)}
              aria-expanded={menuAberto}
              aria-controls="menu-mobile"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              className={`rounded-md p-2 transition-colors lg:hidden ${
                solido ? 'text-zinc-700 hover:text-brand-700' : 'text-white hover:text-brand-200'
              }`}
            >
              {menuAberto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuAberto && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-white pt-24 lg:hidden"
          >
            <nav aria-label="Principal (mobile)" className="container-page flex flex-col">
              {navegacao.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuAberto(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                  className="border-b border-zinc-100 py-5 text-2xl font-display font-semibold tracking-tight text-zinc-900"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href={`tel:${site.telefoneLink}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-8 rounded-md bg-brand-700 py-4 text-center text-sm font-semibold uppercase tracking-widest text-white"
              >
                Ligar: {site.telefone}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
