# Site institucional — Laboratório Cepromed

Landing page do Cepromed, laboratório de ensaios e certificação de produtos
médico-hospitalares. React 19 + Vite 6 + TypeScript + Tailwind 4, com animações
em Motion.

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script               | O que faz                                                     |
| -------------------- | ------------------------------------------------------------- |
| `npm run dev`        | servidor de desenvolvimento                                   |
| `npm run build`      | typecheck + build de produção em `dist/`                       |
| `npm run preview`    | serve o `dist/` em http://localhost:4173                       |
| `npm run lint`       | só o typecheck (`tsc --noEmit`, modo estrito)                  |
| `npm run check:ui`   | verificações de interação e acessibilidade no navegador        |
| `npm run gen:images` | reprocessa `raw-assets/` → `public/img/`                       |
| `npm run gen:frames`  | extrai os frames das sequências a partir dos vídeos originais   |
| `npm run gen:icons`  | regenera favicon, apple-touch-icon e a imagem de compartilhamento |

`check:ui` precisa do preview no ar:

```bash
npm run build && npm run preview   # terminal 1
npm run check:ui                   # terminal 2 — capturas vão para .screenshots/
```

## Estrutura

```
src/
  lib/site.ts          conteúdo institucional (contato, escopos, selos, menu)
  lib/orcamento.ts     evento que liga os cards de escopo ao formulário
  lib/ancoras.ts       posição das esferas da molécula e projeção do object-cover
  components/
    ScrollSequence     uma ou mais sequências de frames em <canvas>, dirigidas pelo scroll
    Header             menu fixo, versão mobile e destaque da seção ativa
    Hero               as duas sequências emendadas (80 frames) + chamada principal
    About              indicadores, texto institucional e política/missão/visão
    Immersion          jornada da amostra em 6 etapas, sobre o último frame do hero
    Services           os quatro escopos de ensaio
    Accreditations     faixa de selos (marquee pausável)
    Careers            trabalhe conosco
    Contact            formulário de orçamento
    Footer             contato, navegação e ouvidoria
raw-assets/            originais em alta; NÃO vão para o build
public/img/            derivados otimizados que o site consome
scripts/               otimização de imagens, ícones e verificação de UI
```

Para mudar telefone, endereço, escopos ou selos, edite apenas
[`src/lib/site.ts`](src/lib/site.ts).

## Imagens

Os originais ficam em `raw-assets/` e nunca são servidos. `npm run gen:images`
gera de `raw-assets/`:

- **fotos** → WebP 1600px + fallback JPEG em `public/img/`;
- **sequências** → WebP numerado em duas larguras,
  `public/img/sequencias/<nome>/lg` (1400px) e `/sm` (800px).

### De onde vêm os frames

Os vídeos originais ficam em `raw-assets/videos/` (`v<nome>.mp4`) e nunca são
servidos. `npm run gen:frames` amostra cada um com ffmpeg e grava em
`raw-assets/sequencias-densas/<Nome>/`; o `gen:images` prefere essa pasta.

Os clipes têm **8 s a 24 fps**, então `gen:frames 24` extrai os 192 quadros de
cada um — 384 no hero, tudo que o material tem. Pedir mais que 24 não adianta:
a 30 fps o ffmpeg repete quadros (medido: 56 duplicatas em 239, 23% de peso
sem nenhuma suavidade). Para ir além, só refilmando em taxa maior.

> Os vídeos estavam em `public/`, o que os colocava no build sem serem usados —
> 14,7 MB servidos à toa. Mantenha-os em `raw-assets/`.

### O custo da suavidade

Com 384 frames o hero pesa **9,8 MB no desktop** e 5,4 MB no celular. É muito
para uma landing page, e é uma escolha consciente: o carregamento é progressivo
(a página fica utilizável com ~12 arquivos) mas o tráfego total é esse.

Para aliviar, `npm run gen:frames 12` volta a 192 frames e ~6 MB — a diferença
é perceptível lado a lado, quase não isolada. As variantes são geradas a
1000 px (desktop) e 600 px (celular); medindo a perda contra o original em tela
de 1440 px, ir de 1100 px para 1000 px custou 0,07/255 de nitidez e economizou
1 MB.

