/* ============================================================
   FOXI TAXI — Prototype shell & router (no backend, no deps)
   - Hash router:  #/<screen-id>
   - Screen registry: FOXI.screen(id, factory)
   - factory(params) -> { html, onMount?, theme?, map?, app? }
       theme: 'light'|'dark'  (default: rider=light, driver=dark)
       map:   config passed to FOXI.map.configure (screen shows map)
   ============================================================ */
window.FOXI = window.FOXI || {};
FOXI.screens = {};
FOXI._params = {};
FOXI.state = { lang: 'sk', payment: 'cash', vehicle: 'standard', online: false, persona: 'operator' };

FOXI.screen = function (id, factory) { FOXI.screens[id] = factory; };

FOXI.go = function (id, params) {
  FOXI._params = params || {};
  if (location.hash === '#/' + id) FOXI._render();
  else location.hash = '#/' + id;
};
FOXI.back = function () { history.length > 1 ? history.back() : FOXI.go('rider-home'); };

/* nav-guarded timers: stale auto-advances from a left screen are ignored.
   Same call signature as setTimeout/setInterval so screen code is identical. */
FOXI._nav = 0;
FOXI.after2 = function (fn, ms) { var n = FOXI._nav; return setTimeout(function () { if (FOXI._nav === n) { try { fn(); } catch (e) { console.error(e); } } }, ms); };
FOXI.everyG = function (fn, ms) { var n = FOXI._nav; var id = setInterval(function () { if (FOXI._nav !== n) { clearInterval(id); return; } try { fn(); } catch (e) { console.error(e); } }, ms); return id; };

/* ---------- helpers ---------- */
FOXI.money = function (n) { return (FOXI.data.currency || '€') + Number(n).toFixed(2).replace('.', ','); };
FOXI.ll = function (p) { return [p.lng, p.lat]; };

FOXI.icon = function (name, size) {
  size = size || 24;
  var p = FOXI._icons[name] || '';
  return '<svg class="ico" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
};
FOXI._icons = {
  back: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  star: '<path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  shieldcheck: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  car: '<path d="M5 17H3v-5l2-5h11l3 5h2v5h-2"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  chevdown: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/>',
  wallet: '<path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M16 12h.01"/><path d="M3 9h18"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
  power: '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/>',
  nav: '<path d="m3 11 19-9-9 19-2-8-8-2z"/>',
  sos: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  dog: '<path d="M10 5.5 8 4 5 5l-.5 3M14 5.5 16 4l3 1 .5 3"/><path d="M5 8c-1 2-1 5 0 7s2 4 7 4 6-2 7-4 1-5 0-7"/><path d="M9 14h.01M15 14h.01"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-6 8-9 16-9 0 8-3 16-9 16Z"/><path d="M2 22c5-3 7-7 9-13"/>',
  apple: '<path d="M12 20.94c1.5 0 2.75-.67 3.5-2 .75-1.33 1.5-3 1.5-5 0-2.5-2-4-4-4-.66 0-1.5.33-2 .33S10.66 10 10 10C8 10 6 11.5 6 14c0 2 .75 3.67 1.5 5 .75 1.33 2 2 3.5 2"/><path d="M12 6c.5-1.5 1.5-2.5 3-3"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  alert: '<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"/><path d="M12 9v4M12 17h.01"/>',
};

FOXI.avatar = function (name, size, ring) {
  size = size || 48;
  var init = (name || '?').split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
  return '<span class="avatar' + (ring ? ' avatar--ring' : '') + '" style="width:' + size + 'px;height:' + size + 'px;font-size:' + (size * 0.36) + 'px">' + init + '</span>';
};

