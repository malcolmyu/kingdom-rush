import{routeNode,hopliteNodeValid}from'./hoplite.mjs';
import{faerieCell}from'./faerie.mjs';
import{spriteOrder}from'../render-order.mjs';
import{tweenValue}from'../skill-effects.mjs';
import{upgradeData,previousUpgrade}from'../upgrades.mjs';
const KEY='tower_druid',ROCK='rock_druid',inside=(a,b,r)=>((a.x-b.x)/r)**2+((a.y-b.y)/(r*.7))**2<=1;
const duration=(w,key)=>{const a=w.data.animations[key];if(!a)throw new Error('Missing Druid animation '+key);return(a.frames?.length||a.to-a.from+1)/30;};
export function initDruids(w,options={}){w.druidState={rocks:[],damage:[],fx:[]};let copy=false;for(const key of ['stone_el_druid_hardened_boulders','stone_el_druid_sharp_splinters']){const u=upgradeData.list[key],prev=previousUpgrade(key);if(!options.upgrades?.[key]||u.level>(w.data.rules.max_upgrade_level??Infinity)||prev&&!options.upgrades[prev])continue;if(!copy){w.templates={...w.templates,[ROCK]:structuredClone(w.template(ROCK))};copy=true;}const b=w.template(ROCK).bullet;if(u.damage_factor){b.damage_min=Math.ceil(b.damage_min*u.damage_factor);b.damage_max=Math.ceil(b.damage_max*u.damage_factor);}if(u.damage_area_factor)b.damage_radius=Math.ceil(b.damage_radius*u.damage_area_factor);}}
export const stage7TowerKey=(type,level)=>type==='artillery'&&level===4?KEY:undefined;
export function stage7TowerAllowed(w,type,level){if(level!==4||!['artillery','mage'].includes(type))return undefined;const key=type==='artillery'?KEY:'tower_wild_magus';return!!w.templates[key]&&!(w.data.rules.locked_towers||[]).includes(key);}
export function upgradeDruid(w,s){if(s.key===KEY){s.druid={last:w.time,phase:null,loaded:[],face:'Down',flip:false};s.cd=0;s.anim=0;}}
export function sellDruid(w,s){if(!s.druid)return;for(const b of w.druidState.rocks)if(b.owner===s&&!b.target)b.done=true;delete s.druid;}
export function druidPrediction(w,e,time){const r=w.routes[e.road][e.lane],v=e.motionVelocity||{x:0,y:0},node=Math.min(r.points.length-1,routeNode(w,e)+Math.ceil(time*Math.hypot(v.x,v.y)/6));return{node,pos:r.points[node]};}
function target(w,s){const a=w.template(KEY).attacks.list[0],center={x:s.x,y:s.y+w.template(KEY).tower.range_offset.y},r=w.template(KEY).attacks.range;return w.enemies.filter(e=>{const v=w.template(e.key).vis||{},p=druidPrediction(w,e,a.node_prediction);return e.hp>0&&!((e.visBans??v.bans??0)&a.vis_flags)&&!((e.visFlags??v.flags??0)&a.vis_bans)&&inside(center,e,r)&&!faerieCell(w.data.satyrRules.grid,p.pos);}).sort((a,b)=>(a.goal-a.d)-(b.goal-b.d))[0];}
function facing(w,s,p){const o=w.template(KEY).render.sprites[2].offset,a=Math.atan2(p.y-s.y-o.y,p.x-s.x-o.x);return{face:a>0&&a<Math.PI?'Up':'Down',flip:p.x<s.x};}
function beginLoad(w,s,e,shootAfter=false){const p=s.druid;Object.assign(p,facing(w,s,e||w.template(KEY).tower.long_idle_pos));p.phase={kind:'load',at:w.time,target:e,shootAfter,created:false};}
function beginShot(w,s,e,predicted){const p=s.druid;Object.assign(p,facing(w,s,predicted||druidPrediction(w,e,w.template(KEY).attacks.list[0].node_prediction).pos));p.phase={kind:'shoot',at:w.time,target:e,fired:false};}
function createRock(w,s){const p=s.druid,index=p.loaded.length+1,o=w.template(KEY).attacks.list[0].storage_offsets[index-1],raw=w.template(ROCK).bullet,b={id:++w.serial,owner:s,index,x:s.x+o.x,y:s.y+o.y,sx:s.x+o.x,sy:s.y+o.y,queuedAt:w.time,at:null,phase:'load',target:null,factor:w.template(KEY).tower.damage_factor,rotation:0,offsetY:0,lo:raw.damage_min,hi:raw.damage_max,radius:raw.damage_radius};p.loaded.push(b);w.druidState.rocks.push(b);}
function release(w,s,phase){const p=s.druid,a=w.template(KEY).attacks.list[0],e=target(w,s)||phase.target,pred=druidPrediction(w,e,a.node_prediction),center={x:s.x,y:s.y+w.template(KEY).tower.range_offset.y};if(!inside(center,pred.pos,w.template(KEY).attacks.range*1.05))return;
 for(const[i,b]of p.loaded.entries()){let to=pred.pos;if(i>0){const n=pred.node-(i-1)*5,node=hopliteNodeValid(w,e.road,n)?n:pred.node;to=w.routes[e.road][0].points[node];}b.target=e;b.to={x:to.x,y:to.y};}p.loaded=[];
}
export function updateDruid(w,s){if(!s.druid)return false;const p=s.druid,a=w.template(KEY).attacks.list[0],phase=p.phase;
 if(phase){const age=w.time-phase.at;if(phase.kind==='load'){if(!phase.created&&age>=16/30){phase.created=true;createRock(w,s);}if(age>=duration(w,'tower_druid_shooter_cast'+p.face)){if(phase.shootAfter)beginShot(w,s,phase.target,phase.predicted);else p.phase=null;}}
 else{if(!phase.fired&&age>=a.shoot_time){phase.fired=true;release(w,s,phase);}if(age>=duration(w,'tower_druid_shooter_shoot'+p.face))p.phase=null;}return true;}
 if(s.blocked)return true;
 if(w.time-p.last>a.cooldown){const e=target(w,s);if(e){p.last=w.time;const pred=druidPrediction(w,e,a.node_prediction).pos;if(!p.loaded.length){beginLoad(w,s,e,true);p.phase.predicted=pred;}else beginShot(w,s,e,pred);return true;}if(p.loaded.length<a.max_loaded_bullets){beginLoad(w,s,null);return true;}}
 if(w.time-p.last>w.template(KEY).tower.long_idle_cooldown)Object.assign(p,facing(w,s,w.template(KEY).tower.long_idle_pos));return true;
}
export function druidFalloff(pos,to,r,lo,hi,factor=1){const dx=pos.x-to.x,dy=pos.y-to.y,angle=Math.atan2(dy,dx),den=Math.hypot(r*Math.cos(angle),r*.7*Math.sin(angle)),f=Math.max(0,Math.min(1,Math.hypot(dx,dy)/den));return Math.ceil(factor*Math.floor(hi-(hi-lo)*f));}
function fx(w,key,pos,flip=false){w.druidState.fx.push({id:++w.serial,key,x:pos.x,y:pos.y,at:w.time,flip});}
export function updateDruidRocks(w,dt){const state=w.druidState;if(!state||!state.rocks.length&&!state.damage.length&&!state.fx.length)return;const pending=state.damage;state.damage=[];for(const d of pending){if(d.at>=w.time){state.damage.push(d);continue;}const e=d.target,h=w.template(e.key).health;if(!w.enemies.includes(e)||e.hp<=0||h.ignore_damage||((h.immune_to||0)&8))continue;const value=Math.round(d.value*(h.damage_factor??1));if(value>0)w.hurt(e,value,8);}
 const raw=w.template(ROCK).bullet;
 for(const b of state.rocks){if(b.done)continue;if(b.at===null){if(b.queuedAt>=w.time)continue;b.at=w.time;}
  if(b.phase!=='flight'){const age=w.time-b.at,load=duration(w,'druid_stone'+b.index+'_load');if(age<load)continue;if(b.readyAt===undefined){b.readyAt=w.time;continue;}if(!b.target){b.offsetY=tweenValue(w.template(ROCK).tween.props[0].keys.map(([t,v])=>[t,v.y]),(w.time-b.readyAt)%1.6);continue;}
   b.phase='flight';b.flightAt=w.time;b.vx=(b.to.x-b.sx)/raw.flight_time;b.vy=(b.to.y-b.sy-.5*raw.g*raw.flight_time**2)/raw.flight_time;b.spin=raw.rotation_speed*(b.to.x>b.sx?-1:1);fx(w,'fx_rock_druid_launch',{x:b.sx,y:b.sy},b.to.x<b.sx);continue;
  }
  const age=w.time-b.flightAt;if(age+dt<raw.flight_time){b.x=b.sx+b.vx*age;b.y=b.sy+b.vy*age+.5*raw.g*age**2;b.rotation=b.spin*age;continue;}
  b.done=true;for(const e of w.enemies){const v=w.template(e.key).vis||{};if(e.hp>0&&!((e.visBans??v.bans??0)&raw.damage_flags)&&!((e.visFlags??v.flags??0)&raw.damage_bans)&&inside(e,b.to,b.radius))state.damage.push({target:e,value:druidFalloff(e,b.to,b.radius,b.lo,b.hi,b.factor),at:w.time});}
  const grid=w.data.satyrRules.grid,x=Math.max(1,Math.min(grid.grid.length,Math.ceil((b.to.x-grid.ox)/16))),y=Math.max(1,Math.min(grid.grid[0].length,Math.ceil((b.to.y-grid.oy)/16))),water=!!(grid.grid[x-1][y-1]&w.data.satyrRules.water);fx(w,water?raw.hit_fx_water:raw.hit_fx,b.to);if(!water)fx(w,raw.hit_decal,b.to);
 }
 state.rocks=state.rocks.filter(b=>!b.done);state.fx=state.fx.filter(f=>w.time-f.at<(f.key==='decal_rock_crater'?2.5:effectDuration(w,f.key)));
}
const effectDuration=(w,key)=>{const s=w.template(key).render.sprites[0];return duration(w,s.prefix?s.prefix+'_'+s.name:s.name);};
export const druidBusy=w=>!!(w.druidState?.damage.length||w.druidState?.rocks.some(b=>b.phase==='flight'));
export function drawDruidTower(r,w,s){if(!s.druid)return false;const p=s.druid,phase=p.phase,state=phase?phase.kind==='load'?'load':'shoot':'idle';r.entity(s.key,s,{time:0,spriteStates:{3:{state,time:phase?w.time-phase.at:0,facing:p.face,flip:p.flip}},overrides:{'tower.terrain_style':s.terrain}});return true;}
export function drawDruidRocks(r,w){for(const b of w.druidState?.rocks||[]){if(b.at===null)continue;const s=w.template(ROCK).render.sprites[0],age=w.time-b.at,flight=b.phase==='flight',raw=w.template(ROCK).bullet;if(flight&&(Math.hypot(b.x-b.sx,b.y-b.sy)<raw.hide_radius||Math.hypot(b.x-b.to.x,b.y-b.to.y)<raw.hide_radius))continue;const key=r.frame('druid_stone'+b.index+'_'+(age<duration(w,'druid_stone'+b.index+'_load')?'load':'travel'),age,false),pos={x:b.x,y:b.y+b.offsetY},q=r.screen(pos);if(!key)throw new Error('Missing original Druid stone');r.sprite(r.ctx,key,q.x,q.y,1,s.anchor.x,1-s.anchor.y,false,s.alpha/255,flight?b.rotation:0,spriteOrder({...s,z:flight?3400:3000,sort_y_offset:flight?0:s.sort_y_offset},b,1,b.id));}
 for(const f of w.druidState?.fx||[]){const raw=w.template(f.key).render.sprites[0],alpha=f.key==='decal_rock_crater'?tweenValue(w.template(f.key).tween.props[0].keys,w.time-f.at)/255:1;r.entity(f.key,f,{time:w.time-f.at,flip:f.flip,alpha});}
}
