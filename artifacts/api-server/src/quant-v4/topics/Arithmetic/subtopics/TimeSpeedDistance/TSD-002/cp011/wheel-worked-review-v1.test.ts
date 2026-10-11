import assert from "node:assert/strict";
import { TSD_CP011_WHEEL_WORKED_REVIEW_V1 as rows } from "./wheel-worked-review-v1";
import { multiply,rational } from "../../TSD-001/foundation/rational";
function equal(a:{numerator:bigint;denominator:bigint},b:{numerator:bigint;denominator:bigint}){assert.equal(a.numerator*b.denominator,b.numerator*a.denominator);}
assert.ok(rows.length>0);
for(const row of rows){
 const i=row.input,a=row.solution.answer;
 if(i.authorityKey==="wheelRollState") {
  if(i.target==="DISTANCE")equal(a,multiply(i.circumference,i.revolutions));
  else if(i.target==="REVOLUTIONS")equal(multiply(a,i.circumference),i.distance);
  else if(i.target==="CIRCUMFERENCE")equal(multiply(a,i.revolutions),i.distance);
  else equal(multiply(multiply(a,i.pi),multiply(i.revolutions,rational(i.target==="RADIUS"?2:1))),i.distance);
 } else if(i.authorityKey==="wheelRateTranslationState") {
  if(i.target==="RPM")equal(multiply(a,i.circumference),i.linearSpeedPerMinute);
  else if(i.target==="LINEAR_SPEED")equal(a,multiply(i.circumference,i.rpm));
  else if(i.target==="TIME_MINUTES")equal(multiply(a,multiply(i.circumference,i.rpm)),i.distance);
  else equal(a,multiply(i.timeMinutes,multiply(i.circumference,i.rpm)));
 } else if(i.authorityKey==="twoWheelComparisonState") {
  if(i.target==="REVOLUTION_RATIO")equal(multiply(a,i.circumferenceA),i.circumferenceB);
  else {
   const n=i.distance.numerator*(i.circumferenceB.numerator*i.circumferenceA.denominator-i.circumferenceA.numerator*i.circumferenceB.denominator);
   const d=i.distance.denominator*i.circumferenceA.numerator*i.circumferenceB.numerator;
   equal(a,{numerator:n<0n?-n:n,denominator:d});
  }
 } else throw new Error("Wrong authority");
 for(const flag of [row.contentApproved,row.frozen,row.registered,row.persistence,row.bank,row.test,row.mock,row.public])assert.equal(flag,false);
 assert.ok(row.calculations.length>0);
}
assert.equal(new Set(rows.map(r=>r.familyId)).size*3,rows.length);
console.log(`PASS: ${rows.length} CP011 wheel worked candidates; independent rolling-distance identities.`);
