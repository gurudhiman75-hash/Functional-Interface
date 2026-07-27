import taskRegistryJson from "./task-registry.library.json";
import editorialContentJson from "./editorial-content.en.json";

import {
  renderFriendlyExplanationMarkdown,
  renderStructuredStemMarkdown,
  type EditorialDifficulty,
  type StructuredEditorialEntry,
} from "../foundation/editorial-content";
import {
  createSeededRandom,
  pickSeeded,
  type SeededRandom,
} from "../foundation/parameter-generator";
import {
  addRational,
  compareRational,
  divideRational,
  multiplyRational,
  rational,
  rationalToNumber,
  subtractRational,
} from "../foundation/rational";
import { moneyFromPaise, moneyFromRupees } from "../foundation/money";
import {
  solveFundamental,
  type FundamentalSolveRequest,
  type FundamentalSolveResult,
} from "../foundation/solver";
import type { Money, Rational } from "../foundation/types";
import {
  validateFundamentalInput,
  validateOptions,
} from "../foundation/validator";
import { verifyFundamentalResultIndependently } from "./cp001-dynamic-verifier";

export const PNL_CP001_ID = "PNL-CP-001" as const;
export const PNL_CP001_DYNAMIC_RUNTIME_MODE = "DYNAMIC_CANDIDATE" as const;
export const PNL_CP001_LANGUAGES = ["en"] as const;

export type PnlCp001Language = (typeof PNL_CP001_LANGUAGES)[number];
export type PnlCp001Difficulty = "Easy" | "Medium" | "Hard";

type RegistryEntry = Readonly<{
  solveMode: FundamentalSolveRequest["mode"];
  direction?: "PROFIT" | "LOSS" | "NO_CHANGE";
  percentageBase?: string;
  fractionBase?: "COST_PRICE" | "SELLING_PRICE";
  presentation?: string;
  answerSemantic: string;
  requiredVariables: readonly string[];
  difficulty: PnlCp001Difficulty;
}>;

type RegistryFile = Readonly<{
  archetypeId: "PNL-001";
  cpId: typeof PNL_CP001_ID;
  entries: Readonly<Record<string, RegistryEntry>>;
}>;

type EditorialFile = Readonly<{
  schemaVersion: 2;
  archetypeId: "PNL-001";
  cpId: typeof PNL_CP001_ID;
  language: "en";
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
}>;

type Direction = "PROFIT" | "LOSS" | "NO_CHANGE";

type DynamicAnswerValue =
  | Readonly<{ kind: "MONEY"; value: Money; direction?: Direction }>
  | Readonly<{ kind: "PERCENT"; value: Rational; direction?: Direction }>
  | Readonly<{ kind: "RATIO"; costPart: Rational; sellingPart: Rational }>
  | Readonly<{ kind: "FRACTION"; value: Rational }>
  | Readonly<{ kind: "NO_CHANGE" }>;

type OptionCandidate = Readonly<{
  value: DynamicAnswerValue;
  misconception: string;
}>;

type GeneratedFundamentalCase = Readonly<{
  qlId: string;
  registry: RegistryEntry;
  request: FundamentalSolveRequest;
  context: Readonly<Record<string, string | number>>;
  seed: string;
}>;

export type PnlCp001DynamicInput = Readonly<{
  difficultyBand?: PnlCp001Difficulty;
  language?: PnlCp001Language;
  questionLanguageId?: string;
  seed?: string;
}>;

const taskRegistry = taskRegistryJson as RegistryFile;
const editorialLibrary = editorialContentJson as EditorialFile;
const qlIds = Object.keys(taskRegistry.entries);

const COST_RUPEES = [
  2400, 3000, 3600, 4000, 4800, 6000, 7200, 8000, 9000, 9600, 12000,
  14400, 15000, 18000, 20000, 24000,
] as const;
const RATE_VALUES: readonly Rational[] = [
  rational(5),
  rational(10),
  rational(25, 2),
  rational(15),
  rational(20),
  rational(25),
  rational(30),
  rational(40),
  rational(50),
];
const MARGIN_VALUES: readonly Rational[] = [
  rational(10),
  rational(20),
  rational(25),
  rational(40),
  rational(50),
];
const PROFIT_FOR_MARGIN_VALUES: readonly Rational[] = [
  rational(10),
  rational(20),
  rational(25),
  rational(50),
  rational(100),
];
const PROFIT_SP_FRACTIONS: readonly Rational[] = [
  rational(1, 11),
  rational(1, 6),
  rational(1, 5),
  rational(1, 4),
  rational(1, 3),
];
const LOSS_SP_FRACTIONS: readonly Rational[] = [
  rational(1, 9),
  rational(1, 4),
  rational(1, 3),
  rational(1, 2),
];
const CP_FRACTIONS: readonly Rational[] = [
  rational(1, 20),
  rational(1, 10),
  rational(1, 8),
  rational(3, 20),
  rational(1, 5),
  rational(1, 4),
  rational(2, 5),
];
const PROFIT_RATIO_PAIRS: readonly (readonly [number, number])[] = [
  [4, 5],
  [5, 6],
  [8, 9],
  [10, 11],
  [5, 7],
  [2, 3],
];
const LOSS_RATIO_PAIRS: readonly (readonly [number, number])[] = [
  [5, 4],
  [6, 5],
  [8, 7],
  [10, 9],
  [5, 3],
  [4, 3],
];
const TWO_PROFIT_RATE_PAIRS: readonly (readonly [Rational, Rational])[] = [
  [rational(10), rational(20)],
  [rational(15), rational(25)],
  [rational(20), rational(40)],
  [rational(25), rational(50)],
  [rational(5), rational(30)],
];
const PROFIT_LOSS_RATE_PAIRS: readonly (readonly [Rational, Rational])[] = [
  [rational(10), rational(5)],
  [rational(15), rational(10)],
  [rational(20), rational(10)],
  [rational(25), rational(15)],
  [rational(30), rational(20)],
];

function absoluteBigInt(value: bigint) {
  return value < 0n ? -value : value;
}

function gcd(a: bigint, b: bigint): bigint {
  let left = absoluteBigInt(a);
  let right = absoluteBigInt(b);
  while (right !== 0n) {
    [left, right] = [right, left % right];
  }
  return left || 1n;
}

function moneyFromExactRational(value: Rational): Money {
  if (value.numerator % value.denominator !== 0n) {
    throw new Error(`Non-integral paise in CP-001 generator: ${value.numerator}/${value.denominator}.`);
  }
  return moneyFromPaise(value.numerator / value.denominator);
}

function moneyFromRoundedRational(value: Rational): Money {
  const quotient = value.numerator / value.denominator;
  const remainder = absoluteBigInt(value.numerator % value.denominator);
  const adjustment =
    remainder * 2n >= absoluteBigInt(value.denominator)
      ? value.numerator < 0n
        ? -1n
        : 1n
      : 0n;
  return moneyFromPaise(quotient + adjustment);
}

function multiplyMoneyByRational(value: Money, factor: Rational): Money {
  return moneyFromExactRational(multiplyRational(rational(value.paise), factor));
}

