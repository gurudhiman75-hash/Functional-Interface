import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  equalsRational,
  rational,
  rationalKey,
  subtractRational,
} from "./foundation/rational";
import { verifyMalCp003Result } from "./foundation/cp003-independent-verifier";
import { solveMalCp003Request } from "./foundation/cp003-solver";
import {
  MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS,
  MAL_CP003_WAVE04_SOURCE_REFERENCES,
  formatMalCp003SourceRatio,
  formatMalCp003SourceValue,
  solveMalCp003FinalRatioSourceContract,
  solveMalCp003VesselVolumeFromFinalRatioSourceContract,
} from "./foundation/cp003-source-contract-wave04";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

const textbookDirect = MAL_CP003_WAVE04_SOURCE_REFERENCES.filter(
  (source) => source.evidenceKind === "UPLOADED_TEXTBOOK_DIRECT",
);
const internalDirect = MAL_CP003_WAVE04_SOURCE_REFERENCES.filter(
  (source) => source.evidenceKind === "INTERNAL_REVIEW_DIRECT",
);
const boundaries = MAL_CP003_WAVE04_SOURCE_REFERENCES.filter(
  (source) => source.evidenceKind === "UPLOADED_TEXTBOOK_BOUNDARY",
);

assert(MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS.length === 2, "Expected two source-backed candidates.");
assert(textbookDirect.length === 3, "Expected three direct textbook observations.");
assert(internalDirect.length === 2, "Expected two direct internal review observations.");
assert(boundaries.length === 2, "Expected two textbook ownership boundaries.");
assert(
  boundaries.some((source) => source.ownerVerdict === "MAL-CP-002"),
  "CP-002 single-stage replacement boundary is missing.",
);
assert(
  boundaries.some((source) => source.ownerVerdict === "MAL-CP-004"),
  "CP-004 concentration replacement boundary is missing.",
);

// R.S. Aggarwal, Alligation or Mixture, printed page 636, question 17.
const rsQ17Request = {
  mode: "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES" as const,
  vesselVolume: rational(40),
  initialOriginalQuantity: rational(40),
  removedQuantity: rational(4),
  operations: 3,
};
const rsQ17Result = solveMalCp003Request(rsQ17Request);
assert(rsQ17Result.kind === "FINAL_ORIGINAL_QUANTITY", "Q17 returned the wrong result kind.");
assert(
  equalsRational(rsQ17Result.quantity, rational(729, 25)),
  `Q17 expected 729/25, received ${rationalKey(rsQ17Result.quantity)}.`,
);
assert(
  formatMalCp003SourceValue(rsQ17Result.quantity, {
    kind: "EXACT_INTEGER_OR_TERMINATING_DECIMAL",
    maximumDecimalPlaces: 2,
  }) === "29.16",
  "Q17 exact decimal display must be 29.16.",
);
assert(verifyMalCp003Result(rsQ17Request, rsQ17Result).ok, "Q17 failed independent verification.");

// R.S. Aggarwal, Ratio and Proportion, printed page 453, question 242.
const rsQ242Ratio = solveMalCp003FinalRatioSourceContract({
  vesselVolume: rational(50),
  removedQuantity: rational(10),
  operations: 2,
});
assert(
  formatMalCp003SourceRatio(rsQ242Ratio.originalPart, rsQ242Ratio.refillPart) === "16:9",
  "Q242 original:refill ratio must be 16:9.",
);
assert(
  formatMalCp003SourceRatio(rsQ242Ratio.refillPart, rsQ242Ratio.originalPart) === "9:16",
  "Q242 requested water:milk orientation must be 9:16.",
);

// R.S. Aggarwal, Ratio and Proportion, printed page 453, question 243.
const rsQ243Volume = solveMalCp003VesselVolumeFromFinalRatioSourceContract({
  removedQuantity: rational(8),
  operations: 4,
  finalOriginalPart: rational(16),
  finalRefillPart: rational(65),
});
assert(
  equalsRational(rsQ243Volume.vesselVolume, rational(24)),
  `Q243 expected vessel capacity 24, received ${rationalKey(rsQ243Volume.vesselVolume)}.`,
);

