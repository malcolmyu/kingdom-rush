import RULES from'./health-bar-data.mjs';
import{spriteOrder}from'./render-order.mjs';
// systems.render generates tinted 1x1 quads, ref_scale=1, anchor=(0,0).
// These are world-sized bars: atlas textureScale must NOT scale their geometry.
export function healthBarFrames(template,unit,{entityId=0,textureSize='iphonehd',hidden=template.health_bar?.hidden}={}){
 const hb=template.health_bar,size=(RULES.sizes[textureSize]||RULES.sizes.default)[hb?.type];
 if(!hb||!size||hidden||unit.leaked||unit.hp<=0||!(unit.maxHp>0))return[];
 const pos={x:Math.floor(unit.x),y:Math.ceil(unit.y)},offset=hb.offset||{x:0,y:0},width=size.x,denominator=hb.black_bar_hp||unit.maxHp;
 const layers=[...(hb.black_bar_hp?[['black',width,0]]:[]),['bg',width*(hb.black_bar_hp?unit.maxHp/denominator:1),1],['fg',width*unit.hp/denominator,2]];
 return layers.map(([role,w,index])=>{const p=role==='black'?{x:pos.x,y:Math.floor(unit.y)}:pos;return{role,pos:p,x:p.x+offset.x-width/2,y:p.y+offset.y,width:w,height:size.y,color:hb.colors?.[role]||RULES.colors[role],order:{...spriteOrder({z:hb.z,sort_y_offset:hb.sort_y_offset},p,1,entityId),drawOrder:(typeof hb.draw_order==='number'?100000*hb.draw_order+index:200001+index)+entityId}};});
}
export function drawHealthBars(renderer,frames){for(const f of frames){const p=renderer.screen({x:f.x,y:f.y}),draw=()=>{const c=renderer.ctx;c.save();c.fillStyle=`rgba(${f.color.slice(0,3).join(',')},${f.color[3]/255})`;c.fillRect(p.x,p.y-f.height*renderer.k,f.width*renderer.k,f.height*renderer.k);c.restore();};if(renderer.orderQueue)renderer.orderQueue.add(f.order,draw);else draw();}}

// Archer update2795: initial levelup before hidden=false; SU respawn hides until animation ends.
export function heroHealthBarHidden(unit,time,animationDuration){return(unit.action==='respawn'||unit.action==='levelup'&&unit.actionAt===0)&&time-unit.actionAt<animationDuration;}
