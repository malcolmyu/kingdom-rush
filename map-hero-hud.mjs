import{createBalloon}from'./balloon.mjs';
import{rectStyle}from'./ui.mjs';
import{skillPoints,HERO_RULES}from'./progression.mjs';
import{back}from'./results.mjs';
// screen_map.show_gui: new-stage-2 upgrade hint has priority over hero hints.
export function mapHeroHint(progress,newLevel,heroData,supported=['hero_elves_archer']){
 if(newLevel===2)return'upgrades';
 if(!progress.seenMapHints?.map_balloon_level_up_view&&progress.heroXp>HERO_RULES.hero_xp_thresholds[0])return'levelup';
 if(newLevel&&Object.entries(heroData).some(([key,h])=>supported.includes(key)&&h.available_at_stage===newLevel))return'unlocked';
 return null;
}
export function mapHeroHintPose(time,hideAt=null,hideAlpha=1){const t=(time%.8)/.4,scale=t<1?1-.02*t:.98+.02*(t-1);return{alpha:hideAt===null?Math.min(1,time/.4):hideAlpha*Math.max(0,1-(time-hideAt)/.4),scale};}
export class MapHeroHud{
 constructor(app,host,newLevel){Object.assign(this,{app,host,time:0});const u=app.ui,d=u.data.layouts.mapHero,ref=d.parent.size;this.data=d;
  host.innerHTML=u.button('map-upgrades','升级',d.upgrades,ref)+u.button('hero-room','英雄殿堂',d.hero,ref)+u.button('encyclopedia','百科全书',d.encyclopedia,ref);
  for(const[id,node]of[['map-upgrades',d.upgrades],['hero-room',d.hero],['encyclopedia',d.encyclopedia]]){const b=host.querySelector('#'+id),asset=u.data.images[node.default_image_name],size={x:asset.size[0]/2,y:asset.size[1]/2};for(const n of node.children||[])if(n.text_key){const label=document.createElement('span');label.className='map-source-button-label';label.textContent=u.data.fonts.text[n.text_key];label.style.cssText=rectStyle(n.pos.x,n.pos.y,n.size.x,n.size.y,size)+';'+u.fontStyle(n.font_name,n.font_size,ref);b.append(label);}}
  const hero=host.querySelector('#hero-room'),portrait=u.find(d.hero,'map_hero_button_portrait');hero.insertAdjacentHTML('beforeend',u.image(portrait.image_name,portrait,{x:u.data.images[d.hero.default_image_name].size[0]/2,y:u.data.images[d.hero.default_image_name].size[1]/2}));
  const badge=u.find(d.hero,'hero_points_to_spend_view'),asset=u.data.images[badge.image_name];this.points=document.createElement('div');this.points.className='map-hero-points';this.points.style.cssText=rectStyle(badge.pos.x-badge.anchor.x,badge.pos.y-badge.anchor.y,asset.size[0]/2,asset.size[1]/2,{x:u.data.images[d.hero.default_image_name].size[0]/2,y:u.data.images[d.hero.default_image_name].size[1]/2})+';'+u.fontStyle(badge.font_name,badge.font_size,ref);this.points.style.backgroundImage=`url(${asset.src})`;hero.append(this.points);
  const choice=mapHeroHint(app.progress,newLevel,d.heroData);this.suppressed=null;
  if(choice){const n=choice==='upgrades'?d.upgradeHint:d[choice],view=createBalloon(u,{size:n.max_size,flags:n.flags,text:n.text_key,title:n.title_key},{id:n.id,reference:ref.x});this.hint=view.el;this.hint.style.left=(n.pos.x-view.anchor.x)/ref.x*100+'%';this.hint.style.top=(n.pos.y-view.anchor.y)/ref.y*100+'%';this.hint.style.transformOrigin=`${view.anchor.x/ref.x*100}cqw ${view.anchor.y/ref.x*100}cqw`;host.append(this.hint);if(choice==='levelup'){app.progress.seenMapHints={...app.progress.seenMapHints,[n.id]:true};app.persist();}}
  host.querySelector('#map-upgrades').onclick=()=>{this.hideAlpha=mapHeroHintPose(this.time).alpha;this.hideAt=this.time;app.upgrades();};
  hero.onclick=()=>{this.hideAlpha=mapHeroHintPose(this.time).alpha;this.hideAt=this.time;app.heroRoom();};host.querySelector('#encyclopedia').onclick=()=>app.encyclopedia();this.update(0);
 }
 resize(scale){const n=this.data.parent;this.host.style.width=n.size.x*scale+'px';this.host.style.height=n.size.y*scale+'px';this.host.style.right=(n.anchor.x-n.size.x)*scale+'px';this.host.style.bottom=(n.anchor.y-n.size.y)*scale+'px';}
 update(dt){this.time+=dt;this.host.style.translate=`0 ${this.host.offsetHeight*(1-back(Math.min(1,this.time/.5)))}px`;const points=skillPoints(this.app.progress.heroLevel,this.app.progress.heroSkills,this.app.repo.catalog.templates.hero_elves_archer.hero.skills);this.points.hidden=points<=0;this.points.textContent=points;if(this.hint){const p=mapHeroHintPose(this.time,this.hideAt??null,this.hideAlpha);this.hint.style.opacity=p.alpha;this.hint.style.transform=`scale(${p.scale})`;this.hint.hidden=p.alpha<=0;}}
}
