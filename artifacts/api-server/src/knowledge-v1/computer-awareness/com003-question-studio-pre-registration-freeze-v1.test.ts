import { strict as assert } from "node:assert";

import { COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1 } from "./com003-localization-chapter-freeze-v1";
import { COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V1 } from "./com003-question-studio-pre-registration-adapter-v1";
import { COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1 } from "./com003-question-studio-pre-registration-freeze-v1";

const authority = COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1;
assert.equal(authority.localizationFreezeAuthorityId, COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.authorityId);
assert.equal(authority.capabilityId, COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V1.id);
assert.equal(authority.qlCount, 19);
assert.equal(authority.frozenEnglishQuestionCount, 228);
assert.equal(authority.frozenHindiQuestionCount, 228);
assert.equal(authority.frozenPunjabiQuestionCount, 228);
assert.equal(authority.frozenQuestionLanguageArtifactCount, 684);
assert.equal(authority.selectionContract.deterministicReplay, true);
assert.equal(authority.selectionContract.duplicateEmissionAllowed, false);
assert.equal(authority.selectionContract.mutableRegenerationAllowed, false);
assert.equal(authority.selectionContract.difficultyFilteringAuthorized, false);
assert.equal(authority.validationGate.conclusion, "success");
assert.equal(authority.validationGate.issueCount, 0);
assert.equal(authority.validationGate.directQlLanguageChecks, 57);
assert.equal(authority.validationGate.deterministicReplayChecks, 57);
assert.equal(authority.validationGate.crossLanguageParityChecks, 456);
assert.equal(authority.validationGate.exactFrozenArtifactChecks, 684);
assert.equal(authority.governance.adapterFrozen, true);
assert.equal(authority.governance.mutationAllowed, false);
assert.equal(authority.governance.replacementRequiresNewVersion, true);
assert.equal(authority.governance.questionStudioPreviewConnectionAuthorized, true);
assert.equal(authority.governance.questionStudioRegistered, false);
assert.equal(authority.governance.questionStudioDiscoverable, false);
assert.equal(authority.governance.generationRunPersistenceAuthorized, false);
assert.equal(authority.governance.runtimeRegistrationAuthorized, false);
assert.equal(authority.governance.questionBankWritesAuthorized, false);
assert.equal(authority.governance.testEligibilityAuthorized, false);
assert.equal(authority.governance.automaticPublicationAuthorized, false);
assert.equal(authority.governance.productionReleased, false);

console.log("[COM003-QUESTION-STUDIO-PRE-REGISTRATION-FREEZE-V1]", {
  authorityId: authority.authorityId,
  qlCount: authority.qlCount,
  languages: authority.supportedLanguages,
  artifacts: authority.frozenQuestionLanguageArtifactCount,
  previewConnectionAuthorized: authority.governance.questionStudioPreviewConnectionAuthorized,
  questionStudioRegistered: authority.governance.questionStudioRegistered,
  generationRunPersistenceAuthorized: authority.governance.generationRunPersistenceAuthorized,
  productionReleased: authority.governance.productionReleased,
});
