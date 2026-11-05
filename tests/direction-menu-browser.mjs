import{dismissOpeningTutorial}from'./tutorial-helper.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
try{
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8766');await page.waitForFunction(()=>window.origins);
 await page.locator('#start-game').click();await page.locator('.save-slot').first().waitFor();await page.locator('.save-slot').first().click();await page.locator('[data-level="1"]').click();await page.locator('#enter-level').click();await page.waitForFunction(()=>origins.app.scene==='battle');await dismissOpeningTutorial(page);
 const checks=await page.evaluate(async()=>{
  const{onRoute,World}=await import('./domain.mjs'),{renderer:r,repo}=origins,original=r.sprite,results=[];
  try{for(const id of[1,2,3])for(const mode of['campaign','heroic','iron']){
   const data=await repo.level(id,mode);await r.loadLevel(data);const w=new World(data);let count=0;
   for(let road=0;road<w.routes.length;road++)for(let lane=0;lane<w.routes[road].length;lane++){
    const route=w.routes[road][lane];if(!route)continue;
    for(const key of Object.keys(data.templates).filter(k=>k.startsWith('enemy_')&&data.templates[k].render?.sprites?.[0]?.angles?.walk)){
     w.spawn({key,road,lane});const e=w.enemies.at(-1),raw=data.templates[key].render.sprites[0];w.enemies=[e];
     for(let i=1;i<route.points.length;i+=Math.max(1,Math.floor(route.points.length/12))){Object.assign(e,onRoute(route,route.lengths[i]));r.enemyDirections.delete(e);const calls=[];r.sprite=(...a)=>{if(a[1]?.startsWith(raw.prefix+'_'))calls.push(a);};r.draw(w);const draw=calls[0];if(!draw)throw Error('No enemy sprite '+key);const vertical=Math.abs(e.dy)>Math.abs(e.dx),up=vertical&&e.dy>0,down=vertical&&e.dy<0;const anim=raw.prefix+'_'+(up?'walkingUp':down?'walkingDown':'walkingRightLeft');if(draw[1]!==r.frame(anim,data.templates[key].coward_duration?w.time-(e.walkAt||0):w.time+e.id*.031))throw Error('Wrong frame '+key);if(draw[7]!==(!vertical&&e.dx<0))throw Error('Wrong mirror '+key);count++;}
    }
   }results.push({id,mode,samples:count});
  }}finally{r.sprite=original;await r.loadLevel(origins.world.data);}return results;
 });assert.ok(checks.every(v=>v.samples>0));
 await page.evaluate(()=>{origins.world.startWave();for(let i=0;i<1200;i++)origins.world.step(1/60);origins.world.paused=true;origins.renderer.draw(origins.world);});
 await page.locator('[data-build-slot="6"]').click();
 const opening=await page.evaluate(()=>{const a=origins.app.menuTween;a.pause();a.currentTime=0;return a.effect.getTiming().duration;});assert.equal(opening,120);
 for(const t of[0,30,60,90,120]){const style=await page.evaluate(async t=>{origins.app.menuTween.currentTime=t;await Promise.all([...document.querySelectorAll('#build-menu canvas')].map(c=>origins.renderer.icon(c,c.dataset.icon)));const s=getComputedStyle(document.querySelector('#build-menu'));return{scale:Number(s.scale),opacity:Number(s.opacity)};},t);assert.ok(Math.abs(style.scale-(.6/.88+(1-.6/.88)*(1-(1-t/120)**2)))<.002);assert.ok(Math.abs(style.opacity-(1-(1-t/120)**2))<.002);await page.screenshot({path:`artifacts/menu-open-${t}.png`});}
 await page.evaluate(()=>{origins.app.menuTween.finish();});await page.evaluate(()=>new Promise(requestAnimationFrame));
 await page.keyboard.press('Escape');await page.evaluate(()=>{origins.app.menuTween.pause();origins.app.menuTween.currentTime=60;});assert.equal(await page.locator('#build-menu').evaluate(e=>e.inert),true);await page.evaluate(()=>origins.app.menuTween.finish());await page.waitForFunction(()=>document.querySelector('#build-menu').hidden);
 // A reopened menu must survive cancellation of the previous close animation.
 await page.locator('[data-build-slot="6"]').click();await page.keyboard.press('Escape');await page.locator('[data-build-slot="5"]').click();await page.evaluate(()=>origins.app.menuTween.finish());await page.evaluate(()=>new Promise(requestAnimationFrame));assert.equal(await page.locator('#build-menu').evaluate(e=>e.hidden),false);
 await page.emulateMedia({reducedMotion:'reduce'});await page.keyboard.press('Escape');assert.equal(await page.locator('#build-menu').evaluate(e=>e.hidden),true);await page.locator('[data-build-slot="6"]').click();assert.equal(await page.locator('#build-menu').evaluate(e=>getComputedStyle(e).opacity),'1');
 if(process.env.RECORD){
  await page.emulateMedia({reducedMotion:'no-preference'});await page.evaluate(()=>{const a=origins.app,w=origins.world;a.selected=null;a.showBuildMenu();a.menuTween?.finish();w.paused=false;a.modal=true;});
  for(let i=0;i<120;i++){
   await page.evaluate(i=>{const a=origins.app,w=origins.world;if(i===15){a.selected=6;a.showBuildMenu();a.menuTween.pause();}if(i>=15&&i<20&&a.menuTween)a.menuTween.currentTime=Math.min(120,(i-15)*1000/30);if(i===20)a.menuTween?.finish();if(i===75){a.selected=null;a.showBuildMenu();a.menuTween.pause();}if(i>=75&&i<80&&a.menuTween)a.menuTween.currentTime=Math.min(120,(i-75)*1000/30);if(i===80)a.menuTween?.finish();w.step(1/30);origins.renderer.draw(w);},i);
   await page.locator('#game').screenshot({path:`artifacts/direction-menu-${String(i).padStart(4,'0')}.png`});
  }
 }
 assert.deepEqual(errors,[]);assert.deepEqual(await page.evaluate(()=>[...origins.renderer.missing]),[]);
 fs.writeFileSync('artifacts/direction-menu-validation.json',JSON.stringify({status:'passed',checks,menu:{duration:120,scale:[.6/.88,1],easing:'out-quad',close:true,reopen:true,reducedMotion:true},errors},null,2));console.log(JSON.stringify({status:'passed',checks}));
}finally{await browser.close();}
