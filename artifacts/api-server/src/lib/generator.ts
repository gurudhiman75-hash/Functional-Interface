import { ALL_MOTIFS } from "./motifs";
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

type DIVisualType =
  | "table"
  | "bar"
  | "pie"
  | "line";

export type DISeriesType =
  | "line"
  | "bar";

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

type QuantTopicCluster =
  | "percentage"
  | "ratio-proportion"
  | "profit-loss"
  | "averages"
  | "si-ci"
  | "general-quant";

type QuantReasoningCategory =
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
  | "nested-operations";

type ExamProfileConfig = {
  wordingStyle: ExamRealismMetadata["wordingStyle"];
  archetypeWeights: Partial<
    Record<QuantReasoningCategory, number>
  >;
  distractorWeights: Partial<
    Record<DistractorType, number>
  >;
  reasoningWeights: {
    speedBias: number;
    trapBias: number;
    inferenceBias: number;
  };
};

const EXAM_PROFILE_CONFIGS: Record<
  ExamProfileId,
  ExamProfileConfig
> = {
  custom: {
    wordingStyle: "balanced",
    archetypeWeights: {},
    distractorWeights: {},
    reasoningWeights: {
      speedBias: 1,
      trapBias: 1,
      inferenceBias: 1,
    },
  },
  ssc: {
    wordingStyle: "concise",
    archetypeWeights: {
      "one-step-arithmetic": 1.35,
      "simple-percentage": 1.25,
      "comparison-chain": 1.15,
      "nested-operations": 0.8,
    },
    distractorWeights: {
      arithmeticSlip: 1.4,
      percentageTrap: 1.2,
      prematureRounding: 1.2,
    },
    reasoningWeights: {
      speedBias: 1.3,
      trapBias: 1,
      inferenceBias: 0.8,
    },
  },
  ibps: {
    wordingStyle: "balanced",
    archetypeWeights: {
      "comparison-chain": 1.3,
      "ratio-conversion": 1.25,
      "conditional-ratio-logic": 1.2,
    },
    distractorWeights: {
      wrongIntermediateValue: 1.3,
      wrongDenominator: 1.2,
      comparisonTrap: 1.2,
    },
    reasoningWeights: {
      speedBias: 1,
      trapBias: 1.25,
      inferenceBias: 1,
    },
  },
  cat: {
    wordingStyle: "inference-heavy",
    archetypeWeights: {
      "hidden-base-inference": 1.35,
      "chained-percentage-ratio": 1.35,
      "comparative-conditional-inference": 1.4,
      "nested-operations": 1.35,
    },
    distractorWeights: {
      wrongIntermediateValue: 1.35,
      cumulativeMistake: 1.25,
      ratioInversion: 1.15,
    },
    reasoningWeights: {
      speedBias: 0.85,
      trapBias: 1.1,
      inferenceBias: 1.4,
    },
  },
  sbi: {
    wordingStyle: "balanced",
    archetypeWeights: {
      "successive-percentage": 1.2,
      "ratio-conversion": 1.2,
      "conditional-ratio-logic": 1.15,
    },
    distractorWeights: {
      percentageTrap: 1.25,
      wrongIntermediateValue: 1.2,
      wrongDenominator: 1.15,
    },
    reasoningWeights: {
      speedBias: 1,
      trapBias: 1.2,
      inferenceBias: 1,
    },
  },
  rrb: {
    wordingStyle: "concise",
    archetypeWeights: {
      "direct-substitution": 1.25,
      "simple-ratio": 1.2,
      "one-step-arithmetic": 1.2,
    },
    distractorWeights: {
      arithmeticSlip: 1.25,
      percentageTrap: 1.1,
    },
    reasoningWeights: {
      speedBias: 1.2,
      trapBias: 0.95,
      inferenceBias: 0.85,
    },
  },
};

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

type DIPattern = {
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

type OptionResult = {
  options: string[];
  correct: number;
  optionMetadata?: OptionMetadata[];
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
} & GeneratedQuestionDifficulty;

export type DIQuestion =
  QuestionCore &
    GeneratedQuestionDifficulty;

type DIDataRow = Record<
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

  type:
    | "formula"
    | "logic"
    | "di";

  section: string;

  topic: string;

  subtopic: string;

  difficulty?: DifficultyLabel;

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

function randomInt(min: number, max: number) {
  return Math.floor(
    Math.random() * (max - min + 1),
  ) + min;
}

function generateValues(
  variables: Pattern["variables"],
): Record<string, number> {
  const values: Record<string, number> = {};

  for (const key in variables) {
    const { min, max } = variables[key];

    values[key] = randomInt(min, max);
  }

  return values;
}

function pickRandomTemplate(
  templateVariants: string[],
): string {
  if (!templateVariants?.length) {
    throw new Error(
      "No template variants provided",
    );
  }

  const idx = Math.floor(
    Math.random() * templateVariants.length,
  );

  return templateVariants[idx];
}

function pickRandomItem<T>(
  items: T[],
): T {
  if (!items.length) {
    throw new Error(
      "Expected at least one item",
    );
  }

  return items[
    randomInt(0, items.length - 1)
  ];
}

function pickWeightedItem<T>(
  items: T[],
  getWeight: (
    item: T,
  ) => number | undefined,
): T {
  if (!items.length) {
    throw new Error(
      "Expected at least one item",
    );
  }
function pickMotif(
  topicCluster: QuantTopicCluster,
) {
  const compatibleMotifs =
    ALL_MOTIFS.filter(
      (motif) =>
        motif.topicCluster ===
        topicCluster,
    );

  if (!compatibleMotifs.length) {
    return null;
  }

  return pickRandomItem(
    compatibleMotifs,
  );
}
  const weighted = items.map((item) => ({
    item,
    weight: Math.max(
      0.1,
      getWeight(item) ?? 1,
    ),
  }));
  const totalWeight = weighted.reduce(
    (sum, entry) => sum + entry.weight,
    0,
  );
  let roll = Math.random() * totalWeight;

  for (const entry of weighted) {
    roll -= entry.weight;

    if (roll <= 0) {
      return entry.item;
    }
  }

  return weighted[
    weighted.length - 1
  ]!.item;
}

function buildPrompt(
  variants: string[],
  replacements: Record<
    string,
    string | number
  >,
) {
  let prompt = pickRandomItem(
    variants,
  );

  for (const [key, value] of Object.entries(
    replacements,
  )) {
    prompt = prompt.replaceAll(
      `{${key}}`,
      String(value),
    );
  }

  return prompt;
}

function getExamProfileConfig(
  examProfile: ExamProfileId = "custom",
) {
  return (
    EXAM_PROFILE_CONFIGS[examProfile] ??
    EXAM_PROFILE_CONFIGS.custom
  );
}

function fillTemplate(
  template: string,
  values: Record<string, number>,
) {
  let result = template;

  for (const key in values) {
    result = result.replaceAll(
      `{{${key}}}`,
      String(values[key]),
    );
  }

  return result;
}

function renderExplanation(
  template: string,
  values: Record<string, number>,
  answer: number,
) {
  let result = template;

  for (const key in values) {
    result = result.replaceAll(
      `{{${key}}}`,
      String(values[key]),
    );
  }

  result = result.replaceAll(
    "{{answer}}",
    String(answer),
  );

  return result;
}

function evaluateFormula(
  formula: string,
  values: Record<string, number>,
): number {
  try {
    const varNames = Object.keys(values);

    const varValues = varNames.map(
      (k) => values[k],
    );

    const fn = new Function(
      ...varNames,
      `return ${formula};`,
    );

    return Number(fn(...varValues));
  } catch {
    throw new Error("Invalid formula");
  }
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(
    () => Math.random() - 0.5,
  );
}

function clampDifficultyScore(
  score: number,
) {
  return Math.max(
    1,
    Math.min(
      10,
      Number(score.toFixed(1)),
    ),
  );
}

export function classifyDifficultyLabel(
  difficultyScore: number,
): DifficultyLabel {
  if (difficultyScore <= 3) {
    return "Easy";
  }

  if (difficultyScore <= 7) {
    return "Medium";
  }

  return "Hard";
}

function countMatches(
  value: string,
  pattern: RegExp,
) {
  return value.match(pattern)?.length ?? 0;
}

function hasAnyToken(
  value: string,
  tokens: string[],
) {
  return tokens.some((token) =>
    value.includes(token),
  );
}

function getVisualComplexity(
  visualType?: DIVisualType,
) {
  switch (visualType) {
    case "bar":
      return 2;
    case "pie":
      return 3;
    case "line":
      return 4;
    case "table":
    default:
      return 1;
  }
}

function getDefaultDifficultyDistribution(): DifficultyDistribution {
  return {
    easy: 20,
    medium: 60,
    hard: 20,
  };
}

function normalizeDifficultyDistribution(
  distribution?: Partial<DifficultyDistribution>,
) {
  const merged = {
    ...getDefaultDifficultyDistribution(),
    ...distribution,
  };
  const total =
    merged.easy +
    merged.medium +
    merged.hard;

  if (total <= 0) {
    return getDefaultDifficultyDistribution();
  }

  return {
    easy: (merged.easy / total) * 100,
    medium:
      (merged.medium / total) * 100,
    hard: (merged.hard / total) * 100,
  };
}

function getDifficultyBucketTargets(
  count: number,
  distribution?: Partial<DifficultyDistribution>,
) {
  const normalized =
    normalizeDifficultyDistribution(
      distribution,
    );

  const rawTargets = {
    Easy:
      (normalized.easy / 100) * count,
    Medium:
      (normalized.medium / 100) * count,
    Hard:
      (normalized.hard / 100) * count,
  };

  const targets: Record<
    DifficultyLabel,
    number
  > = {
    Easy: Math.floor(rawTargets.Easy),
    Medium:
      Math.floor(rawTargets.Medium),
    Hard: Math.floor(rawTargets.Hard),
  };

  let assigned =
    targets.Easy +
    targets.Medium +
    targets.Hard;

  const remainders = (
    Object.keys(
      rawTargets,
    ) as DifficultyLabel[]
  )
    .map((label) => ({
      label,
      remainder:
        rawTargets[label] -
        targets[label],
    }))
    .sort(
      (a, b) =>
        b.remainder - a.remainder,
    );

  for (const entry of remainders) {
    if (assigned >= count) {
      break;
    }

    targets[entry.label] += 1;
    assigned += 1;
  }

  return targets;
}

type NumericDistractorContext = {
  examProfile?: ExamProfileId;
  topicCluster?: QuantTopicCluster;
  operationChain?: string[];
  strategy?: Pattern["distractorStrategy"];
};

type DistractorCandidate =
  DistractorMetadata & {
    value: number;
  };

function normalizeNumericValue(
  value: number,
) {
  return Number(value.toFixed(2));
}

function buildDistractorCandidate(
  distractorType: DistractorType,
  value: number,
  likelyMistake: string,
  reasoningTrap: string,
): DistractorCandidate {
  return {
    distractorType,
    value: normalizeNumericValue(value),
    likelyMistake,
    reasoningTrap,
  };
}

function getTrapTypesForContext(
  context?: NumericDistractorContext,
): DistractorType[] {
  const topicCluster =
    context?.topicCluster ??
    "general-quant";
  const operations =
    context?.operationChain ?? [];
  const trapTypes =
    new Set<DistractorType>([
      "arithmeticSlip",
      "wrongIntermediateValue",
      "prematureRounding",
    ]);

  if (
    topicCluster === "percentage" ||
    topicCluster === "profit-loss" ||
    topicCluster === "si-ci" ||
    operations.includes(
      "percentage",
    )
  ) {
    trapTypes.add(
      "percentageTrap",
    );
    trapTypes.add(
      "wrongDenominator",
    );
  }

  if (
    topicCluster ===
      "ratio-proportion" ||
    operations.includes("ratio")
  ) {
    trapTypes.add(
      "ratioInversion",
    );
  }

  if (
    operations.includes(
      "aggregate",
    ) ||
    operations.includes(
      "cumulative",
    )
  ) {
    trapTypes.add(
      "cumulativeMistake",
    );
  }

  if (
    operations.includes("compare")
  ) {
    trapTypes.add(
      "comparisonTrap",
    );
  }

  return [...trapTypes];
}

function generateDistractorValue(
  correct: number,
  distractorType: DistractorType,
) {
  const magnitude = Math.max(
    2,
    Math.round(
      Math.max(1, Math.abs(correct)) *
        0.08,
    ),
  );

  switch (distractorType) {
    case "percentageTrap":
      return correct + magnitude * 2;
    case "ratioInversion":
      return correct > 8
        ? correct / 2
        : correct * 2;
    case "wrongIntermediateValue":
      return correct + magnitude * 3;
    case "comparisonTrap":
      return correct - magnitude * 2;
    case "wrongDenominator":
      return correct + magnitude;
    case "prematureRounding":
      return Math.round(
        correct + magnitude / 3,
      );
    case "cumulativeMistake":
      return correct + magnitude * 4;
    case "arithmeticSlip":
    default:
      return correct - magnitude;
  }
}

function buildDistractorCandidates(
  correct: number,
  context?: NumericDistractorContext,
) {
  const profileConfig =
    getExamProfileConfig(
      context?.examProfile,
    );

  return getTrapTypesForContext(
    context,
  ).map((distractorType) => {
    const value =
      generateDistractorValue(
        correct,
        distractorType,
      );

    switch (distractorType) {
      case "percentageTrap":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Applied the percentage change on the wrong base.",
          "Reverse percentage and base-value confusion.",
        );
      case "ratioInversion":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Interchanged the ratio terms during normalization.",
          "Ratio inversion while converting to final values.",
        );
      case "wrongIntermediateValue":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Used an intermediate quantity as the final answer.",
          "Hidden dependency trap in the operation chain.",
        );
      case "comparisonTrap":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Compared the visible values before completing the transformation.",
          "Misleading comparison before full evaluation.",
        );
      case "wrongDenominator":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Computed the fraction with the wrong denominator.",
          "Percentage denominator trap.",
        );
      case "prematureRounding":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Rounded too early during calculation.",
          "Premature simplification trap.",
        );
      case "cumulativeMistake":
        return buildDistractorCandidate(
          distractorType,
          value,
          "Skipped one cumulative adjustment in the chain.",
          "Cumulative dependency trap.",
        );
      case "arithmeticSlip":
      default:
        return buildDistractorCandidate(
          distractorType,
          value,
          "Made a small arithmetic slip in the final computation.",
          "Last-step arithmetic trap.",
        );
    }
  }).sort((left, right) => {
    const leftWeight =
      profileConfig.distractorWeights[
        left.distractorType
      ] ?? 1;
    const rightWeight =
      profileConfig.distractorWeights[
        right.distractorType
      ] ?? 1;

    return rightWeight - leftWeight;
  });
}

