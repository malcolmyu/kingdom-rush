import rules from './gryphon-guard-data.mjs';
import {harasserPathBounds,harasserHidden} from './harasser-jump.mjs';
import {updateEwokSpear} from './ewok-spear.mjs';
import {tweenValue} from './skill-effects.mjs';

const ellipse=(p,x,y,r,k)=>((p.x-x)/r)**2+((p.y-y)/(r*k))**2<=1;
export const upperGuardRegion=p=>rules.upperRegions.some(([x,y,r,k])=>ellipse(p,x,y,r,k));
export const lowerGuardRegion=p=>rules.lowerRegions.some(([x,y,r,k])=>ellipse(p,x,y,r,k));
// These original actors have no player UI/melee target membership. Their
// source vis.bans=MELEE|RANGED and health.immune_to=ALL_TYPES remain declarations;
// do not turn them into ordinary reinforcement soldiers with expiry/respawn.
export function addGryphonGuards(w){
 if(w.id!==6)return;
 w.gryphonGuards=w.data.level.entities_list.filter(e=>e.template==='soldier_gryphon_guard_upper').map(source=>{
  const t=w.template(source.template);
  return{id:++w.serial,key:source.template,...source.pos,hp:t.health.hp_max,maxHp:t.health.hp_max,flip:false,actionAt:w.time,shooting:false,attackAt:t.ranged.attacks[0].ts,cooldown:t.ranged.attacks[0].cooldown,patchAt:w.time,pending:null};
 });
 for(const source of w.data.level.entities_list.filter(e=>e.template==='soldier_gryphon_guard_lower')){
  const t=w.template(source.template),a=w.template(t.auras.list[0].name);
  w.gryphonGuards.push({id:++w.serial,key:source.template,...a.hide_pos,hp:t.health.hp_max,maxHp:t.health.hp_max,flip:false,actionAt:w.time,shooting:false,attackAt:t.ranged.attacks[0].ts,cooldown:t.ranged.attacks[0].cooldown,pending:null,lower:{phase:'wave',tweenAt:-1,reverse:true,rally:{...a.hide_pos},center:{...a.hide_pos},disabled:!!t.ranged.attacks[0].disabled}});
 }
}
export function guardPose(w,u){const l=u.lower,keys=l?w.template(u.key).tween.props[0].keys:null;return{state:u.walking?'walk':u.shooting?'shoot':'idle',time:w.time-(u.walking?u.walkAt:u.actionAt),flip:u.flip,overrides:l?{'render.sprites[1].alpha':tweenValue(keys,l.reverse ? keys.at(-1)[0]-(w.time-l.tweenAt) : w.time-l.tweenAt)}:{}};}
function moveLower(w,u,show){
 const l=u.lower,a=w.template(w.template(u.key).auras.list[0].name);
 if(u.pending?.fired)u.attackAt=u.actionAt;
 u.pending=null;u.shooting=false;l.phase=show?'out':'back';l.rally={...(show?a.show_pos:a.hide_pos)};
 // Original controller uses this.show (nil), not this.show_pos, for center.
 l.center=show?a.show:{...a.hide_pos};l.reverse=!show;l.tweenAt=w.time;l.moveAt=w.time;u.walkAt=w.time;u.walking=true;u.flip=l.rally.x<u.x;
}
export function updateLowerGuard(w,u,dt){
 const l=u.lower,a=w.template(w.template(u.key).auras.list[0].name);
 if(l.phase==='wave'){if(w.wave<1)return false;l.phase='wait';l.until=w.time+a.hidden_min+w.random()*(a.hidden_max-a.hidden_min);return false;}
 if(l.phase==='wait'){if(w.time>=l.until){moveLower(w,u,true);return true;}return l.disabled;}
 if(l.phase==='out'||l.phase==='back'){
  // The aura yields after requesting rally and after each walk step. Arrival
  // becomes visible to its continuation on the following simulation tick.
  if(l.arrivedAt!==undefined){const show=l.phase==='out';delete l.arrivedAt;u.walking=false;if(show){l.phase='shown';l.lastShow=w.time;l.disabled=false;}else{l.phase='wait';l.until=w.time+a.hidden_min+w.random()*(a.hidden_max-a.hidden_min);}return true;}
  if(w.time===l.moveAt||u.stunned||u.frozen||u.hp<=0)return true;
  const dx=l.rally.x-u.x,dy=l.rally.y-u.y,d=Math.hypot(dx,dy),step=w.template(u.key).motion.max_speed*dt;
  if(d<=step){u.x=l.rally.x;u.y=l.rally.y;l.arrivedAt=w.time;u.walking=false;}else{u.x+=dx/d*step;u.y+=dy/d*step;}
  return true;
 }
 if(w.time-Math.max(u.attackAt,l.lastShow)>a.idle_time_to_hide){l.disabled=true;moveLower(w,u,false);return true;}
 return l.disabled;
}
export function launchGuardArrow(w,u,hit){
 const a=w.template(u.key).ranged.attacks[0],e=hit.target;
 if(!w.enemies.includes(e)||Math.hypot(e.x-hit.origin.x,e.y-hit.origin.y)>a.max_track_distance)return null;
 const b=w.template(a.bullet).bullet,o=a.bullet_start_offset[0],offset=w.template(e.key).unit?.hit_offset||{x:0,y:0},v=e.motionVelocity||{x:0,y:0};
 // scripts.arrow prediction_error: independently draw only moving axes. Original
 // errors are positive x / negative y, not centered noise or a homing update.
 const ex=b.prediction_error&&v.x!==0?w.random()*10:0,ey=b.prediction_error&&v.y!==0?w.random()*-10:0;
 const sx=u.x+(u.flip?-1:1)*o.x,sy=u.y+o.y,tx=e.x+offset.x+v.x*b.flight_time+ex,ty=e.y+offset.y+v.y*b.flight_time+ey;
 const shot={id:++w.serial,type:'gryphon-arrow',bullet:a.bullet,source:u.id,target:e,sx,sy,x:sx,y:sy,tx,ty,elapsed:0,duration:b.flight_time,g:b.g,rotation:0,insertedAt:w.time,velocity:{x:(tx-sx)/b.flight_time,y:(ty-sy-.5*b.g*b.flight_time*b.flight_time)/b.flight_time}};
 w.shots.push(shot);w.emit('arrow');return shot;
}
export const updateGuardArrow=updateEwokSpear;
const nodesToGoal=(w,e)=>{const route=w.routes[e.road]?.[e.lane];if(!route)return Infinity;const ni=route.lengths.findIndex(d=>d>=e.d);return (harasserPathBounds(w,e.road)?.end||route.points.length)-(ni<0?route.points.length:ni+1);};
export function updateGryphonGuards(w,live,dt=1/30){
 for(const u of w.gryphonGuards||[]){
  const t=w.template(u.key),a=t.ranged.attacks[0],aura=w.template(t.auras.list[0].name);
  if(u.lower){if(updateLowerGuard(w,u,dt))continue;}
  else if(w.time>=u.patchAt){u.cooldown=aura.patch_cooldown_min+w.random()*(aura.patch_cooldown_max-aura.patch_cooldown_min);u.patchAt=w.time+u.cooldown+1/30;}
  if(u.pending){
   if(u.stunned||u.frozen||u.hp<=0){if(u.pending.fired)u.attackAt=u.actionAt;u.pending=null;u.shooting=false;continue;}
   if(!u.pending.released&&w.time-u.actionAt>=a.shoot_time){u.pending.released=true;u.pending.fired=!!launchGuardArrow(w,u,u.pending);}
   if(w.time-u.actionAt>=w.animationDuration(t.render.sprites[0].prefix,a.animation)){
    if(u.pending.fired)u.attackAt=u.actionAt;u.pending=null;u.shooting=false;
   }
   continue;
  }
  if(u.hp<=0||u.stunned||u.frozen||w.time-u.attackAt<u.cooldown)continue;
  const target=live.filter(e=>e.hp>0&&!harasserHidden(e)&&!((e.visBans??w.template(e.key).vis?.bans??0)&a.vis_flags)&&!((e.visFlags??w.template(e.key).vis?.flags??0)&a.vis_bans)&&(u.lower?lowerGuardRegion(e):upperGuardRegion(e))&&ellipse(e,u.x,u.y,a.max_range,.7)&&!ellipse(e,u.x,u.y,a.min_range,.7)).sort((a,b)=>nodesToGoal(w,a)-nodesToGoal(w,b))[0];
  if(!target||w.random()>a.chance)continue;
  u.flip=target.x<u.x;u.actionAt=w.time;u.shooting=true;u.pending={target,origin:{x:target.x,y:target.y},released:false};
 }
}
