import objectPoolsSource from "../object-pools.library.json" assert { type: "json" };
import { rational, subtractRational } from "./math";
import { formatPrt001Duration, formatPrt001Money, localizePrt001Business } from "./parameter-generator";
import { createPrt001Random } from "./random";
import { solvePrt001State } from "./solver";
import type { CapitalSegment, Partner, PartnershipState, PreDistributionAllocation, Prt001Language, Prt001PilotParameters, Prt001TaskRegistryEntry } from "./types";

interface ObjectPools { partnerPairs: [string, string][]; businesses: string[]; }
const objectPools = objectPoolsSource as unknown as ObjectPools;
const segment = (start: number, end: number, capital: number): CapitalSegment => ({ start: rational(start), end: rational(end), capital: rational(capital) });
const partner = (partnerId: string, capitalSegments: readonly CapitalSegment[], role: Partner["role"] = "UNSPECIFIED"): Partner => ({ partnerId, role, capitalSegments });
function makeState(partners: readonly Partner[], grossProfitOrLoss: number, allocations: readonly PreDistributionAllocation[] = []): PartnershipState {
  return { totalDuration: rational(12), grossProfitOrLoss: rational(grossProfitOrLoss), partners, allocations, moneyUnit: "RUPEE", timeUnit: "MONTH" };
}
function cleanGross(partners: readonly Partner[], perPart = 30_000): number {
  const probe = solvePrt001State(makeState(partners, 1));
  const parts = probe.normalizedRatio.reduce((sum, item) => sum + item, 0n);
  return Number(parts) * perPart;
}

export function isPrt001E3BSolveMode(solveMode: string): boolean {
  return new Set([
    "findEqualFinalReceiptsConditionWithRemuneration",
    "findReverseContributionFromMixedPartnerRelations",
    "findUnknownCapitalFromProfitRatio",
    "findTotalProfitFromPartnerShareCapitalDuration",
    "findUnknownJoinTimeFromPartnerShare",
    "findUnknownWithdrawnCapitalFromProfitRatio",
    "findTotalProfitFromDifferenceBetweenTwoShares",
  ]).has(solveMode);
}

