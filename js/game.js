'use strict';
/* js/game.js : Logica del juego: cocina, gimnasio, batalla final y resumen */

/* =====================================================================
   11. LA COCINA
   ===================================================================== */
function evalDiet(list,g=goal){
 let k=0,p=0,c=0,f=0,j=0;
 for(const i of list){const a=FOODS[i];k+=a[2];p+=a[3];c+=a[4];f+=a[5];j+=a[6]}
 const fl={ok:Math.abs(k/g.k-1)<=.15,low:c<g.c*.35,cata:p<g.p*.7,pes:k>g.k*1.3||j>=2};
 const cl=(a,b)=>Math.max(0,1-Math.abs(a/b-1));
 let q=.4*cl(k,g.k)+.25*cl(p,g.p)+.25*cl(c,g.c)+.1*cl(f,g.f);
 if(fl.ok)q+=.1;if(fl.low)q-=.15;if(fl.cata)q-=.1;if(fl.pes)q-=.15;
 return{k,p,c,f,j,fl,q:clamp(q,.05,1)};
}
/* 12 alimentos del día con al menos 2 combinaciones válidas */
const comboCache=new Map();
function validCombos(){
 if(comboCache.has(goal))return comboCache.get(goal);
 const g=goal,out=[],cur=[];
 const rec=(s,k,p,c)=>{
  if(cur.length&&Math.abs(k/g.k-1)<=.15&&p>=g.p*.85&&c>=g.c*.6)out.push(cur.slice());
  if(cur.length===4)return;
  for(let i=s;i<FOODS.length;i++){const a=FOODS[i];if(a[6]||k+a[2]>g.k*1.15)continue;cur.push(i);rec(i+1,k+a[2],p+a[3],c+a[4]);cur.pop()}
 };
 rec(0,0,0,0);comboCache.set(g,out);return out;
}
function pickFoods(){
 const V=validCombos(),s=new Set();
 if(V.length){const a=pick(V);a.forEach(i=>s.add(i));let b=null;for(let n=0;n<80;n++){b=pick(V);if(b.filter(i=>!a.includes(i)).length>=2)break}b.forEach(i=>s.add(i))}
 /* siempre algunas tentaciones ultraprocesadas */
 const junk=shuffle(FOODS.map((_,i)=>i).filter(i=>FOODS[i][6]));
 for(const i of junk.slice(0,2))if(s.size<12)s.add(i);
 for(const i of shuffle(FOODS.map((_,i)=>i))){if(s.size>=12)break;s.add(i)}
 return shuffle([...s]);
}
const zoneWidth=q=>q>.75?'amplia':q>.5?'media':'angosta';
function dietLabels(d){
 const g=goal,L=[],add=(c,t)=>L.push([c,t]);
 if(d.k>g.k*1.3)add('bad','🔥 Exceso calórico');else if(d.k>g.k*1.15)add('warn','Por encima de tus kcal');
 else if(d.fl.ok)add('ok','✅ Energía en rango');else if(d.k<g.k*.6)add('bad','Muy pocas calorías');else add('warn','Faltan calorías');
 if(d.fl.low)add('bad','🔋 Glucógeno bajo: sin energía');else if(d.c>g.c*1.2)add('warn','Carbos de sobra');else if(d.c>=g.c*.8)add('ok','⚡ Buen aporte de glucógeno');else add('warn','Glucógeno justo');
 if(d.fl.cata)add('bad','⚠️ Riesgo de catabolismo');else if(d.p>=g.p*.85)add('ok','💪 Proteína para reparar');else add('warn','Proteína algo corta');
 if(d.f>g.f*1.4)add('warn','🥑 Grasas en exceso');else if(d.f<g.f*.4)add('warn','Grasas muy bajas');
 if(d.j>=2)add('bad',`🍟 ${d.j} ultraprocesados: pesadez`);else if(d.j)add('warn','🍟 1 ultraprocesado: −salud');
 return L;
}
function kitchen(){
 clearTimers();act=null;tm=null;sel=[];setMode('kitchen');Audio2.play('gym');save();spawnCast();
 const g=goal,tab=pickFoods();
 const M=[['Kcal','k',g.k,'',.85,1.15],['Proteína','p',g.p,' g',.85,1.2],['Carbos','c',g.c,' g',.8,1.2],['Grasas','f',g.f,' g',.7,1.3]];
 panel(`<h2>🍳 La Cocina · Día ${day}</h2><p class="mu">Elige hasta 4 platos. La franja verde de cada barra es tu zona objetivo.</p>
 <div id="meters">${M.map(([n,k,goalv,u,lo,hi])=>`<div class="meter"><b>${n}</b><div class="track"><div class="zone" style="left:${lo/1.6*100}%;width:${(hi-lo)/1.6*100}%"></div><div class="fill" id="m-${k}"></div></div><output id="o-${k}"></output></div>`).join('')}
  <div id="plate"></div><div id="labels"></div></div>
 <div id="fg">${tab.map(i=>{const f=FOODS[i];return`<button class="fd" data-i="${i}" aria-pressed="false">${f[6]?'<span class="up">ULTRA</span>':''}<span class="em">${f[0]}</span><b>${f[1]}</b><span class="mac"><b>${f[2]}</b> kcal · P${f[3]} C${f[4]} G${f[5]}</span><span class="ds">${f[7]}</span></button>`}).join('')}</div>
 <div class="row"><button class="btn-main" id="go" disabled>🍽️ Cocinar y confirmar dieta</button><button id="clr">Vaciar plato</button></div>`);
 const upd=()=>{
  const d=evalDiet(sel);
  for(const[,k,gv,u,lo,hi]of M){
   const r=d[k]/gv,el=$('m-'+k);el.style.width=Math.min(100,r/1.6*100)+'%';
   el.style.background=r>hi+.15?'var(--bad)':r>hi?'var(--act)':r>=lo?'var(--ok2)':'var(--info)';
   $('o-'+k).textContent=`${d[k]}/${gv}${u}`;
  }
  $('plate').innerHTML=[0,1,2,3].map(n=>sel[n]===undefined?'<span class="slot">+</span>':`<button class="slot" data-rm="${sel[n]}" title="Quitar ${FOODS[sel[n]][1]}" aria-label="Quitar ${FOODS[sel[n]][1]}">${FOODS[sel[n]][0]}</button>`).join('');
  $('labels').innerHTML=sel.length?dietLabels(d).map(([c,t])=>`<span class="tag t-${c}">${t}</span>`).join('')+`<span class="tag t-info">Calidad ${Math.round(d.q*100)}% → zona verde ${zoneWidth(d.q)}</span>`:'<span class="mu">Toca los alimentos para armar tu plato…</span>';
  on('[data-rm]',b=>toggle(+b.dataset.rm));
  document.querySelectorAll('.fd').forEach(b=>b.setAttribute('aria-pressed',sel.includes(+b.dataset.i)));
  $('go').disabled=!sel.length;
 };
 const toggle=i=>{
  const p=sel.indexOf(i);
  if(p>=0){sel.splice(p,1);sfx('click')}
  else if(sel.length<4){sel.push(i);sfx('select')}
  else{sfx('miss');floatText('MÁXIMO 4 PLATOS','#A855F7',320,170,13)}
  upd();
 };
 on('.fd',b=>toggle(+b.dataset.i));
 on('#clr',()=>{sel=[];sfx('click');upd()});
 on('#go',()=>cook());
 upd();scrollToEl($('stage'));
}
function clearTimers(){cancelTimers()}
function cook(){
 if(mode!=='kitchen'||!sel.length)return;
 const g=goal,d=D=evalDiet(sel),f=d.fl;sfx('good');
 if(d.c>=g.c*.6)T.c++;if(d.p>=g.p*.85)T.p++;if(d.j)T.j++;if(f.ok)T.ok++;
 hist[day-1]={k:d.k/g.k,p:d.p/g.p,c:d.c/g.c,f:d.f/g.f,q:d.q,j:d.j,act:null,perf:0};
 setMode('gym');
 S.ENG=clamp(Math.round(S.ENG*.4+(25+75*Math.min(1,d.c/g.c))*.6),0,100);if(f.low)S.ENG=Math.max(5,S.ENG-12);
 if(d.q>.7&&!d.j)gain('HP',3);else if(d.j||f.pes)gain('HP',-4);
 if(f.low)gain('HP',-2);if(!f.cata&&d.p>=g.p*.85)gain('REC',2);if(f.pes)gain('STA',-2);
 sel.forEach((i,n)=>later(()=>{floatText(FOODS[i][0],'#fff',270+n*34,230,22)},n*90));
 gym();
}

