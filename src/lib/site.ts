/**
 * Conteúdo institucional em um só lugar: o que muda com frequência
 * (telefone, escopos, selos) fica aqui, não espalhado pelos componentes.
 *
 * Fonte dos dados: cepromed.com.br (páginas "Quem somos", "Política, visão e
 * missão", "Objetivos da qualidade", "Escopos" e "Contato"), consultadas em
 * agosto de 2026. O que não estava publicado ali está marcado com TODO.
 */

export const site = {
  nome: 'Cepromed',
  razaoSocial: 'Cepromed Laboratório',
  descricao:
    'Laboratório de ensaios e certificação de produtos médico-hospitalares, acreditado pelo INMETRO na ABNT NBR ISO/IEC 17025 e habilitado pela ANVISA.',
  url: 'https://cepromed.com.br',
  telefone: '(35) 3212-7245',
  telefoneLink: '+553532127245',
  // O site publica um único endereço de e-mail; não há caixa separada para
  // vagas ou ouvidoria, então diferenciamos pelo assunto da mensagem.
  email: 'contato@cepromed.com.br',
  endereco: {
    linha: 'Rod. Fernão Dias, BR-381, KM 759 — Distrito Industrial, Pista Sul',
    complemento: 'Caixa Postal 1044',
    cidade: 'Três Corações',
    uf: 'MG',
    cep: '37418-760',
    pais: 'BR',
  },
  // TODO(cliente): o horário não está publicado no site atual. Confirmar.
  horario: 'Segunda a sexta, 08h às 18h',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Cepromed+Laborat%C3%B3rio+Rodovia+Fern%C3%A3o+Dias+KM+759+Tr%C3%AAs+Cora%C3%A7%C3%B5es+MG',
} as const;

export const navegacao = [
  { label: 'Início', href: '#inicio' },
  { label: 'O Cepromed', href: '#o-cepromed' },
  { label: 'Escopos', href: '#escopos' },
  { label: 'Acreditações', href: '#acreditacoes' },
  { label: 'Trabalhe conosco', href: '#trabalhe-conosco' },
  { label: 'Contato', href: '#contato' },
] as const;

/** Números publicados pelo próprio Cepromed nas páginas institucionais. */
export const indicadores = [
  { valor: '2011', label: 'em atividade desde', detalhe: 'sede própria em Três Corações desde 2019' },
  { valor: '4.000 m²', label: 'de área total', detalhe: '950 m² de área construída' },
  { valor: '5', label: 'laboratórios', detalhe: 'físico, mecânico, químico, microbiológico e biocompatibilidade' },
  { valor: 'ISO/IEC 17025', label: 'acreditação INMETRO', detalhe: 'CRL 0701 · ANVISA ANELI 096' },
] as const;

/** Textos literais publicados em cepromed.com.br/2810. */
export const principios = [
  {
    titulo: 'Política',
    texto:
      'Prestar serviços de ensaios com excelência e qualidade comprometidas com a satisfação dos nossos clientes, garantindo resultados com credibilidade e confiabilidade.',
  },
  {
    titulo: 'Missão',
    texto:
      'Manter um corpo técnico e gerencial competente e focado com o Sistema de Gestão da Qualidade, em busca de inovação tecnológica e a melhoria contínua de nossos processos, em conformidade com a ABNT NBR ISO/IEC 17025 e preceitos legais.',
  },
  {
    titulo: 'Visão',
    texto:
      'Participação em programas de proficiência e interlaboratoriais, além do monitoramento de suas acreditações, habilitações e participações nos órgãos e instituições — REBLAS, ANVISA, RBLE, MTE, SIBRATEC, ABRAC e ABIMO.',
  },
] as const;

export type Servico = {
  slug: string;
  titulo: string;
  descricao: string;
  itens: readonly string[];
  imagem: string;
  icone: 'microscope' | 'file' | 'shield' | 'activity';
};

