import type {
  MalCp002MisconceptionId,
  MalCp002OptionAudit,
} from "./cp002-authoring-types";
import type { MalCp002Context } from "./cp002-context-library";
import {
  addRational,
  compareRational,
  formatRational,
  rational,
  rationalKey,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import type { MalCp002SolveResult } from "./cp002-types";
import type { Rational } from "./types";

export interface MalCp002OptionPackage {
  options: string[];
  optionAudit: MalCp002OptionAudit[];
  correctIndex: number;
  errors: string[];
}

function pluralUnit(unit: string, value: Rational): string {
  if (unit !== "litres") return unit;
  return value.numerator === value.denominator ? "litre" : "litres";
}

function quantityText(value: Rational, context: MalCp002Context): string {
  return `${formatRational(value)} ${pluralUnit(context.quantityUnit, value)}`;
}

function candidate(
  text: string,
  canonicalKey: string,
  misconceptionId: MalCp002MisconceptionId = "PLAUSIBLE_ARITHMETIC_SLIP",
): MalCp002OptionAudit {
  return {
    text,
    canonicalKey,
    misconceptionId,
    isCorrect: false,
  };
}

function fallbackCandidates(
  result: MalCp002SolveResult,
  context: MalCp002Context,
): MalCp002OptionAudit[] {
  const candidates: MalCp002OptionAudit[] = [];

  if (
    result.kind === "ADJUSTMENT_QUANTITY" ||
    result.kind === "SINGLE_REPLACEMENT_QUANTITY"
  ) {
    for (let offset = 1; offset <= 20; offset += 1) {
      const higher = addRational(result.quantity, rational(offset));
      candidates.push(
        candidate(
          quantityText(higher, context),
          `Q:${rationalKey(higher)}`,
        ),
      );
      const lower = subtractRational(result.quantity, rational(offset));
      if (compareRational(lower, rational(0)) > 0) {
        candidates.push(
          candidate(
            quantityText(lower, context),
            `Q:${rationalKey(lower)}`,
          ),
        );
      }
    }
    return candidates;
  }

  if (result.kind === "COMPONENT_RATIO" || result.kind === "ORIGINAL_RATIO") {
    const [first, second] = reduceRationalRatio(
      result.ratio.componentAPart,
      result.ratio.componentBPart,
    );
    for (let offset = 1; offset <= 20; offset += 1) {
      const changedFirst = addRational(first, rational(offset));
      const [a, b] = reduceRationalRatio(changedFirst, second);
      candidates.push(
        candidate(
          `${formatRational(a)} : ${formatRational(b)}`,
          `R:${rationalKey(a)}:${rationalKey(b)}`,
        ),
      );
      const changedSecond = addRational(second, rational(offset));
      const [c, d] = reduceRationalRatio(first, changedSecond);
      candidates.push(
        candidate(
          `${formatRational(c)} : ${formatRational(d)}`,
          `R:${rationalKey(c)}:${rationalKey(d)}`,
        ),
      );
    }
    return candidates;
  }

  const total = addRational(
    result.componentAQuantity,
    result.componentBQuantity,
  );
  for (let offset = 1; offset <= 20; offset += 1) {
    const offsetValue = rational(offset);
    const firstHigher = addRational(result.componentAQuantity, offsetValue);
    const secondLower = subtractRational(result.componentBQuantity, offsetValue);
    if (compareRational(secondLower, rational(0)) > 0) {
      candidates.push(
        candidate(
          `${quantityText(firstHigher, context)} and ${quantityText(
            secondLower,
            context,
          )}`,
          `P:${rationalKey(firstHigher)}:${rationalKey(secondLower)}`,
        ),
      );
    }

    const firstLower = subtractRational(result.componentAQuantity, offsetValue);
    const secondHigher = subtractRational(total, firstLower);
    if (compareRational(firstLower, rational(0)) > 0) {
      candidates.push(
        candidate(
          `${quantityText(firstLower, context)} and ${quantityText(
            secondHigher,
            context,
          )}`,
          `P:${rationalKey(firstLower)}:${rationalKey(secondHigher)}`,
        ),
      );
    }
  }
  return candidates;
}

export function normalizeMalCp002OptionPackage(
  raw: MalCp002OptionPackage,
  result: MalCp002SolveResult,
  context: MalCp002Context,
): MalCp002OptionPackage {
  const unique: MalCp002OptionAudit[] = [];
  for (const item of raw.optionAudit) {
    if (!unique.some((entry) => entry.canonicalKey === item.canonicalKey)) {
      unique.push(item);
    }
  }

  for (const item of fallbackCandidates(result, context)) {
    if (unique.length >= 4) break;
    if (!unique.some((entry) => entry.canonicalKey === item.canonicalKey)) {
      unique.push(item);
    }
  }

  const finalAudit = unique.slice(0, 4);
  const correctIndex = finalAudit.findIndex((item) => item.isCorrect);
  const errors: string[] = [];
  if (finalAudit.length !== 4) {
    errors.push(`Option normalizer produced ${finalAudit.length} options.`);
  }
  if (new Set(finalAudit.map((item) => item.canonicalKey)).size !== 4) {
    errors.push("Option normalizer retained duplicate canonical answers.");
  }
  if (finalAudit.filter((item) => item.isCorrect).length !== 1) {
    errors.push("Option normalizer does not contain exactly one correct answer.");
  }
  if (correctIndex < 0) {
    errors.push("Option normalizer lost the correct answer.");
  }

  return {
    options: finalAudit.map((item) => item.text),
    optionAudit: finalAudit,
    correctIndex,
    errors,
  };
}
