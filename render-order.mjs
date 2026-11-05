import RULES from'./render-order-data.mjs';
// Source systems.render: APK systems.lua1986–2029, shared source2116–2159.
// Display offsets do not affect sorting; sort_y=0 is a valid Lua truthy value.
const present=v=>v!==undefined&&v!==null&&v!==false;
export function spriteOrder(sprite,pos,index=1,entityId=0){const p=sprite.pos||pos;return{z:present(sprite.z)?sprite.z:RULES.defaultZ,y:present(sprite.sort_y)?sprite.sort_y:p.y+(sprite.sort_y_offset||0),drawOrder:RULES.drawOrderFactor*(present(sprite.draw_order)?sprite.draw_order:index)+entityId,x:p.x};}
export function compareRenderOrder(a,b){return a.z-b.z||b.y-a.y||a.drawOrder-b.drawOrder||a.x-b.x;}
export class RenderQueue{
 constructor(){this.commands=[];}
 add(order,draw){this.commands.push({order,draw,index:this.commands.length});}
 flush(){const commands=this.commands;this.commands=[];commands.sort((a,b)=>compareRenderOrder(a.order,b.order)||a.index-b.index);for(const command of commands)command.draw();return commands;}
}
