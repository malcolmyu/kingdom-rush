"""Read original declarations and audit bytecode; never run systems/scripts."""
import pathlib,subprocess,json,hashlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
base=ROOT/'reference/apk/assets/gc64'
templates=json.loads(subprocess.check_output(['luajit','tools/read_templates.lua',str(base)],cwd=ROOT))
p=base/'all/systems.lua';log=subprocess.check_output(['luajit','-bl',str(p)],text=True)
section=log.split('-- BYTECODE -- systems.lua:633-802')[1].split('-- BYTECODE --')[0]
for field in ['fx_tower_sell_dust','fx_tower_buy_dust','hide_dust','build_animation']:
 assert '"'+field+'"'in section,field
assert '; 35' in section and '; 10' in section
catalog=json.loads((ROOT/'web/assets/catalog.json').read_text())
counts={}
for name in ['tower_build_dust','tower_sell_dust']:
 a=catalog['animations'][name];counts[name]=a['to']-a['from']+1;assert counts[name]==12
data={'frameCounts':counts,'templates':{k:templates[k]for k in ['fx_tower_buy_dust','fx_tower_sell_dust']},'source':{'path':'all/systems.lua','sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'lines':[633,802]},'buyOffset':10,'sellOffset':35}
(ROOT/'web/tower-effect-data.mjs').write_text('// Generated original declarations and read-only systems audit.\nexport default '+json.dumps(data,sort_keys=True,separators=(',',':'))+';\n')
