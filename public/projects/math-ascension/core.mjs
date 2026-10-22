import { generateQuestion, LEVELS } from './questions.mjs';
import { checkAnswer } from './answers.mjs';
export function newRun(mode,seed,previous=[]){return {version:1,mode:mode==='challenge'?'challenge':'standard',seed:seed>>>0,stage:0,correct:0,attempts:0,hints:0,elapsed:0,status:'playing',revealed:false,usedHint:false,revision:0,previous:previous.slice(0,14),seen:[]};}
export function currentQuestion(run){return generateQuestion(Math.min(run.stage,13),(run.seed+run.stage*101+run.revision*7919)>>>0,run.previous[run.stage]);}
export function answerRun(run,input){
  if(run.status!=='playing'||run.revealed)return {run,blocked:true};
  const q=currentQuestion(run),result=checkAnswer(q,input);
  if(!result.valid)return {run,...result};
  const next={...run,attempts:run.attempts+1};
  if(result.correct){next.seen=[...run.seen,q.id];next.correct++;next.stage++;next.usedHint=false;next.revision=0;if(next.stage===14)next.status='won';}
  else if(run.mode==='challenge')next.status='lost';
  return {run:next,...result};
}
export function revealHint(run){return run.status==='playing'&&!run.usedHint?{...run,hints:run.hints+1,usedHint:true}:run;}
export function revealSolution(run){return run.mode==='standard'&&run.status==='playing'?{...run,revealed:true}:run;}
export function replaceQuestion(run){if(!run.revealed)return run;const previous=[...run.previous];previous[run.stage]=currentQuestion(run).id;return {...run,previous,revision:run.revision+1,revealed:false,usedHint:false};}
export function accuracy(run){return run.attempts?Math.round(run.correct/run.attempts*100):0;}
export function restoreRun(raw){
  try{const r=JSON.parse(raw);if(r?.version!==1||!['standard','challenge'].includes(r.mode)||!['playing','lost','won'].includes(r.status))return null;
    for(const k of ['seed','stage','correct','attempts','hints','elapsed','revision'])if(!Number.isSafeInteger(r[k])||r[k]<0)return null;
    if(r.seed>4294967295||r.stage>14||r.correct!==r.stage||r.attempts<r.correct||r.elapsed>31536000000||r.revision>100000)return null;
    if((r.status==='won')!==(r.stage===14)||r.status==='lost'&&r.mode!=='challenge')return null;
    if(r.mode==='challenge'&&(r.attempts!==r.correct+(r.status==='lost'?1:0)||r.revealed))return null;
    if(typeof r.revealed!=='boolean'||typeof r.usedHint!=='boolean'||!Array.isArray(r.previous)||r.previous.length>14||!r.previous.every(x=>x===null||typeof x==='string')||!Array.isArray(r.seen)||r.seen.length>14||!r.seen.every(x=>typeof x==='string'))return null;
    return r;
  }catch{return null;}
}
export function updateBest(best,run){
  const prior=best?.[run.mode]||{correct:0,fastest:null};
  return {...best,[run.mode]:{correct:Math.max(prior.correct||0,run.correct),fastest:run.status==='won'&&!run.hints?Math.min(prior.fastest??Infinity,run.elapsed):prior.fastest??null}};
}
export function resultText(run){return `Math Ascension · ${run.mode==='challenge'?'One-Life Challenge':'Standard'}\n${run.status==='won'?'All 14 stages complete!':`Reached ${LEVELS[Math.min(run.stage,13)]}`}\n${run.correct}/14 correct · ${accuracy(run)}% accuracy · ${run.hints} hints\n${Math.floor(run.elapsed/60000)}:${String(Math.floor(run.elapsed/1000)%60).padStart(2,'0')}\nhttps://masonwang.dev/projects/math-ascension/index.html`;}
