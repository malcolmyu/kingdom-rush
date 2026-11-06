import DATA from './stage5-alleria-data.mjs';
import {harasserPathBounds} from './harasser-jump.mjs';
// Source controller's attack is animation/sound only, never queue_damage.
export function catCellAllowed(p){const g=DATA.catGrid,x=Math.max(1,Math.min(g.grid.length,Math.ceil((p.x-g.ox)/16))),y=Math.max(1,Math.min(g.grid[0].length,Math.ceil((p.y-g.oy)/16)));return !(g.grid[x-1][y-1]&DATA.catRules.blocked);}
export function catRallyPoint(w,p){
 let best=null,distance=Infinity;
 for(let road=0;road<w.routes.length;road++){if(w.data.active?.[road]===false)continue;const bounds=harasserPathBounds(w,road);if(!bounds)continue;
  for(let lane=0;lane<w.routes[road].length;lane++)for(let node=bounds.start-1;node<bounds.visibleEnd;node++){const q=w.routes[road][lane].points[node],d=Math.hypot(q.x-p.x,q.y-p.y);if(d<distance){best={road,lane,node};distance=d;}}
 }
 if(!best)return null;const node=best.node-5,b=harasserPathBounds(w,best.road),q=w.routes[best.road][best.lane].points[node];
 if(node<b.start-1||node>=b.visibleEnd||!q||!catCellAllowed(q))return null;
 return{...q,road:best.road,lane:best.lane,node};
}
export function queueAlleriaCat(w,owner){if(owner.catQueued)return;owner.catQueued=true;const p=owner.fixedMode?owner.catPos:catRallyPoint(w,owner);if(!p)return;w.catQueue={owner,pos:p,at:w.time};}
export function rallyAlleriaCat(w,owner,p){const cat=w.alleriaCats?.find(c=>c.owner===owner),q=catRallyPoint(w,p);if(cat&&q)cat.rallyRequest={x:q.x,y:q.y};}
function animate(w,c,phase,action=phase,runs=1){c.phase=phase;c.action=action;c.at=w.time;c.runs=runs;c.walking=false;}
const duration=(w,c)=>w.animationDuration('alleria_wildcat',c.action)*c.runs;
function walk(w,c,p,dt){const dx=p.x-c.x,dy=p.y-c.y,d=Math.hypot(dx,dy),step=w.template(c.key).motion.max_speed*dt;if(d<=step){c.x=p.x;c.y=p.y;return true;}c.x+=dx/d*step;c.y+=dy/d*step;return false;}
const random=(w,a,b)=>a+(b-a)*w.random();
export function updateAlleriaCats(w,dt){
 if(w.catQueue&&w.catQueue.at<w.time){const{owner,pos}=w.catQueue;w.catQueue=null;(w.alleriaCats??=[]).push({id:++w.serial,key:'alleria_cat',catCompanion:true,owner,x:pos.x,y:pos.y,hp:150,maxHp:150,phase:'stand',action:'toStand',at:w.time,runs:1,attackAt:w.time,attackCooldown:2,scaredAt:w.time,scaredCooldown:5,flip:false,...(owner.fixedMode?{sourceZ:w.template(owner.key).render.sprites[0].z,fixedMode:true}:{})});}
 for(const c of w.alleriaCats||[]){const t=w.template(c.key),a=t.behaviour_attack,b=t.behaviour_scared,h=c.owner,age=w.time-c.at;
  if(c.phase==='rally'||c.phase==='approach'){if(walk(w,c,c.destination,dt)){if(c.phase==='approach'){animate(w,c,'attack',a.animation);c.sounded=false;}else animate(w,c,'idle');}continue;}
  if(c.phase==='attack'){if(!c.sounded&&age>=a.hit_time){c.sounded=true;w.emit('stage_ally_sound',{key:a.sound,source:c.id});}if(age>=duration(w,c)){c.attackCooldown=random(w,a.min_cooldown,a.max_cooldown);c.attackAt=w.time;animate(w,c,'idle');}continue;}
  if(c.phase==='scared'){if(age>=duration(w,c)){c.scaredCooldown=random(w,b.min_cooldown,b.max_cooldown);c.scaredAt=w.time;animate(w,c,'idle');}continue;}
  if(c.phase==='stand'){if(age>=duration(w,c))animate(w,c,'idle');continue;}
  if(c.phase==='toSad'){if(age>=duration(w,c))animate(w,c,'sigh','sadSigh');continue;}
  if(c.phase==='sigh'){if(age>=duration(w,c)){c.until=w.time+random(w,1.5,3);c.phase='sadWait';}continue;}
  if(c.phase==='sadWait'){if(w.time>=c.until)animate(w,c,h.hp<=0||h.phase==='respawn'?'sigh':'stand',h.hp<=0||h.phase==='respawn'?'sadSigh':'toStand');continue;}
  // Source checks new rally before owner-death and does not interrupt an
  // animation or its walk/wait coroutine halfway through.
  if(c.rallyRequest){c.destination=c.rallyRequest;delete c.rallyRequest;c.flip=c.destination.x<c.x;animate(w,c,'rally','walk');c.walking=true;continue;}
  if(h.hp<=0||h.phase==='respawn'){animate(w,c,'toSad');continue;}
  const target=w.enemies.find(e=>e.id===h.combatTarget);
  if(target){if(w.time-c.attackAt>c.attackCooldown){const d=Math.hypot(target.x-c.x,target.y-c.y);if(d>a.min_distance&&d<a.max_distance){c.destination={x:target.x,y:target.y+a.y_offset};c.flip=target.x<c.x;animate(w,c,'approach','walk');c.walking=true;}else{animate(w,c,'attack',a.animation);c.sounded=false;}}
   else if(w.time-c.scaredAt>c.scaredCooldown)animate(w,c,'scared',b.animation,2);
  }
 }
}
export function catPose(w,c){const time=w.time-c.at;return{...(c.fixedMode?{overrides:{'render.sprites[1].z':c.sourceZ}}:{}),state:c.action,time:c.phase==='sadWait'?w.animationDuration('alleria_wildcat','sadSigh'):c.phase==='scared'?time%w.animationDuration('alleria_wildcat','scared'):time,flip:c.flip};}
