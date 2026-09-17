import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
const b = await (async()=>{try{return await chromium.launch()}catch(e){return await chromium.launch({executablePath:['/opt/pw-browsers/chromium','/usr/bin/chromium'].find(existsSync)})}})();
const errs=[];
const probe = (p) => p.evaluate(() => {
  const w=document.getElementById('body-wrap'), wb=w.getBoundingClientRect();
  const frac=(e)=>{const r=e.getBoundingClientRect(); if(!r.height) return 0;
    return +(Math.max(0,Math.min(r.bottom,wb.bottom)-Math.max(r.top,wb.top))/r.height).toFixed(2);};
  const t=document.getElementById('screen-title'); const ps=[...document.querySelectorAll('#body-area p')];
  return { scrollTop: w.scrollTop, overflow: Math.max(0,w.scrollHeight-w.clientHeight),
    title: t?frac(t):null, worstP: ps.length?Math.min(...ps.map(frac)):null,
    note: document.getElementById('topbar-note').innerText,
    btns: [...document.querySelectorAll('#actions-inner button')].map(x=>x.innerText.replace(/\n/g,' ')) };
});
for (const [w,h,tag] of [[1280,800,'13in '],[390,844,'phone'],[1280,600,'short'],[640,400,'zoom2'],[320,640,'n320 ']]) {
  const p = await b.newPage({ viewport:{width:w,height:h} });
  p.on('pageerror', e=>errs.push(tag+': '+e.message));
  await p.goto('http://localhost:8099/'); await p.waitForTimeout(700);
  const box = await (await p.$('.pad-wrap')).boundingBox();
  await p.mouse.move(box.x+30, box.y+box.height*0.55); await p.mouse.down();
  for(let i=1;i<=14;i++){await p.mouse.move(box.x+30+i*(box.width-60)/14, box.y+box.height*0.55);await p.waitForTimeout(5);} 
  await p.mouse.up(); await p.waitForTimeout(200);
  await p.locator('button',{hasText:'Done signing'}).click(); await p.waitForTimeout(350);
  for (let i=0;i<30;i++){
    const t = await p.evaluate(()=>[...document.querySelectorAll('button')].map(x=>x.innerText).join('||'));
    if (/Yes, on my own/.test(t)) break;
    const pref = p.locator('.app button:visible',{hasText:/Carry on|Yes, go ahead|Next|That is all|No, thank you|Not today|Send my answer/}).first();
    const tgt = (await pref.count())?pref:p.locator('.app main button:visible, .app .actions button:visible').last();
    if(!(await tgt.count())) break;
    if (await p.locator('#say').count()) await p.locator('#say').fill('saturday friday thursday wednesday');
    await tgt.click({timeout:4000}).catch(()=>{}); await p.waitForTimeout(350);
  }
  console.log(tag, 'PUZZLE OFFER', JSON.stringify(await probe(p)));
  await p.screenshot({ path:`/tmp/claude-0/-home-user-ernie/cd6513ad-51b4-51b8-bcc9-da66c9d95153/scratchpad/offer-${tag.trim()}.png` });
  await p.close();
}
console.log('errors:', errs.length?errs.join(';'):'none');
await b.close();
