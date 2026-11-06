-- Prototype/data constants only: the arrow controller is never run.
local u=require('jit.util');local c=assert(loadfile('reference/apk/assets/gc64/all/scripts.lua'));local p
for i=1,u.funcinfo(c).gcconsts do local k=u.funck(c,-i);local ok,n=pcall(u.funcinfo,k);if ok and n.linedefined==1989 then p=k;break end end
assert(p and u.funcinfo(p).lastlinedefined==2130)
local first=u.funck(p,-73);local last=u.funck(p,-74)
assert(first[1]==0 and first[2]==255 and last[1]==2.1 and last[2]==0)
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
io.write(dofile('tools/encode_json.lua')({missDuration=last[1],water=TERRAIN_WATER},true))
