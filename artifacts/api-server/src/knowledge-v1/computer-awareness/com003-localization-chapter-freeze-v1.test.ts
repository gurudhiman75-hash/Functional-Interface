import { strict as assert } from "node:assert";

import { COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1 } from "./com003-localization-chapter-freeze-v1";
import { COM003_LOCALIZATION_WAVE1_FREEZE_AUTHORITY_V1 } from "./com003-localization-wave1-freeze-v1";
import { COM003_LOCALIZATION_WAVE2_FREEZE_AUTHORITY_V1 } from "./com003-localization-wave2-freeze-v1";
import { COM003_LOCALIZATION_WAVE3_FREEZE_AUTHORITY_V1 } from "./com003-localization-wave3-freeze-v1";
import { COM003_LOCALIZATION_WAVE4_FREEZE_AUTHORITY_V1 } from "./com003-localization-wave4-freeze-v1";
import { COM003_HINDI_LOCALIZATION_WAVE1_V3, COM003_PUNJABI_LOCALIZATION_WAVE1_V3 } from "./com003-localization-wave1-v3";
import { COM003_HINDI_LOCALIZATION_WAVE2_V3, COM003_PUNJABI_LOCALIZATION_WAVE2_V3 } from "./com003-localization-wave2-v3";
import { COM003_HINDI_LOCALIZATION_WAVE3_V2, COM003_PUNJABI_LOCALIZATION_WAVE3_V2 } from "./com003-localization-wave3-v2";
import { COM003_HINDI_LOCALIZATION_WAVE4_V2, COM003_PUNJABI_LOCALIZATION_WAVE4_V2 } from "./com003-localization-wave4-v2";

const authority = COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1;
const hindi = [
  ...COM003_HINDI_LOCALIZATION_WAVE1_V3,
  ...COM003_HINDI_LOCALIZATION_WAVE2_V3,
  ...COM003_HINDI_LOCALIZATION_WAVE3_V2,
  ...COM003_HINDI_LOCALIZATION_WAVE4_V2,
];
const punjabi = [
  ...COM003_PUNJABI_LOCALIZATION_WAVE1_V3,
  ...COM003_PUNJABI_LOCALIZATION_WAVE2_V3,
  ...COM003_PUNJABI_LOCALIZATION_WAVE3_V2,
  ...COM003_PUNJABI_LOCALIZATION_WAVE4_V2,
];
const expectedQlIds = Array.from({ length: 19 }, (_, index) => `COM-003-QL-${String(index + 1).padStart(3, "0")}`);

for (const wave of [
  COM003_LOCALIZATION_WAVE1_FREEZE_AUTHORITY_V1,
  COM003_LOCALIZATION_WAVE2_FREEZE_AUTHORITY_V1,
  COM003_LOCALIZATION_WAVE3_FREEZE_AUTHORITY_V1,
  COM003_LOCALIZATION_WAVE4_FREEZE_AUTHORITY_V1,
]) {
  assert.equal(wave.governance.waveLocalizationFrozen, true);
  assert.equal(wave.governance.mutationAllowed, false);
}

assert.equal(hindi.length, 228);
assert.equal(punjabi.length, 228);
assert.equal(new Set(hindi.map((item) => item.sourceQuestionId)).size, 228);
assert.equal(new Set(punjabi.map((item) => item.sourceQuestionId)).size, 228);
assert.deepEqual([...new Set(hindi.map((item) => item.qlId))].sort(), expectedQlIds);
assert.deepEqual([...new Set(punjabi.map((item) => item.qlId))].sort(), expectedQlIds);
assert.deepEqual([...new Set(hindi.map((item) => item.sourceQuestionId))].sort(), [...new Set(punjabi.map((item) => item.sourceQuestionId))].sort());
assert.equal(authority.frozenEnglishQuestionCount, 228);
assert.equal(authority.frozenHindiQuestionCount, 228);
assert.equal(authority.frozenPunjabiQuestionCount, 228);
assert.equal(authority.frozenLocalizedQuestionCount, 456);
assert.equal(authority.frozenQuestionLanguageArtifactCount, 684);
assert.equal(authority.qlCount, 19);
assert.equal(authority.validationGate.semanticEditorialIssueCount, 0);
assert.equal(authority.governance.englishFrozen, true);
assert.equal(authority.governance.localizationFrozen, true);
assert.equal(authority.governance.fullChapterLocalizationFrozen, true);
assert.equal(authority.governance.mutationAllowed, false);
assert.equal(authority.governance.localizationAuthoringAuthorized, false);
assert.equal(authority.governance.questionStudioRegistrationGateAuthorized, true);
assert.equal(authority.governance.questionStudioRegistered, false);
assert.equal(authority.governance.runtimeRegistrationAuthorized, false);
assert.equal(authority.governance.questionBankWritesAuthorized, false);
assert.equal(authority.governance.testEligibilityAuthorized, false);
assert.equal(authority.governance.automaticPublicationAuthorized, false);
assert.equal(authority.governance.productionReleased, false);

console.log("[COM003-LOCALIZATION-CHAPTER-FREEZE-V1]", {
  authorityId: authority.authorityId,
  qlCount: authority.qlCount,
  english: authority.frozenEnglishQuestionCount,
  hindi: authority.frozenHindiQuestionCount,
  punjabi: authority.frozenPunjabiQuestionCount,
  localized: authority.frozenLocalizedQuestionCount,
  questionLanguageArtifacts: authority.frozenQuestionLanguageArtifactCount,
  questionStudioRegistrationGateAuthorized: authority.governance.questionStudioRegistrationGateAuthorized,
  runtimeRegistrationAuthorized: authority.governance.runtimeRegistrationAuthorized,
});