export function generatePrt001E3BParameters(input: { questionLanguageId: string; seed: string; entry: Prt001TaskRegistryEntry; language: Prt001Language; }): Prt001PilotParameters {
  const random = createPrt001Random(input.seed);
  const names = random.shuffle([...new Set(objectPools.partnerPairs.flat())]);
  const [partnerA, partnerB, partnerC] = names;
  if (!partnerA || !partnerB || !partnerC) throw new Error("E3B requires three partner names");
  const business = localizePrt001Business(random.pick(objectPools.businesses), input.language);
  const scale = random.pick([1, 2, 3]);
  const money = (value: number) => value * scale;
  let state: PartnershipState;

  switch (input.entry.solveMode) {
    case "findEqualFinalReceiptsConditionWithRemuneration": {
      const s = random.pick([
        { a: 40_000, b: 60_000, gross: 180_000, salary: 30_000 },
        { a: 30_000, b: 45_000, gross: 150_000, salary: 25_000 },
        { a: 50_000, b: 100_000, gross: 240_000, salary: 60_000 },
        { a: 60_000, b: 90_000, gross: 270_000, salary: 45_000 },
      ]);
      state = makeState([partner(partnerA, [segment(0, 12, money(s.a))], "ACTIVE"), partner(partnerB, [segment(0, 12, money(s.b))])], money(s.gross), [{ kind: "SALARY", basis: "FIXED_AMOUNT", value: rational(money(s.salary)), recipientPartnerId: partnerA, sequence: 1 }]);
      break;
    }
    case "findReverseContributionFromMixedPartnerRelations": {
      const s = random.pick([
        { a0: 40_000, a1: 60_000, change: 6, b: 75_000, join: 4, salary: 20_000, gross: 140_000 },
        { a0: 30_000, a1: 45_000, change: 4, b: 60_000, join: 4, salary: 15_000, gross: 135_000 },
        { a0: 50_000, a1: 70_000, change: 6, b: 60_000, join: 3, salary: 30_000, gross: 170_000 },
        { a0: 36_000, a1: 54_000, change: 8, b: 54_000, join: 5, salary: 18_000, gross: 158_000 },
      ]);
      state = makeState([partner(partnerA, [segment(0, s.change, money(s.a0)), segment(s.change, 12, money(s.a1))], "ACTIVE"), partner(partnerB, [segment(s.join, 12, money(s.b))])], money(s.gross), [{ kind: "SALARY", basis: "FIXED_AMOUNT", value: rational(money(s.salary)), recipientPartnerId: partnerA, sequence: 1 }]);
      break;
    }
    case "findUnknownCapitalFromProfitRatio": {
      const s = random.pick([
        { a: 40_000, b: 60_000 },
        { a: 30_000, b: 45_000 },
        { a: 50_000, b: 30_000 },
        { a: 72_000, b: 48_000 },
      ]);
      state = makeState([partner(partnerA, [segment(0, 12, money(s.a))]), partner(partnerB, [segment(0, 12, money(s.b))])], money(150_000));
      break;
    }
    case "findTotalProfitFromPartnerShareCapitalDuration": {
      const s = random.pick([
        { a: 20_000, da: 12, b: 30_000, db: 6 },
        { a: 24_000, da: 12, b: 30_000, db: 8 },
        { a: 35_000, da: 6, b: 28_000, db: 10 },
        { a: 42_000, da: 8, b: 30_000, db: 12 },
      ]);
      const partners = [partner(partnerA, [segment(0, s.da, money(s.a))]), partner(partnerB, [segment(0, s.db, money(s.b))])];
      state = makeState(partners, money(cleanGross(partners)));
      break;
    }
    case "findUnknownJoinTimeFromPartnerShare": {
      const s = random.pick([
        { a: 40_000, b: 60_000, join: 4, gross: 120_000 },
        { a: 30_000, b: 60_000, join: 6, gross: 120_000 },
        { a: 40_000, b: 60_000, join: 6, gross: 140_000 },
        { a: 50_000, b: 40_000, join: 3, gross: 160_000 },
      ]);
      state = makeState([partner(partnerA, [segment(0, 12, money(s.a))]), partner(partnerB, [segment(s.join, 12, money(s.b))])], money(s.gross));
      break;
    }
    case "findUnknownWithdrawnCapitalFromProfitRatio": {
      const s = random.pick([
        { a0: 80_000, a1: 60_000, change: 6, b: 70_000 },
        { a0: 60_000, a1: 30_000, change: 4, b: 40_000 },
        { a0: 90_000, a1: 60_000, change: 8, b: 75_000 },
        { a0: 100_000, a1: 50_000, change: 6, b: 60_000 },
      ]);
      state = makeState([partner(partnerA, [segment(0, s.change, money(s.a0)), segment(s.change, 12, money(s.a1))]), partner(partnerB, [segment(0, 12, money(s.b))])], money(180_000));
      break;
    }
    case "findTotalProfitFromDifferenceBetweenTwoShares": {
      const s = random.pick([
        { a: 20_000, da: 12, b: 30_000, db: 6, c: 40_000, dc: 6, gross: 220_000 },
        { a: 24_000, da: 12, b: 30_000, db: 8, c: 36_000, dc: 6, gross: 310_000 },
        { a: 35_000, da: 6, b: 28_000, db: 10, c: 42_000, dc: 8, gross: 295_000 },
        { a: 42_000, da: 8, b: 30_000, db: 12, c: 24_000, dc: 9, gross: 190_000 },
      ]);
      state = makeState([partner(partnerA, [segment(0, s.da, money(s.a))]), partner(partnerB, [segment(0, s.db, money(s.b))]), partner(partnerC, [segment(0, s.dc, money(s.c))])], money(s.gross));
      break;
    }
    default:
      throw new Error(`E3B generator does not support ${input.entry.solveMode}`);
  }

  const solution = solvePrt001State(state);
  const [a, b, c] = state.partners;
  const a0 = a!.capitalSegments[0]!;
  const b0 = b!.capitalSegments[0]!;
  const c0 = c?.capitalSegments[0];
  const ratio = solution.normalizedRatio;
  const renderVariables: Record<string, string | number> = {
    partnerA, partnerB, partnerC, business,
    capitalA: formatPrt001Money(a0.capital),
    capitalB: formatPrt001Money(b0.capital),
    capitalC: c0 ? formatPrt001Money(c0.capital) : "",
    durationA: formatPrt001Duration(subtractRational(a0.end, a0.start), input.language),
    durationB: formatPrt001Duration(subtractRational(b0.end, b0.start), input.language),
    durationC: c0 ? formatPrt001Duration(subtractRational(c0.end, c0.start), input.language) : "",
    initialCapitalA: formatPrt001Money(a0.capital),
    finalCapitalA: a!.capitalSegments[1] ? formatPrt001Money(a!.capitalSegments[1]!.capital) : "",
    changeMonthA: a!.capitalSegments[1] ? formatPrt001Duration(a!.capitalSegments[1]!.start, input.language) : "",
    joinAfterB: formatPrt001Duration(b0.start, input.language),
    totalProfit: formatPrt001Money(state.grossProfitOrLoss),
    profitRatioA: ratio[0]?.toString() ?? "",
    profitRatioB: ratio[1]?.toString() ?? "",
  };
  const salary = state.allocations.find((item) => item.kind === "SALARY");
  if (salary) renderVariables.salary = formatPrt001Money(salary.value);
  const shareA = solution.distributedShares[partnerA]!;
  const shareB = solution.distributedShares[partnerB]!;
  renderVariables.knownShare = formatPrt001Money(input.entry.solveMode === "findUnknownJoinTimeFromPartnerShare" ? shareB : shareA);
  const difference = subtractRational(shareA, shareB);
  renderVariables.shareDifference = formatPrt001Money(difference.numerator < 0n ? rational(-difference.numerator, difference.denominator) : difference);
  renderVariables.finalReceiptA = formatPrt001Money(solution.finalPartnerReceipts[partnerA]!);
  renderVariables.finalReceiptB = formatPrt001Money(solution.finalPartnerReceipts[partnerB]!);

  return { questionLanguageId: input.questionLanguageId, seed: input.seed, language: input.language, entry: input.entry, state, partnerA, partnerB, partnerC, targetPartnerId: input.entry.solveMode === "findUnknownJoinTimeFromPartnerShare" ? partnerB : partnerA, renderVariables };
}
