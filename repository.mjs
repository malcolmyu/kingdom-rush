import {normalizeUpgrades} from './upgrades.mjs';
import {normalizeHeroProgress} from './progression.mjs';
// Boundary for loading versioned original data and browser-local progress.
import {emptySave} from './domain.mjs';
export class Repository{
 constructor(storage=globalThis.localStorage){this.storage=storage;this.slot=1;this.levels=new Map();this.images=new Map();}
 async init(){const read=async(url,message)=>{const packed=globalThis.document?.documentElement.dataset.packedMetadata==='gzip'&&globalThis.DecompressionStream;const r=await fetch(url+(packed?'.gz':''));if(!r.ok)throw new Error(message);if(globalThis.document?.documentElement.dataset.packedMetadata==='gzip'&&globalThis.DecompressionStream){const decoded=r.body.pipeThrough(new DecompressionStream('gzip'));return new Response(decoded).json();}return r.json();};const[catalog,ui,fonts]=await Promise.all([read('assets/catalog.json','素材目录加载失败'),read('assets/ui/layouts.json','原版界面数据加载失败'),read('assets/fonts/catalog.json','原字体数据加载失败')]);this.catalog=catalog;this.ui=ui;this.ui.fonts=fonts;return this;}
 async level(id,mode='campaign'){const key=id+'-'+mode;if(!this.levels.has(key)){const r=await fetch(`assets/levels/${String(id).padStart(2,'0')}-${mode}.json`);if(!r.ok)throw new Error('关卡数据加载失败');const data=await r.json();data.templates=this.catalog.templates;data.animations=this.catalog.animations;this.levels.set(key,data);}return this.levels.get(key);}
 image(src){if(!this.images.has(src)){this.images.set(src,new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>{this.images.delete(src);reject(new Error('图片加载失败：'+src));};im.src=src;}));}return this.images.get(src);}
 save(value){try{this.storage?.setItem('origins-campaign-v2-'+this.slot,JSON.stringify(value));return true;}catch{return false;}}
 load(slot=this.slot){try{const s=JSON.parse(this.storage?.getItem('origins-campaign-v2-'+slot)||'null');if(s?.version===2)return normalizeUpgrades(normalizeHeroProgress({...emptySave(),...s,heroProgressVersion:s.heroProgressVersion,unlocked:Math.max(1,Math.min(3,s.unlocked||1))},this.catalog?.templates.hero_elves_archer.hero.skills));}catch{}return emptySave();}
 has(slot=this.slot){try{return JSON.parse(this.storage?.getItem('origins-campaign-v2-'+slot)||'null')?.version===2;}catch{return false;}}
 remove(slot){try{this.storage?.removeItem('origins-campaign-v2-'+slot);}catch{}}
}
