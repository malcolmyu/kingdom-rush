-- Read constants only; controller functions are never executed.
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
local encode=dofile('tools/encode_json.lua')
io.write(encode({small=UNIT_SIZE_SMALL,med=UNIT_SIZE_MEDIUM,big=UNIT_SIZE_LARGE}))
