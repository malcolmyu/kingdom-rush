// Ordinary ground death only. Original SU.y_enemy_death leaves these bodies
// opaque; systems.health removes them strictly after death_ts+dead_lifetime.
const keys=new Set(['enemy_gnoll_reaver','enemy_gnoll_burner','enemy_gnoll_gnawer','enemy_hyena','enemy_ettin','enemy_catapult']);
export const isGroundCorpse=u=>keys.has(u.key)&&u.hp<=0;
export class GroundCorpses{
 constructor(){this.reset();}
 reset(){this.owner=null;this.records=new Map();}
 update(world){
  if(this.owner!==world){this.reset();this.owner=world;}
  for(const u of world.enemies){
   if(u.hp>0||u.leaked||u.eldritchEaten){this.records.delete(u.id);continue;}
   if(!isGroundCorpse(u))continue;
   const template=world.template(u.key),expires=u.deadAt+template.health.dead_lifetime;
   if(world.time>expires)continue;
   // Frozen display snapshot; never keep a mutable World entity as a corpse.
   this.records.set(u.id,{expires,unit:{id:u.id,key:u.key,x:u.x,y:u.y,hp:0,maxHp:u.maxHp,deadAt:u.deadAt,deathFlip:u.deathFlip,dx:u.dx,dy:u.dy}});
  }
  for(const[id,r]of this.records)if(world.time>r.expires)this.records.delete(id);
  return [...world.enemies.filter(u=>!u.eldritchEaten&&!isGroundCorpse(u)),...[...this.records.values()].map(r=>r.unit)];
 }
}
