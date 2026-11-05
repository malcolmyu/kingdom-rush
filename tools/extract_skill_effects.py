"""Select original declarations; controller functions are inspected, not run."""
import pathlib,subprocess,json,hashlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
base=ROOT/'reference/apk/assets/gc64'
templates=json.loads(subprocess.check_output(['luajit','tools/read_templates.lua',str(base)],cwd=ROOT))
keys=['fx_power_thunder_1','fx_power_thunder_2','fx_power_thunder_explosion','fx_power_thunder_explosion_decal','decal_hero_elves_archer_ultimate']
p=base/'kr3/game_scripts.lua'
log=subprocess.check_output(['luajit','-bl',str(p)],text=True)
section=log.split('-- BYTECODE -- game_scripts.lua:16414-16458')[1].split('-- BYTECODE --')[0]
for field in ['image_h','scale','flip_x','REF_H','fx_power_thunder_explosion','fx_power_thunder_explosion_decal']:
    assert '"'+field+'"'in section,field
data={'templates':{k:templates[k]for k in keys},'source':{'path':'kr3/game_scripts.lua','sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'thunderLines':[16414,16458],'arrowInsertLines':[3113,3118]}}
(ROOT/'web/skill-effect-data.mjs').write_text('// Generated original declarations and read-only controller audit.\nexport default '+json.dumps(data,sort_keys=True,separators=(',',':'))+';\n')
