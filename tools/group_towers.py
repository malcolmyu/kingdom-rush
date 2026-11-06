"""Lossless higher-tier tower sheets; all ordinary combat frames stay available.

Only render declarations are dependency roots, not gameplay type/name strings.
The old campaign atlas remains unchanged and is still used by stages 1–3.
"""
import hashlib,json,pathlib,re,sys
from optimize_runtime import runtime_tower_keys
ROOT=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT.parent/'.tools/python'))
from PIL import Image

def group():
 b=json.loads((ROOT/'web/assets/catalog.json').read_text());all_keys=set(runtime_tower_keys(b));frames=b['frames'];animations=b['animations'];templates=b['templates'];images={}
 def render_keys(key):
  result=set()
  for sprite in templates[key].get('render',{}).get('sprites',[]):
   prefix=sprite.get('prefix')
   if prefix:
    for name,a in animations.items():
     if name.startswith(prefix+'_'):
      indices=a.get('frames') or ([i for lo,hi in a['ranges']for i in range(lo,hi+1)]if a.get('ranges')else range(a.get('from',1),a.get('to',a.get('from',1))+1))
      result.update(k for i in indices if (k:=a['prefix']+'_'+str(i).zfill(4))in all_keys)
   name=sprite.get('name','')
   if name in all_keys:result.add(name)
   if '%04i' in name:
    pattern=re.escape(name).replace('%04i',r'\d{4}');result.update(k for k in all_keys if re.fullmatch(pattern,k))
  if templates[key].get('barrack',{}).get('soldier_type')in templates:result.update(render_keys(templates[key]['barrack']['soldier_type']))
  return result
 needs={f'tower_{family}_{tier}':render_keys(f'tower_{family}_{tier}')for tier in [1,2,3]for family in ['archer','barrack','mage','rock_thrower']}
 initial=set().union(*(v for k,v in needs.items()if k.endswith('_1')))
 deferred=set().union(*(v for k,v in needs.items()if not k.endswith('_1')))-initial
 buckets={'initial':all_keys-deferred};owner={k:'initial'for k in buckets['initial']}
 for tier in [2,3]:
  for family in ['archer','barrack','mage','rock_thrower']:
   key=f'tower_{family}_{tier}';name=f'{family}-{tier}';selected=needs[key]-owner.keys()
   if selected:buckets[name]=selected;owner.update({k:name for k in selected})
 assert set(owner)==all_keys
 def write(buckets,owner,dest,rel,initial_name):
  dest.mkdir(exist_ok=True);out={};stats=[]
  for name,keys in buckets.items():
   width=2048;x=y=row=0;tiles={};placements={}
   for k in sorted(keys,key=lambda k:(-frames[k]['q'][3],k)):
    f=frames[k];p=ROOT/'web/assets/images'/f['a']
    if p not in images:images[p]=Image.open(p).convert('RGBA')
    qx,qy,w,h=f['q'];im=images[p].crop((qx,qy,qx+w,qy+h));digest=(im.size,hashlib.sha256(im.tobytes()).hexdigest())
    if digest not in tiles:
     if x+w+2>width:x=0;y+=row+2;row=0
     tiles[digest]=(x,y,im);x+=w+2;row=max(row,h)
    px,py,_=tiles[digest];placements[k]=(px,py,im)
   atlas=Image.new('RGBA',(width,y+row+2))
   for px,py,im in tiles.values():atlas.paste(im,(px,py))
   file=dest/(name+'.webp');atlas.save(file,lossless=True,exact=True,method=6);check=Image.open(file).convert('RGBA')
   for k,(px,py,im)in placements.items():
    assert check.crop((px,py,px+im.width,py+im.height)).tobytes()==im.tobytes(),k
    out[k]={**frames[k],'a':rel+name+'.webp','q':[px,py,im.width,im.height]}
   stats.append({'name':name,'frames':len(keys),'bytes':file.stat().st_size})
  data={'frames':out,'initial':[rel+initial_name+'.webp'],'groups':{k:sorted({rel+owner[f]+'.webp'for f in v})for k,v in needs.items()},'source':{'catalogSHA256':hashlib.sha256((ROOT/'web/assets/catalog.json').read_bytes()).hexdigest(),'atlasSHA256':{str(p.relative_to(ROOT/'web/assets/images')):hashlib.sha256(p.read_bytes()).hexdigest()for p in sorted(images)},'rgbaVerified':True,'frames':len(all_keys)}}
  (dest/'catalog.json').write_text(json.dumps(data,ensure_ascii=False,sort_keys=True,separators=(',',':')))
  print(json.dumps({"variant":initial_name,"groups":stats}))
 write(buckets,owner,ROOT/'web/assets/tower-groups','../tower-groups/','initial')
 # Stage5/6 entry keeps common scenery/build feedback available, while tower
 # bodies/door/soldiers are decoded by real menu/prebuilt dependencies.
 families=['archer','barrack','mage','rock_thrower']
 family_keys={f:set().union(*(needs[f'tower_{f}_{t}']for t in [1,2,3]))for f in families}
 shared={k for k in all_keys if sum(k in v for v in family_keys.values())>1}
 common=all_keys-set().union(*needs.values())|shared
 for k in ['tower_holder_elven_woods','tower_holder_faerie_grove']+[f'tower_build_{f}'for f in families]:
  if k in templates:common.update(render_keys(k))
 buckets={'common':common};owner={k:'common'for k in common}
 for tier in [1,2,3]:
  for family in families:
   key=f'tower_{family}_{tier}';name=f'{family}-{tier}';selected=needs[key]-owner.keys()
   if selected:buckets[name]=selected;owner.update({k:name for k in selected})
 assert set(owner)==all_keys
 write(buckets,owner,ROOT/'web/assets/tower-groups/entry','../tower-groups/entry/','common')
if __name__=='__main__':group()
