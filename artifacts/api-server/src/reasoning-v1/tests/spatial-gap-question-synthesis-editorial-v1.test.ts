import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  SPATIAL_GAP_IDS_V1,
  buildSpatialGapQuestionEditorialReviewHtmlV1,
  buildSpatialGapQuestionEditorialReviewV1,
  synthesizeSpatialGapQuestionBatchV1,
  validateSpatialOptionUniqueness,
  validateSpatialScene,
} from "../foundation/spatial/index";
import {
  validateLearnerVisibleExplanationV2,
  validateSpatialPerceptualOptionUniquenessV2,
} from "../foundation/spatial/gap-question-perceptual-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const REQUESTED_PER_GAP = 40;
const SEED_PREFIX = "SPA-FND-001-GAP-QUESTION-SYNTHESIS-EDITORIAL-V2";
const batch = synthesizeSpatialGapQuestionBatchV1({
  seedPrefix: SEED_PREFIX,
  requestedPerGap: REQUESTED_PER_GAP,
});

assert(SPATIAL_GAP_IDS_V1.length === 19, `Expected 19 audited gaps, got ${SPATIAL_GAP_IDS_V1.length}.`);
assert(batch.totalAccepted === 760, `Expected 760 learner questions, got ${batch.totalAccepted}.`);
assert(batch.totalAttempts >= batch.totalAccepted, "Total attempts cannot be below accepted count.");
assert(batch.totalDuplicateRejects === batch.totalAttempts - batch.totalAccepted, "Duplicate retry accounting is inconsistent.");
assert(batch.chapterCounts["FAN-001"] === 200, `Expected 200 FAN questions, got ${batch.chapterCounts["FAN-001"]}.`);
assert(batch.chapterCounts["FCL-001"] === 240, `Expected 240 FCL questions, got ${batch.chapterCounts["FCL-001"]}.`);
assert(batch.chapterCounts["FSR-001"] === 320, `Expected 320 FSR questions, got ${batch.chapterCounts["FSR-001"]}.`);
assert(batch.correctSlotCounts.every((count) => count === 190), `Global answer slots are not A190/B190/C190/D190: ${batch.correctSlotCounts.join("/")}.`);

for (const gapId of SPATIAL_GAP_IDS_V1) {
  assert(batch.gapCounts[gapId] === REQUESTED_PER_GAP, `${gapId}: expected ${REQUESTED_PER_GAP}, got ${batch.gapCounts[gapId]}.`);
  assert(batch.attemptsByGap[gapId] === batch.gapCounts[gapId] + batch.duplicateRejectsByGap[gapId], `${gapId}: attempt/reject accounting mismatch.`);
  assert(batch.correctSlotCountsByGap[gapId].every((count) => count === 10), `${gapId}: answer slots are not A10/B10/C10/D10: ${batch.correctSlotCountsByGap[gapId].join("/")}.`);
}

assert(new Set(batch.accepted.map((question) => question.contentFingerprint)).size === batch.totalAccepted, "Learner-question content fingerprints are not globally unique.");
assert(new Set(batch.accepted.map((question) => question.deliveryFingerprint)).size === batch.totalAccepted, "Learner-question delivery fingerprints are not globally unique.");