// ExamTree RAP-CP-017 / RAP-QL-1101 reviewed runtime evidence.
const rapQl1101Ratio = solveMalCp003FinalRatioSourceContract({
  vesselVolume: rational(80),
  removedQuantity: rational(8),
  operations: 3,
});
assert(
  formatMalCp003SourceRatio(
    rapQl1101Ratio.originalPart,
    rapQl1101Ratio.refillPart,
  ) === "729:271",
  "RAP-QL-1101 final ratio must be 729:271.",
);

// ExamTree RAP-CP-017 / RAP-QL-1102 reviewed runtime evidence.
const rapQl1102Request = {
  mode: "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES" as const,
  vesselVolume: rational(300),
  initialOriginalQuantity: rational(300),
  removedQuantity: rational(60),
  operations: 2,
};
const rapQl1102Result = solveMalCp003Request(rapQl1102Request);
assert(
  rapQl1102Result.kind === "FINAL_ORIGINAL_QUANTITY" &&
    equalsRational(rapQl1102Result.quantity, rational(192)),
  "RAP-QL-1102 final quantity must be 192 litres.",
);

assert(
  formatMalCp003SourceValue(rational(729, 10), {
    kind: "ROUND_TO_DP",
    decimalPlaces: 2,
  }) === "72.90",
  "Two-decimal policy must preserve a trailing zero.",
);
assert(
  formatMalCp003SourceValue(rational(1, 3), {
    kind: "ROUND_TO_DP",
    decimalPlaces: 2,
  }) === "0.33",
  "One-third must round to 0.33 under ROUND_TO_DP(2).",
);
assert(
  formatMalCp003SourceValue(rational(1, 3), {
    kind: "EXACT_INTEGER_OR_TERMINATING_DECIMAL",
    maximumDecimalPlaces: 4,
  }) === "1/3",
  "A non-terminating exact value must remain a fraction.",
);
assert(
  formatMalCp003SourceValue(rational(25, 2), {
    kind: "EXACT_INTEGER_OR_TERMINATING_DECIMAL",
    maximumDecimalPlaces: 2,
  }) === "12.5",
  "A terminating exact value should not gain forced zero padding.",
);

const volumes = [40, 50, 60, 72, 80, 90, 100, 120, 125, 144, 160, 200, 240, 300, 480] as const;
const divisors = [4, 5, 6, 8, 10] as const;
let gridCaseCount = 0;
let sourceRatioIdentityCount = 0;
let sourceVolumeRoundTripCount = 0;
let independentVerificationCount = 0;
const distinctRatioOutputs = new Set<string>();

for (const volume of volumes) {
  for (const divisor of divisors) {
    if (volume % divisor !== 0) continue;
    const removed = volume / divisor;
    for (let operations = 2; operations <= 5; operations += 1) {
      const request = {
        mode: "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES" as const,
        vesselVolume: rational(volume),
        initialOriginalQuantity: rational(volume),
        removedQuantity: rational(removed),
        operations,
      };
      const result = solveMalCp003Request(request);
      assert(result.kind === "FINAL_ORIGINAL_QUANTITY", "Grid case returned wrong kind.");
      const verification = verifyMalCp003Result(request, result);
      assert(verification.ok, `Grid verifier failure: ${verification.errors.join("; ")}`);
      independentVerificationCount += 1;

      const sourceRatio = solveMalCp003FinalRatioSourceContract({
        vesselVolume: rational(volume),
        removedQuantity: rational(removed),
        operations,
      });
      const refillQuantity = subtractRational(rational(volume), result.quantity);
      const solverRatioText = formatMalCp003SourceRatio(result.quantity, refillQuantity);
      const sourceRatioText = formatMalCp003SourceRatio(
        sourceRatio.originalPart,
        sourceRatio.refillPart,
      );
      assert(
        solverRatioText === sourceRatioText,
        `Ratio projection mismatch for V=${volume}, x=${removed}, n=${operations}.`,
      );
      sourceRatioIdentityCount += 1;
      distinctRatioOutputs.add(sourceRatioText);

      const reconstructed = solveMalCp003VesselVolumeFromFinalRatioSourceContract({
        removedQuantity: rational(removed),
        operations,
        finalOriginalPart: sourceRatio.originalPart,
        finalRefillPart: sourceRatio.refillPart,
      });
      assert(
        equalsRational(reconstructed.vesselVolume, rational(volume)),
        `Volume round trip failed for V=${volume}, x=${removed}, n=${operations}.`,
      );
      sourceVolumeRoundTripCount += 1;
      gridCaseCount += 1;
    }
  }
}

