// The clinician runbook (doc 0009): what a nurse or doctor has asked to be
// checked, in the person's own words. Two ready-made scripts ship with it.

import { load, save, median, DAYS } from './core.js';

export const DAY_CAP = 6;

const LOGIC = [
  { q: 'Will a stone float on water?', yes: false },
  { q: 'Is one pound heavier than two pounds?', yes: false },
  { q: 'Can you use a hammer to cut wood?', yes: false }
];
const logicToday = LOGIC[new Date().getDate() % LOGIC.length];

export const SCRIPTS = {
  delirium: {
    name: 'Delirium watch',
    subtitle: 'After a hospital stay',
    addedBy: 'Nurse J. Okafor',
    items: [
      { id: 'd-day', question: 'What day of the week is it today?', kind: 'choice', options: DAYS,
        cadence: 'daily', window: 'morning', rule: { type: 'value', op: 'isNot', amount: 'today' },
        saySomething: null, notify: 'family', note: '4AT orientation. One wrong morning is logged, not escalated.' },
      { id: 'd-where', question: 'Where are you right now?', kind: 'choice', options: ['At home', 'In hospital', 'Somewhere else'],
        cadence: 'daily', window: 'any', rule: { type: 'value', op: 'isNot', amount: 'At home' },
        saySomething: null, notify: 'family', note: '4AT orientation, place.' },
      { id: 'd-back', question: 'Can you say the days of the week backwards, starting with Saturday?', kind: 'text', rated: false,
        cadence: 'daily', window: 'any', rule: { type: 'value', op: 'below', amount: 5 },
        saySomething: null, notify: 'clinic', note: 'CAM feature 2, inattention. Read tolerantly, so spelling costs nothing.' },
      { id: 'd-logic', question: logicToday.q, kind: 'yesno',
        cadence: 'daily', window: 'any', rule: { type: 'value', op: 'isNot', amount: logicToday.yes ? 'Yes' : 'No' },
        saySomething: null, notify: 'clinic', note: 'CAM feature 3, disorganised thinking. The question rotates daily.' },
      { id: 'd-sleep', question: 'Did you sleep through the night?', kind: 'yesno',
        cadence: { forDays: 7, from: 'discharge' }, window: 'morning', rule: { type: 'value', op: 'is', amount: 'No' },
        saySomething: null, notify: 'family', note: 'First week after discharge only. Stops on its own.' },
      { id: 'd-open', question: 'What have you been up to today?', kind: 'text', rated: true,
        cadence: 'daily', window: 'any', rule: { type: 'changeFromBaseline', op: 'below', amount: 1, on: 'coherence' },
        saySomething: null, notify: 'clinic', note: 'Carries the language signal. Never shown to the person.' }
    ]
  },
  heartFailure: {
    name: 'Heart failure watch',
    subtitle: 'After a decompensation admission or a diuretic change',
    addedBy: 'Dr A. Fenwick',
    items: [
      { id: 'h-weight', question: 'What does the scale say this morning?', kind: 'number', unit: 'kg', range: [30, 250],
        cadence: 'daily', window: 'morning', rule: { type: 'changeFromYesterday', op: 'above', amount: 1.5 },
        saySomething: 'Thank you. I will let the clinic know your weight today.', notify: 'clinic',
        note: 'Daily weight is the earliest sign of fluid building up.' },
      { id: 'h-breath', question: 'Is it harder to breathe today than yesterday?', kind: 'yesno',
        cadence: 'daily', window: 'any', rule: { type: 'value', op: 'is', amount: 'Yes' },
        saySomething: 'Thank you for telling me. I will let the clinic know today.', notify: 'clinic', note: '' },
      { id: 'h-pillows', question: 'How many pillows did you sleep on?', kind: 'choice', options: ['One', 'Two', 'Three or more'],
        cadence: 'daily', window: 'morning', rule: { type: 'changeFromBaseline', op: 'above', amount: 0 },
        saySomething: 'Thank you. I will let the clinic know.', notify: 'clinic',
        note: 'More pillows than usual is orthopnoea in plain words.' },
      { id: 'h-swell', question: 'Are your ankles or feet more swollen than usual?', kind: 'yesno',
        cadence: 'daily', window: 'any', rule: { type: 'value', op: 'is', amount: 'Yes' },
        saySomething: 'Thank you. I will let the clinic know today.', notify: 'clinic', note: '' },
      { id: 'h-tablet', question: 'Did you take your water tablet today?', kind: 'yesno',
        cadence: 'daily', window: 'any', rule: { type: 'value', op: 'is', amount: 'No' },
        saySomething: 'Thank you for telling me. I will let your daughter know.', notify: 'family', note: '' },
      { id: 'h-open', question: 'How have you been feeling today?', kind: 'text', rated: true,
        cadence: 'daily', window: 'any', rule: { type: 'changeFromBaseline', op: 'below', amount: 1, on: 'coherence' },
        saySomething: null, notify: 'clinic', note: 'Carries the language signal underneath the heart-failure script.' }
    ]
  }
};

