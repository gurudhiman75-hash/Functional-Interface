import { strict as assert } from "node:assert";
import { COM003_ENGLISH_FREEZE_AUTHORITY_V2 } from "./com003-english-freeze-v2";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2, auditCom003V162 } from "./com003-review-synthesis-v16-2";

const authority = COM003_ENGLISH_FREEZE_AUTHORITY_V2;
const audit = auditCom003V162();

assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(authority.authorityId, "COM-003-ENGLISH-FREEZE-V2");
assert.equal(authority.sourceGeneratorVersion, "COM003_ENGLISH_REVIEW_CORPUS_V16_2");
assert.equal(authority.frozenQuestionCount, 228);
assert.equal(authority.permanentQlIds.length, 19);
assert.equal(authority.perQl.length, 19);
assert.ok(authority.perQl.every((row) => row.questionCount === 12));
assert.ok(authority.perQl.every((row) => row.uniqueStemCount === 12));
assert.ok(authority.perQl.every((row) => row.uniqueExplanationCount >= 4));
for (const qlId of ["COM-003-QL-011", "COM-003-QL-014", "COM-003-QL-017", "COM-003-QL-019"]) {
  assert.equal(authority.perQl.find((row) => row.qlId === qlId)?.uniqueExplanationCount, 12, qlId);
}
assert.equal(new Set(COM003_ENGLISH_REVIEW_CORPUS_V16_2.map((q) => q.questionId)).size, 228);
assert.equal(authority.governance.hindiPunjabiLocalizationV2Authorized, true);
assert.equal(authority.governance.legacyV4LocalizationDirectReuseAuthorized, false);
assert.equal(authority.governance.questionStudioV16_2PromotionAuthorized, false);
assert.equal(authority.governance.questionBankWritesAuthorized, false);
assert.equal(authority.governance.testEligibilityAuthorized, false);
assert.equal(authority.governance.automaticPublicationAuthorized, false);

console.log("[COM003-ENGLISH-FREEZE-V2]", {
  authorityId: authority.authorityId,
  questions: authority.frozenQuestionCount,
  qls: authority.permanentQlIds.length,
  localizationV2Authorized: authority.governance.hindiPunjabiLocalizationV2Authorized,
  questionStudioPromotionAuthorized: authority.governance.questionStudioV16_2PromotionAuthorized,
});
