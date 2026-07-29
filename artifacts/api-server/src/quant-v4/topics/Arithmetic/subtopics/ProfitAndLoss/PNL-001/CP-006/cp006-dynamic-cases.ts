import taskRegistryJson from "./task-registry.library.json";

import {
  createSeededRandom,
  pickSeeded,
  type SeededRandom,
} from "../foundation/parameter-generator";
import {
  rational,
  rationalToNumber,
  type Rational,
} from "../foundation/rational";
import {
  moneyFromPaise,
  moneyFromRupees,
  type Money,
} from "../foundation/money";
import {
  solveEffectiveCostRecovery,
  type EffectiveCostRecoveryRequest,
  type EffectiveCostRecoveryResult,
} from "../foundation/effective-cost-recovery-solver";
import {
  solveEffectiveCostAdvanced,
  type EffectiveCostAdvancedRequest,
  type EffectiveCostAdvancedResult,
  type OverheadBase,
  type ProductMixItem,
} from "../foundation/effective-cost-advanced-solver";

export const PNL_CP006_ID = "PNL-CP-006" as const;
export type PnlCp006Difficulty = "Easy" | "Medium" | "Hard";

export type PnlCp006RegistryEntry = Readonly<{
  solveMode: string;
  answerSemantic: string;
  requiredVariables: readonly string[];
  difficulty: PnlCp006Difficulty;
  representation?: string;
}>;

type RegistryFile = Readonly<{
  archetypeId: "PNL-001";
  cpId: typeof PNL_CP006_ID;
  entries: Readonly<Record<string, PnlCp006RegistryEntry>>;
}>;

export type PnlCp006SolverRequest =
  | EffectiveCostRecoveryRequest
  | EffectiveCostAdvancedRequest;
export type PnlCp006SolverResult =
  | EffectiveCostRecoveryResult
  | EffectiveCostAdvancedResult;

export type PnlCp006GeneratedCase = Readonly<{
  qlId: string;
  registry: PnlCp006RegistryEntry;
  request: PnlCp006SolverRequest;
  context: Readonly<Record<string, unknown>>;
  seed: string;
  answerOverride?: string;
}>;

const taskRegistry = taskRegistryJson as RegistryFile;
export const PNL_CP006_QL_IDS = Object.keys(taskRegistry.entries);

const PURCHASE_PRICES = [10000, 12000, 15000, 20000, 24000] as const;
const FLAT_EXPENSES = [500, 800, 1000, 1200, 1500, 2000] as const;
const RATES = [10, 20, 25] as const;
const OVERHEAD_RATES = [5, 10, 20] as const;
const UNIT_COSTS = [100, 120, 150, 200, 250] as const;
const CONTRIBUTIONS = [50, 100, 150, 200] as const;
const QUANTITIES = [40n, 50n, 80n, 100n, 120n] as const;
const COMMISSIONS = [10, 20, 25] as const;

const MANUFACTURING_PRESETS = [
  {
    raw: 12000,
    labour: 8000,
    overhead: 10,
    packaging: 2000,
    scrap: 2000,
    output: 100n,
  },
  {
    raw: 15000,
    labour: 10000,
    overhead: 20,
    packaging: 3000,
    scrap: 3000,
    output: 100n,
  },
  {
    raw: 18000,
    labour: 12000,
    overhead: 10,
    packaging: 4000,
    scrap: 1000,
    output: 120n,
  },
] as const;

const WASTAGE_SCRAP_PRESETS = [
  { input: 100n, wasted: 20n, totalCost: 10000, scrap: 2000 },
  { input: 120n, wasted: 20n, totalCost: 17000, scrap: 5000 },
  { input: 100n, wasted: 10n, totalCost: 16500, scrap: 3000 },
] as const;

const PRODUCT_MIX_PRESETS = [
  {
    fixedCost: 10000,
    products: [
      { units: 2n, sp: 100, vc: 60 },
      { units: 1n, sp: 200, vc: 120 },
    ],
  },
  {
    fixedCost: 15000,
    products: [
      { units: 3n, sp: 120, vc: 80 },
      { units: 2n, sp: 180, vc: 100 },
    ],
  },
  {
    fixedCost: 12000,
    products: [
      { units: 1n, sp: 150, vc: 90 },
      { units: 2n, sp: 100, vc: 50 },
    ],
  },
] as const;

