import{stage4BurnTemplates}from'./stage4-burn.mjs';
import{gryphonTemplates}from'./gryphon-events.mjs';
// Isolated restoration workspace; importing assets never unlocks campaign saves.
export class ExpansionRepository {
 constructor(base){this.base=base;this.levels=new Map();this.groups=new Map();}
 async json(path){const r=await fetch('assets/'+path);if(!r.ok)throw new Error('后续关卡数据加载失败');return r.json();}
 async init(){this.source=await this.json('expansion/index.json');this.arcane=await this.json('arcane/catalog.json');this.catalog=this.base.catalog;return this;}
 image(src){return this.base.image(src);}
 async level(id,mode='campaign'){
  if(!this.source?.levels.some(s=>s.id===id)||!['campaign','heroic','iron'].includes(mode))throw new Error('不在后续三关还原范围内');
  if(!this.groups.has(id))this.groups.set(id,this.json(`expansion/stage${String(id).padStart(2,'0')}.json`));
  const group=await this.groups.get(id),b=this.base.catalog,a=this.arcane;
  const catalog={...b,campaignScenerySheets:group.sheets,campaignEnemySheets:[...group.sheets,...a.sheets],templates:{...b.templates,...group.templates,...a.templates,...stage4BurnTemplates,...gryphonTemplates},frames:{...b.frames,...group.frames,...a.frames},animations:b.animations};
  this.catalog=catalog;
  const key=id+'-'+mode;if(!this.levels.has(key)){const d=await this.json(`expansion/${String(id).padStart(2,'0')}-${mode}.json`);this.levels.set(key,{...d,templates:catalog.templates,animations:catalog.animations});}return this.levels.get(key);
 }
}
