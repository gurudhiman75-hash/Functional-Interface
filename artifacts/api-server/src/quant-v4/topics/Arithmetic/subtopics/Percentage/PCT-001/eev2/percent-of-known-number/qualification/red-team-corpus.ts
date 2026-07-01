import type { EEV2DetailMode } from "../../../../../../../../common/eev2/contracts";

export type RedTeamCategory =
  | "ABSURD_CONTEXT"
  | "FRACTIONAL_HUMANS"
  | "UGLY_DECIMALS"
  | "MONEY_REALISM"
  | "EXTREME_PERCENTAGES"
  | "EQUAL_RATES"
  | "LARGE_VALUES"
  | "VERY_SMALL_VALUES"
  | "TEMPLATE_FATIGUE"
  | "WEAK_STUDENT";

export type RedTeamContextKind =
  | "abstract"
  | "count"
  | "money"
  | "measure"
  | "event";

export interface RedTeamCorpusItem {
  redTeamId: string;
  category: RedTeamCategory;
  knownRate: number;
  knownValue: number;
  targetRate: number;
  detailMode: EEV2DetailMode;
  contextKind: RedTeamContextKind;
  contextLabel: string;
  semanticUnit: string;
  weakStudent: boolean;
}

type CaseInput = Omit<RedTeamCorpusItem, "redTeamId" | "category">;

function cases(
  category: RedTeamCategory,
  inputs: readonly CaseInput[],
): readonly RedTeamCorpusItem[] {
  return inputs.map((input, index) => ({
    redTeamId: `QUAL-001-C:${category}:${String(index + 1).padStart(2, "0")}`,
    category,
    ...input,
  }));
}

const absurdContexts = cases("ABSURD_CONTEXT", [
  { knownRate: 5, knownValue: 250, targetRate: 60, detailMode: "standard", contextKind: "event", contextLabel: "votes cast", semanticUnit: "votes", weakStudent: false },
  { knownRate: 3, knownValue: 18, targetRate: 12, detailMode: "detailed", contextKind: "event", contextLabel: "marriages", semanticUnit: "marriages", weakStudent: false },
  { knownRate: 2, knownValue: 14, targetRate: 9, detailMode: "short", contextKind: "event", contextLabel: "accidents", semanticUnit: "accidents", weakStudent: false },
  { knownRate: 1, knownValue: 7, targetRate: 4, detailMode: "standard", contextKind: "event", contextLabel: "deaths", semanticUnit: "deaths", weakStudent: false },
  { knownRate: 4, knownValue: 20, targetRate: 11, detailMode: "detailed", contextKind: "event", contextLabel: "births", semanticUnit: "births", weakStudent: false },
  { knownRate: 99, knownValue: 990, targetRate: 100, detailMode: "short", contextKind: "count", contextLabel: "students present", semanticUnit: "students", weakStudent: false },
  { knownRate: 2, knownValue: 6, targetRate: 75, detailMode: "standard", contextKind: "count", contextLabel: "families surveyed", semanticUnit: "families", weakStudent: false },
  { knownRate: 5, knownValue: 25, targetRate: 80, detailMode: "detailed", contextKind: "count", contextLabel: "workers employed", semanticUnit: "workers", weakStudent: false },
  { knownRate: 1, knownValue: 3, targetRate: 50, detailMode: "short", contextKind: "count", contextLabel: "books sold", semanticUnit: "books", weakStudent: false },
  { knownRate: 2, knownValue: 8, targetRate: 90, detailMode: "standard", contextKind: "count", contextLabel: "trees surviving", semanticUnit: "trees", weakStudent: false },
  { knownRate: 150, knownValue: 300, targetRate: 200, detailMode: "detailed", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: false },
  { knownRate: 200, knownValue: 600, targetRate: 250, detailMode: "short", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: false },
  { knownRate: 0.5, knownValue: 2, targetRate: 3.5, detailMode: "standard", contextKind: "event", contextLabel: "accidents", semanticUnit: "accidents", weakStudent: false },
  { knownRate: 0.25, knownValue: 1, targetRate: 2, detailMode: "detailed", contextKind: "event", contextLabel: "marriages", semanticUnit: "marriages", weakStudent: false },
  { knownRate: 98, knownValue: 49, targetRate: 99, detailMode: "short", contextKind: "count", contextLabel: "families affected", semanticUnit: "families", weakStudent: false },
  { knownRate: 7, knownValue: 21, targetRate: 93, detailMode: "standard", contextKind: "event", contextLabel: "complaints resolved", semanticUnit: "complaints", weakStudent: false },
  { knownRate: 6, knownValue: 12, targetRate: 94, detailMode: "detailed", contextKind: "event", contextLabel: "cases reported", semanticUnit: "cases", weakStudent: false },
  { knownRate: 4, knownValue: 16, targetRate: 96, detailMode: "short", contextKind: "event", contextLabel: "incidents recorded", semanticUnit: "incidents", weakStudent: false },
  { knownRate: 3, knownValue: 9, targetRate: 97, detailMode: "standard", contextKind: "event", contextLabel: "applications rejected", semanticUnit: "applications", weakStudent: false },
  { knownRate: 2, knownValue: 10, targetRate: 98, detailMode: "detailed", contextKind: "event", contextLabel: "patients discharged", semanticUnit: "patients", weakStudent: false },
]);

