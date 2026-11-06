import{queueArcaneSlumber,reduceArcaneArmor}from'./arcane-slumber.mjs';
import{queueArcaneBurst}from'./arcane-burst.mjs';
import{harasserHidden}from'./harasser-jump.mjs';
const center=(w,s)=>{const o=w.template(s.key).tower.range_offset;return{x:s.x+o.x,y:s.y+o.y};};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function animate(w,s,index,e,animation='shoot'){const raw=w.template(s.key).render.sprites[index+2],o=raw.offset;s.arcane.shooters[index]={at:w.time,facing:e.y>s.y+o.y?'Up':'Down',flip:false,animation};}
function launch(w,s,index,e,a=w.template(s.key).attacks.list[0],level=0){
 const t=w.template(s.key),b=w.template(a.bullet).bullet,p=center(w,s);
 if(distance(p,e)>t.attacks.range*(level?1.1:1)||!w.enemies.includes(e))return;
 const off=t.render.sprites[index+2].offset,bo=a.bullet_start_offset[e.y>p.y?0:1],h=w.template(e.key).unit.hit_offset,v=e.motionVelocity||{x:0,y:0};
 const sx=s.x+off.x+bo.x*(e.x>p.x?1:-1),sy=s.y+off.y+bo.y;
 let tx=e.x+h.x,ty=e.y+h.y;const duration=b.flight_time_min+Math.hypot(tx-sx,ty-sy)/t.attacks.range*b.flight_time_factor;
 tx+=v.x*duration+(v.x&&b.prediction_error?w.random()*10:0);ty+=v.y*duration-(v.y&&b.prediction_error?w.random()*10:0);
 w.shots.push({id:++w.serial,type:'arcane-arrow',bullet:a.bullet,target:e,level,sx,sy,x:sx,y:sy,tx,ty,duration,elapsed:0,g:b.g,insertedAt:w.time,rotation:0,damageFactor:t.tower.damage_factor,velocity:{x:(tx-sx)/duration,y:(ty-sy-.5*b.g*duration*duration)/duration}});
}
export function arcanePowerOffer(w,s,name){if(!['burst','slumber'].includes(name)||!s?.arcane)return null;const p=s.arcane.powers?.[name]||w.template(s.key).powers[name];return{...p,price:p.level===0?p.price_base:p.price_inc};}
export function buyArcanePower(w,s,name){const p=arcanePowerOffer(w,s,name);if(!w.active()||!p||p.level>=p.max_level||w.gold<p.price)return false;s.arcane.powers??={};s.arcane.powers[name]={...p,level:p.level+1,changed:true,at:p.at??w.template(s.key).attacks.list[p.attack_idx-1].ts};w.gold-=p.price;s.spent+=p.price;w.emit('tower_power',{name,level:p.level+1});return true;}
// Powers are checked before the ordinary attack, as in tower_arcane.update.
export function updateArcane(w,s,live){
 const t=w.template(s.key),a=t.attacks.list[0];s.arcane??={last:w.time,phase:null,shooters:[{},{}]};const m=s.arcane;m.index??=1;
 if(s.blocked&&!m.phase)return;
 if(m.phase?.power){const p=m.phase,attack=t.attacks.list[w.template(s.key).powers[p.power].attack_idx-1],power=m.powers[p.power];if(!p.fired&&w.time-p.at>=attack.shoot_time){launch(w,s,p.index,p.target,attack,power.level);p.fired=true;}const face=m.shooters[p.index].facing;if(p.fired&&w.time-p.at>=w.animationDuration(t.render.sprites[p.index+2].prefix,'special'+face))m.phase=null;return;}
 if(m.phase){const p=m.phase,age=w.time-p.at;const first=p.firstIndex??0,second=1-first;
  if(!p.secondAnimation&&age>=a.shooters_delay){animate(w,s,second,p.targets[second%p.targets.length]);m.index=second;p.secondAnimation=true;}
  if(!p.firstShot&&age>=a.shoot_time){launch(w,s,first,p.targets[first%p.targets.length]);m.index=first;p.firstShot=true;p.secondAt=w.time+a.shooters_delay;}
  if(p.firstShot&&!p.secondShot&&w.time>=p.secondAt){launch(w,s,second,p.targets[second%p.targets.length]);m.index=second;p.secondShot=true;}
  const d=w.animationDuration(t.render.sprites[second+2].prefix,'shoot'+(m.shooters[second].facing||'Down'));
  if(p.secondShot&&w.time-m.shooters[second].at>=d)m.phase=null;
  return;
 }
 for(const name of ['burst','slumber']){const power=m.powers?.[name];if(power?.changed){power.changed=false;if(power.level===1)power.at=w.time;}
 if(power?.level){const attack=t.attacks.list[t.powers[name].attack_idx-1];if(w.time-power.at>=attack.cooldown+power.level*attack.cooldown_inc){const target=arcaneTargets(w,s,live,attack)[0];if(target){power.at=w.time;const index=(m.index+1)%2;m.index=index;m.phase={power:name,at:w.time,index,target};animate(w,s,index,target,'special');return;}}}}
 if(w.time-m.last<=a.cooldown)return;
 const targets=arcaneTargets(w,s,live,a);
 if(!targets.length)return;m.last=w.time;const firstIndex=(m.index+1)%2;m.index=firstIndex;m.phase={at:w.time,targets,firstIndex};animate(w,s,firstIndex,targets[firstIndex%targets.length]);
}
export function arcaneSpriteStates(w,s){const t=w.template(s.key),m=s.arcane,states={};for(let i=0;i<2;i++){const p=m?.shooters[i],raw=t.render.sprites[i+2],age=p?w.time-p.at:Infinity,face=p?.facing||'Down',animation=p?.animation||'shoot',shoot=age<w.animationDuration(raw.prefix,animation+face);states[i+3]={state:shoot?animation:'idle',time:shoot?age:w.time,facing:!shoot&&w.time-(m?.last??w.time)>t.tower.long_idle_cooldown?'Down':face,flip:false};}for(let i=5;i<t.render.sprites.length;i++)states[i+1]={state:'idle',time:w.time-(t.render.sprites[i].ts||0)};return states;}
export function updateArcaneArrow(w,b,dt){
 if(b.done||b.insertedAt===w.time)return;
 if(b.elapsed+dt<=b.duration){const x=b.x,y=b.y;b.elapsed+=dt;b.x=b.sx+b.velocity.x*b.elapsed;b.y=b.sy+b.velocity.y*b.elapsed+b.g*b.elapsed*b.elapsed/2;b.rotation=Math.atan2(b.y-y,b.x-x);return;}
 b.done=true;if(w.template(b.bullet).bullet.payload)queueArcaneBurst(w,b);const e=b.target,t=w.template(b.bullet).bullet,h=w.template(e.key).unit.hit_offset;
 if(!w.enemies.includes(e)||e.hp<=0||Math.hypot(b.x-e.x-h.x,b.y-e.y-h.y)>=t.hit_distance)return;
 // Harasser explicitly disallows ranged dodge. No global hurt immunity.
 b.damage=Math.ceil((t.damage_min+w.random()*(t.damage_max-t.damage_min))*b.damageFactor);b.hit=true;w.hurt(e,b.damage,t.damage_type);
 if(e.hp>0){if(t.mod[0]==='mod_arrow_arcane_slumber')queueArcaneSlumber(w,b);else reduceArcaneArmor(w,e);}
 const fx=w.template(t.hit_fx).render.sprites[0],a=w.data.animations[fx.name];w.effect('arcane-hit',{x:e.x+h.x,y:e.y+h.y,key:t.hit_fx},(a.to-a.from+1)/30);w.effects.at(-1).key=t.hit_fx;
}

export function drawArcaneEffects(r,w){for(const f of w.effects)if(f.type==='arcane-hit')r.entity(f.key||w.template('arrow_arcane').bullet.hit_fx,f,{time:f.total-f.life});}

function arcaneTargets(w,s,live,a){const p=center(w,s),range=w.template(s.key).attacks.range;return live.filter(e=>e.hp>0&&!harasserHidden(e)&&!((e.visBans??w.template(e.key).vis?.bans??0)&a.vis_flags)&&!((e.visFlags??w.template(e.key).vis?.flags??0)&a.vis_bans)&&((e.x-p.x)/range)**2+((e.y-p.y)/(range*.7))**2<=1).sort((x,y)=>(x.goal-x.d)-(y.goal-y.d));}
