import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
const b = await chromium.launch({ executablePath:['/opt/pw-browsers/chromium','/usr/bin/chromium'].find(existsSync) });
const errs=[];
for (const [w,h,tag] of [[390,844,'phone'],[1280,800,'13in ']]) {
  const p = await b.newPage({ viewport:{width:w,height:h} });
  p.on('pageerror', e=>errs.push(tag+': '+e.message));
  await p.goto('http://localhost:8099/'); await p.waitForTimeout(400);
  await p.screenshot({ path:`/tmp/claude-0/-home-user-ernie/cd6513ad-51b4-51b8-bcc9-da66c9d95153/scratchpad/gate-${tag.trim()}.png` });
  const shot = await p.evaluate(()=>{
    const i=document.getElementById('password'), btn=document.querySelector('button');
    const r=(e)=>{const b=e.getBoundingClientRect();return [Math.round(b.width),Math.round(b.height)];};
    return { field:r(i), button:r(btn), focused:document.activeElement===i,
      hScroll: document.documentElement.scrollWidth>document.documentElement.clientWidth };
  });
  // wrong first
  await p.fill('#password','ernie'); await p.click('button'); await p.waitForTimeout(400);
  const wrong = await p.evaluate(()=>({ alert:(document.querySelector('[role=alert]')||{}).innerText, stillHere:!!document.getElementById('password') }));
  await p.fill('#password','bert'); await p.click('button'); await p.waitForTimeout(900);
  const inside = await p.evaluate(()=>({ title:document.title, hasPad:!!document.querySelector('.pad-wrap') }));
  // the cookie survives a reload
  await p.reload(); await p.waitForTimeout(700);
  const again = await p.evaluate(()=>({ title:document.title, hasPad:!!document.querySelector('.pad-wrap') }));
  console.log(tag, JSON.stringify({ shot, wrong, inside, again }));
  await p.close();
}
console.log('errors:', errs.length?errs.join(';'):'none');
await b.close();
