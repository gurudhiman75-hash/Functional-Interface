import assert from "node:assert/strict";

import {
  GEO_001_QUESTION_STUDIO_QL_IDS,
} from "../topics/AdvancedMathematics/subtopics/Geometry/question-studio-standard-integration";
import {
  generateQuantV4CglTier1ShadowSection,
} from "./quant-v4-cgl-tier1-shadow-simulation-p3";

const coreDiversityState = new Map<string, Map<string, number>>();
const packageDiversityState = new Map<string, number>();
const records = [];

for (let sectionIndex = 1; sectionIndex <= 20; sectionIndex += 1) {
  const section = await generateQuantV4CglTier1ShadowSection({
    sectionIndex,
    seed: `QUANT-V4-CGL-GEO-DIVERSITY-P4:shadow:${sectionIndex}`,
    coreDiversityState,
    packageDiversityState,
  });
  records.push(...section.records);
}

const geometry = records.filter(
  (record) =>
    record.sourceKind === "RUNTIME_GENERATED"
    && record.packageId === "GEO-001",
);

assert.ok(geometry.length > 0);
assert.ok(
  geometry.length <= GEO_001_QUESTION_STUDIO_QL_IDS.length,
  "This diagnostic assumes the sampled GEO count fits within the frozen 75-QL capacity.",
);

const qlIds = geometry.map((record) => String(record.questionLanguageId ?? ""));
assert.ok(qlIds.every(Boolean), "Every GEO shadow record must expose a QL id.");
assert.equal(
  new Set(qlIds).size,
  geometry.length,
  "GEO shadow assembly must consume frozen QLs before reuse while capacity remains.",
);

console.log("QUANT_V4_CGL_GEOMETRY_DIVERSITY_P4", JSON.stringify({
  geometryRecords: geometry.length,
  frozenQlCapacity: GEO_001_QUESTION_STUDIO_QL_IDS.length,
  uniqueQlIds: new Set(qlIds).size,
  duplicateQlItems: geometry.length - new Set(qlIds).size,
  productionBehaviorChanged: false,
}));
