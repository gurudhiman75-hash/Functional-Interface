import assert from "node:assert/strict";
import { TSD_CP010_FINISH_TIME_EVIDENCE_REVIEW_V1 as rows } from "./finish-time-evidence-review-v1";
assert.equal(rows.length,18);
for(const row of rows){
 const i=row.input;if(i.authorityKey!=="finishTimeLeadState")throw new Error("Wrong authority");
 const e=row.evidence;
 // Difference in capability times scales directly with race length.
 const gapN=e.secondTime.numerator*e.firstTime.denominator-e.firstTime.numerator*e.secondTime.denominator;
 const expectedN=gapN*i.raceDistance.numerator*e.distance.denominator;
 const expectedD=e.secondTime.denominator*e.firstTime.denominator*i.raceDistance.denominator*e.distance.numerator;
 assert.equal(row.solution.answer.numerator*expectedD,expectedN*row.solution.answer.denominator);
 assert.equal(row.calculations.length,5);
 for(const flag of [row.contentApproved,row.frozen,row.registered,row.persistence,row.bank,row.test,row.mock,row.public])assert.equal(flag,false);
}
// A ratio alone allows doubled speeds and hence half the finish-time gap.
assert.ok(rows.filter(r=>r.locale==="en-IN" && /116-[DE]$/.test(r.familyId)).every(r=>r.stem.includes("take")));
console.log("PASS: 18 CP010 finish-time evidence candidates; independent capability-time scaling.");
