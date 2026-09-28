import assert from "node:assert/strict";

import {
  generateQuantV4CglTier1ShadowSection,
} from "./quant-v4-cgl-tier1-shadow-simulation-p3";
import {
  quantV4AdvancedMathDifficultyForSeed,
  quantV4TrigonometryPackageForSeed,
  type QuantV4AdvancedMathDifficulty,
} from "./quant-v4-real-exam-advanced-math-adapters-p2";

const sections = [];
const coreDiversityState = new Map<string, Map<string, number>>();
const packageDiversityState = new Map<string, number>();
const mensurationUsedPatternIds = new Set<string>();
const trigonometryDiversityCursor: Record<QuantV4AdvancedMathDifficulty, number> = {
  Easy: 0,
  Medium: 0,
  Hard: 0,
};

for (let sectionIndex = 1; sectionIndex <= 20; sectionIndex += 1) {
  const shadowSeed = `QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI:shadow:${sectionIndex}`;
  const trigonometryDiversityOrdinals = Array.from({ length: 3 }, (_, slotIndex) => {
    const slotSeed = `${shadowSeed}:TRIGONOMETRY:${slotIndex}`;
    const family = quantV4TrigonometryPackageForSeed("SSC_CGL_TIER_I", slotSeed);
    if (family !== "TRG-001") return undefined;
    const difficulty = quantV4AdvancedMathDifficultyForSeed(slotSeed);
    return trigonometryDiversityCursor[difficulty]++;
  });

  sections.push(await generateQuantV4CglTier1ShadowSection({
    sectionIndex,
    seed: shadowSeed,
    trigonometryDiversityOrdinals,
    coreDiversityState,
    packageDiversityState,
    mensurationUsedPatternIds,
  }));
}

const records = sections
  .flatMap((section) => section.records)
  .filter((record) => record.sourceKind === "RUNTIME_GENERATED");

assert.equal(records.length, 500);

const groups = new Map<string, typeof records>();
for (const record of records) {
  const signature = record.normalizedStemSignature;
  if (!signature) continue;
  const group = groups.get(signature) ?? [];
  group.push(record);
  groups.set(signature, group);
}

const repeated = [...groups.entries()]
  .filter(([, items]) => items.length > 1)
  .map(([signature, items]) => ({
    signature,
    count: items.length,
    packages: [...new Set(items.map((item) => item.packageId))].sort(),
    slots: [...new Set(items.map((item) => item.slotKind))].sort(),
    canonicalProblemIds: [...new Set(items.map((item) => item.canonicalProblemId).filter(Boolean))].sort(),
    questionLanguageIds: [...new Set(items.map((item) => item.questionLanguageId).filter(Boolean))].sort(),
    taskKinds: [...new Set(items.map((item) => item.taskKind).filter(Boolean))].sort(),
    examples: items.slice(0, 5).map((item) => ({
      packageId: item.packageId,
      sectionIndex: item.sectionIndex,
      ordinal: item.ordinal,
      canonicalProblemId: item.canonicalProblemId ?? null,
      questionLanguageId: item.questionLanguageId ?? null,
      taskKind: item.taskKind ?? null,
      literalStem: item.literalStemSignature,
    })),
  }))
  .sort((left, right) => right.count - left.count || left.signature.localeCompare(right.signature));

const byPackage = new Map<string, { repeatedItems: number; groups: number }>();
for (const group of repeated) {
  for (const packageId of group.packages) {
    const packageItems = records.filter(
      (record) => record.packageId === packageId && record.normalizedStemSignature === group.signature,
    ).length;
    if (packageItems < 2) continue;
    const current = byPackage.get(packageId) ?? { repeatedItems: 0, groups: 0 };
    current.repeatedItems += packageItems - 1;
    current.groups += 1;
    byPackage.set(packageId, current);
  }
}

console.log("QUANT_V4_CGL_SHADOW_REUSE_GROUPS_P4", JSON.stringify({
  sections: sections.length,
  records: records.length,
  repeatedGroupCount: repeated.length,
  byPackage: Object.fromEntries(
    [...byPackage.entries()].sort((a,b) => b[1].repeatedItems - a[1].repeatedItems || a[0].localeCompare(b[0])),
  ),
  highestRepeatedGroups: repeated.slice(0, 40),
  carriedState: {
    corePackages: [...coreDiversityState.keys()].sort(),
    packageDiversityState: Object.fromEntries([...packageDiversityState.entries()].sort()),
    mensurationUsedPatternCount: mensurationUsedPatternIds.size,
    trigonometryDiversityCursor,
  },
  productionPromotionAuthorized: false,
  runtimeBlueprintMutationAuthorized: false,
}));
