import { strict as assert } from "node:assert";

import { COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1 } from "./com003-localization-chapter-freeze-v1";
import { COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1 } from "./com003-question-studio-pre-registration-freeze-v1";
import { COM003_QUESTION_STUDIO_READ_ONLY_PREVIEW_FREEZE_AUTHORITY_V1 } from "./com003-question-studio-read-only-preview-freeze-v1";

const authority = COM003_QUESTION_STUDIO_READ_ONLY_PREVIEW_FREEZE_AUTHORITY_V1;
assert.equal(authority.localizationFreezeAuthorityId, COM003_LOCALIZATION_CHAPTER_FREEZE_AUTHORITY_V1.authorityId);
assert.equal(authority.preRegistrationFreezeAuthorityId, COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1.authorityId);
assert.equal(authority.qlCount, 19);
assert.equal(authority.frozenEnglishQuestionCount, 228);
assert.equal(authority.frozenHindiQuestionCount, 228);
assert.equal(authority.frozenPunjabiQuestionCount, 228);
assert.equal(authority.frozenQuestionLanguageArtifactCount, 684);
assert.equal(authority.routeConnection.architecture, "QUESTION_STUDIO_REGISTRY");
assert.equal(authority.routeConnection.writeEndpointCount, 0);
assert.equal(authority.routeConnection.persistenceClientPresent, false);
assert.equal(authority.routeConnection.mountedBeforeLegacyCatchAll, true);
assert.equal(authority.routeConnection.directGlobalRouteIndexMount, false);
assert.equal(authority.routeConnection.authenticationRequired, true);
assert.equal(authority.routeConnection.requiredPermission, "content.generation.read");
assert.equal(authority.validationGate.pushRun.conclusion, "success");
assert.equal(authority.validationGate.pullRequestRun.conclusion, "success");
assert.equal(authority.validationGate.branchTopologyConclusion, "success");
assert.equal(authority.validationGate.apiBuildPassed, true);
assert.equal(authority.validationGate.englishFreezePassed, true);
assert.equal(authority.validationGate.localizationFreezePassed, true);
assert.equal(authority.validationGate.preRegistrationAdapterAuditPassed, true);
assert.equal(authority.validationGate.preRegistrationAdapterFreezePassed, true);
assert.equal(authority.validationGate.readOnlyRouteContractPassed, true);
assert.equal(authority.validationGate.issueCount, 0);
assert.equal(authority.governance.readOnlyPreviewConnected, true);
assert.equal(authority.governance.previewConnectionFrozen, true);
assert.equal(authority.governance.mutationAllowed, false);
assert.equal(authority.governance.replacementRequiresNewVersion, true);
assert.equal(authority.governance.adminPreviewAuthorized, true);
assert.equal(authority.governance.questionStudioRegistered, false);
assert.equal(authority.governance.questionStudioDiscoverable, false);
assert.equal(authority.governance.generationRunPersistenceAuthorized, false);
assert.equal(authority.governance.runtimeRegistrationAuthorized, false);
assert.equal(authority.governance.questionBankWritesAuthorized, false);
assert.equal(authority.governance.testEligibilityAuthorized, false);
assert.equal(authority.governance.automaticPublicationAuthorized, false);
assert.equal(authority.governance.productionReleased, false);

console.log("[COM003-QUESTION-STUDIO-READ-ONLY-PREVIEW-FREEZE-V1]", {
  authorityId: authority.authorityId,
  qlCount: authority.qlCount,
  languages: authority.supportedLanguages,
  artifacts: authority.frozenQuestionLanguageArtifactCount,
  endpoints: [authority.routeConnection.packageEndpoint, authority.routeConnection.previewEndpoint, authority.routeConnection.statusEndpoint],
  readOnlyPreviewConnected: authority.governance.readOnlyPreviewConnected,
  questionStudioRegistered: authority.governance.questionStudioRegistered,
  persistenceAuthorized: authority.governance.generationRunPersistenceAuthorized,
  productionReleased: authority.governance.productionReleased,
});
