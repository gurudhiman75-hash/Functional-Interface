import {
  compareRational,
  isPositiveRational,
  multiplyRational,
  rational,
  rationalKey,
} from "./rational";
import { malCp003RetainedFraction } from "./cp003-solver";
import { MAL_CP003_UNIFIED_DISCOVERY_CANDIDATE_IDS } from "./cp003-source-runtime-wave07";
import type { Rational } from "./types";

export const MAL_CP003_WAVE08_THRESHOLD_CANDIDATE_ID =
  "MAL-CP003-PROT-MINIMUM-OPERATIONS-TO-CROSS-ORIGINAL-QUANTITY-THRESHOLD" as const;

export const MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS = [
  ...MAL_CP003_UNIFIED_DISCOVERY_CANDIDATE_IDS,
  MAL_CP003_WAVE08_THRESHOLD_CANDIDATE_ID,
] as const;

export type MalCp003Wave08CandidateId =
  (typeof MAL_CP003_WAVE08_UNIFIED_CANDIDATE_IDS)[number];

export type MalCp003ExternalSourceEvidenceKind =
  | "PUBLIC_DIRECT_CONTRACT"
  | "PUBLIC_FAMILY_EVIDENCE_OUTPUT_MISMATCH"
  | "PUBLIC_REINFORCING_EXAMPLE"
  | "DISCOVERY_LEAD_NOT_FREEZE_AUTHORITY";

export interface MalCp003ExternalSourceReference {
  sourceId: string;
  publisher: string;
  title: string;
  url: string;
  retrievedOn: "2026-08-04";
  evidenceKind: MalCp003ExternalSourceEvidenceKind;
  observedTask: string;
  candidateId: MalCp003Wave08CandidateId | null;
  decisionImpact:
    | "PROMOTE_TO_SOURCE_BACKED"
    | "ADD_NEW_SOURCE_BACKED_CANDIDATE"
    | "KEEP_PROVISIONAL_OUTPUT_MISMATCH"
    | "REINFORCE_EXISTING_SOURCE_BACKED"
    | "KEEP_AS_DISCOVERY_LEAD_ONLY";
}

export const MAL_CP003_WAVE08_EXTERNAL_SOURCE_REFERENCES:
  readonly MalCp003ExternalSourceReference[] = [
    {
      sourceId: "TESTBOOK-REMOVAL-INVERSE-60-48.6-TWO",
      publisher: "Testbook",
      title:
        "A mixture contains 60 litre of milk; x litre is repeatedly replaced and the final milk is 48.6 litres",
      url: "https://testbook.com/question-answer/a-mixture-contains-60-litre-of-milk-x-litre-of-so--5fbd10cb1fcfb452927730b7",
      retrievedOn: "2026-08-04",
      evidenceKind: "PUBLIC_DIRECT_CONTRACT",
      observedTask:
        "Given initial and final original-liquid quantities and two equal replacement operations, find the equal quantity removed per operation.",
      candidateId: "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL",
      decisionImpact: "PROMOTE_TO_SOURCE_BACKED",
    },
    {
      sourceId: "TESTBOOK-REMOVAL-INVERSE-1000-512-THREE",
      publisher: "Testbook",
      title:
        "A mixture contains 1000 litre of milk; x litre is repeatedly replaced and the final milk is 512 litres",
      url: "https://testbook.com/question-answer/a-mixture-contains-1000-litre-of-milk-x-litre-of--5fb9508bb8d6b1d5b5424a56",
      retrievedOn: "2026-08-04",
      evidenceKind: "PUBLIC_DIRECT_CONTRACT",
      observedTask:
        "Given initial and final original-liquid quantities and three equal replacement operations, find the equal quantity removed per operation.",
      candidateId: "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL",
      decisionImpact: "PROMOTE_TO_SOURCE_BACKED",
    },
    {
      sourceId: "TESTBOOK-MINIMUM-COUNT-40-4-BELOW-HALF",
      publisher: "Testbook",
      title:
        "A 40-litre milk container repeatedly replaces 4 litres; find the smallest count after which milk is less than water",
      url: "https://testbook.com/question-answer/a-container-has-40-liters-of-milk-then-4-liters--6687bf968ba7a87b6ad355f3",
      retrievedOn: "2026-08-04",
      evidenceKind: "PUBLIC_DIRECT_CONTRACT",
      observedTask:
        "Find the minimum positive number of equal replacement operations required for the original component to fall strictly below a threshold.",
      candidateId: MAL_CP003_WAVE08_THRESHOLD_CANDIDATE_ID,
      decisionImpact: "ADD_NEW_SOURCE_BACKED_CANDIDATE",
    },
    {
      sourceId: "OLIVEBOARD-LIC-AAO-2023-INITIAL-WATER",
      publisher: "Oliveboard",
      title:
        "LIC AAO Prelims 20 February 2023 Shift 1: recover initial water after three 25% replacements",
      url: "https://www.oliveboard.in/question-answer/pyq-a-vessel-contains-60-liters-mixture-of-water-and-milk-in-certain",
      retrievedOn: "2026-08-04",
      evidenceKind: "PUBLIC_FAMILY_EVIDENCE_OUTPUT_MISMATCH",
      observedTask:
        "Given total volume, repeated replacement fraction and final milk quantity, reconstruct the initial water quantity.",
      candidateId: "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
      decisionImpact: "KEEP_PROVISIONAL_OUTPUT_MISMATCH",
    },
    {
      sourceId: "PREPP-SSC-CGL-2025-FORWARD-QUANTITY",
      publisher: "Prepp",
      title:
        "SSC CGL 2025 Tier I: 30-litre pure milk vessel with 6-litre replacement repeated four times",
      url: "https://prepp.in/question/a-30-litre-container-of-pure-milk-undergoes-a-6-li-6a2c127938daf4bfa61fe009",
      retrievedOn: "2026-08-04",
      evidenceKind: "PUBLIC_REINFORCING_EXAMPLE",
      observedTask:
        "Find the final original-liquid quantity after four equal remove-and-refill operations.",
      candidateId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
      decisionImpact: "REINFORCE_EXISTING_SOURCE_BACKED",
    },
    {
      sourceId: "PUBLIC-UNEQUAL-STAGE-LEAD-75-LITRES",
      publisher: "Filo",
      title:
        "A 75-litre mixture undergoes two operations with different removal and refill quantities",
      url: "https://askfilo.com/user-question-answers-smart-solutions/75-litres-of-mixture-contain-milk-and-water-in-ratio-11-6-15-3433313033333935",
      retrievedOn: "2026-08-04",
      evidenceKind: "DISCOVERY_LEAD_NOT_FREEZE_AUTHORITY",
      observedTask:
        "Track a two-component mixture across stages with different removed and added quantities and a changing total volume.",
      candidateId:
        "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
      decisionImpact: "KEEP_AS_DISCOVERY_LEAD_ONLY",
    },
  ] as const;

