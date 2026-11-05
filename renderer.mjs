import{holderPreviewOverrides}from'./tower-preview.mjs';
import{SelectionMarkers}from'./selection-markers.mjs';
import{BattleCamera,worldViewport}from'./battle-camera.mjs';
import worldRules from'./world-rules.mjs';
// Canvas presentation. Reads the simulation; never changes game rules.
const values=x=>Array.isArray(x)?x:Object.values(x||{});
// Source utils.animation_name_for_angle: three directions, 45-degree sectors,
// and a 10-degree hysteresis band. Native side-view frames face right.
export function enemyDirection(dx,dy,previous=null,stickiness=10){
 if(!dx&&!dy)return previous||{facing:'RightLeft',flip:false,quadrant:4};
 const angle=(Math.atan2(dy,dx)*180/Math.PI+360)%360;
 const shift=previous?(previous.quadrant===1||previous.quadrant===3?stickiness:-stickiness):0;
 const [a,b,c,d]=[45-shift,135+shift,225-shift,315+shift];
 if(angle>=a&&angle<b)return{facing:'Up',flip:false,quadrant:1};
 if(angle>=b&&angle<c)return{facing:'RightLeft',flip:true,quadrant:2};
 if(angle>=c&&angle<d)return{facing:'Down',flip:false,quadrant:3};
 return{facing:'RightLeft',flip:false,quadrant:4};
}
export class Renderer{
 constructor(canvas,repository){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.repo=repository;this.catalog=repository.catalog;this.sheets=new Map();this.width=1672;this.height=1014;this.k=worldViewport(this.width,this.height).scale;this.camera=new BattleCamera(this.width,this.height);this.markers=new SelectionMarkers();this.map=null;this.missing=new Set();this.enemyDirections=new WeakMap();}
 baseScreen(p){return{x:p.x*this.k,y:(worldRules.height-p.y)*this.k};}
 screen(p){const q=this.baseScreen(p);return this.drawing?q:this.camera.project(q);}
 world(p){p=this.camera.unproject(p);return{x:p.x/this.k,y:worldRules.height-p.y/this.k};}
 async sheet(name){if(!this.sheets.has(name))this.sheets.set(name,await this.repo.image('assets/images/'+name));return this.sheets.get(name);}
 async loadLevel(data,current=()=>true){const map=await this.repo.image(data.map);if(!current())return false;
  const prefixes=['go_towers','go_decals','go_enemies_elven_woods','go_hero_elves_archer','go_stages_elven_woods',`go_stage${String(data.id).padStart(2,'0')}-`];
  const names=new Set(Object.values(this.catalog.frames).filter(f=>prefixes.some(p=>f.a.startsWith(p))).map(f=>f.a));await Promise.all([...names].map(n=>this.sheet(n)));if(!current())return false;this.camera.configure(worldViewport(this.width,this.height),data.level?.pan_extension?.top||0,data.level?.pan_extension?.bottom||0);this.markers.reset();this.map=map;this.data=data;return true;
 }
 async icon(canvas,key){const f=this.catalog.frames[key];if(!f)return;await this.sheet(f.a);const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);this.sprite(c,key,canvas.width/2,canvas.height/2,Math.min(canvas.width/f.size[0],canvas.height/f.size[1]));}
 frame(name,time=0,loop=true){if(this.catalog.frames[name])return name;const a=this.catalog.animations[name];if(!a)return null;const frames=a.frames||a.ranges?.flatMap(([from,to])=>Array.from({length:to-from+1},(_,i)=>from+i))||Array.from({length:(a.to||a.from||1)-(a.from||1)+1},(_,i)=>(a.from||1)+i);let f=Math.max(0,Math.floor(time*30));f=loop?f%frames.length:Math.min(f,frames.length-1);return a.prefix+'_'+String(frames[f]).padStart(4,'0');}
 sprite(c,key,x,y,scale=1,ax=.5,ay=.5,flip=false,alpha=1,rotation=0){if(c===this.ctx)scale*=worldRules.textureScale*this.k;const f=this.catalog.frames[key];if(!f){if(key)this.missing.add(key);return;}const image=this.sheets.get(f.a);if(!image)return;const[qx,qy,w,h]=f.q;c.save();c.globalAlpha=alpha;c.translate(x,y);if(rotation)c.rotate(-rotation);if(flip)c.scale(-1,1);c.drawImage(image,qx,qy,w,h,(f.trim[0]-f.size[0]*ax)*scale,(f.trim[1]-f.size[1]*ay)*scale,w*scale,h*scale);c.restore();}
 entity(key,pos,{time=0,state='idle',facing='Down',flip=false,alpha=1,overrides={},scale=1,spriteStates={}}={}){const t=this.catalog.templates[key];if(!t?.render?.sprites)return;
  for(let i=0;i<t.render.sprites.length;i++){const raw=t.render.sprites[i],s={...raw};for(const[k,v]of Object.entries(overrides)){const m=k.match(/^render\.sprites\[(\d+)\]\.(.+)$/);if(m&&Number(m[1])===i+1)s[m[2]]=v;}
   if(s.hidden||s.hidden_count>0)continue;const pose=spriteStates[i+1]||{},action=pose.state??state,elapsed=pose.time??time,face=pose.facing??facing;let name=s.name;
   if(s.animated){name=action;
    if(s.angles?.[action]){const pair=s.angles[action];name=pair[face==='Up'?0:pair.length-1];}
    else if(action==='death')name='death';
    else if(action==='walking'||action==='running')name='running';
    else if(['attack','ranged_attack'].includes(action)&&this.catalog.animations[(s.prefix||'')+'_'+action])name=action;
    const full=s.prefix?s.prefix+'_'+name:name;const loop=action==='idle'||action==='idle_sword'||action==='walk'||action==='walking'||action==='running';name=this.frame(full,elapsed,loop&&s.loop!==false)||this.frame(s.prefix+'_'+s.name,elapsed,s.loop!==false)||this.frame(s.name,elapsed,s.loop!==false);
   }
   if(!name)continue;if(name.includes('%04i'))name=name.replace('%04i',String(overrides['tower.terrain_style']||1).padStart(4,'0'));
   const p=this.screen({x:pos.x+(s.offset?.x||0),y:pos.y+(s.offset?.y||0)}),anchor=s.anchor||{x:.5,y:.5};
   this.sprite(this.ctx,name,p.x,p.y,scale*(s.scale?.x||1),anchor.x,1-anchor.y,(pose.flip??flip)||s.flip_x,alpha*(s.alpha??255)/255,s.r||0);
  }
 }
 circle(pos,r,fill,stroke){const c=this.ctx,p=this.screen(pos);c.beginPath();c.ellipse(p.x,p.y,r*this.k,r*this.k*.7,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}}
 draw(w,{selected=null,enemy=null,mode=null,hover=null,preview=null}={}){const c=this.ctx;c.clearRect(0,0,this.width,this.height);if(!this.map)return;this.drawing=true;c.save();c.translate(this.width/2,this.height/2);c.scale(this.camera.zoom,this.camera.zoom);c.translate(-this.camera.x,-this.camera.y);const bgScale=worldRules.textureScale*this.k,bg=this.baseScreen({x:worldRules.width/2,y:worldRules.height/2});c.drawImage(this.map,bg.x-this.map.width*bgScale/2,bg.y-this.map.height*bgScale/2,this.map.width*bgScale,this.map.height*bgScale);
  if(selected!==null&&w.slots[selected]){const s=w.slots[selected];const d=s.type?w.towerDef(s.type,s.level):null;this.circle(d?{x:s.x+d.rangeOffset.x,y:s.y+d.rangeOffset.y}:s,d?d.range:160,'#d5f19222','#e5eea699');}
  if(mode&&hover){const p=w.nearestRoad(hover);if(p)this.circle(p,mode==='lightning'?100:mode==='arrows'?35:24,'#7ccfdf33','#b8f4f8');}
  this.markers.update(w,{selected,enemy,mode});this.markers.draw(this);
  // Original map decoration layers include the river, waterfalls and foreground trees.
  const scenery=w.data.level.entities_list.filter(e=>e.template.startsWith('decal_')&&e.template!=='decal_background'&&e.template!=='decal_defend_point');
  const drawables=[...scenery.map(e=>({pos:e.pos,scenery:e})),...w.slots.map(s=>({pos:s,slot:s})),...w.plants.map(p=>({pos:p,plant:p})),...w.soldiers.map(u=>({pos:u,unit:u})),...w.enemies.map(u=>({pos:u,unit:u,enemy:true}))];if(w.hero)drawables.push({pos:w.hero,unit:w.hero,hero:true});drawables.sort((a,b)=>b.pos.y-a.pos.y);
  for(const a of drawables){if(a.scenery){this.entity(a.scenery.template,a.pos,{time:w.time,overrides:a.scenery});continue;}
   if(a.slot){const s=a.slot;if(!s.type)this.entity(s.terrain===2?'tower_holder_faerie_grove':'tower_holder_elven_woods',s,{overrides:{'tower.terrain_style':s.terrain,...holderPreviewOverrides(this.catalog.templates[s.terrain===2?'tower_holder_faerie_grove':'tower_holder_elven_woods'],s,preview)}});else if(w.time<s.buildUntil){const key='tower_build_'+({archer:'archer',barrack:'barrack',mage:'mage',artillery:'rock_thrower'}[s.type]);this.entity(key,s,{overrides:{'tower.terrain_style':s.terrain,'render.sprites[4].hidden':true}});const p=this.screen({x:s.x-21,y:s.y+50});c.save();c.beginPath();c.rect(p.x,p.y-8,54*(w.time-s.buildAt)/(s.buildUntil-s.buildAt),16);c.clip();this.sprite(c,'buildbar',p.x,p.y,1,0,.5);c.restore();}else{let state=s.anim?'shoot':'idle',time=s.anim?w.time-(s.actionAt??(w.time-.6+s.anim)):w.time;
    if(s.type==='barrack'){const age=w.time-(s.doorAt??-100),open=w.animationDuration(s.key+'_door','open'),hold=w.template(s.key).barrack.door_hold_time;state=age<open+hold?'open':'close';time=state==='open'?Math.min(age,open):Math.max(0,age-open-hold);}
    const overrides={'tower.terrain_style':s.terrain},spriteStates={};for(const[i,raw]of w.template(s.key).render.sprites.entries())if(raw.angles_flip_horizontal)spriteStates[i+1]={flip:s.flip};if(s.type==='archer'&&s.level>1){for(let i=3;i<=4;i++)if(i!==s.shooterIndex+3)spriteStates[i]={state:'idle',time:0};}if(s.type==='artillery'){const loading=w.time>=s.reloadAt&&w.time<s.reloadUntil;overrides['render.sprites[3].hidden']=!loading;if(loading){state='load';time=w.time-s.reloadAt;}}this.entity(s.key,s,{time,state,facing:s.facing,spriteStates,overrides});}continue;}
   if(a.plant){this.entity(a.plant.key,a.plant,{time:w.time,state:a.plant.anim?'shoot':'idle'});if(a.plant.cd>0){const p=this.screen(a.pos);c.font='18px Obelix';c.fillStyle='#f6e3ac';c.textAlign='center';c.fillText(Math.ceil(a.plant.cd),p.x,p.y-35);}continue;}
   const u=a.unit;if(u.leaked||u.home!==null&&u.departAt>w.time||u.hp<=0&&!a.enemy&&!a.hero&&u.dead>1.5)continue;let state='idle',facing='Down',flip=false,t=w.time+u.id*.031;
   if(a.enemy){if(u.hp<=0){state='death';t=w.time-u.deadAt;}else if(u.anim>0){state=u.action||'attack';t=w.time-u.actionAt;}else state=u.blocked?'idle':u.cowardUntil!==undefined?'run':'walk';if(w.template(u.key).coward_duration&&u.hp>0)t=w.time-(u.walkAt||0);const direction=enemyDirection(u.dx,u.dy,this.enemyDirections.get(u),this.catalog.templates[u.key]?.render?.sprites?.[0]?.angles_stickiness?.walk||0);this.enemyDirections.set(u,direction);facing=direction.facing;flip=u.hp<=0?(u.deathFlip??direction.flip):u.anim>0?(u.actionFlip??direction.flip):direction.flip;
    const raw=this.catalog.templates[u.key]?.render?.sprites?.[0],prefix=raw?.prefix,animation=prefix+'_'+(state==='walk'?'walking'+facing:state==='run'?'running'+facing:state);const p=this.screen(u),name=this.frame(animation,t,state==='walk'||state==='run'||state==='idle')||this.frame(prefix+'_idle',t);
    if(u.flying){c.fillStyle='#193a2c55';c.beginPath();c.ellipse(p.x,p.y+10,20,7,0,0,Math.PI*2);c.fill();}
    if(name)this.sprite(c,name,p.x,p.y-(u.flying?25:0),1,raw.anchor?.x??.5,1-(raw.anchor?.y??.15),flip,u.hp<=0?Math.max(0,1-t/1.2):1);
   }else{if(a.hero){if(u.hp<=0&&u.dead>=w.template(u.key).hero.tombstone_show_time){this.entity(w.template(u.key).hero.tombstone_decal,u);continue;}state=u.hp<=0?'death':u.walking?'walk':u.anim?u.action:u.stance==='sword'?'idle_sword':'idle';}else state=u.fadeOutAt!==undefined?'walk':u.hp<=0?'death':u.walking?'walk':u.shooting?'ranged_attack':u.anim?'attack':'idle';this.entity(u.key,u,{time:u.fadeOutAt!==undefined?w.time-u.fadeOutAt:u.hp<=0?u.dead:u.anim?w.time-(u.actionAt??(w.time-.6+u.anim)):u.walking?w.time-(u.walkAt||0):t,state,flip:u.flip,alpha:u.fadeOutAt!==undefined?Math.max(0,1-(w.time-u.fadeOutAt)*3):u.home===null?Math.min(1,(w.time-u.spawnAt)*3):u.hp<=0&&!a.hero?Math.min(1,(1.5-u.dead)*2):1});}
   if(u.hp>0&&u.gnawerBuff)this.entity('mod_gnoll_gnawer',u,{time:w.time-u.gnawerBuff.at});
   if(u.hp>0&&u.burn){const offset=w.template(u.key).unit?.mod_offset||{x:0,y:12};this.entity('mod_gnoll_burner',{x:u.x+offset.x,y:u.y+offset.y},{time:w.time-u.burn.at});}const p=this.screen(u);if(u.hp>0&&u.hp<u.maxHp){c.fillStyle='#203c2b';c.fillRect(p.x-18,p.y-48,36,6);c.fillStyle=a.enemy?'#cd4e34':'#76c74d';c.fillRect(p.x-17,p.y-47,34*u.hp/u.maxHp,4);}
  }
  for(const b of w.spells?.projectiles||[]){const progress=Math.min(1,Math.max(0,w.time-b.start)*b.speed/b.length),p=this.screen({x:b.from.x+(b.to.x-b.from.x)*progress,y:b.from.y+(b.to.y-b.from.y)*progress});this.sprite(c,'archer_hero_arrows_proy-f',p.x,p.y,1,.96296296296296,.5,false,1,Math.atan2(b.to.y-b.from.y,b.to.x-b.from.x));}
  for(const e of w.data.level.entities_list)if(e.template==='decal_background'&&e['render.sprites[1].name']!==`Stage${String(w.id).padStart(2,'0')}_0001`)this.entity(e.template,e.pos,{overrides:e});
  for(const b of w.shots){if(b.elapsed<0)continue;const p=this.screen(b),key=b.type==='torch'?this.frame('torch_gnoll_burner',b.elapsed):b.type==='hero'?'archer_hero_proy_0001-f':b.type==='artillery'?'artillery_thrower_proy':b.type==='mage'?this.frame('bolt_elves_travel',w.time):'arrow';this.sprite(c,key,p.x,p.y,1,.5,.5,false,1,b.type==='torch'?Math.PI+b.elapsed*b.rotationSpeed:b.type==='archer'||b.type==='hero'?-Math.atan2(-(b.ty-b.sy),b.tx-b.sx):0);}
  for(const f of w.effects){const p=this.screen(f),t=f.total-f.life;
   if(f.type==='coin'){c.save();c.globalAlpha=f.life/f.total;c.font='20px OriginsNumbers';c.textAlign='center';c.fillStyle='#ffe868';c.strokeStyle='#2b3e26';c.lineWidth=3;c.strokeText(f.text,p.x,p.y-t*30);c.fillText(f.text,p.x,p.y-t*30);c.restore();}
   else if(['rally','build','sell','impact','splash'].includes(f.type)){const names={rally:'rally_feedback',build:'tower_build_dust',sell:'tower_sell',impact:'fx_rock_explosion',splash:'fx_waterfall_splash'};const key=this.frame(names[f.type],t,false);if(key)this.sprite(c,key,p.x,p.y,1,.5,.75);}
   else if(f.type==='torch-impact'){this.entity('fx_torch_gnoll_burner_explosion',f,{time:t});}
   else if(f.type==='thunder-strike'){const alpha=t<.1?1:Math.max(0,1-(t-.1)/(.26666666666667-.1));if(alpha)this.sprite(c,'ray_000'+(f.variant||1),p.x,p.y,1,.5,1,false,alpha);if(t<16/30){const blast=this.frame('fx_power_thunder_explosion_half',t,false);this.sprite(c,blast,p.x,p.y,1,.5,1-.15714285714286);this.sprite(c,blast,p.x,p.y,1,.5,1-.15714285714286,true);}this.sprite(c,this.frame('decal_power_thunder_explosion',t,false),p.x,p.y,1,.5,.5,false,Math.min(1,(20/30-t)*4));}
   else if(f.type==='arrow-impact'){const alpha=t<1?1:Math.max(0,(4-t)/3);this.sprite(c,this.frame('decal_hero_elves_archer_ultimate',t,false),p.x,p.y,1,.5,.5,false,alpha);this.sprite(c,this.frame('fx_hero_elves_archer_ultimate_smoke',t,false),p.x,p.y,1,.5,.5,false,alpha);}


  }
  for(const p of w.exits)this.circle(p,18,'#8bc9d122','#bdeefa77');

 c.restore();this.drawing=false;
 }
}