function commercialFactor(
  direction: "PROFIT" | "LOSS",
  ratePercent: Rational,
) {
  const rate = divideRational(ratePercent, rational(100));
  return direction === "PROFIT"
    ? addRational(rational(1), rate)
    : subtractRational(rational(1), rate);
}

function amountFromCost(costPrice: Money, ratePercent: Rational) {
  return multiplyMoneyByRational(
    costPrice,
    divideRational(ratePercent, rational(100)),
  );
}

function sellingPriceFromCost(
  costPrice: Money,
  direction: "PROFIT" | "LOSS",
  ratePercent: Rational,
) {
  return multiplyMoneyByRational(
    costPrice,
    commercialFactor(direction, ratePercent),
  );
}

function pickCost(random: SeededRandom) {
  return moneyFromRupees(pickSeeded(random, COST_RUPEES));
}

function pickRate(random: SeededRandom) {
  return pickSeeded(random, RATE_VALUES);
}

function differentRate(random: SeededRandom, first: Rational) {
  const eligible = RATE_VALUES.filter((value) => compareRational(value, first) !== 0);
  return pickSeeded(random, eligible);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 6,
    useGrouping: true,
  }).format(value);
}

function formatMoneyNumber(value: Money) {
  const rupees = Number(value.paise) / 100;
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: value.paise % 100n === 0n ? 0 : 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(rupees);
}

function formatMoney(value: Money) {
  return `₹${formatMoneyNumber(value)}`;
}

function formatRational(value: Rational) {
  return formatNumber(rationalToNumber(value));
}

function formatPercent(value: Rational) {
  return `${formatRational(value)}%`;
}

function ratioIntegerParts(costPart: Rational, sellingPart: Rational) {
  const left = costPart.numerator * sellingPart.denominator;
  const right = sellingPart.numerator * costPart.denominator;
  const divisor = gcd(left, right);
  return [left / divisor, right / divisor] as const;
}

function formatAnswer(value: DynamicAnswerValue): string {
  switch (value.kind) {
    case "MONEY":
      return value.direction && value.direction !== "NO_CHANGE"
        ? `${formatMoney(value.value)} ${value.direction.toLowerCase()}`
        : formatMoney(value.value);
    case "PERCENT":
      return value.direction && value.direction !== "NO_CHANGE"
        ? `${formatPercent(value.value)} ${value.direction.toLowerCase()}`
        : formatPercent(value.value);
    case "RATIO": {
      const [cost, selling] = ratioIntegerParts(value.costPart, value.sellingPart);
      return `${cost} : ${selling}`;
    }
    case "FRACTION":
      return `${value.value.numerator}/${value.value.denominator}`;
    case "NO_CHANGE":
      return "No profit, no loss";
  }
}

function normalizeDoublePlaceholders(value: string) {
  return value.replace(/\{\{([A-Za-z][A-Za-z0-9_]*)\}\}/g, "{$1}");
}

function normalizedEditorialEntry(entry: StructuredEditorialEntry): StructuredEditorialEntry {
  return JSON.parse(
    normalizeDoublePlaceholders(JSON.stringify(entry)),
  ) as StructuredEditorialEntry;
}

function contextFromRequest(
  qlId: string,
  request: FundamentalSolveRequest,
): Record<string, string | number> {
  const context: Record<string, string | number> = {};
  const money = (key: string, value: Money) => {
    context[key] = formatMoneyNumber(value);
  };
  const rate = (key: string, value: Rational) => {
    context[key] = formatRational(value);
  };

  switch (request.mode) {
    case "CP_SP_TO_AMOUNT":
      money("costPrice", request.costPrice);
      money("sellingPrice", request.sellingPrice);
      break;
    case "CP_RATE_TO_AMOUNT":
      money("costPrice", request.costPrice);
      rate(request.direction === "PROFIT" ? "profitPercent" : "lossPercent", request.ratePercent);
      break;
    case "CP_AMOUNT_TO_SP":
      money("costPrice", request.costPrice);
      money(request.direction === "PROFIT" ? "profitAmount" : "lossAmount", request.amount);
      break;
    case "SP_AMOUNT_TO_CP":
      money("sellingPrice", request.sellingPrice);
      money(request.direction === "PROFIT" ? "profitAmount" : "lossAmount", request.amount);
      break;
    case "CP_SP_TO_RATE":
      money("costPrice", request.costPrice);
      money("sellingPrice", request.sellingPrice);
      break;
    case "CP_RATE_TO_SP":
      money("costPrice", request.costPrice);
      rate(request.direction === "PROFIT" ? "profitPercent" : "lossPercent", request.ratePercent);
      break;
    case "SP_RATE_TO_CP":
      money("sellingPrice", request.sellingPrice);
      rate(request.direction === "PROFIT" ? "profitPercent" : "lossPercent", request.ratePercent);
      break;
    case "AMOUNT_RATE_TO_CP":
      money(request.direction === "PROFIT" ? "profitAmount" : "lossAmount", request.amount);
      rate(request.direction === "PROFIT" ? "profitPercent" : "lossPercent", request.ratePercent);
      break;
    case "AMOUNT_CP_TO_RATE":
      money(request.direction === "PROFIT" ? "profitAmount" : "lossAmount", request.amount);
      money("costPrice", request.costPrice);
      break;
    case "CP_SP_RATIO_TO_RATE":
      rate("costPart", request.costPart);
      rate("sellingPart", request.sellingPart);
      break;
    case "RATE_TO_CP_SP_RATIO":
      rate(request.direction === "PROFIT" ? "profitPercent" : "lossPercent", request.ratePercent);
      break;
    case "MARGIN_SP_TO_PROFIT_CP":
      rate("marginPercent", request.marginPercent);
      break;
    case "PROFIT_CP_TO_MARGIN_SP":
      rate("profitPercent", request.profitPercent);
      break;
    case "FRACTION_TO_RATE":
      context.fractionNumerator = request.amountFraction.numerator.toString();
      context.fractionDenominator = request.amountFraction.denominator.toString();
      break;
    case "RATE_TO_FRACTION":
      rate(request.direction === "PROFIT" ? "profitPercent" : "lossPercent", request.ratePercent);
      break;
    case "CP_TWO_RATES_TO_SP_DIFFERENCE":
      money("costPrice", request.costPrice);
      if (qlId === "PNL-QL-031") {
        rate("profitPercent", request.firstRatePercent);
        rate("lossPercent", request.secondRatePercent);
      } else {
        rate("firstRatePercent", request.firstRatePercent);
        rate("secondRatePercent", request.secondRatePercent);
      }
      break;
    case "SP_DIFFERENCE_TWO_RATES_TO_CP":
      money("sellingPriceDifference", request.difference);
      rate("firstRatePercent", request.firstRatePercent);
      rate("secondRatePercent", request.secondRatePercent);
      break;
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE":
      money("firstSellingPrice", request.firstSellingPrice);
      rate("firstRatePercent", request.firstRatePercent);
      money("secondSellingPrice", request.secondSellingPrice);
      break;
  }

  return context;
}

