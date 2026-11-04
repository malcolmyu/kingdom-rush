// Original UI coordinates and anchors stay in their own reference space.
export function rectStyle(x,y,w,h,ref={x:693,y:320}){
 return `left:${x/ref.x*100}%;top:${y/ref.y*100}%;width:${w/ref.x*100}%;height:${h/ref.y*100}%`;
}
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export class NativeUI{
 constructor(data){this.data=data;}
 find(tree,id){if(tree.id===id)return tree;for(const child of Object.values(tree.children||{})){const n=this.find(child,id);if(n)return n;}return null;}
 image(key,node={},ref={x:693,y:320},extra=''){
  const asset=this.data.images[key];if(!asset)throw new Error('Missing original UI sprite: '+key);
  const p=node.pos_shown||node.pos||{x:0,y:0},a=node.anchor||{x:0,y:0},scale=node.scale||{x:1,y:1},w=asset.size[0]/2,h=asset.size[1]/2;
  return `<img class="native-image" src="${asset.src}" alt="" draggable="false" style="${rectStyle(p.x-a.x,p.y-a.y,w,h,ref)};transform:scale(${scale.x},${scale.y});${node.r?`rotate:${node.r}rad;`:''}" ${extra}>`;
 }
 button(id,label,node,ref={x:693,y:320},extra='',text=''){
  const key=node.default_image_name||node.image_name,asset=this.data.images[key];if(!asset)throw new Error('Missing original UI button: '+key);
  const p=node.pos_shown||node.pos||{x:0,y:0},a=node.anchor||{x:0,y:0};
  return `<button id="${id}" class="native-button" aria-label="${escape(label)}" style="${rectStyle(p.x-a.x,p.y-a.y,asset.size[0]/2,asset.size[1]/2,ref)}" ${extra}><img src="${asset.src}" ${node.click_image_name&&this.data.images[node.click_image_name]?`data-pressed="${this.data.images[node.click_image_name].src}"`:''} alt="" draggable="false">${text?`<span>${text}</span>`:''}</button>`;
 }
 nine(prefix,{x=0,y=0,w,h},ref){const a=this.data.images[prefix+'_lt'];if(!a)throw new Error('Missing original panel: '+prefix);const parts=[['lt',''],['ct',''],['lt','mirror-x'],['lc',''],['cc',''],['lc','mirror-x'],['lt','mirror-y'],['ct','mirror-y'],['lt','mirror-both']];return `<div class="native-nine" style="${rectStyle(x,y,w,h,ref)};grid-template-columns:${a.size[0]/2/w*100}% 1fr ${a.size[0]/2/w*100}%;grid-template-rows:${a.size[1]/2/h*100}% 1fr ${a.size[1]/2/h*100}%">${parts.map(([p,c])=>`<img class="${c}" src="${this.data.images[prefix+'_'+p].src}" alt="">`).join('')}</div>`;}
 bind(root){for(const image of root.querySelectorAll('[data-pressed]')){const button=image.closest('button'),normal=image.src;button.onpointerdown=()=>{if(!button.disabled)image.src=image.dataset.pressed;};for(const event of ['pointerup','pointerleave','pointercancel','blur'])button.addEventListener(event,()=>image.src=normal);}}
}
