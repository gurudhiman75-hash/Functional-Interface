import { strict as assert } from "node:assert";
import { COM005_ENGLISH_REVIEW_CANDIDATE, COM005_ENGLISH_REVIEW_AUDIT } from "./com005-english-review-candidate-v1";

assert.equal(COM005_ENGLISH_REVIEW_AUDIT.questionCount, 84);
assert.equal(COM005_ENGLISH_REVIEW_AUDIT.qlCount, 7);
assert.equal(COM005_ENGLISH_REVIEW_AUDIT.allQlCounts, true);
assert.equal(COM005_ENGLISH_REVIEW_AUDIT.easyCount, 42);
assert.equal(COM005_ENGLISH_REVIEW_AUDIT.mediumCount, 42);
assert.equal(COM005_ENGLISH_REVIEW_AUDIT.directStems, true);
assert.equal(COM005_ENGLISH_REVIEW_AUDIT.simpleExplanations, true);
assert.equal(COM005_ENGLISH_REVIEW_AUDIT.fourOptions, true);
assert.equal(COM005_ENGLISH_REVIEW_AUDIT.answerIntegrity, true);
console.log("[COM005-ENGLISH-REVIEW]", COM005_ENGLISH_REVIEW_AUDIT);
