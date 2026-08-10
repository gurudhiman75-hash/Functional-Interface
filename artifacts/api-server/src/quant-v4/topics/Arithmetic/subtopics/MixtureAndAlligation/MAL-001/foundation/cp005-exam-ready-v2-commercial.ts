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
  freeCommercialStateV2,
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

export function freeCommercialProfitQuestionV2(input: {
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
}): MalCp005ExamReadyQuestionV2 {
  const prototypeId =
    "MAL-CP005-PROT-PROFIT-FROM-FREE-BLEND-AND-SELLING-RATE" as const;
  const state = freeCommercialStateV2(input.selectedSeed);
  const request: Extract<
    MalCp005SolveRequest,
    { mode: "FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE" }
  > = {
    mode: "FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE",
    pureQuantity: state.purePart,
    adulterantQuantity: state.adulterantPart,
    pureUnitCost: state.pureUnitCost,
    sellingRate: state.sellingRate,
  };
  const solution = solveMalCp005(request);
  const profit = expectPercent(solution);
  const totalPart = addRational(state.purePart, state.adulterantPart);
  const batchCost = multiplyRational(state.purePart, state.pureUnitCost);
  const batchRevenue = multiplyRational(totalPart, state.sellingRate);
  const profitAmount = subtractRational(batchRevenue, batchCost);
  const marginOnRevenue = multiplyRational(
    divideRational(profitAmount, batchRevenue),
    HUNDRED_V2,
  );
  const adulterationOnly = multiplyRational(
    divideRational(state.adulterantPart, state.purePart),
    HUNDRED_V2,
  );
  const rateOnly = multiplyRational(
    divideRational(
      subtractRational(state.sellingRate, state.pureUnitCost),
      state.pureUnitCost,
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
        text: percentTextV2(adulterationOnly),
        misconceptionId: "ignored_the_stated_selling_rate",
      },
      {
        text: percentTextV2(rateOnly),
        misconceptionId: "ignored_the_extra_quantity_sold",
      },
      {
        text: percentTextV2(adulterantShare),
        misconceptionId: "reported_adulterant_share_as_profit",
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
      sellingRate: state.sellingRate,
      batchCost,
      batchRevenue,
      profitPercent: profit,
    },
    stem: `${actorPhraseV2(state.context.actor)} buys pure ${state.context.product} at ${rateTextV2(state.pureUnitCost, state.context.unit)}, mixes pure ${state.context.product} and ${state.context.adulterant} in the ratio ${ratioTextV2(state.purePart, state.adulterantPart)}, and sells the mixture at ${rateTextV2(state.sellingRate, state.context.unit)}. What is the profit percentage?`,
    answer,
    options,
    visibleLines: [
      `For one ratio-batch, actual cost = ${formatRational(state.purePart)} × ${formatRational(state.pureUnitCost)} = ${moneyTextV2(batchCost)}.`,
      `Revenue = ${formatRational(totalPart)} × ${formatRational(state.sellingRate)} = ${moneyTextV2(batchRevenue)}.`,
      `Profit percentage = (${formatRational(batchRevenue)} − ${formatRational(batchCost)})/${formatRational(batchCost)} × 100 = ${answer}.`,
    ],
    commonMistake:
      "Do not add the price change and the adulterant percentage. Combine them through total cost and total revenue.",
    verification: [
      `${moneyTextV2(batchCost)} × (100 + ${formatRational(profit)})/100 = ${moneyTextV2(batchRevenue)}.`,
    ],
    numberProvenance: {
      stemFacts: [
        `Pure-product cost: ${formatRational(state.pureUnitCost)}`,
        `Selling rate: ${formatRational(state.sellingRate)}`,
        `Mixture ratio: ${ratioTextV2(state.purePart, state.adulterantPart)}`,
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

export function freeCommercialRatioQuestionV2(input: {
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
}): MalCp005ExamReadyQuestionV2 {
  const prototypeId =
    "MAL-CP005-PROT-FREE-BLEND-RATIO-FROM-COST-SELLING-RATE-AND-TARGET-PROFIT" as const;
  const state = freeCommercialStateV2(input.selectedSeed);
  const request: Extract<
    MalCp005SolveRequest,
    { mode: "FREE_BLEND_RATIO_FROM_COST_SELLING_RATE_AND_TARGET_PROFIT" }
  > = {
    mode: "FREE_BLEND_RATIO_FROM_COST_SELLING_RATE_AND_TARGET_PROFIT",
    pureUnitCost: state.pureUnitCost,
    sellingRate: state.sellingRate,
    targetProfitPercent: state.targetProfitPercent,
  };
  const solution = solveMalCp005(request);
  const [purePart, adulterantPart] = expectRatio(solution);
  const waterPart = subtractRational(state.pureUnitCost, state.averageCost);
  const answer = ratioTextV2(purePart, adulterantPart);
  const options = buildNaturalOptionsV2(
    answer,
    [
      {
        text: ratioTextV2(adulterantPart, purePart),
        misconceptionId: "ratio_reversed",
      },
      {
        text: reducedRatioTextV2(state.pureUnitCost, state.sellingRate),
        misconceptionId: "used_cost_to_selling_rate_directly",
      },
      {
        text: reducedRatioTextV2(HUNDRED_V2, state.targetProfitPercent),
        misconceptionId: "used_pure_cost_sale_shortcut",
      },
      {
        text: reducedRatioTextV2(state.averageCost, state.pureUnitCost),
        misconceptionId: "omitted_the_opposite_difference",
      },
    ],
    `${input.selectedSeed}:options`,
  );
  const alternativeMethod = alligationHelpV2({
    lowerLabel: state.context.adulterant,
    lowerValue: rational(0),
    higherLabel: `Pure ${state.context.product}`,
    higherValue: state.pureUnitCost,
    targetValue: state.averageCost,
    higherQuantityPart: state.averageCost,
    lowerQuantityPart: waterPart,
    ratioLabel: `Pure ${state.context.product} : ${state.context.adulterant}`,
    ratio: answer,
    result: `The required pure ${state.context.product} : ${state.context.adulterant} ratio is ${answer}.`,
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
      adulterantUnitCost: "ZERO_COST",
      sellingRate: state.sellingRate,
      targetProfitPercent: state.targetProfitPercent,
      requiredAverageCost: state.averageCost,
      purePart,
      adulterantPart,
    },
    stem: `${actorPhraseV2(state.context.actor)} buys pure ${state.context.product} at ${rateTextV2(state.pureUnitCost, state.context.unit)} and sells the adulterated mixture at ${rateTextV2(state.sellingRate, state.context.unit)}. In what ratio should pure ${state.context.product} and ${state.context.adulterant} be mixed to earn ${percentTextV2(state.targetProfitPercent)} profit?`,
    answer,
    options,
    visibleLines: [
      `Required average cost of the mixture = ${formatRational(state.sellingRate)} × 100/(100 + ${formatRational(state.targetProfitPercent)}) = ${rateTextV2(state.averageCost, state.context.unit)}.`,
      `Pure ${state.context.product} : ${state.context.adulterant} = ${formatRational(state.averageCost)} : (${formatRational(state.pureUnitCost)} − ${formatRational(state.averageCost)}) = ${answer}.`,
    ],
    commonMistake:
      "Use the required average cost, not the selling rate, as the middle value in alligation.",
    verification: [
      `A batch in ratio ${answer} has average cost ${rateTextV2(state.averageCost, state.context.unit)}.`,
      `Selling at ${rateTextV2(state.sellingRate, state.context.unit)} then gives ${percentTextV2(state.targetProfitPercent)} profit.`,
    ],
    alternativeMethod,
    numberProvenance: {
      stemFacts: [
        `Pure-product cost: ${formatRational(state.pureUnitCost)}`,
        `Selling rate: ${formatRational(state.sellingRate)}`,
        `Target profit: ${formatRational(state.targetProfitPercent)}%`,
      ],
      permittedAssumptions: [
        `${state.context.adulterant} has zero purchase cost.`,
      ],
      derivedFacts: [
        `Required average cost: ${formatRational(state.averageCost)}`,
        `Required ratio: ${answer}`,
      ],
      hiddenStateKeys: [],
    },
  });
}

export function freeCommercialSellingRateQuestionV2(input: {
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
}): MalCp005ExamReadyQuestionV2 {
  const prototypeId =
    "MAL-CP005-PROT-FREE-BLEND-SELLING-RATE-FROM-RATIO-AND-TARGET-PROFIT" as const;
  const state = freeCommercialStateV2(input.selectedSeed);
  const request: Extract<
    MalCp005SolveRequest,
    { mode: "FREE_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT" }
  > = {
    mode: "FREE_BLEND_SELLING_RATE_FROM_RATIO_AND_TARGET_PROFIT",
    pureQuantity: state.purePart,
    adulterantQuantity: state.adulterantPart,
    pureUnitCost: state.pureUnitCost,
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
  const marginRate = divideRational(
    multiplyRational(state.averageCost, HUNDRED_V2),
    subtractRational(HUNDRED_V2, state.targetProfitPercent),
  );
  const pureProfitAmount = multiplyRational(
    state.pureUnitCost,
    divideRational(state.targetProfitPercent, HUNDRED_V2),
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
        misconceptionId: "ignored_the_free_adulterant",
      },
      {
        text: rateTextV2(state.pureUnitCost, state.context.unit),
        misconceptionId: "reported_pure_product_cost",
      },
      {
        text: rateTextV2(marginRate, state.context.unit),
        misconceptionId: "treated_profit_as_margin_on_selling_price",
      },
      {
        text: rateTextV2(
          addRational(state.averageCost, pureProfitAmount),
          state.context.unit,
        ),
        misconceptionId: "added_profit_on_pure_cost_to_mixture_cost",
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
      targetProfitPercent: state.targetProfitPercent,
      averageCost: state.averageCost,
      sellingRate,
    },
    stem: `Pure ${state.context.product} costs ${rateTextV2(state.pureUnitCost, state.context.unit)}. ${actorPhraseV2(state.context.actor)} mixes pure ${state.context.product} and ${state.context.adulterant} in the ratio ${ratioTextV2(state.purePart, state.adulterantPart)}. At what rate should the mixture be sold to earn ${percentTextV2(state.targetProfitPercent)} profit?`,
    answer,
    options,
    visibleLines: [
      `Average mixture cost = (${formatRational(state.purePart)} × ${formatRational(state.pureUnitCost)})/${formatRational(addRational(state.purePart, state.adulterantPart))} = ${rateTextV2(state.averageCost, state.context.unit)}.`,
      `Required selling rate = ${formatRational(state.averageCost)} × (100 + ${formatRational(state.targetProfitPercent)})/100 = ${answer}.`,
    ],
    commonMistake:
      "Apply the target profit to the average mixture cost, not directly to the pure-product cost.",
    verification: [
      `Selling one ratio-batch at ${answer} gives exactly ${percentTextV2(state.targetProfitPercent)} profit on its actual cost.`,
    ],
    numberProvenance: {
      stemFacts: [
        `Pure-product cost: ${formatRational(state.pureUnitCost)}`,
        `Mixture ratio: ${ratioTextV2(state.purePart, state.adulterantPart)}`,
        `Target profit: ${formatRational(state.targetProfitPercent)}%`,
      ],
      permittedAssumptions: [
        `${state.context.adulterant} has zero purchase cost.`,
      ],
      derivedFacts: [
        `Average mixture cost: ${formatRational(state.averageCost)}`,
        `Required selling rate: ${formatRational(sellingRate)}`,
      ],
      hiddenStateKeys: [],
    },
  });
}
