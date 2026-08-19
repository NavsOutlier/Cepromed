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
  const util = await page.evaluate(() => document.querySelector('#inicio').offsetHeight - innerHeight);
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
    const imersao = document.querySelectorAll('main > section')[2];
    return {
      util: hero.offsetHeight - innerHeight,
      imersao: Math.round(imersao.getBoundingClientRect().top + scrollY),
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

  // O último frame do hero e o fundo da seção 2 têm de ser a mesma imagem.
  const igual = await page.evaluate(() => {
    const canvas = document.querySelector('#inicio canvas');
    const img = document.querySelectorAll('main > section')[2].querySelector('img');
    const reduz = (fonte) => {
      const full = document.createElement('canvas');
      full.width = canvas.width; full.height = canvas.height;
      const fc = full.getContext('2d');
      if (fonte === canvas) fc.drawImage(canvas, 0, 0);
      else {
        const e = Math.max(full.width / img.naturalWidth, full.height / img.naturalHeight);
        const dw = img.naturalWidth * e, dh = img.naturalHeight * e;
        // Recorte ancorado no topo, igual ao hero (ancoraY="top" / object-top).
        fc.drawImage(img, (full.width - dw) / 2, 0, dw, dh);
      }
      const t = document.createElement('canvas'); t.width = 32; t.height = 18;
      t.getContext('2d').drawImage(full, 0, 0, 32, 18);
      return t.getContext('2d').getImageData(0, 0, 32, 18).data;
    };
    const a = reduz(canvas), b = reduz(img);
    let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
    return s / a.length;
  });
  ok(igual < 1, `seção 2 congela no último frame do hero (diferença ${igual.toFixed(2)}/255)`);
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
  const util = await page.evaluate(() => document.querySelector('#inicio').offsetHeight - innerHeight);

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
  ok(secoes.length >= 7, `todas as seções declaram data-tema (${secoes.length})`);

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

/* ---- 9. Capturas de referência em desktop e mobile ---- */
{
  const alvos = [
    ['desktop-hero', 1440, 900, 0],
    ['desktop-sobre', 1440, 900, 2050],
    ['desktop-imersao', 1440, 900, 4200],
    ['desktop-escopos', 1440, 900, 6600],
    ['desktop-contato', 1440, 900, 8450],
    ['desktop-rodape', 1440, 900, 9832],
    ['mobile-hero', 390, 844, 0],
    ['mobile-escopos', 390, 844, 8200],
    ['mobile-contato', 390, 844, 12600],
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
