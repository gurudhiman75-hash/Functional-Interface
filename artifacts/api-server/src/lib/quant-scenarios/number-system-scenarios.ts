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

function formatLatexFractionCore(
  numerator: number,
  denominator: number,
) {
  return `\\frac{${numerator}}{${denominator}}`;
}

function formatLatexFraction(
  numerator: number,
  denominator: number,
) {
  return `$${formatLatexFractionCore(numerator, denominator)}$`;
}

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
    text: `${values.display} is written as $p/q$ in lowest terms. Find $p + q$.`,
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
        `In lowest terms, $p/q = ${formatLatexFractionCore(values.numerator, values.denominator)}$.`,
      ),
      createReasoningStep(
        "infer",
        `Hence $p + q = ${correctAnswer}$.`,
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

type NumDefinition = {
  motifId: string;
  branch: string;
  text: string;
  values: Record<string, number>;
  answer: number;
  formula: string;
  steps: Array<[
    Parameters<typeof createReasoningStep>[0],
    string,
  ]>;
};

function finalizeNumScenario(
  definition: NumDefinition,
): QuantProceduralScenario {
  return {
    scenarioType: definition.motifId,
    topicCluster: "number-system",
    values: definition.values,
    formula: definition.formula,
    text: definition.text,
    correctAnswer: definition.answer,
    reasoningSteps:
      definition.steps.map(
        ([type, detail]) =>
          createReasoningStep(type, detail),
      ),
    explanation: [
      ...definition.steps.map(
        ([, detail]) => detail,
      ),
      `Final answer = $${definition.answer}$.`,
    ].join("\n"),
    context: buildNumberSystemContext(
      "number system",
      "required value",
    ),
    motifId: definition.motifId,
    scenarioLogicBranch:
      definition.branch,
    structuralSignature: `${definition.motifId}::${definition.branch}::${Object.values(
      definition.values,
    ).join("|")}`,
    validationTokens: undefined,
  };
}

function createNumDefinition(
  motifId: string,
): NumDefinition {
  switch (motifId) {
    case "num-class-id":
    case "num-class-rational-irrational":
      return {
        motifId,
        branch: "irrational-code",
        text: `Use $1$ if $\\sqrt{2}\\in\\mathbb{Q}$ and $0$ if $\\sqrt{2}\\notin\\mathbb{Q}$.`,
        values: { answer: 0 },
        answer: 0,
        formula: "sqrt(2) irrational",
        steps: [
          ["classify", `$\\sqrt{2}$ is non-terminating and non-repeating.`],
          ["infer", `Therefore $\\sqrt{2}\\notin\\mathbb{Q}$, so the required code is $0$.`],
        ],
      };
    case "num-class-prime-check":
      return {
        motifId,
        branch: "prime-check-sqrt",
        text: `Check whether $97$ is prime. Use $1$ for prime and $0$ for composite.`,
        values: { n: 97 },
        answer: 1,
        formula: "check primes <= sqrt(n)",
        steps: [
          ["factor", `$\\sqrt{97}<10$, so test divisibility by $2,3,5,7$.`],
          ["filter", `$97$ is not divisible by $2,3,5,$ or $7$.`],
          ["infer", `Hence $97$ is prime.`],
        ],
      };
    case "num-class-integers":
      return {
        motifId,
        branch: "sum-first-odd",
        text: `Find the sum of the first $12$ odd natural numbers.`,
        values: { n: 12 },
        answer: 144,
        formula: "n^2",
        steps: [
          ["transform", `The sum of first $n$ odd natural numbers is $n^2$.`],
          ["infer", `For $n=12$, sum $=12^2=144$.`],
        ],
      };
    case "num-class-smallest":
      return {
        motifId,
        branch: "smallest-composite",
        text: `Find the smallest composite number.`,
        values: { answer: 4 },
        answer: 4,
        formula: "smallest composite",
        steps: [
          ["classify", `$1$ is neither prime nor composite, and $2,3$ are prime.`],
          ["infer", `The smallest composite number is $4$.`],
        ],
      };
    case "num-div-basic":
      return {
        motifId,
        branch: "divisibility-by-11",
        text: `Use $1$ if $5071$ is divisible by $11$, otherwise use $0$.`,
        values: { n: 5071 },
        answer: 1,
        formula: "alternating digit sum",
        steps: [
          ["filter", `For $11$, compute alternating difference: $(5+7)-(0+1)=11$.`],
          ["infer", `Since $11$ is divisible by $11$, $5071$ is divisible by $11$.`],
        ],
      };
    case "num-div-combined":
      return {
        motifId,
        branch: "divisibility-by-72",
        text: `Use $1$ if $3528$ is divisible by $72$, otherwise use $0$.`,
        values: { n: 3528, divisor: 72 },
        answer: 1,
        formula: "72=8*9",
        steps: [
          ["factor", `$72=8\\times9$, and $8,9$ are coprime.`],
          ["filter", `Last three digits $528$ are divisible by $8$, and digit sum $3+5+2+8=18$ is divisible by $9$.`],
          ["infer", `Hence $3528$ is divisible by $72$.`],
        ],
      };
    case "num-div-unknown":
    case "num-div-missing-number":
      return {
        motifId,
        branch: "unknown-digit-divisibility-9",
        text: `Find the digit $x$ if $451x603$ is divisible by $9$.`,
        values: { knownDigitSum: 19 },
        answer: 8,
        formula: "digit sum multiple of 9",
        steps: [
          ["aggregate", `Digit sum $=4+5+1+x+6+0+3=19+x$.`],
          ["filter", `For divisibility by $9$, $19+x$ must be a multiple of $9$.`],
          ["infer", `The digit value is $x=8$ because $19+8=27$.`],
        ],
      };
    case "num-div-11-unknown":
      return {
        motifId,
        branch: "unknown-digit-divisibility-11",
        text: `Find the digit $x$ if $23x54$ is divisible by $11$.`,
        values: { answer: 2 },
        answer: 2,
        formula: "alternating digit difference",
        steps: [
          ["aggregate", `Alternating sums are $(2+x+4)$ and $(3+5)=8$.`],
          ["filter", `For divisibility by $11$, $(x+6)-8=x-2$ must be $0$ or a multiple of $11$.`],
          ["infer", `The valid digit is $x=2$.`],
        ],
      };
    case "num-rem-basic":
      return {
        motifId,
        branch: "product-remainder",
        text: `Find the remainder when $23\\times35\\times41$ is divided by $7$.`,
        values: { divisor: 7 },
        answer: 0,
        formula: "product mod 7",
        steps: [
          ["transform", `$23\\equiv2$, $35\\equiv0$, and $41\\equiv6\\pmod 7$.`],
          ["infer", `The product is congruent to $2\\times0\\times6=0\\pmod 7$.`],
        ],
      };
    case "num-rem-power":
      return {
        motifId,
        branch: "power-remainder-cycle",
        text: `Find the remainder when $3^{100}$ is divided by $7$.`,
        values: { base: 3, exponent: 100, divisor: 7 },
        answer: 4,
        formula: "cycle mod 7",
        steps: [
          ["transform", `Powers of $3\\pmod 7$ cycle as $3,2,6,4,5,1$.`],
          ["filter", `$100\\equiv4\\pmod 6$.`],
          ["infer", `The fourth cycle value is $4$.`],
        ],
      };
    case "num-rem-successive":
      return {
        motifId,
        branch: "successive-remainder-backcalc",
        text: `A number is divided successively by $3$, $4$, and $5$, leaving remainders $2$, $3$, and $4$. If the final quotient is $1$, find the number.`,
        values: { q: 1 },
        answer: 119,
        formula: "back calculation",
        steps: [
          ["transform", `Work backwards: before division by $5$, value $=1\\times5+4=9$.`],
          ["transform", `Before division by $4$, value $=9\\times4+3=39$.`],
          ["infer", `Before division by $3$, value $=39\\times3+2=119$.`],
        ],
      };
    case "num-rem-negative":
      return {
        motifId,
        branch: "negative-remainder-normalize",
        text: `If a number is congruent to $-1\\pmod 7$, find its least non-negative remainder.`,
        values: { divisor: 7 },
        answer: 6,
        formula: "-1 mod 7",
        steps: [
          ["transform", `$-1\\equiv7-1\\pmod 7$.`],
          ["infer", `So the least non-negative remainder is $6$.`],
        ],
      };
    case "num-rem-fermat":
      return {
        motifId,
        branch: "fermat-prime-mod",
        text: `Find the remainder when $2^{100}$ is divided by $13$.`,
        values: { base: 2, exponent: 100, divisor: 13 },
        answer: 3,
        formula: "Fermat cycle",
        steps: [
          ["transform", `Since $13$ is prime and $13\\nmid2$, $2^{12}\\equiv1\\pmod{13}$.`],
          ["filter", `$100\\equiv4\\pmod{12}$.`],
          ["infer", `So $2^{100}\\equiv2^4=16\\equiv3\\pmod{13}$.`],
        ],
      };
    case "num-fact-count":
      return {
        motifId,
        branch: "divisor-count-360",
        text: `Find the number of positive factors of $360$.`,
        values: { n: 360 },
        answer: 24,
        formula: "exponent product",
        steps: [
          ["factor", `$360=2^3\\cdot3^2\\cdot5^1$.`],
          ["infer", `Number of factors $=(3+1)(2+1)(1+1)=24$.`],
        ],
      };
    case "num-fact-sum":
      return {
        motifId,
        branch: "sum-factors-72",
        text: `Find the sum of all positive factors of $72$.`,
        values: { n: 72 },
        answer: 195,
        formula: "sum of divisors",
        steps: [
          ["factor", `$72=2^3\\cdot3^2$.`],
          ["aggregate", `Sum $=(1+2+2^2+2^3)(1+3+3^2)=15\\times13=195$.`],
        ],
      };
    case "num-fact-trailing-zeros":
      return {
        motifId,
        branch: "trailing-zeros",
        text: `Find the number of trailing zeros in $100!$.`,
        values: { n: 100 },
        answer: 24,
        formula: "floor(n/5)+floor(n/25)",
        steps: [
          ["factor", `Trailing zeros are determined by factors of $5$ in $100!$.`],
          ["aggregate", `$\\left\\lfloor\\frac{100}{5}\\right\\rfloor+\\left\\lfloor\\frac{100}{25}\\right\\rfloor=20+4=24$.`],
        ],
      };
    case "num-fact-highest-power":
    case "num-factorial-divisibility":
      return {
        motifId,
        branch: "highest-power-factorial",
        text: `Find the highest power of $5$ that divides $125!$.`,
        values: { n: 125 },
        answer: 31,
        formula: "floor sum",
        steps: [
          ["aggregate", `Power of $5$ in $125!$ is $\\left\\lfloor\\frac{125}{5}\\right\\rfloor+\\left\\lfloor\\frac{125}{25}\\right\\rfloor+\\left\\lfloor\\frac{125}{125}\\right\\rfloor$.`],
          ["infer", `So the highest power is $25+5+1=31$.`],
        ],
      };
    case "num-fact-proper":
      return {
        motifId,
        branch: "proper-factor-count",
        text: `If $60$ has $12$ positive factors, find the number of proper factors of $60$.`,
        values: { factors: 12 },
        answer: 11,
        formula: "total factors - 1",
        steps: [
          ["filter", `Proper factors exclude the number itself but include $1$.`],
          ["infer", `Therefore proper factors $=12-1=11$.`],
        ],
      };
    case "num-unit-digit":
      return {
        motifId,
        branch: "unit-digit-power",
        text: `Find the unit digit of $7^{103}$.`,
        values: { base: 7, exponent: 103 },
        answer: 3,
        formula: "cycle [7,9,3,1]",
        steps: [
          ["transform", `Unit digits of powers of $7$ cycle as $7,9,3,1$.`],
          ["filter", `$103\\equiv3\\pmod4$.`],
          ["infer", `The third value is $3$.`],
        ],
      };
    case "num-unit-series":
      return {
        motifId,
        branch: "factorial-series-unit",
        text: `Find the unit digit of $1!+2!+3!+\\cdots+10!$.`,
        values: { n: 10 },
        answer: 3,
        formula: "factorial unit stabilization",
        steps: [
          ["transform", `For $n\\ge5$, $n!$ has unit digit $0$.`],
          ["aggregate", `So only $1!+2!+3!+4!=1+2+6+24=33$ affects the unit digit.`],
          ["infer", `The unit digit is $3$.`],
        ],
      };
    case "num-last-two-digits":
      return {
        motifId,
        branch: "last-two-digits",
        text: `Find the last two digits of $7^4$.`,
        values: { base: 7, exponent: 4 },
        answer: 1,
        formula: "mod 100",
        steps: [
          ["aggregate", `$7^4=2401$.`],
          ["infer", `The last two digits are $01$, so enter $1$.`],
        ],
      };
    case "num-unit-product":
      return {
        motifId,
        branch: "unit-product",
        text: `Find the unit digit of $18\\times27\\times35$.`,
        values: { answer: 0 },
        answer: 0,
        formula: "terminal digit product",
        steps: [
          ["transform", `Use only terminal digits: $8\\times7\\times5$.`],
          ["infer", `Since an even digit multiplied by $5$ gives unit digit $0$, the answer is $0$.`],
        ],
      };
    case "num-unit-zero-power":
      return {
        motifId,
        branch: "zero-power-edge",
        text: `Use $1$ if $0^0$ has a fixed numerical value in elementary arithmetic and $0$ if it is indeterminate.`,
        values: { answer: 0 },
        answer: 0,
        formula: "0^0 indeterminate",
        steps: [
          ["classify", `$0^0$ is treated as indeterminate in this context.`],
          ["infer", `So the required code is $0$.`],
        ],
      };
    case "num-surd-compare":
      return {
        motifId,
        branch: "surd-common-power",
        text: `Use $1$ if $\\sqrt[3]{4}>\\sqrt[4]{6}$, otherwise use $0$.`,
        values: { answer: 1 },
        answer: 1,
        formula: "raise to 12",
        steps: [
          ["transform", `Raise both positive quantities to the $12^{th}$ power.`],
          ["compare", `$(\\sqrt[3]{4})^{12}=4^4=256$ and $(\\sqrt[4]{6})^{12}=6^3=216$.`],
          ["infer", `Since $256>216$, $\\sqrt[3]{4}>\\sqrt[4]{6}$.`],
        ],
      };
    case "num-simpl-vbodmas":
      return {
        motifId,
        branch: "vbodmas",
        text: `Simplify $8+4\\times5-12\\div3$.`,
        values: { answer: 24 },
        answer: 24,
        formula: "VBODMAS",
        steps: [
          ["transform", `Do division and multiplication before addition and subtraction: $4\\times5=20$, $12\\div3=4$.`],
          ["infer", `So $8+20-4=24$.`],
        ],
      };
    case "num-simpl-recurring":
      return {
        motifId,
        branch: "mixed-recurring",
        text: `Convert $0.34\\overline{67}$ into $\\frac{p}{q}$ in lowest terms. Find $p+q$.`,
        values: { p: 3433, q: 9900 },
        answer: 13333,
        formula: "mixed recurring decimal",
        steps: [
          ["transform", `$0.34\\overline{67}=\\frac{3467-34}{9900}=\\frac{3433}{9900}$.`],
          ["infer", `Thus $p+q=3433+9900=13333$.`],
        ],
      };
    case "num-recurring-pure":
      return {
        motifId,
        branch: "pure-recurring",
        text: `Convert $0.\\overline{27}$ into $\\frac{p}{q}$ in lowest terms. Find $p+q$.`,
        values: { p: 3, q: 11 },
        answer: 14,
        formula: "27/99",
        steps: [
          ["transform", `$0.\\overline{27}=\\frac{27}{99}=\\frac{3}{11}$.`],
          ["infer", `So $p+q=3+11=14$.`],
        ],
      };
    case "num-index-laws":
      return {
        motifId,
        branch: "index-law",
        text: `Simplify $2^3\\times2^5\\div2^4$.`,
        values: { answer: 16 },
        answer: 16,
        formula: "a^m a^n / a^p",
        steps: [
          ["transform", `$2^3\\times2^5\\div2^4=2^{3+5-4}=2^4$.`],
          ["infer", `$2^4=16$.`],
        ],
      };
    case "num-surd-simplify":
      return {
        motifId,
        branch: "surd-simplify",
        text: `Simplify $\\sqrt{72}+\\sqrt{32}$ as $k\\sqrt{2}$. Find $k$.`,
        values: { answer: 10 },
        answer: 10,
        formula: "extract square factors",
        steps: [
          ["transform", `$\\sqrt{72}=6\\sqrt2$ and $\\sqrt{32}=4\\sqrt2$.`],
          ["infer", `Sum $=10\\sqrt2$, so $k=10$.`],
        ],
      };
    case "num-perfect-square-check":
      return {
        motifId,
        branch: "perfect-square-multiplier",
        text: `What least number should multiply $72$ to make it a perfect square?`,
        values: { n: 72 },
        answer: 2,
        formula: "balance exponents",
        steps: [
          ["factor", `$72=2^3\\cdot3^2$.`],
          ["infer", `Multiply by $2$ to make the exponent of $2$ even.`],
        ],
      };
    case "num-perfect-cube-check":
      return {
        motifId,
        branch: "perfect-cube-multiplier",
        text: `What least number should multiply $72$ to make it a perfect cube?`,
        values: { n: 72 },
        answer: 3,
        formula: "exponents multiples of 3",
        steps: [
          ["factor", `$72=2^3\\cdot3^2$.`],
          ["infer", `Multiply by $3$ so the exponent of $3$ becomes $3$.`],
        ],
      };
    case "num-hcf-lcm-relation":
      return {
        motifId,
        branch: "hcf-lcm-other-number",
        text: `The HCF of two numbers is $12$, their LCM is $180$, and one number is $36$. Find the other number.`,
        values: { hcf: 12, lcm: 180, one: 36 },
        answer: 60,
        formula: "a*b=hcf*lcm",
        steps: [
          ["transform", `For two numbers, $a\\times b=\\mathrm{HCF}\\times\\mathrm{LCM}$.`],
          ["infer", `Other number $=\\frac{12\\times180}{36}=60$.`],
        ],
      };
    case "num-lcm-multiples":
      return {
        motifId,
        branch: "lcm",
        text: `Find the LCM of $12$, $18$, and $30$.`,
        values: { answer: 180 },
        answer: 180,
        formula: "highest prime powers",
        steps: [
          ["factor", `$12=2^2\\cdot3$, $18=2\\cdot3^2$, $30=2\\cdot3\\cdot5$.`],
          ["infer", `LCM $=2^2\\cdot3^2\\cdot5=180$.`],
        ],
      };
    case "num-base-conversion":
      return {
        motifId,
        branch: "base-to-decimal",
        text: `Convert $(132)_5$ to decimal.`,
        values: { answer: 42 },
        answer: 42,
        formula: "base expansion",
        steps: [
          ["transform", `$(132)_5=1\\cdot5^2+3\\cdot5+2$.`],
          ["infer", `Decimal value $=25+15+2=42$.`],
        ],
      };
    case "num-digit-count":
      return {
        motifId,
        branch: "digit-count",
        text: `How many digits are there in the number $1000$?`,
        values: { n: 1000 },
        answer: 4,
        formula: "place value",
        steps: [
          ["classify", `$1000$ lies from $1000$ to $9999$, the four-digit range.`],
          ["infer", `Therefore it has $4$ digits.`],
        ],
      };
    case "num-divisibility-range-count":
      return {
        motifId,
        branch: "multiples-between",
        text: `How many integers between $100$ and $500$ are divisible by $7$?`,
        values: { first: 105, last: 497 },
        answer: 57,
        formula: "(last-first)/7+1",
        steps: [
          ["filter", `First multiple is $105$ and last multiple is $497$.`],
          ["infer", `Count $=\\frac{497-105}{7}+1=57$.`],
        ],
      };
    case "num-rem-chinese-basic":
      return {
        motifId,
        branch: "same-remainder",
        text: `Find the least number which leaves remainder $2$ when divided by $3$, $4$, and $5$.`,
        values: { lcm: 60, rem: 2 },
        answer: 62,
        formula: "LCM + remainder",
        steps: [
          ["aggregate", `A number leaving the same remainder $2$ must be $\\mathrm{LCM}(3,4,5)+2$.`],
          ["infer", `Least number $=60+2=62$.`],
        ],
      };
    default:
      return {
        motifId,
        branch: "fallback-divisibility",
        text: `Use $1$ if $144$ is divisible by $12$, otherwise use $0$.`,
        values: { n: 144, divisor: 12 },
        answer: 1,
        formula: "divisibility",
        steps: [
          ["filter", `$144=12\\times12$, so $12\\mid144$.`],
          ["infer", `The required code is $1$.`],
        ],
      };
  }
}

function createNumericalPropertyScenario(
  motifId: string,
): QuantProceduralScenario {
  const definition =
    createNumDefinition(motifId);
  return finalizeNumScenario(definition);
}

export function createNumberSystemScenario(
  _pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  if (motif?.id?.startsWith("num-")) {
    return createNumericalPropertyScenario(
      motif.id,
    );
  }

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
