import assert from "node:assert/strict";
// Source PDF415–416 / III.171–172. Independent arithmetic oracles;
// these do not grant ownership or learner-delivery approval.
// Q1: relative sum1/24 km/min, initial separation1km, track2km.
assert.deepEqual([124,184,160,204].filter(n=>[12,36].includes(n%48)),[204]);
// Q3–4: repeated endpoint reflection. Scale speeds to7 and6m/unit time.
// Folded coordinates agree iff 13t=182+364k OR t=-182+364k.
// All roots in first12 traversals are enumerated analytically, not sampled.
const events=new Set<number>();
for(let k=0;k<=12;k++) {
 const a=(182+364*k)/13,b=-182+364*k;
 if(a>0 && a<=312)events.add(a);
 if(b>0 && b<=312)events.add(b);
}
const fold=(x:number)=>{const r=((x%364)+364)%364;return r<=182?r:364-r;};
for(const time of events)assert.equal(fold(7*time),fold(182-6*time));
const inTraversal=(n:number)=>[...events].filter(t=>t>(n-1)*26 && t<n*26);
assert.deepEqual(inTraversal(8),[]); // Excluding shared traversal endpoint.
assert.deepEqual(inTraversal(12),[294]);
assert.equal(fold(7*294),126);
assert.ok(events.has(182)); // Eighth traversal starts with meeting at B.
// Q18: second/minute coincidence every60/59min. Between14:00 and16:00
// the absolute minute indices after12:00 run120..240. Inclusive =>119.
const inclusive=[];
for(let k=0;k<=236;k++)if(60*k>=120*59 && 60*k<=240*59)inclusive.push(k);
assert.equal(inclusive.length,119);
assert.equal(inclusive.filter(k=>60*k>120*59 && 60*k<240*59).length,117);
console.log("PASS: remaining source Q1 exact option, Q3/Q4 reflection roots and boundary caveat, Q18 second-hand endpoint counts; runtime ownership not inferred.");

// PDF417/420 Q23: T/4+n+13=T; n=15×5/6=12.5 =>T=34min.
const plannedRest=15*5/6,total=(plannedRest+13)*4/3;
assert.equal(total,34);
// A physically feasible stop location exists: 4.5 normal-speed minutes
// before stopping, then4 normal-speed minutes traversed at doubled speed.
assert.equal(4.5+(plannedRest+15)+4/2,total);
assert.equal(4.5+4,total/4);
// Q24: initial A distance x; B2x; after switch A4u, B2u.
// Remaining distances impose300-x =2(300-2x), hence x100, B200.
const initialA=100;
assert.equal(300-initialA,2*(300-2*initialA));
// Q25: source omits directions. Opposite direction gives2800 long arc;
// same direction gives identical points, proving missing information.
const track=4200;
const position=(n:number,relative:number)=>(15*track*n/relative)%track;
assert.equal(Math.abs(position(22,18)-position(14,18)),1400);
assert.equal(track-Math.abs(position(22,18)-position(14,18)),2800);
assert.equal(position(22,12),position(14,12));
// Q26: Tarun covers400m in120s; remaining1600m at that speed takes480s.
assert.equal(1600/(400/120),480);
console.log("PASS: Q23/Q24/Q26 source arithmetic and physical feasibility; Q25 counterexample proves omitted direction.");
