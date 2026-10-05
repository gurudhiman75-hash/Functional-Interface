import assert from "node:assert/strict";
import { TSD_CP011_ESCALATOR_WORKED_REVIEW_V1 as rows } from "./escalator-worked-review-v1";
import { add,subtract,multiply,divide,rational,type Rational } from "../../TSD-001/foundation/rational";
function eq(a:Rational,b:Rational){assert.equal(a.numerator*b.denominator,b.numerator*a.denominator);}
assert.equal(rows.length,288);
for(const row of rows){
 const i=row.input,a=row.solution.answer;
 if(i.authorityKey==="movingSurfaceTravelState"){
  const p=i.target==="PERSON_RATE"?a:i.personRate,s=i.target==="SURFACE_RATE"?a:i.surfaceRate;
  const length=i.target==="LENGTH"?a:i.length,time=i.target==="TIME"?a:i.time;
  eq(multiply(i.direction==="SAME"?add(p,s):subtract(p,s),time),length);
 }else if(i.authorityKey==="stationaryStepCountState"){
  const p=i.target==="PERSON_RATE"?a:i.personStepRate,s=i.target==="ESCALATOR_RATE"?a:i.escalatorStepRate;
  const walked=i.target==="WALKED_STEPS"?a:i.walkedSteps,total=i.target==="TOTAL_STEPS"?a:i.totalSteps;
  eq(multiply(i.direction==="SAME"?add(p,s):subtract(p,s),divide(walked,p)),total);
 }else if(i.authorityKey==="dualEscalatorObservationState"){
  if(i.target==="STOPPED_TIME")eq(add(divide(a,i.upTime),divide(a,i.downTime)),rational(2));
  else eq(multiply(a,subtract(i.downTime,i.upTime)),add(i.downTime,i.upTime));
 }else if(i.authorityKey==="movingSurfaceStateComparison"){
  const own=i.target==="STOPPED_WALKING_TIME"?a:i.stoppedWalkingTime,surface=i.target==="CARRIED_STANDING_TIME"?a:i.carriedStandingTime;
  const combined=i.target==="COMBINED_TIME"?a:i.target==="TIME_SAVED"?subtract(i.stoppedWalkingTime,a):i.combinedTime;
  eq(add(divide(combined,own),divide(combined,surface)),rational(1));
 }else throw new Error("Wrong authority");
 for(const flag of [row.contentApproved,row.frozen,row.registered,row.persistence,row.bank,row.test,row.mock,row.public])assert.equal(flag,false);
 assert.ok(row.calculations.length>=2);
}
console.log(`PASS: ${rows.length} CP011 escalator candidates; independent motion and rate identities.`);
