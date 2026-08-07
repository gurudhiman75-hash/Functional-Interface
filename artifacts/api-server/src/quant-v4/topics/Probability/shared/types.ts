export type ProbabilityPackageId = "PRB-001" | "PRB-002";
export type ProbabilityCanonicalProblemId =
  | "PRB-CP-001" | "PRB-CP-002" | "PRB-CP-003" | "PRB-CP-004" | "PRB-CP-005"
  | "PRB-CP-006" | "PRB-CP-007" | "PRB-CP-008" | "PRB-CP-009";
export type ProbabilityDifficulty = "Easy" | "Medium" | "Hard";
export type ProbabilityLanguage = "en" | "hi" | "pa";
export type ExperimentKind =
  | "COIN_TOSS" | "DIE_ROLL" | "SPINNER" | "NUMBER_SELECTION" | "CARD_DRAW"
  | "URN_DRAW" | "RANDOM_SELECTION" | "RANDOM_ARRANGEMENT" | "COMPOUND_EXPERIMENT";
export type ReplacementPolicy = "NOT_APPLICABLE" | "WITH_REPLACEMENT" | "WITHOUT_REPLACEMENT" | "QL_CONTROLLED";
export type OrderPolicy = "ORDERED" | "UNORDERED" | "QL_CONTROLLED";
export type ProbabilityAnswerDimension = "PROBABILITY" | "COUNT" | "RATIO" | "PERCENT";
export type ProbabilityAnswerSemantic =
  | "EVENT_PROBABILITY" | "COMPLEMENT_PROBABILITY" | "CONDITIONAL_PROBABILITY"
  | "FAVOURABLE_OUTCOME_COUNT" | "TOTAL_OUTCOME_COUNT" | "ODDS_RATIO" | "EVENT_PERCENTAGE";
export type ProbabilityMethod = "DIRECT" | "COMPLEMENT" | "ADDITION" | "MULTIPLICATION" | "CONDITIONAL" | "COUNTING" | "EVENT_ALGEBRA";

export interface ExactRational { numerator: bigint; denominator: bigint; }
export interface ProbabilityValue { kind: "PROBABILITY"; exact: ExactRational; preferredDisplay: "FRACTION" | "DECIMAL" | "PERCENT"; }
export type ProbabilityAnswer = ProbabilityValue | { kind: "COUNT"; exact: bigint } | { kind: "RATIO"; exact: ExactRational } | { kind: "PERCENT"; exact: ExactRational };

export interface ExperimentStage {
  stageId: string;
  kind: ExperimentKind;
  label: string;
  outcomeField: string;
  metadata: Record<string, string | number | boolean | string[] | number[]>;
}
export interface ProbabilityExperiment {
  kind: ExperimentKind;
  stages: ExperimentStage[];
  equallyLikely: boolean;
  replacementPolicy: Exclude<ReplacementPolicy, "QL_CONTROLLED">;
  orderPolicy: Exclude<OrderPolicy, "QL_CONTROLLED">;
  sampleSpaceLabel: string;
  metadata: Record<string, string | number | boolean | string[] | number[]>;
}

export type AtomicPredicateKind =
  | "ALWAYS" | "NEVER" | "FIELD_EQUALS" | "FIELD_IN_SET" | "NUMBER_PROPERTY"
  | "COIN_PATTERN" | "COIN_HEAD_COUNT" | "DICE_SUM" | "DICE_PRODUCT" | "DICE_PARITY"
  | "CARD_PROPERTY" | "URN_COLOUR_COUNT" | "SELECTION_COMPOSITION" | "ARRANGEMENT_PROPERTY"
  | "ABSTRACT_COUNT";
export interface AtomicEvent {
  type: "ATOMIC";
  eventId: string;
  label: string;
  predicate: AtomicPredicateKind;
  args: Record<string, string | number | boolean | string[] | number[]>;
}
export interface UnionEvent { type: "UNION"; eventId: string; label: string; events: EventExpression[]; }
export interface IntersectionEvent { type: "INTERSECTION"; eventId: string; label: string; events: EventExpression[]; }
export interface ComplementEvent { type: "COMPLEMENT"; eventId: string; label: string; universeLabel: string; event: EventExpression; }
export interface ExactlyKEvent { type: "EXACTLY_K"; eventId: string; label: string; count: number; atomicEvent: AtomicEvent; }
export interface AtLeastKEvent { type: "AT_LEAST_K"; eventId: string; label: string; count: number; atomicEvent: AtomicEvent; }
export interface AtMostKEvent { type: "AT_MOST_K"; eventId: string; label: string; count: number; atomicEvent: AtomicEvent; }
export interface ConditionalEvent { type: "CONDITIONAL"; eventId: string; label: string; event: EventExpression; given: EventExpression; }
export type EventExpression = AtomicEvent | UnionEvent | IntersectionEvent | ComplementEvent | ExactlyKEvent | AtLeastKEvent | AtMostKEvent | ConditionalEvent;

