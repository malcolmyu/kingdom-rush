-- Only declarative constants; controllers are audited with -bl.
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
io.write(dofile('tools/encode_json.lua')({noDodge=DAMAGE_NO_DODGE},true))
