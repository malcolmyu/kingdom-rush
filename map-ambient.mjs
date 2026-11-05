import{desktopHudGeometry}from'./desktop-map-hud.mjs';
// Window overlay, deliberately independent of the panned map transform.
export function mapVignetteRect(w,h){const g=desktopHudGeometry(w,h);return{x:g.ox-2*g.scale,y:g.oy-2*g.scale,width:1.02*g.sw*g.scale,height:1.02*g.sh*g.scale};}
export function ambientFrame(animation,time,fps=30,loop=true){const n=animation.to-animation.from+1,e=Math.ceil(time*fps),index=loop?((e-1)%n+n)%n:Math.max(0,Math.min(n-1,e-1));return animation.prefix+'_'+String(animation.from+index).padStart(4,'0');}
const integer=(random,min,max)=>min+Math.floor(random()*(max-min+1));
const duration=(animation,fps)=>(animation.to-animation.from+1)/fps;
export function ambientWait(spec,random){const wait=integer(random,...spec.wait);if(!spec.idleAnimation)return wait;const cycle=duration(spec.idleAnimation,spec.fps);return Math.ceil(wait/cycle)*cycle;}
export class MapAmbient{
 constructor(specs,random=Math.random){this.active=true;this.random=random;this.states=specs.map(spec=>{const animation=spec.idleAnimation||spec.animation;return{spec,animation,loop:!!(spec.loop||spec.idleAnimation),time:(spec.loop?integer(random,animation.from,animation.to):animation.to)/spec.fps,elapsed:0,next:spec.loop?Infinity:ambientWait(spec,random),returnAt:Infinity,pos:spec.posList?.[0]||spec.pos,scale:spec.scaleList?.[0]||[1,1]};});}
 update(dt){if(!this.active)return;for(const s of this.states){s.time+=dt;s.elapsed+=dt;while(s.elapsed>=Math.min(s.next,s.returnAt)){const at=Math.min(s.next,s.returnAt);s.time=s.elapsed-at;if(s.returnAt<=s.next){s.animation=s.spec.idleAnimation;s.loop=true;s.returnAt=Infinity;continue;}if(s.spec.posList){const i=integer(this.random,0,s.spec.posList.length-1);s.pos=s.spec.posList[i];s.scale=s.spec.scaleList?.[i]||[1,1];}s.animation=s.spec.actionAnimation||s.spec.animation;s.loop=false;const end=at+duration(s.animation,s.spec.fps);s.returnAt=s.spec.idleAnimation?end:Infinity;s.next=end+ambientWait(s.spec,this.random);}}}
 draw(scene,ctx,layer){if(!this.active)return;for(const s of this.states)if(s.spec.layer===layer){const key=ambientFrame(s.animation,s.time,s.spec.fps,s.loop);if(s.spec.scaleList){ctx.save();ctx.translate(...s.pos);ctx.scale(...s.scale);scene.sprite(ctx,key,0,0,...s.spec.anchor);ctx.restore();}else scene.sprite(ctx,key,...s.pos,...s.spec.anchor);}}
 destroy(){this.active=false;this.states=[];}
}
