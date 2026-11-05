"""Audited original desktop title crops, never execute its controllers."""
import json,pathlib,hashlib,urllib.request
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1];s=json.loads((ROOT/'tools/sources/desktop-title.json').read_text());out=ROOT/'web/assets/desktop-title';out.mkdir(exist_ok=True);sheets={}
for name,sha in s['sheets'].items():
 p=ROOT/'artifacts'/('kro-'+name);raw=p.read_bytes()if p.exists()else urllib.request.urlopen(s['rawBase']+name).read()
 if hashlib.sha256(raw).hexdigest()!=sha:raise RuntimeError(name)
 p.write_bytes(raw);sheets[name]=Image.open(p).convert('RGBA')
images={}
for key,f in s['frames'].items():
 x,y,w,h=f['f_quad'];im=Image.new('RGBA',tuple(f['size']));im.paste(sheets[f['a_name']].crop((x,y,x+w,y+h)),tuple(f['trim'][:2]));p=out/(key+'.webp');im.save(p,lossless=True,exact=True,method=6)
 if Image.open(p).convert('RGBA').tobytes()!=im.tobytes():raise RuntimeError(key)
 images[key]={'src':'assets/desktop-title/'+p.name,'size':f['size'],'sha256':hashlib.sha256(im.tobytes()).hexdigest()}
(out/'catalog.json').write_text(json.dumps({'provenance':s['provenance'],'layout':s['layout'],'images':images},ensure_ascii=False,separators=(',',':')))
