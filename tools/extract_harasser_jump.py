"""Read original path/grid declarations and audit jump controllers, never execute them."""
import json,pathlib,hashlib,subprocess,math
R=pathlib.Path(__file__).resolve().parents[1];root=R/'reference/apk/assets/gc64'
rules=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/read_harasser_jump.lua'],cwd=R))
files=['all/game.lua','all/constants.lua','all/grid_db.lua','all/path_db.lua','all/scripts.lua','all/script_utils.lua','kr3/game_scripts.lua']
checks=[('all/scripts.lua','scripts.lua:494-559',['ranged','tick_ts']),('all/grid_db.lua','grid_db.lua:193-199',['ceil','clamp']),('all/script_utils.lua','script_utils.lua:138-157',['requires_magic','DAMAGE_NO_DODGE','random']),('kr3/game_scripts.lua','game_scripts.lua:8903-9021',['nodeslimit','TERRAIN_FAERIE','jumpOut','jumpIn','shadow_shot'])]
for p,mark,fields in checks:
 b=subprocess.check_output(['/opt/homebrew/bin/luajit','-bl',str(root/p)],text=True);i=b.index('-- BYTECODE -- '+mark);j=b.find('-- BYTECODE --',i+15)
 for f in fields:assert f in b[i:j],(mark,f)
 if mark=='scripts.lua:494-559':assert 'dodge' not in b[i:j]
faerie={}
for n in [4,5,6]:
 def read(suffix):
  p=f'kr3/data/levels/level{n:02}_{suffix}.lua';files.append(p);return json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/dump_lua.lua',str(root/p),'precise'],cwd=R))
 g=read('grid');paths=read('paths')['paths'];blocked=[]
 for road in paths:
  nodes=[]
  for i,p in enumerate(road[0]):
   x=max(1,min(len(g['grid']),math.ceil((p['x']-g['ox'])/16)));y=max(1,min(len(g['grid'][0]),math.ceil((p['y']-g['oy'])/16)))
   if g['grid'][x-1][y-1]&rules['faerie']:nodes.append(i)
  blocked.append(nodes)
 faerie[str(n)]=blocked
rules.update(endMargin=10,validMargin=1,validTopMargin=2)
data={'rules':rules,'faerie':faerie}
(R/'web/harasser-jump-data.mjs').write_text('// Original grid queries at center-lane nodes and constants; see source audit.\nexport default '+json.dumps(data,sort_keys=True,separators=(',',':'))+';\n')
(R/'tools/sources/harasser-jump.json').write_text(json.dumps({'sha256':{p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in files},'data':data,'scope':'melee dodge trigger, source node and Faerie checks, jump phases/unblock/visibility restore/shadow arrow','limits':['Path distance model and native queue scheduling remain adapted','Source viewport defaults to canonical4:3 unless caller passes viewportAspect; nonzero safearea not implemented','Dynamic terrain mutation and full modifier/auras lifecycle still pending','Power/AoE target filtering remains the existing adapter; current new-target bans cover tower/soldier/hero acquisition']},sort_keys=True,indent=2)+'\n')
print('Original harasser jump grid/node/phase audit passed', {k:sum(map(len,v)) for k,v in faerie.items()})
