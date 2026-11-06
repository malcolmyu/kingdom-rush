import{updateBladeDance,cancelBladeDance,bladeDancePose}from'./blade-dance.mjs';
import{syncBladePowers,updateBladeParry,bladeMelee}from'./blade-parry.mjs';
import{harasserHidden,tryHarasserDodge}from'./harasser-jump.mjs';
import{inEllipse}from'./spells.mjs';
export function initBladeSoldier(w,u){if(u.key!=='soldier_blade')return;u.blade={attackTimes:[0,0,0],forcedAt:0,attack:null,regen:0,insertedAt:w.time};u.nameIndex=w.number(1,w.template(u.key).info.random_name_count);u.idleAt=w.time-w.random();u.action='idle';syncBladePowers(w,u);}
export function fillBladeBarrack(w,s,previous){s.blade={phase:'idle',at:w.time};
 for(let i=0;i<w.template(s.key).barrack.max_soldiers;i++){const old=previous[i];if(!old||old.hp<=0)continue;const u=w.addSoldier(w.formation(s,i),i,s.id,'soldier_blade');Object.assign(u,{x:old.x,y:old.y,flip:old.flip,rally:{...old.rally},targetId:old.targetId,targetSlot:old.targetSlot,departAt:w.time});
  // systems.tower_upgrade creates a fresh unit; it does not copy health ratio.
  if(old.actionAt!==undefined)u.blade.attackTimes[0]=old.actionAt;
  for(const e of w.enemies)if(e.pendingMelee?.target===old)e.pendingMelee.target=u;
 }
}
function spawnMissing(w,s){const t=w.template(s.key);for(let i=0;i<t.barrack.max_soldiers;i++)if(!w.soldiers.some(u=>u.home===s.id&&u.index===i&&!u.expired)){const u=w.addSoldier(w.formation(s,i),i,s.id,'soldier_blade'),o=t.barrack.respawn_offset;u.x=s.x+o.x;u.y=s.y+o.y;u.walking=true;u.walkAt=w.time;}}
const missing=(w,s)=>w.soldiers.filter(u=>u.home===s.id&&!u.expired).length<w.template(s.key).barrack.max_soldiers;
export function updateBladeBarracks(w){for(const s of w.slots){if(!s.blade)continue;const b=s.blade,t=w.template(s.key),age=w.time-b.at;
 if(b.phase==='open'){if(age>=w.animationDuration(s.key+'_door','open')){spawnMissing(w,s);b.phase='hold';b.at=w.time;}continue;}
 if(b.phase==='close'){if(age>=w.animationDuration(s.key+'_door','close')){b.phase='idle';b.at=w.time;}continue;}
 if(b.phase==='hold'){if(!s.blocked&&missing(w,s))spawnMissing(w,s);if(age>t.barrack.door_hold_time){b.phase='close';b.at=w.time;}continue;}
 if(!s.blocked&&missing(w,s)){b.phase='open';b.at=w.time;w.emit('door');}
}}
export function bladeDoorPose(w,s){const b=s.blade;return{state:b.phase==='open'||b.phase==='hold'?'open':'close',time:b.phase==='hold'?w.animationDuration(s.key+'_door','open'):b.phase==='idle'?w.animationDuration(s.key+'_door','close'):w.time-b.at};}
export function pickBladeAttack(w,u,e){const m=bladeMelee(w,u),s=u.blade,order=m.attacks.map((a,i)=>({a,i})).sort((x,y)=>x.a.chance-y.a.chance||y.a.cooldown-x.a.cooldown||x.i-y.i);
 for(const{a,i}of order){if(w.time-s.attackTimes[i]<=a.cooldown||a.forced_cooldown&&w.time-s.forcedAt<=m.forced_cooldown||((e.visBans??w.template(e.key).vis?.bans??0)&a.vis_flags)||((e.visFlags??w.template(e.key).vis?.flags??0)&a.vis_bans))continue;
  if(w.random()>=a.chance){s.attackTimes[i]=w.time;continue;}return i;
 }return null;}
