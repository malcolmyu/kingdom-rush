"""Original level06 parent controller, cart and GUI declarations; no controller runs."""
import hashlib,json,pathlib,subprocess,sys,zipfile,io
R=pathlib.Path(__file__).resolve().parents[1];sys.path.insert(0,str(R.parent/'.tools/python'));from PIL import Image
root=R/'reference/apk/assets/gc64';out=R/'web/assets/stage6-ending';out.mkdir(exist_ok=True);proof=R/'tools/sources/stage6-ending.json';pin=json.loads(proof.read_text())if proof.exists()else{}
def run(*args):return subprocess.check_output(['/opt/homebrew/bin/luajit',*args],cwd=R,text=True)
files=['kr3/data/levels/level06.lua','kr3/game_templates.lua','all-phone/game_gui.lua','all/path_db.lua','all/level_utils.lua','all/constants.lua','kr3-phone/data/kui_templates/game_gui.lua']
sha={k:hashlib.sha256((root/k).read_bytes()).hexdigest()for k in files};assert not pin or pin['sha256']==sha
checks=[('kr3/data/levels/level06.lua','level06.lua:48-151',['show-curtains','nearest_nodes','death-complete','Z_DECALS']),('kr3/data/levels/level06.lua','level06.lua:50-61',['ease_value','tick_ts']),('all-phone/game_gui.lua','game_gui.lua:1104-1109',['out-cubic','shown_y']),('all-phone/game_gui.lua','game_gui.lua:1110-1114',['out-cubic','hidden_y']),('all-phone/game_gui.lua','game_gui.lua:1189-1195',['in-out-quad','tween']),('all-phone/game_gui.lua','game_gui.lua:1039-1045',['hide_gui_hud','deselect_all'])]
for f,m,terms in checks:
 s=run('-bl',str(root/f));i=s.index('-- BYTECODE -- '+m);j=s.find('-- BYTECODE --',i+15)
 for t in terms:assert t in s[i:j],(m,t)
camera=json.loads(run('tools/read_stage6_ending.lua'));templates=json.loads(run('tools/read_templates.lua',str(root),'precise'));t=templates['decal_s06_jailed_boss'];assert len(t['render']['sprites'])==6
ui=json.loads(run('tools/read_ui.lua',str(root/files[-1])))
def find(x,key):
 if isinstance(x,dict):
  if x.get('id')==key:return x
  for v in x.values():
   r=find(v,key)
   if r:return r
 elif isinstance(x,list):
  for v in x:
   r=find(v,key)
   if r:return r
curtains={k:find(ui,'curtain_'+k+'_view')for k in ['top','bottom']};assert curtains['top']['shown_y']==32
z=zipfile.ZipFile(R.parent/'origins.apk');decl='assets/kr3-phone/images/iphonehd/go_stage06.lua';raw=z.read(decl);declsha=hashlib.sha256(raw).hexdigest();assert not pin or pin['declarationSHA256']==declsha
path=R/'reference/apk'/decl;path.write_bytes(raw);atlas=json.loads(run('tools/dump_lua.lua',str(path),'precise'));frames={}
for name,f in atlas.items():
 for k in[name,*f.get('alias',[])]:
  if k.startswith('bossHiena_cage_layer'):frames[k]={'a':f['a_name'],'q':f['f_quad'],'size':f['size'],'trim':f['trim']}
assert len(frames)==1086,len(frames)
raws={f['a']:z.read('assets/kr3-phone/images/iphonehd/'+f['a'])for f in frames.values()};pngsha={n:hashlib.sha256(v).hexdigest()for n,v in raws.items()};assert not pin or pin['pngSHA256']==pngsha
images={n:Image.open(io.BytesIO(v)).convert('RGBA')for n,v in raws.items()};places={};new={};width=2048;x=y=row=0
for k,f in sorted(frames.items()):
 key=json.dumps(f,sort_keys=True)
 if key not in places:
  w,h=f['q'][2:]
  if x+w+2>width:x=0;y+=row+2;row=0
  places[key]=[x,y,w,h];x+=w+2;row=max(row,h)
 new[k]={**f,'a':'../stage6-ending/sprites.webp','q':places[key]}
im=Image.new('RGBA',(width,y+row+2))
for k,f in frames.items():
 x,y,w,h=f['q'];im.paste(images[f['a']].crop((x,y,x+w,y+h)),tuple(new[k]['q'][:2]))
p=out/'sprites.webp';im.save(p,lossless=True,exact=True,method=6);check=Image.open(p).convert('RGBA')
for k,f in frames.items():
 x,y,w,h=f['q'];nx,ny,_,_=new[k]['q'];assert check.crop((nx,ny,nx+w,ny+h)).tobytes()==images[f['a']].crop((x,y,x+w,y+h)).tobytes(),k
(out/'catalog.json').write_text(json.dumps({'templates':{'decal_s06_jailed_boss':t},'frames':new,'sheets':['../stage6-ending/sprites.webp']},sort_keys=True,separators=(',',':'))+'\n')
data={**camera,'curtains':curtains,'guiReference':{'width':693,'height':320,'minAspect':1.5,'maxAspect':2.165},'cameraDuration':2,'introZoom':2,'returnZoom':1,'delay':2,'speed':47,'fromOffset':132,'destination':{'x':120,'y':459},'openWait':83/30,'lowerZWait':3/30,'finalWait':1,'decalsZ':1400}
(out/'rules.json').write_text(json.dumps(data,sort_keys=True,separators=(',',':'))+'\n')
proof.write_text(json.dumps({'sha256':sha,'declarationSHA256':declsha,'pngSHA256':pngsha,'ranges':[m for _,m,_ in checks],'frames':len(new),'uniqueCrops':len(places),'rgbaVerified':True,'scope':'Original campaign6 clear waves -> cart -> real boss -> death-complete -> final no-alive gate. World routes/viewport/camera/coroutine timing remain adapters; stage6 stays closed pending budgets/natural modes.'},sort_keys=True,indent=2)+'\n');print(len(new),'cart frames',len(places),'unique crops',p.stat().st_size,'bytes, exact RGBA verified')