export const runbook = {
  scriptKey: 'delirium',
  items: JSON.parse(JSON.stringify(SCRIPTS.delirium.items)),
  script() { return SCRIPTS[this.scriptKey]; },
  use(key) {
    this.scriptKey = key;
    this.items = JSON.parse(JSON.stringify(SCRIPTS[key].items));
  },
  enabled() { return this.items.filter((i) => i.enabled !== false); },
  dueToday() { return this.enabled(); }
};

export const history = {
  all() { return load('chats', []); },
  add(rec) { const a = this.all(); a.push(rec); save('chats', a.slice(-30)); return a; },
  clear() { save('chats', []); }
};

// ------------------------------------------------------------------ rules
function previousAnswer(itemId) {
  const all = history.all();
  for (let i = all.length - 1; i >= 0; i--) {
    const a = (all[i].items || []).find((x) => x.itemId === itemId && !x.skipped);
    if (a) return a.answer;
  }
  return null;
}
function allPrevious(itemId) {
  const out = [];
  for (const h of history.all()) for (const x of (h.items || [])) if (x.itemId === itemId && !x.skipped) out.push(x.answer);
  return out;
}

export function evaluateRule(item, answer) {
  const r = item.rule;
  if (!r) return false;
  if (r.type === 'value') {
    const target = r.amount === 'today' ? DAYS[new Date().getDay()] : r.amount;
    if (r.op === 'is') return answer === target;
    if (r.op === 'isNot') return answer !== target;
    if (r.op === 'below') return Number(answer) < Number(target);
    if (r.op === 'above') return Number(answer) > Number(target);
    return false;
  }
  if (r.type === 'changeFromYesterday') {
    const prev = previousAnswer(item.id);
    if (prev == null) return false;
    const d = Number(answer) - Number(prev);
    return r.op === 'above' ? d > r.amount : d < -r.amount;
  }
  if (r.type === 'changeFromBaseline') {
    if (r.on === 'coherence') return false;   // judged on the server once a baseline exists
    const prevs = allPrevious(item.id);
    if (prevs.length < 3) return false;
    if (item.kind === 'choice') {
      const idxNow = item.options.indexOf(answer);
      const idxs = prevs.map((p) => item.options.indexOf(p)).filter((i) => i >= 0);
      const usual = median(idxs);
      return r.op === 'above' ? idxNow > usual : idxNow < usual;
    }
    const nums = prevs.map(Number).filter(isFinite);
    const med = median(nums);
    return r.op === 'above' ? Number(answer) - med > r.amount : med - Number(answer) > r.amount;
  }
  return false;
}

// Fallback scorer, used only when no model is available to read the answer.
export function scoreDaysBackwards(text) {
  const want = ['saturday', 'friday', 'thursday', 'wednesday', 'tuesday', 'monday', 'sunday'];
  const said = String(text || '').toLowerCase().match(/[a-z]+/g) || [];
  let n = 0;
  for (let i = 0; i < said.length && n < want.length; i++) if (said[i] === want[n]) n++;
  return n;
}

