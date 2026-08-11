import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1,
  SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2,
  buildSpatialFclFamilyScheduleV1,
  buildSpatialFclSafeQuartetCatalogV1,
  buildSpatialPrimitiveClassificationQuestionFromIdsV2,
  buildSpatialSynthesisEditorialReviewHtmlV1,
  buildSpatialSynthesisEditorialReviewV1,
  classifySpatialSceneSymmetry,
  synthesizeSpatialFanAttemptV1,
  synthesizeSpatialProductionBatchV1,
} from "../foundation/spatial";
import type { SpatialPrimitiveClassificationQuestionV2, SpatialScene } from "../foundation/spatial";

const REQUESTED_PER_CHAPTER = 96;
const fclCatalogSizes = Object.fromEntries(
  SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2.map((propertyId) => [
    propertyId,
    buildSpatialFclSafeQuartetCatalogV1(propertyId).length,
  ]),
);
for (const [propertyId, size] of Object.entries(fclCatalogSizes)) {
  assert.ok(size >= 1, `${propertyId}: strict production catalog must contain at least one content quartet; found ${size}`);
}
assert.ok(
  Object.values(fclCatalogSizes).reduce((sum, size) => sum + size, 0) >= REQUESTED_PER_CHAPTER,
  "FCL total strict content capacity must cover the production stress target.",
);

const fclSchedule = buildSpatialFclFamilyScheduleV1(REQUESTED_PER_CHAPTER);
assert.equal(fclSchedule.length, REQUESTED_PER_CHAPTER);
const expectedFclFamilyCounts = Object.fromEntries(
  SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2.map((propertyId) => [
    propertyId,
    fclSchedule.filter((entry) => entry === propertyId).length,
  ]),
);
for (const propertyId of SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2) {
  assert.ok(expectedFclFamilyCounts[propertyId] >= 1, `${propertyId}: every FCL family must be represented.`);
  assert.ok(
    expectedFclFamilyCounts[propertyId] <= fclCatalogSizes[propertyId],
    `${propertyId}: scheduled content must not exceed strict catalog capacity.`,
  );
}

const batch = synthesizeSpatialProductionBatchV1({
  seedPrefix: "SPA-FND-001-PRODUCTION-SYNTHESIS-V1-PROOF",
  requestedPerChapter: REQUESTED_PER_CHAPTER,
});

assert.equal(batch.totalAccepted, 288);
assert.equal(batch.lifecycle.permanentQlId, null);
assert.equal(batch.lifecycle.questionStudioDiscoverable, false);
assert.equal(batch.lifecycle.questionBankWritable, false);
assert.equal(batch.lifecycle.testEligible, false);
assert.equal(batch.lifecycle.publiclyPublishable, false);

const chapterCodes = ["FAN-001", "FCL-001", "FSR-001"] as const;
for (const chapterCode of chapterCodes) {
  const chapter = batch.chapters[chapterCode];
  assert.equal(chapter.accepted.length, REQUESTED_PER_CHAPTER, chapterCode);
  assert.deepEqual(chapter.correctSlotCounts, [24, 24, 24, 24], chapterCode);
  assert.equal(
    new Set(chapter.accepted.map((candidate) => candidate.contentFingerprint)).size,
    REQUESTED_PER_CHAPTER,
    `${chapterCode}: content fingerprints must be unique`,
  );
  assert.equal(
    new Set(chapter.accepted.map((candidate) => candidate.deliveryFingerprint)).size,
    REQUESTED_PER_CHAPTER,
    `${chapterCode}: delivery fingerprints must be unique`,
  );
  for (const candidate of chapter.accepted) {
    assert.equal(candidate.chapterCode, chapterCode);
    assert.equal(candidate.lifecycle.permanentQlId, null);
    assert.equal(candidate.lifecycle.questionStudioDiscoverable, false);
    assert.equal(candidate.lifecycle.questionBankWritable, false);
    assert.equal(candidate.lifecycle.testEligible, false);
    assert.equal(candidate.lifecycle.publiclyPublishable, false);
  }
  for (const attempt of chapter.attempts) {
    assert.ok(attempt.seed.length > 0);
    if (attempt.status === "REJECTED") {
      assert.ok(attempt.rejectCode.length > 0);
      assert.ok(attempt.message.length > 0);
    }
  }
}

