import type {
  CompatiblePatternType,
  MotifDifficultyBand,
  MotifReasoningType,
  QuantMotif,
} from "../motifs/types";
import { ALL_PATTERNS } from "../patterns";
import { ALL_MOTIFS } from "../motifs";
import {
  createFallbackArchetype,
  FORMULA_QUANT_ARCHETYPES,
  selectQuantArchetype,
} from "../archetypes/quant-archetypes";
import {
  applyDifficultyMetadata,
  buildDifficultyBalancedSet,
  calculateDifficultyMetadata,
  classifyDifficultyLabel,
  estimateDifficultyScore,
  validateDifficultyTarget,
} from "./difficulty";
import {
  buildExamRealismMetadata,
  getExamProfileConfig,
} from "./exam-realism";
import {
  createDomainAdapters,
  resolveDomainAdapter,
} from "./domain-adapters";
import {
  buildSeatingRealismAnalysis,
} from "./reasoning-realism";
import {
  extractPatternIntelligence,
} from "./pattern-extractors";
import {
  buildStructuralSignature,
} from "./structural-signatures";
import {
  buildCorpusAlignmentScore,
} from "./corpus-alignment";
import {
  applyTopicConfigToOptions,
  applyTopicConfigToPattern,
  resolveTopicConfig,
} from "./topic-config";
import {
  buildDifficultyConfidence,
} from "./difficulty-confidence";
import {
  buildOriginalityScore,
} from "./originality-score";
import {
  assessProceduralQuality,
} from "./quality-filter";
import {
  cacheGenerationResult,
  getCachedGenerationResult,
} from "../generation-cache";
import {
  resetStructuralDiversityRegistry,
} from "../reasoning/seating/diversity-engine";
import {
  createCorpusSchedulerState,
  generateScheduledQuestion,
  summarizeCorpusScheduler,
  type CorpusSchedulerProfileId,
} from "../../quant-v2/corpus-scheduler/corpus-scheduler";
import { evaluateCorpusQuality } from "../../quant-v2/corpus-scheduler/corpus-quality-evaluator";
import {
  buildSeatingDiagramData,
  buildSeatingExplanationFlow,
  buildBloodRelationExplanation,
  buildBloodRelationOptions,
  buildBloodRelationStem,
  buildCodingDistractorOptions,
  buildCodingExplanation,
  buildCodingQuestionStem,
  buildDirectionSenseExplanation,
  buildDirectionSenseOptions,
  buildDirectionSenseStem,
  buildInequalityExplanation,
  buildInequalityOptions,
  buildInequalityStem,
  createPatternInferenceScenario,
  createAbstractReasoningScenario,
  createCriticalInferenceScenario,
  createTemporalReasoningScenario,
  ReasoningEngine,
  buildSeatingExplanationForQuestion,
  buildSeatingOptionsForQuestion,
  buildSeatingStemForQuestion,
  createBloodRelationScenario,
  createDirectionSenseScenario,
  createInequalityScenario,
  createSeatingScenario,
  encodeWordByMotif,
  LOGIC_REASONING_ARCHETYPES,
  pickCodingWord,
} from "../reasoning";
import {
  buildMotifAwareExplanation,
  buildDIScenarioState,
  generateDIQuestions,
  generateDISet,
  getSeriesConfig,
  evaluateFormula,
  generateValues,
  getMotifFormulaCompatibility,
  getRequestedDifficultyLabel,
  getTargetDifficultyScore,
  inferQuantTopicCluster,
  realizeQuestion,
} from "../quant";
import {
  createQuantProceduralScenario,
} from "../quant-scenarios";
import {
  createQuantV2PercentageQuestionCandidate,
  isQuantV2PercentageEnabled,
  isQuantV2PercentagePattern,
} from "../quant-v2/percentage-admin-adapter";
import {
  normalizeQuantMathText,
  normalizeQuantOptionValue,
} from "../quant-scenarios/mathjax";
import {
  createEnglishScenario,
} from "../english";
import {
  createPunjabiScenario,
} from "../verbal/punjabi-engine";
import {
  createComputerAwarenessScenario,
  createGeneralKnowledgeScenario,
} from "../../generators/knowledge";
import {
  generateNumericOptions,
  alignReasoningStepsWithMotif,
  attachReasoningTrace,
  buildReasoningErrorMetadata,
  CompatibilityIssue,
  CompatibilityResult,
  countMatches,
  extractTemplatePlaceholders,
  fillTemplate,
  createGenerationContext,
  getGenerationContext,
  generateScenario,
  hasAnyToken,
  isReasoningEngineError,
  normalizeNumericValue,
  pickRandomItem,
  pickRandomTemplate,
  pickMotif,
  ReasoningEngineError,
  renderExplanation,
  renderNamedTemplate,
  runWithGenerationContext,
  buildQuantPrompt,
  validateArchetypeCompatibility,
  validatePatternCompatibility,
  validateFormulaReferences,
  validateQuestionRealization,
} from "../shared";
import type {
  GenerationContext,
  OptionResult,
  ReasoningOperation,
  ReasoningStep,
} from "../shared";
import type {
  SeatingDiagramData,
  SeatingExplanationFlow,
} from "@workspace/api-zod";
import type {
  DomainAdapter,
  DomainGenerationContext,
  DifficultyMetrics,
  Scenario,
  ValidationReport,
} from "./domain-adapters";
import type {
  ExtractedPatternIntelligence,
} from "./pattern-extractors";
import type {
  StructuralSignature,
} from "./structural-signatures";
import type {
  CorpusAlignmentScore,
} from "./corpus-alignment";
import type {
  DifficultyConfidence,
} from "./difficulty-confidence";
import type {
  OriginalityScore,
} from "./originality-score";
import type {
  QualityAssessment,
  QualityThresholds,
} from "./quality-filter";
import type {
  ReasoningRealismAnalysis,
} from "./reasoning-realism";
import type {
  InferenceStep,
  InferenceTraceExport,
} from "../reasoning/seating-validator";
import type {
  InferenceDependencyGraph,
} from "../reasoning/seating/inference-dependency-graph";
export {
  buildDifficultyBalancedSet,
  calculateDifficultyMetadata,
  classifyDifficultyLabel,
  estimateDifficultyScore,
  validateDifficultyTarget,
} from "./difficulty";
export type { ReasoningOperation, ReasoningStep } from "../shared";
type ValueRange = {
  min: number;
  max: number;
};

export type DifficultyLabel =
  | "Easy"
  | "Medium"
  | "Hard";

export type ExamProfileId =
  | "custom"
  | "ssc"
  | "ibps"
  | "cat"
  | "sbi"
  | "rrb"
  /** Punjab PSC / PSSSB / state-board style quant (SSC-like speed + ratio mix). */
  | "punjab_state";

export type DIVisualType =
  | "table"
  | "bar"
  | "pie"
  | "line";

export type DISeriesType =
  | "line"
  | "bar";

type PatternReasoningCapability =
  | MotifReasoningType
  | "arithmetic";

type QuestionType =
  | "formula"
  | "logic"
  | "di";

export type GenerationDomain =
  | "quant"
  | "quant-v2-percentage"
  | "reasoning"
  | "english"
  | "punjabi"
  | "knowledge"
  | "computer"
  | "seating-arrangement"
  | "di"
  | "puzzle-sets"
  | "graph-reasoning"
  | "scheduling-puzzles";

type PatternSolvability =
  | "deterministic"
  | "validated"
  | "conditional";

export type DISeriesConfig = {
  column: string;
  type: DISeriesType;
  label?: string;
};

export type DISetProfile =
  | "progressive"
  | "balanced"
  | "spike"
  | "uniform";

type DIReasoningCategory =
  | "direct-arithmetic"
  | "comparative-reasoning"
  | "conditional-reasoning"
  | "trend-reasoning"
  | "multi-step-reasoning"
  | "cross-series-reasoning"
  | "set-logic";

export type DifficultyMetadata = {
  difficultyScore: number;
  difficultyLabel: DifficultyLabel;
  estimatedSolveTime: number;
  operationCount: number;
  reasoningDepth: number;
  reasoningSteps: string[];
  dependencyComplexity: number;
  operationChain: string[];
  usesPercentage: boolean;
  usesRatio: boolean;
  usesComparison: boolean;
  visualComplexity: number;
  inferenceComplexity: number;
};

export type DistractorType =
  | "percentageTrap"
  | "ratioInversion"
  | "arithmeticSlip"
  | "wrongIntermediateValue"
  | "comparisonTrap"
  | "wrongDenominator"
  | "prematureRounding"
  | "cumulativeMistake";

export type DistractorMetadata = {
  distractorType: DistractorType;
  likelyMistake: string;
  reasoningTrap: string;
};

export type OptionMetadata = {
  value: string;
  isCorrect: boolean;
} & Partial<DistractorMetadata>;

export type ExamRealismMetadata = {
  examProfile: ExamProfileId;
  wordingStyle: "concise" | "balanced" | "inference-heavy";
  archetypeId?: string;
  archetypeCategory?: string;
  reasoningTraps: string[];
  weightingSummary: string[];
  realismScore?: number;
  realismBand?:
    | "low"
    | "moderate"
    | "strong"
    | "pyq-like";
  realismSignals?: string[];
  realismPenalties?: string[];
};

export type GenerationMetrics = {
  generationDurationMs: number;
  validationRetries: number;
  uniquenessFailures: number;
  branchingFactor: number;
  branchingComplexity?: number;
  clueDensity: number;
  inferenceDepth: number;
  redundancyScore: number;
  deductionDependencyScore?: number;
  redundancyRatio?: number;
  anchorDensity?: number;
  directClueRatio?: number;
  realismScore?: number;
};

type GeneratedQuestionDifficulty = {
  difficulty: DifficultyLabel;
  difficultyScore: number;
  difficultyLabel: DifficultyLabel;
  difficultyMetadata: DifficultyMetadata;
};

export type QuantTopicCluster =
  | "fundamentals"
  | "simplification"
  | "number-system"
  | "percentage"
  | "ratio-proportion"
  | "profit-loss"
  | "averages"
  | "si-ci"
  | "time-work"
  | "speed-time-distance"
  | "mixture-alligation"
  | "algebra-basics"
  | "algebra"
  | "equations"
  | "progressions"
  | "probability"
  | "functions"
  | "permutation-combination"
  | "trigonometry"
  | "geometry"
  | "coordinate-geometry"
  | "set-theory"
  | "mensuration"
  | "coding-decoding"
  | "blood-relations"
  | "inequality"
  | "direction-sense"
  | "abstract-reasoning"
  | "temporal-reasoning"
  | "critical-inference"
  | "seating-arrangement"
  | "ordering-ranking"
  | "puzzles"
  | "syllogism"
  | "general-quant";

export type QuantReasoningCategory =
  | "direct-substitution"
  | "one-step-arithmetic"
  | "simple-percentage"
  | "simple-ratio"
  | "successive-percentage"
  | "average-transformation"
  | "comparison-chain"
  | "ratio-conversion"
  | "multi-step-arithmetic"
  | "reverse-percentage"
  | "hidden-base-inference"
  | "conditional-ratio-logic"
  | "chained-percentage-ratio"
  | "comparative-conditional-inference"
  | "nested-operations"
  | "direct-alphabet-shift"
  | "reverse-alphabet"
  | "simple-substitution"
  | "positional-coding"
  | "mixed-symbol-letter-coding"
  | "conditional-letter-mapping"
  | "multi-stage-coding"
  | "word-transformation-chains"
  | "inference-based-decoding"
  | "direct-family-relation"
  | "single-chain-relation"
  | "multi-person-chain-relations"
  | "generation-gap-reasoning"
  | "gender-based-inference"
  | "conditional-family-inference"
  | "circular-relation-chains"
  | "nested-relationship-logic"
  | "indirect-relation-deduction"
  | "direct-inequalities"
  | "single-inference-chains"
  | "basic-symbol-interpretation"
  | "multi-statement-comparison"
  | "compound-inequalities"
  | "indirect-conclusions"
  | "conditional-inequality-logic"
  | "nested-inference-chains"
  | "uncertain-conclusions"
  | "mixed-symbolic-reasoning"
  | "straight-movement"
  | "direct-distance"
  | "simple-left-right-turns"
  | "multiple-turns"
  | "orientation-changes"
  | "shortest-distance-inference"
  | "complex-directional-chains"
  | "hidden-orientation-shifts"
  | "conditional-movement-reasoning"
  | "coordinate-inference-chains"
  | "direct-placement"
  | "chained-deduction"
  | "neighbor-inference"
  | "vertical-constraints"
  | "scheduling-constraints"
  | "multi-variable-mapping";

export type DifficultyDistribution = {
  easy: number;
  medium: number;
  hard: number;
};

