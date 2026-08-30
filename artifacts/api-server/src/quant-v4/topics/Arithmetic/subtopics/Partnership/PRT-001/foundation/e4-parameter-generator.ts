import objectPoolsSource from "../object-pools.library.json" assert { type: "json" };
import { rational, subtractRational } from "./math";
import { formatPrt001Duration, formatPrt001Money, localizePrt001Business } from "./parameter-generator";
import { createPrt001Random } from "./random";
import { solvePrt001State } from "./solver";
import type { CapitalSegment, Partner, PartnershipState, Prt001Language, Prt001PilotParameters, Prt001TaskRegistryEntry } from "./types";

interface ObjectPools { partnerPairs: [string, string][]; businesses: string[]; }
const objectPools = objectPoolsSource as unknown as ObjectPools;
const segment = (start: number, end: number, capital: number): CapitalSegment => ({ start: rational(start), end: rational(end), capital: rational(capital) });
const partner = (partnerId: string, capitalSegments: readonly CapitalSegment[]): Partner => ({ partnerId, role: "UNSPECIFIED", capitalSegments });
function makeState(partners: readonly Partner[], grossProfitOrLoss: number): PartnershipState {
  return { totalDuration: rational(12), grossProfitOrLoss: rational(grossProfitOrLoss), partners, allocations: [], moneyUnit: "RUPEE", timeUnit: "MONTH" };
}
function cleanGross(partners: readonly Partner[], perPart = 20_000): number {
  const probe = solvePrt001State(makeState(partners, 1));
  return Number(probe.normalizedRatio.reduce((sum, item) => sum + item, 0n)) * perPart;
}
function absTextMoney(value: ReturnType<typeof rational>): string {
  return formatPrt001Money(value.numerator < 0n ? rational(-value.numerator, value.denominator) : value);
}
function fractionPhrase(kind: "INCREASE_HALF" | "DECREASE_THIRD" | "INCREASE_QUARTER" | "DECREASE_QUARTER", language: Prt001Language): string {
  const phrases = {
    en: { INCREASE_HALF: "increased the capital by one-half", DECREASE_THIRD: "withdrew one-third of the capital", INCREASE_QUARTER: "increased the capital by one-fourth", DECREASE_QUARTER: "withdrew one-fourth of the capital" },
    hi: { INCREASE_HALF: "पूंजी में आधा और जोड़ दिया", DECREASE_THIRD: "पूंजी का एक-तिहाई निकाल लिया", INCREASE_QUARTER: "पूंजी में एक-चौथाई और जोड़ दिया", DECREASE_QUARTER: "पूंजी का एक-चौथाई निकाल लिया" },
    pa: { INCREASE_HALF: "ਪੂੰਜੀ ਵਿੱਚ ਅੱਧਾ ਹੋਰ ਜੋੜ ਦਿੱਤਾ", DECREASE_THIRD: "ਪੂੰਜੀ ਦਾ ਇੱਕ-ਤਿਹਾਈ ਕੱਢ ਲਿਆ", INCREASE_QUARTER: "ਪੂੰਜੀ ਵਿੱਚ ਇੱਕ-ਚੌਥਾਈ ਹੋਰ ਜੋੜ ਦਿੱਤਾ", DECREASE_QUARTER: "ਪੂੰਜੀ ਦਾ ਇੱਕ-ਚੌਥਾਈ ਕੱਢ ਲਿਆ" },
  } as const;
  return phrases[language][kind];
}

export function isPrt001E4SolveMode(solveMode: string): boolean {
  return new Set([
    "findOtherPartnerShareFromKnownShareAndCapitals",
    "findCapitalRatioFromProfitShares",
    "findLossShareFromCapitals",
    "findIndividualCapitalsFromTotalCapitalAndProfitRatio",
    "findCapitalForEqualProfitGivenDurations",
    "findDurationForEqualProfitGivenCapitals",
    "findProfitDifferenceFromCapitalDurationWeights",
    "findProfitRatioWhenPartnerLeavesEarly",
    "findShareWhenPartnerJoinsLater",
    "findUnknownCapitalOfEarlyLeavingPartner",
    "findTotalProfitFromStaggeredPartnerShare",
    "findProfitRatioAfterPercentageCapitalDecrease",
    "findProfitRatioAfterFractionalCapitalChange",
    "findUnknownCapitalChangeTimeFromPartnerShare",
  ]).has(solveMode);
}

