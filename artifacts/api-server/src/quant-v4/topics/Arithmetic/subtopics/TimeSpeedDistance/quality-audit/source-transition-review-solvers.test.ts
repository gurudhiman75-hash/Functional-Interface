import assert from "node:assert/strict";
import { rational, equals, add, multiply, modulo } from "../TSD-001/foundation/rational";
import { solveMeetingSpeedExchange, solveStationQueuedDispatch } from "./source-transition-review-solvers";
import { EDITORIAL_REVIEW_LOCK } from "./worked-calculation";
const eq=(a:ReturnType<typeof rational>,b:ReturnType<typeof rational>)=>assert.ok(equals(a,b));
// Review3 Q6–9, PDF425: pi-free lap coordinates, circumference coefficient28.
const s=solveMeetingSpeedExchange({track:rational(28),speedA:rational(3),speedB:rational(1),events:8});
assert.deepEqual(s.events.slice(0,4).map(e=>Number(e.point.numerator)/Number(e.point.denominator)),[21,14,7,0]);
eq(s.events[2]!.distanceA,rational(49)); //49pi=154 if source conventionpi22/7.
assert.equal(s.events[3]!.exchanged,false);
for(const speedA of [1,2,3,5])for(const speedB of [1,2,4]) {
 const r=solveMeetingSpeedExchange({track:rational(60),speedA:rational(speedA),speedB:rational(speedB),events:12});
 let a=rational(speedA),b=rational(-speedB),point=rational(0);
 const duration=rational(60,speedA+speedB);
 for(const e of r.events) {
  const pA=modulo(add(point,multiply(a,duration)),rational(60));
  const pB=modulo(add(point,multiply(b,duration)),rational(60));
  eq(pA,pB);eq(e.point,pA);point=pA;
  if(!equals(point,rational(0)))[a,b]=[b,a];
  eq(a,e.nextSignedSpeedA);eq(b,e.nextSignedSpeedB);
 }
}
// Taste Q16/Q17 PDF429: beginnings of1st,5th,6th,10th seconds=0,4,5,9.
const messages=[{id:"A",sentAt:rational(0),position:rational(10)},{id:"D",sentAt:rational(0),position:rational(40)},{id:"C",sentAt:rational(4),position:rational(30)},{id:"B",sentAt:rational(5),position:rational(20)},{id:"E",sentAt:rational(9),position:rational(50)}];
for(const [nearestStation,expected,notice] of [[false,140,14],[true,120,12]] as const) {
 const r=solveStationQueuedDispatch({length:rational(60),speed:rational(10),messages,nearestStation});
 const e=r.acknowledgements.find(m=>m.id==="E")!;eq(e.distanceAtNotice,rational(expected));eq(e.noticeTime,rational(notice));
 assert.deepEqual(r.trips[0]!.served,["A","D"]);
 assert.deepEqual(r.trips[1]!.served,nearestStation?["C","B"]:["B","C"]);
 for(const [key,value] of Object.entries(EDITORIAL_REVIEW_LOCK))assert.equal((r as unknown as Record<string,unknown>)[key],value);
}
assert.throws(()=>solveMeetingSpeedExchange({track:rational(1),speedA:rational(0),speedB:rational(1),events:1}));
assert.throws(()=>solveStationQueuedDispatch({length:rational(60),speed:rational(10),messages:[...messages,messages[0]!],nearestStation:false}));
for(const [key,value] of Object.entries(EDITORIAL_REVIEW_LOCK))assert.equal((s as unknown as Record<string,unknown>)[key],value);
console.log("PASS: locked speed-exchange review solver144 modular event checks; source quarter-lap progression; station-queued dispatch140/120m answers, request deferral and lifecycle locks.");
