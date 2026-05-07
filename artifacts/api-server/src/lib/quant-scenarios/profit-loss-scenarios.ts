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

type ProfitLossScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

function buildProfitLossContext(
  context = "profit-loss",
  metric = "required value",
): QuantScenarioContext {
  return {
    entity: "article",
    metric,
    context,
  };
}

export function createDirectProfitLossScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { cp: 500, sp: 650 },
      { cp: 400, sp: 460 },
      { cp: 800, sp: 720 },
    ],
    Medium: [
      { cp: 1200, sp: 1500 },
      { cp: 900, sp: 1080 },
      { cp: 1500, sp: 1320 },
    ],
    Hard: [
      { cp: 1600, sp: 2000 },
      { cp: 1250, sp: 1500 },
      { cp: 1800, sp: 1620 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const delta =
    values.sp - values.cp;
  const correctAnswer =
    (Math.abs(delta) / values.cp) *
    100;
  const isProfit = delta >= 0;

  return {
    scenarioType:
      "base-percentage-transformation",
    topicCluster: "profit-loss",
    values: {
      ...values,
      delta,
    },
    formula:
      "(Math.abs(delta) / cp) * 100",
    text: `An article is bought for Rs. ${values.cp} and sold for Rs. ${values.sp}. Find the ${isProfit ? "profit" : "loss"} percentage.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `${isProfit ? "Profit" : "Loss"} = ${Math.abs(delta)}.`,
      ),
      createReasoningStep(
        "infer",
        `${isProfit ? "Profit" : "Loss"}% = (${Math.abs(delta)}/${values.cp}) x 100 = ${correctAnswer}%.`,
      ),
    ],
    context: buildProfitLossContext(
      "direct profit-loss",
      `${isProfit ? "profit" : "loss"} percentage`,
    ),
  };
}

export function createDiscountScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { mp: 1000, discount: 20 },
      { mp: 800, discount: 10 },
      { mp: 1200, discount: 25 },
    ],
    Medium: [
      { mp: 1800, discount: 15 },
      { mp: 2400, discount: 12.5 },
      { mp: 1500, discount: 20 },
    ],
    Hard: [
      { mp: 3200, discount: 18.75 },
      { mp: 2800, discount: 22.5 },
      { mp: 3600, discount: 16.67 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const correctAnswer =
    values.mp *
    (1 - values.discount / 100);

  return {
    scenarioType: "hidden-base-tracking",
    topicCluster: "profit-loss",
    values,
    formula:
      "mp * (1 - discount / 100)",
    text: `The marked price of an article is Rs. ${values.mp}. A discount of ${values.discount}% is allowed. Find the selling price.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Selling price = Marked price x (100 - discount)% of marked price.`,
      ),
      createReasoningStep(
        "infer",
        `Selling price = ${values.mp} x (1 - ${values.discount}/100) = ${correctAnswer}.`,
      ),
    ],
    context: buildProfitLossContext(
      "discount",
      "selling price",
    ),
  };
}

export function createSuccessiveDiscountScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { a: 20, b: 10 },
      { a: 10, b: 10 },
      { a: 25, b: 20 },
    ],
    Medium: [
      { a: 20, b: 15 },
      { a: 25, b: 10 },
      { a: 30, b: 20 },
    ],
    Hard: [
      { a: 12.5, b: 20 },
      { a: 25, b: 12.5 },
      { a: 33.33, b: 10 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const netMultiplier =
    (1 - values.a / 100) *
    (1 - values.b / 100);
  const correctAnswer =
    (1 - netMultiplier) * 100;

  return {
    scenarioType:
      "multiplicative-percentage-chaining",
    topicCluster: "profit-loss",
    values: {
      ...values,
      netMultiplier,
    },
    formula:
      "(1 - ((1 - a / 100) * (1 - b / 100))) * 100",
    text: `Two successive discounts of ${values.a}% and ${values.b}% are allowed on an article. Find the equivalent discount percentage.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Use successive multipliers: (1 - ${values.a}/100)(1 - ${values.b}/100) = ${netMultiplier}.`,
      ),
      createReasoningStep(
        "infer",
        `Equivalent discount = (1 - ${netMultiplier}) x 100 = ${correctAnswer}%.`,
      ),
    ],
    context: buildProfitLossContext(
      "successive discount",
      "equivalent discount",
    ),
  };
}

export function createDishonestDealerScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Medium: [
      { falseWeight: 900 },
      { falseWeight: 950 },
      { falseWeight: 800 },
    ],
    Hard: [
      { falseWeight: 900 },
      { falseWeight: 850 },
      { falseWeight: 800 },
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
    ((1000 - values.falseWeight) /
      values.falseWeight) *
    100;

  return {
    scenarioType:
      "quantity-manipulation-profit",
    topicCluster: "profit-loss",
    values,
    formula:
      "((1000 - falseWeight) / falseWeight) * 100",
    text: `A shopkeeper sells goods by using a weight of ${values.falseWeight} g instead of 1 kg while charging the price of 1 kg. Find his profit percentage.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `He charges for 1000 g but gives only ${values.falseWeight} g.`,
      ),
      createReasoningStep(
        "infer",
        `Profit% = ((1000 - ${values.falseWeight}) / ${values.falseWeight}) x 100 = ${correctAnswer}%.`,
      ),
    ],
    context: buildProfitLossContext(
      "dishonest dealer",
      "profit percentage",
    ),
  };
}

