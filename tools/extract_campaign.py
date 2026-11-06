"""Reproducible data/art extraction for Origins' first three stages and all modes.
Usage: python tools/extract_campaign.py --apk ../origins.apk
Requires Pillow, texture2ddecoder and LuaJIT. Does not execute game scripts.
"""
import argparse, io, json, pathlib, struct, subprocess, zipfile
from PIL import Image
import texture2ddecoder

ROOT=pathlib.Path(__file__).resolve().parents[1]
args=argparse.ArgumentParser();args.add_argument('--apk',default='origins.apk');opt=args.parse_args()
z=zipfile.ZipFile(opt.apk);OUT=ROOT/'web/assets';IP='assets/kr3-phone/images/iphonehd/'
for d in ['images','levels','menu']:(OUT/d).mkdir(parents=True,exist_ok=True)
for n in z.namelist():
 if n.startswith('assets/gc64/'):
  p=ROOT/'reference/apk'/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(n))
def lua(n):
 p=ROOT/'reference/apk'/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(z.read(n))
 return json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/dump_lua.lua'),str(p)]))
templates=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_templates.lua'),str(ROOT/'reference/apk/assets/gc64')]))
wave_rules=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_wave_rules.lua'),str(ROOT/'reference/apk/assets/gc64')]))
(ROOT/'web/wave-rules.mjs').write_text('// Generated from original kr3/game_settings.lua.\nexport default '+json.dumps(wave_rules,sort_keys=True,separators=(',',':'))+';\n')
world_rules=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_world_rules.lua')],cwd=ROOT))
(ROOT/'web/world-rules.mjs').write_text('// Original phone world constants and director texture scale.\nexport default '+json.dumps(world_rules,sort_keys=True,separators=(',',':'))+';\n')
progression=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_progression.lua'),str(ROOT/'reference/apk/assets/gc64')]))
(ROOT/'web/hero-data.mjs').write_text('// Generated from original kr3/game_settings.lua by tools/read_progression.lua.\nexport default '+json.dumps(progression,sort_keys=True,separators=(',',':'))+';\n')
upgrades=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_upgrades.lua'),str(ROOT/'reference/apk/assets/gc64')]))
(ROOT/'web/upgrade-data.mjs').write_text('// Original kr3/upgrades.lua declarative data.\nexport default '+json.dumps(upgrades,sort_keys=True,separators=(',',':'))+';\n')
groups=['go_towers','go_decals','go_enemies_elven_woods',
        'go_hero_elves_archer','go_stages_elven_woods',
        'loading_common','encyclopedia','encyclopedia_thumbs','gui_notifications_bg','gui_notifications_common','gui_shop','gui_common','gui_slices','gui_portraits','screen_map_stage_thumbs','screen_slots','screen_map','screen_map_opaque','screen_map_decos','screens_common_zh-Hans']
groups += [f'go_stage{i:02}' for i in range(1,4)]
frames={};sheets={}
def decode(name):
 if name in sheets:return sheets[name]
 b=z.read(IP+name)
 if name.endswith('.pkm'):
  fmt,w,h,ow,oh=struct.unpack('>5H',b[6:16]);assert fmt==0,(name,fmt)
  im=Image.frombytes('RGBA',(w,h),texture2ddecoder.decode_etc1(b[16:],w,h),'raw','BGRA').crop((0,0,ow,oh))
 else:im=Image.open(io.BytesIO(b)).convert('RGBA')
 sheets[name]=im;return im
def crop(v):
 x,y,w,h=v['f_quad'];return decode(v['a_name']).crop((x,y,x+w,y+h))
for group in groups:
 for k,v in lua(IP+group+'.lua').items():
  a=v['a_name'];decode(a);f={'q':v['f_quad'],'size':v['size'],'trim':v['trim'],'a':a.rsplit('.',1)[0]+'.webp'}
  frames[k]=f
  for alias in v['alias']:frames[alias]=f
for name,im in sheets.items():im.save(OUT/'images'/(name.rsplit('.',1)[0]+'.webp'),lossless=True,method=4)
titles=['灰鸦港口','高桥','瀑布小径','红杉阻击战','皇家庭院','狮鹫驿站','石环阵','格林堡之战','水晶之湖','奇迹仙境']
levels=[]
used_templates={*[f're_current_{i}'for i in range(1,4)],*[f'soldier_re_{level}_{i}'for level in [0,1]for i in range(1,4)],'power_reinforcements_control','power_thunder_control','hero_elves_archer','soldier_re_1','tower_holder_elven_woods','tower_holder_faerie_grove'}
for ty in ['archer','barrack','mage','rock_thrower']:
 used_templates.add('tower_build_'+ty)
 for n in range(1,4):used_templates.add(f'tower_{ty}_{n}')
