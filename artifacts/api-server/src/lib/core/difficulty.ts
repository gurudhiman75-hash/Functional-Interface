import type {
  DifficultyDistribution,
  DifficultyLabel,
  DifficultyMetadata,
  GeneratorOptions,
} from "./generator-engine";
import { getArithmeticComplexity } from "../quant";
import {
  countMatches,
  hasAnyToken,
} from "../shared";

type DIVisualType =
  | "table"
  | "bar"
  | "pie"
  | "line";

type DifficultySignals = {
  operationCount: number;
  reasoningDepth: number;
  arithmeticComplexity: number;
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

export type DifficultyEvaluationInput =
  | {
    kind: "formula";
    text: string;
    formula: string;
    values: Record<string, number>;
    explanation: string;
    difficultyHint?: DifficultyLabel;
    targetDifficultyScore?: number;
    reasoningSteps?: string[];
    dependencyComplexity?: number;
    operationChain?: string[];
  }
  | {
    kind: "logic";
    text: string;
    explanation: string;
    difficultyHint?: DifficultyLabel;
    targetDifficultyScore?: number;
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
  if (difficultyScore <= 2.5) {
    return "Easy";
  }

  if (difficultyScore <= 5.5) {
    return "Medium";
  }

  return "Hard";
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

export function getDifficultyBucketTargets(
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

function deriveDifficultySignals(
  input: DifficultyEvaluationInput,
): DifficultySignals {
  if (input.kind === "formula") {
    const combinedText = `${input.text} ${input.explanation} ${input.formula}`.toLowerCase();
    const explicitOperationCount =
      input.operationChain?.length ??
      0;
    const formulaOperationCount =
      Math.max(
        1,
        countMatches(
          input.formula,
          /[+\-*/%]/g,
        ),
      );
    const operationCount =
      explicitOperationCount > 0
        ? explicitOperationCount
        : formulaOperationCount;
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
    const explicitReasoningDepth =
      input.reasoningSteps?.length ?? 0;
    const reasoningDepth =
      explicitReasoningDepth > 0
        ? explicitReasoningDepth
        : Math.max(
          1,
          Math.ceil(
            operationCount / 2,
          ),
        );
    const inferenceComplexity =
      reasoningDepth <= 1
        ? 1
        : reasoningDepth <= 3
          ? 2
          : 3;
    const arithmeticComplexity =
      getArithmeticComplexity(
        input.values,
      );
    const directLookup =
      operationCount === 1 &&
      reasoningDepth === 1 &&
      !usesPercentage &&
      !usesRatio &&
      !usesComparison;
    const combinedConditions =
      hasAnyToken(combinedText, [
        "if",
        "when",
        "respectively",
      ]);

    return {
      operationCount,
      reasoningDepth,
      arithmeticComplexity,
      usesPercentage,
      usesRatio,
      usesComparison,
      visualComplexity: 0,
      inferenceComplexity: Math.max(
        inferenceComplexity,
        input.dependencyComplexity ??
          1,
      ),
      directLookup,
      trendAnalysis: false,
      multiStep:
        reasoningDepth >= 2 ||
        operationCount >= 2 ||
        variableCount >= 3,
      combinedConditions,
      crossColumnInference: false,
    };
  }

  if (input.kind === "logic") {
    const combinedText = `${input.text} ${input.explanation}`.toLowerCase();
    const operationCount = Math.max(
      1,
      input.operationChain?.length ??
        input.reasoningSteps?.length ??
        1,
    );
    const reasoningDepth = Math.max(
      1,
      input.reasoningSteps?.length ??
        operationCount,
    );
    const usesComparison =
      hasAnyToken(combinedText, [
        "compare",
        "same",
        "which",
        "pattern",
      ]);
    const combinedConditions =
      hasAnyToken(combinedText, [
        "if",
        "after",
        "condition",
        "first",
        "then",
      ]);
    const directLookup =
      operationCount === 1 &&
      reasoningDepth === 1 &&
      !combinedConditions;

    return {
      operationCount,
      reasoningDepth,
      arithmeticComplexity: 1,
      usesPercentage: false,
      usesRatio: false,
      usesComparison,
      visualComplexity: 0,
      inferenceComplexity: Math.max(
        reasoningDepth >= 4
          ? 3
          : reasoningDepth >= 2
            ? 2
            : 1,
        input.dependencyComplexity ?? 1,
      ),
      directLookup,
      trendAnalysis: false,
      multiStep:
        reasoningDepth >= 2 ||
        operationCount >= 2,
      combinedConditions,
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
    arithmeticComplexity: 1,
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
    0.45 +
    signals.arithmeticComplexity *
      0.7 +
    signals.operationCount * 0.15 +
    signals.reasoningDepth * 0.5 +
    signals.visualComplexity * 0.18 +
    signals.inferenceComplexity *
      0.18;

  if (signals.usesPercentage) {
    score += 0.18;
  }

  if (signals.usesRatio) {
    score += 0.22;
  }

  if (signals.usesComparison) {
    score += 0.12;
  }

  if (signals.trendAnalysis) {
    score += 0.3;
  }

  if (signals.multiStep) {
    score += 0.25;
  }

  if (signals.combinedConditions) {
    score += 0.3;
  }

  if (signals.crossColumnInference) {
    score += 0.5;
  }

  if (signals.directLookup) {
    score -= 0.7;
  }
  if (
    signals.operationCount <= 1 &&
    signals.reasoningDepth <= 1 &&
    !signals.combinedConditions &&
    !signals.crossColumnInference
  ) {
    score -= 0.85;
  }

  if (input.kind === "formula") {
    const targetDifficultyScore =
      input.targetDifficultyScore;

    if (
      input.difficultyHint ===
      "Easy"
    ) {
      const easyCeiling =
        targetDifficultyScore !==
          undefined
          ? Math.min(
              2.6,
              targetDifficultyScore +
                0.9,
            )
          : 2.6;

      score = Math.min(
        score,
        easyCeiling,
      );
    } else if (
      input.difficultyHint ===
      "Medium"
    ) {
      const mediumFloor =
        targetDifficultyScore !==
          undefined
          ? Math.max(
              3.8,
              targetDifficultyScore -
                0.7,
            )
          : 4.1;
      const mediumCeiling =
        targetDifficultyScore !==
          undefined
          ? Math.min(
              6.8,
              targetDifficultyScore +
                0.9,
            )
          : 6.7;

      score = Math.min(
        Math.max(
          score,
          mediumFloor,
        ),
        mediumCeiling,
      );
    } else if (
      input.difficultyHint ===
      "Hard"
    ) {
      const hardFloor =
        targetDifficultyScore !==
          undefined
          ? Math.max(
              7.2,
              targetDifficultyScore -
                0.8,
            )
          : 7.6;

      score = Math.max(
        score,
        hardFloor,
      );
    }
  } else if (input.kind === "logic") {
    const targetDifficultyScore =
      input.targetDifficultyScore;

    if (input.difficultyHint === "Easy") {
      score = Math.min(
        score,
        targetDifficultyScore !== undefined
          ? Math.min(2.7, targetDifficultyScore + 0.8)
          : 2.7,
      );
    } else if (input.difficultyHint === "Medium") {
      score = Math.min(
        Math.max(
          score,
          targetDifficultyScore !== undefined
            ? Math.max(3.9, targetDifficultyScore - 0.6)
            : 4,
        ),
        targetDifficultyScore !== undefined
          ? Math.min(6.8, targetDifficultyScore + 0.8)
          : 6.6,
      );
    } else if (input.difficultyHint === "Hard") {
      score = Math.max(
        score,
        targetDifficultyScore !== undefined
          ? Math.max(7.3, targetDifficultyScore - 0.8)
          : 7.5,
      );
    }
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

export function applyDifficultyMetadata<
  T extends object,
>(
  question: T,
  input: DifficultyEvaluationInput,
): T & {
  difficulty: DifficultyLabel;
  difficultyScore: number;
  difficultyLabel: DifficultyLabel;
  difficultyMetadata: DifficultyMetadata;
} {
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
