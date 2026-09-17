const pptxgen = require('pptxgenjs');
const S = './shots/';
const INK = '111827', BLUE = '1E40AF', SOFT = 'DBEAFE', CORAL = 'C8402F', SAGE = 'A3C98D', PAPER = 'FFFFFF', GREY = '4B5563', LIGHT = 'F3F4F6', GREEN = '14532D';
const F = 'Arial';
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9'; // 10 x 5.625
pres.author = 'Christopher Pluntke';
pres.title = 'ernie: a daily visit';

const T = (slide, text, o) => slide.addText(text, Object.assign({ fontFace: F, color: INK, isTextBox: true, margin: 0 }, o));
const R = (slide, o) => slide.addShape(pres.ShapeType.roundRect, Object.assign({ rectRadius: 0.15, line: { color: GREY, width: 0 } }, o));
const phone = (slide, file, x, y, h, caption) => {
  const w = h * (780 / 1606);
  R(slide, { x: x - 0.06, y: y - 0.06, w: w + 0.12, h: h + 0.12, fill: { color: INK }, rectRadius: 0.22 });
  slide.addImage({ path: S + file, x, y, w, h });
  if (caption) T(slide, caption, { x: x - 0.3, y: y + h + 0.1, w: w + 0.6, h: 0.5, fontSize: 12, color: GREY, align: 'center', valign: 'top' });
  return w;
};
const doodle = (slide, name, x, y, w, variant = 'blue') => slide.addImage({ path: `${S}doodle-${name}-${variant}.png`, x, y, w, h: w });

// ---------------------------------------------------------------- 1 title (dark)
{
  const s = pres.addSlide();
  s.background = { color: BLUE };
  doodle(s, 'half-a-house', 6.1, 0.5, 2.0, 'white');
  doodle(s, 'cat-with-no-face', 7.7, 1.9, 2.0, 'white');
  doodle(s, 'flower-with-no-petals', 6.0, 3.1, 2.0, 'white');
  T(s, 'ernie', { x: 0.6, y: 1.3, w: 5.4, h: 1.0, fontSize: 60, bold: true, color: 'FFFFFF' });
  T(s, 'A daily visit that notices a bad day at home before it becomes a hospital day.', { x: 0.6, y: 2.35, w: 5.2, h: 1.4, fontSize: 22, color: 'FFFFFF' });
  T(s, 'Christopher Pluntke  ·  September 2026', { x: 0.6, y: 4.6, w: 5.4, h: 0.4, fontSize: 13, color: 'C7D2FE' });
  s.addNotes('0:00. One line. "This is ernie, a daily visit for someone like Margaret. Five minutes: who she is, what is missing in her care, what we built, why delirium, and what is next."');
}

// ---------------------------------------------------------------- 2 Margaret
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  T(s, 'Margaret is 84.', { x: 0.6, y: 0.5, w: 5.6, h: 0.7, fontSize: 40, bold: true });
  T(s, 'Every morning she signs Ernie’s book. This morning she didn’t.', { x: 0.6, y: 1.3, w: 5.4, h: 1.2, fontSize: 24, color: INK });
  T(s, 'Hypoactive delirium, the most common kind, looks like nothing at all: quieter, slower, a little withdrawn. It has a cause you can treat in a day: an infection, dehydration, a new tablet.', { x: 0.6, y: 2.55, w: 5.4, h: 1.4, fontSize: 15, color: GREY });
  R(s, { x: 0.6, y: 4.05, w: 2.5, h: 1.05, fill: { color: SOFT } });
  T(s, '60–75%', { x: 0.75, y: 4.1, w: 2.3, h: 0.55, fontSize: 30, bold: true, color: BLUE });
  T(s, 'missed, even in hospital', { x: 0.75, y: 4.65, w: 2.3, h: 0.35, fontSize: 11, color: GREY });
  R(s, { x: 3.3, y: 4.05, w: 2.7, h: 1.05, fill: { color: SOFT } });
  T(s, '0%', { x: 3.45, y: 4.1, w: 2.5, h: 0.55, fontSize: 30, bold: true, color: BLUE });
  T(s, 'noticed at home, where it starts', { x: 3.45, y: 4.65, w: 2.5, h: 0.35, fontSize: 11, color: GREY });
  phone(s, '03-book-page-c.png', 7.1, 0.5, 4.6);
  doodle(s, 'cat-with-no-face', 5.85, 3.95, 1.1);
  s.addNotes('0:30. Margaret is a person, not a use case. Hypoactive delirium is withdrawal; the first anyone knows is the ER. It is missed in 60 to 75 percent of hospital cases, and nothing at home looks for it at all. The cause is usually cheap to fix if you catch it.');
}

