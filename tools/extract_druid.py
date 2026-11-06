"""Original Druid baseline only. Controllers are audited as bytecode, never run."""
import hashlib,io,json,pathlib,re,subprocess,sys,zipfile
R=pathlib.Path(__file__).resolve().parents[1];sys.path.insert(0,str(R.parent/'.tools/python'))
from PIL import Image
root=R/'reference/apk/assets/gc64';out=R/'web/assets/druid';out.mkdir(exist_ok=True);pin=R/'tools/sources/druid.json';old=json.loads(pin.read_text())if pin.exists()else{}
def run(*args):return subprocess.check_output(['/opt/homebrew/bin/luajit',*args],cwd=R,text=True)
paths=['kr3/game_templates.lua','kr3/game_scripts.lua','all/templates.lua','all/scripts.lua','all/script_utils.lua','all/utils.lua','all/systems.lua','all/constants.lua','kr3/upgrades.lua','kr3/data/tower_menus_data.lua']
sha={p:hashlib.sha256((root/p).read_bytes()).hexdigest()for p in paths}
assert not old or sha==old['sha256']
checks=[('kr3/game_scripts.lua','game_scripts.lua:1107-1230',['max_loaded_bullets','predict_enemy_node_advance','is_node_valid','1.05']),('kr3/game_scripts.lua','game_scripts.lua:1121-1142',['storage_offsets','damage_factor','target_id']),('kr3/game_scripts.lua','game_scripts.lua:1171-1174',['TERRAIN_FAERIE']),('kr3/game_scripts.lua','game_scripts.lua:1087-1105',['queue_remove','loaded_bullets']),('kr3/game_scripts.lua','game_scripts.lua:13836-13869',['rotation_speed','bomb','tween']),('all/scripts.lua','scripts.lua:2157-2299',['dist_factor_inside_ellipse','queue_damage']),('all/scripts.lua','scripts.lua:2196-2204',['damage_flags','is_inside_ellipse']),('all/utils.lua','utils.lua:141-157',['cos','sin','clamp'])]
for file,mark,terms in checks:
 s=run('-bl',str(root/file));a=s.index('-- BYTECODE -- '+mark);b=s.find('-- BYTECODE --',a+16)
 for t in terms:assert t in s[a:b],(mark,t)
functions=json.loads(run('tools/read_druid_functions.lua',str(root),'precise'));assert functions['tower_druid']['update']['__script_path']=='game_scripts.tower_druid.update';assert functions['rock_druid']['update']['__script_path']=='game_scripts.rock_druid.update';assert functions['info']['fn']['__script_path']=='scripts.tower_common.get_info'
rules=json.loads(run('tools/read_druid_rules.lua'));assert 'rock_druid'in rules['damageTargets']and'rock_druid'in rules['areaTargets'];(out/'rules.json').write_text(json.dumps(rules,sort_keys=True,separators=(',',':'))+'\n')
templates=json.loads(run('tools/read_templates.lua',str(root),'precise'));selected={k:templates[k]for k in ['tower_druid','rock_druid','fx_rock_druid_launch','fx_rock_explosion','fx_explosion_water','decal_rock_crater']}
assert selected['tower_druid']['tower']['price']==375 and selected['tower_druid']['powers']['nature']['max_level']==2
c=json.loads((R/'web/assets/catalog.json').read_text());frames=c['frames'];keep=set()
def add(name):
 if name in frames:keep.add(name)
 a=c['animations'].get(name)
 if a:
  ids=a.get('frames')or[i for lo,hi in a.get('ranges',[])for i in range(lo,hi+1)]or list(range(a['from'],a['to']+1))
  for i in ids:keep.add(a['prefix']+'_'+str(i).zfill(4))
 if '%04i'in name:keep.update(k for k in frames if re.fullmatch(re.escape(name).replace('%04i',r'\d{4}'),k))
for t in selected.values():
 for s in t.get('render',{}).get('sprites',[]):
  if s.get('prefix')=='druid_stone%i':
   for i in range(1,4):
    for action in ['load','travel']:add('druid_stone'+str(i)+'_'+action)
  elif s.get('prefix')=='tower_druid_shooter':
   for action in ['idleUp','idleDown','shootUp','shootDown','castUp','castDown']:add('tower_druid_shooter_'+action)
  elif s.get('prefix'):add(s['prefix']+'_'+s['name'])
  else:add(s.get('name',''))
assert all(k in frames for k in keep)
z=zipfile.ZipFile(R.parent/'origins.apk');raws={n:z.read('assets/kr3-phone/images/iphonehd/'+n.replace('.webp','.png'))for n in {frames[k]['a']for k in keep}}
images={n:Image.open(io.BytesIO(raw)).convert('RGBA')for n,raw in raws.items()};pngsha={n.replace('.webp','.png'):hashlib.sha256(raw).hexdigest()for n,raw in raws.items()}
assert not old or old['imageSHA256']==pngsha
atlasnames={re.sub(r'-[0-9]+$','',n[:-5])+'.lua'for n in raws};declsha={n:hashlib.sha256(z.read('assets/kr3-phone/images/iphonehd/'+n)).hexdigest()for n in atlasnames}
assert not old or old['atlasSHA256']==declsha
width=1024;x=y=row=0;new={}
for k in sorted(keep):
 f=frames[k];w,h=f['q'][2:]
 if x+w+2>width:x=0;y+=row+2;row=0
 new[k]={**f,'a':'../druid/sprites.webp','q':[x,y,w,h]};x+=w+2;row=max(row,h)
im=Image.new('RGBA',(width,y+row+2))
for k,f in new.items():
 oldf=frames[k];x,y,w,h=oldf['q'];im.paste(images[oldf['a']].crop((x,y,x+w,y+h)),tuple(f['q'][:2]))
im.save(out/'sprites.webp',lossless=True,exact=True,method=6);check=Image.open(out/'sprites.webp').convert('RGBA')
for k,f in new.items():
 x,y,w,h=frames[k]['q'];nx,ny=f['q'][:2];assert check.crop((nx,ny,nx+w,ny+h)).tobytes()==images[frames[k]['a']].crop((x,y,x+w,y+h)).tobytes(),k
(out/'catalog.json').write_text(json.dumps({'templates':selected,'frames':new,'sheets':['../druid/sprites.webp'],'rules':rules},sort_keys=True,separators=(',',':')))
portrait=c['frames']['portraits_towers_0012'];portraitPNG=z.read('assets/kr3-phone/images/iphonehd/'+portrait['a'].replace('.webp','.png'));portraitSHA=hashlib.sha256(portraitPNG).hexdigest();assert not old.get('portraitPNG_SHA256')or old['portraitPNG_SHA256']==portraitSHA
pin.write_text(json.dumps({'portraitPNG_SHA256':portraitSHA,'sha256':sha,'imageSHA256':pngsha,'atlasSHA256':declsha,'functions':functions,'ranges':[x[1]for x in checks],'frames':len(new),'bytes':(out/'sprites.webp').stat().st_size,'rgbaVerified':True,'scope':'baseline original storage/load/volley and bomb falloff; nature/sylvan disabled; path prediction/native queueIDs/audio/pop and higher global talents remain adapted or incomplete'},ensure_ascii=False,sort_keys=True,indent=2)+'\n');print('Druid lossless group',len(new),(out/'sprites.webp').stat().st_size)
