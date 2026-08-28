import {
  NUMBER_SYSTEM_CHECKPOINT_DESIGNS,
  NUMBER_SYSTEM_CROSS_CHAPTER_BOUNDARIES,
  NUMBER_SYSTEM_DESIGN_AUDIT_DIMENSIONS,
  NUMBER_SYSTEM_DISCOVERY_DIRECTIONS,
  NUMBER_SYSTEM_REPRESENTATION_BASELINE,
  type NumberSystemCpId,
} from "./number-system-design-registry";
import {
  NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS,
  NUMBER_SYSTEM_FINAL_CHECKPOINT_COUNT,
  NUMBER_SYSTEM_FINAL_NEXT_PERMANENT_QL_NUMBER,
  NUMBER_SYSTEM_FINAL_PERMANENT_QL_RANGE,
} from "./number-system-final-allocation-authority";

const ok = (value: unknown, message: string): void => {
  if (!value) throw new Error(message);
};

const equal = (actual: unknown, expected: unknown, message: string): void => {
  if (actual !== expected) throw new Error(`${message}: ${String(actual)} !== ${String(expected)}`);
};

const expectedCpIds = Array.from(
  { length: 14 },
  (_unused, index) => `NUM-CP-${String(index + 1).padStart(3, "0")}`,
);

const cpIds = NUMBER_SYSTEM_CHECKPOINT_DESIGNS.map((checkpoint) => checkpoint.cpId);
equal(NUMBER_SYSTEM_CHECKPOINT_DESIGNS.length, 14, "checkpoint blueprint count");
equal(NUMBER_SYSTEM_FINAL_CHECKPOINT_COUNT, 14, "final checkpoint count");
equal(JSON.stringify(cpIds), JSON.stringify(expectedCpIds), "continuous CP identity");
equal(new Set(cpIds).size, cpIds.length, "unique CP identity");
equal(new Set(NUMBER_SYSTEM_CHECKPOINT_DESIGNS.map((checkpoint) => checkpoint.title)).size, 14, "unique checkpoint titles");

for (const [index, checkpoint] of NUMBER_SYSTEM_CHECKPOINT_DESIGNS.entries()) {
  const expectedPackage = index < 6 ? "NUM-001" : "NUM-002";
  equal(checkpoint.packageId, expectedPackage, `${checkpoint.cpId}: package split`);
  ok(checkpoint.primaryInvariant.trim().length >= 30, `${checkpoint.cpId}: weak invariant`);
  ok(checkpoint.taskClusters.length >= 4, `${checkpoint.cpId}: task clusters`);
  ok(checkpoint.inverseDirections.length >= 4, `${checkpoint.cpId}: inverse directions`);
  ok(checkpoint.answerSemantics.length >= 1, `${checkpoint.cpId}: answer semantics`);
  ok(checkpoint.edgeClusters.length >= 4, `${checkpoint.cpId}: edge coverage`);
  ok(checkpoint.representationClusters.length >= 3, `${checkpoint.cpId}: representation coverage`);
  ok(checkpoint.misconceptionClusters.length >= 4, `${checkpoint.cpId}: misconception coverage`);
  ok(checkpoint.competingOwners.length >= 1, `${checkpoint.cpId}: competing-owner audit`);
  ok(checkpoint.advancedHolds.length >= 1, `${checkpoint.cpId}: advanced-hold disposition`);
  ok(checkpoint.canonicalRoute !== checkpoint.independentVerifierRoute, `${checkpoint.cpId}: verifier is not independent`);
  equal(checkpoint.active, false, `${checkpoint.cpId}: active leak`);
  equal(checkpoint.questionStudioDiscoverable, false, `${checkpoint.cpId}: design blueprint Question Studio leak`);
  equal(checkpoint.questionBankWritable, false, `${checkpoint.cpId}: Question Bank leak`);
  equal(checkpoint.testEligible, false, `${checkpoint.cpId}: test leak`);
  equal(checkpoint.publiclyPublishable, false, `${checkpoint.cpId}: public leak`);
}

const checkpointById = new Map<NumberSystemCpId, (typeof NUMBER_SYSTEM_CHECKPOINT_DESIGNS)[number]>(
  NUMBER_SYSTEM_CHECKPOINT_DESIGNS.map((checkpoint) => [checkpoint.cpId, checkpoint]),
);

for (const checkpoint of NUMBER_SYSTEM_CHECKPOINT_DESIGNS) {
  for (const dependency of checkpoint.dependencies) {
    ok(checkpointById.has(dependency), `${checkpoint.cpId}: unknown dependency ${dependency}`);
    ok(dependency !== checkpoint.cpId, `${checkpoint.cpId}: self dependency`);
  }
}

const visiting = new Set<NumberSystemCpId>();
const visited = new Set<NumberSystemCpId>();
function visit(cpId: NumberSystemCpId): void {
  if (visited.has(cpId)) return;
  if (visiting.has(cpId)) throw new Error(`dependency cycle at ${cpId}`);
  visiting.add(cpId);
  const checkpoint = checkpointById.get(cpId);
  if (!checkpoint) throw new Error(`missing checkpoint ${cpId}`);
  for (const dependency of checkpoint.dependencies) visit(dependency);
  visiting.delete(cpId);
  visited.add(cpId);
}
for (const cpId of cpIds) visit(cpId);
equal(visited.size, 14, "dependency graph coverage");

