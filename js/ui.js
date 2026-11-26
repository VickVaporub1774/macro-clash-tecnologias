'use strict';
/* js/ui.js : Interfaz general, menu, personalizacion, historia y objetivos */

/* =====================================================================
   9. INTERFAZ GENERAL
   ===================================================================== */
const IC=[["😮‍💨", "wind"], ["📖", "book-fill"], ["🔊", "volume-up-fill"], ["🔇", "volume-mute-fill"], ["🏠", "house-fill"], ["🎯", "bullseye"], ["🏁", "flag-fill"], ["🍞", "basket2-fill"], ["🥩", "shield-plus"], ["🥑", "droplet-half"], ["🔥", "fire"], ["😓", "emoji-frown"], ["😴", "moon-stars-fill"], ["⚡", "lightning-charge-fill"], ["▶", "play-fill"], ["⏩", "fast-forward-fill"], ["⏭", "skip-forward-fill"], ["❓", "question-circle-fill"], ["🍳", "egg-fried"], ["🍽", "cup-hot-fill"], ["🏋", "person-arms-up"], ["🪢", "arrow-repeat"], ["🏃", "speedometer2"], ["🧘", "flower1"], ["💪", "person-arms-up"], ["⚖", "sliders"], ["🥊", "lightning-fill"], ["🏆", "trophy-fill"], ["💀", "emoji-dizzy-fill"], ["🥴", "emoji-dizzy-fill"], ["🥇", "award-fill"], ["🥈", "award-fill"], ["🥉", "award-fill"], ["🧩", "puzzle-fill"], ["🔁", "arrow-repeat"], ["📋", "clipboard-check-fill"], ["⬇", "download"], ["✅", "check-circle-fill"], ["❌", "x-circle-fill"], ["⚠", "exclamation-triangle-fill"], ["🔋", "battery-half"], ["🔒", "lock-fill"], ["🍟", "exclamation-diamond-fill"], ["📱", "phone-fill"], ["📚", "book-half"], ["🎂", "cake2-fill"], ["🦵", "activity"], ["🧪", "eyedropper"], ["🥵", "thermometer-sun"], ["📵", "phone-vibrate-fill"], ["💉", "capsule"], ["⏱", "stopwatch-fill"], ["🧃", "cup-straw"], ["🤒", "thermometer-half"], ["🍻", "cup-fill"], ["🌅", "sunrise-fill"]],ICM=Object.fromEntries(IC),ICRE=new RegExp('('+IC.map(a=>a[0]).join('|')+')\uFE0F?','g');
function icons(h){
 const keep=[];
 h=h.replace(/<span class="em">.*?<\/span>|<button class="slot"[^>]*>.*?<\/button>/g,m=>'\uE000'+(keep.push(m)-1)+'\uE001');
 h=h.split(/(<[^>]*>)/).map(x=>x[0]==='<'?x:x.replace(ICRE,(m,e)=>`<i class="bi bi-${ICM[e]}" data-e="${e}" aria-hidden="true"></i>`)).join('');
 return h.replace(/\uE000(\d+)\uE001/g,(m,i)=>keep[i]);
}
const inMeta=()=>mode==='menu'||mode==='custom'||mode==='story';
function ui(){
 const show=['kitchen','gym','train','rest','event','intro'].includes(mode);
 $('stats').style.display=show?'':'none';
 if(show){
  if(!$('stats').children.length)$('stats').innerHTML=STATS.map(([k,n,c])=>`<div class="st"><span>${n}</span><b id="v-${k}"></b><div class="bar"><i id="b-${k}" style="background:${c}"></i></div></div>`).join('');
  for(const[k]of STATS){$('v-'+k).textContent=Math.round(S[k]);$('b-'+k).style.width=S[k]+'%'}
 }
 $('day').textContent=inMeta()||mode==='goals'?'':mode==='summary'?'RESULTADO':day>14?'DÍA 15':`DÍA ${day}/14`;
 $('home').hidden=mode==='menu';
 $('layout').classList.toggle('solo',['menu','goals','story','summary'].includes(mode));
}
function setMode(m){mode=m;ui()}
function panel(html){
 const p=$('panel');p.innerHTML=icons(html);p.style.animation='none';void p.offsetWidth;p.style.animation='';
}
/* Asocia clics a los elementos recién pintados */
function on(selector,fn){document.querySelectorAll('#panel '+selector).forEach(b=>b.addEventListener('click',()=>fn(b)))}
/* En pantallas angostas mantiene visible lo importante */
function scrollToEl(el){if(window.innerWidth<1060)el.scrollIntoView({behavior:CALM?'auto':'smooth',block:'start'})}
function gain(k,v){
 const o=S[k];S[k]=clamp(o+v,0,100);const d=Math.round(S[k]-o);
 if(d){const n=STATS.find(a=>a[0]===k)[1].toUpperCase();floatText((d>0?'+':'')+d+' '+n,d>0?'#4ADE80':'#EF4444',320,150,11)}
 if(k!=='ENG'&&Math.floor(S[k]/25)>Math.floor(o/25)){sfx('up');floatText('¡NUEVO NIVEL!','#A855F7',320,110,16);burst(320,200,['#A855F7','#4ADE80','#fff'],34,230)}
 ui();
}
function updateMuteBtn(){const m=Audio2.muted;$('mu').innerHTML=icons(m?'🔇':'🔊');$('mu').setAttribute('aria-pressed',m);$('mu').setAttribute('aria-label',m?'Activar sonido':'Silenciar')}
function toggleMute(){Audio2.setMute(!Audio2.muted);updateMuteBtn();if(!Audio2.muted)sfx('click')}
$('mu').addEventListener('click',toggleMute);
$('home').addEventListener('click',()=>{
 const playing=['kitchen','gym','train','rest','event','intro','battle'].includes(mode);
 if(playing&&!window.confirm('¿Volver al menú? Tu partida se guarda desde el inicio del día actual.'))return;
 sfx('click');menu();
});

