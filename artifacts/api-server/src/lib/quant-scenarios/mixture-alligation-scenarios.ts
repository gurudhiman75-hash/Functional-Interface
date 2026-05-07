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

type MixtureScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

function buildMixtureContext(
  context = "mixture",
  metric = "required value",
): QuantScenarioContext {
  return {
    entity: "mixture",
    metric,
    context,
  };
}

export function createWeightedContributionScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        q1: 4,
        v1: 20,
        q2: 6,
        v2: 30,
      },
      {
        q1: 3,
        v1: 15,
        q2: 5,
        v2: 25,
      },
      {
        q1: 5,
        v1: 40,
        q2: 5,
        v2: 60,
      },
    ],
    Medium: [
      {
        q1: 7,
        v1: 18,
        q2: 9,
        v2: 26,
      },
      {
        q1: 8,
        v1: 25,
        q2: 12,
        v2: 35,
      },
      {
        q1: 6,
        v1: 32,
        q2: 14,
        v2: 20,
      },
    ],
    Hard: [
      {
        q1: 9,
        v1: 24,
        q2: 15,
        v2: 36,
      },
      {
        q1: 11,
        v1: 28,
        q2: 13,
        v2: 40,
      },
      {
        q1: 12,
        v1: 30,
        q2: 18,
        v2: 22,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const totalValue =
    values.q1 * values.v1 +
    values.q2 * values.v2;
  const totalQuantity =
    values.q1 + values.q2;
  const correctAnswer =
    totalValue / totalQuantity;

  return {
    scenarioType:
      "weighted-contribution",
    topicCluster:
      "mixture-alligation",
    values: {
      ...values,
      totalValue,
      totalQuantity,
    },
    formula:
      "totalValue / totalQuantity",
    text: `${values.q1} litres of a solution of strength ${values.v1}% is mixed with ${values.q2} litres of a solution of strength ${values.v2}%. Find the strength of the final mixture.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `Compute the weighted total: ${values.q1} x ${values.v1} + ${values.q2} x ${values.v2} = ${totalValue}.`,
      ),
      createReasoningStep(
        "infer",
        `Final strength = ${totalValue} / ${totalQuantity} = ${correctAnswer}%.`,
      ),
    ],
    context: buildMixtureContext(
      "weighted blending",
      "final strength",
    ),
  };
}

export function createAlligationScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        low: 20,
        high: 30,
        mean: 24,
      },
      {
        low: 15,
        high: 25,
        mean: 20,
      },
      {
        low: 40,
        high: 60,
        mean: 48,
      },
    ],
    Medium: [
      {
        low: 18,
        high: 30,
        mean: 22,
      },
      {
        low: 24,
        high: 36,
        mean: 28,
      },
      {
        low: 35,
        high: 50,
        mean: 41,
      },
    ],
    Hard: [
      {
        low: 28,
        high: 44,
        mean: 34,
      },
      {
        low: 32,
        high: 56,
        mean: 41,
      },
      {
        low: 22,
        high: 40,
        mean: 31,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const ratioA =
    values.high - values.mean;
  const ratioB =
    values.mean - values.low;
  const correctAnswer =
    ratioA + ratioB;

  return {
    scenarioType:
      "inverse-distance-balancing",
    topicCluster:
      "mixture-alligation",
    values: {
      ...values,
      ratioA,
      ratioB,
    },
    formula: "ratioA + ratioB",
    text: `A variety costing Rs. ${values.low} per kg is mixed with another variety costing Rs. ${values.high} per kg. If the required mixing ratio is p:q so that the mean price becomes Rs. ${values.mean} per kg, find p + q.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "compare",
        `By alligation, take the cross differences: ${values.high} - ${values.mean} = ${ratioA} and ${values.mean} - ${values.low} = ${ratioB}.`,
      ),
      createReasoningStep(
        "infer",
        `Required ratio = ${ratioA}:${ratioB}.`,
      ),
    ],
    explanation: `By alligation, the required ratio is (${values.high} - ${values.mean}) : (${values.mean} - ${values.low}) = ${ratioA}:${ratioB}. Hence p + q = ${correctAnswer}.`,
    context: buildMixtureContext(
      "alligation",
      "mixing ratio",
    ),
  };
}

