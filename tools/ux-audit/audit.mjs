#!/usr/bin/env node
// Audit one or more URLs against the 80+ design criteria.
//
//   node audit.mjs <url> [<url> ...] [--out <dir>] [--json]
//
// Runs axe-core (WCAG A/AA/AAA + best practice) plus custom checks for the
// criteria in docs/research/design-criteria-80-plus.md that axe does not
// cover (text size, target size and spacing, icon-only controls, jargon,
// motion, zoom/reflow, line height). Writes screenshots at desktop, phone
// and 200% zoom, a JSON report, and prints a ranked markdown summary.

import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const axeSource = require('axe-core').source;

const args = process.argv.slice(2);
const urls = [];
let outDir = 'ux-audit-out';
let jsonOnly = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') outDir = args[++i];
  else if (args[i] === '--json') jsonOnly = true;
  else urls.push(args[i]);
}
if (urls.length === 0) {
  console.error('usage: node audit.mjs <url> [<url> ...] [--out <dir>] [--json]');
  process.exit(2);
}

const SEVERITY_ORDER = { blocker: 0, high: 1, medium: 2, low: 3 };
const AXE_SEVERITY = { critical: 'blocker', serious: 'high', moderate: 'medium', minor: 'low' };
// Rules that map to explicit 80+ criteria get promoted.
const AXE_PROMOTE = {
  'color-contrast-enhanced': 'high', // 7:1 is our floor, not AAA-optional
  'target-size': 'high',
  'meta-viewport': 'blocker',
  'label': 'high',
  'button-name': 'high',
  'link-name': 'high',
};

const CRITERIA = 'docs/research/design-criteria-80-plus.md';

