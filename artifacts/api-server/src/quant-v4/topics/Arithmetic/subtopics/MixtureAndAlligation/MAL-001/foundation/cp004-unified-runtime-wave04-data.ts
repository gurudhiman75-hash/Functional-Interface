export type FractionTuple = readonly [number, number];

export interface MalCp004Wave04LiquidContext {
  container: string;
  tracked: string;
  other: string;
}

export const MAL_CP004_WAVE04_LIQUID_CONTEXTS:
  readonly MalCp004Wave04LiquidContext[] = [
    { container: "vessel", tracked: "acid", other: "water" },
    { container: "tank", tracked: "sugar", other: "water" },
    { container: "container", tracked: "salt", other: "water" },
    { container: "drum", tracked: "chemical A", other: "water" },
    { container: "can", tracked: "fruit concentrate", other: "water" },
    { container: "tank", tracked: "alcohol", other: "water" },
    { container: "vessel", tracked: "syrup concentrate", other: "water" },
    { container: "container", tracked: "liquid A", other: "liquid B" },
  ] as const;

export const MAL_CP004_WAVE04_COMPONENT_TOTALS = [
  40, 60, 72, 75, 80, 90, 96, 100, 120, 144, 150, 160,
] as const;

export const MAL_CP004_WAVE04_COMPONENT_RATES:
  readonly FractionTuple[] = [
    [1, 5],
    [1, 4],
    [3, 10],
    [1, 3],
    [3, 8],
    [2, 5],
    [1, 2],
    [3, 5],
    [5, 8],
    [2, 3],
    [3, 4],
    [4, 5],
  ] as const;

export interface MalCp004Wave04TargetCase {
  initialTotal: number;
  initialRate: FractionTuple;
  targetRate: FractionTuple;
}

export const MAL_CP004_WAVE04_DILUTION_CASES:
  readonly MalCp004Wave04TargetCase[] = [
    { initialTotal: 60, initialRate: [2, 5], targetRate: [3, 10] },
    { initialTotal: 80, initialRate: [1, 2], targetRate: [2, 5] },
    { initialTotal: 72, initialRate: [1, 2], targetRate: [3, 8] },
    { initialTotal: 100, initialRate: [3, 5], targetRate: [1, 2] },
    { initialTotal: 90, initialRate: [2, 3], targetRate: [1, 2] },
    { initialTotal: 120, initialRate: [1, 2], targetRate: [2, 5] },
    { initialTotal: 75, initialRate: [4, 5], targetRate: [3, 5] },
    { initialTotal: 96, initialRate: [5, 8], targetRate: [1, 2] },
    { initialTotal: 150, initialRate: [3, 5], targetRate: [2, 5] },
    { initialTotal: 144, initialRate: [2, 3], targetRate: [1, 2] },
  ] as const;

export const MAL_CP004_WAVE04_PURE_ADDITION_CASES:
  readonly MalCp004Wave04TargetCase[] = [
    { initialTotal: 60, initialRate: [2, 5], targetRate: [1, 2] },
    { initialTotal: 80, initialRate: [1, 2], targetRate: [3, 5] },
    { initialTotal: 90, initialRate: [1, 3], targetRate: [1, 2] },
    { initialTotal: 100, initialRate: [2, 5], targetRate: [3, 5] },
    { initialTotal: 72, initialRate: [1, 2], targetRate: [2, 3] },
    { initialTotal: 120, initialRate: [1, 4], targetRate: [2, 5] },
    { initialTotal: 75, initialRate: [3, 5], targetRate: [3, 4] },
    { initialTotal: 96, initialRate: [1, 3], targetRate: [1, 2] },
    { initialTotal: 50, initialRate: [4, 5], targetRate: [9, 10] },
    { initialTotal: 30, initialRate: [1, 50], targetRate: [1, 10] },
  ] as const;

export const MAL_CP004_WAVE04_EVAPORATION_CASES:
  readonly MalCp004Wave04TargetCase[] = [
    { initialTotal: 80, initialRate: [3, 10], targetRate: [2, 5] },
    { initialTotal: 100, initialRate: [2, 5], targetRate: [1, 2] },
    { initialTotal: 90, initialRate: [1, 3], targetRate: [1, 2] },
    { initialTotal: 120, initialRate: [1, 2], targetRate: [3, 5] },
    { initialTotal: 72, initialRate: [3, 8], targetRate: [1, 2] },
    { initialTotal: 150, initialRate: [2, 5], targetRate: [3, 5] },
    { initialTotal: 96, initialRate: [1, 4], targetRate: [2, 5] },
    { initialTotal: 75, initialRate: [1, 5], targetRate: [3, 10] },
    { initialTotal: 60, initialRate: [1, 3], targetRate: [1, 2] },
    { initialTotal: 120, initialRate: [3, 5], targetRate: [4, 5] },
  ] as const;

