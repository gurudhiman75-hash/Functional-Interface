import {
  addRational,
  compareRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import { solveMalCp005 } from "./cp005-solver";
import type {
  MalCp005DiscoveryPrototypeId,
  MalCp005SolveRequest,
  MalCp005SolveResult,
} from "./cp005-types";
import type { MalCp005ExamReadyQuestionV2 } from "./cp005-exam-ready-v2-types";
import {
  HUNDRED_V2,
  actorPhraseV2,
  buildNaturalOptionsV2,
  freeStateV2,
  packageExamReadyQuestionV2,
  percentTextV2,
  quantityTextV2,
  ratioTextV2,
  reducedRatioTextV2,
  type MalCp005FreeStateV2,
} from "./cp005-exam-ready-v2-core";

function expectPercent(result: MalCp005SolveResult) {
  if (result.kind !== "PERCENT") throw new Error("Expected percent result.");
  return result.value;
}

function expectQuantity(result: MalCp005SolveResult) {
  if (result.kind !== "QUANTITY") throw new Error("Expected quantity result.");
  return result.value;
}

function expectRatio(result: MalCp005SolveResult) {
  if (result.kind !== "RATIO") throw new Error("Expected ratio result.");
  return [result.firstPart, result.secondPart] as const;
}

function commonInput(input: {
  prototypeId: MalCp005DiscoveryPrototypeId;
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
  state: MalCp005FreeStateV2;
}) {
  return {
    prototypeId: input.prototypeId,
    requestedSeed: input.requestedSeed,
    selectedSeed: input.selectedSeed,
    selectionAttempt: input.selectionAttempt,
    stateKey: input.state.stateKey,
    siblingStateKey: input.state.siblingStateKey,
  };
}

export function freeProfitQuestionV2(input: {
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
}): MalCp005ExamReadyQuestionV2 {
  const prototypeId =
    "MAL-CP005-PROT-PROFIT-FROM-FREE-ADULTERANT-QUANTITIES" as const;
  const state = freeStateV2(input.selectedSeed);
  const request: Extract<
    MalCp005SolveRequest,
    { mode: "FREE_ADULTERANT_PROFIT_FROM_QUANTITIES" }
  > = {
    mode: "FREE_ADULTERANT_PROFIT_FROM_QUANTITIES",
    pureQuantity: state.pureQuantity,
    adulterantQuantity: state.adulterantQuantity,
  };
  const solution = solveMalCp005(request);
  const profit = expectPercent(solution);
  const total = addRational(state.pureQuantity, state.adulterantQuantity);
  const pureShare = multiplyRational(
    divideRational(state.pureQuantity, total),
    HUNDRED_V2,
  );
  const revenuePercent = addRational(HUNDRED_V2, profit);
  const inverseBase = multiplyRational(
    divideRational(state.pureQuantity, state.adulterantQuantity),
    HUNDRED_V2,
  );
  const answer = percentTextV2(profit);
  const options = buildNaturalOptionsV2(
    answer,
    [
      {
        text: percentTextV2(state.finalAdulterantPercent),
        misconceptionId: "used_final_mixture_as_profit_base",
      },
      {
        text: percentTextV2(pureShare),
        misconceptionId: "reported_pure_share_of_final_mixture",
      },
      {
        text: percentTextV2(revenuePercent),
        misconceptionId: "reported_revenue_percentage_instead_of_profit",
      },
      {
        text: percentTextV2(inverseBase),
        misconceptionId: "reversed_profit_fraction",
      },
    ],
    `${input.selectedSeed}:options`,
  );
  const unitWord = state.context.unit === "kg" ? "kg" : "litre";
  return packageExamReadyQuestionV2({
    ...commonInput({ ...input, prototypeId, state }),
    request,
    solution,
    exactState: {
      pureQuantity: state.pureQuantity,
      adulterantQuantity: state.adulterantQuantity,
      finalQuantity: total,
      profitPercent: profit,
    },
    stem: `${actorPhraseV2(state.context.actor)} adds ${quantityTextV2(
      state.adulterantQuantity,
      state.context.unit,
    )} of ${state.context.adulterant} to ${quantityTextV2(
      state.pureQuantity,
      state.context.unit,
    )} of pure ${state.context.product} and sells the mixture at the cost price of pure ${state.context.product}. What is the profit percentage?`,
    answer,
    options,
    visibleLines: [
      `The seller pays for ${quantityTextV2(state.pureQuantity, state.context.unit)} but sells ${quantityTextV2(total, state.context.unit)}.`,
      `Profit percentage = ${formatRational(state.adulterantQuantity)}/${formatRational(state.pureQuantity)} × 100 = ${answer}.`,
    ],
    commonMistake:
      "Profit is calculated on the quantity that carries cost, not on the final mixture quantity.",
    verification: [
      `Assume the pure product costs 1 cost unit per ${unitWord}.`,
      `Cost = ${formatRational(state.pureQuantity)} units, revenue = ${formatRational(total)} units and profit = ${formatRational(state.adulterantQuantity)} units.`,
    ],
    numberProvenance: {
      stemFacts: [
        `Pure quantity: ${formatRational(state.pureQuantity)}`,
        `Free adulterant quantity: ${formatRational(state.adulterantQuantity)}`,
      ],
      permittedAssumptions: [`Pure-product cost is normalized to 1 cost unit per ${unitWord}.`],
      derivedFacts: [
        `Final quantity: ${formatRational(total)}`,
        `Profit percentage: ${formatRational(profit)}`,
      ],
      hiddenStateKeys: [],
    },
  });
}

export function freeRatioFromProfitQuestionV2(input: {
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
}): MalCp005ExamReadyQuestionV2 {
  const prototypeId =
    "MAL-CP005-PROT-RATIO-FROM-TARGET-PROFIT-AT-PURE-COST" as const;
  const state = freeStateV2(input.selectedSeed);
  const targetProfit = state.profitPercentAtPureCost;
  const request: Extract<
    MalCp005SolveRequest,
    { mode: "FREE_ADULTERANT_RATIO_FROM_TARGET_PROFIT" }
  > = {
    mode: "FREE_ADULTERANT_RATIO_FROM_TARGET_PROFIT",
    targetProfitPercent: targetProfit,
  };
  const solution = solveMalCp005(request);
  const [purePart, adulterantPart] = expectRatio(solution);
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
          addRational(HUNDRED_V2, targetProfit),
          targetProfit,
        ),
        misconceptionId: "used_final_quantity_as_pure_quantity",
      },
      {
        text: reducedRatioTextV2(
          subtractRational(HUNDRED_V2, targetProfit),
          targetProfit,
        ),
        misconceptionId: "treated_profit_as_final_mixture_share",
      },
      {
        text: reducedRatioTextV2(
          HUNDRED_V2,
          subtractRational(HUNDRED_V2, targetProfit),
        ),
        misconceptionId: "used_profit_complement",
      },
    ],
    `${input.selectedSeed}:options`,
  );
  return packageExamReadyQuestionV2({
    ...commonInput({ ...input, prototypeId, state }),
    request,
    solution,
    exactState: {
      targetProfitPercent: targetProfit,
      purePart,
      adulterantPart,
    },
    stem: `${actorPhraseV2(state.context.actor)} sells a ${state.context.product}-${state.context.adulterant} mixture at the cost price of pure ${state.context.product} and earns ${percentTextV2(targetProfit)} profit. In what ratio should pure ${state.context.product} and ${state.context.adulterant} be mixed?`,
    answer,
    options,
    visibleLines: [
      `Take the cost of pure ${state.context.product} as 100 units. A ${percentTextV2(targetProfit)} gain requires ${formatRational(targetProfit)} free units of ${state.context.adulterant}.`,
      `Pure ${state.context.product} : ${state.context.adulterant} = 100 : ${formatRational(targetProfit)} = ${answer}.`,
    ],
    commonMistake:
      "Do not treat the profit percentage as the adulterant's percentage of the final mixture.",
    verification: [
      `${formatRational(adulterantPart)}/${formatRational(purePart)} × 100 = ${percentTextV2(targetProfit)}.`,
    ],
    numberProvenance: {
      stemFacts: [`Target profit: ${formatRational(targetProfit)}%`],
      permittedAssumptions: ["Pure-product cost is normalized to 100 units."],
      derivedFacts: [`Required ratio: ${answer}`],
      hiddenStateKeys: [],
    },
  });
}