assert(gridCaseCount >= 180, `Expected at least 180 grid cases; received ${gridCaseCount}.`);
assert(
  distinctRatioOutputs.size >= 16,
  `Expected at least 16 distinct ratio outputs; received ${distinctRatioOutputs.size}.`,
);

const candidateDecisions = [
  {
    candidateId:
      "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS",
    status: "SOURCE_BACKED_EXECUTABLE_FIXTURE",
    kernel: "SCALAR_EQUAL_STAGE_GEOMETRIC_RETENTION",
    mergeSplitVerdict:
      "Same hidden state as final quantity/fraction, but retain as a distinct learner contract pending final representation merge/split audit because the requested answer is an ordered reduced ratio and orientation is exam-significant.",
  },
  {
    candidateId: "MAL-CP003-PROT-VESSEL-VOLUME-FROM-FINAL-RATIO",
    status: "SOURCE_BACKED_EXECUTABLE_FIXTURE",
    kernel: "SCALAR_EQUAL_STAGE_GEOMETRIC_RETENTION_INVERSE",
    mergeSplitVerdict:
      "Retain as a distinct inverse learner contract pending full source audit because the vessel capacity is unknown and the final evidence is supplied as a component ratio rather than a final quantity.",
  },
] as const;

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp003-source-contract-wave04.json");
const markdownPath = resolve(outputDirectory, "mal-cp003-source-contract-wave04.md");
const payload = {
  status: "PASS_MAL_CP003_SOURCE_CONTRACT_WAVE04",
  canonicalProblemId: "MAL-CP-003",
  sourceReferenceCount: MAL_CP003_WAVE04_SOURCE_REFERENCES.length,
  uploadedTextbookDirectCount: textbookDirect.length,
  internalReviewDirectCount: internalDirect.length,
  ownershipBoundaryCount: boundaries.length,
  sourceBackedCandidateCount: MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS.length,
  candidateDecisions,
  gridCaseCount,
  sourceRatioIdentityCount,
  sourceVolumeRoundTripCount,
  independentVerificationCount,
  distinctRatioOutputCount: distinctRatioOutputs.size,
  displayPolicyChecks: 4,
  cp002BoundaryLocked: true,
  cp004BoundaryLocked: true,
  permanentQlCount: 0,
  frozenSolveModeCount: 0,
  freezeReadiness: false,
  active: false,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
};
writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const markdown = [
  "# MAL-CP-003 Wave 04 — Source Contract Recovery",
  "",
  "> Source-backed executable fixtures only. This report does not allocate permanent QLs or freeze solve modes.",
  "",
  "## Recovered direct contracts",
  "",
  "1. Final original:new-liquid ratio after equal repeated replacement.",
  "2. Original vessel capacity reconstructed from the final original:new-liquid ratio.",
  "",
  "## Ownership boundaries",
  "",
  "- A single homogeneous remove-and-refill operation used to reach a target two-component ratio remains owned by MAL-CP-002.",
  "- Replacement by another liquid that has its own concentration is owned by MAL-CP-004 because the state transition is conserved-solute mixing, not pure geometric retention.",
  "",
  "## Display policy",
  "",
  "- Exact terminating decimals remain exact and are not converted to mixed fractions.",
  "- Explicit two-decimal instructions preserve trailing zeros.",
  "- Non-terminating exact values remain fractions unless the stem declares a rounding policy.",
  "- Ratio orientation is part of the learner contract: original:new-liquid and new-liquid:original are not interchangeable answers.",
  "",
  "## Validation",
  "",
  `- Source references: ${MAL_CP003_WAVE04_SOURCE_REFERENCES.length}`,
  `- Source-backed candidates: ${MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS.length}`,
  `- Grid cases: ${gridCaseCount}`,
  `- Ratio projection identities: ${sourceRatioIdentityCount}`,
  `- Vessel-volume inverse round trips: ${sourceVolumeRoundTripCount}`,
  `- Independent stage verifications: ${independentVerificationCount}`,
  `- Distinct ratio outputs: ${distinctRatioOutputs.size}`,
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
