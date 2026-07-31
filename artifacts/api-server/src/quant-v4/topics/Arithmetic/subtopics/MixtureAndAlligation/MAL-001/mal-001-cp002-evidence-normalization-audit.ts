import {
  malCp002StateEvidenceFingerprint,
  normalizeMalCp002StateEvidence,
  normalizeMalCp002TargetAdjustmentEvidence,
  type MalCp002StateEvidence,
} from "./foundation/cp002-evidence-normalizer";
import { verifyMalCp002Result } from "./foundation/cp002-independent-verifier";
import { generateMalCp002Parameters } from "./foundation/cp002-parameter-generator";
import {
  malCp002ResultFingerprint,
  reduceMalCp002StateRatio,
  solveMalCp002Request,
} from "./foundation/cp002-solver";
import {
  addRational,
  equalsRational,
  rationalKey,
} from "./foundation/rational";
import type { MalCp002State } from "./foundation/cp002-types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function sameState(first: MalCp002State, second: MalCp002State): boolean {
  return (
    equalsRational(first.componentA, second.componentA) &&
    equalsRational(first.componentB, second.componentB)
  );
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? `${item}n` : item,
  );
}

function stateFingerprint(state: MalCp002State): string {
  return `${rationalKey(state.componentA)}:${rationalKey(state.componentB)}`;
}

const stateSeeds = 200;
const adjustmentSeeds = 200;
let normalizationCount = 0;
let deterministicNormalizationCount = 0;
let exactStateRecoveryCount = 0;
let targetAdjustmentNormalizationCount = 0;
let solverPreservationCount = 0;
let independentVerificationCount = 0;
const evidenceKindCounts = new Map<string, number>();
const recoveredStateFingerprints = new Set<string>();
const evidenceFingerprints = new Set<string>();
const operationDirections = new Set<string>();

for (let index = 0; index < stateSeeds; index += 1) {
  const seed = `cp002-evidence-state-${index}`;
  const generated = generateMalCp002Parameters(
    "MAL-CP002-PROT-COMPONENTS-FROM-TOTAL-AND-RATIO",
    seed,
  );
  assert(
    generated.request.mode === "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO",
    `${seed}: unexpected generator request mode.`,
  );
  const solved = solveMalCp002Request(generated.request);
  assert(
    solved.kind === "COMPONENT_QUANTITY_PAIR",
    `${seed}: expected component quantity pair.`,
  );
  const expectedState = {
    componentA: solved.componentAQuantity,
    componentB: solved.componentBQuantity,
  };

  const evidences: MalCp002StateEvidence[] = [
    {
      kind: "TOTAL_AND_RATIO",
      totalQuantity: generated.request.totalQuantity,
      ratio: generated.request.ratio,
    },
    {
      kind: "ONE_COMPONENT_AND_RATIO",
      knownComponent: "A",
      knownQuantity: expectedState.componentA,
      ratio: generated.request.ratio,
    },
    {
      kind: "ONE_COMPONENT_AND_RATIO",
      knownComponent: "B",
      knownQuantity: expectedState.componentB,
      ratio: generated.request.ratio,
    },
  ];

  for (const evidence of evidences) {
    const first = normalizeMalCp002StateEvidence(evidence);
    const second = normalizeMalCp002StateEvidence(evidence);
    assert(
      stable(first) === stable(second),
      `${seed}/${evidence.kind}: normalization is not deterministic.`,
    );
    deterministicNormalizationCount += 1;
    assert(
      sameState(first.state, expectedState),
      `${seed}/${evidence.kind}: normalized state ${stateFingerprint(
        first.state,
      )} differs from expected ${stateFingerprint(expectedState)}.`,
    );
    assert(
      equalsRational(
        first.totalQuantity,
        addRational(expectedState.componentA, expectedState.componentB),
      ),
      `${seed}/${evidence.kind}: normalized total is incorrect.`,
    );
    exactStateRecoveryCount += 1;
    normalizationCount += 1;
    evidenceKindCounts.set(
      evidence.kind,
      (evidenceKindCounts.get(evidence.kind) ?? 0) + 1,
    );
    recoveredStateFingerprints.add(stateFingerprint(first.state));
    evidenceFingerprints.add(malCp002StateEvidenceFingerprint(evidence));
  }
}

