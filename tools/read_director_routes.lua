-- Data/evidence export only: declare director_data, inspect game function literals.
-- No screen init/update or done callback is executed.
local u=require('jit.util');local encode=dofile('tools/encode_json.lua')
local function outcome(path,line)
 local seen={};local found
 local function visit(fn)
  if seen[fn]then return end;seen[fn]=true;local ok,info=pcall(u.funcinfo,fn);if not ok then return end
  for i=1,info.gcconsts do local v=u.funck(fn,-i)
   if info.linedefined==line and type(v)=='table'and v.next_item_name then found=v end
   local yes=pcall(u.funcinfo,v);if yes then visit(v)end
  end
 end
 visit(assert(loadfile(path)));assert(found,'Missing original route literal');return found
end
local base='reference/apk/assets/gc64/'
local data=dofile(base..'kr3-phone/data/director_data.lua')
io.write(encode({item_props=data.item_props,select_slot=outcome(base..'all-phone/screen_slots.lua',680),map_back=outcome(base..'all-phone/screen_map.lua',2287)}))