function generateCase(qlId: string, seed: string): GeneratedFundamentalCase {
  const registry = taskRegistry.entries[qlId];
  if (!registry) throw new Error(`Unknown CP-001 QL: ${qlId}`);
  const random = createSeededRandom(`${qlId}:${seed}:parameters`);
  const costPrice = pickCost(random);
  const ratePercent = pickRate(random);
  let request: FundamentalSolveRequest;

  switch (qlId) {
    case "PNL-QL-001":
    case "PNL-QL-002":
    case "PNL-QL-003":
    case "PNL-QL-004": {
      const direction = qlId === "PNL-QL-001" || qlId === "PNL-QL-003" ? "PROFIT" : "LOSS";
      request = {
        mode: registry.solveMode as "CP_SP_TO_AMOUNT" | "CP_SP_TO_RATE",
        costPrice,
        sellingPrice: sellingPriceFromCost(costPrice, direction, ratePercent),
      } as FundamentalSolveRequest;
      break;
    }
    case "PNL-QL-005":
    case "PNL-QL-006": {
      request = {
        mode: "CP_RATE_TO_SP",
        costPrice,
        direction: qlId === "PNL-QL-005" ? "PROFIT" : "LOSS",
        ratePercent,
      };
      break;
    }
    case "PNL-QL-007":
    case "PNL-QL-008": {
      const direction = qlId === "PNL-QL-007" ? "PROFIT" : "LOSS";
      request = {
        mode: "SP_RATE_TO_CP",
        sellingPrice: sellingPriceFromCost(costPrice, direction, ratePercent),
        direction,
        ratePercent,
      };
      break;
    }
    case "PNL-QL-009":
    case "PNL-QL-010": {
      request = {
        mode: "AMOUNT_RATE_TO_CP",
        amount: amountFromCost(costPrice, ratePercent),
        direction: qlId === "PNL-QL-009" ? "PROFIT" : "LOSS",
        ratePercent,
      };
      break;
    }
    case "PNL-QL-011":
    case "PNL-QL-012": {
      request = {
        mode: "AMOUNT_CP_TO_RATE",
        amount: amountFromCost(costPrice, ratePercent),
        costPrice,
        direction: qlId === "PNL-QL-011" ? "PROFIT" : "LOSS",
      };
      break;
    }
    case "PNL-QL-013": {
      const direction = pickSeeded(random, ["PROFIT", "LOSS"] as const);
      const [costPart, sellingPart] = pickSeeded(
        random,
        direction === "PROFIT" ? PROFIT_RATIO_PAIRS : LOSS_RATIO_PAIRS,
      );
      request = {
        mode: "CP_SP_RATIO_TO_RATE",
        costPart: rational(costPart),
        sellingPart: rational(sellingPart),
      };
      break;
    }
    case "PNL-QL-014":
    case "PNL-QL-015":
      request = {
        mode: "RATE_TO_CP_SP_RATIO",
        direction: qlId === "PNL-QL-014" ? "PROFIT" : "LOSS",
        ratePercent,
      };
      break;
    case "PNL-QL-016":
      request = {
        mode: "MARGIN_SP_TO_PROFIT_CP",
        marginPercent: pickSeeded(random, MARGIN_VALUES),
      };
      break;
    case "PNL-QL-017":
      request = {
        mode: "PROFIT_CP_TO_MARGIN_SP",
        profitPercent: pickSeeded(random, PROFIT_FOR_MARGIN_VALUES),
      };
      break;
    case "PNL-QL-018":
    case "PNL-QL-019":
      request = {
        mode: "CP_RATE_TO_AMOUNT",
        costPrice,
        direction: qlId === "PNL-QL-018" ? "PROFIT" : "LOSS",
        ratePercent,
      };
      break;
    case "PNL-QL-020":
    case "PNL-QL-021":
      request = {
        mode: "CP_AMOUNT_TO_SP",
        costPrice,
        amount: amountFromCost(costPrice, ratePercent),
        direction: qlId === "PNL-QL-020" ? "PROFIT" : "LOSS",
      };
      break;
    case "PNL-QL-022":
    case "PNL-QL-023": {
      const direction = qlId === "PNL-QL-022" ? "PROFIT" : "LOSS";
      const amount = amountFromCost(costPrice, ratePercent);
      request = {
        mode: "SP_AMOUNT_TO_CP",
        sellingPrice: moneyFromPaise(
          direction === "PROFIT"
            ? costPrice.paise + amount.paise
            : costPrice.paise - amount.paise,
        ),
        amount,
        direction,
      };
      break;
    }
    case "PNL-QL-024":
    case "PNL-QL-025":
      request = {
        mode: "FRACTION_TO_RATE",
        direction: qlId === "PNL-QL-024" ? "PROFIT" : "LOSS",
        amountFraction: pickSeeded(random, CP_FRACTIONS),
        fractionBase: "COST_PRICE",
      };
      break;
    case "PNL-QL-026":
    case "PNL-QL-027":
      request = {
        mode: "FRACTION_TO_RATE",
        direction: qlId === "PNL-QL-026" ? "PROFIT" : "LOSS",
        amountFraction: pickSeeded(
          random,
          qlId === "PNL-QL-026" ? PROFIT_SP_FRACTIONS : LOSS_SP_FRACTIONS,
        ),
        fractionBase: "SELLING_PRICE",
      };
      break;
    case "PNL-QL-028":
    case "PNL-QL-029":
      request = {
        mode: "RATE_TO_FRACTION",
        direction: qlId === "PNL-QL-028" ? "PROFIT" : "LOSS",
        ratePercent:
          qlId === "PNL-QL-028"
            ? pickSeeded(random, PROFIT_FOR_MARGIN_VALUES)
            : pickSeeded(random, RATE_VALUES.filter((value) => rationalToNumber(value) < 60)),
        fractionBase: "SELLING_PRICE",
      };
      break;
    case "PNL-QL-030": {
      const [firstRatePercent, secondRatePercent] = pickSeeded(random, TWO_PROFIT_RATE_PAIRS);
      request = {
        mode: "CP_TWO_RATES_TO_SP_DIFFERENCE",
        costPrice,
        firstDirection: "PROFIT",
        firstRatePercent,
        secondDirection: "PROFIT",
        secondRatePercent,
      };
      break;
    }
    case "PNL-QL-031": {
      const [profitPercent, lossPercent] = pickSeeded(random, PROFIT_LOSS_RATE_PAIRS);
      request = {
        mode: "CP_TWO_RATES_TO_SP_DIFFERENCE",
        costPrice,
        firstDirection: "PROFIT",
        firstRatePercent: profitPercent,
        secondDirection: "LOSS",
        secondRatePercent: lossPercent,
      };
      break;
    }
    case "PNL-QL-032": {
      const [firstRatePercent, secondRatePercent] = pickSeeded(random, TWO_PROFIT_RATE_PAIRS);
      const difference = multiplyMoneyByRational(
        costPrice,
        divideRational(
          rational(
            absoluteBigInt(
              firstRatePercent.numerator * secondRatePercent.denominator -
                secondRatePercent.numerator * firstRatePercent.denominator,
            ),
            firstRatePercent.denominator * secondRatePercent.denominator,
          ),
          rational(100),
        ),
      );
      request = {
        mode: "SP_DIFFERENCE_TWO_RATES_TO_CP",
        difference,
        firstDirection: "PROFIT",
        firstRatePercent,
        secondDirection: "PROFIT",
        secondRatePercent,
      };
      break;
    }
    case "PNL-QL-033":
    case "PNL-QL-034": {
      const firstDirection = qlId === "PNL-QL-033" ? "PROFIT" : "LOSS";
      const secondDirection = pickSeeded(random, ["PROFIT", "LOSS", "NO_CHANGE"] as const);
      const secondRate = secondDirection === "NO_CHANGE" ? rational(0) : differentRate(random, ratePercent);
      request = {
        mode: "TWO_SELLING_CONDITIONS_TO_SECOND_RATE",
        firstSellingPrice: sellingPriceFromCost(costPrice, firstDirection, ratePercent),
        firstDirection,
        firstRatePercent: ratePercent,
        secondSellingPrice:
          secondDirection === "NO_CHANGE"
            ? costPrice
            : sellingPriceFromCost(costPrice, secondDirection, secondRate),
      };
      break;
    }
    case "PNL-QL-035":
      request = {
        mode: "CP_SP_TO_RATE",
        costPrice,
        sellingPrice: costPrice,
      };
      break;
    case "PNL-QL-036": {
      const [profitPercent, lossPercent] = pickSeeded(random, PROFIT_LOSS_RATE_PAIRS);
      const difference = multiplyMoneyByRational(
        costPrice,
        divideRational(addRational(profitPercent, lossPercent), rational(100)),
      );
      request = {
        mode: "SP_DIFFERENCE_TWO_RATES_TO_CP",
        difference,
        firstDirection: "PROFIT",
        firstRatePercent: profitPercent,
        secondDirection: "LOSS",
        secondRatePercent: lossPercent,
      };
      break;
    }
    default:
      throw new Error(`No CP-001 dynamic parameter contract for ${qlId}.`);
  }

  const context = contextFromRequest(qlId, request);
  for (const required of registry.requiredVariables) {
    if (!(required in context)) {
      throw new Error(`${qlId}: dynamic context is missing required variable ${required}.`);
    }
  }
  return { qlId, registry, request, context, seed };
}

