/* ============================================================
   FOXI TAXI — Rider app (light, map-first) happy path
   ============================================================ */
(function () {
  var D = FOXI.data;
  var PICK = FOXI.ll(D.pickup), DROP = FOXI.ll(D.dropoff);
  function range(c) { return FOXI.money(c.low) + '–' + Number(c.high).toFixed(2).replace('.', ','); }
  function vehById(id) { return D.categories.filter(function (c) { return c.id === id; })[0]; }
  function vehIcon(id) { return { standard: '🚗', comfort: '🚙', van: '🚐', pet: '🐶', eco: '🌿' }[id] || '🚗'; }

  function mapbar() {
    return '<div class="appbar">' +
      '<button class="iconbtn on-map" onclick="FOXI.go(\'account\')">' + FOXI.avatar(D.rider.name, 30) + '</button>' +
      '<div class="wordmark">FOXI<span class="t">.TAXI</span></div>' +
      '<button class="iconbtn on-map" onclick="FOXI.go(\'language-switch\')">' + FOXI.icon('globe', 20) + '</button>' +
      '<button class="iconbtn on-map" onclick="FOXI.go(\'safety-toolkit\')">' + FOXI.icon('shield', 20) + '</button>' +
      '</div>';
  }

  /* ---------------- RIDER HOME ---------------- */
  FOXI.screen('rider-home', function () {
    var nearby = D.nearby.map(function (p, i) { var q = p.slice(); q.h = i * 64; return q; });
    return {
      app: 'rider', theme: 'light',
      map: { center: [D.center.lng, D.center.lat], zoom: 14, nearby: nearby, animateFit: false },
      html:
        mapbar() +
        '<button class="fab-recenter" style="bottom:300px" onclick="FOXI.toast(\'Vycentrované na vašu polohu\')">' + FOXI.icon('target', 22) + '</button>' +
        '<button class="fab-call" style="bottom:316px" onclick="FOXI.go(\'phone-fallback\')" aria-label="Zavolať dispečera">' + FOXI.icon('phone', 22) + '</button>' +
        '<div class="etapill" style="position:absolute;top:108px;left:16px">' + FOXI.icon('car', 16) + ' Autá 2–4 min od vás</div>' +
        '<div class="sheet" style="padding-bottom:96px">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="search lg" onclick="FOXI.go(\'search-destination\')">' + FOXI.icon('search', 20) + '<span style="color:var(--text-4)">Kam to bude?</span></div>' +
        '  <div class="chips" style="margin-top:12px">' +
        '    <div class="chip" onclick="FOXI.go(\'vehicle-select\')">' + FOXI.icon('home', 16) + ' Domov</div>' +
        '    <div class="chip" onclick="FOXI.go(\'vehicle-select\')">' + FOXI.icon('briefcase', 16) + ' Práca</div>' +
        '    <div class="chip" onclick="FOXI.go(\'search-destination\')">' + FOXI.icon('plus', 16) + ' Pridať</div>' +
        '  </div>' +
        '  <div class="list" style="margin-top:14px;box-shadow:none;border:1px solid var(--line)">' +
        '    <div class="row tap" onclick="FOXI.go(\'schedule-ride\')"><div class="row-ico purple">' + FOXI.icon('calendar', 20) + '</div><div class="row-main"><div class="row-title">Naplánovať na neskôr</div><div class="row-sub">Pevná cena, bez surge</div></div><span class="row-chev">' + FOXI.icon('chevron', 18) + '</span></div>' +
        '  </div>' +
        '  <a class="truststrip" style="justify-content:center;margin-top:10px" onclick="FOXI.go(\'phone-fallback\')">' + FOXI.icon('phone', 16) + ' Radšej zavolať dispečerovi?</a>' +
        '</div>' +
        FOXI.ui.tabbar('ride'),
    };
  });

  /* ---------------- SEARCH DESTINATION ---------------- */
  FOXI.screen('search-destination', function () {
    var P = D.places;
    function place(p, icon) {
      return '<div class="row tap" onclick="FOXI.go(\'vehicle-select\')"><div class="row-ico">' + FOXI.icon(icon || 'pin', 20) + '</div>' +
        '<div class="row-main"><div class="row-title">' + p.label + '</div><div class="row-sub">' + p.address + '</div></div></div>';
    }
    return {
      theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        '<div class="appbar"><button class="iconbtn ghost" onclick="FOXI.go(\'rider-home\')">' + FOXI.icon('back', 22) + '</button><div class="title">Kam to bude?</div></div>' +
        '<div class="s-pad">' +
        '  <div class="stops"><div class="dotline"></div>' +
        '    <div class="stop"><span class="stop-dot from"></span><input value="' + D.pickup.address + '" /></div>' +
        '    <div class="stop"><span class="stop-dot to"></span><input placeholder="Zadajte cieľ" autofocus /></div>' +
        '  </div>' +
        '  <div class="spread" style="margin-top:12px">' +
        '    <button class="chip" onclick="FOXI.toast(\'Pridať zastávku\')">' + FOXI.icon('plus', 16) + ' Pridať zastávku</button>' +
        '    <button class="chip" onclick="FOXI.go(\'vehicle-select\')">' + FOXI.icon('pin', 16) + ' Vybrať na mape</button>' +
        '  </div>' +
        '  <div class="overline" style="margin:20px 0 6px">Uložené</div>' +
        '  <div class="list">' + place(P.home, 'home') + place(P.work, 'briefcase') + '</div>' +
        '  <div class="overline" style="margin:20px 0 6px">Nedávne</div>' +
        '  <div class="list">' + P.recent.map(function (r) { return place(r, 'clock'); }).join('') + '</div>' +
        '</div></div>',
    };
  });

  /* ---------------- VEHICLE SELECT ---------------- */
  FOXI.screen('vehicle-select', function () {
    var sel = FOXI.state.vehicle || 'standard';
    function vehRow(c) {
      return '<div class="veh' + (c.id === sel ? ' veh--sel' : '') + '" data-veh="' + c.id + '">' +
        '<div class="veh-ico">' + vehIcon(c.id) + '</div>' +
        '<div class="veh-main"><div class="veh-name">' + c.name + '</div>' +
        '<div class="veh-desc">' + c.desc + ' · <span class="veh-cap">' + FOXI.icon('user', 12) + ' ' + c.seats + '</span> · <span class="veh-eta">' + c.eta + ' min</span></div></div>' +
        '<div class="veh-price">' + range(c) + '</div></div>';
    }
    var pay = D.payments.filter(function (p) { return p.id === FOXI.state.payment; })[0] || D.payments[0];
    return {
      theme: 'light',
      map: { route: D.route, pickup: PICK, dropoff: DROP, fitRoute: true, fitPadBottom: 470 },
      html:
        '<div class="appbar"><button class="iconbtn on-map" onclick="FOXI.go(\'search-destination\')">' + FOXI.icon('back', 22) + '</button><div class="appbar-spacer"></div>' +
        '<div class="etapill">' + D.trip.distanceKm.toString().replace('.', ',') + ' km · ' + D.trip.durationMin + ' min</div><div class="appbar-spacer"></div><div style="width:42px"></div></div>' +
        '<div class="sheet">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="spread" style="margin-bottom:12px"><div style="min-width:0"><div class="row-sub">' + D.pickup.address + '</div><div class="row-title" style="font-size:15px">→ ' + D.dropoff.label + '</div></div><button class="chip" onclick="FOXI.go(\'search-destination\')">Upraviť</button></div>' +
        '  <div class="nosurge">' + FOXI.icon('shieldcheck', 16) + ' Pevná cena — žiadny surge</div>' +
        '  <div id="veh-list" style="margin-top:12px">' + D.categories.map(vehRow).join('') + '</div>' +
        '  <div class="spread" style="margin-top:14px">' +
        '    <button class="chip chip--pay" onclick="FOXI.go(\'payment-method\')">' + FOXI.icon(pay.icon, 16) + ' ' + pay.label + '</button>' +
        '    <button class="chip" onclick="FOXI.go(\'promo-code\')">' + FOXI.icon('gift', 16) + ' Pridať promo</button>' +
        '    <button class="chip" onclick="FOXI.go(\'fare-breakdown\')">Detail ceny</button>' +
        '  </div>' +
        '  <button class="btn btn-primary" id="veh-cta" style="margin-top:14px"></button>' +
        '</div>',
      onMount: function (el) {
        function refresh() {
          var c = vehById(FOXI.state.vehicle || 'standard');
          el.querySelector('#veh-cta').innerHTML = 'Vybrať ' + c.name.replace('FOXI ', '') + ' · ' + range(c);
        }
        el.querySelectorAll('.veh').forEach(function (v) {
          v.addEventListener('click', function () {
            FOXI.state.vehicle = v.dataset.veh;
            el.querySelectorAll('.veh').forEach(function (x) { x.classList.toggle('veh--sel', x === v); });
            refresh();
          });
        });
        el.querySelector('#veh-cta').addEventListener('click', function () { FOXI.go('requesting'); });
        refresh();
      },
    };
  });

  /* ---------------- FARE BREAKDOWN ---------------- */
  FOXI.screen('fare-breakdown', function () {
    var lines = D.fareLines.map(function (f) {
      var cls = f.note === 'promo' ? ' discount' : (f.note === 'busy' ? ' busy' : '');
      var amt = (f.amount < 0 ? '−' : '') + FOXI.money(Math.abs(f.amount));
      return '<div class="fareline' + cls + '"><span class="lbl">' + f.label + '</span><span class="amt">' + amt + '</span></div>';
    }).join('');
    return {
      theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Ako počítame cenu', 'vehicle-select') +
        '<div class="s-pad">' +
        '  <div class="card">' + lines +
        '    <div class="fareline total"><span class="lbl">Spolu (strop)</span><span class="amt">' + FOXI.money(D.trip.quoteLow) + '–' + Number(D.trip.quoteHigh).toFixed(2).replace('.', ',') + '</span></div>' +
        '  </div>' +
        '  <div class="nosurge" style="margin-top:14px;width:100%;justify-content:center">' + FOXI.icon('shieldcheck', 16) + ' Nikdy nezaplatíte viac ako ' + FOXI.money(D.trip.quoteHigh) + '</div>' +
        '  <p class="muted" style="margin-top:14px;font-size:13.5px">FOXI si necháva nízky servisný poplatok. Väčšina ceny ide vášmu miestnemu vodičovi.</p>' +
        '  <button class="btn btn-primary" style="margin-top:18px" onclick="FOXI.go(\'vehicle-select\')">Rozumiem</button>' +
        '</div></div>',
    };
  });

  /* ---------------- PAYMENT METHOD ---------------- */
  FOXI.screen('payment-method', function () {
    return {
      theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Spôsob platby', null, false) +
        '<div class="s-pad"><div class="list">' +
        D.payments.map(function (p) {
          var on = p.id === FOXI.state.payment;
          return '<div class="row tap" onclick="FOXI.state.payment=\'' + p.id + '\';FOXI.toast(\'Platba: ' + p.label + '\');FOXI.back()">' +
            '<div class="row-ico ' + (p.id === 'cash' ? 'purple' : '') + '">' + FOXI.icon(p.icon, 20) + '</div>' +
            '<div class="row-main"><div class="row-title">' + p.label + (p.id === 'cash' ? ' <span class="badge badge-orange" style="height:20px;font-size:11px">Odporúčané</span>' : '') + '</div>' + (p.sub ? '<div class="row-sub">' + p.sub + '</div>' : '') + '</div>' +
            (on ? '<span style="color:var(--purple)">' + FOXI.icon('check', 22) + '</span>' : '') + '</div>';
        }).join('') +
        '<div class="row tap" onclick="FOXI.toast(\'Pridať kartu (demo)\')"><div class="row-ico">' + FOXI.icon('plus', 20) + '</div><div class="row-main"><div class="row-title">Pridať spôsob platby</div></div></div>' +
        '</div>' +
        '<p class="muted" style="margin-top:14px;font-size:13px;text-align:center">Hotovosť, karta aj Apple/Google Pay sú si rovné. Vodič vždy vidí, ako platíte.</p>' +
        '</div></div>',
    };
  });

  /* ---------------- REQUESTING (dark, radar) ---------------- */
  FOXI.screen('requesting', function () {
    return {
      theme: 'dark',
      map: { theme: 'dark', center: PICK, zoom: 15, pickup: PICK, animateFit: false },
      html:
        '<div style="position:absolute;inset:0;background:rgba(20,20,34,.4)"></div>' +
        '<div style="position:absolute;top:42%;left:50%;transform:translate(-50%,-50%)"><div class="radar"><div class="core"></div></div></div>' +
        '<div class="sheet sheet--ontrip" style="text-align:center;background:var(--surface)">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="mascot-circle" style="width:88px;height:88px;margin:6px auto 0"><img src="/images/foxi-mascot-opt.jpg" alt=""/></div>' +
        '  <div id="req-status" class="sheet-title" style="margin-top:14px">Hľadáme vášho vodiča…</div>' +
        '  <div class="card flat spread" style="text-align:left"><div><div class="row-title">FOXI Standard</div><div class="row-sub">' + D.pickup.address + ' → ' + D.dropoff.label + '</div></div><div class="veh-price">' + FOXI.money(D.trip.quoteLow) + '–' + Number(D.trip.quoteHigh).toFixed(2).replace('.', ',') + '</div></div>' +
        '  <button class="btn btn-ghost" style="margin-top:8px" onclick="FOXI.go(\'cancel-confirm\')">Zrušiť</button>' +
        '</div>',
      onMount: function (el) {
        var msgs = ['Hľadáme najbližšieho vodiča…', 'Spájame vás s miestnym vodičom…'];
        var i = 0; var iv = FOXI.everyG(function () { i = (i + 1) % msgs.length; var s = el.querySelector('#req-status'); if (s) s.textContent = msgs[i]; }, 1300);
        FOXI.after2(function () { clearInterval(iv); FOXI.go('driver-matched'); }, 2800);
      },
    };
  });

  /* ---------------- DRIVER MATCHED ---------------- */
  FOXI.screen('driver-matched', function () {
    var dr = D.driver;
    return {
      theme: 'light',
      map: { route: D.approach, pickup: PICK, fitRoute: true, fitPadBottom: 420 },
      html:
        '<div class="appbar"><div class="appbar-spacer"></div><div class="etapill">' + FOXI.icon('car', 16) + ' Prichádza o 3 min</div><div class="appbar-spacer"></div>' +
        '<button class="iconbtn on-map" onclick="FOXI.go(\'safety-toolkit\')">' + FOXI.icon('shield', 20) + '</button></div>' +
        '<div class="sheet">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="drivercard">' + FOXI.avatar(dr.name, 56, true) +
        '    <div class="info"><div class="name">' + dr.first + ' <span class="badge badge-verified">' + FOXI.icon('shieldcheck', 16) + '</span></div>' +
        '      <div class="rating">' + FOXI.ui.stars(dr.rating, 13) + ' <span class="tnum">' + dr.rating.toFixed(2).replace('.', ',') + '</span> <span class="muted">(' + dr.trips.toLocaleString('sk') + ')</span></div>' +
        '      <div class="car">' + dr.car + ' · ' + dr.color + '</div></div>' +
        '    <span class="plate">' + dr.plate + '</span>' +
        '  </div>' +
        '  <div class="circle-actions" style="margin-top:14px">' +
        '    <button class="circle-btn" onclick="FOXI.toast(\'Volám ' + dr.first + '…\')">' + FOXI.icon('phone', 20) + '</button>' +
        '    <button class="circle-btn" onclick="FOXI.go(\'chat\')">' + FOXI.icon('msg', 20) + '</button>' +
        '    <button class="btn btn-secondary" style="flex:1" onclick="FOXI.go(\'share-trip\')">' + FOXI.icon('share', 18) + ' Zdieľať jazdu</button>' +
        '  </div>' +
        '  <div class="truststrip" style="margin-top:6px">' + FOXI.icon('shieldcheck', 16) + ' Licencované <span class="dotsep"></span> Poistené <span class="dotsep"></span> ' + dr.operator + '</div>' +
        '  <div class="card flat spread"><div class="row-sub">' + D.pickup.address + ' → ' + D.dropoff.label + '</div><div class="veh-price" style="font-size:14px">' + FOXI.money(D.trip.quoteLow) + '–' + Number(D.trip.quoteHigh).toFixed(2).replace('.', ',') + '</div></div>' +
        '  <button class="btn btn-ghost" style="margin-top:4px" onclick="FOXI.go(\'cancel-confirm\')">Zrušiť jazdu · zdarma ešte 2 min</button>' +
        '</div>',
      onMount: function () {
        FOXI.map.animateCar({ route: D.approach, duration: 7000 });
        FOXI._t = FOXI.after2(function () { FOXI.go('rider-arrived'); }, 6500);
      },
    };
  });

  /* ---------------- RIDER ARRIVED (was driver-arrived) ---------------- */
  FOXI.screen('rider-arrived', function () {
    var dr = D.driver;
    return {
      theme: 'light',
      map: { center: PICK, zoom: 16, pickup: PICK, animateFit: false },
      html:
        '<div class="appbar"><div class="appbar-spacer"></div><button class="iconbtn on-map" onclick="FOXI.go(\'safety-toolkit\')">' + FOXI.icon('shield', 20) + '</button></div>' +
        '<div class="sheet">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="sheet-title" style="margin-bottom:4px">' + dr.first + ' prišiel 🦊</div>' +
        '  <p class="muted">Hľadajte ' + dr.color + ' ' + dr.car + ', <b style="color:var(--text)">' + dr.plate + '</b></p>' +
        '  <div class="card" style="margin-top:14px;background:var(--purple-tint);text-align:center">' +
        '    <div class="overline" style="color:var(--purple-dark)">Váš overovací PIN</div>' +
        '    <div class="tnum" style="font-size:40px;font-weight:800;letter-spacing:.12em;color:var(--purple-dark)">' + dr.pin + '</div>' +
        '    <div style="font-size:13px;color:var(--purple-dark);opacity:.8">Povedzte ho vodičovi pred nástupom</div>' +
        '  </div>' +
        '  <div class="circle-actions" style="margin-top:14px">' +
        '    <button class="circle-btn" onclick="FOXI.toast(\'Volám ' + dr.first + '…\')">' + FOXI.icon('phone', 20) + '</button>' +
        '    <button class="circle-btn" onclick="FOXI.go(\'chat\')">' + FOXI.icon('msg', 20) + '</button>' +
        '    <button class="btn btn-secondary" style="flex:1" onclick="FOXI.go(\'share-trip\')">' + FOXI.icon('share', 18) + ' Zdieľať</button>' +
        '  </div>' +
        '  <div class="truststrip" style="justify-content:center;margin-top:8px">Bezplatné čakanie · 4:32</div>' +
        '</div>',
      onMount: function () { FOXI._t = FOXI.after2(function () { FOXI.go('on-trip'); }, 4200); },
    };
  });

  /* ---------------- ON TRIP (dark, depleting route) ---------------- */
  FOXI.screen('on-trip', function () {
    return {
      theme: 'dark',
      map: { theme: 'dark', route: D.route, pickup: PICK, dropoff: DROP, fitRoute: true, fitPadBottom: 300 },
      html:
        '<div class="appbar solid" style="border-radius:0"><div style="text-align:center;width:100%"><div style="font-weight:700">Na ceste · ETA 09:48</div><div style="font-size:13px;opacity:.85" id="ot-left">' + D.trip.distanceKm.toString().replace('.', ',') + ' km do cieľa</div></div></div>' +
        '<div class="sheet" style="padding-bottom:30px">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="spread"><div><div class="overline">Cieľ</div><div class="row-title">' + D.dropoff.label + '</div></div>' + FOXI.avatar(D.driver.name, 44) + '</div>' +
        '  <div class="circle-actions" style="margin-top:14px">' +
        '    <button class="btn btn-secondary" style="flex:1" onclick="FOXI.go(\'share-trip\')">' + FOXI.icon('share', 18) + ' Zdieľať</button>' +
        '    <button class="btn" style="flex:1;background:rgba(229,72,77,.16);color:#ff7a7d" onclick="FOXI.go(\'safety-toolkit\')">' + FOXI.icon('shield', 18) + ' Bezpečnosť</button>' +
        '  </div>' +
        '  <div class="card flat spread" style="margin-top:12px"><div class="row-sub">' + FOXI.icon('cash', 16) + ' Hotovosť</div><div class="veh-price" style="font-size:14px">' + FOXI.money(D.trip.quoteLow) + '–' + Number(D.trip.quoteHigh).toFixed(2).replace('.', ',') + '</div></div>' +
        '</div>',
      onMount: function () {
        FOXI.map.animateCar({ route: D.route, duration: 9000, deplete: true, onDone: function () { FOXI.go('trip-complete'); } });
      },
    };
  });

  /* ---------------- TRIP COMPLETE (rate + tip + cap) ---------------- */
  FOXI.screen('trip-complete', function () {
    var dr = D.driver, t = D.trip;
    return {
      theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        '<div style="text-align:center;padding:56px 20px 0"><div class="overline">Prišli ste</div><h2 class="h-title">' + D.dropoff.label + '</h2></div>' +
        '<div class="s-pad" style="margin-top:18px">' +
        '  <div class="card" style="text-align:center"><div class="row-sub">Zaplatené · Hotovosť vodičovi</div><div style="font-size:40px;font-weight:800;letter-spacing:-.03em;color:var(--text)">' + FOXI.money(t.finalFare) + '</div>' +
        '    <div class="nosurge" style="width:100%;justify-content:center;margin-top:8px">' + FOXI.icon('shieldcheck', 16) + ' Cenili sme do ' + FOXI.money(t.quoteHigh) + ' — zaplatili ste ' + FOXI.money(t.finalFare) + '</div>' +
        '    <a style="display:inline-block;margin-top:12px;color:var(--purple);font-weight:600" onclick="FOXI.go(\'receipt\')">Zobraziť účtenku</a></div>' +
        '  <div class="card" style="margin-top:14px;text-align:center">' + FOXI.avatar(dr.name, 56) +
        '    <div class="row-title" style="margin-top:8px">Ohodnoťte ' + dr.first + '</div>' +
        '    <div id="rate-stars" style="display:flex;justify-content:center;gap:8px;margin-top:10px">' +
        [1, 2, 3, 4, 5].map(function (n) { return '<button data-n="' + n + '" style="background:none">' + '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f37722" stroke-width="2"><path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg></button>'; }).join('') +
        '    </div>' +
        '    <div class="chips" style="justify-content:center;flex-wrap:wrap;margin-top:14px">' +
        ['Skvelé auto', 'Bezpečná jazda', 'Priateľský', 'Čisté'].map(function (c) { return '<button class="chip" onclick="this.classList.toggle(\'chip--active\')">' + c + '</button>'; }).join('') +
        '    </div></div>' +
        '  <div class="card" style="margin-top:14px"><div class="row-title" style="margin-bottom:10px">Prepitné</div>' +
        '    <div class="chips">' + ['1', '2', '5'].map(function (v) { return '<button class="chip" onclick="this.parentElement.querySelectorAll(\'.chip\').forEach(c=>c.classList.remove(\'chip--active\'));this.classList.add(\'chip--active\')">' + FOXI.money(parseFloat(v)) + '</button>'; }).join('') + '<button class="chip" onclick="FOXI.toast(\'Vlastná suma\')">Vlastné</button><button class="chip chip--active" onclick="this.parentElement.querySelectorAll(\'.chip\').forEach(c=>c.classList.remove(\'chip--active\'));this.classList.add(\'chip--active\')">Bez prepitného</button></div>' +
        '    <p class="muted" style="font-size:12.5px;margin-top:10px">Prepitné môžete dať aj v hotovosti.</p></div>' +
        '  <button class="btn btn-primary" style="margin-top:18px" onclick="FOXI.toast(\'Ďakujeme! 🦊\',\'success\');FOXI.after2(function(){FOXI.go(\'rider-home\')},700)">Odoslať</button>' +
        '</div></div>',
      onMount: function (el) {
        el.querySelectorAll('#rate-stars button').forEach(function (b) {
          b.addEventListener('click', function () {
            var n = +b.dataset.n;
            el.querySelectorAll('#rate-stars button svg').forEach(function (s, i) { s.setAttribute('fill', i < n ? '#f37722' : 'none'); });
          });
        });
      },
    };
  });

  /* ---------------- RECEIPT ---------------- */
  FOXI.screen('receipt', function () {
    var dr = D.driver, t = D.trip;
    var lines = D.fareLines.map(function (f) {
      var amt = (f.amount < 0 ? '−' : '') + FOXI.money(Math.abs(f.amount));
      return '<div class="fareline"><span class="lbl">' + f.label + '</span><span class="amt">' + amt + '</span></div>';
    }).join('');
    return {
      theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Účtenka', 'rider-activity') +
        '<div class="s-pad">' +
        '  <div class="card"><div class="overline">04. jún 2026 · 14:32</div>' +
        '    <div class="row-title" style="margin-top:6px">' + D.pickup.address + '</div><div class="row-title">→ ' + D.dropoff.label + '</div>' +
        '    <div class="row-sub" style="margin-top:6px">' + dr.name + ' · ' + dr.car + ' · ' + dr.plate + ' · ' + t.distanceKm.toString().replace('.', ',') + ' km</div>' +
        '    <div class="divider"></div>' + lines +
        '    <div class="fareline total"><span class="lbl">Spolu</span><span class="amt">' + FOXI.money(t.finalFare) + '</span></div>' +
        '    <div class="fareline"><span class="lbl">Platba</span><span class="amt">Hotovosť</span></div></div>' +
        '  <div class="stack" style="margin-top:16px">' +
        '    <button class="btn btn-secondary" onclick="FOXI.toast(\'Účtenka odoslaná e-mailom\')">' + FOXI.icon('msg', 18) + ' Poslať e-mailom</button>' +
        '    <button class="btn btn-ghost" onclick="FOXI.go(\'phone-fallback\')">Potrebujem pomoc s jazdou</button>' +
        '  </div>' +
        '</div></div>',
    };
  });

  /* ---------------- CANCEL CONFIRM ---------------- */
  FOXI.screen('cancel-confirm', function () {
    return {
      theme: 'dark',
      html:
        '<div class="screen" style="background:rgba(20,20,34,.6);justify-content:flex-end">' +
        '<div class="sheet" style="background:var(--surface)">' +
        '  <div class="sheet-grab"></div>' +
        '  <div class="sheet-title">Zrušiť jazdu?</div>' +
        '  <p class="muted">Zdarma do 12:04 — bez poplatku.</p>' +
        '  <div class="chips" style="flex-wrap:wrap;margin-top:14px">' + ['Vodič je ďaleko', 'Zmena plánov', 'Zlá adresa', 'Našiel som inú'].map(function (c) { return '<button class="chip" onclick="this.classList.toggle(\'chip--active\')">' + c + '</button>'; }).join('') + '</div>' +
        '  <div class="stack" style="margin-top:18px">' +
        '    <button class="btn btn-brand" onclick="FOXI.back()">Ponechať jazdu</button>' +
        '    <button class="btn btn-danger" onclick="FOXI.toast(\'Jazda zrušená\');FOXI.after2(function(){FOXI.go(\'rider-home\')},600)">Zrušiť jazdu</button>' +
        '  </div>' +
        '</div></div>',
    };
  });

  /* ---------------- SHARE TRIP ---------------- */
  FOXI.screen('share-trip', function () {
    return {
      theme: 'light',
      html:
        '<div class="screen-scroll s-bottom" style="background:var(--bg)">' +
        bar('Zdieľať živú jazdu', null, false) +
        '<div class="s-pad stack">' +
        '  <div class="card flat"><div class="map-fallback" style="position:relative;height:120px;border-radius:12px"></div><p class="muted" style="margin-top:10px;font-size:13px">Odkaz ukáže vašu polohu naživo, vodiča a ŠPZ.</p></div>' +
        '  <button class="btn btn-primary" onclick="FOXI.toast(\'Živá jazda zdieľaná\',\'success\')">' + FOXI.icon('share', 18) + ' Zdieľať odkaz</button>' +
        '  <div class="list"><div class="row tap" onclick="FOXI.toast(\'Odoslané: Mama\')"><div class="row-ico purple">' + FOXI.icon('user', 20) + '</div><div class="row-main"><div class="row-title">Poslať: Mama</div><div class="row-sub">+421 905 ···</div></div></div></div>' +
        '  <label class="card flat spread" style="cursor:pointer"><div class="row-title">Vždy zdieľať s týmito kontaktmi</div>' + toggle(true) + '</label>' +
        '</div></div>',
      onMount: wireToggles,
    };
  });
})();
