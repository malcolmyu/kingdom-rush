"""Original stage5 catapult declarations, lossless sprites and read-only audit."""
import hashlib,json,pathlib,subprocess,sys,zipfile,io
R=pathlib.Path(__file__).resolve().parents[1];sys.path.insert(0,str(R.parent/'.tools/python'))
from PIL import Image
root=R/'reference/apk/assets/gc64'
pinnedPath=R/'tools/sources/stage5-catapult.json';pinned=json.loads(pinnedPath.read_text())if pinnedPath.exists()else{}
for file,digest in pinned.get('sha256',{}).items():assert hashlib.sha256((root/file).read_bytes()).hexdigest()==digest,('Pinned controller changed',file)
def run(*a):return subprocess.check_output(['/opt/homebrew/bin/luajit',*a],cwd=R,text=True)
checks=[('kr3/game_scripts.lua','game_scripts.lua:9026-9100',['stop_ni','duration','F_ALL','y_enemy_range_attacks']),('kr3/game_scripts.lua','game_scripts.lua:9053-9062',['max_x','min_x','vis_bans']),('all/scripts.lua','scripts.lua:2305-2325',['flight_time_base','random']),('all/scripts.lua','scripts.lua:2327-2438',['damage_decay_random','dist_factor_inside_ellipse','hit_decal']),('kr3/data/levels/level05.lua','level05.lua:51-98',['catapult_waves','hero_alleria','stop_ni'])]
for path,mark,fields in checks:
 b=run('-bl',str(root/path));i=b.index('-- BYTECODE -- '+mark);j=b.find('-- BYTECODE --',i+15)
 for v in fields:assert v in b[i:j],(mark,v)
utils=run('-bl',str(root/'all/script_utils.lua'));assert all(v in utils for v in ['script_utils.lua:2784-2832','script_utils.lua:2897-2935','bullet_start_offset','ignore_hit_offset'])
proof=run('-bl',str(root/'kr3/game_templates.lua'));i=proof.index('; \"enemy_catapult\"');j=proof.index('; \"enemy_bandersnatch\"',i);assert all(v in proof[i:j]for v in ['enemy_basic','enemy_bomb'])
t=json.loads(run('tools/read_templates.lua',str(root),'precise'))
selected={k:t[k]for k in ['enemy_catapult','rock_enemy_catapult','fx_rock_explosion','decal_rock_crater']}
rules=json.loads(run('tools/read_stage5_catapults.lua'))
(R/'web/stage5-catapult-data.mjs').write_text('// Original declarations/prototype constants. Controllers never executed.\nexport default '+json.dumps({'templates':selected,'rules':rules},sort_keys=True,separators=(',',':'))+';\n')
c=json.loads((R/'web/assets/catalog.json').read_text());frames=c['frames'];keep=set()
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
   for state in ['idle','running','shoot','death']:add(sprite['prefix']+'_'+state)
  else:add(sprite.get('name',''))
keys=sorted(keep);z=zipfile.ZipFile(R.parent/'origins.apk');raws={n:z.read('assets/kr3-phone/images/iphonehd/'+n.replace('.webp','.png'))for n in {frames[k]['a']for k in keys}};
for n,raw in raws.items():
 expected=pinned.get('imageSHA256',{}).get(n.replace('.webp','.png'));assert not expected or hashlib.sha256(raw).hexdigest()==expected,('Pinned image changed',n)
images={n:Image.open(io.BytesIO(raw)).convert('RGBA')for n,raw in raws.items()}
width=1024;x=y=row=0;new={};out=R/'web/assets/stage5-catapult';out.mkdir(exist_ok=True)
for k in keys:
 f=frames[k];w,h=f['q'][2:]
 if x+w+2>width:x=0;y+=row+2;row=0
 new[k]={**f,'a':'../stage5-catapult/sprites.webp','q':[x,y,w,h]};x+=w+2;row=max(row,h)
im=Image.new('RGBA',(width,y+row+2))
for k in keys:
 f=frames[k];x,y,w,h=f['q'];im.paste(images[f['a']].crop((x,y,x+w,y+h)),tuple(new[k]['q'][:2]))
path=out/'sprites.webp';im.save(path,lossless=True,exact=True,method=6);check=Image.open(path).convert('RGBA')
for k in keys:
 f=frames[k];x,y,w,h=f['q'];nx,ny,_,_=new[k]['q'];assert check.crop((nx,ny,nx+w,ny+h)).tobytes()==images[f['a']].crop((x,y,x+w,y+h)).tobytes(),k
data={'templates':selected,'frames':new,'sheets':['../stage5-catapult/sprites.webp']}
(out/'catalog.json').write_text(json.dumps(data,sort_keys=True,separators=(',',':')))

paths=['kr3/data/levels/level05.lua','kr3/data/levels/level05_paths.lua','kr3/game_templates.lua','kr3/game_scripts.lua','all/scripts.lua','all/script_utils.lua','all/path_db.lua','all/utils.lua','all/constants.lua']
(R/'tools/sources/stage5-catapult.json').write_text(json.dumps({'sha256':{p:hashlib.sha256((root/p).read_bytes()).hexdigest()for p in paths},'imageSHA256':{k.replace('.webp','.png'):hashlib.sha256(v).hexdigest()for k,v in raws.items()},'rules':rules,'portrait':{'frame':c['frames']['portraits_sc_0051'],'sourcePngSHA256':hashlib.sha256(z.read('assets/kr3-phone/images/iphonehd/gui_portraits-1.png')).hexdigest(),'browserSHA256':hashlib.sha256((R/'web/assets/ui/portraits_sc_0051.webp').read_bytes()).hexdigest()},'frames':len(keys),'rgbaVerified':True,'ranges':[x[1]for x in checks],'scope':'original schedule/forward-stop-reverse, ranged episode, dedicated enemy_bomb and impact','limits':['Native coroutine/queued entity damage ordering adapted to World ticks','Full Alleria, prebuilt garrison, original special death/blood/pop/audio and modifier production pending','Only health-bearing World units participate in target enumeration; full native global entity enumeration pending']},sort_keys=True,indent=2)+'\n')
print('Stage5 catapult group',len(keys),'frames',path.stat().st_size,'bytes')