function answerValueFor(
  qlId: string,
  result: FundamentalSolveResult,
): DynamicAnswerValue {
  switch (qlId) {
    case "PNL-QL-001":
    case "PNL-QL-002":
      if (result.mode !== "CP_SP_TO_AMOUNT") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.amount, direction: result.direction };
    case "PNL-QL-003":
    case "PNL-QL-004":
    case "PNL-QL-013":
      if (result.mode !== "CP_SP_TO_RATE" && result.mode !== "CP_SP_RATIO_TO_RATE") {
        throw new Error(`${qlId}: unexpected result mode.`);
      }
      return { kind: "PERCENT", value: result.ratePercent, direction: result.direction };
    case "PNL-QL-005":
    case "PNL-QL-006":
      if (result.mode !== "CP_RATE_TO_SP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.sellingPrice };
    case "PNL-QL-007":
    case "PNL-QL-008":
      if (result.mode !== "SP_RATE_TO_CP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.costPrice };
    case "PNL-QL-009":
    case "PNL-QL-010":
      if (result.mode !== "AMOUNT_RATE_TO_CP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.costPrice };
    case "PNL-QL-011":
    case "PNL-QL-012":
      if (result.mode !== "AMOUNT_CP_TO_RATE") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "PERCENT", value: result.ratePercent };
    case "PNL-QL-014":
    case "PNL-QL-015":
      if (result.mode !== "RATE_TO_CP_SP_RATIO") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "RATIO", costPart: result.costPart, sellingPart: result.sellingPart };
    case "PNL-QL-016":
      if (result.mode !== "MARGIN_SP_TO_PROFIT_CP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "PERCENT", value: result.profitPercent };
    case "PNL-QL-017":
      if (result.mode !== "PROFIT_CP_TO_MARGIN_SP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "PERCENT", value: result.marginPercent };
    case "PNL-QL-018":
    case "PNL-QL-019":
      if (result.mode !== "CP_RATE_TO_AMOUNT") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.amount };
    case "PNL-QL-020":
    case "PNL-QL-021":
      if (result.mode !== "CP_AMOUNT_TO_SP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.sellingPrice };
    case "PNL-QL-022":
    case "PNL-QL-023":
      if (result.mode !== "SP_AMOUNT_TO_CP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.costPrice };
    case "PNL-QL-024":
    case "PNL-QL-025":
    case "PNL-QL-026":
    case "PNL-QL-027":
      if (result.mode !== "FRACTION_TO_RATE") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "PERCENT", value: result.ratePercent };
    case "PNL-QL-028":
    case "PNL-QL-029":
      if (result.mode !== "RATE_TO_FRACTION") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "FRACTION", value: result.amountFraction };
    case "PNL-QL-030":
    case "PNL-QL-031":
      if (result.mode !== "CP_TWO_RATES_TO_SP_DIFFERENCE") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.difference };
    case "PNL-QL-032":
    case "PNL-QL-036":
      if (result.mode !== "SP_DIFFERENCE_TWO_RATES_TO_CP") throw new Error(`${qlId}: unexpected result mode.`);
      return { kind: "MONEY", value: result.costPrice };
    case "PNL-QL-033":
    case "PNL-QL-034":
      if (result.mode !== "TWO_SELLING_CONDITIONS_TO_SECOND_RATE") throw new Error(`${qlId}: unexpected result mode.`);
      return result.direction === "NO_CHANGE"
        ? { kind: "NO_CHANGE" }
        : { kind: "PERCENT", value: result.ratePercent, direction: result.direction };
    case "PNL-QL-035":
      return { kind: "NO_CHANGE" };
    default:
      throw new Error(`No CP-001 answer formatter for ${qlId}.`);
  }
}

function moneyCandidate(value: Money, misconception: string, direction?: Direction): OptionCandidate {
  return { value: { kind: "MONEY", value, direction }, misconception };
}

function percentCandidate(value: Rational, misconception: string, direction?: Direction): OptionCandidate {
  return { value: { kind: "PERCENT", value, direction }, misconception };
}

function fractionCandidate(value: Rational, misconception: string): OptionCandidate {
  return { value: { kind: "FRACTION", value }, misconception };
}

function ratioCandidate(costPart: Rational, sellingPart: Rational, misconception: string): OptionCandidate {
  return { value: { kind: "RATIO", costPart, sellingPart }, misconception };
}

