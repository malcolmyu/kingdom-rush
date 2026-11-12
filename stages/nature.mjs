// Stage7-only adapter for the original nature shooter and bear controller.
import{tryHarasserDodge,harasserHidden}from'../harasser-jump.mjs';
const BEAR='soldier_druid_bear',SHOOTER='druid_shooter_nature';
import{tweenValue}from'../skill-effects.mjs';
import{spriteOrder}from'../render-order.mjs';
const state=w=>w.druidNature??={shooters:[],pending:[],damage:[],fx:[],count:0};
const length=(w,key,name)=>w.animationDuration(key,name);
const present=(w,s)=>w.slots.includes(s)&&!!s.druid;
const ellipse=(a,b,r)=>((a.x-b.x)/r)**2+((a.y-b.y)/(.7*r))**2<=1;
function formation(w,q,i){const s=q.owner,n=q.capacity;if(n===1)return{...s.rally};const angle=2*Math.PI*i/n-Math.PI/2+q.angle,r=w.template(s.key).barrack.rally_radius;return{x:s.rally.x+r*Math.cos(angle),y:s.rally.y+.7*r*Math.sin(angle)};}
function reform(w,q){for(const[i,u]of q.soldiers.entries())if(u&&!u.queued){u.rally=formation(w,q,i);u.nature.rallyNew=true;u.pendingHit=null;}}
export function syncNature(w,s){const p=s.druid.powers?.nature;if(!p?.changed)return;p.changed=false;const a=state(w);let q=a.shooters.find(x=>x.owner===s);if(!q){q={owner:s,at:w.time,angle:null,capacity:p.level,soldiers:[],cast:null,scan:null};a.shooters.push(q);}else q.capacity=p.level;}
export function natureRally(w,s,p){if(!s?.druid)return undefined;if(!s.druid.powers?.nature?.level||!w.active(true))return false;const v=w.nearestRoad(p),raw=w.template(s.key).barrack;if(Math.hypot(v.x-p.x,v.y-p.y)>45||Math.hypot(v.x-s.x,v.y-s.y)>raw.rally_range)return false;s.rally={x:v.x,y:v.y};const q=state(w).shooters.find(q=>q.owner===s);if(q)q.rallyRequested=true;w.emit('barrack');return true;}
export function removeNature(w,s){const q=w.druidNature;if(!q)return;q.shooters=q.shooters.filter(x=>x.owner!==s);q.pending=q.pending.filter(x=>x.owner!==s);q.count=w.soldiers.filter(u=>u.nature&&u.home!==s.id).length;}
function effects(w,u,birth){for(const suffix of['decal','effect','rune']){const key='fx_druid_bear_'+(birth?'spawn_':'death_')+suffix,offset=suffix==='decal'?(birth?-3:3):-6;state(w).fx.push({id:++w.serial,key,x:u.x+offset*(u.flip?-1:1),y:u.y,flip:u.flip,at:w.time,queuedAt:w.time});}}
export function updateNature(w){const a=w.druidNature;if(!a)return;
 const damage=a.damage;a.damage=[];for(const d of damage){if(d.at>=w.time){a.damage.push(d);continue;}const h=w.template(d.target.key).health;if(w.enemies.includes(d.target)&&d.target.hp>0&&!h.ignore_damage&&!((h.immune_to||0)&2))w.hurt(d.target,Math.round(d.value*(h.damage_factor??1)),2);}
 const pending=a.pending;a.pending=[];for(const p of pending){if(p.at>=w.time){a.pending.push(p);continue;}if(!present(w,p.owner))continue;const u=w.addSoldier(p.pos,p.index,p.owner.id,BEAR);u.nature={phase:'spawn',at:w.time,last:w.time,regenAt:w.time,stance:false,rallyNew:true};w.number(1,w.template(BEAR).info.random_name_count);p.q.soldiers[p.index]=u;a.count++;effects(w,u,true);}
 for(const q of a.shooters){if(q.at>=w.time||!present(w,q.owner))continue;if(q.angle===null)q.angle=Math.PI/4+w.random()*(2*Math.PI/5-Math.PI/4);const s=q.owner;
  if(q.cast){if(w.time-q.cast.at<w.template(SHOOTER).attacks.list[0].spawn_time)continue;const index=q.cast.index,pos=formation(w,q,index);a.pending.push({q,owner:s,index,pos,at:w.time});q.soldiers[index]={queued:true};q.cast=null;q.scan.spawned=true;}
  if(!q.scan){if(s.blocked||(s.canDoMagic??w.template(s.key).tower.can_do_magic)===false)continue;q.scan={index:0,max:q.capacity,spawned:false};}
  while(q.scan.index<q.scan.max){const i=q.scan.index++,old=q.soldiers[i];if(old?.queued||old&&w.soldiers.includes(old))continue;q.cast={index:i,at:w.time};q.visualAt=w.time;break;}
  if(!q.cast){if(q.scan.spawned)reform(w,q);q.scan=null;if(q.rallyRequested){q.rallyRequested=false;q.angle=Math.PI/4+w.random()*(2*Math.PI/5-Math.PI/4);reform(w,q);}}
 }
 a.fx=a.fx.filter(f=>w.time-f.at<fxDuration(w,f.key));
}
function animate(w,u,phase){u.nature.phase=phase;u.nature.at=w.time;u.walking=false;}
function move(w,u,p,dt){const d=Math.hypot(p.x-u.x,p.y-u.y);if(d<=2){u.walking=false;return false;}if(!u.walking)u.walkAt=w.time;u.walking=true;u.flip=p.x<u.x;const v=Math.min(d,u.speed*dt);u.x+=(p.x-u.x)/d*v;u.y+=(p.y-u.y)/d*v;return true;}
export function updateBear(w,u,dt,live,{blockers,engaged,enemyTurns}){if(!u.nature)return false;const n=u.nature,t=w.template(BEAR),age=w.time-n.at;
 if(n.phase==='spawn'&&age<length(w,BEAR,'spawn'))return true;
 if(u.hp<=0){if(n.phase!=='death'){animate(w,u,'death');u.pendingHit=null;u.targetId=null;n.deadAt=Number.isFinite(u.lastHitAt)?u.lastHitAt:w.time;effects(w,u,false);}u.dead=w.time-n.deadAt;if(u.dead>t.health.dead_lifetime&&!u.expired){u.expired=true;state(w).count--;}return true;}
 if(n.phase==='spawn'){if(age<length(w,BEAR,'spawn'))return true;animate(w,u,'idle');}
 if(w.data.stageRuntime?.defender?.(w,u,dt)||u.stunned||u.frozen){u.pendingHit=null;return true;}
 if(['idle2stance','stance2idle','attack'].includes(n.phase)){
  if(n.phase==='attack'&&!n.hit&&age>=t.melee.attacks[0].hit_time){n.hit=true;const e=u.pendingHit?.target;if(e&&w.enemies.includes(e)&&e.hp>0&&Math.hypot(u.x-w.meleePosition(u,e,0).x,u.y-w.meleePosition(u,e,0).y)<4&&!tryHarasserDodge(w,e,{damageType:2})){const a=t.melee.attacks[0];state(w).damage.push({target:e,value:Math.ceil(a.damage_min+w.random()*(a.damage_max-a.damage_min)),at:w.time});w.emit('melee');}u.pendingHit=null;}
  const e=live.find(e=>e.id===u.targetId);if(e&&Math.hypot(u.x-w.meleePosition(u,e,0).x,u.y-w.meleePosition(u,e,0).y)<4){blockers.add(e.id);engaged.set(e.id,(engaged.get(e.id)||0)+1);if(!enemyTurns.has(e.id)){enemyTurns.add(e.id);w.enemyMelee(e,u,dt);}}
  if(age<length(w,BEAR,n.phase))return true;animate(w,u,'idle');
 }
 if(n.rallyNew){u.pendingHit=null;u.targetId=null;n.rallyNew=false;}
 const targets=live.filter(e=>e.hp>0&&!e.flying&&!harasserHidden(e)&&!w.hyenaFleeing(e)&&(engaged.get(e.id)||0)<3&&ellipse(u.rally,e,t.melee.range));const e=targets.find(e=>e.id===u.targetId)||targets.sort((a,b)=>Math.hypot(a.x-u.x,a.y-u.y)-Math.hypot(b.x-u.x,b.y-u.y))[0];
 if(e){u.targetId=e.id;const index=engaged.get(e.id)||0;engaged.set(e.id,index+1);const dest=w.meleePosition(u,e,index);if(move(w,u,dest,dt))return true;blockers.add(e.id);if(!enemyTurns.has(e.id)){enemyTurns.add(e.id);w.enemyMelee(e,u,dt);}if(!n.stance){n.stance=true;animate(w,u,'idle2stance');return true;}if(w.time-n.last>=t.melee.attacks[0].cooldown){w.random();n.last=w.time;n.hit=false;u.pendingHit={target:e};u.flip=e.x<u.x;animate(w,u,'attack');}return true;}
 u.targetId=null;if(n.stance){n.stance=false;animate(w,u,'stance2idle');return true;}if(move(w,u,u.rally,dt))return true;if(w.time-u.lastHitAt>t.regen.last_hit_standoff_time&&w.time-n.regenAt>=t.regen.cooldown){u.hp=Math.min(u.maxHp,u.hp+t.regen.health);n.regenAt=w.time;}return true;
}
export function bearPose(w,u){const n=u.nature;return{state:u.hp<=0?'death':u.walking?'walk':n.phase,time:u.walking?w.time-u.walkAt:w.time-n.at,flip:u.flip};}
export const natureHealthHidden=u=>u.nature?u.nature.phase==='spawn'||u.hp<=0:undefined;
export const natureHidden=(w,u)=>!!u.nature&&u.hp<=0&&w.time-u.nature.at>=length(w,BEAR,'death');
export function drawNature(r,w){const q=w.druidNature;if(!q)return;for(const s of q.shooters){if(s.angle===null)continue;const age=w.time-(s.visualAt??-100),cast=age<length(w,SHOOTER,'cast');r.entity(SHOOTER,s.owner,{state:cast?'cast':'idle',time:cast?age:0});}for(const f of q.fx)if(f.queuedAt<w.time)drawEffect(r,w,f);}

