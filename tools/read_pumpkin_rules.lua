-- Prototype constants only; never execute the controller.
local u=require('jit.util');local c=assert(loadfile('reference/apk/assets/gc64/kr3/game_scripts.lua'));local p
for i=1,u.funcinfo(c).gcconsts do local k=u.funck(c,-i);local ok,n=pcall(u.funcinfo,k);if ok and n.linedefined==13141 then p=k;break end end
assert(p and u.funcinfo(p).lastlinedefined==13279)
local groups={{},{},{}}
for i=0,11 do local t=u.funck(p,-i-1);assert(type(t)=='table' and #t==5);groups[math.floor(i/4)+1][i%4+1]=t end
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
io.write(dofile('tools/encode_json.lua')({smoke=groups,poison=DAMAGE_POISON,modifierDamage=DAMAGE_MODIFIER,release=17/FPS},true))
