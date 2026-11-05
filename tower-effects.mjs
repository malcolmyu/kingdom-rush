import DATA from'./tower-effect-data.mjs';import{spriteOrder}from'./render-order.mjs';
export function towerDustPose(type,pos,time,frame,duration,entityId=0){
 const t=DATA.templates[type==='sell'?'fx_tower_sell_dust':'fx_tower_buy_dust'],s=t.render.sprites[0];
 if(time<0||time>=duration(s.name)*(t.timed.runs||1))return null;
 const origin={x:pos.x,y:pos.y+(type==='sell'?DATA.sellOffset:DATA.buyOffset)};
 return{key:frame(s.name,time,false),pos:origin,anchor:s.anchor,alpha:s.alpha/255,order:spriteOrder(s,origin,1,entityId)};
}
// View-only event snapshots preserve the delayed buy dust beyond World's .7s
// notification lifetime. No mutation of slots, effects or simulation clocks.
export class TowerEffects{
 constructor(){this.reset();}
 reset(){this.owner=null;this.seen=new WeakSet();this.records=[];}
 update(world){
  if(this.owner!==world){this.reset();this.owner=world;}
  for(const e of world.effects){
   if(!['build','sell'].includes(e.type)||this.seen.has(e))continue;
   this.seen.add(e);const at=world.time-(e.total-e.life),slot=world.slots.find(s=>s.x===e.x&&s.y===e.y),pending=e.type==='build'&&slot?.buildUntil>at;
   if(e.type==='build'&&slot&&world.template(slot.key)?.tower?.hide_dust)continue;
   this.records.push({type:e.type,x:e.x,y:e.y,start:pending?slot.buildUntil:at,slot:pending?slot:null,buildAt:slot?.buildAt});
  }
  this.records=this.records.filter(r=>{
   if(r.slot&&(!r.slot.type||r.slot.buildAt!==r.buildAt))return false;
   if(world.time>=r.start)r.slot=null; // emitted dust is independent of its tower
   return world.time<r.start+DATA.frameCounts[r.type==='sell'?'tower_sell_dust':'tower_build_dust']/30;
  });
  return this.records;
 }
 draw(renderer,world){const duration=name=>{const a=renderer.catalog.animations[name];return(a.to-a.from+1)/30;};for(const[i,r]of this.update(world).entries()){
  const pose=towerDustPose(r.type,r,world.time-r.start,renderer.frame.bind(renderer),duration,world.data.level.entities_list.length+world.serial+i+1);if(!pose)continue;
  const p=renderer.screen(pose.pos);renderer.sprite(renderer.ctx,pose.key,p.x,p.y,1,pose.anchor.x,1-pose.anchor.y,false,pose.alpha,0,pose.order);
 }}
}
