// Canvas presentation. Reads the simulation; never changes game rules.
const values=x=>Array.isArray(x)?x:Object.values(x||{});
export class Renderer{
 constructor(canvas,repository){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.repo=repository;this.catalog=repository.catalog;this.sheets=new Map();this.width=1672;this.height=1014;this.k=7/6;this.map=null;this.missing=new Set();}
 screen(p){return{x:this.width/2+(p.x-512)*this.k,y:this.height/2-(p.y-384)*this.k};}
 world(p){return{x:(p.x-this.width/2)/this.k+512,y:(this.height/2-p.y)/this.k+384};}
 async sheet(name){if(!this.sheets.has(name))this.sheets.set(name,await this.repo.image('assets/images/'+name));return this.sheets.get(name);}
 async loadLevel(data){this.map=await this.repo.image(data.map);this.data=data;
  const prefixes=['go_towers','go_decals','go_enemies_elven_woods','go_hero_elves_archer','go_stages_elven_woods',`go_stage${String(data.id).padStart(2,'0')}-`];
  const names=new Set(Object.values(this.catalog.frames).filter(f=>prefixes.some(p=>f.a.startsWith(p))).map(f=>f.a));await Promise.all([...names].map(n=>this.sheet(n)));
 }
 async icon(canvas,key){const f=this.catalog.frames[key];if(!f)return;await this.sheet(f.a);const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);this.sprite(c,key,canvas.width/2,canvas.height/2,Math.min(canvas.width/f.size[0],canvas.height/f.size[1]));}
 frame(name,time=0,loop=true){if(this.catalog.frames[name])return name;const a=this.catalog.animations[name];if(!a)return null;const frames=a.frames||a.ranges?.flatMap(([from,to])=>Array.from({length:to-from+1},(_,i)=>from+i))||Array.from({length:(a.to||a.from||1)-(a.from||1)+1},(_,i)=>(a.from||1)+i);let f=Math.max(0,Math.floor(time*30));f=loop?f%frames.length:Math.min(f,frames.length-1);return a.prefix+'_'+String(frames[f]).padStart(4,'0');}
 sprite(c,key,x,y,scale=1,ax=.5,ay=.5,flip=false,alpha=1,rotation=0){const f=this.catalog.frames[key];if(!f){if(key)this.missing.add(key);return;}const image=this.sheets.get(f.a);if(!image)return;const[qx,qy,w,h]=f.q;c.save();c.globalAlpha=alpha;c.translate(x,y);if(rotation)c.rotate(-rotation);if(flip)c.scale(-1,1);c.drawImage(image,qx,qy,w,h,(f.trim[0]-f.size[0]*ax)*scale,(f.trim[1]-f.size[1]*ay)*scale,w*scale,h*scale);c.restore();}
 entity(key,pos,{time=0,state='idle',facing='Down',flip=false,alpha=1,overrides={},scale=1,spriteStates={}}={}){const t=this.catalog.templates[key];if(!t?.render?.sprites)return;
  for(let i=0;i<t.render.sprites.length;i++){const raw=t.render.sprites[i],s={...raw};for(const[k,v]of Object.entries(overrides)){const m=k.match(/^render\.sprites\[(\d+)\]\.(.+)$/);if(m&&Number(m[1])===i+1)s[m[2]]=v;}
   if(s.hidden||s.hidden_count>0)continue;const pose=spriteStates[i+1]||{},action=pose.state??state,elapsed=pose.time??time,face=pose.facing??facing;let name=s.name;
   if(s.animated){name=action;
    if(s.angles?.[action]){const pair=s.angles[action];name=pair[face==='Up'?0:pair.length-1];}
    else if(action==='death')name='death';
    else if(action==='walking'||action==='running')name='running';
    else if(['attack','ranged_attack'].includes(action)&&this.catalog.animations[(s.prefix||'')+'_'+action])name=action;
    const full=s.prefix?s.prefix+'_'+name:name;const loop=action==='idle'||action==='walk'||action==='walking'||action==='running';name=this.frame(full,elapsed,loop&&s.loop!==false)||this.frame(s.prefix+'_'+s.name,elapsed,s.loop!==false)||this.frame(s.name,elapsed,s.loop!==false);
   }
   if(!name)continue;if(name.includes('%04i'))name=name.replace('%04i',String(overrides['tower.terrain_style']||1).padStart(4,'0'));
   const p=this.screen({x:pos.x+(s.offset?.x||0),y:pos.y+(s.offset?.y||0)}),anchor=s.anchor||{x:.5,y:.5};
   this.sprite(this.ctx,name,p.x,p.y,scale*(s.scale?.x||1),anchor.x,1-anchor.y,(pose.flip??flip)||s.flip_x,alpha*(s.alpha??255)/255,s.r||0);
  }
 }
 circle(pos,r,fill,stroke){const c=this.ctx,p=this.screen(pos);c.beginPath();c.ellipse(p.x,p.y,r*this.k,r*this.k*.72,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}}
 draw(w,{selected=null,mode=null,hover=null}={}){const c=this.ctx;c.clearRect(0,0,this.width,this.height);if(!this.map)return;c.drawImage(this.map,0,0,this.width,this.height);
  if(selected!==null&&w.slots[selected]){const s=w.slots[selected];this.circle(s,s.type?w.towerDef(s.type,s.level).range:160,'#d5f19222','#e5eea699');}
  if(mode&&hover){const p=w.nearestRoad(hover);if(p)this.circle(p,mode==='lightning'?105:mode==='arrows'?100:24,'#7ccfdf33','#b8f4f8');}
  // Original map decoration layers include the river, waterfalls and foreground trees.
  const scenery=w.data.level.entities_list.filter(e=>e.template.startsWith('decal_')&&e.template!=='decal_background'&&e.template!=='decal_defend_point');
  const drawables=[...scenery.map(e=>({pos:e.pos,scenery:e})),...w.slots.map(s=>({pos:s,slot:s})),...w.plants.map(p=>({pos:p,plant:p})),...w.soldiers.map(u=>({pos:u,unit:u})),...w.enemies.map(u=>({pos:u,unit:u,enemy:true}))];if(w.hero)drawables.push({pos:w.hero,unit:w.hero,hero:true});drawables.sort((a,b)=>b.pos.y-a.pos.y);
  for(const a of drawables){if(a.scenery){this.entity(a.scenery.template,a.pos,{time:w.time,overrides:a.scenery});continue;}
   if(a.slot){const s=a.slot;if(!s.type)this.entity(s.terrain===2?'tower_holder_faerie_grove':'tower_holder_elven_woods',s,{overrides:{'tower.terrain_style':s.terrain}});else if(w.time<s.buildUntil){const key='tower_build_'+({archer:'archer',barrack:'barrack',mage:'mage',artillery:'rock_thrower'}[s.type]);this.entity(key,s,{overrides:{'tower.terrain_style':s.terrain,'render.sprites[4].hidden':true}});const p=this.screen({x:s.x-21,y:s.y+50});c.save();c.beginPath();c.rect(p.x,p.y-8,54*(w.time-s.buildAt)/(s.buildUntil-s.buildAt),16);c.clip();this.sprite(c,'buildbar',p.x,p.y,1,0,.5);c.restore();}else{let state=s.anim?'shoot':'idle',time=s.anim?w.time-(s.actionAt??(w.time-.6+s.anim)):w.time;
    if(s.type==='barrack'){const age=w.time-(s.doorAt??-100),open=w.animationDuration(s.key+'_door','open'),hold=w.template(s.key).barrack.door_hold_time;state=age<open+hold?'open':'close';time=state==='open'?Math.min(age,open):Math.max(0,age-open-hold);}
    const overrides={'tower.terrain_style':s.terrain},spriteStates={};for(const[i,raw]of w.template(s.key).render.sprites.entries())if(raw.angles_flip_horizontal)spriteStates[i+1]={flip:s.flip};if(s.type==='archer'&&s.level>1){for(let i=3;i<=4;i++)if(i!==s.shooterIndex+3)spriteStates[i]={state:'idle',time:0};}if(s.type==='artillery'){const loading=w.time>=s.reloadAt&&w.time<s.reloadUntil;overrides['render.sprites[3].hidden']=!loading;if(loading){state='load';time=w.time-s.reloadAt;}}this.entity(s.key,s,{time,state,facing:s.facing,spriteStates,overrides});}continue;}
   if(a.plant){this.entity(a.plant.key,a.plant,{time:w.time,state:a.plant.anim?'shoot':'idle'});if(a.plant.cd>0){const p=this.screen(a.pos);c.font='18px Obelix';c.fillStyle='#f6e3ac';c.textAlign='center';c.fillText(Math.ceil(a.plant.cd),p.x,p.y-35);}continue;}
   const u=a.unit;if(u.leaked||u.departAt>w.time||u.hp<=0&&!a.enemy&&(a.hero||u.dead>1.5))continue;let state='idle',facing='Down',flip=false,t=w.time+u.id*.031;
   if(a.enemy){if(u.hp<=0){state='death';t=w.time-u.deadAt;}else if(u.anim>0){state=u.anim&&u.ranged?'shoot':'attack';t=u.anim ? .6-u.anim : w.time;}else state=u.blocked?'idle':'walk';facing=Math.abs(u.dy)>Math.abs(u.dx)*1.5?(u.dy>0?'Up':'Down'):'RightLeft';flip=u.dx>0;
    const raw=this.catalog.templates[u.key]?.render?.sprites?.[0],prefix=raw?.prefix,animation=prefix+'_'+(state==='walk'?'walking'+facing:state);const p=this.screen(u),name=this.frame(animation,t,state!=='death');
    if(u.flying){c.fillStyle='#193a2c55';c.beginPath();c.ellipse(p.x,p.y+10,20,7,0,0,Math.PI*2);c.fill();}
    if(name)this.sprite(c,name,p.x,p.y-(u.flying?25:0),1,raw.anchor?.x??.5,1-(raw.anchor?.y??.15),flip,u.hp<=0?Math.max(0,1-t/1.2):1);
   }else{if(a.hero)state=u.walking?'walk':u.anim?'ranged':'idle';else state=u.hp<=0?'death':u.walking?'walk':u.shooting?'ranged_attack':u.anim?'attack':'idle';this.entity(u.key,u,{time:u.hp<=0?u.dead:u.anim?w.time-(u.actionAt??(w.time-.6+u.anim)):u.walking?w.time-(u.walkAt||0):t,state,flip:a.hero?u.target.x>u.x:u.flip,alpha:u.hp<=0?Math.min(1,(1.5-u.dead)*2):1});}
   const p=this.screen(u);if(u.hp>0&&u.hp<u.maxHp){c.fillStyle='#203c2b';c.fillRect(p.x-18,p.y-48,36,6);c.fillStyle=a.enemy?'#cd4e34':'#76c74d';c.fillRect(p.x-17,p.y-47,34*u.hp/u.maxHp,4);}
  }
  for(const e of w.data.level.entities_list)if(e.template==='decal_background'&&e['render.sprites[1].name']!==`Stage${String(w.id).padStart(2,'0')}_0001`)this.entity(e.template,e.pos,{overrides:e});
  for(const b of w.shots){if(b.elapsed<0)continue;const p=this.screen(b),key=b.type==='artillery'?'artillery_thrower_proy':b.type==='mage'?this.frame('bolt_elves_travel',w.time):'arrow';this.sprite(c,key,p.x,p.y,1,.5,.5,false,1,b.type==='archer'||b.type==='hero'?-Math.atan2(-(b.ty-b.sy),b.tx-b.sx):0);}
  for(const f of w.effects){const p=this.screen(f),t=f.total-f.life;
   if(f.type==='coin'){c.save();c.globalAlpha=f.life/f.total;c.font='20px Obelix';c.textAlign='center';c.fillStyle='#ffe868';c.strokeStyle='#2b3e26';c.lineWidth=3;c.strokeText(f.text,p.x,p.y-t*30);c.fillText(f.text,p.x,p.y-t*30);c.restore();}
   else if(['rally','build','sell','impact','splash'].includes(f.type)){const names={rally:'rally_feedback',build:'tower_build_dust',sell:'tower_sell',impact:'fx_rock_explosion',splash:'fx_waterfall_splash'};const key=this.frame(names[f.type],t,false);if(key)this.sprite(c,key,p.x,p.y,1,.5,.75);}
   else if(f.type==='lightning'){c.save();c.globalAlpha=Math.min(1,f.life*2);c.strokeStyle='#d8ffff';c.lineWidth=8;c.shadowColor='#68d9ff';c.shadowBlur=25;c.beginPath();c.moveTo(p.x-40,p.y-400);c.lineTo(p.x+15,p.y-240);c.lineTo(p.x-25,p.y-180);c.lineTo(p.x+20,p.y-85);c.lineTo(p.x,p.y);c.stroke();c.restore();}
   else if(f.type==='arrows'){for(let i=0;i<20;i++)this.sprite(c,'arrow',p.x+Math.sin(i*3)*100,p.y+Math.cos(i*2)*50-(1-t)*150,1.4,.5,.5,false,1,-1.4);}
  }
  for(const p of w.exits)this.circle(p,18,'#8bc9d122','#bdeefa77');
  if(w.wave<w.totalWaves){const group=w.data.waves.groups[w.wave],roads=new Set(group.waves.map(x=>x.path_index-1));for(const road of roads){const route=w.routes[road][0],p=route.points.find(q=>q.x>=0&&q.x<=1024&&q.y>=30&&q.y<=730)||route.points[0];const s=this.screen(p);this.sprite(c,'waveFlag_0001',s.x,s.y,1.2);}}
 }
}
