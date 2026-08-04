import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  compareRational,
  equalsRational,
  multiplyRational,
  rational,
  rationalKey,
} from "./foundation/rational";
import { verifyMalCp003Result } from "./foundation/cp003-independent-verifier";
import {
  malCp003RetainedFraction,
  powerRational,
  solveMalCp003Request,
} from "./foundation/cp003-solver";
import {
  formatMalCp003SourceValue,
  solveMalCp003VesselVolumeFromFinalRatioSourceContract,
} from "./foundation/cp003-source-contract-wave04";
import {
  MAL_CP003_WAVE06_APPROXIMATION_POLICY,
  MAL_CP003_WAVE06_DISTRACTOR_AUTHORITIES,
  MAL_CP003_WAVE06_REJECTION_CONTRACTS,
  buildMalCp003FinalRatioDistractors,
  buildMalCp003VesselVolumeDistractors,
} from "./foundation/cp003-adversarial-wave06";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function expectReject(label: string, operation: () => unknown): string {
  try {
    operation();
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
  fail(`${label}: expected rejection but operation succeeded.`);
}

assert(
  MAL_CP003_WAVE06_REJECTION_CONTRACTS.length === 10,
  "Expected ten explicit rejection contracts.",
);
assert(
  new Set(MAL_CP003_WAVE06_REJECTION_CONTRACTS.map((item) => item.id)).size ===
    MAL_CP003_WAVE06_REJECTION_CONTRACTS.length,
  "Rejection contract IDs are not unique.",
);
assert(
  MAL_CP003_WAVE06_DISTRACTOR_AUTHORITIES.length === 5,
  "Expected five learner-contract distractor authorities.",
);
assert(
  MAL_CP003_WAVE06_APPROXIMATION_POLICY.solverAuthority ===
    "EXACT_RATIONAL_ONLY",
  "Exact rational solver authority changed.",
);

const rejectionEvidence = [
  {
    id: "REMOVAL_FINAL_NOT_BELOW_INITIAL",
    message: expectReject("final equals initial", () =>
      solveMalCp003Request({
        mode: "REMOVAL_QUANTITY_FROM_FINAL",
        vesselVolume: rational(100),
        initialOriginalQuantity: rational(100),
        finalOriginalQuantity: rational(100),
        operations: 2,
      }),
    ),
  },
  {
    id: "REMOVAL_NON_EXACT_NTH_ROOT",
    message: expectReject("non-exact square root", () =>
      solveMalCp003Request({
        mode: "REMOVAL_QUANTITY_FROM_FINAL",
        vesselVolume: rational(100),
        initialOriginalQuantity: rational(100),
        finalOriginalQuantity: rational(50),
        operations: 2,
      }),
    ),
  },
  {
    id: "OPERATION_COUNT_NO_EXACT_MATCH",
    message: expectReject("operation count no match", () =>
      solveMalCp003Request({
        mode: "OPERATION_COUNT_FROM_FINAL",
        vesselVolume: rational(100),
        initialOriginalQuantity: rational(100),
        finalOriginalQuantity: rational(50),
        removedQuantity: rational(20),
        maximumOperations: 10,
      }),
    ),
  },
  {
    id: "OPERATION_COUNT_OUTSIDE_DECLARED_DOMAIN",
    message: expectReject("operation count outside domain", () =>
      solveMalCp003Request({
        mode: "OPERATION_COUNT_FROM_FINAL",
        vesselVolume: rational(100),
        initialOriginalQuantity: rational(100),
        finalOriginalQuantity: rational(256, 5),
        removedQuantity: rational(20),
        maximumOperations: 2,
      }),
    ),
  },
  {
    id: "VESSEL_VOLUME_NON_EXACT_NTH_ROOT",
    message: expectReject("vessel non-exact root", () =>
      solveMalCp003VesselVolumeFromFinalRatioSourceContract({
        removedQuantity: rational(10),
        operations: 2,
        finalOriginalPart: rational(1),
        finalRefillPart: rational(1),
      }),
    ),
  },
  {
    id: "NON_POSITIVE_RATIO_PART",
    message: expectReject("zero ratio part", () =>
      solveMalCp003VesselVolumeFromFinalRatioSourceContract({
        removedQuantity: rational(10),
        operations: 2,
        finalOriginalPart: rational(0),
        finalRefillPart: rational(1),
      }),
    ),
  },
  {
    id: "REMOVAL_NOT_BELOW_VESSEL_VOLUME",
    message: expectReject("remove entire vessel", () =>
      malCp003RetainedFraction(rational(40), rational(40)),
    ),
  },
  {
    id: "UNEQUAL_STAGE_SEQUENCE_TOO_SHORT",
    message: expectReject("one unequal stage", () =>
      solveMalCp003Request({
        mode: "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES",
        vesselVolume: rational(100),
        initialOriginalQuantity: rational(100),
        removedQuantities: [rational(20)],
      }),
    ),
  },
  {
    id: "VECTOR_STATE_NOT_VOLUME_CONSERVING",
    message: expectReject("bad vector total", () =>
      solveMalCp003Request({
        mode: "FINAL_THREE_COMPONENT_STATE",
        vesselVolume: rational(100),
        initialState: {
          componentA: rational(90),
          componentB: rational(5),
          componentC: rational(0),
        },
        stages: [
          { removedQuantity: rational(20), refillComponent: "B" },
          { removedQuantity: rational(20), refillComponent: "C" },
        ],
      }),
    ),
  },
  {
    id: "VECTOR_STAGE_SEQUENCE_TOO_SHORT",
    message: expectReject("one vector stage", () =>
      solveMalCp003Request({
        mode: "FINAL_THREE_COMPONENT_STATE",
        vesselVolume: rational(100),
        initialState: {
          componentA: rational(100),
          componentB: rational(0),
          componentC: rational(0),
        },
        stages: [{ removedQuantity: rational(20), refillComponent: "B" }],
      }),
    ),
  },
] as const;

assert(
  rejectionEvidence.length === MAL_CP003_WAVE06_REJECTION_CONTRACTS.length,
  "Every rejection contract must have executable evidence.",
);
for (const contract of MAL_CP003_WAVE06_REJECTION_CONTRACTS) {
  assert(
    rejectionEvidence.some((evidence) => evidence.id === contract.id),
    `Missing rejection evidence for ${contract.id}.`,
  );
}

const roundedFinalEvidenceMessage = expectReject(
  "rounded final quantity fed into exact inverse",
  () =>
    solveMalCp003Request({
      mode: "REMOVAL_QUANTITY_FROM_FINAL",
      vesselVolume: rational(40),
      initialOriginalQuantity: rational(40),
      finalOriginalQuantity: rational(146, 5),
      operations: 3,
    }),
);
assert(
  /exact repeated-replacement quantity/iu.test(roundedFinalEvidenceMessage),
  "Rounded inverse evidence was not rejected by the exact-root gate.",
);
assert(
  formatMalCp003SourceValue(rational(729, 25), {
    kind: "EXACT_INTEGER_OR_TERMINATING_DECIMAL",
    maximumDecimalPlaces: 2,
  }) === "29.16",
  "Exact source value 29.16 must remain exact.",
);
assert(
  formatMalCp003SourceValue(rational(729, 10), {
    kind: "ROUND_TO_DP",
    decimalPlaces: 2,
  }) === "72.90",
  "Explicit two-decimal output must preserve its trailing zero.",
);

const volumes = [40, 50, 60, 72, 80, 90, 96, 100, 120, 125, 144, 160, 200, 240, 300, 480] as const;
const divisors = [4, 5, 6, 8, 10] as const;
let monotonicSequenceCount = 0;
let monotonicComparisonCount = 0;
let exactRemovalRoundTripCount = 0;
let exactOperationCountRoundTripCount = 0;
let independentVerificationCount = 0;

for (const volume of volumes) {
  for (const divisor of divisors) {
    if (volume % divisor !== 0) continue;
    const removed = volume / divisor;
    const stageFraction = malCp003RetainedFraction(
      rational(volume),
      rational(removed),
    );
    let previous = rational(volume);
    for (let operations = 1; operations <= 10; operations += 1) {
      const current = multiplyRational(
        rational(volume),
        powerRational(stageFraction, operations),
      );
      assert(
        compareRational(current, previous) < 0,
        `Retention sequence is not strictly decreasing for V=${volume}, x=${removed}, n=${operations}.`,
      );
      previous = current;
      monotonicComparisonCount += 1;
    }
    monotonicSequenceCount += 1;

    for (let operations = 2; operations <= 5; operations += 1) {
      const final = multiplyRational(
        rational(volume),
        powerRational(stageFraction, operations),
      );
      const removalRequest = {
        mode: "REMOVAL_QUANTITY_FROM_FINAL" as const,
        vesselVolume: rational(volume),
        initialOriginalQuantity: rational(volume),
        finalOriginalQuantity: final,
        operations,
      };
      const removalResult = solveMalCp003Request(removalRequest);
      assert(
        removalResult.kind === "REMOVAL_QUANTITY_PER_STAGE" &&
          equalsRational(removalResult.quantity, rational(removed)),
        `Removal inverse round trip failed for V=${volume}, x=${removed}, n=${operations}.`,
      );
      assert(
        verifyMalCp003Result(removalRequest, removalResult).ok,
        "Removal inverse failed independent verification.",
      );
      exactRemovalRoundTripCount += 1;
      independentVerificationCount += 1;

      const countRequest = {
        mode: "OPERATION_COUNT_FROM_FINAL" as const,
        vesselVolume: rational(volume),
        initialOriginalQuantity: rational(volume),
        finalOriginalQuantity: final,
        removedQuantity: rational(removed),
        maximumOperations: 10,
      };
      const countResult = solveMalCp003Request(countRequest);
      assert(
        countResult.kind === "OPERATION_COUNT" &&
          countResult.operations === operations,
        `Operation count round trip failed for V=${volume}, x=${removed}, n=${operations}.`,
      );
      assert(
        verifyMalCp003Result(countRequest, countResult).ok,
        "Operation count failed independent verification.",
      );
      exactOperationCountRoundTripCount += 1;
      independentVerificationCount += 1;
    }
  }
}

assert(monotonicSequenceCount >= 50, "Insufficient monotonic sequence coverage.");
assert(exactRemovalRoundTripCount >= 200, "Insufficient removal inverse coverage.");
assert(exactOperationCountRoundTripCount >= 200, "Insufficient operation-count coverage.");

const ratioSourceCase = buildMalCp003FinalRatioDistractors({
  vesselVolume: rational(50),
  removedQuantity: rational(10),
  operations: 2,
  requestedOrientation: "REFILL_TO_ORIGINAL",
});
assert(ratioSourceCase.answer === "9:16", "Source ratio answer must be 9:16.");
assert(
  new Set([
    ratioSourceCase.answer,
    ...ratioSourceCase.distractors.map((item) => item.text),
  ]).size === 4,
  "Source ratio options are not unique.",
);
assert(
  new Set(ratioSourceCase.distractors.map((item) => item.misconceptionId)).size === 3,
  "Source ratio distractors do not cover three distinct misconceptions.",
);

const vesselSourceCase = buildMalCp003VesselVolumeDistractors({
  removedQuantity: rational(8),
  operations: 4,
  finalOriginalPart: rational(16),
  finalRefillPart: rational(65),
});
assert(
  equalsRational(vesselSourceCase.answer, rational(24)),
  `Source vessel answer must be 24, received ${rationalKey(vesselSourceCase.answer)}.`,
);
assert(
  new Set([
    rationalKey(vesselSourceCase.answer),
    ...vesselSourceCase.distractors.map((item) => rationalKey(item.value)),
  ]).size === 4,
  "Source vessel options are not unique.",
);

const payload = {
  status: "PASS_MAL_CP003_ADVERSARIAL_WAVE06",
  canonicalProblemId: "MAL-CP-003",
  rejectionContractCount: MAL_CP003_WAVE06_REJECTION_CONTRACTS.length,
  executableRejectionEvidenceCount: rejectionEvidence.length,
  approximationPolicy: MAL_CP003_WAVE06_APPROXIMATION_POLICY,
  roundedInverseEvidenceRejected: true,
  distractorAuthorityCount: MAL_CP003_WAVE06_DISTRACTOR_AUTHORITIES.length,
  sourceRatioDistractorCount: ratioSourceCase.distractors.length,
  sourceVesselDistractorCount: vesselSourceCase.distractors.length,
  monotonicSequenceCount,
  monotonicComparisonCount,
  exactRemovalRoundTripCount,
  exactOperationCountRoundTripCount,
  independentVerificationCount,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  freezeReadiness: false,
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
};

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp003-adversarial-wave06.json");
const markdownPath = resolve(outputDirectory, "mal-cp003-adversarial-wave06.md");
writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const markdown = [
  "# MAL-CP-003 Wave 06 — Adversarial and Approximation Audit",
  "",
  "> This wave hardens discovery behavior. It does not freeze any QL or solve mode.",
  "",
  "## Exactness policy",
  "",
  "- Canonical solving remains exact rational arithmetic.",
  "- Rounded final evidence cannot be fed back into an exact inverse solver.",
  "- Rounding is allowed only when explicitly declared by the stem and applied at the final display boundary.",
  "- Ratio outputs remain exact, reduced and orientation-sensitive.",
  "",
  "## Rejection coverage",
  "",
  ...MAL_CP003_WAVE06_REJECTION_CONTRACTS.map(
    (contract) => `- \`${contract.id}\`: ${contract.reason}`,
  ),
  "",
  "## Validation totals",
  "",
  `- Rejection contracts: ${MAL_CP003_WAVE06_REJECTION_CONTRACTS.length}`,
  `- Monotonic sequences: ${monotonicSequenceCount}`,
  `- Monotonic comparisons: ${monotonicComparisonCount}`,
  `- Exact removal inverse round trips: ${exactRemovalRoundTripCount}`,
  `- Exact operation-count round trips: ${exactOperationCountRoundTripCount}`,
  `- Independent verifications: ${independentVerificationCount}`,
  "",
  "## Freeze status",
  "",
  "Permanent QLs: **0**",
  "",
  "Frozen solve modes: **0**",
  "",
  "Freeze readiness: **false**",
  "",
];
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(JSON.stringify({ ...payload, auditJson: jsonPath, auditMarkdown: markdownPath }, null, 2));
