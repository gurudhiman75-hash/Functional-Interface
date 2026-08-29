import {
  addRational,
  addSurdSums,
  divideRational,
  formatRationalLatex,
  multiplyRational,
  multiplySurdSums,
  proofEvent,
  quadraticSurd,
  rational,
  rationalizeMonomialDenominator,
  rationalizeQuadraticDenominator,
  rationalKey,
  squareSurd,
  sriInt,
  sriPick,
  surdSum,
  surdSumKey,
  type Rational,
  type SurdSum,
} from "../../../../../shared/surds-indices";
import { rationalAnswer, rationalDistractors, textDistractors } from "../discovery-answer-utils";
import { finalizeSriDiscoveryQuestion, type SriDistractor } from "../discovery-runtime";
import type { SriCandidateAnswer, SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";
import {
  nthRadical,
  nthRadicalAnswer,
  nthRadicalKey,
  pairAnswer,
  squareSurdAnswer,
  squareSurdDistractors,
  surdSumAnswer,
  surdSumDistractors,
} from "./surd-discovery-utils";

export const SRI_CP009_CANDIDATES: readonly SriCandidateDescriptor[] = [
  { candidateId: "C009-A", checkpointId: "SRI-CP-009", title: "rationalise monomial square-root denominator", sourceDisposition: "KEEP" },
  { candidateId: "C009-B", checkpointId: "SRI-CP-009", title: "rationalise supported cube-root monomial denominator", sourceDisposition: "KEEP" },
  { candidateId: "C009-C", checkpointId: "SRI-CP-009", title: "rationalise k over a plus or minus square root", sourceDisposition: "KEEP" },
  { candidateId: "C009-D", checkpointId: "SRI-CP-009", title: "rationalise k over difference or sum of two square roots", sourceDisposition: "KEEP" },
  { candidateId: "C009-E", checkpointId: "SRI-CP-009", title: "rationalise coefficient-bearing two-surd denominator", sourceDisposition: "EXPAND" },
  { candidateId: "C009-F", checkpointId: "SRI-CP-009", title: "combine multiple rationalised terms into canonical surd form", sourceDisposition: "NEW" },
  { candidateId: "C009-G", checkpointId: "SRI-CP-009", title: "recover coefficients from canonical rationalised result", sourceDisposition: "NEW" },
  { candidateId: "C009-H", checkpointId: "SRI-CP-009", title: "evaluate a further target from recovered coefficients", sourceDisposition: "NEW" },
  { candidateId: "C009-I", checkpointId: "SRI-CP-009", title: "exploit reciprocal conjugate pair exactly", sourceDisposition: "NEW" },
] as const;

function finish(
  candidateId: string,
  seed: string,
  state: Readonly<Record<string, string | number | boolean>>,
  stem: string,
  answer: SriCandidateAnswer,
  verifierKey: string,
  distractors: readonly SriDistractor[],
  method: string,
  working: readonly string[],
  asked = "Rationalise the denominator and simplify exactly.",
): SriDiscoveryQuestion {
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-002",
    checkpointId: "SRI-CP-009",
    candidateId,
    seed,
    state,
    stem,
    answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: verifierKey,
    distractors,
    explanation: { given: stem.replace(/\?$/, ""), asked, method, working, answer: answer.text },
    proofEvents: [proofEvent("TRANSFORM", method, { stem }, { answer: answer.text })],
  });
}

function rationalPart(value: SurdSum): Rational {
  return value.terms.find((term) => term.radicand === 1n)?.coefficient ?? rational(0);
}

function coefficientOf(value: SurdSum, radicand: bigint): Rational {
  return value.terms.find((term) => term.radicand === radicand)?.coefficient ?? rational(0);
}

