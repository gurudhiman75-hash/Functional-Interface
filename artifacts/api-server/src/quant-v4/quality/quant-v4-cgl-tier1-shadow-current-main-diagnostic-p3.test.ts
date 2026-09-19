import { generateQuantV4CglTier1ShadowSection } from "./quant-v4-cgl-tier1-shadow-simulation-p3";
import { generateQuantV4RealExamSectionWithAdvancedMath } from "./quant-v4-real-exam-advanced-math-integration-p2";

const SECTIONS = 20;
const SEED_PREFIX = "QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI";

function countBy<T>(items: readonly T[], key: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const value = key(item) || "UNKNOWN";
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

function duplicateSummary(records: readonly any[]) {
  const signatures = records.map((record) => String(record.normalizedStemSignature ?? "")).filter(Boolean);
  const counts = countBy(signatures, (value) => value);
  const duplicateItems = Object.values(counts).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
  return {
    records: signatures.length,
    uniqueSignatures: Object.keys(counts).length,
    duplicateItems,
    duplicateRate: signatures.length ? duplicateItems / signatures.length : 0,
  };
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

const shadow = shadowSections.flatMap((section) => section.records);
const runtime = shadow.filter((record) => record.sourceKind === "RUNTIME_GENERATED");
const baseline = baselineSections.flatMap((section) => section.questions);
const gaps = baseline.filter((question) => question.sourceKind === "CAPABILITY_GAP");

const gapSlotDistribution = countBy(gaps, (question) => String(question.slotKind));
const gapReasonDistribution = countBy(gaps, (question) => String(question.gapReason ?? "UNKNOWN_GAP_REASON"));
const gapPackageDistribution = countBy(gaps, (question) => String(question.packageId ?? "UNKNOWN_PACKAGE"));

const packages = [...new Set(runtime.map((record) => String(record.packageId)))];
const packageDuplication = packages.map((packageId) => ({
  packageId,
  ...duplicateSummary(runtime.filter((record) => record.packageId === packageId)),
})).sort((a, b) => b.duplicateRate - a.duplicateRate || b.duplicateItems - a.duplicateItems || a.packageId.localeCompare(b.packageId));

const slots = [...new Set(runtime.map((record) => String(record.slotKind)))];
const slotDuplication = slots.map((slotKind) => ({
  slotKind,
  ...duplicateSummary(runtime.filter((record) => record.slotKind === slotKind)),
})).sort((a, b) => b.duplicateRate - a.duplicateRate || b.duplicateItems - a.duplicateItems || a.slotKind.localeCompare(b.slotKind));

console.log("QUANT_V4_CGL_CURRENT_MAIN_DIAGNOSTIC_P3", JSON.stringify({
  sections: SECTIONS,
  baseline: {
    records: baseline.length,
    capabilityGaps: gaps.length,
    gapSlotDistribution,
    gapPackageDistribution,
    gapReasonDistribution,
    sampleGaps: gaps.slice(0, 20).map((question) => ({
      sectionIndex: question.sectionIndex,
      slotIndex: question.slotIndex,
      slotKind: question.slotKind,
      packageId: question.packageId,
      gapReason: question.gapReason,
    })),
  },
  repetition: {
    global: duplicateSummary(runtime),
    slots: slotDuplication,
    packages: packageDuplication,
  },
  lifecycle: {
    productionPromotionAuthorized: false,
    runtimeBlueprintMutationAuthorized: false,
  },
}));