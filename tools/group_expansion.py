"""Reproducible per-stage lossless sheets from the audited expansion package.

No source controller execution. Shared frames are reused only after pixel and
size/trim equality checks, never by name alone.
"""
import hashlib,json,pathlib,sys,re
ROOT=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT.parent/'.tools/python'))
from PIL import Image

def group():
 out=ROOT/'web/assets/expansion';pack=json.loads((out/'catalog.json').read_text());base=json.loads((ROOT/'web/assets/catalog.json').read_text());arcane=json.loads((ROOT/'web/assets/arcane/catalog.json').read_text())
 images={};all_templates={**base['templates'],**pack['templates']};animations={**base['animations'],**pack['animations']}
 def crop(f,exp=False):
  p=out/'sprites.webp' if exp else ROOT/'web/assets/images'/f['a']
  if p not in images:images[p]=Image.open(p).convert('RGBA')
  x,y,w,h=f['q'];return images[p].crop((x,y,x+w,y+h))
 reusable=set()
 for k,f in pack['frames'].items():
  if k not in base['frames']:continue
  b=base['frames'][k]
  if f['size']==b['size'] and f['trim']==b['trim'] and crop(f,True).tobytes()==crop(b).tobytes():reusable.add(k)
 (out/'index.json').write_text(json.dumps({k:pack[k]for k in ('levels','releaseReady','source')},ensure_ascii=False,sort_keys=True,separators=(',',':')))
 summaries=[]
 for stage in (4,5,6):
  required=set();selected={}
  for mode in ('campaign','heroic','iron'):
   d=json.loads((out/f'{stage:02}-{mode}.json').read_text())
   required.update(e['template'] for e in d['level']['entities_list'])
   required.update(s['creep']for g in d['waves']['groups']for w in g['waves']for s in w['spawns']if s['max']>0)
  def visit(v):
   if isinstance(v,str) and v in all_templates and v not in selected:
    selected[v]=all_templates[v];visit(selected[v])
   elif isinstance(v,dict):
    for x in v.values():visit(x)
   elif isinstance(v,list):
    for x in v:visit(x)
  for k in sorted(required):visit(k)
  # Script-created render templates and dynamic names audited in the original
  # stage controller. The stage04 burner art is shared with the old enemy pack.
  if stage==4:required.add('fx_torch_gnoll_burner_explosion_stage04')
  keys=set()
  def frames(v):
   if isinstance(v,str):
    if v in pack['frames']:keys.add(v)
    prefix=animations.get(v,{}).get('prefix',v)
    if '%04i' in v:keys.update(k for k in pack['frames']if k.startswith(v.split('%04i')[0]))
    keys.update(k for k in pack['frames']if k.startswith(prefix+'_'))
   elif isinstance(v,dict):
    for x in v.values():frames(x)
   elif isinstance(v,list):
    for x in v:frames(x)
  frames(selected);frames(sorted(required))
  # Keep original per-level foreground/background overlays and aliases.
  keys.update(k for k in pack['frames']if k.startswith((f'Stage{stage:02}_',f'stage{stage}_')))
  if stage==6:keys.update(k for k in pack['frames']if k.startswith('ally_gryphon'))
  keys-=reusable
  shared=set()
  def shared_frames(v):
   if isinstance(v,str):
    if v in base['frames']:shared.add(v)
    prefix=animations.get(v,{}).get('prefix',v)
    shared.update(k for k in base['frames']if k.startswith(prefix+'_'))
    for name,a in animations.items():
     if name==v or name.startswith(v+'_'):
      indices=a.get('frames') or ([i for lo,hi in a['ranges']for i in range(lo,hi+1)]if a.get('ranges')else range(a.get('from',1),a.get('to',a.get('from',1))+1))
      shared.update(k for i in indices if (k:=a['prefix']+'_'+str(i).zfill(4))in base['frames'])
    if '%04i' in v:shared.update(k for k in base['frames']if k.startswith(v.split('%04i')[0]))
   elif isinstance(v,dict):
    for x in v.values():shared_frames(x)
   elif isinstance(v,list):
    for x in v:shared_frames(x)
  if stage!=5:shared_frames(selected)
  runtime_roots={};runtime_modules={}
  if stage==5:
   def runtime_visit(v):
    if isinstance(v,str)and v in all_templates and v not in runtime_roots:
     runtime_roots[v]=all_templates[v];runtime_visit(runtime_roots[v])
    elif isinstance(v,dict):
     for x in v.values():runtime_visit(x)
    elif isinstance(v,list):
     for x in v:runtime_visit(x)
   roots=['hero_elves_archer','hero_alleria']+[f'tower_{f}_{t}'for f in ['archer','barrack','mage','rock_thrower']for t in [1,2,3]]
   roots += [k for k in all_templates if k.startswith(('re_current_','soldier_re_'))]
   for k in roots:runtime_visit(k)
   for name in ['domain.mjs','renderer.mjs','projectile-sprites.mjs','skill-effect-data.mjs','tower-effect-data.mjs','blighter.mjs','blighter-energy-data.mjs','harasser-data.mjs','harasser-jump-data.mjs','stage5-alleria-data.mjs','stage5-catapult-data.mjs','arcane-slumber.mjs']:
    path=ROOT/'web'/name;runtime_modules[name]=hashlib.sha256(path.read_bytes()).hexdigest()
    for literal in re.findall(r"['\"]([a-zA-Z0-9_%-]+)['\"]",path.read_text()):runtime_visit(literal)
   def render_shared(obj):
    if isinstance(obj,dict):
     for sprite in obj.get('render',{}).get('sprites',[]):shared_frames(sprite.get('prefix')or sprite.get('name',''))
     for v in obj.values():render_shared(v)
    elif isinstance(obj,list):
     for v in obj:render_shared(v)
   render_shared(selected);render_shared(runtime_roots)
   for name in ['skill-effect-data.mjs','tower-effect-data.mjs']:
    text=(ROOT/'web'/name).read_text().strip();render_shared(json.loads(text.split('export default ',1)[1].removesuffix(';')))
  else:
   for k,t in base['templates'].items():
    if k.startswith(('tower_','soldier_','hero_','power_','arrow','bolt','rock_','torch_','fx_','mod_')):shared_frames(t)
  for module in (ROOT/'web').glob('*.mjs'):
   if stage==5 or module.name not in {'skill-effect-data.mjs','tower-effect-data.mjs'}:continue
   for literal in re.findall(r"['\"]([a-zA-Z0-9_%-]+)['\"]",module.read_text()):shared_frames(literal)
  shared={k for k in shared if base['frames'][k]['a'].startswith(('go_decals-','go_stages_elven_woods-')) and k not in keys}
  keys.update(shared)
  width=2048;x=y=row=0;tiles={};result={}
  for k in sorted(keys):
   f=base['frames'][k] if k in shared else pack['frames'][k];im=crop(f,k not in shared);digest=(im.size,hashlib.sha256(im.tobytes()).hexdigest())
   if digest not in tiles:
    if x+im.width+2>width:x=0;y+=row+2;row=0
    tiles[digest]=(x,y,im);x+=im.width+2;row=max(row,im.height)
   px,py,_=tiles[digest];result[k]={**f,'q':[px,py,im.width,im.height],'a':f'../expansion/stage{stage:02}.webp'}
  atlas=Image.new('RGBA',(width,y+row+2))
  for px,py,im in tiles.values():atlas.paste(im,(px,py))
  dest=out/f'stage{stage:02}.webp';atlas.save(dest,lossless=True,exact=True,method=6);check=Image.open(dest).convert('RGBA')
  for px,py,im in tiles.values():assert check.crop((px,py,px+im.width,py+im.height)).tobytes()==im.tobytes()
  data={'id':stage,'frames':result,'templates':{k:v for k,v in selected.items()if k in pack['templates']},'sheets':[f'../expansion/stage{stage:02}.webp'],'compactScenery':True,'source':{'catalogSHA256':hashlib.sha256((out/'catalog.json').read_bytes()).hexdigest(),'baseCatalogSHA256':hashlib.sha256((ROOT/'web/assets/catalog.json').read_bytes()).hexdigest(),'expansionAtlasSHA256':hashlib.sha256((out/'sprites.webp').read_bytes()).hexdigest(),'sharedAtlasSHA256':{n:hashlib.sha256((ROOT/'web/assets/images'/n).read_bytes()).hexdigest()for n in sorted({base['frames'][k]['a']for k in shared})},'reusedFrames':len(reusable),'rgbaVerified':True}}
  if stage==5:data['source']['runtimeRoots']=sorted(runtime_roots);data['source']['runtimeModulesSHA256']=runtime_modules
  (out/f'stage{stage:02}.json').write_text(json.dumps(data,ensure_ascii=False,sort_keys=True,separators=(',',':')))
  summaries.append({'id':stage,'frames':len(result),'bytes':dest.stat().st_size})
 print(json.dumps({'stageGroups':summaries,'verifiedSharedFrames':len(reusable)}))
if __name__=='__main__':group()
