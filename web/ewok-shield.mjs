import RULES from './ewok-shield-data.mjs';
import{ewokRegen}from'./ewok-hut.mjs';
// Explicit attack callers only. Never turn hurtDefender into global immunity.
const state=(w,u)=>u.ewokShield??=( {...w.template(u.key).dodge,phase:null,lastHit:null});
export function tryEwokDodge(w,u,{ranged=false,damageType=0}={}){
 if(!u?.ewok||u.hp<=0)return false;
 const s=state(w,u);s.lastCheck=w.time;
 if(u.stunned||u.frozen||ranged&&!s.ranged||s.cooldown!==undefined&&w.time-s.ts<=s.cooldown||(damageType&RULES.noDodge)!==0)return false;
 if(w.random()>s.chance)return false;
 // Original function-valued template field is absent from JSON: game_templates14032.
 s.lastHit=w.time;
 if(u.hp>u.maxHp*.5)return false;
 s.active=true;s.lastDodge=w.time;u.pendingHit=null;
 return true;
}
function animate(w,u,s,phase,name){s.phase=phase;s.at=w.time;s.animation=name;s.until=w.time+w.animationDuration(u.key,name);u.walking=false;u.shooting=false;u.anim=0;u.pendingHit=null;}
export function updateEwokShield(w,u,dt){
 if(!u.ewok)return false;const s=u.ewokShield;
 if(!s?.active)return false;
 // Combat cooldowns are source absolute timestamps; holding a shield cannot freeze them.
 u.cd-=dt;u.rangedCd-=dt;
 // A pending active flag waits while stunned, as does the original outer loop.
 if(!s.phase){if(u.stunned||u.frozen){u.walking=false;u.pendingHit=null;return true;}s.start=w.time;animate(w,u,s,'start',s.animation_start);return true;}
 u.walking=false;u.pendingHit=null;
 if(s.phase==='end'){if(w.time>=s.until){s.active=false;s.phase=null;s.ts=w.time;}return true;}
 if(s.phase==='start'||s.phase==='hit'){
  if(w.time<s.until)return true;
  s.lastHit=null;s.phase='hold';
  // Hold the final animation frame instead of restarting a made-up looping animation.
  s.at=s.start;
 }
 if(w.time-s.start>=s.duration||u.stunned||u.frozen){animate(w,u,s,'end',s.animation_end);return true;}
 ewokRegen(w,u,dt);
 if(s.lastHit!==null)animate(w,u,s,'hit',s.animation_hit);
 return true;
}
export function ewokShieldPose(u,time){const s=u.ewokShield;if(!s?.active||!s.phase)return null;return{state:s.animation,time:s.phase==='hold'?Infinity:time-s.at};}
