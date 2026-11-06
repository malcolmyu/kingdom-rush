"""Original gnoll boss base controller audit and stage6-only lossless body atlas."""
import hashlib,json,pathlib,subprocess,sys,zipfile,io,re
R=pathlib.Path(__file__).resolve().parents[1];sys.path.insert(0,str(R.parent/'.tools/python'));from PIL import Image
root=R/'reference/apk/assets/gc64';proof=R/'tools/sources/gnoll-boss.json';pin=json.loads(proof.read_text())if proof.exists()else{}
def run(*a):return subprocess.check_output(['/opt/homebrew/bin/luajit',*a],cwd=R,text=True)
checks=[('kr3/game_scripts.lua','game_scripts.lua:11205-11327',['intro','loop','specialAttack' if False else 'damage_min_hero','kill_all_enemies','death-complete']),('kr3/game_scripts.lua','game_scripts.lua:11210-11214',['_last_ni','contains']),('kr3/game_scripts.lua','game_scripts.lua:11216-11220',['nodes_to_defend_point','cooldown']),('kr3/game_scripts.lua','game_scripts.lua:11222-11229',['manual_wave','wave_idx','hit_time']),('all/level_utils.lua','level_utils.lua:557-622',['F_BOSS','DAMAGE_NO_SPAWNS','gold']),('all/script_utils.lua','script_utils.lua:2937-3131',['chance','dodge_time','damage_factor','blockers']),('all/utils.lua','utils.lua:574-585',['soldier','pending_removal','is_inside_ellipse'])]
files=sorted({f for f,_,_ in checks}|{'kr3/game_templates.lua','all/script_utils.lua','all/constants.lua'})
sha={f:hashlib.sha256((root/f).read_bytes()).hexdigest()for f in files}
if pin:assert pin['sha256']==sha,'Pinned source changed'
for f,mark,terms in checks:
 b=run('-bl',str(root/f));i=b.index('-- BYTECODE -- '+mark);j=b.find('-- BYTECODE --',i+15)
 for t in terms:assert t in b[i:j],(mark,t)
t=json.loads(run('tools/read_templates.lua',str(root),'precise'));selected={'eb_gnoll':t['eb_gnoll']};assert selected['eb_gnoll']['health']['hp_max']==[5000,7000,8000,12000]
z=zipfile.ZipFile(R.parent/'origins.apk');decl='assets/kr3-phone/images/iphonehd/go_stage06.lua';raw=z.read(decl);declSha=hashlib.sha256(raw).hexdigest();assert not pin or pin['declarationSHA256']==declSha
local=R/'reference/apk'/decl;local.parent.mkdir(parents=True,exist_ok=True);local.write_bytes(raw);atlas=json.loads(run('tools/dump_lua.lua',str(local),'precise'));frames={}
for k,f in atlas.items():
 for name in[k,*f.get('alias',[])]:
  if re.fullmatch(r'bossHiena_\d{4}',name):frames[name]={'a':f['a_name'].replace('.png','.webp'),'q':f['f_quad'],'size':f['size'],'trim':f['trim']}
assert len(frames)==231,len(frames)
raws={n:z.read('assets/kr3-phone/images/iphonehd/'+n.replace('.webp','.png'))for n in{f['a']for f in frames.values()}};imageSHA={k:hashlib.sha256(v).hexdigest()for k,v in raws.items()};assert not pin or pin['imageSHA256']==imageSHA
images={n:Image.open(io.BytesIO(v)).convert('RGBA')for n,v in raws.items()};width=2048;x=y=row=0;new={};out=R/'web/assets/gnoll-boss';out.mkdir(exist_ok=True)
for k in sorted(frames):
 f=frames[k];w,h=f['q'][2:]
 if x+w+2>width:x=0;y+=row+2;row=0
 new[k]={**f,'a':'../gnoll-boss/sprites.webp','q':[x,y,w,h]};x+=w+2;row=max(row,h)
im=Image.new('RGBA',(width,y+row+2))
for k,f in frames.items():
 x,y,w,h=f['q'];im.paste(images[f['a']].crop((x,y,x+w,y+h)),tuple(new[k]['q'][:2]))
p=out/'sprites.webp';im.save(p,lossless=True,exact=True,method=6);check=Image.open(p).convert('RGBA')
for k,f in frames.items():
 x,y,w,h=f['q'];nx,ny,_,_=new[k]['q'];assert check.crop((nx,ny,nx+w,ny+h)).tobytes()==images[f['a']].crop((x,y,x+w,y+h)).tobytes(),k
(out/'catalog.json').write_text(json.dumps({'templates':selected,'frames':new,'sheets':['../gnoll-boss/sprites.webp']},sort_keys=True,separators=(',',':'))+'\n')
proof.write_text(json.dumps({'sha256':sha,'declarationSHA256':declSha,'imageSHA256':imageSHA,'ranges':[m for _,m,_ in checks],'frames':len(frames),'rgbaVerified':True,'scope':'Original boss intro/howl -> real manual spawner, node howls, physical NO_DODGE stomp, ordinary melee and death cleanup base.','limits':['Cart/camera/level ending and boss aura/modifier remain pending; campaign6 stays blocked','Native coroutine/queue IDs/node walking and full entity damage/kill enumeration adapted','Screen-shake and source audio requests are not full production playback']},sort_keys=True,indent=2)+'\n');print('Boss body',len(new),'frames',p.stat().st_size,'bytes; exact original RGBA verified')