/* =====================================================================
   12. GIMNASIO Y MINIJUEGOS
   ===================================================================== */
const EXD={bench:{n:'Press de Banca',i:'🏋️',e:'bar',s:'STR',m:1,en:12},
 curl:{n:'Curl con mancuernas',i:'💪',e:'bar',s:'STR',m:.85,en:10,fast:1.2,narrow:.85},
 mob:{n:'Movilidad y core',i:'🧘',e:'bar',s:'REC',m:.9,en:6,fast:.75},
 rope:{n:'Cuerda al ritmo',i:'🪢',e:'beat',s:'STA',m:1,en:12},
 sprint:{n:'Sprint en banda',i:'🏃',e:'beat',s:'STA',m:1.15,en:16,fast:1.25}};
function gym(){
 setMode('gym');const f=D.fl,t=(c,s)=>`<span class="tag t-${c}">${s}</span>`;
 panel(`<h2>🏋️ El Gimnasio</h2>
 <div>${f.ok?t('ok','✅ Kcal en rango: +25 % de ganancias'):t('warn','Kcal fuera de ±15 %: sin bono')}${f.low?t('bad','🔋 Glucógeno bajo: ganancias a la mitad'):''}${f.cata?t('bad','⚠️ Catabolismo: hoy no sube la Fuerza'):''}${f.pes?t('bad','🥴 Pesadez: el cardio rinde la mitad'):''}${S.ENG<35?t('warn','😓 Poca energía: −30 % de ganancias'):''}</div>
 <p>Calidad de tu dieta: <b>${Math.round(D.q*100)} %</b> → zona de acierto ${zoneWidth(D.q)}.</p>
 <button class="blk btn-act" data-t="bench">🏋️ Fuerza: Press de Banca <kbd>1</kbd><small>Detén el marcador en la zona verde. Sube Fuerza.</small></button>
 <button class="blk btn-act" data-t="rope">🪢 Cardio: Cuerda al ritmo <kbd>2</kbd><small>Salta justo cuando la nota llegue al aro. Sube Resistencia.</small></button>
 <button class="blk" data-t="rest">😴 Descanso activo <kbd>3</kbd><small>Estiramientos y sueño: +Recuperación, +Salud, +Energía.</small></button>
 <button class="blk btn-act" data-t="curl">💪 Fuerza: Curl con mancuernas <kbd>4</kbd><small>Zona más angosta y ritmo mayor. Sube Fuerza con menos gasto de energía.</small></button>
 <button class="blk btn-act" data-t="sprint">🏃 Cardio: Sprint en banda <kbd>5</kbd><small>Notas más veloces: más Resistencia, pero cuesta más energía.</small></button>
 <button class="blk" data-t="mob">🧘 Movilidad y core <kbd>6</kbd><small>Barra lenta y amplia. Sube Recuperación con poca energía.</small></button>`);
 on('[data-t]',b=>{sfx('click');train(b.dataset.t)});
 scrollToEl($('stage'));
}
function train(k){
 if(mode!=='gym')return;
 act=k;
 if(k==='rest'){
  T.rest++;setMode('rest');hist[day-1]&&(hist[day-1].act='rest');
  panel('<h2>😴 Descansando…</h2><p>Estiramientos, hidratación y buen sueño. El músculo se adapta mientras te recuperas.</p>');
  later(()=>{gain('REC',6);gain('HP',3);gain('ENG',10);sfx('heal');later(endDay,1200)},1500);return;
 }
 setMode('train');
 const q=D.q,X0=EXD[k],bench=X0.e==='bar';
 tm={k,r:0,hits:0,perf:0,combo:0,maxCombo:0,pts:0,bad:0,lock:0,wait:1.2,fb:'',fbT:0,fbC:'#fff',results:[],anim:0,
  /* banca */ pos:0,dir:1,w:.12+q*.2,z:.4,speed:1.35-q*.65,
  /* cuerda */ note:null,win:22+q*24,vel:300-q*70};
 tm.ex=X0;tm.base=tm.speed=tm.speed*(X0.fast||1);tm.w*=X0.narrow||1;tm.vel*=X0.fast||1;
 moveZone();
 panel(`<h2>${X0.i} ${X0.n}</h2>
 <p>${bench?'Pulsa cuando el marcador blanco esté en la <b style="color:var(--ok2)">zona verde</b>. El centro dorado es <b style="color:var(--act)">PERFECTO</b>.':'Salta cuando la nota entre en el <b style="color:var(--ok2)">aro</b>. Entre más centrada, mejor: <b style="color:var(--act)">PERFECTO</b>.'}</p>
 <p class="mu">${NR} repeticiones. Encadena aciertos: 3 seguidos ×1.2, 5 seguidos ×1.4. Cada fallo cuesta 2 de energía extra.</p>
 <button class="btn-act blk big" id="now" style="text-align:center;min-height:84px">¡AHORA! <kbd>Espacio</kbd></button>`);
 $('now').addEventListener('pointerdown',e=>{e.preventDefault();press()});
 /* activación con lectores de pantalla (clic sin puntero) */
 $('now').addEventListener('click',e=>{if(e.detail===0)press()});
 scrollToEl($('stage'));
}
function moveZone(){tm.z=.06+Math.random()*(.88-tm.w)}
function spawnNote(){tm.note={x:640+rnd(120)}}
function press(){
 if(paused||!tm||tm.lock||tm.wait>0)return;
 let dist,half;
 if(tm.ex.e==='bar'){dist=Math.abs(tm.pos-(tm.z+tm.w/2));half=tm.w/2+.008}
 else{if(!tm.note||tm.note.x-170>150)return;dist=Math.abs(tm.note.x-170);half=tm.win}
 judge(dist<=half*.36?2:dist<=half?1:0);
}
function judge(res){
 const bench=tm.ex.e==='bar';
 if(res){
  tm.combo++;tm.hits++;tm.maxCombo=Math.max(tm.maxCombo,tm.combo);
  const mult=tm.combo>=5?1.4:tm.combo>=3?1.2:1;
  tm.pts+=(res===2?1:.7)*mult;tm.anim=.5;
  res===2?(tm.perf++,T.perf++):T.good++;
  tm.fb=(res===2?'¡PERFECTO!':'BIEN')+(mult>1?` ×${mult}`:'');tm.fbC=res===2?'#A855F7':'#4ADE80';
  sfx(res===2?'perfect':'good');sfx('lift');
  const x=bench?80+tm.pos*480:170;
  burst(x,332,res===2?['#A855F7','#E9D5FF','#fff']:['#4ADE80','#22C55E','#fff'],res===2?34:16,res===2?280:190);
  stars.push({x,y:332,life:.22,r:res===2?34:20});
  if(res===2){if(!CALM)shake=7;doFlash('168,85,247',.18)}else if(!CALM)shake=3;
 }else{
  tm.combo=0;tm.bad++;T.fail++;tm.fb='FALLO';tm.fbC='#EF4444';sfx('miss');if(!CALM)shake=6;doFlash('239,68,68',.22);
 }
 tm.results.push(res);tm.fbT=.9;tm.r++;
 if(bench){tm.speed=tm.base*(1+.1*Math.min(tm.hits,5)+.05*Math.max(0,tm.hits-5));moveZone();tm.wait=.22}
 else{tm.note=null;tm.wait=Math.max(.12,.5-tm.hits*.045)+Math.random()*.25}
 if(tm.r>=NR){tm.lock=1;later(finishTraining,1100)}
}
function updateTraining(dt){
 if(!tm)return;
 tm.fbT=Math.max(0,tm.fbT-dt);tm.anim=Math.max(0,tm.anim-dt);
 if(tm.lock)return;
 if(tm.ex.e==='bar'){
  if(tm.r===0&&tm.wait>0){tm.wait-=dt;return}
  tm.wait=Math.max(0,tm.wait-dt);
  tm.pos+=tm.speed*tm.dir*dt;
  if(tm.pos<=0){tm.pos=-tm.pos;tm.dir=1}if(tm.pos>=1){tm.pos=2-tm.pos;tm.dir=-1}
 }else{
  if(tm.wait>0){tm.wait-=dt;if(tm.wait<=0)spawnNote();return}
  if(!tm.note)spawnNote();
  tm.note.x-=tm.vel*(1+.06*Math.min(tm.hits,6))*dt;
  if(tm.note.x<170-tm.win)judge(0);
 }
}
function finishTraining(){
 if(!tm)return;
 const f=D.fl,k=tm.k,bad=tm.bad,e=(f.low?.5:1)*(S.ENG<35?.7:1)*(f.ok?1.25:1);
 const amount=Math.round(e*(tm.pts/NR)*9.6*10)/10;
 const sum={perf:tm.perf,good:tm.hits-tm.perf,bad,combo:tm.maxCombo};
 tm=null;act=null;setMode('gym');
 if(hist[day-1]){hist[day-1].act=k;hist[day-1].perf=sum.perf}
 let result;
 const XD=EXD[k],A2=amount*XD.m;if(XD.s==='STR'){
  if(f.cata){floatText('CATABOLISMO: +0 FUERZA','#EF4444',320,130,12);result='Sin proteína suficiente no hubo ganancia de Fuerza.'}
  else{gain('STR',A2);result=`Fuerza +${Math.round(A2)}`}
 }else if(XD.s==='REC'){gain('REC',A2);result=`Recuperación +${Math.round(A2)}`}else{const v=A2*(f.pes?.5:1);gain('STA',v);result=`Resistencia +${Math.round(v)}`}
 gain('ENG',-XD.en-2*bad);sfx('up');
 panel(`<h2>Serie terminada</h2>
 <div class="kpis"><div class="kpi"><b style="color:var(--act)">${sum.perf}</b><span>Perfectos</span></div><div class="kpi"><b style="color:var(--ok2)">${sum.good}</b><span>Bien</span></div><div class="kpi"><b style="color:var(--bad)">${sum.bad}</b><span>Fallos</span></div><div class="kpi"><b style="color:var(--info)">${sum.combo}</b><span>Mejor racha</span></div></div>
 <p style="margin-top:10px"><b>${result}</b> · Energía −${XD.en+2*bad}</p>
 <button class="btn-main" id="nx">Continuar</button>`);
 on('#nx',()=>{sfx('click');endDay()});
}
function endDay(){
 act=null;const i=EVENT_DAYS.indexOf(day);
 if(i>=0)showEvent(EVENTS[evq[i]]);else nextDay();
}
function nextDay(){day++;if(day>14)intro();else kitchen()}
function showEvent(ev){
 setMode('event');sfx('alert');
 const opts=shuffle(ev.o.slice());
 panel(`<h2>${ev.t}</h2><p>${ev.q}</p>${opts.map((o,j)=>`<button class="blk" data-o="${j}">${o[0]} <kbd>${j+1}</kbd></button>`).join('')}`);
 let done=false;
 on('[data-o]',b=>{
  if(done)return;done=true;
  const o=opts[+b.dataset.o];T.evn++;if(o[2])T.ev++;sfx(o[2]?'up':'miss');
  const fx=Object.entries(o[1]).map(([k,v])=>`<span class="tag t-${v>0?'ok':'bad'}">${v>0?'+':''}${v} ${STATS.find(a=>a[0]===k)[1]}</span>`).join('');
  for(const k in o[1])gain(k,o[1][k]);
  panel(`<h2 style="color:${o[2]?'var(--ok2)':'var(--bad)'}">${o[2]?'✅ Buena decisión':'❌ Mala decisión'}</h2><p><b>${o[0]}</b></p><p>${o[3]}</p><div>${fx}</div><button class="btn-main" id="c">Continuar</button>`);
  on('#c',()=>{sfx('click');nextDay()});
 });
 scrollToEl($('panel'));
}