// ---- custom checks, run inside the page ---------------------------------
const customChecks = () => {
  const issues = [];
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0';
  };
  const sel = (el) => {
    if (el.id) return `#${el.id}`;
    const tag = el.tagName.toLowerCase();
    const cls = [...el.classList].slice(0, 2).join('.');
    const txt = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30);
    return `${tag}${cls ? '.' + cls : ''}${txt ? ` "${txt}"` : ''}`;
  };
  const push = (id, severity, message, fix, el, extra) => {
    issues.push({ id, severity, message, fix, node: el ? sel(el) : null, ...extra });
  };

  // Only elements actually on top at their centre count as tap targets; content
  // scrolled beneath a sticky footer or behind a dialog overlay is not tappable.
  const onTop = (el) => {
    const r = el.getBoundingClientRect();
    const cx = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1);
    const cy = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
    const hit = document.elementFromPoint(cx, cy);
    return !hit || el === hit || el.contains(hit) || hit.contains(el);
  };
  const interactive = [...document.querySelectorAll(
    'a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=link], [role=checkbox], [role=radio], [role=tab], [role=menuitem], [onclick], [tabindex]:not([tabindex="-1"])'
  )].filter(vis).filter(onTop);

  // 1. Target size (>= 48px) and spacing (>= 8px gap)
  for (const el of interactive) {
    const r = el.getBoundingClientRect();
    const min = Math.min(r.width, r.height);
    if (min < 24) push('target-size', 'blocker', `Tap target is ${Math.round(r.width)}×${Math.round(r.height)}px`, 'Make every interactive element at least 48×48 CSS px, including padding.', el);
    else if (min < 48) push('target-size', 'high', `Tap target is ${Math.round(r.width)}×${Math.round(r.height)}px`, 'Increase to at least 48×48 CSS px (padding counts).', el);
  }
  for (let i = 0; i < interactive.length; i++) {
    const a = interactive[i].getBoundingClientRect();
    for (let j = i + 1; j < interactive.length; j++) {
      if (interactive[i].contains(interactive[j]) || interactive[j].contains(interactive[i])) continue;
      const b = interactive[j].getBoundingClientRect();
      const gapX = Math.max(a.left, b.left) - Math.min(a.right, b.right);
      const gapY = Math.max(a.top, b.top) - Math.min(a.bottom, b.bottom);
      const overlapX = gapX < 0, overlapY = gapY < 0;
      const gap = overlapX && overlapY ? 0 : overlapX ? gapY : overlapY ? gapX : Math.hypot(gapX, gapY);
      if (gap < 8) push('target-spacing', 'medium', `Targets ${Math.round(gap)}px apart: ${sel(interactive[i])} and ${sel(interactive[j])}`, 'Leave at least 8px (ideally 16px) between adjacent tap targets so a tremor does not hit the neighbour.', null);
    }
  }

  // 2. Icon-only controls (visible text required, aria-label is not enough for this audience)
  for (const el of interactive) {
    if (!/^(A|BUTTON)$/.test(el.tagName) && el.getAttribute('role') !== 'button') continue;
    const text = (el.innerText || '').trim();
    if (!text) push('icon-only-control', 'high', 'Control has no visible text label', 'Add a visible text label next to the icon; icon-only controls were widely misunderstood by older users.', el);
  }

  // 3. Text size and line height
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  const small = new Map();
  const tight = new Map();
  let n;
  while ((n = walker.nextNode())) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (!el || seen.has(el) || !vis(el)) continue;
    if (/^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName)) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    const lh = cs.lineHeight === 'normal' ? 1.2 * fs : parseFloat(cs.lineHeight);
    if (fs < 16) small.set(el, { fs, sev: 'high' });
    else if (fs < 18 && n.textContent.trim().length > 40) small.set(el, { fs, sev: 'medium' });
    if (n.textContent.trim().length > 80 && lh / fs < 1.4) tight.set(el, (lh / fs).toFixed(2));
  }
  for (const [el, { fs, sev }] of small) push('text-size', sev, `Text is ${fs}px`, 'Body text 18–20px minimum, nothing below 16px. Use rem units so browser font settings apply.', el);
  for (const [el, ratio] of tight) push('line-height', 'medium', `Line height is ${ratio}× font size`, 'Set line-height to at least 1.5 for body text.', el);

  // 4. Long lines
  for (const p of [...document.querySelectorAll('p, li')].filter(vis)) {
    const cs = getComputedStyle(p);
    const chars = p.getBoundingClientRect().width / (parseFloat(cs.fontSize) * 0.5);
    if ((p.innerText || '').length > 120 && chars > 85) push('line-length', 'low', `Line length ~${Math.round(chars)} characters`, 'Cap text blocks at about 60–75 characters per line (max-width: 65ch).', p);
  }

  // 5. Jargon
  const JARGON = /\b(URL|homepage|browser|submit|checkout|sync|cache|HTML|cookie|cookies|modal|toggle|swipe|tap and hold|long[- ]press|drag|log ?in|sign ?in|login|logout|log ?out|sign ?out|OK|cancel|settings|enable|disable|configure|authenticate|dashboard|navigate|refresh|reload)\b/gi;
  const bodyText = document.body.innerText || '';
  const hits = {};
  for (const m of bodyText.matchAll(JARGON)) hits[m[0].toLowerCase()] = (hits[m[0].toLowerCase()] || 0) + 1;
  const found = Object.entries(hits);
  if (found.length) push('jargon', 'medium', `Jargon or vague labels on page: ${found.map(([w, c]) => `"${w}"×${c}`).join(', ')}`, 'Use plain words that say what happens: "Go back" not "Cancel", "Send" not "Submit", "Call Anna" not "OK". Define any web term you must keep.', null);

  // 6. Motion, autoplay, time limits
  for (const el of [...document.querySelectorAll('*')].filter(vis)) {
    const cs = getComputedStyle(el);
    if (cs.animationName !== 'none' && cs.animationIterationCount === 'infinite') push('motion', 'high', 'Element animates continuously', 'Remove looping animation or gate it behind an explicit user action; moving content distracts and is missed.', el);
  }
  for (const m of document.querySelectorAll('video[autoplay], audio[autoplay], marquee')) push('motion', 'high', `${m.tagName.toLowerCase()} autoplays`, 'Do not autoplay; provide a large labelled play control and captions.', m);
  for (const el of document.querySelectorAll('[class*="carousel" i], [class*="slider" i], [class*="ticker" i]')) push('motion', 'medium', 'Carousel/slider present', 'Replace with static content or a single explicit "Next" button; auto-advancing content fails with this audience.', el);
  if (document.querySelector('meta[http-equiv="refresh" i]')) push('time-limit', 'blocker', 'Page auto-refreshes or redirects on a timer', 'Remove the timed refresh.', null);

  // 8. Form fields without a visible label
  for (const f of [...document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]), select, textarea')].filter(vis)) {
    const labels = f.labels ? [...f.labels].filter(vis) : [];
    const hasVisible = labels.some(l => (l.innerText || '').trim());
    if (!hasVisible) push('field-label', 'high', 'Form field has no visible label (placeholder or aria-label only)', 'Add a persistent visible label above the field; placeholders vanish on focus and are low contrast.', f);
  }

  // 9. Way back / home
  const hasBack = interactive.some(el => /\b(back|home|start|main menu)\b/i.test((el.innerText || '').trim()));
  if (!hasBack && location.pathname !== '/' && location.pathname !== '/index.html') push('no-way-back', 'high', 'No visible Back or Home control on this screen', 'Add a large, consistently placed "Back" or "Home" control; users fear dead ends and will not explore.', null);

  // 10. Colour-only status hints (heuristic: red/green text with no icon/word)
  for (const el of seen) {
    const cs = getComputedStyle(el);
    const [r, g, b] = (cs.color.match(/\d+/g) || []).map(Number);
    const isRed = r > 150 && g < 90 && b < 90, isGreen = g > 120 && r < 90 && b < 90;
    if ((isRed || isGreen) && (el.innerText || '').trim().length < 40 && !/error|success|done|saved|wrong|invalid|✓|✗|!/i.test(el.innerText)) push('color-only', 'low', `Short ${isRed ? 'red' : 'green'} text may rely on colour alone`, 'Pair colour with a word or icon ("✓ Saved", "! Please check the phone number").', el);
  }

  return issues;
};

