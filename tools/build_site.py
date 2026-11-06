"""Copy the dependency-free browser app into a deployable static build."""
import json,pathlib,shutil,hashlib,re,gzip
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'build';OUT.mkdir(exist_ok=True)
(OUT/'.nojekyll').touch()
for name in ['index.html','style.css']+[p.name for p in (ROOT/'web').glob('*.mjs')]:
 shutil.copy2(ROOT/'web'/name,OUT/name)
# Reject incomplete runtime packages before producing a deployable manifest.
for module in OUT.glob('*.mjs'):
 for relative in re.findall(r"(?:from\s*|import\s*)['\"](\./[^'\"]+)",module.read_text()):
  if not (module.parent/relative).is_file():raise RuntimeError(f'Missing runtime import {relative} from {module.name}')
catalog=json.loads((ROOT/'web/assets/catalog.json').read_text())
assets={'campaign-release.json','book-hover.ogg','encyclopedia-turn.ogg','upgrade-buy.ogg','upgrade-select.ogg','upgrade-confirm.ogg','map-new-flag.ogg','map-new-road.ogg','transition-open.ogg','transition-close.ogg','quest-completed.ogg','quest-failed.ogg','win-star.ogg','notification-open.ogg','notification-close.ogg','notification-icon.ogg','spell-refresh.ogg','catalog.json','ObelixPro.ttf','coin.ogg','build.ogg','arrow.ogg','victory.ogg','battle.ogg','menu.ogg','world.ogg','door.ogg','melee.ogg','barrack.ogg','thunder1.ogg','thunder2.ogg','thunder3.ogg','levelup.ogg','double-strike.ogg','nimble.ogg'}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/fonts').rglob('*')if p.is_file()}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/ui').rglob('*')if p.is_file()}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/book').rglob('*')if p.is_file()}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/battle-top').rglob('*')if p.is_file()}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/desktop-guidance').rglob('*')if p.is_file()}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/expansion').rglob('*')if p.is_file()}
assets|={str(p.relative_to(ROOT/'web/assets'))for group in ['stage5-catapult','stage5-alleria','battle-multi','blade'] for p in (ROOT/'web/assets'/group).rglob('*')if p.is_file()}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/arcane').rglob('*')if p.is_file()}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/tower-groups').rglob('*')if p.is_file()}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/battle-bottom').rglob('*')if p.is_file()}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/desktop-map').rglob('*')if p.is_file()}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/options').rglob('*')if p.is_file()}
assets|={str(p.relative_to(ROOT/'web/assets'))for p in (ROOT/'web/assets/desktop-title').rglob('*')if p.is_file()}
assets|={'images/'+f['a']for f in catalog['frames'].values()}
assets|={'menu/'+n+'.webp'for n in ['start','logo','world']}
assets|={f'levels/{i:02}-{m}.json'for i in range(1,4)for m in ['campaign','heroic','iron']}
assets|={f'levels/map{i:02}.webp'for i in range(1,4)}
for name in assets:
 p=OUT/'assets'/name;p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(ROOT/'web/assets'/name,p)
from optimize_runtime import optimize
optimize(OUT)
# Resolve static imports up front to remove deep ESM request waterfalls on cold
# connections. Preload the title background while metadata is downloading.
# Compress declaration metadata losslessly; raw JSON remains a compatibility fallback.
metadata=['assets/catalog.json','assets/ui/layouts.json','assets/fonts/catalog.json','assets/desktop-map/catalog.json','assets/arcane/catalog.json','assets/blade/catalog.json','assets/stage5-catapult/catalog.json','assets/stage5-alleria/catalog.json','assets/tower-groups/catalog.json','assets/tower-groups/entry/catalog.json']
metadata += ['assets/expansion/'+p.name for p in (OUT/'assets/expansion').glob('*.json') if p.name!='catalog.json']
for relative in metadata:
 p=OUT/relative;(OUT/(relative+'.gz')).write_bytes(gzip.compress(p.read_bytes(),compresslevel=9,mtime=0))
html=(OUT/'index.html').read_text().replace('<html ', '<html data-packed-metadata="gzip" ')
preloads=''.join(f'<link rel="modulepreload" href="{p.name}">\n'for p in sorted(OUT.glob('*.mjs')))
preloads+='<link rel="preload" as="image" href="assets/desktop-title/main_menu_bg.webp" fetchpriority="high">\n'
(OUT/'index.html').write_text(html.replace('</head>',preloads+'</head>'))
manifest={'version':json.loads((ROOT/'package.json').read_text())['version'],'stages':json.loads((ROOT/'web/assets/campaign-release.json').read_text())['playableStages'],'modes':['campaign','heroic','iron'],'files':{str(p.relative_to(OUT)):hashlib.sha256(p.read_bytes()).hexdigest()for p in OUT.rglob('*')if p.is_file() and p.name!='build-manifest.json'}}
(OUT/'build-manifest.json').write_text(json.dumps(manifest,indent=2))
print(f'Built {len(manifest["files"])} files; {sum(p.stat().st_size for p in OUT.rglob("*")if p.is_file()):,} bytes in build/')
