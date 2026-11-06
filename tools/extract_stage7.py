"""Original stage7 isolation package. No gameplay controller is executed."""
import hashlib,io,json,pathlib,re,struct,subprocess,sys,zipfile
R=pathlib.Path(__file__).resolve().parents[1];sys.path.insert(0,str(R.parent/'.tools/python'))
from PIL import Image
import texture2ddecoder
Z=zipfile.ZipFile(R.parent/'origins.apk');out=R/'web/assets/stage7';out.mkdir(exist_ok=True);pin=R/'tools/sources/stage7.json';old=json.loads(pin.read_text()) if pin.exists() else {};sha={}
def source(n):
 raw=Z.read(n);sha[n]=hashlib.sha256(raw).hexdigest();assert n not in old.get('sha256',{}) or sha[n]==old['sha256'][n],n;return raw
def declare(n):
 p=R/'reference/apk'/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(source(n));return json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/dump_lua.lua',str(p),'precise'],cwd=R))
root=R/'reference/apk/assets/gc64'
for n in ['kr3/game_scripts.lua','kr3/game_templates.lua','all/templates.lua','all/components.lua','all/scripts.lua','all/systems.lua','all/script_utils.lua','all/utils.lua','all/constants.lua','all/path_db.lua']:source('assets/gc64/'+n)
def audit(file,mark,terms):
 b=subprocess.check_output(['/opt/homebrew/bin/luajit','-bl',str(root/file)],text=True);i=b.index('-- BYTECODE -- '+mark);j=b.find('-- BYTECODE --',i+16);body=b[i:j]
 for s in terms:assert s in body,(mark,s)
audit('kr3/game_scripts.lua','game_scripts.lua:13141-13279',['PLANT_VENOM','wave_group_number','clicked','mods','find_foremost_enemy'])
audit('all/scripts.lua','scripts.lua:4598-4705',['damage_every','random','duration'])
audit('all/scripts.lua','scripts.lua:4973-4987',['max_speed','factor','invulnerable'])
audit('all/utils.lua','utils.lua:1124-1181',['poison_armor','DAMAGE_POISON','floor'])
audit('all/scripts.lua','scripts.lua:494-559',['ranged','tick_ts','attack_order'])
audit('all/scripts.lua','scripts.lua:616-664',['can_range_soldier','blockers','y_enemy_range_attacks'])
audit('all/script_utils.lua','script_utils.lua:2834-2895',['shoot_times','animations','queue_insert'])
audit('all/script_utils.lua','script_utils.lua:2897-2935',['random','chance','loops'])
audit('all/scripts.lua','scripts.lua:1947-1987',['predict_target_pos','prediction_error','initial_parabola_speed'])
audit('all/scripts.lua','scripts.lua:1989-2130',['unit_dodges','miss_decal','asymmetrical'])
satyr_functions=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/read_satyr_functions.lua',str(root),'precise'],cwd=R))
assert satyr_functions['knife_satyr']['insert']['__script_path']=='scripts.arrow.insert'
assert satyr_functions['enemy_satyr_cutthroat']['update']['__script_path']=='game_scripts.enemy_mixed.update'
audit('kr3/game_scripts.lua','game_scripts.lua:9376-9433',['count_groups','random','spawn_time','interrupt'])
audit('kr3/game_scripts.lua','game_scripts.lua:9382-9389',['can_do_magic','nodes_to_defend_point','spread_seed'])
audit('all/scripts.lua','scripts.lua:785-899',['keep_gold','initial_spawn_animation','random_cycle','check_node_valid','count_group_max'])
audit('all/systems.lua','systems.lua:1116-1130',['in_limbo','count-group-changed'])
audit('all/systems.lua','systems.lua:1136-1147',['COUNT_GROUP_CONCURRENT','in_limbo'])
audit('kr3/game_scripts.lua','game_scripts.lua:18716-18738',['sections','TERRAIN_FAERIE','ni'])
audit('kr3/game_scripts.lua','game_scripts.lua:18740-18858',['remove_modifiers','remove_auras','in_limbo','ignore_damage'])
audit('kr3/game_scripts.lua','game_scripts.lua:18864-18920',['next_entity_node','enemy_offset','ps_nav_faerie_red'])
audit('all/script_utils.lua','script_utils.lua:56-68',['queue_remove','entities'])
audit('all/path_db.lua','path_db.lua:378-401',['is_path_active','get_visible_start_node','invalid_ranges'])
hoplite_functions=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/read_hoplite_functions.lua',str(root),'precise'],cwd=R))
assert hoplite_functions['enemy_satyr_hoplite']['update']['__script_path']=='game_scripts.enemy_satyr_hoplite.update'
assert hoplite_functions['satyr_hoplite_spawner']['update']['__script_path']=='game_scripts.enemies_spawner.update'
hoplite_rules=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/read_hoplite_rules.lua'],cwd=R))
functions=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/read_pumpkin_functions.lua',str(root),'precise'],cwd=R))
assert functions['mod_plant_poison_pumpkin']['insert']['__script_path']=='scripts.mod_dps.insert'
assert functions['mod_plant_poison_pumpkin_slow']['update']['__script_path']=='scripts.mod_track_target.update'
base=json.loads((R/'web/assets/catalog.json').read_text());templates=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/read_templates.lua',str(root),'precise'],cwd=R));animations=base['animations'];selected={}
def visit(x):
 if isinstance(x,str) and x in templates and x not in selected:selected[x]=templates[x];visit(selected[x])
 elif isinstance(x,dict):
  for v in x.values():visit(v)
 elif isinstance(x,list):
  for v in x:visit(v)
