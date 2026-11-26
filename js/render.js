'use strict';
/* js/render.js : Dibujo de cada escena en canvas */

/* =====================================================================
   15. DIBUJO DE CADA ESCENA
   ===================================================================== */
function drawMenu(t){
 raysBg(t);
 shadow(110,300,70);hero(110,300,{t,pose:'flex',m:.85,tier:3,sweat:0,slump:0,mouth:'smile',eyes:'normal'},3,{noAura:true});
 shadow(530,300,80);person(brau({t,pose:'flex',d:-1}));stamp(530,300,3);
 const b=Math.sin(t*2.5)*4;
 text('MACRO',320,92+b,46,'#4ADE80');text('CLASH',320,150-b,46,'#A855F7');
 text('VS',320,246,22,'#EF4444');
 text('Camino al Olimpo del Gym',320,334,13,'#F1F5F9');
}
function drawCustom(t){
 raysBg(t);shadow(320,326,90);
 hero(320,326,{t,pose:preview>=2?'flex':'stand',sweat:0},4);
 text(['NOVATO','CONSTANTE','ATLETA','OLÍMPICO'][preview],320,40,16,'#38BDF8');
}
const KID=()=>heroLook({m:.05,tier:0,slump:0,sweat:0,band:0,wraps:0,mouth:'neutral',eyes:'normal'});
function drawStory(dt){
 ST.t+=dt;const t=ST.t;
 if(t>=22){endStory();return}
 const once=(k,fn)=>{if(!ST.done[k]){ST.done[k]=1;fn()}};
 if(t>=15&&t<20){
  raysBg(t);shadow(320,340,90);
  person({...KID(),t,d:1,pose:'fist',flyer:1,eyes:t>16?'angry':'wide',mouth:t>16?'grit':'neutral',lookUp:t>16});stamp(320,340,4);
  for(let i=0;i<6;i++){const k=(t*2+i*.4)%1,x=[130,500,180,470,110,540][i],y=[90,110,190,60,250,220][i];X.globalAlpha=1-k;R(i%2?'#A855F7':'#fff',x-8*k,y,16*k+2,3);R(i%2?'#A855F7':'#fff',x,y-8*k,3,16*k+2)}X.globalAlpha=1;
  if(t>16.3)text('¡VOY A ENTRENAR!',320,46,18,'#A855F7');
 }else{
  gymScene(t);
  const push=t<6.5?0:t<7.9?1:0,bx=t<6.5?476:t<7.1?476-40*(t-6.5)/.6:t<8.6?436:t<9.4?436+40*(t-8.6)/.8:476;
  shadow(bx,306,42);person(brau({t,d:-1,pose:push&&t>6.9?'punch':(t<5.8||t>9.6)?'curl':'watch',ph:t*4}));stamp(bx,306,2.2);
  if(t<7.1){
   const x=t<.4?-30:Math.min(356,-30+386*(t-.4)/3.2),walking=t>.4&&x<356;
   shadow(x,304,24);person({...KID(),t,d:1,pose:walking?'walk':'stand',ph:x*.14});stamp(x,304,2);
   if(walking){const s=(t*3.4)|0;if(s!==ST.stp){ST.stp=s;sfx('step')}}
  }else{
   const u=E01(7.1,8.1,t),x=356-132*u,y=304-Math.sin(u*Math.PI)*60;
   shadow(x,304,52);lying({...KID(),t,dizzy:u>=1});stamp(x,y,2);
  }
  if(t>=8.3){const u=E01(8.3,9.5,t),fx=u<1?192+44*Math.sin(u*9)*(1-u):176,fy=u<1?100+198*u:298;box(X,'#f6ecd0',fx,fy,u<1?18:28,u<1?14:8);R('#EF4444',fx,fy,u<1?18:28,3)}
  if(t>=3.9&&t<6.5)bubble('Disculpa, ¿me explicas cómo se usa esta máquina?',356,180,230);
  if(t>=7.1&&t<10.2)bubble('¡Largo, perdedor!',bx,160);
  if(t>=.9&&t<3.8)caption('01/02/2026 · Tu primer día en el gimnasio');
  if(t>=7.1)once('push',()=>{sfx('hurt');impact(366,230,40,'#EF4444')});
  if(t>=8.1)once('land',()=>{sfx('hit');burst(224,300,['#94A3B8','#64748b'],18,120)});
  if(t>=10.7){
   X.fillStyle=`rgba(5,7,11,${.84*E01(10.7,11.3,t)})`;X.fillRect(0,0,640,360);
   if(t>=11){once('fl',()=>sfx('alert'));const k=E01(11,11.7,t),e=1+2.7*Math.pow(k-1,3)+1.7*Math.pow(k-1,2);flyer(Math.max(.05,e),(1-k)*-.5+Math.sin(t*2)*.015)}
  }
 }
 if(t>=15)once('up',()=>{sfx('up');doFlash('255,255,255',.8)});
 let a=t<.8?1-t/.8:t>=20.5?E01(20.5,21.8,t):0;if(a>0){X.fillStyle=`rgba(0,0,0,${a})`;X.fillRect(0,0,640,360)}
}
function caption(s){X.fillStyle='rgba(5,7,11,.82)';X.fillRect(0,320,640,40);text(s,320,345,11,'#F1F5F9')}
function flyer(k,rot){
 X.save();X.translate(320,182);X.rotate(rot);X.scale(k,k);
 R('#07090d',-124,-166,248,332);R('#f6ecd0',-120,-162,240,324);R('#b91c1c',-120,-162,240,52);
 text('COMPETENCIA',0,-128,17,'#fff');text('FITNESS',0,-60,30,'#A855F7');
 R('#475569',-70,-24,140,8);for(const s of[-1,1]){R('#111827',s*70-8,-44,16,48);R('#111827',s*48-6,-36,12,32)}
 text('FECHA',0,48,14,'#f1f5f9');text('15/02/2026',0,86,20,'#fff');
 R('#A855F7',-18,104,36,24);R('#A855F7',-6,128,12,10);R('#5B21B6',-18,138,36,8);R('#A855F7',-28,106,10,12);R('#A855F7',18,106,10,12);
 X.restore();
}
function drawGym(t,dt){
 if(mode!=='train'&&mode!=='rest')castUpdate(dt);
 gymScene(t);
 const people=cast.filter(c=>!(c.walk&&c.wait>0));
 drawCast(people.filter(c=>c.y<=300).sort((a,b)=>a.y-b.y),t);
 if(act==='bench'&&tm)drawBench(t);
 else if(tm&&tm.ex.e==='bar')drawBar(t);else if(tm&&tm.ex.e==='beat')drawRope(t);
 else if(act==='rest')drawRest(t);
 else{shadow(320,308,34);hero(320,308,{t,pose:S.ENG<20?'tired':'stand'},2.4)}
 if(mode!=='train')for(const c of people)if(c.say)bubble(c.say,c.x,c.y-128,c.say.length>50?230:190);
}
function drawBench(t){
 aura(320,300,t);
 const up=tm.anim>0?Math.sin((1-tm.anim/.5)*Math.PI):0,sh=heroLook({t}),skin=sh.skin;
 shadow(320,292,120);
 /* soportes y banco */
 for(const x of[236,276]){box(X,'#64748b',x,176,8,112);box(X,'#94A3B8',x-4,200,16,6)}
 box(X,'#7f1d1d',228,252,150,12);R('#b91c1c',230,252,146,4);for(const x of[246,356]){box(X,'#475569',x,264,8,24);box(X,'#334155',x-10,286,28,6)}
 lying({...sh,t,noArm:true});stamp(312,254,2.2);
 /* brazos y barra */
 const barY=196-up*34,w=10+sh.m*8;
 for(const[x,c]of[[282,shade(skin,-.2)],[304,skin]]){X.lineCap='butt';for(const[lw,col]of[[w+4,'#07090d'],[w,c]]){X.strokeStyle=col;X.lineWidth=lw;X.beginPath();X.moveTo(x,236);X.lineTo(x-8+up*8,(236+barY)/2+8*(1-up));X.lineTo(x,barY);X.stroke()}}
 box(X,'#cbd5e1',214,barY-3,170,6);
 const r=16+Math.min(14,S.STR*.18);
 for(const x of[226,372]){box(X,'#111827',x-6,barY-r,12,r*2);R('#A855F7',x-4,barY-r+3,3,r*2-6);box(X,'#334155',x+(x<300?-14:8),barY-r*.65,6,r*1.3)}
 if(sh.sweat)for(let i=0;i<3;i++)R('#7dd3fc',230+i*12,220+((t*60+i*13)%34),4,6);
 trainHUD();
 /* barra de precisión */
 const x0=80,W=480,y=322;
 box(X,'#111827',x0,y,W,22);
 R('#22C55E',x0+tm.z*W,y,tm.w*W,22);R('#4ADE80',x0+tm.z*W,y,tm.w*W,5);
 R('#A855F7',x0+(tm.z+tm.w*.32)*W,y,tm.w*.36*W,22);R('#E9D5FF',x0+(tm.z+tm.w*.32)*W,y,tm.w*.36*W,5);
 box(X,'#fff',x0+tm.pos*W-3,y-7,6,36);
}
function drawBar(t){
 shadow(320,308,34);
 hero(320,308,tm.k==='curl'?{t,pose:'curl',ph:tm.pos*Math.PI-1.57}:{t,pose:'stretch'},2.4);
 trainHUD();
 const x0=80,W=480,y=322;box(X,'#111827',x0,y,W,22);
 R('#22C55E',x0+tm.z*W,y,tm.w*W,22);R('#A855F7',x0+(tm.z+tm.w*.32)*W,y,tm.w*.36*W,22);
 box(X,'#fff',x0+tm.pos*W-3,y-7,6,36);
}
function drawRope(t){
 const n=tm.note,near=n?Math.max(0,1-Math.abs(n.x-170)/110):0,hop=Math.max(near*30,tm.anim>0?Math.sin((1-tm.anim/.5)*Math.PI)*34:0);
 const sp=tm.k==='sprint',fy=296-hop,phase=n?(n.x-170)/90:t*5,cy=Math.cos(phase);
 shadow(320,300,40-hop*.4);
 const rope=()=>{for(const[lw,col]of[[7,'#07090d'],[3,'#A855F7']]){X.strokeStyle=col;X.lineWidth=lw;X.beginPath();X.moveTo(320-52,fy-52);X.quadraticCurveTo(320,fy-52+cy*118,320+52,fy-52);X.stroke()}};
 if(!sp&&Math.sin(phase)<0)rope();
 hero(320,fy,sp?{t,pose:'walk',ph:t*16}:{t,pose:'rope'},2.3);
 if(!sp&&Math.sin(phase)>=0)rope();
 trainHUD();
 /* carril de ritmo */
 const y=332;box(X,'#111827',60,y-14,520,28);
 R('#22C55E55',170-tm.win,y-14,tm.win*2,28);R('#A855F788',170-tm.win*.36,y-14,tm.win*.72,28);
 X.strokeStyle='#f1f5f9';X.lineWidth=3;X.beginPath();X.arc(170,y,17,0,7);X.stroke();
 if(n&&n.x<580){disc(X,'#07090d',n.x|0,y,13);disc(X,'#38BDF8',n.x|0,y,11);R('#fff',n.x-5,y-6,4,4)}
}
function trainHUD(){
 X.fillStyle='rgba(5,7,11,.82)';X.fillRect(0,0,640,38);
 text(`REP ${Math.min(NR,tm.r+1)}/${NR}`,14,25,11,'#F1F5F9','left');
 for(let i=0;i<NR;i++){const r=tm.results[i];box(X,r===undefined?'#1C2333':r===2?'#A855F7':r===1?'#4ADE80':'#EF4444',172+i*24,13,16,12)}
 text(`RACHA ${tm.combo}`,626,25,11,tm.combo>=3?'#A855F7':'#94A3B8','right');
 if(tm.r===0&&tm.wait>0&&tm.ex.e==='bar')text('¡PREPÁRATE!',320,90,22,'#38BDF8');
 if(tm.fbT>0){const k=Math.min(1,(.9-tm.fbT)*8);text(tm.fb,320,92-(1-k)*14,tm.fbC==='#A855F7'?26:20,tm.fbC)}
}
function drawRest(t){
 shadow(320,306,90);box(X,'#1d4ed8',232,300,176,10);R('#3b82f6',232,300,176,3);
 lying({...heroLook({sweat:0}),t});stamp(316,300,2.2);
 X.fillStyle='rgba(15,23,60,.38)';X.fillRect(0,0,640,360);
 for(let i=0;i<3;i++){const k=(t*.45+i/3)%1;X.globalAlpha=1-k;text(i%2?'z':'Z',262+k*50,252-k*80,12+k*12,'#38BDF8')}X.globalAlpha=1;
}
function hudBar(x,y,w,v,m,ghost,color,label,right){
 box(X,'#1C2333',x,y,w,13);
 const f=n=>Math.max(0,w*n/m),px=n=>right?x+w-f(n):x;
 if(ghost!==undefined)R('#F1F5F9',px(ghost),y,f(ghost),13);
 R(color,px(v),y,f(v),13);R('#ffffff44',px(v),y,f(v),4);
 for(let i=1;i<10;i++)R('#00000044',x+w*i/10,y,2,13);
 text(`${label} ${Math.round(v)}`,right?x+w:x,y-5,9,'#F1F5F9',right?'right':'left');
}
function drawBattle(t,dt){
 ringScene(t);
 if(!B){
  shadow(190,312,40);hero(190,312,{t,pose:'guard',gloves:'#38BDF8'},2.7);
  shadow(450,312,58);person(brau({t,d:-1,pose:'flex',gloves:1}));stamp(450,312,3);
  frontRope();text('TÚ  VS  BRAULIO',320,40,18,'#F1F5F9');return;
 }
 B.pa-=dt;B.ba-=dt;B.sayT-=dt;B.cheer=Math.max(0,B.cheer-dt);B.pk*=Math.pow(.01,dt);B.bk*=Math.pow(.01,dt);
 B.show.hp=Math.max(B.hp,B.show.hp-70*dt);B.show.bh=Math.max(B.bh,B.show.bh-90*dt);
 const win=B.over&&B.bh<=0,lose=B.over&&B.hp<=0,tiredB=B.be<=0,lowP=B.hp<B.ph*.28;
 /* protagonista */
 let pp=B.pa>0?B.pp:win?'cheer':lowP?'tired':'guard';
 const px=190-B.pk+(B.pa>0&&B.pp==='punch'?Math.sin((1-B.pa/.55)*Math.PI)*172:0);
 if(lose){shadow(180,314,70);lying({...heroLook(),t,dizzy:1});stamp(180,314,2.7)}
 else{shadow(px,312,40);hero(px,312,{t,d:1,pose:pp,gloves:win?0:'#38BDF8',slump:0,sweat:lowP||B.pe<20,eyes:pp==='hit'?'dizzy':win?'happy':lowP?'tired':'angry',mouth:win?'smile':pp==='hit'?'open':'grit'},2.7)}
 /* Braulio */
 const bpose=B.ba>0?B.bp:win?'tired':lose?'flex':tiredB?'tired':'guard';
 const bx=450+B.bk-(B.ba>0&&B.bp==='punch'?Math.sin((1-B.ba/.55)*Math.PI)*168:0);
 if(win){shadow(462,314,80);lying({...brau({}),m:1,t,dizzy:1});stamp(462,314,3.1,{flip:true})}
 else{
  shadow(bx,312,58);
  const hurt=bpose==='hit';
  person(brau({t,d:-1,pose:bpose,gloves:1,state:tiredB?'tired':'',...(hurt?{eyes:'dizzy',mouth:'open'}:{}),...(lose?{eyes:'happy',mouth:'smile'}:{})}));
  stamp(bx+(hurt?Math.sin(t*60)*4:0),312,3);
  if(tiredB&&!B.over){const k=(t*1.6)%1;X.globalAlpha=1-k;disc(X,'#e2e8f0',(bx-40-k*30)|0,(204-k*14)|0,4+(k*8|0));X.globalAlpha=1;text('¡SIN AIRE!',bx,128,10,'#38BDF8')}
 }
 frontRope();
 /* HUD */
 X.fillStyle='rgba(5,7,11,.7)';X.fillRect(0,0,640,60);
 hudBar(14,18,236,B.hp,B.ph,B.show.hp,B.hp<B.ph*.28?'#EF4444':'#22C55E','TÚ HP');
 hudBar(14,42,180,B.pe,B.pem,undefined,'#38BDF8','EN');
 hudBar(390,18,236,B.bh,B.bhm,B.show.bh,'#A855F7','BRAULIO',true);
 hudBar(446,42,180,B.be,B.bem,undefined,tiredB?'#EF4444':'#C084FC','AIRE',true);
 text('T'+B.turn,320,32,14,'#F1F5F9');
 if(B.sayT>0&&B.say&&!(B.bp==='hit'&&B.ba>0))bubble(B.say,bx,150,210);
}

