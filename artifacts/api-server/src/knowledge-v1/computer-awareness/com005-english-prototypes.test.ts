import { strict as assert } from "node:assert";
import { COM005_ENGLISH_PROTOTYPES, COM005_ENGLISH_PROTOTYPE_AUDIT } from "./com005-english-prototypes";

assert.equal(COM005_ENGLISH_PROTOTYPES.length, 14);
assert.equal(COM005_ENGLISH_PROTOTYPE_AUDIT.qlCount, 7);
assert.equal(COM005_ENGLISH_PROTOTYPE_AUDIT.easyCount, 7);
assert.equal(COM005_ENGLISH_PROTOTYPE_AUDIT.mediumCount, 7);
assert.equal(COM005_ENGLISH_PROTOTYPE_AUDIT.allDirectStems, true);
assert.equal(COM005_ENGLISH_PROTOTYPE_AUDIT.allQuestionSpecificExplanations, true);
for (const q of COM005_ENGLISH_PROTOTYPES) {
  assert.equal(new Set(q.options).size, 4, q.questionId);
  assert.equal(q.options.includes(q.answer), true, q.questionId);
  assert.equal(q.stem.includes("following"), false, q.questionId);
  assert.equal(q.productionState, "ENGLISH_PROTOTYPE", q.questionId);
}
console.log("[COM005-ENGLISH-PROTOTYPES]", COM005_ENGLISH_PROTOTYPE_AUDIT);