/* =====================================================================
   13. BATALLA FINAL
   ===================================================================== */
function intro(){
 clearTimers();act=null;tm=null;B=null;day=15;setMode('intro');Audio2.play('battle');save();
 panel(`<h2>🥊 Día 15: ¡Batalla final!</h2>
 <p>Braulio "El Ciclado" pega durísimo, pero tiene <b>poca resistencia</b>: odia los carbohidratos y el cardio. Quítale el aire y golpea con inteligencia.</p>
 <p>Golpe de Glucógeno: ${T.c>=8?'<span class="tag t-ok">⚡ Desbloqueado</span>':`<span class="tag t-bad">🔒 Necesitabas 8 días con buenos carbos (tienes ${T.c})</span>`}</p>
 <button class="btn-act big" id="fi">¡PELEAR!</button>`);
 on('#fi',()=>startBattle());
 scrollToEl($('stage'));
}
function startBattle(){
 clearTimers();parts=[];floats=[];
 const pe=Math.round(40+S.ENG*.6),ph=Math.round(90+S.HP*1.1);
 B={ph,hp:ph,pem:pe,pe,bh:400,bhm:400,be:250,bem:250,busy:false,over:false,turn:1,pa:0,ba:0,pp:'guard',bp:'guard',pk:0,bk:0,cheer:1,say:'¡Ven, perdedor!',sayT:2,show:{hp:ph,bh:325},log:['🔔 ¡Suena la campana!']};
 setMode('battle');Audio2.play('battle');sfx('bell');battlePanel();scrollToEl($('stage'));
}
function battlePanel(){
 panel(`<h2>${B.over?'Fin del combate':B.busy?'Turno de Braulio…':'Tu turno'}</h2><div id="skills">${SKILLS.map((s,i)=>{
  const locked=i===3&&T.c<8,noE=B.pe<s[2];
  return`<button class="blk${i===3&&!locked?' btn-act':''}" data-s="${i}" ${B.busy||B.over||locked||noE?'disabled':''}><b>${locked?'🔒 ':''}${s[0]}</b> <kbd>${i+1}</kbd><small>${s[1]}</small><small><b>${s[2]} EN</b>${noE&&!locked?' · sin energía suficiente':''}</small></button>`}).join('')}</div>
 <div id="log">${B.log.slice(-4).map(l=>`<div>${l}</div>`).join('')}</div>`);
 on('[data-s]',b=>useSkill(+b.dataset.s));
}
function useSkill(i){
 if(!B||B.busy||B.over)return;
 const s=SKILLS[i];if(B.pe<s[2]||(i===3&&T.c<8))return;
 B.busy=true;B.pe-=s[2];let m,d=0;
 if(i===0){d=Math.round(10+S.STR*.6+Math.random()*4);m=`Repetición Pesada: ${d} de daño`}
 if(i===1){d=Math.round(6+(S.STA+S.ENG)*.28+Math.random()*3);B.be=Math.max(0,B.be-25);m=`Sprint Metabólico: ${d} de daño y Braulio pierde aire`}
 if(i===3){d=Math.round(40+S.ENG*.5);m=`¡GOLPE DE GLUCÓGENO! ${d} de daño`}
 if(i===2){
  const heal=Math.min(B.ph-B.hp,Math.round(10+S.HP*.3));B.hp+=heal;m=`Respiración y Técnica: recuperas ${heal} HP`;
  B.pp='stretch';B.pa=.8;sfx('heal');floatText('+'+heal+' HP','#38BDF8',190,150,15);burst(190,240,['#38BDF8','#7dd3fc','#fff'],26,130);
 }else{
  B.pp='punch';B.pa=.55;
  later(()=>{
   B.bh=Math.max(0,B.bh-d);B.bp='hit';B.ba=.55;B.cheer=1;B.bk=i===3?50:22;
   impact(430,220,d,i===3?'#38BDF8':'#A855F7');sfx(i===3?'heavy':'hit');
   if(i===3){doFlash('56,189,248',.45);floatText('¡GLUCÓGENO!','#38BDF8',320,110,22)}
   floatText('-'+d,'#A855F7',450,150,i===3?28:20);
  },180);
 }
 B.log.push(m);battlePanel();
 later(()=>{if(B.bh<=0)return finishBattle(true);bossTurn()},1150);
}
function bossTurn(){
 const ex=B.be<=0,d=Math.round((13+Math.random()*7)*(ex?.45:1)*(1-S.REC/220)*2);
 B.be=Math.max(0,B.be-18);
 if(ex&&Math.random()<.35){
  B.log.push('Braulio está sin aire y pierde el turno 😮‍💨');B.say='*jadeo* …un segundo…';B.sayT=1.6;floatText('¡SIN AIRE!','#38BDF8',450,150,14);endTurn(500);
 }else{
  if(!ex&&Math.random()<.4){B.say=pick(BRO_QUIPS);B.sayT=1.7}
  B.bp='punch';B.ba=.55;
  later(()=>{
   B.hp=Math.max(0,B.hp-d);B.pp='hit';B.pa=.5;B.pk=18;impact(200,225,d,'#EF4444');sfx('hurt');doFlash('239,68,68',.3);
   floatText('-'+d,'#EF4444',190,150,20);B.log.push(`Braulio te golpea: −${d} HP${ex?' (débil, sin energía)':''}`);endTurn(450);
  },200);
 }
}
function endTurn(ms){
 B.pe=Math.min(B.pem,B.pe+8);battlePanel();
 later(()=>{if(B.hp<=0)return finishBattle(false);B.busy=false;B.turn++;battlePanel()},ms);
}
function finishBattle(win){
 B.over=true;B.busy=true;Audio2.stop();store.del(KEY);
 B.say=win?'No… ¡la ciencia!':'¡JA! ¡Broscience gana!';B.sayT=9;
 sfx('bell');battlePanel();
 later(()=>{sfx(win?'win':'lose');if(win)confettiBurst()},500);
 later(()=>summary(win),2800);
}

