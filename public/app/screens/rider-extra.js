/* ============================================================
   FOXI TAXI — Rider secondary screens + onboarding (LIGHT)
   onboarding 1–3 · auth-phone · auth-otp · permission-location
   rider-activity · account · no-drivers · chat · promo-code
   schedule-ride · saved-places · settings · support
   ============================================================ */
(function () {
  var D = FOXI.data;

  /* tiny shared bits for this file */
  function pager(active) {
    return '<div style="display:flex;gap:8px;justify-content:center;margin-top:26px">' +
      [0, 1, 2].map(function (i) {
        return '<span style="width:' + (i === active ? 22 : 8) + 'px;height:8px;border-radius:99px;background:' +
          (i === active ? 'var(--purple)' : 'var(--line)') + ';transition:.2s"></span>';
      }).join('') + '</div>';
  }
  function onboard(opts) {
    return {
      app: 'rider', theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        '<div class="appbar"><div class="appbar-spacer"></div>' +
        (opts.skip ? '<button class="iconbtn ghost" style="width:auto;padding:0 10px;font-size:14px;font-weight:600;color:var(--text-3)" onclick="FOXI.go(\'auth-phone\')">Preskočiť</button>' : '<div style="width:42px"></div>') +
        '</div>' +
        '<div class="s-pad" style="text-align:center;display:flex;flex-direction:column;min-height:78vh">' +
        '  <div style="flex:1"></div>' +
        '  <div class="mascot-circle"><img src="/images/foxi-mascot-opt.jpg" alt=""/></div>' +
        '  <h2 class="h-title" style="margin-top:26px">' + opts.title + '</h2>' +
        '  <p class="muted" style="margin-top:12px;font-size:16px;line-height:1.5;max-width:320px;margin-left:auto;margin-right:auto">' + opts.body + '</p>' +
        '  <div style="flex:1"></div>' +
        pager(opts.page) +
        '  <button class="btn btn-primary" style="margin-top:24px" onclick="FOXI.go(\'' + opts.next + '\')">' + opts.cta + '</button>' +
        '</div></div>',
    };
  }

  /* ---------------- ONBOARDING 1 ---------------- */
  FOXI.screen('onboarding-1', function () {
    return onboard({
      page: 0, skip: true,
      title: 'Žiadne prekvapenia v cene.',
      body: 'Vidíte celú cenu pred objednaním. Žiadny surge. Žiadne skryté poplatky.',
      cta: 'Ďalej', next: 'onboarding-2',
    });
  });

  /* ---------------- ONBOARDING 2 ---------------- */
  FOXI.screen('onboarding-2', function () {
    return onboard({
      page: 1, skip: true,
      title: 'Plaťte ako chcete.',
      body: 'Hotovosť, karta alebo Apple/Google Pay — vaša voľba, každá jazda.',
      cta: 'Ďalej', next: 'onboarding-3',
    });
  });

  /* ---------------- ONBOARDING 3 ---------------- */
  FOXI.screen('onboarding-3', function () {
    return onboard({
      page: 2, skip: false,
      title: 'Vždy reálny miestny človek.',
      body: 'Radšej zavoláte? Jedným ťukom spojíte s miestnym dispečerom.',
      cta: 'Začať', next: 'auth-phone',
    });
  });

  /* ---------------- AUTH · PHONE ---------------- */
  FOXI.screen('auth-phone', function () {
    return {
      app: 'rider', theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Prihlásenie', null) +
        '<div class="s-pad">' +
        '  <h2 class="h-title" style="margin-top:8px">Zadajte číslo</h2>' +
        '  <p class="muted" style="margin-top:8px">Pošleme vám overovací kód cez SMS.</p>' +
        '  <div style="display:flex;gap:10px;margin-top:22px">' +
        '    <button class="chip" style="height:52px;font-size:16px;flex:none" onclick="FOXI.go(\'language-switch\')"><span style="font-size:20px">🇸🇰</span> +421 ' + FOXI.icon('chevdown', 14) + '</button>' +
        '    <input class="field" type="tel" inputmode="tel" placeholder="905 123 456" style="flex:1" />' +
        '  </div>' +
        '  <label class="row" style="background:none;box-shadow:none;padding:14px 0;margin-top:4px;align-items:flex-start;cursor:pointer">' +
        '    <span class="tgl" data-on="0" style="margin-top:1px;width:52px;height:32px;border-radius:99px;background:var(--line);position:relative;flex:none;transition:.2s;display:inline-block"><span style="position:absolute;top:4px;left:4px;width:24px;height:24px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.3)"></span></span>' +
        '    <span class="row-sub" style="line-height:1.5">Súhlasím s <a style="color:var(--purple);font-weight:600">Podmienkami</a> a so spracovaním podľa <a style="color:var(--purple);font-weight:600">Súkromia</a>.</span>' +
        '  </label>' +
        '  <button class="btn btn-primary" style="margin-top:18px" onclick="FOXI.go(\'auth-otp\')">Pokračovať</button>' +
        '  <div class="spread" style="margin:22px 0;gap:12px"><div class="divider" style="flex:1"></div><span class="muted" style="font-size:13px">alebo</span><div class="divider" style="flex:1"></div></div>' +
        '  <div class="stack">' +
        '    <button class="btn btn-secondary" onclick="FOXI.go(\'permission-location\')">' + FOXI.icon('apple', 18) + ' Pokračovať cez Apple</button>' +
        '    <button class="btn btn-secondary" onclick="FOXI.go(\'permission-location\')">' + FOXI.icon('globe', 18) + ' Pokračovať cez Google</button>' +
        '  </div>' +
        '</div></div>',
      onMount: wireToggles,
    };
  });

  /* ---------------- AUTH · OTP ---------------- */
  FOXI.screen('auth-otp', function () {
    var digits = ['1', '2', '3', '4'];
    return {
      app: 'rider', theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Overenie', 'auth-phone') +
        '<div class="s-pad">' +
        '  <h2 class="h-title" style="margin-top:8px">Zadajte kód</h2>' +
        '  <p class="muted" style="margin-top:8px">Poslali sme kód na <b style="color:var(--text)">+421 905 123 456</b></p>' +
        '  <div style="display:flex;gap:12px;margin-top:24px">' +
        digits.map(function (d) {
          return '<input class="field tnum" value="' + d + '" maxlength="1" inputmode="numeric" style="flex:1;height:64px;text-align:center;font-size:28px;font-weight:800" />';
        }).join('') +
        '  </div>' +
        '  <p class="muted" style="margin-top:16px;font-size:13.5px">Znova poslať o 0:28</p>' +
        '  <button class="btn btn-primary" style="margin-top:18px" onclick="FOXI.go(\'permission-location\')">Overiť</button>' +
        '  <p class="muted" style="margin-top:16px;font-size:13px;text-align:center">Nedorazil kód? <a style="color:var(--purple);font-weight:600" onclick="FOXI.go(\'phone-fallback\')">Zavolajte dispečerovi</a></p>' +
        '</div></div>',
    };
  });

  /* ---------------- PERMISSION · LOCATION ---------------- */
  FOXI.screen('permission-location', function () {
    return {
      app: 'rider', theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        '<div class="s-pad" style="text-align:center;padding-top:40px">' +
        '  <div class="mascot-circle"><img src="/images/foxi-mascot-opt.jpg" alt=""/></div>' +
        '  <div style="margin-top:-26px"><span class="badge badge-purple" style="height:40px;width:40px;border-radius:50%;padding:0;font-size:0;justify-content:center">' + FOXI.icon('pin', 22) + '</span></div>' +
        '  <h2 class="h-title" style="margin-top:18px">Povoľte polohu pre presné vyzdvihnutie</h2>' +
        '</div>' +
        '<div class="s-pad">' +
        '  <div class="list" style="margin-top:6px">' +
        row('zap', 'Rýchlejšie a presnejšie vyzdvihnutie', null, null, '<span></span>') +
        row('car', 'Vidíte autá v okolí', null, null, '<span></span>') +
        row('shield', 'Polohu používame len počas jázd', null, null, '<span></span>') +
        '  </div>' +
        '  <button class="btn btn-primary" style="margin-top:18px" onclick="FOXI.go(\'rider-home\')">Povoliť polohu</button>' +
        '  <button class="btn btn-ghost" style="margin-top:6px" onclick="FOXI.go(\'rider-home\')">Zadať vyzdvihnutie ručne</button>' +
        '</div></div>',
    };
  });

  /* ---------------- RIDER ACTIVITY ---------------- */
  FOXI.screen('rider-activity', function () {
    function trip(date, route, price, onclick) {
      return '<div class="row tap"' + (onclick ? ' onclick="' + onclick + '"' : '') + '>' +
        '<div class="row-ico">' + FOXI.icon('clock', 20) + '</div>' +
        '<div class="row-main"><div class="row-title">' + route + '</div><div class="row-sub">' + date + ' · <b style="color:var(--text)">' + price + '</b> · Dokončené</div></div>' +
        '<span class="row-chev">' + FOXI.icon('chevron', 18) + '</span></div>';
    }
    return {
      app: 'rider', theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg);padding-bottom:96px">' +
        bar('Aktivita', null) +
        '<div class="s-pad">' +
        '  <div class="segmented"><button class="active" onclick="FOXI.toast(\'Minulé jazdy\')">Minulé</button><button onclick="FOXI.toast(\'Žiadne naplánované jazdy\')">Naplánované</button></div>' +
        '  <div class="list" style="margin-top:16px">' +
        trip('04. jún', 'Trebišov → Nemocnica', FOXI.money(10.90), "FOXI.go('receipt')") +
        trip('02. jún', 'Stanica → Kaufland', FOXI.money(4.80), "FOXI.go('receipt')") +
        trip('29. máj', 'Domov → Sečovce', FOXI.money(7.50), "FOXI.go('receipt')") +
        '  </div>' +
        '  <button class="btn btn-primary" style="margin-top:18px" onclick="FOXI.go(\'rider-home\')">Objednať jazdu</button>' +
        '</div></div>' +
        FOXI.ui.tabbar('activity'),
    };
  });

  /* ---------------- ACCOUNT ---------------- */
  FOXI.screen('account', function () {
    var r = D.rider;
    return {
      app: 'rider', theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg);padding-bottom:96px">' +
        bar('Účet', null) +
        '<div class="s-pad">' +
        '  <div class="card spread">' +
        '    <div class="spread" style="gap:14px;justify-content:flex-start">' + FOXI.avatar(r.name, 56, true) +
        '      <div><div class="row-title" style="font-size:18px">' + r.name + '</div>' +
        '        <div class="rating" style="margin-top:2px">' + FOXI.ui.stars(r.rating, 13) + ' <span class="tnum" style="color:var(--accent);font-weight:700">' + r.rating.toFixed(2).replace('.', ',') + '★</span></div>' +
        '        <div class="row-sub" style="margin-top:2px">' + r.phone + '</div></div>' +
        '    </div>' +
        '    <button class="iconbtn ghost" onclick="FOXI.toast(\'Upraviť profil\')">' + FOXI.icon('edit', 20) + '</button>' +
        '  </div>' +
        '  <div class="list" style="margin-top:16px">' +
        row('card', 'Spôsoby platby', null, "FOXI.go('payment-method')") +
        row('pin', 'Uložené miesta', null, "FOXI.go('saved-places')") +
        row('shield', 'Bezpečnostné kontakty', null, "FOXI.go('safety-toolkit')") +
        row('calendar', 'Naplánované jazdy', null, "FOXI.go('rider-activity')") +
        row('gift', 'Promo akcie', null, "FOXI.go('promo-code')") +
        row('globe', 'Jazyk', null, "FOXI.go('language-switch')") +
        '  </div>' +
        '  <div class="list" style="margin-top:14px">' +
        row('help', 'Pomoc', null, "FOXI.go('support')") +
        row('phone', 'Zavolať dispečera', null, "FOXI.go('phone-fallback')") +
        row('settings', 'Nastavenia', null, "FOXI.go('settings')") +
        '  </div>' +
        '  <button class="btn btn-ghost" style="margin-top:14px;color:var(--text-3)" onclick="FOXI.toast(\'Odhlásené\');FOXI.after2(function(){FOXI.go(\'splash\')},600)">' + FOXI.icon('logout', 18) + ' Odhlásiť</button>' +
        '</div></div>' +
        FOXI.ui.tabbar('account'),
    };
  });

  /* ---------------- NO DRIVERS ---------------- */
  FOXI.screen('no-drivers', function () {
    return {
      app: 'rider', theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Žiadne auto', 'rider-home') +
        '<div class="s-pad">' +
        '  <div class="empty">' +
        '    <div class="mascot-circle"><img src="/images/foxi-mascot-opt.jpg" alt=""/></div>' +
        '    <div class="t">Teraz nie je voľné žiadne FOXI auto v Trebišove</div>' +
        '    <div class="d">Cez telefón vás spojíme s miestnym dispečerom — často nájde auto rýchlejšie.</div>' +
        '  </div>' +
        '  <button class="btn btn-primary" style="margin-top:8px" onclick="FOXI.go(\'phone-fallback\')">' + FOXI.icon('phone', 20) + ' Zavolať dispečera</button>' +
        '  <button class="btn btn-secondary" style="margin-top:10px" onclick="FOXI.toast(\'Upozorníme vás, keď bude auto voľné\',\'success\');FOXI.after2(function(){FOXI.go(\'rider-home\')},700)">' + FOXI.icon('clock', 18) + ' Upozorniť, keď bude voľné</button>' +
        '  <a class="truststrip" style="justify-content:center;margin-top:14px" onclick="FOXI.go(\'vehicle-select\')">' + FOXI.icon('van', 16) + ' Skúsiť FOXI Van (9 min)</a>' +
        '</div></div>',
    };
  });

  /* ---------------- CHAT ---------------- */
  FOXI.screen('chat', function () {
    var dr = D.driver;
    function bubbleIn(txt) {
      return '<div style="align-self:flex-start;max-width:78%;background:var(--surface-3);color:var(--text);padding:11px 14px;border-radius:16px 16px 16px 4px;font-size:15px">' + txt + '</div>';
    }
    function bubbleOut(txt) {
      return '<div style="align-self:flex-end;max-width:78%;background:var(--purple);color:#fff;padding:11px 14px;border-radius:16px 16px 4px 16px;font-size:15px">' + txt + '</div>';
    }
    var replies = ['Som pri vchode', 'Idem o 2 min', 'Počkajte prosím', 'Ktoré auto ste?'];
    return {
      app: 'rider', theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg);display:flex;flex-direction:column">' +
        bar('Správa vodičovi', 'driver-matched') +
        '<div class="s-pad" style="flex:1;display:flex;flex-direction:column;gap:10px">' +
        bubbleIn('Dobrý deň, som ' + dr.first + '. Som na ceste, prídem o pár minút.') +
        bubbleOut('Super, čakám pri vchode 👍') +
        bubbleIn('Som ' + dr.color + ' ' + dr.car + ', ' + dr.plate + '.') +
        '</div>' +
        '<div class="s-pad" style="padding-bottom:14px">' +
        '  <div class="chips" style="flex-wrap:wrap;margin-bottom:12px">' +
        replies.map(function (q) {
          return '<button class="chip" onclick="FOXI.toast(\'Odoslané: ' + q + '\',\'success\')">' + q + '</button>';
        }).join('') +
        '  </div>' +
        '  <div class="search lg"><input placeholder="Napíšte správu…" /><button class="iconbtn" style="background:var(--accent);color:#fff" onclick="FOXI.toast(\'Správa odoslaná\',\'success\')">' + FOXI.icon('chevron', 20) + '</button></div>' +
        '</div></div>',
    };
  });

  /* ---------------- PROMO CODE ---------------- */
  FOXI.screen('promo-code', function () {
    return {
      app: 'rider', theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Promo kód', 'vehicle-select') +
        '<div class="s-pad">' +
        '  <div class="field-label">Zadajte kód</div>' +
        '  <input class="field" placeholder="Zadajte kód" style="text-transform:uppercase" />' +
        '  <button class="btn btn-primary" style="margin-top:14px" onclick="FOXI.toast(\'FOXI10 použitý — €0,70 zľava\',\'success\');FOXI.after2(function(){FOXI.back()},700)">Použiť</button>' +
        '  <div class="overline" style="margin:24px 0 8px">Dostupné akcie</div>' +
        '  <div class="card spread">' +
        '    <div class="spread" style="gap:14px;justify-content:flex-start"><div class="row-ico purple">' + FOXI.icon('gift', 20) + '</div>' +
        '      <div><div class="row-title">FOXI10</div><div class="row-sub">' + FOXI.money(0.70) + ' z ďalších 3 jázd · do 30. jún</div></div></div>' +
        '    <span class="badge badge-green">' + FOXI.icon('check', 14) + ' Aktívne</span>' +
        '  </div>' +
        '</div></div>',
    };
  });

  /* ---------------- SCHEDULE RIDE ---------------- */
  FOXI.screen('schedule-ride', function () {
    return {
      app: 'rider', theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Naplánovať na neskôr', 'rider-home') +
        '<div class="s-pad">' +
        '  <div class="stops"><div class="dotline"></div>' +
        '    <div class="stop"><span class="stop-dot from"></span><input value="' + D.pickup.address + '" /></div>' +
        '    <div class="stop"><span class="stop-dot to"></span><input value="' + D.dropoff.label + '" /></div>' +
        '  </div>' +
        '  <div class="overline" style="margin:20px 0 8px">Kedy</div>' +
        '  <div class="chips">' +
        '    <button class="chip chip--active">' + FOXI.icon('calendar', 16) + ' So 7. jún</button>' +
        '    <button class="chip chip--active">' + FOXI.icon('clock', 16) + ' 06:30</button>' +
        '  </div>' +
        '  <div class="overline" style="margin:20px 0 8px">Vozidlo</div>' +
        '  <div class="list"><div class="row tap" onclick="FOXI.go(\'vehicle-select\')"><div class="row-ico">' + FOXI.icon('car', 20) + '</div><div class="row-main"><div class="row-title">FOXI Standard</div><div class="row-sub">Každodenné jazdy · 4 miesta</div></div><span class="row-chev">' + FOXI.icon('chevron', 18) + '</span></div></div>' +
        '  <div class="nosurge" style="width:100%;justify-content:center;margin-top:16px">' + FOXI.icon('shieldcheck', 16) + ' Naplánované jazdy majú pevnú cenu bez surge.</div>' +
        '  <button class="btn btn-primary" style="margin-top:18px" onclick="FOXI.toast(\'Jazda naplánovaná\',\'success\');FOXI.after2(function(){FOXI.go(\'rider-activity\')},700)">Naplánovať · ' + FOXI.money(D.trip.quoteLow) + '–' + Number(D.trip.quoteHigh).toFixed(2).replace('.', ',') + '</button>' +
        '</div></div>',
    };
  });

  /* ---------------- SAVED PLACES ---------------- */
  FOXI.screen('saved-places', function () {
    function place(icon, title, addr) {
      return '<div class="row tap" onclick="FOXI.go(\'search-destination\')">' +
        '<div class="row-ico purple">' + FOXI.icon(icon, 20) + '</div>' +
        '<div class="row-main"><div class="row-title">' + title + '</div><div class="row-sub">' + addr + '</div></div>' +
        '<button class="iconbtn ghost" onclick="event.stopPropagation();FOXI.toast(\'Upraviť ' + title + '\')">' + FOXI.icon('edit', 18) + '</button></div>';
    }
    return {
      app: 'rider', theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Uložené miesta', 'account') +
        '<div class="s-pad">' +
        '  <div class="list">' +
        place('home', 'Domov', 'Družstevná 5, Trebišov') +
        place('briefcase', 'Práca', 'Nemocnica Trebišov, SNP 1079') +
        '  </div>' +
        '  <button class="btn btn-primary" style="margin-top:18px" onclick="FOXI.toast(\'Pridať miesto (demo)\')">' + FOXI.icon('plus', 18) + ' Pridať miesto</button>' +
        '</div></div>',
    };
  });

  /* ---------------- SETTINGS ---------------- */
  FOXI.screen('settings', function () {
    function tgRow(title, sub, on) {
      return '<label class="row" style="cursor:pointer"><div class="row-main"><div class="row-title">' + title + '</div>' +
        (sub ? '<div class="row-sub">' + sub + '</div>' : '') + '</div>' + toggle(on) + '</label>';
    }
    return {
      app: 'rider', theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Nastavenia', 'account') +
        '<div class="s-pad">' +
        '  <div class="overline" style="margin:6px 0 8px">Notifikácie</div>' +
        '  <div class="list">' +
        tgRow('Push notifikácie', 'Stav jazdy a vodič', true) +
        tgRow('SMS', 'Potvrdenia cez SMS', false) +
        tgRow('E-mail', 'Účtenky a novinky', false) +
        tgRow('Marketing', 'Akcie a zľavy', false) +
        '  </div>' +
        '  <div class="overline" style="margin:22px 0 8px">Dáta a súkromie</div>' +
        '  <div class="list">' +
        row('doc', 'Stiahnuť moje dáta', null, "FOXI.toast('Pripravujeme export…')") +
        '    <div class="row tap" onclick="FOXI.toast(\'Zmazanie účtu (demo)\',\'error\')"><div class="row-ico">' + FOXI.icon('close', 20) + '</div><div class="row-main"><div class="row-title" style="color:var(--error)">Zmazať účet</div></div><span class="row-chev">' + FOXI.icon('chevron', 18) + '</span></div>' +
        '  </div>' +
        '  <p class="muted" style="text-align:center;margin-top:22px;font-size:13px">FOXI TAXI · App verzia 1.0</p>' +
        '  <button class="btn btn-primary" style="margin-top:14px" onclick="FOXI.toast(\'Nastavenia uložené\',\'success\');FOXI.after2(function(){FOXI.back()},600)">Hotovo</button>' +
        '</div></div>',
      onMount: wireToggles,
    };
  });

  /* ---------------- SUPPORT ---------------- */
  FOXI.screen('support', function () {
    var topics = [
      { i: 'card', t: 'Platby' },
      { i: 'shield', t: 'Bezpečnosť' },
      { i: 'briefcase', t: 'Stratená vec' },
      { i: 'clock', t: 'Minulá jazda' },
      { i: 'user', t: 'Účet' },
    ];
    return {
      app: 'rider', theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Pomoc', 'account') +
        '<div class="s-pad">' +
        '  <div class="search lg"><span>' + FOXI.icon('search', 20) + '</span><input placeholder="Ako vám pomôžeme?" /></div>' +
        '  <div class="overline" style="margin:22px 0 8px">Témy</div>' +
        '  <div class="chips" style="flex-wrap:wrap">' +
        topics.map(function (x) {
          return '<button class="chip" onclick="FOXI.toast(\'' + x.t + '\')">' + FOXI.icon(x.i, 16) + ' ' + x.t + '</button>';
        }).join('') +
        '  </div>' +
        '  <div class="card" style="margin-top:22px;background:linear-gradient(160deg,#5a57a5,#463794);color:#fff">' +
        '    <div class="spread" style="gap:14px;justify-content:flex-start"><span class="iconbtn on-map" style="background:rgba(255,255,255,.18);color:#fff;flex:none">' + FOXI.icon('phone', 22) + '</span>' +
        '      <div><div class="row-title" style="color:#fff">Zavolať miestnemu dispečerovi</div><div class="row-sub" style="color:rgba(255,255,255,.8)">' + D.dispatcher.operator + ' · ' + D.dispatcher.area + ' · 24/7</div></div></div>' +
        '  </div>' +
        '  <button class="btn btn-primary" style="margin-top:16px" onclick="FOXI.go(\'phone-fallback\')">' + FOXI.icon('phone', 20) + ' Zavolať dispečera</button>' +
        '</div></div>',
    };
  });
})();
