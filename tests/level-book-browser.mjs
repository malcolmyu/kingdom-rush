import{chromium}from'playwright';import assert from'node:assert/strict';import fs from'node:fs';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];let release;
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
async function settle(){await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode()));await Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{})));});}
try{
 let requested=false;const gate=new Promise(r=>release=r);await page.route(/Sun.*\.(woff2|ttf)/,async route=>{requested=true;await gate;await route.continue();});
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:8766');await page.waitForFunction(()=>window.origins);assert.equal(requested,false,'Book face must not block boot');
 await page.locator('#start-game').click();await page.locator('#save-slot-1').click();await page.waitForFunction(()=>origins.app.scene==='map'&&!origins.app.sceneMotion.busy);
 await page.evaluate(()=>{window.openBook=origins.app.selectLevel(3);});await page.waitForFunction(()=>document.fonts.status==='loading');
 await page.keyboard.press('Escape');release();await page.evaluate(()=>window.openBook);assert.equal(await page.evaluate(()=>origins.app.modal),false,'Closing pending book must invalidate its callback');
 await page.unroute(/Sun.*\.(woff2|ttf)/);await page.evaluate(()=>{origins.app.progress.unlocked=3;origins.app.progress.stars={1:3,2:3,3:3};});
 for(const id of[1,2,3])for(const mode of['campaign','heroic','iron']){
  await page.evaluate(({id,mode})=>origins.app.selectLevel(id,mode),{id,mode});await settle();
  assert.equal(await page.locator('#dialog-title').textContent(),await page.evaluate(id=>origins.repo.catalog.levels.find(l=>l.id===id).title,id));
  const style=await page.locator('#dialog-title').evaluate(e=>({family:getComputedStyle(e).fontFamily,weight:getComputedStyle(e).fontWeight}));assert.match(style.family,/OriginsBook/);assert.equal(style.weight,'400');
  assert.equal(await page.locator('#difficulty').evaluate(e=>e.tagName),'BUTTON');assert.equal(await page.locator('select#difficulty').count(),0);
  const overflow=await page.locator('.native-level-copy').evaluate(e=>e.scrollHeight>e.clientHeight+1);assert.equal(overflow,false,`${id}/${mode} body overflow`);const clear=await page.evaluate(()=>{const p=document.querySelector('.native-source-history').getBoundingClientRect(),b=document.querySelector('#level-close').getBoundingClientRect();return p.top>=b.bottom-2;});assert.equal(clear,true,'Body must clear close button');
 }
 await page.evaluate(()=>origins.app.selectLevel(3));await settle();await page.screenshot({path:'artifacts/level-book-3-desktop.png'});
 for(let i=0;i<6;i++){
  const before=Number(await page.locator('#difficulty').getAttribute('data-difficulty'));await page.locator('#difficulty').click();const after=before%3+1;
  assert.equal(Number(await page.locator('#difficulty').getAttribute('data-difficulty')),after);assert.equal(await page.evaluate(()=>origins.app.progress.options.difficulty),after);
  await page.mouse.move(5,5);const image=page.locator('#difficulty img'),normal=await image.evaluate(i=>i.src);assert.match(normal,new RegExp(`000${after*2-1}\\.webp`));
  await page.locator('#difficulty').dispatchEvent('pointerdown');assert.match(await image.getAttribute('src'),new RegExp(`000${after*2}\\.webp`));await page.locator('#difficulty').dispatchEvent('pointercancel');assert.equal(await image.evaluate(i=>i.src),normal);
 }
 const difficulty=await page.evaluate(()=>origins.app.progress.options.difficulty);await page.reload();await page.waitForFunction(()=>window.origins);await page.locator('#start-game').click();await page.locator('#save-slot-1').click();await page.waitForFunction(()=>origins.app.scene==='map'&&!origins.app.sceneMotion.busy);await page.evaluate(()=>origins.app.selectLevel(3));assert.equal(Number(await page.locator('#difficulty').getAttribute('data-difficulty')),difficulty);
 // Compare deployment subset to the pinned original font, with unique family.
 const original=fs.readFileSync('web/assets/fonts/Sun Yun He Xuan Li Ti.ttf').toString('base64');const same=await page.evaluate(async data=>{const f=new FontFace('OriginalBookComparison',`url(data:font/ttf;base64,${data})`);await f.load();document.fonts.add(f);const c=document.createElement('canvas');c.width=500;c.height=100;const x=c.getContext('2d');function render(family){x.clearRect(0,0,500,100);x.font=`40px ${family}`;x.fillText('瀑布小径 战役 灰鸦港口',0,65);return{pixels:[...x.getImageData(0,0,500,100).data],width:x.measureText('瀑布小径 战役 灰鸦港口').width};}const a=render('OriginalBookComparison'),b=render('OriginsBook');return a.width===b.width&&a.pixels.every((v,i)=>v===b.pixels[i]);},original);assert.equal(same,true,'Subset must preserve source outlines and metrics');
 await page.setViewportSize({width:844,height:390});await page.evaluate(()=>origins.app.selectLevel(3));await settle();await page.screenshot({path:'artifacts/level-book-3-mobile.png'});assert.equal(await page.locator('.native-level-copy').evaluate(e=>e.scrollHeight>e.clientHeight+1),false);await page.locator('#level-close').click();await page.waitForFunction(()=>!origins.app.modal);assert.equal(await page.evaluate(()=>origins.app.modal),false);
 assert.deepEqual(errors,[]);console.log('Book title face/9 descriptions/lazy loading/cancel/difficulty cycle+pressed/reload/mobile/source pixels passed.');
}finally{release?.();await page.close();await browser.close();}
