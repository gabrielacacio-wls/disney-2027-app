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

  // 16. sincronização via gist (API do GitHub mockada)
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p4 = await ctx3.newPage();
  p4.on('dialog', d => d.accept());
  let gist = null; const patches = [];
  await p4.route('https://api.github.com/**', route => {
    const req = route.request(); const url = req.url(); const m = req.method();
    if (m === 'GET' && url.includes('/gists?')) return route.fulfill({ json: gist ? [gist] : [] });
    if (m === 'POST' && url.endsWith('/gists')) {
      const body = JSON.parse(req.postData());
      gist = { id: 'g123', updated_at: '2026-07-18T10:00:00Z', files: { 'disney2027-dados.json': { content: body.files['disney2027-dados.json'].content } } };
      return route.fulfill({ json: gist });
    }
    if (m === 'GET' && url.includes('/gists/g123')) return route.fulfill({ json: gist });
    if (m === 'PATCH' && url.includes('/gists/g123')) {
      const body = JSON.parse(req.postData());
      gist.files['disney2027-dados.json'].content = body.files['disney2027-dados.json'].content;
      gist.updated_at = '2026-07-18T10:0' + Math.min(9, 1 + patches.length) + ':00Z';
      patches.push(body);
      return route.fulfill({ json: gist });
    }
    return route.fulfill({ status: 404, json: {} });
  });
  await p4.goto('http://127.0.0.1:8123/', { waitUntil: 'load' });
  await p4.waitForTimeout(800);
  await p4.click('#tabbtn-check');
  await p4.fill('#syncToken', 'ghp_teste_fake');
  await p4.click('#btnSyncConnect');
  await p4.waitForTimeout(800);
  const syncSt = await p4.textContent('#syncStatus');
  check('sync: conecta e cria o gist', syncSt.includes('g123'), syncSt.slice(0, 70));
  const chipSync = await p4.locator('#chipSync').isVisible();
  check('sync: chip aparece no cabeçalho', chipSync);
  const offHidden = await p4.locator('#syncOff').isHidden();
  const onVisible = await p4.locator('#syncOn').isVisible();
  check('sync: UI alterna conectado/desconectado', offHidden && onVisible, `offHidden=${offHidden} onVisible=${onVisible}`);
  await p4.click('#tabbtn-custos');
  await p4.fill('#cambio', '6');
  await p4.waitForTimeout(4200);
  const pushed = patches.length >= 1 && patches[patches.length - 1].files['disney2027-dados.json'].content.includes('"cambio": 6');
  check('sync: edição enviada para a nuvem (push automático)', pushed, patches.length + ' push(es)');
  const remote = JSON.parse(gist.files['disney2027-dados.json'].content);
  remote.cambio = 7; remote.cambioManual = true;
  gist.files['disney2027-dados.json'].content = JSON.stringify(remote, null, 2);
  gist.updated_at = '2026-07-18T11:00:00Z';
  await p4.reload({ waitUntil: 'load' });
  await p4.waitForTimeout(1200);
  const camRemote = await p4.inputValue('#cambio');
  check('sync: mudança remota aplicada ao abrir', camRemote === '7', camRemote);
  await ctx3.close();

  // 17. modo dia de parque: prévia + navegação entre dias
  const ctxDia = await browser.newContext();
  const p6 = await ctxDia.newPage();
  await p6.goto('http://127.0.0.1:8123/', { waitUntil: 'load' });
  await p6.waitForTimeout(700);
  await p6.click('#tabbtn-hoje');
  const aviso = await p6.locator('#diaAviso').isVisible();
  const dia1 = await p6.textContent('#diaDesc');
  check('dia de parque: prévia mostra o 1º dia', aviso && dia1.includes('Voo VCP'), dia1.slice(0, 50));
  await p6.click('#diaNext');
  await p6.click('#diaNext');
  await p6.click('#diaNext'); // dia 4 = Magic Kingdom
  const dia4 = await p6.textContent('#diaDesc');
  const lembretes = await p6.textContent('#diaLembretes');
  const mochilaVis = await p6.locator('#diaMochilaCard').isVisible();
  check('dia de parque: dia Disney mostra Rider Switch e mochila', dia4.includes('Magic Kingdom') && lembretes.includes('Rider Switch') && mochilaVis, dia4.slice(0, 40));
  // mochila do dia persiste por data
  await p6.locator('#diaMochila input').first().check();
  await p6.waitForTimeout(500);
  await p6.reload({ waitUntil: 'load' });
  await p6.waitForTimeout(700);
  await p6.click('#tabbtn-hoje');
  for (let k = 0; k < 3; k++) await p6.click('#diaNext');
  const mochilaMarcada = await p6.locator('#diaMochila input').first().isChecked();
  check('dia de parque: mochila do dia persiste por data', mochilaMarcada);
  await ctxDia.close();

  // 18. durante a viagem, o app abre direto na aba Hoje
  const ctxTrip = await browser.newContext();
  const p7 = await ctxTrip.newPage();
  await p7.goto('http://127.0.0.1:8123/', { waitUntil: 'load' });
  await p7.waitForTimeout(700);
  const hoje = new Date();
  const isoLocal = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const ini = new Date(hoje); ini.setDate(ini.getDate() - 2);
  const fim = new Date(hoje); fim.setDate(fim.getDate() + 4);
  await p7.evaluate(([a, b]) => {
    const s = JSON.parse(localStorage.getItem('disney2027-planner-v1'));
    s.inicio = a; s.fim = b;
    localStorage.setItem('disney2027-planner-v1', JSON.stringify(s));
  }, [isoLocal(ini), isoLocal(fim)]);
  await p7.reload({ waitUntil: 'load' });
  await p7.waitForTimeout(800);
  const hojeOn = await p7.evaluate(() => document.getElementById('tab-hoje').classList.contains('on'));
  const tagVis = await p7.locator('#diaTag').isVisible();
  const tagTxt = tagVis ? await p7.textContent('#diaTag') : '';
  check('dia de parque: durante a viagem abre na aba Hoje marcando HOJE', hojeOn && tagTxt.includes('HOJE'), `on=${hojeOn} tag=${tagTxt}`);
  await ctxTrip.close();

  // 19. registro de gastos: lançar, integrar aos custos, avisar estouro, persistir
  const ctxG = await browser.newContext();
  const p8 = await ctxG.newPage();
  await p8.goto('http://127.0.0.1:8123/', { waitUntil: 'load' });
  await p8.waitForTimeout(700);
  await p8.click('#tabbtn-hoje');
  await p8.fill('#gastoValor', '25.5');
  await p8.fill('#gastoNota', 'almoço Cosmic Ray´s');
  await p8.locator('#gastoCats button', { hasText: 'Comida' }).click();
  await p8.waitForTimeout(500);
  const gastoItem = await p8.textContent('#gastoList');
  const gastoResumo = await p8.textContent('#diaGastoResumo');
  check('gastos: lançamento entra na lista do dia', gastoItem.includes('25,5') && gastoItem.includes('almoço'), gastoResumo);
  await p8.click('#tabbtn-custos');
  const totReal = await p8.textContent('#totReal');
  const glanc = await p8.textContent('[data-glanc="2"]');
  check('gastos: alimenta o Real dos custos e a nota da linha', totReal.includes('26') && glanc.includes('25,5'), `totReal=${totReal} linha=${glanc}`);
  await p8.click('#tabbtn-hoje');
  await p8.fill('#gastoValor', '4000');
  await p8.locator('#gastoCats button', { hasText: 'Comida' }).click();
  await p8.waitForTimeout(500);
  const aviso19 = await p8.textContent('#gastoViagem');
  check('gastos: avisa estouro da categoria', aviso19.includes('⚠') && aviso19.includes('acima do orçado'), aviso19.slice(0, 90));
  await p8.reload({ waitUntil: 'load' });
  await p8.waitForTimeout(700);
  await p8.click('#tabbtn-hoje');
  const persistiu = await p8.textContent('#gastoList');
  check('gastos: persistem após reload', persistiu.includes('almoço'), '');
  await ctxG.close();

  // 20. família editável: Marília incluída, valores por 7, adicionar/remover pessoa
  const ctxF = await browser.newContext();
  const p9 = await ctxF.newPage();
  await p9.goto('http://127.0.0.1:8123/', { waitUntil: 'load' });
  await p9.waitForTimeout(700);
  const nomes = await p9.$$eval('#pesGrid input.nm', els => els.map(e => e.value));
  const famHdr = await p9.textContent('#famNames');
  check('família: Marília no grupo e no cabeçalho', nomes.includes('Marília') && famHdr.includes('Marília'), nomes.join(','));
  const lbl7 = await p9.textContent('#stPPLbl');
  const pp7 = await p9.textContent('#stPP');
  check('família: média recalculada para 7 pessoas', lbl7.includes('(7)') && pp7.includes('3.279'), `${lbl7} ${pp7}`);
  const checklistTxt = await p9.textContent('#phases');
  check('família: checklist cobre passaporte e visto da Marília', checklistTxt.includes('Passaporte da Marília') && checklistTxt.includes('Regina, Dario, Marília e José'));
  check('família: checklist tem passagens no cartão dos avós/Marília', checklistTxt.includes('comprar as passagens no cartão deles') && checklistTxt.includes('Emitir as 4 passagens'));
  await p9.click('#addPessoa');
  await p9.waitForTimeout(300);
  const lbl8 = await p9.textContent('#stPPLbl');
  const pp8 = await p9.textContent('#stPP');
  const cards8 = await p9.locator('#shopBudgets .sb-card').count();
  check('família: adicionar pessoa recalcula (÷8)', lbl8.includes('(8)') && pp8.includes('2.869') && cards8 === 8, `${lbl8} ${pp8} cards=${cards8}`);
  await p9.locator('#pesGrid .pes .del').last().click();
  await p9.waitForTimeout(300);
  const lblBack = await p9.textContent('#stPPLbl');
  const undoVis = await p9.locator('.toast').isVisible();
  check('família: remover pessoa recalcula e oferece desfazer', lblBack.includes('(7)') && undoVis, lblBack);
  await ctxF.close();

  // 21. paradas do dia + mapa (tiles do OSM bloqueados para o teste ficar offline)
  const ctxM = await browser.newContext();
  await ctxM.route('**/tile.openstreetmap.org/**', r => r.abort());
  const pM = await ctxM.newPage();
  await pM.goto('http://127.0.0.1:8123/', { waitUntil: 'load' });
  await pM.waitForTimeout(700);
  await pM.click('#tabbtn-hoje');
  await pM.waitForTimeout(400);
  const leafletOk = await pM.evaluate(() => !!window.L && !!document.querySelector('#mapa .leaflet-pane'));
  check('mapa: Leaflet auto-hospedado inicializa', leafletOk);
  // dia 1 (voo + check-in) infere MCO e hotel
  const pins1 = await pM.locator('#mapa .pin-num').count();
  const rows1 = await pM.locator('.parada-row').count();
  check('mapa: paradas inferidas do roteiro do dia 1', pins1 >= 2 && rows1 >= 2, `pins=${pins1} rows=${rows1}`);
  // dia 4 = Magic Kingdom
  for (let k = 0; k < 3; k++) await pM.click('#diaNext');
  await pM.waitForTimeout(300);
  const mk = await pM.locator('.parada-row select').first().inputValue();
  check('mapa: dia de Magic Kingdom aponta para o parque', mk === 'magic', mk);
  // adicionar parada materializa e mostra distância
  await pM.click('#addParada');
  await pM.waitForTimeout(300);
  await pM.locator('.parada-row select').last().selectOption('springs');
  await pM.waitForTimeout(400);
  const dist = await pM.locator('.parada-dist').count();
  const rows2 = await pM.locator('.parada-row').count();
  const autoOff = await pM.locator('.parada-row.auto').count();
  check('mapa: adicionar parada vira lista editável com distâncias', rows2 === 2 && dist >= 1 && autoOff === 0, `rows=${rows2} dist=${dist}`);
  // persiste após reload
  await pM.reload({ waitUntil: 'load' });
  await pM.waitForTimeout(700);
  await pM.click('#tabbtn-hoje');
  for (let k = 0; k < 3; k++) await pM.click('#diaNext');
  await pM.waitForTimeout(300);
  const rows3 = await pM.locator('.parada-row').count();
  check('mapa: paradas persistem após reload', rows3 === 2, String(rows3));
  await ctxM.close();

  // 22. reset persiste após reload (gravação síncrona antes do reload)
  const ctx4 = await browser.newContext();
  const p5 = await ctx4.newPage();
  p5.on('dialog', d => d.accept());
  await p5.goto('http://127.0.0.1:8123/', { waitUntil: 'load' });
  await p5.waitForTimeout(700);
  await p5.click('#tabbtn-custos');
  await p5.fill('#cambio', '9');
  await p5.waitForTimeout(500);
  await p5.click('#tabbtn-check');
  await p5.click('#btnReset');
  await p5.waitForTimeout(1500);
  const camReset = await p5.inputValue('#cambio');
  check('reset volta ao padrão e persiste (saveNow)', camReset === '5.5', camReset);
  await ctx4.close();

  // 18. mobile: viewport funciona, nav fixa, sem scroll horizontal
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