export interface MalCp003MinimumThresholdRequest {
  vesselVolume: Rational;
  initialOriginalQuantity: Rational;
  removedQuantity: Rational;
  thresholdOriginalQuantity: Rational;
  maximumOperations: number;
}

export interface MalCp003MinimumThresholdResult {
  kind: "MINIMUM_OPERATION_COUNT_BELOW_THRESHOLD";
  operations: number;
  previousOriginalQuantity: Rational;
  finalOriginalQuantity: Rational;
  retainedFractionPerStage: Rational;
}

function requirePositive(name: string, value: Rational): void {
  if (!isPositiveRational(value)) {
    throw new Error(`${name} must be positive; received ${rationalKey(value)}.`);
  }
}

function validateThresholdRequest(request: MalCp003MinimumThresholdRequest): void {
  requirePositive("vessel volume", request.vesselVolume);
  requirePositive("initial original quantity", request.initialOriginalQuantity);
  requirePositive("removed quantity", request.removedQuantity);
  requirePositive("threshold original quantity", request.thresholdOriginalQuantity);
  if (
    compareRational(request.initialOriginalQuantity, request.vesselVolume) > 0
  ) {
    throw new Error("Initial original quantity cannot exceed vessel volume.");
  }
  if (
    compareRational(request.thresholdOriginalQuantity, request.initialOriginalQuantity) >=
    0
  ) {
    throw new Error(
      "Threshold must be strictly below the initial original quantity.",
    );
  }
  if (
    !Number.isInteger(request.maximumOperations) ||
    request.maximumOperations <= 0
  ) {
    throw new Error("maximumOperations must be a positive integer.");
  }
}

export function solveMalCp003MinimumOperationsBelowThreshold(
  request: MalCp003MinimumThresholdRequest,
): MalCp003MinimumThresholdResult {
  validateThresholdRequest(request);
  const retainedFractionPerStage = malCp003RetainedFraction(
    request.vesselVolume,
    request.removedQuantity,
  );
  let previousOriginalQuantity = request.initialOriginalQuantity;
  let currentOriginalQuantity = request.initialOriginalQuantity;

  for (
    let operations = 1;
    operations <= request.maximumOperations;
    operations += 1
  ) {
    previousOriginalQuantity = currentOriginalQuantity;
    currentOriginalQuantity = multiplyRational(
      currentOriginalQuantity,
      retainedFractionPerStage,
    );
    if (
      compareRational(
        currentOriginalQuantity,
        request.thresholdOriginalQuantity,
      ) < 0
    ) {
      return {
        kind: "MINIMUM_OPERATION_COUNT_BELOW_THRESHOLD",
        operations,
        previousOriginalQuantity,
        finalOriginalQuantity: currentOriginalQuantity,
        retainedFractionPerStage,
      };
    }
  }

  throw new Error(
    `No threshold crossing exists within ${request.maximumOperations} operations.`,
  );
}

export const MAL_CP003_WAVE08_CONTRACT_CLASSIFICATION = {
  totalCandidateCount: 12,
  sourceBackedDistinctCandidateIds: [
    "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS",
    "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL",
    "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS",
    "MAL-CP003-PROT-VESSEL-VOLUME-FROM-FINAL-RATIO",
    MAL_CP003_WAVE08_THRESHOLD_CANDIDATE_ID,
  ],
  provisionalCandidateIds: [
    "MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL",
    "MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL",
    "MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS",
    "MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION",
  ],
  representationMergeCandidateIds: [
    "MAL-CP003-PROT-FINAL-ORIGINAL-FRACTION-EQUAL-REPLACEMENTS",
    "MAL-CP003-PROT-FINAL-REFILL-QUANTITY-EQUAL-REPLACEMENTS",
  ],
  excludedCandidateIds: [
    "MAL-CP003-PROT-SUCCESSIVE-DILUTION-CONCENTRATION-BOUNDARY",
  ],
} as const;
