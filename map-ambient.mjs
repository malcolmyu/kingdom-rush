import{desktopHudGeometry}from'./desktop-map-hud.mjs';
// Window overlay, deliberately independent of the panned map transform.
export function mapVignetteRect(w,h){const g=desktopHudGeometry(w,h);return{x:g.ox-2*g.scale,y:g.oy-2*g.scale,width:1.02*g.sw*g.scale,height:1.02*g.sh*g.scale};}
export function ambientFrame(animation,time,fps=30){const n=animation.to-animation.from+1,e=Math.ceil(time*fps);return animation.prefix+'_'+String(animation.from+((e-1)%n+n)%n).padStart(4,'0');}
export class MapAmbient{
 constructor(specs,random=Math.random){this.active=true;this.states=specs.map(spec=>({spec,time:(spec.animation.from+Math.floor(random()*(spec.animation.to-spec.animation.from+1)))/spec.fps}));}
 update(dt){if(this.active)for(const s of this.states)s.time+=dt;}
 draw(scene,ctx,layer){if(!this.active)return;for(const s of this.states)if(s.spec.layer===layer)scene.sprite(ctx,ambientFrame(s.spec.animation,s.time,s.spec.fps),...s.spec.pos,...s.spec.anchor);}
 destroy(){this.active=false;this.states=[];}
}
