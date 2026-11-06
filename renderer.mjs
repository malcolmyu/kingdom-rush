import{drawWildMagus,drawWildEffects}from'./wild-magus.mjs';
import{drawStage6Jail}from'./stage6-ending.mjs';
import{drawGnollAuras}from'./gnoll-aura.mjs';
import{gnollBossPose}from'./gnoll-boss.mjs';
import{bladeSoldierPose,bladeDoorPose}from'./blade.mjs';
import{catPose}from'./alleria-cat.mjs';
import{alleriaPose}from'./stage5-alleria.mjs';
import{catapultPose,drawCatapultImpacts}from'./stage5-catapult.mjs';
import{isEnemyStunned}from'./enemy-status.mjs';
import{drawArcaneSlumbers}from'./arcane-slumber.mjs';
import{drawArcaneBursts}from'./arcane-burst.mjs';
import{arcaneSpriteStates,drawArcaneEffects}from'./arcane.mjs';
import{drawStage4Burn,burnScenery}from'./stage4-burn.mjs';
import{drawGryphons}from'./gryphon-events.mjs';
import{guardPose}from'./gryphon-guards.mjs';
import{ewokShieldPose}from'./ewok-shield.mjs';
import{blighterEnergySprites}from'./blighter-energy.mjs';
import{blightAlpha}from'./blighter.mjs';
import{carrierSprites}from'./carrier-sprites.mjs';
import{enemyDirection}from'./enemy-direction.mjs';
import{constructionBarPose,drawConstructionBar}from'./construction-bar.mjs';
import{TowerEffects}from'./tower-effects.mjs';
import{SkillEffects}from'./skill-effects.mjs';
import{GroundCorpses,isGroundCorpse}from'./ground-corpses.mjs';
import{projectileSprites,drawProjectileSprites,rockImpactOverrides,ProjectileMotion}from'./projectile-sprites.mjs';
import{healthBarFrames,drawHealthBars,heroHealthBarHidden}from'./health-bars.mjs';
import{flyingEnemySprites}from'./flying-enemy.mjs';
import{RenderQueue,spriteOrder}from'./render-order.mjs';
import{drawTowerRanges}from'./tower-ranges.mjs';
import{holderPreviewOverrides}from'./tower-preview.mjs';
import{SelectionMarkers}from'./selection-markers.mjs';
import{BattleCamera,worldViewport}from'./battle-camera.mjs';
import worldRules from'./world-rules.mjs';
// Canvas presentation. Reads the simulation; never changes game rules.
const values=x=>Array.isArray(x)?x:Object.values(x||{});
// Source utils.animation_name_for_angle: three directions, 45-degree sectors,
// and a 10-degree hysteresis band. Native side-view frames face right.
export{enemyDirection}from'./enemy-direction.mjs';
export class Renderer{
 constructor(canvas,repository){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.repo=repository;this.catalog=repository.catalog;this.sheets=new Map();this.sheetLoads=new Map();this.width=1672;this.height=1014;this.k=worldViewport(this.width,this.height).scale;this.camera=new BattleCamera(this.width,this.height);this.markers=new SelectionMarkers();this.map=null;this.missing=new Set();this.enemyDirections=new WeakMap();this.groundCorpses=new GroundCorpses();this.skillEffects=new SkillEffects();this.towerEffects=new TowerEffects();this.projectileMotion=new ProjectileMotion();}
 baseScreen(p){return{x:p.x*this.k,y:(worldRules.height-p.y)*this.k};}
 screen(p){const q=this.baseScreen(p);return this.drawing?q:this.camera.project(q);}
 world(p){p=this.camera.unproject(p);return{x:p.x/this.k,y:worldRules.height-p.y/this.k};}
 async sheet(name){if(this.sheets.has(name))return this.sheets.get(name);if(!this.sheetLoads.has(name)){const job=this.repo.image('assets/images/'+name).then(async image=>{await image.decode?.();this.sheets.set(name,image);return image;}).finally(()=>this.sheetLoads.delete(name));this.sheetLoads.set(name,job);}return this.sheetLoads.get(name);}
 async loadLevel(data,current=()=>true){const catalog=data.assetCatalog||this.repo.baseCatalog||this.repo.catalog;const background=this.repo.image(data.map);
  const prefixes=['go_towers','go_decals','go_enemies_elven_woods','go_hero_elves_archer','go_stages_elven_woods',`go_stage${String(data.id).padStart(2,'0')}-`];
  const names=new Set(Object.values(catalog.frames).filter(f=>prefixes.some(p=>f.a.startsWith(p))&&(!catalog.campaignScenerySheets||!f.a.startsWith('go_decals-')&&!f.a.startsWith('go_stages_elven_woods-'))&&(!catalog.campaignTowerSheets||!f.a.startsWith('go_towers-'))&&(!catalog.campaignEnemySheets||!f.a.startsWith('go_enemies_elven_woods-'))).map(f=>f.a));for(const n of [...catalog.campaignTowerSheets||[],...catalog.campaignEnemySheets||[],...catalog.campaignScenerySheets||[]])names.add(n);for(const e of data.level?.entities_list||[])for(const n of catalog.towerAssetGroups?.[e.template]||[])names.add(n);const[map]=await Promise.all([background,Promise.all([...names].map(n=>this.sheet(n)))]);if(!current())return false;this.camera.configure(worldViewport(this.width,this.height),data.level?.pan_extension?.top||0,data.level?.pan_extension?.bottom||0);this.markers.reset();this.groundCorpses.reset();this.skillEffects.reset();this.towerEffects.reset();this.projectileMotion.reset();this.catalog=catalog;this.map=map;this.data=data;return true;
 }
 async icon(canvas,key){const f=this.catalog.frames[key];if(!f)return;await this.sheet(f.a);const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);this.sprite(c,key,canvas.width/2,canvas.height/2,Math.min(canvas.width/f.size[0],canvas.height/f.size[1]));}
 frame(name,time=0,loop=true){if(this.catalog.frames[name])return name;const a=this.catalog.animations[name];if(!a)return null;const frames=a.frames||a.ranges?.flatMap(([from,to])=>Array.from({length:to-from+1},(_,i)=>from+i))||Array.from({length:(a.to||a.from||1)-(a.from||1)+1},(_,i)=>(a.from||1)+i);let f=Math.max(0,Math.floor(time*30));f=loop?f%frames.length:Math.min(f,frames.length-1);return a.prefix+'_'+String(frames[f]).padStart(4,'0');}
 sprite(c,key,x,y,scale=1,ax=.5,ay=.5,flip=false,alpha=1,rotation=0,order=null){if(this.orderQueue&&order&&c===this.ctx){const args=[c,key,x,y,scale,ax,ay,flip,alpha,rotation];this.orderQueue.add(order,()=>this.sprite(...args));return;}if(c===this.ctx)scale*=worldRules.textureScale*this.k;const f=this.catalog.frames[key];if(!f){if(key)this.missing.add(key);return;}const image=this.sheets.get(f.a);if(!image)return;const[qx,qy,w,h]=f.q;c.save();c.globalAlpha=alpha;c.translate(x,y);if(rotation)c.rotate(-rotation);if(flip)c.scale(-1,1);c.drawImage(image,qx,qy,w,h,(f.trim[0]-f.size[0]*ax)*scale,(f.trim[1]-f.size[1]*ay)*scale,w*scale,h*scale);c.restore();}
 entity(key,pos,{time=0,state='idle',facing='Down',flip=false,alpha=1,overrides={},scale=1,spriteStates={},renderId=this.entityOrderId||0}={}){const t=this.catalog.templates[key];if(!t?.render?.sprites)return;
  for(let i=0;i<t.render.sprites.length;i++){const raw=t.render.sprites[i],s={...raw};for(const[k,v]of Object.entries(overrides)){const m=k.match(/^render\.sprites\[(\d+)\]\.(.+)$/);if(m&&Number(m[1])===i+1)s[m[2]]=v;}
   if(s.hidden||s.hidden_count>0)continue;const pose=spriteStates[i+1]||{},action=pose.state??state,elapsed=pose.time??time,face=pose.facing??facing;let name=s.name;
   if(s.animated){name=action;
    if(s.angles?.[action]){const pair=s.angles[action];name=pair[face==='Up'?0:pair.length-1];}
    else if(action==='death')name='death';
    else if(action==='walking'||action==='running')name='running';
    else if(['attack','ranged_attack'].includes(action)&&this.catalog.animations[(s.prefix||'')+'_'+action])name=action;
    const full=s.prefix?s.prefix+'_'+name:name;const loop=action==='idle'||action==='idle_sword'||action==='walk'||action==='walking'||action==='running';name=this.frame(full,elapsed,(pose.loop??loop)&&s.loop!==false)||this.frame(s.prefix+'_'+s.name,elapsed,s.loop!==false)||this.frame(s.name,elapsed,s.loop!==false);
   }
   if(!name)continue;if(name.includes('%04i'))name=name.replace('%04i',String(overrides['tower.terrain_style']||1).padStart(4,'0'));
   const p=this.screen({x:pos.x+(s.offset?.x||0),y:pos.y+(s.offset?.y||0)}),anchor=s.anchor||{x:.5,y:.5};
   this.sprite(this.ctx,name,p.x,p.y,scale*(s.scale?.x||1),anchor.x,1-anchor.y,(pose.flip??flip)||s.flip_x,alpha*(s.alpha??255)/255,s.r||0,spriteOrder(s,pos,i+1,renderId));
  }
 }
 circle(pos,r,fill,stroke){const c=this.ctx,p=this.screen(pos);c.beginPath();c.ellipse(p.x,p.y,r*this.k,r*this.k*.7,0,0,Math.PI*2);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}}
 draw(w,{selected=null,enemy=null,mode=null,hover=null,preview=null,ranges=[]}={}){const c=this.ctx;c.clearRect(0,0,this.width,this.height);if(!this.map)return;this.drawing=true;c.save();c.translate(this.width/2,this.height/2);c.scale(this.camera.zoom,this.camera.zoom);c.translate(-this.camera.x,-this.camera.y);const bgScale=worldRules.textureScale*this.k,bg=this.baseScreen({x:worldRules.width/2,y:worldRules.height/2});c.drawImage(this.map,bg.x-this.map.width*bgScale/2,bg.y-this.map.height*bgScale/2,this.map.width*bgScale,this.map.height*bgScale);
  if(mode&&hover){const p=w.nearestRoad(hover);if(p)this.circle(p,mode==='lightning'?100:mode==='arrows'?35:24,'#7ccfdf33','#b8f4f8');}
  this.orderQueue=new RenderQueue();this.renderId=(obj)=>{const source=obj.source||obj,index=w.data.level.entities_list.indexOf(source);return index>=0?index+1:w.data.level.entities_list.length+(obj.id||0);};this.markers.update(w,{selected,enemy,mode});this.markers.draw(this);
  // Original map decoration layers include the river, waterfalls and foreground trees.
  const scenery=w.data.level.entities_list.filter(e=>!(w.stage4Burn&&burnScenery(e))&&e.template.startsWith('decal_')&&e.template!=='decal_background'&&e.template!=='decal_defend_point');
  const drawables=[...scenery.map(e=>({pos:e.pos,scenery:e})),...w.slots.map(s=>({pos:s,slot:s})),...w.plants.map(p=>({pos:p,plant:p})),...(w.alleriaCats||[]).map(u=>({pos:u,cat:u})),...(w.fixedAlleria?[{pos:w.fixedAlleria,fixedAlly:w.fixedAlleria}]:[]),...(w.stageHeroes||[]).map(u=>({pos:u,stageHero:u})),...(w.gryphonGuards||[]).map(u=>({pos:u,guard:u})),...w.soldiers.map(u=>({pos:u,unit:u})),...this.groundCorpses.update(w).map(u=>({pos:u,unit:u,enemy:true}))];if(w.hero)drawables.push({pos:w.hero,unit:w.hero,hero:true});drawables.sort((a,b)=>b.pos.y-a.pos.y);
  for(const a of drawables){this.entityOrderId=this.renderId(a.scenery||a.slot||a.plant||a.cat||a.fixedAlly||a.stageHero||a.guard||a.unit);if(a.scenery){this.entity(a.scenery.template,a.pos,{time:w.time,overrides:a.scenery});continue;}
   if(a.fixedAlly){const u=a.fixedAlly;this.entity(u.key,u,alleriaPose(w,u));drawHealthBars(this,healthBarFrames(w.template(u.key),u,{entityId:this.entityOrderId,hidden:u.phase==='intro'}));continue;}if(a.cat){this.entity(a.cat.key,a.cat,catPose(w,a.cat));continue;}if(a.stageHero){const u=a.stageHero;if(u.phase==='dead'&&u.dead>=w.template(u.key).hero.tombstone_show_time)this.entity(w.template(u.key).hero.tombstone_decal,u);else this.entity(u.key,u,alleriaPose(w,u));drawHealthBars(this,healthBarFrames(w.template(u.key),u,{entityId:this.entityOrderId,hidden:u.phase==='intro'||u.phase==='dead'||u.phase==='respawn'}));continue;}if(a.guard){const u=a.guard;this.entity(u.key,u,guardPose(w,u));continue;}if(a.slot){const s=a.slot;if(s.ewok){this.entity(s.key,s,{state:s.doorState||'close',time:w.time-(s.doorAt||0)});continue;}if(!s.type)this.entity(s.terrain===2?'tower_holder_faerie_grove':'tower_holder_elven_woods',s,{overrides:{...(s.scriptZ!==undefined?{'render.sprites[1].z':s.scriptZ}:{}),'tower.terrain_style':s.terrain,...holderPreviewOverrides(this.catalog.templates[s.terrain===2?'tower_holder_faerie_grove':'tower_holder_elven_woods'],s,preview)}});else if(w.time<s.buildUntil){const key='tower_build_'+({archer:'archer',barrack:'barrack',mage:'mage',artillery:'rock_thrower'}[s.type]);this.entity(key,s,{overrides:{'tower.terrain_style':s.terrain,'render.sprites[4].hidden':true}});drawConstructionBar(this,constructionBarPose(w.template(key),s,w.time,this.entityOrderId));}else{let state=s.anim?'shoot':'idle',time=s.anim?w.time-(s.actionAt??(w.time-.6+s.anim)):w.time;
    if(s.type==='barrack'){const age=w.time-(s.doorAt??-100),open=w.animationDuration(s.key+'_door','open'),hold=w.template(s.key).barrack.door_hold_time;state=age<open+hold?'open':'close';time=state==='open'?Math.min(age,open):Math.max(0,age-open-hold);}
    if(s.wild){drawWildMagus(this,w,s);continue;}const overrides={'tower.terrain_style':s.terrain},spriteStates={};for(const[i,raw]of w.template(s.key).render.sprites.entries())if(raw.angles_flip_horizontal)spriteStates[i+1]={flip:s.flip};if(s.arcane)Object.assign(spriteStates,arcaneSpriteStates(w,s));if(s.blade){const pose=bladeDoorPose(w,s);state=pose.state;time=pose.time;}if(!s.arcane&&s.type==='archer'&&s.level>1){for(let i=3;i<=4;i++)if(i!==s.shooterIndex+3)spriteStates[i]={state:'idle',time:0};}if(s.type==='artillery'){const loading=w.time>=s.reloadAt&&w.time<s.reloadUntil;overrides['render.sprites[3].hidden']=!loading;if(loading){state='load';time=w.time-s.reloadAt;}}this.entity(s.key,s,{time,state,facing:s.facing,spriteStates,overrides});}continue;}
   if(a.plant){this.entity(a.plant.key,a.plant,{time:w.time,state:a.plant.blocked?'loading':a.plant.anim?'shoot':'idle'});for(const mod of a.plant.blightMods||[])this.entity('mod_gnoll_blighter',a.plant,{time:w.time-mod.at,alpha:blightAlpha(w.template('mod_gnoll_blighter'),w.time-mod.at)});if(a.plant.cd>0){const p=this.screen(a.pos);this.orderQueue.add(spriteOrder({},a.pos,4,this.entityOrderId),()=>{c.font='18px Obelix';c.fillStyle='#f6e3ac';c.textAlign='center';c.fillText(Math.ceil(a.plant.cd),p.x,p.y-35);});}continue;}
   const u=a.unit;if(u.leaked||u.home!==null&&u.departAt>w.time||u.hp<=0&&!a.enemy&&!a.hero&&!u.ewok&&!u.blade&&u.dead>1.5)continue;let state='idle',facing='Down',flip=false,t=w.time+u.id*.031;
   if(a.enemy){if(u.hp<=0){state='death';t=w.time-u.deadAt;}else if(u.harasser&&(isEnemyStunned(u)||u.frozen)&&!u.harasser.phase){state='idle';t=0;}else if(u.harasser?.phase){state=u.harasser.animation;t=w.time-u.harasser.at;}else if(u.ettin?.phase){state=u.ettin.phase==='start'?'insaneStart':'insaneLoop';t=w.time-u.ettin.at;}else if(u.anim>0){state=u.action||'attack';t=w.time-u.actionAt;}else state=isEnemyStunned(u)||u.blocked||u.blighter?.rangedTarget?'idle':u.cowardUntil!==undefined?'run':'walk';if(w.template(u.key).coward_duration&&u.hp>0)t=w.time-(u.walkAt||0);if(isEnemyStunned(u)&&!u.ettin?.phase&&!u.harasser?.phase)t=0;const direction=u.carrier?.facing||enemyDirection(u.dx,u.dy,this.enemyDirections.get(u),this.catalog.templates[u.key]?.render?.sprites?.[0]?.angles_stickiness?.walk||0);this.enemyDirections.set(u,direction);if(u.carrier&&u.hp>0){t=isEnemyStunned(u)?0:w.time-u.carrier.spawnAt;if(isEnemyStunned(u))state='idle';}if(u.payloadBornAt!==undefined&&u.hp>0&&u.anim<=0)t=w.time-u.walkAt;facing=direction.facing;flip=u.hp<=0?(u.deathFlip??direction.flip):(u.anim>0||u.harasser?.phase)?(u.actionFlip??direction.flip):direction.flip;
    const raw=this.catalog.templates[u.key]?.render?.sprites?.[0],prefix=raw?.prefix,animation=prefix+'_'+(state==='walk'?'walking'+facing:state==='run'?'running'+facing:state);const p=this.screen(u),name=this.frame(animation,t,state==='walk'||state==='run'||state==='idle'||u.key==='enemy_ettin'&&state==='insaneLoop')||this.frame(prefix+'_idle',t);
    if(u.gnollBoss)this.entity(u.key,u,gnollBossPose(w,u));else if(u.catapult)this.entity(u.key,u,catapultPose(w,u));else if(u.key==='enemy_perython'||u.carrier){for(const pose of u.carrier?carrierSprites(w.template(u.key),u,{state,facing,flip,elapsed:t,frame:this.frame.bind(this)}):flyingEnemySprites(w.template(u.key),u,{body:name,flip,elapsed:t,deathDuration:w.animationDuration(prefix,'death')})){const q=this.screen(pose.pos);this.sprite(c,pose.key,q.x,q.y,pose.scale,pose.anchor.x,1-pose.anchor.y,pose.flip,pose.alpha,pose.rotation,spriteOrder(pose.raw,u,pose.index,this.entityOrderId));}}
    else if(name)this.sprite(c,name,p.x,p.y,1,raw.anchor?.x??.5,1-(raw.anchor?.y??.15),flip,isGroundCorpse(u)?1:u.hp<=0?Math.max(0,1-t/1.2):1,0,spriteOrder(raw,u,1,this.entityOrderId));
   }else if(u.blade){this.entity(u.key,u,bladeSoldierPose(w,u));}else{if(a.hero){if(u.hp<=0&&u.dead>=w.template(u.key).hero.tombstone_show_time){this.entity(w.template(u.key).hero.tombstone_decal,u);continue;}state=u.hp<=0?'death':u.walking?'walk':u.anim?u.action:u.stance==='sword'?'idle_sword':'idle';}else state=u.fadeOutAt!==undefined?'walk':u.hp<=0?'death':u.walking?'walk':u.shooting?(u.ewok?'shoot':'ranged_attack'):u.anim?'attack':'idle';const shield=u.hp>0?ewokShieldPose(u,w.time):null;this.entity(u.key,u,{time:shield?shield.time:u.fadeOutAt!==undefined?w.time-u.fadeOutAt:u.hp<=0?u.dead:u.anim?w.time-(u.actionAt??(w.time-.6+u.anim)):u.walking?w.time-(u.walkAt||0):t,state:shield?shield.state:state,flip:u.flip,alpha:u.fadeOutAt!==undefined?Math.max(0,1-(w.time-u.fadeOutAt)*3):u.home===null?Math.min(1,(w.time-u.spawnAt)*3):u.hp<=0&&!a.hero&&!u.ewok?Math.min(1,(1.5-u.dead)*2):1});}
   if(u.hp>0&&u.gnawerBuff&&!u.harasser?.jumpHidden)this.entity('mod_gnoll_gnawer',u,{time:w.time-u.gnawerBuff.at});
   if(u.hp>0&&u.burn&&!u.harasser?.jumpHidden){const offset=w.template(u.key).unit?.mod_offset||{x:0,y:12};this.entity('mod_gnoll_burner',{x:u.x+offset.x,y:u.y+offset.y},{time:w.time-u.burn.at});}drawHealthBars(this,healthBarFrames(w.template(u.key),u,{entityId:this.entityOrderId,hidden:u.gnollBoss?u.gnollBoss.phase==='intro':a.hero?heroHealthBarHidden(u,w.time,w.animationDuration(u.key,u.action)):u.catapult?.healthHidden??w.template(u.key).health_bar?.hidden}));
  }
  // Merge source projectile sprites and the existing foreground into actor
  // ordering before replay. World arrays, flight positions and clocks stay read-only.
  drawStage6Jail(this,w);drawGnollAuras(this,w);drawCatapultImpacts(this,w);drawStage4Burn(this,w);drawGryphons(this,w);for(const b of w.shots)drawProjectileSprites(this,b.type==='blighter-energy'?blighterEnergySprites(w.template(b.bullet),b,w.time,this.frame.bind(this),this.renderId(b)):this.projectileMotion.poses(w.template(b.bullet),b,this.frame.bind(this),{entityId:this.renderId(b)}));
  for(const b of w.spells?.projectiles||[]){const progress=Math.min(1,Math.max(0,w.time-b.start)*b.speed/b.length),pose={x:b.from.x+(b.to.x-b.from.x)*progress,y:b.from.y+(b.to.y-b.from.y)*progress,sx:b.from.x,sy:b.from.y,tx:b.to.x,ty:b.to.y,elapsed:w.time-b.start};drawProjectileSprites(this,projectileSprites(w.template('arrow_hero_elves_archer_ultimate'),pose,this.frame.bind(this),{entityId:this.renderId(b),ultimate:true}));}
  for(const e of w.data.level.entities_list)if(e.template==='decal_background'&&e['render.sprites[1].name']!==`Stage${String(w.id).padStart(2,'0')}_0001`)this.entity(e.template,e.pos,{overrides:e,renderId:this.renderId(e)});
  for(const [i,f]of w.effects.entries())if(f.type==='impact'||f.type==='torch-impact')this.entity(f.type==='impact'?'fx_rock_explosion':'fx_torch_gnoll_burner_explosion',f,{time:f.total-f.life,overrides:f.type==='impact'?rockImpactOverrides(w.template('rock_1').bullet):{},renderId:w.data.level.entities_list.length+w.serial+i+1});
  for(const[i,f]of w.effects.entries())if(f.type==='thunder-strike'||f.type==='arrow-impact')this.skillEffects.draw(this,f,w.data.level.entities_list.length+w.serial+3*i+1);
  drawArcaneEffects(this,w);drawWildEffects(this,w);drawArcaneBursts(this,w);drawArcaneSlumbers(this,w);
  this.towerEffects.draw(this,w);
  const queue=this.orderQueue;this.orderQueue=null;queue.flush();this.entityOrderId=0;
  for(const f of w.effects){const p=this.screen(f),t=f.total-f.life;
   // Ordinary enemy gold has no floating reward in the source. Hand of
   // Midas is a separate, unsupported power; WaveReward DOM remains separate.
   if(['rally','splash'].includes(f.type)){const names={rally:'rally_feedback',splash:'fx_waterfall_splash'};const key=this.frame(names[f.type],t,false);if(key)this.sprite(c,key,p.x,p.y,1,.5,.75);}



  }
  drawTowerRanges(this,ranges);
  for(const p of w.exits)this.circle(p,18,'#8bc9d122','#bdeefa77');

 c.restore();this.drawing=false;
 }
}
