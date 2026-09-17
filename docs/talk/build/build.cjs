const pptxgen = require('pptxgenjs');
const S = './shots/';
const INK = '111827', BLUE = '1E40AF', SOFT = 'DBEAFE', CORAL = 'C8402F', CORAL_SOFT = 'FDE2E2', GREY = '4B5563', LIGHT = 'F3F4F6', PAPER = 'FFFFFF', ICE = 'C7D2FE';
const F = 'Arial';
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9'; // 10 x 5.625
pres.author = 'Christopher Pluntke';
pres.title = 'ernie: a daily visit';

const T = (s, text, o) => s.addText(text, Object.assign({ fontFace: F, color: INK, isTextBox: true, margin: 0 }, o));
const R = (s, o) => s.addShape(pres.ShapeType.roundRect, Object.assign({ rectRadius: 0.15, line: { color: GREY, width: 0 } }, o));
const title = (s, text, w = 8.8) => T(s, text, { x: 0.6, y: 0.4, w, h: 0.65, fontSize: 32, bold: true });
const sub = (s, text, w = 8.8, y = 1.05) => T(s, text, { x: 0.6, y, w, h: 0.6, fontSize: 15, color: GREY });
const corner = (s, name) => s.addImage({ path: `${S}doodle-${name}-blue.png`, x: 8.55, y: 4.45, w: 1.05, h: 1.05 });
const phone = (s, file, x, y, h) => {
  const w = h * (780 / 1606);
  R(s, { x: x - 0.06, y: y - 0.06, w: w + 0.12, h: h + 0.12, fill: { color: INK }, rectRadius: 0.22 });
  s.addImage({ path: S + file, x, y, w, h });
  return w;
};

// 1 ---------------------------------------------------------------- title
{
  const s = pres.addSlide();
  s.background = { color: BLUE };
  for (const [n, x, y] of [['half-a-house', 6.1, 0.5], ['cat-with-no-face', 7.7, 1.9], ['flower-with-no-petals', 6.0, 3.1]]) s.addImage({ path: `${S}doodle-${n}-white.png`, x, y, w: 2.0, h: 2.0 });
  T(s, 'ernie', { x: 0.6, y: 1.3, w: 5.4, h: 1.0, fontSize: 60, bold: true, color: 'FFFFFF' });
  T(s, 'A daily visit that notices a bad day at home before it becomes a hospital day.', { x: 0.6, y: 2.35, w: 5.2, h: 1.4, fontSize: 22, color: 'FFFFFF' });
  T(s, 'Christopher Pluntke  ·  September 2026', { x: 0.6, y: 4.6, w: 5.4, h: 0.4, fontSize: 13, color: ICE });
  s.addNotes('0:00. One breath: "This is ernie, a daily visit for someone like Margaret. Five minutes: who she is, what is missing in her care, what we built, how it works, what is next."');
}

// 2 ---------------------------------------------------------------- Margaret
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  T(s, 'Margaret is 84.', { x: 0.6, y: 0.4, w: 5.8, h: 0.65, fontSize: 32, bold: true });
  T(s, 'Every morning she signs Ernie’s book. This morning she was slower, and nobody was there to notice.', { x: 0.6, y: 1.15, w: 5.6, h: 1.1, fontSize: 21, color: INK });
  T(s, 'Hypoactive delirium, the most common kind, looks like nothing at all: quieter, slower, a little withdrawn. The cause is usually cheap to fix on the day: an infection, dehydration, a new tablet. Missed, it ends in the emergency room.', { x: 0.6, y: 2.35, w: 5.6, h: 1.25, fontSize: 14, color: GREY });
  R(s, { x: 0.6, y: 3.7, w: 2.7, h: 1.05, fill: { color: SOFT } });
  T(s, '60–75%', { x: 0.75, y: 3.75, w: 2.5, h: 0.55, fontSize: 30, bold: true, color: BLUE });
  T(s, 'of cases missed, even in hospital', { x: 0.75, y: 4.3, w: 2.5, h: 0.4, fontSize: 11, color: GREY });
  R(s, { x: 3.5, y: 3.7, w: 2.7, h: 1.05, fill: { color: SOFT } });
  T(s, '7 M', { x: 3.65, y: 3.75, w: 2.5, h: 0.55, fontSize: 30, bold: true, color: BLUE });
  T(s, 'hospital episodes a year in the US', { x: 3.65, y: 4.3, w: 2.5, h: 0.4, fontSize: 11, color: GREY });
  T(s, 'Delirium is a change from your own baseline. The home never had one.', { x: 0.6, y: 4.9, w: 5.6, h: 0.45, fontSize: 14, italic: true, color: BLUE });
  phone(s, '03-book-page-c.png', 7.1, 0.5, 4.6);
  s.addNotes('0:30. Margaret is a person, not a use case. Hypoactive delirium is withdrawal; the first anyone knows is the ER. Missed in 60 to 75 percent of hospital cases, and nothing at home looks at all. The thesis in one line: delirium is a change from your own baseline, and the home never had one.');
}

