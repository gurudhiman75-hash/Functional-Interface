import type {
  DifficultyLabel,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import type {
  QuantScenarioContext,
} from "../quant/realization";
import {
  createReasoningStep,
  pickRandomItem,
} from "../shared";
import type { QuantProceduralScenario } from "./time-work-scenarios";

type InterestScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

function buildInterestContext(
  context = "simple-compound-interest",
  metric = "required value",
): QuantScenarioContext {
  return {
    entity: "principal",
    metric,
    context,
  };
}

export function createSimpleInterestScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { principal: 5000, rate: 10, time: 3 },
      { principal: 2400, rate: 5, time: 4 },
      { principal: 3600, rate: 12, time: 2 },
    ],
    Medium: [
      { principal: 6400, rate: 12.5, time: 3 },
      { principal: 7200, rate: 8, time: 5 },
      { principal: 8400, rate: 10, time: 4 },
    ],
    Hard: [
      { principal: 9600, rate: 7.5, time: 4 },
      { principal: 12500, rate: 12, time: 3 },
      { principal: 14400, rate: 6.25, time: 5 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const correctAnswer =
    (values.principal *
      values.rate *
      values.time) /
    100;

  return {
    scenarioType:
      "linear-interest-accumulation",
    topicCluster: "si-ci",
    values,
    formula:
      "(principal * rate * time) / 100",
    text: `Find the simple interest on Rs. ${values.principal} at ${values.rate}% per annum for ${values.time} years.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Use SI = (P x R x T) / 100.`,
      ),
      createReasoningStep(
        "infer",
        `SI = (${values.principal} x ${values.rate} x ${values.time}) / 100 = ${correctAnswer}.`,
      ),
    ],
    context: buildInterestContext(
      "simple interest",
      "simple interest",
    ),
  };
}

export function createCompoundInterestScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { principal: 1000, rate: 10, years: 2 },
      { principal: 5000, rate: 20, years: 2 },
      { principal: 8000, rate: 5, years: 2 },
    ],
    Medium: [
      { principal: 2500, rate: 12, years: 3 },
      { principal: 4000, rate: 10, years: 3 },
      { principal: 6400, rate: 25, years: 2 },
    ],
    Hard: [
      { principal: 7200, rate: 12.5, years: 3 },
      { principal: 9600, rate: 20, years: 3 },
      { principal: 12500, rate: 8, years: 4 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const amount =
    values.principal *
    (1 + values.rate / 100) **
      values.years;
  const correctAnswer =
    amount - values.principal;

  return {
    scenarioType:
      "multiplicative-growth",
    topicCluster: "si-ci",
    values: {
      ...values,
      amount,
    },
    formula: "amount - principal",
    text: `Find the compound interest on Rs. ${values.principal} at ${values.rate}% per annum for ${values.years} years, compounded annually.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Use A = P(1 + R/100)^T.`,
      ),
      createReasoningStep(
        "aggregate",
        `Amount = ${values.principal}(1 + ${values.rate}/100)^${values.years} = ${amount}.`,
      ),
      createReasoningStep(
        "infer",
        `Compound interest = ${amount} - ${values.principal} = ${correctAnswer}.`,
      ),
    ],
    context: buildInterestContext(
      "compound interest",
      "compound interest",
    ),
  };
}

export function createSiVsCiDifferenceScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Medium: [
      { principal: 1000, rate: 10 },
      { principal: 2500, rate: 12 },
      { principal: 4000, rate: 5 },
    ],
    Hard: [
      { principal: 5000, rate: 20 },
      { principal: 8000, rate: 10 },
      { principal: 9600, rate: 12.5 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(
      difficulty === "Hard"
        ? sets.Hard
        : sets.Medium,
    ),
  };
  const correctAnswer =
    (values.principal *
      values.rate *
      values.rate) /
    10000;

  return {
    scenarioType:
      "interest-on-interest-detection",
    topicCluster: "si-ci",
    values,
    formula:
      "(principal * rate * rate) / 10000",
    text: `Find the difference between compound interest and simple interest on Rs. ${values.principal} at ${values.rate}% per annum for 2 years.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `For 2 years, CI - SI equals the interest on first year's interest.`,
      ),
      createReasoningStep(
        "infer",
        `Difference = P x R^2 / 10000 = ${correctAnswer}.`,
      ),
    ],
    context: buildInterestContext(
      "si-ci difference",
      "difference",
    ),
  };
}

