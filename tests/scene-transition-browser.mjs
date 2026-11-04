import{chromium}from'playwright';import assert from'node:assert/strict';
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
 await p.goto(process.env.TEST_URL||'http://127.0.0.1:8765');await p.waitForFunction(()=>window.origins);
 await p.evaluate(()=>{const a=origins.app;a.progress.unlocked=3;a.showMap();const original=a.repo.level.bind(a.repo);a.repo.level=async(...args)=>{await new Promise(r=>window.releaseLevel=r);return original(...args);};window.enterPromise=a.enterLevel(2,'campaign');});
 assert.equal(await p.evaluate(()=>origins.app.enterLevel(3,'campaign')),false);
 await p.waitForFunction(()=>origins.app.sceneMotion.phase==='closed');assert.equal(await p.evaluate(()=>origins.app.scene),'map');assert.equal(await p.evaluate(()=>origins.world),null);
 await p.screenshot({path:'artifacts/scene-doors-closed.png'});await p.keyboard.press('Space');assert.equal(await p.evaluate(()=>origins.world),null);
 await p.evaluate(()=>releaseLevel());assert.equal(await p.evaluate(()=>enterPromise),true);assert.equal(await p.evaluate(()=>origins.world.id),2);assert.equal(await p.locator('#scene-transition').isVisible(),false);
 await p.evaluate(()=>{window.mapPromise=origins.app.showMap();});await p.waitForFunction(()=>origins.app.sceneMotion.phase==='closing');await p.screenshot({path:'artifacts/scene-doors-closing.png'});assert.equal(await p.evaluate(()=>mapPromise),true);assert.equal(await p.evaluate(()=>origins.app.scene),'map');
 // A late level fetch cannot restore a battle after a different scene is chosen.
 await p.evaluate(()=>{window.enterPromise=origins.app.enterLevel(3,'campaign');});await p.waitForFunction(()=>origins.app.sceneMotion.phase==='closed');await p.evaluate(()=>{origins.app.showTitle();releaseLevel();});assert.equal(await p.evaluate(()=>enterPromise),false);assert.equal(await p.evaluate(()=>origins.app.scene),'title');assert.equal(await p.locator('#scene-transition').isVisible(),false);
 await p.setViewportSize({width:844,height:390});await p.evaluate(()=>{origins.app.repo.level=async()=>{throw new Error('controlled load failure');};window.enterPromise=origins.app.enterLevel(2,'campaign');});assert.equal(await p.evaluate(()=>enterPromise),false);assert.equal(await p.evaluate(()=>origins.app.scene),'map');assert.equal(await p.locator('#scene-transition').isVisible(),false);await p.screenshot({path:'artifacts/scene-map-mobile.png'});
 assert.deepEqual(errors,[]);console.log('Native door handoff, slow load, duplicate, cancellation, failure recovery, return map and mobile pass');
}finally{await b.close();}
