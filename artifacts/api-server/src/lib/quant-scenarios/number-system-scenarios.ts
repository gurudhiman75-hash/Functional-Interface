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

type NumberSystemScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

function buildNumberSystemContext(
  context = "number system",
  metric = "required value",
): QuantScenarioContext {
  return {
    entity: "number",
    metric,
    context,
  };
}

export function createDivisibilityScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { number: 248, divisor: 9 },
      { number: 356, divisor: 7 },
      { number: 514, divisor: 8 },
    ],
    Medium: [
      { number: 473, divisor: 11 },
      { number: 685, divisor: 9 },
      { number: 742, divisor: 13 },
    ],
    Hard: [
      { number: 985, divisor: 9 },
      { number: 1675, divisor: 11 },
      { number: 2834, divisor: 17 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const remainder =
    values.number % values.divisor;
  const correctAnswer =
    remainder === 0
      ? 0
      : values.divisor - remainder;

  return {
    scenarioType:
      "divisibility-filter",
    topicCluster: "number-system",
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
        `${values.number} leaves remainder ${remainder} on division by ${values.divisor}.`,
      ),
      createReasoningStep(
        "infer",
        `Hence the least addition required is ${values.divisor} - ${remainder} = ${correctAnswer}.`,
      ),
    ],
    context: buildNumberSystemContext(
      "divisibility",
      "least addition",
    ),
  };
}

export function createRemainderScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { base: 3, exponent: 5, divisor: 7 },
      { base: 4, exponent: 4, divisor: 5 },
      { base: 5, exponent: 3, divisor: 7 },
    ],
    Medium: [
      { base: 7, exponent: 4, divisor: 5 },
      { base: 8, exponent: 5, divisor: 7 },
      { base: 9, exponent: 4, divisor: 11 },
    ],
    Hard: [
      { base: 11, exponent: 5, divisor: 9 },
      { base: 12, exponent: 5, divisor: 13 },
      { base: 14, exponent: 4, divisor: 15 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const correctAnswer =
    values.base ** values.exponent %
    values.divisor;

  return {
    scenarioType:
      "remainder-reduction",
    topicCluster: "number-system",
    values,
    formula:
      "(base ** exponent) % divisor",
    text: `Find the remainder when ${values.base}^${values.exponent} is divided by ${values.divisor}.`,
    correctAnswer,
    distractorHints: [
      "arithmeticSlip",
      "wrongIntermediateValue",
    ],
    reasoningSteps: [
      createReasoningStep(
        "reduce",
        `Reduce the power expression modulo ${values.divisor} instead of evaluating the full number directly.`,
      ),
      createReasoningStep(
        "infer",
        `After modular simplification, the required remainder is ${correctAnswer}.`,
      ),
    ],
    context: buildNumberSystemContext(
      "remainders",
      "remainder",
    ),
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
      { hcf: 12, lcm: 720, known: 144 },
      { hcf: 15, lcm: 900, known: 180 },
      { hcf: 14, lcm: 840, known: 168 },
    ],
    Hard: [
      { hcf: 18, lcm: 1260, known: 180 },
      { hcf: 21, lcm: 1386, known: 198 },
      { hcf: 24, lcm: 1440, known: 192 },
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
    topicCluster: "number-system",
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
        `Use the identity: product of two numbers = HCF x LCM.`,
      ),
      createReasoningStep(
        "infer",
        `So the other number = (${values.hcf} x ${values.lcm}) / ${values.known} = ${correctAnswer}.`,
      ),
    ],
    context: buildNumberSystemContext(
      "HCF-LCM",
      "missing number",
    ),
  };
}