function fallbackWrongCandidates(correct: DynamicAnswerValue): readonly OptionCandidate[] {
  switch (correct.kind) {
    case "MONEY": {
      const base = correct.value.paise;
      return [
        moneyCandidate(moneyFromPaise(base + 10000n), "Adds a fixed rupee amount instead of applying the exact relation.", correct.direction),
        moneyCandidate(moneyFromPaise(base > 10000n ? base - 10000n : base + 20000n), "Subtracts a fixed rupee amount instead of applying the exact relation.", correct.direction),
        moneyCandidate(moneyFromPaise(base * 2n), "Doubles the result by applying the operation twice.", correct.direction),
      ];
    }
    case "PERCENT":
      return [
        percentCandidate(addRational(correct.value, rational(5)), "Adds five percentage points instead of using the required base.", correct.direction),
        percentCandidate(multiplyRational(correct.value, rational(2)), "Applies the percentage conversion twice.", correct.direction),
        percentCandidate(divideRational(correct.value, rational(100)), "Reports the decimal rate as a percentage.", correct.direction),
      ];
    case "RATIO":
      return [
        ratioCandidate(correct.sellingPart, correct.costPart, "Reverses cost price and selling price."),
        ratioCandidate(correct.costPart, addRational(correct.sellingPart, rational(1)), "Adds one part without converting the percentage correctly."),
        ratioCandidate(rational(100), correct.sellingPart, "Uses 100 and the rate output without simplifying the commercial ratio."),
      ];
    case "FRACTION":
      return [
        fractionCandidate(rational(correct.value.denominator, correct.value.numerator), "Takes the reciprocal of the required fraction."),
        fractionCandidate(rational(correct.value.numerator, 100), "Places the numerator over 100 without converting the base."),
        fractionCandidate(addRational(correct.value, rational(1, 10)), "Adds an arbitrary tenth instead of using the commercial relation."),
      ];
    case "NO_CHANGE":
      return [
        percentCandidate(rational(5), "Treats equal prices as a small profit.", "PROFIT"),
        percentCandidate(rational(5), "Treats equal prices as a small loss.", "LOSS"),
        percentCandidate(rational(100), "Reports the selling price as 100% profit.", "PROFIT"),
      ];
  }
}

