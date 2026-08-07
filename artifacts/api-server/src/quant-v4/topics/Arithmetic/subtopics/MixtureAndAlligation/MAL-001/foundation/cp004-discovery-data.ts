export type ConcentrationCase = {
  total: number;
  concentrationNumerator: number;
  concentrationDenominator: number;
  solute: string;
  solvent: string;
  container: string;
};

export type TargetCase = ConcentrationCase & {
  targetNumerator: number;
  targetDenominator: number;
};

export type MoistureCase = {
  initialMass: number;
  initialMoistureNumerator: number;
  initialMoistureDenominator: number;
  finalMoistureNumerator: number;
  finalMoistureDenominator: number;
  material: string;
  finalLabel: string;
};

export const COMPONENT_CASES: readonly ConcentrationCase[] = [
  { total: 40, concentrationNumerator: 3, concentrationDenominator: 10, solute: "acid", solvent: "water", container: "vessel" },
  { total: 60, concentrationNumerator: 2, concentrationDenominator: 5, solute: "acid", solvent: "water", container: "tank" },
  { total: 80, concentrationNumerator: 3, concentrationDenominator: 8, solute: "sugar", solvent: "water", container: "container" },
  { total: 90, concentrationNumerator: 4, concentrationDenominator: 9, solute: "salt", solvent: "water", container: "tank" },
  { total: 120, concentrationNumerator: 5, concentrationDenominator: 8, solute: "syrup concentrate", solvent: "water", container: "vessel" },
  { total: 150, concentrationNumerator: 3, concentrationDenominator: 5, solute: "chemical A", solvent: "water", container: "drum" },
  { total: 96, concentrationNumerator: 5, concentrationDenominator: 12, solute: "acid", solvent: "water", container: "tank" },
  { total: 72, concentrationNumerator: 5, concentrationDenominator: 9, solute: "fruit concentrate", solvent: "water", container: "container" },
] as const;

export const DILUTION_CASES: readonly TargetCase[] = [
  { total: 60, concentrationNumerator: 2, concentrationDenominator: 5, targetNumerator: 3, targetDenominator: 10, solute: "acid", solvent: "water", container: "tank" },
  { total: 80, concentrationNumerator: 1, concentrationDenominator: 2, targetNumerator: 2, targetDenominator: 5, solute: "acid", solvent: "water", container: "vessel" },
  { total: 72, concentrationNumerator: 1, concentrationDenominator: 2, targetNumerator: 3, targetDenominator: 8, solute: "syrup concentrate", solvent: "water", container: "container" },
  { total: 100, concentrationNumerator: 3, concentrationDenominator: 5, targetNumerator: 1, targetDenominator: 2, solute: "chemical A", solvent: "water", container: "tank" },
  { total: 90, concentrationNumerator: 2, concentrationDenominator: 3, targetNumerator: 1, targetDenominator: 2, solute: "acid", solvent: "water", container: "drum" },
  { total: 120, concentrationNumerator: 1, concentrationDenominator: 2, targetNumerator: 2, targetDenominator: 5, solute: "fruit concentrate", solvent: "water", container: "vessel" },
  { total: 75, concentrationNumerator: 4, concentrationDenominator: 5, targetNumerator: 3, targetDenominator: 5, solute: "syrup concentrate", solvent: "water", container: "tank" },
  { total: 96, concentrationNumerator: 5, concentrationDenominator: 8, targetNumerator: 1, targetDenominator: 2, solute: "acid", solvent: "water", container: "container" },
] as const;

