-- Constants declarations only, never game control functions.
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
io.write(dofile('tools/encode_json.lua')({aspect=ASPECT}))
