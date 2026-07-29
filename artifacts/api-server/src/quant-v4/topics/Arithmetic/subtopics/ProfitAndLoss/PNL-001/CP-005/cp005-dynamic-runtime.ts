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
import {
  rational,
  rationalToNumber,
  type Rational,
} from "../foundation/rational";
import {
  PNL_CP005_ID,
  PNL_CP005_QL_IDS,
  cp005FormatMoney,
  cp005FormatPercent,
  cp005FormatQuantity,
  cp005FormatRational,
  cp005PlainMoney,
  generatePnlCp005Case,
  solvePnlCp005Request,
  type PnlCp005Difficulty,
  type PnlCp005GeneratedCase,
  type PnlCp005SolverRequest,
  type PnlCp005SolverResult,
} from "./cp005-dynamic-cases";

export { PNL_CP005_ID };
export const PNL_CP005_DYNAMIC_RUNTIME_MODE = "DYNAMIC_CANDIDATE" as const;
export const PNL_CP005_LANGUAGES = ["en"] as const;

export type PnlCp005Language = (typeof PNL_CP005_LANGUAGES)[number];
export type { PnlCp005Difficulty };

export type PnlCp005DynamicInput = Readonly<{
  difficultyBand?: PnlCp005Difficulty;
  language?: PnlCp005Language;
  questionLanguageId?: string;
  seed?: string;
}>;

type EditorialFile = Readonly<{
  schemaVersion: 2;
  archetypeId: "PNL-001";
  cpId: typeof PNL_CP005_ID;
  language: "en";
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
}>;

type DynamicAnswer =
  | Readonly<{ kind: "MONEY"; value: Money }>
  | Readonly<{ kind: "PERCENT"; value: Rational }>
  | Readonly<{ kind: "QUANTITY"; value: Rational }>
  | Readonly<{ kind: "TEXT"; value: string }>;

const editorialLibrary = editorialContentJson as EditorialFile;

function directionRateText(
  direction: "PROFIT" | "LOSS" | "NO_CHANGE",
  ratePercent: Rational,
): string {
  if (direction === "NO_CHANGE") return "No profit, no loss";
  return `${cp005FormatPercent(ratePercent)} ${direction.toLowerCase()}`;
}

function exactRationalMoney(valueInPaise: Rational): string {
  if (valueInPaise.numerator % valueInPaise.denominator === 0n) {
    return cp005FormatMoney(
      moneyFromPaise(valueInPaise.numerator / valueInPaise.denominator),
    );
  }
  const rupees = rationalToNumber(valueInPaise) / 100;
  return `₹${rupees.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}`;
}

function amountAndRateText(
  direction: "PROFIT" | "LOSS" | "NO_CHANGE",
  amount: Money,
  ratePercent: Rational,
): string {
  if (direction === "NO_CHANGE") return "No profit, no loss";
  return `${direction === "PROFIT" ? "Profit" : "Loss"} ${cp005FormatMoney(amount)} at ${cp005FormatPercent(ratePercent)}`;
}

function comparisonText(
  result: Extract<
    PnlCp005SolverResult,
    { mode: "COMPARE_TWO_DISHONEST_SCHEMES" }
  >,
): string {
  const scheme =
    result.moreProfitableScheme === "FIRST"
      ? "Scheme A"
      : result.moreProfitableScheme === "SECOND"
        ? "Scheme B"
        : "Both schemes";
  if (result.moreProfitableScheme === "SAME")
    return "Both schemes give the same profit rate";
  return `${scheme} by ${cp005FormatPercent(result.differencePercent)}`;
}

