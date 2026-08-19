/**
 * Conteúdo institucional em um só lugar: o que muda com frequência
 * (telefone, escopos, selos) fica aqui, não espalhado pelos componentes.
 */

export const site = {
  nome: 'Cepromed',
  razaoSocial: 'Laboratório Cepromed',
  descricao:
    'Laboratório de ensaios e certificação de produtos médico-hospitalares, acreditado pela ANVISA/REBLAS e INMETRO.',
  url: 'https://cepromed.com.br',
  telefone: '(35) 3212-7245',
  telefoneLink: '+553532127245',
  email: 'contato@cepromed.com.br',
  emailVagas: 'vagas@cepromed.com.br',
  endereco: {
    linha: 'Rodovia Fernão Dias, BR-381, KM 759 — Distrito Industrial',
    cidade: 'Três Corações',
    uf: 'MG',
    cep: '37410-000',
    pais: 'BR',
  },
  horario: 'Segunda a sexta, 08h às 18h',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rodovia+Fern%C3%A3o+Dias+BR381+KM+759+Distrito+Industrial+Tr%C3%AAs+Cora%C3%A7%C3%B5es+MG',
} as const;

export const navegacao = [
  { label: 'Início', href: '#inicio' },
  { label: 'O Cepromed', href: '#o-cepromed' },
  { label: 'Escopos', href: '#escopos' },
  { label: 'Acreditações', href: '#acreditacoes' },
  { label: 'Trabalhe conosco', href: '#trabalhe-conosco' },
  { label: 'Contato', href: '#contato' },
] as const;

// TODO(cliente): confirmar estes números com o Cepromed antes de publicar.
// Os valores abaixo são derivados do conteúdo do site atual, não de dados internos.
export const indicadores = [
  { valor: '7', label: 'acreditações e parcerias', detalhe: 'ANVISA, REBLAS, INMETRO, ABNT e outras' },
  { valor: '4', label: 'escopos de ensaio', detalhe: 'do biológico ao mecânico' },
  { valor: 'in vivo', label: 'e in vitro', detalhe: 'ensaios biológicos completos' },
  { valor: '100%', label: 'rastreabilidade', detalhe: 'da amostra ao laudo' },
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
    slug: 'ensaios',
    titulo: 'Ensaios in vitro e in vivo',
    descricao:
      'Testes biológicos e de biocompatibilidade que atestam a segurança de materiais em contato com o paciente.',
    itens: ['Citotoxicidade', 'Sensibilização', 'Irritação intracutânea'],
    imagem: '/img/servicos/biocompatibilidade',
    icone: 'microscope',
  },
  {
    slug: 'liberacao-parametrica',
    titulo: 'Liberação paramétrica',
    descricao:
      'Comprovação de esterilidade por parâmetros físico-químicos documentados, encurtando o ciclo de liberação de lote.',
    itens: ['Bioburden', 'Indicadores biológicos', 'Validação de processo'],
    imagem: '/img/servicos/microbiologia',
    icone: 'file',
  },
  {
    slug: 'luvas-e-preservativos',
    titulo: 'Luvas e preservativos',
    descricao:
      'Ensaios mecânicos de resistência, tração e integridade estrutural em látex, conforme normas ABNT NBR e ISO.',
    itens: ['Ausência de furos', 'Resistência à tração', 'Volume e pressão de ruptura'],
    imagem: '/img/servicos/preservativos',
    icone: 'shield',
  },
  {
    slug: 'seringas-agulhas-equipos',
    titulo: 'Seringas, agulhas e equipos',
    descricao:
      'Testes dimensionais, de vazão e de desempenho mecânico em materiais de infusão e perfurocortantes.',
    itens: ['Força de deslizamento', 'Vazão livre', 'Rigidez e penetração'],
    imagem: '/img/servicos/seringas',
    icone: 'activity',
  },
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
