import objectPoolsSource from "../object-pools.library.json" assert { type: "json" };
import { normalizeRatio, rational, subtractRational } from "./math";
import {
  formatPrt001Duration,
  formatPrt001Money,
  localizePrt001Business,
} from "./parameter-generator";
import { createPrt001Random } from "./random";
import { solvePrt001State } from "./solver";
import type {
  CapitalSegment,
  Partner,
  PartnershipState,
  PreDistributionAllocation,
  Prt001Language,
  Prt001PilotParameters,
  Prt001TaskRegistryEntry,
  Rational,
} from "./types";

interface ObjectPools {
  partnerPairs: [string, string][];
  businesses: string[];
}

const objectPools = objectPoolsSource as unknown as ObjectPools;

const segment = (start: number, end: number, capital: number): CapitalSegment => ({
  start: rational(start),
  end: rational(end),
  capital: rational(capital),
});

const partner = (
  partnerId: string,
  capitalSegments: readonly CapitalSegment[],
  role: Partner["role"] = "UNSPECIFIED",
): Partner => ({ partnerId, role, capitalSegments });

function makeState(
  partners: readonly Partner[],
  grossProfitOrLoss: number,
  allocations: readonly PreDistributionAllocation[] = [],
): PartnershipState {
  return {
    totalDuration: rational(12),
    grossProfitOrLoss: rational(grossProfitOrLoss),
    partners,
    allocations,
    moneyUnit: "RUPEE",
    timeUnit: "MONTH",
  };
}

function abs(value: Rational): Rational {
  return value.numerator < 0n
    ? rational(-value.numerator, value.denominator)
    : value;
}

function ratioOf(values: readonly Rational[]): readonly bigint[] {
  return normalizeRatio(values);
}

function deterministicScenarioIndex(seed: string, size: number): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % size;
}

export function isPrt001E2SolveMode(solveMode: string): boolean {
  return new Set([
    "findTotalProfitFromShareDifferenceAndCapitals",
    "findCapitalRatioFromProfitRatioAndTimeRatio",
    "findTimeRatioFromProfitRatioAndCapitalRatio",
    "findProfitRatioWithMultipleChangesForOnePartner",
    "findUnknownCapitalChangeTimeFromProfitRatio",
    "findFourPartnerProfitRatio",
    "findUnknownDurationInThreePartnerSystem",
    "findCapitalRatioFromPartnerShareRelations",
    "findTotalProfitFromSleepingPartnerReceipt",
    "findPartnerReceiptWithSalaryAndDeduction",
    "findShareWithDynamicCapitalAndPercentCommission",
    "findUnknownJoinTimeWithCapitalChangeHistory",
    "findTotalProfitFromMixedTimelineFinalReceipt",
    "findDifferenceBetweenFinalReceiptsInMixedSystem",
  ]).has(solveMode);
}

