import{isEnemyStunned}from'./enemy-status.mjs';
import{inEllipse}from'./spells.mjs';
import{enemyDirection}from'./enemy-direction.mjs';
import RULES from'./blighter-energy-data.mjs';
import{spriteOrder}from'./render-order.mjs';
const members=w=>[...w.soldiers,...(w.stageHeroes||[]),w.hero].filter(Boolean);
const present=(w,s)=>!!s&&members(w).includes(s);
const flags=(w,s)=>({bans:s.visBans??w.template(s.key).vis?.bans??0,flags:s.visFlags??w.template(s.key).vis?.flags??0});
export function energyTargetAllowed(w,s,a){if(!present(w,s)||s.hp<=0)return false;const v=flags(w,s);return !(v.bans&a.vis_flags)&&!(v.flags&a.vis_bans);}
const interrupted=e=>e.hp<=0||isEnemyStunned(e)||e.frozen;
export function launchBlighterEnergy(w,e,target,attack){
 const offset=attack.bullet_start_offset[0],hit=w.template(target.key).unit.hit_offset,flip=e.actionFlip;
 const b=w.template(attack.bullet).bullet,x=e.x+(flip?-1:1)*offset.x,y=e.y+offset.y;
 const shot={id:++w.serial,type:'blighter-energy',bullet:attack.bullet,sx:x,sy:y,x,y,tx:target.x+hit.x,ty:target.y+hit.y,elapsed:0,createdAt:w.time,energy:{speed:b.min_speed,target,cached:null,phase:'travel',animation:'travel',at:w.time,flip:false,direction:null}};
 w.shots.push(shot);return shot;
}
// One source ranged episode holds its target through cooldown. New targets are
// chosen only after that episode exits; no old enemy ranged behavior is changed.
export function updateBlighterRanged(w,e){
 if(!e.blighter)return false;
 const s=e.blighter,a=w.template(e.key).ranged.attacks[0],prefix=w.template(e.key).render.sprites[0].prefix;
 if(interrupted(e)){s.energyAttack=null;s.rangedTarget=null;e.anim=0;return true;}
 if(s.energyAttack){const pending=s.energyAttack;
  if(!pending.fired&&w.time-pending.at>=a.shoot_time){pending.fired=true;if(!(flags(w,pending.target).bans&a.vis_flags)&&!(flags(w,pending.target).flags&a.vis_bans))launchBlighterEnergy(w,e,pending.target,a);}
  if(w.time-pending.at>=w.animationDuration(prefix,a.animation)){s.energyAttack=null;e.anim=0;e.action='idle';return true;}
  return true;
 }
 if(e.blocked){s.rangedTarget=null;return false;}
 if(e.pendingMelee||e.anim>0)return true;
 const valid=s=>energyTargetAllowed(w,s,a)&&inEllipse(e,s,a.max_range)&&!inEllipse(e,s,a.min_range);
 if(s.rangedTarget&&!valid(s.rangedTarget)){s.rangedTarget=null;return true;}
 if(!s.rangedTarget&&e.canDoMagic!==false)s.rangedTarget=members(w).filter(valid).sort((a,b)=>Math.hypot(e.x-a.x,e.y-a.y)-Math.hypot(e.x-b.x,e.y-b.y))[0];
 if(!s.rangedTarget)return false;
 // hold_advance holds even while the attack cooldown has not elapsed.
 if(w.time-(s.rangedAt??0)>=a.cooldown){s.rangedAt=w.time;
  if(w.random()<a.chance){w.enemyAction(e,s.rangedTarget,a.animation);s.energyAttack={at:w.time,target:s.rangedTarget,fired:false};}
 }else if(e.anim<=0){e.action='idle';}
 return true;
}
export function updateBlighterEnergy(w,shot,dt){
 const s=shot.energy,b=w.template(shot.bullet).bullet;
 shot.elapsed=w.time-shot.createdAt;
 if(s.phase==='hit'){if(w.time-s.at>=w.animationDuration(w.template(shot.bullet).render.sprites[0].prefix,'hitUpDown'))shot.done=true;return;}
 if(w.time<=shot.createdAt)return; // queued source insertion is observed next tick
 const distance=Math.hypot(shot.tx-shot.x,shot.ty-shot.y);
 // Source tests the previous destination and previous speed before lookup/update.
 if(distance<=s.speed*dt){
  if(present(w,s.cached)&&s.cached.hp>0)w.hurtDefender(s.cached,Math.ceil(b.damage_min+w.random()*(b.damage_max-b.damage_min)),b.damage_type);
  s.phase='hit';s.at=w.time;s.animation='hitUpDown';s.flip=shot.tx<shot.x;
  shot.x=shot.tx;shot.y=shot.ty-1;return;
 }
 if(s.target){s.cached=present(w,s.target)?s.target:null;}
 if(s.cached){if(s.cached.hp<=0||(flags(w,s.cached).bans&RULES.ranged)){s.target=null;s.cached=null;}else{shot.tx=s.cached.x;shot.ty=s.cached.y;}}
 s.speed=Math.max(b.min_speed,Math.min(b.max_speed,s.speed+RULES.fps*Math.ceil(s.speed/RULES.fps*b.acceleration_factor)));
 const dx=shot.tx-shot.x,dy=shot.ty-shot.y,length=Math.hypot(dx,dy);
 if(length){shot.x+=dx/length*s.speed*dt;shot.y+=dy/length*s.speed*dt;}
 const raw=w.template(shot.bullet).render.sprites[0];
 s.direction=enemyDirection(shot.tx-shot.x,shot.ty-shot.y,s.direction,raw.angles_stickiness?.travel||0);
 s.animation=raw.angles.travel[s.direction.facing==='Up'?1:s.direction.facing==='Down'?2:0];s.flip=s.direction.flip;s.at=w.time;
}
export function blighterEnergySprites(template,shot,time,frame,entityId=0){
 if(shot.done)return[];const s=shot.energy;
 return template.render.sprites.flatMap((raw,i)=>{if(raw.hidden||raw.hidden_count>0)return[];const key=frame(raw.prefix+'_'+s.animation,time-s.at,s.phase==='travel');if(!key)return[];return[{key,pos:{x:shot.x+(raw.offset?.x||0),y:shot.y+(raw.offset?.y||0)},anchor:raw.anchor,scale:raw.scale?.x??1,flip:s.flip,alpha:(raw.alpha??255)/255,rotation:raw.r||0,order:spriteOrder(raw,shot,i+1,entityId)}];});
}
