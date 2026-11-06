-- Inspect TDUP constants in compiled function prototypes. Never call load/update
-- or even the controller's top-level chunk: only loadfile + jit.util inspection.
local u=require('jit.util')
local chunk=assert(loadfile('reference/apk/assets/gc64/kr3/data/levels/level06.lua'))
local proto=u.funck(chunk,-15)
assert(u.funcinfo(proto).linedefined==22)
local out={campaign={u.funck(proto,-4),u.funck(proto,-5)},heroic={u.funck(proto,-7),u.funck(proto,-8)},iron={u.funck(proto,-10),u.funck(proto,-11)}}
for _,mode in pairs(out)do for _,v in ipairs(mode)do assert(v.wave and v.side and v.delay and v.cooldown)end end
io.write(dofile('tools/encode_json.lua')(out,true))
