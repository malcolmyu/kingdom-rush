// Diagnostic recording: fixed targets and shortened death waits, not normal play.
import{chromium}from'playwright';import fs from'node:fs';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),page=await browser.newPage();
try{await page.goto('http://127.0.0.1:8765');await page.waitForFunction(()=>window.origins);await page.locator('#start-game').click();await page.locator('.save-slot').first().click();await page.locator('[data-level="1"]').click();await page.locator('#enter-level').click();await page.waitForFunction(()=>origins.app.scene==='battle');
let frame=0;
for(const pose of['walk-right','walk-left','ranged-right','ranged-left','melee','death','tombstone','respawn']){
 await page.evaluate(async pose=>{const{World}=await import('./domain.mjs'),{repo,app}=origins;const w=new World(await repo.level(1,'campaign'));w.addHero();app.world=w;app.modal=true;w.soldiers=[];w.spawn({key:'enemy_gnoll_reaver',road:0,lane:0});const e=w.enemies[0],route=w.routes[0][0];let n=0;for(let i=1;i<route.points.length;i++)if(Math.hypot(route.points[i].x-550,route.points[i].y-350)<Math.hypot(route.points[n].x-550,route.points[n].y-350))n=i;e.d=route.lengths[n];e.speed=0;const h=w.hero;Object.assign(e,route.points[n]);Object.assign(h,{x:e.x+(pose==='ranged-left'?120:-120),y:e.y,target:{x:e.x-120,y:e.y},anim:0});h.target={x:h.x,y:h.y};
 if(pose.startsWith('walk')){h.target.x=h.x+(pose==='walk-right'?90:-90);w.enemies=[];}
 if(pose==='melee'){const p=w.meleePosition({...h,rally:h.target},e);Object.assign(h,p);h.target={...p};}
 if(['death','tombstone','respawn'].includes(pose)){w.enemies=[];h.hp=0;if(pose!=='death'){h.dead=pose==='tombstone'?1.9:14.9;h.action='death';}}
 window.actorWorld=w;window.actorPose=pose;
 },pose);
 for(let i=0;i<30;i++){const result=await page.evaluate(()=>{const w=actorWorld,r=origins.renderer;w.step(1/30);r.draw(w);const p=r.screen(w.hero),c=document.createElement('canvas');c.width=640;c.height=360;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(r.canvas,p.x-160,p.y-130,320,180,0,0,640,360);ctx.fillStyle='#17281ce8';ctx.fillRect(0,0,640,30);ctx.font='16px sans-serif';ctx.fillStyle='#fff1cc';ctx.fillText(actorPose+' | controlled target | 30 fps',12,21);return{png:c.toDataURL().split(',')[1],missing:[...r.missing]};});if(result.missing.length)throw Error(JSON.stringify(result.missing));fs.writeFileSync(`artifacts/actor-motion-${String(frame++).padStart(4,'0')}.png`,Buffer.from(result.png,'base64'));}
}console.log('Recorded',frame,'actor frames.');
}finally{await browser.close();}