function fxDuration(w,key){const t=w.template(key),s=t.render.sprites[0];if(t.tween?.remove)return Math.max(...t.tween.props.map(p=>p.keys.at(-1)[0]-(p.time_offset||0)));const a=w.data.animations[s.prefix?s.prefix+'_'+s.name:s.name];return(a.frames?.length||a.to-a.from+1)/30-(s.time_offset||0);}
function drawEffect(r,w,f){const t=w.template(f.key),s=t.render.sprites[0],age=w.time-f.at,animationAge=age+(s.time_offset||0);if(animationAge<0)return;let alpha=s.alpha/255,scale={x:1,y:1},offset={...s.offset};for(const p of t.tween?.props||[]){const elapsed=Math.max(0,age+(p.time_offset||0));if(p.name==='alpha')alpha=tweenValue(p.keys,elapsed)/255;else if(p.name==='scale'||p.name==='offset'){const value={};for(const axis of['x','y'])value[axis]=tweenValue(p.keys.map(([ts,v])=>[ts,v[axis]]),elapsed);if(p.name==='scale')scale=value;else offset=value;}}const key=r.frame(s.prefix?s.prefix+'_'+s.name:s.name,animationAge,false),pos=r.screen({x:f.x+offset.x,y:f.y+offset.y}),draw=()=>{const c=r.ctx;c.save();c.translate(pos.x,pos.y);c.scale(scale.x,scale.y);r.sprite(c,key,0,0,1,s.anchor.x,1-s.anchor.y,f.flip,alpha);c.restore();};r.orderQueue?r.orderQueue.add(spriteOrder(s,f,1,f.id),draw):draw();}