function assertProductEqualsNumerator(denominator: SurdSum, rationalised: SurdSum, numerator: Rational): void {
  const product = multiplySurdSums(denominator, rationalised);
  const expected = surdSum([{ coefficient: numerator, radicand: 1n }]);
  if (surdSumKey(product) !== surdSumKey(expected)) {
    throw new Error(`Independent rationalisation verification failed: ${surdSumKey(product)} != ${surdSumKey(expected)}`);
  }
}

function pairDistractors(first: Rational, second: Rational): SriDistractor[] {
  const variants = [
    pairAnswer(second, first),
    pairAnswer(rational(-first.numerator, first.denominator), second),
    pairAnswer(first, rational(-second.numerator, second.denominator)),
    pairAnswer(addRational(first, rational(1)), second),
  ];
  const correct = pairAnswer(first, second);
  const seen = new Set<string>([correct.canonicalKey]);
  const output: SriDistractor[] = [];
  const ids = ["SWAP_COEFFICIENTS", "RATIONAL_SIGN_ERROR", "SURD_SIGN_ERROR", "RATIONAL_OFF_BY_ONE"];
  variants.forEach((variant, index) => {
    if (!seen.has(variant.canonicalKey)) {
      seen.add(variant.canonicalKey);
      output.push({ ...variant, misconceptionId: ids[index]! });
    }
  });
  return output.slice(0, 3);
}

