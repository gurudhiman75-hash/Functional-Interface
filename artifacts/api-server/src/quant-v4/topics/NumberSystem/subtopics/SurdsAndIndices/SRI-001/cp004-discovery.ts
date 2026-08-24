import {
  divideRational,
  multiplyRational,
  powRationalInteger,
  proofEvent,
  rational,
  rationalKey,
  sriInt,
  sriPick,
  type Rational,
} from "../../../../../shared/surds-indices";
import { rationalAnswer, rationalDistractors } from "../discovery-answer-utils";
import { finalizeSriDiscoveryQuestion } from "../discovery-runtime";
import type { SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";

export const SRI_CP004_CANDIDATES: readonly SriCandidateDescriptor[] = [
  { candidateId: "C004-A", checkpointId: "SRI-CP-004", title: "given a^x find a^(x+k)", sourceDisposition: "KEEP" },
  { candidateId: "C004-B", checkpointId: "SRI-CP-004", title: "given a^x find a^(x-k)", sourceDisposition: "KEEP" },
  { candidateId: "C004-C", checkpointId: "SRI-CP-004", title: "given a^x find a^(mx)", sourceDisposition: "KEEP" },
  { candidateId: "C004-D", checkpointId: "SRI-CP-004", title: "combine two supplied power relations into a new target", sourceDisposition: "NEW" },
  { candidateId: "C004-E", checkpointId: "SRI-CP-004", title: "recover a power relation parameter from X and Y", sourceDisposition: "NEW" },
  { candidateId: "C004-F", checkpointId: "SRI-CP-004", title: "recover an integer parameter from a transformed power value", sourceDisposition: "EXPAND" },
  { candidateId: "C004-G", checkpointId: "SRI-CP-004", title: "derive a secondary quantity after parameter recovery", sourceDisposition: "NEW" },
] as const;

function powBigInt(base: number, exponent: number): bigint {
  let value = 1n;
  for (let i = 0; i < exponent; i += 1) value *= BigInt(base);
  return value;
}

function finish(
  candidateId: string,
  seed: string,
  state: Readonly<Record<string, string | number | boolean>>,
  stem: string,
  answerValue: Rational,
  verifierValue: Rational,
  method: string,
  working: readonly string[],
): SriDiscoveryQuestion {
  const answer = rationalAnswer(answerValue);
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-001",
    checkpointId: "SRI-CP-004",
    candidateId,
    seed,
    state,
    stem,
    answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: `R:${rationalKey(verifierValue)}`,
    distractors: rationalDistractors(answerValue),
    explanation: {
      given: stem.replace(/\?$/, ""),
      asked: "Use the supplied power relation to recover the requested exact quantity.",
      method,
      working,
      answer: answer.text,
    },
    proofEvents: [proofEvent("TRANSFORM", method, { stem }, { answer: answer.text })],
  });
}

