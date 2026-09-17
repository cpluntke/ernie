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
    b.firstElementChild.textContent = a ? '\u2715' : '\u2302';
    b.lastElementChild.textContent = a ? a.label : 'Start again';
    b.onclick = a ? a.onClick : () => confirmRestart();
    ui.topbarNote(null);
  },
  // Progress lives in the bar's empty half rather than in a line of its own:
  // on a short screen that line is the difference between a 51px and a 64px piece.
  topbarNote(text) {
    const s = $('topbar-note');
    s.textContent = text || '';
    s.className = 'topbar__spacer' + (text ? ' topbar__spacer--note' : '');
  },
  // Every screen starts at its own top. Without this a screen inherits the
  // last one's scroll offset and can open below its own heading — the puzzle
  // offer arrived showing three buttons and no question.
  body(node) { bodyEl.innerHTML = ''; if (node) bodyEl.appendChild(node); $('body-wrap').scrollTop = 0; },
  fixed(on) { $('body-wrap').classList.toggle('body--fixed', !!on); },
  scrollEnd() { const w = $('body-wrap'); w.scrollTop = w.scrollHeight; },
  // Scrolling to the bottom of a transcript pushes the question itself off the
  // top, and then the answer buttons are for a question nobody can see. Put the
  // question at the top instead: question and answers stay on screen together.
  scrollToAsk() {
    const w = $('body-wrap');
    const apply = () => {
      // The last .ask, not :last-of-type — that matches the last <p> in its
      // parent, which is the helper line, so the scroll landed on question one.
      const asks = w.querySelectorAll('.ask');
      const ask = asks[asks.length - 1];
      if (!ask) { w.scrollTop = 0; return; }
      // What Ernie said back sits just above the new question. Anchoring on the
      // question alone put it above the fold, so the reply she was owed was
      // never actually shown — anchor on the pair, unless they do not fit.
      const saids = w.querySelectorAll('.said');
      const said = saids[saids.length - 1];
      const pairFits = said && (ask.offsetTop + ask.offsetHeight - said.offsetTop) <= w.clientHeight - 16;
      const anchorEl = pairFits ? said : ask;
      // A short question with little under it cannot reach the top, because the
      // container has nothing left to scroll against — so she reads the
      // transcript where the question should be. A spacer gives it the room.
      let spacer = bodyEl.querySelector('.scroll-spacer');
      // flex: 0 0 auto or the flex column simply shrinks the spacer away again.
      if (!spacer) spacer = el('div', { class: 'scroll-spacer', style: 'flex:0 0 auto' });
      spacer.style.height = '0px';
      bodyEl.appendChild(spacer);
      const top = Math.max(0, anchorEl.offsetTop - w.offsetTop - 8);
      spacer.style.height = Math.max(0, top + w.clientHeight - w.scrollHeight) + 'px';
      w.scrollTop = top;
    };
    apply();
    // Again once layout has settled: wrapping and late metrics move the anchor.
    requestAnimationFrame(apply);
  },
  steps(index) {
    if (index == null) { stepsEl.hidden = true; return; }
    stepsEl.hidden = false;
    // Too short to show the step line at all: the top bar's empty half carries
    // it instead, which costs no height.
    if (window.matchMedia && window.matchMedia('(max-height: 560px)').matches) {
      ui.topbarNote(`Step ${index + 1} of ${STEPS.length}`);
    }
    stepsEl.innerHTML = `<p class="steps__label">Step ${index + 1} of ${STEPS.length}: ${esc(STEPS[index])}</p>`
      + `<div class="steps__track" aria-hidden="true">${STEPS.map((s, i) => `<span class="steps__seg${i <= index ? ' steps__seg--done' : ''}"></span>`).join('')}</div>`;
  },
  actions(list, opts = {}) {
    actionsEl.innerHTML = '';
    actionsEl.parentElement.hidden = !list.length;
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
  setDisabled(id, on) { const b = buttons.get(id); if (b) b.disabled = !!on; },
  // The only question the app asks over the top of a screen. It never replaces
  // the screen, because saying no has to put them back exactly where they were
  // and none of the flows can be rewound.
  confirm({ title, body, no = 'No, go back', yes, onYes }) {
    if (document.getElementById('confirm')) return;
    const close = () => { const d = document.getElementById('confirm'); if (d) d.remove(); };
    const sheet = el('div', { class: 'confirm__sheet', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'confirm-title' });
    el('h2', { id: 'confirm-title', class: 'confirm__title', text: title }, sheet);
    el('p', { class: 'text text--large', text: body }, sheet);
    const row = el('div', { class: 'confirm__actions' }, sheet);
    const cancel = el('button', { type: 'button', class: 'btn btn--secondary btn--full', text: no, onclick: close }, row);
    el('button', { type: 'button', class: 'btn btn--full', text: yes, onclick: () => { close(); onYes(); } }, row);
    const back = el('div', { id: 'confirm', class: 'confirm', onclick: (ev) => { if (ev.target.id === 'confirm') close(); } });
    back.appendChild(sheet);
    back.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); });
    document.querySelector('.app').appendChild(back);
    cancel.focus();
  }
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

// Starting over destroys the signature and every answer given today, and the
// button sits where a hesitant person taps first, so it asks before it does it.
function confirmRestart() {
  // Not "has the visit finished a step" but "has she done anything at all":
  // the likeliest accidental tap is mid-signature, before any step resolves.
  const doneSomething = events.list.some((e) => !(e.activity === 'visit' && e.kind === 'started')
    && !(e.activity === 'signature' && e.kind === 'shown'));
  if (!doneSomething) return visitFlow();
  ui.confirm({
    title: 'Start the whole visit over?',
    body: 'Your signature and your answers today will be thrown away.',
    no: 'No, stay here', yes: 'Yes, start over', onYes: () => visitFlow()
  });
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
      { text: 'A picture in a few big pieces. You can stop at any time.', large: true }
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
  ui.topbarAction(null);        // the puzzle's "Stop the puzzle" does not outlive it
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
  ui.actions([]);        // "Start again" lives in the top bar, where it always is
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
