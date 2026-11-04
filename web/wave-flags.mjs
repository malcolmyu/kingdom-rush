// Source game_gui.lua:4112–4228. Presentation reads World time, never advances it.
export function waveFlagPose(time,started,duration=0){return{scale:1+.075*Math.sin(2*Math.PI*(time-started)*1.25),phase:duration>0?Math.max(0,Math.min(1,(duration-(time-started))/duration)):0};}
export function incomingReport(group,road){const counts=new Map();for(const w of group?.waves||[])if(w.path_index-1===road)for(const s of w.spawns||[])if(s.max>0)counts.set(s.creep,(counts.get(s.creep)||0)+s.max);return[...counts].map(([key,count])=>({key,count}));}
export class WaveFlag{
 constructor(button,renderer,{flying=false,angle=0,started=0,duration=0}){Object.assign(this,{button,renderer,flying,angle,started,duration,selected:false});this.canvas=button.querySelector('canvas');this.canvas.width=168;this.canvas.height=168;this.ready=false;Promise.all(['waveFlag_0001','waveFlag_0002','waveFlag_0003','waveFlag_0004','waveFlag_selected'].map(k=>renderer.sheet(renderer.catalog.frames[k].a))).then(()=>{this.ready=true;});}
 draw(time,dim=false){if(!this.ready)return;const{scale,phase}=waveFlagPose(time,this.started,this.duration),c=this.canvas.getContext('2d'),r=this.renderer;c.clearRect(0,0,168,168);c.save();c.translate(84,84);c.scale(scale,scale);this.canvas.style.opacity=dim?.2:1;if(this.selected)r.sprite(c,'waveFlag_selected',0,0,2);
 if(phase>0){c.save();c.beginPath();c.moveTo(0,0);c.arc(0,0,60,Math.PI*1.5,Math.PI*3.5-phase*2*Math.PI);c.closePath();c.clip();r.sprite(c,'waveFlag_0003',0,0,2);c.restore();}
 r.sprite(c,this.flying?'waveFlag_0002':'waveFlag_0001',0,0,2);
 // Native phone pointer anchor is (-width/2+4,height/2).
 c.save();c.rotate(-this.angle);r.sprite(c,'waveFlag_0004',0,0,2,-26/24,.5);c.restore();c.restore();this.button.setAttribute('aria-pressed',String(this.selected));}
}
