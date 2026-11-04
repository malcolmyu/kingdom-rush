import {normalizeHeroProgress} from './progression.mjs';
// Boundary for loading versioned original data and browser-local progress.
import {emptySave} from './domain.mjs';
export class Repository{
 constructor(storage=globalThis.localStorage){this.storage=storage;this.slot=1;this.levels=new Map();this.images=new Map();}
 async init(){const r=await fetch('assets/catalog.json');if(!r.ok)throw new Error('素材目录加载失败');this.catalog=await r.json();const u=await fetch('assets/ui/layouts.json');if(!u.ok)throw new Error('原版界面数据加载失败');this.ui=await u.json();const f=await fetch('assets/fonts/catalog.json');if(!f.ok)throw new Error('原字体数据加载失败');this.ui.fonts=await f.json();return this;}
 async level(id,mode='campaign'){const key=id+'-'+mode;if(!this.levels.has(key)){const r=await fetch(`assets/levels/${String(id).padStart(2,'0')}-${mode}.json`);if(!r.ok)throw new Error('关卡数据加载失败');const data=await r.json();data.templates=this.catalog.templates;data.animations=this.catalog.animations;this.levels.set(key,data);}return this.levels.get(key);}
 image(src){if(!this.images.has(src)){this.images.set(src,new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>{this.images.delete(src);reject(new Error('图片加载失败：'+src));};im.src=src;}));}return this.images.get(src);}
 save(value){try{this.storage?.setItem('origins-campaign-v2-'+this.slot,JSON.stringify(value));return true;}catch{return false;}}
 load(slot=this.slot){try{const s=JSON.parse(this.storage?.getItem('origins-campaign-v2-'+slot)||'null');if(s?.version===2)return normalizeHeroProgress({...emptySave(),...s,heroProgressVersion:s.heroProgressVersion,unlocked:Math.max(1,Math.min(3,s.unlocked||1))},this.catalog?.templates.hero_elves_archer.hero.skills);}catch{}return emptySave();}
 remove(slot){try{this.storage?.removeItem('origins-campaign-v2-'+slot);}catch{}}
}
