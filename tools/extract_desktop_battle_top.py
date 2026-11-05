"""Only selected desktop HUD declarations/images; no controller execution."""
import pathlib,json,hashlib,urllib.request
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1];s=json.loads((ROOT/'tools/sources/desktop-battle-top.json').read_text());out=ROOT/'web/assets/battle-top';out.mkdir(exist_ok=True)
sheets={};base=s['repository'].replace('github.com','raw.githubusercontent.com')+'/'+s['commit']+'/kr3-desktop/assets/images/fullhd/'
for name,sha in s['sheets'].items():
 p=ROOT/'artifacts'/('kro-'+name);raw=p.read_bytes()if p.exists()else urllib.request.urlopen(base+name,timeout=60).read();assert hashlib.sha256(raw).hexdigest()==sha,name;p.write_bytes(raw);sheets[name]=Image.open(p).convert('RGBA')
images={}
for key,f in s['frames'].items():
 x,y,w,h=f['f_quad'];im=Image.new('RGBA',tuple(f['size']));im.paste(sheets[f['a_name']].crop((x,y,x+w,y+h)),tuple(f['trim'][:2]));p=out/(key+'.webp');im.save(p,lossless=True,exact=True,method=6);assert Image.open(p).convert('RGBA').tobytes()==im.tobytes(),key
 images[key]={'src':'assets/battle-top/'+p.name,'size':f['size'],'rgbaSha256':hashlib.sha256(im.tobytes()).hexdigest()}
(out/'catalog.json').write_text(json.dumps({**{k:v for k,v in s.items()if k not in ['frames','sheets']},'images':images},ensure_ascii=False,separators=(',',':')))
print('Verified four original desktop HUD images including DDS decoded RGBA')
