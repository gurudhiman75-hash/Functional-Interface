import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import { solveMalCp005 } from "./cp005-solver";
import type {
  MalCp005SolveRequest,
  MalCp005SolveResult,
} from "./cp005-types";
import type { MalCp005ExamReadyQuestionV2 } from "./cp005-exam-ready-v2-types";
import {
  HUNDRED_V2,
  actorPhraseV2,
  alligationHelpV2,
  buildNaturalOptionsV2,
  cheaperCommercialStateV2,
  moneyTextV2,
  packageExamReadyQuestionV2,
  percentTextV2,
  rateTextV2,
  ratioTextV2,
  reducedRatioTextV2,
} from "./cp005-exam-ready-v2-core";

function expectPercent(result: MalCp005SolveResult) {
  if (result.kind !== "PERCENT") throw new Error("Expected percent result.");
  return result.value;
}

function expectRatio(result: MalCp005SolveResult) {
  if (result.kind !== "RATIO") throw new Error("Expected ratio result.");
  return [result.firstPart, result.secondPart] as const;
}

function expectRate(result: MalCp005SolveResult) {
  if (result.kind !== "SELLING_RATE") throw new Error("Expected selling-rate result.");
  return result.value;
}

export function cheaperProfitQuestionV2(input: {
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
}): MalCp005ExamReadyQuestionV2 {
  const prototypeId =
    "MAL-CP005-PROT-PROFIT-FROM-CHEAPER-IMPURITY-BLEND" as const;
  const state = cheaperCommercialStateV2(input.selectedSeed);
  const request: Extract<
    MalCp005SolveRequest,
    { mode: "CHEAPER_BLEND_PROFIT_FROM_COSTS_QUANTITIES_AND_SELLING_RATE" }
  > = {
    mode: "CHEAPER_BLEND_PROFIT_FROM_COSTS_QUANTITIES_AND_SELLING_RATE",
    pureQuantity: state.purePart,
    adulterantQuantity: state.adulterantPart,
    pureUnitCost: state.pureUnitCost,
    adulterantUnitCost: state.adulterantUnitCost,
    sellingRate: state.sellingRate,
  };
  const solution = solveMalCp005(request);
  const profit = expectPercent(solution);
  const totalPart = addRational(state.purePart, state.adulterantPart);
  const pureCostTotal = multiplyRational(state.purePart, state.pureUnitCost);
  const adulterantCostTotal = multiplyRational(
    state.adulterantPart,
    state.adulterantUnitCost,
  );
  const batchCost = addRational(pureCostTotal, adulterantCostTotal);
  const batchRevenue = multiplyRational(totalPart, state.sellingRate);
  const profitAmount = subtractRational(batchRevenue, batchCost);
  const marginOnRevenue = multiplyRational(
    divideRational(profitAmount, batchRevenue),
    HUNDRED_V2,
  );
  const treatedAsFree = multiplyRational(
    divideRational(
      subtractRational(batchRevenue, pureCostTotal),
      pureCostTotal,
    ),
    HUNDRED_V2,
  );
  const simpleAverageCost = divideRational(
    addRational(state.pureUnitCost, state.adulterantUnitCost),
    rational(2),
  );
  const simpleAverageProfit = multiplyRational(
    divideRational(
      subtractRational(state.sellingRate, simpleAverageCost),
      simpleAverageCost,
    ),
    HUNDRED_V2,
  );
  const adulterantShare = multiplyRational(
    divideRational(state.adulterantPart, totalPart),
    HUNDRED_V2,
  );
  const answer = percentTextV2(profit);
  const options = buildNaturalOptionsV2(
    answer,
    [
      {
        text: percentTextV2(marginOnRevenue),
        misconceptionId: "used_revenue_as_percentage_base",
      },
      {
        text: percentTextV2(treatedAsFree),
        misconceptionId: "treated_the_cheaper_ingredient_as_free",
      },
      {
        text: percentTextV2(simpleAverageProfit),
        misconceptionId: "used_an_unweighted_average_cost",
      },
      {
        text: percentTextV2(adulterantShare),
        misconceptionId: "reported_cheaper_ingredient_share_as_profit",
      },
    ],
    `${input.selectedSeed}:options`,
  );
  return packageExamReadyQuestionV2({
    prototypeId,
    requestedSeed: input.requestedSeed,
    selectedSeed: input.selectedSeed,
    selectionAttempt: input.selectionAttempt,
    stateKey: state.stateKey,
    siblingStateKey: state.siblingStateKey,
    request,
    solution,
    exactState: {
      purePart: state.purePart,
      adulterantPart: state.adulterantPart,
      pureUnitCost: state.pureUnitCost,
      adulterantUnitCost: state.adulterantUnitCost,
      sellingRate: state.sellingRate,
      batchCost,
      batchRevenue,
      profitPercent: profit,
    },
    stem: `${actorPhraseV2(state.context.actor)} mixes ${formatRational(state.purePart)} parts of ${state.context.product} costing ${rateTextV2(state.pureUnitCost, state.context.unit)} with ${formatRational(state.adulterantPart)} parts of ${state.context.adulterant} costing ${rateTextV2(state.adulterantUnitCost, state.context.unit)}. The mixture is sold at ${rateTextV2(state.sellingRate, state.context.unit)}. What is the profit percentage?`,
    answer,
    options,
    visibleLines: [
      `Actual cost of one ratio-batch = ${formatRational(state.purePart)} × ${formatRational(state.pureUnitCost)} + ${formatRational(state.adulterantPart)} × ${formatRational(state.adulterantUnitCost)} = ${moneyTextV2(batchCost)}.`,
      `Revenue = ${formatRational(totalPart)} × ${formatRational(state.sellingRate)} = ${moneyTextV2(batchRevenue)}.`,
      `Profit percentage = (${formatRational(batchRevenue)} − ${formatRational(batchCost)})/${formatRational(batchCost)} × 100 = ${answer}.`,
    ],
    commonMistake:
      "The cheaper ingredient is not free; include its cost in the actual batch cost.",
    verification: [
      `${moneyTextV2(batchCost)} × (100 + ${formatRational(profit)})/100 = ${moneyTextV2(batchRevenue)}.`,
    ],
    numberProvenance: {
      stemFacts: [
        `Ingredient costs: ${formatRational(state.pureUnitCost)} and ${formatRational(state.adulterantUnitCost)}`,
        `Mixture ratio: ${ratioTextV2(state.purePart, state.adulterantPart)}`,
        `Selling rate: ${formatRational(state.sellingRate)}`,
      ],
      permittedAssumptions: ["One ratio-batch is used for calculation."],
      derivedFacts: [
        `Batch cost: ${formatRational(batchCost)}`,
        `Batch revenue: ${formatRational(batchRevenue)}`,
        `Profit percentage: ${formatRational(profit)}%`,
      ],
      hiddenStateKeys: [],
    },
  });
}

