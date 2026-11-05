import{spriteOrder}from'./render-order.mjs';
import DATA from'./marker-data.mjs';
// Presentation counterpart of original entity_marker_controller356–418. No World writes.
export class SelectionMarkers{
 reset(){this.world=null;this.selection=null;this.targets=[];this.markers=[];}
 constructor(){this.reset();}
 update(w,{selected=null,enemy=null,mode=null}={}){const slot=selected!==null?w.slots[selected]:null,selection=mode==='hero'?w.hero:enemy|| (['barrack','ewok'].includes(slot?.type)?slot:null);
  if(this.world!==w||this.selection!==selection){this.world=w;this.selection=selection;this.targets=!selection?[]:selection===slot?w.soldiers.filter(u=>u.home===slot.id&&u.hp>0&&!u.hidden):[selection];}
  this.targets=this.targets.filter(u=>{const t=w.template(u.key),exists=u===w.hero||w.enemies.includes(u)||w.soldiers.includes(u);return exists&&!u.leaked&&t.ui?.can_select!==false&&(u.hp>0||t.health?.ignore_damage);});
  this.markers=this.targets.flatMap(u=>{const t=w.template(u.key),kind=t.soldier?'soldier_small':t.enemy?Object.keys(DATA.sizes).find(k=>DATA.sizes[k]===t.unit.size):null,raw=DATA.templates['decal_entity_marker_'+kind]?.render.sprites[0];if(!raw)return[];return[{target:u,key:raw.name,x:u.x+(t.unit.marker_offset?.x||0),y:u.y+(t.unit.marker_offset?.y||0),anchor:raw.anchor,alpha:raw.alpha/255,z:raw.z}];});return this.markers;
 }
 draw(renderer){for(const m of this.markers){const p=renderer.screen(m);renderer.sprite(renderer.ctx,m.key,p.x,p.y,1,m.anchor.x,1-m.anchor.y,false,m.alpha,0,spriteOrder({z:m.z},m,1,renderer.renderId?.(m.target)||0));}}
}
