-- Data-only growth settings from the original package. No gameplay execution.
local base=arg[1]
dofile(base..'/all/constants.lua')
KR_TARGET='phone'
local settings=dofile(base..'/kr3/game_settings.lua')
local result={}
for _,key in ipairs({'hero_xp_thresholds','hero_level_expected','hero_level_expected_multipliers_below','hero_level_expected_multipliers_above','hero_xp_gain_per_difficulty_mode','skill_points_for_hero_level'}) do result[key]=settings[key] end
local source=debug.getinfo(1,'S').source:sub(2):match('^(.*[/\\])') or './'
io.write(dofile(source..'encode_json.lua')(result))