assert.deepEqual(
  Object.values(batch.chapters["FAN-001"].familyCounts).sort((a, b) => a - b),
  [24, 24, 24, 24],
);
assert.equal(
  Object.keys(batch.chapters["FCL-001"].familyCounts).length,
  SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2.length,
);
assert.deepEqual(batch.chapters["FCL-001"].familyCounts, expectedFclFamilyCounts);
assert.equal(batch.chapters["FCL-001"].rejectionCounts.FCL_COMPETING_DESCRIPTOR ?? 0, 0);
assert.equal(batch.chapters["FCL-001"].rejectionCounts.FCL_POOL_SHORTAGE ?? 0, 0);
assert.ok(
  batch.chapters["FCL-001"].attempts.length <= 180,
  `Capacity-aware FCL synthesis must accept 96 candidates within 180 attempts; used ${batch.chapters["FCL-001"].attempts.length}.`,
);

const crossingCandidates = batch.chapters["FCL-001"].accepted.filter(
  (candidate) => candidate.familyId === "HAS_TRUE_CROSSING",
);
assert.equal(crossingCandidates.length, expectedFclFamilyCounts.HAS_TRUE_CROSSING);
for (const candidate of crossingCandidates) {
  const payload = candidate.payload as SpatialPrimitiveClassificationQuestionV2;
  for (const scene of payload.optionScenes as SpatialScene[]) {
    assert.deepEqual(
      classifySpatialSceneSymmetry(scene),
      { vertical: false, horizontal: false, rotational180: false },
      `${scene.id}: crossing production presentation must neutralize whole-figure symmetry`,
    );
    assert.equal(scene.metadata?.productionPresentation, "FCL_TRUE_CROSSING_ASYMMETRIC_ARM_V1");
  }
}

assert.equal(Object.keys(batch.chapters["FSR-001"].familyCounts).length, SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1.length);
for (const ruleId of SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1) {
  assert.ok((batch.chapters["FSR-001"].familyCounts[ruleId] ?? 0) >= 9, ruleId);
}

const replay = synthesizeSpatialProductionBatchV1({
  seedPrefix: "SPA-FND-001-PRODUCTION-SYNTHESIS-V1-PROOF",
  requestedPerChapter: 24,
});
for (const chapterCode of chapterCodes) {
  assert.deepEqual(
    replay.chapters[chapterCode].accepted.map((candidate) => candidate.contentFingerprint),
    batch.chapters[chapterCode].accepted.slice(0, 24).map((candidate) => candidate.contentFingerprint),
    `${chapterCode}: deterministic accepted replay`,
  );
  assert.deepEqual(
    replay.chapters[chapterCode].attempts.map((attempt) => ({
      status: attempt.status,
      seed: attempt.seed,
      familyId: attempt.familyId,
      rejectCode: attempt.status === "REJECTED" ? attempt.rejectCode : null,
    })),
    batch.chapters[chapterCode].attempts.slice(0, replay.chapters[chapterCode].attempts.length).map((attempt) => ({
      status: attempt.status,
      seed: attempt.seed,
      familyId: attempt.familyId,
      rejectCode: attempt.status === "REJECTED" ? attempt.rejectCode : null,
    })),
    `${chapterCode}: deterministic rejection/acceptance trace`,
  );
}

const differentSeed = synthesizeSpatialProductionBatchV1({
  seedPrefix: "SPA-FND-001-PRODUCTION-SYNTHESIS-V1-SECOND-SEED",
  requestedPerChapter: 8,
});
for (const chapterCode of chapterCodes) {
  assert.notDeepEqual(
    differentSeed.chapters[chapterCode].accepted.map((candidate) => candidate.contentFingerprint),
    batch.chapters[chapterCode].accepted.slice(0, 8).map((candidate) => candidate.contentFingerprint),
    `${chapterCode}: different seed prefix must materially alter content`,
  );
}

const reorderedA = synthesizeSpatialFanAttemptV1({
  seed: "SPA-SYNTH-ORDER-INDEPENDENCE",
  familyId: "ROTATE_90_CW",
  desiredCorrectOptionIndex: 0,
});
const reorderedB = synthesizeSpatialFanAttemptV1({
  seed: "SPA-SYNTH-ORDER-INDEPENDENCE",
  familyId: "ROTATE_90_CW",
  desiredCorrectOptionIndex: 2,
});
assert.equal(reorderedA.status, "ACCEPTED");
assert.equal(reorderedB.status, "ACCEPTED");
if (reorderedA.status === "ACCEPTED" && reorderedB.status === "ACCEPTED") {
  assert.equal(reorderedA.candidate.contentFingerprint, reorderedB.candidate.contentFingerprint);
  assert.notEqual(reorderedA.candidate.deliveryFingerprint, reorderedB.candidate.deliveryFingerprint);
}

