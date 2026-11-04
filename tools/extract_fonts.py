"""Copy original zh-Hans UI fonts and export their role substitutions and source copy."""
import argparse,json,pathlib,subprocess,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--apk',default='../origins.apk');args=a.parse_args();out=ROOT/'web/assets/fonts';out.mkdir(exist_ok=True)
with zipfile.ZipFile(args.apk) as z:
 files=['NotoSansCJKkr-Regular.otf','NotoSansCJKkr-Bold.otf','SohoGothicProMedium.ttf']
 for name in files:(out/name).write_bytes(z.read('assets/all-phone/fonts/'+name))
 sources={}
 for key,name in [('mapping','assets/gc64/all-phone/data/font_subst.lua'),('strings','assets/kr3-phone/strings/zh-Hans.lua')]:
  p=ROOT/'artifacts'/('fonts-'+key+'.lua');p.parent.mkdir(exist_ok=True);p.write_bytes(z.read(name));sources[key]=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/dump_lua.lua'),str(p)]))
 roles={entry[0]:{'name':entry[1],'metrics':entry[2]if len(entry)>2 else {}}for entry in sources['mapping']['zh-Hans']+sources['mapping']['global']}
 wanted=[f'LEVEL_{i}_{suffix}'for i in range(1,4)for suffix in ['TITLE','HISTORY','IRON_UNLOCK','MODES_UPGRADES']]+['LEVEL_MODE_CAMPAIGN','LEVEL_MODE_HEROIC','LEVEL_MODE_IRON','LEVEL_MODE_HEROIC_DESCRIPTION','LEVEL_MODE_IRON_DESCRIPTION','MENU_HUD_WAVES','INCOMING WAVE','WAVE_TOOLTIP_TAP_AGAIN']
 p=ROOT/'artifacts/fonts-hud.lua';p.write_bytes(z.read('assets/gc64/kr3-phone/data/kui_templates/game_gui.lua'))
 ui=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_ui.lua'),str(p)]))
 def find(n,id):
  if n.get('id')==id:return n
  for child in n.get('children',[]):
   result=find(child,id)
   if result:return result
 hud=find(ui,'hud_normal_view')
 (out/'catalog.json').write_text(json.dumps({'hud':{k:find(hud,k)for k in ['hud_lives_label','hud_gold_label','hud_waves_label']},'locale':'zh-Hans','files':files,'roles':roles,'text':{k:sources['strings'][k]for k in wanted}},ensure_ascii=False,sort_keys=True,separators=(',',':')))
print('Exported 3 original fonts, zh-Hans roles and campaign text')
