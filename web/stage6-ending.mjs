import{spriteOrder}from'./render-order.mjs';
export function initStage6Ending(w){if(w.id===6&&w.mode==='campaign'&&w.data.stage6Ending)w.stage6Ending={phase:'waves',at:w.time,guiHidden:false,cart:null,boss:null,insertQueue:null};}
export const stage6WavesFinished=w=>w.wave===w.totalWaves&&!w.pending.length&&w.time>=w.nextWaveReadyAt;
const alive=w=>w.enemies.some(e=>e.hp>0&&!e.removed);
function phase(w,name){w.stage6Ending.phase=name;w.stage6Ending.at=w.time;}
export function nearestJailNode(w,pos){let result=null;for(let road=0;road<w.routes.length;road++){const r=w.routes[road][0];for(let i=0;i<r.points.length;i++){const p=r.points[i],d=Math.hypot(pos.x-p.x,pos.y-p.y);if(!result||d<result.distance)result={road,lane:0,node:i+1,distance:d};}}return result;}
export function flushStage6Boss(w){const s=w.stage6Ending,p=s?.insertQueue;if(!p||w.time<=p.at)return;const r=w.routes[p.road][0],point=r.points[p.node];if(!point)throw new Error('Original jail boss path node is missing');s.boss=w.spawn({key:'eb_gnoll',road:p.road,lane:0});Object.assign(s.boss,point,{d:r.lengths[p.node]});s.insertQueue=null;s.bossInsertedAt=w.time;}
export function updateStage6Ending(w){const s=w.stage6Ending;if(!s)return;const d=w.data.stage6Ending;
 switch(s.phase){
 case'waves':if(stage6WavesFinished(w)&&!alive(w))phase(w,'delay');break;
 case'delay':if(w.time-s.at>=d.delay){s.guiHidden=true;s.cinematicAt=w.time;const width=Math.max(1024,Math.min(768*16/9,Math.ceil(768*(w.harasserAspect||4/3))));s.cart={id:++w.serial,x:(1024-width)/2-d.fromOffset,y:d.destination.y,fromX:(1024-width)/2-d.fromOffset,at:w.time,openAt:null,lowered:false};phase(w,'travel');w.emit('stage6_cinematic');}break;
 case'travel':{const c=s.cart;if(c.arrivedAt!==undefined){c.openAt=w.time;phase(w,'open');break;}const duration=Math.abs(d.destination.x-c.fromX)/d.speed,t=Math.min(1,(w.time-c.at)/duration);c.x=c.fromX+(d.destination.x-c.fromX)*t;if(t>=1)c.arrivedAt=w.time;break;}
 case'open':if(w.time-s.at>=d.openWait){const p=nearestJailNode(w,s.cart);if(!p)throw new Error('No original boss spawn path');s.insertQueue={...p,at:w.time};s.bossQueuedAt=w.time;phase(w,'boss');}break;
 case'boss':if(w.time-s.bossQueuedAt>=d.lowerZWait)s.cart.lowered=true;if(s.boss?.gnollBoss.phase==='loop'){s.guiHidden=false;s.restoreAt=w.time;phase(w,'fight');w.emit('stage6_restore');}break;
 case'fight':if(s.boss?.gnollBoss.phase==='dead')phase(w,'death');break;
 case'death':if(s.boss?.gnollBoss.phase==='death-complete')phase(w,'final-delay');break;
 case'final-delay':if(w.time-s.at>=d.finalWait)phase(w,'final-clear');break;
 case'final-clear':if(stage6WavesFinished(w)&&!alive(w))phase(w,'complete');break;
 }
}
export function stage6EndingBlocksVictory(w){return w.id===6&&w.mode==='campaign'&&w.stage6Ending?.phase!=='complete';}
export function jailSprites(w,frame){const s=w.stage6Ending,c=s?.cart;if(!c)return[];const t=w.template('decal_s06_jailed_boss'),state=c.openAt===null?'walk':'open',age=w.time-(c.openAt??c.at);return t.render.sprites.map((raw,i)=>({raw:{...raw,z:c.lowered&&i<5?w.data.stage6Ending.decalsZ:raw.z},key:frame(raw.prefix+'_'+state,age,state==='walk'),pos:c,index:i+1,id:c.id}));}
export function drawStage6Jail(r,w){for(const p of jailSprites(w,r.frame.bind(r))){const q=r.screen(p.pos);r.sprite(r.ctx,p.key,q.x,q.y,1,p.raw.anchor.x,1-p.raw.anchor.y,p.raw.flip_x,p.raw.alpha/255,p.raw.r,spriteOrder(p.raw,p.pos,p.index,w.data.level.entities_list.length+p.id));}}
