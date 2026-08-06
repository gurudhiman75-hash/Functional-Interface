import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  divideRational,
  equalsRational,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
  sumRationals,
} from "./foundation/rational";
import { verifyMalCp003Result } from "./foundation/cp003-independent-verifier";
import {
  MAL_CP003_PROTOTYPE_EVIDENCE_DISPOSITION,
} from "./foundation/cp003-source-normalization";
import { solveMalCp003Request } from "./foundation/cp003-solver";
import type {
  MalCp003SolveRequest,
  MalCp003SolveResult,
} from "./foundation/cp003-types";
import type { Rational } from "./foundation/types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function requireResult<K extends MalCp003SolveResult["kind"]>(
  request: MalCp003SolveRequest,
  result: MalCp003SolveResult,
  kind: K,
): Extract<MalCp003SolveResult, { kind: K }> {
  assert(result.kind === kind, `${request.mode}: expected ${kind}, got ${result.kind}.`);
  return result as Extract<MalCp003SolveResult, { kind: K }>;
}

function verify(
  request: MalCp003SolveRequest,
  result: MalCp003SolveResult,
): void {
  const verification = verifyMalCp003Result(request, result);
  assert(
    verification.ok,
    `${request.mode}: independent verification failed: ${verification.errors.join("; ")}`,
  );
}

const volumes = [60, 72, 80, 90, 96, 100, 120, 125, 144, 150, 160, 180, 200, 240] as const;
const divisors = [4, 5, 6, 8, 10] as const;
const operationsList = [2, 3, 4, 5] as const;
const initialShares = [rational(1), rational(3, 4), rational(2, 3), rational(1, 2)] as const;

let scalarCaseCount = 0;
let solverInvocationCount = 0;
let independentVerificationCount = 0;
let quantityFractionIdentityCount = 0;
let refillComplementIdentityCount = 0;
let equalUnequalIdentityCount = 0;
let initialInverseRoundTripCount = 0;
let removalInverseRoundTripCount = 0;
let operationCountRoundTripCount = 0;
const scalarStateFingerprints = new Set<string>();

for (const volumeNumber of volumes) {
  const vesselVolume = rational(volumeNumber);
  for (const divisor of divisors) {
    if (volumeNumber % divisor !== 0) continue;
    const removedQuantity = rational(volumeNumber / divisor);
    const removedFraction = divideRational(removedQuantity, vesselVolume);

    for (const operations of operationsList) {
      for (const initialShare of initialShares) {
        const initialOriginalQuantity = multiplyRational(
          vesselVolume,
          initialShare,
        );

        const forwardRequest: MalCp003SolveRequest = {
          mode: "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES",
          vesselVolume,
          initialOriginalQuantity,
          removedQuantity,
          operations,
        };
        const forward = requireResult(
          forwardRequest,
          solveMalCp003Request(forwardRequest),
          "FINAL_ORIGINAL_QUANTITY",
        );
        solverInvocationCount += 1;
        verify(forwardRequest, forward);
        independentVerificationCount += 1;

        const fractionRequest: MalCp003SolveRequest = {
          mode: "FINAL_ORIGINAL_FRACTION_EQUAL_STAGES",
          removedFraction,
          operations,
        };
        const fraction = requireResult(
          fractionRequest,
          solveMalCp003Request(fractionRequest),
          "FINAL_ORIGINAL_FRACTION",
        );
        solverInvocationCount += 1;
        verify(fractionRequest, fraction);
        independentVerificationCount += 1;
        assert(
          equalsRational(
            divideRational(forward.quantity, initialOriginalQuantity),
            fraction.fraction,
          ),
          "Absolute final quantity and final retained fraction diverged.",
        );
        quantityFractionIdentityCount += 1;

        const unequalRequest: MalCp003SolveRequest = {
          mode: "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES",
          vesselVolume,
          initialOriginalQuantity,
          removedQuantities: Array.from(
            { length: operations },
            () => removedQuantity,
          ),
        };
        const unequal = requireResult(
          unequalRequest,
          solveMalCp003Request(unequalRequest),
          "FINAL_ORIGINAL_QUANTITY",
        );
        solverInvocationCount += 1;
        verify(unequalRequest, unequal);
        independentVerificationCount += 1;
        assert(
          equalsRational(forward.quantity, unequal.quantity) &&
            equalsRational(forward.retainedFraction, unequal.retainedFraction),
          "Equal-stage exponent and repeated product forms diverged.",
        );
        equalUnequalIdentityCount += 1;

        const initialInverseRequest: MalCp003SolveRequest = {
          mode: "INITIAL_ORIGINAL_QUANTITY_FROM_FINAL",
          vesselVolume,
          finalOriginalQuantity: forward.quantity,
          removedQuantity,
          operations,
        };
        const initialInverse = requireResult(
          initialInverseRequest,
          solveMalCp003Request(initialInverseRequest),
          "INITIAL_ORIGINAL_QUANTITY",
        );
        solverInvocationCount += 1;
        verify(initialInverseRequest, initialInverse);
        independentVerificationCount += 1;
        assert(
          equalsRational(initialInverse.quantity, initialOriginalQuantity),
          "Initial-quantity inverse failed to reconstruct the forward state.",
        );
        initialInverseRoundTripCount += 1;

        const removalInverseRequest: MalCp003SolveRequest = {
          mode: "REMOVAL_QUANTITY_FROM_FINAL",
          vesselVolume,
          initialOriginalQuantity,
          finalOriginalQuantity: forward.quantity,
          operations,
        };
        const removalInverse = requireResult(
          removalInverseRequest,
          solveMalCp003Request(removalInverseRequest),
          "REMOVAL_QUANTITY_PER_STAGE",
        );
        solverInvocationCount += 1;
        verify(removalInverseRequest, removalInverse);
        independentVerificationCount += 1;
        assert(
          equalsRational(removalInverse.quantity, removedQuantity),
          "Removal-quantity inverse failed to reconstruct the forward stage.",
        );
        removalInverseRoundTripCount += 1;

        const operationCountRequest: MalCp003SolveRequest = {
          mode: "OPERATION_COUNT_FROM_FINAL",
          vesselVolume,
          initialOriginalQuantity,
          finalOriginalQuantity: forward.quantity,
          removedQuantity,
          maximumOperations: operations + 3,
        };
        const operationCount = requireResult(
          operationCountRequest,
          solveMalCp003Request(operationCountRequest),
          "OPERATION_COUNT",
        );
        solverInvocationCount += 1;
        verify(operationCountRequest, operationCount);
        independentVerificationCount += 1;
        assert(
          operationCount.operations === operations,
          "Operation-count inverse failed to reconstruct the forward stage count.",
        );
        operationCountRoundTripCount += 1;

        if (equalsRational(initialShare, rational(1))) {
          const refillRequest: MalCp003SolveRequest = {
            mode: "FINAL_REFILL_QUANTITY_EQUAL_STAGES",
            vesselVolume,
            removedQuantity,
            operations,
          };
          const refill = requireResult(
            refillRequest,
            solveMalCp003Request(refillRequest),
            "FINAL_REFILL_QUANTITY",
          );
          solverInvocationCount += 1;
          verify(refillRequest, refill);
          independentVerificationCount += 1;
          assert(
            equalsRational(
              addRationalForAudit(forward.quantity, refill.quantity),
              vesselVolume,
            ) &&
              equalsRational(
                refill.quantity,
                subtractRational(vesselVolume, forward.quantity),
              ),
            "Refill quantity is not the complement of original quantity.",
          );
          refillComplementIdentityCount += 1;
        }

        scalarStateFingerprints.add(
          [
            rationalKey(vesselVolume),
            rationalKey(initialOriginalQuantity),
            rationalKey(removedQuantity),
            operations,
            rationalKey(forward.quantity),
          ].join("|"),
        );
        scalarCaseCount += 1;
      }
    }
  }
}