export interface ProbabilityTaskRegistryEntry {
  qlId: string;
  packageId: ProbabilityPackageId;
  cpId: ProbabilityCanonicalProblemId;
  taskKind: string;
  solveMode: string;
  experimentKinds: ExperimentKind[];
  eventStrategyId: string;
  answerDimension: ProbabilityAnswerDimension;
  answerSemantic: ProbabilityAnswerSemantic;
  requiredVariables: string[];
  difficulty: ProbabilityDifficulty;
  replacementPolicy: ReplacementPolicy;
  orderPolicy: OrderPolicy;
  explanationStrategyId: string;
  distractorStrategyIds: string[];
  visualStrategyId?: string;
}

export interface ProbabilityQuestionLanguageEntry {
  qlId: string;
  locale: "en";
  stemTemplateId: string;
  stemTemplate: string;
  contextFamily: string;
  eventWording: string;
  explanationLead: string;
  terminology: Record<string, string>;
}

export interface ProbabilityPackageLibraries {
  packageId: ProbabilityPackageId;
  registry: ProbabilityTaskRegistryEntry[];
  language: ProbabilityQuestionLanguageEntry[];
  variables: Record<string, unknown>;
  experimentDomains: Record<string, unknown>;
  eventStrategies: Record<string, unknown>;
  distractorStrategies: Record<string, unknown>;
  coverageTargets: Record<string, unknown>;
  distributionTargets: Record<string, unknown>;
}

export type Scalar = string | number | boolean;
export type GeneratedParameters = Record<string, Scalar | Scalar[] | Record<string, Scalar>>;
export interface ElementaryOutcome { fields: Record<string, string | number | boolean>; weightNumerator?: bigint; weightDenominator?: bigint; }

export interface ProbabilitySolveEvidence {
  method: ProbabilityMethod;
  totalOutcomeCount?: bigint;
  favourableOutcomeCount?: bigint;
  conditionalUniverseCount?: bigint;
  intersectionCount?: bigint;
  unionCount?: bigint;
  formulaCount?: bigint;
  enumerationCount?: bigint;
  formulaTrace: string[];
  eventDescription: string;
  sampleSpaceReason: string;
  methodReason: string;
  replacementReason?: string;
  orderReason?: string;
}
export interface SolvedProbability {
  answer: ProbabilityAnswer;
  evidence: ProbabilitySolveEvidence;
  equation: string;
  exactDisplay: string;
  mathJax: string;
}
export interface VerificationResult { supported: boolean; matched: boolean; method: string; formulaValue?: string; independentValue?: string; enumeratedTotalCount?: string; enumeratedFavourableCount?: string; trace: string[]; }
export interface ProbabilityVisual { strategyId: string; kind: "GRID" | "TREE" | "VENN" | "TABLE" | "URN"; title: string; data: Record<string, unknown>; altText: string; }
export interface GeneratedOptions { options: string[]; correctIndex: number; labels: string[]; }
export interface ValidationCheck { name: string; passed: boolean; message: string; blocker: boolean; }
export interface ValidationResult { valid: boolean; checks: ValidationCheck[]; }

export interface ProbabilityGenerationInput {
  difficulty?: ProbabilityDifficulty;
  difficultyBand?: ProbabilityDifficulty;
  language?: ProbabilityLanguage;
  questionLanguageId?: string;
  seed?: string;
}

export interface ProbabilityQuestion {
  packageId: ProbabilityPackageId;
  archetypeId: ProbabilityPackageId;
  canonicalProblemId: ProbabilityCanonicalProblemId;
  questionLanguageId: string;
  questionId: string;
  seed: string;
  language: "en";
  difficultyBand: ProbabilityDifficulty;
  taskKind: string;
  solveMode: string;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  parameters: Record<string, unknown>;
  experiment: ProbabilityExperiment;
  event: EventExpression;
  solver: Record<string, unknown>;
  independentVerification: VerificationResult;
  reasoningEvidence: Record<string, unknown>;
  explanation: { explanationId: string; lines: string[]; wordCount: number; visuals: ProbabilityVisual[]; };
  validation: ValidationResult;
  maturity: "PRODUCTION_QA";
  publiclyPublishable: false;
  mathematicalFingerprint: string;
  parameterFingerprint: string;
  traceability: Record<string, unknown>;
}
