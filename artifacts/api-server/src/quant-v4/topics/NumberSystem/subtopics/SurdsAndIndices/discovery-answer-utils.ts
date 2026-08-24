import {
  addRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
  reciprocalRational,
  subtractRational,
  type Rational,
} from "../../../../shared/surds-indices";
import type { SriCandidateAnswer } from "./discovery-types";
import type { SriDistractor } from "./discovery-runtime";

export function rationalAnswer(value: Rational): SriCandidateAnswer {
  return { text: formatRational(value), canonicalKey: `R:${rationalKey(value)}` };
}

export function integerAnswer(value: bigint | number): SriCandidateAnswer {
  return rationalAnswer(rational(value));
}

export function textAnswer(text: string, canonicalKey = `T:${text}`): SriCandidateAnswer {
  return { text, canonicalKey };
}

export function rationalDistractors(value: Rational): SriDistractor[] {
  const candidates: readonly [Rational, string][] = [
    [addRational(value, rational(1)), "OFF_BY_ONE"],
    [subtractRational(value, rational(1)), "OFF_BY_ONE"],
    [multiplyRational(value, rational(2)), "DOUBLE_RESULT"],
    [divideRational(value, rational(2)), "HALF_RESULT"],
    ...(value.numerator !== 0n ? [[reciprocalRational(value), "RECIPROCAL_ERROR"] as const] : []),
    [rational(-value.numerator, value.denominator), "SIGN_ERROR"],
  ];
  const seen = new Set<string>([`R:${rationalKey(value)}`]);
  const distractors: SriDistractor[] = [];
  for (const [candidate, misconceptionId] of candidates) {
    const answer = rationalAnswer(candidate);
    if (!seen.has(answer.canonicalKey)) {
      seen.add(answer.canonicalKey);
      distractors.push({ ...answer, misconceptionId });
    }
    if (distractors.length >= 5) break;
  }
  return distractors;
}

export function textDistractors(values: readonly { text: string; key?: string; misconceptionId: string }[]): SriDistractor[] {
  return values.map((value) => ({
    text: value.text,
    canonicalKey: value.key ?? `T:${value.text}`,
    misconceptionId: value.misconceptionId,
  }));
}
