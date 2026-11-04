-- Read original UI data with its design-time context; no game script execution.
ctx={sw=693,sh=320,safe_frame={l=0,r=0,t=0,b=0}}
_=function(s)return s end
rad=math.rad
v=function(x,y)return{x=x,y=y}end
r=function(x,y,w,h)return{pos=v(x,y),size=v(w,h)}end
local source=debug.getinfo(1,'S').source:sub(2):match('^(.*[/\\])') or './'
local encode=dofile(source..'encode_json.lua')
io.write(encode(dofile(arg[1])))
