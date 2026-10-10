import assert from "node:assert/strict";
import { solveCp005 } from "../TSD-001/cp005/solver";
import { independentlyVerifyCp005, reflectedMeetingEvents } from "../TSD-001/cp005/verifier";
import { rational, equals, type Rational } from "../TSD-001/foundation/rational";
const eq=(a:Rational|undefined,b:Rational)=>assert.ok(a && equals(a,b));
// Counterexample to the old odd multiples of L/(u+v) only rule:
// route182, speeds5:2 has an additional same-direction catch at182/3.
const counter={routeDistance:rational(182),speedA:rational(5),speedB:rational(2),nthMeeting:2};
eq(solveCp005("findNthMeetingTimeOnLine",counter).value,rational(182,3));
assert.throws(()=>solveCp005("findEndpointRestTimeFromNextMeeting",{...counter,observedSecondMeetingTime:rational(100)}),/return legs/);
assert.throws(()=>solveCp005("findDistanceBetweenEndpointsFromRepeatedMeetings",{speedA:rational(5),speedB:rational(2),observedFirstMeetingTime:rational(26),observedSecondMeetingTime:rational(78)}),/first two/);
// Sweep exact endpoint trajectories with unequal, equal and reversed speed order.
let checks=0;
for(let u=1;u<=9;u++)for(let v=1;v<=9;v++) {
 const base={routeDistance:rational(182),speedA:rational(u),speedB:rational(v)};
 const events=reflectedMeetingEvents(base.routeDistance,base.speedA,base.speedB,12);
 const gapResult=solveCp005("findTimeBetweenFirstAndSecondMeetings",base);
 assert.equal(independentlyVerifyCp005(base,gapResult).valid,true);
 const inverseInput={speedA:base.speedA,speedB:base.speedB,observedFirstMeetingTime:events[0]!,observedSecondMeetingTime:events[1]!};
 const inverseResult=solveCp005("findDistanceBetweenEndpointsFromRepeatedMeetings",inverseInput);
 eq(inverseResult.value,base.routeDistance);
 assert.equal(independentlyVerifyCp005(inverseInput,inverseResult).valid,true);
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
// LOD I Q85 (printed III.149): the unqualified third meeting includes
// the same-direction catch at hour5. The book's312.5km counts only head-on events.
const lod85={routeDistance:rational(100),speedA:rational(50),speedB:rational(30)};
const lod85Events=reflectedMeetingEvents(lod85.routeDistance,lod85.speedA,lod85.speedB,4);
for(const [index,time] of [rational(5,4),rational(15,4),rational(5),rational(25,4)].entries())eq(lod85Events[index],time);
const lod85Third=solveCp005("findNthMeetingTimeOnLine",{...lod85,nthMeeting:3});
eq(lod85Third.value,rational(5));
assert.equal(independentlyVerifyCp005({...lod85,nthMeeting:3},lod85Third).valid,true);
eq(solveCp005("findNthMeetingPointOnLine",{...lod85,nthMeeting:3}).value,rational(50));
// At hour5 Ram has travelled250km; both positions are50km and both head towards B.
eq(solveCp005("findRepeatedMeetingCountInTimeWindow",{...lod85,timeWindow:rational(25,4)}).value,rational(4));
// LOD II Q53/Q54 use metres and seconds. Normalize to CP005's km/hour
// contract rather than silently relabelling the returned hour as a second.
const lod53={routeDistance:rational(1,10),speedA:rational(36),speedB:rational(72,5),nthMeeting:3};
eq(solveCp005("findNthMeetingTimeOnLine",lod53).value,rational(1,168)); //150/7 seconds
eq(solveCp005("findNthMeetingPointOnLine",lod53).value,rational(1,70)); //100/7 metres
assert.equal(independentlyVerifyCp005(lod53,solveCp005("findNthMeetingTimeOnLine",lod53)).valid,true);
console.log(`PASS: ${checks} reflected meeting sweep checks across81 exact speed pairs, plus LOD I Q85 source adjudication; overtakes included and endpoint duplicates removed; source Q3/Q4 reconstructed.`);

// Learner explanations must enumerate the same independent reflected events.
const { generateCp005ReviewSetV12 } = await import("../TSD-001/cp005/english-review-runtime-v12");
const { formatExamNumber } = await import("../TSD-001/cp003/generation-support");
for (const row of generateCp005ReviewSetV12(6)) {
 if (!["findNthMeetingTimeOnLine", "findNthMeetingPointOnLine", "findRepeatedMeetingCountInTimeWindow"].includes(row.solveMode)) continue;
 const input = row.input;
 const number = row.solveMode === "findRepeatedMeetingCountInTimeWindow" ? Number(row.solution.value!.numerator) + 1 : input.nthMeeting!;
 const events = reflectedMeetingEvents(input.routeDistance!, input.speedA!, input.speedB!, Math.max(2, number));
 assert.equal(row.explanation.steps[0], `t = ${events.map(formatExamNumber).join(", ")} h.`);
 assert.doesNotMatch(JSON.stringify(row.explanation), /odd multiples|odd-multiple|2n−1/);
}
console.log("CP005 worked reflected-event explanations: PASS");
