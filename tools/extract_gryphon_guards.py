"""Audit original upper guard actor/aura/arrow. Never run controllers."""
import hashlib,json,pathlib,subprocess
R=pathlib.Path(__file__).resolve().parents[1];root=R/'reference/apk/assets/gc64'
checks=[('kr3/game_scripts.lua','game_scripts.lua:17560-17563',['is_inside_ellipse','275','454','175','530','376','150']),('kr3/game_scripts.lua','game_scripts.lua:17586-17644',['wave_group_number','hidden_min','hidden_max','show_pos','show','arrived','idle_time_to_hide','disabled']),('all/script_utils.lua','script_utils.lua:834-868',['new','walk','F_ALL']),('all/utils.lua','utils.lua:473-519',['max_speed','arrived']),('all/systems.lua','systems.lua:1288-1386',['reverse','clamp']),('kr3/game_scripts.lua','game_scripts.lua:17554-17557',['is_inside_ellipse','300','627','125','0.64','560','382','95']),('kr3/game_scripts.lua','game_scripts.lua:17568-17581',['frandom','patch_cooldown_min','patch_cooldown_max','cooldown','y_wait','fts']),('all/script_utils.lua','script_utils.lua:1084-1167',['max_track_distance','bullet_start_offset','shoot_time','queue_insert']),('all/scripts.lua','scripts.lua:1947-1987',['prediction_error','frandom','initial_parabola_speed']),('all/scripts.lua','scripts.lua:1989-2130',['last_pos','hit_distance','unit_dodges']),('all/utils.lua','utils.lua:794-857',['nodes_to_goal','find_foremost_enemy'] )]
for p,mark,fields in checks:
 b=subprocess.check_output(['/opt/homebrew/bin/luajit','-bl',str(root/p)],text=True);i=b.index('-- BYTECODE -- '+mark);j=b.find('-- BYTECODE --',i+15);part=b[i:j]
 # Comparator lives in a nested function emitted before its parent.
 for f in fields:
  assert f in (b if f in ['nodes_to_goal','find_foremost_enemy'] else part),(mark,f)
templates=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','tools/read_templates.lua',str(root),'precise'],cwd=R))
keys=['soldier_gryphon_guard_upper','aura_soldier_gryphon_guard_upper','arrow_soldier_gryphon_guard','soldier_gryphon_guard_lower','aura_soldier_gryphon_guard_lower']
selected={k:templates[k] for k in keys}
assert selected[keys[0]]['health']['immune_to']==16777215
assert selected[keys[0]]['vis']['bans']==3
assert 'disabled' not in selected['soldier_gryphon_guard_lower']['ranged']['attacks'][0]
assert 'show' not in selected['aura_soldier_gryphon_guard_lower']
assert selected[keys[2]]['bullet']['damage_min']==selected[keys[2]]['bullet']['damage_max']==10
data={'upperRegions':[[300,627,125,.64],[560,382,95,50/95]],'lowerRegions':[[275,454,175,135/175],[530,376,150,55/150]]}
(R/'web/gryphon-guard-data.mjs').write_text('// Original upper/lower ranged filter functions; see tools/sources/gryphon-guards.json.\nexport default '+json.dumps(data,separators=(',',':'),sort_keys=True)+';\n')
files=sorted(set([p for p,_,_ in checks]+['kr3/game_templates.lua','kr3/data/levels/level06_data.lua']))
(R/'tools/sources/gryphon-guards.json').write_text(json.dumps({'sha256':{p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in files},'ranges':[m for _,m,_ in checks],'templates':selected,'rules':data,'scope':'upper guards plus lower guard wave gate/reveal/retreat, original area filters/cooldowns and predicted physical arrows','limits':['Level06 gryphon events remain pending; lower movement/aura yields adapted to World ticks','World path distance converted to source nodes; native scheduler/queues/IDs not identical','Actors isolated from ordinary reinforcement expiry/respawn; complete generic aura/modifier/visibility chain remains pending','Blood/pop/water miss FX remain pending']},sort_keys=True,indent=2)+'\n')
print('Original guards/filter/aura/arrow audit passed')
