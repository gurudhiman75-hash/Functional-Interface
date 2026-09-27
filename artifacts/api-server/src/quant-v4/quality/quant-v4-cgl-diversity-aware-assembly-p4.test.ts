import assert from "node:assert/strict";

import {
  generateQuantV4CglTier1ShadowSection,
  type QuantV4CglTier1ShadowSection,
} from "./quant-v4-cgl-tier1-shadow-simulation-p3";

function duplicateItems(signatures: readonly string[]): number {
  const counts = new Map<string, number>();
  for (const signature of signatures.filter(Boolean)) {
    counts.set(signature, (counts.get(signature) ?? 0) + 1);
  }
  return [...counts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
}

function runtimeSignatures(section: QuantV4CglTier1ShadowSection): string[] {
  return section.records
    .filter((record) => record.sourceKind === "RUNTIME_GENERATED")
    .map((record) => record.normalizedStemSignature)
    .filter(Boolean);
}

const baselineSections: QuantV4CglTier1ShadowSection[] = [];
for (let sectionIndex = 1; sectionIndex <= 20; sectionIndex += 1) {
  baselineSections.push(await generateQuantV4CglTier1ShadowSection({
    sectionIndex,
    seed: `QUANT-V4-CGL-TIER1-SHADOW-SIMULATION-CI:shadow:${sectionIndex}`,
  }));
}

const baselineSignatures = baselineSections.flatMap(runtimeSignatures);
assert.equal(baselineSignatures.length, 500);
const baselineDuplicateItems = duplicateItems(baselineSignatures);
const baselineDuplicateRate = baselineDuplicateItems / baselineSignatures.length;

const selectedSections: QuantV4CglTier1ShadowSection[] = [];
const seen = new Set<string>();
const selectedCandidateBySection: number[] = [];

for (let sectionIndex = 1; sectionIndex <= 20; sectionIndex += 1) {
  const candidates: QuantV4CglTier1ShadowSection[] = [];
  for (let candidateIndex = 0; candidateIndex < 3; candidateIndex += 1) {
    candidates.push(await generateQuantV4CglTier1ShadowSection({
      sectionIndex,
      seed: `QUANT-V4-CGL-DIVERSITY-AWARE-ASSEMBLY-P4:section:${sectionIndex}:candidate:${candidateIndex}`,
    }));
  }

  const scored = candidates.map((section, candidateIndex) => {
    const signatures = runtimeSignatures(section);
    const overlap = signatures.filter((signature) => seen.has(signature)).length;
    const withinSectionDuplicates = duplicateItems(signatures);
    return { section, candidateIndex, overlap, withinSectionDuplicates };
  }).sort((left, right) =>
    left.overlap - right.overlap
    || left.withinSectionDuplicates - right.withinSectionDuplicates
    || left.candidateIndex - right.candidateIndex
  );

  const selected = scored[0]!;
  selectedSections.push(selected.section);
  selectedCandidateBySection.push(selected.candidateIndex);
  for (const signature of runtimeSignatures(selected.section)) seen.add(signature);
}

const selectedSignatures = selectedSections.flatMap(runtimeSignatures);
assert.equal(selectedSignatures.length, 500);
const selectedDuplicateItems = duplicateItems(selectedSignatures);
const selectedDuplicateRate = selectedDuplicateItems / selectedSignatures.length;

assert.ok(
  selectedDuplicateRate < baselineDuplicateRate,
  `Diversity-aware assembly did not improve structural reuse: baseline=${baselineDuplicateRate}, selected=${selectedDuplicateRate}`,
);

console.log("QUANT_V4_CGL_DIVERSITY_AWARE_ASSEMBLY_P4", JSON.stringify({
  sections: 20,
  records: 500,
  candidatesPerSection: 3,
  baseline: {
    duplicateItems: baselineDuplicateItems,
    duplicateRate: baselineDuplicateRate,
  },
  diversityAware: {
    duplicateItems: selectedDuplicateItems,
    duplicateRate: selectedDuplicateRate,
    selectedCandidateBySection,
  },
  targetReuseCeiling: 0.05,
  meetsTarget: selectedDuplicateRate <= 0.05,
  productionBehaviorChanged: false,
  runtimeBlueprintMutationAuthorized: false,
}));