export function createUnitDigitScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { base: 9, exponent: 21, cycleLength: 2 },
      { base: 4, exponent: 17, cycleLength: 2 },
      { base: 6, exponent: 23, cycleLength: 1 },
    ],
    Medium: [
      { base: 7, exponent: 103, cycleLength: 4 },
      { base: 3, exponent: 58, cycleLength: 4 },
      { base: 8, exponent: 66, cycleLength: 4 },
    ],
    Hard: [
      { base: 8, exponent: 117, cycleLength: 4 },
      { base: 7, exponent: 222, cycleLength: 4 },
      { base: 3, exponent: 145, cycleLength: 4 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
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
    3: [3, 9, 7, 1],
    4: [4, 6],
    6: [6],
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
      "unit-digit-cycle",
    topicCluster: "number-system",
    values: {
      ...values,
      cyclePosition,
      remainder,
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
        `The unit digit cycle of ${values.base} has length ${values.cycleLength}.`,
      ),
      createReasoningStep(
        "index",
        `${values.exponent} mod ${values.cycleLength} = ${remainder}, so use cycle position ${cyclePosition}.`,
      ),
      createReasoningStep(
        "infer",
        `Hence the unit digit is ${correctAnswer}.`,
      ),
    ],
    context: buildNumberSystemContext(
      "unit digit",
      "unit digit",
    ),
  };
}

export function createFactorialScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const n = pickRandomItem(
    difficulty === "Easy"
      ? [25, 30, 40]
      : difficulty === "Medium"
        ? [75, 100, 120]
        : [125, 150, 175],
  );
  const floorFive = Math.floor(n / 5);
  const floorTwentyFive =
    Math.floor(n / 25);
  const floorOneTwentyFive =
    Math.floor(n / 125);
  const correctAnswer =
    floorFive +
    floorTwentyFive +
    floorOneTwentyFive;

  return {
    scenarioType:
      "factorial-trailing-zero",
    topicCluster: "number-system",
    values: {
      n,
      floorFive,
      floorTwentyFive,
      floorOneTwentyFive,
    },
    formula:
      "floorFive + floorTwentyFive + floorOneTwentyFive",
    text: `How many trailing zeros are there in ${n}! ?`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "cumulativeMistake",
    ],
    reasoningSteps: [
      createReasoningStep(
        "factor",
        `Trailing zeros come from 10 = 2 x 5, and the count of 5-factors limits the total.`,
      ),
      createReasoningStep(
        "aggregate",
        `Count the powers of 5: floor(${n}/5) = ${floorFive}, floor(${n}/25) = ${floorTwentyFive}, floor(${n}/125) = ${floorOneTwentyFive}.`,
      ),
      createReasoningStep(
        "infer",
        `Total trailing zeros = ${correctAnswer}.`,
      ),
    ],
    context: buildNumberSystemContext(
      "factorials",
      "trailing zeros",
    ),
  };
}

export function createRecurringDecimalScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        numerator: 1,
        denominator: 3,
        display: "0.333...",
      },
      {
        numerator: 2,
        denominator: 9,
        display: "0.222...",
      },
      {
        numerator: 5,
        denominator: 9,
        display: "0.555...",
      },
    ],
    Medium: [
      {
        numerator: 3,
        denominator: 11,
        display: "0.272727...",
      },
      {
        numerator: 7,
        denominator: 11,
        display: "0.636363...",
      },
      {
        numerator: 5,
        denominator: 6,
        display: "0.8333...",
      },
    ],
    Hard: [
      {
        numerator: 1,
        denominator: 6,
        display: "0.1666...",
      },
      {
        numerator: 7,
        denominator: 12,
        display: "0.5833...",
      },
      {
        numerator: 13,
        denominator: 15,
        display: "0.8666...",
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const correctAnswer =
    values.numerator +
    values.denominator;

  return {
    scenarioType:
      "recurring-decimal-reconstruction",
    topicCluster: "number-system",
    values,
    formula:
      "numerator + denominator",
    text: `${values.display} is written as p/q in lowest terms. Find p + q.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Convert ${values.display} into a fraction by using the recurring-decimal subtraction method.`,
      ),
      createReasoningStep(
        "aggregate",
        `In lowest terms, p/q = ${values.numerator}/${values.denominator}.`,
      ),
      createReasoningStep(
        "infer",
        `Hence p + q = ${correctAnswer}.`,
      ),
    ],
    context: buildNumberSystemContext(
      "recurring decimals",
      "fraction sum",
    ),
  };
}