// The design objects remain the mathematical blueprint. Live implementation
// status/ranges are governed by the final allocation authority, which supersedes
// historical discovery-status fields retained inside the blueprint file.
equal(NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS.length, 14, "final permanent checkpoint count");
const finalByCp = new Map(NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS.map((entry) => [entry.cpId, entry]));
for (const checkpoint of NUMBER_SYSTEM_CHECKPOINT_DESIGNS) {
  const finalAllocation = finalByCp.get(checkpoint.cpId);
  ok(finalAllocation, `${checkpoint.cpId}: missing final permanent allocation`);
  equal(finalAllocation?.packageId, checkpoint.packageId, `${checkpoint.cpId}: final package drift`);
  equal(finalAllocation?.title, checkpoint.title, `${checkpoint.cpId}: final title drift`);
  ok((finalAllocation?.permanentQlCount ?? 0) >= 1, `${checkpoint.cpId}: empty permanent allocation`);
  ok((finalAllocation?.frozenSolveModeCount ?? 0) >= 1, `${checkpoint.cpId}: missing frozen solve modes`);
}

equal(NUMBER_SYSTEM_FINAL_PERMANENT_QL_RANGE.first, 1, "final chapter first QL");
equal(NUMBER_SYSTEM_FINAL_PERMANENT_QL_RANGE.last, 253, "final chapter last QL");
equal(NUMBER_SYSTEM_FINAL_PERMANENT_QL_RANGE.count, 253, "final chapter QL count");
equal(NUMBER_SYSTEM_FINAL_NEXT_PERMANENT_QL_NUMBER, 254, "next permanent QL number");

let nextExpected = 1;
for (const allocation of NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS) {
  equal(allocation.firstQlNumber, nextExpected, `${allocation.cpId}: allocation gap/overlap`);
  equal(allocation.lastQlNumber - allocation.firstQlNumber + 1, allocation.permanentQlCount, `${allocation.cpId}: range/count drift`);
  nextExpected = allocation.lastQlNumber + 1;
}
equal(nextExpected, 254, "contiguous final ledger endpoint");

const cp014 = checkpointById.get("NUM-CP-014");
ok(cp014, "missing CP-014");
ok((cp014?.dependencies.length ?? 0) >= 11, "CP-014 component dependency coverage");
ok(cp014?.taskClusters.includes("MIXED_HIDDEN_RECONSTRUCTION"), "CP-014 reconstruction cluster");
ok(cp014?.edgeClusters.includes("REDUNDANT_CLUSTER"), "CP-014 ablation edge");

const requiredAuditDimensions = [
  "SOURCE_SATURATION",
  "DIRECT_DIRECTION",
  "INVERSE_DIRECTION",
  "ANSWER_SEMANTIC",
  "EDGE_AND_BOUNDARY",
  "REPRESENTATION",
  "CROSS_CP_OWNERSHIP",
  "CROSS_CHAPTER_OWNERSHIP",
  "EXECUTABLE_PROTOTYPE",
  "INDEPENDENT_VERIFIER",
  "MERGE_SPLIT",
  "HUMAN_ENGLISH_REVIEW",
];
for (const dimension of requiredAuditDimensions) {
  ok((NUMBER_SYSTEM_DESIGN_AUDIT_DIMENSIONS as readonly string[]).includes(dimension), `missing audit dimension ${dimension}`);
}

equal(new Set(NUMBER_SYSTEM_DESIGN_AUDIT_DIMENSIONS).size, NUMBER_SYSTEM_DESIGN_AUDIT_DIMENSIONS.length, "unique audit dimensions");
equal(new Set(NUMBER_SYSTEM_DISCOVERY_DIRECTIONS).size, NUMBER_SYSTEM_DISCOVERY_DIRECTIONS.length, "unique discovery directions");
equal(new Set(NUMBER_SYSTEM_REPRESENTATION_BASELINE).size, NUMBER_SYSTEM_REPRESENTATION_BASELINE.length, "unique representation baseline");
ok(NUMBER_SYSTEM_DISCOVERY_DIRECTIONS.length >= 13, "discovery-direction coverage");
ok(NUMBER_SYSTEM_REPRESENTATION_BASELINE.length >= 14, "representation baseline coverage");
ok(NUMBER_SYSTEM_CROSS_CHAPTER_BOUNDARIES.length >= 10, "cross-chapter boundary coverage");
equal(new Set(NUMBER_SYSTEM_CROSS_CHAPTER_BOUNDARIES.map(([owner]) => owner)).size, NUMBER_SYSTEM_CROSS_CHAPTER_BOUNDARIES.length, "unique cross-chapter owners");

const packageCounts = Object.fromEntries(
  ["NUM-001", "NUM-002"].map((packageId) => [
    packageId,
    NUMBER_SYSTEM_CHECKPOINT_DESIGNS.filter((checkpoint) => checkpoint.packageId === packageId).length,
  ]),
);

console.log(JSON.stringify({
  status: "PASS_NUMBER_SYSTEM_FINAL_DESIGN_AND_IMPLEMENTATION_AUTHORITY",
  checkpointCount: NUMBER_SYSTEM_CHECKPOINT_DESIGNS.length,
  packageCounts,
  permanentCheckpointCount: NUMBER_SYSTEM_FINAL_CHECKPOINT_ALLOCATIONS.length,
  permanentChapterRange: NUMBER_SYSTEM_FINAL_PERMANENT_QL_RANGE,
  nextPermanentQlNumber: NUMBER_SYSTEM_FINAL_NEXT_PERMANENT_QL_NUMBER,
  auditDimensionCount: NUMBER_SYSTEM_DESIGN_AUDIT_DIMENSIONS.length,
  discoveryDirectionCount: NUMBER_SYSTEM_DISCOVERY_DIRECTIONS.length,
  representationCount: NUMBER_SYSTEM_REPRESENTATION_BASELINE.length,
  crossChapterBoundaryCount: NUMBER_SYSTEM_CROSS_CHAPTER_BOUNDARIES.length,
  dependencyGraphNodes: visited.size,
  cp015Exists: false,
}, null, 2));