export const PURE_ADDITION_CASES: readonly TargetCase[] = [
  { total: 60, concentrationNumerator: 2, concentrationDenominator: 5, targetNumerator: 1, targetDenominator: 2, solute: "acid", solvent: "water", container: "tank" },
  { total: 80, concentrationNumerator: 1, concentrationDenominator: 2, targetNumerator: 3, targetDenominator: 5, solute: "acid", solvent: "water", container: "vessel" },
  { total: 90, concentrationNumerator: 1, concentrationDenominator: 3, targetNumerator: 1, targetDenominator: 2, solute: "syrup concentrate", solvent: "water", container: "container" },
  { total: 100, concentrationNumerator: 2, concentrationDenominator: 5, targetNumerator: 3, targetDenominator: 5, solute: "chemical A", solvent: "water", container: "tank" },
  { total: 72, concentrationNumerator: 1, concentrationDenominator: 2, targetNumerator: 2, targetDenominator: 3, solute: "acid", solvent: "water", container: "drum" },
  { total: 120, concentrationNumerator: 1, concentrationDenominator: 4, targetNumerator: 2, targetDenominator: 5, solute: "fruit concentrate", solvent: "water", container: "vessel" },
  { total: 75, concentrationNumerator: 3, concentrationDenominator: 5, targetNumerator: 3, targetDenominator: 4, solute: "syrup concentrate", solvent: "water", container: "tank" },
  { total: 96, concentrationNumerator: 1, concentrationDenominator: 3, targetNumerator: 1, targetDenominator: 2, solute: "acid", solvent: "water", container: "container" },
] as const;

export const EVAPORATION_CASES: readonly TargetCase[] = [
  { total: 80, concentrationNumerator: 3, concentrationDenominator: 10, targetNumerator: 2, targetDenominator: 5, solute: "acid", solvent: "water", container: "tank" },
  { total: 100, concentrationNumerator: 2, concentrationDenominator: 5, targetNumerator: 1, targetDenominator: 2, solute: "acid", solvent: "water", container: "vessel" },
  { total: 90, concentrationNumerator: 1, concentrationDenominator: 3, targetNumerator: 1, targetDenominator: 2, solute: "syrup concentrate", solvent: "water", container: "container" },
  { total: 120, concentrationNumerator: 1, concentrationDenominator: 2, targetNumerator: 3, targetDenominator: 5, solute: "chemical A", solvent: "water", container: "tank" },
  { total: 72, concentrationNumerator: 3, concentrationDenominator: 8, targetNumerator: 1, targetDenominator: 2, solute: "acid", solvent: "water", container: "drum" },
  { total: 150, concentrationNumerator: 2, concentrationDenominator: 5, targetNumerator: 3, targetDenominator: 5, solute: "fruit concentrate", solvent: "water", container: "vessel" },
  { total: 96, concentrationNumerator: 1, concentrationDenominator: 4, targetNumerator: 2, targetDenominator: 5, solute: "acid", solvent: "water", container: "container" },
] as const;

export const MOISTURE_CASES: readonly MoistureCase[] = [
  { initialMass: 100, initialMoistureNumerator: 4, initialMoistureDenominator: 5, finalMoistureNumerator: 1, finalMoistureDenominator: 5, material: "fresh grapes", finalLabel: "raisins" },
  { initialMass: 80, initialMoistureNumerator: 3, initialMoistureDenominator: 4, finalMoistureNumerator: 1, finalMoistureDenominator: 5, material: "fresh fruit", finalLabel: "dried fruit" },
  { initialMass: 90, initialMoistureNumerator: 2, initialMoistureDenominator: 3, finalMoistureNumerator: 1, finalMoistureDenominator: 4, material: "wet grain", finalLabel: "dried grain" },
  { initialMass: 75, initialMoistureNumerator: 3, initialMoistureDenominator: 5, finalMoistureNumerator: 1, finalMoistureDenominator: 5, material: "fresh mango pulp", finalLabel: "dried pulp" },
  { initialMass: 96, initialMoistureNumerator: 3, initialMoistureDenominator: 4, finalMoistureNumerator: 2, finalMoistureDenominator: 5, material: "wet timber", finalLabel: "seasoned timber" },
  { initialMass: 150, initialMoistureNumerator: 4, initialMoistureDenominator: 5, finalMoistureNumerator: 1, finalMoistureDenominator: 2, material: "fresh vegetable matter", finalLabel: "partly dried matter" },
  { initialMass: 125, initialMoistureNumerator: 3, initialMoistureDenominator: 5, finalMoistureNumerator: 1, finalMoistureDenominator: 5, material: "wet fodder", finalLabel: "dry fodder" },
  { initialMass: 84, initialMoistureNumerator: 1, initialMoistureDenominator: 2, finalMoistureNumerator: 1, finalMoistureDenominator: 4, material: "wet grain", finalLabel: "dried grain" },
] as const;
