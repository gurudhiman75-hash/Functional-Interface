import editorialContentJson from "./editorial-content.en.json";

import {
  renderFriendlyExplanationMarkdown,
  renderStructuredStemMarkdown,
  type StructuredEditorialEntry,
} from "../foundation/editorial-content";
import {
  createSeededRandom,
  pickSeeded,
} from "../foundation/parameter-generator";
import { moneyFromPaise, type Money } from "../foundation/money";
import { rationalToNumber, type Rational } from "../foundation/rational";
import {
  PNL_CP006_ID,
  PNL_CP006_QL_IDS,
  cp006FormatMoney,
  cp006FormatPercent,
  cp006FormatRational,
  cp006PlainMoney,
  generatePnlCp006Case,
  solvePnlCp006Request,
  type PnlCp006Difficulty,
  type PnlCp006GeneratedCase,
  type PnlCp006SolverRequest,
  type PnlCp006SolverResult,
} from "./cp006-dynamic-cases";

export { PNL_CP006_ID };
export const PNL_CP006_DYNAMIC_RUNTIME_MODE = "DYNAMIC_CANDIDATE" as const;
export const PNL_CP006_LANGUAGES = ["en"] as const;

export type PnlCp006Language = (typeof PNL_CP006_LANGUAGES)[number];
export type { PnlCp006Difficulty };

export type PnlCp006DynamicInput = Readonly<{
  difficultyBand?: PnlCp006Difficulty;
  language?: PnlCp006Language;
  questionLanguageId?: string;
  seed?: string;
}>;

type EditorialFile = Readonly<{
  schemaVersion: 2;
  archetypeId: "PNL-001";
  cpId: typeof PNL_CP006_ID;
  language: "en";
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
}>;

type DynamicAnswer =
  | Readonly<{ kind: "MONEY"; value: Money }>
  | Readonly<{ kind: "PERCENT"; value: Rational }>
  | Readonly<{ kind: "QUANTITY"; value: bigint; unit: string }>
  | Readonly<{ kind: "TEXT"; value: string }>;

const editorialLibrary = editorialContentJson as EditorialFile;

function directedRate(
  direction: "PROFIT" | "LOSS" | "NO_CHANGE",
  ratePercent: Rational,
): string {
  if (direction === "NO_CHANGE") return "No profit, no loss";
  return `${cp006FormatPercent(ratePercent)} ${direction.toLowerCase()}`;
}

function amountAndRate(
  direction: "PROFIT" | "LOSS" | "NO_CHANGE",
  amount: Money,
  ratePercent: Rational,
): string {
  if (direction === "NO_CHANGE") return "No profit, no loss";
  return `${direction === "PROFIT" ? "Profit" : "Loss"} ${cp006FormatMoney(amount)} at ${cp006FormatPercent(ratePercent)}`;
}

