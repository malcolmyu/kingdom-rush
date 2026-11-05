// game_gui TowerMenuButton.select/deselect toggles the holder's original
// preview sprite. Keep that transient hidden override outside World/templates.
export function holderPreviewOverrides(template,slot,preview){
 if(slot.type||preview?.slotId!==slot.id)return{};
 const index=template?.tower_holder?.preview_ids?.[preview.kind];
 if(!index||!template.render?.sprites?.[index-1])return{};
 return{[`render.sprites[${index}].hidden`]:false};
}
