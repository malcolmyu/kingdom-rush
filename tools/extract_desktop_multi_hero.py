"""Pinned KR3 desktop two-hero HUD crops and shared-controller layout audit."""
import hashlib,json,pathlib,subprocess
from PIL import Image
R=pathlib.Path(__file__).resolve().parents[1];base=json.loads((R/'tools/sources/desktop-battle-bottom.json').read_text())
for file,sha in base['sourceSha256'].items():assert hashlib.sha256((R/'artifacts'/file).read_bytes()).hexdigest()==sha,file
for file in ['original-desktop-game_gui.lua','kro-desktop-game_gui.lua']:
 s=(R/'artifacts'/file).read_text();a=s.index('function HudBottomView:add_hero(');b=s.index('HudCountersView =',a);block=s[a:b]
 for value in ['self.powers.pos.x = 175','last.pos.x = 8','local overlap = 18','hero:set_style("right")','heroPortrait_separator','separator.propagate_on_click = true']:assert value in block,(file,value)
 for value in ['"heroPortrait_L"','"heroPortrait_R"','self.hero_id = hero_entity.id','e.hero.xp - self.hero_xp_base','self.bar_health.scale.x = e.health.hp / e.health.hp_max']:assert value in s,(file,value)
common=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/dump_lua.lua',str(R/'artifacts/kro-gui_common_123.lua')],cwd=R))
portraits=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/dump_lua.lua',str(R/'artifacts/kro-gui_portraits_123.lua')],cwd=R))
frames={k:common[k] for prefix in ['heroPortrait_L','heroPortrait_R'] for i in range(1,30) for k in [prefix+'_'+str(i).zfill(4)]}
frames['heroPortrait_separator']=common['heroPortrait_separator'];frames['hero_portraits_0019']=portraits['hero_portraits_0019']
sheets={}
for file in {v['a_name']for v in frames.values()}:
 p=R/'artifacts'/('kro-'+file);assert hashlib.sha256(p.read_bytes()).hexdigest()==base['sheets'][file];sheets[file]=Image.open(p).convert('RGBA')
x=y=row=0;tiles=[];packed={};dedup={}
for key,f in sorted(frames.items()):
 qx,qy,w,h=f['f_quad'];im=sheets[f['a_name']].crop((qx,qy,qx+w,qy+h));digest=(im.size,im.tobytes())
 if digest not in dedup:
  if x+w+2>1024:x=0;y+=row+2;row=0
  dedup[digest]=[x,y,w,h];tiles.append((x,y,im));x+=w+2;row=max(row,h)
 packed[key]={'q':dedup[digest],'size':f['size'],'trim':f['trim'],'multi':True}
atlas=Image.new('RGBA',(1024,y+row));
for x,y,im in tiles:atlas.paste(im,(x,y))
out=R/'web/assets/battle-multi';out.mkdir(exist_ok=True);atlas.save(out/'sprites.webp',lossless=True,exact=True,method=6);check=Image.open(out/'sprites.webp').convert('RGBA')
for key,f in frames.items():
 x,y,w,h=packed[key]['q'];qx,qy,_,_=f['f_quad'];assert check.crop((x,y,x+w,y+h)).tobytes()==sheets[f['a_name']].crop((qx,qy,qx+w,qy+h)).tobytes(),key
rules={'heroX':[8,92],'powersX':175,'overlap':18,'separatorPos':[101,3],'separatorAnchorY':101}
proof={k:base[k]for k in ['repository','commit','sourceSha256','textureScale']};proof.update(frames=frames,sheets={k:base['sheets'][k]for k in sheets},rules=rules,rgbaVerified=True,scope='Original desktop KR3 two hero portraits and identity-bound selection, source HP/XP/death masks',limits=['Current World story hero statistics and grid movement remain adapted','Full desktop infobar and original keyboard hero cycling pending'])
(R/'tools/sources/desktop-multi-hero.json').write_text(json.dumps(proof,sort_keys=True,indent=2)+'\n')
(out/'catalog.json').write_text(json.dumps({'frames':packed,'rules':rules,'sheet':'assets/battle-multi/sprites.webp'},sort_keys=True,separators=(',',':')))
print('Verified multi hero',len(packed),'frames', (out/'sprites.webp').stat().st_size,'bytes')
