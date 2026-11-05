import rules from'./range-data.mjs';
// Only presentation descriptions. Never insert entities or mutate templates.
export function towerRangeSpecs(world,{selected=null,item=null,mode=null}={}){
 const s=world.slots[selected];if(!s||mode&&mode!=='rally')return[];const current=world.template(s.key||s.source?.template),out=[],offset=current.tower?.range_offset||{x:0,y:0},pos={x:s.x+offset.x,y:s.y+offset.y};
 const add=(style,radius)=>{if(Number.isFinite(radius)&&radius>0)out.push({style,radius,pos:{...pos}});};
 if(mode==='rally'){add('rally',current.barrack?.rally_range);return out;}
 add('tower',current.attacks?.range);
 if(item?.action==='tw_upgrade'){
  let next=world.templates[item.action_arg];if(item.preview)next=world.templates[next?.build_name];
  if(next?.attacks?.range)add('upgrade',next.attacks.range);else if(next?.barrack?.rally_range)add('rally',next.barrack.rally_range);
 }
 return out;
}
export function rangeQuarters(spec){const t=rules.templates[spec.style==='rally'?'decal_rally_range':'decal_tower_range'],factor=spec.radius/t.actual_radius;return t.render.sprites.map((s,i)=>({...s,scale:{x:(i%2===0?1:-1)*factor,y:(i<2?1:-1)*rules.aspect*factor}}));}
export function drawTowerRanges(renderer,specs){const c=renderer.ctx;for(const spec of specs){const p=renderer.screen(spec.pos);for(const s of rangeQuarters(spec)){c.save();c.translate(p.x,p.y);c.scale(s.scale.x,s.scale.y);renderer.sprite(c,s.name,0,0,1,s.anchor.x,1-s.anchor.y,false,s.alpha/255);c.restore();}}}
