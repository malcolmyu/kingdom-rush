"""Original harasser ranged declarations and bytecode audit; controllers never run."""
import json,hashlib,pathlib,subprocess
R=pathlib.Path(__file__).resolve().parents[1]
checks=[('kr3/game_scripts.lua','game_scripts.lua:8903-9021',['mod_twilight_elf_harasser','y_enemy_do_loopable_ranged_attack']),('kr3/game_scripts.lua','game_scripts.lua:14164-14167',['flight_time_range','frandom']),('all/script_utils.lua','script_utils.lua:2834-2895',['animations','shoot_time','animation_finished']),('all/scripts.lua','scripts.lua:1989-2130',['unit_dodges','hit_distance']),('all/scripts.lua','scripts.lua:4183-4202',['mark_flags','_prev_bans','vis_bans']),('all/scripts.lua','scripts.lua:4204-4216',['_prev_bans','vis_bans'])]
for p,mark,fields in checks:
 b=subprocess.check_output(['/opt/homebrew/bin/luajit','-bl',str(R/'reference/apk/assets/gc64'/p)],text=True);i=b.index('-- BYTECODE -- '+mark);j=b.find('-- BYTECODE --',i+15);part=b[i:j]
 for f in fields:assert f in part,(mark,f)
 if mark.endswith('2834-2895'):assert 'repeat_cooldown' not in part
all_t=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/read_templates.lua','reference/apk/assets/gc64','precise'],cwd=R))
# Data-only template extraction stubs all controller requires.
data={'mark':all_t['mod_twilight_elf_harasser']}
(R/'web/harasser-data.mjs').write_text('// Original mod declaration, see tools/sources/harasser.json.\nexport default '+json.dumps(data,sort_keys=True,separators=(',',':'))+';\n')
d={'sha256':{p:hashlib.sha256((R/'reference/apk/assets/gc64'/p).read_bytes()).hexdigest() for p in ['kr3/game_scripts.lua','all/script_utils.lua','all/scripts.lua','kr3/game_templates.lua']},'ranges':[x[1] for x in checks],'scope':'ranged start/four source loop animations/end, F_CUSTOM target mark, custom randomized flight arrow','limits':['Node/terrain-gated backjump and shadow shot pending','Original path movement, queued damage and insert ID schedule adapted','Blood/pop/water miss FX remain pending'],'mark':data['mark']}
(R/'tools/sources/harasser.json').write_text(json.dumps(d,sort_keys=True,indent=2)+'\n');print('Harasser original loop/arrow/controller and target-mark declarations audited')
