"""Audit original declarations/bytecode; gameplay controllers are never run."""
import pathlib,subprocess,json,hashlib
ROOT=pathlib.Path(__file__).resolve().parents[1];base=ROOT/'reference/apk/assets/gc64'
templates=json.loads(subprocess.check_output(['luajit','tools/read_templates.lua',str(base)],cwd=ROOT))
def section(path,label):
 log=subprocess.check_output(['luajit','-bl',str(base/path)],text=True)
 return log.split('-- BYTECODE -- '+label)[1].split('-- BYTECODE --')[0]
tween=section('all/systems.lua','systems.lua:1288-1386')
for field in ['keys','ts','interp','name','sprites']:
 assert '"'+field+'"'in tween,field
gold=section('all-phone/game_gui.lua','game_gui.lua:1081-1102')
assert '"hand_of_midas_factor"'in gold and '"WaveRewardFx"'in gold
assert '0006    JMP' in gold and '0088 => RET0' in gold
data={'scope':'four current construction scale tweens; ordinary kill has no floating gold without Hand of Midas',
 'sources':{p:hashlib.sha256((base/p).read_bytes()).hexdigest()for p in ['all/systems.lua','all-phone/game_gui.lua','all/render_utils.lua','all/scripts.lua']},
 'systemsTween':[1288,1386],'renderParams':[31,52],'enemyGoldGui':[1081,1102],'healthReward':[939,1104],'ordinaryKillPopup':'none; Hand of Midas is separate and unsupported',
 'build':{k:{'sprite':templates[k]['render']['sprites'][3],'tween':templates[k]['tween']}for k in ['tower_build_archer','tower_build_barrack','tower_build_mage','tower_build_rock_thrower']}}
(ROOT/'tools/sources/construction-feedback.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
