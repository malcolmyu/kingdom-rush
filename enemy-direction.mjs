// Original 45-degree direction sectors and source hysteresis.
export function enemyDirection(dx,dy,previous=null,stickiness=10){
 if(!dx&&!dy)return previous||{facing:'RightLeft',flip:false,quadrant:4};
 const angle=(Math.atan2(dy,dx)*180/Math.PI+360)%360;
 const shift=previous?(previous.quadrant===1||previous.quadrant===3?stickiness:-stickiness):0;
 const [a,b,c,d]=[45-shift,135+shift,225-shift,315+shift];
 if(angle>=a&&angle<b)return{facing:'Up',flip:false,quadrant:1};
 if(angle>=b&&angle<c)return{facing:'RightLeft',flip:true,quadrant:2};
 if(angle>=c&&angle<d)return{facing:'Down',flip:false,quadrant:3};
 return{facing:'RightLeft',flip:false,quadrant:4};
}
