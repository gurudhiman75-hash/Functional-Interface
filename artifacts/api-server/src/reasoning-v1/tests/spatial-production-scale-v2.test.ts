import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  SPATIAL_FAN_SYNTHESIS_TRANSFORM_IDS_V1,
  SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1,
  SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2,
  auditSpatialFclInstanceQuartetV2,
  buildSpatialScaleEditorialReviewHtmlV2,
  buildSpatialScaleEditorialReviewV2,
  spatialFclInstanceCatalogCapacityV2,
  synthesizeSpatialProductionScaleBatchV2,
  type SpatialFclInstanceQuestionV2,
  type SpatialFclInstanceQuartetV2,
} from "../foundation/spatial/index";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const REQUESTED_PER_CHAPTER = 500;
const seedPrefix = "SPA-FND-001-PRODUCTION-SCALE-V2-PROOF";
const batch = synthesizeSpatialProductionScaleBatchV2({
  seedPrefix,
  requestedPerChapter: REQUESTED_PER_CHAPTER,
  maxAttemptsPerChapter: 20_000,
});

assert(batch.totalAccepted === 1_500, `Expected 1500 total candidates, got ${batch.totalAccepted}.`);
assert(batch.fclCanonicalCatalogCapacity > 0, "Canonical FCL capacity must be positive.");
assert(batch.fclInstanceCatalogCapacity >= REQUESTED_PER_CHAPTER, `Instance FCL capacity ${batch.fclInstanceCatalogCapacity} is below scale target ${REQUESTED_PER_CHAPTER}.`);
assert(batch.fclInstanceCatalogCapacity > batch.fclCanonicalCatalogCapacity, "Instance FCL catalog did not expand beyond canonical capacity.");

const expectedFamilies = {
  "FAN-001": SPATIAL_FAN_SYNTHESIS_TRANSFORM_IDS_V1,
  "FCL-001": SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2,
  "FSR-001": SPATIAL_FSR_SYNTHESIS_RULE_IDS_V1,
} as const;

for (const chapterCode of ["FAN-001", "FCL-001", "FSR-001"] as const) {
  const chapter = batch.chapters[chapterCode];
  assert(chapter.accepted.length === REQUESTED_PER_CHAPTER, `${chapterCode}: wrong accepted count.`);
  assert(new Set(chapter.accepted.map((candidate) => candidate.contentFingerprint)).size === REQUESTED_PER_CHAPTER, `${chapterCode}: duplicate content fingerprints.`);
  assert(chapter.correctSlotCounts.every((count) => count === 125), `${chapterCode}: answer slots are not A125/B125/C125/D125: ${chapter.correctSlotCounts.join("/")}.`);
  for (const familyId of expectedFamilies[chapterCode]) {
    assert((chapter.familyCounts[familyId] ?? 0) > 0, `${chapterCode}: family '${familyId}' is missing from scale batch.`);
  }
  for (const candidate of chapter.accepted) {
    assert(candidate.lifecycle.permanentQlId === null, `${chapterCode}: permanent QL leaked.`);
    assert(candidate.lifecycle.questionStudioDiscoverable === false, `${chapterCode}: Question Studio discovery leaked.`);
    assert(candidate.lifecycle.questionBankWritable === false, `${chapterCode}: Question Bank write leaked.`);
    assert(candidate.lifecycle.testEligible === false, `${chapterCode}: test eligibility leaked.`);
    assert(candidate.lifecycle.publiclyPublishable === false, `${chapterCode}: publication leaked.`);
  }
}

const fclCapacity = spatialFclInstanceCatalogCapacityV2();
assert(Object.values(fclCapacity).every((capacity) => capacity > 0), `At least one FCL family has zero V2 capacity: ${JSON.stringify(fclCapacity)}.`);

const fcl = batch.chapters["FCL-001"];
const fclOrbitFingerprints = new Set<string>();
for (const candidate of fcl.accepted) {
  const payload = candidate.payload as SpatialFclInstanceQuestionV2;
  assert(payload.propertyVector.filter(Boolean).length === 3, `${payload.prototypeId}: not a 3/1 property vector.`);
  assert(payload.propertyVector[payload.correctOptionIndex] === false, `${payload.prototypeId}: correct slot does not contain the odd property value.`);
  const quartet = payload.instances as unknown as SpatialFclInstanceQuartetV2;
  const audit = auditSpatialFclInstanceQuartetV2(quartet, payload.propertyId, payload.correctOptionIndex);
  assert(audit.safe, `${payload.prototypeId}: independent final instance audit failed.`);
  assert(audit.competingDescriptorIds.length === 0, `${payload.prototypeId}: competing descriptors: ${audit.competingDescriptorIds.join(",")}.`);
  assert(audit.disallowedShortcutDescriptorIds.length === 0, `${payload.prototypeId}: visible shortcuts: ${audit.disallowedShortcutDescriptorIds.join(",")}.`);
  assert(!fclOrbitFingerprints.has(payload.globalRotationOrbitFingerprint), `${payload.prototypeId}: global-rotation-equivalent duplicate slipped through.`);
  fclOrbitFingerprints.add(payload.globalRotationOrbitFingerprint);
}

