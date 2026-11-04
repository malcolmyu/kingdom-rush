// Deterministic, legal play: purchases use the live budget; skills use normal cooldowns.
export const plans={
 1:{campaign:[['37','artillery',1],['35','artillery',1],['29','archer',1],['39','artillery',1],['33','barrack',1],['31','archer',1],['41','archer',1]],heroic:[['37','artillery',1],['35','artillery',1],['29','archer',1],['39','artillery',1],['33','barrack',1]],iron:[['37','artillery',1],['35','artillery',1],['39','artillery',1],['33','barrack',1],['29','artillery',1]]},
 2:{campaign:[['24','artillery',2],['20','mage',2],['27','barrack',2],['28','artillery',2],['26','mage',2],['25','archer',2]],heroic:[['24','artillery',1],['20','mage',1],['28','artillery',1],['25','mage',1],['27','barrack',1],['20','mage',2],['24','artillery',2],['25','mage',2],['28','artillery',2],['27','barrack',2]],iron:[['24','archer',2],['20','archer',2],['27','barrack',2],['29','barrack',2],['28','archer',2]]},
 3:{campaign:[['5','artillery',1],['1','archer',1],['10','archer',1],['2','barrack',1],['10','archer',2],['7','mage',1],['5','artillery',2],['10','archer',3],['1','archer',2],['2','barrack',2],['7','mage',2],['1','archer',3],['2','barrack',3],['5','artillery',3],['7','mage',3],['6','artillery',3],['10','archer',3]],heroic:[['5','artillery',2],['1','archer',2],['2','barrack',2],['7','mage',2],['6','artillery',3]],iron:[['1','barrack',2],['2','barrack',2],['5','artillery',2],['1','barrack',3],['2','barrack',3],['7','artillery',2]]}
};
export function purchase(w,plan=plans[w.id][w.mode]){
 for(const [holder,type,level]of plan){const s=w.slots.find(s=>String(s.holder)===holder);if(!s)continue;if(!s.type){if(w.build(s.id,type))return true;if(w.mode==='iron'&&w.id>1)return false;continue;}if(s.type===type&&s.level<level){if(w.upgrade(s.id))return true;if(w.mode==='iron'&&w.id>1)return false;continue;}}
 return false;
}
function useSkillsSmart(w){const live=w.enemies.filter(e=>e.hp>0).sort((a,b)=>(a.goal-a.d)-(b.goal-b.d));if(!live.length)return;
 const danger=live[0],remaining=danger.goal-danger.d,threshold=w.id===2&&w.heroLevel>2?240:150,cluster=w.id===2&&w.heroLevel>2?200:260;
 if(w.hero&&w.hero.hp>0){const target=w.nearestRoad({x:danger.x+danger.dx*7,y:danger.y+danger.dy*7});if(target)w.moveHero(target);}
 if(!danger.flying&&remaining<500)w.cast('reinforce',danger);
 if(w.cooldowns.lightning<=0&&w.unlocked('lightning')){const target=remaining<threshold?danger:live.reduce((best,e)=>{const score=live.reduce((n,t)=>n+(Math.hypot(e.x-t.x,e.y-t.y)<105?Math.min(t.hp,175):0),0);return score>best.score?{e,score}:best;},{e:danger,score:0}).e;if(remaining<threshold||live.reduce((n,e)=>n+(Math.hypot(e.x-target.x,e.y-target.y)<105?Math.min(e.hp,175):0),0)>cluster)w.cast('lightning',target);}
 if(w.cooldowns.arrows<=0&&remaining<450)w.cast('arrows',danger);
 for(const p of w.plants)w.activatePlant(p.id);
}
export function useSkills(w){
 if(w.id===2&&w.mode==='heroic'||w.id===3)return useSkillsSmart(w);
 const live=w.enemies.filter(e=>e.hp>0).sort((a,b)=>(a.goal-a.d)-(b.goal-b.d));if(!live.length)return;const danger=live[0],remaining=danger.goal-danger.d;
 if(w.hero&&w.hero.hp>0){const target=w.nearestRoad({x:danger.x-danger.dx*7,y:danger.y-danger.dy*7});if(target)w.moveHero(target);}
 if(!danger.flying&&remaining<500)w.cast('reinforce',danger);
 if(w.cooldowns.lightning<=0&&w.unlocked('lightning')){const target=remaining<240?danger:live.reduce((best,e)=>{const score=live.reduce((n,t)=>n+(Math.hypot(e.x-t.x,e.y-t.y)<105?Math.min(t.hp,175):0),0);return score>best.score?{e,score}:best;},{e:danger,score:0}).e;if(remaining<240||live.filter(e=>Math.hypot(e.x-target.x,e.y-target.y)<105).length>=4)w.cast('lightning',target);}
 if(w.cooldowns.arrows<=0&&remaining<450)w.cast('arrows',danger);for(const p of w.plants)w.activatePlant(p.id);
}
export function play(w,maxSeconds=1800,plan){for(let t=0;t<10;t++)purchase(w,plan);w.startWave();for(let i=0;i<maxSeconds*30&&w.status==='playing';i++){if(i%15===0){purchase(w,plan);useSkills(w);}w.step(1/30);}return {stage:w.id,mode:w.mode,status:w.status,lives:w.lives,kills:w.kills,leaks:w.leaks,spawned:w.spawned,time:Math.round(w.time),gold:w.gold};}
