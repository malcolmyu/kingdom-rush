import {World,TOWERS,distance} from './engine.mjs';
const $=id=>document.getElementById(id);
const canvas=$('battlefield'),ctx=canvas.getContext('2d');
const K=7/6,W=1672,H=1014;
const screen=p=>({x:W/2+(p.x-512)*K,y:H/2-(p.y-384)*K});
const toWorld=p=>({x:(p.x-W/2)/K+512,y:(H/2-p.y)/K+384});
const pointer=event=>{const r=canvas.getBoundingClientRect();return toWorld({x:(event.clientX-r.left)/r.width*W,y:(event.clientY-r.top)/r.height*H});};
const loadImage=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src;});
let data,atlas,map,world,selected=null,mode=null,hover=null,last=0,speed=1,acc=0,toastUntil=0,muted=true,intro=true;
const audio={};
function sprite(c,key,x,y,scale=1,ax=.5,ay=.5,flip=false,alpha=1){const f=data.frames[key];if(!f)return;const [qx,qy,w,h]=f.q;c.save();c.globalAlpha=alpha;c.translate(x,y);if(flip)c.scale(-1,1);c.drawImage(atlas,qx,qy,w,h,(f.trim[0]-f.size[0]*ax)*scale,(f.trim[1]-f.size[1]*ay)*scale,w*scale,h*scale);c.restore();}
function anim(name,t){const a=data.animations[name];if(!a)return name;const lo=a.from||a.ranges?.[0]?.[0]||1,hi=a.to||a.ranges?.[0]?.[1]||lo;return a.prefix+'_'+String(lo+Math.floor(t*30)%Math.max(1,hi-lo+1)).padStart(4,'0');}
function paintIcon(c,key){c.clearRect(0,0,c.canvas.width,c.canvas.height);const f=data.frames[key];if(!f)return;const s=Math.min(c.canvas.width/f.size[0],c.canvas.height/f.size[1]);sprite(c,key,c.canvas.width/2,c.canvas.height/2,s);}
function toast(text){$('toast').textContent=text;$('toast').classList.add('show');toastUntil=performance.now()+3400;}
function play(name){if(muted||!audio[name])return;const a=audio[name].cloneNode();a.volume=name==='coin'?.12:.35;a.play().catch(()=>{});}
function music(){if(!audio.battle)return;audio.battle.loop=true;audio.battle.volume=.18;if(muted||world.paused||intro||world.status==='won'||world.status==='lost')audio.battle.pause();else audio.battle.play().catch(()=>{});}
function makeButtons(){const holder=$('slot-controls');holder.replaceChildren();for(const s of world.slots){const p=screen(s),b=document.createElement('button');b.className='slot';b.style.left=p.x/W*100+'%';b.style.top=p.y/H*100+'%';b.setAttribute('aria-label',`建造点 ${s.id+1}`);b.dataset.slot=s.id;b.addEventListener('click',e=>{e.stopPropagation();if(mode){interact({x:s.x,y:s.y});return;}if(world.paused||intro||!['ready','playing'].includes(world.status))return;selected=selected===s.id?null:s.id;mode=null;showMenu();});holder.append(b);}}
function showMenu(){const menu=$('menu');menu.replaceChildren();menu.hidden=selected===null;if(selected===null)return;const s=world.slots[selected],p=screen(s);menu.style.left=Math.max(15,Math.min(85,p.x/W*100))+'%';menu.style.top=Math.max(21,Math.min(72,p.y/H*100))+'%';
  if(!s.type){for(const [type,d]of Object.entries(TOWERS)){const b=document.createElement('button');b.className='build-option';b.dataset.type=type;b.setAttribute('aria-label',`建造${d.name}，${d.price}金币`);b.title=d.description;b.disabled=world.gold<d.price;b.innerHTML=`<canvas width="126" height="110"></canvas><strong>${d.name}</strong><small>${d.price}</small>`;paintIcon(b.querySelector('canvas').getContext('2d'),d.icon);b.onclick=e=>{e.stopPropagation();if(world.build(s.id,type)){selected=null;showMenu();updateUI();}else toast('金币不足');};menu.append(b);}}
  else{const d=TOWERS[s.type],m=document.createElement('div');m.className='tower-menu';m.innerHTML=`<strong>${d.name}</strong><p>${d.description}</p><p class="locked">本关二级塔尚未解锁</p>${s.type==='barrack'?'<button data-action="rally">设置集结点</button>':''}<button data-action="sell">出售 +${Math.floor(s.spent*.6)}</button>`;menu.append(m);m.querySelector('[data-action=sell]').onclick=e=>{e.stopPropagation();world.sell(s.id);selected=null;showMenu();updateUI();};const r=m.querySelector('[data-action=rally]');if(r)r.onclick=e=>{e.stopPropagation();mode='rally';menu.hidden=true;toast('点击兵营附近的道路设置集结点');};}
}
function dialog(html){$('veil').hidden=false;$('dialog').innerHTML=html;queueMicrotask(()=>$('dialog').querySelector('button')?.focus());}
function closeDialog(){intro=false;$('veil').hidden=true;world.paused=false;$('pause').textContent='Ⅱ';music();canvas.focus();}
function introDialog(){intro=true;dialog('<div class="chapter">王国保卫战：起源 · 第一关</div><h1 id="dialog-title">灰鸦港口</h1><p>豺狼人正在逼近精灵的家园。<br>沿道路建造防御塔，守住灰鸦港口！</p><button id="enter" class="wood">布置防线</button><p class="note">320 金币 · 20 生命 · 6 波进攻<br>点击空地建塔，准备好后召唤第一波。</p>');$('enter').onclick=()=>{closeDialog();toast('点击带木牌的空地建塔，准备好后开始战斗');};}
function pauseDialog(help=false){world.paused=true;selected=null;mode=null;showMenu();music();$('pause').textContent='▶';dialog(`<div class="chapter">灰鸦港口</div><h2 id="dialog-title">${help?'守卫指南':'战斗暂停'}</h2><p>${help?'点击空地建造四类防御塔。击败敌人获得金币，漏怪扣除生命。<br>第 2 波解锁援军，第 3 波解锁闪电，第 5 波艾瑞丹加入。<br>选择技能后点击道路施放；选择英雄后点击道路移动。<br>空格：下一波　1 / 2 / 3：技能　H：英雄':'森林暂归宁静。<br>准备好继续守卫港口了吗？'}</p><button id="resume" class="wood">继续战斗</button><br><button id="restart" class="secondary">重新开始</button>`);$('resume').onclick=closeDialog;$('restart').onclick=reset;}
function endDialog(){world.paused=false;selected=null;mode=null;showMenu();music();const win=world.status==='won';if(win)play('victory');let best=0;try{best=Number(localStorage.getItem('origins-first-stars')||0);if(win)localStorage.setItem('origins-first-stars',String(Math.max(best,world.stars)));}catch{}dialog(`<div class="chapter">灰鸦港口 · 战役</div><h2 id="dialog-title">${win?'胜利！':'防线失守'}</h2>${win?`<div class="stars" aria-label="${world.stars}星">${'★'.repeat(world.stars)}${'☆'.repeat(3-world.stars)}</div>`:''}<p>${win?'港口安全了，精灵们向你致敬。':'豺狼人突破了防线。试试在道路汇合处组合兵营和石环阵。'}<br>剩余生命 ${world.lives} / 20　击败 ${world.kills} 个敌人</p><button id="again" class="wood">再战一次</button><p class="note">第一关试玩版 · 后续关卡尚未开放</p>`);$('again').onclick=reset;}
function reset(){world=new World(data);selected=null;mode=null;acc=0;speed=1;$('speed').textContent='1×';makeButtons();showMenu();closeDialog();updateUI();toast('防线已重置，点击空地重新布置');}
function choose(type){if(intro||world.paused||world.status!=='playing')return;const required={reinforce:2,lightning:3,arrows:5,hero:5}[type];if(world.wave<required){toast(`第 ${required} 波解锁`);return;}if(world.cooldowns[type]>0)return;mode=mode===type?null:type;selected=null;showMenu();updateUI();if(mode)toast(type==='hero'?'点击道路移动艾瑞丹':'点击道路部署'+({lightning:'雷电',reinforce:'援军',arrows:'箭雨'}[type]));}
function interact(p){if(intro||world.paused||!['ready','playing'].includes(world.status))return;if(mode){let ok=false;if(mode==='hero')ok=world.moveHero(p);else if(mode==='rally')ok=world.setRally(selected,p);else ok=world.cast(mode,p);if(ok){mode=null;selected=null;showMenu();}else toast('请选择有效的道路位置');}else{if(world.hero&&distance(p,world.hero)<35)choose('hero');else{selected=null;showMenu();}}updateUI();}
function updateUI(){
  $('gold').textContent=world.gold;$('lives').textContent=world.lives;$('wave').textContent=`${world.wave} / 6`;
  for(const s of world.slots){const b=document.querySelector(`[data-slot="${s.id}"]`);b.setAttribute('aria-label',s.type?`建造点 ${s.id+1}：${TOWERS[s.type].name}`:`建造点 ${s.id+1}：空地`);}
  for(const [type,unlock]of Object.entries({hero:5,lightning:3,reinforce:2,arrows:5})){const b=$(type),locked=world.wave<unlock;b.disabled=locked||world.status!=='playing'||(type==='hero'&&world.hero?.hp<=0);b.classList.toggle('selected',mode===type);b.querySelector('.lock').hidden=!locked;const c=b.querySelector('.cooldown');if(c){const n=Math.ceil(world.cooldowns[type]||0);c.textContent=n>0?n:'';b.classList.toggle('cooling',n>0);}}
  const next=$('next'),until=Math.max(0,world.nextWaveAt-world.time),available=world.wave===0||(until<=15&&world.wave<6);
  next.disabled=!available||world.paused||intro||['won','lost'].includes(world.status);
  $('next-label').textContent=world.wave===0?'开始战斗':world.wave===6?'最后一波':available?'提前召唤':'下一波 '+Math.ceil(until)+'s';
  $('next-hint').textContent=world.wave===0?'先点击空地建塔':world.wave===6?'消灭所有敌人':available?'空格召唤 · 额外金币':'守住防线';
  if(selected!==null&&!world.slots[selected].type)for(const b of $('menu').querySelectorAll('[data-type]'))b.disabled=world.gold<TOWERS[b.dataset.type].price;
}
function circle(p,r,fill,stroke){const q=screen(p);ctx.beginPath();ctx.ellipse(q.x,q.y,r*K,r*K*.78,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
function drawUnit(u,kind){if(u.hp<=0&&u.leaked)return;const p=screen(u);let key,flip=false,anchor=.85;
  if(kind==='enemy'){const dead=u.hp<=0,dir=Math.abs(u.dy)>Math.abs(u.dx)*1.7?(u.dy>0?'Up':'Down'):'RightLeft';key=anim(u.kind+'_'+(dead?'death':u.blocked?'attack':'walking'+dir),dead?Math.min((world.time-u.deadAt),.5):world.time+u.id*.07);flip=u.dx>0;}
  else if(kind==='hero'){key=anim('hero_elves_archer_'+(u.hp<=0?'death':u.walking?'walk':u.anim?'shoot_start':'idle'),world.time);anchor=.79;flip=u.target.x>u.x;}
  else {key=anim((u.home===null?'soldier_re_A0_':'soldier_barrack_1_')+(u.anim?'attack':'idle'),world.time+u.index*.17);if(!data.frames[key])key='soldiers_123_'+String(u.anim?9+Math.floor(world.time*30)%14:1).padStart(4,'0');anchor=.8;}
  if(u.hp<=0&&kind!=='enemy')return;
  sprite(ctx,key,p.x,p.y,1,.5,anchor,flip,u.hp<=0?Math.max(0,1-(world.time-u.deadAt)):1);
  if(u.hp>0&&u.hp<u.maxHp){ctx.fillStyle='#293423';ctx.fillRect(p.x-16,p.y-44,32,5);ctx.fillStyle=kind==='enemy'?'#db4f28':'#77c546';ctx.fillRect(p.x-15,p.y-43,30*u.hp/u.maxHp,3);}
  if(u.flash){ctx.globalAlpha=.3;ctx.fillStyle='#fff3bc';ctx.beginPath();ctx.arc(p.x,p.y-15,12,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
}
function drawTower(s){const p=screen(s),offset=n=>p.y-n*K;
  if(!s.type){sprite(ctx,'build_terrain_0001',p.x,offset(26));return;}
  if(s.type==='archer'){sprite(ctx,'archer_towers_0001',p.x,offset(33));sprite(ctx,anim('tower_archer_shooter_'+(s.anim?'shootingDown':'idleDown'),world.time),p.x,offset(42));}
  if(s.type==='barrack'){sprite(ctx,'barracks_towers_layer1_0001',p.x,offset(34));sprite(ctx,'barracks_towers_layer2_0025',p.x,offset(34));}
  if(s.type==='mage'){sprite(ctx,'mage_towers_layer1_0001',p.x,offset(36));sprite(ctx,anim('tower_mage_1_platform_'+(s.anim?'shoot':'idle'),world.time),p.x,offset(36));sprite(ctx,anim('tower_mage_shooter_'+(s.anim?'shootingDown':'idleDown'),world.time),p.x,offset(36));}
  if(s.type==='artillery'){sprite(ctx,'artillery_base_0001',p.x,offset(26));sprite(ctx,anim('tower_rock_thrower_shooter_l1_'+(s.anim?'shootDown':'idleDown'),world.time),p.x,offset(26));}
}
function render(){ctx.clearRect(0,0,W,H);ctx.drawImage(map,0,0,W,H);
  // Water ripples remain in the water, behind all combat entities.
  ctx.save();ctx.globalAlpha=.15;for(let i=0;i<9;i++){const x=470+i*58,y=50+(i*71)%210;ctx.strokeStyle='#e2ffde';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,8+Math.sin(world.time*1.5+i)*3,2,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
  if(selected!==null){const s=world.slots[selected],r=s.type?TOWERS[s.type].range:160;circle(s,r,'#c6e87522','#eff7a877');}
  if(mode&&hover){const p=world.nearestRoad(hover),ok=distance(p,hover)<(mode==='hero'?70:45);circle(p,mode==='lightning'?110:mode==='arrows'?100:25,ok?'#7fe3ed33':'#eb704533',ok?'#c8fff4':'#ffb08a');}
  const g=screen({x:269,y:522});sprite(ctx,'stage1_gandalf_0001',g.x,g.y,1,.5,1);
  const all=[...world.slots.map(s=>({s,y:s.y})),...world.enemies.map(u=>({u,kind:'enemy',y:u.y})),...world.soldiers.map(u=>({u,kind:'soldier',y:u.y}))];if(world.hero)all.push({u:world.hero,kind:'hero',y:world.hero.y});all.sort((a,b)=>b.y-a.y);for(const a of all)a.s?drawTower(a.s):drawUnit(a.u,a.kind);
  for(const b of world.shots){const p=screen(b);if(b.type==='mage'){sprite(ctx,anim('bolt_elves_travel',world.time),p.x,p.y);}else if(b.type==='artillery'){sprite(ctx,'artillery_thrower_proy',p.x,p.y);}else{ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(-(b.ty-b.sy),b.tx-b.sx));sprite(ctx,'arrow',0,0);ctx.restore();}}
  for(const f of world.effects){const p=screen(f),t=f.total-f.life;if(f.type==='coin'){ctx.font='bold 20px Obelix';ctx.textAlign='center';ctx.fillStyle='#ffe75c';ctx.strokeStyle='#384024';ctx.lineWidth=3;ctx.globalAlpha=f.life/f.total;ctx.strokeText(f.text,p.x,p.y-t*25);ctx.fillText(f.text,p.x,p.y-t*25);ctx.globalAlpha=1;}
    else if(f.type==='build')sprite(ctx,anim('tower_build_dust',t),p.x,p.y,1,.5,.8);
    else if(f.type==='impact')sprite(ctx,anim('fx_rock_explosion',t),p.x,p.y,1,.5,.6);
    else if(f.type==='lightning'){ctx.save();ctx.globalAlpha=Math.min(1,f.life*2);ctx.strokeStyle='#d5ffff';ctx.lineWidth=9;ctx.shadowColor='#68d9ff';ctx.shadowBlur=28;ctx.beginPath();ctx.moveTo(p.x-45,p.y-400);ctx.lineTo(p.x+20,p.y-240);ctx.lineTo(p.x-25,p.y-180);ctx.lineTo(p.x+18,p.y-90);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.restore();}
    else if(f.type==='arrows'){for(let i=0;i<18;i++){const x=p.x+Math.sin(i*3)*90,y=p.y+Math.cos(i*2)*50-(1-t)*150;ctx.save();ctx.translate(x,y);ctx.rotate(1.5);sprite(ctx,'arrow',0,0,1.5);ctx.restore();}}
  }
  const q=screen({x:41,y:369});ctx.strokeStyle='#a8e3ee99';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(q.x,q.y,24,10,0,0,Math.PI*2);ctx.stroke();
  if(world.wave<6){for(const road of [0,1]){if(road===1&&world.wave<2)continue;const p=screen({x:985,y:road===0?615:165});sprite(ctx,'waveFlag_0001',p.x,p.y,1.1);}}
}
function events(){for(const e of world.events){if(e.type==='coin'||e.type==='build')play(e.type);if(e.type==='wave'){if(e.wave===2)toast('援军已就绪！选择援军后点击道路部署');else if(e.wave===3)toast('雷电已就绪！点击技能，再点击敌群');else if(e.wave===5)toast('艾瑞丹加入战斗！按 H 选择英雄');else toast(`第 ${e.wave} / 6 波`);}if(e.type==='bonus')toast(`提前召唤 +${e.amount} 金币`);if(e.type==='won'||e.type==='lost')endDialog();}world.events=[];}
function frame(now){const dt=last?Math.min(.1,(now-last)/1000):0;last=now;if(!intro){acc+=world.paused?0:dt*speed;while(acc>=1/60){world.step(1/60);acc-=1/60;}events();}render();updateUI();if(now>toastUntil)$('toast').classList.remove('show');requestAnimationFrame(frame);}
canvas.addEventListener('pointermove',e=>hover=pointer(e));canvas.addEventListener('pointerleave',()=>hover=null);canvas.addEventListener('click',e=>interact(pointer(e)));
$('next').onclick=()=>{if(world.startWave()){selected=null;mode=null;showMenu();music();updateUI();}};
$('pause').onclick=()=>{if(intro)return;if(world.paused)closeDialog();else if(['ready','playing'].includes(world.status))pauseDialog();};$('help').onclick=()=>{if(!intro&&['ready','playing'].includes(world.status))pauseDialog(true);};
$('speed').onclick=()=>{speed=speed===1?2:1;$('speed').textContent=speed+'×';};
$('sound').onclick=()=>{muted=!muted;$('sound').textContent=muted?'♪':'♫';$('sound').setAttribute('aria-label',muted?'开启声音':'关闭声音');music();};
$('fullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});else $('game').requestFullscreen?.().catch(()=>toast('当前浏览器不支持全屏'));};
for(const type of ['hero','lightning','reinforce','arrows'])$(type).onclick=()=>choose(type);
document.addEventListener('keydown',e=>{if(!world||e.repeat)return;if(e.key==='Escape'){e.preventDefault();if(mode||selected!==null){mode=null;selected=null;showMenu();}else if(!intro&&['ready','playing'].includes(world.status)){world.paused?closeDialog():pauseDialog();}}else if(!intro&&!world.paused&&['ready','playing'].includes(world.status)){if(e.code==='Space'&&!['BUTTON','INPUT'].includes(document.activeElement?.tagName)){e.preventDefault();$('next').click();}if(e.key==='1')choose('lightning');if(e.key==='2')choose('reinforce');if(e.key==='3')choose('arrows');if(e.key.toLowerCase()==='h')choose('hero');}});
// Keep keyboard focus inside a visible modal.
document.addEventListener('keydown',e=>{if(e.key!=='Tab'||$('veil').hidden)return;const buttons=[...$('dialog').querySelectorAll('button')];if(!buttons.length)return;const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
try{
  data=window.__ORIGINS_DATA__||await(await fetch('assets/data.json')).json();
  [atlas,map]=await Promise.all([loadImage(window.__ORIGINS_SPRITES__||'assets/sprites.png'),loadImage(window.__ORIGINS_MAP__||'assets/map.webp')]);
  for(const name of ['coin','arrow','victory','battle','build']){audio[name]=new Audio(window.__ORIGINS_AUDIO__?.[name]||`assets/${name}.ogg`);audio[name].preload='none';}
  world=new World(data);makeButtons();for(const c of document.querySelectorAll('[data-icon]'))paintIcon(c.getContext('2d'),c.dataset.icon);$('loading').hidden=true;introDialog();requestAnimationFrame(frame);
  // Read-only state and explicit deterministic advancement for browser regression checks.
  window.origins={get world(){return world;},get data(){return data;},screen,render,reset,advance(seconds){for(let t=0;t<seconds;t+=1/60)world.step(1/60);events();render();updateUI();}};
}catch(e){$('loading').textContent='素材加载失败。请解压后使用本地服务器打开，或打开离线单文件版本。';console.error(e);}
