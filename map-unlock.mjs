import{flagState,newFlagPose}from'./map-flags.mjs';
// screen_map MapView: instant bounded centering, then one serial coroutine.
export function mapCenter(pos,viewport,size){return{x:Math.min(0,Math.max(viewport.x-size.x,viewport.x/2-pos.x)),y:Math.min(0,Math.max(viewport.y-size.y,viewport.y/2-pos.y))};}
export function mapSize(viewport){const ref=viewport.y/320,zoom=Math.max(1,Math.min(2,viewport.x/ref/640));return{x:640*ref*zoom,y:510*ref*zoom,scale:ref*zoom};}
export class MapUnlockSequence{
 constructor(progress,before,previous,roads){this.progress=progress;this.before=before||progress;this.previous=previous;this.roads=roads;this.levels=new Map();this.events=[];let cursor=1;
  for(let id=1;id<=Math.min(3,progress.unlocked);id++){
   const stars=progress.stars[id]||0,old=this.before.stars?.[id]||0,s={old,stars};
   if(stars>old){s.blockBegin=cursor;s.starBegin=cursor+.5+(progress.challenges[id+'-iron']?0:1);cursor=s.starBegin+(stars-old)*.5;s.starEnd=cursor;for(let i=old;i<stars;i++)this.events.push({at:s.starBegin+(i-old)*.5,sound:'win-star'});}
   for(const[mode,wait]of[['iron',4],['heroic',2]])if(progress.challenges[id+'-'+mode]&&!this.before.challenges?.[id+'-'+mode]){s.blockBegin??=cursor;s[mode+'Begin']=cursor+.5;cursor+=.5+wait;s[mode+'End']=cursor;this.events.push({at:s[mode+'Begin'],sound:'win-star'});}
   if(id>previous){s.roadBegin=cursor;cursor+=(roads.find(r=>r.unlock_at===id)?.dots.length||0)*.3;s.flagBegin=cursor;cursor+=1;s.flagEnd=cursor;this.events.push({at:s.flagBegin,sound:'map-new-flag'});}
   s.end=cursor;this.levels.set(id,s);
  }this.duration=cursor;this.startBalloonAt=progress.unlocked===1?cursor+.5:null;this.events.sort((a,b)=>a.at-b.at);
 }
 state(flag,time){const s=this.levels.get(flag.id),base=flagState(flag,this.progress,this.progress.unlocked,0,this.roads);if(!s)return base;
  if(s.flagBegin!==undefined){if(time<s.flagBegin)return{visible:false,enabled:false};return{...base,enabled:time>=s.flagEnd,reveal:time<s.flagEnd?newFlagPose(time-s.flagBegin):null};}
  if(s.starBegin!==undefined){base.starFrames=Array.from({length:3},(_,i)=>i>=s.stars?1:i<s.old?18:Math.max(1,Math.min(18,2+Math.floor((time-s.starBegin-(i-s.old)*.5)*30))));if(!s.old&&time<s.starBegin)base.frame=2;}
  if(s.ironBegin!==undefined&&time<s.ironBegin)base.frame=s.stars?4:2;
  if(s.heroicBegin!==undefined){base.heroic=time>=s.heroicBegin;base.wingFrame=Math.max(1,Math.min(15,1+Math.floor((time-s.heroicBegin)*30)));}
  base.enabled=base.enabled&&(s.blockBegin===undefined||time<s.blockBegin||time>=(s.heroicEnd??s.ironEnd??s.starEnd??0));return base;
 }
 dots(time){return this.roads.filter(r=>r.unlock_at<=Math.min(3,this.progress.unlocked)).flatMap(r=>{const start=this.levels.get(r.unlock_at)?.roadBegin;return r.dots.map((pos,i)=>({pos,frame:start===undefined?9:Math.min(9,Math.floor((time-start-i*.3)*30)),hidden:(r.hidden_idx||[]).includes(i+1)}));}).filter(d=>!d.hidden&&d.frame>=0);}
}

export function mapBalloonAlpha(time,start){return start===null||time<start?0:Math.min(1,(time-start)/.4);}
