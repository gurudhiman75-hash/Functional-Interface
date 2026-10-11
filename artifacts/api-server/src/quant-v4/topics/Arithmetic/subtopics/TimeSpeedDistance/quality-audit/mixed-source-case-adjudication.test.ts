import assert from "node:assert/strict";
import { rational as r,add,subtract,multiply,divide,compare,equals,type Rational } from "../TSD-001/foundation/rational";
import {solveCp005} from "../TSD-001/cp005/solver";
const eq=(a:Rational|undefined,b:Rational)=>assert.ok(a && equals(a,b));const sq=(a:Rational)=>multiply(a,a);
// Review1Q18/Taste31: both escape alternatives, with cat speed normalized1.
// Entry time fL, exit time(1−f)L: train traversesL in their difference.
eq(divide(r(1),subtract(r(1),multiply(r(2),r(2,5)))),r(5));
eq(divide(r(1),subtract(r(1),multiply(r(2),r(3,8)))),r(4));
// Review1Q20–21/Review3Q18–19.
const chaseTime=divide(multiply(r(60),r(1,4)),subtract(r(65),r(60)));eq(chaseTime,r(3));eq(add(r(1,4),chaseTime),r(13,4));eq(multiply(r(5),chaseTime),r(15));
// Review1Q23 stationary escalator; normalized staircase distance1.
eq(divide(r(2),add(r(1,30),r(1,90))),r(45));
// Review1Q24 uses the stipulated offsets, not actual civil time zones.
eq(subtract(r(31),r(6)),r(25));eq(multiply(r(180),r(25)),r(4500));
// No return-leg speed is supplied forQ25/Q26; do not infer return duration.
// Review2Q3 point-vs-whole-body passage.
const relativeMps=divide(multiply(r(10),r(5)),r(18));const slowLength=multiply(relativeMps,r(18));eq(slowLength,r(50));
const totalLength=multiply(divide(multiply(r(110),r(5)),r(18)),r(5));eq(subtract(totalLength,slowLength),r(925,9));
// Review2Q6 andQ13.
eq(subtract(r(60),divide(r(10),r(2))),r(55));eq(subtract(divide(r(300),r(40)),divide(r(300),r(60))),r(5,2));
// Review2Q8: choose a valid C coordinate90; first point30, second230,
// second remaining70 is half140, total300. Coordinates reconstruct both.
eq(divide(subtract(r(90),r(30)),r(2)),r(30));eq(divide(subtract(r(230),r(90)),r(2)),subtract(r(300),r(230)));eq(subtract(r(230),r(30)),r(200));
// Review2Q18–20: slower full12hours,faster6; delayed faster has travelled
//1/6route at absolute hour2. Meeting at7/18route, closer toA.
eq(divide(r(2),r(12)),r(1,6));eq(divide(subtract(r(2),r(1)),r(6)),r(1,6));eq(add(divide(r(14,3),r(12)),divide(subtract(r(14,3),r(1)),r(6))),r(1));
eq(subtract(r(12),r(6)),r(6));
// Review2Q22 normalized ship speed1; lead18,plane10.
eq(multiply(r(10),divide(r(18),subtract(r(10),r(1)))),r(20));
// Review3Q2: two positive relay time allocations satisfy both given totals
// but give different B:D ratios. Equal-leg inference is unjustified.
for(const times of [[r(1,5),r(1,5),r(1,5),r(1,5)],[r(1,4),r(1,10),r(1,4),r(1,5)]]){
 eq(times.reduce(add,r(0)),r(4,5));eq(times.reduce((d,t,i)=>add(d,multiply(t,r(15+i))),r(0)),r(66,5));
}
assert.equal(equals(divide(r(1,5),r(1,5)),divide(r(1,10),r(1,5))),false);
// Review3Q4 transitive race ratio andQ10–12 bounded route feasibility.
eq(multiply(r(100),subtract(r(1),divide(r(160),r(180)))),r(100,9));
eq(multiply(add(add(divide(r(4),r(80)),divide(r(4),r(100))),divide(r(4),r(40))),r(60)),r(57,5)); //11.4min>10
eq(divide(r(4),r(9,60)),r(80,3));
eq(divide(r(12),add(divide(r(8),r(80)),divide(r(4),r(20)))),r(40));
// Review3Q15: three train-length units600m =>express200m; platform400.
eq(multiply(divide(multiply(r(40),r(5)),r(18)),r(54)),r(600));eq(divide(r(600),divide(multiply(r(80),r(5)),r(18))),r(27));
eq(solveCp005("findReturnJourneyMeetingPoint",{routeDistance:r(27),speedA:r(7),speedB:r(5)}).value,r(45,2)); //Review3Q20:4.5km fromY
// Review3Q23–24: service interval1day, duration7days+1minute.
// Opposite departures satisfy−T<departure<T, yielding−7..7=15.
const departures=Array.from({length:19},(_,i)=>i-9).filter(d=>d>-7-1/1440&&d<7+1/1440);assert.equal(departures.length,15);
// Construct32days of both departure streams, reusing a rake only at the
// station where it has physically arrived. Zero turnaround is explicit.
const rakes:{station:"N"|"S";available:Rational}[]=[];
for(let day=0;day<32;day++)for(const station of ["N","S"] as const){
 let rake=rakes.find(a=>a.station===station && compare(a.available,r(day))<=0);
 if(!rake){rake={station,available:r(day)};rakes.push(rake);}
 rake.station=station==="N"?"S":"N";rake.available=add(r(day),r(10081,1440));
}
assert.equal(rakes.length,16);
// Taste21: Y reaches its stop at1.2h; then X reaches101.5km whileY stays
//at120km. Remaining18.5km closes at120km/h =>meeting539/4? exact:
const stopEnd=r(29,20),residual=subtract(r(120),multiply(r(70),stopEnd));eq(residual,r(37,2));
const meetingTime=add(stopEnd,divide(residual,r(120)));eq(multiply(r(70),meetingTime),r(2695,24)); //112.2917km nearest112
// Taste36: arrival times13/11 at speeds10/15 imply distance60,start07:00,
// required speed12 for noon arrival.
eq(divide(r(2),subtract(r(1,10),r(1,15))),r(60));eq(divide(r(60),r(5)),r(12));
// Taste38/88 transitive race margins.
eq(subtract(r(100),multiply(r(110),r(9,10))),r(1));eq(multiply(r(10000),subtract(r(1),sq(r(9,10)))),r(1900));
// Taste46 simultaneous catch andTaste98 staggered opposite travel.
eq(divide(multiply(r(40),r(2)),subtract(r(40),r(30))),r(8));eq(subtract(r(8),divide(multiply(r(30),r(8)),r(60))),r(4));
eq(divide(r(168),r(8,3)),r(63));eq(add(r(168),multiply(r(126),r(5,3))),r(378));
// Taste90 and104.
eq(subtract(add(divide(r(15),r(25)),divide(r(20),r(50))),divide(r(30),r(60))),r(1,2));eq(add(r(30),r(35)),r(65));
eq(divide(r(1,3),subtract(r(1,12),r(1,15))),r(20));
// LODII6/10/21 andIII4/5/6: exact geometry observations, not generic
// scalar travel placeholders. Squared relations avoid approximated radicals.
eq(multiply(r(4),add(sq(r(18)),sq(r(24)))),r(3600));
eq(add(sq(r(6)),sq(r(8))),sq(r(10)));eq(divide(r(10),r(30)),divide(r(14),r(42)));
eq(multiply(r(4),add(sq(r(40)),sq(r(30)))),r(10000));eq(add(sq(r(16)),sq(r(30))),sq(r(34)));
//III5: initial equal distances240; remaining after Arjit80 are80/160,
// satisfying the right-triangle condition long=2short at terminal angle60.
const aRemaining=subtract(r(240),multiply(r(80),divide(r(240),r(120))));eq(aRemaining,r(80));eq(subtract(r(240),r(80)),multiply(r(2),aRemaining));
//III6 under explicitly rounded20/3 condition: distances40/20,rate ratio1/3.
eq(subtract(r(40),r(30)),subtract(r(20),multiply(r(30),r(1,3))));eq(subtract(r(20),multiply(r(40),r(1,3))),r(20,3));
//III28: current-normalized u5,c1,D24; both source round trips are compatible.
eq(add(divide(r(24),r(6)),divide(r(24),r(4))),r(10));eq(add(divide(r(24),r(8)),divide(r(24),r(6))),r(7));
//III37: actual second meeting, not assumed nth head-on event.
const reflected={routeDistance:r(40),speedA:r(13,2),speedB:r(7,2)};
eq(solveCp005("findNthMeetingPointOnLine",{...reflected,nthMeeting:1}).value,r(26));eq(solveCp005("findNthMeetingPointOnLine",{...reflected,nthMeeting:2}).value,r(2));eq(solveCp005("findTimeBetweenFirstAndSecondMeetings",reflected).value,r(8));
console.log("PASS: mixed-review motion observations reconstructed, relay nonuniqueness demonstrated, route bounds and source geometry checked independently; no claim of195 executed learner-runtime answers.");