export function createMarkupDiscountScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { markup: 25, discount: 10 },
      { markup: 20, discount: 10 },
      { markup: 50, discount: 20 },
    ],
    Medium: [
      { markup: 30, discount: 20 },
      { markup: 40, discount: 25 },
      { markup: 25, discount: 12.5 },
    ],
    Hard: [
      { markup: 33.33, discount: 20 },
      { markup: 50, discount: 25 },
      { markup: 25, discount: 20 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const netMultiplier =
    (1 + values.markup / 100) *
    (1 - values.discount / 100);
  const correctAnswer =
    (netMultiplier - 1) * 100;

  return {
    scenarioType:
      "markup-discount-compression",
    topicCluster: "profit-loss",
    values: {
      ...values,
      netMultiplier,
    },
    formula:
      "((1 + markup / 100) * (1 - discount / 100) - 1) * 100",
    text: `A trader marks an article ${values.markup}% above the cost price and allows a discount of ${values.discount}% on the marked price. Find the profit percentage.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Net multiplier on cost price = (1 + ${values.markup}/100)(1 - ${values.discount}/100) = ${netMultiplier}.`,
      ),
      createReasoningStep(
        "infer",
        `Profit% = (${netMultiplier} - 1) x 100 = ${correctAnswer}%.`,
      ),
    ],
    context: buildProfitLossContext(
      "markup-discount",
      "profit percentage",
    ),
  };
}

export function createEquivalentChangeScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { a: 20, b: -20 },
      { a: 10, b: -10 },
      { a: 25, b: -20 },
    ],
    Medium: [
      { a: 20, b: -10 },
      { a: 30, b: -20 },
      { a: 25, b: -25 },
    ],
    Hard: [
      { a: 12.5, b: -20 },
      { a: 33.33, b: -25 },
      { a: 40, b: -20 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const netMultiplier =
    (1 + values.a / 100) *
    (1 + values.b / 100);
  const changePercent =
    (netMultiplier - 1) * 100;
  const correctAnswer =
    Math.abs(changePercent);
  const effect =
    changePercent >= 0
      ? "increase"
      : "decrease";

  return {
    scenarioType:
      "equivalent-change-reduction",
    topicCluster: "profit-loss",
    values: {
      ...values,
      netMultiplier,
    },
    formula:
      "Math.abs(((1 + a / 100) * (1 + b / 100) - 1) * 100)",
    text: `The price of an article is first ${values.a >= 0 ? "increased" : "decreased"} by ${Math.abs(values.a)}% and then ${values.b >= 0 ? "increased" : "decreased"} by ${Math.abs(values.b)}%. Find the net ${effect} percentage.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Use successive multipliers: (1 + ${values.a}/100)(1 + ${values.b}/100) = ${netMultiplier}.`,
      ),
      createReasoningStep(
        "infer",
        `Net effect = ${correctAnswer}% ${effect}.`,
      ),
    ],
    context: buildProfitLossContext(
      "equivalent change",
      `net ${effect} percentage`,
    ),
  };
}

