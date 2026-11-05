-- Declarative constants only; no controller execution.
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
io.write(dofile('tools/encode_json.lua')({flying=F_FLYING,noSpawns=DAMAGE_NO_SPAWNS,eat=DAMAGE_EAT,disintegrate=DAMAGE_DISINTEGRATE,teleport=MOD_TYPE_TELEPORT,timelapse=MOD_TYPE_TIMELAPSE},true))
