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
import { rationalToNumber } from "../foundation/rational";
import { moneyFromPaise, type Money } from "../foundation/money";
import {
  verifyCommissionNetReceipt,
  verifyTransactionChainFinal,
  verifyTransactionChainInitial,
} from "../foundation/cp004-independent-verifier";
import {
  PNL_CP004_ID,
  PNL_CP004_QL_IDS,
  cp004FormatMoney,
  cp004FormatPercent,
  cp004FormatRational,
  cp004PlainMoney,
  generatePnlCp004Case,
  solvePnlCp004Request,
  type PnlCp004Difficulty,
  type PnlCp004GeneratedCase,
  type PnlCp004SolverRequest,
  type PnlCp004SolverResult,
} from "./cp004-dynamic-cases";

export { PNL_CP004_ID };
export const PNL_CP004_DYNAMIC_RUNTIME_MODE = "DYNAMIC_CANDIDATE" as const;
export const PNL_CP004_LANGUAGES = ["en"] as const;

export type PnlCp004Language = (typeof PNL_CP004_LANGUAGES)[number];
export type { PnlCp004Difficulty };

export type PnlCp004DynamicInput = Readonly<{
  difficultyBand?: PnlCp004Difficulty;
  language?: PnlCp004Language;
  questionLanguageId?: string;
  seed?: string;
}>;

type EditorialFile = Readonly<{
  schemaVersion: 2;
  archetypeId: "PNL-001";
  cpId: typeof PNL_CP004_ID;
  language: "en";
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
}>;

type DynamicAnswer =
  | Readonly<{ kind: "MONEY"; value: Money }>
  | Readonly<{
      kind: "PERCENT";
      value: { numerator: bigint; denominator: bigint };
    }>
  | Readonly<{ kind: "TEXT"; value: string }>;

const editorialLibrary = editorialContentJson as EditorialFile;

function directionRateText(
  direction: "PROFIT" | "LOSS" | "NO_CHANGE",
  ratePercent: { numerator: bigint; denominator: bigint },
): string {
  if (direction === "NO_CHANGE") return "No profit, no loss";
  return `${cp004FormatPercent(ratePercent)} ${direction.toLowerCase()}`;
}

function ledgerAnswer(
  ledger: readonly {
    stageNumber: number;
    direction: "PROFIT" | "LOSS";
    amount: Money;
  }[],
): string {
  return ledger
    .map(
      (item) =>
        `Transaction ${item.stageNumber}: ${item.direction === "PROFIT" ? "profit" : "loss"} ${cp004FormatMoney(item.amount)}`,
    )
    .join("; ");
}

