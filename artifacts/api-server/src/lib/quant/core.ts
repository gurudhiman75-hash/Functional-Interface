import type {
  DifficultyLabel,
  GeneratorOptions,
  Pattern,
  QuantTopicCluster,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  countMatches,
  hasAnyToken,
  pickRandomItem,
  randomInt,
} from "../shared";

function keyExists(
  values: Record<string, number>,
  key: string,
): key is keyof typeof values {
  return Object.prototype.hasOwnProperty.call(
    values,
    key,
  );
}

// Quant core owns arithmetic generation, formula evaluation, and topic inference.
// It does not own wording, admin metadata rendering, or orchestration.
export function generateValues(
  variables: Pattern["variables"],
  difficulty: DifficultyLabel = "Medium",
  motif?: QuantMotif | null,
): Record<string, number> {
  const values: Record<string, number> = {};
  const safeVariables =
    variables ?? {};

  function generateDifficultyAwareNumber(
    min: number,
    max: number,
  ): number {
    const lower = Math.min(min, max);
    const upper = Math.max(min, max);

    const clampToRange = (
      value: number,
    ) =>
      Math.max(
        lower,
        Math.min(upper, value),
      );

    const pickRoundedValue = (
      steps: number[],
    ) => {
      const candidates = steps
        .flatMap((step) => {
          const start = Math.ceil(
            lower / step,
          );
          const end = Math.floor(
            upper / step,
          );

          return Array.from(
            {
              length:
                Math.max(
                  0,
                  end - start + 1,
                ),
            },
            (_, index) =>
              (start + index) * step,
          );
        })
        .filter(
          (value, index, array) =>
            array.indexOf(value) ===
            index,
        );

      if (candidates.length) {
        return pickRandomItem(
          candidates,
        );
      }

      return clampToRange(
        randomInt(lower, upper),
      );
    };

    if (difficulty === "Easy") {
      return pickRoundedValue([
        10,
        5,
        2,
      ]);
    }

    if (difficulty === "Hard") {
      let value = randomInt(
        lower,
        upper,
      );

      while (
        upper - lower > 6 &&
        (value % 10 === 0 ||
          value % 5 === 0 ||
          value % 2 === 0)
      ) {
        value = randomInt(
          lower,
          upper,
        );
      }

      return value;
    }

    if (Math.random() < 0.55) {
      return pickRoundedValue([
        5,
        2,
      ]);
    }

    return randomInt(lower, upper);
  }

  for (const key in safeVariables) {
    const { min, max } =
      safeVariables[key];

    values[key] =
      generateDifficultyAwareNumber(
        min,
        max,
      );
  }

  if (motif) {
    if (
      keyExists(values, "p")
    ) {
      values.p =
        difficulty === "Easy"
          ? pickRandomItem([
            10,
            20,
            25,
          ])
          : difficulty === "Hard"
            ? pickRandomItem([
              12,
              18,
              22,
              27,
            ])
            : pickRandomItem([
              10,
              15,
              20,
              25,
            ]);
    }

    if (
      keyExists(values, "q")
    ) {
      values.q =
        difficulty === "Easy"
          ? pickRandomItem([
            5,
            10,
            15,
          ])
          : difficulty === "Hard"
            ? pickRandomItem([
              7,
              12,
              17,
            ])
            : pickRandomItem([
              8,
              10,
              12,
              15,
            ]);
    }

    if (
      motif.inferenceStyle ===
        "hidden" &&
      difficulty !== "Easy"
    ) {
      for (const key of [
        "b",
        "final",
        "amount",
      ]) {
        if (
          keyExists(values, key)
        ) {
          values[key] = Math.max(
            1,
            values[key] +
              (difficulty === "Hard"
                ? 3
                : 1),
          );
        }
      }
    }
  }

  return values;
}