export type GeneratorOptions = {
  examProfile?: ExamProfileId;
  targetDifficulty?: number;
  difficultyTolerance?: number;
  difficultyDistribution?: Partial<DifficultyDistribution>;
  targetAverageDifficulty?: number;
  setProfile?: DISetProfile;
  seed?: string;
  generationContext?: GenerationContext;
  qualityThresholds?: Partial<QualityThresholds>;
  enableNameClash?: boolean;
  distractorArchetypes?: string[];
  forcedMotifId?: string;
  useScheduler?: boolean;
  schedulerProfile?: CorpusSchedulerProfileId;
  /**
   * Seating arrangement generation profile. Constraint-style puzzles from the
   * same engine are unaffected by the fast-preview path.
   */
  seatingGeneration?: {
    quality?: "draft" | "standard" | "production";
    extraAttempts?: number;
  };
};

export type DIPattern = {
  title: string;
  columns: string[];
  rowCount: number;
  categories?: string[];
  visualType?: DIVisualType;
  topology?:
    | "table"
    | "grouped-bar"
    | "stacked-bar"
    | "line-graph"
    | "pie-chart"
    | "dual-pie-chart"
    | "caselet";
  series?: DISeriesConfig[];
  valueRanges: Record<
    string,
    ValueRange
  >;
};

export type DIScenarioState = {
  topology:
    | "table"
    | "grouped-bar"
    | "stacked-bar"
    | "line-graph"
    | "pie-chart"
    | "dual-pie-chart"
    | "caselet";
  metadata: {
    title: string;
    unit: string;
    xLabel?: string;
    yLabel?: string;
  };
  categories: string[];
  intervals: string[];
  dataset: number[][];
};

type GenerationDebugMetadata = {
  selectedPattern: string;
  seed?: string;
  generationId?: string;
  generationTimestamp?: number;
  generationDomain?: GenerationDomain;
  selectedMotif?: string;
  selectedArchetype?: string;
  fallbackReason?: string;
  compatibilityWarnings: string[];
  participantCount?: number;
  clueCount?: number;
  inferenceDepth?: number;
  solverComplexity?: number;
  validationWarnings?: string[];
  directClueCount?: number;
  indirectClueCount?: number;
  relationalClueCount?: number;
  deductionDepth?: number;
  eliminationDepth?: number;
  validationRetries?: number;
  uniquenessFailures?: number;
  branchingFactor?: number;
  branchingComplexity?: number;
  deductionDependencyScore?: number;
  clueGraphDensity?: number;
  clueDensity?: number;
  clueInteractionRatio?: number;
  redundancyScore?: number;
  redundancyRatio?: number;
  anchorDensity?: number;
  directClueRatio?: number;
  originalClueCount?: number;
  minimalClueCount?: number;
  removedRedundantClues?: string[];
  topologyDiversityScore?: number;
  clueDiversityScore?: number;
  inferenceDiversityScore?: number;
  structuralDiversityScore?: number;
  generationMetrics?: GenerationMetrics;
  clueTypeDistribution?: Record<
    string,
    number
  >;
  repeatedStructureWarnings?: string[];
  arrangementType?: string;
  orientationType?: string;
  uniquenessVerified?: boolean;
  finalArrangement?: string;
  generatedClues?: string[];
  solverTrace?: string[];
  solverInferenceSteps?: InferenceStep[];
  solverTraceExport?: InferenceTraceExport;
  inferenceDependencyGraph?: InferenceDependencyGraph;
  realismAnalysis?: ReasoningRealismAnalysis;
  proceduralScenario?: Scenario;
  extractedPatternIntelligence?: ExtractedPatternIntelligence;
  structuralSignature?: StructuralSignature;
  corpusAlignment?: CorpusAlignmentScore;
  originalityScore?: OriginalityScore;
  validationReportDetail?: ValidationReport;
  difficultyAssessment?: DifficultyMetrics;
  difficultyConfidence?: DifficultyConfidence;
  qualityAssessment?: QualityAssessment;
  generationBackend?: string;
  debugSource?: string;
  quantV2?: unknown;
  reasoningGraph?: unknown;
  semanticMetadata?: unknown;
  svgRendering?: unknown;
  qualityMetrics?: unknown;
  localizationMetadata?: unknown;
  pedagogicalMetrics?: unknown;
  validatorReports?: unknown;
  seatingDiagram?: SeatingDiagramData;
  seatingExplanationFlow?: SeatingExplanationFlow;
  knowledgeLogic?: unknown;
  knowledgeContent?: unknown;
  factSnapshot?: unknown;
  structuralSignatureKey?: string;
  scenarioLogicBranch?: string;
  reasoningEngineFamily?: string;
  reasoningStyleAnchor?: string;
  reasoningSelfSolver?: {
    solutionCount: number;
    uniqueAnswer: boolean;
    issues: string[];
  };
  logicSymbols?: string[];
};

type QuestionCore = {
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  inferenceTrace?: {
    engineFamily: string;
    styleAnchor: string;
    solutionCount: number;
    uniqueAnswer: boolean;
    issues: string[];
    steps: string[];
    deductionArray: Array<{
      step: number;
      operation: string;
      statement: string;
      mathjax: string;
    }>;
    logicSymbols: string[];
  };
  reasoningSteps?: string[];
  deductionArray?: Array<{
    step: number;
    operation: string;
    statement: string;
    mathjax: string;
  }>;
  dependencyComplexity?: number;
  operationChain?: string[];
  optionMetadata?: OptionMetadata[];
  examRealismMetadata?: ExamRealismMetadata;
  generationMetrics?: GenerationMetrics;
  debugMetadata?: GenerationDebugMetadata;
  seatingDiagram?: SeatingDiagramData;
  seatingExplanationFlow?: SeatingExplanationFlow;
};

export type FormulaQuestion = {
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  textHi?: string | null;
  optionsHi?: string[] | null;
  explanationHi?: string | null;
  textPa?: string | null;
  optionsPa?: string[] | null;
  explanationPa?: string | null;
  nativeRealization?: Record<
    string,
    unknown
  >;
  nativeCoverage?: unknown;
  generationBackend?: string;
  debugSource?: string;
  proceduralLogic?: unknown;
  logic?: unknown;
  motifs?: unknown;
  languages?: unknown;
  reasoningGraph?: unknown;
  semanticMetadata?: unknown;
  svgRendering?: unknown;
  qualityMetrics?: unknown;
  localizationMetadata?: unknown;
  pedagogicalMetrics?: unknown;
  inferenceTrace?: {
    engineFamily: string;
    styleAnchor: string;
    solutionCount: number;
    uniqueAnswer: boolean;
    issues: string[];
    steps: string[];
    deductionArray: Array<{
      step: number;
      operation: string;
      statement: string;
      mathjax: string;
    }>;
    logicSymbols: string[];
  };
  deductionArray?: Array<{
    step: number;
    operation: string;
    statement: string;
    mathjax: string;
  }>;
  section?: string;
  topic?: string;
  subtopic?: string;
  optionMetadata?: OptionMetadata[];
  examRealismMetadata?: ExamRealismMetadata;
  generationMetrics?: GenerationMetrics;
  debugMetadata?: GenerationDebugMetadata;
  seatingDiagram?: SeatingDiagramData;
  seatingExplanationFlow?: SeatingExplanationFlow;
} & GeneratedQuestionDifficulty;

export type DIQuestion =
  QuestionCore &
  GeneratedQuestionDifficulty;

export type DIDataRow = Record<
  string,
  string | number
>;

export type DISet = {
  questionType: "di";
  visualType: DIVisualType;
  diData: DIDataRow[];
  scenarioState?: DIScenarioState;
  series?: DISeriesConfig[];
  title: string;
  questions: DIQuestion[];
  averageDifficulty: number;
  peakDifficulty: number;
  difficultySpread: DISetProfile;
  setProfile: DISetProfile;
};

export type GeneratedQuestion =
  | FormulaQuestion
  | DISet;

export type GeneratorResult = {
  questions: Array<
    GeneratedQuestion
  >;
  schedulerSummary?: unknown;
  corpusQuality?: unknown;
  generationContext?: Pick<
    GenerationContext,
    | "seed"
    | "generationId"
    | "timestamp"
  >;
};

export type Pattern = {
  id: string;

  type: QuestionType;

  section: string;

  topic: string;

  subtopic: string;

  difficulty?: DifficultyLabel;

  solvability?: PatternSolvability;

  supportedMotifs?: string[];

  requiredVariables?: string[];

  reasoningCapabilities?: PatternReasoningCapability[];

  supportedQuestionTypes?: QuestionType[];

  generationDomain?: GenerationDomain;

  arrangementType?: string;

  arrangementTypes?: string[];

  orientationType?: string;

  orientationTypes?: string[];

  participantCount?: number;

  clueTypes?: string[];

  inferenceDepth?: number;

  templateVariants: string[];

  explanationTemplate?: string;

  diPattern?: DIPattern;

  variables: Record<
    string,
    ValueRange
  >;

  formula?: string;

  distractorStrategy?: {
    type: "numeric_offsets";

    offsets: number[];
  };
  validationRules?: string[];
  generationLimits?: {
    maxSteps?: number;
    maxClues?: number;
    maxCalculationLength?: number;
  };
};

export type QuantArchetype = {
  id: string;
  difficulty: DifficultyLabel;
  category: QuantReasoningCategory;
  topicClusters: QuantTopicCluster[];
  operationChain: ReasoningOperation[];
  supportedMotifs?: string[];
  requiredOperations?: ReasoningOperation[];
  reasoningDepthRange?: [number, number];
  wordingVariants: string[];
  buildReasoningSteps: (
    context: QuantArchetypeContext,
  ) => ReasoningStep[];
};

function buildGenerationMetrics(
  overrides: Partial<GenerationMetrics>,
): GenerationMetrics {
  return {
    generationDurationMs:
      overrides.generationDurationMs ??
      0,
    validationRetries:
      overrides.validationRetries ?? 0,
    uniquenessFailures:
      overrides.uniquenessFailures ??
      0,
    branchingFactor:
      overrides.branchingFactor ?? 0,
    branchingComplexity:
      overrides.branchingComplexity,
    clueDensity:
      overrides.clueDensity ?? 0,
    inferenceDepth:
      overrides.inferenceDepth ?? 0,
    redundancyScore:
      overrides.redundancyScore ?? 0,
    deductionDependencyScore:
      overrides.deductionDependencyScore,
    redundancyRatio:
      overrides.redundancyRatio,
    anchorDensity:
      overrides.anchorDensity,
    directClueRatio:
      overrides.directClueRatio,
  };
}

function logGenerationMetrics(
  pattern: Pattern,
  metrics: GenerationMetrics,
  question: {
    difficultyLabel?: string;
    debugMetadata?: {
      generationId?: string;
      generationDomain?: GenerationDomain;
      selectedMotif?: string;
    };
  },
) {
  console.info(
    "Generation metrics",
    {
      patternId: pattern.id,
      topic: pattern.topic,
      subtopic: pattern.subtopic,
      generationId:
        question.debugMetadata
          ?.generationId,
      generationDomain:
        question.debugMetadata
          ?.generationDomain,
      selectedMotif:
        question.debugMetadata
          ?.selectedMotif,
      difficultyLabel:
        question.difficultyLabel,
      metrics,
    },
  );
}

function attachGenerationMetrics<
  T extends {
    generationMetrics?: GenerationMetrics;
    debugMetadata?: GenerationDebugMetadata;
    difficultyMetadata?: {
      reasoningDepth?: number;
    };
  },
>(
  pattern: Pattern,
  question: T,
  overrides: Partial<GenerationMetrics>,
) {
  const generationMetrics =
    buildGenerationMetrics({
      inferenceDepth:
        question.difficultyMetadata
          ?.reasoningDepth ?? 0,
      ...overrides,
    });
  const enrichedQuestion = {
    ...question,
    generationMetrics,
    debugMetadata:
      question.debugMetadata
        ? {
          ...question.debugMetadata,
          generationMetrics,
        }
        : question.debugMetadata,
  };

  logGenerationMetrics(
    pattern,
    generationMetrics,
    enrichedQuestion,
  );

  return enrichedQuestion;
}

export type QuantArchetypeContext = {
  pattern: Pattern;
  baseText: string;
  values: Record<string, number>;
  correctAnswer: number;
  topicCluster: QuantTopicCluster;
};

