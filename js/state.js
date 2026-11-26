'use strict';
/* js/state.js : Estado, claves de guardado y apariencia (macroclash_save_v1 / look_v1) */

/* =====================================================================
   3. ESTADO Y GUARDADO
   ===================================================================== */
const KEY='macroclash_save_v1',LOOK='macroclash_look_v1',MKEY='macroclash_mute_v1';
const NR=8;
let S,T,hist,evq,goal,gkey,day=1,sel=[],D=null,mode='menu',act=null,tm=null,B=null,ST=null,cast=[],lastFeat=0;
let PL={skin:'#e0a67a',shirt:'#38BDF8',pants:'#2a4d8f',hair:'#2b1b10',gl:0,beard:0,cap:0,hat:0,hs:0,lg:0,shoe:'#e2e8f0',str:0,acc:'#A855F7'};
function normPL(){
 const HX=/^#[0-9a-f]{6}$/i,D0={skin:'#e0a67a',shirt:'#38BDF8',pants:'#2a4d8f',hair:'#2b1b10',shoe:'#e2e8f0',acc:'#A855F7'};
 for(const k in D0)if(!HX.test(PL[k]||''))PL[k]=D0[k];
 PL.hat=[0,1,2,3].includes(+PL.hat)?+PL.hat:(PL.cap?1:0);
 PL.hs=[0,1,2,3,4].includes(+PL.hs)?+PL.hs:0;
 PL.lg=PL.lg?1:0;PL.gl=[0,1,2].includes(+PL.gl)?+PL.gl:0;PL.beard=PL.beard?1:0;
 if(PL.str&&!HX.test(PL.str))PL.str=0;PL.cap=0;
}
{const q=store.get(LOOK);if(q&&q.skin)Object.assign(PL,q);normPL()}
function reset(){
 S={STR:10,STA:10,REC:10,ENG:50,HP:50};
 T={c:0,p:0,j:0,ok:0,ev:0,evn:0,rest:0,perf:0,good:0,fail:0};
 hist=[];evq=shuffle(EVENTS.map((_,i)=>i)).slice(0,EVENT_DAYS.length);
 day=1;sel=[];D=null;
}
function save(){store.set(KEY,{g:gkey,day,S,T,hist,evq,pl:PL})}
function loadSave(){
 const s=store.get(KEY);
 return s&&GOALS[s.g]&&s.S&&STATS.every(a=>Number.isFinite(s.S[a[0]]))&&s.T&&s.day>=1&&s.day<=15?s:null;
}

