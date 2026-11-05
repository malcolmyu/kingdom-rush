"""Audit original render sorting bytecode without executing any controller."""
import pathlib,subprocess,json,hashlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
p=ROOT/'reference/apk/assets/gc64/all/systems.lua'
log=subprocess.check_output(['luajit','-bl',str(p)],cwd=ROOT,text=True)
section=log.split('-- BYTECODE -- systems.lua:1986-2029')[1].split('-- BYTECODE --')[0]
for name in ['sort_y','sort_y_offset','draw_order','pos','x','y','z']:
 if '"'+name+'"'not in section:raise RuntimeError('Missing original sort field '+name)
r=json.loads(subprocess.check_output(['luajit','tools/read_render_order.lua'],cwd=ROOT));r['source']={'path':'all/systems.lua','sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'sortLines':[1986,2029]}
(ROOT/'web/render-order-data.mjs').write_text('// Generated from original constants and audited read-only render bytecode.\nexport default '+json.dumps(r,sort_keys=True,separators=(',',':'))+';\n')
