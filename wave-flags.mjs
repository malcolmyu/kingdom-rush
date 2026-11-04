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

// IncomingTooltip, game_gui.lua:3970–4104 (phone branch).
export function incomingTooltipPosition(x,y,width,height){const left=x>1.5*width,below=y<1.5*height;return{x:x+(left?-width-20:20),y:y+(below?21:-height-21),left,below};}
export class IncomingTooltip{
 constructor(element,ui){this.element=element;this.ui=ui;this.revision=0;}
 show(flag,report){const e=this.element,u=this.ui,text=u.data.fonts.text;this.revision++;this.tween?.cancel();e.hidden=false;e.replaceChildren();const title=document.createElement('strong'),body=document.createElement('div'),phrase=document.createElement('small');title.textContent=text['INCOMING WAVE'];body.textContent=report;phrase.textContent=text.WAVE_TOOLTIP_TAP_AGAIN;title.style.cssText=u.fontStyle('h',11);body.style.cssText=u.fontStyle('body',11);phrase.style.cssText=u.fontStyle('sans',9);e.append(title,body,phrase);
 const game=document.getElementById('game'),k=game.clientWidth/693,c=document.createElement('canvas').getContext('2d'),measure=node=>{const s=getComputedStyle(node);c.font=s.font;return Math.max(...node.textContent.split('\n').map(line=>c.measureText(line).width))/k;},width=Math.max(measure(title),measure(body),measure(phrase))+20,reportHeight=report.split('\n').length*11*1.1*1.2,height=4+15+reportHeight+10+10;this.width=width;this.height=height;e.style.width=width/693*100+'cqw';e.style.height=height/693*100+'cqw';title.style.top=4/693*100+'cqw';title.style.height=15/693*100+'cqw';body.style.top=19/693*100+'cqw';phrase.style.bottom=8/693*100+'cqw';
 this.flag=flag;this.position();this.tween=e.animate([{opacity:0},{opacity:1}],{duration:250,easing:'cubic-bezier(.333333,.666667,.666667,1)'});}
 position(){if(!this.flag)return;const game=document.getElementById('game'),k=game.clientWidth/693,x=parseFloat(this.flag.button.style.left)*693/100,y=parseFloat(this.flag.button.style.top)*game.clientHeight/100/k,p=incomingTooltipPosition(x,y,this.width,this.height),e=this.element;e.style.left=p.x/693*100+'cqw';e.style.top=p.y/693*100+'cqw';e.dataset.left=p.left;e.dataset.below=p.below;}
 hide(){this.flag=null;const e=this.element;if(e.hidden)return;const revision=++this.revision;this.tween?.cancel();this.tween=e.animate([{opacity:1},{opacity:0}],{duration:250,easing:'cubic-bezier(.333333,.666667,.666667,1)'});this.tween.onfinish=()=>{if(revision===this.revision)e.hidden=true;};}
}

// scripts.editor_wave_flag.insert: scripts.lua:5752–5767.
export function waveEntrances(level){return level.entities_list.filter(e=>e.template==='editor_wave_flag').map(e=>({path:e['editor.path_id'],pos:e.pos,angle:e['editor.r'],length:e['editor.len']})).sort((a,b)=>a.path-b.path);}
// game_gui.find_flag_position:1722–1791. Intersect outward ray with visible
// coordinate lines, then keep top/bottom flags at their authored positions
// unless inside the margin; side flags may extend by their authored length.
export function findWaveFlagPosition(entrance,visible,margin={t:65,b:65,l:65,r:65}){const p=entrance.pos,d={x:Math.cos(entrance.angle),y:Math.sin(entrance.angle)},hits=[];
 for(const[axis,value,side]of[['y',visible.top,'t'],['y',visible.bottom,'b'],['x',visible.right,'r'],['x',visible.left,'l']]){if(Math.abs(d[axis])<1e-5)continue;const t=(value-p[axis])/d[axis];if(t<0)continue;hits.push({distance:t,side,x:p.x+d.x*t,y:p.y+d.y*t});}
 hits.sort((a,b)=>a.distance-b.distance);const hit=hits[0];if(!hit)return{...p};const m=margin[hit.side];if(hit.side==='t'||hit.side==='b'){if(hit.distance>=m)return{...p};}else if(entrance.length&&hit.distance>entrance.length+m)return{x:p.x+d.x*entrance.length,y:p.y+d.y*entrance.length};return{x:hit.x-d.x*m,y:hit.y-d.y*m};}
