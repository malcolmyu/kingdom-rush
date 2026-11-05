-- Constants declarations only; render systems are never executed.
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
local encode=dofile('tools/encode_json.lua')
io.write(encode({defaultZ=Z_OBJECTS,drawOrderFactor=100000}))
