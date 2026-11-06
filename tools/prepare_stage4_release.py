"""Build the stage4 release index from already audited original declarations."""
import hashlib,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
read=lambda p:json.loads((ROOT/p).read_text())
pack=read('web/assets/expansion/catalog.json');text=read('web/assets/fonts/catalog.json')['text'];entry=next(x for x in pack['levels']if x['id']==4)
level={'id':4,'title':text['LEVEL_4_TITLE'],'size':entry['size'],'modes':{}}
files={}
for mode in ['campaign','heroic','iron']:
 path='web/assets/expansion/04-'+mode+'.json';d=read(path);level['modes'][mode]={**entry['modes'][mode],'rules':d['rules']};files[path]=hashlib.sha256((ROOT/path).read_bytes()).hexdigest()
result={'playableStages':4,'levels':[level],'source':{'kind':'original stage4 declarations; no controller execution','files':files,'apkFiles':{k:v for k,v in pack['source']['files'].items()if 'level04' in k}}}
(ROOT/'web/assets/campaign-release.json').write_text(json.dumps(result,ensure_ascii=False,sort_keys=True,separators=(',',':')))
(ROOT/'web/campaign-release.mjs').write_text('// Generated from audited original release declarations. Stages5/6 remain closed.\nexport const PLAYABLE_STAGE_COUNT=4;\nexport const RELEASED_LEVELS='+json.dumps(result['levels'],ensure_ascii=False,sort_keys=True,separators=(',',':'))+';\n')
print('Prepared original stage4 index; only four released stages')

index=read('web/assets/expansion/index.json')
for stage in index['levels']:stage['releaseReady']=stage['id']<=result['playableStages']
(ROOT/'web/assets/expansion/index.json').write_text(json.dumps(index,ensure_ascii=False,sort_keys=True,separators=(',',':')))
