import assert from "node:assert/strict";

import { generateQuantV4CglTier1ShadowSection } from "./quant-v4-cgl-tier1-shadow-simulation-p3";
import { generateQuantV4RealExamSectionWithAdvancedMath } from "./quant-v4-real-exam-advanced-math-integration-p2";

const SECTIONS = 20;
const SEED_PREFIX = "QUANT-V4-CGL-TIER1-SHADOW-DIAGNOSTIC-P4";

function countBy<T>(items: readonly T[], key: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const value = key(item) || "UNKNOWN";
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function literalSignature(value: unknown): string {
  return String(value ?? "").normalize("NFKC").replace(/\s+/gu, " ").trim();
}

function duplicateSummary(signatures: readonly string[]) {
  const filtered = signatures.filter(Boolean);
  const counts = countBy(filtered, (value) => value);
  const duplicateItems = Object.values(counts).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return {
    records: filtered.length,
    uniqueSignatures: Object.keys(counts).length,
    duplicateItems,
    duplicateRate: filtered.length ? duplicateItems / filtered.length : 0,
  };
}

const shadowSections = [];
const integratedSections = [];
for (let sectionIndex = 1; sectionIndex <= SECTIONS; sectionIndex += 1) {
  shadowSections.push(await generateQuantV4CglTier1ShadowSection({
    sectionIndex,
    seed: `${SEED_PREFIX}:shadow:${sectionIndex}`,
  }));
  integratedSections.push(await generateQuantV4RealExamSectionWithAdvancedMath({
    examId: "SSC_CGL_TIER_I",
    sectionIndex,
    seed: `${SEED_PREFIX}:integrated:${sectionIndex}`,
  }));
}

const shadow = shadowSections.flatMap((section) => section.records);
const integrated = integratedSections.flatMap((section) => section.questions);
assert.equal(shadow.length, 500, "Expected 500 shadow-plan records");
assert.equal(integrated.length, 500, "Expected 500 integrated current-main records");

const integratedGaps = integrated.filter((question) => question.sourceKind === "CAPABILITY_GAP");
const advancedGaps = integratedGaps.filter((question) =>
  question.slotKind === "ALGEBRA" || question.slotKind === "TRIGONOMETRY"
);
const algebra = integrated.filter((question) => question.slotKind === "ALGEBRA");
const trigonometry = integrated.filter((question) => question.slotKind === "TRIGONOMETRY");
const runtime = integrated.filter((question) => question.sourceKind === "RUNTIME_GENERATED");

const optionMismatch = runtime.filter((question) => question.optionCount !== question.expectedOptionCount);
const emptyExplanation = runtime.filter((question) => !String(question.explanation ?? "").trim());
const algebraUnexpectedlyTestEligible = algebra.filter((question) => question.testEligible === true);
const trigonometryTestEligible = trigonometry.filter((question) => question.testEligible === true);
const publiclyPublishable = integrated.filter((question) => question.publiclyPublishable === true);
const advancedMath = integrated.filter((question) =>
  question.slotKind === "ALGEBRA" || question.slotKind === "TRIGONOMETRY"
);
const advancedMathPubliclyPublishable = advancedMath.filter((question) => question.publiclyPublishable === true);

assert.equal(advancedGaps.length, 0, "Integrated current-main must have zero Algebra/Trigonometry capability gaps");
assert.equal(optionMismatch.length, 0, "Integrated runtime questions must honor SSC option-count contract");
assert.equal(emptyExplanation.length, 0, "Integrated runtime questions must have learner explanations");
assert.equal(algebraUnexpectedlyTestEligible.length, 0, "Algebra must remain non-test-eligible at this audit gate");
assert.equal(
  advancedMathPubliclyPublishable.length,
  0,
  "CGL diagnostic must not expose Algebra/Trigonometry records for public release",
);

const literal = duplicateSummary(runtime.map((question) => literalSignature(question.text)));
const structural = duplicateSummary(runtime.map((question) => String(question.normalizedStemSignature ?? "")));

const slotDistribution = countBy(integrated, (question) => String(question.slotKind));
const packageDistribution = countBy(integrated, (question) => String(question.packageId ?? "UNKNOWN_PACKAGE"));
const gapSlotDistribution = countBy(integratedGaps, (question) => String(question.slotKind));
const gapReasonDistribution = countBy(integratedGaps, (question) => String(question.gapReason ?? "UNKNOWN_GAP_REASON"));

const blockers = [
  ...(integratedGaps.length ? ["CURRENT_INTEGRATED_CAPABILITY_GAPS_PRESENT"] : []),
  ...(structural.duplicateRate > 0.05 ? ["NORMALIZED_STRUCTURAL_REUSE_ABOVE_5_PERCENT"] : []),
  ...(algebra.length ? ["ALGEBRA_LIFECYCLE_BANK_ONLY_OR_NON_TEST_ELIGIBLE"] : []),
  ...(trigonometry.length && trigonometryTestEligible.length !== trigonometry.length
    ? ["TRIGONOMETRY_TEST_ELIGIBILITY_INCOMPLETE"]
    : []),
];

console.log("QUANT_V4_CGL_CURRENT_MAIN_DIAGNOSTIC_P4", JSON.stringify({
  sections: SECTIONS,
  shadowPlan: {
    records: shadow.length,
    slotDistribution: countBy(shadow, (record) => String(record.slotKind)),
    capabilityGaps: shadow.filter((record) => record.sourceKind === "CAPABILITY_GAP").length,
  },
  integratedCurrentMain: {
    records: integrated.length,
    runtimeGenerated: runtime.length,
    capabilityGaps: integratedGaps.length,
    advancedMathCapabilityGaps: advancedGaps.length,
    algebraRecords: algebra.length,
    algebraUnexpectedlyTestEligible: algebraUnexpectedlyTestEligible.length,
    trigonometryRecords: trigonometry.length,
    trigonometryTestEligible: trigonometryTestEligible.length,
    optionMismatchCount: optionMismatch.length,
    emptyExplanationCount: emptyExplanation.length,
    publiclyPublishableCount: publiclyPublishable.length,
    advancedMathPubliclyPublishableCount: advancedMathPubliclyPublishable.length,
    slotDistribution,
    packageDistribution,
    gapSlotDistribution,
    gapReasonDistribution,
  },
  repetition: {
    literal,
    normalizedStructural: structural,
    fivePercentStructuralReuseGatePassed: structural.duplicateRate <= 0.05,
  },
  blockers,
  productionPromotionAuthorized: false,
  runtimeBlueprintMutationAuthorized: false,
}));
