import{flyingEnemySprites}from'./flying-enemy.mjs';
export function carrierSprites(t,u,{state,facing='Down',flip=false,elapsed=0,frame}){
 if(u.carrier?.hiddenAll)return[];
 const frames={};for(const[i,s]of t.render.sprites.entries())if(s.animated){const action=state==='walk'?'walking'+facing:state;frames[i]=frame(s.prefix+'_'+action,elapsed,state==='walk'||state==='idle');}
 return flyingEnemySprites(t,u,{spriteFrames:frames,hiddenSprites:u.carrier?.hiddenPayload?[2]:[],flip,elapsed,deathDuration:Infinity});
}
