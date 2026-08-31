import objectPoolsSource from "../object-pools.library.json" assert { type: "json" };
import { addRational, divideRational, multiplyRational, normalizeRatio, rational, subtractRational } from "./math";
import { formatPrt001Duration, formatPrt001Money, localizePrt001Business } from "./parameter-generator";
import { createPrt001Random } from "./random";
import { solvePrt001State } from "./solver";
import type { CapitalSegment, Partner, PartnershipState, PreDistributionAllocation, Prt001Language, Prt001PilotParameters, Prt001TaskRegistryEntry, Rational } from "./types";

interface ObjectPools { partnerPairs: [string, string][]; businesses: string[]; }
const objectPools = objectPoolsSource as unknown as ObjectPools;

type EntitledPartner = Partner & { readonly profitShareMultiplier?: Rational };

const segment = (start: number, end: number, capital: number): CapitalSegment => ({ start: rational(start), end: rational(end), capital: rational(capital) });
const partner = (partnerId: string, capitalSegments: readonly CapitalSegment[], role: Partner["role"] = "UNSPECIFIED", profitShareMultiplier?: Rational): EntitledPartner => ({ partnerId, role, capitalSegments, ...(profitShareMultiplier ? { profitShareMultiplier } : {}) });
const moneyRaw = (value: Rational): string => formatPrt001Money(value).replace(/^₹/, "");
const ratioText = (parts: readonly bigint[]): string => parts.map(String).join(":");
const fractionText = (n: number, d: number): string => `${n}/${d}`;

function makeState(partners: readonly EntitledPartner[], gross: number, allocations: readonly PreDistributionAllocation[] = [], totalDuration = 12): PartnershipState {
  return { totalDuration: rational(totalDuration), grossProfitOrLoss: rational(gross), partners, allocations, moneyUnit: "RUPEE", timeUnit: "MONTH" };
}

function localizedRelation(language: Prt001Language, a: string, b: string, c: string, numerator: number, denominator: number): string {
  if (language === "hi") return `${b} की पूंजी = (${numerator}${c} - ${denominator}${a})/${denominator}`;
  if (language === "pa") return `${b} ਦੀ ਪੂੰਜੀ = (${numerator}${c} - ${denominator}${a})/${denominator}`;
  return `${b}'s capital = (${numerator}${c} - ${denominator}${a})/${denominator}`;
}

export function isPrt001E13QuestionLanguageId(questionLanguageId: string): boolean {
  const value = Number(questionLanguageId.replace("PRT-QL-", ""));
  return Number.isInteger(value) && value >= 106 && value <= 112;
}