function wrongCandidates(
  generated: GeneratedFundamentalCase,
  result: FundamentalSolveResult,
  correct: DynamicAnswerValue,
): readonly OptionCandidate[] {
  const request = generated.request;
  const candidates: OptionCandidate[] = [];

  switch (request.mode) {
    case "CP_SP_TO_AMOUNT": {
      const opposite = result.mode === request.mode && result.direction === "PROFIT" ? "LOSS" : "PROFIT";
      candidates.push(
        moneyCandidate(
          result.mode === request.mode ? result.amount : moneyFromRupees(1),
          "Finds the correct difference but assigns the opposite profit/loss direction.",
          opposite,
        ),
        moneyCandidate(
          moneyFromPaise(request.costPrice.paise + request.sellingPrice.paise),
          "Adds cost price and selling price instead of taking their difference.",
          result.mode === request.mode ? result.direction : undefined,
        ),
        moneyCandidate(
          request.costPrice,
          "Reports the cost price instead of the profit or loss amount.",
          result.mode === request.mode ? result.direction : undefined,
        ),
      );
      break;
    }
    case "CP_SP_TO_RATE": {
      if (result.mode !== request.mode) break;
      if (result.direction === "NO_CHANGE") return fallbackWrongCandidates({ kind: "NO_CHANGE" });
      const amount = moneyFromPaise(absoluteBigInt(request.sellingPrice.paise - request.costPrice.paise));
      const wrongBase = multiplyRational(
        divideRational(rational(amount.paise), rational(request.sellingPrice.paise)),
        rational(100),
      );
      candidates.push(
        percentCandidate(wrongBase, "Uses selling price as the percentage base.", result.direction),
        percentCandidate(divideRational(result.ratePercent, rational(100)), "Reports the decimal rate as though it were already a percentage.", result.direction),
        percentCandidate(result.ratePercent, "Finds the correct rate but reverses profit and loss.", result.direction === "PROFIT" ? "LOSS" : "PROFIT"),
      );
      break;
    }
    case "CP_RATE_TO_SP": {
      if (result.mode !== request.mode) break;
      const amount = amountFromCost(request.costPrice, request.ratePercent);
      const wrongDirection = moneyFromPaise(
        request.direction === "PROFIT"
          ? request.costPrice.paise - amount.paise
          : request.costPrice.paise + amount.paise,
      );
      candidates.push(
        moneyCandidate(amount, "Returns only the profit or loss amount instead of the selling price."),
        moneyCandidate(wrongDirection, "Applies the percentage in the opposite direction."),
        moneyCandidate(request.costPrice, "Leaves the cost price unchanged."),
      );
      break;
    }
    case "SP_RATE_TO_CP": {
      if (result.mode !== request.mode) break;
      candidates.push(
        moneyCandidate(
          multiplyMoneyByRational(request.sellingPrice, commercialFactor(request.direction, request.ratePercent)),
          "Multiplies the selling price by the forward factor instead of reversing it.",
        ),
        moneyCandidate(
          moneyFromRoundedRational(
            divideRational(
              rational(request.sellingPrice.paise),
              commercialFactor(request.direction === "PROFIT" ? "LOSS" : "PROFIT", request.ratePercent),
            ),
          ),
          "Uses the opposite profit/loss factor while working backward.",
        ),
        moneyCandidate(request.sellingPrice, "Treats selling price as though it were already the cost price."),
      );
      break;
    }
    case "AMOUNT_RATE_TO_CP": {
      if (result.mode !== request.mode) break;
      candidates.push(
        moneyCandidate(
          multiplyMoneyByRational(request.amount, divideRational(request.ratePercent, rational(100))),
          "Multiplies the amount by the percentage instead of scaling it to 100%."),
        moneyCandidate(
          moneyFromRoundedRational(
            divideRational(
              multiplyRational(rational(request.amount.paise), rational(100)),
              addRational(rational(100), request.ratePercent),
            ),
          ),
          "Uses 100 plus the rate as the denominator."),
        moneyCandidate(request.amount, "Reports the profit or loss amount as the cost price."),
      );
      break;
    }
    case "AMOUNT_CP_TO_RATE": {
      if (result.mode !== request.mode) break;
      const sellingPrice = moneyFromPaise(
        request.direction === "PROFIT"
          ? request.costPrice.paise + request.amount.paise
          : request.costPrice.paise - request.amount.paise,
      );
      candidates.push(
        percentCandidate(
          multiplyRational(
            divideRational(rational(request.amount.paise), rational(sellingPrice.paise)),
            rational(100),
          ),
          "Uses selling price instead of cost price as the percentage base."),
        percentCandidate(divideRational(result.ratePercent, rational(100)), "Reports the decimal rate as a percentage."),
        percentCandidate(subtractRational(rational(100), result.ratePercent), "Subtracts the rate from 100 instead of measuring the amount on cost."),
      );
      break;
    }
    case "CP_SP_RATIO_TO_RATE": {
      if (result.mode !== request.mode) break;
      const difference = rational(
        absoluteBigInt(
          request.sellingPart.numerator * request.costPart.denominator -
            request.costPart.numerator * request.sellingPart.denominator,
        ),
        request.sellingPart.denominator * request.costPart.denominator,
      );
      candidates.push(
        percentCandidate(
          multiplyRational(divideRational(difference, request.sellingPart), rational(100)),
          "Uses the selling-price part as the percentage base.",
          result.direction),
        percentCandidate(
          multiplyRational(divideRational(request.sellingPart, request.costPart), rational(100)),
          "Reports selling price as a percentage of cost instead of the profit/loss rate.",
          result.direction),
        percentCandidate(result.ratePercent, "Reverses the profit/loss direction while keeping the rate.", result.direction === "PROFIT" ? "LOSS" : "PROFIT"),
      );
      break;
    }
    case "RATE_TO_CP_SP_RATIO": {
      if (result.mode !== request.mode) break;
      candidates.push(
        ratioCandidate(result.sellingPart, result.costPart, "Reverses cost price and selling price."),
        ratioCandidate(
          rational(1),
          commercialFactor(request.direction === "PROFIT" ? "LOSS" : "PROFIT", request.ratePercent),
          "Uses the opposite profit/loss factor."),
        ratioCandidate(rational(100), request.ratePercent, "Uses cost 100 and the rate itself as the selling-price part."),
      );
      break;
    }
    case "MARGIN_SP_TO_PROFIT_CP": {
      if (result.mode !== request.mode) break;
      candidates.push(
        percentCandidate(request.marginPercent, "Treats selling-price margin as the same percentage on cost price."),
        percentCandidate(
          multiplyRational(
            divideRational(request.marginPercent, addRational(rational(100), request.marginPercent)),
            rational(100),
          ),
          "Adds the margin to 100 instead of removing it from the selling-price base."),
        percentCandidate(subtractRational(rational(100), request.marginPercent), "Reports the remaining selling-price share as the profit rate."),
      );
      break;
    }
    case "PROFIT_CP_TO_MARGIN_SP": {
      if (result.mode !== request.mode) break;
      candidates.push(
        percentCandidate(request.profitPercent, "Treats cost-price profit rate as the same margin on selling price."),
        percentCandidate(
          multiplyRational(
            divideRational(request.profitPercent, subtractRational(rational(100), request.profitPercent)),
            rational(100),
          ),
          "Subtracts the profit rate from 100 while changing the percentage base."),
        percentCandidate(subtractRational(rational(100), request.profitPercent), "Reports the complement of the profit rate."),
      );
      break;
    }
    case "FRACTION_TO_RATE": {
      if (result.mode !== request.mode) break;
      const directPercent = multiplyRational(request.amountFraction, rational(100));
      const reciprocalPercent = multiplyRational(
        rational(request.amountFraction.denominator, request.amountFraction.numerator),
        rational(100),
      );
      candidates.push(
        percentCandidate(directPercent, request.fractionBase === "SELLING_PRICE" ? "Uses the selling-price fraction directly as a cost-price percentage." : "Uses the stated fraction without checking the required direction/base."),
        percentCandidate(reciprocalPercent, "Takes the reciprocal of the stated fraction."),
        percentCandidate(divideRational(result.ratePercent, rational(100)), "Reports the decimal rate as a percentage."),
      );
      break;
    }
    case "RATE_TO_FRACTION": {
      if (result.mode !== request.mode) break;
      const costBaseFraction = divideRational(request.ratePercent, rational(100));
      candidates.push(
        fractionCandidate(costBaseFraction, "Uses the fraction of cost price instead of selling price."),
        fractionCandidate(rational(result.amountFraction.denominator, result.amountFraction.numerator), "Takes the reciprocal of the required fraction."),
        fractionCandidate(
          request.direction === "PROFIT"
            ? divideRational(costBaseFraction, subtractRational(rational(1), costBaseFraction))
            : divideRational(costBaseFraction, addRational(rational(1), costBaseFraction)),
          "Uses the opposite selling-price base conversion."),
      );
      break;
    }
    case "CP_TWO_RATES_TO_SP_DIFFERENCE": {
      if (result.mode !== request.mode) break;
      const firstAmount = amountFromCost(request.costPrice, request.firstRatePercent);
      const secondAmount = amountFromCost(request.costPrice, request.secondRatePercent);
      const wrongGap = request.firstDirection === request.secondDirection
        ? addRational(request.firstRatePercent, request.secondRatePercent)
        : rational(
            absoluteBigInt(
              request.firstRatePercent.numerator * request.secondRatePercent.denominator -
                request.secondRatePercent.numerator * request.firstRatePercent.denominator,
            ),
            request.firstRatePercent.denominator * request.secondRatePercent.denominator,
          );
      candidates.push(
        moneyCandidate(firstAmount, "Uses only the first rate change."),
        moneyCandidate(secondAmount, "Uses only the second rate change."),
        moneyCandidate(
          multiplyMoneyByRational(request.costPrice, divideRational(wrongGap, rational(100))),
          request.firstDirection === request.secondDirection
            ? "Adds the two same-direction rates instead of taking their difference."
            : "Subtracts profit and loss rates instead of measuring the full signed gap.",
        ),
      );
      break;
    }
    case "SP_DIFFERENCE_TWO_RATES_TO_CP": {
      if (result.mode !== request.mode) break;
      const fromFirst = moneyFromRoundedRational(
        divideRational(
          multiplyRational(rational(request.difference.paise), rational(100)),
          request.firstRatePercent,
        ),
      );
      const fromSecond = moneyFromRoundedRational(
        divideRational(
          multiplyRational(rational(request.difference.paise), rational(100)),
          request.secondRatePercent,
        ),
      );
      const gap = request.firstDirection === request.secondDirection
        ? rational(
            absoluteBigInt(
              request.firstRatePercent.numerator * request.secondRatePercent.denominator -
                request.secondRatePercent.numerator * request.firstRatePercent.denominator,
            ),
            request.firstRatePercent.denominator * request.secondRatePercent.denominator,
          )
        : addRational(request.firstRatePercent, request.secondRatePercent);
      candidates.push(
        moneyCandidate(fromFirst, "Divides by the first rate instead of the effective rate gap."),
        moneyCandidate(fromSecond, "Divides by the second rate instead of the effective rate gap."),
        moneyCandidate(
          multiplyMoneyByRational(request.difference, divideRational(gap, rational(100))),
          "Multiplies by the rate gap instead of scaling the difference up to 100%.",
        ),
      );
      break;
    }
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE": {
      if (result.mode !== request.mode) break;
      const priceDifference = moneyFromPaise(
        absoluteBigInt(request.secondSellingPrice.paise - request.firstSellingPrice.paise),
      );
      const firstBaseRate = multiplyRational(
        divideRational(rational(priceDifference.paise), rational(request.firstSellingPrice.paise)),
        rational(100),
      );
      const secondBaseRate = multiplyRational(
        divideRational(rational(priceDifference.paise), rational(request.secondSellingPrice.paise)),
        rational(100),
      );
      const guessedDirection = request.secondSellingPrice.paise >= request.firstSellingPrice.paise ? "PROFIT" : "LOSS";
      candidates.push(
        percentCandidate(request.firstRatePercent, "Repeats the first sale's rate for the second sale.", request.firstDirection),
        percentCandidate(firstBaseRate, "Compares the two selling prices using the first selling price as the base.", guessedDirection),
        percentCandidate(secondBaseRate, "Compares the two selling prices using the second selling price as the base.", guessedDirection),
      );
      break;
    }
  }

  return [...candidates, ...fallbackWrongCandidates(correct)];
}

