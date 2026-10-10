import assert from "node:assert/strict";
import { rational, equals, subtract, multiply, divide, compare, type Rational } from "../TSD-001/foundation/rational";
const eq=(a:Rational,b:Rational)=>assert.ok(equals(a,b));
const square=(a:Rational)=>multiply(a,a);
// These are independent algebra adjudications, not CP009 runtime coverage.
// Taste Q27: deltaT=2Dc/(u²-c²). Doubling u leaves the current unchanged.
const current=rational(8,3), bodySquared=rational(160,9), distance=rational(12);
eq(divide(multiply(multiply(rational(2),distance),current),subtract(bodySquared,square(current))),rational(6));
eq(divide(multiply(multiply(rational(2),distance),current),subtract(multiply(rational(4),bodySquared),square(current))),rational(1));
assert.equal(compare(bodySquared,square(current)),1);
// Taste Q107: total round-trip time T=2Du/(u²-c²).
// T(2u)/T(u)=2(u²-c²)/(4u²-c²)=1/4 gives u²/c²=7/4.
// PDF438 visually confirms option(b) is sqrt(7):2; extraction loses radicals.
const ratioSquared=rational(7,4);
eq(divide(multiply(rational(2),subtract(ratioSquared,rational(1))),subtract(multiply(rational(4),ratioSquared),rational(1))),rational(1,4));
assert.equal(compare(ratioSquared,rational(1)),1);
// Taste Q78: landing directly opposite requires the upstream component=-6;
// transverse speed squared=20²-6²=364, hence2sqrt(91), nearest option19.
const transverseSquared=subtract(square(rational(20)),square(rational(6)));
eq(transverseSquared,rational(364));
assert.equal(compare(transverseSquared,square(rational(75,4))),1); // midpoint18.75
assert.equal(compare(transverseSquared,square(rational(77,4))),-1); // midpoint19.25
console.log("PASS: river source Q27/Q78/Q107 exact algebra; radical option visually grounded; scalar-runtime/vector boundary retained.");
