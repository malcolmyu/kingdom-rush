import{isEnemyStunned}from'../enemy-status.mjs';
import{inEllipse}from'../spells.mjs';
import{tryBladeDodge}from'../blade-dodge.mjs';
import{tryEwokDodge}from'../ewok-shield.mjs';
import{spriteOrder}from'../render-order.mjs';
const defenders=w=>[...w.soldiers,...(w.stageHeroes||[]),w.hero].filter(Boolean);
const present=(w,u)=>defenders(w).includes(u);
const attack=(w,e)=>w.template(e.key).ranged.attacks[0];
const fxDuration=(w,key)=>{const a=w.data.animations[key];if(!a)throw new Error('Missing satyr animation '+key);return (a.frames?.length||a.ranges?.reduce((n,[f,t])=>n+t-f+1,0)||a.to-a.from+1)/30;};
const duration=(w,e,name)=>w.animationDuration(w.template(e.key).render.sprites[0].prefix,name);
const cooldown=(w,a)=>Array.isArray(a.cooldown)?a.cooldown[w.difficulty-1]:a.cooldown;
function phase(w,e,name,target){const s=e.satyr;s.phase=name;s.at=w.time;e.action=name;e.actionAt=w.time;e.actionFlip=target.x<e.x;e.anim=duration(w,e,name);}
function allowed(w,e,u,a){const t=w.template(u.key),v=t.vis||{};return u.hp>0&&present(w,u)&&!((u.visBans??v.bans??0)&a.vis_flags)&&!((u.visFlags??v.flags??0)&a.vis_bans)&&inEllipse(e,u,a.max_range)&&!inEllipse(e,u,a.min_range);}
export function insertSatyr(w,e){if(e.key!=='enemy_satyr_cutthroat')return;e.satyr={ts:w.time,phase:null,at:w.time,index:0};e.cd=w.template(e.key).melee.attacks[0].cooldown;}
export function initSatyrs(w){w.satyrState={pending:[],damage:[],fx:[]};}
export function updateSatyrQueues(w){const s=w.satyrState;if(!s)return;
 const damage=s.damage;s.damage=[];for(const d of damage)if(d.at<w.time){if(present(w,d.target)&&d.target.hp>0)w.hurtDefender(d.target,d.value,d.type);}else s.damage.push(d);
 const pending=s.pending;s.pending=[];for(const p of pending){if(p.at>=w.time){s.pending.push(p);continue;}if(!present(w,p.target))continue;const t=w.template(p.bullet).bullet,dt=t.flight_time;
  // arrow.insert predicts only inside predict_target_pos. Satyr explicitly disables it.
  w.shots.push({...p,id:++w.serial,type:'satyr-knife',x:p.sx,y:p.sy,elapsed:0,duration:dt,g:t.g,rotation:0,flipY:false,insertedAt:w.time,velocity:{x:(p.tx-p.sx)/dt,y:(p.ty-p.sy-.5*t.g*dt*dt)/dt}});
 }
 s.fx=s.fx.filter(f=>w.time-f.at<f.duration);
}
export function holdsSatyrMelee(e){return !!e.satyr?.phase;}
export function updateSatyr(w,e){if(e.key!=='enemy_satyr_cutthroat')return undefined;
 const a=attack(w,e),s=e.satyr??={ts:w.time,phase:null,at:w.time,index:0};
 if(s.phase){const age=w.time-s.at;
  if(s.phase===a.animations[0]){if(age>=duration(w,e,s.phase)){s.index=0;phase(w,e,a.animations[1],s.target);}return true;}
  if(s.phase===a.animations[1]){
   const times=a.shoot_times;
   if(s.index<times.length&&age<times[s.index]){if(isEnemyStunned(e)&&!a.ignore_stun)phase(w,e,a.animations[2],s.target);return true;}
   while(s.index<times.length&&age>=times[s.index]){const target=s.target,o=a.bullet_start_offset[0],off=w.template(target.key).unit.hit_offset;
    w.satyrState.pending.push({at:w.time,bullet:a.bullet,source:e.id,target,sx:e.x+(e.actionFlip?-1:1)*o.x,sy:e.y+o.y,tx:target.x+off.x,ty:target.y+off.y});s.index++;}
   if(s.index===times.length&&age>=duration(w,e,s.phase)||isEnemyStunned(e)&&!a.ignore_stun)phase(w,e,a.animations[2],s.target);
   return true;
  }
  // Source end wait observes death, not stun. The live set already excludes dead actors.
  if(age>=duration(w,e,s.phase)){s.phase=null;e.anim=0;e.action='idle';}return true;
 }
 if(isEnemyStunned(e)){e.action='idle';e.anim=0;return true;}
 if(e.blocked||e.pendingMelee||e.anim>0)return false;
 const target=defenders(w).filter(u=>allowed(w,e,u,a)).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];
 if(!target||w.time-s.ts<=cooldown(w,a))return false;
 s.ts=w.time;if(w.random()>=a.chance)return true;s.target=target;phase(w,e,a.animations[0],target);return true;
}
export function satyrWater(w,p){const g=w.data.satyrRules.grid,x=Math.max(1,Math.min(g.grid.length,Math.ceil((p.x-g.ox)/16))),y=Math.max(1,Math.min(g.grid[0].length,Math.ceil((p.y-g.oy)/16)));return !!(g.grid[x-1][y-1]&w.data.satyrRules.water);}
function effect(w,key,pos,duration,extra={}){w.satyrState.fx.push({id:++w.serial,key,...pos,at:w.time,duration,...extra});}
export function updateSatyrKnife(w,b,dt){if(b.type!=='satyr-knife')return false;if(b.done)return true;if(b.insertedAt===w.time)return true;
 if(b.elapsed+dt<=b.duration){const x=b.x,y=b.y;b.elapsed+=dt;b.x=b.sx+b.velocity.x*b.elapsed;b.y=b.sy+b.velocity.y*b.elapsed+b.g*b.elapsed*b.elapsed/2;b.rotation=Math.atan2(b.y-y,b.x-x);if(Math.abs(b.rotation)>Math.PI/2)b.flipY=true;return true;}
 b.done=true;const t=w.template(b.bullet).bullet,u=b.target,off=w.template(u.key).unit.hit_offset;
 if(present(w,u)&&u.hp>0&&Math.hypot(b.x-u.x-off.x,b.y-u.y-off.y)<t.hit_distance&&!tryEwokDodge(w,u,{ranged:true})&&!tryBladeDodge(w,u,{ranged:true})){
  b.hit=true;b.damage=Math.ceil((t.damage_min+w.random()*(t.damage_max-t.damage_min))*(t.damage_factor??1));w.satyrState.damage.push({at:w.time,target:u,value:b.damage,type:t.damage_type});
  const s=w.template(t.hit_fx).render.sprites[0];effect(w,t.hit_fx,{x:u.x+off.x,y:u.y+off.y},fxDuration(w,s.name));
 }else{
  // The source ground miss uses a decal with one random angle; water is handled separately.
  if(satyrWater(w,b)){const key=t.miss_fx_water,raw=w.template(key).render.sprites[0];effect(w,key,{x:b.tx,y:b.ty},fxDuration(w,raw.prefix+'_'+raw.name));}else{const angle=-Math.PI/2*(1+(.5-w.random())*.35);effect(w,t.miss_decal,{x:b.tx,y:b.ty},w.data.satyrRules.missDuration,{decal:true,rotation:angle});}
 }
 return true;
}
function drawSprite(r,key,pos,s,{alpha=1,rotation=0,flipY=false,id=0}={}){const f=r.catalog.frames[key];if(!f)throw new Error('Missing satyr sprite '+key);const q=r.screen({x:pos.x+(s.offset?.x||0),y:pos.y+(s.offset?.y||0)}),render=()=>{const c=r.ctx;c.save();c.translate(q.x,q.y);c.rotate(-rotation);if(flipY)c.scale(1,-1);r.sprite(c,key,0,0,s.scale?.x??1,s.anchor?.x??.5,1-(s.anchor?.y??.5),false,alpha);c.restore();};const order=spriteOrder(s,pos,1,id);r.orderQueue?r.orderQueue.add(order,render):render();}
export function drawSatyrShot(r,w,b){if(b.type!=='satyr-knife')return false;const s=w.template(b.bullet).render.sprites[0],t=w.template(b.bullet).bullet;if(!b.done&&b.elapsed>0&&Math.hypot(b.x-b.sx,b.y-b.sy)>=t.hide_radius&&Math.hypot(b.x-b.tx,b.y-b.ty)>=t.hide_radius)drawSprite(r,s.name,b,s,{rotation:b.rotation,flipY:b.flipY,id:r.renderId(b)});return true;}
export function drawSatyrEffects(r,w){for(const f of w.satyrState?.fx||[]){if(f.at>=w.time)continue;if(f.decal){const age=w.time-f.at,alpha=Math.max(0,1-age/f.duration);drawSprite(r,f.key,f,{z:1400,anchor:{x:.5,y:.5}},{alpha,rotation:f.rotation,id:r.renderId(f)});}else{const s=w.template(f.key).render.sprites[0],key=r.frame(s.prefix?s.prefix+'_'+s.name:s.name,w.time-f.at,false);drawSprite(r,key,f,s,{id:r.renderId(f)});}}}
