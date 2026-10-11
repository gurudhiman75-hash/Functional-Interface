import assert from "node:assert/strict";
import { add, multiply, rational } from "../../TSD-001/foundation/rational";
import { solveTwoWalkerStepEvidence, TSD_CP011_TWO_WALKER_REVIEW_V1 } from "./two-walker-source-review-v1";
const fixture = solveTwoWalkerStepEvidence({ firstSteps:rational(25), secondSteps:rational(20), firstRatePart:rational(3), secondRatePart:rational(2) });
assert.deepEqual(fixture.steps, rational(50)); // Book PDF434 Q58, solution PDF445.
assert.equal(TSD_CP011_TWO_WALKER_REVIEW_V1.length,18);
for(const r of TSD_CP011_TWO_WALKER_REVIEW_V1){
 const i=r.input,s=r.solution;
 // Reconstruct each observation with physical rates, independently of the elimination formula.
 assert.deepEqual(multiply(i.firstRatePart,s.firstTime),i.firstSteps);
 assert.deepEqual(multiply(i.secondRatePart,s.secondTime),i.secondSteps);
 assert.deepEqual(multiply(add(i.firstRatePart,s.surfaceRatePart),s.firstTime),s.steps);
 assert.deepEqual(multiply(add(i.secondRatePart,s.surfaceRatePart),s.secondTime),s.steps);
 assert.equal(new Set(r.options).size,4);
 assert.equal(r.options[r.correctIndex],r.answerText);
 for(const key of ["contentApproved","frozen","registered","persistence","bank","test","mock","public"] as const)assert.equal(r[key],false);
}
assert.throws(()=>solveTwoWalkerStepEvidence({firstSteps:rational(25),secondSteps:rational(20),firstRatePart:rational(3),secondRatePart:rational(3)}));
assert.throws(()=>solveTwoWalkerStepEvidence({firstSteps:rational(25),secondSteps:rational(30),firstRatePart:rational(3),secondRatePart:rational(2)}));
console.log("PASS: two-walker source gap candidate; 18 trilingual rows; independent observation reconstruction; invalid observations rejected; release locks retained.");
