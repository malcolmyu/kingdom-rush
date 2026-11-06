"""Pinned original MeleeSword declaration and byte-identical short clips."""
import pathlib,zipfile,json,hashlib,subprocess
R=pathlib.Path(__file__).resolve().parents[1];z=zipfile.ZipFile(R.parent/'origins.apk');base='assets/kr3-phone/sounds/';pin=R/'tools/sources/melee-audio.json';old=json.loads(pin.read_text())if pin.exists()else{}
raws={k:z.read(base+k+'.lua')for k in ['extra','settings']};paths={}
for k,b in raws.items():
 p=R/'reference/apk'/base/(k+'.lua');p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b);paths[k]=p
read=lambda k:json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/dump_lua.lua',str(paths[k]),'precise'],cwd=R))
a=read('extra')['sounds']['MeleeSword'];settings=read('settings');assert a['loop']is False and a['mode']=='sequence' and a['ignore']==.45 and a['source_group']=='SWORDS';assert settings['source_groups']['SWORDS']['max_sources']==1
sha={k:hashlib.sha256(b).hexdigest()for k,b in raws.items()};clips={}
for i,f in enumerate(a['files'],1):
 b=z.read(base+'files/'+f);clips[f]=hashlib.sha256(b).hexdigest();(R/f'web/assets/melee-{i}.ogg').write_bytes(b)
source=R/'reference/apk/assets/gc64/all/sound_db.lua';sha['sound_db']=hashlib.sha256(source.read_bytes()).hexdigest()
if old:assert old['sha256']==sha and old['clipsSHA256']==clips,'Pinned audio source changed'
bc=subprocess.check_output(['/opt/homebrew/bin/luajit','-bl',str(source)],text=True)
for s in ['ignore','max_sources','soon_to_stop_source','sequence','last_play_ts']:assert s in bc,s
(R/'web/melee-audio-data.mjs').write_text('export default '+json.dumps({'ignore':a['ignore'],'gain':a['gain'],'maxSources':1,'files':[f'assets/melee-{i}.ogg'for i in range(1,len(a['files'])+1)]},sort_keys=True,separators=(',',':'))+';\n')
pin.write_text(json.dumps({'sha256':sha,'clipsSHA256':clips,'original':a,'group':settings['source_groups']['SWORDS'],'scope':'Original short MeleeSword sequence for current ordinary melee event; 450ms suppression and one SWORDS voice, explicit pause/mute/scene cancellation.','limits':['Other source audio groups and all unit-specific sounds not fully restored','Browser sound clock and cancellation lifecycle adapted; World RNG/attack timing unchanged']},indent=2,sort_keys=True)+'\n');print('Original MeleeSword 5 clips, 0.45 ignore and SWORDS max1 verified')