function shuffledOptions(
  qlId: string,
  seed: string,
  correct: DynamicAnswerValue,
  wrong: readonly OptionCandidate[],
) {
  const correctText = formatAnswer(correct);
  const seen = new Set<string>([correctText]);
  const selected: OptionCandidate[] = [];
  for (const candidate of wrong) {
    const text = formatAnswer(candidate.value);
    if (seen.has(text)) continue;
    seen.add(text);
    selected.push(candidate);
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) {
    throw new Error(`${qlId}: could not build three unique misconception options.`);
  }

  const random = createSeededRandom(`${qlId}:${seed}:option-order`);
  const all = [
    { text: correctText, misconception: "CORRECT" },
    ...selected.map((candidate) => ({
      text: formatAnswer(candidate.value),
      misconception: candidate.misconception,
    })),
  ];
  for (let index = all.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random.next() * (index + 1));
    [all[index], all[swapIndex]] = [all[swapIndex]!, all[index]!];
  }
  return {
    options: all.map((entry) => entry.text) as [string, string, string, string],
    misconceptionLabels: all.map((entry) => entry.misconception) as [string, string, string, string],
    correctIndex: all.findIndex((entry) => entry.misconception === "CORRECT"),
  };
}

function valueSpecificWorking(
  generated: GeneratedFundamentalCase,
  result: FundamentalSolveResult,
  answer: string,
) {
  const request = generated.request;
  let line: string;
  switch (request.mode) {
    case "CP_SP_TO_AMOUNT":
      line = `${formatMoney(request.sellingPrice)} and ${formatMoney(request.costPrice)} differ by ${formatMoney(result.mode === request.mode ? result.amount : moneyFromRupees(0))}.`;
      break;
    case "CP_RATE_TO_AMOUNT":
      line = `${formatRational(request.ratePercent)}% of ${formatMoney(request.costPrice)} is ${formatMoney(result.mode === request.mode ? result.amount : moneyFromRupees(0))}.`;
      break;
    case "CP_AMOUNT_TO_SP":
      line = `${formatMoney(request.costPrice)} ${request.direction === "PROFIT" ? "+" : "−"} ${formatMoney(request.amount)} = ${formatMoney(result.mode === request.mode ? result.sellingPrice : moneyFromRupees(0))}.`;
      break;
    case "SP_AMOUNT_TO_CP":
      line = `Reversing the stated ${request.direction.toLowerCase()} from ${formatMoney(request.sellingPrice)} gives ${formatMoney(result.mode === request.mode ? result.costPrice : moneyFromRupees(0))}.`;
      break;
    case "CP_SP_TO_RATE":
      line = `The price difference is measured on the original cost of ${formatMoney(request.costPrice)}.`;
      break;
    case "CP_RATE_TO_SP":
      line = `${formatMoney(request.costPrice)} is multiplied by the ${request.direction.toLowerCase()} factor for ${formatPercent(request.ratePercent)}.`;
      break;
    case "SP_RATE_TO_CP":
      line = `${formatMoney(request.sellingPrice)} is divided by the ${request.direction.toLowerCase()} factor for ${formatPercent(request.ratePercent)}.`;
      break;
    case "AMOUNT_RATE_TO_CP":
      line = `${formatMoney(request.amount)} represents ${formatPercent(request.ratePercent)} of the hidden cost.`;
      break;
    case "AMOUNT_CP_TO_RATE":
      line = `${formatMoney(request.amount)} is divided by ${formatMoney(request.costPrice)} and multiplied by 100.`;
      break;
    case "CP_SP_RATIO_TO_RATE":
      line = `The difference between ratio parts is measured against the cost-price part.`;
      break;
    case "RATE_TO_CP_SP_RATIO":
      line = `Taking cost as 100 gives selling price ${request.direction === "PROFIT" ? "above" : "below"} 100 by ${formatRational(request.ratePercent)} parts.`;
      break;
    case "MARGIN_SP_TO_PROFIT_CP":
      line = `With selling price as 100, cost price is ${formatRational(subtractRational(rational(100), request.marginPercent))}.`;
      break;
    case "PROFIT_CP_TO_MARGIN_SP":
      line = `With cost price as 100, selling price is ${formatRational(addRational(rational(100), request.profitPercent))}.`;
      break;
    case "FRACTION_TO_RATE":
      line = `The fraction ${request.amountFraction.numerator}/${request.amountFraction.denominator} is converted from the stated ${request.fractionBase === "COST_PRICE" ? "cost-price" : "selling-price"} base.`;
      break;
    case "RATE_TO_FRACTION":
      line = `${formatPercent(request.ratePercent)} is converted to the required fraction of selling price.`;
      break;
    case "CP_TWO_RATES_TO_SP_DIFFERENCE":
      line = `The two signed rates act on the same cost of ${formatMoney(request.costPrice)}.`;
      break;
    case "SP_DIFFERENCE_TWO_RATES_TO_CP":
      line = `${formatMoney(request.difference)} represents the effective gap between the two signed rates.`;
      break;
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE":
      line = `The first condition is reversed to recover cost, and ${formatMoney(request.secondSellingPrice)} is then compared with that cost.`;
      break;
  }
  return `**Working with these values:** ${line}\n\n**Final answer:** ${answer}`;
}

function validateRequest(request: FundamentalSolveRequest) {
  switch (request.mode) {
    case "CP_SP_TO_AMOUNT":
    case "CP_SP_TO_RATE":
      return validateFundamentalInput({
        costPrice: request.costPrice,
        sellingPrice: request.sellingPrice,
      });
    case "CP_RATE_TO_AMOUNT":
    case "CP_RATE_TO_SP":
      return validateFundamentalInput({
        costPrice: request.costPrice,
        ratePercent: request.ratePercent,
        direction: request.direction,
      });
    case "CP_AMOUNT_TO_SP":
      return validateFundamentalInput({
        costPrice: request.costPrice,
        amount: request.amount,
        direction: request.direction,
      });
    case "SP_AMOUNT_TO_CP":
      return validateFundamentalInput({
        sellingPrice: request.sellingPrice,
        amount: request.amount,
        direction: request.direction,
      });
    case "SP_RATE_TO_CP":
      return validateFundamentalInput({
        sellingPrice: request.sellingPrice,
        ratePercent: request.ratePercent,
        direction: request.direction,
      });
    case "AMOUNT_RATE_TO_CP":
      return validateFundamentalInput({
        amount: request.amount,
        ratePercent: request.ratePercent,
        direction: request.direction,
      });
    case "AMOUNT_CP_TO_RATE":
      return validateFundamentalInput({
        amount: request.amount,
        costPrice: request.costPrice,
        direction: request.direction,
      });
    case "CP_SP_RATIO_TO_RATE":
      return validateFundamentalInput({
        costPart: request.costPart,
        sellingPart: request.sellingPart,
      });
    case "RATE_TO_CP_SP_RATIO":
      return validateFundamentalInput({
        ratePercent: request.ratePercent,
        direction: request.direction,
      });
    case "MARGIN_SP_TO_PROFIT_CP":
      return validateFundamentalInput({ marginPercent: request.marginPercent });
    case "PROFIT_CP_TO_MARGIN_SP":
      return validateFundamentalInput({ profitPercent: request.profitPercent });
    case "FRACTION_TO_RATE":
      return { ok: request.amountFraction.numerator > 0n && request.amountFraction.denominator > 0n, errors: [] as string[] };
    case "RATE_TO_FRACTION":
      return validateFundamentalInput({
        ratePercent: request.ratePercent,
        direction: request.direction,
      });
    case "CP_TWO_RATES_TO_SP_DIFFERENCE":
      return validateFundamentalInput({ costPrice: request.costPrice });
    case "SP_DIFFERENCE_TWO_RATES_TO_CP":
      return validateFundamentalInput({ amount: request.difference });
    case "TWO_SELLING_CONDITIONS_TO_SECOND_RATE":
      return validateFundamentalInput({
        sellingPrice: request.firstSellingPrice,
        ratePercent: request.firstRatePercent,
        direction: request.firstDirection,
      });
  }
}

