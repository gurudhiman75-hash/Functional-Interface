import type {
  DifficultyLabel,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import type {
  QuantScenarioContext,
} from "../quant/realization";
import type { ReasoningStep } from "../shared";
import {
  createReasoningStep,
  pickRandomItem,
  randomInt,
} from "../shared";
import type { QuantProceduralScenario } from "./time-work-scenarios";

type FundamentalsScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

function formatLatexFraction(
  numerator: number,
  denominator: number,
) {
  return `$\\frac{${numerator}}{${denominator}}$`;
}

function buildFundamentalsContext(): QuantScenarioContext {
  return {
    entity: "expression",
    metric: "value",
    context: "simplification",
  };
}

export function createBodmasScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const b = pickRandomItem(
    difficulty === "Easy"
      ? [2, 3, 4, 5, 6]
      : difficulty === "Medium"
        ? [4, 5, 6, 7, 8]
        : [5, 6, 7, 8, 9],
  );
  const c = pickRandomItem(
    difficulty === "Easy"
      ? [3, 4, 5, 6]
      : difficulty === "Medium"
        ? [5, 6, 7, 8]
        : [6, 7, 8, 9],
  );
  const e = pickRandomItem(
    difficulty === "Easy"
      ? [2, 3, 4]
      : difficulty === "Medium"
        ? [3, 4, 5]
        : [3, 4, 6],
  );
  const quotient = pickRandomItem(
    difficulty === "Easy"
      ? [3, 4, 5, 6]
      : difficulty === "Medium"
        ? [4, 5, 6, 7]
        : [5, 6, 7, 8, 9],
  );
  const values = {
    a: randomInt(
      difficulty === "Easy" ? 6 : 12,
      difficulty === "Hard" ? 30 : 22,
    ),
    b,
    c,
    d: quotient * e,
    e,
  };
  const correctAnswer =
    values.a +
    values.b * values.c -
    values.d / values.e;

  return {
    scenarioType: "bodmas-sequencing",
    topicCluster: "fundamentals",
    values,
    formula:
      "a + b * c - d / e",
    text: `Simplify: ${values.a} + ${values.b} x ${values.c} - ${values.d} / ${values.e}.`,
    correctAnswer,
    distractorHints: [
      "arithmeticSlip",
      "wrongIntermediateValue",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Apply BODMAS: evaluate ${values.b} x ${values.c} and ${values.d} / ${values.e} before addition and subtraction.`,
      ),
      createReasoningStep(
        "aggregate",
        `${values.b} x ${values.c} = ${values.b * values.c} and ${values.d} / ${values.e} = ${values.d / values.e}.`,
      ),
      createReasoningStep(
        "infer",
        `Now compute ${values.a} + ${values.b * values.c} - ${values.d / values.e} = ${correctAnswer}.`,
      ),
    ],
    context: buildFundamentalsContext(),
  };
}

export function createFractionScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const denominatorPool =
    difficulty === "Easy"
      ? [2, 3, 4, 5, 6, 8]
      : difficulty === "Medium"
        ? [4, 5, 6, 8, 10, 12]
        : [6, 8, 9, 10, 12, 15, 18];
  const b = pickRandomItem(
    denominatorPool,
  );
  const d = pickRandomItem(
    denominatorPool,
  );
  const values = {
    a: randomInt(1, b - 1),
    b,
    c: randomInt(1, d - 1),
    d,
    e: pickRandomItem(
      difficulty === "Easy"
        ? [2, 3, 4, 5, 6]
        : difficulty === "Medium"
          ? [3, 4, 5, 6, 8]
          : [4, 5, 6, 8, 9, 10],
    ),
  };
  const sum =
    values.a / values.b +
    values.c / values.d;
  const correctAnswer = sum * values.e;

  return {
    scenarioType:
      "fraction-cancellation-chain",
    topicCluster: "fundamentals",
    values,
    formula:
      "((a / b) + (c / d)) * e",
    text: `Find the value of (${formatLatexFraction(values.a, values.b)} + ${formatLatexFraction(values.c, values.d)}) x ${values.e}.`,
    correctAnswer,
    distractorHints: [
      "ratioInversion",
      "wrongIntermediateValue",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `First add ${formatLatexFraction(values.a, values.b)} and ${formatLatexFraction(values.c, values.d)} by taking the LCM of ${values.b} and ${values.d}.`,
      ),
      createReasoningStep(
        "aggregate",
        `The bracket value is ${sum}.`,
      ),
      createReasoningStep(
        "infer",
        `Multiply ${sum} by ${values.e} to get ${correctAnswer}.`,
      ),
    ],
    context: {
      entity: "fraction expression",
      metric: "evaluated value",
      context: "arithmetic simplification",
    },
  };
}

export function createDecimalNormalizationScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const decimals = {
    Easy: [
      { scaled: 1, denominator: 4 },
      { scaled: 1, denominator: 8 },
      { scaled: 3, denominator: 4 },
      { scaled: 5, denominator: 8 },
      { scaled: 7, denominator: 8 },
    ],
    Medium: [
      { scaled: 3, denominator: 16 },
      { scaled: 5, denominator: 16 },
      { scaled: 11, denominator: 16 },
      { scaled: 13, denominator: 16 },
      { scaled: 7, denominator: 20 },
    ],
    Hard: [
      { scaled: 19, denominator: 32 },
      { scaled: 21, denominator: 32 },
      { scaled: 27, denominator: 40 },
      { scaled: 29, denominator: 50 },
      { scaled: 31, denominator: 40 },
    ],
  } as const;
  const choice = {
    ...pickRandomItem(
      decimals[difficulty],
    ),
  };
  const decimal =
    choice.scaled / choice.denominator;
  const correctAnswer =
    choice.scaled + choice.denominator;

  return {
    scenarioType:
      "decimal-fraction-normalization",
    topicCluster: "fundamentals",
    values: {
      scaled: choice.scaled,
      denominator: choice.denominator,
      decimal,
    },
    formula:
      "scaled + denominator",
    text: `${decimal} is written as $p/q$ in lowest terms. Find $p + q$.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "prematureRounding",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Write ${decimal} as a fraction and reduce it to lowest terms: ${formatLatexFraction(choice.scaled, choice.denominator)}.`,
      ),
      createReasoningStep(
        "infer",
        `So $p = ${choice.scaled}$ and $q = ${choice.denominator}$, hence $p + q = ${correctAnswer}$.`,
      ),
    ],
    context: {
      entity: "decimal",
      metric: "normalized fraction sum",
      context: "decimal conversion",
    },
  };
}

export function createHcfLcmScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { hcf: 6, lcm: 72, known: 18 },
      { hcf: 8, lcm: 96, known: 24 },
      { hcf: 9, lcm: 108, known: 27 },
    ],
    Medium: [
      { hcf: 10, lcm: 600, known: 120 },
      { hcf: 12, lcm: 720, known: 144 },
      { hcf: 15, lcm: 900, known: 180 },
      { hcf: 14, lcm: 840, known: 168 },
    ],
    Hard: [
      { hcf: 18, lcm: 1260, known: 180 },
      { hcf: 21, lcm: 1386, known: 198 },
      { hcf: 24, lcm: 1440, known: 192 },
      { hcf: 16, lcm: 960, known: 160 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const correctAnswer =
    (values.hcf * values.lcm) /
    values.known;

  return {
    scenarioType:
      "hcf-lcm-reconstruction",
    topicCluster: "fundamentals",
    values,
    formula:
      "hcf * lcm / known",
    text: `The HCF of two numbers is ${values.hcf} and their LCM is ${values.lcm}. If one number is ${values.known}, find the other number.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Use the identity: product of the two numbers = HCF x LCM = ${values.hcf} x ${values.lcm}.`,
      ),
      createReasoningStep(
        "infer",
        `Divide the product by ${values.known} to get the other number = ${correctAnswer}.`,
      ),
    ],
    context: {
      entity: "pair of numbers",
      metric: "missing number",
      context: "HCF-LCM identity",
    },
  };
}

export function createSurdScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { left: 18, right: 8, root: 2, coefficient: 5, leftCoeff: 3, rightCoeff: 2 },
      { left: 12, right: 27, root: 3, coefficient: 5, leftCoeff: 2, rightCoeff: 3 },
      { left: 20, right: 45, root: 5, coefficient: 5, leftCoeff: 2, rightCoeff: 3 },
    ],
    Medium: [
      { left: 72, right: 32, root: 2, coefficient: 10, leftCoeff: 6, rightCoeff: 4 },
      { left: 75, right: 27, root: 3, coefficient: 8, leftCoeff: 5, rightCoeff: 3 },
      { left: 125, right: 80, root: 5, coefficient: 9, leftCoeff: 5, rightCoeff: 4 },
    ],
    Hard: [
      { left: 50, right: 98, root: 2, coefficient: 12, leftCoeff: 5, rightCoeff: 7 },
      { left: 147, right: 75, root: 3, coefficient: 12, leftCoeff: 7, rightCoeff: 5 },
      { left: 245, right: 180, root: 5, coefficient: 13, leftCoeff: 7, rightCoeff: 6 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };

  return {
    scenarioType:
      "surd-factor-extraction",
    topicCluster: "fundamentals",
    values,
    formula: "coefficient",
    text: `If sqrt(${values.left}) + sqrt(${values.right}) is written in the form ksqrt(${values.root}), find k.`,
    correctAnswer:
      values.coefficient,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "factor",
        `Simplify the surds: sqrt(${values.left}) = ${values.leftCoeff}sqrt(${values.root}) and sqrt(${values.right}) = ${values.rightCoeff}sqrt(${values.root}).`,
      ),
      createReasoningStep(
        "aggregate",
        `Combine the like surds to get ${values.coefficient}sqrt(${values.root}).`,
      ),
      createReasoningStep(
        "infer",
        `Hence k = ${values.coefficient}.`,
      ),
    ],
    context: {
      entity: "surd expression",
      metric: "coefficient",
      context: "surd simplification",
    },
  };
}

export function createIndexScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const values = {
    a: pickRandomItem(
      difficulty === "Easy"
        ? [2, 3, 4]
        : difficulty === "Medium"
          ? [2, 3, 5]
          : [3, 4, 5, 6],
    ),
    m: pickRandomItem(
      difficulty === "Easy"
        ? [2, 3, 4]
        : difficulty === "Medium"
          ? [3, 4, 5, 6]
          : [3, 4, 5, 6, 7],
    ),
    n: pickRandomItem(
      difficulty === "Easy"
        ? [3, 4, 5, 6]
        : difficulty === "Medium"
          ? [4, 5, 6, 7]
          : [5, 6, 7, 8],
    ),
    p: pickRandomItem(
      difficulty === "Easy"
        ? [1, 2, 3]
        : difficulty === "Medium"
          ? [2, 3, 4, 5]
          : [2, 3, 4, 5, 6],
    ),
  };
  const netPower =
    values.m + values.n - values.p;
  const correctAnswer =
    values.a ** netPower;

  return {
    scenarioType:
      "index-law-compression",
    topicCluster: "fundamentals",
    values,
    formula:
      "a ** (m + n - p)",
    text: `Find the value of ${values.a}^${values.m} x ${values.a}^${values.n} / ${values.a}^${values.p}.`,
    correctAnswer,
    distractorHints: [
      "ratioInversion",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Use the laws of indices: add exponents while multiplying and subtract exponents while dividing.`,
      ),
      createReasoningStep(
        "aggregate",
        `The expression becomes ${values.a}^${netPower}.`,
      ),
      createReasoningStep(
        "infer",
        `${values.a}^${netPower} = ${correctAnswer}.`,
      ),
    ],
    context: {
      entity: "index expression",
      metric: "value",
      context: "indices",
    },
  };
}

export function createDivisibilityAdjustmentScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const divisor = pickRandomItem(
    difficulty === "Easy"
      ? [4, 5, 6, 8, 9]
      : difficulty === "Medium"
        ? [7, 9, 11, 12]
        : [9, 11, 13, 15],
  );
  const values = {
    number: randomInt(
      difficulty === "Easy" ? 120 : 300,
      difficulty === "Hard" ? 2999 : 999,
    ),
    divisor,
  };
  const remainder =
    values.number % values.divisor;
  const correctAnswer =
    remainder === 0
      ? 0
      : values.divisor - remainder;

  return {
    scenarioType:
      "divisibility-adjustment",
    topicCluster: "fundamentals",
    values: {
      ...values,
      remainder,
    },
    formula:
      "divisor - remainder",
    text: `What least number should be added to ${values.number} so that it becomes divisible by ${values.divisor}?`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "filter",
        `${values.number} leaves remainder ${remainder} when divided by ${values.divisor}.`,
      ),
      createReasoningStep(
        "infer",
        `So the least number to be added is ${values.divisor} - ${remainder} = ${correctAnswer}.`,
      ),
    ],
    context: {
      entity: "number",
      metric: "least addition",
      context: "divisibility",
    },
  };
}

export function createFundamentalsUnitDigitScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const cycleLengths: Record<
    number,
    number
  > = {
    2: 4,
    3: 4,
    4: 2,
    7: 4,
    8: 4,
    9: 2,
  };
  const base = pickRandomItem(
    difficulty === "Easy"
      ? [4, 7, 9]
      : difficulty === "Medium"
        ? [3, 7, 8, 9]
        : [2, 3, 7, 8, 9],
  );
  const values = {
    base,
    exponent: randomInt(
      difficulty === "Easy" ? 15 : 40,
      difficulty === "Hard" ? 250 : 140,
    ),
    cycleLength:
      cycleLengths[base]!,
  };
  const remainder =
    values.exponent %
    values.cycleLength;
  const cyclePosition =
    remainder === 0
      ? values.cycleLength
      : remainder;
  const cycles: Record<
    number,
    number[]
  > = {
    7: [7, 9, 3, 1],
    8: [8, 4, 2, 6],
    9: [9, 1],
  };
  const correctAnswer =
    cycles[values.base][
      cyclePosition - 1
    ]!;

  return {
    scenarioType:
      "fundamentals-unit-digit-cycle",
    topicCluster: "fundamentals",
    values: {
      ...values,
      cyclePosition,
    },
    formula: "answer",
    text: `Find the unit digit of ${values.base}^${values.exponent}.`,
    correctAnswer,
    distractorHints: [
      "comparisonTrap",
      "wrongIntermediateValue",
    ],
    reasoningSteps: [
      createReasoningStep(
        "reduce",
        `The unit digit cycle of ${values.base} repeats every ${values.cycleLength} terms.`,
      ),
      createReasoningStep(
        "index",
        `${values.exponent} mod ${values.cycleLength} = ${remainder}, so use position ${cyclePosition} in the cycle.`,
      ),
      createReasoningStep(
        "infer",
        `Hence the unit digit is ${correctAnswer}.`,
      ),
    ],
    context: {
      entity: "power",
      metric: "unit digit",
      context: "cyclicity",
    },
  };
}

export function createFundamentalsScenario(
  _pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const scenarioFactoriesByMotif: Record<
    string,
    FundamentalsScenarioFactory[]
  > = {
    "bodmas-sequencing": [
      createBodmasScenario,
    ],
    "fraction-cancellation-chain": [
      createFractionScenario,
    ],
    "decimal-fraction-normalization":
      [
        createDecimalNormalizationScenario,
      ],
    "hcf-lcm-reconstruction": [
      createHcfLcmScenario,
    ],
    "surd-factor-extraction": [
      createSurdScenario,
    ],
    "index-law-compression": [
      createIndexScenario,
    ],
    "divisibility-filter": [
      createDivisibilityAdjustmentScenario,
    ],
    "unit-digit-cycle": [
      createFundamentalsUnitDigitScenario,
    ],
  };

  const fallbackScenarios = [
    createBodmasScenario,
    createFractionScenario,
    createHcfLcmScenario,
    createIndexScenario,
    createFundamentalsUnitDigitScenario,
  ];

  const scenarioFactories =
    motif?.id
      ? scenarioFactoriesByMotif[
          motif.id
        ] ?? fallbackScenarios
      : fallbackScenarios;

  return pickRandomItem(
    scenarioFactories,
  )(difficulty, motif);
}
