"""Original stage4 controller audit and data-only declarations."""
import hashlib,json,pathlib,subprocess
R=pathlib.Path(__file__).resolve().parents[1];root=R/'reference/apk/assets/gc64'
def run(*args):return subprocess.check_output(['/opt/homebrew/bin/luajit',*args],cwd=R,text=True)
b=run('-bl',str(root/'kr3/data/levels/level04.lua'))
for mark,fields in [('level04.lua:22-27',['activate_path']),('level04.lua:29-53',['wave_group_number','y_burn_zone','KSHORT   3   5','KSHORT   3  10']),('level04.lua:69-196',['time_offset','activate_path','can_hover','Z_DECALS','enemy_gnoll_burner','nearest_nodes'])]:
 i=b.index('-- BYTECODE -- '+mark);j=b.find('-- BYTECODE --',i+15)
 for field in fields:assert field in b[i:j],(mark,field)
all_t=json.loads(run('tools/read_templates.lua',str(root),'precise'))
keys=['decal_gnoll_burner','torch_gnoll_burner','fx_torch_gnoll_burner_explosion_stage04','fx']
data={'rules':json.loads(run('tools/read_stage4_burn.lua')),'templates':{k:all_t[k] for k in keys}}
(R/'web/stage4-burn-data.mjs').write_text('// Original declarations and inspected prototype constants.\nexport default '+json.dumps(data,sort_keys=True,separators=(',',':'))+';\n')
paths=['kr3/data/levels/level04.lua','kr3/data/levels/level04_data.lua','kr3/game_templates.lua','all/scripts.lua','all/path_db.lua','all/constants.lua']
rules=json.loads((R/'web/assets/expansion/04-campaign.json').read_text())['rules']
(R/'tools/sources/stage4-burn.json').write_text(json.dumps({'sha256':{p:hashlib.sha256((root/p).read_bytes()).hexdigest()for p in paths},'rules':data['rules'],'towerAudit':{'locked':rules['locked_towers'],'availableAdvanced':['tower_arcane'],'implementedAdvanced':[]},'scope':'campaign wave5/10 burn zones, original scenery timing, paths3/4 and holder24, scripted arsonist joining combat','limits':['Native coroutine and entity insertion order adapted to World ticks','Tower arcane and complete advanced tower implementation pending','Source audio cues and full grid/path target production remain pending']},indent=2,sort_keys=True)+'\n')
print('Original stage4 wave5/10 burn/holder/path audit passed; arcane remains unimplemented')
