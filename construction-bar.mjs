import{spriteOrder}from'./render-order.mjs';
// Original tower_build sprite 4 and systems.tween vector linear interpolation.
export function constructionBarPose(template,slot,time,entityId=0){
 const tween=template?.tween?.props?.find(t=>t.sprite_id===4&&t.name==='scale'),s=template?.render?.sprites?.[3];if(!tween||!s)return null;
 const elapsed=Math.max(0,time-slot.buildAt),keys=tween.keys;let a=keys[0],b=keys.at(-1);
 for(const key of keys){if(elapsed>=key[0])a=key;if(elapsed<=key[0]){b=key;break;}}
 const t=a===b?0:Math.min(1,Math.max(0,(elapsed-a[0])/(b[0]-a[0]))),scale={x:a[1].x+(b[1].x-a[1].x)*t,y:a[1].y+(b[1].y-a[1].y)*t},offset=s.offset||{x:0,y:0};
 return{key:s.name,pos:{x:slot.x+offset.x,y:slot.y+offset.y},anchor:s.anchor,scale,alpha:(s.alpha??255)/255,order:spriteOrder(s,slot,4,entityId)};
}
export function drawConstructionBar(renderer,pose){if(!pose)return;const p=renderer.screen(pose.pos),draw=()=>{const c=renderer.ctx;c.save();c.translate(p.x,p.y);c.scale(pose.scale.x,pose.scale.y);renderer.sprite(c,pose.key,0,0,1,pose.anchor.x,1-pose.anchor.y,false,pose.alpha);c.restore();};if(renderer.orderQueue)renderer.orderQueue.add(pose.order,draw);else draw();}
