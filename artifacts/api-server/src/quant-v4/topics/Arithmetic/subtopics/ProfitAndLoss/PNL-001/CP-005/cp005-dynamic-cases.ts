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
import { moneyFromRupees, type Money } from "../foundation/money";
import {
  solveDishonestTrade,
  type DishonestTradeRequest,
  type DishonestTradeResult,
} from "../foundation/dishonest-trade-solver";
import {
  solveDishonestTradeAdvanced,
  type DishonestScheme,
  type DishonestTradeAdvancedRequest,
  type DishonestTradeAdvancedResult,
} from "../foundation/dishonest-trade-advanced-solver";

export const PNL_CP005_ID = "PNL-CP-005" as const;
export type PnlCp005Difficulty = "Easy" | "Medium" | "Hard";

export type PnlCp005RegistryEntry = Readonly<{
  solveMode: string;
  answerSemantic: string;
  requiredVariables: readonly string[];
  difficulty: PnlCp005Difficulty;
  representation?: string;
}>;

type RegistryFile = Readonly<{
  archetypeId: "PNL-001";
  cpId: typeof PNL_CP005_ID;
  entries: Readonly<Record<string, PnlCp005RegistryEntry>>;
}>;

export type PnlCp005SolverRequest =
  | DishonestTradeRequest
  | DishonestTradeAdvancedRequest;
export type PnlCp005SolverResult =
  | DishonestTradeResult
  | DishonestTradeAdvancedResult;

export type PnlCp005GeneratedCase = Readonly<{
  qlId: string;
  registry: PnlCp005RegistryEntry;
  request: PnlCp005SolverRequest;
  context: Readonly<Record<string, unknown>>;
  seed: string;
  answerOverride?: string;
}>;

const taskRegistry = taskRegistryJson as RegistryFile;
export const PNL_CP005_QL_IDS = Object.keys(taskRegistry.entries);

const COSTS = [1000, 1200, 1500, 2000, 2400, 3000] as const;
const QUOTED_PRICES = [900, 1000, 1100, 1200, 1500, 1800] as const;
const DELIVERED_QUANTITIES = [800n, 850n, 900n, 950n] as const;
const RECEIVED_QUANTITIES = [1050n, 1100n, 1200n, 1250n] as const;
const PROFIT_RATES = [10, 20, 25, 40] as const;
const LOSS_RATES = [5, 10, 20] as const;
const MARKUPS = [25, 40, 50, 60] as const;
const DISCOUNTS = [10, 20, 25] as const;
const TRUE_QUANTITY = 1000n;
const NOMINAL_QUANTITY = 1000n;

export function cp005PlainMoney(value: Money): string {
  const whole = value.paise / 100n;
  const remainder = value.paise % 100n;
  if (remainder === 0n) return whole.toString();
  return `${whole}.${remainder.toString().padStart(2, "0")}`;
}

export function cp005FormatMoney(value: Money): string {
  return `₹${cp005PlainMoney(value)}`;
}

export function cp005FormatRational(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  return rationalToNumber(value)
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1");
}

export function cp005FormatPercent(value: Rational): string {
  return `${cp005FormatRational(value)}%`;
}

export function cp005FormatQuantity(value: Rational): string {
  return cp005FormatRational(value);
}

function rupees(value: number): Money {
  return moneyFromRupees(value);
}

function pickNumber(random: SeededRandom, values: readonly number[]): number {
  return pickSeeded(random, values);
}

function pickDelivered(random: SeededRandom): bigint {
  return pickSeeded(random, DELIVERED_QUANTITIES);
}

function declaredPair(
  random: SeededRandom,
  forceLoss = false,
): Readonly<{
  direction: "PROFIT" | "LOSS";
  ratePercent: Rational;
}> {
  const direction = forceLoss
    ? "LOSS"
    : pickSeeded(random, ["PROFIT", "LOSS"] as const);
  return {
    direction,
    ratePercent: rational(
      direction === "PROFIT"
        ? pickNumber(random, PROFIT_RATES)
        : pickNumber(random, LOSS_RATES),
    ),
  };
}

