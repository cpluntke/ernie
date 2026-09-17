// Signing in is signing the visitors' book (doc 0002). The signature is the most
// practised motor act of a lifetime, so it gives a strong personal baseline; the
// date question is the daily orientation item.

import { el, svg, esc, now, median, load, save, events, robustStats, zScore, DAYS, MONTHS, fmtDate } from './core.js';

export const BASE_N = 5;   // demo: the first five signatures form the baseline

// --------------------------------------------------------------- features
function resample(stroke, dt) {
  if (stroke.length < 2) return null;
  const t0 = stroke[0].t, t1 = stroke[stroke.length - 1].t;
  if (t1 - t0 < 40) return null;
  const out = [];
  let j = 0;
  for (let t = t0; t <= t1; t += dt) {
    while (j < stroke.length - 2 && stroke[j + 1].t < t) j++;
    const a = stroke[j], b = stroke[j + 1], u = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t);
    out.push({ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, t });
  }
  return out;
}

export function signatureFeatures(strokes, shownAt) {
  const f = { strokes: strokes.length };
  const first = strokes[0][0], last = strokes[strokes.length - 1];
  f.timeToFirstMs = first.t - shownAt;
  f.totalMs = last[last.length - 1].t - first.t;
  f.inAirMs = 0;
  for (let i = 1; i < strokes.length; i++) f.inAirMs += strokes[i][0].t - strokes[i - 1][strokes[i - 1].length - 1].t;

  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9, pathLen = 0, drawMs = 0;
  const ldlj = [], speedSeries = [];
  for (const s of strokes) {
    for (const p of s) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); }
    const r = resample(s, 10);
    if (!r) continue;
    let L = 0;
    const T = (r[r.length - 1].t - r[0].t) / 1000, dt = 0.01, v = [];
    for (let k = 1; k < r.length; k++) {
      const dx = r[k].x - r[k - 1].x, dy = r[k].y - r[k - 1].y;
      L += Math.hypot(dx, dy);
      v.push({ x: dx / dt, y: dy / dt, t: r[k].t });
    }
    for (const q of v) speedSeries.push({ t: q.t, v: Math.hypot(q.x, q.y) });
    speedSeries.push(null);   // pen up
    pathLen += L; drawMs += T * 1000;
    if (v.length >= 4 && L > 0.005) {
      let J = 0;
      for (let m = 2; m < v.length; m++) {
        const ax1 = (v[m - 1].x - v[m - 2].x) / dt, ay1 = (v[m - 1].y - v[m - 2].y) / dt;
        const ax2 = (v[m].x - v[m - 1].x) / dt, ay2 = (v[m].y - v[m - 1].y) / dt;
        const jx = (ax2 - ax1) / dt, jy = (ay2 - ay1) / dt;
        J += (jx * jx + jy * jy) * dt;
      }
      ldlj.push(-Math.log((T ** 3 / (L * L)) * J));
    }
  }
  f.width = maxX - minX; f.height = maxY - minY; f.pathLen = pathLen;
  f.meanSpeed = drawMs > 0 ? pathLen / (drawMs / 1000) : 0;
  f.smoothness = ldlj.length ? ldlj.reduce((a, b) => a + b, 0) / ldlj.length : null;
  f.speedSeries = speedSeries;
  f.shape = shapeVector(strokes);
  return f;
}

// 64 points along the whole signature by arc length, centred and scaled to unit
// RMS, so shape can be compared regardless of where or how big it was written.
export function shapeVector(strokes) {
  const pts = [];
  for (const s of strokes) for (const p of s) pts.push([p.x, p.y]);
  if (pts.length < 2) return null;
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = cum[cum.length - 1];
  if (!total) return null;
  const out = [];
  let j = 0;
  for (let k = 0; k < 64; k++) {
    const target = (total * k) / 63;
    while (j < pts.length - 2 && cum[j + 1] < target) j++;
    const u = cum[j + 1] === cum[j] ? 0 : (target - cum[j]) / (cum[j + 1] - cum[j]);
    out.push([pts[j][0] + (pts[j + 1][0] - pts[j][0]) * u, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * u]);
  }
  let cx = 0, cy = 0;
  for (const p of out) { cx += p[0] / 64; cy += p[1] / 64; }
  let rms = 0;
  for (const p of out) rms += ((p[0] - cx) ** 2 + (p[1] - cy) ** 2) / 64;
  rms = Math.sqrt(rms) || 1;
  return out.map((p) => [(p[0] - cx) / rms, (p[1] - cy) / rms]);
}
export function shapeDistance(a, b) {
  if (!a || !b) return null;
  let d = 0;
  for (let i = 0; i < 64; i++) d += Math.hypot(a[i][0] - b[i][0], a[i][1] - b[i][1]);
  return d / 64;
}

