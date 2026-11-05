import data from'./desktop-map-data.mjs';
const rules=data.flagMotion;
export const flagMode=s=>s.frame===6?'iron':s.frame===2?'nostar':s.stars?'campaign':'nostar';
// LÖVE rounds random bounds to integers; the source repeat upper bound is10.1.
export function flagWait(random,repeat=false){const[lo,hi]=(repeat?rules.repeatWait:rules.initialWait).map(Math.round);return lo+Math.min(hi-lo,Math.floor(random()*(hi-lo+1)));}
export function flagAnimationFrame(mode,time){const a=rules.animations[mode],n=Math.max(1,Math.min(a.to-a.from+1,Math.ceil(time*rules.fps)));return'map_flag_'+String(a.from+n-1).padStart(4,'0');}
export class MapFlagMotion{
 constructor(mode,random=Math.random){this.random=random;this.hover=false;this.cooldown=0;this.active=true;this.setMode(mode,false);}
 setMode(mode,restart=false){this.mode=mode;this.ts=restart?0:1e9;this.wait=this.hover?-1:flagWait(this.random);}
 sync(mode){if(mode!==this.mode)this.setMode(mode);}
 enter(){if(!this.active||this.hover)return false;this.hover=true;this.wait=-1;return true;}
 leave(){if(!this.active||!this.hover)return;this.hover=false;this.setMode(this.mode,true);}
 click(){if(!this.active||this.cooldown>0)return false;this.cooldown=rules.clickLock;return true;}
 update(dt){if(!this.active)return;this.cooldown=Math.max(0,this.cooldown-dt);this.ts+=dt;if(this.wait<0)return;this.wait-=dt;if(this.wait<0){this.wait=flagWait(this.random,true);this.ts=0;}}
 frame(){return this.hover?'map_flag_'+(this.mode==='campaign'?'0181':this.mode==='iron'?'0182':'0180'):flagAnimationFrame(this.mode,this.ts);}
 reset(){this.active=false;this.hover=false;this.cooldown=0;}
}
