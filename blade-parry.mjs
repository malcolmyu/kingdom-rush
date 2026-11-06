import RULES from'./blade-parry-data.mjs';
import{inEllipse}from'./spells.mjs';
export function bladePowerOffer(w,s,name){if(!s?.blade||!['perfect_parry','swirling'].includes(name))return null;const p=s.blade.powers?.[name]||w.template(s.key).powers[name];return{...p,price:p.level===0?p.price_base:p.price_inc};}
export function buyBladePower(w,s,name){const p=bladePowerOffer(w,s,name);if(!w.active()||!p||p.level>=p.max_level||w.gold<p.price)return false;s.blade.powers??={};s.blade.powers[name]={...p,level:p.level+1};w.gold-=p.price;s.spent+=p.price;w.emit('tower_power',{name,level:p.level+1});return true;}
// Tower barrack propagates levels; each soldier applies changed levels in its
// outer loop. A newly inserted replacement inherits the purchased levels.
export function swirlingMelee(template,level){const m=structuredClone(template.melee);for(let i=0;i<level;i++){let changed=false;for(const a of m.attacks)if(a.power_name==='swirling'){a.level++;if(a.damage_inc!==undefined){a.damage_min+=a.damage_inc;a.damage_max+=a.damage_inc;}if(a.cooldown_inc!==undefined){a.cooldown+=a.cooldown_inc;changed=true;}}if(changed&&m.forced_cooldown!==undefined)m.forced_cooldown=Math.min(m.forced_cooldown,...m.attacks.map(a=>a.cooldown??Infinity));}return m;}
export const bladeMelee=(w,u)=>u.blade.melee||w.template(u.key).melee;
export function syncBladePowers(w,u){const s=u.blade,d=w.template(u.key).dodge,powers=w.slots[u.home]?.blade?.powers,level=powers?.perfect_parry?.level||0;while((s.parryLevel||0)<level){s.parryLevel=(s.parryLevel||0)+1;s.dodgeChance=(s.dodgeChance??d.chance)+d.chance_inc;}const swirling=powers?.swirling?.level||0;if((s.swirlingLevel||0)<swirling){s.swirlingLevel=swirling;s.melee=swirlingMelee(w.template(u.key),swirling);}}
export const bladeDodgeChance=(w,u)=>u.blade.dodgeChance??w.template(u.key).dodge.chance;
// health.on_damage is distinct from ordinary unit_dodges. TRUE damage and
// NO_DODGE never sample the callback; ignore_damage is checked before it.
export function bladeRejectDamage(w,u,type){if(!u?.blade)return false;const s=u.blade;if(s.parry)return true;
 const chance=bladeDodgeChance(w,u);if(chance<=0||u.hp<=0||u.stunned||u.frozen||s.dance||!(s.parryLevel>0)||(type&RULES.allTypes&~(RULES.physical|RULES.magical))||(type&RULES.noDodge))return false;
 if(w.random()>chance)return false;s.dodgeActive=true;return true;
}
export function updateBladeParry(w,u){const s=u.blade,a=w.template(u.key).dodge.counter_attack;
 if(!s.parry&&s.dodgeActive&&bladeDodgeChance(w,u)>0){s.dodgeActive=false;if(s.parryLevel>0){s.parry={at:w.time,damageAt:0};u.visBans=(u.visBans??w.template(u.key).vis.bans)|RULES.net;u.walking=false;u.action=a.animation;u.actionAt=w.time;w.emit('blade_parry');}}
 const p=s.parry;if(!p)return false;
 if(w.time-p.at>=a.duration){u.visBans&=~RULES.net;s.parry=null;u.action='idle';u.idleAt=w.time;w.emit('soldier_dodge');return false;}
 if(w.time-p.at>=a.hit_time&&w.time-p.damageAt>a.damage_every){p.damageAt=w.time;for(const e of w.enemies){const vis=w.template(e.key).vis||{};if(e.hp>0&&!e.leaked&&!((e.visBans??vis.bans??0)&a.damage_flags)&&!((e.visFlags??vis.flags??0)&a.damage_bans)&&inEllipse(u,e,a.damage_radius))w.hurt(e,a.damage_max,a.damage_type);}}
 return true;
}
