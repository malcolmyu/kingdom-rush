// Deterministic, legal play: purchases use the live budget; skills use normal cooldowns.
export const plans={
 1:{campaign:[['37','artillery',1],['35','artillery',1],['29','archer',1],['39','artillery',1],['33','barrack',1],['31','archer',1],['41','archer',1]],heroic:[['37','artillery',1],['35','artillery',1],['29','archer',1],['39','artillery',1],['33','barrack',1]],iron:[['37','artillery',1],['35','artillery',1],['39','artillery',1],['33','barrack',1],['29','artillery',1]]},
 2:{campaign:[['24','artillery',2],['20','mage',2],['27','barrack',2],['28','artillery',2],['26','mage',2],['25','archer',2]],heroic:[["28", "artillery", 2], ["25", "barrack", 2], ["27", "mage", 2], ["28", "artillery", 1], ["24", "archer", 2], ["26", "archer", 2], ["20", "barrack", 1], ["26", "archer", 2], ["20", "barrack", 2], ["27", "mage", 2], ["25", "mage", 1], ["24", "archer", 1], ["29", "archer", 2]],iron:[["29","barrack",2],["26","archer",1],["20","archer",1],["24","archer",2],["28","barrack",1],["27","barrack",2],["29","barrack",2],["26","archer",2],["20","archer",2],["24","archer",2],["28","barrack",2],["27","barrack",2]]},
 3:{campaign:[["5","artillery",3],["7","mage",1],["1","archer",1],["4","archer",1],["10","archer",1],["2","barrack",1],["8","archer",2],["10","archer",2],["3","archer",3],["2","barrack",2],["5","artillery",2],["1","archer",2],["5","artillery",1],["7","mage",2],["1","archer",3],["2","barrack",3],["10","archer",3],["7","mage",3],["6","artillery",3]],heroic:[["7", "mage", 2], ["6", "mage", 3], ["2", "archer", 2], ["5", "mage", 2], ["1", "barrack", 2]],iron:[["1", "barrack", 2], ["2", "barrack", 2], ["6", "barrack", 2], ["1", "barrack", 3], ["2", "barrack", 3], ["6", "barrack", 3], ["5", "artillery", 3], ["7", "artillery", 3], ["3", "barrack", 3], ["9", "barrack", 3]]}
};
const growthCampaignPlan=[["10","archer",1],["5","artillery",1],["2","barrack",3],["10","archer",3],["10","archer",2],["5","barrack",2],["6","archer",3],["7","archer",1],["7","mage",1],["11","archer",3],["2","barrack",1],["1","archer",1],["4","archer",1],["7","mage",2],["1","archer",2],["5","artillery",2],["2","barrack",2],["3","archer",3],["1","artillery",2],["5","artillery",3],["8","archer",2]];
const campaignVeteranPlan=[["5","artillery",3],["5","artillery",1],["2","barrack",2],["10","archer",1],["4","archer",1],["2","barrack",1],["8","archer",2],["10","archer",2],["3","archer",3],["7","mage",1],["5","artillery",2],["1","archer",2],["1","archer",1],["7","mage",2],["1","archer",3],["2","barrack",3],["10","archer",3],["7","mage",3],["6","archer",3]];
const assignedPlans=new WeakMap(),initialXp=new WeakMap(),initialGold=new WeakMap();
export function purchase(w,plan){
 if(!initialXp.has(w))initialXp.set(w,w.heroXp);
 if(!initialGold.has(w))initialGold.set(w,w.gold);
 if(!plan){if(!assignedPlans.has(w))assignedPlans.set(w,w.id===3&&w.mode==='campaign'&&w.heroLevel<3?growthCampaignPlan:w.id===3&&w.mode==='campaign'&&w.heroLevel>=4?campaignVeteranPlan:plans[w.id][w.mode]);plan=assignedPlans.get(w);}
 for(const [holder,type,level]of plan){const s=w.slots.find(s=>String(s.holder)===holder);if(!s)continue;if(!s.type){if(w.build(s.id,type))return true;if(w.mode==='iron'&&w.id>1)return false;continue;}if(s.type===type&&s.level<level){if(w.upgrade(s.id))return true;if(w.mode==='iron'&&w.id>1)return false;continue;}}
 return false;
}
// Joined waterfall routes continue on another path; their local goal is not the exit.
export function remainingDistance(w,e){let road=e.road,d=e.d,total=0;const visited=new Set();while(!visited.has(road)){visited.add(road);const route=w.routes[road][e.lane],next=w.data.connections?.[String(road+1)];total+=(next?route.length:route.goal)-d;if(!next)break;road=next-1;d=0;}return total;}
// Trained volley guards the joined-route exit; other plans defend their local lane fronts.
function threatPriority(w,e){return w.id===3&&w.mode==='campaign'&&w.heroSkills.multishot>=2?remainingDistance(w,e):e.goal-e.d;}
function ahead(w,e,seconds=.7){const r=w.routes[e.road][e.lane],n=r.lengths.findIndex(x=>x>=Math.min(r.length,e.d+e.speed*seconds));return r.points[n<0?r.points.length-1:n];}
function tactics(w){if(w.id===1&&w.mode==='iron')return{hero:4,re:1,threshold:150,cluster:200,range:800};if(w.id===2&&w.mode==='campaign'&&initialXp.get(w)<2100)return{hero:3,re:.5,threshold:80,cluster:80,range:500};return w.id===1&&w.mode==='heroic'?{hero:0,re:2,threshold:400,cluster:200,range:500}:w.id===2&&w.mode==='heroic'?{hero:1,re:1.5,threshold:80,cluster:200,range:500}:w.id===3&&w.mode==='heroic'?{hero:0,re:w.heroSkills.multishot>=2?1:.5,threshold:150,cluster:120,range:500}:w.id===3&&w.mode==='campaign'?(initialXp.get(w)>=11300?{hero:4,re:2,threshold:150,cluster:80,range:300}:initialXp.get(w)<5300&&w.heroSkills.multishot<2?{hero:3,re:1.5,threshold:80,cluster:120,range:800}:{hero:2,re:1,threshold:80,cluster:300,range:800}):{re:w.id===2?1:0,range:500};}
const heldHeroes=new WeakSet();
function positionHero(w,danger){
 // After the UI purchase/refund smoke check, hold the exit with the hero.
 // Chasing the front enemy leaves a gap while the smaller opening budget rebuilds.
 if(w.id===2&&w.mode==='campaign'&&initialGold.get(w)<w.data.waves.cash)return;
if(w.id===3&&(w.mode==='heroic'&&w.heroSkills.multishot<2||w.mode==='campaign'&&initialXp.get(w)>=5300&&initialXp.get(w)<11300)){if(w.hero&&!heldHeroes.has(w)){w.moveHero(w.nearestRoad({x:400,y:w.mode==='heroic'?250:100}));heldHeroes.add(w);}return;}if(w.hero&&w.hero.hp>0&&!w.hero.pendingHit&&!w.hero.anim){const target=ahead(w,danger,tactics(w).hero??(w.id===3&&w.mode==='campaign'?(initialXp.get(w)<5000?.5:3):w.id===2&&w.mode==='heroic'&&initialXp.get(w)<5300?2.5:w.id===2||w.id===1&&w.mode==='heroic'?2:1));if(target&&Math.hypot(target.x-w.hero.target.x,target.y-w.hero.target.y)>100)w.moveHero(target);}}
// Reserve the last campaign lightning for an exit threat, with time for all three strikes.
function useSkillsSmart(w){const live=w.enemies.filter(e=>e.hp>0).sort((a,b)=>threatPriority(w,a)-threatPriority(w,b));if(!live.length)return;
 const danger=live[0],remaining=threatPriority(w,danger),finalExitDefense=w.id===3&&w.mode==='campaign'&&w.wave===w.totalWaves,threshold=finalExitDefense?300:tactics(w).threshold??(w.id===3?400:w.id===2&&w.mode==='iron'?100:w.id===2&&w.mode==='heroic'?(initialXp.get(w)<5300?200:300):150),cluster=finalExitDefense?Infinity:tactics(w).cluster??(w.id===3?80:w.id===2&&w.mode==='iron'?160:w.id===2&&w.mode==='heroic'?(initialXp.get(w)<5300?120:80):260);
 positionHero(w,danger);
 if(!danger.flying&&danger.key!=='enemy_hyena'&&remaining<tactics(w).range)w.cast('reinforce',ahead(w,danger,tactics(w).re));
 if(w.cooldowns.lightning<=0&&w.unlocked('lightning')){const target=remaining<threshold?danger:live.reduce((best,e)=>{const score=live.reduce((n,t)=>n+(Math.hypot(e.x-t.x,e.y-t.y)<105?Math.min(t.hp,175):0),0);return score>best.score?{e,score}:best;},{e:danger,score:0}).e;if(remaining<threshold||live.reduce((n,e)=>n+(Math.hypot(e.x-target.x,e.y-target.y)<105?Math.min(e.hp,175):0),0)>cluster)w.cast('lightning',target);}
 if(w.cooldowns.arrows<=0&&remaining<450)w.cast('arrows',ahead(w,danger));
 for(const p of w.plants)w.activatePlant(p.id);
}
export function useSkills(w){
 if(w.id===2&&w.mode!=='campaign'||w.id===3)return useSkillsSmart(w);
 const live=w.enemies.filter(e=>e.hp>0).sort((a,b)=>threatPriority(w,a)-threatPriority(w,b));if(!live.length)return;const danger=live[0],remaining=threatPriority(w,danger);
 positionHero(w,danger);
 if(!danger.flying&&danger.key!=='enemy_hyena'&&remaining<tactics(w).range)w.cast('reinforce',ahead(w,danger,tactics(w).re));
 if(w.cooldowns.lightning<=0&&w.unlocked('lightning')){const target=remaining<(tactics(w).threshold??240)?danger:live.reduce((best,e)=>{const score=live.reduce((n,t)=>n+(Math.hypot(e.x-t.x,e.y-t.y)<105?Math.min(t.hp,175):0),0);return score>best.score?{e,score}:best;},{e:danger,score:0}).e;if(remaining<(tactics(w).threshold??240)||live.filter(e=>Math.hypot(e.x-target.x,e.y-target.y)<105).length>=4)w.cast('lightning',target);}
 if(w.cooldowns.arrows<=0&&remaining<450)w.cast('arrows',ahead(w,danger));for(const p of w.plants)w.activatePlant(p.id);
}
export function play(w,maxSeconds=1800,plan,afterStep){for(let t=0;t<10;t++)purchase(w,plan);w.startWave();for(let i=0;i<maxSeconds*30&&w.status==='playing';i++){if(i%15===0){purchase(w,plan);useSkills(w);}w.step(1/30);afterStep?.(w);}return {stage:w.id,mode:w.mode,status:w.status,lives:w.lives,kills:w.kills,leaks:w.leaks,spawned:w.spawned,time:Math.round(w.time),gold:w.gold};}
