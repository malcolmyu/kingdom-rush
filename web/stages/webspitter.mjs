import{isEnemyStunned}from'../enemy-status.mjs';
import{tryBladeDodge}from'../blade-dodge.mjs';
import{bladeDodgeChance}from'../blade-parry.mjs';
import{tryEwokDodge}from'../ewok-shield.mjs';
import{spriteOrder}from'../render-order.mjs';
const KEY='enemy_webspitting_spider',MOD='mod_spider_web';
const defenders=w=>[...w.soldiers,...(w.stageHeroes||[]),w.hero].filter(Boolean);
const present=(w,u)=>defenders(w).includes(u)&&!u.expired;
const stunned=u=>!!u.stunned||!!u.frozen||(u.spiderWebCount||0)>0;
const attack=w=>w.template(KEY).timed_attacks.list[0];
const cooldown=(w,a)=>Array.isArray(a.cooldown)?a.cooldown[w.difficulty-1]:a.cooldown;
const pass=(w,u,a)=>{const v=w.template(u.key).vis||{};return !((u.visBans??v.bans??0)&a.vis_flags)&&!((u.visFlags??v.flags??0)&a.vis_bans);};
export function initWebspitters(w){w.spiderWebState={pending:[],mods:[]};}
export function insertWebspitter(w,e){if(e.key===KEY)e.webspitter={ts:w.time,phase:null,meleeEnd:null,checkMelee:false};}
export function webMeleeStarted(w,e){if(e.key===KEY)e.webspitter.meleeEnd=w.time+w.animationDuration('webspitting_spider',w.template(KEY).melee.attacks[0].animation);}
export function spiderBlockers(w,e){return defenders(w).filter(u=>u.hp>0&&!u.expired&&(u.targetId===e.id||u===w.hero&&u.combatTarget===e.id)&&Math.hypot(u.x-w.meleePosition(u,e,u.targetSlot||0).x,u.y-w.meleePosition(u,e,u.targetSlot||0).y)<4);}
function dodge(w,u,a,e){const d=w.template(u.key).dodge;if(!d||stunned(u))return false;if(u.blade)return tryBladeDodge(w,u,{damageType:a.damage_type});if(u.ewok)return tryEwokDodge(w,u,{damageType:a.damage_type});
 // unit_dodges samples even chance0. Source does not inspect dodge.disabled.
 const rank=u===w.hero?w.heroSkills.nimble_fencer:0,chance=rank?w.template(u.key).hero.skills.nimble_fencer.chance[rank-1]:d.chance;
 if(d.cooldown!==undefined&&w.time-(u.dodgeAt??d.ts)<=d.cooldown)return false;
 if(w.random()>chance)return false;if(u===w.hero){u.counterPending=true;u.combatTarget=e.id;u.pendingHit=null;u.volley=null;u.anim=0;}return true;
}
export function updateWebspitter(w,e){if(e.key!==KEY)return undefined;const s=e.webspitter,a=attack(w),length=w.animationDuration('webspitting_spider',a.animation);
 if(s.phase){s.checkMelee=false;const age=w.time-s.at;if(!s.released&&age<a.cast_time&&isEnemyStunned(e)){s.phase=null;s.meleeEnd=null;e.anim=0;e.action='idle';return true;}
  if(!s.released&&age>=a.cast_time){s.released=true;s.affected=[];for(const u of spiderBlockers(w,e))if(pass(w,u,a)&&!stunned(u)&&!dodge(w,u,a,e)){w.spiderWebState.pending.push({id:++w.serial,target:u,source:e.id,key:a.mod,level:1,queuedAt:w.time});s.affected.push(u);}}
  if(age>=length){s.ts=w.time;s.phase=null;s.meleeEnd=null;e.anim=0;e.action='idle';for(const u of s.affected||[]){u.targetId=null;if(u===w.hero)u.combatTarget=null;}}return true;
 }
 if(isEnemyStunned(e)){s.checkMelee=false;s.meleeEnd=null;return undefined;}s.checkMelee=false;if(s.meleeEnd===null||w.time<s.meleeEnd||e.pendingMelee)return undefined;
 const targets=spiderBlockers(w,e).filter(u=>pass(w,u,a)&&!stunned(u));s.meleeEnd=null;if(w.time-s.ts<=cooldown(w,a)||!targets.length)return undefined;
 // This custom controller has no can_do_magic or chance check here.
 s.ts=w.time;s.at=w.time;s.phase=a.animation;s.released=false;s.affected=[];e.action=a.animation;e.actionAt=w.time;e.anim=length;return true;
}
export const webHoldsMelee=e=>!!(e.webspitter?.phase||e.webspitter?.checkMelee);
export function webDefender(w,u,dt=0){if(!(u.spiderWebCount>0)||u.blade?.parry||u.blade?.dance)return false;if(u!==w.hero&&!u.blade){u.cd-=dt;u.rangedCd-=dt;}if(u.blade)u.blade.attack=null;u.walking=false;u.pendingHit=null;u.anim=0;return true;}
export const webHidden=(w,u)=>(u.spiderWebHidden||0)>0;
function show(m){if(m.hidden){m.target.spiderWebHidden=Math.max(0,(m.target.spiderWebHidden||0)-1);m.hidden=false;}}
export function removeSpiderWeb(m){show(m);if(m.counted){m.target.spiderWebCount=Math.max(0,(m.target.spiderWebCount||0)-1);m.counted=false;}m.removed=true;}
function insert(w,p){const u=p.target,t=w.template(MOD),raw=t.modifier;if(!present(w,u)||u.hp<=0)return;const old=w.spiderWebState.mods.find(m=>!m.removed&&m.target===u);if(old){if(p.level===old.level&&raw.resets_same){old.ts=w.time;return;}if(p.level<old.level||!raw.replaces_lower)return;removeSpiderWeb(old);}
 // Original custom insert has a second, independent Blade parry check.
 if(u.blade&&bladeDodgeChance(w,u)>0&&!stunned(u)&&!u.blade.dance&&(u.blade.parryLevel||0)>0&&w.random()<=bladeDodgeChance(w,u)){u.blade.dodgeActive=true;return;}
 if(!pass(w,u,raw))return;const counted=!w.template(u.key).unit.ignore_stun&&!u.ignoreStun;if(counted)u.spiderWebCount=(u.spiderWebCount||0)+1;
 w.spiderWebState.mods.push({...p,at:w.time,ts:w.time,phase:'start',phaseAt:w.time,hidden:false,counted,duration:w.template(u.key).hero?raw.duration_heroes:raw.duration,flip:!!u.flip});
}
export function updateSpiderWebs(w){const s=w.spiderWebState;if(!s)return;for(const e of w.enemies)if(e.webspitter?.meleeEnd!==null&&e.webspitter?.meleeEnd!==undefined&&w.time>=e.webspitter.meleeEnd)e.webspitter.checkMelee=true;const pending=s.pending;s.pending=[];for(const p of pending)if(p.queuedAt<w.time)insert(w,p);else s.pending.push(p);
 const t=w.template(MOD),raw=t.modifier,start=w.animationDuration('mod_spider_web','start'),end=w.animationDuration('mod_spider_web','end');
 for(const m of s.mods){if(m.removed)continue;const u=m.target;if(!present(w,u)){removeSpiderWeb(m);continue;}
  if(m.phase==='start'){if(w.time-m.phaseAt>=start){m.phase='loop';m.phaseAt=w.time;}else if(!m.hidden&&w.time-m.phaseAt>raw.hide_target_delay){m.hidden=true;u.spiderWebHidden=(u.spiderWebHidden||0)+1;}}
  if(m.phase==='loop'&&(w.time-m.ts>=m.duration||u.hp<=0)){m.phase='end';m.phaseAt=w.time;show(m);}
  if(m.phase==='end'&&w.time-m.phaseAt>=end)removeSpiderWeb(m);
 }s.mods=s.mods.filter(m=>!m.removed);
}
export function webSprites(w){const t=w.template(MOD),raw=t.render.sprites[0];return(w.spiderWebState?.mods||[]).filter(m=>!m.removed).map(m=>({key:raw.prefix+'_'+m.phase,age:w.time-m.phaseAt,loop:m.phase==='loop',pos:m.target,anchor:raw.anchor,scale:t.modifier.custom_scales[m.target.key]||t.modifier.custom_scales.default,flip:m.flip,alpha:raw.alpha/255,order:spriteOrder(raw,m.target,1,m.id)}));}
export function drawSpiderWebs(r,w){for(const p of webSprites(w)){const key=r.frame(p.key,p.age,p.loop);if(!key)throw new Error('Missing spider web '+p.key);const q=r.screen(p.pos);r.sprite(r.ctx,key,q.x,q.y,p.scale.x,p.anchor.x,1-p.anchor.y,p.flip,p.alpha,0,p.order);}}
