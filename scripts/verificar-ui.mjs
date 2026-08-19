/**
 * Verificação de UI no navegador: interações, acessibilidade e capturas.
 *
 *   npm run build && npm run preview     # em um terminal
 *   npm run check:ui                     # em outro
 *
 * Sai com código 1 se alguma verificação falhar — serve em CI.
 * As capturas vão para .screenshots/ (fora do controle de versão).
 */
import { chromium } from 'playwright';
import sharp from 'sharp';

import { mkdirSync } from 'node:fs';

const OUT = process.argv[2] ?? '.screenshots';
const URL = process.env.CHECK_URL ?? 'http://localhost:4173/';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const falhas = [];
const ok = (cond, msg) => (cond ? console.log('  PASS ' + msg) : falhas.push(msg));

/* ---- 1. Menu mobile abre, navega e fecha ---- */
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(URL, { waitUntil: 'networkidle' });

  const botao = page.locator('button[aria-controls="menu-mobile"]');
  ok(await botao.isVisible(), 'botão do menu visível no mobile');
  await botao.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/i1-menu-aberto.png` });

  const linkEscopos = page.locator('#menu-mobile').getByRole('link', { name: 'Escopos', exact: true });
  ok(await linkEscopos.isVisible(), 'itens do menu aparecem');
  ok((await botao.getAttribute('aria-expanded')) === 'true', 'aria-expanded=true com o menu aberto');
  ok((await botao.getAttribute('aria-label')) === 'Fechar menu', 'aria-label vira "Fechar menu"');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  ok(!(await page.locator('#menu-mobile').count()), 'Esc fecha o menu');

  // Reabre e navega
  await botao.click();
  await page.waitForTimeout(300);
  await page.locator('#menu-mobile').getByRole('link', { name: 'Contato', exact: true }).click();
  await page.waitForTimeout(900);
  const y = await page.evaluate(() => window.scrollY);
  ok(y > 1000, `clicar no menu rola até a seção (scrollY=${Math.round(y)})`);
  ok(await page.evaluate(() => document.body.style.overflow !== 'hidden'), 'scroll do body liberado ao fechar');
  await page.close();
}

/* ---- 2. "Solicitar este ensaio" pré-seleciona o escopo ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });

  // Sem nome fixo: pegamos o terceiro card e conferimos que o select recebe o
  // título dele, seja qual for o escopo cadastrado em src/lib/site.ts.
  const card = page.locator('#escopos article').nth(2);
  const titulo = (await card.locator('h3').textContent())?.trim();
  await card.getByRole('link', { name: /Solicitar este ensaio/i }).click();
  await page.waitForTimeout(900);
  const valor = await page.locator('#escopo').inputValue();
  ok(valor === titulo, `select pré-preenchido com o escopo do card (esperado "${titulo}", veio "${valor}")`);
  await page.screenshot({ path: `${OUT}/i2-escopo-preenchido.png` });
  await page.close();
}

/* ---- 3. Formulário exige os campos obrigatórios ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.locator('#contato').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: /Enviar solicitação/i }).click();
  await page.waitForTimeout(300);
  const invalido = await page.locator('#nome:invalid').count();
  ok(invalido === 1, 'campo obrigatório bloqueia o envio');
  await page.close();
}

/* ---- 4. Acessibilidade básica: landmarks, h1 único, alts, skip link ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  const a = await page.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    semAlt: [...document.querySelectorAll('img')].filter((i) => i.alt === null || i.alt === undefined).length,
    semLazy: [...document.querySelectorAll('img')].filter((i) => !i.loading).length,
    main: document.querySelectorAll('main').length,
    nav: document.querySelectorAll('nav[aria-label]').length,
    botoesSemNome: [...document.querySelectorAll('button')].filter(
      (b) => !b.textContent.trim() && !b.getAttribute('aria-label'),
    ).length,
    labelsSoltas: [...document.querySelectorAll('input, select, textarea')].filter(
      (c) => !c.id || !document.querySelector(`label[for="${c.id}"]`),
    ).length,
    lang: document.documentElement.lang,
  }));
  ok(a.h1 === 1, `exatamente um <h1> (${a.h1})`);
  ok(a.main === 1, 'landmark <main> presente');
  ok(a.nav >= 2, `navs rotuladas (${a.nav})`);
  ok(a.botoesSemNome === 0, `todos os botões têm nome acessível (${a.botoesSemNome} sem)`);
  ok(a.labelsSoltas === 0, `todos os campos têm <label> (${a.labelsSoltas} sem)`);
  ok(a.lang === 'pt-BR', `lang=${a.lang}`);

  // Skip link recebe foco no primeiro Tab
  await page.keyboard.press('Tab');
  const foco = await page.evaluate(() => document.activeElement?.textContent?.trim());
  ok(/Pular para o conteúdo/.test(foco || ''), `primeiro Tab vai para o skip link ("${foco}")`);
  await page.close();
}

/* ---- 5. prefers-reduced-motion: marquee vira grade estática ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.locator('#acreditacoes').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const temMarquee = await page.locator('.animate-marquee').count();
  ok(temMarquee === 0, 'com reduced-motion o marquee é substituído por lista estática');
  await page.screenshot({ path: `${OUT}/i3-reduced-motion.png` });

  // A sequência do hero responde ao scroll: ela não anima sozinha, e travá-la
  // deixava a página parada no primeiro frame para quem desliga animações no
  // sistema — que foi o sintoma relatado.
  const util = await page.evaluate(() => {
    const h = document.querySelector('#inicio');
    // Só a fase de animação: depois da fronteira o canvas congela de propósito.
    return (h.offsetHeight - innerHeight) * Number(h.dataset.fimAnimacao);
  });
  const assina = () => page.evaluate(() => {
    const c = document.querySelector('#inicio canvas');
    if (!c) return -1;
    const t = document.createElement('canvas'); t.width = 16; t.height = 9;
    t.getContext('2d').drawImage(c, 0, 0, 16, 9);
    const d = t.getContext('2d').getImageData(0, 0, 16, 9).data;
    let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2];
    return s;
  });
  const quadros = [];
  for (let i = 0; i <= 8; i++) {
    await page.evaluate((y) => scrollTo(0, y), Math.round((util * i) / 8));
    await page.waitForTimeout(180);
    quadros.push(await assina());
  }
  const distintos = new Set(quadros).size;
  ok(distintos >= 5, `com reduced-motion a sequência do hero ainda acompanha o scroll (${distintos}/9)`);
  await page.close();
}


/* ---- 6. Sequência do hero: trilhas completas e emenda com a seção 2 ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const baixados = new Set();
  page.on('request', (r) => {
    const u = r.url();
    if (u.includes('/img/sequencias/')) baixados.add(u.split('/img/sequencias/')[1]);
  });
  await page.goto(URL, { waitUntil: 'networkidle' });

  const g = await page.evaluate(() => {
    const hero = document.querySelector('#inicio');
    return {
      util: hero.offsetHeight - innerHeight,
      fim: Number(hero.dataset.fimAnimacao),
    };
  });

  for (let i = 0; i <= 100; i++) {
    await page.evaluate((y) => scrollTo(0, y), Math.round((g.util * i) / 100));
    await page.waitForTimeout(45);
  }
  await page.waitForTimeout(2000);

  const cientista = [...baixados].filter((u) => u.startsWith('cientista/')).length;
  const molecula = [...baixados].filter((u) => u.startsWith('molecula/')).length;
  // Sem número fixo: conferimos que as duas trilhas vieram inteiras e iguais.
  ok(
    cientista >= 70 && molecula >= 70 && cientista === molecula,
    `as duas sequências carregam inteiras (cientista ${cientista}, molecula ${molecula})`,
  );

  // No fim da rolagem o texto tem de estar fora, não reaparecendo.
  await page.evaluate((y) => scrollTo(0, y), g.util);
  await page.waitForTimeout(700);
  const op = await page.evaluate(() =>
    Number(getComputedStyle(document.querySelector('#inicio .container-page')).opacity));
  ok(op === 0, `a chamada do hero continua oculta no fim da sequência (opacidade ${op})`);

  // Durante a jornada o canvas fica congelado no último frame: duas posições
  // distintas da segunda fase têm de mostrar exatamente a mesma imagem.
  const fotografa = () => page.evaluate(() => {
    const c = document.querySelector('#inicio canvas');
    const t = document.createElement('canvas'); t.width = 32; t.height = 18;
    t.getContext('2d').drawImage(c, 0, 0, 32, 18);
    return [...t.getContext('2d').getImageData(0, 0, 32, 18).data].join(',');
  });
  await page.evaluate((y) => scrollTo(0, y), Math.round(g.util * (g.fim + 0.1)));
  await page.waitForTimeout(900);
  const fotoA = await fotografa();
  await page.evaluate((y) => scrollTo(0, y), Math.round(g.util * (g.fim + 0.35)));
  await page.waitForTimeout(900);
  const fotoB = await fotografa();
  ok(fotoA === fotoB, 'na fase da jornada o canvas fica congelado no último frame');
  await page.close();
}


/* ---- 7. A sequência anima mesmo com a rede lenta e cache frio ---- */
{
  // Regressão: o download em ordem 1,2,3… deixava o hero preso no primeiro
  // frame em 4G, porque o frame alvo do scroll ainda não tinha chegado.
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false, downloadThroughput: 4e6 / 8, uploadThroughput: 4e6 / 8, latency: 60,
  });

  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  const util = await page.evaluate(() => {
    const h = document.querySelector('#inicio');
    return (h.offsetHeight - innerHeight) * Number(h.dataset.fimAnimacao);
  });

  const assinatura = () => page.evaluate(() => {
    const c = document.querySelector('#inicio canvas');
    if (!c) return -1;
    const t = document.createElement('canvas'); t.width = 16; t.height = 9;
    t.getContext('2d').drawImage(c, 0, 0, 16, 9);
    const d = t.getContext('2d').getImageData(0, 0, 16, 9).data;
    let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2];
    return s;
  });

  const vistos = [];
  for (let i = 1; i <= 8; i++) {
    await page.evaluate((y) => scrollTo(0, y), Math.round((util * i) / 8));
    await page.waitForTimeout(140);
    vistos.push(await assinatura());
  }
  const distintas = new Set(vistos).size;
  ok(distintas >= 6, `em 4G com cache frio a sequência responde ao scroll (${distintas}/8 imagens distintas)`);
  await ctx.close();
}


/* ---- 8. A barra do topo acompanha o fundo da seção ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const secoes = await page.evaluate(() =>
    [...document.querySelectorAll('[data-tema]')].map((s) => ({
      id: s.id || '(sem id)', tema: s.dataset.tema, topo: Math.round(s.offsetTop),
    })));
  ok(secoes.length === 6, `todas as seções declaram data-tema (${secoes.length})`);

  const erradas = [];
  for (const s of secoes) {
    await page.evaluate((y) => scrollTo(0, y + 120), s.topo);
    await page.waitForTimeout(700); // > que os 300ms de transition-colors
    const solida = await page.evaluate(() => {
      // "rgba(0, 0, 0, 0)" quando transparente, "rgba(255, 255, 255, 0.9)" quando branca.
      const bg = getComputedStyle(document.querySelector('header')).backgroundColor;
      const canais = bg.slice(bg.indexOf('(') + 1, bg.lastIndexOf(')')).split(',').map(Number);
      const alfa = canais.length === 4 ? canais[3] : 1;
      return alfa > 0.1;
    });
    // Fundo claro pede barra branca; fundo escuro pede barra transparente.
    if (solida !== (s.tema === 'claro')) erradas.push(`${s.id}:${s.tema}`);
  }
  ok(erradas.length === 0, `a barra combina com o fundo em todas as seções${erradas.length ? ' — falhou em ' + erradas.join(', ') : ''}`);
  await page.close();
}


/* ---- 9. Jornada da amostra: etapas trocam e a linha se preenche ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const g = await page.evaluate(() => {
    const h = document.querySelector('#inicio');
    return { util: h.offsetHeight - innerHeight, fim: Number(h.dataset.fimAnimacao) };
  });

  const titulos = [];
  let preenchimentoFinal = 0;

  for (let i = 0; i < 6; i++) {
    // Posição dentro da segunda fase do trilho do hero.
    const frac = g.fim + (1 - g.fim) * ((i + 0.5) / 6);
    await page.evaluate((y) => scrollTo(0, y), Math.round(g.util * frac));
    await page.waitForTimeout(500);
    const info = await page.evaluate(() => {
      const h3 = document.querySelector('#titulo-processo')?.parentElement?.querySelector('h3');
      const barra = document.querySelector('#titulo-processo')?.parentElement?.querySelector('ol .origin-left');
      const t = barra ? new DOMMatrixReadOnly(getComputedStyle(barra).transform).a : 0;
      const acesos = [...document.querySelectorAll('#titulo-processo ~ ol li span:first-child')]
        .filter((n) => n.className.includes('bg-brand-500')).length;
      return { titulo: h3?.textContent?.trim(), preenchimento: t, acesos };
    });
    titulos.push(info.titulo);
    preenchimentoFinal = info.preenchimento;
    // O número de nós acesos tem de acompanhar a etapa atual.
    if (info.acesos !== i + 1) titulos.push(`!acesos=${info.acesos} na etapa ${i + 1}`);
  }

  const unicos = new Set(titulos.filter(Boolean)).size;
  ok(unicos === 6, `as 6 etapas da jornada aparecem em ordem (${unicos} distintas: ${titulos.join(' > ')})`);
  ok(preenchimentoFinal > 0.9, `a linha se preenche até o fim (${preenchimentoFinal.toFixed(2)})`);
  await page.close();
}


/* ---- 10. Rede sobre as esferas: nós ancorados e longe do texto ---- */
{
  for (const [w, h] of [[1280, 800], [1440, 900], [1920, 1000]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1400);

    const g = await page.evaluate(() => {
      const h = document.querySelector('#inicio');
      return { util: h.offsetHeight - innerHeight, fim: Number(h.dataset.fimAnimacao) };
    });
    await page.evaluate((y) => scrollTo(0, y), Math.round(g.util * (g.fim + (1 - g.fim) * 0.45)));
    await page.waitForTimeout(600);

    const r = await page.evaluate(() => {
      const secao = document.querySelector('#inicio');
      // Os ícones também são <svg>; a rede é o que carrega os nós numerados.
      const svg = [...secao.querySelectorAll('svg')].find(
        (el) => el.querySelectorAll('circle[r]').length >= 6,
      );
      if (!svg) return { nos: 0, colisoes: 0, fora: 0 };

      // Caixas de texto de verdade: o título e o bloco da etapa em foco.
      const caixas = [
        secao.querySelector('#titulo-processo'),
        secao.querySelector('#titulo-processo ~ div .max-w-2xl'),
      ]
        .filter(Boolean)
        .map((el) => el.getBoundingClientRect())
        .filter((b) => b.width > 0);

      const nos = [...svg.querySelectorAll('circle')]
        .filter((c) => Number(c.getAttribute('r')) <= 14)
        .map((c) => ({ x: Number(c.getAttribute('cx')), y: Number(c.getAttribute('cy')) }));

      const colisoes = nos.filter((n) =>
        caixas.some((b) => n.x > b.left - 16 && n.x < b.right + 16 && n.y > b.top - 16 && n.y < b.bottom + 16),
      ).length;
      const fora = nos.filter((n) => n.x < 8 || n.x > innerWidth - 8 || n.y < 8 || n.y > innerHeight - 8).length;
      return { nos: nos.length, colisoes, fora };
    });

    ok(r.nos === 6, `${w}px: os 6 nós da jornada são desenhados (${r.nos})`);
    ok(r.colisoes === 0, `${w}px: nenhum nó cai sobre o texto (${r.colisoes})`);
    ok(r.fora === 0, `${w}px: nenhum nó sai da tela (${r.fora})`);
    await page.close();
  }
}


/* ---- 11. A virada animação -> jornada não tem corte ---- */
{
  // A jornada é uma máscara sobre o mesmo canvas, não outra seção; atravessar
  // a fronteira em passos pequenos precisa ser visualmente contínuo.
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });

  const g = await page.evaluate(() => {
    const h = document.querySelector('#inicio');
    return { util: h.offsetHeight - innerHeight, fim: Number(h.dataset.fimAnimacao) };
  });

  for (let i = 0; i <= 50; i++) {
    await page.evaluate((y) => scrollTo(0, y), Math.round((g.util * g.fim * i) / 50));
    await page.waitForTimeout(45);
  }
  await page.waitForTimeout(3000);

  const quadros = [];
  const de = Math.round(g.util * (g.fim - 0.04));
  const ate = Math.round(g.util * (g.fim + 0.06));
  for (let y = de; y <= ate; y += 55) {
    await page.evaluate((v) => scrollTo(0, v), y);
    await page.waitForTimeout(280);
    quadros.push(await page.screenshot({ clip: { x: 0, y: 100, width: 1440, height: 700 } }));
  }
  const reduz = (buf) => sharp(buf).greyscale().resize(120, 60, { fit: 'fill' }).raw().toBuffer();
  let maior = 0;
  for (let i = 1; i < quadros.length; i++) {
    const [a, c] = await Promise.all([reduz(quadros[i - 1]), reduz(quadros[i])]);
    let soma = 0;
    for (let k = 0; k < a.length; k++) soma += Math.abs(a[k] - c[k]);
    maior = Math.max(maior, soma / a.length);
  }
  ok(maior < 20, `a virada da animação para a jornada não tem corte (maior salto ${maior.toFixed(1)}/255)`);
  await page.close();
}

/* ---- 12. Capturas de referência em desktop e mobile ---- */
{
  const alvos = [
    ['desktop-hero', 1440, 900, 0],
    ['desktop-jornada', 1440, 900, 6200],
    ['desktop-sobre', 1440, 900, 8900],
    ['desktop-escopos', 1440, 900, 10600],
    ['desktop-contato', 1440, 900, 13200],
    ['desktop-rodape', 1440, 900, 15500],
    ['mobile-hero', 390, 844, 0],
    ['mobile-jornada', 390, 844, 5200],
    ['mobile-contato', 390, 844, 15500],
  ];
  for (const [nome, width, height, y] of alvos) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(URL, { waitUntil: 'networkidle' });
    if (y) await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}/${nome}.png` });
    await page.close();
  }
  console.log(`  PASS ${alvos.length} capturas salvas em ${OUT}/`);
}

await browser.close();
console.log(falhas.length ? '\nFALHAS:\n- ' + falhas.join('\n- ') : '\nTodas as verificações passaram.');
process.exit(falhas.length ? 1 : 0);
