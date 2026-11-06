import DATA from './fixed-alleria-data.mjs';
import CAT from './stage5-alleria-data.mjs';
import{queueAlleriaCat}from'./alleria-cat.mjs';
import{launchAlleriaArrow}from'./stage5-alleria.mjs';
import{harasserHidden}from'./harasser-jump.mjs';
import{inEllipse}from'./spells.mjs';
export const fixedAlleriaRegion=p=>DATA.regions.some(([x,y,r,k])=>((p.x-x)/r)**2+((p.y-y)/(r*k))**2<=1);
export function initFixedAlleria(w){if(w.id!==6)return;w.templates={...w.templates,...DATA.templates,alleria_cat:CAT.templates.alleria_cat};const t=w.template('hero_alleria_fixed');w.fixedAlleria={id:++w.serial,key:'hero_alleria_fixed',fixedAlly:true,fixedMode:true,...DATA.pos,catPos:{...DATA.catPos},hp:t.health.hp_max,maxHp:t.health.hp_max,phase:'intro',action:'respawn',at:w.time,attackTimes:[0,0],flip:false};}
const allowed=(w,e,a)=>e.hp>0&&!harasserHidden(e)&&!((e.visBans??w.template(e.key).vis?.bans??0)&a.vis_flags)&&!((e.visFlags??w.template(e.key).vis?.flags??0)&a.vis_bans);
export function updateFixedAlleria(w,live){const h=w.fixedAlleria;if(!h)return;const t=w.template(h.key),duration=()=>w.animationDuration(t.render.sprites[0].prefix,h.action);
 if(h.phase==='intro'){if(w.time-h.at>=duration()){h.phase='idle';h.action='idle';h.at=w.time;queueAlleriaCat(w,h);}return;}
 if(h.pending){const p=h.pending,a=t.ranged.attacks[p.index];if((h.stunned||h.frozen)&&(p.fired||w.time-h.at<a.shoot_time)){if(p.fired)h.attackTimes[p.index]=h.at;h.pending=null;h.phase='idle';h.action='idle';h.at=w.time;return;}
  if(!p.fired&&w.time-h.at>=a.shoot_time){p.fired=true;if(Math.hypot(p.target.x-p.origin.x,p.target.y-p.origin.y)>a.max_track_distance){h.pending=null;h.phase='idle';h.action='idle';h.at=w.time;return;}launchAlleriaArrow(w,h,p.target,a);}
  if(w.time-h.at>=duration()){h.attackTimes[p.index]=h.at;h.pending=null;h.phase='idle';h.action='idle';h.at=w.time;}return;
 }
 for(const index of[1,0]){const a=t.ranged.attacks[index];if(w.time-h.attackTimes[index]<a.cooldown)continue;const target=live.filter(e=>allowed(w,e,a)&&fixedAlleriaRegion(e)&&inEllipse(h,e,a.max_range)).sort((a,b)=>Number(b.flying)-Number(a.flying)||(a.goal-a.d)-(b.goal-b.d))[0];if(!target)continue;if(w.random()>a.chance){h.attackTimes[index]=w.time;continue;}h.flip=target.x<h.x;h.action=a.animation==='ranged'?'shoot':a.animation;h.at=w.time;h.phase='attack';h.pending={index,target,origin:{x:target.x,y:target.y},fired:false};break;}
}
