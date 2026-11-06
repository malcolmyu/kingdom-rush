import{spriteOrder}from'./render-order.mjs';import{tweenValue}from'./skill-effects.mjs';
// Arrow payload is queued regardless of direct contact. The aura keeps the
// predicted position for drawing; its query follows an existing target once.
export function queueArcaneBurst(w,b){(w.arcaneBursts??=[]).push({id:++w.serial,key:w.template(b.bullet).bullet.payload,x:b.tx,y:b.ty,target:b.target,level:b.level,queuedAt:w.time});}
export function updateArcaneBursts(w){
 if(!w.arcaneBursts)return;
 for(const f of w.arcaneBursts){if(f.at!==undefined||f.queuedAt===w.time)continue;
  f.at=w.time;const t=w.template(f.key),a=t.aura,e=w.enemies.includes(f.target)?f.target:null,p=e||f;
  if(e&&e.hp>0&&!e.flying)f.ground={x:e.x,y:e.y};
  f.hitPos={x:p.x,y:p.y};
  for(const e of w.enemies)if(e.hp>0&&!(e.visBans&a.vis_flags)&&!(e.visFlags&a.vis_bans)&&((e.x-p.x)/a.radius)**2+((e.y-p.y)/(a.radius*.7))**2<=1)w.hurt(e,f.level*a.damage_inc,a.damage_type);
 }
 w.arcaneBursts=w.arcaneBursts.filter(f=>f.at===undefined||w.time-f.at<burstDuration(w,f));
}
function burstDuration(w,f){const s=w.template(f.key).render.sprites[0],a=w.data.animations[s.name];return(a.frames?.length||a.to-a.from+1)/30;}
export function arcaneBurstSprites(w,f,frame){
 if(f.at===undefined)return[];const age=w.time-f.at;if(age<0||age>=burstDuration(w,f))return[];
 const parts=[{key:f.key,pos:f}];if(f.ground)parts.push({key:'decal_arcane_burst_ground',pos:f.ground});
 return parts.flatMap(({key,pos},part)=>{const t=w.template(key);return t.render.sprites.flatMap((s,i)=>{
  const props=t.tween?.props.filter(p=>p.sprite_id===i+1)||[],alphaProp=props.find(p=>p.name==='alpha'),scaleProp=props.find(p=>p.name==='scale'),alpha=(alphaProp?tweenValue(alphaProp.keys,age):s.alpha)/255;
  if(alpha<=0)return[];const scale=axis=>scaleProp?tweenValue(scaleProp.keys.map(([at,v])=>[at,v[axis]]),age):s.scale?.[axis]??1;
  return[{key:s.animated?frame(s.name,age,false):s.name,pos:{x:pos.x+(s.offset?.x||0),y:pos.y+(s.offset?.y||0)},anchor:s.anchor,alpha,scaleX:scale('x'),scaleY:scale('y'),rotation:s.r||0,order:spriteOrder(s,pos,i+1,f.id+part)}];
 });});
}
export function drawArcaneBursts(r,w){for(const f of w.arcaneBursts||[])for(const p of arcaneBurstSprites(w,f,r.frame.bind(r))){const q=r.screen(p.pos),draw=()=>{const c=r.ctx;c.save();c.translate(q.x,q.y);c.scale(p.scaleX,p.scaleY);r.sprite(c,p.key,0,0,1,p.anchor.x,1-p.anchor.y,false,p.alpha,p.rotation);c.restore();};r.orderQueue?r.orderQueue.add(p.order,draw):draw();}}
