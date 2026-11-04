import DATA from './upgrade-data.mjs';
export const TRAINABLE_UPGRADES=['archer_el_master_shooter','barrack_el_elven_fencing','mage_el_crystal_focus','stone_el_druid_hardened_boulders','archer_el_treesinged_bow','barrack_el_expert_tactician','mage_el_bane_spell','stone_el_druid_sharp_splinters','thunder_level_1','reinforcement_level_1'];
export const upgradeData=DATA;
// Original utils.count_stars: campaign stars plus one for each completed challenge.
export function totalStars(save){return Object.entries(save.stars||{}).filter(([id])=>+id<80).reduce((n,[,v])=>n+Math.max(0,Math.min(3,Number(v)||0)),0)+Object.entries(save.challenges||{}).filter(([key,v])=>v&&+key.split('-')[0]<80&&/-(heroic|iron)$/.test(key)).length;}
export function previousUpgrade(key){const u=DATA.list[key];return u?.level>1?Object.keys(DATA.list).find(k=>DATA.list[k].class===u.class&&DATA.list[k].level===u.level-1):null;}
export function normalizeUpgrades(save){const out={};let left=totalStars(save);for(const key of TRAINABLE_UPGRADES){const u=DATA.list[key],prev=previousUpgrade(key);if(save.upgrades?.[key]===true&&(!prev||out[prev])&&left>=u.price){out[key]=true;left-=u.price;}}save.upgrades=out;return save;}
export function availableStars(save){normalizeUpgrades(save);return totalStars(save)-Object.keys(save.upgrades).reduce((n,k)=>n+DATA.list[k].price,0);}
export function canBuyUpgrade(save,key){normalizeUpgrades(save);const u=DATA.list[key],prev=previousUpgrade(key);return TRAINABLE_UPGRADES.includes(key)&&!save.upgrades[key]&&(!prev||save.upgrades[prev]===true)&&availableStars(save)>=u.price;}
export function buyUpgrade(save,key){if(!canBuyUpgrade(save,key))return false;save.upgrades[key]=true;return true;}
export function resetUpgrades(save){save.upgrades={};}
export function patchUpgradeTemplates(templates,selected={},maxLevel=Infinity){
 const active=TRAINABLE_UPGRADES.filter(k=>selected[k]===true&&DATA.list[k].level<=maxLevel&&(!previousUpgrade(k)||selected[previousUpgrade(k)]===true));
 if(!active.length)return templates;const t=structuredClone(templates);
 for(const key of active){const u=DATA.list[key];if(key==='thunder_level_1'){t.power_thunder_control.thunders[0].count=u.hits;t.power_thunder_control.user_power.level=1;continue;}if(key==='reinforcement_level_1'){for(let i=1;i<=3;i++)t['re_current_'+i]=t[u.template_name+'_'+i];t.power_reinforcements_control.cooldown=t.re_current_1.cooldown;continue;}for(let i=1;i<=3;i++){
  const type={archers:'archer',barracks:'barrack',mages:'mage',rocks:'rock_thrower'}[u.class],tower=t[`tower_${type}_${i}`];if(!tower)continue;
  if(key==='archer_el_master_shooter')tower.tower.damage_factor=(tower.tower.damage_factor??1)*u.damage_factor;
  if(key==='barrack_el_elven_fencing')tower.tower.price=Math.ceil(tower.tower.price*u.cost_factor);
  if(key==='mage_el_crystal_focus'||key==='archer_el_treesinged_bow')tower.attacks.range=Math.ceil(tower.attacks.range*u.range_factor);
  if(key==='barrack_el_expert_tactician')tower.barrack.rally_range=Math.ceil(tower.barrack.rally_range*u.rally_range_factor);
  if(key==='stone_el_druid_hardened_boulders'||key==='mage_el_bane_spell'){const bullet=t[tower.attacks.list[0].bullet].bullet;bullet.damage_min=Math.ceil(bullet.damage_min*u.damage_factor);bullet.damage_max=Math.ceil(bullet.damage_max*u.damage_factor);}
  if(key==='stone_el_druid_sharp_splinters'){const bullet=t[tower.attacks.list[0].bullet].bullet;bullet.damage_radius=Math.ceil(bullet.damage_radius*u.damage_area_factor);}
 }}return t;
}
