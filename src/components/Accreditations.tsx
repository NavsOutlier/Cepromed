import { useReducedMotion } from 'motion/react';
import { acreditacoes, registros } from '../lib/site';

function Selo({ nome, logo, oculto }: { nome: string; logo: string; oculto?: boolean }) {
  return (
    <img
      src={logo}
      alt={oculto ? '' : nome}
      aria-hidden={oculto || undefined}
      width={160}
      height={80}
      loading="lazy"
      decoding="async"
      className="h-14 w-auto shrink-0 object-contain opacity-70 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0 sm:h-16"
    />
  );
}

export function Accreditations() {
  const reduzirMovimento = useReducedMotion();

  return (
    <section id="acreditacoes" data-tema="claro" className="scroll-mt-24 border-t border-zinc-100 bg-white py-20">
      <div className="container-page mb-12 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
          Acreditações e parcerias
        </p>
        <h2 className="mb-8 text-2xl font-bold text-zinc-900 sm:text-3xl">
          Reconhecimento por quem regula o setor
        </h2>

        {/* Os números de registro são a prova concreta por trás dos selos. */}
        <ul className="flex flex-wrap items-center justify-center gap-3">
          {registros.map((r) => (
            <li
              key={r.registro}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-5 py-2 text-sm text-zinc-600"
            >
              <span className="font-semibold text-zinc-900">{r.orgao}</span>{' '}
              <span className="font-mono text-brand-700">{r.registro}</span>
              <span className="text-zinc-400"> · {r.detalhe}</span>
            </li>
          ))}
        </ul>
      </div>

      {reduzirMovimento ? (
        <ul className="container-page flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
          {acreditacoes.map((item) => (
            <li key={item.nome}>
              <Selo nome={item.nome} logo={item.logo} />
            </li>
          ))}
        </ul>
      ) : (
        // A faixa é duplicada para que o loop de -50% emende sem salto.
        // O hover/foco pausa a rolagem para dar tempo de ler cada selo.
        <div className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-16 px-8 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] sm:gap-24">
            {acreditacoes.map((item) => (
              <Selo key={item.nome} nome={item.nome} logo={item.logo} />
            ))}
            {acreditacoes.map((item) => (
              <Selo key={`${item.nome}-copia`} nome={item.nome} logo={item.logo} oculto />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
