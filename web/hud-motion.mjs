// Original phone show_gui_hud/hide_gui_hud: source coordinates, independent UI clock.
export function hudEase(t,hiding){t=Math.max(0,Math.min(1,t));return hiding?1+2.70158*(t-1)**3+1.70158*(t-1)**2:1-(1-t)**3;}
export function hudOffsets(ui){const d=ui.layouts.battleHud,images=ui.images;return{hud:{x:0,y:-1.5*images[d.hud_normal_view.image_name].size[1]/2},pause:{x:0,y:-1.5*images[d.pause_button.default_image_name].size[1]/2},hero:{x:-1.5*d.hero_portraits_view.size.x,y:0},notices:{x:-1.5*d.notification_queue_view.size.x,y:0},powers:{x:0,y:d.powers_view.anchor.y}};}
export class HudMotion{
 constructor(root,ui){this.offsets=hudOffsets(ui);this.groups={hud:[root.querySelector('#hud')],pause:[root.querySelector('#pause')],hero:[root.querySelector('#hero')],notices:[root.querySelector('#enemy-notifications')],powers:['lightning','reinforce','arrows'].map(id=>root.querySelector('#'+id))};this.hidden=false;this.phase=1;this.values=Object.fromEntries(Object.keys(this.groups).map(k=>[k,{x:0,y:0}]));this.from=structuredClone(this.values);}
 setHidden(hidden){if(this.hidden===hidden)return;this.hidden=hidden;this.phase=0;this.from=structuredClone(this.values);}
 update(dt){this.phase=Math.min(1,this.phase+dt/.4);const p=hudEase(this.phase,this.hidden);for(const[k,nodes]of Object.entries(this.groups)){const to=this.hidden?this.offsets[k]:{x:0,y:0},from=this.from[k],value={x:from.x+(to.x-from.x)*p,y:from.y+(to.y-from.y)*p};this.values[k]=value;for(const n of nodes)if(n)n.style.translate=n.dataset.guiScale?`${value.x*Number(n.dataset.guiScale)}px ${value.y*Number(n.dataset.guiScale)}px`:`${value.x/693*100}cqw ${value.y/693*100}cqw`;}}
 reset(){for(const nodes of Object.values(this.groups))for(const n of nodes)if(n)n.style.translate='';}
}
