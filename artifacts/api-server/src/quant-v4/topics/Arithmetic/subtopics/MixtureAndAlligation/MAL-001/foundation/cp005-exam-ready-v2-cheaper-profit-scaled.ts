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
  buildNaturalOptionsV2,
  moneyTextV2,
  packageExamReadyQuestionV2,
  percentTextV2,
  quantityTextV2,
  rateTextV2,
  ratioTextV2,
} from "./cp005-exam-ready-v2-core";
import { cheaperProfitStateFromPoolV2 } from "./cp005-exam-ready-v2-cheaper-profit-pool";

function expectPercent(result: MalCp005SolveResult) {
  if (result.kind !== "PERCENT") throw new Error("Expected percent result.");
  return result.value;
}

export function cheaperProfitQuestionScaledV2(input: {
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
}): MalCp005ExamReadyQuestionV2 {
  const prototypeId =
    "MAL-CP005-PROT-PROFIT-FROM-CHEAPER-IMPURITY-BLEND" as const;
  const state = cheaperProfitStateFromPoolV2(input.selectedSeed);
  const request: Extract<
    MalCp005SolveRequest,
    { mode: "CHEAPER_BLEND_PROFIT_FROM_COSTS_QUANTITIES_AND_SELLING_RATE" }
  > = {
    mode: "CHEAPER_BLEND_PROFIT_FROM_COSTS_QUANTITIES_AND_SELLING_RATE",
    pureQuantity: state.pureQuantity,
    adulterantQuantity: state.adulterantQuantity,
    pureUnitCost: state.pureUnitCost,
    adulterantUnitCost: state.adulterantUnitCost,
    sellingRate: state.sellingRate,
  };
  const solution = solveMalCp005(request);
  const profit = expectPercent(solution);
  const totalQuantity = addRational(
    state.pureQuantity,
    state.adulterantQuantity,
  );
  const pureCostTotal = multiplyRational(
    state.pureQuantity,
    state.pureUnitCost,
  );
  const adulterantCostTotal = multiplyRational(
    state.adulterantQuantity,
    state.adulterantUnitCost,
  );
  const batchCost = addRational(pureCostTotal, adulterantCostTotal);
  const batchRevenue = multiplyRational(totalQuantity, state.sellingRate);
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
    divideRational(state.adulterantQuantity, totalQuantity),
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
      pureQuantity: state.pureQuantity,
      adulterantQuantity: state.adulterantQuantity,
      pureUnitCost: state.pureUnitCost,
      adulterantUnitCost: state.adulterantUnitCost,
      sellingRate: state.sellingRate,
      batchCost,
      batchRevenue,
      profitPercent: profit,
    },
    stem: `${actorPhraseV2(state.context.actor)} mixes ${quantityTextV2(
      state.pureQuantity,
      state.context.unit,
    )} of ${state.context.product} costing ${rateTextV2(
      state.pureUnitCost,
      state.context.unit,
    )} with ${quantityTextV2(
      state.adulterantQuantity,
      state.context.unit,
    )} of ${state.context.adulterant} costing ${rateTextV2(
      state.adulterantUnitCost,
      state.context.unit,
    )}. The mixture is sold at ${rateTextV2(
      state.sellingRate,
      state.context.unit,
    )}. What is the profit percentage?`,
    answer,
    options,
    visibleLines: [
      `Actual cost = ${formatRational(state.pureQuantity)} × ${formatRational(
        state.pureUnitCost,
      )} + ${formatRational(
        state.adulterantQuantity,
      )} × ${formatRational(state.adulterantUnitCost)} = ${moneyTextV2(
        batchCost,
      )}.`,
      `Revenue = ${formatRational(totalQuantity)} × ${formatRational(
        state.sellingRate,
      )} = ${moneyTextV2(batchRevenue)}.`,
      `Profit percentage = (${formatRational(
        batchRevenue,
      )} − ${formatRational(batchCost)})/${formatRational(
        batchCost,
      )} × 100 = ${answer}.`,
    ],
    commonMistake:
      "The cheaper ingredient is not free; include its purchase cost in the actual total cost.",
    verification: [
      `${moneyTextV2(batchCost)} × (100 + ${formatRational(
        profit,
      )})/100 = ${moneyTextV2(batchRevenue)}.`,
    ],
    numberProvenance: {
      stemFacts: [
        `Quantities: ${quantityTextV2(
          state.pureQuantity,
          state.context.unit,
        )} and ${quantityTextV2(
          state.adulterantQuantity,
          state.context.unit,
        )}`,
        `Ingredient costs: ${formatRational(
          state.pureUnitCost,
        )} and ${formatRational(state.adulterantUnitCost)}`,
        `Selling rate: ${formatRational(state.sellingRate)}`,
      ],
      permittedAssumptions: [],
      derivedFacts: [
        `Mixture ratio: ${ratioTextV2(
          state.purePart,
          state.adulterantPart,
        )}`,
        `Total cost: ${formatRational(batchCost)}`,
        `Total revenue: ${formatRational(batchRevenue)}`,
        `Profit percentage: ${formatRational(profit)}%`,
      ],
      hiddenStateKeys: [],
    },
  });
}
