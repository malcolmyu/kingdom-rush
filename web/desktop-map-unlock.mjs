import{PLAYABLE_STAGE_COUNT}from'./campaign-release.mjs';
import data from'./desktop-map-data.mjs';
const R=data.rewardMotion;
export function kuiFrame(time,last){return Math.max(1,Math.min(last,Math.ceil(time*30)));}
export function advanceDesktopMapClock(t,dt,difficultyOpen=false){t.uiTime+=dt;while(!t.started&&t.uiTime>=t.nextPoll){if(difficultyOpen)t.nextPoll+=.5;else{t.started=true;t.delay=t.nextPoll-R.initialWait;}}t.time=t.started?t.uiTime-t.delay:Math.min(t.uiTime,R.initialWait);}
// Desktop nominal coroutine schedule. No storage or gameplay mutation.
export class DesktopMapUnlockSequence{
 constructor(progress,before,previous,roads){Object.assign(this,{progress,before:before||progress,previous,roads,levels:new Map(),events:[]});let cursor=R.initialWait;this.needsTransition=false;
  for(let id=1;id<=Math.min(PLAYABLE_STAGE_COUNT,progress.unlocked);id++){
   const stars=progress.stars[id]||0,old=this.before.stars?.[id]||0,iron=!!progress.challenges[id+'-iron'],newIron=iron&&!this.before.challenges?.[id+'-iron'],newHero=progress.challenges[id+'-heroic']&&!this.before.challenges?.[id+'-heroic'],s={old,stars,blocks:[],modes:[]};
   const mode=iron&&!newIron?'iron':stars&&(old||stars===old)?'campaign':'nostar';s.modes.push({at:0,mode,restart:false,key:id+':initial'});
   const set=(at,mode,restart)=>s.modes.push({at,mode,restart,key:id+':'+mode+':'+at});
   if(stars>old){s.blockBegin=cursor;if(!iron){s.gotstarBegin=cursor+R.beforeReward;set(s.gotstarBegin,'gotstar',true);cursor+=R.beforeReward+R.gotstarHold;set(cursor,'campaign',false);this.needsTransition=true;}else cursor+=R.beforeReward;s.starBegin=cursor;for(let n=old;n<stars;n++){this.events.push({at:cursor,sound:'win-star'});cursor+=R.starInterval;}s.starEnd=cursor;s.blocks.push([s.blockBegin,cursor]);}
   if(newIron){const begin=cursor;s.ironBegin=cursor+R.beforeReward;this.events.push({at:s.ironBegin,sound:'win-star'});set(s.ironBegin,'turnIron',true);cursor=s.ironBegin+R.ironHold;s.ironEnd=cursor;set(cursor,'iron',false);s.blocks.push([begin,cursor]);this.needsTransition=true;}
   if(newHero){const begin=cursor;s.heroicBegin=cursor+R.beforeReward;this.events.push({at:s.heroicBegin,sound:'win-star'});cursor=s.heroicBegin+R.heroicHold;s.heroicEnd=cursor;s.blocks.push([begin,cursor]);}
   if(id>previous){if(id>1){s.roadBegin=cursor;this.events.push({at:cursor,sound:'map-new-road'});cursor+=(roads.find(r=>r.unlock_at===id)?.dots.length||0)*R.roadInterval;}s.flagBegin=cursor;set(cursor,'newFlag',true);this.events.push({at:cursor,sound:'map-new-flag'});cursor+=R.newFlagHold;s.flagEnd=cursor;set(cursor,'nostar',false);}
   s.end=cursor;this.levels.set(id,s);
  }this.duration=cursor;this.startBalloonAt=progress.unlocked===1?cursor:null;this.events.sort((a,b)=>a.at-b.at);
 }
 state(flag,time){const s=this.levels.get(flag.id);if(!s)return{visible:false,enabled:false};const hidden=s.flagBegin!==undefined&&time<s.flagBegin,phase=s.modes.findLast(p=>p.at<=time)||s.modes[0],reveal=s.flagBegin!==undefined&&time>=s.flagBegin&&time<s.flagEnd;
  const starFrames=Array.from({length:s.stars},(_,i)=>{if(s.starBegin===undefined||i<s.old)return 17;const at=s.starBegin+(i-s.old)*R.starInterval;return time<at?null:kuiFrame(time-at,17);});
  const heroic=!!this.progress.challenges[flag.id+'-heroic']&&(s.heroicBegin===undefined||time>=s.heroicBegin);
  return{visible:!hidden,enabled:!hidden&&!reveal&&!s.blocks.some(([a,b])=>time>=a&&time<b),phase,stars:s.stars,starFrames,heroic,wingFrame:s.heroicBegin===undefined?15:kuiFrame(time-s.heroicBegin,15),reveal};
 }
 dots(time){return this.roads.filter(r=>r.unlock_at<=Math.min(PLAYABLE_STAGE_COUNT,this.progress.unlocked)).flatMap(r=>{const at=this.levels.get(r.unlock_at)?.roadBegin;return r.dots.map((pos,i)=>({pos,frame:at===undefined?9:time<at+i*R.roadInterval?-1:kuiFrame(time-at-i*R.roadInterval,10)-1,hidden:(r.hidden_idx||[]).includes(i+1)}));}).filter(d=>!d.hidden&&d.frame>=0);}
}
