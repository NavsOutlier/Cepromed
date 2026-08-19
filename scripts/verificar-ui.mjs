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

  await page.getByRole('link', { name: /Solicitar este ensaio.*Luvas e preservativos/i }).click();
  await page.waitForTimeout(900);
  const valor = await page.locator('#escopo').inputValue();
  ok(valor === 'Luvas e preservativos', `select pré-preenchido com o escopo do card (valor="${valor}")`);
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
  await page.close();
}

/* ---- 6. Capturas de referência em desktop e mobile ---- */
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
