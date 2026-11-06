import{isEnemyStunned}from'./enemy-status.mjs';
// Original enemy_ettin coroutine and aura_unit_regen, adapted to World ticks.
// Only this newly restored enemy owns this state; legacy enemies draw no RNG.
export function insertEttin(w,e){
 if(e.key!=='enemy_ettin')return;
 const t=w.template(e.key);e.ettin={cooldown:w.number(t.insane.cooldown_min,t.insane.cooldown_max),ts:w.time,regenTs:w.time,phase:null,hit:false};
}
export function ettinRegen(e,now,definition,{stunned=false,frozen=false,modBanned=false}={}){
 const s=e.ettin;if(!s||e.hp<=0||e.leaked)return;
 const regen=e.regen||definition.regen,flags=definition.regen;
 if(now-s.regenTs<regen.cooldown)return;
 if((flags.ignore_stun||!stunned)&&(flags.ignore_freeze||!frozen)&&(flags.ignore_mods||!modBanned)){
  s.regenTs+=regen.cooldown;e.hp=Math.max(0,Math.min(e.maxHp,e.hp+regen.health));
 }else s.regenTs=now;
}
export function ettinHeld(e){return !!e.ettin&&(!!e.ettin.phase||!!isEnemyStunned(e));}
function action(w,e,name,duration){e.action=name;e.actionAt=w.time;delete e.actionFlip;e.anim=duration;}
export function updateEttin(w,e,{blocked=false}={}){
 const s=e.ettin;if(!s||e.hp<=0||e.leaked)return false;
 const t=w.template(e.key),def=t.insane;
 if(s.phase==='start'){
  // y_enemy_wait(hit_time) is interruptible; y_animation_wait after hit is not.
  if(!s.hit&&isEnemyStunned(e)){s.phase=null;action(w,e,'idle',0);return true;}
  if(!s.hit&&w.time-s.at>=def.hit_time){s.hit=true;const damage=Math.max(0,Math.min(e.hp-1,w.number(def.damage_min,def.damage_max)));if(damage>0)w.hurt(e,damage,def.damage_type);}
  if(w.time-s.at>=w.animationDuration(t.render.sprites[0].prefix,'insaneStart')){s.phase='loop';s.at=w.time;action(w,e,'insaneLoop',def.stun_duration);}
  return true;
 }
 if(s.phase==='loop'){
  if(isEnemyStunned(e)||w.time-s.at>=def.stun_duration){s.phase=null;action(w,e,'idle',0);return !!isEnemyStunned(e);}
  return true;
 }
 if(isEnemyStunned(e)){action(w,e,'idle',0);return true;}
 // Original coroutine checks cooldown between walking and melee episodes.
 if(!blocked&&!e.pendingMelee&&e.anim<=0&&!e.shielded&&w.time-s.ts>s.cooldown){s.ts=w.time;s.at=w.time;s.phase='start';s.hit=false;action(w,e,'insaneStart',w.animationDuration(t.render.sprites[0].prefix,'insaneStart'));return true;}
 return false;
}
