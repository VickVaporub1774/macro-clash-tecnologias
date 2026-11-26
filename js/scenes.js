'use strict';
/* js/scenes.js : Escenarios (gimnasio, ring) y elenco/globos de dialogo */

/* =====================================================================
   7. ESCENARIOS
   ===================================================================== */
function disc(g,c,cx,cy,r){g.fillStyle=c;for(let d=-r;d<=r;d+=2){const w=Math.round(Math.sqrt(r*r-d*d));g.fillRect(cx-w,cy+d,w*2,2)}}
function box(g,c,x,y,w,h){R('#07090d',x-2,y-2,w+4,h+4,g);R(c,x,y,w,h,g)}
function gtext(g,t,x,y,size,color){g.font=`${size}px "Press Start 2P",monospace`;g.textAlign='center';g.fillStyle=color;g.fillText(t,x,y)}
const MIR={x:214,y:92,w:212,h:140};
function buildGym(){
 const[c,g]=mk(640,360);
 /* pared y paneles */
 const wall=g.createLinearGradient(0,0,0,240);wall.addColorStop(0,'#10141f');wall.addColorStop(1,'#232c42');g.fillStyle=wall;g.fillRect(0,0,640,240);
 for(let y=60;y<220;y+=16)for(let x=(y/16)%2*-18;x<640;x+=36)R('#ffffff06',x+1,y+1,34,14,g);
 R('#0d111a',0,0,640,18,g);R('#2b354a',0,18,640,3,g);
 for(const x of[104,320,536]){box(g,'#334155',x-28,12,56,10);R('#FEF3C7',x-24,22,48,4,g)}
 R('#A855F7',0,222,640,4,g);R('#1c2333',0,226,640,14,g);
 /* piso de caucho con perspectiva */
 const fl=g.createLinearGradient(0,240,0,360);fl.addColorStop(0,'#171c28');fl.addColorStop(1,'#2a3040');g.fillStyle=fl;g.fillRect(0,240,640,120);
 g.strokeStyle='#0c0f17';g.lineWidth=2;
 for(let x=-640;x<=1280;x+=80){g.beginPath();g.moveTo(320+(x-320)*.45,240);g.lineTo(x,360);g.stroke()}
 for(const y of[240,254,274,302,340])R('#0c0f17',0,y,640,2,g);
 let seed=7;const sr=()=>(seed=(seed*16807)%2147483647)/2147483647;
 for(let i=0;i<520;i++)R(sr()<.1?'#38bdf844':'#ffffff12',sr()*640,242+sr()*116,2,2,g);
 /* letrero */
 box(g,'#0b0e14',232,38,176,38);gtext(g,'MACRO GYM',320,63,16,'#22D3EE');
 /* carteles pixel-art */
 const poster=(x,y,w,l1,l2,c1,icon)=>{box(g,'#f1e7cf',x,y,w,62);R(c1,x+4,y+4,w-8,30,g);icon(x+w/2,y+19);gtext(g,l1,x+w/2,y+46,8,'#111827');gtext(g,l2,x+w/2,y+57,8,c1)};
 poster(14,48,80,'NO PAIN','NO GAIN','#b91c1c',(x,y)=>{R('#f1f5f9',x-20,y-2,40,4,g);for(const s of[-1,1]){R('#111827',x+s*20-3,y-11,6,22,g);R('#111827',x+s*12-3,y-7,6,14,g)}});
 poster(112,48,80,'DUERME','7-9 H','#1d4ed8',(x,y)=>{disc(g,'#FEF3C7',x-6,y,10);disc(g,'#1d4ed8',x-1,y-3,9);gtext(g,'z',x+12,y,8,'#fff');gtext(g,'Z',x+22,y-4,8,'#fff')});
 poster(446,48,80,'TOMA','AGUA','#0e7490',(x,y)=>{R('#e0f2fe',x-7,y-10,14,22,g);R('#38BDF8',x-5,y-2,10,12,g);R('#111827',x-4,y-14,8,4,g)});
 poster(544,48,82,'COME','REAL','#15803D',(x,y)=>{disc(g,'#EF4444',x-5,y+2,9);disc(g,'#EF4444',x+5,y+2,9);R('#7c4a1e',x-1,y-13,3,8,g);R('#4ADE80',x+2,y-12,8,4,g)});
 /* espejo (base; el reflejo se dibuja en vivo) */
 box(g,'#64748b',MIR.x-6,MIR.y-6,MIR.w+12,MIR.h+6);
 const mg=g.createLinearGradient(0,MIR.y,0,MIR.y+MIR.h);mg.addColorStop(0,'#3b5576');mg.addColorStop(1,'#223148');g.fillStyle=mg;g.fillRect(MIR.x,MIR.y,MIR.w,MIR.h);
 for(const x of[262,334,376])R('#ffffff0a',x,MIR.y,14,MIR.h,g);
 for(const x of[285,355])R('#64748b',x,MIR.y,2,MIR.h,g);
 /* rack de mancuernas */
 for(const x of[18,180])box(g,'#475569',x,160,8,88);
 for(const[y,s]of[[174,7],[204,9],[236,11]]){box(g,'#334155',16,y+8,174,6);
  for(let i=0;i<4;i++){const x=48+i*37,col=['#38BDF8','#4ADE80','#A855F7','#EF4444'][i];
   R('#cbd5e1',x-9,y-1,18,4,g);for(const d of[-1,1]){box(g,'#111827',x+d*11-4,y+7-s*2,8,s*2);R(col,x+d*11-3,y+9-s*2,2,s*2-4,g)}}}
 /* banco plano y árbol de discos */
 box(g,'#7f1d1d',452,216,106,12);R('#b91c1c',454,216,102,4,g);for(const x of[466,540]){box(g,'#64748b',x,228,6,20);box(g,'#475569',x-8,246,22,5)}
 box(g,'#475569',596,150,8,100);box(g,'#334155',578,248,44,6);
 for(const[y,r,col]of[[178,13,'#38BDF8'],[210,17,'#4ADE80'],[240,15,'#A855F7']]){disc(g,'#07090d',600,y,r+2);disc(g,col,600,y,r);disc(g,'#111827',600,y,r-5);disc(g,'#94A3B8',600,y,3)}
 /* kettlebells y planta */
 for(const[x,r,col]of[[436,8,'#EF4444'],[204,7,'#38BDF8']]){box(g,'#1f2937',x-r+2,250-r*2-5,r*2-4,4);disc(g,'#07090d',x,250-r,r+2);disc(g,col,x,250-r,r);R('#ffffff88',x-r/2,250-r-r/2,3,3,g)}
 for(const[dx,h]of[[-9,28],[-2,40],[6,32],[11,20]]){R('#15803D',630+dx-9,228-h,6,h,g);R('#22C55E',630+dx-9,228-h,2,h,g)}
 box(g,'#7E22CE',612,228,22,22);
 return c;
}
function buildRing(){
 const[c,g]=mk(640,360);
 const bg=g.createLinearGradient(0,0,0,250);bg.addColorStop(0,'#06080e');bg.addColorStop(1,'#1b1730');g.fillStyle=bg;g.fillRect(0,0,640,360);
 box(g,'#111827',212,72,216,34);gtext(g,'FINAL FITNESS',320,94,13,'#A855F7');
 for(const x of[60,190,450,580]){box(g,'#334155',x-14,60,28,12);R('#FEF3C7',x-10,72,20,4,g)}
 /* lona en perspectiva */
 g.fillStyle='#07090d';g.beginPath();g.moveTo(56,236);g.lineTo(584,236);g.lineTo(652,348);g.lineTo(-12,348);g.fill();
 const m=g.createLinearGradient(0,240,0,344);m.addColorStop(0,'#33415c');m.addColorStop(1,'#64748b');g.fillStyle=m;
 g.beginPath();g.moveTo(60,240);g.lineTo(580,240);g.lineTo(640,344);g.lineTo(0,344);g.fill();
 g.strokeStyle='#ffffff30';g.lineWidth=3;g.beginPath();g.ellipse(320,298,120,34,0,0,7);g.stroke();gtext(g,'★',320,305,22,'#ffffff30');
 R('#7f1d1d',0,344,640,16,g);
 /* postes y cuerdas traseras */
 for(const[x,col]of[[60,'#38BDF8'],[580,'#EF4444']]){box(g,'#94A3B8',x-5,152,10,92);box(g,col,x-8,148,16,26)}
 [['#EF4444',166],['#f1f5f9',190],['#38BDF8',214]].forEach(([col,y])=>{R('#07090d',60,y-1,520,6,g);R(col,60,y,520,3,g)});
 return c;
}
let gymBg=buildGym(),ringBg=buildRing();
if(document.fonts&&document.fonts.load)Promise.all([document.fonts.load('10px "Press Start 2P"'),document.fonts.load('800 14px "JetBrains Mono"')]).then(()=>{gymBg=buildGym();ringBg=buildRing()}).catch(()=>{});
function gymScene(t){
 X.drawImage(gymBg,0,0);
 /* reloj real */
 const d=new Date(),m=d.getMinutes()+d.getSeconds()/60,h=d.getHours()%12+m/60;
 disc(X,'#07090d',210,58,17);disc(X,'#f1f5f9',210,58,15);X.lineWidth=2;
 for(const[v,l,col]of[[m/60,12,'#111827'],[h/12,8,'#EF4444']]){X.strokeStyle=col;X.beginPath();X.moveTo(210,58);X.lineTo(210+Math.sin(v*6.283)*l,58-Math.cos(v*6.283)*l);X.stroke()}
 /* reflejo sutil en el espejo */
 X.save();X.beginPath();X.rect(MIR.x,MIR.y,MIR.w,MIR.h);X.clip();
 for(const c of cast)if(!(c.walk&&c.wait>0)){person({...c,t,sweat:0});stamp(c.x,Math.min(c.y-52,244),1.6,{alpha:.2,flip:true})}
 if(act!=='bench'&&act!=='rest'){person(heroLook({t,pose:act==='rope'?'rope':'stand',sweat:0}));stamp(320,240,1.7,{alpha:.28,flip:true})}
 const sx=((t*40)%560)-120;X.fillStyle='#ffffff12';X.beginPath();X.moveTo(MIR.x+sx,MIR.y);X.lineTo(MIR.x+sx+26,MIR.y);X.lineTo(MIR.x+sx-34,MIR.y+MIR.h);X.lineTo(MIR.x+sx-60,MIR.y+MIR.h);X.fill();
 X.restore();
 /* luz ambiental */
 X.save();X.globalCompositeOperation='lighter';
 for(const[i,x]of[104,320,536].entries()){const a=.055+.008*Math.sin(t*2+i*2),g=X.createLinearGradient(0,26,0,330);g.addColorStop(0,`rgba(254,243,199,${a})`);g.addColorStop(1,'rgba(254,243,199,0)');
  X.fillStyle=g;X.beginPath();X.moveTo(x-22,26);X.lineTo(x+22,26);X.lineTo(x+96,330);X.lineTo(x-96,330);X.fill()}
 X.restore();
}
function ringScene(t){
 X.drawImage(ringBg,0,0);
 for(let row=0;row<2;row++)for(let i=0;i<22;i++){const x=i*31+(row?16:0)-6,y=124+row*20+Math.sin(t*4+i*1.7+row)*(B&&B.cheer>0?5:1.5);
  disc(X,row?'#252044':'#191633',x,y,8);R(row?'#252044':'#191633',x-12,y+7,24,14);if((i*7+row*3+(t*2|0))%23===0)R('#f1f5f9',x+7,y-9,3,3)}
 /* cuerdas traseras delante del público */
 for(const x of[60,580]){box(X,'#94A3B8',x-5,152,10,92);box(X,x<300?'#38BDF8':'#EF4444',x-8,148,16,26)}
 [['#EF4444',166],['#f1f5f9',190],['#38BDF8',214]].forEach(([col,y])=>{R('#07090d',60,y-1,520,6);R(col,60,y,520,3)});
 X.save();X.globalCompositeOperation='lighter';
 for(const[x,tx]of[[60,190],[190,215],[450,425],[580,450]]){const g=X.createLinearGradient(0,76,0,330);g.addColorStop(0,'rgba(254,243,199,.13)');g.addColorStop(1,'rgba(254,243,199,0)');
  const s=Math.sin(t*.8+x)*18;X.fillStyle=g;X.beginPath();X.moveTo(x-8,76);X.lineTo(x+8,76);X.lineTo(tx+55+s,330);X.lineTo(tx-55+s,330);X.fill()}
 X.restore();
}
function frontRope(){R('#07090d',0,341,640,7);R('#EF4444',0,342,640,4);for(const x of[6,634]){box(X,'#94A3B8',x-6,300,12,60);box(X,'#A855F7',x-8,330,16,24)}}
function shadow(x,y,w){X.fillStyle='rgba(0,0,0,.35)';X.beginPath();X.ellipse(x,y,w,w*.17,0,0,7);X.fill()}
function raysBg(t){
 R('#090A0F',0,0,640,360);const cx=320,cy=250;
 for(let i=0;i<22;i++){const a=i*Math.PI/11+t*.12,b=a+Math.PI/22;X.fillStyle=i%2?'#11131C':'#181035';X.beginPath();X.moveTo(cx,cy);X.lineTo(cx+800*Math.cos(a),cy+800*Math.sin(a));X.lineTo(cx+800*Math.cos(b),cy+800*Math.sin(b));X.fill()}
 const g=X.createRadialGradient(cx,cy,20,cx,cy,300);g.addColorStop(0,'rgba(168,85,247,.28)');g.addColorStop(1,'rgba(34,211,238,0)');X.fillStyle=g;X.fillRect(0,0,640,360);
 for(let i=0;i<28;i++){const k=(t*.08+i*.137)%1;X.globalAlpha=1-k;R(i%3?'#22D3EE':'#A855F7',(i*97)%640,360-k*360,3,3)}X.globalAlpha=1;
}

