"""Read original template declarations and marker constants, without running controllers."""
import json,pathlib,subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1]
templates=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_templates.lua'),str(ROOT/'reference/apk/assets/gc64')],cwd=ROOT))
sizes=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_marker_rules.lua')],cwd=ROOT))
keys=['decal_entity_marker_'+name for name in ['soldier_small','small','med','big']]
data={'sizes':sizes,'templates':{k:templates[k]for k in keys}}
(ROOT/'web/marker-data.mjs').write_text('// Generated original marker declarations; scripts.lua356–418 supplies lifecycle.\nexport default '+json.dumps(data,sort_keys=True,separators=(',',':'))+';\n')