export function generatePrt001E4Parameters(input: { questionLanguageId: string; seed: string; entry: Prt001TaskRegistryEntry; language: Prt001Language; }): Prt001PilotParameters {
  const random = createPrt001Random(input.seed);
  const names = random.shuffle([...new Set(objectPools.partnerPairs.flat())]);
  const [partnerA, partnerB, partnerC] = names;
  if (!partnerA || !partnerB || !partnerC) throw new Error("E4 requires three partner names");
  const business = localizePrt001Business(random.pick(objectPools.businesses), input.language);
  const scale = random.pick([1, 2, 3]);
  const money = (value: number) => value * scale;
  let state: PartnershipState;
  let targetPartnerId: string | undefined;
  const extra: Record<string, string | number> = {};

  switch (input.entry.solveMode) {
    case "findOtherPartnerShareFromKnownShareAndCapitals": {
      const s = random.pick([{a:20_000,b:30_000},{a:30_000,b:50_000},{a:40_000,b:70_000},{a:50_000,b:80_000}]);
      const partners = [partner(partnerA,[segment(0,12,money(s.a))]), partner(partnerB,[segment(0,12,money(s.b))])];
      state = makeState(partners, money(cleanGross(partners, 15_000)));
      targetPartnerId = partnerB;
      break;
    }
    case "findCapitalRatioFromProfitShares": {
      const s = random.pick([{a:24_000,b:36_000},{a:30_000,b:50_000},{a:40_000,b:70_000},{a:45_000,b:72_000}]);
      const partners = [partner(partnerA,[segment(0,12,money(s.a))]), partner(partnerB,[segment(0,12,money(s.b))])];
      state = makeState(partners, money(cleanGross(partners, 12_000)));
      break;
    }
    case "findLossShareFromCapitals": {
      const s = random.pick([{a:20_000,b:30_000},{a:30_000,b:45_000},{a:40_000,b:60_000},{a:50_000,b:80_000}]);
      const partners = [partner(partnerA,[segment(0,12,money(s.a))]), partner(partnerB,[segment(0,12,money(s.b))])];
      const loss = money(cleanGross(partners, 10_000));
      state = makeState(partners, -loss);
      targetPartnerId = random.pick([partnerA, partnerB]);
      extra.totalLoss = formatPrt001Money(rational(loss));
      break;
    }
    case "findIndividualCapitalsFromTotalCapitalAndProfitRatio": {
      const s = random.pick([{a:40_000,b:60_000},{a:45_000,b:75_000},{a:56_000,b:98_000},{a:70_000,b:112_000}]);
      state = makeState([partner(partnerA,[segment(0,12,money(s.a))]), partner(partnerB,[segment(0,12,money(s.b))])], money(120_000));
      extra.totalCapital = formatPrt001Money(rational(money(s.a + s.b)));
      targetPartnerId = partnerA;
      break;
    }
    case "findCapitalForEqualProfitGivenDurations": {
      const s = random.pick([{a:20_000,da:12,b:40_000,db:6},{a:24_000,da:10,b:40_000,db:6},{a:36_000,da:8,b:48_000,db:6},{a:60_000,da:7,b:42_000,db:10}]);
      state = makeState([partner(partnerA,[segment(0,s.da,money(s.a))]), partner(partnerB,[segment(0,s.db,money(s.b))])], money(100_000));
      targetPartnerId = partnerA;
      break;
    }
    case "findDurationForEqualProfitGivenCapitals": {
      const s = random.pick([{a:20_000,da:12,b:40_000,db:6},{a:24_000,da:10,b:40_000,db:6},{a:36_000,da:8,b:48_000,db:6},{a:60_000,da:7,b:42_000,db:10}]);
      state = makeState([partner(partnerA,[segment(0,s.da,money(s.a))]), partner(partnerB,[segment(0,s.db,money(s.b))])], money(100_000));
      targetPartnerId = partnerA;
      break;
    }
    case "findProfitDifferenceFromCapitalDurationWeights": {
      const s = random.pick([{a:20_000,da:12,b:30_000,db:6},{a:24_000,da:10,b:40_000,db:6},{a:35_000,da:6,b:28_000,db:10},{a:42_000,da:8,b:30_000,db:12}]);
      const partners = [partner(partnerA,[segment(0,s.da,money(s.a))]), partner(partnerB,[segment(0,s.db,money(s.b))])];
      state = makeState(partners, money(cleanGross(partners, 18_000)));
      break;
    }
    case "findProfitRatioWhenPartnerLeavesEarly": {
      const s = random.pick([{a:40_000,leave:6,b:30_000},{a:60_000,leave:8,b:40_000},{a:72_000,leave:5,b:30_000},{a:50_000,leave:9,b:45_000}]);
      state = makeState([partner(partnerA,[segment(0,s.leave,money(s.a))]), partner(partnerB,[segment(0,12,money(s.b))])], money(120_000));
      break;
    }
    case "findShareWhenPartnerJoinsLater": {
      const s = random.pick([{a:40_000,b:60_000,join:4},{a:50_000,b:80_000,join:6},{a:72_000,b:60_000,join:3},{a:45_000,b:90_000,join:5}]);
      const partners = [partner(partnerA,[segment(0,12,money(s.a))]), partner(partnerB,[segment(s.join,12,money(s.b))])];
      state = makeState(partners, money(cleanGross(partners, 20_000)));
      targetPartnerId = partnerB;
      break;
    }
    case "findUnknownCapitalOfEarlyLeavingPartner": {
      const s = random.pick([{a:60_000,leave:6,b:30_000},{a:72_000,leave:8,b:48_000},{a:90_000,leave:4,b:40_000},{a:56_000,leave:9,b:42_000}]);
      state = makeState([partner(partnerA,[segment(0,s.leave,money(s.a))]), partner(partnerB,[segment(0,12,money(s.b))])], money(120_000));
      targetPartnerId = partnerA;
      break;
    }
    case "findTotalProfitFromStaggeredPartnerShare": {
      const s = random.pick([
        {a:30_000,b:45_000,c:60_000,jb:3,jc:6},
        {a:40_000,b:60_000,c:72_000,jb:4,jc:7},
        {a:50_000,b:80_000,c:90_000,jb:2,jc:5},
        {a:36_000,b:54_000,c:72_000,jb:5,jc:8},
      ]);
      const partners = [partner(partnerA,[segment(0,12,money(s.a))]), partner(partnerB,[segment(s.jb,12,money(s.b))]), partner(partnerC,[segment(s.jc,12,money(s.c))])];
      state = makeState(partners, money(cleanGross(partners, 15_000)));
      targetPartnerId = random.pick([partnerA, partnerB, partnerC]);
      break;
    }
    case "findProfitRatioAfterPercentageCapitalDecrease": {
      const s = random.pick([{a0:60_000,p:25,change:4,b:50_000},{a0:80_000,p:20,change:6,b:60_000},{a0:90_000,p:40,change:5,b:60_000},{a0:100_000,p:30,change:8,b:75_000}]);
      const a1 = s.a0 * (100 - s.p) / 100;
      state = makeState([partner(partnerA,[segment(0,s.change,money(s.a0)),segment(s.change,12,money(a1))]), partner(partnerB,[segment(0,12,money(s.b))])], money(120_000));
      extra.percentageDecreaseA = s.p;
      break;
    }
    case "findProfitRatioAfterFractionalCapitalChange": {
      const s = random.pick([
        {a0:40_000,a1:60_000,kind:"INCREASE_HALF" as const,change:4,b:50_000},
        {a0:60_000,a1:40_000,kind:"DECREASE_THIRD" as const,change:6,b:45_000},
        {a0:80_000,a1:100_000,kind:"INCREASE_QUARTER" as const,change:5,b:75_000},
        {a0:80_000,a1:60_000,kind:"DECREASE_QUARTER" as const,change:8,b:70_000},
      ]);
      state = makeState([partner(partnerA,[segment(0,s.change,money(s.a0)),segment(s.change,12,money(s.a1))]), partner(partnerB,[segment(0,12,money(s.b))])], money(120_000));
      extra.fractionalChangeA = fractionPhrase(s.kind, input.language);
      break;
    }
    case "findUnknownCapitalChangeTimeFromPartnerShare": {
      const s = random.pick([{a0:40_000,a1:60_000,change:6,b:50_000},{a0:60_000,a1:30_000,change:4,b:45_000},{a0:30_000,a1:45_000,change:8,b:35_000},{a0:80_000,a1:60_000,change:3,b:70_000}]);
      const partners = [partner(partnerA,[segment(0,s.change,money(s.a0)),segment(s.change,12,money(s.a1))]), partner(partnerB,[segment(0,12,money(s.b))])];
      state = makeState(partners, money(cleanGross(partners, 20_000)));
      targetPartnerId = partnerA;
      break;
    }
    default:
      throw new Error(`E4 generator does not support ${input.entry.solveMode}`);
  }

  const solution = solvePrt001State(state);
  const [a,b,c] = state.partners;
  const a0 = a!.capitalSegments[0]!;
  const b0 = b!.capitalSegments[0]!;
  const c0 = c?.capitalSegments[0];
  const ratio = solution.normalizedRatio;
  const renderVariables: Record<string, string | number> = {
    partnerA, partnerB, partnerC, business,
    capitalA: formatPrt001Money(a0.capital), capitalB: formatPrt001Money(b0.capital), capitalC: c0 ? formatPrt001Money(c0.capital) : "",
    durationA: formatPrt001Duration(subtractRational(a0.end,a0.start), input.language), durationB: formatPrt001Duration(subtractRational(b0.end,b0.start), input.language),
    initialCapitalA: formatPrt001Money(a0.capital), finalCapitalA: a!.capitalSegments[1] ? formatPrt001Money(a!.capitalSegments[1]!.capital) : "",
    leaveAfterA: formatPrt001Duration(a0.end, input.language), joinAfterB: formatPrt001Duration(b0.start, input.language), joinAfterC: c0 ? formatPrt001Duration(c0.start, input.language) : "",
    changeMonthA: a!.capitalSegments[1] ? formatPrt001Duration(a!.capitalSegments[1]!.start, input.language) : "",
    totalProfit: formatPrt001Money(state.grossProfitOrLoss), profitRatioA: ratio[0]?.toString() ?? "", profitRatioB: ratio[1]?.toString() ?? "",
    targetPartner: targetPartnerId ?? partnerA,
    ...extra,
  };
  const shareA = solution.distributedShares[partnerA]!;
  const shareB = solution.distributedShares[partnerB]!;
  renderVariables.shareA = absTextMoney(shareA);
  renderVariables.shareB = absTextMoney(shareB);
  renderVariables.knownShare = absTextMoney(solution.distributedShares[targetPartnerId ?? partnerA]!);
  renderVariables.totalCapital = renderVariables.totalCapital ?? formatPrt001Money(rational(a0.capital.numerator + b0.capital.numerator));
  if (!renderVariables.totalLoss && state.grossProfitOrLoss.numerator < 0n) renderVariables.totalLoss = absTextMoney(state.grossProfitOrLoss);

  return { questionLanguageId: input.questionLanguageId, seed: input.seed, language: input.language, entry: input.entry, state, partnerA, partnerB, partnerC, targetPartnerId, renderVariables };
}
