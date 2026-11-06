import{routeNode,hopliteNodeValid}from'./hoplite.mjs';
import{spriteOrder}from'../render-order.mjs';
import{tweenValue}from'../skill-effects.mjs';
const SHOOTER='druid_shooter_sylvan',MOD='mod_druid_sylvan',RAY='ray_druid_sylvan',MARK='mod_druid_sylvan_affected';
const state=w=>w.druidSylvan??={shooters:[],pending:[],mods:[],rays:[],damage:[],marks:[]};
const inside=(a,b,r)=>((a.x-b.x)/r)**2+((a.y-b.y)/(.7*r))**2<=1;
const present=(w,e)=>w.enemies.includes(e),alive=(w,e)=>present(w,e)&&e.hp>0;
const duration=(w,name)=>{const a=w.data.animations[name];return(a.frames?.length||a.to-a.from+1)/30;};
function legal(w,e,flags,bans){const v=w.template(e.key).vis||{};return alive(w,e)&&hopliteNodeValid(w,e.road,routeNode(w,e))&&!((e.visBans??v.bans??0)&flags)&&!((e.visFlags??v.flags??0)&bans);}
export function druidPowerOffer(w,s,name){if(!s?.druid||name!=='sylvan')return null;const p=s.druid.powers?.[name]||w.template(s.key).powers[name];return{...p,price:p.level===0?p.price_base:p.price_inc};}
export function buyDruidPower(w,s,name){if(!s?.druid)return undefined;const p=druidPowerOffer(w,s,name);if(!w.active(true)||!p||p.level>=p.max_level||w.gold<p.price)return false;s.druid.powers??={};s.druid.powers[name]={...p,level:p.level+1,changed:true};w.gold-=p.price;s.spent+=p.price;w.emit('tower_power',{name,level:p.level+1});return true;}
// The tower outer coroutine observes changed and queues the independent shooter.
export function syncSylvan(w,s){const p=s.druid.powers?.sylvan;if(!p?.changed)return;p.changed=false;const q=state(w);if(!q.shooters.some(x=>x.owner===s))q.shooters.push({id:++w.serial,owner:s,queuedAt:w.time,last:null,cast:null,visualAt:null});}
export function removeSylvanShooter(w,s){if(w.druidSylvan)w.druidSylvan.shooters=w.druidSylvan.shooters.filter(x=>x.owner!==s);}
export function clearSylvanTarget(w,e){const q=w.druidSylvan;if(!q)return;q.mods=q.mods.filter(m=>m.target!==e);q.marks=q.marks.filter(m=>m.target!==e);q.pending=q.pending.filter(m=>m.target!==e);}
function insert(w,p){const q=state(w),e=p.target,raw=w.template(p.key),v=w.template(e.key).vis||{};if(!alive(w,e)||((e.visBans??v.bans??0)&raw.modifier.vis_flags)||((e.visFlags??v.flags??0)&raw.modifier.vis_bans))return;const list=p.key===MOD?q.mods:q.marks,old=list.find(m=>m.target===e);if(old){if(p.level<old.level)return;if(p.level===old.level){old.ts=w.time;return;}list.splice(list.indexOf(old),1);}list.push({...p,id:++w.serial,at:w.time,ts:w.time,hp:e.hp,rayAt:0});}
export function updateSylvan(w){const q=w.druidSylvan;if(!q)return;
 const damage=q.damage;q.damage=[];for(const d of damage){if(d.at>=w.time){q.damage.push(d);continue;}if(!alive(w,d.target))continue;const h=w.template(d.target.key).health;if(h.ignore_damage||((h.immune_to||0)&1))continue;const v=Math.round(d.value*(h.damage_factor??1));if(v>0)w.hurt(d.target,v,1);}
 const pending=q.pending;q.pending=[];for(const p of pending)if(p.queuedAt<w.time)insert(w,p);else q.pending.push(p);
 for(const s of q.shooters){if(s.queuedAt>=w.time)continue;if(s.last===null)s.last=w.time;const owner=s.owner,a=w.template(SHOOTER).attacks.list[0];if(s.cast){if(w.time-s.cast.at>=a.cast_time){s.last=w.time;q.pending.push({key:a.spell,target:s.cast.target,level:owner.druid.powers.sylvan.level,queuedAt:w.time});s.cast=null;}continue;}if(owner.blocked||(owner.canDoMagic??w.template(owner.key).tower.can_do_magic)===false||w.time-s.last<=a.cooldown)continue;s.last=w.time-a.cooldown+1-1e-6;
  const candidates=w.enemies.filter(e=>legal(w,e,a.vis_flags,a.vis_bans)&&inside(owner,e,a.range)&&!a.excluded_templates.includes(e.key)&&!q.mods.some(m=>m.target===e));if(!candidates.length)continue;s.cast={at:w.time,target:candidates[0]};s.visualAt=w.time;
 }
 for(const r of q.rays){if(r.queuedAt>=w.time)continue;if(r.at===undefined){r.at=w.time;if(!present(w,r.target))r.target=null;}else if(r.target&&((r.target.visBans??w.template(r.target.key).vis?.bans??0)&2))r.target=null;
  const raw=w.template(RAY),age=w.time-r.at;if(!r.hit&&age>=raw.bullet.hit_time){r.hit=true;if(r.target){w.random();const value=Math.max(1,Math.ceil(Math.ceil(r.value)*raw.bullet.damage_factor));q.damage.push({target:r.target,value,at:w.time});q.pending.push({key:raw.bullet.mod,target:r.target,level:raw.bullet.level,queuedAt:w.time});}}if(age>=duration(w,RAY))r.done=true;
 }
 q.rays=q.rays.filter(r=>!r.done);
 for(const m of q.mods){const e=m.target,raw=w.template(MOD);if(!alive(w,e)||w.time-m.ts>raw.modifier.duration){m.done=true;continue;}const delta=e.hp-m.hp;if(delta>=0)continue;m.hp=e.hp;const a=raw.attack,targets=w.enemies.filter(t=>t!==e&&legal(w,t,a.vis_flags,a.vis_bans)&&inside(e,t,a.max_range));if(!targets.length)continue;const u=w.template(e.key).unit,o=u.mod_offset,from={x:e.x+o.x,y:e.y+o.y};for(const target of targets){const h=w.template(target.key).unit.hit_offset,to={x:target.x+h.x,y:target.y+h.y};q.rays.push({id:++w.serial,queuedAt:w.time,target,x:from.x,y:from.y,tx:to.x,ty:to.y,rotation:Math.atan2(to.y-from.y,to.x-from.x),scale:Math.hypot(to.x-from.x,to.y-from.y)/w.template(RAY).image_width,value:-delta*a.damage_factor[m.level-1],hidden:w.time-m.rayAt<raw.ray_cooldown});}if(w.time-m.rayAt>raw.ray_cooldown)m.rayAt=w.time;
 }
 q.mods=q.mods.filter(m=>!m.done);q.marks=q.marks.filter(m=>alive(w,m.target)&&w.time-m.ts<=w.template(MARK).modifier.duration);
}
export const sylvanBusy=w=>!!(w.druidSylvan?.pending.length||w.druidSylvan?.damage.length||w.druidSylvan?.rays.some(r=>!r.hit));
export function drawSylvan(r,w){const q=w.druidSylvan;if(!q)return;
 for(const s of q.shooters){if(s.last===null)continue;const age=s.visualAt===null?Infinity:w.time-s.visualAt,casting=age<duration(w,'tower_druid_shooter_sylvan_cast');r.entity(SHOOTER,s.owner,{state:casting?'cast':'idle',time:casting?age:0,renderId:s.id});}
 for(const m of [...q.mods,...q.marks]){const raw=w.template(m.key),e=m.target,u=w.template(e.key).unit,age=w.time-m.at;for(const[i,s]of raw.render.sprites.entries()){const animated=s.animated,name=animated?s.prefix+'_'+s.size_names[u.size-1]:s.name,key=animated?r.frame(name,age,s.loop):name,offset=i===0&&m.key===MOD?{x:0,y:0}:u.mod_offset,scale=m.key===MOD&&i===0?tweenValue(raw.tween.props[0].keys.map(([t,v])=>[t,v.x]),age%1):1,p={x:e.x+offset.x,y:e.y+offset.y},v=r.screen(p);r.sprite(r.ctx,key,v.x,v.y,scale,s.anchor.x,1-s.anchor.y,false,s.alpha/255,s.r,spriteOrder(s,e,i+1,m.id));}}
 for(const b of q.rays){if(b.at===undefined||b.hidden)continue;const s=w.template(RAY).render.sprites[0],key=r.frame(RAY,w.time-b.at,false),v=r.screen(b),draw=()=>{const c=r.ctx;c.save();c.translate(v.x,v.y);c.rotate(-b.rotation);c.scale(b.scale,1);r.sprite(c,key,0,0,1,s.anchor.x,1-s.anchor.y,false,s.alpha/255);c.restore();};r.orderQueue?r.orderQueue.add(spriteOrder(s,b,1,b.id),draw):draw();}
}