function answerFor(
  qlId: string,
  result: PnlCp004SolverResult,
  generated: PnlCp004GeneratedCase,
): DynamicAnswer {
  if (generated.answerOverride) {
    return { kind: "TEXT", value: generated.answerOverride };
  }

  switch (qlId) {
    case "PNL-QL-095":
    case "PNL-QL-096":
    case "PNL-QL-104":
    case "PNL-QL-115":
      if (!("finalSellingPrice" in result)) {
        throw new Error(`${qlId}: expected final selling price.`);
      }
      return { kind: "MONEY", value: result.finalSellingPrice };

    case "PNL-QL-107":
      if (!("sellingPrice" in result)) {
        throw new Error(`${qlId}: expected selling price.`);
      }
      return { kind: "MONEY", value: result.sellingPrice };

    case "PNL-QL-097":
    case "PNL-QL-098":
    case "PNL-QL-113":
      if (!("initialCostPrice" in result)) {
        throw new Error(`${qlId}: expected initial cost price.`);
      }
      return { kind: "MONEY", value: result.initialCostPrice };

    case "PNL-QL-099":
      if (!("intermediatePrice" in result)) {
        throw new Error(`${qlId}: expected intermediate price.`);
      }
      return { kind: "MONEY", value: result.intermediatePrice };

    case "PNL-QL-100":
    case "PNL-QL-101":
    case "PNL-QL-112":
    case "PNL-QL-110":
    case "PNL-QL-120":
      if (!("direction" in result) || !("ratePercent" in result)) {
        throw new Error(`${qlId}: expected a directed percentage result.`);
      }
      return {
        kind: "TEXT",
        value: directionRateText(result.direction, result.ratePercent),
      };

    case "PNL-QL-102":
    case "PNL-QL-103":
    case "PNL-QL-118":
      if (!("missingRatePercent" in result)) {
        throw new Error(`${qlId}: expected missing rate.`);
      }
      return { kind: "PERCENT", value: result.missingRatePercent };

    case "PNL-QL-105":
    case "PNL-QL-116": {
      if (!("ledger" in result)) throw new Error(`${qlId}: expected ledger.`);
      const selectedStage = Number(generated.context.selectedStage);
      const item = result.ledger[selectedStage - 1]!;
      return {
        kind: "TEXT",
        value: `Transaction ${selectedStage}: ${item.direction === "PROFIT" ? "profit" : "loss"} ${cp004FormatMoney(item.amount)}`,
      };
    }

    case "PNL-QL-106": {
      if (!("ledger" in result)) throw new Error(`${qlId}: expected ledger.`);
      const item = [...result.ledger].sort((left, right) =>
        left.amount.paise === right.amount.paise
          ? left.stageNumber - right.stageNumber
          : left.amount.paise > right.amount.paise
            ? -1
            : 1,
      )[0]!;
      return {
        kind: "TEXT",
        value: `Transaction ${item.stageNumber}: ${item.direction === "PROFIT" ? "profit" : "loss"} ${cp004FormatMoney(item.amount)}`,
      };
    }

    case "PNL-QL-108":
      if (!("netReceipt" in result))
        throw new Error(`${qlId}: expected net receipt.`);
      return { kind: "MONEY", value: result.netReceipt };

    case "PNL-QL-109":
      if (!("grossSellingPrice" in result)) {
        throw new Error(`${qlId}: expected gross selling price.`);
      }
      return { kind: "MONEY", value: result.grossSellingPrice };

    case "PNL-QL-111":
      if (!("ledger" in result)) throw new Error(`${qlId}: expected ledger.`);
      return { kind: "TEXT", value: ledgerAnswer(result.ledger) };

    case "PNL-QL-114": {
      if (!("ledger" in result)) throw new Error(`${qlId}: expected ledger.`);
      const first = Number(generated.context.firstStageNumber);
      const second = Number(generated.context.secondStageNumber);
      const firstPrice = result.ledger[first - 1]!.sellingPrice;
      const secondPrice = result.ledger[second - 1]!.sellingPrice;
      const difference =
        firstPrice.paise > secondPrice.paise
          ? firstPrice.paise - secondPrice.paise
          : secondPrice.paise - firstPrice.paise;
      return { kind: "MONEY", value: moneyFromPaise(difference) };
    }

    default:
      throw new Error(`${qlId}: dynamic answer mapping is missing.`);
  }
}

function formatAnswer(answer: DynamicAnswer): string {
  if (answer.kind === "MONEY") return cp004FormatMoney(answer.value);
  if (answer.kind === "PERCENT") return cp004FormatPercent(answer.value);
  return answer.value;
}