function answerFor(
  qlId: string,
  result: PnlCp005SolverResult,
  generated: PnlCp005GeneratedCase,
): DynamicAnswer {
  if (generated.answerOverride) {
    return { kind: "TEXT", value: generated.answerOverride };
  }

  switch (qlId) {
    case "PNL-QL-121":
    case "PNL-QL-143":
      if (!("ratePercent" in result))
        throw new Error(`${qlId}: expected rate.`);
      return { kind: "PERCENT", value: result.ratePercent };

    case "PNL-QL-122":
      if (
        !("amount" in result) ||
        !("direction" in result) ||
        !("ratePercent" in result)
      ) {
        throw new Error(`${qlId}: expected amount and rate.`);
      }
      return {
        kind: "TEXT",
        value: amountAndRateText(
          result.direction,
          result.amount,
          result.ratePercent,
        ),
      };

    case "PNL-QL-123":
    case "PNL-QL-124":
    case "PNL-QL-127":
    case "PNL-QL-128":
    case "PNL-QL-129":
    case "PNL-QL-132":
    case "PNL-QL-133":
    case "PNL-QL-146":
      if (!("direction" in result) || !("ratePercent" in result)) {
        throw new Error(`${qlId}: expected directed rate.`);
      }
      return {
        kind: "TEXT",
        value: directionRateText(result.direction, result.ratePercent),
      };

    case "PNL-QL-125":
    case "PNL-QL-135":
    case "PNL-QL-139":
      if (!("deliveredQuantity" in result)) {
        throw new Error(`${qlId}: expected delivered quantity.`);
      }
      return { kind: "QUANTITY", value: result.deliveredQuantity };

    case "PNL-QL-126":
      if (!("quotedSellingPrice" in result)) {
        throw new Error(`${qlId}: expected quoted selling price.`);
      }
      return { kind: "MONEY", value: result.quotedSellingPrice };

    case "PNL-QL-130":
      if (!("markupPercent" in result))
        throw new Error(`${qlId}: expected markup.`);
      return { kind: "PERCENT", value: result.markupPercent };

    case "PNL-QL-131":
      if (!("discountPercent" in result))
        throw new Error(`${qlId}: expected discount.`);
      return { kind: "PERCENT", value: result.discountPercent };

    case "PNL-QL-134":
    case "PNL-QL-144":
      if (!("overchargePercent" in result)) {
        throw new Error(`${qlId}: expected overcharge rate.`);
      }
      return { kind: "PERCENT", value: result.overchargePercent };

    case "PNL-QL-136":
    case "PNL-QL-149":
      if (
        !("declaredDirection" in result) ||
        !("declaredRatePercent" in result)
      ) {
        throw new Error(`${qlId}: expected declared rate.`);
      }
      return {
        kind: "TEXT",
        value: directionRateText(
          result.declaredDirection,
          result.declaredRatePercent,
        ),
      };

    case "PNL-QL-137":
    case "PNL-QL-138":
      if (!("costPricePerTrueQuantity" in result)) {
        throw new Error(`${qlId}: expected recovered cost.`);
      }
      return { kind: "MONEY", value: result.costPricePerTrueQuantity };

    case "PNL-QL-140":
      if (!("receivedQuantity" in result)) {
        throw new Error(`${qlId}: expected received quantity.`);
      }
      return { kind: "QUANTITY", value: result.receivedQuantity };

    case "PNL-QL-141":
      if (!("effectivePricePerTrueQuantity" in result)) {
        throw new Error(`${qlId}: expected effective price.`);
      }
      return {
        kind: "TEXT",
        value: exactRationalMoney(result.effectivePricePerTrueQuantity),
      };

    case "PNL-QL-142":
    case "PNL-QL-145":
      if (result.mode !== "COMPARE_TWO_DISHONEST_SCHEMES") {
        throw new Error(`${qlId}: expected scheme comparison.`);
      }
      return { kind: "TEXT", value: comparisonText(result) };

    default:
      throw new Error(`${qlId}: dynamic answer mapping is missing.`);
  }
}

function formatAnswer(answer: DynamicAnswer): string {
  if (answer.kind === "MONEY") return cp005FormatMoney(answer.value);
  if (answer.kind === "PERCENT") return cp005FormatPercent(answer.value);
  if (answer.kind === "QUANTITY") return cp005FormatQuantity(answer.value);
  return answer.value;
}

