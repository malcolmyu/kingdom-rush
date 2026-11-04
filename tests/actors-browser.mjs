// Controlled original actor poses: domain actions drive the real Canvas renderer.
import {chromium}from'playwright';import assert from'node:assert/strict';import fs from'node:fs';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
try{await page.goto('http://127.0.0.1:8765');await page.waitForFunction(()=>window.origins);await page.locator('#start-game').click();await page.locator('.save-slot').first().click();await page.locator('[data-level="1"]').click();await page.locator('#enter-level').click();await page.waitForFunction(()=>origins.app.scene==='battle');
const results=[];
for(const pose of['walk-right','walk-left','ranged-right','ranged-left','sword-change','melee-left','death','tombstone','respawn','burner-melee-left','burner-shoot-right']){
 const result=await page.evaluate(pose=>{const{world:w,renderer:r,app}=origins;app.modal=true;w.time=0;w.enemies=[];w.soldiers=[];w.shots=[];w.addHero();const h=w.hero;Object.assign(h,{x:500,y:350,target:{x:500,y:350},anim:0});w.spawn({key:pose.startsWith('burner')?'enemy_gnoll_burner':'enemy_gnoll_reaver',road:0,lane:0});const e=w.enemies[0];Object.assign(e,{x:620,y:350,dx:1,dy:0});const tick=dt=>{w.time+=dt;w.updateHero(dt,w.enemies,new Set());};
 if(pose.startsWith('walk')){h.target.x=pose.endsWith('right')?750:250;tick(.1);}
 if(pose.startsWith('ranged')){e.x=pose.endsWith('right')?620:380;tick(1/60);tick(.1);}
 if(['sword-change','melee-left'].includes(pose)){e.x=477;tick(1/60);if(pose==='melee-left'){tick(.2);tick(.1);}}
 if(['death','tombstone','respawn'].includes(pose)){h.hp=0;tick(.1);if(pose==='tombstone')tick(2);if(pose==='respawn')tick(15);}
 if(pose.startsWith('burner')){e.x=500;h.x=pose.includes('left')?477:523;w.enemyAction(e,h,pose.includes('melee')?'attack':'shoot');w.time+=.1;e.anim-=.1;}
 const draws=[],original=r.sprite;r.sprite=function(...args){if(args[1]?.startsWith('archer_hero_')||args[1]?.startsWith('gnoll_burner_')||args[1]==='hero_death_0039')draws.push({frame:args[1],flip:args[7]});return original.apply(this,args);};try{r.draw(w);}finally{r.sprite=original;}
 return{pose,draws,missing:[...r.missing],png:r.canvas.toDataURL('image/png').split(',')[1],center:r.screen(pose.startsWith('burner')?e:h),action:h.action,shots:w.shots.length};},pose);
 assert.deepEqual(result.missing,[]);const hero=result.draws.find(d=>d.frame.startsWith('archer_hero_')),burner=result.draws.find(d=>d.frame.startsWith('gnoll_burner_'));
 if(pose==='walk-right')assert.equal(hero.flip,false);if(pose==='walk-left')assert.equal(hero.flip,true);if(pose==='ranged-right')assert.equal(hero.flip,false);if(pose==='ranged-left')assert.equal(hero.flip,true);
 if(pose.startsWith('ranged')){assert.equal(hero.frame,'archer_hero_0057');assert.equal(result.shots,0);}if(pose==='sword-change')assert.equal(hero.frame,'archer_hero_0024');if(pose==='melee-left'){assert.equal(hero.flip,true);assert.equal(hero.frame,'archer_hero_0082');}if(pose==='death')assert.equal(hero.frame,'archer_hero_0142');if(pose==='tombstone')assert.ok(result.draws.some(d=>d.frame==='hero_death_0039'));if(pose==='respawn')assert.equal(hero.frame,'archer_hero_0151');if(pose==='burner-melee-left'){assert.equal(burner.flip,true);assert.equal(burner.frame,'gnoll_burner_0130');}if(pose==='burner-shoot-right'){assert.equal(burner.flip,false);assert.equal(burner.frame,'gnoll_burner_0082');}
 fs.writeFileSync(`artifacts/actor-${pose}.png`,Buffer.from(result.png,'base64'));delete result.png;results.push(result);
}
assert.deepEqual(errors,[]);fs.writeFileSync('artifacts/actors-validation.json',JSON.stringify({status:'passed',results,errors},null,2));console.log('Hero and enemy actor poses passed: 11 actual Canvas samples.');
}finally{await browser.close();}
