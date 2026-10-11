import assert from "node:assert/strict";
import { TSD_CP010_HANDICAP_WORKED_REVIEW_V1 as rows } from "./handicap-worked-review-v1";
import { add,subtract,divide,type Rational } from "../../TSD-001/foundation/rational";
function eq(a:Rational,b:Rational){assert.equal(a.numerator*b.denominator,b.numerator*a.denominator);}
assert.equal(rows.length,18);
for(const row of rows){
 const i=row.input;if(i.authorityKey!=="deadHeatHandicapState")throw new Error("Wrong authority");
 const answer=row.calculations.at(-1)!.value;
 const fast=divide(i.raceDistance,i.fasterSpeed);
 if(i.mode==="DISTANCE_HANDICAP")eq(divide(subtract(i.raceDistance,answer),i.slowerSpeed),fast);
 else eq(add(answer,fast),divide(i.raceDistance,i.slowerSpeed));
 assert.equal(row.calculations.length,3);
 for(const flag of [row.contentApproved,row.frozen,row.registered,row.persistence,row.bank,row.test,row.mock,row.public])assert.equal(flag,false);
}
console.log("PASS: 18 CP010 handicap candidates; independent equal-finish identities.");
