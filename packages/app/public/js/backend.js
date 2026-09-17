// The backend view: what the visit collected, as it is collected. Demo only —
// the person never sees any of this.

import { $, el, esc, ms, secs, mean, median, events } from './core.js';
import { baseline, deviation, store as sigStore, sigPaths, FEATS, BASE_N } from './signature.js';
import { runbook, SCRIPTS, DAY_CAP, checkPlainLanguage, answerWords, cadenceWords, ruleWords } from './runbook.js';
import { languageHeuristics } from './chat.js';

export function mountBackend(visit) {
  let open = false, tab = 'visit', pending = false;
  const root = $('backend');

  events.onChange(() => schedule());

  function schedule() {
    if (!open || pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; render(); });
  }
  function toggle(on) {
    open = on;
    root.hidden = !on;
    $('backend-toggle').setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on) render();
  }

  function render() {
    const parts = [];
    parts.push(`<h2>Backend view</h2><p class="meta">${esc(metaLine())}</p>`);
    parts.push(`<div class="tabs" role="tablist">${['visit', 'runbook', 'events']
      .map((t) => `<button class="tab" role="tab" aria-selected="${t === tab}" data-tab="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</div>`);
    parts.push(tab === 'visit' ? visitTab() : tab === 'runbook' ? runbookTab() : eventsTab());
    root.innerHTML = parts.join('');
    wire();
  }

  function metaLine() {
    const bits = [
      `person ${visit.person}`,
      `runbook ${runbook.script().name}`,
      `reader ${visit.model ? visit.model.model : 'none (tap-only fallback)'}`,
      `events ${events.list.length}`
    ];
    return bits.join(' · ');
  }

  // ------------------------------------------------------------ visit tab
  function visitTab() {
    const out = [];
    const sig = visit.signature, chat = visit.chat, jig = visit.jigsaw;

    // the one sentence a family member would see
    const dev = sig && sig.deviation;
    const records = sigStore.all();
    if (dev) {
      out.push(`<div class="sentence${dev.flags.length ? ' sentence--flag' : ''}">${esc(dev.sentence)}</div>`);
    } else if (records.length) {
      out.push(`<div class="sentence">Building the signature baseline: ${records.length} of ${BASE_N}. No comparison yet.</div>`);
    }

    // --- signature
    out.push('<h3>Signing in</h3>');
    if (!sig) out.push('<p class="note">Not signed yet.</p>');
    else {
      const f = sig.features;
      out.push(tiles([
        ['Time to first stroke', ms(f.timeToFirstMs), 'initiation'],
        ['Total time', ms(f.totalMs), 'first touch to last lift'],
        ['In-air time', ms(f.inAirMs), 'between strokes'],
        ['Strokes', String(f.strokes), 'pen lifts + 1'],
        ['Mean speed', f.meanSpeed.toFixed(2) + ' pad/s', 'path over drawing time'],
        ['Smoothness', f.smoothness == null ? '–' : f.smoothness.toFixed(2), 'log dimensionless jerk'],
        ['Size', `${Math.round(f.width * 100)}% × ${Math.round(f.height * 100)}%`, 'of pad width'],
        ['Date answer', sig.dateAnswer ? (sig.dateAnswer.notSure ? 'not sure' : sig.dateAnswer.correct ? 'correct' : 'wrong') : '–',
          sig.dateAnswer ? ms(sig.dateAnswer.responseMs) : 'orientation item']
      ]));
      if (dev) {
        const rows = FEATS.map((F) => {
          const q = dev.z[F.k];
          if (!q) return '';
          const flag = Math.abs(q.z) > 2;
          const fmt = (v) => (F.unit === 'ms' ? ms(v) : Number.isInteger(v) ? v : v.toFixed(3));
          return `<tr class="${flag ? 'flag' : ''}"><td>${F.label}</td><td class="num">${fmt(q.value)}</td><td class="num">${fmt(q.usual)}</td><td class="num">${q.z >= 0 ? '+' : ''}${q.z.toFixed(1)}${flag ? ' unusual' : ''}</td></tr>`;
        }).join('');
        out.push(`<table class="z"><thead><tr><th>Feature</th><th class="num">Today</th><th class="num">Usual</th><th class="num">Robust z</th></tr></thead><tbody>${rows}</tbody></table>`);
        out.push(`<p class="note">Robust z = (today − median) / (1.4826 × MAD) over the first ${BASE_N} signatures, with a floor of 8% of the median on the scale. Composite ${dev.composite == null ? '–' : dev.composite.toFixed(2)} · features beyond 2: ${dev.flags.length}.</p>`);
      }
      if (records.length) {
        out.push('<h3>The last seven signatures</h3>');
        out.push('<div class="strip">' + records.slice(-7).map((r, i, arr) => {
          const idx = records.length - arr.length + i;
          const label = idx < BASE_N ? `Day ${idx + 1} · baseline` : (idx === records.length - 1 ? 'Today' : `Day ${idx + 1}`);
          return `<div class="strip__item${idx === records.length - 1 ? ' strip__item--today' : ''}"><svg viewBox="0 0 200 100">${sigPaths(r.strokes, 200, 2)}</svg>${label}</div>`;
        }).join('') + '</div>');
      }
    }

    // --- chat
    out.push('<h3>The chat</h3>');
    if (!chat || !chat.items.length) out.push('<p class="note">Not started.</p>');
    else {
      out.push(`<p class="note" style="margin:0 0 0.5rem">${chat.completed ? 'Finished.' : 'In progress.'} ${chat.items.length} asked, ${chat.items.filter((a) => a.tripped).length} flagged · read by ${chat.mode === 'conversation' ? 'a model' : 'tap-only widgets'}.</p>`);
      out.push(chat.items.map((a) => `<div class="item"><div class="item__row"><span class="item__q">${esc(a.question)}</span>`
        + `<span class="chip ${a.tripped ? 'chip--trip' : 'chip--ok'}">${a.tripped ? 'flag' : a.skipped ? 'skipped' : 'ok'}</span></div>`
        + `<div class="item__meta">${a.skipped ? '<em>skipped</em>' : (a.said ? '“' + esc(a.said) + '” → ' : '') + '<strong>' + esc(String(a.answer) + (a.unit ? ' ' + a.unit : '')) + '</strong>'}`
        + `${a.score != null ? ' · ' + a.score + ' in sequence' : ''}`
        + `${a.followUps && a.followUps.length ? ' · ' + a.followUps.length + ' follow-up' + (a.followUps.length === 1 ? '' : 's') : ''}`
        + `${a.concern ? ' · <span class="chip chip--trip">volunteered a concern</span>' : ''}`
        + ` · answered in ${(a.latencyMs / 1000).toFixed(1)} s</div>`
        + (a.told ? `<div class="item__meta">Told the person: “${esc(a.told)}”</div>` : '')
        + '</div>').join(''));

      const openAnswers = chat.items.filter((a) => a.kind === 'text' && !a.skipped);
      const h = languageHeuristics(openAnswers);
      const lat = chat.items.filter((a) => !a.skipped).map((a) => a.latencyMs);
      const typings = chat.items.filter((a) => a.typing);
      out.push('<h3>Language underneath</h3>');
      out.push(tiles([
        ['Median answer latency', lat.length ? (median(lat) / 1000).toFixed(1) + ' s' : '–', 'question shown to answer'],
        ['Words written', String(h.words), `${openAnswers.length} open answer${openAnswers.length === 1 ? '' : 's'}`],
        ['Type-token ratio', h.ttr == null ? '–' : h.ttr.toFixed(2), 'vocabulary spread'],
        ['Mean word length', h.meanWordLength == null ? '–' : h.meanWordLength.toFixed(1), 'characters'],
        ['Word-finding markers', String(h.markers), '"um", "the thing", …'],
        ['Words per minute', typings.length ? (mean(typings.map((t) => t.typing.wpm || 0)) || 0).toFixed(1) : '–', 'while typing']
      ]));
      const rated = chat.items.filter((a) => a.rating);
      if (rated.length) {
        out.push(`<table class="z"><thead><tr><th>Answer</th><th class="num">Coherence</th><th class="num">On topic</th><th class="num">Fluency</th></tr></thead><tbody>`
          + rated.map((a) => `<tr><td>${esc(String(a.said || a.answer).slice(0, 40))}…<div class="item__meta">${esc(a.rating.note || '')}</div></td><td class="num">${a.rating.coherence}</td><td class="num">${a.rating.tangentiality}</td><td class="num">${a.rating.wordFinding}</td></tr>`).join('')
          + `</tbody></table><p class="note">0 to 4, higher is normal. Source: ${chat.ratingSource === 'model' ? 'read by a model' : 'local heuristic'}. Compared with this person’s own earlier days, never a population.</p>`);
      }
    }

    // --- jigsaw
    out.push('<h3>The puzzle</h3>');
    if (!jig) out.push('<p class="note">Not played.</p>');
    else {
      const f = jig.features;
      out.push(tiles([
        ['Time to first move', secs(f.timeToFirstMoveMs), 'initiation, arousal'],
        ['Total time', secs(f.totalMs), f.completed ? 'completed' : 'left unfinished'],
        ['Placed', f.placedMine + (f.withPartner ? ` + ${f.placedPartner} by Anna` : ''), `of ${f.pieces}`],
        ['Median gap between placements', secs(f.placementMedianMs), f.placementCv == null ? 'variability –' : `variability (CV) ${f.placementCv}`],
        ['Loose drops', f.looseDrops + (f.nearMisses ? ` (${f.nearMisses} near board)` : ''), 'spatial judgement'],
        ['Same piece dropped loose ≥ 2×', String(f.perseveration), 'perseveration'],
        ['Order coherence', f.orderCoherence == null ? '–' : Math.round(f.orderCoherence * 100) + '%', 'next to the previous placement'],
        ['Drag straightness', f.straightnessMean == null ? '–' : Math.round(f.straightnessMean * 100) + '%', `${f.straightness.length} drags`],
        ['Pauses over 8 s', String(f.lapses), 'attention lapses'],
        ['Counts towards baseline', f.baselineEligible === true ? 'yes' : String(f.baselineEligible), f.withPartner ? 'shared work' : 'played alone']
      ]));
    }

    out.push('<h3>Observation, as the server would derive it</h3>');
    out.push(`<pre class="payload">${esc(JSON.stringify(observation(), null, 1))}</pre>`);
    return out.join('');
  }

  function observation() {
    const sig = visit.signature, chat = visit.chat, jig = visit.jigsaw;
    const openAnswers = chat ? chat.items.filter((a) => a.kind === 'text' && !a.skipped) : [];
    const h = languageHeuristics(openAnswers);
    return {
      day: new Date().toISOString().slice(0, 10),
      person: visit.person,
      visited: true,
      methodVersion: 1,
      signature: sig ? {
        features: {
          timeToFirstMs: sig.features.timeToFirstMs, totalMs: Math.round(sig.features.totalMs),
          inAirMs: Math.round(sig.features.inAirMs), strokes: sig.features.strokes,
          meanSpeed: +sig.features.meanSpeed.toFixed(4),
          smoothness: sig.features.smoothness == null ? null : +sig.features.smoothness.toFixed(3),
          width: +sig.features.width.toFixed(4), height: +sig.features.height.toFixed(4)
        },
        dateAnswer: sig.dateAnswer || null,
        deviation: sig.deviation ? { composite: +sig.deviation.composite.toFixed(2), flags: sig.deviation.flags.map((f) => f.k), sentence: sig.deviation.sentence } : { status: 'building baseline' }
      } : null,
      chat: chat ? {
        script: chat.script, completed: !!chat.completed, durationMs: chat.durationMs,
        readBy: chat.mode === 'conversation' ? (visit.model ? visit.model.via : 'model') : 'widgets',
        items: chat.items.map((a) => ({ itemId: a.itemId, answered: !a.skipped, latencyMs: a.latencyMs, tripped: a.tripped, score: a.score, concern: a.concern, rating: a.rating || null })),
        language: { ratingSource: chat.ratingSource || 'none', words: h.words, ttr: h.ttr == null ? null : +h.ttr.toFixed(3), markers: h.markers, repeats: h.repeats }
      } : null,
      jigsaw: jig ? jig.features : null,
      freeText: '[kept on the record, not on events — see 0006 section 6.3]'
    };
  }

  const tiles = (rows) => '<div class="tiles">' + rows.map((r) =>
    `<div class="tile"><div class="tile__k">${r[0]}</div><div class="tile__v">${r[1]}</div><div class="tile__d">${r[2]}</div></div>`).join('') + '</div>';

  // ---------------------------------------------------------- runbook tab
  function runbookTab() {
    const enabled = runbook.enabled().length;
    return '<p class="note" style="margin-top:0">What a nurse or doctor has asked to be checked. Items are live from the next morning, never mid-chat.</p>'
      + '<h3>Ready-made scripts</h3>'
      + '<div class="scripts" style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem">'
      + Object.keys(SCRIPTS).map((k) => `<button type="button" class="small-btn" style="margin:0" data-script="${k}" aria-pressed="${k === runbook.scriptKey}"${k === runbook.scriptKey ? ' style="margin:0;background:#1e40af;color:#fff;border-color:#1e40af"' : ''}>${esc(SCRIPTS[k].name)}</button>`).join('')
      + '</div>'
      + `<p class="note" style="margin:0 0 0.5rem">${esc(runbook.script().subtitle)} · entered by ${esc(runbook.script().addedBy)}</p>`
      + `<h3>Items <span class="chip">${enabled} of ${DAY_CAP} a day</span></h3>`
      + '<div id="item-list">' + runbook.items.map((it, i) =>
        `<div class="item${it.enabled === false ? ' item--off' : ''}">`
        + `<div class="item__row"><span class="item__q">${esc(it.question)}</span><button class="linkish" data-toggle="${i}">${it.enabled === false ? 'switch on' : 'switch off'}</button></div>`
        + `<div class="item__meta"><span class="chip">${esc(answerWords(it))}</span> <span class="chip">${esc(cadenceWords(it.cadence))}</span> <span class="chip">tells ${esc(it.notify)}</span></div>`
        + `<div class="item__rule">${esc(ruleWords(it))}</div>`
        + (it.saySomething ? `<div class="item__meta">Ernie says: “${esc(it.saySomething)}”</div>` : '')
        + (it.note ? `<div class="item__meta">${esc(it.note)}</div>` : '')
        + '</div>').join('') + '</div>'
      + '<h3>Add an item</h3>'
      + '<form class="add" id="add-form">'
      + '<div><label for="add-q">The question, in the person’s own words</label><input id="add-q" type="text" placeholder="Have you felt dizzy when you stand up?"></div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">'
      + '<div><label for="add-kind">Answered with</label><select id="add-kind"><option value="yesno">Yes / No</option><option value="choice">A few choices</option><option value="number">A number</option><option value="text">Their own words</option></select></div>'
      + '<div><label for="add-cadence">How often</label><select id="add-cadence"><option value="daily">Every day</option><option value="once">Once, tomorrow</option><option value="forDays">Every day for 7 days</option></select></div>'
      + '</div>'
      + '<div><label for="add-say">What Ernie says if it is a problem</label><input id="add-say" type="text" placeholder="Thank you. I will let the clinic know today."></div>'
      + '<div class="preview" id="add-preview" hidden></div><div class="refuse" id="add-refuse" hidden></div>'
      + '<button type="submit">Add this item</button></form>'
      + '<p class="note">Plain-language check and the six-a-day cap are enforced here, not discovered by the person.</p>';
  }

  // ----------------------------------------------------------- events tab
  function eventsTab() {
    const list = events.list;
    const last = list[list.length - 1];
    return '<h3>Event stream</h3>'
      + '<ul class="log">' + (list.length ? list.slice(-120).reverse().map((e) => {
        const extra = Object.keys(e).filter((k) => !['t', 'kind', 'activity'].includes(k) && e[k] !== undefined).map((k) => `${k}=${e[k]}`).join(' ');
        return `<li><span class="t">+${(e.t / 1000).toFixed(1)}s</span><span class="act">${esc(e.activity)}.</span>${esc(e.kind)} ${esc(extra)}</li>`;
      }).join('') : '<li>No events yet.</li>') + '</ul>'
      + '<p class="note">Every line is one event as the phone would send it to <code>POST /api/events</code> (doc 0007).</p>'
      + '<h3>Last event, as sent</h3>'
      + `<pre class="payload">${esc(last ? JSON.stringify({ id: 'evt_' + list.length.toString(36), task: last.activity, kind: `${last.activity}.${last.kind}`, t: last.t, payload: Object.fromEntries(Object.entries(last).filter(([k, v]) => !['t', 'kind', 'activity'].includes(k) && v !== undefined)) }, null, 1) : '{}')}</pre>`
      + '<button type="button" class="small-btn" id="be-reset">Forget stored history (demo)</button>';
  }

  // ------------------------------------------------------------- wiring
  function wire() {
    root.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => { tab = b.getAttribute('data-tab'); render(); }));
    root.querySelectorAll('button[data-script]').forEach((b) => b.addEventListener('click', () => {
      runbook.use(b.getAttribute('data-script'));
      events.push('runbook', 'scriptLoaded', { script: runbook.scriptKey });
      render();
    }));
    root.querySelectorAll('button[data-toggle]').forEach((b) => b.addEventListener('click', () => {
      const it = runbook.items[+b.getAttribute('data-toggle')];
      it.enabled = it.enabled === false;
      events.push('runbook', it.enabled === false ? 'itemDisabled' : 'itemEnabled', { itemId: it.id });
      render();
    }));
    const q = $('add-q');
    if (q) q.addEventListener('input', () => {
      const v = q.value.trim();
      $('add-preview').hidden = !v;
      $('add-preview').textContent = v ? `The person hears: “${v}”` : '';
    });
    const form = $('add-form');
    if (form) form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const question = $('add-q').value.trim();
      const kind = $('add-kind').value, cad = $('add-cadence').value, say = $('add-say').value.trim();
      const problems = question ? checkPlainLanguage(question) : ['Write the question first.'];
      if (runbook.enabled().length >= DAY_CAP) problems.push(`That would be ${runbook.enabled().length + 1} things in one day. The cap is ${DAY_CAP}. Switch one off first.`);
      $('add-refuse').hidden = !problems.length;
      $('add-refuse').innerHTML = problems.map(esc).join('<br>');
      if (problems.length) { events.push('runbook', 'itemRefused', { reasons: problems.length }); return; }
      runbook.items.push({
        id: 'x-' + Date.now().toString(36), question, kind,
        options: kind === 'choice' ? ['Yes', 'Sometimes', 'No'] : undefined,
        unit: kind === 'number' ? 'kg' : undefined, rated: kind === 'text',
        cadence: cad === 'forDays' ? { forDays: 7, from: 'today' } : cad, window: 'any',
        rule: kind === 'yesno' ? { type: 'value', op: 'is', amount: 'Yes' } : null,
        saySomething: say || null, notify: 'clinic', addedBy: 'You, just now', note: 'Added from the runbook.'
      });
      events.push('runbook', 'itemAdded', {});
      render();
    });
    const reset = $('be-reset');
    if (reset) reset.addEventListener('click', () => {
      sigStore.clear();
      try { localStorage.removeItem('ernie:chats'); } catch { /* ignore */ }
      events.push('runbook', 'demoReset', {});
      render();
    });
  }

  $('backend-toggle').addEventListener('click', () => toggle(!open));
  if (window.innerWidth > 1040) toggle(true);
  return { render, schedule, toggle };
}
