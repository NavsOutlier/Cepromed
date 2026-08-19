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
    ScrollSequence     sequência de frames em <canvas> dirigida pelo scroll
    Header             menu fixo, versão mobile e destaque da seção ativa
    Hero               sequência "cientista" + chamada principal
    About              indicadores, texto institucional e objetivos da qualidade
    Immersion          faixa com a sequência "molecula" e as 3 etapas do ensaio
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

O `ScrollSequence` escolhe `sm` em telas ≤ 900px ou quando o visitante está com
economia de dados. Para trocar uma sequência, substitua os frames em
`raw-assets/sequencias/` e rode o script — os nomes de arquivo originais não
importam, a ordem alfabética define a ordem dos frames.

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

## Antes de publicar

- [ ] Confirmar com o cliente os números em `indicadores` ([`src/lib/site.ts`](src/lib/site.ts)) — hoje são derivados do conteúdo do site atual, não de dados internos.
- [ ] Confirmar CEP, horário de atendimento e o canal oficial da ouvidoria.
- [ ] Definir `VITE_FORM_ENDPOINT` para não depender do `mailto:`.
- [ ] Conferir se o domínio final bate com as URLs absolutas em `index.html` (canonical, Open Graph e JSON-LD).
- [ ] Verificar os direitos de uso das duas sequências de vídeo e da arte institucional.
