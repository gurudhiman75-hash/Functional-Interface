import {
  MAL_CP002_DISCOVERY_REGISTRY,
  MAL_CP002_MILK_WATER_CONTEXT_CAP_PERCENT,
} from "./foundation/cp002-discovery-registry";
import { MAL_CP002_DISCOVERY_FIXTURES } from "./foundation/cp002-discovery-fixtures";
import { verifyMalCp002Result } from "./foundation/cp002-independent-verifier";
import {
  malCp002ResultFingerprint,
  solveMalCp002Request,
} from "./foundation/cp002-solver";
import {
  MAL_CP002_SOURCE_OWNERSHIP_FINDINGS,
} from "./foundation/cp002-source-ownership-ledger";
import {
  MAL_CP002_DISCOVERY_PROTOTYPE_IDS,
  type MalCp002ExecutablePrototypeId,
} from "./foundation/cp002-types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? `${item}n` : item,
  );
}

const registryIds = new Set(
  MAL_CP002_DISCOVERY_REGISTRY.map((entry) => entry.prototypeId),
);
assert(
  registryIds.size === MAL_CP002_DISCOVERY_REGISTRY.length,
  "MAL-CP-002 registry contains duplicate prototype IDs.",
);
assert(
  registryIds.size === MAL_CP002_DISCOVERY_PROTOTYPE_IDS.length,
  "MAL-CP-002 type and registry prototype frontiers differ.",
);
for (const prototypeId of MAL_CP002_DISCOVERY_PROTOTYPE_IDS) {
  assert(registryIds.has(prototypeId), `${prototypeId} is missing from the registry.`);
}

for (const entry of MAL_CP002_DISCOVERY_REGISTRY) {
  assert(entry.cpId === "MAL-CP-002", `${entry.prototypeId}: wrong CP owner.`);
  assert(entry.permanentQlId === null, `${entry.prototypeId}: permanent QL allocated during discovery.`);
  assert(entry.active === false, `${entry.prototypeId}: discovery candidate became active.`);
  assert(
    entry.publiclyPublishable === false,
    `${entry.prototypeId}: discovery candidate became publishable.`,
  );
  assert(
    entry.questionStudioDiscoverable === false,
    `${entry.prototypeId}: discovery candidate leaked into Question Studio.`,
  );
  assert(
    entry.questionBankWritable === false,
    `${entry.prototypeId}: discovery candidate became Question Bank writable.`,
  );
  assert(
    entry.testEligible === false,
    `${entry.prototypeId}: discovery candidate became test eligible.`,
  );
}

const executableEntries = MAL_CP002_DISCOVERY_REGISTRY.filter(
  (entry) => entry.discoveryStatus === "EXECUTABLE_DISCOVERY",
);
const pendingEntries = MAL_CP002_DISCOVERY_REGISTRY.filter(
  (entry) =>
    entry.discoveryStatus === "SOURCE_RECOVERED_BOUNDARY_PENDING_EXECUTION",
);
const executableIds = new Set(
  executableEntries.map((entry) => entry.prototypeId as MalCp002ExecutablePrototypeId),
);
const fixtureCoverage = new Map<MalCp002ExecutablePrototypeId, number>();

let deterministicCount = 0;
let exactFingerprintCount = 0;
let independentVerificationCount = 0;
const operationDirections = new Set<string>();
const resultKinds = new Set<string>();

for (const fixture of MAL_CP002_DISCOVERY_FIXTURES) {
  assert(
    executableIds.has(fixture.prototypeId),
    `${fixture.fixtureId}: fixture targets a non-executable prototype.`,
  );
  fixtureCoverage.set(
    fixture.prototypeId,
    (fixtureCoverage.get(fixture.prototypeId) ?? 0) + 1,
  );

  const first = solveMalCp002Request(fixture.request);
  const second = solveMalCp002Request(fixture.request);
  assert(
    stable(first) === stable(second),
    `${fixture.fixtureId}: solver is not deterministic.`,
  );
  deterministicCount += 1;

  const fingerprint = malCp002ResultFingerprint(first);
  assert(
    fingerprint === fixture.expectedFingerprint,
    `${fixture.fixtureId}: expected ${fixture.expectedFingerprint}, received ${fingerprint}.`,
  );
  exactFingerprintCount += 1;

  const verification = verifyMalCp002Result(fixture.request, first);
  assert(
    verification.ok,
    `${fixture.fixtureId}: independent verification failed: ${verification.errors.join("; ")}`,
  );
  independentVerificationCount += 1;
  resultKinds.add(first.kind);

  if (
    fixture.request.mode === "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET" ||
    fixture.request.mode === "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT" ||
    fixture.request.mode === "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT"
  ) {
    operationDirections.add(
      `${fixture.request.adjustmentKind}_${fixture.request.changedComponent}`,
    );
  }
  if (fixture.request.mode === "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET") {
    operationDirections.add(
      `REPLACE_WITH_${fixture.request.replacementComponent}`,
    );
  }
}