export function adulterantQuantityQuestionV2(input: {
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
}): MalCp005ExamReadyQuestionV2 {
  const prototypeId =
    "MAL-CP005-PROT-ADULTERANT-QUANTITY-FROM-PURE-AND-TARGET-PROFIT" as const;
  const state = freeStateV2(input.selectedSeed);
  const request: Extract<
    MalCp005SolveRequest,
    { mode: "FREE_ADULTERANT_QUANTITY_FROM_PURE_AND_TARGET" }
  > = {
    mode: "FREE_ADULTERANT_QUANTITY_FROM_PURE_AND_TARGET",
    pureQuantity: state.pureQuantity,
    targetProfitPercent: state.profitPercentAtPureCost,
  };
  const solution = solveMalCp005(request);
  const adulterant = expectQuantity(solution);
  const total = addRational(state.pureQuantity, adulterant);
  const answer = quantityTextV2(adulterant, state.context.unit);
  const options = buildNaturalOptionsV2(
    answer,
    [
      {
        text: quantityTextV2(
          divideRational(
            multiplyRational(state.pureQuantity, state.profitPercentAtPureCost),
            addRational(HUNDRED_V2, state.profitPercentAtPureCost),
          ),
          state.context.unit,
        ),
        misconceptionId: "used_final_mixture_as_percentage_base",
      },
      {
        text: quantityTextV2(total, state.context.unit),
        misconceptionId: "reported_final_mixture_quantity",
      },
      {
        text: quantityTextV2(
          divideRational(
            multiplyRational(state.pureQuantity, state.profitPercentAtPureCost),
            subtractRational(HUNDRED_V2, state.profitPercentAtPureCost),
          ),
          state.context.unit,
        ),
        misconceptionId: "used_profit_complement_as_denominator",
      },
      {
        text: quantityTextV2(
          multiplyRational(state.pureQuantity, state.profitPercentAtPureCost),
          state.context.unit,
        ),
        misconceptionId: "forgot_to_divide_percentage_by_100",
      },
    ],
    `${input.selectedSeed}:options`,
  );
  return packageExamReadyQuestionV2({
    ...commonInput({ ...input, prototypeId, state }),
    request,
    solution,
    exactState: {
      pureQuantity: state.pureQuantity,
      targetProfitPercent: state.profitPercentAtPureCost,
      adulterantQuantity: adulterant,
      finalQuantity: total,
    },
    stem: `${actorPhraseV2(state.context.actor)} has ${quantityTextV2(state.pureQuantity, state.context.unit)} of pure ${state.context.product}. How much ${state.context.adulterant} should be added so that selling the mixture at the cost price of pure ${state.context.product} gives ${percentTextV2(state.profitPercentAtPureCost)} profit?`,
    answer,
    options,
    visibleLines: [
      `${state.context.adulterant} required = ${formatRational(state.pureQuantity)} × ${formatRational(state.profitPercentAtPureCost)}/100.`,
      `${state.context.adulterant} required = ${answer}.`,
    ],
    commonMistake:
      "Use the pure-product quantity as the profit base, not the final mixture quantity.",
    verification: [
      `${formatRational(adulterant)}/${formatRational(state.pureQuantity)} × 100 = ${percentTextV2(state.profitPercentAtPureCost)}.`,
    ],
    numberProvenance: {
      stemFacts: [
        `Pure quantity: ${formatRational(state.pureQuantity)}`,
        `Target profit: ${formatRational(state.profitPercentAtPureCost)}%`,
      ],
      permittedAssumptions: [],
      derivedFacts: [`Adulterant quantity: ${formatRational(adulterant)}`],
      hiddenStateKeys: [],
    },
  });
}