export function createFractionalCompoundingScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const halfYearlySets = {
    Medium: [
      { principal: 4000, rate: 10, years: 2, periods: 4, periodLabel: "half-yearly" },
      { principal: 5000, rate: 12, years: 1, periods: 2, periodLabel: "half-yearly" },
      { principal: 8000, rate: 20, years: 1, periods: 2, periodLabel: "half-yearly" },
    ],
    Hard: [
      { principal: 6400, rate: 10, years: 2, periods: 8, periodLabel: "quarterly" },
      { principal: 10000, rate: 12, years: 1, periods: 4, periodLabel: "quarterly" },
      { principal: 12500, rate: 8, years: 2, periods: 8, periodLabel: "quarterly" },
    ],
  } as const;
  const values = {
    ...pickRandomItem(
      difficulty === "Hard"
        ? halfYearlySets.Hard
        : halfYearlySets.Medium,
    ),
  };
  const divisor =
    values.periodLabel === "half-yearly"
      ? 2
      : 4;
  const periodicRate =
    values.rate / divisor;
  const amount =
    values.principal *
    (1 + periodicRate / 100) **
      values.periods;
  const correctAnswer = amount;

  return {
    scenarioType:
      "effective-period-transformation",
    topicCluster: "si-ci",
    values: {
      ...values,
      periodicRate,
      amount,
    },
    formula: "amount",
    text: `A sum of Rs. ${values.principal} is invested at ${values.rate}% per annum for ${values.years} year${values.years > 1 ? "s" : ""}, compounded ${values.periodLabel}. Find the amount.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Adjust both the rate and the number of periods for ${values.periodLabel} compounding.`,
      ),
      createReasoningStep(
        "aggregate",
        `Periodic rate = ${periodicRate}% and total periods = ${values.periods}.`,
      ),
      createReasoningStep(
        "infer",
        `Amount = ${values.principal}(1 + ${periodicRate}/100)^${values.periods} = ${amount}.`,
      ),
    ],
    context: buildInterestContext(
      "fractional compounding",
      "amount",
    ),
  };
}

export function createDecayScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { principal: 50000, rate: 10, years: 2, asset: "machine" },
      { principal: 40000, rate: 5, years: 3, asset: "car" },
      { principal: 80000, rate: 20, years: 2, asset: "equipment" },
    ],
    Medium: [
      { principal: 60000, rate: 12.5, years: 2, asset: "machine" },
      { principal: 72000, rate: 10, years: 3, asset: "vehicle" },
      { principal: 96000, rate: 5, years: 4, asset: "asset" },
    ],
    Hard: [
      { principal: 125000, rate: 10, years: 4, asset: "machine" },
      { principal: 144000, rate: 12.5, years: 3, asset: "equipment" },
      { principal: 160000, rate: 20, years: 3, asset: "vehicle" },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const correctAnswer =
    values.principal *
    (1 - values.rate / 100) **
      values.years;

  return {
    scenarioType: "compound-decay",
    topicCluster: "si-ci",
    values,
    formula:
      "principal * (1 - rate / 100) ** years",
    text: `A ${values.asset} worth Rs. ${values.principal} depreciates by ${values.rate}% every year. Find its value after ${values.years} years.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Use the yearly decay multiplier 1 - ${values.rate}/100.`,
      ),
      createReasoningStep(
        "infer",
        `Value after ${values.years} years = ${values.principal}(1 - ${values.rate}/100)^${values.years} = ${correctAnswer}.`,
      ),
    ],
    context: buildInterestContext(
      "depreciation",
      "final value",
    ),
  };
}

function createSimpleReverseReconstructionScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const easySets = [
    { amount: 5500, rate: 10, time: 1, principal: 5000 },
    { amount: 6900, rate: 15, time: 2, principal: 6000 },
    { amount: 4200, rate: 5, time: 2, principal: 4000 },
  ];

  const simpleSets = [
    { amount: 6900, rate: 10, time: 2, principal: 5750 },
    { amount: 8400, rate: 8, time: 5, principal: 7000 },
    { amount: 6210, rate: 15, time: 2, principal: 5400 },
  ];
  const values = {
    ...pickRandomItem(
      difficulty === "Easy"
        ? easySets
        : simpleSets,
    ),
  };

  return {
    scenarioType:
      "reverse-growth-reconstruction",
    topicCluster: "si-ci",
    values,
    formula: "principal",
    text: `A sum amounts to Rs. ${values.amount} in ${values.time} year${values.time > 1 ? "s" : ""} at ${values.rate}% simple interest per annum. Find the principal.`,
    correctAnswer: values.principal,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Under simple interest, amount = principal x (1 + R x T / 100).`,
      ),
      createReasoningStep(
        "infer",
        `Principal = ${values.amount} / (1 + ${values.rate} x ${values.time} / 100) = ${values.principal}.`,
      ),
    ],
    context: buildInterestContext(
      "reverse reconstruction",
      "principal",
    ),
  };
}

function createCompoundReverseReconstructionScenario(): QuantProceduralScenario {
  const compoundSets = [
    { amount: 6050, rate: 10, years: 2, principal: 5000 },
    { amount: 12500, rate: 25, years: 2, principal: 8000 },
    { amount: 8640, rate: 20, years: 2, principal: 6000 },
  ];

  const values = {
    ...pickRandomItem(compoundSets),
  };

  return {
    scenarioType:
      "reverse-growth-reconstruction",
    topicCluster: "si-ci",
    values,
    formula: "principal",
    text: `A sum amounts to Rs. ${values.amount} in ${values.years} years at ${values.rate}% compound interest per annum. Find the principal.`,
    correctAnswer: values.principal,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Under compound interest, amount = principal x (1 + R/100)^T.`,
      ),
      createReasoningStep(
        "infer",
        `Principal = ${values.amount} / (1 + ${values.rate}/100)^${values.years} = ${values.principal}.`,
      ),
    ],
    context: buildInterestContext(
      "reverse reconstruction",
      "principal",
    ),
  };
}

export function createReverseReconstructionScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  return difficulty === "Hard"
    ? createCompoundReverseReconstructionScenario()
    : createSimpleReverseReconstructionScenario(
      difficulty,
    );
}

export function createMultiStageGrowthScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Medium: [
      { principal: 5000, rate1: 10, rate2: 20 },
      { principal: 8000, rate1: 20, rate2: 10 },
      { principal: 12000, rate1: 5, rate2: 10 },
    ],
    Hard: [
      { principal: 10000, rate1: 10, rate2: 20, rate3: 10 },
      { principal: 16000, rate1: 12.5, rate2: 10, rate3: 20 },
      { principal: 20000, rate1: 20, rate2: 10, rate3: 5 },
    ],
  } as const;

  if (difficulty === "Hard") {
    const values = {
      ...pickRandomItem(sets.Hard),
    };
    const multiplier =
      (1 + values.rate1 / 100) *
      (1 + values.rate2 / 100) *
      (1 + values.rate3 / 100);
    const correctAnswer =
      values.principal * multiplier;

    return {
      scenarioType:
        "equivalent-multiplier-compression",
      topicCluster: "si-ci",
      values: {
        ...values,
        multiplier,
      },
      formula:
        "principal * multiplier",
      text: `A sum of Rs. ${values.principal} is invested at compound interest. The annual rates for three successive years are ${values.rate1}%, ${values.rate2}%, and ${values.rate3}%. Find the final amount.`,
      correctAnswer,
      distractorHints: [
        "wrongIntermediateValue",
        "arithmeticSlip",
      ],
      reasoningSteps: [
        createReasoningStep(
          "transform",
          `Multiply the three yearly growth factors instead of adding the rates.`,
        ),
        createReasoningStep(
          "aggregate",
          `Net multiplier = (1 + ${values.rate1}/100)(1 + ${values.rate2}/100)(1 + ${values.rate3}/100) = ${multiplier}.`,
        ),
        createReasoningStep(
          "infer",
          `Final amount = ${values.principal} x ${multiplier} = ${correctAnswer}.`,
        ),
      ],
      context: buildInterestContext(
        "multi-stage growth",
        "final amount",
      ),
    };
  }

  const values = {
    ...pickRandomItem(sets.Medium),
  };
  const multiplier =
    (1 + values.rate1 / 100) *
    (1 + values.rate2 / 100);
  const correctAnswer =
    values.principal * multiplier;

  return {
    scenarioType:
      "comparative-interest-systems",
    topicCluster: "si-ci",
    values: {
      ...values,
      multiplier,
    },
    formula: "principal * multiplier",
    text: `A sum of Rs. ${values.principal} is invested at compound interest. The rate is ${values.rate1}% for the first year and ${values.rate2}% for the second year. Find the amount after 2 years.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Use successive yearly multipliers instead of averaging the rates.`,
      ),
      createReasoningStep(
        "infer",
        `Amount = ${values.principal}(1 + ${values.rate1}/100)(1 + ${values.rate2}/100) = ${correctAnswer}.`,
      ),
    ],
    context: buildInterestContext(
      "comparative growth",
      "amount",
    ),
  };
}

export function createSimpleCompoundInterestScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const scenarioFactoriesByMotif: Record<
    string,
    InterestScenarioFactory[]
  > = {
    "linear-interest-accumulation": [
      createSimpleInterestScenario,
    ],
    "multiplicative-growth": [
      createCompoundInterestScenario,
      createMultiStageGrowthScenario,
    ],
    "interest-on-interest-detection": [
      createSiVsCiDifferenceScenario,
    ],
    "effective-period-transformation": [
      createFractionalCompoundingScenario,
    ],
    "compound-decay": [
      createDecayScenario,
    ],
    "reverse-growth-reconstruction": [
      createReverseReconstructionScenario,
    ],
    "equivalent-multiplier-compression": [
      createMultiStageGrowthScenario,
    ],
    "comparative-interest-systems": [
      createSiVsCiDifferenceScenario,
      createMultiStageGrowthScenario,
    ],
    "interest-period-trap": [
      createFractionalCompoundingScenario,
      createCompoundInterestScenario,
    ],
    "compounding-trap": [
      createCompoundInterestScenario,
      createFractionalCompoundingScenario,
    ],
    "interest-difference-backsolve": [
      createSiVsCiDifferenceScenario,
      createReverseReconstructionScenario,
    ],
  };

  const fallbackScenarios = [
    createSimpleInterestScenario,
    createCompoundInterestScenario,
    createSiVsCiDifferenceScenario,
    createFractionalCompoundingScenario,
    createDecayScenario,
    createReverseReconstructionScenario,
    createMultiStageGrowthScenario,
  ];

  const patternSpecificScenarios: Record<
    string,
    InterestScenarioFactory[]
  > = {
    "registry-simple-interest-easy": [
      createSimpleInterestScenario,
      createSimpleReverseReconstructionScenario,
    ],
    "registry-simple-interest-medium": [
      createSimpleInterestScenario,
      createSimpleReverseReconstructionScenario,
    ],
    "registry-simple-interest-hard": [
      createSimpleInterestScenario,
      createSimpleReverseReconstructionScenario,
    ],
    "registry-compound-interest-medium": [
      createCompoundInterestScenario,
      createSiVsCiDifferenceScenario,
    ],
    "registry-compound-interest-hard": [
      createCompoundInterestScenario,
      createSiVsCiDifferenceScenario,
      createMultiStageGrowthScenario,
    ],
    "registry-interest-si-vs-ci-medium": [
      createSiVsCiDifferenceScenario,
    ],
    "registry-interest-si-vs-ci-hard": [
      createSiVsCiDifferenceScenario,
      createMultiStageGrowthScenario,
    ],
    "registry-interest-fractional-compounding-medium": [
      createFractionalCompoundingScenario,
    ],
    "registry-interest-fractional-compounding-hard": [
      createFractionalCompoundingScenario,
    ],
    "registry-interest-growth-decay-medium": [
      createDecayScenario,
      createCompoundInterestScenario,
    ],
    "registry-interest-growth-decay-hard": [
      createDecayScenario,
      createMultiStageGrowthScenario,
    ],
  };

  const scenarioFactories =
    motif?.id &&
    !patternSpecificScenarios[pattern.id]
      ? scenarioFactoriesByMotif[
          motif.id
        ] ?? fallbackScenarios
      : patternSpecificScenarios[
          pattern.id
        ] ?? fallbackScenarios;

  return pickRandomItem(
    scenarioFactories,
  )(difficulty, motif);
}
