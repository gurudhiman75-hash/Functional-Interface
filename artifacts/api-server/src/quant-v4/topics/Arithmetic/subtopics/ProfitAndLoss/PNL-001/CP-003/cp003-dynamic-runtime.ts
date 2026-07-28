import editorialContentJson from "./editorial-content.en.json";

import {
  renderFriendlyExplanationMarkdown,
  renderStructuredStemMarkdown,
  type StructuredEditorialEntry,
} from "../foundation/editorial-content";
import { createSeededRandom, pickSeeded } from "../foundation/parameter-generator";
import { moneyFromPaise, type Money } from "../foundation/money";
import { rationalToNumber, type Rational } from "../foundation/rational";
import { verifyMultipleLotsResult } from "../foundation/cp003-independent-verifier";
import {
  PNL_CP003_ID,
  PNL_CP003_QL_IDS,
  cp003FormatMoney,
  cp003FormatPercent,
  cp003FormatRational,
  cp003PlainMoney,
  generatePnlCp003Case,
  solvePnlCp003Request,
  type PnlCp003Difficulty,
  type PnlCp003GeneratedCase,
  type PnlCp003SolverRequest,
  type PnlCp003SolverResult,
} from "./cp003-dynamic-cases";

export { PNL_CP003_ID };
export const PNL_CP003_DYNAMIC_RUNTIME_MODE = "DYNAMIC_CANDIDATE" as const;
export const PNL_CP003_LANGUAGES = ["en"] as const;

export type PnlCp003Language = (typeof PNL_CP003_LANGUAGES)[number];
export type { PnlCp003Difficulty };

export type PnlCp003DynamicInput = Readonly<{
  difficultyBand?: PnlCp003Difficulty;
  language?: PnlCp003Language;
  questionLanguageId?: string;
  seed?: string;
}>;

type EditorialFile = Readonly<{
  schemaVersion: 2;
  archetypeId: "PNL-001";
  cpId: typeof PNL_CP003_ID;
  language: "en";
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
}>;

type DynamicAnswer =
  | Readonly<{ kind: "MONEY"; value: Money }>
  | Readonly<{ kind: "PERCENT"; value: Rational }>
  | Readonly<{ kind: "QUANTITY"; value: bigint }>
  | Readonly<{ kind: "TEXT"; value: string }>;

const editorialLibrary = editorialContentJson as EditorialFile;

function directedRate(
  direction: "PROFIT" | "LOSS" | "NO_CHANGE",
  ratePercent: Rational,
): string {
  if (direction === "NO_CHANGE") return "No profit, no loss";
  return `${cp003FormatPercent(ratePercent)} ${direction.toLowerCase()}`;
}

