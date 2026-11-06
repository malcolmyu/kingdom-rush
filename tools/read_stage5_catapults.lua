-- Prototype constants only: never execute the controller chunk/load/update.
local u=require('jit.util');local f=u.funck(assert(loadfile('reference/apk/assets/gc64/kr3/data/levels/level05.lua')),-15)
assert(u.funcinfo(f).linedefined==22)
local out={stops=u.funck(f,-2),campaign={},heroic={},iron={}}
for i=-6,-15,-1 do table.insert(out.campaign,u.funck(f,i))end
for i=-17,-19,-1 do table.insert(out.heroic,u.funck(f,i))end
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua');out.flags={all=F_ALL,flying=F_FLYING,enemy=F_ENEMY}
for _,list in ipairs({out.campaign,out.heroic})do for _,v in ipairs(list)do assert(v.wave and v.enter and v.leave and v.path_id)end end
io.write(dofile('tools/encode_json.lua')(out,true))
