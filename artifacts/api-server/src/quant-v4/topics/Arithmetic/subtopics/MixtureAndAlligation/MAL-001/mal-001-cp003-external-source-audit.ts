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
import { solveMalCp003Request } from "./foundation/cp003-solver";
import {
  MAL_CP003_WAVE08_CONTRACT_CLASSIFICATION,
  MAL_CP003_WAVE08_EXTERNAL_SOURCE_REFERENCES,
  MAL_CP003_WAVE08_THRESHOLD_CANDIDATE_ID,
  MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS,
  solveMalCp003MinimumOperationsBelowThreshold,
  type MalCp003MinimumThresholdRequest,
} from "./foundation/cp003-external-source-wave08";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

assert(
  MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS.length === 12,
  "Wave 08 unified frontier must contain twelve candidates.",
);
assert(
  new Set(MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS).size === 12,
  "Wave 08 candidate IDs are not unique.",
);
assert(
  MAL_CP003_WAVE08_EXTERNAL_SOURCE_REFERENCES.length === 6,
  "Expected six external source observations.",
);
assert(
  MAL_CP003_WAVE08_EXTERNAL_SOURCE_REFERENCES.filter(
    (source) => source.evidenceKind === "PUBLIC_DIRECT_CONTRACT",
  ).length === 3,
  "Expected three direct public contract observations.",
);
assert(
  MAL_CP003_WAVE08_EXTERNAL_SOURCE_REFERENCES.every(
    (source) => source.retrievedOn === "2026-08-04" && source.url.startsWith("https://"),
  ),
  "External source metadata is incomplete.",
);

const classification = MAL_CP003_WAVE08_CONTRACT_CLASSIFICATION;
const classifiedIds = [
  ...classification.sourceBackedDistinctCandidateIds,
  ...classification.provisionalCandidateIds,
  ...classification.representationMergeCandidateIds,
  ...classification.excludedCandidateIds,
];
assert(classification.totalCandidateCount === 12, "Classification total changed.");
assert(classifiedIds.length === 12, "Classification buckets do not total twelve.");
assert(new Set(classifiedIds).size === 12, "A candidate appears in multiple classification buckets.");
for (const candidateId of MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS) {
  assert(classifiedIds.includes(candidateId), `Candidate ${candidateId} is unclassified.`);
}
assert(
  classification.sourceBackedDistinctCandidateIds.length === 5,
  "Expected five source-backed distinct candidates.",
);
assert(
  classification.provisionalCandidateIds.length === 4,
  "Expected four provisional candidates.",
);
assert(
  classification.representationMergeCandidateIds.length === 2,
  "Expected two representation merge candidates.",
);
assert(
  classification.excludedCandidateIds.length === 1,
  "Expected one cross-checkpoint exclusion.",
);
assert(
  classification.sourceBackedDistinctCandidateIds.includes(
    "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL",
  ),
  "Removal-quantity inverse was not promoted after direct source recovery.",
);
assert(
  classification.sourceBackedDistinctCandidateIds.includes(
    MAL_CP003_WAVE08_THRESHOLD_CANDIDATE_ID,
  ),
  "Threshold-count candidate was not added as source-backed.",
);
assert(
  classification.provisionalCandidateIds.includes(
    "MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL",
  ),
  "Exact-final operation-count contract must remain provisional.",
);
assert(
  classification.provisionalCandidateIds.includes(
    "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
  ),
  "Initial-original inverse must remain provisional because recovered source asks for the complement component.",
);

const removalFixtureOneRequest = {
  mode: "REMOVAL_QUANTITY_FROM_FINAL" as const,
  vesselVolume: rational(60),
  initialOriginalQuantity: rational(60),
  finalOriginalQuantity: rational(243, 5),
  operations: 2,
};
const removalFixtureOne = solveMalCp003Request(removalFixtureOneRequest);
assert(
  removalFixtureOne.kind === "REMOVAL_QUANTITY_PER_STAGE" &&
    equalsRational(removalFixtureOne.quantity, rational(6)),
  "60-litre direct removal source fixture must resolve to 6 litres.",
);
assert(
  verifyMalCp003Result(removalFixtureOneRequest, removalFixtureOne).ok,
  "60-litre removal fixture failed independent verification.",
);