const replay = synthesizeSpatialProductionScaleBatchV2({
  seedPrefix,
  requestedPerChapter: REQUESTED_PER_CHAPTER,
  maxAttemptsPerChapter: 20_000,
});
for (const chapterCode of ["FAN-001", "FCL-001", "FSR-001"] as const) {
  const first = batch.chapters[chapterCode].accepted.map((candidate) => candidate.deliveryFingerprint);
  const second = replay.chapters[chapterCode].accepted.map((candidate) => candidate.deliveryFingerprint);
  assert(JSON.stringify(first) === JSON.stringify(second), `${chapterCode}: deterministic replay mismatch.`);
}

const alternate = synthesizeSpatialProductionScaleBatchV2({
  seedPrefix: `${seedPrefix}-ALT`,
  requestedPerChapter: 40,
  maxAttemptsPerChapter: 4_000,
});
for (const chapterCode of ["FAN-001", "FCL-001", "FSR-001"] as const) {
  const first = batch.chapters[chapterCode].accepted.slice(0, 40).map((candidate) => candidate.deliveryFingerprint);
  const second = alternate.chapters[chapterCode].accepted.map((candidate) => candidate.deliveryFingerprint);
  assert(JSON.stringify(first) !== JSON.stringify(second), `${chapterCode}: alternate seed prefix did not change delivery.`);
}

const review = buildSpatialScaleEditorialReviewV2(batch);
assert(review.sampleCount === 26, `Expected one representative per 26 families, got ${review.sampleCount}.`);
const html = buildSpatialScaleEditorialReviewHtmlV2(review);
assert(html.includes("@media(max-width:520px)"), "Scale review is missing mobile rendering rule.");

const outputDir = join(process.cwd(), "dist", "reasoning-v1", "spatial");
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "spa-production-scale-v2-review.json"), JSON.stringify(review, null, 2));
writeFileSync(join(outputDir, "spa-production-scale-v2-review.html"), html);
const evidence = {
  status: "PASS_SPA_FND_001_PRODUCTION_SCALE_V2",
  accepted: {
    fan: batch.chapters["FAN-001"].accepted.length,
    fcl: batch.chapters["FCL-001"].accepted.length,
    fsr: batch.chapters["FSR-001"].accepted.length,
    total: batch.totalAccepted,
  },
  attempts: {
    fan: batch.chapters["FAN-001"].attempts,
    fcl: batch.chapters["FCL-001"].attempts,
    fsr: batch.chapters["FSR-001"].attempts,
  },
  duplicateRejects: {
    fan: batch.chapters["FAN-001"].duplicateRejects,
    fcl: batch.chapters["FCL-001"].duplicateRejects,
    fsr: batch.chapters["FSR-001"].duplicateRejects,
  },
  generatorRejects: {
    fan: batch.chapters["FAN-001"].generatorRejects,
    fcl: batch.chapters["FCL-001"].generatorRejects,
    fsr: batch.chapters["FSR-001"].generatorRejects,
  },
  correctSlots: {
    fan: batch.chapters["FAN-001"].correctSlotCounts,
    fcl: batch.chapters["FCL-001"].correctSlotCounts,
    fsr: batch.chapters["FSR-001"].correctSlotCounts,
  },
  fclCanonicalCatalogCapacity: batch.fclCanonicalCatalogCapacity,
  fclInstanceCatalogCapacity: batch.fclInstanceCatalogCapacity,
  fclFamilyCapacities: fclCapacity,
  fclFamilyCounts: batch.chapters["FCL-001"].familyCounts,
  reviewSamples: review.sampleCount,
  checks: {
    deterministicReplay: true,
    alternateSeedDivergence: true,
    uniqueContentPerChapter: true,
    globalRotationEquivalentFclDedup: true,
    visibleOrientationShortcutAudit: true,
    fullTwentySixFamilyCoverage: true,
    balancedCorrectSlots: true,
    representativeResponsiveReview: true,
    lifecycleIsolation: true,
  },
};
writeFileSync(join(outputDir, "spa-production-scale-v2-evidence.json"), JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence, null, 2));
