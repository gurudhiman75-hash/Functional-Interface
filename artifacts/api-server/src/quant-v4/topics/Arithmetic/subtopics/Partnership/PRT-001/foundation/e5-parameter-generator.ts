import objectPoolsSource from "../object-pools.library.json" assert { type: "json" };
import { rational, subtractRational } from "./math";
import { formatPrt001Duration, formatPrt001Money, localizePrt001Business } from "./parameter-generator";
import { createPrt001Random } from "./random";
import { solvePrt001State } from "./solver";
import type { CapitalSegment, Partner, PartnerRole, PartnershipState, PreDistributionAllocation, Prt001Language, Prt001PilotParameters, Prt001TaskRegistryEntry, Rational } from "./types";

interface ObjectPools { partnerPairs: [string, string][]; businesses: string[]; }
const objectPools = objectPoolsSource as unknown as ObjectPools;
const segment = (start: number, end: number, capital: number): CapitalSegment => ({ start: rational(start), end: rational(end), capital: rational(capital) });
const partner = (partnerId: string, capitalSegments: readonly CapitalSegment[], role: PartnerRole = "UNSPECIFIED"): Partner => ({ partnerId, role, capitalSegments });
function makeState(partners: readonly Partner[], grossProfitOrLoss: number, allocations: readonly PreDistributionAllocation[] = []): PartnershipState {
  return { totalDuration: rational(12), grossProfitOrLoss: rational(grossProfitOrLoss), partners, allocations, moneyUnit: "RUPEE", timeUnit: "MONTH" };
}
function cleanGross(partners: readonly Partner[], perPart = 20_000): number {
  const probe = solvePrt001State(makeState(partners, 1));
  return Number(probe.normalizedRatio.reduce((sum, item) => sum + item, 0n)) * perPart;
}
function abs(value: Rational): Rational { return value.numerator < 0n ? rational(-value.numerator, value.denominator) : value; }

export function isPrt001E5SolveMode(solveMode: string): boolean {
  return new Set([
    "findUnknownCapitalFromPartnerShares",
    "findMissingPartnerShareFromKnownShareAndWeights",
    "findUnknownLeaveTimeFromPartnerShare",
    "findJoinTimeForEqualProfitShares",
    "findLeaveTimeForEqualProfitShares",
    "findShareDifferenceWithStaggeredParticipation",
    "findProfitRatioAfterCapitalWithdrawal",
    "findShareAfterCapitalAddition",
    "findCapitalChangeForEqualProfitShares",
    "compareEffectiveCapitalsAfterDifferentChanges",
    "findSharesFromTimeMultiplesAndCapitals",
    "findPartnerShareWhenOneWeightIsSumOfOthers",
    "findUnknownCapitalFromEqualShareConditionInMultiPartnerSystem",
    "findUnknownDurationFromEqualShareConditionInMultiPartnerSystem",
    "findSleepingPartnerShareWithActivePartnerSalary",
    "findPartnerSharesAfterFixedManagementAllowance",
    "findActivePartnerReceiptWithPercentOfGrossProfitCommission",
    "findSharesAfterReserveDeduction",
    "findSharesAfterExplicitBusinessExpenseDeduction",
  ]).has(solveMode);
}

