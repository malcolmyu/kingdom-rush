// enemy_perython uses enemy_basic.insert / enemy_passive.update. Its original
// atlas padding + anchor encode altitude; no extra screen/world lift is applied.
// common script_utils.y_enemy_death hides all sprites after the death animation.
export function flyingEnemySprites(template,unit,{body,flip=false,elapsed=0,deathDuration=0}={}){
 if(unit.leaked||unit.hp<=0&&template.unit.hide_after_death&&elapsed>=deathDuration)return[];
 return template.render.sprites.flatMap((raw,index)=>{if(raw.hidden||raw.hidden_count>0)return[];const origin=raw.pos||unit,key=raw.animated?body:raw.name;if(!key)return[];return[{key,index:index+1,raw,pos:{x:origin.x+(raw.offset?.x||0),y:origin.y+(raw.offset?.y||0)},anchor:raw.anchor||{x:.5,y:.5},scale:raw.scale?.x??1,alpha:(raw.alpha??255)/255,flip:raw.animated?flip||!!raw.flip_x:!!raw.flip_x,rotation:raw.r||0}];});
}
