import{queueGnollAura}from'./gnoll-aura.mjs';
import{isEnemyStunned}from'./enemy-status.mjs';
import{inEllipse}from'./spells.mjs';
import{tryEwokDodge}from'./ewok-shield.mjs';
import{tryBladeDodge}from'./blade-dodge.mjs';
const value=(v,d)=>Array.isArray(v)?v[Math.max(0,Math.min(v.length-1,d-1))]:v;
export function insertGnollBoss(w,e){if(w.id!==6||e.key!=='eb_gnoll')return;e.gnollBoss={phase:'intro',action:'scream',at:w.time,flailAt:w.time,meleeAt:0,waveIndex:0,committed:false};queueGnollAura(w,e);}
export function gnollBossNode(w,e){const r=w.routes[e.road][e.lane];let i=0;while(i+1<r.lengths.length&&r.lengths[i+1]<=e.d)i++;return i+1;}
function targets(w){return[...w.soldiers,...(w.stageHeroes||[]),...(w.gryphonGuards||[]),w.fixedAlleria,...(w.alleriaCats||[]),w.hero].filter(Boolean);}
function allowed(w,u,a){const t=w.template(u.key),v=t.vis||{};return u.hp>0&&!u.expired&&!u.removed&&!((u.visBans??v.bans??0)&a.vis_flags)&&!((u.visFlags??v.flags??0)&a.vis_bans);}
// The source mask is physical|NO_DODGE. Only this caller normalizes armor;
// retain the full mask at the health.on_damage boundary (not an ordinary dodge).
export function hurtGnollTarget(w,u,damage,type){const h=w.template(u.key).health||{};if(h.ignore_damage||((h.immune_to||0)&type)!==0)return;w.hurtDefender(u,damage,type,true);}
function start(w,e,action,phase){const s=e.gnollBoss;s.phase=phase;s.action=action;s.at=w.time;s.committed=false;e.pendingMelee=null;}
export function startGnollMelee(w,e,target){const s=e.gnollBoss,a=w.template(e.key).melee.attacks[0];if(s.phase!=='loop'||isEnemyStunned(e)||!allowed(w,target,a)||w.time-s.meleeAt<a.cooldown)return;s.meleeAt=w.time;if(w.random()>=a.chance)return;start(w,e,a.animation,'melee');s.target=target;s.flip=target.x<e.x;s.dodgeChecked=false;s.dodged=false;}
function clearEnemies(w,boss){for(const e of w.enemies){const t=w.template(e.key);if(e===boss||e.hp<=0||(t.vis?.flags&96)||t.health?.immune_to===16777215)continue;e.hp=0;e.deadAt=w.time;e.gold=0;e.pendingMelee=null;e.pendingRanged=null;e.modBanned=true;e.visBans=(e.visBans??t.vis?.bans??0)|1024;if(e.carrier){e.carrier.carrying=false;e.carrier.quantity=0;}if(e.ettin)e.ettin.regenDisabled=true;}
 // These are the current adapter's already queued entity insertions. Suppress
 // death payloads, not future ordinary wave schedules or rewards via hurt().
 if(w.carrierSpawns)w.carrierSpawns=[];if(w.megaSpawner){w.megaSpawner.interrupt=true;w.megaSpawner.insertQueue=[];}}
export function updateGnollBoss(w,e){const s=e.gnollBoss;if(!s||e.leaked)return false;const t=w.template(e.key),[flail,howl]=t.timed_attacks.list;
 if(e.hp<=0&&!['intro','howl','stomp'].includes(s.phase)){if(s.phase!=='dead'&&s.phase!=='death-complete'){start(w,e,'death','dead');clearEnemies(w,e);}if(s.phase==='dead'&&w.time-s.at>=w.animationDuration(e.key,'death')){clearEnemies(w,e);s.phase='death-complete';w.emit('boss_killed');}return true;}
 const age=w.time-s.at;
 if(s.phase==='intro'||s.phase==='howl'){if(!s.committed&&age>=howl.hit_time){s.committed=true;s.waveIndex=s.waveIndex%howl.wave_names.length+1;if(w.megaSpawner)w.megaSpawner.manualWave=howl.wave_names[s.waveIndex-1];}if(age<w.animationDuration(e.key,howl.animation))return true;if(s.phase==='howl')s.lastNode=gnollBossNode(w,e);s.phase='loop';s.action='idle';if(e.hp<=0)return true;}
 if(s.phase==='stomp'){if(!s.committed&&age>=flail.hit_time){s.committed=true;for(const u of targets(w))if(allowed(w,u,flail)&&inEllipse(e,u,flail.max_range)&&!inEllipse(e,u,flail.min_range)){const hero=!!((u.visFlags??w.template(u.key).vis?.flags??0)&16);hurtGnollTarget(w,u,w.number(hero?flail.damage_min_hero:flail.damage_min,hero?flail.damage_max_hero:value(flail.damage_max,w.difficulty)),flail.damage_type);}w.emit('boss_stomp');}if(age<w.animationDuration(e.key,flail.animation))return true;s.phase='loop';s.action='idle';s.flailAt=w.time;return true;}
 if(s.phase==='melee'){const a=t.melee.attacks[0],u=s.target;if(!s.committed&&(isEnemyStunned(e)||!u)){s.phase='loop';return true;}if(!s.dodgeChecked&&age>=a.dodge_time){s.dodgeChecked=true;if(u.ewok)s.dodged=tryEwokDodge(w,u,{damageType:a.damage_type});else if(u.blade)s.dodged=tryBladeDodge(w,u,{damageType:a.damage_type});else if(u===w.hero){const hit={target:u};w.tryHeroDodge(e,hit);s.dodged=hit.dodged;}}
  if(!s.committed&&age>=a.hit_time){s.committed=true;if(allowed(w,u,a)&&!s.dodged&&(u.targetId===e.id||u.combatTarget===e.id))hurtGnollTarget(w,u,w.number(a.damage_min,a.damage_max),a.damage_type);}if(age<w.animationDuration(e.key,a.animation))return true;s.phase='loop';s.action='idle';return true;}
 if(e.hp<=0||isEnemyStunned(e))return true;const ni=gnollBossNode(w,e);if((s.lastNode===undefined||ni>s.lastNode)&&howl.nis.includes(ni)){start(w,e,howl.animation,'howl');return true;}
 if(w.time-s.flailAt>value(flail.cooldown,w.difficulty)&&e.d<e.goal){start(w,e,flail.animation,'stomp');return true;}return false;
}
export function gnollBossPose(w,e){const s=e.gnollBoss,moving=s.phase==='loop'&&!e.blocked&&!isEnemyStunned(e),state=moving?'walking'+(Math.abs(e.dy)>Math.abs(e.dx)?e.dy>0?'Up':'Down':'RightLeft'):s.phase==='loop'?'idle':s.action;return{state,time:s.phase==='loop'?w.time:w.time-s.at,flip:s.phase==='melee'?s.flip:e.dx<0,spriteStates:{1:{loop:moving||state==='idle'}}};}
