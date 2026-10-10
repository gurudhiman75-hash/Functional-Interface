import assert from "node:assert/strict";
import { TSD_CP012_SLOWDOWN_OBSERVATIONS_REVIEW_V1 as rows, solveSlowdownObservations } from "./slowdown-observations-source-review-v1";
import { add, divide, multiply, rational, subtract, type Rational } from "../../TSD-001/foundation/rational";
const eq=(a:Rational,b:Rational)=>assert.equal(a.numerator*b.denominator,b.numerator*a.denominator);
assert.equal(rows.length,18);
for(const row of rows){
 const {speed,distance}=row.solution, k=row.input.speedFraction;
 for(const [point,delay] of [[row.input.firstPoint,row.input.firstDelay],[row.input.secondPoint,row.input.secondDelay]]){
  // Independently reconstruct full journeys, rather than reusing inverse equations.
  const actual=add(divide(point,speed),divide(subtract(distance,point),multiply(speed,k)));
  eq(subtract(actual,divide(distance,speed)),delay);
 }
 assert.equal(row.options.length,4); assert.equal(new Set(row.options).size,4);
 assert.equal(row.options[row.correctIndex],row.answerText);
 assert.equal(row.optionMisconceptionIds[row.correctIndex],null);
 assert.equal(row.explanation.steps.length,4);
 for(const flag of [row.contentApproved,row.frozen,row.registered,row.persistence,row.bank,row.test,row.mock,row.public])assert.equal(flag,false);
}
eq(rows[0].solution.speed,rational(20));eq(rows[0].solution.distance,rational(78));
const base=rows[0].input;
for(const bad of [{...base,speedFraction:rational(1)}, {...base,secondPoint:base.firstPoint}, {...base,secondDelay:base.firstDelay}, {...base,secondDelay:rational(0)}])assert.throws(()=>solveSlowdownObservations(bad));
console.log("PASS: 18 trilingual slowdown-observation candidates; both complete journeys independently reconstructed; existing CP012 coupled solver reused; release locks preserved.");
