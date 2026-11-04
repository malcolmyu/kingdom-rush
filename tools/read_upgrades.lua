-- Only the module's declarative data is read; no upgrade patch function is called.
package.preload['klua.log']=function()return{new=function()return{}end}end
package.preload['entity_db']=function()return{}end
package.preload['constants']=function()return{}end
local u=dofile(arg[1]..'/kr3/upgrades.lua')
io.write(dofile('tools/encode_json.lua')({list=u.list,display_order=u.display_order}))