export function inferGenerationDomain(
  pattern: Pattern,
): GenerationDomain {
  if (pattern.generationDomain) {
    if (
      pattern.generationDomain ===
        "quant-v2-percentage" &&
      !isQuantV2PercentageEnabled()
    ) {
      return "quant";
    }
    return pattern.generationDomain;
  }

  if (
    pattern.section
      .toLowerCase()
      .trim() === "english"
  ) {
    return "english";
  }

  if (
    pattern.section
      .toLowerCase()
      .trim() === "punjabi"
  ) {
    return "punjabi";
  }

  if (
    pattern.section
      .toLowerCase()
      .trim() === "general knowledge"
  ) {
    return "knowledge";
  }

  if (
    pattern.section
      .toLowerCase()
      .trim() === "computer awareness"
  ) {
    return "computer";
  }

  if (pattern.type === "di") {
    return "di";
  }

  if (
    isQuantV2PercentageEnabled() &&
    isQuantV2PercentagePattern(pattern)
  ) {
    return "quant-v2-percentage";
  }

  const topicCluster =
    inferQuantTopicCluster(pattern);

  if (
    topicCluster ===
    "seating-arrangement"
  ) {
    return "seating-arrangement";
  }

  if (pattern.type === "logic") {
    return "reasoning";
  }

  return "quant";
}

const UNIVERSAL_QUANT_ARCHETYPES: QuantArchetype[] =
  [
    ...LOGIC_REASONING_ARCHETYPES,
    ...FORMULA_QUANT_ARCHETYPES,
  ];

function createFormulaQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
  const generationStartedAt =
    Date.now();
  const examProfile =
    options?.examProfile ?? "custom";
  const requestedDifficulty =
    getRequestedDifficultyLabel(
      pattern,
      options,
      classifyDifficultyLabel,
    );

  const targetDifficultyScore =
    getTargetDifficultyScore(
      pattern,
      options,
    );
  const topicCluster =
    inferQuantTopicCluster(pattern);
  const compatibilityWarnings: string[] =
    [];
  let fallbackReason:
    | string
    | undefined;
  const selectedMotif = pickMotif(
    topicCluster,
    pattern,
    options,
  );
  const patternMotifCompatibility =
    selectedMotif
      ? validatePatternCompatibility(
          pattern,
          topicCluster,
          selectedMotif,
          requestedDifficulty,
        )
      : null;
  const motif =
    patternMotifCompatibility?.valid
      ? selectedMotif
      : null;

  if (
    selectedMotif &&
    !patternMotifCompatibility?.valid
  ) {
    compatibilityWarnings.push(
      ...(
        patternMotifCompatibility?.issues ??
        []
      ).map((issue) => issue.reason),
    );
    fallbackReason =
      "Selected motif was incompatible with the pattern contract.";
  }

  const arithmeticDifficulty =
    requestedDifficulty;

  const proceduralScenario =
    createQuantProceduralScenario(
      pattern,
      arithmeticDifficulty,
      motif,
      {
        targetDifficultyScore,
      },
    );

  if (
    proceduralScenario?.motifId?.startsWith(
      "perc_",
    )
  ) {
    console.info(
      "[percentage-runtime] motif selected",
      {
        patternId: pattern.id,
        requestedDifficulty,
        targetDifficultyScore,
        motifId:
          proceduralScenario.motifId,
        reasoningAtoms:
          proceduralScenario
            .pedagogyMetadata
            ?.reasoningAtoms,
        educationalIntent:
          proceduralScenario
            .pedagogyMetadata
            ?.educationalIntent,
      },
    );
  }

  const resolvedScenarioMotif =
    proceduralScenario?.motifId
      ? ALL_MOTIFS.find(
          (entry) =>
            entry.id ===
            proceduralScenario.motifId,
        ) ?? motif
      : motif;
  const values =
    proceduralScenario?.values ??
    generateValues(
      pattern.variables,
      arithmeticDifficulty,
      motif,
    );

  const scenario =
    proceduralScenario?.context ??
    generateScenario(
      pattern.topic,
    );
  const archetype =
    selectQuantArchetype(
      FORMULA_QUANT_ARCHETYPES,
      pattern,
      options,
      topicCluster,
      motif,
      {
        getExamProfileConfig,
        validateArchetypeCompatibility,
        classifyDifficultyLabel,
      },
    );
  const archetypeCompatibility =
    validateArchetypeCompatibility(
      pattern,
      archetype,
      motif,
      topicCluster,
    );
  const effectiveArchetype =
    archetypeCompatibility.valid
      ? archetype
      : createFallbackArchetype(
          requestedDifficulty,
          topicCluster,
        );

  if (!archetypeCompatibility.valid) {
    compatibilityWarnings.push(
      ...archetypeCompatibility.issues.map(
        (issue) => issue.reason,
      ),
    );
    fallbackReason =
      fallbackReason ??
      "Archetype was incompatible with the selected pattern/motif combination.";
  }

  let text =
    proceduralScenario?.text ?? "";

  const applySubjectContextSkin = (
    input: string,
  ) => {
    if (!proceduralScenario) {
      return input;
    }

    const shouldApplyPunjabSkin =
      pattern.arrangementType ===
        "PunjabState" ||
      proceduralScenario
        .subjectContext?.variant ===
        "PunjabState";

    if (!shouldApplyPunjabSkin) {
      return input;
    }

    const replacementEntries = Object.entries({
      class: "panchayat group",
      Class: "Panchayat group",
      students: "panchayat members",
      Students: "Panchayat members",
      student: "member",
      Student: "Member",
      family: "panchayat household group",
      Family: "Panchayat household group",
      team: "kabaddi team",
      Team: "Kabaddi team",
      player: "kabaddi player",
      Player: "Kabaddi player",
      bags: "wheat bags",
      Bags: "Wheat bags",
      survey: "mandi survey",
      Survey: "Mandi survey",
      ...(proceduralScenario
        .subjectContext
        ?.replacements ?? {}),
    });

    let output = input;
    for (const [from, to] of replacementEntries) {
      output = output.replaceAll(
        from,
        to,
      );
    }
    return output;
  };

  if (!proceduralScenario) {
    const realizationValues = {
      ...values,
      entity: scenario.entity,
      metric: scenario.metric,
      context: scenario.context,
    };
    const validTemplates =
      pattern.templateVariants.filter(
        (template) =>
          validateQuestionRealization(
            [template],
            realizationValues,
          ).valid,
      );
    const fallbackText =
      realizeQuestion(
        scenario,
        values,
        pattern.topic,
        motif,
      );
    text =
      validTemplates.length
        ? renderNamedTemplate(
            pickRandomTemplate(
              validTemplates,
            ),
            realizationValues,
          ) || fallbackText
        : fallbackText;

    if (!validTemplates.length) {
      compatibilityWarnings.push(
        "Pattern templates were missing required placeholders for realization.",
      );
      fallbackReason =
        fallbackReason ??
        "Question realizer fell back to safe wording.";
    }
  }

  text = applySubjectContextSkin(
    text,
  );
  text = text.replace(
    /^:\s*/,
    "",
  );

  if (
    proceduralScenario?.validationTokens
      ?.length
  ) {
    const lowerText =
      text.toLowerCase();
    const hasValidationToken = (
      token: string,
    ) => {
      const normalizedToken =
        token.toLowerCase().trim();

      if (
        normalizedToken ===
          "percentage" ||
        normalizedToken === "percent"
      ) {
        return (
          lowerText.includes(
            "percentage",
          ) ||
          lowerText.includes(
            "percent",
          ) ||
          lowerText.includes("%")
        );
      }

      return lowerText.includes(
        normalizedToken,
      );
    };
    const missingTokens =
      proceduralScenario.validationTokens.filter(
        (token) =>
          !hasValidationToken(token),
      );
    if (missingTokens.length) {
      throw new ReasoningEngineError({
        code:
          "SCENARIO_VALIDATION_FAILED",
        phase: "realization",
        message: `Procedural scenario stem failed validation for tokens: ${missingTokens.join(", ")}`,
        metadata:
          buildReasoningErrorMetadata({
            patternId: pattern.id,
            motifId:
              proceduralScenario.motifId,
            missingTokens,
          }),
      });
    }
  }

  let formulaToEvaluate =
    proceduralScenario?.formula ??
    (Object.keys(values)[0] ?? "0");

  if (!proceduralScenario) {
    const formulaCompatibility =
      validateFormulaReferences(
        pattern.formula,
        values,
      );
    formulaToEvaluate =
      formulaCompatibility.valid
        ? pattern.formula!
        : Object.keys(values)[0] ?? "0";

    if (!formulaCompatibility.valid) {
      compatibilityWarnings.push(
        ...formulaCompatibility.issues.map(
          (issue) => issue.reason,
        ),
      );
      fallbackReason =
        fallbackReason ??
        "Pattern formula referenced unavailable variables.";
    }
  }

  const correctAnswer =
    proceduralScenario
      ?.correctAnswer ??
    evaluateFormula(
      formulaToEvaluate,
      values,
    );
  const quantContext = {
    pattern,
    baseText: text,
    values,
    correctAnswer,
    topicCluster,
  };
  const reasoningSteps =
    alignReasoningStepsWithMotif(
      proceduralScenario
        ?.reasoningSteps ??
        effectiveArchetype.buildReasoningSteps(
          quantContext,
        ),
      resolvedScenarioMotif,
    );
  const explanation =
    proceduralScenario
      ?.explanation ??
    buildMotifAwareExplanation(
      pattern,
      values,
      correctAnswer,
      resolvedScenarioMotif,
      reasoningSteps,
    );
  const generated =
    proceduralScenario
      ?.customOptionBundle ??
    generateNumericOptions(
      correctAnswer,
      {
        examProfile,
        topicCluster,
        difficulty:
          requestedDifficulty,
        distractorStrategy:
          pattern.distractorStrategy,
        distractorHints:
          proceduralScenario
            ?.distractorHints ??
          resolvedScenarioMotif?.commonDistractors,
        reasoningDepth:
          reasoningSteps.length,
        operationChain:
          effectiveArchetype.operationChain,
      },
    );
  const examRealismMetadata =
    buildExamRealismMetadata(
      examProfile,
      effectiveArchetype,
      generated.optionMetadata,
    );
  const activeGenerationContext =
    getGenerationContext();
  const questionText =
    proceduralScenario
      ? proceduralScenario.text
      : buildQuantPrompt(
          effectiveArchetype,
          quantContext,
          examProfile,
        );
  const enrichedQuestion =
    attachReasoningTrace(
      {
        text: normalizeQuantMathText(
          questionText,
        )!,
        options: generated.options.map(
          normalizeQuantOptionValue,
        ),
        correct: generated.correct,
        explanation:
          normalizeQuantMathText(
            explanation,
          )!,
        section: pattern.section,
        topic: pattern.topic,
        subtopic: pattern.subtopic,
        optionMetadata:
          generated.optionMetadata,
        examRealismMetadata,
        debugMetadata: {
          selectedPattern: pattern.id,
          seed:
            activeGenerationContext?.seed,
          generationId:
            activeGenerationContext?.generationId,
          generationDomain:
            "quant" as GenerationDomain,
          selectedMotif:
            proceduralScenario
              ?.motifId ??
            resolvedScenarioMotif?.id,
          selectedArchetype:
            effectiveArchetype.id,
          structuralSignatureKey:
            proceduralScenario
              ?.structuralSignature,
          scenarioLogicBranch:
            proceduralScenario
              ?.scenarioLogicBranch,
          fallbackReason,
          compatibilityWarnings,
        },
      },
      reasoningSteps,
      Math.max(
        reasoningSteps.length,
        effectiveArchetype.operationChain.length,
      ),
      effectiveArchetype.operationChain,
    );

  const finalizedQuestion =
    applyDifficultyMetadata(
      enrichedQuestion,
      {
        kind: "formula",
        text: enrichedQuestion.text,
        formula:
          formulaToEvaluate,
        values,
        explanation,
        difficultyHint:
          requestedDifficulty,
        targetDifficultyScore,
        reasoningSteps:
          enrichedQuestion.reasoningSteps,
        dependencyComplexity:
          enrichedQuestion.dependencyComplexity,
        operationChain:
          enrichedQuestion.operationChain,
      },
    );

  return attachGenerationMetrics(
    pattern,
    finalizedQuestion,
    {
      generationDurationMs:
        Date.now() -
        generationStartedAt,
      inferenceDepth:
        finalizedQuestion
          .difficultyMetadata
          .reasoningDepth,
    },
  );
}

function generateFormulaQuestions(
  pattern: Pattern,
  count: number,
  options?: GeneratorOptions,
): FormulaQuestion[] {
  const questions: FormulaQuestion[] = [];
  const attemptedCandidates: FormulaQuestion[] =
    [];
  const structuralSignatureKeys =
    new Set<string>();
  const maxAttempts = Math.max(
    count * 12,
    20,
  );

  for (
    let attempt = 0;
    attempt < maxAttempts;
    attempt++
  ) {
    const candidate =
      createFormulaQuestionCandidate(
        pattern,
        options,
      );
    attemptedCandidates.push(
      candidate,
    );

    const structuralSignatureKey =
      candidate.debugMetadata
        ?.structuralSignatureKey;

    if (
      structuralSignatureKey &&
      structuralSignatureKeys.has(
        structuralSignatureKey,
      )
    ) {
      continue;
    }

    if (
      validateDifficultyTarget(
        candidate.difficultyScore,
        options,
      ) ||
      !options?.targetDifficulty
    ) {
      if (
        structuralSignatureKey
      ) {
        structuralSignatureKeys.add(
          structuralSignatureKey,
        );
      }
      questions.push(candidate);
    }

    if (questions.length >= count) {
      break;
    }
  }

  return buildDifficultyBalancedSet(
    questions.length
      ? questions
      : attemptedCandidates,
    count,
    options,
  );
}

function createReasoningQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
  const generationStartedAt =
    Date.now();
  const examProfile =
    options?.examProfile ?? "custom";
  const requestedDifficulty =
    getRequestedDifficultyLabel(
      pattern,
      options,
      classifyDifficultyLabel,
    );
  const targetDifficultyScore =
    getTargetDifficultyScore(
      pattern,
      options,
    );
  const topicCluster =
    inferQuantTopicCluster(pattern);
  const compatibilityWarnings: string[] =
    [];
  let fallbackReason:
    | string
    | undefined;
  const forcedMotif =
    options?.forcedMotifId
      ? ALL_MOTIFS.find(
          (entry) =>
            entry.id ===
            options.forcedMotifId,
        )
      : undefined;
  const forcedMotifCompatibility =
    forcedMotif
      ? validatePatternCompatibility(
          pattern,
          topicCluster,
          forcedMotif,
          requestedDifficulty,
        )
      : null;
  const selectedMotif =
    forcedMotif &&
    forcedMotifCompatibility?.valid
      ? forcedMotif
      : pickMotif(
          topicCluster,
          pattern,
          options,
        ) ??
        ALL_MOTIFS.find(
          (entry) =>
            entry.topicCluster ===
            topicCluster,
        ) ??
        ALL_MOTIFS[0]!;
  const patternMotifCompatibility =
    selectedMotif
      ? validatePatternCompatibility(
          pattern,
          topicCluster,
          selectedMotif,
          requestedDifficulty,
        )
      : null;
  const motif =
    selectedMotif;

  if (
    selectedMotif &&
    !patternMotifCompatibility?.valid
  ) {
    compatibilityWarnings.push(
      ...(
        patternMotifCompatibility?.issues ??
        []
      ).map((issue) => issue.reason),
    );
    fallbackReason =
      "Selected motif was incompatible with the logic pattern contract.";
  }
  const archetype =
    selectQuantArchetype(
      UNIVERSAL_QUANT_ARCHETYPES,
      pattern,
      options,
      topicCluster,
      motif,
      {
        getExamProfileConfig,
        validateArchetypeCompatibility,
        classifyDifficultyLabel,
      },
    );
  const archetypeCompatibility =
    validateArchetypeCompatibility(
      pattern,
      archetype,
      motif,
      topicCluster,
    );
  const effectiveArchetype =
    archetypeCompatibility.valid
      ? archetype
      : createFallbackArchetype(
          requestedDifficulty,
          topicCluster,
        );

  if (!archetypeCompatibility.valid) {
    compatibilityWarnings.push(
      ...archetypeCompatibility.issues.map(
        (issue) => issue.reason,
      ),
    );
    fallbackReason =
      fallbackReason ??
      "Archetype was incompatible with the logic pattern/motif combination.";
  }
  const values = generateValues(
    pattern.variables,
    requestedDifficulty,
    motif,
  );
  let baseText = "";
  let explanation = "";
  let optionBundle: OptionResult;
  let customReasoningSteps:
    | ReasoningStep[]
    | undefined;

  if (topicCluster === "blood-relations") {
    const bloodScenario =
      createBloodRelationScenario(
        motif,
      );
    const profileConfig =
      getExamProfileConfig(
        examProfile,
      );

    baseText =
      buildBloodRelationStem(
        bloodScenario,
        examProfile,
        profileConfig.wordingStyle,
      );
    explanation =
      buildBloodRelationExplanation(
        bloodScenario,
      );
    optionBundle =
      buildBloodRelationOptions(
        bloodScenario.relation,
        bloodScenario.optionValues,
      );
    customReasoningSteps =
      bloodScenario.reasoningSteps;
  } else if (
    topicCluster ===
    "inequality" ||
    topicCluster ===
      "syllogism"
  ) {
    const inequalityScenario =
      createInequalityScenario(
        motif,
        requestedDifficulty,
      );
    const profileConfig =
      getExamProfileConfig(
        examProfile,
      );

    baseText =
      buildInequalityStem(
        inequalityScenario,
        examProfile,
        profileConfig.wordingStyle,
      );
    explanation =
      buildInequalityExplanation(
        inequalityScenario,
      );
    optionBundle =
      buildInequalityOptions(
        inequalityScenario,
      );
    customReasoningSteps =
      inequalityScenario.reasoningSteps;
  } else if (
    topicCluster ===
    "abstract-reasoning"
  ) {
    const abstractScenario =
      createAbstractReasoningScenario(
        motif,
        requestedDifficulty,
      );

    baseText = abstractScenario.stem;
    explanation =
      abstractScenario.explanation;
    optionBundle =
      abstractScenario.options;
    customReasoningSteps =
      abstractScenario.reasoningSteps;
  } else if (
    topicCluster ===
    "critical-inference"
  ) {
    const criticalScenario =
      createCriticalInferenceScenario(
        motif,
        requestedDifficulty,
      );

    baseText = criticalScenario.stem;
    explanation =
      criticalScenario.explanation;
    optionBundle =
      criticalScenario.options;
    customReasoningSteps =
      criticalScenario.reasoningSteps;
  } else if (
    topicCluster ===
    "temporal-reasoning"
  ) {
    const temporalScenario =
      createTemporalReasoningScenario(
        motif,
        requestedDifficulty,
      );

    baseText =
      temporalScenario.stem;
    explanation =
      temporalScenario.explanation;
    optionBundle =
      temporalScenario.options;
    customReasoningSteps =
      temporalScenario.reasoningSteps;
  } else if (
    topicCluster ===
    "direction-sense"
  ) {
    const directionScenario =
      createDirectionSenseScenario(
        motif,
        requestedDifficulty,
      );
    const profileConfig =
      getExamProfileConfig(
        examProfile,
      );

    baseText =
      buildDirectionSenseStem(
        directionScenario,
        examProfile,
        profileConfig.wordingStyle,
      );
    explanation =
      buildDirectionSenseExplanation(
        directionScenario,
      );
    optionBundle =
      buildDirectionSenseOptions(
        directionScenario,
      );
    customReasoningSteps =
      directionScenario.reasoningSteps;
  } else if (
    [
      "pattern-inference",
      "engine-pattern",
      "number-series",
      "letter-series",
      "analogy",
      "odd-one-out",
      "classification",
    ].some((token) =>
      `${pattern.topic} ${pattern.subtopic}`.toLowerCase().includes(
        token,
      ),
    ) ||
    motif.id.startsWith("math-")
  ) {
    const patternScenario =
      createPatternInferenceScenario(
        motif,
        requestedDifficulty,
        `${pattern.topic} ${pattern.subtopic}`,
        values,
      );

    baseText = patternScenario.stem;
    optionBundle =
      patternScenario.options;
    explanation =
      patternScenario.explanation;
    customReasoningSteps =
      patternScenario.reasoningSteps;
  } else {
    const sourceWord =
      pickCodingWord(
        requestedDifficulty,
      );
    const codedWord =
      encodeWordByMotif(
        sourceWord,
        motif,
        values,
      );
    const exampleWord =
      requestedDifficulty ===
        "Hard"
        ? pickCodingWord("Medium")
        : undefined;
    const exampleCode =
      exampleWord
        ? encodeWordByMotif(
          exampleWord,
          motif,
          values,
        )
        : undefined;

    baseText =
      buildCodingQuestionStem(
        sourceWord,
        motif,
        values,
        exampleWord,
        exampleCode,
      );
    optionBundle =
      buildCodingDistractorOptions(
        sourceWord,
        codedWord,
        motif,
        requestedDifficulty,
        values,
      );
    explanation =
      buildCodingExplanation(
        sourceWord,
        codedWord,
        motif,
        values,
      );
  }

  const quantContext = {
    pattern,
    baseText,
    values,
    correctAnswer: 0,
    topicCluster,
  };
  const reasoningSteps =
    alignReasoningStepsWithMotif(
      customReasoningSteps ??
      effectiveArchetype.buildReasoningSteps(
        quantContext,
      ),
      motif,
    );
  const activeGenerationContext =
    getGenerationContext();
  explanation =
    topicCluster ===
      "blood-relations" ||
      topicCluster ===
      "inequality" ||
      topicCluster ===
      "syllogism" ||
      topicCluster ===
      "temporal-reasoning" ||
      topicCluster ===
      "abstract-reasoning" ||
      topicCluster ===
      "critical-inference" ||
      topicCluster ===
      "direction-sense"
      ? explanation
      : `${buildMotifAwareExplanation(
        pattern,
        values,
        0,
        motif,
        reasoningSteps,
      ).replace(
        "Final answer = 0.",
        "",
      ).trim()} ${explanation}`.trim();
  const reasoningAudit =
    ReasoningEngine.audit({
      topicCluster,
      motif,
      text: baseText,
      options: optionBundle.options,
      correct: optionBundle.correct,
      reasoningSteps,
      optionMetadata:
        optionBundle.optionMetadata,
    });

  if (
    reasoningAudit.solutionCount !== 1
  ) {
    throw new ReasoningEngineError({
      code:
        "REASONING_NON_UNIQUE_SOLUTION",
      phase: "validation",
      message:
        "Reasoning self-solver did not find exactly one answer.",
      metadata:
        buildReasoningErrorMetadata({
          topicCluster,
          motifId: motif.id,
          solutionCount:
            reasoningAudit.solutionCount,
          issues:
            reasoningAudit.issues,
        }),
    });
  }

  const enrichedQuestion =
    attachReasoningTrace(
      {
        text: buildQuantPrompt(
          effectiveArchetype,
          quantContext,
          examProfile,
        ),
        options:
          optionBundle.options,
        correct:
          optionBundle.correct,
        explanation,
        inferenceTrace: {
          engineFamily:
            reasoningAudit.engineFamily,
          styleAnchor:
            reasoningAudit.styleAnchor,
          solutionCount:
            reasoningAudit.solutionCount,
          uniqueAnswer:
            reasoningAudit.uniqueAnswer,
          issues:
            reasoningAudit.issues,
          steps: reasoningSteps.map(
            (step) =>
              `${step.operation}: ${step.detail}`,
          ),
          deductionArray:
            reasoningAudit.deductionArray,
          logicSymbols:
            reasoningAudit.logicSymbols,
        },
        deductionArray:
          reasoningAudit.deductionArray,
        section: pattern.section,
        topic: pattern.topic,
        subtopic: pattern.subtopic,
        optionMetadata:
          optionBundle.optionMetadata,
        examRealismMetadata:
          buildExamRealismMetadata(
            examProfile,
            effectiveArchetype,
            optionBundle.optionMetadata,
          ),
        debugMetadata: {
          selectedPattern: pattern.id,
          seed:
            activeGenerationContext?.seed,
          generationId:
            activeGenerationContext?.generationId,
          generationDomain:
            "reasoning" as GenerationDomain,
          selectedMotif:
            selectedMotif?.id,
          selectedArchetype:
            effectiveArchetype.id,
          reasoningEngineFamily:
            reasoningAudit.engineFamily,
          reasoningStyleAnchor:
            reasoningAudit.styleAnchor,
          reasoningSelfSolver: {
            solutionCount:
              reasoningAudit.solutionCount,
            uniqueAnswer:
              reasoningAudit.uniqueAnswer,
            issues:
              reasoningAudit.issues,
          },
          logicSymbols:
            reasoningAudit.logicSymbols,
          fallbackReason,
          compatibilityWarnings,
        },
      },
      reasoningSteps,
      Math.max(
        reasoningSteps.length,
        effectiveArchetype.operationChain.length,
      ),
      effectiveArchetype.operationChain,
    );

  const finalizedQuestion =
    applyDifficultyMetadata(
      enrichedQuestion,
      {
        kind: "logic",
        text: enrichedQuestion.text,
        explanation,
        difficultyHint:
          requestedDifficulty,
        targetDifficultyScore,
        reasoningSteps:
          enrichedQuestion.reasoningSteps,
        dependencyComplexity:
          enrichedQuestion.dependencyComplexity,
        operationChain:
          enrichedQuestion.operationChain,
      },
    );

  return attachGenerationMetrics(
    pattern,
    finalizedQuestion,
    {
      generationDurationMs:
        Date.now() -
        generationStartedAt,
      inferenceDepth:
        finalizedQuestion
          .difficultyMetadata
          .reasoningDepth,
    },
  );
}

function createEnglishQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
  const generationStartedAt =
    Date.now();
  const activeGenerationContext =
    getGenerationContext();
  const scenario =
    createEnglishScenario(
      pattern,
      options,
    );
  const reasoningSteps =
    scenario.reasoningSteps.map(
      (detail, index) => ({
        operation:
          index === 0
            ? "filter"
            : index === 1
              ? "infer"
              : index === 2
                ? "compare"
                : "infer",
        detail,
      }),
    );
  const deductionArray =
    reasoningSteps.map(
      (step, index) => ({
        step: index + 1,
        operation: step.operation,
        statement: step.detail,
        mathjax:
          index === 1
            ? `$\\text{Rule} \\Rightarrow \\text{${scenario.ruleApplied.replace(/[$\\]/g, "")}}$`
            : `$\\therefore\\ \\text{${step.operation}}$`,
      }),
    );
  const enrichedQuestion =
    attachReasoningTrace(
      {
        text: scenario.stem,
        options: scenario.options,
        correct: scenario.correct,
        explanation:
          scenario.explanation,
        textHi:
          scenario.content.hi?.question ??
          null,
        optionsHi:
          scenario.content.hi?.options ??
          null,
        explanationHi:
          scenario.content.hi
            ?.explanation ?? null,
        textPa:
          scenario.content.pa?.question ??
          null,
        optionsPa:
          scenario.content.pa?.options ??
          null,
        explanationPa:
          scenario.content.pa
            ?.explanation ?? null,
        inferenceTrace: {
          engineFamily:
            "Engine_Verbal",
          styleAnchor:
            scenario.cluster ===
              "grammar"
              ? "S.P. Bakshi / Neetu Singh rule skeleton"
              : scenario.cluster ===
                  "vocabulary"
                ? "Norman Lewis root-context mapping"
                : "Arun Sharma discourse pointer logic",
          solutionCount: 1,
          uniqueAnswer: true,
          issues: [],
          steps:
            scenario.reasoningSteps,
          deductionArray,
          logicSymbols: [
            "\\Rightarrow",
            "\\therefore",
          ],
        },
        deductionArray,
        section: pattern.section,
        topic: pattern.topic,
        subtopic: pattern.subtopic,
        optionMetadata:
          scenario.optionMetadata,
        examRealismMetadata:
          buildExamRealismMetadata(
            options?.examProfile,
            {
              id: scenario.id,
              difficulty:
                scenario.difficulty,
              category:
                "comparative-conditional-inference",
              topicClusters: [
                "general-quant",
              ],
              operationChain: [],
              wordingVariants: [
                "Use the verbal rule skeleton.",
              ],
              buildReasoningSteps:
                () => [],
            },
            scenario.optionMetadata,
          ),
        debugMetadata: {
          selectedPattern: pattern.id,
          seed:
            activeGenerationContext?.seed,
          generationId:
            activeGenerationContext?.generationId,
          generationDomain:
            "english" as GenerationDomain,
          selectedMotif:
            pattern.supportedMotifs?.[0] ??
            scenario.subtype,
          selectedArchetype:
            scenario.cluster,
          structuralSignatureKey:
            scenario.structuralSignature,
          reasoningEngineFamily:
            "Engine_Verbal",
          reasoningStyleAnchor:
            scenario.cluster,
          reasoningSelfSolver: {
            solutionCount: 1,
            uniqueAnswer: true,
            issues: [],
          },
          knowledgeLogic:
            scenario.logic,
          knowledgeContent:
            scenario.content,
          factSnapshot:
            scenario.factSnapshot,
          compatibilityWarnings: [],
          validationWarnings: [],
        },
      },
      reasoningSteps,
      reasoningSteps.length,
      reasoningSteps.map(
        (step) =>
          step.operation as ReasoningOperation,
      ),
    );

  const finalizedQuestion =
    applyDifficultyMetadata(
      enrichedQuestion,
      {
        kind: "logic",
        text: enrichedQuestion.text,
        explanation:
          enrichedQuestion.explanation,
        difficultyHint:
          scenario.difficulty,
        targetDifficultyScore:
          options?.targetDifficulty,
        reasoningSteps:
          enrichedQuestion.reasoningSteps,
        dependencyComplexity:
          scenario.cluster ===
          "discourse"
            ? 4
            : scenario.cluster ===
                "vocabulary"
              ? 2
              : 3,
        operationChain:
          enrichedQuestion.operationChain,
      },
    );

  return attachGenerationMetrics(
    pattern,
    finalizedQuestion,
    {
      generationDurationMs:
        Date.now() -
        generationStartedAt,
      validationRetries: 0,
      uniquenessFailures: 0,
      branchingFactor: 1,
      clueDensity: 1,
      inferenceDepth:
        finalizedQuestion
          .difficultyMetadata
          .reasoningDepth,
      redundancyScore: 0,
      realismScore:
        finalizedQuestion
          .examRealismMetadata
          ?.realismScore,
    },
  );
}

function createPunjabiQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
  const generationStartedAt =
    Date.now();
  const activeGenerationContext =
    getGenerationContext();
  const scenario =
    createPunjabiScenario(
      pattern,
      options,
    );
  const reasoningSteps =
    scenario.reasoningSteps.map(
      (detail, index) => ({
        operation:
          index === 0
            ? "filter"
            : index === 1
              ? "infer"
              : index === 2
                ? "compare"
                : "infer",
        detail,
      }),
    );
  const deductionArray =
    reasoningSteps.map(
      (step, index) => ({
        step: index + 1,
        operation: step.operation,
        statement: step.detail,
        mathjax:
          index === 1
            ? `$\\mathrm{Rule}\\Rightarrow\\mathrm{Answer}$`
            : `$\\therefore$`,
      }),
    );
  const styleAnchor =
    scenario.cluster ===
    "vyakaran"
      ? "Narinder Singh Duggal Vyakaran rule-set"
      : scenario.cluster ===
          "shabad-bodh"
        ? "Gurmukhi orthography and Shabad-Bodh"
        : scenario.cluster ===
            "translation"
          ? "PSEB/Punjab Government terminology"
          : "Punjabi Muhavre-Akhaan semantic mapping";
  const enrichedQuestion =
    attachReasoningTrace(
      {
        text: scenario.stem,
        options: scenario.options,
        correct: scenario.correct,
        explanation:
          scenario.explanation,
        textHi:
          scenario.content.hi?.question ??
          null,
        optionsHi:
          scenario.content.hi?.options ??
          null,
        explanationHi:
          scenario.content.hi
            ?.explanation ?? null,
        textPa:
          scenario.content.pa?.question ??
          null,
        optionsPa:
          scenario.content.pa?.options ??
          null,
        explanationPa:
          scenario.content.pa
            ?.explanation ?? null,
        inferenceTrace: {
          engineFamily:
            "Engine_Punjabi",
          styleAnchor,
          solutionCount: 1,
          uniqueAnswer: true,
          issues: [],
          steps:
            scenario.reasoningSteps,
          deductionArray,
          logicSymbols: [
            "\\Rightarrow",
            "\\therefore",
          ],
        },
        deductionArray,
        section: pattern.section,
        topic: pattern.topic,
        subtopic: pattern.subtopic,
        optionMetadata:
          scenario.optionMetadata,
        examRealismMetadata:
          buildExamRealismMetadata(
            options?.examProfile,
            {
              id: scenario.id,
              difficulty:
                scenario.difficulty,
              category:
                "comparative-conditional-inference",
              topicClusters: [
                "general-quant",
              ],
              operationChain: [],
              wordingVariants: [
                "Use the Punjabi vyakaran rule-set.",
              ],
              buildReasoningSteps:
                () => [],
            },
            scenario.optionMetadata,
          ),
        debugMetadata: {
          selectedPattern: pattern.id,
          seed:
            activeGenerationContext?.seed,
          generationId:
            activeGenerationContext?.generationId,
          generationDomain:
            "punjabi" as GenerationDomain,
          selectedMotif:
            pattern.supportedMotifs?.[0] ??
            scenario.subtype,
          selectedArchetype:
            scenario.cluster,
          structuralSignatureKey:
            scenario.structuralSignature,
          reasoningEngineFamily:
            "Engine_Punjabi",
          reasoningStyleAnchor:
            styleAnchor,
          reasoningSelfSolver: {
            solutionCount: 1,
            uniqueAnswer: true,
            issues: [],
          },
          knowledgeLogic:
            scenario.logic,
          knowledgeContent:
            scenario.content,
          factSnapshot:
            scenario.factSnapshot,
          compatibilityWarnings: [],
          validationWarnings: [],
        },
      },
      reasoningSteps,
      reasoningSteps.length,
      reasoningSteps.map(
        (step) =>
          step.operation as ReasoningOperation,
      ),
    );

  const finalizedQuestion =
    applyDifficultyMetadata(
      enrichedQuestion,
      {
        kind: "logic",
        text: enrichedQuestion.text,
        explanation:
          enrichedQuestion.explanation,
        difficultyHint:
          scenario.difficulty,
        targetDifficultyScore:
          options?.targetDifficulty,
        reasoningSteps:
          enrichedQuestion.reasoningSteps,
        dependencyComplexity:
          scenario.mode ===
          "paper-b"
            ? 4
            : 2,
        operationChain:
          enrichedQuestion.operationChain,
      },
    );

  return attachGenerationMetrics(
    pattern,
    finalizedQuestion,
    {
      generationDurationMs:
        Date.now() -
        generationStartedAt,
      validationRetries: 0,
      uniquenessFailures: 0,
      branchingFactor: 1,
      clueDensity: 1,
      inferenceDepth:
        finalizedQuestion
          .difficultyMetadata
          .reasoningDepth,
      redundancyScore: 0,
      realismScore:
        finalizedQuestion
          .examRealismMetadata
          ?.realismScore,
    },
  );
}

function createKnowledgeQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
  const generationStartedAt =
    Date.now();
  const activeGenerationContext =
    getGenerationContext();
  const isComputer =
    pattern.generationDomain ===
      "computer" ||
    pattern.section
      .toLowerCase()
      .includes("computer");
  const scenario = isComputer
    ? createComputerAwarenessScenario(
        pattern,
      )
    : createGeneralKnowledgeScenario(
        pattern,
      );
  const reasoningSteps =
    scenario.reasoningSteps.map(
      (detail, index) => ({
        operation:
          index === 0
            ? "filter"
            : index === 1
              ? "map"
              : "compare",
        detail,
      }),
    );
  const deductionArray =
    reasoningSteps.map(
      (step, index) => ({
        step: index + 1,
        operation: step.operation,
        statement: step.detail,
        mathjax:
          index === 1
            ? `$\\text{Entity} \\to \\text{Attribute}$`
            : `$\\therefore\\ \\text{${step.operation}}$`,
      }),
    );
  const engineFamily = isComputer
    ? "ComputerAwarenessEngine"
    : "GeneralKnowledgeEngine";
  const styleAnchor = isComputer
    ? "Arihant Computer Awareness fact-object mapping"
    : "Lucent GK / Ghatna Chakra / Sadda Punjab EAS fact-object mapping";
  const enrichedQuestion =
    attachReasoningTrace(
      {
        text: scenario.stem,
        options: scenario.options,
        correct: scenario.correct,
        explanation:
          scenario.explanation,
        textHi:
          scenario.content.hi?.question ??
          null,
        optionsHi:
          scenario.content.hi?.options ??
          null,
        explanationHi:
          scenario.content.hi
            ?.explanation ?? null,
        textPa:
          scenario.content.pa?.question ??
          null,
        optionsPa:
          scenario.content.pa?.options ??
          null,
        explanationPa:
          scenario.content.pa
            ?.explanation ?? null,
        inferenceTrace: {
          engineFamily,
          styleAnchor,
          solutionCount: 1,
          uniqueAnswer: true,
          issues: [],
          steps:
            scenario.reasoningSteps,
          deductionArray,
          logicSymbols: [
            "\\to",
            "\\therefore",
          ],
        },
        deductionArray,
        section: pattern.section,
        topic: pattern.topic,
        subtopic: pattern.subtopic,
        optionMetadata:
          scenario.optionMetadata,
        examRealismMetadata:
          buildExamRealismMetadata(
            options?.examProfile,
            {
              id: scenario.id,
              difficulty:
                scenario.difficulty,
              category:
                "fact-object-recall",
              topicClusters: [
                scenario.category,
              ],
              operationChain: [
                "identify-category",
                "map-entity-attribute",
                "reject-close-distractors",
              ],
              wordingVariants: [
                "Use EAS fact-object prompt.",
              ],
              buildReasoningSteps:
                () => [],
            },
            scenario.optionMetadata,
          ),
        debugMetadata: {
          selectedPattern: pattern.id,
          seed:
            activeGenerationContext?.seed,
          generationId:
            activeGenerationContext?.generationId,
          generationDomain:
            (isComputer
              ? "computer"
              : "knowledge") as GenerationDomain,
          selectedMotif:
            pattern.supportedMotifs?.[0] ??
            scenario.category,
          selectedArchetype:
            scenario.engine,
          structuralSignatureKey:
            scenario.structuralSignature,
          reasoningEngineFamily:
            engineFamily,
          reasoningStyleAnchor:
            styleAnchor,
          reasoningSelfSolver: {
            solutionCount: 1,
            uniqueAnswer: true,
            issues: [],
          },
          knowledgeLogic:
            scenario.logic,
          knowledgeContent:
            scenario.content,
          factSnapshot:
            scenario.factSnapshot,
          compatibilityWarnings: [],
          validationWarnings: [],
        },
      },
      reasoningSteps,
      reasoningSteps.length,
      reasoningSteps.map(
        (step) =>
          step.operation as ReasoningOperation,
      ),
    );

  const finalizedQuestion =
    applyDifficultyMetadata(
      enrichedQuestion,
      {
        kind: "logic",
        text: enrichedQuestion.text,
        explanation:
          enrichedQuestion.explanation,
        difficultyHint:
          scenario.difficulty,
        targetDifficultyScore:
          options?.targetDifficulty,
        reasoningSteps:
          enrichedQuestion.reasoningSteps,
        dependencyComplexity:
          scenario.matchMatrix ? 3 : 2,
        operationChain:
          enrichedQuestion.operationChain,
      },
    );

  return attachGenerationMetrics(
    pattern,
    finalizedQuestion,
    {
      generationDurationMs:
        Date.now() -
        generationStartedAt,
      validationRetries: 0,
      uniquenessFailures: 0,
      branchingFactor: 1,
      clueDensity: 1,
      inferenceDepth:
        finalizedQuestion
          .difficultyMetadata
          .reasoningDepth,
      redundancyScore: 0,
      realismScore:
        finalizedQuestion
          .examRealismMetadata
          ?.realismScore,
    },
  );
}

function createSeatingQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
  const generationStartedAt =
    Date.now();
  const examProfile =
    options?.examProfile ?? "custom";
  const requestedDifficulty =
    getRequestedDifficultyLabel(
      pattern,
      options,
      classifyDifficultyLabel,
    );
  const targetDifficultyScore =
    getTargetDifficultyScore(
      pattern,
      options,
    );
  const topicCluster =
    inferQuantTopicCluster(pattern);
  const compatibilityWarnings: string[] =
    [];
  let fallbackReason:
    | string
    | undefined;
  const forcedMotif =
    options?.forcedMotifId
      ? ALL_MOTIFS.find(
          (entry) =>
            entry.id ===
            options.forcedMotifId,
        )
      : undefined;
  const forcedMotifCompatibility =
    forcedMotif
      ? validatePatternCompatibility(
          pattern,
          topicCluster,
          forcedMotif,
          requestedDifficulty,
        )
      : null;
  const selectedMotif =
    forcedMotif &&
    forcedMotifCompatibility?.valid
      ? forcedMotif
      : pickMotif(
          topicCluster,
          pattern,
          options,
        ) ??
        ALL_MOTIFS.find(
          (entry) =>
            entry.topicCluster ===
            topicCluster,
        ) ??
        ALL_MOTIFS[0]!;
  const patternMotifCompatibility =
    selectedMotif
      ? validatePatternCompatibility(
          pattern,
          topicCluster,
          selectedMotif,
          requestedDifficulty,
        )
      : null;
  const motif = selectedMotif;

  if (
    forcedMotif &&
    !forcedMotifCompatibility?.valid
  ) {
    compatibilityWarnings.push(
      `Forced motif ${forcedMotif.id} was skipped because it is not compatible with this seating pattern.`,
      ...(
        forcedMotifCompatibility?.issues ??
        []
      ).map((issue) => issue.reason),
    );
  }

  if (
    selectedMotif &&
    !patternMotifCompatibility?.valid
  ) {
    compatibilityWarnings.push(
      ...(
        patternMotifCompatibility?.issues ??
        []
      ).map((issue) => issue.reason),
    );
    fallbackReason =
      "Selected motif was incompatible with the seating pattern contract.";
  }

  const archetype =
    selectQuantArchetype(
      UNIVERSAL_QUANT_ARCHETYPES,
      pattern,
      options,
      topicCluster,
      motif,
      {
        getExamProfileConfig,
        validateArchetypeCompatibility,
        classifyDifficultyLabel,
      },
    );
  const archetypeCompatibility =
    validateArchetypeCompatibility(
      pattern,
      archetype,
      motif,
      topicCluster,
    );
  const effectiveArchetype =
    archetypeCompatibility.valid
      ? archetype
      : createFallbackArchetype(
          requestedDifficulty,
          topicCluster,
        );

  if (!archetypeCompatibility.valid) {
    compatibilityWarnings.push(
      ...archetypeCompatibility.issues.map(
        (issue) => issue.reason,
      ),
    );
    fallbackReason =
      fallbackReason ??
      "Archetype was incompatible with the seating pattern/motif combination.";
  }

  const nameClashEnabled =
    Boolean(options?.enableNameClash) &&
    (requestedDifficulty === "Hard" ||
      (options?.targetDifficulty ?? 0) >=
        4 ||
      options?.distractorArchetypes?.includes(
        "NameClash",
      ));
  const seatingScenario =
    createSeatingScenario(
      motif,
      requestedDifficulty,
      pattern,
      {
        enableNameClash:
          nameClashEnabled,
        generationQuality:
          options?.seatingGeneration
            ?.quality,
        extraGenerationAttempts:
          options?.seatingGeneration
            ?.extraAttempts,
      },
    );
  const profileConfig =
    getExamProfileConfig(examProfile);
  const seatingExplanation =
    buildSeatingExplanationForQuestion(
      seatingScenario,
    );
  const baseText =
    buildSeatingStemForQuestion(
      seatingScenario,
      examProfile,
      profileConfig.wordingStyle,
    );
  const optionBundle =
    buildSeatingOptionsForQuestion(
      seatingScenario,
    );
  const seatingDiagram =
    buildSeatingDiagramData(
      seatingScenario,
    );
  const seatingExplanationFlow =
    buildSeatingExplanationFlow(
      seatingScenario,
    );
  const realismAnalysis =
    buildSeatingRealismAnalysis(
      seatingScenario,
      examProfile,
    );
  compatibilityWarnings.push(
    ...seatingScenario.validationWarnings,
  );

  const quantContext = {
    pattern,
    baseText,
    values: {},
    correctAnswer: 0,
    topicCluster,
  };
  const reasoningSteps =
    alignReasoningStepsWithMotif(
      seatingExplanation.reasoningSteps,
      motif,
    );
  const activeGenerationContext =
    getGenerationContext();
  const examRealismMetadata =
    buildExamRealismMetadata(
      examProfile,
      effectiveArchetype,
      optionBundle.optionMetadata,
    );
  const enrichedQuestion =
    attachReasoningTrace(
      {
        text: buildQuantPrompt(
          effectiveArchetype,
          quantContext,
          examProfile,
        ),
        options:
          optionBundle.options,
        correct:
          optionBundle.correct,
        explanation:
          seatingExplanation.text,
        section: pattern.section,
        topic: pattern.topic,
        subtopic: pattern.subtopic,
        optionMetadata:
          optionBundle.optionMetadata,
        examRealismMetadata: {
          ...examRealismMetadata,
          realismScore:
            realismAnalysis.overallScore,
          realismBand:
            realismAnalysis.band,
          realismSignals:
            realismAnalysis.matchedHeuristics,
          realismPenalties:
            realismAnalysis.penalties,
        },
        seatingDiagram,
        seatingExplanationFlow,
        debugMetadata: {
          selectedPattern: pattern.id,
          seed:
            activeGenerationContext?.seed,
          generationId:
            activeGenerationContext?.generationId,
          generationDomain:
            "seating-arrangement" as GenerationDomain,
          selectedMotif:
            selectedMotif?.id,
          selectedArchetype:
            effectiveArchetype.id,
          fallbackReason,
          compatibilityWarnings,
          participantCount:
            seatingScenario.participants.length,
          clueCount:
            seatingScenario.clueCount,
          inferenceDepth:
            seatingScenario.inferenceDepth,
          solverComplexity:
            seatingScenario.solverComplexity,
          validationWarnings:
            seatingScenario.validationWarnings,
          nameClashEnabled,
          nameClashInitials:
            Array.from(
              new Set(
                seatingScenario.participants.map(
                  (participant) =>
                    participant
                      .charAt(0)
                      .toUpperCase(),
                ),
              ),
            ),
          directClueCount:
            seatingScenario.directClueCount,
          indirectClueCount:
            seatingScenario.indirectClueCount,
          relationalClueCount:
            seatingScenario.relationalClueCount,
          deductionDepth:
            seatingScenario.deductionDepth,
          eliminationDepth:
            seatingScenario.eliminationDepth,
          validationRetries:
            seatingScenario.validationRetries,
          uniquenessFailures:
            seatingScenario.uniquenessFailures,
          branchingFactor:
            seatingScenario.branchingFactor,
          branchingComplexity:
            seatingScenario.branchingComplexity,
          deductionDependencyScore:
            seatingScenario.deductionDependencyScore,
          clueGraphDensity:
            seatingScenario.clueGraphDensity,
          clueDensity:
            seatingScenario.clueDensity,
          clueInteractionRatio:
            seatingScenario.clueInteractionRatio,
          redundancyScore:
            seatingScenario.redundancyScore,
          redundancyRatio:
            seatingScenario.redundancyRatio,
          anchorDensity:
            seatingScenario.anchorDensity,
          directClueRatio:
            seatingScenario.directClueRatio,
          originalClueCount:
            seatingScenario.originalClueCount,
          minimalClueCount:
            seatingScenario.minimalClueCount,
          removedRedundantClues:
            seatingScenario.removedRedundantClues.map(
              (clue) =>
                JSON.stringify(clue),
            ),
          topologyDiversityScore:
            seatingScenario.topologyDiversityScore,
          clueDiversityScore:
            seatingScenario.clueDiversityScore,
          inferenceDiversityScore:
            seatingScenario.inferenceDiversityScore,
          structuralDiversityScore:
            seatingScenario.structuralDiversityScore,
          clueTypeDistribution:
            seatingScenario.clueTypeDistribution,
          repeatedStructureWarnings:
            seatingScenario.repeatedStructureWarnings,
          arrangementType:
            seatingScenario.arrangementType,
          orientationType:
            seatingScenario.orientationType,
          uniquenessVerified:
            seatingScenario.uniquenessVerified,
          finalArrangement:
            seatingScenario.finalArrangement,
          generatedClues:
            seatingScenario.generatedClues,
          solverTrace:
            seatingScenario.solverTrace,
          solverInferenceSteps:
            seatingScenario.solverInferenceSteps,
          solverTraceExport:
            seatingScenario.solverTraceExport,
          inferenceDependencyGraph:
            seatingScenario.inferenceDependencyGraph,
          realismAnalysis,
          seatingDiagram,
          seatingExplanationFlow,
        },
      },
      reasoningSteps,
      Math.max(
        reasoningSteps.length,
        effectiveArchetype.operationChain.length,
      ),
      effectiveArchetype.operationChain,
    );

  const finalizedQuestion =
    applyDifficultyMetadata(
      enrichedQuestion,
      {
        kind: "logic",
        text: enrichedQuestion.text,
        explanation:
          seatingExplanation.text,
        difficultyHint:
          requestedDifficulty,
        targetDifficultyScore,
        reasoningSteps:
          enrichedQuestion.reasoningSteps,
        dependencyComplexity:
          enrichedQuestion.dependencyComplexity,
        operationChain:
          enrichedQuestion.operationChain,
      },
    );

  return attachGenerationMetrics(
    pattern,
    finalizedQuestion,
    {
      generationDurationMs:
        Date.now() -
        generationStartedAt,
      validationRetries:
        seatingScenario.validationRetries,
      uniquenessFailures:
        seatingScenario.uniquenessFailures,
      branchingFactor:
        seatingScenario.branchingFactor,
      branchingComplexity:
        seatingScenario.branchingComplexity,
      clueDensity:
        seatingScenario.clueDensity,
      inferenceDepth:
        seatingScenario.inferenceDepth,
      redundancyScore:
        seatingScenario.redundancyScore,
      deductionDependencyScore:
        seatingScenario.deductionDependencyScore,
      redundancyRatio:
        seatingScenario.redundancyRatio,
      anchorDensity:
        seatingScenario.anchorDensity,
      directClueRatio:
        seatingScenario.directClueRatio,
      realismScore:
        realismAnalysis.overallScore,
    },
  );
}