Para trocar uma sequência, substitua o vídeo em `raw-assets/videos/` e rode
`npm run gen:frames 24 && npm run gen:images`. O nome do arquivo define o nome da
trilha (`vcientista.mp4` → `cientista`); ajuste `TRILHAS_HERO` em
[`src/lib/sequencias.ts`](src/lib/sequencias.ts) com a nova contagem.

## A jornada da amostra (seção 2)

As seis etapas ficam em `etapasProcesso` ([`src/lib/site.ts`](src/lib/site.ts)).
A partir de 1280px, cada uma é ancorada **numa esfera da própria molécula do
fundo**: as posições em [`src/lib/ancoras.ts`](src/lib/ancoras.ts) foram medidas
na imagem (detecção de máximos de brilho e azul no último frame), não estimadas.

Como o fundo usa `object-cover`, a esfera muda de lugar na tela conforme a
proporção da janela — por isso as coordenadas são projetadas em runtime,
reproduzindo o mesmo cálculo do cover. Fixar as posições em CSS descolaria os
marcadores das esferas em qualquer janela fora do tamanho testado.

Abaixo de 1280px o texto avança sobre essa área, então lá entra uma linha do
tempo horizontal simples. `npm run check:ui` verifica, em 1280/1440/1920, que
os seis nós são desenhados, que nenhum cai sobre o texto e que nenhum sai da
tela.

**Se você trocar o frame final, remeça as âncoras** — elas valem só para aquela
imagem.

## Formulário de orçamento

Sem configuração, o formulário abre o cliente de e-mail do visitante com a
mensagem já montada. Para receber os envios em um servidor, defina o endpoint em
`.env`:

```
VITE_FORM_ENDPOINT="https://seu-endpoint/aceita-post-json"
```

Ele recebe `POST` com JSON (`nome`, `empresa`, `email`, `telefone`, `escopo`,
`mensagem`, `consentimento`). Serve Formspree, um webhook do n8n ou uma API
própria.

## De onde vem o conteúdo

Todo o texto institucional foi extraído de cepromed.com.br em agosto de 2026 e
transcrito em [`src/lib/site.ts`](src/lib/site.ts):

| Dado                                            | Página de origem                       |
| ----------------------------------------------- | -------------------------------------- |
| Fundação em 2011, sede própria em 2019, 4.000 m² / 950 m², cinco laboratórios | `/2809/quem-somos`   |
| Política, missão e visão (texto literal)        | `/2810/politica-visao-e-missao-cepromed` |
| Escopo acreditado: 14 produtos e suas normas    | `/2819/escopos`                        |
| Endereço, CEP 37418-760, telefone, e-mail       | rodapé de todas as páginas             |
| INMETRO CRL 0701 · ANVISA ANELI 096             | home                                   |

O site publica **um único e-mail** (`contato@cepromed.com.br`); não há caixa
separada para vagas ou ouvidoria, então esses fluxos usam o mesmo endereço com
assunto diferente.

## Antes de publicar

- [ ] **PRAZOS DA JORNADA — bloqueante.** Os prazos em `etapasProcesso` ([`src/lib/site.ts`](src/lib/site.ts)) são **inventados**, só para ver o layout de pé. Prazo anunciado em site vira expectativa contratual: troque pelos números reais antes de qualquer publicação. Cada um está marcado com `// PROVISÓRIO`; um prazo vazio simplesmente não aparece na tela.

- [ ] **Horário de atendimento** — não está publicado no site atual. O valor em `site.horario` veio do protótipo e está marcado com `TODO`; confirmar.
- [ ] **Objetivos da qualidade** — o site lista apenas dois ("aumentar a satisfação do cliente externo/interno"). São muito internos para a home, então a seção usa política, missão e visão. Confirmar se o cliente quer os objetivos publicados também.
- [ ] Definir `VITE_FORM_ENDPOINT` para não depender do `mailto:`.
- [ ] Conferir se o domínio final bate com as URLs absolutas em `index.html` (canonical, Open Graph e JSON-LD).
- [ ] Verificar os direitos de uso das duas sequências de vídeo e da arte institucional — e a inconsistência entre o logo vinho do cabeçalho e o logo verde/azul que aparece dentro dessa arte.
