import {
  addSurdSums,
  divideSquareSurds,
  multiplySquareSurds,
  multiplySurdSums,
  proofEvent,
  rational,
  squareSurd,
  squareSurdKey,
  sriInt,
  sriPick,
  surdSum,
  surdSumKey,
} from "../../../../../shared/surds-indices";
import { finalizeSriDiscoveryQuestion, type SriDistractor } from "../discovery-runtime";
import type { SriCandidateAnswer, SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";
import {
  classificationDistractors,
  squareSurdAnswer,
  squareSurdDistractors,
  surdSumAnswer,
  surdSumDistractors,
} from "./surd-discovery-utils";

export const SRI_CP008_CANDIDATES: readonly SriCandidateDescriptor[] = [
  { candidateId: "C008-A", checkpointId: "SRI-CP-008", title: "add or subtract already-like surds", sourceDisposition: "KEEP" },
  { candidateId: "C008-B", checkpointId: "SRI-CP-008", title: "simplify first then combine like surds", sourceDisposition: "KEEP" },
  { candidateId: "C008-C", checkpointId: "SRI-CP-008", title: "multiply surds of the same index", sourceDisposition: "KEEP" },
  { candidateId: "C008-D", checkpointId: "SRI-CP-008", title: "divide supported surds exactly", sourceDisposition: "KEEP" },
  { candidateId: "C008-E", checkpointId: "SRI-CP-008", title: "square a binomial containing a surd", sourceDisposition: "KEEP" },
  { candidateId: "C008-F", checkpointId: "SRI-CP-008", title: "conjugate product difference-of-squares identity", sourceDisposition: "KEEP" },
  { candidateId: "C008-G", checkpointId: "SRI-CP-008", title: "multiply finite surd sums and collect canonical terms", sourceDisposition: "EXPAND" },
  { candidateId: "C008-H", checkpointId: "SRI-CP-008", title: "determine rational or irrational result after exact surd arithmetic", sourceDisposition: "NEW" },
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
  asked = "Simplify the surd expression exactly.",
): SriDiscoveryQuestion {
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-002",
    checkpointId: "SRI-CP-008",
    candidateId,
    seed,
    state,
    stem,
    answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: verifierKey,
    distractors,
    explanation: { given: stem.replace(/\?$/, ""), asked, method, working, answer: answer.text },
    proofEvents: [proofEvent("SOLVE", method, { stem }, { answer: answer.text })],
  });
}

