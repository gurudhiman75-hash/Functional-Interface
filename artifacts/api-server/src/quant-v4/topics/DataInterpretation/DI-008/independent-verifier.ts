import { ratioDisplay } from "../DI-001/exact";
import type { Di008Question, Di008QuestionSet, Di008Row } from "./types";

function displayQuotient(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new Error("DI-008 independent verifier received an invalid rational state.");
  }
  const negative = numerator < 0;
  const n = BigInt(Math.abs(numerator));
  const d = BigInt(denominator);
  const hundredths = (n * 100n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  const sign = negative ? "-" : "";
  if (fraction === 0) return `${sign}${whole}`;
  if (fraction % 10 === 0) return `${sign}${whole}.${fraction / 10}`;
  return `${sign}${whole}.${String(fraction).padStart(2, "0")}`;
}

function percent(numerator: number, denominator: number): string {
  return `${displayQuotient(numerator * 100, denominator)}%`;
}

function unitTotal(rows: readonly Di008Row[], indices: readonly number[], current: boolean): number {
  return indices.reduce((total, index) => total + (current ? rows[index]!.unitsCurrent : rows[index]!.unitsPrevious), 0);
}

function revenue(rows: readonly Di008Row[], indices: readonly number[]): number {
  return indices.reduce((total, index) => total + rows[index]!.unitsCurrent * rows[index]!.sellingPricePerUnit, 0);
}

function cost(rows: readonly Di008Row[], indices: readonly number[]): number {
  return indices.reduce((total, index) => total + rows[index]!.unitsCurrent * rows[index]!.costPerUnit, 0);
}

export function independentlySolveDi008Question(set: Di008QuestionSet, question: Di008Question): string {
  const rows = set.stimulus.rows;
  const primary = question.evidence.primaryIndices;
  const secondary = question.evidence.secondaryIndices ?? [];

  switch (question.kind) {
    case "UNITS_PERCENT_CHANGE": {
      const oldUnits = unitTotal(rows, primary, false);
      const newUnits = unitTotal(rows, primary, true);
      return percent(newUnits - oldUnits, oldUnits);
    }
    case "REVENUE_RATIO":
      return ratioDisplay(revenue(rows, primary), revenue(rows, secondary));
    case "PROFIT_PERCENT": {
      const totalCost = cost(rows, primary);
      const totalProfit = revenue(rows, primary) - totalCost;
      return percent(totalProfit, totalCost);
    }
    case "AVERAGE_PROFIT_PER_PRODUCT": {
      const totalProfit = revenue(rows, primary) - cost(rows, primary);
      return `₹${displayQuotient(totalProfit, primary.length)}`;
    }
    case "REVENUE_SHARE_OF_TOTAL": {
      const allIndices = rows.map((_, index) => index);
      return percent(revenue(rows, primary), revenue(rows, allIndices));
    }
  }
}

export function independentlyVerifyDi008QuestionSet(set: Di008QuestionSet): boolean {
  if (set.packageId !== "DI-008" || set.stimulus.kind !== "ARITHMETIC_TABLE") return false;
  if (set.stimulus.rows.length !== 5 || set.questions.length !== 5 || set.optionCount !== 5) return false;
  if (new Set(set.questions.map((question) => question.kind)).size !== 5) return false;
  if (!set.stimulus.rows.every((row) => row.unitsCurrent > row.unitsPrevious && row.sellingPricePerUnit > row.costPerUnit)) return false;

  return set.questions.every((question) => {
    const expected = independentlySolveDi008Question(set, question);
    return (
      expected === question.answer &&
      question.options.length === 5 &&
      new Set(question.options).size === 5 &&
      question.options.filter((option) => option === expected).length === 1 &&
      question.options[question.correctIndex] === expected &&
      question.optionMetadata[question.correctIndex]?.misconceptionId === "CORRECT"
    );
  });
}