/* =====================================================================
   10. MENÚ, PERSONALIZACIÓN, HISTORIA Y OBJETIVOS
   ===================================================================== */
function clearScene(){cancelTimers();act=null;tm=null;B=null;ST=null;cast=[];parts=[];floats=[];stars=[];shake=0;flash=0}
function menu(){
 clearScene();reset();setMode('menu');Audio2.play('menu');
 const sv=loadSave();
 panel(`<div class="col">
  <button class="btn-main big" id="ini">▶ INICIAR</button>
  <button class="btn-act big" id="con" ${sv?'':'disabled'}>⏩ CONTINUAR</button>
  <span class="mu">${sv?`Partida guardada: ${GOALS[sv.g].n} · ${sv.day>14?'Batalla final':'Día '+sv.day+' de 14'}`:'No hay partida guardada'}</span>
  <button id="how">❓ ¿Cómo jugar?</button></div>`);
 on('#ini',()=>{sfx('click');custom()});
 on('#how',()=>{sfx('click');how(menu)});
 on('#con',()=>{
  const s=loadSave();if(!s)return;sfx('click');clearScene();reset();
  gkey=s.g;goal=GOALS[s.g];day=s.day;S=s.S;Object.assign(T,s.T);
  if(Array.isArray(s.hist))hist=s.hist;
  if(Array.isArray(s.evq)&&s.evq.length===EVENT_DAYS.length&&s.evq.every(i=>EVENTS[i]))evq=s.evq;
  if(s.pl)Object.assign(PL,s.pl);normPL();
  if(day>14)intro();else kitchen();
 });
}
function how(back){
 panel(`<h2>¿Cómo jugar?</h2>
 <p>🍞 <b>Carbohidratos = energía.</b> Llenan tu glucógeno. Con menos del 35 % de la meta entrenarás a medias.</p>
 <p>🥩 <b>Proteína = reparación y fuerza.</b> Con menos del 70 % hay riesgo de catabolismo y no subes Fuerza.</p>
 <p>🥑 <b>Grasas = balance.</b> Participan en hormonas y salud, pero demasiada chatarra o más del 130 % de las kcal causa pesadez.</p>
 <p>Cada día: <b>1)</b> arma tu dieta (hasta 4 platos), <b>2)</b> entrena o descansa, <b>3)</b> resuelve los dilemas que aparezcan. El día 15 peleas por turnos contra Braulio.</p>
 <h3>Controles</h3>
 <p class="mu">Entrenar: <b>Espacio</b>, <b>Enter</b>, clic o toque. · Batalla y eventos: teclas <b>1-4</b>. · Silencio: <b>M</b>. · Saltar historia: <b>Esc</b>.</p>
 <button class="btn-main" id="bk">Entendido</button>`);
 on('#bk',()=>{sfx('click');back()});
}
const SKT=['#fde3c8','#f6d2b0','#e0a67a','#c68a5c','#a86f48','#8d5a3a','#6b4430','#5b3a29','#3e2a1f','#d9c3f0'],
 SHT=['#e84a5f','#f97316','#facc15','#4ADE80','#22D3EE','#38BDF8','#6366f1','#A855F7','#C084FC','#ec4899','#e2e8f0','#94A3B8','#334155','#111827','#14b8a6','#a3e635'],
 PAT=['#2a4d8f','#222222','#444b57','#6b2a2a','#1f5a3a','#e2e8f0','#C084FC','#6d28d9','#0e7490','#b45309','#be123c','#0f172a'],
 HAT=['#2b1b10','#111111','#4a2f1b','#8a5a2b','#d9b24c','#c0392b','#cfd5dc','#6d28d9','#22D3EE','#ec4899'],
 ACC=['#A855F7','#22D3EE','#EF4444','#FACC15','#4ADE80','#f8fafc','#111827','#f97316'],
 SHO=['#e2e8f0','#111827','#EF4444','#22D3EE','#A855F7','#FACC15','#4ADE80','#f97316'],
 STRP=['#f8fafc','#22D3EE','#A855F7','#FACC15','#EF4444','#4ADE80','#111827','#f97316'];