for i,title in enumerate(titles[:3],1):
 raw=lua(f'assets/gc64/kr3/data/levels/level{i:02}_data.lua');paths=lua(f'assets/gc64/kr3/data/levels/level{i:02}_paths.lua')
 meta=lua(IP+f'go_stage{i:02}_bg.lua');v=next(iter(meta.values()));im=crop(v);im.save(OUT/f'levels/map{i:02}.webp',lossless=True,method=4)
 summaries={}
 for mi,mode in enumerate(['campaign','heroic','iron'],1):
  level={**raw,'entities_list':[e for e in raw['entities_list'] if e.get('editor.game_mode',0) in [0,mi]]}
  waves=lua(f'assets/gc64/kr3/data/waves/level{i:02}_waves_{mode}.lua')
  override=raw['level_mode_overrides'][mi-1]
  payload={'id':i,'title':title,'mode':mode,'modeId':mi,'level':level,'rules':override,'paths':paths['paths'],'active':paths['active'],'connections':paths.get('connections',{}),'waves':waves,'map':f'assets/levels/map{i:02}.webp','size':list(im.size)}
  (OUT/f'levels/{i:02}-{mode}.json').write_text(json.dumps(payload,ensure_ascii=False,sort_keys=True,separators=(',',':')))
  enemies=sorted({s['creep']for g in waves['groups']for w in g['waves']for s in w['spawns']if s.get('max',0)>0})
  summaries[mode]={'waves':len(waves['groups']),'cash':waves['cash'],'enemies':enemies,'rules':override,'count':sum(s['max']for g in waves['groups']for w in g['waves']for s in w['spawns'])}
  used_templates.update(e['template']for e in level['entities_list']);used_templates.update(enemies)
 levels.append({'id':i,'title':title,'modes':summaries,'size':list(im.size)})
for group,key,name in [('screen_slots','mainmenu_bg','start'),('screen_slots','logo','logo'),('screen_map_opaque','MapBackground','world')]:
 v=lua(IP+group+'.lua')[key];crop(v).save(OUT/f'menu/{name}.webp',lossless=True)
selected={}
def visit(x):
 if isinstance(x,str) and x in templates and x not in selected:selected[x]=templates[x];visit(templates[x])
 elif isinstance(x,dict):
  for v in x.values():visit(v)
 elif isinstance(x,list):
  for v in x:visit(v)
