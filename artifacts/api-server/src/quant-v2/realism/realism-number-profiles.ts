export type RealismDomain =
  | "election"
  | "exam_marks"
  | "population"
  | "salary"
  | "mixture"
  | "finance"
  | "ratio"
  | "turnout"
  | "percentages";

export type RealismDifficulty = "easy" | "medium" | "hard";

export interface RealismNumberProfile {
  domain: RealismDomain;
  preferredScales: readonly number[];
  realisticRange: {
    min: number;
    max: number;
  };
  divisibilityTargets: readonly number[];
  roundingUnit: number;
  acceptableFractionalPercentages: readonly number[];
  humanFriendlyTotals: readonly number[];
}

export const CONTROLLED_FRACTIONAL_PERCENTAGES = [
  12.5,
  16.67,
  25,
  37.5,
  50,
  62.5,
  75,
  87.5,
] as const;

export const REALISM_NUMBER_PROFILES = {
  election: {
    domain: "election",
    preferredScales: [1000, 8000, 10000, 25000, 100000],
    realisticRange: { min: 12000, max: 8000000 },
    divisibilityTargets: [8, 16, 25, 100, 1000],
    roundingUnit: 1000,
    acceptableFractionalPercentages: CONTROLLED_FRACTIONAL_PERCENTAGES,
    humanFriendlyTotals: [
      12000,
      24000,
      40000,
      48000,
      60000,
      80000,
      120000,
      240000,
      400000,
      750000,
      1200000,
    ],
  },
  exam_marks: {
    domain: "exam_marks",
    preferredScales: [20, 50, 100, 200, 500],
    realisticRange: { min: 100, max: 15000 },
    divisibilityTargets: [4, 5, 8, 10, 20],
    roundingUnit: 10,
    acceptableFractionalPercentages: CONTROLLED_FRACTIONAL_PERCENTAGES,
    humanFriendlyTotals: [
      100,
      200,
      400,
      500,
      800,
      1000,
      1200,
      1600,
      2000,
    ],
  },
  population: {
    domain: "population",
    preferredScales: [1000, 5000, 10000, 100000],
    realisticRange: { min: 10000, max: 5000000 },
    divisibilityTargets: [4, 5, 8, 10, 1000],
    roundingUnit: 1000,
    acceptableFractionalPercentages: CONTROLLED_FRACTIONAL_PERCENTAGES,
    humanFriendlyTotals: [
      10000,
      12000,
      20000,
      24000,
      50000,
      100000,
      250000,
      500000,
      1000000,
    ],
  },
  salary: {
    domain: "salary",
    preferredScales: [1000, 2500, 5000, 10000],
    realisticRange: { min: 10000, max: 2500000 },
    divisibilityTargets: [4, 5, 10, 1000],
    roundingUnit: 500,
    acceptableFractionalPercentages: [5, 10, 12.5, 20, 25, 50],
    humanFriendlyTotals: [
      25000,
      30000,
      40000,
      50000,
      75000,
      100000,
      150000,
    ],
  },
  mixture: {
    domain: "mixture",
    preferredScales: [5, 10, 20, 25, 50],
    realisticRange: { min: 10, max: 1000 },
    divisibilityTargets: [2, 4, 5, 10],
    roundingUnit: 1,
    acceptableFractionalPercentages: CONTROLLED_FRACTIONAL_PERCENTAGES,
    humanFriendlyTotals: [20, 40, 50, 80, 100, 120, 200, 250, 500],
  },
  finance: {
    domain: "finance",
    preferredScales: [100, 500, 1000, 5000],
    realisticRange: { min: 100, max: 1000000 },
    divisibilityTargets: [4, 5, 10, 100],
    roundingUnit: 100,
    acceptableFractionalPercentages: CONTROLLED_FRACTIONAL_PERCENTAGES,
    humanFriendlyTotals: [1000, 2000, 5000, 10000, 25000, 50000],
  },
  ratio: {
    domain: "ratio",
    preferredScales: [1, 2, 5, 10],
    realisticRange: { min: 1, max: 1000 },
    divisibilityTargets: [2, 3, 4, 5, 10],
    roundingUnit: 1,
    acceptableFractionalPercentages: CONTROLLED_FRACTIONAL_PERCENTAGES,
    humanFriendlyTotals: [12, 20, 24, 30, 40, 60, 80, 100],
  },
  turnout: {
    domain: "turnout",
    preferredScales: [5, 10, 25],
    realisticRange: { min: 40, max: 95 },
    divisibilityTargets: [5, 10],
    roundingUnit: 5,
    acceptableFractionalPercentages: [50, 60, 65, 70, 75, 80, 85, 90],
    humanFriendlyTotals: [50, 60, 65, 70, 75, 80, 85, 90],
  },
  percentages: {
    domain: "percentages",
    preferredScales: [5, 10, 12.5, 25],
    realisticRange: { min: 1, max: 100 },
    divisibilityTargets: [2, 4, 5, 8, 10],
    roundingUnit: 0.5,
    acceptableFractionalPercentages: CONTROLLED_FRACTIONAL_PERCENTAGES,
    humanFriendlyTotals: [5, 10, 12.5, 20, 25, 37.5, 50, 62.5, 75],
  },
} as const satisfies Record<RealismDomain, RealismNumberProfile>;

export function isControlledFractionalPercentage(value: number): boolean {
  if (Number.isInteger(value)) {
    return true;
  }

  return CONTROLLED_FRACTIONAL_PERCENTAGES.some(
    (allowed) => Math.abs(allowed - value) <= 0.01,
  );
}

export function profileForDomain(
  domain: RealismDomain,
): RealismNumberProfile {
  return REALISM_NUMBER_PROFILES[domain];
}
