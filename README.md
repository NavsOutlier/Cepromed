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
  components/
    ScrollSequence     uma ou mais sequências de frames em <canvas>, dirigidas pelo scroll
    Header             menu fixo, versão mobile e destaque da seção ativa
    Hero               as duas sequências emendadas (80 frames) + chamada principal
    About              indicadores, texto institucional e política/missão/visão
    Immersion          congela no último frame do hero; as 3 etapas do ensaio por cima
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
- **sequências** (`raw-assets/sequencias/<Nome>/`) → WebP numerado em duas
  larguras, `public/img/sequencias/<nome>/lg` (1600px) e `/sm` (900px).

O `ScrollSequence` escolhe `sm` em telas ≤ 900px, em conexões 2G/3G ou quando o
visitante está com economia de dados. Nessas condições ele também baixa só uma
fatia dos frames (de 2 em 2, ou de 4 em 4) e desenha o vizinho mais próximo no
lugar dos que faltam — o movimento fica mais seco, nunca parado.

### Movimento reduzido

Quem desliga animações no sistema (`prefers-reduced-motion`) **continua vendo a
sequência**: ela não se move sozinha, avança na medida do scroll. O que essa
preferência desliga é a fluidez (menos frames) e, via `<MotionConfig
reducedMotion="user">` em [`src/App.tsx`](src/App.tsx), tudo que anima por conta
própria — marquee dos selos, laço da seta, animações de entrada.

Congelar a sequência inteira nesse caso deixava o hero parado no primeiro frame
para esses visitantes; no Windows basta ter "Efeitos de animação" desligado em
Acessibilidade › Efeitos visuais para cair nisso.

O hero toca as duas trilhas como uma linha do tempo só — `cientista` (40) e
depois `molecula` (40), definidas em [`src/lib/sequencias.ts`](src/lib/sequencias.ts).
A seção seguinte usa `FRAME_FINAL`, o último frame dessa linha, como fundo
parado: quem rola do hero para ela vê a mesma imagem, sem corte. Os dois trechos
também compartilham o mesmo gradiente de base, para o tom não saltar na emenda.
Se você trocar a ordem ou a quantidade de trilhas, `FRAME_FINAL` acompanha
sozinho — e `npm run check:ui` verifica que a emenda continua exata.

Para trocar uma sequência, substitua os frames em `raw-assets/sequencias/` e
rode `npm run gen:images` — os nomes de arquivo originais não importam, a ordem
alfabética define a ordem dos frames.

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

- [ ] **Horário de atendimento** — não está publicado no site atual. O valor em `site.horario` veio do protótipo e está marcado com `TODO`; confirmar.
- [ ] **Objetivos da qualidade** — o site lista apenas dois ("aumentar a satisfação do cliente externo/interno"). São muito internos para a home, então a seção usa política, missão e visão. Confirmar se o cliente quer os objetivos publicados também.
- [ ] **CNPJ e razão social completa** — não publicados; se forem entrar no rodapé, pedir ao cliente.
- [ ] Definir `VITE_FORM_ENDPOINT` para não depender do `mailto:`.
- [ ] Conferir se o domínio final bate com as URLs absolutas em `index.html` (canonical, Open Graph e JSON-LD).
- [ ] Verificar os direitos de uso das duas sequências de vídeo e da arte institucional — e a inconsistência entre o logo vinho do cabeçalho e o logo verde/azul que aparece dentro dessa arte.