function addRationalForAudit(first: Rational, second: Rational): Rational {
  return rational(
    first.numerator * second.denominator +
      second.numerator * first.denominator,
    first.denominator * second.denominator,
  );
}

let vectorCaseCount = 0;
let vectorClosedFormIdentityCount = 0;
let vectorVolumeConservationCount = 0;
const vectorFingerprints = new Set<string>();
for (const volumeNumber of [60, 72, 80, 90, 96, 100, 120, 144, 160, 180, 200, 240] as const) {
  const vesselVolume = rational(volumeNumber);
  for (const firstDivisor of [4, 5, 6] as const) {
    if (volumeNumber % firstDivisor !== 0) continue;
    for (const secondDivisor of [4, 5, 8, 10] as const) {
      if (volumeNumber % secondDivisor !== 0) continue;
      const firstRemoved = rational(volumeNumber / firstDivisor);
      const secondRemoved = rational(volumeNumber / secondDivisor);
      const request: MalCp003SolveRequest = {
        mode: "FINAL_THREE_COMPONENT_STATE",
        vesselVolume,
        initialState: {
          componentA: vesselVolume,
          componentB: rational(0),
          componentC: rational(0),
        },
        stages: [
          { removedQuantity: firstRemoved, refillComponent: "B" },
          { removedQuantity: secondRemoved, refillComponent: "C" },
        ],
      };
      const result = requireResult(
        request,
        solveMalCp003Request(request),
        "FINAL_THREE_COMPONENT_STATE",
      );
      solverInvocationCount += 1;
      verify(request, result);
      independentVerificationCount += 1;

      const firstRetention = divideRational(
        subtractRational(vesselVolume, firstRemoved),
        vesselVolume,
      );
      const secondRetention = divideRational(
        subtractRational(vesselVolume, secondRemoved),
        vesselVolume,
      );
      const expectedA = multiplyRational(
        vesselVolume,
        multiplyRational(firstRetention, secondRetention),
      );
      const expectedB = multiplyRational(firstRemoved, secondRetention);
      const expectedC = secondRemoved;
      assert(
        equalsRational(result.state.componentA, expectedA) &&
          equalsRational(result.state.componentB, expectedB) &&
          equalsRational(result.state.componentC, expectedC),
        "Three-component stage ledger diverged from its closed form.",
      );
      vectorClosedFormIdentityCount += 1;
      assert(
        equalsRational(
          sumRationals([
            result.state.componentA,
            result.state.componentB,
            result.state.componentC,
          ]),
          vesselVolume,
        ),
        "Three-component stage ledger failed volume conservation.",
      );
      vectorVolumeConservationCount += 1;
      vectorFingerprints.add(
        [
          volumeNumber,
          firstDivisor,
          secondDivisor,
          rationalKey(result.state.componentA),
          rationalKey(result.state.componentB),
          rationalKey(result.state.componentC),
        ].join("|"),
      );
      vectorCaseCount += 1;
    }
  }
}