export function generateSriCp004Candidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  const base = sriPick(`${seed}:base`, [2, 3, 5]);
  const x = sriInt(`${seed}:x`, 2, 5);
  const known = rational(powBigInt(base, x));

  switch (candidateId) {
    case "C004-A": {
      const k = sriInt(`${seed}:k`, 1, 4);
      const solver = multiplyRational(known, rational(powBigInt(base, k)));
      const verifier = rational(powBigInt(base, x + k));
      const stem = sriPick(`${seed}:surface`, [
        `If ${base}^x = ${powBigInt(base, x)}, find ${base}^(x+${k}).`,
        `Given ${base}^x = ${powBigInt(base, x)}, evaluate ${base}^(x+${k}).`,
        `The value of ${base}^x is ${powBigInt(base, x)}. What is ${base}^(x+${k})?`,
      ]);
      return finish(candidateId, seed, { base, knownValue: powBigInt(base, x).toString(), increment: k }, stem, solver, verifier,
        "Split the target as a^x × a^k and substitute the known relation.",
        [`${base}^(x+${k}) = ${base}^x × ${base}^${k}`, `= ${powBigInt(base, x)} × ${powBigInt(base, k)} = ${powBigInt(base, x + k)}`]);
    }
    case "C004-B": {
      const k = sriInt(`${seed}:k`, 1, Math.min(3, x));
      const solver = divideRational(known, rational(powBigInt(base, k)));
      const verifier = rational(powBigInt(base, x - k));
      const stem = sriPick(`${seed}:surface`, [
        `If ${base}^x = ${powBigInt(base, x)}, find ${base}^(x-${k}).`,
        `Given ${base}^x = ${powBigInt(base, x)}, evaluate ${base}^(x-${k}).`,
        `Using ${base}^x = ${powBigInt(base, x)}, determine ${base}^(x-${k}).`,
      ]);
      return finish(candidateId, seed, { base, knownValue: powBigInt(base, x).toString(), decrement: k }, stem, solver, verifier,
        "Write the target as a^x ÷ a^k and substitute the supplied value.",
        [`${base}^(x-${k}) = ${base}^x/${base}^${k}`, `= ${powBigInt(base, x)}/${powBigInt(base, k)} = ${powBigInt(base, x - k)}`]);
    }
    case "C004-C": {
      const multiplier = sriInt(`${seed}:multiplier`, 2, 3);
      const solver = powRationalInteger(known, multiplier);
      const verifier = rational(powBigInt(base, x * multiplier));
      const stem = sriPick(`${seed}:surface`, [
        `If ${base}^x = ${powBigInt(base, x)}, find ${base}^(${multiplier}x).`,
        `Given ${base}^x = ${powBigInt(base, x)}, evaluate ${base}^(${multiplier}x).`,
        `From ${base}^x = ${powBigInt(base, x)}, determine the value of ${base}^(${multiplier}x).`,
      ]);
      return finish(candidateId, seed, { base, knownValue: powBigInt(base, x).toString(), multiplier }, stem, solver, verifier,
        "Recognize a^(mx) as (a^x)^m.",
        [`${base}^(${multiplier}x) = (${base}^x)^${multiplier}`, `= ${powBigInt(base, x)}^${multiplier} = ${powBigInt(base, x * multiplier)}`]);
    }
    case "C004-D": {
      const p = sriInt(`${seed}:p`, 1, 4);
      const q = sriInt(`${seed}:q`, 1, 4);
      const mode = sriPick(`${seed}:mode`, ["sum", "difference"] as const);
      const first = rational(powBigInt(base, p));
      const second = rational(powBigInt(base, q));
      const solver = mode === "sum" ? multiplyRational(first, second) : divideRational(first, second);
      const verifier = mode === "sum" ? rational(powBigInt(base, p + q)) : rational(powBigInt(base, Math.abs(p - q)), p >= q ? 1 : Number(powBigInt(base, 2 * (q - p))));
      const exactVerifier = mode === "sum"
        ? rational(powBigInt(base, p + q))
        : p >= q ? rational(powBigInt(base, p - q)) : rational(1n, powBigInt(base, q - p));
      const operation = mode === "sum" ? `p+q` : `p-q`;
      const stem = `If ${base}^p = ${powBigInt(base, p)} and ${base}^q = ${powBigInt(base, q)}, find ${base}^(${operation}).`;
      return finish(candidateId, seed, { base, pValue: powBigInt(base, p).toString(), qValue: powBigInt(base, q).toString(), mode }, stem, solver, exactVerifier,
        mode === "sum" ? "Multiply the supplied relations to add exponents." : "Divide the supplied relations to subtract exponents.",
        mode === "sum"
          ? [`${base}^(p+q) = ${base}^p × ${base}^q`, `= ${powBigInt(base, p)} × ${powBigInt(base, q)}`]
          : [`${base}^(p-q) = ${base}^p/${base}^q`, `= ${powBigInt(base, p)}/${powBigInt(base, q)}`]);
    }
    case "C004-E": {
      const p = sriInt(`${seed}:p`, 1, 3);
      const multiplier = sriInt(`${seed}:relation-multiplier`, 2, 4);
      const q = p * multiplier;
      const X = powBigInt(base, p);
      const Y = powBigInt(base, q);
      const answer = rational(multiplier);
      const verifier = rational(q / p);
      const stem = sriPick(`${seed}:surface`, [
        `Let X = ${base}^${p} and Y = ${base}^${q}. If Y = X^n, find n.`,
        `For X=${base}^${p} and Y=${base}^${q}, determine n when Y=X^n.`,
        `Given X=${X}=${base}^${p} and Y=${Y}=${base}^${q}, find the exponent n in Y=X^n.`,
      ]);
      return finish(candidateId, seed, { base, p, q, X: X.toString(), Y: Y.toString() }, stem, answer, verifier,
        "Compare exponents after writing X^n with the same base.",
        [`X^n = (${base}^${p})^n = ${base}^(${p}n)`, `${p}n = ${q}, so n = ${multiplier}`]);
    }
    case "C004-F": {
      const k = sriInt(`${seed}:k`, 1, 4);
      const transformed = powBigInt(base, x + k);
      const ratio = rational(transformed, powBigInt(base, x));
      const answer = rational(k);
      const verifierPower = powBigInt(base, k);
      let recovered = 0;
      let probe = 1n;
      while (probe < verifierPower) { probe *= BigInt(base); recovered += 1; }
      const verifier = rational(recovered);
      const stem = sriPick(`${seed}:surface`, [
        `If ${base}^x = ${powBigInt(base, x)} and ${base}^(x+k) = ${transformed}, find k.`,
        `Given ${base}^x=${powBigInt(base, x)} while ${base}^(x+k)=${transformed}, determine k.`,
        `The values ${base}^x=${powBigInt(base, x)} and ${base}^(x+k)=${transformed} are known. What is k?`,
      ]);
      return finish(candidateId, seed, { base, knownValue: powBigInt(base, x).toString(), transformedValue: transformed.toString() }, stem, answer, verifier,
        "Divide the transformed relation by the original one; the quotient equals a^k.",
        [`${transformed}/${powBigInt(base, x)} = ${ratio.numerator}/${ratio.denominator}`, `So ${base}^k = ${verifierPower}, giving k=${k}.`]);
    }
    case "C004-G": {
      const k = sriInt(`${seed}:k`, 1, 3);
      const transformed = powBigInt(base, x + k);
      const solver = rational(powBigInt(base, x + 2 * k));
      const recoveredKFactor = rational(transformed, powBigInt(base, x));
      const verifier = multiplyRational(rational(transformed), recoveredKFactor);
      const stem = sriPick(`${seed}:surface`, [
        `If ${base}^x=${powBigInt(base, x)} and ${base}^(x+k)=${transformed}, find ${base}^(x+2k).`,
        `Given ${base}^x=${powBigInt(base, x)} and ${base}^(x+k)=${transformed}, evaluate ${base}^(x+2k).`,
        `Using the two relations ${base}^x=${powBigInt(base, x)} and ${base}^(x+k)=${transformed}, determine ${base}^(x+2k).`,
      ]);
      return finish(candidateId, seed, { base, knownValue: powBigInt(base, x).toString(), transformedValue: transformed.toString() }, stem, solver, verifier,
        "First recover the multiplier a^k from the ratio, then apply that multiplier once more.",
        [`a^k = ${transformed}/${powBigInt(base, x)} = ${powBigInt(base, k)}`, `${base}^(x+2k) = ${transformed} × ${powBigInt(base, k)} = ${powBigInt(base, x + 2 * k)}`]);
    }
    default:
      throw new Error(`Unknown SRI-CP-004 candidate: ${candidateId}`);
  }
}
