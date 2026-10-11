import assert from "node:assert/strict";
import { TSD_CP012_JOURNEY_WORKED_REVIEW_V1 as rows } from "./journey-worked-review-v1";
import { verifyTsdCp012 } from "./executable-verifier";
import { verifyTsdCp012SourceExtension } from "./source-executable-extensions";
assert.equal(rows.length,666);
for(const row of rows){
 const i=row.input;
 const extension=i.target==="EXACT_TIME_TO_DISTANCE_IN_REPEATING_CYCLE" || i.target==="DISTANCE_REMAINING_AFTER_STAGES" || i.target==="CLOSED_ROUTE_OPPOSITE_MEETING_TIME";
 let result;
 if(extension){
  assert.equal(row.solution.kind,"SCALAR");
  if(row.solution.kind!=="SCALAR" || !row.computedAnswer)throw new Error("Missing scalar");
  result=verifyTsdCp012SourceExtension(i,{...row.solution,answer:row.computedAnswer});
 }else{
  const claim=row.solution.kind==="SCALAR"?{...row.solution,answer:row.computedAnswer!}:{...row.solution,values:row.computedValues!};
  result=verifyTsdCp012(i,claim);
 }
 assert.equal(result.accepted,true,`${row.familyId}: ${result.reason}`);
 assert.ok(row.calculations.length>0);
 if(row.locale!=="en-IN")assert.ok(row.calculations.every(s=>!/[A-Za-z]/.test(s.label)));
 for(const flag of [row.contentApproved,row.frozen,row.registered,row.persistence,row.bank,row.test,row.mock,row.public])assert.equal(flag,false);
}
assert.equal(new Set(rows.map(r=>r.familyId)).size*3,rows.length);
console.log("PASS: 666 CP012 journey candidates; executable and source-extension independent verifiers.");
