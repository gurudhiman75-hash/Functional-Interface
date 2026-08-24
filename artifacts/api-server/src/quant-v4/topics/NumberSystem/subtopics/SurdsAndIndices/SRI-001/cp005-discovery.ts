import {
  proofEvent,
  rational,
  rationalKey,
  sriInt,
  sriPick,
} from "../../../../../shared/surds-indices";
import { rationalAnswer, rationalDistractors } from "../discovery-answer-utils";
import { finalizeSriDiscoveryQuestion } from "../discovery-runtime";
import type { SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";

export const SRI_CP005_CANDIDATES: readonly SriCandidateDescriptor[] = [
  { candidateId: "C005-A", checkpointId: "SRI-CP-005", title: "same-base direct exponent equation", sourceDisposition: "KEEP" },
  { candidateId: "C005-B", checkpointId: "SRI-CP-005", title: "same-base linear exponent equation", sourceDisposition: "KEEP" },
  { candidateId: "C005-C", checkpointId: "SRI-CP-005", title: "common-base transformed equation", sourceDisposition: "KEEP" },
  { candidateId: "C005-D", checkpointId: "SRI-CP-005", title: "factor a common exponential term in a sum equation", sourceDisposition: "NEW" },
  { candidateId: "C005-E", checkpointId: "SRI-CP-005", title: "factor a common exponential term in a difference equation", sourceDisposition: "NEW" },
  { candidateId: "C005-F", checkpointId: "SRI-CP-005", title: "quadratic in a^x substitution", sourceDisposition: "NEW" },
  { candidateId: "C005-G", checkpointId: "SRI-CP-005", title: "chained equal-power relation", sourceDisposition: "NEW" },
  { candidateId: "C005-H", checkpointId: "SRI-CP-005", title: "solve exponent then evaluate a derived power target", sourceDisposition: "EXPAND" },
  { candidateId: "C005-I", checkpointId: "SRI-CP-005", title: "reciprocal-base exponent equation", sourceDisposition: "NEW" },
] as const;

function powBigInt(base: number, exponent: number): bigint {
  if (exponent < 0) throw new Error("powBigInt requires non-negative exponent");
  let value = 1n;
  for (let i = 0; i < exponent; i += 1) value *= BigInt(base);
  return value;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function finish(
  candidateId: string,
  seed: string,
  state: Readonly<Record<string, string | number | boolean>>,
  stem: string,
  solverValue: number,
  verifierValue: number,
  method: string,
  working: readonly string[],
  asked = "Find the unknown exponent exactly.",
): SriDiscoveryQuestion {
  const solver = rational(solverValue);
  const verifier = rational(verifierValue);
  const answer = rationalAnswer(solver);
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-001",
    checkpointId: "SRI-CP-005",
    candidateId,
    seed,
    state,
    stem,
    answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: `R:${rationalKey(verifier)}`,
    distractors: rationalDistractors(solver),
    explanation: {
      given: stem.replace(/\?$/, ""),
      asked,
      method,
      working,
      answer: answer.text,
    },
    proofEvents: [proofEvent("SOLVE", method, { stem }, { answer: answer.text })],
  });
}

function bruteExponent(base: number, target: bigint, evaluator: (x: number) => bigint, min = -8, max = 12): number {
  const matches: number[] = [];
  for (let x = min; x <= max; x += 1) {
    try {
      if (evaluator(x) === target) matches.push(x);
    } catch {
      // outside evaluator domain
    }
  }
  if (matches.length !== 1) throw new Error(`Expected one integer exponent solution for base ${base}; found ${matches.join(",")}`);
  return matches[0]!;
}

