import { strict as assert } from "node:assert";

import {
  COM001_MEMORY_STORAGE_DISCOVERY,
  auditCom001MemoryStorageDiscovery,
} from "./com001-memory-storage-discovery";

const audit = auditCom001MemoryStorageDiscovery();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.candidateCount, 19);
assert.equal(audit.relationFamilies.length >= 10, true);

const ids = new Set(COM001_MEMORY_STORAGE_DISCOVERY.map((entry) => entry.candidateId));
for (const candidate of COM001_MEMORY_STORAGE_DISCOVERY) {
  assert.equal(candidate.productionState, "DISCOVERY_ONLY");
  assert.equal(/QL-/i.test(candidate.candidateId), false);
  for (const mergeTarget of candidate.likelyMergeWith ?? []) {
    assert.equal(ids.has(mergeTarget), true, `${candidate.candidateId} -> ${mergeTarget}`);
  }
}

const officialAnchored = COM001_MEMORY_STORAGE_DISCOVERY.filter((entry) =>
  entry.evidence.includes("OFFICIAL_SYLLABUS"),
);
assert.equal(officialAnchored.length >= 6, true);

const pyqRequired = COM001_MEMORY_STORAGE_DISCOVERY.filter((entry) =>
  entry.evidence.includes("PYQ_REQUIRED"),
);
assert.equal(pyqRequired.length >= 8, true);

// Forward/reverse surfaces are intentionally still provisional merge questions.
for (const relationFamily of [
  "volatility",
  "memory-layer-classification",
  "function-purpose",
  "storage-medium",
]) {
  assert.equal(
    COM001_MEMORY_STORAGE_DISCOVERY.filter(
      (entry) => entry.relationFamily === relationFamily,
    ).length >= 2,
    true,
    relationFamily,
  );
}

const normalizedSurfaces = new Set<string>();
for (const candidate of COM001_MEMORY_STORAGE_DISCOVERY) {
  for (const surface of candidate.surfaceVariants) {
    const normalized = surface.toLowerCase().replace(/\s+/g, " ").trim();
    assert.equal(normalizedSurfaces.has(normalized), false, surface);
    normalizedSurfaces.add(normalized);
  }
}

const ordering = COM001_MEMORY_STORAGE_DISCOVERY.find(
  (entry) => entry.relationFamily === "memory-hierarchy-order",
);
assert.ok(ordering);
assert.equal((ordering.ambiguityRisks ?? []).length > 0, true);

const units = COM001_MEMORY_STORAGE_DISCOVERY.find(
  (entry) => entry.relationFamily === "capacity-unit-relationship",
);
assert.ok(units);
assert.equal(
  (units.ambiguityRisks ?? []).some((risk) => /binary vs decimal/i.test(risk)),
  true,
);
