-- Inspect compiled prototypes and declaration constants; never call a controller.
local u=require('jit.util');local chunk=assert(loadfile('reference/apk/assets/gc64/kr3/game_scripts.lua'));local p
for i=1,u.funcinfo(chunk).gcconsts do local k=u.funck(chunk,-i);local ok,info=pcall(u.funcinfo,k);if ok and info.linedefined==1709 then p=k;break end end
assert(p and u.funcinfo(p).lastlinedefined==1884)
local names=u.funck(p,-82);assert(#names==3 and names[1]=='dance_hit1' and names[3]=='dance_hit3')
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
io.write(dofile('tools/encode_json.lua')({animations=names,all=F_ALL,retry=6/FPS},true))
