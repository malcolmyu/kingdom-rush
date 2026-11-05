// Vanilla all-desktop/gg_views_custom.lua PopUpView: .5 show, .25 hide.
// Show enables immediately; the community mod's delayed enable is different.
export const BOOK_MOTION={show:.5,hide:.25,distance:50,initialShade:80,shownShade:160,hiddenShade:1};
export function bookPose(from,to,t){t=Math.max(0,Math.min(1,t));const out=t*(2-t),inside=t*t;return{y:from.y+(to.y-from.y)*out,alpha:from.alpha+(to.alpha-from.alpha)*out,shade:from.shade+(to.shade-from.shade)*inside};}
export function bookFrames(from,to,duration){const count=Math.ceil(duration*120);return Array.from({length:count+1},(_,i)=>{const p=bookPose(from,to,i/count);return{offset:i/count,translate:`0 ${p.y/720*100}%`,opacity:p.alpha,backgroundColor:`rgba(0,0,0,${p.shade/255})`};});}
export class BookMotion{
 constructor(){this.serial=0;this.active=false;this.phase='hidden';this.animations=[];}
 sample(){if(!this.active)return this.pose||{y:0,alpha:0,shade:1};return this.hostAnimation?bookPose(this.from,this.to,Number(this.hostAnimation.currentTime||0)/(this.duration*1000)):{...this.pose};}
 apply(p){this.pose={...p};this.host.style.translate=`0 ${p.y/720*100}%`;this.host.style.opacity=p.alpha;this.veil.style.backgroundColor=`rgba(0,0,0,${p.shade/255})`;}
 stop(){for(const a of this.animations)a.cancel();this.animations=[];this.hostAnimation=null;}
 run(from,to,duration,phase,finished=()=>{}){
  const serial=++this.serial;this.from=from;this.to=to;this.duration=duration;this.phase=phase;this.apply(from);
  return new Promise(resolve=>{this.resolve=resolve;const done=()=>{if(this.serial!==serial)return;this.apply(to);this.stop();this.phase=phase==='closing'?'hidden':'open';this.resolve=null;resolve(true);finished();};
   if(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches){done();return;}
   const frames=bookFrames(from,to,duration);this.hostAnimation=this.host.animate(frames.map(({offset,translate,opacity})=>({offset,translate,opacity})),{duration:duration*1000,fill:'forwards'});const shade=this.veil.animate(frames.map(({offset,backgroundColor})=>({offset,backgroundColor})),{duration:duration*1000,fill:'forwards'});this.animations=[this.hostAnimation,shade];Promise.all(this.animations.map(a=>a.finished)).then(done,()=>{});
  });
 }
 open(host,veil){this.reset();this.host=host;this.veil=veil;this.saved={translate:host.style.translate,opacity:host.style.opacity,inert:host.inert,background:veil.style.backgroundColor};this.active=true;host.inert=false;veil.classList.add('book-veil');return this.run({y:-50,alpha:0,shade:80},{y:0,alpha:1,shade:160},.5,'opening');}
 close(finished){if(this.phase==='closing')return this.closePromise;if(!this.active)return Promise.resolve(false);const from=this.sample();this.serial++;this.stop();this.resolve?.(false);this.resolve=null;this.host.inert=true;this.closePromise=this.run(from,{y:from.y-50,alpha:0,shade:1},.25,'closing',finished);return this.closePromise;}
 reset(){this.serial++;this.stop();this.resolve?.(false);this.resolve=null;if(this.host&&this.saved){this.host.style.translate=this.saved.translate;this.host.style.opacity=this.saved.opacity;this.host.inert=this.saved.inert;this.veil.style.backgroundColor=this.saved.background;this.veil.classList.remove('book-veil');}this.host=null;this.veil=null;this.saved=null;this.active=false;this.phase='hidden';this.closePromise=null;}
}