export function generateSriCp008Candidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  const r = BigInt(sriPick(`${seed}:r`, [2, 3, 5, 6, 7, 10, 11, 13]));
  const a = sriInt(`${seed}:a`, 2, 8);
  const b = sriInt(`${seed}:b`, 1, 7);

  switch (candidateId) {
    case "C008-A": {
      const subtract = sriPick(`${seed}:op`, [true, false]);
      const coefficient = subtract ? a - b : a + b;
      const solver = squareSurd(rational(coefficient), r);
      const verifier = squareSurd(rational(subtract ? BigInt(a) - BigInt(b) : BigInt(a) + BigInt(b)), r);
      const answer = squareSurdAnswer(solver);
      const sign = subtract ? "-" : "+";
      const stem = sriPick(`${seed}:surface`, [
        `Simplify ${a}\\sqrt{${r}} ${sign} ${b}\\sqrt{${r}}.`,
        `Combine the like surds: ${a}\\sqrt{${r}} ${sign} ${b}\\sqrt{${r}}.`,
        `Find the exact value of ${a}\\sqrt{${r}} ${sign} ${b}\\sqrt{${r}}.`,
        `Reduce ${a}\\sqrt{${r}} ${sign} ${b}\\sqrt{${r}} to one surd term.`,
      ]);
      return finish(candidateId, seed, { a, b, radicand: r.toString(), operation: sign }, stem, answer,
        `S:${squareSurdKey(verifier)}`, squareSurdDistractors(solver),
        "The radicals are already alike, so combine only their coefficients.",
        [`(${a} ${sign} ${b})\\sqrt{${r}} = ${coefficient}\\sqrt{${r}}`]);
    }
    case "C008-B": {
      const factor = sriInt(`${seed}:factor`, 2, 6);
      const second = sriInt(`${seed}:second`, 1, 7);
      const subtract = sriPick(`${seed}:op`, [true, false]);
      const composite = BigInt(factor * factor) * r;
      const normalizedFirst = squareSurd(rational(1), composite);
      const coefficient = Number(normalizedFirst.coefficient.numerator) + (subtract ? -second : second);
      const solver = squareSurd(rational(coefficient), r);
      const verifier = squareSurd(rational(subtract ? factor - second : factor + second), r);
      const answer = squareSurdAnswer(solver);
      const sign = subtract ? "-" : "+";
      const stem = sriPick(`${seed}:surface`, [
        `Simplify \\sqrt{${composite}} ${sign} ${second}\\sqrt{${r}}.`,
        `First reduce the radical, then simplify \\sqrt{${composite}} ${sign} ${second}\\sqrt{${r}}.`,
        `Combine \\sqrt{${composite}} ${sign} ${second}\\sqrt{${r}} into simplest form.`,
        `Evaluate exactly: \\sqrt{${composite}} ${sign} ${second}\\sqrt{${r}}.`,
      ]);
      return finish(candidateId, seed, { composite: composite.toString(), factor, residual: r.toString(), second, operation: sign }, stem,
        answer, `S:${squareSurdKey(verifier)}`, squareSurdDistractors(solver),
        "Simplify the composite radical first; once both terms have the same radicand, combine coefficients.",
        [`\\sqrt{${composite}} = ${factor}\\sqrt{${r}}`, `(${factor} ${sign} ${second})\\sqrt{${r}} = ${coefficient}\\sqrt{${r}}`]);
    }
    case "C008-C": {
      const s = BigInt(sriPick(`${seed}:s`, [2, 3, 5, 7, 11].filter((value) => BigInt(value) !== r)));
      const leftCoefficient = sriInt(`${seed}:lc`, 1, 5);
      const rightCoefficient = sriInt(`${seed}:rc`, 1, 5);
      const solver = multiplySquareSurds(squareSurd(rational(leftCoefficient), r), squareSurd(rational(rightCoefficient), s));
      const verifier = squareSurd(rational(leftCoefficient * rightCoefficient), r * s);
      const answer = squareSurdAnswer(solver);
      const stem = sriPick(`${seed}:surface`, [
        `Simplify (${leftCoefficient}\\sqrt{${r}})(${rightCoefficient}\\sqrt{${s}}).`,
        `Multiply and simplify ${leftCoefficient}\\sqrt{${r}} × ${rightCoefficient}\\sqrt{${s}}.`,
        `Find the exact product of ${leftCoefficient}\\sqrt{${r}} and ${rightCoefficient}\\sqrt{${s}}.`,
        `Reduce ${leftCoefficient}\\sqrt{${r}}·${rightCoefficient}\\sqrt{${s}} to simplest surd form.`,
      ]);
      return finish(candidateId, seed, { leftCoefficient, rightCoefficient, leftRadicand: r.toString(), rightRadicand: s.toString() }, stem,
        answer, `S:${squareSurdKey(verifier)}`, squareSurdDistractors(solver),
        "Multiply the coefficients and radicands, then extract any perfect-square factor from the product radicand.",
        [`${leftCoefficient}×${rightCoefficient}\\sqrt{${r}×${s}}`, `Canonical result = ${answer.text}`]);
    }
    case "C008-D": {
      const s = BigInt(sriPick(`${seed}:div-s`, [2, 3, 5, 7]));
      const targetRadicand = BigInt(sriPick(`${seed}:target-r`, [2, 3, 5, 7, 11].filter((value) => value !== Number(s))));
      const numeratorCoefficient = sriInt(`${seed}:num-c`, 2, 8);
      const denominatorCoefficient = sriInt(`${seed}:den-c`, 1, 4);
      const numerator = squareSurd(rational(numeratorCoefficient), targetRadicand * s);
      const denominator = squareSurd(rational(denominatorCoefficient), s);
      const solver = divideSquareSurds(numerator, denominator);
      const verifier = squareSurd(rational(numeratorCoefficient, denominatorCoefficient), targetRadicand);
      const answer = squareSurdAnswer(solver);
      const stem = sriPick(`${seed}:surface`, [
        `Simplify \\frac{${numeratorCoefficient}\\sqrt{${targetRadicand * s}}}{${denominatorCoefficient}\\sqrt{${s}}}.`,
        `Divide the surds exactly: (${numeratorCoefficient}\\sqrt{${targetRadicand * s}}) ÷ (${denominatorCoefficient}\\sqrt{${s}}).`,
        `Find the simplest form of \\frac{${numeratorCoefficient}\\sqrt{${targetRadicand * s}}}{${denominatorCoefficient}\\sqrt{${s}}}.`,
        `Reduce the quotient ${numeratorCoefficient}\\sqrt{${targetRadicand * s}}/${denominatorCoefficient}\\sqrt{${s}}.`,
      ]);
      return finish(candidateId, seed, { numeratorCoefficient, denominatorCoefficient, commonRadicand: s.toString(), targetRadicand: targetRadicand.toString() }, stem,
        answer, `S:${squareSurdKey(verifier)}`, squareSurdDistractors(solver),
        "Cancel the common radical factor exactly and reduce the rational coefficient.",
        [`\\sqrt{${targetRadicand * s}}/\\sqrt{${s}} = \\sqrt{${targetRadicand}}`, `Coefficient = ${numeratorCoefficient}/${denominatorCoefficient}`, `Canonical result = ${answer.text}`]);
    }
    case "C008-E": {
      const integerPart = sriInt(`${seed}:int`, 2, 8);
      const radicand = BigInt(sriPick(`${seed}:bin-r`, [2, 3, 5, 6, 7, 10, 11]));
      const input = surdSum([{ coefficient: rational(integerPart), radicand: 1n }, { coefficient: rational(1), radicand }]);
      const solver = multiplySurdSums(input, input);
      const verifier = surdSum([
        { coefficient: rational(integerPart * integerPart + Number(radicand)), radicand: 1n },
        { coefficient: rational(2 * integerPart), radicand },
      ]);
      const answer = surdSumAnswer(solver);
      const stem = sriPick(`${seed}:surface`, [
        `Expand and simplify (${integerPart}+\\sqrt{${radicand}})^2.`,
        `Find the exact value of (${integerPart}+\\sqrt{${radicand}})^2.`,
        `Write (${integerPart}+\\sqrt{${radicand}})^2 in the form a+b\\sqrt{${radicand}}.`,
        `Simplify the surd binomial square (${integerPart}+\\sqrt{${radicand}})^2.`,
      ]);
      return finish(candidateId, seed, { integerPart, radicand: radicand.toString() }, stem, answer,
        `SS:${surdSumKey(verifier)}`, surdSumDistractors(solver),
        "Use (a+b)^2=a^2+2ab+b^2 and simplify the square of the radical exactly.",
        [`${integerPart}^2 + 2×${integerPart}\\sqrt{${radicand}} + ${radicand}`, `Canonical result = ${answer.text}`]);
    }
    case "C008-F": {
      const integerPart = sriInt(`${seed}:conj-int`, 3, 10);
      const radicand = BigInt(sriPick(`${seed}:conj-r`, [2, 3, 5, 6, 7, 10, 11, 13].filter((value) => value !== integerPart * integerPart)));
      const left = surdSum([{ coefficient: rational(integerPart), radicand: 1n }, { coefficient: rational(1), radicand }]);
      const right = surdSum([{ coefficient: rational(integerPart), radicand: 1n }, { coefficient: rational(-1), radicand }]);
      const solver = multiplySurdSums(left, right);
      const verifier = surdSum([{ coefficient: rational(BigInt(integerPart * integerPart) - radicand), radicand: 1n }]);
      const answer = surdSumAnswer(solver);
      const stem = sriPick(`${seed}:surface`, [
        `Simplify (${integerPart}+\\sqrt{${radicand}})(${integerPart}-\\sqrt{${radicand}}).`,
        `Evaluate the conjugate product (${integerPart}+\\sqrt{${radicand}})(${integerPart}-\\sqrt{${radicand}}).`,
        `Use a difference of squares to find (${integerPart}+\\sqrt{${radicand}})(${integerPart}-\\sqrt{${radicand}}).`,
        `Find the exact product of ${integerPart}+\\sqrt{${radicand}} and its conjugate.`,
      ]);
      return finish(candidateId, seed, { integerPart, radicand: radicand.toString() }, stem, answer,
        `SS:${surdSumKey(verifier)}`, surdSumDistractors(solver),
        "A conjugate product is a difference of squares, so the mixed radical terms cancel.",
        [`(${integerPart})^2-(\\sqrt{${radicand}})^2 = ${integerPart * integerPart}-${radicand}`, `Result = ${answer.text}`]);
    }
    case "C008-G": {
      const leftInteger = sriInt(`${seed}:left-int`, 1, 6);
      const rightInteger = sriInt(`${seed}:right-int`, 1, 6);
      const radicand = BigInt(sriPick(`${seed}:sum-r`, [2, 3, 5, 6, 7, 10, 11]));
      const left = surdSum([{ coefficient: rational(leftInteger), radicand: 1n }, { coefficient: rational(1), radicand }]);
      const right = surdSum([{ coefficient: rational(rightInteger), radicand: 1n }, { coefficient: rational(1), radicand }]);
      const solver = multiplySurdSums(left, right);
      const verifier = surdSum([
        { coefficient: rational(BigInt(leftInteger * rightInteger) + radicand), radicand: 1n },
        { coefficient: rational(leftInteger + rightInteger), radicand },
      ]);
      const answer = surdSumAnswer(solver);
      const stem = sriPick(`${seed}:surface`, [
        `Expand and simplify (${leftInteger}+\\sqrt{${radicand}})(${rightInteger}+\\sqrt{${radicand}}).`,
        `Multiply the surd sums (${leftInteger}+\\sqrt{${radicand}}) and (${rightInteger}+\\sqrt{${radicand}}).`,
        `Write (${leftInteger}+\\sqrt{${radicand}})(${rightInteger}+\\sqrt{${radicand}}) in canonical surd form.`,
        `Find the exact product (${leftInteger}+\\sqrt{${radicand}})(${rightInteger}+\\sqrt{${radicand}}).`,
      ]);
      return finish(candidateId, seed, { leftInteger, rightInteger, radicand: radicand.toString() }, stem, answer,
        `SS:${surdSumKey(verifier)}`, surdSumDistractors(solver),
        "Distribute every term, replace (√r)^2 by r, then collect the rational and surd parts.",
        [`Rational part = ${leftInteger * rightInteger}+${radicand}`, `Surd coefficient = ${leftInteger}+${rightInteger}`, `Result = ${answer.text}`]);
    }
    case "C008-H": {
      const rationalMode = sriPick(`${seed}:class-mode`, [true, false]);
      const integerPart = sriInt(`${seed}:class-int`, 2, 8);
      const radicand = BigInt(sriPick(`${seed}:class-r`, [2, 3, 5, 6, 7, 10, 11]));
      const solver = rationalMode
        ? multiplySurdSums(
            surdSum([{ coefficient: rational(integerPart), radicand: 1n }, { coefficient: rational(1), radicand }]),
            surdSum([{ coefficient: rational(integerPart), radicand: 1n }, { coefficient: rational(-1), radicand }]),
          )
        : addSurdSums(
            surdSum([{ coefficient: rational(integerPart), radicand }]),
            surdSum([{ coefficient: rational(1), radicand }]),
          );
      const solverClass = solver.terms.every((term) => term.radicand === 1n) ? "RATIONAL" : "IRRATIONAL";
      const verifierClass = rationalMode ? "RATIONAL" : "IRRATIONAL";
      const expression = rationalMode
        ? `(${integerPart}+\\sqrt{${radicand}})(${integerPart}-\\sqrt{${radicand}})`
        : `${integerPart}\\sqrt{${radicand}}+\\sqrt{${radicand}}`;
      const stem = sriPick(`${seed}:surface`, [
        `After exact simplification, is ${expression} rational or irrational?`,
        `Classify the result of ${expression}.`,
        `Determine whether ${expression} simplifies to a rational or irrational number.`,
        `What is the number type of the exact result of ${expression}?`,
      ]);
      const answer = { text: solverClass === "RATIONAL" ? "Rational" : "Irrational", canonicalKey: `T:${solverClass}` };
      return finish(candidateId, seed, { rationalMode, integerPart, radicand: radicand.toString() }, stem, answer,
        `T:${verifierClass}`, classificationDistractors(solverClass),
        rationalMode ? "Use the conjugate identity; the radical terms cancel." : "Combine the like surds; a non-zero square-free radical remains.",
        [`Exact simplified result = ${surdSumAnswer(solver).text}`, `Therefore the result is ${answer.text.toLowerCase()}.`],
        "Simplify exactly and classify the result.");
    }
    default:
      throw new Error(`Unknown SRI-CP-008 candidate: ${candidateId}`);
  }
}