const ADVANCED_MODES = new Set([
  "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE",
  "ACTUAL_AMOUNT_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE",
  "BUY_HEAVY_SELL_LIGHT_TARGET_TO_DELIVERED_QUANTITY",
  "BUY_HEAVY_SELL_LIGHT_TARGET_TO_RECEIVED_QUANTITY",
  "FALSE_QUANTITY_TO_EFFECTIVE_PRICE_PER_TRUE_QUANTITY",
  "COMPARE_TWO_DISHONEST_SCHEMES",
]);

export function solvePnlCp005Request(
  request: PnlCp005SolverRequest,
): PnlCp005SolverResult {
  return ADVANCED_MODES.has(request.mode)
    ? solveDishonestTradeAdvanced(request as DishonestTradeAdvancedRequest)
    : solveDishonestTrade(request as DishonestTradeRequest);
}

function directionRateContext(
  direction: "PROFIT" | "LOSS" | "NO_CHANGE",
  ratePercent: Rational,
): Readonly<Record<string, string>> {
  return {
    actualDirection: direction.toLowerCase(),
    actualRatePercent: cp005FormatRational(ratePercent),
    actualProfitPercent: cp005FormatRational(ratePercent),
  };
}

function directFalseQuantity(
  costPricePerTrueQuantity: Money,
  quotedSellingPricePerNominalQuantity: Money,
  deliveredQuantity: bigint,
) {
  return solveDishonestTrade({
    mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT",
    costPricePerTrueQuantity,
    quotedSellingPricePerNominalQuantity,
    trueQuantity: TRUE_QUANTITY,
    deliveredQuantity,
  });
}

function markupForward(
  costPricePerTrueQuantity: Money,
  deliveredQuantity: bigint,
  markupPercent: Rational,
  discountPercent: Rational,
) {
  return solveDishonestTrade({
    mode: "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE",
    costPricePerTrueQuantity,
    markupPercent,
    discountPercent,
    trueQuantity: TRUE_QUANTITY,
    deliveredQuantity,
  });
}

function buyHeavyForward(
  purchasePricePerNominalQuantity: Money,
  sellingPricePerNominalQuantity: Money,
  receivedQuantity: bigint,
  deliveredQuantity: bigint,
) {
  return solveDishonestTrade({
    mode: "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE",
    purchasePricePerNominalQuantity,
    sellingPricePerNominalQuantity,
    nominalQuantity: NOMINAL_QUANTITY,
    receivedQuantity,
    deliveredQuantity,
  });
}

function schemeText(scheme: DishonestScheme): string {
  return `cost ${cp005FormatMoney(scheme.costPricePerTrueQuantity)} per ${scheme.trueQuantity} units, charge ${cp005FormatMoney(scheme.quotedSellingPricePerNominalQuantity)}, deliver ${scheme.deliveredQuantity} units`;
}

function comparisonSchemes(random: SeededRandom) {
  const cost = rupees(pickNumber(random, COSTS));
  const firstDelivered = pickSeeded(random, [800n, 850n] as const);
  const secondDelivered = pickSeeded(random, [900n, 950n] as const);
  const first: DishonestScheme = {
    costPricePerTrueQuantity: cost,
    quotedSellingPricePerNominalQuantity: cost,
    trueQuantity: TRUE_QUANTITY,
    deliveredQuantity: firstDelivered,
  };
  const second: DishonestScheme = {
    costPricePerTrueQuantity: cost,
    quotedSellingPricePerNominalQuantity: cost,
    trueQuantity: TRUE_QUANTITY,
    deliveredQuantity: secondDelivered,
  };
  return random.next() < 0.5
    ? { firstScheme: first, secondScheme: second }
    : { firstScheme: second, secondScheme: first };
}

