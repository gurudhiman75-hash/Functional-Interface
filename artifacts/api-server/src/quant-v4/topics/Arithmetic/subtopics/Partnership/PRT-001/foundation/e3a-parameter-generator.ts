import objectPoolsSource from "../object-pools.library.json" assert { type: "json" };
import { normalizeRatio, rational, subtractRational } from "./math";
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

export function isPrt001E3ASolveMode(solveMode: string): boolean {
  return new Set([
    "findTotalProfitFromShareDifferenceAndWeights",
    "findUnknownPercentageCapitalChange",
    "findInitialCapitalFromFinalShareAndChangeHistory",
    "findDurationRatioFromPartnerShareRelations",
    "findUnknownCommissionPercentFromFinalReceipt",
    "findUnknownDeductionFromPartnerShare",
    "findProfitRatioFromFinalReceiptsWhenOnePartnerGetsSalary",
  ]).has(solveMode);
}

export function generatePrt001E3AParameters(input: { questionLanguageId: string; seed: string; entry: Prt001TaskRegistryEntry; language: Prt001Language; }): Prt001PilotParameters {
  const random = createPrt001Random(input.seed);
  const names = random.shuffle([...new Set(objectPools.partnerPairs.flat())]);
  const [partnerA, partnerB, partnerC] = names;
  if (!partnerA || !partnerB || !partnerC) throw new Error("E3A requires three partner names");
  const business = localizePrt001Business(random.pick(objectPools.businesses), input.language);
  const scale = random.pick([1, 2, 3]);
  const money = (value: number) => value * scale;
  let state: PartnershipState;

  switch (input.entry.solveMode) {
    case "findTotalProfitFromShareDifferenceAndWeights": {
      const s = random.pick([
        { a: 20_000, da: 12, b: 30_000, db: 6, gross: 140_000 },
        { a: 24_000, da: 12, b: 30_000, db: 8, gross: 165_000 },
        { a: 35_000, da: 6, b: 28_000, db: 10, gross: 140_000 },
        { a: 42_000, da: 8, b: 30_000, db: 12, gross: 145_000 },
      ]);
      state = makeState([partner(partnerA, [segment(0, s.da, money(s.a))]), partner(partnerB, [segment(0, s.db, money(s.b))])], money(s.gross));
      break;
    }
    case "findUnknownPercentageCapitalChange": {
      const s = random.pick([
        { a0: 40_000, pct: 50, change: 6, b: 50_000 },
        { a0: 40_000, pct: 25, change: 4, b: 40_000 },
        { a0: 30_000, pct: 20, change: 6, b: 30_000 },
        { a0: 50_000, pct: 40, change: 3, b: 60_000 },
      ]);
      const a1 = s.a0 * (100 + s.pct) / 100;
      state = makeState([partner(partnerA, [segment(0, s.change, money(s.a0)), segment(s.change, 12, money(a1))]), partner(partnerB, [segment(0, 12, money(s.b))])], money(180_000));
      break;
    }
    case "findInitialCapitalFromFinalShareAndChangeHistory": {
      const s = random.pick([
        { a0: 40_000, add: 20_000, change: 6, b: 50_000 },
        { a0: 30_000, add: 30_000, change: 6, b: 36_000 },
        { a0: 24_000, add: 12_000, change: 4, b: 40_000 },
        { a0: 50_000, add: 25_000, change: 8, b: 50_000 },
      ]);
      const partners = [partner(partnerA, [segment(0, s.change, money(s.a0)), segment(s.change, 12, money(s.a0 + s.add))]), partner(partnerB, [segment(0, 12, money(s.b))])];
      state = makeState(partners, money(cleanGross(partners)));
      break;
    }
    case "findDurationRatioFromPartnerShareRelations": {
      const s = random.pick([
        { a: 20_000, da: 12, b: 30_000, db: 8, c: 40_000, dc: 6 },
        { a: 24_000, da: 10, b: 40_000, db: 6, c: 30_000, dc: 12 },
        { a: 30_000, da: 10, b: 25_000, db: 12, c: 40_000, dc: 6 },
        { a: 28_000, da: 9, b: 42_000, db: 6, c: 21_000, dc: 12 },
      ]);
      state = makeState([partner(partnerA, [segment(0, s.da, money(s.a))]), partner(partnerB, [segment(0, s.db, money(s.b))]), partner(partnerC, [segment(0, s.dc, money(s.c))])], money(180_000));
      break;
    }
    case "findUnknownCommissionPercentFromFinalReceipt": {
      const s = random.pick([
        { a: 30_000, b: 45_000, pct: 10, gross: 150_000 },
        { a: 40_000, b: 60_000, pct: 20, gross: 200_000 },
        { a: 50_000, b: 50_000, pct: 10, gross: 180_000 },
        { a: 30_000, b: 60_000, pct: 25, gross: 240_000 },
      ]);
      state = makeState([partner(partnerA, [segment(0, 12, money(s.a))], "ACTIVE"), partner(partnerB, [segment(0, 12, money(s.b))])], money(s.gross), [{ kind: "COMMISSION", basis: "PERCENT_OF_GROSS_PROFIT", value: rational(s.pct), recipientPartnerId: partnerA, sequence: 1 }]);
      break;
    }
    case "findUnknownDeductionFromPartnerShare": {
      const s = random.pick([
        { a: 40_000, b: 60_000, deduction: 20_000, gross: 120_000 },
        { a: 30_000, b: 60_000, deduction: 30_000, gross: 150_000 },
        { a: 45_000, b: 75_000, deduction: 24_000, gross: 184_000 },
        { a: 80_000, b: 60_000, deduction: 20_000, gross: 160_000 },
      ]);
      state = makeState([partner(partnerA, [segment(0, 12, money(s.a))]), partner(partnerB, [segment(0, 12, money(s.b))])], money(s.gross), [{ kind: "EXPENSE", basis: "FIXED_AMOUNT", value: rational(money(s.deduction)), sequence: 1 }]);
      break;
    }
    case "findProfitRatioFromFinalReceiptsWhenOnePartnerGetsSalary": {
      const s = random.pick([
        { a: 30_000, b: 45_000, salary: 15_000, gross: 150_000 },
        { a: 40_000, b: 60_000, salary: 20_000, gross: 220_000 },
        { a: 30_000, b: 60_000, salary: 18_000, gross: 198_000 },
        { a: 50_000, b: 30_000, salary: 24_000, gross: 184_000 },
      ]);
      state = makeState([partner(partnerA, [segment(0, 12, money(s.a))], "ACTIVE"), partner(partnerB, [segment(0, 12, money(s.b))])], money(s.gross), [{ kind: "SALARY", basis: "FIXED_AMOUNT", value: rational(money(s.salary)), recipientPartnerId: partnerA, sequence: 1 }]);
      break;
    }
    default:
      throw new Error(`E3A generator does not support ${input.entry.solveMode}`);
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
    changeMonthA: a!.capitalSegments[1] ? formatPrt001Duration(a!.capitalSegments[1]!.start, input.language) : "",
    capitalBFull: formatPrt001Money(b0.capital),
    totalProfit: formatPrt001Money(state.grossProfitOrLoss),
    profitRatioA: ratio[0]?.toString() ?? "",
    profitRatioB: ratio[1]?.toString() ?? "",
    profitRatioC: ratio[2]?.toString() ?? "",
  };
  if (a!.capitalSegments[1]) renderVariables.addedCapitalA = formatPrt001Money(subtractRational(a!.capitalSegments[1]!.capital, a0.capital));
  const shareA = solution.distributedShares[partnerA]!;
  const shareB = solution.distributedShares[partnerB]!;
  renderVariables.knownShare = formatPrt001Money(input.entry.solveMode === "findUnknownDeductionFromPartnerShare" ? shareB : shareA);
  const difference = subtractRational(shareA, shareB);
  renderVariables.shareDifference = formatPrt001Money(difference.numerator < 0n ? rational(-difference.numerator, difference.denominator) : difference);
  const salary = state.allocations.find((item) => item.kind === "SALARY");
  if (salary) renderVariables.salary = formatPrt001Money(salary.value);
  renderVariables.finalReceipt = formatPrt001Money(solution.finalPartnerReceipts[partnerA]!);
  renderVariables.finalReceiptA = formatPrt001Money(solution.finalPartnerReceipts[partnerA]!);
  renderVariables.finalReceiptB = formatPrt001Money(solution.finalPartnerReceipts[partnerB]!);

  return { questionLanguageId: input.questionLanguageId, seed: input.seed, language: input.language, entry: input.entry, state, partnerA, partnerB, partnerC, targetPartnerId: input.entry.solveMode === "findUnknownDeductionFromPartnerShare" ? partnerB : partnerA, renderVariables };
}
