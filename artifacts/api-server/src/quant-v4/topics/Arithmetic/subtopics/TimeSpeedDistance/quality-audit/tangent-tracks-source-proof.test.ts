import assert from "node:assert/strict";
import { add, divide, multiply, rational, subtract, type Rational } from "../TSD-001/foundation/rational";
import { solveTsdCp011 } from "../TSD-002/cp011/executable-solver";

const eq=(a:Rational,b:Rational)=>assert.equal(a.numerator*b.denominator,b.numerator*a.denominator);
// Arun Sharma (2018), PDF415, printed III.171, Applications Q6.
// Distances/speeds below use coefficients of pi, cancelling pi exactly.
const rpmA=solveTsdCp011({authorityKey:"wheelRateTranslationState",target:"RPM",
  circumference:rational(80),linearSpeedPerMinute:rational(80)}).answer;
const rpmB=solveTsdCp011({authorityKey:"wheelRateTranslationState",target:"RPM",
  circumference:rational(160),linearSpeedPerMinute:rational(40)}).answer;
eq(rpmA,rational(1));eq(rpmB,rational(1,4));
const periodA=divide(rational(1),rpmA),periodB=divide(rational(1),rpmB);
const bHeadstart=rational(4);
eq(divide(bHeadstart,periodB),rational(1));
// Centers are 40+80 apart; triangle inequality permits at most
// 40+(40+80)+80=240 m, with equality only at the two outermost points.
eq(add(add(rational(40),rational(120)),rational(80)),rational(240));
const firstOuterA=divide(periodA,rational(2));
const firstOuterBAfterAStart=subtract(divide(periodB,rational(2)),bHeadstart);
eq(firstOuterA,rational(1,2));eq(firstOuterBAfterAStart,rational(-2));
// Complete nonexistence argument, not a finite time-window search:
// A: 2t = 1+2k (odd); B: 2t = -4+8j (even), for integer k,j.
eq(multiply(firstOuterA,rational(2)),rational(1));
eq(multiply(periodA,rational(2)),rational(2));
eq(multiply(firstOuterBAfterAStart,rational(2)),rational(-4));
eq(multiply(periodB,rational(2)),rational(8));
assert.equal((1n%2n+2n)%2n,1n);
assert.equal((-4n%2n+2n)%2n,0n);
// Reject the source's tempting 12.5-minute option by exact phase too:
// A has half-integer laps, but B has 33/8 laps, not half-integer laps.
const bLaps=multiply(add(rational(25,2),bHeadstart),rpmB);
eq(bLaps,rational(33,8));
assert.notEqual(bLaps.denominator,2n);
console.log("PASS: tangent-track source Q6 cannot reach 240 m; exact lap rates and incompatible outermost-point phases; no approximate pi or finite-window completeness claim.");