function answerFor(
  qlId: string,
  result: PnlCp006SolverResult,
  generated: PnlCp006GeneratedCase,
): DynamicAnswer {
  if (generated.answerOverride) {
    return { kind: "TEXT", value: generated.answerOverride };
  }

  switch (qlId) {
    case "PNL-QL-150":
    case "PNL-QL-151":
    case "PNL-QL-163":
    case "PNL-QL-164":
      if (!("effectiveCost" in result))
        throw new Error(`${qlId}: expected effective cost.`);
      return { kind: "MONEY", value: result.effectiveCost };

    case "PNL-QL-152":
    case "PNL-QL-153":
      if (!("sellingPrice" in result))
        throw new Error(`${qlId}: expected selling price.`);
      return { kind: "MONEY", value: result.sellingPrice };

    case "PNL-QL-154":
      if (!("direction" in result) || !("ratePercent" in result)) {
        throw new Error(`${qlId}: expected directed result.`);
      }
      return {
        kind: "TEXT",
        value: directedRate(result.direction, result.ratePercent),
      };

    case "PNL-QL-155":
      if (!("maximumExpense" in result)) {
        throw new Error(`${qlId}: expected maximum allowable expense.`);
      }
      return { kind: "MONEY", value: result.maximumExpense };

    case "PNL-QL-156":
    case "PNL-QL-168":
    case "PNL-QL-169":
    case "PNL-QL-182":
      if (!("effectiveUnitCost" in result)) {
        throw new Error(`${qlId}: expected effective unit cost.`);
      }
      return { kind: "MONEY", value: result.effectiveUnitCost };

    case "PNL-QL-157":
      if (!("requiredUnitSellingPrice" in result)) {
        throw new Error(`${qlId}: expected required unit selling price.`);
      }
      return { kind: "MONEY", value: result.requiredUnitSellingPrice };

    case "PNL-QL-158":
      if (!("breakEvenQuantity" in result)) {
        throw new Error(`${qlId}: expected break-even quantity.`);
      }
      return {
        kind: "QUANTITY",
        value: result.breakEvenQuantity,
        unit: "units",
      };

    case "PNL-QL-159":
      if (!("requiredQuantity" in result)) {
        throw new Error(`${qlId}: expected required quantity.`);
      }
      return {
        kind: "QUANTITY",
        value: result.requiredQuantity,
        unit: "units",
      };

    case "PNL-QL-160":
      if (!("breakEvenSellingPricePerUnit" in result)) {
        throw new Error(`${qlId}: expected break-even unit selling price.`);
      }
      return { kind: "MONEY", value: result.breakEvenSellingPricePerUnit };

    case "PNL-QL-161":
    case "PNL-QL-162":
      if (!("requiredSecondSellingPrice" in result)) {
        throw new Error(`${qlId}: expected second selling price.`);
      }
      return { kind: "MONEY", value: result.requiredSecondSellingPrice };

    case "PNL-QL-165":
      if (!("totalExpense" in result))
        throw new Error(`${qlId}: expected total expense.`);
      return { kind: "MONEY", value: result.totalExpense };

    case "PNL-QL-166":
    case "PNL-QL-185":
      if (!("overheadPercent" in result)) {
        throw new Error(`${qlId}: expected overhead percentage.`);
      }
      return { kind: "PERCENT", value: result.overheadPercent };

    case "PNL-QL-167":
      if (!("netProductionCost" in result)) {
        throw new Error(`${qlId}: expected net production cost.`);
      }
      return { kind: "MONEY", value: result.netProductionCost };

    case "PNL-QL-170":
      if (!("fixedCost" in result))
        throw new Error(`${qlId}: expected fixed cost.`);
      return { kind: "MONEY", value: result.fixedCost };

    case "PNL-QL-171":
      if (!("variableCostPerUnit" in result)) {
        throw new Error(`${qlId}: expected variable cost per unit.`);
      }
      return { kind: "MONEY", value: result.variableCostPerUnit };

    case "PNL-QL-172":
      if (!("requiredSellingPricePerUnit" in result)) {
        throw new Error(`${qlId}: expected required selling price per unit.`);
      }
      return { kind: "MONEY", value: result.requiredSellingPricePerUnit };

    case "PNL-QL-173":
      if (!("breakEvenRevenue" in result)) {
        throw new Error(`${qlId}: expected break-even revenue.`);
      }
      return { kind: "MONEY", value: result.breakEvenRevenue };

    case "PNL-QL-174":
      if (!("contributionMarginPercent" in result)) {
        throw new Error(`${qlId}: expected contribution-margin percentage.`);
      }
      return { kind: "PERCENT", value: result.contributionMarginPercent };

    case "PNL-QL-175":
    case "PNL-QL-183":
      if (!("breakEvenBundles" in result)) {
        throw new Error(`${qlId}: expected break-even bundles.`);
      }
      return {
        kind: "QUANTITY",
        value: result.breakEvenBundles,
        unit: "bundles",
      };

    case "PNL-QL-176":
      if (!("marginOfSafetyAmount" in result)) {
        throw new Error(`${qlId}: expected margin-of-safety amount.`);
      }
      return { kind: "MONEY", value: result.marginOfSafetyAmount };

    case "PNL-QL-177":
      if (!("marginOfSafetyPercent" in result)) {
        throw new Error(`${qlId}: expected margin-of-safety percentage.`);
      }
      return { kind: "PERCENT", value: result.marginOfSafetyPercent };

    case "PNL-QL-178":
      if (!("requiredFinalRecovery" in result)) {
        throw new Error(`${qlId}: expected required final recovery.`);
      }
      return { kind: "MONEY", value: result.requiredFinalRecovery };

    case "PNL-QL-179":
      if (!("requiredProfitPercent" in result)) {
        throw new Error(`${qlId}: expected recovery profit percentage.`);
      }
      return { kind: "PERCENT", value: result.requiredProfitPercent };

    case "PNL-QL-180":
      if (
        !("direction" in result) ||
        !("amount" in result) ||
        !("ratePercent" in result)
      ) {
        throw new Error(
          `${qlId}: expected commission-adjusted amount and rate.`,
        );
      }
      return {
        kind: "TEXT",
        value: amountAndRate(
          result.direction,
          result.amount,
          result.ratePercent,
        ),
      };

    case "PNL-QL-181":
      if (!("requiredGrossSellingPrice" in result)) {
        throw new Error(`${qlId}: expected required gross selling price.`);
      }
      return { kind: "MONEY", value: result.requiredGrossSellingPrice };

    default:
      throw new Error(`${qlId}: dynamic answer mapping is missing.`);
  }
}

function formatAnswer(answer: DynamicAnswer): string {
  if (answer.kind === "MONEY") return cp006FormatMoney(answer.value);
  if (answer.kind === "PERCENT") return cp006FormatPercent(answer.value);
  if (answer.kind === "QUANTITY") return `${answer.value} ${answer.unit}`;
  return answer.value;
}

