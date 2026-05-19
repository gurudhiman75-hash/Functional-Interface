import type { RealismDifficulty } from "./realism-number-profiles";

export const HUMANIZED_NUMBER_POOLS = {
  cleanIntegers: [
    12,
    16,
    20,
    24,
    30,
    36,
    40,
    48,
    60,
    75,
    80,
    96,
    120,
    150,
    180,
    200,
    240,
    300,
    360,
    480,
    600,
    750,
    900,
  ],
  electionTotals: [
    24000,
    40000,
    48000,
    56000,
    64000,
    72000,
    80000,
    96000,
    120000,
    160000,
    200000,
    240000,
    320000,
    400000,
    480000,
    600000,
    720000,
    800000,
    960000,
    1200000,
  ],
  examTotals: [
    120,
    160,
    200,
    240,
    300,
    320,
    400,
    480,
    500,
    600,
    640,
    720,
    800,
    960,
    1000,
    1200,
    1600,
    2000,
  ],
  populationTotals: [
    12000,
    16000,
    20000,
    24000,
    30000,
    36000,
    48000,
    60000,
    75000,
    90000,
    120000,
    150000,
    180000,
    240000,
    300000,
    360000,
    480000,
    600000,
    750000,
    900000,
  ],
  salaryTotals: [
    25000,
    30000,
    40000,
    50000,
    60000,
    75000,
    90000,
    100000,
    120000,
    150000,
  ],
  mixtureTotals: [
    20,
    40,
    50,
    60,
    80,
    100,
    120,
    150,
    200,
    240,
    300,
    500,
  ],
} as const;

export function cyclicPick<T>(
  values: readonly T[],
  serial: number,
  offset = 0,
): T {
  if (values.length === 0) {
    throw new Error("Cannot pick from an empty humanized value pool.");
  }

  const index =
    ((Math.trunc(serial + offset - 1) % values.length) + values.length) %
    values.length;
  return values[index]!;
}

function block(serial: number, poolLength: number) {
  return Math.floor(Math.max(0, serial - 1) / poolLength);
}

export function humanizedElectionTotal(
  serial: number,
  offset = 0,
): number {
  return 125000 + Math.max(0, serial + offset - 1) * 25000;
}

export function humanizedExamTotal(
  serial: number,
  offset = 0,
): number {
  return 200 + Math.max(0, serial + offset - 1) * 100;
}

export function humanizedPopulationTotal(
  serial: number,
  offset = 0,
): number {
  return 20000 + Math.max(0, serial + offset - 1) * 10000;
}

export function humanizedScaleUnit(
  value: number,
  difficulty: RealismDifficulty = "medium",
): number {
  if (value < 1000) {
    return difficulty === "easy" ? 10 : 20;
  }
  if (value < 100000) {
    return difficulty === "hard" ? 500 : 1000;
  }
  if (value < 1000000) {
    return 5000;
  }

  return 10000;
}