export function pureQuantityQuestionV2(input: {
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
}): MalCp005ExamReadyQuestionV2 {
  const prototypeId =
    "MAL-CP005-PROT-PURE-QUANTITY-FROM-ADULTERANT-AND-TARGET-PROFIT" as const;
  const state = freeStateV2(input.selectedSeed);
  const request: Extract<
    MalCp005SolveRequest,
    { mode: "PURE_QUANTITY_FROM_FREE_ADULTERANT_AND_TARGET" }
  > = {
    mode: "PURE_QUANTITY_FROM_FREE_ADULTERANT_AND_TARGET",
    adulterantQuantity: state.adulterantQuantity,
    targetProfitPercent: state.profitPercentAtPureCost,
  };
  const solution = solveMalCp005(request);
  const pure = expectQuantity(solution);
  const total = addRational(pure, state.adulterantQuantity);
  const answer = quantityTextV2(pure, state.context.unit);
  const options = buildNaturalOptionsV2(
    answer,
    [
      {
        text: quantityTextV2(total, state.context.unit),
        misconceptionId: "reported_final_mixture_quantity",
      },
      {
        text: quantityTextV2(
          divideRational(
            multiplyRational(
              state.adulterantQuantity,
              subtractRational(HUNDRED_V2, state.profitPercentAtPureCost),
            ),
            state.profitPercentAtPureCost,
          ),
          state.context.unit,
        ),
        misconceptionId: "used_profit_complement_as_pure_base",
      },
      {
        text: quantityTextV2(
          divideRational(
            multiplyRational(
              state.adulterantQuantity,
              addRational(HUNDRED_V2, state.profitPercentAtPureCost),
            ),
            HUNDRED_V2,
          ),
          state.context.unit,
        ),
        misconceptionId: "treated_adulterant_as_percentage_base",
      },
      {
        text: quantityTextV2(
          divideRational(
            multiplyRational(state.adulterantQuantity, HUNDRED_V2),
            addRational(HUNDRED_V2, state.profitPercentAtPureCost),
          ),
          state.context.unit,
        ),
        misconceptionId: "used_final_mixture_conversion_formula",
      },
    ],
    `${input.selectedSeed}:options`,
  );
  return packageExamReadyQuestionV2({
    ...commonInput({ ...input, prototypeId, state }),
    request,
    solution,
    exactState: {
      adulterantQuantity: state.adulterantQuantity,
      targetProfitPercent: state.profitPercentAtPureCost,
      pureQuantity: pure,
      finalQuantity: total,
    },
    stem: `${actorPhraseV2(state.context.actor)} adds ${quantityTextV2(state.adulterantQuantity, state.context.unit)} of ${state.context.adulterant} to some pure ${state.context.product} and sells the mixture at the cost price of pure ${state.context.product}, earning ${percentTextV2(state.profitPercentAtPureCost)} profit. How much pure ${state.context.product} was used?`,
    answer,
    options,
    visibleLines: [
      `${formatRational(state.adulterantQuantity)} = pure quantity × ${formatRational(state.profitPercentAtPureCost)}/100.`,
      `Pure quantity = ${formatRational(state.adulterantQuantity)} × 100/${formatRational(state.profitPercentAtPureCost)} = ${answer}.`,
    ],
    commonMistake:
      "The target profit is measured on the pure-product cost, not on the final mixture.",
    verification: [
      `${formatRational(state.adulterantQuantity)}/${formatRational(pure)} × 100 = ${percentTextV2(state.profitPercentAtPureCost)}.`,
    ],
    numberProvenance: {
      stemFacts: [
        `Adulterant quantity: ${formatRational(state.adulterantQuantity)}`,
        `Target profit: ${formatRational(state.profitPercentAtPureCost)}%`,
      ],
      permittedAssumptions: [],
      derivedFacts: [`Pure quantity: ${formatRational(pure)}`],
      hiddenStateKeys: [],
    },
  });
}

