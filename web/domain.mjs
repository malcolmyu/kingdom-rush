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
  this.cooldowns={reinforce:0,lightning:0,arrows:0};this.nextWaveAt=Infinity;this.nextWaveReadyAt=Infinity;this.hero=null;this.heroLevel=clamp(options.heroLevel||1,1,10);
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
  return {key,type,level,price:t.tower.price,range:t.attacks?.range||t.barrack?.rally_range||145,cooldown:attack?.cooldown||1,damage:[bullet?.damage_min||0,bullet?.damage_max||0],bullet:attack?.bullet,damageType:bullet?.damage_type||2,radius:bullet?.damage_radius||0,count:type==='mage'?attack.loops||1:1,shotHeight:Math.max(28,...list(attack?.bullet_start_offset).map(p=>p?.y||0)),render:t.render.sprites};
 }
 allowed(type,level=1){const locked=this.data.rules?.locked_towers||[];return !locked.includes('tower_build_'+TYPES[type].template)&&!locked.includes('tower_'+TYPES[type].template+'_'+level)&&level<=3;}
 build(id,type){const s=this.slots[id];if(!this.active()||!s||s.type||!TYPES[type]||!this.allowed(type))return false;const d=this.towerDef(type);if(this.gold<d.price)return false;
  this.gold-=d.price;Object.assign(s,{type,level:1,key:d.key,spent:d.price,cd:.3,anim:0});this.fillBarrack(s);this.effect('build',s,.7);this.emit('build');return true;
 }
 upgrade(id){const s=this.slots[id];if(!this.active()||!s?.type||!this.allowed(s.type,s.level+1))return false;const d=this.towerDef(s.type,s.level+1);if(this.gold<d.price)return false;
  this.gold-=d.price;s.level++;s.spent+=d.price;s.key=d.key;this.soldiers=this.soldiers.filter(v=>v.home!==id);this.fillBarrack(s);this.effect('build',s,.7);this.emit('build');return true;
 }
 sell(id){const s=this.slots[id];if(!this.active()||!s?.type)return false;this.gold+=Math.floor(s.spent*.6);s.type=null;s.key=null;s.level=0;s.spent=0;this.soldiers=this.soldiers.filter(v=>v.home!==id);this.effect('sell',s,.7);this.emit('coin');return true;}
 nearestRoad(p,groundOnly=true){let best=null,dist=Infinity;const used=new Set(this.data.waves.groups.flatMap(g=>g.waves.map(w=>w.path_index-1)));
  for(let r=0;r<this.routes.length;r++){if(!used.has(r))continue;for(const q of this.routes[r][0].points){const d=distance(p,q);if(d<dist){best=q;dist=d;}}}return best;
 }
 setRally(id,p){const s=this.slots[id],q=this.nearestRoad(p);if(!this.active()||!s||s.type!=='barrack'||distance(p,q)>45||distance(s,q)>145)return false;s.rally={x:q.x,y:q.y};for(const v of this.soldiers.filter(v=>v.home===id))v.rally={x:q.x+(v.index-1)*12,y:q.y+(v.index%2)*12};this.emit('rally');return true;}
 addHero(){const t=this.template('hero_elves_archer'),ls=t.hero.level_stats,i=this.heroLevel-1,p=this.data.level.custom_spawn_pos||this.exits[0]||{x:512,y:384};
  this.hero={id:++this.serial,key:'hero_elves_archer',x:p.x,y:p.y,target:{...p},hp:ls.hp_max[i],maxHp:ls.hp_max[i],armor:ls.armor[i],range:215,damage:[ls.ranged_damage_min[i],ls.ranged_damage_max[i]],speed:t.motion.max_speed,cd:0,dead:0,anim:0,walking:false};
 }
 fillBarrack(s){if(s.type!=='barrack')return;const t=this.template(s.key);for(let i=0;i<t.barrack.max_soldiers;i++)this.addSoldier(s.rally,i,s.id,t.barrack.soldier_type);}
 addSoldier(p,index,home=null,key='soldier_re_1'){if(!this.templates[key])key='soldier_barrack_1';const t=this.template(key),h=t.health,a=t.melee?.attacks?.[0]||{},r={x:p.x+(index-1)*12,y:p.y+(index%2)*12};
  const ranged=t.ranged?.attacks?.[0],bullet=ranged?this.template(ranged.bullet).bullet:null;
  this.soldiers.push({id:++this.serial,key,x:r.x,y:r.y,rally:r,hp:h.hp_max||50,maxHp:h.hp_max||50,armor:h.armor||0,damage:[a.damage_min||1,a.damage_max||3],attackCd:a.cooldown||1,cd:0,rangedCd:0,ranged:ranged?{range:ranged.max_range,cooldown:ranged.cooldown,bullet:ranged.bullet,damage:[bullet.damage_min,bullet.damage_max]}:null,dead:0,respawn:h.dead_lifetime||14,index,home,expires:home===null?this.time+20:Infinity,anim:0,walking:false});
 }
 startWave(){if(!this.active()||this.wave>=this.totalWaves||this.wave&&this.time<this.nextWaveReadyAt)return false;
  if(this.wave&&Number.isFinite(this.nextWaveAt)){const bonus=Math.max(0,Math.ceil((this.nextWaveAt-this.time)));this.gold+=bonus;if(bonus)this.emit('bonus',{amount:bonus});}
  const group=this.data.waves.groups[this.wave++];this.status='playing';
  let end=this.time;for(const w of group.waves){let t=this.time+(w.delay||0)/30;for(const s of w.spawns){const interval=s.interval||0,next=s.interval_next||0;for(let i=0;i<s.max;i++)this.pending.push({at:t+i*interval/30,key:s.creep,road:w.path_index-1,lane:s.fixed_sub_path?clamp(s.path-1,0,2):Math.floor(this.random()*3)});t+=Math.max(0,s.max-1)*interval/30+next/30;}end=Math.max(end,t);}
  this.pending.sort((a,b)=>a.at-b.at);this.nextWaveReadyAt=end;this.nextWaveAt=end+(this.data.waves.groups[this.wave]?.interval||0)/30;if(this.id===1&&this.mode==='campaign'&&this.wave===5)this.addHero();this.emit('wave',{wave:this.wave});return true;
 }
 spawn(p){const t=this.template(p.key),h=t.health,route=this.routes[p.road]?.[p.lane];if(!route)throw new Error(`Missing route ${p.road}/${p.lane}`);
  const maxHp=byDifficulty(h.hp_max,this.difficulty);const a=t.melee?.attacks?.[0],r=t.ranged?.attacks?.[0];this.enemies.push({id:++this.serial,key:p.key,hp:maxHp,maxHp,armor:byDifficulty(h.armor,this.difficulty)||0,magicArmor:byDifficulty(h.magic_armor,this.difficulty)||0,gold:t.enemy.gold,lives:t.enemy.lives_cost||1,speed:byDifficulty(t.motion.max_speed,this.difficulty),flying:!!(t.vis?.flags&128),d:0,road:p.road,lane:p.lane,cd:0,flash:0,blocked:false,anim:0,deadAt:0,damage:[byDifficulty(a?.damage_min,this.difficulty)||0,byDifficulty(a?.damage_max,this.difficulty)||0],attackCd:a?.cooldown||1,ranged:r?{range:r.max_range||140,damage:8,cooldown:r.cooldown||2}:null,goal:route.goal,...onRoute(route,0)});this.spawned++;
 }
 unlocked(type){if(this.id===1&&this.mode==='campaign')return this.wave>=({reinforce:2,lightning:3,arrows:5,hero:5}[type]||99);
  if(type==='arrows'&&(this.data.rules?.locked_powers?.['3']||Array.isArray(this.data.rules?.locked_powers)&&this.data.rules.locked_powers[2]))return false;return type==='hero'?!!this.hero:true;
 }
 cast(type,p){if(this.status!=='playing'||this.paused||!this.unlocked(type)||!(type in this.cooldowns)||this.cooldowns[type]>0)return false;const q=this.nearestRoad(p);if(!q||distance(p,q)>55)return false;
  if(type==='reinforce'){this.addSoldier(q,0);this.addSoldier(q,1);this.cooldowns.reinforce=15;}
  else{const radius=type==='lightning'?105:100,damage=type==='lightning'?175:90;for(const e of this.enemies)if(e.hp>0&&distance(e,q)<radius)this.hurt(e,damage,1);this.effect(type,q,1);this.cooldowns[type]=type==='lightning'?60:45;}
  this.emit('cast');return true;
 }
 activatePlant(id){const p=this.plants[id];if(!this.active()||!p||p.cd>0)return false;const t=this.template(p.key),a=t.custom_attack,targets=this.enemies.filter(e=>e.hp>0&&distance(e,p)<a.range);if(!targets.length)return false;
  for(let i=0;i<a.bullet_count;i++)this.projectile(p,targets[i%targets.length],{type:'mage',damage:byDifficulty(this.template(a.bullet).bullet.damage_min)||20,damageType:4,bullet:a.bullet,height:55,delay:i*.1});p.cd=a.cooldown;p.anim=1;this.emit('cast');return true;
 }
 moveHero(p){if(!this.active()||!this.hero||this.hero.hp<=0)return false;const q=this.nearestRoad(p);if(!q||distance(p,q)>70)return false;this.hero.target={x:q.x,y:q.y};return true;}
 effect(type,p,life,text){this.effects.push({type,x:p.x,y:p.y,life,total:life,text});}
 hurt(e,damage,type=2){if(e.hp<=0)return;const armor=type&4?e.magicArmor:type&8?e.armor*.5:type&2?e.armor:0;e.hp-=Math.max(1,Math.round(damage*(1-(armor||0))));e.flash=.1;
  if(e.hp<=0){e.deadAt=this.time;this.kills++;this.gold+=e.gold;this.effect('coin',{x:e.x,y:e.y+20},.8,'+'+e.gold);this.emit('coin');}
 }
 projectile(s,e,o){const height=o.height||40;this.shots.push({id:++this.serial,type:o.type,bullet:o.bullet,sx:s.x,sy:s.y+height,x:s.x,y:s.y+height,tx:e.x,ty:e.y+12,target:e,damage:o.damage,damageType:o.damageType||2,radius:o.radius||0,elapsed:-(o.delay||0),duration:o.type==='artillery'?.8:.35});s.anim=.6;s.facing=e.y>s.y?'Up':'Down';}
 updateTowers(dt,live){for(const s of this.slots){s.cd-=dt;s.anim=Math.max(0,s.anim-dt);if(!s.type||s.type==='barrack'||s.cd>0)continue;const d=this.towerDef(s.type,s.level),targets=live.filter(e=>e.hp>0&&(s.type!=='artillery'||!e.flying)&&distance(s,e)<d.range).sort((a,b)=>(a.goal-a.d)-(b.goal-b.d));if(!targets.length)continue;const e=targets[0];
   for(let i=0;i<d.count;i++)this.projectile(s,e,{type:s.type,damage:this.number(d.damage[0],d.damage[1]),damageType:d.damageType,bullet:d.bullet,radius:d.radius,height:d.shotHeight,delay:i*.15});s.cd=d.cooldown;
  }
 }
 updateSoldiers(dt,live){const blockers=new Set();for(const s of this.soldiers){if(this.time>s.expires){s.expired=true;continue;}if(s.hp<=0){s.dead+=dt;if(s.home!==null&&s.dead>s.respawn){s.hp=s.maxHp;s.dead=0;s.x=s.rally.x;s.y=s.rally.y;}continue;}
   s.cd-=dt;s.rangedCd-=dt;s.anim=Math.max(0,s.anim-dt);if(s.anim<=0)s.shooting=false;const e=live.find(e=>e.hp>0&&!e.flying&&!blockers.has(e.id)&&distance(s.rally,e)<45);
   if(e){blockers.add(e.id);s.walking=false;if(s.cd<=0){this.hurt(e,this.number(...s.damage),2);s.cd=s.attackCd;s.anim=.5;}e.cd-=dt;if(e.cd<=0){s.hp-=Math.max(1,this.number(...e.damage)*(1-s.armor));e.cd=e.attackCd;e.anim=.6;}}
   else{const d=distance(s,s.rally);s.walking=d>2;if(d>2){s.x+=(s.rally.x-s.x)/d*Math.min(d,65*dt);s.y+=(s.rally.y-s.y)/d*Math.min(d,65*dt);}else{s.hp=Math.min(s.maxHp,s.hp+3*dt);if(s.ranged&&s.rangedCd<=0){const target=live.find(e=>e.hp>0&&distance(s,e)<s.ranged.range);if(target){this.projectile(s,target,{type:'archer',damage:this.number(...s.ranged.damage),damageType:2,bullet:s.ranged.bullet,height:15});s.rangedCd=s.ranged.cooldown;s.shooting=true;}}}}
  }this.soldiers=this.soldiers.filter(s=>!s.expired);return blockers;
 }
 updateHero(dt,live,blockers){const h=this.hero;if(!h)return;h.cd-=dt;h.anim=Math.max(0,h.anim-dt);if(h.hp<=0){h.dead+=dt;if(h.dead>15){h.hp=h.maxHp;h.dead=0;}return;}const d=distance(h,h.target);
  if(d>3){h.x+=(h.target.x-h.x)/d*Math.min(d,h.speed*dt);h.y+=(h.target.y-h.y)/d*Math.min(d,h.speed*dt);h.walking=true;}
  else{h.walking=false;const e=live.filter(e=>e.hp>0&&distance(h,e)<h.range).sort((a,b)=>distance(h,a)-distance(h,b))[0];
   if(e&&h.cd<=0){this.projectile(h,e,{type:'hero',damage:this.number(...h.damage),damageType:2,bullet:'arrow_hero_elves_archer',height:22});h.cd=1;}
   if(e&&!e.flying&&distance(h,e)<30){blockers.add(e.id);h.hp-=5*dt*(1-h.armor);}else h.hp=Math.min(h.maxHp,h.hp+5*dt);
  }
 }
 step(dt){if(!this.active())return;this.time+=dt;for(const k in this.cooldowns)this.cooldowns[k]=Math.max(0,this.cooldowns[k]-dt);for(const p of this.plants){p.cd=Math.max(0,p.cd-dt);p.anim=Math.max(0,p.anim-dt);}
  while(this.pending.length&&this.pending[0].at<=this.time)this.spawn(this.pending.shift());const live=this.enemies.filter(e=>e.hp>0);this.updateTowers(dt,live);const blockers=this.updateSoldiers(dt,live);this.updateHero(dt,live,blockers);
  for(const e of live){if(e.hp<=0)continue;e.flash=Math.max(0,e.flash-dt);e.anim=Math.max(0,e.anim-dt);e.blocked=blockers.has(e.id);
   // Burners throw at defenders; hyenas resist blocking only by their high speed.
   if(e.ranged&&!e.blocked){e.cd-=dt;const s=this.soldiers.find(s=>s.hp>0&&distance(e,s)<e.ranged.range);if(s&&e.cd<=0){s.hp-=e.ranged.damage*(1-s.armor);e.cd=e.ranged.cooldown;e.anim=.6;this.effect('ember',s,.3);}}
   const route=this.routes[e.road][e.lane],connection=this.data.connections?.[String(e.road+1)];if(!e.blocked)e.d+=e.speed*dt;Object.assign(e,onRoute(route,e.d));
   if(connection&&e.d>=route.length){this.effect('splash',e,.5);e.road=connection-1;e.d=0;const next=this.routes[e.road][e.lane];e.goal=next.goal;Object.assign(e,onRoute(next,0));this.effect('splash',e,.5);}
   else if(!connection&&e.d>=e.goal){e.hp=0;e.leaked=true;e.deadAt=this.time;this.lives=Math.max(0,this.lives-e.lives);this.leaks++;this.emit('leak');}
  }
  for(const b of this.shots){b.elapsed+=dt;if(b.elapsed<0)continue;const t=clamp(b.elapsed/b.duration,0,1);if(b.target.hp>0){b.tx=b.target.x;b.ty=b.target.y+12;}b.x=b.sx+(b.tx-b.sx)*t;b.y=b.sy+(b.ty-b.sy)*t+Math.sin(t*Math.PI)*(b.type==='artillery'?85:12);
   if(t>=1){b.done=true;if(b.radius){for(const e of this.enemies)if(e.hp>0&&!e.flying&&distance(e,{x:b.tx,y:b.ty})<b.radius)this.hurt(e,b.damage,b.damageType);this.effect('impact',{x:b.tx,y:b.ty},.5);}else if(b.target.hp>0)this.hurt(b.target,b.damage,b.damageType);}
  }
  this.shots=this.shots.filter(b=>!b.done);this.enemies=this.enemies.filter(e=>e.hp>0||!e.leaked&&this.time-e.deadAt<1.2);for(const f of this.effects)f.life-=dt;this.effects=this.effects.filter(f=>f.life>0);
  if(this.status==='playing'){if(this.lives<=0){this.status='lost';this.emit('lost');}else if(this.wave===this.totalWaves&&!this.pending.length&&!this.enemies.some(e=>e.hp>0)&&!this.shots.length){this.status='won';this.emit('won');}else if(this.wave<this.totalWaves&&this.time>=this.nextWaveAt)this.startWave();}
 }
 get stars(){return this.mode!=='campaign'?1:this.lives>=18?3:this.lives>=6?2:1;}
}

export function emptySave(){return{version:2,unlocked:1,stars:{},challenges:{},heroLevel:1,options:{sound:false,difficulty:2}};}
export function recordVictory(save,w){if(w.status!=='won')return save;const next=structuredClone(save);if(w.mode==='campaign'){next.stars[w.id]=Math.max(next.stars[w.id]||0,w.stars);next.unlocked=Math.min(3,Math.max(next.unlocked,w.id+1));next.heroLevel=Math.max(next.heroLevel,Math.min(10,w.id+1));}else next.challenges[w.id+'-'+w.mode]=true;return next;}
export function canSelect(save,id,mode='campaign'){return id>=1&&id<=3&&id<=save.unlocked&&(mode==='campaign'||(save.stars[id]||0)===3);}
