// Controlled animation inspection, separate from legal gameplay regression.
import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
const dir=path.resolve('artifacts/barracks-frames');fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:1280,height:850}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:8765');await page.waitForFunction(()=>window.origins);
 await page.locator('#start-game').click();await page.locator('.save-slot').first().click();await page.locator('[data-level="1"]').click();await page.locator('#enter-level').click();await page.waitForFunction(()=>origins.app.scene==='battle');
 await page.evaluate(()=>{const{app,world:w}=origins;app.modal=true;const s=w.slots.find(s=>String(s.holder)==='33');window.inspectSlot=s;w.time=0;w.build(s.id,'barrack');});
 for(let i=0;i<180;i++){
  const result=await page.evaluate(i=>{const{world:w,renderer:r}=origins,s=inspectSlot;let label='建造 → 开门 → 出营';
   if(i===75){const soldier=w.soldiers[0];w.spawn({key:'enemy_gnoll_reaver',road:0,lane:0});const e=w.enemies[0],route=w.routes[0][0];let n=0;for(let j=0;j<route.points.length;j++)if(Math.hypot(route.points[j].x-s.rally.x,route.points[j].y-s.rally.y)<Math.hypot(route.points[n].x-s.rally.x,route.points[n].y-s.rally.y))n=j;e.d=route.lengths[n];e.speed=0;e.hp=e.maxHp=500;e.damage=[0,0];}
   if(i===120){w.enemies=[];w.soldiers[0].hp=0;}
   if(i===145){for(let k=0;k<380;k++)w.step(1/30);}
   if(i>=75&&i<120)label='接敌 → 挥剑 → 命中';else if(i>=120&&i<145)label='死亡动作与尸体';else if(i>=145)label='14 秒后开门补员';
   w.step(1/15);r.draw(w);const p=r.screen(s),c=document.createElement('canvas');c.width=720;c.height=540;const x=c.getContext('2d');x.drawImage(r.canvas,p.x-230,p.y-130,400,300,0,0,720,540);x.fillStyle='#102919e8';x.fillRect(0,0,720,44);x.fillStyle='#f4e6ba';x.font='20px sans-serif';x.fillText(label,18,29);return c.toDataURL('image/png').split(',')[1];},i);
  fs.writeFileSync(path.join(dir,String(i).padStart(4,'0')+'.png'),Buffer.from(result,'base64'));
 }
 if(errors.length)throw new Error(errors.join('\n'));if(await page.evaluate(()=>origins.renderer.missing.size))throw new Error('Missing animation frames');
 await page.evaluate(()=>{origins.app.modal=false;origins.app.selected=inspectSlot.id;origins.app.showBuildMenu();});await page.screenshot({path:'artifacts/barracks-command-ring.png'});
 console.log('Captured 180 deterministic frames: construction, door, running, attack, death, replenishment.');
}finally{await browser.close();}
