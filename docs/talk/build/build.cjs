const pptxgen = require('pptxgenjs');
const S = './shots/';
const INK = '111827', BLUE = '1E40AF', SOFT = 'DBEAFE', CORAL = 'C8402F', CORAL_SOFT = 'FDE2E2', GREY = '4B5563', LIGHT = 'F3F4F6', PAPER = 'FFFFFF', ICE = 'C7D2FE', MUTED = '9CA3AF';
const F = 'Arial';
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Christopher Pluntke';
pres.title = 'ernie: a daily visit';

const T = (s, text, o) => s.addText(text, Object.assign({ fontFace: F, color: INK, isTextBox: true, margin: 0 }, o));
const R = (s, o) => s.addShape(pres.ShapeType.roundRect, Object.assign({ rectRadius: 0.15, line: { color: GREY, width: 0 } }, o));
const title = (s, text, w = 8.8) => T(s, text, { x: 0.6, y: 0.4, w, h: 0.65, fontSize: 32, bold: true });
const sub = (s, text, w = 8.8, y = 1.05) => T(s, text, { x: 0.6, y, w, h: 0.6, fontSize: 15, color: GREY });
const foot = (s, text) => T(s, text, { x: 0.6, y: 5.08, w: 8.8, h: 0.45, fontSize: 8, color: MUTED });
const corner = (s, name) => s.addImage({ path: `${S}doodle-${name}-blue.png`, x: 8.55, y: 4.45, w: 1.05, h: 1.05 });
const arrow = (s, x1, y1, x2, y2, color = GREY) => s.addShape(pres.ShapeType.line, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipH: x2 < x1, flipV: y2 < y1, line: { color, width: 2, endArrowType: 'triangle' } });
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
  s.addNotes('0:00. One breath: "This is ernie, a daily visit for someone like Margaret. Five minutes: who she is, what is missing in her care, what we built, how it was built, what is next."');
}

// 2 ---------------------------------------------------------------- Margaret
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  T(s, 'Margaret is 84.', { x: 0.6, y: 0.4, w: 5.8, h: 0.65, fontSize: 32, bold: true });
  T(s, 'Every morning she signs Ernie’s book. This morning she was slower, and nobody was there to notice.', { x: 0.6, y: 1.15, w: 5.6, h: 1.1, fontSize: 21, color: INK });
  T(s, 'Hypoactive delirium, the most common kind, looks like nothing at all: quieter, slower, a little withdrawn. The cause is usually cheap to fix on the day: an infection, dehydration, a new tablet. Missed, it ends in the emergency room.', { x: 0.6, y: 2.3, w: 5.6, h: 1.15, fontSize: 14, color: GREY });
  const tiles = [['60–75%', 'of cases unrecognised in hospital and in the ED ¹'], ['7 M+', 'hospitalised US adults affected each year ²'], ['40–100 k', 'lives a year, if home detection prevented delirium as well as hospital programmes do. A ceiling ⁸']];
  tiles.forEach(([n, l], i) => {
    const x = 0.6 + i * 1.95;
    R(s, { x, y: 3.45, w: 1.8, h: 1.05, fill: { color: SOFT } });
    T(s, n, { x: x + 0.12, y: 3.5, w: 1.6, h: 0.45, fontSize: 22, bold: true, color: BLUE });
    T(s, l, { x: x + 0.12, y: 3.93, w: 1.6, h: 0.55, fontSize: 8.5, color: GREY });
  });
  T(s, 'Delirium is a change from your own baseline. The home never had one.', { x: 0.6, y: 4.55, w: 5.9, h: 0.5, fontSize: 13, italic: true, color: BLUE });
  foot(s, '¹ Narrative review (PMC 2026); ED delirium screening (PMC 2024).  ² Frontiers in Public Health 2026, MCBS 2019–21.  ⁸ Witlox et al., JAMA 2010 (38.0% vs 27.5% dead at ~2 years, adjusted HR 1.95) × 1.3–2.6 M older adults a year × 30–40% preventable (HELP). Association, not proof; see sources slide.');
  phone(s, '03-book-page-c.png', 7.1, 0.5, 4.5);
  s.addNotes('0:30. Margaret is a person, not a use case. Hypoactive delirium is withdrawal; the first anyone knows is the ER. Unrecognised in 60 to 75 percent of cases even where clinicians are looking, and nothing at home looks at all. People who have delirium are far more likely to be dead two years later; if we could prevent it at home the way hospital programmes do, that is tens of thousands of lives a year, and I will say plainly that is a ceiling, not a claim. The thesis in one line: delirium is a change from your own baseline, and the home never had one.');
}

