import{wardBlocksMod}from'./wild-ward.mjs';
import{inEllipse}from'./spells.mjs';
import{spriteOrder}from'./render-order.mjs';
// Only an actual stage6 boss creates this production chain. No timers/global cache.
export function queueGnollAura(w,source){if(w.id!==6)return;const s=w.gnollAuraState??={auras:[],pending:[],mods:[]};s.auras.push({id:++w.serial,source,queuedAt:w.time,at:null,cycleAt:null,removed:false});}
const members=w=>[...w.enemies,...w.soldiers,...(w.stageHeroes||[]),...(w.gryphonGuards||[]),...(w.alleriaCats||[]),w.fixedAlleria,w.hero].filter(Boolean);
const gnawer=(w,e)=>e.gnawerBuff&&w.time<e.gnawerBuff.until?e.gnawerBuff.factor:1;
export function syncGnollDamage(w,e){const s=e.gnollDamageState;if(!s)return;const f=gnawer(w,e);if(f!==s.gnawer){s.factor=s.factor/s.gnawer*f;s.gnawer=f;}}
export function enemyMeleeFactor(e){return e.gnollDamageState?.factor??e.gnawerBuff?.factor??1;}
function factorState(w,e){syncGnollDamage(w,e);if(!e.gnollDamageState){const f=gnawer(w,e);e.gnollDamageState={factor:(w.template(e.key).unit?.damage_factor??1)*f,gnawer:f};}return e.gnollDamageState;}
export function removeGnollMod(w,m){if(m.removed)return;m.removed=true;const e=m.target;if(!members(w).includes(e))return;const before=e.hp;e.maxHp-=m.bonus;e.hp-=m.bonus;const f=factorState(w,e);f.factor=Math.ceil(f.factor/m.factor);
 // systems.health observes HP loss from modifier removal, including lethal loss.
 if(before>0&&e.hp<=0&&!w.template(e.key).health.ignore_damage&&w.enemies.includes(e)){e.hp=0;w.finishEnemyDeath(e);}
}
function insertMod(w,p){const e=p.target,t=w.template(e.key),s=w.gnollAuraState;if(wardBlocksMod(w,e,'mod_gnoll_boss')||!members(w).includes(e)||!t.health||!t.unit||e.hp<=0)return;
 const old=s.mods.find(m=>!m.removed&&m.target===e);if(old){old.ts=w.time;return;}
 const d=w.template('mod_gnoll_boss'),bonus=Math.floor(e.maxHp*d.extra_health_factor),f=factorState(w,e);e.maxHp+=bonus;e.hp+=bonus;f.factor*=d.inflicted_damage_factor;s.mods.push({...p,bonus,factor:d.inflicted_damage_factor,ts:w.time,at:w.time,removed:false});
}
export function updateGnollAuras(w){const s=w.gnollAuraState;if(!s)return;const units=members(w),a=w.template('gnoll_boss_aura').aura,d=w.template('mod_gnoll_boss');
 // Source queue insertions commit on the following simulation tick. A queued
 // modifier only checks its target, not whether its source is still alive.
 const pending=s.pending;s.pending=[];for(const p of pending)insertMod(w,p);
 for(const m of s.mods)if(!m.removed&&(wardBlocksMod(w,m.target,'mod_gnoll_boss')||!units.includes(m.target)||m.target.hp<=0||w.time-m.ts>d.modifier.duration))removeGnollMod(w,m);
 s.mods=s.mods.filter(m=>!m.removed);
 for(const r of s.auras){const source=r.source;if(r.removed)continue;if(!units.includes(source)||source.hp<=0){r.removed=true;continue;}if(r.at===null){if(w.time<=r.queuedAt)continue;r.at=w.time;r.cycleAt=w.time-a.cycle_time;}
  if(w.time-r.cycleAt<a.cycle_time)continue;r.cycleAt=w.time;
  for(const e of units){const t=w.template(e.key),v=t.vis;if(e===source||!t.unit||!t.health||!v||e.hp<=0||((e.visFlags??v.flags)&a.vis_bans)||((e.visBans??v.bans)&a.vis_flags)||!inEllipse(source,e,a.radius))continue;s.pending.push({id:++w.serial,target:e,source:r});}
 }
 s.auras=s.auras.filter(r=>!r.removed);for(const e of units)syncGnollDamage(w,e);
}
function sample(keys,t,loop){if(loop)t%=keys.at(-1)[0];if(t<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++)if(t<=keys[i][0]){const[a,x]=keys[i-1],[b,y]=keys[i],q=(t-a)/(b-a);return typeof x==='number'?x+(y-x)*q:{x:x.x+(y.x-x.x)*q,y:x.y+(y.y-x.y)*q};}return keys.at(-1)[1];}
export function gnollAuraSprites(w){const state=w.gnollAuraState;if(!state)return[];const out=[],a=w.template('gnoll_boss_aura');for(const r of state.auras){if(r.at===null||r.removed)continue;for(const[i,raw]of a.render.sprites.entries()){const props=a.tween.props.filter(p=>p.sprite_id===i+1),alpha=props.find(p=>p.name==='alpha'),scale=props.find(p=>p.name==='scale'),offset=i===0?w.template(r.source.key).unit.mod_offset:raw.offset;out.push({raw,key:raw.name,id:r.id,index:i+1,pos:{x:r.source.x+offset.x,y:r.source.y+offset.y},orderPos:r.source,alpha:alpha?sample(alpha.keys,w.time-r.at,alpha.loop)/255:raw.alpha/255,scale:scale?sample(scale.keys,w.time-r.at,scale.loop).x:1});}}
 const t=w.template('mod_gnoll_boss');for(const m of state.mods)if(!m.removed&&m.target.hp>0)for(const[i,raw]of t.render.sprites.entries())out.push({raw,key:raw.name,id:m.id,index:i+1,pos:m.target,orderPos:m.target,alpha:raw.alpha/255,scale:1});return out;
}
export function drawGnollAuras(r,w){for(const s of gnollAuraSprites(w)){const p=r.screen(s.pos);r.sprite(r.ctx,s.key,p.x,p.y,s.scale,s.raw.anchor.x,1-s.raw.anchor.y,false,s.alpha,s.raw.r,spriteOrder(s.raw,s.orderPos,s.index,w.data.level.entities_list.length+s.id));}}
