"""Selected original desktop bottom HUD declarations; never execute controllers."""
import hashlib,json,pathlib,urllib.request
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1]
s=json.loads((ROOT/'tools/sources/desktop-battle-bottom.json').read_text());out=ROOT/'web/assets/battle-bottom';out.mkdir(exist_ok=True)
base=s['repository'].replace('github.com','raw.githubusercontent.com')+'/'+s['commit']+'/kr3-desktop/assets/images/fullhd/'
sheets={}
for name,sha in s['sourceSha256'].items():
 p=ROOT/'artifacts'/name
 if p.exists():assert hashlib.sha256(p.read_bytes()).hexdigest()==sha,name
for name,sha in s['sheets'].items():
 p=ROOT/'artifacts'/('kro-'+name);raw=p.read_bytes()if p.exists()else urllib.request.urlopen(base+name,timeout=60).read();assert hashlib.sha256(raw).hexdigest()==sha,name;p.write_bytes(raw);sheets[name]=Image.open(p).convert('RGBA')
frames={};tiles=[];dedup={};x=y=row=0
for key,f in s['frames'].items():
 qx,qy,w,h=f['f_quad'];im=sheets[f['a_name']].crop((qx,qy,qx+w,qy+h));digest=(im.size,hashlib.sha256(im.tobytes()).hexdigest())
 if digest not in dedup:
  if x+w+2>1024:x=0;y+=row+2;row=0
  dedup[digest]=[x,y,w,h];tiles.append((x,y,im));x+=w+2;row=max(row,h)
 frames[key]={'q':dedup[digest],'size':f['size'],'trim':f['trim']}
atlas=Image.new('RGBA',(1024,y+row));
for x,y,im in tiles:atlas.paste(im,(x,y))
atlas.save(out/'sprites.webp',lossless=True,exact=True,method=6);decoded=Image.open(out/'sprites.webp').convert('RGBA')
for key,f in s['frames'].items():
 x,y,w,h=frames[key]['q'];qx,qy,_,_=f['f_quad'];assert decoded.crop((x,y,x+w,y+h)).tobytes()==sheets[f['a_name']].crop((qx,qy,qx+w,qy+h)).tobytes(),key
(out/'catalog.json').write_text(json.dumps({**{k:v for k,v in s.items()if k not in ['frames','sheets']},'frames':frames,'sheet':'assets/battle-bottom/sprites.webp'},ensure_ascii=False,separators=(',',':')))
print('Verified',len(frames),'desktop bottom HUD crops,', (out/'sprites.webp').stat().st_size,'bytes')
