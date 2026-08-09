export interface MalCp005FractionSpec {
  numerator: number;
  denominator: number;
}

export interface MalCp005FreeContextV2 {
  actor: string;
  product: string;
  adulterant: string;
  unit: "litres" | "kg";
}

export interface MalCp005CheaperContextV2 extends MalCp005FreeContextV2 {
  pureUnitCost: number;
  adulterantUnitCost: number;
}

export const MAL_CP005_FREE_CONTEXTS_V2: readonly MalCp005FreeContextV2[] = [
  { actor: "milk seller", product: "milk", adulterant: "water", unit: "litres" },
  { actor: "dairy vendor", product: "milk", adulterant: "water", unit: "litres" },
  { actor: "juice seller", product: "orange juice", adulterant: "water", unit: "litres" },
  { actor: "beverage seller", product: "fruit juice", adulterant: "water", unit: "litres" },
  { actor: "syrup dealer", product: "sugar syrup", adulterant: "water", unit: "litres" },
  { actor: "drink vendor", product: "rose syrup", adulterant: "water", unit: "litres" },
] as const;

export const MAL_CP005_CHEAPER_CONTEXTS_V2: readonly MalCp005CheaperContextV2[] = [
  { actor: "tea dealer", product: "premium tea", adulterant: "ordinary tea", unit: "kg", pureUnitCost: 80, adulterantUnitCost: 40 },
  { actor: "tea merchant", product: "premium tea", adulterant: "lower-grade tea", unit: "kg", pureUnitCost: 96, adulterantUnitCost: 48 },
  { actor: "coffee seller", product: "premium coffee", adulterant: "chicory", unit: "kg", pureUnitCost: 120, adulterantUnitCost: 60 },
  { actor: "coffee dealer", product: "premium coffee", adulterant: "chicory", unit: "kg", pureUnitCost: 100, adulterantUnitCost: 40 },
  { actor: "oil dealer", product: "mustard oil", adulterant: "refined oil", unit: "litres", pureUnitCost: 72, adulterantUnitCost: 48 },
  { actor: "oil seller", product: "mustard oil", adulterant: "refined oil", unit: "litres", pureUnitCost: 100, adulterantUnitCost: 50 },
  { actor: "ghee seller", product: "pure ghee", adulterant: "vanaspati", unit: "kg", pureUnitCost: 90, adulterantUnitCost: 60 },
  { actor: "ghee dealer", product: "pure ghee", adulterant: "vanaspati", unit: "kg", pureUnitCost: 120, adulterantUnitCost: 60 },
  { actor: "rice merchant", product: "basmati rice", adulterant: "ordinary rice", unit: "kg", pureUnitCost: 75, adulterantUnitCost: 45 },
  { actor: "grain seller", product: "premium wheat", adulterant: "lower-grade wheat", unit: "kg", pureUnitCost: 60, adulterantUnitCost: 30 },
  { actor: "pulse dealer", product: "premium pulses", adulterant: "lower-grade pulses", unit: "kg", pureUnitCost: 70, adulterantUnitCost: 35 },
  { actor: "rice seller", product: "premium rice", adulterant: "ordinary rice", unit: "kg", pureUnitCost: 84, adulterantUnitCost: 42 },
] as const;

export const MAL_CP005_NATURAL_RATIOS_V2 = [
  [20, 1],
  [10, 1],
  [8, 1],
  [6, 1],
  [5, 1],
  [4, 1],
  [3, 1],
  [5, 2],
  [2, 1],
  [5, 3],
  [3, 2],
  [4, 3],
] as const;

export const MAL_CP005_QUANTITY_SCALES_V2 = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15] as const;

export const MAL_CP005_PURE_COSTS_V2 = [
  24, 30, 32, 36, 40, 45, 48, 50, 54, 56, 60, 64, 68, 72, 75, 80, 84, 90, 96, 100, 108, 120,
] as const;

export const MAL_CP005_TARGET_PROFITS_V2: readonly MalCp005FractionSpec[] = [
  { numerator: 5, denominator: 1 },
  { numerator: 10, denominator: 1 },
  { numerator: 25, denominator: 2 },
  { numerator: 15, denominator: 1 },
  { numerator: 50, denominator: 3 },
  { numerator: 20, denominator: 1 },
  { numerator: 25, denominator: 1 },
  { numerator: 30, denominator: 1 },
  { numerator: 100, denominator: 3 },
  { numerator: 40, denominator: 1 },
  { numerator: 50, denominator: 1 },
] as const;

export const MAL_CP005_ALLOWED_DISPLAY_DENOMINATORS_V2 = new Set([
  1, 2, 3, 4, 5, 8, 10,
]);