const removalFixtureTwoRequest = {
  mode: "REMOVAL_QUANTITY_FROM_FINAL" as const,
  vesselVolume: rational(1000),
  initialOriginalQuantity: rational(1000),
  finalOriginalQuantity: rational(512),
  operations: 3,
};
const removalFixtureTwo = solveMalCp003Request(removalFixtureTwoRequest);
assert(
  removalFixtureTwo.kind === "REMOVAL_QUANTITY_PER_STAGE" &&
    equalsRational(removalFixtureTwo.quantity, rational(200)),
  "1000-litre direct removal source fixture must resolve to 200 litres.",
);
assert(
  verifyMalCp003Result(removalFixtureTwoRequest, removalFixtureTwo).ok,
  "1000-litre removal fixture failed independent verification.",
);

const thresholdFixtureRequest: MalCp003MinimumThresholdRequest = {
  vesselVolume: rational(40),
  initialOriginalQuantity: rational(40),
  removedQuantity: rational(4),
  thresholdOriginalQuantity: rational(20),
  maximumOperations: 20,
};
const thresholdFixture = solveMalCp003MinimumOperationsBelowThreshold(
  thresholdFixtureRequest,
);
assert(thresholdFixture.operations === 7, "40/4 threshold source fixture must resolve to 7 operations.");
assert(
  compareRational(
    thresholdFixture.previousOriginalQuantity,
    thresholdFixtureRequest.thresholdOriginalQuantity,
  ) >= 0,
  "Threshold source fixture crossed before the reported operation.",
);
assert(
  compareRational(
    thresholdFixture.finalOriginalQuantity,
    thresholdFixtureRequest.thresholdOriginalQuantity,
  ) < 0,
  "Threshold source fixture did not cross at the reported operation.",
);

function independentlySimulateThreshold(
  request: MalCp003MinimumThresholdRequest,
): number {
  const retainedNumerator =
    request.vesselVolume.numerator * request.removedQuantity.denominator -
    request.removedQuantity.numerator * request.vesselVolume.denominator;
  const retainedDenominator =
    request.vesselVolume.numerator * request.removedQuantity.denominator;
  const retained = rational(retainedNumerator, retainedDenominator);
  let quantity = request.initialOriginalQuantity;
  for (let operations = 1; operations <= request.maximumOperations; operations += 1) {
    quantity = multiplyRational(quantity, retained);
    if (compareRational(quantity, request.thresholdOriginalQuantity) < 0) {
      return operations;
    }
  }
  throw new Error("Independent threshold simulator found no crossing.");
}

const volumes = [24, 30, 40, 50, 60, 72, 80, 90, 96, 100, 120, 125, 144, 160, 180, 200, 240, 300, 480] as const;
const divisors = [4, 5, 6, 8, 10] as const;
const thresholdDivisors = [2, 3, 4, 5] as const;
let thresholdGridCaseCount = 0;
let thresholdMinimalityCount = 0;
let independentThresholdAgreementCount = 0;
const operationCounts = new Set<number>();
const fingerprints = new Set<string>();

for (const volume of volumes) {
  for (const removalDivisor of divisors) {
    if (volume % removalDivisor !== 0) continue;
    for (const thresholdDivisor of thresholdDivisors) {
      const request: MalCp003MinimumThresholdRequest = {
        vesselVolume: rational(volume),
        initialOriginalQuantity: rational(volume),
        removedQuantity: rational(volume / removalDivisor),
        thresholdOriginalQuantity: rational(volume, thresholdDivisor),
        maximumOperations: 100,
      };
      const solved = solveMalCp003MinimumOperationsBelowThreshold(request);
      const independent = independentlySimulateThreshold(request);
      assert(
        solved.operations === independent,
        `Threshold simulator disagreement for V=${volume}, d=${removalDivisor}, t=${thresholdDivisor}.`,
      );
      independentThresholdAgreementCount += 1;
      assert(
        compareRational(
          solved.previousOriginalQuantity,
          request.thresholdOriginalQuantity,
        ) >= 0 &&
          compareRational(
            solved.finalOriginalQuantity,
            request.thresholdOriginalQuantity,
          ) < 0,
        `Threshold minimality failed for V=${volume}, d=${removalDivisor}, t=${thresholdDivisor}.`,
      );
      thresholdMinimalityCount += 1;
      operationCounts.add(solved.operations);
      fingerprints.add(
        [
          rationalKey(request.vesselVolume),
          rationalKey(request.removedQuantity),
          rationalKey(request.thresholdOriginalQuantity),
          solved.operations,
        ].join("|"),
      );
      thresholdGridCaseCount += 1;
    }
  }
}

