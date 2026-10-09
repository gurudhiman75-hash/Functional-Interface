import assert from "node:assert/strict";
import { TSD_CP010_RACE_EVIDENCE_WORKED_REVIEW_V1 as rows } from "./race-evidence-worked-review-v1";
import { add,subtract,multiply,divide,rational,type Rational } from "../../TSD-001/foundation/rational";
function eq(a:Rational,b:Rational){assert.equal(a.numerator*b.denominator,b.numerator*a.denominator);}
assert.equal(rows.length,72);
for(const row of rows){
 const i=row.input,a=row.calculations.at(-1)!.value;
 if(i.authorityKey==="finishDistanceLeadState"){
  const lead=i.target==="DISTANCE_LEAD"?a:multiply(i.raceDistance,divide(a,rational(100)));
  eq(divide(subtract(i.raceDistance,lead),i.loserSpeed),divide(i.raceDistance,i.winnerSpeed));
 }else if(i.authorityKey==="raceSpeedRatioState"){
  if(i.mode==="DISTANCE_LEAD")eq(multiply(a,subtract(i.raceDistance,i.distanceLead)),i.raceDistance);
  else eq(multiply(a,i.winnerTime),add(i.winnerTime,i.timeLead));
 }else if(i.authorityKey==="raceLengthFromLeadEvidence"){
  if(i.mode==="DISTANCE_LEAD")eq(divide(subtract(a,i.distanceLead),i.loserSpeed),divide(a,i.winnerSpeed));
  else eq(subtract(divide(a,i.loserSpeed),divide(a,i.winnerSpeed)),i.timeLead);
 }else if(i.authorityKey==="leadConversionState"){
  if(i.mode==="DISTANCE_TO_TIME")eq(multiply(a,i.loserSpeed),i.distanceLead!);
  else eq(divide(a,i.loserSpeed),i.timeLead!);
 }else throw new Error("Wrong authority");
 for(const flag of [row.contentApproved,row.frozen,row.registered,row.persistence,row.bank,row.test,row.mock,row.public])assert.equal(flag,false);
}
assert.equal(new Set(rows.map(r=>r.familyId)).size*3,rows.length);
console.log("PASS: 72 CP010 race-evidence candidates; independent finishing-time and lead identities.");
