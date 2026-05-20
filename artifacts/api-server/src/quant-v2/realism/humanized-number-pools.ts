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
    12000,
    24000,
    40000,
    48000,
    56000,
    72000,
    85000,
    96000,
    120000,
    144000,
    160000,
    200000,
    240000,
    250000,
    320000,
    365000,
    400000,
    480000,
    600000,
    720000,
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
    85000,
    90000,
    120000,
    144000,
    150000,
    180000,
    240000,
    250000,
    300000,
    360000,
    365000,
    480000,
    600000,
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

export function humanizedElectionTotal(
  serial: number,
  offset = 0,
): number {
  return cyclicPick(HUMANIZED_NUMBER_POOLS.electionTotals, serial, offset);
}

export function humanizedExamTotal(
  serial: number,
  offset = 0,
): number {
  return cyclicPick(HUMANIZED_NUMBER_POOLS.examTotals, serial, offset);
}

export function humanizedPopulationTotal(
  serial: number,
  offset = 0,
): number {
  return cyclicPick(HUMANIZED_NUMBER_POOLS.populationTotals, serial, offset);
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
