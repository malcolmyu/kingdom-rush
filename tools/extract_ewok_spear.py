"""Read-only original spear controller audit. No controller execution."""
import json,hashlib,pathlib,subprocess
R=pathlib.Path(__file__).resolve().parents[1]
checks=[('all/scripts.lua','scripts.lua:1947-1987',['reset_to_target_pos','predict_target_pos','speed','flight_time','hidden']),('all/scripts.lua','scripts.lua:1989-2130',['last_pos','position_in_parabola','angleTo','hit_distance','unit_dodges','create_bullet_damage']),('all/script_utils.lua','script_utils.lua:389-394',['0.5','time']),('all/script_utils.lua','script_utils.lua:396-401',['speed']),('all/script_utils.lua','script_utils.lua:367-387',['ceil','frandom']),('all/script_utils.lua','script_utils.lua:1084-1167',['max_track_distance','bullet_start_offset','shoot_time'])]
# Some local variable names do not survive bytecode; validate actual op fields.
checks[2]=(checks[2][0],checks[2][1],['0.5','DIVVV']);checks[3]=(checks[3][0],checks[3][1],['MULVV','ADDVV'])
for path,mark,fields in checks:
 b=subprocess.check_output(['/opt/homebrew/bin/luajit','-bl',str(R/'reference/apk/assets/gc64'/path)],text=True);i=b.index('-- BYTECODE -- '+mark);j=b.find('-- BYTECODE --',i+15);part=b[i:j]
 for f in fields:assert f in part,(mark,f)
t=json.loads((R/'web/assets/expansion/catalog.json').read_text())['templates']
d={'sha256':{p:hashlib.sha256((R/'reference/apk/assets/gc64'/p).read_bytes()).hexdigest() for p in ['all/scripts.lua','all/script_utils.lua','kr3/game_templates.lua']},'ranges':[v[1] for v in checks],'templates':{k:t[k] for k in ['bullet_soldier_ewok']},'scope':'Ewok-only fixed predicted destination, original parabola, tick displacement tangent, strict distance contact and ceil(frandom) at contact','limitations':['Target motion is measured from current World simulation ticks, not a recovered native motion/controller scheduler','Original ranged target selection/insert queue ordering remain adapted','Blood/pop/water miss effects and target dodge controller for future harassers remain pending']}
(R/'tools/sources/ewok-spear.json').write_text(json.dumps(d,indent=2)+'\n');print('Original ewok spear arrow/parabola/contact audit passed')