// ---- runner --------------------------------------------------------------
await mkdir(outDir, { recursive: true });
// Prefer a browser Playwright downloaded itself; otherwise fall back to a
// system Chromium (UX_AUDIT_CHROME, or the one preinstalled in the remote
// Claude Code environment) so we never need `playwright install`.
const launch = async () => {
  try { return await chromium.launch(); } catch (e) {
    const candidates = [process.env.UX_AUDIT_CHROME, '/opt/pw-browsers/chromium', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].filter(Boolean);
    const exe = candidates.find(existsSync);
    if (!exe) throw e;
    return await chromium.launch({ executablePath: exe });
  }
};
const browser = await launch();
const report = { generatedAt: new Date().toISOString(), criteria: CRITERIA, pages: [] };

for (const url of urls) {
  const slug = url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'root';
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageReport = { url, screenshots: {}, issues: [] };
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    pageReport.error = `Could not load: ${e.message}`;
    report.pages.push(pageReport);
    await page.close();
    continue;
  }
  await page.waitForTimeout(500);

  // Screenshots: desktop, phone, desktop at 200% zoom
  const shot = async (name) => {
    const p = path.join(outDir, `${slug}-${name}.png`);
    await page.screenshot({ path: p, fullPage: true });
    pageReport.screenshots[name] = p;
  };
  await shot('desktop-1280');

  // axe
  await page.addScriptTag({ content: axeSource });
  const axe = await page.evaluate(async () => await window.axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
  }));
  const AXE_SKIP = new Set(['target-size']); // superseded by the stricter 48px custom check
  for (const v of axe.violations) {
    if (AXE_SKIP.has(v.id)) continue;
    const severity = AXE_PROMOTE[v.id] || AXE_SEVERITY[v.impact] || 'medium';
    pageReport.issues.push({
      id: `axe:${v.id}`, severity, count: v.nodes.length,
      message: v.help,
      fix: v.description + (v.nodes[0]?.failureSummary ? ' ' + v.nodes[0].failureSummary.replace(/\s+/g, ' ') : ''),
      nodes: v.nodes.slice(0, 5).map(n => n.target.join(' ')),
      helpUrl: v.helpUrl,
    });
  }

  // custom checks at desktop
  const custom = await page.evaluate(customChecks);
  const grouped = {};
  for (const i of custom) {
    const key = `${i.id}|${i.severity}`;
    grouped[key] ??= { id: i.id, severity: i.severity, count: 0, message: i.message, fix: i.fix, nodes: [] };
    grouped[key].count++;
    if (i.node && grouped[key].nodes.length < 5) grouped[key].nodes.push(i.node);
  }
  pageReport.issues.push(...Object.values(grouped));

  // 200% zoom reflow
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  await page.waitForTimeout(300);
  await shot('desktop-zoom200');
  const hscroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  if (hscroll) pageReport.issues.push({ id: 'reflow-200', severity: 'high', count: 1, message: 'Page scrolls horizontally at 200% zoom', fix: 'Use relative units and wrapping layouts so content reflows at 200% zoom with no horizontal scroll (WCAG 1.4.4 / 1.4.10).', nodes: [] });
  await page.evaluate(() => { document.documentElement.style.zoom = ''; });

  // phone width
  await page.setViewportSize({ width: 400, height: 800 });
  await page.waitForTimeout(300);
  await shot('phone-400');
  const hscrollPhone = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  if (hscrollPhone) pageReport.issues.push({ id: 'reflow-phone', severity: 'high', count: 1, message: 'Page scrolls horizontally at 400px width', fix: 'Stack layouts to one column at narrow widths; keep a 16px side gutter.', nodes: [] });
  const phoneCustom = await page.evaluate(customChecks);
  for (const i of phoneCustom.filter(i => i.id === 'target-size' || i.id === 'text-size')) {
    const existing = pageReport.issues.find(x => x.id === i.id && x.severity === i.severity);
    if (!existing) pageReport.issues.push({ id: i.id, severity: i.severity, count: 1, message: i.message + ' (phone width)', fix: i.fix, nodes: i.node ? [i.node] : [] });
  }

  pageReport.issues.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || (b.count || 1) - (a.count || 1));
  report.pages.push(pageReport);
  await page.close();
}
await browser.close();