export function generatePrt001E5Parameters(input: { questionLanguageId: string; seed: string; entry: Prt001TaskRegistryEntry; language: Prt001Language }): Prt001PilotParameters {
  const random = createPrt001Random(input.seed);
  const names = random.shuffle([...new Set(objectPools.partnerPairs.flat())]);
  const [partnerA, partnerB, partnerC] = names;
  if (!partnerA || !partnerB || !partnerC) throw new Error("E5 requires three partner names");
  const business = localizePrt001Business(random.pick(objectPools.businesses), input.language);
  const scale = random.pick([1, 2, 3]);
  const money = (value: number) => value * scale;
  let state: PartnershipState;
  let targetPartnerId: string | undefined;
  const extra: Record<string, string | number> = {};

  switch (input.entry.solveMode) {
    case "findUnknownCapitalFromPartnerShares": {
      const s = random.pick([{a:24_000,b:36_000},{a:30_000,b:50_000},{a:42_000,b:63_000},{a:56_000,b:80_000}]);
      const partners = [partner(partnerA,[segment(0,12,money(s.a))]), partner(partnerB,[segment(0,12,money(s.b))])];
      state = makeState(partners, money(cleanGross(partners, 12_000)));
      targetPartnerId = partnerA;
      break;
    }
    case "findMissingPartnerShareFromKnownShareAndWeights": {
      const s = random.pick([{a:20_000,da:12,b:30_000,db:8},{a:24_000,da:10,b:40_000,db:6},{a:35_000,da:6,b:28_000,db:10},{a:42_000,da:8,b:30_000,db:12}]);
      const partners = [partner(partnerA,[segment(0,s.da,money(s.a))]), partner(partnerB,[segment(0,s.db,money(s.b))])];
      state = makeState(partners, money(cleanGross(partners, 15_000)));
      targetPartnerId = partnerB;
      break;
    }
    case "findUnknownLeaveTimeFromPartnerShare": {
      const s = random.pick([{a:40_000,b:60_000,leave:6},{a:50_000,b:80_000,leave:9},{a:60_000,b:90_000,leave:5},{a:45_000,b:72_000,leave:10}]);
      const partners = [partner(partnerA,[segment(0,12,money(s.a))]), partner(partnerB,[segment(0,s.leave,money(s.b))])];
      state = makeState(partners, money(cleanGross(partners, 18_000)));
      targetPartnerId = partnerB;
      break;
    }
    case "findJoinTimeForEqualProfitShares": {
      const s = random.pick([{a:30_000,b:45_000,join:4},{a:40_000,b:80_000,join:6},{a:45_000,b:60_000,join:3},{a:50_000,b:75_000,join:4}]);
      state = makeState([partner(partnerA,[segment(0,12,money(s.a))]), partner(partnerB,[segment(s.join,12,money(s.b))])], money(100_000));
      targetPartnerId = partnerB;
      break;
    }
    case "findLeaveTimeForEqualProfitShares": {
      const s = random.pick([{a:60_000,leave:6,b:30_000},{a:72_000,leave:8,b:48_000},{a:90_000,leave:4,b:30_000},{a:80_000,leave:9,b:60_000}]);
      state = makeState([partner(partnerA,[segment(0,s.leave,money(s.a))]), partner(partnerB,[segment(0,12,money(s.b))])], money(100_000));
      targetPartnerId = partnerA;
      break;
    }
    case "findShareDifferenceWithStaggeredParticipation": {
      const s = random.pick([
        {a:30_000,b:45_000,c:60_000,jb:3,jc:6},
        {a:40_000,b:60_000,c:72_000,jb:5,jc:7},
        {a:50_000,b:80_000,c:90_000,jb:4,jc:6},
        {a:36_000,b:54_000,c:72_000,jb:6,jc:8},
      ]);
      const partners = [partner(partnerA,[segment(0,12,money(s.a))]), partner(partnerB,[segment(s.jb,12,money(s.b))]), partner(partnerC,[segment(s.jc,12,money(s.c))])];
      state = makeState(partners, money(cleanGross(partners, 12_000)));
      break;
    }
    case "findProfitRatioAfterCapitalWithdrawal": {
      const s = random.pick([{a0:60_000,a1:40_000,change:4,b:50_000},{a0:80_000,a1:60_000,change:6,b:70_000},{a0:90_000,a1:54_000,change:5,b:60_000},{a0:100_000,a1:70_000,change:8,b:75_000}]);
      state = makeState([partner(partnerA,[segment(0,s.change,money(s.a0)),segment(s.change,12,money(s.a1))]), partner(partnerB,[segment(0,12,money(s.b))])], money(120_000));
      extra.withdrawnCapital = formatPrt001Money(rational(money(s.a0 - s.a1)));
      break;
    }
    case "findShareAfterCapitalAddition": {
      const s = random.pick([{a0:40_000,a1:60_000,change:6,b:50_000},{a0:60_000,a1:90_000,change:4,b:70_000},{a0:50_000,a1:80_000,change:8,b:45_000},{a0:80_000,a1:100_000,change:3,b:90_000}]);
      const partners = [partner(partnerA,[segment(0,s.change,money(s.a0)),segment(s.change,12,money(s.a1))]), partner(partnerB,[segment(0,12,money(s.b))])];
      state = makeState(partners, money(cleanGross(partners, 15_000)));
      targetPartnerId = partnerA;
      extra.addedCapital = formatPrt001Money(rational(money(s.a1 - s.a0)));
      break;
    }
    case "findCapitalChangeForEqualProfitShares": {
      const s = random.pick([{a0:40_000,a1:60_000,change:6,b:50_000},{a0:60_000,a1:45_000,change:4,b:50_000},{a0:30_000,a1:60_000,change:8,b:40_000},{a0:60_000,a1:50_000,change:6,b:55_000}]);
      state = makeState([partner(partnerA,[segment(0,s.change,money(s.a0)),segment(s.change,12,money(s.a1))]), partner(partnerB,[segment(0,12,money(s.b))])], money(100_000));
      targetPartnerId = partnerA;
      break;
    }
    case "compareEffectiveCapitalsAfterDifferentChanges": {
      const s = random.pick([
        {a0:40_000,a1:60_000,ca:6,b0:50_000,b1:40_000,cb:4},
        {a0:60_000,a1:90_000,ca:4,b0:40_000,b1:70_000,cb:8},
        {a0:80_000,a1:50_000,ca:6,b0:60_000,b1:90_000,cb:3},
        {a0:50_000,a1:75_000,ca:8,b0:70_000,b1:50_000,cb:6},
      ]);
      state = makeState([partner(partnerA,[segment(0,s.ca,money(s.a0)),segment(s.ca,12,money(s.a1))]), partner(partnerB,[segment(0,s.cb,money(s.b0)),segment(s.cb,12,money(s.b1))])], money(120_000));
      extra.initialCapitalB = formatPrt001Money(rational(money(s.b0)));
      extra.finalCapitalB = formatPrt001Money(rational(money(s.b1)));
      extra.changeMonthB = formatPrt001Duration(rational(s.cb), input.language);
      break;
    }
    case "findSharesFromTimeMultiplesAndCapitals": {
      const s = random.pick([{a:30_000,b:40_000,c:50_000,d:4},{a:40_000,b:30_000,c:60_000,d:6},{a:50_000,b:60_000,c:40_000,d:4},{a:60_000,b:45_000,c:30_000,d:6}]);
      const partners = [partner(partnerA,[segment(0,s.d,money(s.a))]), partner(partnerB,[segment(0,s.d*2,money(s.b))]), partner(partnerC,[segment(0,s.d*3/2,money(s.c))])];
      state = makeState(partners, money(cleanGross(partners, 12_000)));
      targetPartnerId = random.pick([partnerA, partnerB, partnerC]);
      break;
    }
    case "findPartnerShareWhenOneWeightIsSumOfOthers": {
      const s = random.pick([
        {a:20_000,da:12,b:30_000,db:8,c:80_000,dc:6},
        {a:30_000,da:10,b:40_000,db:6,c:60_000,dc:9},
        {a:45_000,da:8,b:30_000,db:12,c:90_000,dc:8},
        {a:40_000,da:6,b:30_000,db:8,c:60_000,dc:8},
      ]);
      const partners = [partner(partnerA,[segment(0,s.da,money(s.a))]), partner(partnerB,[segment(0,s.db,money(s.b))]), partner(partnerC,[segment(0,s.dc,money(s.c))])];
      state = makeState(partners, money(cleanGross(partners, 10_000)));
      targetPartnerId = partnerC;
      break;
    }
    case "findUnknownCapitalFromEqualShareConditionInMultiPartnerSystem": {
      const s = random.pick([{a:20_000,da:12,b:30_000,db:8,c:40_000,dc:6},{a:36_000,da:10,b:45_000,db:8,c:60_000,dc:6},{a:50_000,da:6,b:30_000,db:10,c:60_000,dc:5},{a:42_000,da:8,b:56_000,db:6,c:48_000,dc:7}]);
      state = makeState([partner(partnerA,[segment(0,s.da,money(s.a))]), partner(partnerB,[segment(0,s.db,money(s.b))]), partner(partnerC,[segment(0,s.dc,money(s.c))])], money(120_000));
      targetPartnerId = partnerC;
      break;
    }
    case "findUnknownDurationFromEqualShareConditionInMultiPartnerSystem": {
      const s = random.pick([{a:20_000,da:12,b:30_000,db:8,c:40_000,dc:6},{a:36_000,da:10,b:45_000,db:8,c:60_000,dc:6},{a:50_000,da:6,b:30_000,db:10,c:60_000,dc:5},{a:42_000,da:8,b:56_000,db:6,c:48_000,dc:7}]);
      state = makeState([partner(partnerA,[segment(0,s.da,money(s.a))]), partner(partnerB,[segment(0,s.db,money(s.b))]), partner(partnerC,[segment(0,s.dc,money(s.c))])], money(120_000));
      targetPartnerId = partnerC;
      break;
    }
    case "findSleepingPartnerShareWithActivePartnerSalary": {
      const s = random.pick([{a:20_000,b:40_000,salary:12_000,gross:102_000},{a:40_000,b:60_000,salary:15_000,gross:115_000},{a:60_000,b:80_000,salary:18_000,gross:158_000},{a:80_000,b:100_000,salary:20_000,gross:200_000}]);
      state = makeState([partner(partnerA,[segment(0,12,money(s.a))],"ACTIVE"), partner(partnerB,[segment(0,12,money(s.b))],"SLEEPING")], money(s.gross), [{kind:"SALARY",basis:"FIXED_AMOUNT",value:rational(money(s.salary)),recipientPartnerId:partnerA,sequence:1}]);
      targetPartnerId = partnerB;
      extra.salary = formatPrt001Money(rational(money(s.salary)));
      break;
    }
    case "findPartnerSharesAfterFixedManagementAllowance": {
      const s = random.pick([{a:30_000,b:50_000,allowance:16_000,gross:136_000},{a:40_000,b:60_000,allowance:20_000,gross:120_000},{a:45_000,b:75_000,allowance:24_000,gross:144_000},{a:60_000,b:90_000,allowance:30_000,gross:180_000}]);
      state = makeState([partner(partnerA,[segment(0,12,money(s.a))],"ACTIVE"), partner(partnerB,[segment(0,12,money(s.b))])], money(s.gross), [{kind:"BONUS",basis:"FIXED_AMOUNT",value:rational(money(s.allowance)),recipientPartnerId:partnerA,sequence:1}]);
      targetPartnerId = partnerB;
      extra.allowance = formatPrt001Money(rational(money(s.allowance)));
      break;
    }
    case "findActivePartnerReceiptWithPercentOfGrossProfitCommission": {
      const s = random.pick([{a:40_000,b:60_000,p:10,gross:100_000},{a:30_000,b:60_000,p:20,gross:120_000},{a:60_000,b:40_000,p:10,gross:150_000},{a:80_000,b:100_000,p:20,gross:180_000}]);
      state = makeState([partner(partnerA,[segment(0,12,money(s.a))],"ACTIVE"), partner(partnerB,[segment(0,12,money(s.b))])], money(s.gross), [{kind:"COMMISSION",basis:"PERCENT_OF_GROSS_PROFIT",value:rational(s.p),recipientPartnerId:partnerA,sequence:1}]);
      targetPartnerId = partnerA;
      extra.commissionPercent = s.p;
      break;
    }
    case "findSharesAfterReserveDeduction": {
      const s = random.pick([{a:40_000,b:60_000,reserve:10_000,gross:110_000},{a:30_000,b:60_000,reserve:12_000,gross:102_000},{a:60_000,b:40_000,reserve:15_000,gross:115_000},{a:80_000,b:100_000,reserve:18_000,gross:108_000}]);
      state = makeState([partner(partnerA,[segment(0,12,money(s.a))]), partner(partnerB,[segment(0,12,money(s.b))])], money(s.gross), [{kind:"RESERVE",basis:"FIXED_AMOUNT",value:rational(money(s.reserve)),sequence:1}]);
      targetPartnerId = random.pick([partnerA,partnerB]);
      extra.reserve = formatPrt001Money(rational(money(s.reserve)));
      break;
    }
    case "findSharesAfterExplicitBusinessExpenseDeduction": {
      const s = random.pick([{a:40_000,b:60_000,expense:15_000,gross:115_000},{a:30_000,b:60_000,expense:12_000,gross:102_000},{a:60_000,b:40_000,expense:20_000,gross:120_000},{a:80_000,b:100_000,expense:18_000,gross:108_000}]);
      state = makeState([partner(partnerA,[segment(0,12,money(s.a))]), partner(partnerB,[segment(0,12,money(s.b))])], money(s.gross), [{kind:"EXPENSE",basis:"FIXED_AMOUNT",value:rational(money(s.expense)),sequence:1}]);
      targetPartnerId = random.pick([partnerA,partnerB]);
      extra.expense = formatPrt001Money(rational(money(s.expense)));
      break;
    }
    default: throw new Error(`E5 generator does not support ${input.entry.solveMode}`);
  }

  const solution = solvePrt001State(state);
  const [a,b,c] = state.partners;
  const a0 = a!.capitalSegments[0]!;
  const aLast = a!.capitalSegments[a!.capitalSegments.length - 1]!;
  const b0 = b!.capitalSegments[0]!;
  const c0 = c?.capitalSegments[0];
  const renderVariables: Record<string, string | number> = {
    partnerA, partnerB, partnerC, business,
    capitalA: formatPrt001Money(a0.capital), capitalB: formatPrt001Money(b0.capital), capitalC: c0 ? formatPrt001Money(c0.capital) : "",
    initialCapitalA: formatPrt001Money(a0.capital), finalCapitalA: formatPrt001Money(aLast.capital),
    durationA: formatPrt001Duration(subtractRational(a0.end,a0.start), input.language), durationB: formatPrt001Duration(subtractRational(b0.end,b0.start), input.language), durationC: c0 ? formatPrt001Duration(subtractRational(c0.end,c0.start), input.language) : "",
    joinAfterB: formatPrt001Duration(b0.start,input.language), joinAfterC: c0 ? formatPrt001Duration(c0.start,input.language) : "",
    changeMonthA: a!.capitalSegments.length > 1 ? formatPrt001Duration(aLast.start,input.language) : "",
    totalProfit: formatPrt001Money(state.grossProfitOrLoss), targetPartner: targetPartnerId ?? partnerA,
    ...extra,
  };
  renderVariables.shareA = formatPrt001Money(abs(solution.distributedShares[partnerA]!));
  renderVariables.shareB = formatPrt001Money(abs(solution.distributedShares[partnerB]!));
  renderVariables.knownShare = formatPrt001Money(abs(solution.distributedShares[input.entry.solveMode === "findUnknownLeaveTimeFromPartnerShare" ? partnerB : partnerA]!));
  if (input.entry.solveMode === "findShareAfterCapitalAddition") renderVariables.addedCapital = formatPrt001Money(subtractRational(aLast.capital,a0.capital));
  if (input.entry.solveMode === "findProfitRatioAfterCapitalWithdrawal") renderVariables.withdrawnCapital = formatPrt001Money(abs(subtractRational(aLast.capital,a0.capital)));
  return { questionLanguageId: input.questionLanguageId, seed: input.seed, language: input.language, entry: input.entry, state, partnerA, partnerB, partnerC, targetPartnerId, renderVariables };
}