// 3 ---------------------------------------------------------------- the gap, in numbers
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  title(s, 'The gap is the 30 days at home.');
  sub(s, 'Value-based care makes hospitals carry the cost of patients who come back. What sends Medicare patients back, and what a missed bad day costs.', 8.8, 1.0);
  // chart: top five Medicare readmission conditions by count, 2020
  T(s, 'Medicare 30-day readmissions by cause at first admission, 2020 ³', { x: 0.6, y: 1.65, w: 5.3, h: 0.3, fontSize: 10.5, bold: true, color: INK });
  s.addChart(pres.ChartType.bar, [{ name: 'Readmissions', labels: ['Septicemia', 'Heart failure', 'Kidney failure', 'Pneumonia', 'Diabetes with complications'], values: [207.3, 147.8, 60.0, 58.9, 58.7] }], {
    x: 0.5, y: 1.95, w: 5.3, h: 2.55, barDir: 'bar', barGapWidthPct: 45,
    chartColors: [BLUE], showLegend: false, showTitle: false,
    showValue: true, dataLabelPosition: 'outEnd', dataLabelFormatCode: '#,##0"k"', dataLabelFontSize: 10, dataLabelColor: INK, dataLabelFontFace: F,
    catAxisLabelFontSize: 10.5, catAxisLabelColor: INK, catAxisLabelFontFace: F, catAxisOrientation: 'maxMin', catGridLine: { style: 'none' },
    valAxisHidden: true, valGridLine: { style: 'none' }, valAxisMaxVal: 260
  });
  T(s, 'Delirium is not a diagnosis category here. It rides inside these stays and multiplies the odds of coming back by 2.6 ⁵. About 11% of Medicare hospital stays involve it ².', { x: 0.6, y: 4.5, w: 5.2, h: 0.55, fontSize: 10.5, color: GREY });
  // stats column
  const stats = [
    ['$36 B', 'a year: 2.0 M Medicare readmissions at $18,100 each, 17 per 100 stays ³'],
    ['up to 3%', 'off every Medicare inpatient payment for a year when a hospital’s readmissions run high. FY2022: 2,499 hospitals, $521 M ⁴'],
    ['+$8,110', 'in hospital charges when a stay involves delirium, against a stay that does not ²'],
    ['$3.6–5.4 B', 'a year of Medicare readmissions attributable to delirium. If a quarter is avoidable, as for readmissions generally: about $1 B ⁶ ⁷']
  ];
  stats.forEach(([n, l], i) => {
    const y = 1.6 + i * 0.88;
    T(s, n, { x: 6.2, y, w: 3.3, h: 0.38, fontSize: 21, bold: true, color: i === 1 ? CORAL : BLUE });
    T(s, l, { x: 6.2, y: y + 0.36, w: 3.3, h: 0.5, fontSize: 9, color: GREY });
  });
  foot(s, '³ AHRQ HCUP Statistical Brief 307, NRD 2020.  ⁴ CMS HRRP; KFF, 10 Years of Hospital Readmissions Penalties (FY2022).  ⁵ Community hospital cohort, n = 8,645, OR 2.60 (PMC 2019).  ⁶ van Walraven et al., CMAJ 2011.  ⁷ Back-of-envelope from ²,³,⁵: upper bound, assumes the association is causal; see sources slide.');
  s.addNotes('1:15. Value-based care moved the cost of coming back onto the hospital: a readmission penalty is a haircut on every Medicare inpatient payment for a year, up to three percent. Sepsis and heart failure send the most people back; delirium is not a category, it rides inside those stays and more than doubles the odds of returning. A stay with delirium bills about eight thousand dollars more. Put together, on the order of four to five billion dollars of Medicare readmissions a year ride on delirium; if a quarter of those are avoidable, that is about a billion. Upper bound, and no one has yet shown a home check-in moves it. The outcome is decided at home, between visits, and nobody is there. So: a daily visit.');
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
  s.addNotes('2:00 to 3:30. Play the 75-second clip, or click through. She signs in (a motor baseline; the date is the orientation item). She answers a nurse\'s questions in her own words; a model reads what she meant and never advises. She does a puzzle and her granddaughter joins (attention, visuospatial, and the reason to open the app). Goodbye. Nothing on her screen is ever a score.');
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
  T(s, 'Real numbers from the demo build.', { x: 5.85, y: 4.35, w: 3.75, h: 0.3, fontSize: 9, italic: true, color: MUTED });
  corner(s, 'cat-with-no-face');
  s.addNotes('3:30. Same visit, real numbers. Five ordinary signings form her baseline; today she took 4.5 seconds against her usual 3.1 and paused four times longer between strokes. To the eye the two look the same. Nine features, robust z against her own usual. The family gets one plain sentence; she gets a thank-you.');
}

