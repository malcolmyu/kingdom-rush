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
layouts={'title':slots,'slot':read('slot_view'),'slotTab':read('slot_tab_view'),'level':find(world,'level_view'),'pause':find(game,'pause_view'),'victory':find(game,'victory_view'),'defeat':find(game,'defeat_view')}
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
keys.add('mapFlag_star_0018')
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
