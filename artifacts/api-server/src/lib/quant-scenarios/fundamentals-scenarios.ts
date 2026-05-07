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
} from "../shared";
import type { QuantProceduralScenario } from "./time-work-scenarios";

type FundamentalsScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

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
  const sets = {
    Easy: { a: 8, b: 4, c: 5, d: 12, e: 3 },
    Medium: { a: 18, b: 6, c: 7, d: 16, e: 4 },
    Hard: { a: 24, b: 9, c: 8, d: 27, e: 3 },
  } as const;
  const values = { ...sets[difficulty] };
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
  const sets = {
    Easy: { a: 1, b: 2, c: 1, d: 3, e: 6 },
    Medium: { a: 3, b: 4, c: 5, d: 6, e: 8 },
    Hard: { a: 7, b: 12, c: 5, d: 18, e: 9 },
  } as const;
  const values = { ...sets[difficulty] };
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
    text: `Find the value of ( ${values.a}/${values.b} + ${values.c}/${values.d} ) x ${values.e}.`,
    correctAnswer,
    distractorHints: [
      "ratioInversion",
      "wrongIntermediateValue",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `First add ${values.a}/${values.b} and ${values.c}/${values.d} by taking the LCM of ${values.b} and ${values.d}.`,
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
    Easy: { scaled: 5, denominator: 8 },
    Medium: { scaled: 13, denominator: 16 },
    Hard: { scaled: 19, denominator: 32 },
  } as const;
  const choice = decimals[difficulty];
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
    text: `${decimal} is written as p/q in lowest terms. Find p + q.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "prematureRounding",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Write ${decimal} as a fraction and reduce it to lowest terms: ${choice.scaled}/${choice.denominator}.`,
      ),
      createReasoningStep(
        "infer",
        `So p = ${choice.scaled} and q = ${choice.denominator}, hence p + q = ${correctAnswer}.`,
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
    Easy: { hcf: 6, lcm: 72, known: 18 },
    Medium: { hcf: 12, lcm: 720, known: 144 },
    Hard: { hcf: 18, lcm: 1260, known: 180 },
  } as const;
  const values = { ...sets[difficulty] };
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
    Easy: { left: 18, right: 8, root: 2, coefficient: 5 },
    Medium: { left: 72, right: 32, root: 2, coefficient: 10 },
    Hard: { left: 50, right: 98, root: 2, coefficient: 12 },
  } as const;
  const values = { ...sets[difficulty] };

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
        `Simplify the surds: sqrt(${values.left}) = ${values.coefficient - (values.right === 32 ? 4 : values.right === 8 ? 2 : 7)}sqrt(${values.root}) and sqrt(${values.right}) becomes the remaining like-surd term.`,
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
  const sets = {
    Easy: { a: 2, m: 3, n: 5, p: 4 },
    Medium: { a: 3, m: 4, n: 6, p: 5 },
    Hard: { a: 5, m: 3, n: 7, p: 4 },
  } as const;
  const values = { ...sets[difficulty] };
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
  const sets = {
    Easy: { number: 248, divisor: 9 },
    Medium: { number: 473, divisor: 11 },
    Hard: { number: 985, divisor: 9 },
  } as const;
  const values = { ...sets[difficulty] };
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
  const sets = {
    Easy: { base: 7, exponent: 23, cycleLength: 4 },
    Medium: { base: 9, exponent: 99, cycleLength: 2 },
    Hard: { base: 8, exponent: 117, cycleLength: 4 },
  } as const;
  const values = { ...sets[difficulty] };
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