export function createCompositionStateScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        volume: 40,
        milkPercent: 100,
        removed: 10,
      },
      {
        volume: 32,
        milkPercent: 100,
        removed: 8,
      },
      {
        volume: 30,
        milkPercent: 100,
        removed: 6,
      },
    ],
    Medium: [
      {
        volume: 50,
        milkPercent: 100,
        removed: 10,
      },
      {
        volume: 60,
        milkPercent: 100,
        removed: 12,
      },
      {
        volume: 45,
        milkPercent: 100,
        removed: 9,
      },
    ],
    Hard: [
      {
        volume: 72,
        milkPercent: 100,
        removed: 12,
      },
      {
        volume: 80,
        milkPercent: 100,
        removed: 16,
      },
      {
        volume: 90,
        milkPercent: 100,
        removed: 15,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const remainingMilk =
    values.volume - values.removed;

  return {
    scenarioType:
      "composition-state-tracking",
    topicCluster:
      "mixture-alligation",
    values: {
      ...values,
      remainingMilk,
    },
    formula:
      "volume - removed",
    text: `A vessel contains ${values.volume} litres of pure milk. ${values.removed} litres of milk is removed and replaced with water. Find the quantity of milk in the new mixture.`,
    correctAnswer:
      remainingMilk,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `The removed ${values.removed} litres is pure milk, so milk quantity decreases by ${values.removed} litres.`,
      ),
      createReasoningStep(
        "infer",
        `Remaining milk = ${values.volume} - ${values.removed} = ${remainingMilk} litres.`,
      ),
    ],
    context: buildMixtureContext(
      "single replacement",
      "remaining pure quantity",
    ),
  };
}

export function createDecayScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Medium: [
      {
        volume: 54,
        replaced: 18,
        repetitions: 2,
      },
      {
        volume: 64,
        replaced: 16,
        repetitions: 2,
      },
      {
        volume: 81,
        replaced: 27,
        repetitions: 2,
      },
    ],
    Hard: [
      {
        volume: 64,
        replaced: 16,
        repetitions: 3,
      },
      {
        volume: 125,
        replaced: 25,
        repetitions: 3,
      },
      {
        volume: 96,
        replaced: 24,
        repetitions: 3,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(
      difficulty === "Hard"
        ? sets.Hard
        : sets.Medium,
    ),
  };
  const fraction =
    1 - values.replaced / values.volume;
  const remainingMilk =
    values.volume *
    fraction ** values.repetitions;

  return {
    scenarioType:
      "concentration-decay",
    topicCluster:
      "mixture-alligation",
    values: {
      ...values,
      fraction,
    },
    formula:
      "volume * fraction ** repetitions",
    text: `A vessel contains ${values.volume} litres of pure milk. ${values.replaced} litres is removed and replaced with water. If this process is repeated ${values.repetitions} times, find the quantity of milk left in the vessel.`,
    correctAnswer:
      remainingMilk,
    distractorHints: [
      "wrongIntermediateValue",
      "cumulativeMistake",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Each replacement retains the fraction 1 - ${values.replaced}/${values.volume} = ${fraction} of the milk.`,
      ),
      createReasoningStep(
        "infer",
        `Remaining milk = ${values.volume} x (${fraction})^${values.repetitions} = ${remainingMilk}.`,
      ),
    ],
    context: buildMixtureContext(
      "repeated replacement",
      "remaining pure quantity",
    ),
  };
}

export function createRatioReconstructionScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        low: 20,
        high: 30,
        mean: 24,
      },
      {
        low: 12,
        high: 24,
        mean: 18,
      },
      {
        low: 40,
        high: 60,
        mean: 50,
      },
    ],
    Medium: [
      {
        low: 10,
        high: 25,
        mean: 19,
      },
      {
        low: 30,
        high: 45,
        mean: 39,
      },
      {
        low: 24,
        high: 36,
        mean: 33,
      },
    ],
    Hard: [
      {
        low: 18,
        high: 42,
        mean: 30,
      },
      {
        low: 22,
        high: 58,
        mean: 40,
      },
      {
        low: 28,
        high: 52,
        mean: 37,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const ratioLow =
    values.high - values.mean;
  const ratioHigh =
    values.mean - values.low;
  const correctAnswer =
    ratioLow + ratioHigh;

  return {
    scenarioType:
      "ratio-reconstruction",
    topicCluster:
      "mixture-alligation",
    values: {
      ...values,
      ratioLow,
      ratioHigh,
    },
    formula:
      "ratioLow + ratioHigh",
    text: `A ${values.low}% solution is mixed with a ${values.high}% solution to obtain a ${values.mean}% solution. If the required ratio is p:q, find p + q.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "compare",
        `Use inverse distance from the mean: ${values.high} - ${values.mean} = ${ratioLow} and ${values.mean} - ${values.low} = ${ratioHigh}.`,
      ),
      createReasoningStep(
        "infer",
        `Required ratio = ${ratioLow}:${ratioHigh}.`,
      ),
    ],
    explanation: `By alligation, the required ratio is ${ratioLow}:${ratioHigh}. Hence p + q = ${correctAnswer}.`,
    context: buildMixtureContext(
      "ratio mixing",
      "mixing ratio",
    ),
  };
}

