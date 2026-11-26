'use strict';
/* js/fx.js : Efectos: particulas, textos flotantes, sacudida, confeti */

/* =====================================================================
   5. EFECTOS (partículas, números flotantes, sacudida, destellos)
   ===================================================================== */
let parts=[],floats=[],shake=0,flash=0,flashColor='255,255,255',stars=[];
function burst(x,y,colors,n=18,power=190){
 if(CALM)n=Math.ceil(n/3);
 for(let i=0;i<n;i++){const a=Math.random()*6.283,v=power*(.3+Math.random()*.7);
  parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-60,life:.45+Math.random()*.45,c:pick(colors),s:pick([3,4,6])})}
 if(parts.length>350)parts.splice(0,parts.length-350);
}
function floatText(t,color,x=320,y=170,size=14){
 let yy=y;while(floats.some(f=>f.life>.8&&Math.abs(f.y-yy)<18&&Math.abs(f.x-x)<150))yy-=20;
 floats.push({t,c:color,x,y:yy,size,life:1.4});
}
function impact(x,y,dmg,color='#A855F7'){
 if(!CALM)shake=Math.min(18,3+dmg*.22);
 stars.push({x,y,life:.22,r:18+Math.min(40,dmg*.7)});
 burst(x,y,['#fff',color,'#E9D5FF'],10+Math.min(30,dmg/2|0),240);
}
function doFlash(rgb,a=.45){if(!CALM){flash=a;flashColor=rgb}}
function text(t,x,y,size,color,align='center',font='"Press Start 2P",monospace'){
 X.font=`${size}px ${font}`;X.textAlign=align;X.textBaseline='alphabetic';X.lineJoin='round';
 X.lineWidth=Math.max(3,size/3);X.strokeStyle='#06080c';X.strokeText(t,x,y);X.fillStyle=color;X.fillText(t,x,y);X.textAlign='left';
}
function drawFX(dt){
 for(const s of stars){s.life-=dt;const k=1-s.life/.22,r=s.r*(.5+k);
  X.save();X.translate(s.x,s.y);X.globalAlpha=clamp(s.life/.15,0,1);X.fillStyle='#fff';
  X.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,q=i%2?r*.35:r;X[i?'lineTo':'moveTo'](Math.cos(a)*q,Math.sin(a)*q)}X.closePath();X.fill();
  X.strokeStyle='#A855F7';X.lineWidth=3;X.stroke();X.restore()}
 stars=stars.filter(s=>s.life>0);
 for(const p of parts){p.life-=dt;p.vy+=480*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;X.globalAlpha=clamp(p.life*2.5,0,1);R(p.c,p.x,p.y,p.s,p.s)}
 X.globalAlpha=1;parts=parts.filter(p=>p.life>0);
 for(const f of floats){f.life-=dt;f.y-=26*dt;X.globalAlpha=clamp(f.life*2,0,1);
  const half=f.t.length*f.size*.5;text(f.t,clamp(f.x,half+4,636-half),f.y,f.size,f.c)}
 X.globalAlpha=1;floats=floats.filter(f=>f.life>0);
}
function confettiBurst(){
 if(CALM)return;
 if(typeof window.confetti==='function'){
  const colors=['#22D3EE','#A855F7','#C084FC','#22C55E','#38BDF8'];
  window.confetti({particleCount:140,spread:90,origin:{y:.55},colors});
  later(()=>window.confetti&&window.confetti({particleCount:80,spread:120,origin:{y:.4},colors}),500);
 }else miniConfetti();
}

