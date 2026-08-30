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

function relationText(
  language: Prt001Language,
  relation: "DOUBLE_A" | "ONE_AND_HALF_A",
  partnerA: string,
): string {
  if (relation === "DOUBLE_A") {
    if (language === "hi") return `${partnerA} की पूंजी का दोगुना`;
    if (language === "pa") return `${partnerA} ਦੀ ਪੂੰਜੀ ਦਾ ਦੁੱਗਣਾ`;
    return `twice ${partnerA}'s capital`;
  }
  if (language === "hi") return `${partnerA} की पूंजी का डेढ़ गुना`;
  if (language === "pa") return `${partnerA} ਦੀ ਪੂੰਜੀ ਦਾ ਡੇਢ ਗੁਣਾ`;
  return `one and a half times ${partnerA}'s capital`;
}

export function isPrt001E1SolveMode(solveMode: string): boolean {
  return new Set([
    "findProfitRatioWithJoinAndLeaveEvents",
    "findUnknownLeaveTimeFromProfitRatio",
    "findUnknownCapitalOfLateJoiningPartner",
    "findProfitRatioAfterPercentageCapitalIncrease",
    "findProfitRatioWithChangesForMultiplePartners",
    "findSharesFromCapitalMultiplesAndDurations",
    "findTotalProfitFromActivePartnerFinalReceipt",
    "findPartnerReceiptsWithMultipleOrderedAllocations",
    "findProfitRatioWithJoinLeaveAndCapitalChange",
    "findUnknownCapitalWithStaggeredParticipation",
  ]).has(solveMode);
}

