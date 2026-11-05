import{spriteOrder}from'./render-order.mjs';
// Original projectile template render declarations, read against the existing
// World flight positions. This deliberately does not replace flight physics.
export function projectileSprites(template,shot,frame,{entityId=0,ultimate=false}={}){
 if(!template?.render?.sprites||shot.elapsed<0||shot.done)return[];
 return template.render.sprites.flatMap((s,i)=>{
  if(s.hidden||s.hidden_count>0)return[];
  const name=s.animated?frame(s.prefix?s.prefix+'_'+s.name:s.name,shot.elapsed||0,s.loop!==false):s.name;
  if(!name)return[];const offset=s.offset||{x:0,y:0};let rotation=s.r||0;
  // Retain the current arrow/torch flight orientations. Source parabola
  // velocity and bomb random initial rotation are separate, unfinished work.
  if(i===0&&(shot.type==='archer'||shot.type==='hero'||ultimate))rotation=Math.atan2(shot.ty-shot.sy,shot.tx-shot.sx);
  if(i===0&&shot.type==='torch')rotation+=shot.elapsed*shot.rotationSpeed;
  return[{key:name,pos:{x:shot.x+offset.x,y:shot.y+offset.y},anchor:s.anchor||{x:.5,y:.5},scale:s.scale?.x??1,flip:!!s.flip_x,alpha:(s.alpha??255)/255,rotation,order:spriteOrder(s,shot,i+1,entityId)}];
 });
}
export function drawProjectileSprites(renderer,poses){for(const p of poses){const q=renderer.screen(p.pos);renderer.sprite(renderer.ctx,p.key,q.x,q.y,p.scale,p.anchor.x,1-p.anchor.y,p.flip,p.alpha,p.rotation,p.order);}}

// scripts.bomb assigns this field even when nil, clearing the FX template's -5.
export const rockImpactOverrides=bullet=>({'render.sprites[1].sort_y_offset':bullet?.hit_fx_sort_y_offset});
