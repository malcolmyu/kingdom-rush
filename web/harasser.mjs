import{tryBladeDodge}from'./blade-dodge.mjs';
import{isEnemyStunned}from'./enemy-status.mjs';
import DATA from'./harasser-data.mjs';
import{inEllipse}from'./spells.mjs';
import{tryEwokDodge}from'./ewok-shield.mjs';
const members=w=>[...w.soldiers,...(w.stageHeroes||[]),w.hero].filter(Boolean);
const flags=(w,u)=>({flags:u.visFlags??w.template(u.key).vis?.flags??0,bans:u.visBans??w.template(u.key).vis?.bans??0});
export function insertHarasser(w,e){if(e.key==='enemy_twilight_elf_harasser')e.harasser={rangedAt:w.time,phase:null,node:0};}
export function updateHarasserMarks(w){if(!w.harasserMarks)return;w.harasserMarks=w.harasserMarks.filter(m=>{if(m.target.hp>0&&members(w).includes(m.target)&&w.time-m.at<=DATA.mark.modifier.duration)return true;m.target.visBans=((m.target.visBans??0)&~DATA.mark.mark_flags.vis_bans)|m.previous;return false;});}
function mark(w,target){const bit=DATA.mark.mark_flags.vis_bans,bans=flags(w,target).bans;target.visBans=bans|bit;(w.harasserMarks??=[]).push({target,at:w.time,previous:bans&bit});}
const duration=(w,e,name)=>w.animationDuration(w.template(e.key).render.sprites[0].prefix,name);
function phase(w,e,name){const s=e.harasser;s.phase=name;s.at=w.time;s.animation=w.template(e.key).ranged.attacks[0].animations[['start','loop','end'].indexOf(name)];w.enemyAction(e,s.target,s.animation);}
export function updateHarasser(w,e){
 if(!e.harasser)return false;const s=e.harasser,a=w.template(e.key).ranged.attacks[0];
 if(e.hp<=0){s.phase=null;return false;}
 if(s.phase){
  if(s.phase==='start'){if(w.time-s.at>=duration(w,e,s.animation)){s.count=1;s.fired=false;phase(w,e,'loop');}return true;}
  if(s.phase==='end'){if(w.time-s.at>=duration(w,e,s.animation)){s.phase=null;e.anim=0;e.action='idle';}return true;}
  const age=w.time-s.at;
  if(!s.fired){if(age<a.shoot_time){if(isEnemyStunned(e)||e.frozen)phase(w,e,'end');return true;}s.fired=true;launchHarasserArrow(w,e,s.target,a);}
  if(isEnemyStunned(e)||e.frozen){phase(w,e,'end');return true;}
  if(age>=duration(w,e,s.animation)){if(s.count>=a.loops)phase(w,e,'end');else{s.count++;s.fired=false;phase(w,e,'loop');}}
  return true;
 }
 if(isEnemyStunned(e)||e.frozen){e.action='idle';e.anim=0;return true;}
 if(e.blocked||e.pendingMelee||e.anim>0||w.time-s.rangedAt<=a.cooldown)return false;
 const candidates=members(w).filter(u=>{const f=flags(w,u);return u.hp>0&&!(f.bans&a.vis_flags)&&!(f.flags&a.vis_bans)&&inEllipse(e,u,a.max_range)&&!inEllipse(e,u,a.min_range);}).sort((a,b)=>Math.hypot(e.x-a.x,e.y-a.y)-Math.hypot(e.x-b.x,e.y-b.y));
 if(!candidates.length)return false;s.target=candidates[0];s.rangedAt=w.time;mark(w,s.target);phase(w,e,'start');return true;
}
export function launchHarasserArrow(w,e,target,a){
 const template=w.template(a.bullet),b=template.bullet;
 // Dedicated insert randomizes flight before scripts.arrow checks target existence.
 const range=template.flight_time_range,time=range?range[0]+w.random()*(range[1]-range[0]):b.flight_time;if(!members(w).includes(target))return null;
 const o=a.bullet_start_offset[0],hit=w.template(target.key).unit.hit_offset,x=e.x+(e.actionFlip?-1:1)*o.x,y=e.y+o.y,tx=target.x+hit.x,ty=target.y+hit.y;
 const shot={id:++w.serial,type:'harasser-arrow',bullet:a.bullet,source:e.id,target,sx:x,sy:y,x,y,tx,ty,elapsed:0,duration:time,g:b.g,createdAt:w.time,rotation:0,velocity:{x:(tx-x)/time,y:(ty-y-.5*b.g*time*time)/time}};w.shots.push(shot);return shot;
}
export function updateHarasserArrow(w,b,dt){
 if(b.done||w.time===b.createdAt)return;
 if(b.elapsed+dt<=b.duration){const x=b.x,y=b.y;b.elapsed+=dt;b.x=b.sx+b.velocity.x*b.elapsed;b.y=b.sy+b.velocity.y*b.elapsed+b.g*b.elapsed*b.elapsed/2;b.rotation=Math.atan2(b.y-y,b.x-x);return;}
 b.done=true;const t=b.target,a=w.template(b.bullet).bullet,off=w.template(t.key).unit.hit_offset;
 if(members(w).includes(t)&&t.hp>0&&Math.hypot(b.x-t.x-off.x,b.y-t.y-off.y)<a.hit_distance&&!tryEwokDodge(w,t,{ranged:true})&&!tryBladeDodge(w,t,{ranged:true})){b.hit=true;b.damage=Math.ceil(a.damage_min+w.random()*(a.damage_max-a.damage_min));w.hurtDefender(t,b.damage,a.damage_type);}
}
