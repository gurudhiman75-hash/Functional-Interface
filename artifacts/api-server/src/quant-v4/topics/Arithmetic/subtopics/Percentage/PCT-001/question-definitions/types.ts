import type {
  EEV2DetailMode,
  ExplanationPlan,
  RichReasoningGraph,
  StructuredExplanationBlock,
  TutorThinkingTrace,
} from "../../../../../../common/eev2/contracts";
import type {
  Pct001DifficultyBand,
  Pct001Parameters,
  Pct001SolverResult,
} from "../types";
import type { RenderedEnglishV2RoleSet } from "../eev2/percent-of-known-number/language-renderer.v2";
import type { EEV2ValidationResult } from "../eev2/percent-of-known-number/validation-types";

export const PCT_001_QUESTION_DEFINITION_VERSION = "1.0.0" as const;
export const PCT_001_QUESTION_DEFINITION_IDS = [
  "Q001", "Q002", "Q003", "Q004", "Q005",
  "Q006", "Q007", "Q008", "Q009", "Q010",
  "Q011", "Q012", "Q013", "Q014", "Q015",
  "Q016", "Q017", "Q018", "Q019", "Q020",
] as const;

export type Pct001QuestionDefinitionId =
  (typeof PCT_001_QUESTION_DEFINITION_IDS)[number];
export type Pct001PercentOfKnownQlId =
  | "PCT-QL-017"
  | "PCT-QL-117"
  | "PCT-QL-217"
  | "PCT-QL-317"
  | "PCT-QL-417";
export type RateDirection = "TARGET_GREATER" | "TARGET_SMALLER";

export interface ApprovedStemReference {
  ownership: "HUMAN_OWNED";
  provenanceStatus: "APPROVED";
  cpId: "PCT-CP-002";
  qlId: Pct001PercentOfKnownQlId;
  sourceFile: "question-language.en.json";
  stemFamilyId: string;
}

export interface RatePair {
  knownRate: number;
  targetRate: number;
  direction: RateDirection;
}

export interface VariableOwnership {
  ratePairs: readonly RatePair[];
  unitValues: readonly number[];
  arithmeticBehavior: "INTEGER_UNIT" | "TERMINATING_DECIMAL_UNIT";
  exactnessPolicy: "RATIONAL_EXACT";
  roundingBoundary: "PRESENTATION_ONLY";
}

export interface DifficultyEmergenceRules {
  authority: "QUESTION_DEFINITION";
  factors: readonly (
    | "UNIT_VALUE_KIND"
    | "RATE_COMPLEXITY"
    | "NUMBER_SIZE"
    | "CONTEXT_COMPLEXITY"
  )[];
  decimalUnitImplies: "Hard";
  decimalRateImplies: "Hard";
  largeOrWideScaleImplies: "Medium";
  otherwise: "Easy";
}

export interface ExplanationOwnership {
  detailMode: EEV2DetailMode;
  requiredRoles: readonly string[];
  verificationPolicy: "HIDDEN" | "OPTIONAL" | "PREFERRED";
  languageAssetAuthority: "EEV2_HUMAN_LANGUAGE_FAMILY";
  roleSelectionAuthority: "QUESTION_DEFINITION";
}

export interface QuestionRealismRules {
  contextProfile: "ABSTRACT_NUMBER";
  semanticUnit: "abstract-number";
  allowTargetAbove100: false;
  requirePositiveRates: true;
  requirePositiveQuantity: true;
  requireNonZeroPresentedAnswer: true;
}

export interface Pct001QuestionDefinition {
  definitionId: Pct001QuestionDefinitionId;
  definitionVersion: typeof PCT_001_QUESTION_DEFINITION_VERSION;
  canonicalProblemId: "PCT-CP-002";
  taskKind: "percentOfKnownNumber";
  methodFamily: "UNIT_VALUE";
  stem: ApprovedStemReference;
  variables: VariableOwnership;
  difficulty: DifficultyEmergenceRules;
  explanation: ExplanationOwnership;
  realism: QuestionRealismRules;
  hintIds: readonly string[];
  misconceptionIds: readonly string[];
  validationRuleIds: readonly string[];
}

export interface Pct001QuestionDefinitionInstance {
  definition: Pct001QuestionDefinition;
  seed: string;
  difficulty: Pct001DifficultyBand;
  parameters: Pct001Parameters;
  stem: string;
  solver: Pct001SolverResult;
  trace: TutorThinkingTrace;
  graph: RichReasoningGraph;
  plan: ExplanationPlan;
  renderedRoles: RenderedEnglishV2RoleSet;
  blocks: readonly StructuredExplanationBlock[];
  lines: readonly string[];
  validations: readonly EEV2ValidationResult[];
}