// -------------------------------------------------------------- baseline
export const FEATS = [
  { k: 'timeToFirstMs', label: 'Time to first stroke', unit: 'ms', worse: 'up', word: 'more hesitant', other: 'quicker to start' },
  { k: 'totalMs', label: 'Total time', unit: 'ms', worse: 'up', word: 'slower', other: 'faster' },
  { k: 'inAirMs', label: 'In-air time', unit: 'ms', worse: 'up', word: 'more hesitant', other: 'more fluent' },
  { k: 'strokes', label: 'Strokes', unit: '', worse: 'up', word: 'more broken up', other: 'in fewer strokes' },
  { k: 'meanSpeed', label: 'Mean speed', unit: 'pad/s', worse: 'down', word: 'slower', other: 'faster' },
  { k: 'smoothness', label: 'Smoothness', unit: 'LDLJ', worse: 'down', word: 'shakier', other: 'steadier' },
  { k: 'width', label: 'Width', unit: 'pad', worse: 'down', word: 'smaller', other: 'larger' },
  { k: 'height', label: 'Height', unit: 'pad', worse: 'down', word: 'smaller', other: 'larger' },
  { k: 'shapeDistance', label: 'Shape distance', unit: '', worse: 'up', word: 'a different shape', other: 'closer to usual' }
];

export const store = {
  all() { return load('signatures', []); },
  add(rec) { const a = this.all(); a.push(rec); save('signatures', a.slice(-60)); return a; },
  clear() { save('signatures', []); }
};

export function baseline(records = store.all()) {
  if (records.length < BASE_N) return null;
  const base = records.slice(0, BASE_N);
  const shapes = base.map((r) => r.shape).filter(Boolean);
  let template = null;
  if (shapes.length) {
    template = [];
    for (let i = 0; i < 64; i++) {
      let x = 0, y = 0;
      for (const s of shapes) { x += s[i][0] / shapes.length; y += s[i][1] / shapes.length; }
      template.push([x, y]);
    }
  }
  const stats = {};
  for (const F of FEATS) {
    const xs = base.map((r) => (F.k === 'shapeDistance' ? shapeDistance(r.shape, template) : r.features[F.k]));
    const s = robustStats(xs);
    if (s) stats[F.k] = s;
  }
  return { n: BASE_N, template, stats };
}

export function deviation(rec, bl, person) {
  if (!bl) return null;
  const z = {}, flags = [];
  let sum = 0, n = 0;
  for (const F of FEATS) {
    const st = bl.stats[F.k];
    if (!st) continue;
    const value = F.k === 'shapeDistance' ? shapeDistance(rec.shape, bl.template) : rec.features[F.k];
    if (value == null || !isFinite(value)) continue;
    const zz = zScore(value, st);
    z[F.k] = { value, usual: st.median, z: zz };
    sum += Math.abs(zz); n++;
    if (Math.abs(zz) > 2) {
      const worseWay = F.worse === 'up' ? zz > 0 : zz < 0;
      flags.push({ k: F.k, z: zz, word: worseWay ? F.word : F.other });
    }
  }
  const words = [];
  for (const f of flags) if (!words.includes(f.word)) words.push(f.word);
  const sentence = words.length
    ? `${person}'s signature was ${words.length === 1 ? words[0] : words.slice(0, -1).join(', ') + ' and ' + words[words.length - 1]} than usual today.`
    : `${person}'s signature was about the same as usual today.`;
  return { z, composite: n ? sum / n : null, flags, sentence };
}

