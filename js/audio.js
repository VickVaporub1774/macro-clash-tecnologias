'use strict';
/* js/audio.js : Audio procedural (Web Audio) */

/* =====================================================================
   4. AUDIO PROCEDURAL (Web Audio, sin archivos)
   ===================================================================== */
const Audio2=(()=>{
 let ac=null,master,mus,sfx,noiseBuf,timer=null,track=null,step=0,next=0,variation=0;
 let muted=!!store.get(MKEY);
 function ctx(){
  if(!ac){
   try{
    ac=new(window.AudioContext||window.webkitAudioContext)();
    const comp=ac.createDynamicsCompressor();comp.connect(ac.destination);
    master=ac.createGain();master.gain.value=muted?0:.9;master.connect(comp);
    mus=ac.createGain();mus.gain.value=.55;mus.connect(master);
    sfx=ac.createGain();sfx.gain.value=.9;sfx.connect(master);
    noiseBuf=ac.createBuffer(1,ac.sampleRate*.5,ac.sampleRate);
    const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
   }catch(e){ac=null}
  }
  if(ac&&ac.state==='suspended'&&!document.hidden)ac.resume().catch(()=>{});
  return ac;
 }
 function tone(f,t,dur,type,vol,out,slide,attack=.008){
  const o=ac.createOscillator(),g=ac.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t);
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+attack);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(out);o.start(t);o.stop(t+dur+.03);
 }
 function noise(t,dur,vol,freq,out,type='highpass'){
  const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();
  s.buffer=noiseBuf;f.type=type;f.frequency.value=freq;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(f);f.connect(g);g.connect(out);s.start(t);s.stop(t+dur);
 }
 const hz=n=>440*Math.pow(2,(n-69)/12);
 /* Progresiones (notas MIDI de la raíz y tipo menor/mayor) */
 const TRACKS={
  menu:{bpm:84,prog:[[57,1],[53,0],[48,0],[55,0]],drums:0},
  gym:{bpm:102,prog:[[57,1],[53,0],[48,0],[55,0],[50,1],[57,1],[53,0],[52,0]],drums:1},
  battle:{bpm:138,prog:[[52,1],[48,0],[50,0],[47,0]],drums:2}
 };
 const MOTIFS=[[0,-1,2,-1,4,-1,2,-1],[4,-1,-1,3,2,-1,0,-1],[-1,2,3,-1,5,4,-1,-1],[0,-1,-1,-1,2,-1,4,5],[-1,-1,-1,-1,-1,-1,-1,-1]];
 function schedule(){
  const tr=TRACKS[track],s16=60/tr.bpm/4;
  while(next<ac.currentTime+.18){
   const bar=Math.floor(step/16),i=step%16,[root,minor]=tr.prog[bar%tr.prog.length];
   const third=minor?3:4,scale=minor?[0,3,5,7,10,12,15]:[0,2,4,7,9,12,14];
   if(i===0){
    if(bar%4===0)variation=rnd(MOTIFS.length);
    [0,third,7].forEach(n=>tone(hz(root+n),next,s16*15,'triangle',.028,mus,0,.15));
   }
   if(track==='battle'?i%2===0:(i===0||i===6||i===10))tone(hz(root-12+(i===10?7:0)),next,s16*(track==='battle'?1.6:3),'triangle',.12,mus);
   if(i%2===0){
    const m=MOTIFS[(variation+(bar%2))%MOTIFS.length][i/2];
    if(m>=0)tone(hz(root+12+scale[m]),next,s16*2.6,'square',.018,mus);
    else if(tr.drums&&Math.random()<.18)tone(hz(root+24+pick([0,third,7])),next,s16,'sine',.025,mus);
   }
   if(tr.drums){
    if(i===0||i===8||(tr.drums===2&&i%4===0))tone(130,next,.13,'sine',.2,mus,-85,.002);
    if(i===4||i===12)noise(next,.1,.07,1500,mus,'bandpass');
    if(i%(tr.drums===2?2:4)===2%(tr.drums===2?2:4))noise(next,.03,.028,7000,mus);
   }
   next+=s16;step++;
  }
 }
 function play(name){
  if(track===name&&timer)return;
  stop();track=name;
  if(!ctx())return;
  step=0;next=ac.currentTime+.08;
  timer=setInterval(()=>{if(ac.state==='running'){if(next<ac.currentTime)next=ac.currentTime+.05;schedule()}},40);
 }
 function stop(){clearInterval(timer);timer=null;track=null}
 const notes=(arr,type,vol,gap,dur)=>arr.forEach((f,i)=>tone(f,ac.currentTime+i*gap,dur,type,vol,sfx));
 const FX={
  click:t=>tone(740,t,.05,'square',.045,sfx,200),
  select:t=>{tone(520,t,.06,'triangle',.12,sfx,260)},
  good:t=>{tone(587,t,.09,'square',.07,sfx);tone(880,t+.06,.12,'square',.06,sfx);noise(t,.05,.08,3000,sfx)},
  perfect:()=>{notes([784,988,1319,1568],'square',.06,.05,.14);noise(ac.currentTime,.09,.12,2500,sfx)},
  miss:t=>tone(200,t,.24,'sawtooth',.07,sfx,-120),
  lift:t=>tone(90,t,.18,'triangle',.18,sfx,80),
  up:()=>notes([523,659,784,1047],'square',.055,.09,.16),
  alert:()=>notes([440,330,440],'triangle',.12,.13,.14),
  hit:t=>{noise(t,.14,.3,900,sfx,'lowpass');tone(170,t,.16,'square',.1,sfx,-110,.002)},
  heavy:t=>{noise(t,.35,.45,700,sfx,'lowpass');tone(110,t,.4,'sawtooth',.14,sfx,-70,.002);tone(880,t,.2,'square',.05,sfx,-600)},
  hurt:t=>{noise(t,.12,.22,500,sfx,'lowpass');tone(250,t,.22,'sawtooth',.08,sfx,-160)},
  heal:()=>notes([440,554,659,880],'sine',.12,.07,.22),
  bell:t=>{[0,.22,.44].forEach(d=>{tone(1250,t+d,.35,'triangle',.09,sfx);tone(1870,t+d,.25,'sine',.05,sfx)})},
  win:()=>notes([523,659,784,1047,784,1047,1319],'square',.065,.13,.24),
  lose:()=>notes([392,330,262,196],'triangle',.15,.22,.32),
  step:t=>noise(t,.04,.07,300,sfx,'lowpass')
 };
 function fx(n){if(muted||!ctx())return;try{FX[n](ac.currentTime)}catch(e){}}
 function setMute(m){muted=m;store.set(MKEY,m);if(ctx())master.gain.setTargetAtTime(m?0:.9,ac.currentTime,.02)}
 document.addEventListener('visibilitychange',()=>{if(!ac)return;if(document.hidden)ac.suspend().catch(()=>{});else ac.resume().catch(()=>{})});
 /* Los navegadores solo permiten audio tras un gesto del usuario */
 const unlock=()=>ctx();
 ['pointerdown','keydown'].forEach(e=>document.addEventListener(e,unlock,{capture:true}));
 return{fx,play,stop,setMute,get muted(){return muted}};
})();
const sfx=n=>Audio2.fx(n);

