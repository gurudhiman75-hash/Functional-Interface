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

function isNiceRemainderQuestion(
  base: number,
  exponent: number,
  divisor: number,
): boolean {
  const answer =
    base ** exponent % divisor;
  return Number.isFinite(answer);
}

export function createDivisibilityScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const divisorPools = {
    Easy: [4, 5, 6, 7, 8, 9, 11],
    Medium: [7, 8, 9, 11, 12, 13],
    Hard: [9, 11, 13, 15, 17, 19],
  } as const;
  const numberRanges = {
    Easy: [120, 999],
    Medium: [300, 1999],
    Hard: [800, 4999],
  } as const;
  const [minNumber, maxNumber] =
    numberRanges[difficulty];
  const divisor = pickRandomItem(
    divisorPools[difficulty],
  );
  let number = randomInt(
    minNumber,
    maxNumber,
  );
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (number % divisor !== 0) {
      break;
    }
    number = randomInt(
      minNumber,
      maxNumber,
    );
  }
  const values = {
    number,
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
  const basePools = {
    Easy: [3, 4, 5, 6, 7],
    Medium: [5, 6, 7, 8, 9, 10],
    Hard: [7, 8, 9, 10, 11, 12, 13, 14],
  } as const;
  const exponentPools = {
    Easy: [3, 4, 5, 6],
    Medium: [4, 5, 6, 7],
    Hard: [4, 5, 6, 7, 8],
  } as const;
  const divisorPools = {
    Easy: [5, 7, 8, 9],
    Medium: [7, 9, 11, 13],
    Hard: [9, 11, 13, 15, 17],
  } as const;
  let values = {
    base: pickRandomItem(
      basePools[difficulty],
    ),
    exponent: pickRandomItem(
      exponentPools[difficulty],
    ),
    divisor: pickRandomItem(
      divisorPools[difficulty],
    ),
  };
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (
      isNiceRemainderQuestion(
        values.base,
        values.exponent,
        values.divisor,
      )
    ) {
      break;
    }
    values = {
      base: pickRandomItem(
        basePools[difficulty],
      ),
      exponent: pickRandomItem(
        exponentPools[difficulty],
      ),
      divisor: pickRandomItem(
        divisorPools[difficulty],
      ),
    };
  }
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
  const cycleLengths: Record<
    number,
    number
  > = {
    2: 4,
    3: 4,
    4: 2,
    6: 1,
    7: 4,
    8: 4,
    9: 2,
  };
  const basePools = {
    Easy: [2, 4, 6, 9],
    Medium: [3, 4, 7, 8, 9],
    Hard: [2, 3, 7, 8, 9],
  } as const;
  const exponentRanges = {
    Easy: [11, 49],
    Medium: [25, 149],
    Hard: [75, 299],
  } as const;
  const base = pickRandomItem(
    basePools[difficulty],
  );
  const [expMin, expMax] =
    exponentRanges[difficulty];
  const exponent = randomInt(
    expMin,
    expMax,
  );
  const values = {
    base,
    exponent,
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
      ? [20, 25, 30, 35, 40, 45, 50]
      : difficulty === "Medium"
        ? [60, 75, 80, 90, 100, 120]
        : [125, 150, 175, 180, 200, 225],
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
      {
        numerator: 4,
        denominator: 11,
        display: "0.363636...",
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
      {
        numerator: 7,
        denominator: 9,
        display: "0.777...",
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
      {
        numerator: 17,
        denominator: 18,
        display: "0.9444...",
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
      {
        number: 96,
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
      {
        number: 756,
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
      {
        number: 900,
        count: 27,
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
      { number: 75, multiplier: 3 },
    ],
    Medium: [
      { number: 72, multiplier: 2 },
      { number: 98, multiplier: 2 },
      { number: 108, multiplier: 3 },
      { number: 192, multiplier: 3 },
    ],
    Hard: [
      { number: 540, multiplier: 15 },
      { number: 294, multiplier: 6 },
      { number: 1470, multiplier: 30 },
      { number: 2352, multiplier: 6 },
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
