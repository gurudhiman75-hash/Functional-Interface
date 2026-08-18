import { div, eq, mul, rat, sub, type Rational } from "./cp003-exam-model";
import { schemeFactor } from "./cp007-scheme-equivalence-runtime-v1";
import {
  INT_CP007_ENGLISH_VERSION as INT_CP007_ENGLISH_VERSION_V2,
  generateIntCp007EnglishQuestion as generateV2,
  type IntCp007EnglishQuestion as IntCp007EnglishQuestionV2,
  type IntCp007Option,
} from "./cp007-scheme-equivalence-english-v2";
import {
  solveIntCp007,
  verifyIntCp007Answer,
  type IntCp007QlId,
} from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_ENGLISH_VERSION = "INT-CP-007-EN-v3-review" as const;
export const INT_CP007_ENGLISH_V3_SUPERSEDES = INT_CP007_ENGLISH_VERSION_V2;

export type IntCp007EnglishQuestion = Omit<IntCp007EnglishQuestionV2, "englishVersion"> & {
  readonly englishVersion: typeof INT_CP007_ENGLISH_VERSION;
};

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

function formatPercent(value: Rational): string {
  return `${formatRational(value)}%`;
}

function formatMoney(value: Rational): string {
  const paiseNumerator = value.numerator * 100n;
  if (paiseNumerator % value.denominator !== 0n) throw new Error(`CP007 V3 money display must resolve to paise: ${value.numerator}/${value.denominator}`);
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

function factorDisplay(value: Rational, decimals = 6): string {
  if (value.numerator < 0n) throw new Error("CP007 accumulation factors must be positive");
  const scale = 10n ** BigInt(decimals);
  const scaledNumerator = value.numerator * scale;
  const exact = scaledNumerator % value.denominator === 0n;
  const scaled = exact
    ? scaledNumerator / value.denominator
    : (scaledNumerator * 2n + value.denominator) / (2n * value.denominator);
  const whole = scaled / scale;
  const fraction = (scaled % scale).toString().padStart(decimals, "0").replace(/0+$/u, "");
  const decimal = fraction ? `${whole}.${fraction}` : `${whole}`;
  return exact ? decimal : `≈ ${decimal}`;
}

function rebuildQl111(source: IntCp007EnglishQuestionV2): IntCp007EnglishQuestion {
  const state = source.mathematicalState;
  const contract: any = state.contractState;
  const answer = solveIntCp007(state);
  const targetFactor = schemeFactor(contract.knownScheme);
  const targetExcess = sub(targetFactor, rat(1n));
  const missingFactor = schemeFactor({
    method: contract.missingMethod,
    annualRatePercent: answer,
    years: contract.missingYears,
  });

  let solveSteps: readonly string[];
  if (contract.missingMethod === "SIMPLE") {
    const perYearExcess = div(targetExcess, rat(BigInt(contract.missingYears)));
    solveSteps = Object.freeze([
      `For simple interest over ${contract.missingYears} year${contract.missingYears === 1 ? "" : "s"}, the required factor is 1 + ${contract.missingYears}r/100. Therefore 1 + ${contract.missingYears}r/100 = ${formatRational(targetFactor)}.`,
      `Subtract 1 from both sides: ${contract.missingYears}r/100 = ${formatRational(targetExcess)}. Dividing by ${contract.missingYears} gives r/100 = ${formatRational(perYearExcess)}.`,
      `Multiply by 100: r = ${formatRational(perYearExcess)} × 100 = ${formatPercent(answer)}.`,
    ]);
  } else if (contract.missingYears === 1) {
    solveSteps = Object.freeze([
      `For one year of compound interest, the factor is 1 + r/100. Therefore 1 + r/100 = ${formatRational(targetFactor)}.`,
      `Subtract 1: r/100 = ${formatRational(targetExcess)}.`,
      `Multiply by 100: r = ${formatRational(targetExcess)} × 100 = ${formatPercent(answer)}.`,
    ]);
  } else {
    solveSteps = Object.freeze([
      `For ${contract.missingYears} years of annual compounding, the required equation is (1 + r/100)^${contract.missingYears} = ${formatRational(targetFactor)}.`,
      `CP007 uses its bounded exact rate set rather than decimal roots. Testing r = ${formatPercent(answer)} gives the exact factor ${formatRational(missingFactor)}.`,
      `Because ${formatRational(missingFactor)} = ${formatRational(targetFactor)}, the required annual rate is ${formatPercent(answer)}.`,
    ]);
  }

  return deepFreeze({
    ...source,
    englishVersion: INT_CP007_ENGLISH_VERSION,
    explanation: deepFreeze({
      keyIdea: "Equal principal and equal maturity amount require equal accumulation factors. First calculate the known scheme's factor, then write the second scheme's factor equation and isolate the missing annual rate explicitly.",
      steps: Object.freeze([
        `The question asks for the annual rate in the second scheme that makes its maturity value equal to the known scheme for the same starting principal.`,
        `The known scheme has accumulation factor ${formatRational(targetFactor)}, so the second scheme must also have factor ${formatRational(targetFactor)}.`,
        ...solveSteps,
        `Check: using r = ${formatPercent(answer)}, the second scheme's factor is ${formatRational(missingFactor)}, exactly equal to ${formatRational(targetFactor)}. Hence the required annual rate is ${formatPercent(answer)}.`,
      ]),
      finalAnswer: source.correctAnswer,
      commonMistake: "Do not copy the known annual rate merely because the maturity values must match. Different methods or durations require equating the complete accumulation factors and solving the rate equation.",
    }),
  });
}

function rebuildQl114(source: IntCp007EnglishQuestionV2): IntCp007EnglishQuestion {
  const state = source.mathematicalState;
  const contract: any = state.contractState;
  const answer = solveIntCp007(state);
  const year = Number(answer.numerator);
  const previousYear = year - 1;
  const aPrev = schemeFactor({ ...contract.initiallyHigherScheme, years: previousYear });
  const bPrev = schemeFactor({ ...contract.overtakingScheme, years: previousYear });
  const aNow = schemeFactor({ ...contract.initiallyHigherScheme, years: year });
  const bNow = schemeFactor({ ...contract.overtakingScheme, years: year });

  return deepFreeze({
    ...source,
    englishVersion: INT_CP007_ENGLISH_VERSION,
    explanation: deepFreeze({
      keyIdea: "For a first-overtake question, compare the two exact accumulation factors at successive whole years. The answer is valid only when Scheme B is not ahead at the previous year but is ahead at the selected year.",
      steps: Object.freeze([
        `Both schemes start with the same principal, so the principal cancels; only their accumulation factors need to be compared.`,
        `After ${previousYear} complete years, Scheme A's factor is ${factorDisplay(aPrev)} and Scheme B's factor is ${factorDisplay(bPrev)}. Scheme B is still not ahead.`,
        `After ${year} complete years, Scheme A's factor is ${factorDisplay(aNow)} and Scheme B's factor is ${factorDisplay(bNow)}.`,
        `At ${year} years, Scheme B's exact factor is larger. The previous-year check proves that this is the first whole-year crossing, not merely a later year when B is also ahead.`,
        `Therefore Scheme B first overtakes Scheme A after ${source.correctAnswer}.`,
      ]),
      finalAnswer: source.correctAnswer,
      commonMistake: "Do not stop at any year where Scheme B happens to be larger. A first-overtake answer must also verify that Scheme B was not larger at every earlier whole-year boundary, especially the immediately preceding year.",
    }),
  });
}

function rebuildQl115(source: IntCp007EnglishQuestionV2): IntCp007EnglishQuestion {
  const state = source.mathematicalState;
  const contract: any = state.contractState;
  const correctValue = solveIntCp007(state);
  const candidateWrongs = Object.freeze([
    contract.knownPrincipal as Rational,
    div(contract.knownPrincipal, rat(2n)),
    mul(contract.knownPrincipal, rat(2n)),
  ]);

  if (new Set(candidateWrongs.map((value) => `${value.numerator}/${value.denominator}`)).size !== 3) {
    throw new Error(`INT-QL-115/${source.seed}: V3 clean-money distractors are not distinct`);
  }
  for (const value of candidateWrongs) {
    if (eq(value, correctValue) || verifyIntCp007Answer(state, value)) {
      throw new Error(`INT-QL-115/${source.seed}: V3 clean-money distractor verifies as correct`);
    }
  }

  const misconceptionIds = Object.freeze([
    "USE_SAME_PRESENT_PRINCIPAL",
    "HALVE_KNOWN_PRINCIPAL",
    "DOUBLE_KNOWN_PRINCIPAL",
  ] as const);
  const options: IntCp007Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === source.correctIndex) {
      const correctOption = source.options[index]!;
      if (!eq(correctOption.value, correctValue)) throw new Error(`INT-QL-115/${source.seed}: correct option drift during V3 overlay`);
      options.push(correctOption);
    } else {
      const value = candidateWrongs[wrongIndex]!;
      options.push(deepFreeze({
        text: formatMoney(value),
        value,
        misconceptionId: misconceptionIds[wrongIndex]!,
      }));
      wrongIndex += 1;
    }
  }

  return deepFreeze({
    ...source,
    englishVersion: INT_CP007_ENGLISH_VERSION,
    options: Object.freeze(options),
    correctAnswer: options[source.correctIndex]!.text,
    explanation: deepFreeze({
      ...source.explanation,
      finalAnswer: options[source.correctIndex]!.text,
    }),
  });
}

export function generateIntCp007EnglishQuestion(
  qlId: IntCp007QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp007EnglishQuestion {
  const source = generateV2(qlId, seed, locale);
  if (qlId === "INT-QL-111") return rebuildQl111(source);
  if (qlId === "INT-QL-114") return rebuildQl114(source);
  if (qlId === "INT-QL-115") return rebuildQl115(source);
  return deepFreeze({ ...source, englishVersion: INT_CP007_ENGLISH_VERSION });
}