export function generatePrt001E1Parameters(input: {
  questionLanguageId: string;
  seed: string;
  entry: Prt001TaskRegistryEntry;
  language: Prt001Language;
}): Prt001PilotParameters {
  const random = createPrt001Random(input.seed);
  const names = random.shuffle([...new Set(objectPools.partnerPairs.flat())]);
  const [partnerA, partnerB, partnerC] = names;
  if (!partnerA || !partnerB || !partnerC) throw new Error("E1 requires three partner names");
  const business = localizePrt001Business(random.pick(objectPools.businesses), input.language);
  const scale = random.pick([1, 2, 3]);
  const money = (value: number) => value * scale;
  let state: PartnershipState;
  let targetPartnerId: string | undefined;
  const extra: Record<string, string | number> = {};

  switch (input.entry.solveMode) {
    case "findProfitRatioWithJoinAndLeaveEvents": {
      const scenario = random.pick([
        { a: 30_000, leave: 8, b: 40_000, join: 3 },
        { a: 45_000, leave: 9, b: 30_000, join: 4 },
        { a: 24_000, leave: 10, b: 36_000, join: 5 },
        { a: 36_000, leave: 7, b: 28_000, join: 2 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, scenario.leave, money(scenario.a))]),
        partner(partnerB, [segment(scenario.join, 12, money(scenario.b))]),
      ], money(90_000));
      extra.leaveAfterA = formatPrt001Duration(rational(scenario.leave), input.language);
      extra.joinAfterB = formatPrt001Duration(rational(scenario.join), input.language);
      break;
    }
    case "findUnknownLeaveTimeFromProfitRatio": {
      const scenario = random.pick([
        { a: 30_000, leave: 8, b: 20_000 },
        { a: 24_000, leave: 10, b: 30_000 },
        { a: 40_000, leave: 9, b: 30_000 },
        { a: 36_000, leave: 6, b: 18_000 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, scenario.leave, money(scenario.a))]),
        partner(partnerB, [segment(0, 12, money(scenario.b))]),
      ], money(72_000));
      break;
    }
    case "findUnknownCapitalOfLateJoiningPartner": {
      const scenario = random.pick([
        { a: 40_000, join: 4, b: 60_000 },
        { a: 45_000, join: 3, b: 40_000 },
        { a: 30_000, join: 6, b: 60_000 },
        { a: 36_000, join: 4, b: 54_000 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, 12, money(scenario.a))]),
        partner(partnerB, [segment(scenario.join, 12, money(scenario.b))]),
      ], money(84_000));
      extra.joinAfterB = formatPrt001Duration(rational(scenario.join), input.language);
      break;
    }
    case "findProfitRatioAfterPercentageCapitalIncrease": {
      const scenario = random.pick([
        { a0: 20_000, a1: 30_000, pct: 50, change: 6, b: 25_000 },
        { a0: 24_000, a1: 30_000, pct: 25, change: 4, b: 28_000 },
        { a0: 30_000, a1: 36_000, pct: 20, change: 8, b: 32_000 },
        { a0: 40_000, a1: 50_000, pct: 25, change: 3, b: 45_000 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, scenario.change, money(scenario.a0)), segment(scenario.change, 12, money(scenario.a1))]),
        partner(partnerB, [segment(0, 12, money(scenario.b))]),
      ], money(96_000));
      extra.percentageChangeA = scenario.pct;
      extra.changeMonthA = formatPrt001Duration(rational(scenario.change), input.language);
      break;
    }
    case "findProfitRatioWithChangesForMultiplePartners": {
      const scenario = random.pick([
        { a0: 20_000, a1: 30_000, ap: 50, ac: 6, b0: 40_000, b1: 30_000, bp: 25, bc: 4 },
        { a0: 24_000, a1: 30_000, ap: 25, ac: 4, b0: 36_000, b1: 27_000, bp: 25, bc: 6 },
        { a0: 30_000, a1: 36_000, ap: 20, ac: 8, b0: 40_000, b1: 30_000, bp: 25, bc: 6 },
        { a0: 32_000, a1: 40_000, ap: 25, ac: 3, b0: 48_000, b1: 36_000, bp: 25, bc: 9 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, scenario.ac, money(scenario.a0)), segment(scenario.ac, 12, money(scenario.a1))]),
        partner(partnerB, [segment(0, scenario.bc, money(scenario.b0)), segment(scenario.bc, 12, money(scenario.b1))]),
      ], money(108_000));
      extra.percentageChangeA = scenario.ap;
      extra.changeMonthA = formatPrt001Duration(rational(scenario.ac), input.language);
      extra.initialCapitalB = formatPrt001Money(rational(money(scenario.b0)));
      extra.percentageDecreaseB = scenario.bp;
      extra.changeMonthB = formatPrt001Duration(rational(scenario.bc), input.language);
      break;
    }
    case "findSharesFromCapitalMultiplesAndDurations": {
      const scenario = random.pick([
        { a: 20_000, da: 12, db: 6, dc: 8 },
        { a: 24_000, da: 10, db: 8, dc: 6 },
        { a: 30_000, da: 8, db: 6, dc: 12 },
        { a: 16_000, da: 12, db: 9, dc: 8 },
      ]);
      const b = scenario.a * 2;
      const c = (scenario.a * 3) / 2;
      const provisional = makeState([
        partner(partnerA, [segment(0, scenario.da, money(scenario.a))]),
        partner(partnerB, [segment(0, scenario.db, money(b))]),
        partner(partnerC, [segment(0, scenario.dc, money(c))]),
      ], 1);
      const ratio = normalizeRatio(solvePrt001State(provisional).timeline.weights.map((item) => item.effectiveCapital));
      const totalProfit = Number(ratio.reduce((sum, part) => sum + part, 0n)) * money(6_000);
      state = { ...provisional, grossProfitOrLoss: rational(totalProfit) };
      targetPartnerId = random.pick([partnerA, partnerB, partnerC]);
      extra.capitalRelationB = relationText(input.language, "DOUBLE_A", partnerA);
      extra.capitalRelationC = relationText(input.language, "ONE_AND_HALF_A", partnerA);
      break;
    }
    case "findTotalProfitFromActivePartnerFinalReceipt": {
      const scenario = random.pick([
        { a: 20_000, b: 40_000, salary: 12_000, gross: 120_000 },
        { a: 30_000, b: 45_000, salary: 15_000, gross: 150_000 },
        { a: 25_000, b: 35_000, salary: 10_000, gross: 130_000 },
        { a: 40_000, b: 60_000, salary: 20_000, gross: 180_000 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, 12, money(scenario.a))], "ACTIVE"),
        partner(partnerB, [segment(0, 12, money(scenario.b))], "SLEEPING"),
      ], money(scenario.gross), [{
        kind: "SALARY",
        basis: "FIXED_AMOUNT",
        value: rational(money(scenario.salary)),
        recipientPartnerId: partnerA,
        sequence: 1,
      }]);
      targetPartnerId = partnerA;
      break;
    }
    case "findPartnerReceiptsWithMultipleOrderedAllocations": {
      const scenario = random.pick([
        { a: 20_000, b: 30_000, gross: 120_000, reserve: 10_000, commission: 10 },
        { a: 30_000, b: 45_000, gross: 150_000, reserve: 15_000, commission: 20 },
        { a: 25_000, b: 35_000, gross: 140_000, reserve: 14_000, commission: 10 },
        { a: 40_000, b: 60_000, gross: 200_000, reserve: 20_000, commission: 15 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, 12, money(scenario.a))], "ACTIVE"),
        partner(partnerB, [segment(0, 12, money(scenario.b))]),
      ], money(scenario.gross), [
        { kind: "RESERVE", basis: "FIXED_AMOUNT", value: rational(money(scenario.reserve)), sequence: 1 },
        { kind: "COMMISSION", basis: "PERCENT_OF_POST_DEDUCTION_POOL", value: rational(scenario.commission), recipientPartnerId: partnerA, sequence: 2 },
      ]);
      targetPartnerId = random.pick([partnerA, partnerB]);
      extra.reserve = formatPrt001Money(rational(money(scenario.reserve)));
      extra.commissionPercent = scenario.commission;
      break;
    }
    case "findProfitRatioWithJoinLeaveAndCapitalChange": {
      const scenario = random.pick([
        { a0: 20_000, a1: 30_000, change: 4, leave: 9, b: 40_000, join: 3 },
        { a0: 30_000, a1: 45_000, change: 5, leave: 10, b: 36_000, join: 2 },
        { a0: 24_000, a1: 36_000, change: 3, leave: 8, b: 30_000, join: 4 },
        { a0: 40_000, a1: 50_000, change: 6, leave: 11, b: 45_000, join: 5 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, scenario.change, money(scenario.a0)), segment(scenario.change, scenario.leave, money(scenario.a1))]),
        partner(partnerB, [segment(scenario.join, 12, money(scenario.b))]),
      ], money(120_000));
      extra.addedCapitalA = formatPrt001Money(rational(money(scenario.a1 - scenario.a0)));
      extra.changeMonthA = formatPrt001Duration(rational(scenario.change), input.language);
      extra.leaveAfterA = formatPrt001Duration(rational(scenario.leave), input.language);
      extra.joinAfterB = formatPrt001Duration(rational(scenario.join), input.language);
      break;
    }
    case "findUnknownCapitalWithStaggeredParticipation": {
      const scenario = random.pick([
        { a: 20_000, b: 30_000, bj: 4, c: 40_000, cj: 6 },
        { a: 30_000, b: 45_000, bj: 3, c: 60_000, cj: 6 },
        { a: 24_000, b: 36_000, bj: 2, c: 48_000, cj: 8 },
        { a: 40_000, b: 30_000, bj: 4, c: 50_000, cj: 5 },
      ]);
      state = makeState([
        partner(partnerA, [segment(0, 12, money(scenario.a))]),
        partner(partnerB, [segment(scenario.bj, 12, money(scenario.b))]),
        partner(partnerC, [segment(scenario.cj, 12, money(scenario.c))]),
      ], money(150_000));
      extra.joinAfterB = formatPrt001Duration(rational(scenario.bj), input.language);
      extra.joinAfterC = formatPrt001Duration(rational(scenario.cj), input.language);
      break;
    }
    default:
      throw new Error(`E1 generator does not support ${input.entry.solveMode}`);
  }

  const solution = solvePrt001State(state);
  const ratio = normalizeRatio(solution.timeline.weights.map((item) => item.effectiveCapital));
  const firstA = state.partners[0]!.capitalSegments[0]!;
  const firstB = state.partners[1]!.capitalSegments[0]!;
  const firstC = state.partners[2]?.capitalSegments[0];
  const salary = solution.pool.executions.find((item) => item.kind === "SALARY")?.amount;
  const finalReceipt = targetPartnerId ? solution.finalPartnerReceipts[targetPartnerId] : undefined;

  const renderVariables: Record<string, string | number> = {
    partnerA,
    partnerB,
    partnerC,
    business,
    capitalA: formatPrt001Money(firstA.capital),
    capitalB: formatPrt001Money(firstB.capital),
    initialCapitalA: formatPrt001Money(firstA.capital),
    durationA: formatPrt001Duration(subtractRational(firstA.end, firstA.start), input.language),
    durationB: formatPrt001Duration(subtractRational(firstB.end, firstB.start), input.language),
    durationC: firstC ? formatPrt001Duration(subtractRational(firstC.end, firstC.start), input.language) : "",
    totalProfit: formatPrt001Money(state.grossProfitOrLoss),
    targetPartner: targetPartnerId ?? partnerA,
    salary: salary ? formatPrt001Money(salary) : "",
    finalReceipt: finalReceipt ? formatPrt001Money(finalReceipt) : "",
    profitRatioA: ratio[0]!.toString(),
    profitRatioB: ratio[1]!.toString(),
    profitRatioC: ratio[2]?.toString() ?? "",
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
