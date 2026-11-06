"""Data declarations/prototype constants and read-only controller audit."""
import pathlib,json,hashlib,subprocess
R=pathlib.Path(__file__).resolve().parents[1];root=R/'reference/apk/assets/gc64'
def run(*args):return subprocess.check_output(['/opt/homebrew/bin/luajit',*args],cwd=R,text=True)
checks=[('lib/klove/animation_db.lua','animation_db.lua:110-163',['ceil','fps','1e-09']),('kr3/data/levels/level06.lua','level06.lua:22-46',['gryphon_waves']),('kr3/data/levels/level06.lua','level06.lua:48-151',['gryphon_controller','wave_group_number','eb_gnoll']),('kr3/game_scripts.lua','game_scripts.lua:17650-17784',['newBezierCurve','initial_curve_id','land_curve_id','ui','clicked','initial_impulse']),('kr3/game_scripts.lua','game_scripts.lua:17789-17828',['max_speed','damage_radius','hit_decal','hit_fx']),('kr3/game_scripts.lua','game_scripts.lua:17833-17860',['wave','delay','cooldown','decal_gryphon'])]
for p,mark,fields in checks:
 b=run('-bl',str(root/p));i=b.index('-- BYTECODE -- '+mark);j=b.find('-- BYTECODE --',i+15)
 for f in fields:assert f in b[i:j],(mark,f)
all_t=json.loads(run('tools/read_templates.lua',str(root),'precise'))
keys=['decal_gryphon','decal_gryphon_sign','bullet_gryphon','fx_bolt_gryphon_hit','decal_bomb_crater']
data={'templates':{k:all_t[k] for k in keys},'waves':json.loads(run('tools/read_gryphon_waves.lua')),'curves':json.loads(run('tools/dump_lua.lua',str(root/'kr3/data/levels/level06_paths.lua'),'precise'))['curves'][4:10]}
(R/'web/gryphon-event-data.mjs').write_text('// Original declarations and prototype constants, controllers never executed.\nexport default '+json.dumps(data,sort_keys=True,separators=(',',':'))+';\n')
files=sorted(set([p for p,_,_ in checks]+['kr3/game_templates.lua','kr3/data/levels/level06_paths.lua','all/path_db.lua']))
(R/'tools/sources/gryphon-events.json').write_text(json.dumps({'sha256':{p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in files},'ranges':[m for _,m,_ in checks],'waves':data['waves'],'scope':'wave-gated two-sided fly/attack/approach/land/click/takeoff loop, dedicated bolt and impact','limits':['Native entity insertion/coroutine and damage queue ordering adapted to World ticks','Level06 Alleria/spawner/jailed boss ending not implemented','UI audio events and complete modifier/visibility production chain pending']},sort_keys=True,indent=2)+'\n')
print('Gryphon declarations/prototype wave constants/controller audit passed')
