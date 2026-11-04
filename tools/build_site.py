"""Copy the dependency-free browser app into a deployable static build."""
import json,pathlib,shutil,hashlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'build';OUT.mkdir(exist_ok=True)
(OUT/'.nojekyll').touch()
for name in ['index.html','style.css','campaign.mjs','domain.mjs','repository.mjs','renderer.mjs','ui.mjs','spells.mjs','progression.mjs','hero-data.mjs','map.mjs','map-flags.mjs','wave-flags.mjs','battle-portraits.mjs','tutorials.mjs','guidance.mjs','enemy-notifications.mjs','notification-motion.mjs','hud-motion.mjs','wave-reward.mjs','wave-rules.mjs','results.mjs']:
 shutil.copy2(ROOT/'web'/name,OUT/name)
catalog=json.loads((ROOT/'web/assets/catalog.json').read_text())
assets={'quest-completed.ogg','quest-failed.ogg','win-star.ogg','notification-open.ogg','notification-close.ogg','notification-icon.ogg','spell-refresh.ogg','catalog.json','ObelixPro.ttf','coin.ogg','build.ogg','arrow.ogg','victory.ogg','battle.ogg','menu.ogg','world.ogg','door.ogg','melee.ogg','barrack.ogg','thunder1.ogg','thunder2.ogg','thunder3.ogg','levelup.ogg','double-strike.ogg','nimble.ogg'}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/fonts').rglob('*')if p.is_file()}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/ui').rglob('*')if p.is_file()}
assets|={'images/'+f['a']for f in catalog['frames'].values()}
assets|={'menu/'+n+'.webp'for n in ['start','logo','world']}
assets|={f'levels/{i:02}-{m}.json'for i in range(1,4)for m in ['campaign','heroic','iron']}
assets|={f'levels/map{i:02}.webp'for i in range(1,4)}
for name in assets:
 p=OUT/'assets'/name;p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(ROOT/'web/assets'/name,p)
manifest={'version':json.loads((ROOT/'package.json').read_text())['version'],'stages':3,'modes':['campaign','heroic','iron'],'files':{str(p.relative_to(OUT)):hashlib.sha256(p.read_bytes()).hexdigest()for p in OUT.rglob('*')if p.is_file() and p.name!='build-manifest.json'}}
(OUT/'build-manifest.json').write_text(json.dumps(manifest,indent=2))
print(f'Built {len(manifest["files"])} files; {sum(p.stat().st_size for p in OUT.rglob("*")if p.is_file()):,} bytes in build/')
