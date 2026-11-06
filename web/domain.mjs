import{updateWildWards}from'./wild-ward.mjs';
import{buyWildPower,updateWildEldritch,wildEldritchBusy}from'./wild-eldritch.mjs';
import{updateWildMagus,updateWildBolt}from'./wild-magus.mjs';
import{initStage6Ending,updateStage6Ending,flushStage6Boss,stage6AssetsWaiting,stage6EndingBlocksVictory}from'./stage6-ending.mjs';
import{updateGnollAuras,syncGnollDamage,enemyMeleeFactor}from'./gnoll-aura.mjs';
import{insertGnollBoss,updateGnollBoss,startGnollMelee}from'./gnoll-boss.mjs';
import{initStage6Spawner,updateStage6Spawner}from'./stage6-spawner.mjs';
import{initFixedAlleria,updateFixedAlleria}from'./fixed-alleria.mjs';
import{cancelBladeDance}from'./blade-dance.mjs';
import{buyBladePower,bladeRejectDamage}from'./blade-parry.mjs';
import{tryBladeDodge}from'./blade-dodge.mjs';
import{initBladeSoldier,fillBladeBarrack,updateBladeBarracks,updateBladeSoldier}from'./blade.mjs';
import{updateAlleriaCats}from'./alleria-cat.mjs';
import{initAlleria,updateAlleria,updateAlleriaArrow,moveAlleria}from'./stage5-alleria.mjs';
import{initStage5Catapults,insertCatapult,updateStage5Catapults,updateCatapult,updateCatapultRock,catapultBusy}from'./stage5-catapult.mjs';
import{PLAYABLE_STAGE_COUNT}from'./campaign-release.mjs';
import{isEnemyStunned}from'./enemy-status.mjs';
import{updateArcaneSlumbers}from'./arcane-slumber.mjs';
import{updateArcaneBursts}from'./arcane-burst.mjs';
import{updateArcane,updateArcaneArrow,buyArcanePower}from'./arcane.mjs';
import{initStage4Burn,updateStage4Burn,stage4NodeAllowed}from'./stage4-burn.mjs';
import{initGryphons,updateGryphons,updateGryphonBolt,clickGryphon}from'./gryphon-events.mjs';
import{addGryphonGuards,updateGryphonGuards,updateGuardArrow}from'./gryphon-guards.mjs';
import{tryHarasserDodge,updateHarasserJump,harasserHidden}from'./harasser-jump.mjs';
import{insertHarasser,updateHarasser,updateHarasserMarks,updateHarasserArrow}from'./harasser.mjs';
import{launchEwokSpear,updateEwokSpear}from'./ewok-spear.mjs';
import{tryEwokDodge,updateEwokShield}from'./ewok-shield.mjs';
import{addEwokHuts,repairEwok,hireEwok,updateEwokHuts,ewokFormation,ewokRegen,deadEwok}from'./ewok-hut.mjs';
import{updateBlighterRanged,updateBlighterEnergy}from'./blighter-energy.mjs';
import{insertBlighter,updateBlighter,updateBlightedPlants}from'./blighter.mjs';
import {patchUpgradeTemplates} from './upgrades.mjs';
import WAVE_RULES from './wave-rules.mjs';
import {xpForLevel,levelForXp,xpMultiplier,heroSkills,normalizeHeroProgress,HERO_RULES} from './progression.mjs';
import {SpellTimeline,inEllipse} from './spells.mjs';
import{insertEttin,ettinRegen,ettinHeld,updateEttin}from'./ettin.mjs';
import{insertCarrier,placePayload,flushCarrierSpawns,updateCarrier,movePayload,carrierDamage,carrierDied,finishCarrierDeaths,carrierBusy}from'./carrier.mjs';
// Deterministic game rules. No DOM, Canvas, network or storage dependencies.
export const MODES={campaign:{name:'战役',lives:20},heroic:{name:'英雄挑战',lives:1},iron:{name:'钢铁挑战',lives:1}};
export const TYPES={archer:{name:'猎人之树',template:'archer',icon:'tower_preview_archer',description:'快速射击，能攻击地面与飞行敌人。'},barrack:{name:'精灵兵营',template:'barrack',icon:'tower_preview_barracks',description:'三名精灵战士拦截地面敌人，可调整集结点。'},mage:{name:'秘法师高台',template:'mage',icon:'tower_preview_mage',description:'魔法飞弹穿透物理护甲，能攻击飞行敌人。'},artillery:{name:'石环阵',template:'rock_thrower',icon:'tower_preview_artillery',description:'投掷巨石，对地面敌人造成范围伤害。'}};
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const list=x=>Array.isArray(x)?x:Object.values(x||{});
// Original systems.lua633–802 + klua.macros44–46. Wave zero is pre-battle.
export function towerRefund(spent,refundFactor,wave){return wave===0?spent:Math.floor(spent*refundFactor+.5);}
export const byDifficulty=(x,d=2)=>Array.isArray(x)?x[Math.min(d-1,x.length-1)]:x;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export function makeRoute(points,exits=[]){
 const lengths=[0];for(let i=1;i<points.length;i++)lengths.push(lengths.at(-1)+distance(points[i-1],points[i]));
 let goal=lengths.at(-1),nearest=Infinity;
 for(let i=Math.floor(points.length*.45);i<points.length;i++)for(const p of exits){const d=distance(p,points[i]);if(d<nearest){nearest=d;goal=lengths[i];}}
 return {points,lengths,length:lengths.at(-1),goal};
}
export function onRoute(route,d){
 let lo=1,hi=route.points.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(route.lengths[mid]<d)lo=mid+1;else hi=mid;}
 const a=route.points[lo-1],b=route.points[lo],t=clamp((d-route.lengths[lo-1])/(route.lengths[lo]-route.lengths[lo-1]||1),0,1);
 return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,dx:b.x-a.x,dy:b.y-a.y};
}
export class World{
 constructor(data,options={}){
  if(typeof options==='number')options={seed:options};
  this.data=data;this.templates=patchUpgradeTemplates(data.templates,options.upgrades,data.rules?.max_upgrade_level??Infinity);this.id=data.id;if(this.id>=4)this.harasserAspect=options.viewportAspect||4/3;this.mode=data.mode||'campaign';this.difficulty=options.difficulty||2;this.seed=options.seed??17;
  this.time=0;this.gold=data.waves.cash;this.lives=MODES[this.mode].lives;this.maxLives=this.lives;this.totalWaves=data.waves.groups.length;this.wave=0;
  this.status='ready';this.paused=false;this.enemies=[];this.soldiers=[];this.shots=[];this.effects=[];this.pending=[];this.events=[];this.serial=0;this.kills=0;this.leaks=0;this.spawned=0;
  this.cooldowns={reinforce:0,lightning:0,arrows:0};this.nextWaveAt=Infinity;this.nextWaveReadyAt=Infinity;this.hero=null;this.heroXp=options.heroXp??xpForLevel(options.heroLevel||1);this.heroXpQueued=0;this.heroLevel=levelForXp(this.heroXp);this.heroSkills=heroSkills(options.heroSkills);
  this.spells=new SpellTimeline(this,options.ultimateLevel??this.heroSkills.ultimate);
  this.exits=data.level.entities_list.filter(e=>e.template==='decal_defend_point').map(e=>e.pos);
  this.routes=data.paths.map(paths=>paths.map(p=>makeRoute(p,this.exits)));
  this.slots=data.level.entities_list.filter(e=>e.template.startsWith('tower_holder_')||/^tower_(archer|barrack|mage|rock_thrower)_[123]$/.test(e.template)).map((e,id)=>({id,x:e.pos.x,y:e.pos.y,rally:{...(e['barrack.rally_pos']||e['tower.default_rally_pos'])},holder:e['tower.holder_id'],terrain:e['tower.terrain_style']||1,type:null,level:0,key:null,spent:0,cd:0,anim:0,prebuilt:!e.template.startsWith('tower_holder_'),source:e}));
  for(const s of this.slots)if(s.prebuilt){s.key=s.source.template;s.type=Object.keys(TYPES).find(t=>s.key.startsWith('tower_'+TYPES[t].template+'_'));s.level=Number(s.key.at(-1));this.fillBarrack(s);}
  addEwokHuts(this);addGryphonGuards(this);initGryphons(this);initStage4Burn(this);initStage5Catapults(this);initAlleria(this);initFixedAlleria(this);initStage6Spawner(this);initStage6Ending(this);
  this.plants=data.level.entities_list.filter(e=>e.template==='plant_magic_blossom').map((e,i)=>({id:i,...e.pos,key:e.template,cd:0,anim:0}));
  if(!(this.id===1&&this.mode==='campaign'))this.addHero();data.stageRuntime?.init?.(this,options);
 }
 moveAlleria(p){return moveAlleria(this,p);}
 clickGryphon(p){if(!this.active(true))return false;return clickGryphon(this,p);}
 random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 number(a,b){return a+Math.floor(this.random()*(b-a+1));}
 emit(type,props={}){this.events.push({type,...props});}
 active(input=false){return ['ready','playing'].includes(this.status)&&!this.paused&&(!input||!this.stage6Ending?.guiHidden&&!stage6AssetsWaiting(this));}
 template(key){const t=this.templates[key];if(!t)throw new Error('Unknown original template: '+key);return t;}
 towerDef(type,level=1){const key=this.data.stageRuntime?.towerKey?.(type,level)||(type==='mage'&&level===4?'tower_wild_magus':type==='barrack'&&level===4?'tower_blade':type==='archer'&&level===4?'tower_arcane':'tower_'+TYPES[type].template+'_'+level),t=this.template(key),attack=t.attacks?.list?.[0],bullet=attack?.bullet?this.template(attack.bullet).bullet:null;
  return {key,type,level,price:t.tower.price,range:t.attacks?.range||t.barrack?.rally_range||145,rangeOffset:t.tower.range_offset||{x:0,y:0},cooldown:attack?.cooldown||1,damage:[bullet?.damage_min||0,bullet?.damage_max||0],bullet:attack?.bullet,damageFactor:t.tower.damage_factor??1,damageType:bullet?.damage_type||2,radius:bullet?.damage_radius||0,shootTime:attack?.shoot_time||0,offsets:attack?.bullet_start_offset?.x!==undefined?[attack.bullet_start_offset]:list(attack?.bullet_start_offset),count:type==='mage'?attack.loops||1:1,shotHeight:Math.max(28,...list(attack?.bullet_start_offset).map(p=>p?.y||0)),render:t.render.sprites};
 }
 allowed(type,level=1){const custom=this.data.stageRuntime?.allowed?.(this,type,level);if(custom!==undefined)return custom;if(type==='mage'&&level===4)return this.id===6&&!!this.templates.tower_wild_magus&&!(this.data.rules?.locked_towers||[]).includes('tower_wild_magus');if(type==='barrack'&&level===4)return this.id>=5&&!!this.templates.tower_blade&&!(this.data.rules?.locked_towers||[]).includes('tower_blade');if(type==='archer'&&level===4)return this.id>=4&&!!this.templates.tower_arcane&&!(this.data.rules?.locked_towers||[]).includes('tower_arcane');const locked=this.data.rules?.locked_towers||[];return !locked.includes('tower_build_'+TYPES[type].template)&&!locked.includes('tower_'+TYPES[type].template+'_'+level)&&level<=3;}
 upgradeTowerPower(id,name){if(!this.active(true))return false;const v=this.data.stageRuntime?.buyPower?.(this,this.slots[id],name);if(v!==undefined)return v;return this.slots[id]?.wild?buyWildPower(this,this.slots[id],name):this.slots[id]?.blade?buyBladePower(this,this.slots[id],name):buyArcanePower(this,this.slots[id],name);}
 repairEwok(id){return repairEwok(this,id);}
 hireEwok(id){return hireEwok(this,id);}
 build(id,type){const s=this.slots[id];if(!this.active(true)||!s||s.scriptLocked||s.ewok||s.type||!TYPES[type]||!this.allowed(type))return false;const d=this.towerDef(type);if(this.gold<d.price)return false;
  this.gold-=d.price;Object.assign(s,{type,level:1,key:d.key,spent:d.price,cd:.3,anim:0,buildAt:this.time,buildUntil:this.time+this.template('tower_build_'+TYPES[type].template).build_duration});this.fillBarrack(s);this.effect('build',s,.7);this.emit('build');if(type==='barrack')this.emit('barrack');return true;
 }
 upgrade(id,target){const s=this.slots[id];if(!this.active(true)||!s?.type||s.ewok||!this.allowed(s.type,s.level+1))return false;const d=this.towerDef(s.type,s.level+1);if(target&&target!==d.key)return false;if(this.gold<d.price)return false;
  this.gold-=d.price;s.level++;s.spent+=d.price;s.key=d.key;this.data.stageRuntime?.upgraded?.(this,s);if(d.key==='tower_wild_magus'){s.wild={last:this.time,hand:1,same:0,phase:null,face:'Down',flip:false};s.cd=0;}if(d.key==='tower_arcane'){s.arcane={last:this.time,phase:null,shooters:[{},{}]};s.cd=0;}const previous=this.soldiers.filter(v=>v.home===id);this.soldiers=this.soldiers.filter(v=>v.home!==id);this.fillBarrack(s,previous);this.effect('build',s,.7);this.emit('build');return true;
 }
 sell(id){const s=this.slots[id];if(!this.active(true)||!s?.type||s.ewok)return false;this.data.stageRuntime?.sold?.(this,s);this.gold+=towerRefund(s.spent,this.template(s.key).tower.refund_factor,this.wave);s.type=null;s.key=null;s.level=0;s.spent=0;delete s.arcane;delete s.blade;delete s.wild;for(const u of this.soldiers)if(u.home===id)cancelBladeDance(u);this.soldiers=this.soldiers.filter(v=>v.home!==id);this.effect('sell',s,.7);this.emit('coin');return true;}
 nearestRoad(p,groundOnly=true){let best=null,dist=Infinity;const used=new Set(this.data.waves.groups.flatMap(g=>g.waves.map(w=>w.path_index-1)));
  for(let r=0;r<this.routes.length;r++){if(!used.has(r))continue;for(const [i,q] of this.routes[r][0].points.entries()){if(!stage4NodeAllowed(this,r,i))continue;const d=distance(p,q);if(d<dist){best=q;dist=d;}}}return best;
 }
 setRally(id,p){const s=this.slots[id],q=this.nearestRoad(p);if(!this.active(true)||!s||!['barrack','ewok'].includes(s.type)||distance(p,q)>45||distance(s,q)>this.template(s.key).barrack.rally_range)return false;s.rally={x:q.x,y:q.y};if(s.ewok)ewokFormation(this,s);for(const v of this.soldiers.filter(v=>v.home===id)){if(!s.ewok)v.rally=this.formation(s,v.index);v.pendingHit=null;if(v.blade){if(v.blade.danceAttack)v.blade.rallyPending=true;v.blade.attack=null;v.anim=0;v.action='idle';}}this.effect('rally',q,1);this.emit('barrack');return true;}
 addHero(){const t=this.template('hero_elves_archer'),ls=t.hero.level_stats,i=this.heroLevel-1,p=this.data.level.custom_spawn_pos||this.exits[0]||{x:512,y:384};
  this.hero={id:++this.serial,key:'hero_elves_archer',x:p.x,y:p.y,target:{...p},hp:ls.hp_max[i],maxHp:ls.hp_max[i],armor:ls.armor[i],range:t.ranged.attacks[0].max_range,minRange:t.ranged.attacks[0].min_range,damage:[ls.ranged_damage_min[i],ls.ranged_damage_max[i]],meleeDamage:[ls.melee_damage_min[i],ls.melee_damage_max[i]],speed:t.motion.max_speed,cd:0,dead:0,anim:this.animationDuration('hero_elves_archer','levelup'),action:'levelup',actionAt:this.time,walkAt:this.time,stance:'bow',flip:false,lastHitAt:-Infinity,regenAt:this.time,walking:false,skillReadyAt:0};
 }
 formation(s,index){const t=this.template(s.key).barrack,angle=(t.rally_angle_offset||0)+Math.PI*2*index/t.max_soldiers-Math.PI/2;return{x:s.rally.x+Math.cos(angle)*t.rally_radius,y:s.rally.y+Math.sin(angle)*t.rally_radius*.7};}
 fillBarrack(s,previous=[]){if(s.type!=='barrack')return;if(s.key==='tower_blade'){fillBladeBarrack(this,s,previous);return;}const t=this.template(s.key);s.doorAt=Math.max(this.time,s.buildUntil||0);for(let i=0;i<t.barrack.max_soldiers;i++){const u=this.addSoldier(this.formation(s,i),i,s.id,t.barrack.soldier_type),old=previous[i];if(old){u.x=old.x;u.y=old.y;u.flip=old.flip;u.hp=u.maxHp*(Math.max(0,old.hp)/old.maxHp);u.dead=old.dead;u.departAt=this.time;}else this.departSoldier(u,s);}}
 departSoldier(u,s){const offset=this.template(s.key).barrack.respawn_offset;u.x=s.x+offset.x;u.y=s.y+offset.y;s.doorAt=Math.max(this.time,s.buildUntil||0);u.departAt=s.doorAt+this.animationDuration(s.key+'_door','open');u.walkAt=u.departAt;u.walking=true;}
 addSoldier(p,index,home=null,key='re_current_1'){if(!this.templates[key])key='soldier_barrack_1';const t=this.template(key),h=t.health,a=t.melee?.attacks?.[0]||{},r=p;
  const ranged=t.ranged?.attacks?.[0],bullet=ranged?this.template(ranged.bullet).bullet:null;
  const u={id:++this.serial,key,x:r.x,y:r.y,rally:r,hp:h.hp_max||50,maxHp:h.hp_max||50,armor:h.armor||0,speed:t.motion.max_speed,damage:[a.damage_min||1,a.damage_max||3],hitTime:a.hit_time||0,attackCd:a.cooldown||1,cd:0,rangedCd:0,ranged:ranged?{range:ranged.max_range,minRange:ranged.min_range||0,shootTime:ranged.shoot_time||0,cooldown:ranged.cooldown,bullet:ranged.bullet,damage:[bullet.damage_min,bullet.damage_max]}:null,dead:0,respawn:h.dead_lifetime||14,index,home,spawnAt:this.time,expires:home===null?this.time+t.reinforcement.duration:Infinity,anim:0,actionAt:this.time,walkAt:this.time,lastHitAt:-Infinity,regen:t.regen,walking:false,flip:false,departAt:this.time};if(home===null)u.departAt=this.time+1/3;initBladeSoldier(this,u);this.soldiers.push(u);return u;
 }
 startWave(){if(!this.active(true)||this.wave>=this.totalWaves||this.wave&&this.time<this.nextWaveReadyAt)return false;
  if(this.wave&&Number.isFinite(this.nextWaveAt)){const seconds=Math.max(0,Math.floor(this.nextWaveAt-this.time+.5)),bonus=Math.ceil(seconds*WAVE_RULES.early_wave_reward_per_second);this.gold+=bonus;if(bonus)this.emit('bonus',{amount:bonus});if(seconds>1)for(const type of ['lightning','reinforce','arrows'])if(this.unlocked(type)&&this.cooldowns[type]>0){this.cooldowns[type]=Math.max(0,this.cooldowns[type]-seconds);this.emit('cooldown_bonus',{power:type,seconds});}}
  const group=this.data.waves.groups[this.wave++];this.status='playing';
  let end=this.time;for(const w of group.waves){let t=this.time+(w.delay||0)/30;for(const s of w.spawns){const interval=s.interval||0,next=s.interval_next||0;for(let i=0;i<s.max;i++)this.pending.push({at:t+i*interval/30,key:s.creep,road:w.path_index-1,lane:s.fixed_sub_path?clamp(s.path-1,0,2):Math.floor(this.random()*3)});t+=Math.max(0,s.max-1)*interval/30+next/30;}end=Math.max(end,t);}
  this.pending.sort((a,b)=>a.at-b.at);this.nextWaveReadyAt=end;this.nextWaveAt=end+(this.data.waves.groups[this.wave]?.interval||0)/30;if(this.id===1&&this.mode==='campaign'&&this.wave===5)this.addHero();this.emit('wave',{wave:this.wave});return true;
 }
 spawn(p){const t=this.template(p.key),h=t.health,route=this.routes[p.road]?.[p.lane];if(!route)throw new Error(`Missing route ${p.road}/${p.lane}`);
  const maxHp=byDifficulty(h.hp_max,this.difficulty);const a=t.melee?.attacks?.[0],r=t.ranged?.attacks?.[0];this.enemies.push({id:++this.serial,key:p.key,hp:maxHp,maxHp,armor:byDifficulty(h.armor,this.difficulty)||0,magicArmor:byDifficulty(h.magic_armor,this.difficulty)||0,gold:t.enemy.gold,lives:byDifficulty(t.enemy.lives_cost,this.difficulty)||1,speed:byDifficulty(t.motion.max_speed,this.difficulty),flying:!!(t.vis?.flags&128),d:0,road:p.road,lane:p.lane,cd:0,flash:0,blocked:false,anim:0,deadAt:0,damage:[byDifficulty(a?.damage_min,this.difficulty)||0,byDifficulty(a?.damage_max,this.difficulty)||0],attackCd:a?.cooldown||1,hitTime:a?.hit_time||0,ranged:r?{range:r.max_range,minRange:r.min_range,cooldown:r.cooldown,shootTime:r.shoot_time,bullet:r.bullet,offset:r.bullet_start_offset[0]}:null,rangedCd:0,goal:route.goal,...onRoute(route,0)});const e=this.enemies.at(-1);insertGnollBoss(this,e);insertCatapult(this,e,p.catapult);insertHarasser(this,e);insertBlighter(this,e);insertEttin(this,e);insertCarrier(this,e);placePayload(this,e,p.payload);this.spawned++;this.emit('enemy_spawn',{key:p.key});this.data.stageRuntime?.spawn?.(this,e);return e;
 }
 unlocked(type){if(this.id===1&&this.mode==='campaign')return this.wave>=({reinforce:2,lightning:3,arrows:5,hero:5}[type]||99);
  if(type==='arrows'&&(this.data.rules?.locked_powers?.['3']||Array.isArray(this.data.rules?.locked_powers)&&this.data.rules.locked_powers[2]))return false;return type==='hero'?!!this.hero:true;
 }
 cast(type,p){if(!this.active(true)||this.status!=='playing'||!this.unlocked(type)||!(type in this.cooldowns)||this.cooldowns[type]>0)return false;const q=this.nearestRoad(p);if(!q||distance(p,q)>55)return false;
  if(type==='reinforce'){for(let i=0;i<2;i++){const direction=i===0?1:-1;this.addSoldier({x:q.x+10*direction,y:q.y-10*direction},i,null,'re_current_'+this.number(1,3));}this.cooldowns.reinforce=this.template('re_current_1').cooldown;}
  else if(type==='lightning')this.spells.castLightning(q);else this.spells.castArrows(q);
  this.emit('cast');return true;
 }
 activatePlant(id){const special=this.data.stageRuntime?.activatePlant?.(this,id);if(special!==undefined)return special;const p=this.plants[id];if(!this.active(true)||!p||p.blocked||p.cd>0)return false;const t=this.template(p.key),a=t.custom_attack,targets=this.enemies.filter(e=>e.hp>0&&!harasserHidden(e)&&distance(e,p)<a.range);if(!targets.length)return false;
  for(let i=0;i<a.bullet_count;i++)this.projectile(p,targets[i%targets.length],{type:'mage',damage:byDifficulty(this.template(a.bullet).bullet.damage_min)||20,damageType:4,bullet:a.bullet,height:55,delay:i*.1});p.cd=a.cooldown;p.anim=1;this.emit('cast');return true;
 }
 moveHero(p){if(!this.active(true)||!this.hero||this.hero.hp<=0)return false;const q=this.nearestRoad(p);if(!q||distance(p,q)>70)return false;this.hero.target={x:q.x,y:q.y};this.hero.pendingHit=null;if(this.hero.volley?.fired)this.hero.volleyReadyAt=this.time+this.template(this.hero.key).ranged.attacks[1].cooldown;this.hero.volley=null;this.hero.counterPending=false;this.hero.playerMove=true;this.hero.combatTarget=null;this.hero.anim=0;this.hero.action=null;return true;}
 effect(type,p,life,text){this.effects.push({type,x:p.x,y:p.y,life,total:life,text});}
 hurt(e,damage,type=2,xpFactor=0){if(e.hp<=0||e.catapult&&e.removed||this.data.stageRuntime?.canHurt?.(this,e)===false)return;carrierDamage(this,e,type);const armor=type&4?e.magicArmor:type&8?e.armor*.5:type&2?e.armor:0;const applied=Math.max(1,Math.round(damage*(1-(armor||0))));e.hp-=applied;e.flash=.1;if(xpFactor>0)this.heroXpQueued+=applied*xpFactor;
  if(e.hp<=0)this.finishEnemyDeath(e);
 }
 finishEnemyDeath(e){e.deadAt=this.time;e.deathFlip=e.anim>0?e.actionFlip:e.dx<0;this.kills++;this.gold+=e.gold;this.effect('coin',{x:e.x,y:e.y+20},.8,'+'+e.gold);this.emit('coin');carrierDied(this,e);
 }
 projectile(s,e,o){const height=o.height||40;this.shots.push({id:++this.serial,type:o.type,bullet:o.bullet,xpFactor:o.xpFactor||0,sx:s.x+(o.offsetX||0),sy:s.y+height,x:s.x+(o.offsetX||0),y:s.y+height,tx:e.x,ty:e.y+12,target:e,damage:o.damage,damageType:o.damageType||2,radius:o.radius||0,elapsed:-(o.delay||0),duration:o.duration??(o.type==='artillery'?.8:.35)});if(!o.preserveAnimation)s.anim=.6;if(!o.preserveAnimation)s.facing=e.y>s.y?'Up':'Down';}
 updateTowers(dt,live){for(const s of this.slots){if(this.data.stageRuntime?.tower?.(this,s,live,dt))continue;if(s.wild){updateWildMagus(this,s,live);continue;}if(s.arcane){updateArcane(this,s,live);continue;}s.cd-=dt;s.anim=Math.max(0,s.anim-dt);if(s.type==='artillery'&&s.reloadUntil===undefined){s.reloadAt=s.buildUntil||0;s.reloadUntil=s.reloadAt+this.animationDuration(this.template(s.key).render.sprites.at(-1).prefix,'loadDown');}if(s.type==='artillery'&&this.time<s.reloadUntil)continue;if(!s.type||this.time<s.buildUntil||(s.type==='barrack'||s.ewok)||s.cd>0)continue;const d=this.towerDef(s.type,s.level),targets=live.filter(e=>e.hp>0&&!harasserHidden(e)&&(s.type!=='artillery'||!e.flying)&&inEllipse({x:s.x+d.rangeOffset.x,y:s.y+d.rangeOffset.y},e,d.range)).sort((a,b)=>(a.goal-a.d)-(b.goal-b.d));if(!targets.length)continue;const e=targets[0];
   s.actionAt=this.time;s.facing=e.y>s.y+d.shotHeight?'Up':'Down';s.flip=e.x<s.x;s.shotCount=(s.shotCount||0)+1;s.shooterIndex=s.shotCount%d.offsets.length;
   const shooter=d.render.find(v=>v.angles?.shoot),name=shooter?.angles?.shoot?.[s.facing==='Up'?0:1];s.anim=this.animationDuration(shooter?.prefix||s.key,name||'shoot');
   for(let i=0;i<d.count;i++){const offset=d.offsets[s.type==='archer'?s.shooterIndex:i%d.offsets.length]||{x:0,y:d.shotHeight};this.projectile(s,e,{type:s.type,damage:Math.ceil(this.number(d.damage[0],d.damage[1])*d.damageFactor),damageType:d.damageType,bullet:d.bullet,radius:d.radius,height:offset.y,offsetX:offset.x,delay:d.shootTime,preserveAnimation:true});}s.cd=d.cooldown;
   if(s.type==='artillery'){s.reloadAt=this.time+s.anim;s.reloadUntil=s.reloadAt+this.animationDuration(shooter.prefix,'loadDown');}
  }
 }
 meleePosition(s,e,index=0){const enemy=this.template(e.key).enemy.melee_slot||{x:18,y:0},offset=this.template(s.key).soldier?.melee_slot_offset||{x:5,y:0},side=e.dx===undefined?(s.rally.x>=e.x?1:-1):e.dx>=0?1:-1;return{x:e.x+(enemy.x+offset.x+(index%3? -3:0))*side,y:e.y+enemy.y+offset.y+(index%3===1?-6:index%3===2?6:0)};}
 updateSoldiers(dt,live){const blockers=new Set(),engaged=new Map(),enemyTurns=new Set();for(const s of this.soldiers){if(s.blade){if(s.hp>0&&this.data.stageRuntime?.defender?.(this,s,dt))continue;updateBladeSoldier(this,s,live,dt,{blockers,engaged,enemyTurns});continue;}if(deadEwok(this,s,dt))continue;if(s.home===null&&(this.time>s.expires||s.hp<=0)){if(s.fadeOutAt===undefined){s.fadeOutAt=this.time;s.fadeOutX=s.x;s.walkAt=this.time;s.pendingHit=null;s.hp=0;s.walking=true;}const moved=Math.min(50,(this.time-s.fadeOutAt)*s.speed);s.x=s.fadeOutX+(s.flip?-moved:moved);if(moved>=50)s.expired=true;continue;}if(s.hp<=0){s.pendingHit=null;s.dead+=dt;if(s.home!==null&&s.dead>s.respawn){s.hp=s.maxHp;s.dead=0;this.departSoldier(s,this.slots[s.home]);}continue;}if(this.time<s.departAt)continue;if(this.data.stageRuntime?.defender?.(this,s,dt))continue;if(updateEwokShield(this,s,dt)){const e=live.find(e=>e.id===s.targetId&&e.hp>0&&!e.flying);if(e&&distance(s,this.meleePosition(s,e,s.targetSlot))<4){blockers.add(e.id);engaged.set(e.id,(engaged.get(e.id)||0)+1);if(!enemyTurns.has(e.id)){enemyTurns.add(e.id);this.enemyMelee(e,s,dt);}}continue;}
   s.cd-=dt;s.rangedCd-=dt;s.anim=Math.max(0,s.anim-dt);if(s.anim<=0)s.shooting=false;
   if(s.pendingHit&&this.time>=s.pendingHit.at){const hit=s.pendingHit;s.pendingHit=null;if(hit.ranged&&s.ewok){launchEwokSpear(this,s,hit);}else if(hit.target.hp>0){if(hit.ranged)this.projectile(s,hit.target,{type:'archer',damage:this.number(...s.ranged.damage),damageType:2,bullet:s.ranged.bullet,height:10,duration:s.ewok?this.template(s.ranged.bullet).bullet.flight_time:undefined,preserveAnimation:true});else if(distance(s,this.meleePosition(s,hit.target,hit.slot))<4&&!tryHarasserDodge(this,hit.target,{damageType:this.template(s.key).melee.attacks[0].damage_type})){this.hurt(hit.target,this.number(...s.damage),2);this.emit('melee');}}}
   const candidates=live.filter(e=>e.hp>0&&!harasserHidden(e)&&!e.flying&&!this.hyenaFleeing(e)&&(engaged.get(e.id)||0)<3&&inEllipse(s.rally,e,this.template(s.key).melee?.range||60));const e=candidates.find(e=>e.id===s.targetId)||candidates.sort((a,b)=>distance(s,a)-distance(s,b))[0];
   let target=s.rally;if(e){s.targetId=e.id;s.targetSlot=engaged.get(e.id)||0;engaged.set(e.id,s.targetSlot+1);blockers.add(e.id);target=this.meleePosition(s,e,s.targetSlot);}else{s.targetId=null;}
   const d=distance(s,target);if(d>2){if(!s.walking)s.walkAt=this.time;s.walking=true;s.flip=target.x<s.x;s.x+=(target.x-s.x)/d*Math.min(d,s.speed*dt);s.y+=(target.y-s.y)/d*Math.min(d,s.speed*dt);}
   else{s.walking=false;if(e){s.flip=e.x<s.x;if(s.cd<=0){s.cd=s.attackCd;s.anim=this.animationDuration(s.key,'attack');s.actionAt=this.time;s.shooting=false;s.pendingHit={at:this.time+s.hitTime,target:e,slot:s.targetSlot};}if(!enemyTurns.has(e.id)){enemyTurns.add(e.id);this.enemyMelee(e,s,dt);}}
    else{if(s.ewok)ewokRegen(this,s,dt);if(s.regen&&this.time-s.lastHitAt>s.regen.last_hit_standoff_time)s.hp=Math.min(s.maxHp,s.hp+s.regen.health/s.regen.cooldown*dt);if(s.ranged&&s.rangedCd<=0&&!s.pendingHit){const target=live.find(e=>e.hp>0&&!harasserHidden(e)&&inEllipse(s,e,s.ranged.range)&&!inEllipse(s,e,s.ranged.minRange||.01));if(target){s.rangedCd=s.ranged.cooldown;s.shooting=true;s.flip=target.x<s.x;s.anim=this.animationDuration(s.key,s.ewok?'shoot':'ranged_attack');s.actionAt=this.time;s.pendingHit={at:this.time+s.ranged.shootTime,target,ranged:true,...(s.ewok?{origin:{x:target.x,y:target.y}}:{})};}}}}
  }this.soldiers=this.soldiers.filter(s=>!s.expired);return blockers;
 }
 animationDuration(key,state){const a=this.data.animations?.[key+'_'+state]||(/^re_current_|^soldier_re_/.test(key)?this.data.animations?.[this.templates[key]?.render?.sprites?.[0]?.prefix+'_'+state]:null);return a?(a.frames?.length||a.ranges?.reduce((n,[f,t])=>n+t-f+1,0)||(a.to-a.from+1))/30:.6;}
 flushHeroXp(){if(!this.heroXpQueued||!this.hero||this.hero.hp<=0)return false;this.heroXp+=Math.floor(this.heroXpQueued*xpMultiplier(this.heroLevel,this.id,this.difficulty)+.5);this.heroXpQueued=0;const next=this.heroLevel<10&&this.heroXp>=HERO_RULES.hero_xp_thresholds[this.heroLevel-1];if(next){this.heroLevel++;const h=this.hero,stats=this.template(h.key).hero.level_stats,i=this.heroLevel-1;h.maxHp=stats.hp_max[i];h.hp=h.maxHp;h.armor=stats.armor[i];h.damage=[stats.ranged_damage_min[i],stats.ranged_damage_max[i]];h.meleeDamage=[stats.melee_damage_min[i],stats.melee_damage_max[i]];this.heroAction(h,'levelup');this.emit('hero_levelup',{level:this.heroLevel});}this.emit('hero_xp',{xp:this.heroXp,level:this.heroLevel});return !!next;}
 hurtDefender(s,damage,type=2,physicalMask=false){if(s.catCompanion||s.fixedAlly&&this.template(s.key).health.ignore_damage||bladeRejectDamage(this,s,type)||s.hp<=0||this.stageHeroes?.includes(s)&&['intro','respawn'].includes(s.phase))return;s.hp-=Math.max(1,Math.floor(damage*((physicalMask?!!(type&2):type===2)?1-s.armor:1)+.5));s.lastHitAt=this.time;}
 launchTorch(e,hit){if(e.hp<=0||hit.target.hp<=0)return;const r=e.ranged,b=this.template(r.bullet).bullet,unit=this.template(hit.target.key).unit,offset=unit?.hit_offset||{x:0,y:12};this.shots.push({id:++this.serial,type:'torch',bullet:r.bullet,sx:e.x+r.offset.x,sy:e.y+r.offset.y,x:e.x+r.offset.x,y:e.y+r.offset.y,tx:hit.target.x+offset.x,ty:hit.target.y+offset.y,target:hit.target,offset,elapsed:0,duration:b.flight_time,damage:this.number(b.damage_min,b.damage_max),damageType:b.damage_type,g:b.g,rotationSpeed:b.rotation_speed,hitDistance:b.hit_distance});this.emit('arrow');}
 updateBurns(dt){for(const s of [...this.soldiers,...(this.stageHeroes||[]),this.hero].filter(Boolean)){const burn=s.burn;if(!burn)continue;if(s.hp<=0||this.time+1e-9>=burn.until){s.burn=null;continue;}while(this.time+1e-9>=burn.next&&burn.next<burn.until-1e-9){this.hurtDefender(s,burn.damage,1);burn.next+=burn.every;}}}
 enemyAction(e,target,action){e.action=action;e.actionAt=this.time;e.actionFlip=target.x<e.x;const prefix=this.template(e.key).render.sprites[0].prefix;e.anim=this.animationDuration(prefix,action);}
 enemyMelee(e,target,dt){if(e.gnollBoss){startGnollMelee(this,e,target);return;}if(e.catapult||isEnemyStunned(e)||this.data.stageRuntime?.holdsMelee?.(e))return;if(e.harasser?.phase||e.blighter?.phase||e.blighter?.energyAttack||ettinHeld(e)||this.template(e.key).coward_duration)return;if(e.meleeTick===this.time)return;e.meleeTick=this.time;e.cd-=dt;if(e.cd<=0){const attack=this.template(e.key).melee.attacks[0];e.pendingMelee={at:this.time+e.hitTime,target,dodgeAt:this.time+(target.ewok?e.hitTime:(attack.dodge_time??e.hitTime))};e.cd=e.attackCd;this.enemyAction(e,target,'attack');this.data.stageRuntime?.meleeStarted?.(this,e);}}
 heroAction(h,action){h.action=action;h.actionAt=this.time;const name=this.template(h.key).render.sprites[0].angles?.[action]?.[0]||action;h.anim=this.animationDuration(h.key,name);}
 heroArrowBonus(h,target){h.porcupineStacks=h.porcupineTarget===target.id?Math.min(3,(h.porcupineStacks||0)+1):0;h.porcupineTarget=target.id;const rank=this.heroSkills.porcupine;return rank?this.template(h.key).hero.skills.porcupine.damage_inc[rank-1]*h.porcupineStacks:0;}
 volleyTarget(h,live,exclude){return live.filter(e=>e.hp>0&&!harasserHidden(e)&&e.id!==exclude&&inEllipse(h,e,215)&&!inEllipse(h,e,60)).sort((a,b)=>Number(b.flying)-Number(a.flying)||(a.goal-a.d)-(b.goal-b.d))[0];}
 updateVolley(h,live){const v=h.volley,template=this.template(h.key),attack=template.ranged.attacks[1];if(h.anim>0)return true;if(v.ending){h.volley=null;h.volleyReadyAt=this.time+attack.cooldown;h.cd=template.ranged.attacks[0].cooldown;return false;}
  let target=v.target;if(!target||target.hp<=0||v.onTarget>=v.predicted){target=this.volleyTarget(h,live,target?.id);v.onTarget=0;v.target=target;if(target){const bonus=this.heroSkills.porcupine?(this.heroSkills.porcupine*Math.min(3,(h.porcupineTarget===target.id?h.porcupineStacks+1:0))):0;v.predicted=Math.ceil(target.hp/Math.max(1,Math.floor(((h.damage[0]+h.damage[1])/2+bonus)*(1-target.armor)+.5)));}}
  if(v.remaining<=0||!target){v.ending=true;this.heroAction(h,'shoot_end');return true;}
  h.flip=target.x<h.x;this.heroAction(h,'shoot_loop');h.pendingHit={at:this.time+attack.shoot_times[0],target,ranged:true,volley:true,porcupineBonus:this.heroArrowBonus(h,target)};v.remaining--;v.onTarget++;return true;
 }
 tryHeroDodge(e,hit){const h=this.hero,rank=this.heroSkills.nimble_fencer;if(hit.target!==h||!rank||h.hp<=0||h.spiderWebCount>0||this.random()>this.template(h.key).hero.skills.nimble_fencer.chance[rank-1])return false;hit.dodged=true;h.pendingHit=null;h.volley=null;h.anim=0;h.counterPending=true;h.combatTarget=e.id;this.emit('dodge');return true;}
 updateHero(dt,live,blockers){const h=this.hero;if(!h)return;const template=this.template(h.key),ranged=template.ranged.attacks[0],melee=template.melee.attacks[0];h.cd-=dt;h.anim=Math.max(0,h.anim-dt);
  if(h.hp<=0){if(!h.dead){h.pendingHit=null;h.volley=null;h.counterPending=false;h.combatTarget=null;h.walking=false;this.heroAction(h,'death');}h.dead+=dt;if(h.dead>=template.health.dead_lifetime){h.hp=h.maxHp;h.dead=0;h.stance='bow';this.heroAction(h,'respawn');}return;}
  if(this.data.stageRuntime?.defender?.(this,h,dt))return;
  if(h.pendingHit&&this.time+1e-9>=h.pendingHit.at){const hit=h.pendingHit;h.pendingHit=null;if(hit.target.hp>0){if(hit.ranged){const offset=ranged.bullet_start_offset[0];this.projectile(h,hit.target,{type:'hero',damage:this.number(...h.damage)+(hit.porcupineBonus||0),damageType:2,bullet:ranged.bullet,height:offset.y,offsetX:offset.x*(h.flip?-1:1),duration:this.template(ranged.bullet).bullet.flight_time,xpFactor:this.template(ranged.bullet).bullet.xp_gain_factor,preserveAnimation:true});if(hit.volley){h.volley.fired=true;this.heroXpQueued+=template.hero.skills.multishot.xp_gain_factor*this.heroSkills.multishot;}}else if(inEllipse(h,hit.target,35)&&!tryHarasserDodge(this,hit.target,{damageType:hit.damageType??melee.damage_type})){this.hurt(hit.target,this.number(...(hit.damage||h.meleeDamage)),melee.damage_type,hit.skill?0:melee.xp_gain_factor);this.emit('melee');}}}
  const move=target=>{const d=distance(h,target);if(d<=2){h.walking=false;return false;}if(!h.walking)h.walkAt=this.time;h.walking=true;h.flip=target.x<h.x;h.x+=(target.x-h.x)/d*Math.min(d,h.speed*dt);h.y+=(target.y-h.y)/d*Math.min(d,h.speed*dt);return true;};
  const engaged=live.find(e=>e.id===h.combatTarget&&e.hp>0&&!this.hyenaFleeing(e));if(engaged&&!h.walking&&inEllipse(h,engaged,35)){blockers.add(engaged.id);this.enemyMelee(engaged,h,dt);}
  if(h.anim>0){h.walking=false;return;}
  if(h.volley&&this.updateVolley(h,live))return;
  if(h.playerMove){if(distance(h,h.target)>3){move(h.target);return;}h.playerMove=false;}
  if(this.flushHeroXp())return;
  // A player rally order takes priority over combat; pending attacks are cancelled by moveHero.
  if(!h.combatTarget&&distance(h,h.target)>3){move(h.target);return;}
  const close=live.filter(e=>e.hp>0&&!harasserHidden(e)&&!e.flying&&!this.hyenaFleeing(e)&&inEllipse(h.target,e,template.melee.range)).sort((a,b)=>distance(h,a)-distance(h,b))[0];
  if(close){h.combatTarget=close.id;const slot=this.meleePosition({...h,rally:h.target},close,0);if(move(slot))return;blockers.add(close.id);h.flip=close.x<h.x;this.enemyMelee(close,h,dt);
   if(h.stance!=='sword'){h.stance='sword';this.heroAction(h,'bow2sword');return;}
   if(h.counterPending){h.counterPending=false;const a=template.dodge.counter_attack;this.heroAction(h,a.animation);h.pendingHit={at:this.time+a.hit_time,target:close,skill:true,damage:[a.damage_min,a.damage_max],...(close.harasser?{damageType:a.damage_type}:{})};this.emit('nimble');return;}
   if(h.cd<=0){const level=this.heroSkills.double_strike,skill=level>0&&this.time>=(h.skillReadyAt||0),attack=skill?template.melee.attacks[1]:melee;h.cd=template.melee.cooldown;this.heroAction(h,attack.animation);h.pendingHit={at:this.time+attack.hit_time,target:close,ranged:false,skill,...(close.harasser?{damageType:attack.damage_type}:{})};if(skill){this.emit('double_strike');const values=template.hero.skills.double_strike;h.skillReadyAt=this.time+attack.cooldown;h.pendingHit.damage=[values.damage_min[level-1],values.damage_max[level-1]];this.heroXpQueued+=values.xp_gain_factor*level;}}return;
  }
  h.combatTarget=null;h.walking=false;
  if(h.stance!=='bow'){h.stance='bow';this.heroAction(h,'sword2bow');return;}
  const volleyTarget=this.heroSkills.multishot&&this.time>=(h.volleyReadyAt||0)?this.volleyTarget(h,live):null;if(volleyTarget&&h.cd<=0){h.flip=volleyTarget.x<h.x;h.volley={remaining:template.hero.skills.multishot.loops[this.heroSkills.multishot-1],onTarget:0,predicted:0,target:null};this.heroAction(h,'shoot_start');return;}
  const target=live.filter(e=>e.hp>0&&!harasserHidden(e)&&inEllipse(h,e,h.range)&&!inEllipse(h,e,h.minRange)).sort((a,b)=>distance(h,a)-distance(h,b))[0];
  if(target&&h.cd<=0){h.flip=target.x<h.x;h.cd=ranged.cooldown;this.heroAction(h,'ranged');h.pendingHit={at:this.time+ranged.shoot_time,target,ranged:true,porcupineBonus:this.heroArrowBonus(h,target)};return;}
  if(!target&&distance(h,h.target)>3){move(h.target);return;}
  if(!target&&this.time-h.lastHitAt>template.regen.last_hit_standoff_time&&this.time-h.regenAt>=template.regen.cooldown){h.hp=Math.min(h.maxHp,h.hp+template.hero.level_stats.regen_health[this.heroLevel-1]);h.regenAt=this.time;}
 }
 hyenaFleeing(e){return e.cowardUntil!==undefined&&this.time<=e.cowardUntil;}
 updateHyena(e,blockers){
  const t=this.template(e.key);if(!t.coward_duration)return;
  if(e.cowardUntil!==undefined&&this.time>e.cowardUntil){e.cowardUntil=undefined;e.speed/=t.coward_speed_factor;e.walkAt=this.time;}
  if(!this.hyenaFleeing(e)&&blockers.has(e.id)){
   e.cowardUntil=this.time+t.coward_duration;e.speed*=t.coward_speed_factor;e.walkAt=this.time;
   e.pendingMelee=null;e.anim=0;
   for(const s of this.soldiers)if(s.targetId===e.id){s.targetId=null;if(s.pendingHit?.target===e&&!s.pendingHit.ranged)s.pendingHit=null;}
   if(this.hero?.combatTarget===e.id){this.hero.combatTarget=null;if(this.hero.pendingHit?.target===e&&!this.hero.pendingHit.ranged)this.hero.pendingHit=null;}
  }
  if(this.hyenaFleeing(e))blockers.delete(e.id);
 }
 updateGnawerAuras(live){
  for(const e of this.enemies){
   if(e.gnawerBuff&&(e.hp<=0||this.time>=e.gnawerBuff.until))e.gnawerBuff=null;
   if(e.hp<=0||e.leaked)continue;
   const entry=this.template(e.key).auras?.list?.find(a=>a.name==='aura_gnoll_gnawer');
   if(!entry)continue;
   const aura=this.template(entry.name),a=aura.aura;
   if(this.time-(e.gnawerAuraAt||0)+1e-9<a.cycle_time)continue;
   e.gnawerAuraAt=this.time;
   const neighbors=live.filter(other=>{
    const vis=this.template(other.key).vis||{};
    return !other.leaked&&other.hp>0&&!(vis.flags&a.vis_bans)&&!(vis.bans&a.vis_flags)&&inEllipse(e,other,a.radius);
   });
   if(neighbors.length>=aura.min_count){
    const mod=this.template(a.mod);
    // resets_same refreshes modifier time, not the existing sprite animation.
    if(!e.gnawerBuff)e.gnawerBuff={at:this.time,factor:mod.inflicted_damage_factor};
    e.gnawerBuff.until=this.time+mod.modifier.duration;
   }
  }
 }
 step(dt){if(!this.active()||stage6AssetsWaiting(this))return;const motionOrigins=this.id>=4?new Map(this.enemies.map(e=>[e,{x:e.x,y:e.y}])):null;this.time+=dt;this.data.stageRuntime?.step?.(this,dt);for(const s of this.slots)if(s.type==='barrack'&&s.doorAt<=this.time&&s.doorPlayedAt!==s.doorAt){s.doorPlayedAt=s.doorAt;this.emit('door');}for(const k in this.cooldowns)this.cooldowns[k]=Math.max(0,this.cooldowns[k]-dt);for(const p of this.plants){p.cd=Math.max(0,p.cd-dt);p.anim=Math.max(0,p.anim-dt);}
  while(this.pending.length&&this.pending[0].at<=this.time)this.spawn(this.pending.shift());flushCarrierSpawns(this);flushStage6Boss(this);updateStage6Spawner(this);updateWildWards(this);updateGnollAuras(this);for(const e of this.enemies)if(e.gnollBoss)updateGnollBoss(this,e);updateStage5Catapults(this);updateBladeBarracks(this);updateEwokHuts(this);this.spells.update();this.updateBurns(dt);updateBlightedPlants(this);updateHarasserMarks(this);updateArcaneSlumbers(this);for(const e of this.enemies)if(e.hp>0&&isEnemyStunned(e)){e.pendingMelee=null;if(e.cd>0)e.cd=Math.max(0,e.cd-dt);}const live=this.enemies.filter(e=>e.hp>0);this.updateGnawerAuras(live);for(const e of live)if(e.gnollDamageState)syncGnollDamage(this,e);for(const e of live)if(e.ettin){if(e.stunned)e.pendingMelee=null;ettinRegen(e,this.time,this.template('aura_ettin_regen'),{stunned:isEnemyStunned(e),frozen:e.frozen,modBanned:e.modBanned});}for(const e of live)if(e.blighter&&(e.stunned||e.frozen))e.pendingMelee=null;for(const e of live)if(e.pendingMelee){const hit=e.pendingMelee;if(!hit.dodgeChecked&&this.time+1e-9>=hit.dodgeAt){hit.dodgeChecked=true;if(hit.target.ewok){const attack=this.template(e.key).melee.attacks[0];hit.dodged=attack.dodge_time!==undefined&&tryEwokDodge(this,hit.target,{damageType:attack.damage_type});}else if(hit.target.blade){const attack=this.template(e.key).melee.attacks[0];hit.dodged=attack.dodge_time!==undefined&&tryBladeDodge(this,hit.target,{damageType:attack.damage_type});}else this.tryHeroDodge(e,hit);}if(hit.at<=this.time){const s=hit.target;if(s.hp>0&&!hit.dodged&&!(this.stageHeroes?.includes(s)&&['intro','respawn'].includes(s.phase))){if(s.blade)this.hurtDefender(s,(e.gnollDamageState?Math.ceil(this.number(...e.damage)*enemyMeleeFactor(e)):this.number(...e.damage)*(e.gnawerBuff?.factor||1)),this.template(e.key).melee.attacks[0].damage_type);else{s.hp-=Math.max(1,(e.gnollDamageState?Math.ceil(this.number(...e.damage)*enemyMeleeFactor(e)):this.number(...e.damage)*(e.gnawerBuff?.factor||1))*(1-s.armor));s.lastHitAt=this.time;}}e.pendingMelee=null;}}this.updateTowers(dt,live);const blockers=this.updateSoldiers(dt,live);this.updateHero(dt,live,blockers);updateAlleria(this,live,blockers,dt);updateFixedAlleria(this,live);updateAlleriaCats(this,dt);updateGryphonGuards(this,live,dt);
  for(const e of live){if(e.hp<=0)continue;if(e.gnollBoss&&e.gnollBoss.phase!=='loop')continue;if(e.catapult){e.flash=Math.max(0,e.flash-dt);e.anim=Math.max(0,e.anim-dt);updateCatapult(this,e,dt);continue;}if(!isEnemyStunned(e))this.updateHyena(e,blockers);e.flash=Math.max(0,e.flash-dt);e.anim=Math.max(0,e.anim-dt);e.blocked=blockers.has(e.id);if(updateBlighter(this,e)||updateEttin(this,e,{blocked:e.blocked})||updateCarrier(this,e,dt))continue;
   // Enemy behavior updates resolve before route movement.
   const custom=this.data.stageRuntime?.enemy?.(this,e,dt);if(custom!==undefined){if(custom)continue;}else if(e.harasser){if(updateHarasserJump(this,e,dt)||updateHarasser(this,e))continue;}else if(e.blighter){if(updateBlighterRanged(this,e))continue;}else if(isEnemyStunned(e)){e.pendingRanged=null;e.action='idle';e.anim=0;if(e.ranged)e.rangedCd-=dt;continue;}else if(e.ranged){e.rangedCd-=dt;if(e.blocked)e.pendingRanged=null;if(e.pendingRanged&&this.time+1e-9>=e.pendingRanged.at){this.launchTorch(e,e.pendingRanged);e.pendingRanged=null;}if(!e.blocked&&!e.pendingRanged&&e.anim<=0&&e.rangedCd<=0){const s=[...this.soldiers,...(this.stageHeroes||[]),this.hero].filter(Boolean).find(s=>s.hp>0&&!s.blade?.dance&&inEllipse(e,s,e.ranged.range)&&!inEllipse(e,s,e.ranged.minRange));if(s){e.pendingRanged={at:this.time+e.ranged.shootTime,target:s};e.rangedCd=e.ranged.cooldown;this.enemyAction(e,s,'shoot');}}}
   const route=this.routes[e.road][e.lane],connection=this.data.connections?.[String(e.road+1)];if(!movePayload(this,e,dt)){if(!e.blocked)e.d+=e.speed*(e.slowUntil>this.time?.5:1)*dt;Object.assign(e,onRoute(route,e.d));}
   if(!e.payloadJoin&&connection&&e.d>=route.length){this.effect('splash',e,.5);e.road=connection-1;e.d=0;const next=this.routes[e.road][e.lane];e.goal=next.goal;Object.assign(e,onRoute(next,0));this.effect('splash',e,.5);}
   else if(!e.payloadJoin&&!connection&&e.d>=e.goal){e.hp=0;e.leaked=true;e.deadAt=this.time;this.lives=Math.max(0,this.lives-e.lives);this.leaks++;this.emit('leak');}
  }
  if(motionOrigins&&dt>0)for(const e of live){const p=motionOrigins.get(e);e.motionVelocity=e.harasser?.teleportedAt===this.time?{x:0,y:0}:p?{x:(e.x-p.x)/dt,y:(e.y-p.y)/dt}:{x:0,y:0};}
  updateStage4Burn(this);updateGryphons(this);for(const b of this.shots){if(this.data.stageRuntime?.shot?.(this,b,dt))continue;if(b.type==='wild-bolt'){updateWildBolt(this,b,dt);continue;}if(b.type==='alleria-arrow'){updateAlleriaArrow(this,b,dt);continue;}if(b.type==='catapult-rock'){updateCatapultRock(this,b,dt);continue;}if(b.type==='arcane-arrow'){updateArcaneArrow(this,b,dt);continue;}if(b.type==='gryphon-bolt'){updateGryphonBolt(this,b,dt);continue;}if(b.type==='gryphon-arrow'){updateGuardArrow(this,b,dt);continue;}if(b.type==='harasser-arrow'){updateHarasserArrow(this,b,dt);continue;}if(b.type==='ewok-spear'){updateEwokSpear(this,b,dt);continue;}if(b.type==='blighter-energy'){updateBlighterEnergy(this,b,dt);continue;}b.elapsed+=dt;if(b.elapsed<0)continue;const t=clamp(b.elapsed/b.duration,0,1);if(b.type==='torch'){b.x=b.sx+(b.tx-b.sx)*t;b.y=b.sy+(b.ty-b.sy)*t-.5*b.g*b.duration*b.duration*t*(1-t);if(t>=1){b.done=true;this.effect('torch-impact',{x:b.tx,y:b.ty},13/30);if(b.target.hp>0&&distance({x:b.target.x+b.offset.x,y:b.target.y+b.offset.y},{x:b.tx,y:b.ty})<b.hitDistance&&!tryEwokDodge(this,b.target,{ranged:true})&&!tryBladeDodge(this,b.target,{ranged:true})){this.hurtDefender(b.target,b.damage,b.damageType);const mod=this.template('mod_gnoll_burner');b.target.burn={at:this.time,until:this.time+mod.modifier.duration,next:this.time+mod.dps.damage_every,every:mod.dps.damage_every,damage:mod.dps.damage_min};}}continue;}if(b.target.hp>0){b.tx=b.target.x;b.ty=b.target.y+12;}b.x=b.sx+(b.tx-b.sx)*t;b.y=b.sy+(b.ty-b.sy)*t+Math.sin(t*Math.PI)*(b.type==='artillery'?85:12);
   if(t>=1){b.done=true;if(b.radius){for(const e of this.enemies)if(e.hp>0&&!e.flying&&inEllipse(e,{x:b.tx,y:b.ty},b.radius))this.hurt(e,b.damage,b.damageType);this.effect('impact',{x:b.tx,y:b.ty},.5);}else if(b.target.hp>0)this.hurt(b.target,b.damage,b.damageType,b.xpFactor);}
  }
  updateWildEldritch(this);updateArcaneBursts(this);finishCarrierDeaths(this);this.shots=this.shots.filter(b=>!b.done);this.enemies=this.enemies.filter(e=>!e.removed&&(e.hp>0||!e.leaked&&(this.data.stageRuntime?.keepCorpse?.(this,e)??(this.time-e.deadAt<(e.gnollBoss?this.template(e.key).health.dead_lifetime:1.2)))));for(const f of this.effects)f.life-=dt;this.effects=this.effects.filter(f=>f.life>0);
  updateStage6Ending(this);if(this.status==='playing'){if(this.lives<=0){this.status='lost';this.emit('lost');}else if(!stage6EndingBlocksVictory(this)&&this.wave===this.totalWaves&&!this.pending.length&&!this.enemies.some(e=>e.hp>0)&&!this.shots.length&&!this.spells.busy&&!carrierBusy(this)&&!catapultBusy(this)&&!this.arcaneBursts?.some(f=>f.at===undefined)&&!wildEldritchBusy(this)&&!this.data.stageRuntime?.busy?.(this)){this.flushHeroXp();this.status='won';this.emit('won');}else if(this.wave<this.totalWaves&&this.time>=this.nextWaveAt)this.startWave();}
 }
 get stars(){return this.mode!=='campaign'?1:this.lives>=18?3:this.lives>=6?2:1;}
}

export function emptySave(){return{version:2,unlocked:1,stars:{},challenges:{},heroLevel:1,heroXp:0,heroSkills:heroSkills(),heroProgressVersion:1,options:{sound:false,difficulty:2}};}
export function recordVictory(save,w){if(w.status!=='won'||w.id<1||w.id>PLAYABLE_STAGE_COUNT)return save;const next=normalizeHeroProgress(structuredClone(save));next.heroXp=w.heroXp;next.heroLevel=w.heroLevel;if(w.mode==='campaign'){next.stars[w.id]=Math.max(next.stars[w.id]||0,w.stars);next.unlocked=Math.min(PLAYABLE_STAGE_COUNT,Math.max(next.unlocked,w.id+1));}else next.challenges[w.id+'-'+w.mode]=true;return next;}
export function canSelect(save,id,mode='campaign'){return id>=1&&id<=PLAYABLE_STAGE_COUNT&&id<=save.unlocked&&(mode==='campaign'||(save.stars[id]||0)===3);}
