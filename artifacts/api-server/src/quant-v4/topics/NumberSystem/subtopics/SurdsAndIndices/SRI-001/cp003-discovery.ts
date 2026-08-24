import {
  divideRational,
  evaluateExactRationalPower,
  formatRational,
  multiplyRational,
  powRationalInteger,
  proofEvent,
  rational,
  rationalExponent,
  rationalKey,
  sriInt,
  sriPick,
  type Rational,
} from "../../../../../shared/surds-indices";
import { rationalDistractors } from "../discovery-answer-utils";
import { finalizeSriDiscoveryQuestion, type SriDistractor } from "../discovery-runtime";
import type { SriCandidateAnswer, SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";

export const SRI_CP003_CANDIDATES: readonly SriCandidateDescriptor[] = [
  { candidateId: "C003-A", checkpointId: "SRI-CP-003", title: "rewrite composite bases to one common base", sourceDisposition: "KEEP" },
  { candidateId: "C003-B", checkpointId: "SRI-CP-003", title: "simplify product/quotient after base harmonisation", sourceDisposition: "KEEP" },
  { candidateId: "C003-C", checkpointId: "SRI-CP-003", title: "harmonise reciprocal bases", sourceDisposition: "NEW" },
  { candidateId: "C003-D", checkpointId: "SRI-CP-003", title: "combine same-exponent different composite bases", sourceDisposition: "NEW" },
  { candidateId: "C003-E", checkpointId: "SRI-CP-003", title: "mixed integer/negative/fractional exponent structure after harmonisation", sourceDisposition: "EXPAND" },
  { candidateId: "C003-F", checkpointId: "SRI-CP-003", title: "equivalence decision between differently written power expressions", sourceDisposition: "EXPAND" },
] as const;

function intPow(base: number, exponent: number): number {
  let value = 1;
  for (let i = 0; i < exponent; i += 1) value *= base;
  return value;
}

function powerAnswer(text: string, value: Rational): SriCandidateAnswer {
  return { text, canonicalKey: `R:${rationalKey(value)}` };
}

function powerDistractors(items: readonly { text: string; value: Rational; misconceptionId: string }[], correctKey: string): SriDistractor[] {
  const seen = new Set<string>([correctKey]);
  const output: SriDistractor[] = [];
  for (const item of items) {
    const key = `R:${rationalKey(item.value)}`;
    if (!seen.has(key)) {
      seen.add(key);
      output.push({ text: item.text, canonicalKey: key, misconceptionId: item.misconceptionId });
    }
  }
  return output;
}

function finish(
  candidateId: string,
  seed: string,
  state: Readonly<Record<string, string | number | boolean>>,
  stem: string,
  answer: SriCandidateAnswer,
  verifier: Rational,
  distractors: readonly SriDistractor[],
  method: string,
  working: readonly string[],
): SriDiscoveryQuestion {
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-001",
    checkpointId: "SRI-CP-003",
    candidateId,
    seed,
    state,
    stem,
    answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: `R:${rationalKey(verifier)}`,
    distractors,
    explanation: {
      given: stem.replace(/\?$/, ""),
      asked: "Rewrite the bases into a common structure and simplify exactly.",
      method,
      working,
      answer: answer.text,
    },
    proofEvents: [proofEvent("TRANSFORM", "base harmonisation", { stem }, { answer: answer.text })],
  });
}

