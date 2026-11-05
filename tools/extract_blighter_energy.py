"""Read declarations and audit controller bytecode; never execute controllers."""
import hashlib,json,pathlib,subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1]
lj='/opt/homebrew/bin/luajit'
data=json.loads(subprocess.check_output([lj,'tools/read_blighter_energy.lua'],cwd=ROOT))
checks=[('all/scripts.lua','scripts.lua:494-559',['ranged','attacks','tick_ts','ts']),('kr3/game_scripts.lua','game_scripts.lua:14118-14159',['min_speed','acceleration_factor','max_speed','animation_start','hitUpDown','create_bullet_damage']),('all/script_utils.lua','script_utils.lua:2784-2832',['shoot_time','bullet_start_offset','hit_offset','queue_insert']),('all/script_utils.lua','script_utils.lua:367-387',['frandom','ceil','damage_type']),('all/utils.lua','utils.lua:245-313',['angles','angles_stickiness'])]
for path,marker,fields in checks:
 bc=subprocess.check_output([lj,'-bl',str(ROOT/'reference/apk/assets/gc64'/path)],text=True);start=bc.index('-- BYTECODE -- '+marker);end=bc.find('-- BYTECODE --',start+15);bc=bc[start:end]
 for f in fields:assert ('"'+f+'"'in bc or f=='queue_insert' and '; queue_insert' in bc),(marker,f)
data['sourceSha256']={p:hashlib.sha256((ROOT/'reference/apk/assets/gc64'/p).read_bytes()).hexdigest()for p in ['kr3/game_scripts.lua','all/script_utils.lua','all/utils.lua','all/constants.lua','kr3/game_templates.lua','all/scripts.lua']}
data['scope']='blighter energy ranged episode and dedicated accelerating projectile, ordinary defender damage only'
data['limitations']=['World scheduler and entity insertion/damage queues are adapted, not original same-input coroutine stream','Original defender damage rounding and modifier producer completeness remain existing limits','No generic hit_fx or burner fire DOT is created by this dedicated controller']
(ROOT/'tools/sources/blighter-energy.json').write_text(json.dumps(data,indent=2)+'\n')
(ROOT/'web/blighter-energy-data.mjs').write_text('// Generated from original declaration constants and read-only bytecode audit.\nexport default '+json.dumps(data,separators=(',',':'))+';\n')
print('Original blighter energy, ranged, damage and facing bytecode audited')
