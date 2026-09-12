import { add, div, eq, hash, mul, rat, sub, type Rational } from "./cp003-exam-model";
import { maturityAmount, schemeFactor, type IntCp007Scheme } from "./cp007-scheme-equivalence-runtime-v1";
import {
  INT_CP007_PERMANENT_ALLOCATION,
  INT_CP007_QL_IDS,
  INT_CP007_RUNTIME_VERSION,
  constructIntCp007State,
  solveIntCp007,
  verifyIntCp007Answer,
  type IntCp007PermanentState,
  type IntCp007QlId,
} from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_ENGLISH_VERSION = "INT-CP-007-EN-v1-review" as const;

export type IntCp007Representation = "STANDARD_PROSE" | "SCHEME_CARD" | "COMPARISON_LEDGER";

export interface IntCp007Option {
  readonly text: string;
  readonly value: Rational;
  readonly misconceptionId: string;
}

export interface IntCp007EnglishQuestion {
  readonly id: string;
  readonly runtimeVersion: typeof INT_CP007_RUNTIME_VERSION;
  readonly englishVersion: typeof INT_CP007_ENGLISH_VERSION;
  readonly checkpointId: "INT-CP-007";
  readonly qlId: IntCp007QlId;
  readonly locale: "en-IN";
  readonly seed: string;
  readonly mathematicalState: IntCp007PermanentState;
  readonly answerSemantic: IntCp007PermanentState["answerSemantic"];
  readonly presentation: Readonly<{
    readonly markdown: string;
    readonly prompt: string;
    readonly representation: IntCp007Representation;
    readonly stemFamilyId: string;
  }>;
  readonly options: readonly IntCp007Option[];
  readonly correctIndex: 0 | 1 | 2 | 3;
  readonly correctAnswer: string;
  readonly explanation: Readonly<{
    readonly keyIdea: string;
    readonly steps: readonly string[];
    readonly finalAnswer: string;
    readonly commonMistake: string;
  }>;
  readonly mathematicalFingerprint: string;
  readonly editorialStatus: "ENGLISH_REVIEW";
  readonly approvalStatus: "PENDING_PRODUCT_REVIEW";
  readonly allocationStatus: "PERMANENT_QL_ALLOCATED_INACTIVE";
  readonly permanentIdentityFrozen: true;
  readonly learnerContentFrozen: false;
  readonly enabled: false;
  readonly stagingStatus: "NOT_STAGED";
  readonly registrationStatus: "NOT_REGISTERED";
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

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

function gcd(a: bigint, b: bigint): bigint {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right !== 0n) [left, right] = [right, left % right];
  return left;
}

function formatRational(value: Rational, maximumDecimals = 6): string {
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = value.numerator < 0n ? -value.numerator : value.numerator;
  const denominator = value.denominator;
  const whole = numerator / denominator;
  let remainder = numerator % denominator;
  if (remainder === 0n) return `${sign}${whole}`;
  let decimals = "";
  for (let index = 0; index < maximumDecimals && remainder !== 0n; index += 1) {
    remainder *= 10n;
    decimals += (remainder / denominator).toString();
    remainder %= denominator;
  }
  if (remainder === 0n) return `${sign}${whole}.${decimals}`;
  const divisor = gcd(numerator, denominator);
  return `${sign}${numerator / divisor}/${denominator / divisor}`;
}

function formatMoney(value: Rational): string {
  const paiseNumerator = value.numerator * 100n;
  if (paiseNumerator % value.denominator !== 0n) return `₹${formatRational(value)}`;
  const paise = paiseNumerator / value.denominator;
  const rupees = paise / 100n;
  const remainder = paise % 100n;
  const source = rupees.toString();
  const tail = source.length <= 3 ? source : source.slice(-3);
  let head = source.length <= 3 ? "" : source.slice(0, -3);
  const groups: string[] = [];
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
  if (head) groups.unshift(head);
  const integer = groups.length ? `${groups.join(",")},${tail}` : tail;
  return remainder === 0n ? `₹${integer}` : `₹${integer}.${remainder.toString().padStart(2, "0")}`;
}