export function generateSriCp003Candidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  const commonBase = sriPick(`${seed}:common-base`, [2, 3]);
  const k1 = sriPick(`${seed}:k1`, [2, 3]);
  const k2 = sriPick(`${seed}:k2`, [2, 3, 4].filter((value) => value !== k1));
  const visible1 = intPow(commonBase, k1);
  const visible2 = intPow(commonBase, k2);
  const m = sriInt(`${seed}:m`, 2, 4);
  const n = sriInt(`${seed}:n`, 1, 3);

  switch (candidateId) {
    case "C003-A": {
      const exponent = k1 * m + k2 * n;
      const value = rational(intPow(commonBase, exponent));
      const answer = powerAnswer(`${commonBase}^${exponent}`, value);
      const verifier = multiplyRational(powRationalInteger(rational(visible1), m), powRationalInteger(rational(visible2), n));
      return finish(candidateId, seed, { commonBase, visible1, visible2, m, n },
        `Rewrite ${visible1}^${m} × ${visible2}^${n} as a single power of ${commonBase}.`, answer, verifier,
        powerDistractors([
          { text: `${commonBase}^${m + n}`, value: rational(intPow(commonBase, m + n)), misconceptionId: "IGNORE_BASE_TRANSFORMATION_POWER" },
          { text: `${commonBase}^${k1 + k2 + m + n}`, value: rational(intPow(commonBase, k1 + k2 + m + n)), misconceptionId: "ADD_ALL_VISIBLE_EXPONENTS" },
          { text: `${commonBase}^${k1 * m - k2 * n}`, value: rational(intPow(commonBase, Math.abs(k1 * m - k2 * n))), misconceptionId: "SUBTRACT_ON_PRODUCT" },
        ], answer.canonicalKey),
        "Express each composite base as a power of the common base, then add exponents.",
        [`${visible1} = ${commonBase}^${k1} and ${visible2} = ${commonBase}^${k2}`, `Total exponent = ${k1}×${m} + ${k2}×${n} = ${exponent}`]);
    }
    case "C003-B": {
      const topExponent = k1 * (m + n);
      const bottomExponent = k2 * n;
      const net = topExponent - bottomExponent;
      const numerator = powRationalInteger(rational(visible1), m + n);
      const denominator = powRationalInteger(rational(visible2), n);
      const verifier = divideRational(numerator, denominator);
      const solver = evaluateExactRationalPower(rational(commonBase), rationalExponent(net));
      const answer = powerAnswer(net >= 0 ? `${commonBase}^${net}` : `1/${commonBase}^${-net}`, solver);
      return finish(candidateId, seed, { commonBase, visible1, visible2, numeratorExponent: m + n, denominatorExponent: n },
        `Simplify ${visible1}^${m + n} ÷ ${visible2}^${n}.`, answer, verifier,
        rationalDistractors(solver),
        "Convert both bases to the same prime base and subtract the denominator exponent contribution.",
        [`Net exponent of ${commonBase} = ${k1}×${m + n} - ${k2}×${n} = ${net}`, `Value = ${formatRational(solver)}`]);
    }
    case "C003-C": {
      const exponent = sriInt(`${seed}:reciprocal-exp`, 2, 4);
      const reciprocalBase = intPow(commonBase, k1);
      const positivePower = sriInt(`${seed}:positive-power`, 1, 4);
      const netExponent = k1 * exponent + positivePower;
      const solver = evaluateExactRationalPower(rational(commonBase), rationalExponent(netExponent));
      const reciprocalTerm = evaluateExactRationalPower(rational(1, reciprocalBase), rationalExponent(-exponent));
      const verifier = multiplyRational(reciprocalTerm, powRationalInteger(rational(commonBase), positivePower));
      const answer = powerAnswer(`${commonBase}^${netExponent}`, solver);
      return finish(candidateId, seed, { commonBase, reciprocalBase: `1/${reciprocalBase}`, reciprocalExponent: -exponent, positivePower },
        `Simplify (1/${reciprocalBase})^(-${exponent}) × ${commonBase}^${positivePower}.`, answer, verifier,
        rationalDistractors(solver),
        "Reverse the reciprocal under the negative exponent, then express everything with the common base.",
        [`(1/${reciprocalBase})^(-${exponent}) = ${reciprocalBase}^${exponent} = ${commonBase}^${k1 * exponent}`, `Add ${positivePower}: net exponent = ${netExponent}`]);
    }
    case "C003-D": {
      const exponent = sriInt(`${seed}:shared-exp`, 2, 3);
      const combinedBase = visible1 * visible2;
      const verifier = multiplyRational(powRationalInteger(rational(visible1), exponent), powRationalInteger(rational(visible2), exponent));
      const solver = powRationalInteger(rational(combinedBase), exponent);
      const commonExponent = (k1 + k2) * exponent;
      const answer = powerAnswer(`${combinedBase}^${exponent} (= ${commonBase}^${commonExponent})`, solver);
      const stem = sriPick(`${seed}:stem-surface`, [
        `Simplify ${visible1}^${exponent} × ${visible2}^${exponent}.`,
        `Write ${visible1}^${exponent} × ${visible2}^${exponent} as one power.`,
        `Using the common exponent, find an equivalent single-power form of ${visible1}^${exponent} × ${visible2}^${exponent}.`,
        `Which single power is equal to ${visible1}^${exponent} × ${visible2}^${exponent}?`,
      ]);
      return finish(candidateId, seed, { commonBase, visible1, visible2, exponent }, stem, answer, verifier,
        rationalDistractors(solver),
        "Equal exponents allow the bases to be multiplied; the composite result can also be harmonised to the prime base.",
        [`(${visible1}×${visible2})^${exponent} = ${combinedBase}^${exponent}`, `Since ${combinedBase} = ${commonBase}^${k1 + k2}, this is ${commonBase}^${commonExponent}.`]);
    }
    case "C003-E": {
      const rootBase = intPow(commonBase, 2);
      const cubeBase = intPow(commonBase, 3);
      const positive = sriInt(`${seed}:positive`, 1, 3);
      const negative = sriInt(`${seed}:negative`, 1, 2);
      const fractionalNumerator = sriPick(`${seed}:fractional-num`, [1, 3]);
      const fractionalContribution = 2 * fractionalNumerator / 2;
      const net = positive - 3 * negative + fractionalContribution;
      const solver = evaluateExactRationalPower(rational(commonBase), rationalExponent(net));
      const verifier = multiplyRational(
        multiplyRational(
          powRationalInteger(rational(commonBase), positive),
          evaluateExactRationalPower(rational(cubeBase), rationalExponent(-negative)),
        ),
        evaluateExactRationalPower(rational(rootBase), rationalExponent(fractionalNumerator, 2)),
      );
      const answer = powerAnswer(formatRational(solver), solver);
      return finish(candidateId, seed, { commonBase, positive, cubeBase, negativeExponent: -negative, rootBase, fractionalExponent: `${fractionalNumerator}/2` },
        `Evaluate ${commonBase}^${positive} × ${cubeBase}^(-${negative}) × ${rootBase}^(${fractionalNumerator}/2).`, answer, verifier,
        rationalDistractors(solver),
        "Convert every factor to the same base, preserving signed and fractional exponent contributions.",
        [`${cubeBase}^(-${negative}) = ${commonBase}^(-${3 * negative})`, `${rootBase}^(${fractionalNumerator}/2) = ${commonBase}^${fractionalContribution}`, `Net exponent = ${net}; value = ${formatRational(solver)}`]);
    }
    case "C003-F": {
      const exponent = k1 * m + k2 * n;
      const verifier = multiplyRational(powRationalInteger(rational(visible1), m), powRationalInteger(rational(visible2), n));
      const correctValue = rational(intPow(commonBase, exponent));
      const answer = powerAnswer(`${commonBase}^${exponent}`, correctValue);
      return finish(candidateId, seed, { commonBase, visible1, visible2, m, n },
        `Which option is equivalent to ${visible1}^${m} × ${visible2}^${n}?`, answer, verifier,
        powerDistractors([
          { text: `${commonBase}^${exponent + 1}`, value: rational(intPow(commonBase, exponent + 1)), misconceptionId: "OFF_BY_ONE_AFTER_HARMONISATION" },
          { text: `${commonBase}^${m + n}`, value: rational(intPow(commonBase, m + n)), misconceptionId: "IGNORE_COMPOSITE_BASE_POWERS" },
          { text: `${commonBase}^${Math.abs(k1 * m - k2 * n)}`, value: rational(intPow(commonBase, Math.abs(k1 * m - k2 * n))), misconceptionId: "SUBTRACT_PRODUCT_EXPONENTS" },
        ], answer.canonicalKey),
        "Normalize each visible base to the common prime base and compare canonical values.",
        [`${visible1}^${m} = ${commonBase}^${k1 * m}`, `${visible2}^${n} = ${commonBase}^${k2 * n}`, `Combined exponent = ${exponent}`]);
    }
    default:
      throw new Error(`Unknown SRI-CP-003 candidate: ${candidateId}`);
  }
}
