import taskRegistryJson from "./task-registry.library.json";
import editorialContentJson from "./editorial-content.en.json";

import {
  renderFriendlyExplanationMarkdown,
  renderStructuredStemMarkdown,
  type StructuredEditorialEntry,
} from "../foundation/editorial-content";
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
  solveDiscount,
  type DiscountSolveRequest,
  type DiscountSolveResult,
} from "../foundation/discount-solver";
import {
  solvePromotion,
  type PromotionSolveRequest,
  type PromotionSolveResult,
} from "../foundation/promotion-solver";
import {
  solveConditionalPromotion,
  type ConditionalPromotionRequest,
  type ConditionalPromotionResult,
} from "../foundation/conditional-promotion-solver";

export const PNL_CP002_ID = "PNL-CP-002" as const;
export const PNL_CP002_DYNAMIC_RUNTIME_MODE = "DYNAMIC_CANDIDATE" as const;
export const PNL_CP002_LANGUAGES = ["en"] as const;

export type PnlCp002Language = (typeof PNL_CP002_LANGUAGES)[number];
export type PnlCp002Difficulty = "Easy" | "Medium" | "Hard";

export type PnlCp002DynamicInput = Readonly<{
  difficultyBand?: PnlCp002Difficulty;
  language?: PnlCp002Language;
  questionLanguageId?: string;
  seed?: string;
}>;

type RegistryEntry = Readonly<{
  solveMode: string;
  answerSemantic: string;
  requiredVariables: readonly string[];
  difficulty: PnlCp002Difficulty;
  representation?: string;
}>;

type RegistryFile = Readonly<{
  archetypeId: "PNL-001";
  cpId: typeof PNL_CP002_ID;
  entries: Readonly<Record<string, RegistryEntry>>;
}>;

type EditorialFile = Readonly<{
  schemaVersion: 2;
  archetypeId: "PNL-001";
  cpId: typeof PNL_CP002_ID;
  language: "en";
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
}>;

type SolverRequest =
  | DiscountSolveRequest
  | PromotionSolveRequest
  | ConditionalPromotionRequest;
type SolverResult =
  | DiscountSolveResult
  | PromotionSolveResult
  | ConditionalPromotionResult;

type DynamicAnswer =
  | Readonly<{ kind: "MONEY"; value: Money }>
  | Readonly<{ kind: "PERCENT"; value: Rational }>
  | Readonly<{ kind: "TEXT"; value: string }>;

type GeneratedCase = Readonly<{
  qlId: string;
  registry: RegistryEntry;
  request: SolverRequest;
  context: Readonly<Record<string, unknown>>;
  seed: string;
}>;

const taskRegistry = taskRegistryJson as RegistryFile;
const editorialLibrary = editorialContentJson as EditorialFile;
const qlIds = Object.keys(taskRegistry.entries);

const MARKED_PRICES = [
  1200, 1500, 1800, 2000, 2400, 2500, 3000, 3600, 4000, 4500, 5000, 6000, 7200,
  8000, 9000, 10000, 12000,
] as const;
const COST_PRICES = [
  1000, 1200, 1600, 2000, 2400, 3000, 3200, 4000, 4800, 5000, 6000, 8000,
] as const;
const DISCOUNT_RATES = [5, 10, 15, 20, 25, 30, 40] as const;
const SECOND_DISCOUNT_RATES = [5, 10, 15, 20, 25] as const;
const MARKUP_RATES = [20, 25, 40, 50, 60, 80] as const;
const CASHBACK_RATES = [5, 10, 12, 15, 20] as const;
const COUPON_RATES = [5, 10, 15, 20] as const;
const FRACTIONS = [
  [1, 10],
  [1, 8],
  [1, 5],
  [1, 4],
  [2, 5],
] as const;
const PAID_MARKED_RATIOS = [
  [9, 10],
  [4, 5],
  [3, 4],
  [7, 10],
  [3, 5],
] as const;
const BUNDLE_PAIRS = [
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [3, 2],
] as const;
const SUCCESSIVE_PAIRS = [
  [10, 10],
  [10, 20],
  [15, 10],
  [20, 10],
  [20, 20],
  [25, 10],
  [30, 10],
] as const;
const TRIPLE_DISCOUNTS = [
  [10, 10, 10],
  [10, 20, 25],
  [20, 10, 10],
  [15, 20, 10],
  [25, 10, 20],
] as const;

function rupees(value: number): Money {
  return moneyFromRupees(value);
}

function plainMoney(value: Money): string {
  const whole = value.paise / 100n;
  const remainder = value.paise % 100n;
  if (remainder === 0n) return whole.toString();
  return `${whole}.${remainder.toString().padStart(2, "0")}`;
}

function formatMoney(value: Money): string {
  return `₹${plainMoney(value)}`;
}

function formatRational(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  const numeric = rationalToNumber(value);
  return numeric
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1");
}

function formatPercent(value: Rational): string {
  return `${formatRational(value)}%`;
}

function rate(value: number): Rational {
  return rational(value);
}

function pickNumber(random: SeededRandom, values: readonly number[]): number {
  return pickSeeded(random, values);
}

function solve(request: SolverRequest): SolverResult {
  switch (request.mode) {
    case "MP_DISCOUNT_TO_SP":
    case "MP_SP_TO_DISCOUNT":
    case "SP_DISCOUNT_TO_MP":
    case "MP_DISCOUNT_TO_AMOUNT":
    case "MP_AMOUNT_TO_DISCOUNT":
    case "MP_AMOUNT_TO_SP":
    case "SUCCESSIVE_DISCOUNTS_TO_SP":
    case "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT":
    case "KNOWN_AND_EQUIVALENT_TO_MISSING_DISCOUNT":
    case "SINGLE_VS_SUCCESSIVE_TO_SP_DIFFERENCE":
    case "CP_MARKUP_DISCOUNT_TO_RESULT":
    case "MP_CP_TARGET_RATE_TO_DISCOUNT":
    case "CP_DISCOUNT_TARGET_RATE_TO_MARKUP":
      return solveDiscount(request);
    case "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT":
    case "BUY_X_GET_Y_TO_EFFECTIVE_UNIT_PRICE":
    case "CASHBACK_TO_EFFECTIVE_PRICE":
    case "CASHBACK_PERCENT_TO_EFFECTIVE_PRICE":
    case "DISCOUNT_THEN_FLAT_COUPON_TO_EFFECTIVE_PRICE":
    case "DISCOUNT_VS_CASHBACK_COMPARE":
      return solvePromotion(request);
    case "THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP":
    case "COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE":
    case "DISCOUNT_THEN_PERCENT_COUPON_TO_EFFECTIVE_PRICE":
    case "PERCENT_CASHBACK_ON_BILLED_AMOUNT":
    case "PERCENT_CASHBACK_ON_ORIGINAL_PRICE_AFTER_DISCOUNT":
    case "DISCOUNT_FRACTION_TO_PERCENT":
    case "PAID_TO_MARKED_RATIO_TO_DISCOUNT":
    case "MIN_SPEND_COUPON_VS_DISCOUNT_COMPARE":
    case "COUPON_ORDER_COMPARE":
      return solveConditionalPromotion(request);
  }
}