export function generateSriCp009Candidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  switch (candidateId) {
    case "C009-A": {
      const radicand = BigInt(sriPick(`${seed}:r`, [2, 3, 5, 6, 7, 10, 11, 13]));
      const numerator = sriInt(`${seed}:k`, 2, 18);
      const solver = rationalizeMonomialDenominator(rational(numerator), squareSurd(rational(1), radicand));
      const verifier = squareSurd(rational(numerator, radicand), radicand);
      const answer = squareSurdAnswer(solver);
      const stem = sriPick(`${seed}:surface`, [
        `Rationalise \\frac{${numerator}}{\\sqrt{${radicand}}}.`,
        `Remove the radical from the denominator of \\frac{${numerator}}{\\sqrt{${radicand}}}.`,
        `Write \\frac{${numerator}}{\\sqrt{${radicand}}} with a rational denominator.`,
        `Find the rationalised form of \\frac{${numerator}}{\\sqrt{${radicand}}}.`,
      ]);
      return finish(candidateId, seed, { numerator, radicand: radicand.toString() }, stem, answer,
        squareSurdAnswer(verifier).canonicalKey, squareSurdDistractors(solver),
        "Multiply numerator and denominator by the same square root; the denominator becomes the radicand.",
        [`\\frac{${numerator}}{\\sqrt{${radicand}}}×\\frac{\\sqrt{${radicand}}}{\\sqrt{${radicand}}}`, `Result = ${answer.text}`]);
    }
    case "C009-B": {
      const radicand = BigInt(sriPick(`${seed}:cube-r`, [2, 3, 5, 7, 11]));
      const numerator = sriInt(`${seed}:cube-k`, 2, 20);
      const solver = nthRadical(rational(numerator, radicand), 3, radicand * radicand);
      const verifierCoefficient = divideRational(rational(numerator), rational(radicand));
      const verifier = nthRadical(verifierCoefficient, 3, radicand * radicand);
      const answer = nthRadicalAnswer(solver);
      const alternatives = [
        nthRadicalAnswer(nthRadical(rational(numerator, radicand), 3, radicand)),
        nthRadicalAnswer(nthRadical(rational(numerator), 3, radicand * radicand)),
        nthRadicalAnswer(nthRadical(rational(numerator, radicand * radicand), 3, radicand * radicand)),
        nthRadicalAnswer(nthRadical(rational(-numerator, radicand), 3, radicand * radicand)),
      ];
      const distractors = alternatives.filter((item) => item.canonicalKey !== answer.canonicalKey).slice(0, 3).map((item, index) => ({
        ...item,
        misconceptionId: ["MULTIPLY_BY_WRONG_CUBE_ROOT", "FORGET_DENOMINATOR_CUBE", "OVER_DIVIDE_DENOMINATOR", "SIGN_ERROR"][index]!,
      }));
      const stem = sriPick(`${seed}:surface`, [
        `Rationalise \\frac{${numerator}}{\\sqrt[3]{${radicand}}}.`,
        `Write \\frac{${numerator}}{\\sqrt[3]{${radicand}}} with a rational denominator.`,
        `Remove the cube root from the denominator of \\frac{${numerator}}{\\sqrt[3]{${radicand}}}.`,
        `Find the exact rationalised form of \\frac{${numerator}}{\\sqrt[3]{${radicand}}}.`,
      ]);
      return finish(candidateId, seed, { numerator, radicand: radicand.toString(), index: 3 }, stem, answer,
        nthRadicalKey(verifier), distractors,
        "Multiply by the cube root needed to complete a perfect cube in the denominator.",
        [`\\sqrt[3]{${radicand}}×\\sqrt[3]{${radicand * radicand}}=${radicand}`, `Result = ${answer.text}`]);
    }
    case "C009-C": {
      const a = sriInt(`${seed}:a`, 2, 9);
      const radicand = BigInt(sriPick(`${seed}:r`, [2, 3, 5, 6, 7, 10, 11, 13].filter((value) => value !== a * a)));
      const sign = sriPick(`${seed}:sign`, [1, -1] as const);
      const numerator = sriInt(`${seed}:k`, 1, 12);
      const denominator = quadraticSurd(rational(a), rational(sign), radicand);
      const solver = rationalizeQuadraticDenominator(rational(numerator), denominator);
      const denominatorSum = surdSum([{ coefficient: rational(a), radicand: 1n }, { coefficient: rational(sign), radicand }]);
      assertProductEqualsNumerator(denominatorSum, solver, rational(numerator));
      const answer = surdSumAnswer(solver);
      const op = sign > 0 ? "+" : "-";
      const stem = sriPick(`${seed}:surface`, [
        `Rationalise \\frac{${numerator}}{${a}${op}\\sqrt{${radicand}}}.`,
        `Write \\frac{${numerator}}{${a}${op}\\sqrt{${radicand}}} with a rational denominator.`,
        `Use the conjugate to rationalise \\frac{${numerator}}{${a}${op}\\sqrt{${radicand}}}.`,
        `Find the simplest rationalised form of \\frac{${numerator}}{${a}${op}\\sqrt{${radicand}}}.`,
      ]);
      return finish(candidateId, seed, { numerator, a, sign, radicand: radicand.toString() }, stem, answer,
        answer.canonicalKey, surdSumDistractors(solver),
        "Multiply by the conjugate of the binomial denominator; its product with the denominator is a difference of squares.",
        [`Conjugate: ${a}${op === "+" ? "-" : "+"}\\sqrt{${radicand}}`, `Denominator norm = ${a * a}-${radicand}`, `Result = ${answer.text}`]);
    }
    case "C009-D": {
      const left = BigInt(sriPick(`${seed}:left`, [2, 3, 5, 6, 7, 10, 11, 13]));
      const right = BigInt(sriPick(`${seed}:right`, [2, 3, 5, 6, 7, 10, 11, 13].filter((value) => BigInt(value) !== left)));
      const sign = sriPick(`${seed}:sign`, [1, -1] as const);
      const numerator = sriInt(`${seed}:k`, 1, 12);
      const norm = left - right;
      const solver = surdSum([
        { coefficient: rational(BigInt(numerator), norm), radicand: left },
        { coefficient: rational(BigInt(-sign * numerator), norm), radicand: right },
      ]);
      const denominator = surdSum([{ coefficient: rational(1), radicand: left }, { coefficient: rational(sign), radicand: right }]);
      assertProductEqualsNumerator(denominator, solver, rational(numerator));
      const answer = surdSumAnswer(solver);
      const op = sign > 0 ? "+" : "-";
      const stem = sriPick(`${seed}:surface`, [
        `Rationalise \\frac{${numerator}}{\\sqrt{${left}}${op}\\sqrt{${right}}}.`,
        `Use a conjugate to remove the radicals from the denominator of \\frac{${numerator}}{\\sqrt{${left}}${op}\\sqrt{${right}}}.`,
        `Find the exact rationalised form of \\frac{${numerator}}{\\sqrt{${left}}${op}\\sqrt{${right}}}.`,
        `Write \\frac{${numerator}}{\\sqrt{${left}}${op}\\sqrt{${right}}} with a rational denominator.`,
      ]);
      return finish(candidateId, seed, { numerator, left: left.toString(), right: right.toString(), sign }, stem, answer,
        answer.canonicalKey, surdSumDistractors(solver),
        "Multiply by the conjugate; (√a+√b)(√a-√b)=a-b.",
        [`Denominator after conjugation = ${left}-${right} = ${norm}`, `Result = ${answer.text}`]);
    }
    case "C009-E": {
      const left = BigInt(sriPick(`${seed}:left`, [2, 3, 5, 7, 11]));
      const right = BigInt(sriPick(`${seed}:right`, [2, 3, 5, 7, 11].filter((value) => BigInt(value) !== left)));
      const p = sriInt(`${seed}:p`, 1, 4);
      const q = sriInt(`${seed}:q`, 1, 4);
      const sign = sriPick(`${seed}:sign`, [1, -1] as const);
      const numerator = sriInt(`${seed}:k`, 1, 12);
      const norm = BigInt(p * p) * left - BigInt(q * q) * right;
      if (norm === 0n) return generateSriCp009Candidate(candidateId, `${seed}:retry`);
      const solver = surdSum([
        { coefficient: rational(BigInt(numerator * p), norm), radicand: left },
        { coefficient: rational(BigInt(-sign * numerator * q), norm), radicand: right },
      ]);
      const denominator = surdSum([{ coefficient: rational(p), radicand: left }, { coefficient: rational(sign * q), radicand: right }]);
      assertProductEqualsNumerator(denominator, solver, rational(numerator));
      const answer = surdSumAnswer(solver);
      const op = sign > 0 ? "+" : "-";
      const stem = sriPick(`${seed}:surface`, [
        `Rationalise \\frac{${numerator}}{${p}\\sqrt{${left}}${op}${q}\\sqrt{${right}}}.`,
        `Remove the radicals from the denominator of \\frac{${numerator}}{${p}\\sqrt{${left}}${op}${q}\\sqrt{${right}}}.`,
        `Find the rationalised form of \\frac{${numerator}}{${p}\\sqrt{${left}}${op}${q}\\sqrt{${right}}}.`,
        `Use the coefficient-bearing conjugate to simplify \\frac{${numerator}}{${p}\\sqrt{${left}}${op}${q}\\sqrt{${right}}}.`,
      ]);
      return finish(candidateId, seed, { numerator, p, q, left: left.toString(), right: right.toString(), sign }, stem, answer,
        answer.canonicalKey, surdSumDistractors(solver),
        "Use the conjugate with the same coefficients; the denominator becomes p²a-q²b.",
        [`Norm = ${p}^2×${left} - ${q}^2×${right} = ${norm}`, `Result = ${answer.text}`]);
    }
    case "C009-F": {
      const a = sriInt(`${seed}:a`, 3, 9);
      const radicand = BigInt(sriPick(`${seed}:r`, [2, 3, 5, 6, 7, 10, 11, 13].filter((value) => value !== a * a)));
      const k1 = sriInt(`${seed}:k1`, 1, 8);
      const k2 = sriInt(`${seed}:k2`, 1, 8);
      const first = rationalizeQuadraticDenominator(rational(k1), quadraticSurd(rational(a), rational(1), radicand));
      const second = rationalizeQuadraticDenominator(rational(k2), quadraticSurd(rational(a), rational(-1), radicand));
      const solver = addSurdSums(first, second);
      const norm = rational(BigInt(a * a) - radicand);
      const verifier = surdSum([
        { coefficient: divideRational(rational(a * (k1 + k2)), norm), radicand: 1n },
        { coefficient: divideRational(rational(k2 - k1), norm), radicand },
      ]);
      const answer = surdSumAnswer(solver);
      const stem = sriPick(`${seed}:surface`, [
        `Simplify \\frac{${k1}}{${a}+\\sqrt{${radicand}}}+\\frac{${k2}}{${a}-\\sqrt{${radicand}}} into canonical surd form.`,
        `Rationalise and combine \\frac{${k1}}{${a}+\\sqrt{${radicand}}}+\\frac{${k2}}{${a}-\\sqrt{${radicand}}}.`,
        `Find the exact value of \\frac{${k1}}{${a}+\\sqrt{${radicand}}}+\\frac{${k2}}{${a}-\\sqrt{${radicand}}}.`,
        `Write the sum \\frac{${k1}}{${a}+\\sqrt{${radicand}}}+\\frac{${k2}}{${a}-\\sqrt{${radicand}}} as A+B\\sqrt{${radicand}}.`,
      ]);
      return finish(candidateId, seed, { a, radicand: radicand.toString(), k1, k2 }, stem, answer,
        `SS:${surdSumKey(verifier)}`, surdSumDistractors(solver),
        "Rationalise each conjugate denominator, then collect rational and surd parts.",
        [`Common norm = ${a * a}-${radicand}`, `Rational part = ${formatRationalLatex(rationalPart(verifier))}`, `Surd coefficient = ${formatRationalLatex(coefficientOf(verifier, radicand))}`, `Result = ${answer.text}`],
        "Rationalise, combine and simplify the expression.");
    }
    case "C009-G": {
      const a = sriInt(`${seed}:a`, 2, 9);
      const radicand = BigInt(sriPick(`${seed}:r`, [2, 3, 5, 6, 7, 10, 11, 13].filter((value) => value !== a * a)));
      const numerator = sriInt(`${seed}:k`, 1, 12);
      const solver = rationalizeQuadraticDenominator(rational(numerator), quadraticSurd(rational(a), rational(1), radicand));
      const A = rationalPart(solver);
      const B = coefficientOf(solver, radicand);
      const norm = rational(BigInt(a * a) - radicand);
      const verifierA = divideRational(rational(a * numerator), norm);
      const verifierB = divideRational(rational(-numerator), norm);
      const answer = pairAnswer(A, B);
      const stem = sriPick(`${seed}:surface`, [
        `If rationalising \\frac{${numerator}}{${a}+\\sqrt{${radicand}}} gives A+B\\sqrt{${radicand}}, find (A,B).`,
        `Write \\frac{${numerator}}{${a}+\\sqrt{${radicand}}}=A+B\\sqrt{${radicand}} after rationalisation. Determine (A,B).`,
        `After rationalising \\frac{${numerator}}{${a}+\\sqrt{${radicand}}}, identify the rational coefficient A and surd coefficient B.`,
        `Find the ordered pair (A,B) when \\frac{${numerator}}{${a}+\\sqrt{${radicand}}}=A+B\\sqrt{${radicand}}.`,
      ]);
      return finish(candidateId, seed, { numerator, a, radicand: radicand.toString() }, stem, answer,
        pairAnswer(verifierA, verifierB).canonicalKey, pairDistractors(A, B),
        "Rationalise with the conjugate, then read the rational and surd coefficients from canonical form.",
        [`Norm = ${a * a}-${radicand}`, `A=${formatRationalLatex(A)}, B=${formatRationalLatex(B)}`],
        "Recover the two canonical coefficients.");
    }
    case "C009-H": {
      const a = sriInt(`${seed}:a`, 2, 9);
      const radicand = BigInt(sriPick(`${seed}:r`, [2, 3, 5, 6, 7, 10, 11, 13].filter((value) => value !== a * a)));
      const numerator = sriInt(`${seed}:k`, 1, 12);
      const solverForm = rationalizeQuadraticDenominator(rational(numerator), quadraticSurd(rational(a), rational(1), radicand));
      const A = rationalPart(solverForm);
      const B = coefficientOf(solverForm, radicand);
      const targetMode = sriPick(`${seed}:target`, ["SUM", "DIFFERENCE"] as const);
      const solver = targetMode === "SUM" ? addRational(A, B) : addRational(A, rational(-B.numerator, B.denominator));
      const norm = rational(BigInt(a * a) - radicand);
      const verifierA = divideRational(rational(a * numerator), norm);
      const verifierB = divideRational(rational(-numerator), norm);
      const verifier = targetMode === "SUM" ? addRational(verifierA, verifierB) : addRational(verifierA, rational(-verifierB.numerator, verifierB.denominator));
      const answer = rationalAnswer(solver);
      const targetText = targetMode === "SUM" ? "A+B" : "A-B";
      const stem = sriPick(`${seed}:surface`, [
        `Rationalise \\frac{${numerator}}{${a}+\\sqrt{${radicand}}}=A+B\\sqrt{${radicand}} and find ${targetText}.`,
        `If \\frac{${numerator}}{${a}+\\sqrt{${radicand}}}=A+B\\sqrt{${radicand}} after rationalisation, evaluate ${targetText}.`,
        `Determine ${targetText} from the canonical rationalised form of \\frac{${numerator}}{${a}+\\sqrt{${radicand}}}.`,
        `After recovering A and B from \\frac{${numerator}}{${a}+\\sqrt{${radicand}}}, calculate ${targetText}.`,
      ]);
      return finish(candidateId, seed, { numerator, a, radicand: radicand.toString(), target: targetText }, stem, answer,
        rationalAnswer(verifier).canonicalKey, rationalDistractors(solver),
        "Rationalise first, recover A and B exactly, then evaluate the requested coefficient expression.",
        [`A=${formatRationalLatex(A)}, B=${formatRationalLatex(B)}`, `${targetText}=${formatRationalLatex(solver)}`],
        `Recover A and B, then evaluate ${targetText}.`);
    }
    case "C009-I": {
      const a = sriInt(`${seed}:a`, 2, 8);
      const radicand = BigInt(a * a - 1);
      const solver = rational(2 * a);
      const verifierNorm = BigInt(a * a) - radicand;
      if (verifierNorm !== 1n) throw new Error("Reciprocal-conjugate construction must have unit norm");
      const verifier = rational(2 * a);
      const answer = rationalAnswer(solver);
      const stem = sriPick(`${seed}:surface`, [
        `Let x=${a}+\\sqrt{${radicand}}. Find x+\\frac{1}{x} exactly.`,
        `If x=${a}+\\sqrt{${radicand}}, evaluate x+1/x without decimal approximation.`,
        `Using the conjugate of ${a}+\\sqrt{${radicand}}, find x+1/x where x=${a}+\\sqrt{${radicand}}.`,
        `For x=${a}+\\sqrt{${radicand}}, determine the exact value of x+x^{-1}.`,
      ]);
      return finish(candidateId, seed, { a, radicand: radicand.toString(), norm: 1 }, stem, answer,
        rationalAnswer(verifier).canonicalKey, rationalDistractors(solver),
        "The conjugate has product 1 with x, so it is exactly 1/x; adding the pair cancels the surd.",
        [`(${a}+\\sqrt{${radicand}})(${a}-\\sqrt{${radicand}})=${a * a}-${radicand}=1`, `1/x=${a}-\\sqrt{${radicand}}`, `x+1/x=${2 * a}`],
        "Use the reciprocal-conjugate relation to evaluate the target.");
    }
    default:
      throw new Error(`Unknown SRI-CP-009 candidate: ${candidateId}`);
  }
}
