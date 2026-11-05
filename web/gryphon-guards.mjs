import rules from './gryphon-guard-data.mjs';
import {harasserPathBounds,harasserHidden} from './harasser-jump.mjs';
import {updateEwokSpear} from './ewok-spear.mjs';

const ellipse=(p,x,y,r,k)=>((p.x-x)/r)**2+((p.y-y)/(r*k))**2<=1;
export const upperGuardRegion=p=>rules.upperRegions.some(([x,y,r,k])=>ellipse(p,x,y,r,k));
// These stationary original actors have no UI/melee target membership. Their
// source vis.bans=MELEE|RANGED and health.immune_to=ALL_TYPES remain declarations;
// do not turn them into ordinary reinforcement soldiers with expiry/respawn.
export function addGryphonGuards(w){
 if(w.id!==6)return;
 w.gryphonGuards=w.data.level.entities_list.filter(e=>e.template==='soldier_gryphon_guard_upper').map(source=>{
  const t=w.template(source.template);
  return{id:++w.serial,key:source.template,...source.pos,hp:t.health.hp_max,maxHp:t.health.hp_max,flip:false,actionAt:w.time,shooting:false,attackAt:t.ranged.attacks[0].ts,cooldown:t.ranged.attacks[0].cooldown,patchAt:w.time,pending:null};
 });
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
export function updateGryphonGuards(w,live){
 for(const u of w.gryphonGuards||[]){
  const t=w.template(u.key),a=t.ranged.attacks[0],aura=w.template(t.auras.list[0].name);
  if(w.time>=u.patchAt){u.cooldown=aura.patch_cooldown_min+w.random()*(aura.patch_cooldown_max-aura.patch_cooldown_min);u.patchAt=w.time+u.cooldown+1/30;}
  if(u.pending){
   if(u.stunned||u.frozen||u.hp<=0){if(u.pending.fired)u.attackAt=u.actionAt;u.pending=null;u.shooting=false;continue;}
   if(!u.pending.released&&w.time-u.actionAt>=a.shoot_time){u.pending.released=true;u.pending.fired=!!launchGuardArrow(w,u,u.pending);}
   if(w.time-u.actionAt>=w.animationDuration(t.render.sprites[0].prefix,a.animation)){
    if(u.pending.fired)u.attackAt=u.actionAt;u.pending=null;u.shooting=false;
   }
   continue;
  }
  if(u.hp<=0||u.stunned||u.frozen||w.time-u.attackAt<u.cooldown)continue;
  const target=live.filter(e=>e.hp>0&&!harasserHidden(e)&&!((e.visBans??w.template(e.key).vis?.bans??0)&a.vis_flags)&&!((e.visFlags??w.template(e.key).vis?.flags??0)&a.vis_bans)&&upperGuardRegion(e)&&ellipse(e,u.x,u.y,a.max_range,.7)&&!ellipse(e,u.x,u.y,a.min_range,.7)).sort((a,b)=>nodesToGoal(w,a)-nodesToGoal(w,b))[0];
  if(!target||w.random()>a.chance)continue;
  u.flip=target.x<u.x;u.actionAt=w.time;u.shooting=true;u.pending={target,origin:{x:target.x,y:target.y},released:false};
 }
}
