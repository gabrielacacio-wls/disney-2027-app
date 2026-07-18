(function () {
  var KEY = 'disney2027-planner-v1';
  var THEME_KEY = 'disney2027-theme';
  var TAB_KEY = 'disney2027-tab';
  var SNOOZE_KEY = 'disney2027-backup-snooze';
  var PESSOAS = 6;
  var TIPOS = { parque: 'Parque', descanso: 'Descanso', compras: 'Compras', viagem: 'Voo', outro: 'Outro' };

  var DEF = {
    inicio: '2027-04-23', fim: '2027-05-11', cambio: 5.5,
    custos: [
      { n: 'Ingressos Disney (8 dias + Lightning Lane)', v: 4700 },
      { n: 'Hospedagem — Celebration Suites 2BR/2BA', v: 3400 },
      { n: 'Alimentação (mercado + parques)', v: 3000 },
      { n: 'Universal (3 dias) + LEGOLAND/Peppa', v: 2650 },
      { n: 'Carro (minivan) + gasolina + estacionamento', v: 1500 },
      { n: 'Voos — taxas de embarque (6 em pontos)', v: 550 },
      { n: 'Seguro viagem (plano B)', v: 500 },
      { n: 'Compras pessoais (US$ 1.000 × 6)', v: 6000 }
    ],
    flags: { compras1000: true },
    alturas: { jose: 86, laura: 108 },
    cofre: { meta: 0, aportes: [] },
    malas: [
      { p: 'Todos', t: 'Passaportes + vistos', ok: false },
      { p: 'Todos', t: 'Certidões de nascimento das crianças (cópias)', ok: false },
      { p: 'Todos', t: 'Bilhetes de seguro AIG impressos/no celular', ok: false },
      { p: 'Todos', t: 'Reservas impressas (hotel, carro, ingressos)', ok: false },
      { p: 'Todos', t: 'Capas de chuva (6)', ok: false },
      { p: 'Todos', t: 'Garrafas de água reutilizáveis', ok: false },
      { p: 'Todos', t: 'Protetor solar e repelente', ok: false },
      { p: 'Todos', t: 'Casaco leve (noites de abril ~17°C)', ok: false },
      { p: 'Gabriel', t: 'Cartão Skyline + cartão reserva', ok: false },
      { p: 'Gabriel', t: 'Dólares em espécie (US$ 300-500)', ok: false },
      { p: 'Gabriel', t: 'Powerbank e carregadores', ok: false },
      { p: 'Débora', t: 'Kit primeiros socorros + remédios das crianças', ok: false },
      { p: 'Regina', t: 'Remédios de uso contínuo na bagagem de mão', ok: false },
      { p: 'Regina', t: 'Receitas médicas traduzidas', ok: false },
      { p: 'Dario', t: 'Remédios de uso contínuo na bagagem de mão', ok: false },
      { p: 'Dario', t: 'Tênis confortável já amaciado', ok: false },
      { p: 'Laura', t: 'Mochila pequena para o parque', ok: false },
      { p: 'Laura', t: 'Boné e óculos de sol', ok: false },
      { p: 'José', t: 'Carrinho compacto de viagem', ok: false },
      { p: 'José', t: 'Cinto CARES / cadeirinha', ok: false },
      { p: 'José', t: 'Fraldas + troca de roupa extra na mochila', ok: false },
      { p: 'José', t: 'Pelúcia do sono', ok: false }
    ],
    shopBudget: 1000,
    compras: [
      { t: 'Roupas e tênis (outlets Vineland)', p: 'Família', v: 2000, ok: false },
      { t: 'Eletrônicos (Best Buy / Apple)', p: 'Gabriel', v: 500, ok: false },
      { t: 'Perfumes e maquiagem (Sephora/Ulta)', p: 'Débora', v: 300, ok: false },
      { t: 'Souvenirs e orelhas Disney (World of Disney)', p: 'Família', v: 300, ok: false },
      { t: 'LEGO Store (Disney Springs)', p: 'Laura', v: 200, ok: false },
      { t: 'Pelúcias e brinquedos', p: 'José', v: 150, ok: false },
      { t: 'Vitaminas e farmácia (CVS/Walgreens)', p: 'Regina', v: 150, ok: false },
      { t: 'Presentes para levar', p: 'Dario', v: 150, ok: false },
      { t: 'Chocolates e guloseimas (Walmart)', p: 'Família', v: 150, ok: false }
    ],
    roteiro: {
      '2027-04-23': { t: 'viagem', d: 'Voo VCP → MCO (Azul), carro, check-in Celebration Suites, mercado' },
      '2027-04-24': { t: 'descanso', d: 'Piscina e adaptação ao fuso; Disney Springs à noite' },
      '2027-04-25': { t: 'compras', d: 'Vineland Outlets de manhã + piscina' },
      '2027-04-26': { t: 'parque', d: 'Magic Kingdom #1 — Fantasyland; fogos Happily Ever After' },
      '2027-04-27': { t: 'descanso', d: 'Descanso / piscina' },
      '2027-04-28': { t: 'parque', d: 'EPCOT #1 — Frozen e Remy cedo; almoço Akershus; Flower & Garden' },
      '2027-04-29': { t: 'descanso', d: 'Folga; café da manhã Topolino’s Terrace (Riviera)' },
      '2027-04-30': { t: 'parque', d: 'Animal Kingdom — safári cedo; almoço Tusker House; sair ~15h' },
      '2027-05-01': { t: 'parque', d: 'LEGOLAND (Laura) + Peppa Pig Park (José) — grupo se divide' },
      '2027-05-02': { t: 'descanso', d: 'Piscina; Old Town a pé à noite' },
      '2027-05-03': { t: 'parque', d: 'Hollywood Studios — Toy Story Land cedo; Rider Switch em Rise/Tower' },
      '2027-05-04': { t: 'descanso', d: 'Descanso / piscina' },
      '2027-05-05': { t: 'parque', d: 'Epic Universe — Super Nintendo World + Isle of Berk (Child Swap)' },
      '2027-05-06': { t: 'parque', d: 'Universal Studios — DreamWorks Land + Minion Land + E.T.' },
      '2027-05-07': { t: 'descanso', d: 'Descanso / piscina' },
      '2027-05-08': { t: 'parque', d: 'Islands of Adventure — Seuss Landing; Potter para os adultos' },
      '2027-05-09': { t: 'parque', d: 'Magic Kingdom #2 — despedida, fotos no castelo, fogos' },
      '2027-05-10': { t: 'compras', d: 'Compras finais, malas, piscina' },
      '2027-05-11': { t: 'viagem', d: 'Devolução do carro, voo MCO → VCP' }
    },
    pessoas: [
      { n: 'Gabriel', r: 'visto válido', s: 'ok' },
      { n: 'Débora', r: 'visto válido', s: 'ok' },
      { n: 'Laura', r: 'visto válido', s: 'ok' },
      { n: 'Regina', r: 'renovação de visto', s: 'pend' },
      { n: 'Dario', r: 'renovação de visto', s: 'pend' },
      { n: 'José', r: 'passaporte + 1º visto', s: 'pend' }
    ],
    checklist: [
      { f: 'Agora (jul–ago/2026)', t: 'Conferir validade dos 5 passaportes existentes (além de mai/2027)', ok: false },
      { f: 'Agora (jul–ago/2026)', t: 'Passaporte do José: pagar GRU (R$ 257,25) e agendar na PF — os dois pais + certidão', ok: false },
      { f: 'Agora (jul–ago/2026)', t: 'Confirmar o saldo de 650 mil pontos no app Azul Fidelidade', ok: false },
      { f: 'Agora (jul–ago/2026)', t: 'Assinar o menor plano do Clube Azul (descontos + bônus + pontos não expiram)', ok: true },
      { f: 'Agora (jul–ago/2026)', t: 'Ativar alertas de emissão em pontos VCP–MCO (Melhores Destinos, PP, PPV)', ok: false },
      { f: 'Ago–nov/2026', t: 'DS-160 + taxa MRV (US$ 185) para Regina, Dario e José', ok: false },
      { f: 'Ago–nov/2026', t: 'Entrevistas de visto — José com um dos pais; Regina e Dario juntos', ok: false },
      { f: 'Ago–nov/2026', t: 'Reservar Celebration Suites: 2BR/2BA renovada, térreo, longe do Old Town/US-192', ok: false },
      { f: 'Ago–nov/2026', t: 'Comprar ingressos Disney num dia de real forte (antes de out/2026), via revendedor BR no PIX', ok: false },
      { f: 'Ago–nov/2026', t: 'Emitir as 6 passagens com pontos (alvo ≤80 mil/trecho c/ cupom; janelas: Semana do Cliente e Azul Friday; taxas no Skyline)', ok: false },
      { f: 'Nov/2026–jan/2027', t: 'Vistos dos 3 em mãos ✓', ok: false },
      { f: 'Nov/2026–jan/2027', t: 'Comprar Universal 3 dias (calendário 2027 abre fim de out) + LEGOLAND/Peppa na Black Friday (18/11–09/12)', ok: false },
      { f: 'Nov/2026–jan/2027', t: 'Reservar minivan com cancelamento grátis — pagar no Skyline (ativa CDW)', ok: false },
      { f: 'Fev–mar/2027', t: 'Dia -60, 6h ET: reservas de restaurantes (Topolino’s primeiro, depois Akershus, Tusker, Chef Mickey’s)', ok: false },
      { f: 'Fev–mar/2027', t: 'Emitir os 6 bilhetes de seguro AIG/MasterAssist e guardar os PDFs', ok: false },
      { f: 'Fev–mar/2027', t: 'Conferir apólice do cartão dos avós; seguro dedicado se houver doença preexistente', ok: false },
      { f: 'Fev–mar/2027', t: 'Reconferir regras do Lightning Lane e comprar Multi Pass (MK e HS)', ok: false },
      { f: 'Fev–mar/2027', t: 'Cadastrar os 6 no My Disney Experience + app Universal; vincular ingressos', ok: false },
      { f: 'Semana da viagem', t: 'Documentos na mão: passaportes + vistos, certidões das crianças, seguros, reservas', ok: false },
      { f: 'Semana da viagem', t: 'Receitas médicas dos avós; remédios na bagagem de mão', ok: false },
      { f: 'Semana da viagem', t: 'Check-in online; despacho de carrinho e cadeirinha', ok: false },
      { f: 'Semana da viagem', t: 'Remedir as alturas de Laura e José (de tênis)', ok: false }
    ]
  };

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEF));
      var s = JSON.parse(raw);
      if (!s.custos || !s.checklist || !s.roteiro) return JSON.parse(JSON.stringify(DEF));
      if (!s.pessoas) s.pessoas = JSON.parse(JSON.stringify(DEF.pessoas));
      if (!s.compras) s.compras = JSON.parse(JSON.stringify(DEF.compras));
      if (s.shopBudget == null) s.shopBudget = 1000;
      if (!s.flags) s.flags = {};
      if (!s.flags.compras1000) { s.custos.push({ n: 'Compras pessoais (US$ 1.000 × 6)', v: 6000 }); s.flags.compras1000 = true; }
      if (!s.alturas) s.alturas = { jose: 86, laura: 108 };
      if (!s.cofre) s.cofre = { meta: 0, aportes: [] };
      if (!s.malas) s.malas = JSON.parse(JSON.stringify(DEF.malas));
      return s;
    } catch (e) { return JSON.parse(JSON.stringify(DEF)); }
  }
  var S = load();
  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
      markDirty();
    }, 250);
  }
  // grava na hora — obrigatório antes de location.reload(), que mataria o timer
  function saveNow() {
    clearTimeout(saveTimer);
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    markDirty();
  }

  function pd(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function fmtUS(v) { return 'US$ ' + Math.round(v).toLocaleString('pt-BR'); }
  function fmtBR(v) { return 'R$ ' + Math.round(v).toLocaleString('pt-BR'); }
  var DIAS_SEM = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  function tripDays() {
    var out = [], a = pd(S.inicio), b = pd(S.fim);
    if (b < a) b = a;
    for (var d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) out.push(iso(d));
    return out;
  }

  // Entradas vazias do roteiro (e as de datas fora da viagem) não precisam viver no JSON
  function pruneRoteiro() {
    var set = {};
    tripDays().forEach(function (d) { set[d] = true; });
    Object.keys(S.roteiro).forEach(function (d) {
      var e = S.roteiro[d];
      var vazia = !e || !((e.d || '').trim());
      if (vazia && (!set[d] || !e || e.t === 'outro')) delete S.roteiro[d];
    });
  }
  pruneRoteiro();

  function chartColors() {
    var cs = getComputedStyle(document.documentElement);
    var arr = [];
    for (var i = 1; i <= 10; i++) arr.push(cs.getPropertyValue('--chart-' + i).trim());
    return arr;
  }

  // ---------- toast (desfazer / avisos) ----------
  var toastEl = null, toastTimer = null;
  function dismissToast() {
    if (toastTimer) clearTimeout(toastTimer);
    if (toastEl && toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    toastEl = null; toastTimer = null;
  }
  function showToast(msg, actionLabel, actionFn, duration) {
    dismissToast();
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    var tx = document.createElement('span'); tx.textContent = msg;
    toastEl.appendChild(tx);
    if (actionLabel && actionFn) {
      var bt = document.createElement('button'); bt.textContent = actionLabel;
      bt.addEventListener('click', function () { dismissToast(); actionFn(); });
      toastEl.appendChild(bt);
    }
    document.body.appendChild(toastEl);
    toastTimer = setTimeout(dismissToast, duration || 6000);
  }
  function showUndo(msg, undoFn) { showToast(msg, 'Desfazer', undoFn); }

  // ---------- tema ----------
  var THEMES = ['auto', 'light', 'dark'];
  var THEME_META = { auto: ['🌓', 'automático'], light: ['☀️', 'claro'], dark: ['🌙', 'escuro'] };
  var curTheme = 'auto';
  try { curTheme = localStorage.getItem(THEME_KEY) || 'auto'; } catch (e) {}
  if (THEMES.indexOf(curTheme) < 0) curTheme = 'auto';
  function applyTheme(t) {
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
    var b = document.getElementById('btnTheme');
    b.textContent = THEME_META[t][0];
    b.title = 'Tema: ' + THEME_META[t][1] + ' — clique para alternar';
  }
  applyTheme(curTheme);
  document.getElementById('btnTheme').addEventListener('click', function () {
    curTheme = THEMES[(THEMES.indexOf(curTheme) + 1) % THEMES.length];
    try { localStorage.setItem(THEME_KEY, curTheme); } catch (e) {}
    applyTheme(curTheme);
  });

  // ---------- header + countdown ----------
  function renderHeader() {
    var a = pd(S.inicio), b = pd(S.fim);
    document.getElementById('chipDatas').textContent = '📅 ' + a.getDate() + ' ' + MESES[a.getMonth()].slice(0, 3) + ' → ' + b.getDate() + ' ' + MESES[b.getMonth()].slice(0, 3) + ' 2027';
  }
  function tickCountdown() {
    if (sync && sync.gistId && new Date().getSeconds() === 0) renderSyncUi();
    var target = pd(S.inicio); target.setHours(9, 0, 0, 0);
    var diff = target - new Date();
    var chip = document.getElementById('chipCount');
    if (diff <= 0) {
      var end = pd(S.fim); end.setHours(23, 59, 0, 0);
      var txt = (new Date() <= end) ? '🎢 Boa viagem! Vocês estão em Orlando' : '✨ Viagem concluída — que venham as memórias';
      document.getElementById('cdDias').textContent = '0';
      document.getElementById('cdH').textContent = '0'; document.getElementById('cdM').textContent = '0'; document.getElementById('cdS').textContent = '0';
      chip.textContent = txt; document.getElementById('cdInfo').textContent = '';
      return;
    }
    var s = Math.floor(diff / 1000);
    var dias = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    document.getElementById('cdDias').textContent = dias.toLocaleString('pt-BR');
    document.getElementById('cdH').textContent = h; document.getElementById('cdM').textContent = m; document.getElementById('cdS').textContent = sec;
    chip.textContent = '⏳ faltam ' + dias + ' dias';
    var sem = Math.floor(dias / 7);
    document.getElementById('cdInfo').textContent = '≈ ' + sem + ' semanas';
  }

  // ---------- dashboard ----------
  function renderDash() {
    var tot = S.custos.reduce(function (a, c) { return a + (+c.v || 0); }, 0);
    document.getElementById('stUSD').textContent = fmtUS(tot);
    document.getElementById('stBRL').textContent = '≈ ' + fmtBR(tot * S.cambio) + ' + 650 mil pontos';
    document.getElementById('stPP').textContent = fmtUS(tot / PESSOAS);
    document.getElementById('stPPBRL').textContent = '≈ ' + fmtBR(tot / PESSOAS * S.cambio);
    var days = tripDays();
    document.getElementById('stDias').textContent = days.length + ' dias';
    var parques = days.filter(function (d) { return S.roteiro[d] && S.roteiro[d].t === 'parque'; }).length;
    document.getElementById('stParques').textContent = parques;
    document.getElementById('stParquesNote').textContent = 'de ' + days.length + ' — ritmo dia sim, dia não';

    var done = S.checklist.filter(function (i) { return i.ok; }).length;
    var pct = S.checklist.length ? Math.round(done / S.checklist.length * 100) : 0;
    document.getElementById('pgPct').textContent = pct + '%';
    document.getElementById('pgTxt').textContent = done + ' de ' + S.checklist.length + ' itens concluídos';
    document.getElementById('pgBar').style.width = pct + '%';
    var next = S.checklist.filter(function (i) { return !i.ok; }).slice(0, 4);
    var ul = document.getElementById('nextList'); ul.innerHTML = '';
    next.forEach(function (i) {
      var li = document.createElement('li');
      var ph = document.createElement('span'); ph.className = 'ph'; ph.textContent = i.f.split(' (')[0];
      var tx = document.createElement('span'); tx.textContent = i.t;
      li.appendChild(ph); li.appendChild(tx); ul.appendChild(li);
    });
    if (!next.length) { var li2 = document.createElement('li'); li2.textContent = 'Tudo pronto! 🎉'; ul.appendChild(li2); }
    renderKeyDates(); renderPessoas();
  }

  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function fmtD(d) { return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + (d.getFullYear() !== 2027 ? '/' + String(d.getFullYear()).slice(2) : ''); }
  function keyDates() {
    var ini = pd(S.inicio);
    return [
      { l: 'Semana do Cliente Azul — vigiar voos em pontos', d: new Date(2026, 8, 8) },
      { l: 'Universal abre calendário 2027 (comprar 3-day)', d: new Date(2026, 9, 23) },
      { l: 'Azul Friday — janela nº 1 p/ emitir os voos ✈', d: new Date(2026, 10, 13) },
      { l: 'Black Friday parques — LEGOLAND+Peppa e Universal', d: new Date(2026, 10, 24) },
      { l: 'Meta: vistos dos 3 em mãos', d: new Date(2026, 11, 31) },
      { l: 'Emitir as passagens com pontos (limite)', d: new Date(2027, 0, 31) },
      { l: 'Aniversário VPD — última grande promo de ingressos', d: new Date(2027, 2, 11) },
      { l: 'Reservas de restaurantes — dia -60, 6h ET', d: addDays(ini, -60) },
      { l: 'Remedir alturas + reconferir Lightning Lane', d: addDays(ini, -30) },
      { l: 'Bilhetes de seguro AIG dos 6 (até)', d: addDays(ini, -7) },
      { l: 'Embarque VCP → MCO ✈', d: ini }
    ].sort(function (a, b) { return a.d - b.d; });
  }
  function renderKeyDates() {
    var ul = document.getElementById('kdList'); ul.innerHTML = '';
    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    keyDates().forEach(function (k) {
      var li = document.createElement('li');
      var dias = Math.ceil((k.d - hoje) / 86400000);
      if (dias < 0) li.classList.add('past');
      else if (dias <= 45) li.classList.add('soon');
      var dt = document.createElement('span'); dt.className = 'kd-date'; dt.textContent = fmtD(k.d);
      var tx = document.createElement('span'); tx.textContent = k.l;
      var lf = document.createElement('span'); lf.className = 'kd-left';
      lf.textContent = dias < 0 ? 'passou' : (dias === 0 ? 'hoje!' : 'em ' + dias + ' dias');
      li.appendChild(dt); li.appendChild(tx); li.appendChild(lf); ul.appendChild(li);
    });
  }
  function renderPessoas() {
    var g = document.getElementById('pesGrid'); g.innerHTML = '';
    S.pessoas.forEach(function (p) {
      var box = document.createElement('div'); box.className = 'pes';
      var nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = p.n;
      var rl = document.createElement('span'); rl.className = 'role'; rl.textContent = p.r;
      var bt = document.createElement('button'); bt.className = 'st ' + (p.s === 'ok' ? 'ok' : 'pend');
      bt.textContent = p.s === 'ok' ? '✓ documentos ok' : '⏳ pendente';
      bt.setAttribute('aria-label', 'Alternar status de documentos de ' + p.n);
      bt.addEventListener('click', function () { p.s = (p.s === 'ok' ? 'pend' : 'ok'); save(); renderPessoas(); });
      box.appendChild(nm); box.appendChild(rl); box.appendChild(bt); g.appendChild(box);
    });
  }

  // ---------- exportar datas-chave (.ics) ----------
  function icsDate(d) { return d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0'); }
  function icsEscape(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,'); }
  document.getElementById('btnIcs').addEventListener('click', function () {
    var stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Planejador Disney 2027//PT-BR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Disney 2027 — datas-chave'];
    keyDates().forEach(function (k, i) {
      lines.push(
        'BEGIN:VEVENT',
        'UID:disney2027-kd-' + i + '-' + icsDate(k.d) + '@planejador',
        'DTSTAMP:' + stamp,
        'DTSTART;VALUE=DATE:' + icsDate(k.d),
        'DTEND;VALUE=DATE:' + icsDate(addDays(k.d, 1)),
        'SUMMARY:' + icsEscape('🏰 ' + k.l),
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEscape(k.l), 'TRIGGER:-P1D', 'END:VALARM',
        'END:VEVENT'
      );
    });
    lines.push('END:VCALENDAR');
    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'disney2027-datas.ics'; a.click();
    URL.revokeObjectURL(a.href);
    showToast('📅 Calendário baixado — abra o arquivo para adicionar os lembretes');
  });

  // ---------- custos ----------
  var refreshTimer = null;
  function refreshSoon() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refreshNumbers, 150);
  }
  function renderCustos() {
    var tbody = document.getElementById('custoRows'); tbody.innerHTML = '';
    S.custos.forEach(function (c, idx) {
      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
      var inN = document.createElement('input'); inN.type = 'text'; inN.value = c.n;
      inN.addEventListener('input', function () { c.n = inN.value; save(); refreshSoon(); });
      td1.appendChild(inN);
      var td2 = document.createElement('td'); td2.className = 'num';
      var inV = document.createElement('input'); inV.type = 'number'; inV.min = '0'; inV.step = '50'; inV.value = c.v;
      inV.addEventListener('input', function () { c.v = +inV.value || 0; save(); refreshSoon(); });
      td2.appendChild(inV);
      var tdR = document.createElement('td'); tdR.className = 'num';
      var inR = document.createElement('input'); inR.type = 'number'; inR.min = '0'; inR.step = '50';
      inR.value = c.r || ''; inR.placeholder = '—';
      inR.setAttribute('aria-label', 'Gasto real: ' + c.n);
      inR.addEventListener('input', function () { c.r = +inR.value || 0; save(); refreshSoon(); });
      tdR.appendChild(inR);
      var td3 = document.createElement('td'); td3.className = 'num'; td3.dataset.brl = idx;
      var td4 = document.createElement('td'); td4.className = 'num'; td4.dataset.pct = idx;
      var tdP = document.createElement('td'); tdP.style.textAlign = 'center';
      var cbP = document.createElement('input'); cbP.type = 'checkbox'; cbP.checked = !!c.p;
      cbP.title = 'Marcar como pago'; cbP.setAttribute('aria-label', 'Pago: ' + c.n);
      cbP.addEventListener('change', function () { c.p = cbP.checked; tr.classList.toggle('paid', c.p); save(); refreshNumbers(); });
      tdP.appendChild(cbP);
      var td5 = document.createElement('td'); td5.style.textAlign = 'right';
      var del = document.createElement('button'); del.className = 'del'; del.textContent = '✕'; del.title = 'Remover';
      del.setAttribute('aria-label', 'Remover ' + c.n);
      del.addEventListener('click', function () {
        var removed = S.custos.splice(idx, 1)[0];
        save(); renderCustos(); renderDash();
        showUndo('Categoria "' + (removed.n || 'sem nome') + '" removida', function () {
          S.custos.splice(Math.min(idx, S.custos.length), 0, removed);
          save(); renderCustos(); renderDash();
        });
      });
      td5.appendChild(del);
      if (c.p) tr.classList.add('paid');
      tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(tdR); tr.appendChild(td3); tr.appendChild(td4); tr.appendChild(tdP); tr.appendChild(td5);
      tbody.appendChild(tr);
    });
    refreshNumbers();
  }
  function refreshNumbers() {
    var tot = S.custos.reduce(function (a, c) { return a + (+c.v || 0); }, 0);
    S.custos.forEach(function (c, idx) {
      var brl = document.querySelector('[data-brl="' + idx + '"]');
      var pct = document.querySelector('[data-pct="' + idx + '"]');
      if (brl) brl.textContent = fmtBR((+c.v || 0) * S.cambio);
      if (pct) pct.textContent = tot ? Math.round((+c.v || 0) / tot * 100) + '%' : '—';
    });
    document.getElementById('totUSD').textContent = fmtUS(tot);
    document.getElementById('totBRL').textContent = fmtBR(tot * S.cambio);
    // Se há gasto real lançado numa linha paga, ele vale mais que o orçado
    var pago = S.custos.reduce(function (a, c) { return a + (c.p ? (+c.r || +c.v || 0) : 0); }, 0);
    document.getElementById('pagoUSD').textContent = fmtUS(pago);
    document.getElementById('faltaUSD').textContent = fmtUS(Math.max(tot - pago, 0));
    document.getElementById('faltaBRL').textContent = '(≈ ' + fmtBR(Math.max(tot - pago, 0) * S.cambio) + ')';
    var real = S.custos.reduce(function (a, c) { return a + (+c.r || 0); }, 0);
    document.getElementById('totReal').textContent = real ? fmtUS(real) : '—';
    var rd = document.getElementById('realDelta');
    if (real) {
      var dif = real - tot;
      rd.textContent = 'Real lançado: ' + fmtUS(real) + ' (' + (dif >= 0 ? '+' : '−') + fmtUS(Math.abs(dif)) + ' vs orçado)';
      rd.style.color = dif > 0 ? 'var(--danger)' : 'var(--good)';
    } else { rd.textContent = ''; }
    renderCofre();
    document.getElementById('ppUSD').textContent = fmtUS(tot / PESSOAS);
    document.getElementById('ppBRL').textContent = '≈ ' + fmtBR(tot / PESSOAS * S.cambio);
    document.getElementById('ppAd').textContent = fmtUS(tot / PESSOAS * 1.1);
    document.getElementById('ppJose').textContent = fmtUS(tot / PESSOAS * 0.55);
    renderChart(); renderDash();
  }
  function renderChart() {
    var svg = document.getElementById('donut');
    var colors = chartColors();
    var vals = S.custos.map(function (c) { return +c.v || 0; });
    var tot = vals.reduce(function (a, b) { return a + b; }, 0);
    svg.innerHTML = '';
    var leg = document.getElementById('legend'); leg.innerHTML = '';
    if (!tot) return;
    function highlight(i, on) {
      svg.querySelectorAll('circle').forEach(function (c) { c.classList.toggle('dim', on && c.dataset.i !== i); });
      leg.querySelectorAll('.row').forEach(function (r) { r.classList.toggle('dim', on && r.dataset.i !== i); });
    }
    var cx = 100, cy = 100, r = 74, sw = 40;
    var start = -Math.PI / 2;
    var C = 2 * Math.PI * r;
    S.custos.forEach(function (c, i) {
      var frac = (+c.v || 0) / tot;
      if (frac <= 0) return;
      var col = colors[i % colors.length];
      var label = c.n + ' — ' + fmtUS(c.v) + ' (' + Math.round(frac * 100) + '%)';
      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx); circle.setAttribute('cy', cy); circle.setAttribute('r', r);
      circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', col); circle.setAttribute('stroke-width', sw);
      var dash = Math.max(frac * C - 2, 0.5);
      circle.setAttribute('stroke-dasharray', dash + ' ' + (C - dash));
      circle.setAttribute('stroke-dashoffset', -((start + Math.PI / 2) / (2 * Math.PI)) * C);
      circle.setAttribute('transform', 'rotate(-90 ' + cx + ' ' + cy + ')');
      circle.dataset.i = String(i);
      var tip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      tip.textContent = label;
      circle.appendChild(tip);
      circle.addEventListener('mouseenter', function () { highlight(String(i), true); });
      circle.addEventListener('mouseleave', function () { highlight(null, false); });
      svg.appendChild(circle);
      start += frac * 2 * Math.PI;
      var row = document.createElement('div'); row.className = 'row'; row.dataset.i = String(i);
      var sw2 = document.createElement('span'); sw2.className = 'sw'; sw2.style.background = col;
      var nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = c.n; nm.title = c.n;
      var vv = document.createElement('span'); vv.className = 'vv'; vv.textContent = fmtUS(c.v) + ' · ' + Math.round(frac * 100) + '%';
      row.appendChild(sw2); row.appendChild(nm); row.appendChild(vv);
      row.addEventListener('mouseenter', function () { highlight(String(i), true); });
      row.addEventListener('mouseleave', function () { highlight(null, false); });
      leg.appendChild(row);
    });
    var t1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t1.setAttribute('x', cx); t1.setAttribute('y', cy - 2); t1.setAttribute('text-anchor', 'middle');
    t1.setAttribute('font-size', '17'); t1.setAttribute('font-weight', '700'); t1.setAttribute('fill', 'currentColor');
    t1.textContent = fmtUS(tot);
    var t2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t2.setAttribute('x', cx); t2.setAttribute('y', cy + 17); t2.setAttribute('text-anchor', 'middle');
    t2.setAttribute('font-size', '11'); t2.setAttribute('fill', 'currentColor'); t2.setAttribute('opacity', '0.6');
    t2.textContent = '≈ ' + fmtBR(tot * S.cambio);
    svg.appendChild(t1); svg.appendChild(t2);
  }

  // ---------- câmbio automático ----------
  function setCambioInfo(txt) { document.getElementById('cambioInfo').textContent = txt || ''; }
  function fetchCambio(force) {
    setCambioInfo('buscando…');
    fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL')
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var v = parseFloat(j && j.USDBRL && j.USDBRL.bid);
        if (!v || !isFinite(v)) { setCambioInfo(''); return; }
        v = Math.round(v * 100) / 100;
        if (force || !S.cambioManual) {
          S.cambio = v;
          if (force) S.cambioManual = false;
          document.getElementById('cambio').value = v;
          save(); refreshNumbers();
          setCambioInfo('cotação de hoje');
        } else {
          setCambioInfo('hoje: ' + v.toLocaleString('pt-BR'));
        }
      })
      .catch(function () { setCambioInfo(''); });
  }
  document.getElementById('btnCambio').addEventListener('click', function () { fetchCambio(true); });

  // ---------- calendário + roteiro ----------
  var selDay = null;
  function renderCal() {
    var days = tripDays();
    var set = {}; days.forEach(function (d) { set[d] = true; });
    var months = [];
    days.forEach(function (d) {
      var key = d.slice(0, 7);
      if (months.indexOf(key) < 0) months.push(key);
    });
    var wrap = document.getElementById('calWrap'); wrap.innerHTML = '';
    months.forEach(function (mk) {
      var y = +mk.slice(0, 4), m = +mk.slice(5, 7) - 1;
      var box = document.createElement('div'); box.className = 'month';
      var h = document.createElement('h3'); h.textContent = MESES[m] + ' ' + y; box.appendChild(h);
      var dow = document.createElement('div'); dow.className = 'dow';
      ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].forEach(function (l) { var s = document.createElement('span'); s.textContent = l; dow.appendChild(s); });
      box.appendChild(dow);
      var grid = document.createElement('div'); grid.className = 'days';
      var first = new Date(y, m, 1);
      for (var i = 0; i < first.getDay(); i++) grid.appendChild(document.createElement('span'));
      var nDays = new Date(y, m + 1, 0).getDate();
      for (var dn = 1; dn <= nDays; dn++) {
        var dISO = iso(new Date(y, m, dn));
        var cell = document.createElement('div'); cell.className = 'd';
        var num = document.createElement('span'); num.textContent = dn; cell.appendChild(num);
        if (set[dISO]) {
          cell.classList.add('trip');
          var ent = S.roteiro[dISO];
          var dot = document.createElement('span'); dot.className = 'dot tipo-' + (ent ? ent.t : 'outro');
          cell.appendChild(dot);
          cell.title = ent ? ent.d : '';
          if (selDay === dISO) cell.classList.add('sel');
          (function (dd) {
            cell.addEventListener('click', function () { selDay = dd; renderCal(); renderRoteiro(); scrollToDay(dd); });
          })(dISO);
        }
        grid.appendChild(cell);
      }
      box.appendChild(grid);
      wrap.appendChild(box);
    });
  }
  function scrollToDay(d) {
    var el = document.querySelector('[data-day="' + d + '"]');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function renderRoteiro() {
    var list = document.getElementById('rotList'); list.innerHTML = '';
    tripDays().forEach(function (d) {
      // só grava no estado quando o dia é realmente editado
      var ent = S.roteiro[d] || { t: 'outro', d: '' };
      var row = document.createElement('div'); row.className = 'rot-row'; row.dataset.day = d;
      if (selDay === d) row.classList.add('today-sel');
      var dt = pd(d);
      var lab = document.createElement('span'); lab.className = 'dt';
      lab.textContent = DIAS_SEM[dt.getDay()] + ' ' + String(dt.getDate()).padStart(2, '0') + '/' + String(dt.getMonth() + 1).padStart(2, '0');
      var sel = document.createElement('select');
      Object.keys(TIPOS).forEach(function (k) {
        var o = document.createElement('option'); o.value = k; o.textContent = TIPOS[k];
        if (ent.t === k) o.selected = true; sel.appendChild(o);
      });
      sel.addEventListener('change', function () { ent.t = sel.value; S.roteiro[d] = ent; save(); renderCal(); renderDash(); });
      var inp = document.createElement('input'); inp.type = 'text'; inp.value = ent.d; inp.placeholder = 'O que fazer neste dia…';
      inp.addEventListener('input', function () { ent.d = inp.value; S.roteiro[d] = ent; save(); });
      inp.addEventListener('change', function () { renderCal(); });
      row.appendChild(lab); row.appendChild(sel); row.appendChild(inp);
      list.appendChild(row);
    });
  }

  // ---------- checklist ----------
  function renderCheck() {
    var box = document.getElementById('phases'); box.innerHTML = '';
    var fases = [];
    S.checklist.forEach(function (i) { if (fases.indexOf(i.f) < 0) fases.push(i.f); });
    fases.forEach(function (f) {
      var itens = S.checklist.filter(function (i) { return i.f === f; });
      var done = itens.filter(function (i) { return i.ok; }).length;
      var ph = document.createElement('div'); ph.className = 'phase';
      var head = document.createElement('div'); head.className = 'ph-head';
      var h3 = document.createElement('h3'); h3.textContent = f; h3.style.margin = '0';
      var pct = document.createElement('span'); pct.className = 'pct'; pct.textContent = done + '/' + itens.length;
      head.appendChild(h3); head.appendChild(pct); ph.appendChild(head);
      var ul = document.createElement('ul'); ul.className = 'check';
      itens.forEach(function (i) {
        var li = document.createElement('li'); if (i.ok) li.classList.add('done');
        var id = 'ck-' + S.checklist.indexOf(i);
        var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = i.ok; cb.id = id;
        cb.addEventListener('change', function () { i.ok = cb.checked; save(); renderCheck(); renderDash(); });
        var lb = document.createElement('label'); lb.textContent = i.t; lb.setAttribute('for', id);
        li.appendChild(cb); li.appendChild(lb); ul.appendChild(li);
      });
      ph.appendChild(ul); box.appendChild(ph);
    });
    var done = S.checklist.filter(function (i) { return i.ok; }).length;
    document.getElementById('checkResumo').textContent = done + ' de ' + S.checklist.length + ' concluídos';
  }

  // ---------- compras ----------
  var PLIST = ['Família', 'Gabriel', 'Débora', 'Regina', 'Dario', 'Laura', 'José'];
  function renderShop() {
    var list = document.getElementById('shopList'); list.innerHTML = '';
    S.compras.forEach(function (it, idx) {
      var row = document.createElement('div'); row.className = 'shop-row' + (it.ok ? ' ok' : '');
      var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!it.ok;
      cb.setAttribute('aria-label', 'Comprado: ' + it.t);
      cb.addEventListener('change', function () { it.ok = cb.checked; save(); renderShop(); });
      var inT = document.createElement('input'); inT.type = 'text'; inT.value = it.t; inT.placeholder = 'Item…';
      inT.addEventListener('input', function () { it.t = inT.value; save(); });
      var sel = document.createElement('select');
      PLIST.forEach(function (p) { var o = document.createElement('option'); o.value = p; o.textContent = p; if (it.p === p) o.selected = true; sel.appendChild(o); });
      sel.setAttribute('aria-label', 'Para quem');
      sel.addEventListener('change', function () { it.p = sel.value; save(); renderShopBudgets(); });
      var inV = document.createElement('input'); inV.type = 'number'; inV.min = '0'; inV.step = '10'; inV.value = it.v;
      inV.setAttribute('aria-label', 'Valor estimado em dólares');
      inV.addEventListener('input', function () { it.v = +inV.value || 0; save(); renderShopBudgets(); });
      var del = document.createElement('button'); del.className = 'del'; del.textContent = '✕'; del.title = 'Remover';
      del.setAttribute('aria-label', 'Remover ' + it.t);
      del.addEventListener('click', function () {
        var removed = S.compras.splice(idx, 1)[0];
        save(); renderShop();
        showUndo('"' + (removed.t || 'item') + '" removido da lista', function () {
          S.compras.splice(Math.min(idx, S.compras.length), 0, removed);
          save(); renderShop();
        });
      });
      row.appendChild(cb); row.appendChild(inT); row.appendChild(sel); row.appendChild(inV); row.appendChild(del);
      list.appendChild(row);
    });
    renderShopBudgets();
  }
  function renderShopBudgets() {
    var fam = 0, per = {};
    S.compras.forEach(function (it) {
      var v = +it.v || 0;
      if (it.p === 'Família') fam += v; else per[it.p] = (per[it.p] || 0) + v;
    });
    var rateio = fam / PESSOAS;
    var g = document.getElementById('shopBudgets'); g.innerHTML = '';
    ['Gabriel', 'Débora', 'Regina', 'Dario', 'Laura', 'José'].forEach(function (nm) {
      var tot = (per[nm] || 0) + rateio;
      var b = S.shopBudget || 0;
      var card = document.createElement('div'); card.className = 'sb-card';
      var n1 = document.createElement('div'); n1.className = 'nm'; n1.textContent = nm;
      var v1 = document.createElement('div'); v1.className = 'vv';
      v1.textContent = fmtUS(tot) + ' de ' + fmtUS(b) + (tot > b ? ' — estourou!' : '');
      var bar = document.createElement('div'); bar.className = 'bar';
      var fill = document.createElement('i');
      fill.style.width = (b ? Math.min(tot / b * 100, 100) : 0) + '%';
      if (tot > b) fill.className = 'over';
      bar.appendChild(fill);
      card.appendChild(n1); card.appendChild(v1); card.appendChild(bar);
      g.appendChild(card);
    });
    var totAll = S.compras.reduce(function (a, it) { return a + (+it.v || 0); }, 0);
    var totOk = S.compras.reduce(function (a, it) { return a + (it.ok ? (+it.v || 0) : 0); }, 0);
    document.getElementById('shopTot').textContent = 'Planejado: ' + fmtUS(totAll) + ' de ' + fmtUS((S.shopBudget || 0) * PESSOAS) + ' · já comprado: ' + fmtUS(totOk);
  }
  document.getElementById('shopBudget').value = S.shopBudget;
  document.getElementById('shopBudget').addEventListener('input', function () { S.shopBudget = +this.value || 0; save(); renderShopBudgets(); });
  document.getElementById('addShop').addEventListener('click', function () { S.compras.push({ t: '', p: 'Família', v: 0, ok: false }); save(); renderShop(); });

  // ---------- cofrinho ----------
  function cofreMetaEff() {
    var tot = S.custos.reduce(function (a, c) { return a + (+c.v || 0); }, 0);
    return S.cofre.meta || Math.round(tot * S.cambio);
  }
  function renderCofre() {
    var meta = cofreMetaEff();
    var saved = S.cofre.aportes.reduce(function (a, x) { return a + (+x.v || 0); }, 0);
    var pct = meta ? Math.round(saved / meta * 100) : 0;
    document.getElementById('cofrePct').textContent = Math.min(pct, 999) + '%';
    document.getElementById('cofreResumo').textContent = fmtBR(saved) + ' de ' + fmtBR(meta);
    document.getElementById('cofreBar').style.width = Math.min(pct, 100) + '%';
    var falta = Math.max(meta - saved, 0);
    var hoje = new Date(); var ini = pd(S.inicio);
    var meses = Math.max(1, Math.round((ini - hoje) / (30.44 * 86400000)));
    var mesesComAporte = {};
    S.cofre.aportes.forEach(function (a) { if (a.d && +a.v) mesesComAporte[a.d] = 1; });
    var nMeses = Object.keys(mesesComAporte).length;
    var media = nMeses ? saved / nMeses : 0;
    var ritmo = falta
      ? 'Faltam ' + fmtBR(falta) + ' — ≈ ' + fmtBR(Math.ceil(falta / meses / 100) * 100) + '/mês nos próximos ' + meses + ' meses'
      : 'Meta batida! 🎉';
    if (falta && media > 0) {
      var mesesProj = Math.ceil(falta / media);
      var pm = new Date(); pm.setDate(1); pm.setMonth(pm.getMonth() + mesesProj);
      var lbl = MESES[pm.getMonth()].slice(0, 3) + '/' + pm.getFullYear();
      var atrasa = pm > new Date(ini.getFullYear(), ini.getMonth(), 1);
      ritmo += ' · no ritmo atual (' + fmtBR(media) + '/mês), meta em ' + lbl + (atrasa ? ' — depois do embarque!' : '');
    }
    document.getElementById('cofreRitmo').textContent = ritmo;
    renderCofreChart(meta, media);
    var list = document.getElementById('cofreList'); list.innerHTML = '';
    S.cofre.aportes.slice().sort(function (a, b) { return a.d < b.d ? -1 : 1; }).forEach(function (ap) {
      var row = document.createElement('div'); row.className = 'cofre-item';
      var dt = document.createElement('span'); dt.textContent = ap.d ? (ap.d.slice(5, 7) + '/' + ap.d.slice(0, 4)) : '—';
      var vv = document.createElement('b'); vv.textContent = fmtBR(+ap.v || 0);
      var del = document.createElement('button'); del.className = 'del'; del.textContent = '✕';
      del.setAttribute('aria-label', 'Remover aporte');
      del.addEventListener('click', function () {
        var i = S.cofre.aportes.indexOf(ap);
        if (i < 0) return;
        S.cofre.aportes.splice(i, 1); save(); renderCofre();
        showUndo('Aporte de ' + fmtBR(+ap.v || 0) + ' removido', function () {
          S.cofre.aportes.splice(Math.min(i, S.cofre.aportes.length), 0, ap);
          save(); renderCofre();
        });
      });
      row.appendChild(dt); row.appendChild(vv); row.appendChild(del); list.appendChild(row);
    });
    document.getElementById('stCofre').textContent = Math.min(pct, 999) + '%';
    document.getElementById('stCofreNote').textContent = fmtBR(saved) + ' guardados';
  }
  // Evolução do cofrinho: acumulado mensal (área + linha), meta tracejada
  // como referência e projeção no ritmo médio dos meses com aporte.
  function renderCofreChart(meta, media) {
    var svg = document.getElementById('cofreChart');
    var byMonth = {};
    S.cofre.aportes.forEach(function (a) { if (a.d) byMonth[a.d] = (byMonth[a.d] || 0) + (+a.v || 0); });
    var dataMonths = Object.keys(byMonth).sort();
    svg.innerHTML = '';
    if (!dataMonths.length || !meta) { svg.style.display = 'none'; return; }
    svg.style.display = 'block';
    function nextM(m) { var y = +m.slice(0, 4), mm = +m.slice(5, 7) + 1; if (mm > 12) { mm = 1; y++; } return y + '-' + String(mm).padStart(2, '0'); }
    var endM = (S.inicio || '').slice(0, 7);
    var lastData = dataMonths[dataMonths.length - 1];
    if (endM < lastData) endM = lastData;
    var list = [dataMonths[0]], guard = 0;
    while (list[list.length - 1] < endM && guard++ < 60) list.push(nextM(list[list.length - 1]));
    var cum = [], acc = 0;
    list.forEach(function (m) { acc += byMonth[m] || 0; cum.push(acc); });
    var liData = list.indexOf(lastData);
    var W = 560, H = 190, T = 16, R = 12, B = 26, L = 12;
    var maxY = Math.max(meta, cum[cum.length - 1]) * 1.08;
    function X(i) { return L + (W - L - R) * (list.length === 1 ? 0.5 : i / (list.length - 1)); }
    function Y(v) { return H - B - (H - T - B) * (v / maxY); }
    var NS = 'http://www.w3.org/2000/svg';
    function el(tag, attrs, text) {
      var e = document.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      if (text != null) e.textContent = text;
      svg.appendChild(e); return e;
    }
    el('line', { x1: L, x2: W - R, y1: Y(meta), y2: Y(meta), stroke: 'var(--muted)', 'stroke-width': 1, 'stroke-dasharray': '4 4', opacity: 0.8 });
    el('text', { x: W - R, y: Y(meta) - 5, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--muted)' }, 'meta ' + fmtBR(meta));
    var pts = [];
    for (var i = 0; i <= liData; i++) pts.push(X(i) + ',' + Y(cum[i]));
    el('polygon', { points: X(0) + ',' + Y(0) + ' ' + pts.join(' ') + ' ' + X(liData) + ',' + Y(0), fill: 'var(--accent-soft)', opacity: 0.7 });
    el('polyline', { points: pts.join(' '), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-linejoin': 'round' });
    if (media > 0 && cum[liData] < meta) {
      var proj = [X(liData) + ',' + Y(cum[liData])], v = cum[liData];
      for (var j = liData + 1; j < list.length && v < meta; j++) {
        v = Math.min(v + media, meta);
        proj.push(X(j) + ',' + Y(v));
      }
      if (proj.length > 1) el('polyline', { points: proj.join(' '), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-dasharray': '3 5', opacity: 0.65 });
    }
    dataMonths.forEach(function (m) {
      var i = list.indexOf(m);
      var c = el('circle', { cx: X(i), cy: Y(cum[i]), r: 3.5, fill: 'var(--accent)', stroke: 'var(--card)', 'stroke-width': 2 });
      var tip = document.createElementNS(NS, 'title');
      tip.textContent = m.slice(5, 7) + '/' + m.slice(0, 4) + ' — acumulado ' + fmtBR(cum[i]) + ' (aporte ' + fmtBR(byMonth[m]) + ')';
      c.appendChild(tip);
    });
    function mLbl(m) { return MESES[+m.slice(5, 7) - 1].slice(0, 3) + '/' + m.slice(2, 4); }
    el('text', { x: L, y: H - 8, 'font-size': 11, fill: 'var(--muted)' }, mLbl(list[0]));
    el('text', { x: W - R, y: H - 8, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--muted)' },
      (list[list.length - 1] === (S.inicio || '').slice(0, 7) ? '✈ ' : '') + mLbl(list[list.length - 1]));
    if (list.length > 4) {
      var mid = Math.round((list.length - 1) / 2);
      el('text', { x: X(mid), y: H - 8, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--muted)' }, mLbl(list[mid]));
    }
  }

  document.getElementById('cofreMeta').value = S.cofre.meta || '';
  document.getElementById('cofreMeta').addEventListener('input', function () { S.cofre.meta = +this.value || 0; save(); renderCofre(); });
  document.getElementById('apMes').value = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0');
  document.getElementById('addAporte').addEventListener('click', function () {
    var v = +document.getElementById('apValor').value || 0;
    if (!v) return;
    S.cofre.aportes.push({ d: document.getElementById('apMes').value, v: v });
    document.getElementById('apValor').value = '';
    save(); renderCofre();
  });

  // ---------- guia: alturas ----------
  var CORTES = [
    { cm: 0, txt: 'Sem altura mínima — maioria da Fantasyland, Pirates, Safari, Na’vi River, Toy Story Mania, Frozen, Remy, Seuss Landing, DreamWorks Land' },
    { cm: 81, txt: 'Tomorrowland Speedway, Alien Swirling Saucers' },
    { cm: 86, txt: 'Yoshi’s Adventure, E.T. Adventure' },
    { cm: 89, txt: 'The Barnstormer' },
    { cm: 92, txt: 'Trolls Trollercoaster, Cat in the Hat, Flight of the Hippogriff, Pteranodon Flyers' },
    { cm: 97, txt: 'Seven Dwarfs, Big Thunder, Slinky Dog, Millennium Falcon, Kali River Rapids' },
    { cm: 102, txt: 'Soarin’, Test Track, Rise of the Resistance, Tower of Terror, Tiana’s, Mario Kart, Mine-Cart Madness, Hiccup’s Wing Gliders' },
    { cm: 107, txt: 'Guardians of the Galaxy: Cosmic Rewind' },
    { cm: 112, txt: 'Space Mountain, Expedition Everest, Flight of Passage, Mission: SPACE' },
    { cm: 122, txt: 'TRON, Rock ’n’ Roller Coaster, Hagrid’s, Stardust Racers' }
  ];
  function pill(nome, passa) {
    var s = document.createElement('span');
    s.className = 'pill ' + (passa ? 'sim' : 'nao');
    s.textContent = nome + (passa ? ' ✓' : ' ✗');
    return s;
  }
  function renderAlturas() {
    var g = document.getElementById('altGrid'); g.innerHTML = '';
    CORTES.forEach(function (c) {
      var row = document.createElement('div'); row.className = 'alt-row';
      var cut = document.createElement('span'); cut.className = 'cut'; cut.textContent = c.cm ? c.cm + ' cm' : 'livre';
      var right = document.createElement('div');
      var tx = document.createElement('div'); tx.textContent = c.txt;
      var who = document.createElement('div'); who.className = 'who';
      who.appendChild(pill('José', S.alturas.jose >= c.cm));
      who.appendChild(pill('Laura', S.alturas.laura >= c.cm));
      right.appendChild(tx); right.appendChild(who);
      row.appendChild(cut); row.appendChild(right);
      g.appendChild(row);
    });
  }
  document.getElementById('altJose').value = S.alturas.jose;
  document.getElementById('altLaura').value = S.alturas.laura;
  document.getElementById('altJose').addEventListener('input', function () { S.alturas.jose = +this.value || 0; save(); renderAlturas(); });
  document.getElementById('altLaura').addEventListener('input', function () { S.alturas.laura = +this.value || 0; save(); renderAlturas(); });

  // ---------- malas ----------
  var MLIST = ['Todos', 'Gabriel', 'Débora', 'Regina', 'Dario', 'Laura', 'José'];
  var selQuem = document.getElementById('malaQuem');
  MLIST.forEach(function (p) { var o = document.createElement('option'); o.value = p; o.textContent = p; selQuem.appendChild(o); });
  function renderMalas() {
    var box = document.getElementById('malasGroups'); box.innerHTML = '';
    MLIST.forEach(function (p) {
      var itens = S.malas.filter(function (m) { return m.p === p; });
      if (!itens.length) return;
      var done = itens.filter(function (m) { return m.ok; }).length;
      var ph = document.createElement('div'); ph.className = 'phase';
      var head = document.createElement('div'); head.className = 'ph-head';
      var h3 = document.createElement('h3'); h3.textContent = (p === 'Todos' ? '👨‍👩‍👧‍👦 Todos' : p); h3.style.margin = '0';
      var pct = document.createElement('span'); pct.className = 'pct'; pct.textContent = done + '/' + itens.length;
      head.appendChild(h3); head.appendChild(pct); ph.appendChild(head);
      var ul = document.createElement('ul'); ul.className = 'check';
      itens.forEach(function (m) {
        var li = document.createElement('li'); if (m.ok) li.classList.add('done');
        var id = 'ml-' + S.malas.indexOf(m);
        var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = m.ok; cb.id = id;
        cb.addEventListener('change', function () { m.ok = cb.checked; save(); renderMalas(); });
        var lb = document.createElement('label'); lb.textContent = m.t; lb.setAttribute('for', id); lb.style.flex = '1';
        var del = document.createElement('button'); del.className = 'del'; del.textContent = '✕';
        del.style.cssText = 'background:none;border:none;color:var(--muted);cursor:pointer;border-radius:6px;';
        del.setAttribute('aria-label', 'Remover ' + m.t);
        del.addEventListener('click', function () {
          var i = S.malas.indexOf(m);
          if (i < 0) return;
          S.malas.splice(i, 1); save(); renderMalas();
          showUndo('"' + m.t + '" removido da mala', function () {
            S.malas.splice(Math.min(i, S.malas.length), 0, m);
            save(); renderMalas();
          });
        });
        li.appendChild(cb); li.appendChild(lb); li.appendChild(del); ul.appendChild(li);
      });
      ph.appendChild(ul); box.appendChild(ph);
    });
    var done = S.malas.filter(function (m) { return m.ok; }).length;
    document.getElementById('malasResumo').textContent = done + ' de ' + S.malas.length + ' na mala';
  }
  document.getElementById('addMala').addEventListener('click', function () {
    var t = document.getElementById('malaNovo').value.trim();
    if (!t) return;
    S.malas.push({ p: selQuem.value, t: t, ok: false });
    document.getElementById('malaNovo').value = '';
    save(); renderMalas();
  });

  // ---------- sincronização entre aparelhos (GitHub Gist) ----------
  // O plano vive num gist secreto da conta do dono do token; todos os
  // aparelhos da família usam o MESMO token. O token fica só neste
  // navegador (chave própria no localStorage) — nunca entra em S, no JSON
  // exportado ou no link compartilhado.
  var SYNC_KEY = 'disney2027-sync';
  var GIST_FILE = 'disney2027-dados.json';
  var sync = null;
  try { sync = JSON.parse(localStorage.getItem(SYNC_KEY) || 'null'); } catch (e) {}
  var syncBusy = false, pushTimer = null, lastPullAt = 0;

  function saveSync() {
    try {
      if (sync) localStorage.setItem(SYNC_KEY, JSON.stringify(sync));
      else localStorage.removeItem(SYNC_KEY);
    } catch (e) {}
  }
  function ghHeaders() {
    return { 'Authorization': 'Bearer ' + sync.token, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json' };
  }
  function markDirty() {
    if (!sync || !sync.gistId) return;
    sync.dirty = true; saveSync(); renderSyncUi();
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { syncNow(false); }, 3000);
  }
  function syncLabel() {
    if (syncBusy) return '☁️ sincronizando…';
    if (sync.error) return '☁️ ⚠ ' + sync.error;
    if (sync.dirty) return '☁️ alterações a enviar';
    if (sync.lastSync) {
      var min = Math.round((Date.now() - sync.lastSync) / 60000);
      return '☁️ sincronizado ' + (min < 1 ? 'agora' : (min < 60 ? 'há ' + min + ' min' : 'há ' + Math.round(min / 60) + ' h'));
    }
    return '☁️ conectado';
  }
  function renderSyncUi() {
    var on = !!(sync && sync.gistId);
    var chip = document.getElementById('chipSync');
    chip.hidden = !on;
    if (on) chip.textContent = syncLabel();
    document.getElementById('syncOff').hidden = on;
    document.getElementById('syncHelp').hidden = on;
    document.getElementById('syncOn').hidden = !on;
    document.getElementById('syncStatus').textContent = on
      ? syncLabel() + ' · gist ' + sync.gistId + ' · use o mesmo token nos outros aparelhos da família'
      : 'Não conectado — as edições ficam só neste navegador. Conecte para a família inteira ver e editar o mesmo plano.';
  }
  function applyRemote(g) {
    try {
      var f = g.files && g.files[GIST_FILE];
      if (!f) return false;
      var apply = function (content) {
        var s = JSON.parse(content);
        if (!s.custos || !s.checklist) return false;
        S = s;
        try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
        sync.remoteUpdatedAt = g.updated_at; sync.dirty = false; sync.lastSync = Date.now(); sync.error = null;
        saveSync();
        refreshInputs(); renderAll(); renderSyncUi();
        return true;
      };
      if (f.truncated && f.raw_url) {
        fetch(f.raw_url).then(function (r) { return r.text(); }).then(apply);
        return true;
      }
      return apply(f.content);
    } catch (e) { return false; }
  }
  // Campos definidos uma única vez na inicialização precisam ser
  // re-hidratados quando o estado troca por baixo deles (pull da nuvem)
  function refreshInputs() {
    document.getElementById('cambio').value = S.cambio;
    document.getElementById('dtIni').value = S.inicio;
    document.getElementById('dtFim').value = S.fim;
    document.getElementById('shopBudget').value = S.shopBudget;
    document.getElementById('cofreMeta').value = S.cofre.meta || '';
    document.getElementById('altJose').value = S.alturas.jose;
    document.getElementById('altLaura').value = S.alturas.laura;
  }
  function doPush() {
    if (!sync || !sync.gistId) return;
    syncBusy = true; renderSyncUi();
    var files = {}; files[GIST_FILE] = { content: JSON.stringify(S, null, 2) };
    return fetch('https://api.github.com/gists/' + sync.gistId, { method: 'PATCH', headers: ghHeaders(), body: JSON.stringify({ files: files }) })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (g) {
        sync.remoteUpdatedAt = g.updated_at; sync.dirty = false; sync.lastSync = Date.now(); sync.error = null;
        saveSync(); syncBusy = false; renderSyncUi();
      })
      .catch(function () { syncBusy = false; sync.error = 'falha ao enviar — tento de novo ao salvar'; renderSyncUi(); });
  }
  function syncNow(showToasts) {
    if (!sync || !sync.gistId || syncBusy) return;
    syncBusy = true; sync.error = null; renderSyncUi();
    lastPullAt = Date.now();
    fetch('https://api.github.com/gists/' + sync.gistId, { headers: ghHeaders() })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (g) {
        syncBusy = false;
        if (g.updated_at !== sync.remoteUpdatedAt) {
          if (sync.dirty && !confirm('Outro aparelho salvou o plano depois das suas edições. Carregar a versão mais recente? (Cancelar mantém a sua e sobrescreve a da nuvem)')) {
            doPush(); return;
          }
          if (applyRemote(g)) { if (showToasts) showToast('☁️ Plano atualizado da nuvem'); }
          else { sync.error = 'plano da nuvem ilegível'; renderSyncUi(); }
        } else if (sync.dirty) {
          doPush();
        } else {
          sync.lastSync = Date.now(); saveSync(); renderSyncUi();
        }
      })
      .catch(function () { syncBusy = false; sync.error = 'sem conexão'; renderSyncUi(); });
  }
  function connectSync() {
    var token = document.getElementById('syncToken').value.trim();
    if (!token) { showToast('Cole o token do GitHub para conectar'); return; }
    syncBusy = true;
    document.getElementById('syncStatus').textContent = 'Conectando…';
    var hdrs = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json' };
    fetch('https://api.github.com/gists?per_page=100', { headers: hdrs })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (list) {
        var found = null;
        (list || []).forEach(function (g) { if (!found && g.files && g.files[GIST_FILE]) found = g; });
        sync = { token: token, gistId: null, remoteUpdatedAt: null, dirty: false, lastSync: null, error: null };
        if (found) {
          sync.gistId = found.id; saveSync();
          return fetch('https://api.github.com/gists/' + found.id, { headers: ghHeaders() })
            .then(function (r) { return r.json(); })
            .then(function (g) {
              syncBusy = false;
              if (confirm('Encontrei um plano já sincronizado na nuvem. Carregar aqui neste aparelho? (Cancelar envia os dados DESTE aparelho para a nuvem)')) {
                if (!applyRemote(g)) { sync.error = 'plano da nuvem ilegível'; renderSyncUi(); return; }
              } else {
                sync.remoteUpdatedAt = g.updated_at; saveSync();
                doPush();
              }
              document.getElementById('syncToken').value = '';
              showToast('☁️ Sincronização ativada'); renderSyncUi();
            });
        }
        var files = {}; files[GIST_FILE] = { content: JSON.stringify(S, null, 2) };
        return fetch('https://api.github.com/gists', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: 'Planejador Disney 2027 — dados sincronizados', public: false, files: files })
        })
          .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
          .then(function (g) {
            syncBusy = false;
            sync.gistId = g.id; sync.remoteUpdatedAt = g.updated_at; sync.lastSync = Date.now();
            saveSync();
            document.getElementById('syncToken').value = '';
            showToast('☁️ Sincronização ativada — gist secreto criado'); renderSyncUi();
          });
      })
      .catch(function () {
        syncBusy = false; sync = null; saveSync();
        renderSyncUi();
        document.getElementById('syncStatus').textContent = '⚠ Não conectou — confira o token (precisa do escopo gist) e a internet.';
      });
  }
  document.getElementById('btnSyncConnect').addEventListener('click', connectSync);
  document.getElementById('btnSyncNow').addEventListener('click', function () { syncNow(true); });
  document.getElementById('chipSync').addEventListener('click', function () { syncNow(true); });
  document.getElementById('btnSyncOff').addEventListener('click', function () {
    if (confirm('Desconectar a sincronização neste aparelho? O gist na nuvem continua intacto.')) {
      sync = null; saveSync(); renderSyncUi();
    }
  });

  // ---------- compartilhar por link ----------
  function b64urlEncode(buf) {
    var u8 = new Uint8Array(buf), s = '';
    for (var i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64urlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    var bin = atob(str), u8 = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return u8;
  }
  function offerShareUrl(url) {
    var copy = function () {
      var ok = function () { showToast('🔗 Link copiado! Quem abrir recebe uma cópia do plano.'); };
      var manual = function () { prompt('Copie o link:', url); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, manual);
      else manual();
    };
    if (navigator.share) navigator.share({ title: 'Planejador Disney 2027', url: url }).catch(copy);
    else copy();
  }
  document.getElementById('btnShare').addEventListener('click', function () {
    var json = JSON.stringify(S);
    var base = location.origin + location.pathname + '#dados=';
    if (window.CompressionStream) {
      new Response(new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer()
        .then(function (buf) { offerShareUrl(base + 'gz.' + b64urlEncode(buf)); });
    } else {
      offerShareUrl(base + 'js.' + b64urlEncode(new TextEncoder().encode(json)));
    }
  });
  (function importFromHash() {
    var m = location.hash.match(/^#dados=(gz|js)\.([A-Za-z0-9\-_]+)$/);
    if (!m) return;
    var clearHash = function () { history.replaceState(null, '', location.pathname + location.search); };
    var fail = function () { alert('Não consegui ler os dados deste link.'); clearHash(); };
    var apply = function (json) {
      try {
        var s = JSON.parse(json);
        if (!s.custos || !s.checklist) return fail();
        if (confirm('Este link contém um plano compartilhado da viagem. Substituir os dados salvos neste navegador?')) {
          localStorage.setItem(KEY, JSON.stringify(s));
          clearHash();
          location.reload();
          return;
        }
        clearHash();
      } catch (e) { fail(); }
    };
    try {
      var u8 = b64urlDecode(m[2]);
      if (m[1] === 'js') apply(new TextDecoder().decode(u8));
      else if (window.DecompressionStream) {
        new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip'))).text().then(apply, fail);
      } else fail();
    } catch (e) { fail(); }
  })();

  // ---------- lembrete de backup ----------
  function doExport() {
    S.lastExport = iso(new Date());
    save();
    var blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'disney2027-dados.json'; a.click();
    URL.revokeObjectURL(a.href);
  }
  function maybeBackupBanner() {
    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    if (!S.firstUse) { S.firstUse = iso(hoje); save(); return; }
    var snooze = null;
    try { snooze = localStorage.getItem(SNOOZE_KEY); } catch (e) {}
    var refs = [S.firstUse, S.lastExport, snooze].filter(Boolean).map(pd);
    var last = new Date(Math.max.apply(null, refs));
    if ((hoje - last) / 86400000 < 30) return;
    var bar = document.createElement('div'); bar.className = 'banner'; bar.setAttribute('role', 'status');
    var tx = document.createElement('span'); tx.style.flex = '1';
    tx.textContent = '💾 Seus dados ficam só neste navegador e o sistema pode apagá-los. Que tal um backup?';
    var b1 = document.createElement('button'); b1.className = 'btn'; b1.textContent = 'Exportar agora';
    b1.addEventListener('click', function () { doExport(); bar.remove(); });
    var b2 = document.createElement('button'); b2.className = 'btn ghost'; b2.textContent = 'Depois';
    b2.addEventListener('click', function () {
      try { localStorage.setItem(SNOOZE_KEY, iso(new Date())); } catch (e) {}
      bar.remove();
    });
    bar.appendChild(tx); bar.appendChild(b1); bar.appendChild(b2);
    var wrap = document.querySelector('.wrap');
    wrap.insertBefore(bar, wrap.children[1]);
  }

  // ---------- config, export, tabs ----------
  document.getElementById('cambio').value = S.cambio;
  document.getElementById('cambio').addEventListener('input', function () {
    S.cambio = +this.value || 5.5;
    S.cambioManual = true;
    setCambioInfo('');
    save(); refreshSoon();
  });
  document.getElementById('dtIni').value = S.inicio;
  document.getElementById('dtFim').value = S.fim;
  document.getElementById('dtIni').addEventListener('change', function () { if (this.value) { S.inicio = this.value; pruneRoteiro(); save(); renderAll(); } });
  document.getElementById('dtFim').addEventListener('change', function () { if (this.value) { S.fim = this.value; pruneRoteiro(); save(); renderAll(); } });
  document.getElementById('addRow').addEventListener('click', function () { S.custos.push({ n: 'Nova categoria', v: 0 }); save(); renderCustos(); });
  document.getElementById('btnReset').addEventListener('click', function () {
    var aviso = 'Restaurar todos os dados para o padrão do plano? Suas edições serão perdidas.';
    if (sync && sync.gistId) aviso += ' Como a sincronização está ativa, o padrão também será enviado para a nuvem da família.';
    if (confirm(aviso)) {
      S = JSON.parse(JSON.stringify(DEF)); saveNow(); location.reload();
    }
  });
  document.getElementById('btnExport').addEventListener('click', doExport);
  document.getElementById('btnImport').addEventListener('change', function () {
    var f = this.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try { var s = JSON.parse(r.result); if (s.custos && s.checklist) { S = s; saveNow(); location.reload(); } else alert('Arquivo inválido.'); }
      catch (e) { alert('Não consegui ler esse arquivo.'); }
    };
    r.readAsText(f);
  });

  var tabBtns = Array.prototype.slice.call(document.querySelectorAll('nav.tabs button'));
  function setTab(name, focusBtn) {
    tabBtns.forEach(function (x) {
      var on = x.dataset.tab === name;
      x.classList.toggle('on', on);
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
      if (on && focusBtn) x.focus();
    });
    document.querySelectorAll('section.tab').forEach(function (x) { x.classList.toggle('on', x.id === 'tab-' + name); });
    try { localStorage.setItem(TAB_KEY, name); } catch (e) {}
  }
  tabBtns.forEach(function (b) {
    b.addEventListener('click', function () { setTab(b.dataset.tab); });
  });
  document.querySelector('nav.tabs').addEventListener('keydown', function (e) {
    var keys = { ArrowRight: 1, ArrowLeft: -1, Home: 0, End: 0 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    var cur = tabBtns.findIndex(function (x) { return x.classList.contains('on'); });
    var next = e.key === 'Home' ? 0 : e.key === 'End' ? tabBtns.length - 1 : (cur + keys[e.key] + tabBtns.length) % tabBtns.length;
    setTab(tabBtns[next].dataset.tab, true);
  });
  (function restoreTab() {
    var t = null;
    try { t = localStorage.getItem(TAB_KEY); } catch (e) {}
    if (t && document.getElementById('tab-' + t)) setTab(t);
  })();

  // ---------- alerta de prazos próximos (uma vez por dia) ----------
  var KD_ALERT_KEY = 'disney2027-kd-alert';
  function alertKeyDates() {
    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var hojeIso = iso(hoje);
    var seen = null;
    try { seen = localStorage.getItem(KD_ALERT_KEY); } catch (e) {}
    if (seen === hojeIso) return;
    var soon = keyDates().map(function (k) {
      return { l: k.l, dias: Math.ceil((k.d - hoje) / 86400000) };
    }).filter(function (k) { return k.dias >= 0 && k.dias <= 7; });
    if (!soon.length) return;
    var p = soon[0];
    var quando = p.dias === 0 ? 'Hoje' : (p.dias === 1 ? 'Amanhã' : 'Em ' + p.dias + ' dias');
    var msg = '⏰ ' + quando + ': ' + p.l + (soon.length > 1 ? ' — e mais ' + (soon.length - 1) + ' prazo' + (soon.length > 2 ? 's' : '') + ' nesta semana' : '');
    showToast(msg, null, null, 10000);
    try { localStorage.setItem(KD_ALERT_KEY, hojeIso); } catch (e) {}
  }

  function renderAll() { renderHeader(); renderDash(); renderCustos(); renderCal(); renderRoteiro(); renderShop(); renderCheck(); renderAlturas(); renderMalas(); renderCofre(); tickCountdown(); }
  renderAll();
  maybeBackupBanner();
  alertKeyDates();
  fetchCambio(false);
  renderSyncUi();
  syncNow(false);

  var cdTimer = setInterval(tickCountdown, 1000);
  document.addEventListener('visibilitychange', function () {
    if (cdTimer) { clearInterval(cdTimer); cdTimer = null; }
    if (!document.hidden) {
      tickCountdown(); cdTimer = setInterval(tickCountdown, 1000);
      // voltou para o app: puxa da nuvem se a última checagem já envelheceu
      if (sync && sync.gistId && Date.now() - lastPullAt > 60000) syncNow(false);
    }
  });

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { renderChart(); });
  }
  new MutationObserver(function () { renderChart(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
