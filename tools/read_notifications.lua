-- Read source data/templates only, with design-time vector/localization stubs.
v=function(x,y)return{x=x,y=y}end
r=function(x,y,w,h)return{pos=v(x,y),size=v(w,h)}end
rad=math.rad
_=function(s)return s end
package.preload['klua.vector']=function()return{v=v}end
package.preload['i18n']=function()return{cjk=function(_,a,zh)return zh or a end}end
DAMAGE_TRUE=1;DAMAGE_PHYSICAL=2;DAMAGE_MAGICAL=3;DAMAGE_EXPLOSION=4
local data=dofile(arg[1]);local encode=dofile('tools/encode_json.lua')
if arg[2]then ctx=data.notifications[arg[2]];assert(ctx,arg[2]);ctx.id=arg[2];io.write(encode(dofile('reference/apk/assets/gc64/kr3-phone/data/kui_templates/game_gui_noti_'..ctx.template..'.lua')))else io.write(encode(data))end
