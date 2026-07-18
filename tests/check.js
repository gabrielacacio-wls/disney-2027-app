/* Testes de ponta a ponta do Planejador Disney 2027.
   Requer o app servido em http://127.0.0.1:8123 (ex.: python3 -m http.server 8123).
   Localmente, aponte CHROMIUM_PATH para um binário do Chromium se não quiser
   que o Playwright baixe o dele. */
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--no-sandbox']
  });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:8123' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });

  const results = [];
  const check = (name, ok, extra) => { results.push((ok ? 'PASS' : 'FAIL') + ' ' + name + (extra ? ' — ' + extra : '')); };

  await page.goto('http://127.0.0.1:8123/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  // 1. boilerplate / viewport
  const lang = await page.evaluate(() => document.documentElement.lang);
  const viewport = await page.evaluate(() => (document.querySelector('meta[name=viewport]') || {}).content || '');
  check('lang pt-BR + viewport meta', lang === 'pt-BR' && viewport.includes('width=device-width'));

  // 2. countdown renderiza
  const cd = await page.textContent('#cdDias');
  check('countdown mostra dias', /\d/.test(cd), cd.trim());

  // 3. todas as abas alternam
  let tabsOk = true;
  for (const t of ['custos', 'cal', 'shop', 'guia', 'check', 'dash']) {
    await page.click(`#tabbtn-${t}`);
    const on = await page.evaluate(sel => document.querySelector(sel).classList.contains('on'), `#tab-${t}`);
    const aria = await page.getAttribute(`#tabbtn-${t}`, 'aria-selected');
    if (!on || aria !== 'true') tabsOk = false;
  }
  check('6 abas alternam com aria-selected', tabsOk);

  // 4. aba persiste após reload
  await page.click('#tabbtn-custos');
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(800);
  const persisted = await page.evaluate(() => document.querySelector('#tab-custos').classList.contains('on'));
  check('aba ativa persiste após reload', persisted);

  // 5. navegação por setas nas abas
  await page.focus('#tabbtn-custos');
  await page.keyboard.press('ArrowRight');
  const afterArrow = await page.evaluate(() => document.querySelector('nav.tabs button.on').dataset.tab);
  check('setas do teclado navegam abas', afterArrow === 'cal', afterArrow);

  // 6. custos: gasto real conta como pago
  await page.click('#tabbtn-custos');
  const row1real = page.locator('#custoRows tr').first().locator('td:nth-child(3) input');
  await row1real.fill('5000');
  await page.locator('#custoRows tr').first().locator('input[type=checkbox]').check();
  await page.waitForTimeout(400);
  const pago = await page.textContent('#pagoUSD');
  check('pago usa gasto real (5000)', pago.includes('5.000'), pago);

  // 7. excluir + desfazer (compras)
  await page.click('#tabbtn-shop');
  const before = await page.locator('.shop-row').count();
  await page.locator('.shop-row .del').first().click();
  const toastVisible = await page.locator('.toast').isVisible();
  await page.locator('.toast button').click();
  const after = await page.locator('.shop-row').count();
  check('excluir mostra toast e desfazer restaura', toastVisible && after === before, `${before}→${after}`);

  // 8. botão de tema
  await page.click('#btnTheme'); // auto -> light
  const th1 = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await page.click('#btnTheme'); // light -> dark
  const th2 = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  check('botão de tema alterna light/dark', th1 === 'light' && th2 === 'dark', th1 + '/' + th2);
  await page.click('#btnTheme'); // volta para auto

  // 9. download do .ics
  await page.click('#tabbtn-dash');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#btnIcs')]);
  const icsPath = await dl.path();
  const ics = require('fs').readFileSync(icsPath, 'utf8');
  check('.ics baixa com VEVENTs', ics.includes('BEGIN:VCALENDAR') && (ics.match(/BEGIN:VEVENT/g) || []).length === 11);

  // 10. link de compartilhamento (ida e volta)
  await page.click('#tabbtn-check');
  await page.click('#btnShare');
  await page.waitForTimeout(800);
  const url = await page.evaluate(() => navigator.clipboard.readText());
  check('link de compartilhamento gerado', /#dados=(gz|js)\./.test(url), url.slice(0, 60) + '…  len=' + url.length);
  if (/#dados=/.test(url)) {
    const page2 = await ctx.newPage();
    page2.on('dialog', d => d.accept());
    await page2.goto(url, { waitUntil: 'load' });
    await page2.waitForTimeout(1500);
    const imported = await page2.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('disney2027-planner-v1'));
      return s && s.custos && s.custos[0] && s.custos[0].r === 5000;
    });
    check('abrir o link importa o plano (real=5000 veio junto)', imported);
    await page2.close();
  }

  // 11. service worker registrado
  const swReg = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return !!reg;
  });
  check('service worker registrado', swReg);

  // 12. hover no donut destaca fatia
  await page.click('#tabbtn-custos');
  await page.locator('#legend .row').first().hover();
  const dimmed = await page.evaluate(() => document.querySelectorAll('#donut circle.dim').length);
  check('hover na legenda destaca fatia', dimmed > 0, dimmed + ' dimmed');

  // 13. gráfico do cofrinho aparece ao guardar aporte
  await page.fill('#apValor', '2500');
  await page.click('#addAporte');
  await page.waitForTimeout(400);
  const chart = await page.evaluate(() => {
    const svg = document.getElementById('cofreChart');
    return {
      visible: svg.style.display !== 'none',
      lines: svg.querySelectorAll('polyline').length,
      dots: svg.querySelectorAll('circle').length,
      metaLabel: (svg.textContent || '').includes('meta')
    };
  });
  check('gráfico do cofrinho renderiza (linha, ponto, meta)', chart.visible && chart.lines >= 1 && chart.dots >= 1 && chart.metaLabel, JSON.stringify(chart));
  const ritmo = await page.textContent('#cofreRitmo');
  check('projeção "meta em" aparece no ritmo', ritmo.includes('meta em'), ritmo.slice(0, 90) + '…');

  // 14. orçamento 0 persiste (correção do falsy)
  await page.click('#tabbtn-shop');
  await page.fill('#shopBudget', '0');
  await page.waitForTimeout(400);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(600);
  const sb = await page.inputValue('#shopBudget');
  check('orçamento 0 não volta para 1000', sb === '0', sb);

  // screenshot desktop
  await page.click('#tabbtn-dash');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'shot-desktop.png', fullPage: false });

  // 15. alerta de prazo ≤7 dias (contexto limpo, embarque daqui a 5 dias)
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p3 = await ctx2.newPage();
  await p3.goto('http://127.0.0.1:8123/', { waitUntil: 'load' });
  await p3.waitForTimeout(800);
  const soon = new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10);
  await p3.click('#tabbtn-cal');
  await p3.fill('#dtIni', soon);
  await p3.waitForTimeout(500);
  await p3.evaluate(() => localStorage.removeItem('disney2027-kd-alert'));
  await p3.reload({ waitUntil: 'load' });
  await p3.waitForTimeout(1000);
  const alertText = (await p3.locator('.toast').count()) ? await p3.textContent('.toast') : '';
  check('alerta de prazo aparece ao abrir (embarque em 5 dias)', alertText.includes('⏰'), alertText.slice(0, 80));
  await ctx2.close();

  // 16. mobile: viewport funciona, nav fixa, sem scroll horizontal
  const mob = await ctx.newPage();
  await mob.setViewportSize({ width: 390, height: 844 });
  await mob.goto('http://127.0.0.1:8123/', { waitUntil: 'load' });
  await mob.waitForTimeout(1000);
  const navPos = await mob.evaluate(() => {
    const n = document.querySelector('nav.tabs');
    const cs = getComputedStyle(n);
    return { pos: cs.position, bottom: Math.round(n.getBoundingClientRect().bottom), vh: window.innerHeight, docW: document.documentElement.scrollWidth, winW: window.innerWidth };
  });
  check('mobile: nav fixa no rodapé', navPos.pos === 'fixed' && navPos.bottom === navPos.vh, JSON.stringify(navPos));
  check('mobile: sem scroll horizontal', navPos.docW <= navPos.winW, navPos.docW + ' vs ' + navPos.winW);
  await mob.screenshot({ path: 'shot-mobile.png' });

  console.log(results.join('\n'));
  console.log('\nERROS DE CONSOLE (' + errors.length + '):');
  errors.forEach(e => console.log('  ' + e));
  await browser.close();
  process.exit(results.some(r => r.startsWith('FAIL')) ? 1 : 0);
})().catch(e => { console.error('SCRIPT ERROR:', e); process.exit(2); });
