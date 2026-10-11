import assert from "node:assert/strict";
import { add, divide, multiply, rational, subtract, type Rational } from "../../TSD-001/foundation/rational";
import { solveTimeHeadstartObservations, TSD_CP010_TIME_HEADSTARTS_REVIEW_V1 as rows } from "./time-headstarts-source-review-v1";

const eq = (a:Rational,b:Rational) => assert.equal(a.numerator*b.denominator,b.numerator*a.denominator);
assert.equal(rows.length,18);
for (const row of rows) {
  const { fasterSpeed, slowerSpeed } = row.solution;
  const finish = divide(row.input.raceDistance,fasterSpeed);
  // Reconstruct both races on a common clock beginning when B starts.
  const firstB = multiply(slowerSpeed,add(finish,row.input.firstHeadstart));
  const secondB = multiply(slowerSpeed,add(finish,row.input.secondHeadstart));
  eq(firstB,subtract(row.input.raceDistance,row.input.firstDistanceLead));
  eq(secondB,row.input.raceDistance);
  eq(multiply(fasterSpeed,finish),row.input.raceDistance);
  assert.equal(row.options.length,4);
  assert.equal(new Set(row.options).size,4);
  assert.equal(row.options[row.correctIndex],row.answerText);
  assert.equal(row.optionMisconceptionIds[row.correctIndex],null);
  assert.equal(row.explanation.steps.length,5);
  for (const flag of [row.contentApproved,row.frozen,row.registered,row.persistence,row.bank,row.test,row.mock,row.public]) assert.equal(flag,false);
}
eq(rows[0].solution.slowerSpeed,rational(10));
eq(rows[0].solution.fasterSpeed,rational(50,3));
eq(rows[0].solution.fasterFinishTime,rational(120));
const base=rows[0].input;
for (const bad of [
  {...base,firstHeadstart:rational(-1)}, {...base,secondHeadstart:base.firstHeadstart},
  {...base,firstDistanceLead:rational(0)}, {...base,firstDistanceLead:base.raceDistance},
  {...base,raceDistance:rational(200),firstDistanceLead:rational(100)},
]) assert.throws(()=>solveTimeHeadstartObservations(bad));
console.log("PASS: 18 locked trilingual time-headstart candidates; both race outcomes independently reconstructed; source answer 50/3 m/s.");
