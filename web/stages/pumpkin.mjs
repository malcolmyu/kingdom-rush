import{spriteOrder}from'../render-order.mjs';
import{tweenValue}from'../skill-effects.mjs';
const list=x=>Array.isArray(x)?x:Object.values(x||{}),inside=(a,b,r)=>((a.x-b.x)/r)**2+((a.y-b.y)/(r*.7))**2<=1;
const duration=(w,p,state)=>w.animationDuration(w.template(p.key).render.sprites[0].prefix,state);
const valid=(w,e,flags,bans)=>{const t=w.template(e.key);return e.hp>0&&!((e.visBans??t.vis?.bans??0)&flags)&&!((e.visFlags??t.vis?.flags??0)&bans);};
function phase(w,p,name){p.pumpkin.phase=name;p.pumpkin.at=w.time;}
export function initPumpkins(w){if(w.id!==7)return;w.pumpkinState={pending:[],damage:[],mods:[],fx:[]};for(const e of w.data.level.entities_list)if(e.template==='plant_poison_pumpkin'){const p={id:w.plants.length,...e.pos,key:e.template,source:e,clickRect:w.template(e.template).ui.click_rect,cd:25,anim:0,label:'释放毒南瓜',description:'准备完成后点击，释放范围毒雾；恢复25秒',notReadyText:'毒南瓜尚未准备完成',pumpkin:{phase:'waiting',at:0,smoke:0}};w.plants.push(p);}}
export function clickPumpkin(w,id){const p=w.plants[id];if(!p?.pumpkin)return undefined;if(!w.active(true)||p.blocked||p.pumpkin.phase!=='idle')return false;p.pumpkin.clicked=true;return true;}
function removeSlow(w,m){if(m.removed)return;m.removed=true;if(w.enemies.includes(m.target))m.target.speed/=w.template(m.key).slow.factor;}
function insert(w,m){const e=m.target,t=w.template(e.key),raw=w.template(m.key),slow=!!raw.slow;if(!w.enemies.includes(e)||e.hp<=0||!t.health||slow&&(!t.motion||(e.motionInvulnerable??t.motion.invulnerable))||!slow&&!valid(w,e,raw.modifier.vis_flags,raw.modifier.vis_bans))return;
 const old=w.pumpkinState.mods.find(q=>!q.removed&&q.target===e&&q.key===m.key);if(old){old.ts=w.time;return;}
 if(slow)e.speed*=raw.slow.factor;w.pumpkinState.mods.push({...m,at:w.time,ts:w.time,dpsAt:raw.dps?w.time-raw.dps.damage_every:undefined});
}
function smoke(w,p,index){for(const[k,x,y,flipX,flipY]of w.data.pumpkinRules.smoke[index])w.pumpkinState.fx.push({id:++w.serial,key:'fx_plant_poison_pumpkin_smoke_'+k,x:p.x+x,y:p.y+y,flipX,flipY,at:w.time});}
export function updatePumpkins(w){const s=w.pumpkinState;if(!s)return;
 // Original insert/update/damage queues are separate coroutine responsibilities.
 const damages=s.damage;s.damage=[];for(const d of damages){if(d.at>=w.time){s.damage.push(d);continue;}const e=d.target,t=w.template(e.key),h=t.health;if(!w.enemies.includes(e)||e.hp<=0||h.ignore_damage||((h.immune_to||0)&d.type))continue;const value=Math.floor(Math.round(d.value*(h.damage_factor??1))*Math.max(0,Math.min(1,1-(e.poisonArmor??h.poison_armor??0))));e.hp-=value;if(value>0)e.flash=.1;if(e.hp<=0)w.finishEnemyDeath(e);}
 const pending=s.pending;s.pending=[];for(const m of pending)if(m.queuedAt<w.time)insert(w,m);else s.pending.push(m);
 for(const m of s.mods){if(m.removed)continue;const e=m.target,t=w.template(m.key);if(!w.enemies.includes(e)||e.hp<=0||(t.dps?w.time-m.ts>=t.modifier.duration-1e-9:w.time-m.ts>t.modifier.duration)){if(t.slow)removeSlow(w,m);else m.removed=true;continue;}if(t.dps&&w.time-m.dpsAt>=t.dps.damage_every){m.dpsAt+=t.dps.damage_every;s.damage.push({target:e,value:w.number(t.dps.damage_min,t.dps.damage_max),type:t.dps.damage_type,at:w.time});}}
 s.mods=s.mods.filter(m=>!m.removed);
 for(const p of w.plants){if(!p.pumpkin)continue;const a=w.template(p.key).custom_attack,m=p.pumpkin,age=w.time-m.at;
  if(m.phase==='waiting'){if(w.wave>=1&&!p.blocked)phase(w,p,'loading');}
  else if(m.phase==='loading'){if(p.blocked)phase(w,p,'waiting');else if(age>=a.cooldown){phase(w,p,'ready');w.emit('stage_plant_ready',{key:'PLANT_VENOM'});}}
  else if(m.phase==='ready'){if(age>=duration(w,p,'ready'))phase(w,p,'idle');}
  else if(m.phase==='idle'){if(p.blocked)phase(w,p,'waiting');else if(m.clicked){m.clicked=false;m.smoke=0;phase(w,p,'shoot');w.emit('stage_plant_cast',{key:p.key});}}
  else if(m.phase==='shoot'){
   const times=[9/30,15/30,17/30];while(m.smoke<3&&age>=times[m.smoke])smoke(w,p,m.smoke++);
   if(!m.released&&age>=w.data.pumpkinRules.release){m.released=true;for(const e of w.enemies)if(valid(w,e,a.vis_flags,a.vis_bans)&&inside(e,p,a.range))for(const key of a.mods)s.pending.push({id:++w.serial,key,target:e,source:p.id,queuedAt:w.time});}
   if(age>=duration(w,p,'shoot')){m.released=false;phase(w,p,p.blocked?'waiting':'loading');}
  }
  p.cd=m.phase==='loading'?Math.max(0,a.cooldown-(w.time-m.at)):m.phase==='idle'?0:a.cooldown;
 }
 s.fx=s.fx.filter(f=>w.time-f.at<fxDuration(w,f.key));
}
const fxDuration=(w,key)=>{const t=w.template(key),s=t.render.sprites[0];return t.tween?Math.max(...t.tween.props.map(p=>p.keys.at(-1)[0])):((w.data.animations[s.name]?.frames?.length||w.data.animations[s.name]?.to-w.data.animations[s.name]?.from+1)/30);};
function pose(w,key,pos,age,{id=0,flipX=false,flipY=false,offset={x:0,y:0},state}={}){const t=w.template(key),s=t.render.sprites[0];let scale={x:1,y:1},alpha=s.alpha??255,off={...offset};for(const p of t.tween?.props||[]){if(p.name==='alpha')alpha=tweenValue(p.keys,age);if(['scale','offset'].includes(p.name)){const q={x:tweenValue(p.keys.map(([t,v])=>[t,v.x]),age),y:tweenValue(p.keys.map(([t,v])=>[t,v.y]),age)};if(p.name==='scale')scale=q;else{off.x+=(flipX?-1:1)*q.x;off.y+=q.y;}}}return{key:s.animated?(state?s.prefix+'_'+state:s.name):s.name,age,loop:state?['loading','idle'].includes(state):s.loop!==false,alpha:alpha/255,scale,flipX:flipX||s.flip_x,flipY,anchor:s.anchor,pos:{x:pos.x+off.x,y:pos.y+off.y},order:spriteOrder(s,pos,1,id)};}
export function pumpkinSprites(w,p){const m=p.pumpkin,name=['waiting','loading'].includes(m.phase)?'loading':m.phase,items=[pose(w,p.key,p,w.time-m.at,{state:name,id:p.id+1})];if(name==='idle')for(const [i,o]of[[-30,30],[-5,28],[32,30]].entries())items.push(pose(w,'fx_plant_poison_pumpkin_idle',p,w.time,{offset:{x:o[0],y:o[1]},flipX:i<2,id:p.id+100+i}));return items;}
function draw(r,p){if(p.alpha<=0)return;const key=r.frame(p.key,p.age,p.loop),q=r.screen(p.pos);if(!key)throw new Error('Missing pumpkin animation '+p.key);const render=()=>{const c=r.ctx;c.save();c.translate(q.x,q.y);c.scale(p.scale.x*(p.flipX?-1:1),p.scale.y*(p.flipY?-1:1));r.sprite(c,key,0,0,1,p.anchor.x,1-p.anchor.y,false,p.alpha);c.restore();};r.orderQueue?r.orderQueue.add(p.order,render):render();}
export function drawPumpkin(r,w,p){if(!p.pumpkin)return false;for(const s of pumpkinSprites(w,p))draw(r,s);return true;}
export function drawPumpkinEffects(r,w){for(const f of(w.pumpkinState?.fx||[]).filter(f=>f.at<w.time))draw(r,pose(w,f.key,f,w.time-f.at,{...f,id:f.id}));for(const m of w.pumpkinState?.mods||[]){const t=w.template(m.key);if(!t.render)continue;const e=m.target,s=t.render.sprites[0],o=w.template(e.key).unit.mod_offset||{x:0,y:0},name=s.size_names[w.template(e.key).unit.size-1];const p=pose(w,m.key,e,w.time-m.at,{id:m.id,offset:o});p.key=s.prefix+'_'+name;p.order.z=w.template(e.key).render.sprites[0].z;draw(r,p);}}
export const pumpkinRuntime={init:initPumpkins,step:updatePumpkins,activatePlant:clickPumpkin,drawPlant:drawPumpkin,draw:drawPumpkinEffects};