function createDIQuestionSet(
  pattern: Pattern,
  options?: GeneratorOptions,
): DISet {
  const tableData =
    generateDISet(pattern);
  const visualType =
    pattern.diPattern?.visualType ??
    "table";
  const series =
    pattern.diPattern
      ? getSeriesConfig(
        pattern.diPattern,
        tableData,
        visualType,
      )
      : undefined;
  const scenarioState =
    buildDIScenarioState(
      pattern.diPattern,
      tableData,
      visualType,
      series,
    );
  const diQuestionSet =
    generateDIQuestions(
      tableData,
      visualType,
      scenarioState,
      series,
      options,
    );

  return {
    questionType: "di",
    visualType,
    diData: tableData,
    scenarioState,
    series,
    title:
      pattern.diPattern?.title ??
      pattern.topic,
    questions:
      diQuestionSet.questions,
    averageDifficulty:
      diQuestionSet.averageDifficulty,
    peakDifficulty:
      diQuestionSet.peakDifficulty,
    difficultySpread:
      diQuestionSet.difficultySpread,
    setProfile:
      diQuestionSet.setProfile,
  };
}

function analyzeQuestionArtifacts(
  scenario: {
    scenario: Scenario;
  },
  question: GeneratedQuestion,
  difficultyMetrics: DifficultyMetrics,
  examProfile?: ExamProfileId,
) {
  const extractedPatternIntelligence =
    extractPatternIntelligence({
      scenario: scenario.scenario,
      question,
    });
  const structuralSignature =
    buildStructuralSignature(
      scenario.scenario,
      extractedPatternIntelligence,
    );
  const corpusAlignment =
    buildCorpusAlignmentScore(
      extractedPatternIntelligence,
      question,
      examProfile,
    );
  const originalityScore =
    buildOriginalityScore(
      scenario.scenario,
      extractedPatternIntelligence,
      structuralSignature,
      corpusAlignment,
      question,
    );
  const difficultyConfidence =
    buildDifficultyConfidence(
      question,
      difficultyMetrics,
    );

  return {
    extractedPatternIntelligence,
    structuralSignature,
    corpusAlignment,
    originalityScore,
    difficultyConfidence,
  };
}

function buildDebugMetadataWithAnalysis(
  question: GeneratedQuestion,
  baseDebugMetadata: GenerationDebugMetadata,
  analysis: ReturnType<
    typeof analyzeQuestionArtifacts
  >,
) {
  return {
    ...(question.debugMetadata ?? {}),
    ...baseDebugMetadata,
    extractedPatternIntelligence:
      analysis.extractedPatternIntelligence,
    structuralSignature:
      analysis.structuralSignature,
    corpusAlignment:
      analysis.corpusAlignment,
    originalityScore:
      analysis.originalityScore,
    difficultyConfidence:
      analysis.difficultyConfidence,
  };
}

function materializeAdapterQuestion(
  adapter: DomainAdapter,
  context: DomainGenerationContext,
) {
  const scenario =
    adapter.generateScenario(context);
  const validationReport =
    adapter.validateScenario(
      scenario,
    );
  const realizedQuestion =
    adapter.realizeScenario(
      scenario,
    );
  const difficultyMetrics =
    adapter.analyzeDifficulty(
      scenario,
    );
  const explanationResult =
    adapter.generateExplanation(
      scenario,
    );
  const analysis =
    analyzeQuestionArtifacts(
      scenario,
      realizedQuestion,
      difficultyMetrics,
      context.options?.examProfile,
    );
  const primaryRealizedQuestion =
    "questionType" in
      realizedQuestion &&
    realizedQuestion.questionType ===
      "di"
      ? realizedQuestion.questions[0]
      : realizedQuestion;
  const qualityAssessment =
    assessProceduralQuality(
      {
        validationReport,
        realismScore:
          primaryRealizedQuestion
            ?.examRealismMetadata
            ?.realismScore,
        structuralDiversityScore:
          primaryRealizedQuestion
            ?.debugMetadata
            ?.structuralDiversityScore,
        repeatedStructureWarnings:
          primaryRealizedQuestion
            ?.debugMetadata
            ?.repeatedStructureWarnings,
        directClueRatio:
          primaryRealizedQuestion
            ?.debugMetadata
            ?.directClueRatio,
        difficultyAssessment:
          difficultyMetrics,
        proceduralScenario:
          scenario.scenario,
        structuralSignature:
          analysis.structuralSignature,
      },
      context.options?.qualityThresholds,
    );
  const enrichedDebugMetadata =
    buildDebugMetadataWithAnalysis(
      realizedQuestion,
      {
        proceduralScenario:
          scenario.scenario,
        validationReportDetail:
          validationReport,
        difficultyAssessment:
          difficultyMetrics,
        qualityAssessment,
      },
      analysis,
    );

  return {
    scenario,
    validationReport,
    realizedQuestion:
      "debugMetadata" in
        realizedQuestion
        ? {
          ...(
            explanationResult.text &&
            "explanation" in
              realizedQuestion &&
            !realizedQuestion.explanation
              ? {
                ...realizedQuestion,
                explanation:
                  explanationResult.text,
              }
              : realizedQuestion
          ),
          debugMetadata:
            enrichedDebugMetadata,
        }
        : realizedQuestion,
    difficultyMetrics,
  };
}

function buildPatternFromQuestion(
  question: GeneratedQuestion,
  explicitPattern?: Pattern,
): Pattern {
  if (explicitPattern) {
    return explicitPattern;
  }

  const primaryQuestion =
    "questionType" in question &&
    question.questionType === "di"
      ? question.questions[0]
      : question;
  const domain =
    primaryQuestion?.debugMetadata
      ?.generationDomain ?? "quant";
  const section =
    domain === "english"
      ? "english"
      : domain === "punjabi"
        ? "punjabi"
      : domain === "di"
        ? "di"
        : domain ===
            "seating-arrangement" ||
          domain === "reasoning"
          ? "reasoning"
          : "quant";

  return {
    id:
      primaryQuestion?.debugMetadata
        ?.selectedPattern ??
      `refined-${domain}`,
    type:
      "questionType" in question &&
      question.questionType === "di"
        ? "di"
        : "formula",
    section,
    topic:
      "questionType" in question &&
      question.questionType === "di"
        ? question.title ??
          "Data Interpretation"
        : question.topic ?? "General",
    subtopic:
      "questionType" in question &&
      question.questionType === "di"
        ? "set"
        : question.subtopic ?? "",
    difficulty:
      "questionType" in question &&
      question.questionType === "di"
        ? "Medium"
        : question.difficultyLabel ??
          "Medium",
    generationDomain: domain,
  };
}

function generateQuestionsWithAdapter(
  adapter: DomainAdapter,
  pattern: Pattern,
  count: number,
  options?: GeneratorOptions,
) {
  if (
    adapter.generationMode ===
    "single"
  ) {
    const singleResult =
      materializeAdapterQuestion(
        adapter,
        {
          pattern,
          count,
          options,
        },
      );

    return [
      singleResult.realizedQuestion,
    ];
  }

  const questions: FormulaQuestion[] = [];
  const attempted: FormulaQuestion[] = [];
  const structuralSignatureKeys =
    new Set<string>();
  const maxAttempts = Math.max(
    count *
      (adapter.maxAttemptsMultiplier ??
        10),
    adapter.minAttempts ?? 16,
  );

  for (
    let attempt = 0;
    attempt < maxAttempts;
    attempt++
  ) {
    const candidateResult =
      materializeAdapterQuestion(
        adapter,
        {
          pattern,
          count,
          options,
        },
      );
    const candidate =
      candidateResult.realizedQuestion as FormulaQuestion;

    attempted.push(candidate);
    const structuralSignatureKey =
      candidate.debugMetadata
        ?.structuralSignatureKey;

    if (
      structuralSignatureKey &&
      structuralSignatureKeys.has(
        structuralSignatureKey,
      )
    ) {
      continue;
    }

    if (
      validateDifficultyTarget(
        candidate.difficultyScore,
        options,
      ) ||
      !options?.targetDifficulty
    ) {
      if (
        structuralSignatureKey
      ) {
        structuralSignatureKeys.add(
          structuralSignatureKey,
        );
      }
      questions.push(candidate);
    }

    if (questions.length >= count) {
      break;
    }
  }

  return buildDifficultyBalancedSet(
    questions.length
      ? questions
      : attempted,
    count,
    options,
  );
}

function generateScheduledQuestionsWithAdapter(
  adapter: DomainAdapter,
  pattern: Pattern,
  count: number,
  options: GeneratorOptions,
) {
  const schedulerState =
    createCorpusSchedulerState({
      targetCount: count,
      profileId:
        options.schedulerProfile ??
        "balanced_mock",
    });
  const questions: FormulaQuestion[] = [];

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const scheduled =
      generateScheduledQuestion({
        state: schedulerState,
        index,
        seedPrefix:
          options.seed ??
          options.generationContext?.seed ??
          "admin-generator",
        examProfile: options.examProfile,
        forcedMotifId:
          options.forcedMotifId,
        generate:
          (scheduledOptions) =>
            materializeAdapterQuestion(
              adapter,
              {
                pattern,
                count,
                options: {
                  ...options,
                  ...scheduledOptions,
                  generationContext:
                    options.generationContext,
                },
              },
            )
              .realizedQuestion as FormulaQuestion,
      });

    questions.push(
      scheduled.question,
    );
  }

  const schedulerSummary =
    summarizeCorpusScheduler(
      schedulerState,
    );

  return {
    questions,
    schedulerSummary,
    corpusQuality:
      evaluateCorpusQuality(
        schedulerSummary,
      ),
  };
}

function getDomainAdapterRegistry() {
  return createDomainAdapters({
    createFormulaQuestionCandidate,
    createReasoningQuestionCandidate,
    createSeatingQuestionCandidate,
    createEnglishQuestionCandidate,
    createPunjabiQuestionCandidate,
    createKnowledgeQuestionCandidate,
    createQuantV2PercentageQuestionCandidate,
    createDIQuestionSet,
  });
}

export function refineGeneratedQuestion(
  question: GeneratedQuestion,
  options?: {
    pattern?: Pattern;
    qualityThresholds?: Partial<QualityThresholds>;
  },
): GeneratedQuestion {
  const pattern =
    buildPatternFromQuestion(
      question,
      options?.pattern,
    );
  const generationDomain =
    inferGenerationDomain(pattern);
  const adapter =
    resolveDomainAdapter(
      getDomainAdapterRegistry(),
      generationDomain,
    );
  const scenario =
    adapter.hydrateScenario(
      pattern,
      question,
    );
  const validationReport =
    adapter.validateScenario(
      scenario,
    );
  const difficultyMetrics =
    adapter.analyzeDifficulty(
      scenario,
    );
  const primaryQuestion =
    "questionType" in question &&
    question.questionType === "di"
      ? question.questions[0]
      : question;
  const analysis =
    analyzeQuestionArtifacts(
      scenario,
      question,
      difficultyMetrics,
      primaryQuestion
        ?.examRealismMetadata
        ?.examProfile,
    );
  const realismScore =
    primaryQuestion?.debugMetadata
      ?.realismAnalysis
      ?.overallScore ??
    primaryQuestion?.examRealismMetadata
      ?.realismScore ??
    primaryQuestion?.generationMetrics
      ?.realismScore;
  const qualityAssessment =
    assessProceduralQuality(
      {
        validationReport,
        realismScore,
        structuralDiversityScore:
          primaryQuestion
            ?.debugMetadata
            ?.structuralDiversityScore,
        repeatedStructureWarnings:
          primaryQuestion
            ?.debugMetadata
            ?.repeatedStructureWarnings,
        directClueRatio:
          primaryQuestion
            ?.debugMetadata
            ?.directClueRatio,
        difficultyAssessment:
          difficultyMetrics,
        proceduralScenario:
          scenario.scenario,
        structuralSignature:
          analysis.structuralSignature,
      },
      options?.qualityThresholds,
    );

  if (
    "questionType" in question &&
    question.questionType === "di"
  ) {
    const firstQuestion =
      question.questions[0];
    const updatedFirstQuestion =
      firstQuestion
        ? attachGenerationMetrics(
          pattern,
          {
            ...firstQuestion,
            debugMetadata:
              buildDebugMetadataWithAnalysis(
                firstQuestion,
                {
                  proceduralScenario:
                    scenario.scenario,
                  validationReportDetail:
                    validationReport,
                  difficultyAssessment:
                    difficultyMetrics,
                  qualityAssessment,
                },
                analysis,
              ),
          },
          {
            inferenceDepth:
              difficultyMetrics.inferenceDepth,
            realismScore,
          },
        )
        : firstQuestion;

    return {
      ...question,
      questions:
        updatedFirstQuestion
          ? [
            updatedFirstQuestion,
            ...question.questions.slice(1),
          ]
          : question.questions,
    };
  }

  return attachGenerationMetrics(
    pattern,
    {
      ...question,
      debugMetadata:
        buildDebugMetadataWithAnalysis(
          question,
          {
            proceduralScenario:
              scenario.scenario,
            validationReportDetail:
              validationReport,
            difficultyAssessment:
              difficultyMetrics,
            qualityAssessment,
          },
          analysis,
        ),
    },
    {
      inferenceDepth:
        difficultyMetrics.inferenceDepth,
      realismScore,
    },
  );
}

