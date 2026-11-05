import{desktopHudGeometry}from'./desktop-map-hud.mjs';
// Window overlay, deliberately independent of the panned map transform.
export function mapVignetteRect(w,h){const g=desktopHudGeometry(w,h);return{x:g.ox-2*g.scale,y:g.oy-2*g.scale,width:1.02*g.sw*g.scale,height:1.02*g.sh*g.scale};}
export function ambientFrame(animation,time,fps=30,loop=true){const n=animation.to-animation.from+1,e=Math.ceil(time*fps),index=loop?((e-1)%n+n)%n:Math.max(0,Math.min(n-1,e-1));return animation.prefix+'_'+String(animation.from+index).padStart(4,'0');}
const integer=(random,min,max)=>min+Math.floor(random()*(max-min+1));
export class MapAmbient{
 constructor(specs,random=Math.random){this.active=true;this.random=random;this.states=specs.map(spec=>({spec,time:(spec.loop?integer(random,spec.animation.from,spec.animation.to):spec.animation.to)/spec.fps,elapsed:0,next:spec.loop?Infinity:integer(random,...spec.wait),pos:spec.posList?.[0]||spec.pos,scale:spec.scaleList?.[0]||[1,1]}));}
 update(dt){if(!this.active)return;for(const s of this.states){s.time+=dt;s.elapsed+=dt;while(s.elapsed>=s.next){const at=s.next;if(s.spec.posList){const i=integer(this.random,0,s.spec.posList.length-1);s.pos=s.spec.posList[i];s.scale=s.spec.scaleList?.[i]||[1,1];}s.time=s.elapsed-at;s.next=at+(s.spec.animation.to-s.spec.animation.from+1)/s.spec.fps+integer(this.random,...s.spec.wait);}}}
 draw(scene,ctx,layer){if(!this.active)return;for(const s of this.states)if(s.spec.layer===layer){const key=ambientFrame(s.spec.animation,s.time,s.spec.fps,s.spec.loop);if(s.spec.scaleList){ctx.save();ctx.translate(...s.pos);ctx.scale(...s.scale);scene.sprite(ctx,key,0,0,...s.spec.anchor);ctx.restore();}else scene.sprite(ctx,key,...s.pos,...s.spec.anchor);}}
 destroy(){this.active=false;this.states=[];}
}
