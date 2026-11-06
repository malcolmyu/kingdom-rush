-- Constants declaration only. Never execute faerie controllers.
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
assert(TERRAIN_FAERIE==1024 and UNIT_SIZE_SMALL==1)
io.write(dofile('tools/encode_json.lua')({terrain=TERRAIN_FAERIE,small=UNIT_SIZE_SMALL},true))
