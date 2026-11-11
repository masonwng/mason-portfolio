import katex from './vendor/katex.mjs';
import { LEVELS } from './questions.mjs';
import {DURATION,newAttack,attackStage,attackQuestion,answerAttack,skipQuestion,multiplier,attackText} from './timeattack.mjs';
import {newRun,currentQuestion,answerRun,revealHint,revealSolution,replaceQuestion,accuracy,restoreRun,updateBest,resultText} from './core.mjs';
const $=id=>document.getElementById(id),el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const key='math-ascension:v1';
function read(k,fallback){try{return JSON.parse(localStorage.getItem(k))??fallback;}catch{return fallback;}}
function write(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch{$('save-status').textContent='Saving is unavailable. You can still play this run.';return false;}}
function seed(){return crypto.getRandomValues(new Uint32Array(1))[0];}
const time=ms=>`${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}`;
let run=restoreRun(JSON.stringify(read(key,null)))||newRun('standard',seed(),read(`${key}:previous`,[]));
let best=read(`${key}:best`,{}),sound=read(`${key}:sound`,false),locked=false,lastTick=performance.now(),audio,transitionTimer;
if(!best||typeof best!=='object'||Array.isArray(best))best={};
function save(){write(key,run);best=updateBest(best,run);write(`${key}:best`,best);write(`${key}:previous`,run.seen);}
function beep(){if(!sound)return;try{audio??=new AudioContext();audio.resume().catch(()=>{});[440,554,659].forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+i*.08;o.frequency.value=f;g.gain.setValueAtTime(.025,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.22);});}catch{ /* optional audio */ }}
function burst(node,gold=false){const b=el('div',undefined,`burst${gold?' gold':''}`);b.setAttribute('aria-hidden','true');for(let i=0;i<20;i++){const p=el('i');p.style.setProperty('--x',`${Math.cos(i*Math.PI/10)*160}px`);p.style.setProperty('--y',`${Math.sin(i*Math.PI/10)*120}px`);b.append(p);}node.append(b);setTimeout(()=>b.remove(),1100);beep();}
function math(node,tex,display=true){katex.render(tex,node,{throwOnError:false,displayMode:display,trust:false,output:'htmlAndMathml'});}
function start(mode){clearTimeout(transitionTimer);locked=false;const previous=Array.from({length:14},(_,i)=>run.seen[i]||run.previous[i]||null);run=newRun(mode,seed(),previous);lastTick=performance.now();$('feedback').textContent='';$('share-status').textContent='';save();render();}
function render(){
  $('submit').disabled=locked;
  const inAttack=document.body.classList.contains('attack-view');$('standard').setAttribute('aria-pressed',!inAttack&&run.mode==='standard');$('challenge').setAttribute('aria-pressed',!inAttack&&run.mode==='challenge');$('attack-mode').setAttribute('aria-pressed',inAttack);
  $('mode-help').textContent=inAttack?'60 seconds, rising difficulty, combos up to ×5.':run.mode==='standard'?'Retry, use a hint, and learn as you climb.':'One wrong answer ends the run. Make it count.';
  $('timer').textContent=time(run.elapsed);$('stage-label').textContent=LEVELS[Math.min(run.stage,13)];$('progress-count').textContent=`${run.correct} / 14`;$('progress').value=run.correct;
  mountain();$('map').replaceChildren();LEVELS.forEach((name,i)=>{const li=el('li',undefined,i<run.stage?'complete':i===run.stage?'current':'locked');li.setAttribute('aria-label',`${name}: ${i<run.stage?'complete':i===run.stage?'current':'locked'}`);if(i===run.stage)li.setAttribute('aria-current','step');li.append(el('span',i<run.stage?'✓':String(i+1),'map-number'),el('span',name),el('span',i<run.stage?'complete':i===run.stage?'current':'locked','map-state'));$('map').append(li);});
  const record=best[run.mode];$('best').textContent=`Personal best: ${record?.correct||0}/14 complete${Number.isFinite(record?.fastest)?` · fastest ${time(record.fastest)}`:''}`;
  $('question').hidden=run.status!=='playing';$('results').hidden=run.status==='playing';
  if(run.status!=='playing'){renderResults();return;}
  const q=currentQuestion(run);$('stage-badge').textContent=run.stage===13?'FINAL STAGE':`STAGE ${run.stage+1} / 14`;$('topic').textContent=q.topic;$('question-topic').textContent=q.prompt;
  $('formula').hidden=!q.tex;if(q.tex)math($('formula'),q.tex);
  $('answer').value='';$('choices').replaceChildren();$('choices').hidden=q.type!=='choice';$('typed').hidden=q.type==='choice';
  if(q.type==='choice')q.options.forEach(option=>{const label=el('label',undefined,'choice'),input=el('input');input.type='radio';input.name='choice';input.value=option.id;input.required=true;const span=el('span');math(span,option.text,false);label.append(input,span);$('choices').append(label);});
  $('answer').required=q.type!=='choice';$('answer').inputMode=q.type==='number'?'decimal':'text';
  $('answer').placeholder=q.type==='number'?'e.g. 0.5 or 1/2':q.type==='integral'?'e.g. x^3 + 2x + C':'e.g. 2(x+1)';
  $('input-help').textContent=q.type==='number'?'Numbers, decimals, and fractions accepted.':q.type==='integral'?'Use x, ^ for powers, and finish with + C.':'Equivalent polynomial expressions are accepted. Use ^ for powers.';
  $('hint').disabled=run.usedHint||run.revealed;$('hint-text').hidden=!run.usedHint;$('hint-text').textContent=q.hint;
  $('hint-count').textContent=`${run.hints} hints · ${run.attempts} attempts`;$('solution').hidden=run.mode==='challenge';$('solution').disabled=run.revealed;
  $('answer-form').hidden=run.revealed;$('new-question').hidden=!run.revealed;$('solution-text').hidden=!run.revealed;
  if(run.revealed)showSteps($('solution-text'),q);
  $('question').classList.remove('level-up','milestone');
}
// The 14 stages are camps on a zigzag trail; the climber stands at the current one.
const PEAK=[110,16],edge=y=>[110*(140-y)/124,110+90*(y-16)/124];
const TRAIL=Array.from({length:14},(_,i)=>{if(i===13)return [PEAK[0],PEAK[1]+6];const y=133-i*8.2,[l,r]=edge(y),k=i%6,f=k<=3?k/3:(6-k)/3;return [Math.round(l+14+(r-l-28)*f),Math.round(y)];});
function mountain(){
  const svg=$('mountain'),ns='http://www.w3.org/2000/svg',node=(tag,attrs)=>{const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n;};
  const at=Math.min(run.stage,13),[cx,cy]=TRAIL[at],done=run.status==='won';
  const climber=svg.querySelector('.mt-climber')||node('g',{class:'mt-climber'});
  svg.replaceChildren(
    node('path',{d:'M-10 140 L44 74 L70 92 L96 60 L140 104 L168 70 L210 140 Z',class:'mt-back'}),
    node('path',{d:'M0 140 L110 16 L200 140 Z',class:'mt-front'}),
    node('path',{d:'M93 35 L110 16 L130 44 L120 38 L111 46 L102 37 Z',class:'mt-snow'}),
    node('polyline',{points:TRAIL.map(p=>p.join(',')).join(' '),class:'mt-trail'}),
    node('polyline',{points:TRAIL.slice(0,at+1).map(p=>p.join(',')).join(' '),class:'mt-trail-done'}),
    ...TRAIL.map(([x,y],i)=>node('circle',{cx:x,cy:y,r:i===13?4:2.6,class:i<run.stage?'mt-camp done':i===at&&!done?'mt-camp here':'mt-camp'})),
    node('path',{d:`M${PEAK[0]} ${PEAK[1]} v-15 l10 4 l-10 4`,class:done?'mt-flag won':'mt-flag'}),
  );
  climber.style.transform=`translate(${cx}px,${cy}px)`;if(!climber.firstChild)climber.append(node('text',{x:0,y:-4,'text-anchor':'middle'}));climber.firstChild.textContent=done?'🎉':'🧗';svg.append(climber);
}
function showSteps(node,q){node.replaceChildren(el('h3','Worked solution'));const ol=el('ol');q.steps.forEach(step=>ol.append(el('li',step)));node.append(ol);}
function renderResults(){
  const won=run.status==='won';$('results').classList.toggle('won',won);$('result-kicker').textContent=won?'MATH ASCENSION COMPLETE':'ONE-LIFE CHALLENGE';$('result-title').textContent=won?'You made it to the top.':'That’s this run.';
  $('result-copy').textContent=won?'Kindergarten to University Year 1. All fourteen stages, complete.':'Can you reach university? Try a fresh set of questions.';
  $('result-stats').replaceChildren();for(const [label,value] of [['Highest level',LEVELS[Math.min(run.stage,13)]],['Correct answers',`${run.correct} / 14`],['Total attempts',run.attempts],['Accuracy',`${accuracy(run)}%`],['Active time',time(run.elapsed)],['Hints used',run.hints],['Personal best',`${best[run.mode]?.correct||0} / 14`]]){const div=el('div');div.append(el('dt',label),el('dd',String(value)));$('result-stats').append(div);}
  $('results').querySelector('.post-solution')?.remove();if(!won){const details=el('details',undefined,'post-solution');details.append(el('summary','Review this question'));const q=currentQuestion(run),p=el('p',q.prompt);details.append(p);if(q.tex){const formula=el('div');math(formula,q.tex);details.append(formula);}const solution=el('div');showSteps(solution,q);details.append(solution);$('results').append(details);}
}
$('answer-form').onsubmit=event=>{
  event.preventDefault();if(locked)return;tick();
  const input=currentQuestion(run).type==='choice'?document.querySelector('input[name="choice"]:checked')?.value||'':$('answer').value;
  const result=answerRun(run,input);if(result.blocked)return;
  if(!result.valid){$('feedback').textContent=result.message;return;}
  const previous=run.stage;run=result.run;save();
  if(result.correct){locked=true;$('submit').disabled=true;$('question').classList.add('level-up');const milestone=[6,9,12,13].includes(previous);if(milestone)$('question').classList.add('milestone');burst($('question'),milestone);$('feedback').textContent=run.status==='won'?'ALL 14 STAGES COMPLETE!':`${LEVELS[run.stage].toUpperCase()} UNLOCKED!`;
    transitionTimer=setTimeout(()=>{locked=false;$('submit').disabled=false;render();if(run.status==='won'){burst($('results'),true);$('replay').focus();}else{$('question').focus({preventScroll:true});}},window.matchMedia('(prefers-reduced-motion: reduce)').matches?120:850);
  }else{$('feedback').textContent=run.status==='lost'?'Run complete. Review the solution and try again.':'Not quite. Try again, or use a hint.';if(run.status==='lost'){render();$('replay').focus();}else{$('hint-count').textContent=`${run.hints} hints · ${run.attempts} attempts`;$('answer').select();}}
};
$('hint').onclick=()=>{if(locked)return;run=revealHint(run);save();$('hint-text').hidden=false;$('hint-text').textContent=currentQuestion(run).hint;$('hint').disabled=true;$('hint-count').textContent=`${run.hints} hints · ${run.attempts} attempts`;};
$('solution').onclick=()=>{if(locked)return;run=revealSolution(run);save();render();};
$('new-question').onclick=()=>{run=replaceQuestion(run);save();render();$('answer').focus();};
$('standard').onclick=()=>{showAttack(false);if(run.mode!=='standard')start('standard');};$('challenge').onclick=()=>{showAttack(false);if(run.mode!=='challenge')start('challenge');};$('restart').onclick=()=>start(run.mode);$('replay').onclick=()=>start(run.mode);
$('share').onclick=async()=>{try{await navigator.clipboard.writeText(resultText(run));$('share-status').textContent='Result copied.';}catch{$('share-status').textContent=resultText(run);}};
function soundLabel(){$('sound').textContent=sound?'sound on':'sound off';$('sound').setAttribute('aria-pressed',sound);}
$('sound').onclick=()=>{sound=!sound;write(`${key}:sound`,sound);soundLabel();beep();};soundLabel();
document.body.classList.toggle('dark',read(`${key}:theme`,matchMedia('(prefers-color-scheme: dark)').matches));$('theme').onclick=()=>{document.body.classList.toggle('dark');write(`${key}:theme`,document.body.classList.contains('dark'));};
function tick(){const now=performance.now();if(run.status==='playing'&&!document.hidden&&!locked)run.elapsed+=Math.round(Math.min(now-lastTick,2000));lastTick=now;$('timer').textContent=time(run.elapsed);}
setInterval(tick,500);setInterval(()=>{if(run.status==='playing')save();},5000);document.addEventListener('visibilitychange',()=>{lastTick=performance.now();save();});window.addEventListener('pagehide',save);
save();render();

