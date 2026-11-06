// Asset readiness only. Transactions and simulation clocks remain in World.
export function towerMenuSheets(catalog,w,s){
 if(!catalog.towerAssetGroups||!s||s.ewok)return[];
 if(!s.type){const names=[];for(const type of ['archer','barrack','mage','artillery'])if(w.allowed(type,1))names.push(...catalog.towerAssetGroups[w.towerDef(type,1).key]||[]);return [...new Set(names)];}
 if(s.arcane||s.blade)return catalog.towerAssetGroups[s.key]||[];
 const next=s.level+1;
 if(!w.allowed(s.type,next))return[];
 return catalog.towerAssetGroups[w.towerDef(s.type,next).key]||[];
}
export function prepareTowerMenu(app,host){
 const ticket=app.towerAssetsRequest=(app.towerAssetsRequest||0)+1;
 const w=app.world,s=w?.slots[app.selected],renderer=app.renderer;
 const names=towerMenuSheets(renderer.catalog,w,s).filter(n=>!renderer.sheets.has(n));
 if(!names.length){app.towerAssetsPending=null;return false;}
 const id=app.selected,key=s.key,level=s.level,version=app.version;
 const current=()=>app.towerAssetsRequest===ticket&&app.version===version&&app.world===w&&app.scene==='battle'&&!app.modal&&!app.sceneMotion.busy&&app.selected===id&&w.slots[id]===s&&s.key===key&&s.level===level;
 app.towerMenu.reset();app.menuTween?.cancel();app.menuTween=null;host.hidden=true;host.inert=true;
 const pending={world:w,slot:s,ticket};app.towerAssetsPending=pending;
 pending.promise=Promise.all(names.map(n=>renderer.sheet(n))).then(()=>{
  if(app.towerAssetsPending===pending)app.towerAssetsPending=null;
  if(current())app.towerMenu.show();
 },error=>{
  if(app.towerAssetsPending===pending)app.towerAssetsPending=null;
  if(current()){app.selected=null;host.hidden=true;app.notify(error.message);}
 });return true;
}