// 3 ---------------------------------------------------------------- the gap
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  title(s, 'The gap is the 30 days at home.', 7.7);
  sub(s, 'Value-based care makes providers carry the risk for outcomes. The outcome is decided at home, between visits, where nobody looks.', 7.7);
  const boxes = [['Discharge', 'A plan on the fridge.', LIGHT, INK], ['30 days at home', 'Quiet. Nobody looks.', SOFT, BLUE], ['Readmission', 'The provider pays a penalty.', CORAL_SOFT, CORAL]];
  boxes.forEach(([h, b, fill, col], i) => {
    const x = 0.6 + i * 3.05;
    R(s, { x, y: 2.05, w: 2.7, h: 1.3, fill: { color: fill } });
    T(s, h, { x: x + 0.2, y: 2.15, w: 2.4, h: 0.5, fontSize: 20, bold: true, color: col });
    T(s, b, { x: x + 0.2, y: 2.65, w: 2.4, h: 0.6, fontSize: 13, color: GREY });
    if (i < 2) T(s, '→', { x: x + 2.68, y: 2.4, w: 0.45, h: 0.6, fontSize: 28, color: GREY, align: 'center' });
  });
  const stats = [['$36 B', 'a year in readmissions'], ['2.0 M', 'readmissions a year'], ['up to 3%', 'of Medicare payments at risk'], ['$8 k', 'extra per delirium episode']];
  stats.forEach(([n, l], i) => {
    const x = 0.6 + i * 2.15;
    T(s, n, { x, y: 3.75, w: 2.0, h: 0.6, fontSize: 28, bold: true, color: BLUE });
    T(s, l, { x, y: 4.35, w: 2.0, h: 0.4, fontSize: 11, color: GREY });
  });
  T(s, 'HCUP 2020 · CMS HRRP · AHRQ', { x: 0.6, y: 4.95, w: 6, h: 0.3, fontSize: 9, color: '9CA3AF' });
  corner(s, 'half-a-house');
  s.addNotes('1:15. Value-based care moved the risk to providers: readmission penalties up to three percent of Medicare payments, 36 billion a year in readmissions, heart failure and delirium at the top of the list. The outcome is decided at home, between visits, and nobody is there. So the product is a daily visit.');
}

// 4 ---------------------------------------------------------------- demo
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  title(s, 'No tests. Just a visit.');
  sub(s, 'She makes something every day: a signature, her own words, a finished picture. Each one is also a measurement.', 8.8, 1.0);
  const H = 3.05, y = 1.78;
  let x = 0.6;
  const cards = [['01-sign-c.png', 'Sign the book', 'motor baseline · orientation'], ['05-chat-question-c.png', 'A few questions', 'her own words · latency'], ['07-puzzle-anna-c.png', 'A puzzle, with Anna', 'attention · space · company'], ['08-goodbye-c.png', 'Goodbye', 'did she come · how fast']];
  cards.forEach(([f, h, m]) => {
    const w = phone(s, f, x, y, H);
    T(s, h, { x: x - 0.35, y: y + H + 0.1, w: w + 0.7, h: 0.28, fontSize: 13, bold: true, align: 'center' });
    T(s, m, { x: x - 0.35, y: y + H + 0.38, w: w + 0.7, h: 0.3, fontSize: 10, color: GREY, align: 'center' });
    x += w + 0.72;
  });
  s.addNotes('1:15 to 3:00. Play the 75-second clip, or click through. She signs in (a motor baseline, and the date is the orientation item). She answers a nurse\'s questions in her own words; a model reads what she meant and never advises. She does a puzzle and her granddaughter joins (attention, visuospatial, and the reason to open the app). Goodbye. Nothing on her screen is ever a score.');
}