let preview=0;
function custom(){
 if(mode!=='custom'){clearScene();reset();preview=0;setMode('custom')}
 const sw=(arr,key,label)=>`<div class="cr"><b>${label}</b>${arr.map((c,i)=>`<button class="sw" aria-pressed="${PL[key]===c}" data-k="${key}" data-v="${c}" style="background:${c}" aria-label="${label} opción ${i+1}"></button>`).join('')}</div>`;
 const op=(l,key,v)=>`<button class="opt" aria-pressed="${PL[key]===v}" data-k="${key}" data-v="${v}">${l}</button>`;
 panel(`<h2>Crea a tu atleta</h2>
 ${sw(SKT,'skin','Piel')}${sw(SHT,'shirt','Camisa')}${sw(PAT,'pants','Short')}${sw(HAT,'hair','Cabello')}
 <div class="cr"><b>Lentes</b>${op('Ninguno','gl',0)}${op('Claros','gl',1)}${op('De sol','gl',2)}</div>
 <div class="cr"><b>Peinado</b>${op('Corto','hs',0)}${op('Rapado','hs',1)}${op('Largo','hs',3)}${op('Cresta','hs',2)}${op('Afro','hs',4)}</div>
 <div class="cr"><b>Sombrero</b>${op('Ninguno','hat',0)}${op('Gorra','hat',1)}${op('Gorro','hat',2)}${op('Diadema','hat',3)}</div>
 ${sw(ACC,'acc','Color gorro/diadema')}
 <div class="cr"><b>Pantalón</b>${op('Short','lg',0)}${op('Largo','lg',1)}</div>
 ${sw(SHO,'shoe','Tenis')}
 <div class="cr"><b>Franja camisa</b>${op('Sin','str',0)}${STRP.map((c,i)=>`<button class="sw" aria-pressed="${PL.str===c}" data-k="str" data-v="${c}" style="background:${c}" aria-label="Franja ${i+1}"></button>`).join('')}</div>
 <div class="cr"><b>Extras</b>${op('Barba','beard',1)}</div>
 <div class="cr"><b>Vista previa</b>${['Novato','Constante','Atleta','Olímpico'].map((n,i)=>`<button class="opt" aria-pressed="${preview===i}" data-pv="${i}">${n}</button>`).join('')}</div>
 <p class="mu">Tu apariencia cambiará así conforme mejores Fuerza, Resistencia y Recuperación.</p>
 <div class="row"><button class="btn-main" id="cgo">▶ Comenzar</button><button id="cbk">Atrás</button></div>`);
 on('[data-k]',b=>{const k=b.dataset.k;if(k==='beard'||k==='cap')PL[k]=PL[k]?0:1;else{const v=b.dataset.v;PL[k]=['gl','hat','hs','lg'].includes(k)?+v:v==='0'?0:v}sfx('select');custom()});
 on('[data-pv]',b=>{preview=+b.dataset.pv;const v=[10,35,55,85][preview];S.STR=S.STA=S.REC=v;sfx('select');custom()});
 on('#cgo',()=>{store.set(LOOK,PL);sfx('click');story()});
 on('#cbk',()=>{sfx('click');menu()});
}
function story(){
 clearScene();reset();Audio2.stop();setMode('story');
 ST={t:0,done:{},stp:-1};
 panel(`<div class="col"><button class="btn-act" id="sk">⏭ Omitir historia</button><span class="mu">También puedes pulsar <kbd>Esc</kbd></span></div>`);
 on('#sk',endStory);scrollToEl($('stage'));
}
function endStory(){if(!ST)return;ST=null;sfx('click');goals()}
function goals(){
 clearScene();reset();setMode('goals');Audio2.play('menu');
 panel(`<h2>Elige tu objetivo</h2><p>Te quedan <b>14 días</b> para prepararte contra <b>Braulio "El Ciclado" Broscience</b>. Tu dieta decide cómo entrenas.</p>
 ${Object.entries(GOALS).map(([k,g])=>`<button class="blk" data-g="${k}">${g.i} <b>${g.n}</b><small>${g.d}</small><small style="font-family:var(--fm)">${g.k} kcal · P ${g.p} · C ${g.c} · G ${g.f}</small></button>`).join('')}
 <p class="mu">Las metas son ejemplos del juego, no una recomendación personal.</p>
 <button id="how">❓ ¿Cómo jugar?</button>`);
 on('[data-g]',b=>{sfx('click');gkey=b.dataset.g;goal=GOALS[gkey];reset();kitchen()});
 on('#how',()=>{sfx('click');how(goals)});
}