export const servicos: readonly Servico[] = [
  {
    slug: 'seringas-e-agulhas',
    titulo: 'Seringas e agulhas',
    descricao:
      'Ensaios dimensionais, mecânicos e de desempenho em agulhas hipodérmicas, gengivais, cânulas e seringas manuais, de bomba e de insulina.',
    itens: ['ISO 7864', 'ISO 7886-1 e 7886-2', 'ISO 8537', 'ISO 9626', 'ISO 594-1 e 594-2'],
    imagem: '/img/servicos/seringas',
    icone: 'activity',
  },
  {
    slug: 'equipos',
    titulo: 'Equipos de infusão e transfusão',
    descricao:
      'Verificação de vazão, estanqueidade e desempenho em equipos gravitacionais, para bomba de infusão, com bureta e de transfusão.',
    itens: ['ISO 8536-4', 'ISO 8536-5', 'ISO 8536-8', 'ISO 1135-4'],
    imagem: '/img/servicos/biocompatibilidade',
    icone: 'file',
  },
  {
    slug: 'luvas',
    titulo: 'Luvas cirúrgicas e de procedimento',
    descricao:
      'Ensaios mecânicos de resistência, tração e ausência de furos em luvas cirúrgicas, de procedimento e de proteção ocupacional.',
    itens: ['ISO 10282', 'ISO 11193-1 e 11193-2', 'ISO 13391', 'Portarias INMETRO 332/2012 e 194/2018'],
    imagem: '/img/servicos/preservativos',
    icone: 'shield',
  },
  {
    slug: 'preservativos',
    titulo: 'Preservativos',
    descricao:
      'Ensaios de volume e pressão de ruptura, ausência de furos e integridade estrutural conforme a norma e a resolução sanitária aplicáveis.',
    itens: ['ISO 4074', 'RDC ANVISA 62/2008', 'Portaria INMETRO 189/2006'],
    imagem: '/img/servicos/microbiologia',
    icone: 'microscope',
  },
] as const;

/**
 * Escopo acreditado por produto, como publicado em cepromed.com.br/2819.
 * É o que um cliente industrial procura primeiro: "vocês ensaiam o meu
 * produto, sob qual norma?".
 */
export const escopoAcreditado = [
  { produto: 'Agulha hipodérmica', normas: 'ABNT NBR ISO 7864 · ISO 594-1 · ISO 594-2' },
  { produto: 'Agulha gengival', normas: 'NBR ISO 7885 · ISO 594-1 · ISO 594-2' },
  { produto: 'Agulha cânula', normas: 'ABNT NBR ISO 9626' },
  { produto: 'Seringa hipodérmica manual', normas: 'ABNT NBR ISO 7886-1' },
  { produto: 'Seringa hipodérmica para bomba', normas: 'ABNT NBR ISO 7886-2' },
  { produto: 'Seringa hipodérmica de insulina', normas: 'ABNT NBR ISO 8537' },
  { produto: 'Equipo de transfusão', normas: 'ABNT NBR ISO 1135-4' },
  { produto: 'Equipo de infusão gravitacional', normas: 'ABNT NBR ISO 8536-4' },
  { produto: 'Equipo para bomba de infusão', normas: 'ABNT NBR ISO 8536-8' },
  { produto: 'Equipo com bureta', normas: 'ABNT NBR ISO 8536-5' },
  { produto: 'Luvas de procedimento', normas: 'ABNT NBR ISO 11193-1 e 11193-2 · Portarias INMETRO 332/2012 e 194/2018' },
  { produto: 'Luvas de proteção', normas: 'Portaria SIT/DSST/MTE 127/2009' },
  { produto: 'Luvas cirúrgicas', normas: 'ABNT NBR ISO 10282 · ISO 13391 · Portaria INMETRO 332/2012' },
  { produto: 'Preservativos', normas: 'ABNT NBR ISO 4074 · RDC ANVISA 62/2008 · Portaria INMETRO 189/2006' },
] as const;

export const acreditacoes = [
  { nome: 'ANVISA', logo: '/img/selos/anvisa.jpg' },
  { nome: 'REBLAS', logo: '/img/selos/reblas.jpg' },
  { nome: 'INMETRO', logo: '/img/selos/inmetroensaios.jpg' },
  { nome: 'ABNT', logo: '/img/selos/abnt.jpg' },
  { nome: 'ABRAC', logo: '/img/selos/abrac.jpg' },
  { nome: 'Sibratec', logo: '/img/selos/sibratec.jpg' },
  { nome: 'Ministério da Economia', logo: '/img/selos/ministerio-da-economia.jpg' },
] as const;

/** Registros oficiais, exibidos junto dos selos. */
export const registros = [
  { orgao: 'INMETRO', registro: 'CRL 0701', detalhe: 'Ensaios ABNT NBR ISO/IEC 17025' },
  { orgao: 'ANVISA', registro: 'ANELI 096', detalhe: 'Laboratório habilitado' },
] as const;
