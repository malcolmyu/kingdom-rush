// First-level simulation. Rendering uses the APK's world coordinates (Y points up).
export const TOWERS = {
  archer: { name:'猎人之树', price:70, range:160, cooldown:.7, damage:[2,4], description:'精灵弓手快速射击，适合持续输出。', icon:'tower_preview_archer' },
  barrack: { name:'精灵兵营', price:90, range:145, cooldown:1, damage:[1,3], description:'训练三名精灵战士，在集结点拦截敌人。', icon:'tower_preview_barracks' },
  mage: { name:'秘法师高台', price:100, range:140, cooldown:1.5, damage:[4,6], description:'魔法飞弹无视物理护甲。', icon:'tower_preview_mage' },
  artillery: { name:'石环阵', price:125, range:150, cooldown:3, damage:[7,12], description:'德鲁伊投掷巨石，造成范围伤害。', icon:'tower_preview_artillery' }
};
export const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
function makeRoute(points) {
  const lengths=[0];
  for(let i=1;i<points.length;i++)lengths.push(lengths[i-1]+distance(points[i],points[i-1]));
  return {points,lengths,length:lengths.at(-1)};
}
function atRoute(route,d) {
  let lo=1,hi=route.lengths.length-1;
  while(lo<hi){const mid=(lo+hi)>>1;if(route.lengths[mid]<d)lo=mid+1;else hi=mid;}
  const i=lo,t=Math.max(0,Math.min(1,(d-route.lengths[i-1])/(route.lengths[i]-route.lengths[i-1]||1)));
  const a=route.points[i-1],b=route.points[i];
  return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,dx:b.x-a.x,dy:b.y-a.y};
}
export class World {
  constructor(data,seed=17) {
    this.data=data;this.seed=seed;this.time=0;this.gold=data.waves.cash;this.lives=20;this.wave=0;
    this.status='ready';this.paused=false;this.enemies=[];this.soldiers=[];this.shots=[];this.effects=[];
    this.events=[];this.pending=[];this.nextWaveAt=Infinity;this.kills=0;this.leaks=0;this.serial=0;
    this.cooldowns={reinforce:0,lightning:0,arrows:0};this.hero=null;
    this.routes=data.paths.map(p=>p.map(makeRoute));
    this.slots=data.level.entities_list.filter(e=>e.template==='tower_holder_elven_woods').map((s,i)=>({id:i,x:s.pos.x,y:s.pos.y,rally:{...s['tower.default_rally_pos']},type:null,spent:0,cd:0}));
  }
  random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
  emit(type,props={}){this.events.push({type,...props});}
  build(id,type){
    const s=this.slots[id],def=TOWERS[type];
    if(!s||s.type||!def||this.gold<def.price||['won','lost'].includes(this.status))return false;
    this.gold-=def.price;s.type=type;s.spent=def.price;s.cd=.4;
    if(type==='barrack')for(let i=0;i<3;i++)this.addSoldier(s.rally,i,s.id);
    this.effects.push({type:'build',x:s.x,y:s.y,life:.8,total:.8});this.emit('build');return true;
  }
  sell(id){const s=this.slots[id];if(!s?.type||['won','lost'].includes(this.status))return false;this.gold+=Math.floor(s.spent*.6);s.type=null;s.spent=0;this.soldiers=this.soldiers.filter(v=>v.home!==id);this.effects.push({type:'build',x:s.x,y:s.y,life:.8,total:.8});this.emit('coin');return true;}
  setRally(id,p){const s=this.slots[id];const q=this.nearestRoad(p);if(!s||s.type!=='barrack'||distance(s,q)>145||distance(p,q)>45)return false;s.rally={x:q.x,y:q.y};for(const v of this.soldiers.filter(v=>v.home===id))v.rally={x:q.x+(v.index-1)*12,y:q.y+(v.index%2)*12};return true;}
  nearestRoad(p){let best=null,dist=Infinity;for(const routes of this.routes)for(const q of routes[0].points){const d=distance(q,p);if(d<dist){best=q;dist=d;}}return best;}
  startWave(){
    if(this.wave>=this.data.waves.groups.length||['won','lost'].includes(this.status))return false;
    if(this.wave&&this.time<this.nextWaveAt-15)return false;
    if(this.wave&&Number.isFinite(this.nextWaveAt)){const bonus=Math.min(20,Math.max(0,Math.floor(this.nextWaveAt-this.time)));this.gold+=bonus;if(bonus)this.emit('bonus',{amount:bonus});}
    const group=this.data.waves.groups[this.wave++];this.status='playing';
    for(const w of group.waves){let t=this.time+w.delay/30;
      for(const s of w.spawns){for(let i=0;i<s.max;i++){
        // path_index selects the road, fixed_sub_path/path selects its lane.
        this.pending.push({at:t+i*s.interval/30,kind:s.creep,road:w.path_index-1,lane:s.fixed_sub_path?Math.max(0,s.path-1):Math.floor(this.random()*3)});
      }t+=Math.max(0,s.max-1)*s.interval/30+s.interval_next/30;}
    }
    this.pending.sort((a,b)=>a.at-b.at);this.nextWaveAt=this.time+group.interval/30;
    if(this.wave===5)this.hero={x:170,y:371,target:{x:170,y:371},hp:180,maxHp:180,cd:0,dead:0,anim:0};
    this.emit('wave',{wave:this.wave});return true;
  }
  addSoldier(p,index,home=null){const r={x:p.x+(index-1)*12,y:p.y+(index%2)*12};this.soldiers.push({id:++this.serial,x:r.x,y:r.y,rally:r,hp:50,maxHp:50,cd:0,dead:0,index,home,expires:home===null?this.time+20:Infinity,anim:0});}
  cast(type,p){
    const unlock={reinforce:2,lightning:3,arrows:5};
    if(!unlock[type]||this.wave<unlock[type]||this.cooldowns[type]>0||this.status!=='playing'||this.paused)return false;
    const q=this.nearestRoad(p);if(distance(p,q)>45)return false;
    if(type==='reinforce'){for(let i=0;i<2;i++)this.addSoldier(q,i);this.cooldowns[type]=15;}
    else {const radius=type==='lightning'?110:100;const damage=type==='lightning'?130:75;
      for(const e of this.enemies)if(e.hp>0&&distance(e,q)<radius)this.hurt(e,damage);
      this.effects.push({type,x:q.x,y:q.y,life:1,total:1});this.cooldowns[type]=type==='lightning'?60:45;
    }this.emit('cast');return true;
  }
  moveHero(p){if(!this.hero||this.hero.dead||this.status!=='playing')return false;const q=this.nearestRoad(p);if(distance(p,q)>70)return false;this.hero.target={x:q.x,y:q.y};return true;}
  hurt(e,n){if(e.hp<=0)return;e.hp-=n;e.flash=.12;if(e.hp<=0){e.deadAt=this.time;this.kills++;this.gold+=e.gold;this.effects.push({type:'coin',x:e.x,y:e.y+20,life:.8,total:.8,text:'+'+e.gold});this.emit('coin');}}
  shoot(source,target,type,damage){
    const height=type==='archer'?44:type==='mage'?60:type==='hero'?18:40;
    this.shots.push({x:source.x,y:source.y+height,sx:source.x,sy:source.y+height,target,id:++this.serial,elapsed:0,duration:type==='artillery'?.75:.3,type,damage,tx:target.x,ty:target.y+12});
    source.anim=.5;
  }
  step(dt){
    if(this.paused||!['ready','playing'].includes(this.status))return;
    this.time+=dt;
    for(const k in this.cooldowns)this.cooldowns[k]=Math.max(0,this.cooldowns[k]-dt);
    while(this.pending.length&&this.pending[0].at<=this.time){const p=this.pending.shift(),burn=p.kind==='enemy_gnoll_burner';this.enemies.push({id:++this.serial,kind:burn?'gnoll_burner':'gnoll_reaver',hp:burn?60:50,maxHp:burn?60:50,gold:burn?10:5,speed:burn?36:45,d:0,road:p.road,lane:p.lane,cd:0,flash:0,deadAt:0,...atRoute(this.routes[p.road][p.lane],0)});}
    const live=this.enemies.filter(e=>e.hp>0);
    for(const s of this.slots){s.cd-=dt;s.anim=Math.max(0,(s.anim||0)-dt);if(!s.type||s.type==='barrack'||s.cd>0)continue;
      const def=TOWERS[s.type],target=live.filter(e=>e.hp>0&&distance(s,e)<=def.range).sort((a,b)=>(a.routeLength-a.d)-(b.routeLength-b.d))[0];
      if(target){this.shoot(s,target,s.type,def.damage[0]+Math.floor(this.random()*(def.damage[1]-def.damage[0]+1)));s.cd=def.cooldown;}
    }
    const blockers=new Set();
    for(const s of this.soldiers){
      if(this.time>s.expires){s.expired=true;continue;}
      if(s.hp<=0){s.dead+=dt;if(s.home!==null&&s.dead>10){s.hp=s.maxHp;s.dead=0;s.x=s.rally.x;s.y=s.rally.y;}continue;}
      s.cd-=dt;s.anim=Math.max(0,s.anim-dt);
      const e=live.find(e=>e.hp>0&&!blockers.has(e.id)&&distance(s.rally,e)<45);
      if(e){blockers.add(e.id);if(s.cd<=0){this.hurt(e,2+Math.floor(this.random()*3));s.cd=1;s.anim=.5;}e.cd-=dt;if(e.cd<=0){s.hp-=e.kind==='gnoll_burner'?7:5;e.cd=1;}}
      else {const d=distance(s,s.rally);if(d>1){s.x+=(s.rally.x-s.x)/d*Math.min(d,65*dt);s.y+=(s.rally.y-s.y)/d*Math.min(d,65*dt);}s.hp=Math.min(s.maxHp,s.hp+2*dt);}
    }
    this.soldiers=this.soldiers.filter(s=>!s.expired);
    if(this.hero){const h=this.hero;h.cd-=dt;h.anim=Math.max(0,h.anim-dt);if(h.hp<=0){h.dead+=dt;if(h.dead>15){h.hp=h.maxHp;h.dead=0;}}else{
      const d=distance(h,h.target);if(d>3){h.x+=(h.target.x-h.x)/d*Math.min(d,90*dt);h.y+=(h.target.y-h.y)/d*Math.min(d,90*dt);h.walking=true;}
      else {h.walking=false;const e=live.find(e=>e.hp>0&&distance(h,e)<180);if(e&&h.cd<=0){this.shoot(h,e,'hero',12);h.cd=1;}if(e&&distance(h,e)<28){blockers.add(e.id);h.hp-=4*dt;}else h.hp=Math.min(h.maxHp,h.hp+3*dt);}
    }}
    for(const e of this.enemies){
      if(e.hp<=0)continue;e.flash=Math.max(0,e.flash-dt);const route=this.routes[e.road][e.lane];e.routeLength=route.length;
      e.blocked=blockers.has(e.id);if(!e.blocked)e.d+=e.speed*dt;
      Object.assign(e,atRoute(route,e.d));
      // The defend point is x=41; the original path continues offscreen for editor use.
      if(e.x<=41){e.hp=0;e.leaked=true;e.deadAt=this.time;this.lives=Math.max(0,this.lives-1);this.leaks++;this.emit('leak');}
    }
    for(const b of this.shots){b.elapsed+=dt;const t=Math.min(1,b.elapsed/b.duration);if(b.target.hp>0){b.tx=b.target.x;b.ty=b.target.y+12;}b.x=b.sx+(b.tx-b.sx)*t;b.y=b.sy+(b.ty-b.sy)*t+(b.type==='artillery'?Math.sin(t*Math.PI)*90:Math.sin(t*Math.PI)*15);
      if(t>=1){b.done=true;if(b.type==='artillery'){for(const e of this.enemies)if(e.hp>0&&distance(e,{x:b.tx,y:b.ty})<50)this.hurt(e,b.damage);this.effects.push({type:'impact',x:b.tx,y:b.ty,life:.5,total:.5});}else if(b.target.hp>0)this.hurt(b.target,b.damage);}
    }
    this.shots=this.shots.filter(b=>!b.done);this.enemies=this.enemies.filter(e=>e.hp>0||(!e.leaked&&this.time-e.deadAt<1));
    for(const f of this.effects)f.life-=dt;this.effects=this.effects.filter(f=>f.life>0);
    if(this.status==='playing'){
      if(this.lives<=0){this.status='lost';this.emit('lost');}
      else if(this.wave===6&&!this.pending.length&&!this.enemies.some(e=>e.hp>0)&&!this.shots.length){this.status='won';this.emit('won');}
      else if(this.wave<6&&this.time>=this.nextWaveAt)this.startWave();
    }
  }
  get stars(){return this.lives>=18?3:this.lives>=6?2:1;}
}
