import{test}from'node:test';import assert from'node:assert/strict';import{readFileSync}from'node:fs';import{World}from'../web/domain.mjs';import{ettinRegen,updateEttin,ettinHeld}from'../web/ettin.mjs';import{GroundCorpses}from'../web/ground-corpses.mjs';
const read=p=>JSON.parse(readFileSync('web/assets/'+p)),base=read('catalog.json'),exp=read('expansion/catalog.json'),aura=exp.templates.aura_ettin_regen;
function scene(difficulty=2){const d=read('expansion/04-campaign.json');Object.assign(d,{templates:{...base.templates,...exp.templates},animations:base.animations});const w=new World(d,{difficulty});w.hero.x=w.hero.y=-5000;w.hero.target={x:-5000,y:-5000};w.spawn({key:'enemy_ettin',road:0,lane:0});return{w,e:w.enemies[0]};}
test('ettin insertion draws original integer cooldown once, source lives by difficulty, and legacy spawn consumes no new RNG',()=>{
 for(const difficulty of[1,2,3,4]){const{w,e}=scene(difficulty);assert.ok(e.ettin.cooldown>=12&&e.ettin.cooldown<=22);assert.equal(e.lives,difficulty===4?4:2);assert.equal(e.ettin.ts,w.time);assert.equal(e.ettin.regenTs,w.time);const seed=w.seed;w.spawn({key:'enemy_gnoll_reaver',road:0,lane:0});assert.equal(w.seed,seed);assert.equal(w.enemies[1].ettin,undefined);assert.equal(w.enemies[1].lives,1);}
});
test('original regen pulse ignores recent damage/stun, clamps maxHP and processes once per simulation tick',()=>{
 const{w,e}=scene();w.hurt(e,20,1);const initial=e.hp,cd=aura.regen.cooldown;ettinRegen(e,cd-1e-9,aura);assert.equal(e.hp,initial);ettinRegen(e,cd,aura,{stunned:true});assert.equal(e.hp,initial+4);assert.equal(cd,5/30);ettinRegen(e,cd,aura);assert.equal(e.hp,initial+4);ettinRegen(e,100,aura);assert.equal(e.hp,initial+8);assert.equal(e.ettin.regenTs,cd*2);e.hp=e.maxHp-1;ettinRegen(e,100,aura);assert.equal(e.hp,e.maxHp);
});
test('APK regen resets due timestamp when frozen or mod-banned, honors target overrides, and never revives death/leak',()=>{
 for(const flags of[{frozen:true},{modBanned:true}]){const{e}=scene();e.hp=100;const cd=aura.regen.cooldown;ettinRegen(e,cd,aura,flags);assert.equal(e.hp,100);assert.equal(e.ettin.regenTs,cd);ettinRegen(e,cd*2,aura);assert.equal(e.hp,104);}
 const{e}=scene();e.regen={cooldown:.5,health:7};e.hp=100;ettinRegen(e,.5,aura);assert.equal(e.hp,107);e.hp=0;ettinRegen(e,2,aura);assert.equal(e.hp,0);e.hp=100;e.leaked=true;ettinRegen(e,2,aura);assert.equal(e.hp,100);
});
test('self-hit starts strictly after fixed cooldown, damages once nonlethally, loops for two seconds and resumes walking',()=>{
 const{w,e}=scene(),s=e.ettin,def=w.template(e.key).insane;w.time=s.cooldown;assert.equal(updateEttin(w,e),false);w.time+=1/30;assert.equal(updateEttin(w,e),true);assert.equal(e.action,'insaneStart');assert.equal(ettinHeld(e),true);const start=s.at,hp=e.hp,gold=w.gold,xp=w.heroXp;w.time=start+def.hit_time-1e-8;updateEttin(w,e);assert.equal(e.hp,hp);w.time=start+def.hit_time;updateEttin(w,e);assert.ok(hp-e.hp>=5&&hp-e.hp<=10);const after=e.hp,seed=w.seed;updateEttin(w,e);assert.equal(e.hp,after);assert.equal(w.seed,seed);w.time=start+34/30+1/30;updateEttin(w,e);assert.equal(e.action,'insaneLoop');assert.equal(s.phase,'loop');const loop=s.at;w.time=loop+2-1e-8;assert.equal(updateEttin(w,e),true);w.time=loop+2+1/30;assert.equal(updateEttin(w,e),false);assert.equal(ettinHeld(e),false);assert.equal(w.gold,gold);assert.equal(w.heroXp,xp);assert.equal(s.cooldown,Math.round(s.cooldown));
 const low=scene();low.w.time=low.e.ettin.cooldown+.1;updateEttin(low.w,low.e);low.e.hp=1;low.w.time=low.e.ettin.at+def.hit_time;updateEttin(low.w,low.e);assert.equal(low.e.hp,1);assert.equal(low.w.kills,0);
});
test('blockers/shield defer episodes, pre-hit stun aborts and death cancels damage without new random draws',()=>{
 const{w,e}=scene();w.time=e.ettin.cooldown+1;assert.equal(updateEttin(w,e,{blocked:true}),false);e.shielded=true;assert.equal(updateEttin(w,e),false);delete e.shielded;updateEttin(w,e);const seed=w.seed;e.stunned=true;updateEttin(w,e);assert.equal(e.ettin.phase,null);assert.equal(w.seed,seed);e.stunned=false;e.anim=0;w.time=e.ettin.ts+e.ettin.cooldown+1;updateEttin(w,e);e.hp=0;w.time+=2;updateEttin(w,e);assert.equal(w.seed,seed);assert.equal(e.hp,0);
});
test('World ticks hold position and melee during self-stun, pause clocks, leak original life cost and preserve two-second body',()=>{
 const{w,e}=scene();w.time=e.ettin.cooldown;e.d=10;w.step(1/60);assert.equal(e.ettin.phase,'start');const d=e.d,time=w.time;w.enemyMelee(e,w.hero,1);assert.equal(e.pendingMelee,undefined);w.paused=true;w.step(10);assert.equal(w.time,time);assert.equal(e.d,d);w.paused=false;w.step(1/60);assert.equal(e.d,d);
 const leak=scene(4);leak.e.d=leak.e.goal;leak.w.step(1/60);assert.equal(leak.e.leaked,true);assert.equal(leak.w.lives,16);assert.equal(Number.isFinite(leak.w.lives),true);
 const dead=scene(),cache=new GroundCorpses();dead.w.hurt(dead.e,10000,1);assert.equal(cache.update(dead.w).length,1);dead.w.time=1.3;dead.w.enemies=[];assert.equal(cache.update(dead.w).length,1);dead.w.time=2.001;assert.equal(cache.update(dead.w).length,0);
});

test('stun cancels an uncommitted ettin melee hit before damage processing',()=>{const{w,e}=scene(),target={hp:100,armor:0};e.pendingMelee={at:0,target,dodgeAt:0};e.stunned=true;const seed=w.seed;w.step(1/60);assert.equal(target.hp,100);assert.equal(e.pendingMelee,null);assert.equal(w.seed,seed);});
