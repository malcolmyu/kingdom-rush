import DATA from './gryphon-event-data.mjs';
import {tweenValue} from './skill-effects.mjs';
import {spriteOrder} from './render-order.mjs';
export const gryphonTemplates=DATA.templates;
export function bezier(nodes,t){const q=nodes.map(p=>({...p}));for(let n=q.length-1;n>0;n--)for(let i=0;i<n;i++){q[i].x+=(q[i+1].x-q[i].x)*t;q[i].y+=(q[i+1].y-q[i].y)*t;}return q[0];}
const animationDuration=(w,key)=>{const a=w.data.animations[key];return (a?.frames?.length||a?.ranges?.reduce((n,[f,t])=>n+t-f+1,0)||((a?.to||1)-(a?.from||1)+1))/30;};
const curve=id=>DATA.curves[id-5].nodes;
const animate=(w,g,state)=>{g.animation=state;g.animationAt=w.time;};
export function initGryphons(w){if(w.id!==6)return;w.templates={...w.templates,...DATA.templates};w.gryphons=[];w.gryphonImpacts=[];w.gryphonController={index:0,at:0,waves:DATA.waves[w.mode]};}
function fly(w,g){g.phase='fly';g.at=w.time;g.t=0;g.attackPhase=1;g.range=0;g.shadow=true;g.approaching=false;animate(w,g,'fly');}
function spawn(w,event){const c=DATA.templates.decal_gryphon.custom[event.side],p=curve(c.default_curve_id)[0],g={id:++w.serial,side:event.side,sign:event.side==='right'?-1:1,first:true,cooldown:event.cooldown,attackAt:0,flashAt:-Infinity,flash:false,idle:{...p},signId:++w.serial,signAt:-1,signReverse:true,x:0,y:0};fly(w,g);w.gryphons.push(g);}
export function clickGryphon(w,p){if(!w.active())return false;const r=DATA.templates.decal_gryphon.ui.click_rect;const g=(w.gryphons||[]).find(g=>g.phase==='idle'&&p.x>=g.x+r.pos.x&&p.x<=g.x+r.pos.x+r.size.x&&p.y>=g.y+r.pos.y&&p.y<=g.y+r.pos.y+r.size.y);if(!g)return false;g.clicked=true;return true;}
function fire(w,g){const a=DATA.templates.decal_gryphon.attacks.list[0],o=a.bullet_start_offset;g.attackAt=w.time;g.flash=true;g.flashAt=w.time;for(let i=0;i<a.loops;i++){const sx=g.x+o.x*g.sign,sy=g.y+o.y;w.shots.push({id:++w.serial,type:'gryphon-bolt',bullet:a.bullet,sx,sy,x:sx,y:sy,tx:g.x+(o.x+100)*g.sign-20+w.random()*40,ty:g.y+o.y-140-30+w.random()*60,initialImpulse:w.random()*1000*30,elapsed:0,insertedAt:w.time,rotation:0});}}
export function updateGryphonBolt(w,b,dt){if(b.insertedAt===w.time)return;const t=DATA.templates[b.bullet].bullet,dx=b.tx-b.x,dy=b.ty-b.y,d=Math.hypot(dx,dy);b.elapsed+=dt;
 if(d>=2*t.max_speed*dt){b.x+=dx/d*t.max_speed*dt;b.y+=dy/d*t.max_speed*dt;b.rotation=Math.atan2(b.ty-b.y,b.tx-b.x);return;}
 // Original area query is at the last bullet position, FX/decal at b.to.
 for(const e of w.enemies){const v=w.template(e.key).vis;if(e.hp>0&&!((e.visBans??v?.bans??0)&t.vis_flags)&&!((e.visFlags??v?.flags??0)&t.vis_bans)&&((e.x-b.x)/t.damage_radius)**2+((e.y-b.y)/(t.damage_radius*.7))**2<=1)w.hurt(e,Math.ceil(t.damage_min+w.random()*(t.damage_max-t.damage_min)),t.damage_type);}
 for(const key of [t.hit_fx,t.hit_decal])if(key)w.gryphonImpacts.push({id:++w.serial,key,x:b.tx,y:b.ty,at:w.time});b.done=true;
}
export function updateGryphons(w){if(!w.gryphonController)return;const controller=w.gryphonController;
 while(controller.index<controller.waves.length){const e=controller.waves[controller.index];if(w.wave<e.wave){controller.at=w.time;break;}if(w.time-controller.at<e.delay){if(w.wave!==e.wave){controller.index++;continue;}break;}spawn(w,e);controller.index++;}
 const template=DATA.templates.decal_gryphon;
 for(const g of w.gryphons){const c=template.custom[g.side],duration=state=>w.animationDuration('gryphon_l1',state);
  if(g.phase==='fly'){
   if(g.t>1){g.phase='gap';g.until=w.time+(g.first?0:g.cooldown);continue;}
   Object.assign(g,bezier(curve(g.first?c.initial_curve_id:c.default_curve_id),g.t));g.t=(w.time-g.at)/(g.first?c.initial_duration:c.default_duration);
   const ar=c.attack_ranges[g.range];
   if(g.attackPhase===1&&g.sign*g.x>g.sign*ar[0]){g.attackPhase=2;animate(w,g,'attack_start');}
   else if(g.attackPhase===2&&w.time-g.animationAt>=duration(g.animation)){g.attackPhase=3;animate(w,g,'attack_loop');}
   else if(g.attackPhase===3){if(g.sign*g.x>g.sign*ar[1]){g.flash=false;g.range++;g.attackPhase=c.attack_ranges[g.range]?1:4;animate(w,g,'attack_end');}else if(g.sign*g.x>g.sign*ar[0]&&w.time-g.attackAt>=template.attacks.list[0].cooldown)fire(w,g);}
   else if(g.attackPhase===4&&w.time-g.animationAt>=duration(g.animation)){g.attackPhase=5;animate(w,g,'fly');}
  }else if(g.phase==='gap'){if(w.time>=g.until){g.first=false;g.phase='approach';g.approaching=true;g.at=w.time;g.t=0;}}
  else if(g.phase==='approach'){if(g.t>1){g.approaching=false;g.shadow=false;Object.assign(g,g.idle);g.phase='land';animate(w,g,'land');}else{Object.assign(g,bezier(curve(c.land_curve_id),g.t));g.t=(w.time-g.at)/c.approach_duration;}}
  else if(g.phase==='land'){if(w.time-g.animationAt>=duration('land')){g.phase='idle';g.clicked=false;animate(w,g,'idle');}}
  else if(g.phase==='idle'){if(g.clicked){g.signReverse=true;g.signAt=-1;g.phase='takeoff';animate(w,g,'takeoff');}else if(w.time-g.signAt>(g.signReverse?5:1)){g.signReverse=!g.signReverse;g.signAt=w.time;}}
  else if(g.phase==='takeoff'&&w.time-g.animationAt>=duration('takeoff'))fly(w,g);
 }
 w.gryphonImpacts=w.gryphonImpacts.filter(f=>{const t=DATA.templates[f.key],s=t.render.sprites[0];return w.time-f.at<(t.timed?animationDuration(w,s.name):t.tween.props[0].keys.at(-1)[0]);});
}
export function gryphonSprites(w,g,frame){const t=DATA.templates.decal_gryphon;return t.render.sprites.flatMap((s,i)=>{
 if(i===2&&!g.shadow||i===3&&!g.flash)return[];
 const offset=i<2?(g.approaching?{x:-152*g.sign,y:15}:{x:0,y:0}):i===2?(g.approaching?{x:-28-30*g.sign,y:60}:{x:94*g.sign,y:0}):{x:104*g.sign,y:-23};
 const key=i<2?frame(s.prefix+'_'+g.animation,w.time-g.animationAt,['fly','idle','attack_loop'].includes(g.animation)):i===2?s.name:frame(s.name,w.time-g.flashAt,false);
 return[{key,pos:{x:g.x+offset.x,y:g.y+offset.y},scale:1,anchor:s.anchor,flip:i<2?g.sign<0:!!s.flip_x,alpha:s.alpha/255,rotation:s.r,order:spriteOrder(s,g,i+1,g.id)}];
 });}
