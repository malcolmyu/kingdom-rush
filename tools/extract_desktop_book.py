"""Extract only verified book frames from a pinned Origins desktop mod atlas.

No mod controllers, gameplay, translations or templates are executed/imported.
The checked-in source declaration records the selected frames and byte hashes.
"""
import hashlib,json,pathlib,urllib.request,sys,io
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT.parent/'.tools/python'))
from fontTools.ttLib import TTFont
source=json.loads((ROOT/'tools/sources/desktop-book.json').read_text())
base=source['repository'].replace('https://github.com/','https://raw.githubusercontent.com/')+'/'+source['commit']+'/'
def verified(path,sha,cache):
 data=cache.read_bytes() if cache.exists() else urllib.request.urlopen(base+urllib.parse.quote(path),timeout=60).read()
 if hashlib.sha256(data).hexdigest()!=sha:raise RuntimeError('Desktop source checksum mismatch: '+path)
 cache.parent.mkdir(exist_ok=True);cache.write_bytes(data);return data
out=ROOT/'web/assets/book';out.mkdir(exist_ok=True)
images={};sheets={}
for name,sha in source['sheets'].items():
 cache=ROOT/'artifacts'/('kro-'+name)
 verified('kr3-desktop/assets/images/fullhd/'+name,sha,cache)
 sheets[name]=Image.open(cache).convert('RGBA')
for key,f in source['frames'].items():
 x,y,w,h=f['f_quad'];im=Image.new('RGBA',tuple(f['size']))
 im.paste(sheets[f['a_name']].crop((x,y,x+w,y+h)),tuple(f['trim'][:2]))
 target=out/(key+'.webp');im.save(target,lossless=True,exact=True,method=6)
 if Image.open(target).convert('RGBA').tobytes()!=im.tobytes():raise RuntimeError('Book pixel mismatch: '+key)
 images[key]={'src':'assets/book/'+key+'.webp','size':f['size'],'rgbaSha256':hashlib.sha256(im.tobytes()).hexdigest()}
cap={**source['capitals']};target=ROOT/'web/assets/fonts'/cap['file']
raw=verified(cap['path'],cap['sha256'],ROOT/'artifacts'/('kro-'+cap['file']))
# JIMO's legacy vhea 1.1 is rejected by Chromium OTS, even in the full source.
# This UI is horizontal. Remove only the unsupported vertical tables; assert
# byte-identical horizontal outlines, advances, cmap, hinting and metrics.
font=TTFont(io.BytesIO(raw),recalcBBoxes=False,recalcTimestamp=False)
preserve=['glyf','loca','hmtx','hhea','cmap','OS/2','fpgm','prep','cvt ']
before={k:font.getTableData(k)for k in preserve}
for name in ['vhea','vmtx']:
 if name in font:del font[name]
font.save(target);font.close()
converted=TTFont(target,recalcBBoxes=False,recalcTimestamp=False)
for key,data in before.items():
 if data!=converted.getTableData(key):raise RuntimeError('Horizontal font data changed: '+key)
converted.close()
cap['browserSha256']=hashlib.sha256(target.read_bytes()).hexdigest()
cap['conversion']='Removed vhea/vmtx only; horizontal font tables verified byte-identical'
(out/'catalog.json').write_text(json.dumps({'provenance':{k:source[k]for k in ['repository','commit','kind','atlasSha256','stringsSha256']},'reference':{'x':1202,'y':720,'windowWidth':1920,'windowHeight':1080},'images':images,'text':source['text'],'capitals':cap},ensure_ascii=False,sort_keys=True,separators=(',',':')))
print('Extracted',len(images),'verified desktop book sprites; kept gameplay isolated')
