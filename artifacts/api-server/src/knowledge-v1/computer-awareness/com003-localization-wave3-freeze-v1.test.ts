import { strict as assert } from "node:assert";

import { COM003_LOCALIZATION_WAVE3_FREEZE_AUTHORITY_V1 } from "./com003-localization-wave3-freeze-v1";
import { COM003_HINDI_LOCALIZATION_WAVE3_V2, COM003_PUNJABI_LOCALIZATION_WAVE3_V2 } from "./com003-localization-wave3-v2";

const authority = COM003_LOCALIZATION_WAVE3_FREEZE_AUTHORITY_V1;
assert.equal(authority.governance.waveLocalizationFrozen, true);
assert.equal(authority.governance.mutationAllowed, false);
assert.equal(authority.governance.replacementRequiresNewVersion, true);
assert.equal(authority.governance.fullChapterLocalizationFrozen, false);
assert.equal(authority.governance.runtimeRegistrationAuthorized, false);
assert.equal(authority.governance.questionStudioRegistrationAuthorized, false);
assert.equal(authority.frozenHindiQuestionCount, 60);
assert.equal(authority.frozenPunjabiQuestionCount, 60);
assert.equal(authority.frozenLocalizedQuestionCount, 120);
assert.equal(authority.validationGate.semanticEditorialIssueCount, 0);
assert.equal(COM003_HINDI_LOCALIZATION_WAVE3_V2.length, 60);
assert.equal(COM003_PUNJABI_LOCALIZATION_WAVE3_V2.length, 60);
assert.equal(new Set(COM003_HINDI_LOCALIZATION_WAVE3_V2.map((item) => item.sourceQuestionId)).size, 60);
assert.equal(new Set(COM003_PUNJABI_LOCALIZATION_WAVE3_V2.map((item) => item.sourceQuestionId)).size, 60);

console.log("[COM003-LOCALIZATION-WAVE3-FREEZE-V1]", {
  authorityId: authority.authorityId,
  qlRange: authority.qlRange,
  hindi: authority.frozenHindiQuestionCount,
  punjabi: authority.frozenPunjabiQuestionCount,
  issueCount: authority.validationGate.semanticEditorialIssueCount,
  fullChapterLocalizationFrozen: authority.governance.fullChapterLocalizationFrozen,
  runtimeRegistrationAuthorized: authority.governance.runtimeRegistrationAuthorized,
});