export function updateBladeSoldier(w,u,live,dt,{blockers,engaged,enemyTurns}){const s=u.blade,t=w.template(u.key);
 if(u.hp<=0){cancelBladeDance(u);if(s.deadAt===undefined){s.deadAt=w.time;s.attack=null;u.targetId=null;u.action='death';u.walking=false;}u.dead=w.time-s.deadAt;if(u.dead>t.health.dead_lifetime)u.expired=true;return;}
 if(s.insertedAt===w.time)return;
 if(s.dance){updateBladeDance(w,u);return;}
 if(s.rallyPending&&!s.attack&&!s.parry&&!u.stunned&&!u.frozen){const dx=u.rally.x-u.x,dy=u.rally.y-u.y,d=Math.hypot(dx,dy);if(d>u.speed*dt){if(!u.walking)u.walkAt=w.time;u.walking=true;u.flip=dx<0;u.x+=dx/d*u.speed*dt;u.y+=dy/d*u.speed*dt;return;}u.x=u.rally.x;u.y=u.rally.y;u.walking=false;s.rallyPending=false;}
 const candidates=live.filter(e=>e.hp>0&&!e.flying&&!harasserHidden(e)&&!w.hyenaFleeing(e)&&(engaged.get(e.id)||0)<3&&inEllipse(u.rally,e,t.melee.range));
 const e=candidates.find(e=>e.id===u.targetId)||candidates.sort((a,b)=>Math.hypot(u.x-a.x,u.y-a.y)-Math.hypot(u.x-b.x,u.y-b.y))[0];
 let target=u.rally;
 if(e){u.targetId=e.id;u.targetSlot=engaged.get(e.id)||0;engaged.set(e.id,u.targetSlot+1);target=w.meleePosition(u,e,u.targetSlot);}
 else u.targetId=null;
 const distance=Math.hypot(target.x-u.x,target.y-u.y);
 if(e&&distance<4){blockers.add(e.id);if(!enemyTurns.has(e.id)){enemyTurns.add(e.id);w.enemyMelee(e,u,dt);}}
 if(!s.attack&&!s.parry)syncBladePowers(w,u);
 if(s.parry){updateBladeParry(w,u);return;}
 if(u.stunned||u.frozen){s.attack=null;u.anim=0;u.action='idle';u.walking=false;return;}
 if(s.attack&&s.dodgeActive){const p=s.attack,a=bladeMelee(w,u).attacks[p.index];if(p.hit||w.time-p.at<a.hit_time){s.attack=null;u.anim=0;return;}}
 if(s.attack){const p=s.attack,a=bladeMelee(w,u).attacks[p.index],age=w.time-p.at;u.anim=Math.max(0,w.animationDuration(t.render.sprites[0].prefix,a.animation)-age);
  if(!p.hit&&age>=a.hit_time){p.hit=true;s.attackTimes[p.index]=p.at;s.forcedAt=p.at;const hit=p.target;
   if(hit.hp>0&&w.enemies.includes(hit)&&u.targetId===hit.id&&Math.hypot(u.x-w.meleePosition(u,hit,p.slot).x,u.y-w.meleePosition(u,hit,p.slot).y)<4&&!tryHarasserDodge(w,hit,{damageType:a.damage_type})){w.hurt(hit,w.number(a.damage_min,a.damage_max),a.damage_type);w.emit('melee');}
  }if(s.dodgeActive||age>=w.animationDuration(t.render.sprites[0].prefix,a.animation)){s.attack=null;u.anim=0;u.action='idle';u.idleAt=w.time;}return;
 }
 if(updateBladeParry(w,u))return;
 if(!u.walking&&updateBladeDance(w,u))return;
 if(distance>u.speed*dt){if(!u.walking)u.walkAt=w.time;u.walking=true;u.flip=target.x<u.x;u.x+=(target.x-u.x)/distance*u.speed*dt;u.y+=(target.y-u.y)/distance*u.speed*dt;return;}
 u.x=target.x;u.y=target.y;u.walking=false;
 if(e){u.flip=e.x<u.x;const index=pickBladeAttack(w,u,e);if(index!==null){const a=bladeMelee(w,u).attacks[index];s.attack={index,target:e,slot:u.targetSlot,at:w.time,hit:false};u.action=a.animation;u.actionAt=w.time;u.anim=w.animationDuration(t.render.sprites[0].prefix,a.animation);}return;}
 if(w.time-u.lastHitAt>t.regen.last_hit_standoff_time){s.regen+=dt;if(s.regen>t.regen.cooldown){s.regen=0;u.hp=Math.min(u.maxHp,u.hp+t.regen.health);}}
}
export function bladeSoldierPose(w,u){if(u.hp>0&&u.blade.dance)return bladeDancePose(w,u);if(u.hp>0&&u.blade.parry)return{state:'perfect_parry',time:w.time-u.blade.parry.at,spriteStates:{1:{loop:true}},flip:u.flip};return{state:u.hp<=0?'death':u.walking?'running':u.blade.attack?u.action:'idle',time:u.hp<=0?u.dead:u.walking?w.time-u.walkAt:u.blade.attack?w.time-u.actionAt:w.time-u.idleAt,flip:u.flip};}