const ADVANCED_MODES = new Set([
  "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST",
  "EFFECTIVE_COST_AND_PURCHASE_TO_TOTAL_EXPENSE",
  "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE",
  "MANUFACTURING_COMPONENTS_TO_UNIT_COST",
  "WASTAGE_SCRAP_TO_EFFECTIVE_UNIT_COST",
  "BREAK_EVEN_QUANTITY_TO_FIXED_COST",
  "BREAK_EVEN_QUANTITY_TO_VARIABLE_COST",
  "FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP",
  "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE",
  "FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO",
  "MULTI_PRODUCT_MIX_TO_BREAK_EVEN_BUNDLES",
  "ACTUAL_AND_BREAK_EVEN_REVENUE_TO_MARGIN_OF_SAFETY",
  "TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY",
  "LOSS_RATE_TO_REQUIRED_RECOVERY_RATE_ON_REMAINING_CAPITAL",
  "EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT",
  "EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP",
]);

export function cp006PlainMoney(value: Money): string {
  const whole = value.paise / 100n;
  const remainder = value.paise % 100n;
  if (remainder === 0n) return whole.toString();
  return `${whole}.${remainder.toString().padStart(2, "0")}`;
}

export function cp006FormatMoney(value: Money): string {
  return `₹${cp006PlainMoney(value)}`;
}

export function cp006FormatRational(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return rationalToNumber(value)
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1");
}

export function cp006FormatPercent(value: Rational): string {
  return `${cp006FormatRational(value)}%`;
}

function rupees(value: number): Money {
  return moneyFromRupees(value);
}

function pickNumber(random: SeededRandom, values: readonly number[]): number {
  return pickSeeded(random, values);
}

function direction(random: SeededRandom): "PROFIT" | "LOSS" {
  return pickSeeded(random, ["PROFIT", "LOSS"] as const);
}

function effectiveCost(
  purchasePrice: Money,
  expenses: readonly Money[],
): Money {
  return solveEffectiveCostRecovery({
    mode: "FLAT_COMPONENTS_TO_EFFECTIVE_COST",
    purchasePrice,
    expenses,
  }).effectiveCost;
}

function sellingPrice(
  cost: Money,
  resultDirection: "PROFIT" | "LOSS",
  ratePercent: Rational,
): Money {
  return solveEffectiveCostRecovery({
    mode: "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE",
    effectiveCost: cost,
    direction: resultDirection,
    ratePercent,
  }).sellingPrice;
}

function flatExpenseText(expenses: readonly Money[]): string {
  return expenses.map(cp006FormatMoney).join(", ");
}

function overheadBaseText(base: OverheadBase): string {
  return base === "PURCHASE_PRICE"
    ? "purchase price"
    : "purchase price plus flat expenses";
}

function productMixText(products: readonly ProductMixItem[]): string {
  return products
    .map(
      (product, index) =>
        `Product ${String.fromCharCode(65 + index)}: ${product.unitsPerBundle} unit(s), selling price ${cp006FormatMoney(product.sellingPricePerUnit)}, variable cost ${cp006FormatMoney(product.variableCostPerUnit)}`,
    )
    .join("; ");
}

function productMixRows(
  products: readonly ProductMixItem[],
): readonly (readonly string[])[] {
  return products.map((product, index) => [
    `Product ${String.fromCharCode(65 + index)}`,
    product.unitsPerBundle.toString(),
    cp006FormatMoney(product.sellingPricePerUnit),
    cp006FormatMoney(product.variableCostPerUnit),
  ]);
}

export function solvePnlCp006Request(
  request: PnlCp006SolverRequest,
): PnlCp006SolverResult {
  return ADVANCED_MODES.has(request.mode)
    ? solveEffectiveCostAdvanced(request as EffectiveCostAdvancedRequest)
    : solveEffectiveCostRecovery(request as EffectiveCostRecoveryRequest);
}

function mixedOverheadCase(random: SeededRandom) {
  const purchasePrice = rupees(pickNumber(random, PURCHASE_PRICES));
  const flatExpenses = [
    rupees(pickNumber(random, FLAT_EXPENSES)),
    rupees(pickNumber(random, FLAT_EXPENSES)),
  ];
  const overheadPercent = rational(pickNumber(random, OVERHEAD_RATES));
  const overheadBase = pickSeeded(random, [
    "PURCHASE_PRICE",
    "PURCHASE_PLUS_FLAT",
  ] as const);
  const result = solveEffectiveCostAdvanced({
    mode: "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST",
    purchasePrice,
    flatExpenses,
    overheadPercent,
    overheadBase,
  });
  return {
    purchasePrice,
    flatExpenses,
    overheadPercent,
    overheadBase,
    result,
    context: {
      purchasePrice: cp006PlainMoney(purchasePrice),
      flatExpenses: flatExpenseText(flatExpenses),
      overheadPercent: cp006FormatRational(overheadPercent),
      overheadBase: overheadBaseText(overheadBase),
      effectiveCost: cp006PlainMoney(result.effectiveCost),
    },
  };
}

