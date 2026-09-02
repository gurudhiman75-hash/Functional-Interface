import { add, div, mul, rat, sub, type Rational } from "./cp003-exam-model";
import type { Int001Wave03QlId } from "./int-001-wave03-permanent-allocation-v1";
import { generateInt001Wave04EnglishCandidate } from "./int-001-wave04-english-authority-v1";

export const INT_001_WAVE04_ENGLISH_CALCULATION_STYLE_VERSION = "INT-001-WAVE04-EN-CALCULATION-STYLE-v2" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  }
  return Object.freeze(value);
}

function numeric(value: Rational): number {
  return Number(value.numerator) / Number(value.denominator);
}

function decimal(value: Rational, digits = 6): string {
  return numeric(value).toFixed(digits).replace(/0+$/u, "").replace(/\.$/u, "");
}

function money(value: Rational): string {
  const rounded = Math.round(numeric(value) * 100) / 100;
  const paise = Math.abs(rounded - Math.round(rounded)) > 1e-9;
  return `₹${rounded.toLocaleString("en-IN", {
    minimumFractionDigits: paise ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

function simpleInterest(principal: Rational, ratePercent: Rational, years: number): Rational {
  return div(mul(mul(principal, ratePercent), rat(BigInt(years))), rat(100n));
}

function simpleAmount(principal: Rational, ratePercent: Rational, years: number): Rational {
  return add(principal, simpleInterest(principal, ratePercent, years));
}

function pow(base: Rational, exponent: number): Rational {
  let result = rat(1n);
  for (let i = 0; i < exponent; i += 1) result = mul(result, base);
  return result;
}

function compoundAmount(principal: Rational, ratePercent: Rational, years: number): Rational {
  const growth = add(rat(1n), div(ratePercent, rat(100n)));
  return mul(principal, pow(growth, years));
}

function nominalCompoundAmount(
  principal: Rational,
  annualRatePercent: Rational,
  years: number,
  periodsPerYear: 1 | 2,
): Rational {
  const periodicRate = div(annualRatePercent, rat(BigInt(periodsPerYear)));
  const growth = add(rat(1n), div(periodicRate, rat(100n)));
  return mul(principal, pow(growth, years * periodsPerYear));
}

function ql132Explanation(question: any) {
  const s = question.mathematicalState as any;
  if (s.stageOrder === "SI_THEN_CI") {
    const si = simpleInterest(s.principal, s.simpleRatePercent, s.simpleYears);
    const afterSi = add(s.principal, si);
    const final = compoundAmount(afterSi, s.compoundRatePercent, s.compoundYears);
    return deepFreeze({
      whatAsked: "Find the amount after both interest stages.",
      keyIdea: "Calculate the first stage completely, then use that amount directly in the second stage.",
      steps: Object.freeze([
        `SI = ${money(s.principal)} × ${decimal(s.simpleRatePercent)} × ${s.simpleYears} / 100 = ${money(si)}.`,
        `Amount after SI = ${money(s.principal)} + ${money(si)} = ${money(afterSi)}.`,
        `Now apply CI on ${money(afterSi)}: ${money(afterSi)} × (1 + ${decimal(s.compoundRatePercent)}/100)^${s.compoundYears} = ${money(final)}.`,
        `Therefore, final amount = ${money(question.answer)}.`,
      ]),
      shortcut: "Finish stage 1 numerically first; the amount obtained becomes the principal for stage 2.",
      commonTrap: "Do not calculate SI and CI separately on the original principal when the question says one stage follows the other.",
      finalAnswer: money(question.answer),
    });
  }

  const afterCi = compoundAmount(s.principal, s.compoundRatePercent, s.compoundYears);
  const si = simpleInterest(afterCi, s.simpleRatePercent, s.simpleYears);
  const final = add(afterCi, si);
  return deepFreeze({
    whatAsked: "Find the amount after both interest stages.",
    keyIdea: "Calculate the first stage completely, then use that amount directly in the second stage.",
    steps: Object.freeze([
      `Amount after CI = ${money(s.principal)} × (1 + ${decimal(s.compoundRatePercent)}/100)^${s.compoundYears} = ${money(afterCi)}.`,
      `SI on ${money(afterCi)} = ${money(afterCi)} × ${decimal(s.simpleRatePercent)} × ${s.simpleYears} / 100 = ${money(si)}.`,
      `Final amount = ${money(afterCi)} + ${money(si)} = ${money(final)}.`,
      `Therefore, final amount = ${money(question.answer)}.`,
    ]),
    shortcut: "Finish stage 1 numerically first; the amount obtained becomes the principal for stage 2.",
    commonTrap: "Do not calculate SI and CI separately on the original principal when the question says one stage follows the other.",
    finalAnswer: money(question.answer),
  });
}

function ql133Explanation(question: any) {
  const s = question.mathematicalState as any;
  const siPercentTotal = mul(s.simpleRatePercent, rat(BigInt(s.simpleYears)));
  const siHundredPlus = add(rat(100n), siPercentTotal);
  const ciGrowth = pow(add(rat(1n), div(s.compoundRatePercent, rat(100n))), s.compoundYears);

  if (s.stageOrder === "SI_THEN_CI") {
    const beforeCi = div(s.finalAmount, ciGrowth);
    const principal = div(mul(beforeCi, rat(100n)), siHundredPlus);
    return deepFreeze({
      whatAsked: "Find the original principal.",
      keyIdea: "Work backward from the final amount and undo the second stage first.",
      steps: Object.freeze([
        `Before the CI stage = ${money(s.finalAmount)} ÷ (1 + ${decimal(s.compoundRatePercent)}/100)^${s.compoundYears} = ${money(beforeCi)}.`,
        `This ${money(beforeCi)} is the amount after ${s.simpleYears} year(s) of SI at ${decimal(s.simpleRatePercent)}%.`,
        `Original principal = ${money(beforeCi)} × 100 / (100 + ${decimal(s.simpleRatePercent)} × ${s.simpleYears}) = ${money(principal)}.`,
        `Therefore, original principal = ${money(question.answer)}.`,
      ]),
      shortcut: "Reverse the stages: undo the last interest stage first, then undo the first stage.",
      commonTrap: "Do not start from the first stage while working backward; the final amount belongs to the second stage.",
      finalAnswer: money(question.answer),
    });
  }

  const beforeSi = div(mul(s.finalAmount, rat(100n)), siHundredPlus);
  const principal = div(beforeSi, ciGrowth);
  return deepFreeze({
    whatAsked: "Find the original principal.",
    keyIdea: "Work backward from the final amount and undo the second stage first.",
    steps: Object.freeze([
      `Before the SI stage = ${money(s.finalAmount)} × 100 / (100 + ${decimal(s.simpleRatePercent)} × ${s.simpleYears}) = ${money(beforeSi)}.`,
      `This ${money(beforeSi)} is the amount after ${s.compoundYears} year(s) of CI at ${decimal(s.compoundRatePercent)}%.`,
      `Original principal = ${money(beforeSi)} ÷ (1 + ${decimal(s.compoundRatePercent)}/100)^${s.compoundYears} = ${money(principal)}.`,
      `Therefore, original principal = ${money(question.answer)}.`,
    ]),
    shortcut: "Reverse the stages: undo the last interest stage first, then undo the first stage.",
    commonTrap: "Do not start from the first stage while working backward; the final amount belongs to the second stage.",
    finalAnswer: money(question.answer),
  });
}

function ql134Explanation(question: any) {
  const s = question.mathematicalState as any;
  const base = rat(100n);
  const borrowSi = simpleInterest(base, s.borrowSimpleRatePercent, s.years);
  const borrowAmount = add(base, borrowSi);
  const lendAmount = nominalCompoundAmount(base, s.lendNominalCompoundRatePercent, s.years, s.compoundPeriodsPerYear);
  const differenceOn100 = sub(lendAmount, borrowAmount);
  const principal = div(mul(s.netGain, base), differenceOn100);
  const periodName = s.compoundPeriodsPerYear === 2 ? "half-year" : "year";
  const periodicRate = div(s.lendNominalCompoundRatePercent, rat(BigInt(s.compoundPeriodsPerYear)));
  const periods = s.years * s.compoundPeriodsPerYear;

  return deepFreeze({
    whatAsked: "Find the common principal.",
    keyIdea: "Use ₹100 as a trial principal, find the return difference on ₹100, then scale it to the actual difference.",
    steps: Object.freeze([
      `For ₹100, SI amount = ₹100 + (₹100 × ${decimal(s.borrowSimpleRatePercent)} × ${s.years} / 100) = ${money(borrowAmount)}.`,
      `CI rate per ${periodName} = ${decimal(s.lendNominalCompoundRatePercent)} / ${s.compoundPeriodsPerYear} = ${decimal(periodicRate)}%; number of periods = ${periods}.`,
      `For ₹100, CI amount = ₹100 × (1 + ${decimal(periodicRate)}/100)^${periods} = ${money(lendAmount)}.`,
      `Difference on ₹100 = ${money(lendAmount)} − ${money(borrowAmount)} = ${money(differenceOn100)}.`,
      `Actual difference is ${money(s.netGain)}, so principal = ${money(s.netGain)} × 100 / ${decimal(differenceOn100)} = ${money(principal)}.`,
      `Therefore, principal = ${money(question.answer)}.`,
    ]),
    shortcut: "Find the difference on ₹100 first; actual principal = actual difference × 100 ÷ difference on ₹100.",
    commonTrap: "Do not subtract the two annual rates directly; calculate the actual SI and CI amounts on ₹100 first.",
    finalAnswer: money(question.answer),
  });
}

function calculationExplanation(qlId: Int001Wave03QlId, question: any) {
  switch (qlId) {
    case "INT-QL-132": return ql132Explanation(question);
    case "INT-QL-133": return ql133Explanation(question);
    case "INT-QL-134": return ql134Explanation(question);
  }
}

export function generateInt001Wave04EnglishCalculationCandidate(qlId: Int001Wave03QlId, seed: string | number) {
  const base = generateInt001Wave04EnglishCandidate(qlId, seed) as any;
  return deepFreeze({
    ...base,
    authorityVersion: INT_001_WAVE04_ENGLISH_CALCULATION_STYLE_VERSION,
    explanationStyle: "DIRECT_CALCULATION" as const,
    explanation: calculationExplanation(qlId, base),
    provenance: deepFreeze({
      ...base.provenance,
      learnerExplanationStyle: "DIRECT_CALCULATION" as const,
      conceptualFactorNarrationRemoved: true as const,
    }),
  });
}
