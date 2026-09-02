import { type Rational } from "./cp003-exam-model";
import { schemeFactor } from "./cp007-scheme-equivalence-runtime-v1";
import {
  INT_CP007_ENGLISH_VERSION as INT_CP007_ENGLISH_VERSION_V5,
  generateIntCp007EnglishQuestion as generateV5,
  type IntCp007EnglishQuestion as IntCp007EnglishQuestionV5,
} from "./cp007-scheme-equivalence-english-v5";
import { solveIntCp007, type IntCp007QlId } from "./cp007-scheme-equivalence-runtime-v3-final";

export const INT_CP007_ENGLISH_VERSION = "INT-CP-007-EN-v6-latex-exact-review" as const;
export const INT_CP007_ENGLISH_V6_SUPERSEDES = INT_CP007_ENGLISH_VERSION_V5;

export type IntCp007EnglishQuestion = Omit<IntCp007EnglishQuestionV5, "englishVersion"> & {
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

function rationalKey(value: Rational): string {
  return `${value.numerator}/${value.denominator}`;
}

function exactLatex(value: Rational, maximumDecimals = 6): string {
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
  return `${sign}\\frac{${numerator / divisor}}{${denominator / divisor}}`;
}

function approximateToken(value: Rational, maximumDecimals = 6): string | null {
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = value.numerator < 0n ? -value.numerator : value.numerator;
  const denominator = value.denominator;
  let remainder = numerator % denominator;
  if (remainder === 0n) return null;

  for (let index = 0; index < maximumDecimals && remainder !== 0n; index += 1) {
    remainder = (remainder * 10n) % denominator;
  }
  if (remainder === 0n) return null;

  const scale = 10n ** BigInt(maximumDecimals);
  const rounded = (numerator * scale * 2n + denominator) / (2n * denominator);
  const roundedWhole = rounded / scale;
  const roundedFraction = (rounded % scale).toString().padStart(maximumDecimals, "0").replace(/0+$/u, "");
  return `${sign}\\approx ${roundedWhole}${roundedFraction ? `.${roundedFraction}` : ""}`;
}

function relevantFactors(question: IntCp007EnglishQuestionV5): Rational[] {
  const contract: any = question.mathematicalState.contractState;
  const answer = solveIntCp007(question.mathematicalState);
  const factors: Rational[] = [];
  const add = (value: Rational): void => {
    if (!factors.some((existing) => rationalKey(existing) === rationalKey(value))) factors.push(value);
  };

  switch (question.qlId) {
    case "INT-QL-109":
    case "INT-QL-110":
    case "INT-QL-112":
    case "INT-QL-113":
      add(schemeFactor(contract.schemeA));
      add(schemeFactor(contract.schemeB));
      break;
    case "INT-QL-111":
      add(schemeFactor(contract.knownScheme));
      add(schemeFactor({ method: contract.missingMethod, annualRatePercent: answer, years: contract.missingYears }));
      if (contract.missingMethod === "COMPOUND" && contract.missingYears > 1) {
        add(schemeFactor({ method: "COMPOUND", annualRatePercent: answer, years: 1 }));
      }
      break;
    case "INT-QL-114": {
      const year = Number(answer.numerator);
      const previousYear = year - 1;
      add(schemeFactor({ ...contract.initiallyHigherScheme, years: previousYear }));
      add(schemeFactor({ ...contract.overtakingScheme, years: previousYear }));
      add(schemeFactor({ ...contract.initiallyHigherScheme, years: year }));
      add(schemeFactor({ ...contract.overtakingScheme, years: year }));
      break;
    }
    case "INT-QL-115":
      add(schemeFactor(contract.knownScheme));
      add(schemeFactor(contract.missingScheme));
      break;
  }

  return factors;
}

function exactReplacementMap(question: IntCp007EnglishQuestionV5): ReadonlyMap<string, string> {
  const replacements = new Map<string, string>();
  for (const factor of relevantFactors(question)) {
    const token = approximateToken(factor);
    if (!token) continue;
    const exact = exactLatex(factor);
    const previous = replacements.get(token);
    if (previous && previous !== exact) {
      throw new Error(`${question.qlId}/${question.seed}: rounded factor collision ${token} maps to both ${previous} and ${exact}`);
    }
    replacements.set(token, exact);
  }
  return replacements;
}

function replaceApproximateFactorTokens(text: string, replacements: ReadonlyMap<string, string>): string {
  let result = text;
  for (const [approximate, exact] of replacements.entries()) {
    result = result.split(approximate).join(exact);
  }
  return result;
}

function exactExplanation(question: IntCp007EnglishQuestionV5): IntCp007EnglishQuestionV5["explanation"] {
  const replacements = exactReplacementMap(question);
  const map = (text: string): string => replaceApproximateFactorTokens(text, replacements);
  return deepFreeze({
    keyIdea: map(question.explanation.keyIdea),
    steps: Object.freeze(question.explanation.steps.map(map)),
    finalAnswer: question.explanation.finalAnswer,
    commonMistake: map(question.explanation.commonMistake),
  });
}

export function generateIntCp007EnglishQuestion(
  qlId: IntCp007QlId,
  seed: string,
  locale: "en-IN" = "en-IN",
): IntCp007EnglishQuestion {
  const source = generateV5(qlId, seed, locale);
  const explanation = exactExplanation(source);
  const remainingApproximation = [explanation.keyIdea, ...explanation.steps, explanation.commonMistake].join(" ");
  if (remainingApproximation.includes("\\approx")) {
    throw new Error(`${qlId}/${seed}: V6 left an approximate factor in learner explanation`);
  }
  return deepFreeze({
    ...source,
    englishVersion: INT_CP007_ENGLISH_VERSION,
    explanation,
  });
}
