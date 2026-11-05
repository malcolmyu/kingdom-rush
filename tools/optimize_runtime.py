"""Lossless deployment assets: supported tower atlas and full-font WOFF2.

Source extraction stays untouched. Future frames retain their original atlas;
only the campaign preload list uses the compact, verified sheet.
"""
import json,re,sys,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT.parent/'.tools/python'))
from PIL import Image
from fontTools.ttLib import TTFont
from fontTools import subset

def optimize(out):
 catalog=json.loads((out/'assets/catalog.json').read_text())
 frames=catalog['frames'];animations=catalog['animations'];keep=set()
 # Resolve original template names/prefixes and literal renderer effects.
 def add(s):
  if s in frames:keep.add(s)
  for key,a in animations.items():
   if key==s or key.startswith(s+'_'):
    keep.update(k for k in frames if k.startswith(a.get('prefix','!')+'_'))
  if '%04i' in s:
   pattern=re.escape(s).replace('%04i',r'\d{4}')
   keep.update(k for k in frames if re.fullmatch(pattern,k))
 def walk(o):
  if isinstance(o,str):add(o)
  elif isinstance(o,dict):
   for v in o.values():walk(v)
  elif isinstance(o,list):
   for v in o:walk(v)
 walk(catalog['templates'])
 for p in (ROOT/'web').glob('*.mjs'):
  for s in re.findall(r"['\"]([a-zA-Z0-9_%-]+)['\"]",p.read_text()):
   if s in frames or s in animations:add(s)
   if len(s)>3 and (s.endswith('_') or s[-1:].isdigit()):keep.update(k for k in frames if k.startswith(s))
 keys=sorted((k for k in keep if frames[k]['a'].startswith('go_towers-')),key=lambda k:(-frames[k]['q'][3],k))
 def pack(keys,name):
  originals={n:Image.open(out/'assets/images'/n).convert('RGBA') for n in {frames[k]['a']for k in keys}}
  # Shelf packing with a transparent gutter; original size/trim/anchor unchanged.
  width=2048;x=y=row=0;placements={}
  for key in keys:
   q=frames[key]['q'];w,h=q[2:]
   if x+w+2>width:x=0;y+=row+2;row=0
   placements[key]=(x,y);x+=w+2;row=max(row,h)
  atlas=Image.new('RGBA',(width,y+row+2))
  for key,(x,y) in placements.items():
   f=frames[key];qx,qy,w,h=f['q'];atlas.paste(originals[f['a']].crop((qx,qy,qx+w,qy+h)),(x,y))
  path=out/'assets/images'/name
  atlas.save(path,lossless=True,exact=True,method=6)
  # Verify every packed frame against decoded source pixels, not just dimensions.
  check=Image.open(path).convert('RGBA')
  for key,(x,y) in placements.items():
   f=frames[key];qx,qy,w,h=f['q'];source=originals[f['a']].crop((qx,qy,qx+w,qy+h))
   if check.crop((x,y,x+w,y+h)).tobytes()!=source.tobytes():raise RuntimeError('Atlas pixel mismatch: '+key)
   f['a']=name;f['q']=[x,y,w,h]
  return path
 path=pack(keys,'go_towers_campaign.webp')
 catalog['campaignTowerSheets']=['go_towers_campaign.webp']
 enemy_prefixes={sprite['prefix']for key,t in catalog['templates'].items()if key.startswith('enemy_')for sprite in t.get('render',{}).get('sprites',[])if sprite.get('prefix')}
 enemy_keys=sorted((k for k,f in frames.items()if f['a'].startswith('go_enemies_elven_woods-')and any(k.startswith(p+'_')for p in enemy_prefixes)),key=lambda k:(-frames[k]['q'][3],k))
 enemy_path=pack(enemy_keys,'go_enemies_campaign.webp')
 catalog['campaignEnemySheets']=['go_enemies_campaign.webp']
 print('Lossless supported enemies:',len(enemy_keys),'frames,',enemy_path.stat().st_size,'bytes')
 # GUI frames load on demand through Renderer.icon. Keep animation frames in
 # their original animation group, and static icons in independently lazy files.
 # This preserves the entire catalog without downloading unrelated menu art.
 gui_keys={k for k,f in frames.items()if f['a'].startswith(('gui_common-','gui_portraits-'))}
 groups={}
 for key in sorted(gui_keys):
  animation=next((a['prefix']for a in animations.values()if key.startswith(a.get('prefix','!')+'_')),None)
  groups.setdefault(animation or key,[]).append(key)
 (out/'assets/images/gui').mkdir(exist_ok=True)
 gui_bytes=0
 for name,group in groups.items():
  # Keep small lazy sheets compact rather than adding a 2048px blank row.
  originals={n:Image.open(out/'assets/images'/n).convert('RGBA')for n in {frames[k]['a']for k in group}}
  width=max(frames[k]['q'][2]for k in group);height=sum(frames[k]['q'][3]+2 for k in group)
  sheet=Image.new('RGBA',(width,height));offsets={};y=0
  for key in group:
   f=frames[key];x0,y0,w,h=f['q'];sheet.paste(originals[f['a']].crop((x0,y0,x0+w,y0+h)),(0,y));offsets[key]=y;y+=h+2
  target=out/'assets/images/gui'/(name+'.webp');sheet.save(target,lossless=True,exact=True,method=6);check=Image.open(target).convert('RGBA')
  for key,y in offsets.items():
   f=frames[key];x0,y0,w,h=f['q']
   if check.crop((0,y,w,y+h)).tobytes()!=originals[f['a']].crop((x0,y0,x0+w,y0+h)).tobytes():raise RuntimeError('GUI pixel mismatch: '+key)
   f['a']='gui/'+name+'.webp';f['q']=[0,y,w,h]
  gui_bytes+=target.stat().st_size
 print('Lossless lazy GUI:',len(gui_keys),'frames in',len(groups),'groups,',gui_bytes,'bytes')
 map_keys=sorted(k for k in frames if k.startswith(('mapFlag','mapDot','mapDeco')))
 map_path=pack(map_keys,'screen_map_campaign.webp')
 catalog['mapSheets']=['screen_map_campaign.webp']
 (out/'assets/catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,separators=(',',':')))
 css=(out/'style.css').read_text();font_bytes=0
 # This game has no free-text input. Keep every character in shipped copy/code,
 # including the complete localized catalog, rather than downloading unrelated
 # Korean/Japanese/CJK glyphs. Preserve original global metrics and outlines.
 corpus=''.join(chr(i) for i in range(32,127))
 for root in [ROOT/'web']:
  for p in root.rglob('*'):
   if p.suffix in ('.mjs','.json','.html','.css'):corpus+=p.read_text()
 for p in (out/'assets/fonts').iterdir():
  if p.suffix not in ('.otf','.ttf'):continue
  font=TTFont(p,recalcBBoxes=False);before=font.getBestCmap();font_corpus=corpus
  if p.name=='JIMOJW.ttf':
   # This face serves book capitals/seal and the audited desktop map buttons.
   # Derive its complete glyph set from the published copy, not an arbitrary sample.
   strings=json.loads((out/'assets/fonts/catalog.json').read_text())['text']
   book=json.loads((out/'assets/book/catalog.json').read_text())
   capitals=[v[:1]for k,v in strings.items()if k.endswith('_HISTORY')or k in ['LEVEL_MODE_HEROIC_DESCRIPTION','LEVEL_MODE_IRON_DESCRIPTION']]
   map_ui=json.loads((out/'assets/desktop-map/catalog.json').read_text())['hud'].get('actions',{})
   action_text=''.join(map_ui.get('text',{}).get(b['key'],'')for b in map_ui.get('buttons',[]))
   options=json.loads((out/'assets/options/catalog.json').read_text())
   action_text+=''.join(options['text'][k]for k in options['jimoKeys'])
   delete_text=''.join(json.loads((out/'assets/desktop-title/delete.json').read_text())['text'].values())
   if not set(map(ord,delete_text))<=before.keys():raise RuntimeError('JIMO missing delete dialog glyphs')
   action_text+=delete_text+''.join(json.loads((out/'assets/desktop-title/options.json').read_text())['text'].values())
   font_corpus=''.join(chr(i)for i in range(32,127))+''.join(capitals)+book['text']['BUTTON_TO_BATTLE_1']+book['text']['BUTTON_TO_BATTLE_2']+action_text
  required=set(map(ord,font_corpus))&before.keys()
  metrics=(font['hhea'].ascent,font['hhea'].descent,font['head'].yMin,font['head'].yMax)
  options=subset.Options();options.recalc_bounds=False;options.name_IDs=['*']
  sub=subset.Subsetter(options=options);sub.populate(unicodes=required);sub.subset(font)
  if not required<=font.getBestCmap().keys():raise RuntimeError('Font lost shipped text: '+p.name)
  if metrics!=(font['hhea'].ascent,font['hhea'].descent,font['head'].yMin,font['head'].yMax):raise RuntimeError('Font metrics changed: '+p.name)
  font.flavor='woff2';target=p.with_suffix('.woff2');font.save(target);font.close()
  css=css.replace(p.name,target.name).replace("format('opentype')","format('woff2')").replace("format('truetype')","format('woff2')")
  font_bytes+=p.stat().st_size-target.stat().st_size;p.unlink()
 (out/'style.css').write_text(css)
 print(f'Lossless campaign atlas: {len(keys)} frames, {path.stat().st_size:,} bytes; map atlas {map_path.stat().st_size:,} bytes; font transfer saved {font_bytes:,} bytes')

if __name__=='__main__':optimize(pathlib.Path(sys.argv[1]))
