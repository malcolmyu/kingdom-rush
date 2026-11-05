"""Only audited original desktop settings sprites; no controllers executed."""
import pathlib,json,hashlib,urllib.request,urllib.parse
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1];s=json.loads((ROOT/'tools/sources/desktop-options.json').read_text());out=ROOT/'web/assets/options';out.mkdir(exist_ok=True)
base=s['repository'].replace('github.com','raw.githubusercontent.com')+'/'+s['commit']+'/kr3-desktop/assets/images/fullhd/';sheets={}
for name,sha in s['sheets'].items():
 p=ROOT/'artifacts'/('kro-'+name);raw=p.read_bytes()if p.exists()else urllib.request.urlopen(base+name,timeout=60).read()
 if hashlib.sha256(raw).hexdigest()!=sha:raise RuntimeError('Options checksum mismatch '+name)
 p.write_bytes(raw);sheets[name]=Image.open(p).convert('RGBA')
images={}
for key,f in s['frames'].items():
 x,y,w,h=f['f_quad'];im=Image.new('RGBA',tuple(f['size']));im.paste(sheets[f['a_name']].crop((x,y,x+w,y+h)),tuple(f['trim'][:2]));target=out/(key+'.webp');im.save(target,lossless=True,exact=True,method=6)
 if Image.open(target).convert('RGBA').tobytes()!=im.tobytes():raise RuntimeError(key)
 images[key]={'src':'assets/options/'+target.name,'size':f['size'],'rgbaSha256':hashlib.sha256(im.tobytes()).hexdigest()}
(out/'catalog.json').write_text(json.dumps({**{k:s[k]for k in ['reference','text','slider','scope','jimoKeys','difficulty']},'images':images,'provenance':{k:s[k]for k in ['repository','commit','kind','atlasPath','atlasSha256']}},ensure_ascii=False,separators=(',',':')))
print('Extracted',len(images),'verified desktop options sprites')