const fractionalHumans = cases("FRACTIONAL_HUMANS", [
  { knownRate: 20, knownValue: 47, targetRate: 35, detailMode: "standard", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: false },
  { knownRate: 30, knownValue: 71, targetRate: 25, detailMode: "detailed", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: false },
  { knownRate: 40, knownValue: 93, targetRate: 15, detailMode: "short", contextKind: "count", contextLabel: "families", semanticUnit: "families", weakStudent: false },
  { knownRate: 12, knownValue: 31, targetRate: 19, detailMode: "standard", contextKind: "count", contextLabel: "employees", semanticUnit: "employees", weakStudent: false },
  { knownRate: 18, knownValue: 43, targetRate: 27, detailMode: "detailed", contextKind: "count", contextLabel: "people", semanticUnit: "people", weakStudent: false },
  { knownRate: 25, knownValue: 62, targetRate: 17, detailMode: "short", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: true },
  { knownRate: 35, knownValue: 81, targetRate: 22, detailMode: "standard", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: true },
  { knownRate: 45, knownValue: 109, targetRate: 13, detailMode: "detailed", contextKind: "count", contextLabel: "families", semanticUnit: "families", weakStudent: true },
  { knownRate: 55, knownValue: 137, targetRate: 21, detailMode: "short", contextKind: "count", contextLabel: "employees", semanticUnit: "employees", weakStudent: true },
  { knownRate: 65, knownValue: 159, targetRate: 29, detailMode: "standard", contextKind: "count", contextLabel: "people", semanticUnit: "people", weakStudent: true },
  { knownRate: 15, knownValue: 19, targetRate: 8, detailMode: "detailed", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: false },
  { knownRate: 22, knownValue: 27, targetRate: 9, detailMode: "short", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: false },
  { knownRate: 28, knownValue: 33, targetRate: 11, detailMode: "standard", contextKind: "count", contextLabel: "families", semanticUnit: "families", weakStudent: false },
  { knownRate: 32, knownValue: 39, targetRate: 14, detailMode: "detailed", contextKind: "count", contextLabel: "employees", semanticUnit: "employees", weakStudent: false },
  { knownRate: 38, knownValue: 45, targetRate: 16, detailMode: "short", contextKind: "count", contextLabel: "people", semanticUnit: "people", weakStudent: false },
  { knownRate: 42, knownValue: 51, targetRate: 18, detailMode: "standard", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: false },
  { knownRate: 48, knownValue: 57, targetRate: 23, detailMode: "detailed", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: false },
  { knownRate: 52, knownValue: 63, targetRate: 26, detailMode: "short", contextKind: "count", contextLabel: "families", semanticUnit: "families", weakStudent: false },
  { knownRate: 58, knownValue: 69, targetRate: 31, detailMode: "standard", contextKind: "count", contextLabel: "employees", semanticUnit: "employees", weakStudent: false },
  { knownRate: 62, knownValue: 75, targetRate: 34, detailMode: "detailed", contextKind: "count", contextLabel: "people", semanticUnit: "people", weakStudent: false },
]);

