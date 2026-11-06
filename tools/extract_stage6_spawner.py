"""Stage6 declarative spawner data. Never execute a gameplay controller."""
import hashlib,json,pathlib,subprocess
R=pathlib.Path(__file__).resolve().parents[1];root=R/'reference/apk/assets/gc64';proof=R/'tools/sources/stage6-spawner.json'
files=['kr3/data/levels/level06.lua','kr3/data/levels/level06_spawner.lua','all/scripts.lua','all/path_db.lua','kr3/game_scripts.lua']
sha={p:hashlib.sha256((root/p).read_bytes()).hexdigest()for p in files}
if proof.exists():assert json.loads(proof.read_text())['sha256']==sha,'Pinned spawner source changed'
bc=lambda f:subprocess.check_output(['/opt/homebrew/bin/luajit','-bl',str(root/f)],text=True)
s=bc(files[1]);assert not any(op in s for op in [' CALL',' FNEW',' GGET',' UGET']), 'Spawner must remain a pure table declaration'
# Pure original table constructor only: no controllers, requires, or globals.
data=json.loads(subprocess.check_output(['/opt/homebrew/bin/luajit','-e',"io.write(dofile('tools/encode_json.lua')(dofile('"+str(root/files[1])+"'),true))"],cwd=R))
for name,rows in data['waves'][0].items():
 assert name.startswith('Boss_Path_')
 for row in rows:
  assert len(row)==10 and row[5:7]==[False,False] and row[9] not in ['CUSTOM','PACK']
  assert set(data['points'][str(data['groups'][str(row[2])][0])])=={'path'}
checks=[(files[0],'level06.lua:22-46',['mega_spawner','level06_spawner']), (files[0],'level06.lua:48-151',['has_alive_enemies','death-complete','83']), (files[2],'scripts.lua:5785-5804',['spawner_points','spawner_waves']), (files[2],'scripts.lua:5806-6016',['manual_wave','interrupt','queue_insert','get_start_node','forced_waypoint','custom_spawn_data','frandom'])]
for file,mark,words in checks:
 s=bc(file);a=s.index('-- BYTECODE -- '+mark);b=s.find('-- BYTECODE --',a+15);part=s[a:b if b>=0 else None]
 for word in words:assert word in part,(mark,word)
(R/'web/assets/expansion/stage6-spawner.json').write_text(json.dumps(data,sort_keys=True,separators=(',',':'))+'\n')
proof.write_text(json.dumps({'sha256':sha,'ranges':[m for _,m,_ in checks],'data':data,'scope':'All four original level06 manual waves: nonsequence grouped path-only spawning, source RNG and interruption; actual World enemy insertion next simulation tick.','limits':['Boss howl caller and cart/camera/ending remain pending; campaign6 victory held','No generic CUSTOM/PACK/raise extension beyond actual level06 declarations','World path start/insert scheduling and Lua pairs/tie ordering remain adapters, not native same-seed parity']},sort_keys=True,indent=2)+'\n')
print('Original stage6 spawner declarations and controller audit passed')
