-- Read constants/prototypes only; neither controller nor upgrade chunk is called.
local u=require('jit.util');local p=u.funck(assert(loadfile('reference/apk/assets/gc64/kr3/upgrades.lua')),-90);assert(u.funcinfo(p).linedefined==99)
io.write(dofile('tools/encode_json.lua')({rangeTargets=u.funck(p,-74),damageTargets=u.funck(p,-76)},true))
