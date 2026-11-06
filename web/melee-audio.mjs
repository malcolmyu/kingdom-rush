import RULES from'./melee-audio-data.mjs';
// Original MeleeSword: sequence, ignore=.45, SWORDS max_sources=1. No timers
// or backlog: a rejected hit can never replay after combat/pause/scene changes.
export class MeleeAudio{
 constructor(tracks=new Set(),{create=src=>new Audio(src),clock=()=>performance.now()/1000}={}){this.tracks=tracks;this.create=create;this.clock=clock;this.index=0;this.last=-Infinity;this.active=null;}
 play(gain=1,volume=1){const now=this.clock();if(volume<=0||now-this.last<RULES.ignore)return;this.stop();const a=this.create(RULES.files[this.index]);this.index=(this.index+1)%RULES.files.length;this.last=now;a.loop=false;a.effectGain=gain*RULES.gain;a.volume=Math.min(1,.2*a.effectGain*volume);this.active=a;this.tracks.add(a);const done=()=>{this.tracks.delete(a);if(this.active===a)this.active=null;};a.onended=done;a.onerror=done;a.play().catch(done);return a;}
 stop(reset=false){const a=this.active;this.active=null;if(a){a.onended=a.onerror=null;a.pause();this.tracks.delete(a);}if(reset)this.last=-Infinity;}
}
