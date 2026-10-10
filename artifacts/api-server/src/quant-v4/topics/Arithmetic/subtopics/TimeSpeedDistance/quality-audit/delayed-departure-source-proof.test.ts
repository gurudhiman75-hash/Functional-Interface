import assert from "node:assert/strict";
import { add, compare, divide, multiply, rational, subtract, type Rational } from "../TSD-001/foundation/rational";
import { solveTsdCp012 } from "../TSD-002/cp012/executable-solver";
import { solveCp004Core } from "../TSD-001/cp004/relative-motion-foundation";

const eq=(a:Rational,b:Rational)=>assert.equal(a.numerator*b.denominator,b.numerator*a.denominator);
// Arun Sharma (2018), PDF416, printed III.172, Applications Q22.
// Earlier departure 18:00, later departure 21:30, observation 04:30 next day.
const earlyTime=rational(21,2),lateTime=rational(7),delay=rational(7,2);
const gap=rational(70),speedDifference=rational(15),route=rational(800);
eq(subtract(earlyTime,lateTime),delay);
const expected=[{sign:1,early:50,late:65,earlyPosition:525,latePosition:455},
  {sign:-1,early:10,late:25,earlyPosition:105,latePosition:175}] as const;
for(const state of expected){
  // x/y are the unknown speeds. The second equation deliberately keeps
  // BOTH signs of the unsigned position difference.
  const input={authorityKey:"twoEngineInverseState" as const,
    a1:rational(-1),b1:rational(1),c1:speedDifference,
    a2:earlyTime,b2:rational(-7),c2:multiply(rational(state.sign),gap)};
  const x=solveTsdCp012({...input,target:"X"}),y=solveTsdCp012({...input,target:"Y"});
  assert.equal(x.kind,"SCALAR");assert.equal(y.kind,"SCALAR");
  if(x.kind!=="SCALAR"||y.kind!=="SCALAR")throw new Error("Expected scalar inverse speeds");
  eq(x.answer,rational(state.early));eq(y.answer,rational(state.late));
  const earlyPosition=multiply(x.answer,earlyTime),latePosition=multiply(y.answer,lateTime);
  eq(earlyPosition,rational(state.earlyPosition));eq(latePosition,rational(state.latePosition));
  eq(subtract(y.answer,x.answer),speedDifference);
  const signedDifference=subtract(earlyPosition,latePosition);
  eq(multiply(rational(state.sign),signedDifference),gap);
  for(const position of [earlyPosition,latePosition]){
    assert.ok(compare(position,rational(0))>0);
    assert.ok(compare(position,route)<0,"No endpoint stopping assumption may discard this state");
  }
  // Exercise the existing pursuit authority independently: its catch time
  // lies after the observation in one state and before it in the other.
  const catchAfterLaterStart=solveCp004Core("findDelayedStartCatchUpTime",{
    speedA:y.answer,speedB:x.answer,startDelay:delay,
  }).answer;
  eq(catchAfterLaterStart,divide(multiply(x.answer,delay),speedDifference));
  assert.equal(compare(catchAfterLaterStart,lateTime),state.sign);
}
assert.notEqual(expected[0].early,expected[1].early);
console.log("PASS: source Q22 is non-unique; 50 and 10 km/h reconstruct both signed gaps within the 800 km route; CP012 inverse and CP004 pursuit authorities agree.");
