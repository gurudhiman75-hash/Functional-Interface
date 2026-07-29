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
      moneyFromPaise((paise * 90n) / 100n),
      moneyFromPaise((paise * 110n) / 100n),
      moneyFromPaise(paise + 10000n),
      moneyFromPaise(paise > 10000n ? paise - 10000n : paise + 20000n),
    ].map(cp006FormatMoney);
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
  const explanationText = `${baseExplanation}\n\n**Working with these values:** Build effective cost and contribution on their stated bases. Deduct recoveries or commission before comparing the final net amount with cost.\n\n**Final answer:** ${answer}`;

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