export function generatePrt001E13Parameters(input: { questionLanguageId: string; seed: string; entry: Prt001TaskRegistryEntry; language: Prt001Language }): Prt001PilotParameters {
  if (!isPrt001E13QuestionLanguageId(input.questionLanguageId)) throw new Error(`E13 generator does not own ${input.questionLanguageId}`);
  const random = createPrt001Random(input.seed);
  const names = random.shuffle([...new Set(objectPools.partnerPairs.flat())]);
  const [partnerA, partnerB, partnerC] = names;
  if (!partnerA || !partnerB || !partnerC) throw new Error("E13 requires three partner names");
  const business = localizePrt001Business(random.pick(objectPools.businesses), input.language);
  const scale = random.pick([1, 2, 3]);
  const m = (value: number) => value * scale;
  let state: PartnershipState;
  let targetPartnerId: string | undefined;
  const renderVariables: Record<string, string | number> = { partnerA, partnerB, partnerC, business };

  switch (input.questionLanguageId) {
    case "PRT-QL-106": {
      const s = random.pick([
        { a: 40_000, b: 50_000, c: 70_000, mn: 1, md: 2, retained: 25, gross: 36_000 },
        { a: 30_000, b: 60_000, c: 50_000, mn: 3, md: 4, retained: 50, gross: 20_400 },
        { a: 50_000, b: 40_000, c: 60_000, mn: 2, md: 3, retained: 20, gross: 24_375 },
        { a: 70_000, b: 50_000, c: 80_000, mn: 3, md: 4, retained: 40, gross: 30_000 },
      ]);
      const sleeping = partnerC;
      targetPartnerId = random.pick([partnerA, partnerB, partnerC]);
      state = makeState([
        partner(partnerA, [segment(0, 12, m(s.a))], "ACTIVE"),
        partner(partnerB, [segment(0, 12, m(s.b))], "ACTIVE"),
        partner(partnerC, [segment(0, 12, m(s.c))], "SLEEPING", rational(s.mn, s.md)),
      ], m(s.gross), [{ kind: "RESERVE", basis: "PERCENT_OF_GROSS_PROFIT", value: rational(s.retained), sequence: 1 }]);
      Object.assign(renderVariables, {
        capitalA: moneyRaw(rational(m(s.a))), capitalB: moneyRaw(rational(m(s.b))), capitalC: moneyRaw(rational(m(s.c))),
        sleepingPartner: sleeping, entitlementFraction: fractionText(s.mn, s.md), retainedPercent: s.retained,
        totalProfit: moneyRaw(rational(m(s.gross))), targetPartner: targetPartnerId,
        entitlementNumerator: s.mn, entitlementDenominator: s.md,
      });
      break;
    }
    case "PRT-QL-107": {
      const s = random.pick([
        { a: 3_000, b: 4_000, profit: 2_100, reinvest: "A" as const },
        { a: 20_000, b: 30_000, profit: 25_000, reinvest: "A" as const },
        { a: 40_000, b: 60_000, profit: 50_000, reinvest: "B" as const },
        { a: 45_000, b: 30_000, profit: 25_000, reinvest: "B" as const },
      ]);
      const first = makeState([partner(partnerA, [segment(0, 12, m(s.a))]), partner(partnerB, [segment(0, 12, m(s.b))])], m(s.profit));
      const firstSolution = solvePrt001State(first);
      const reinvestPartner = s.reinvest === "A" ? partnerA : partnerB;
      const reinvested = firstSolution.distributedShares[reinvestPartner]!;
      const nextA = s.reinvest === "A" ? addRational(rational(m(s.a)), reinvested) : rational(m(s.a));
      const nextB = s.reinvest === "B" ? addRational(rational(m(s.b)), reinvested) : rational(m(s.b));
      if (nextA.denominator !== 1n || nextB.denominator !== 1n) throw new Error("E13 reinvestment scenarios must produce integer next-period capitals");
      state = makeState([partner(partnerA, [segment(0, 12, Number(nextA.numerator))]), partner(partnerB, [segment(0, 12, Number(nextB.numerator))])], m(60_000));
      Object.assign(renderVariables, {
        initialCapitalA: moneyRaw(rational(m(s.a))), initialCapitalB: moneyRaw(rational(m(s.b))), firstYearProfit: moneyRaw(rational(m(s.profit))), reinvestPartner,
        initialCapitalANumeric: m(s.a), initialCapitalBNumeric: m(s.b), firstYearProfitNumeric: m(s.profit), reinvestedProfitShareNumeric: Number(reinvested.numerator / reinvested.denominator),
      });
      break;
    }
    case "PRT-QL-108": {
      const s = random.pick([
        { a: 25_000, b: 20_000, pa: 20, pb: 10, gross: 90_000 },
        { a: 30_000, b: 45_000, pa: 10, pb: 15, gross: 120_000 },
        { a: 40_000, b: 60_000, pa: 15, pb: 5, gross: 150_000 },
        { a: 50_000, b: 30_000, pa: 12, pb: 8, gross: 125_000 },
      ]);
      targetPartnerId = random.pick([partnerA, partnerB]);
      state = makeState([
        partner(partnerA, [segment(0, 12, m(s.a))], "ACTIVE"), partner(partnerB, [segment(0, 12, m(s.b))], "ACTIVE"),
      ], m(s.gross), [
        { kind: "BONUS", basis: "PERCENT_OF_GROSS_PROFIT", value: rational(s.pa), recipientPartnerId: partnerA, sequence: 1 },
        { kind: "BONUS", basis: "PERCENT_OF_GROSS_PROFIT", value: rational(s.pb), recipientPartnerId: partnerB, sequence: 2 },
      ]);
      Object.assign(renderVariables, { capitalA: moneyRaw(rational(m(s.a))), capitalB: moneyRaw(rational(m(s.b))), grossPercentA: s.pa, grossPercentB: s.pb, totalProfit: moneyRaw(rational(m(s.gross))), targetPartner: targetPartnerId });
      break;
    }
    case "PRT-QL-109": {
      const s = random.pick([
        { total: 360_000, an: 1, ad: 6, atn: 1, atd: 6, bn: 1, bd: 3, btn: 1, btd: 3, months: 12 },
        { total: 480_000, an: 1, ad: 4, atn: 1, atd: 2, bn: 1, bd: 3, btn: 1, btd: 4, months: 12 },
        { total: 600_000, an: 2, ad: 5, atn: 1, atd: 3, bn: 1, bd: 5, btn: 1, btd: 2, months: 12 },
        { total: 720_000, an: 1, ad: 3, atn: 1, atd: 4, bn: 1, bd: 4, btn: 1, btd: 3, months: 12 },
      ]);
      const total = m(s.total);
      const capA = (total * s.an) / s.ad;
      const capB = (total * s.bn) / s.bd;
      const capC = total - capA - capB;
      const durA = (s.months * s.atn) / s.atd;
      const durB = (s.months * s.btn) / s.btd;
      const partners = [partner(partnerA, [segment(0, durA, capA)]), partner(partnerB, [segment(0, durB, capB)]), partner(partnerC, [segment(0, s.months, capC)])];
      const probe = solvePrt001State(makeState(partners, 1));
      const parts = probe.normalizedRatio;
      const gross = Number(parts.reduce((sum, item) => sum + item, 0n)) * m(3_000);
      state = makeState(partners, gross);
      targetPartnerId = random.pick([partnerA, partnerB, partnerC]);
      Object.assign(renderVariables, {
        totalCapital: moneyRaw(rational(total)), capitalFractionA: fractionText(s.an, s.ad), capitalFractionB: fractionText(s.bn, s.bd),
        durationFractionA: fractionText(s.atn, s.atd), durationFractionB: fractionText(s.btn, s.btd), totalDuration: formatPrt001Duration(rational(s.months), input.language),
        totalProfit: moneyRaw(rational(gross)), targetPartner: targetPartnerId,
      });
      break;
    }
    case "PRT-QL-110": {
      const s = random.pick([
        { n: 3, d: 2, a: 30_000, c: 50_000 },
        { n: 4, d: 3, a: 20_000, c: 60_000 },
        { n: 5, d: 4, a: 25_000, c: 80_000 },
        { n: 7, d: 5, a: 28_000, c: 70_000 },
      ]);
      const b = (s.n * s.c - s.d * s.a) / s.d;
      const partners = [partner(partnerA, [segment(0, 12, m(s.a))]), partner(partnerB, [segment(0, 12, m(b))]), partner(partnerC, [segment(0, 12, m(s.c))])];
      const probe = solvePrt001State(makeState(partners, 1));
      const gross = Number(probe.normalizedRatio.reduce((sum, item) => sum + item, 0n)) * m(5_000);
      state = makeState(partners, gross);
      targetPartnerId = partnerC;
      Object.assign(renderVariables, { relationStatement: localizedRelation(input.language, partnerA, partnerB, partnerC, s.n, s.d), totalProfit: moneyRaw(rational(gross)), targetPartner: partnerC, aggregateNumerator: s.n, aggregateDenominator: s.d });
      break;
    }
    case "PRT-QL-111": {
      const s = random.pick([
        { a: 40_000, b: 60_000, rate: 8, gross: 25_000 },
        { a: 50_000, b: 75_000, rate: 10, gross: 40_000 },
        { a: 80_000, b: 120_000, rate: 6, gross: 50_000 },
        { a: 60_000, b: 90_000, rate: 12, gross: 45_000 },
      ]);
      targetPartnerId = random.pick([partnerA, partnerB]);
      const interestA = (m(s.a) * s.rate) / 100;
      const interestB = (m(s.b) * s.rate) / 100;
      const allocations: PreDistributionAllocation[] = [
        { kind: "INTEREST_ON_CAPITAL", basis: "PERCENT_OF_PARTNER_CAPITAL", value: rational(s.rate), recipientPartnerId: partnerA, sequence: 1 },
        { kind: "INTEREST_ON_CAPITAL", basis: "PERCENT_OF_PARTNER_CAPITAL", value: rational(s.rate), recipientPartnerId: partnerB, sequence: 2 },
      ];
      state = makeState([partner(partnerA, [segment(0, 12, m(s.a))]), partner(partnerB, [segment(0, 12, m(s.b))])], m(s.gross), allocations);
      Object.assign(renderVariables, { capitalA: moneyRaw(rational(m(s.a))), capitalB: moneyRaw(rational(m(s.b))), interestRatePercent: s.rate, totalProfit: moneyRaw(rational(m(s.gross))), targetPartner: targetPartnerId, interestANumeric: interestA, interestBNumeric: interestB });
      break;
    }
    case "PRT-QL-112": {
      const s = random.pick([
        { oa: 5, ob: 3, fn: 1, fd: 4, sa: 2, sb: 1 },
        { oa: 7, ob: 5, fn: 1, fd: 6, sa: 3, sb: 2 },
        { oa: 3, ob: 2, fn: 1, fd: 5, sa: 1, sb: 1 },
        { oa: 8, ob: 7, fn: 1, fd: 10, sa: 3, sb: 2 },
      ]);
      const oldTotal = rational(s.oa + s.ob);
      const oldA = divideRational(rational(s.oa), oldTotal);
      const oldB = divideRational(rational(s.ob), oldTotal);
      const acquired = rational(s.fn, s.fd);
      const sacrificeTotal = rational(s.sa + s.sb);
      const sacrificeA = multiplyRational(acquired, divideRational(rational(s.sa), sacrificeTotal));
      const sacrificeB = multiplyRational(acquired, divideRational(rational(s.sb), sacrificeTotal));
      const finalA = subtractRational(oldA, sacrificeA);
      const finalB = subtractRational(oldB, sacrificeB);
      const finalRatio = normalizeRatio([finalA, finalB, acquired]);
      state = makeState([
        partner(partnerA, [segment(0, 12, Number(finalRatio[0]!) * 10_000)]),
        partner(partnerB, [segment(0, 12, Number(finalRatio[1]!) * 10_000)]),
        partner(partnerC, [segment(0, 12, Number(finalRatio[2]!) * 10_000)]),
      ], 120_000);
      Object.assign(renderVariables, { oldRatio: `${s.oa}:${s.ob}`, acquiredFraction: fractionText(s.fn, s.fd), sacrificeRatio: `${s.sa}:${s.sb}`, oldRatioANumeric: s.oa, oldRatioBNumeric: s.ob, acquiredNumerator: s.fn, acquiredDenominator: s.fd, sacrificeANumeric: s.sa, sacrificeBNumeric: s.sb, finalRatio: ratioText(finalRatio) });
      break;
    }
    default:
      throw new Error(`E13 generator does not support ${input.questionLanguageId}`);
  }

  return { questionLanguageId: input.questionLanguageId, seed: input.seed, language: input.language, entry: input.entry, state, partnerA, partnerB, partnerC, targetPartnerId, renderVariables };
}
