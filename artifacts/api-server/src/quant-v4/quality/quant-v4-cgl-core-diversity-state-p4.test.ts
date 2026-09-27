import assert from "node:assert/strict";

import { listPct001CuratedDefaultQlIds } from "../topics/Arithmetic/subtopics/Percentage/PCT-001/pipeline";
import { listRap001CuratedDefaultQlIds } from "../topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/pipeline";
import { generateQuantV4CglTier1ShadowSection } from "./quant-v4-cgl-tier1-shadow-simulation-p3";

const coreDiversityState = new Map<string, Map<string, number>>();
const records = [];

for (let sectionIndex = 1; sectionIndex <= 20; sectionIndex += 1) {
  const section = await generateQuantV4CglTier1ShadowSection({
    sectionIndex,
    seed: `QUANT-V4-CGL-CORE-DIVERSITY-P4:shadow:${sectionIndex}`,
    coreDiversityState,
  });
  records.push(...section.records);
}

const targets = records.filter((record) =>
  record.sourceKind === "RUNTIME_GENERATED"
  && (record.packageId === "PCT-001" || record.packageId === "RAP-001")
  && Boolean(record.canonicalProblemId)
  && Boolean(record.questionLanguageId),
);

assert.ok(targets.length > 0);

const groups = new Map<string, typeof targets>();
for (const record of targets) {
  const key = `${record.packageId}::${record.canonicalProblemId}`;
  const group = groups.get(key) ?? [];
  group.push(record);
  groups.set(key, group);
}

const diagnostics = [];

for (const [key, group] of [...groups.entries()].sort()) {
  const [packageId, cpId] = key.split("::");
  const pool = packageId === "PCT-001"
    ? listPct001CuratedDefaultQlIds(cpId as any, { language: "en" })
    : listRap001CuratedDefaultQlIds(cpId as any, { language: "en" });
  const qlIds = group.map((record) => String(record.questionLanguageId));
  const uniqueQlIds = new Set(qlIds);

  const expectedUnique = Math.min(group.length, pool.length);
  assert.equal(
    uniqueQlIds.size,
    expectedUnique,
    `${key} should consume curated QLs before reuse (records=${group.length}, pool=${pool.length}).`,
  );

  diagnostics.push({
    packageId,
    cpId,
    records: group.length,
    curatedPoolSize: pool.length,
    uniqueQlIds: uniqueQlIds.size,
    duplicateItems: group.length - uniqueQlIds.size,
    capacityExceeded: group.length > pool.length,
  });
}

console.log("QUANT_V4_CGL_CORE_DIVERSITY_STATE_P4", JSON.stringify({
  targetRecords: targets.length,
  groups: diagnostics,
  state: Object.fromEntries(
    [...coreDiversityState.entries()].map(([packageId, byCp]) => [
      packageId,
      Object.fromEntries(byCp),
    ]),
  ),
  productionBehaviorChanged: false,
}));
