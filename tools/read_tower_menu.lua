-- Original menu declaration tables and function literals only. Never run controllers.
_=function(s)return s end
local u=require('jit.util');local encode=dofile('tools/encode_json.lua');local base='reference/apk/assets/gc64/'
local literals={};local function visit(fn)local ok,info=pcall(u.funcinfo,fn);if not ok then return end
 for i=1,info.gcconsts do local x=u.funck(fn,-i);if type(x)=='table'and(info.linedefined==3367 or info.linedefined==3487 or info.linedefined==3500)then literals[tostring(info.linedefined)..':'..tostring(i-1)]=x end
 if pcall(u.funcinfo,x)then visit(x)end end end
visit(assert(loadfile(base..'all-phone/game_gui.lua')))
io.write(encode({menus=dofile(base..'kr3/data/tower_menus_data.lua'),literals=literals}))