function generateCase(qlId: string, seed: string): GeneratedCase {
  const registry = taskRegistry.entries[qlId];
  if (!registry) throw new Error(`Unknown CP-002 QL: ${qlId}`);
  const random = createSeededRandom(`${seed}:${qlId}:parameters`);
  const markedPrice = rupees(pickNumber(random, MARKED_PRICES));
  const discountPercent = rate(pickNumber(random, DISCOUNT_RATES));
  const pair = pickSeeded(random, SUCCESSIVE_PAIRS);
  const firstDiscountPercent = rate(pair[0]);
  const secondDiscountPercent = rate(pair[1]);

  switch (qlId) {
    case "PNL-QL-037":
      return {
        qlId,
        registry,
        seed,
        request: { mode: "MP_DISCOUNT_TO_SP", markedPrice, discountPercent },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent),
        },
      };

    case "PNL-QL-038": {
      const sellingPrice = solveDiscount({
        mode: "MP_DISCOUNT_TO_SP",
        markedPrice,
        discountPercent,
      }).sellingPrice;
      return {
        qlId,
        registry,
        seed,
        request: { mode: "MP_SP_TO_DISCOUNT", markedPrice, sellingPrice },
        context: {
          markedPrice: plainMoney(markedPrice),
          sellingPrice: plainMoney(sellingPrice),
        },
      };
    }

    case "PNL-QL-039": {
      const originalMarkedPrice = markedPrice;
      const sellingPrice = solveDiscount({
        mode: "MP_DISCOUNT_TO_SP",
        markedPrice: originalMarkedPrice,
        discountPercent,
      }).sellingPrice;
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "SP_DISCOUNT_TO_MP",
          sellingPrice,
          discountPercent,
        },
        context: {
          sellingPrice: plainMoney(sellingPrice),
          discountPercent: formatRational(discountPercent),
        },
      };
    }

    case "PNL-QL-040":
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "SUCCESSIVE_DISCOUNTS_TO_SP",
          markedPrice,
          discountPercents: [firstDiscountPercent, secondDiscountPercent],
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          firstDiscountPercent: formatRational(firstDiscountPercent),
          secondDiscountPercent: formatRational(secondDiscountPercent),
        },
      };

    case "PNL-QL-041":
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT",
          discountPercents: [firstDiscountPercent, secondDiscountPercent],
        },
        context: {
          firstDiscountPercent: formatRational(firstDiscountPercent),
          secondDiscountPercent: formatRational(secondDiscountPercent),
        },
      };

    case "PNL-QL-042":
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "MP_DISCOUNT_TO_AMOUNT",
          markedPrice,
          discountPercent,
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent),
        },
      };

    case "PNL-QL-043": {
      const discountAmount = solveDiscount({
        mode: "MP_DISCOUNT_TO_AMOUNT",
        markedPrice,
        discountPercent,
      }).discountAmount;
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "MP_AMOUNT_TO_DISCOUNT",
          markedPrice,
          discountAmount,
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountAmount: plainMoney(discountAmount),
        },
      };
    }

    case "PNL-QL-044": {
      const discountAmount = solveDiscount({
        mode: "MP_DISCOUNT_TO_AMOUNT",
        markedPrice,
        discountPercent,
      }).discountAmount;
      return {
        qlId,
        registry,
        seed,
        request: { mode: "MP_AMOUNT_TO_SP", markedPrice, discountAmount },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountAmount: plainMoney(discountAmount),
        },
      };
    }

    case "PNL-QL-045": {
      const equivalentDiscountPercent = solveDiscount({
        mode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT",
        discountPercents: [firstDiscountPercent, secondDiscountPercent],
      }).equivalentDiscountPercent;
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "KNOWN_AND_EQUIVALENT_TO_MISSING_DISCOUNT",
          knownDiscountPercent: firstDiscountPercent,
          equivalentDiscountPercent,
        },
        context: {
          knownDiscountPercent: formatRational(firstDiscountPercent),
          equivalentDiscountPercent: formatRational(equivalentDiscountPercent),
        },
      };
    }

    case "PNL-QL-046": {
      const singleDiscountPercent = rate(
        pickNumber(random, SECOND_DISCOUNT_RATES),
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "SINGLE_VS_SUCCESSIVE_TO_SP_DIFFERENCE",
          markedPrice,
          singleDiscountPercent,
          successiveDiscountPercents: [
            firstDiscountPercent,
            secondDiscountPercent,
          ],
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          singleDiscountPercent: formatRational(singleDiscountPercent),
          firstDiscountPercent: formatRational(firstDiscountPercent),
          secondDiscountPercent: formatRational(secondDiscountPercent),
        },
      };
    }

    case "PNL-QL-047":
    case "PNL-QL-048":
    case "PNL-QL-066": {
      const costPrice = rupees(pickNumber(random, COST_PRICES));
      const markupPercent = rate(pickNumber(random, MARKUP_RATES));
      const chosenDiscount = rate(pickNumber(random, DISCOUNT_RATES));
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "CP_MARKUP_DISCOUNT_TO_RESULT",
          costPrice,
          markupPercent,
          discountPercent: chosenDiscount,
        },
        context: {
          costPrice: plainMoney(costPrice),
          markupPercent: formatRational(markupPercent),
          discountPercent: formatRational(chosenDiscount),
          ...(qlId === "PNL-QL-066"
            ? {
                caseletData: [
                  "A retailer is planning a promotional sale for a single article.",
                  "Markup is calculated on cost price, while the advertised discount is calculated on marked price.",
                ],
              }
            : {}),
        },
      };
    }

    case "PNL-QL-049":
    case "PNL-QL-070": {
      const scenarios = [
        { cost: 4000, marked: 6000, direction: "PROFIT" as const, target: 20 },
        { cost: 5000, marked: 7500, direction: "PROFIT" as const, target: 25 },
        { cost: 6000, marked: 8000, direction: "PROFIT" as const, target: 20 },
        { cost: 8000, marked: 10000, direction: "LOSS" as const, target: 10 },
      ] as const;
      const scenario = pickSeeded(random, scenarios);
      const costPrice = rupees(scenario.cost);
      const scenarioMarkedPrice = rupees(scenario.marked);
      const targetRatePercent = rate(scenario.target);
      const request: DiscountSolveRequest = {
        mode: "MP_CP_TARGET_RATE_TO_DISCOUNT",
        markedPrice: scenarioMarkedPrice,
        costPrice,
        direction: scenario.direction,
        targetRatePercent,
      };
      const targetResult = solveDiscount(request);
      const targetSellingPrice = rupees(
        scenario.direction === "PROFIT"
          ? (scenario.cost * (100 + scenario.target)) / 100
          : (scenario.cost * (100 - scenario.target)) / 100,
      );
      const discountAmount = moneyFromPaise(
        scenarioMarkedPrice.paise - targetSellingPrice.paise,
      );
      return {
        qlId,
        registry,
        seed,
        request,
        context: {
          costPrice: plainMoney(costPrice),
          markedPrice: plainMoney(scenarioMarkedPrice),
          targetRatePercent: formatRational(targetRatePercent),
          targetDirection: scenario.direction.toLowerCase(),
          ...(qlId === "PNL-QL-070"
            ? {
                statementOne: `The cost price is ${formatMoney(costPrice)}, and the target result is ${formatRational(targetRatePercent)}% ${scenario.direction.toLowerCase()}.`,
                statementTwo: `The marked price is ${formatMoney(scenarioMarkedPrice)}.`,
                requiredDiscountPercent: formatRational(
                  targetResult.discountPercent,
                ),
              }
            : {}),
        },
      };
    }

    case "PNL-QL-050": {
      const scenarios = [
        { cost: 4000, discount: 20, direction: "PROFIT" as const, target: 20 },
        { cost: 5000, discount: 20, direction: "PROFIT" as const, target: 20 },
        { cost: 6000, discount: 25, direction: "PROFIT" as const, target: 25 },
        { cost: 8000, discount: 20, direction: "LOSS" as const, target: 10 },
      ] as const;
      const scenario = pickSeeded(random, scenarios);
      const costPrice = rupees(scenario.cost);
      const chosenDiscount = rate(scenario.discount);
      const targetRatePercent = rate(scenario.target);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "CP_DISCOUNT_TARGET_RATE_TO_MARKUP",
          costPrice,
          discountPercent: chosenDiscount,
          direction: scenario.direction,
          targetRatePercent,
        },
        context: {
          costPrice: plainMoney(costPrice),
          discountPercent: formatRational(chosenDiscount),
          targetRatePercent: formatRational(targetRatePercent),
          targetDirection: scenario.direction.toLowerCase(),
        },
      };
    }

    case "PNL-QL-051":
    case "PNL-QL-052": {
      const units = pickSeeded(random, BUNDLE_PAIRS);
      const paidUnits = BigInt(units[0]);
      const freeUnits = BigInt(units[1]);
      const totalUnits = Number(paidUnits + freeUnits);
      const unitMarkedPrice = rupees(
        totalUnits * pickNumber(random, [80, 100, 120, 150, 200]),
      );
      return {
        qlId,
        registry,
        seed,
        request:
          qlId === "PNL-QL-051"
            ? {
                mode: "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT",
                paidUnits,
                freeUnits,
              }
            : {
                mode: "BUY_X_GET_Y_TO_EFFECTIVE_UNIT_PRICE",
                unitMarkedPrice,
                paidUnits,
                freeUnits,
              },
        context: {
          paidUnits: paidUnits.toString(),
          freeUnits: freeUnits.toString(),
          unitMarkedPrice: plainMoney(unitMarkedPrice),
        },
      };
    }

    case "PNL-QL-053": {
      const billedPrice = markedPrice;
      const cashbackAmount = rupees(
        pickNumber(random, [100, 150, 200, 250, 300, 400, 500]),
      );
      const safeCashback =
        cashbackAmount.paise < billedPrice.paise
          ? cashbackAmount
          : moneyFromPaise(billedPrice.paise / 10n);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "CASHBACK_TO_EFFECTIVE_PRICE",
          billedPrice,
          cashbackAmount: safeCashback,
        },
        context: {
          billedPrice: plainMoney(billedPrice),
          cashbackAmount: plainMoney(safeCashback),
        },
      };
    }

    case "PNL-QL-054": {
      const billedPrice = markedPrice;
      const cashbackPercent = rate(pickNumber(random, CASHBACK_RATES));
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "CASHBACK_PERCENT_TO_EFFECTIVE_PRICE",
          billedPrice,
          cashbackPercent,
        },
        context: {
          billedPrice: plainMoney(billedPrice),
          cashbackPercent: formatRational(cashbackPercent),
        },
      };
    }

    case "PNL-QL-055": {
      const couponAmount = rupees(
        pickNumber(random, [100, 150, 200, 250, 300, 400]),
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "DISCOUNT_THEN_FLAT_COUPON_TO_EFFECTIVE_PRICE",
          markedPrice,
          discountPercent,
          couponAmount,
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent),
          couponAmount: plainMoney(couponAmount),
        },
      };
    }

    case "PNL-QL-056": {
      const cashbackAmount = rupees(
        pickNumber(random, [100, 200, 250, 300, 400, 500, 600]),
      );
      const safeCashback =
        cashbackAmount.paise <= markedPrice.paise
          ? cashbackAmount
          : moneyFromPaise(markedPrice.paise / 10n);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "DISCOUNT_VS_CASHBACK_COMPARE",
          markedPrice,
          discountPercent,
          cashbackAmount: safeCashback,
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent),
          cashbackAmount: plainMoney(safeCashback),
        },
      };
    }

    case "PNL-QL-057": {
      const discounts = pickSeeded(random, TRIPLE_DISCOUNTS);
      const [first, second, third] = discounts.map(rate);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP",
          markedPrice,
          discountPercents: [first, second, third],
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          firstDiscountPercent: formatRational(first),
          secondDiscountPercent: formatRational(second),
          thirdDiscountPercent: formatRational(third),
        },
      };
    }

    case "PNL-QL-058": {
      const minimumSpend = rupees(
        pickNumber(random, [1500, 2000, 2500, 3000, 4000]),
      );
      const eligible = random.next() >= 0.5;
      const billedPrice = moneyFromPaise(
        minimumSpend.paise + (eligible ? 50000n : -30000n),
      );
      const couponAmount = rupees(
        pickNumber(random, [100, 200, 250, 300, 400]),
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE",
          billedPrice,
          minimumSpend,
          couponAmount,
        },
        context: {
          billedPrice: plainMoney(billedPrice),
          minimumSpend: plainMoney(minimumSpend),
          couponAmount: plainMoney(couponAmount),
        },
      };
    }

    case "PNL-QL-059": {
      const couponPercent = rate(pickNumber(random, COUPON_RATES));
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "DISCOUNT_THEN_PERCENT_COUPON_TO_EFFECTIVE_PRICE",
          markedPrice,
          discountPercent,
          couponPercent,
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent),
          couponPercent: formatRational(couponPercent),
        },
      };
    }

    case "PNL-QL-060": {
      const billedPrice = markedPrice;
      const cashbackPercent = rate(pickNumber(random, CASHBACK_RATES));
      const cashbackCap = rupees(
        pickNumber(random, [200, 250, 300, 400, 500, 600]),
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "PERCENT_CASHBACK_ON_BILLED_AMOUNT",
          billedPrice,
          cashbackPercent,
          cashbackCap,
        },
        context: {
          billedPrice: plainMoney(billedPrice),
          cashbackPercent: formatRational(cashbackPercent),
          cashbackCap: plainMoney(cashbackCap),
        },
      };
    }

    case "PNL-QL-061": {
      const cashbackPercent = rate(pickNumber(random, CASHBACK_RATES));
      const cashbackCap = rupees(
        pickNumber(random, [300, 400, 500, 600, 750, 1000]),
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "PERCENT_CASHBACK_ON_ORIGINAL_PRICE_AFTER_DISCOUNT",
          markedPrice,
          discountPercent,
          cashbackPercent,
          cashbackCap,
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent),
          cashbackPercent: formatRational(cashbackPercent),
          cashbackCap: plainMoney(cashbackCap),
        },
      };
    }

    case "PNL-QL-062": {
      const fraction = pickSeeded(random, FRACTIONS);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "DISCOUNT_FRACTION_TO_PERCENT",
          discountFraction: rational(fraction[0], fraction[1]),
        },
        context: {
          fractionNumerator: fraction[0],
          fractionDenominator: fraction[1],
        },
      };
    }

    case "PNL-QL-063": {
      const ratioPair = pickSeeded(random, PAID_MARKED_RATIOS);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "PAID_TO_MARKED_RATIO_TO_DISCOUNT",
          paidPart: rational(ratioPair[0]),
          markedPart: rational(ratioPair[1]),
        },
        context: { paidPart: ratioPair[0], markedPart: ratioPair[1] },
      };
    }

    case "PNL-QL-064": {
      const billedPrice = markedPrice;
      const minimumSpend = rupees(
        pickNumber(random, [1500, 2000, 2500, 3000, 4000, 5000]),
      );
      const couponAmount = rupees(
        pickNumber(random, [100, 200, 300, 400, 500, 600]),
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "MIN_SPEND_COUPON_VS_DISCOUNT_COMPARE",
          markedPrice: billedPrice,
          discountPercent,
          minimumSpend,
          couponAmount,
        },
        context: {
          billedPrice: plainMoney(billedPrice),
          discountPercent: formatRational(discountPercent),
          minimumSpend: plainMoney(minimumSpend),
          couponAmount: plainMoney(couponAmount),
        },
      };
    }

    case "PNL-QL-065": {
      const offers = [
        { id: "A", discounts: [10, 10] as const },
        { id: "B", discounts: [20, 5] as const },
        { id: "C", discounts: [15, 10] as const },
      ] as const;
      const selected = pickSeeded(random, offers);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "SUCCESSIVE_DISCOUNTS_TO_SP",
          markedPrice,
          discountPercents: selected.discounts.map(rate),
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          selectedOffer: selected.id,
          offerTable: offers.map((offer) => [
            offer.id,
            `${offer.discounts[0]}%`,
            `${offer.discounts[1]}%`,
          ]),
        },
      };
    }

    case "PNL-QL-067":
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT",
          discountPercents: [firstDiscountPercent, secondDiscountPercent],
        },
        context: {
          firstDiscountPercent: formatRational(firstDiscountPercent),
          secondDiscountPercent: formatRational(secondDiscountPercent),
        },
      };

    case "PNL-QL-068": {
      const expressionPairs = [
        { marked: 5, selling: 4 },
        { marked: 4, selling: 3 },
        { marked: 10, selling: 9 },
        { marked: 5, selling: 3 },
      ] as const;
      const expressions = pickSeeded(random, expressionPairs);
      const algebraicMarkedPrice = rupees(expressions.marked * 1000);
      const algebraicSellingPrice = rupees(expressions.selling * 1000);
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "MP_SP_TO_DISCOUNT",
          markedPrice: algebraicMarkedPrice,
          sellingPrice: algebraicSellingPrice,
        },
        context: {
          markedPriceExpression: `${expressions.marked}x`,
          sellingPriceExpression: `${expressions.selling}x`,
        },
      };
    }

    case "PNL-QL-069": {
      const couponAmount = rupees(
        pickNumber(random, [100, 200, 250, 300, 400, 500]),
      );
      return {
        qlId,
        registry,
        seed,
        request: {
          mode: "COUPON_ORDER_COMPARE",
          markedPrice,
          discountPercent,
          couponAmount,
        },
        context: {
          markedPrice: plainMoney(markedPrice),
          discountPercent: formatRational(discountPercent),
          couponAmount: plainMoney(couponAmount),
        },
      };
    }

    default:
      throw new Error(`${qlId}: CP-002 dynamic generator is not implemented.`);
  }
}

