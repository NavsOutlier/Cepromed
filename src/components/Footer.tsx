import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white pt-24 pb-12 border-t border-white/10" id="ouvidoria">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="lg:col-span-1">
            <img 
              src="https://cepromed.com.br/fotosempresa/203/images/logotipo-cepromed-topo1.png" 
              alt="Cepromed" 
              className="h-12 object-contain mb-6 brightness-0 invert"
            />
            <p className="text-zinc-400 font-light text-sm leading-relaxed mb-6">
              Laboratório especialista na prestação de serviços de ensaios e certificação de produtos médico-hospitalares.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">Ouvidoria & Contato</h4>
            <ul className="space-y-4 text-zinc-400 font-light text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#923032] shrink-0" />
                <span>Rodovia Fernão Dias, BR381 KM 759 - Distrito Industrial, Três Corações/MG</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#923032] shrink-0" />
                <span>(35) 3212-7245</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#923032] shrink-0" />
                <a href="mailto:contato@cepromed.com.br" className="hover:text-white transition-colors">contato@cepromed.com.br</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#923032] shrink-0" />
                <span>Segunda à Sexta, 08h às 18h</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">Trabalhe Conosco</h4>
            <p className="text-zinc-400 font-light text-sm leading-relaxed mb-6">
              Faça parte de uma equipe comprometida com a saúde e a excelência. Buscamos profissionais qualificados e engajados.
            </p>
            <a href="mailto:vagas@cepromed.com.br" className="inline-block px-6 py-2.5 bg-white/5 border border-white/10 rounded-sm text-xs uppercase tracking-widest hover:bg-[#923032] hover:border-[#923032] transition-all duration-300">
              Enviar Currículo
            </a>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">Acesso Restrito</h4>
            <p className="text-zinc-400 font-light text-sm leading-relaxed mb-6">
              Área destinada aos colaboradores e portal de resultados.
            </p>
            <button className="inline-block px-6 py-2.5 bg-white text-zinc-950 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300">
              Área do Cliente
            </button>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light text-zinc-500">
          <p>© {new Date().getFullYear()} Cepromed - Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
