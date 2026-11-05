"""Audit the original ewok can_dodge closure and shield coroutine, never run them."""
import json,pathlib,hashlib,subprocess
R=pathlib.Path(__file__).resolve().parents[1]
checks=[('kr3/game_templates.lua','game_templates.lua:14032-14035',['last_hit_ts','hp_max','0.5']),('kr3/game_scripts.lua','game_scripts.lua:17402-17482',['animation_start','animation_hit','animation_end','duration','ts']),('all/script_utils.lua','script_utils.lua:138-157',['DAMAGE_NO_DODGE','last_check_ts','last_doge_ts','can_dodge','random']),('all/scripts.lua','scripts.lua:1989-2130',['unit_dodges','create_bullet_damage'])]
for path,mark,fields in checks:
 b=subprocess.check_output(['/opt/homebrew/bin/luajit','-bl',str(R/'reference/apk/assets/gc64'/path)],text=True);i=b.index('-- BYTECODE -- '+mark);j=b.find('-- BYTECODE --',i+15);part=b[i:j]
 for f in fields:assert f in part,(path,f)
c=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/read_ewok_shield.lua'],cwd=R))
(R/'web/ewok-shield-data.mjs').write_text('// Original declarative constants; see tools/sources/ewok-shield.json.\nexport default '+json.dumps(c)+';\n')
d={'sha256':{p:hashlib.sha256((R/'reference/apk/assets/gc64'/p).read_bytes()).hexdigest() for p in [x[0] for x in checks]+['all/constants.lua']},'ranges':[x[1] for x in checks],'canDodge':'records last_hit_ts, returns hp <= hp_max*.5; helper draws chance BEFORE predicate, strict time-ts>cooldown','scope':'ewok-only melee and ordinary torch arrow callers; dedicated blighter energy and existing burn damage bypass dodge','limits':['Native coroutine/queued damage timing and complete modifier producer chain remain adapted','Spear still uses existing friendly projectile adapter, not original prediction/parabola']}
(R/'tools/sources/ewok-shield.json').write_text(json.dumps(d,indent=2)+'\n')
print('Ewok original half-HP predicate, shield phases and attack caller audit passed')
