import data from './desktop-map-data.mjs';
import{MapUnlockSequence}from'./map-unlock.mjs';
// Desktop map is its own 1920x1080 image/window reference, not phone GUI/world.
export function desktopMapSize({x:w,y:h}){const scale=w/h<4/3?w/1920:h/1080;return{x:1920*scale,y:1080*scale,scale};}
export function desktopMapFlagFrame(state,time,hover=false){if(hover)return state.frame===6?'map_flag_0182':state.stars?'map_flag_0181':'map_flag_0180';const frame=state.reveal?Math.min(24,1+Math.floor(time*30)):state.frame===6?179:state.stars?134:64;return'map_flag_'+String(frame).padStart(4,'0');}
export class DesktopMapScene{
 constructor(canvas,top,renderer,unused,options){Object.assign(this,{canvas,top,renderer,flags:options.flags,time:0});this.timeline={time:0,previous:options.previous};this.unlock=new MapUnlockSequence(options.progress,options.previousProgress,options.previous,data.roads);this.onSound=options.onSound;this.nextSound=0;this.ready=false;this.host=options.host;this.readyPromise=fetch('assets/desktop-map/catalog.json').then(r=>{if(!r.ok)throw Error('桌面地图数据加载失败');return r.json();}).then(async meta=>{this.data=meta;const fontReady=document.fonts.load('400 22px OriginsCapitals',meta.hud.actions.buttons.map(b=>meta.hud.actions.text[b.key]).join('')).then(f=>{if(!f.length)throw Error('桌面地图字体未注册');});const loaded=await Promise.all([fontReady,Promise.all([meta.sheet,...Object.values(meta.images).map(i=>i.src)].map(async src=>[src,await renderer.repo.image(src)]))]);this.images=Object.fromEntries(loaded[1]);this.ready=true;this.draw();});
 const hint=document.createElement('div');hint.className='desktop-map-start map-start-balloon';const text=document.createElement('span');text.textContent=options.ui.data.fonts.text['START HERE!']||'从此处开始！';hint.append(text);hint.hidden=true;this.host.append(hint);this.startBalloon=hint;
 }
 update(dt){if(!this.ready)return;this.timeline.time+=dt;while(this.nextSound<this.unlock.events.length&&this.unlock.events[this.nextSound].at<=this.timeline.time)this.onSound?.(this.unlock.events[this.nextSound++].sound);this.draw();}
 sprite(ctx,key,x,y,anchorX=.5,anchorY=.5,alpha=1){const f=this.data.frames[key];if(!f)return;const[qx,qy,w,h]=f.q;ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(this.images[this.data.sheet],qx,qy,w,h,x-f.size[0]*anchorX+f.trim[0],y-f.size[1]*anchorY+f.trim[1],w,h);ctx.restore();}
 draw(){if(!this.ready)return;const time=this.timeline.time,ctx=this.canvas.getContext('2d'),over=this.top.getContext('2d');ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,1920,1080);over.clearRect(0,0,1920,1080);
 for(const key of['map_background_0001','map_background_0003','map_background_0002']){const f=this.data.images[key];ctx.drawImage(this.images[f.src],f.trim[0],f.trim[1]);}
 for(const dot of this.unlock.dots(time))this.sprite(ctx,'flag_bullet_'+String(Math.min(10,dot.frame+1)).padStart(4,'0'),dot.pos.x,dot.pos.y,.5,3/7);
 for(const flag of this.flags){const s=this.unlock.state(flag,time);if(flag.id>this.unlock.progress.unlocked){s.visible=false;s.enabled=false;}flag.button.disabled=!s.enabled;flag.button.hidden=!s.visible;const c=flag.canvas.getContext('2d');c.clearRect(0,0,88,120);if(!s.visible)continue;const key=desktopMapFlagFrame(s,time-(this.unlock.levels.get(flag.id)?.flagBegin||0),flag.hover);flag.canvas.dataset.icon=key;
 if(s.heroic)this.sprite(c,'map_flag_heroic_'+String(s.wingFrame||15).padStart(4,'0'),41,60);
 this.sprite(c,key,44,60);if(!s.reveal)for(let i=0;i<s.stars;i++)this.sprite(c,'mapFlag_star_'+String(Math.min(17,s.starFrames?.[i]||17)).padStart(4,'0'),[12,28,43][i]+17,12+17,.5,.5);
 }
 const hint=this.startBalloon,start=this.unlock.startBalloonAt,alpha=start===null?0:Math.max(0,Math.min(1,(time-start)/.5))**2;hint.hidden=!alpha;hint.style.opacity=alpha;const scale=.98+.02*Math.sin(time*.5);hint.style.transform=`translate(-50%,-100%) scale(${scale})`;if(alpha){over.save();over.translate(194,170);over.scale(scale,scale);this.sprite(over,'mapBalloon_starthere_notxt',0,0,.5,1,alpha);over.restore();}
 }
}
export{data as desktopMapData};
