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
  generateNumericOptions,
  alignReasoningStepsWithMotif,
  attachReasoningTrace,
  CompatibilityIssue,
  CompatibilityResult,
  countMatches,
  extractTemplatePlaceholders,
  fillTemplate,
  generateScenario,
  hasAnyToken,
  normalizeNumericValue,
  pickRandomItem,
  pickRandomTemplate,
  pickMotif,
  renderExplanation,
  renderNamedTemplate,
  buildQuantPrompt,
  validateArchetypeCompatibility,
  validatePatternCompatibility,
  validateFormulaReferences,
  validateQuestionRealization,
} from "../shared";
import type {
  OptionResult,
  ReasoningOperation,
  ReasoningStep,
} from "../shared";
import type {
  SeatingDiagramData,
  SeatingExplanationFlow,
} from "@workspace/api-zod";
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
};

type GeneratedQuestionDifficulty = {
  difficulty: DifficultyLabel;
  difficultyScore: number;
  difficultyLabel: DifficultyLabel;
  difficultyMetadata: DifficultyMetadata;
};

export type QuantTopicCluster =
  | "percentage"
  | "ratio-proportion"
  | "profit-loss"
  | "averages"
  | "si-ci"
  | "coding-decoding"
  | "blood-relations"
  | "inequality"
  | "direction-sense"
  | "seating-arrangement"
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
  clueGraphDensity?: number;
  clueInteractionRatio?: number;
  redundancyScore?: number;
  structuralDiversityScore?: number;
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
  seatingDiagram?: SeatingDiagramData;
  seatingExplanationFlow?: SeatingExplanationFlow;
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

  const values = generateValues(
    pattern.variables,
    arithmeticDifficulty,
    motif,
  );

  const scenario =
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
  const text =
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

  const formulaCompatibility =
    validateFormulaReferences(
      pattern.formula,
      values,
    );
  const formulaToEvaluate =
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

 const correctAnswer =
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
      effectiveArchetype.buildReasoningSteps(
        quantContext,
      ),
      motif,
    );
  const explanation =
    buildMotifAwareExplanation(
      pattern,
      values,
      correctAnswer,
      motif,
      reasoningSteps,
    );
  const generated =
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
          motif?.commonDistractors,
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
          generationDomain:
            "quant" as GenerationDomain,
          selectedMotif:
            motif?.id,
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

  return applyDifficultyMetadata(
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
}

function generateFormulaQuestions(
  pattern: Pattern,
  count: number,
  options?: GeneratorOptions,
): FormulaQuestion[] {
  const questions: FormulaQuestion[] = [];
  const attemptedCandidates: FormulaQuestion[] =
    [];
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

    if (
      validateDifficultyTarget(
        candidate.difficultyScore,
        options,
      ) ||
      !options?.targetDifficulty
    ) {
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

  return applyDifficultyMetadata(
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
}

function createSeatingQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
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
        examRealismMetadata:
          buildExamRealismMetadata(
            examProfile,
            effectiveArchetype,
            optionBundle.optionMetadata,
          ),
        seatingDiagram,
        seatingExplanationFlow,
        debugMetadata: {
          selectedPattern: pattern.id,
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
          clueGraphDensity:
            seatingScenario.clueGraphDensity,
          clueInteractionRatio:
            seatingScenario.clueInteractionRatio,
          redundancyScore:
            seatingScenario.redundancyScore,
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

  return applyDifficultyMetadata(
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
}

function generateReasoningQuestions(
  pattern: Pattern,
  count: number,
  options?: GeneratorOptions,
) {
  const questions: FormulaQuestion[] = [];
  const attempted: FormulaQuestion[] = [];
  const maxAttempts = Math.max(
    count * 10,
    16,
  );

  for (
    let attempt = 0;
    attempt < maxAttempts;
    attempt++
  ) {
    const candidate =
      createReasoningQuestionCandidate(
        pattern,
        options,
      );
    attempted.push(candidate);

    if (
      validateDifficultyTarget(
        candidate.difficultyScore,
        options,
      ) ||
      !options?.targetDifficulty
    ) {
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

function generateSeatingQuestions(
  pattern: Pattern,
  count: number,
  options?: GeneratorOptions,
) {
  const questions: FormulaQuestion[] = [];
  const attempted: FormulaQuestion[] = [];
  const maxAttempts = Math.max(
    count * 10,
    16,
  );

  for (
    let attempt = 0;
    attempt < maxAttempts;
    attempt++
  ) {
    const candidate =
      createSeatingQuestionCandidate(
        pattern,
        options,
      );
    attempted.push(candidate);

    if (
      validateDifficultyTarget(
        candidate.difficultyScore,
        options,
      ) ||
      !options?.targetDifficulty
    ) {
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

export function generateFromPattern(
  pattern: Pattern,
  count: number,
  options?: GeneratorOptions,
): GeneratorResult {
  const generationDomain =
    inferGenerationDomain(pattern);

  if (generationDomain === "di") {
    const tableData =
      generateDISet(pattern);
    const visualType =
      pattern.diPattern
        ?.visualType ?? "table";
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
      questions: [
        {
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
        },
      ],
    };
  }

  if (
    generationDomain ===
    "seating-arrangement"
  ) {
    return {
      questions: generateSeatingQuestions(
        pattern,
        count,
        options,
      ),
    };
  }

  if (generationDomain === "reasoning") {
    return {
      questions:
        generateReasoningQuestions(
          pattern,
          count,
          options,
        ),
    };
  }

  return {
    questions: generateFormulaQuestions(
      pattern,
      count,
      options,
    ),
  };
}