// ------------------------------------------------------- plain language
const CLINICAL = ['dyspnoea', 'dyspnea', 'oedema', 'edema', 'orthopnoea', 'orthopnea', 'syncope', 'palpitations',
  'diuretic', 'adherence', 'compliance', 'cognition', 'cognitive', 'orientation', 'delirium', 'assess', 'assessment',
  'evaluate', 'baseline', 'symptom', 'symptoms', 'administer', 'dose', 'dosage', 'titrate', 'mg', 'bp', 'saturation', 'nocturnal'];
const INSTRUCTION = ['take ', 'stop taking', 'increase', 'decrease', 'double your', 'skip your', 'go to hospital', 'call 999', 'call 911'];

export function checkPlainLanguage(q) {
  const problems = [];
  const lower = ' ' + q.toLowerCase() + ' ';
  const found = CLINICAL.filter((w) => lower.includes(' ' + w + ' ') || lower.includes(' ' + w + '?'));
  if (found.length) problems.push('Words the person is unlikely to use: ' + found.join(', ') + '.');
  if (INSTRUCTION.some((w) => lower.includes(w))) problems.push('This reads as an instruction. Items are questions only; anything to be done needs a phone call from a person.');
  if (q.trim().slice(-1) !== '?') problems.push('It should be a question, ending in a question mark.');
  if (q.trim().split(/\s+/).length > 16) problems.push('Too long. Keep it under about 16 words, one idea.');
  return problems;
}

// ------------------------------------------------------------- wording
export function answerWords(it) {
  if (it.kind === 'yesno') return 'Yes / No';
  if (it.kind === 'choice') return it.options.length + ' choices';
  if (it.kind === 'number') return 'a number' + (it.unit ? ' in ' + it.unit : '');
  return 'their own words';
}
export function cadenceWords(c) {
  if (c === 'daily') return 'Every day';
  if (c === 'once') return 'Once';
  if (c && c.forDays) return 'Every day for ' + c.forDays + ' days';
  return 'Every day';
}
export function ruleWords(it) {
  const r = it.rule;
  if (!r) return 'nothing to watch for';
  if (r.type === 'value') return 'flag when the answer ' + (r.op === 'is' ? 'is ' : r.op === 'isNot' ? 'is not ' : r.op + ' ') + r.amount;
  if (r.type === 'changeFromYesterday') return 'flag when it is ' + r.op + ' yesterday by ' + r.amount + (it.unit ? ' ' + it.unit : '');
  if (r.type === 'changeFromBaseline') {
    return r.on === 'coherence'
      ? 'flag when the coherence rating is below this person’s usual (judged on the server once a baseline exists)'
      : 'flag when it is ' + r.op + ' this person’s usual';
  }
  return '';
}
export function specFor(it) {
  if (it.kind === 'yesno') return 'A yes or a no. "value" must be exactly "Yes" or "No".';
  if (it.kind === 'choice') return 'One of these, exactly: ' + it.options.map((o) => `"${o}"`).join(', ') + '. "value" must be one of them, spelled as written here.';
  if (it.kind === 'number') return 'A number in ' + (it.unit || 'the usual unit') + ', plausibly between ' + (it.range ? it.range[0] + ' and ' + it.range[1] : 'any sensible values') + '. "value" must be a JSON number, not a string. Accept words ("eighty two and a half"), a comma as the decimal point, and the unit written out.';
  if (it.id === 'd-back') return 'The days of the week said backwards, starting at Saturday. Set "score" to how many of the seven they produced in the right reverse order, being generous about misspellings, abbreviations and extra words in between. "value" is the sequence you read, as a string. "understood" is true if they attempted it at all.';
  return 'Anything they want to say. "value" is their words verbatim. "understood" is true unless they wrote nothing at all. Also fill "rating".';
}
