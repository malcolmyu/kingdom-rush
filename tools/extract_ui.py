"""Export original menu layout tables and untrimmed UI sprites from the catalog."""
import json,pathlib,subprocess,zipfile,io,argparse
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--apk',default=str(ROOT.parent/'origins.apk'));opt=parser.parse_args()
BASE=ROOT/'reference/apk/assets/gc64/kr3-phone/data/kui_templates'
OUT=ROOT/'web/assets/ui';OUT.mkdir(exist_ok=True)
def read(name):return json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_ui.lua'),str(BASE/(name+'.lua'))]))
def find(node,id):
 if node.get('id')==id:return node
 for child in node.get('children',[]):
  match=find(child,id)
  if match:return match
slots=read('screen_slots');world=read('screen_map');game=read('game_gui')
layouts={'title':slots,'slot':read('slot_view'),'slotTab':read('slot_tab_view'),'level':find(world,'level_view'),'pause':find(game,'pause_view'),'victory':find(game,'victory_view'),'defeat':find(game,'defeat_view'),'hero':find(world,'hero_room_view'),'heroSkill':read('hero_skill_view')}
layouts['battleHud']={key:{k:v for k,v in find(game,key).items() if k!='children'}for key in ['hud_normal_view','pause_button','hero_portraits_view','notification_queue_view','powers_view']}
layouts['tutorials']=[read('game_gui_noti_tutorial_'+str(i)) for i in range(1,4)]
notification_source=ROOT/'reference/apk/assets/gc64/kr3-phone/data/game_gui_data.lua'
notification_data=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_notifications.lua'),str(notification_source)]))
tower_data=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_tower_menu.lua')]))
layouts['battleTop']={'reference':tower_data['reference'],'hudScaleSteps':tower_data['hudScaleSteps'],'hud':{**find(game,'hud_normal_view'),'children':[n for n in find(game,'hud_normal_view')['children']if n.get('class')=='GGLabel']},'pause':find(game,'pause_button')}
layouts['battlePowers']={'parent':find(game,'powers_view'),'button':read('game_gui_power_button'),'hudScaleSteps':tower_data['hudScaleSteps'],'reference':tower_data['reference']}
layouts['infobar']={'reference':tower_data['reference'],'view':find(game,'infobar_view'),'powers':{k:v for k,v in find(game,'powers_view').items() if k!='children'},'bag':{k:v for k,v in find(game,'bag_view').items() if k!='children'},'bagButton':find(game,'bag_button'),'stats':tower_data['stats']}
layouts['towerMenu']={'motion':tower_data['motion'],'menus':tower_data['menus'],'literals':tower_data['literals'],'powerPlaces':notification_data['tower_menu_power_places'],'places':notification_data['tower_menu_button_places'],'root':find(game,'tower_menu'),'tooltip':read('game_gui_tower_menu_tooltip')}
layouts['balloons']=notification_data['tutorial_balloons']
layouts['notifications']={key:{'meta':notification_data['notifications'][key],'layout':json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_notifications.lua'),str(notification_source),key]))}for key in ['TOWER_LEVEL2','TOWER_LEVEL3','TOWER_ARCHER_ARCANE','TOWER_BARRACK_BLADE','TOWER_MAGE_WILD_MAGUS','POWER_REINFORCEMENT','POWER_THUNDERBOLT','TIP_HEROES','enemy_gnoll_reaver','enemy_gnoll_burner','enemy_gnoll_gnawer','enemy_hyena','enemy_perython','enemy_ettin','enemy_gnoll_blighter','enemy_twilight_elf_harasser']}
layouts['upgrades']=find(world,'upgrades_view')
layouts['upgradeItem']=read('upgrade_item_view')
right=find(world,'bottom_right_bar_view')
hero_map_data=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_notifications.lua'),str(ROOT/'reference/apk/assets/gc64/kr3-phone/data/map_data.lua')]))
layouts['mapHero']={'parent':{k:v for k,v in right.items() if k!='children'},'hero':find(right,'map_hero_button'),'encyclopedia':find(right,'map_encyclopedia_button'),'levelup':find(right,'map_balloon_level_up_view'),'unlocked':find(right,'map_balloon_hero_unlocked_view'),'heroData':hero_map_data['hero_data_free'],'upgrades':find(right,'map_upgrades_button'),'upgradeHint':find(right,'map_balloon_upgrades_view')}
layouts['map']={'decos':find(world,'map_decos_view')['children'],'top':find(world,'map_top_decos_view')['children'],'roads':find(world,'map_roads_view')['children'],'startBalloon':find(world,'map_balloon_start_here_view')}
book_data=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_encyclopedia.lua'),str(ROOT/'reference/apk/assets/gc64')]))
layouts['encyclopedia']={'towers':find(world,'encyclopedia_towers_view'),'index':find(world,'encyclopedia_view'),'enemies':find(world,'encyclopedia_enemies_view'),'tips':find(world,'encyclopedia_tips_view'),'entries':book_data['enemies'],'tipsCount':book_data['tips_count']}
c=json.loads((ROOT/'web/assets/catalog.json').read_text());c['templates'].update(json.loads((ROOT/'web/assets/expansion/catalog.json').read_text())['templates']);c['templates'].update(json.loads((ROOT/'web/assets/arcane/catalog.json').read_text())['templates']);keys={'hero_portraits_0001'}
def visit(v):
 if isinstance(v,dict):
  for k,x in v.items():
   if k.endswith('image_name') and isinstance(x,str):keys.add(x)
   elif k in ['image','check','halo'] and isinstance(x,str):keys.add(x)
   elif k=='slices_prefix':keys.update(x+'_'+p for p in ['lt','ct','lc','cc'])
   else:visit(x)
 elif isinstance(v,list):
  for x in v:visit(x)
visit(layouts)
keys.update(v['meta']['icon'] for v in layouts['notifications'].values() if v['meta'].get('icon'))
keys.update('balloon_map_slices_'+p for p in ['lt','ct','rt','lc','cc','rc','lb','cb','rb','callout_center','callout_right'])
keys.update(f'upgrades_icons_{i:04}'for i in range(1,33))
keys.update(f'upgrades_icons_off_{i:04}'for i in range(1,31))
keys.update(f'upgrade_check_anim_{i:04}'for i in range(1,8))
keys.add('portraits_hero_0001')
keys.update(['portraits_sc_0013','portraits_sc_0004','portraits_sc_0005','portraits_sc_0006','portraits_sc_0008','portraits_sc_0009','portraits_sc_0014','portraits_sc_0019','portraits_sc_0051','icon_0005'])
keys.update(f'portraits_towers_{i:04}'for i in [1,2,3,4,5,7,9,13])
keys.update(['power_rank_0001','power_rank_0002','special_icons_bg','gui_ring','main_icons_over','price_tag','price_tag_disabled','main_icons_0014','tooltip_icons_0010'])
for key in list(keys):
 if key+'_disabled' in c['frames']:keys.add(key+'_disabled')
keys.add('mapFlag_star_0018')
keys.update(f'heroroom_upgradeIcons_{i:04}'for i in range(6))
keys.update(f'heroroom_heroBadge_numbers_{i:04}'for i in range(1,11))
keys.add('heroroom_heroBadge_bar')
keys.add('heroroom_portraits_0001')
for family in ['archer','barrack','mage','rock_thrower']:
 for level in range(1,4):
  icon=c['templates'][f'tower_{family}_{level}']['info']['enc_icon'];keys.update([f'encyclopedia_tower_thumbs_{icon:04}',f'encyclopedia_towers_{icon:04}'])
c['templates'].update(json.loads((ROOT/'web/assets/expansion/catalog.json').read_text())['templates'])
c['templates'].update(json.loads((ROOT/'web/assets/blade/catalog.json').read_text())['templates'])
c['templates'].update(json.loads((ROOT/'web/assets/wild-magus/catalog.json').read_text())['templates'])
icon=c['templates']['tower_wild_magus']['info']['enc_icon'];keys.update([f'encyclopedia_tower_thumbs_{icon:04}',f'encyclopedia_towers_{icon:04}'])
icon=c['templates']['tower_blade']['info']['enc_icon'];keys.update([f'encyclopedia_tower_thumbs_{icon:04}',f'encyclopedia_towers_{icon:04}'])
icon=c['templates']['tower_arcane']['info']['enc_icon'];keys.update([f'encyclopedia_tower_thumbs_{icon:04}',f'encyclopedia_towers_{icon:04}'])
keys.update(['encyclopedia_tower_thumbs_0121','encyclopedia_creep_thumbs_frame_0001','encyclopedia_creep_thumbs_frame_0002'])
for name in ['enemy_gnoll_reaver','enemy_gnoll_burner','enemy_gnoll_gnawer','enemy_hyena','enemy_perython','enemy_ettin','enemy_gnoll_blighter','enemy_twilight_elf_harasser']:
 icon=c['templates'][name]['info']['enc_icon'];keys.update([f'encyclopedia_creep_thumbs_{icon:04}',f'encyclopedia_creeps_{icon:04}'])
keys.update('heroroom_portraitsDecos_'+str(i).zfill(4) for i in [2,3])
keys.update('balloon_hero_help_slices_'+p for p in ['lt','ct','rt','lc','cc','rc','lb','cb','rb','callout_center','callout_right'])
keys.update(['mapStarsContainer','map_borders','butConfig_0001','butConfig_0002','mapButtons_hero_0001','mapButtons_hero_0002','butEncyclopedia_0001','butEncyclopedia_0002'])
keys.update(f'levelSelect_difficulty_{i:04}'for i in range(1,7))
keys.update(f'thumb_stage{i}'for i in range(1,4))
keys.update(f'levelSelect_butModes_{i:04}'for i in range(1,8))
keys.update(f'logo_brillo_{i:04}'for i in range(1,22))
keys.update(f'victoryStars_{i:04}'for i in range(1,55))
keys.update(f'mapFlag_{i:04}'for i in [1,6,7,8,9,10])
keys.update(f'levelSelect_badges_{i:04}'for i in range(1,7))
keys.update(f'victoryBadges_{i:04}'for i in range(1,6))
exact_keys={'encyclopedia_towers_0016','encyclopedia_tower_thumbs_0016','portraits_sc_0013','portraits_towers_0005','portraits_sc_0051','portraits_sc_0014','portraits_sc_0019','encyclopedia_creeps_0004','encyclopedia_creeps_0005','encyclopedia_creep_thumbs_0004','encyclopedia_creep_thumbs_0005','encyclopedia_towers_0017','encyclopedia_tower_thumbs_0017','alert_creep_0004','alert_creep_0005','alert_creep_0008','encyclopedia_creeps_0008','encyclopedia_creep_thumbs_0008','encyclopedia_towers_0020','encyclopedia_tower_thumbs_0020'}
images={};sheets={}
for key in sorted(keys):
 f=c['frames'].get(key)
 if not f:continue
 if f['a'] not in sheets:sheets[f['a']]=Image.open(ROOT/'web/assets/images'/f['a']).convert('RGBA')
 x,y,w,h=f['q'];im=Image.new('RGBA',tuple(f['size']));im.paste(sheets[f['a']].crop((x,y,x+w,y+h)),tuple(f['trim'][:2]));
 if key in exact_keys or key in ['portraits_towers_0009','portraits_towers_0013','power_rank_0001','power_rank_0002','special_icons_bg']:
  with zipfile.ZipFile(opt.apk)as z:original=Image.open(io.BytesIO(z.read('assets/kr3-phone/images/iphonehd/'+f['a'].replace('.webp','.png')))).convert('RGBA')
  im.paste(original.crop((x,y,x+w,y+h)),tuple(f['trim'][:2]))
 im.save(OUT/(key+'.webp'),lossless=True,exact=key in exact_keys or key in ['portraits_towers_0009','portraits_towers_0013','power_rank_0001','power_rank_0002','special_icons_bg'])
 if key in exact_keys or key in ['portraits_towers_0009','portraits_towers_0013','power_rank_0001','power_rank_0002','special_icons_bg']:assert Image.open(OUT/(key+'.webp')).convert('RGBA').tobytes()==im.tobytes()
 images[key]={'size':f['size'],'src':'assets/ui/'+key+'.webp'}
(OUT/'layouts.json').write_text(json.dumps({'reference':{'width':693,'height':320},'layouts':layouts,'images':images},ensure_ascii=False,sort_keys=True,separators=(',',':')))
print(f'Exported {len(images)} original sprites and {len(layouts)} layout tables')
