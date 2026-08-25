import {
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
  validateRationalPowerDomain,
  type Rational,
} from "../../../../../shared/surds-indices";
import { rationalAnswer, rationalDistractors, textAnswer, textDistractors } from "../discovery-answer-utils";
import { finalizeSriDiscoveryQuestion } from "../discovery-runtime";
import type { SriCandidateDescriptor, SriDiscoveryQuestion, SriHumanExplanation } from "../discovery-types";

export const SRI_CP002_CANDIDATES: readonly SriCandidateDescriptor[] = [
  { candidateId: "C002-A", checkpointId: "SRI-CP-002", title: "normalize a negative integer exponent", sourceDisposition: "KEEP" },
  { candidateId: "C002-B", checkpointId: "SRI-CP-002", title: "combine positive and negative exponents", sourceDisposition: "KEEP" },
  { candidateId: "C002-C", checkpointId: "SRI-CP-002", title: "convert/evaluate a^(1/n)", sourceDisposition: "KEEP" },
  { candidateId: "C002-D", checkpointId: "SRI-CP-002", title: "evaluate a^(m/n) on an exact perfect-power base", sourceDisposition: "KEEP" },
  { candidateId: "C002-E", checkpointId: "SRI-CP-002", title: "negative fractional exponent", sourceDisposition: "NEW" },
  { candidateId: "C002-F", checkpointId: "SRI-CP-002", title: "fractional exponent on an exact rational base", sourceDisposition: "NEW" },
  { candidateId: "C002-G", checkpointId: "SRI-CP-002", title: "negative fractional exponent on a fraction", sourceDisposition: "NEW" },
  { candidateId: "C002-H", checkpointId: "SRI-CP-002", title: "decimal exponent reduced exactly to a rational exponent", sourceDisposition: "NEW" },
  { candidateId: "C002-I", checkpointId: "SRI-CP-002", title: "identify undefined zero-power edge cases", sourceDisposition: "NEW" },
  { candidateId: "C002-J", checkpointId: "SRI-CP-002", title: "negative base with odd-denominator rational exponent", sourceDisposition: "NEW" },
  { candidateId: "C002-K", checkpointId: "SRI-CP-002", title: "identify non-real negative-base even-denominator form", sourceDisposition: "NEW" },
] as const;

function powBigInt(base: number, exponent: number): bigint {
  let result = 1n;
  for (let i = 0; i < exponent; i += 1) result *= BigInt(base);
  return result;
}

function explanation(stem: string, method: string, working: readonly string[], answer: string): SriHumanExplanation {
  return {
    given: stem.replace(/\?$/, ""),
    asked: "Evaluate the index expression exactly over the real numbers.",
    method,
    working,
    answer,
  };
}

function finishRational(
  candidateId: string,
  seed: string,
  state: Readonly<Record<string, string | number | boolean>>,
  stem: string,
  value: Rational,
  independent: Rational,
  method: string,
  working: readonly string[],
): SriDiscoveryQuestion {
  const answer = rationalAnswer(value);
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-001",
    checkpointId: "SRI-CP-002",
    candidateId,
    seed,
    state,
    stem,
    answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: `R:${rationalKey(independent)}`,
    distractors: rationalDistractors(value),
    explanation: explanation(stem, method, working, answer.text),
    proofEvents: [
      proofEvent("DOMAIN_CHECK", "real-domain admissibility for rational powers", { stem }, { valid: "true" }),
      proofEvent("SOLVE", method, { stem }, { answer: answer.text }),
    ],
  });
}

