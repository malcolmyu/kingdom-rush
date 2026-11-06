"""Original Wild Magus baseline declarations/art, with controller bytecode audits."""
import hashlib,json,pathlib,subprocess,sys,zipfile,io,re
R=pathlib.Path(__file__).resolve().parents[1];sys.path.insert(0,str(R.parent/'.tools/python'))
from PIL import Image
root=R/'reference/apk/assets/gc64'
def run(*a):return subprocess.check_output(['/opt/homebrew/bin/luajit',*a],cwd=R,text=True)
paths=['kr3/game_scripts.lua','kr3/game_templates.lua','all/templates.lua','all/scripts.lua','all/script_utils.lua','all/utils.lua','all/systems.lua','kr3/upgrades.lua','kr3/data/tower_menus_data.lua','all/constants.lua']
proof=R/'tools/sources/wild-magus.json';old=json.loads(proof.read_text())if proof.exists()else{}
sha={p:hashlib.sha256((root/p).read_bytes()).hexdigest()for p in paths};assert not old or all(sha[k]==v for k,v in old['sha256'].items())
b=run('-bl',str(root/'kr3/game_scripts.lua'));a=b.index('-- BYTECODE -- game_scripts.lua:520-697');e=b.find('-- BYTECODE --',a+20)
for key in ['damage_same_target_inc','damage_same_target_max','shoot_time','find_foremost_enemy','animation_name_facing_point']:assert key in b[a:e]
common=run('-bl',str(root/'all/scripts.lua'));a=common.index('-- BYTECODE -- scripts.lua:2921-2942');e=common.index('-- BYTECODE -- scripts.lua:3080-',a)
for key in ['acceleration_factor','max_track_distance','ceil','create_bullet_damage','F_RANGED']:assert key in common[a:e]
assert 'DAMAGE_EAT' in b[b.index('-- BYTECODE -- game_scripts.lua:14962-15047'):b.index('-- BYTECODE -- game_scripts.lua:15052-')]
assert 'max_track_distance' in common[common.index('-- BYTECODE -- scripts.lua:3248-3268'):common.index('-- BYTECODE -- scripts.lua:3371-')]
functions=json.loads(run('tools/read_wild_functions.lua',str(root),'precise'));assert functions['bolt_wild_magus']['update']['__script_path']=='scripts.bolt.update'
# game_scripts returns the shared require('scripts') table; ray_simple has no override.
assert functions['ray_wild_magus']['update']['__script_path']=='game_scripts.ray_simple.update'
assert '"ray_simple"' not in b
functions['ray_wild_magus']['inherited_from']='scripts.ray_simple.update'
assert functions['mod_eldritch']['update']['__script_path']=='game_scripts.mod_eldritch.update'
for name in ['mod_silence','mod_track_target']:
 assert '"'+name+'"' not in b # inherited common controller, no KR3 override
assert functions['mod_ward']['insert']['__script_path']=='game_scripts.mod_silence.insert'
functions['mod_ward']['inherited_from']=['scripts.mod_silence.insert','scripts.mod_silence.remove','scripts.mod_track_target.update']
assert 'can_accept_magic' in common[common.index('-- BYTECODE -- scripts.lua:4889-4912'):common.index('-- BYTECODE -- scripts.lua:4928-')]
rules=json.loads(run('tools/read_wild_magus_rules.lua'));assert rules['spellcaster']==2147483648;assert 'tower_wild_magus' in rules['rangeTargets'] and 'bolt_wild_magus' in rules['damageTargets']
t=json.loads(run('tools/read_templates.lua',str(root),'precise'));selected={k:t[k]for k in ['tower_wild_magus','bolt_wild_magus','fx_wild_magus_hit','ray_wild_magus','mod_eldritch','eldritch_enemy_decal','fx_ray_wild_magus_hit','fx_eldritch_explosion','mod_ward']}
assert selected['tower_wild_magus']['tower']['price']==300
assert selected['tower_wild_magus']['powers']['ward']['target_count']==[1,3,6]
assert selected['mod_ward']['modifier']['duration']==10
su=run('-bl',str(root/'all/script_utils.lua'));assert 'requires_magic' in su[su.index('-- BYTECODE -- script_utils.lua:2693-2756'):su.index('-- BYTECODE -- script_utils.lua:2758-')]
assert 'can_do_magic' not in su[su.index('-- BYTECODE -- script_utils.lua:2309-2325'):su.index('-- BYTECODE -- script_utils.lua:2331-')]
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
for template in selected.values():add(template.get('render',{})) # ban names are logic, not art dependencies
keys=sorted(keep);z=zipfile.ZipFile(R.parent/'origins.apk');raws={n:z.read('assets/kr3-phone/images/iphonehd/'+n.replace('.webp','.png'))for n in {frames[k]['a']for k in keys}};images={n:Image.open(io.BytesIO(raw)).convert('RGBA')for n,raw in raws.items()}
image_pins={**old.get('imageSha256',{}),**{n.replace('.webp','.png'):hashlib.sha256(raw).hexdigest()for n,raw in raws.items()}}
for name,digest in old.get('imageSha256',{}).items():assert hashlib.sha256(z.read('assets/kr3-phone/images/iphonehd/'+name)).hexdigest()==digest # retain historical pins without loading unused art
atlas_sha={name:hashlib.sha256(z.read('assets/kr3-phone/images/iphonehd/'+name)).hexdigest()for name in {re.sub(r'-[0-9]+$','',n[:-5])+'.lua'for n in raws}}
assert not old.get('atlasDeclarationSha256') or old['atlasDeclarationSha256']==atlas_sha
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
proof.write_text(json.dumps({'sha256':sha,'imageSha256':image_pins,'renderImageNames':sorted(n.replace('.webp','.png')for n in raws),'atlasDeclarationSha256':atlas_sha,'inputCatalogSha256':hashlib.sha256((R/'web/assets/catalog.json').read_bytes()).hexdigest(),'functions':functions,'ranges':['game_scripts520–697','scripts2921–3074','utils245–332','kr3/upgrades99–301 TDUP73/75','scripts3242–3353 with3248 closure','game_scripts14962–15047','systems939–1104 DAMAGE_EAT','scripts4889–4921 silence','scripts4263–4300 track_target','systems542–627 modifier bans/reset','game_scripts596–598 ward filter','game_scripts8647–8723 blighter','SU138–157/2309–2325/2693–2756/2937–3131 acquired ranged episode and dodge'],'frames':len(keys),'rgbaVerified':True,'scope':'Eldritch victim render snapshot uses current World render adaptation; full extra blood/pop/audio and generic modifier ban lifecycle remain pending. Source ordinary alternating-hand attack, same-target damage increments, generic bolt tracking/acceleration; eldritch ray/queued eat and delayed magic AOE implemented; ward queued silence, ban/removal and original visuals implemented. Particles, pop/blood/audio, native coroutine IDs/queues and higher global talents remain incomplete.'},indent=2,sort_keys=True)+'\n')
print('Wild Magus lossless lazy group',len(keys),'frames',path.stat().st_size,'bytes')