export function adulterantPercentQuestionV2(input: {
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
}): MalCp005ExamReadyQuestionV2 {
  const prototypeId =
    "MAL-CP005-PROT-ADULTERANT-PERCENT-FROM-TARGET-PROFIT" as const;
  const state = freeStateV2(input.selectedSeed);
  const request: Extract<
    MalCp005SolveRequest,
    { mode: "ADULTERANT_PERCENT_FROM_TARGET_PROFIT" }
  > = {
    mode: "ADULTERANT_PERCENT_FROM_TARGET_PROFIT",
    targetProfitPercent: state.profitPercentAtPureCost,
  };
  const solution = solveMalCp005(request);
  const adulterantPercent = expectPercent(solution);
  const purePercent = subtractRational(HUNDRED_V2, adulterantPercent);
  const doubledTotalError = divideRational(
    multiplyRational(HUNDRED_V2, state.profitPercentAtPureCost),
    addRational(
      HUNDRED_V2,
      multiplyRational(rational(2), state.profitPercentAtPureCost),
    ),
  );
  const wrongComplementBase = divideRational(
    multiplyRational(HUNDRED_V2, state.profitPercentAtPureCost),
    subtractRational(HUNDRED_V2, state.profitPercentAtPureCost),
  );
  const answer = percentTextV2(adulterantPercent);
  const options = buildNaturalOptionsV2(
    answer,
    [
      {
        text: percentTextV2(state.profitPercentAtPureCost),
        misconceptionId: "equated_profit_percent_with_final_adulterant_percent",
      },
      {
        text: percentTextV2(purePercent),
        misconceptionId: "reported_pure_share_of_final_mixture",
      },
      {
        text: percentTextV2(doubledTotalError),
        misconceptionId: "added_the_free_part_twice_to_final_total",
      },
      {
        text: percentTextV2(wrongComplementBase),
        misconceptionId: "used_profit_complement_as_final_total",
        physicallyPossible:
          compareRational(wrongComplementBase, HUNDRED_V2) <= 0,
      },
    ],
    `${input.selectedSeed}:options`,
  );
  return packageExamReadyQuestionV2({
    ...commonInput({ ...input, prototypeId, state }),
    request,
    solution,
    exactState: {
      targetProfitPercent: state.profitPercentAtPureCost,
      adulterantPercent,
      purePercent,
    },
    stem: `${actorPhraseV2(state.context.actor)} sells an adulterated ${state.context.product} mixture at the cost price of pure ${state.context.product} and earns ${percentTextV2(state.profitPercentAtPureCost)} profit. What percentage of the final mixture is ${state.context.adulterant}?`,
    answer,
    options,
    visibleLines: [
      `Take 100 paid parts of pure ${state.context.product}. The free ${state.context.adulterant} equals ${formatRational(state.profitPercentAtPureCost)} parts.`,
      `${state.context.adulterant} percentage = ${formatRational(state.profitPercentAtPureCost)}/${formatRational(addRational(HUNDRED_V2, state.profitPercentAtPureCost))} × 100 = ${answer}.`,
    ],
    commonMistake:
      "Profit percentage and adulterant percentage use different denominators.",
    verification: [
      `The final mixture has ${formatRational(addRational(HUNDRED_V2, state.profitPercentAtPureCost))} parts, of which ${formatRational(state.profitPercentAtPureCost)} parts are adulterant.`,
    ],
    numberProvenance: {
      stemFacts: [`Target profit: ${formatRational(state.profitPercentAtPureCost)}%`],
      permittedAssumptions: ["Pure-product cost is normalized to 100 paid parts."],
      derivedFacts: [
        `Final mixture: ${formatRational(addRational(HUNDRED_V2, state.profitPercentAtPureCost))} parts`,
        `Adulterant percentage: ${formatRational(adulterantPercent)}%`,
      ],
      hiddenStateKeys: [],
    },
  });
}

