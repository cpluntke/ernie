// One daily visit, start to finish: sign the book, a short chat, a puzzle if
// they fancy one, goodbye.

import { $, el, esc, now, events, modelClient } from './core.js';
import { runSignature } from './signature.js';
import { runChat } from './chat.js';
import { runJigsaw } from './jigsaw.js';
import { mountBackend } from './backend.js';
import { runbook } from './runbook.js';

const PERSON = 'Margaret';
const STEPS = ['Signing in', 'A few questions', 'A puzzle', 'Goodbye'];

const visit = { person: PERSON, model: null, signature: null, chat: null, jigsaw: null };
const ctx = { person: PERSON, cleanups: [], model: null };

// ------------------------------------------------------------------ the ui
const bodyEl = $('body-area');
const titleEl = $('screen-title');
const stepsEl = $('steps');
const actionsEl = $('actions-inner');
const buttons = new Map();

const ui = {
  title(text, opts = {}) {
    titleEl.textContent = text;
    titleEl.hidden = !text;
    titleEl.className = opts.hidden ? 'visually-hidden' : opts.compact ? 'title--compact' : '';
    if (opts.hidden) titleEl.hidden = false;   // still there for a screen reader
  },
  // The top bar is the way out of every screen. An activity can relabel it so
  // leaving does not need a second button eating the height.
  topbarAction(a) {
    const b = $('restart');
    b.lastElementChild.textContent = a ? a.label : 'Start again';
    b.onclick = a ? a.onClick : () => visitFlow();
    ui.topbarNote(null);
  },
  // Progress lives in the bar's empty half rather than in a line of its own:
  // on a short screen that line is the difference between a 51px and a 64px piece.
  topbarNote(text) {
    const s = $('topbar-note');
    s.textContent = text || '';
    s.className = 'topbar__spacer' + (text ? ' topbar__spacer--note' : '');
  },
  body(node) { bodyEl.innerHTML = ''; if (node) bodyEl.appendChild(node); },
  fixed(on) { $('body-wrap').classList.toggle('body--fixed', !!on); },
  scrollEnd() { const w = $('body-wrap'); w.scrollTop = w.scrollHeight; },
  steps(index) {
    if (index == null) { stepsEl.hidden = true; return; }
    stepsEl.hidden = false;
    stepsEl.innerHTML = `<p class="steps__label">Step ${index + 1} of ${STEPS.length}: ${esc(STEPS[index])}</p>`
      + `<div class="steps__track" aria-hidden="true">${STEPS.map((s, i) => `<span class="steps__seg${i <= index ? ' steps__seg--done' : ''}"></span>`).join('')}</div>`;
  },
  actions(list, opts = {}) {
    actionsEl.innerHTML = '';
    actionsEl.className = 'actions__inner' + (opts.row ? ' actions__inner--row' : '');
    buttons.clear();
    for (const a of list) {
      const b = el('button', {
        type: 'button',
        class: 'btn btn--full' + (a.kind === 'secondary' ? ' btn--secondary' : a.kind === 'huge' ? ' btn--huge' : ''),
        text: a.label,
        onclick: a.onClick
      }, actionsEl);
      if (a.disabled) b.disabled = true;
      if (a.id) buttons.set(a.id, b);
    }
  },
  setDisabled(id, on) { const b = buttons.get(id); if (b) b.disabled = !!on; }
};

function say(title, paragraphs, actions, stepIndex) {
  ui.fixed(false);
  ui.topbarAction(null);
  ui.steps(stepIndex);
  ui.title(title);
  const body = el('div');
  for (const p of paragraphs) el('p', { class: 'text' + (p.large ? ' text--large' : '') + (p.soft ? ' text--soft' : ''), text: p.text }, body);
  ui.body(body);
  ui.actions(actions);
}