// ---------------------------------------------------------------- 3 missing link
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  T(s, 'The missing link is the 30 days at home.', { x: 0.6, y: 0.45, w: 7.7, h: 0.7, fontSize: 27, bold: true });
  T(s, 'Value-based care pays providers for outcomes. The outcome is decided at home, between visits. Nobody is there daily.', { x: 0.6, y: 1.2, w: 8.8, h: 0.7, fontSize: 16, color: GREY });
  // flow: hospital -> home (empty) -> ER
  const boxes = [
    ['Discharge', 'A plan on the fridge', LIGHT, INK],
    ['30 days at home', 'Nobody looks. The signal is quiet.', SOFT, BLUE],
    ['Readmission', 'The provider pays a penalty.', 'FDE2E2', CORAL]
  ];
  boxes.forEach(([h, sub, fill, col], i) => {
    const x = 0.6 + i * 3.05;
    R(s, { x, y: 2.15, w: 2.7, h: 1.35, fill: { color: fill } });
    T(s, h, { x: x + 0.2, y: 2.25, w: 2.4, h: 0.5, fontSize: 20, bold: true, color: col });
    T(s, sub, { x: x + 0.2, y: 2.75, w: 2.4, h: 0.65, fontSize: 13, color: GREY });
    if (i < 2) T(s, '→', { x: x + 2.68, y: 2.5, w: 0.45, h: 0.6, fontSize: 28, color: GREY, align: 'center' });
  });
  const stats = [['$36 B', 'a year in 30-day readmissions'], ['2.0 M', 'readmissions a year'], ['up to 3%', 'of Medicare payments at risk (HRRP)'], ['$8 k', 'extra per delirium episode']];
  stats.forEach(([n, l], i) => {
    const x = 0.6 + i * 2.25;
    T(s, n, { x, y: 3.85, w: 2.1, h: 0.6, fontSize: 28, bold: true, color: BLUE });
    T(s, l, { x, y: 4.45, w: 2.1, h: 0.6, fontSize: 11, color: GREY });
  });
  doodle(s, 'half-a-house', 8.45, 0.25, 1.15);
  s.addNotes('1:15. Value-based care moved the risk to providers: readmission penalties, 36 billion a year in readmissions, delirium and heart failure at the top of the list. The outcome is decided at home, between visits, and nobody is there. So the product is a daily visit. Sources: HCUP 2020, CMS HRRP, artifact ledger.');
}

// ---------------------------------------------------------------- 4 demo
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  T(s, 'No tests. Just a visit.', { x: 0.6, y: 0.4, w: 8.8, h: 0.65, fontSize: 34, bold: true });
  T(s, 'Sign in, a few questions in her own words, a puzzle with Anna, goodbye. Every one of them is also a measurement.', { x: 0.6, y: 1.05, w: 8.8, h: 0.5, fontSize: 15, color: GREY });
  const H = 3.15, y = 1.75;
  let x = 0.6;
  for (const [f, c] of [['01-sign-c.png', '1  Sign the book'], ['04-chat-invite-c.png', '2  A few questions'], ['07-puzzle-anna-c.png', '3  A puzzle, with Anna'], ['08-goodbye-c.png', '4  Goodbye']]) {
    const w = phone(s, f, x, y, H, c);
    x += w + 0.72;
  }
  s.addNotes('1:15 to 3:00. Play the 75-second clip, or click through. Narrate: she signs in (motor baseline, orientation); she answers a nurse\'s questions in her own words (a model reads what she meant, never advises); she does a puzzle and her granddaughter joins (attention, visuospatial, and the social pull); goodbye. Nothing on her screen is a score. Then switch to the next slide: what the phone saw.');
}