// 5 ---------------------------------------------------------------- what the phone saw
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  title(s, 'What the phone saw.', 5.2);
  R(s, { x: 0.6, y: 1.15, w: 4.9, h: 1.05, fill: { color: CORAL_SOFT }, line: { color: CORAL, width: 1.5 } });
  T(s, '“Margaret’s signature was slower, more hesitant and a different shape than usual today.”', { x: 0.8, y: 1.22, w: 4.5, h: 0.9, fontSize: 16, italic: true, color: CORAL });
  const tw = 2.3, th = tw * (150 / 212);
  s.addImage({ path: S + '14-sig-baseline.png', x: 0.6, y: 2.4, w: tw, h: th });
  s.addImage({ path: S + '15-sig-today.png', x: 3.2, y: 2.4, w: tw, h: th });
  T(s, 'Her usual, and today. It looks the same. It wasn’t.', { x: 0.6, y: 4.15, w: 4.9, h: 0.4, fontSize: 13, bold: true, color: INK });
  T(s, 'What the family sees. Margaret sees a thank-you and her page in the book.', { x: 0.6, y: 4.6, w: 4.9, h: 0.5, fontSize: 11, color: GREY });
  s.addImage({ path: S + 'ztable-5.png', x: 5.85, y: 1.15, w: 3.75, h: 3.75 * (346 / 892) });
  T(s, 'Nine features against her own five-day baseline: time to start, total time, pauses, strokes, speed, smoothness, size, shape.', { x: 5.85, y: 2.75, w: 3.75, h: 0.75, fontSize: 11, color: GREY });
  T(s, 'Robust z: today minus her usual, over her usual spread. Well outside on two features is a flag. Three days is a trend.', { x: 5.85, y: 3.55, w: 3.75, h: 0.75, fontSize: 11, color: GREY });
  T(s, 'Real numbers from the demo build.', { x: 5.85, y: 4.35, w: 3.75, h: 0.3, fontSize: 9, italic: true, color: '9CA3AF' });
  corner(s, 'cat-with-no-face');
  s.addNotes('3:00. Same visit, real numbers. Five ordinary signings form her baseline; today she took 4.5 seconds against her usual 3.1 and paused four times longer between strokes. To the eye the strip looks the same. Nine features, robust z against her own usual. The family gets one plain sentence; she gets a thank-you.');
}

// 6 ---------------------------------------------------------------- five things, one visit
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  title(s, 'Five things, one visit.');
  sub(s, 'Every bedside instrument checks the first four, once a shift, in hospital. None sees the fifth, because nobody comes back hours later.', 8.8, 1.0);
  const cards = [
    ['Attention', 'Days backwards in the chat. Search time between pieces in the puzzle.'],
    ['Orientation', '“What is today?”, asked the way a friend would.'],
    ['Disorganised thinking', 'Coherence of her own words. Order of placement in the puzzle.'],
    ['Arousal', 'Did she open it. How long before the first stroke.'],
    ['Fluctuation', 'Morning against evening. Today against her own baseline.'],
    ['40% preventable', 'Water, sleep, glasses, hearing aids, a phone call. A flag has a cheap answer.']
  ];
  cards.forEach(([h, b], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 3.05, y = 1.75 + row * 1.45;
    const blue = i >= 4;
    R(s, { x, y, w: 2.75, h: 1.25, fill: { color: blue ? BLUE : LIGHT } });
    T(s, h, { x: x + 0.18, y: y + 0.12, w: 2.4, h: 0.38, fontSize: 15, bold: true, color: blue ? 'FFFFFF' : INK });
    T(s, b, { x: x + 0.18, y: y + 0.52, w: 2.4, h: 0.7, fontSize: 11, color: blue ? ICE : GREY });
  });
  T(s, 'The same construct every day, at home, against her own usual. That is the white space.', { x: 0.6, y: 4.75, w: 7.8, h: 0.45, fontSize: 14, italic: true, color: BLUE });
  corner(s, 'flower-with-no-petals');
  s.addNotes('3:45. CAM, 4AT, UB-2: all measure attention, orientation, disorganised thinking and arousal, once a shift at best, in hospital. The fifth, fluctuation, needs the same measure every day, at home, against the person\'s own normal. That is the white space. And 40 percent of delirium is preventable with cheap responses, so a flag is worth having.');
}