export function profitFromAdulterantPercentQuestionV2(input: {
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
}): MalCp005ExamReadyQuestionV2 {
  const prototypeId =
    "MAL-CP005-PROT-PROFIT-FROM-ADULTERANT-PERCENT" as const;
  const state = freeStateV2(input.selectedSeed);
  const request: Extract<
    MalCp005SolveRequest,
    { mode: "TARGET_PROFIT_FROM_ADULTERANT_PERCENT" }
  > = {
    mode: "TARGET_PROFIT_FROM_ADULTERANT_PERCENT",
    adulterantPercentOfMixture: state.finalAdulterantPercent,
  };
  const solution = solveMalCp005(request);
  const profit = expectPercent(solution);
  const purePercent = subtractRational(HUNDRED_V2, state.finalAdulterantPercent);
  const forwardConversionError = divideRational(
    multiplyRational(HUNDRED_V2, state.finalAdulterantPercent),
    addRational(HUNDRED_V2, state.finalAdulterantPercent),
  );
  const omittedPercentConversion = divideRational(
    state.finalAdulterantPercent,
    purePercent,
  );
  const answer = percentTextV2(profit);
  const options = buildNaturalOptionsV2(
    answer,
    [
      {
        text: percentTextV2(state.finalAdulterantPercent),
        misconceptionId: "reported_adulterant_share_as_profit",
      },
      {
        text: percentTextV2(purePercent),
        misconceptionId: "reported_pure_share_of_final_mixture",
      },
      {
        text: percentTextV2(forwardConversionError),
        misconceptionId: "used_the_forward_base_conversion",
      },
      {
        text: percentTextV2(omittedPercentConversion),
        misconceptionId: "forgot_to_multiply_ratio_by_100",
      },
    ],
    `${input.selectedSeed}:options`,
  );
  return packageExamReadyQuestionV2({
    ...commonInput({ ...input, prototypeId, state }),
    request,
    solution,
    exactState: {
      adulterantPercent: state.finalAdulterantPercent,
      purePercent,
      profitPercent: profit,
    },
    stem: `${percentTextV2(state.finalAdulterantPercent)} of a ${state.context.product}-${state.context.adulterant} mixture is ${state.context.adulterant}. The mixture is sold at the cost price of pure ${state.context.product}. What is the profit percentage?`,
    answer,
    options,
    visibleLines: [
      `In 100 parts of mixture, ${formatRational(state.finalAdulterantPercent)} parts are free ${state.context.adulterant} and ${formatRational(purePercent)} parts carry cost.`,
      `Profit percentage = ${formatRational(state.finalAdulterantPercent)}/${formatRational(purePercent)} × 100 = ${answer}.`,
    ],
    commonMistake:
      "Do not report the adulterant's share of the final mixture as the profit rate.",
    verification: [
      `A cost of ${formatRational(purePercent)} units produces ${formatRational(HUNDRED_V2)} units of revenue, so the profit is ${formatRational(state.finalAdulterantPercent)} units.`,
    ],
    numberProvenance: {
      stemFacts: [`Adulterant percentage of final mixture: ${formatRational(state.finalAdulterantPercent)}%`],
      permittedAssumptions: ["The final mixture is normalized to 100 parts."],
      derivedFacts: [
        `Pure-product share: ${formatRational(purePercent)}%`,
        `Profit percentage: ${formatRational(profit)}%`,
      ],
      hiddenStateKeys: [],
    },
  });
}
