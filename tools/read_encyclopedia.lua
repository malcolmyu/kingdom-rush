-- Declarative original settings only; no entity/controller function execution.
local base=arg[1];dofile(base..'/all/constants.lua');KR_TARGET='phone'
local s=dofile(base..'/kr3/game_settings.lua')
io.write(dofile('tools/encode_json.lua')({enemies=s.encyclopedia_enemies}))
