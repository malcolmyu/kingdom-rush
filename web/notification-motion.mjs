// NotificationView show/hide, game_gui.lua:4330–4402. UI time never advances World.
export function notificationPose(age,{closing=false,noTransition=false}={}){
 const t=Math.max(0,Math.min(1,(age-(closing?0:.1))/.4));
 const backIn=x=>2.70158*x*x*x-1.70158*x*x;
 const eased=closing?backIn(t):1+2.70158*(t-1)**3+1.70158*(t-1)**2;
 if(noTransition&&!closing)return{alpha:age<.1?0:1,scale:1};
 return{alpha:closing?1-eased:age<.1?0:eased,scale:closing?1-.5*eased:age<.1?.5:.5+.5*eased};
}
export function notificationFrames(closing=false){return Array.from({length:49},(_,i)=>{const p=notificationPose(i/48*.4+(closing?0:.1),{closing});return{offset:i/48,opacity:p.alpha,transform:`scale(${p.scale})`};});}
export class NotificationMotion{
 constructor(veil,dialog,sound){this.veil=veil;this.dialog=dialog;this.sound=sound;this.exits=new Set();}
 cancel(){clearTimeout(this.reveal);this.animation?.cancel();this.dialog.style.opacity='';this.dialog.style.transform='';this.veil.classList.remove('source-notification-veil');delete this.veil.dataset.notificationWait;}
 open(noTransition=false){this.cancel();this.veil.classList.add('source-notification-veil');this.veil.dataset.notificationWait='';const p=notificationPose(0,{noTransition});this.dialog.style.opacity=p.alpha;this.dialog.style.transform=`scale(${p.scale})`;this.animation=this.dialog.animate(noTransition?[{opacity:1,transform:'scale(1)'},{opacity:1,transform:'scale(1)'}]:notificationFrames(),{delay:100,duration:noTransition?1:400,fill:'forwards'});this.reveal=setTimeout(()=>{delete this.veil.dataset.notificationWait;this.sound('notification-open');},100);}
 close(){clearTimeout(this.reveal);this.animation?.cancel();this.dialog.style.opacity='';this.dialog.style.transform='';const ghost=this.dialog.cloneNode(true);ghost.removeAttribute('id');ghost.removeAttribute('data-notification');ghost.removeAttribute('data-tutorial-page');ghost.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));ghost.classList.add('notification-exit');ghost.setAttribute('aria-hidden','true');ghost.inert=true;this.veil.parentNode.append(ghost);this.exits.add(ghost);const anim=ghost.animate(notificationFrames(true),{duration:400,fill:'forwards'});anim.finished.then(()=>{ghost.remove();this.exits.delete(ghost);},()=>{ghost.remove();this.exits.delete(ghost);});this.veil.classList.remove('source-notification-veil');this.sound('notification-close');}
 reset(){this.cancel();for(const e of this.exits)e.remove();this.exits.clear();}
}