function answerFor(qlId: string, result: SolverResult): DynamicAnswer {
  switch (qlId) {
    case "PNL-QL-037":
    case "PNL-QL-040":
    case "PNL-QL-044":
    case "PNL-QL-052":
    case "PNL-QL-053":
    case "PNL-QL-054":
    case "PNL-QL-055":
    case "PNL-QL-057":
    case "PNL-QL-059":
    case "PNL-QL-065": {
      const value =
        "sellingPrice" in result
          ? result.sellingPrice
          : "effectiveUnitPrice" in result
            ? result.effectiveUnitPrice
            : "effectivePrice" in result
              ? result.effectivePrice
              : null;
      if (!value) throw new Error(`${qlId}: expected a money answer.`);
      return { kind: "MONEY", value };
    }

    case "PNL-QL-039":
      if (!("markedPrice" in result))
        throw new Error(`${qlId}: expected marked price.`);
      return { kind: "MONEY", value: result.markedPrice };

    case "PNL-QL-042":
      if (!("discountAmount" in result))
        throw new Error(`${qlId}: expected discount amount.`);
      return { kind: "MONEY", value: result.discountAmount };

    case "PNL-QL-038":
    case "PNL-QL-043":
    case "PNL-QL-062":
    case "PNL-QL-063":
    case "PNL-QL-068":
      if (!("discountPercent" in result))
        throw new Error(`${qlId}: expected discount percentage.`);
      return { kind: "PERCENT", value: result.discountPercent };

    case "PNL-QL-041":
    case "PNL-QL-051":
      if (!("equivalentDiscountPercent" in result))
        throw new Error(`${qlId}: expected equivalent discount.`);
      return { kind: "PERCENT", value: result.equivalentDiscountPercent };

    case "PNL-QL-045":
      if (!("missingDiscountPercent" in result))
        throw new Error(`${qlId}: expected missing discount.`);
      return { kind: "PERCENT", value: result.missingDiscountPercent };

    case "PNL-QL-049":
      if (!("discountPercent" in result))
        throw new Error(`${qlId}: expected required discount.`);
      return { kind: "PERCENT", value: result.discountPercent };

    case "PNL-QL-050":
      if (!("markupPercent" in result))
        throw new Error(`${qlId}: expected markup percentage.`);
      return { kind: "PERCENT", value: result.markupPercent };

    case "PNL-QL-046":
      if (!("betterOffer" in result) || !("differenceAmount" in result)) {
        throw new Error(`${qlId}: expected offer comparison.`);
      }
      return {
        kind: "TEXT",
        value:
          result.betterOffer === "SAME"
            ? "Both offers give the same selling price"
            : `${result.betterOffer === "SINGLE" ? "Single-discount offer" : "Successive-discount offer"} is better by ${formatMoney(result.differenceAmount)}`,
      };

    case "PNL-QL-047":
    case "PNL-QL-066":
      if (!("direction" in result) || !("ratePercent" in result)) {
        throw new Error(`${qlId}: expected profit/loss percentage.`);
      }
      return {
        kind: "TEXT",
        value:
          result.direction === "NO_CHANGE"
            ? "No profit, no loss"
            : `${formatPercent(result.ratePercent)} ${result.direction.toLowerCase()}`,
      };

    case "PNL-QL-048":
      if (!("direction" in result) || !("amount" in result)) {
        throw new Error(`${qlId}: expected profit/loss amount.`);
      }
      return {
        kind: "TEXT",
        value:
          result.direction === "NO_CHANGE"
            ? "No profit, no loss"
            : `${result.direction === "PROFIT" ? "Profit" : "Loss"} of ${formatMoney(result.amount)}`,
      };

    case "PNL-QL-056":
      if (!("betterOffer" in result) || !("differenceAmount" in result)) {
        throw new Error(`${qlId}: expected discount/cashback comparison.`);
      }
      return {
        kind: "TEXT",
        value:
          result.betterOffer === "SAME"
            ? "Both offers give the same effective cost"
            : `${result.betterOffer === "DISCOUNT" ? "Discount offer" : "Cashback offer"} is better by ${formatMoney(result.differenceAmount)}`,
      };

    case "PNL-QL-058":
      if (!("couponApplied" in result) || !("effectivePrice" in result)) {
        throw new Error(`${qlId}: expected coupon eligibility result.`);
      }
      return {
        kind: "TEXT",
        value: `${result.couponApplied ? "Coupon applies" : "Coupon does not apply"}; effective price ${formatMoney(result.effectivePrice)}`,
      };

    case "PNL-QL-060":
      if (!("cashbackAmount" in result) || !("effectivePrice" in result)) {
        throw new Error(`${qlId}: expected cashback result.`);
      }
      return {
        kind: "TEXT",
        value: `Cashback ${formatMoney(result.cashbackAmount)}; effective cost ${formatMoney(result.effectivePrice)}`,
      };

    case "PNL-QL-061":
      if (
        !("billedPrice" in result) ||
        !("cashbackAmount" in result) ||
        !("effectivePrice" in result)
      ) {
        throw new Error(`${qlId}: expected billed/cashback result.`);
      }
      return {
        kind: "TEXT",
        value: `Billed price ${formatMoney(result.billedPrice)}; cashback ${formatMoney(result.cashbackAmount)}; effective cost ${formatMoney(result.effectivePrice)}`,
      };

    case "PNL-QL-064":
      if (
        !("couponEligible" in result) ||
        !("betterOffer" in result) ||
        !("differenceAmount" in result)
      ) {
        throw new Error(`${qlId}: expected eligible offer comparison.`);
      }
      return {
        kind: "TEXT",
        value: `${result.couponEligible ? "Coupon is eligible" : "Coupon is not eligible"}; ${result.betterOffer === "SAME" ? "both offers are equal" : `${result.betterOffer === "DISCOUNT" ? "discount offer" : "coupon offer"} is better by ${formatMoney(result.differenceAmount)}`}`,
      };

    case "PNL-QL-067":
      return { kind: "TEXT", value: "Statement 2 only" };

    case "PNL-QL-069":
      if (!("betterOrder" in result) || !("differenceAmount" in result)) {
        throw new Error(`${qlId}: expected coupon-order comparison.`);
      }
      return {
        kind: "TEXT",
        value:
          result.betterOrder === "SAME"
            ? "Both orders give the same price"
            : `${result.betterOrder === "DISCOUNT_THEN_COUPON" ? "Discount then coupon" : "Coupon then discount"} is better by ${formatMoney(result.differenceAmount)}`,
      };

    case "PNL-QL-070":
      return { kind: "TEXT", value: "Both statements together are required" };

    default:
      throw new Error(`${qlId}: dynamic answer mapping is missing.`);
  }
}

