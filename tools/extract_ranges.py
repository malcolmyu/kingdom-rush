"""Original range declarations; no game controllers executed."""
import json,pathlib,subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1]
t=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_templates.lua'),str(ROOT/'reference/apk/assets/gc64')],cwd=ROOT))
r=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_range_rules.lua')],cwd=ROOT))
r['templates']={k:t[k]for k in ['decal_tower_range','decal_rally_range']}
(ROOT/'web/range-data.mjs').write_text('// Generated original declarations; game_gui1950–1984 supplies placement/scaling.\nexport default '+json.dumps(r,sort_keys=True,separators=(',',':'))+';\n')