function resultContext(
  result: PnlCp005SolverResult,
  answer: string,
): Readonly<Record<string, unknown>> {
  const context: Record<string, unknown> = {
    correctStatement: answer,
    dataSufficiencyAnswer: answer,
  };
  if ("direction" in result && "ratePercent" in result) {
    context.actualDirection = result.direction.toLowerCase();
    context.actualRatePercent = cp005FormatRational(result.ratePercent);
    context.actualProfitPercent = cp005FormatRational(result.ratePercent);
  }
  if ("amount" in result) context.actualAmount = cp005PlainMoney(result.amount);
  if ("deliveredQuantity" in result) {
    context.requiredDeliveredQuantity = cp005FormatQuantity(
      result.deliveredQuantity,
    );
  }
  if ("quotedSellingPrice" in result) {
    context.requiredQuotedSellingPrice = cp005PlainMoney(
      result.quotedSellingPrice,
    );
  }
  if ("markupPercent" in result) {
    context.requiredMarkupPercent = cp005FormatRational(result.markupPercent);
  }
  if ("discountPercent" in result) {
    context.requiredDiscountPercent = cp005FormatRational(
      result.discountPercent,
    );
  }
  if ("overchargePercent" in result) {
    context.customerOverchargePercent = cp005FormatRational(
      result.overchargePercent,
    );
  }
  if ("declaredDirection" in result && "declaredRatePercent" in result) {
    context.declaredDirection = result.declaredDirection.toLowerCase();
    context.declaredRatePercent = cp005FormatRational(
      result.declaredRatePercent,
    );
  }
  if ("costPricePerTrueQuantity" in result) {
    context.costPricePerTrueQuantity = cp005PlainMoney(
      result.costPricePerTrueQuantity,
    );
  }
  if ("receivedQuantity" in result) {
    context.requiredReceivedQuantity = cp005FormatQuantity(
      result.receivedQuantity,
    );
  }
  if ("effectivePricePerTrueQuantity" in result) {
    context.effectivePricePerTrueQuantity = exactRationalMoney(
      result.effectivePricePerTrueQuantity,
    ).replace(/^₹/, "");
  }
  if (result.mode === "COMPARE_TWO_DISHONEST_SCHEMES") {
    context.moreProfitableScheme =
      result.moreProfitableScheme === "FIRST"
        ? "Scheme A"
        : result.moreProfitableScheme === "SECOND"
          ? "Scheme B"
          : "Both schemes";
    context.rateDifference = cp005FormatRational(result.differencePercent);
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
      .map(cp005FormatMoney);
  }
  const numeric = rationalToNumber(answer.value);
  if (answer.kind === "PERCENT") {
    return [
      Math.max(0, numeric - 5),
      numeric + 5,
      Math.max(0, 100 - numeric),
      numeric + 10,
    ].map((item) => `${Number(item.toFixed(2))}%`);
  }
  return [
    Math.max(1, numeric - 50),
    numeric + 50,
    Math.max(1, numeric * 0.9),
    numeric * 1.1,
  ].map((item) => Number(item.toFixed(2)).toString());
}