type DifficultySignals = {
  operationCount: number;
  reasoningDepth: number;
  usesPercentage: boolean;
  usesRatio: boolean;
  usesComparison: boolean;
  visualComplexity: number;
  inferenceComplexity: number;
  directLookup: boolean;
  trendAnalysis: boolean;
  multiStep: boolean;
  combinedConditions: boolean;
  crossColumnInference: boolean;
};

type DifficultyEvaluationInput =
  | {
      kind: "formula";
      text: string;
      formula: string;
      values: Record<string, number>;
      explanation: string;
      reasoningSteps?: string[];
      dependencyComplexity?: number;
      operationChain?: string[];
    }
  | {
      kind: "di";
      text: string;
      explanation: string;
      visualType: DIVisualType;
      rowCount: number;
      numericColumnCount: number;
      reasoningSteps?: string[];
      dependencyComplexity?: number;
      operationChain?: string[];
    };

function deriveDifficultySignals(
  input: DifficultyEvaluationInput,
): DifficultySignals {
  if (input.kind === "formula") {
    const combinedText = `${input.text} ${input.explanation} ${input.formula}`.toLowerCase();
    const operationCount = Math.max(
      1,
      countMatches(
        input.formula,
        /[+\-*/%]/g,
      ),
    );
    const variableCount =
      Object.keys(input.values).length;
    const usesPercentage =
      hasAnyToken(combinedText, [
        "%",
        "percent",
        "percentage",
      ]);
    const usesRatio =
      hasAnyToken(combinedText, [
        "ratio",
        "proportion",
      ]);
    const usesComparison =
      hasAnyToken(combinedText, [
        "difference",
        "more than",
        "less than",
        "greater",
        "smaller",
      ]);
    const reasoningDepth = Math.min(
      5,
      Math.max(
        1,
        Math.ceil(
          (operationCount +
            Math.max(
              0,
              variableCount - 1,
            )) / 2,
        ),
      ),
    );
    const explicitReasoningDepth =
      input.reasoningSteps?.length ?? 0;
    const inferenceComplexity = Math.min(
      5,
      Math.max(
        1,
        Math.ceil(
          operationCount / 2,
        ) +
          (usesPercentage ? 1 : 0) +
          (usesRatio ? 1 : 0),
      ),
    );

    return {
      operationCount,
      reasoningDepth: Math.max(
        reasoningDepth,
        explicitReasoningDepth,
      ),
      usesPercentage,
      usesRatio,
      usesComparison,
      visualComplexity: 0,
      inferenceComplexity: Math.max(
        inferenceComplexity,
        input.dependencyComplexity ??
          1,
      ),
      directLookup: false,
      trendAnalysis: false,
      multiStep:
        operationCount >= 2 ||
        variableCount >= 3,
      combinedConditions:
        hasAnyToken(combinedText, [
          "if",
          "when",
          "respectively",
        ]),
      crossColumnInference: false,
    };
  }

  const combinedText = `${input.text} ${input.explanation}`.toLowerCase();
  const usesPercentage =
    hasAnyToken(combinedText, [
      "%",
      "percent",
      "percentage",
      "share",
      "growth",
    ]);
  const usesRatio =
    hasAnyToken(combinedText, [
      "ratio",
    ]);
  const usesComparison =
    hasAnyToken(combinedText, [
      "highest",
      "lowest",
      "difference",
      "increase",
      "decrease",
      "decline",
      "fluctuation",
      "largest",
      "smallest",
      "compare",
    ]);
  const directLookup =
    hasAnyToken(combinedText, [
      "highest",
      "lowest",
      "largest",
      "smallest",
    ]) &&
    !hasAnyToken(combinedText, [
      "difference",
      "increase",
      "growth",
      "ratio",
      "percentage",
      "share",
    ]);
  const trendAnalysis =
    hasAnyToken(combinedText, [
      "trend",
      "increase",
      "decline",
      "fluctuation",
      "growth",
      "consecutive",
    ]);
  const combinedConditions =
    hasAnyToken(combinedText, [
      "combined",
      "together",
      "overall",
      "from",
      "to",
    ]);
  let operationCount = 1;

  if (
    combinedText.includes("total")
  ) {
    operationCount = Math.max(
      2,
      input.rowCount - 1,
    );
  } else if (
    combinedText.includes("average")
  ) {
    operationCount = Math.max(
      2,
      input.rowCount,
    );
  } else if (usesPercentage) {
    operationCount = combinedText.includes(
      "combined",
    )
      ? 4
      : 3;
  } else if (usesRatio) {
    operationCount = 3;
  } else if (
    hasAnyToken(combinedText, [
      "difference",
      "increase",
      "decline",
      "fluctuation",
    ])
  ) {
    operationCount = trendAnalysis
      ? Math.max(2, input.rowCount - 1)
      : 2;
  } else if (directLookup) {
    operationCount = 1;
  }

  const reasoningDepth = Math.min(
    5,
    Math.max(
      1,
      (directLookup ? 1 : 2) +
        (trendAnalysis ? 2 : 0) +
        (usesPercentage ||
        usesRatio
          ? 1
          : 0) +
        (combinedConditions ? 1 : 0),
    ),
  );
  const explicitReasoningDepth =
    input.reasoningSteps?.length ?? 0;
  const inferenceComplexity = Math.min(
    5,
    Math.max(
      1,
      (directLookup ? 1 : 2) +
        (trendAnalysis ? 2 : 0) +
        (input.numericColumnCount > 1
          ? 1
          : 0) +
        (combinedConditions ? 1 : 0),
    ),
  );

  return {
    operationCount,
    reasoningDepth: Math.max(
      reasoningDepth,
      explicitReasoningDepth,
    ),
    usesPercentage,
    usesRatio,
    usesComparison,
    visualComplexity:
      getVisualComplexity(
        input.visualType,
      ),
    inferenceComplexity: Math.max(
      inferenceComplexity,
      input.dependencyComplexity ??
        1,
    ),
    directLookup,
    trendAnalysis,
    multiStep:
      operationCount >= 3 ||
      trendAnalysis ||
      usesPercentage ||
      usesRatio,
    combinedConditions,
    crossColumnInference:
      input.numericColumnCount > 1 &&
      combinedConditions,
  };
}

export function estimateDifficultyScore(
  input: DifficultyEvaluationInput,
) {
  const signals =
    deriveDifficultySignals(input);

  let score =
    1.6 +
    signals.operationCount * 0.45 +
    signals.reasoningDepth * 0.6 +
    signals.visualComplexity * 0.35 +
    signals.inferenceComplexity * 0.55;

  if (signals.usesPercentage) {
    score += 1;
  }

  if (signals.usesRatio) {
    score += 1.1;
  }

  if (signals.usesComparison) {
    score += 0.35;
  }

  if (signals.trendAnalysis) {
    score += 0.9;
  }

  if (signals.multiStep) {
    score += 0.65;
  }

  if (signals.combinedConditions) {
    score += 0.85;
  }

  if (signals.crossColumnInference) {
    score += 0.5;
  }

  if (signals.directLookup) {
    score -= 1.4;
  }

  return clampDifficultyScore(
    score,
  );
}

export function calculateDifficultyMetadata(
  input: DifficultyEvaluationInput,
): DifficultyMetadata {
  const signals =
    deriveDifficultySignals(input);
  const difficultyScore =
    estimateDifficultyScore(input);
  const difficultyLabel =
    classifyDifficultyLabel(
      difficultyScore,
    );

  return {
    difficultyScore,
    difficultyLabel,
    estimatedSolveTime: Math.max(
      20,
      Math.round(
        25 +
          difficultyScore * 14 +
          signals.operationCount * 4,
      ),
    ),
    operationCount:
      signals.operationCount,
    reasoningDepth:
      signals.reasoningDepth,
    reasoningSteps:
      input.reasoningSteps ?? [],
    dependencyComplexity:
      input.dependencyComplexity ??
      signals.inferenceComplexity,
    operationChain:
      input.operationChain ?? [],
    usesPercentage:
      signals.usesPercentage,
    usesRatio: signals.usesRatio,
    usesComparison:
      signals.usesComparison,
    visualComplexity:
      signals.visualComplexity,
    inferenceComplexity:
      signals.inferenceComplexity,
  };
}

function applyDifficultyMetadata<
  T extends object,
>(
  question: T,
  input: DifficultyEvaluationInput,
): T & GeneratedQuestionDifficulty {
  const difficultyMetadata =
    calculateDifficultyMetadata(
      input,
    );

  return {
    ...question,
    difficulty:
      difficultyMetadata.difficultyLabel,
    difficultyScore:
      difficultyMetadata.difficultyScore,
    difficultyLabel:
      difficultyMetadata.difficultyLabel,
    difficultyMetadata,
  };
}

export function validateDifficultyTarget(
  difficultyScore: number,
  options?: GeneratorOptions,
) {
  if (
    options?.targetDifficulty ===
    undefined
  ) {
    return true;
  }

  const tolerance =
    options.difficultyTolerance ?? 1;

  return (
    Math.abs(
      difficultyScore -
        options.targetDifficulty,
    ) <= tolerance
  );
}

function sortByTargetDifficulty<
  T extends {
    difficultyScore: number;
  },
>(
  questions: T[],
  targetDifficulty: number,
) {
  return [...questions].sort(
    (a, b) =>
      Math.abs(
        a.difficultyScore -
          targetDifficulty,
      ) -
      Math.abs(
        b.difficultyScore -
          targetDifficulty,
      ),
  );
}

export function buildDifficultyBalancedSet<
  T extends {
    difficultyLabel: DifficultyLabel;
    difficultyScore: number;
  },
>(
  questions: T[],
  desiredCount: number,
  options?: GeneratorOptions,
) {
  if (
    questions.length <= desiredCount &&
    !options?.difficultyDistribution &&
    options?.targetAverageDifficulty ===
      undefined &&
    options?.targetDifficulty ===
      undefined
  ) {
    return questions;
  }

  let pool = [...questions];

  if (
    options?.targetDifficulty !==
    undefined
  ) {
    const withinTolerance =
      sortByTargetDifficulty(
        pool.filter((question) =>
          validateDifficultyTarget(
            question.difficultyScore,
            options,
          ),
        ),
        options.targetDifficulty,
      );

    if (
      withinTolerance.length >=
      desiredCount
    ) {
      pool = withinTolerance;
    } else {
      pool = sortByTargetDifficulty(
        pool,
        options.targetDifficulty,
      );
    }
  }

  if (
    options?.difficultyDistribution
  ) {
    const targets =
      getDifficultyBucketTargets(
        desiredCount,
        options.difficultyDistribution,
      );
    const byLabel: Record<
      DifficultyLabel,
      T[]
    > = {
      Easy: pool
        .filter(
          (question) =>
            question.difficultyLabel ===
            "Easy",
        )
        .sort(
          (a, b) =>
            a.difficultyScore -
            b.difficultyScore,
        ),
      Medium: pool
        .filter(
          (question) =>
            question.difficultyLabel ===
            "Medium",
        )
        .sort(
          (a, b) =>
            a.difficultyScore -
            b.difficultyScore,
        ),
      Hard: pool
        .filter(
          (question) =>
            question.difficultyLabel ===
            "Hard",
        )
        .sort(
          (a, b) =>
            a.difficultyScore -
            b.difficultyScore,
        ),
    };

    const selected: T[] = [];

    (
      Object.keys(targets) as DifficultyLabel[]
    ).forEach((label) => {
      selected.push(
        ...byLabel[label].slice(
          0,
          targets[label],
        ),
      );
    });

    if (selected.length < desiredCount) {
      const selectedSet = new Set(
        selected,
      );
      const remainder = pool.filter(
        (question) =>
          !selectedSet.has(question),
      );
      selected.push(
        ...remainder.slice(
          0,
          desiredCount -
            selected.length,
        ),
      );
    }

    pool = selected;
  }

  if (
    options?.targetAverageDifficulty !==
    undefined
  ) {
    pool = sortByTargetDifficulty(
      pool,
      options.targetAverageDifficulty,
    );
  }

  return pool.slice(0, desiredCount);
}

