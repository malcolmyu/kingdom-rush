"""Build a dependency-free, offline HTML playable from the browser source."""
import base64,json,pathlib,re
ROOT=pathlib.Path(__file__).resolve().parents[1]
web=ROOT/'web';out=ROOT/'dist';out.mkdir(exist_ok=True)
def uri(name,mime):return 'data:'+mime+';base64,'+base64.b64encode((web/'assets'/name).read_bytes()).decode()
css=(web/'style.css').read_text().replace("url('assets/ObelixPro.ttf')",'url('+uri('ObelixPro.ttf','font/ttf')+')')
js=(web/'engine.mjs').read_text().replace('export ','')+'\n'+(web/'game.mjs').read_text().replace("import {World,TOWERS,distance} from './engine.mjs';",'')
bootstrap='window.__ORIGINS_DATA__='+ (web/'assets/data.json').read_text()+';\n'
bootstrap+='window.__ORIGINS_SPRITES__='+json.dumps(uri('sprites.png','image/png'))+';\n'
bootstrap+='window.__ORIGINS_MAP__='+json.dumps(uri('map.webp','image/webp'))+';\n'
bootstrap+='window.__ORIGINS_AUDIO__='+json.dumps({n:uri(n+'.ogg','audio/ogg') for n in ['coin','arrow','victory','battle','build']})+';\n'
html=(web/'index.html').read_text().replace('<link rel="stylesheet" href="style.css">','<style>'+css+'</style>').replace('<script type="module" src="game.mjs"></script>','<script>'+bootstrap+'</script>\n<script type="module">'+js+'</script>')
(out/'灰鸦港口试玩.html').write_text(html,encoding='utf-8')
print('Offline HTML:',(out/'灰鸦港口试玩.html').stat().st_size,'bytes')
