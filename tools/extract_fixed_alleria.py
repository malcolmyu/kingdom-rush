"""Original fixed Alleria declarations; controller bytecode is inspected, never executed."""
import hashlib,json,pathlib,subprocess
R=pathlib.Path(__file__).resolve().parents[1];root=R/'reference/apk/assets/gc64'
pin=R/'tools/sources/fixed-alleria.json'
if pin.exists():
 for file,digest in json.loads(pin.read_text()).get('sha256',{}).items():assert hashlib.sha256((root/file).read_bytes()).hexdigest()==digest,('Pinned source changed',file)
checks=[('all/systems.lua','systems.lua:1865-2058',['health_bar','hidden','frames']),('all/utils.lua','utils.lua:794-857',['predict_enemy_node_advance','vis','flags']),('kr3/game_scripts.lua','game_scripts.lua:8171-8174',['838','491','125','1.368','540','357','75']),('kr3/game_scripts.lua','game_scripts.lua:8176-8180',['attack_order','ranged']),('kr3/game_scripts.lua','game_scripts.lua:8182-8279',['fixed_mode','cat_pos','y_soldier_ranged_attacks','pos','health_bar','hidden']),('kr3/game_scripts.lua','game_scripts.lua:8284-8302',['extra_arrows','clone_entity']),('kr3/game_scripts.lua','game_scripts.lua:8307-8371',['toStand','soldier_idle']),('kr3/data/levels/level06.lua','level06.lua:48-151',['hero_alleria_fixed','660','625','640','655']),('all/script_utils.lua','script_utils.lua:1170-1205',['chance','filter_fn','node_prediction']),('all/script_utils.lua','script_utils.lua:1207-1248',['forced_ts','ts']),('all/script_utils.lua','script_utils.lua:1084-1167',['shoot_time','max_track_distance','is_stunned'])]
for file,mark,fields in checks:
 b=subprocess.check_output(['/opt/homebrew/bin/luajit','-bl',str(root/file)],text=True);i=b.index('-- BYTECODE -- '+mark);j=b.find('-- BYTECODE --',i+15)
 for f in fields:assert f in b[i:j],(mark,f)
t=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/read_templates.lua',str(root),'precise'],cwd=R))
selected={k:t[k]for k in ['hero_alleria_fixed','arrow_hero_alleria_fixed','arrow_multishot_hero_alleria_fixed']}
h=selected['hero_alleria_fixed'];assert h['fixed_mode']and h['health']['ignore_damage']and not h['ui']['can_select'];assert h['vis']['bans']==4294967295
assert selected['arrow_multishot_hero_alleria_fixed']['extra_arrows']==3
rules={'pos':{'x':660,'y':625},'catPos':{'x':640,'y':655},'regions':[[838,491,125,1.368],[540,357,75,1]]}
(R/'web/fixed-alleria-data.mjs').write_text('// Original declarations; only bytecode inspection, no controller execution.\nexport default '+json.dumps({'templates':selected,**rules},sort_keys=True,separators=(',',':'))+';\n')
files=sorted({p for p,_,_ in checks}|{'kr3/game_templates.lua','all/scripts.lua'})
proof={'sha256':{p:hashlib.sha256((root/p).read_bytes()).hexdigest()for p in files},'ranges':[m for _,m,_ in checks],'rules':rules,'templates':selected,'scope':'fixed stage6 shooter and fixed-position companion; no selectable hero/XP/HUD; source arrows via existing verified parabola adapter','limits':['Native queue/IDs/coroutine/foremost path scheduling adapted to World ticks','Idle flip, all particle/audio/blood-pop effects remain pending','Stage6 boss/spawner ending still pending; stage6 stays closed']}
(R/'tools/sources/fixed-alleria.json').write_text(json.dumps(proof,sort_keys=True,indent=2)+'\n');print('Fixed Alleria source controller/region/declaration audit passed')