export async function generateFromPattern(
  pattern: Pattern,
  count: number,
  options?: GeneratorOptions,
): Promise<GeneratorResult> {
  const rawGenerationDomain =
    inferGenerationDomain(pattern);
  const topicConfig =
      resolveTopicConfig(
        rawGenerationDomain,
        pattern.topic,
      );
  const effectivePattern =
    applyTopicConfigToPattern(
      pattern,
      topicConfig,
    );
  const effectiveOptions =
    applyTopicConfigToOptions(
      options,
      topicConfig,
    );
  const generationContext =
    effectiveOptions?.generationContext ??
    createGenerationContext(
      effectiveOptions?.seed,
    );
  const effectiveGenerationDomain =
    inferGenerationDomain(effectivePattern);
  const singleSeatingMotif =
    count === 1 &&
    effectiveGenerationDomain ===
      "seating-arrangement" &&
    !effectiveOptions?.forcedMotifId
      ? pickStableSeatingMotif(
          effectivePattern,
          effectiveOptions,
        )
      : null;
  const generationScopedOptions: GeneratorOptions =
    {
      ...(effectiveOptions ?? {}),
      seed:
        effectiveOptions?.seed ??
        generationContext.seed,
      forcedMotifId:
        effectiveOptions?.forcedMotifId ??
        singleSeatingMotif?.id,
      generationContext,
    };
  const isPercentagePattern =
    /percentage|percent/i.test(
      `${effectivePattern.id} ${effectivePattern.topic} ${effectivePattern.subtopic}`,
    );
  const cacheEligible =
    count > 0 &&
    effectiveGenerationDomain !==
      "seating-arrangement" &&
    effectiveGenerationDomain !==
      "knowledge" &&
    effectiveGenerationDomain !==
      "computer" &&
    !isPercentagePattern &&
    !/knowledge|computer|gk/i.test(
      `${effectivePattern.section} ${effectivePattern.topic} ${effectivePattern.id}`,
    );

  return runWithGenerationContext(
    generationContext,
    async () => {
      try {
        if (cacheEligible) {
          const cachedResult =
            await getCachedGenerationResult(
              effectivePattern,
              count,
              generationScopedOptions,
            );

          if (cachedResult) {
            return cachedResult;
          }
        }
        resetStructuralDiversityRegistry();
        const generationDomain =
          inferGenerationDomain(
            effectivePattern,
          );
        const domainAdapters =
          getDomainAdapterRegistry();
        const adapter =
          resolveDomainAdapter(
            domainAdapters,
            generationDomain,
          );
        const responseBase = {
          generationContext: {
            seed: generationContext.seed,
            generationId:
              generationContext.generationId,
            timestamp:
              generationContext.timestamp,
          },
        };

        let result: GeneratorResult;
        const useCorpusScheduler =
          Boolean(
            generationScopedOptions
              .useScheduler,
          ) &&
          count > 1 &&
          generationDomain ===
            "quant-v2-percentage";

        if (useCorpusScheduler) {
          const scheduled =
            generateScheduledQuestionsWithAdapter(
              adapter,
              effectivePattern,
              count,
              generationScopedOptions,
            );
          result = {
            ...responseBase,
            questions:
              scheduled.questions,
            schedulerSummary:
              scheduled.schedulerSummary,
            corpusQuality:
              scheduled.corpusQuality,
          };
        } else {
        result = {
          ...responseBase,
          questions:
            generateQuestionsWithAdapter(
              adapter,
              effectivePattern,
              count,
              generationScopedOptions,
            ),
        };
        }

        if (cacheEligible) {
          await cacheGenerationResult(
            effectivePattern,
            count,
            generationScopedOptions,
            result,
          );
        }

        return result;
      } catch (error) {
        const structuredError =
          isReasoningEngineError(error)
            ? error
            : new ReasoningEngineError({
              code:
                "GENERATION_FAILED",
              phase: "realization",
              message:
                error instanceof Error
                  ? error.message
                  : "Unknown generator failure.",
              metadata:
                buildReasoningErrorMetadata({
                  patternId: pattern.id,
                  topic: pattern.topic,
                  subtopic:
                    pattern.subtopic,
                  count,
                }),
              cause: error,
            });

        console.error(
          "Reasoning engine failure",
          {
            code:
              structuredError.code,
            phase:
              structuredError.phase,
            metadata:
              structuredError.metadata,
            message:
              structuredError.message,
          },
        );

        throw structuredError;
      }
    },
  );
}

function stableHash(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function hasExplicitSeatingTopology(pattern: Pattern) {
  const record =
    pattern as Pattern &
      Record<string, unknown>;
  const text =
    `${pattern.id} ${pattern.topic} ${pattern.subtopic}`.toLowerCase();

  return Boolean(
    record["arrangementType"] ||
      record["arrangementTypes"] ||
      /linear|circular|square|rectangular|double[ -]?row|parallel[ -]?row|floor|box|stack|sched|calendar|ranking|mapping/.test(
        text,
      ),
  );
}

function getMotifTopologyHints(motifId: string) {
  if (/floor/.test(motifId)) {
    return {
      arrangementType: "floor",
      orientationType: "north",
    };
  }

  if (/box/.test(motifId)) {
    return {
      arrangementType: "box-stack",
      orientationType: "north",
    };
  }

  if (/sched/.test(motifId)) {
    return {
      arrangementType: "scheduling",
      orientationType: "north",
    };
  }

  if (/mapping/.test(motifId)) {
    return {
      arrangementType: "mapping",
      orientationType: "north",
    };
  }

  if (/circular|opposite/.test(motifId)) {
    return {
      arrangementType: "circular",
      orientationType: "center",
    };
  }

  if (/double_row/.test(motifId)) {
    return {
      arrangementType: "double-row",
      orientationType: "mixed",
    };
  }

  if (/row_facing/.test(motifId)) {
    return {
      arrangementType: "parallel-row",
      orientationType: "mixed",
    };
  }

  if (/alternate/.test(motifId)) {
    return {
      arrangementType: "linear",
      orientationType: "alternate",
    };
  }

  return {
    arrangementType: "linear",
    orientationType: "north",
  };
}

function getCompatibleBatchMotifs(
  pattern: Pattern,
  options?: GeneratorOptions,
) {
  const topicCluster =
    inferQuantTopicCluster(pattern);

  if (
    inferGenerationDomain(pattern) !==
      "seating-arrangement" &&
    topicCluster !== "seating-arrangement"
  ) {
    return [];
  }

  const requestedDifficulty =
    getRequestedDifficultyLabel(
      pattern,
      options,
      classifyDifficultyLabel,
    );

  return ALL_MOTIFS.filter((motif) => {
    if (
      motif.topicCluster !==
      "seating-arrangement"
    ) {
      return false;
    }

    return validatePatternCompatibility(
      pattern,
      topicCluster,
      motif,
      requestedDifficulty,
    ).valid;
  });
}

function pickStableSeatingMotif(
  pattern: Pattern,
  options?: GeneratorOptions,
) {
  const topicCluster =
    inferQuantTopicCluster(pattern);

  if (
    inferGenerationDomain(pattern) !==
      "seating-arrangement" &&
    topicCluster !== "seating-arrangement"
  ) {
    return null;
  }

  const requestedDifficulty =
    getRequestedDifficultyLabel(
      pattern,
      options,
      classifyDifficultyLabel,
    );
  const compatibleMotifs =
    ALL_MOTIFS.filter((motif) => {
      if (
        motif.topicCluster !==
        "seating-arrangement"
      ) {
        return false;
      }

      return validatePatternCompatibility(
        pattern,
        topicCluster,
        motif,
        requestedDifficulty,
      ).valid;
    });

  if (!compatibleMotifs.length) {
    return null;
  }

  const patternText =
    `${pattern.id} ${pattern.topic} ${pattern.subtopic}`.toLowerCase();
  const orderedMotifIds = [
    /parallel|double[ -]?row|facing each other/.test(
      patternText,
    )
      ? [
        "banking_parallel_row",
        "row_facing_inference",
        "double_row_elimination",
      ]
      : [],
    /alternate/.test(patternText)
      ? [
        "banking_alternate_row",
        "alternate_facing_deduction",
      ]
      : [],
    /circular|ring|centre|center/.test(
      patternText,
    )
      ? [
        "ssc_circular_basic",
        "circular_opposite_chain",
      ]
      : [],
    /linear|row/.test(patternText)
      ? [
        "ssc_simple_row",
        "direct_clue_linear",
        "neighbor_clue_linear",
        "relative_position_clue",
      ]
      : [],
  ].flat();

  for (const motifId of orderedMotifIds) {
    const motif = compatibleMotifs.find(
      (entry) => entry.id === motifId,
    );

    if (motif) {
      return motif;
    }
  }

  return (
    compatibleMotifs
      .slice()
      .sort((left, right) => {
        const leftScore =
          (left.facingPattern ? 0 : 3) +
          left.reasoningDepthRange[1] +
          (left.participantCount ?? 0) / 10;
        const rightScore =
          (right.facingPattern ? 0 : 3) +
          right.reasoningDepthRange[1] +
          (right.participantCount ?? 0) / 10;

        return leftScore - rightScore;
      })[0] ?? null
  );
}

function buildSeatingBatchPatternVariant(
  pattern: Pattern,
  motif: QuantMotif | undefined,
  index: number,
) {
  if (!motif) {
    return pattern;
  }

  const variant =
    {
      ...pattern,
      supportedMotifs: [motif.id],
    } as Pattern &
      Record<string, unknown>;

  if (!hasExplicitSeatingTopology(pattern)) {
    const hints =
      getMotifTopologyHints(motif.id);
    variant["arrangementType"] =
      hints.arrangementType;
    variant["orientationType"] =
      hints.orientationType;
    variant["orientation"] =
      hints.orientationType;
  }

  variant["batchVariationIndex"] = index;
  return variant as Pattern;
}

export async function generateBatch(
  patternId: string,
  count: number,
  options?: GeneratorOptions,
): Promise<GeneratorResult> {
  const pattern = (ALL_PATTERNS as Pattern[]).find(
    (candidate) => candidate.id === patternId,
  );

  if (!pattern) {
    throw new ReasoningEngineError({
      code: "PATTERN_NOT_FOUND",
      phase: "selection",
      message: `Pattern with id "${patternId}" was not found.`,
      metadata: {
        patternId,
        count,
      },
    });
  }

  const safeCount = Math.min(
    50,
    Math.max(1, Math.floor(count || 1)),
  );
  const seedBase = Date.now();
  const questions: GeneratedQuestion[] = [];
  let generationContext:
    | GeneratorResult["generationContext"]
    | undefined;
  const fingerprints = new Set<string>();
  const compatibleBatchMotifs =
    getCompatibleBatchMotifs(
      pattern,
      options,
    );
  const motifOffset =
    compatibleBatchMotifs.length
      ? stableHash(
          `${options?.seed ?? seedBase}:${pattern.id}:motif-rotation`,
        ) %
        compatibleBatchMotifs.length
      : 0;
  const maxBatchAttempts =
    Math.max(
      safeCount *
        (compatibleBatchMotifs.length
          ? 8
          : 3),
      safeCount,
    );

  for (
    let i = 0;
    i < maxBatchAttempts &&
    questions.length < safeCount;
    i++
  ) {
    const forcedMotif =
      compatibleBatchMotifs.length
        ? compatibleBatchMotifs[
            (i + motifOffset) %
              compatibleBatchMotifs.length
          ]
        : undefined;
    const patternVariant =
      buildSeatingBatchPatternVariant(
        pattern,
        forcedMotif,
        i,
      );
    const result = await generateFromPattern(
      patternVariant,
      1,
      {
        ...(options ?? {}),
        forcedMotifId:
          forcedMotif?.id ??
          options?.forcedMotifId,
        seed: `${options?.seed ?? seedBase}-${i}-${forcedMotif?.id ?? "default"}`,
      },
    );
    generationContext =
      result.generationContext ??
      generationContext;

    for (const question of result.questions) {
      const signature = JSON.stringify({
        text:
          "questionType" in question &&
          question.questionType === "di"
            ? question.title
            : question.text,
        options:
          "questionType" in question &&
          question.questionType === "di"
            ? question.questions?.[0]?.options
            : question.options,
      });

      if (fingerprints.has(signature)) {
        continue;
      }

      fingerprints.add(signature);
      questions.push(question);

      if (questions.length >= safeCount) {
        break;
      }
    }
  }

  return {
    questions,
    generationContext,
  };
}
