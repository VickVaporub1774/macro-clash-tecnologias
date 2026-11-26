'use strict';
/* js/sprites.js : Sprites pixel-art procedurales */

/* =====================================================================
   6. SPRITES PIXEL-ART PROCEDURALES
   ===================================================================== */
function R(c,x,y,w,h,g=X){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
const SW=96,SH=100,OX=48,OY=92;
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;return[c,g]};
const[spr,G]=mk(SW,SH),[sil,Gs]=mk(SW,SH);
const P=(c,x,y,w,h)=>R(c,OX+x,OY+y,w,h,G);               /* píxel de arte: origen en los pies */
function limb(c,x0,y0,x1,y1,w){const n=Math.max(1,Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0))));for(let i=0;i<=n;i++)P(c,lerp(x0,x1,i/n)-w/2,lerp(y0,y1,i/n)-w/2,w,w)}
function shade(hex,f){const n=parseInt(hex.slice(1),16),m=v=>clamp(Math.round(f<0?v*(1+f):v+(255-v)*f),0,255);return`rgb(${m(n>>16)},${m(n>>8&255)},${m(n&255)})`}
/* Compone el sprite con contorno oscuro y lo coloca en el escenario */
function stamp(cx,fy,scale=2,o={}){
 Gs.globalCompositeOperation='source-over';Gs.clearRect(0,0,SW,SH);Gs.drawImage(spr,0,0);
 Gs.globalCompositeOperation='source-in';Gs.fillStyle=o.outline||'#07090d';Gs.fillRect(0,0,SW,SH);
 X.save();X.translate(Math.round(cx),Math.round(fy));if(o.flip)X.scale(-1,1);if(o.alpha!==undefined)X.globalAlpha=o.alpha;
 const x=-OX*scale,y=-OY*scale,w=SW*scale,h=SH*scale;
 for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])X.drawImage(sil,x+dx*scale,y+dy*scale,w,h);
 X.drawImage(spr,x,y,w,h);X.restore();
}
/* Cara reutilizable. hx,hy = esquina superior izquierda de la cabeza */
function face(o,hx,hy,hs,d){
 const ex=o.eyes||'normal',mo=o.mouth||'neutral',cxh=hx+hs/2+d,ey=hy+5,l=Math.round(cxh-4),r=Math.round(cxh+2),ink='#10131a';
 for(const[e,s]of[[l,-1],[r,1]]){
  if(ex==='dizzy'){P(ink,e,ey-1,1,1);P(ink,e+2,ey-1,1,1);P(ink,e+1,ey,1,1);P(ink,e,ey+1,1,1);P(ink,e+2,ey+1,1,1)}
  else if(ex==='happy'){P(ink,e,ey+1,1,1);P(ink,e+1,ey,1,1);P(ink,e+2,ey+1,1,1)}
  else if(ex==='tired'){P(shade(o.skin,-.25),e,ey-1,3,1);P(ink,e,ey,3,1)}
  else if(ex==='wide'){P('#fff',e,ey-1,3,4);P(ink,e+1,ey,1,2)}
  else{P('#fff',e,ey,2,2);P(ink,e+(d>=0?1:0),ey,1,2)}
  if(ex==='angry'){const b=o.brow||o.hair;P(b,e+(s<0?-1:1),ey-3,2,1);P(b,e+(s<0?1:-1),ey-2,2,1)}
  else if(ex!=='dizzy')P(o.brow||o.hair,e,ey-(ex==='wide'?3:2),3,1);
 }
 P(shade(o.skin,-.22),Math.round(cxh)-1,ey+2,2,2);
 const my=hy+hs-4,mx=Math.round(cxh)-2;
 if(mo==='smile'){P('#5b1f1f',mx,my,1,1);P('#5b1f1f',mx+1,my+1,3,1);P('#5b1f1f',mx+4,my,1,1)}
 else if(mo==='open'){P('#3b0d0d',mx+1,my-1,3,3)}
 else if(mo==='grit'){P('#3b0d0d',mx,my-1,5,3);P('#fff',mx,my,5,1)}
 else if(mo==='tongue'){P('#3b0d0d',mx,my-1,5,3);P('#f47b8c',mx+1,my+1,3,3)}
 else P('#5b1f1f',mx+1,my,3,1);
 if(o.gl){const f=o.gl===2?'#0b0d12':'#c7d2e0';
  for(const e of[l,r]){if(o.gl===2){P(f,e-1,ey-1,4,3);P('#38BDF8',e,ey-1,1,1)}else{P(f,e-1,ey-2,5,1);P(f,e-1,ey+2,5,1);P(f,e-1,ey-1,1,3);P(f,e+3,ey-1,1,3)}}
  P(f,l+3,ey-1,r-l-3,1)}
}
/* Persona de frente. Parámetros: m (músculo 0..1), pose, expresiones, ropa... */
function person(o){
 G.clearRect(0,0,SW,SH);
 const skin=o.skin||'#e0a67a',hair=o.hair||'#2b1b10',shirt=o.shirt||'#94A3B8',pants=o.pants||'#2a4d8f',sd=shade(skin,-.2),hi=shade(skin,.22);
 const m=o.m??.25,big=o.big||0,pose=o.pose||'stand',d=o.d||1,t=o.t||0,ph=o.ph||0,tier=o.tier??1;
 const tw=Math.round(13+m*5+big*7),sw=Math.round(tw+2+m*7+big*2),aw=Math.round(4+m*3+big*2),lw=o.lw||Math.round(5+m*2+big*2),hs=14;
 const moving=pose==='walk'||pose==='sweep';
 const breathe=moving?0:(Math.sin(t*(pose==='tired'?9:2.4))>0.2?1:0);
 const tired=pose==='tired',lean=tired?7:(o.slump?2:0);
 const step=moving?Math.round(Math.sin(ph)*3):0;
 const stance=(pose==='guard'||pose==='punch'||tired||pose==='flex')?3:0;
 const hip=-17,top=-37+breathe+lean;
 /* piernas y tenis */
 for(const s of[-1,1]){
  const hx=s*(lw/2+1),fx=s*(lw/2+1+stance)+(moving?s*step:0),lift=moving&&s*step>1?2:0;
  limb(s<0?sd:skin,hx,hip,fx,-4-lift,lw);if(o.long)limb(pants,hx,hip,fx,-5-lift,lw+1);
  if(m>.55&&!o.lw)P(hi,fx-1,-10-lift,2,3);
  P(o.shoe||'#e2e8f0',fx-lw/2-(d<0?2:0),-3-lift,lw+2,3);P(o.shoeS||'#EF4444',fx-lw/2,-2-lift,lw,1);
 }
 /* short */
 P(pants,-tw/2,-22+(tired?2:0),tw,7);P(shade(pants,.25),-tw/2,-22+(tired?2:0),tw,1);
 for(const s of[-1,1])P(pants,s<0?-tw/2-stance/2:1+stance/2,-16,tw/2-1,3);
 /* torso en V */
 const th=-21-top;
 for(let i=0;i<th;i++){const w=Math.round(lerp(sw,tw-1,Math.pow(i/th,1.4)));
  P(skin,-w/2,top+i,w,1);
  const strap=tier>=3?3:tier===2?2:0;
  if(strap&&i<5){P(shirt,-w/4-strap/2,top+i,strap,1);P(shirt,w/4-strap/2,top+i,strap,1)}
  else{const side=tier>=3&&i<th-6?Math.round(w*.12):0;P(shirt,-w/2+side,top+i,w-side*2,1);P(shade(shirt,-.22),w/2-side-3,top+i,3,1)}
 }
 if(m>.4&&tier>0){const c=shade(shirt,-.3);P(c,-sw/4-2,top+8,sw/4,1);P(c,3,top+8,sw/4,1);P(c,0,top+5,1,4)}
 if(m>.68&&tier>=2){const c=shade(shirt,-.3);for(let i=0;i<3;i++){P(c,-4,top+10+i*3,3,1);P(c,2,top+10+i*3,3,1)}}
 if(o.label){/* letras pixel 3x5: B R O */['110101110101110','110101110110101','111101101101111'].forEach((g,n)=>[...g].forEach((v,i)=>{if(v==='1')P('#fff',-6+n*4+i%3,top+7+(i/3|0),1,1)}))}
 if(o.stripe){P(o.stripe,-sw/2+1,top+4,sw-2,2);P(o.stripe,-sw/2+1,top+th-4,sw-2,2)}
 P(shade(pants,-.35),-tw/2,-23+(tired?2:0),tw,2);
 /* cabeza */
 const hy=top-hs-1+(tired?3:0)-(o.lookUp?1:0),hx=-hs/2+(o.slump?d*2:0);
 P(sd,-4+(o.slump?d:0),top-3,8,4);
 P(skin,hx+1,hy,hs-2,hs);P(skin,hx,hy+2,hs,hs-4);P(sd,hx-1,hy+6,1,3);P(sd,hx+hs,hy+6,1,3);P(hi,hx+3,hy+2,3,1);
 if(o.beard){P(hair,hx+1,hy+hs-5,hs-2,5);P(hair,hx,hy+hs-7,2,4);P(hair,hx+hs-2,hy+hs-7,2,4)}
 face({...o,skin,hair},hx,hy,hs,o.d?d:0);
 if(o.spikes){const c=o.spikes,cl=shade(c,.45);P(c,hx,hy-2,hs,5);[[-1,6],[3,9],[7,11],[11,8]].forEach(([a,h])=>{for(let i=0;i<h;i++){const w=Math.max(1,4-Math.floor(i*4/h));P(c,hx+a+(4-w)/2,hy-1-i,w,1)}P(cl,hx+a+1,hy-h/2,1,3)})}
 else if(o.cap){P(o.cap,hx,hy-2,hs,5);P(shade(o.cap,-.3),hx+(d>0?hs-3:-4),hy+2,7,2);P('#fff',hx+hs/2-1,hy-1,2,2)}
 else if(!o.bald&&o.hs===1){P(hair,hx+1,hy-1,hs-2,2)}
 else if(!o.bald){if(o.hs===3){P(hair,hx-1,hy+3,3,12);P(hair,hx+hs-2,hy+3,3,12)}if(o.hs===4)P(hair,hx-3,hy-5,hs+6,9);P(hair,hx+1,hy-2,hs-2,4);P(hair,hx,hy,hs,2);P(hair,hx,hy+2,2,4);P(hair,hx+hs-2,hy+2,2,3);P(shade(hair,.25),hx+4,hy-1,4,1)}
 if(o.beanie){P(o.beanie,hx,hy-3,hs,6);P(shade(o.beanie,.3),hx,hy+1,hs,1)}
 if(o.band){P(o.band,hx,hy+1,hs,2);P(o.band,hx+(d>0?-3:hs),hy+2,3,2)}
 /* brazos: [codo, mano] relativos al hombro */
 const shY=top+3,A=s=>{
  const sh=[s*(sw/2+aw/2-2),shY];let e=[s*1,9],h=[s*1,18];
  const front=s===d;
  switch(pose){
   case'walk':{const q=Math.sin(ph)*3*s;e=[s,9];h=[s+q,17];break}
   case'guard':e=[s*3,9];h=[-s*4,0+Math.round(Math.sin(t*6+s)*1)];break;
   case'punch':if(front){e=[d*9,1];h=[d*20,-1]}else{e=[s*3,9];h=[-s*5,1]}break;
   case'flex':{const q=Math.sin(t*5)>0?1:0;e=[s*9,0];h=[s*7,-11-q];break}
   case'watch':e=[s,9];h=[-s*(sw/2),7+(s>0?2:0)];break;
   case'curl':{const q=(1+Math.sin(ph))/2;e=[s*2,9];h=[s*2,17-q*18];break}
   case'phone':if(front){e=[s*2,10];h=[-s*5,3]}break;
   case'drink':if(front){e=[s*5,5];h=[-s*7,-8]}break;
   case'stretch':e=[s*4,-8];h=[-s*3,-18];break;
   case'talk':if(front){e=[s*6,7];h=[s*9,-3-(Math.sin(t*7)>0?4:0)]}else{e=[s,10];h=[-s*3,8]}break;
   case'sweep':e=[s*2+d*3,8];h=[d*8-s*(sw/2-3),10+s*2];break;
   case'fist':if(front){e=[s*7,-3];h=[s*5,-17]}break;
   case'cheer':e=[s*7,-3];h=[s*8,-16-(Math.sin(t*9)>0?2:0)];break;
   case'tired':e=[s*3,9];h=[-s*2,17];break;
   case'hit':e=[s*8,2];h=[s*13,8];break;
   case'rope':e=[s*3,9];h=[s*9,12];break;
   default:if(o.slump){e=[s*0,10];h=[-s*1,19]}
  }
  return{sh,el:[sh[0]+e[0],sh[1]+e[1]],ha:[sh[0]+h[0],sh[1]+h[1]]};
 };
 for(const s of[-1,1]){
  const a=A(s),col=s<0?sd:skin;
  P(col,a.sh[0]-aw/2-1,a.sh[1]-3,aw+2,aw+1);                    /* hombro */
  limb(col,...a.sh,...a.el,aw+(m>.5?1:0));
  if(m>.35){const mx=(a.sh[0]+a.el[0])/2,my=(a.sh[1]+a.el[1])/2,bw=aw+Math.round(m*2);P(col,mx-bw/2,my-bw/2,bw,bw);P(hi,mx-1,my-bw/2+1,3,1)}
  limb(col,...a.el,...a.ha,Math.max(3,aw-1));
  if(tier===0){limb(shirt,...a.sh,...a.el,aw+1)}else if(tier===1){limb(shirt,...a.sh,(a.sh[0]+a.el[0])/2,(a.sh[1]+a.el[1])/2,aw+1)}
  const[x,y]=a.ha;
  if(o.gloves){P(o.gloves,x-4,y-4,8,8);P(shade(o.gloves,.35),x-2,y-3,3,2);P('#f1f5f9',x-3,y+3,6,2)}
  else{if(o.wraps)P(o.wraps,(a.el[0]+x*3)/4-2,(a.el[1]+y*3)/4-2,4,4);P(col,x-2,y-2,4,4)}
  if(pose==='curl'){P('#cbd5e1',x-6,y-1,12,2);P('#334155',x-8,y-4,3,8);P('#334155',x+5,y-4,3,8)}
  if(pose==='phone'&&s===d){P('#0f172a',x-2,y-7,5,8);P('#38BDF8',x-1,y-6,3,5)}
  if(pose==='drink'&&s===d){P('#38BDF8',x-2,y-5,5,10);P('#f1f5f9',x-1,y-7,3,2)}
  if(pose==='talk'&&s!==d){P('#f6ecd0',x-6,y-6,11,13);for(let i=0;i<4;i++)P('#94A3B8',x-4,y-3+i*3,7,1)}
  if(pose==='fist'&&s!==d&&o.flyer){P('#f6ecd0',x-5,y-3,10,12);P('#EF4444',x-5,y-3,10,3)}
 }
 if(pose==='sweep'){const bx=d*(18+Math.round(Math.sin(ph)*4));limb('#92623a',d*5,shY+8,bx,-4,2);P('#d4a72c',bx-5,-5,11,4);P('#a67c1a',bx-5,-1,11,1)}
 /* sudor */
 if(o.sweat){for(let i=0;i<4;i++){const k=(t*1.4+i*.27)%1,sx=[hx-3,hx+hs+2,-sw/2-3,sw/2+2][i],sy=(i<2?hy+2:top+4)+k*13;P('#7dd3fc',sx,sy,2,3);P('#e0f2fe',sx,sy,1,1)}}
}
/* Persona acostada (suelo / banca) */
function lying(o){
 G.clearRect(0,0,SW,SH);const skin=o.skin,sd=shade(skin,-.2),aw=Math.round(5+(o.m||.2)*3),th=Math.round(11+(o.m||.2)*4);
 const hc=o.spikes||o.hair;P(skin,-34,-14,13,13);P(hc,-35,-15,6,15);P(hc,-30,-15,8,3);if(o.spikes)for(let i=0;i<4;i++)P(hc,-39-(i%2)*2,-14+i*4,5,2);
 if(o.dizzy){for(const[a,b]of[[0,0],[2,2],[1,1],[2,0],[0,2]])P('#10131a',-28+a,-10+b,1,1)}else{P('#10131a',-28,-9,4,1);P('#5b1f1f',-24,-5,3,1)}
 P(o.shirt,-21,-th,24,th);P(shade(o.shirt,.25),-21,-th,24,2);
 P(o.pants,3,-th+1,12,th-1);P(skin,15,-10,22,6);P(sd,15,-5,20,5);P('#e2e8f0',36,-11,5,11);
 if(!o.noArm){limb(skin,-14,-th,-8,-3,aw);limb(sd,-8,-3,4,-2,aw-1)}
 if(o.dizzy)for(let i=0;i<3;i++){const a=(o.t||0)*5+i*2.1;P('#E9D5FF',-29+Math.cos(a)*11,-21+Math.sin(a)*4,3,3)}
}
/* Apariencia del protagonista según estadísticas */
function level(){return S?(S.STR+S.STA+S.REC)/300:0}
function heroLook(extra={}){
 const lv=level(),tier=lv>=.62?3:lv>=.42?2:lv>=.22?1:0,low=S&&S.ENG<35&&mode!=='custom'&&mode!=='story';
 return{skin:PL.skin,hair:PL.hair,shirt:PL.shirt,pants:PL.pants,gl:PL.gl,beard:PL.beard,cap:PL.hat===1?PL.shirt:0,beanie:PL.hat===2?PL.acc:0,spikes:PL.hs===2?PL.hair:0,hs:PL.hs,long:PL.lg,stripe:PL.str,shoe:PL.shoe,
  m:clamp((lv-.08)*1.35,0,1),tier,slump:low||tier===0,sweat:low,eyes:low?'tired':tier>=2?'normal':'normal',mouth:low?'open':tier>=2?'smile':'neutral',
  band:PL.hat===3?PL.acc:(tier>=2&&!PL.hat?'#EF4444':0),wraps:tier>=2?'#f1f5f9':0,shoeS:tier>=2?'#A855F7':'#64748b',...extra};
}
function aura(cx,fy,t,scale=2){
 const lv=level();if(lv<.55)return;
 const gold=lv>=.75,col=gold?'168,85,247':'52,211,153';
 const g=X.createRadialGradient(cx,fy-30*scale,6,cx,fy-30*scale,46*scale);
 g.addColorStop(0,`rgba(${col},${.28+.1*Math.sin(t*5)})`);g.addColorStop(1,`rgba(${col},0)`);
 X.fillStyle=g;X.fillRect(cx-50*scale,fy-80*scale,100*scale,90*scale);
 for(let i=0;i<10;i++){const k=(t*.55+i*.1)%1,x=cx+Math.sin(i*7.3)*26*scale;X.globalAlpha=1-k;R(`rgb(${col})`,x,fy-k*66*scale,scale*1.5,scale*3)}
 X.globalAlpha=1;
}
function hero(cx,fy,extra={},scale=2,opts={}){
 if(!opts.noAura)aura(cx,fy,extra.t||0,scale);
 person(heroLook(extra));stamp(cx,fy,scale,opts);
}
/* Braulio "El Ciclado": torso enorme, piernas de popote */
function brau(extra={}){
 const ex=extra.state==='tired';
 return{skin:'#d98a5b',hair:'#6b4a10',brow:'#3b2606',shirt:'#EF4444',pants:'#111827',m:1,big:1,lw:4,tier:3,spikes:'#FACC15',band:'#A855F7',
  label:'BRO',shoe:'#A855F7',shoeS:'#111827',
  eyes:ex?'tired':'angry',mouth:ex?'tongue':'grit',sweat:ex,...extra,gloves:extra.gloves?'#7f1d1d':0};
}