export function generateSriCp005Candidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  const base = sriPick(`${seed}:base`, [2, 3, 5]);
  const x = sriInt(`${seed}:x`, 1, 5);

  switch (candidateId) {
    case "C005-A": {
      const targetExponent = x;
      const verifier = bruteExponent(base, powBigInt(base, targetExponent), (probe) => probe < 0 ? 0n : powBigInt(base, probe), 0, 10);
      const stem = sriPick(`${seed}:surface`, [
        `If ${base}^x = ${base}^${targetExponent}, find x.`,
        `Solve ${base}^x = ${base}^${targetExponent}.`,
        `For ${base}^x = ${base}^${targetExponent}, determine the exponent x.`,
      ]);
      return finish(candidateId, seed, { base, targetExponent }, stem, x, verifier,
        "Equal positive bases greater than 1 have equal exponents.",
        [`x = ${targetExponent}`]);
    }
    case "C005-B": {
      const coefficient = sriInt(`${seed}:coefficient`, 2, 4);
      const shift = sriInt(`${seed}:shift`, -3, 3);
      const targetExponent = coefficient * x + shift;
      const verifier = (targetExponent - shift) / coefficient;
      const stem = sriPick(`${seed}:surface`, [
        `If ${base}^(${coefficient}x${shift >= 0 ? `+${shift}` : shift}) = ${base}^${targetExponent}, find x.`,
        `Solve ${base}^(${coefficient}x${shift >= 0 ? `+${shift}` : shift}) = ${base}^${targetExponent}.`,
        `Determine x when ${base}^(${coefficient}x${shift >= 0 ? `+${shift}` : shift}) and ${base}^${targetExponent} are equal.`,
      ]);
      return finish(candidateId, seed, { base, coefficient, shift, targetExponent }, stem, x, verifier,
        "Equate the exponents, then solve the resulting linear equation.",
        [`${coefficient}x${shift >= 0 ? `+${shift}` : shift} = ${targetExponent}`, `${coefficient}x = ${targetExponent - shift}`, `x = ${x}`]);
    }
    case "C005-C": {
      const commonBase = sriPick(`${seed}:common-base`, [2, 3]);
      const k1 = sriPick(`${seed}:k1`, [2, 3]);
      const k2 = sriPick(`${seed}:k2`, [2, 3, 4].filter((v) => v !== k1));
      const visible1 = Number(powBigInt(commonBase, k1));
      const visible2 = Number(powBigInt(commonBase, k2));
      const factor = sriInt(`${seed}:factor`, 1, 3);
      const solution = k2 * factor;
      const rightExponent = k1 * factor;
      const verifier = (k2 * rightExponent) / k1;
      const stem = sriPick(`${seed}:surface`, [
        `Solve ${visible1}^x = ${visible2}^${rightExponent}.`,
        `If ${visible1}^x = ${visible2}^${rightExponent}, find x.`,
        `Determine x from ${visible1}^x = ${visible2}^${rightExponent} by using a common base.`,
      ]);
      return finish(candidateId, seed, { commonBase, visible1, visible2, rightExponent }, stem, solution, verifier,
        "Rewrite both visible bases as powers of one common base, then equate exponents.",
        [`${visible1} = ${commonBase}^${k1}; ${visible2} = ${commonBase}^${k2}`, `${k1}x = ${k2}×${rightExponent}`, `x = ${solution}`]);
    }
    case "C005-D": {
      const offset = sriInt(`${seed}:offset`, 1, 3);
      const target = powBigInt(base, x) + powBigInt(base, x + offset);
      const verifier = bruteExponent(base, target, (probe) => probe < 0 ? -1n : powBigInt(base, probe) + powBigInt(base, probe + offset), 0, 8);
      const stem = sriPick(`${seed}:surface`, [
        `Solve ${base}^x + ${base}^(x+${offset}) = ${target}.`,
        `If ${base}^x + ${base}^(x+${offset}) = ${target}, find x.`,
        `Determine x when ${base}^x + ${base}^(x+${offset}) equals ${target}.`,
      ]);
      return finish(candidateId, seed, { base, offset, target: target.toString() }, stem, x, verifier,
        "Factor the common term a^x before solving for the power.",
        [`${base}^x(1+${base}^${offset}) = ${target}`, `${base}^x = ${powBigInt(base, x)}`, `x=${x}`]);
    }
    case "C005-E": {
      const offset = sriInt(`${seed}:offset`, 1, 3);
      const target = powBigInt(base, x + offset) - powBigInt(base, x);
      const verifier = bruteExponent(base, target, (probe) => probe < 0 ? -1n : powBigInt(base, probe + offset) - powBigInt(base, probe), 0, 8);
      const stem = sriPick(`${seed}:surface`, [
        `Solve ${base}^(x+${offset}) - ${base}^x = ${target}.`,
        `If ${base}^(x+${offset}) - ${base}^x = ${target}, find x.`,
        `Determine x from ${base}^(x+${offset}) - ${base}^x = ${target}.`,
      ]);
      return finish(candidateId, seed, { base, offset, target: target.toString() }, stem, x, verifier,
        "Factor a^x from the difference and solve the remaining exact power equation.",
        [`${base}^x(${base}^${offset}-1) = ${target}`, `${base}^x = ${powBigInt(base, x)}`, `x=${x}`]);
    }
    case "C005-F": {
      const powerRoot = powBigInt(base, x);
      const otherRoot = powerRoot + BigInt(sriPick(`${seed}:other-root-gap`, [1, 2, 4]));
      const sum = powerRoot + otherRoot;
      const product = powerRoot * otherRoot;
      const verifier = (() => {
        for (let probe = 0; probe <= 8; probe += 1) {
          const y = powBigInt(base, probe);
          if (y * y - sum * y + product === 0n) return probe;
        }
        throw new Error("No power root found in independent quadratic verification");
      })();
      const stem = sriPick(`${seed}:surface`, [
        `If (${base}^x)^2 - ${sum}(${base}^x) + ${product} = 0, find the integer x.`,
        `Solve ${base}^(2x) - ${sum}·${base}^x + ${product} = 0 for integer x.`,
        `Using y=${base}^x, determine the integer x satisfying y^2 - ${sum}y + ${product}=0.`,
      ]);
      return finish(candidateId, seed, { base, sum: sum.toString(), product: product.toString() }, stem, x, verifier,
        "Substitute y=a^x, factor the quadratic, then retain the root that is an exact power of the base.",
        [`y^2-${sum}y+${product}=0`, `One admissible power root is y=${powerRoot}=${base}^${x}`, `Therefore x=${x}`]);
    }
    case "C005-G": {
      const commonBase = sriPick(`${seed}:common-base`, [2, 3]);
      const p = sriPick(`${seed}:p`, [1, 2, 3]);
      const q = sriPick(`${seed}:q`, [1, 2, 3].filter((v) => v !== p));
      const a = Number(powBigInt(commonBase, p));
      const b = Number(powBigInt(commonBase, q));
      const unit = lcm(lcm(p, q), p + q);
      const scale = sriInt(`${seed}:scale`, 1, 3);
      const L = unit * scale;
      const xv = L / p;
      const yv = L / q;
      const zv = -L / (p + q);
      const solver = xv + yv + zv;
      const verifier = L / p + L / q - L / (p + q);
      const stem = sriPick(`${seed}:surface`, [
        `If ${a}^x = ${b}^y = (${a * b})^(-z), find x+y+z for the least positive common exponent scale ${L}.`,
        `Given ${a}^x = ${b}^y = (${a * b})^(-z) and the common exponent on base ${commonBase} is ${L}, find x+y+z.`,
        `For ${a}^x = ${b}^y = (${a * b})^(-z), the common ${commonBase}-exponent is ${L}. Determine x+y+z.`,
      ]);
      return finish(candidateId, seed, { commonBase, a, b, commonExponent: L }, stem, solver, verifier,
        "Rewrite all three bases as powers of one common base and equate each exponent contribution to the supplied common exponent.",
        [`${p}x=${L} ⇒ x=${xv}`, `${q}y=${L} ⇒ y=${yv}`, `-${p + q}z=${L} ⇒ z=${zv}`, `x+y+z=${solver}`],
        "Find the requested combination of the linked exponents.");
    }
    case "C005-H": {
      const coefficient = sriInt(`${seed}:coefficient`, 2, 3);
      const shift = sriInt(`${seed}:shift`, 1, 4);
      const targetExponent = coefficient * x + shift;
      const derivedShift = sriInt(`${seed}:derived-shift`, 1, 3);
      const solverValue = Number(powBigInt(base, x + derivedShift));
      const solvedX = (targetExponent - shift) / coefficient;
      const verifierValue = Number(powBigInt(base, solvedX + derivedShift));
      const stem = sriPick(`${seed}:surface`, [
        `If ${base}^(${coefficient}x+${shift}) = ${base}^${targetExponent}, find ${base}^(x+${derivedShift}).`,
        `Solve ${base}^(${coefficient}x+${shift})=${base}^${targetExponent} and then evaluate ${base}^(x+${derivedShift}).`,
        `Given ${base}^(${coefficient}x+${shift})=${base}^${targetExponent}, determine the value of ${base}^(x+${derivedShift}).`,
      ]);
      return finish(candidateId, seed, { base, coefficient, shift, targetExponent, derivedShift }, stem, solverValue, verifierValue,
        "First equate exponents to recover x; then substitute x into the requested derived power.",
        [`${coefficient}x+${shift}=${targetExponent} ⇒ x=${x}`, `${base}^(x+${derivedShift})=${base}^${x + derivedShift}=${solverValue}`],
        "Solve x and evaluate the requested derived power.");
    }
    case "C005-I": {
      const t = sriInt(`${seed}:t`, 1, 5);
      const shift = sriInt(`${seed}:shift`, -2, 2);
      const solution = -t - shift;
      const verifier = -t - shift;
      const exponentText = shift >= 0 ? `x+${shift}` : `x${shift}`;
      const stem = sriPick(`${seed}:surface`, [
        `Solve ${base}^(${exponentText}) = (1/${base})^${t}.`,
        `If ${base}^(${exponentText}) = (1/${base})^${t}, find x.`,
        `Determine x from ${base}^(${exponentText}) = (1/${base})^${t}.`,
      ]);
      return finish(candidateId, seed, { base, shift, reciprocalExponent: t }, stem, solution, verifier,
        "Rewrite the reciprocal base as the original base with a negative exponent, then equate exponents.",
        [`(1/${base})^${t} = ${base}^(-${t})`, `${exponentText}=-${t}`, `x=${solution}`]);
    }
    default:
      throw new Error(`Unknown SRI-CP-005 candidate: ${candidateId}`);
  }
}