for k in used_templates:visit(k)
catalog={'frames':frames,'animations':lua('assets/gc64/kr3/data/game_animations.lua')['animations'],'templates':selected,'levels':levels,'flags':json.loads((ROOT/'reference/map-flags.json').read_text())}
(OUT/'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,sort_keys=True,separators=(',',':')))
for key,source in {'book-hover':'Sound_GUIMouseOverTowerIcon.ogg','encyclopedia-turn':'Sound_NotificationPaperOver.ogg','upgrade-buy':'Sound_GUIBuyUpgrade.ogg','upgrade-select':'Sound_GUIOpenTowerMenu.ogg','upgrade-confirm':'Sound_GUIButtonCommon.ogg','map-new-flag':'Sound_MapNewFlag.ogg','map-new-road':'Sound_MapRoad.ogg','transition-open':'GUITransitionOpen.ogg','transition-close':'GUITransitionClose.ogg','quest-completed':'Sound_QuestCompleted.ogg','notification-open':'Sound_NotificationOpen.ogg','notification-close':'Sound_NotificationClose.ogg','notification-icon':'Sound_NotificationSecondLevel.ogg','spell-refresh':'Sound_SpellRefresh.ogg','nimble':'kre_sfx_eridan_nimblefencing.ogg','levelup':'Level_up.ogg','double-strike':'kre_sfx_eridan_doublestrike_v2[mid].ogg','thunder1':'kr3_sfx_lightning_op1.ogg','thunder2':'kr3_sfx_lightning_op2.ogg','thunder3':'kr3_sfx_lightning_op3.ogg','door':'Sound_TowerOpenDoor.ogg','melee':'kr3_sfx_basicbarracks_fight.ogg','barrack':'Barrack_Taunt[2]-01c.ogg','menu':'kro_bgmusic_maintheme[master_25-08].ogg','world':'kre_bgmusic_map[master_25-08].ogg'}.items():
 p='assets/kr3-phone/sounds/files/'+source
 if p in z.namelist():(OUT/(key+'.ogg')).write_bytes(z.read(p))
# These directories contain only generated outputs owned by this extractor.
keep_images={f['a']for f in frames.values()}
keep_levels={f'{i:02}-{m}.json'for i in range(1,4)for m in ['campaign','heroic','iron']}|{f'map{i:02}.webp'for i in range(1,4)}
for p in (OUT/'images').glob('*.webp'):
 if p.name not in keep_images:p.unlink()
for p in (OUT/'levels').iterdir():
 if p.is_file() and p.name not in keep_levels:p.unlink()
print(json.dumps({'levels':len(levels),'frames':len(frames),'sheets':len(sheets),'bytes':sum(p.stat().st_size for p in OUT.rglob('*')if p.is_file())}))

# Original stage 4–6 package is isolated until new mechanics pass acceptance.
subprocess.run(['python3',str(ROOT/'tools/extract_expansion.py'),'--apk',opt.apk],check=True)
subprocess.run(['python3',str(ROOT/'tools/extract_ettin.py')],check=True)
subprocess.run(['python3',str(ROOT/'tools/extract_carrier.py')],check=True)
subprocess.run(['python3',str(ROOT/'tools/extract_blight.py')],check=True)
subprocess.run(['python3',str(ROOT/'tools/extract_blighter_energy.py')],check=True)
subprocess.run(['python3',str(ROOT/'tools/extract_ewok_hut.py')],check=True)
subprocess.run(['python3',str(ROOT/'tools/extract_ewok_shield.py')],check=True,cwd=ROOT)
subprocess.run(['python3',str(ROOT/'tools/extract_ewok_spear.py')],check=True,cwd=ROOT)
subprocess.run(['python3',str(ROOT/'tools/extract_harasser.py')],check=True,cwd=ROOT)
subprocess.run(['python3',str(ROOT/'tools/extract_harasser_jump.py')],check=True,cwd=ROOT)
subprocess.run(['python3',str(ROOT/'tools/extract_gryphon_guards.py')],check=True,cwd=ROOT)
subprocess.run(['python3',str(ROOT/'tools/extract_gryphon_events.py')],check=True,cwd=ROOT)
subprocess.run(['python3',str(ROOT/'tools/extract_stage4_burn.py')],check=True,cwd=ROOT)

subprocess.run(['python3',str(ROOT/'tools/extract_fixed_alleria.py')],check=True,cwd=ROOT)

# New-stage declarations must exist before GUI and release-book dependencies.
subprocess.run(['python3',str(ROOT/'tools/extract_arcane.py')],check=True,cwd=ROOT)
subprocess.run(['python3',str(ROOT/'tools/extract_stage5_catapult.py')],check=True)
subprocess.run(['python3',str(ROOT/'tools/extract_stage5_alleria.py')],check=True)
subprocess.run(['python3',str(ROOT/'tools/extract_desktop_multi_hero.py')],check=True)
subprocess.run(['python3',str(ROOT/'tools/extract_blade.py')],check=True)

subprocess.run(['python3',str(ROOT/'tools/extract_ui.py'),'--apk',opt.apk],check=True)

subprocess.run(['python3',str(ROOT/'tools/extract_fonts.py'),'--apk',opt.apk],check=True)

subprocess.run(['python3',str(ROOT/'tools/extract_markers.py')],check=True)
subprocess.run(['python3',str(ROOT/'tools/extract_ranges.py')],check=True)

# Desktop book typography is an explicitly separate, pinned source.
subprocess.run(['python3',str(ROOT/'tools/extract_book_font.py')],check=True)

subprocess.run(['python3',str(ROOT/'tools/prepare_stage6_entry.py')],check=True)
subprocess.run(['python3',str(ROOT/'tools/extract_desktop_book.py')],check=True)
subprocess.run(['python3',str(ROOT/'tools/extract_desktop_map.py')],check=True)

subprocess.run(['python3',str(ROOT/'tools/extract_desktop_options.py')],check=True)

subprocess.run(['python3',str(ROOT/'tools/extract_desktop_title.py')],check=True)

subprocess.run(['python3',str(ROOT/'tools/extract_render_order.py')],check=True,cwd=ROOT)

subprocess.run(['python3',str(ROOT/'tools/extract_health_bars.py')],check=True,cwd=ROOT)

subprocess.run(['python3',str(ROOT/'tools/extract_skill_effects.py')],check=True,cwd=ROOT)
subprocess.run(['python3',str(ROOT/'tools/extract_tower_effects.py')],check=True,cwd=ROOT)
subprocess.run(['python3',str(ROOT/'tools/extract_construction_feedback.py')],check=True,cwd=ROOT)

subprocess.run(['python3',str(ROOT/'tools/extract_desktop_battle_top.py')],check=True,cwd=ROOT)

subprocess.run(['python3',str(ROOT/'tools/extract_desktop_battle_bottom.py')],check=True,cwd=ROOT)

subprocess.run(['python3',str(ROOT/'tools/extract_desktop_guidance.py')],check=True,cwd=ROOT)


subprocess.run(['python3',str(ROOT/'tools/group_expansion.py')],check=True)

subprocess.run(['python3',str(ROOT/'tools/group_towers.py')],check=True)

subprocess.run(['python3',str(ROOT/'tools/prepare_stage4_release.py')],check=True)

subprocess.run(['python3',str(ROOT/'tools/extract_stage6_spawner.py')],check=True,cwd=ROOT)

subprocess.run(['python3',str(ROOT/'tools/extract_melee_audio.py')],check=True,cwd=ROOT)

subprocess.run(['python3',str(ROOT/'tools/extract_gnoll_boss.py')],check=True)

subprocess.run(['python3',str(ROOT/'tools/extract_stage6_ending.py')],check=True,cwd=ROOT)

subprocess.run(['python3',str(ROOT/'tools/extract_wild_magus.py')],check=True,cwd=ROOT)

subprocess.run(['python3',str(ROOT/'tools/extract_stage7.py')],check=True,cwd=ROOT)
