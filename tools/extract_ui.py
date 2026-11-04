"""Export original menu layout tables and untrimmed UI sprites from the catalog."""
import json,pathlib,subprocess
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parents[1]
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
layouts['balloons']=notification_data['tutorial_balloons']
layouts['notifications']={key:{'meta':notification_data['notifications'][key],'layout':json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_notifications.lua'),str(notification_source),key]))}for key in ['POWER_REINFORCEMENT','POWER_THUNDERBOLT','TIP_HEROES','enemy_gnoll_reaver','enemy_gnoll_burner','enemy_gnoll_gnawer','enemy_hyena','enemy_perython']}
layouts['map']={'decos':find(world,'map_decos_view')['children'],'top':find(world,'map_top_decos_view')['children'],'roads':find(world,'map_roads_view')['children'],'startBalloon':find(world,'map_balloon_start_here_view')}
c=json.loads((ROOT/'web/assets/catalog.json').read_text());keys=set()
def visit(v):
 if isinstance(v,dict):
  for k,x in v.items():
   if k.endswith('image_name') and isinstance(x,str):keys.add(x)
   elif k=='slices_prefix':keys.update(x+'_'+p for p in ['lt','ct','lc','cc'])
   else:visit(x)
 elif isinstance(v,list):
  for x in v:visit(x)
visit(layouts)
keys.update(v['meta']['icon'] for v in layouts['notifications'].values() if v['meta'].get('icon'))
keys.update('balloon_map_slices_'+p for p in ['lt','ct','rt','lc','cc','rc','lb','cb','rb','callout_center','callout_right'])
keys.add('mapFlag_star_0018')
keys.update(f'heroroom_upgradeIcons_{i:04}'for i in range(6))
keys.update(f'heroroom_heroBadge_numbers_{i:04}'for i in range(1,11))
keys.add('heroroom_heroBadge_bar')
keys.add('heroroom_portraits_0001')
keys.update(['mapStarsContainer','map_borders','butConfig_0001','butConfig_0002','mapButtons_hero_0001','mapButtons_hero_0002','butEncyclopedia_0001','butEncyclopedia_0002'])
keys.update(f'thumb_stage{i}'for i in range(1,4))
keys.update(f'levelSelect_butModes_{i:04}'for i in range(1,8))
keys.update(f'logo_brillo_{i:04}'for i in range(1,22))
keys.update(f'victoryStars_{i:04}'for i in range(1,55))
keys.update(f'mapFlag_{i:04}'for i in [1,6,7,8,9,10])
keys.update(f'levelSelect_badges_{i:04}'for i in range(1,7))
keys.update(f'victoryBadges_{i:04}'for i in range(1,6))
images={};sheets={}
for key in sorted(keys):
 f=c['frames'].get(key)
 if not f:continue
 if f['a'] not in sheets:sheets[f['a']]=Image.open(ROOT/'web/assets/images'/f['a']).convert('RGBA')
 x,y,w,h=f['q'];im=Image.new('RGBA',tuple(f['size']));im.paste(sheets[f['a']].crop((x,y,x+w,y+h)),tuple(f['trim'][:2]));im.save(OUT/(key+'.webp'),lossless=True)
 images[key]={'size':f['size'],'src':'assets/ui/'+key+'.webp'}
(OUT/'layouts.json').write_text(json.dumps({'reference':{'width':693,'height':320},'layouts':layouts,'images':images},ensure_ascii=False,sort_keys=True,separators=(',',':')))
print(f'Exported {len(images)} original sprites and {len(layouts)} layout tables')