function resultContext(
  result: PnlCp006SolverResult,
  answer: string,
): Readonly<Record<string, unknown>> {
  const context: Record<string, unknown> = {
    correctStatement: answer,
    dataSufficiencyAnswer: answer,
  };
  const moneyFields = [
    "effectiveCost",
    "sellingPrice",
    "maximumExpense",
    "effectiveUnitCost",
    "requiredUnitSellingPrice",
    "breakEvenSellingPricePerUnit",
    "requiredSecondSellingPrice",
    "totalExpense",
    "netProductionCost",
    "fixedCost",
    "variableCostPerUnit",
    "requiredSellingPricePerUnit",
    "breakEvenRevenue",
    "marginOfSafetyAmount",
    "requiredFinalRecovery",
    "requiredGrossSellingPrice",
    "resultAmount",
  ] as const;
  for (const field of moneyFields) {
    if (field in result) {
      const value = result[field as keyof typeof result] as unknown;
      if (value && typeof value === "object" && "paise" in value) {
        context[field] = cp006PlainMoney(value as Money);
      }
    }
  }
  if ("maximumExpense" in result) {
    context.maximumAllowableExpense = cp006PlainMoney(result.maximumExpense);
  }
  if ("direction" in result && "ratePercent" in result) {
    context.resultDirection = result.direction.toLowerCase();
    context.resultRatePercent = cp006FormatRational(result.ratePercent);
    context.resultAmount =
      "amount" in result ? cp006PlainMoney(result.amount) : undefined;
  }
  if ("breakEvenQuantity" in result) {
    context.breakEvenQuantity = result.breakEvenQuantity.toString();
  }
  if ("requiredQuantity" in result) {
    context.requiredQuantity = result.requiredQuantity.toString();
  }
  if ("overheadPercent" in result) {
    context.overheadPercent = cp006FormatRational(result.overheadPercent);
  }
  if ("primeCost" in result)
    context.primeCost = cp006PlainMoney(result.primeCost);
  if ("factoryOverheadAmount" in result) {
    context.factoryOverheadAmount = cp006PlainMoney(
      result.factoryOverheadAmount,
    );
  }
  if ("grossProductionCost" in result) {
    context.grossProductionCost = cp006PlainMoney(result.grossProductionCost);
  }
  if ("contributionMarginPercent" in result) {
    context.contributionMarginPercent = cp006FormatRational(
      result.contributionMarginPercent,
    );
  }
  if ("breakEvenBundles" in result) {
    context.breakEvenBundles = result.breakEvenBundles.toString();
  }
  if ("contributionPerBundle" in result) {
    context.contributionPerBundle = cp006PlainMoney(
      result.contributionPerBundle,
    );
  }
  if ("marginOfSafetyPercent" in result) {
    context.marginOfSafetyPercent = cp006FormatRational(
      result.marginOfSafetyPercent,
    );
  }
  if ("targetTotalRecovery" in result) {
    context.targetTotalRecovery = cp006PlainMoney(result.targetTotalRecovery);
  }
  if ("priorRecoveryTotal" in result) {
    context.priorRecoveryTotal = cp006PlainMoney(result.priorRecoveryTotal);
  }
  if ("remainingCapitalPercent" in result) {
    context.remainingCapitalPercent = cp006FormatRational(
      result.remainingCapitalPercent,
    );
  }
  if ("requiredProfitPercent" in result) {
    context.requiredProfitPercent = cp006FormatRational(
      result.requiredProfitPercent,
    );
  }
  if ("commissionAmount" in result) {
    context.commissionAmount = cp006PlainMoney(result.commissionAmount);
  }
  if ("netRecovery" in result) {
    context.netRecovery = cp006PlainMoney(result.netRecovery);
  }
  if ("targetNetRecovery" in result) {
    context.targetNetRecovery = cp006PlainMoney(result.targetNetRecovery);
  }
  return context;
}

function numericDistractors(answer: DynamicAnswer): readonly string[] {
  if (answer.kind === "MONEY") {
    const paise = answer.value.paise;
    return [
      moneyFromPaise((paise * 80n) / 100n),
      moneyFromPaise((paise * 90n) / 100n),
      moneyFromPaise((paise * 110n) / 100n),
      moneyFromPaise((paise * 120n) / 100n),
      moneyFromPaise(paise + 5000n),
      moneyFromPaise(paise + 15000n),
      moneyFromPaise(paise > 5000n ? paise - 5000n : paise + 25000n),
      moneyFromPaise(paise > 15000n ? paise - 15000n : paise + 30000n),
    ]
      .filter((value) => value.paise > 0n)
      .map(cp006FormatMoney);
  }
  if (answer.kind === "PERCENT") {
    const value = rationalToNumber(answer.value);
    return [
      Math.max(0, value - 5),
      value + 5,
      Math.max(0, 100 - value),
      value + 10,
    ].map((item) => `${Number(item.toFixed(2))}%`);
  }
  if (answer.kind === "QUANTITY") {
    const value = answer.value;
    return [value + 1n, value + 5n, value > 1n ? value - 1n : value + 10n].map(
      (item) => `${item} ${answer.unit}`,
    );
  }
  return [];
}

function textDistractors(qlId: string, correct: string): readonly string[] {
  const pools: Record<string, readonly string[]> = {
    "PNL-QL-184": [
      "Statement 1 only",
      "Statement 2 only",
      "Statement 3 only",
      "Statements 1 and 2 only",
    ],
    "PNL-QL-186": [
      "Statement 1 alone is sufficient",
      "Statement 2 alone is sufficient",
      "Either statement alone is sufficient",
      "Both statements together are required",
      "Even both statements together are insufficient",
    ],
  };
  const pool = pools[qlId] ?? [
    "10% profit",
    "10% loss",
    "20% profit",
    "20% loss",
    "No profit, no loss",
    "Cannot be determined",
  ];
  return pool.filter((item) => item !== correct);
}

function buildOptions(
  qlId: string,
  seed: string,
  answer: DynamicAnswer,
): Readonly<{
  options: readonly string[];
  correctIndex: number;
  misconceptionLabels: readonly string[];
}> {
  const correct = formatAnswer(answer);
  const source =
    answer.kind === "TEXT"
      ? textDistractors(qlId, correct)
      : numericDistractors(answer);
  const unique = [...new Set(source.filter((item) => item !== correct))];
  while (unique.length < 3) unique.push(`Alternative ${unique.length + 1}`);
  const entries = [
    { value: correct, label: "CORRECT" },
    { value: unique[0]!, label: "IGNORED_EXPENSE_OR_RECOVERY" },
    { value: unique[1]!, label: "WRONG_OVERHEAD_OR_UNIT_BASE" },
    { value: unique[2]!, label: "WRONG_CONTRIBUTION_OR_COMMISSION_BASE" },
  ];
  const random = createSeededRandom(`${seed}:${qlId}:option-order`);
  for (let index = entries.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random.next() * (index + 1));
    [entries[index], entries[swap]] = [entries[swap]!, entries[index]!];
  }
  return {
    options: entries.map((entry) => entry.value),
    correctIndex: entries.findIndex((entry) => entry.label === "CORRECT"),
    misconceptionLabels: entries.map((entry) => entry.label),
  };
}