export function createCostBlendScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        low: 20,
        high: 30,
        mean: 24,
      },
      {
        low: 15,
        high: 25,
        mean: 20,
      },
      {
        low: 40,
        high: 60,
        mean: 48,
      },
    ],
    Medium: [
      {
        low: 18,
        high: 28,
        mean: 24,
      },
      {
        low: 25,
        high: 40,
        mean: 34,
      },
      {
        low: 30,
        high: 45,
        mean: 39,
      },
    ],
    Hard: [
      {
        low: 28,
        high: 44,
        mean: 36,
      },
      {
        low: 32,
        high: 56,
        mean: 44,
      },
      {
        low: 36,
        high: 60,
        mean: 48,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const ratioCheap =
    values.high - values.mean;
  const ratioCostly =
    values.mean - values.low;
  const correctAnswer =
    ratioCheap + ratioCostly;

  return {
    scenarioType:
      "cost-profit-blend",
    topicCluster:
      "mixture-alligation",
    values: {
      ...values,
      ratioCheap,
      ratioCostly,
    },
    formula:
      "ratioCheap + ratioCostly",
    text: `Tea costing Rs. ${values.low} per kg is mixed with tea costing Rs. ${values.high} per kg. If the required ratio is p:q so that the blended cost becomes Rs. ${values.mean} per kg, find p + q.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "compare",
        `Apply alligation on costs: ${values.high} - ${values.mean} = ${ratioCheap} and ${values.mean} - ${values.low} = ${ratioCostly}.`,
      ),
      createReasoningStep(
        "infer",
        `Required mixing ratio = ${ratioCheap}:${ratioCostly}.`,
      ),
    ],
    explanation: `By weighted blending and alligation, the required ratio is ${ratioCheap}:${ratioCostly}. Hence p + q = ${correctAnswer}.`,
    context: buildMixtureContext(
      "cost blending",
      "mixing ratio",
    ),
  };
}

export function createMultiPhasePurityScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Hard: [
      {
        volume: 64,
        firstRemove: 16,
        secondRemove: 16,
      },
      {
        volume: 81,
        firstRemove: 27,
        secondRemove: 27,
      },
      {
        volume: 125,
        firstRemove: 25,
        secondRemove: 25,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets.Hard),
  };
  const afterFirst =
    values.volume - values.firstRemove;
  const afterSecond =
    afterFirst *
    (1 - values.secondRemove / values.volume);

  return {
    scenarioType:
      "multi-phase-purity-transition",
    topicCluster:
      "mixture-alligation",
    values: {
      ...values,
      afterFirst,
    },
    formula:
      "afterSecond",
    text: `A vessel contains ${values.volume} litres of pure milk. ${values.firstRemove} litres is removed and replaced with water. The process is repeated once more with ${values.secondRemove} litres. Find the quantity of milk left in the vessel.`,
    correctAnswer:
      afterSecond,
    distractorHints: [
      "wrongIntermediateValue",
      "cumulativeMistake",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `After the first replacement, milk left = ${values.volume} x (1 - ${values.firstRemove}/${values.volume}) = ${afterFirst}.`,
      ),
      createReasoningStep(
        "infer",
        `Apply the same retention factor once more: remaining milk = ${afterSecond}.`,
      ),
    ],
    context: buildMixtureContext(
      "multi-stage replacement",
      "remaining pure quantity",
    ),
  };
}

export function createMixtureAlligationScenario(
  _pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const scenarioFactoriesByMotif: Record<
    string,
    MixtureScenarioFactory[]
  > = {
    "weighted-contribution": [
      createWeightedContributionScenario,
    ],
    "inverse-distance-balancing": [
      createAlligationScenario,
      createRatioReconstructionScenario,
      createCostBlendScenario,
    ],
    "composition-state-tracking": [
      createCompositionStateScenario,
    ],
    "concentration-decay": [
      createDecayScenario,
    ],
    "ratio-reconstruction": [
      createRatioReconstructionScenario,
    ],
    "cost-profit-blend": [
      createCostBlendScenario,
    ],
    "multi-phase-purity-transition": [
      createMultiPhasePurityScenario,
    ],
    "mixture-weighted-average": [
      createWeightedContributionScenario,
    ],
    "weighted-mixture-shift": [
      createWeightedContributionScenario,
    ],
    "replacement-alligation": [
      createCompositionStateScenario,
      createDecayScenario,
    ],
  };

  const fallbackScenarios = [
    createWeightedContributionScenario,
    createAlligationScenario,
    createCompositionStateScenario,
    createDecayScenario,
    createRatioReconstructionScenario,
    createCostBlendScenario,
    createMultiPhasePurityScenario,
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
