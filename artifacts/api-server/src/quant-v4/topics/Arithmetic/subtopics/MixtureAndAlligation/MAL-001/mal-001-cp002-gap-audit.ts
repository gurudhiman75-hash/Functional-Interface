import {
  MAL_CP002_COVERAGE_MATRIX,
  MAL_CP002_IMPLEMENT_NEXT_CONTRACT_IDS,
} from "./foundation/cp002-coverage-matrix";
import { MAL_CP002_DISCOVERY_REGISTRY } from "./foundation/cp002-discovery-registry";
import { MAL_CP002_SOURCE_OWNERSHIP_FINDINGS } from "./foundation/cp002-source-ownership-ledger";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const contractIds = new Set(
  MAL_CP002_COVERAGE_MATRIX.map((row) => row.contractId),
);
assert(
  contractIds.size === MAL_CP002_COVERAGE_MATRIX.length,
  "MAL-CP-002 coverage matrix contains duplicate contract IDs.",
);

const executableRegistryEntries = MAL_CP002_DISCOVERY_REGISTRY.filter(
  (entry) => entry.discoveryStatus === "EXECUTABLE_DISCOVERY",
);
const pendingRegistryEntries = MAL_CP002_DISCOVERY_REGISTRY.filter(
  (entry) =>
    entry.discoveryStatus === "SOURCE_RECOVERED_BOUNDARY_PENDING_EXECUTION",
);

const coveredPrototypeIds = new Set(
  MAL_CP002_COVERAGE_MATRIX.filter(
    (row) => row.status === "COVERED_EXECUTABLE",
  ).flatMap((row) => row.mappedPrototypeIds),
);
const representedPrototypeIds = new Set(
  MAL_CP002_COVERAGE_MATRIX.flatMap((row) => row.mappedPrototypeIds),
);

for (const entry of executableRegistryEntries) {
  assert(
    coveredPrototypeIds.has(entry.prototypeId),
    `${entry.prototypeId}: executable discovery prototype is not mapped to a covered contract.`,
  );
}
for (const entry of pendingRegistryEntries) {
  assert(
    representedPrototypeIds.has(entry.prototypeId),
    `${entry.prototypeId}: pending boundary prototype is absent from the coverage matrix.`,
  );
  assert(
    !coveredPrototypeIds.has(entry.prototypeId),
    `${entry.prototypeId}: pending boundary prototype was incorrectly marked covered executable.`,
  );
}

for (const row of MAL_CP002_COVERAGE_MATRIX) {
  assert(row.contractId.startsWith("CP002-"), `${row.contractId}: invalid contract ID prefix.`);
  if (row.status === "COVERED_EXECUTABLE") {
    assert(
      row.mappedPrototypeIds.length > 0,
      `${row.contractId}: covered row has no executable prototype mapping.`,
    );
  }
  if (row.priority === "IMPLEMENT_NEXT") {
    assert(
      row.ownership === "MAL-CP-002" ||
        row.ownership === "MAL-CP-002_CP003_BOUNDARY",
      `${row.contractId}: implementation priority points to another owner's contract.`,
    );
    assert(
      row.status === "REPRESENTATION_GAP" ||
        row.status === "TASK_GAP" ||
        row.status === "EDGE_GAP",
      `${row.contractId}: implementation priority has non-actionable status ${row.status}.`,
    );
  }
  if (row.status === "EXCLUDED_OTHER_OWNER") {
    assert(
      row.priority === "DEFER_TO_OWNER",
      `${row.contractId}: excluded row is not deferred to its owner.`,
    );
    assert(
      !["MAL-CP-002", "MAL-CP-002_CP003_BOUNDARY"].includes(row.ownership),
      `${row.contractId}: CP-002-owned row was marked excluded to another owner.`,
    );
  }
  if (row.status === "NON_UNIQUE_WITHOUT_MORE_EVIDENCE") {
    assert(
      row.priority === "NO_EXECUTION",
      `${row.contractId}: non-unique task was scheduled for execution.`,
    );
  }
}

assert(
  MAL_CP002_IMPLEMENT_NEXT_CONTRACT_IDS.length > 0,
  "Coverage audit found no implementation gaps; this would falsely imply freeze readiness.",
);
assert(
  new Set(MAL_CP002_IMPLEMENT_NEXT_CONTRACT_IDS).size ===
    MAL_CP002_IMPLEMENT_NEXT_CONTRACT_IDS.length,
  "Implement-next contract list contains duplicates.",
);
for (const contractId of MAL_CP002_IMPLEMENT_NEXT_CONTRACT_IDS) {
  assert(contractIds.has(contractId), `${contractId}: implement-next row is absent from the matrix.`);
}

const requiredOtherOwners = new Set(["MAL-CP-001", "MAL-CP-003", "MAL-CP-004", "RAP"]);
const excludedOwners = new Set(
  MAL_CP002_COVERAGE_MATRIX.filter(
    (row) => row.status === "EXCLUDED_OTHER_OWNER",
  ).map((row) => row.ownership),
);
for (const owner of requiredOtherOwners) {
  assert(excludedOwners.has(owner as any), `Coverage matrix does not preserve the ${owner} boundary.`);
}