FOXI.ui = {
  stars: function (n, size) {
    size = size || 13; var h = '';
    for (var i = 0; i < 5; i++) h += '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="' + (i < Math.round(n) ? '#f37722' : 'none') + '" stroke="#f37722" stroke-width="2"><path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>';
    return '<span class="stars">' + h + '</span>';
  },
  tabbar: function (active) {
    var tabs = [
      { id: 'ride', label: 'Jazda', icon: 'car', go: 'rider-home' },
      { id: 'activity', label: 'Aktivita', icon: 'clock', go: 'rider-activity' },
      { id: 'wallet', label: 'Peňaženka', icon: 'wallet', go: 'payment-method' },
      { id: 'account', label: 'Účet', icon: 'user', go: 'account' },
    ];
    return '<div class="tabbar">' + tabs.map(function (t) {
      return '<button class="tab' + (t.id === active ? ' active' : '') + '" onclick="FOXI.go(\'' + t.go + '\')">' + FOXI.icon(t.icon, 22) + '<span>' + t.label + '</span></button>';
    }).join('') + '</div>';
  },
  modal: function (html) {
    var w = document.createElement('div'); w.className = 'modal-wrap';
    w.innerHTML = '<div class="modal">' + html + '</div>';
    w.addEventListener('click', function (e) { if (e.target === w) FOXI.ui.closeModal(); });
    document.querySelector('.frame-body').appendChild(w);
    requestAnimationFrame(function () { w.classList.add('show'); });
    FOXI._modal = w; return w;
  },
  closeModal: function () { var w = FOXI._modal; if (!w) return; w.classList.remove('show'); setTimeout(function () { w.remove(); }, 220); FOXI._modal = null; },
};

FOXI.toast = function (msg, kind) {
  var t = document.createElement('div');
  t.className = 'toast' + (kind ? ' toast--' + kind : '');
  t.textContent = msg;
  document.querySelector('.frame-body').appendChild(t);
  requestAnimationFrame(function () { t.classList.add('show'); });
  setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 280); }, 2600);
};

/* ---------- router ---------- */
FOXI._render = function () {
  FOXI._nav++;
  if (FOXI.map) FOXI.map.stop();
  var id = (location.hash || '#/splash').replace(/^#\//, '') || 'splash';
  var factory = FOXI.screens[id];
  var vp = document.getElementById('app-viewport');
  var frame = document.querySelector('.frame');
  FOXI.ui.closeModal();

  if (!factory) {
    frame.setAttribute('data-theme', 'light');
    FOXI.map && FOXI.map.hide();
    vp.innerHTML = '<div class="screen"><div class="empty" style="margin-top:120px"><div class="t">Obrazovka „' + id + '"</div><div class="d">zatiaľ nie je v prototype</div><div style="padding:24px"><button class="btn btn-primary" onclick="FOXI.go(\'rider-home\')">Domov</button></div></div></div>';
    FOXI._syncDemoNav(id); return;
  }

  var view = factory(FOXI._params) || {};
  var app = view.app || (id.indexOf('driver') === 0 ? 'driver' : 'rider');
  var theme = view.theme || (app === 'driver' ? 'dark' : 'light');
  frame.setAttribute('data-app', app);
  frame.setAttribute('data-theme', theme);

  // map
  if (view.map && FOXI.map) { view.map.theme = theme; FOXI.map.configure(view.map); }
  else if (FOXI.map) { FOXI.map.hide(); }

  // transition
  var old = vp.firstElementChild;
  var next = document.createElement('div');
  next.className = 'screen screen-enter' + (view.map ? ' is-map' : '');
  next.innerHTML = view.html || '';
  vp.appendChild(next);
  requestAnimationFrame(function () { next.classList.remove('screen-enter'); });
  if (old) { old.classList.add('screen-exit'); setTimeout(function () { old.remove(); }, 300); }

  if (typeof view.onMount === 'function') { try { view.onMount(next); } catch (e) { console.error(e); } }
  FOXI._syncDemoNav(id);
};

window.addEventListener('hashchange', FOXI._render);

FOXI._syncDemoNav = function (id) {
  document.querySelectorAll('.demo-link').forEach(function (a) { a.classList.toggle('active', a.dataset.screen === id); });
  var app = id.indexOf('driver') === 0 ? 'driver' : 'rider';
  document.querySelectorAll('.demo-app-tab').forEach(function (b) { b.classList.toggle('active', b.dataset.app === app); });
};

FOXI.start = function () { if (!location.hash) location.hash = '#/splash'; FOXI._render(); };