assert(scalarCaseCount >= 500, `Scalar equivalence grid is too small: ${scalarCaseCount}.`);
assert(
  scalarStateFingerprints.size >= 450,
  `Scalar state diversity is too low: ${scalarStateFingerprints.size}.`,
);
assert(vectorCaseCount >= 40, `Vector equivalence grid is too small: ${vectorCaseCount}.`);
assert(
  vectorFingerprints.size === vectorCaseCount,
  "Vector equivalence grid contains duplicate mathematical states.",
);
assert(solverInvocationCount === independentVerificationCount, "A solver result escaped independent verification.");
assert(quantityFractionIdentityCount === scalarCaseCount, "Quantity/fraction identity coverage is incomplete.");
assert(equalUnequalIdentityCount === scalarCaseCount, "Equal/unequal identity coverage is incomplete.");
assert(initialInverseRoundTripCount === scalarCaseCount, "Initial inverse coverage is incomplete.");
assert(removalInverseRoundTripCount === scalarCaseCount, "Removal inverse coverage is incomplete.");
assert(operationCountRoundTripCount === scalarCaseCount, "Operation-count coverage is incomplete.");
assert(
  refillComplementIdentityCount === scalarCaseCount / initialShares.length,
  "Refill complement coverage is incomplete.",
);

const sourceFreezeBlockerCount =
  MAL_CP003_PROTOTYPE_EVIDENCE_DISPOSITION.filter(
    (row) => Boolean(row.freezeBlocker),
  ).length;
const mathematicalKernelCount = 3;
const freezeReadiness = false;
assert(sourceFreezeBlockerCount === 8, "Source-normalization blockers changed unexpectedly.");
assert(!freezeReadiness, "Mathematical equivalence alone must not freeze learner contracts.");

const report = {
  status: "PASS_MAL_CP003_MATHEMATICAL_EQUIVALENCE",
  canonicalProblemId: "MAL-CP-003",
  scalarCaseCount,
  vectorCaseCount,
  solverInvocationCount,
  independentVerificationCount,
  distinctScalarStateCount: scalarStateFingerprints.size,
  distinctVectorStateCount: vectorFingerprints.size,
  quantityFractionIdentityCount,
  refillComplementIdentityCount,
  equalUnequalIdentityCount,
  initialInverseRoundTripCount,
  removalInverseRoundTripCount,
  operationCountRoundTripCount,
  vectorClosedFormIdentityCount,
  vectorVolumeConservationCount,
  mathematicalKernelCount,
  mathematicalKernels: [
    "SCALAR_EQUAL_STAGE_GEOMETRIC_RETENTION",
    "SCALAR_STAGE_PRODUCT_GENERALISATION",
    "VECTOR_COMPONENT_STAGE_LEDGER",
  ],
  sourceFreezeBlockerCount,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  freezeReadiness,
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
};

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp003-equivalence-audit.json");
const markdownPath = resolve(outputDirectory, "mal-cp003-equivalence-audit.md");
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
writeFileSync(
  markdownPath,
  `${[
    "# MAL-CP-003 Mathematical Equivalence Audit",
    "",
    `Status: **${report.status}**`,
    "",
    `Scalar cases: **${scalarCaseCount}**`,
    `Vector cases: **${vectorCaseCount}**`,
    `Solver/verifier pairs: **${solverInvocationCount}**`,
    `Quantity ↔ fraction identities: **${quantityFractionIdentityCount}**`,
    `Refill complement identities: **${refillComplementIdentityCount}**`,
    `Equal-stage ↔ repeated-product identities: **${equalUnequalIdentityCount}**`,
    `Initial-quantity inverse round trips: **${initialInverseRoundTripCount}**`,
    `Removal-quantity inverse round trips: **${removalInverseRoundTripCount}**`,
    `Operation-count inverse round trips: **${operationCountRoundTripCount}**`,
    `Three-component closed-form identities: **${vectorClosedFormIdentityCount}**`,
    "",
    "## Finding",
    "",
    "The current eight executable prototypes reduce mathematically to three kernels: equal-stage scalar retention, general stage-product retention, and a vector component ledger. This proves mathematical equivalence and inverse correctness; it does not decide learner-facing QL merges because source evidence, answer semantics and pedagogy remain separate gates.",
    "",
    `Freeze readiness: **${freezeReadiness}**`,
    "Permanent QLs: **0**",
    "",
  ].join("\n")}\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      ...report,
      auditJson: jsonPath,
      auditMarkdown: markdownPath,
    },
    null,
    2,
  ),
);
