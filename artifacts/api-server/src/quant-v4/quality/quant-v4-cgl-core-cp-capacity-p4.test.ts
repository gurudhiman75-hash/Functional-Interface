import assert from "node:assert/strict";

import { listQuantV4Packages as listCorePackages } from "../generation-engine-core";
import { generateQuantV4CglTier1ShadowSection } from "./quant-v4-cgl-tier1-shadow-simulation-p3";

const coreDefinitions = new Map(
  listCorePackages().map((pkg) => [String(pkg.packageId), pkg]),
);
const coreDiversityState = new Map<string, Map<string, number>>();
const packageDiversityState = new Map<string, number>();
const mensurationUsedPatternIds = new Set<string>();
const records = [];

for (let sectionIndex = 1; sectionIndex <= 20; sectionIndex += 1) {
  const section = await generateQuantV4CglTier1ShadowSection({
    sectionIndex,
    seed: `QUANT-V4-CGL-CORE-CP-CAPACITY-P4:shadow:${sectionIndex}`,
    coreDiversityState,
    packageDiversityState,
    mensurationUsedPatternIds,
  });
  records.push(...section.records);
}

const targets = records.filter((record) =>
  record.sourceKind === "RUNTIME_GENERATED"
  && /^(?:PCT|RAP|PRT)-/u.test(record.packageId)
  && Boolean(record.canonicalProblemId),
);
assert.ok(targets.length > 0);

const byPackage = new Map<string, typeof targets>();
for (const record of targets) {
  const group = byPackage.get(record.packageId) ?? [];
  group.push(record);
  byPackage.set(record.packageId, group);
}

const diagnostics = [];
for (const [packageId, group] of [...byPackage.entries()].sort()) {
  const definition = coreDefinitions.get(packageId);
  assert.ok(definition, `Missing core package definition for ${packageId}.`);

  const cpIds = group.map((record) => String(record.canonicalProblemId));
  const uniqueCpIds = new Set(cpIds);
  const expectedUnique = Math.min(group.length, definition.cpIds.length);

  assert.equal(
    uniqueCpIds.size,
    expectedUnique,
    `${packageId} must consume canonical problems before repeating a CP (records=${group.length}, cpCapacity=${definition.cpIds.length}).`,
  );

  diagnostics.push({
    packageId,
    records: group.length,
    cpCapacity: definition.cpIds.length,
    uniqueCpIds: uniqueCpIds.size,
    duplicateCpSelections: group.length - uniqueCpIds.size,
    capacityExceeded: group.length > definition.cpIds.length,
  });
}

console.log("QUANT_V4_CGL_CORE_CP_CAPACITY_P4", JSON.stringify({
  targetRecords: targets.length,
  packages: diagnostics,
  productionBehaviorChanged: false,
}));
