import {
  addRational,
  divideRational,
  multiplyRational,
  rational,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import {
  malCp003RetainedFraction,
  powerRational,
} from "./cp003-solver";
import {
  formatMalCp003SourceRatio,
  solveMalCp003FinalRatioSourceContract,
  solveMalCp003VesselVolumeFromFinalRatioSourceContract,
} from "./cp003-source-contract-wave04";
import type { Rational } from "./types";

export const MAL_CP003_WAVE06_APPROXIMATION_POLICY = {
  solverAuthority: "EXACT_RATIONAL_ONLY",
  generationAuthority:
    "VALID_STATE_FIRST_AND_EXACT_UNLESS_THE_STEM_EXPLICITLY_DECLARES_ROUNDING",
  roundedInverseEvidence:
    "REJECT_FOR_EXACT_INVERSE_RECONSTRUCTION_WITHOUT_AN_EXPLICIT_TOLERANCE_AND_UNIQUENESS_CONTRACT",
  displayRule:
    "ROUND_ONLY_AT_THE_FINAL_DISPLAY_BOUNDARY; NEVER_FEED_A_ROUNDED_INTERMEDIATE_BACK_INTO_THE_SOLVER",
  ratioRule: "REDUCE_EXACT_INTEGER_PARTS_AND_PRESERVE_REQUESTED_ORIENTATION",
} as const;

export const MAL_CP003_WAVE06_REJECTION_CONTRACTS = [
  {
    id: "REMOVAL_FINAL_NOT_BELOW_INITIAL",
    appliesTo: "REMOVAL_QUANTITY_FROM_FINAL",
    verdict: "REJECT",
    reason:
      "A positive remove-and-refill operation must strictly reduce the original component after at least one operation.",
  },
  {
    id: "REMOVAL_NON_EXACT_NTH_ROOT",
    appliesTo: "REMOVAL_QUANTITY_FROM_FINAL",
    verdict: "REJECT",
    reason:
      "An exact rational removal quantity cannot be reconstructed when the total retained fraction has no exact rational nth root.",
  },
  {
    id: "OPERATION_COUNT_NO_EXACT_MATCH",
    appliesTo: "OPERATION_COUNT_FROM_FINAL",
    verdict: "REJECT",
    reason:
      "A discrete operation count is valid only when exactly one integer in the declared search domain reproduces the final quantity.",
  },
  {
    id: "OPERATION_COUNT_OUTSIDE_DECLARED_DOMAIN",
    appliesTo: "OPERATION_COUNT_FROM_FINAL",
    verdict: "REJECT",
    reason:
      "A mathematically valid count outside maximumOperations is not an answer inside the declared generation contract.",
  },
  {
    id: "VESSEL_VOLUME_NON_EXACT_NTH_ROOT",
    appliesTo: "VESSEL_VOLUME_FROM_FINAL_RATIO",
    verdict: "REJECT",
    reason:
      "The final ratio must imply an exact per-stage retained fraction before an exact vessel capacity can be recovered.",
  },
  {
    id: "NON_POSITIVE_RATIO_PART",
    appliesTo: "VESSEL_VOLUME_FROM_FINAL_RATIO",
    verdict: "REJECT",
    reason: "Both final component ratio parts must be positive.",
  },
  {
    id: "REMOVAL_NOT_BELOW_VESSEL_VOLUME",
    appliesTo: "ALL_REPLACEMENT_TRANSITIONS",
    verdict: "REJECT",
    reason:
      "A homogeneous replacement stage must leave a positive amount of the pre-stage mixture.",
  },
  {
    id: "UNEQUAL_STAGE_SEQUENCE_TOO_SHORT",
    appliesTo: "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES",
    verdict: "REJECT",
    reason:
      "The unequal-stage contract requires at least two replacement stages.",
  },
  {
    id: "VECTOR_STATE_NOT_VOLUME_CONSERVING",
    appliesTo: "FINAL_THREE_COMPONENT_STATE",
    verdict: "REJECT",
    reason:
      "The component ledger must sum exactly to vessel volume before every stage.",
  },
  {
    id: "VECTOR_STAGE_SEQUENCE_TOO_SHORT",
    appliesTo: "FINAL_THREE_COMPONENT_STATE",
    verdict: "REJECT",
    reason:
      "The current three-component sequential-refill contract requires at least two stages.",
  },
] as const;

export type MalCp003Wave06MisconceptionId =
  | "ONE_STAGE_ONLY"
  | "LINEAR_SUBTRACTION_INSTEAD_OF_GEOMETRIC_RETENTION"
  | "REMOVED_FRACTION_EXPONENTIATED"
  | "COMPLEMENT_REPORTED"
  | "RATIO_REVERSED"
  | "UNREDUCED_RATIO"
  | "OPERATIONS_OFF_BY_ONE"
  | "TOTAL_RETAINED_FRACTION_USED_AS_ONE_STAGE"
  | "REMOVAL_QUANTITY_REPORTED_AS_VESSEL_VOLUME"
  | "FINAL_ORIGINAL_QUANTITY_REPORTED_AS_VESSEL_VOLUME";

export const MAL_CP003_WAVE06_DISTRACTOR_AUTHORITIES = [
  {
    learnerContract: "FINAL_ORIGINAL_QUANTITY",
    requiredMisconceptions: [
      "ONE_STAGE_ONLY",
      "LINEAR_SUBTRACTION_INSTEAD_OF_GEOMETRIC_RETENTION",
      "COMPLEMENT_REPORTED",
    ],
  },
  {
    learnerContract: "FINAL_ORIGINAL_FRACTION",
    requiredMisconceptions: [
      "ONE_STAGE_ONLY",
      "REMOVED_FRACTION_EXPONENTIATED",
      "COMPLEMENT_REPORTED",
    ],
  },
  {
    learnerContract: "FINAL_ORIGINAL_TO_REFILL_RATIO",
    requiredMisconceptions: [
      "RATIO_REVERSED",
      "ONE_STAGE_ONLY",
      "LINEAR_SUBTRACTION_INSTEAD_OF_GEOMETRIC_RETENTION",
    ],
  },
  {
    learnerContract: "OPERATION_COUNT",
    requiredMisconceptions: ["OPERATIONS_OFF_BY_ONE"],
  },
  {
    learnerContract: "VESSEL_VOLUME_FROM_FINAL_RATIO",
    requiredMisconceptions: [
      "TOTAL_RETAINED_FRACTION_USED_AS_ONE_STAGE",
      "REMOVAL_QUANTITY_REPORTED_AS_VESSEL_VOLUME",
      "RATIO_REVERSED",
    ],
  },
] as const satisfies readonly {
  learnerContract: string;
  requiredMisconceptions: readonly MalCp003Wave06MisconceptionId[];
}[];

export interface MalCp003Wave06Distractor {
  misconceptionId: MalCp003Wave06MisconceptionId;
  text: string;
}

function ratioText(first: Rational, second: Rational): string {
  return formatMalCp003SourceRatio(first, second);
}

export function buildMalCp003FinalRatioDistractors(input: {
  vesselVolume: Rational;
  removedQuantity: Rational;
  operations: number;
  requestedOrientation: "ORIGINAL_TO_REFILL" | "REFILL_TO_ORIGINAL";
}): { answer: string; distractors: readonly MalCp003Wave06Distractor[] } {
  const correct = solveMalCp003FinalRatioSourceContract(input);
  const orient = (original: Rational, refill: Rational) =>
    input.requestedOrientation === "ORIGINAL_TO_REFILL"
      ? ratioText(original, refill)
      : ratioText(refill, original);
  const answer = orient(correct.originalPart, correct.refillPart);
  const reversed = orient(correct.refillPart, correct.originalPart);

  const oneStageRetained = malCp003RetainedFraction(
    input.vesselVolume,
    input.removedQuantity,
  );
  const oneStageRefill = subtractRational(rational(1), oneStageRetained);
  const oneStage = orient(oneStageRetained, oneStageRefill);

  const linearOriginal = subtractRational(
    input.vesselVolume,
    multiplyRational(input.removedQuantity, rational(input.operations)),
  );
  const safeLinearOriginal =
    linearOriginal.numerator > 0n ? linearOriginal : input.removedQuantity;
  const linearRefill = subtractRational(input.vesselVolume, safeLinearOriginal);
  const linear = orient(safeLinearOriginal, linearRefill);

  return {
    answer,
    distractors: [
      { misconceptionId: "RATIO_REVERSED", text: reversed },
      { misconceptionId: "ONE_STAGE_ONLY", text: oneStage },
      {
        misconceptionId: "LINEAR_SUBTRACTION_INSTEAD_OF_GEOMETRIC_RETENTION",
        text: linear,
      },
    ],
  };
}

export function buildMalCp003VesselVolumeDistractors(input: {
  removedQuantity: Rational;
  operations: number;
  finalOriginalPart: Rational;
  finalRefillPart: Rational;
}): { answer: Rational; distractors: readonly { misconceptionId: MalCp003Wave06MisconceptionId; value: Rational }[] } {
  const correct = solveMalCp003VesselVolumeFromFinalRatioSourceContract(input);
  const totalParts = addRational(input.finalOriginalPart, input.finalRefillPart);
  const finalOriginalFraction = divideRational(input.finalOriginalPart, totalParts);
  const treatTotalAsOneStage = divideRational(
    input.removedQuantity,
    subtractRational(rational(1), finalOriginalFraction),
  );
  const reversedFinalOriginalFraction = divideRational(
    input.finalRefillPart,
    totalParts,
  );
  const reversedOneStage = divideRational(
    input.removedQuantity,
    subtractRational(rational(1), reversedFinalOriginalFraction),
  );
  return {
    answer: correct.vesselVolume,
    distractors: [
      {
        misconceptionId: "TOTAL_RETAINED_FRACTION_USED_AS_ONE_STAGE",
        value: treatTotalAsOneStage,
      },
      {
        misconceptionId: "REMOVAL_QUANTITY_REPORTED_AS_VESSEL_VOLUME",
        value: input.removedQuantity,
      },
      { misconceptionId: "RATIO_REVERSED", value: reversedOneStage },
    ],
  };
}

export function unreducedMalCp003Ratio(first: Rational, second: Rational): string {
  const [firstPart, secondPart] = reduceRationalRatio(first, second);
  return `${firstPart.numerator * 2n}:${secondPart.numerator * 2n}`;
}

export function malCp003FinalOriginalQuantity(input: {
  vesselVolume: Rational;
  removedQuantity: Rational;
  operations: number;
}): Rational {
  const retained = powerRational(
    malCp003RetainedFraction(input.vesselVolume, input.removedQuantity),
    input.operations,
  );
  return multiplyRational(input.vesselVolume, retained);
}
