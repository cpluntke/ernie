import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
const b = await (async()=>{try{return await chromium.launch()}catch(e){return await chromium.launch({executablePath:['/opt/pw-browsers/chromium','/usr/bin/chromium'].find(existsSync)})}})();
const errs=[];
const probe = (p, label) => p.evaluate((label) => {
  const w = document.getElementById('body-wrap'), wb = w.getBoundingClientRect();
  const vis = (sel) => { const e = document.querySelector(sel); if (!e) return null;
    const r = e.getBoundingClientRect(); return r.top >= wb.top-1 && r.bottom <= wb.bottom+1; };
  const cut = [...w.querySelectorAll('h1, p, button, .answer')].filter(e => {
    const r = e.getBoundingClientRect(); return r.height > 8 && (r.bottom > wb.bottom+1 || r.top < wb.top-1);
  }).map(e => (e.tagName+': '+e.innerText).replace(/\n/g,' ').slice(0,42));
  return { label, overflow: Math.max(0, w.scrollHeight - w.clientHeight), scrollTop: w.scrollTop,
    title: vis('#screen-title'), askVisible: vis('.ask:last-of-type'), helper: vis('.text--soft'),
    cutOff: cut.slice(0,3) };
}, label);
for (const [w,h,tag] of [[1280,800,'13in '],[390,844,'phone'],[1280,600,'short'],[640,400,'zoom2'],[320,640,'n320 ']]) {
  const p = await b.newPage({ viewport: { width:w, height:h } });
  p.on('pageerror', e=>errs.push(tag+': '+e.message));
  await p.goto('http://localhost:8099/'); await p.waitForTimeout(700);
  console.log(tag, JSON.stringify(await probe(p,'signin')));
  const box = await (await p.$('.pad-wrap')).boundingBox();
  await p.mouse.move(box.x+30, box.y+box.height*0.6); await p.mouse.down();
  for(let i=1;i<=14;i++){await p.mouse.move(box.x+30+i*(box.width-60)/14, box.y+box.height*0.6);await p.waitForTimeout(5);} 
  await p.mouse.up(); await p.waitForTimeout(200);
  await p.locator('button',{hasText:'Done signing'}).click(); await p.waitForTimeout(350);
  console.log(tag, JSON.stringify(await probe(p,'date')));
  let sawChat = false;
  for (let i=0;i<30;i++){
    const t = await p.evaluate(()=>[...document.querySelectorAll('button')].map(x=>x.innerText).join('||'));
    if (/Yes, on my own/.test(t)) break;
    if (!sawChat && await p.locator('.ask').count()) { sawChat = true; console.log(tag, JSON.stringify(await probe(p,'chat'))); }
    const pref = p.locator('.app button:visible',{hasText:/Carry on|Yes, go ahead|Next|Done|That is all|No, thank you|Not today|Send my answer/}).first();
    const tgt = (await pref.count())?pref:p.locator('.app main button:visible, .app .actions button:visible').last();
    if(!(await tgt.count())) break;
    if (await p.locator('#say').count()) await p.locator('#say').fill('saturday friday thursday wednesday');
    await tgt.click({timeout:4000}).catch(()=>{}); await p.waitForTimeout(350);
  }
  await p.locator('button',{hasText:'Not today, thank you'}).click(); await p.waitForTimeout(600);
  console.log(tag, JSON.stringify(await probe(p,'goodbye')),
    JSON.stringify(await p.evaluate(()=>({footer:[...document.querySelectorAll('#actions-inner button')].map(x=>x.innerText), topbar:document.querySelector('.topbar').innerText.replace(/\n/g,' | ')}))));
  await p.close();
}
console.log('errors:', errs.length?errs.join(';'):'none');
await b.close();
