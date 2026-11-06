"""Build released stage4/5/6 indexes from audited original declarations; including stage6."""
import hashlib,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
read=lambda p:json.loads((ROOT/p).read_text())
pack=read('web/assets/expansion/catalog.json');text=read('web/assets/fonts/catalog.json')['text'];levels=[];files={}
for id in [4,5,6]:
 entry=next(x for x in pack['levels']if x['id']==id)
 level={'id':id,'title':text[f'LEVEL_{id}_TITLE'],'size':entry['size'],'modes':{}}
 for mode in ['campaign','heroic','iron']:
  path=f'web/assets/expansion/{id:02}-{mode}.json';d=read(path);level['modes'][mode]={**entry['modes'][mode],'rules':d['rules']};files[path]=hashlib.sha256((ROOT/path).read_bytes()).hexdigest()
 levels.append(level)
result={'playableStages':6,'levels':levels,'source':{'kind':'original released declarations; no controller execution','files':files,'apkFiles':{k:v for k,v in pack['source']['files'].items()if any(f'level{i:02}'in k for i in [4,5,6])}}}
(ROOT/'web/assets/campaign-release.json').write_text(json.dumps(result,ensure_ascii=False,sort_keys=True,separators=(',',':')))
book={k:v for source in [pack['templates'],read('web/assets/arcane/catalog.json')['templates'],read('web/assets/blade/catalog.json')['templates'],read('web/assets/wild-magus/catalog.json')['templates']] for k,v in source.items() if k in ['enemy_ettin','enemy_gnoll_blighter','enemy_twilight_elf_harasser','tower_arcane','arrow_arcane','tower_blade','soldier_blade','tower_wild_magus','bolt_wild_magus']}
# These declarations are for encyclopedia stats only. Runtime levels atomically
# replace them with full source templates before any World is constructed.
for key,t in list(book.items()):
 fields=['info','tower','barrack','attacks'] if key.startswith('tower_') else ['bullet'] if 'bullet' in t else ['info','health','motion','enemy','unit','melee','ranged']
 book[key]={k:t[k] for k in fields if k in t}
 if 'attacks' in book[key]:book[key]['attacks']={'range':t['attacks']['range'],'list':[t['attacks']['list'][0]]}
for key,t in book.items():
 for component,fields in {'info':['enc_icon','i18n_key'],'tower':['type','damage_factor'],'barrack':['soldier_type'],'health':['hp_max','armor','magic_armor','dead_lifetime'],'motion':['max_speed'],'enemy':['lives_cost'],'unit':['damage_factor'],'bullet':['damage_min','damage_max']}.items():
  if component in t:t[component]={k:v for k,v in t[component].items() if k in fields}
 for component in ['melee','ranged']:
  if component in t:t[component]={'attacks':[{k:v for k,v in a.items() if k in ['damage_min','damage_max']} for a in t[component]['attacks'] if 'damage_min' in a]}
 if 'attacks' in t:t['attacks']['list']=[{k:v for k,v in a.items() if k in ['damage_min','damage_max','bullet','cooldown','loops']} for a in t['attacks']['list']]
(ROOT/'web/campaign-release.mjs').write_text('// Generated from audited original release declarations. Stage6 release declarations.\nexport const PLAYABLE_STAGE_COUNT=6;\nexport const RELEASED_LEVELS='+json.dumps(result['levels'],ensure_ascii=False,sort_keys=True,separators=(',',':'))+';\nexport const RELEASED_BOOK_TEMPLATES='+json.dumps(book,ensure_ascii=False,sort_keys=True,separators=(',',':'))+';\n')
print('Prepared original released stage4/5/6 index; stage6 included')

index=read('web/assets/expansion/index.json')
for stage in index['levels']:stage['releaseReady']=stage['id']<=result['playableStages']
(ROOT/'web/assets/expansion/index.json').write_text(json.dumps(index,ensure_ascii=False,sort_keys=True,separators=(',',':')))
