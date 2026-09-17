import { chromium } from '/home/user/ernie/tools/ux-audit/node_modules/playwright/index.mjs';
const OUT = '/tmp/claude-0/-home-user-ernie/d37adab5-11ca-50bd-b03c-224e8e145e37/scratchpad/shots/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const shot = (n) => page.screenshot({ path: OUT + n + '.png' });
const btn = (name) => page.getByRole('button', { name, exact: false }).first();

async function sign(shaky, slow) {
  await page.waitForSelector('#pad', { timeout: 10000 });
  await page.waitForTimeout(400);
  const box = await page.locator('#pad').boundingBox();
  const X = (u) => box.x + box.width * u, Y = (v) => box.y + box.height * v;
  const j = () => (shaky ? (Math.random() - 0.5) * 6 : 0);
  const d = slow ? 28 : 6;
  // stroke 1: a big cursive-ish "M"
  const s1 = [[0.10,0.68],[0.14,0.30],[0.20,0.66],[0.26,0.30],[0.31,0.66]];
  // stroke 2: a long wavy "argaret" line
  const s2 = []; for (let k = 0; k <= 22; k++) s2.push([0.34 + k * 0.025, 0.55 + Math.sin(k * 0.9) * 0.12 + (k % 5 === 0 ? -0.12 : 0)]);
  // stroke 3: a flourish
  const s3 = [[0.62,0.72],[0.75,0.74],[0.88,0.70]];
  for (const s of [s1, s2, s3]) {
    await page.mouse.move(X(s[0][0]) + j(), Y(s[0][1]) + j());
    await page.mouse.down();
    for (let i = 1; i < s.length; i++) {
      await page.mouse.move(X(s[i][0]) + j(), Y(s[i][1]) + j(), { steps: 6 });
      await page.waitForTimeout(d);
    }
    await page.mouse.up();
    await page.waitForTimeout(slow ? 500 : 120);
  }
}
async function signAndDate() {
  await btn('Done signing').click();
  await page.waitForSelector('.answer');
  const today = new Date();
  const label = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][today.getDay()] + ' ' + today.getDate();
  await page.locator('.answer', { hasText: label }).first().click();
  await page.waitForSelector('.page');
}

await page.goto('http://localhost:10000/');
await page.evaluate(() => localStorage.clear());
await page.reload();
// baseline: five ordinary signatures
for (let i = 0; i < 5; i++) {
  await sign(false, false);
  if (i === 0) await shot('01-sign');
  await signAndDate();
  if (i === 0) await shot('03-book-page');
  await page.locator('#restart').click();
}
// today: slow and shaky
await sign(true, true);
await btn('Done signing').click();
await page.waitForSelector('.answer');
await shot('02-what-is-today');
const today = new Date();
await page.locator('.answer', { hasText: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][today.getDay()] + ' ' + today.getDate() }).first().click();
await page.waitForSelector('.page');
await btn('Carry on').click();
await page.waitForSelector('text=may I ask you a few things');
await shot('04-chat-invite');
await btn('Yes, go ahead').click();
await page.waitForSelector('.ask');
await page.evaluate(() => { document.getElementById('body-wrap').scrollTop = 0; });
await page.waitForTimeout(200);
await shot('05-chat-question');
// answer through the items (tap-only widgets)
for (let i = 0; i < 8; i++) {
  const ask = await page.locator('.ask').count();
  if (!ask) break;
  const a = page.locator('.answer').first();
  if (await a.count()) { await a.click(); }
  else if (await page.locator('textarea.say').count()) {
    await page.locator('textarea.say').fill('I sat in the garden and read the paper');
    await btn('Done').click();
  } else if (await page.locator('.pad-keys').count()) {
    await page.locator('.pad-keys button', { hasText: '8' }).click(); await page.locator('.pad-keys button', { hasText: '2' }).click();
    await btn('Done').click();
  } else break;
  await page.waitForTimeout(250);
}
await page.waitForSelector('text=puzzle');
await shot('06-puzzle-invite');
await btn('Ask Anna to join me').click();
await page.waitForSelector('#play');
await page.waitForTimeout(9000);
await shot('07-puzzle-anna');
await btn('Leave it for now').click();
await page.waitForSelector('text=Goodbye');
await shot('08-goodbye');
// backend view on a wide screen
await page.setViewportSize({ width: 1280, height: 860 });
await page.waitForTimeout(500);
const open = await page.locator('#backend').isHidden();
if (open) await page.locator('#backend-toggle').click();
await page.waitForTimeout(500);
await page.screenshot({ path: OUT + '09-backend.png' });
const sentence = await page.locator('.sentence').first().textContent().catch(() => null);
await page.locator('.sentence').first().screenshot({ path: OUT + '11-sentence.png' });
await page.locator('table.z').first().screenshot({ path: OUT + '12-ztable.png' });
await page.locator('.strip').first().screenshot({ path: OUT + '13-strip.png' });
const items = page.locator('.strip__item');
const n = await items.count();
await items.nth(0).screenshot({ path: OUT + '14-sig-baseline.png' });
await items.nth(n - 1).screenshot({ path: OUT + '15-sig-today.png' });
await page.locator('#backend').screenshot({ path: OUT + '10-backend-panel.png' });
console.log('sentence:', sentence);
await b.close();