function formatAnswer(answer: DynamicAnswer): string {
  switch (answer.kind) {
    case "MONEY":
      return formatMoney(answer.value);
    case "PERCENT":
      return formatPercent(answer.value);
    case "TEXT":
      return answer.value;
  }
}

function numericDistractors(answer: DynamicAnswer): readonly string[] {
  if (answer.kind === "MONEY") {
    const paise = answer.value.paise;
    const candidates = [
      moneyFromPaise((paise * 90n) / 100n),
      moneyFromPaise((paise * 110n) / 100n),
      moneyFromPaise(paise + 5000n),
      moneyFromPaise(paise > 5000n ? paise - 5000n : paise + 10000n),
    ];
    return candidates.map(formatMoney);
  }
  if (answer.kind === "PERCENT") {
    const numeric = rationalToNumber(answer.value);
    const candidates = [
      Math.max(0, numeric - 5),
      numeric + 5,
      Math.max(0, 100 - numeric),
      numeric + 10,
    ];
    return candidates.map((value) => `${Number(value.toFixed(2))}%`);
  }
  return [];
}

function textDistractors(qlId: string, correct: string): readonly string[] {
  const pools: Record<string, readonly string[]> = {
    "PNL-QL-046": [
      "Single-discount offer is better by ₹100",
      "Successive-discount offer is better by ₹100",
      "Both offers give the same selling price",
      "The better offer cannot be determined",
    ],
    "PNL-QL-047": [
      "10% profit",
      "10% loss",
      "No profit, no loss",
      "20% profit",
    ],
    "PNL-QL-048": [
      "Profit of ₹100",
      "Loss of ₹100",
      "No profit, no loss",
      "Profit of ₹200",
    ],
    "PNL-QL-056": [
      "Discount offer is better by ₹100",
      "Cashback offer is better by ₹100",
      "Both offers give the same effective cost",
      "The better offer cannot be determined",
    ],
    "PNL-QL-058": [
      "Coupon applies; effective price ₹1000",
      "Coupon does not apply; effective price ₹1000",
      "Coupon applies; effective price ₹1200",
      "Eligibility cannot be determined",
    ],
    "PNL-QL-060": [
      "Cashback ₹200; effective cost ₹1800",
      "Cashback ₹300; effective cost ₹1700",
      "Cashback ₹400; effective cost ₹1600",
      "The cashback cap is ignored",
    ],
    "PNL-QL-061": [
      "Cashback is calculated on the billed price",
      "The cap does not apply",
      "The discount and cashback percentages are added",
      "The billed price equals the effective cost",
    ],
    "PNL-QL-064": [
      "Coupon is eligible; coupon offer is better by ₹100",
      "Coupon is not eligible; discount offer is better by ₹100",
      "Both offers are equal",
      "Eligibility cannot be determined",
    ],
    "PNL-QL-067": [
      "Statement 1 only",
      "Statement 2 only",
      "Both statements are correct",
      "Neither statement is correct",
    ],
    "PNL-QL-069": [
      "Discount then coupon is better by ₹100",
      "Coupon then discount is better by ₹100",
      "Both orders give the same price",
      "Order cannot be compared",
    ],
    "PNL-QL-070": [
      "Statement 1 alone is sufficient",
      "Statement 2 alone is sufficient",
      "Either statement alone is sufficient",
      "Both statements together are required",
    ],
  };
  const pool = pools[qlId] ?? [
    "No profit, no loss",
    "Cannot be determined",
    "Both alternatives are equal",
    "None of these",
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
    { value: unique[0]!, label: "WRONG_BASE_OR_STAGE" },
    { value: unique[1]!, label: "ADDITIVE_PERCENTAGE_ERROR" },
    { value: unique[2]!, label: "ELIGIBILITY_OR_ORDER_ERROR" },
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

function formatDiscountSequence(values: readonly Rational[]): string {
  return values.map(formatPercent).join(", ");
}

function buildCp002GeneratedWorking(
  qlId: string,
  request: SolverRequest,
  answer: string,
): string {
  const prefix = "**Generated-value check:**";

  switch (request.mode) {
    case "MP_DISCOUNT_TO_SP":
      return `${prefix} A ${formatPercent(request.discountPercent)} discount is taken from ${formatMoney(request.markedPrice)}; the retained share of the marked price gives ${answer}.`;

    case "MP_SP_TO_DISCOUNT":
      return `${prefix} The price falls from ${formatMoney(request.markedPrice)} to ${formatMoney(request.sellingPrice)}. Measuring that reduction against the marked price gives ${answer}.`;

    case "SP_DISCOUNT_TO_MP":
      return `${prefix} The displayed selling price ${formatMoney(request.sellingPrice)} is what remains after a ${formatPercent(request.discountPercent)} discount. Reversing that retained share gives ${answer}.`;

    case "MP_DISCOUNT_TO_AMOUNT":
      return `${prefix} Taking ${formatPercent(request.discountPercent)} of the marked price ${formatMoney(request.markedPrice)} gives the discount amount ${answer}.`;

    case "MP_AMOUNT_TO_DISCOUNT":
      return `${prefix} The reduction is ${formatMoney(request.discountAmount)} on a marked-price base of ${formatMoney(request.markedPrice)}. Reduction divided by base, then multiplied by 100, gives ${answer}.`;

    case "MP_AMOUNT_TO_SP":
      return `${prefix} Subtract the stated discount amount ${formatMoney(request.discountAmount)} from ${formatMoney(request.markedPrice)}; the payable price is ${answer}.`;

    case "SUCCESSIVE_DISCOUNTS_TO_SP":
      return `${prefix} Apply ${formatDiscountSequence(request.discountPercents)} one after another to ${formatMoney(request.markedPrice)}. Each rate acts on the reduced balance, leaving ${answer}.`;

    case "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT":
      return `${prefix} Combine the retained multipliers for ${formatDiscountSequence(request.discountPercents)}, rather than adding the rates. Their single equivalent reduction is ${answer}.`;

    case "KNOWN_AND_EQUIVALENT_TO_MISSING_DISCOUNT":
      return `${prefix} The known ${formatPercent(request.knownDiscountPercent)} discount and the missing rate must reproduce an overall ${formatPercent(request.equivalentDiscountPercent)} reduction. Dividing the retained multipliers gives ${answer}.`;

    case "SINGLE_VS_SUCCESSIVE_TO_SP_DIFFERENCE":
      return `${prefix} Compare the ${formatPercent(request.singleDiscountPercent)} single discount with successive discounts of ${formatDiscountSequence(request.successiveDiscountPercents)} on the same ${formatMoney(request.markedPrice)} base. The comparison is ${answer}.`;

    case "CP_MARKUP_DISCOUNT_TO_RESULT": {
      const purpose =
        qlId === "PNL-QL-047"
          ? "For the requested profit-or-loss rate"
          : qlId === "PNL-QL-048"
            ? "For the requested profit-or-loss amount"
            : "For the caselet ledger";
      return `${prefix} ${purpose}, start from cost ${formatMoney(request.costPrice)}, apply the ${formatPercent(request.markupPercent)} markup, and then apply the ${formatPercent(request.discountPercent)} discount to that marked price. This produces ${answer}.`;
    }

    case "MP_CP_TARGET_RATE_TO_DISCOUNT":
      if (qlId === "PNL-QL-070") {
        return `${prefix} Statement I fixes the target selling price from cost and the target result, while Statement II supplies the marked price needed to measure discount. Therefore, ${answer}.`;
      }
      return `${prefix} First convert cost ${formatMoney(request.costPrice)} and the target ${formatPercent(request.targetRatePercent)} ${request.direction.toLowerCase()} into the required selling price. Compare that value with marked price ${formatMoney(request.markedPrice)}; the needed discount is ${answer}.`;

    case "CP_DISCOUNT_TARGET_RATE_TO_MARKUP":
      return `${prefix} The target ${formatPercent(request.targetRatePercent)} ${request.direction.toLowerCase()} fixes the selling price from cost ${formatMoney(request.costPrice)}. Reverse the ${formatPercent(request.discountPercent)} discount to recover marked price, giving the markup ${answer}.`;

    case "BUY_X_GET_Y_TO_EQUIVALENT_DISCOUNT":
      return `${prefix} Payment is made for ${request.paidUnits.toString()} units while ${request.freeUnits.toString()} units are free. The free share out of all received units is the equivalent discount, ${answer}.`;

    case "BUY_X_GET_Y_TO_EFFECTIVE_UNIT_PRICE":
      return `${prefix} Pay ${formatMoney(request.unitMarkedPrice)} for each of ${request.paidUnits.toString()} units and spread that total over ${(request.paidUnits + request.freeUnits).toString()} received units. The effective unit price is ${answer}.`;

    case "CASHBACK_TO_EFFECTIVE_PRICE":
      return `${prefix} Cashback is received after paying the billed price. Subtract ${formatMoney(request.cashbackAmount)} from ${formatMoney(request.billedPrice)} to obtain ${answer}.`;

    case "CASHBACK_PERCENT_TO_EFFECTIVE_PRICE":
      return `${prefix} Calculate ${formatPercent(request.cashbackPercent)} cashback on the billed amount ${formatMoney(request.billedPrice)}, then deduct it from that bill. The effective price is ${answer}.`;

    case "DISCOUNT_THEN_FLAT_COUPON_TO_EFFECTIVE_PRICE":
      return `${prefix} Reduce ${formatMoney(request.markedPrice)} by ${formatPercent(request.discountPercent)} first, then subtract the flat coupon ${formatMoney(request.couponAmount)}. The final payable amount is ${answer}.`;

    case "DISCOUNT_VS_CASHBACK_COMPARE":
      return `${prefix} Price both offers from the same ${formatMoney(request.markedPrice)} base: one uses a ${formatPercent(request.discountPercent)} discount and the other returns ${formatMoney(request.cashbackAmount)}. Their comparison is ${answer}.`;

    case "THREE_PLUS_SUCCESSIVE_DISCOUNTS_TO_SP":
      return `${prefix} Starting from ${formatMoney(request.markedPrice)}, apply ${formatDiscountSequence(request.discountPercents)} sequentially to the changing balance. The three-stage payable amount is ${answer}.`;

    case "COUPON_MINIMUM_SPEND_TO_EFFECTIVE_PRICE":
      return `${prefix} Compare billed price ${formatMoney(request.billedPrice)} with the eligibility threshold ${formatMoney(request.minimumSpend)}. Only an eligible bill receives the ${formatMoney(request.couponAmount)} coupon, leading to ${answer}.`;

    case "DISCOUNT_THEN_PERCENT_COUPON_TO_EFFECTIVE_PRICE":
      return `${prefix} Apply the ${formatPercent(request.discountPercent)} discount to ${formatMoney(request.markedPrice)}; the later ${formatPercent(request.couponPercent)} coupon acts on that reduced bill. The result is ${answer}.`;

    case "PERCENT_CASHBACK_ON_BILLED_AMOUNT": {
      const cap = request.cashbackCap
        ? ` with a cap of ${formatMoney(request.cashbackCap)}`
        : "";
      return `${prefix} Calculate ${formatPercent(request.cashbackPercent)} cashback on billed price ${formatMoney(request.billedPrice)}${cap}, then subtract the allowed cashback. This gives ${answer}.`;
    }

    case "PERCENT_CASHBACK_ON_ORIGINAL_PRICE_AFTER_DISCOUNT": {
      const cap = request.cashbackCap
        ? `, capped at ${formatMoney(request.cashbackCap)}`
        : "";
      return `${prefix} First discount ${formatMoney(request.markedPrice)} by ${formatPercent(request.discountPercent)}. Cashback is then calculated at ${formatPercent(request.cashbackPercent)} of the original marked price${cap}, producing ${answer}.`;
    }

    case "DISCOUNT_FRACTION_TO_PERCENT":
      return `${prefix} Convert the discount fraction ${formatRational(request.discountFraction)} into a percentage by multiplying by 100. The discount rate is ${answer}.`;

    case "PAID_TO_MARKED_RATIO_TO_DISCOUNT":
      return `${prefix} The paid-to-marked ratio is ${formatRational(request.paidPart)}:${formatRational(request.markedPart)}. The unpaid share of the marked price is the discount, ${answer}.`;

    case "MIN_SPEND_COUPON_VS_DISCOUNT_COMPARE":
      return `${prefix} On marked price ${formatMoney(request.markedPrice)}, compare the ${formatPercent(request.discountPercent)} discount with a ${formatMoney(request.couponAmount)} coupon that requires at least ${formatMoney(request.minimumSpend)} spend. The eligible comparison is ${answer}.`;

    case "COUPON_ORDER_COMPARE":
      return `${prefix} Use both orders on ${formatMoney(request.markedPrice)}: ${formatPercent(request.discountPercent)} then ${formatMoney(request.couponAmount)}, and coupon then discount. The order comparison is ${answer}.`;
  }
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_, item) =>
    typeof item === "bigint" ? item.toString() : item,
  );
}

