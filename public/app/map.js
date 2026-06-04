/* ============================================================
   FOXI TAXI — Map layer (MapLibre GL + CARTO tiles)
   One persistent map behind the screens. Graceful SVG
   fallback if MapLibre/CDN is unavailable so it never looks
   broken. Animated fox-car marker along a route.
   ============================================================ */
window.FOXI = window.FOXI || {};

(function () {
  var CAR_SVG =
    '<svg class="foxi-car" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">' +
    '<g transform="translate(20,20)">' +
    // fox ears
    '<path d="M-6,-13 L-9,-19 L-2,-15 Z" fill="#f37722"/>' +
    '<path d="M6,-13 L9,-19 L2,-15 Z" fill="#f37722"/>' +
    // car body (top-down)
    '<rect x="-8" y="-13" width="16" height="26" rx="7" fill="#f37722"/>' +
    '<rect x="-6" y="-9" width="12" height="8" rx="3" fill="#fff" opacity=".9"/>' +    // windshield
    '<rect x="-6" y="2" width="12" height="7" rx="3" fill="#ffd9bf" opacity=".7"/>' +  // rear window
    '<circle cx="0" cy="-11" r="1.4" fill="#fff"/>' +
    '</g></svg>';

  var PIN_SVG =
    '<svg width="30" height="38" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M15 1C7.8 1 2 6.8 2 14c0 9 13 23 13 23s13-14 13-23C28 6.8 22.2 1 15 1Z" fill="#f37722" stroke="#fff" stroke-width="2.5"/>' +
    '<circle cx="15" cy="14" r="4.5" fill="#fff"/></svg>';

  // ---- geo helpers (no Turf dependency) ----
  function hav(a, b) {
    var R = 6371, dLat = (b[1] - a[1]) * Math.PI / 180, dLng = (b[0] - a[0]) * Math.PI / 180;
    var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a[1] * Math.PI / 180) * Math.cos(b[1] * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(s));
  }
  function bearing(a, b) {
    var y = Math.sin((b[0] - a[0]) * Math.PI / 180) * Math.cos(b[1] * Math.PI / 180);
    var x = Math.cos(a[1] * Math.PI / 180) * Math.sin(b[1] * Math.PI / 180) -
      Math.sin(a[1] * Math.PI / 180) * Math.cos(b[1] * Math.PI / 180) * Math.cos((b[0] - a[0]) * Math.PI / 180);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }
  function cumdist(coords) {
    var d = [0]; for (var i = 1; i < coords.length; i++) d.push(d[i - 1] + hav(coords[i - 1], coords[i])); return d;
  }
  function pointAt(coords, cum, dist) {
    if (dist <= 0) return { pt: coords[0], hdg: bearing(coords[0], coords[1]) };
    var total = cum[cum.length - 1];
    if (dist >= total) return { pt: coords[coords.length - 1], hdg: bearing(coords[coords.length - 2], coords[coords.length - 1]) };
    for (var i = 1; i < cum.length; i++) {
      if (cum[i] >= dist) {
        var seg = cum[i] - cum[i - 1], f = seg ? (dist - cum[i - 1]) / seg : 0;
        var a = coords[i - 1], b = coords[i];
        return { pt: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], hdg: bearing(a, b) };
      }
    }
    return { pt: coords[coords.length - 1], hdg: 0 };
  }
  function lerpAngle(a, b, t) {
    var d = ((b - a + 540) % 360) - 180; return a + d * t;
  }
  function fc(coords) { return { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } }; }

  var M = {
    _m: null, _lib: null, _theme: 'light', _markers: [], _car: null, _raf: 0, _svg: null, _proj: null, _cfg: null,
  };

  M.layerEl = function () { return document.getElementById('map-layer'); };

  M.init = function () {
    if (M._lib) return;
    var el = M.layerEl();
    if (window.maplibregl) {
      try {
        M._lib = 'gl';
        M._m = new maplibregl.Map({
          container: el,
          style: M._style(),
          center: [FOXI.data.center.lng, FOXI.data.center.lat],
          zoom: 13.2, attributionControl: false, interactive: true, dragRotate: false, pitchWithRotate: false,
        });
        M._m.on('load', function () { M._m.resize(); if (M._cfg) M.configure(M._cfg); });
        return;
      } catch (e) { console.warn('MapLibre failed, SVG fallback', e); }
    }
    M._lib = 'svg';
    M._initSvg(el);
  };

  M._style = function () {
    var c = ['a', 'b', 'c'];
    var light = c.map(function (s) { return 'https://' + s + '.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'; });
    var dark = c.map(function (s) { return 'https://' + s + '.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'; });
    return {
      version: 8,
      glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
      sources: {
        light: { type: 'raster', tiles: light, tileSize: 256 },
        dark: { type: 'raster', tiles: dark, tileSize: 256 },
        route: { type: 'geojson', data: fc([]) },
      },
      layers: [
        { id: 'bg', type: 'background', paint: { 'background-color': '#f5f5f7' } },
        { id: 'light', type: 'raster', source: 'light', paint: { 'raster-saturation': -0.2, 'raster-brightness-max': 0.98 } },
        { id: 'dark', type: 'raster', source: 'dark', layout: { visibility: 'none' } },
        { id: 'route-casing', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#463794', 'line-width': 9 } },
        { id: 'route-line', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#5a57a5', 'line-width': 6, 'line-blur': 0.4 } },
      ],
    };
  };

  M._whenReady = function (cb) {
    if (M._lib === 'gl') { if (M._m.isStyleLoaded()) cb(); else M._m.once('idle', cb); }
    else cb();
  };

  M.setTheme = function (theme) {
    M._theme = theme;
    if (M._lib === 'gl') {
      M._whenReady(function () {
        M._m.setLayoutProperty('light', 'visibility', theme === 'dark' ? 'none' : 'visible');
        M._m.setLayoutProperty('dark', 'visibility', theme === 'dark' ? 'visible' : 'none');
        M._m.setPaintProperty('bg', 'background-color', theme === 'dark' ? '#141422' : '#f5f5f7');
      });
    }
  };

  M._clearMarkers = function () {
    M._markers.forEach(function (m) { M._lib === 'gl' ? m.remove() : m.remove && m.remove(); });
    M._markers = [];
    if (M._car && M._lib === 'gl') { M._car.remove(); M._car = null; }
  };

  M._mkEl = function (html, cls) { var d = document.createElement('div'); d.innerHTML = html; var e = d.firstElementChild; if (cls) e.className = cls; return e; };

  M._addMarker = function (lngLat, html, cls, anchor) {
    if (M._lib !== 'gl') return null;
    var el = M._mkEl(html, cls);
    var mk = new maplibregl.Marker({ element: el, anchor: anchor || 'center' }).setLngLat(lngLat).addTo(M._m);
    M._markers.push(mk);
    return mk;
  };

  /* configure({theme, center, zoom, route, pickup, dropoff, nearby, fitPadBottom, fitRoute}) */
  M.configure = function (cfg) {
    M.init();
    M._cfg = cfg;
    M.show();
    if (cfg.theme) M.setTheme(cfg.theme);
    cancelAnimationFrame(M._raf);

    if (M._lib === 'gl') {
      if (!M._m.isStyleLoaded()) { M._m.once('idle', function () { M.configure(cfg); }); return; }
      M._m.resize();
      M._clearMarkers();
      M._m.getSource('route').setData(fc(cfg.route || []));
      if (cfg.pickup) M._addMarker(cfg.pickup, '<div class="mk-pickup"></div>');
      if (cfg.dropoff) M._addMarker(cfg.dropoff, PIN_SVG, 'mk-pin', 'bottom');
      (cfg.nearby || []).forEach(function (p) {
        var el = M._mkEl(CAR_SVG); el.classList.add('idle');
        el.style.transform = 'rotate(' + (p.h || 0) + 'deg)';
        var mk = new maplibregl.Marker({ element: el }).setLngLat(p).addTo(M._m); M._markers.push(mk);
      });
      // fit
      var pts = (cfg.fitRoute && cfg.route && cfg.route.length) ? cfg.route.slice() : [];
      if (cfg.pickup) pts.push(cfg.pickup); if (cfg.dropoff) pts.push(cfg.dropoff);
      if (pts.length >= 2) {
        var b = pts.reduce(function (bb, p) { return bb.extend(p); }, new maplibregl.LngLatBounds(pts[0], pts[0]));
        M._m.fitBounds(b, { padding: { top: 90, bottom: cfg.fitPadBottom || 380, left: 50, right: 50 }, duration: cfg.animateFit === false ? 0 : 600, maxZoom: 15.5 });
      } else if (cfg.center) {
        M._m.easeTo({ center: cfg.center, zoom: cfg.zoom || 14, duration: 400 });
      }
    } else {
      M._svgConfigure(cfg);
    }
  };

  /* animateCar({route, duration, deplete, theme, onDone}) — drives the fox-car */
  M.animateCar = function (opts) {
    M.init();
    var coords = opts.route || [];
    if (coords.length < 2) { opts.onDone && opts.onDone(); return; }
    var cum = cumdist(coords), total = cum[cum.length - 1];
    var dur = opts.duration || 9000;
    var startTs = null, prevH = bearing(coords[0], coords[1]);

    // ensure car marker exists
    if (M._lib === 'gl') {
      if (!M._m.isStyleLoaded()) { M._m.once('idle', function () { M.animateCar(opts); }); return; }
      if (!M._car) { M._car = new maplibregl.Marker({ element: M._mkEl(CAR_SVG), rotationAlignment: 'map' }).setLngLat(coords[0]).addTo(M._m); }
    } else {
      M._ensureSvgCar();
    }

    function step(ts) {
      if (!startTs) startTs = ts;
      var t = Math.min(1, (ts - startTs) / dur);
      var d = total * t;
      var r = pointAt(coords, cum, d);
      prevH = lerpAngle(prevH, r.hdg, 0.25);
      if (M._lib === 'gl') {
        M._car.setLngLat(r.pt); M._car.setRotation(prevH);
        if (opts.deplete) {
          // route depletes behind the car
          var rest = [r.pt];
          for (var i = 0; i < coords.length; i++) if (cum[i] > d) rest.push(coords[i]);
          M._m.getSource('route').setData(fc(rest));
        }
      } else {
        M._svgDrawCar(r.pt, prevH);
        if (opts.deplete) M._svgDrawRoute(coords, d, cum);
      }
      if (t < 1) M._raf = requestAnimationFrame(step);
      else opts.onDone && opts.onDone();
    }
    cancelAnimationFrame(M._raf);
    M._raf = requestAnimationFrame(step);
  };

  M.stop = function () { cancelAnimationFrame(M._raf); };
  M.show = function () { M.layerEl().style.display = ''; };
  M.hide = function () { cancelAnimationFrame(M._raf); M.layerEl().style.display = 'none'; };

  // ---------- SVG FALLBACK ----------
  M._initSvg = function (el) {
    el.innerHTML = '<div class="map-fallback"></div><svg class="map-svg" style="position:absolute;inset:0;width:100%;height:100%"></svg>';
    M._svg = el.querySelector('.map-svg');
  };
  M._buildProj = function (pts, w, h) {
    var lngs = pts.map(function (p) { return p[0]; }), lats = pts.map(function (p) { return p[1]; });
    var minLng = Math.min.apply(0, lngs), maxLng = Math.max.apply(0, lngs);
    var minLat = Math.min.apply(0, lats), maxLat = Math.max.apply(0, lats);
    var padX = w * 0.16, padY = h * 0.18, botPad = h * 0.42;
    var sLng = (w - 2 * padX) / ((maxLng - minLng) || 1);
    var sLat = (h - padY - botPad) / ((maxLat - minLat) || 1);
    return function (lng, lat) {
      return { x: padX + (lng - minLng) * sLng, y: padY + (maxLat - lat) * sLat };
    };
  };
  M._svgConfigure = function (cfg) {
    if (!M._svg) M._initSvg(M.layerEl());
    var el = M.layerEl(), w = el.clientWidth || 390, h = el.clientHeight || 760;
    var pts = (cfg.route && cfg.route.length ? cfg.route.slice() : []);
    if (cfg.pickup) pts.push(cfg.pickup); if (cfg.dropoff) pts.push(cfg.dropoff);
    (cfg.nearby || []).forEach(function (p) { pts.push(p); });
    if (!pts.length) pts = [[FOXI.data.center.lng, FOXI.data.center.lat]];
    M._proj = M._buildProj(pts, w, h);
    var svg = '';
    if (cfg.route && cfg.route.length > 1) {
      var dpath = cfg.route.map(function (p, i) { var q = M._proj(p[0], p[1]); return (i ? 'L' : 'M') + q.x + ' ' + q.y; }).join(' ');
      svg += '<path d="' + dpath + '" fill="none" stroke="#463794" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>';
      svg += '<path id="svg-route" d="' + dpath + '" fill="none" stroke="#5a57a5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    (cfg.nearby || []).forEach(function (p) { var q = M._proj(p[0], p[1]); svg += '<g transform="translate(' + q.x + ',' + q.y + ')" opacity=".85"><circle r="8" fill="#f37722"/></g>'; });
    if (cfg.pickup) { var qp = M._proj(cfg.pickup[0], cfg.pickup[1]); svg += '<circle cx="' + qp.x + '" cy="' + qp.y + '" r="9" fill="#fff" stroke="#f37722" stroke-width="5"/>'; }
    if (cfg.dropoff) { var qd = M._proj(cfg.dropoff[0], cfg.dropoff[1]); svg += '<g transform="translate(' + (qd.x - 15) + ',' + (qd.y - 36) + ')">' + PIN_SVG + '</g>'; }
    M._svg.innerHTML = svg;
  };
  M._ensureSvgCar = function () {
    if (!M._svg) M._svgConfigure(M._cfg || {});
    if (!M._svg.querySelector('.svg-car')) {
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', 'svg-car');
      g.innerHTML = CAR_SVG.replace('class="foxi-car"', '');
      M._svg.appendChild(g);
    }
  };
  M._svgDrawCar = function (pt, hdg) {
    if (!M._proj) return; var q = M._proj(pt[0], pt[1]);
    var g = M._svg.querySelector('.svg-car');
    if (g) g.setAttribute('transform', 'translate(' + (q.x - 20) + ',' + (q.y - 20) + ') rotate(' + hdg + ' 20 20)');
  };
  M._svgDrawRoute = function (coords, d, cum) {
    var p = M._svg.querySelector('#svg-route'); if (!p || !M._proj) return;
    var r = pointAt(coords, cum, d), rest = [r.pt];
    for (var i = 0; i < coords.length; i++) if (cum[i] > d) rest.push(coords[i]);
    p.setAttribute('d', rest.map(function (c, i) { var q = M._proj(c[0], c[1]); return (i ? 'L' : 'M') + q.x + ' ' + q.y; }).join(' '));
  };

  FOXI.map = M;
})();