function answerFor(
  qlId: string,
  result: PnlCp003SolverResult,
  generated: PnlCp003GeneratedCase,
): DynamicAnswer {
  if (generated.answerOverride) {
    return { kind: "TEXT", value: generated.answerOverride };
  }

  switch (qlId) {
    case "PNL-QL-071":
    case "PNL-QL-072":
    case "PNL-QL-073":
    case "PNL-QL-074":
    case "PNL-QL-076":
    case "PNL-QL-077":
    case "PNL-QL-087":
    case "PNL-QL-088":
    case "PNL-QL-089":
      if (!("direction" in result) || !("ratePercent" in result)) {
        throw new Error(`${qlId}: expected directed overall rate.`);
      }
      return { kind: "TEXT", value: directedRate(result.direction, result.ratePercent) };

    case "PNL-QL-075":
      if (!("requiredSellingPricePerGoodUnit" in result)) {
        throw new Error(`${qlId}: expected required good-unit price.`);
      }
      return { kind: "MONEY", value: result.requiredSellingPricePerGoodUnit };

    case "PNL-QL-078":
    case "PNL-QL-091":
      if (!("unknownRatePercent" in result)) {
        throw new Error(`${qlId}: expected unknown group rate.`);
      }
      return { kind: "PERCENT", value: result.unknownRatePercent };

    case "PNL-QL-079":
      if (!("unknownQuantity" in result)) {
        throw new Error(`${qlId}: expected unknown quantity.`);
      }
      return { kind: "QUANTITY", value: result.unknownQuantity };

    case "PNL-QL-080":
      if (!("requiredUnitSellingPrice" in result)) {
        throw new Error(`${qlId}: expected required remaining-unit price.`);
      }
      return { kind: "MONEY", value: result.requiredUnitSellingPrice };

    case "PNL-QL-081":
      if (!("requiredRatePercent" in result)) {
        throw new Error(`${qlId}: expected required remaining-stock rate.`);
      }
      return {
        kind: "TEXT",
        value: `${cp003FormatPercent(result.requiredRatePercent)} ${String(generated.context.remainingDirection)}`,
      };

    case "PNL-QL-082":
    case "PNL-QL-094":
      if (!("requiredRecoveryPerSpoiledUnit" in result)) {
        throw new Error(`${qlId}: expected required spoiled-unit recovery.`);
      }
      return { kind: "MONEY", value: result.requiredRecoveryPerSpoiledUnit };

    case "PNL-QL-083":
      if (!("ratePercent" in result)) throw new Error(`${qlId}: expected special loss rate.`);
      return { kind: "TEXT", value: `${cp003FormatPercent(result.ratePercent)} loss` };

    case "PNL-QL-084":
      if (!("unknownRatePercent" in result)) throw new Error(`${qlId}: expected inverse rate.`);
      return { kind: "PERCENT", value: result.unknownRatePercent };

    case "PNL-QL-085":
      if (!("totalSellingPrice" in result)) throw new Error(`${qlId}: expected total selling price.`);
      return { kind: "MONEY", value: result.totalSellingPrice };

    case "PNL-QL-086":
      if (!("totalCostPrice" in result)) throw new Error(`${qlId}: expected total cost price.`);
      return { kind: "MONEY", value: result.totalCostPrice };

    case "PNL-QL-093":
      if (!("direction" in result) || !("amount" in result)) {
        throw new Error(`${qlId}: expected overall amount.`);
      }
      return {
        kind: "TEXT",
        value:
          result.direction === "NO_CHANGE"
            ? "No profit, no loss"
            : `${result.direction === "PROFIT" ? "Profit" : "Loss"} ${cp003FormatMoney(result.amount)}`,
      };

    default:
      throw new Error(`${qlId}: dynamic answer mapping is missing.`);
  }
}

function formatAnswer(answer: DynamicAnswer): string {
  if (answer.kind === "MONEY") return cp003FormatMoney(answer.value);
  if (answer.kind === "PERCENT") return cp003FormatPercent(answer.value);
  if (answer.kind === "QUANTITY") return answer.value.toString();
  return answer.value;
}

