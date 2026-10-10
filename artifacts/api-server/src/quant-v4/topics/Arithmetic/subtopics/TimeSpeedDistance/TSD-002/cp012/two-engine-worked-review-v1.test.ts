import assert from "node:assert/strict";
import { TSD_CP012_TWO_ENGINE_WORKED_REVIEW_V1 as rows } from "./two-engine-worked-review-v1";
import { add, multiply } from "../../TSD-001/foundation/rational";
assert.ok(rows.length > 0);
for (const row of rows) {
 const input = row.input;
 if(input.authorityKey !== "twoEngineInverseState") throw new Error("Wrong authority");
 for(const [a,b,c] of [[input.a1,input.b1,input.c1],[input.a2,input.b2,input.c2]]) {
  const actual=add(multiply(a,row.speeds.x),multiply(b,row.speeds.y));
  assert.equal(actual.numerator*c.denominator,c.numerator*actual.denominator);
 }
 assert.equal(row.calculations.length,5);
 for(const flag of [row.contentApproved,row.frozen,row.registered,row.persistence,row.bank,row.test,row.mock,row.public]) assert.equal(flag,false);
}
assert.equal(new Set(rows.map(row=>row.familyId)).size*3,rows.length);
console.log(`PASS: ${rows.length} CP012 two-engine trilingual worked candidates; both original equations independently satisfied.`);