function generateOptions(
  correct: number,
  strategy?: Pattern["distractorStrategy"],
  context?: NumericDistractorContext,
): OptionResult {
  const normalizedCorrect =
    normalizeNumericValue(correct);
  const optionPool = new Map<
    string,
    OptionMetadata
  >();
  const addOption = (
    value: number,
    metadata?: DistractorMetadata,
  ) => {
    const normalized =
      normalizeNumericValue(value);

    if (
      normalized ===
      normalizedCorrect
    ) {
      return;
    }

    const key = String(normalized);

    if (!optionPool.has(key)) {
      optionPool.set(key, {
        value: key,
        isCorrect: false,
        ...metadata,
      });
    }
  };
  const correctLabel = String(
    normalizedCorrect,
  );

  optionPool.set(correctLabel, {
    value: correctLabel,
    isCorrect: true,
  });

  if (strategy?.type === "numeric_offsets") {
    for (const offset of strategy.offsets) {
      addOption(
        correct + offset,
        {
          distractorType:
            "arithmeticSlip",
          likelyMistake:
            "Applied a familiar offset instead of resolving the full chain.",
          reasoningTrap:
            "Shortcut arithmetic trap from preset distractor offsets.",
        },
      );
    }
  }

  for (const distractor of buildDistractorCandidates(
    correct,
    {
      ...context,
      strategy,
    },
  )) {
    addOption(
      distractor.value,
      distractor,
    );
  }

  while (optionPool.size < 4) {
    const variance = Math.max(
      2,
      Math.round(
        Math.abs(correct) * 0.1,
      ),
    );

    addOption(
      correct +
        randomInt(
          -variance,
          variance,
        ),
      {
        distractorType:
          "arithmeticSlip",
        likelyMistake:
          "Made a near-value arithmetic slip.",
        reasoningTrap:
          "Close-value arithmetic trap.",
      },
    );
  }

  const shuffled = shuffle(
    [
      ...optionPool.values(),
    ].slice(0, 4),
  );

  return {
    options: shuffled.map(
      (option) => option.value,
    ),
    correct: shuffled.indexOf(
      shuffled.find(
        (option) => option.isCorrect,
      )!,
    ),
    optionMetadata: shuffled,
  };
}

function getCategoryLabel(
  di: DIPattern,
  index: number,
) {
  return (
    di.categories?.[index] ??
    `Category ${index + 1}`
  );
}

function generateDISet(
  pattern: Pattern,
): DIDataRow[] {
  const di = pattern.diPattern;

  if (!di) {
    throw new Error(
      "DI pattern configuration is missing",
    );
  }

  if (!di.columns.length) {
    throw new Error(
      "DI pattern must include columns",
    );
  }

  const rows: DIDataRow[] = [];

  for (
    let i = 0;
    i < di.rowCount;
    i++
  ) {
    const row: DIDataRow = {};

    for (const column of di.columns) {
      const range =
        di.valueRanges[column];

      row[column] = range
        ? randomInt(
            range.min,
            range.max,
          )
        : getCategoryLabel(di, i);
    }

    rows.push(row);
  }

  return rows;
}

function selectSeriesCount(
  availableCount: number,
  visualType: DIVisualType,
) {
  if (availableCount <= 1) {
    return availableCount;
  }

  const roll = Math.random();

  if (visualType === "line") {
    if (
      availableCount >= 3 &&
      roll > 0.95
    ) {
      return 3;
    }

    if (roll > 0.65) {
      return 2;
    }

    return 1;
  }

  if (visualType === "bar") {
    if (
      availableCount >= 3 &&
      roll > 0.95
    ) {
      return 3;
    }

    if (roll > 0.75) {
      return 2;
    }

    return 1;
  }

  return 1;
}

function getSeriesConfig(
  di: DIPattern,
  tableData: DIDataRow[],
  visualType: DIVisualType,
) {
  const numericColumns =
    getNumericColumns(tableData);

  if (di.series?.length) {
    return di.series.filter((series) =>
      numericColumns.includes(
        series.column,
      ),
    );
  }

  if (
    visualType !== "bar" &&
    visualType !== "line"
  ) {
    return undefined;
  }

  const seriesCount =
    selectSeriesCount(
      numericColumns.length,
      visualType,
    );

  return numericColumns
    .slice(0, seriesCount)
    .map(
    (column) => ({
      column,
      type: visualType,
      label: column,
    }),
  );
}

function getNumericColumns(
  tableData: DIDataRow[],
) {
  const firstRow = tableData[0];

  if (!firstRow) {
    return [];
  }

  return Object.keys(firstRow).filter(
    (key) =>
      typeof firstRow[key] === "number",
  );
}

function getCategoryColumn(
  tableData: DIDataRow[],
) {
  const firstRow = tableData[0];

  if (!firstRow) {
    return undefined;
  }

  return Object.keys(firstRow).find(
    (key) =>
      typeof firstRow[key] === "string",
  );
}

function generateChoiceOptions(
  choices: string[],
  correctChoice: string,
): OptionResult {
  const uniqueChoices = [
    ...new Set(choices),
  ];

  const shuffled =
    shuffle(uniqueChoices);

  return {
    options: shuffled,
    correct: shuffled.indexOf(
      correctChoice,
    ),
  };
}

function createNumericQuestion(
  text: string,
  correct: number,
  explanation: string,
  context?: NumericDistractorContext,
): QuestionCore {
  const generated =
    generateOptions(
      correct,
      undefined,
      context,
    );

  return {
    text,
    options: generated.options,
    correct: generated.correct,
    explanation,
    optionMetadata:
      generated.optionMetadata,
  };
}

function createCategoryQuestion(
  text: string,
  categories: string[],
  correctCategory: string,
  explanation: string,
): QuestionCore {
  const generated =
    generateChoiceOptions(
      categories,
      correctCategory,
    );

  return {
    text,
    options: generated.options,
    correct: generated.correct,
    explanation,
  };
}

function createChoiceQuestion(
  text: string,
  choices: string[],
  correctChoice: string,
  explanation: string,
): QuestionCore {
  const generated =
    generateChoiceOptions(
      choices,
      correctChoice,
    );

  return {
    text,
    options: generated.options,
    correct: generated.correct,
    explanation,
  };
}

type ReasoningOperation =
  | "aggregate"
  | "average"
  | "filter"
  | "compare"
  | "transform"
  | "reverse"
  | "infer"
  | "rank"
  | "ratio"
  | "percentage"
  | "trend"
  | "cumulative"
  | "deviation"
  | "conditional-selection";

type ReasoningStep = {
  operation: ReasoningOperation;
  detail: string;
};

type QuantArchetype = {
  id: string;
  difficulty: DifficultyLabel;
  category: QuantReasoningCategory;
  topicClusters: QuantTopicCluster[];
  operationChain: ReasoningOperation[];
  wordingVariants: string[];
  buildReasoningSteps: (
    context: QuantArchetypeContext,
  ) => ReasoningStep[];
};

type QuantArchetypeContext = {
  pattern: Pattern;
  baseText: string;
  values: Record<string, number>;
  correctAnswer: number;
  topicCluster: QuantTopicCluster;
};

function createReasoningStep(
  operation: ReasoningOperation,
  detail: string,
): ReasoningStep {
  return {
    operation,
    detail,
  };
}

function attachReasoningTrace<
  TQuestion extends QuestionCore,
>(
  question: TQuestion,
  steps: ReasoningStep[],
  dependencyComplexity = steps.length,
  operationChain = steps.map(
    (step) => step.operation,
  ),
): TQuestion & {
  reasoningSteps: string[];
  dependencyComplexity: number;
  operationChain: ReasoningOperation[];
} {
  return {
    ...question,
    reasoningSteps: steps.map(
      (step) =>
        `${step.operation}: ${step.detail}`,
    ),
    dependencyComplexity,
    operationChain,
  };
}

function filterCategoryIndices(
  context: DIQuestionContext,
  predicate: (
    _value: number,
    _index: number,
  ) => boolean,
) {
  return context.values
    .map((value, index) => ({
      value,
      index,
    }))
    .filter(({ value, index }) =>
      predicate(value, index),
    )
    .map((entry) => entry.index);
}

function aggregateByIndices(
  values: number[],
  indices: number[],
) {
  return indices.reduce(
    (sum, index) =>
      sum + values[index],
    0,
  );
}

function inferQuantTopicCluster(
  pattern: Pattern,
): QuantTopicCluster {
  const topicText = `${pattern.topic} ${pattern.subtopic} ${pattern.formula ?? ""}`.toLowerCase();

  if (
    hasAnyToken(topicText, [
      "percent",
      "percentage",
    ])
  ) {
    return "percentage";
  }

  if (
    hasAnyToken(topicText, [
      "ratio",
      "proportion",
    ])
  ) {
    return "ratio-proportion";
  }

  if (
    hasAnyToken(topicText, [
      "profit",
      "loss",
      "discount",
      "marked price",
    ])
  ) {
    return "profit-loss";
  }

  if (
    hasAnyToken(topicText, [
      "average",
      "mean",
    ])
  ) {
    return "averages";
  }

  if (
    hasAnyToken(topicText, [
      "simple interest",
      "compound interest",
      "si",
      "ci",
      "interest",
    ])
  ) {
    return "si-ci";
  }

  return "general-quant";
}

function getRequestedDifficultyLabel(
  pattern: Pattern,
  options?: GeneratorOptions,
): DifficultyLabel {
  if (
    options?.targetDifficulty !==
    undefined
  ) {
    return classifyDifficultyLabel(
      options.targetDifficulty,
    );
  }

  if (
    options?.targetAverageDifficulty !==
    undefined
  ) {
    return classifyDifficultyLabel(
      options.targetAverageDifficulty,
    );
  }

  return (
    pattern.difficulty ??
    "Medium"
  );
}

function buildQuantPrompt(
  archetype: QuantArchetype,
  context: QuantArchetypeContext,
  examProfile: ExamProfileId,
) {
  const profileConfig =
    getExamProfileConfig(examProfile);
  const variants = [
    ...archetype.wordingVariants,
  ];

  if (profileConfig.wordingStyle === "concise") {
    variants.push(
      "Answer quickly: {baseText}",
      "Find the answer: {baseText}",
    );
  }

  if (
    profileConfig.wordingStyle ===
    "inference-heavy"
  ) {
    variants.push(
      "Infer the hidden relationship and answer: {baseText}",
      "Determine the required value after decoding the condition: {baseText}",
    );
  }

  return buildPrompt(
    variants,
    {
      baseText: context.baseText,
      topic: context.pattern.topic,
      subtopic:
        context.pattern.subtopic,
    },
  );
}