/* =====================================================================
   8. ELENCO DEL GIMNASIO Y GLOBOS DE DIÁLOGO
   ===================================================================== */
const SKINS=[['#e0a67a','#2b1b10'],['#c68a5c','#111111'],['#f0c29a','#8a5a2b'],['#8d5a3a','#111111'],['#e8b98e','#d9b24c']];
const SHC=['#e84a5f','#38BDF8','#A855F7','#4ADE80','#a78bfa','#C084FC','#e2e8f0','#2dd4bf'];
const PAC=['#2a4d8f','#222222','#444b57','#6b2a2a','#1f5a3a'];
function look(){const k=pick(SKINS);return{skin:k[0],hair:k[1],shirt:pick(SHC),pants:pick(PAC),m:Math.random()*.6,tier:1+rnd(2),cap:Math.random()<.18?pick(SHC):0,beard:Math.random()<.15}}
function spawnCast(){
 cast=[];const used=[];
 const free=x=>used.every(u=>Math.abs(u-x)>=56)&&Math.abs(x-320)>70;
 const slot=a=>{const c=a.filter(s=>free(s[0])),s=pick(c.length?c:a);used.push(s[0]);return s};
 const add=o=>{cast.push(Object.assign(look(),{x:320,y:296,d:1,pose:'stand',ph:Math.random()*6,wait:0},o))};
 let f=Math.random()<.2?0:rnd(6)+1;if(f&&f===lastFeat)f=f%6+1;if(f)lastFeat=f;
 if(f===1){const s=slot([[130,1],[500,-1]]);add({x:s[0],d:s[1],pose:'talk',shirt:'#C084FC',m:.8,tier:2,say:'¡Mi rutina de pecho es secreta y garantizada! Solo cuesta $999…'})}
 if(f===2){const l=Math.random()<.5,d=l?1:-1,lx=l?90:550,fx=l?162:478;used.push(lx,fx);add({x:lx,d,pose:'curl',m:.7,tier:2,say:'¡Hoy sí rompo mi récord de curl!'});add({x:fx,d:-d,pose:'watch',hair:'#cfd5dc'})}
 if(f===3){const d=Math.random()<.5?1:-1;add({walk:1,pose:'sweep',y:266,d,spd:50,x:d>0?-50:690,wait:rnd(2),shirt:'#2dd4bf',pants:'#444b57',cap:'#2dd4bf'})}
 if(f===4){const s=slot([[70,1],[572,-1]]);add({x:s[0],d:s[1],pose:'watch'})}
 if(f===5){const s=slot([[130,1],[500,-1]]);add({x:s[0],d:s[1],pose:'flex',m:1,big:.8,tier:3,shirt:'#334155',cap:0,say:'¡Mírenme, soy pura masa muscular!'})}
 if(f===6){used.push(480);add({x:480,d:-1,pose:'watch',m:1,big:.8,shirt:'#a78bfa',hair:'#d9b24c',beard:1,cap:0,say:'¡Dame 100 repeticiones más! ¡Sin excusas!'})}
 for(let i=0,n=1+rnd(2);i<n;i++){
  if(Math.random()<.55){const d=Math.random()<.5?1:-1;add({k:'ex',walk:1,pose:'walk',y:pick([258,266,276]),d,spd:35+Math.random()*55,x:d>0?-50:690,wait:Math.random()*7})}
  else{const fr=[[66,1],[142,1],[494,-1],[566,-1]].filter(s=>free(s[0]));if(fr.length){const s=pick(fr);used.push(s[0]);add({x:s[0],d:s[1],pose:pick(['stand','phone','stretch','curl','drink'])})}}
 }
}
function castUpdate(dt){
 for(const c of cast){
  if(!c.walk){c.ph+=6*dt;continue}
  if(c.wait>0){c.wait-=dt;continue}
  c.x+=c.d*c.spd*dt;c.ph=c.x*.14;
  if((c.d>0&&c.x>690)||(c.d<0&&c.x<-50)){c.wait=3+Math.random()*8;if(c.k==='ex')Object.assign(c,look(),{spd:35+Math.random()*55});c.d=Math.random()<.5?1:-1;c.x=c.d>0?-50:690}
 }
}
function drawCast(list,t){for(const c of list){if(c.walk&&c.wait>0)continue;shadow(c.x,c.y,24+(c.big||0)*8);person({...c,t:t+c.x*.01,d:c.d});stamp(c.x,c.y,2)}}
function bubble(t,cx,by,mw=190){
 X.font='800 13px "JetBrains Mono",monospace';
 const L=[];let cur='';for(const w of t.split(' ')){const n=cur?cur+' '+w:w;if(X.measureText(n).width>mw&&cur){L.push(cur);cur=w}else cur=n}L.push(cur);
 const w=Math.ceil(Math.max(...L.map(s=>X.measureText(s).width)))+18,h=L.length*16+12,bx=clamp(cx-w/2,6,634-w),ty=Math.max(6,by-10-h),tx=clamp(cx,bx+14,bx+w-14);
 R('#07090d',bx-3,ty,w+6,h);R('#07090d',bx,ty-3,w,h+6);R('#f8fafc',bx,ty,w,h);
 for(let i=0;i<5;i++){R('#07090d',tx-9+i*2,ty+h+i*2,18-i*4,3);if(i<4)R('#f8fafc',tx-6+i*2,ty+h+i*2-1,12-i*4,2)}
 X.fillStyle='#0f172a';X.textAlign='left';L.forEach((s,i)=>X.fillText(s,bx+9,ty+19+i*16));
}

