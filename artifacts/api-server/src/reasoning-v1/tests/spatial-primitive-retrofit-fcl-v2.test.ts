import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  SPATIAL_FAN_PRIMITIVE_POOL_V2,
  SPATIAL_FCL_PRIMITIVE_POOL_V2,
  SPATIAL_MIRROR_WATER_PRIMITIVE_POOL_V2,
  SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2,
  applySpatialPrimitiveRetrofitTransformV2,
  buildSpatialPrimitiveClassificationProofV2,
  buildSpatialPrimitiveFanRetrofitProofV2,
  buildSpatialPrimitiveMirrorWaterRetrofitProofV2,
  buildSpatialPrimitiveRetrofitFclV2ReviewExport,
  buildSpatialPrimitiveRetrofitFclV2ReviewHtml,
  buildSpatialPrimitiveInstanceSceneV2,
  getSpatialPrimitiveConnectivityV2,
  spatialSceneSemanticFingerprint,
  validateSpatialChapterPrimitivePoolsV2,
  validateSpatialScene,
} from "../foundation/spatial";

assert.deepEqual(validateSpatialChapterPrimitivePoolsV2(), []);
assert.ok(SPATIAL_MIRROR_WATER_PRIMITIVE_POOL_V2.length >= 12);
assert.ok(SPATIAL_FAN_PRIMITIVE_POOL_V2.length >= 12);
assert.equal(SPATIAL_FCL_PRIMITIVE_POOL_V2.length, 33);

assert.deepEqual(getSpatialPrimitiveConnectivityV2("CHEVRON_RIGHT"), {
  junctionCount: 0,
  crossingCount: 0,
  terminalCount: 2,
});
assert.deepEqual(getSpatialPrimitiveConnectivityV2("ARROW_RIGHT"), {
  junctionCount: 1,
  crossingCount: 0,
  terminalCount: 3,
});
assert.deepEqual(getSpatialPrimitiveConnectivityV2("PLUS"), {
  junctionCount: 1,
  crossingCount: 1,
  terminalCount: 4,
});
assert.deepEqual(getSpatialPrimitiveConnectivityV2("SIX_SPOKE"), {
  junctionCount: 1,
  crossingCount: 1,
  terminalCount: 6,
});

for (const primitiveId of SPATIAL_FCL_PRIMITIVE_POOL_V2) {
  const scene = buildSpatialPrimitiveInstanceSceneV2(primitiveId, `INSTANCE-TEST-${primitiveId}`, {
    scale: 0.73,
    rotationQuarterTurns: 1,
  });
  assert.equal(validateSpatialScene(scene).ok, true, primitiveId);
  const connectivity = getSpatialPrimitiveConnectivityV2(primitiveId);
  assert.ok(connectivity.junctionCount >= 0, primitiveId);
  assert.ok(connectivity.crossingCount >= 0, primitiveId);
  assert.ok(connectivity.terminalCount >= 0, primitiveId);
  assert.ok(connectivity.crossingCount <= connectivity.junctionCount, primitiveId);
}

const mirrorWater = buildSpatialPrimitiveMirrorWaterRetrofitProofV2();
assert.equal(mirrorWater.length, 8);
assert.equal(mirrorWater.filter((q) => q.chapterCode === "MIR-001").length, 4);
assert.equal(mirrorWater.filter((q) => q.chapterCode === "WAT-001").length, 4);
for (const question of mirrorWater) {
  assert.equal(question.optionScenes.length, 4);
  assert.equal(new Set(question.optionScenes.map(spatialSceneSemanticFingerprint)).size, 4, question.prototypeId);
  assert.equal(question.optionLabels[question.correctOptionIndex], question.transform, question.prototypeId);
  const independentlyCorrect = applySpatialPrimitiveRetrofitTransformV2(
    question.sourceScene,
    question.transform,
    `${question.prototypeId}-independent-correct`,
  );
  assert.equal(
    spatialSceneSemanticFingerprint(independentlyCorrect),
    spatialSceneSemanticFingerprint(question.optionScenes[question.correctOptionIndex]!),
    question.prototypeId,
  );
}

