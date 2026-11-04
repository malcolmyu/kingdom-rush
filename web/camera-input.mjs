import{infobarViewport}from'./infobar.mjs';
// Phone TouchView, game_gui.lua:2207–2411. Presentation-only gesture state.
export class CameraGesture{
 constructor(camera,onDrag=()=>{}){this.camera=camera;this.onDrag=onDrag;this.clear();}
 clear(){this.points=new Map();this.samples=Array.from({length:6},()=>({x:0,y:0}));this.index=0;this.damped=null;this.moved=false;this.consumeClick=false;this.dt=1/30;}
 down(id,p){this.consumeClick=false;if(!this.points.size){this.samples.fill(null).forEach((_,i)=>this.samples[i]={x:0,y:0});this.damped=null;this.moved=false;this.camera.phase=1;}this.points.set(id,{start:{...p},last:{...p}});if(this.points.size===2){this.moved=true;this.onDrag();}}
 move(id,p,{guiScale,thresholdScale=1}){const f=this.points.get(id);if(!f)return;if(this.points.size===2){const other=[...this.points.entries()].find(([key])=>key!==id)[1].last,old=Math.hypot(f.last.x-other.x,f.last.y-other.y),next=Math.hypot(p.x-other.x,p.y-other.y);if(old>0)this.zoom(next/old);f.last={...p};return;}
 if(this.points.size===1&&(Math.abs(f.start.x-p.x)>2*thresholdScale||Math.abs(f.start.y-p.y)>2*thresholdScale)){if(!this.moved){this.moved=true;this.onDrag();}const c=this.camera,d=this.damped??{x:c.x,y:c.y},previous={...d};d.x+=(f.last.x-p.x)*guiScale/c.zoom;d.y+=(f.last.y-p.y)*guiScale/c.zoom;this.damped=d;this.samples[this.index]={x:(d.x-previous.x)/this.dt,y:(d.y-previous.y)/this.dt};this.index=(this.index+1)%6;}f.last={...p};}
 zoom(factor){const c=this.camera;c.phase=1;Object.assign(c,c.clamp({...c,zoom:c.zoom*factor}));}
 up(id,cancel=false){if(!this.points.has(id))return;this.points.delete(id);this.damped=null;this.consumeClick=this.moved;if(cancel){this.points.clear();return;}if(!this.points.size){const velocity=this.samples.reduce((s,p)=>({x:s.x+p.x/6,y:s.y+p.y/6}),{x:0,y:0});if(Math.abs(velocity.x)>1||Math.abs(velocity.y)>1){const c=this.camera;c.tween({x:c.x+velocity.x*.5*.5,y:c.y+velocity.y*.5*.5,zoom:c.zoom},.5,'out-quad');}}}
 update(dt){this.dt=dt||this.dt;if(!this.damped)return;const c=this.camera;for(const k of['x','y']){c[k]+=(this.damped[k]-c[k])*.6;if(Math.abs(this.damped[k]-c[k])<.01)this.damped[k]=c[k];}Object.assign(c,c.clamp(c));}
}
export class CameraInput{
 constructor(app){this.app=app;this.game=document.getElementById('game');this.gesture=new CameraGesture(app.renderer.camera,()=>{app.selected=null;app.showBuildMenu();});this.listeners=[];const listen=(n,key,fn,opts)=>{n.addEventListener(key,fn,opts);this.listeners.push(()=>n.removeEventListener(key,fn,opts));};
 const allowed=e=>this.active()&&(e.target.id==='battlefield'||e.target.closest?.('[data-build-slot],[data-plant]'));
 const point=e=>{const v=app.towerMenu?.viewport()||this.viewport(),r=this.game.getBoundingClientRect();return{x:(e.clientX-r.left-this.game.clientLeft-v.origin.x)/v.scale,y:(e.clientY-r.top-this.game.clientTop-v.origin.y)/v.scale};};
 listen(this.game,'pointerdown',e=>{this.gesture.consumeClick=false;if(!allowed(e)||e.button!==0)return;this.gesture.down(e.pointerId,point(e));if(e.pointerType==='mouse')this.mouse={id:e.pointerId,point:point(e)};},true);
 listen(window,'pointermove',e=>{if(!this.active()){this.gesture.clear();return;}if(e.pointerType==='mouse'){if(this.mouse)this.mouse.point=point(e);return;}const v=this.viewport();this.gesture.move(e.pointerId,point(e),{guiScale:v.scale*app.renderer.width/this.game.clientWidth,thresholdScale:v.scale});},true);
 listen(window,'pointerup',e=>{this.gesture.up(e.pointerId);if(this.mouse?.id===e.pointerId)this.mouse=null;},true);listen(window,'pointercancel',e=>{this.gesture.up(e.pointerId,true);this.mouse=null;},true);listen(window,'blur',()=>{this.gesture.clear();this.mouse=null;app.renderer.camera.phase=1;});
 listen(this.game,'click',e=>{if(this.gesture.consumeClick){this.gesture.consumeClick=false;e.preventDefault();e.stopImmediatePropagation();}},true);
 listen(this.game,'wheel',e=>{if(!allowed(e)||!e.deltaY)return;e.preventDefault();this.gesture.zoom(e.deltaY<0?1.1:.9);},{passive:false});
 }
 viewport(){return{...infobarViewport(this.app.ui.data.layouts.infobar,this.game.clientWidth,this.game.clientHeight)};}
 active(){const a=this.app;return a.scene==='battle'&&!a.modal&&!a.sceneMotion.busy&&!a.targeting;}
 update(dt){if(!this.active()){this.gesture.clear();this.mouse=null;return;}if(this.mouse){const v=this.viewport();this.gesture.dt=dt||this.gesture.dt;this.gesture.move(this.mouse.id,this.mouse.point,{guiScale:v.scale*this.app.renderer.width/this.game.clientWidth,thresholdScale:v.scale});}this.gesture.update(dt);}
 destroy(){for(const off of this.listeners)off();this.gesture.clear();this.mouse=null;this.app.renderer.camera.phase=1;}
}
