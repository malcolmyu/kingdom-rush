import{rectStyle}from'./ui.mjs';
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
// Source tutorial layouts retain their own 372/464 x 320 reference boxes.
export function tutorialMarkup(ui,page){const layout=ui.data.layouts.tutorials[page-1],ref=layout.size,text=ui.data.fonts.text;let html='<h2 id="dialog-title" class="sr-only">'+escape(text.INGAME_TUTORIAL_INSTRUCTIONS)+'</h2>';
 function visit(n,ox=0,oy=0){const x=ox+(n.pos?.x||0)-(n.anchor?.x||0),y=oy+(n.pos?.y||0)-(n.anchor?.y||0),button=n.default_image_name,key=button||n.image_name;
  if(key){const node={...n,pos:{x,y},anchor:{x:0,y:0}};html+=button?ui.button('tutorial-'+n.id,text[n.text]||n.text,node,ref):ui.image(key,node,ref);}
  if(n.text){const off=n.text_offset||{x:0,y:0},size=n.text_size||n.size||{x:100,y:20},color=n.colors?.text||[61,49,35],tag=n.font_name==='body_bold'?'strong':'span';html+=`<${tag} class="tutorial-text" style="${rectStyle(x+off.x,y+off.y,size.x,size.y,ref)};${ui.fontStyle(n.font_name,n.font_size,ref)};color:rgb(${color.slice(0,3).join(' ')});line-height:${n.line_height||1.1};${n.r?'rotate:'+n.r+'rad;':''}">${escape(text[n.text]||n.text)}</${tag}>`;}
  for(const child of Object.values(n.children||{}))visit(child,x,y);
 }
 for(const n of Object.values(layout.children))visit(n);return{html,width:ref.x,height:ref.y};}
