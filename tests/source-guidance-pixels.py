"""Independent pinned original PNG reference for browser decoder comparisons."""
import json,pathlib,hashlib,urllib.request,io,base64
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[1];s=json.loads((root/'tools/sources/desktop-guidance.json').read_text());p=root/'artifacts/kro-gui_tutorial-1.png';p.parent.mkdir(exist_ok=True)
if not p.exists():p.write_bytes(urllib.request.urlopen(s['repository'].replace('github.com','raw.githubusercontent.com')+'/'+s['commit']+'/kr3-desktop/assets/images/fullhd/gui_tutorial-1.png',timeout=60).read())
assert hashlib.sha256(p.read_bytes()).hexdigest()==s['sheets']['gui_tutorial-1.png']
im=Image.open(p).convert('RGBA');result={}
for key,f in s['frames'].items():
 x,y,w,h=f['f_quad'];out=Image.new('RGBA',tuple(f['size']));out.paste(im.crop((x,y,x+w,y+h)),tuple(f['trim'][:2]));buf=io.BytesIO();out.save(buf,format='PNG');result[key]=base64.b64encode(buf.getvalue()).decode()
print(json.dumps(result))
