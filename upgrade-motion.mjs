// Phone screen_map:1589/1625 shows/hides immediately. Only the buy button
// (804–817) moves: .2 seconds with the timer's default linear interpolation.
export class UpgradeTimeline{
 constructor(){this.time=0;this.from=141;this.target=141;this.at=0;this.checkAt=0;}
 get buyY(){return this.from+(this.target-this.from)*Math.min(1,Math.max(0,(this.time-this.at)/.2));}
 select(available){const y=this.buyY;this.from=y;this.target=available?210:140;this.at=this.time;}
 update(dt){this.time+=dt;}
 purchased(){this.checkAt=this.time;}
 get checkFrame(){return Math.max(1,Math.min(7,Math.ceil((this.time-this.checkAt)*30)));}
}
// Original shop_views.lua:547–579; independent presentation RNG, never World RNG.
export class UpgradeBurst{
 constructor(x,y,seed=0x39a1){this.x=x;this.y=y;this.seed=seed;this.age=0;this.remainder=0;this.particles=[];for(let i=0;i<20;i++){const angle=(this.random()-.5)*2*Math.PI,speed=100+100*this.random();this.particles.push({x:0,y:0,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:.75*this.random(),rotation:(this.random()*2-1)*Math.PI,age:0});}}
 random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
 update(dt){this.age+=dt;this.remainder+=dt;const step=1/120;while(this.remainder>=step){this.remainder-=step;for(const p of this.particles){p.age+=step;const d=Math.hypot(p.x,p.y);if(d){p.vx-=200*p.x/d*step;p.vy-=200*p.y/d*step;}p.x+=p.vx*step;p.y+=p.vy*step;}this.particles=this.particles.filter(p=>p.age<p.life);}}
}
export class UpgradeMotion{
 constructor(app){this.app=app;this.timeline=new UpgradeTimeline();this.bursts=[];this.active=true;this.serial=0;app.renderer.sheet(app.repo.catalog.frames.upgrade_fx_particle.a);}
 attach(dialog,available,bought){this.dialog=dialog;this.timeline.select(available);this.bought=bought;const canvas=document.createElement('canvas');canvas.width=960;canvas.height=640;canvas.className='upgrade-particles';canvas.setAttribute('aria-hidden','true');dialog.append(canvas);this.canvas=canvas;this.update(0);}
 burst(x,y){this.timeline.purchased();this.bursts.push(new UpgradeBurst(x,y,0x39a1+this.serial++));}
 update(dt){if(!this.active||!this.canvas?.isConnected)return;this.timeline.update(dt);const button=this.dialog.querySelector('#tutorial-upgrades_buy_button');if(button)button.style.top=this.timeline.buyY/320*100+'%';const check=this.dialog.querySelector('[data-upgrade-check]');if(check){check.hidden=!this.bought;if(this.bought)check.src=this.app.ui.data.images['upgrade_check_anim_'+String(this.timeline.checkFrame).padStart(4,'0')].src;}
  const c=this.canvas.getContext('2d'),r=this.app.renderer,f=r.catalog.frames.upgrade_fx_particle,im=r.sheets.get(f.a);c.clearRect(0,0,960,640);for(const burst of this.bursts){burst.update(dt);if(!im)continue;for(const p of burst.particles){const phase=p.age/p.life,scale=.2+1.8*phase;c.save();c.translate((burst.x+p.x)*2,(burst.y+p.y)*2);c.rotate(p.rotation);c.globalAlpha=1-phase;c.drawImage(im,...f.q,-f.size[0]*scale/2,-f.size[1]*scale/2,f.q[2]*scale,f.q[3]*scale);c.restore();}}this.bursts=this.bursts.filter(b=>b.age<=1);
 }
 reset(){this.active=false;this.canvas?.remove();this.bursts=[];}
}
