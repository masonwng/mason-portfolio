import test from 'node:test';
import assert from 'node:assert/strict';
import {advancePig,trackPoint,TRACK_LENGTH,FINISH} from '../app/lib/piggy-track.ts';

test('pigs wait for input, then coast and accelerate downhill',()=>{
 assert.deepEqual(advancePig(-.35,0,1/60),{distance:-.35,velocity:0});
 const pushed=advancePig(-.35,1.05,1/60);
 assert.ok(pushed.distance>-.35 && pushed.velocity>0);
 assert.ok(advancePig(1,1,1/60).velocity>1);
 assert.ok(advancePig(TRACK_LENGTH+.5,1,1/60).velocity<1);
});
test('spiral is continuous at deck and mud and ends inside its basin',()=>{
 for(const boundary of [0,TRACK_LENGTH]){
  const a=trackPoint(boundary-.0001), b=trackPoint(boundary+.0001);
  assert.ok(Math.hypot(...a.map((v,i)=>v-b[i]))<.001);
 }
 assert.ok(trackPoint(FINISH)[2]<1.6);
});
test('two pushes carry the last pig to the mud at different frame rates',()=>{
 for(const hz of [30,60,120]){
  let state={distance:-1.45,velocity:2.1};
  for(let i=0;i<hz*20;i++)state=advancePig(state.distance,state.velocity,1/hz);
  assert.ok(state.distance>=TRACK_LENGTH+.25);
  assert.ok(state.distance<=FINISH);
  assert.ok(state.velocity<.001);
 }
});

test('a faster rear pig transfers momentum without overlapping the front pig',async()=>{
 const {resolvePigContacts,PIG_SPACING}=await import('../app/lib/piggy-track.ts');
 const front={distance:1,velocity:0,bump:0},rear={distance:.5,velocity:2,bump:0};
 resolvePigContacts([rear,front]);
 assert.ok(front.velocity>0);assert.ok(rear.velocity<2);
 assert.ok(front.distance-rear.distance>=PIG_SPACING-1e-9);
 assert.ok(front.velocity**2+rear.velocity**2<=4);
});
test('repeated pushes keep all three pigs separated through the spiral and mud',async()=>{
 const {PigSimulation,PIG_SPACING}=await import('../app/lib/piggy-track.ts');
 const sim=new PigSimulation(3);
 for(let tick=0;tick<2400;tick++){
  if(tick<600&&tick%30===0)sim.push(2);
  sim.step(1/120);
  const ordered=[...sim.pigs].sort((a,b)=>b.distance-a.distance);
  for(let i=1;i<ordered.length;i++)assert.ok(ordered[i-1].distance-ordered[i].distance>=PIG_SPACING-1e-9);
 }
 assert.ok(sim.pigs.every(p=>p.arrived));
 const before=sim.pigs.map(p=>p.distance);sim.step(0);assert.deepEqual(sim.pigs.map(p=>p.distance),before);
});
