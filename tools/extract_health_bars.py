"""Read constants and audit controller bytecode; never execute systems.lua."""
import hashlib,json,pathlib,subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1]
p=ROOT/'reference/apk/assets/gc64/all/systems.lua'
log=subprocess.check_output(['luajit','-bl',str(p)],cwd=ROOT,text=True)
for field in ['HEALTH_BAR_SIZES','HEALTH_BAR_COLORS','HEALTH_BAR_CORNER_DOT_QUAD','black_bar_hp','bar_width','sort_y_offset']:
    assert '"'+field+'"' in log,field
data=json.loads(subprocess.check_output(['luajit','tools/read_health_bar_rules.lua'],cwd=ROOT))
data['source']={'path':'all/systems.lua','sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'initLines':[1729,1737],'insertLines':[1739,1845],'updateLines':[1865,2058]}
(ROOT/'web/health-bar-data.mjs').write_text('// Generated original constants; systems controller audited read-only.\nexport default '+json.dumps(data,sort_keys=True,separators=(',',':'))+';\n')
