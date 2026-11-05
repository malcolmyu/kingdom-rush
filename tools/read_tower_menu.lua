-- Original menu declaration tables and function literals only. Never run controllers.
_=function(s)return s end
local u=require('jit.util');local encode=dofile('tools/encode_json.lua');local base='reference/apk/assets/gc64/'
local literals={};local function visit(fn)local ok,info=pcall(u.funcinfo,fn);if not ok then return end
 for i=1,info.gcconsts do local x=u.funck(fn,-i);if type(x)=='table'and(info.linedefined==3367 or info.linedefined==3487 or info.linedefined==3500)then literals[tostring(info.linedefined)..':'..tostring(i-1)]=x end
 if pcall(u.funcinfo,x)then visit(x)end end end
visit(assert(loadfile(base..'all-phone/game_gui.lua')))
KR_TARGET='phone'
dofile(base..'all/constants.lua')
io.write(encode({hudScaleSteps=HUD_SCALE_STEPS,reference={width=GUI_REF_W,height=GUI_REF_H,minAspect=MIN_SCREEN_ASPECT,maxAspect=MAX_SCREEN_ASPECT},stats={text=STATS_TYPE_TEXT,immuneAll=DAMAGE_ALL_TYPES,physical=DAMAGE_PHYSICAL,magical=DAMAGE_MAGICAL,soldier=STATS_TYPE_SOLDIER,enemy=STATS_TYPE_ENEMY,tower=STATS_TYPE_TOWER,barrack=STATS_TYPE_TOWER_BARRACK,mage=STATS_TYPE_TOWER_MAGE},menus=dofile(base..'kr3/data/tower_menus_data.lua'),literals=literals}))
