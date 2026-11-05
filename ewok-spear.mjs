// Original scripts.arrow insertion/update equations. New ewok shots only.
export function launchEwokSpear(w,u,hit){
 const target=hit.target,a=w.template(u.key).ranged.attacks[0],t=w.template(a.bullet).bullet;
 if(!w.enemies.includes(target)||u.hp<=0||u.stunned||u.frozen)return null;
 if(hit.origin&&Math.hypot(target.x-hit.origin.x,target.y-hit.origin.y)>a.max_track_distance)return null;
 const o=a.bullet_start_offset[0],offset=w.template(target.key).unit?.hit_offset||{x:0,y:0},v=target.motionVelocity||{x:0,y:0};
 const sx=u.x+(u.flip?-1:1)*o.x,sy=u.y+o.y;
 const tx=target.x+offset.x+v.x*t.flight_time,ty=target.y+offset.y+v.y*t.flight_time;
 const shot={id:++w.serial,type:'ewok-spear',bullet:a.bullet,source:u.id,target,sx,sy,x:sx,y:sy,tx,ty,elapsed:0,duration:t.flight_time,g:t.g,insertedAt:w.time,rotation:0,velocity:{x:(tx-sx)/t.flight_time,y:(ty-sy-.5*t.g*t.flight_time*t.flight_time)/t.flight_time}};
 w.shots.push(shot);return shot;
}
export function updateEwokSpear(w,b,dt){
 // Native queue insertion does not run a new projectile on the emitting tick.
 if(b.done||b.insertedAt===w.time)return;
 if(b.elapsed+dt<=b.duration){
  const px=b.x,py=b.y;b.elapsed+=dt;
  b.x=b.sx+b.velocity.x*b.elapsed;b.y=b.sy+b.velocity.y*b.elapsed+b.g*b.elapsed*b.elapsed/2;
  b.rotation=Math.atan2(b.y-py,b.x-px);return;
 }
 b.done=true;const e=b.target,t=w.template(b.bullet).bullet,offset=w.template(e.key).unit?.hit_offset||{x:0,y:0};
 if(w.enemies.includes(e)&&e.hp>0&&Math.hypot(b.x-e.x-offset.x,b.y-e.y-offset.y)<t.hit_distance){
  // create_bullet_damage uses ceil(frandom), only after a successful contact.
  b.damage=Math.ceil(t.damage_min+w.random()*(t.damage_max-t.damage_min));b.hit=true;w.hurt(e,b.damage,t.damage_type);
 }
}
