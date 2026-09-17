// The jigsaw (doc 0008). Interlocking pieces moved by finger; a generous magnet
// clicks them into the board and onto each other. Anna can "join from afar",
// which is mocked on this same phone for the demo.

import { svg, el, now, events, mean, median } from './core.js';

const PIC_W = 1200, PIC_H = 900;
const PARTNER = 'Anna';
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6D2B79F5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function edgePath(P0, P1, N, k, s) {
  const dx = P1.x - P0.x, dy = P1.y - P0.y;
  const P = (u, v) => `${(P0.x + u * dx + k * v * s * N.x).toFixed(1)} ${(P0.y + u * dy + k * v * s * N.y).toFixed(1)}`;
  if (k === 0) return `L ${P(1, 0)}`;
  return `L ${P(0.36, 0)}`
    + ` C ${P(0.44, 0)} ${P(0.40, 0.10)} ${P(0.42, 0.16)}`
    + ` C ${P(0.36, 0.20)} ${P(0.32, 0.32)} ${P(0.50, 0.32)}`
    + ` C ${P(0.68, 0.32)} ${P(0.64, 0.20)} ${P(0.58, 0.16)}`
    + ` C ${P(0.60, 0.10)} ${P(0.56, 0)} ${P(0.64, 0)}`
    + ` L ${P(1, 0)}`;
}
function piecePath(col, row, cw, ch, edges, s) {
  const x = col * cw, y = row * ch;
  return `M ${x} ${y}`
    + ' ' + edgePath({ x, y }, { x: x + cw, y }, { x: 0, y: -1 }, edges.top, s)
    + ' ' + edgePath({ x: x + cw, y }, { x: x + cw, y: y + ch }, { x: 1, y: 0 }, edges.right, s)
    + ' ' + edgePath({ x: x + cw, y: y + ch }, { x, y: y + ch }, { x: 0, y: 1 }, edges.bottom, s)
    + ' ' + edgePath({ x, y: y + ch }, { x, y }, { x: -1, y: 0 }, edges.left, s)
    + ' Z';
}

