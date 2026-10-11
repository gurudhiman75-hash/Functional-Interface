import assert from "node:assert/strict";
import { TSD_CP012_MOVING_SURFACE_WORKED_REVIEW_V1 as rows } from "./moving-surface-worked-review-v1";
import { add,multiply,subtract,compare } from "../../TSD-001/foundation/rational";
assert.ok(rows.length>0);
for(const row of rows){
 const i=row.input;
 if(i.authorityKey!=="movingSurfaceScheduleSynthesisState" || row.solution.kind!=="SCALAR") throw new Error("Wrong source");
 const answer=row.solution.answer;
 let distance;
 if(i.target==="UNKNOWN_ACTIVE_TIME_BEFORE_STOP") {
  assert.ok(compare(answer,i.totalTime)<=0);
  distance=add(multiply(i.personRate,i.totalTime),multiply(i.surfaceRate,answer));
 } else {
  const change=i.target==="TIME_WITH_STOP_AFTER"?i.surfaceActiveTime:i.target==="TIME_WITH_DELAYED_ACTIVATION"?i.activationDelay:i.reversalTime;
  const before=i.target==="TIME_WITH_DELAYED_ACTIVATION"?i.personRate:add(i.personRate,i.surfaceRate);
  const after=i.target==="TIME_WITH_STOP_AFTER"?i.personRate:i.target==="TIME_WITH_DELAYED_ACTIVATION"?add(i.personRate,i.surfaceRate):subtract(i.personRate,i.surfaceRate);
  distance=compare(answer,change)<=0?multiply(before,answer):add(multiply(before,change),multiply(after,subtract(answer,change)));
 }
 assert.equal(distance.numerator*i.length.denominator,i.length.numerator*distance.denominator);
 assert.ok(row.calculations.length>=2);
 assert.ok(!row.stem.includes("1 seconds"));
 for(const flag of [row.contentApproved,row.frozen,row.registered,row.persistence,row.bank,row.test,row.mock,row.public])assert.equal(flag,false);
}
assert.equal(new Set(rows.map(r=>r.familyId)).size*3,rows.length);
console.log(`PASS: ${rows.length} trilingual moving-surface candidates; independent distance reconstruction.`);
