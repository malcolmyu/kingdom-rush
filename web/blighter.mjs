import {inEllipse} from './spells.mjs';
import {tweenValue} from './skill-effects.mjs';
// Original blighter timed attack. Plant references are local objects, never enemy IDs.
export function insertBlighter(w,e){if(e.key==='enemy_gnoll_blighter')e.blighter={ts:0,phase:null};}
export function blockPlant(w,p){
 if(!w.plants.includes(p))return false;
 // sys.mod_lifecycle rejects an equal-level duplicate after resetting modifier.ts.
 // The running U.y_wait and alpha tween are not restarted by that timestamp.
 if(p.blightMods?.length)return false;
 const t=w.template('mod_gnoll_blighter');
 (p.blightMods??=[]).push({at:w.time,until:w.time+t.modifier.duration});
 p.blockCount=(p.blockCount||0)+1;p.blocked=true;return true;
}
export function updateBlightedPlants(w){for(const p of w.plants){if(!p.blightMods)continue;
 p.blightMods=p.blightMods.filter(m=>w.time<m.until);
 p.blockCount=p.blightMods.length;
 if(!p.blockCount&&p.blocked){p.blocked=false;p.cd=w.template(p.key).custom_attack.cooldown;delete p.blightMods;}
}}
export function updateBlighter(w,e){const s=e.blighter;if(!s)return false;
 const a=w.template(e.key).timed_attacks.list[0];
 if(e.hp<=0){s.phase=null;return false;}
 if(s.phase){
  if(s.phase==='cast'){
   if(e.stunned||e.frozen){s.phase=null;e.anim=0;return true;}
   if(w.time-s.at>=a.cast_time){blockPlant(w,s.target);s.phase='finish';}
  }
  if(s.phase==='finish'&&w.time-s.at>=w.animationDuration(w.template(e.key).render.sprites[0].prefix,a.animation)){s.phase=null;return true;}
  return true;
 }
 if(e.stunned||e.frozen)return true;
 // Existing melee/ranged episodes finish before source outer-loop timed attack.
 if(e.blocked||e.pendingMelee||e.pendingRanged||e.anim>0||e.canDoMagic===false||w.time-s.ts<a.cooldown)return false;
 const target=w.plants.find(p=>!p.blocked&&inEllipse(e,p,a.range));if(!target)return false;
 s.ts=s.at=w.time;s.target=target;s.phase='cast';e.pendingMelee=null;e.pendingRanged=null;
 w.enemyAction(e,target,a.animation);return true;
}
export function blightAlpha(template,elapsed){return tweenValue(template.tween.props.find(p=>p.name==='alpha').keys,elapsed)/255;}
