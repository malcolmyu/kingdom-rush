import DATA from './stage4-burn-data.mjs';
import {spriteOrder} from './render-order.mjs';
import {tweenValue} from './skill-effects.mjs';
import {drawProjectileSprites,projectileSprites} from './projectile-sprites.mjs';
export const stage4BurnTemplates=DATA.templates;
export const burnScenery=e=>/^decal_s04_(land_|tree_burn|charcoal_)/.test(e.template)||/^fx_s04_tree_fire_/.test(e.template);
export function initStage4Burn(w){if(w.id!==4)return;w.templates={...w.templates,...DATA.templates};const campaign=w.mode==='campaign';w.stage4Burn={phase:campaign?'wait5':'done',activePaths:w.data.active.map((active,i)=>active||!campaign&&(i===2||i===3)),zones:{},scene:w.data.level.entities_list.filter(burnScenery).map(source=>({source,...source.pos,zone:source['editor.tag']||w.template(source.template).editor?.tag||Number(source.template.at(-1)),at:null})),fx:[]};const s=w.slots.find(s=>s.holder==='24');if(s){s.scriptLocked=campaign;s.scriptZ=campaign?1199:DATA.rules.zDecals;}}
export function stage4NodeAllowed(w,road,index){const s=w.stage4Burn;if(!s)return true;if(!s.activePaths[road])return false;return !w.data.level.invalid_path_ranges?.some(r=>r.path_id===road+1&&index+1>=r.from&&index+1<=r.to);}
function ignite(w,zone){const s=w.stage4Burn;s.zones[zone]=w.time;s.activePaths[zone===1?2:3]=true;
 for(const group of ['tree_burn','tree_fire','charcoal']){const list=s.scene.filter(v=>v.zone===zone&&v.source.template.includes(group)).sort((a,b)=>zone===1?b.x-a.x:a.x-b.x),spread=group==='tree_burn'?DATA.rules.treeSpread:group==='tree_fire'?DATA.rules.fireSpread:DATA.rules.charcoalSpread;for(const[i,v]of list.entries())v.at=w.time+(i+1)*spread/list.length;}
 const land=s.scene.find(v=>v.source.template==='decal_s04_land_'+zone);if(land)land.at=w.time+DATA.rules.landDelay;
 if(zone===1){const slot=w.slots.find(s=>s.holder==='24');if(slot){slot.scriptLocked=false;slot.scriptZ=DATA.rules.zDecals;}s.phase='join';s.at=w.time;}
 else s.phase='done';
}
export function updateStage4Burn(w){const s=w.stage4Burn;if(!s)return;
 if(s.phase==='wait5'&&w.wave>=5){s.phase='walk';s.at=w.time;s.actor={id:++w.serial,x:770,y:-30,state:'walkingRightLeft',at:w.time};}
 else if(s.phase==='walk'){const p=Math.min(1,(w.time-s.at)/(Math.hypot(90,135)/45));s.actor.x=770-90*p;s.actor.y=-30+135*p;if(p===1){s.phase='shoot';s.at=w.time;s.actor.state='shoot';s.actor.at=w.time;}}
 else if(s.phase==='shoot'&&w.time-s.at>=8/30){s.phase='torch';s.at=w.time;s.torch={sx:s.actor.x,sy:s.actor.y+36,tx:582,ty:105,at:w.time};}
 else if(s.phase==='torch'&&w.time-s.at>=12/30){s.phase='idle';s.at=w.time;s.actor.state='idle';s.actor.at=w.time;s.fx.push({id:++w.serial,key:'fx_torch_gnoll_burner_explosion_stage04',x:582,y:105,at:w.time},{id:++w.serial,key:'fx',name:'fx_torch_gnoll_burner_explosion',x:582,y:105,at:w.time});s.torch=null;}
 else if(s.phase==='idle'&&w.time-s.at>=5/30)ignite(w,1);
 else if(s.phase==='join'&&w.time-s.at>=1){const route=w.routes[1][0],nearest=route.points.reduce((best,p,i)=>Math.hypot(p.x-s.actor.x,p.y-s.actor.y)<Math.hypot(route.points[best].x-s.actor.x,route.points[best].y-s.actor.y)?i:best,0),node=nearest+DATA.rules.nodeAdvance;if(node+1<route.points.length)w.spawn({key:'enemy_gnoll_burner',road:1,lane:0,payload:{origin:{x:s.actor.x,y:s.actor.y},node,targetNode:node+1}});s.actor=null;s.phase='wait10';}
 else if(s.phase==='wait10'&&w.wave>=10)ignite(w,2);
}
function duration(w,name){const a=w.data.animations[name];return (a?.frames?.length||a?.ranges?.reduce((n,[f,t])=>n+t-f+1,0)||((a?.to||1)-(a?.from||1)+1))/30;}
export function stage4SceneryPose(w,v,frame){const t=w.template(v.source.template),raw=t.render.sprites[0],source=v.source,age=v.at===null?null:w.time-v.at;let name=raw.name,alpha=raw.alpha??255;
 if(source.template.includes('tree_burn')){name=frame(raw.prefix+'_'+(age===null?'idle':'burn'),age??0,false);if(age!==null&&age>=duration(w,raw.prefix+'_burn'))return null;}
 else if(source.template.includes('tree_fire')){if(age===null||age<0||age>=duration(w,raw.name))return null;name=frame(raw.name,age,false);}
 else if(age!==null){const keys=t.tween.props[0].keys;if(age>=keys.at(-1)[0])return null;alpha=tweenValue(keys,age);}
 const scale=source['render.sprites[1].scale']||raw.scale||{x:1,y:1};return{key:name,raw,pos:v,alpha:alpha/255,scaleX:scale.x,scaleY:scale.y,anchor:raw.anchor,rotation:source['render.sprites[1].r']??raw.r??0,order:spriteOrder(raw,v,1,w.data.level.entities_list.indexOf(source)+1)};
}
export function drawStage4Burn(r,w){const s=w.stage4Burn;if(!s)return;
 for(const v of s.scene){const p=stage4SceneryPose(w,v,r.frame.bind(r));if(!p)continue;const q=r.screen(p.pos);r.orderQueue.add(p.order,()=>{const c=r.ctx;c.save();c.translate(q.x,q.y);if(p.rotation)c.rotate(-p.rotation);c.scale(p.scaleX,p.scaleY);r.sprite(c,p.key,0,0,1,p.anchor.x,1-p.anchor.y,false,p.alpha);c.restore();});}
 if(s.actor){const u=s.actor,raw=DATA.templates.decal_gnoll_burner.render.sprites[0],q=r.screen(u),key=r.frame(raw.prefix+'_'+u.state,w.time-u.at,u.state!=='shoot');r.sprite(r.ctx,key,q.x,q.y,1,raw.anchor.x,1-raw.anchor.y,true,1,0,spriteOrder(raw,u,1,r.renderId(u)));}
 if(s.torch){const b=s.torch,t=DATA.templates.torch_gnoll_burner.bullet,elapsed=w.time-b.at,u=Math.min(1,elapsed/t.flight_time),shot={...b,type:'torch',x:b.sx+(b.tx-b.sx)*u,y:b.sy+(b.ty-b.sy)*u-.5*t.g*t.flight_time*t.flight_time*u*(1-u),elapsed};drawProjectileSprites(r,projectileSprites(DATA.templates.torch_gnoll_burner,shot,r.frame.bind(r),{entityId:s.actor.id}));}
 for(const f of s.fx){const t=DATA.templates[f.key],name=f.name||t.render.sprites[0].name,age=w.time-f.at;if(age<duration(w,name))r.entity(f.key,f,{time:age,renderId:r.renderId(f),overrides:f.name?{'render.sprites[1].name':f.name}:{}});}
}