export function createDivisorCountScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        number: 72,
        count: 12,
      },
      {
        number: 60,
        count: 12,
      },
      {
        number: 84,
        count: 12,
      },
    ],
    Medium: [
      {
        number: 360,
        count: 24,
      },
      {
        number: 420,
        count: 24,
      },
      {
        number: 540,
        count: 24,
      },
    ],
    Hard: [
      {
        number: 840,
        count: 32,
      },
      {
        number: 1260,
        count: 36,
      },
      {
        number: 720,
        count: 30,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };

  return {
    scenarioType:
      "divisor-count-prime-exponents",
    topicCluster: "number-system",
    values: {
      number: values.number,
      count: values.count,
    },
    formula: "count",
    text: `How many positive divisors does ${values.number} have?`,
    correctAnswer:
      values.count,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "factor",
        `Express ${values.number} in prime powers.`,
      ),
      createReasoningStep(
        "aggregate",
        `Apply the divisor-count formula by multiplying one more than each exponent.`,
      ),
      createReasoningStep(
        "infer",
        `Hence the number of divisors is ${values.count}.`,
      ),
    ],
    context: buildNumberSystemContext(
      "divisor count",
      "number of divisors",
    ),
  };
}

export function createPerfectPowerScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { number: 90, multiplier: 10 },
      { number: 45, multiplier: 5 },
      { number: 63, multiplier: 7 },
    ],
    Medium: [
      { number: 72, multiplier: 2 },
      { number: 98, multiplier: 2 },
      { number: 108, multiplier: 3 },
    ],
    Hard: [
      { number: 540, multiplier: 15 },
      { number: 294, multiplier: 6 },
      { number: 1470, multiplier: 30 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };

  return {
    scenarioType:
      "perfect-power-balance",
    topicCluster: "number-system",
    values,
    formula: "multiplier",
    text: `What least number should be multiplied by ${values.number} to make it a perfect square?`,
    correctAnswer:
      values.multiplier,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "factor",
        `Resolve ${values.number} into prime factors and inspect the parity of exponents.`,
      ),
      createReasoningStep(
        "compare",
        `Make every prime exponent even by multiplying the missing factor.`,
      ),
      createReasoningStep(
        "infer",
        `So the least required multiplier is ${values.multiplier}.`,
      ),
    ],
    context: buildNumberSystemContext(
      "perfect powers",
      "least multiplier",
    ),
  };
}

export function createNumberSystemScenario(
  _pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const scenarioFactoriesByMotif: Record<
    string,
    NumberSystemScenarioFactory[]
  > = {
    "divisibility-filter": [
      createDivisibilityScenario,
    ],
    "remainder-reduction": [
      createRemainderScenario,
    ],
    "hcf-lcm-reconstruction": [
      createHcfLcmScenario,
    ],
    "unit-digit-cycle": [
      createUnitDigitScenario,
    ],
    "factorial-trailing-zero": [
      createFactorialScenario,
    ],
    "recurring-decimal-reconstruction":
      [
        createRecurringDecimalScenario,
      ],
    "divisor-count-prime-exponents": [
      createDivisorCountScenario,
    ],
    "perfect-power-balance": [
      createPerfectPowerScenario,
    ],
    "divisibility-remainder": [
      createDivisibilityScenario,
      createRemainderScenario,
      createUnitDigitScenario,
    ],
  };

  const fallbackScenarios = [
    createDivisibilityScenario,
    createRemainderScenario,
    createUnitDigitScenario,
    createFactorialScenario,
    createRecurringDecimalScenario,
    createDivisorCountScenario,
    createPerfectPowerScenario,
    createHcfLcmScenario,
  ];

  const scenarioFactories =
    motif?.id
      ? scenarioFactoriesByMotif[
          motif.id
        ] ?? fallbackScenarios
      : fallbackScenarios;
  const shuffledFactories = [
    ...scenarioFactories,
  ];
  const startIndex =
    randomInt(
      0,
      shuffledFactories.length - 1,
    );

  return shuffledFactories[
    startIndex
  ]!(difficulty, motif);
}
