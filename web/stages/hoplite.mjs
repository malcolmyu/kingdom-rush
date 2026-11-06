import{isEnemyStunned}from'../enemy-status.mjs';
const key='enemy_satyr_hoplite';
const attack=w=>w.template(key).timed_attacks.list[0];
const difficulty=(w,x)=>Array.isArray(x)?x[w.difficulty-1]:x;
export function initHoplites(w){w.hopliteState={spawners:[],pending:[],members:new Set(),counts:{}};}
export function routeNode(w,e){const r=w.routes[e.road][e.lane];let lo=0,hi=r.lengths.length-1;while(lo<hi){const m=Math.ceil((lo+hi)/2);if(r.lengths[m]<=e.d)lo=m;else hi=m-1;}return lo;}
export function nodesToDefend(w,e){const r=w.routes[e.road][e.lane];let goal=r.lengths.findIndex(d=>d>=r.goal);if(goal<0)goal=r.points.length-1;return goal-routeNode(w,e);}
function sweep(w){const s=w.hopliteState;for(const e of s.members)if(!w.enemies.includes(e)&&!e.hopliteGroup.inLimbo){s.members.delete(e);s.counts[e.hopliteGroup.name]=Math.max(0,(s.counts[e.hopliteGroup.name]||0)-1);}}
export function registerHopliteChild(w,e){const s=w.hopliteState;if(s.members.has(e)){e.hopliteGroup.inLimbo=false;return;}s.members.add(e);s.counts[e.hopliteGroup.name]=(s.counts[e.hopliteGroup.name]||0)+1;}
export function hopliteCount(w,name=attack(w).count_group_name){sweep(w);return w.hopliteState.counts[name]||0;}
export function insertHoplite(w,e){if(e.key!==key)return;e.hoplite={phase:null,at:w.time,ts:w.time,spreadSeed:w.number(1,10),walkEpisode:true};e.cd=w.template(key).melee.attacks[0].cooldown;}
export function holdsHopliteMelee(e){return !!e.hoplite?.phase||!!e.satyrRaise;}
export function hopliteHealthHidden(e){return e.satyrRaise?true:undefined;}
export function hopliteKeepCorpse(w,e){if(e.key===key||e.hopliteGroup)return w.time-e.deadAt<=w.template(e.key).health.dead_lifetime;return undefined;}
export function hopliteOpaque(e){return e.hp<=0&&(e.key===key||!!e.hopliteGroup);}
function ready(w,e){const a=attack(w),s=e.hoplite;return w.time-s.ts>difficulty(w,a.cooldown)&&(e.canDoMagic??w.template(key).enemy.can_do_magic)&&hopliteCount(w,a.count_group_name)<a.count_group_max&&nodesToDefend(w,e)>a.nodes_limit;}
export function updateHoplite(w,e){
 if(e.satyrRaise){if(w.time-e.satyrRaise.at>=w.animationDuration('satyr','raise')){e.satyrRaise=null;e.anim=0;e.action='idle';}return true;}
 if(e.key!==key)return undefined;
 const a=attack(w),s=e.hoplite;
 if(s.phase){if(w.time-s.at<(s.released?w.animationDuration('satyrHoplite',a.animation):a.spawn_time)&&(isEnemyStunned(e)||e.frozen)){if(s.spawner)s.spawner.interrupt=true;s.phase=null;e.anim=0;e.action='idle';s.walkEpisode=false;return true;}
  const age=w.time-s.at;
  if(!s.released&&age>=a.spawn_time){s.released=true;s.ts=w.time;const node=routeNode(w,e);s.spawner={id:++w.serial,at:w.time,road:e.road,lane:e.lane,node,attempts:0,nextAt:w.time,inserted:false,interrupt:false,group:a.count_group_name,type:a.count_group_type,max:a.count_group_max};w.hopliteState.spawners.push(s.spawner);w.emit('stage_enemy_sound',{key:a.sound,source:e.id});}
  if((isEnemyStunned(e)||e.frozen)&&age<w.animationDuration('satyrHoplite',a.animation)){if(s.spawner)s.spawner.interrupt=true;s.phase=null;e.anim=0;e.action='idle';s.walkEpisode=false;return true;}
  if(age>=w.animationDuration('satyrHoplite',a.animation)){s.ts=w.time;s.phase=null;s.spawner=null;e.anim=0;e.action='idle';s.walkEpisode=true;}return true;
 }
 if(isEnemyStunned(e)||e.frozen){s.walkEpisode=false;e.anim=0;e.action='idle';return true;}
 if(e.pendingMelee||e.anim>0)return false;
 if(ready(w,e)&&(!s.walkEpisode||Math.floor(w.time*10)%s.spreadSeed===0)){s.phase=a.animation;s.at=w.time;s.released=false;e.action=a.animation;e.actionAt=w.time;e.anim=w.animationDuration('satyrHoplite',a.animation);e.actionFlip=false;return true;}
 s.walkEpisode=true;return false;
}
export function hopliteNodeValid(w,road,node){const r=w.routes[road]?.[0];if(!r||node<0||node>=r.points.length||w.data.active?.[road]===false)return false;
 const width=Math.max(1024,Math.min(768*16/9,Math.ceil(768*(w.harasserAspect||4/3)))),left=(1024-width)/2,right=(1024+width)/2,pan=w.data.level.pan_extension||{},p=r.points[node];if(p.x<left||p.x>right||p.y<(pan.bottom||0)||p.y>768+(pan.top||0))return false;
 const ranges=w.data.level.invalid_path_ranges?.[String(road+1)]||[];return !Object.values(ranges).some(([from,to,flags])=>node+1>=from&&node+1<=to&&((w.data.hopliteRules.nfAll&~flags)===0));}
