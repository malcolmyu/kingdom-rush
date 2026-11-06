import{enemyDirection}from'./enemy-direction.mjs';import{spriteOrder}from'./render-order.mjs';
export function reduceArcaneArmor(w,e){if(e.hp<=0)return;const m=w.template('mod_arrow_arcane');e.rawMagicArmor=(e.rawMagicArmor??e.magicArmor)-w.number(m.damage_min,m.damage_max);e.magicArmor=Math.max(0,Math.min(1,e.rawMagicArmor));}
export function queueArcaneSlumber(w,b){(w.arcaneSlumbers??=[]).push({id:++w.serial,target:b.target,level:b.level,key:w.template(b.bullet).bullet.mod[0],queuedAt:w.time});}
function release(f){if(f.counted){f.target.arcaneStunCount=Math.max(0,(f.target.arcaneStunCount||0)-1);f.counted=false;}}
export function updateArcaneSlumbers(w){
 if(!w.arcaneSlumbers)return;const active=[];
 // Lifecycle observes existing modifiers before attempting queued inserts.
 for(const f of w.arcaneSlumbers)if(f.at!==undefined){const e=f.target,m=w.template(f.key).modifier;if(!w.enemies.includes(e)||e.hp<=0){release(f);continue;}active.push(f);}
 for(const f of w.arcaneSlumbers)if(f.at===undefined){if(f.queuedAt===w.time){active.push(f);continue;}const e=f.target,t=w.template(f.key),m=t.modifier,v=w.template(e.key).vis||{};
  if(!w.enemies.includes(e)||e.hp<=0||((e.visBans??v.bans??0)&m.vis_flags)||((e.visFlags??v.flags??0)&m.vis_bans))continue;
  const old=active.find(x=>x.at!==undefined&&x.target===e&&x.key===f.key);
  if(old){if(f.level===old.level&&m.resets_same){old.ts=w.time;continue;}if(f.level<old.level||!m.replaces_lower)continue;release(old);active.splice(active.indexOf(old),1);}
  f.at=f.ts=w.time;f.flip=e.carrier?.facing?.flip??(e.anim>0?!!e.actionFlip:enemyDirection(e.dx,e.dy).flip);f.counted=!w.template(e.key).unit.ignore_stun&&!e.ignoreStun;
  if(f.counted)e.arcaneStunCount=(e.arcaneStunCount||0)+1;
  reduceArcaneArmor(w,e);active.push(f);
 }
 w.arcaneSlumbers=active.filter(f=>{if(f.at===undefined||w.time-f.ts<w.template(f.key).modifier.duration)return true;release(f);return false;});
}
export function slumberSprites(w,f,frame){
 const e=f.target;if(f.at===undefined||e.hp<=0||e.harasser?.jumpHidden)return[];
 const t=w.template(f.key),offset=w.template(e.key).unit.mod_offset||{x:0,y:0};
 return t.render.sprites.map((s,i)=>({key:frame(s.prefix+'_loop',w.time-f.at,true),pos:{x:e.x+offset.x,y:e.y+offset.y},anchor:s.anchor,flip:i===1?false:f.flip,alpha:s.alpha/255,scale:s.scale?.x??1,rotation:s.r||0,order:spriteOrder(s,e,i+1,f.id)}));
}
export function drawArcaneSlumbers(r,w){for(const f of w.arcaneSlumbers||[])for(const p of slumberSprites(w,f,r.frame.bind(r))){const q=r.screen(p.pos);r.sprite(r.ctx,p.key,q.x,q.y,p.scale,p.anchor.x,1-p.anchor.y,p.flip,p.alpha,p.rotation,p.order);}}
