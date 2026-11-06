"""Extend pinned desktop declaration data, never execute game controllers."""
import hashlib,json,pathlib,subprocess,urllib.request
R=pathlib.Path(__file__).resolve().parents[1]
def read(p):return json.loads((R/p).read_text())
def write(p,x):(R/p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
m=read('tools/sources/desktop-map.json'); b=read('tools/sources/desktop-book.json')
def original(source,path,cache,sha):
 p=R/'artifacts'/cache
 raw=p.read_bytes() if p.exists() else urllib.request.urlopen(source['repository'].replace('https://github.com/','https://raw.githubusercontent.com/')+'/'+source['commit']+'/'+path,timeout=60).read()
 assert hashlib.sha256(raw).hexdigest()==sha
 p.write_bytes(raw);return raw
raw=original(m,m['pointsPath'],'kro-map_points.lua',m['pointsSha256'])
# This pinned text is exclusively a returned declaration table.
s=raw.decode('utf-8-sig');assert 'function' not in s and 'require' not in s
points=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','-e',"local f=assert(loadstring(io.read('*a')));io.write(dofile('tools/encode_json.lua')(f()))"],input=s.encode(),cwd=R))
flags=points['flags'];flags=list(flags.values()) if isinstance(flags,dict) else flags
flag=next(x for x in flags if x['number']=='6');flag={'id':6,'pos':flag['pos']}
road={'id':'6','unlock_at':6,'dots':[x['pos'] for x in points['points'] if x['level']=='6']}
m['flags']=[x for x in m['flags'] if x['id']!=6]+[flag];m['roads']=[x for x in m['roads'] if x['unlock_at']!=6]+[road];m['scope']='Original first six flags and roads from pinned map_points declaration'
a=original(b,b['atlasPath'],'kro-screen_map_123.lua',b['atlasSha256'])
text=a.decode('utf-8-sig');assert 'function' not in text and 'require' not in text
atlas=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','-e',"io.write(dofile('tools/encode_json.lua')(assert(loadstring(io.read('*a')))()))"],input=text.encode(),cwd=R));b['frames']['stage_thumbs_0006']=atlas['stage_thumbs_0006']
write('tools/sources/desktop-map.json',m);write('tools/sources/desktop-book.json',b)
write('tools/sources/stage6-release.json',{'kind':'original declaration tables; no controllers executed','mapPointsSHA256':m['pointsSha256'],'bookAtlasSHA256':b['atlasSha256'],'flag':flag,'road':road,'thumbnail':atlas['stage_thumbs_0006'],'apkFiles':{k:v for k,v in read('web/assets/expansion/catalog.json')['source']['files'].items() if 'level06_' in k},'notificationDeclarationSHA256':hashlib.sha256((R/'reference/apk/assets/gc64/kr3-phone/data/game_gui_data.lua').read_bytes()).hexdigest(),'notification':'TOWER_MAGE_WILD_MAGUS','notOriginalSynchronizedPixels':True})
print('Prepared stage6 original entry declarations',flag, len(road['dots']))