// 6 ---------------------------------------------------------------- how it was built
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  title(s, 'How it was built.');
  sub(s, 'A pipeline with a reviewer in it.', 8.8, 1.0);
  const stages = [
    ['Research', 'flower-with-no-petals', 'A Claude research agent wrote the insight map and the 80+ design criteria.'],
    ['Sketches', 'half-a-house', 'Nine design docs, one template. Product and engineering in one file.'],
    ['ernie-ui', 'cat-with-no-face', 'A component kit with the criteria baked in. Synced to Claude Design.'],
    ['The app', null, 'One small web service. Claude reads her replies as data, never advice. Works without a model.']
  ];
  const W = 2.05, G = 0.2, Y = 1.75, H = 1.85;
  stages.forEach(([h, d, b], i) => {
    const x = 0.6 + i * (W + G);
    R(s, { x, y: Y, w: W, h: H, fill: { color: i === 3 ? BLUE : LIGHT } });
    T(s, h, { x: x + 0.18, y: Y + 0.15, w: W - 0.8, h: 0.4, fontSize: 16, bold: true, color: i === 3 ? 'FFFFFF' : INK });
    if (d) s.addImage({ path: `${S}doodle-${d}-blue.png`, x: x + W - 0.66, y: Y + 0.08, w: 0.58, h: 0.58 });
    T(s, b, { x: x + 0.18, y: Y + 0.7, w: W - 0.36, h: H - 0.8, fontSize: 11.5, color: i === 3 ? ICE : GREY });
    if (i < 3) arrow(s, x + W + 0.02, Y + 0.4, x + W + G - 0.02, Y + 0.4, GREY);
  });
  R(s, { x: 0.6, y: 4.0, w: 8.8, h: 0.9, fill: { color: SOFT } });
  T(s, 'ux-critic', { x: 0.8, y: 4.1, w: 1.5, h: 0.4, fontSize: 16, bold: true, color: BLUE });
  T(s, 'Runs before every pull request. Drives the real page, checks it against the 80+ checklist, and blocks anything an 84-year-old could not use.', { x: 2.3, y: 4.08, w: 6.9, h: 0.75, fontSize: 11.5, color: INK });
  arrow(s, 8.1, Y + H + 0.02, 8.1, 3.98, BLUE);
  arrow(s, 5.5, 3.98, 5.5, Y + H + 0.02, BLUE);
  T(s, 'audits', { x: 8.2, y: 3.72, w: 0.8, h: 0.2, fontSize: 8, color: BLUE });
  T(s, 'fixes', { x: 5.6, y: 3.72, w: 0.8, h: 0.2, fontSize: 8, color: BLUE });
  foot(s, 'All of it is in the repository.');
  s.addNotes('4:05. Built as a pipeline, not a one-off. A research agent produced the insight map and the 80+ criteria. Nine sketches on one doc template, product and engineering together. A component kit with the criteria baked in, synced to Claude Design. One small web service; Claude reads her replies as data and never advises. And a reviewer in the loop: before any UI change merges, a senior-centred critic drives the real page and blocks anything an 84-year-old could not use.');
}