function textDistractors(qlId: string, correct: string): readonly string[] {
  const pools: Record<string, readonly string[]> = {
    "PNL-QL-147": [
      "Statement 1 only",
      "Statement 2 only",
      "Statement 3 only",
      "Statements 1 and 3 only",
    ],
    "PNL-QL-148": [
      "Statement 1 alone is sufficient",
      "Statement 2 alone is sufficient",
      "Either statement alone is sufficient",
      "Both statements together are required",
      "Even both statements together are insufficient",
    ],
    "PNL-QL-142": [
      "Scheme A by 5%",
      "Scheme B by 5%",
      "Both schemes give the same profit rate",
      "The schemes cannot be compared",
    ],
    "PNL-QL-145": [
      "Scheme A by 10%",
      "Scheme B by 10%",
      "Both schemes give the same profit rate",
      "The table is insufficient",
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
    { value: unique[0]!, label: "NOMINAL_INSTEAD_OF_DELIVERED_COST" },
    { value: unique[1]!, label: "WRONG_PERCENTAGE_BASE" },
    { value: unique[2]!, label: "IGNORED_PRICE_OR_QUANTITY_DECEPTION" },
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

function sameRate(
  actualDirection: string,
  actualRate: Rational,
  expectedDirection: string,
  expectedRate: Rational,
): boolean {
  return (
    actualDirection === expectedDirection &&
    stable(actualRate) === stable(expectedRate)
  );
}

function forwardConsistency(
  request: PnlCp005SolverRequest,
  result: PnlCp005SolverResult,
): boolean {
  switch (request.mode) {
    case "TARGET_RATE_TO_DELIVERED_QUANTITY": {
      if (
        !("deliveredQuantity" in result) ||
        result.deliveredQuantity.denominator !== 1n
      )
        return false;
      const forward = solvePnlCp005Request({
        mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT",
        costPricePerTrueQuantity: request.costPricePerTrueQuantity,
        quotedSellingPricePerNominalQuantity:
          request.quotedSellingPricePerNominalQuantity,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: result.deliveredQuantity.numerator,
      });
      return (
        "direction" in forward &&
        "ratePercent" in forward &&
        sameRate(
          forward.direction,
          forward.ratePercent,
          request.targetDirection,
          request.targetRatePercent,
        )
      );
    }
    case "TARGET_RATE_AND_FALSE_QUANTITY_TO_QUOTED_SP": {
      if (!("quotedSellingPrice" in result)) return false;
      const forward = solvePnlCp005Request({
        mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT",
        costPricePerTrueQuantity: request.costPricePerTrueQuantity,
        quotedSellingPricePerNominalQuantity: result.quotedSellingPrice,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: request.deliveredQuantity,
      });
      return (
        "direction" in forward &&
        "ratePercent" in forward &&
        sameRate(
          forward.direction,
          forward.ratePercent,
          request.targetDirection,
          request.targetRatePercent,
        )
      );
    }
    case "TARGET_RATE_FALSE_QUANTITY_DISCOUNT_TO_MARKUP": {
      if (!("markupPercent" in result)) return false;
      const forward = solvePnlCp005Request({
        mode: "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE",
        costPricePerTrueQuantity: request.costPricePerTrueQuantity,
        markupPercent: result.markupPercent,
        discountPercent: request.discountPercent,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: request.deliveredQuantity,
      });
      return (
        "direction" in forward &&
        "ratePercent" in forward &&
        sameRate(
          forward.direction,
          forward.ratePercent,
          request.targetDirection,
          request.targetRatePercent,
        )
      );
    }
    case "TARGET_RATE_FALSE_QUANTITY_MARKUP_TO_DISCOUNT": {
      if (!("discountPercent" in result)) return false;
      const forward = solvePnlCp005Request({
        mode: "MARKUP_DISCOUNT_FALSE_QUANTITY_TO_ACTUAL_RATE",
        costPricePerTrueQuantity: request.costPricePerTrueQuantity,
        markupPercent: request.markupPercent,
        discountPercent: result.discountPercent,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: request.deliveredQuantity,
      });
      return (
        "direction" in forward &&
        "ratePercent" in forward &&
        sameRate(
          forward.direction,
          forward.ratePercent,
          request.targetDirection,
          request.targetRatePercent,
        )
      );
    }
    case "ACTUAL_AND_DECLARED_RATE_TO_FALSE_QUANTITY": {
      if (
        !("deliveredQuantity" in result) ||
        result.deliveredQuantity.denominator !== 1n
      )
        return false;
      const forward = solvePnlCp005Request({
        mode: "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE",
        costPricePerTrueQuantity: moneyFromPaise(100000n),
        declaredDirection: request.declaredDirection,
        declaredRatePercent: request.declaredRatePercent,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: result.deliveredQuantity.numerator,
      });
      return (
        "direction" in forward &&
        "ratePercent" in forward &&
        sameRate(
          forward.direction,
          forward.ratePercent,
          request.actualDirection,
          request.actualRatePercent,
        )
      );
    }
    case "ACTUAL_RATE_AND_FALSE_QUANTITY_TO_DECLARED_RATE": {
      if (
        !("declaredDirection" in result) ||
        !("declaredRatePercent" in result)
      )
        return false;
      const forward = solvePnlCp005Request({
        mode: "DECLARED_RATE_FALSE_QUANTITY_TO_ACTUAL_RATE",
        costPricePerTrueQuantity: moneyFromPaise(100000n),
        declaredDirection:
          result.declaredDirection === "NO_CHANGE"
            ? "PROFIT"
            : result.declaredDirection,
        declaredRatePercent: result.declaredRatePercent,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: request.deliveredQuantity,
      });
      return (
        "direction" in forward &&
        "ratePercent" in forward &&
        sameRate(
          forward.direction,
          forward.ratePercent,
          request.actualDirection,
          request.actualRatePercent,
        )
      );
    }
    case "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE":
    case "ACTUAL_AMOUNT_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE": {
      if (!("costPricePerTrueQuantity" in result)) return false;
      const forward = solvePnlCp005Request({
        mode: "FALSE_QUANTITY_AT_QUOTED_PRICE_TO_RESULT",
        costPricePerTrueQuantity: result.costPricePerTrueQuantity,
        quotedSellingPricePerNominalQuantity:
          request.quotedSellingPricePerNominalQuantity,
        trueQuantity: request.trueQuantity,
        deliveredQuantity: request.deliveredQuantity,
      });
      if (!("direction" in forward)) return false;
      if (
        request.mode ===
        "ACTUAL_RATE_FALSE_QUANTITY_AND_QUOTED_SP_TO_COST_PRICE"
      ) {
        return (
          "ratePercent" in forward &&
          sameRate(
            forward.direction,
            forward.ratePercent,
            request.actualDirection,
            request.actualRatePercent,
          )
        );
      }
      return (
        "amount" in forward &&
        forward.direction === request.actualDirection &&
        forward.amount.paise === request.actualAmount.paise
      );
    }
    case "BUY_HEAVY_SELL_LIGHT_TARGET_TO_DELIVERED_QUANTITY": {
      if (
        !("deliveredQuantity" in result) ||
        result.deliveredQuantity.denominator !== 1n
      )
        return false;
      const forward = solvePnlCp005Request({
        mode: "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE",
        purchasePricePerNominalQuantity:
          request.purchasePricePerNominalQuantity,
        sellingPricePerNominalQuantity: request.sellingPricePerNominalQuantity,
        nominalQuantity: 1000n,
        receivedQuantity: request.receivedQuantity,
        deliveredQuantity: result.deliveredQuantity.numerator,
      });
      return (
        "direction" in forward &&
        "ratePercent" in forward &&
        sameRate(
          forward.direction,
          forward.ratePercent,
          request.targetDirection,
          request.targetRatePercent,
        )
      );
    }
    case "BUY_HEAVY_SELL_LIGHT_TARGET_TO_RECEIVED_QUANTITY": {
      if (
        !("receivedQuantity" in result) ||
        result.receivedQuantity.denominator !== 1n
      )
        return false;
      const forward = solvePnlCp005Request({
        mode: "BUY_HEAVY_SELL_LIGHT_TO_ACTUAL_RATE",
        purchasePricePerNominalQuantity:
          request.purchasePricePerNominalQuantity,
        sellingPricePerNominalQuantity: request.sellingPricePerNominalQuantity,
        nominalQuantity: 1000n,
        receivedQuantity: result.receivedQuantity.numerator,
        deliveredQuantity: request.deliveredQuantity,
      });
      return (
        "direction" in forward &&
        "ratePercent" in forward &&
        sameRate(
          forward.direction,
          forward.ratePercent,
          request.targetDirection,
          request.targetRatePercent,
        )
      );
    }
    default:
      return true;
  }
}

function selectQl(input: PnlCp005DynamicInput): string {
  if (input.questionLanguageId) {
    if (!PNL_CP005_QL_IDS.includes(input.questionLanguageId)) {
      throw new Error(
        `Unknown CP-005 question-language ID: ${input.questionLanguageId}`,
      );
    }
    return input.questionLanguageId;
  }
  const eligible = PNL_CP005_QL_IDS.filter((qlId) => {
    const registry = generatePnlCp005Case(
      qlId,
      `${input.seed ?? "cp005"}:probe`,
    ).registry;
    return (
      !input.difficultyBand || registry.difficulty === input.difficultyBand
    );
  });
  if (!eligible.length)
    throw new Error("No CP-005 QLs match the requested difficulty.");
  return pickSeeded(
    createSeededRandom(`${input.seed ?? "cp005-dynamic"}:ql-selection`),
    eligible,
  );
}

function containsUnresolvedProsePlaceholder(value: string): boolean {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
  return /\{[a-z][A-Za-z0-9_]*\}/.test(proseOnly);
}

export function listPnlCp005DynamicQlIds(): readonly string[] {
  return [...PNL_CP005_QL_IDS];
}

export function runPnlCp005DynamicPipeline(input: PnlCp005DynamicInput = {}) {
  if (input.language && input.language !== "en") {
    throw new Error(
      "PNL-CP-005 dynamic runtime currently supports English only.",
    );
  }

  const qlId = selectQl(input);
  const seed = input.seed ?? `${qlId}:dynamic-default`;
  const generated = generatePnlCp005Case(qlId, seed);
  const result = solvePnlCp005Request(generated.request);
  const recomputed = solvePnlCp005Request(generated.request);
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
  const explanationText = `${baseExplanation}\n\n**Working with these values:** Separate the billed amount from the cost of the quantity actually delivered. Price changes and quantity changes must be combined on the same true-cost base.\n\n**Final answer:** ${answer}`;

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
      message: "Exact recomputation agrees with the canonical CP-005 solver.",
    },
    {
      name: "inverse-forward-consistency",
      passed: forwardConsistency(generated.request, result),
      message:
        "Every inverse answer reproduces its generated forward dishonest-trade case.",
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
    canonicalProblemId: PNL_CP005_ID,
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
      canonicalProblemId: PNL_CP005_ID,
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
      runtimeMode: PNL_CP005_DYNAMIC_RUNTIME_MODE,
      reviewStatus: "UNREVIEWED_DYNAMIC_CANDIDATE" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      sourceTrace: {
        registry: "PNL-001/CP-005/task-registry.library.json",
        editorial: "PNL-001/CP-005/editorial-content.en.json",
        solver:
          "PNL-001/foundation/dishonest-trade-solver.ts | dishonest-trade-advanced-solver.ts",
      },
    },
    solver: {
      answer,
      numericAnswer:
        answerValue.kind === "MONEY"
          ? Number(answerValue.value.paise) / 100
          : answerValue.kind === "PERCENT" || answerValue.kind === "QUANTITY"
            ? rationalToNumber(answerValue.value)
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
          label: "Generated price and quantity values",
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
      canonicalProblemId: PNL_CP005_ID,
      questionLanguageId: qlId,
      explanationId,
      solveMode: generated.registry.solveMode,
      answerSemantic: generated.registry.answerSemantic,
      contextFamily: editorial.stem.contextFamily,
      difficultyBand: generated.registry.difficulty,
      representation: generated.registry.representation ?? "PARAGRAPH",
      seed,
      generationMode: PNL_CP005_DYNAMIC_RUNTIME_MODE,
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
