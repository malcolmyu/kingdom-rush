import{spriteOrder}from'../render-order.mjs';
import{tweenValue}from'../skill-effects.mjs';
import{routeNode,registerHopliteChild}from'./hoplite.mjs';
import{insertSatyr}from'./satyr.mjs';
import{insertHoplite}from'./hoplite.mjs';
import{insertHarasser}from'../harasser.mjs';
import{insertBlighter}from'../blighter.mjs';
import{removeWildWard}from'../wild-ward.mjs';
// Source path and node indices remain one-based in the section table.
export function faerieCell(grid,p){const x=Math.max(1,Math.min(grid.grid.length,Math.ceil((p.x-grid.ox)/16))),y=Math.max(1,Math.min(grid.grid[0].length,Math.ceil((p.y-grid.oy)/16)));return !!(grid.grid[x-1][y-1]&1024);}
export function compileFaerieSections(paths,cell){const out=[];for(const[road,lanes]of paths.entries()){let start=null;for(const[i,p]of lanes[0].entries()){const yes=cell(p);if(start===null&&yes)start=i+1;else if(start!==null&&!yes){out.push({road,start,end:i+1});start=null;}}if(start!==null)throw new Error('Unresolved original faerie global ni at path '+(road+1));}return out;}
export const insideFaerie=(sections,road,node)=>sections.some(s=>s.road===road&&node>=s.start&&node<s.end);
export function faerieMode(controller,road,wave){const mode=controller.path_speed_per_wave?.[road+1]?.[wave]??0,speed=controller.path_speeds[mode];if(!Number.isFinite(speed))throw new Error('Missing faerie speed '+mode);return{speed,color:mode===0?'yellow':'red'};}
export function initFaerie(w){const entity=w.data.level.entities_list.find(e=>e.template==='faerie_trails');if(!entity)return;const controller={...w.template('faerie_trails'),...entity};w.faerieState={controller,sections:compileFaerieSections(w.data.paths,p=>faerieCell(w.data.satyrRules.grid,p)),navs:[],pending:[],fx:[]};}
// Remove owned effects while the original entity is still in the entity set.
export function clearFaerieModifiers(w,e){const p=w.pumpkinState;if(p){for(const m of p.mods)if(m.target===e&&!m.removed){if(w.template(m.key).slow)e.speed/=w.template(m.key).slow.factor;m.removed=true;}p.pending=p.pending.filter(m=>m.target!==e);p.damage=p.damage.filter(m=>m.target!==e);}
 if(w.arcaneSlumbers){for(const m of w.arcaneSlumbers)if(m.target===e&&m.counted){e.arcaneStunCount=Math.max(0,(e.arcaneStunCount||0)-1);m.counted=false;}w.arcaneSlumbers=w.arcaneSlumbers.filter(m=>m.target!==e);}
 if(w.wildWards){for(const m of w.wildWards.mods)if(m.target===e)removeWildWard(w,m);w.wildWards.mods=w.wildWards.mods.filter(m=>m.target!==e);w.wildWards.pending=w.wildWards.pending.filter(m=>m.target!==e);}
 // These fields are the current runtime's direct modifier adapters.
 e.slowUntil=0;e.gnawerBuff=null;
}
function smoke(w,e,color){w.faerieState.fx.push({id:++w.serial,x:e.x,y:e.y,color,small:w.template(e.key).unit.size===1,at:w.time});}
function detach(w,e){const s=w.faerieState,mode=faerieMode(s.controller,e.road,w.wave);clearFaerieModifiers(w,e);smoke(w,e,mode.color);
 if(e.hopliteGroup)e.hopliteGroup.inLimbo=true;e.faerieLimbo=true;e.canClick=false;e.pendingMelee=null;e.pendingRanged=null;e.blocked=false;
 for(const u of[...w.soldiers,...(w.stageHeroes||[]),w.hero].filter(Boolean)){if(u.targetId===e.id)u.targetId=null;if(u.combatTarget===e.id)u.combatTarget=null;if(u.pendingHit?.target===e)u.pendingHit=null;}
 const nav={id:++w.serial,enemy:e,road:e.road,lane:e.lane,node:routeNode(w,e),d:e.d,x:e.x,y:e.y,at:w.time,...mode};s.navs.push(nav);w.enemies.splice(w.enemies.indexOf(e),1);
}
function restore(w,n){const e=n.enemy,r=w.routes[n.road][n.lane];Object.assign(e,{x:n.x,y:n.y,d:n.d,road:n.road,lane:n.lane,goal:r.goal,anim:0,action:'idle',actionAt:w.time,faerieLimbo:false,canClick:true,ignoreDamage:false});w.enemies.push(e);insertSatyr(w,e);insertHoplite(w,e);insertHarasser(w,e);insertBlighter(w,e);if(e.ettin)e.ettin.regenTs=w.time;if(e.hopliteGroup)registerHopliteChild(w,e);smoke(w,e,n.color);}
export function updateFaerie(w,dt){const s=w.faerieState;if(!s)return;
 const pending=s.pending;s.pending=[];for(const n of pending)if(n.queuedAt<w.time)restore(w,n);else s.pending.push(n);
 // Parent observes the transport's current node before the next nav movement.
 for(const n of s.navs){if(n.at>=w.time)continue;if(!insideFaerie(s.sections,n.road,n.node+1)){n.done=true;n.queuedAt=w.time;s.pending.push(n);continue;}Object.assign(n,faerieMode(s.controller,n.road,w.wave));const r=w.routes[n.road][n.lane],next=r.points[n.node+1];if(!next)throw new Error('Faerie nav reached path end');const dx=next.x-n.x,dy=next.y-n.y,dist=Math.hypot(dx,dy),step=n.speed*dt;if(dist<2*step){n.node++;n.d=r.lengths[n.node];}const moved=Math.min(dist,step);if(dist){n.x+=dx/dist*moved;n.y+=dy/dist*moved;}n.d=Math.max(n.d,r.lengths[n.node]-Math.hypot(r.points[n.node].x-n.x,r.points[n.node].y-n.y));}
 s.navs=s.navs.filter(n=>!n.done);for(const e of [...w.enemies])if(e.hp>0&&!e.faerieLimbo&&insideFaerie(s.sections,e.road,routeNode(w,e)+1))detach(w,e);
 s.fx=s.fx.filter(f=>w.time-f.at<w.animationDuration('fx_faerie_smoke',f.color));
}
export const faerieBusy=w=>!!(w.faerieState?.navs.length||w.faerieState?.pending.length);
export const faerieCanHurt=(w,e)=>!e.faerieLimbo;
export function faerieSprites(w){const out=[],raw=w.template('nav_faerie');for(const n of w.faerieState?.navs||[]){const t=w.template(n.enemy.key),small=t.unit.size===1,offset=t.unit.mod_offset||{x:0,y:0},age=w.time-n.at;for(const i of(n.color==='red'?[0,2]:[1,3])){const s=raw.render.sprites[i],prop=raw.tween.props.find(p=>p.sprite_id===i+1),scale=prop?tweenValue(prop.keys.map(([t,v])=>[t,v.x]),age%(2/3)):1;out.push({key:s.name,age,loop:true,pos:{x:n.x+offset.x,y:n.y+offset.y},anchor:s.anchor,alpha:s.alpha/255,scale:scale*(small?.5:1),order:spriteOrder(s,n,i+1,n.id)});}}
 for(const f of w.faerieState?.fx||[]){const s=w.template('fx_faerie_smoke').render.sprites[0];out.push({key:s.prefix+'_'+f.color,age:w.time-f.at,loop:false,pos:f,anchor:s.anchor,alpha:1,scale:f.small?.83:1,order:spriteOrder(s,f,1,f.id)});}return out;}
export function drawFaerie(r,w){if(!w.faerieState)return;for(const p of faerieSprites(w)){const key=r.frame(p.key,p.age,p.loop);if(!key)throw new Error('Missing faerie '+p.key);const q=r.screen(p.pos);r.sprite(r.ctx,key,q.x,q.y,p.scale,p.anchor.x,1-p.anchor.y,false,p.alpha,0,p.order);}}