export function cheaperRatioQuestionV2(input: {
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
}): MalCp005ExamReadyQuestionV2 {
  const prototypeId =
    "MAL-CP005-PROT-CHEAPER-IMPURITY-RATIO-FROM-TARGET-PROFIT" as const;
  const state = cheaperCommercialStateV2(input.selectedSeed);
  const request: Extract<
    MalCp005SolveRequest,
    { mode: "CHEAPER_BLEND_RATIO_FROM_COSTS_SELLING_RATE_AND_TARGET_PROFIT" }
  > = {
    mode: "CHEAPER_BLEND_RATIO_FROM_COSTS_SELLING_RATE_AND_TARGET_PROFIT",
    pureUnitCost: state.pureUnitCost,
    adulterantUnitCost: state.adulterantUnitCost,
    sellingRate: state.sellingRate,
    targetProfitPercent: state.targetProfitPercent,
  };
  const solution = solveMalCp005(request);
  const [purePart, adulterantPart] = expectRatio(solution);
  const pureQuantityPart = subtractRational(
    state.averageCost,
    state.adulterantUnitCost,
  );
  const adulterantQuantityPart = subtractRational(
    state.pureUnitCost,
    state.averageCost,
  );
  const answer = ratioTextV2(purePart, adulterantPart);
  const options = buildNaturalOptionsV2(
    answer,
    [
      {
        text: ratioTextV2(adulterantPart, purePart),
        misconceptionId: "ratio_reversed",
      },
      {
        text: reducedRatioTextV2(
          state.pureUnitCost,
          state.adulterantUnitCost,
        ),
        misconceptionId: "used_the_two_costs_directly",
      },
      {
        text: reducedRatioTextV2(HUNDRED_V2, state.targetProfitPercent),
        misconceptionId: "treated_the_cheaper_ingredient_as_free",
      },
      {
        text: reducedRatioTextV2(
          state.averageCost,
          state.adulterantUnitCost,
        ),
        misconceptionId: "omitted_one_opposite_difference",
      },
    ],
    `${input.selectedSeed}:options`,
  );
  const alternativeMethod = alligationHelpV2({
    lowerLabel: state.context.adulterant,
    lowerValue: state.adulterantUnitCost,
    higherLabel: state.context.product,
    higherValue: state.pureUnitCost,
    targetValue: state.averageCost,
    higherQuantityPart: pureQuantityPart,
    lowerQuantityPart: adulterantQuantityPart,
    ratioLabel: `${state.context.product} : ${state.context.adulterant}`,
    ratio: answer,
    result: `The required ${state.context.product} : ${state.context.adulterant} ratio is ${answer}.`,
    unit: state.context.unit,
  });
  return packageExamReadyQuestionV2({
    prototypeId,
    requestedSeed: input.requestedSeed,
    selectedSeed: input.selectedSeed,
    selectionAttempt: input.selectionAttempt,
    stateKey: state.stateKey,
    siblingStateKey: state.siblingStateKey,
    request,
    solution,
    exactState: {
      pureUnitCost: state.pureUnitCost,
      adulterantUnitCost: state.adulterantUnitCost,
      sellingRate: state.sellingRate,
      targetProfitPercent: state.targetProfitPercent,
      requiredAverageCost: state.averageCost,
      purePart,
      adulterantPart,
    },
    stem: `${actorPhraseV2(state.context.actor)} mixes ${state.context.product} costing ${rateTextV2(state.pureUnitCost, state.context.unit)} with ${state.context.adulterant} costing ${rateTextV2(state.adulterantUnitCost, state.context.unit)}. The mixture is sold at ${rateTextV2(state.sellingRate, state.context.unit)} for a profit of ${percentTextV2(state.targetProfitPercent)}. In what ratio should ${state.context.product} and ${state.context.adulterant} be mixed?`,
    answer,
    options,
    visibleLines: [
      `Required average cost = ${formatRational(state.sellingRate)} × 100/(100 + ${formatRational(state.targetProfitPercent)}) = ${rateTextV2(state.averageCost, state.context.unit)}.`,
      `${state.context.product} : ${state.context.adulterant} = (${formatRational(state.averageCost)} − ${formatRational(state.adulterantUnitCost)}) : (${formatRational(state.pureUnitCost)} − ${formatRational(state.averageCost)}) = ${answer}.`,
    ],
    commonMistake:
      "Use opposite differences from the required average cost; do not use the ingredient costs directly as the ratio.",
    verification: [
      `A batch in ratio ${answer} has average cost ${rateTextV2(state.averageCost, state.context.unit)}.`,
      `At ${rateTextV2(state.sellingRate, state.context.unit)}, this gives ${percentTextV2(state.targetProfitPercent)} profit.`,
    ],
    alternativeMethod,
    numberProvenance: {
      stemFacts: [
        `Ingredient costs: ${formatRational(state.pureUnitCost)} and ${formatRational(state.adulterantUnitCost)}`,
        `Selling rate: ${formatRational(state.sellingRate)}`,
        `Target profit: ${formatRational(state.targetProfitPercent)}%`,
      ],
      permittedAssumptions: [],
      derivedFacts: [
        `Required average cost: ${formatRational(state.averageCost)}`,
        `Required ratio: ${answer}`,
      ],
      hiddenStateKeys: [],
    },
  });
}