// 7 ---------------------------------------------------------------- clinic and family
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  title(s, 'The visit carries the clinic’s questions.');
  T(s, 'A nurse writes the question in plain words. Ernie asks it every morning and reads the answer.', { x: 0.6, y: 1.1, w: 4.4, h: 0.55, fontSize: 14, color: GREY });
  const items = ['What does the scale say this morning?', 'Is it harder to breathe today than yesterday?', 'Can you say the days of the week backwards?', 'What have you been up to today?'];
  items.forEach((q, i) => {
    R(s, { x: 0.6, y: 1.75 + i * 0.66, w: 4.4, h: 0.54, fill: { color: LIGHT } });
    T(s, q, { x: 0.8, y: 1.75 + i * 0.66, w: 4.1, h: 0.54, fontSize: 13, color: INK, valign: 'middle' });
  });
  T(s, 'The runbook refuses clinical words, instructions, and more than six questions a day.', { x: 0.6, y: 4.5, w: 4.4, h: 0.5, fontSize: 11, italic: true, color: GREY });
  R(s, { x: 5.4, y: 1.1, w: 4.0, h: 3.9, fill: { color: BLUE } });
  T(s, 'When something changes, explain the loop', { x: 5.6, y: 1.25, w: 3.6, h: 0.6, fontSize: 15, bold: true, color: 'FFFFFF' });
  const ex = [['What changed', 'Her signature was slower and she paused longer.'], ['What it usually means', 'A change in attention can be the first sign of an infection or a new tablet.'], ['Who to call', 'The care line today. Not 911.']];
  ex.forEach(([h, b], i) => {
    const y = 1.95 + i * 0.85;
    T(s, h, { x: 5.6, y, w: 3.6, h: 0.3, fontSize: 11, bold: true, color: ICE });
    T(s, b, { x: 5.6, y: y + 0.3, w: 3.6, h: 0.5, fontSize: 12, color: 'FFFFFF' });
  });
  T(s, 'Designed, not yet built. Decision support, never a diagnosis; a human on every flag.', { x: 5.6, y: 4.5, w: 3.6, h: 0.45, fontSize: 9.5, italic: true, color: ICE });
  s.addNotes('4:20. Two shipped scripts, delirium watch and heart failure watch. The rails: the nurse owns the wording, the model only reads answers, and Margaret is never told a score. The explanation layer on the right is the design: what changed, what it usually means, who to call before the ER. Say clearly it is not built yet.');
}

// 8 ---------------------------------------------------------------- close
{
  const s = pres.addSlide();
  s.background = { color: INK };
  T(s, 'What’s next', { x: 0.6, y: 0.5, w: 6, h: 0.7, fontSize: 36, bold: true, color: 'FFFFFF' });
  const next = [['1', 'Data leaves the phone', 'One process, one file: events, baselines, a family link.'], ['2', 'Three real people, three days', 'Does a finger signature hold a baseline? Does a live doodle beat a check-in?'], ['3', 'The explanation layer', 'A flag opens what changed, what it means, who to call.']];
  next.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.0;
    R(s, { x: 0.6, y, w: 0.55, h: 0.55, fill: { color: BLUE }, rectRadius: 0.28 });
    T(s, n, { x: 0.6, y, w: 0.55, h: 0.55, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    T(s, h, { x: 1.35, y: y - 0.02, w: 4.8, h: 0.35, fontSize: 16, bold: true, color: 'FFFFFF' });
    T(s, b, { x: 1.35, y: y + 0.33, w: 4.8, h: 0.5, fontSize: 12, color: ICE });
  });
  T(s, 'How it was built: nine design docs, a component kit that bakes in the 80+ criteria, a critic that audits every screen, and Claude for the research, for reading replies, and for the code.', { x: 0.6, y: 4.5, w: 5.8, h: 0.8, fontSize: 11, color: '9CA3AF' });
  for (const [n, x, y] of [['half-a-house', 6.6, 0.5], ['cat-with-no-face', 8.0, 1.7], ['flower-with-no-petals', 6.6, 2.9]]) s.addImage({ path: `${S}doodle-${n}-white.png`, x, y, w: 1.6, h: 1.6 });
  T(s, 'Synthetic people only. Not a medical device.', { x: 6.6, y: 4.75, w: 3.0, h: 0.4, fontSize: 10, italic: true, color: '9CA3AF' });
  s.addNotes('4:40. Three next steps, then the honesty line: synthetic data, decision support, a human on every flag. Close on Margaret: the point is that someone notices on the day it starts.');
}

pres.writeFile({ fileName: 'ernie-talk.pptx' }).then((f) => console.log('wrote', f));
