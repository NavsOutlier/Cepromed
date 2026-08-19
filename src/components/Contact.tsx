import { useEffect, useRef, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { servicos, site } from '../lib/site';
import { EVENTO_ESCOPO } from '../lib/orcamento';

type Estado = 'ocioso' | 'enviando' | 'enviado' | 'erro';

/** Endpoint opcional (Formspree, n8n, API própria). Sem ele, caímos no e-mail. */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

const canais = [
  { icone: Phone, rotulo: 'Telefone', valor: site.telefone, href: `tel:${site.telefoneLink}` },
  { icone: Mail, rotulo: 'E-mail', valor: site.email, href: `mailto:${site.email}` },
  {
    icone: MapPin,
    rotulo: 'Endereço',
    valor: `${site.endereco.linha}, ${site.endereco.cidade}/${site.endereco.uf}`,
    href: site.mapsUrl,
  },
  { icone: Clock, rotulo: 'Atendimento', valor: site.horario, href: undefined },
];

/** Monta um mailto legível quando não há endpoint configurado. */
function abrirEmail(dados: Record<string, string>) {
  const corpo = [
    `Nome: ${dados.nome}`,
    `Empresa: ${dados.empresa || '-'}`,
    `E-mail: ${dados.email}`,
    `Telefone: ${dados.telefone || '-'}`,
    `Escopo: ${dados.escopo || '-'}`,
    '',
    dados.mensagem,
  ].join('\n');

  const assunto = `Solicitação de orçamento - ${dados.nome}`;
  window.location.href =
    `mailto:${site.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
}

export function Contact() {
  const [estado, setEstado] = useState<Estado>('ocioso');
  const [escopo, setEscopo] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Clicar em "solicitar este ensaio" num card já deixa o escopo escolhido.
  useEffect(() => {
    const onEscopo = (e: Event) => {
      setEscopo((e as CustomEvent<string>).detail);
      setEstado('ocioso');
    };
    window.addEventListener(EVENTO_ESCOPO, onEscopo);
    return () => window.removeEventListener(EVENTO_ESCOPO, onEscopo);
  }, []);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(evento.currentTarget)) as Record<string, string>;

    if (!ENDPOINT) {
      abrirEmail(dados);
      setEstado('enviado');
      return;
    }

    setEstado('enviando');
    try {
      const resposta = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!resposta.ok) throw new Error(String(resposta.status));
      setEstado('enviado');
      formRef.current?.reset();
      setEscopo('');
    } catch {
      setEstado('erro');
    }
  }

  const campo =
    'w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-brand-700';
  const rotulo = 'mb-2 block text-sm font-medium text-zinc-700';

  return (
    <section id="contato" className="scroll-mt-24 bg-zinc-50 py-24 sm:py-32">
      <div className="container-page grid grid-cols-1 gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Fale com o laboratório
          </p>
          <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Solicite um orçamento
          </h2>
          <p className="mb-12 max-w-md text-lg font-light leading-relaxed text-zinc-600">
            Descreva o produto e o ensaio pretendido. Nossa equipe técnica retorna com escopo,
            prazo e condições.
          </p>

          <ul className="space-y-6">
            {canais.map(({ icone: Icone, rotulo: nome, valor, href }) => (
              <li key={nome} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50">
                  <Icone className="h-5 w-5 text-brand-700" aria-hidden="true" />
                </span>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    {nome}
                  </span>
                  {href ? (
                    <a
                      href={href}
                      {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="text-zinc-800 transition-colors hover:text-brand-700"
                    >
                      {valor}
                    </a>
                  ) : (
                    <span className="text-zinc-800">{valor}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <form
            ref={formRef}
            onSubmit={enviar}
            className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-xl sm:p-10"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="nome" className={rotulo}>
                  Nome <span className="text-brand-700">*</span>
                </label>
                <input id="nome" name="nome" required autoComplete="name" className={campo} />
              </div>
              <div>
                <label htmlFor="empresa" className={rotulo}>
                  Empresa
                </label>
                <input id="empresa" name="empresa" autoComplete="organization" className={campo} />
              </div>
              <div>
                <label htmlFor="email" className={rotulo}>
                  E-mail <span className="text-brand-700">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={campo}
                />
              </div>
              <div>
                <label htmlFor="telefone" className={rotulo}>
                  Telefone
                </label>
                <input id="telefone" name="telefone" type="tel" autoComplete="tel" className={campo} />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="escopo" className={rotulo}>
                Escopo de interesse
              </label>
              <select
                id="escopo"
                name="escopo"
                value={escopo}
                onChange={(e) => setEscopo(e.target.value)}
                className={campo}
              >
                <option value="">Selecione um escopo</option>
                {servicos.map((s) => (
                  <option key={s.slug} value={s.titulo}>
                    {s.titulo}
                  </option>
                ))}
                <option value="Outro">Outro / não sei ainda</option>
              </select>
            </div>

            <div className="mt-5">
              <label htmlFor="mensagem" className={rotulo}>
                Mensagem <span className="text-brand-700">*</span>
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                required
                rows={5}
                placeholder="Produto, norma de referência, quantidade de amostras e prazo desejado."
                className={`${campo} resize-y`}
              />
            </div>

            <div className="mt-5 flex items-start gap-3">
              <input
                id="consentimento"
                name="consentimento"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 shrink-0 accent-brand-700"
              />
              <label htmlFor="consentimento" className="text-sm leading-relaxed text-zinc-500">
                Autorizo o Cepromed a usar meus dados para responder a esta solicitação, conforme a
                LGPD.
              </label>
            </div>

            <button
              type="submit"
              disabled={estado === 'enviando'}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-700 px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {estado === 'enviando' ? 'Enviando...' : 'Enviar solicitação'}
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>

            <p aria-live="polite" className="mt-4 min-h-6 text-center text-sm">
              {estado === 'enviado' && (
                <span className="font-medium text-emerald-700">
                  {ENDPOINT
                    ? 'Solicitação enviada. Em breve entraremos em contato.'
                    : 'Abrimos seu programa de e-mail com a mensagem pronta, basta enviar.'}
                </span>
              )}
              {estado === 'erro' && (
                <span className="font-medium text-brand-700">
                  Não foi possível enviar. Tente novamente ou escreva para{' '}
                  <a href={`mailto:${site.email}`} className="underline">
                    {site.email}
                  </a>
                  .
                </span>
              )}
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