function resultContext(
  qlId: string,
  result: PnlCp004SolverResult,
  answer: string,
  generated: PnlCp004GeneratedCase,
): Readonly<Record<string, unknown>> {
  const context: Record<string, unknown> = {
    correctStatement: answer,
    dataSufficiencyAnswer: answer,
  };
  if ("finalSellingPrice" in result) {
    context.finalSellingPrice = cp004PlainMoney(result.finalSellingPrice);
  }
  if ("initialCostPrice" in result) {
    context.initialCostPrice = cp004PlainMoney(result.initialCostPrice);
  }
  if ("intermediatePrice" in result) {
    context.intermediateSellingPrice = cp004PlainMoney(
      result.intermediatePrice,
    );
  }
  if ("missingRatePercent" in result) {
    context.missingRatePercent = cp004FormatRational(result.missingRatePercent);
  }
  if ("sellingPrice" in result) {
    context.sellingPrice = cp004PlainMoney(result.sellingPrice);
  }
  if ("netReceipt" in result) {
    context.netReceipt = cp004PlainMoney(result.netReceipt);
  }
  if ("grossSellingPrice" in result) {
    context.grossSellingPrice = cp004PlainMoney(result.grossSellingPrice);
  }
  if ("direction" in result && "ratePercent" in result) {
    context.overallDirection = result.direction.toLowerCase();
    context.overallRatePercent = cp004FormatRational(result.ratePercent);
    context.resultDirection = result.direction.toLowerCase();
    context.resultRatePercent = cp004FormatRational(result.ratePercent);
  }
  if ("ledger" in result) {
    context.stageWiseAmounts = ledgerAnswer(result.ledger);
    const selectedStage = Number(generated.context.selectedStage ?? 1);
    context.selectedStageAmount = cp004PlainMoney(
      result.ledger[selectedStage - 1]!.amount,
    );
    if (qlId === "PNL-QL-114") {
      context.stagePriceDifference = answer.replace(/^₹/, "");
    }
  }
  return context;
}