// 7 ---------------------------------------------------------------- close
{
  const s = pres.addSlide();
  s.background = { color: INK };
  T(s, 'What’s next', { x: 0.6, y: 0.5, w: 6, h: 0.7, fontSize: 36, bold: true, color: 'FFFFFF' });
  const next = [['1', 'Data leaves the phone', 'One process, one file: events, baselines, a family link.'], ['2', 'Three real people, three days', 'Does a finger signature hold a baseline? Does a live doodle beat a check-in?'], ['3', 'The explanation layer', 'A flag opens what changed, what it usually means, who to call before the ER.']];
  next.forEach(([n, h, b], i) => {
    const y = 1.45 + i * 1.0;
    R(s, { x: 0.6, y, w: 0.55, h: 0.55, fill: { color: BLUE }, rectRadius: 0.28 });
    T(s, n, { x: 0.6, y, w: 0.55, h: 0.55, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    T(s, h, { x: 1.35, y: y - 0.02, w: 4.8, h: 0.35, fontSize: 16, bold: true, color: 'FFFFFF' });
    T(s, b, { x: 1.35, y: y + 0.33, w: 4.8, h: 0.5, fontSize: 12, color: ICE });
  });
  T(s, 'Decision support, never a diagnosis. A human on every flag.', { x: 0.6, y: 4.5, w: 5.8, h: 0.5, fontSize: 13, italic: true, color: ICE });
  for (const [n, x, y] of [['half-a-house', 6.6, 0.5], ['cat-with-no-face', 8.0, 1.7], ['flower-with-no-petals', 6.6, 2.9]]) s.addImage({ path: `${S}doodle-${n}-white.png`, x, y, w: 1.6, h: 1.6 });
  T(s, 'Synthetic people only. Not a medical device.', { x: 6.6, y: 4.75, w: 3.0, h: 0.4, fontSize: 10, italic: true, color: MUTED });
  s.addNotes('4:40. Three next steps, then the honesty line: synthetic data, decision support, a human on every flag. Close on Margaret: the point is that someone notices on the day it starts.');
}

// 8 ---------------------------------------------------------------- sources (not spoken)
{
  const s = pres.addSlide();
  s.background = { color: PAPER };
  title(s, 'Sources');
  const rows = [
    ['1', 'Delirium unrecognised in up to 60% of hospital cases and about 75% in the emergency department.', 'Delirium in Hospitalized Older Adults: A Narrative Review (PMC, 2026); Delirium screening in the emergency department (PMC, 2024).'],
    ['2', 'Delirium affects over 7 million hospitalised US adults a year; 11% of Medicare beneficiaries had an episode; +$8,110 hospital charges per delirium stay (95% CI $1,860–$14,360).', 'Additional hospitalization costs associated with delirium among older adults, Frontiers in Public Health, 2026 (Medicare Current Beneficiary Survey 2019–2021).'],
    ['3', 'Medicare: 2,002,700 30-day readmissions in 2020, 17.0 per 100 index stays, $36.2 B aggregate, $18,100 average. Top causes at index admission: septicemia 207,300; heart failure 147,800; acute renal failure 60,000; pneumonia 58,900; diabetes with complications 58,700.', 'AHRQ HCUP Statistical Brief #307, Nationwide Readmissions Database, 2020.'],
    ['4', 'HRRP reduces a hospital’s Medicare inpatient payments by up to 3% for a fiscal year when 30-day readmissions for six conditions exceed the expected rate. FY2022: 2,499 of 3,139 hospitals penalised, average 0.64%, 39 at the 3% maximum, about $521 M withheld.', 'CMS, Hospital Readmissions Reduction Program; KFF, 10 Years of Hospital Readmissions Penalties.'],
    ['5', 'Inpatient delirium associated with 30-day readmission, adjusted OR 2.60 (95% CI 1.96–3.44); 718 delirious vs 7,927 non-delirious patients, one community hospital, 2010–2015.', 'Association between Inpatient Delirium and Hospital Readmission in Patients ≥65 (PMC, 2019).'],
    ['6', 'Median 27% of readmissions judged avoidable across 34 studies (range 5–79%). Multicomponent prevention (HELP) cut delirium incidence from 15.0% to 9.9%.', 'van Walraven et al., CMAJ 2011; Inouye et al., NEJM 1999.'],
    ['7', 'Back of the envelope: 11.8 M Medicare stays × 11% = 1.3 M delirium stays. With 2.0–2.6× the readmission risk and a 17% overall rate, delirium stays run 15–23 points above the rest: 200–300 k excess readmissions × $18,100 = $3.6–5.4 B a year. × 27% avoidable ≈ $1.0–1.5 B. Upper bound: delirium also marks sicker patients, and no trial yet shows a home check-in reduces readmissions.', 'Derived from sources 2, 3 and 5.'],
    ['8', 'Lives: 38.0% of older patients who had delirium were dead at ~2 years vs 27.5% of controls (adjusted HR 1.95, 95% CI 1.51–2.52; 7 studies). That 10-point excess on 1.3–2.6 M older adults a year is 130–270 k deaths associated with delirium. If home detection prevented delirium as well as in-hospital programmes (30–40%) and deaths fell with it: 40–100 k a year. Association only; delirium also marks frailty, and no trial shows a home check-in saves lives.', 'Witlox et al., JAMA 2010; Inouye et al., NEJM 1999; sources 2 and 3.']
  ];
  const heights = [0.4, 0.45, 0.55, 0.55, 0.45, 0.45, 0.72, 0.78];
  let yy = 1.0;
  rows.forEach(([n, claim, src], i) => {
    const y = yy, h = heights[i];
    T(s, n, { x: 0.6, y, w: 0.3, h: 0.3, fontSize: 11, bold: true, color: BLUE });
    T(s, claim, { x: 0.95, y, w: 5.6, h: h - 0.05, fontSize: 7.5, color: INK });
    T(s, src, { x: 6.7, y, w: 2.8, h: h - 0.05, fontSize: 7.5, italic: true, color: GREY });
    yy += h;
  });
  s.addNotes('Not spoken. Left in the deck so every number on slides 2 and 3 can be checked.');
}

pres.writeFile({ fileName: 'ernie-talk.pptx' }).then((f) => console.log('wrote', f));
