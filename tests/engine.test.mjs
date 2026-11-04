import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {World,TOWERS} from '../web/engine.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../web/assets/data.json',import.meta.url)));
const run=(w,seconds)=>{for(let i=0;i<seconds*60;i++)w.step(1/60);};
test('original campaign: 9 holders, 320 gold, 6 waves and 100 enemies',()=>{
 const w=new World(data);assert.equal(w.slots.length,9);assert.equal(w.gold,320);assert.equal(data.waves.groups.length,6);
 assert.equal(data.waves.groups.reduce((n,g)=>n+g.waves.reduce((m,v)=>m+v.spawns.reduce((k,s)=>k+s.max,0),0),0),100);
});
test('gold accounting, no double build, selling, insufficient gold and max tower level',()=>{
 const w=new World(data);assert.ok(w.build(0,'artillery'));assert.equal(w.gold,195);assert.equal(w.build(0,'archer'),false);assert.ok(w.build(1,'mage'));assert.equal(w.build(2,'mage'),false);assert.ok(w.sell(0));assert.equal(w.gold,170);assert.equal(w.slots[0].type,null);assert.equal(w.sell(0),false);
});
test('wave routes, pauses, skill unlocks, invalid targets and cooldowns',()=>{
 const w=new World(data);assert.equal(w.cast('reinforce',{x:500,y:270}),false);w.startWave();run(w,8);assert.ok(w.enemies.length>0);assert.equal(w.wave,1);assert.equal(w.startWave(),false);const t=w.time;w.paused=true;run(w,5);assert.equal(w.time,t);w.paused=false;run(w,20);assert.ok(w.wave>=2);const p=w.nearestRoad({x:500,y:270});assert.equal(w.cast('reinforce',{x:500,y:700}),false);assert.ok(w.cast('reinforce',p));assert.equal(w.soldiers.length,2);assert.equal(w.cast('reinforce',p),false);assert.equal(w.cast('lightning',p),false);
});
test('undefended campaign loses and restart starts clean',()=>{
 const w=new World(data);w.startWave();run(w,300);assert.equal(w.status,'lost');assert.equal(w.lives,0);assert.equal(w.leaks,20);assert.equal(w.build(2,'archer'),false);const fresh=new World(data);assert.equal(fresh.lives,20);assert.equal(fresh.wave,0);assert.equal(fresh.enemies.length,0);
});
test('six waves finish with a winning playable strategy and no double death rewards',()=>{
 const w=new World(data);w.build(6,'artillery');w.build(2,'artillery');w.build(4,'archer');w.startWave();
 for(let i=0;i<500*60&&w.status==='playing';i++){
  for(const [id,type] of [[5,'artillery'],[7,'barrack'],[0,'archer'],[8,'archer'],[3,'mage'],[1,'archer']])if(!w.slots[id].type&&w.gold>=TOWERS[type].price){w.build(id,type);break;}
  if(i%60===0){const live=w.enemies.filter(e=>e.hp>0).sort((a,b)=>a.x-b.x);if(live.length){const p=live[0];w.cast('reinforce',p);w.cast('lightning',p);w.cast('arrows',p);if(w.hero)w.moveHero({x:270,y:370});}}
  w.step(1/60);
 }
 assert.equal(w.wave,6);assert.equal(w.status,'won');assert.ok(w.lives>0);assert.equal(w.kills+w.leaks,100);assert.equal(w.pending.length,0);assert.ok(w.hero);
 const gold=w.gold;const e={hp:1,gold:5,x:0,y:0};w.hurt(e,100);w.hurt(e,100);assert.equal(w.gold,gold+5);
});