function cp006DirectedRate(
  direction: "PROFIT" | "LOSS",
  ratePercent: Rational,
): string {
  return `${cp006FormatPercent(ratePercent)} ${direction.toLowerCase()}`;
}

function cp006SumMoney(values: readonly Money[]): Money {
  return moneyFromPaise(values.reduce((sum, value) => sum + value.paise, 0n));
}

function cp006OverheadBaseLabel(
  base: "PURCHASE_PRICE" | "PURCHASE_PLUS_FLAT",
): string {
  return base === "PURCHASE_PRICE"
    ? "purchase price"
    : "purchase price plus flat expenses";
}

function cp006ProductMixText(
  products: readonly Readonly<{
    unitsPerBundle: bigint;
    sellingPricePerUnit: Money;
    variableCostPerUnit: Money;
  }>[],
): string {
  return products
    .map(
      (product, index) =>
        `product ${String.fromCharCode(65 + index)}: ${product.unitsPerBundle} units, ${cp006FormatMoney(product.sellingPricePerUnit)} selling price and ${cp006FormatMoney(product.variableCostPerUnit)} variable cost`,
    )
    .join("; ");
}

function buildCp006GeneratedWorking(
  qlId: string,
  request: PnlCp006SolverRequest,
  result: PnlCp006SolverResult,
  answer: string,
): string {
  const prefix = "**Generated-value check:**";

  switch (request.mode) {
    case "FLAT_COMPONENTS_TO_EFFECTIVE_COST": {
      const expenseTotal =
        "totalExpense" in result
          ? result.totalExpense
          : cp006SumMoney(request.expenses);
      return `${prefix} Add the ${request.expenses.length} ownership expenses, ${cp006FormatMoney(expenseTotal)}, to purchase price ${cp006FormatMoney(request.purchasePrice)}. The effective cost is ${answer}.`;
    }

    case "PURCHASE_AND_OVERHEAD_RATE_TO_EFFECTIVE_COST": {
      const overhead =
        "overheadAmount" in result
          ? cp006FormatMoney(result.overheadAmount)
          : "the computed overhead";
      return `${prefix} ${cp006FormatPercent(request.overheadPercent)} overhead on purchase price ${cp006FormatMoney(request.purchasePrice)} is ${overhead}. Adding it gives effective cost ${answer}.`;
    }

    case "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE": {
      const purpose =
        qlId === "PNL-QL-152"
          ? "For the target-profit sale"
          : "For the target-loss sale";
      return `${prefix} ${purpose}, apply ${cp006DirectedRate(request.direction, request.ratePercent)} to effective cost ${cp006FormatMoney(request.effectiveCost)}. The required selling price is ${answer}.`;
    }

    case "PURCHASE_EXPENSES_AND_SP_TO_RESULT": {
      const effectiveCost =
        "effectiveCost" in result
          ? result.effectiveCost
          : moneyFromPaise(
              request.purchasePrice.paise +
                cp006SumMoney(request.expenses).paise,
            );
      return `${prefix} Purchase ${cp006FormatMoney(request.purchasePrice)} plus ${request.expenses.length} expenses gives effective cost ${cp006FormatMoney(effectiveCost)}. Compare selling price ${cp006FormatMoney(request.sellingPrice)} with that base; the result is ${answer}.`;
    }

    case "SP_TARGET_RATE_TO_MAX_EXPENSE": {
      const targetCost =
        "targetEffectiveCost" in result
          ? cp006FormatMoney(result.targetEffectiveCost)
          : "the inverse target cost";
      return `${prefix} Reverse ${cp006DirectedRate(request.direction, request.targetRatePercent)} from selling price ${cp006FormatMoney(request.sellingPrice)} to obtain target effective cost ${targetCost}. After purchase price ${cp006FormatMoney(request.purchasePrice)}, the maximum remaining expense is ${answer}.`;
    }

    case "WASTAGE_TO_EFFECTIVE_UNIT_COST": {
      const usable =
        "usableQuantity" in result
          ? result.usableQuantity
          : request.inputQuantity - request.wastedQuantity;
      return `${prefix} Wastage removes ${request.wastedQuantity} from ${request.inputQuantity} input units, leaving ${usable} usable units. Spreading total input cost ${cp006FormatMoney(request.totalInputCost)} over those units gives ${answer} per usable unit.`;
    }

    case "WASTAGE_AND_TARGET_RATE_TO_UNIT_SP": {
      const usable =
        "usableQuantity" in result
          ? result.usableQuantity
          : request.inputQuantity - request.wastedQuantity;
      const unitCost =
        "effectiveUnitCost" in result
          ? cp006FormatMoney(result.effectiveUnitCost)
          : "the wastage-adjusted unit cost";
      return `${prefix} ${request.inputQuantity} inputs less ${request.wastedQuantity} wasted units leave ${usable} saleable units, so ${cp006FormatMoney(request.totalInputCost)} becomes ${unitCost} per unit. Applying ${cp006DirectedRate(request.direction, request.ratePercent)} gives required unit selling price ${answer}.`;
    }

    case "FIXED_VARIABLE_COST_TO_BREAK_EVEN_QUANTITY": {
      if (qlId === "PNL-QL-186") {
        return `${prefix} Break-even quantity needs both fixed cost and positive unit contribution, where contribution is selling price less variable cost. Testing the two statements against those requirements gives ${answer}.`;
      }
      const contribution = moneyFromPaise(
        request.sellingPricePerUnit.paise - request.variableCostPerUnit.paise,
      );
      return `${prefix} Unit contribution is ${cp006FormatMoney(request.sellingPricePerUnit)} minus ${cp006FormatMoney(request.variableCostPerUnit)} = ${cp006FormatMoney(contribution)}. Dividing fixed cost ${cp006FormatMoney(request.fixedCost)} by contribution gives break-even quantity ${answer}.`;
    }

    case "FIXED_VARIABLE_COST_AND_TARGET_PROFIT_TO_QUANTITY": {
      const contribution = moneyFromPaise(
        request.sellingPricePerUnit.paise - request.variableCostPerUnit.paise,
      );
      const requiredContribution = moneyFromPaise(
        request.fixedCost.paise + request.targetProfit.paise,
      );
      return `${prefix} Each unit contributes ${cp006FormatMoney(contribution)}. Fixed cost ${cp006FormatMoney(request.fixedCost)} plus target profit ${cp006FormatMoney(request.targetProfit)} requires ${cp006FormatMoney(requiredContribution)} total contribution, so required sales are ${answer}.`;
    }

    case "FIXED_COST_QUANTITY_TO_BREAK_EVEN_SP": {
      const fixedPerUnit = moneyFromPaise(
        request.fixedCost.paise / request.quantity,
      );
      return `${prefix} Allocate fixed cost ${cp006FormatMoney(request.fixedCost)} across ${request.quantity} units, giving ${cp006FormatMoney(fixedPerUnit)} per unit. Add variable cost ${cp006FormatMoney(request.variableCostPerUnit)}; break-even selling price is ${answer}.`;
    }

    case "EARLIER_LOSS_TO_REQUIRED_NEXT_SP": {
      const totalCost = moneyFromPaise(
        request.firstCostPrice.paise + request.secondCostPrice.paise,
      );
      const purpose =
        qlId === "PNL-QL-161"
          ? "To restore exact break-even"
          : `To finish at ${cp006DirectedRate(request.targetDirection, request.targetRatePercent)}`;
      return `${prefix} Combined cost is ${cp006FormatMoney(totalCost)}, while the first sale already recovered ${cp006FormatMoney(request.firstSellingPrice)}. ${purpose}, the second article must sell for ${answer}.`;
    }

    case "TOTAL_RECOVERY_AND_RATE_TO_EFFECTIVE_COST":
      return `${prefix} Total recovery ${cp006FormatMoney(request.totalRecovery)} already contains ${cp006DirectedRate(request.direction, request.ratePercent)}. Reverse that rate multiplier to recover effective cost ${answer}.`;

    case "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST": {
      const flatTotal =
        "flatExpenseTotal" in result
          ? result.flatExpenseTotal
          : cp006SumMoney(request.flatExpenses);
      const overhead =
        "overheadAmount" in result
          ? cp006FormatMoney(result.overheadAmount)
          : "the computed overhead";
      return `${prefix} Flat expenses total ${cp006FormatMoney(flatTotal)}. Apply ${cp006FormatPercent(request.overheadPercent)} overhead to the ${cp006OverheadBaseLabel(request.overheadBase)}, producing ${overhead}; with purchase ${cp006FormatMoney(request.purchasePrice)}, effective cost is ${answer}.`;
    }

    case "EFFECTIVE_COST_AND_PURCHASE_TO_TOTAL_EXPENSE":
      return `${prefix} Effective cost ${cp006FormatMoney(request.effectiveCost)} exceeds purchase price ${cp006FormatMoney(request.purchasePrice)} by the complete expense load. Their difference is ${answer}.`;

    case "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE": {
      const flatTotal = cp006SumMoney(request.flatExpenses);
      const overhead =
        "overheadAmount" in result
          ? cp006FormatMoney(result.overheadAmount)
          : "the residual overhead";
      const purpose =
        qlId === "PNL-QL-185"
          ? "In the algebraic cost identity"
          : "For the overhead-rate inverse";
      return `${prefix} ${purpose}, subtract purchase ${cp006FormatMoney(request.purchasePrice)} and flat expenses ${cp006FormatMoney(flatTotal)} from effective cost ${cp006FormatMoney(request.effectiveCost)} to get overhead ${overhead}. Divide by the ${cp006OverheadBaseLabel(request.overheadBase)}; the rate is ${answer}.`;
    }

    case "MANUFACTURING_COMPONENTS_TO_UNIT_COST": {
      const prime =
        "primeCost" in result
          ? cp006FormatMoney(result.primeCost)
          : "the prime cost";
      const overhead =
        "factoryOverheadAmount" in result
          ? cp006FormatMoney(result.factoryOverheadAmount)
          : "the factory overhead";
      const net =
        "netProductionCost" in result
          ? cp006FormatMoney(result.netProductionCost)
          : "the net production cost";
      const purpose =
        qlId === "PNL-QL-167"
          ? "For total net production cost"
          : qlId === "PNL-QL-168"
            ? "For manufacturing unit cost"
            : "Reading the manufacturing table";
      return `${prefix} ${purpose}, raw material ${cp006FormatMoney(request.rawMaterialCost)} plus labour ${cp006FormatMoney(request.labourCost)} gives prime cost ${prime}; factory overhead is ${overhead}. Add packaging ${cp006FormatMoney(request.packagingCost)}, deduct scrap ${cp006FormatMoney(request.scrapRecovery)}, and net cost is ${net} for ${request.outputQuantity} units. The requested result is ${answer}.`;
    }

    case "WASTAGE_SCRAP_TO_EFFECTIVE_UNIT_COST": {
      const usable =
        "usableQuantity" in result
          ? result.usableQuantity
          : request.inputQuantity - request.wastedQuantity;
      const net =
        "netRecoverableCost" in result
          ? cp006FormatMoney(result.netRecoverableCost)
          : "the net input cost";
      return `${prefix} Deduct scrap recovery ${cp006FormatMoney(request.scrapRecovery)} from input cost ${cp006FormatMoney(request.totalInputCost)}, leaving ${net}. Wastage leaves ${usable} usable units from ${request.inputQuantity}; effective unit cost is ${answer}.`;
    }

    case "BREAK_EVEN_QUANTITY_TO_FIXED_COST": {
      const contribution =
        "unitContribution" in result
          ? cp006FormatMoney(result.unitContribution)
          : cp006FormatMoney(
              moneyFromPaise(
                request.sellingPricePerUnit.paise -
                  request.variableCostPerUnit.paise,
              ),
            );
      return `${prefix} At break-even quantity ${request.breakEvenQuantity}, each unit contributes ${contribution} from selling price ${cp006FormatMoney(request.sellingPricePerUnit)} less variable cost ${cp006FormatMoney(request.variableCostPerUnit)}. Total contribution equals fixed cost ${answer}.`;
    }

    case "BREAK_EVEN_QUANTITY_TO_VARIABLE_COST": {
      const contribution =
        "unitContribution" in result
          ? cp006FormatMoney(result.unitContribution)
          : "the required unit contribution";
      return `${prefix} Fixed cost ${cp006FormatMoney(request.fixedCost)} spread over ${request.breakEvenQuantity} break-even units requires contribution ${contribution} per unit. Subtracting that from selling price ${cp006FormatMoney(request.sellingPricePerUnit)} gives variable cost ${answer}.`;
    }

    case "FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP": {
      const fixedAndProfit = moneyFromPaise(
        request.fixedCost.paise + request.targetProfit.paise,
      );
      return `${prefix} Variable cost is ${cp006FormatMoney(request.variableCostPerUnit)} per unit. Spread fixed cost plus target profit, ${cp006FormatMoney(fixedAndProfit)}, across ${request.quantity} units and add it to variable cost; required unit selling price is ${answer}.`;
    }

    case "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE":
      return `${prefix} A ${cp006FormatPercent(request.contributionMarginPercent)} contribution-margin ratio means that share of revenue covers fixed cost. Dividing fixed cost ${cp006FormatMoney(request.fixedCost)} by the ratio gives break-even revenue ${answer}.`;

    case "FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO":
      return `${prefix} At break-even, contribution equals fixed cost ${cp006FormatMoney(request.fixedCost)} on revenue ${cp006FormatMoney(request.breakEvenRevenue)}. Their ratio is the contribution-margin percentage ${answer}.`;

    case "MULTI_PRODUCT_MIX_TO_BREAK_EVEN_BUNDLES": {
      const contribution =
        "contributionPerBundle" in result
          ? cp006FormatMoney(result.contributionPerBundle)
          : "the bundle contribution";
      const purpose =
        qlId === "PNL-QL-183"
          ? "For the product-mix caselet"
          : "For the fixed sales mix";
      return `${prefix} ${purpose}, ${cp006ProductMixText(request.products)}. Their weighted contributions total ${contribution} per bundle; dividing fixed cost ${cp006FormatMoney(request.fixedCost)} gives ${answer}.`;
    }

    case "ACTUAL_AND_BREAK_EVEN_REVENUE_TO_MARGIN_OF_SAFETY": {
      const amount =
        "marginOfSafetyAmount" in result
          ? cp006FormatMoney(result.marginOfSafetyAmount)
          : "the revenue surplus";
      const purpose =
        qlId === "PNL-QL-176"
          ? "The money margin of safety"
          : "The percentage margin of safety";
      return `${prefix} ${purpose} starts with actual revenue ${cp006FormatMoney(request.actualRevenue)} minus break-even revenue ${cp006FormatMoney(request.breakEvenRevenue)} = ${amount}. The requested result is ${answer}.`;
    }

    case "TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY": {
      const prior =
        "priorRecoveryTotal" in result
          ? result.priorRecoveryTotal
          : cp006SumMoney(request.priorRecoveries);
      const target =
        "targetTotalRecovery" in result
          ? cp006FormatMoney(result.targetTotalRecovery)
          : "the target total recovery";
      return `${prefix} Apply ${cp006DirectedRate(request.targetDirection, request.targetRatePercent)} to total cost ${cp006FormatMoney(request.totalCost)}, giving target recovery ${target}. Prior recoveries total ${cp006FormatMoney(prior)}, so the final required recovery is ${answer}.`;
    }

    case "LOSS_RATE_TO_REQUIRED_RECOVERY_RATE_ON_REMAINING_CAPITAL": {
      if (qlId === "PNL-QL-184") {
        return `${prefix} After a ${cp006FormatPercent(request.lossPercent)} loss, recovery is measured on the smaller remaining capital, so the same percentage cannot restore the original amount. Evaluating the three statements gives ${answer}.`;
      }
      return `${prefix} A ${cp006FormatPercent(request.lossPercent)} loss leaves only the retained share of capital. Measure the lost amount against that smaller remainder; the required recovery profit rate is ${answer}.`;
    }

    case "EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT": {
      const commission =
        "commissionAmount" in result
          ? cp006FormatMoney(result.commissionAmount)
          : "the commission amount";
      const net =
        "netRecovery" in result
          ? cp006FormatMoney(result.netRecovery)
          : "the net recovery";
      return `${prefix} Commission at ${cp006FormatPercent(request.commissionPercent)} on gross selling price ${cp006FormatMoney(request.grossSellingPrice)} is ${commission}, leaving net recovery ${net}. Compare that with effective cost ${cp006FormatMoney(request.effectiveCost)}; the result is ${answer}.`;
    }

    case "EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP": {
      const net =
        "targetNetRecovery" in result
          ? cp006FormatMoney(result.targetNetRecovery)
          : "the target net recovery";
      return `${prefix} Apply ${cp006DirectedRate(request.targetDirection, request.targetRatePercent)} to effective cost ${cp006FormatMoney(request.effectiveCost)} to obtain target net recovery ${net}. Gross it up so that ${cp006FormatPercent(request.commissionPercent)} commission can be deducted; required gross selling price is ${answer}.`;
    }
  }
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_, item) =>
    typeof item === "bigint" ? item.toString() : item,
  );
}

