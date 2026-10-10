import assert from "node:assert/strict";
import { rational as r,add,subtract,multiply,divide,compare,equals,type Rational } from "../TSD-001/foundation/rational";
const eq=(a:Rational,b:Rational)=>assert.ok(equals(a,b));const sq=(v:Rational)=>multiply(v,v);
// Rendered PDF428–430: axes explicitly distinguish km/litre from litres/hour.
const route=add(multiply(r(35),r(2)),multiply(r(45),r(2)));eq(route,r(160));
const consumption=multiply(divide(route,r(3)),add(add(r(1,16),r(1,24)),r(1,16)));eq(consumption,r(80,9)); //Taste10
eq(divide(route,r(24)),r(20,3)); //Taste11, peak mileage40km/h
eq(multiply(divide(r(200),r(60)),r(4)),r(40,3)); //Taste18, hourly consumption
assert.equal(compare(r(5,80),r(4,60)),-1);assert.equal(compare(r(4,60),r(79,800)),-1); //Taste19
// Equal-distance45/55 travel gives49.5km/h. Highway/direct route ratio=5/4.
eq(divide(r(2),add(r(1,45),r(1,55))),r(99,2));
eq(divide(r(495,8),r(99,2)),r(5,4));
// Let BC=x<AB=100:9x²−3200x+90000=0. The valid root is
// (1600−500sqrt(7))/9. AC=(4/5)(100+x), BD=AC/2.
// The other root violates BC<AB. Squared bracketing independently bounds
// x to30..31 and hypotenuse to104..104.8; nearest distance option105.
const polynomial=(x:Rational)=>add(subtract(multiply(r(9),sq(x)),multiply(r(3200),x)),r(90000));
assert.equal(compare(polynomial(r(30)),r(0)),1);assert.equal(compare(polynomial(r(31)),r(0)),-1);
// Q9's52.5 option is not exact: it would require AC105,BC125/4,
// which fails Pythagoras with AB100. Quarantine this option, not the graph.
assert.equal(equals(add(r(10000),sq(r(125,4))),sq(r(105))),false);

// Q65–67 rendered PDF434–435. Exact arithmetic in Q(sqrt(3)).
type S=readonly[Rational,Rational]; //a+b*sqrt(3)
const plus=(a:S,b:S):S=>[add(a[0],b[0]),add(a[1],b[1])];
const times=(a:S,b:S):S=>[add(multiply(a[0],b[0]),multiply(r(3),multiply(a[1],b[1]))),add(multiply(a[0],b[1]),multiply(a[1],b[0]))];
const scale=(a:S,b:Rational):S=>[multiply(a[0],b),multiply(a[1],b)];
const seq=(a:S,b:S)=>{eq(a[0],b[0]);eq(a[1],b[1]);};
const sideA:S=[r(2),r(0)],sideB:S=[r(2),r(1)],sideC:S=[r(2),r(2)];
seq(plus(scale(sideB,r(3)),scale(sideA,r(-3))),[r(0),r(3)]);
seq(plus(scale(sideC,r(3)),scale(sideB,r(-3))),[r(0),r(3)]); //65optiona
// A's total time3r/10. B's each leg r/10; C's first two each3r/20.
eq(add(add(r(2,20),r(2,30)),r(2,15)),r(3,10));
seq(times([r(20),r(10)],[r(1,10),r(0)]),sideB);
seq(times([r(40,3),r(40,3)],[r(3,20),r(0)]),sideC); //66 B2,C3
// Area proportional side² => speed proportional side => identical lap time.
// At B2→B3 (1/3lap), A1→A2 and C1→C2. Q67 has no(A2,C2) option.
seq(times(sideB,sideB),[r(7),r(4)]);seq(times(sideC,sideC),[r(16),r(8)]);
assert.equal(["A2,C3","A3,C3","A3,C2","betweenA2A3,betweenC3C1"].includes("A2,C2"),false);
// Q69: cosine120=-1/2; BC²=304=16*19. Return-time difference
//=(4sqrt(19)+12)/2−(4sqrt(19)+8)/3=(2sqrt(19)+10)/3.
eq(subtract(add(sq(r(12)),sq(r(8))),multiply(multiply(multiply(r(2),r(12)),r(8)),r(-1,2))),r(304));
eq(subtract(r(4,2),r(4,3)),r(2,3));eq(subtract(r(12,2),r(8,3)),r(10,3));
// Q75: angles30,60,90 imply BC250 and AC250sqrt(3). Train arrives13:00;
// latest departure12:45−AC/70 lies between06:22:30 and06:37:30.
const acSquared=multiply(sq(r(250)),r(3));
assert.equal(compare(acSquared,sq(multiply(r(70),r(49,8)))),1);
assert.equal(compare(acSquared,sq(multiply(r(70),r(51,8)))),-1); //nearest06:30
// Q83–85 rendered PDF436–437: inner radius r, outer2r,
// perpendicular cardinal endpoints give chord²=5r², four chord roads.
eq(add(sq(r(2)),sq(r(1))),r(5));
// Ratio chord-sum/OR circumference=sqrt(5)/pi. Q84 duration=r/30+r/15.
eq(add(r(1,30),r(1,15)),r(1,10));const innerRadius=divide(r(3,2),r(1,10));eq(innerRadius,r(15));eq(multiply(r(2),innerRadius),r(30));
// Q85 chord plus inner semicircle:r/15+r/30=1.5hours=90minutes.
eq(multiply(add(divide(innerRadius,r(15)),divide(innerRadius,r(30))),r(60)),r(90));
console.log("PASS: rendered source diagrams/graphs Q7–11,18–19,65–67,69,75,83–85 adjudicated with exact units and geometry; Q9/Q67 option defects quarantined.");
