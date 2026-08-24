import {
  formatRationalLatex,
  formatSquareSurdLatex,
  formatSurdSumLatex,
  rational,
  rationalKey,
  squareSurd,
  squareSurdKey,
  surdSum,
  surdSumKey,
  type Rational,
  type SquareSurd,
  type SurdSum,
} from "../../../../../shared/surds-indices";
import { textDistractors } from "../discovery-answer-utils";
import type { SriCandidateAnswer } from "../discovery-types";
import type { SriDistractor } from "../discovery-runtime";

export interface NthRadical {
  readonly coefficient: Rational;
  readonly index: number;
  readonly radicand: bigint;
}

export function nthRadical(coefficient: Rational, index: number, radicand: bigint): NthRadical {
  if (!Number.isInteger(index) || index < 2) throw new Error("Nth radical index must be >=2");
  if (radicand <= 0n) throw new Error("Discovery nth radical uses a positive radicand");
  return { coefficient, index, radicand };
}

export function nthRadicalKey(value: NthRadical): string {
  return `N:${rationalKey(value.coefficient)}:${value.index}:${value.radicand}`;
}

export function formatNthRadical(value: NthRadical): string {
  if (value.radicand === 1n) return formatRationalLatex(value.coefficient);
  const abs = rational(value.coefficient.numerator < 0n ? -value.coefficient.numerator : value.coefficient.numerator, value.coefficient.denominator);
  const sign = value.coefficient.numerator < 0n ? "-" : "";
  const coefficientText = abs.numerator === abs.denominator ? "" : formatRationalLatex(abs);
  const root = value.index === 2 ? `\\sqrt{${value.radicand}}` : `\\sqrt[${value.index}]{${value.radicand}}`;
  return `${sign}${coefficientText}${root}`;
}

export function nthRadicalAnswer(value: NthRadical): SriCandidateAnswer {
  return { text: formatNthRadical(value), canonicalKey: nthRadicalKey(value) };
}

export function squareSurdAnswer(value: SquareSurd): SriCandidateAnswer {
  return { text: formatSquareSurdLatex(value), canonicalKey: `S:${squareSurdKey(value)}` };
}

export function surdSumAnswer(value: SurdSum): SriCandidateAnswer {
  return { text: formatSurdSumLatex(value), canonicalKey: `SS:${surdSumKey(value)}` };
}

export function squareSurdDistractors(value: SquareSurd): SriDistractor[] {
  const c = value.coefficient;
  const r = value.radicand;
  const candidates: readonly [SquareSurd, string][] = [
    [squareSurd(rational(c.numerator + c.denominator, c.denominator), r), "COEFFICIENT_OFF_BY_ONE"],
    [squareSurd(rational(c.numerator - c.denominator, c.denominator), r), "COEFFICIENT_OFF_BY_ONE"],
    [squareSurd(rational(-c.numerator, c.denominator), r), "SIGN_ERROR"],
    [squareSurd(c, r === 1n ? 2n : r + 1n), "RADICAND_NOT_SIMPLIFIED"],
  ];
  const answer = squareSurdAnswer(value);
  const seen = new Set<string>([answer.canonicalKey]);
  const output: SriDistractor[] = [];
  for (const [candidate, misconceptionId] of candidates) {
    const option = squareSurdAnswer(candidate);
    if (!seen.has(option.canonicalKey)) {
      seen.add(option.canonicalKey);
      output.push({ ...option, misconceptionId });
    }
    if (output.length >= 3) break;
  }
  return output;
}

export function surdSumDistractors(value: SurdSum): SriDistractor[] {
  const terms = value.terms;
  const variants: SurdSum[] = [];
  if (terms.length > 0) {
    variants.push(surdSum(terms.map((term, index) => index === 0
      ? { coefficient: rational(term.coefficient.numerator + term.coefficient.denominator, term.coefficient.denominator), radicand: term.radicand }
      : term)));
    variants.push(surdSum(terms.map((term, index) => index === terms.length - 1
      ? { coefficient: rational(-term.coefficient.numerator, term.coefficient.denominator), radicand: term.radicand }
      : term)));
  }
  variants.push(surdSum([...terms, { coefficient: rational(1), radicand: 1n }]));
  variants.push(surdSum([...terms, { coefficient: rational(-1), radicand: 1n }]));

  const correct = surdSumAnswer(value);
  const seen = new Set<string>([correct.canonicalKey]);
  const output: SriDistractor[] = [];
  const labels = ["RATIONAL_PART_ERROR", "SURD_SIGN_ERROR", "EXTRA_ONE", "MISSING_ONE"];
  for (let index = 0; index < variants.length; index += 1) {
    const option = surdSumAnswer(variants[index]!);
    if (!seen.has(option.canonicalKey)) {
      seen.add(option.canonicalKey);
      output.push({ ...option, misconceptionId: labels[index]! });
    }
    if (output.length >= 3) break;
  }
  return output;
}

export function classificationDistractors(correct: "RATIONAL" | "IRRATIONAL" | "SURD"): SriDistractor[] {
  const labels = ["RATIONAL", "IRRATIONAL", "SURD", "NOT_REAL"] as const;
  return textDistractors(labels.filter((label) => label !== correct).map((label) => ({
    text: label === "NOT_REAL" ? "Not a real number" : label.charAt(0) + label.slice(1).toLowerCase(),
    key: `T:${label}`,
    misconceptionId: `MISCLASSIFY_AS_${label}`,
  })));
}

export function pairAnswer(first: Rational, second: Rational): SriCandidateAnswer {
  return {
    text: `(${formatRationalLatex(first)}, ${formatRationalLatex(second)})`,
    canonicalKey: `PAIR:${rationalKey(first)}:${rationalKey(second)}`,
  };
}