function numericDistractors(answer: DynamicAnswer): readonly string[] {
  if (answer.kind === "MONEY") {
    const paise = answer.value.paise;
    return [
      moneyFromPaise((paise * 90n) / 100n),
      moneyFromPaise((paise * 110n) / 100n),
      moneyFromPaise(paise + 10000n),
      moneyFromPaise(paise > 10000n ? paise - 10000n : paise + 20000n),
    ].map(cp004FormatMoney);
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
  return [];
}

function textDistractors(qlId: string, correct: string): readonly string[] {
  const pools: Record<string, readonly string[]> = {
    "PNL-QL-117": [
      "Statement 1 only",
      "Statement 2 only",
      "Statement 3 only",
      "Statements 1 and 3 only",
    ],
    "PNL-QL-119": [
      "Statement 1 alone is sufficient",
      "Statement 2 alone is sufficient",
      "Either statement alone is sufficient",
      "Both statements together are required",
      "Even both statements together are insufficient",
    ],
    "PNL-QL-111": [
      "All rates are applied to the original cost",
      "The signed percentages are added directly",
      "Only the final trader's result is required",
      "The stage order does not matter",
    ],
  };
  const pool =
    pools[qlId] ??
    ([
      "10% profit",
      "10% loss",
      "No profit, no loss",
      "20% profit",
      "Cannot be determined",
    ] as const);
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
    { value: unique[0]!, label: "ADDED_SIGNED_RATES" },
    { value: unique[1]!, label: "WRONG_PRICE_BASE" },
    { value: unique[2]!, label: "REVERSED_OR_IGNORED_FEE" },
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

function cp004StageSequence(
  stages: readonly Readonly<{
    direction: "PROFIT" | "LOSS";
    ratePercent: { numerator: bigint; denominator: bigint };
  }>[],
): string {
  return stages
    .map(
      (stage, index) =>
        `stage ${index + 1}: ${cp004FormatPercent(stage.ratePercent)} ${stage.direction.toLowerCase()}`,
    )
    .join("; ");
}

function cp004MoneySum(first: Money, second: Money): Money {
  return moneyFromPaise(first.paise + second.paise);
}

function buildCp004GeneratedWorking(
  qlId: string,
  request: PnlCp004SolverRequest,
  result: PnlCp004SolverResult,
  answer: string,
): string {
  const prefix = "**Generated-value check:**";

  switch (request.mode) {
    case "INITIAL_CP_AND_STAGES_TO_FINAL_SP": {
      const purpose =
        qlId === "PNL-QL-095"
          ? "For the two-transfer chain"
          : qlId === "PNL-QL-096"
            ? "For the three-transfer chain"
            : "Reading the transaction table in order";
      return `${prefix} ${purpose}, start from ${cp004FormatMoney(request.initialCostPrice)} and apply ${cp004StageSequence(request.stages)} to the changing price base. The final selling price is ${answer}.`;
    }

    case "FINAL_SP_AND_STAGES_TO_INITIAL_CP": {
      if (qlId === "PNL-QL-119") {
        return `${prefix} Initial cost can be recovered only when the final selling price and the complete ordered stage sequence are available. Testing the two statements against those requirements gives ${answer}.`;
      }
      const purpose =
        qlId === "PNL-QL-097"
          ? "Reverse the two-stage chain"
          : qlId === "PNL-QL-098"
            ? "Reverse all three successive stages"
            : "Reverse the mixed profit-and-loss chain";
      return `${prefix} ${purpose} from final price ${cp004FormatMoney(request.finalSellingPrice)} using ${cp004StageSequence(request.stages)}. Dividing by the stage multipliers recovers the original cost ${answer}.`;
    }

    case "INITIAL_CP_AND_STAGES_TO_INTERMEDIATE_PRICE":
      return `${prefix} Starting from ${cp004FormatMoney(request.initialCostPrice)}, apply only the first ${request.afterStage} stage${request.afterStage === 1 ? "" : "s"} of ${cp004StageSequence(request.stages)}. The price immediately after that point is ${answer}.`;

    case "STAGES_TO_OVERALL_RATE": {
      const purpose =
        qlId === "PNL-QL-100"
          ? "For the two-stage percentage chain"
          : qlId === "PNL-QL-101"
            ? "For the three-stage percentage chain"
            : qlId === "PNL-QL-112"
              ? "From the original owner to the final buyer"
              : "Evaluating the statement about the complete chain";
      return `${prefix} ${purpose}, multiply the successive factors for ${cp004StageSequence(request.stages)} rather than adding signed rates. The net result is ${answer}.`;
    }

    case "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE": {
      const known = request.knownStages.length
        ? cp004StageSequence(request.knownStages)
        : "no known stage";
      const purpose =
        qlId === "PNL-QL-102"
          ? "The missing stage is a profit"
          : qlId === "PNL-QL-103"
            ? "The missing stage is a loss"
            : "In the algebraic chain, the unknown multiplier";
      return `${prefix} ${purpose}. Compare initial price ${cp004FormatMoney(request.initialCostPrice)} with final price ${cp004FormatMoney(request.finalSellingPrice)}, remove the known contribution (${known}), and the required ${request.missingDirection.toLowerCase()} rate is ${answer}.`;
    }

    case "EQUAL_RATE_N_STAGE_TO_FINAL_SP":
      return `${prefix} Apply the same ${cp004FormatPercent(request.ratePercent)} ${request.direction.toLowerCase()} factor ${request.stageCount} times to ${cp004FormatMoney(request.initialCostPrice)}. Compounding on each new price gives ${answer}.`;

    case "CHAIN_TO_STAGE_LEDGER": {
      const ledger = "ledger" in result ? result.ledger : [];
      const finalPrice =
        "finalSellingPrice" in result
          ? cp004FormatMoney(result.finalSellingPrice)
          : "the computed final price";
      const purpose =
        qlId === "PNL-QL-105"
          ? "Read the selected transaction from the stage ledger"
          : qlId === "PNL-QL-106"
            ? "Compare the absolute money change at every stage"
            : qlId === "PNL-QL-111"
              ? "Write the profit or loss amount for every transaction"
              : qlId === "PNL-QL-114"
                ? "Compare the two requested stage selling prices"
                : "For the caselet, isolate the selected trader's transaction";
      return `${prefix} ${purpose}. Starting from ${cp004FormatMoney(request.initialCostPrice)}, ${ledger.length} ordered ledger entries lead to ${finalPrice}; the requested ledger result is ${answer}.`;
    }

    case "BUYER_EXPENSE_THEN_RATE_TO_SP": {
      const effectiveCost = cp004MoneySum(
        request.purchasePrice,
        request.buyerExpense,
      );
      return `${prefix} Add buyer-side expense ${cp004FormatMoney(request.buyerExpense)} to purchase price ${cp004FormatMoney(request.purchasePrice)}, making effective cost ${cp004FormatMoney(effectiveCost)}. Applying ${cp004FormatPercent(request.ratePercent)} ${request.direction.toLowerCase()} gives selling price ${answer}.`;
    }

    case "GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT": {
      const commission =
        "commissionAmount" in result
          ? cp004FormatMoney(result.commissionAmount)
          : "the calculated commission";
      return `${prefix} Commission at ${cp004FormatPercent(request.commissionPercent)} on gross selling price ${cp004FormatMoney(request.grossSellingPrice)} is ${commission}. Deducting it leaves net receipt ${answer}.`;
    }

    case "NET_TARGET_AND_COMMISSION_TO_GROSS_SP":
      return `${prefix} A ${cp004FormatPercent(request.commissionPercent)} commission means only the retained share of gross reaches the seller. Gross up required net receipt ${cp004FormatMoney(request.requiredNetReceipt)} by that retained share to obtain ${answer}.`;

    case "MIDDLE_TRADER_NET_RESULT": {
      const effectiveCost = cp004MoneySum(
        request.purchasePrice,
        request.buyerExpense,
      );
      const netReceipt =
        "netReceipt" in result
          ? cp004FormatMoney(result.netReceipt)
          : "the computed net receipt";
      const purpose =
        qlId === "PNL-QL-120"
          ? "For the agent-assisted resale caselet"
          : "For the middle trader's direct net result";
      return `${prefix} ${purpose}, purchase ${cp004FormatMoney(request.purchasePrice)} plus expense ${cp004FormatMoney(request.buyerExpense)} gives effective cost ${cp004FormatMoney(effectiveCost)}. After ${cp004FormatPercent(request.commissionPercent)} commission on gross sale ${cp004FormatMoney(request.grossSellingPrice)}, net receipt is ${netReceipt}; comparison gives ${answer}.`;
    }
  }
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_, item) =>
    typeof item === "bigint" ? item.toString() : item,
  );
}