// ---------------------------------------------------------------- 5 what the phone saw
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  T(s, 'What the phone saw.', { x: 0.6, y: 0.4, w: 5.2, h: 0.65, fontSize: 34, bold: true });
  R(s, { x: 0.6, y: 1.15, w: 4.9, h: 1.3, fill: { color: SOFT } });
  T(s, '“Margaret’s signature was slower, more hesitant and a different shape than usual today.”', { x: 0.8, y: 1.25, w: 4.5, h: 1.1, fontSize: 17, italic: true, color: BLUE });
  const rows = [['Her own baseline', 'Five signings, median and spread per feature. No population norms; delirium is a change from your usual.'], ['Nine features', 'Time to start, total time, pauses, strokes, speed, smoothness, size, shape.'], ['Robust z', 'Today minus usual, over the spread. Two features past 2 is different from usual; three days is a trend.'], ['Who sees it', 'The family and the clinic. Margaret sees a thank-you and her page in the book.']];
  rows.forEach(([h, b], i) => {
    const y = 2.65 + i * 0.66;
    T(s, h, { x: 0.6, y, w: 1.7, h: 0.6, fontSize: 13, bold: true, color: INK });
    T(s, b, { x: 2.3, y, w: 3.2, h: 0.6, fontSize: 11, color: GREY });
  });
  R(s, { x: 5.85, y: 0.45, w: 3.75, h: 4.75, fill: { color: LIGHT } });
  s.addImage({ path: S + 'backend-fit.png', x: 6.0, y: 0.6, w: 3.45, h: 3.45 * (1205 / 960) });
  s.addNotes('3:00. This is the backend view from the same visit, real numbers. Her signature today took 4.1 seconds against a usual 3.1, and she paused four times longer between strokes. Nine features, robust z against her own five-day baseline. She never sees this; the family gets one plain sentence, the clinic gets the numbers.');
}

// ---------------------------------------------------------------- 6 why delirium
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  T(s, 'Why delirium first.', { x: 0.6, y: 0.4, w: 6, h: 0.65, fontSize: 34, bold: true });
  T(s, 'Every instrument measures the same four things. None can see the fifth, because nobody re-tests hours later. A daily visit can.', { x: 0.6, y: 1.05, w: 6.2, h: 0.65, fontSize: 15, color: GREY });
  const cards = [['Attention', 'days backwards, search time in the puzzle'], ['Orientation', '“What is today?” as a friend would ask'], ['Disorganised thinking', 'coherence of her own words, order in the puzzle'], ['Arousal', 'did she open it, how fast did she start'], ['Fluctuation', 'morning vs evening, day vs her own baseline']];
  cards.forEach(([h, b], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 2.15, y = 1.85 + row * 1.5;
    const last = i === 4;
    R(s, { x, y, w: 2.0, h: 1.3, fill: { color: last ? BLUE : LIGHT } });
    T(s, h, { x: x + 0.15, y: y + 0.12, w: 1.75, h: 0.4, fontSize: 14, bold: true, color: last ? 'FFFFFF' : INK });
    T(s, b, { x: x + 0.15, y: y + 0.55, w: 1.75, h: 0.7, fontSize: 10.5, color: last ? 'DBEAFE' : GREY });
  });
  R(s, { x: 7.1, y: 1.85, w: 2.3, h: 2.8, fill: { color: SOFT } });
  T(s, '40%', { x: 7.25, y: 2.0, w: 2.0, h: 0.8, fontSize: 40, bold: true, color: BLUE });
  T(s, 'of delirium is preventable with water, sleep, glasses, hearing aids and a phone call. A flag has a cheap answer.', { x: 7.25, y: 2.8, w: 2.0, h: 1.7, fontSize: 11, color: INK });
  T(s, 'Delirium is a change from your own baseline. The home never had one.', { x: 0.6, y: 4.85, w: 8.8, h: 0.5, fontSize: 15, italic: true, color: BLUE });
  doodle(s, 'flower-with-no-petals', 8.55, 4.6, 0.95);
  s.addNotes('3:45. CAM, 4AT, UB-2: all measure attention, orientation, disorganised thinking and arousal, once a shift at best, in hospital. The fifth feature, fluctuation, needs the same measure every day, at home, against the person\'s own normal. That is the white space. And 40 percent of delirium is preventable with cheap responses, so a flag is worth having.');
}