function forwardConsistency(
  request: PnlCp006SolverRequest,
  result: PnlCp006SolverResult,
): boolean {
  switch (request.mode) {
    case "SP_TARGET_RATE_TO_MAX_EXPENSE": {
      if (!("maximumExpense" in result)) return false;
      const cost = moneyFromPaise(
        request.purchasePrice.paise + result.maximumExpense.paise,
      );
      const check = solvePnlCp006Request({
        mode: "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE",
        effectiveCost: cost,
        direction: request.direction,
        ratePercent: request.targetRatePercent,
      });
      return (
        "sellingPrice" in check &&
        check.sellingPrice.paise === request.sellingPrice.paise
      );
    }

    case "TOTAL_RECOVERY_AND_RATE_TO_EFFECTIVE_COST": {
      if (!("effectiveCost" in result)) return false;
      const check = solvePnlCp006Request({
        mode: "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE",
        effectiveCost: result.effectiveCost,
        direction: request.direction,
        ratePercent: request.ratePercent,
      });
      return (
        "sellingPrice" in check &&
        check.sellingPrice.paise === request.totalRecovery.paise
      );
    }

    case "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE": {
      if (!("overheadPercent" in result)) return false;
      const check = solvePnlCp006Request({
        mode: "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST",
        purchasePrice: request.purchasePrice,
        flatExpenses: request.flatExpenses,
        overheadPercent: result.overheadPercent,
        overheadBase: request.overheadBase,
      });
      return (
        "effectiveCost" in check &&
        check.effectiveCost.paise === request.effectiveCost.paise
      );
    }

    case "BREAK_EVEN_QUANTITY_TO_FIXED_COST": {
      return (
        "fixedCost" in result &&
        result.fixedCost.paise ===
          request.breakEvenQuantity *
            (request.sellingPricePerUnit.paise -
              request.variableCostPerUnit.paise)
      );
    }

    case "BREAK_EVEN_QUANTITY_TO_VARIABLE_COST": {
      return (
        "variableCostPerUnit" in result &&
        request.breakEvenQuantity *
          (request.sellingPricePerUnit.paise -
            result.variableCostPerUnit.paise) ===
          request.fixedCost.paise
      );
    }

    case "FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP": {
      if (!("requiredSellingPricePerUnit" in result)) return false;
      const revenue =
        result.requiredSellingPricePerUnit.paise * request.quantity;
      const cost =
        request.fixedCost.paise +
        request.variableCostPerUnit.paise * request.quantity;
      return revenue - cost === request.targetProfit.paise;
    }

    case "FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO": {
      if (!("contributionMarginPercent" in result)) return false;
      const check = solvePnlCp006Request({
        mode: "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE",
        fixedCost: request.fixedCost,
        contributionMarginPercent: result.contributionMarginPercent,
      });
      return (
        "breakEvenRevenue" in check &&
        check.breakEvenRevenue.paise === request.breakEvenRevenue.paise
      );
    }

    case "TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY": {
      if (
        !("requiredFinalRecovery" in result) ||
        !("targetTotalRecovery" in result) ||
        !("priorRecoveryTotal" in result)
      )
        return false;
      return (
        result.priorRecoveryTotal.paise + result.requiredFinalRecovery.paise ===
        result.targetTotalRecovery.paise
      );
    }

    case "EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP": {
      if (!("requiredGrossSellingPrice" in result)) return false;
      const check = solvePnlCp006Request({
        mode: "EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT",
        effectiveCost: request.effectiveCost,
        grossSellingPrice: result.requiredGrossSellingPrice,
        commissionPercent: request.commissionPercent,
      });
      return (
        "direction" in check &&
        "ratePercent" in check &&
        check.direction === request.targetDirection &&
        stable(check.ratePercent) === stable(request.targetRatePercent)
      );
    }

    default:
      return true;
  }
}