function selectQl(input: PnlCp001DynamicInput) {
  if (input.questionLanguageId) {
    const registry = taskRegistry.entries[input.questionLanguageId];
    if (!registry) throw new Error(`Unknown CP-001 question-language ID: ${input.questionLanguageId}`);
    return input.questionLanguageId;
  }
  const eligible = qlIds.filter(
    (qlId) => !input.difficultyBand || taskRegistry.entries[qlId]!.difficulty === input.difficultyBand,
  );
  if (!eligible.length) throw new Error("No CP-001 QLs match the requested difficulty.");
  return pickSeeded(
    createSeededRandom(`${input.seed ?? "cp001-dynamic"}:ql-selection`),
    eligible,
  );
}

export function listPnlCp001DynamicQlIds() {
  return [...qlIds];
}

export function runPnlCp001DynamicPipeline(
  input: PnlCp001DynamicInput = {},
) {
  if (input.language && input.language !== "en") {
    throw new Error("PNL-CP-001 dynamic runtime currently supports English only.");
  }
  const qlId = selectQl(input);
  const seed = input.seed ?? `${qlId}:dynamic-default`;
  const generated = generateCase(qlId, seed);
  const solverResult = solveFundamental(generated.request);
  const independent = verifyFundamentalResultIndependently(
    generated.request,
    solverResult,
  );
  const correctValue = answerValueFor(qlId, solverResult);
  const correctAnswer = formatAnswer(correctValue);
  const optionSet = shuffledOptions(
    qlId,
    seed,
    correctValue,
    wrongCandidates(generated, solverResult, correctValue),
  );
  const editorial = normalizedEditorialEntry(editorialLibrary.entries[qlId]!);
  const stem = renderStructuredStemMarkdown(editorial.stem, generated.context);
  const baseExplanation = renderFriendlyExplanationMarkdown(
    editorial.explanation,
    generated.context,
  );
  const explanationText = `${baseExplanation}\n\n${valueSpecificWorking(
    generated,
    solverResult,
    correctAnswer,
  )}`;
  const inputValidation = validateRequest(generated.request);
  const optionValidation = validateOptions(optionSet.options, correctAnswer);
  const containsUnresolvedProsePlaceholder = (value: string) => {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
  return /\{[a-z][A-Za-z0-9_]*\}/.test(proseOnly);
};
  const validationChecks = [
    {
      name: "input-domain",
      passed: inputValidation.ok,
      message: inputValidation.ok
        ? "Generated parameters satisfy the CP-001 domain."
        : inputValidation.errors.join("; "),
    },
    {
      name: "independent-verifier",
      passed: independent.ok,
      message: independent.ok
        ? "Independent exact verifier agrees with the canonical solver."
        : independent.errors.join("; "),
    },
    {
      name: "four-misconception-options",
      passed: optionValidation.ok && optionSet.misconceptionLabels.filter((label) => label !== "CORRECT").length === 3,
      message: optionValidation.ok
        ? "Four unique options contain one correct answer and three labelled misconceptions."
        : optionValidation.errors.join("; "),
    },
    {
      name: "dynamic-editorial-binding",
      passed:
        !containsUnresolvedProsePlaceholder(stem) &&
        !containsUnresolvedProsePlaceholder(explanationText),
      message: "Dynamic stem and explanation contain no unresolved prose placeholders.",
    },
    {
      name: "question-bank-safety",
      passed: true,
      message: "Dynamic candidates remain outside Question Bank, tests and publication.",
    },
  ];
  const validation = {
    valid: validationChecks.every((check) => check.passed),
    checks: validationChecks,
  };
  if (!validation.valid) {
    throw new Error(
      `${qlId}: dynamic package validation failed: ${validationChecks
        .filter((check) => !check.passed)
        .map((check) => check.message)
        .join(" | ")}`,
    );
  }

  const questionId = `${qlId}:dynamic:${seed}`;
  const explanationId = `${qlId}-DYNAMIC-EXPLANATION-V1`;
  return {
    archetypeId: "PNL-001" as const,
    canonicalProblemId: PNL_CP001_ID,
    questionId,
    questionLanguageId: qlId,
    explanationId,
    language: "en" as const,
    difficultyBand: generated.registry.difficulty,
    stem,
    answer: correctAnswer,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    parameters: {
      archetypeId: "PNL-001" as const,
      canonicalProblemId: PNL_CP001_ID,
      questionId,
      questionLanguageId: qlId,
      explanationId,
      language: "en" as const,
      difficultyBand: generated.registry.difficulty,
      taskKind: generated.registry.solveMode,
      answerType: correctValue.kind,
      answerSemantic: generated.registry.answerSemantic,
      requiredVariables: [...generated.registry.requiredVariables],
      variables: generated.context,
      seed,
      runtimeMode: PNL_CP001_DYNAMIC_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      sourceTrace: {
        registry: "PNL-001/CP-001/task-registry.library.json",
        editorial: "PNL-001/CP-001/editorial-content.en.json",
        solver: "PNL-001/foundation/solver.ts",
        verifier: "PNL-001/CP-001/cp001-dynamic-verifier.ts",
      },
    },
    solver: {
      answer: correctAnswer,
      numericAnswer:
        correctValue.kind === "MONEY"
          ? Number(correctValue.value.paise) / 100
          : correctValue.kind === "PERCENT" || correctValue.kind === "FRACTION"
            ? rationalToNumber(correctValue.value)
            : null,
      answerType: correctValue.kind,
      evidence: {
        solveMode: generated.registry.solveMode,
        answerSemantic: generated.registry.answerSemantic,
        independentVerifier: "PASS",
      },
      mathJax: {},
    },
    reasoningGraph: {
      graphId: `${qlId}-dynamic-graph`,
      nodes: [
        { id: "given", label: "Generated values", value: generated.context },
        { id: "mode", label: "Solve mode", value: generated.registry.solveMode },
        { id: "answer", label: "Exact answer", value: correctAnswer },
      ],
    },
    explanation: {
      explanationId,
      lines: explanationText.split(/\n{2,}/),
    },
    traceability: {
      questionId,
      archetypeId: "PNL-001",
      canonicalProblemId: PNL_CP001_ID,
      questionLanguageId: qlId,
      explanationId,
      solveMode: generated.registry.solveMode,
      answerSemantic: generated.registry.answerSemantic,
      contextFamily: editorial.stem.contextFamily,
      difficultyBand: generated.registry.difficulty,
      seed,
      generationMode: PNL_CP001_DYNAMIC_RUNTIME_MODE,
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
