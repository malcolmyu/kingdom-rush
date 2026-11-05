-- Declarative constants only; no game controller is executed.
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
local encode=dofile('tools/encode_json.lua')
io.write(encode({width=REF_W,height=REF_H,minAspect=MIN_SCREEN_ASPECT,maxAspect=MAX_SCREEN_ASPECT,textureScale=TEXTURE_SIZE_ALIAS.ipad/TEXTURE_SIZE_ALIAS.iphonehd/TEXTURE_SIZE_FACTOR.iphonehd.game}))
