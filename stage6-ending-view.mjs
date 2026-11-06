import{infobarViewport}from'./infobar.mjs';
const cubic=t=>1-(1-t)**3,quad=t=>t<.5?2*t*t:1-(-2*t+2)**2/2;
// Source phone show/hide-curtains and pan-zoom-camera. Poses follow Worldclock;
// resize recalculates the same source target, no render writes to simulation.
export class Stage6EndingView{
 constructor(app){this.app=app;this.owner=app.world;this.nodes=[];this.cameraPhase=null;this.guiHidden=false;for(const side of['top','bottom']){const n=document.createElement('div');n.dataset.stage6Curtain=side;n.style.cssText='position:absolute;background:black;pointer-events:none;z-index:190;display:none';document.getElementById('game').append(n);this.nodes.push(n);}}
 update(){const a=this.app,w=this.owner,s=w?.stage6Ending;if(a.world!==w||!s)return;const d=w.data.stage6Ending,c=a.renderer.camera;
  const hidden=!!s.guiHidden;if(hidden!==this.guiHidden){this.guiHidden=hidden;a.selected=null;a.selectedEnemy=null;a.targeting=null;a.showBuildMenu();a.hudMotion.setHidden(hidden);document.getElementById('battle-ui').inert=hidden;}
  const since=s.restoreAt??s.cinematicAt;if(since!==undefined&&this.cameraPhase!=='done'){const phase=s.restoreAt!==undefined?'return':'intro';if(this.cameraPhase!==phase){this.cameraPhase=phase;this.cameraFrom={x:c.x/a.renderer.k,y:768-c.y/a.renderer.k,zoom:c.zoom};}const t=Math.min(1,Math.max(0,(w.time-since)/d.cameraDuration)),p=quad(t),target=phase==='intro'?d.introCamera:d.returnCamera,z=phase==='intro'?d.introZoom:d.returnZoom,x=this.cameraFrom.x+(target.x-this.cameraFrom.x)*p,y=this.cameraFrom.y+(target.y-this.cameraFrom.y)*p,zoom=this.cameraFrom.zoom+(z-this.cameraFrom.zoom)*p;c.phase=1;Object.assign(c,c.clamp({...a.renderer.baseScreen({x,y}),zoom}));if(phase==='return'&&t>=1)this.cameraPhase='done';}
  if(s.cinematicAt===undefined)return;const game=document.getElementById('game'),v=infobarViewport({reference:d.guiReference},game.clientWidth,game.clientHeight),hide=s.restoreAt!==undefined,age=w.time-(s.restoreAt??s.cinematicAt),t=cubic(Math.min(1,Math.max(0,age))),strength=hide?1-t:t;
  for(const[i,n]of this.nodes.entries()){const source=d.curtains[i?'bottom':'top'],height=source.size.y*v.scale,travel=d.curtains.top.shown_y,shown=travel*strength*v.scale,y=i?v.origin.y+v.sh*v.scale-shown:v.origin.y+shown-height;Object.assign(n.style,{display:hide&&age>=1?'none':'block',left:v.origin.x+'px',top:y+'px',width:v.sw*v.scale+'px',height:height+'px'});}
 }
 destroy(){for(const n of this.nodes)n.remove();document.getElementById('battle-ui').inert=false;this.owner=null;}
}
