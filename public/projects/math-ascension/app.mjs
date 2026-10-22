import katex from './vendor/katex.mjs';
import { LEVELS } from './questions.mjs';
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
  $('standard').setAttribute('aria-pressed',run.mode==='standard');$('challenge').setAttribute('aria-pressed',run.mode==='challenge');
  $('mode-help').textContent=run.mode==='standard'?'Retry, use a hint, and learn as you climb.':'One wrong answer ends the run. Make it count.';
  $('timer').textContent=time(run.elapsed);$('stage-label').textContent=LEVELS[Math.min(run.stage,13)];$('progress-count').textContent=`${run.correct} / 14`;$('progress').value=run.correct;
  $('map').replaceChildren();LEVELS.forEach((name,i)=>{const li=el('li',undefined,i<run.stage?'complete':i===run.stage?'current':'locked');li.setAttribute('aria-label',`${name}: ${i<run.stage?'complete':i===run.stage?'current':'locked'}`);if(i===run.stage)li.setAttribute('aria-current','step');li.append(el('span',i<run.stage?'✓':String(i+1),'map-number'),el('span',name),el('span',i<run.stage?'complete':i===run.stage?'current':'locked','map-state'));$('map').append(li);});
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
function showSteps(node,q){node.replaceChildren(el('h3','Worked solution'));const ol=el('ol');q.steps.forEach(step=>ol.append(el('li',step)));node.append(ol);}
function renderResults(){
  const won=run.status==='won';$('results').classList.toggle('won',won);$('result-kicker').textContent=won?'MATH ASCENSION COMPLETE':'ONE-LIFE CHALLENGE';$('result-title').textContent=won?'You made it to the top.':'That’s this run.';
  $('result-copy').textContent=won?'Kindergarten to University Year 1. All fourteen stages, complete.':'Can you reach university? Try a fresh set of questions.';
  $('result-stats').replaceChildren();for(const [label,value] of [['Highest level',LEVELS[Math.min(run.stage,13)]],['Correct answers',`${run.correct} / 14`],['Total attempts',run.attempts],['Accuracy',`${accuracy(run)}%`],['Active time',time(run.elapsed)],['Hints used',run.hints],['Personal best',`${best[run.mode]?.correct||0} / 14`]]){const div=el('div');div.append(el('dt',label),el('dd',String(value)));$('result-stats').append(div);}
  $('results').querySelector('.post-solution')?.remove();if(!won){const details=el('details',undefined,'post-solution');details.append(el('summary','Review this question'));const q=currentQuestion(run),p=el('p',q.prompt);details.append(p);if(q.tex){const formula=el('div');math(formula,q.tex);details.append(formula);}const solution=el('div');showSteps(solution,q);details.append(solution);$('results').append(details);}
}
$('answer-form').onsubmit=event=>{
  event.preventDefault();if(locked)return;
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
$('standard').onclick=()=>{if(run.mode!=='standard')start('standard');};$('challenge').onclick=()=>{if(run.mode!=='challenge')start('challenge');};$('restart').onclick=()=>start(run.mode);$('replay').onclick=()=>start(run.mode);
$('share').onclick=async()=>{try{await navigator.clipboard.writeText(resultText(run));$('share-status').textContent='Result copied.';}catch{$('share-status').textContent=resultText(run);}};
function soundLabel(){$('sound').textContent=sound?'sound on':'sound off';$('sound').setAttribute('aria-pressed',sound);}
$('sound').onclick=()=>{sound=!sound;write(`${key}:sound`,sound);soundLabel();beep();};soundLabel();
document.body.classList.toggle('dark',read(`${key}:theme`,matchMedia('(prefers-color-scheme: dark)').matches));$('theme').onclick=()=>{document.body.classList.toggle('dark');write(`${key}:theme`,document.body.classList.contains('dark'));};
function tick(){const now=performance.now();if(run.status==='playing'&&!document.hidden&&!locked)run.elapsed+=Math.round(Math.min(now-lastTick,2000));lastTick=now;$('timer').textContent=time(run.elapsed);}
setInterval(tick,500);setInterval(()=>{if(run.status==='playing')save();},5000);document.addEventListener('visibilitychange',()=>{lastTick=performance.now();save();});window.addEventListener('pagehide',save);
save();render();
