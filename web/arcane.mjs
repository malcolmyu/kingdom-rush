import{harasserHidden}from'./harasser-jump.mjs';
const center=(w,s)=>{const o=w.template(s.key).tower.range_offset;return{x:s.x+o.x,y:s.y+o.y};};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function animate(w,s,index,e){const raw=w.template(s.key).render.sprites[index+2],o=raw.offset;s.arcane.shooters[index]={at:w.time,facing:e.y>s.y+o.y?'Up':'Down',flip:false};}
function launch(w,s,index,e){
 const t=w.template(s.key),a=t.attacks.list[0],b=w.template(a.bullet).bullet,p=center(w,s);
 if(distance(p,e)>t.attacks.range||!w.enemies.includes(e))return;
 const off=t.render.sprites[index+2].offset,bo=a.bullet_start_offset[e.y>p.y?0:1],h=w.template(e.key).unit.hit_offset,v=e.motionVelocity||{x:0,y:0};
 const sx=s.x+off.x+bo.x*(e.x>p.x?1:-1),sy=s.y+off.y+bo.y;
 let tx=e.x+h.x,ty=e.y+h.y;const duration=b.flight_time_min+Math.hypot(tx-sx,ty-sy)/t.attacks.range*b.flight_time_factor;
 tx+=v.x*duration+(v.x&&b.prediction_error?w.random()*10:0);ty+=v.y*duration-(v.y&&b.prediction_error?w.random()*10:0);
 w.shots.push({id:++w.serial,type:'arcane-arrow',bullet:a.bullet,target:e,sx,sy,x:sx,y:sy,tx,ty,duration,elapsed:0,g:b.g,insertedAt:w.time,rotation:0,damageFactor:t.tower.damage_factor,velocity:{x:(tx-sx)/duration,y:(ty-sy-.5*b.g*duration*duration)/duration}});
}
// Basic source pair only. Purchased powers have no implementation/entry point.
export function updateArcane(w,s,live){
 const t=w.template(s.key),a=t.attacks.list[0];s.arcane??={last:w.time,phase:null,shooters:[{},{}]};const m=s.arcane;
 if(s.blocked&&!m.phase)return;
 if(m.phase){const p=m.phase,age=w.time-p.at;
  if(!p.secondAnimation&&age>=a.shooters_delay){animate(w,s,1,p.targets[1%p.targets.length]);p.secondAnimation=true;}
  if(!p.firstShot&&age>=a.shoot_time){launch(w,s,0,p.targets[0]);p.firstShot=true;p.secondAt=w.time+a.shooters_delay;}
  if(p.firstShot&&!p.secondShot&&w.time>=p.secondAt){launch(w,s,1,p.targets[1%p.targets.length]);p.secondShot=true;}
  const d=w.animationDuration(t.render.sprites[3].prefix,'shoot'+(m.shooters[1].facing||'Down'));
  if(p.secondShot&&w.time-m.shooters[1].at>=d)m.phase=null;
  return;
 }
 if(w.time-m.last<=a.cooldown)return;
 const p=center(w,s),targets=live.filter(e=>e.hp>0&&!harasserHidden(e)&&!(e.visBans&a.vis_flags)&&!(e.visFlags&a.vis_bans)&&((e.x-p.x)/t.attacks.range)**2+((e.y-p.y)/(t.attacks.range*.7))**2<=1).sort((x,y)=>(x.goal-x.d)-(y.goal-y.d));
 if(!targets.length)return;m.last=w.time;m.phase={at:w.time,targets};animate(w,s,0,targets[0]);
}
export function arcaneSpriteStates(w,s){const t=w.template(s.key),m=s.arcane,states={};for(let i=0;i<2;i++){const p=m?.shooters[i],raw=t.render.sprites[i+2],age=p?w.time-p.at:Infinity,face=p?.facing||'Down',shoot=age<w.animationDuration(raw.prefix,'shoot'+face);states[i+3]={state:shoot?'shoot':'idle',time:shoot?age:w.time,facing:w.time-(m?.last??w.time)>t.tower.long_idle_cooldown?'Down':face,flip:false};}for(let i=5;i<t.render.sprites.length;i++)states[i+1]={state:'idle',time:w.time-(t.render.sprites[i].ts||0)};return states;}
export function updateArcaneArrow(w,b,dt){
 if(b.done||b.insertedAt===w.time)return;
 if(b.elapsed+dt<=b.duration){const x=b.x,y=b.y;b.elapsed+=dt;b.x=b.sx+b.velocity.x*b.elapsed;b.y=b.sy+b.velocity.y*b.elapsed+b.g*b.elapsed*b.elapsed/2;b.rotation=Math.atan2(b.y-y,b.x-x);return;}
 b.done=true;const e=b.target,t=w.template(b.bullet).bullet,h=w.template(e.key).unit.hit_offset;
 if(!w.enemies.includes(e)||e.hp<=0||Math.hypot(b.x-e.x-h.x,b.y-e.y-h.y)>=t.hit_distance)return;
 // Harasser explicitly disallows ranged dodge. No global hurt immunity.
 b.damage=Math.ceil((t.damage_min+w.random()*(t.damage_max-t.damage_min))*b.damageFactor);b.hit=true;w.hurt(e,b.damage,t.damage_type);
 if(e.hp>0){const mod=w.template(t.mod[0]);e.rawMagicArmor=(e.rawMagicArmor??e.magicArmor)-w.number(mod.damage_min,mod.damage_max);e.magicArmor=Math.max(0,Math.min(1,e.rawMagicArmor));}
 w.effect('arcane-hit',{x:e.x+h.x,y:e.y+h.y},8/30);
}

export function drawArcaneEffects(r,w){for(const f of w.effects)if(f.type==='arcane-hit')r.entity(w.template('arrow_arcane').bullet.hit_fx,f,{time:f.total-f.life});}