const jsonPath = path.join(outDir, 'report.json');
await writeFile(jsonPath, JSON.stringify(report, null, 2));

if (jsonOnly) {
  console.log(jsonPath);
  process.exit(0);
}

// ---- markdown summary ----------------------------------------------------
const lines = [`# UX audit (${CRITERIA})`, ''];
let blockers = 0, highs = 0;
for (const p of report.pages) {
  lines.push(`## ${p.url}`, '');
  if (p.error) { lines.push(`**${p.error}**`, ''); continue; }
  if (!p.issues.length) lines.push('No automated issues found.', '');
  for (const i of p.issues) {
    if (i.severity === 'blocker') blockers++;
    if (i.severity === 'high') highs++;
    const where = i.nodes?.length ? ` — e.g. ${i.nodes.slice(0, 3).map(n => '`' + n + '`').join(', ')}` : '';
    lines.push(`- **[${i.severity.toUpperCase()}] ${i.id}** ×${i.count || 1}: ${i.message}${where}`);
    lines.push(`  Fix: ${i.fix}${i.helpUrl ? ` (${i.helpUrl})` : ''}`);
  }
  lines.push('', `Screenshots: ${Object.values(p.screenshots).join(', ')}`, '');
}
lines.push(`Totals: ${blockers} blocker(s), ${highs} high. Full report: ${jsonPath}`);
console.log(lines.join('\n'));
process.exit(blockers > 0 ? 1 : 0);