for (const question of batch.accepted) {
  assert(question.options.length === 4, `${question.prototypeId}: expected four options.`);
  assert(question.correctOptionIndex >= 0 && question.correctOptionIndex <= 3, `${question.prototypeId}: invalid correct option index.`);
  assert(question.options[question.correctOptionIndex]?.sceneFingerprint === question.solverEvidence.expectedCorrectSceneFingerprint, `${question.prototypeId}: solver correct fingerprint mismatch.`);
  assert(question.solverEvidence.optionUniquenessCheck === "PASS", `${question.prototypeId}: option uniqueness evidence failed.`);
  assert(question.solverEvidence.semanticRuleCheck === "PASS", `${question.prototypeId}: semantic rule evidence failed.`);
  assert(question.solverEvidence.chapterContractCheck === "PASS", `${question.prototypeId}: chapter contract evidence failed.`);
  assert(question.solverEvidence.runtimeAuthorityCheck === "PASS", `${question.prototypeId}: runtime authority evidence failed.`);
  assert(question.reviewMetadata.stemExamStyleCheck === "PASS", `${question.prototypeId}: stem exam-style check failed.`);
  assert(question.reviewMetadata.explanationSpecificityCheck === "PASS", `${question.prototypeId}: explanation specificity check failed.`);
  assert(question.reviewMetadata.mobileReviewStatus === "ARTIFACT_READY_HUMAN_REVIEW_PENDING", `${question.prototypeId}: mobile review was falsely promoted.`);
  assert(question.reviewMetadata.englishFreezeStatus === "HUMAN_REVIEW_PENDING", `${question.prototypeId}: English was falsely frozen.`);
  assert(question.reviewMetadata.recommendedOptionPixels >= 104, `${question.prototypeId}: learner option size floor is below 104px.`);
  assert(question.stemText.length >= 55, `${question.prototypeId}: learner stem is unexpectedly short.`);
  assert(question.learnerExplanation.observation.length >= 35, `${question.prototypeId}: observation is too generic.`);
  assert(question.learnerExplanation.rule.length >= 30, `${question.prototypeId}: rule explanation is too short.`);
  assert(question.learnerExplanation.application.length >= 25, `${question.prototypeId}: application explanation is too short.`);
  assert(/Option [A-D]/.test(question.learnerExplanation.check), `${question.prototypeId}: explanation check does not identify the delivered correct option.`);
  const explanationGate = validateLearnerVisibleExplanationV2([
    question.learnerExplanation.observation,
    question.learnerExplanation.rule,
    question.learnerExplanation.application,
    question.learnerExplanation.check,
  ]);
  assert(explanationGate.ok, `${question.prototypeId}: learner-visible explanation gate failed: ${explanationGate.errors.join(",")}.`);
  assert(!question.prototypeId.includes("-QL-"), `${question.prototypeId}: permanent QL-like identifier leaked.`);
  assert(question.lifecycle.permanentQlId === null, `${question.prototypeId}: permanent QL leaked.`);
  assert(question.lifecycle.questionStudioDiscoverable === false, `${question.prototypeId}: Question Studio discovery leaked.`);
  assert(question.lifecycle.questionBankWritable === false, `${question.prototypeId}: Question Bank write leaked.`);
  assert(question.lifecycle.testEligible === false, `${question.prototypeId}: mock-test eligibility leaked.`);
  assert(question.lifecycle.publiclyPublishable === false, `${question.prototypeId}: publication leaked.`);

  const expectedStimulusCount = question.chapterCode === "FCL-001"
    ? 0
    : question.gapId === "FSR-GAP-03" || question.gapId === "FSR-GAP-08"
      ? 4
      : 3;
  assert(question.stimulusScenes.length === expectedStimulusCount, `${question.prototypeId}: wrong stimulus count for ${question.gapId}.`);
  if (question.chapterCode === "FCL-001") {
    const vector = question.solverEvidence.propertyVector;
    assert(vector?.length === 4, `${question.prototypeId}: FCL property vector missing.`);
    assert(vector.filter(Boolean).length === 3, `${question.prototypeId}: FCL is not an exact 3-to-1 classification.`);
    assert(vector[question.correctOptionIndex] === false, `${question.prototypeId}: FCL correct option does not break the common property.`);
  } else {
    assert(question.solverEvidence.propertyVector === undefined, `${question.prototypeId}: non-FCL question unexpectedly has a classification vector.`);
  }

  for (const scene of [...question.stimulusScenes, ...question.options.map((option) => option.scene)]) {
    const validation = validateSpatialScene(scene);
    assert(validation.ok, `${question.prototypeId}/${scene.id}: scene validation failed.`);
  }
  const semanticUniqueness = validateSpatialOptionUniqueness(question.options.map((option) => option.scene));
  assert(semanticUniqueness.ok, `${question.prototypeId}: independent semantic option uniqueness validation failed.`);
  const perceptualUniqueness = validateSpatialPerceptualOptionUniquenessV2(question.options.map((option) => option.scene));
  assert(perceptualUniqueness.ok, `${question.prototypeId}: independent perceptual uniqueness failed: ${JSON.stringify(perceptualUniqueness.duplicatePairs)}.`);
}

