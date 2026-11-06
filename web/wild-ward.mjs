import{wildTargets}from'./wild-eldritch.mjs';
import{spriteOrder}from'./render-order.mjs';
import{tweenValue}from'./skill-effects.mjs';
// Original F_SPELLCASTER, including its unsigned Lua mask / signed JS result.
const caster=2147483648;
export function startWildWard(w,s,live,facing){const m=s.wild,p=m.powers?.ward,t=w.template(s.key),a=t.attacks.list[2];if(!p?.level||w.time-(m.wardAt??a.ts)<=a.cooldown)return false;const targets=wildTargets(w,s,a,live).filter(e=>((e.visFlags??w.template(e.key).vis.flags)&caster)&&(e.canDoMagic??w.template(e.key).enemy.can_do_magic));if(!targets.length)return false;
 m.wardAt=m.wardFxAt=w.time;const f=facing(targets[0]);Object.assign(m,f);m.phase={kind:'ward',at:w.time,targets,target:targets[0],...f,fired:false};return true;}
export function releaseWildWard(w,s,p){const a=w.template(s.key).attacks.list[2],power=s.wild.powers.ward,state=w.wildWards??={pending:[],mods:[]};for(const target of p.targets.slice(0,power.target_count[power.level-1]))state.pending.push({id:++w.serial,key:a.spell,target,level:power.level,queuedAt:w.time});s.wild.wardAt=w.time;}
// The source silence controller writes booleans, not stun-style reference
// counts: insert false/false, remove true/true. Never alter external stun.
export function removeWildWard(w,m){if(m.removed)return;m.removed=true;if(w.enemies.includes(m.target)){m.target.canDoMagic=true;m.target.canAcceptMagic=true;}}
export function wardBlocksMod(w,e,key){return !!w.wildWards?.mods.some(m=>!m.removed&&m.target===e&&w.template(m.key).modifier.bans.includes(key));}
export function updateWildWards(w){const state=w.wildWards;if(!state)return;const pending=state.pending;state.pending=[];
 for(const p of pending){if(p.queuedAt>=w.time){state.pending.push(p);continue;}const e=p.target,t=w.template(e.key);if(!w.enemies.includes(e)||e.hp<=0||!t.enemy)continue;const old=state.mods.find(m=>!m.removed&&m.target===e);
  if(old){if(p.level===old.level){old.ts=w.time;continue;}if(p.level<old.level)continue;removeWildWard(w,old);}
  e.canDoMagic=e.canAcceptMagic=false;state.mods.push({...p,at:w.time,ts:w.time});
 }
 for(const m of state.mods)if(!m.removed&&(!w.enemies.includes(m.target)||m.target.hp<=0||w.time-m.ts>w.template(m.key).modifier.duration))removeWildWard(w,m);
 state.mods=state.mods.filter(m=>!m.removed);
}
export function wardTowerPose(w,s,overrides,states){const at=s.wild.wardFxAt;if(at===undefined)return;const t=w.template(s.key),age=w.time-at;
 for(const i of[5,6]){const keys=t.tween.props.find(p=>p.sprite_id===i&&p.name==='alpha').keys;overrides[`render.sprites[${i}].hidden`]=false;overrides[`render.sprites[${i}].alpha`]=tweenValue(keys,age);}
 const raw=t.render.sprites[6],a=w.data.animations[raw.name],duration=(a.to-a.from+1)/30;overrides['render.sprites[7].hidden']=age>=duration;states[7]={state:raw.name,time:age,loop:false};
}
export function wildWardSprites(w,frame){return(w.wildWards?.mods||[]).flatMap(m=>{const t=w.template(m.key),age=w.time-m.at,e=m.target;return t.render.sprites.map((s,i)=>{const prop=t.tween.props.find(p=>p.sprite_id===i+1&&p.name==='alpha'),offset=i===0?(t.custom_offsets[e.key]||t.custom_offsets.default):(s.offset||{x:0,y:0});return{key:s.animated?frame(s.name,age,s.loop):s.name,pos:{x:e.x+offset.x,y:e.y+offset.y},anchor:s.anchor,alpha:tweenValue(prop.keys,age)/255,scaleX:s.scale?.x??1,scaleY:s.scale?.y??1,order:spriteOrder(s,e,i+1,m.id)};});});}
export function drawWildWards(r,w){for(const p of wildWardSprites(w,r.frame.bind(r))){if(p.alpha<=0)continue;const q=r.screen(p.pos),draw=()=>{const c=r.ctx;c.save();c.translate(q.x,q.y);c.scale(p.scaleX,p.scaleY);r.sprite(c,p.key,0,0,1,p.anchor.x,1-p.anchor.y,false,p.alpha);c.restore();};r.orderQueue?r.orderQueue.add(p.order,draw):draw();}}
