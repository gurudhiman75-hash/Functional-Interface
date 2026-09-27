import assert from "node:assert/strict";

import {
  generateQuantV4CglTier1ShadowSection,
} from "./quant-v4-cgl-tier1-shadow-simulation-p3";

const sections = [];
for (let sectionIndex = 1; sectionIndex <= 20; sectionIndex += 1) {
  sections.push(await generateQuantV4CglTier1ShadowSection({
    sectionIndex,
    seed: `QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI:shadow:${sectionIndex}`,
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
  productionPromotionAuthorized: false,
  runtimeBlueprintMutationAuthorized: false,
}));