export function getMotifFormulaCompatibility(
  pattern: Pattern | undefined,
  motif: QuantMotif,
) {
  if (!pattern?.formula) {
    return 1;
  }

  const formula =
    pattern.formula.toLowerCase();
  const variableKeys = Object.keys(
    pattern.variables ?? {},
  );
  let weight = 1;

  if (
    motif.id ===
    "reverse_percentage_inference"
  ) {
    if (
      variableKeys.includes("p") &&
      (variableKeys.includes("b") ||
        variableKeys.includes(
          "final",
        ))
    ) {
      weight *= 1.6;
    }

    if (formula.includes("/")) {
      weight *= 1.3;
    }
  }

  if (
    motif.id ===
    "successive_percentage_change"
  ) {
    if (
      variableKeys.includes("p") &&
      variableKeys.includes("q")
    ) {
      weight *= 1.7;
    }

    if (
      countMatches(
        formula,
        /[+\-*/%]/g,
      ) >= 2
    ) {
      weight *= 1.2;
    }
  }

  if (
    motif.id ===
      "contribution_based_growth" &&
    variableKeys.length >= 3
  ) {
    weight *= 1.5;
  }

  if (
    motif.id ===
      "ratio_redistribution" &&
    variableKeys.length >= 3
  ) {
    weight *= 1.4;
  }

  if (
    motif.id ===
      "common_base_comparison" &&
    formula.includes("/")
  ) {
    weight *= 1.3;
  }

  if (
    motif.id ===
      "conditional_ratio_filtering" &&
    variableKeys.length >= 3
  ) {
    weight *= 1.4;
  }

  return weight;
}

export function evaluateFormula(
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
  } catch (error) {
    console.log({
      formula,
      values,
      error,
    });
  }

  throw new Error(
    `Invalid formula: ${formula}`,
  );
}

export function getArithmeticComplexity(
  values: Record<string, number>,
) {
  const entries =
    Object.values(values);

  if (!entries.length) {
    return 1;
  }

  const roughValues = entries.filter(
    (value) =>
      value % 10 !== 0 &&
      value % 5 !== 0 &&
      value % 2 !== 0,
  ).length;
  const largeValues = entries.filter(
    (value) =>
      Math.abs(value) >= 100,
  ).length;
  const roughRatio =
    roughValues / entries.length;

  if (
    roughRatio <= 0.2 &&
    largeValues <= 1
  ) {
    return 1;
  }

  if (
    roughRatio <= 0.6 &&
    largeValues <= 2
  ) {
    return 2;
  }

  return 3;
}

export function inferQuantTopicCluster(
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
      "seating arrangement",
      "linear seating",
      "circular seating",
      "square seating",
      "rectangular seating",
      "double row seating",
      "parallel row seating",
      "alternate facing seating",
      "seating",
      "arrangement",
      "left of",
      "right of",
      "immediate neighbor",
    ])
  ) {
    return "seating-arrangement";
  }

  if (
    hasAnyToken(topicText, [
      "simple interest",
      "compound interest",
      "interest",
    ]) ||
    /\bsi\b/.test(topicText) ||
    /\bci\b/.test(topicText)
  ) {
    return "si-ci";
  }

  if (
    hasAnyToken(topicText, [
      "coding",
      "decoding",
      "code",
      "decode",
      "alphabet series",
      "letter coding",
    ])
  ) {
    return "coding-decoding";
  }

  if (
    hasAnyToken(topicText, [
      "blood relation",
      "blood relations",
      "family relation",
      "family tree",
      "brother",
      "sister",
      "father",
      "mother",
      "uncle",
      "aunt",
    ])
  ) {
    return "blood-relations";
  }

  if (
    hasAnyToken(topicText, [
      "inequality",
      "inequalities",
      "greater than",
      "less than",
      "not greater than",
      "not less than",
      "comparison symbols",
    ])
  ) {
    return "inequality";
  }

  if (
    hasAnyToken(topicText, [
      "direction sense",
      "direction",
      "north",
      "south",
      "east",
      "west",
      "left turn",
      "right turn",
    ])
  ) {
    return "direction-sense";
  }

  return "general-quant";
}

export function getRequestedDifficultyLabel(
  pattern: Pattern,
  options: GeneratorOptions | undefined,
  classifyDifficultyLabel: (
    difficultyScore: number,
  ) => DifficultyLabel,
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

export function getTargetDifficultyScore(
  pattern: Pattern,
  options?: GeneratorOptions,
) {
  if (
    options?.targetDifficulty !==
    undefined
  ) {
    return options.targetDifficulty;
  }

  if (
    options?.targetAverageDifficulty !==
    undefined
  ) {
    return options.targetAverageDifficulty;
  }

  switch (
    pattern.difficulty ?? "Medium"
  ) {
    case "Easy":
      return 2;
    case "Hard":
      return 8.5;
    case "Medium":
    default:
      return 5;
  }
}
