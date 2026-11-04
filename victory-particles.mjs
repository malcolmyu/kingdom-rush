// VictoryParticles, game_gui.lua:4246–4287. Native UI units; HD texture ref_scale=.5.
export class VictoryParticles{
 constructor(seed=0x7645){this.seed=seed;this.particles=[];this.age=0;this.remainder=0;this.emitted=false;}
 random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 emit(){if(this.emitted)return;this.emitted=true;for(let i=0;i<150;i++){const angle=-Math.PI/2+(this.random()-.5)*Math.PI*2/3,speed=400+600*this.random();this.particles.push({x:0,y:0,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:1.5*this.random(),age:0});}}
 update(dt){this.age+=dt;if(this.age<.15)return;if(!this.emitted){dt=this.age-.15;this.emit();}this.remainder+=dt;const step=1/120;while(this.remainder+1e-12>=step){this.remainder-=step;for(const p of this.particles){p.age+=step;if(p.age>=p.life)continue;const d=Math.hypot(p.x,p.y),ax=d?-200*p.x/d:0,ay=2000+(d?-200*p.y/d:0);p.vx+=ax*step;p.vy+=ay*step;p.x+=p.vx*step;p.y+=p.vy*step;}this.particles=this.particles.filter(p=>p.age<p.life);}}
 draw(canvas,r){const h=Math.round(693*r.height/r.width*2);if(canvas.width!==1386||canvas.height!==h){canvas.width=1386;canvas.height=h;}const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);c.save();c.globalCompositeOperation='lighter';for(const p of this.particles){const phase=p.age/p.life;r.sprite(c,'victoryStars_star_0001',693+p.x*2,h/2+p.y*2,1+.4*phase,.5,.5,false,1-phase);}c.restore();}
}