const UNIVERSAL_QUANT_ARCHETYPES: QuantArchetype[] =
  [
    {
      id: "easy-direct-substitution",
      difficulty: "Easy",
      category:
        "direct-substitution",
      topicClusters: [
        "percentage",
        "ratio-proportion",
        "profit-loss",
        "averages",
        "si-ci",
        "general-quant",
      ],
      operationChain: [
        "transform",
      ],
      wordingVariants: [
        "{baseText}",
        "Find the required value: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Substitute the given values directly into the required relation.",
        ),
      ],
    },
    {
      id: "easy-one-step-arithmetic",
      difficulty: "Easy",
      category:
        "one-step-arithmetic",
      topicClusters: [
        "profit-loss",
        "averages",
        "general-quant",
      ],
      operationChain: [
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Compute the answer directly from the given data: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Form the needed arithmetic expression.",
        ),
        createReasoningStep(
          "compare",
          "Evaluate the final one-step result.",
        ),
      ],
    },
    {
      id: "easy-simple-percentage",
      difficulty: "Easy",
      category:
        "simple-percentage",
      topicClusters: [
        "percentage",
        "profit-loss",
      ],
      operationChain: [
        "percentage",
      ],
      wordingVariants: [
        "{baseText}",
        "Using the percentage relation, answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "percentage",
          "Convert the given information into a direct percentage calculation.",
        ),
      ],
    },
    {
      id: "easy-simple-ratio",
      difficulty: "Easy",
      category: "simple-ratio",
      topicClusters: [
        "ratio-proportion",
      ],
      operationChain: [
        "ratio",
      ],
      wordingVariants: [
        "{baseText}",
        "Using the direct ratio relation, solve: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "ratio",
          "Apply the direct ratio or proportion relation.",
        ),
      ],
    },
    {
      id: "medium-successive-percentage",
      difficulty: "Medium",
      category:
        "successive-percentage",
      topicClusters: [
        "percentage",
        "profit-loss",
        "si-ci",
      ],
      operationChain: [
        "percentage",
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Work through the percentage changes carefully: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "percentage",
          "Convert each percentage condition into its numeric effect.",
        ),
        createReasoningStep(
          "transform",
          "Carry the transformed value forward to the next step.",
        ),
        createReasoningStep(
          "compare",
          "Evaluate the resulting quantity.",
        ),
      ],
    },
    {
      id: "medium-average-transformation",
      difficulty: "Medium",
      category:
        "average-transformation",
      topicClusters: [
        "averages",
      ],
      operationChain: [
        "aggregate",
        "average",
        "transform",
      ],
      wordingVariants: [
        "{baseText}",
        "Rework the average relationship to solve: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "aggregate",
          "Express the total from the average information.",
        ),
        createReasoningStep(
          "average",
          "Adjust the average relation using the given change.",
        ),
        createReasoningStep(
          "transform",
          "Solve the updated equation.",
        ),
      ],
    },
    {
      id: "medium-comparison-chain",
      difficulty: "Medium",
      category:
        "comparison-chain",
      topicClusters: [
        "ratio-proportion",
        "profit-loss",
        "general-quant",
      ],
      operationChain: [
        "compare",
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Compare the linked quantities step by step: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Identify the primary comparison stated in the question.",
        ),
        createReasoningStep(
          "transform",
          "Translate that comparison into a solvable equation.",
        ),
        createReasoningStep(
          "compare",
          "Evaluate the final required relation.",
        ),
      ],
    },
    {
      id: "medium-ratio-conversion",
      difficulty: "Medium",
      category:
        "ratio-conversion",
      topicClusters: [
        "ratio-proportion",
        "percentage",
      ],
      operationChain: [
        "ratio",
        "transform",
        "percentage",
      ],
      wordingVariants: [
        "{baseText}",
        "Convert the ratio into the needed form and solve: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "ratio",
          "Normalize the ratio into comparable units.",
        ),
        createReasoningStep(
          "transform",
          "Translate the normalized ratio into actual values.",
        ),
        createReasoningStep(
          "percentage",
          "Convert the transformed value into the asked form.",
        ),
      ],
    },
    {
      id: "medium-multi-step-arithmetic",
      difficulty: "Medium",
      category:
        "multi-step-arithmetic",
      topicClusters: [
        "profit-loss",
        "averages",
        "si-ci",
        "general-quant",
      ],
      operationChain: [
        "transform",
        "aggregate",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Use the linked arithmetic conditions to find the answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Rewrite the givens into usable intermediate quantities.",
        ),
        createReasoningStep(
          "aggregate",
          "Combine the intermediate values.",
        ),
        createReasoningStep(
          "compare",
          "Extract the asked result from the combined quantity.",
        ),
      ],
    },
    {
      id: "hard-reverse-percentage",
      difficulty: "Hard",
      category:
        "reverse-percentage",
      topicClusters: [
        "percentage",
        "profit-loss",
        "si-ci",
      ],
      operationChain: [
        "reverse",
        "percentage",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        "Work backward from the percentage condition to solve: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "reverse",
          "Start from the final percentage condition and reverse the change.",
        ),
        createReasoningStep(
          "percentage",
          "Translate the reversed state into a percentage equation.",
        ),
        createReasoningStep(
          "infer",
          "Infer the original hidden value.",
        ),
      ],
    },
    {
      id: "hard-hidden-base-inference",
      difficulty: "Hard",
      category:
        "hidden-base-inference",
      topicClusters: [
        "percentage",
        "profit-loss",
        "averages",
        "si-ci",
      ],
      operationChain: [
        "infer",
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Infer the hidden base quantity before solving: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "infer",
          "Identify the concealed base or principal quantity.",
        ),
        createReasoningStep(
          "transform",
          "Express the hidden base using the given relationships.",
        ),
        createReasoningStep(
          "compare",
          "Resolve the asked comparison or value.",
        ),
      ],
    },
    {
      id: "hard-conditional-ratio-logic",
      difficulty: "Hard",
      category:
        "conditional-ratio-logic",
      topicClusters: [
        "ratio-proportion",
        "profit-loss",
      ],
      operationChain: [
        "ratio",
        "conditional-selection",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        "Apply the ratio condition carefully, then resolve the hidden relation: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "ratio",
          "Normalize the base ratio condition.",
        ),
        createReasoningStep(
          "conditional-selection",
          "Apply the condition that changes or filters the ratio relation.",
        ),
        createReasoningStep(
          "infer",
          "Infer the final hidden quantity from the conditioned ratio.",
        ),
      ],
    },
    {
      id: "hard-chained-percentage-ratio",
      difficulty: "Hard",
      category:
        "chained-percentage-ratio",
      topicClusters: [
        "percentage",
        "ratio-proportion",
        "profit-loss",
      ],
      operationChain: [
        "ratio",
        "percentage",
        "transform",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Chain the ratio and percentage transformations to answer: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "ratio",
          "Express the quantities in ratio form.",
        ),
        createReasoningStep(
          "percentage",
          "Convert the ratio relation into percentage movement.",
        ),
        createReasoningStep(
          "transform",
          "Carry the transformed result into the next relation.",
        ),
        createReasoningStep(
          "compare",
          "Evaluate the final target value or comparison.",
        ),
      ],
    },
    {
      id: "hard-comparative-conditional-inference",
      difficulty: "Hard",
      category:
        "comparative-conditional-inference",
      topicClusters: [
        "averages",
        "profit-loss",
        "si-ci",
        "general-quant",
      ],
      operationChain: [
        "compare",
        "filter",
        "infer",
        "compare",
      ],
      wordingVariants: [
        "{baseText}",
        "Track the conditional comparison chain to solve: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "compare",
          "Identify the initial comparison relation.",
        ),
        createReasoningStep(
          "filter",
          "Apply the condition that narrows the valid case.",
        ),
        createReasoningStep(
          "infer",
          "Infer the intermediate hidden quantity.",
        ),
        createReasoningStep(
          "compare",
          "Use that inferred result in the final comparison.",
        ),
      ],
    },
    {
      id: "hard-nested-operations",
      difficulty: "Hard",
      category:
        "nested-operations",
      topicClusters: [
        "percentage",
        "ratio-proportion",
        "profit-loss",
        "averages",
        "si-ci",
        "general-quant",
      ],
      operationChain: [
        "transform",
        "aggregate",
        "reverse",
        "infer",
      ],
      wordingVariants: [
        "{baseText}",
        "Work through the nested operations carefully: {baseText}",
      ],
      buildReasoningSteps: () => [
        createReasoningStep(
          "transform",
          "Transform the given quantities into intermediate values.",
        ),
        createReasoningStep(
          "aggregate",
          "Combine the intermediate states into a usable relation.",
        ),
        createReasoningStep(
          "reverse",
          "Reverse the final condition to uncover the missing state.",
        ),
        createReasoningStep(
          "infer",
          "Infer the requested answer from the nested chain.",
        ),
      ],
    },
  ];

function getQuantArchetypeCandidates(
  topicCluster: QuantTopicCluster,
  difficulty: DifficultyLabel,
) {
  return UNIVERSAL_QUANT_ARCHETYPES.filter(
    (archetype) =>
      archetype.difficulty ===
        difficulty &&
      archetype.topicClusters.includes(
        topicCluster,
      ),
  );
}

function selectQuantArchetype(
  pattern: Pattern,
  options: GeneratorOptions | undefined,
  topicCluster: QuantTopicCluster,
) {
  const profileConfig =
    getExamProfileConfig(
      options?.examProfile,
    );
  const requestedDifficulty =
    getRequestedDifficultyLabel(
      pattern,
      options,
    );
    const motif = pickMotif(
  topicCluster,
);
  const preferredCandidates =
    getQuantArchetypeCandidates(
      topicCluster,
      requestedDifficulty,
    );

  if (preferredCandidates.length) {
    return pickWeightedItem(
  preferredCandidates,
  (archetype) => {
    let weight =
      profileConfig
        .archetypeWeights[
        archetype.category
      ] ?? 1;

    if (
      motif?.preferredArchetypes?.includes(
        archetype.id,
      )
    ) {
      weight *= 1.5;
    }

    return weight;
  },
);
  }

  return pickWeightedItem(
    getQuantArchetypeCandidates(
      "general-quant",
      requestedDifficulty,
    ),
    (archetype) =>
      profileConfig.archetypeWeights[
        archetype.category
      ] ?? 1,
  );
}

function buildExamRealismMetadata(
  examProfile: ExamProfileId,
  archetype: QuantArchetype,
  optionMetadata: OptionMetadata[] | undefined,
): ExamRealismMetadata {
  const profileConfig =
    getExamProfileConfig(
      examProfile,
    );
  const distractorSummary = (
    optionMetadata ?? []
  )
    .filter(
      (option) =>
        !option.isCorrect &&
        option.distractorType,
    )
    .map(
      (option) =>
        option.distractorType!,
    );

  return {
    examProfile,
    wordingStyle:
      profileConfig.wordingStyle,
    archetypeId: archetype.id,
    archetypeCategory:
      archetype.category,
    reasoningTraps: [
      ...new Set(
        (optionMetadata ?? [])
          .filter(
            (option) =>
              !option.isCorrect &&
              option.reasoningTrap,
          )
          .map(
            (option) =>
              option.reasoningTrap!,
          ),
      ),
    ],
    weightingSummary: [
      `Archetype weight ${(
        profileConfig
          .archetypeWeights[
          archetype.category
        ] ?? 1
      ).toFixed(2)}`,
      `Trap bias ${profileConfig.reasoningWeights.trapBias.toFixed(
        2,
      )}`,
      `Inference bias ${profileConfig.reasoningWeights.inferenceBias.toFixed(
        2,
      )}`,
      distractorSummary.length
        ? `Distractor mix ${distractorSummary.join(
            ", ",
          )}`
        : "Distractor mix standard",
    ],
  };
}

type DIQuestionContext = {
  tableData: DIDataRow[];
  visualType: DIVisualType;
  series?: DISeriesConfig[];
  categoryColumn: string;
  numericColumn: string;
  numericColumns: string[];
  values: number[];
  categories: string[];
  total: number;
  average: number;
  highestIndex: number;
  lowestIndex: number;
};

type DIQuestionGenerator = (
  context: DIQuestionContext,
) => QuestionCore | undefined;

type ConsecutiveComparison = {
  label: string;
  fromCategory: string;
  toCategory: string;
  fromValue: number;
  toValue: number;
  difference: number;
  absoluteDifference: number;
};

function createDIQuestionContext(
  tableData: DIDataRow[],
  visualType: DIVisualType,
  series: DISeriesConfig[] | undefined,
  categoryColumn: string,
  numericColumns: string[],
  numericColumn: string,
): DIQuestionContext {
  const values = tableData.map(
    (row) => Number(row[numericColumn]),
  );

  const categories = tableData.map(
    (row) => String(row[categoryColumn]),
  );

  const total = values.reduce(
    (sum, value) => sum + value,
    0,
  );

  const average = Math.round(
    total / values.length,
  );

  const highest = Math.max(...values);

  const lowest = Math.min(...values);

  const highestIndex =
    values.indexOf(highest);

  const lowestIndex =
    values.indexOf(lowest);

  return {
    tableData,
    visualType,
    series,
    categoryColumn,
    numericColumn,
    numericColumns,
    values,
    categories,
    total,
    average,
    highestIndex,
    lowestIndex,
  };
}

function generateTotalQuestion(
  context: DIQuestionContext,
): QuestionCore {
  return createNumericQuestion(
    buildPrompt(
      [
        `What is the total {numericColumn}?`,
        `Find the sum of {numericColumn} across all {categoryColumn} values.`,
      ],
      {
        numericColumn:
          context.numericColumn,
        categoryColumn:
          context.categoryColumn,
      },
    ),
    context.total,
    `Total ${context.numericColumn} = ${context.total}`,
  );
}

function generateAverageQuestion(
  context: DIQuestionContext,
): QuestionCore {
  return createNumericQuestion(
    buildPrompt(
      [
        `What is the average {numericColumn}?`,
        `Calculate the mean {numericColumn} for the given {categoryColumn} values.`,
      ],
      {
        numericColumn:
          context.numericColumn,
        categoryColumn:
          context.categoryColumn,
      },
    ),
    context.average,
    `Average ${context.numericColumn} = ${context.total} / ${context.values.length}`,
  );
}

function generateHighestQuestion(
  context: DIQuestionContext,
): QuestionCore {
  const correctCategory =
    context.categories[
      context.highestIndex
    ];

  return createCategoryQuestion(
    buildPrompt(
      [
        `Which {categoryColumn} had the highest {numericColumn}?`,
        `Identify the {categoryColumn} with the maximum {numericColumn}.`,
      ],
      {
        categoryColumn:
          context.categoryColumn,
        numericColumn:
          context.numericColumn,
      },
    ),
    context.categories,
    correctCategory,
    `${correctCategory} had the highest ${context.numericColumn}.`,
  );
}