const formatPercent = (value: Rational): string => `${formatRational(value)}%`;
const formatYears = (years: number): string => years === 1 ? "1 year" : `${years} years`;

function ratioText(value: Rational): string {
  const divisor = gcd(value.numerator, value.denominator);
  return `${value.numerator / divisor}:${value.denominator / divisor}`;
}

function schemeLabel(scheme: IntCp007Scheme): string {
  const method = scheme.method === "SIMPLE" ? "simple interest" : "compound interest compounded annually";
  return `${method} at ${formatPercent(scheme.annualRatePercent)} p.a. for ${formatYears(scheme.years)}`;
}

function schemeFactorCalculation(label: string, scheme: IntCp007Scheme): string {
  const factor = schemeFactor(scheme);
  if (scheme.method === "SIMPLE") {
    return `${label}: simple-interest factor = 1 + (${scheme.years} × ${formatRational(scheme.annualRatePercent)}/100) = ${formatRational(factor)}.`;
  }
  return `${label}: compound-interest factor = (1 + ${formatRational(scheme.annualRatePercent)}/100)^${scheme.years} = ${formatRational(factor)}.`;
}

function uniqueWrongValues(state: IntCp007PermanentState, candidates: readonly Rational[], count = 3): Rational[] {
  const selected: Rational[] = [];
  for (const candidate of candidates) {
    if (candidate.numerator <= 0n) continue;
    if (verifyIntCp007Answer(state, candidate)) continue;
    if (selected.some((item) => eq(item, candidate))) continue;
    selected.push(candidate);
    if (selected.length === count) break;
  }
  if (selected.length !== count) throw new Error(`${state.qlId}: insufficient distinct misconception values`);
  return selected;
}

function arrangeOptions(
  state: IntCp007PermanentState,
  seed: string,
  correctValue: Rational,
  correctText: string,
  wrongs: readonly Readonly<{ value: Rational; text: string; misconceptionId: string }>[],
): Readonly<{ options: readonly IntCp007Option[]; correctIndex: 0 | 1 | 2 | 3 }> {
  if (wrongs.length !== 3) throw new Error(`${state.qlId}/${seed}: expected exactly three distractors`);
  const correctIndex = (hash(`${seed}:${state.qlId}:correct-index`) % 4) as 0 | 1 | 2 | 3;
  const options: IntCp007Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) options.push(deepFreeze({ text: correctText, value: correctValue, misconceptionId: "CORRECT" }));
    else options.push(deepFreeze(wrongs[wrongIndex++]!));
  }
  return deepFreeze({ options: Object.freeze(options), correctIndex });
}

