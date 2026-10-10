import assert from "node:assert/strict";
import { solveCp006 } from "../TSD-001/cp006/solver";
import { rational, divide, multiply, compare, type Rational } from "../TSD-001/foundation/rational";
const eq=(a:Rational,b:Rational)=>assert.equal(a.numerator*b.denominator,b.numerator*a.denominator);
const answer=(mode:Parameters<typeof solveCp006>[0],input:Parameters<typeof solveCp006>[1])=>{
  const result=solveCp006(mode,input); assert.ok(result.value); return result.value;
};
// Arun Sharma 2018, PDF415 / III.171 Applications Q2.
const common={trackLength:rational(1),speedA:rational(12),speedB:rational(16),directionA:1 as const};
const opposite=answer("findCircularFirstMeetingTimeOppositeDirections",{...common,directionB:-1});
const same=answer("findCircularFirstMeetingTimeSameDirection",{...common,directionB:1});
eq(divide(same,opposite),rational(7));
eq(multiply(rational(16),rational(5,18)),rational(40,9)); // m/s: None of listed numeric options.
// Q5: reduced speed ratio 5:3 gives eight opposite and two same-direction points.
for(const [directionB,expected] of [[-1,8],[1,2]] as const){
  assert.equal(solveCp006("findDistinctMeetingPointCount",{trackLength:rational(1600),speedA:rational(5),speedB:rational(3),directionA:1,directionB}).count,expected);
}
eq(multiply(rational(80),rational(2,5)),rational(32));
// Literal 1.33-minute source input differs from intended 80-second period.
eq(multiply(rational(133,100),rational(60*2,5)),rational(798,25));
// Q7: direction is implicit; first same-direction overtake in third lap.
const ratios=[[11,6],[11,5],[17,8],[9,4]];
assert.deepEqual(ratios.filter(([u,v])=>{
  const t=answer("findCircularFirstMeetingTimeSameDirection",{trackLength:rational(1),speedA:rational(u!),speedB:rational(v!),directionA:1,directionB:1});
  const laps=multiply(t,rational(u!)); return compare(laps,rational(2))>0 && compare(laps,rational(3))<0;
}),[[11,6]]);
console.log("PASS: circular source Q2/Q5/Q7 matched existing CP006; source rounding caveat retained.");