function generateLowestQuestion(
  context: DIQuestionContext,
): QuestionCore {
  const correctCategory =
    context.categories[
      context.lowestIndex
    ];

  return createCategoryQuestion(
    buildPrompt(
      [
        `Which {categoryColumn} had the lowest {numericColumn}?`,
        `Identify the {categoryColumn} with the minimum {numericColumn}.`,
      ],
      {
        categoryColumn:
          context.categoryColumn,
        numericColumn:
          context.numericColumn,
      },
    ),
    context.categories,
    correctCategory,
    `${correctCategory} had the lowest ${context.numericColumn}.`,
  );
}

function generateDifferenceQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (context.values.length < 2) {
    return undefined;
  }

  const firstCategory =
    context.categories[0];

  const secondCategory =
    context.categories[1];

  const difference = Math.abs(
    context.values[0] -
      context.values[1],
  );

  return createNumericQuestion(
    `What is the difference between ${firstCategory} and ${secondCategory} ${context.numericColumn}?`,
    difference,
    `Difference = ${difference}`,
  );
}

function generatePercentageQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (context.values.length < 2) {
    return undefined;
  }

  const firstCategory =
    context.categories[0];

  const secondCategory =
    context.categories[1];

  const firstValue =
    context.values[0];

  const secondValue =
    context.values[1];

  const percentageIncrease =
    firstValue === 0
      ? 0
      : Math.round(
          ((secondValue - firstValue) /
            firstValue) *
            100,
        );

  return createNumericQuestion(
    buildPrompt(
      [
        `What is the percentage increase from {firstCategory} to {secondCategory} in {numericColumn}?`,
        `By what percent did {numericColumn} rise from {firstCategory} to {secondCategory}?`,
      ],
      {
        firstCategory,
        secondCategory,
        numericColumn:
          context.numericColumn,
      },
    ),
    percentageIncrease,
    `Percentage increase = ${percentageIncrease}%`,
  );
}

function getConsecutiveComparisons(
  context: DIQuestionContext,
): ConsecutiveComparison[] {
  const comparisons: ConsecutiveComparison[] =
    [];

  for (
    let i = 1;
    i < context.values.length;
    i++
  ) {
    const fromCategory =
      context.categories[i - 1];
    const toCategory =
      context.categories[i];
    const fromValue =
      context.values[i - 1];
    const toValue =
      context.values[i];
    const difference =
      toValue - fromValue;

    comparisons.push({
      label: `${fromCategory} to ${toCategory}`,
      fromCategory,
      toCategory,
      fromValue,
      toValue,
      difference,
      absoluteDifference:
        Math.abs(difference),
    });
  }

  return comparisons;
}

function getOverallTrend(
  values: number[],
) {
  const differences = values
    .slice(1)
    .map(
      (value, index) =>
        value - values[index],
    );

  if (
    differences.every(
      (difference) =>
        difference > 0,
    )
  ) {
    return "Increasing";
  }

  if (
    differences.every(
      (difference) =>
        difference < 0,
    )
  ) {
    return "Decreasing";
  }

  if (
    differences.every(
      (difference) =>
        difference === 0,
    )
  ) {
    return "No change";
  }

  return "Fluctuating";
}

function generateLineTrendQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (context.values.length < 2) {
    return undefined;
  }

  const trend =
    getOverallTrend(context.values);

  return createChoiceQuestion(
    `What was the overall trend in ${context.numericColumn}?`,
    [
      "Increasing",
      "Decreasing",
      "Fluctuating",
      "No change",
    ],
    trend,
    `${context.numericColumn} was ${trend.toLowerCase()} across the given ${context.categoryColumn} values.`,
  );
}

function generateLineHighestPointQuestion(
  context: DIQuestionContext,
): QuestionCore {
  const correctCategory =
    context.categories[
      context.highestIndex
    ];

  return createCategoryQuestion(
    `During which ${context.categoryColumn} was ${context.numericColumn} highest?`,
    context.categories,
    correctCategory,
    `${context.numericColumn} was highest during ${correctCategory}.`,
  );
}

function generateLineLowestPointQuestion(
  context: DIQuestionContext,
): QuestionCore {
  const correctCategory =
    context.categories[
      context.lowestIndex
    ];

  return createCategoryQuestion(
    `During which ${context.categoryColumn} was ${context.numericColumn} lowest?`,
    context.categories,
    correctCategory,
    `${context.numericColumn} was lowest during ${correctCategory}.`,
  );
}

function generateLineGrowthQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (
    context.values.length < 2 ||
    context.values[0] === 0
  ) {
    return undefined;
  }

  const firstCategory =
    context.categories[0];
  const lastCategory =
    context.categories[
      context.categories.length - 1
    ];
  const firstValue =
    context.values[0];
  const lastValue =
    context.values[
      context.values.length - 1
    ];
  const growth = Math.round(
    ((lastValue - firstValue) /
      firstValue) *
      100,
  );

  return createNumericQuestion(
    `What was the percentage growth in ${context.numericColumn} from ${firstCategory} to ${lastCategory}?`,
    growth,
    `Percentage growth = (${lastValue} - ${firstValue}) / ${firstValue} x 100 = ${growth}%`,
  );
}

function generateLineMaximumIncreaseQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const increases =
    getConsecutiveComparisons(
      context,
    ).filter(
      (comparison) =>
        comparison.difference > 0,
    );

  if (!increases.length) {
    return undefined;
  }

  const maximumIncrease =
    increases.reduce(
      (best, comparison) =>
        comparison.difference >
        best.difference
          ? comparison
          : best,
    );

  return createChoiceQuestion(
    `Between which two consecutive ${context.categoryColumn}s was the increase in ${context.numericColumn} maximum?`,
    increases.map(
      (comparison) =>
        comparison.label,
    ),
    maximumIncrease.label,
    `The maximum increase was from ${maximumIncrease.fromCategory} to ${maximumIncrease.toCategory}: ${maximumIncrease.toValue} - ${maximumIncrease.fromValue} = ${maximumIncrease.difference}.`,
  );
}

function generateLineDeclineQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const comparisons =
    getConsecutiveComparisons(context);
  const declines =
    comparisons.filter(
      (comparison) =>
        comparison.difference < 0,
    );

  if (!declines.length) {
    return undefined;
  }

  const firstDecline =
    declines[0];

  return createChoiceQuestion(
    `Which interval showed a decline in ${context.numericColumn}?`,
    comparisons.map(
      (comparison) =>
        comparison.label,
    ),
    firstDecline.label,
    `${context.numericColumn} declined from ${firstDecline.fromCategory} to ${firstDecline.toCategory}: ${firstDecline.fromValue} to ${firstDecline.toValue}.`,
  );
}

function generateLineFluctuationQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const comparisons =
    getConsecutiveComparisons(context);

  if (!comparisons.length) {
    return undefined;
  }

  const greatestFluctuation =
    comparisons.reduce(
      (best, comparison) =>
        comparison.absoluteDifference >
        best.absoluteDifference
          ? comparison
          : best,
    );

  return createChoiceQuestion(
    `Between which two consecutive ${context.categoryColumn}s was the fluctuation in ${context.numericColumn} greatest?`,
    comparisons.map(
      (comparison) =>
        comparison.label,
    ),
    greatestFluctuation.label,
    `The greatest fluctuation was from ${greatestFluctuation.fromCategory} to ${greatestFluctuation.toCategory}: |${greatestFluctuation.toValue} - ${greatestFluctuation.fromValue}| = ${greatestFluctuation.absoluteDifference}.`,
  );
}

function getPercentageShare(
  value: number,
  total: number,
) {
  return total === 0
    ? 0
    : Math.round(
        (value / total) * 100,
      );
}

function getGreatestCommonDivisor(
  a: number,
  b: number,
) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }

  return x || 1;
}

function formatRatio(
  first: number,
  second: number,
) {
  const divisor =
    getGreatestCommonDivisor(
      first,
      second,
    );

  return `${Math.round(first / divisor)}:${Math.round(second / divisor)}`;
}

function generateRatioOptions(
  first: number,
  second: number,
): OptionResult {
  const correct = formatRatio(
    first,
    second,
  );

  const options = new Set<string>();
  options.add(correct);
  options.add(
    formatRatio(second, first),
  );
  options.add(
    formatRatio(
      first + second,
      second,
    ),
  );
  options.add(
    formatRatio(
      first,
      first + second,
    ),
  );

  while (options.size < 4) {
    options.add(
      formatRatio(
        first + randomInt(1, 5),
        second + randomInt(1, 5),
      ),
    );
  }

  const shuffled = shuffle(
    [...options].slice(0, 4),
  );

  return {
    options: shuffled,
    correct:
      shuffled.indexOf(correct),
  };
}

function generatePercentageShareQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (!context.values.length) {
    return undefined;
  }

  const index = randomInt(
    0,
    context.values.length - 1,
  );

  const category =
    context.categories[index];

  const share = getPercentageShare(
    context.values[index],
    context.total,
  );

  return createNumericQuestion(
    `What percentage share does ${category} contribute to total ${context.numericColumn}?`,
    share,
    `${category} contributes approximately ${share}% of total ${context.numericColumn}.`,
  );
}

function generateLargestSectorQuestion(
  context: DIQuestionContext,
): QuestionCore {
  const correctCategory =
    context.categories[
      context.highestIndex
    ];

  return createCategoryQuestion(
    `Which ${context.categoryColumn} contributes the highest percentage?`,
    context.categories,
    correctCategory,
    `${correctCategory} has the largest contribution to total ${context.numericColumn}.`,
  );
}

function generateSmallestSectorQuestion(
  context: DIQuestionContext,
): QuestionCore {
  const correctCategory =
    context.categories[
      context.lowestIndex
    ];

  return createCategoryQuestion(
    `Which ${context.categoryColumn} has the smallest contribution?`,
    context.categories,
    correctCategory,
    `${correctCategory} has the smallest contribution to total ${context.numericColumn}.`,
  );
}

function generateRatioQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (context.values.length < 2) {
    return undefined;
  }

  const firstCategory =
    context.categories[0];

  const secondCategory =
    context.categories[1];

  const generated =
    generateRatioOptions(
      context.values[0],
      context.values[1],
    );

  return {
    text:
      `What is the approximate ratio between ${firstCategory} and ${secondCategory}?`,
    options: generated.options,
    correct: generated.correct,
    explanation:
      `Ratio ${firstCategory}:${secondCategory} = ${formatRatio(
        context.values[0],
        context.values[1],
      )}`,
  };
}

function generateContributionQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (context.values.length < 2) {
    return undefined;
  }

  const firstCategory =
    context.categories[0];

  const secondCategory =
    context.categories[1];

  const combinedShare =
    getPercentageShare(
      context.values[0] +
        context.values[1],
      context.total,
    );

  return createNumericQuestion(
    `What is the combined share of ${firstCategory} and ${secondCategory}?`,
    combinedShare,
    `${firstCategory} and ${secondCategory} together contribute approximately ${combinedShare}% of total ${context.numericColumn}.`,
  );
}

function getSeriesColumns(
  context: DIQuestionContext,
) {
  return (
    context.series?.map(
      (series) => series.column,
    ) ?? context.numericColumns
  );
}

function getPrimarySeriesPair(
  context: DIQuestionContext,
) {
  const seriesColumns =
    getSeriesColumns(context);

  if (seriesColumns.length < 2) {
    return undefined;
  }

  return {
    first: seriesColumns[0],
    second: seriesColumns[1],
  };
}

function getColumnNumericValues(
  context: DIQuestionContext,
  column: string,
) {
  return context.tableData.map((row) =>
    Number(row[column]),
  );
}

function getValueByCategory(
  context: DIQuestionContext,
  column: string,
  categoryIndex: number,
) {
  return Number(
    context.tableData[categoryIndex]?.[
      column
    ],
  );
}

function getRankedEntries(
  context: DIQuestionContext,
  values = context.values,
) {
  return context.categories
    .map((category, index) => ({
      category,
      index,
      value: values[index],
    }))
    .sort(
      (a, b) => b.value - a.value,
    );
}

function getValuesExcludingIndex(
  values: number[],
  excludedIndex: number,
) {
  return values.filter(
    (_value, index) =>
      index !== excludedIndex,
  );
}

function countAboveThreshold(
  values: number[],
  threshold: number,
) {
  return values.filter(
    (value) => value > threshold,
  ).length;
}

function buildComparisonPrompt(
  variants: string[],
  replacements: Record<
    string,
    string | number
  >,
) {
  return buildPrompt(
    variants,
    replacements,
  );
}

function generateSecondHighestQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (context.values.length < 2) {
    return undefined;
  }

  const rankedEntries =
    getRankedEntries(context);
  const secondHighest =
    rankedEntries[1];

  return createCategoryQuestion(
    buildComparisonPrompt(
      [
        `Which {categoryColumn} recorded the second highest {numericColumn}?`,
        `Identify the {categoryColumn} with the second-largest {numericColumn}.`,
      ],
      {
        categoryColumn:
          context.categoryColumn,
        numericColumn:
          context.numericColumn,
      },
    ),
    context.categories,
    secondHighest.category,
    `${secondHighest.category} had the second highest ${context.numericColumn}.`,
  );
}

function generateClosestToAverageQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (!context.values.length) {
    return undefined;
  }

  const closestEntry =
    context.categories
      .map((category, index) => ({
        category,
        value: context.values[index],
        deviation: Math.abs(
          context.values[index] -
            context.average,
        ),
      }))
      .sort(
        (a, b) =>
          a.deviation - b.deviation,
      )[0];

  return createCategoryQuestion(
    buildComparisonPrompt(
      [
        `Which {categoryColumn} was closest to the average {numericColumn}?`,
        `For which {categoryColumn} was {numericColumn} nearest to its average value?`,
      ],
      {
        categoryColumn:
          context.categoryColumn,
        numericColumn:
          context.numericColumn,
      },
    ),
    context.categories,
    closestEntry.category,
    `${closestEntry.category} was closest to the average ${context.numericColumn}.`,
  );
}

function generateMaximumGapQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const comparisons =
    getConsecutiveComparisons(context);

  if (!comparisons.length) {
    return undefined;
  }

  const maximumGap =
    comparisons.reduce(
      (best, comparison) =>
        comparison.absoluteDifference >
        best.absoluteDifference
          ? comparison
          : best,
    );

  return createChoiceQuestion(
    buildComparisonPrompt(
      [
        `Across which consecutive {categoryColumn} values was the gap in {numericColumn} the largest?`,
        `Between which adjacent {categoryColumn}s was the maximum gap in {numericColumn} observed?`,
      ],
      {
        categoryColumn:
          context.categoryColumn,
        numericColumn:
          context.numericColumn,
      },
    ),
    comparisons.map(
      (comparison) =>
        comparison.label,
    ),
    maximumGap.label,
    `The largest gap was ${maximumGap.absoluteDifference} between ${maximumGap.fromCategory} and ${maximumGap.toCategory}.`,
  );
}

function generateMinimumGapQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const comparisons =
    getConsecutiveComparisons(context);

  if (!comparisons.length) {
    return undefined;
  }

  const minimumGap =
    comparisons.reduce(
      (best, comparison) =>
        comparison.absoluteDifference <
        best.absoluteDifference
          ? comparison
          : best,
    );

  return createChoiceQuestion(
    `Between which two consecutive ${context.categoryColumn}s was the gap in ${context.numericColumn} minimum?`,
    comparisons.map(
      (comparison) =>
        comparison.label,
    ),
    minimumGap.label,
    `The minimum gap was ${minimumGap.absoluteDifference} between ${minimumGap.fromCategory} and ${minimumGap.toCategory}.`,
  );
}

function generateAboveAverageCountQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const count = countAboveThreshold(
    context.values,
    context.average,
  );

  return createNumericQuestion(
    `How many ${context.categoryColumn}s had ${context.numericColumn} above the average?`,
    count,
    `${count} ${context.categoryColumn} values were above average ${context.numericColumn}.`,
  );
}

function generateExcludingTopLeaderQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (context.values.length < 3) {
    return undefined;
  }

  const valuesExcludingHighest =
    getValuesExcludingIndex(
      context.values,
      context.highestIndex,
    );
  const remainingCategories =
    context.categories.filter(
      (_category, index) =>
        index !==
        context.highestIndex,
    );
  const remainingLeader =
    remainingCategories[
      valuesExcludingHighest.indexOf(
        Math.max(
          ...valuesExcludingHighest,
        ),
      )
    ];

  return createCategoryQuestion(
    `If ${context.categories[context.highestIndex]} is excluded, which ${context.categoryColumn} has the highest ${context.numericColumn}?`,
    remainingCategories,
    remainingLeader,
    `Excluding ${context.categories[context.highestIndex]}, ${remainingLeader} becomes the leader.`,
  );
}

function generateGroupedIntervalTotalQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (context.values.length < 4) {
    return undefined;
  }

  const midpoint = Math.floor(
    context.values.length / 2,
  );
  const firstGroupTotal =
    context.values
      .slice(0, midpoint)
      .reduce(
        (sum, value) =>
          sum + value,
        0,
      );
  const secondGroupTotal =
    context.values
      .slice(midpoint)
      .reduce(
        (sum, value) =>
          sum + value,
        0,
      );
  const difference = Math.abs(
    firstGroupTotal -
      secondGroupTotal,
  );

  return createNumericQuestion(
    `What is the difference between the total ${context.numericColumn} of the first half and second half of the ${context.categoryColumn}s?`,
    difference,
    `The grouped total difference is ${difference}.`,
  );
}

function generateSubsetAverageQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (context.values.length < 3) {
    return undefined;
  }

  const sorted =
    getRankedEntries(context);
  const subset =
    sorted.slice(0, 3);
  const subsetAverage = Math.round(
    subset.reduce(
      (sum, entry) =>
        sum + entry.value,
      0,
    ) / subset.length,
  );

  return createNumericQuestion(
    `What is the average ${context.numericColumn} of the top three ${context.categoryColumn}s?`,
    subsetAverage,
    `The average for the top three ${context.categoryColumn}s is ${subsetAverage}.`,
  );
}

function generateMaximumDifferenceBetweenSeriesQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const firstValues =
    getColumnNumericValues(
      context,
      seriesPair.first,
    );
  const secondValues =
    getColumnNumericValues(
      context,
      seriesPair.second,
    );
  const differences = firstValues.map(
    (value, index) =>
      Math.abs(
        value - secondValues[index],
      ),
  );
  const maxIndex =
    differences.indexOf(
      Math.max(...differences),
    );

  return createCategoryQuestion(
    buildComparisonPrompt(
      [
        `In which {categoryColumn} was the difference between {firstSeries} and {secondSeries} maximum?`,
        `Where was the gap between {firstSeries} and {secondSeries} the highest?`,
      ],
      {
        categoryColumn:
          context.categoryColumn,
        firstSeries:
          seriesPair.first,
        secondSeries:
          seriesPair.second,
      },
    ),
    context.categories,
    context.categories[maxIndex],
    `The maximum inter-series difference occurred at ${context.categories[maxIndex]}.`,
  );
}

function generateCombinedTotalByCategoryQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const categoryIndex = randomInt(
    0,
    context.categories.length - 1,
  );
  const combinedTotal =
    getValueByCategory(
      context,
      seriesPair.first,
      categoryIndex,
    ) +
    getValueByCategory(
      context,
      seriesPair.second,
      categoryIndex,
    );

  return createNumericQuestion(
    `What was the combined total of ${seriesPair.first} and ${seriesPair.second} in ${context.categories[categoryIndex]}?`,
    combinedTotal,
    `The combined total in ${context.categories[categoryIndex]} was ${combinedTotal}.`,
  );
}

function generateRatioBetweenSeriesQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const categoryIndex = randomInt(
    0,
    context.categories.length - 1,
  );
  const firstValue =
    getValueByCategory(
      context,
      seriesPair.first,
      categoryIndex,
    );
  const secondValue =
    getValueByCategory(
      context,
      seriesPair.second,
      categoryIndex,
    );
  const generated =
    generateRatioOptions(
      firstValue,
      secondValue,
    );

  return {
    text: `What was the ratio of ${seriesPair.first} to ${seriesPair.second} in ${context.categories[categoryIndex]}?`,
    options: generated.options,
    correct: generated.correct,
    explanation: `The ratio in ${context.categories[categoryIndex]} was ${formatRatio(firstValue, secondValue)}.`,
  };
}

function generateConditionalCrossSeriesCountQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const firstValues =
    getColumnNumericValues(
      context,
      seriesPair.first,
    );
  const secondValues =
    getColumnNumericValues(
      context,
      seriesPair.second,
    );
  const threshold = Math.max(
    10,
    Math.round(
      Math.abs(
        firstValues.reduce(
          (sum, value, index) =>
            sum +
            (value -
              secondValues[index]),
          0,
        ) /
          firstValues.length,
      ),
    ),
  );
  const count = firstValues.filter(
    (value, index) =>
      value - secondValues[index] >
      threshold,
  ).length;

  return createNumericQuestion(
    `In how many ${context.categoryColumn}s did ${seriesPair.first} exceed ${seriesPair.second} by more than ${threshold}?`,
    count,
    `${seriesPair.first} exceeded ${seriesPair.second} by more than ${threshold} in ${count} ${context.categoryColumn} values.`,
  );
}

function generateRelativeGrowthComparisonQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const firstValues =
    getColumnNumericValues(
      context,
      seriesPair.first,
    );
  const secondValues =
    getColumnNumericValues(
      context,
      seriesPair.second,
    );
  const intervals =
    getConsecutiveComparisons({
      ...context,
      values: firstValues,
    });
  const secondIntervals =
    getConsecutiveComparisons({
      ...context,
      values: secondValues,
    });
  const betterInterval =
    intervals.find(
      (comparison, index) =>
        comparison.difference >
        (secondIntervals[index]
          ?.difference ?? 0),
    );

  if (!betterInterval) {
    return undefined;
  }

  return createChoiceQuestion(
    `Between which consecutive ${context.categoryColumn}s did ${seriesPair.first} increase more sharply than ${seriesPair.second}?`,
    intervals.map(
      (comparison) =>
        comparison.label,
    ),
    betterInterval.label,
    `${seriesPair.first} increased more sharply than ${seriesPair.second} over ${betterInterval.label}.`,
  );
}

function generateCrossoverAnalysisQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const firstValues =
    getColumnNumericValues(
      context,
      seriesPair.first,
    );
  const secondValues =
    getColumnNumericValues(
      context,
      seriesPair.second,
    );

  for (let i = 1; i < firstValues.length; i++) {
    const previousGap =
      firstValues[i - 1] -
      secondValues[i - 1];
    const currentGap =
      firstValues[i] -
      secondValues[i];

    if (
      previousGap !== 0 &&
      currentGap !== 0 &&
      Math.sign(previousGap) !==
        Math.sign(currentGap)
    ) {
      const interval = `${context.categories[i - 1]} to ${context.categories[i]}`;

      return createChoiceQuestion(
        `Between which interval did ${seriesPair.first} and ${seriesPair.second} cross over each other?`,
        getConsecutiveComparisons(context).map(
          (comparison) =>
            comparison.label,
        ),
        interval,
        `The two series crossed over during ${interval}.`,
      );
    }
  }

  return undefined;
}

function generateComparativeFluctuationQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const getTotalFluctuation = (
    seriesColumn: string,
  ) =>
    getConsecutiveComparisons({
      ...context,
      values:
        getColumnNumericValues(
          context,
          seriesColumn,
        ),
    }).reduce(
      (sum, comparison) =>
        sum +
        comparison.absoluteDifference,
      0,
    );
  const firstFluctuation =
    getTotalFluctuation(
      seriesPair.first,
    );
  const secondFluctuation =
    getTotalFluctuation(
      seriesPair.second,
    );
  const answer =
    firstFluctuation >=
    secondFluctuation
      ? seriesPair.first
      : seriesPair.second;

  return createChoiceQuestion(
    `Which series showed greater fluctuation across the given ${context.categoryColumn} values?`,
    [
      seriesPair.first,
      seriesPair.second,
    ],
    answer,
    `${answer} showed the greater overall fluctuation.`,
  );
}

function generateLeastDeviationQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const leastDeviationEntry =
    context.categories
      .map((category, index) => ({
        category,
        deviation: Math.abs(
          context.values[index] -
            context.average,
        ),
      }))
      .sort(
        (a, b) =>
          a.deviation - b.deviation,
      )[0];

  const question =
    createCategoryQuestion(
      `Which ${context.categoryColumn} had the least deviation from the average ${context.numericColumn}?`,
      context.categories,
      leastDeviationEntry.category,
      `${leastDeviationEntry.category} had the least deviation from the average.`,
    );

  return attachReasoningTrace(
    question,
    [
      createReasoningStep(
        "average",
        `Compute the average ${context.numericColumn}.`,
      ),
      createReasoningStep(
        "deviation",
        `Measure deviation of each ${context.categoryColumn} from that average.`,
      ),
      createReasoningStep(
        "rank",
        "Select the least deviation.",
      ),
    ],
    3,
  );
}

function generateFilteredLowestCrossSeriesQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const filterValues =
    getColumnNumericValues(
      context,
      seriesPair.second,
    );
  const filterAverage = Math.round(
    filterValues.reduce(
      (sum, value) =>
        sum + value,
      0,
    ) / filterValues.length,
  );
  const eligibleIndices =
    filterValues
      .map((value, index) => ({
        value,
        index,
      }))
      .filter(
        ({ value }) =>
          value > filterAverage,
      )
      .map((entry) => entry.index);

  if (!eligibleIndices.length) {
    return undefined;
  }

  const primaryValues =
    getColumnNumericValues(
      context,
      seriesPair.first,
    );
  const lowestPrimaryIndex =
    eligibleIndices.reduce(
      (bestIndex, currentIndex) =>
        primaryValues[currentIndex] <
        primaryValues[bestIndex]
          ? currentIndex
          : bestIndex,
    );
  const eligibleCategories =
    eligibleIndices.map(
      (index) =>
        context.categories[index],
    );
  const question =
    createCategoryQuestion(
      `Which ${context.categoryColumn} among those where ${seriesPair.second} exceeded its average had the lowest ${seriesPair.first}?`,
      eligibleCategories,
      context.categories[
        lowestPrimaryIndex
      ],
      `${context.categories[lowestPrimaryIndex]} had the lowest ${seriesPair.first} among the filtered ${context.categoryColumn} values.`,
    );

  return attachReasoningTrace(
    question,
    [
      createReasoningStep(
        "average",
        `Compute the average of ${seriesPair.second}.`,
      ),
      createReasoningStep(
        "filter",
        `Keep only ${context.categoryColumn} values where ${seriesPair.second} exceeds its average.`,
      ),
      createReasoningStep(
        "compare",
        `Compare ${seriesPair.first} across the filtered subset.`,
      ),
      createReasoningStep(
        "rank",
        `Select the minimum ${seriesPair.first} from the filtered subset.`,
      ),
    ],
    4,
  );
}

function generateConditionalCombinedRatioQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const firstValues =
    getColumnNumericValues(
      context,
      seriesPair.first,
    );
  const secondValues =
    getColumnNumericValues(
      context,
      seriesPair.second,
    );
  const secondAverage = Math.round(
    secondValues.reduce(
      (sum, value) =>
        sum + value,
      0,
    ) / secondValues.length,
  );
  const filteredIndices =
    filterCategoryIndices(
      {
        ...context,
        values: secondValues,
      },
      (value) => value > secondAverage,
    );

  if (filteredIndices.length < 2) {
    return undefined;
  }

  const combinedPrimary =
    aggregateByIndices(
      firstValues,
      filteredIndices,
    );
  const combinedSecondary =
    aggregateByIndices(
      secondValues,
      filteredIndices,
    );
  const generated =
    generateRatioOptions(
      combinedPrimary,
      combinedSecondary,
    );
  const question = {
    text: `What is the ratio of combined ${seriesPair.first} to combined ${seriesPair.second} in ${context.categoryColumn}s where ${seriesPair.second} exceeded its average?`,
    options: generated.options,
    correct: generated.correct,
    explanation: `The required ratio is ${formatRatio(combinedPrimary, combinedSecondary)}.`,
  };

  return attachReasoningTrace(
    question,
    [
      createReasoningStep(
        "average",
        `Compute the average of ${seriesPair.second}.`,
      ),
      createReasoningStep(
        "filter",
        `Select ${context.categoryColumn} values where ${seriesPair.second} exceeds its average.`,
      ),
      createReasoningStep(
        "aggregate",
        `Add ${seriesPair.first} and ${seriesPair.second} separately over the filtered subset.`,
      ),
      createReasoningStep(
        "ratio",
        "Form the ratio of the two combined totals.",
      ),
    ],
    5,
  );
}

type DIQuestionGeneratorPool = Record<
  DifficultyLabel,
  DIQuestionGenerator[]
>;

type DIReasoningArchetype = {
  id: string;
  category: DIReasoningCategory;
  difficulty: DifficultyLabel;
  visualTypes: DIVisualType[];
  requiresMultiSeries?: boolean;
  generate: DIQuestionGenerator;
};

function getColumnValues(
  context: DIQuestionContext,
  numericColumn: string,
) {
  return context.tableData.map(
    (row) => Number(row[numericColumn]),
  );
}

function getAlternateNumericColumn(
  context: DIQuestionContext,
) {
  return context.numericColumns.find(
    (column) =>
      column !== context.numericColumn,
  );
}

function getSortedIndices(
  values: number[],
) {
  return values
    .map((value, index) => ({
      value,
      index,
    }))
    .sort(
      (a, b) => b.value - a.value,
    )
    .map((entry) => entry.index);
}

function generateHighestAboveAverageQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (context.average === 0) {
    return undefined;
  }

  const highestCategory =
    context.categories[
      context.highestIndex
    ];
  const percentageAboveAverage = Math.round(
    ((context.values[
      context.highestIndex
    ] -
      context.average) /
      context.average) *
      100,
  );

  return createNumericQuestion(
    `By what percentage does ${highestCategory} exceed the average ${context.numericColumn}?`,
    percentageAboveAverage,
    `${highestCategory} exceeds average ${context.numericColumn} by ${percentageAboveAverage}%.`,
  );
}

function generateTopTwoCombinedShareQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (context.values.length < 3) {
    return undefined;
  }

  const sortedIndices =
    getSortedIndices(context.values);
  const firstIndex =
    sortedIndices[0];
  const secondIndex =
    sortedIndices[1];
  const firstCategory =
    context.categories[firstIndex];
  const secondCategory =
    context.categories[secondIndex];
  const combinedShare =
    getPercentageShare(
      context.values[firstIndex] +
        context.values[secondIndex],
      context.total,
    );

  return createNumericQuestion(
    `What percentage of total ${context.numericColumn} is contributed together by ${firstCategory} and ${secondCategory}?`,
    combinedShare,
    `${firstCategory} and ${secondCategory} together contribute ${combinedShare}% of total ${context.numericColumn}.`,
  );
}

function generateAverageAbsoluteChangeQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const comparisons =
    getConsecutiveComparisons(context);

  if (!comparisons.length) {
    return undefined;
  }

  const totalAbsoluteChange =
    comparisons.reduce(
      (sum, comparison) =>
        sum +
        comparison.absoluteDifference,
      0,
    );
  const averageAbsoluteChange =
    Math.round(
      totalAbsoluteChange /
        comparisons.length,
    );

  return createNumericQuestion(
    `What is the average fluctuation per interval in ${context.numericColumn}?`,
    averageAbsoluteChange,
    `Average fluctuation = ${totalAbsoluteChange} / ${comparisons.length} = ${averageAbsoluteChange}.`,
  );
}

function generateConditionalGapQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  if (context.values.length < 4) {
    return undefined;
  }

  const firstPair =
    context.values[0] +
    context.values[1];
  const secondPair =
    context.values[2] +
    context.values[3];
  const gap = Math.abs(
    firstPair - secondPair,
  );

  return createNumericQuestion(
    `What is the difference between the combined ${context.numericColumn} of ${context.categories[0]} and ${context.categories[1]} versus ${context.categories[2]} and ${context.categories[3]}?`,
    gap,
    `Combined totals differ by ${gap}.`,
  );
}

function generateCrossColumnCombinedLeaderQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const alternateColumn =
    getAlternateNumericColumn(context);

  if (!alternateColumn) {
    return undefined;
  }

  const alternateValues =
    getColumnValues(
      context,
      alternateColumn,
    );
  const combinedValues =
    context.values.map(
      (value, index) =>
        value + alternateValues[index],
    );
  const highestCombinedIndex =
    combinedValues.indexOf(
      Math.max(...combinedValues),
    );

  return createCategoryQuestion(
    `Which ${context.categoryColumn} has the highest combined total of ${context.numericColumn} and ${alternateColumn}?`,
    context.categories,
    context.categories[
      highestCombinedIndex
    ],
    `${context.categories[highestCombinedIndex]} has the highest combined total across ${context.numericColumn} and ${alternateColumn}.`,
  );
}

function generateCrossColumnRatioLeaderQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const alternateColumn =
    getAlternateNumericColumn(context);

  if (!alternateColumn) {
    return undefined;
  }

  const alternateValues =
    getColumnValues(
      context,
      alternateColumn,
    );
  const ratios = context.values.map(
    (value, index) =>
      alternateValues[index] === 0
        ? Number.POSITIVE_INFINITY
        : value /
          alternateValues[index],
  );
  const highestRatioIndex =
    ratios.indexOf(Math.max(...ratios));

  return createCategoryQuestion(
    `For which ${context.categoryColumn} is the ratio of ${context.numericColumn} to ${alternateColumn} the highest?`,
    context.categories,
    context.categories[
      highestRatioIndex
    ],
    `${context.categories[highestRatioIndex]} has the highest ${context.numericColumn}:${alternateColumn} ratio.`,
  );
}

function generateTrendReversalQuestion(
  context: DIQuestionContext,
): QuestionCore | undefined {
  const comparisons =
    getConsecutiveComparisons(context);

  if (comparisons.length < 2) {
    return undefined;
  }

  for (let i = 1; i < comparisons.length; i++) {
    const previous =
      comparisons[i - 1]
        .difference;
    const current =
      comparisons[i].difference;

    if (
      previous !== 0 &&
      current !== 0 &&
      Math.sign(previous) !==
        Math.sign(current)
    ) {
      const turningCategory =
        context.categories[i];

      return createCategoryQuestion(
        `At which ${context.categoryColumn} did the trend in ${context.numericColumn} reverse direction?`,
        context.categories.slice(
          1,
          context.categories.length - 1,
        ),
        turningCategory,
        `The trend reversed at ${turningCategory}.`,
      );
    }
  }

  return undefined;
}