assert.throws(
  () => buildSpatialPrimitiveClassificationQuestionFromIdsV2({
    prototypeId: "FCL-SYNTH-NEGATIVE-COMPETING-MINORITY",
    propertyId: "VERTICAL_SYMMETRY",
    primitiveIds: ["CIRCLE", "SQUARE", "T_SHAPE", "ARROW_RIGHT"],
    correctOptionIndex: 3,
  }),
  /competing visible 3-to-1 descriptor/,
);

const review = buildSpatialSynthesisEditorialReviewV1(batch);
assert.equal(review.sampleCount, 26);
assert.equal(review.samples.filter((sample) => sample.chapterCode === "FAN-001").length, 4);
assert.equal(review.samples.filter((sample) => sample.chapterCode === "FCL-001").length, 12);
assert.equal(review.samples.filter((sample) => sample.chapterCode === "FSR-001").length, 10);
const html = buildSpatialSynthesisEditorialReviewHtmlV1(review);
assert.match(html, /^<!doctype html>/);
assert.doesNotMatch(html, /<script|javascript:/i);

const digest = (value: string) => createHash("sha256").update(value).digest("hex");
const evidence = {
  version: batch.version,
  seedPrefix: batch.seedPrefix,
  requestedPerChapter: batch.requestedPerChapter,
  totalAccepted: batch.totalAccepted,
  fclCatalogSizes,
  fclScheduledFamilyCounts: expectedFclFamilyCounts,
  chapters: Object.fromEntries(chapterCodes.map((chapterCode) => {
    const chapter = batch.chapters[chapterCode];
    return [chapterCode, {
      accepted: chapter.accepted.length,
      attempts: chapter.attempts.length,
      rejectionCounts: chapter.rejectionCounts,
      correctSlotCounts: chapter.correctSlotCounts,
      familyCounts: chapter.familyCounts,
      contentDigests: chapter.accepted.map((candidate) => digest(candidate.contentFingerprint)),
      deliveryDigests: chapter.accepted.map((candidate) => digest(candidate.deliveryFingerprint)),
    }];
  })),
  checks: {
    deterministicReplay: true,
    explicitRejectedAttemptTrace: true,
    uniqueContentFingerprints: true,
    answerOrderExcludedFromContentIdentity: true,
    separateDeliveryFingerprint: true,
    balancedCorrectSlots: true,
    fullFamilyCoverage: true,
    capacityAwareFclScheduling: true,
    compiledFclSafeQuartetCatalog: true,
    fclCatalogFinalBuilderRevalidation: true,
    fclCompetingMinorityRejection: true,
    crossingPresentationNeutralizesSymmetryShortcut: true,
    efficientFclCatalogSelection: true,
    representativeEditorialReview: true,
    lifecycleIsolation: true,
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-production-synthesis-v1-review.json",
  `${JSON.stringify(review, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-production-synthesis-v1-review.html",
  html,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-production-synthesis-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify({
  status: "PASS_SPA_FND_001_PRODUCTION_SYNTHESIS_V1",
  accepted: {
    fan: batch.chapters["FAN-001"].accepted.length,
    fcl: batch.chapters["FCL-001"].accepted.length,
    fsr: batch.chapters["FSR-001"].accepted.length,
    total: batch.totalAccepted,
  },
  attempts: {
    fan: batch.chapters["FAN-001"].attempts.length,
    fcl: batch.chapters["FCL-001"].attempts.length,
    fsr: batch.chapters["FSR-001"].attempts.length,
  },
  rejectionCounts: {
    fan: batch.chapters["FAN-001"].rejectionCounts,
    fcl: batch.chapters["FCL-001"].rejectionCounts,
    fsr: batch.chapters["FSR-001"].rejectionCounts,
  },
  fclCatalogSizes,
  fclScheduledFamilyCounts: expectedFclFamilyCounts,
  correctSlots: {
    fan: batch.chapters["FAN-001"].correctSlotCounts,
    fcl: batch.chapters["FCL-001"].correctSlotCounts,
    fsr: batch.chapters["FSR-001"].correctSlotCounts,
  },
  familyCounts: {
    fan: batch.chapters["FAN-001"].familyCounts,
    fcl: batch.chapters["FCL-001"].familyCounts,
    fsr: batch.chapters["FSR-001"].familyCounts,
  },
  reviewSamples: review.sampleCount,
  checks: evidence.checks,
}, null, 2));