// ---------------------------------------------------------------- 7 clinic and family
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  T(s, 'The visit carries the clinic’s questions.', { x: 0.6, y: 0.4, w: 8.8, h: 0.65, fontSize: 32, bold: true });
  // left: runbook items as chat bubbles
  T(s, 'A nurse writes the question in plain words. Ernie asks it every morning.', { x: 0.6, y: 1.1, w: 4.4, h: 0.5, fontSize: 14, color: GREY });
  const items = ['What does the scale say this morning?', 'Is it harder to breathe today than yesterday?', 'Can you say the days of the week backwards?', 'What have you been up to today?'];
  items.forEach((q, i) => {
    R(s, { x: 0.6, y: 1.7 + i * 0.68, w: 4.4, h: 0.55, fill: { color: LIGHT } });
    T(s, q, { x: 0.8, y: 1.7 + i * 0.68, w: 4.1, h: 0.55, fontSize: 13, color: INK, valign: 'middle' });
  });
  T(s, 'Refused at the desk: clinical words, instructions, more than six a day.', { x: 0.6, y: 4.5, w: 4.4, h: 0.5, fontSize: 11, italic: true, color: GREY });
  // right: explanation card
  R(s, { x: 5.4, y: 1.1, w: 4.0, h: 3.9, fill: { color: BLUE } });
  T(s, 'When something changes, explain the loop', { x: 5.6, y: 1.25, w: 3.6, h: 0.6, fontSize: 15, bold: true, color: 'FFFFFF' });
  const ex = [['What changed', 'Her signature was slower and she paused longer.'], ['What it usually means', 'A change in attention can be the first sign of an infection or a new tablet.'], ['Who to call', 'The care line today. Not 911.']];
  ex.forEach(([h, b], i) => {
    const y = 1.95 + i * 0.85;
    T(s, h, { x: 5.6, y, w: 3.6, h: 0.3, fontSize: 11, bold: true, color: 'C7D2FE' });
    T(s, b, { x: 5.6, y: y + 0.3, w: 3.6, h: 0.5, fontSize: 12, color: 'FFFFFF' });
  });
  T(s, 'Design, not yet built. Decision support, never a diagnosis; a human on every flag.', { x: 5.6, y: 4.5, w: 3.6, h: 0.45, fontSize: 9.5, italic: true, color: 'C7D2FE' });
  s.addNotes('4:20. Two shipped scripts, delirium watch and heart failure watch. The rails matter: the nurse owns the wording, the model only reads answers, and nothing is ever told to Margaret about a score. The explanation layer, on the right, is the design: what changed, what it usually means, who to call before the ER. Say clearly it is not built yet.');
}

// ---------------------------------------------------------------- 8 close (dark)
{
  const s = pres.addSlide();
  s.background = { color: INK };
  T(s, 'What’s next', { x: 0.6, y: 0.5, w: 6, h: 0.7, fontSize: 36, bold: true, color: 'FFFFFF' });
  const next = [['1', 'Data leaves the phone', 'One process, one file: events, baselines, a family link.'], ['2', 'Three real people, three days', 'Does a finger signature hold a baseline? Does the doodle beat the check-in?'], ['3', 'The explanation layer', 'A flag opens what changed, what it means, who to call.']];
  next.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.0;
    R(s, { x: 0.6, y, w: 0.55, h: 0.55, fill: { color: BLUE }, rectRadius: 0.28 });
    T(s, n, { x: 0.6, y, w: 0.55, h: 0.55, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    T(s, h, { x: 1.35, y: y - 0.02, w: 4.8, h: 0.35, fontSize: 16, bold: true, color: 'FFFFFF' });
    T(s, b, { x: 1.35, y: y + 0.33, w: 4.8, h: 0.5, fontSize: 12, color: 'C7D2FE' });
  });
  T(s, 'How it was built: nine design docs, a component kit that bakes in the 80+ criteria, a critic that audits every screen, and Claude for the research, the reading of replies, and the code.', { x: 0.6, y: 4.5, w: 5.8, h: 0.8, fontSize: 11, color: '9CA3AF' });
  doodle(s, 'half-a-house', 6.6, 0.5, 1.6, 'white');
  doodle(s, 'cat-with-no-face', 8.0, 1.7, 1.6, 'white');
  doodle(s, 'flower-with-no-petals', 6.6, 2.9, 1.6, 'white');
  T(s, 'Synthetic people only. Not a medical device.', { x: 6.6, y: 4.75, w: 3.0, h: 0.4, fontSize: 10, italic: true, color: '9CA3AF' });
  s.addNotes('4:40. Three next steps, then the honesty line: synthetic data, decision support, a human on every flag. Close on Margaret: the point is that someone notices on the day it starts.');
}

pres.writeFile({ fileName: 'ernie-talk.pptx' }).then((f) => console.log('wrote', f));