// --------------------------------------------------------------- the visit
let flowId = 0;
async function visitFlow() {
  const mine = ++flowId;
  const current = () => mine === flowId;
  cleanup();
  events.reset();
  visit.signature = visit.chat = visit.jigsaw = null;
  events.push('visit', 'started', { person: PERSON, script: runbook.scriptKey });

  // 1. sign in
  ui.steps(0);
  visit.signature = await runSignature(ui, ctx);
  if (!current()) return;
  backend.schedule();

  // 2. the chat
  const due = runbook.dueToday().length;
  await new Promise((resolve) => {
    say(`${PERSON}, may I ask you a few things?`, [
      { text: due ? `There are ${due} things today. It takes a few minutes, and you can stop whenever you like.` : 'Nothing to ask today.', large: true },
      { text: visit.model ? '' : 'Answers are by tapping today.', soft: true }
    ].filter((p) => p.text), [
      { label: 'Not today', kind: 'secondary', onClick: () => { events.push('chat', 'declined', {}); resolve(false); } },
      { label: 'Yes, go ahead', kind: 'huge', onClick: () => resolve(true) }
    ], 1);
  }).then(async (yes) => {
    if (!yes || !due || !current()) return;
    ui.steps(1);
    ui.title('');
    visit.chat = await runChat(ui, ctx);
    backend.schedule();
  });
  if (!current()) return;

  // 3. a puzzle
  const played = await new Promise((resolve) => {
    say('Would you like to do a puzzle before you go?', [
      { text: 'A picture in twelve pieces. There is no hurry, and you can stop at any time.', large: true }
    ], [
      { label: 'Not today, thank you', kind: 'secondary', onClick: () => { events.push('jigsaw', 'declined', {}); resolve(null); } },
      { label: 'Ask Anna to join me', kind: 'secondary', onClick: () => resolve({ withPartner: true }) },
      { label: 'Yes, on my own', kind: 'huge', onClick: () => resolve({ withPartner: false }) }
    ], 2);
  });
  if (!current()) return;
  if (played) {
    ui.steps(2);
    visit.jigsaw = await runJigsaw(ui, ctx, { pieces: 12, withPartner: played.withPartner });
    if (!current()) return;
    backend.schedule();
  }

  // 4. goodbye
  farewell();
}

function farewell() {
  events.push('visit', 'completed', {
    signed: !!visit.signature,
    chatItems: visit.chat ? visit.chat.items.length : 0,
    flagged: visit.chat ? visit.chat.items.filter((a) => a.tripped).length : 0,
    puzzle: visit.jigsaw ? (visit.jigsaw.abandoned ? 'left' : 'finished') : 'skipped'
  });
  ui.fixed(false);
  ui.steps(3);
  ui.title(`Goodbye, ${PERSON}.`);
  const body = el('div');
  const told = visit.chat ? visit.chat.items.filter((a) => a.told) : [];
  el('div', { class: 'notice notice--success', role: 'status',
    html: '<span class="notice__icon" aria-hidden="true">✓</span><div><p class="notice__title">Done</p><p>'
      + esc(told.length ? told[0].told : 'That is everything for today.') + '</p></div>' }, body);
  el('p', { class: 'text text--large', text: 'Thank you for your company. I will be here again tomorrow morning.' }, body);
  if (visit.jigsaw && !visit.jigsaw.abandoned) {
    el('p', { class: 'text', text: visit.jigsaw.withPartner
      ? `You and Anna finished the picture together. She put in ${visit.jigsaw.features.placedPartner} of the pieces.`
      : 'You finished the picture on your own.' }, body);
  }
  ui.body(body);
  ui.actions([{ label: 'Start again', kind: 'secondary', onClick: () => visitFlow() }]);
  backend.schedule();
}

function cleanup() {
  for (const f of ctx.cleanups.splice(0)) { try { f(); } catch { /* best effort */ } }
}

// ------------------------------------------------------------------- boot
const backend = mountBackend(visit);
ui.topbarAction(null);

say('Just a moment…', [{ text: 'Getting ready.', soft: true }], [], null);
modelClient().then((m) => {
  visit.model = ctx.model = m;
  $('where').textContent = m ? `reader: ${m.via}` : 'reader: none';
  backend.schedule();
  visitFlow();
});
