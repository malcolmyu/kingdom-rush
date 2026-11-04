"""Copy original zh-Hans UI fonts and export their role substitutions and source copy."""
import argparse,json,pathlib,subprocess,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
a=argparse.ArgumentParser();a.add_argument('--apk',default='../origins.apk');args=a.parse_args();out=ROOT/'web/assets/fonts';out.mkdir(exist_ok=True)
with zipfile.ZipFile(args.apk) as z:
 files=['NotoSansCJKkr-Regular.otf','NotoSansCJKkr-Bold.otf','SohoGothicProMedium.ttf','Comic Book Italic.ttf']
 for name in files:(out/name).write_bytes(z.read('assets/all-phone/fonts/'+name))
 sources={}
 for key,name in [('mapping','assets/gc64/all-phone/data/font_subst.lua'),('strings','assets/kr3-phone/strings/zh-Hans.lua')]:
  p=ROOT/'artifacts'/('fonts-'+key+'.lua');p.parent.mkdir(exist_ok=True);p.write_bytes(z.read(name));sources[key]=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/dump_lua.lua'),str(p)]))
 roles={entry[0]:{'name':entry[1],'metrics':entry[2]if len(entry)>2 else {}}for entry in sources['mapping']['zh-Hans']+sources['mapping']['global']}
 wanted=[k for k in sources['strings'] if k.startswith('HERO_ELVES_ARCHER_') or k.startswith('CArmor') or k.startswith('ENCYCLOPEDIA_') or k.startswith('MAP_ENCYCLOPEDIA_') or k.startswith('CSpeed') or k in ['None','%d Life','%d Lives'] or any(k.startswith(x.upper()+'_')for x in ['enemy_gnoll_reaver','enemy_gnoll_burner','enemy_gnoll_gnawer','enemy_hyena','enemy_perython'])]+[k for k in sources['strings'] if any(t in k.lower() for t in ['thunder_level_','reinforcement_level_','archer_el_','barrack_el_','mage_el_','stone_el_','upgrade','map_button_upgrades'])]+[f'LEVEL_{i}_{suffix}'for i in range(1,4)for suffix in ['TITLE','HISTORY','IRON_UNLOCK','MODES_UPGRADES']]+['LEVEL_MODE_CAMPAIGN','LEVEL_MODE_HEROIC','LEVEL_MODE_IRON','LEVEL_MODE_HEROIC_DESCRIPTION','LEVEL_MODE_IRON_DESCRIPTION','MENU_HUD_WAVES','INCOMING WAVE','WAVE_TOOLTIP_TAP_AGAIN','VICTORY','BUTTON_CONTINUE','BUTTON_RESTART','LEVEL_DEFEAT_TITLE','LEVEL_DEFEAT_GEMS_COUNT','LEVEL_DEFEAT_GEMS_COLLECTED','LEVEL_DEFEAT_ADVICE','BUTTON_QUIT','MAP_BALLON_START_HERE','MAP_BALLON_HERO_LEVELUP_DESCRIPTION','MAP_BALLON_HERO_LEVELUP_TITLE','MAP_BALLON_HERO_UNLOCKED','MAP_BUTTON_HERO_ROOM','MAP_BUTTON_ENCYCLOPEDIA','MAP_HEROROOM_HELP1','MAP_HEROROOM_HELP2','SLOT_NAME','SLOT_NEW_GAME','SLOT_DELETE_SLOT','BUTTON_CLOSE']
 for i in range(1,4):
  p=ROOT/'artifacts'/('fonts-tutorial-'+str(i)+'.lua');p.write_bytes(z.read('assets/gc64/kr3-phone/data/kui_templates/game_gui_noti_tutorial_'+str(i)+'.lua'))
  layout=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_ui.lua'),str(p)]))
  def texts(n):
   if isinstance(n,dict):
    if isinstance(n.get('text'),str):wanted.append(n['text'])
    for child in n.get('children',[]):texts(child)
  texts(layout)
 for key in ['POWER_REINFORCEMENT','POWER_THUNDERBOLT','TIP_HEROES','enemy_gnoll_reaver','enemy_gnoll_burner','enemy_gnoll_gnawer','enemy_hyena','enemy_perython']:
  texts(json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_notifications.lua'),str(ROOT/'reference/apk/assets/gc64/kr3-phone/data/game_gui_data.lua'),key])))
 data=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_notifications.lua'),str(ROOT/'reference/apk/assets/gc64/kr3-phone/data/game_gui_data.lua')]))
 for balloon in data['tutorial_balloons'].values():
  wanted.extend(balloon[k]for k in ['text','title']if k in balloon)
 p=ROOT/'artifacts/fonts-hud.lua';p.write_bytes(z.read('assets/gc64/kr3-phone/data/kui_templates/game_gui.lua'))
 ui=json.loads(subprocess.check_output(['luajit',str(ROOT/'tools/read_ui.lua'),str(p)]))
 def find(n,id):
  if n.get('id')==id:return n
  for child in n.get('children',[]):
   result=find(child,id)
   if result:return result
 hud=find(ui,'hud_normal_view')
 (out/'catalog.json').write_text(json.dumps({'hud':{k:find(hud,k)for k in ['hud_lives_label','hud_gold_label','hud_waves_label']},'locale':'zh-Hans','files':files,'roles':roles,'text':{k:sources['strings'][k]for k in wanted}},ensure_ascii=False,sort_keys=True,separators=(',',':')))
print('Exported original fonts, zh-Hans roles and campaign text')