export function drawGryphons(r,w){const draw=p=>{const q=r.screen(p.pos);r.sprite(r.ctx,p.key,q.x,q.y,p.scale,p.anchor.x,1-p.anchor.y,p.flip,p.alpha,p.rotation,p.order);};for(const g of w.gryphons||[]){for(const p of gryphonSprites(w,g,r.frame.bind(r)))draw(p);
  const t=DATA.templates.decal_gryphon_sign,s=t.render.sprites[0],age=w.time-g.signAt,alphaProp=t.tween.props[0],scaleProp=t.tween.props[1],time=p=>g.signReverse?p.keys.at(-1)[0]-age:age;
  const scale=tweenValue(scaleProp.keys.map(([t,v])=>[t,v.x]),time(scaleProp)),pos={x:g.idle.x+g.sign*64,y:g.idle.y+5};draw({key:s.name,pos,scale,anchor:s.anchor,flip:g.sign<0,alpha:tweenValue(alphaProp.keys,time(alphaProp))/255,rotation:0,order:spriteOrder(s,pos,1,g.signId)});
 }for(const f of w.gryphonImpacts||[]){const t=DATA.templates[f.key],s=t.render.sprites[0],age=w.time-f.at;r.entity(f.key,f,{time:age,renderId:r.renderId(f),alpha:t.tween?tweenValue(t.tween.props[0].keys,age)/255:1});}}
