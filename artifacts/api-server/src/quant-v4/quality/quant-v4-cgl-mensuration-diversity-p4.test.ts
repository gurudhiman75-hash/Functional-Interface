import assert from "node:assert/strict";

import {
  MENSURATION_QUESTION_STUDIO_REALISM_PATTERNS,
} from "../topics/AdvancedMathematics/subtopics/Mensuration/mensuration-question-studio-runtime-v2";
import {
  generateQuantV4CglTier1ShadowSection,
} from "./quant-v4-cgl-tier1-shadow-simulation-p3";

const positiveWeightPatternIds = new Set(
  MENSURATION_QUESTION_STUDIO_REALISM_PATTERNS
    .filter((pattern) => pattern.realism.profileWeights.SSC_CORE > 0)
    .map((pattern) => pattern.patternId),
);

const coreDiversityState = new Map<string, Map<string, number>>();
const packageDiversityState = new Map<string, number>();
const mensurationUsedPatternIds = new Set<string>();
const records = [];

for (let sectionIndex = 1; sectionIndex <= 20; sectionIndex += 1) {
  const section = await generateQuantV4CglTier1ShadowSection({
    sectionIndex,
    seed: `QUANT-V4-CGL-MENSURATION-DIVERSITY-P4:shadow:${sectionIndex}`,
    coreDiversityState,
    packageDiversityState,
    mensurationUsedPatternIds,
  });
  records.push(...section.records);
}

const mensuration = records.filter(
  (record) =>
    record.sourceKind === "RUNTIME_GENERATED"
    && record.packageId === "MENSURATION",
);
assert.ok(mensuration.length > 0);
assert.ok(positiveWeightPatternIds.size > 0);

const patternIds = mensuration.map((record) => String(record.questionLanguageId ?? ""));
assert.ok(patternIds.every(Boolean), "Every Mensuration shadow record must expose its pattern/QL id.");

const expectedUnique = Math.min(mensuration.length, positiveWeightPatternIds.size);
assert.equal(
  new Set(patternIds).size,
  expectedUnique,
  `Mensuration must exhaust unused positive-weight patterns before reuse (records=${mensuration.length}, capacity=${positiveWeightPatternIds.size}).`,
);

console.log("QUANT_V4_CGL_MENSURATION_DIVERSITY_P4", JSON.stringify({
  mensurationRecords: mensuration.length,
  positiveWeightPatternCapacity: positiveWeightPatternIds.size,
  uniquePatternIds: new Set(patternIds).size,
  duplicatePatternItems: mensuration.length - new Set(patternIds).size,
  productionBehaviorChanged: false,
}));
