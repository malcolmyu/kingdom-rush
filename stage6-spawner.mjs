import{harasserPathBounds}from'./harasser-jump.mjs';
// The level06 table contains only grouped, nonsequence, path-only entries.
// Keep generic PACK/CUSTOM/raise behavior out until a real stage needs it.
export function initStage6Spawner(w){if(w.id!==6)return;w.megaSpawner={data:w.data.stage6Spawner,manualWave:null,interrupt:false,current:undefined,hasCurrent:false,queue:[],insertQueue:[],removed:false};}
const modes={campaign:0,heroic:1,iron:2};
export function compileStage6Wave(w,name){const s=w.megaSpawner,d=s?.data,rows=d?.waves[modes[w.mode]]?.[name]||[],queue=[];
 for(const row of rows){const[delay,variation,group,subpath,qty,forceAll,sequence,min,max,key,custom]=row;
  if(forceAll||sequence||key==='CUSTOM'||key==='PACK')throw new Error('Unsupported stage6 spawner declaration');
  const points=d.groups[String(group)]||[group],counts=new Map();
  // Even singleton table.random and frandom(0,0) consume original RNG.
  for(let i=0;i<qty;i++){const id=points[w.number(0,points.length-1)];counts.set(id,(counts.get(id)||0)+1);}
  for(const id of points){let elapsed=0;for(let i=0;i<(counts.get(id)||0);i++){const lane=subpath>0?subpath-1:w.number(0,2);elapsed+=min+w.random()*(max-min);const at=delay+w.random()*variation+elapsed;const point=d.points[String(id)];if(!point||point.from||point.to||!point.path)throw new Error('Unsupported stage6 spawn point');queue.push({at,key,road:point.path-1,lane,custom});}}
 }
 return queue.sort((a,b)=>a.at-b.at);
}
export function updateStage6Spawner(w){const s=w.megaSpawner;if(!s)return;
 // Already queued source insertions are independent of a later interrupt/wave change.
 const staged=s.insertQueue;s.insertQueue=[];for(const p of staged){const e=w.spawn(p),route=w.routes[p.road][p.lane],node=(harasserPathBounds(w,p.road)?.start||1)-1;Object.assign(e,route.points[node],{d:route.lengths[node],customSpawnData:p.custom,megaSpawn:{wave:p.wave,node:node+1,insertedAt:w.time}});}
 if(s.removed)return;if(s.interrupt){s.removed=true;s.queue=[];return;}
 const finished=w.wave===w.totalWaves&&!w.pending.length&&w.time>=w.nextWaveReadyAt;
 const current=s.manualWave??(!finished?w.wave:null);
 // Source yields once between outer episodes. Same manual name is not replayed.
 if(s.hasCurrent&&current!==s.current){s.queue=[];s.hasCurrent=false;return;}
 if(!s.hasCurrent){s.current=current;s.hasCurrent=true;s.at=w.time;s.queue=compileStage6Wave(w,current);}
 while(s.queue.length&&w.time-s.at>=s.queue[0].at){const p=s.queue.shift();s.insertQueue.push({...p,wave:current});}
}
export{stage6EndingBlocksVictory}from'./stage6-ending.mjs';