function manufacturingCase(random: SeededRandom) {
  const preset = pickSeeded(random, MANUFACTURING_PRESETS);
  const request = {
    mode: "MANUFACTURING_COMPONENTS_TO_UNIT_COST" as const,
    rawMaterialCost: rupees(preset.raw),
    labourCost: rupees(preset.labour),
    factoryOverheadPercentOnPrimeCost: rational(preset.overhead),
    packagingCost: rupees(preset.packaging),
    outputQuantity: preset.output,
    scrapRecovery: rupees(preset.scrap),
  };
  const result = solveEffectiveCostAdvanced(request);
  return {
    request,
    result,
    context: {
      rawMaterialCost: preset.raw,
      labourCost: preset.labour,
      factoryOverheadPercent: preset.overhead,
      packagingCost: preset.packaging,
      outputQuantity: preset.output.toString(),
      scrapRecovery: preset.scrap,
      manufacturingTable: [
        [
          "Raw material",
          cp006FormatMoney(request.rawMaterialCost),
          "Direct amount",
        ],
        ["Labour", cp006FormatMoney(request.labourCost), "Direct amount"],
        ["Factory overhead", `${preset.overhead}%`, "Prime cost"],
        ["Packaging", cp006FormatMoney(request.packagingCost), "Direct amount"],
      ],
    },
  };
}