strings=declare('assets/kr3-phone/strings/zh-Hans.lua')
raw=declare('assets/gc64/kr3/data/levels/level07_data.lua');paths=declare('assets/gc64/kr3/data/levels/level07_paths.lua')
for i,mode in enumerate(['campaign','heroic','iron'],1):
 waves=declare(f'assets/gc64/kr3/data/waves/level07_waves_{mode}.lua');level={**raw,'entities_list':[e for e in raw['entities_list'] if e.get('editor.game_mode',0) in [0,i]]}
 for e in level['entities_list']:visit(e['template'])
 for g in waves['groups']:
  for w in g['waves']:
   for s in w['spawns']:
    if s['max']>0:visit(s['creep'])
 d={'id':7,'title':strings['LEVEL_7_TITLE'],'mode':mode,'modeId':i,'level':level,'rules':raw['level_mode_overrides'][i-1],'paths':paths['paths'],'active':paths['active'],'connections':paths.get('connections',{}),'waves':waves,'map':'assets/stage7/map07.webp'}
 (out/f'07-{mode}.json').write_text(json.dumps(d,ensure_ascii=False,sort_keys=True,separators=(',',':')))
# Explicit source-created pumpkin effects, and actual shared combat/scenery roots.
for k in ['nav_faerie','fx_faerie_smoke','ps_nav_faerie_red','ps_nav_faerie_yellow','fx_plant_poison_pumpkin_idle','fx_plant_poison_pumpkin_smoke_left','fx_plant_poison_pumpkin_smoke_down','fx_plant_poison_pumpkin_smoke_fill']:visit(k)
runtime={}
for k in ['hero_elves_archer']+[f'tower_{f}_{t}'for f in ['archer','barrack','mage','rock_thrower']for t in [1,2,3]]+[k for k in templates if k.startswith(('re_current_','soldier_re_'))]:visit(k)
for name in ['domain.mjs','renderer.mjs','projectile-sprites.mjs','skill-effect-data.mjs','tower-effect-data.mjs','harasser-data.mjs','harasser-jump-data.mjs']:
 p=R/'web'/name;runtime[name]=hashlib.sha256(p.read_bytes()).hexdigest()
 for literal in re.findall(r"['\"]([a-zA-Z0-9_%-]+)['\"]",p.read_text()):visit(literal)
for name in ["stages/stage7.mjs","stages/satyr.mjs","stages/hoplite.mjs","stages/faerie.mjs"]:runtime[name]=hashlib.sha256((R/"web"/name).read_bytes()).hexdigest()
wanted=set()
def render_keys(obj):
 if isinstance(obj,dict):
  for s in obj.get('render',{}).get('sprites',[]):
   v=s.get('prefix') or s.get('name','');wanted.add(v)
   # Full animation aliases, not only idle or physical prefix coincidence.
   wanted.update(a['prefix'] for k,a in animations.items() if k==v or k.startswith(v+'_'))
  for v in obj.values():render_keys(v)
 elif isinstance(obj,list):
  for v in obj:render_keys(v)
render_keys(selected)
for n in ['skill-effect-data.mjs','tower-effect-data.mjs']:render_keys(json.loads((R/'web'/n).read_text().split('export default ',1)[1].strip().removesuffix(';')))
provided=set()
for group in ['tower-groups/entry','arcane','blade','wild-magus']:
 provided.update(json.loads((R/f'web/assets/{group}/catalog.json').read_text())['frames'])