function buildStem(qlId: IntCp007QlId, state: IntCp007PermanentState, template: number): string {
  const contract: any = state.contractState;
  switch (qlId) {
    case "INT-QL-109": {
      const a = schemeLabel(contract.schemeA);
      const b = schemeLabel(contract.schemeB);
      const p = formatMoney(contract.principal);
      return [
        `${p} is invested separately under Scheme A (${a}) and Scheme B (${b}). Which scheme gives the higher maturity amount?`,
        `Two plans receive the same principal of ${p}. Plan A offers ${a}; Plan B offers ${b}. Identify the plan with the larger amount at maturity.`,
        `Compare these two complete schemes for an equal investment of ${p}: A — ${a}; B — ${b}. Which one finishes with more money?`,
      ][template]!;
    }
    case "INT-QL-110": {
      const p = formatMoney(contract.principal);
      const a = schemeLabel(contract.schemeA);
      const b = schemeLabel(contract.schemeB);
      return [
        `${p} is placed in Scheme A (${a}) and separately in Scheme B (${b}). Find the difference between their maturity amounts.`,
        `For the same principal ${p}, Plan A uses ${a} while Plan B uses ${b}. By how much do their final amounts differ?`,
        `A sum of ${p} is compared under two schemes: A — ${a}; B — ${b}. Calculate the absolute difference in the amounts received at maturity.`,
      ][template]!;
    }
    case "INT-QL-111": {
      const known = schemeLabel(contract.knownScheme);
      const missingMethod = contract.missingMethod === "SIMPLE" ? "simple interest" : "compound interest compounded annually";
      return [
        `Scheme A uses ${known}. Scheme B runs for ${formatYears(contract.missingYears)} under ${missingMethod}. What annual rate in Scheme B will make both schemes have the same maturity amount for the same principal?`,
        `The same principal must grow to an equal final amount in two plans. One plan gives ${known}; the other uses ${missingMethod} for ${formatYears(contract.missingYears)}. Find the required annual rate of the second plan.`,
        `For equal principal and equal maturity value, Plan A follows ${known}. Plan B follows ${missingMethod} for ${formatYears(contract.missingYears)}. Determine Plan B's annual rate.`,
      ][template]!;
    }
    case "INT-QL-112": {
      const total = formatMoney(contract.totalPrincipal);
      const a = schemeLabel(contract.schemeA);
      const b = schemeLabel(contract.schemeB);
      return [
        `A total of ${total} is divided between Scheme A (${a}) and Scheme B (${b}) so that both parts have equal values at maturity. How much should be placed in Scheme A?`,
        `${total} is to be split into two present investments. The first earns ${a} and the second earns ${b}. If their future values must be equal, find the amount invested in the first scheme.`,
        `Divide ${total} between Plan A (${a}) and Plan B (${b}) so that the two maturity amounts are the same. Find Plan A's present share.`,
      ][template]!;
    }
    case "INT-QL-113": {
      const a = schemeLabel(contract.schemeA);
      const b = schemeLabel(contract.schemeB);
      return [
        `Two present principals are invested in Scheme A (${a}) and Scheme B (${b}). If their maturity amounts are equal, find the required ratio Principal A : Principal B.`,
        `Plan A follows ${a}; Plan B follows ${b}. What should be the ratio of the two present investments so that they become equal at maturity?`,
        `The future values from Scheme A (${a}) and Scheme B (${b}) must match. Determine the present-principal ratio A:B.`,
      ][template]!;
    }
    case "INT-QL-114": {
      const a = schemeLabel(contract.initiallyHigherScheme);
      const b = schemeLabel(contract.overtakingScheme);
      return [
        `For the same principal, Scheme A follows ${a} and Scheme B follows ${b}. From year 1 onward, after how many complete years will Scheme B first give a larger amount than Scheme A?`,
        `Compare equal principals under Plan A (${a}) and Plan B (${b}). Find the first whole year at which Plan B overtakes Plan A in accumulated amount.`,
        `Starting with equal sums, A grows by ${a} and B by ${b}. Determine the earliest complete year when B's maturity value becomes greater than A's.`,
      ][template]!;
    }
    case "INT-QL-115": {
      const known = formatMoney(contract.knownPrincipal);
      const a = schemeLabel(contract.knownScheme);
      const b = schemeLabel(contract.missingScheme);
      return [
        `${known} is invested in Scheme A (${a}). What present sum must be invested in Scheme B (${b}) so that both maturity amounts are equal?`,
        `Plan A starts with ${known} and follows ${a}. Plan B follows ${b}. Find the present principal required in Plan B to finish with the same future value as Plan A.`,
        `A present investment of ${known} grows under ${a}. Determine the present amount under ${b} that will produce an equal maturity value.`,
      ][template]!;
    }
  }
}

