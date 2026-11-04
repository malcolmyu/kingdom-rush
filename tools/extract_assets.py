"""Extract the first-level reference data and a compact atlas from the supplied APK.
Requires Python Pillow, texture2ddecoder and LuaJIT. Run from repository root.
"""
import base64, hashlib, json, pathlib, re, struct, subprocess, zipfile
from PIL import Image, ImageDraw
import texture2ddecoder

ROOT = pathlib.Path(__file__).resolve().parents[1]
APK = ROOT / 'origins.apk'
OUT = ROOT / 'web/assets'
OUT.mkdir(parents=True, exist_ok=True)
z = zipfile.ZipFile(APK)
IP = 'assets/kr3-phone/images/iphonehd/'

def lua(name):
    path = ROOT / 'reference/apk' / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(z.read(name))
    r = subprocess.run(['luajit', 'tools/dump_lua.lua', str(path)], check=True, capture_output=True, text=True)
    return json.loads(r.stdout)

groups = ['go_towers','go_enemies_elven_woods','go_hero_elves_archer','go_stage01','go_stages_elven_woods','gui_common','gui_portraits']
meta = {}
for group in groups:
    for key,v in lua(IP+group+'.lua').items():
        meta[key] = v
        for alias in v['alias']:
            meta[alias] = v

prefixes = ['gnoll_reaver_', 'gnoll_burner_', 'archer_hero_', 'archer_shooter_',
            'artillery_thrower_', 'mage_tower_shooter_', 'mage_towers_layer2_',
            'barracks_towers_layer2_', 'soldiers_123_', 'reinforce_A0_',
            'effect_buildSmoke_', 'effect_sellSmoke_', 'fx_coin_jump_',
            'stage1_gandalf_', 'stage1_water_', 'water_sparks_',
            'artillery_thrower_explosion_', 'waveFlag_', 'lightning_', 'ray_']
exact = ['build_terrain_0001','archer_towers_0001','barracks_towers_layer1_0001',
         'mage_towers_layer1_0001','artillery_base_0001','artillery_thrower_stones_0001',
         'tower_preview_archer','tower_preview_barracks','tower_preview_mage','tower_preview_artillery',
         'hero_portraits_0001','hero_selected','hud_background','hud_buttons_0001','hud_buttons_0002',
         'portraits_power_lightening','power_portrait_reinforcement_0001','portraits_power_hero_0001',
         'power_rank_0001','price_tag','price_tag_disabled','ico_sell_0001','victoryStars_0001',
         'victoryStars_star_0001','victoryBadges_0001','button_restart_0001','icon_0001',
         'arrow','mage_proy_0001','artillery_thrower_proy','rally_feedback_0001','menu_bottom_bg_left_circle']
keys = [k for k in meta if k in exact or any(k.startswith(p) for p in prefixes)]
images = {}
atlas = Image.new('RGBA',(4096,4096))
x=y=row_h=0
frames = {}
packed = {}
for key in keys:
    v = meta[key]; q=v['f_quad']; identity=(v['a_name'],*q)
    if identity not in packed:
        if v['a_name'] not in images:
            import io
            images[v['a_name']] = Image.open(io.BytesIO(z.read(IP+v['a_name']))).convert('RGBA')
        w,h=q[2:]
        if x+w+2>4096: x=0;y+=row_h+2;row_h=0
        if y+h>4096: raise RuntimeError('Atlas overflow')
        atlas.paste(images[v['a_name']].crop((q[0],q[1],q[0]+w,q[1]+h)),(x,y))
        packed[identity]=[x,y,w,h];x+=w+2;row_h=max(row_h,h)
    frames[key]={'q':packed[identity],'size':v['size'],'trim':v['trim']}
atlas=atlas.crop((0,0,4096,y+row_h))
atlas.save(OUT/'sprites.png', optimize=True)
b=z.read(IP+'go_stage01_bg-1.pkm');fmt,w,h,ow,oh=struct.unpack('>5H',b[6:16])
Image.frombytes('RGBA',(w,h),texture2ddecoder.decode_etc1(b[16:],w,h),'raw','BGRA').crop((0,0,ow,oh)).convert('RGB').save(OUT/'map.webp',quality=96)
data = { 'frames':frames, 'level':lua('assets/gc64/kr3/data/levels/level01_data.lua'),
         'paths':lua('assets/gc64/kr3/data/levels/level01_paths.lua')['paths'],
         'waves':lua('assets/gc64/kr3/data/waves/level01_waves_campaign.lua'),
         'animations':lua('assets/gc64/kr3/data/game_animations.lua')['animations'] }
(OUT/'data.json').write_text(json.dumps(data,separators=(',',':')),encoding='utf-8')
(OUT/'ObelixPro.ttf').write_bytes(z.read('assets/all-phone/fonts/ObelixPro.ttf'))
for name,source in {'build':'Sound_TowerBuilding.ogg','coin':'Sound_Coins.ogg','arrow':'Sound_ArrowRelease2.ogg','victory':'kro_bgmusic_victory[master_03-11].ogg','battle':'kro_bgmusic_t1_battle1_v4[master_03-11].ogg'}.items():
    p='assets/kr3-phone/sounds/files/'+source
    if p in z.namelist(): (OUT/(name+'.ogg')).write_bytes(z.read(p))
(ROOT/'reference/apk-manifest.json').write_text(json.dumps({'file':'origins.apk','bytes':APK.stat().st_size,'sha256':hashlib.sha256(APK.read_bytes()).hexdigest(),'source':'User-provided APKPure download URL','assets':len(frames),'version_claimed_by_download':'5.8.02'},indent=2))
print(f'Extracted {len(frames)} frames, {len(packed)} unique images, atlas {atlas.size}')

# A labelled sheet makes selecting and verifying UI sprites reproducible.
names=[k for k in exact if k in frames]
sheet=Image.new('RGB',(800,((len(names)+4)//5)*160),'#54705a');draw=ImageDraw.Draw(sheet)
for i,k in enumerate(names):
    f=frames[k];qx,qy,w,h=f['q'];im=atlas.crop((qx,qy,qx+w,qy+h));im.thumbnail((140,115));cx=(i%5)*160;cy=(i//5)*160
    sheet.paste(im,(cx+(160-im.width)//2,cy),im);draw.text((cx+3,cy+118),k[:22],fill='white')
sheet.save(ROOT/'reference/sprite-contact.jpg')