export function updateHopliteQueues(w){const s=w.hopliteState;if(!s)return;sweep(w);
 // Pending inserts are not reserved against the source count group in advance.
 const pending=s.pending;s.pending=[];for(const p of pending){if(p.at>=w.time){s.pending.push(p);continue;}const e=w.spawn({key:p.key,road:p.road,lane:p.lane}),r=w.routes[p.road][p.lane];e.d=r.lengths[p.node];Object.assign(e,r.points[p.node]);const next=r.points[Math.min(p.node+1,r.points.length-1)];e.dx=next.x-e.x;e.dy=next.y-e.y;e.actionFlip=e.dx<0;e.gold=0;e.hopliteGroup={name:p.group,type:p.type,inLimbo:false};registerHopliteChild(w,e);e.satyrRaise={at:w.time};e.action='raise';e.actionAt=w.time;e.anim=w.animationDuration('satyr','raise');}
 for(const e of w.enemies)if(e.hoplite?.phase){const unfinished=w.time-e.hoplite.at<w.animationDuration('satyrHoplite',attack(w).animation);if(unfinished&&(e.hp<=0||isEnemyStunned(e)||e.frozen)&&e.hoplite.spawner)e.hoplite.spawner.interrupt=true;if(e.hp<=0)e.hoplite.phase=null;}
 const data=w.template('satyr_hoplite_spawner').spawner;
 for(const p of s.spawners){if(!p.inserted){if(p.at>=w.time)continue;p.inserted=true;p.nextAt=w.time;}
  if(p.interrupt){p.done=true;continue;}if(w.time<p.nextAt)continue;if(p.attempts>=data.count){p.done=true;continue;}
  let produced=false;while(p.attempts<data.count){if(hopliteCount(w,p.group)>=p.max){p.done=true;break;}p.attempts++;
   const lane=data.allowed_subpaths[w.number(1,data.allowed_subpaths.length)-1]-1,node=p.node+w.number(...data.random_node_offset_range);
   if(data.check_node_valid&&!hopliteNodeValid(w,p.road,node))continue;
   produced=true;s.pending.push({at:w.time,key:data.entity,road:p.road,lane,node,group:p.group,type:p.type});p.nextAt=w.time+data.random_cycle[0]+w.random()*(data.random_cycle[1]-data.random_cycle[0]);break;
  }
  if(!produced&&p.attempts>=data.count)p.done=true;
 }
 s.spawners=s.spawners.filter(p=>!p.done);
 
}
export const hopliteBusy=w=>!!(w.hopliteState?.pending.length||w.hopliteState?.spawners.length);
