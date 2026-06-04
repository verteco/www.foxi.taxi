/* ============================================================
   FOXI TAXI — Shared screens
   splash · phone-fallback · safety-toolkit · language-switch · dev-toggle
   ============================================================ */

FOXI.screen('splash', function () {
  return {
    app: 'rider', theme: 'light',
    html:
      '<div class="screen" style="background:linear-gradient(160deg,#5a57a5,#463794);align-items:center;justify-content:center;color:#fff;text-align:center">' +
      '  <div style="flex:1"></div>' +
      '  <div id="splash-tap" style="display:flex;flex-direction:column;align-items:center;gap:18px">' +
      '    <div style="font-size:40px;font-weight:800;letter-spacing:-.03em">FOXI<span style="color:#f37722">.TAXI</span></div>' +
      '    <div style="opacity:.85;font-weight:500">Tvoja miestna jazda. Férová cena.</div>' +
      '  </div>' +
      '  <div style="flex:1;display:flex;align-items:flex-end;justify-content:center">' +
      '    <img src="/images/foxi-mascot-opt.jpg" alt="" style="width:150px;border-radius:20px 20px 0 0;opacity:.95" />' +
      '  </div>' +
      '  <div style="width:120px;height:4px;border-radius:3px;background:rgba(255,255,255,.25);overflow:hidden;margin:0 0 40px">' +
      '    <div style="height:100%;width:40%;background:#f37722;border-radius:3px;animation:slideBar 1.3s ease-in-out infinite"></div>' +
      '  </div>' +
      '  <style>@keyframes slideBar{0%{transform:translateX(-100%)}100%{transform:translateX(350%)}}</style>' +
      '</div>',
    onMount: function (el) {
      var t = FOXI.after2(function () { FOXI.go('rider-home'); }, 1500);
      el.querySelector('#splash-tap').addEventListener('click', function () { clearTimeout(t); FOXI.go('rider-home'); });
      // long-press → dev toggle
      var lp; el.addEventListener('pointerdown', function () { lp = FOXI.after2(function () { clearTimeout(t); FOXI.go('dev-toggle'); }, 700); });
      el.addEventListener('pointerup', function () { clearTimeout(lp); });
    },
  };
});

FOXI.screen('phone-fallback', function () {
  var d = FOXI.data.dispatcher;
  return {
    theme: 'light',
    html:
      '<div class="screen-scroll s-bottom">' +
      bar('Zavolať dispečera', 'rider-home') +
      '<div class="s-pad" style="text-align:center">' +
      '  <div class="mascot-circle" style="margin-top:10px"><img src="/images/foxi-mascot-opt.jpg" alt=""/></div>' +
      '  <h2 class="h-title" style="margin-top:18px">Hovorte s reálnym človekom</h2>' +
      '  <p class="muted" style="margin-top:8px">V malých mestách je telefón najrýchlejší. Spojíme vás priamo s miestnym dispečerom.</p>' +
      '  <div class="card" style="margin-top:22px;text-align:left">' +
      '    <div class="spread"><div><div class="row-title">' + d.operator + '</div><div class="row-sub">' + d.area + '</div></div><span class="badge badge-green">' + FOXI.icon('check', 14) + ' 24/7</span></div>' +
      '    <div class="divider"></div>' +
      d.numbers.map(function (n, i) {
        return '<a href="tel:' + n.tel + '" class="btn ' + (i === 0 ? 'btn-primary' : 'btn-secondary') + '" style="margin-top:' + (i ? 10 : 0) + 'px">' + FOXI.icon('phone', 20) + ' ' + n.display + '</a>';
      }).join('') +
      '  </div>' +
      '  <p class="muted" style="margin-top:18px;font-size:13px">Radšej appka? <a style="color:var(--purple);font-weight:600" onclick="FOXI.back()">Späť na objednávku online</a></p>' +
      '</div></div>',
  };
});

FOXI.screen('safety-toolkit', function () {
  return {
    theme: 'dark',
    html:
      '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
      bar('Bezpečnostné centrum', null, true) +
      '<div class="s-pad stack">' +
      '  <a href="tel:112" class="btn" style="background:var(--error);color:#fff;height:64px;font-size:19px;box-shadow:0 8px 20px rgba(229,72,77,.35)">' + FOXI.icon('sos', 24) + ' Tiesňové volanie — 112</a>' +
      '  <div class="list" style="margin-top:6px">' +
      row('share', 'Zdieľať živú jazdu', 'Rodina vidí, kde ste', "FOXI.go('share-trip')") +
      row('alert', 'Nahlásiť problém', 'Diskrétne, počas jazdy', "FOXI.toast('Nahlásenie odoslané','success')") +
      '  </div>' +
      '  <div class="card flat"><div class="overline">Detaily jazdy pripravené na zdieľanie</div>' +
      '    <div style="margin-top:10px" class="row-title">' + FOXI.data.driver.name + ' · ' + FOXI.data.driver.car + '</div>' +
      '    <div class="row-sub">' + FOXI.data.driver.plate + ' · ' + FOXI.data.driver.color + '</div></div>' +
      '  <label class="card flat spread" style="cursor:pointer"><div><div class="row-title">Automaticky zdieľať jazdy</div><div class="row-sub">S dôveryhodnými kontaktmi</div></div>' + toggle(false) + '</label>' +
      '</div></div>',
    onMount: wireToggles,
  };
});

