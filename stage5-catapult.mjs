import DATA from'./stage5-catapult-data.mjs';
import{inEllipse}from'./spells.mjs';import{isEnemyStunned}from'./enemy-status.mjs';
export const stage5CatapultTemplates=DATA.templates;
const C=DATA.rules,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function initStage5Catapults(w){if(w.id!==5)return;w.templates={...w.templates,...DATA.templates};w.catapultController={index:0,at:null,queue:[],schedule:Array.isArray(C[w.mode])?C[w.mode]:[]};w.catapultImpacts=[];}
export function insertCatapult(w,e,config){if(e.key!=='enemy_catapult')return;e.catapult={phase:'enter',travel:true,node:0,dir:1,stop:(config?.stop??40)-1,duration:config?.duration??0,attackAt:w.time,at:w.time,healthHidden:true,bans:w.template(e.key).vis.bans};e.visBans=C.flags.all;e.ranged.damage=[w.template(e.ranged.bullet).bullet.damage_min,w.template(e.ranged.bullet).bullet.damage_max];}
export function updateStage5Catapults(w){const s=w.catapultController;if(!s)return;
 const queue=s.queue;s.queue=[];for(const p of queue){const e=w.spawn({key:'enemy_catapult',road:p.path_id-1,lane:1});Object.assign(e.catapult,{duration:p.leave-p.enter,stop:C.stops[String(p.path_id)]-1,insertedAt:w.time});}
 w.catapultImpacts=w.catapultImpacts.filter(f=>w.time-f.at<2.5);
 if(w.wave<1||w.status!=='playing')return;
 if(s.at===null)s.at=w.time;
 // World's last-spawn gate adapts the source waves_finished scheduler.
 if(w.wave===w.totalWaves&&!w.pending.length&&w.time>=w.nextWaveReadyAt){s.index=s.schedule.length;return;}
 while(s.index<s.schedule.length){const p=s.schedule[s.index];if(w.wave<p.wave){s.at=w.time;return;}if(w.time-s.at<p.enter){if(w.wave!==p.wave){s.index++;continue;}return;}s.queue.push(p);s.index++;}
}
export function catapultBusy(w){return!!w.catapultController?.queue.length;}
function unblock(w,e){for(const u of[...w.soldiers,...(w.stageHeroes||[]),w.hero].filter(Boolean)){if(u.targetId===e.id)u.targetId=null;if(u.combatTarget===e.id)u.combatTarget=null;if(u.pendingHit?.target===e&&!u.pendingHit.ranged)u.pendingHit=null;}e.blocked=false;e.pendingMelee=null;}
function animate(w,e,name){e.action=name;e.actionAt=w.time;e.actionFlip=e.dx<0;e.anim=name==='shoot'?w.animationDuration('catapult',name):0;e.catapult.at=w.time;}
function walk(w,e,dt){const s=e.catapult,p=w.routes[e.road][e.lane].points;let dest=p[s.node+s.dir];if(!dest||Math.hypot(dest.x-e.x,dest.y-e.y)<2*e.speed*dt){s.node+=s.dir;if(s.node<0||s.node>=p.length)return false;dest=p[s.node+s.dir];}if(!dest)return false;const dx=dest.x-e.x,dy=dest.y-e.y,n=Math.hypot(dx,dy),v=Math.min(n,e.speed*dt);e.dx=dx;e.dy=dy;if(n){e.x+=dx/n*v;e.y+=dy/n*v;}e.d=w.routes[e.road][e.lane].lengths[clamp(s.node,0,p.length-1)];return true;}
export function catapultTargets(w,e){const a=w.template(e.key).ranged.attacks[0];return[...w.enemies,...w.soldiers,w.hero,...w.gryphonGuards||[]].filter(Boolean).filter(u=>{const v=w.template(u.key).vis||{};return u.hp>0&&!u.pendingRemoval&&!u.leaked&&!((u.visFlags??v.flags??0)&a.vis_bans)&&!((u.visBans??v.bans??0)&a.vis_flags)&&u.x<a.max_x&&u.y>a.min_x;});}
export function updateCatapult(w,e,dt){const s=e.catapult;if(!s)return false;if(s.insertedAt===w.time)return true;
 if(s.travel){unblock(w,e);const moving=walk(w,e,dt);if(!moving||s.phase==='enter'&&s.node===s.stop){if(s.phase==='leave'){e.removed=true;return true;}s.phase='hold';s.travel=false;s.healthHidden=false;e.visBans=s.bans;s.startedAt=undefined;animate(w,e,'idle');}else if(e.action!=='running')animate(w,e,'running');return true;}
 if(s.startedAt===undefined){s.startedAt=w.time;s.attackAt=w.time;return true;}
 const a=w.template(e.key).ranged.attacks[0];
 if(s.attack){if(isEnemyStunned(e)||e.frozen){s.attack=null;return true;}if(!s.attack.fired&&w.time-s.attack.at>=a.shoot_time){s.attack.fired=true;launchCatapultRock(w,e,s.attack.target,a);}if(w.time-s.attack.at>=w.animationDuration('catapult','shoot')){s.attack=null;animate(w,e,'idle');}return true;}
 if(w.time-s.startedAt>s.duration){s.phase='leave';s.travel=true;s.healthHidden=true;s.dir=-1;e.visBans=C.flags.all;unblock(w,e);animate(w,e,'running');return true;}
 if(w.time-s.attackAt>a.cooldown){const targets=catapultTargets(w,e);if(targets.length){const target=targets[w.number(0,targets.length-1)];s.attackAt=w.time;if(w.random()<a.chance){s.attack={at:w.time,target,fired:false};e.dx=target.x-e.x;e.dy=target.y-e.y;animate(w,e,'shoot');}}}return true;
}
export function launchCatapultRock(w,e,target,a=w.template(e.key).ranged.attacks[0]){const vis=w.template(target.key).vis||{};if(((target.visBans??vis.bans??0)&a.vis_flags)||((target.visFlags??vis.flags??0)&a.vis_bans))return null;
 const t=w.template(a.bullet).bullet,offset=w.template(target.key).unit.hit_offset,o=a.bullet_start_offset[0],sx=e.x+(e.actionFlip?-1:1)*o.x,sy=e.y+o.y,tx=target.x+offset.x,ty=target.y+offset.y,duration=t.flight_time_base+Math.hypot(tx-sx,ty-sy)*t.flight_time_factor;
 const b={id:++w.serial,type:'catapult-rock',bullet:a.bullet,source:e.id,target,sx,sy,tx,ty,x:sx,y:sy,elapsed:0,duration,g:t.g,insertedAt:w.time,rotation:(w.random()-.5)*Math.PI,velocity:{x:(tx-sx)/duration,y:(ty-sy-.5*t.g*duration*duration)/duration}};w.shots.push(b);return b;
}
export function catapultFalloff(p,origin,r){const dx=p.x-origin.x,dy=p.y-origin.y,a=Math.atan2(dy,dx);return clamp(Math.hypot(dx,dy)/Math.hypot(r*Math.cos(a),r*.7*Math.sin(a)),0,1);}
export function updateCatapultRock(w,b,dt){if(b.insertedAt===w.time)return;const t=w.template(b.bullet).bullet;b.elapsed=w.time-b.insertedAt;b.x=b.sx+b.velocity.x*b.elapsed;b.y=b.sy+b.velocity.y*b.elapsed+.5*b.g*b.elapsed*b.elapsed;b.rotation+=t.rotation_speed*dt;if(b.elapsed+dt<b.duration)return;b.done=true;
 const units=[...w.enemies,...w.soldiers,w.hero,...w.gryphonGuards||[]].filter(Boolean),present=units.includes(b.target),flying=present&&((b.target.visFlags??w.template(b.target.key).vis.flags)&C.flags.flying);
 const targets=flying?[b.target]:units.filter(u=>{const v=w.template(u.key).vis;return u.hp>0&&!u.leaked&&!((u.visFlags??v.flags)&t.damage_bans)&&!((u.visBans??v.bans)&t.damage_flags)&&inEllipse(u,{x:b.tx,y:b.ty},t.damage_radius);});
 for(const u of targets){const damage=Math.floor(t.damage_max-(t.damage_max-t.damage_min)*catapultFalloff(u,b,t.damage_radius));if(w.enemies.includes(u))w.hurt(u,damage,t.damage_type);else w.hurtDefender(u,damage,t.damage_type);}
 w.catapultImpacts.push({id:++w.serial,at:w.time,x:b.tx,y:b.ty,fx:t.hit_fx,decal:t.hit_decal});
}
export function catapultPose(w,e){return{state:e.hp<=0?'death':e.action||'idle',time:e.hp<=0?w.time-e.deadAt:w.time-(e.actionAt||0),flip:e.hp<=0?e.deathFlip:e.actionFlip??e.dx<0};}
export function drawCatapultImpacts(r,w){for(const f of w.catapultImpacts||[]){const age=w.time-f.at;const sprite=w.template(f.fx).render.sprites[0],animation=w.data.animations[(sprite.prefix?sprite.prefix+'_':'')+sprite.name],duration=animation?(animation.frames?.length||animation.ranges?.reduce((n,[a,b])=>n+b-a+1,0)||animation.to-animation.from+1)/30:0;if(age<duration)r.entity(f.fx,f,{time:age,renderId:r.renderId(f)});if(age<2.5)r.entity(f.decal,f,{alpha:age<=1?1:1-(age-1)/1.5,renderId:r.renderId(f)});}}
