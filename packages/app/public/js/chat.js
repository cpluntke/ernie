// The daily chat (doc 0006). Ernie asks the runbook's items one at a time; the
// person answers in their own words and a model reads what they meant. The
// language underneath is measured whatever is being asked.

import { el, esc, now, events } from './core.js';
import { runbook, history, evaluateRule, scoreDaysBackwards, specFor } from './runbook.js';

const MARKERS = ['um', 'erm', 'er', 'uh', 'you know', 'the thing', 'thingy', 'whatsit', 'what do you call it', 'sort of', 'kind of', 'i mean'];

export function languageHeuristics(answers) {
  const all = answers.map((a) => a.said || a.answer || '').join(' ');
  const words = all.toLowerCase().match(/[a-z']+/g) || [];
  const uniq = new Set(words);
  let markers = 0;
  for (const m of MARKERS) markers += (all.toLowerCase().match(new RegExp('\\b' + m.replace(/ /g, '\\s+') + '\\b', 'g')) || []).length;
  let repeats = 0;
  for (let i = 1; i < words.length; i++) if (words[i] === words[i - 1]) repeats++;
  return {
    words: words.length,
    ttr: words.length ? uniq.size / words.length : null,
    meanWordLength: words.length ? words.join('').length / words.length : null,
    markers, repeats
  };
}

// Used only when no model can be reached. Calibrated so ordinary disfluency
// lands near 2 rather than near 0: a fallback that cries wolf is worse than none.
export function heuristicRating(text) {
  const words = String(text).toLowerCase().match(/[a-z']+/g) || [];
  const h = languageHeuristics([{ said: text }]);
  const per100 = words.length ? ((h.markers + h.repeats) * 100) / words.length : 0;
  const score = (v, good, bad) => Math.max(0, Math.min(4, 4 - (v - good) / ((bad - good) / 4)));
  return {
    coherence: +score(per100, 2, 40).toFixed(1),
    tangentiality: words.length < 4 ? 2 : 3.5,
    wordFinding: +score((h.markers * 100) / Math.max(words.length, 1), 1, 30).toFixed(1),
    note: `heuristic: ${h.markers} filler, ${h.repeats} repeats in ${words.length} words`
  };
}

export function runChat(ui, ctx) {
  return new Promise((resolve) => {
    const queue = runbook.dueToday();
    const chat = { startedAt: now(), items: [], ratingSource: null, mode: ctx.model ? 'conversation' : 'buttons', script: runbook.scriptKey };
    let at = 0, pending = null, busy = false;
    events.push('chat', 'started', { script: runbook.scriptKey, items: queue.length, mode: chat.mode });

    const bubble = (who, what, cls = '') =>
      `<div class="said${cls}"><p class="said__who">${who}</p><p class="said__what">${esc(what)}</p></div>`;

    function transcriptHtml(items) {
      return items.map((a) => {
        let out = bubble('Ernie asked', a.question);
        for (const f of a.followUps || []) out += bubble('You said', f.said, ' said--you') + bubble('Ernie said', f.ernie);
        out += bubble('You said', a.skipped ? 'Skipped this one' : (a.said != null ? a.said : String(a.answer) + (a.unit ? ' ' + a.unit : '')),
          ' said--you' + (a.skipped ? ' said--skipped' : ''));
        if (a.reply) out += bubble('Ernie said', a.reply);
        if (a.told) out += `<div class="notice"><span class="notice__icon" aria-hidden="true">i</span><div><p class="notice__title">Note</p><p>${esc(a.told)}</p></div></div>`;
        return out;
      }).join('');
    }

    function nextItem() {
      if (at >= queue.length) return finish();
      const it = queue[at];
      pending = { followUps: [], typing: null, shownAt: now() };
      events.push('chat', 'itemShown', { itemId: it.id, kind: it.kind });
      render(it);
    }

    function render(it, askOverride) {
      const body = el('div');
      el('div', { class: 'transcript', html: transcriptHtml(chat.items) + pending.followUps.map((f) =>
        bubble('Ernie asked', it.question) + bubble('You said', f.said, ' said--you') + bubble('Ernie said', f.ernie)).join('') }, body);
      el('p', { class: 'ask', text: askOverride || it.question }, body);
      const area = el('div', { id: 'answer-area' }, body);
      ui.body(body);
      if (ctx.model) composer(it, area); else widgets(it, area);
      ui.scrollEnd();
    }

    // --- conversational: own words, with quick answers as a shortcut
    function composer(it, area) {
      const quick = it.kind === 'yesno' ? ['Yes', 'No'] : it.kind === 'choice' ? it.options : null;
      if (quick) {
        const wrap = el('div', { class: 'answers' + (quick.length === 2 ? ' answers--two' : '') }, area);
        for (const o of quick) el('button', { type: 'button', class: 'answer', text: o, onclick: () => { if (!busy) send(it, o, true); } }, wrap);
        el('p', { class: 'text text--soft', text: 'Or say it in your own words:' }, area);
      }
      const ta = el('textarea', { class: 'say', id: 'say', 'aria-label': it.question }, area);
      if (it.kind === 'number') { ta.setAttribute('inputmode', 'decimal'); ta.style.minHeight = '5rem'; }
      const hint = el('p', { class: 'text text--soft', text: 'Type your answer, then tap Send my answer.' }, area);
      const T = trackTyping(ta);
      pending.typing = T;
      ui.actions([
        { label: 'Skip this one', kind: 'secondary', onClick: () => { if (!busy) finishItem(it, { skipped: true }); } },
        { id: 'send', label: 'Send my answer', kind: 'huge', disabled: true, onClick: () => { if (!busy) send(it, ta.value.trim(), false); } }
      ]);
      ta.addEventListener('input', () => {
        ui.setDisabled('send', !ta.value.trim() || busy);
        hint.hidden = !!ta.value.trim();
      });
      setTimeout(() => ta.focus(), 0);
    }

    function send(it, text, tapped) {
      if (!text) return;
      busy = true;
      ui.setDisabled('send', true);
      const area = document.getElementById('answer-area');
      el('p', { class: 'text text--soft', id: 'thinking', text: 'Ernie is reading that…' }, area);
      events.push('chat', 'replySent', { itemId: it.id, chars: text.length, tapped: !!tapped });
      ctx.model.interpret({ question: it.question, spec: specFor(it), reply: text }).then((r) => {
        busy = false;
        if (!r || typeof r !== 'object') throw new Error('bad shape');
        if (r.concern) events.push('chat', 'concernVolunteered', { itemId: it.id });
        if (r.understood === false && pending.followUps.length < 2) {
          pending.followUps.push({ said: text, ernie: r.followUp || 'Sorry, I did not quite catch that. Could you say it again?' });
          events.push('chat', 'followUp', { itemId: it.id, n: pending.followUps.length });
          render(it, pending.followUps[pending.followUps.length - 1].ernie);
          return;
        }
        // Two failed follow-ups: keep their words, but we never read them.
        const unread = r.understood === false;
        finishItem(it, { said: text, value: unread ? null : r.value, score: unread ? null : r.score,
          reply: r.reply, rating: r.rating, concern: !!r.concern, ratingSource: 'model', unread });
      }).catch(() => {
        busy = false;
        events.push('chat', 'interpretFailed', { itemId: it.id });
        // The reader was meant to read this and could not. Keep their words and
        // whatever can be measured locally, but never evaluate a rule on it: the
        // local scorer matches day names exactly, so a misspelling would flag the
        // clinic for what is really an outage.
        finishItem(it, {
          said: text,
          value: it.kind === 'number' ? Number(String(text).replace(',', '.').replace(/[^0-9.]/g, '')) : text,
          score: it.id === 'd-back' ? scoreDaysBackwards(text) : null,
          reply: 'Thank you.',
          rating: it.kind === 'text' && it.rated ? heuristicRating(text) : null,
          ratingSource: 'heuristic', unread: true
        });
      });
    }

    // --- fallback when no model can be reached: tap-only widgets
    function widgets(it, area) {
      if (it.kind === 'yesno' || it.kind === 'choice') {
        const opts = it.kind === 'yesno' ? ['Yes', 'No'] : it.options;
        const wrap = el('div', { class: 'answers' + (it.kind === 'yesno' ? ' answers--two' : '') }, area);
        for (const o of opts) el('button', { type: 'button', class: 'answer', text: o, onclick: () => finishItem(it, { value: o, ratingSource: 'heuristic' }) }, wrap);
        ui.actions([]);
        return;
      }
      if (it.kind === 'number') {
        let val = '';
        const read = el('div', { class: 'readout', id: 'readout', text: '— ' + (it.unit || '') }, area);
        const keys = el('div', { class: 'pad-keys' }, area);
        for (const k of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫']) {
          el('button', { type: 'button', text: k,
            'aria-label': k === '⌫' ? 'Delete the last number' : k === '.' ? 'Decimal point' : k,
            onclick: () => {
              if (k === '⌫') val = val.slice(0, -1);
              else if (k === '.') { if (!val.includes('.') && val) val += '.'; }
              else if (val.replace('.', '').length < 5) val += k;
              read.textContent = val ? `${val} ${it.unit || ''}` : '— ' + (it.unit || '');
              ui.setDisabled('send', !(val && isFinite(Number(val))));
            } }, keys);
        }
        ui.actions([{ id: 'send', label: 'Done', kind: 'huge', disabled: true, onClick: () => finishItem(it, { value: Number(val), ratingSource: 'heuristic' }) }]);
        return;
      }
      const ta = el('textarea', { class: 'say', id: 'say', 'aria-label': it.question }, area);
      const hint = el('p', { class: 'text text--soft', text: 'Type your answer, then tap Send my answer.' }, area);
      pending.typing = trackTyping(ta);
      ui.actions([
        { label: 'Skip this one', kind: 'secondary', onClick: () => finishItem(it, { skipped: true }) },
        { id: 'send', label: 'Send my answer', kind: 'huge', disabled: true, onClick: () => {
            const v = ta.value.trim();
            finishItem(it, { said: v, value: v, score: it.id === 'd-back' ? scoreDaysBackwards(v) : null,
              rating: it.kind === 'text' && it.rated ? heuristicRating(v) : null, ratingSource: 'heuristic' });
          } }
      ]);
      ta.addEventListener('input', () => {
        ui.setDisabled('send', !ta.value.trim());
        hint.hidden = !!ta.value.trim();
      });
      setTimeout(() => ta.focus(), 0);
    }

    function trackTyping(ta) {
      const T = { keys: 0, backspaces: 0, gaps: [], last: null, first: null };
      ta.addEventListener('keydown', (e) => {
        const t = now();
        if (T.first == null) T.first = t;
        if (T.last != null) T.gaps.push(t - T.last);
        T.last = t; T.keys++;
        if (e.key === 'Backspace' || e.key === 'Delete') T.backspaces++;
      });
      return T;
    }

    function finishItem(it, r) {
      const latencyMs = Math.round(now() - pending.shownAt);
      const rec = {
        itemId: it.id, kind: it.kind, question: it.question,
        said: r.said != null ? r.said : null,
        answer: r.skipped ? null : r.value, unit: it.unit || null,
        skipped: !!r.skipped, unread: !!r.unread, latencyMs, tripped: false, told: null,
        reply: r.reply || null, score: r.score == null ? undefined : r.score,
        rating: r.rating || undefined, ratingSource: r.ratingSource, concern: !!r.concern,
        followUps: pending.followUps.slice()
      };
      const T = pending.typing;
      if (T && T.keys && !r.skipped) {
        const gaps = T.gaps.slice().sort((a, b) => a - b);
        const text = String(r.said || '');
        rec.typing = {
          chars: text.length, keys: T.keys, backspaces: T.backspaces,
          ms: T.last && T.first ? Math.round(T.last - T.first) : 0,
          medianGapMs: gaps.length ? Math.round(gaps[Math.floor(gaps.length / 2)]) : null,
          pauses: T.gaps.filter((g) => g > 2000).length,
          wpm: T.last && T.first && T.last > T.first
            ? +(text.split(/\s+/).filter(Boolean).length / ((T.last - T.first) / 60000)).toFixed(1) : null
        };
      }
      if (!r.skipped && !rec.unread) rec.tripped = evaluateRule(it, rec.score != null ? rec.score : rec.answer);
      if (rec.tripped) {
        rec.told = it.saySomething || null;          // always the clinician's words
        events.push('chat', 'ruleTripped', { itemId: it.id, rule: it.rule.type, notify: it.notify });
      }
      if (rec.concern && !rec.told) rec.told = 'Thank you for telling me. I will let the clinic know today.';
      if (rec.rating) chat.ratingSource = rec.ratingSource === 'model' ? 'model' : (chat.ratingSource || 'heuristic');
      events.push('chat', r.skipped ? 'itemSkipped' : 'itemAnswered',
        { itemId: it.id, latencyMs, tripped: rec.tripped, followUps: rec.followUps.length });
      chat.items.push(rec);
      at++;
      nextItem();
    }

    function finish() {
      chat.durationMs = Math.round(now() - chat.startedAt);
      chat.completed = true;
      events.push('chat', 'completed', { items: chat.items.length, tripped: chat.items.filter((a) => a.tripped).length });
      history.add({ at: new Date().toISOString(), script: runbook.scriptKey, durationMs: chat.durationMs, ratingSource: chat.ratingSource, items: chat.items });
      resolve(chat);
    }

    nextItem();
  });
}