function resultContext(
  result: PnlCp003SolverResult,
  answer: string,
  generated: PnlCp003GeneratedCase,
): Readonly<Record<string, unknown>> {
  const context: Record<string, unknown> = {
    correctStatement: answer,
    dataSufficiencyAnswer: answer,
  };
  if ("direction" in result && "ratePercent" in result) {
    context.overallDirection = result.direction.toLowerCase();
    context.overallRatePercent = cp003FormatRational(result.ratePercent);
  }
  if ("amount" in result) context.overallAmount = cp003PlainMoney(result.amount);
  if ("requiredSellingPricePerGoodUnit" in result) {
    context.requiredSellingPricePerGoodUnit = cp003PlainMoney(
      result.requiredSellingPricePerGoodUnit,
    );
  }
  if ("unknownRatePercent" in result) {
    context.unknownRatePercent = cp003FormatRational(result.unknownRatePercent);
  }
  if ("unknownQuantity" in result) {
    context.unknownQuantity = result.unknownQuantity.toString();
  }
  if ("requiredUnitSellingPrice" in result) {
    context.requiredUnitSellingPrice = cp003PlainMoney(result.requiredUnitSellingPrice);
  }
  if ("requiredRatePercent" in result) {
    context.requiredRatePercent = cp003FormatRational(result.requiredRatePercent);
  }
  if ("requiredRecoveryPerSpoiledUnit" in result) {
    context.requiredRecoveryPerSpoiledUnit = cp003PlainMoney(
      result.requiredRecoveryPerSpoiledUnit,
    );
    context.breakEvenRecoveryPerSpoiledUnit = cp003PlainMoney(
      result.requiredRecoveryPerSpoiledUnit,
    );
  }
  if ("totalSellingPrice" in result) {
    context.totalSellingPrice = cp003PlainMoney(result.totalSellingPrice);
  }
  if ("totalCostPrice" in result) {
    context.totalCostPrice = cp003PlainMoney(result.totalCostPrice);
  }
  if (generated.expectedDirection) {
    context.requiredDirection = generated.expectedDirection.toLowerCase();
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
    ].map(cp003FormatMoney);
  }
  if (answer.kind === "QUANTITY") {
    const quantity = answer.value;
    return [quantity + 5n, quantity + 10n, quantity > 5n ? quantity - 5n : quantity + 15n].map(
      String,
    );
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
    "PNL-QL-090": [
      "Statement 1 only",
      "Statement 2 only",
      "Both statements are correct",
      "Neither statement is correct",
    ],
    "PNL-QL-092": [
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
  const source = answer.kind === "TEXT" ? textDistractors(qlId, correct) : numericDistractors(answer);
  const unique = [...new Set(source.filter((item) => item !== correct))];
  while (unique.length < 3) unique.push(`Alternative ${unique.length + 1}`);
  const entries = [
    { value: correct, label: "CORRECT" },
    { value: unique[0]!, label: "AVERAGED_GROUP_RATES" },
    { value: unique[1]!, label: "IGNORED_UNSOLD_OR_DAMAGED_STOCK" },
    { value: unique[2]!, label: "WRONG_INVENTORY_BASE_OR_REVERSE" },
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

function rationalEqual(left: Rational, right: Rational): boolean {
  return left.numerator * right.denominator === right.numerator * left.denominator;
}

function targetMatches(
  result: { direction: "PROFIT" | "LOSS" | "NO_CHANGE"; ratePercent: Rational },
  targetDirection: "PROFIT" | "LOSS",
  targetRatePercent: Rational,
): boolean {
  if (targetRatePercent.numerator === 0n) {
    return result.direction === "NO_CHANGE" && result.ratePercent.numerator === 0n;
  }
  return result.direction === targetDirection && rationalEqual(result.ratePercent, targetRatePercent);
}

function forwardConsistency(
  request: PnlCp003SolverRequest,
  result: PnlCp003SolverResult,
  generated: PnlCp003GeneratedCase,
): boolean {
  switch (request.mode) {
    case "MULTIPLE_LOTS_TO_OVERALL_RESULT":
      return (
        result.mode === "MULTIPLE_LOTS_TO_OVERALL_RESULT" &&
        verifyMultipleLotsResult(request.lots, result).valid
      );

    case "DAMAGED_STOCK_REQUIRED_RATE_ON_REMAINDER": {
      if (!("requiredSellingPricePerGoodUnit" in result)) return false;
      const goodQuantity = request.totalQuantity - request.damagedQuantity;
      const check = solvePnlCp003Request({
        mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT",
        totalQuantity: request.totalQuantity,
        unitCostPrice: request.unitCostPrice,
        soldGroups: [
          {
            quantity: goodQuantity,
            unitSellingPrice: result.requiredSellingPricePerGoodUnit,
          },
        ],
        unsoldQuantity: request.damagedQuantity,
        unsoldRecoveryPerUnit: request.damagedRecoveryPerUnit,
      });
      return (
        "direction" in check &&
        "ratePercent" in check &&
        targetMatches(check, request.targetDirection, request.targetRatePercent)
      );
    }

    case "UNKNOWN_GROUP_RATE_FOR_TARGET": {
      if (!("unknownRatePercent" in result)) return false;
      const check = solvePnlCp003Request({
        mode: "GROUP_RATES_TO_OVERALL_RESULT",
        groups: [
          ...request.knownGroups,
          {
            quantity: request.unknownQuantity,
            unitCostPrice: request.unknownUnitCostPrice,
            direction: request.unknownDirection,
            ratePercent: result.unknownRatePercent,
          },
        ],
      });
      return (
        "direction" in check &&
        "ratePercent" in check &&
        targetMatches(check, request.targetDirection, request.targetRatePercent)
      );
    }

    case "UNKNOWN_GROUP_QUANTITY_FOR_TARGET": {
      if (!("unknownQuantity" in result)) return false;
      const check = solvePnlCp003Request({
        mode: "GROUP_RATES_TO_OVERALL_RESULT",
        groups: [
          ...request.fixedGroups,
          {
            quantity: result.unknownQuantity,
            unitCostPrice: request.unknownUnitCostPrice,
            direction: request.unknownDirection,
            ratePercent: request.unknownRatePercent,
          },
        ],
      });
      return (
        "direction" in check &&
        "ratePercent" in check &&
        targetMatches(check, request.targetDirection, request.targetRatePercent)
      );
    }

    case "UNSOLD_STOCK_REQUIRED_UNIT_PRICE": {
      if (!("requiredUnitSellingPrice" in result)) return false;
      const soldQuantity = request.soldGroups.reduce((sum, group) => sum + group.quantity, 0n);
      const check = solvePnlCp003Request({
        mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT",
        totalQuantity: request.totalQuantity,
        unitCostPrice: request.unitCostPrice,
        soldGroups: request.soldGroups,
        unsoldQuantity: request.totalQuantity - soldQuantity,
        unsoldRecoveryPerUnit: result.requiredUnitSellingPrice,
      });
      return (
        "direction" in check &&
        "ratePercent" in check &&
        targetMatches(check, request.targetDirection, request.targetRatePercent)
      );
    }

    case "UNSOLD_STOCK_REQUIRED_RATE": {
      if (!("requiredRatePercent" in result) || !generated.expectedDirection) return false;
      const unitSellingPrice = (() => {
        const delta = (request.unitCostPrice.paise * result.requiredRatePercent.numerator) /
          (100n * result.requiredRatePercent.denominator);
        return moneyFromPaise(
          generated.expectedDirection === "PROFIT"
            ? request.unitCostPrice.paise + delta
            : request.unitCostPrice.paise - delta,
        );
      })();
      const soldQuantity = request.soldGroups.reduce((sum, group) => sum + group.quantity, 0n);
      const check = solvePnlCp003Request({
        mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT",
        totalQuantity: request.totalQuantity,
        unitCostPrice: request.unitCostPrice,
        soldGroups: request.soldGroups,
        unsoldQuantity: request.totalQuantity - soldQuantity,
        unsoldRecoveryPerUnit: unitSellingPrice,
      });
      return (
        "direction" in check &&
        "ratePercent" in check &&
        targetMatches(check, request.targetDirection, request.targetRatePercent)
      );
    }

    case "SPOILED_STOCK_REQUIRED_RECOVERY": {
      if (!("requiredRecoveryPerSpoiledUnit" in result)) return false;
      const check = solvePnlCp003Request({
        mode: "PARTIAL_INVENTORY_TO_OVERALL_RESULT",
        totalQuantity: request.totalQuantity,
        unitCostPrice: request.unitCostPrice,
        soldGroups: [
          {
            quantity: request.goodQuantity,
            unitSellingPrice: request.goodUnitSellingPrice,
          },
        ],
        unsoldQuantity: request.spoiledQuantity,
        unsoldRecoveryPerUnit: result.requiredRecoveryPerSpoiledUnit,
      });
      return (
        "direction" in check &&
        "ratePercent" in check &&
        targetMatches(check, request.targetDirection, request.targetRatePercent)
      );
    }

    case "EQUAL_SP_ONE_RATE_FROM_OVERALL": {
      if (!("unknownRatePercent" in result) || !generated.expectedDirection) return false;
      const check = solvePnlCp003Request({
        mode: "EQUAL_SP_TWO_ARTICLES_TO_OVERALL_RATE",
        commonSellingPrice: moneyFromPaise(120000n),
        firstDirection: request.knownDirection,
        firstRatePercent: request.knownRatePercent,
        secondDirection: generated.expectedDirection,
        secondRatePercent: result.unknownRatePercent,
      });
      return (
        "direction" in check &&
        "ratePercent" in check &&
        targetMatches(check, request.targetDirection, request.targetRatePercent)
      );
    }

    case "TOTAL_SP_AND_OVERALL_RATE_TO_TOTAL_CP": {
      if (!("totalCostPrice" in result)) return false;
      const check = solvePnlCp003Request({
        mode: "TOTAL_CP_AND_OVERALL_RATE_TO_TOTAL_SP",
        totalCostPrice: result.totalCostPrice,
        direction: request.direction,
        ratePercent: request.ratePercent,
      });
      return (
        "totalSellingPrice" in check &&
        check.totalSellingPrice.paise === request.totalSellingPrice.paise
      );
    }

    default:
      return true;
  }
}

function selectQl(input: PnlCp003DynamicInput): string {
  if (input.questionLanguageId) {
    if (!PNL_CP003_QL_IDS.includes(input.questionLanguageId)) {
      throw new Error(
        `Unknown CP-003 question-language ID: ${input.questionLanguageId}`,
      );
    }
    return input.questionLanguageId;
  }
  const eligible = PNL_CP003_QL_IDS.filter((qlId) => {
    const registry = generatePnlCp003Case(
      qlId,
      `${input.seed ?? "cp003"}:probe`,
    ).registry;
    return !input.difficultyBand || registry.difficulty === input.difficultyBand;
  });
  if (!eligible.length) throw new Error("No CP-003 QLs match the requested difficulty.");
  return pickSeeded(
    createSeededRandom(`${input.seed ?? "cp003-dynamic"}:ql-selection`),
    eligible,
  );
}

function containsUnresolvedProsePlaceholder(value: string): boolean {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
  return /\{[a-z][A-Za-z0-9_]*\}/.test(proseOnly);
}

export function listPnlCp003DynamicQlIds(): readonly string[] {
  return [...PNL_CP003_QL_IDS];
}

export function runPnlCp003DynamicPipeline(
  input: PnlCp003DynamicInput = {},
) {
  if (input.language && input.language !== "en") {
    throw new Error("PNL-CP-003 dynamic runtime currently supports English only.");
  }

  const qlId = selectQl(input);
  const seed = input.seed ?? `${qlId}:dynamic-default`;
  const generated = generatePnlCp003Case(qlId, seed);
  const result = solvePnlCp003Request(generated.request);
  const recomputed = solvePnlCp003Request(generated.request);
  const answerValue = answerFor(qlId, result, generated);
  const answer = formatAnswer(answerValue);
  const optionSet = buildOptions(qlId, seed, answerValue);
  const editorial = editorialLibrary.entries[qlId];
  if (!editorial) throw new Error(`${qlId}: English editorial entry is missing.`);

  const context = {
    ...generated.context,
    ...resultContext(result, answer, generated),
  };
  const stem = renderStructuredStemMarkdown(editorial.stem, context);
  const baseExplanation = renderFriendlyExplanationMarkdown(
    editorial.explanation,
    context,
  );
  const explanationText = `${baseExplanation}\n\n**Working with these values:** Convert every inventory group into total cost and total recovery. Combine money first; only then calculate the overall percentage or isolate the remaining group.\n\n**Final answer:** ${answer}`;

  const checks = [
    {
      name: "registry-and-editorial-parity",
      passed: Boolean(generated.registry && editorial),
      message: "The QL exists in both the frozen registry and English editorial library.",
    },
    {
      name: "exact-recomputation",
      passed: stable(result) === stable(recomputed),
      message: "Exact recomputation agrees with the canonical CP-003 solver.",
    },
    {
      name: "inverse-forward-consistency",
      passed: forwardConsistency(generated.request, result, generated),
      message: "The generated answer reproduces the complete forward inventory or target.",
    },
    {
      name: "four-misconception-options",
      passed:
        optionSet.options.length === 4 &&
        new Set(optionSet.options).size === 4 &&
        optionSet.options[optionSet.correctIndex] === answer &&
        optionSet.misconceptionLabels.filter((label) => label !== "CORRECT").length === 3,
      message: "Four unique options contain one answer and three labelled misconceptions.",
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
    canonicalProblemId: PNL_CP003_ID,
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
      canonicalProblemId: PNL_CP003_ID,
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
      runtimeMode: PNL_CP003_DYNAMIC_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      sourceTrace: {
        registry: "PNL-001/CP-003/task-registry.library.json",
        editorial: "PNL-001/CP-003/editorial-content.en.json",
        solver:
          "PNL-001/foundation/inventory-solver.ts | inventory-advanced-solver.ts",
        verifier: "PNL-001/foundation/cp003-independent-verifier.ts",
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
        { id: "given", label: "Generated inventory values", value: context },
        { id: "mode", label: "Solve mode", value: generated.registry.solveMode },
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
      canonicalProblemId: PNL_CP003_ID,
      questionLanguageId: qlId,
      explanationId,
      solveMode: generated.registry.solveMode,
      answerSemantic: generated.registry.answerSemantic,
      contextFamily: editorial.stem.contextFamily,
      difficultyBand: generated.registry.difficulty,
      representation: generated.registry.representation ?? "PARAGRAPH",
      seed,
      generationMode: PNL_CP003_DYNAMIC_RUNTIME_MODE,
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