const fan = buildSpatialPrimitiveFanRetrofitProofV2();
assert.equal(fan.length, 6);
for (const question of fan) {
  assert.ok(question.pairResultScene);
  assert.ok(question.targetScene);
  assert.equal(new Set(question.optionScenes.map(spatialSceneSemanticFingerprint)).size, 4, question.prototypeId);
  assert.equal(question.optionLabels[question.correctOptionIndex], question.transform, question.prototypeId);
  const independentlyPaired = applySpatialPrimitiveRetrofitTransformV2(
    question.sourceScene,
    question.transform,
    `${question.prototypeId}-independent-b`,
  );
  assert.equal(
    spatialSceneSemanticFingerprint(independentlyPaired),
    spatialSceneSemanticFingerprint(question.pairResultScene!),
    question.prototypeId,
  );
  const independentlyCorrect = applySpatialPrimitiveRetrofitTransformV2(
    question.targetScene!,
    question.transform,
    `${question.prototypeId}-independent-answer`,
  );
  assert.equal(
    spatialSceneSemanticFingerprint(independentlyCorrect),
    spatialSceneSemanticFingerprint(question.optionScenes[question.correctOptionIndex]!),
    question.prototypeId,
  );
}

const fcl = buildSpatialPrimitiveClassificationProofV2();
assert.equal(fcl.length, 12);
assert.equal(new Set(fcl.map((question) => question.propertyId)).size, 12);
assert.deepEqual(
  fcl.map((question) => question.propertyId),
  [...SPATIAL_PRIMITIVE_CLASSIFICATION_PROPERTY_IDS_V2],
);
assert.ok(fcl.some((question) => question.propertyId === "HAS_BRANCH_JUNCTION"));
assert.ok(fcl.some((question) => question.propertyId === "TWO_FREE_TERMINALS"));
assert.ok(fcl.some((question) => question.propertyId === "HALF_TURN_ONLY"));
const slotCounts = [0, 0, 0, 0];
for (const question of fcl) {
  slotCounts[question.correctOptionIndex] += 1;
  assert.equal(question.propertyVector.filter(Boolean).length, 3, question.prototypeId);
  assert.equal(question.propertyVector[question.correctOptionIndex], false, question.prototypeId);
  assert.equal(question.primitiveIds.length, 4);
  assert.equal(new Set(question.primitiveIds).size, 4, question.prototypeId);
  assert.equal(new Set(question.optionScenes.map(spatialSceneSemanticFingerprint)).size, 4, question.prototypeId);
  assert.equal(
    question.descriptorAudits.some((audit) => audit.threeToOne && !audit.supportsCorrectOdd),
    false,
    question.prototypeId,
  );
  assert.ok(question.descriptorAudits.some((audit) => audit.descriptorId === "FREE_TERMINAL_COUNT"));
  assert.equal(question.lifecycle.permanentQlId, null);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankWritable, false);
  assert.equal(question.lifecycle.testEligible, false);
  assert.equal(question.lifecycle.publiclyPublishable, false);
}
assert.deepEqual(slotCounts, [3, 3, 3, 3]);

const review = buildSpatialPrimitiveRetrofitFclV2ReviewExport();
assert.equal(review.mirrorEnhancementCount, 4);
assert.equal(review.waterEnhancementCount, 4);
assert.equal(review.fanEnhancementCount, 6);
assert.equal(review.legacyFclPrototypeCount, 8);
assert.equal(review.primitiveFclPrototypeCount, 12);
assert.equal(review.totalFclPrototypeFamilies, 20);
const html = buildSpatialPrimitiveRetrofitFclV2ReviewHtml(review);
assert.match(html, /^<!doctype html>/);
assert.match(html, /FCL-001 V2 expansion/);
assert.doesNotMatch(html, /<script|javascript:/i);

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-primitive-retrofit-fcl-v2-review.json",
  `${JSON.stringify(review, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-primitive-retrofit-fcl-v2-review.html",
  html,
  "utf8",
);

console.log(JSON.stringify({
  status: "PASS_SPA_FND_001_PRIMITIVE_RETROFIT_FCL_V2",
  pools: {
    mirrorWater: SPATIAL_MIRROR_WATER_PRIMITIVE_POOL_V2.length,
    fan: SPATIAL_FAN_PRIMITIVE_POOL_V2.length,
    fcl: SPATIAL_FCL_PRIMITIVE_POOL_V2.length,
  },
  proofEnhancements: { mirror: 4, water: 4, fan: 6 },
  fcl: { legacyFamilies: 8, primitiveFamilies: 12, totalPrototypeFamilies: 20, correctSlotCounts: slotCounts },
  checks: {
    reusablePrimitiveInstantiation: true,
    connectivitySemantics: true,
    mirrorWaterTransformIndependence: true,
    fanTransformIndependence: true,
    freeTerminalAmbiguityAudit: true,
    noCompetingFclThreeToOneMinority: true,
    fclOptionUniqueness: true,
    lifecycleLocked: true,
  },
}, null, 2));