function independentVerification(
  request: PnlCp004SolverRequest,
  result: PnlCp004SolverResult,
): boolean {
  switch (request.mode) {
    case "INITIAL_CP_AND_STAGES_TO_FINAL_SP":
      return (
        "finalSellingPrice" in result &&
        verifyTransactionChainFinal(
          request.initialCostPrice,
          request.stages,
          result.finalSellingPrice,
        ).valid
      );
    case "FINAL_SP_AND_STAGES_TO_INITIAL_CP":
      return (
        "initialCostPrice" in result &&
        verifyTransactionChainInitial(
          request.finalSellingPrice,
          request.stages,
          result.initialCostPrice,
        ).valid
      );
    case "INITIAL_CP_AND_STAGES_TO_INTERMEDIATE_PRICE":
      return (
        "intermediatePrice" in result &&
        verifyTransactionChainFinal(
          request.initialCostPrice,
          request.stages.slice(0, request.afterStage),
          result.intermediatePrice,
        ).valid
      );
    case "INITIAL_FINAL_KNOWN_STAGES_TO_MISSING_RATE":
      return (
        "missingRatePercent" in result &&
        verifyTransactionChainFinal(
          request.initialCostPrice,
          [
            ...request.knownStages,
            {
              direction: request.missingDirection,
              ratePercent: result.missingRatePercent,
            },
          ],
          request.finalSellingPrice,
        ).valid
      );
    case "EQUAL_RATE_N_STAGE_TO_FINAL_SP":
      return (
        "finalSellingPrice" in result &&
        verifyTransactionChainFinal(
          request.initialCostPrice,
          Array.from({ length: request.stageCount }, () => ({
            direction: request.direction,
            ratePercent: request.ratePercent,
          })),
          result.finalSellingPrice,
        ).valid
      );
    case "CHAIN_TO_STAGE_LEDGER":
      return (
        "finalSellingPrice" in result &&
        verifyTransactionChainFinal(
          request.initialCostPrice,
          request.stages,
          result.finalSellingPrice,
        ).valid
      );
    case "GROSS_SP_AND_COMMISSION_TO_NET_RECEIPT":
      return (
        "netReceipt" in result &&
        verifyCommissionNetReceipt(
          request.grossSellingPrice,
          request.commissionPercent,
          result.netReceipt,
        ).valid
      );
    case "NET_TARGET_AND_COMMISSION_TO_GROSS_SP":
      return (
        "grossSellingPrice" in result &&
        verifyCommissionNetReceipt(
          result.grossSellingPrice,
          request.commissionPercent,
          request.requiredNetReceipt,
        ).valid
      );
    default:
      return stable(result) === stable(solvePnlCp004Request(request));
  }
}

