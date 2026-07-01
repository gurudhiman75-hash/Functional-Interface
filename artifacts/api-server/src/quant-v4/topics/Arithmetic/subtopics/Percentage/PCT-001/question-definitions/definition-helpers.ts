import {
  PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS,
} from "../eev2/percent-of-known-number/planner";
import {
  PCT_001_QUESTION_DEFINITION_VERSION,
  type Pct001QuestionDefinition,
} from "./types";

const DIFFICULTY_RULES = {
  authority: "QUESTION_DEFINITION",
  factors: [
    "UNIT_VALUE_KIND",
    "RATE_COMPLEXITY",
    "NUMBER_SIZE",
    "CONTEXT_COMPLEXITY",
  ],
  decimalUnitImplies: "Hard",
  decimalRateImplies: "Hard",
  largeOrWideScaleImplies: "Medium",
  otherwise: "Easy",
} as const;

const REALISM_RULES = {
  contextProfile: "ABSTRACT_NUMBER",
  semanticUnit: "abstract-number",
  allowTargetAbove100: false,
  requirePositiveRates: true,
  requirePositiveQuantity: true,
  requireNonZeroPresentedAnswer: true,
} as const;

export function definePct001Question(
  input: Omit<
    Pct001QuestionDefinition,
    | "definitionVersion"
    | "canonicalProblemId"
    | "taskKind"
    | "methodFamily"
    | "difficulty"
    | "realism"
  >,
): Pct001QuestionDefinition {
  return {
    ...input,
    definitionVersion: PCT_001_QUESTION_DEFINITION_VERSION,
    canonicalProblemId: "PCT-CP-002",
    taskKind: "percentOfKnownNumber",
    methodFamily: "UNIT_VALUE",
    difficulty: DIFFICULTY_RULES,
    realism: REALISM_RULES,
  };
}

export function explanationOwnership(
  detailMode: "short" | "standard" | "detailed",
): Pct001QuestionDefinition["explanation"] {
  return {
    detailMode,
    requiredRoles: PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS.filter(
      (role) => role !== "VERIFICATION",
    ),
    verificationPolicy:
      detailMode === "short"
        ? "HIDDEN"
        : detailMode === "standard"
          ? "OPTIONAL"
          : "PREFERRED",
    languageAssetAuthority: "EEV2_HUMAN_LANGUAGE_FAMILY",
    roleSelectionAuthority: "QUESTION_DEFINITION",
  };
}

export const DEFAULT_HINT_IDS = [
  "UNIT_VALUE_IDENTIFY_KNOWN_MAPPING",
  "UNIT_VALUE_FIND_ONE_PERCENT",
] as const;

export const DEFAULT_MISCONCEPTION_IDS = [
  "PERCENT_WRONG_BASE",
  "PERCENT_DIRECT_RATE_JUMP",
  "PERCENT_ROUND_TOO_EARLY",
] as const;

export const DEFAULT_VALIDATION_RULE_IDS = [
  "POSITIVE_KNOWN_RATE",
  "FINITE_VALUES",
  "SOLVER_PARITY",
  "ONE_UNIT_DERIVATION_REQUIRED",
  "EXACT_VALUE_PRESERVED",
  "APPROVED_STEM_PROVENANCE",
] as const;
