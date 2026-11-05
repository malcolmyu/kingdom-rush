"""Audit APK blighter/plant source without executing any controller."""
import hashlib,json,pathlib,subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1]
paths=['kr3/game_scripts.lua','kr3/game_templates.lua','all/systems.lua']
bc=subprocess.check_output(['/opt/homebrew/bin/luajit','-bl',str(ROOT/'reference/apk/assets/gc64/kr3/game_scripts.lua')],text=True)
for marker,fields in [('game_scripts.lua:8647-8723',['cast_time','animation','mod']),('game_scripts.lua:15685-15717',['block_count','duration','blocked'])]:
 start=bc.index('-- BYTECODE -- '+marker);end=bc.find('-- BYTECODE --',start+15);section=bc[start:end]
 for field in fields:assert '"'+field+'"' in section,field
systems=subprocess.check_output(['/opt/homebrew/bin/luajit','-bl',str(ROOT/'reference/apk/assets/gc64/all/systems.lua')],text=True)
for field in ['resets_same','resets_same_tween','modifier']:assert '"'+field+'"'in systems
c=json.loads((ROOT/'web/assets/expansion/catalog.json').read_text())['templates']
data={'sourceSha256':{p:hashlib.sha256((ROOT/'reference/apk/assets/gc64'/p).read_bytes()).hexdigest() for p in paths},'templates':{k:c[k]for k in ['enemy_gnoll_blighter','mod_gnoll_blighter']},'scope':'timed plant suppression only; ranged energy projectile remains pending','notes':['sys.mod_lifecycle refuses same-level duplicate, resetting only modifier.ts; running U.y_wait and tween do not restart','Plant object references are isolated from enemy numeric IDs','Original plant exits blocked state by restarting its loading cooldown; complete native plant FX/notification loop remains pending']}
(ROOT/'tools/sources/blight.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print('APK timed attack and plant modifier audited; controllers not executed')