export function cheaperSellingRateQuestionV2(input: {
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
}): MalCp005ExamReadyQuestionV2 {
  const prototypeId =
    "MAL-CP005-PROT-CHEAPER-IMPURITY-SELLING-RATE-FROM-TARGET-PROFIT" as const;
  const state = cheaperCommercialStateV2(input.selectedSeed);
  const request: Extract<
    MalCp005SolveRequest,
    { mode: "CHEAPER_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT" }
  > = {
    mode: "CHEAPER_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT",
    pureQuantity: state.purePart,
    adulterantQuantity: state.adulterantPart,
    pureUnitCost: state.pureUnitCost,
    adulterantUnitCost: state.adulterantUnitCost,
    targetProfitPercent: state.targetProfitPercent,
  };
  const solution = solveMalCp005(request);
  const sellingRate = expectRate(solution);
  const pureCostWithProfit = divideRational(
    multiplyRational(
      state.pureUnitCost,
      addRational(HUNDRED_V2, state.targetProfitPercent),
    ),
    HUNDRED_V2,
  );
  const adulterantCostWithProfit = divideRational(
    multiplyRational(
      state.adulterantUnitCost,
      addRational(HUNDRED_V2, state.targetProfitPercent),
    ),
    HUNDRED_V2,
  );
  const simpleAverage = divideRational(
    addRational(state.pureUnitCost, state.adulterantUnitCost),
    rational(2),
  );
  const simpleAverageWithProfit = divideRational(
    multiplyRational(
      simpleAverage,
      addRational(HUNDRED_V2, state.targetProfitPercent),
    ),
    HUNDRED_V2,
  );
  const marginRate = divideRational(
    multiplyRational(state.averageCost, HUNDRED_V2),
    subtractRational(HUNDRED_V2, state.targetProfitPercent),
  );
  const answer = rateTextV2(sellingRate, state.context.unit);
  const options = buildNaturalOptionsV2(
    answer,
    [
      {
        text: rateTextV2(state.averageCost, state.context.unit),
        misconceptionId: "forgot_to_add_target_profit",
      },
      {
        text: rateTextV2(pureCostWithProfit, state.context.unit),
        misconceptionId: "used_only_the_higher_ingredient_cost",
      },
      {
        text: rateTextV2(adulterantCostWithProfit, state.context.unit),
        misconceptionId: "used_only_the_lower_ingredient_cost",
      },
      {
        text: rateTextV2(simpleAverageWithProfit, state.context.unit),
        misconceptionId: "used_an_unweighted_average_cost",
      },
      {
        text: rateTextV2(marginRate, state.context.unit),
        misconceptionId: "treated_profit_as_margin_on_selling_price",
      },
    ],
    `${input.selectedSeed}:options`,
  );
  return packageExamReadyQuestionV2({
    prototypeId,
    requestedSeed: input.requestedSeed,
    selectedSeed: input.selectedSeed,
    selectionAttempt: input.selectionAttempt,
    stateKey: state.stateKey,
    siblingStateKey: state.siblingStateKey,
    request,
    solution,
    exactState: {
      purePart: state.purePart,
      adulterantPart: state.adulterantPart,
      pureUnitCost: state.pureUnitCost,
      adulterantUnitCost: state.adulterantUnitCost,
      targetProfitPercent: state.targetProfitPercent,
      averageCost: state.averageCost,
      sellingRate,
    },
    stem: `${actorPhraseV2(state.context.actor)} mixes ${state.context.product} costing ${rateTextV2(state.pureUnitCost, state.context.unit)} and ${state.context.adulterant} costing ${rateTextV2(state.adulterantUnitCost, state.context.unit)} in the ratio ${ratioTextV2(state.purePart, state.adulterantPart)}. At what rate should the mixture be sold to earn ${percentTextV2(state.targetProfitPercent)} profit?`,
    answer,
    options,
    visibleLines: [
      `Weighted average cost = (${formatRational(state.purePart)} × ${formatRational(state.pureUnitCost)} + ${formatRational(state.adulterantPart)} × ${formatRational(state.adulterantUnitCost)})/${formatRational(addRational(state.purePart, state.adulterantPart))} = ${rateTextV2(state.averageCost, state.context.unit)}.`,
      `Required selling rate = ${formatRational(state.averageCost)} × (100 + ${formatRational(state.targetProfitPercent)})/100 = ${answer}.`,
    ],
    commonMistake:
      "Use the weighted average cost. A simple average is valid only when the two quantities are equal.",
    verification: [
      `Selling one ratio-batch at ${answer} gives exactly ${percentTextV2(state.targetProfitPercent)} profit on its combined ingredient cost.`,
    ],
    numberProvenance: {
      stemFacts: [
        `Ingredient costs: ${formatRational(state.pureUnitCost)} and ${formatRational(state.adulterantUnitCost)}`,
        `Mixture ratio: ${ratioTextV2(state.purePart, state.adulterantPart)}`,
        `Target profit: ${formatRational(state.targetProfitPercent)}%`,
      ],
      permittedAssumptions: [],
      derivedFacts: [
        `Weighted average cost: ${formatRational(state.averageCost)}`,
        `Required selling rate: ${formatRational(sellingRate)}`,
      ],
      hiddenStateKeys: [],
    },
  });
}
