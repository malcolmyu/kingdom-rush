KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
io.write(dofile('tools/encode_json.lua')({blocked=bit.bor(TERRAIN_WATER,TERRAIN_CLIFF,TERRAIN_NOWALK),rally=NF_RALLY},true))