export function createRatioProfitScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      { sp: 5, cp: 4 },
      { sp: 6, cp: 5 },
      { sp: 4, cp: 3 },
    ],
    Medium: [
      { sp: 9, cp: 8 },
      { sp: 8, cp: 7 },
      { sp: 7, cp: 6 },
    ],
    Hard: [
      { sp: 12, cp: 9 },
      { sp: 15, cp: 12 },
      { sp: 16, cp: 14 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const correctAnswer =
    ((values.sp - values.cp) /
      values.cp) *
    100;

  return {
    scenarioType:
      "ratio-based-profit-reconstruction",
    topicCluster: "profit-loss",
    values,
    formula:
      "((sp - cp) / cp) * 100",
    text: `If the ratio of selling price to cost price of an article is ${values.sp}:${values.cp}, find the profit percentage.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Assume SP = ${values.sp} and CP = ${values.cp}.`,
      ),
      createReasoningStep(
        "infer",
        `Profit% = (${values.sp - values.cp}/${values.cp}) x 100 = ${correctAnswer}%.`,
      ),
    ],
    context: buildProfitLossContext(
      "ratio-based reconstruction",
      "profit percentage",
    ),
  };
}

export function createMultiStageTradeScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Hard: [
      {
        cp: 800,
        markup: 25,
        discount: 10,
        extraExpense: 20,
      },
      {
        cp: 1200,
        markup: 20,
        discount: 15,
        extraExpense: 30,
      },
      {
        cp: 1500,
        markup: 30,
        discount: 20,
        extraExpense: 60,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets.Hard),
  };
  const mp =
    values.cp *
    (1 + values.markup / 100);
  const sp =
    mp *
    (1 - values.discount / 100);
  const effectiveCost =
    values.cp + values.extraExpense;
  const correctAnswer =
    ((sp - effectiveCost) /
      effectiveCost) *
    100;

  return {
    scenarioType:
      "multi-state-transaction-flow",
    topicCluster: "profit-loss",
    values: {
      ...values,
      mp,
      sp,
      effectiveCost,
    },
    formula:
      "((sp - effectiveCost) / effectiveCost) * 100",
    text: `An article costs Rs. ${values.cp}. It is marked up by ${values.markup}% and sold after allowing a discount of ${values.discount}%. If the trader also spends Rs. ${values.extraExpense} on transport, find the final profit percentage.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Marked price = ${values.cp} x (1 + ${values.markup}/100) = ${mp}. Selling price after discount = ${sp}.`,
      ),
      createReasoningStep(
        "aggregate",
        `Effective cost = ${values.cp} + ${values.extraExpense} = ${effectiveCost}.`,
      ),
      createReasoningStep(
        "infer",
        `Profit% = (${sp} - ${effectiveCost}) / ${effectiveCost} x 100 = ${correctAnswer}%.`,
      ),
    ],
    context: buildProfitLossContext(
      "multi-stage trade",
      "final profit percentage",
    ),
  };
}

export function createProfitLossScenario(
  _pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const scenarioFactoriesByMotif: Record<
    string,
    ProfitLossScenarioFactory[]
  > = {
    "base-percentage-transformation": [
      createDirectProfitLossScenario,
    ],
    "multiplicative-percentage-chaining": [
      createSuccessiveDiscountScenario,
      createEquivalentChangeScenario,
    ],
    "hidden-base-tracking": [
      createDiscountScenario,
    ],
    "quantity-manipulation-profit": [
      createDishonestDealerScenario,
    ],
    "markup-discount-compression": [
      createMarkupDiscountScenario,
    ],
    "equivalent-change-reduction": [
      createEquivalentChangeScenario,
    ],
    "ratio-based-profit-reconstruction": [
      createRatioProfitScenario,
    ],
    "multi-state-transaction-flow": [
      createMultiStageTradeScenario,
    ],
    "profit-discount-trap": [
      createMarkupDiscountScenario,
    ],
    "discount-profit-link": [
      createMarkupDiscountScenario,
      createDiscountScenario,
    ],
    "successive-discount-margin": [
      createSuccessiveDiscountScenario,
    ],
  };

  const fallbackScenarios = [
    createDirectProfitLossScenario,
    createDiscountScenario,
    createSuccessiveDiscountScenario,
    createDishonestDealerScenario,
    createMarkupDiscountScenario,
    createEquivalentChangeScenario,
    createRatioProfitScenario,
    createMultiStageTradeScenario,
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
