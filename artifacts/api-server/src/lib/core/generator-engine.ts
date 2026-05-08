import type {
  CompatiblePatternType,
  MotifDifficultyBand,
  MotifReasoningType,
  QuantMotif,
} from "../motifs/types";
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
  | "rrb";

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
  | "reasoning"
  | "english"
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
  | "mensuration"
  | "coding-decoding"
  | "blood-relations"
  | "inequality"
  | "direction-sense"
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
  | "neighbor-inference";

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
};

export type DIPattern = {
  title: string;
  columns: string[];
  rowCount: number;
  categories?: string[];
  visualType?: DIVisualType;
  series?: DISeriesConfig[];
  valueRanges: Record<
    string,
    ValueRange
  >;
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
  seatingDiagram?: SeatingDiagramData;
  seatingExplanationFlow?: SeatingExplanationFlow;
  structuralSignatureKey?: string;
  scenarioLogicBranch?: string;
};

type QuestionCore = {
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  reasoningSteps?: string[];
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
    return pattern.generationDomain;
  }

  if (
    pattern.section
      .toLowerCase()
      .trim() === "english"
  ) {
    return "english";
  }

  if (pattern.type === "di") {
    return "di";
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
    );
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
    const missingTokens =
      proceduralScenario.validationTokens.filter(
        (token) =>
          !lowerText.includes(
            token.toLowerCase(),
          ),
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
  const enrichedQuestion =
    attachReasoningTrace(
      {
        text: buildQuantPrompt(
          effectiveArchetype,
          quantContext,
          examProfile,
        ),
        options: generated.options,
        correct: generated.correct,
        explanation,
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
  const selectedMotif =
    pickMotif(
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
      );
    customReasoningSteps =
      bloodScenario.reasoningSteps;
  } else if (
    topicCluster ===
    "inequality"
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
  const selectedMotif =
    pickMotif(
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

  const seatingScenario =
    createSeatingScenario(
      motif,
      requestedDifficulty,
      pattern,
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
  const diQuestionSet =
    generateDIQuestions(
      tableData,
      visualType,
      series,
      options,
    );

  return {
    questionType: "di",
    visualType,
    diData: tableData,
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

function getDomainAdapterRegistry() {
  return createDomainAdapters({
    createFormulaQuestionCandidate,
    createReasoningQuestionCandidate,
    createSeatingQuestionCandidate,
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
  const generationScopedOptions: GeneratorOptions =
    {
      ...(effectiveOptions ?? {}),
      seed:
        effectiveOptions?.seed ??
        generationContext.seed,
      generationContext,
    };
  const cacheEligible =
    count > 0 &&
    rawGenerationDomain !==
      "seating-arrangement";

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

        await cacheGenerationResult(
          effectivePattern,
          count,
          generationScopedOptions,
          result,
        );

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
