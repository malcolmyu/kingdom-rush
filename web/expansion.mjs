import FIXED from'./fixed-alleria-data.mjs';
import{readMetadata}from'./repository.mjs';
import{stage4BurnTemplates}from'./stage4-burn.mjs';
import{gryphonTemplates}from'./gryphon-events.mjs';
// Isolated restoration workspace; importing assets never unlocks campaign saves.
export class ExpansionRepository {
 constructor(base){this.base=base;this.levels=new Map();this.groups=new Map();}
 async json(path){return readMetadata('assets/'+path,'后续关卡数据加载失败');}
 async init(){this.source=await this.json('expansion/index.json');[this.arcane,this.towerAssets]=await Promise.all([this.json('arcane/catalog.json'),this.json('tower-groups/catalog.json')]);this.catalog=this.base.catalog;return this;}
 image(src){return this.base.image(src);}
 async level(id,mode='campaign'){
  if(!this.source?.levels.some(s=>s.id===id)||!['campaign','heroic','iron'].includes(mode))throw new Error('不在后续三关还原范围内');
  if(!this.groups.has(id))this.groups.set(id,this.json(`expansion/stage${String(id).padStart(2,'0')}.json`));
  const group=await this.groups.get(id),b=this.base.catalog,a=this.arcane;const extra=id===5?await(this.catapultAssets??=this.json('stage5-catapult/catalog.json')):{templates:{},frames:{},sheets:[]};
  const boss=id===6?await(this.bossAssets??=this.json('gnoll-boss/catalog.json')):{templates:{},frames:{},sheets:[]};
  const ally=id>=5?await(this.alleriaAssets??=this.json('stage5-alleria/catalog.json')):{templates:{},frames:{},sheets:[]};
  const blade=id>=5?await(this.bladeAssets??=this.json('blade/catalog.json')):{templates:{},frames:{},sheets:[]};
  const towers=id>=5?await(this.entryTowerAssets??=this.json('tower-groups/entry/catalog.json')):this.towerAssets;
  const catalog={...b,campaignTowerSheets:towers.initial,towerAssetGroups:{...towers.groups,tower_arcane:a.sheets,tower_blade:blade.sheets},campaignScenerySheets:group.sheets,campaignEnemySheets:[...group.sheets,...extra.sheets,...ally.sheets,...boss.sheets],templates:{...b.templates,...group.templates,...a.templates,...stage4BurnTemplates,...gryphonTemplates,...extra.templates,...ally.templates,...blade.templates,...boss.templates,...(id===6?FIXED.templates:{})},frames:{...b.frames,...towers.frames,...group.frames,...a.frames,...extra.frames,...ally.frames,...blade.frames,...boss.frames},animations:b.animations};
  this.catalog=catalog;
  const spawner=id===6?await(this.stage6Spawner??=this.json('expansion/stage6-spawner.json')):undefined;
  const key=id+'-'+mode;if(!this.levels.has(key)){const d=await this.json(`expansion/${String(id).padStart(2,'0')}-${mode}.json`);this.levels.set(key,{...d,templates:catalog.templates,animations:catalog.animations,...(spawner?{stage6Spawner:spawner}:{})});}return this.levels.get(key);
 }
}
