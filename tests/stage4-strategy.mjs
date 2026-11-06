// Legal test-player commands only: no direct simulation writes or save unlocks.
import{purchase}from'./strategies.mjs';
export const stage4Plans={campaign:[['11','artillery',3],['12','archer',3],['16','archer',3],['17','archer',3],['21','barrack',3],['22','artillery',3],['14','archer',3],['13','archer',3],['15','mage',3],['24','barrack',3]],heroic:[['21','barrack',3],['12','mage',3],['14','mage',3],['11','archer',3],['17','artillery',3],['13','archer',3],['16','barrack',3],['15','artillery',3],['22','mage',3],['24','archer',3]],iron:[['12','archer',2],['11','archer',2],['15','archer',2],['17','archer',2],['23','artillery',2],['24','artillery',2],['16','artillery',2],['13','archer',2],['14','artillery',2]]};
const states=new WeakMap(),settings=new WeakMap();
export function stage4Settings(w,value){settings.set(w,value);}
function ahead(w,e,seconds=.7){const r=w.routes[e.road][e.lane],n=r.lengths.findIndex(x=>x>=Math.min(r.length,e.d+e.speed*seconds));return r.points[n<0?r.points.length-1:n];}
export function stage4Purchase(w){let s=states.get(w);if(!s){s={end:false};states.set(w,s);}const live=w.enemies.filter(e=>e.hp>0),hut=w.slots.find(s=>s.ewok);
 if(w.mode==='heroic'&&!s.end&&w.wave===w.totalWaves&&w.pending.length===0&&live.length&&live.every(e=>e.key==='enemy_ettin')){s.end=true;for(const slot of w.slots)if(slot.type&&!slot.ewok)w.sell(slot.id);w.repairEwok(hut.id);w.setRally(hut.id,{x:305,y:settings.get(w)?.rallyY??610});}
 if(s.end){if(w.soldiers.filter(u=>u.ewok).length<(settings.get(w)?.cap??4))w.hireEwok(hut.id);return;}
 if(w.mode==='campaign'){if(!hut.type){if(w.repairEwok(hut.id))return;}if(w.soldiers.filter(u=>u.ewok).length<2&&w.hireEwok(hut.id))return;}
 purchase(w,stage4Plans[w.mode]);
}
export function stage4Commands(w){const live=w.enemies.filter(e=>e.hp>0).sort((a,b)=>(a.goal-a.d)-(b.goal-b.d));if(!live.length)return;const danger=live[0],remaining=danger.goal-danger.d,h=w.hero;
 const ending=w.mode==='heroic'&&w.wave===w.totalWaves&&w.pending.length===0&&live.every(e=>e.key==='enemy_ettin');
 if(ending){if(h?.hp>0&&Math.abs(h.target.y-710)>15)w.moveHero({x:305,y:710});}
 else if(h?.hp>0&&!h.pendingHit&&!h.anim){const target=ahead(w,danger,1);if(target&&Math.hypot(target.x-h.target.x,target.y-h.target.y)>100)w.moveHero(target);}
 if(!danger.flying&&danger.key!=='enemy_hyena'&&remaining<500)w.cast('reinforce',ahead(w,danger,0));
 if(w.cooldowns.lightning<=0&&w.unlocked('lightning')){const target=remaining<240?danger:live.reduce((best,e)=>{const score=live.reduce((n,t)=>n+(Math.hypot(e.x-t.x,e.y-t.y)<105?Math.min(t.hp,175):0),0);return score>best.score?{e,score}:best;},{e:danger,score:0}).e;if(remaining<240||live.filter(e=>Math.hypot(e.x-target.x,e.y-target.y)<105).length>=4)w.cast('lightning',target);}
 if(w.cooldowns.arrows<=0&&remaining<450)w.cast('arrows',ahead(w,danger));for(const p of w.plants)w.activatePlant(p.id);
}
export function playStage4(w,afterStep,maxSeconds=1800){for(let i=0;i<10;i++)stage4Purchase(w);w.startWave();for(let i=0;i<maxSeconds*30&&w.status==='playing';i++){if(i%15===0){stage4Purchase(w);stage4Commands(w);}w.step(1/30);afterStep?.(w);}return{stage:w.id,mode:w.mode,status:w.status,lives:w.lives,stars:w.stars,kills:w.kills,leaks:w.leaks,spawned:w.spawned,time:w.time,gold:w.gold,xp:w.heroXp};}
