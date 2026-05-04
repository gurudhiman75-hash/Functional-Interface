import type {
  DifficultyLabel,
  DifficultyMetadata,
  DistractorMetadata,
  DistractorType,
  ExamProfileId,
  OptionMetadata,
} from "../../core/generator-engine";
import { getExamProfileConfig } from "../../core/exam-realism";
import {
  compareOptionGap,
  getDistractorMagnitude,
  getSignedCloseGap,
} from "./option-calibration";
import {
  randomInt,
  shuffle,
} from "../randomness";
import { normalizeNumericValue } from "../text";

export type NumericDistractorStrategy = {
  type: "numeric_offsets";
  offsets: number[];
};

export type NumericDistractorConfig = {
  examProfile?: ExamProfileId;
  topicCluster?: string;
  difficulty?: DifficultyLabel;
  operationChain?: string[];
  reasoningDepth?: number;
  distractorHints?: string[];
  distractorStrategy?: NumericDistractorStrategy;
};

export type OptionResult = {
  options: string[];
  correct: number;
  optionMetadata?: OptionMetadata[];
};

type DistractorCandidate =
  DistractorMetadata & {
    value: number;
  };

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

function normalizeExternalDistractorType(
  distractor: string,
): DistractorType | undefined {
  switch (distractor) {
    case "wrongDenominator":
    case "percentageTrap":
    case "ratioInversion":
    case "arithmeticSlip":
    case "wrongIntermediateValue":
    case "comparisonTrap":
    case "prematureRounding":
    case "cumulativeMistake":
      return distractor;
    case "partialAggregation":
      return "cumulativeMistake";
    case "wrongSeries":
    case "directComparison":
    case "wrongSubsetSelection":
      return "comparisonTrap";
    case "unchangedTotalAssumption":
    case "skippedCondition":
      return "wrongIntermediateValue";
    case "wrongNormalization":
      return "ratioInversion";
    default:
      return undefined;
  }
}

function getTrapTypesForConfig(
  config?: NumericDistractorConfig,
): DistractorType[] {
  const topicCluster =
    config?.topicCluster ??
    "general-quant";
  const operations =
    config?.operationChain ?? [];
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
    ) ||
    (config?.reasoningDepth ?? 0) >= 4
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

  for (const hint of
    config?.distractorHints ?? []) {
    const normalizedHint =
      normalizeExternalDistractorType(
        hint,
      );

    if (normalizedHint) {
      trapTypes.add(
        normalizedHint,
      );
    }
  }

  return [...trapTypes];
}

function generateDistractorValue(
  correct: number,
  distractorType: DistractorType,
  config?: NumericDistractorConfig,
) {
  const difficulty =
    config?.difficulty ?? "Medium";
  const magnitude =
    getDistractorMagnitude(
      correct,
      difficulty,
    );
  const signedCloseGap =
    getSignedCloseGap(magnitude);

  switch (distractorType) {
    case "percentageTrap":
      return correct +
        (difficulty === "Hard"
          ? signedCloseGap
          : magnitude * 2);
    case "ratioInversion":
      return difficulty === "Hard"
        ? correct + signedCloseGap
        : correct > 8
          ? correct / 2
          : correct * 2;
    case "wrongIntermediateValue":
      return correct +
        (difficulty === "Hard"
          ? signedCloseGap + 1
          : magnitude * 2.5);
    case "comparisonTrap":
      return correct -
        (difficulty === "Hard"
          ? signedCloseGap
          : magnitude * 1.5);
    case "wrongDenominator":
      return correct +
        (difficulty === "Hard"
          ? signedCloseGap
          : magnitude);
    case "prematureRounding":
      return Math.round(
        correct +
          (difficulty === "Hard"
            ? 1
            : magnitude / 3),
      );
    case "cumulativeMistake":
      return correct +
        (difficulty === "Hard"
          ? signedCloseGap + 2
          : magnitude * 3);
    case "arithmeticSlip":
    default:
      return correct -
        (difficulty === "Hard"
          ? signedCloseGap
          : magnitude);
  }
}

function buildDistractorCandidates(
  correct: number,
  config?: NumericDistractorConfig,
) {
  const profileConfig =
    getExamProfileConfig(
      config?.examProfile,
    );

  return getTrapTypesForConfig(
    config,
  ).map((distractorType) => {
    const value =
      generateDistractorValue(
        correct,
        distractorType,
        config,
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

export function generateNumericOptions(
  correct: number,
  config?: NumericDistractorConfig,
): OptionResult {
  const normalizedCorrect =
    normalizeNumericValue(correct);
  const difficulty =
    config?.difficulty ?? "Medium";
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

  if (
    config?.distractorStrategy
      ?.type === "numeric_offsets"
  ) {
    for (const offset of
      config.distractorStrategy
        .offsets) {
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
    config,
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

  const correctOption =
    optionPool.get(correctLabel)!;
  const distractorOptions = [
    ...optionPool.values(),
  ]
    .filter(
      (option) => !option.isCorrect,
    )
    .sort((left, right) =>
      compareOptionGap(
        left.value,
        right.value,
        normalizedCorrect,
        difficulty,
      ),
    )
    .slice(0, 3);

  const shuffled = shuffle([
    correctOption,
    ...distractorOptions,
  ]);

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

export function buildDistractorConfigFromDifficulty(
  difficultyMetadata?: Pick<
    DifficultyMetadata,
    "difficultyLabel" | "reasoningDepth" | "operationChain"
  >,
  overrides?: Omit<
    NumericDistractorConfig,
    "difficulty" | "reasoningDepth" | "operationChain"
  >,
): NumericDistractorConfig {
  return {
    difficulty:
      difficultyMetadata?.difficultyLabel,
    reasoningDepth:
      difficultyMetadata?.reasoningDepth,
    operationChain:
      difficultyMetadata?.operationChain,
    ...overrides,
  };
}
