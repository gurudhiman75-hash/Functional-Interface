import { strict as assert } from "node:assert";

import { COM003_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com003-english-freeze-v1";
import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";

assert.equal(COM003_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen, true);
assert.equal(COM003_ENGLISH_FREEZE_AUTHORITY_V1.governance.hindiPunjabiLocalizationAuthorized, true);
assert.equal(COM003_ENGLISH_FREEZE_AUTHORITY_V1.governance.runtimeRegistrationAuthorized, false);
assert.equal(COM003_ENGLISH_FREEZE_AUTHORITY_V1.governance.questionStudioRegistrationAuthorized, false);
assert.equal(COM003_ENGLISH_FREEZE_AUTHORITY_V1.frozenQuestionCount, 228);
assert.equal(COM003_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds.length, 19);
assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V4.length, 228);
assert.equal(new Set(COM003_ENGLISH_REVIEW_CORPUS_V4.map((question) => question.questionId)).size, 228);
assert.equal(new Set(COM003_ENGLISH_REVIEW_CORPUS_V4.map((question) => question.qlId)).size, 19);
for (const qlId of COM003_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds) {
  assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V4.filter((question) => question.qlId === qlId).length, 12, `${qlId} must retain 12 frozen English review questions`);
}
for (const question of COM003_ENGLISH_REVIEW_CORPUS_V4) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  assert.equal(question.sourceIds.length > 0, true);
  assert.equal(question.sourceFactIds.length > 0, true);
}

console.log("[COM003-ENGLISH-FREEZE-V1]", {
  authorityId: COM003_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  questionCount: COM003_ENGLISH_REVIEW_CORPUS_V4.length,
  qlCount: COM003_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds.length,
  localizationAuthorized: COM003_ENGLISH_FREEZE_AUTHORITY_V1.governance.hindiPunjabiLocalizationAuthorized,
  runtimeRegistrationAuthorized: COM003_ENGLISH_FREEZE_AUTHORITY_V1.governance.runtimeRegistrationAuthorized,
});