export function runJigsaw(ui, ctx, { pieces: count = 12, withPartner = false } = {}) {
  return new Promise((resolve) => {
    const seed = (Math.random() * 4294967296) >>> 0;
    const log = [];
    const rec = (kind, extra = {}) => { const e = events.push('jigsaw', kind, extra); log.push(e); };

    const cols = count === 20 ? 5 : 4, rows = count === 20 ? 4 : 3;
    const cw = PIC_W / cols, ch = PIC_H / rows, s = Math.min(cw, ch);
    // Margins and tray overlap are kept tight on purpose: the whole board is
    // scaled to fit the screen, so every unit of padding shrinks the pieces.
    const M = Math.round(0.12 * s) + 8;
    const trayTop = M + PIC_H + Math.round(0.18 * s);
    // Tray spacing. Only the vertical pitch feeds H, and the board is scaled to
    // fit its box, so spreading sideways separates the pieces for nothing while
    // a taller tray would cost piece size everywhere.
    const PITCH_X = 0.95, PITCH_Y = 1.05;
    const W = PIC_W + 2 * M;
    const H = trayTop + (Math.ceil(count / cols) - 1) * ch * PITCH_Y + ch + M;
    const R = 0.45 * s;                       // magnetic radius, generous on purpose
    const rand = rng(seed);

    // --- screen. The board needs the height, so everything that is not the
    // board gives it up: no step track, a heading only a screen reader hears,
    // progress and the way out in the top bar, one button in the footer.
    ui.title('Finish the picture', { hidden: true });
    ui.steps(null);
    ui.fixed(true);
    const body = el('div', { style: 'display:flex;flex-direction:column;flex:1;min-height:0' });
    const instruction = el('p', { class: 'text' }, body);
    const play = el('div', { class: 'play' }, body);
    const board = svg('svg', { id: 'play', preserveAspectRatio: 'xMidYMid meet', viewBox: `0 0 ${W} ${H}`, 'aria-label': 'Jigsaw pieces and the board' }, play);
    ui.body(body);

    // --- pieces
    const hEdge = [], vEdge = [];
    for (let r = 0; r < rows; r++) {
      hEdge.push([]); vEdge.push([]);
      for (let c = 0; c < cols; c++) { hEdge[r].push(rand() < 0.5 ? 1 : -1); vEdge[r].push(rand() < 0.5 ? 1 : -1); }
    }
    const pieces = [];
    for (let rr = 0; rr < rows; rr++) for (let cc = 0; cc < cols; cc++) {
      const edges = {
        top: rr === 0 ? 0 : (hEdge[rr][cc] === 1 ? -1 : 1),
        bottom: rr === rows - 1 ? 0 : (hEdge[rr + 1][cc] === 1 ? 1 : -1),
        left: cc === 0 ? 0 : (vEdge[rr][cc] === 1 ? -1 : 1),
        right: cc === cols - 1 ? 0 : (vEdge[rr][cc + 1] === 1 ? 1 : -1)
      };
      pieces.push({ i: pieces.length, col: cc, row: rr, d: piecePath(cc, rr, cw, ch, edges, s) });
    }

    const defs = svg('defs', {}, board);
    for (const p of pieces) svg('path', { d: p.d }, svg('clipPath', { id: 'clip-' + p.i }, defs));
    svg('rect', { x: M, y: M, width: PIC_W, height: PIC_H, fill: '#f3f4f6', stroke: '#4b5563', 'stroke-width': 4, 'stroke-dasharray': '18 12', rx: 8, 'pointer-events': 'none' }, board);
    const ghost = svg('g', { opacity: 0.22, 'pointer-events': 'none' }, board);
    svg('use', { href: '#scene', x: M, y: M, width: PIC_W, height: PIC_H }, ghost);
    const hintSlot = svg('path', { fill: '#dbeafe', stroke: '#1e40af', 'stroke-width': 8, 'pointer-events': 'none', visibility: 'hidden' }, board);
    const layer = svg('g', {}, board);
    const tagLayer = svg('g', { 'pointer-events': 'none' }, board);

    const order = pieces.map((p) => p.i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }

    let clusters = [];
    function makeCluster(ps, tx, ty, locked) {
      const g = svg('g', { class: 'cluster' }, layer);
      const cl = { g, pieces: [], tx, ty, locked };
      for (const p of ps) addPiece(cl, p);
      if (locked) layer.insertBefore(g, layer.firstChild);
      setT(cl, tx, ty);
      clusters.push(cl);
      return cl;
    }
    function addPiece(cl, p) {
      const pg = svg('g', { class: 'piece' + (cl.locked ? ' piece--locked' : ''), 'data-i': p.i }, cl.g);
      const img = svg('g', { 'clip-path': `url(#clip-${p.i})` }, pg);
      svg('use', { href: '#scene', x: 0, y: 0, width: PIC_W, height: PIC_H }, img);
      svg('path', { d: p.d, fill: 'none', stroke: '#4b5563', 'stroke-width': 4, 'stroke-linejoin': 'round', class: 'piece__outline' }, pg);
      svg('path', { d: p.d, fill: '#000', 'fill-opacity': 0, stroke: 'none' }, pg);   // hit area
      p.node = pg; p.cluster = cl; cl.pieces.push(p);
    }
    const setT = (cl, tx, ty) => { cl.tx = tx; cl.ty = ty; cl.g.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)})`); };
    const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
    function adjacent(a, b) {
      for (const p of a.pieces) for (const q of b.pieces) if (Math.abs(p.col - q.col) + Math.abs(p.row - q.row) === 1) return true;
      return false;
    }
    function merge(into, from) {
      for (const p of from.pieces) { into.g.appendChild(p.node); p.cluster = into; into.pieces.push(p); if (into.locked) p.node.classList.add('piece--locked'); }
      from.g.remove();
      clusters.splice(clusters.indexOf(from), 1);
    }
    function lock(cl) {
      cl.locked = true; setT(cl, M, M);
      for (const p of cl.pieces) p.node.classList.add('piece--locked');
      layer.insertBefore(cl.g, layer.firstChild);
      for (const o of clusters.filter((o) => o !== cl && o.locked)) merge(cl, o);
    }
    function clamp(cl) {
      const b = cl.g.getBBox();
      setT(cl, Math.min(Math.max(cl.tx, -b.x + 4), W - b.x - b.width - 4), Math.min(Math.max(cl.ty, -b.y + 4), H - b.y - b.height - 4));
    }
    const lockedCount = () => clusters.reduce((n, c) => n + (c.locked ? c.pieces.length : 0), 0);

    order.forEach((pi, n) => {
      const p = pieces[pi];
      const jitter = () => (rand() - 0.5) * 0.08 * s;
      makeCluster([p],
        M + (n % cols) * cw * PITCH_X + 0.05 * cw - p.col * cw + jitter(),
        trayTop + Math.floor(n / cols) * ch * PITCH_Y - p.row * ch + jitter(), false);
    });

    // One line, kept short on purpose: a second line here costs the board ~36px,
    // which is the difference between a 60px and a 54px piece at 13 inches.
    // Dragging still works and is discovered by trying; the partner is named in
    // the top bar's count line rather than here.
    const baseInstruction = () => 'Tap a piece, then tap the picture.';
    instruction.textContent = baseInstruction();

    // --- dragging
    const drags = {};
    let hintPiece = null, lastTouched = null, finished = false;
    let chosen = null, swallowClick = false;
    const partner = { here: false, holding: null, placed: 0, timer: null, raf: null };

    const svgPoint = (ev) => {
      const pt = board.createSVGPoint();
      pt.x = ev.clientX; pt.y = ev.clientY;
      return pt.matrixTransform(board.getScreenCTM().inverse());
    };
    const heldByMe = (cl) => Object.values(drags).some((d) => d.cl === cl);
    const heldByAnyone = (cl) => heldByMe(cl) || partner.holding === cl;

    board.addEventListener('pointerdown', (ev) => {
      const node = ev.target.closest ? ev.target.closest('.piece') : null;
      if (!node) return;
      const p = pieces[+node.getAttribute('data-i')];
      const cl = p.cluster;
      if (cl.locked || heldByAnyone(cl) || Object.keys(drags).length) return;
      ev.preventDefault();
      layer.appendChild(cl.g);
      cl.g.classList.add('cluster--dragging');
      const pt = svgPoint(ev);
      drags[ev.pointerId] = { cl, piece: p, sx: pt.x, sy: pt.y, tx: cl.tx, ty: cl.ty, path: [[pt.x, pt.y, Math.round(now())]] };
      lastTouched = p;
      try { board.setPointerCapture(ev.pointerId); } catch { /* not captured */ }
      if (!game.firstMoveAt) { game.firstMoveAt = now(); rec('firstMove', { piece: p.i }); }
      rec('pick', { piece: p.i, cluster: cl.pieces.length });
    });
    board.addEventListener('pointermove', (ev) => {
      const d = drags[ev.pointerId];
      if (!d) return;
      ev.preventDefault();
      const pt = svgPoint(ev);
      d.path.push([pt.x, pt.y, Math.round(now())]);
      setT(d.cl, d.tx + (pt.x - d.sx), d.ty + (pt.y - d.sy));
    });
    const endDrag = (ev) => {
      const d = drags[ev.pointerId];
      if (!d) return;
      delete drags[ev.pointerId];
      d.cl.g.classList.remove('cluster--dragging');
      clamp(d.cl);
      let len = 0;
      for (let i = 1; i < d.path.length; i++) len += Math.hypot(d.path[i][0] - d.path[i - 1][0], d.path[i][1] - d.path[i - 1][1]);
      const last = d.path[d.path.length - 1];
      const straight = Math.hypot(last[0] - d.path[0][0], last[1] - d.path[0][1]);

      // The board captures the pointer, so the click that follows is retargeted
      // off the piece. A tap has to be recognised here, from the path itself.
      swallowClick = true;
      setTimeout(() => { swallowClick = false; }, 0);
      if (len < TAP_SLOP) {
        setT(d.cl, d.tx, d.ty);           // put back the pixel a shaky tap moved
        if (chosen && chosen.cluster !== d.cl && inPicture(last[0], last[1])) placeChosen();
        else if (chosen && chosen.cluster === d.cl) unchoose();
        else choose(d.piece);
        return;
      }
      unchoose();
      rec('release', { piece: d.piece.i, pathLen: Math.round(len), straight: Math.round(straight), samples: d.path.length,
        durationMs: last[2] - d.path[0][2] });
      snap(d.cl, d.piece);
    };
    board.addEventListener('pointerup', endDrag);
    board.addEventListener('pointercancel', endDrag);

    // Dragging is the fastest way and it stays, but it is the hardest thing to
    // ask of an arthritic or tremulous hand, so it is never the only way: tap
    // the piece, tap the picture. Both paths end in the same snap().
    const TAP_SLOP = 0.12 * s;
    const inPicture = (x, y) => x >= M && x <= M + PIC_W && y >= M && y <= M + PIC_H;
    function choose(p) {
      unchoose();
      chosen = p;
      layer.appendChild(p.cluster.g);
      p.cluster.g.classList.add('cluster--chosen');
      lastTouched = p;
      instruction.textContent = 'Now tap the picture.';
      if (!game.firstMoveAt) { game.firstMoveAt = now(); rec('firstMove', { piece: p.i }); }
      rec('choose', { piece: p.i, cluster: p.cluster.pieces.length });
    }
    function unchoose() {
      if (!chosen) return;
      chosen.cluster.g.classList.remove('cluster--chosen');
      chosen = null;
      if (!hintPiece) instruction.textContent = baseInstruction();
    }
    function placeChosen() {
      const p = chosen, cl = p.cluster;
      chosen.cluster.g.classList.remove('cluster--chosen');
      chosen = null;
      rec('tapPlace', { piece: p.i, pieces: cl.pieces.length });
      setT(cl, M, M);
      snap(cl, p);
      if (!hintPiece && !finished) instruction.textContent = baseInstruction();
    }
    // Taps that land on a piece are handled above; this is the picture itself,
    // and locked pieces sitting on it, which never start a drag.
    board.addEventListener('click', (ev) => {
      if (swallowClick || finished || !chosen) return;
      const pt = svgPoint(ev);
      if (inPicture(pt.x, pt.y)) placeChosen();
    });

    function snap(cl, dragged) {
      let snapped = false;
      if (dist(cl.tx, cl.ty, M, M) < R) {
        lock(cl); snapped = true;
        rec('snap', { piece: dragged.i, to: 'board', pieces: cl.pieces.length });
      } else {
        let again = true;
        while (again) {
          again = false;
          for (const o of clusters) {
            if (o === cl || o.locked || heldByAnyone(o)) continue;
            if (adjacent(cl, o) && dist(cl.tx, cl.ty, o.tx, o.ty) < R) {
              setT(cl, o.tx, o.ty); merge(cl, o); again = true; snapped = true;
              rec('snap', { piece: dragged.i, to: 'neighbour', pieces: cl.pieces.length });
              break;
            }
          }
        }
        if (snapped && dist(cl.tx, cl.ty, M, M) < R) lock(cl);
      }
      if (!snapped) rec('drop', { piece: dragged.i, nearMiss: dist(cl.tx, cl.ty, M, M) < 2 * R });
      if (hintPiece && hintPiece.cluster.locked) hideHint();
      updateStatus();
      if (lockedCount() === pieces.length) finish();
    }

    // --- the mocked partner
    function partnerStart() {
      partner.timer = setTimeout(() => {
        partner.here = true;
        updateStatus();
        rec('partnerJoined', { name: PARTNER });
        partnerSchedule(2500 + Math.random() * 3000);
      }, 2500);
    }
    const partnerSchedule = (delay) => {
      if (!partner.here || finished) return;
      partner.timer = setTimeout(partnerMove, delay == null ? 9000 + Math.random() * 8000 : delay);
    };
    function partnerMove() {
      if (!partner.here || finished) return;
      const left = pieces.length - lockedCount();
      const loose = clusters.filter((c) => !c.locked && !heldByMe(c));
      if (left <= 3 || partner.placed >= Math.floor(pieces.length / 3) || !loose.length) return partnerSchedule();
      const singles = loose.filter((c) => c.pieces.length === 1);
      const pool = singles.length ? singles : loose;
      const cl = pool[Math.floor(Math.random() * pool.length)];
      const p = cl.pieces[0];
      partner.holding = cl;
      layer.appendChild(cl.g);
      cl.g.classList.add('cluster--peer');
      if (hintPiece && hintPiece.cluster === cl) hideHint();
      const from = { x: cl.tx, y: cl.ty }, to = { x: M, y: M };
      const lift = -0.25 * s, duration = reduceMotion ? 0 : 1500;
      let t0 = null;
      rec('partnerPick', { piece: p.i });
      const tag = (x, y) => {
        tagLayer.innerHTML = '';
        const cx = x + p.col * cw + cw / 2, cy = y + p.row * ch - 0.12 * s;
        const wdt = PARTNER.length * 0.12 * s + 0.36 * s;
        svg('rect', { x: cx - wdt / 2, y: cy - 0.24 * s, width: wdt, height: 0.32 * s, rx: 0.08 * s, class: 'tag__box' }, tagLayer);
        svg('text', { x: cx, y: cy, 'text-anchor': 'middle', 'font-size': 0.21 * s, class: 'tag__text' }, tagLayer).textContent = PARTNER;
      };
      tag(from.x, from.y);
      const done = () => {
        setT(cl, to.x, to.y);
        cl.g.classList.remove('cluster--peer');
        tagLayer.innerHTML = '';
        partner.holding = null;
        lock(cl); partner.placed++;
        rec('snap', { piece: p.i, to: 'board', pieces: cl.pieces.length, by: 'partner' });
        updateStatus();
        if (lockedCount() === pieces.length) finish(); else partnerSchedule();
      };
      const step = (ts) => {
        if (!partner.here) return;
        if (t0 === null) t0 = ts;
        const u = Math.min(1, (ts - t0) / duration);
        const e = u < 0.5 ? 2 * u * u : 1 - ((-2 * u + 2) ** 2) / 2;
        const x = from.x + (to.x - from.x) * e;
        const y = from.y + (to.y - from.y) * e + lift * Math.sin(Math.PI * u);
        setT(cl, x, y); tag(x, y);
        if (u < 1) partner.raf = requestAnimationFrame(step); else done();
      };
      partner.timer = setTimeout(() => { if (duration === 0) done(); else partner.raf = requestAnimationFrame(step); }, 700);
    }
    function partnerStop() {
      partner.here = false;
      clearTimeout(partner.timer);
      if (partner.raf) cancelAnimationFrame(partner.raf);
      if (partner.holding) { partner.holding.g.classList.remove('cluster--peer'); partner.holding = null; }
      tagLayer.innerHTML = '';
    }
    ctx.cleanups.push(partnerStop);

    // --- hint
    function showHint() {
      let p = lastTouched && !lastTouched.cluster.locked && partner.holding !== lastTouched.cluster ? lastTouched : null;
      if (!p) {
        const loose = pieces.filter((q) => !q.cluster.locked && partner.holding !== q.cluster);
        p = loose[Math.floor(Math.random() * loose.length)];
      }
      if (!p) return;
      hintPiece = p;
      hintSlot.setAttribute('d', p.d);
      hintSlot.setAttribute('transform', `translate(${M} ${M})`);
      hintSlot.setAttribute('visibility', 'visible');
      const o = p.node.querySelector('.piece__outline');
      o.setAttribute('stroke', '#1e40af'); o.setAttribute('stroke-width', '8');
      instruction.textContent = 'The outlined piece goes in the outlined spot.';
      rec('hint', { piece: p.i });
    }
    function hideHint() {
      if (!hintPiece) return;
      hintSlot.setAttribute('visibility', 'hidden');
      const o = hintPiece.node.querySelector('.piece__outline');
      o.setAttribute('stroke', '#4b5563'); o.setAttribute('stroke-width', '4');
      hintPiece = null;
      instruction.textContent = chosen ? 'Now tap the picture.' : baseInstruction();
    }
    function updateStatus() {
      const left = pieces.length - lockedCount();
      const who = withPartner ? (partner.here ? ` · ${PARTNER} is here` : ` · Waiting for ${PARTNER}`) : '';
      ui.topbarNote((left === 0 ? 'All in place.' : left === 1 ? '1 piece left' : `${left} pieces left`) + who);
    }
    // Stopping puts every placed piece back, so it asks once anything is placed,
    // the same way leaving the whole visit does.
    function askToLeave() {
      if (finished) return;
      if (!lockedCount()) return leave();
      ui.confirm({
        title: 'Stop the puzzle?', body: 'The pieces you have placed will be put back.',
        no: 'No, keep playing', yes: 'Yes, stop', onYes: leave
      });
    }
    function leave() {
      if (finished) return;
      finished = true; partnerStop();
      game.completedAt = now(); game.abandoned = true;
      rec('abandoned', { placed: lockedCount(), of: pieces.length });
      game.features = jigsawFeatures(game);
      ui.fixed(false);
      resolve(game);
    }

    const game = { seed, pieces, count, withPartner, startedAt: now(), firstMoveAt: null, completedAt: null, log,
      partnerPlaced: () => partner.placed };

    function finish() {
      if (finished) return;
      finished = true;
      partnerStop();
      game.completedAt = now();
      rec('completed', { pieces: pieces.length, byPartner: partner.placed });
      game.features = jigsawFeatures(game);
      ui.fixed(false);
      resolve(game);
    }

    ui.topbarAction({ label: 'Stop the puzzle', onClick: askToLeave });
    // One line: this button wrapping to two costs the board 55px, and the board
    // is where the tappable targets are.
    ui.actions([{ label: 'Help me with a piece', kind: 'secondary', onClick: showHint }]);
    updateStatus();
    rec('shown', { pieces: count, withPartner });
    if (withPartner) partnerStart();
  });
}

// Statistics for the visit record (doc 0008 section 6.1).
export function jigsawFeatures(game) {
  const log = game.log;
  const mine = (e) => e.by !== 'partner';
  const start = log.length ? log[0].t : 0;
  const picks = log.filter((e) => e.kind === 'pick');
  const releases = log.filter((e) => e.kind === 'release');
  const drops = log.filter((e) => e.kind === 'drop');
  const snapsAll = log.filter((e) => e.kind === 'snap');
  const snaps = snapsAll.filter(mine);
  const f = {
    pieces: game.pieces.length,
    withPartner: !!game.withPartner,
    completed: !game.abandoned,
    timeToFirstMoveMs: game.firstMoveAt ? Math.round(game.firstMoveAt - game.startedAt) : null,
    totalMs: Math.round((game.completedAt || now()) - game.startedAt),
    picks: picks.length,
    placedMine: snaps.length,
    placedPartner: snapsAll.length - snaps.length,
    looseDrops: drops.length,
    nearMisses: drops.filter((e) => e.nearMiss).length,
    hints: log.filter((e) => e.kind === 'hint').length
  };
  const perPiece = {};
  for (const e of drops) perPiece[e.piece] = (perPiece[e.piece] || 0) + 1;
  f.perseveration = Object.values(perPiece).filter((n) => n >= 2).length;

  const straight = releases.filter((e) => e.pathLen > 0).map((e) => Math.min(1, e.straight / Math.max(e.pathLen, 1)));
  f.straightnessMean = straight.length ? +mean(straight).toFixed(3) : null;
  f.straightness = straight;

  const gaps = [];
  for (let i = 0; i < snapsAll.length; i++) gaps.push({ by: snapsAll[i].by === 'partner' ? 'partner' : 'me', gapMs: snapsAll[i].t - (i ? snapsAll[i - 1].t : start), piece: snapsAll[i].piece });
  f.placements = gaps;
  const mineGaps = gaps.filter((g) => g.by === 'me').map((g) => g.gapMs);
  f.placementMedianMs = mineGaps.length ? median(mineGaps) : null;
  const m = mean(mineGaps);
  f.placementCv = mineGaps.length > 1 && m
    ? +(Math.sqrt(mineGaps.reduce((a, b) => a + (b - m) ** 2, 0) / (mineGaps.length - 1)) / m).toFixed(3) : null;

  let coherent = 0;
  for (let i = 1; i < snaps.length; i++) {
    const a = game.pieces[snaps[i - 1].piece], b = game.pieces[snaps[i].piece];
    if (Math.abs(a.col - b.col) + Math.abs(a.row - b.row) === 1) coherent++;
  }
  f.orderCoherence = snaps.length > 1 ? +(coherent / (snaps.length - 1)).toFixed(2) : null;

  const own = log.filter((e) => ['pick', 'release', 'shown', 'hint'].includes(e.kind) && mine(e));
  f.lapses = 0; f.longestGapMs = 0;
  for (let i = 1; i < own.length; i++) {
    const g = own[i].t - own[i - 1].t;
    if (g > 8000) f.lapses++;
    if (g > f.longestGapMs) f.longestGapMs = g;
  }
  // Together sessions are shared work: motor measures hold, attention measures do not.
  f.baselineEligible = game.withPartner ? 'motor only' : true;
  return f;
}