export function sigPaths(strokes, width, strokeW = 3) {
  return strokes.map((s) => {
    if (!s.length) return '';
    let d = `M ${(s[0][0] * width).toFixed(1)} ${(s[0][1] * width).toFixed(1)}`;
    for (let i = 1; i < s.length; i++) d += ` L ${(s[i][0] * width).toFixed(1)} ${(s[i][1] * width).toFixed(1)}`;
    if (s.length === 1) d += ' l 0.5 0';
    return `<path d="${d}" fill="none" stroke="#111827" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join('');
}

// ------------------------------------------------------------ the activity
export function runSignature(ui, ctx) {
  return new Promise((resolve) => {
    const rec = { at: new Date().toISOString(), inputType: 'finger', padWidth: 0 };
    let sig = null, live = null, padW = 0, padH = 0, ctx2d = null, canvas = null;

    function redraw() {
      if (!ctx2d) return;
      ctx2d.clearRect(0, 0, padW, padH);
      ctx2d.lineWidth = 4; ctx2d.lineCap = 'round'; ctx2d.lineJoin = 'round'; ctx2d.strokeStyle = '#111827';
      if (!sig) return;
      for (const s of sig.strokes.concat(live ? [live] : [])) {
        if (!s.length) continue;
        ctx2d.beginPath();
        ctx2d.moveTo(s[0].x * padW, s[0].y * padW);
        for (let i = 1; i < s.length; i++) ctx2d.lineTo(s[i].x * padW, s[i].y * padW);
        if (s.length === 1) ctx2d.lineTo(s[0].x * padW + 0.1, s[0].y * padW);
        ctx2d.stroke();
      }
    }
    function sizePad(wrap) {
      const r = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      padW = r.width; padH = r.height;
      canvas.width = Math.round(padW * dpr); canvas.height = Math.round(padH * dpr);
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    }

    // ---- screen 1: the pad
    function askForSignature() {
      ui.title(`${greeting()}, ${ctx.person}.`);
      const body = el('div');
      el('p', { class: 'text text--large', text: 'Sign my book to come in.' }, body);
      const wrap = el('div', { class: 'pad-wrap', id: 'pad-wrap' }, body);
      canvas = el('canvas', { id: 'pad', 'aria-label': 'Signature pad. Draw your signature with a finger.' }, wrap);
      el('span', { class: 'pad-x', 'aria-hidden': 'true', text: '×' }, wrap);
      el('div', { class: 'pad-line', 'aria-hidden': 'true' }, wrap);
      const hint = el('div', { class: 'pad-hint', id: 'pad-hint', 'aria-hidden': 'true', text: 'Sign on the line' }, wrap);
      el('p', { class: 'text text--soft', text: 'Any signature is fine. There is no wrong way.' }, body);
      ui.body(body);
      ctx2d = canvas.getContext('2d');
      sig = { shownAt: Math.round(now()), strokes: [] };
      requestAnimationFrame(() => sizePad(wrap));
      const onResize = () => sizePad(wrap);
      window.addEventListener('resize', onResize);
      ctx.cleanups.push(() => window.removeEventListener('resize', onResize));

      const point = (ev) => {
        const r = canvas.getBoundingClientRect();
        return { x: (ev.clientX - r.left) / padW, y: (ev.clientY - r.top) / padW, t: Math.round(now()) };
      };
      canvas.addEventListener('pointerdown', (ev) => {
        if (!sig || live) return;
        ev.preventDefault();
        try { canvas.setPointerCapture(ev.pointerId); } catch { /* not captured */ }
        live = [point(ev)]; live.pointerId = ev.pointerId;
        rec.inputType = ev.pointerType || 'finger';
        hint.hidden = true;
        if (!sig.strokes.length) events.push('signature', 'firstStroke', { sinceShownMs: live[0].t - sig.shownAt, input: rec.inputType });
        redraw();
      });
      canvas.addEventListener('pointermove', (ev) => {
        if (!live || ev.pointerId !== live.pointerId) return;
        ev.preventDefault();
        const list = ev.getCoalescedEvents ? ev.getCoalescedEvents() : [ev];
        for (const e of (list.length ? list : [ev])) live.push(point(e));
        redraw();
      });
      const end = (ev) => {
        if (!live || ev.pointerId !== live.pointerId) return;
        const s = live; live = null;
        sig.strokes.push(s);
        events.push('signature', 'stroke', { n: sig.strokes.length, points: s.length, durationMs: s[s.length - 1].t - s[0].t });
        setActions();
        redraw();
      };
      canvas.addEventListener('pointerup', end);
      canvas.addEventListener('pointercancel', end);

      function setActions() {
        ui.actions([
          { label: 'Start again', kind: 'secondary', onClick: () => {
              events.push('signature', 'startAgain', { strokesCleared: sig.strokes.length });
              sig = { shownAt: Math.round(now()), strokes: [] }; live = null; hint.hidden = false; setActions(); redraw();
            } },
          { label: 'Done signing', kind: 'huge', disabled: !sig.strokes.length, onClick: () => {
              rec.padWidth = Math.round(padW);
              rec.features = signatureFeatures(sig.strokes, sig.shownAt);
              rec.shape = rec.features.shape;
              rec.strokes = sig.strokes.map((s) => s.map((p) => [+p.x.toFixed(4), +p.y.toFixed(4), p.t - sig.shownAt]));
              events.push('signature', 'done', { strokes: rec.features.strokes, totalMs: Math.round(rec.features.totalMs) });
              askForDate();
            } }
        ]);
      }
      setActions();
      events.push('signature', 'shown', {});
    }

    // ---- screen 2: what is today
    function askForDate() {
      ui.title('What is today?');
      const body = el('div');
      el('p', { class: 'text text--soft', text: 'Tap the date, as best you know it.' }, body);
      const d0 = new Date(); d0.setHours(12, 0, 0, 0);
      const opts = [-1, 0, 1].map((o) => { const d = new Date(d0); d.setDate(d.getDate() + o); return { label: fmtDate(d), offset: o }; });
      for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [opts[i], opts[j]] = [opts[j], opts[i]]; }
      opts.push({ label: "I'm not sure", offset: null });
      const shownAt = now();
      const wrap = el('div', { class: 'answers' }, body);
      for (const o of opts) {
        el('button', { type: 'button', class: 'answer', text: o.label, onclick: () => {
          rec.dateAnswer = { picked: o.offset, correct: o.offset === 0, notSure: o.offset === null, responseMs: Math.round(now() - shownAt) };
          events.push('signature', 'dateAnswered', rec.dateAnswer);
          thankYou();
        } }, wrap);
      }
      ui.body(body);
      ui.actions([]);
    }

    // ---- screen 3: your page in the book
    function thankYou() {
      const records = store.add(rec);
      const bl = baseline(records.slice(0, -1).length >= BASE_N ? records.slice(0, -1) : records);
      rec.deviation = deviation(rec, baseline(records), ctx.person);
      events.push('signature', 'complete', { signing: records.length, baselineReady: !!baseline(records) });
      ui.title(`Thank you, ${ctx.person}.`);
      const body = el('div');
      el('div', { class: 'notice notice--success', role: 'status',
        html: '<span class="notice__icon" aria-hidden="true">✓</span><div><p class="notice__title">Done</p><p>Lovely to see you. Here is your page in the book.</p></div>' }, body);
      const page = el('div', { class: 'page' }, body);
      page.innerHTML = `<svg viewBox="0 0 400 200" role="img" aria-label="Your signature">`
        + `<line x1="30" y1="150" x2="370" y2="150" stroke="#4b5563" stroke-width="2"/>`
        + `<text x="12" y="156" font-size="20" fill="#374151">×</text>`
        + sigPaths(rec.strokes, 400) + `</svg>`
        + `<p class="page__date">${esc(fmtDate(new Date()))}</p>`;
      ui.body(body);
      ui.actions([{ label: 'Carry on', kind: 'huge', onClick: () => resolve(rec) }]);
    }

    askForSignature();
  });
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}