FOXI.screen('language-switch', function () {
  return {
    theme: 'light',
    html:
      '<div class="screen-scroll s-bottom">' +
      bar('Jazyk', null, true) +
      '<div class="s-pad"><div class="list">' +
      FOXI.data.langs.map(function (l) {
        var on = l.code === FOXI.state.lang;
        return '<div class="row tap" onclick="FOXI.state.lang=\'' + l.code + '\';FOXI.toast(\'Jazyk: ' + l.label + '\');FOXI.back()">' +
          '<span style="font-size:24px">' + l.flag + '</span><div class="row-main"><div class="row-title">' + l.label + '</div></div>' +
          (on ? '<span style="color:var(--purple)">' + FOXI.icon('check', 22) + '</span>' : '') + '</div>';
      }).join('') +
      '</div></div></div>',
  };
});

FOXI.screen('dev-toggle', function () {
  return {
    theme: 'dark',
    html:
      '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
      bar('Demo prepínač', 'rider-home', true) +
      '<div class="s-pad stack">' +
      '  <div class="overline">Aplikácia</div>' +
      '  <div class="stack">' +
      '    <button class="btn btn-secondary" onclick="FOXI.go(\'rider-home\')">' + FOXI.icon('user', 20) + ' Zákaznícka appka</button>' +
      '    <button class="btn btn-secondary" onclick="FOXI.go(\'driver-home\')">' + FOXI.icon('car', 20) + ' Vodičská appka</button>' +
      '  </div>' +
      '  <div class="overline" style="margin-top:8px">Typ vodiča</div>' +
      '  <div class="segmented"><button class="' + (FOXI.state.persona === 'operator' ? 'active' : '') + '" onclick="FOXI.state.persona=\'operator\';FOXI.toast(\'RS Dolina (operátor)\')">RS Dolina</button><button class="' + (FOXI.state.persona === 'direct' ? 'active' : '') + '" onclick="FOXI.state.persona=\'direct\';FOXI.toast(\'FOXI Direct\')">FOXI Direct</button></div>' +
      '  <p class="muted" style="font-size:13px;margin-top:8px">Operátor vs. priamy vodič mení len odznaky a routing podpory — obrazovky so zárobkom sú rovnaké.</p>' +
      '</div></div>',
  };
});

/* ---------- shared building blocks (used by all screen files) ---------- */
function bar(title, backTo, dark) {
  var onclick = backTo ? "FOXI.go('" + backTo + "')" : 'FOXI.back()';
  return '<div class="appbar"><button class="iconbtn ghost" onclick="' + onclick + '">' + FOXI.icon('back', 22) + '</button>' +
    '<div class="title">' + title + '</div></div>';
}
function row(icon, title, sub, onclick, end) {
  return '<div class="row tap"' + (onclick ? ' onclick="' + onclick + '"' : '') + '>' +
    '<div class="row-ico">' + FOXI.icon(icon, 20) + '</div>' +
    '<div class="row-main"><div class="row-title">' + title + '</div>' + (sub ? '<div class="row-sub">' + sub + '</div>' : '') + '</div>' +
    (end || '<span class="row-chev">' + FOXI.icon('chevron', 18) + '</span>') + '</div>';
}
function toggle(on) {
  return '<span class="tgl" data-on="' + (on ? 1 : 0) + '" style="width:52px;height:32px;border-radius:99px;background:' + (on ? 'var(--success)' : 'var(--line)') + ';position:relative;flex:none;transition:.2s;display:inline-block">' +
    '<span style="position:absolute;top:4px;left:' + (on ? 24 : 4) + 'px;width:24px;height:24px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.3)"></span></span>';
}
function wireToggles(el) {
  el.querySelectorAll('.tgl').forEach(function (t) {
    t.addEventListener('click', function (e) {
      e.preventDefault();
      var on = t.dataset.on === '1'; t.dataset.on = on ? '0' : '1';
      t.style.background = on ? 'var(--line)' : 'var(--success)';
      t.firstElementChild.style.left = on ? '4px' : '24px';
    });
  });
}