const DI_REASONING_ARCHETYPES: DIReasoningArchetype[] = [
  { id: "total", category: "direct-arithmetic", difficulty: "Easy", visualTypes: ["table", "bar"], generate: generateTotalQuestion },
  { id: "highest", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["table", "bar", "line"], generate: generateHighestQuestion },
  { id: "lowest", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["table", "bar", "line"], generate: generateLowestQuestion },
  { id: "difference", category: "direct-arithmetic", difficulty: "Easy", visualTypes: ["table", "bar"], generate: generateDifferenceQuestion },
  { id: "line-trend", category: "trend-reasoning", difficulty: "Easy", visualTypes: ["line"], generate: generateLineTrendQuestion },
  { id: "line-highest-point", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["line"], generate: generateLineHighestPointQuestion },
  { id: "line-lowest-point", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["line"], generate: generateLineLowestPointQuestion },
  { id: "pie-largest", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["pie"], generate: generateLargestSectorQuestion },
  { id: "pie-smallest", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["pie"], generate: generateSmallestSectorQuestion },
  { id: "pie-share", category: "direct-arithmetic", difficulty: "Easy", visualTypes: ["pie"], generate: generatePercentageShareQuestion },
  { id: "second-highest", category: "comparative-reasoning", difficulty: "Medium", visualTypes: ["table", "bar", "line"], generate: generateSecondHighestQuestion },
  { id: "closest-to-average", category: "comparative-reasoning", difficulty: "Medium", visualTypes: ["table", "bar"], generate: generateClosestToAverageQuestion },
  { id: "least-deviation", category: "comparative-reasoning", difficulty: "Medium", visualTypes: ["table", "bar", "line"], generate: generateLeastDeviationQuestion },
  { id: "average", category: "direct-arithmetic", difficulty: "Medium", visualTypes: ["table", "bar"], generate: generateAverageQuestion },
  { id: "percentage", category: "direct-arithmetic", difficulty: "Medium", visualTypes: ["table", "bar"], generate: generatePercentageQuestion },
  { id: "pie-ratio", category: "direct-arithmetic", difficulty: "Medium", visualTypes: ["pie"], generate: generateRatioQuestion },
  { id: "contribution", category: "set-logic", difficulty: "Medium", visualTypes: ["table", "bar", "pie"], generate: generateContributionQuestion },
  { id: "minimum-gap", category: "comparative-reasoning", difficulty: "Medium", visualTypes: ["table", "bar", "line"], generate: generateMinimumGapQuestion },
  { id: "above-average-count", category: "conditional-reasoning", difficulty: "Medium", visualTypes: ["table", "bar"], generate: generateAboveAverageCountQuestion },
  { id: "line-growth", category: "trend-reasoning", difficulty: "Medium", visualTypes: ["line"], generate: generateLineGrowthQuestion },
  { id: "line-maximum-increase", category: "trend-reasoning", difficulty: "Medium", visualTypes: ["line"], generate: generateLineMaximumIncreaseQuestion },
  { id: "line-decline", category: "trend-reasoning", difficulty: "Medium", visualTypes: ["line"], generate: generateLineDeclineQuestion },
  { id: "series-max-diff", category: "cross-series-reasoning", difficulty: "Medium", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateMaximumDifferenceBetweenSeriesQuestion },
  { id: "series-combined-total", category: "cross-series-reasoning", difficulty: "Medium", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateCombinedTotalByCategoryQuestion },
  { id: "series-ratio", category: "cross-series-reasoning", difficulty: "Medium", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateRatioBetweenSeriesQuestion },
  { id: "highest-above-average", category: "conditional-reasoning", difficulty: "Hard", visualTypes: ["table", "bar"], generate: generateHighestAboveAverageQuestion },
  { id: "top-two-combined-share", category: "multi-step-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "pie"], generate: generateTopTwoCombinedShareQuestion },
  { id: "conditional-gap", category: "multi-step-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "line"], generate: generateConditionalGapQuestion },
  { id: "grouped-interval-total", category: "set-logic", difficulty: "Hard", visualTypes: ["table", "bar", "line"], generate: generateGroupedIntervalTotalQuestion },
  { id: "subset-average", category: "set-logic", difficulty: "Hard", visualTypes: ["table", "bar"], generate: generateSubsetAverageQuestion },
  { id: "excluding-top-leader", category: "conditional-reasoning", difficulty: "Hard", visualTypes: ["table", "bar"], generate: generateExcludingTopLeaderQuestion },
  { id: "average-absolute-change", category: "trend-reasoning", difficulty: "Hard", visualTypes: ["line"], generate: generateAverageAbsoluteChangeQuestion },
  { id: "trend-reversal", category: "trend-reasoning", difficulty: "Hard", visualTypes: ["line"], generate: generateTrendReversalQuestion },
  { id: "line-fluctuation", category: "trend-reasoning", difficulty: "Hard", visualTypes: ["line"], generate: generateLineFluctuationQuestion },
  { id: "cross-column-combined-leader", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "line"], requiresMultiSeries: true, generate: generateCrossColumnCombinedLeaderQuestion },
  { id: "cross-column-ratio-leader", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "line"], requiresMultiSeries: true, generate: generateCrossColumnRatioLeaderQuestion },
  { id: "filtered-lowest-cross-series", category: "multi-step-reasoning", difficulty: "Hard", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateFilteredLowestCrossSeriesQuestion },
  { id: "conditional-combined-ratio", category: "multi-step-reasoning", difficulty: "Hard", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateConditionalCombinedRatioQuestion },
  { id: "series-conditional-count", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateConditionalCrossSeriesCountQuestion },
  { id: "series-relative-growth", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["line"], requiresMultiSeries: true, generate: generateRelativeGrowthComparisonQuestion },
  { id: "series-crossover", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["line"], requiresMultiSeries: true, generate: generateCrossoverAnalysisQuestion },
  { id: "series-comparative-fluctuation", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["line"], requiresMultiSeries: true, generate: generateComparativeFluctuationQuestion },
  { id: "maximum-gap", category: "comparative-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "line"], generate: generateMaximumGapQuestion },
];

function getQuestionGeneratorPool(
  context: DIQuestionContext,
): DIQuestionGeneratorPool {
  const hasMultipleSeries =
    getSeriesColumns(context).length > 1;
  const archetypes =
    DI_REASONING_ARCHETYPES.filter(
      (archetype) =>
        archetype.visualTypes.includes(
          context.visualType,
        ) &&
        (!archetype.requiresMultiSeries ||
          hasMultipleSeries),
    );

  return {
    Easy: archetypes.filter((archetype) => archetype.difficulty === "Easy").map((archetype) => archetype.generate),
    Medium: archetypes.filter((archetype) => archetype.difficulty === "Medium").map((archetype) => archetype.generate),
    Hard: archetypes.filter((archetype) => archetype.difficulty === "Hard").map((archetype) => archetype.generate),
  };
}

function getDefaultDISetProfile(
  options?: GeneratorOptions,
): DISetProfile {
  if (options?.setProfile) {
    return options.setProfile;
  }

  if (
    options?.difficultyDistribution
  ) {
    return "balanced";
  }

  if (
    options?.targetDifficulty !==
      undefined ||
    options?.targetAverageDifficulty !==
      undefined
  ) {
    return "balanced";
  }

  return "progressive";
}

function getDefaultSlotTargets(
  count: number,
  setProfile: DISetProfile,
): Record<DifficultyLabel, number> {
  if (setProfile === "uniform") {
    return {
      Easy: 0,
      Medium: count,
      Hard: 0,
    };
  }

  if (setProfile === "spike") {
    return {
      Easy: count >= 4 ? 1 : 0,
      Medium:
        count >= 4 ? count - 2 : count - 1,
      Hard: 1,
    };
  }

  if (setProfile === "balanced") {
    return {
      Easy: count >= 4 ? 1 : 0,
      Medium:
        count >= 3 ? count - 2 : count - 1,
      Hard: 1,
    };
  }

  return {
    Easy: Math.max(
      1,
      Math.floor(count / 5),
    ),
    Hard: Math.max(
      1,
      Math.ceil(count / 3),
    ),
    Medium: Math.max(
      0,
      count -
        Math.max(
          1,
          Math.floor(count / 5),
        ) -
        Math.max(
          1,
          Math.ceil(count / 3),
        ),
    ),
  };
}

function getUniformDifficultyLabel(
  options?: GeneratorOptions,
): DifficultyLabel {
  const targetScore =
    options?.targetAverageDifficulty ??
    options?.targetDifficulty ??
    5.5;

  return classifyDifficultyLabel(
    targetScore,
  );
}

function buildDifficultySlots(
  count: number,
  options?: GeneratorOptions,
) {
  const setProfile =
    getDefaultDISetProfile(options);

  if (setProfile === "uniform") {
    return {
      setProfile,
      slots: Array.from(
        { length: count },
        () =>
          getUniformDifficultyLabel(
            options,
          ),
      ),
    };
  }

  const targets =
    options?.difficultyDistribution
      ? getDifficultyBucketTargets(
          count,
          options.difficultyDistribution,
        )
      : getDefaultSlotTargets(
          count,
          setProfile,
        );
  const slots: DifficultyLabel[] =
    [];

  if (setProfile === "spike") {
    slots.push(...Array.from(
      { length: targets.Medium },
      () => "Medium" as const,
    ));

    if (targets.Easy > 0) {
      slots.unshift("Easy");
    }

    if (targets.Hard > 0) {
      slots.push("Hard");
    }
  } else if (setProfile === "balanced") {
    if (targets.Easy > 0) {
      slots.push("Easy");
    }

    slots.push(
      ...Array.from(
        { length: targets.Medium },
        () => "Medium" as const,
      ),
    );

    if (targets.Hard > 0) {
      slots.push("Hard");
    }
  } else {
    slots.push(
      ...Array.from(
        { length: targets.Easy },
        () => "Easy" as const,
      ),
      ...Array.from(
        { length: targets.Medium },
        () => "Medium" as const,
      ),
      ...Array.from(
        { length: targets.Hard },
        () => "Hard" as const,
      ),
    );
  }

  while (slots.length < count) {
    slots.push("Medium");
  }

  return {
    setProfile,
    slots: slots.slice(0, count),
  };
}

function getSlotTargetScore(
  slot: DifficultyLabel,
) {
  switch (slot) {
    case "Easy":
      return 2.5;
    case "Hard":
      return 8.5;
    case "Medium":
    default:
      return 5.5;
  }
}

function buildDIQuestionCandidates(
  context: DIQuestionContext,
  generators: DIQuestionGenerator[],
) {
  return generators
    .map((generator) =>
      generator(context),
    )
    .filter(
      (
        question,
      ): question is QuestionCore =>
        Boolean(question),
    )
    .map((question) =>
      applyDifficultyMetadata(
        question,
        {
          kind: "di",
          text: question.text,
          explanation:
            question.explanation,
          visualType:
            context.visualType,
          rowCount:
            context.tableData.length,
          numericColumnCount:
            context.numericColumns.length,
          reasoningSteps:
            question.reasoningSteps,
          dependencyComplexity:
            question.dependencyComplexity,
          operationChain:
            question.operationChain,
        },
      ),
    );
}

function selectQuestionForSlot(
  slot: DifficultyLabel,
  candidates: DIQuestion[],
  usedQuestions: Set<string>,
) {
  const matching = candidates
    .filter(
      (candidate) =>
        candidate.difficultyLabel ===
          slot &&
        !usedQuestions.has(
          candidate.text,
        ),
    )
    .sort(
      (a, b) =>
        Math.abs(
          a.difficultyScore -
            getSlotTargetScore(slot),
        ) -
        Math.abs(
          b.difficultyScore -
            getSlotTargetScore(slot),
        ),
    );

  if (matching.length) {
    return matching[0];
  }

  return candidates
    .filter(
      (candidate) =>
        !usedQuestions.has(
          candidate.text,
        ),
    )
    .sort(
      (a, b) =>
        Math.abs(
          a.difficultyScore -
            getSlotTargetScore(slot),
        ) -
        Math.abs(
          b.difficultyScore -
            getSlotTargetScore(slot),
        ),
    )[0];
}

function summarizeDISetDifficulty(
  questions: DIQuestion[],
  setProfile: DISetProfile,
) {
  const totalDifficulty =
    questions.reduce(
      (sum, question) =>
        sum +
        question.difficultyScore,
      0,
    );

  return {
    averageDifficulty:
      Number(
        (
          totalDifficulty /
          questions.length
        ).toFixed(1),
      ),
    peakDifficulty:
      Math.max(
        ...questions.map(
          (question) =>
            question.difficultyScore,
        ),
      ),
    difficultySpread: setProfile,
    setProfile,
  };
}

function generateDIQuestions(
  tableData: DIDataRow[],
  visualType: DIVisualType,
  series: DISeriesConfig[] | undefined,
  options?: GeneratorOptions,
): {
  questions: DIQuestion[];
  averageDifficulty: number;
  peakDifficulty: number;
  difficultySpread: DISetProfile;
  setProfile: DISetProfile;
} {
  const categoryColumn =
    getCategoryColumn(tableData);

  const numericColumns =
    series?.length
      ? series.map(
          (seriesConfig) =>
            seriesConfig.column,
        )
      : getNumericColumns(tableData);

  if (
    !categoryColumn ||
    !numericColumns.length
  ) {
    return {
      questions: [],
      averageDifficulty: 0,
      peakDifficulty: 0,
      difficultySpread:
        getDefaultDISetProfile(
          options,
        ),
      setProfile:
        getDefaultDISetProfile(
          options,
        ),
    };
  }

  const { slots, setProfile } =
    buildDifficultySlots(
      5,
      options,
    );
  const usedQuestions = new Set<
    string
  >();
  const selectedQuestions: DIQuestion[] =
    [];

  slots.forEach((slot, slotIndex) => {
    const numericColumn =
      numericColumns[
        slotIndex %
          numericColumns.length
      ];
    const context =
      createDIQuestionContext(
        tableData,
        visualType,
        series,
        categoryColumn,
        numericColumns,
        numericColumn,
      );
    const generatorPool =
      getQuestionGeneratorPool(
        context,
      );
    const candidates =
      buildDIQuestionCandidates(
        context,
        generatorPool[slot],
      );
    const selected =
      selectQuestionForSlot(
        slot,
        candidates,
        usedQuestions,
      );

    if (selected) {
      usedQuestions.add(
        selected.text,
      );
      selectedQuestions.push(selected);
    }
  });

  if (!selectedQuestions.length) {
    return {
      questions: [],
      averageDifficulty: 0,
      peakDifficulty: 0,
      difficultySpread: setProfile,
      setProfile,
    };
  }

  return {
    questions: selectedQuestions,
    ...summarizeDISetDifficulty(
      selectedQuestions,
      setProfile,
    ),
  };
}

function createFormulaQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
  const examProfile =
    options?.examProfile ?? "custom";
  const values = generateValues(
    pattern.variables,
  );

  const template =
    pickRandomTemplate(
      pattern.templateVariants,
    );

  const text = fillTemplate(
    template,
    values,
  );
  const topicCluster =
    inferQuantTopicCluster(pattern);
  const archetype =
    selectQuantArchetype(
      pattern,
      options,
      topicCluster,
    );

  const correctAnswer =
    evaluateFormula(
      pattern.formula!,
      values,
    );

  const explanation =
    pattern.explanationTemplate
      ? renderExplanation(
          pattern.explanationTemplate,
          values,
          correctAnswer,
        )
      : `Calculated using formula ${pattern.formula}`;
  const quantContext = {
    pattern,
    baseText: text,
    values,
    correctAnswer,
    topicCluster,
  };
  const reasoningSteps =
    archetype.buildReasoningSteps(
      quantContext,
    );
  const generated = generateOptions(
    correctAnswer,
    pattern.distractorStrategy,
    {
      examProfile,
      topicCluster,
      operationChain:
        archetype.operationChain,
    },
  );
  const examRealismMetadata =
    buildExamRealismMetadata(
      examProfile,
      archetype,
      generated.optionMetadata,
    );
  const enrichedQuestion =
    attachReasoningTrace(
      {
        text: buildQuantPrompt(
          archetype,
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
      },
      reasoningSteps,
      Math.max(
        reasoningSteps.length,
        archetype.operationChain.length,
      ),
      archetype.operationChain,
    );

  return applyDifficultyMetadata(
    enrichedQuestion,
    {
      kind: "formula",
      text: enrichedQuestion.text,
      formula:
        pattern.formula ?? "",
      values,
      explanation,
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

    if (
      validateDifficultyTarget(
        candidate.difficultyScore,
        options,
      ) ||
      !options?.targetDifficulty
    ) {
      questions.push(candidate);
    } else if (questions.length < count) {
      questions.push(candidate);
    }

    if (questions.length >= maxAttempts) {
      break;
    }
  }

  return buildDifficultyBalancedSet(
    questions,
    count,
    options,
  );
}

export function generateFromPattern(
  pattern: Pattern,
  count: number,
  options?: GeneratorOptions,
): GeneratorResult {
  if (pattern.type === "di") {
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

  if (pattern.type === "logic") {
    throw new Error(
      "Logic generator not implemented",
    );
  }

  return {
    questions: generateFormulaQuestions(
      pattern,
      count,
      options,
    ),
  };
}
