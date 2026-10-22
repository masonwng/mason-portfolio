import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {LEVELS,TEMPLATES,generateQuestion,seeded} from '../public/projects/math-ascension/questions.mjs';
import {checkAnswer} from '../public/projects/math-ascension/answers.mjs';
import {newRun,currentQuestion,answerRun,revealHint,revealSolution,replaceQuestion,restoreRun,updateBest,accuracy} from '../public/projects/math-ascension/core.mjs';
test('14 stages, multiple templates, finite valid answers, and valid TeX across 4,200 questions',()=>{
 assert.equal(LEVELS.length,14);
 for(let stage=0;stage<14;stage++){
  const seen=new Set();
  for(let seed=0;seed<300;seed++){
   const q=generateQuestion(stage,seed);seen.add(q.template);
   assert.ok(q.hint&&q.steps.length);assert.equal(checkAnswer(q,q.answer).correct,true,JSON.stringify(q));
   if(q.tex)katex.renderToString(q.tex,{throwOnError:true});
   if(q.options){assert.equal(new Set(q.options.map(o=>o.text)).size,q.options.length);q.options.forEach(o=>katex.renderToString(o.text,{throwOnError:true}));}
  }
  assert.equal(seen.size,TEMPLATES[stage].length);
 }
});
test('fraction, decimal, arithmetic, polynomial, and antiderivative equivalence',()=>{
 const numeric={type:'number',answer:'1/2'};for(const s of ['0.5','2/4','(3-1)/4'])assert.equal(checkAnswer(numeric,s).correct,true);
 const q={type:'expression',answer:'2x+2'};for(const s of ['2(x+1)','2+2*x','(4x+4)/2'])assert.equal(checkAnswer(q,s).correct,true);
 assert.equal(checkAnswer(q,'2x+3').correct,false);
 assert.equal(checkAnswer({type:'expression',answer:'-x^2'},'-(x*x)').correct,true);
 assert.equal(checkAnswer({type:'integral',answer:'x^3+2x+C'},'x*x*x+2*x+13+C').correct,true);
 assert.equal(checkAnswer({type:'integral',answer:'x^3+2x+C'},'x^3+2x').valid,false);
 for(const s of ['alert(1)','1/0','x/(x-1)','x^999','NaN','Infinity','2..5'])assert.equal(checkAnswer(q,s).valid,false,s);
 assert.equal(checkAnswer(numeric,'x').valid,false);
});
test('independent numerical checks for all university template families',()=>{
 const n=(a)=>a,r=seeded(1),qs=TEMPLATES[13].map(t=>t(n,r));
 const expected=['6(2x+1)^2','3x^2+4x','1/4','-1/2','25','4','2x^3+x+C','4','0','10','2'];
 qs.forEach((q,i)=>assert.equal(checkAnswer(q,expected[i]).correct,true,q.topic));
});
test('standard progression, retry, duplicate blocking after win, and both complete runs',()=>{
 for(const mode of ['standard','challenge']){
 let run=newRun(mode,123);while(run.status==='playing'){run=answerRun(run,currentQuestion(run).answer).run;}
 assert.equal(run.status,'won');assert.equal(run.correct,14);assert.equal(run.attempts,14);assert.equal(accuracy(run),100);assert.equal(answerRun(run,'0').blocked,true);
 assert.deepEqual(restoreRun(JSON.stringify(run)),run);
 }
 let run=newRun('standard',12);run=answerRun(run,'999999').run;assert.equal(run.stage,0);assert.equal(run.attempts,1);assert.equal(run.status,'playing');
});
test('one life, invalid input, hints, and solution replacement rules',()=>{
 let run=newRun('challenge',123);assert.equal(answerRun(run,'abc').run.attempts,0);run=revealHint(run);assert.equal(run.hints,1);assert.equal(revealHint(run).hints,1);assert.equal(revealSolution(run).revealed,false);
 run=answerRun(run,'999999').run;assert.equal(run.status,'lost');assert.equal(run.attempts,1);assert.equal(answerRun(run,'2').blocked,true);
 let learn=newRun('standard',123),id=currentQuestion(learn).id;learn=revealSolution(learn);assert.equal(answerRun(learn,currentQuestion(learn).answer).blocked,true);learn=replaceQuestion(learn);assert.equal(learn.stage,0);assert.notEqual(currentQuestion(learn).id,id);
});
test('persistence rejects corrupt state, replay avoids prior question, and bests stay mode-specific',()=>{
 for(const raw of ['bad','null','{}',JSON.stringify({...newRun('standard',1),stage:20}),JSON.stringify({...newRun('challenge',1),attempts:3})])assert.equal(restoreRun(raw),null);
 const first=generateQuestion(4,42);assert.notEqual(generateQuestion(4,42,first.id).id,first.id);
 let run={...newRun('standard',1),status:'won',stage:14,correct:14,attempts:15,elapsed:12345};let best=updateBest({},run);assert.equal(best.standard.fastest,12345);assert.equal(best.challenge,undefined);
 best=updateBest(best,{...run,elapsed:1000,hints:1});assert.equal(best.standard.fastest,12345);
});