export function generateSriCp002Candidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  const base = sriPick(`${seed}:base`, [2, 3, 4, 5, 7]);
  const n = sriInt(`${seed}:n`, 2, 4);

  switch (candidateId) {
    case "C002-A": {
      const exponent = -n;
      const solver = evaluateExactRationalPower(rational(base), rationalExponent(exponent));
      const independent = rational(1n, powBigInt(base, n));
      const stem = `Evaluate ${base}^(${exponent}).`;
      return finishRational(candidateId, seed, { base, exponent }, stem, solver, independent,
        "A negative integer exponent means take the reciprocal of the corresponding positive power.",
        [`${base}^(-${n}) = 1/${base}^${n}`, `= ${formatRational(independent)}`]);
    }
    case "C002-B": {
      const positive = sriInt(`${seed}:positive`, 2, 6);
      const negativeMagnitude = sriInt(`${seed}:negative`, 1, 5);
      const combined = positive - negativeMagnitude;
      const solver = evaluateExactRationalPower(rational(base), rationalExponent(combined));
      const left = powRationalInteger(rational(base), positive);
      const right = powRationalInteger(rational(base), -negativeMagnitude);
      const independent = multiplyRational(left, right);
      const stem = `Simplify ${base}^${positive} × ${base}^(-${negativeMagnitude}).`;
      return finishRational(candidateId, seed, { base, positive, negativeExponent: -negativeMagnitude }, stem, solver, independent,
        "For the same base, add the signed exponents.",
        [`Exponent = ${positive} + (-${negativeMagnitude}) = ${combined}`, `Value = ${formatRational(solver)}`]);
    }
    case "C002-C": {
      const rootIndex = sriPick(`${seed}:root-index`, [2, 3, 4]);
      const root = sriInt(`${seed}:root`, 2, 5);
      const perfectPower = Number(powBigInt(root, rootIndex));
      const solver = evaluateExactRationalPower(rational(perfectPower), rationalExponent(1, rootIndex));
      const independent = rational(root);
      const stem = `Evaluate ${perfectPower}^(1/${rootIndex}).`;
      return finishRational(candidateId, seed, { base: perfectPower, rootIndex }, stem, solver, independent,
        "The denominator of the fractional exponent gives the root index.",
        [`${perfectPower}^(1/${rootIndex}) = ${rootIndex === 2 ? "√" : `${rootIndex}th root of `}${perfectPower}`, `= ${root}`]);
    }
    case "C002-D": {
      const denominator = sriPick(`${seed}:denominator`, [2, 3]);
      const numerator = sriPick(`${seed}:numerator`, denominator === 2 ? [3, 5] : [2, 4]);
      const root = sriInt(`${seed}:root`, 2, 4);
      const perfectPower = Number(powBigInt(root, denominator));
      const solver = evaluateExactRationalPower(rational(perfectPower), rationalExponent(numerator, denominator));
      const independent = rational(powBigInt(root, numerator));
      const stem = `Evaluate ${perfectPower}^(${numerator}/${denominator}).`;
      return finishRational(candidateId, seed, { base: perfectPower, numerator, denominator }, stem, solver, independent,
        "Take the exact denominator-th root first, then raise it to the numerator power.",
        [`${perfectPower}^(1/${denominator}) = ${root}`, `${root}^${numerator} = ${formatRational(independent)}`]);
    }
    case "C002-E": {
      const denominator = sriPick(`${seed}:denominator`, [2, 3]);
      const numerator = denominator === 2 ? sriPick(`${seed}:num`, [1, 3]) : sriPick(`${seed}:num`, [1, 2]);
      const root = sriInt(`${seed}:root`, 2, 4);
      const perfectPower = Number(powBigInt(root, denominator));
      const solver = evaluateExactRationalPower(rational(perfectPower), rationalExponent(-numerator, denominator));
      const independent = rational(1n, powBigInt(root, numerator));
      const stem = `Evaluate ${perfectPower}^(-${numerator}/${denominator}).`;
      return finishRational(candidateId, seed, { base: perfectPower, numerator: -numerator, denominator }, stem, solver, independent,
        "The negative sign takes a reciprocal; the fractional part is evaluated by roots and powers.",
        [`${perfectPower}^(${numerator}/${denominator}) = ${powBigInt(root, numerator)}`, `Therefore ${perfectPower}^(-${numerator}/${denominator}) = ${formatRational(independent)}`]);
    }
    case "C002-F": {
      const denominator = sriPick(`${seed}:denominator`, [2, 3]);
      const numerator = sriPick(`${seed}:numerator`, [1, 2]);
      const p = sriInt(`${seed}:p`, 2, 5);
      const q = sriPick(`${seed}:q`, [2, 3, 4].filter((value) => value !== p));
      const baseValue = rational(powBigInt(p, denominator), powBigInt(q, denominator));
      const solver = evaluateExactRationalPower(baseValue, rationalExponent(numerator, denominator));
      const independent = rational(powBigInt(p, numerator), powBigInt(q, numerator));
      const stem = `Evaluate (${formatRational(baseValue)})^(${numerator}/${denominator}).`;
      return finishRational(candidateId, seed, { base: formatRational(baseValue), numerator, denominator }, stem, solver, independent,
        "Apply the exact root to numerator and denominator, then apply the numerator power.",
        [`(${formatRational(baseValue)})^(1/${denominator}) = ${p}/${q}`, `So the value is ${formatRational(independent)}.`]);
    }
    case "C002-G": {
      const denominator = sriPick(`${seed}:denominator`, [2, 3]);
      const numerator = sriPick(`${seed}:numerator`, [1, 2]);
      const p = sriInt(`${seed}:p`, 2, 5);
      const q = sriPick(`${seed}:q`, [2, 3, 4].filter((value) => value !== p));
      const baseValue = rational(powBigInt(p, denominator), powBigInt(q, denominator));
      const solver = evaluateExactRationalPower(baseValue, rationalExponent(-numerator, denominator));
      const independent = rational(powBigInt(q, numerator), powBigInt(p, numerator));
      const stem = `Evaluate (${formatRational(baseValue)})^(-${numerator}/${denominator}).`;
      return finishRational(candidateId, seed, { base: formatRational(baseValue), numerator: -numerator, denominator }, stem, solver, independent,
        "Evaluate the fractional power exactly and then invert because the exponent is negative.",
        [`Positive fractional power = ${p}^${numerator}/${q}^${numerator}`, `Reciprocal = ${formatRational(independent)}`]);
    }
    case "C002-H": {
      const root = sriInt(`${seed}:root`, 2, 5);
      const baseValue = rational(1n, powBigInt(root, 2));
      const solver = evaluateExactRationalPower(baseValue, rationalExponent(-3, 2));
      const independent = rational(powBigInt(root, 3));
      const stem = `Evaluate (${formatRational(baseValue)})^(-1.5).`;
      return finishRational(candidateId, seed, { base: formatRational(baseValue), decimalExponent: -1.5, exactExponent: "-3/2" }, stem, solver, independent,
        "First convert the terminating decimal exponent exactly: -1.5 = -3/2.",
        [`(${formatRational(baseValue)})^(-1.5) = (${formatRational(baseValue)})^(-3/2)`, `= ${formatRational(independent)}`]);
    }
    case "C002-I": {
      const exponent = sriPick(`${seed}:zero-case`, [0, -1, -2]);
      const exponentText = exponent === 0 ? "0" : `(${exponent})`;
      const stem = `Which statement correctly describes 0^${exponentText} over the real numbers?`;
      const domain = validateRationalPowerDomain(rational(0), rationalExponent(exponent));
      const answer = textAnswer("Undefined", "T:UNDEFINED");
      const independentKey = exponent <= 0 ? "T:UNDEFINED" : "T:DEFINED";
      return finalizeSriDiscoveryQuestion({
        packageId: "SRI-001", checkpointId: "SRI-CP-002", candidateId, seed,
        state: { base: 0, exponent }, stem, answer,
        canonicalSolverKey: domain.valid ? "T:DEFINED" : "T:UNDEFINED",
        independentVerifierKey: independentKey,
        distractors: textDistractors([
          { text: "0", key: "T:ZERO", misconceptionId: "ZERO_BASE_ALWAYS_ZERO" },
          { text: "1", key: "T:ONE", misconceptionId: "ZERO_EXPONENT_ALWAYS_ONE" },
          { text: "A negative number", key: "T:NEGATIVE", misconceptionId: "NEGATIVE_EXPONENT_GIVES_NEGATIVE" },
        ]),
        explanation: explanation(stem, "Check zero-base edge conditions before applying ordinary index laws.", [domain.reason], answer.text),
        proofEvents: [proofEvent("DOMAIN_CHECK", "zero-base edge case", { exponent: String(exponent) }, { valid: String(domain.valid), reason: domain.reason })],
      });
    }
    case "C002-J": {
      const root = sriInt(`${seed}:root`, 2, 4);
      const numerator = sriPick(`${seed}:numerator`, [1, 2]);
      const baseValue = -Number(powBigInt(root, 3));
      const solver = evaluateExactRationalPower(rational(baseValue), rationalExponent(numerator, 3));
      const rooted = -root;
      const independent = rational(powSigned(rooted, numerator));
      const stem = `Evaluate (${baseValue})^(${numerator}/3).`;
      return finishRational(candidateId, seed, { base: baseValue, numerator, denominator: 3 }, stem, solver, independent,
        "An odd root of a negative number is real; take the cube root first and then apply the numerator power.",
        [`Cube root of ${baseValue} is ${rooted}`, `${rooted}^${numerator} = ${formatRational(independent)}`]);
    }
    case "C002-K": {
      const root = sriInt(`${seed}:root`, 2, 5);
      const baseValue = -Number(powBigInt(root, 2));
      const denominator = sriPick(`${seed}:denominator`, [2, 4]);
      const domain = validateRationalPowerDomain(rational(baseValue), rationalExponent(1, denominator));
      const stem = `Over the real numbers, how should (${baseValue})^(1/${denominator}) be classified?`;
      const answer = textAnswer("Not real", "T:NOT_REAL");
      return finalizeSriDiscoveryQuestion({
        packageId: "SRI-001", checkpointId: "SRI-CP-002", candidateId, seed,
        state: { base: baseValue, numerator: 1, denominator }, stem, answer,
        canonicalSolverKey: domain.valid ? "T:REAL" : "T:NOT_REAL",
        independentVerifierKey: baseValue < 0 && denominator % 2 === 0 ? "T:NOT_REAL" : "T:REAL",
        distractors: textDistractors([
          { text: `${root}`, key: "T:POSITIVE_ROOT", misconceptionId: "IGNORE_NEGATIVE_RADICAND" },
          { text: `${-root}`, key: "T:NEGATIVE_ROOT", misconceptionId: "TAKE_NEGATIVE_EVEN_ROOT" },
          { text: "0", key: "T:ZERO", misconceptionId: "INVALID_ROOT_TO_ZERO" },
        ]),
        explanation: explanation(stem, "An even-denominator rational exponent requires an even root, which is not real for a negative base.", [domain.reason], answer.text),
        proofEvents: [proofEvent("DOMAIN_CHECK", "negative base with even root denominator", { base: String(baseValue), denominator: String(denominator) }, { valid: String(domain.valid), reason: domain.reason })],
      });
    }
    default:
      throw new Error(`Unknown SRI-CP-002 candidate: ${candidateId}`);
  }
}

function powSigned(base: number, exponent: number): bigint {
  let result = 1n;
  for (let i = 0; i < exponent; i += 1) result *= BigInt(base);
  return result;
}
