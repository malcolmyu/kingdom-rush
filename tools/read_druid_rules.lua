local u=require('jit.util');local p=u.funck(assert(loadfile('reference/apk/assets/gc64/kr3/upgrades.lua')),-90)
assert(u.funcinfo(p).linedefined==99)
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
io.write(dofile('tools/encode_json.lua')({damageTargets=u.funck(p,-82),areaTargets=u.funck(p,-84),faerie=TERRAIN_FAERIE,water=TERRAIN_WATER,objects=Z_OBJECTS,bullets=Z_BULLETS},true))