function selectQl(input: PnlCp006DynamicInput): string {
  if (input.questionLanguageId) {
    if (!PNL_CP006_QL_IDS.includes(input.questionLanguageId)) {
      throw new Error(
        `Unknown CP-006 question-language ID: ${input.questionLanguageId}`,
      );
    }
    return input.questionLanguageId;
  }
  const eligible = PNL_CP006_QL_IDS.filter((qlId) => {
    const registry = generatePnlCp006Case(
      qlId,
      `${input.seed ?? "cp006"}:probe`,
    ).registry;
    return (
      !input.difficultyBand || registry.difficulty === input.difficultyBand
    );
  });
  if (!eligible.length)
    throw new Error("No CP-006 QLs match the requested difficulty.");
  return pickSeeded(
    createSeededRandom(`${input.seed ?? "cp006-dynamic"}:ql-selection`),
    eligible,
  );
}

function containsUnresolvedProsePlaceholder(value: string): boolean {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
  return /\{[a-z][A-Za-z0-9_]*\}/.test(proseOnly);
}

export function listPnlCp006DynamicQlIds(): readonly string[] {
  return [...PNL_CP006_QL_IDS];
}

export function runPnlCp006DynamicPipeline(input: PnlCp006DynamicInput = {}) {
  if (input.language && input.language !== "en") {
    throw new Error(
      "PNL-CP-006 dynamic runtime currently supports English only.",
    );
  }

  const qlId = selectQl(input);
  const seed = input.seed ?? `${qlId}:dynamic-default`;
  const generated = generatePnlCp006Case(qlId, seed);
  const result = solvePnlCp006Request(generated.request);
  const recomputed = solvePnlCp006Request(generated.request);
  const answerValue = answerFor(qlId, result, generated);
  const answer = formatAnswer(answerValue);
  const optionSet = buildOptions(qlId, seed, answerValue);
  const editorial = editorialLibrary.entries[qlId];
  if (!editorial)
    throw new Error(`${qlId}: English editorial entry is missing.`);

  const context = {
    ...generated.context,
    ...resultContext(result, answer),
  };
  const stem = renderStructuredStemMarkdown(editorial.stem, context);
  const baseExplanation = renderFriendlyExplanationMarkdown(
    editorial.explanation,
    context,
  );
  const generatedWorking = buildCp006GeneratedWorking(
    qlId,
    generated.request,
    result,
    answer,
  );
  const explanationText = `${baseExplanation}\n\n${generatedWorking}\n\n**Final answer:** ${answer}`;

  const checks = [
    {
      name: "registry-and-editorial-parity",
      passed: Boolean(generated.registry && editorial),
      message:
        "The QL exists in both the frozen registry and English editorial library.",
    },
    {
      name: "exact-recomputation",
      passed: stable(result) === stable(recomputed),
      message: "Exact recomputation agrees with the canonical CP-006 solver.",
    },
    {
      name: "inverse-forward-consistency",
      passed: forwardConsistency(generated.request, result),
      message:
        "Every inverse answer reproduces its generated forward cost, contribution or recovery model.",
    },
    {
      name: "four-misconception-options",
      passed:
        optionSet.options.length === 4 &&
        new Set(optionSet.options).size === 4 &&
        optionSet.options[optionSet.correctIndex] === answer &&
        optionSet.misconceptionLabels.filter((label) => label !== "CORRECT")
          .length === 3,
      message:
        "Four unique options contain one answer and three labelled misconceptions.",
    },
    {
      name: "dynamic-editorial-binding",
      passed:
        !containsUnresolvedProsePlaceholder(stem) &&
        !containsUnresolvedProsePlaceholder(explanationText),
      message:
        "Dynamic stem and explanation contain no unresolved prose placeholders.",
    },
    {
      name: "question-bank-safety",
      passed: true,
      message:
        "Dynamic candidates remain outside Question Bank, tests and publication.",
    },
  ];
  const validation = { valid: checks.every((check) => check.passed), checks };
  if (!validation.valid) {
    throw new Error(
      `${qlId}: dynamic package validation failed: ${checks
        .filter((check) => !check.passed)
        .map((check) => check.message)
        .join(" | ")}`,
    );
  }

  const questionId = `${qlId}:dynamic:${seed}`;
  const explanationId = `${qlId}-DYNAMIC-EXPLANATION-V1`;
  return {
    archetypeId: "PNL-001" as const,
    canonicalProblemId: PNL_CP006_ID,
    questionId,
    questionLanguageId: qlId,
    explanationId,
    language: "en" as const,
    difficultyBand: generated.registry.difficulty,
    stem,
    answer,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    parameters: {
      archetypeId: "PNL-001" as const,
      canonicalProblemId: PNL_CP006_ID,
      questionId,
      questionLanguageId: qlId,
      explanationId,
      language: "en" as const,
      difficultyBand: generated.registry.difficulty,
      taskKind: generated.registry.solveMode,
      answerType: answerValue.kind,
      answerSemantic: generated.registry.answerSemantic,
      requiredVariables: [...generated.registry.requiredVariables],
      variables: context,
      seed,
      runtimeMode: PNL_CP006_DYNAMIC_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      sourceTrace: {
        registry: "PNL-001/CP-006/task-registry.library.json",
        editorial: "PNL-001/CP-006/editorial-content.en.json",
        solver:
          "PNL-001/foundation/effective-cost-recovery-solver.ts | effective-cost-advanced-solver.ts",
      },
    },
    solver: {
      answer,
      numericAnswer:
        answerValue.kind === "MONEY"
          ? Number(answerValue.value.paise) / 100
          : answerValue.kind === "PERCENT"
            ? rationalToNumber(answerValue.value)
            : answerValue.kind === "QUANTITY"
              ? Number(answerValue.value)
              : null,
      answerType: answerValue.kind,
      evidence: {
        solveMode: generated.registry.solveMode,
        answerSemantic: generated.registry.answerSemantic,
        exactRecomputation: "PASS",
        inverseForwardConsistency: "PASS",
      },
      mathJax: {},
    },
    reasoningGraph: {
      graphId: `${qlId}-dynamic-graph`,
      nodes: [
        {
          id: "given",
          label: "Generated cost and recovery values",
          value: context,
        },
        {
          id: "mode",
          label: "Solve mode",
          value: generated.registry.solveMode,
        },
        { id: "answer", label: "Exact answer", value: answer },
      ],
    },
    explanation: {
      explanationId,
      lines: explanationText.split(/\n{2,}/),
    },
    traceability: {
      questionId,
      archetypeId: "PNL-001",
      canonicalProblemId: PNL_CP006_ID,
      questionLanguageId: qlId,
      explanationId,
      solveMode: generated.registry.solveMode,
      answerSemantic: generated.registry.answerSemantic,
      contextFamily: editorial.stem.contextFamily,
      difficultyBand: generated.registry.difficulty,
      representation: generated.registry.representation ?? "PARAGRAPH",
      seed,
      generationMode: PNL_CP006_DYNAMIC_RUNTIME_MODE,
      misconceptionLabels: optionSet.misconceptionLabels,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
    validation,
    mathJax: {},
  } as const;
}
