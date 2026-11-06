"""Data-only Arcane baseline; controllers are inspected, never executed."""
import hashlib,json,pathlib,subprocess,sys,zipfile,io
R=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(R.parent/'.tools/python'))
from PIL import Image
root=R/'reference/apk/assets/gc64'
def run(*a):return subprocess.check_output(['/opt/homebrew/bin/luajit',*a],cwd=R,text=True)
b=run('-bl',str(root/'kr3/game_scripts.lua'))
for marker,fields in [('240-362',['shooters_delay','find_foremost_enemy','shoot_time']),('253-274',['flight_time_min','flight_time_factor','damage_factor'])]:
 i=b.index('-- BYTECODE -- game_scripts.lua:'+marker);j=b.find('-- BYTECODE --',i+15)
 for f in fields:assert f in b[i:j],f
common=run('-bl',str(root/'all/scripts.lua'));assert '-- BYTECODE -- scripts.lua:5328-5342' in common
health=run('-bl',str(root/'all/systems.lua'));assert 'magic_armor_dec' in health
t=json.loads(run('tools/read_templates.lua',str(root),'precise'))
selected={k:t[k]for k in ['tower_arcane','arrow_arcane','mod_arrow_arcane','fx_arrow_arcane_hit']}
assert selected['mod_arrow_arcane']['damage_type']==512
c=json.loads((R/'web/assets/catalog.json').read_text());frames=c['frames'];keep=set()
def add(v):
 if isinstance(v,str):
  if v in frames:keep.add(v)
  for k,a in c['animations'].items():
   if k==v or k.startswith(v+'_'):keep.update(n for n in frames if n.startswith(a['prefix']+'_'))
 elif isinstance(v,dict):
  for x in v.values():add(x)
 elif isinstance(v,list):
  for x in v:add(x)
add(selected)
keys=sorted(keep);z=zipfile.ZipFile(R.parent/'origins.apk');raws={n:z.read('assets/kr3-phone/images/iphonehd/'+n.replace('.webp','.png'))for n in {frames[k]['a']for k in keys}};images={n:Image.open(io.BytesIO(raw)).convert('RGBA')for n,raw in raws.items()}
width=1024;x=y=row=0;new={};out=R/'web/assets/arcane';out.mkdir(exist_ok=True)
for k in keys:
 f=frames[k];w,h=f['q'][2:]
 if x+w+2>width:x=0;y+=row+2;row=0
 new[k]={**f,'a':'../arcane/sprites.webp','q':[x,y,w,h]};x+=w+2;row=max(row,h)
im=Image.new('RGBA',(width,y+row+2))
for k in keys:
 f=frames[k];x,y,w,h=f['q'];im.paste(images[f['a']].crop((x,y,x+w,y+h)),tuple(new[k]['q'][:2]))
path=out/'sprites.webp';im.save(path,lossless=True,exact=True,method=6);check=Image.open(path).convert('RGBA')
for k in keys:
 f=frames[k];x,y,w,h=f['q'];nx,ny,_,_=new[k]['q'];assert check.crop((nx,ny,nx+w,ny+h)).tobytes()==images[f['a']].crop((x,y,x+w,y+h)).tobytes(),k
data={'templates':selected,'frames':new,'sheets':['../arcane/sprites.webp']}
(out/'catalog.json').write_text(json.dumps(data,sort_keys=True,separators=(',',':')))
paths=['kr3/game_scripts.lua','kr3/game_templates.lua','all/scripts.lua','all/script_utils.lua','all/systems.lua','all/constants.lua','all/utils.lua']
(R/'tools/sources/arcane.json').write_text(json.dumps({'sha256':{p:hashlib.sha256((root/p).read_bytes()).hexdigest()for p in paths},'imageSha256':{n.replace('.webp','.png'):hashlib.sha256(raw).hexdigest()for n,raw in raws.items()},'controller':'game_scripts240-362 including246-274; scripts.arrow1947-2130; mod_damage; health magical armor branch','frames':len(keys),'rgbaVerified':True,'scope':'baseline paired shooters, source upgrade, physical arrows and additive magic armor reduction','limits':['Special powers disabled','Native coroutine/entity insertion and queued damage adapted','Blood/pop/water miss and complete modifiers pending']},indent=2,sort_keys=True)+'\n')
print('Arcane lossless lazy group',len(keys),'frames',path.stat().st_size,'bytes')
