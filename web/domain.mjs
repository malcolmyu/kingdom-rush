import {xpForLevel,levelForXp,xpMultiplier,heroSkills,normalizeHeroProgress,HERO_RULES} from './progression.mjs';
import {SpellTimeline,inEllipse} from './spells.mjs';
// Deterministic game rules. No DOM, Canvas, network or storage dependencies.
export const MODES={campaign:{name:'战役',lives:20},heroic:{name:'英雄挑战',lives:1},iron:{name:'钢铁挑战',lives:1}};
export const TYPES={archer:{name:'猎人之树',template:'archer',icon:'tower_preview_archer',description:'快速射击，能攻击地面与飞行敌人。'},barrack:{name:'精灵兵营',template:'barrack',icon:'tower_preview_barracks',description:'三名精灵战士拦截地面敌人，可调整集结点。'},mage:{name:'秘法师高台',template:'mage',icon:'tower_preview_mage',description:'魔法飞弹穿透物理护甲，能攻击飞行敌人。'},artillery:{name:'石环阵',template:'rock_thrower',icon:'tower_preview_artillery',description:'投掷巨石，对地面敌人造成范围伤害。'}};
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const list=x=>Array.isArray(x)?x:Object.values(x||{});
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
  this.data=data;this.templates=data.templates;this.id=data.id;this.mode=data.mode||'campaign';this.difficulty=options.difficulty||2;this.seed=options.seed??17;
  this.time=0;this.gold=data.waves.cash;this.lives=MODES[this.mode].lives;this.maxLives=this.lives;this.totalWaves=data.waves.groups.length;this.wave=0;
  this.status='ready';this.paused=false;this.enemies=[];this.soldiers=[];this.shots=[];this.effects=[];this.pending=[];this.events=[];this.serial=0;this.kills=0;this.leaks=0;this.spawned=0;
  this.cooldowns={reinforce:0,lightning:0,arrows:0};this.nextWaveAt=Infinity;this.nextWaveReadyAt=Infinity;this.hero=null;this.heroXp=options.heroXp??xpForLevel(options.heroLevel||1);this.heroXpQueued=0;this.heroLevel=levelForXp(this.heroXp);this.heroSkills=heroSkills(options.heroSkills);
  this.spells=new SpellTimeline(this,options.ultimateLevel??this.heroSkills.ultimate);
  this.exits=data.level.entities_list.filter(e=>e.template==='decal_defend_point').map(e=>e.pos);
  this.routes=data.paths.map(paths=>paths.map(p=>makeRoute(p,this.exits)));
  this.slots=data.level.entities_list.filter(e=>e.template.startsWith('tower_holder_')||/^tower_(archer|barrack|mage|rock_thrower)_[123]$/.test(e.template)).map((e,id)=>({id,x:e.pos.x,y:e.pos.y,rally:{...(e['barrack.rally_pos']||e['tower.default_rally_pos'])},holder:e['tower.holder_id'],terrain:e['tower.terrain_style']||1,type:null,level:0,key:null,spent:0,cd:0,anim:0,prebuilt:!e.template.startsWith('tower_holder_'),source:e}));
  for(const s of this.slots)if(s.prebuilt){s.key=s.source.template;s.type=Object.keys(TYPES).find(t=>s.key.startsWith('tower_'+TYPES[t].template+'_'));s.level=Number(s.key.at(-1));this.fillBarrack(s);}
  this.plants=data.level.entities_list.filter(e=>e.template==='plant_magic_blossom').map((e,i)=>({id:i,...e.pos,key:e.template,cd:0,anim:0}));
  if(!(this.id===1&&this.mode==='campaign'))this.addHero();
 }
 random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 number(a,b){return a+Math.floor(this.random()*(b-a+1));}
 emit(type,props={}){this.events.push({type,...props});}
 active(){return ['ready','playing'].includes(this.status)&&!this.paused;}
 template(key){const t=this.templates[key];if(!t)throw new Error('Unknown original template: '+key);return t;}
 towerDef(type,level=1){const key='tower_'+TYPES[type].template+'_'+level,t=this.template(key),attack=t.attacks?.list?.[0],bullet=attack?.bullet?this.template(attack.bullet).bullet:null;
  return {key,type,level,price:t.tower.price,range:t.attacks?.range||t.barrack?.rally_range||145,rangeOffset:t.tower.range_offset||{x:0,y:0},cooldown:attack?.cooldown||1,damage:[bullet?.damage_min||0,bullet?.damage_max||0],bullet:attack?.bullet,damageType:bullet?.damage_type||2,radius:bullet?.damage_radius||0,shootTime:attack?.shoot_time||0,offsets:attack?.bullet_start_offset?.x!==undefined?[attack.bullet_start_offset]:list(attack?.bullet_start_offset),count:type==='mage'?attack.loops||1:1,shotHeight:Math.max(28,...list(attack?.bullet_start_offset).map(p=>p?.y||0)),render:t.render.sprites};
 }
 allowed(type,level=1){const locked=this.data.rules?.locked_towers||[];return !locked.includes('tower_build_'+TYPES[type].template)&&!locked.includes('tower_'+TYPES[type].template+'_'+level)&&level<=3;}
 build(id,type){const s=this.slots[id];if(!this.active()||!s||s.type||!TYPES[type]||!this.allowed(type))return false;const d=this.towerDef(type);if(this.gold<d.price)return false;
  this.gold-=d.price;Object.assign(s,{type,level:1,key:d.key,spent:d.price,cd:.3,anim:0,buildAt:this.time,buildUntil:this.time+this.template('tower_build_'+TYPES[type].template).build_duration});this.fillBarrack(s);this.effect('build',s,.7);this.emit('build');if(type==='barrack')this.emit('barrack');return true;
 }
 upgrade(id){const s=this.slots[id];if(!this.active()||!s?.type||!this.allowed(s.type,s.level+1))return false;const d=this.towerDef(s.type,s.level+1);if(this.gold<d.price)return false;
  this.gold-=d.price;s.level++;s.spent+=d.price;s.key=d.key;const previous=this.soldiers.filter(v=>v.home===id);this.soldiers=this.soldiers.filter(v=>v.home!==id);this.fillBarrack(s,previous);this.effect('build',s,.7);this.emit('build');return true;
 }
 sell(id){const s=this.slots[id];if(!this.active()||!s?.type)return false;this.gold+=Math.floor(s.spent*.6);s.type=null;s.key=null;s.level=0;s.spent=0;this.soldiers=this.soldiers.filter(v=>v.home!==id);this.effect('sell',s,.7);this.emit('coin');return true;}
 nearestRoad(p,groundOnly=true){let best=null,dist=Infinity;const used=new Set(this.data.waves.groups.flatMap(g=>g.waves.map(w=>w.path_index-1)));
  for(let r=0;r<this.routes.length;r++){if(!used.has(r))continue;for(const q of this.routes[r][0].points){const d=distance(p,q);if(d<dist){best=q;dist=d;}}}return best;
 }
 setRally(id,p){const s=this.slots[id],q=this.nearestRoad(p);if(!this.active()||!s||s.type!=='barrack'||distance(p,q)>45||distance(s,q)>145)return false;s.rally={x:q.x,y:q.y};for(const v of this.soldiers.filter(v=>v.home===id)){v.rally=this.formation(s,v.index);v.pendingHit=null;}this.effect('rally',q,1);this.emit('barrack');return true;}
 addHero(){const t=this.template('hero_elves_archer'),ls=t.hero.level_stats,i=this.heroLevel-1,p=this.data.level.custom_spawn_pos||this.exits[0]||{x:512,y:384};
  this.hero={id:++this.serial,key:'hero_elves_archer',x:p.x,y:p.y,target:{...p},hp:ls.hp_max[i],maxHp:ls.hp_max[i],armor:ls.armor[i],range:t.ranged.attacks[0].max_range,minRange:t.ranged.attacks[0].min_range,damage:[ls.ranged_damage_min[i],ls.ranged_damage_max[i]],meleeDamage:[ls.melee_damage_min[i],ls.melee_damage_max[i]],speed:t.motion.max_speed,cd:0,dead:0,anim:this.animationDuration('hero_elves_archer','levelup'),action:'levelup',actionAt:this.time,walkAt:this.time,stance:'bow',flip:false,lastHitAt:-Infinity,regenAt:this.time,walking:false,skillReadyAt:0};
 }
 formation(s,index){const t=this.template(s.key).barrack,angle=(t.rally_angle_offset||0)+Math.PI*2*index/t.max_soldiers-Math.PI/2;return{x:s.rally.x+Math.cos(angle)*t.rally_radius,y:s.rally.y+Math.sin(angle)*t.rally_radius*.7};}
 fillBarrack(s,previous=[]){if(s.type!=='barrack')return;const t=this.template(s.key);s.doorAt=Math.max(this.time,s.buildUntil||0);for(let i=0;i<t.barrack.max_soldiers;i++){const u=this.addSoldier(this.formation(s,i),i,s.id,t.barrack.soldier_type),old=previous[i];if(old){u.x=old.x;u.y=old.y;u.flip=old.flip;u.hp=u.maxHp*(Math.max(0,old.hp)/old.maxHp);u.dead=old.dead;u.departAt=this.time;}else this.departSoldier(u,s);}}
 departSoldier(u,s){const offset=this.template(s.key).barrack.respawn_offset;u.x=s.x+offset.x;u.y=s.y+offset.y;s.doorAt=Math.max(this.time,s.buildUntil||0);u.departAt=s.doorAt+this.animationDuration(s.key+'_door','open');u.walkAt=u.departAt;u.walking=true;}
 addSoldier(p,index,home=null,key='soldier_re_1'){if(!this.templates[key])key='soldier_barrack_1';const t=this.template(key),h=t.health,a=t.melee?.attacks?.[0]||{},r=home===null?{x:p.x+(index-.5)*12,y:p.y}:p;
  const ranged=t.ranged?.attacks?.[0],bullet=ranged?this.template(ranged.bullet).bullet:null;
  const u={id:++this.serial,key,x:r.x,y:r.y,rally:r,hp:h.hp_max||50,maxHp:h.hp_max||50,armor:h.armor||0,speed:t.motion.max_speed,damage:[a.damage_min||1,a.damage_max||3],hitTime:a.hit_time||0,attackCd:a.cooldown||1,cd:0,rangedCd:0,ranged:ranged?{range:ranged.max_range,minRange:ranged.min_range||0,shootTime:ranged.shoot_time||0,cooldown:ranged.cooldown,bullet:ranged.bullet,damage:[bullet.damage_min,bullet.damage_max]}:null,dead:0,respawn:h.dead_lifetime||14,index,home,expires:home===null?this.time+20:Infinity,anim:0,actionAt:this.time,walkAt:this.time,lastHitAt:-Infinity,regen:t.regen,walking:false,flip:false,departAt:this.time};this.soldiers.push(u);return u;
 }
 startWave(){if(!this.active()||this.wave>=this.totalWaves||this.wave&&this.time<this.nextWaveReadyAt)return false;
  if(this.wave&&Number.isFinite(this.nextWaveAt)){const bonus=Math.max(0,Math.ceil((this.nextWaveAt-this.time)));this.gold+=bonus;if(bonus)this.emit('bonus',{amount:bonus});}
  const group=this.data.waves.groups[this.wave++];this.status='playing';
  let end=this.time;for(const w of group.waves){let t=this.time+(w.delay||0)/30;for(const s of w.spawns){const interval=s.interval||0,next=s.interval_next||0;for(let i=0;i<s.max;i++)this.pending.push({at:t+i*interval/30,key:s.creep,road:w.path_index-1,lane:s.fixed_sub_path?clamp(s.path-1,0,2):Math.floor(this.random()*3)});t+=Math.max(0,s.max-1)*interval/30+next/30;}end=Math.max(end,t);}
  this.pending.sort((a,b)=>a.at-b.at);this.nextWaveReadyAt=end;this.nextWaveAt=end+(this.data.waves.groups[this.wave]?.interval||0)/30;if(this.id===1&&this.mode==='campaign'&&this.wave===5)this.addHero();this.emit('wave',{wave:this.wave});return true;
 }
 spawn(p){const t=this.template(p.key),h=t.health,route=this.routes[p.road]?.[p.lane];if(!route)throw new Error(`Missing route ${p.road}/${p.lane}`);
  const maxHp=byDifficulty(h.hp_max,this.difficulty);const a=t.melee?.attacks?.[0],r=t.ranged?.attacks?.[0];this.enemies.push({id:++this.serial,key:p.key,hp:maxHp,maxHp,armor:byDifficulty(h.armor,this.difficulty)||0,magicArmor:byDifficulty(h.magic_armor,this.difficulty)||0,gold:t.enemy.gold,lives:t.enemy.lives_cost||1,speed:byDifficulty(t.motion.max_speed,this.difficulty),flying:!!(t.vis?.flags&128),d:0,road:p.road,lane:p.lane,cd:0,flash:0,blocked:false,anim:0,deadAt:0,damage:[byDifficulty(a?.damage_min,this.difficulty)||0,byDifficulty(a?.damage_max,this.difficulty)||0],attackCd:a?.cooldown||1,hitTime:a?.hit_time||0,ranged:r?{range:r.max_range||140,damage:8,cooldown:r.cooldown||2}:null,goal:route.goal,...onRoute(route,0)});this.spawned++;
 }
 unlocked(type){if(this.id===1&&this.mode==='campaign')return this.wave>=({reinforce:2,lightning:3,arrows:5,hero:5}[type]||99);
  if(type==='arrows'&&(this.data.rules?.locked_powers?.['3']||Array.isArray(this.data.rules?.locked_powers)&&this.data.rules.locked_powers[2]))return false;return type==='hero'?!!this.hero:true;
 }
 cast(type,p){if(this.status!=='playing'||this.paused||!this.unlocked(type)||!(type in this.cooldowns)||this.cooldowns[type]>0)return false;const q=this.nearestRoad(p);if(!q||distance(p,q)>55)return false;
  if(type==='reinforce'){this.addSoldier(q,0);this.addSoldier(q,1);this.cooldowns.reinforce=15;}
  else if(type==='lightning')this.spells.castLightning(q);else this.spells.castArrows(q);
  this.emit('cast');return true;
 }
 activatePlant(id){const p=this.plants[id];if(!this.active()||!p||p.cd>0)return false;const t=this.template(p.key),a=t.custom_attack,targets=this.enemies.filter(e=>e.hp>0&&distance(e,p)<a.range);if(!targets.length)return false;
  for(let i=0;i<a.bullet_count;i++)this.projectile(p,targets[i%targets.length],{type:'mage',damage:byDifficulty(this.template(a.bullet).bullet.damage_min)||20,damageType:4,bullet:a.bullet,height:55,delay:i*.1});p.cd=a.cooldown;p.anim=1;this.emit('cast');return true;
 }
 moveHero(p){if(!this.active()||!this.hero||this.hero.hp<=0)return false;const q=this.nearestRoad(p);if(!q||distance(p,q)>70)return false;this.hero.target={x:q.x,y:q.y};this.hero.pendingHit=null;this.hero.playerMove=true;this.hero.combatTarget=null;this.hero.anim=0;this.hero.action=null;return true;}
 effect(type,p,life,text){this.effects.push({type,x:p.x,y:p.y,life,total:life,text});}
 hurt(e,damage,type=2,xpFactor=0){if(e.hp<=0)return;const armor=type&4?e.magicArmor:type&8?e.armor*.5:type&2?e.armor:0;const applied=Math.max(1,Math.round(damage*(1-(armor||0))));e.hp-=applied;e.flash=.1;if(xpFactor>0)this.heroXpQueued+=applied*xpFactor;
  if(e.hp<=0){e.deadAt=this.time;e.deathFlip=e.anim>0?e.actionFlip:e.dx<0;this.kills++;this.gold+=e.gold;this.effect('coin',{x:e.x,y:e.y+20},.8,'+'+e.gold);this.emit('coin');}
 }
 projectile(s,e,o){const height=o.height||40;this.shots.push({id:++this.serial,type:o.type,bullet:o.bullet,xpFactor:o.xpFactor||0,sx:s.x+(o.offsetX||0),sy:s.y+height,x:s.x+(o.offsetX||0),y:s.y+height,tx:e.x,ty:e.y+12,target:e,damage:o.damage,damageType:o.damageType||2,radius:o.radius||0,elapsed:-(o.delay||0),duration:o.duration??(o.type==='artillery'?.8:.35)});if(!o.preserveAnimation)s.anim=.6;if(!o.preserveAnimation)s.facing=e.y>s.y?'Up':'Down';}
 updateTowers(dt,live){for(const s of this.slots){s.cd-=dt;s.anim=Math.max(0,s.anim-dt);if(s.type==='artillery'&&s.reloadUntil===undefined){s.reloadAt=s.buildUntil||0;s.reloadUntil=s.reloadAt+this.animationDuration(this.template(s.key).render.sprites.at(-1).prefix,'loadDown');}if(s.type==='artillery'&&this.time<s.reloadUntil)continue;if(!s.type||this.time<s.buildUntil||s.type==='barrack'||s.cd>0)continue;const d=this.towerDef(s.type,s.level),targets=live.filter(e=>e.hp>0&&(s.type!=='artillery'||!e.flying)&&inEllipse({x:s.x+d.rangeOffset.x,y:s.y+d.rangeOffset.y},e,d.range)).sort((a,b)=>(a.goal-a.d)-(b.goal-b.d));if(!targets.length)continue;const e=targets[0];
   s.actionAt=this.time;s.facing=e.y>s.y+d.shotHeight?'Up':'Down';s.flip=e.x<s.x;s.shotCount=(s.shotCount||0)+1;s.shooterIndex=s.shotCount%d.offsets.length;
   const shooter=d.render.find(v=>v.angles?.shoot),name=shooter?.angles?.shoot?.[s.facing==='Up'?0:1];s.anim=this.animationDuration(shooter?.prefix||s.key,name||'shoot');
   for(let i=0;i<d.count;i++){const offset=d.offsets[s.type==='archer'?s.shooterIndex:i%d.offsets.length]||{x:0,y:d.shotHeight};this.projectile(s,e,{type:s.type,damage:this.number(d.damage[0],d.damage[1]),damageType:d.damageType,bullet:d.bullet,radius:d.radius,height:offset.y,offsetX:offset.x,delay:d.shootTime,preserveAnimation:true});}s.cd=d.cooldown;
   if(s.type==='artillery'){s.reloadAt=this.time+s.anim;s.reloadUntil=s.reloadAt+this.animationDuration(shooter.prefix,'loadDown');}
  }
 }
 meleePosition(s,e,index=0){const enemy=this.template(e.key).enemy.melee_slot||{x:18,y:0},offset=this.template(s.key).soldier?.melee_slot_offset||{x:5,y:0},side=e.dx===undefined?(s.rally.x>=e.x?1:-1):e.dx>=0?1:-1;return{x:e.x+(enemy.x+offset.x+(index%3? -3:0))*side,y:e.y+enemy.y+offset.y+(index%3===1?-6:index%3===2?6:0)};}
 updateSoldiers(dt,live){const blockers=new Set(),engaged=new Map(),enemyTurns=new Set();for(const s of this.soldiers){if(this.time>s.expires){s.expired=true;continue;}if(s.hp<=0){s.pendingHit=null;s.dead+=dt;if(s.home!==null&&s.dead>s.respawn){s.hp=s.maxHp;s.dead=0;this.departSoldier(s,this.slots[s.home]);}continue;}if(this.time<s.departAt)continue;
   s.cd-=dt;s.rangedCd-=dt;s.anim=Math.max(0,s.anim-dt);if(s.anim<=0)s.shooting=false;
   if(s.pendingHit&&this.time>=s.pendingHit.at){const hit=s.pendingHit;s.pendingHit=null;if(hit.target.hp>0){if(hit.ranged)this.projectile(s,hit.target,{type:'archer',damage:this.number(...s.ranged.damage),damageType:2,bullet:s.ranged.bullet,height:10,preserveAnimation:true});else if(distance(s,this.meleePosition(s,hit.target,hit.slot))<4){this.hurt(hit.target,this.number(...s.damage),2);this.emit('melee');}}}
   const candidates=live.filter(e=>e.hp>0&&!e.flying&&(engaged.get(e.id)||0)<3&&inEllipse(s.rally,e,this.template(s.key).melee?.range||60));const e=candidates.find(e=>e.id===s.targetId)||candidates.sort((a,b)=>distance(s,a)-distance(s,b))[0];
   let target=s.rally;if(e){s.targetId=e.id;s.targetSlot=engaged.get(e.id)||0;engaged.set(e.id,s.targetSlot+1);blockers.add(e.id);target=this.meleePosition(s,e,s.targetSlot);}else{s.targetId=null;}
   const d=distance(s,target);if(d>2){if(!s.walking)s.walkAt=this.time;s.walking=true;s.flip=target.x<s.x;s.x+=(target.x-s.x)/d*Math.min(d,s.speed*dt);s.y+=(target.y-s.y)/d*Math.min(d,s.speed*dt);}
   else{s.walking=false;if(e){s.flip=e.x<s.x;if(s.cd<=0){s.cd=s.attackCd;s.anim=this.animationDuration(s.key,'attack');s.actionAt=this.time;s.shooting=false;s.pendingHit={at:this.time+s.hitTime,target:e,slot:s.targetSlot};}if(!enemyTurns.has(e.id)){enemyTurns.add(e.id);this.enemyMelee(e,s,dt);}}
    else{if(s.regen&&this.time-s.lastHitAt>s.regen.last_hit_standoff_time)s.hp=Math.min(s.maxHp,s.hp+s.regen.health/s.regen.cooldown*dt);if(s.ranged&&s.rangedCd<=0&&!s.pendingHit){const target=live.find(e=>e.hp>0&&inEllipse(s,e,s.ranged.range)&&!inEllipse(s,e,s.ranged.minRange||.01));if(target){s.rangedCd=s.ranged.cooldown;s.shooting=true;s.flip=target.x<s.x;s.anim=this.animationDuration(s.key,'ranged_attack');s.actionAt=this.time;s.pendingHit={at:this.time+s.ranged.shootTime,target,ranged:true};}}}}
  }this.soldiers=this.soldiers.filter(s=>!s.expired);return blockers;
 }
 animationDuration(key,state){const a=this.data.animations?.[key+'_'+state];return a?(a.frames?.length||a.ranges?.reduce((n,[f,t])=>n+t-f+1,0)||(a.to-a.from+1))/30:.6;}
 flushHeroXp(){if(!this.heroXpQueued||!this.hero||this.hero.hp<=0)return false;this.heroXp+=Math.floor(this.heroXpQueued*xpMultiplier(this.heroLevel,this.id,this.difficulty)+.5);this.heroXpQueued=0;const next=this.heroLevel<10&&this.heroXp>=HERO_RULES.hero_xp_thresholds[this.heroLevel-1];if(next){this.heroLevel++;const h=this.hero,stats=this.template(h.key).hero.level_stats,i=this.heroLevel-1;h.maxHp=stats.hp_max[i];h.hp=h.maxHp;h.armor=stats.armor[i];h.damage=[stats.ranged_damage_min[i],stats.ranged_damage_max[i]];h.meleeDamage=[stats.melee_damage_min[i],stats.melee_damage_max[i]];this.heroAction(h,'levelup');this.emit('hero_levelup',{level:this.heroLevel});}this.emit('hero_xp',{xp:this.heroXp,level:this.heroLevel});return !!next;}
 enemyAction(e,target,action){e.action=action;e.actionAt=this.time;e.actionFlip=target.x<e.x;const prefix=this.template(e.key).render.sprites[0].prefix;e.anim=this.animationDuration(prefix,action);}
 enemyMelee(e,target,dt){if(e.meleeTick===this.time)return;e.meleeTick=this.time;e.cd-=dt;if(e.cd<=0){e.pendingMelee={at:this.time+e.hitTime,target};e.cd=e.attackCd;this.enemyAction(e,target,'attack');}}
 heroAction(h,action){h.action=action;h.actionAt=this.time;const name=this.template(h.key).render.sprites[0].angles?.[action]?.[0]||action;h.anim=this.animationDuration(h.key,name);}
 updateHero(dt,live,blockers){const h=this.hero;if(!h)return;const template=this.template(h.key),ranged=template.ranged.attacks[0],melee=template.melee.attacks[0];h.cd-=dt;h.anim=Math.max(0,h.anim-dt);
  if(h.hp<=0){if(!h.dead){h.pendingHit=null;h.combatTarget=null;h.walking=false;this.heroAction(h,'death');}h.dead+=dt;if(h.dead>=template.health.dead_lifetime){h.hp=h.maxHp;h.dead=0;h.stance='bow';this.heroAction(h,'respawn');}return;}
  if(h.pendingHit&&this.time+1e-9>=h.pendingHit.at){const hit=h.pendingHit;h.pendingHit=null;if(hit.target.hp>0){if(hit.ranged){const offset=ranged.bullet_start_offset[0];this.projectile(h,hit.target,{type:'hero',damage:this.number(...h.damage),damageType:2,bullet:ranged.bullet,height:offset.y,offsetX:offset.x*(h.flip?-1:1),duration:this.template(ranged.bullet).bullet.flight_time,xpFactor:this.template(ranged.bullet).bullet.xp_gain_factor,preserveAnimation:true});}else if(inEllipse(h,hit.target,35)){this.hurt(hit.target,this.number(...(hit.damage||h.meleeDamage)),melee.damage_type,hit.skill?0:melee.xp_gain_factor);this.emit('melee');}}}
  const move=target=>{const d=distance(h,target);if(d<=2){h.walking=false;return false;}if(!h.walking)h.walkAt=this.time;h.walking=true;h.flip=target.x<h.x;h.x+=(target.x-h.x)/d*Math.min(d,h.speed*dt);h.y+=(target.y-h.y)/d*Math.min(d,h.speed*dt);return true;};
  const engaged=live.find(e=>e.id===h.combatTarget&&e.hp>0);if(engaged&&!h.walking&&inEllipse(h,engaged,35)){blockers.add(engaged.id);this.enemyMelee(engaged,h,dt);}
  if(h.anim>0){h.walking=false;return;}
  if(h.playerMove){if(distance(h,h.target)>3){move(h.target);return;}h.playerMove=false;}
  if(this.flushHeroXp())return;
  // A player rally order takes priority over combat; pending attacks are cancelled by moveHero.
  if(!h.combatTarget&&distance(h,h.target)>3){move(h.target);return;}
  const close=live.filter(e=>e.hp>0&&!e.flying&&inEllipse(h.target,e,template.melee.range)).sort((a,b)=>distance(h,a)-distance(h,b))[0];
  if(close){h.combatTarget=close.id;const slot=this.meleePosition({...h,rally:h.target},close,0);if(move(slot))return;blockers.add(close.id);h.flip=close.x<h.x;this.enemyMelee(close,h,dt);
   if(h.stance!=='sword'){h.stance='sword';this.heroAction(h,'bow2sword');return;}
   if(h.cd<=0){const level=this.heroSkills.double_strike,skill=level>0&&this.time>=(h.skillReadyAt||0),attack=skill?template.melee.attacks[1]:melee;h.cd=template.melee.cooldown;this.heroAction(h,attack.animation);h.pendingHit={at:this.time+attack.hit_time,target:close,ranged:false,skill};if(skill){this.emit('double_strike');const values=template.hero.skills.double_strike;h.skillReadyAt=this.time+attack.cooldown;h.pendingHit.damage=[values.damage_min[level-1],values.damage_max[level-1]];this.heroXpQueued+=values.xp_gain_factor*level;}}return;
  }
  h.combatTarget=null;h.walking=false;
  if(h.stance!=='bow'){h.stance='bow';this.heroAction(h,'sword2bow');return;}
  const target=live.filter(e=>e.hp>0&&inEllipse(h,e,h.range)&&!inEllipse(h,e,h.minRange)).sort((a,b)=>distance(h,a)-distance(h,b))[0];
  if(target&&h.cd<=0){h.flip=target.x<h.x;h.cd=ranged.cooldown;this.heroAction(h,'ranged');h.pendingHit={at:this.time+ranged.shoot_time,target,ranged:true};return;}
  if(!target&&distance(h,h.target)>3){move(h.target);return;}
  if(!target&&this.time-h.lastHitAt>template.regen.last_hit_standoff_time&&this.time-h.regenAt>=template.regen.cooldown){h.hp=Math.min(h.maxHp,h.hp+template.hero.level_stats.regen_health[this.heroLevel-1]);h.regenAt=this.time;}
 }
 step(dt){if(!this.active())return;this.time+=dt;for(const s of this.slots)if(s.type==='barrack'&&s.doorAt<=this.time&&s.doorPlayedAt!==s.doorAt){s.doorPlayedAt=s.doorAt;this.emit('door');}for(const k in this.cooldowns)this.cooldowns[k]=Math.max(0,this.cooldowns[k]-dt);for(const p of this.plants){p.cd=Math.max(0,p.cd-dt);p.anim=Math.max(0,p.anim-dt);}
  while(this.pending.length&&this.pending[0].at<=this.time)this.spawn(this.pending.shift());this.spells.update();const live=this.enemies.filter(e=>e.hp>0);for(const e of live)if(e.pendingMelee&&e.pendingMelee.at<=this.time){const s=e.pendingMelee.target;if(s.hp>0){s.hp-=Math.max(1,this.number(...e.damage)*(1-s.armor));s.lastHitAt=this.time;}e.pendingMelee=null;}this.updateTowers(dt,live);const blockers=this.updateSoldiers(dt,live);this.updateHero(dt,live,blockers);
  for(const e of live){if(e.hp<=0)continue;e.flash=Math.max(0,e.flash-dt);e.anim=Math.max(0,e.anim-dt);e.blocked=blockers.has(e.id);
   // Burners throw at defenders; hyenas resist blocking only by their high speed.
   if(e.ranged&&!e.blocked){e.cd-=dt;const s=this.soldiers.find(s=>s.hp>0&&distance(e,s)<e.ranged.range);if(s&&e.cd<=0){s.hp-=e.ranged.damage*(1-s.armor);e.cd=e.ranged.cooldown;this.enemyAction(e,s,'shoot');this.effect('ember',s,.3);}}
   const route=this.routes[e.road][e.lane],connection=this.data.connections?.[String(e.road+1)];if(!e.blocked)e.d+=e.speed*(e.slowUntil>this.time?.5:1)*dt;Object.assign(e,onRoute(route,e.d));
   if(connection&&e.d>=route.length){this.effect('splash',e,.5);e.road=connection-1;e.d=0;const next=this.routes[e.road][e.lane];e.goal=next.goal;Object.assign(e,onRoute(next,0));this.effect('splash',e,.5);}
   else if(!connection&&e.d>=e.goal){e.hp=0;e.leaked=true;e.deadAt=this.time;this.lives=Math.max(0,this.lives-e.lives);this.leaks++;this.emit('leak');}
  }
  for(const b of this.shots){b.elapsed+=dt;if(b.elapsed<0)continue;const t=clamp(b.elapsed/b.duration,0,1);if(b.target.hp>0){b.tx=b.target.x;b.ty=b.target.y+12;}b.x=b.sx+(b.tx-b.sx)*t;b.y=b.sy+(b.ty-b.sy)*t+Math.sin(t*Math.PI)*(b.type==='artillery'?85:12);
   if(t>=1){b.done=true;if(b.radius){for(const e of this.enemies)if(e.hp>0&&!e.flying&&inEllipse(e,{x:b.tx,y:b.ty},b.radius))this.hurt(e,b.damage,b.damageType);this.effect('impact',{x:b.tx,y:b.ty},.5);}else if(b.target.hp>0)this.hurt(b.target,b.damage,b.damageType,b.xpFactor);}
  }
  this.shots=this.shots.filter(b=>!b.done);this.enemies=this.enemies.filter(e=>e.hp>0||!e.leaked&&this.time-e.deadAt<1.2);for(const f of this.effects)f.life-=dt;this.effects=this.effects.filter(f=>f.life>0);
  if(this.status==='playing'){if(this.lives<=0){this.status='lost';this.emit('lost');}else if(this.wave===this.totalWaves&&!this.pending.length&&!this.enemies.some(e=>e.hp>0)&&!this.shots.length&&!this.spells.busy){this.flushHeroXp();this.status='won';this.emit('won');}else if(this.wave<this.totalWaves&&this.time>=this.nextWaveAt)this.startWave();}
 }
 get stars(){return this.mode!=='campaign'?1:this.lives>=18?3:this.lives>=6?2:1;}
}

export function emptySave(){return{version:2,unlocked:1,stars:{},challenges:{},heroLevel:1,heroXp:0,heroSkills:heroSkills(),heroProgressVersion:1,options:{sound:false,difficulty:2}};}
export function recordVictory(save,w){if(w.status!=='won')return save;const next=normalizeHeroProgress(structuredClone(save));next.heroXp=w.heroXp;next.heroLevel=w.heroLevel;if(w.mode==='campaign'){next.stars[w.id]=Math.max(next.stars[w.id]||0,w.stars);next.unlocked=Math.min(3,Math.max(next.unlocked,w.id+1));}else next.challenges[w.id+'-'+w.mode]=true;return next;}
export function canSelect(save,id,mode='campaign'){return id>=1&&id<=3&&id<=save.unlocked&&(mode==='campaign'||(save.stars[id]||0)===3);}