assert(thresholdGridCaseCount >= 250, `Threshold grid is too small: ${thresholdGridCaseCount}.`);
assert(operationCounts.size >= 8, `Threshold count diversity is too low: ${operationCounts.size}.`);
assert(fingerprints.size === thresholdGridCaseCount, "Threshold grid fingerprints are not unique.");

const noCrossingMessage = (() => {
  try {
    solveMalCp003MinimumOperationsBelowThreshold({
      vesselVolume: rational(100),
      initialOriginalQuantity: rational(100),
      removedQuantity: rational(1),
      thresholdOriginalQuantity: rational(1),
      maximumOperations: 10,
    });
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
  return "";
})();
assert(/No threshold crossing exists/u.test(noCrossingMessage), "Finite-domain no-crossing state was not rejected.");

const payload = {
  status: "PASS_MAL_CP003_EXTERNAL_SOURCE_WAVE08",
  canonicalProblemId: "MAL-CP-003",
  totalCandidateCount: classification.totalCandidateCount,
  sourceBackedDistinctCount:
    classification.sourceBackedDistinctCandidateIds.length,
  provisionalCount: classification.provisionalCandidateIds.length,
  representationMergeCandidateCount:
    classification.representationMergeCandidateIds.length,
  excludedCount: classification.excludedCandidateIds.length,
  externalSourceObservationCount:
    MAL_CP003_WAVE08_EXTERNAL_SOURCE_REFERENCES.length,
  directContractObservationCount:
    MAL_CP003_WAVE08_EXTERNAL_SOURCE_REFERENCES.filter(
      (source) => source.evidenceKind === "PUBLIC_DIRECT_CONTRACT",
    ).length,
  removalSourceFixtureCount: 2,
  thresholdSourceFixtureCount: 1,
  thresholdGridCaseCount,
  thresholdMinimalityCount,
  independentThresholdAgreementCount,
  distinctThresholdOperationCount: operationCounts.size,
  thresholdFingerprintCount: fingerprints.size,
  exactFinalOperationCountStillProvisional: true,
  initialComponentOutputMismatchStillProvisional: true,
  unequalStageLeadNotFreezeAuthority: true,
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
const jsonPath = resolve(outputDirectory, "mal-cp003-external-source-wave08.json");
const markdownPath = resolve(outputDirectory, "mal-cp003-external-source-wave08.md");
writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const markdown = [
  "# MAL-CP-003 Wave 08 — External Source Recovery",
  "",
  "> Public source recovery and executable threshold proof only. No permanent QLs or delivery gates are enabled.",
  "",
  "## Decisions",
  "",
  "- Equal removal quantity from exact final quantity is promoted to source-backed discovery.",
  "- Minimum operation count to cross a strict original-quantity threshold is added as a new source-backed discovery candidate.",
  "- Exact operation count from an exact final quantity remains provisional because it is a different equality contract.",
  "- Initial-state inverse remains provisional because the recovered previous-year question asks for the complement component.",
  "- Unequal-stage public material remains a discovery lead, not freeze authority.",
  "",
  "## Current frontier",
  "",
  `- Total candidates: ${classification.totalCandidateCount}`,
  `- Source-backed distinct: ${classification.sourceBackedDistinctCandidateIds.length}`,
  `- Provisional: ${classification.provisionalCandidateIds.length}`,
  `- Representation merge candidates: ${classification.representationMergeCandidateIds.length}`,
  `- Excluded to CP-004: ${classification.excludedCandidateIds.length}`,
  "",
  "## Threshold validation",
  "",
  `- Grid cases: ${thresholdGridCaseCount}`,
  `- Minimality proofs: ${thresholdMinimalityCount}`,
  `- Independent simulator agreements: ${independentThresholdAgreementCount}`,
  `- Distinct operation counts: ${operationCounts.size}`,
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
