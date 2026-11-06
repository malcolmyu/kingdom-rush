-- Declarative constants only. Never call game controllers.
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
io.write(dofile('tools/encode_json.lua')({allTypes=DAMAGE_ALL_TYPES,physical=DAMAGE_PHYSICAL,magical=DAMAGE_MAGICAL,noDodge=DAMAGE_NO_DODGE,net=F_NET},true))
