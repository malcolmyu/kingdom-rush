-- Constants only: do not execute rendering or game controllers.
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
io.write(dofile('tools/encode_json.lua')({sizes=HEALTH_BAR_SIZES,colors=HEALTH_BAR_COLORS,quad=HEALTH_BAR_CORNER_DOT_QUAD}))