function buildContent(state: IntCp007PermanentState, seed: string) {
  const answer = solveIntCp007(state);
  const contract: any = state.contractState;
  switch (state.qlId) {
    case "INT-QL-109": {
      const amountA = maturityAmount(contract.principal, contract.schemeA);
      const amountB = maturityAmount(contract.principal, contract.schemeB);
      const correctText = answer.numerator === 1n ? "Scheme A" : "Scheme B";
      const wrongs = [
        { value: answer.numerator === 1n ? rat(2n) : rat(1n), text: answer.numerator === 1n ? "Scheme B" : "Scheme A", misconceptionId: "CHOOSE_LOWER_MATURITY" },
        { value: rat(3n), text: "Both give the same amount", misconceptionId: "ASSUME_EQUAL_RATES_MEAN_EQUAL_RETURNS" },
        { value: rat(4n), text: "Cannot be determined", misconceptionId: "IGNORE_COMPLETE_SCHEME_DATA" },
      ] as const;
      return {
        correctText,
        wrongs,
        keyIdea: "Both plans start with the same principal, so compare the exact maturity factor of each complete scheme and then compare their final amounts.",
        steps: [
          `The question asks which scheme gives the larger maturity amount for the same starting principal ${formatMoney(contract.principal)}.`,
          schemeFactorCalculation("Scheme A", contract.schemeA),
          `Scheme A amount = ${formatMoney(contract.principal)} × ${formatRational(schemeFactor(contract.schemeA))} = ${formatMoney(amountA)}.`,
          schemeFactorCalculation("Scheme B", contract.schemeB),
          `Scheme B amount = ${formatMoney(contract.principal)} × ${formatRational(schemeFactor(contract.schemeB))} = ${formatMoney(amountB)}. Therefore ${correctText} gives the higher maturity amount.`,
        ],
        commonMistake: "Do not compare only the stated annual rates. Simple and compound schemes can have different maturity factors even when their rates look similar.",
      };
    }
    case "INT-QL-110": {
      const amountA = maturityAmount(contract.principal, contract.schemeA);
      const amountB = maturityAmount(contract.principal, contract.schemeB);
      const difference = answer;
      const wrongValues = uniqueWrongValues(state, [div(difference, rat(2n)), mul(difference, rat(2n)), div(add(amountA, amountB), rat(2n)), sub(amountA, amountB), sub(amountB, amountA)].map((x) => x.numerator < 0n ? rat(-x.numerator, x.denominator) : x));
      const labels = ["HALVE_DIFFERENCE", "DOUBLE_DIFFERENCE", "AVERAGE_FINAL_AMOUNTS"];
      return {
        correctText: formatMoney(difference),
        wrongs: wrongValues.map((value, i) => ({ value, text: formatMoney(value), misconceptionId: labels[i] ?? "WRONG_COMPARISON" })),
        keyIdea: "Find each scheme's maturity amount independently at the same comparison date, then subtract the smaller final amount from the larger one.",
        steps: [
          `The same principal ${formatMoney(contract.principal)} is used in both schemes, and the required result is the difference between the two final amounts.`,
          schemeFactorCalculation("Scheme A", contract.schemeA),
          `Scheme A amount = ${formatMoney(contract.principal)} × ${formatRational(schemeFactor(contract.schemeA))} = ${formatMoney(amountA)}.`,
          schemeFactorCalculation("Scheme B", contract.schemeB),
          `Scheme B amount = ${formatMoney(contract.principal)} × ${formatRational(schemeFactor(contract.schemeB))} = ${formatMoney(amountB)}. Hence the difference = |${formatMoney(amountA)} − ${formatMoney(amountB)}| = ${formatMoney(difference)}.`,
        ],
        commonMistake: "Do not subtract the annual rates and apply that percentage once. Each complete scheme must first be accumulated to the common maturity date.",
      };
    }
    case "INT-QL-111": {
      const targetFactor = schemeFactor(contract.knownScheme);
      const answerRate = answer;
      const candidateValues = [contract.knownScheme.annualRatePercent, add(answerRate, rat(1n)), sub(answerRate, rat(1n)), add(answerRate, rat(2n)), sub(answerRate, rat(2n)), rat(10n), rat(12n), rat(15n), rat(20n), rat(25n)];
      const wrongValues = uniqueWrongValues(state, candidateValues);
      const missingFactor = schemeFactor({ method: contract.missingMethod, annualRatePercent: answerRate, years: contract.missingYears });
      const methodRule = contract.missingMethod === "SIMPLE"
        ? `For simple interest over ${formatYears(contract.missingYears)}, the factor is 1 + ${contract.missingYears}r/100.`
        : `For annual compound interest over ${formatYears(contract.missingYears)}, the factor is (1 + r/100)^${contract.missingYears}.`;
      return {
        correctText: formatPercent(answerRate),
        wrongs: wrongValues.map((value, index) => ({ value, text: formatPercent(value), misconceptionId: ["COPY_KNOWN_RATE", "PERCENT_POINT_SHIFT", "WRONG_EQUIVALENT_RATE"][index] ?? "WRONG_EQUIVALENT_RATE" })),
        keyIdea: "Equal principal and equal maturity amount mean the two schemes must have exactly the same accumulation factor. Equate those factors and recover the missing annual rate.",
        steps: [
          `The required rate is the one that makes the second scheme finish at exactly the same value as the known scheme for the same principal.`,
          schemeFactorCalculation("Known scheme", contract.knownScheme),
          `So the target maturity factor for the second scheme is ${formatRational(targetFactor)}.`,
          `${methodRule} Setting this equal to ${formatRational(targetFactor)} gives the required rate.`,
          `At r = ${formatPercent(answerRate)}, the second scheme's factor is ${formatRational(missingFactor)}, exactly matching the target. Therefore the required annual rate is ${formatPercent(answerRate)}.`,
        ],
        commonMistake: "Do not copy the first scheme's annual rate automatically. Equal rates do not imply equal maturity when the methods or durations differ.",
      };
    }
    case "INT-QL-112": {
      const factorA = schemeFactor(contract.schemeA);
      const factorB = schemeFactor(contract.schemeB);
      const x = answer;
      const other = sub(contract.totalPrincipal, x);
      const future = maturityAmount(x, contract.schemeA);
      const wrongValues = uniqueWrongValues(state, [other, div(contract.totalPrincipal, rat(2n)), add(x, div(contract.totalPrincipal, rat(10n))), sub(x, div(contract.totalPrincipal, rat(10n)))].filter((value) => value.numerator > 0n));
      return {
        correctText: formatMoney(x),
        wrongs: wrongValues.map((value, index) => ({ value, text: formatMoney(value), misconceptionId: ["SWAP_COMPONENTS", "SPLIT_EQUALLY", "IGNORE_FACTOR_RATIO"][index] ?? "WRONG_ALLOCATION" })),
        keyIdea: "Let the first present share be x. The second share is total − x. Grow both shares to their maturity dates and equate the two future values.",
        steps: [
          `The total present sum is ${formatMoney(contract.totalPrincipal)}. Let Scheme A receive x, so Scheme B receives ${formatMoney(contract.totalPrincipal)} − x.`,
          `${schemeFactorCalculation("Scheme A", contract.schemeA)} ${schemeFactorCalculation("Scheme B", contract.schemeB)}`,
          `Equal future values require x × ${formatRational(factorA)} = (${formatMoney(contract.totalPrincipal)} − x) × ${formatRational(factorB)}.`,
          `Therefore x = ${formatMoney(contract.totalPrincipal)} × ${formatRational(factorB)} / (${formatRational(factorA)} + ${formatRational(factorB)}) = ${formatMoney(x)}. The other present share is ${formatMoney(other)}.`,
          `Check: ${formatMoney(x)} in Scheme A grows to ${formatMoney(future)}, and ${formatMoney(other)} in Scheme B grows to the same ${formatMoney(future)}. Hence Scheme A's present share is ${formatMoney(x)}.`,
        ],
        commonMistake: "Do not split the present total equally unless the two accumulation factors are equal. Equal future values usually require unequal present shares.",
      };
    }
    case "INT-QL-113": {
      const factorA = schemeFactor(contract.schemeA);
      const factorB = schemeFactor(contract.schemeB);
      const correctRatio = answer;
      const inverse = div(rat(1n), correctRatio);
      const rateRatio = div(contract.schemeB.annualRatePercent, contract.schemeA.annualRatePercent);
      const wrongValues = uniqueWrongValues(state, [inverse, rat(1n), rateRatio, div(contract.schemeA.annualRatePercent, contract.schemeB.annualRatePercent)]);
      return {
        correctText: ratioText(correctRatio),
        wrongs: wrongValues.map((value, index) => ({ value, text: ratioText(value), misconceptionId: ["INVERT_PRINCIPAL_RATIO", "ASSUME_EQUAL_PRINCIPALS", "USE_RATE_RATIO"][index] ?? "WRONG_RATIO" })),
        keyIdea: "If the two future values are equal, present principal × accumulation factor must be the same for both schemes. Therefore the present principals are in the inverse ratio of their factors.",
        steps: [
          `Let the present principals be P_A and P_B. The question requires their maturity amounts to be equal.`,
          `${schemeFactorCalculation("Scheme A", contract.schemeA)} ${schemeFactorCalculation("Scheme B", contract.schemeB)}`,
          `Equal maturity gives P_A × ${formatRational(factorA)} = P_B × ${formatRational(factorB)}.`,
          `So P_A/P_B = ${formatRational(factorB)}/${formatRational(factorA)} = ${formatRational(correctRatio)}.`,
          `Writing this as a ratio, Principal A : Principal B = ${ratioText(correctRatio)}.`,
        ],
        commonMistake: "Do not use the rates themselves as the principal ratio. Equal future values depend on the complete accumulation factors, and the principal ratio is their inverse ratio.",
      };
    }
    case "INT-QL-114": {
      const year = Number(answer.numerator);
      const previousYear = year - 1;
      const aPrev = schemeFactor({ ...contract.initiallyHigherScheme, years: previousYear });
      const bPrev = schemeFactor({ ...contract.overtakingScheme, years: previousYear });
      const aNow = schemeFactor({ ...contract.initiallyHigherScheme, years: year });
      const bNow = schemeFactor({ ...contract.overtakingScheme, years: year });
      const wrongYears = uniqueWrongValues(state, [rat(BigInt(year - 1)), rat(BigInt(year + 1)), rat(BigInt(year + 2)), rat(BigInt(Math.max(1, year - 2))), rat(1n)]);
      return {
        correctText: formatYears(year),
        wrongs: wrongYears.map((value, index) => ({ value, text: formatYears(Number(value.numerator)), misconceptionId: ["STOP_ONE_YEAR_EARLY", "STOP_ONE_YEAR_LATE", "IGNORE_FIRST_CROSSING"][index] ?? "WRONG_CROSSING_YEAR" })),
        keyIdea: "A first-overtake question needs two checks: the overtaking scheme must still be behind at the previous whole year and must be ahead at the selected year.",
        steps: [
          `Because both schemes start with the same principal, compare their accumulation factors year by year; the principal itself cancels from the comparison.`,
          `After ${formatYears(previousYear)}, Scheme A's factor is ${formatRational(aPrev)} and Scheme B's factor is ${formatRational(bPrev)}. Scheme B has not yet overtaken Scheme A.`,
          `After ${formatYears(year)}, Scheme A's factor is ${formatRational(aNow)} while Scheme B's factor is ${formatRational(bNow)}.`,
          `Now Scheme B's factor is larger, so its accumulated amount is larger for the first time at a whole-year boundary.`,
          `Therefore the first complete year when Scheme B overtakes Scheme A is ${formatYears(year)}.`,
        ],
        commonMistake: "Do not report any later year that also has Scheme B ahead. The word first requires checking the immediately preceding whole year as well.",
      };
    }
    case "INT-QL-115": {
      const knownFuture = maturityAmount(contract.knownPrincipal, contract.knownScheme);
      const factorMissing = schemeFactor(contract.missingScheme);
      const missing = answer;
      const inverseCandidate = div(mul(contract.knownPrincipal, factorMissing), schemeFactor(contract.knownScheme));
      const wrongValues = uniqueWrongValues(state, [contract.knownPrincipal, inverseCandidate, div(contract.knownPrincipal, rat(2n)), mul(contract.knownPrincipal, rat(2n))]);
      return {
        correctText: formatMoney(missing),
        wrongs: wrongValues.map((value, index) => ({ value, text: formatMoney(value), misconceptionId: ["USE_SAME_PRINCIPAL", "INVERT_FACTOR_ADJUSTMENT", "IGNORE_EQUAL_FUTURE_VALUE"][index] ?? "WRONG_PRESENT_PRINCIPAL" })),
        keyIdea: "First find the future value produced by the known present principal. Then divide that target future value by the other scheme's accumulation factor to recover its required present principal.",
        steps: [
          `The known present principal is ${formatMoney(contract.knownPrincipal)} and both schemes must finish with the same maturity value.`,
          `${schemeFactorCalculation("Known scheme", contract.knownScheme)} Its maturity value is ${formatMoney(contract.knownPrincipal)} × ${formatRational(schemeFactor(contract.knownScheme))} = ${formatMoney(knownFuture)}.`,
          `${schemeFactorCalculation("Required-principal scheme", contract.missingScheme)}`,
          `If the required present principal is P, then P × ${formatRational(factorMissing)} = ${formatMoney(knownFuture)}. Hence P = ${formatMoney(knownFuture)} / ${formatRational(factorMissing)} = ${formatMoney(missing)}.`,
          `Checking forward, ${formatMoney(missing)} under the second scheme also matures to ${formatMoney(knownFuture)}. Therefore the required present principal is ${formatMoney(missing)}.`,
        ],
        commonMistake: "Do not use the same present principal in both schemes automatically. Different accumulation factors require different starting principals to reach the same future value.",
      };
    }
  }
}

