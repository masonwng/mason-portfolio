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