assert(
  MAL_CP002_COVERAGE_MATRIX.some(
    (row) =>
      row.contractId === "CP002-GAP-SINGLE-REMOVE-REFILL-FORWARD" &&
      row.ownership === "MAL-CP-002_CP003_BOUNDARY" &&
      row.priority === "IMPLEMENT_NEXT",
  ),
  "Forward closure for single remove-refill is missing from the expansion plan.",
);
assert(
  MAL_CP002_COVERAGE_MATRIX.some(
    (row) =>
      row.contractId === "CP002-GAP-HOMOGENEOUS-REMOVAL-RATIO-INVARIANCE" &&
      row.status === "EDGE_GAP",
  ),
  "Homogeneous-removal ratio invariance edge is missing.",
);
assert(
  MAL_CP002_COVERAGE_MATRIX.some(
    (row) =>
      row.contractId === "CP002-GAP-OPERATION-FEASIBILITY" &&
      row.taskDirection === "PREDICATE",
  ),
  "Operation-feasibility predicate gap is missing.",
);
assert(
  MAL_CP002_COVERAGE_MATRIX.some(
    (row) =>
      row.contractId === "CP002-NONUNIQUE-FINAL-RATIO-ONLY-REVERSE-REPLACEMENT" &&
      row.status === "NON_UNIQUE_WITHOUT_MORE_EVIDENCE",
  ),
  "The non-unique reverse-replacement state is not protected from accidental authoring.",
);
assert(
  MAL_CP002_COVERAGE_MATRIX.some(
    (row) =>
      row.contractId === "CP002-GAP-THREE-COMPONENT-COUPLED-ADDITION" &&
      row.priority === "SOURCE_REQUIRED",
  ),
  "The CP-001 three-component referral lost its source-required boundary status.",
);

const sourceOwners = new Set(
  MAL_CP002_SOURCE_OWNERSHIP_FINDINGS.map((finding) => finding.ownershipVerdict),
);
for (const owner of [
  "MAL-CP-002",
  "MAL-CP-002_CP003_BOUNDARY",
  "MAL-CP-001_BOUNDARY",
  "MAL-CP-003_EXCLUDED",
  "MAL-CP-004_EXCLUDED",
  "RAP_BOUNDARY",
]) {
  assert(sourceOwners.has(owner as any), `Source/ownership ledger is missing ${owner}.`);
}

const statusCounts = Object.fromEntries(
  [...new Set(MAL_CP002_COVERAGE_MATRIX.map((row) => row.status))]
    .sort()
    .map((status) => [
      status,
      MAL_CP002_COVERAGE_MATRIX.filter((row) => row.status === status).length,
    ]),
);
const priorityCounts = Object.fromEntries(
  [...new Set(MAL_CP002_COVERAGE_MATRIX.map((row) => row.priority))]
    .sort()
    .map((priority) => [
      priority,
      MAL_CP002_COVERAGE_MATRIX.filter((row) => row.priority === priority).length,
    ]),
);
const ownershipCounts = Object.fromEntries(
  [...new Set(MAL_CP002_COVERAGE_MATRIX.map((row) => row.ownership))]
    .sort()
    .map((ownership) => [
      ownership,
      MAL_CP002_COVERAGE_MATRIX.filter((row) => row.ownership === ownership).length,
    ]),
);

const unresolvedRows = MAL_CP002_COVERAGE_MATRIX.filter(
  (row) =>
    row.status !== "COVERED_EXECUTABLE" &&
    row.status !== "EXCLUDED_OTHER_OWNER" &&
    row.status !== "NON_UNIQUE_WITHOUT_MORE_EVIDENCE",
);
const freezeReadiness = false;
assert(unresolvedRows.length > 0, "Gap matrix contains no unresolved CP-002 work.");
assert(freezeReadiness === false, "CP-002 must not be freeze-ready while residual gaps remain.");

assert(
  MAL_CP002_DISCOVERY_REGISTRY.every(
    (entry) =>
      entry.permanentQlId === null &&
      entry.active === false &&
      entry.publiclyPublishable === false &&
      entry.questionStudioDiscoverable === false &&
      entry.questionBankWritable === false &&
      entry.testEligible === false,
  ),
  "Gap audit detected lifecycle leakage in the discovery registry.",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP002_COVERAGE_GAP_AUDIT",
      canonicalProblemId: "MAL-CP-002",
      permanentQlCount: 0,
      frozenSolveModeCount: 0,
      coverageRowCount: MAL_CP002_COVERAGE_MATRIX.length,
      coveredExecutableRowCount:
        statusCounts.COVERED_EXECUTABLE ?? 0,
      executablePrototypeCount: executableRegistryEntries.length,
      pendingBoundaryPrototypeCount: pendingRegistryEntries.length,
      representedPrototypeCount: representedPrototypeIds.size,
      unresolvedGapCount: unresolvedRows.length,
      implementNextCount: MAL_CP002_IMPLEMENT_NEXT_CONTRACT_IDS.length,
      implementNextContractIds: MAL_CP002_IMPLEMENT_NEXT_CONTRACT_IDS,
      statusCounts,
      priorityCounts,
      ownershipCounts,
      freezeReadiness,
      freezeBlockers: unresolvedRows.map((row) => ({
        contractId: row.contractId,
        status: row.status,
        priority: row.priority,
        ownership: row.ownership,
      })),
      active: false,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      discoveryCountsFrozen: false,
    },
    null,
    2,
  ),
);
