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

type RatioScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

function buildRatioContext(
  context = "ratio proportion",
  metric = "required value",
): QuantScenarioContext {
  return {
    entity: "parts",
    metric,
    context,
  };
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

function simplifyRatio(
  a: number,
  b: number,
): string {
  const factor = gcd(a, b);
  return `${a / factor}:${b / factor}`;
}

function createDirectDistributionScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const templates = {
    Easy: [
      { total: 300, a: 2, b: 3 },
      { total: 420, a: 3, b: 4 },
      { total: 540, a: 5, b: 7 },
    ],
    Medium: [
      { total: 720, a: 4, b: 5 },
      { total: 840, a: 5, b: 7 },
      { total: 990, a: 4, b: 7 },
    ],
    Hard: [
      { total: 1188, a: 5, b: 6 },
      { total: 1365, a: 6, b: 7 },
      { total: 1716, a: 7, b: 9 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(templates[difficulty]),
  };
  const correctAnswer =
    (values.total * values.a) /
    (values.a + values.b);

  return {
    scenarioType:
      "ratio-distribution-core",
    topicCluster: "ratio-proportion",
    values,
    formula:
      "(total * a) / (a + b)",
    text: `Divide ₹${values.total} between A and B in the ratio ${values.a}:${values.b}. Find A's share.`,
    correctAnswer,
    distractorHints: [
      "wrongDenominator",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `Total ratio parts = ${values.a} + ${values.b} = ${values.a + values.b}.`,
      ),
      createReasoningStep(
        "infer",
        `A's share = ₹${values.total} x ${values.a} / ${values.a + values.b} = ₹${correctAnswer}.`,
      ),
    ],
    context: buildRatioContext(
      "direct distribution",
      "share",
    ),
  };
}

function createBridgeUnificationScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const templates = {
    Medium: [
      {
        ratios: [2, 3, 4, 5, 6, 7],
        total: 210,
      },
      {
        ratios: [3, 5, 2, 3, 4, 7],
        total: 252,
      },
      {
        ratios: [4, 7, 3, 5, 2, 3],
        total: 288,
      },
    ],
    Hard: [
      {
        ratios: [2, 3, 4, 5, 6, 7],
        total: 525,
      },
      {
        ratios: [3, 4, 5, 6, 2, 3],
        total: 468,
      },
      {
        ratios: [5, 6, 3, 4, 4, 7],
        total: 594,
      },
    ],
  } as const;
  const template = pickRandomItem(
    difficulty === "Hard"
      ? templates.Hard
      : templates.Medium,
  );
  const [ab1, ab2, bc1, bc2, cd1, cd2] =
    template.ratios;
  const bLcm = ab2 * bc1;
  const cLcm = bc2 * cd1;
  const aPart = ab1 * bc1 * cd1;
  const bPart = ab2 * bc1 * cd1;
  const cPart = ab2 * bc2 * cd1;
  const dPart = ab2 * bc2 * cd2;
  const totalParts =
    aPart + bPart + cPart + dPart;
  const unit =
    template.total / totalParts;
  const correctAnswer = dPart * unit;

  return {
    scenarioType:
      "bridge-unification-nested",
    topicCluster: "ratio-proportion",
    values: {
      ab1,
      ab2,
      bc1,
      bc2,
      cd1,
      cd2,
      total: template.total,
      aPart,
      bPart,
      cPart,
      dPart,
      unit,
    },
    formula:
      "(total / totalParts) * dPart",
    text: `A:B = ${ab1}:${ab2}, B:C = ${bc1}:${bc2}, and C:D = ${cd1}:${cd2}. If A + B + C + D = ${template.total}, find D.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Unify the linked ratios to obtain A:B:C:D = ${aPart}:${bPart}:${cPart}:${dPart}.`,
      ),
      createReasoningStep(
        "aggregate",
        `Total parts = ${aPart + bPart + cPart + dPart}, so one part = ${template.total} / ${aPart + bPart + cPart + dPart} = ${unit}.`,
      ),
      createReasoningStep(
        "infer",
        `D = ${dPart} x ${unit} = ${correctAnswer}.`,
      ),
    ],
    context: buildRatioContext(
      "bridge ratio unification",
      "terminal value",
    ),
  };
}

function createCoinTransformScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const templates = {
    Easy: [
      {
        ratio: [2, 3, 5],
        denoms: [0.5, 1, 2],
        multiplier: 6,
        askIndex: 2,
      },
      {
        ratio: [3, 4, 5],
        denoms: [0.5, 1, 2],
        multiplier: 4,
        askIndex: 1,
      },
    ],
    Medium: [
      {
        ratio: [4, 5, 6],
        denoms: [1, 2, 5],
        multiplier: 3,
        askIndex: 0,
      },
      {
        ratio: [2, 5, 7],
        denoms: [0.5, 2, 5],
        multiplier: 4,
        askIndex: 2,
      },
    ],
    Hard: [
      {
        ratio: [3, 5, 7],
        denoms: [0.25, 0.5, 1],
        multiplier: 20,
        askIndex: 1,
      },
      {
        ratio: [4, 6, 9],
        denoms: [0.5, 1, 2],
        multiplier: 8,
        askIndex: 0,
      },
    ],
  } as const;
  const template = pickRandomItem(
    templates[difficulty],
  );
  const [r1, r2, r3] = template.ratio;
  const [d1, d2, d3] = template.denoms;
  const c1 = r1 * template.multiplier;
  const c2 = r2 * template.multiplier;
  const c3 = r3 * template.multiplier;
  const totalValue =
    c1 * d1 + c2 * d2 + c3 * d3;
  const counts = [c1, c2, c3];
  const labels =
    d1 === 0.25
      ? ["25p", "50p", "₹1"]
      : d1 === 0.5 && d2 === 1 && d3 === 2
        ? ["50p", "₹1", "₹2"]
        : ["₹1", "₹2", "₹5"];
  const correctAnswer =
    counts[template.askIndex];

  return {
    scenarioType:
      "transform-mapping-coins",
    topicCluster: "ratio-proportion",
    values: {
      r1,
      r2,
      r3,
      d1,
      d2,
      d3,
      counts,
      totalValue,
      askIndex: template.askIndex,
    },
    formula: "ratioPart * multiplier",
    text: `The number of ${labels[0]}, ${labels[1]}, and ${labels[2]} coins are in the ratio ${r1}:${r2}:${r3}. If their total value is ₹${totalValue}, find the number of ${labels[template.askIndex]} coins.`,
    correctAnswer,
    distractorHints: [
      "wrongDenominator",
      "wrongIntermediateValue",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Let the numbers of coins be ${r1}x, ${r2}x, and ${r3}x.`,
      ),
      createReasoningStep(
        "aggregate",
        `Total value = ${r1}x x ${d1} + ${r2}x x ${d2} + ${r3}x x ${d3} = ₹${totalValue}, so x = ${template.multiplier}.`,
      ),
      createReasoningStep(
        "infer",
        `Required number of ${labels[template.askIndex]} coins = ${template.ratio[template.askIndex]} x ${template.multiplier} = ${correctAnswer}.`,
      ),
    ],
    context: buildRatioContext(
      "coin transform",
      "coin count",
    ),
  };
}

function createInvariantDifferenceAgeScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const templates = {
    Medium: [
      {
        present: [3, 4],
        future: [5, 6],
        years: 8,
      },
      {
        present: [4, 5],
        future: [6, 7],
        years: 10,
      },
      {
        present: [5, 7],
        future: [7, 9],
        years: 12,
      },
    ],
    Hard: [
      {
        present: [3, 5],
        future: [5, 7],
        years: 14,
      },
      {
        present: [4, 7],
        future: [5, 8],
        years: 18,
      },
      {
        present: [5, 8],
        future: [7, 10],
        years: 15,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(
      difficulty === "Hard"
        ? templates.Hard
        : templates.Medium,
    ),
  };
  const presentGap =
    values.present[1] - values.present[0];
  const futureGap =
    values.future[1] - values.future[0];
  const youngerUnit =
    values.years /
    (values.future[0] / futureGap -
      values.present[0] / presentGap);
  const elderAge =
    (values.present[1] * youngerUnit) /
    presentGap;
  const youngerAge =
    (values.present[0] * youngerUnit) /
    presentGap;

  return {
    scenarioType:
      "invariant-difference-ages",
    topicCluster: "ratio-proportion",
    values: {
      ...values,
      youngerUnit,
      elderAge,
      youngerAge,
    },
    formula: "presentHigh * unit / presentGap",
    text: `The present ages of two persons are in the ratio ${values.present[0]}:${values.present[1]}. After ${values.years} years, their ages will be in the ratio ${values.future[0]}:${values.future[1]}. Find the present age of the elder person.`,
    correctAnswer: elderAge,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Present ages can be written as ${values.present[0]}x and ${values.present[1]}x; future ages as ${values.future[0]}y and ${values.future[1]}y.`,
      ),
      createReasoningStep(
        "compare",
        `The age difference remains constant, so ${presentGap}x = ${futureGap}y.`,
      ),
      createReasoningStep(
        "infer",
        `Using the ${values.years}-year shift gives the elder person's present age = ${elderAge}.`,
      ),
    ],
    context: buildRatioContext(
      "age ratio state shift",
      "elder age",
    ),
  };
}

function createDistributionConstraintScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const templates = {
    Medium: [
      {
        ratio: [3, 4, 5],
        offsets: [5, 10, 15],
        total: 150,
      },
      {
        ratio: [2, 3, 4],
        offsets: [10, 15, 20],
        total: 189,
      },
    ],
    Hard: [
      {
        ratio: [4, 5, 6],
        offsets: [10, 15, 20],
        total: 237,
      },
      {
        ratio: [3, 5, 7],
        offsets: [8, 12, 16],
        total: 222,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(
      difficulty === "Hard"
        ? templates.Hard
        : templates.Medium,
    ),
  };
  const ratioSum =
    values.ratio[0] +
    values.ratio[1] +
    values.ratio[2];
  const adjustedTotal =
    values.total -
    values.offsets[0] -
    values.offsets[1] -
    values.offsets[2];
  const unit =
    adjustedTotal / ratioSum;
  const correctAnswer =
    values.ratio[2] * unit +
    values.offsets[2];

  return {
    scenarioType:
      "distribution-constraint-adjusted",
    topicCluster: "ratio-proportion",
    values: {
      ...values,
      adjustedTotal,
      unit,
    },
    formula:
      "(adjustedTotal / ratioSum) * ratio3 + offset3",
    text: `₹${values.total} is divided among A, B, and C such that if ₹${values.offsets[0]}, ₹${values.offsets[1]}, and ₹${values.offsets[2]} are subtracted from their shares respectively, the remaining amounts are in the ratio ${values.ratio[0]}:${values.ratio[1]}:${values.ratio[2]}. Find C's original share.`,
    correctAnswer,
    distractorHints: [
      "wrongDenominator",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `After subtracting the fixed amounts, the remaining distributable total is ₹${adjustedTotal}.`,
      ),
      createReasoningStep(
        "aggregate",
        `The adjusted ratio sum is ${ratioSum}, so one part = ₹${adjustedTotal} / ${ratioSum} = ₹${unit}.`,
      ),
      createReasoningStep(
        "infer",
        `C's original share = ${values.ratio[2]} x ${unit} + ${values.offsets[2]} = ₹${correctAnswer}.`,
      ),
    ],
    context: buildRatioContext(
      "distribution with adjustments",
      "original share",
    ),
  };
}

function createIncomeExpenditureScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const templates = {
    Medium: [
      {
        income: [4, 5],
        expenditure: [3, 4],
        savings: 1000,
      },
      {
        income: [5, 7],
        expenditure: [4, 5],
        savings: 3000,
      },
    ],
    Hard: [
      {
        income: [7, 9],
        expenditure: [5, 6],
        savings: 4000,
      },
      {
        income: [6, 8],
        expenditure: [4, 5],
        savings: 2500,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(
      difficulty === "Hard"
        ? templates.Hard
        : templates.Medium,
    ),
  };
  const unit =
    values.savings /
    (values.income[0] *
      values.expenditure[1] -
      values.expenditure[0] *
        values.income[1]);
  const firstIncome =
    values.income[0] *
    values.expenditure[1] *
    unit;

  return {
    scenarioType:
      "income-expenditure-cross-balance",
    topicCluster: "ratio-proportion",
    values: {
      ...values,
      unit,
    },
    formula:
      "income1 * expenditure2 * unit",
    text: `The incomes of A and B are in the ratio ${values.income[0]}:${values.income[1]} and their expenditures are in the ratio ${values.expenditure[0]}:${values.expenditure[1]}. If each saves ₹${values.savings}, find A's income.`,
    correctAnswer: firstIncome,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Equal savings mean income and expenditure expressions must be written on a common scale.`,
      ),
      createReasoningStep(
        "aggregate",
        `Let incomes be ${values.income[0]}x and ${values.income[1]}x, expenditures be ${values.expenditure[0]}y and ${values.expenditure[1]}y, with ${values.income[0]}x - ${values.expenditure[0]}y = ${values.savings} and ${values.income[1]}x - ${values.expenditure[1]}y = ${values.savings}.`,
      ),
      createReasoningStep(
        "infer",
        `Solving gives A's income = ₹${firstIncome}.`,
      ),
    ],
    context: buildRatioContext(
      "income expenditure",
      "income",
    ),
  };
}

function createMixtureReplacementScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const templates = {
    Medium: [
      {
        total: 40,
        milk: 3,
        water: 2,
        removed: 8,
      },
      {
        total: 50,
        milk: 4,
        water: 1,
        removed: 10,
      },
    ],
    Hard: [
      {
        total: 60,
        milk: 5,
        water: 1,
        removed: 12,
      },
      {
        total: 72,
        milk: 7,
        water: 2,
        removed: 18,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(
      difficulty === "Hard"
        ? templates.Hard
        : templates.Medium,
    ),
  };
  const initialMilk =
    (values.total * values.milk) /
    (values.milk + values.water);
  const removedMilk =
    (initialMilk / values.total) *
    values.removed;
  const finalMilk =
    initialMilk - removedMilk;

  return {
    scenarioType:
      "mixture-replacement-recursive",
    topicCluster: "ratio-proportion",
    values: {
      ...values,
      initialMilk,
      removedMilk,
      finalMilk,
    },
    formula:
      "initialMilk * (total - removed) / total",
    text: `A vessel contains milk and water in the ratio ${values.milk}:${values.water}. If the total volume is ${values.total} litres and ${values.removed} litres of the mixture is removed and replaced with water, find the quantity of milk left in the vessel.`,
    correctAnswer: finalMilk,
    distractorHints: [
      "wrongIntermediateValue",
      "cumulativeMistake",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `Initial milk = ${values.total} x ${values.milk} / (${values.milk} + ${values.water}) = ${initialMilk} litres.`,
      ),
      createReasoningStep(
        "transform",
        `Milk removed with the mixture = ${initialMilk} x ${values.removed} / ${values.total} = ${removedMilk} litres.`,
      ),
      createReasoningStep(
        "infer",
        `Milk left = ${initialMilk} - ${removedMilk} = ${finalMilk} litres.`,
      ),
    ],
    context: buildRatioContext(
      "mixture replacement",
      "remaining original component",
    ),
  };
}

