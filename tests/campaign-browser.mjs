import {dismissOpeningTutorial,dismissHeroRoomHelp} from './tutorial-helper.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const origin=process.env.TEST_URL||'http://127.0.0.1:8765';
async function settle(){await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{})));});}
const out=path.resolve('artifacts');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:process.platform==='darwin'?{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}:{})});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],requests=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)requests.push([r.status(),r.url()]);});
try{
await page.goto(origin);await page.waitForFunction(()=>window.origins);
await settle();await page.screenshot({path:path.join(out,'01-开始界面.png')});
await page.getByRole('button',{name:'开始游戏',exact:true}).click();
assert.equal(await page.locator('.save-slot').count(),3);await settle();await page.screenshot({path:path.join(out,'01b-原版存档面板.png')});
await page.locator('.save-slot').first().click();await page.waitForFunction(()=>origins.app.scene==='map'&&!origins.app.sceneMotion.busy&&origins.app.mapScene?.ready);
await page.waitForFunction(()=>origins.app.mapScene.ready&&[...document.querySelectorAll('.map-flag canvas')].every(c=>origins.app.mapScene.data.frames[c.dataset.icon]));
await settle();await page.screenshot({path:path.join(out,'02-大地图.png')});
assert.ok(await page.locator('[data-level="2"]').isDisabled());assert.equal(await page.evaluate(()=>origins.app.modal),false);
await page.locator('[data-level="1"]').click();assert.equal(await page.getByRole('tab',{name:/英雄挑战/}).isDisabled(),true);
await page.getByRole('tab',{name:'战役',exact:true}).click();
while(await page.locator('#difficulty').getAttribute('data-difficulty')!=='1')await page.locator('#difficulty').click();await settle();await page.screenshot({path:path.join(out,'03-模式选择.png')});
await page.locator('#enter-level').click();await page.waitForFunction(()=>origins.app.scene==='battle');await dismissOpeningTutorial(page);
await page.locator('[data-build-slot="6"]').click();await page.locator('[data-type="artillery"]').click();await page.locator('[data-type="artillery"]').click();
assert.equal(await page.evaluate(()=>origins.world.gold),195);
await page.getByRole('button',{name:'暂停游戏',exact:true}).click();assert.equal(await page.evaluate(()=>origins.world.paused),true);await settle();await page.screenshot({path:path.join(out,'04b-原版暂停.png')});await page.getByRole('button',{name:'继续战斗',exact:true}).click();
assert.equal(await page.evaluate(()=>origins.world.paused),false);
const strategy=fs.readFileSync(new URL('./strategies.mjs',import.meta.url),'utf8').replaceAll('export ','')+'\nwindow.playCampaignTest=play;';
async function injectStrategy(){await page.addScriptTag({content:strategy});}
await injectStrategy();
await settle();await page.screenshot({path:path.join(out,'04-灰鸦港口.png')});
async function complete(){await page.waitForFunction(()=>!origins.app.sceneMotion.busy);console.log('Initial growth',await page.evaluate(()=>({stage:origins.world.id,mode:origins.world.mode,xp:origins.world.heroXp,level:origins.world.heroLevel,time:origins.world.time})));const result=await page.evaluate(()=>{const r=playCampaignTest(origins.world,1800,undefined,()=>{origins.app.events();const button=document.querySelector('#dialog[data-notification] #tutorial-ok_button');if(button){(window.closedSourceNotifications??=[]).push(origins.app.activeNotification);button.click();}});origins.app.events();origins.app.updateBattle();return r;});console.log('Completed',JSON.stringify(result));assert.equal(result.status,'won',JSON.stringify(result));const stars=await page.evaluate(()=>origins.world.mode==='campaign'?origins.world.stars:3);assert.equal(stars,3,JSON.stringify(result));assert.equal(await page.getByRole('heading',{name:'胜利！',exact:true}).count(),1);return result;}
const results=[await complete()];assert.deepEqual(await page.evaluate(()=>window.closedSourceNotifications),['POWER_REINFORCEMENT','POWER_THUNDERBOLT','TIP_HEROES']);await settle();await page.screenshot({path:path.join(out,'04c-原版结算.png')});
await page.locator('#return-map').click();
await page.reload();await page.waitForFunction(()=>window.origins);await page.locator('#start-game').click();await page.locator('.save-slot').first().click();await page.waitForFunction(()=>origins.app.scene==='map'&&!origins.app.sceneMotion.busy&&origins.app.mapScene?.ready);assert.equal(await page.evaluate(()=>origins.app.progress.stars[1]),3);assert.equal(await page.evaluate(()=>origins.app.progress.unlocked),2);await injectStrategy();
for(const id of [1,2,3])for(const mode of ['campaign','heroic','iron']){
 if(id===1&&mode==='campaign')continue;
 // Spend earned points through the real hero room before the third campaign.
 if(id===3&&mode==='campaign'){await page.locator('#hero-room').click();await dismissHeroRoomHelp(page);await page.locator('#hero-skill-multishot').click();await page.locator('#hero-train').click();await page.locator('#hero-train').click();assert.equal(await page.evaluate(()=>origins.app.progress.heroSkills.multishot),2);await page.locator('#hero-done').click();}
 await page.locator(`[data-level="${id}"]`).click();await page.locator(`[data-mode="${mode}"]`).click();while(await page.locator('#difficulty').getAttribute('data-difficulty')!=='1')await page.locator('#difficulty').click();
 await page.locator('#enter-level').click();await page.waitForFunction(()=>origins.app.scene==='battle');await dismissOpeningTutorial(page);
 if(mode==='iron'){await page.locator('[data-build-slot]').first().click();const prohibited=id===2?'mage':'archer';const option=page.locator(`[data-type="${prohibited}"]`);if(await option.count())assert.equal(await option.isDisabled(),true);await page.keyboard.press('Escape');}
 if(mode==='campaign'){
  const screenshot=path.join(out,`${id===2?'05-高桥':'06-瀑布小径'}.png`);await settle();await page.screenshot({path:screenshot});
  if(id===2){const s=await page.evaluate(()=>origins.world.slots.find(s=>!s.type));await page.locator(`[data-build-slot="${s.id}"]`).click();await page.locator('[data-type="archer"]').click();await page.locator('[data-type="archer"]').click();await page.locator(`[data-build-slot="${s.id}"]`).click();const before=await page.evaluate(()=>origins.world.gold);await page.locator('#upgrade').click();await page.locator('#upgrade').click();assert.equal(await page.evaluate(()=>origins.world.gold),before-110);await page.locator(`[data-build-slot="${s.id}"]`).click();await page.locator('#sell').click();await page.locator('#sell').click();assert.equal(await page.evaluate(()=>origins.world.gold),350);}
 }
 results.push(await complete());await page.locator('#return-map').click();
}
assert.equal(await page.evaluate(()=>Object.keys(origins.app.progress.challenges).length),6);
assert.equal(await page.evaluate(()=>Object.values(origins.app.progress.stars).reduce((a,b)=>a+b,0)),9);
await page.waitForFunction(()=>origins.app.scene==='map'&&!origins.app.sceneMotion.busy&&origins.app.mapScene?.ready);
await settle();await page.screenshot({path:path.join(out,'07-全模式完成.png')});
await page.setViewportSize({width:844,height:390});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
await page.locator('[data-level="3"]').click();await page.locator('[data-mode="iron"]').click();await settle();await page.screenshot({path:path.join(out,'08-手机模式选择.png')});
await page.locator('#enter-level').click();await page.waitForFunction(()=>origins.app.scene==='battle');await dismissOpeningTutorial(page);
const mobileSlot=await page.evaluate(()=>origins.world.slots.find(s=>!s.type).id);await page.locator(`[data-build-slot="${mobileSlot}"]`).click();await page.locator('[data-type="artillery"]').click();await page.locator('[data-type="artillery"]').click();await settle();await page.screenshot({path:path.join(out,'09-手机战场.png')});
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
assert.equal(await page.evaluate(()=>origins.app.progress.seenMapHints?.map_balloon_level_up_view),true);
assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
const missing=await page.evaluate(()=>[...origins.renderer.missing]);
fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify({status:'passed',results,errors,requests,missingFrames:missing,checks:['title','three save slots','world map','stage locks','challenge locks','all 9 legal wins','3-star challenge unlock','upgrade and sell through UI','pause and resume','persistent progress after reload','mobile landscape build and mode selection','no HTTP failures','no uncaught JS errors']},null,2));
}finally{await browser.close();}
console.log('Campaign browser flow passed: all 9 modes, persistence, mobile controls.');
