import assert from "node:assert/strict";
import { solveCp005 } from "../TSD-001/cp005/solver";
import { independentlyVerifyCp005, reflectedMeetingEvents } from "../TSD-001/cp005/verifier";
import { rational, equals, type Rational } from "../TSD-001/foundation/rational";
const eq=(a:Rational|undefined,b:Rational)=>assert.ok(a && equals(a,b));
// Counterexample to the old odd multiples of L/(u+v) only rule:
// route182, speeds5:2 has an additional same-direction catch at182/3.
const counter={routeDistance:rational(182),speedA:rational(5),speedB:rational(2),nthMeeting:2};
eq(solveCp005("findNthMeetingTimeOnLine",counter).value,rational(182,3));
// Sweep exact endpoint trajectories with unequal, equal and reversed speed order.
let checks=0;
for(let u=1;u<=9;u++)for(let v=1;v<=9;v++) {
 const base={routeDistance:rational(182),speedA:rational(u),speedB:rational(v)};
 const events=reflectedMeetingEvents(base.routeDistance,base.speedA,base.speedB,12);
 for(let n=1;n<=12;n++)for(const mode of ["findNthMeetingTimeOnLine","findNthMeetingPointOnLine","reconstructCompleteLinearItinerary"] as const) {
  const input={...base,nthMeeting:n}; const result=solveCp005(mode,input);
  assert.equal(independentlyVerifyCp005(input,result).valid,true,`${u}:${v} ${mode} ${n}`);
  if(mode==="findNthMeetingTimeOnLine")eq(result.value,events[n-1]!);
  checks++;
 }
 const input={...base,timeWindow:rational(182)};
 const result=solveCp005("findRepeatedMeetingCountInTimeWindow",input);
 assert.equal(independentlyVerifyCp005(input,result).valid,true);
 checks++;
}
// Actual source7:6: seventh event is the start-of-eighth-traversal endpoint;
// eleventh event falls in traversal12 and is126m from A.
const source={routeDistance:rational(182),speedA:rational(7),speedB:rational(6)};
eq(solveCp005("findNthMeetingTimeOnLine",{...source,nthMeeting:7}).value,rational(182));
eq(solveCp005("findNthMeetingTimeOnLine",{...source,nthMeeting:11}).value,rational(294));
eq(solveCp005("findNthMeetingPointOnLine",{...source,nthMeeting:11}).value,rational(126));
console.log(`PASS: ${checks} reflected meeting checks across81 exact speed pairs; overtakes included and endpoint duplicates removed; source Q3/Q4 reconstructed.`);
