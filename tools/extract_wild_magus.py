"""Original Wild Magus baseline declarations/art, with controller bytecode audits."""
import hashlib,json,pathlib,subprocess,sys,zipfile,io
R=pathlib.Path(__file__).resolve().parents[1];sys.path.insert(0,str(R.parent/'.tools/python'))
from PIL import Image
root=R/'reference/apk/assets/gc64'
def run(*a):return subprocess.check_output(['/opt/homebrew/bin/luajit',*a],cwd=R,text=True)
paths=['kr3/game_scripts.lua','kr3/game_templates.lua','all/templates.lua','all/scripts.lua','all/script_utils.lua','all/utils.lua','all/systems.lua','kr3/upgrades.lua','kr3/data/tower_menus_data.lua']
proof=R/'tools/sources/wild-magus.json';old=json.loads(proof.read_text())if proof.exists()else{}
sha={p:hashlib.sha256((root/p).read_bytes()).hexdigest()for p in paths};assert not old or old['sha256']==sha
b=run('-bl',str(root/'kr3/game_scripts.lua'));a=b.index('-- BYTECODE -- game_scripts.lua:520-697');e=b.find('-- BYTECODE --',a+20)
for key in ['damage_same_target_inc','damage_same_target_max','shoot_time','find_foremost_enemy','animation_name_facing_point']:assert key in b[a:e]
common=run('-bl',str(root/'all/scripts.lua'));a=common.index('-- BYTECODE -- scripts.lua:2921-2942');e=common.index('-- BYTECODE -- scripts.lua:3080-',a)
for key in ['acceleration_factor','max_track_distance','ceil','create_bullet_damage','F_RANGED']:assert key in common[a:e]
functions=json.loads(run('tools/read_wild_functions.lua',str(root),'precise'));assert functions['bolt_wild_magus']['update']['__script_path']=='scripts.bolt.update'
rules=json.loads(run('tools/read_wild_magus_rules.lua'));assert 'tower_wild_magus' in rules['rangeTargets'] and 'bolt_wild_magus' in rules['damageTargets']
t=json.loads(run('tools/read_templates.lua',str(root),'precise'));selected={k:t[k]for k in ['tower_wild_magus','bolt_wild_magus','fx_wild_magus_hit']}
assert selected['tower_wild_magus']['tower']['price']==300
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
assert not old or old['imageSha256']=={n.replace('.webp','.png'):hashlib.sha256(raw).hexdigest()for n,raw in raws.items()}
width=1024;x=y=row=0;new={};out=R/'web/assets/wild-magus';out.mkdir(exist_ok=True)
for k in keys:
 f=frames[k];w,h=f['q'][2:]
 if x+w+2>width:x=0;y+=row+2;row=0
 new[k]={**f,'a':'../wild-magus/sprites.webp','q':[x,y,w,h]};x+=w+2;row=max(row,h)
im=Image.new('RGBA',(width,y+row+2))
for k in keys:
 f=frames[k];x,y,w,h=f['q'];im.paste(images[f['a']].crop((x,y,x+w,y+h)),tuple(new[k]['q'][:2]))
path=out/'sprites.webp';im.save(path,lossless=True,exact=True,method=6);check=Image.open(path).convert('RGBA')
for k in keys:
 f=frames[k];x,y,w,h=f['q'];nx,ny,_,_=new[k]['q'];assert check.crop((nx,ny,nx+w,ny+h)).tobytes()==images[f['a']].crop((x,y,x+w,y+h)).tobytes(),k
data={'templates':selected,'frames':new,'sheets':['../wild-magus/sprites.webp']}
(out/'catalog.json').write_text(json.dumps(data,sort_keys=True,separators=(',',':')))

(out/'rules.json').write_text(json.dumps(rules,sort_keys=True,separators=(',',':'))+'\n')
proof.write_text(json.dumps({'sha256':sha,'imageSha256':{n.replace('.webp','.png'):hashlib.sha256(raw).hexdigest()for n,raw in raws.items()},'functions':functions,'ranges':['game_scripts520–697','scripts2921–3074','utils245–332','kr3/upgrades99–301 TDUP73/75'],'frames':len(keys),'rgbaVerified':True,'scope':'Source ordinary alternating-hand attack, same-target damage increments, generic bolt tracking/acceleration; skills eldritch/ward disabled. Particles, pop/blood/audio, native coroutine IDs/queues and higher global talents remain incomplete.'},indent=2,sort_keys=True)+'\n')
print('Wild Magus lossless lazy group',len(keys),'frames',path.stat().st_size,'bytes')
