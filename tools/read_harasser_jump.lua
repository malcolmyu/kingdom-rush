KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
io.write(dofile('tools/encode_json.lua')({all=F_ALL,noDodge=DAMAGE_NO_DODGE,faerie=TERRAIN_FAERIE},true))