function createVariationPowerScenario(
  _difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const templates = [
    {
      ratio: [1, 2, 3],
      factor: 40,
    },
    {
      ratio: [2, 3, 5],
      factor: 18,
    },
  ] as const;
  const values = {
    ...pickRandomItem(templates),
  };
  const weights = values.ratio.map(
    (value) => value * values.factor,
  );
  const totalWeight = weights.reduce(
    (sum, value) => sum + value,
    0,
  );
  const originalValue =
    totalWeight * totalWeight;
  const brokenValue = weights.reduce(
    (sum, value) => sum + value * value,
    0,
  );
  const correctAnswer =
    originalValue - brokenValue;

  return {
    scenarioType:
      "variation-power-broken-object",
    topicCluster: "ratio-proportion",
    values: {
      ...values,
      weights,
      totalWeight,
      originalValue,
      brokenValue,
    },
    formula:
      "totalWeight^2 - sum(pieceWeight^2)",
    text: `A diamond breaks into three pieces whose weights are in the ratio ${values.ratio[0]}:${values.ratio[1]}:${values.ratio[2]}. If the value of a diamond is proportional to the square of its weight and the total weight is ${totalWeight} units, find the loss in value due to breaking.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Let the weights be ${weights.join(", ")} units.`,
      ),
      createReasoningStep(
        "aggregate",
        `Original value is proportional to ${totalWeight}^2 = ${originalValue}, while the sum of the broken-piece values is ${brokenValue}.`,
      ),
      createReasoningStep(
        "infer",
        `Loss in value = ${originalValue} - ${brokenValue} = ${correctAnswer}.`,
      ),
    ],
    context: buildRatioContext(
      "power variation",
      "loss in value",
    ),
  };
}

export function createRatioProportionScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const scenarioFactoriesByMotif: Record<
    string,
    RatioScenarioFactory[]
  > = {
    "ratio-simplification-core": [
      createDirectDistributionScenario,
    ],
    "ratio-normalization-switch": [
      createBridgeUnificationScenario,
      createDistributionConstraintScenario,
    ],
    "weighted-ratio-distribution": [
      createDirectDistributionScenario,
      createDistributionConstraintScenario,
    ],
    "bridge-unification-nested": [
      createBridgeUnificationScenario,
    ],
    "transform-mapping-coins": [
      createCoinTransformScenario,
    ],
    "invariant-difference-ages": [
      createInvariantDifferenceAgeScenario,
    ],
    "age-ratio-state-shift": [
      createInvariantDifferenceAgeScenario,
    ],
    "mixture-replacement-recursive": [
      createMixtureReplacementScenario,
    ],
    "distribution-constraint-adjusted": [
      createDistributionConstraintScenario,
    ],
    "income-expenditure-cross-balance": [
      createIncomeExpenditureScenario,
    ],
    "variation-power-broken-object": [
      createVariationPowerScenario,
    ],
    "variation-dependency-switch": [
      createVariationPowerScenario,
    ],
  };

  const fallbackScenarios = [
    createDirectDistributionScenario,
    createBridgeUnificationScenario,
    createCoinTransformScenario,
    createInvariantDifferenceAgeScenario,
    createDistributionConstraintScenario,
    createIncomeExpenditureScenario,
    createMixtureReplacementScenario,
    createVariationPowerScenario,
  ];

  const patternSpecificScenarios:
    | RatioScenarioFactory[]
    | null =
    pattern.id.startsWith(
      "registry-ratio-proportion-bridge-",
    )
      ? [
          createBridgeUnificationScenario,
          createDistributionConstraintScenario,
        ]
      : pattern.id.startsWith(
            "registry-ratio-proportion-coins-distribution-",
          )
        ? [
            createCoinTransformScenario,
            createDirectDistributionScenario,
            createIncomeExpenditureScenario,
          ]
        : pattern.id.startsWith(
              "registry-ratio-proportion-ages-mixture-",
            )
          ? [
              createInvariantDifferenceAgeScenario,
              createMixtureReplacementScenario,
            ]
          : pattern.id.startsWith(
                "registry-ratio-proportion-variation-",
              )
            ? [
                createVariationPowerScenario,
                createIncomeExpenditureScenario,
              ]
            : pattern.id.startsWith(
                  "registry-ratio-proportion-",
                )
              ? fallbackScenarios
              : null;

  const scenarioFactories =
    patternSpecificScenarios ??
    (motif?.id
      ? scenarioFactoriesByMotif[
          motif.id
        ] ?? fallbackScenarios
      : fallbackScenarios);

  return pickRandomItem(
    scenarioFactories,
  )(difficulty, motif);
}
