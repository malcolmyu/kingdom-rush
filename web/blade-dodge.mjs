import{bladeDodgeChance}from'./blade-parry.mjs';
import RULES from './ewok-shield-data.mjs';
// Original unit_dodges still samples chance0; the health.on_damage callback
// returns early at level0. Keep these distinct source call boundaries.
export function tryBladeDodge(w,u,{ranged=false,damageType}={}){
 if(!u?.blade)return false;const d=w.template(u.key).dodge;
 if(u.stunned||u.frozen||u.spiderWebCount>0||ranged&&!d.ranged||d.cooldown!==undefined&&w.time-(u.blade.dodgeAt??d.ts)<=d.cooldown||damageType!==undefined&&(damageType&RULES.noDodge))return false;
 const result=w.random()<=bladeDodgeChance(w,u);if(result)u.blade.dodgeActive=true;return result;
}
