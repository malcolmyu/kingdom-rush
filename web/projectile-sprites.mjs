import{spriteOrder}from'./render-order.mjs';
// scripts.arrow/bomb only hide sprite 1, using world-space distances, strict <.
export function projectileHidden(template,shot){
 const radius=template?.bullet?.hide_radius;
 if(radius==null)return false;
 return shot.elapsed===0||Math.hypot(shot.x-shot.sx,shot.y-shot.sy)<radius||Math.hypot(shot.x-shot.tx,shot.y-shot.ty)<radius;
}
// Original projectile template render declarations, read against the existing
// World flight positions. This deliberately does not replace flight physics.
export function projectileSprites(template,shot,frame,{entityId=0,ultimate=false,bodyRotation}={}){
 if(!template?.render?.sprites||shot.elapsed<0||shot.done)return[];
 return template.render.sprites.flatMap((s,i)=>{
  if(s.hidden||s.hidden_count>0||(i===0&&projectileHidden(template,shot)))return[];
  const name=s.animated?frame(s.prefix?s.prefix+'_'+s.name:s.name,shot.elapsed||0,s.loop!==false):s.name;
  if(!name)return[];const offset=s.offset||{x:0,y:0};let rotation=s.r||0;
  // Arrow tangent still depends on the unfinished native flight positions.
  if(i===0&&(shot.type==='archer'||shot.type==='hero'||ultimate))rotation=Math.atan2(shot.ty-shot.sy,shot.tx-shot.sx);
  let flip=!!s.flip_x;
  if(i===0&&shot.type==='torch'){
   const speed=template.bullet.rotation_speed*(shot.tx>shot.sx?-1:1);
   rotation+=(shot.elapsed||0)*speed;
   if(speed>0)flip=!flip;
  }
  if(i===0&&(shot.type==='ewok-spear'||shot.type==='harasser-arrow'))rotation=shot.rotation;
  if(i===0&&bodyRotation!==undefined)rotation=bodyRotation;
  return[{key:name,pos:{x:shot.x+offset.x,y:shot.y+offset.y},anchor:s.anchor||{x:.5,y:.5},scale:s.scale?.x??1,flip,alpha:(s.alpha??255)/255,rotation,order:spriteOrder(s,shot,i+1,entityId)}];
 });
}
// Source bomb.insert takes one random initial r, then signs rotation_speed by
// the launch direction. Independent UI RNG never changes World.seed.
export class ProjectileMotion{
 constructor(random=Math.random){this.random=random;this.reset();}
 reset(){this.choices=new WeakMap();}
 poses(template,shot,frame,options={}){
  if(shot.elapsed<0||shot.done)return[];
  let bodyRotation;
  if(shot.type==='artillery'&&template?.bullet?.rotation_speed&&!template.bullet.align_with_trajectory){
   let choice=this.choices.get(shot);
   if(!choice){choice={angle:(this.random()-.5)*Math.PI,speed:template.bullet.rotation_speed*(shot.tx>shot.sx?-1:1)};this.choices.set(shot,choice);}
   bodyRotation=choice.angle+(shot.elapsed||0)*choice.speed;
  }
  return projectileSprites(template,shot,frame,{...options,bodyRotation});
 }
}
export function drawProjectileSprites(renderer,poses){for(const p of poses){const q=renderer.screen(p.pos);renderer.sprite(renderer.ctx,p.key,q.x,q.y,p.scale,p.anchor.x,1-p.anchor.y,p.flip,p.alpha,p.rotation,p.order);}}

// scripts.bomb assigns this field even when nil, clearing the FX template's -5.
export const rockImpactOverrides=bullet=>({'render.sprites[1].sort_y_offset':bullet?.hit_fx_sort_y_offset});