export function generatePnlCp006Case(
  qlId: string,
  seedValue: string,
): PnlCp006GeneratedCase {
  const registry = taskRegistry.entries[qlId];
  if (!registry) throw new Error(`Unknown CP-006 QL: ${qlId}`);
  const random = createSeededRandom(`${seedValue}:${qlId}:parameters`);

  switch (qlId) {
    case "PNL-QL-150": {
      const purchasePrice = rupees(pickNumber(random, PURCHASE_PRICES));
      const expenses = [
        rupees(pickNumber(random, FLAT_EXPENSES)),
        rupees(pickNumber(random, FLAT_EXPENSES)),
        rupees(pickNumber(random, FLAT_EXPENSES)),
      ];
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FLAT_COMPONENTS_TO_EFFECTIVE_COST",
          purchasePrice,
          expenses,
        },
        context: {
          purchasePrice: cp006PlainMoney(purchasePrice),
          repairExpense: cp006PlainMoney(expenses[0]!),
          transportExpense: cp006PlainMoney(expenses[1]!),
          installationExpense: cp006PlainMoney(expenses[2]!),
        },
      };
    }

    case "PNL-QL-151": {
      const purchasePrice = rupees(pickNumber(random, PURCHASE_PRICES));
      const overheadPercent = rational(pickNumber(random, OVERHEAD_RATES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "PURCHASE_AND_OVERHEAD_RATE_TO_EFFECTIVE_COST",
          purchasePrice,
          overheadPercent,
        },
        context: {
          purchasePrice: cp006PlainMoney(purchasePrice),
          overheadPercent: cp006FormatRational(overheadPercent),
        },
      };
    }

    case "PNL-QL-152":
    case "PNL-QL-153": {
      const purchasePrice = rupees(pickNumber(random, PURCHASE_PRICES));
      const expenses = [rupees(pickNumber(random, FLAT_EXPENSES))];
      const cost = effectiveCost(purchasePrice, expenses);
      const resultDirection = qlId === "PNL-QL-152" ? "PROFIT" : "LOSS";
      const ratePercent = rational(pickNumber(random, RATES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EFFECTIVE_COST_AND_RATE_TO_SELLING_PRICE",
          effectiveCost: cost,
          direction: resultDirection,
          ratePercent,
        },
        context: {
          purchasePrice: cp006PlainMoney(purchasePrice),
          expenses: cp006PlainMoney(expenses[0]!),
          profitPercent:
            resultDirection === "PROFIT"
              ? cp006FormatRational(ratePercent)
              : undefined,
          lossPercent:
            resultDirection === "LOSS"
              ? cp006FormatRational(ratePercent)
              : undefined,
        },
      };
    }

    case "PNL-QL-154": {
      const purchasePrice = rupees(pickNumber(random, PURCHASE_PRICES));
      const expenses = [rupees(pickNumber(random, FLAT_EXPENSES))];
      const cost = effectiveCost(purchasePrice, expenses);
      const resultDirection = direction(random);
      const ratePercent = rational(pickNumber(random, RATES));
      const finalSellingPrice = sellingPrice(
        cost,
        resultDirection,
        ratePercent,
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "PURCHASE_EXPENSES_AND_SP_TO_RESULT",
          purchasePrice,
          expenses,
          sellingPrice: finalSellingPrice,
        },
        context: {
          purchasePrice: cp006PlainMoney(purchasePrice),
          expenses: cp006PlainMoney(expenses[0]!),
          sellingPrice: cp006PlainMoney(finalSellingPrice),
        },
      };
    }

    case "PNL-QL-155": {
      const purchasePrice = rupees(pickNumber(random, PURCHASE_PRICES));
      const maximumExpense = rupees(pickNumber(random, FLAT_EXPENSES));
      const targetEffectiveCost = moneyFromPaise(
        purchasePrice.paise + maximumExpense.paise,
      );
      const targetDirection = "PROFIT" as const;
      const targetRatePercent = rational(pickNumber(random, RATES));
      const plannedSellingPrice = sellingPrice(
        targetEffectiveCost,
        targetDirection,
        targetRatePercent,
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "SP_TARGET_RATE_TO_MAX_EXPENSE",
          purchasePrice,
          sellingPrice: plannedSellingPrice,
          direction: targetDirection,
          targetRatePercent,
        },
        context: {
          purchasePrice: cp006PlainMoney(purchasePrice),
          sellingPrice: cp006PlainMoney(plannedSellingPrice),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp006FormatRational(targetRatePercent),
        },
      };
    }

    case "PNL-QL-156":
    case "PNL-QL-157": {
      const usableQuantity = pickSeeded(random, [80n, 90n, 100n] as const);
      const wastedQuantity = pickSeeded(random, [10n, 20n] as const);
      const inputQuantity = usableQuantity + wastedQuantity;
      const unitCost = rupees(pickNumber(random, UNIT_COSTS));
      const totalInputCost = moneyFromPaise(unitCost.paise * usableQuantity);
      if (qlId === "PNL-QL-156") {
        return {
          qlId,
          registry,
          seed: seedValue,
          request: {
            mode: "WASTAGE_TO_EFFECTIVE_UNIT_COST",
            totalInputCost,
            inputQuantity,
            wastedQuantity,
          },
          context: {
            totalInputCost: cp006PlainMoney(totalInputCost),
            inputQuantity: inputQuantity.toString(),
            wastedQuantity: wastedQuantity.toString(),
          },
        };
      }
      const targetDirection = direction(random);
      const targetRatePercent = rational(pickNumber(random, RATES));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "WASTAGE_AND_TARGET_RATE_TO_UNIT_SP",
          totalInputCost,
          inputQuantity,
          wastedQuantity,
          direction: targetDirection,
          ratePercent: targetRatePercent,
        },
        context: {
          totalInputCost: cp006PlainMoney(totalInputCost),
          inputQuantity: inputQuantity.toString(),
          wastedQuantity: wastedQuantity.toString(),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp006FormatRational(targetRatePercent),
        },
      };
    }

    case "PNL-QL-158": {
      const breakEvenQuantity = pickSeeded(random, QUANTITIES);
      const variableCostPerUnit = rupees(pickNumber(random, UNIT_COSTS));
      const contribution = rupees(pickNumber(random, CONTRIBUTIONS));
      const sellingPricePerUnit = moneyFromPaise(
        variableCostPerUnit.paise + contribution.paise,
      );
      const fixedCost = moneyFromPaise(contribution.paise * breakEvenQuantity);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FIXED_VARIABLE_COST_TO_BREAK_EVEN_QUANTITY",
          fixedCost,
          variableCostPerUnit,
          sellingPricePerUnit,
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          variableCostPerUnit: cp006PlainMoney(variableCostPerUnit),
          sellingPricePerUnit: cp006PlainMoney(sellingPricePerUnit),
        },
      };
    }

    case "PNL-QL-159": {
      const requiredQuantity = pickSeeded(random, [50n, 80n, 100n] as const);
      const variableCostPerUnit = rupees(pickNumber(random, UNIT_COSTS));
      const contribution = rupees(pickNumber(random, CONTRIBUTIONS));
      const sellingPricePerUnit = moneyFromPaise(
        variableCostPerUnit.paise + contribution.paise,
      );
      const requiredContribution = contribution.paise * requiredQuantity;
      const fixedCost = moneyFromPaise(requiredContribution / 2n);
      const targetProfit = moneyFromPaise(
        requiredContribution - fixedCost.paise,
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FIXED_VARIABLE_COST_AND_TARGET_PROFIT_TO_QUANTITY",
          fixedCost,
          targetProfit,
          variableCostPerUnit,
          sellingPricePerUnit,
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          targetProfit: cp006PlainMoney(targetProfit),
          variableCostPerUnit: cp006PlainMoney(variableCostPerUnit),
          sellingPricePerUnit: cp006PlainMoney(sellingPricePerUnit),
        },
      };
    }

    case "PNL-QL-160": {
      const quantity = pickSeeded(random, QUANTITIES);
      const variableCostPerUnit = rupees(pickNumber(random, UNIT_COSTS));
      const fixedPerUnit = rupees(pickNumber(random, CONTRIBUTIONS));
      const fixedCost = moneyFromPaise(fixedPerUnit.paise * quantity);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FIXED_COST_QUANTITY_TO_BREAK_EVEN_SP",
          fixedCost,
          variableCostPerUnit,
          quantity,
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          variableCostPerUnit: cp006PlainMoney(variableCostPerUnit),
          quantity: quantity.toString(),
        },
      };
    }

    case "PNL-QL-161":
    case "PNL-QL-162": {
      const firstCostPrice = rupees(pickNumber(random, PURCHASE_PRICES));
      const firstLossRate = rational(pickSeeded(random, [10, 20] as const));
      const firstSellingPrice = sellingPrice(
        firstCostPrice,
        "LOSS",
        firstLossRate,
      );
      const secondCostPrice = rupees(pickNumber(random, PURCHASE_PRICES));
      const targetDirection = "PROFIT" as const;
      const targetRatePercent =
        qlId === "PNL-QL-161"
          ? rational(0)
          : rational(pickSeeded(random, [10, 20] as const));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EARLIER_LOSS_TO_REQUIRED_NEXT_SP",
          firstCostPrice,
          firstSellingPrice,
          secondCostPrice,
          targetDirection,
          targetRatePercent,
        },
        context: {
          firstCostPrice: cp006PlainMoney(firstCostPrice),
          firstSellingPrice: cp006PlainMoney(firstSellingPrice),
          secondCostPrice: cp006PlainMoney(secondCostPrice),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp006FormatRational(targetRatePercent),
        },
      };
    }

    case "PNL-QL-163": {
      const cost = rupees(pickNumber(random, PURCHASE_PRICES));
      const resultDirection = direction(random);
      const ratePercent = rational(pickNumber(random, RATES));
      const totalRecovery = sellingPrice(cost, resultDirection, ratePercent);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "TOTAL_RECOVERY_AND_RATE_TO_EFFECTIVE_COST",
          totalRecovery,
          direction: resultDirection,
          ratePercent,
        },
        context: {
          totalRecovery: cp006PlainMoney(totalRecovery),
          direction: resultDirection.toLowerCase(),
          ratePercent: cp006FormatRational(ratePercent),
        },
      };
    }

    case "PNL-QL-164": {
      const generated = mixedOverheadCase(random);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "MIXED_FLAT_PERCENT_OVERHEAD_TO_EFFECTIVE_COST",
          purchasePrice: generated.purchasePrice,
          flatExpenses: generated.flatExpenses,
          overheadPercent: generated.overheadPercent,
          overheadBase: generated.overheadBase,
        },
        context: generated.context,
      };
    }

    case "PNL-QL-165": {
      const purchasePrice = rupees(pickNumber(random, PURCHASE_PRICES));
      const expensePercent = rational(pickNumber(random, OVERHEAD_RATES));
      const totalExpense = moneyFromPaise(
        (purchasePrice.paise * expensePercent.numerator) /
          (100n * expensePercent.denominator),
      );
      const finalEffectiveCost = moneyFromPaise(
        purchasePrice.paise + totalExpense.paise,
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EFFECTIVE_COST_AND_PURCHASE_TO_TOTAL_EXPENSE",
          purchasePrice,
          effectiveCost: finalEffectiveCost,
        },
        context: {
          purchasePrice: cp006PlainMoney(purchasePrice),
          effectiveCost: cp006PlainMoney(finalEffectiveCost),
        },
      };
    }

    case "PNL-QL-166":
    case "PNL-QL-185": {
      const generated = mixedOverheadCase(random);
      const context = {
        ...generated.context,
        purchasePriceExpression: `${cp006PlainMoney(generated.purchasePrice)}x`,
        flatExpenseExpression: `${generated.flatExpenses
          .map((expense) => cp006PlainMoney(expense))
          .join("x+")}x`,
        effectiveCostExpression: `${cp006PlainMoney(generated.result.effectiveCost)}x`,
      };
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "PURCHASE_FLAT_AND_EFFECTIVE_COST_TO_OVERHEAD_RATE",
          purchasePrice: generated.purchasePrice,
          flatExpenses: generated.flatExpenses,
          effectiveCost: generated.result.effectiveCost,
          overheadBase: generated.overheadBase,
        },
        context,
      };
    }

    case "PNL-QL-167":
    case "PNL-QL-168":
    case "PNL-QL-182": {
      const generated = manufacturingCase(random);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: generated.request,
        context: generated.context,
      };
    }

    case "PNL-QL-169": {
      const preset = pickSeeded(random, WASTAGE_SCRAP_PRESETS);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "WASTAGE_SCRAP_TO_EFFECTIVE_UNIT_COST",
          totalInputCost: rupees(preset.totalCost),
          inputQuantity: preset.input,
          wastedQuantity: preset.wasted,
          scrapRecovery: rupees(preset.scrap),
        },
        context: {
          totalInputCost: preset.totalCost,
          inputQuantity: preset.input.toString(),
          wastedQuantity: preset.wasted.toString(),
          scrapRecovery: preset.scrap,
        },
      };
    }

    case "PNL-QL-170": {
      const breakEvenQuantity = pickSeeded(random, QUANTITIES);
      const variableCostPerUnit = rupees(pickNumber(random, UNIT_COSTS));
      const contribution = rupees(pickNumber(random, CONTRIBUTIONS));
      const sellingPricePerUnit = moneyFromPaise(
        variableCostPerUnit.paise + contribution.paise,
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "BREAK_EVEN_QUANTITY_TO_FIXED_COST",
          breakEvenQuantity,
          variableCostPerUnit,
          sellingPricePerUnit,
        },
        context: {
          breakEvenQuantity: breakEvenQuantity.toString(),
          variableCostPerUnit: cp006PlainMoney(variableCostPerUnit),
          sellingPricePerUnit: cp006PlainMoney(sellingPricePerUnit),
        },
      };
    }

    case "PNL-QL-171": {
      const breakEvenQuantity = pickSeeded(random, QUANTITIES);
      const contribution = rupees(pickNumber(random, CONTRIBUTIONS));
      const fixedCost = moneyFromPaise(contribution.paise * breakEvenQuantity);
      const variableCostPerUnit = rupees(pickNumber(random, UNIT_COSTS));
      const sellingPricePerUnit = moneyFromPaise(
        variableCostPerUnit.paise + contribution.paise,
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "BREAK_EVEN_QUANTITY_TO_VARIABLE_COST",
          fixedCost,
          breakEvenQuantity,
          sellingPricePerUnit,
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          breakEvenQuantity: breakEvenQuantity.toString(),
          sellingPricePerUnit: cp006PlainMoney(sellingPricePerUnit),
        },
      };
    }

    case "PNL-QL-172": {
      const quantity = pickSeeded(random, QUANTITIES);
      const variableCostPerUnit = rupees(pickNumber(random, UNIT_COSTS));
      const fixedAllocation = rupees(pickNumber(random, CONTRIBUTIONS));
      const profitAllocation = rupees(pickNumber(random, CONTRIBUTIONS));
      const fixedCost = moneyFromPaise(fixedAllocation.paise * quantity);
      const targetProfit = moneyFromPaise(profitAllocation.paise * quantity);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FIXED_VARIABLE_QUANTITY_TARGET_PROFIT_TO_SP",
          fixedCost,
          variableCostPerUnit,
          quantity,
          targetProfit,
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          variableCostPerUnit: cp006PlainMoney(variableCostPerUnit),
          quantity: quantity.toString(),
          targetProfit: cp006PlainMoney(targetProfit),
        },
      };
    }

    case "PNL-QL-173":
    case "PNL-QL-174": {
      const fixedCost = rupees(pickNumber(random, PURCHASE_PRICES));
      const contributionMarginPercent = rational(
        pickSeeded(random, [20, 25, 40, 50] as const),
      );
      const breakEvenRevenue = solveEffectiveCostAdvanced({
        mode: "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE",
        fixedCost,
        contributionMarginPercent,
      }).breakEvenRevenue;
      return qlId === "PNL-QL-173"
        ? {
            qlId,
            registry,
            seed: seedValue,
            request: {
              mode: "FIXED_COST_AND_CM_RATIO_TO_BREAK_EVEN_REVENUE",
              fixedCost,
              contributionMarginPercent,
            },
            context: {
              fixedCost: cp006PlainMoney(fixedCost),
              contributionMarginPercent: cp006FormatRational(
                contributionMarginPercent,
              ),
            },
          }
        : {
            qlId,
            registry,
            seed: seedValue,
            request: {
              mode: "FIXED_COST_AND_BREAK_EVEN_REVENUE_TO_CM_RATIO",
              fixedCost,
              breakEvenRevenue,
            },
            context: {
              fixedCost: cp006PlainMoney(fixedCost),
              breakEvenRevenue: cp006PlainMoney(breakEvenRevenue),
            },
          };
    }

    case "PNL-QL-175":
    case "PNL-QL-183": {
      const preset = pickSeeded(random, PRODUCT_MIX_PRESETS);
      const products: readonly ProductMixItem[] = preset.products.map(
        (product) => ({
          unitsPerBundle: product.units,
          sellingPricePerUnit: rupees(product.sp),
          variableCostPerUnit: rupees(product.vc),
        }),
      );
      const fixedCost = rupees(preset.fixedCost);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "MULTI_PRODUCT_MIX_TO_BREAK_EVEN_BUNDLES",
          fixedCost,
          products,
        },
        context: {
          fixedCost: cp006PlainMoney(fixedCost),
          productMix: productMixText(products),
          productMixTable: productMixRows(products),
          caseletData: [
            "Products must be sold in the fixed bundle mix shown by the question.",
            "Each product contributes its selling price less variable cost toward the common fixed cost.",
          ],
        },
      };
    }

    case "PNL-QL-176":
    case "PNL-QL-177": {
      const breakEvenRevenue = rupees(pickNumber(random, PURCHASE_PRICES));
      const safetyAmount = rupees(pickNumber(random, FLAT_EXPENSES));
      const actualRevenue = moneyFromPaise(
        breakEvenRevenue.paise + safetyAmount.paise,
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "ACTUAL_AND_BREAK_EVEN_REVENUE_TO_MARGIN_OF_SAFETY",
          actualRevenue,
          breakEvenRevenue,
        },
        context: {
          actualRevenue: cp006PlainMoney(actualRevenue),
          breakEvenRevenue: cp006PlainMoney(breakEvenRevenue),
        },
      };
    }

    case "PNL-QL-178": {
      const totalCost = rupees(pickNumber(random, PURCHASE_PRICES));
      const targetDirection = "PROFIT" as const;
      const targetRatePercent = rational(pickNumber(random, RATES));
      const targetTotalRecovery = sellingPrice(
        totalCost,
        targetDirection,
        targetRatePercent,
      );
      const firstRecovery = rupees(pickNumber(random, FLAT_EXPENSES));
      const secondRecovery = moneyFromPaise(
        targetTotalRecovery.paise / 2n - firstRecovery.paise / 2n,
      );
      const priorRecoveries = [firstRecovery, secondRecovery];
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "TOTAL_COST_PRIOR_RECOVERIES_TARGET_TO_FINAL_RECOVERY",
          totalCost,
          priorRecoveries,
          targetDirection,
          targetRatePercent,
        },
        context: {
          totalCost: cp006PlainMoney(totalCost),
          priorRecoveries: flatExpenseText(priorRecoveries),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp006FormatRational(targetRatePercent),
        },
      };
    }

    case "PNL-QL-179":
    case "PNL-QL-184": {
      const lossPercent = rational(
        pickSeeded(random, [10, 20, 25, 40] as const),
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "LOSS_RATE_TO_REQUIRED_RECOVERY_RATE_ON_REMAINING_CAPITAL",
          lossPercent,
        },
        context: {
          lossPercent: cp006FormatRational(lossPercent),
          correctStatement: "Statement 2 only",
          ...(qlId === "PNL-QL-184"
            ? {
                statements: [
                  "The same percentage profit after a loss is always sufficient to restore the original capital.",
                  "After a loss, the required recovery percentage is measured on the smaller remaining capital.",
                  `A ${cp006FormatRational(lossPercent)}% loss is exactly recovered by a ${cp006FormatRational(lossPercent)}% profit on the remaining capital.`,
                ],
              }
            : {}),
        },
        ...(qlId === "PNL-QL-184"
          ? { answerOverride: "Statement 2 only" }
          : {}),
      };
    }

    case "PNL-QL-180": {
      const effectiveCostValue = rupees(pickNumber(random, PURCHASE_PRICES));
      const resultDirection = direction(random);
      const targetRate = rational(pickNumber(random, RATES));
      const netRecovery = sellingPrice(
        effectiveCostValue,
        resultDirection,
        targetRate,
      );
      const commissionPercent = rational(20);
      const grossSellingPrice = moneyFromPaise((netRecovery.paise * 5n) / 4n);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EFFECTIVE_COST_GROSS_SP_COMMISSION_TO_RESULT",
          effectiveCost: effectiveCostValue,
          grossSellingPrice,
          commissionPercent,
        },
        context: {
          effectiveCost: cp006PlainMoney(effectiveCostValue),
          grossSellingPrice: cp006PlainMoney(grossSellingPrice),
          commissionPercent: cp006FormatRational(commissionPercent),
        },
      };
    }

    case "PNL-QL-181": {
      const effectiveCostValue = rupees(pickNumber(random, PURCHASE_PRICES));
      const targetDirection = "PROFIT" as const;
      const targetRatePercent = rational(pickNumber(random, RATES));
      const commissionPercent = rational(20);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "EFFECTIVE_COST_TARGET_RATE_COMMISSION_TO_GROSS_SP",
          effectiveCost: effectiveCostValue,
          targetDirection,
          targetRatePercent,
          commissionPercent,
        },
        context: {
          effectiveCost: cp006PlainMoney(effectiveCostValue),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp006FormatRational(targetRatePercent),
          commissionPercent: cp006FormatRational(commissionPercent),
        },
      };
    }

    case "PNL-QL-186": {
      const fixedCost = rupees(pickNumber(random, PURCHASE_PRICES));
      const variableCostPerUnit = rupees(pickNumber(random, UNIT_COSTS));
      const contribution = rupees(pickNumber(random, CONTRIBUTIONS));
      const sellingPricePerUnit = moneyFromPaise(
        variableCostPerUnit.paise + contribution.paise,
      );
      const full = `Fixed cost is ${cp006FormatMoney(fixedCost)}, variable cost is ${cp006FormatMoney(variableCostPerUnit)} per unit, and selling price is ${cp006FormatMoney(sellingPricePerUnit)} per unit.`;
      const fixedOnly = `Fixed cost is ${cp006FormatMoney(fixedCost)}.`;
      const unitOnly = `Variable cost is ${cp006FormatMoney(variableCostPerUnit)} and selling price is ${cp006FormatMoney(sellingPricePerUnit)} per unit.`;
      const irrelevant = "The business operates from a rented premises.";
      const pattern = pickSeeded(random, [
        "BOTH",
        "ONE",
        "TWO",
        "EITHER",
      ] as const);
      const statementOne =
        pattern === "ONE" || pattern === "EITHER"
          ? full
          : pattern === "BOTH"
            ? fixedOnly
            : irrelevant;
      const statementTwo =
        pattern === "TWO" || pattern === "EITHER"
          ? full
          : pattern === "BOTH"
            ? unitOnly
            : irrelevant;
      const answerOverride =
        pattern === "BOTH"
          ? "Both statements together are required"
          : pattern === "ONE"
            ? "Statement 1 alone is sufficient"
            : pattern === "TWO"
              ? "Statement 2 alone is sufficient"
              : "Either statement alone is sufficient";
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FIXED_VARIABLE_COST_TO_BREAK_EVEN_QUANTITY",
          fixedCost,
          variableCostPerUnit,
          sellingPricePerUnit,
        },
        context: {
          statementOne,
          statementTwo,
          dataSufficiencyAnswer: answerOverride,
        },
        answerOverride,
      };
    }

    default:
      throw new Error(`${qlId}: CP-006 dynamic generator is not implemented.`);
  }
}