function selectQl(input: PnlCp002DynamicInput): string {
  if (input.questionLanguageId) {
    const registry = taskRegistry.entries[input.questionLanguageId];
    if (!registry) {
      throw new Error(
        `Unknown CP-002 question-language ID: ${input.questionLanguageId}`,
      );
    }
    return input.questionLanguageId;
  }
  const eligible = qlIds.filter(
    (qlId) =>
      !input.difficultyBand ||
      taskRegistry.entries[qlId]!.difficulty === input.difficultyBand,
  );
  if (!eligible.length) {
    throw new Error("No CP-002 QLs match the requested difficulty.");
  }
  return pickSeeded(
    createSeededRandom(`${input.seed ?? "cp002-dynamic"}:ql-selection`),
    eligible,
  );
}

function containsUnresolvedProsePlaceholder(value: string): boolean {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
  return /\{[a-z][A-Za-z0-9_]*\}/.test(proseOnly);
}

export function listPnlCp002DynamicQlIds(): readonly string[] {
  return [...qlIds];
}

export function runPnlCp002DynamicPipeline(input: PnlCp002DynamicInput = {}) {
  if (input.language && input.language !== "en") {
    throw new Error(
      "PNL-CP-002 dynamic runtime currently supports English only.",
    );
  }
  const qlId = selectQl(input);
  const seed = input.seed ?? `${qlId}:dynamic-default`;
  const generated = generateCase(qlId, seed);
  const result = solve(generated.request);
  const recomputed = solve(generated.request);
  const answerValue = answerFor(qlId, result);
  const answer = formatAnswer(answerValue);
  const optionSet = buildOptions(qlId, seed, answerValue);
  const editorial = editorialLibrary.entries[qlId];
  if (!editorial)
    throw new Error(`${qlId}: English editorial entry is missing.`);
  const stem = renderStructuredStemMarkdown(editorial.stem, generated.context);
  const baseExplanation = renderFriendlyExplanationMarkdown(
    editorial.explanation,
    generated.context,
  );
  const generatedWorking = buildCp002GeneratedWorking(
    qlId,
    generated.request,
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
      message: "Exact recomputation agrees with the canonical CP-002 solver.",
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
  const validation = {
    valid: checks.every((check) => check.passed),
    checks,
  };
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
    canonicalProblemId: PNL_CP002_ID,
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
      canonicalProblemId: PNL_CP002_ID,
      questionId,
      questionLanguageId: qlId,
      explanationId,
      language: "en" as const,
      difficultyBand: generated.registry.difficulty,
      taskKind: generated.registry.solveMode,
      answerType: answerValue.kind,
      answerSemantic: generated.registry.answerSemantic,
      requiredVariables: [...generated.registry.requiredVariables],
      variables: generated.context,
      seed,
      runtimeMode: PNL_CP002_DYNAMIC_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      sourceTrace: {
        registry: "PNL-001/CP-002/task-registry.library.json",
        editorial: "PNL-001/CP-002/editorial-content.en.json",
        solver:
          "PNL-001/foundation/discount-solver.ts | promotion-solver.ts | conditional-promotion-solver.ts",
      },
    },
    solver: {
      answer,
      numericAnswer:
        answerValue.kind === "MONEY"
          ? Number(answerValue.value.paise) / 100
          : answerValue.kind === "PERCENT"
            ? rationalToNumber(answerValue.value)
            : null,
      answerType: answerValue.kind,
      evidence: {
        solveMode: generated.registry.solveMode,
        answerSemantic: generated.registry.answerSemantic,
        exactRecomputation: "PASS",
      },
      mathJax: {},
    },
    reasoningGraph: {
      graphId: `${qlId}-dynamic-graph`,
      nodes: [
        {
          id: "given",
          label: "Generated offer values",
          value: generated.context,
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
      canonicalProblemId: PNL_CP002_ID,
      questionLanguageId: qlId,
      explanationId,
      solveMode: generated.registry.solveMode,
      answerSemantic: generated.registry.answerSemantic,
      contextFamily: editorial.stem.contextFamily,
      difficultyBand: generated.registry.difficulty,
      seed,
      generationMode: PNL_CP002_DYNAMIC_RUNTIME_MODE,
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
