import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { navegacao, site } from '../lib/site';

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-zinc-950 pb-10 pt-20 text-white">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img
              src="/img/logo-cepromed.png"
              alt={site.razaoSocial}
              width={180}
              height={48}
              loading="lazy"
              className="mb-6 h-11 w-auto object-contain brightness-0 invert"
            />
            <p className="text-sm font-light leading-relaxed text-zinc-400">{site.descricao}</p>
          </div>

          <nav aria-label="Rodapé">
            <h2 className="mb-6 text-lg font-bold tracking-tight">Navegação</h2>
            <ul className="space-y-3 text-sm font-light text-zinc-400">
              {navegacao.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-6 text-lg font-bold tracking-tight">Contato</h2>
            <ul className="space-y-4 text-sm font-light text-zinc-400">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {site.endereco.linha}, {site.endereco.cidade}/{site.endereco.uf}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                <a href={`tel:${site.telefoneLink}`} className="transition-colors hover:text-white">
                  {site.telefone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                <span>{site.horario}</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-6 text-lg font-bold tracking-tight">Ouvidoria</h2>
            <p className="mb-6 text-sm font-light leading-relaxed text-zinc-400">
              Canal para elogios, sugestões, reclamações e denúncias sobre nossos serviços. As
              manifestações são tratadas com confidencialidade.
            </p>
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent('Ouvidoria')}`}
              className="inline-block rounded-md border border-white/15 bg-white/5 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:border-brand-700 hover:bg-brand-700"
            >
              Registrar manifestação
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs font-light text-zinc-500 md:flex-row">
          <p>
            © {ano} {site.razaoSocial}. Todos os direitos reservados.
          </p>
          <p>
            {site.endereco.cidade}/{site.endereco.uf} — CEP {site.endereco.cep}
          </p>
        </div>
      </div>
    </footer>
  );
}
