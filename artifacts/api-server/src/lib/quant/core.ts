import type {
  DifficultyLabel,
  GeneratorOptions,
  Pattern,
  QuantTopicCluster,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  buildReasoningErrorMetadata,
  countMatches,
  hasAnyToken,
  pickRandomItem,
  random,
  randomInt,
  ReasoningEngineError,
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

    if (random() < 0.55) {
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

  throw new ReasoningEngineError({
    code: "FORMULA_INVALID",
    phase: "realization",
    message: `Invalid formula: ${formula}`,
    metadata:
      buildReasoningErrorMetadata({
        formula,
        values,
      }),
  });
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
    hasAnyToken(
      `${pattern.topic} ${pattern.subtopic}`.toLowerCase(),
      [
      "simplification",
      "vbodmas",
      "bodmas",
      "nested fraction",
      "continued fraction",
      "square root",
      "cube root",
      "index comparison",
      ],
    )
  ) {
    return "simplification";
  }

  if (
    hasAnyToken(topicText, [
      "number system",
      "number-system",
      "remainders",
      "divisibility",
      "unit digit",
      "factorial",
      "trailing zero",
      "recurring decimal",
      "divisor count",
      "perfect square",
      "perfect cube",
      "digit properties",
      "base system",
      "prime factorization",
    ])
  ) {
    return "number-system";
  }

  if (
    hasAnyToken(topicText, [
      "fundamental",
      "fundamentals",
      "bodmas",
      "simplification",
      "fraction",
      "decimal",
      "hcf",
      "lcm",
      "divisibility",
      "surd",
      "surds",
      "indices",
      "index law",
      "unit digit",
      "approximation",
    ])
  ) {
    return "fundamentals";
  }

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
      "time and work",
      "time & work",
      "work and wages",
      "efficiency",
      "work rate",
    ])
  ) {
    return "time-work";
  }

  if (
    hasAnyToken(topicText, [
      "speed",
      "distance",
      "train",
      "boat",
      "stream",
      "race",
    ])
  ) {
    return "speed-time-distance";
  }

  if (
    hasAnyToken(topicText, [
      "mixture",
      "alligation",
      "replacement",
      "solution",
      "alloy",
    ])
  ) {
    return "mixture-alligation";
  }

  if (
    hasAnyToken(topicText, [
      "permutation",
      "permutations",
      "combination",
      "combinations",
      "permutation-combination",
      "permutations and combinations",
      "p&c",
      "counting",
      "arrangement",
      "selection",
      "committee",
      "handshake",
      "circular permutation",
      "digit formation",
      "derangement",
      "grid path",
    ])
  ) {
    return "permutation-combination";
  }

  if (
    hasAnyToken(topicText, [
      "trigonometry",
      "trig",
      "sine",
      "cosine",
      "tangent",
      "sin",
      "cos",
      "tan",
      "sec",
      "cosec",
      "csc",
      "cot",
      "height and distance",
      "heights and distances",
      "angle of elevation",
      "angle of depression",
    ])
  ) {
    return "trigonometry";
  }

  if (
    hasAnyToken(topicText, [
      "equations",
      "equation",
      "linear equation",
      "simultaneous equation",
      "simultaneous equations",
      "quadratic equation",
      "quadratic equations",
      "discriminant",
      "vieta",
      "roots of equation",
      "modulus equation",
      "absolute value equation",
      "diophantine",
      "common root",
    ])
  ) {
    return "equations";
  }

  if (
    hasAnyToken(topicText, [
      "progressions",
      "progression",
      "sequence",
      "sequences",
      "series",
      "arithmetic progression",
      "geometric progression",
      "harmonic progression",
      "ap",
      "gp",
      "hp",
      "common difference",
      "common ratio",
      "sigma",
      "summation",
      "telescopic",
      "arithmetic mean",
      "geometric mean",
      "harmonic mean",
    ])
  ) {
    return "progressions";
  }

  if (
    hasAnyToken(topicText, [
      "set theory",
      "set-theory",
      "sets",
      "set operation",
      "set operations",
      "subset",
      "subsets",
      "proper subset",
      "power set",
      "membership",
      "universal set",
      "null set",
      "empty set",
      "venn diagram",
      "venn diagrams",
      "de morgan",
      "cartesian product",
      "symmetric difference",
      "set relation",
      "reflexive",
      "symmetric relation",
      "transitive",
      "n(a)",
      "a union b",
      "a intersection b",
    ])
  ) {
    return "set-theory";
  }

  if (
    hasAnyToken(topicText, [
      "probability",
      "probabilities",
      "sample space",
      "favorable",
      "favourable",
      "event",
      "events",
      "conditional probability",
      "bayes",
      "odds",
      "venn probability",
      "coin toss",
      "dice probability",
      "card probability",
      "with replacement",
      "without replacement",
    ])
  ) {
    return "probability";
  }

  if (
    hasAnyToken(topicText, [
      "functions",
      "function",
      "mapping",
      "domain",
      "range",
      "injective",
      "surjective",
      "one-to-one",
      "onto",
      "composite function",
      "composition",
      "inverse function",
      "greatest integer",
      "floor function",
      "fractional part",
      "graph shift",
      "f(x)",
      "f(g(x))",
    ])
  ) {
    return "functions";
  }

  if (
    hasAnyToken(topicText, [
      "algebra",
      "equation",
      "linear equation",
      "quadratic",
      "identity",
      "polynomial",
      "modulus",
      "inequality",
      "function",
      "logarithm",
      "log",
      "discriminant",
      "roots",
      "am-gm",
    ])
  ) {
    return "algebra";
  }

  if (
    hasAnyToken(topicText, [
      "coordinate geometry",
      "coordinate-geometry",
      "cartesian",
      "cartesian plane",
      "ordered pair",
      "ordered pairs",
      "point slope",
      "point-slope",
      "section formula",
      "midpoint",
      "centroid",
      "slope",
      "line equation",
      "distance from line",
      "circle equation",
      "locus",
      "reflection",
      "intersection of lines",
      "ax + by + c",
    ])
  ) {
    return "coordinate-geometry";
  }

  if (
    hasAnyToken(topicText, [
      "geometry",
      "geometry-basics",
      "line",
      "angle",
      "parallel",
      "triangle",
      "similar",
      "congruent",
      "circle theorem",
      "chord",
      "tangent",
      "cyclic",
      "coordinate geometry",
      "slope",
      "section formula",
      "pythagoras",
      "incenter",
      "centroid",
      "circumcenter",
      "orthocenter",
    ])
  ) {
    return "geometry";
  }

  if (
    hasAnyToken(topicText, [
      "mensuration",
      "perimeter",
      "area",
      "volume",
      "surface area",
      "cylinder",
      "sphere",
      "cone",
    ])
  ) {
    return "mensuration";
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
      "pattern inference",
      "engine pattern",
      "engine-pattern",
      "number series",
      "letter series",
      "mixed series",
      "analogy",
      "odd one out",
      "odd-one-out",
      "classification",
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
      "coded relation",
      "coded relations",
      "family tree puzzle",
      "family tree puzzles",
      "engine relational",
      "engine-relational",
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
      "coded inequality",
      "coded inequalities",
      "either conclusion",
      "either-or",
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
      "engine critical",
      "engine-critical",
      "critical inference",
      "statement assumption",
      "statement-assumption",
      "statement conclusion",
      "statement-conclusion",
      "course of action",
      "course-of-action",
      "cause effect",
      "cause-effect",
      "strong weak argument",
      "strong-weak argument",
      "strong-weak-arguments",
      "verbal logic",
    ])
  ) {
    return "critical-inference";
  }

  if (
    hasAnyToken(topicText, [
      "engine temporal",
      "engine-temporal",
      "temporal reasoning",
      "calendar",
      "calendars",
      "odd day",
      "odd days",
      "leap year",
      "clock angle",
      "clock overlap",
      "faulty clock",
      "clocks",
    ])
  ) {
    return "temporal-reasoning";
  }

  if (
    hasAnyToken(topicText, [
      "engine abstract",
      "engine-abstract",
      "abstract reasoning",
      "non verbal",
      "non-verbal",
      "figure series",
      "paper cutting",
      "paper-folding cutting",
      "paper folding cutting",
      "embedded figure",
      "embedded figures",
      "hidden figure",
      "matrix transposition",
      "svg figure",
    ])
  ) {
    return "abstract-reasoning";
  }

  if (
    hasAnyToken(topicText, [
      "direction sense",
      "engine spatial",
      "engine-spatial",
      "spatial reasoning",
      "cubes dice",
      "cubes & dice",
      "dice",
      "cube painting",
      "cube folding",
      "mirror image",
      "water image",
      "paper folding",
      "paper cutting",
      "shadow direction",
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

  if (
    hasAnyToken(topicText, [
      "ranking",
      "order",
      "position",
      "rank",
      "from top",
      "from bottom",
    ])
  ) {
    return "ordering-ranking";
  }

  if (
    hasAnyToken(topicText, [
      "engine boolean",
      "engine-boolean",
      "logical venn",
      "boolean deduction",
      "boolean deductions",
      "syllogism",
      "conclusion",
      "statement",
      "venn",
    ])
  ) {
    return "syllogism";
  }

  if (
    hasAnyToken(topicText, [
      "puzzle",
      "box arrangement",
      "floor puzzle",
      "month puzzle",
      "day puzzle",
      "scheduling puzzle",
    ])
  ) {
    return "puzzles";
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