function baseContext(
  costPricePerTrueQuantity: Money,
  deliveredQuantity: bigint,
): Record<string, unknown> {
  return {
    costPricePerTrueQuantity: cp005PlainMoney(costPricePerTrueQuantity),
    trueQuantity: TRUE_QUANTITY.toString(),
    deliveredQuantity: deliveredQuantity.toString(),
  };
}

export function generatePnlCp005Case(
  qlId: string,
  seedValue: string,
): PnlCp005GeneratedCase {
  const registry = taskRegistry.entries[qlId];
  if (!registry) throw new Error(`Unknown CP-005 QL: ${qlId}`);
  const random = createSeededRandom(`${seedValue}:${qlId}:parameters`);
  const costPricePerTrueQuantity = rupees(pickNumber(random, COSTS));
  const deliveredQuantity = pickDelivered(random);

  switch (qlId) {
    case "PNL-QL-121": {
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT",
          costPricePerTrueQuantity,
          quotedSellingPricePerNominalQuantity: costPricePerTrueQuantity,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity,
        },
        context: baseContext(costPricePerTrueQuantity, deliveredQuantity),
      };
    }

    case "PNL-QL-122":
    case "PNL-QL-143": {
      const quotedSellingPricePerNominalQuantity = rupees(
        pickNumber(random, QUOTED_PRICES),
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT",
          costPricePerTrueQuantity,
          quotedSellingPricePerNominalQuantity,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity,
        },
        context: {
          ...baseContext(costPricePerTrueQuantity, deliveredQuantity),
          quotedSellingPricePerNominalQuantity: cp005PlainMoney(
            quotedSellingPricePerNominalQuantity,
          ),
        },
      };
    }

    case "PNL-QL-123":
    case "PNL-QL-124": {
      const declared = declaredPair(random, qlId === "PNL-QL-124");
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE",
          costPricePerTrueQuantity,
          declaredDirection: declared.direction,
          declaredRatePercent: declared.ratePercent,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity,
        },
        context: {
          ...baseContext(costPricePerTrueQuantity, deliveredQuantity),
          declaredDirection: declared.direction.toLowerCase(),
          declaredRatePercent: cp005FormatRational(declared.ratePercent),
        },
      };
    }

    case "PNL-QL-125":
    case "PNL-QL-148": {
      const targetDirection = "PROFIT" as const;
      const targetRatePercent = rational(
        pickSeeded(random, [20, 25] as const),
      );
      const quotedSellingPricePerNominalQuantity = solveDishonestTrade({
        mode: "TARGET_RATE_AND_FALSE_QUANTITY_TO_QUOTED_SP",
        costPricePerTrueQuantity,
        trueQuantity: TRUE_QUANTITY,
        deliveredQuantity,
        targetDirection,
        targetRatePercent,
      }).quotedSellingPrice;
      const commonContext = {
        ...baseContext(costPricePerTrueQuantity, deliveredQuantity),
        quotedSellingPricePerNominalQuantity: cp005PlainMoney(
          quotedSellingPricePerNominalQuantity,
        ),
        targetDirection: targetDirection.toLowerCase(),
        targetRatePercent: cp005FormatRational(targetRatePercent),
      };
      if (qlId === "PNL-QL-125") {
        return {
          qlId,
          registry,
          seed: seedValue,
          request: {
            mode: "TARGET_RATE_TO_DELIVERED_QUANTITY",
            costPricePerTrueQuantity,
            quotedSellingPricePerNominalQuantity,
            trueQuantity: TRUE_QUANTITY,
            targetDirection,
            targetRatePercent,
          },
          context: commonContext,
        };
      }

      const full = `The nominal cost is ${cp005FormatMoney(costPricePerTrueQuantity)} and the selling amount is ${cp005FormatMoney(quotedSellingPricePerNominalQuantity)}.`;
      const costOnly = `The nominal cost is ${cp005FormatMoney(costPricePerTrueQuantity)}.`;
      const sellingOnly = `The selling amount is ${cp005FormatMoney(quotedSellingPricePerNominalQuantity)}.`;
      const irrelevant = "The goods are packed in an unbranded container.";
      const pattern = pickSeeded(
        random,
        ["BOTH", "ONE", "TWO", "EITHER"] as const,
      );
      const statementOne =
        pattern === "ONE" || pattern === "EITHER"
          ? full
          : pattern === "BOTH"
            ? costOnly
            : irrelevant;
      const statementTwo =
        pattern === "TWO" || pattern === "EITHER"
          ? full
          : pattern === "BOTH"
            ? sellingOnly
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
          mode: "TARGET_RATE_TO_DELIVERED_QUANTITY",
          costPricePerTrueQuantity,
          quotedSellingPricePerNominalQuantity,
          trueQuantity: TRUE_QUANTITY,
          targetDirection,
          targetRatePercent,
        },
        context: {
          ...commonContext,
          statementOne,
          statementTwo,
          dataSufficiencyAnswer: answerOverride,
        },
        answerOverride,
      };
    }

    case "PNL-QL-126": {
      const targetDirection = "PROFIT" as const;
      const targetRatePercent = rational(
        pickSeeded(random, [10, 20, 25] as const),
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "TARGET_RATE_AND_FALSE_QUANTITY_TO_QUOTED_SP",
          costPricePerTrueQuantity,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity,
          targetDirection,
          targetRatePercent,
        },
        context: {
          ...baseContext(costPricePerTrueQuantity, deliveredQuantity),
          targetDirection: targetDirection.toLowerCase(),
          targetRatePercent: cp005FormatRational(targetRatePercent),
        },
      };
    }

    case "PNL-QL-127":
    case "PNL-QL-128": {
      const purchasePricePerNominalQuantity = rupees(
        pickSeeded(random, [1000, 1200, 1500] as const),
      );
      const sellingPricePerNominalQuantity = rupees(
        pickSeeded(random, [1000, 1200, 1500] as const),
      );
      const receivedQuantity = pickSeeded(random, RECEIVED_QUANTITIES);
      const lightQuantity = pickDelivered(random);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE",
          purchasePricePerNominalQuantity,
          sellingPricePerNominalQuantity,
          nominalQuantity: NOMINAL_QUANTITY,
          receivedQuantity,
          deliveredQuantity: lightQuantity,
        },
        context: {
          purchasePricePerNominalQuantity: cp005PlainMoney(
            purchasePricePerNominalQuantity,
          ),
          sellingPricePerNominalQuantity: cp005PlainMoney(
            sellingPricePerNominalQuantity,
          ),
          nominalQuantity: NOMINAL_QUANTITY.toString(),
          receivedQuantity: receivedQuantity.toString(),
          deliveredQuantity: lightQuantity.toString(),
        },
      };
    }

    case "PNL-QL-129":
    case "PNL-QL-146": {
      const markupPercent = rational(pickNumber(random, MARKUPS));
      const discountPercent = rational(pickNumber(random, DISCOUNTS));
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE",
          costPricePerTrueQuantity,
          markupPercent,
          discountPercent,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity,
        },
        context: {
          ...baseContext(costPricePerTrueQuantity, deliveredQuantity),
          markupPercent: cp005FormatRational(markupPercent),
          discountPercent: cp005FormatRational(discountPercent),
          caseletData: [
            "The retailer first changes the price and then reduces the physical quantity supplied.",
            "The discount is applied to the marked price, while actual profit is measured on delivered cost.",
          ],
        },
      };
    }

    case "PNL-QL-130":
    case "PNL-QL-131": {
      const markupPercent = rational(pickNumber(random, MARKUPS));
      const discountPercent = rational(pickNumber(random, DISCOUNTS));
      const forward = markupForward(
        costPricePerTrueQuantity,
        deliveredQuantity,
        markupPercent,
        discountPercent,
      );
      if (forward.direction === "NO_CHANGE") {
        throw new Error(`${qlId}: generated forward case has no direction.`);
      }
      const shared = {
        ...baseContext(costPricePerTrueQuantity, deliveredQuantity),
        markupPercent: cp005FormatRational(markupPercent),
        discountPercent: cp005FormatRational(discountPercent),
        targetDirection: forward.direction.toLowerCase(),
        targetRatePercent: cp005FormatRational(forward.ratePercent),
      };
      return qlId === "PNL-QL-130"
        ? {
            qlId,
            registry,
            seed: seedValue,
            request: {
              mode: "TARGET_RATE_FALSE_QUANTITY_DISCOUNT_TO_MARKUP",
              costPricePerTrueQuantity,
              discountPercent,
              trueQuantity: TRUE_QUANTITY,
              deliveredQuantity,
              targetDirection: forward.direction,
              targetRatePercent: forward.ratePercent,
            },
            context: shared,
          }
        : {
            qlId,
            registry,
            seed: seedValue,
            request: {
              mode: "TARGET_RATE_FALSE_QUANTITY_MARKUP_TO_DISCOUNT",
              costPricePerTrueQuantity,
              markupPercent,
              trueQuantity: TRUE_QUANTITY,
              deliveredQuantity,
              targetDirection: forward.direction,
              targetRatePercent: forward.ratePercent,
            },
            context: shared,
          };
    }

    case "PNL-QL-132":
    case "PNL-QL-133": {
      const priceDirection =
        qlId === "PNL-QL-132"
          ? "INCREASE"
          : pickSeeded(random, ["INCREASE", "DECREASE"] as const);
      const priceChangePercent = rational(
        priceDirection === "INCREASE"
          ? pickSeeded(random, [10, 20, 25] as const)
          : pickSeeded(random, [5, 10, 20] as const),
      );
      const shortQuantityPercent = rational(
        pickSeeded(random, [10, 15, 20] as const),
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "PRICE_CHANGE_AND_SHORT_QUANTITY_TO_ACTUAL_RATE",
          costPricePerTrueQuantity,
          priceDirection,
          priceChangePercent,
          trueQuantity: TRUE_QUANTITY,
          shortQuantityPercent,
        },
        context: {
          costPricePerTrueQuantity: cp005PlainMoney(costPricePerTrueQuantity),
          trueQuantity: TRUE_QUANTITY.toString(),
          priceDirection: priceDirection.toLowerCase(),
          priceChangePercent: cp005FormatRational(priceChangePercent),
          shortQuantityPercent: cp005FormatRational(shortQuantityPercent),
        },
      };
    }

    case "PNL-QL-134":
    case "PNL-QL-144":
    case "PNL-QL-147": {
      const trueQuantity = qlId === "PNL-QL-144" ? 100n : TRUE_QUANTITY;
      const actualDelivered =
        qlId === "PNL-QL-144"
          ? pickSeeded(random, [80n, 85n, 90n, 95n] as const)
          : deliveredQuantity;
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "SHORT_QUANTITY_TO_CUSTOMER_OVERCHARGE_RATE",
          trueQuantity,
          deliveredQuantity: actualDelivered,
        },
        context: {
          trueQuantity: trueQuantity.toString(),
          deliveredQuantity: actualDelivered.toString(),
          ...(qlId === "PNL-QL-147"
            ? { correctStatement: "Statement 2 only" }
            : {}),
        },
        ...(qlId === "PNL-QL-147"
          ? { answerOverride: "Statement 2 only" }
          : {}),
      };
    }

    case "PNL-QL-135":
    case "PNL-QL-136":
    case "PNL-QL-149": {
      const declared = declaredPair(random);
      const forward = solveDishonestTrade({
        mode: "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE",
        costPricePerTrueQuantity,
        declaredDirection: declared.direction,
        declaredRatePercent: declared.ratePercent,
        trueQuantity: TRUE_QUANTITY,
        deliveredQuantity,
      });
      if (forward.direction === "NO_CHANGE") {
        throw new Error(`${qlId}: generated actual result has no direction.`);
      }
      if (qlId === "PNL-QL-135") {
        return {
          qlId,
          registry,
          seed: seedValue,
          request: {
            mode: "ACTUAL_AND_DECLARED_RATE_TO_FALSE_QUANTITY",
            trueQuantity: TRUE_QUANTITY,
            declaredDirection: declared.direction,
            declaredRatePercent: declared.ratePercent,
            actualDirection: forward.direction,
            actualRatePercent: forward.ratePercent,
          },
          context: {
            trueQuantity: TRUE_QUANTITY.toString(),
            declaredDirection: declared.direction.toLowerCase(),
            declaredRatePercent: cp005FormatRational(declared.ratePercent),
            actualDirection: forward.direction.toLowerCase(),
            actualRatePercent: cp005FormatRational(forward.ratePercent),
          },
        };
      }
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "ACTUAL_RATE_AND_FALSE_QUANTITY_TO_DECLARED_RATE",
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity,
          actualDirection: forward.direction,
          actualRatePercent: forward.ratePercent,
        },
        context: {
          trueQuantity: TRUE_QUANTITY.toString(),
          deliveredQuantity: deliveredQuantity.toString(),
          actualDirection: forward.direction.toLowerCase(),
          actualRatePercent: cp005FormatRational(forward.ratePercent),
          trueQuantityExpression: "q",
          deliveredQuantityExpression: `${cp005FormatRational(rational(deliveredQuantity, TRUE_QUANTITY))}q`,
        },
      };
    }

    case "PNL-QL-137":
    case "PNL-QL-138": {
      const quotedSellingPricePerNominalQuantity = costPricePerTrueQuantity;
      const forward = directFalseQuantity(
        costPricePerTrueQuantity,
        quotedSellingPricePerNominalQuantity,
        deliveredQuantity,
      );
      if (forward.direction === "NO_CHANGE") {
        throw new Error(`${qlId}: generated actual result has no direction.`);
      }
      return {
        qlId,
        registry,
        seed: seedValue,
        request:
          qlId === "PNL-QL-137"
            ? {
                mode: "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE",
                quotedSellingPricePerNominalQuantity,
                trueQuantity: TRUE_QUANTITY,
                deliveredQuantity,
                actualDirection: forward.direction,
                actualRatePercent: forward.ratePercent,
              }
            : {
                mode: "ACTUAL_AMOUNT_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE",
                quotedSellingPricePerNominalQuantity,
                trueQuantity: TRUE_QUANTITY,
                deliveredQuantity,
                actualDirection: forward.direction,
                actualAmount: forward.amount,
              },
        context: {
          quotedSellingPricePerNominalQuantity: cp005PlainMoney(
            quotedSellingPricePerNominalQuantity,
          ),
          trueQuantity: TRUE_QUANTITY.toString(),
          deliveredQuantity: deliveredQuantity.toString(),
          actualDirection: forward.direction.toLowerCase(),
          actualRatePercent: cp005FormatRational(forward.ratePercent),
          actualAmount: cp005PlainMoney(forward.amount),
        },
      };
    }

    case "PNL-QL-139":
    case "PNL-QL-140": {
      const purchasePricePerNominalQuantity = rupees(
        pickSeeded(random, [1000, 1200, 1500] as const),
      );
      const sellingPricePerNominalQuantity = rupees(
        pickSeeded(random, [1000, 1200, 1500] as const),
      );
      const receivedQuantity = pickSeeded(random, RECEIVED_QUANTITIES);
      const lightQuantity = pickDelivered(random);
      const forward = buyHeavyForward(
        purchasePricePerNominalQuantity,
        sellingPricePerNominalQuantity,
        receivedQuantity,
        lightQuantity,
      );
      if (forward.direction === "NO_CHANGE") {
        throw new Error(`${qlId}: generated heavy/light result has no direction.`);
      }
      const context = {
        purchasePricePerNominalQuantity: cp005PlainMoney(
          purchasePricePerNominalQuantity,
        ),
        sellingPricePerNominalQuantity: cp005PlainMoney(
          sellingPricePerNominalQuantity,
        ),
        receivedQuantity: receivedQuantity.toString(),
        deliveredQuantity: lightQuantity.toString(),
        targetDirection: forward.direction.toLowerCase(),
        targetRatePercent: cp005FormatRational(forward.ratePercent),
      };
      return qlId === "PNL-QL-139"
        ? {
            qlId,
            registry,
            seed: seedValue,
            request: {
              mode: "BUY_HEAVY_SELL_LIGHT_TARGET_TO_DELIVERED_QUANTITY",
              purchasePricePerNominalQuantity,
              sellingPricePerNominalQuantity,
              receivedQuantity,
              targetDirection: forward.direction,
              targetRatePercent: forward.ratePercent,
            },
            context,
          }
        : {
            qlId,
            registry,
            seed: seedValue,
            request: {
              mode: "BUY_HEAVY_SELL_LIGHT_TARGET_TO_RECEIVED_QUANTITY",
              purchasePricePerNominalQuantity,
              sellingPricePerNominalQuantity,
              deliveredQuantity: lightQuantity,
              targetDirection: forward.direction,
              targetRatePercent: forward.ratePercent,
            },
            context,
          };
    }

    case "PNL-QL-141": {
      const quotedSellingPricePerNominalQuantity = rupees(
        pickNumber(random, QUOTED_PRICES),
      );
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "FALSE_QUANTITY_TO_EFFECTIVE_PRICE_PER_TRUE_QUANTITY",
          quotedSellingPricePerNominalQuantity,
          trueQuantity: TRUE_QUANTITY,
          deliveredQuantity,
        },
        context: {
          quotedSellingPricePerNominalQuantity: cp005PlainMoney(
            quotedSellingPricePerNominalQuantity,
          ),
          trueQuantity: TRUE_QUANTITY.toString(),
          deliveredQuantity: deliveredQuantity.toString(),
        },
      };
    }

    case "PNL-QL-142":
    case "PNL-QL-145": {
      const schemes = comparisonSchemes(random);
      return {
        qlId,
        registry,
        seed: seedValue,
        request: {
          mode: "COMPARE_TWO_DISHONEST_SCHEMES",
          firstScheme: schemes.firstScheme,
          secondScheme: schemes.secondScheme,
        },
        context: {
          firstScheme: schemeText(schemes.firstScheme),
          secondScheme: schemeText(schemes.secondScheme),
          schemeTable: [
            [
              "A",
              `Charge ${cp005FormatMoney(schemes.firstScheme.quotedSellingPricePerNominalQuantity)} against cost ${cp005FormatMoney(schemes.firstScheme.costPricePerTrueQuantity)}`,
              `Deliver ${schemes.firstScheme.deliveredQuantity} of ${schemes.firstScheme.trueQuantity} units`,
            ],
            [
              "B",
              `Charge ${cp005FormatMoney(schemes.secondScheme.quotedSellingPricePerNominalQuantity)} against cost ${cp005FormatMoney(schemes.secondScheme.costPricePerTrueQuantity)}`,
              `Deliver ${schemes.secondScheme.deliveredQuantity} of ${schemes.secondScheme.trueQuantity} units`,
            ],
          ],
        },
      };
    }

    default:
      throw new Error(`${qlId}: CP-005 dynamic generator is not implemented.`);
  }
}