for (const prototypeId of [
  "MAL-CP002-PROT-ADD-COMPONENT-FOR-TARGET-RATIO",
  "MAL-CP002-PROT-REMOVE-COMPONENT-FOR-TARGET-RATIO",
] as const) {
  for (let index = 0; index < adjustmentSeeds; index += 1) {
    const seed = `cp002-evidence-adjustment-${prototypeId}-${index}`;
    const generated = generateMalCp002Parameters(prototypeId, seed);
    assert(
      generated.request.mode === "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET",
      `${prototypeId}/${seed}: unexpected request mode.`,
    );
    const explicitSolution = solveMalCp002Request(generated.request);
    const initialRatio = reduceMalCp002StateRatio(
      generated.request.initialState,
    );
    const initialTotal = addRational(
      generated.request.initialState.componentA,
      generated.request.initialState.componentB,
    );
    const knownComponent = index % 2 === 0 ? "A" : "B";
    const knownQuantity =
      knownComponent === "A"
        ? generated.request.initialState.componentA
        : generated.request.initialState.componentB;

    const evidenceVariants: MalCp002StateEvidence[] = [
      {
        kind: "TOTAL_AND_RATIO",
        totalQuantity: initialTotal,
        ratio: initialRatio,
      },
      {
        kind: "ONE_COMPONENT_AND_RATIO",
        knownComponent,
        knownQuantity,
        ratio: initialRatio,
      },
    ];

    for (const initialEvidence of evidenceVariants) {
      const evidenceRequest = {
        mode: "UNKNOWN_PURE_ADJUSTMENT_FROM_STATE_EVIDENCE" as const,
        initialEvidence,
        changedComponent: generated.request.changedComponent,
        adjustmentKind: generated.request.adjustmentKind,
        targetRatio: generated.request.targetRatio,
      };
      const firstNormalized = normalizeMalCp002TargetAdjustmentEvidence(
        evidenceRequest,
      );
      const secondNormalized = normalizeMalCp002TargetAdjustmentEvidence(
        evidenceRequest,
      );
      assert(
        stable(firstNormalized) === stable(secondNormalized),
        `${prototypeId}/${seed}/${initialEvidence.kind}: target-adjustment normalization is not deterministic.`,
      );
      deterministicNormalizationCount += 1;
      assert(
        sameState(
          firstNormalized.normalizedEvidence.state,
          generated.request.initialState,
        ),
        `${prototypeId}/${seed}/${initialEvidence.kind}: evidence did not recover the canonical initial state.`,
      );
      const normalizedSolution = solveMalCp002Request(
        firstNormalized.canonicalRequest,
      );
      assert(
        malCp002ResultFingerprint(normalizedSolution) ===
          malCp002ResultFingerprint(explicitSolution),
        `${prototypeId}/${seed}/${initialEvidence.kind}: evidence normalization changed the exact solution.`,
      );
      const verification = verifyMalCp002Result(
        firstNormalized.canonicalRequest,
        normalizedSolution,
      );
      assert(
        verification.ok,
        `${prototypeId}/${seed}/${initialEvidence.kind}: independent verification failed: ${verification.errors.join(
          "; ",
        )}`,
      );
      targetAdjustmentNormalizationCount += 1;
      solverPreservationCount += 1;
      independentVerificationCount += 1;
      normalizationCount += 1;
      evidenceKindCounts.set(
        initialEvidence.kind,
        (evidenceKindCounts.get(initialEvidence.kind) ?? 0) + 1,
      );
      evidenceFingerprints.add(
        malCp002StateEvidenceFingerprint(initialEvidence),
      );
      operationDirections.add(
        `${generated.request.adjustmentKind}_${generated.request.changedComponent}`,
      );
    }
  }
}

for (const requiredDirection of [
  "ADD_A",
  "ADD_B",
  "REMOVE_A",
  "REMOVE_B",
]) {
  assert(
    operationDirections.has(requiredDirection),
    `Evidence-normalized adjustment corpus does not cover ${requiredDirection}.`,
  );
}
assert(
  normalizationCount === 1400,
  `Expected 1400 total normalizations, received ${normalizationCount}.`,
);
assert(
  deterministicNormalizationCount === normalizationCount,
  `Only ${deterministicNormalizationCount}/${normalizationCount} normalizations were checked deterministically.`,
);
assert(
  evidenceKindCounts.get("TOTAL_AND_RATIO") === 600,
  `Expected 600 TOTAL_AND_RATIO normalizations, received ${
    evidenceKindCounts.get("TOTAL_AND_RATIO") ?? 0
  }.`,
);
assert(
  evidenceKindCounts.get("ONE_COMPONENT_AND_RATIO") === 800,
  `Expected 800 ONE_COMPONENT_AND_RATIO normalizations, received ${
    evidenceKindCounts.get("ONE_COMPONENT_AND_RATIO") ?? 0
  }.`,
);
assert(
  recoveredStateFingerprints.size >= 180,
  `Only ${recoveredStateFingerprints.size}/${stateSeeds} reconstructed state fingerprints.`,
);
assert(
  evidenceFingerprints.size >= 1000,
  `Only ${evidenceFingerprints.size} distinct evidence fingerprints.`,
);

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP002_EVIDENCE_NORMALIZATION",
      canonicalProblemId: "MAL-CP-002",
      permanentQlCount: 0,
      frozenSolveModeCount: 0,
      stateSeeds,
      adjustmentSeedsPerPrototype: adjustmentSeeds,
      normalizationCount,
      deterministicNormalizationCount,
      exactStateRecoveryCount,
      targetAdjustmentNormalizationCount,
      solverPreservationCount,
      independentVerificationCount,
      evidenceKindCounts: Object.fromEntries(
        [...evidenceKindCounts.entries()].sort(),
      ),
      distinctEvidenceFingerprintCount: evidenceFingerprints.size,
      distinctRecoveredStateCount: recoveredStateFingerprints.size,
      operationDirections: [...operationDirections].sort(),
      representationInfrastructureReady: true,
      learnerRepresentationGapsClosed: false,
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
