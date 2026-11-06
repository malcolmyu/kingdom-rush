-- Prototype constants only; never invoke the level chunk or its controllers.
local u=require('jit.util');local f=assert(loadfile('reference/apk/assets/gc64/kr3/data/levels/level04.lua'));local p=u.funck(f,-20)
assert(u.funcinfo(p).linedefined==69)
local out={treeSpread=u.funck(p,2),fireSpread=u.funck(p,3),charcoalSpread=u.funck(p,4),landDelay=u.funck(p,5),nodeAdvance=u.funck(p,6)}
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua');out.zDecals=Z_DECALS
io.write(dofile('tools/encode_json.lua')(out,true))
