/* ============================================================
   FOXI TAXI — Driver app (DARK) secondary & edge screens
   earnings · cashout · profile · account-health · documents ·
   stats · support · chat · going-offline · declined ·
   no-requests · noshow · rider-cancelled
   ============================================================ */
(function () {
  var D = FOXI.data;
  var E = D.earnings;
  var DR = D.driver;

  /* small dark helpers (match shared.js style, scoped here) */
  function eur(n) { return FOXI.money(n); }
  function payTag(pay) {
    return '<span class="badge ' + (pay === 'cash' ? 'badge-orange' : 'badge-purple') + '" style="height:20px;font-size:11px">' +
      FOXI.icon(pay === 'cash' ? 'cash' : 'card', 12) + ' ' + (pay === 'cash' ? 'Hotovosť' : 'Karta') + '</span>';
  }
  function healthRow(title, ok, sub) {
    return '<div class="row"><div class="row-ico ' + (ok ? '' : 'purple') + '" style="color:' + (ok ? 'var(--success)' : 'var(--warning)') + '">' +
      FOXI.icon(ok ? 'check' : 'alert', 20) + '</div>' +
      '<div class="row-main"><div class="row-title">' + title + '</div>' + (sub ? '<div class="row-sub">' + sub + '</div>' : '') + '</div>' +
      '<span class="badge ' + (ok ? 'badge-green' : 'badge-orange') + '">' + (ok ? 'OK' : 'Pozor') + '</span></div>';
  }
  function docRow(title, sub, status, ok) {
    return '<div class="row' + (ok ? '' : ' tap') + '"' + (ok ? '' : ' onclick="FOXI.go(\'driver-documents\')"') + '>' +
      '<div class="row-ico">' + FOXI.icon('doc', 20) + '</div>' +
      '<div class="row-main"><div class="row-title">' + title + '</div><div class="row-sub">' + sub + '</div></div>' +
      '<span class="badge ' + (ok ? 'badge-green' : 'badge-orange') + '">' + status + '</span></div>';
  }

  /* ---------------- DRIVER EARNINGS ---------------- */
  FOXI.screen('driver-earnings', function () {
    var b = E.breakdown;
    var recent = E.recent.map(function (r, i) {
      return '<div class="row tap" onclick="FOXI.go(\'driver-trip-receipt\',{i:' + i + '})">' +
        '<div class="row-ico">' + FOXI.icon('clock', 18) + '</div>' +
        '<div class="row-main"><div class="row-title">' + r.from + ' → ' + r.to + '</div>' +
        '<div class="row-sub">' + r.time + ' · ' + (r.pay === 'cash' ? 'Hotovosť' : 'Karta') + '</div></div>' +
        '<div class="row-end"><span class="veh-price" style="color:var(--orange);font-weight:800">' + eur(r.net) + '</span></div></div>';
    }).join('');
    return {
      theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Zárobky', 'driver-home', true) +
        '<div class="s-pad stack">' +
        '  <div class="segmented">' +
        '    <button onclick="FOXI.toast(\'Dnes: ' + eur(E.todayTotal).replace(/'/g, '') + '\')">Dnes</button>' +
        '    <button class="active">Týždeň</button>' +
        '    <button onclick="FOXI.toast(\'História jázd\')">História</button>' +
        '  </div>' +
        '  <div class="center" style="padding:6px 0 2px">' +
        '    <div class="overline">Tento týždeň</div>' +
        '    <h2 class="h-title" style="color:var(--orange);font-size:40px;margin-top:2px">' + eur(E.weekTotal) + '</h2>' +
        '    <div class="muted" style="margin-top:4px">' + E.weekTrips + ' jázd · ' + E.weekHours + ' h online</div>' +
        '  </div>' +
        '  <div class="card">' +
        '    <div class="spread"><div><div class="overline">Dostupné na výber</div>' +
        '      <div class="h-title" style="font-size:30px;margin-top:2px">' + eur(E.available) + '</div></div>' +
        '      <span class="badge badge-green">' + FOXI.icon('wallet', 14) + ' Pripravené</span></div>' +
        '    <button class="btn btn-primary" style="margin-top:14px" onclick="FOXI.go(\'driver-cashout\')">' + FOXI.icon('zap', 18) + ' VYBRAŤ PENIAZE</button>' +
        '    <p class="muted" style="font-size:12.5px;margin-top:10px;text-align:center">Okamžitá výplata zdarma · ostávajú ' + E.instantFree + '</p>' +
        '  </div>' +
        '  <div class="card">' +
        '    <div class="overline" style="margin-bottom:6px">Rozpis týždňa</div>' +
        '    <div class="fareline"><span class="lbl">Jazdy</span><span class="amt">' + eur(b.fares) + '</span></div>' +
        '    <div class="fareline"><span class="lbl">Prepitné</span><span class="amt">' + eur(b.tips) + '</span></div>' +
        '    <div class="fareline"><span class="lbl">Bonusy</span><span class="amt">' + eur(b.bonuses) + '</span></div>' +
        '    <div class="fareline"><span class="lbl">Čakanie / Storno</span><span class="amt">' + eur(b.waiting) + '</span></div>' +
        '    <div class="fareline"><span class="lbl" style="color:#ff7a7d">− FOXI provízia (' + E.commissionRate + '%)</span><span class="amt" style="color:#ff7a7d">−' + eur(b.commission) + '</span></div>' +
        '    <div class="fareline total"><span class="lbl">Čistý zárobok</span><span class="amt" style="color:var(--orange)">' + eur(E.weekTotal) + '</span></div>' +
        '  </div>' +
        '  <div class="card" style="background:rgba(90,87,165,.28);box-shadow:inset 0 0 0 1.5px var(--purple)">' +
        '    <div class="spread"><div class="row-title">Vaša FOXI provízia</div><span class="badge badge-purple">pevných 12%</span></div>' +
        '    <p class="muted" style="font-size:13px;margin-top:8px;color:#d3d1f5">Pevných 12%, navždy. Porovnaj: Bolt 15–20%+, Uber províziu nezverejňuje.</p>' +
        '    <a style="display:inline-block;margin-top:8px;color:#d3d1f5;font-weight:600" onclick="FOXI.go(\'driver-support\')">Ako fungujú poplatky</a>' +
        '  </div>' +
        '  <div class="overline" style="margin-top:4px">Posledné jazdy</div>' +
        '  <div class="list">' + recent + '</div>' +
        '  <div class="truststrip" style="justify-content:center;margin-top:6px">' + FOXI.icon('calendar', 16) + ' Automatická výplata každý pondelok</div>' +
        '</div></div>',
    };
  });

  /* ---------------- DRIVER CASHOUT ---------------- */
  FOXI.screen('driver-cashout', function () {
    return {
      theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Okamžitý výber', 'driver-earnings', true) +
        '<div class="s-pad stack">' +
        '  <div class="card center">' +
        '    <div class="overline">Dostupné</div>' +
        '    <div class="h-title" style="font-size:38px;color:var(--orange);margin-top:2px">' + eur(E.available) + '</div>' +
        '  </div>' +
        '  <div class="field"><div class="field-label">Suma na výber</div>' +
        '    <div class="search lg" style="font-weight:700;font-size:22px">€118,20</div></div>' +
        '  <div class="chips">' +
        '    <button class="chip" onclick="FOXI.toast(\'€20\')">€20</button>' +
        '    <button class="chip" onclick="FOXI.toast(\'€50\')">€50</button>' +
        '    <button class="chip chip--active" onclick="FOXI.toast(\'Všetko\')">Všetko</button>' +
        '  </div>' +
        '  <div class="list">' +
        '    <div class="row tap" onclick="FOXI.toast(\'Zmeniť účet\')"><div class="row-ico purple">' + FOXI.icon('card', 20) + '</div>' +
        '      <div class="row-main"><div class="row-title">Na VÚB •• 4471</div><div class="row-sub">Pripísané do pár minút</div></div>' +
        '      <span class="row-chev">' + FOXI.icon('chevron', 18) + '</span></div>' +
        '  </div>' +
        '  <div class="card flat spread"><div class="row-sub">' + FOXI.icon('zap', 16) + ' Okamžitý výber</div>' +
        '    <span class="badge badge-green">Zdarma · ostávajú ' + E.instantFree + ' zo ' + E.instantTotal + '</span></div>' +
        '  <button class="btn btn-primary" id="cash-cta">' + FOXI.icon('zap', 18) + ' VYBRAŤ ' + eur(E.available) + '</button>' +
        '  <p class="muted" style="font-size:12.5px;text-align:center">Radšej týždenne? Automaticky každý pondelok, vždy zdarma.</p>' +
        '</div></div>',
      onMount: function (el) {
        el.querySelector('#cash-cta').addEventListener('click', function () {
          FOXI.toast('Posielame! Zvyčajne do 5 minút 🦊', 'success');
          FOXI.after2(function () { FOXI.go('driver-earnings'); }, 1400);
        });
      },
    };
  });

  /* ---------------- DRIVER PROFILE ---------------- */
  FOXI.screen('driver-profile', function () {
    return {
      theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Profil', 'driver-home', true) +
        '<div class="s-pad stack">' +
        '  <div class="card">' +
        '    <div class="drivercard">' + FOXI.avatar(DR.name, 56, true) +
        '      <div class="info"><div class="name">' + DR.name + '</div>' +
        '        <div style="margin-top:4px"><span class="badge badge-purple">' + FOXI.icon('shieldcheck', 14) + ' Vodič v ' + DR.operator + ' · Trebišov</span></div></div></div>' +
        '    <div class="truststrip" style="margin-top:14px">' + FOXI.icon('star', 16) + ' 4,86★ <span class="dotsep"></span> 1 248 jázd <span class="dotsep"></span> Člen od 2024</div>' +
        '  </div>' +
        '  <div class="card flat tap" onclick="FOXI.go(\'driver-account-health\')" style="cursor:pointer">' +
        '    <div class="spread"><div><div class="overline">Stav účtu</div><div class="row-title" style="color:var(--success);margin-top:2px">' + FOXI.icon('shieldcheck', 16) + ' Dobrý stav</div></div>' +
        '      <span class="row-chev">' + FOXI.icon('chevron', 18) + '</span></div>' +
        '  </div>' +
        '  <div class="list">' +
        row('star', 'Štatistiky a hodnotenia', null, "FOXI.go('driver-stats')") +
        row('doc', 'Vozidlo a doklady', null, "FOXI.go('driver-documents')") +
        row('calendar', 'Rozvrh a dostupnosť', null, "FOXI.toast('Rozvrh — čoskoro')") +
        row('wallet', 'Nastavenia výplaty', null, "FOXI.toast('Nastavenia výplaty')") +
        row('users', 'Operátor (' + DR.operator + ')', null, "FOXI.toast('RS Dolina · Trebišov')") +
        row('globe', 'Jazyk', null, "FOXI.go('language-switch')") +
        row('help', 'Podpora', null, "FOXI.go('driver-support')") +
        '  </div>' +
        '  <button class="btn btn-secondary" onclick="FOXI.go(\'splash\')">' + FOXI.icon('logout', 18) + ' Odhlásiť</button>' +
        '</div></div>',
    };
  });

  /* ---------------- DRIVER ACCOUNT HEALTH ---------------- */
  FOXI.screen('driver-account-health', function () {
    return {
      theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Stav účtu', 'driver-profile', true) +
        '<div class="s-pad stack">' +
        '  <div class="card center">' +
        '    <div class="mascot-circle" style="width:64px;height:64px;margin:0 auto;background:rgba(31,170,107,.16);display:flex;align-items:center;justify-content:center;color:var(--success)">' + FOXI.icon('shieldcheck', 32) + '</div>' +
        '    <h2 class="h-title" style="color:var(--success);margin-top:12px">Dobrý stav</h2>' +
        '    <div class="muted" style="margin-top:4px">Všetko v poriadku. Jazdite ďalej 🦊</div>' +
        '  </div>' +
        '  <div class="card">' +
        '    <div class="overline" style="margin-bottom:4px">Zdravie účtu</div>' +
        '    <div class="list" style="box-shadow:none">' +
        healthRow('Hodnotenia', true) +
        healthRow('Doklady', true) +
        healthRow('Storná', true) +
        healthRow('Bezpečnosť', true) +
        '    </div>' +
        '  </div>' +
        '  <div class="card tap" onclick="FOXI.go(\'driver-documents\')" style="background:var(--orange-tint);cursor:pointer">' +
        '    <div class="spread"><div style="display:flex;gap:10px;align-items:flex-start"><span style="color:var(--orange-dark)">' + FOXI.icon('alert', 20) + '</span>' +
        '      <div><div class="row-title" style="color:var(--orange-dark)">1 doklad vyprší o 14 dní</div>' +
        '        <div class="row-sub" style="color:var(--orange-dark)">Technický preukaz · Obnoviť teraz</div></div></div>' +
        '      <span style="color:var(--orange-dark)">' + FOXI.icon('chevron', 18) + '</span></div>' +
        '  </div>' +
        '  <div class="card flat"><div class="overline">Záznam problémov</div>' +
        '    <div class="row-title" style="margin-top:6px">0 aktívnych problémov</div>' +
        '    <div class="row-sub">Problémy automaticky miznú po 90 dňoch.</div></div>' +
        '  <div class="card"><div class="overline">Nesúhlasíte?</div>' +
        '    <p class="muted" style="font-size:13.5px;margin-top:8px">Otvorte prípad — reálny človek odpovie do 24 h a dostanete číslo prípadu. Aj ' + DR.operator + ' sa za vás môže zaručiť.</p>' +
        '    <button class="btn btn-secondary" style="margin-top:12px" onclick="FOXI.go(\'driver-support\')">' + FOXI.icon('doc', 18) + ' Otvoriť prípad</button></div>' +
        '  <div class="card" style="background:rgba(90,87,165,.28);box-shadow:inset 0 0 0 1.5px var(--purple)">' +
        '    <div class="row-title" style="color:#d3d1f5">' + FOXI.icon('shield', 18) + ' Náš sľub</div>' +
        '    <p style="font-size:14px;margin-top:8px;color:#d3d1f5;line-height:1.5">Nikdy vás nedeaktivujeme bez upozornenia a šance reagovať. Vždy dostanete čas a reálneho človeka.</p></div>' +
        '</div></div>',
    };
  });

  /* ---------------- DRIVER DOCUMENTS ---------------- */
  FOXI.screen('driver-documents', function () {
    return {
      theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Vozidlo a doklady', 'driver-profile', true) +
        '<div class="s-pad stack">' +
        '  <div class="card">' +
        '    <div class="spread"><div><div class="row-title">' + DR.car + '</div>' +
        '      <div class="row-sub">' + DR.plate + ' · ' + DR.color + ' · 2021</div></div>' +
        '      <button class="chip" onclick="FOXI.toast(\'Upraviť vozidlo\')">' + FOXI.icon('edit', 16) + ' Upraviť</button></div>' +
        '  </div>' +
        '  <div class="overline">Doklady</div>' +
        '  <div class="list">' +
        docRow('Vodičský preukaz', 'Platný do 2029', 'OK', true) +
        docRow('Technický preukaz', 'Vyprší o 14 dní', 'Obnoviť', false) +
        docRow('Taxi koncesia', 'Platná', 'OK', true) +
        docRow('PZP poistenie', 'Platné do 12/2026', 'OK', true) +
        docRow('Previerka', 'Overená', 'OK', true) +
        docRow('Profilová fotka', 'Schválená', 'OK', true) +
        '  </div>' +
        '  <button class="btn btn-primary" onclick="FOXI.toast(\'Otvorenie obnovy dokladu…\')">' + FOXI.icon('doc', 18) + ' Obnoviť technický preukaz</button>' +
        '  <div class="truststrip" style="justify-content:center">' + FOXI.icon('users', 16) + ' Niektoré doklady spravuje ' + DR.operator + '</div>' +
        '</div></div>',
    };
  });

  /* ---------------- DRIVER STATS ---------------- */
  FOXI.screen('driver-stats', function () {
    return {
      theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Štatistiky a hodnotenia', 'driver-profile', true) +
        '<div class="s-pad stack">' +
        '  <div class="card center">' +
        '    <div class="h-title" style="font-size:42px">4,86<span style="color:var(--orange);font-size:30px"> ★</span></div>' +
        '    <div style="margin-top:6px">' + FOXI.ui.stars(4.86, 18) + '</div>' +
        '    <p class="muted" style="font-size:13px;margin-top:10px">Najnižšie hodnotenie týždňa sa automaticky zahodí.</p>' +
        '  </div>' +
        '  <div class="card"><div class="overline" style="margin-bottom:8px">Najčastejšie pochvaly</div>' +
        '    <div class="chips" style="flex-wrap:wrap">' +
        '      <span class="chip chip--active">Priateľský ×84</span>' +
        '      <span class="chip chip--active">Čisté auto ×60</span>' +
        '      <span class="chip chip--active">Skvelá navigácia ×41</span></div></div>' +
        '  <div class="card" style="background:var(--orange-tint)">' +
        '    <div class="spread"><div class="row-title" style="color:var(--orange-dark)">Miera prijatia</div>' +
        '      <div class="h-title" style="color:var(--orange-dark);font-size:26px">92%</div></div>' +
        '    <p style="font-size:13.5px;margin-top:6px;color:var(--orange-dark);line-height:1.5">Len informatívne. NIKDY neovplyvní váš účet ani ponuky jázd — odmietnuté jazdy vás nepoškodia.</p></div>' +
        '  <div class="card flat"><div class="spread"><div class="row-title">Miera storien</div>' +
        '    <span class="badge badge-green">1% · zdravé</span></div></div>' +
        '  <button class="btn btn-primary" onclick="FOXI.go(\'driver-account-health\')">' + FOXI.icon('shieldcheck', 18) + ' Zobraziť stav účtu</button>' +
        '</div></div>',
    };
  });

  /* ---------------- DRIVER SUPPORT ---------------- */
  FOXI.screen('driver-support', function () {
    return {
      theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Podpora vodiča', 'driver-home', true) +
        '<div class="s-pad stack">' +
        '  <div class="card flat spread">' +
        '    <div><div class="row-title">' + FOXI.icon('users', 16) + ' ' + D.dispatcher.operator + ' dispečer</div>' +
        '      <div class="row-sub">Zvyčajne odpovie do pár minút</div></div>' +
        '    <span class="online-pill on"><span class="dot"></span> Online</span></div>' +
        '  <div class="card">' +
        '    <div class="card flat" style="background:var(--surface-2)"><div class="row-sub">Dispečer · 14:18</div>' +
        '      <div style="margin-top:4px">Dobrý deň Marek, ako vám pomôžem?</div></div>' +
        '    <label class="card flat spread" style="cursor:pointer;margin-top:10px"><div><div class="row-title">Eskalovať na FOXI</div>' +
        '      <div class="row-sub">Ak to dispečer nevyrieši</div></div>' + toggle(false) + '</label>' +
        '  </div>' +
        '  <div class="overline">Otvorené prípady</div>' +
        '  <div class="list"><div class="row tap" onclick="FOXI.toast(\'Prípad #4471 · Prebieha\')">' +
        '    <div class="row-ico purple">' + FOXI.icon('doc', 20) + '</div>' +
        '    <div class="row-main"><div class="row-title">Prípad #4471 · Posúdenie ceny</div>' +
        '      <div class="row-sub">Prebieha · odpoveď do zajtra 14:00</div></div>' +
        '    <span class="badge badge-orange">Prebieha</span></div></div>' +
        '  <div class="overline">Rýchle témy</div>' +
        '  <div class="chips" style="flex-wrap:wrap">' +
        '    <button class="chip" onclick="FOXI.toast(\'Problém s cenou\')">Problém s cenou</button>' +
        '    <button class="chip" onclick="FOXI.toast(\'Zákazník\')">Zákazník</button>' +
        '    <button class="chip" onclick="FOXI.toast(\'Účet / stav\')">Účet/stav</button>' +
        '    <button class="chip" onclick="FOXI.toast(\'Výplata\')">Výplata</button>' +
        '    <button class="chip" onclick="FOXI.toast(\'Chyba appky\')">Chyba appky</button>' +
        '  </div>' +
        '  <button class="btn btn-primary" onclick="FOXI.toast(\'Otvárame nový prípad…\',\'success\')">' + FOXI.icon('plus', 18) + ' Otvoriť nový prípad</button>' +
        '  <div class="card" style="background:rgba(90,87,165,.28);box-shadow:inset 0 0 0 1.5px var(--purple)">' +
        '    <div class="row-title" style="color:#d3d1f5">' + FOXI.icon('shieldcheck', 18) + ' Vždy reálny človek</div>' +
        '    <p style="font-size:13.5px;margin-top:6px;color:#d3d1f5">Žiadne boty v slučke. Dostanete číslo prípadu a odpoveď od človeka.</p></div>' +
        '</div></div>',
      onMount: wireToggles,
    };
  });

  /* ---------------- DRIVER CHAT (to rider) ---------------- */
  FOXI.screen('driver-chat', function () {
    return {
      theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Správa zákazníkovi', 'driver-nav-pickup', true) +
        '<div class="s-pad stack">' +
        '  <div class="card flat spread"><div><div class="row-title">' + D.rider.first + ' · zákazník</div>' +
        '    <div class="row-sub">' + FOXI.icon('shield', 14) + ' Číslo je skryté — voláte cez FOXI</div></div>' +
        '    <button class="circle-btn" onclick="FOXI.toast(\'Volám cez maskované číslo…\')">' + FOXI.icon('phone', 18) + '</button></div>' +
        '  <div class="stack">' +
        '    <div class="card flat" style="background:var(--surface-2);align-self:flex-start;max-width:80%">Som pri vchode, modrá bunda 🙂</div>' +
        '    <div class="card flat" style="background:var(--purple);color:#fff;align-self:flex-end;max-width:80%;margin-left:auto">Super, idem k vám o 2 minúty.</div>' +
        '  </div>' +
        '  <div class="overline">Rýchle odpovede</div>' +
        '  <div class="chips" style="flex-wrap:wrap">' +
        '    <button class="chip" onclick="FOXI.toast(\'Odoslané: Som pri vás\')">Som pri vás</button>' +
        '    <button class="chip" onclick="FOXI.toast(\'Odoslané: Počkajte prosím\')">Počkajte prosím</button>' +
        '    <button class="chip" onclick="FOXI.toast(\'Odoslané: Kde presne ste?\')">Kde presne ste?</button>' +
        '    <button class="chip" onclick="FOXI.toast(\'Odoslané: Idem o 2 min\')">Idem o 2 min</button>' +
        '  </div>' +
        '  <div class="spread" style="gap:10px">' +
        '    <div class="search" style="flex:1">' + FOXI.icon('msg', 18) + '<span style="color:var(--text-4)">Napíšte správu…</span></div>' +
        '    <button class="btn btn-primary" style="width:auto;padding:0 18px" onclick="FOXI.toast(\'Správa odoslaná\',\'success\')">' + FOXI.icon('nav', 18) + '</button>' +
        '  </div>' +
        '  <div class="truststrip" style="justify-content:center">' + FOXI.icon('shieldcheck', 16) + ' Vaše aj zákazníkovo číslo zostáva skryté</div>' +
        '</div></div>',
    };
  });

  /* ---------------- DRIVER GOING OFFLINE ---------------- */
  FOXI.screen('driver-going-offline', function () {
    return {
      theme: 'dark',
      html:
        '<div class="screen" style="background:rgba(20,20,34,.6);justify-content:flex-end">' +
        '<div class="sheet" style="background:var(--surface)">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="sheet-title">Prejsť do offline?</div>' +
        '  <div class="card flat" style="margin-top:14px">' +
        '    <div class="overline">Dnešná smena</div>' +
        '    <div class="row-title" style="font-size:20px;margin-top:4px">' + eur(E.todayTotal) + ' · ' + E.todayTrips + ' jázd</div>' +
        '    <div class="row-sub" style="margin-top:4px">' + E.todayHours + ' · 4,86★ · najlepší deň týždňa 🦊</div>' +
        '  </div>' +
        '  <div class="stack" style="margin-top:18px">' +
        '    <button class="btn btn-secondary" onclick="FOXI.go(\'driver-cashout\')">' + FOXI.icon('wallet', 18) + ' Vybrať ' + eur(E.available) + '</button>' +
        '    <button class="btn btn-primary" onclick="FOXI.go(\'driver-home\')">' + FOXI.icon('power', 18) + ' Prejsť do offline</button>' +
        '    <button class="btn btn-ghost" onclick="FOXI.back()">Späť</button>' +
        '  </div>' +
        '</div></div>',
    };
  });

  /* ---------------- DRIVER DECLINED (offer) ---------------- */
  FOXI.screen('driver-declined', function () {
    return {
      theme: 'dark',
      html:
        '<div class="screen" style="background:var(--bg);align-items:center;justify-content:center;text-align:center">' +
        '  <div class="empty">' +
        '    <div style="color:var(--success)">' + FOXI.icon('check', 44) + '</div>' +
        '    <div class="t">Odmietnuté</div>' +
        '    <div class="d">Neovplyvní to vašu akceptáciu ani budúce ponuky.</div>' +
        '  </div>' +
        '</div>',
      onMount: function () {
        FOXI.toast('Odmietnuté. Neovplyvní to vašu akceptáciu ani budúce ponuky.');
        FOXI.after2(function () { FOXI.go('driver-online-idle'); }, 1400);
      },
    };
  });

  /* ---------------- DRIVER NO REQUESTS ---------------- */
  FOXI.screen('driver-no-requests', function () {
    return {
      theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Online · čaká sa', 'driver-online-idle', true) +
        '<div class="s-pad">' +
        '  <div class="empty" style="margin-top:60px">' +
        '    <div class="mascot-circle" style="width:96px;height:96px;margin:0 auto"><img src="/images/foxi-mascot-opt.jpg" alt=""/></div>' +
        '    <div class="t">Teraz je ticho.</div>' +
        '    <div class="d">Ostaňte online — ponuka môže prísť každú chvíľu.</div>' +
        '  </div>' +
        '  <div class="card" style="margin-top:10px;background:rgba(90,87,165,.28);box-shadow:inset 0 0 0 1.5px var(--purple)">' +
        '    <div class="spread"><div style="display:flex;gap:10px;align-items:center"><span style="color:#d3d1f5">' + FOXI.icon('target', 20) + '</span>' +
        '      <div><div class="row-title" style="color:#d3d1f5">Centrum je rušnejšie</div>' +
        '        <div class="row-sub" style="color:#d3d1f5">1,2 km · zvyčajne +€2 na jazdu</div></div></div>' +
        '      <span class="badge badge-orange">+€2</span></div></div>' +
        '  <div class="stack" style="margin-top:16px">' +
        '    <button class="btn btn-primary" onclick="FOXI.toast(\'Smerujem do centra 🦊\');FOXI.after2(function(){FOXI.go(\'driver-online-idle\')},900)">' + FOXI.icon('nav', 18) + ' Skúsiť výzvu</button>' +
        '    <button class="btn btn-secondary" onclick="FOXI.toast(\'Naplánovať rušný slot\')">' + FOXI.icon('calendar', 18) + ' Naplánovať rušný slot</button>' +
        '    <button class="btn btn-ghost" onclick="FOXI.go(\'driver-online-idle\')">Ostať tu</button>' +
        '  </div>' +
        '</div></div>',
    };
  });

  /* ---------------- DRIVER NO-SHOW ---------------- */
  FOXI.screen('driver-noshow', function () {
    return {
      theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Zákazník neprišiel', 'driver-nav-pickup', true) +
        '<div class="s-pad">' +
        '  <div class="card center" style="margin-top:30px">' +
        '    <div style="color:var(--warning)">' + FOXI.icon('clock', 44) + '</div>' +
        '    <h2 class="h-title" style="margin-top:12px">Zákazník neprišiel</h2>' +
        '    <p class="muted" style="margin-top:8px">Čakacia doba uplynula. Za zmarenú jazdu dostanete storno poplatok.</p>' +
        '    <div class="card flat spread" style="margin-top:16px;text-align:left"><div class="row-title">Storno poplatok</div>' +
        '      <span class="veh-price" style="color:var(--orange);font-weight:800">' + eur(2.50) + '</span></div>' +
        '  </div>' +
        '  <button class="btn btn-primary" style="margin-top:18px" onclick="FOXI.toast(\'Poplatok €2,50 pripísaný\',\'success\');FOXI.after2(function(){FOXI.go(\'driver-online-idle\')},1400)">' + FOXI.icon('flag', 18) + ' Nahlásiť a ukončiť</button>' +
        '  <button class="btn btn-ghost" style="margin-top:8px" onclick="FOXI.toast(\'Čakám ešte chvíľu\');FOXI.back()">Počkať ešte chvíľu</button>' +
        '</div></div>',
    };
  });

  /* ---------------- DRIVER RIDER CANCELLED ---------------- */
  FOXI.screen('driver-rider-cancelled', function () {
    return {
      theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        '<div class="s-pad">' +
        '  <div class="card center" style="margin-top:40px;background:var(--orange-tint)">' +
        '    <div style="color:var(--orange-dark)">' + FOXI.icon('alert', 44) + '</div>' +
        '    <h2 class="h-title" style="margin-top:12px;color:var(--orange-dark)">' + D.rider.first + ' zrušila jazdu</h2>' +
        '    <p style="margin-top:8px;color:var(--orange-dark);font-size:14px">Storno poplatok je už pripísaný k vášmu zárobku — ste krytý.</p>' +
        '  </div>' +
        '  <div class="card flat spread" style="margin-top:14px"><div class="row-title">Storno poplatok pripísaný</div>' +
        '    <span class="veh-price" style="color:var(--orange);font-weight:800">+' + eur(2.50) + '</span></div>' +
        '  <button class="btn btn-primary" style="margin-top:18px" onclick="FOXI.go(\'driver-online-idle\')">' + FOXI.icon('car', 18) + ' Pokračovať online</button>' +
        '</div></div>',
      onMount: function () {
        FOXI.toast('Storno poplatok €2,50 pripísaný', 'success');
        FOXI._t = FOXI.after2(function () { FOXI.go('driver-online-idle'); }, 2000);
      },
    };
  });
})();
