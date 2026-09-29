import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { listPct001CuratedDefaultQlIds } from "../topics/Arithmetic/subtopics/Percentage/PCT-001/pipeline";
import { listRap001CuratedDefaultQlIds } from "../topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/pipeline";
import type { QuantV4CglTier1ShadowQuestionRecord } from "./quant-v4-cgl-tier1-shadow-simulation-p3";

const snapshotPath = "dist/quant-v4/quality/quant-v4-cgl-tier1-shadow-simulation-p3.audit.json";
const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8")) as {
  records?: QuantV4CglTier1ShadowQuestionRecord[];
};
const records = snapshot.records ?? [];

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
  source: "AUTHORITATIVE_SHADOW_SNAPSHOT",
  productionBehaviorChanged: false,
}));