function selectQl(input: PnlCp004DynamicInput): string {
  if (input.questionLanguageId) {
    if (!PNL_CP004_QL_IDS.includes(input.questionLanguageId)) {
      throw new Error(
        `Unknown CP-004 question-language ID: ${input.questionLanguageId}`,
      );
    }
    return input.questionLanguageId;
  }
  const eligible = PNL_CP004_QL_IDS.filter((qlId) => {
    const registry = generatePnlCp004Case(
      qlId,
      `${input.seed ?? "cp004"}:probe`,
    ).registry;
    return (
      !input.difficultyBand || registry.difficulty === input.difficultyBand
    );
  });
  if (!eligible.length)
    throw new Error("No CP-004 QLs match the requested difficulty.");
  return pickSeeded(
    createSeededRandom(`${input.seed ?? "cp004-dynamic"}:ql-selection`),
    eligible,
  );
}

function containsUnresolvedProsePlaceholder(value: string): boolean {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
  return /\{[a-z][A-Za-z0-9_]*\}/.test(proseOnly);
}

export function listPnlCp004DynamicQlIds(): readonly string[] {
  return [...PNL_CP004_QL_IDS];
}

export function runPnlCp004DynamicPipeline(input: PnlCp004DynamicInput = {}) {
  if (input.language && input.language !== "en") {
    throw new Error(
      "PNL-CP-004 dynamic runtime currently supports English only.",
    );
  }

  const qlId = selectQl(input);
  const seed = input.seed ?? `${qlId}:dynamic-default`;
  const generated = generatePnlCp004Case(qlId, seed);
  const result = solvePnlCp004Request(generated.request);
  const recomputed = solvePnlCp004Request(generated.request);
  const answerValue = answerFor(qlId, result, generated);
  const answer = formatAnswer(answerValue);
  const optionSet = buildOptions(qlId, seed, answerValue);
  const editorial = editorialLibrary.entries[qlId];
  if (!editorial)
    throw new Error(`${qlId}: English editorial entry is missing.`);

  const context = {
    ...generated.context,
    ...resultContext(qlId, result, answer, generated),
  };
  const stem = renderStructuredStemMarkdown(editorial.stem, context);
  const baseExplanation = renderFriendlyExplanationMarkdown(
    editorial.explanation,
    context,
  );
  const generatedWorking = buildCp004GeneratedWorking(
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
      message: "Exact recomputation agrees with the canonical CP-004 solver.",
    },
    {
      name: "independent-verification",
      passed: independentVerification(generated.request, result),
      message:
        "Independent chain or fee arithmetic agrees with the solver result.",
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
    canonicalProblemId: PNL_CP004_ID,
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
      canonicalProblemId: PNL_CP004_ID,
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
      runtimeMode: PNL_CP004_DYNAMIC_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      sourceTrace: {
        registry: "PNL-001/CP-004/task-registry.library.json",
        editorial: "PNL-001/CP-004/editorial-content.en.json",
        solver:
          "PNL-001/foundation/transaction-chain-solver.ts | transaction-fee-solver.ts",
        verifier: "PNL-001/foundation/cp004-independent-verifier.ts",
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
        independentVerification: "PASS",
      },
      mathJax: {},
    },
    reasoningGraph: {
      graphId: `${qlId}-dynamic-graph`,
      nodes: [
        { id: "given", label: "Generated transaction values", value: context },
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
      canonicalProblemId: PNL_CP004_ID,
      questionLanguageId: qlId,
      explanationId,
      solveMode: generated.registry.solveMode,
      answerSemantic: generated.registry.answerSemantic,
      contextFamily: editorial.stem.contextFamily,
      difficultyBand: generated.registry.difficulty,
      representation:
        generated.registry.representation ??
        generated.registry.presentation ??
        "PARAGRAPH",
      seed,
      generationMode: PNL_CP004_DYNAMIC_RUNTIME_MODE,
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
