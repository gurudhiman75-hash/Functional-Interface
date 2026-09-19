import assert from "node:assert/strict";

import {
  generateQuantV4CglTier1ShadowSection,
} from "./quant-v4-cgl-tier1-shadow-simulation-p3";
import {
  generateQuantV4RealExamSectionWithAdvancedMath,
} from "./quant-v4-real-exam-advanced-math-integration-p2";

const SECTIONS = 20;
const SEED_PREFIX = "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI";

function countBy<T>(items: readonly T[], key: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const value = key(item);
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)));
}

function sumCounts(counts: Readonly<Record<string, number>>): number {
  return Object.values(counts).reduce((sum, value) => sum + value, 0);
}

function duplicateSummary<T>(items: readonly T[], signature: (item: T) => string) {
  const signatures = items.map(signature).filter(Boolean);
  const counts = countBy(signatures, (entry) => entry);
  const duplicateItems = Object.values(counts).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return {
    records: signatures.length,
    uniqueSignatures: Object.keys(counts).length,
    duplicateItems,
    duplicateRate: signatures.length ? duplicateItems / signatures.length : 0,
  };
}

function duplicateBreakdown<T>(
  items: readonly T[],
  group: (item: T) => string,
  signature: (item: T) => string,
) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = group(item);
    const current = groups.get(key) ?? [];
    current.push(item);
    groups.set(key, current);
  }
  return Object.fromEntries(
    [...groups.entries()]
      .map(([key, records]) => [key, duplicateSummary(records, signature)] as const)
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

function repeatedNormalizedFamilies(records: readonly any[]) {
  const groups = new Map<string, any[]>();
  for (const record of records) {
    const signature = String(record.normalizedStemSignature ?? "");
    if (!signature) continue;
    const current = groups.get(signature) ?? [];
    current.push(record);
    groups.set(signature, current);
  }
  return [...groups.entries()]
    .filter(([, family]) => family.length > 1)
    .map(([signature, family]) => ({
      count: family.length,
      signature,
      canonicalProblemIds: [...new Set(family.map((record) => String(record.canonicalProblemId ?? "UNKNOWN")))].sort(),
      questionLanguageIds: [...new Set(family.map((record) => String(record.questionLanguageId ?? "UNKNOWN")))].sort(),
      taskKinds: [...new Set(family.map((record) => String(record.taskKind ?? "UNKNOWN")))].sort(),
      questionIds: family.map((record) => String(record.questionId ?? "UNKNOWN")),
      locations: family.map((record) => ({ sectionIndex: record.sectionIndex, ordinal: record.ordinal })),
    }))
    .sort((left, right) => right.count - left.count || left.signature.localeCompare(right.signature));
}

const shadowSections = [];
const baselineSections = [];
for (let sectionIndex = 1; sectionIndex <= SECTIONS; sectionIndex += 1) {
  shadowSections.push(await generateQuantV4CglTier1ShadowSection({
    sectionIndex,
    seed: `${SEED_PREFIX}:shadow:${sectionIndex}`,
  }));
  baselineSections.push(await generateQuantV4RealExamSectionWithAdvancedMath({
    examId: "SSC_CGL_TIER_I",
    sectionIndex,
    seed: `${SEED_PREFIX}:baseline-integrated:${sectionIndex}`,
  }));
}

const shadowRecords = shadowSections.flatMap((section) => section.records);
const runtimeShadowRecords = shadowRecords.filter((record) => record.sourceKind === "RUNTIME_GENERATED");
const baselineQuestions = baselineSections.flatMap((section) => section.questions);
const baselineGaps = baselineQuestions.filter((question) => question.sourceKind === "CAPABILITY_GAP");
const baselineAdvancedMathGaps = baselineGaps.filter(
  (question) => question.slotKind === "ALGEBRA" || question.slotKind === "TRIGONOMETRY",
);
const baselineProbabilityGaps = baselineGaps.filter((question) => question.slotKind === "PROBABILITY");

const baselineGapSlotDistribution = countBy(baselineGaps, (question) => String(question.slotKind));
const baselineGapReasonDistribution = countBy(
  baselineGaps,
  (question) => String(question.gapReason ?? "UNKNOWN_GAP_REASON"),
);

const globalStemDuplication = duplicateSummary(
  runtimeShadowRecords,
  (record) => record.normalizedStemSignature,
);
const stemDuplicationBySlot = duplicateBreakdown(
  runtimeShadowRecords,
  (record) => record.slotKind,
  (record) => record.normalizedStemSignature,
);
const stemDuplicationByPackage = duplicateBreakdown(
  runtimeShadowRecords,
  (record) => record.packageId,
  (record) => record.normalizedStemSignature,
);

const packagesByDuplicateRate = Object.entries(stemDuplicationByPackage)
  .map(([packageId, summary]) => ({ packageId, ...summary }))
  .sort((left, right) => right.duplicateRate - left.duplicateRate || right.duplicateItems - left.duplicateItems || left.packageId.localeCompare(right.packageId));
const slotsByDuplicateRate = Object.entries(stemDuplicationBySlot)
  .map(([slotKind, summary]) => ({ slotKind, ...summary }))
  .sort((left, right) => right.duplicateRate - left.duplicateRate || right.duplicateItems - left.duplicateItems || left.slotKind.localeCompare(right.slotKind));

const RAP_TARGETED_REPEAT_QLS = [
  "RAP-QL-022",
  "RAP-QL-028",
  "RAP-QL-032",
] as const;

const hotspotLocalization = Object.fromEntries(
  [
    "PCT-001",
    "PCT-002",
    "RAP-001",
    "TRG-001",
    "GEO-001",
    "DI-001",
    "DI-002",
    "DI-003",
    "DI-004",
    "DI-005",
  ].map((packageId) => {
    const records = runtimeShadowRecords.filter((record) => record.packageId === packageId);
    return [packageId, {
      records: records.length,
      literalDuplication: duplicateSummary(records, (record) => record.literalStemSignature),
      normalizedDuplication: duplicateSummary(records, (record) => record.normalizedStemSignature),
      canonicalProblemDistribution: countBy(records, (record) => String(record.canonicalProblemId ?? "UNKNOWN")),
      questionLanguageDistribution: countBy(records, (record) => String(record.questionLanguageId ?? "UNKNOWN")),
      taskKindDistribution: countBy(records, (record) => String(record.taskKind ?? "UNKNOWN")),
      lineageCoverage: {
        questionId: records.filter((record) => Boolean(record.questionId)).length,
        canonicalProblemId: records.filter((record) => Boolean(record.canonicalProblemId)).length,
        questionLanguageId: records.filter((record) => Boolean(record.questionLanguageId)).length,
        taskKind: records.filter((record) => Boolean(record.taskKind)).length,
      },
      repeatedNormalizedFamilies: repeatedNormalizedFamilies(records),
    }] as const;
  }),
);

const rapTargetedQlVariety = Object.fromEntries(
  RAP_TARGETED_REPEAT_QLS.map((questionLanguageId) => {
    const records = runtimeShadowRecords.filter(
      (record) =>
        record.packageId === "RAP-001" &&
        record.questionLanguageId === questionLanguageId,
    );
    return [questionLanguageId, {
      records: records.length,
      normalizedDuplication: duplicateSummary(
        records,
        (record) => record.normalizedStemSignature,
      ),
      locations: records.map((record) => ({
        sectionIndex: record.sectionIndex,
        ordinal: record.ordinal,
      })),
    }] as const;
  }),
);

for (const questionLanguageId of RAP_TARGETED_REPEAT_QLS) {
  const summary = rapTargetedQlVariety[questionLanguageId];
  assert.ok(
    summary.records > 1,
    `${questionLanguageId}: targeted RAP-001 diversity proof requires repeated shadow observations.`,
  );
  assert.equal(
    summary.normalizedDuplication.duplicateItems,
    0,
    `${questionLanguageId}: targeted RAP-001 presentation variants must remove normalized stem reuse.`,
  );
}

console.log("QUANT_V4_CGL_TIER1_SHADOW_DEFECT_LOCALIZATION_P3", JSON.stringify({
  sections: SECTIONS,
  baseline: {
    records: baselineQuestions.length,
    capabilityGaps: baselineGaps.length,
    advancedMathCapabilityGaps: baselineAdvancedMathGaps.length,
    probabilityCapabilityGaps: baselineProbabilityGaps.length,
    gapSlotDistribution: baselineGapSlotDistribution,
    gapReasonDistribution: baselineGapReasonDistribution,
    gaps: baselineGaps.map((question) => ({
      sectionIndex: question.sectionIndex,
      slotIndex: question.slotIndex,
      slotKind: question.slotKind,
      packageId: question.packageId,
      canonicalProblemId: question.canonicalProblemId,
      questionLanguageId: question.questionLanguageId,
      gapReason: question.gapReason,
    })),
  },
  repetition: {
    global: globalStemDuplication,
    slotsByDuplicateRate,
    packagesByDuplicateRate,
    hotspotLocalization,
    rapTargetedQlVariety,
  },
  lifecycle: {
    productionPromotionAuthorized: false,
    runtimeBlueprintMutationAuthorized: false,
  },
}));

assert.equal(shadowRecords.length, 500);
assert.equal(runtimeShadowRecords.length, 500);
assert.equal(baselineQuestions.length, 500);
assert.equal(baselineGaps.length, 0, "Integrated CGL Tier-I baseline must not contain capability gaps after eligibility-aware Probability selection.");
assert.equal(baselineAdvancedMathGaps.length, 0, "Algebra/Trigonometry must not reappear as baseline capability gaps after integration.");
assert.equal(baselineProbabilityGaps.length, 0, "Probability must select a profile+difficulty eligible registry entry rather than emitting a false capability gap.");
assert.equal(sumCounts(baselineGapSlotDistribution), 0);
assert.equal(sumCounts(baselineGapReasonDistribution), 0);
assert.ok(
  globalStemDuplication.duplicateRate <= 0.05,
  "The remediated shadow must keep normalized structural stem reuse at or below 5%.",
);
assert.equal(
  stemDuplicationBySlot.DATA_INTERPRETATION?.duplicateItems ?? -1,
  0,
  "The remediated DI shadow sample must contain no normalized structural stem reuse.",
);
for (const packageId of ["DI-001", "DI-002", "DI-003", "DI-004", "DI-005"] as const) {
  assert.equal(
    stemDuplicationByPackage[packageId]?.duplicateItems ?? -1,
    0,
    `${packageId}: remediated DI package must contain no normalized structural stem reuse in the shadow sample.`,
  );
}
assert.equal(globalStemDuplication.records, 500);
assert.equal(
  Object.values(stemDuplicationBySlot).reduce((sum, summary) => sum + summary.records, 0),
  500,
);
assert.equal(
  Object.values(stemDuplicationByPackage).reduce((sum, summary) => sum + summary.records, 0),
  500,
);
for (const packageId of [
  "PCT-001",
  "PCT-002",
  "RAP-001",
  "TRG-001",
  "GEO-001",
  "DI-001",
  "DI-002",
  "DI-003",
  "DI-004",
  "DI-005",
] as const) {
  const hotspot = hotspotLocalization[packageId];
  assert.ok(hotspot.records > 0, `${packageId}: hotspot localization requires observed shadow records.`);
}

console.log("PASS_QUANT_V4_CGL_TIER1_SHADOW_DEFECT_LOCALIZATION_P3");
