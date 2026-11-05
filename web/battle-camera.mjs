import worldRules from'./world-rules.mjs';
export function worldViewport(width,height,rules=worldRules){const scale=(width/height<rules.minAspect?width/rules.minAspect:height)/rules.height,visibleWidth=Math.max(rules.height*4/3,Math.min(rules.height*16/9,Math.ceil(width*rules.height/height))),minZoom=width/height>16/9?Math.min(width,rules.maxAspect*height)/(scale*visibleWidth):1;return{scale,minZoom,left:(rules.width-visibleWidth)/2*scale,right:(rules.width+visibleWidth)/2*scale,worldWidth:visibleWidth*scale,worldHeight:rules.height*scale};}
// game_gui.lua:3199–3279, expressed in the renderer's physical reference frame.
export function fitTowerCamera(camera,point,{width,height,guiScale,gameScale,top=0,bottom=0}){
 const needW=1.2*122*.88*guiScale,needH=1.3*122*.88*guiScale,oldZoom=camera.zoom;let{x,y,zoom}=camera;
 let upper=point.y+(height-needH)/(2*zoom),lower=point.y-(height-needH)/(2*zoom),topLimit=height/(2*zoom)-top,bottomLimit=height-height/(2*zoom)-bottom;
 if(upper<y){if(upper<topLimit){zoom=needH/(2*(point.y+top));y=point.y+(height-needH)/(2*zoom);}else y=upper;y-=12*gameScale/oldZoom;}
 else if(y<lower){if(bottomLimit<lower){zoom=needH/(2*(height-point.y-bottom));y=point.y+(needH-height)/(2*zoom);}else y=lower;y-=12*gameScale/oldZoom;}
 upper=point.x+(width-needW)/(2*zoom);lower=point.x+(needW-width)/(2*zoom);const left=width/(2*zoom),right=width-width/(2*zoom);
 if(upper<x){if(upper<left){zoom=needW/(2*point.x);x=point.x+(width-needW)/(2*zoom);}else x=upper;}
 else if(x<lower){if(right<lower){zoom=needW/(2*(width-point.x));x=point.x+(needW-width)/(2*zoom);}else x=lower;}
 return{x,y,zoom};
}
export class BattleCamera{
 constructor(width,height){this.width=width;this.height=height;this.reset();}
 configure(view,top=0,bottom=0){this.bounds=view;this.top=top*view.scale;this.bottom=bottom*view.scale;this.reset();Object.assign(this,this.clamp(this));}
 reset(){this.x=this.width/2;this.y=this.height/2;this.zoom=1;this.phase=1;this.from=null;if(this.bounds)Object.assign(this,this.clamp(this));}
 clamp(p){const zoom=Math.max(this.bounds?.minZoom||1,Math.min(2,p.zoom)),top=this.top||0,bottom=this.bottom||0;const b=this.bounds||{left:0,right:this.width,worldWidth:this.width,worldHeight:this.height,minZoom:1};return{x:Math.max(b.left+b.worldWidth*b.minZoom/(2*zoom),Math.min(b.right-b.worldWidth*b.minZoom/(2*zoom),p.x)),y:Math.max(-top+b.worldHeight/(2*zoom),Math.min(b.worldHeight-bottom-b.worldHeight/(2*zoom),p.y)),zoom};}
 tween(target,duration=.2,easing='in-out-quad'){this.duration=duration;this.easing=easing;target=this.clamp(target);this.from={x:this.x,y:this.y,zoom:this.zoom};this.target=target;this.phase=0;}
 update(dt){if(this.phase===1)return;this.phase=Math.min(1,this.phase+dt/this.duration);const t=this.phase,e=this.easing==='out-quad'?1-(1-t)**2:t<.5?2*t*t:1-(-2*t+2)**2/2;for(const k of['x','y','zoom'])this[k]=this.from[k]+(this.target[k]-this.from[k])*e;Object.assign(this,this.clamp(this));}
 project(p){return{x:this.width/2+(p.x-this.x)*this.zoom,y:this.height/2+(p.y-this.y)*this.zoom};}
 unproject(p){return{x:this.x+(p.x-this.width/2)/this.zoom,y:this.y+(p.y-this.height/2)/this.zoom};}
}
