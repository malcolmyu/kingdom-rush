-- Read data-only original templates. Runtime scripts are deliberately not executed.
local base=arg[1]
package.path=base..'/?.lua;'..base..'/all/?.lua;'..base..'/kr3/?.lua;'..base..'/lib/?.lua;'..package.path
dofile(base..'/main_globals.lua')
FPS=30; REF_W=1024;REF_H=768
local function stub(path) return setmetatable({__script_path=path},{__index=function(_,key) return stub(path..'.'..key) end}) end
package.preload.scripts=function() return stub('scripts') end;package.preload.game_scripts=function() return stub('game_scripts') end
package.loaded.i18n=setmetatable({get_locale=function() return 'zh-Hans' end},{__call=function(_,s) return s end,__index=function() return function(s) return s end end})
package.loaded.features={}
local E=require('entity_db');E.entities={};E.components={}
require('components');require('templates');require('game_templates')
local function clean(x,depth)
  if type(x)=='number' or type(x)=='string' or type(x)=='boolean' then return x end
  if type(x)~='table' or depth>12 then return nil end
  local r={};for k,v in pairs(x) do local c=clean(v,depth+1);if c~=nil then r[k]=c end end
  return r
end
local out={}
for _,k in ipairs({'plant_poison_pumpkin','mod_plant_poison_pumpkin','mod_plant_poison_pumpkin_slow'}) do out[k]=clean(E.entities[k].main_script,0) end
local source='tools/'
local encode=dofile(source..'encode_json.lua')
io.write(encode(out,arg[2]=='precise'))