/* =====================================================================
   14. RESUMEN FINAL
   ===================================================================== */
function summary(win){
 setMode('summary');const g=goal,H=hist.filter(Boolean),n=H.length||1;
 const avg=k=>Math.round(H.reduce((a,h)=>a+h[k],0)/n*100);
 const evR=T.evn?T.ev/T.evn:0;
 const score=Math.round((T.c/14*.2+T.p/14*.2+T.ok/14*.2+(1-T.j/14)*.15+evR*.15+Math.min(1,T.rest/3)*.1)*100);
 const grade=score>=85?['🥇','Hábitos de campeón']:score>=65?['🥈','Buen camino']:score>=45?['🥉','En construcción']:['🧩','Toca replantear el plan'];
 const tips=[],tip=(good,t)=>tips.push([good,t]);
 LAST={win,score,grade:grade[1]};const rep=buildReport(),repTxt=reportText(rep),repJson=JSON.stringify(rep,null,2);
 tip(T.ok>=9,T.ok>=9?`<b>Balance calórico:</b> en rango ${T.ok}/14 días. Buen control de porciones.`:`<b>Balance calórico:</b> solo ${T.ok}/14 días dentro de ±15 % de ${g.k} kcal. Planea el plato antes: una fuente de proteína, una de carbohidrato y verduras o fruta.`);
 tip(T.p>=10,T.p>=10?`<b>Proteína:</b> meta alcanzada ${T.p}/14 días.`:`<b>Proteína:</b> suficiente solo ${T.p}/14 días. Para quien entrena suele sugerirse 1.4–2.0 g por kg de peso al día, repartidos en 3–5 comidas.`);
 tip(T.c>=10,T.c>=10?`<b>Carbohidratos:</b> buen nivel ${T.c}/14 días, con glucógeno para rendir.`:`<b>Carbohidratos:</b> suficientes solo ${T.c}/14 días. Con actividad moderada se usan como referencia 5–7 g/kg/día; ajusta según cuánto entrenes (arroz, avena, tortillas, frijol, fruta).`);
 tip(T.j<=2,T.j<=2?`<b>Ultraprocesados:</b> solo ${T.j} día(s). Tu salud lo agradece.`:`<b>Ultraprocesados:</b> aparecieron en ${T.j} días. No hace falta prohibirlos: cambia el refresco por agua y deja la comida rápida para ocasiones.`);
 tip(T.rest>=3,T.rest>=3?`<b>Recuperación:</b> descansaste ${T.rest} días.`:`<b>Recuperación:</b> solo ${T.rest} día(s) de descanso. Programa 1–2 por semana y duerme 7–9 h (8–10 h si eres adolescente).`);
 tip(evR>=.7,evR>=.7?`<b>Decisiones:</b> ${T.ev}/${T.evn} dilemas bien resueltos. Buen filtro contra mitos.`:`<b>Decisiones:</b> ${T.ev}/${T.evn} dilemas bien resueltos. Antes de creer una promesa, pregunta: ¿qué evidencia hay?, ¿quién gana si la compro?`);
 if(T.c<8)tip(false,'<b>Para la revancha:</b> consigue al menos 8 días con carbohidratos suficientes y desbloquearás el Golpe de Glucógeno.');
 tips.sort((a,b)=>a[0]-b[0]);
 const days=[...Array(14).keys()];
 const row=(label,fn)=>`<span>${label}</span>`+days.map(i=>{const h=hist[i];if(!h)return`<i title="Día ${i+1}: sin registro"></i>`;const[c,s,t]=fn(h);return`<i class="${c}" title="Día ${i+1}: ${t}">${s}</i>`}).join('');
 const pct=v=>Math.round(v*100)+' %';
 const lvl=(v,lo,hi)=>v>=lo&&v<=hi?['g','✓']:v<lo*.8||v>hi*1.2?['r',v<lo?'↓':'↑']:['w',v<lo?'↓':'↑'];
 const actNames={bench:['w','F','Fuerza'],rope:['g','C','Cardio'],rest:['b','D','Descanso'],curl:['w','F','Fuerza'],sprint:['g','C','Cardio'],mob:['b','M','Movilidad']};
 panel(`<h2 style="color:${win?'var(--ok2)':'var(--bad)'}">${win?'🏆 ¡VICTORIA!':'💀 Derrota'}</h2>
 <p>${win?'Derrotaste a Braulio: la ciencia le ganó al broscience.':'Braulio resistió esta vez. Tus hábitos tienen la respuesta para la revancha.'}</p>
 <div class="kpis">
  <div class="kpi"><b>${grade[0]} ${score}</b><span>${grade[1]} (de 100)</span></div>
  <div class="kpi"><b style="color:var(--act)">${Math.round(S.STR)}</b><span>Fuerza (inicio 10)</span></div>
  <div class="kpi"><b style="color:var(--ok2)">${Math.round(S.STA)}</b><span>Resistencia (inicio 10)</span></div>
  <div class="kpi"><b style="color:var(--info)">${Math.round(S.REC)}</b><span>Recuperación (inicio 10)</span></div>
  <div class="kpi"><b>${Math.round(S.HP)}</b><span>Salud metabólica</span></div>
  <div class="kpi"><b>${T.perf}</b><span>Repeticiones perfectas</span></div>
 </div>
 ${H.length?`<h3>Tus 14 días</h3>
 <div class="heat"><span></span>${days.map(i=>`<span style="text-align:center">${i+1}</span>`).join('')}
 ${row('Calorías',h=>[...lvl(h.k,.85,1.15),pct(h.k)+' de la meta'])}
 ${row('Proteína',h=>[...lvl(h.p,.85,1.5),pct(h.p)+' de la meta'])}
 ${row('Carbos',h=>[...lvl(h.c,.6,1.3),pct(h.c)+' de la meta'])}
 ${row('Ultraproc.',h=>[h.j?(h.j>1?'r':'w'):'g',h.j||'✓',h.j+' alimento(s)'])}
 ${row('Actividad',h=>actNames[h.act]||['','','sin registro'])}</div>
 <p class="mu">✓ en rango · ↓ por debajo · ↑ por encima · F fuerza · C cardio · D descanso</p>
 <h3>Calorías diarias vs. meta</h3>
 <div class="chart" role="img" aria-label="Calorías de cada día como porcentaje de la meta">${days.map(i=>{const h=hist[i],v=h?h.k:0;return`<div title="Día ${i+1}: ${h?pct(v):'sin registro'}" style="height:${Math.min(100,v/1.6*100)}%;background:${v>=.85&&v<=1.15?'var(--ok2)':v>1.3?'var(--bad)':v>1.15?'var(--act)':'var(--info)'}"></div>`}).join('')}<span class="goal" style="bottom:calc(6px + ${(1/1.6)*98}px)"></span></div>
 <p class="mu">Promedio: calorías ${avg('k')} % · proteína ${avg('p')} % · carbos ${avg('c')} % · grasas ${avg('f')} % de la meta.</p>`:'<p class="mu">Esta partida se guardó con una versión anterior: no hay detalle diario.</p>'}
 <h3>Consejos para tu vida real</h3>
 ${tips.map(([good,t])=>`<div class="tip${good?' g':''}">${good?'✅':'🎯'} ${t}</div>`).join('')}
 <p class="mu">Referencias generales para personas adultas sanas y activas: ${SOURCES.map(([n,u])=>`<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join(' · ')}. Este juego es educativo y no sustituye a un nutriólogo o médico.</p>
 <h3>Exportar resumen</h3><div class="row" style="margin-top:0"><button class="btn-main" id="xcp">📋 Copiar texto</button><button id="xcj">{ } Copiar JSON</button><button id="xdl">⬇ Descargar .json</button></div><p class="mu" id="xst" role="status" style="min-height:20px"></p><details><summary class="mu">Vista previa del resumen</summary><pre class="rep">${esc(repTxt)}</pre></details>
 <div class="row"><button class="btn-main" id="ag">🔁 Jugar de nuevo</button>${win?'':'<button class="btn-act" id="rv">🥊 Revancha</button>'}</div>`);
 on('#ag',()=>{sfx('click');menu()});
 on('#xcp',()=>{sfx('click');copyText(repTxt,'Resumen copiado ✔')});
 on('#xcj',()=>{sfx('click');copyText(repJson,'JSON copiado ✔')});
 on('#xdl',()=>{sfx('click');const d=new Date(),p=n=>String(n).padStart(2,'0');download('macroclash-resumen-'+d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes())+'.json','application/json',repJson);xsay('Archivo descargado ✔')});
 on('#rv',()=>{sfx('click');startBattle()});
 scrollToEl($('panel'));
}

