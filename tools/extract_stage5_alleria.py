"""Alleria original declarations and lossless stage5-only animation group; controllers never executed."""
import hashlib,json,pathlib,subprocess,sys,zipfile,io
R=pathlib.Path(__file__).resolve().parents[1];sys.path.insert(0,str(R.parent/'.tools/python'))
from PIL import Image
root=R/'reference/apk/assets/gc64'
pinnedPath=R/'tools/sources/stage5-alleria.json';pinned=json.loads(pinnedPath.read_text())if pinnedPath.exists()else{}
for file,digest in pinned.get('sha256',{}).items():assert hashlib.sha256((root/file).read_bytes()).hexdigest()==digest,('Pinned source changed',file)
def run(*a):return subprocess.check_output(['/opt/homebrew/bin/luajit',*a],cwd=R,text=True)
checks=[('kr3/game_scripts.lua','game_scripts.lua:8182-8279',['respawn','alleria_cat','y_hero_death_and_respawn','soldier_regen']),('kr3/game_scripts.lua','game_scripts.lua:8284-8302',['extra_arrows','clone_entity','target_id']),('kr3/data/levels/level05.lua','level05.lua:51-98',['insert_hero','hero_alleria']),('all/level_utils.lua','level_utils.lua:395-476',['main_hero','hero-added'])]
for path,mark,fields in checks:
 b=run('-bl',str(root/path));i=b.index('-- BYTECODE -- '+mark);j=b.find('-- BYTECODE --',i+15)
 for v in fields:assert v in b[i:j],(mark,v)
t=json.loads(run('tools/read_templates.lua',str(root),'precise'))
selected={k:t[k]for k in ['hero_alleria','arrow_hero_alleria','arrow_multishot_hero_alleria']}
(R/'web/stage5-alleria-data.mjs').write_text('// Original data only. Controllers never executed.\nexport default '+json.dumps({'templates':selected},sort_keys=True,separators=(',',':'))+';\n')
c=json.loads((R/'web/assets/catalog.json').read_text());frames=dict(c['frames']);keep=set()
z=zipfile.ZipFile(R.parent/'origins.apk');declaration='assets/kr3-phone/images/iphonehd/go_hero_alleria.lua'
raw=z.read(declaration);assert not pinned.get('declarationSHA256')or hashlib.sha256(raw).hexdigest()==pinned['declarationSHA256'];local=R/'reference/apk'/declaration;local.parent.mkdir(parents=True,exist_ok=True);local.write_bytes(raw)
original=json.loads(run('tools/dump_lua.lua',str(local),'precise'))
for key,f in original.items():
 frame={'a':f['a_name'].replace('.png','.webp'),'q':f['f_quad'],'size':f['size'],'trim':f['trim']}
 for alias in [key,*f.get('alias',[])]:frames[alias]=frame
def add(v):
 if isinstance(v,str):
  if v in frames:keep.add(v)
  for k,a in c['animations'].items():
   if (k==v or k.startswith(v+'_')) and a.get('prefix') and (v!='catapult' or k in ['catapult_idle','catapult_running','catapult_shoot','catapult_death']):keep.update(n for n in frames if n.startswith(a['prefix']+'_'))
 elif isinstance(v,dict):
  for x in v.values():add(x)
 elif isinstance(v,list):
  for x in v:add(x)

for template in selected.values():
 for sprite in template.get('render',{}).get('sprites',[]):
  if sprite.get('prefix'):
   add(sprite['prefix'])
  else:add(sprite.get('name',''))
keys=sorted(keep);z=zipfile.ZipFile(R.parent/'origins.apk');raws={n:z.read('assets/kr3-phone/images/iphonehd/'+n.replace('.webp','.png'))for n in {frames[k]['a']for k in keys}};
for n,raw in raws.items():
 expected=pinned.get('imageSHA256',{}).get(n.replace('.webp','.png'));assert not expected or hashlib.sha256(raw).hexdigest()==expected,('Pinned image changed',n)
images={n:Image.open(io.BytesIO(raw)).convert('RGBA')for n,raw in raws.items()}
width=1024;x=y=row=0;new={};out=R/'web/assets/stage5-alleria';out.mkdir(exist_ok=True)
for k in keys:
 f=frames[k];w,h=f['q'][2:]
 if x+w+2>width:x=0;y+=row+2;row=0
 new[k]={**f,'a':'../stage5-alleria/sprites.webp','q':[x,y,w,h]};x+=w+2;row=max(row,h)
im=Image.new('RGBA',(width,y+row+2))
for k in keys:
 f=frames[k];x,y,w,h=f['q'];im.paste(images[f['a']].crop((x,y,x+w,y+h)),tuple(new[k]['q'][:2]))
path=out/'sprites.webp';im.save(path,lossless=True,exact=True,method=6);check=Image.open(path).convert('RGBA')
for k in keys:
 f=frames[k];x,y,w,h=f['q'];nx,ny,_,_=new[k]['q'];assert check.crop((nx,ny,nx+w,ny+h)).tobytes()==images[f['a']].crop((x,y,x+w,y+h)).tobytes(),k
data={'templates':selected,'frames':new,'sheets':['../stage5-alleria/sprites.webp']}
(out/'catalog.json').write_text(json.dumps(data,sort_keys=True,separators=(',',':')))


paths=['kr3/data/levels/level05.lua','kr3/game_templates.lua','kr3/game_scripts.lua','all/level_utils.lua','all/scripts.lua','all/script_utils.lua','all/utils.lua']
proof={'sha256':{p:hashlib.sha256((root/p).read_bytes()).hexdigest()for p in paths},'imageSHA256':{k.replace('.webp','.png'):hashlib.sha256(v).hexdigest()for k,v in raws.items()},'declarationSHA256':hashlib.sha256(z.read(declaration)).hexdigest(),'frames':len(keys),'rgbaVerified':True,'ranges':[x[1]for x in checks],'scope':'Stage5 Alleria intro, independent HP/respawn, normal/special arrow and melee combat adapter','limits':['Cat controller, full grid rally and source multiple portrait HUD pending','Native coroutine/target priority/modifier and special-death queues adapted; no pixel certification']}
pinnedPath.write_text(json.dumps(proof,sort_keys=True,indent=2)+'\n')
print('Alleria group',len(keys),'frames',path.stat().st_size,'bytes')
