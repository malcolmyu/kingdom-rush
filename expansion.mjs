// Isolated restoration workspace; importing assets never unlocks campaign saves.
export class ExpansionRepository {
 constructor(base){this.base=base;this.levels=new Map();}
 async init(){const r=await fetch('assets/expansion/catalog.json');if(!r.ok)throw new Error('后续关卡数据加载失败');this.source=await r.json();this.catalog={...this.base.catalog,campaignEnemySheets:[...this.base.catalog.campaignEnemySheets||[],'../expansion/sprites.webp'],templates:{...this.base.catalog.templates,...this.source.templates},frames:{...this.base.catalog.frames,...this.source.frames},animations:{...this.base.catalog.animations,...this.source.animations}};return this;}
 image(src){return this.base.image(src);}
 async level(id,mode='campaign'){
  if(!this.source?.levels.some(s=>s.id===id)||!['campaign','heroic','iron'].includes(mode))throw new Error('不在后续三关还原范围内');
  const key=id+'-'+mode;if(!this.levels.has(key)){const r=await fetch(`assets/expansion/${String(id).padStart(2,'0')}-${mode}.json`);if(!r.ok)throw new Error('后续关卡数据加载失败');const d=await r.json();this.levels.set(key,{...d,templates:this.catalog.templates,animations:this.catalog.animations});}return this.levels.get(key);
 }
}