// ---- Time Attack -------------------------------------------------------------
const attackKey=`${key}:timeattack`;
let attack=newAttack(seed()),attackEnds=0,attackFrame=0,attackBest=Number(read(attackKey,0))||0;
const GRADE_SHORT=['K',...Array.from({length:12},(_,i)=>String(i+1))];
function showAttack(on){
  if(!on&&attack.status==='playing')endAttack(false);
  document.body.classList.toggle('attack-view',on);$('attack').hidden=!on;
  if(on)renderAttack();render();
}
function renderAttack(){
  const playing=attack.status==='playing',left=playing?Math.max(0,attackEnds-performance.now()):attack.status==='over'?0:DURATION;
  $('attack-time').textContent=(left/1000).toFixed(1);$('attack-bar').style.transform=`scaleX(${left/DURATION})`;$('attack').classList.toggle('hurry',playing&&left<10000);
  $('attack-score').textContent=attack.score;$('attack-combo').textContent=`×${multiplier(attack.combo)}`;$('attack-grade').textContent=GRADE_SHORT[attackStage(attack)];
  $('attack-ready').hidden=attack.status!=='ready';$('attack-play').hidden=!playing;$('attack-over').hidden=attack.status!=='over';
  $('attack-best').textContent=attackBest?`Your best: ${attackBest} points`:'';
}
function attackQuestionView(){
  const q=attackQuestion(attack);$('attack-topic').textContent=`${GRADE_SHORT[attackStage(attack)]==='K'?'Kindergarten':'Grade '+GRADE_SHORT[attackStage(attack)]} · ${q.topic}`;$('attack-prompt').textContent=q.prompt;
  $('attack-formula').hidden=!q.tex;if(q.tex)math($('attack-formula'),q.tex);
  $('attack-choices').replaceChildren();$('attack-choices').hidden=q.type!=='choice';$('attack-typed').hidden=q.type==='choice';$('attack-answer').value='';$('attack-answer').required=q.type!=='choice';
  $('attack-answer').inputMode=q.type==='number'?'decimal':'text';
  if(q.type==='choice')q.options.forEach((option,i)=>{const label=el('label',undefined,'choice'),input=el('input');input.type='radio';input.name='attack-choice';input.value=option.id;const span=el('span');math(span,option.text,false);label.append(input,span);$('attack-choices').append(label);if(i===0)input.required=true;});
  (q.type==='choice'?$('attack-choices').querySelector('input'):$('attack-answer')).focus({preventScroll:true});
}
function attackLoop(){renderAttack();if(attack.status!=='playing')return;if(performance.now()>=attackEnds){endAttack(true);return;}attackFrame=requestAnimationFrame(attackLoop);}
function startAttack(){cancelAnimationFrame(attackFrame);attack={...newAttack(seed()),status:'playing'};attackEnds=performance.now()+DURATION;$('attack-feedback').textContent='';$('attack-share-status').textContent='';renderAttack();attackQuestionView();attackLoop();}
function endAttack(finished){
  cancelAnimationFrame(attackFrame);attack={...attack,status:finished?'over':'ready'};if(!finished){renderAttack();return;}
  const record=attack.score>attackBest&&attack.score>0;if(record){attackBest=attack.score;write(attackKey,attackBest);}
  $('attack-final').textContent=record?`${attack.score} points — new best! 🏆`:`${attack.score} points`;
  $('attack-stats').replaceChildren();for(const [label,value] of [['Correct',attack.correct],['Missed',attack.wrong],['Best streak',`${attack.bestCombo} in a row`],['Highest grade',GRADE_SHORT[attackStage(attack)]==='K'?'Kindergarten':'Grade '+GRADE_SHORT[attackStage(attack)]],['Personal best',attackBest]]){const d=el('div');d.append(el('dt',label),el('dd',String(value)));$('attack-stats').append(d);}
  renderAttack();if(record)burst($('attack-over'),true);$('attack-again').focus();
}
function pop(text,good){const p=$('attack-pop');p.textContent=text;p.className=`attack-pop show ${good?'good':'bad'}`;void p.offsetWidth;}
$('attack-mode').onclick=()=>showAttack(true);
$('attack-start').onclick=startAttack;$('attack-again').onclick=startAttack;
$('attack-skip').onclick=()=>{attack=skipQuestion(attack);pop('skipped',false);attackQuestionView();renderAttack();};
$('attack-form').onsubmit=event=>{
  event.preventDefault();if(attack.status!=='playing')return;
  const q=attackQuestion(attack),input=q.type==='choice'?document.querySelector('input[name="attack-choice"]:checked')?.value||'':$('attack-answer').value;
  const result=answerAttack(attack,input);if(!result.valid){$('attack-feedback').textContent=result.message||'Enter an answer.';return;}
  attack=result.attack;
  if(result.correct){pop(`+${result.points}`,true);$('attack-feedback').textContent=attack.combo>=3?`Combo ×${multiplier(attack.combo)}!`:'Correct!';if(attack.combo%3===0)beep();}
  else{pop('combo lost',false);$('attack-feedback').textContent=`Not quite. The answer was ${q.type==='choice'?q.answerText:q.answer}.`;}
  attackQuestionView();renderAttack();
};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&attack.status==='playing')endAttack(true);});
$('attack-share').onclick=async()=>{const text=attackText(attack,attackBest);try{await navigator.clipboard.writeText(text);$('attack-share-status').textContent='Score copied.';}catch{$('attack-share-status').textContent=text;}};
