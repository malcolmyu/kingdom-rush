"""Build released stage4/5 indexes from audited original declarations; stage6 stays closed."""
import hashlib,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
read=lambda p:json.loads((ROOT/p).read_text())
pack=read('web/assets/expansion/catalog.json');text=read('web/assets/fonts/catalog.json')['text'];levels=[];files={}
for id in [4,5]:
 entry=next(x for x in pack['levels']if x['id']==id)
 level={'id':id,'title':text[f'LEVEL_{id}_TITLE'],'size':entry['size'],'modes':{}}
 for mode in ['campaign','heroic','iron']:
  path=f'web/assets/expansion/{id:02}-{mode}.json';d=read(path);level['modes'][mode]={**entry['modes'][mode],'rules':d['rules']};files[path]=hashlib.sha256((ROOT/path).read_bytes()).hexdigest()
 levels.append(level)
result={'playableStages':5,'levels':levels,'source':{'kind':'original released declarations; no controller execution','files':files,'apkFiles':{k:v for k,v in pack['source']['files'].items()if any(f'level{i:02}'in k for i in [4,5])}}}
(ROOT/'web/assets/campaign-release.json').write_text(json.dumps(result,ensure_ascii=False,sort_keys=True,separators=(',',':')))
book={k:v for source in [pack['templates'],read('web/assets/arcane/catalog.json')['templates'],read('web/assets/blade/catalog.json')['templates']] for k,v in source.items() if k in ['enemy_ettin','enemy_gnoll_blighter','enemy_twilight_elf_harasser','tower_arcane','arrow_arcane','tower_blade','soldier_blade']}
(ROOT/'web/campaign-release.mjs').write_text('// Generated from audited original release declarations. Stage6 remains closed.\nexport const PLAYABLE_STAGE_COUNT=5;\nexport const RELEASED_LEVELS='+json.dumps(result['levels'],ensure_ascii=False,sort_keys=True,separators=(',',':'))+';\nexport const RELEASED_BOOK_TEMPLATES='+json.dumps(book,ensure_ascii=False,sort_keys=True,separators=(',',':'))+';\n')
print('Prepared original released stage4/5 index; stage6 remains closed')

index=read('web/assets/expansion/index.json')
for stage in index['levels']:stage['releaseReady']=stage['id']<=result['playableStages']
(ROOT/'web/assets/expansion/index.json').write_text(json.dumps(index,ensure_ascii=False,sort_keys=True,separators=(',',':')))