frames={};images={}
def image(n):
 if n not in images:
  b=source('assets/kr3-phone/images/iphonehd/'+n)
  if n.endswith('.pkm'):
   fmt,w,h,ow,oh=struct.unpack('>5H',b[6:16]);assert fmt==0;images[n]=Image.frombytes('RGBA',(w,h),texture2ddecoder.decode_etc1(b[16:],w,h),'raw','BGRA').crop((0,0,ow,oh))
  else:images[n]=Image.open(io.BytesIO(b)).convert('RGBA')
 return images[n]
for n in sorted(Z.namelist()):
 if not(n.startswith('assets/kr3-phone/images/iphonehd/go_') and n.endswith('.lua') and '_bg.' not in n):continue
 # Atlas declarations only; no controllers.
 p=R/'reference/apk'/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(Z.read(n));atlas=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/dump_lua.lua',str(p),'precise'],cwd=R))
 used=False
 for k,f in atlas.items():
  names=[k,*f.get('alias',[])];need=n.endswith('go_stage07.lua') or any(any(a==v or a.startswith(v+'_') or ('%04i' in v and a.startswith(v.split('%04i')[0])) for v in wanted) for a in names)
  if not need:continue
  # Existing hero/tower/enemy atlases retain their dedicated runtime groups.
  if n.endswith('go_hero_elves_archer.lua'):continue
  if n.endswith('go_towers.lua'):
   names=[k for k in names if k not in provided]
   if not names:continue
  used=True
  for key in names:frames[key]={'a':f['a_name'],'q':f['f_quad'],'size':f['size'],'trim':f['trim']}
 if used:source(n)
width=2048;x=y=row=0;tiles={};result={}
for k,f in sorted(frames.items()):
 qx,qy,w,h=f['q'];im=image(f['a']).crop((qx,qy,qx+w,qy+h));hsh=(im.size,hashlib.sha256(im.tobytes()).hexdigest())
 if hsh not in tiles:
  if x+w+2>width:x=0;y+=row+2;row=0
  tiles[hsh]=(x,y,im);x+=w+2;row=max(row,h)
 px,py,_=tiles[hsh];result[k]={**f,'a':'../stage7/sprites.webp','q':[px,py,w,h]}
atlas=Image.new('RGBA',(width,y+row+2))
for x,y,im in tiles.values():atlas.paste(im,(x,y))
p=out/'sprites.webp';atlas.save(p,lossless=True,exact=True,method=6);check=Image.open(p).convert('RGBA')
for x,y,im in tiles.values():assert check.crop((x,y,x+im.width,y+im.height)).tobytes()==im.tobytes()
bg=declare('assets/kr3-phone/images/iphonehd/go_stage07_bg.lua');f=next(iter(bg.values()));x,y,w,h=f['f_quad'];im=image(f['a_name']).crop((x,y,x+w,y+h));im.save(out/'map07.webp',lossless=True,exact=True,method=6);assert Image.open(out/'map07.webp').convert('RGBA').tobytes()==im.tobytes()
faerie_rules=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/read_faerie_rules.lua'],cwd=R));assert faerie_rules=={'terrain':1024,'small':1}
satyr_rules=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/read_satyr_rules.lua'],cwd=R));satyr_rules['grid']=declare('assets/gc64/kr3/data/levels/level07_grid.lua')
rules=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/read_pumpkin_rules.lua'],cwd=R));assert rules['poison']==32 and rules['modifierDamage']==32768
(out/'catalog.json').write_text(json.dumps({'templates':selected,'frames':result,'sheets':['../stage7/sprites.webp'],'rules':rules,'satyrRules':satyr_rules,'hopliteRules':hoplite_rules,'faerieRules':faerie_rules},sort_keys=True,separators=(',',':')))
proof={'sha256':dict(sorted(sha.items())),'functions':functions,'satyrFunctions':satyr_functions,'hopliteFunctions':hoplite_functions,'rgbaVerified':True,'frames':len(result),'bytes':p.stat().st_size,'runtimeModulesSHA256':runtime,'rules':rules,'scope':'isolated stage7 declaration, poison-pumpkin and satyr dual knife and hoplite summon and faerie transport gameplay; source controllers bytecode-only; stage7 remains closed','pending':['full faerie native particle and generic modifier engine','webspitting spider special','new allowed Druid advanced tower','natural modes, own budget and actual flag/book/rewards release']}
pin.write_text(json.dumps(proof,ensure_ascii=False,sort_keys=True,indent=2)+'\n');print(json.dumps({'frames':len(result),'bytes':p.stat().st_size,'stage7':'isolated, not released'}))
