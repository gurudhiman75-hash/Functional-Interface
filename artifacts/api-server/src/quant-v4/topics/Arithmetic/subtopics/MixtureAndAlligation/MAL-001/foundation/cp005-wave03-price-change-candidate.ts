import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
} from "./rational";
import type { Rational } from "./types";
import { solveMalCp005 } from "./cp005-solver";
import type { MalCp005SolveRequest } from "./cp005-types";

export const MAL_CP005_WAVE03_CANDIDATE_ID =
  "MAL-CP005-CAND-PROFIT-AFTER-FREE-ADULTERATION-AND-PRICE-CHANGE" as const;
export const MAL_CP005_WAVE03_RUNTIME_ID =
  "MAL-CP005-EN-PRICE-CHANGE-PROFIT-AMOUNT-CANDIDATE-V1" as const;
export const MAL_CP005_WAVE03_SOURCE_ID =
  "RS-AGGARWAL-QA-2017-P388-Q111" as const;

const HUNDRED = rational(100);
const ZERO = rational(0);

export interface MalCp005Wave03PriceChangeRequest {
  pureQuantity: Rational;
  pureUnitCost: Rational;
  adulterantPercentOfPureQuantity: Rational;
  sellingPriceIncreasePercent: Rational;
}

export interface MalCp005Wave03PriceChangeSolution {
  adulterantQuantity: Rational;
  finalQuantity: Rational;
  sellingRate: Rational;
  actualCost: Rational;
  revenue: Rational;
  profitAmount: Rational;
  profitPercent: Rational;
}

export interface MalCp005Wave03PriceChangeQuestion {
  archetypeId: "MAL-001";
  canonicalProblemId: "MAL-CP-005";
  candidateId: typeof MAL_CP005_WAVE03_CANDIDATE_ID;
  runtimeId: typeof MAL_CP005_WAVE03_RUNTIME_ID;
  permanentQlId: null;
  permanentSolveModeId: null;
  language: "en";
  questionId: string;
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
  stateKey: string;
  siblingStateKey: string;
  difficulty: "Medium";
  taskDirection: "FORWARD";
  answerSemantic: "PROFIT_AMOUNT";
  sharedCoreFamily: "FREE_ADULTERANT_COMMERCIAL_RATE";
  canonicalExistingPrototypeId:
    "MAL-CP005-PROT-PROFIT-FROM-FREE-BLEND-AND-SELLING-RATE";
  sourceEvidenceIds: readonly [typeof MAL_CP005_WAVE03_SOURCE_ID];
  sourceEvidenceStatus: "NORMALIZED_REFERENCE_LOCATORS_V1";
  request: MalCp005Wave03PriceChangeRequest;
  solution: MalCp005Wave03PriceChangeSolution;
  canonicalExistingRequest: MalCp005SolveRequest;
  stem: string;
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: Array<{
    text: string;
    misconceptionId: string;
    isCorrect: boolean;
  }>;
  explanation: {
    layoutId: "MAL-CP005-EN-SOLUTION-FIRST-V2";
    visibleLines: string[];
    answerLine: string;
    optionalHelp: {
      commonMistake: string;
      verification: string[];
    };
  };
  equivalence: {
    canonicalProfitPercent: Rational;
    percentMatchesExistingSolver: boolean;
    distinctAnswerSemantic: true;
    scalingWitness: {
      doubledPureQuantityProfitPercent: Rational;
      doubledPureQuantityProfitAmount: Rational;
      sameProfitPercent: boolean;
      doubledProfitAmount: boolean;
    };
  };
  maturity: "EXECUTABLE_CANDIDATE";
  allocationStatus: "UNALLOCATED_PENDING_PERMANENT_REVIEW";
  reviewStatus: "PENDING_PRODUCT_REVIEW";
  runtimeMode: "REVIEW_ONLY";
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: true;
  questionBankWritable: false;
  testEligible: false;
}

interface Context {
  actor: string;
  product: string;
  adulterant: string;
  unit: "litres" | "kg";
}

const CONTEXTS: readonly Context[] = [
  { actor: "milkman", product: "pure milk", adulterant: "water", unit: "litres" },
  { actor: "dairy vendor", product: "pure milk", adulterant: "water", unit: "litres" },
  { actor: "juice seller", product: "pure fruit juice", adulterant: "water", unit: "litres" },
  { actor: "syrup dealer", product: "pure sugar syrup", adulterant: "water", unit: "litres" },
  { actor: "honey seller", product: "pure honey", adulterant: "water", unit: "kg" },
  { actor: "beverage seller", product: "pure drink concentrate", adulterant: "water", unit: "litres" },
] as const;

