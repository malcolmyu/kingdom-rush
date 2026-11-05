"""Stage 4–6 declaration/art package. Does not enable unfinished campaign stages.

Only data/layout tables are evaluated; template reader stubs runtime scripts.
Source paths/hashes are emitted so downstream mechanics can be audited separately.
"""
import argparse, hashlib, io, json, pathlib, struct, subprocess, sys, zipfile
ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT.parent/'.tools/python'))
from PIL import Image
import texture2ddecoder

def extract(apk, luajit):
 out = ROOT/'web/assets/expansion'; out.mkdir(parents=True, exist_ok=True)
 z = zipfile.ZipFile(apk); hashes = {}; images = {}; frames = {}
 expected=json.loads((ROOT/'tools/sources/expansion.json').read_text())['files']
 def source(name):
  raw = z.read(name); hashes[name] = hashlib.sha256(raw).hexdigest()
  if expected.get(name)!=hashes[name]:raise RuntimeError('Expansion source checksum: '+name)
  return raw
 def declaration(name):
  p = ROOT/'reference/apk'/name; p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(source(name))
  return json.loads(subprocess.check_output([luajit, str(ROOT/'tools/dump_lua.lua'), str(p),'precise']))
 def decode(name):
  if name not in images:
   raw = source('assets/kr3-phone/images/iphonehd/'+name)
   if name.endswith('.pkm'):
    fmt,w,h,ow,oh=struct.unpack('>5H',raw[6:16]); assert fmt==0
    im=Image.frombytes('RGBA',(w,h),texture2ddecoder.decode_etc1(raw[16:],w,h),'raw','BGRA').crop((0,0,ow,oh))
   else: im=Image.open(io.BytesIO(raw)).convert('RGBA')
   images[name]=im
  return images[name]
 base=json.loads((ROOT/'web/assets/catalog.json').read_text())
 templates=json.loads(subprocess.check_output([luajit,str(ROOT/'tools/read_templates.lua'),str(ROOT/'reference/apk/assets/gc64'),'precise']))
 for rel in ['all/templates.lua','kr3/game_templates.lua','all/components.lua','kr3/data/game_animations.lua']:
  source('assets/gc64/'+rel)
 required=set(); levels=[]
 for stage,title in [(4,'红杉阻击战'),(5,'皇家庭院'),(6,'狮鹫驿站')]:
  prefix=f'assets/gc64/kr3/data/levels/level{stage:02}'
  raw=declaration(prefix+'_data.lua'); paths=declaration(prefix+'_paths.lua')
  art=declaration(f'assets/kr3-phone/images/iphonehd/go_stage{stage:02}_bg.lua')
  f=next(iter(art.values())); x,y,w,h=f['f_quad']; im=decode(f['a_name']).crop((x,y,x+w,y+h))
  target=out/f'map{stage:02}.webp'; im.save(target,lossless=True,exact=True,method=6)
  assert Image.open(target).convert('RGBA').tobytes()==im.tobytes()
  for key,f in declaration(f'assets/kr3-phone/images/iphonehd/go_stage{stage:02}.lua').items():
   decode(f['a_name']); frame={'q':f['f_quad'],'size':f['size'],'trim':f['trim'],'a':f['a_name'].rsplit('.',1)[0]+'.webp'}
   frames[key]=frame
   for alias in f.get('alias',[]): frames[alias]=frame
  summary={'id':stage,'title':title,'size':list(im.size),'modes':{},'releaseReady':False}
  for mode_id,mode in enumerate(['campaign','heroic','iron'],1):
   waves=declaration(f'assets/gc64/kr3/data/waves/level{stage:02}_waves_{mode}.lua')
   level={**raw,'entities_list':[e for e in raw['entities_list']if e.get('editor.game_mode',0)in[0,mode_id]]}
   enemies=sorted({s['creep']for g in waves['groups']for wave in g['waves']for s in wave['spawns']if s.get('max',0)>0})
   required.update(enemies); required.update(e['template']for e in level['entities_list'])
   payload={'id':stage,'title':title,'mode':mode,'modeId':mode_id,'level':level,'rules':raw['level_mode_overrides'][mode_id-1],'paths':paths['paths'],'active':paths['active'],'connections':paths.get('connections',{}),'waves':waves,'map':f'assets/expansion/map{stage:02}.webp','size':list(im.size)}
   (out/f'{stage:02}-{mode}.json').write_text(json.dumps(payload,ensure_ascii=False,sort_keys=True,separators=(',',':')))
   summary['modes'][mode]={'waves':len(waves['groups']),'cash':waves['cash'],'enemies':enemies,'count':sum(s['max']for g in waves['groups']for wave in g['waves']for s in wave['spawns'])}
  levels.append(summary)
 selected={}
 def visit(value):
  if isinstance(value,str)and value in templates and value not in selected:
   selected[value]=templates[value];visit(templates[value])
  elif isinstance(value,dict):
   for v in value.values():visit(v)
  elif isinstance(value,list):
   for v in value:visit(v)
 for key in sorted(required):visit(key)
 # Include every frame of each selected enemy/scenery sprite, not only idle.
 prefixes=set(); static=set()
 for key,t in selected.items():
  for sprite in t.get('render',{}).get('sprites',[]):
   if sprite.get('prefix'):prefixes.add(sprite['prefix']+'_')
   elif sprite.get('name'):static.add(sprite['name'])
 for name in sorted(z.namelist()):
  if not(name.startswith('assets/kr3-phone/images/iphonehd/go_')and name.endswith('.lua')and '_bg.'not in name):continue
  for key,f in declaration(name).items():
   keys=[key,*f.get('alias',[])]
   if not any(k in static or any(k.startswith(p)for p in prefixes)for k in keys):continue
   decode(f['a_name']); frame={'q':f['f_quad'],'size':f['size'],'trim':f['trim'],'a':f['a_name']}
   for k in keys:frames[k]=frame
 # Compact only selected source frames with a gutter. Verify every decoded crop.
 width=2048;x=y=row=0;placements={};tiles={}
 for key,f in sorted(frames.items()):
  qx,qy,w,h=f['q'];original=f['a']; original=original[:-5]+'.png' if original.endswith('.webp') else original
  if original not in images:
   original=next(n for n in images if n.rsplit('.',1)[0]==f['a'].rsplit('.',1)[0])
  crop=decode(original).crop((qx,qy,qx+w,qy+h));digest=(crop.size,hashlib.sha256(crop.tobytes()).hexdigest())
  if digest not in tiles:
   if x+w+2>width:x=0;y+=row+2;row=0
   tiles[digest]=(x,y,crop);x+=w+2;row=max(row,h)
  px,py,_=tiles[digest];placements[key]=[px,py,w,h]
 atlas=Image.new('RGBA',(width,y+row+2))
 for px,py,im in tiles.values():atlas.paste(im,(px,py))
 target=out/'sprites.webp';atlas.save(target,lossless=True,exact=True,method=6);check=Image.open(target).convert('RGBA')
 for px,py,im in tiles.values():assert check.crop((px,py,px+im.width,py+im.height)).tobytes()==im.tobytes()
 for key,f in frames.items():f['q']=placements[key];f['a']='../expansion/sprites.webp'
 extra={k:v for k,v in selected.items()if k not in base['templates']}
 data={'levels':levels,'templates':extra,'frames':frames,'animations':{},'releaseReady':False,
       'pendingMechanics':['ettin regeneration','blighter plant suppression','perython carried gnawer release','harasser dodge/ranged combat','ewok recruitment','gryphon guards and level 6 script','advanced tower unlocks'],
       'source':{'kind':'original APK declarations; controllers not executed','numberEncoding':'IEEE754 round-trip (17 significant digits)','files':dict(sorted(hashes.items()))}}
 (out/'catalog.json').write_text(json.dumps(data,ensure_ascii=False,sort_keys=True,separators=(',',':')))
 print(json.dumps({'stages':[4,5,6],'modes':9,'newTemplates':len(extra),'stageFrames':len(frames),'releaseReady':False}))

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--apk',default=str(ROOT.parent/'origins.apk'));p.add_argument('--luajit',default='luajit');a=p.parse_args();extract(a.apk,a.luajit)
