import assert from "node:assert/strict";
import * as t from "../../../../../../reasoning-v1/foundation/temporal";
const q=t.exactRational;
const eq=(a:t.ExactRational,b:t.ExactRational)=>assert.ok(t.rationalsEqual(a,b),`${a.numerator}/${a.denominator} != ${b.numerator}/${b.denominator}`);
const interval=(a:number,b:number)=>t.exactTimeInterval({startSeconds:a,endSeconds:b,includeStart:true,includeEnd:false});
// PDF415–416 Applications Q9: four minute spaces =24 degrees ahead.
const q9=t.solveHourMinuteAngleEventsExact({targetAngleDeg:24,angleMode:"CLOCKWISE_MINUTE_FROM_HOUR",interval:interval(21600,25200)});
assert.equal(q9.length,1); eq(t.divideRationals(t.subtractRationals(q9[0]!.timeSeconds,21600),60),q(408,11));
// Q10: 66 actual minutes per coincidence; clock loses 240/121 minutes in 4h.
const rate=t.inferRateFromDisplayedEventIntervalExact({displayedEventIntervalSeconds:q(43200,11),observedActualIntervalSeconds:3960});
eq(rate,q(120,121));
eq(t.gainOrLossPerActualPeriodExact({rateDisplayedPerActual:rate,actualPeriodSeconds:14400}),q(-14400,121));
// Q11: gains 948 seconds in a week, initially 600 seconds behind.
const model=t.affineFaultyClockModel({actualAnchorSeconds:0,displayedAnchorSeconds:-600,rateDisplayedPerActual:t.addRationals(1,q(948,604800))});
eq(t.actualTimeWhenErrorReachesExact({model,targetErrorSeconds:0}),q(30240000,79));
// Q12: Mon10 to Fri04 =90 hours. Faulty display advances 88 hours, Fri02.
const slow=t.affineFaultyClockModel({actualAnchorSeconds:36000,displayedAnchorSeconds:36000,rateDisplayedPerActual:q(44,45)});
eq(t.displayedTimeFromActualExact(slow,36000+90*3600),q(36000+88*3600));
// Q13 coincidence; Q14 opposite hands.
eq(t.divideRationals(t.subtractRationals(t.standardEventRootsExact("COINCIDENCE",interval(14400,18000))[0]!.timeSeconds,14400),60),q(240,11));
eq(t.divideRationals(t.subtractRationals(t.standardEventRootsExact("OPPOSITION",interval(28800,32400))[0]!.timeSeconds,28800),60),q(120,11));
// Q15 displayed elapsed 555 min, rate185/180 => actual elapsed540 min,16:00.
const fast=t.affineFaultyClockModel({actualAnchorSeconds:25200,displayedAnchorSeconds:25200,rateDisplayedPerActual:q(37,36)});
eq(t.actualTimeFromDisplayedExact(fast,58500),q(57600));
assert.equal(t.eventCountExact({eventType:"RIGHT_ANGLE",interval:interval(0,86400)}),44); //Q17
assert.equal(t.eventCountExact({eventType:"STRAIGHT_LINE",interval:interval(0,86400)}),44); //Q20
// Q19: validate every printed option by both hand-angle equalities.
const options=[q(38*121+82,121),q(37*121+42,121),q(37*121+82,121),q(37*121+62,121)];
const valid=options.filter(m=>{
 const swap=t.solveHandInterchangeExact(t.addRationals(21600,t.multiplyRationals(m,60)));
 return swap.possible && t.compareRationals(swap.candidateSeconds,25200)>0 && t.compareRationals(swap.candidateSeconds,28800)<0;
});
assert.deepEqual(valid,[]); // No printed option is correct.
const correct=t.solveHandInterchangeExact(t.addRationals(21600,t.multiplyRationals(q(5400,143),60)));
assert.equal(correct.possible,true);
assert.ok(t.compareRationals(correct.candidateSeconds,25200)>0 && t.compareRationals(correct.candidateSeconds,28800)<0);
console.log("PASS: ten source clock cases Q9–15/Q17/Q19/Q20 executed through existing CLK foundations.");
