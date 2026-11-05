import{test}from'node:test';import assert from'node:assert/strict';import{readFileSync}from'node:fs';import{World}from'../web/domain.mjs';import{ExpansionRepository}from'../web/expansion.mjs';
const read=p=>JSON.parse(readFileSync('web/assets/'+p));const base=read('catalog.json'),pack=read('expansion/catalog.json');
for(const id of[4,5,6])test(`stage ${id} original three-mode routes, quantities, templates and initial state`,()=>{
 for(const mode of['campaign','heroic','iron']){
  const d=read(`expansion/${String(id).padStart(2,'0')}-${mode}.json`);d.templates={...base.templates,...pack.templates};d.animations=base.animations;
  const w=new World(d);assert.equal(w.gold,d.waves.cash);assert.equal(w.totalWaves,pack.levels.find(s=>s.id===id).modes[mode].waves);assert.ok(w.slots.length>0);assert.ok(w.exits.length>0);
  for(const group of d.waves.groups)for(const wave of group.waves){assert.ok(w.routes[wave.path_index-1],`missing route ${wave.path_index}`);for(const s of wave.spawns)if(s.max>0){assert.ok(d.templates[s.creep],s.creep);assert.ok(s.max>=1);}}
  const frames={...base.frames,...pack.frames};for(const key of pack.levels.find(s=>s.id===id).modes[mode].enemies){const t=d.templates[key];for(const sprite of t.render.sprites)if(sprite.prefix){const a=base.animations[sprite.prefix+'_idle'];assert.ok(a,`${key} idle`);const index=a.from||a.ranges?.[0]?.[0]||a.frames?.[0]||1;assert.ok(frames[a.prefix+'_'+String(index).padStart(4,'0')],key);}}
 }
});
test('expansion loader isolates catalogs and never changes playable progress',async()=>{
 const fetchBefore=globalThis.fetch;globalThis.fetch=async url=>({ok:true,json:async()=>read(url.replace('assets/',''))});
 try{const original=JSON.stringify(base),repo={catalog:base,image:()=>null},e=await new ExpansionRepository(repo).init();const a=await e.level(4);assert.equal(a.id,4);assert.equal(await e.level(4),a);assert.equal(pack.releaseReady,false);assert.equal(base.levels.length,3);assert.equal(JSON.stringify(base),original);await assert.rejects(()=>e.level(7));await assert.rejects(()=>e.level(4,'fake'));}finally{globalThis.fetch=fetchBefore;}
});
