import DATA from'./skill-effect-data.mjs';import{spriteOrder}from'./render-order.mjs';import worldRules from'./world-rules.mjs';
export function tweenValue(keys,time){if(time<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++){const[a,b]=[keys[i-1],keys[i]];if(time<=b[0])return a[1]+(b[1]-a[1])*(time-a[0])/(b[0]-a[0]);}return keys.at(-1)[1];}
export function skillEffectSprites(effect,time,frame,duration,{rayFlip=false,arrowRotation=0,entityId=0}={}){
 if(time<0)return[];const names=effect.type==='thunder-strike'?[`fx_power_thunder_${effect.variant||1}`,'fx_power_thunder_explosion','fx_power_thunder_explosion_decal']:effect.type==='arrow-impact'?['decal_hero_elves_archer_ultimate']:[];
 return names.flatMap((name,component)=>{const t=DATA.templates[name];if(!t)return[];return t.render.sprites.flatMap((s,i)=>{
  if(s.hidden||s.hidden_count>0)return[];const animation=s.prefix?s.prefix+'_'+s.name:s.name;
  if(t.timed&&time>=duration(animation)*(t.timed.runs||1))return[];
  const prop=t.tween?.props.find(p=>p.name==='alpha'&&p.sprite_id===i+1),alpha=prop?tweenValue(prop.keys,time)/255:(s.alpha??255)/255;if(alpha<=0)return[];
  const offset=s.offset||{x:0,y:0},scale=s.scale||{x:1,y:1},isRay=name.startsWith('fx_power_thunder_')&&t.image_h;
  return[{key:s.animated?frame(animation,time,s.loop!==false):s.name,pos:{x:effect.x+offset.x,y:effect.y+offset.y},anchor:s.anchor,scaleX:scale.x,scaleY:isRay?Math.max(1,(worldRules.height-effect.y)/t.image_h):scale.y,flip:isRay?rayFlip:!!s.flip_x,alpha,rotation:name==='decal_hero_elves_archer_ultimate'&&i===0?arrowRotation:s.r||0,order:spriteOrder(s,effect,i+1,entityId+component)}];
 });});
}
export class SkillEffects{
 constructor(random=Math.random){this.random=random;this.reset();}
 reset(){this.choices=new WeakMap();}
 poses(effect,renderer,entityId){let choice=this.choices.get(effect);if(!choice){choice=effect.type==='thunder-strike'?{rayFlip:this.random()<.5}:{arrowRotation:(-10+15*this.random())*Math.PI/180};this.choices.set(effect,choice);}return skillEffectSprites(effect,effect.total-effect.life,renderer.frame.bind(renderer),name=>{const a=renderer.catalog.animations[name];return(a?.frames?.length||a?.ranges?.reduce((n,[f,t])=>n+t-f+1,0)||((a?.to||1)-(a?.from||1)+1))/30;},{...choice,entityId});}
 draw(renderer,effect,entityId){for(const pose of this.poses(effect,renderer,entityId)){const p=renderer.screen(pose.pos),draw=()=>{const c=renderer.ctx;c.save();c.translate(p.x,p.y);c.scale(pose.scaleX,pose.scaleY);renderer.sprite(c,pose.key,0,0,1,pose.anchor.x,1-pose.anchor.y,pose.flip,pose.alpha,pose.rotation);c.restore();};if(renderer.orderQueue)renderer.orderQueue.add(pose.order,draw);else draw();}}
}