const PURE_QUANTITIES = [20, 25, 30, 40, 50, 60, 75, 80, 100, 120] as const;
const PURE_COSTS = [15, 20, 24, 25, 30, 32, 40, 45, 48, 50, 60, 64, 72, 75, 80] as const;
const ADULTERATION_PERCENTS = [5, 10, 15, 20, 25, 30, 40, 50] as const;
const PRICE_INCREASE_PERCENTS = [5, 10, 15, 20, 25, 30, 40] as const;

function assertPositive(value: Rational, label: string): void {
  if (compareRational(value, ZERO) <= 0) throw new Error(`${label} must be positive.`);
}

function hash(value: string): number {
  let state = 2166136261;
  for (const character of value) {
    state ^= character.codePointAt(0) ?? 0;
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}

function pick<T>(values: readonly T[], seed: string): T {
  if (values.length === 0) throw new Error("Cannot pick from an empty pool.");
  return values[hash(seed) % values.length]!;
}

function shuffle<T>(values: readonly T[], seed: string): T[] {
  const result = [...values];
  let state = hash(seed) || 0x9e3779b9;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = next() % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function percentText(value: Rational): string {
  return `${formatRational(value)}%`;
}

function quantityText(value: Rational, unit: "litres" | "kg"): string {
  const displayUnit = unit === "litres" && equalsRational(value, rational(1)) ? "litre" : unit;
  return `${formatRational(value)} ${displayUnit}`;
}

function currencyValueText(value: Rational): string {
  const scaledHundred = value.numerator * 100n;
  if (scaledHundred % value.denominator === 0n) {
    const paise = scaledHundred / value.denominator;
    const sign = paise < 0n ? "-" : "";
    const absolutePaise = paise < 0n ? -paise : paise;
    const rupees = absolutePaise / 100n;
    const remainder = absolutePaise % 100n;
    if (remainder === 0n) return `${sign}${rupees}`;
    return `${sign}${rupees}.${remainder.toString().padStart(2, "0")}`;
  }
  return formatRational(value);
}

function rateText(value: Rational, unit: "litres" | "kg"): string {
  return `₹${currencyValueText(value)} per ${unit === "kg" ? "kg" : "litre"}`;
}

function moneyText(value: Rational): string {
  return `₹${currencyValueText(value)}`;
}

function isWholePositive(value: Rational): boolean {
  return value.denominator === 1n && value.numerator > 0n;
}

function requestKey(request: MalCp005Wave03PriceChangeRequest): string {
  return [
    rationalKey(request.pureQuantity),
    rationalKey(request.pureUnitCost),
    rationalKey(request.adulterantPercentOfPureQuantity),
    rationalKey(request.sellingPriceIncreasePercent),
  ].join("|");
}

export function solveMalCp005Wave03PriceChangeCandidate(
  request: MalCp005Wave03PriceChangeRequest,
): MalCp005Wave03PriceChangeSolution {
  assertPositive(request.pureQuantity, "Pure quantity");
  assertPositive(request.pureUnitCost, "Pure unit cost");
  assertPositive(request.adulterantPercentOfPureQuantity, "Adulteration percentage");
  assertPositive(request.sellingPriceIncreasePercent, "Selling-price increase");

  const adulterantQuantity = divideRational(
    multiplyRational(request.pureQuantity, request.adulterantPercentOfPureQuantity),
    HUNDRED,
  );
  const finalQuantity = addRational(request.pureQuantity, adulterantQuantity);
  const sellingRate = divideRational(
    multiplyRational(
      request.pureUnitCost,
      addRational(HUNDRED, request.sellingPriceIncreasePercent),
    ),
    HUNDRED,
  );
  const actualCost = multiplyRational(request.pureQuantity, request.pureUnitCost);
  const revenue = multiplyRational(finalQuantity, sellingRate);
  const profitAmount = subtractRational(revenue, actualCost);
  const profitPercent = multiplyRational(
    divideRational(profitAmount, actualCost),
    HUNDRED,
  );
  return {
    adulterantQuantity,
    finalQuantity,
    sellingRate,
    actualCost,
    revenue,
    profitAmount,
    profitPercent,
  };
}

export function canonicalizeMalCp005Wave03PriceChange(
  request: MalCp005Wave03PriceChangeRequest,
): MalCp005SolveRequest {
  const solution = solveMalCp005Wave03PriceChangeCandidate(request);
  return {
    mode: "FREE_BLEND_PROFIT_FROM_COST_AND_SELLING_RATE",
    pureQuantity: request.pureQuantity,
    adulterantQuantity: solution.adulterantQuantity,
    pureUnitCost: request.pureUnitCost,
    sellingRate: solution.sellingRate,
  };
}

function misconceptionAmounts(
  request: MalCp005Wave03PriceChangeRequest,
  solution: MalCp005Wave03PriceChangeSolution,
): Array<{ value: Rational; misconceptionId: string }> {
  const additivePercent = addRational(
    request.adulterantPercentOfPureQuantity,
    request.sellingPriceIncreasePercent,
  );
  const additiveOnly = divideRational(
    multiplyRational(solution.actualCost, additivePercent),
    HUNDRED,
  );
  const adulterationOnly = divideRational(
    multiplyRational(solution.actualCost, request.adulterantPercentOfPureQuantity),
    HUNDRED,
  );
  const priceIncreaseOnly = divideRational(
    multiplyRational(solution.actualCost, request.sellingPriceIncreasePercent),
    HUNDRED,
  );
  const waterRevenueOnly = multiplyRational(solution.adulterantQuantity, solution.sellingRate);
  const markupOnFinalQuantityOnly = divideRational(
    multiplyRational(
      multiplyRational(solution.finalQuantity, request.pureUnitCost),
      request.sellingPriceIncreasePercent,
    ),
    HUNDRED,
  );
  return [
    { value: additiveOnly, misconceptionId: "ADDED_PERCENT_EFFECTS_WITHOUT_INTERACTION" },
    { value: adulterationOnly, misconceptionId: "COUNTED_FREE_ADULTERANT_EFFECT_ONLY" },
    { value: priceIncreaseOnly, misconceptionId: "COUNTED_PRICE_INCREASE_EFFECT_ONLY" },
    { value: waterRevenueOnly, misconceptionId: "COUNTED_ONLY_REVENUE_FROM_FREE_ADULTERANT" },
    { value: markupOnFinalQuantityOnly, misconceptionId: "COUNTED_ONLY_MARKUP_ON_FINAL_QUANTITY" },
  ];
}

function buildOptions(
  request: MalCp005Wave03PriceChangeRequest,
  solution: MalCp005Wave03PriceChangeSolution,
  seed: string,
): {
  options: string[];
  correctIndex: number;
  optionAudit: MalCp005Wave03PriceChangeQuestion["optionAudit"];
} {
  if (!isWholePositive(solution.profitAmount)) {
    throw new Error("Candidate answer is not an exam-natural whole-rupee amount.");
  }
  const answer = moneyText(solution.profitAmount);
  const unique = new Map<string, { text: string; misconceptionId: string }>();
  for (const candidate of misconceptionAmounts(request, solution)) {
    if (!isWholePositive(candidate.value)) continue;
    const text = moneyText(candidate.value);
    if (text === answer || unique.has(text)) continue;
    unique.set(text, { text, misconceptionId: candidate.misconceptionId });
  }
  if (unique.size < 3) {
    throw new Error("Insufficient whole-rupee misconception distractors.");
  }
  const distractors = shuffle([...unique.values()], `${seed}:distractors`).slice(0, 3);
  const selected = shuffle(
    [{ text: answer, misconceptionId: "correct" }, ...distractors],
    `${seed}:positions`,
  );
  const correctIndex = selected.findIndex((option) => option.text === answer);
  return {
    options: selected.map((option) => option.text),
    correctIndex,
    optionAudit: selected.map((option) => ({
      text: option.text,
      misconceptionId: option.misconceptionId,
      isCorrect: option.text === answer,
    })),
  };
}

function stemFor(
  context: Context,
  request: MalCp005Wave03PriceChangeRequest,
  seed: string,
): string {
  const quantity = quantityText(request.pureQuantity, context.unit);
  const cost = rateText(request.pureUnitCost, context.unit);
  const adulteration = percentText(request.adulterantPercentOfPureQuantity);
  const increase = percentText(request.sellingPriceIncreasePercent);
  const templates = [
    `A ${context.actor} buys ${quantity} of ${context.product} at ${cost}. He adds ${context.adulterant} equal to ${adulteration} of the original quantity and sells the mixture at a price ${increase} above his buying rate. What is his total profit?`,
    `A ${context.actor} purchases ${quantity} of ${context.product} at ${cost}, mixes in free ${context.adulterant} equal to ${adulteration} of that quantity, and raises the selling price per unit by ${increase}. Find the total profit.`,
    `A ${context.actor} has ${quantity} of ${context.product} bought at ${cost}. After adding free ${context.adulterant} equal to ${adulteration} of the pure quantity, the mixture is sold at ${increase} above the purchase rate per unit. What profit does he make in all?`,
    `A ${context.actor} buys ${quantity} of ${context.product} for ${cost}. He adulterates it by adding free ${context.adulterant} equal to ${adulteration} of the pure quantity and then increases the selling rate by ${increase}. What is the total profit on the batch?`,
  ] as const;
  return pick(templates, `${seed}:stem-template`);
}

function buildRequest(seed: string): { request: MalCp005Wave03PriceChangeRequest; context: Context } {
  return {
    context: pick(CONTEXTS, `${seed}:context`),
    request: {
      pureQuantity: rational(pick(PURE_QUANTITIES, `${seed}:quantity`)),
      pureUnitCost: rational(pick(PURE_COSTS, `${seed}:cost`)),
      adulterantPercentOfPureQuantity: rational(
        pick(ADULTERATION_PERCENTS, `${seed}:adulteration-percent`),
      ),
      sellingPriceIncreasePercent: rational(
        pick(PRICE_INCREASE_PERCENTS, `${seed}:price-increase-percent`),
      ),
    },
  };
}

export function generateMalCp005Wave03PriceChangeQuestion(
  requestedSeed = "mal-cp005-wave03-price-change:default",
): MalCp005Wave03PriceChangeQuestion {
  const failures: string[] = [];
  for (let attempt = 0; attempt < 512; attempt += 1) {
    const selectedSeed =
      attempt === 0 ? requestedSeed : `${requestedSeed}:attempt:${attempt}`;
    try {
      const { request, context } = buildRequest(selectedSeed);
      const solution = solveMalCp005Wave03PriceChangeCandidate(request);
      const canonicalExistingRequest = canonicalizeMalCp005Wave03PriceChange(request);
      const existingResult = solveMalCp005(canonicalExistingRequest);
      if (existingResult.kind !== "PERCENT") {
        throw new Error("Canonical existing solver did not return a percentage.");
      }
      if (!equalsRational(existingResult.value, solution.profitPercent)) {
        throw new Error("Candidate commercial ledger disagrees with existing profit-percent solver.");
      }
      const options = buildOptions(request, solution, selectedSeed);
      const doubledRequest: MalCp005Wave03PriceChangeRequest = {
        ...request,
        pureQuantity: multiplyRational(request.pureQuantity, rational(2)),
      };
      const doubled = solveMalCp005Wave03PriceChangeCandidate(doubledRequest);
      const sameProfitPercent = equalsRational(doubled.profitPercent, solution.profitPercent);
      const doubledProfitAmount = equalsRational(
        doubled.profitAmount,
        multiplyRational(solution.profitAmount, rational(2)),
      );
      if (!sameProfitPercent || !doubledProfitAmount) {
        throw new Error("Scaling witness failed to distinguish profit amount from profit percentage.");
      }
      const stem = stemFor(context, request, selectedSeed);
      const answer = moneyText(solution.profitAmount);
      const visibleLines = [
        `${context.adulterant[0]!.toUpperCase()}${context.adulterant.slice(1)} added = ${quantityText(request.pureQuantity, context.unit)} × ${percentText(request.adulterantPercentOfPureQuantity)} = ${quantityText(solution.adulterantQuantity, context.unit)}; final quantity = ${quantityText(solution.finalQuantity, context.unit)}.`,
        `New selling rate = ${rateText(request.pureUnitCost, context.unit)} × (100 + ${formatRational(request.sellingPriceIncreasePercent)})/100 = ${rateText(solution.sellingRate, context.unit)}.`,
        `Cost = ${moneyText(solution.actualCost)} and revenue = ${moneyText(solution.revenue)}, so total profit = ${answer}.`,
      ];
      return {
        archetypeId: "MAL-001",
        canonicalProblemId: "MAL-CP-005",
        candidateId: MAL_CP005_WAVE03_CANDIDATE_ID,
        runtimeId: MAL_CP005_WAVE03_RUNTIME_ID,
        permanentQlId: null,
        permanentSolveModeId: null,
        language: "en",
        questionId: `MAL-CP005-W3-${hash(`${requestedSeed}|${requestKey(request)}`).toString(16).padStart(8, "0")}`,
        requestedSeed,
        selectedSeed,
        selectionAttempt: attempt,
        stateKey: `PRICE-CHANGE-AMOUNT|${context.product}|${requestKey(request)}`,
        siblingStateKey: `FREE-COMMERCIAL|${context.product}|${rationalKey(request.adulterantPercentOfPureQuantity)}|${rationalKey(request.sellingPriceIncreasePercent)}`,
        difficulty: "Medium",
        taskDirection: "FORWARD",
        answerSemantic: "PROFIT_AMOUNT",
        sharedCoreFamily: "FREE_ADULTERANT_COMMERCIAL_RATE",
        canonicalExistingPrototypeId:
          "MAL-CP005-PROT-PROFIT-FROM-FREE-BLEND-AND-SELLING-RATE",
        sourceEvidenceIds: [MAL_CP005_WAVE03_SOURCE_ID],
        sourceEvidenceStatus: "NORMALIZED_REFERENCE_LOCATORS_V1",
        request,
        solution,
        canonicalExistingRequest,
        stem,
        answer,
        ...options,
        explanation: {
          layoutId: "MAL-CP005-EN-SOLUTION-FIRST-V2",
          visibleLines,
          answerLine: `Answer: ${answer}`,
          optionalHelp: {
            commonMistake:
              "Do not simply add the adulteration percentage and price-increase percentage. The higher selling rate also applies to the free adulterant, creating an interaction effect.",
            verification: [
              `Equivalent profit percentage = ${percentText(solution.profitPercent)}; ${moneyText(solution.actualCost)} × ${percentText(solution.profitPercent)} = ${answer}.`,
            ],
          },
        },
        equivalence: {
          canonicalProfitPercent: existingResult.value,
          percentMatchesExistingSolver: true,
          distinctAnswerSemantic: true,
          scalingWitness: {
            doubledPureQuantityProfitPercent: doubled.profitPercent,
            doubledPureQuantityProfitAmount: doubled.profitAmount,
            sameProfitPercent,
            doubledProfitAmount,
          },
        },
        maturity: "EXECUTABLE_CANDIDATE",
        allocationStatus: "UNALLOCATED_PENDING_PERMANENT_REVIEW",
        reviewStatus: "PENDING_PRODUCT_REVIEW",
        runtimeMode: "REVIEW_ONLY",
        active: false,
        publiclyPublishable: false,
        questionStudioDiscoverable: true,
        questionBankWritable: false,
        testEligible: false,
      };
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }
  throw new Error(
    `${requestedSeed}: failed to generate an exam-natural price-change candidate after 512 attempts. Last errors: ${failures.slice(-5).join(" | ")}`,
  );
}

export function malCp005Wave03Stable(question: MalCp005Wave03PriceChangeQuestion): string {
  return JSON.stringify(
    {
      candidateId: question.candidateId,
      selectedSeed: question.selectedSeed,
      selectionAttempt: question.selectionAttempt,
      stateKey: question.stateKey,
      request: question.request,
      solution: question.solution,
      canonicalExistingRequest: question.canonicalExistingRequest,
      stem: question.stem,
      answer: question.answer,
      options: question.options,
      correctIndex: question.correctIndex,
      optionAudit: question.optionAudit,
      explanation: question.explanation,
      equivalence: question.equivalence,
    },
    (_key, value) => (typeof value === "bigint" ? `${value}n` : value),
  );
}

export function sourceWitnessMalCp005Wave03(): MalCp005Wave03PriceChangeSolution {
  return solveMalCp005Wave03PriceChangeCandidate({
    pureQuantity: rational(20),
    pureUnitCost: rational(15),
    adulterantPercentOfPureQuantity: rational(10),
    sellingPriceIncreasePercent: rational(10),
  });
}
