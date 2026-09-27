import assert from "node:assert/strict";
import { auditGeoMin001OwningPoolV1 } from "./geo-min-001-owning-pool-v1";
const a=auditGeoMin001OwningPoolV1();
assert.equal(a.valid,true,a.issues.join("\n"));
assert.equal(a.stemCount,a.questionCount);
assert.equal(a.explanationCount,a.questionCount);
assert.ok(a.permanentQlCount>0);
console.log(JSON.stringify(a,null,2));
