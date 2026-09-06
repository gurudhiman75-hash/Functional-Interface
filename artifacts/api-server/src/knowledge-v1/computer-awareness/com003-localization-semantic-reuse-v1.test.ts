import { strict as assert } from "node:assert";
import { COM003_LOCALIZATION_SEMANTIC_REUSE_V1 } from "./com003-localization-semantic-reuse-v1";

const a = COM003_LOCALIZATION_SEMANTIC_REUSE_V1;
assert.equal(a.valid, true, a.issues.join("\n"));
assert.equal(a.questions, 228);
assert.equal(a.perQl.length, 19);
assert.ok(a.perQl.every((q) => q.questions === 12));
assert.equal(Object.values(a.counts).reduce((x,y)=>x+y,0), 228);
console.log("[COM003-LOCALIZATION-SEMANTIC-REUSE-V1]", {
  questions: a.questions,
  counts: a.counts,
  perQl: a.perQl,
  policy: a.policy,
});