const replay = synthesizeSpatialGapQuestionBatchV1({
  seedPrefix: SEED_PREFIX,
  requestedPerGap: REQUESTED_PER_GAP,
});
assert(
  JSON.stringify(batch.accepted.map((question) => question.deliveryFingerprint)) ===
    JSON.stringify(replay.accepted.map((question) => question.deliveryFingerprint)),
  "Deterministic learner-question replay mismatch.",
);
assert(JSON.stringify(batch.duplicateRejectsByGap) === JSON.stringify(replay.duplicateRejectsByGap), "Duplicate retry pressure is not deterministic.");

const alternate = synthesizeSpatialGapQuestionBatchV1({
  seedPrefix: `${SEED_PREFIX}-ALT`,
  requestedPerGap: 4,
});
for (const gapId of SPATIAL_GAP_IDS_V1) {
  const first = batch.accepted.filter((question) => question.gapId === gapId).slice(0, 4).map((question) => question.contentFingerprint);
  const second = alternate.accepted.filter((question) => question.gapId === gapId).map((question) => question.contentFingerprint);
  assert(JSON.stringify(first) !== JSON.stringify(second), `${gapId}: alternate seed did not change learner content.`);
}

const review = buildSpatialGapQuestionEditorialReviewV1(batch);
assert(review.sampleCount === 19, `Expected one editorial sample per gap, got ${review.sampleCount}.`);
assert(new Set(review.samples.map((sample) => sample.gapId)).size === 19, "Editorial review does not cover all 19 gaps.");
assert(review.reviewStatus === "REPRESENTATIVE_ARTIFACT_READY_HUMAN_REVIEW_PENDING", "Editorial review was falsely marked human-approved.");
assert(review.englishFreezeStatus === "HUMAN_REVIEW_PENDING", "English was falsely frozen in review artifact.");
const html = buildSpatialGapQuestionEditorialReviewHtmlV1(review);
assert(html.includes("@media(max-width:520px)"), "Editorial review is missing mobile rendering rules.");
assert(html.includes("width:104px"), "Editorial review does not enforce the 104px mobile figure floor.");
for (const gapId of SPATIAL_GAP_IDS_V1) assert(html.includes(gapId), `Editorial HTML is missing ${gapId}.`);

const outputDir = join(process.cwd(), "dist", "reasoning-v1", "spatial");
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "spa-gap-question-editorial-v2-review.json"), JSON.stringify(review, null, 2));
writeFileSync(join(outputDir, "spa-gap-question-editorial-v2-review.html"), html);
const evidence = {
  status: "PASS_SPA_FND_001_GAP_QUESTION_LEARNER_REMEDIATION_V2",
  synthesis: {
    auditedGaps: SPATIAL_GAP_IDS_V1.length,
    requestedPerGap: REQUESTED_PER_GAP,
    totalAccepted: batch.totalAccepted,
    totalAttempts: batch.totalAttempts,
    totalDuplicateRejects: batch.totalDuplicateRejects,
    duplicateRejectsByGap: batch.duplicateRejectsByGap,
    chapterCounts: batch.chapterCounts,
    correctSlotCounts: batch.correctSlotCounts,
  },
  editorial: {
    representativeSamples: review.sampleCount,
    mobileReviewStatus: review.reviewStatus,
    englishFreezeStatus: review.englishFreezeStatus,
  },
  checks: {
    exactNineteenGapCoverage: true,
    fourOptionsEveryQuestion: true,
    independentSemanticOptionUniqueness: true,
    independentPerceptualOptionUniqueness: true,
    fclCompetingCueAudit: true,
    chapterSpecificQuestionContracts: true,
    fourVisibleFramesForFsr03And08: true,
    learnerVisibleExplanations: true,
    minimumMobileFigurePixels104: true,
    deterministicReplay: true,
    deterministicDuplicateRetryPressure: true,
    alternateSeedDivergence: true,
    uniqueQuestionContent: true,
    balancedSlotsPerGap: true,
    representativeResponsiveReview: true,
    noPermanentQls: true,
    noQuestionStudioActivation: true,
    noQuestionBankWrites: true,
    noMockEligibility: true,
    noPublication: true,
    humanEnglishFreezeStillPending: true,
  },
  lifecycle: batch.lifecycle,
  nextGate: "SPATIAL_LEARNER_REMEDIATION_V2_HUMAN_REVIEW",
};
writeFileSync(join(outputDir, "spa-gap-question-learner-remediation-v2-evidence.json"), JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence, null, 2));
