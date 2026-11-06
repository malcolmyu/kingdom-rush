"""Blade baseline templates and complete original sprite prefixes; controllers only audited -bl."""
import hashlib,json,pathlib,subprocess,sys,zipfile,io
R=pathlib.Path(__file__).resolve().parents[1];sys.path.insert(0,str(R.parent/'.tools/python'))
from PIL import Image
root=R/'reference/apk/assets/gc64';pinnedPath=R/'tools/sources/blade.json';pinned=json.loads(pinnedPath.read_text())if pinnedPath.exists()else{}
for file,sha in pinned.get('sha256',{}).items():assert hashlib.sha256((root/file).read_bytes()).hexdigest()==sha,file
def run(*a):return subprocess.check_output(['/opt/homebrew/bin/luajit',*a],cwd=R,text=True)
checks=[('all/scripts.lua','scripts.lua:1711-1750',['soldier_power_upgrade','damage_min','hp_max']),('all/systems.lua','systems.lua:939-1104',['ignore_damage','on_damage']),('kr3/game_scripts.lua','game_scripts.lua:1673-1691',['chance','DAMAGE_NO_DODGE']),('kr3/game_scripts.lua','game_scripts.lua:1693-1707',['soldier_barrack','blade_dance']),('kr3/game_scripts.lua','game_scripts.lua:1709-1884',['y_soldier_death','y_soldier_melee_block_and_attacks','soldier_regen']),('all/script_utils.lua','script_utils.lua:138-157',['random','DAMAGE_NO_DODGE','chance']),('all/script_utils.lua','script_utils.lua:2012-2066',['forced_cooldown','chance','random']),('all/script_utils.lua','script_utils.lua:1776-1929',['forced_ts','damage_min','random']),('all/script_utils.lua','script_utils.lua:2174-2280',['chance_inc','dodge','power_name','damage_inc','cooldown_inc','forced_cooldown']),('all/scripts.lua','scripts.lua:1769-1850',['door_open','soldier_type','queue_insert'])]
for path,mark,fields in checks:
 b=run('-bl',str(root/path));i=b.index('-- BYTECODE -- '+mark);j=b.find('-- BYTECODE --',i+15)
 for value in fields:assert value in b[i:j],(mark,value)
t=json.loads(run('tools/read_templates.lua',str(root),'precise'));selected={k:t[k]for k in ['tower_blade','soldier_blade']}
assert selected['soldier_blade']['dodge']['chance']==0 and selected['soldier_blade']['revive']['disabled']
assert selected['tower_blade']['powers']['swirling']['price_base']==300 and selected['tower_blade']['powers']['swirling']['max_level']==1
assert all(a['power_name']=='swirling' and a['damage_inc']==5 and a['cooldown_inc']==-.2 for a in selected['soldier_blade']['melee']['attacks'])
c=json.loads((R/'web/assets/catalog.json').read_text());frames=c['frames'];keep=set()
def add(v):
 if isinstance(v,str):
  if v in frames:keep.add(v)
  for k,a in c['animations'].items():
   if (k==v or k.startswith(v+'_')) and a.get('prefix'):
    indices=a.get('frames')or[i for f,t in a.get('ranges',[])for i in range(f,t+1)]or list(range(a.get('from',1),a.get('to',1)+1))
    keep.update(a['prefix']+'_'+str(i).zfill(4)for i in indices if a['prefix']+'_'+str(i).zfill(4)in frames)
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
width=1024;x=y=row=0;new={};out=R/'web/assets/blade';out.mkdir(exist_ok=True)
for k in keys:
 f=frames[k];w,h=f['q'][2:]
 if x+w+2>width:x=0;y+=row+2;row=0
 new[k]={**f,'a':'../blade/sprites.webp','q':[x,y,w,h]};x+=w+2;row=max(row,h)
im=Image.new('RGBA',(width,y+row+2))
for k in keys:
 f=frames[k];x,y,w,h=f['q'];im.paste(images[f['a']].crop((x,y,x+w,y+h)),tuple(new[k]['q'][:2]))
path=out/'sprites.webp';im.save(path,lossless=True,exact=True,method=6);check=Image.open(path).convert('RGBA')
for k in keys:
 f=frames[k];x,y,w,h=f['q'];nx,ny,_,_=new[k]['q'];assert check.crop((nx,ny,nx+w,ny+h)).tobytes()==images[f['a']].crop((x,y,x+w,y+h)).tobytes(),k
data={'templates':selected,'frames':new,'sheets':['../blade/sprites.webp']}
(out/'catalog.json').write_text(json.dumps(data,sort_keys=True,separators=(',',':')))


rules=json.loads(run('tools/read_blade_parry_rules.lua'));(R/'web/blade-parry-data.mjs').write_text('export default '+json.dumps(rules,sort_keys=True,separators=(',',':'))+';\n')
paths=['all/constants.lua','kr3/game_templates.lua','kr3/game_scripts.lua','all/scripts.lua','all/script_utils.lua','all/utils.lua','all/systems.lua','kr3/upgrades.lua','kr3/data/tower_menus_data.lua']
paths=[p for p in paths if(root/p).exists()]
upgrades=json.loads(run('tools/read_blade_upgrade_rules.lua'));assert 'tower_blade'not in upgrades['fencing']and'tower_blade'in upgrades['rally']
proof={'upgrades':upgrades,'sha256':{p:hashlib.sha256((root/p).read_bytes()).hexdigest()for p in paths},'imageSHA256':{k.replace('.webp','.png'):hashlib.sha256(v).hexdigest()for k,v in raws.items()},'frames':len(keys),'rgbaVerified':True,'ranges':[x[1]for x in checks],'scope':'275 upgrade, original three soldiers, perfect parry purchase/callback/two-second counter, swirling 300 single-rank damage/cooldown, door and replacement lifecycle','limits':['Blade dance remains disabled; swirling source three attacks and forced cooldown updated once','Native coroutine/queued entity insertion, full modifiers/global upgrades/pathfinding remain adapted']}
pinnedPath.write_text(json.dumps(proof,sort_keys=True,indent=2)+'\n');print('Blade group',len(keys),'frames',path.stat().st_size,'bytes')
