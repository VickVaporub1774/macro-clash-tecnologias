'use strict';
/* js/main.js : Bucle principal, controles y arranque (cargar al final) */

/* =====================================================================
   16. BUCLE PRINCIPAL Y CONTROLES
   ===================================================================== */
let last=performance.now(),clock=0;
function loop(now){
 const dt=paused?0:clamp((now-last)/1000,0,.05);last=now;clock+=dt;
 X.save();X.clearRect(0,0,640,360);
 if(shake>.4){R('#05070b',0,0,640,360);X.translate((Math.random()-.5)*shake|0,(Math.random()-.5)*shake|0);shake*=Math.pow(.004,dt)}else shake=0;
 updateTraining(dt);
 if(mode==='menu'||mode==='goals')drawMenu(clock);
 else if(mode==='custom')drawCustom(clock);
 else if(mode==='story'){if(ST)drawStory(dt)}
 else if(mode==='intro'||mode==='battle'||(mode==='summary'&&B))drawBattle(clock,dt);
 else drawGym(clock,dt);
 drawFX(dt);
 if(flash>0){X.fillStyle=`rgba(${flashColor},${flash})`;X.fillRect(-20,-20,680,400);flash=Math.max(0,flash-dt*2.2)}
 X.restore();
 requestAnimationFrame(loop);
}
cv.addEventListener('pointerdown',e=>{if(tm){e.preventDefault();press()}});
document.addEventListener('keydown',e=>{
 if(e.ctrlKey||e.metaKey||e.altKey)return;
 if(e.code==='Escape'&&paused){closeGuide();return}
 if(e.code==='Tab'&&paused){trapTab(e);return}
 if(e.code==='KeyG'&&!e.repeat){paused?closeGuide():openGuide();return}
 if(paused)return;
 if(e.code==='Escape'&&ST){endStory();return}
 if(e.code==='KeyM'&&!e.repeat){toggleMute();return}
 const onHeader=e.target.closest&&e.target.closest('header');
 if((e.code==='Space'||e.code==='Enter'||e.code==='NumpadEnter')&&tm&&!onHeader){e.preventDefault();if(!e.repeat)press();return}
 const n=+e.key;
 if(!e.repeat&&n>=1&&n<=6){
  const a={battle:'[data-s]',event:'[data-o]',gym:'[data-t]'}[mode];
  if(a){const b=document.querySelectorAll('#panel '+a)[n-1];if(b&&!b.disabled)b.click()}
 }
});
reset();updateMuteBtn();menu();requestAnimationFrame(loop);
