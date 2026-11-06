import{isEnemyStunned}from'./enemy-status.mjs';
import DATA from'./harasser-jump-data.mjs';
import{launchHarasserArrow}from'./harasser.mjs';
import{inEllipse}from'./spells.mjs';
const C=DATA.rules,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const harasserHidden=e=>!!e.harasser&&(e.harasser.jumpHidden||(e.visBans>>>0)===C.all);
export function harasserPathBounds(w,road){
 const p=w.data.paths[road]?.[0];if(!p)return null;
 const width=clamp(Math.ceil(768*(w.harasserAspect||4/3)),1024,768*16/9),left=(1024-width)/2,right=(1024+width)/2,pan=w.data.level.pan_extension||{},top=768+(pan.top||0),bottom=pan.bottom||0;
 let first=p.findIndex(n=>n.x>=left&&n.x<=right&&n.y>=bottom&&n.y<=top);if(first<0)first=0;
 let last=p.findIndex((n,i)=>i>=first&&(n.x<left||n.x>right||n.y<bottom||n.y>top));if(last<0)last=p.length-1;
 return{end:clamp(last+1+C.endMargin,1,p.length),start:clamp(first+1+(first===0?0:p[0].y>768?C.validTopMargin:C.validMargin),1,p.length),visibleEnd:clamp(last+1-(last===p.length-1?0:p.at(-1).y>768?C.validTopMargin:C.validMargin),1,p.length)};
}
export function tryHarasserDodge(w,e,{ranged=false,damageType=0}={}){
 if(!e?.harasser||e.hp<=0)return false;const d=w.template(e.key).dodge,s=e.harasser;s.lastCheck=w.time;
 if(isEnemyStunned(e)||e.frozen||d.requires_magic&&(e.canDoMagic??w.template(e.key).enemy.can_do_magic)===false||ranged&&!d.ranged||w.time-(s.dodgeAt??d.ts)<=d.cooldown||(damageType&C.noDodge)!==0)return false;
 if(w.random()>d.chance)return false;s.dodgeActive=true;s.lastDodge=w.time;return true;
}
export function harasserJumpDestination(w,e,dn){
 const s=e.harasser,d=w.template(e.key).dodge,bounds=harasserPathBounds(w,e.road),route=w.routes[e.road]?.[e.lane];if(!bounds||!route)return null;
 const node=clamp((s.node??0)+1+dn,d.nodeslimit,bounds.end-d.nodeslimit)-1;
 const faerie=w.data.harasserFaerieNodes??DATA.faerie[String(w.id)];
 if(w.data.active?.[e.road]===false||node<bounds.start-1||node>bounds.visibleEnd-1||!route.points[node]||faerie?.[e.road]?.includes(node))return null;
 return node;
}
function animate(w,e,name){const s=e.harasser;s.phase=name;s.animation=name;s.at=w.time;e.action=name;e.actionAt=w.time;e.actionFlip=s.jumpFlip;e.anim=w.animationDuration('harraser',name);}
function unblock(w,e){for(const u of [...w.soldiers,w.hero].filter(Boolean)){if(u.targetId===e.id)u.targetId=null;if(u.combatTarget===e.id)u.combatTarget=null;if(u.pendingHit?.target===e&&!u.pendingHit.ranged)u.pendingHit=null;}e.blocked=false;e.pendingMelee=null;}
export function updateHarasserJump(w,e,dt=0){
 if(!e.harasser)return false;const s=e.harasser;
 if(s.jumpHidden){
  if(s.phase==='jumpOut'){if(w.time-s.at>=w.animationDuration('harraser','jumpOut')){const r=w.routes[e.road][e.lane],p=r.points[s.jumpNode];e.d=r.lengths[s.jumpNode];e.x=p.x;e.y=p.y;s.node=s.jumpNode;s.teleportedAt=w.time;animate(w,e,'jumpIn');}return true;}
  if(s.phase==='jumpIn'){
   if(w.time-s.at<w.animationDuration('harraser','jumpIn'))return true;
   e.visBans=s.previousBans;delete e._bans;s.jumpHidden=false;
   const a=w.template(e.key).shadow_shot,targets=[...w.soldiers,w.hero].filter(Boolean).filter(u=>{const t=w.template(u.key).vis;return u.hp>0&&!((u.visBans??t.bans??0)&a.vis_flags)&&!((u.visFlags??t.flags??0)&a.vis_bans)&&inEllipse(e,u,a.max_range)&&!inEllipse(e,u,a.min_range);}).sort((a,b)=>Math.hypot(e.x-a.x,e.y-a.y)-Math.hypot(e.x-b.x,e.y-b.y));
   if(targets.length){s.shadowTarget=targets[0];s.jumpFlip=s.shadowTarget.x<e.x;s.shadowFired=false;animate(w,e,'shadow_shot');}else{s.phase=null;e.anim=0;}return true;
  }
 }
 if(s.phase==='shadow_shot'){
  if(isEnemyStunned(e)||e.frozen){s.phase=null;e.anim=0;return true;}
  const a=w.template(e.key).shadow_shot;
  if(!s.shadowFired&&w.time-s.at>=a.shoot_time){s.shadowFired=true;launchHarasserArrow(w,e,s.shadowTarget,a);}
  if(w.time-s.at>=w.animationDuration('harraser','shadow_shot')){s.phase=null;e.anim=0;}
  return true;
 }
 if(s.phase)return false; // Source ranged coroutine completes before outer dodge handler.
 if(!e.blocked&&!isEnemyStunned(e)&&!e.frozen){const r=w.routes[e.road]?.[e.lane],p=r?.points[s.node??0];if(p&&Math.hypot(e.x-p.x,e.y-p.y)<2*e.speed*dt&&s.node<r.points.length-1)s.node++;}
 if(!s.dodgeActive||isEnemyStunned(e)||e.frozen)return false;
 if((e.visBans??w.template(e.key).vis.bans)===C.all)return true;
 s.dodgeActive=false;s.dodgeAt=w.time;const d=w.template(e.key).dodge,node=harasserJumpDestination(w,e,w.number(d.min_nodes,d.max_nodes));if(node===null)return false;
 s.jumpNode=node;s.previousBans=e.visBans??w.template(e.key).vis.bans;s.jumpFlip=e.anim>0?(e.actionFlip??e.dx<0):e.dx<0;e.visBans=C.all;s.jumpHidden=true;unblock(w,e);animate(w,e,'jumpOut');return true;
}