for (const executableId of executableIds) {
  assert(
    (fixtureCoverage.get(executableId) ?? 0) > 0,
    `${executableId}: executable prototype has no discovery fixture.`,
  );
}
for (const pendingEntry of pendingEntries) {
  assert(
    !fixtureCoverage.has(
      pendingEntry.prototypeId as MalCp002ExecutablePrototypeId,
    ),
    `${pendingEntry.prototypeId}: pending source-recovered boundary was treated as executable.`,
  );
}

for (const requiredDirection of [
  "ADD_A",
  "ADD_B",
  "REMOVE_A",
  "REMOVE_B",
  "REPLACE_WITH_A",
  "REPLACE_WITH_B",
]) {
  assert(
    operationDirections.has(requiredDirection),
    `Discovery fixtures do not cover ${requiredDirection}.`,
  );
}

const sourceFindingIds = new Set(
  MAL_CP002_SOURCE_OWNERSHIP_FINDINGS.map((finding) => finding.findingId),
);
assert(
  sourceFindingIds.size === MAL_CP002_SOURCE_OWNERSHIP_FINDINGS.length,
  "CP-002 source/ownership ledger contains duplicate finding IDs.",
);
assert(
  MAL_CP002_SOURCE_OWNERSHIP_FINDINGS.some(
    (finding) =>
      finding.sourceLabel ===
        "MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION" &&
      finding.ownershipVerdict === "MAL-CP-002" &&
      finding.disposition === "SOURCE_RECOVERED_PENDING_EXECUTION",
  ),
  "The explicit CP-001 three-way relation referral is missing.",
);
assert(
  MAL_CP002_SOURCE_OWNERSHIP_FINDINGS.some(
    (finding) => finding.ownershipVerdict === "MAL-CP-003_EXCLUDED",
  ),
  "Repeated replacement is not explicitly excluded to CP-003.",
);
assert(
  MAL_CP002_SOURCE_OWNERSHIP_FINDINGS.some(
    (finding) => finding.ownershipVerdict === "MAL-CP-004_EXCLUDED",
  ),
  "Concentration transformations are not explicitly excluded to CP-004.",
);
assert(
  MAL_CP002_SOURCE_OWNERSHIP_FINDINGS.some(
    (finding) => finding.ownershipVerdict === "RAP_BOUNDARY",
  ),
  "The pure ratio-and-proportion boundary is missing.",
);
assert(
  MAL_CP002_MILK_WATER_CONTEXT_CAP_PERCENT === 22,
  "The inherited milk-water context cap changed unexpectedly.",
);
assert(
  MAL_CP002_DISCOVERY_PROTOTYPE_IDS.every(
    (prototypeId) => !prototypeId.includes("REPEATED"),
  ),
  "Repeated replacement leaked into the CP-002 prototype frontier.",
);

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP002_OPEN_EXECUTABLE_DISCOVERY",
      canonicalProblemId: "MAL-CP-002",
      permanentQlCount: 0,
      frozenSolveModeCount: 0,
      currentDiscoveryPrototypeCount: MAL_CP002_DISCOVERY_REGISTRY.length,
      executableDiscoveryPrototypeCount: executableEntries.length,
      pendingBoundaryPrototypeCount: pendingEntries.length,
      fixtureCount: MAL_CP002_DISCOVERY_FIXTURES.length,
      deterministicCount,
      exactFingerprintCount,
      independentVerificationCount,
      coveredOperationDirections: [...operationDirections].sort(),
      coveredResultKinds: [...resultKinds].sort(),
      sourceOwnershipFindingCount:
        MAL_CP002_SOURCE_OWNERSHIP_FINDINGS.length,
      milkWaterContextCapPercent:
        MAL_CP002_MILK_WATER_CONTEXT_CAP_PERCENT,
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