export function generateIntCp007EnglishQuestion(qlId: IntCp007QlId, seed: string, locale: "en-IN" = "en-IN"): IntCp007EnglishQuestion {
  if (locale !== "en-IN") throw new Error("CP007 English V1 review authority supports en-IN only");
  if (!INT_CP007_QL_IDS.includes(qlId)) throw new Error(`Unknown CP007 QL ${qlId}`);
  const mathematicalState = constructIntCp007State(qlId, seed);
  const correctValue = solveIntCp007(mathematicalState);
  if (!verifyIntCp007Answer(mathematicalState, correctValue)) throw new Error(`${qlId}/${seed}: solver answer rejected before presentation`);
  const template = hash(`${seed}:${qlId}:stem-family`) % 3;
  const markdown = buildStem(qlId, mathematicalState, template);
  const content = buildContent(mathematicalState, seed);
  const arranged = arrangeOptions(mathematicalState, seed, correctValue, content.correctText, content.wrongs);
  const correctAnswer = arranged.options[arranged.correctIndex]!.text;
  if (!eq(arranged.options[arranged.correctIndex]!.value, correctValue)) throw new Error(`${qlId}/${seed}: correct option value drift`);

  return deepFreeze({
    id: `${qlId}:${seed}`,
    runtimeVersion: INT_CP007_RUNTIME_VERSION,
    englishVersion: INT_CP007_ENGLISH_VERSION,
    checkpointId: "INT-CP-007",
    qlId,
    locale,
    seed,
    mathematicalState,
    answerSemantic: mathematicalState.answerSemantic,
    presentation: deepFreeze({
      markdown,
      prompt: markdown,
      representation: (["STANDARD_PROSE", "SCHEME_CARD", "COMPARISON_LEDGER"] as const)[template]!,
      stemFamilyId: `${qlId}-T${template + 1}`,
    }),
    options: arranged.options,
    correctIndex: arranged.correctIndex,
    correctAnswer,
    explanation: deepFreeze({
      keyIdea: content.keyIdea,
      steps: Object.freeze(content.steps),
      finalAnswer: correctAnswer,
      commonMistake: content.commonMistake,
    }),
    mathematicalFingerprint: `${qlId}|${seed}|${mathematicalState.sourcePrototypeId}|${JSON.stringify(mathematicalState.contractState, (_key, value) => typeof value === "bigint" ? `${value}n` : value)}|answer=${correctValue.numerator}/${correctValue.denominator}`,
    editorialStatus: "ENGLISH_REVIEW",
    approvalStatus: "PENDING_PRODUCT_REVIEW",
    allocationStatus: "PERMANENT_QL_ALLOCATED_INACTIVE",
    permanentIdentityFrozen: true,
    learnerContentFrozen: false,
    enabled: INT_CP007_PERMANENT_ALLOCATION.enabled,
    stagingStatus: INT_CP007_PERMANENT_ALLOCATION.stagingStatus,
    registrationStatus: INT_CP007_PERMANENT_ALLOCATION.registrationStatus,
    questionStudioDiscoverable: INT_CP007_PERMANENT_ALLOCATION.questionStudioDiscoverable,
    questionBankStatus: INT_CP007_PERMANENT_ALLOCATION.questionBankStatus,
    testEligibility: INT_CP007_PERMANENT_ALLOCATION.testEligibility,
    publiclyPublishable: INT_CP007_PERMANENT_ALLOCATION.publiclyPublishable,
  });
}
