import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1,
  freezeCountingFiguresLocalizedQuestionV1,
} from "../foundation/spatial/counting-figures-localization-freeze-v1";
import { FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/counting-figures-localization-product-owner-approval-v1";
import { FCT_001_LOCALIZATION_AUTHORITY_V1 } from "../foundation/spatial/counting-figures-localization-v1";
import { FCT_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/counting-figures-english-freeze-v1";
import { generateCountingFiguresPermanentEnglishQuestionV1 } from "../foundation/spatial/counting-figures-permanent-english-runtime-v1";
import type { CountingFigureTargetShapeV1 } from "../foundation/spatial/counting-figures-production-generator-v1";

const freeze = FCT_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1;
assert.equal(FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.authorization.localizationFreezeAllowed, true);
assert.equal(FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedExactHeadSha, "a7092d82bcf3e35115f6a334342becaf13aecd4c");
assert.equal(FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedWorkflowRunId, 33228592795);
assert.equal(FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedArtifactId, 9707716522);
assert.equal(FCT_001_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V1.approvedArtifactDigest, "sha256:595dbcc625c258ab2b51301d77d6c37b203e6ff01ef646706a2b01080ddf08a0");
assert.equal(freeze.status, "FCT_001_HINDI_PUNJABI_V1_FROZEN");
assert.equal(freeze.permanentQlId, "SPA-QL-042");
assert.equal(freeze.localizationAuthorityId, FCT_001_LOCALIZATION_AUTHORITY_V1.authorityId);
assert.equal(freeze.englishFreezeAuthorityId, FCT_001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId);
assert.equal(freeze.exactReviewedLocalization.workflowRunId, 33228592795);
assert.equal(freeze.exactReviewedLocalization.artifactId, 9707716522);
assert.equal(freeze.frozenContract.reviewedEnglishQuestions, 240);
assert.equal(freeze.frozenContract.reviewedLocalizedQuestions, 480);
assert.equal(freeze.frozenContract.reviewQuestions, 28);
assert.equal(freeze.frozenContract.motifFamilyCount, 11);
assert.equal(freeze.frozenContract.targetShapeCount, 4);
assert.equal(freeze.learnerReview.desktopReadability, "PASSED");
assert.equal(freeze.learnerReview.mobile390Readability, "PASSED");
assert.equal(freeze.governance.localizationFrozen, true);
assert.equal(freeze.governance.seededQuestionStudioIntegrationAuthorized, true);
assert.equal(freeze.governance.standardQuestionStudioRegistrationAuthorized, false);
assert.equal(freeze.governance.persistenceAuthorized, false);
assert.equal(freeze.governance.questionBankWritesAuthorized, false);
assert.equal(freeze.governance.publicTestEligibilityAuthorized, false);
assert.equal(freeze.governance.automaticPublicationAuthorized, false);
assert.equal(freeze.governance.mergeAuthorized, false);
assert.equal(freeze.governance.deploymentAuthorized, false);

const TARGETS = ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"] as const satisfies readonly CountingFigureTargetShapeV1[];
let parityChecks = 0;
const frozen = [];
for (let index = 0; index < 240; index += 1) {
  const targetShape = TARGETS[index % TARGETS.length]!;
  const source = generateCountingFiguresPermanentEnglishQuestionV1({ seed: `FCT-LOC-FREEZE-${index}`, targetShape });
  for (const language of ["hi", "pa"] as const) {
    const localized = freezeCountingFiguresLocalizedQuestionV1(source, language);
    assert.equal(localized.localization.frozen, true);
    assert.equal(localized.localization.reviewOnly, false);
    assert.equal(localized.localization.freezeAuthorityId, freeze.authorityId);
    assert.equal(localized.localization.sourceEnglishContentFingerprint, source.contentFingerprint);
    assert.equal(localized.localization.sourceEnglishGeometryFingerprint, source.geometryFingerprint);
    assert.deepEqual(localized.graph, source.graph);
    assert.equal(localized.svg, source.svg);
    assert.equal(localized.targetShape, source.targetShape);
    assert.equal(localized.motifFamily, source.motifFamily);
    assert.equal(localized.structuralVariant, source.structuralVariant);
    assert.equal(localized.difficulty, source.difficulty);
    assert.deepEqual(localized.options, source.options);
    assert.equal(localized.correctCount, source.correctCount);
    assert.equal(localized.constructionExpectedCount, source.constructionExpectedCount);
    assert.equal(localized.correctIndex, source.correctIndex);
    assert.deepEqual(localized.optionEvidence, source.optionEvidence);
    assert.equal(localized.geometryFingerprint, source.geometryFingerprint);
    assert.equal(localized.structuralFingerprint, source.structuralFingerprint);
    assert.equal(localized.contentFingerprint, source.contentFingerprint);
    assert.equal(localized.stemVariant, source.stemVariant);
    assert.equal(localized.lifecycle.questionStudioRegistered, false);
    assert.equal(localized.lifecycle.persistenceAllowed, false);
    assert.equal(localized.lifecycle.questionBankWritable, false);
    assert.equal(localized.lifecycle.testEligible, false);
    assert.equal(localized.lifecycle.publiclyPublishable, false);
    assert.equal(localized.lifecycle.automaticStudentPublication, false);
    const replay = freezeCountingFiguresLocalizedQuestionV1(source, language);
    assert.deepEqual(replay, localized);
    frozen.push(localized);
    parityChecks += 17;
  }
}
assert.equal(frozen.length, 480);
assert.equal(new Set(frozen.map((q) => `${q.language}:${q.contentFingerprint}`)).size, 480);
assert.equal(new Set(frozen.map((q) => q.motifFamily)).size, 11);
assert.equal(new Set(frozen.map((q) => q.targetShape)).size, 4);
assert.equal(new Set(frozen.map((q) => q.difficulty)).size, 3);
assert.equal(new Set(frozen.map((q) => q.stemVariant)).size, 8);
assert.equal(new Set(frozen.map((q) => q.correctIndex)).size, 4);

const evidence = {
  status: "PASS_FCT_001_HI_PA_LOCALIZATION_FREEZE_V1",
  freezeAuthority: freeze.authorityId,
  localizationAuthority: freeze.localizationAuthorityId,
  englishFreezeAuthority: freeze.englishFreezeAuthorityId,
  productOwnerApprovalAuthority: freeze.productOwnerApprovalAuthorityId,
  exactReviewedLocalization: freeze.exactReviewedLocalization,
  frozenLocalizedSurfaceCount: frozen.length,
  invariantParityChecks: parityChecks,
  motifFamilyCount: new Set(frozen.map((q) => q.motifFamily)).size,
  targetShapeCount: new Set(frozen.map((q) => q.targetShape)).size,
  difficultyCount: new Set(frozen.map((q) => q.difficulty)).size,
  stemVariantCount: new Set(frozen.map((q) => q.stemVariant)).size,
  answerPositionCount: new Set(frozen.map((q) => q.correctIndex)).size,
  invariants: freeze.invariants,
  learnerReview: freeze.learnerReview,
  governance: freeze.governance,
  nextGate: freeze.nextGate,
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-fct-001-localization-freeze-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
