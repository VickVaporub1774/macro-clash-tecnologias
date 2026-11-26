'use strict';
/* js/utils.js : Utilidades, store (localStorage seguro), temporizadores */

/* =====================================================================
   1. UTILIDADES
   ===================================================================== */
const $=id=>document.getElementById(id);
const cv=$('cv'),X=cv.getContext('2d');
X.imageSmoothingEnabled=false;
const rnd=n=>Math.random()*n|0;
const pick=a=>a[rnd(a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const E01=(a,b,v)=>clamp((v-a)/(b-a),0,1);
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
const store={
 get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},
 set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
 del(k){try{localStorage.removeItem(k)}catch(e){}}
};
const CALM=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
/* Temporizadores cancelables: evitan que algo pendiente cambie de pantalla tras salir */
let timers=[],paused=false,lastFocus=null;
function later(fn,ms){const id=setTimeout(()=>{timers=timers.filter(t=>t!==id);if(paused)later(fn,200);else fn()},ms);timers.push(id)}
function cancelTimers(){timers.forEach(clearTimeout);timers=[]}

