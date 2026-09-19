import { ratioDisplay } from "../DI-001/exact";
import type { Di008V2QuestionSet, Di008V2Row } from "./arithmetic-v2-types";

function formatQuotient(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) return "INVALID";
  const sign = numerator < 0 ? -1n : 1n;
  const n = BigInt(Math.abs(numerator));
  const d = BigInt(denominator);
  const hundredths = (n * 100n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  const prefix = sign < 0n ? "-" : "";
  if (fraction === 0) return prefix + String(whole);
  if (fraction % 10 === 0) return prefix + String(whole) + "." + String(fraction / 10);
  return prefix + String(whole) + "." + String(fraction).padStart(2, "0");
}

function percent(numerator: number, denominator: number): string {
  return formatQuotient(numerator * 100, denominator) + "%";
}

function cost(row: Di008V2Row): number {
  return row.unitsCurrent * row.costPerUnit;
}

function revenue(row: Di008V2Row): number {
  return row.unitsCurrent * row.sellingPricePerUnit;
}

function selected(rows: readonly Di008V2Row[], indices: readonly number[]) {
  return indices.map((index) => rows[index]!);
}

function units(rows: readonly Di008V2Row[], indices: readonly number[], key: "unitsPrevious" | "unitsCurrent"): number {
  return selected(rows, indices).reduce((sum, row) => sum + row[key], 0);
}

function totalCost(rows: readonly Di008V2Row[], indices: readonly number[]): number {
  return selected(rows, indices).reduce((sum, row) => sum + cost(row), 0);
}

function totalRevenue(rows: readonly Di008V2Row[], indices: readonly number[]): number {
  return selected(rows, indices).reduce((sum, row) => sum + revenue(row), 0);
}

function totalProfit(rows: readonly Di008V2Row[], indices: readonly number[]): number {
  return totalRevenue(rows, indices) - totalCost(rows, indices);
}

export function independentlyVerifyDi008V2Set(set: Di008V2QuestionSet): boolean {
  const rows = set.stimulus.rows;
  if (rows.length !== 5 || set.questions.length !== 5) return false;

  for (const question of set.questions) {
    const primary = question.evidence.primaryIndices;
    const secondary = question.evidence.secondaryIndices ?? [];
    let answer = "";

    switch (question.kind) {
      case "UNIT_INCREASE":
        answer = String(units(rows, primary, "unitsCurrent") - units(rows, primary, "unitsPrevious"));
        break;
      case "REVENUE_AMOUNT":
        answer = "\u20b9" + formatQuotient(totalRevenue(rows, primary), 1);
        break;
      case "PERCENT_CHANGE":
      case "COMBINED_PERCENT_CHANGE": {
        const previous = units(rows, primary, "unitsPrevious");
        const current = units(rows, primary, "unitsCurrent");
        answer = percent(current - previous, previous);
        break;
      }
      case "PROFIT_AMOUNT":
        answer = "\u20b9" + formatQuotient(totalProfit(rows, primary), 1);
        break;
      case "PROFIT_PERCENT":
      case "COMBINED_PROFIT_PERCENT":
        answer = percent(totalProfit(rows, primary), totalCost(rows, primary));
        break;
      case "REVENUE_SHARE":
        answer = percent(totalRevenue(rows, primary), totalRevenue(rows, [0, 1, 2, 3, 4]));
        break;
      case "PROFIT_RATIO":
        if (!secondary.length) return false;
        answer = ratioDisplay(totalProfit(rows, primary), totalProfit(rows, secondary));
        break;
      case "AVERAGE_PROFIT":
        answer = "\u20b9" + formatQuotient(totalProfit(rows, primary), primary.length);
        break;
      case "GROUP_REVENUE_RATIO":
        if (!secondary.length) return false;
        answer = ratioDisplay(totalRevenue(rows, primary), totalRevenue(rows, secondary));
        break;
      case "WEIGHTED_AVERAGE_SELLING_PRICE":
        answer = "\u20b9" + formatQuotient(totalRevenue(rows, primary), units(rows, primary, "unitsCurrent"));
        break;
    }

    if (answer !== question.answer) return false;
    if (question.options[question.correctIndex] !== question.answer) return false;
    if (question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length !== 1) return false;
  }

  return true;
}
