"""Audit new enemy controllers with -bl only; no controller execution."""
import hashlib,json,pathlib,subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1]
paths=['kr3/game_scripts.lua','all/scripts.lua','kr3/game_templates.lua','all/script_utils.lua']
source={}
for name in paths:
 p=ROOT/'reference/apk/assets/gc64'/name
 source[name]=hashlib.sha256(p.read_bytes()).hexdigest()
 if name.endswith('game_scripts.lua'):
  text=subprocess.check_output(['luajit','-bl',str(p)],text=True)
  start=text.index('-- BYTECODE -- game_scripts.lua:8777-8841');end=text.index('-- BYTECODE --',start+15)
  selected=text[start:end]
  for key in ['insaneStart','insaneLoop','hit_time','stun_duration','damage_min','damage_max']:assert '"'+key+'"'in selected,key
 elif name=='all/scripts.lua':
  text=subprocess.check_output(['luajit','-bl',str(p)],text=True)
  start=text.index('-- BYTECODE -- scripts.lua:3963-3995');end=text.index('-- BYTECODE --',start+15)
  selected=text[start:end]
  for key in ['ignore_stun','ignore_freeze','ignore_mods','F_MOD','regen']:assert '"'+key+'"'in selected,key
templates=json.loads((ROOT/'web/assets/expansion/catalog.json').read_text())['templates']
data={'scope':'enemy_ettin regeneration and self-hit/self-stun; stage 4–6 not yet released',
 'sourceSha256':source,'enemyUpdateLines':[8777,8841],'auraUpdateLines':[3963,3995],
 'regen':templates['aura_ettin_regen']['regen'],'insane':templates['enemy_ettin']['insane'],
 'rules':{'initialCooldown':'one integer random at insertion; reused after timestamp reset','trigger':'strictly greater than cooldown, no shield, between melee/walking episodes','selfDamage':'random integer clamped to [0,hp-1], source damage type','phase':'insaneStart -> animation end -> insaneLoop for stun_duration -> idle/walk','regenCadence':'at most one pulse per tick; due rejected pulse resets ts to current tick (APK branch differs from shared vanilla)','standoff':False},
 'limitations':['World tick/entity insertion order is not the complete original coroutine scheduler','external stun/freeze/mod-ban/shield inputs have adapter coverage; complete modifier producers are not restored','special death effects/blood pool remain incomplete']}
(ROOT/'tools/sources/ettin.json').write_text(json.dumps(data,ensure_ascii=False,sort_keys=True,indent=2)+'\n')
print('Audited original ettin coroutine and regen aura; controllers never executed')
