import { rat, sub, type Rational } from "./cp003-exam-model";
import { schemeFactor } from "./cp007-scheme-equivalence-runtime-v1";
import {
  INT_CP007_ENGLISH_VERSION as INT_CP007_ENGLISH_VERSION_V3,
  generateIntCp007EnglishQuestion as generateV3,
  type IntCp007EnglishQuestion as IntCp007EnglishQuestionV3,
} from "./cp007-scheme-equivalence-english-v3";
import { solveIntCp007, type IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_ENGLISH_VERSION = "INT-CP-007-EN-v4-review" as const;
export const INT_CP007_ENGLISH_V4_SUPERSEDES = INT_CP007_ENGLISH_VERSION_V3;

export type IntCp007EnglishQuestion = Omit<IntCp007EnglishQuestionV3, "englishVersion"> & {
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

function ratioText(value: Rational): string {
  const divisor = gcd(value.numerator, value.denominator);
  return `${value.numerator / divisor}:${value.denominator / divisor}`;
}

function rebuildQl111(source: IntCp007EnglishQuestionV3): IntCp007EnglishQuestion {
  const state = source.mathematicalState;
  const contract: any = state.contractState;
  if (contract.missingMethod !== "SIMPLE" || contract.missingYears !== 1) {
    return deepFreeze({ ...source, englishVersion: INT_CP007_ENGLISH_VERSION });
  }

  const answer = solveIntCp007(state);
  const targetFactor = schemeFactor(contract.knownScheme);
  const targetExcess = sub(targetFactor, rat(1n));
  const steps = [...source.explanation.steps];
  steps[2] = `For simple interest over 1 year, the accumulation factor is 1 + r/100. Therefore 1 + r/100 = ${formatRational(targetFactor)}.`;
  steps[3] = `Subtract 1 from both sides: r/100 = ${formatRational(targetExcess)}.`;
  steps[4] = `Multiply by 100: r = ${formatRational(targetExcess)} × 100 = ${formatPercent(answer)}.`;

  return deepFreeze({
    ...source,
    englishVersion: INT_CP007_ENGLISH_VERSION,
    explanation: deepFreeze({
      ...source.explanation,
      steps: Object.freeze(steps),
    }),
  });
}

function rebuildQl113(source: IntCp007EnglishQuestionV3): IntCp007EnglishQuestion {
  const state = source.mathematicalState;
  const contract: any = state.contractState;
  const factorA = schemeFactor(contract.schemeA);
  const factorB = schemeFactor(contract.schemeB);
  const answer = solveIntCp007(state);
  const steps = [...source.explanation.steps];
  steps[3] = `Dividing by P_B × ${formatRational(factorA)} gives P_A/P_B = ${formatRational(factorB)}/${formatRational(factorA)} = ${answer.numerator}/${answer.denominator}.`;
  steps[4] = `Therefore Principal A : Principal B = ${ratioText(answer)}. This is the inverse ratio of the complete accumulation factors, so substituting it makes the two future values equal.`;

  return deepFreeze({
    ...source,
    englishVersion: INT_CP007_ENGLISH_VERSION,
    explanation: deepFreeze({
      ...source.explanation,
      steps: Object.freeze(steps),
    }),
  });
}

function annualSchemeDescription(scheme: any): string {
  if (scheme.method === "SIMPLE") return `simple interest at ${formatPercent(scheme.annualRatePercent)} p.a.`;
  return `compound interest at ${formatPercent(scheme.annualRatePercent)} p.a., compounded annually`;
}

function rebuildQl114(source: IntCp007EnglishQuestionV3): IntCp007EnglishQuestion {
  const state = source.mathematicalState;
  const contract: any = state.contractState;
  const a = annualSchemeDescription(contract.initiallyHigherScheme);
  const b = annualSchemeDescription(contract.overtakingScheme);
  const template = Number(source.presentation.stemFamilyId.slice(-1)) - 1;
  const stems = Object.freeze([
    `The same principal is placed under two continuing annual schemes. Scheme A earns ${a}, while Scheme B earns ${b}. After how many complete years will Scheme B first have a larger accumulated amount than Scheme A?`,
    `Starting with equal principals, Plan A follows ${a} and Plan B follows ${b}. Find the first whole year at which Plan B overtakes Plan A in accumulated value.`,
    `Two equal sums grow from the same starting date. A uses ${a}; B uses ${b}. Determine the earliest complete year when B's accumulated amount becomes greater than A's.`,
  ]);
  if (template < 0 || template > 2) throw new Error(`INT-QL-114/${source.seed}: invalid stem-family index`);
  const markdown = stems[template]!;

  return deepFreeze({
    ...source,
    englishVersion: INT_CP007_ENGLISH_VERSION,
    presentation: deepFreeze({
      ...source.presentation,
      markdown,
      prompt: markdown,
    }),
  });
}

export function generateIntCp007EnglishQuestion(
  qlId: IntCp007QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp007EnglishQuestion {
  const source = generateV3(qlId, seed, locale);
  if (qlId === "INT-QL-111") return rebuildQl111(source);
  if (qlId === "INT-QL-113") return rebuildQl113(source);
  if (qlId === "INT-QL-114") return rebuildQl114(source);
  return deepFreeze({ ...source, englishVersion: INT_CP007_ENGLISH_VERSION });
}