const uglyDecimals = cases("UGLY_DECIMALS", [
  { knownRate: 20, knownValue: 67, targetRate: 35, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 17, knownValue: 89, targetRate: 29, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 13, knownValue: 71, targetRate: 47, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 19, knownValue: 83, targetRate: 37, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 23, knownValue: 97, targetRate: 41, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 29, knownValue: 113, targetRate: 53, detailMode: "short", contextKind: "measure", contextLabel: "distance", semanticUnit: "kilometres", weakStudent: false },
  { knownRate: 31, knownValue: 127, targetRate: 59, detailMode: "standard", contextKind: "measure", contextLabel: "area", semanticUnit: "square metres", weakStudent: false },
  { knownRate: 37, knownValue: 149, targetRate: 61, detailMode: "detailed", contextKind: "measure", contextLabel: "length", semanticUnit: "metres", weakStudent: false },
  { knownRate: 41, knownValue: 163, targetRate: 67, detailMode: "short", contextKind: "measure", contextLabel: "weight", semanticUnit: "kilograms", weakStudent: false },
  { knownRate: 43, knownValue: 179, targetRate: 71, detailMode: "standard", contextKind: "measure", contextLabel: "volume", semanticUnit: "litres", weakStudent: false },
  { knownRate: 7, knownValue: 13, targetRate: 11, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 11, knownValue: 17, targetRate: 13, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 14, knownValue: 19, targetRate: 17, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 16, knownValue: 23, targetRate: 19, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 21, knownValue: 29, targetRate: 23, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 24, knownValue: 31, targetRate: 27, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 26, knownValue: 37, targetRate: 33, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 32, knownValue: 43, targetRate: 39, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 34, knownValue: 47, targetRate: 43, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 38, knownValue: 53, targetRate: 49, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
]);

const moneyRealism = cases("MONEY_REALISM", [
  { knownRate: 20, knownValue: 675, targetRate: 35, detailMode: "standard", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 25, knownValue: 835, targetRate: 60, detailMode: "detailed", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 15, knownValue: 495, targetRate: 30, detailMode: "short", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 40, knownValue: 1375, targetRate: 25, detailMode: "standard", contextKind: "money", contextLabel: "savings", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 30, knownValue: 975, targetRate: 50, detailMode: "detailed", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 10, knownValue: 0.5, targetRate: 80, detailMode: "short", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 50, knownValue: 0.75, targetRate: 20, detailMode: "standard", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 25, knownValue: 1.25, targetRate: 75, detailMode: "detailed", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 60, knownValue: 1.8, targetRate: 10, detailMode: "short", contextKind: "money", contextLabel: "savings", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 20, knownValue: 2.4, targetRate: 20, detailMode: "standard", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 12, knownValue: 1_234_567, targetRate: 48, detailMode: "detailed", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 18, knownValue: 2_345_678, targetRate: 54, detailMode: "short", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 22, knownValue: 3_456_789, targetRate: 66, detailMode: "standard", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 28, knownValue: 4_567_891, targetRate: 14, detailMode: "detailed", contextKind: "money", contextLabel: "savings", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 32, knownValue: 5_678_912, targetRate: 16, detailMode: "short", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 33, knownValue: 99, targetRate: 66, detailMode: "standard", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 28, knownValue: 84, targetRate: 14, detailMode: "detailed", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 16, knownValue: 48, targetRate: 32, detailMode: "short", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 24, knownValue: 72, targetRate: 36, detailMode: "standard", contextKind: "money", contextLabel: "savings", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 18, knownValue: 54, targetRate: 27, detailMode: "detailed", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: true },
]);

const extremePercentages = cases("EXTREME_PERCENTAGES", [
  { knownRate: 1, knownValue: 5, targetRate: 99, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 99, knownValue: 495, targetRate: 1, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 100, knownValue: 800, targetRate: 150, detailMode: "short", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 150, knownValue: 1200, targetRate: 200, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 200, knownValue: 1600, targetRate: 100, detailMode: "detailed", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 0.5, knownValue: 4, targetRate: 2.5, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 2.5, knownValue: 20, targetRate: 0.5, detailMode: "standard", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 0.25, knownValue: 2, targetRate: 1.75, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 125, knownValue: 1000, targetRate: 175, detailMode: "short", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 175, knownValue: 1400, targetRate: 225, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 1, knownValue: 3, targetRate: 100, detailMode: "detailed", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: false },
  { knownRate: 100, knownValue: 300, targetRate: 1, detailMode: "short", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: false },
  { knownRate: 99, knownValue: 297, targetRate: 100, detailMode: "standard", contextKind: "count", contextLabel: "families", semanticUnit: "families", weakStudent: false },
  { knownRate: 100, knownValue: 400, targetRate: 200, detailMode: "detailed", contextKind: "count", contextLabel: "books", semanticUnit: "books", weakStudent: false },
  { knownRate: 150, knownValue: 450, targetRate: 50, detailMode: "short", contextKind: "count", contextLabel: "trees", semanticUnit: "trees", weakStudent: false },
  { knownRate: 0.5, knownValue: 1.5, targetRate: 10, detailMode: "standard", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: false },
  { knownRate: 2, knownValue: 6, targetRate: 98, detailMode: "detailed", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: false },
  { knownRate: 98, knownValue: 294, targetRate: 2, detailMode: "short", contextKind: "count", contextLabel: "families", semanticUnit: "families", weakStudent: false },
  { knownRate: 250, knownValue: 750, targetRate: 300, detailMode: "standard", contextKind: "count", contextLabel: "books", semanticUnit: "books", weakStudent: false },
  { knownRate: 300, knownValue: 900, targetRate: 50, detailMode: "detailed", contextKind: "count", contextLabel: "trees", semanticUnit: "trees", weakStudent: false },
]);

const equalRates = cases("EQUAL_RATES", [
  { knownRate: 30, knownValue: 90, targetRate: 30, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 20, knownValue: 600, targetRate: 20, detailMode: "standard", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 25, knownValue: 100, targetRate: 25, detailMode: "detailed", contextKind: "count", contextLabel: "books", semanticUnit: "books", weakStudent: true },
  { knownRate: 40, knownValue: 120, targetRate: 40, detailMode: "short", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: true },
  { knownRate: 50, knownValue: 250, targetRate: 50, detailMode: "standard", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 60, knownValue: 180, targetRate: 60, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 75, knownValue: 225, targetRate: 75, detailMode: "short", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: true },
  { knownRate: 80, knownValue: 400, targetRate: 80, detailMode: "standard", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 10, knownValue: 30, targetRate: 10, detailMode: "detailed", contextKind: "count", contextLabel: "families", semanticUnit: "families", weakStudent: true },
  { knownRate: 15, knownValue: 45, targetRate: 15, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 35, knownValue: 105, targetRate: 35, detailMode: "standard", contextKind: "money", contextLabel: "savings", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 45, knownValue: 135, targetRate: 45, detailMode: "detailed", contextKind: "count", contextLabel: "trees", semanticUnit: "trees", weakStudent: false },
  { knownRate: 55, knownValue: 165, targetRate: 55, detailMode: "short", contextKind: "count", contextLabel: "animals", semanticUnit: "animals", weakStudent: false },
  { knownRate: 65, knownValue: 195, targetRate: 65, detailMode: "standard", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 70, knownValue: 210, targetRate: 70, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 85, knownValue: 255, targetRate: 85, detailMode: "short", contextKind: "count", contextLabel: "employees", semanticUnit: "employees", weakStudent: false },
  { knownRate: 90, knownValue: 270, targetRate: 90, detailMode: "standard", contextKind: "money", contextLabel: "expenses", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 95, knownValue: 285, targetRate: 95, detailMode: "detailed", contextKind: "count", contextLabel: "people", semanticUnit: "people", weakStudent: false },
  { knownRate: 5, knownValue: 15, targetRate: 5, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: false },
  { knownRate: 100, knownValue: 300, targetRate: 100, detailMode: "standard", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: false },
]);

const largeValues = cases("LARGE_VALUES", [
  { knownRate: 20, knownValue: 12_345_678, targetRate: 35, detailMode: "standard", contextKind: "count", contextLabel: "population", semanticUnit: "people", weakStudent: false },
  { knownRate: 25, knownValue: 98_765_432, targetRate: 60, detailMode: "detailed", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 15, knownValue: 7_654_321, targetRate: 30, detailMode: "short", contextKind: "measure", contextLabel: "distance", semanticUnit: "kilometres", weakStudent: false },
  { knownRate: 40, knownValue: 6_543_210, targetRate: 25, detailMode: "standard", contextKind: "measure", contextLabel: "area", semanticUnit: "square metres", weakStudent: false },
  { knownRate: 30, knownValue: 5_432_109, targetRate: 50, detailMode: "detailed", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 10, knownValue: 999_999_999, targetRate: 80, detailMode: "short", contextKind: "count", contextLabel: "population", semanticUnit: "people", weakStudent: false },
  { knownRate: 50, knownValue: 888_888_888, targetRate: 20, detailMode: "standard", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 25, knownValue: 777_777_777, targetRate: 75, detailMode: "detailed", contextKind: "measure", contextLabel: "distance", semanticUnit: "kilometres", weakStudent: false },
  { knownRate: 60, knownValue: 666_666_666, targetRate: 10, detailMode: "short", contextKind: "measure", contextLabel: "area", semanticUnit: "square metres", weakStudent: false },
  { knownRate: 20, knownValue: 555_555_555, targetRate: 20, detailMode: "standard", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 8, knownValue: 444_444_444, targetRate: 72, detailMode: "detailed", contextKind: "count", contextLabel: "population", semanticUnit: "people", weakStudent: true },
  { knownRate: 12, knownValue: 333_333_333, targetRate: 48, detailMode: "short", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 18, knownValue: 222_222_222, targetRate: 54, detailMode: "standard", contextKind: "measure", contextLabel: "distance", semanticUnit: "kilometres", weakStudent: true },
  { knownRate: 22, knownValue: 111_111_111, targetRate: 66, detailMode: "detailed", contextKind: "measure", contextLabel: "area", semanticUnit: "square metres", weakStudent: true },
  { knownRate: 28, knownValue: 91_827_364, targetRate: 14, detailMode: "short", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 32, knownValue: 82_736_451, targetRate: 16, detailMode: "standard", contextKind: "count", contextLabel: "population", semanticUnit: "people", weakStudent: true },
  { knownRate: 36, knownValue: 73_645_128, targetRate: 24, detailMode: "detailed", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 42, knownValue: 64_512_837, targetRate: 21, detailMode: "short", contextKind: "measure", contextLabel: "distance", semanticUnit: "kilometres", weakStudent: true },
  { knownRate: 48, knownValue: 55_128_374, targetRate: 12, detailMode: "standard", contextKind: "measure", contextLabel: "area", semanticUnit: "square metres", weakStudent: true },
  { knownRate: 52, knownValue: 46_283_715, targetRate: 26, detailMode: "detailed", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: true },
]);

const verySmallValues = cases("VERY_SMALL_VALUES", [
  { knownRate: 20, knownValue: 0.4, targetRate: 35, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 25, knownValue: 0.8, targetRate: 60, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 15, knownValue: 1.2, targetRate: 30, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 40, knownValue: 0.04, targetRate: 25, detailMode: "standard", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 30, knownValue: 0.08, targetRate: 50, detailMode: "detailed", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 10, knownValue: 0.12, targetRate: 80, detailMode: "short", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 50, knownValue: 0.16, targetRate: 20, detailMode: "standard", contextKind: "money", contextLabel: "savings", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 25, knownValue: 0.2, targetRate: 75, detailMode: "detailed", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: false },
  { knownRate: 60, knownValue: 0.24, targetRate: 10, detailMode: "short", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: false },
  { knownRate: 20, knownValue: 0.28, targetRate: 20, detailMode: "standard", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: false },
  { knownRate: 5, knownValue: 0.32, targetRate: 15, detailMode: "detailed", contextKind: "count", contextLabel: "families", semanticUnit: "families", weakStudent: false },
  { knownRate: 8, knownValue: 0.36, targetRate: 72, detailMode: "short", contextKind: "measure", contextLabel: "distance", semanticUnit: "metres", weakStudent: false },
  { knownRate: 12, knownValue: 0.44, targetRate: 48, detailMode: "standard", contextKind: "measure", contextLabel: "area", semanticUnit: "square metres", weakStudent: false },
  { knownRate: 18, knownValue: 0.52, targetRate: 54, detailMode: "detailed", contextKind: "measure", contextLabel: "weight", semanticUnit: "kilograms", weakStudent: false },
  { knownRate: 22, knownValue: 0.6, targetRate: 66, detailMode: "short", contextKind: "measure", contextLabel: "volume", semanticUnit: "litres", weakStudent: false },
  { knownRate: 28, knownValue: 0.68, targetRate: 14, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 32, knownValue: 0.76, targetRate: 16, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 36, knownValue: 0.84, targetRate: 24, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 42, knownValue: 0.92, targetRate: 21, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 48, knownValue: 1.04, targetRate: 12, detailMode: "detailed", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
]);

const templateFatigue = cases("TEMPLATE_FATIGUE", Array.from({ length: 20 }, (_, index): CaseInput => ({
  knownRate: 10 + index * 2,
  knownValue: 60 + index * 9,
  targetRate: 15 + index * 3,
  detailMode: (["short", "standard", "detailed"] as const)[index % 3]!,
  contextKind: (["abstract", "count", "money"] as const)[index % 3]!,
  contextLabel: (["number", "students", "salary"] as const)[index % 3]!,
  semanticUnit: (["abstract-number", "students", "rupees"] as const)[index % 3]!,
  weakStudent: index % 2 === 0,
})));

const weakStudentCases = cases("WEAK_STUDENT", [
  { knownRate: 20, knownValue: 60, targetRate: 25, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 25, knownValue: 100, targetRate: 40, detailMode: "standard", contextKind: "count", contextLabel: "books", semanticUnit: "books", weakStudent: true },
  { knownRate: 10, knownValue: 30, targetRate: 50, detailMode: "detailed", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: true },
  { knownRate: 50, knownValue: 200, targetRate: 20, detailMode: "short", contextKind: "money", contextLabel: "salary", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 40, knownValue: 120, targetRate: 30, detailMode: "standard", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 30, knownValue: 90, targetRate: 60, detailMode: "detailed", contextKind: "count", contextLabel: "workers", semanticUnit: "workers", weakStudent: true },
  { knownRate: 15, knownValue: 45, targetRate: 35, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 60, knownValue: 180, targetRate: 15, detailMode: "standard", contextKind: "count", contextLabel: "families", semanticUnit: "families", weakStudent: true },
  { knownRate: 75, knownValue: 300, targetRate: 25, detailMode: "detailed", contextKind: "money", contextLabel: "savings", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 5, knownValue: 25, targetRate: 20, detailMode: "short", contextKind: "count", contextLabel: "trees", semanticUnit: "trees", weakStudent: true },
  { knownRate: 80, knownValue: 400, targetRate: 10, detailMode: "standard", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 35, knownValue: 105, targetRate: 70, detailMode: "detailed", contextKind: "money", contextLabel: "profit", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 45, knownValue: 135, targetRate: 15, detailMode: "short", contextKind: "count", contextLabel: "animals", semanticUnit: "animals", weakStudent: true },
  { knownRate: 55, knownValue: 165, targetRate: 35, detailMode: "standard", contextKind: "count", contextLabel: "employees", semanticUnit: "employees", weakStudent: true },
  { knownRate: 65, knownValue: 195, targetRate: 45, detailMode: "detailed", contextKind: "money", contextLabel: "revenue", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 12, knownValue: 36, targetRate: 24, detailMode: "short", contextKind: "abstract", contextLabel: "number", semanticUnit: "abstract-number", weakStudent: true },
  { knownRate: 18, knownValue: 54, targetRate: 36, detailMode: "standard", contextKind: "count", contextLabel: "people", semanticUnit: "people", weakStudent: true },
  { knownRate: 22, knownValue: 66, targetRate: 44, detailMode: "detailed", contextKind: "money", contextLabel: "expenses", semanticUnit: "rupees", weakStudent: true },
  { knownRate: 28, knownValue: 84, targetRate: 56, detailMode: "short", contextKind: "count", contextLabel: "students", semanticUnit: "students", weakStudent: true },
  { knownRate: 32, knownValue: 96, targetRate: 64, detailMode: "standard", contextKind: "money", contextLabel: "income", semanticUnit: "rupees", weakStudent: true },
]);

export const RED_TEAM_CORPUS: readonly RedTeamCorpusItem[] = [
  ...absurdContexts,
  ...fractionalHumans,
  ...uglyDecimals,
  ...moneyRealism,
  ...extremePercentages,
  ...equalRates,
  ...largeValues,
  ...verySmallValues,
  ...templateFatigue,
  ...weakStudentCases,
];

const fatigueContexts = [
  ["number", "abstract-number", "abstract"],
  ["students", "students", "count"],
  ["workers", "workers", "count"],
  ["books", "books", "count"],
  ["trees", "trees", "count"],
  ["families", "families", "count"],
  ["salary", "rupees", "money"],
  ["income", "rupees", "money"],
  ["profit", "rupees", "money"],
  ["revenue", "rupees", "money"],
] as const;

export const RED_TEAM_FATIGUE_CORPUS: readonly RedTeamCorpusItem[] =
  Array.from({ length: 500 }, (_, index) => {
    const context = fatigueContexts[index % fatigueContexts.length]!;
    const knownRate = 5 + ((index * 7) % 76);
    const targetRate = 5 + ((index * 11) % 91);
    const knownValue = 30 + ((index * 37) % 9_971);
    return {
      redTeamId: `QUAL-001-C:FATIGUE:${String(index + 1).padStart(3, "0")}`,
      category: "TEMPLATE_FATIGUE",
      knownRate,
      knownValue,
      targetRate,
      detailMode: (["short", "standard", "detailed"] as const)[index % 3]!,
      contextKind: context[2],
      contextLabel: context[0],
      semanticUnit: context[1],
      weakStudent: index % 4 === 0,
    };
  });

