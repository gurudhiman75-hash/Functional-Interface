import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_001_DISCOVERY_AUDIT_V1,
  PFC_001_INVENTORY_COVERAGE_V1,
  PFC_001_PROPOSED_REASONING_CLUSTERS_V1,
} from "../foundation/spatial/paper-folding-discovery-audit-v1";
import { PFC_001_REPRESENTATION_CATALOG_V1 } from "../foundation/spatial/paper-folding-discovery-v1";

assert.equal(PFC_001_DISCOVERY_AUDIT_V1.controlledTaxonomyStatus, "CONTROLLED_PFC_TAXONOMY_SATURATED");
assert.equal(PFC_001_DISCOVERY_AUDIT_V1.sourceAuditStatus, "DIRECT_EXAM_SOURCE_SATURATION_NOT_YET_CLAIMED");
assert.equal(PFC_001_DISCOVERY_AUDIT_V1.permanentQlDecision, "PROPOSED_CLUSTERS_ONLY_NO_PERMANENT_QL_ALLOCATION");
assert.equal(PFC_001_DISCOVERY_AUDIT_V1.qlGuard.spaQl035Allocated, false);
assert.equal(PFC_001_DISCOVERY_AUDIT_V1.qlGuard.nextAvailableQl, "SPA-QL-035");
assert.equal(PFC_001_INVENTORY_COVERAGE_V1.length, 10);
assert.equal(PFC_001_REPRESENTATION_CATALOG_V1.length, 10);
assert.equal(PFC_001_PROPOSED_REASONING_CLUSTERS_V1.length, 4);

const catalog = new Set(PFC_001_REPRESENTATION_CATALOG_V1.map((item) => item.id));
const covered = new Set(PFC_001_INVENTORY_COVERAGE_V1.flatMap((item) => item.representations));
assert.deepEqual([...covered].sort(), [...catalog].sort());

const clustered = new Set(PFC_001_PROPOSED_REASONING_CLUSTERS_V1.flatMap((cluster) => cluster.representations));
assert.deepEqual([...clustered].sort(), [...catalog].sort());

for (let item = 1; item <= 10; item += 1) {
  assert.ok(PFC_001_INVENTORY_COVERAGE_V1.some((entry) => entry.inventoryItem === item));
}

const evidence = {
  authority: PFC_001_DISCOVERY_AUDIT_V1,
  status: "PASS_PFC_001_DISCOVERY_AUDIT_V1",
  controlledInventoryCoverage: PFC_001_INVENTORY_COVERAGE_V1,
  proposedReasoningClusters: PFC_001_PROPOSED_REASONING_CLUSTERS_V1,
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-discovery-audit-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence));
