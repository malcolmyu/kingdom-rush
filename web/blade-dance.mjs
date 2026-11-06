import DATA from'./blade-dance-data.mjs';
import{inEllipse}from'./spells.mjs';
import{harasserPathBounds}from'./harasser-jump.mjs';
export function bladeDanceTargets(w,u){const a=u.blade.danceAttack||w.template(u.key).timed_attacks.list[0];return w.enemies.filter(e=>{const v=w.template(e.key).vis||{},r=w.routes[e.road]?.[e.lane],b=harasserPathBounds(w,e.road);if(!r||!b||e.hp<=0||e.leaked||e.pendingRemoval||e.removed||((e.visBans??v.bans??0)&a.vis_flags)||((e.visFlags??v.flags??0)&a.vis_bans)||!inEllipse(u,e,a.max_range))return false;let node=0;while(node+1<r.lengths.length&&r.lengths[node+1]<=e.d)node++;return node>=b.start-1&&node<=b.visibleEnd-1&&w.data.active?.[e.road]!==false&&!Object.values(w.data.level.invalid_path_ranges||{}).some(x=>x.path_id===e.road+1&&node+1>=x.from&&node+1<=x.to);});}
export function bladeDanceSlot(w,u,e){const a=w.template(e.key).enemy.melee_slot,o=w.template(u.key).soldier.melee_slot_offset,flip=Math.abs(e.headingAngle??Math.atan2(e.dy||0,e.dx??1))<Math.PI/2;return{x:e.x+(a.x+o.x)*(flip?1:-1),y:e.y+a.y+o.y,flip};}
function release(d){if(d.counted){d.target.bladeDanceStunCount=Math.max(0,(d.target.bladeDanceStunCount||0)-1);d.counted=false;}}
export function cancelBladeDance(u){const d=u.blade?.dance;if(!d)return;release(d);if(d.hadBans)u.visBans=d.bans;else delete u.visBans;Object.assign(u,d.origin);u.blade.dance=null;}
function returnHome(w,u,d){Object.assign(u,d.origin);d.phase='in';d.animation='dance_in';d.at=w.time;}
function nextHit(w,u,d){if(d.index>=u.blade.danceAttack.hits){returnHome(w,u,d);return;}let targets=bladeDanceTargets(w,u).filter(e=>!d.visited.includes(e));if(!targets.length&&d.visited.length){d.visited=[];targets=bladeDanceTargets(w,u);}if(!targets.length){returnHome(w,u,d);return;}
 d.index++;const e=targets[(d.index-1)%targets.length];d.visited.push(e);d.target=e;d.counted=!w.template(e.key).unit.ignore_stun&&!e.ignoreStun;if(d.counted)e.bladeDanceStunCount=(e.bladeDanceStunCount||0)+1;
 const p=bladeDanceSlot(w,u,e);u.x=p.x;u.y=p.y;u.flip=p.flip;d.phase='hit';d.animation=DATA.animations[w.number(1,DATA.animations.length)-1];d.at=w.time;d.hit=false;w.emit('blade_dance_hit');
}
export function updateBladeDance(w,u){const s=u.blade,a=s.danceAttack;let d=s.dance;
 if(!d){if(!a||a.disabled||w.time-a.at<=a.cooldown)return false;if(bladeDanceTargets(w,u).length<a.min_count){a.at=w.time-a.cooldown+DATA.retry-1e-6;return false;}a.at=w.time;d=s.dance={phase:'out',animation:'dance_out',at:w.time,index:0,visited:[],origin:{x:u.x,y:u.y},hadBans:u.visBans!==undefined,bans:u.visBans};u.visBans=DATA.all;u.walking=false;u.anim=0;w.emit('blade_dance');return true;}
 if(d.phase==='out'){if(w.time-d.at>=w.animationDuration(u.key,d.animation))nextHit(w,u,d);return true;}
 if(d.phase==='in'){if(w.time-d.at>=w.animationDuration(u.key,d.animation)){if(d.hadBans)u.visBans=d.bans;else delete u.visBans;s.dance=null;u.action='idle';u.idleAt=w.time;}return true;}
 if(!d.hit&&w.time-d.at>=a.hit_time){d.hit=true;const damage=Math.ceil(a.damage_min+w.random()*(a.damage_max-a.damage_min));if(w.enemies.includes(d.target))w.hurt(d.target,damage,a.damage_type);}
 if(d.hit&&w.time-d.at>=w.animationDuration(u.key,d.animation)){release(d);nextHit(w,u,d);}return true;
}
export function bladeDancePose(w,u){const d=u.blade.dance;return{state:d.animation,time:w.time-d.at,flip:u.flip};}
