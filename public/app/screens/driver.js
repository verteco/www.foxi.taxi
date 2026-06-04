/* ============================================================
   FOXI TAXI — Driver app (DARK cockpit) happy path
   login · home · idle · offer · accepted · nav · arrived · on-trip · summary
   ============================================================ */
(function () {
  var D = FOXI.data;
  var PICK = FOXI.ll(D.pickup), DROP = FOXI.ll(D.dropoff);
  var dr = D.driver, e = D.earnings, t = D.trip;
  FOXI.state = FOXI.state || {};

  function eur(n) { return FOXI.money(n); }
  function km(n) { return n.toString().replace('.', ','); }

  /* small dark top bar over a map: avatar + operator + center pill + chat */
  function cockpitHead(pillHtml) {
    return '<div class="appbar">' +
      '<button class="iconbtn on-map" onclick="FOXI.go(\'driver-profile\')">' + FOXI.avatar(dr.name, 30) + '</button>' +
      '<button class="iconbtn on-map" style="width:auto;padding:0 12px;font-weight:700;font-size:13px" onclick="FOXI.go(\'driver-profile\')">RS</button>' +
      '<div class="appbar-spacer"></div>' + pillHtml + '<div class="appbar-spacer"></div>' +
      '<button class="iconbtn on-map" onclick="FOXI.go(\'driver-support\')">' + FOXI.icon('msg', 20) + '</button>' +
      '</div>';
  }

  /* ---------------- DRIVER LOGIN ---------------- */
  FOXI.screen('driver-login', function () {
    return {
      app: 'driver', theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        '<div class="s-pad" style="display:flex;flex-direction:column;min-height:100%">' +
        '  <div style="flex:1"></div>' +
        '  <div style="text-align:center">' +
        '    <div style="font-size:34px;font-weight:800;letter-spacing:-.03em">FOXI<span style="color:#f37722">.TAXI</span> <span style="font-size:18px;opacity:.7;font-weight:700">Driver</span></div>' +
        '    <p class="muted" style="margin-top:8px">Vodičská appka pre miestnych profíkov.</p>' +
        '  </div>' +
        '  <div class="field" style="margin-top:30px"><div class="field-label">Telefónne číslo</div>' +
        '    <input value="+421 950 706 000" inputmode="tel" /></div>' +
        '  <button class="btn btn-primary" style="margin-top:16px" onclick="FOXI.go(\'driver-home\')">Pokračovať</button>' +
        '  <div class="truststrip" style="justify-content:center;margin-top:14px">' + FOXI.icon('shieldcheck', 16) + ' Prihlásený ako ' + dr.name + ' <span class="dotsep"></span> ' + dr.operator + '</div>' +
        '  <div style="flex:1"></div>' +
        '  <button class="btn btn-ghost" onclick="FOXI.go(\'driver-support\')">' + FOXI.icon('help', 18) + ' Potrebujem pomoc</button>' +
        '</div></div>',
    };
  });

  /* ---------------- DRIVER HOME (cockpit, map, offline) ---------------- */
  FOXI.screen('driver-home', function () {
    var pct = Math.min(100, Math.round((e.todayTotal / e.todayGoal) * 100));
    var left = e.todayGoal - e.todayTotal;
    return {
      app: 'driver', theme: 'dark',
      map: { theme: 'dark', center: [D.center.lng, D.center.lat], zoom: 13.5, animateFit: false },
      html:
        cockpitHead('<div class="online-pill"><span class="dot"></span> Offline</div>') +
        // floating earnings glance card
        '<div class="card" style="position:absolute;left:16px;right:16px;top:104px;background:var(--surface)" onclick="FOXI.go(\'driver-earnings\')">' +
        '  <div class="spread">' +
        '    <div><div class="overline">Dnes</div><div class="hero-net" style="margin-top:2px"><span class="val" style="font-size:32px">' + eur(e.todayTotal) + '</span></div></div>' +
        '    <span class="row-chev">' + FOXI.icon('chevron', 18) + '</span>' +
        '  </div>' +
        '  <div class="row-sub" style="margin-top:6px">' + e.todayTrips + ' jázd · ' + e.todayHours + ' · ' + dr.rating.toFixed(1).replace('.', ',') + '★</div>' +
        '  <div style="height:6px;border-radius:99px;background:var(--line);margin-top:12px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:#f37722;border-radius:99px"></div></div>' +
        '  <div class="chip chip--pay" style="margin-top:10px;display:inline-flex">' + FOXI.icon('target', 14) + ' do cieľa ' + eur(e.todayGoal) + ': ' + eur(left) + '</div>' +
        '</div>' +
        // bonus / challenge strip
        '<div class="card flat" style="position:absolute;left:16px;right:16px;top:300px;background:var(--surface);display:flex;align-items:center;gap:12px">' +
        '  <div class="row-ico purple" style="flex:none">' + FOXI.icon('zap', 20) + '</div>' +
        '  <div style="flex:1"><div class="row-title" style="font-size:14px">Výzva: 3 jazdy do 18:00 → +' + eur(8) + '</div><div class="row-sub">Postup 2/3 · ešte jedna jazda</div></div>' +
        '  <span class="badge badge-orange">2/3</span>' +
        '</div>' +
        // bottom GO ONLINE area
        '<div class="sheet" style="text-align:center;padding-bottom:30px">' +
        '  <div class="sheet-grab"></div>' +
        '  <p class="muted" style="margin-bottom:14px">Ste offline. Pripojte sa a začnite prijímať jazdy.</p>' +
        '  <button class="goonline" onclick="FOXI.state.online=true;FOXI.go(\'driver-online-idle\')">' + FOXI.icon('power', 26) + '<span style="margin-left:8px">PRIPOJIŤ SA</span></button>' +
        '</div>',
    };
  });

  /* ---------------- DRIVER ONLINE — IDLE (radar) ---------------- */
  FOXI.screen('driver-online-idle', function () {
    return {
      app: 'driver', theme: 'dark',
      map: { theme: 'dark', center: [D.center.lng, D.center.lat], zoom: 14, animateFit: false },
      html:
        cockpitHead('<div class="online-pill on"><span class="dot"></span> Online</div>') +
        '<div style="position:absolute;top:44%;left:50%;transform:translate(-50%,-50%)"><div class="radar"><div class="core"></div></div></div>' +
        '<div class="sheet" style="text-align:center;padding-bottom:26px">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="sheet-title">Hľadáme jazdy v okolí…</div>' +
        '  <div class="card flat" style="margin-top:12px;display:flex;align-items:center;gap:12px;text-align:left">' +
        '    <div class="row-ico purple" style="flex:none">' + FOXI.icon('bolt', 20) + '</div>' +
        '    <div style="flex:1"><div class="row-title" style="font-size:14px">Centrum je rušnejšie</div><div class="row-sub">+' + eur(2) + ' na jazdu — oplatí sa presunúť</div></div>' +
        '  </div>' +
        '  <button class="btn btn-ghost" style="margin-top:10px" onclick="FOXI.go(\'driver-going-offline\')">Prejsť do offline</button>' +
        '</div>',
      onMount: function () {
        FOXI._t = FOXI.after2(function () { FOXI.go('driver-ride-offer'); }, 2600);
      },
    };
  });

  /* ---------------- GOING OFFLINE (confirm sheet) ---------------- */
  FOXI.screen('driver-going-offline', function () {
    return {
      app: 'driver', theme: 'dark',
      html:
        '<div class="screen" style="background:rgba(20,20,34,.6);justify-content:flex-end">' +
        '<div class="sheet" style="background:var(--surface)">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="sheet-title">Prejsť do offline?</div>' +
        '  <p class="muted">Prestanete dostávať ponuky jázd. Dnes ste zarobili ' + eur(e.todayTotal) + '.</p>' +
        '  <div class="stack" style="margin-top:18px">' +
        '    <button class="btn btn-primary" onclick="FOXI.back()">Zostať online</button>' +
        '    <button class="btn btn-secondary" onclick="FOXI.state.online=false;FOXI.toast(\'Ste offline\');FOXI.go(\'driver-home\')">Prejsť do offline</button>' +
        '  </div>' +
        '</div></div>',
    };
  });

  /* ---------------- RIDE OFFER (THE screen) ---------------- */
  FOXI.screen('driver-ride-offer', function () {
    return {
      app: 'driver', theme: 'dark',
      map: { theme: 'dark', route: D.route, pickup: PICK, dropoff: DROP, fitRoute: true, fitPadBottom: 520 },
      html:
        '<div style="position:absolute;inset:0;background:rgba(16,16,28,.45)"></div>' +
        '<div class="sheet sheet--ontrip" style="background:var(--surface)">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="spread">' +
        '    <div class="overline" style="color:#f37722">' + FOXI.icon('bolt', 14) + ' Nová jazda</div>' +
        '    <div id="offer-count" style="width:40px;height:40px;border-radius:50%;border:3px solid #f37722;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px">15</div>' +
        '  </div>' +
        // HERO net
        '  <div class="hero-net" style="margin-top:10px;display:flex;align-items:baseline;gap:10px;flex-wrap:wrap">' +
        '    <span class="cap">Zarobíte</span><span class="val">' + eur(t.driverNet) + '</span>' +
        '    <span class="chip chip--pay">' + FOXI.icon('cash', 14) + ' HOTOVOSŤ</span>' +
        '  </div>' +
        // trust line with tappable 12%
        '  <div class="truststrip" style="margin-top:6px;flex-wrap:wrap;line-height:1.5">Zákazník platí ' + eur(t.finalFare) + ' <span class="dotsep"></span> FOXI poplatok ' + eur(t.foxiFee) +
        '    <button class="chip" style="height:22px;padding:0 8px;font-size:11px;margin-left:4px" onclick="FOXI.toast(\'FOXI si berie len 12% — žiadne skryté poplatky. Z ' + eur(t.finalFare).replace(/'/g, '') + ' vám ostane ' + eur(t.driverNet).replace(/'/g, '') + '.\')">12%</button>' +
        '    <span class="dotsep"></span> vám ostane ' + eur(t.driverNet) + '</div>' +
        // pickup block
        '  <div class="card flat" style="margin-top:14px;display:flex;align-items:flex-start;gap:12px">' +
        '    <div class="row-ico purple" style="flex:none">' + FOXI.icon('pin', 18) + '</div>' +
        '    <div style="flex:1"><div class="overline">Vyzdvihnutie · 0,8 km · ~3 min</div><div class="row-title" style="font-size:14px;margin-top:2px">' + D.pickup.address + '</div></div>' +
        '  </div>' +
        // destination block — ALWAYS shown
        '  <div class="card flat" style="margin-top:8px;display:flex;align-items:flex-start;gap:12px">' +
        '    <div class="row-ico" style="flex:none">' + FOXI.icon('flag', 18) + '</div>' +
        '    <div style="flex:1"><div class="overline">Cieľ · ' + km(t.distanceKm) + ' km · ~' + t.durationMin + ' min</div><div class="row-title" style="font-size:14px;margin-top:2px">' + D.dropoff.label + ' · ' + D.dropoff.address + '</div></div>' +
        '  </div>' +
        // rider mini-row
        '  <div class="truststrip" style="margin-top:10px">' + FOXI.avatar(D.rider.name, 22) + ' ' + D.rider.first + ' <span class="dotsep"></span> 4,8★ <span class="dotsep"></span> 142 jázd</div>' +
        // action bar
        '  <div class="circle-actions" style="margin-top:14px;align-items:flex-start">' +
        '    <div style="flex:1;text-align:center"><button class="btn btn-secondary" style="width:100%" onclick="FOXI.go(\'driver-declined\')">Odmietnuť</button><div class="row-sub" style="margin-top:4px;font-size:11px">Bez postihu</div></div>' +
        '    <button class="btn btn-primary" style="flex:1.4" onclick="FOXI.go(\'driver-accepted\')">Prijať · ' + eur(t.driverNet) + '</button>' +
        '  </div>' +
        '</div>',
      onMount: function (el) {
        var n = 15, node = el.querySelector('#offer-count');
        FOXI._iv = FOXI.everyG(function () {
          n--; if (node) node.textContent = n;
          if (n <= 5 && node) node.style.borderColor = 'var(--error)', node.style.color = '#ff7a7d';
          if (n <= 0) { clearInterval(FOXI._iv); FOXI.go('driver-declined'); }
        }, 1000);
      },
    };
  });

  /* ---------------- DECLINED (back to idle) ---------------- */
  FOXI.screen('driver-declined', function () {
    if (FOXI._iv) clearInterval(FOXI._iv);
    return {
      app: 'driver', theme: 'dark',
      html:
        '<div class="screen" style="background:var(--bg);align-items:center;justify-content:center;text-align:center">' +
        '<div class="s-pad">' +
        '  <div class="empty"><div class="t">Jazda odmietnutá</div><div class="d">Bez postihu na vaše hodnotenie. Hľadáme ďalšiu…</div></div>' +
        '  <button class="btn btn-primary" style="margin-top:18px" onclick="FOXI.go(\'driver-online-idle\')">Späť k hľadaniu</button>' +
        '</div></div>',
      onMount: function () { FOXI._t = FOXI.after2(function () { FOXI.go('driver-online-idle'); }, 1600); },
    };
  });

  /* ---------------- ACCEPTED (green moment) ---------------- */
  FOXI.screen('driver-accepted', function () {
    if (FOXI._iv) clearInterval(FOXI._iv);
    return {
      app: 'driver', theme: 'dark',
      html:
        '<div class="screen" style="background:var(--bg);align-items:center;justify-content:center;text-align:center">' +
        '<div class="s-pad" style="display:flex;flex-direction:column;align-items:center;gap:16px">' +
        '  <div style="width:88px;height:88px;border-radius:50%;background:rgba(48,164,108,.18);display:flex;align-items:center;justify-content:center;color:var(--success)">' + FOXI.icon('check', 44) + '</div>' +
        '  ' + FOXI.avatar(D.rider.name, 64, true) +
        '  <div><div class="h-title">Idem po ' + D.rider.first + '</div><p class="muted" style="margin-top:6px">' + D.pickup.address + ' · ~3 min</p></div>' +
        '  <button class="btn btn-primary" style="max-width:280px" onclick="FOXI.go(\'driver-nav-pickup\')">' + FOXI.icon('nav', 18) + ' Navigovať</button>' +
        '</div></div>',
      onMount: function () { FOXI._t = FOXI.after2(function () { FOXI.go('driver-nav-pickup'); }, 1600); },
    };
  });

  /* ---------------- NAV TO PICKUP ---------------- */
  FOXI.screen('driver-nav-pickup', function () {
    return {
      app: 'driver', theme: 'dark',
      map: { theme: 'dark', route: D.approach, pickup: PICK, fitRoute: true, fitPadBottom: 340 },
      html:
        '<div class="appbar solid" style="border-radius:0"><div style="text-align:center;width:100%"><div style="font-weight:700">' + FOXI.icon('nav', 16) + ' 3 min · Vyzdvihnutie</div><div style="font-size:13px;opacity:.85">' + D.rider.first + ' · ' + D.pickup.address + '</div></div></div>' +
        '<div class="sheet" style="padding-bottom:26px">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="drivercard" style="padding:0;background:none;box-shadow:none">' + FOXI.avatar(D.rider.name, 50, true) +
        '    <div class="info"><div class="name">' + D.rider.first + '</div><div class="rating">' + FOXI.ui.stars(4.8, 13) + ' <span class="tnum">4,8</span> <span class="muted">(142)</span></div></div>' +
        '    <span class="chip chip--pay" style="flex:none">' + FOXI.icon('cash', 14) + ' ' + eur(t.finalFare) + '</span>' +
        '  </div>' +
        '  <div class="circle-actions" style="margin-top:8px">' +
        '    <button class="circle-btn" onclick="FOXI.toast(\'Volám ' + D.rider.first + '…\')">' + FOXI.icon('phone', 20) + '</button>' +
        '    <button class="circle-btn" onclick="FOXI.go(\'driver-chat\')">' + FOXI.icon('msg', 20) + '</button>' +
        '    <button class="btn btn-secondary" style="flex:1" onclick="FOXI.toast(\'Otváram Google Maps…\')">' + FOXI.icon('nav', 18) + ' Google Maps</button>' +
        '  </div>' +
        '  <div class="card flat" style="margin-top:12px;display:flex;align-items:center;gap:10px"><div class="row-ico purple" style="flex:none">' + FOXI.icon('user', 18) + '</div><div class="row-sub" style="color:var(--text)">„' + D.rider.pickupNote + '"</div></div>' +
        '  <div class="slide" style="margin-top:14px;cursor:pointer" onclick="FOXI.go(\'driver-arrived\')"><div class="fill"></div><div class="knob">' + FOXI.icon('chevron', 22) + '</div><div class="lbl">Potiahnite — prišiel som</div></div>' +
        '  <button class="btn btn-ghost" style="margin-top:6px" onclick="FOXI.go(\'driver-noshow\')">Zákazník neprišiel</button>' +
        '</div>',
      onMount: function () { FOXI.map.animateCar({ route: D.approach, duration: 7000 }); },
    };
  });

  /* ---------------- DRIVER CHAT ---------------- */
  FOXI.screen('driver-chat', function () {
    var msgs = [
      { me: false, txt: 'Som pri vchode, modrá bunda 👋' },
      { me: true, txt: 'Super, som tam o 2 minúty.' },
      { me: false, txt: 'Ďakujem!' },
    ];
    return {
      app: 'driver', theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg);display:flex;flex-direction:column">' +
        bar(D.rider.first + ' · 4,8★', 'driver-nav-pickup', true) +
        '<div class="s-pad" style="flex:1;display:flex;flex-direction:column;gap:10px;padding-top:10px">' +
        msgs.map(function (m) {
          return '<div style="align-self:' + (m.me ? 'flex-end' : 'flex-start') + ';max-width:78%;padding:10px 14px;border-radius:16px;background:' + (m.me ? '#f37722;color:#fff' : 'var(--surface);color:var(--text)') + '">' + m.txt + '</div>';
        }).join('') +
        '</div>' +
        '<div class="s-pad" style="display:flex;gap:8px;padding-bottom:20px">' +
        '  <div class="chips" style="flex:1"><button class="chip" onclick="FOXI.toast(\'Odoslané\')">Som tu</button><button class="chip" onclick="FOXI.toast(\'Odoslané\')">2 min</button><button class="chip" onclick="FOXI.toast(\'Volám…\')">' + FOXI.icon('phone', 14) + '</button></div>' +
        '</div></div>',
    };
  });

  /* ---------------- NO-SHOW ---------------- */
  FOXI.screen('driver-noshow', function () {
    return {
      app: 'driver', theme: 'dark',
      html:
        '<div class="screen" style="background:rgba(20,20,34,.6);justify-content:flex-end">' +
        '<div class="sheet" style="background:var(--surface)">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="sheet-title">Zákazník neprišiel?</div>' +
        '  <p class="muted">Po uplynutí bezplatného čakania máte nárok na storno poplatok. Skúsili ste zavolať?</p>' +
        '  <div class="stack" style="margin-top:18px">' +
        '    <button class="btn btn-primary" onclick="FOXI.toast(\'Volám ' + D.rider.first + '…\');FOXI.back()">' + FOXI.icon('phone', 18) + ' Zavolať zákazníkovi</button>' +
        '    <button class="btn btn-secondary" onclick="FOXI.toast(\'Storno nahlásené · +' + eur(3).replace(/'/g, '') + '\',\'success\');FOXI.go(\'driver-online-idle\')">Nahlásiť, že neprišiel</button>' +
        '  </div>' +
        '</div></div>',
    };
  });

  /* ---------------- ARRIVED AT PICKUP (driver) ---------------- */
  FOXI.screen('driver-arrived', function () {
    return {
      app: 'driver', theme: 'dark',
      map: { theme: 'dark', center: PICK, zoom: 16, pickup: PICK, animateFit: false },
      html:
        '<div class="appbar solid" style="border-radius:0"><div style="text-align:center;width:100%"><div style="font-weight:700">' + FOXI.icon('pin', 16) + ' Na mieste vyzdvihnutia</div><div style="font-size:13px;opacity:.85">Bezplatné čakanie · <span id="ds-wait">3:00</span></div></div></div>' +
        '<div class="sheet" style="padding-bottom:26px">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="drivercard" style="padding:0;background:none;box-shadow:none">' + FOXI.avatar(D.rider.name, 50, true) +
        '    <div class="info"><div class="name">' + D.rider.first + '</div><div class="car">„' + D.rider.pickupNote + '"</div></div>' +
        '    <span class="chip chip--pay" style="flex:none">' + FOXI.icon('cash', 14) + ' ' + eur(t.finalFare) + '</span>' +
        '  </div>' +
        '  <div class="circle-actions" style="margin-top:8px">' +
        '    <button class="circle-btn" onclick="FOXI.toast(\'Volám ' + D.rider.first + '…\')">' + FOXI.icon('phone', 20) + '</button>' +
        '    <button class="circle-btn" onclick="FOXI.go(\'driver-chat\')">' + FOXI.icon('msg', 20) + '</button>' +
        '    <button class="btn btn-secondary" style="flex:1" onclick="FOXI.toast(\'Pripomenuté zákazníkovi\')">' + FOXI.icon('msg', 18) + ' Som tu</button>' +
        '  </div>' +
        '  <div class="slide" style="margin-top:14px;cursor:pointer" onclick="FOXI.go(\'driver-on-trip\')"><div class="fill"></div><div class="knob">' + FOXI.icon('chevron', 22) + '</div><div class="lbl">Potiahnite — ŠTART JAZDY</div></div>' +
        '  <button class="btn btn-ghost" style="margin-top:6px" onclick="FOXI.go(\'driver-noshow\')">Nahlásiť, že zákazník neprišiel</button>' +
        '</div>',
      onMount: function (el) {
        var s = 180, node = el.querySelector('#ds-wait');
        FOXI._iv = FOXI.everyG(function () {
          s--; if (s < 0) { clearInterval(FOXI._iv); return; }
          var m = Math.floor(s / 60), sec = s % 60;
          if (node) node.textContent = m + ':' + (sec < 10 ? '0' : '') + sec;
        }, 1000);
      },
    };
  });

  /* ---------------- ON TRIP (driver, depleting route) ---------------- */
  FOXI.screen('driver-on-trip', function () {
    if (FOXI._iv) clearInterval(FOXI._iv);
    return {
      app: 'driver', theme: 'dark',
      map: { theme: 'dark', route: D.route, pickup: PICK, dropoff: DROP, fitRoute: true, fitPadBottom: 300 },
      html:
        '<div class="appbar solid" style="border-radius:0"><div style="text-align:center;width:100%"><div style="font-weight:700">' + FOXI.icon('nav', 16) + ' ' + t.durationMin + ' min · ' + km(t.distanceKm) + ' km</div><div style="font-size:13px;opacity:.85">' + D.dropoff.label + '</div></div></div>' +
        '<button class="iconbtn on-map" style="position:absolute;top:74px;right:16px;background:rgba(229,72,77,.18);color:#ff7a7d" onclick="FOXI.go(\'driver-sos\')">' + FOXI.icon('sos', 22) + '</button>' +
        '<div class="sheet" style="padding-bottom:26px">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="spread">' +
        '    <div><div class="overline">Cieľ</div><div class="row-title">' + D.dropoff.label + '</div></div>' +
        '    <div class="chip chip--pay" style="flex:none">Zárobok: ' + eur(t.driverNet) + ' netto</div>' +
        '  </div>' +
        '  <div class="circle-actions" style="margin-top:12px">' +
        '    <button class="circle-btn" onclick="FOXI.toast(\'Volám ' + D.rider.first + '…\')">' + FOXI.icon('phone', 20) + '</button>' +
        '    <button class="circle-btn" onclick="FOXI.go(\'driver-chat\')">' + FOXI.icon('msg', 20) + '</button>' +
        '    <button class="btn" style="flex:1;background:rgba(229,72,77,.16);color:#ff7a7d" onclick="FOXI.go(\'driver-sos\')">' + FOXI.icon('shield', 18) + ' Bezpečnosť</button>' +
        '  </div>' +
        '  <div class="slide" style="margin-top:14px;cursor:pointer" onclick="FOXI.go(\'driver-trip-summary\')"><div class="fill"></div><div class="knob">' + FOXI.icon('chevron', 22) + '</div><div class="lbl">Potiahnite — UKONČIŤ JAZDU</div></div>' +
        '</div>',
      onMount: function () {
        FOXI.map.animateCar({ route: D.route, duration: 9000, deplete: true });
      },
    };
  });

  /* ---------------- SOS ---------------- */
  FOXI.screen('driver-sos', function () {
    return {
      app: 'driver', theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Bezpečnostné centrum', null, true) +
        '<div class="s-pad stack">' +
        '  <a href="tel:112" class="btn" style="background:var(--error);color:#fff;height:64px;font-size:19px;box-shadow:0 8px 20px rgba(229,72,77,.35)">' + FOXI.icon('sos', 24) + ' Tiesňové volanie — 112</a>' +
        '  <div class="list" style="margin-top:6px">' +
        row('share', 'Zdieľať polohu s dispečerom', dr.operator, "FOXI.toast('Poloha zdieľaná s dispečerom','success')") +
        row('alert', 'Nahlásiť incident', 'Diskrétne, počas jazdy', "FOXI.toast('Nahlásenie odoslané','success')") +
        '  </div>' +
        '  <button class="btn btn-primary" onclick="FOXI.back()">Som v poriadku, späť</button>' +
        '</div></div>',
    };
  });

  /* ---------------- TRIP SUMMARY (receipt + rate rider) ---------------- */
  FOXI.screen('driver-trip-summary', function () {
    return {
      app: 'driver', theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        '<div style="text-align:center;padding:40px 20px 0"><div style="font-size:46px">🦊</div><div class="overline" style="margin-top:6px">Jazda dokončená</div><h2 class="h-title">' + D.dropoff.label + '</h2></div>' +
        '<div class="s-pad" style="margin-top:14px">' +
        // earnings receipt
        '  <div class="card">' +
        '    <div class="fareline"><span class="lbl">Cena jazdy</span><span class="amt">' + eur(10.40) + '</span></div>' +
        '    <div class="fareline"><span class="lbl">Čakanie</span><span class="amt">' + eur(0) + '</span></div>' +
        '    <div class="fareline"><span class="lbl">Prepitné</span><span class="amt">' + eur(1.00) + '</span></div>' +
        '    <div class="fareline total"><span class="lbl">Zákazník zaplatil</span><span class="amt">' + eur(t.finalFare) + '</span></div>' +
        '    <div class="fareline busy"><span class="lbl">− FOXI poplatok (12%)</span><span class="amt">−' + eur(t.foxiFee) + '</span></div>' +
        '    <div class="fareline net"><span class="lbl">Váš zárobok</span><span class="amt">' + eur(t.driverNet) + '</span></div>' +
        '  </div>' +
        // collect cash card
        '  <div class="card chip--pay" style="margin-top:14px;background:var(--surface);display:flex;align-items:center;gap:12px">' +
        '    <div class="row-ico" style="flex:none;background:rgba(243,119,34,.16);color:#f37722">' + FOXI.icon('cash', 20) + '</div>' +
        '    <div style="flex:1"><div class="row-title" style="font-size:14px">Vyberte ' + eur(t.finalFare) + ' v hotovosti</div><div class="row-sub">od ' + D.rider.first + '</div></div>' +
        '    <button class="btn btn-sm btn-success" id="cash-btn" style="width:auto;padding:0 14px" onclick="this.textContent=\'✓ Vybrané\';this.classList.add(\'btn-block\')">Vybrané</button>' +
        '  </div>' +
        // rate rider
        '  <div class="card" style="margin-top:14px;text-align:center">' + FOXI.avatar(D.rider.name, 56) +
        '    <div class="row-title" style="margin-top:8px">Ohodnoťte ' + D.rider.first + '</div>' +
        '    <div id="rate-stars" style="display:flex;justify-content:center;gap:8px;margin-top:10px">' +
        [1, 2, 3, 4, 5].map(function (n) { return '<button data-n="' + n + '" style="background:none"><svg width="34" height="34" viewBox="0 0 24 24" fill="#f37722" stroke="#f37722" stroke-width="2"><path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg></button>'; }).join('') +
        '    </div>' +
        '    <div class="chips" style="justify-content:center;flex-wrap:wrap;margin-top:14px">' +
        ['Slušný', 'Načas', 'Neporiadok'].map(function (c) { return '<button class="chip" onclick="this.classList.toggle(\'chip--active\')">' + c + '</button>'; }).join('') +
        '    </div>' +
        '    <p class="muted" style="font-size:12px;margin-top:12px">Najhoršie hodnotenie týždňa sa zahodí.</p>' +
        '  </div>' +
        '  <button class="btn btn-primary" style="margin-top:18px" onclick="FOXI.go(\'driver-home\');FOXI.toast(\'+' + eur(t.driverNet).replace(/'/g, '') + ' · Dnes ' + eur(97.20).replace(/'/g, '') + '\',\'success\')">Ďalej</button>' +
        '</div></div>',
      onMount: function (el) {
        var stars = el.querySelectorAll('#rate-stars button'), cur = 5;
        function paint(n) { el.querySelectorAll('#rate-stars button svg').forEach(function (s, i) { s.setAttribute('fill', i < n ? '#f37722' : 'none'); }); }
        paint(cur);
        stars.forEach(function (b) { b.addEventListener('click', function () { paint(+b.dataset.n); }); });
      },
    };
  });

  /* ---------------- DRIVER PROFILE (light helper) ---------------- */
  FOXI.screen('driver-profile', function () {
    return {
      app: 'driver', theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Profil vodiča', 'driver-home', true) +
        '<div class="s-pad">' +
        '  <div class="card" style="text-align:center">' + FOXI.avatar(dr.name, 72, true) +
        '    <div class="h-title" style="margin-top:10px">' + dr.name + '</div>' +
        '    <div class="row-sub">' + dr.rating.toFixed(2).replace('.', ',') + '★ · ' + dr.trips.toLocaleString('sk') + ' jázd</div>' +
        '    <div class="truststrip" style="justify-content:center;margin-top:8px">' + FOXI.icon('shieldcheck', 16) + ' ' + dr.operator + ' <span class="dotsep"></span> ' + dr.car + ' · ' + dr.plate + '</div>' +
        '  </div>' +
        '  <div class="list" style="margin-top:16px">' +
        row('wallet', 'Zárobky a výplaty', eur(e.available) + ' k dispozícii', "FOXI.go('driver-earnings')") +
        row('car', 'Vozidlo a doklady', dr.car + ' · ' + dr.plate, "FOXI.toast('Doklady sú platné')") +
        row('help', 'Podpora dispečera', dr.operator, "FOXI.go('driver-support')") +
        row('settings', 'Nastavenia', null, "FOXI.toast('Nastavenia (demo)')") +
        '  </div>' +
        '  <button class="btn btn-secondary" style="margin-top:16px" onclick="FOXI.go(\'driver-going-offline\')">' + FOXI.icon('logout', 18) + ' Prejsť do offline</button>' +
        '</div></div>',
    };
  });

  /* ---------------- DRIVER EARNINGS (light helper) ---------------- */
  FOXI.screen('driver-earnings', function () {
    var b = e.breakdown;
    var pct = Math.min(100, Math.round((e.todayTotal / e.todayGoal) * 100));
    return {
      app: 'driver', theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Zárobky', 'driver-home', true) +
        '<div class="s-pad">' +
        '  <div class="card" style="text-align:center"><div class="overline">Dnes</div>' +
        '    <div class="hero-net" style="justify-content:center;margin-top:4px"><span class="val">' + eur(e.todayTotal) + '</span></div>' +
        '    <div class="row-sub" style="margin-top:4px">' + e.todayTrips + ' jázd · ' + e.todayHours + '</div>' +
        '    <div style="height:6px;border-radius:99px;background:var(--line);margin-top:12px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:#f37722;border-radius:99px"></div></div>' +
        '    <div class="row-sub" style="margin-top:6px">do cieľa ' + eur(e.todayGoal) + ': ostáva ' + eur(e.todayGoal - e.todayTotal) + '</div>' +
        '  </div>' +
        '  <div class="card" style="margin-top:14px">' +
        '    <div class="fareline"><span class="lbl">Jazdné</span><span class="amt">' + eur(b.fares) + '</span></div>' +
        '    <div class="fareline"><span class="lbl">Prepitné</span><span class="amt">' + eur(b.tips) + '</span></div>' +
        '    <div class="fareline"><span class="lbl">Bonusy</span><span class="amt">' + eur(b.bonuses) + '</span></div>' +
        '    <div class="fareline"><span class="lbl">Čakanie</span><span class="amt">' + eur(b.waiting) + '</span></div>' +
        '    <div class="fareline busy"><span class="lbl">− FOXI poplatok (12%)</span><span class="amt">−' + eur(b.commission) + '</span></div>' +
        '    <div class="fareline net"><span class="lbl">Tento týždeň netto</span><span class="amt">' + eur(e.weekTotal) + '</span></div>' +
        '  </div>' +
        '  <div class="card flat" style="margin-top:14px"><div class="spread"><div><div class="row-title">K dispozícii</div><div class="row-sub">' + e.instantFree + '/' + e.instantTotal + ' okamžitých výberov zdarma</div></div><div class="veh-price">' + eur(e.available) + '</div></div></div>' +
        '  <button class="btn btn-primary" style="margin-top:16px" onclick="FOXI.toast(\'Výplata ' + eur(e.available).replace(/'/g, '') + ' na ceste\',\'success\')">' + FOXI.icon('wallet', 18) + ' Vyplatiť teraz</button>' +
        '</div></div>',
    };
  });

  /* ---------------- DRIVER SUPPORT (light helper) ---------------- */
  FOXI.screen('driver-support', function () {
    var disp = D.dispatcher;
    return {
      app: 'driver', theme: 'dark',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Podpora', 'driver-home', true) +
        '<div class="s-pad">' +
        '  <div class="card"><div class="spread"><div><div class="row-title">' + disp.operator + '</div><div class="row-sub">' + disp.area + '</div></div><span class="badge badge-green">' + FOXI.icon('check', 14) + ' 24/7</span></div>' +
        '    <div class="divider"></div>' +
        disp.numbers.map(function (n, i) {
          return '<a href="tel:' + n.tel + '" class="btn ' + (i === 0 ? 'btn-primary' : 'btn-secondary') + '" style="margin-top:' + (i ? 10 : 0) + 'px">' + FOXI.icon('phone', 20) + ' ' + n.display + '</a>';
        }).join('') +
        '  </div>' +
        '  <div class="list" style="margin-top:16px">' +
        row('help', 'Časté otázky', 'Výplaty, doklady, jazdy', "FOXI.toast('Centrum pomoci (demo)')") +
        row('doc', 'Moje doklady', 'Licencia, poistenie', "FOXI.toast('Doklady sú platné')") +
        '  </div>' +
        '</div></div>',
    };
  });
})();