export interface MalCp004Wave04KnownSolventChangeCase {
  initialTotal: number;
  initialRate: FractionTuple;
  solventChange: number;
  direction: "ADD" | "EVAPORATE";
}

export const MAL_CP004_WAVE04_KNOWN_SOLVENT_CHANGE_CASES:
  readonly MalCp004Wave04KnownSolventChangeCase[] = [
    { initialTotal: 5, initialRate: [2, 5], solventChange: 1, direction: "ADD" },
    { initialTotal: 9, initialRate: [1, 2], solventChange: 6, direction: "ADD" },
    { initialTotal: 60, initialRate: [2, 5], solventChange: 20, direction: "ADD" },
    { initialTotal: 80, initialRate: [1, 2], solventChange: 20, direction: "ADD" },
    { initialTotal: 72, initialRate: [1, 2], solventChange: 24, direction: "ADD" },
    { initialTotal: 6, initialRate: [1, 25], solventChange: 1, direction: "EVAPORATE" },
    { initialTotal: 75, initialRate: [1, 5], solventChange: 25, direction: "EVAPORATE" },
    { initialTotal: 80, initialRate: [3, 10], solventChange: 20, direction: "EVAPORATE" },
    { initialTotal: 100, initialRate: [2, 5], solventChange: 20, direction: "EVAPORATE" },
    { initialTotal: 90, initialRate: [1, 3], solventChange: 30, direction: "EVAPORATE" },
  ] as const;

export interface MalCp004Wave04InitialFromEvaporationCase {
  evaporated: number;
  initialRate: FractionTuple;
  targetRate: FractionTuple;
}

export const MAL_CP004_WAVE04_INITIAL_FROM_EVAPORATION_CASES:
  readonly MalCp004Wave04InitialFromEvaporationCase[] = [
    { evaporated: 25, initialRate: [1, 5], targetRate: [3, 10] },
    { evaporated: 20, initialRate: [1, 4], targetRate: [1, 2] },
    { evaporated: 20, initialRate: [1, 3], targetRate: [1, 2] },
    { evaporated: 30, initialRate: [2, 5], targetRate: [3, 5] },
    { evaporated: 40, initialRate: [1, 2], targetRate: [3, 4] },
    { evaporated: 30, initialRate: [3, 5], targetRate: [4, 5] },
    { evaporated: 50, initialRate: [1, 5], targetRate: [2, 5] },
    { evaporated: 24, initialRate: [3, 8], targetRate: [1, 2] },
  ] as const;

export interface MalCp004Wave04MoistureCase {
  initialMass: number;
  initialMoisture: FractionTuple;
  finalMoisture: FractionTuple;
  material: string;
  finalMaterial: string;
}

export const MAL_CP004_WAVE04_MOISTURE_CASES:
  readonly MalCp004Wave04MoistureCase[] = [
    { initialMass: 100, initialMoisture: [4, 5], finalMoisture: [1, 5], material: "fresh grapes", finalMaterial: "raisins" },
    { initialMass: 80, initialMoisture: [3, 4], finalMoisture: [1, 5], material: "fresh fruit", finalMaterial: "dried fruit" },
    { initialMass: 90, initialMoisture: [2, 3], finalMoisture: [1, 4], material: "wet grain", finalMaterial: "dried grain" },
    { initialMass: 75, initialMoisture: [3, 5], finalMoisture: [1, 5], material: "fresh mango pulp", finalMaterial: "dried pulp" },
    { initialMass: 96, initialMoisture: [3, 4], finalMoisture: [2, 5], material: "wet timber", finalMaterial: "seasoned timber" },
    { initialMass: 150, initialMoisture: [4, 5], finalMoisture: [1, 2], material: "fresh vegetable matter", finalMaterial: "partly dried matter" },
    { initialMass: 125, initialMoisture: [3, 5], finalMoisture: [1, 5], material: "wet fodder", finalMaterial: "dry fodder" },
    { initialMass: 84, initialMoisture: [1, 2], finalMoisture: [1, 4], material: "wet grain", finalMaterial: "dried grain" },
    { initialMass: 20, initialMoisture: [9, 10], finalMoisture: [1, 5], material: "fresh grapes", finalMaterial: "dried grapes" },
    { initialMass: 100, initialMoisture: [17, 25], finalMoisture: [1, 5], material: "fresh fruit", finalMaterial: "dry fruit" },
  ] as const;
