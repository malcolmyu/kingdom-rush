import{queueAlleriaCat,rallyAlleriaCat}from'./alleria-cat.mjs';
import DATA from './stage5-alleria-data.mjs';
import {inEllipse} from './spells.mjs';
import {harasserHidden,tryHarasserDodge} from './harasser-jump.mjs';
import {updateEwokSpear} from './ewok-spear.mjs';
// Stage hero has independent HP and fixed source statistics, never Eridan XP.
export function initAlleria(w){
 if(w.id!==5)return;
 w.templates={...w.templates,...DATA.templates};const t=w.template('hero_alleria');
 w.stageHeroes=[{id:++w.serial,key:'hero_alleria',x:40,y:190,target:{x:40,y:190},hp:t.health.hp_max,maxHp:t.health.hp_max,armor:t.health.armor,speed:t.motion.max_speed,phase:'intro',action:'respawn',at:w.time,lastHitAt:w.time,regen:0,attackTimes:[0,0],meleeAt:0,flip:false,dead:0}];
}
const duration=(w,h,name)=>w.animationDuration(w.template(h.key).render.sprites[0].prefix,name);
function action(w,h,name){h.action=name;h.at=w.time;h.walking=false;}
export function alleriaPose(w,h){return{state:h.walking?'walk':h.action,time:w.time-(h.walking?h.walkAt:h.at),flip:h.flip};}
export function moveAlleria(w,p){
 const h=w.stageHeroes?.[0],q=w.nearestRoad(p);if(!w.active()||!h||h.hp<=0||h.phase==='intro'||h.phase==='respawn'||!q||Math.hypot(q.x-p.x,q.y-p.y)>45)return false;
 rallyAlleriaCat(w,h,q);h.target={x:q.x,y:q.y};h.pending=null;h.phase='move';h.combatTarget=null;return true;
}
function walk(w,h,p,dt){const dx=p.x-h.x,dy=p.y-h.y,d=Math.hypot(dx,dy);if(d<=h.speed*dt){h.x=p.x;h.y=p.y;h.walking=false;return true;}if(!h.walking)h.walkAt=w.time;h.walking=true;h.flip=dx<0;h.x+=dx/d*h.speed*dt;h.y+=dy/d*h.speed*dt;return false;}
function allowed(w,e,a){return e.hp>0&&!harasserHidden(e)&&!((e.visBans??w.template(e.key).vis?.bans??0)&a.vis_flags)&&!((e.visFlags??w.template(e.key).vis?.flags??0)&a.vis_bans);}
export function launchAlleriaArrow(w,h,target,a){
 if(!h.fixedAlly&&(!w.enemies.includes(target)||!allowed(w,target,a)))return;
 const t=w.template(a.bullet),b=t.bullet,extra=t.extra_arrows||0;
 // Original multishot clones before normal arrow.insert; unused clones retain
 // the original target, not invented random spread or extra damage modifiers.
 const others=w.enemies.filter(e=>e!==target&&allowed(w,e,a)&&inEllipse(target,e,t.extra_arrows_range||0));
 const targets=[...Array.from({length:extra},(_,i)=>others[i]||target),target];
 for(const e of targets){if(h.fixedAlly&&!w.enemies.includes(e))continue;const o=a.bullet_start_offset[0],off=w.template(e.key).unit?.hit_offset||{x:0,y:0},v=e.motionVelocity||{x:0,y:0};
  const sx=h.x+(h.flip?-1:1)*o.x,sy=h.y+o.y,tx=e.x+off.x+v.x*b.flight_time+(b.prediction_error&&v.x?w.random()*10:0),ty=e.y+off.y+v.y*b.flight_time-(b.prediction_error&&v.y?w.random()*10:0);
  w.shots.push({id:++w.serial,type:'alleria-arrow',bullet:a.bullet,source:h.id,target:e,sx,sy,x:sx,y:sy,tx,ty,elapsed:0,duration:b.flight_time,g:b.g,rotation:0,insertedAt:w.time,velocity:{x:(tx-sx)/b.flight_time,y:(ty-sy-.5*b.g*b.flight_time**2)/b.flight_time}});
 }w.emit('arrow');
}
export const updateAlleriaArrow=updateEwokSpear;
export function updateAlleria(w,live,blockers,dt){
 for(const h of w.stageHeroes||[]){const t=w.template(h.key),m=t.melee.attacks[0];
  if(h.phase==='respawn'){if(w.time-h.at>=duration(w,h,'respawn')){h.phase='idle';h.hp=h.maxHp;h.dead=0;action(w,h,'idle');queueAlleriaCat(w,h);}continue;}
  if(h.hp<=0){if(h.phase!=='dead'){h.phase='dead';h.deadAt=w.time;h.pending=null;h.combatTarget=null;action(w,h,'death');}h.dead=w.time-h.deadAt;if(h.dead>=t.health.dead_lifetime){h.phase='respawn';action(w,h,'respawn');}continue;}
  if(h.phase==='intro'||h.phase==='respawn'){if(w.time-h.at>=duration(w,h,'respawn')){h.phase='idle';h.hp=h.maxHp;h.dead=0;action(w,h,'idle');queueAlleriaCat(w,h);}continue;}
  if(h.stunned||h.frozen){h.pending=null;h.phase='idle';action(w,h,'idle');continue;}
  if(h.phase==='move'){if(walk(w,h,h.target,dt)){h.phase='idle';action(w,h,'idle');}continue;}
  if(h.pending){const p=h.pending,a=p.melee?m:t.ranged.attacks[p.index];
   if(p.melee&&p.target.hp>0){blockers.add(p.target.id);w.enemyMelee(p.target,h,dt);}
   if(!p.fired&&w.time-h.at>=(a.hit_time??a.shoot_time)){p.fired=true;if(p.melee){if(p.target.hp>0&&inEllipse(h,p.target,35)&&!tryHarasserDodge(w,p.target,{damageType:a.damage_type}))w.hurt(p.target,w.number(a.damage_min,a.damage_max),a.damage_type);}else if(Math.hypot(p.target.x-p.origin.x,p.target.y-p.origin.y)<=a.max_track_distance)launchAlleriaArrow(w,h,p.target,a);}
   if(w.time-h.at>=duration(w,h,h.action)){if(p.melee)h.meleeAt=h.at;else h.attackTimes[p.index]=h.at;h.pending=null;h.phase='idle';action(w,h,'idle');}continue;
  }
  const close=live.filter(e=>!e.flying&&allowed(w,e,m)&&inEllipse(h.target,e,t.melee.range)).sort((a,b)=>Math.hypot(h.x-a.x,h.y-a.y)-Math.hypot(h.x-b.x,h.y-b.y))[0];
  if(close){h.combatTarget=close.id;const point=w.meleePosition({...h,rally:h.target},close);if(walk(w,h,point,dt)){
    blockers.add(close.id);w.enemyMelee(close,h,dt);if(w.time-h.meleeAt>=m.cooldown&&w.random()<=m.chance){h.flip=close.x<h.x;action(w,h,m.animation);h.pending={melee:true,target:close,fired:false};}
   }continue;}
  h.combatTarget=null;h.walking=false;
  // U.attack_order: equal chance, larger cooldown first, then index.
  let awaiting=false;for(const index of[1,0]){const a=t.ranged.attacks[index],target=live.filter(e=>allowed(w,e,a)&&inEllipse(h,e,a.max_range)&&!inEllipse(h,e,a.min_range)).sort((a,b)=>Number(b.flying)-Number(a.flying)||(a.goal-a.d)-(b.goal-b.d))[0];if(!target)continue;awaiting=true;if(w.time-h.attackTimes[index]<a.cooldown)continue;if(w.random()>a.chance){h.attackTimes[index]=w.time;continue;}h.flip=target.x<h.x;action(w,h,a.animation==='ranged'?'shoot':a.animation);h.pending={index,target,origin:{x:target.x,y:target.y},fired:false};break;}
  if(h.pending||awaiting)continue;
  if(Math.hypot(h.x-h.target.x,h.y-h.target.y)>2){walk(w,h,h.target,dt);continue;}
  action(w,h,'idle');if(w.time-h.lastHitAt>t.regen.last_hit_standoff_time){h.regen+=dt;if(h.regen>t.regen.cooldown){h.regen=0;h.hp=Math.min(h.maxHp,h.hp+t.regen.health);}}
 }
}