export function generatePrt001E2Parameters(input: {
  questionLanguageId: string;
  seed: string;
  entry: Prt001TaskRegistryEntry;
  language: Prt001Language;
}): Prt001PilotParameters {
  const random = createPrt001Random(input.seed);
  const names = random.shuffle([...new Set(objectPools.partnerPairs.flat())]);
  const [partnerA, partnerB, partnerC, partnerD] = names;
  if (!partnerA || !partnerB || !partnerC || !partnerD)
    throw new Error("E2 requires four partner names");
  const business = localizePrt001Business(
    random.pick(objectPools.businesses),
    input.language,
  );
  const scale = random.pick([1, 2, 3]);
  const money = (value: number) => value * scale;
  let state: PartnershipState;
  let targetPartnerId: string | undefined;
  const extra: Record<string, string | number> = {};

  switch (input.entry.solveMode) {
    case "findTotalProfitFromShareDifferenceAndCapitals": {
      const s = random.pick([
        { a: 20_000, b: 30_000, gross: 100_000 },
        { a: 24_000, b: 36_000, gross: 120_000 },
        { a: 30_000, b: 50_000, gross: 160_000 },
        { a: 35_000, b: 49_000, gross: 168_000 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, 12, money(s.a))]),
        partner(partnerB, [segment(0, 12, money(s.b))]),
      ], money(s.gross));
      break;
    }
    case "findCapitalRatioFromProfitRatioAndTimeRatio": {
      const numericStateRandom = createPrt001Random(
        `${input.seed}:numeric-state:${input.entry.solveMode}`,
      );
      const capitalRatio = numericStateRandom.pick([
        [2, 3],
        [3, 2],
        [3, 4],
        [4, 3],
        [4, 5],
        [5, 4],
        [3, 5],
        [5, 3],
        [5, 7],
        [7, 5],
        [4, 7],
        [7, 4],
      ] as const);
      const timePair = numericStateRandom.pick([
        [4, 6],
        [6, 4],
        [6, 9],
        [9, 6],
        [8, 12],
        [12, 8],
        [5, 10],
        [10, 5],
        [6, 12],
        [12, 6],
        [9, 12],
        [12, 9],
      ] as const);
      const unit = numericStateRandom.pick([6_000, 8_000, 10_000, 12_000, 15_000]);
      const s = {
        a: capitalRatio[0] * unit,
        da: timePair[0],
        b: capitalRatio[1] * unit,
        db: timePair[1],
      };
      state = makeState([
        partner(partnerA, [segment(0, s.da, money(s.a))]),
        partner(partnerB, [segment(0, s.db, money(s.b))]),
      ], money(90_000));
      extra.timeRatioA = ratioOf([rational(s.da), rational(s.db)])[0]!.toString();
      extra.timeRatioB = ratioOf([rational(s.da), rational(s.db)])[1]!.toString();
      break;
    }
    case "findTimeRatioFromProfitRatioAndCapitalRatio": {
      const scenarios = [
        { cr: [2, 3] as const, time: [4, 6] as const, unit: 10_000 },
        { cr: [3, 2] as const, time: [5, 8] as const, unit: 12_000 },
        { cr: [3, 4] as const, time: [6, 5] as const, unit: 8_000 },
        { cr: [4, 3] as const, time: [7, 10] as const, unit: 10_000 },
        { cr: [4, 5] as const, time: [8, 11] as const, unit: 6_000 },
        { cr: [5, 4] as const, time: [9, 7] as const, unit: 8_000 },
        { cr: [5, 7] as const, time: [10, 6] as const, unit: 6_000 },
        { cr: [7, 5] as const, time: [11, 8] as const, unit: 10_000 },
        { cr: [4, 7] as const, time: [12, 5] as const, unit: 6_000 },
        { cr: [7, 4] as const, time: [5, 12] as const, unit: 8_000 },
        { cr: [3, 5] as const, time: [7, 12] as const, unit: 10_000 },
        { cr: [5, 3] as const, time: [12, 7] as const, unit: 12_000 },
      ] as const;
      const s = scenarios[
        deterministicScenarioIndex(
          `${input.seed}:${input.entry.solveMode}:answer-diversity`,
          scenarios.length,
        )
      ]!;
      state = makeState([
        partner(partnerA, [segment(0, s.time[0], money(s.cr[0] * s.unit))]),
        partner(partnerB, [segment(0, s.time[1], money(s.cr[1] * s.unit))]),
      ], money(90_000));
      const cr = ratioOf([rational(s.cr[0]), rational(s.cr[1])]);
      extra.capitalRatioA = cr[0]!.toString();
      extra.capitalRatioB = cr[1]!.toString();
      break;
    }
    case "findProfitRatioWithMultipleChangesForOnePartner": {
      const s = random.pick([
        { a0: 20_000, a1: 30_000, a2: 24_000, c1: 4, c2: 9, b: 25_000 },
        { a0: 24_000, a1: 36_000, a2: 30_000, c1: 3, c2: 8, b: 32_000 },
        { a0: 30_000, a1: 24_000, a2: 42_000, c1: 5, c2: 10, b: 35_000 },
        { a0: 40_000, a1: 50_000, a2: 30_000, c1: 2, c2: 7, b: 45_000 },
        { a0: 30_000, a1: 45_000, a2: 36_000, c1: 2, c2: 6, b: 40_000 },
        { a0: 36_000, a1: 48_000, a2: 60_000, c1: 4, c2: 8, b: 50_000 },
        { a0: 50_000, a1: 40_000, a2: 70_000, c1: 3, c2: 9, b: 55_000 },
        { a0: 28_000, a1: 42_000, a2: 56_000, c1: 5, c2: 8, b: 45_000 },
        { a0: 60_000, a1: 90_000, a2: 75_000, c1: 6, c2: 10, b: 80_000 },
        { a0: 45_000, a1: 60_000, a2: 30_000, c1: 3, c2: 7, b: 50_000 },
        { a0: 54_000, a1: 36_000, a2: 72_000, c1: 4, c2: 9, b: 60_000 },
        { a0: 32_000, a1: 64_000, a2: 48_000, c1: 2, c2: 10, b: 52_000 },
      ]);
      state = makeState([
        partner(partnerA, [
          segment(0, s.c1, money(s.a0)),
          segment(s.c1, s.c2, money(s.a1)),
          segment(s.c2, 12, money(s.a2)),
        ]),
        partner(partnerB, [segment(0, 12, money(s.b))]),
      ], money(100_000));
      extra.firstChangedCapitalA = formatPrt001Money(rational(money(s.a1)));
      extra.secondChangedCapitalA = formatPrt001Money(rational(money(s.a2)));
      extra.firstChangeMonthA = formatPrt001Duration(rational(s.c1), input.language);
      extra.secondChangeMonthA = formatPrt001Duration(rational(s.c2), input.language);
      break;
    }
    case "findUnknownCapitalChangeTimeFromProfitRatio": {
      const s = random.pick([
        { a0: 20_000, a1: 40_000, change: 6, b: 30_000 },
        { a0: 24_000, a1: 36_000, change: 4, b: 30_000 },
        { a0: 40_000, a1: 20_000, change: 8, b: 30_000 },
        { a0: 30_000, a1: 45_000, change: 5, b: 35_000 },
        { a0: 24_000, a1: 48_000, change: 1, b: 36_000 },
        { a0: 30_000, a1: 45_000, change: 2, b: 40_000 },
        { a0: 60_000, a1: 30_000, change: 3, b: 45_000 },
        { a0: 40_000, a1: 60_000, change: 7, b: 50_000 },
        { a0: 72_000, a1: 48_000, change: 9, b: 60_000 },
        { a0: 50_000, a1: 75_000, change: 10, b: 55_000 },
        { a0: 80_000, a1: 40_000, change: 11, b: 70_000 },
        { a0: 36_000, a1: 54_000, change: 6, b: 42_000 },
      ]);
      state = makeState([
        partner(partnerA, [
          segment(0, s.change, money(s.a0)),
          segment(s.change, 12, money(s.a1)),
        ]),
        partner(partnerB, [segment(0, 12, money(s.b))]),
      ], money(90_000));
      break;
    }
    case "findFourPartnerProfitRatio": {
      const numericStateRandom = createPrt001Random(
        `${input.seed}:numeric-state:${input.entry.solveMode}`,
      );
      const capitals = numericStateRandom.pick([
        [2, 3, 4, 5],
        [3, 4, 5, 6],
        [4, 3, 5, 7],
        [5, 4, 6, 3],
        [3, 5, 4, 7],
        [6, 4, 5, 8],
        [4, 7, 3, 6],
        [5, 6, 8, 4],
      ] as const);
      const durations = numericStateRandom.pick([
        [12, 8, 6, 10],
        [10, 12, 8, 6],
        [12, 6, 10, 9],
        [9, 6, 12, 8],
        [8, 12, 5, 10],
        [7, 10, 12, 6],
        [11, 7, 9, 12],
        [6, 9, 11, 8],
      ] as const);
      const unit = numericStateRandom.pick([6_000, 8_000, 10_000, 12_000]);
      const s = {
        a: capitals[0] * unit, da: durations[0],
        b: capitals[1] * unit, db: durations[1],
        c: capitals[2] * unit, dc: durations[2],
        d: capitals[3] * unit, dd: durations[3],
      };
      state = makeState([
        partner(partnerA, [segment(0, s.da, money(s.a))]),
        partner(partnerB, [segment(0, s.db, money(s.b))]),
        partner(partnerC, [segment(0, s.dc, money(s.c))]),
        partner(partnerD, [segment(0, s.dd, money(s.d))]),
      ], money(120_000));
      extra.partnerD = partnerD;
      extra.capitalD = formatPrt001Money(rational(money(s.d)));
      extra.durationD = formatPrt001Duration(rational(s.dd), input.language);
      break;
    }
    case "findUnknownDurationInThreePartnerSystem": {
      const numericStateRandom = createPrt001Random(
        `${input.seed}:numeric-state:${input.entry.solveMode}`,
      );
      const s = numericStateRandom.pick([
        { a: 20_000, da: 12, b: 30_000, db: 8, c: 40_000, dc: 6 },
        { a: 24_000, da: 10, b: 40_000, db: 6, c: 30_000, dc: 8 },
        { a: 36_000, da: 8, b: 24_000, db: 12, c: 48_000, dc: 6 },
        { a: 28_000, da: 9, b: 42_000, db: 6, c: 21_000, dc: 12 },
        { a: 30_000, da: 12, b: 45_000, db: 8, c: 70_000, dc: 1 },
        { a: 32_000, da: 9, b: 48_000, db: 6, c: 50_000, dc: 2 },
        { a: 45_000, da: 8, b: 35_000, db: 12, c: 60_000, dc: 3 },
        { a: 50_000, da: 6, b: 40_000, db: 10, c: 30_000, dc: 4 },
        { a: 36_000, da: 10, b: 54_000, db: 8, c: 80_000, dc: 5 },
        { a: 60_000, da: 7, b: 45_000, db: 9, c: 80_000, dc: 7 },
        { a: 42_000, da: 11, b: 56_000, db: 6, c: 75_000, dc: 9 },
        { a: 48_000, da: 8, b: 72_000, db: 10, c: 65_000, dc: 10 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, s.da, money(s.a))]),
        partner(partnerB, [segment(0, s.db, money(s.b))]),
        partner(partnerC, [segment(0, s.dc, money(s.c))]),
      ], money(108_000));
      break;
    }
    case "findCapitalRatioFromPartnerShareRelations": {
      const s = random.pick([
        { a: 20_000, da: 12, b: 30_000, db: 8, c: 40_000, dc: 6 },
        { a: 24_000, da: 10, b: 40_000, db: 6, c: 30_000, dc: 8 },
        { a: 36_000, da: 8, b: 24_000, db: 12, c: 48_000, dc: 6 },
        { a: 28_000, da: 9, b: 42_000, db: 6, c: 21_000, dc: 12 },
        { a: 30_000, da: 12, b: 45_000, db: 8, c: 70_000, dc: 1 },
        { a: 32_000, da: 9, b: 48_000, db: 6, c: 50_000, dc: 2 },
        { a: 45_000, da: 8, b: 35_000, db: 12, c: 60_000, dc: 3 },
        { a: 50_000, da: 6, b: 40_000, db: 10, c: 30_000, dc: 4 },
        { a: 36_000, da: 10, b: 54_000, db: 8, c: 80_000, dc: 5 },
        { a: 60_000, da: 7, b: 45_000, db: 9, c: 80_000, dc: 7 },
        { a: 42_000, da: 11, b: 56_000, db: 6, c: 75_000, dc: 9 },
        { a: 48_000, da: 8, b: 72_000, db: 10, c: 65_000, dc: 10 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, s.da, money(s.a))]),
        partner(partnerB, [segment(0, s.db, money(s.b))]),
        partner(partnerC, [segment(0, s.dc, money(s.c))]),
      ], money(108_000));
      break;
    }
    case "findTotalProfitFromSleepingPartnerReceipt": {
      const s = random.pick([
        { a: 20_000, b: 40_000, salary: 12_000, gross: 120_000 },
        { a: 30_000, b: 45_000, salary: 15_000, gross: 150_000 },
        { a: 25_000, b: 50_000, salary: 10_000, gross: 130_000 },
        { a: 40_000, b: 60_000, salary: 20_000, gross: 180_000 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, 12, money(s.a))], "ACTIVE"),
        partner(partnerB, [segment(0, 12, money(s.b))], "SLEEPING"),
      ], money(s.gross), [{
        kind: "SALARY",
        basis: "FIXED_AMOUNT",
        value: rational(money(s.salary)),
        recipientPartnerId: partnerA,
        sequence: 1,
      }]);
      targetPartnerId = partnerB;
      break;
    }
    case "findPartnerReceiptWithSalaryAndDeduction": {
      const s = random.pick([
        { a: 20_000, b: 40_000, salary: 12_000, deduction: 18_000, gross: 120_000 },
        { a: 30_000, b: 45_000, salary: 15_000, deduction: 15_000, gross: 150_000 },
        { a: 25_000, b: 50_000, salary: 10_000, deduction: 15_000, gross: 130_000 },
        { a: 40_000, b: 60_000, salary: 20_000, deduction: 10_000, gross: 180_000 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, 12, money(s.a))], "ACTIVE"),
        partner(partnerB, [segment(0, 12, money(s.b))]),
      ], money(s.gross), [
        {
          kind: "SALARY",
          basis: "FIXED_AMOUNT",
          value: rational(money(s.salary)),
          recipientPartnerId: partnerA,
          sequence: 1,
        },
        {
          kind: "EXPENSE",
          basis: "FIXED_AMOUNT",
          value: rational(money(s.deduction)),
          sequence: 2,
        },
      ]);
      targetPartnerId = random.pick([partnerA, partnerB]);
      extra.deduction = formatPrt001Money(rational(money(s.deduction)));
      break;
    }
    case "findShareWithDynamicCapitalAndPercentCommission": {
      const s = random.pick([
        { a0: 20_000, a1: 30_000, change: 6, b: 25_000, commission: 10, gross: 100_000 },
        { a0: 24_000, a1: 36_000, change: 4, b: 32_000, commission: 10, gross: 120_000 },
        { a0: 30_000, a1: 45_000, change: 8, b: 35_000, commission: 20, gross: 150_000 },
        { a0: 40_000, a1: 50_000, change: 3, b: 45_000, commission: 10, gross: 200_000 },
      ]);
      state = makeState([
        partner(partnerA, [
          segment(0, s.change, money(s.a0)),
          segment(s.change, 12, money(s.a1)),
        ], "ACTIVE"),
        partner(partnerB, [segment(0, 12, money(s.b))]),
      ], money(s.gross), [{
        kind: "COMMISSION",
        basis: "PERCENT_OF_GROSS_PROFIT",
        value: rational(s.commission),
        recipientPartnerId: partnerA,
        sequence: 1,
      }]);
      targetPartnerId = random.pick([partnerA, partnerB]);
      extra.commissionPercent = s.commission;
      break;
    }
    case "findUnknownJoinTimeWithCapitalChangeHistory": {
      const s = random.pick([
        { a0: 20_000, a1: 30_000, change: 6, b: 45_000, join: 4 },
        { a0: 24_000, a1: 36_000, change: 4, b: 40_000, join: 3 },
        { a0: 30_000, a1: 45_000, change: 8, b: 50_000, join: 6 },
        { a0: 40_000, a1: 50_000, change: 3, b: 60_000, join: 5 },
      ]);
      state = makeState([
        partner(partnerA, [
          segment(0, s.change, money(s.a0)),
          segment(s.change, 12, money(s.a1)),
        ]),
        partner(partnerB, [segment(s.join, 12, money(s.b))]),
      ], money(100_000));
      break;
    }
    case "findTotalProfitFromMixedTimelineFinalReceipt": {
      const s = random.pick([
        { a0: 20_000, a1: 30_000, change: 6, b: 25_000, salary: 10_000, gross: 100_000 },
        { a0: 24_000, a1: 36_000, change: 4, b: 32_000, salary: 12_000, gross: 120_000 },
        { a0: 30_000, a1: 45_000, change: 8, b: 35_000, salary: 15_000, gross: 150_000 },
        { a0: 40_000, a1: 50_000, change: 3, b: 45_000, salary: 20_000, gross: 200_000 },
      ]);
      state = makeState([
        partner(partnerA, [
          segment(0, s.change, money(s.a0)),
          segment(s.change, 12, money(s.a1)),
        ], "ACTIVE"),
        partner(partnerB, [segment(0, 12, money(s.b))]),
      ], money(s.gross), [{
        kind: "SALARY",
        basis: "FIXED_AMOUNT",
        value: rational(money(s.salary)),
        recipientPartnerId: partnerA,
        sequence: 1,
      }]);
      targetPartnerId = partnerA;
      break;
    }
    case "findDifferenceBetweenFinalReceiptsInMixedSystem": {
      const s = random.pick([
        { a0: 20_000, a1: 30_000, change: 6, b: 45_000, join: 4, salary: 12_000, gross: 122_000 },
        { a0: 24_000, a1: 36_000, change: 4, b: 40_000, join: 3, salary: 15_000, gross: 135_000 },
        { a0: 30_000, a1: 45_000, change: 8, b: 50_000, join: 6, salary: 20_000, gross: 160_000 },
        { a0: 40_000, a1: 50_000, change: 3, b: 60_000, join: 5, salary: 18_000, gross: 180_000 },
      ]);
      state = makeState([
        partner(partnerA, [
          segment(0, s.change, money(s.a0)),
          segment(s.change, 12, money(s.a1)),
        ], "ACTIVE"),
        partner(partnerB, [segment(s.join, 12, money(s.b))]),
      ], money(s.gross), [{
        kind: "SALARY",
        basis: "FIXED_AMOUNT",
        value: rational(money(s.salary)),
        recipientPartnerId: partnerA,
        sequence: 1,
      }]);
      extra.joinAfterB = formatPrt001Duration(rational(s.join), input.language);
      break;
    }
    default:
      throw new Error(`E2 generator does not support ${input.entry.solveMode}`);
  }

  const solution = solvePrt001State(state);
  const segmentsA = state.partners[0]!.capitalSegments;
  const segmentsB = state.partners[1]!.capitalSegments;
  const segmentsC = state.partners[2]?.capitalSegments;
  const ratio = ratioOf(solution.timeline.weights.map((item) => item.effectiveCapital));
  const capitalRatio = ratioOf(
    state.partners.map((item) => item.capitalSegments[0]!.capital),
  );
  const durationRatio = ratioOf(
    state.partners.map((item) =>
      subtractRational(item.capitalSegments[0]!.end, item.capitalSegments[0]!.start),
    ),
  );
  const salary = solution.pool.executions.find((item) => item.kind === "SALARY")?.amount;
  const targetReceipt = targetPartnerId
    ? solution.finalPartnerReceipts[targetPartnerId]
    : undefined;
  const shareA = solution.distributedShares[partnerA];
  const shareB = solution.distributedShares[partnerB];

  const renderVariables: Record<string, string | number> = {
    partnerA,
    partnerB,
    partnerC,
    partnerD,
    business,
    capitalA: formatPrt001Money(segmentsA[0]!.capital),
    capitalB: formatPrt001Money(segmentsB[0]!.capital),
    capitalC: segmentsC ? formatPrt001Money(segmentsC[0]!.capital) : "",
    initialCapitalA: formatPrt001Money(segmentsA[0]!.capital),
    finalCapitalA: formatPrt001Money(segmentsA.at(-1)!.capital),
    durationA: formatPrt001Duration(subtractRational(segmentsA[0]!.end, segmentsA[0]!.start), input.language),
    durationB: formatPrt001Duration(subtractRational(segmentsB[0]!.end, segmentsB[0]!.start), input.language),
    durationC: segmentsC ? formatPrt001Duration(subtractRational(segmentsC[0]!.end, segmentsC[0]!.start), input.language) : "",
    totalProfit: formatPrt001Money(state.grossProfitOrLoss),
    profitRatioA: ratio[0]!.toString(),
    profitRatioB: ratio[1]!.toString(),
    profitRatioC: ratio[2]?.toString() ?? "",
    capitalRatioA: capitalRatio[0]!.toString(),
    capitalRatioB: capitalRatio[1]!.toString(),
    timeRatioA: durationRatio[0]!.toString(),
    timeRatioB: durationRatio[1]!.toString(),
    targetPartner: targetPartnerId ?? partnerA,
    finalReceipt: targetReceipt ? formatPrt001Money(targetReceipt) : "",
    sleepingPartnerReceipt: targetReceipt ? formatPrt001Money(targetReceipt) : "",
    salary: salary ? formatPrt001Money(salary) : "",
    shareDifference:
      shareA && shareB
        ? formatPrt001Money(abs(subtractRational(shareA, shareB)))
        : "",
    changeMonthA:
      segmentsA.length > 1
        ? formatPrt001Duration(segmentsA[1]!.start, input.language)
        : "",
    ...extra,
  };

  return {
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
    language: input.language,
    entry: input.entry,
    state,
    partnerA,
    partnerB,
    partnerC,
    targetPartnerId,
    renderVariables,
  };
}
