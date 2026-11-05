"""Audit paid ewok hut transaction declarations; never execute controllers."""
import json,hashlib,pathlib,subprocess,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
checks=[('all/scripts.lua','scripts.lua:1864-1939',['unit_bought','unit','price','door_open','soldiers']),('kr3/game_scripts.lua','game_scripts.lua:17402-17482',['y_soldier_death','animation_start']),('all/utils.lua','utils.lua:1010-1023',['soldiers','rally_pos','rally_radius']),('all/systems.lua',None,['upgrade_to','spent','player_gold'])]
for path,marker,fields in checks:
 bc=subprocess.check_output(['/opt/homebrew/bin/luajit','-bl',str(ROOT/'reference/apk/assets/gc64'/path)],text=True)
 if marker:
  start=bc.index('-- BYTECODE -- '+marker);end=bc.find('-- BYTECODE --',start+15);bc=bc[start:end]
 for f in fields:assert f in bc,(marker,f)
paths=['all/scripts.lua','kr3/game_scripts.lua','all/utils.lua','all/systems.lua','kr3/game_templates.lua','all-phone/game_gui.lua']
templates=json.loads((ROOT/'web/assets/expansion/catalog.json').read_text())['templates']
data={'sourceSha256':{p:hashlib.sha256((ROOT/'reference/apk/assets/gc64'/p).read_bytes()).hexdigest()for p in paths},'templates':{k:templates[k]for k in ['tower_ewok_holder','tower_ewok','soldier_ewok']},'menus':{k:json.loads((ROOT/'web/assets/ui/layouts.json').read_text())['layouts']['towerMenu']['menus'][k]for k in ['holder_ewok','ewok']},'scope':'holder repair and individually purchased, non-respawning mercenaries; shared current combat adapter','limitations':['Full original spear physics remains pending; shield audit is tools/sources/ewok-shield.json','Native scheduler and insertion queue are adapted, not source insert ID stream','Complete special death/blood pool remains pending']}
c=json.loads((ROOT/'web/assets/catalog.json').read_text());frame=c['frames']['portraits_towers_0013'];data['portrait']={'originalPngSha256':hashlib.sha256(zipfile.ZipFile(ROOT.parent/'origins.apk').read('assets/kr3-phone/images/iphonehd/'+frame['a'].replace('.webp','.png'))).hexdigest(),'frame':frame,'atlasSha256':hashlib.sha256((ROOT/'web/assets/images'/frame['a']).read_bytes()).hexdigest(),'browserSha256':hashlib.sha256((ROOT/'web/assets/ui/portraits_towers_0013.webp').read_bytes()).hexdigest()}
(ROOT/'tools/sources/ewok-hut.json').write_text(json.dumps(data,indent=2)+'\n')
print('Original ewok holder, paid mercenary update, formation and non-revive death audited')
