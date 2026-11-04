-- Read original game settings as data, never execute gameplay controllers.
local base=arg[1]
dofile(base..'/all/constants.lua');KR_TARGET='phone'
local settings=dofile(base..'/kr3/game_settings.lua')
io.write(dofile('tools/encode_json.lua')({early_wave_reward_per_second=settings.early_wave_reward_per_second}))
