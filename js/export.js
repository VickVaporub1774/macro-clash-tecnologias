'use strict';
/* js/export.js : Guia modal, exportacion de resumen y respaldo de confeti */

/* ===== v1.1: guía, exportación y respaldo de confeti ===== */
const VERSION='1.2.0',esc=t=>String(t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
let LAST=null;
function openGuide(){if(paused)return;paused=true;lastFocus=document.activeElement;$('gm').hidden=false;$('gm').querySelector('.mbox').focus();sfx('click')}
function closeGuide(){if(!paused)return;paused=false;$('gm').hidden=true;if(lastFocus&&lastFocus.focus)lastFocus.focus();sfx('click')}
function trapTab(e){
 const f=[...$('gm').querySelectorAll('button')],i=f.indexOf(document.activeElement);
 if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}
 else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}
}
$('gd').addEventListener('click',openGuide);
$('gx').addEventListener('click',closeGuide);$('gok').addEventListener('click',closeGuide);
$('gm').addEventListener('pointerdown',e=>{if(e.target===$('gm'))closeGuide()});
function xsay(t){const el=$('xst');if(el)el.textContent=t}
function buildReport(){
 const g=goal||{},H=hist.filter(Boolean),W=!!(LAST&&LAST.win);
 return{
  juego:'MACRO-CLASH',version:VERSION,fecha:new Date().toISOString(),
  objetivo:{clave:gkey,nombre:g.n,kcal:g.k,proteina_g:g.p,carbohidratos_g:g.c,grasas_g:g.f},
  dias_completados:H.length,dias_totales:14,
  puntaje_habitos:{valor:LAST?LAST.score:null,maximo:100,nivel:LAST?LAST.grade:''},
  habitos:{dias_kcal_en_rango:T.ok,dias_proteina_suficiente:T.p,dias_carbos_suficientes:T.c,dias_con_ultraprocesados:T.j,dias_descanso:T.rest,dilemas_correctos:T.ev,dilemas_totales:T.evn},
  minijuegos:{repeticiones_perfectas:T.perf,repeticiones_buenas:T.good||0,fallos:T.fail},
  estadisticas_finales:{fuerza:Math.round(S.STR),resistencia:Math.round(S.STA),recuperacion:Math.round(S.REC),energia:Math.round(S.ENG),salud_metabolica:Math.round(S.HP)},
  batalla:{resultado:W?'victoria':'derrota',turnos:B?B.turn:null,hp_jugador_final:B?Math.round(B.hp):null,hp_braulio_final:B?Math.round(B.bh):null,golpe_glucogeno_desbloqueado:T.c>=8},
  detalle_diario:hist.map((h,i)=>h?{dia:i+1,kcal_pct:Math.round(h.k*100),proteina_pct:Math.round(h.p*100),carbos_pct:Math.round(h.c*100),grasas_pct:Math.round(h.f*100),ultraprocesados:h.j,actividad:h.act||'sin registro'}:null).filter(Boolean)
 };
}
function reportText(r){
 const b=r.batalla,h=r.habitos,e=r.estadisticas_finales,m=r.minijuegos,o=r.objetivo;
 return[
  'MACRO-CLASH · Resumen de partida (v'+r.version+')',
  'Fecha: '+new Date(r.fecha).toLocaleString('es-MX'),
  'Objetivo: '+o.nombre+' ('+o.kcal+' kcal · P '+o.proteina_g+' · C '+o.carbohidratos_g+' · G '+o.grasas_g+')',
  'Días completados: '+r.dias_completados+'/'+r.dias_totales,
  'Resultado de la batalla: '+(b.resultado==='victoria'?'VICTORIA':'DERROTA')+(b.turnos?' en '+b.turnos+' turnos':''),
  'Puntaje de hábitos: '+r.puntaje_habitos.valor+'/100 ('+r.puntaje_habitos.nivel+')',
  '',
  'Hábitos (de 14 días):',
  '- Kcal en rango: '+h.dias_kcal_en_rango,
  '- Proteína suficiente: '+h.dias_proteina_suficiente,
  '- Carbohidratos suficientes: '+h.dias_carbos_suficientes,
  '- Días con ultraprocesados: '+h.dias_con_ultraprocesados,
  '- Días de descanso: '+h.dias_descanso,
  '- Dilemas correctos: '+h.dilemas_correctos+'/'+h.dilemas_totales,
  '',
  'Minijuegos: '+m.repeticiones_perfectas+' perfectas · '+m.repeticiones_buenas+' buenas · '+m.fallos+' fallos',
  'Estadísticas finales: Fuerza '+e.fuerza+' · Resistencia '+e.resistencia+' · Recuperación '+e.recuperacion+' · Energía '+e.energia+' · Salud '+e.salud_metabolica
 ].join('\n');
}
function copyText(t,msg){
 const ok=()=>xsay(msg),fail=()=>xsay('No se pudo copiar: usa «Descargar .json»');
 const legacy=()=>{const a=document.createElement('textarea');a.value=t;a.setAttribute('readonly','');a.style.cssText='position:fixed;opacity:0;top:0';document.body.appendChild(a);a.select();let r=false;try{r=document.execCommand('copy')}catch(e){}a.remove();r?ok():fail()};
 if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(ok,legacy);else legacy();
}
function download(name,mime,t){
 const u=URL.createObjectURL(new Blob([t],{type:mime})),a=document.createElement('a');
 a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);
}
function miniConfetti(){
 if(CALM)return;
 const c=document.createElement('canvas');c.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:40';
 c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);
 const g=c.getContext('2d'),cols=['#22D3EE','#A855F7','#C084FC','#22C55E','#F8FAFC'],P=[];
 for(let i=0;i<120;i++)P.push({x:Math.random()*c.width,y:-20-Math.random()*c.height*.4,vx:(Math.random()-.5)*2,vy:2+Math.random()*3,s:5+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:cols[i%cols.length]});
 let n=0;(function f(){g.clearRect(0,0,c.width,c.height);
  for(const p of P){p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;g.save();g.translate(p.x,p.y);g.rotate(p.r);g.fillStyle=p.c;g.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);g.restore()}
  if(++n<170)requestAnimationFrame(f);else c.remove()})();
}
const noBi=()=>document.documentElement.classList.add('no-bi');
addEventListener('load',()=>{try{document.fonts.load('1em bootstrap-icons').then(f=>{if(!f.length)noBi()}).catch(noBi)}catch(e){noBi()}});
