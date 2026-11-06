-- Prototype constants only: do not call the upgrades controller or its patch fn.
local u=require('jit.util');local chunk=assert(loadfile('reference/apk/assets/gc64/kr3/upgrades.lua'))
local p=u.funck(chunk,-90);assert(u.funcinfo(p).linedefined==99)
io.write(dofile('tools/encode_json.lua')({fencing=u.funck(p,-42),rally=u.funck(p,-46)},true))
