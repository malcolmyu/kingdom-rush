import C from'./carrier-data.mjs';
import{enemyDirection}from'./enemy-direction.mjs';
const KEY='enemy_perython_gnoll_gnawer';
export function carrierNodeAt(route,d){let lo=0,hi=route.lengths.length-1;while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(route.lengths[mid]<=d)lo=mid;else hi=mid-1;}return lo;}
export function insertCarrier(w,e){
 if(e.key!==KEY)return;
 const t=w.template(e.key);e.carrier={carrying:true,hiddenPayload:false,hiddenAll:false,node:0,road:e.road,lane:e.lane,checkedAt:w.time,firstCheck:true,spawnAt:w.time,delay:t.drop_delay?t.drop_delay[0]+w.random()*(t.drop_delay[1]-t.drop_delay[0]):0,quantity:t.death_spawns.quantity,damageTypes:0};
 updateFacing(w,e);
}
function updateFacing(w,e){e.carrier.facing=enemyDirection(e.dx,e.dy,e.carrier.facing,w.template(e.key).render.sprites[0].angles_stickiness?.walk||0);}
function queuePayload(w,e){
 const s=e.carrier,t=w.template(e.key),route=w.routes[e.road][e.lane],node=s.node+2,targetNode=node+1;
 // Current 4–6 carrier paths have no path connections. Original insert fails
 // when next_entity_node has no target, rather than teleporting to a clamped end.
 if(s.quantity>0&&targetNode<route.points.length){(w.carrierSpawns??=[]).push({key:t.death_spawns.name,road:e.road,lane:e.lane,payload:{origin:{x:e.x+(t.death_spawns.offset?.x||0),y:e.y+(t.death_spawns.offset?.y||0)},node,targetNode,flip:s.facing.flip}});}
 s.carrying=false;s.quantity=0;
}
export function flushCarrierSpawns(w){if(!w.carrierSpawns?.length)return;for(const p of w.carrierSpawns.splice(0))w.spawn(p);}
export function placePayload(w,e,p){
 if(!p)return;const route=w.routes[e.road][e.lane];e.d=route.lengths[p.node];e.x=p.origin.x;e.y=p.origin.y;e.payloadJoin={node:p.node,targetNode:p.targetNode};e.payloadSourceFlip=p.flip;e.walkAt=w.time;e.payloadBornAt=w.time;
}
export function movePayload(w,e,dt){
 if(!e.payloadJoin)return false;
 if(e.blocked||e.stunned)return true;
 const route=w.routes[e.road][e.lane],to=route.points[e.payloadJoin.targetNode],dx=to.x-e.x,dy=to.y-e.y,length=Math.hypot(dx,dy),step=Math.min(length,e.speed*(e.slowUntil>w.time?.5:1)*dt);
 e.dx=dx;e.dy=dy;if(length){e.x+=dx/length*step;e.y+=dy/length*step;}
 if(step>=length){e.d=route.lengths[e.payloadJoin.targetNode];e.x=to.x;e.y=to.y;delete e.payloadJoin;}
 return true;
}
export function updateCarrier(w,e,dt){
 const s=e.carrier;if(!s||e.hp<=0||e.leaked)return false;
 if(s.hidePayloadAt!==undefined&&w.time>s.hidePayloadAt)s.hiddenPayload=true;
 updateFacing(w,e);
 const modifiers=e.modifierTypes||[];
 const forced=e.stunned&&!modifiers.includes(C.teleport)&&!modifiers.includes(C.timelapse);
 let ready=false;
 if(s.carrying&&(forced||!e.stunned&&(s.firstCheck||w.time-s.checkedAt>=s.delay))){
  s.firstCheck=false;s.checkedAt=w.time;const radius=w.template(e.key).spawn_trigger_range;
  ready=forced||[...w.soldiers,w.hero].filter(Boolean).some(u=>{const flags=u.visFlags??w.template(u.key).vis?.flags??0;return u.hp>0&&!u.flying&&!(flags&C.flying)&&((u.x-e.x)**2+((u.y-e.y)/.7)**2<=radius*radius);});
 }
 if(ready){queuePayload(w,e);s.hidePayloadAt=w.time;return true;}
 if(e.stunned)return true;
 const route=w.routes[e.road][e.lane];if(s.road!==e.road||s.lane!==e.lane){s.road=e.road;s.lane=e.lane;s.node=carrierNodeAt(route,e.d);}
 const next=route.points[s.node+1];if(next&&Math.hypot(next.x-e.x,next.y-e.y)<2*e.speed*dt)s.node++;
 return false;
}
export function carrierDamage(w,e,type){
 if(!e.carrier)return;const s=e.carrier;s.damageTypes=s.damageAt===w.time?s.damageTypes|type:type;s.damageAt=w.time;
}
export function carrierDied(w,e){
 const s=e.carrier;if(!s)return;const t=w.template(e.key),d=t.death_spawns;
 e.deathFlip=s.facing.flip;s.suppressed=!!(s.damageTypes&(C.eat|C.noSpawns|(d.no_spawn_damage_types||0)));s.instantHidden=!!(s.damageTypes&C.eat)||!!(s.damageTypes&C.disintegrate)&&!!t.unit.can_disintegrate;
 const duration=w.animationDuration(t.render.sprites[0].prefix,'death');s.deathDuration=duration;s.deathDue=w.time+(d.concurrent_with_death||s.instantHidden?0:d.delay??duration);if(s.instantHidden)s.hiddenAll=true;
 if(d.concurrent_with_death)s.hiddenPayload=true;
}
export function finishCarrierDeaths(w){
 for(const e of w.enemies){const s=e.carrier;if(!s||e.hp>0||e.leaked)continue;
  if(s.hideAllAt!==undefined&&w.time>s.hideAllAt)s.hiddenAll=true;
  if(!s.deathHandled&&w.time>=s.deathDue){s.deathHandled=true;if(!s.suppressed){if(s.carrying)queuePayload(w,e);s.hideAllAt=Math.max(w.time,e.deadAt+s.deathDuration);}else if(w.time-e.deadAt>=s.deathDuration)s.hiddenAll=true;}
  if(s.suppressed&&w.time-e.deadAt>=s.deathDuration)s.hiddenAll=true;
 }
}
export function carrierBusy(w){return !!w.carrierSpawns?.length||w.enemies.some(e=>e.carrier&&!e.leaked&&e.hp<=0&&!e.carrier.suppressed&&e.carrier.carrying&&!e.carrier.deathHandled);}
