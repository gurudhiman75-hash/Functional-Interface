import {
  extractPerfectPower,
  proofEvent,
  rational,
  rationalExponent,
  rationalExponentKey,
  sriInt,
  sriPick,
} from "../../../../../shared/surds-indices";
import { integerAnswer, rationalAnswer, rationalDistractors, textAnswer, textDistractors } from "../discovery-answer-utils";
import { finalizeSriDiscoveryQuestion, type SriDistractor } from "../discovery-runtime";
import type { SriCandidateAnswer, SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";
import { nthRadical, nthRadicalAnswer, nthRadicalKey } from "./surd-discovery-utils";

export const SRI_CP012_CANDIDATES: readonly SriCandidateDescriptor[] = [
  { candidateId: "C012-A", checkpointId: "SRI-CP-012", title: "simplify radical by converting to rational exponents", sourceDisposition: "NEW" },
  { candidateId: "C012-B", checkpointId: "SRI-CP-012", title: "simplify index expression by converting exact power to radical form", sourceDisposition: "NEW" },
  { candidateId: "C012-C", checkpointId: "SRI-CP-012", title: "compare equivalent radical and index representations", sourceDisposition: "NEW" },
  { candidateId: "C012-D", checkpointId: "SRI-CP-012", title: "solve short mixed radical-index equation", sourceDisposition: "NEW" },
  { candidateId: "C012-E", checkpointId: "SRI-CP-012", title: "evaluate transformed target requiring surd and index steps", sourceDisposition: "NEW" },
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
  asked: string,
): SriDiscoveryQuestion {
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-002",
    checkpointId: "SRI-CP-012",
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

function nthDistractors(correctCoefficient: bigint, index: number, radicand: bigint): SriDistractor[] {
  const variants = [
    nthRadical(rational(correctCoefficient + 1n), index, radicand),
    nthRadical(rational(correctCoefficient > 1n ? correctCoefficient - 1n : correctCoefficient + 2n), index, radicand),
    nthRadical(rational(correctCoefficient), index, radicand + 1n),
    nthRadical(rational(-correctCoefficient), index, radicand),
  ];
  const correct = nthRadicalAnswer(nthRadical(rational(correctCoefficient), index, radicand));
  const seen = new Set<string>([correct.canonicalKey]);
  const ids = ["POWER_EXTRACTION_OFF_BY_ONE", "POWER_EXTRACTION_TOO_SMALL", "RESIDUAL_RADICAND_ERROR", "SIGN_ERROR"];
  const output: SriDistractor[] = [];
  variants.forEach((variant, idx) => {
    const option = nthRadicalAnswer(variant);
    if (!seen.has(option.canonicalKey)) {
      seen.add(option.canonicalKey);
      output.push({ ...option, misconceptionId: ids[idx]! });
    }
  });
  return output.slice(0, 3);
}

function pow(base: number, exponent: number): bigint {
  return BigInt(base) ** BigInt(exponent);
}

export function generateSriCp012Candidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  switch (candidateId) {
    case "C012-A": {
      const index = sriPick(`${seed}:index`, [2, 3, 4]);
      const outsideBase = sriInt(`${seed}:outside-base`, 2, 5);
      const outsidePower = sriInt(`${seed}:outside-power`, 1, 3);
      const residualBase = sriPick(`${seed}:residual-base`, [2, 3, 5, 7]);
      const residualPower = sriInt(`${seed}:residual-power`, 1, index - 1);
      const outside = pow(outsideBase, outsidePower);
      const radicand = (outside ** BigInt(index)) * pow(residualBase, residualPower);
      const decomposition = extractPerfectPower(radicand, index);
      const solver = nthRadical(rational(decomposition.outside), index, decomposition.residual);
      const expectedResidual = pow(residualBase, residualPower);
      const verifier = nthRadical(rational(outside), index, expectedResidual);
      const answer = nthRadicalAnswer(solver);
      const root = index === 2 ? `\\sqrt{${radicand}}` : `\\sqrt[${index}]{${radicand}}`;
      const stem = sriPick(`${seed}:surface`, [
        `Simplify ${root} by interpreting the root as a rational exponent.`,
        `Use fractional indices to reduce ${root} to simplest radical form.`,
        `Convert ${root} to exponent notation, simplify the powers, then return to radical form.`,
        `Find the exact simplified form of ${root} using rational exponents.`,
      ]);
      return finish(candidateId, seed, { index, radicand: radicand.toString(), outside: outside.toString(), residualBase, residualPower }, stem,
        answer, nthRadicalKey(verifier), nthDistractors(decomposition.outside, index, decomposition.residual),
        "Write the nth root as exponent 1/n, separate the exponent multiple of n, then return the residual fractional power to radical form.",
        [`${root} = ${radicand}^{1/${index}}`, `The perfect ${index}th-power part contributes ${outside} outside the radical.`, `Result = ${answer.text}.`],
        "Simplify the radical using rational-exponent structure.");
    }
    case "C012-B": {
      const root = sriInt(`${seed}:root`, 2, 6);
      const denominator = sriPick(`${seed}:denominator`, [2, 3, 4]);
      const numerator = sriInt(`${seed}:numerator`, 1, 4);
      const visibleBase = Number(pow(root, denominator));
      const exponent = rationalExponent(numerator, denominator);
      const result = Number(pow(root, numerator));
      const answer = integerAnswer(result);
      const radical = denominator === 2
        ? `\\sqrt{${visibleBase}^{${numerator}}}`
        : `\\sqrt[${denominator}]{${visibleBase}^{${numerator}}}`;
      const stem = sriPick(`${seed}:surface`, [
        `Evaluate ${visibleBase}^{${numerator}/${denominator}} by converting it to ${radical}.`,
        `Rewrite ${visibleBase}^{${numerator}/${denominator}} as a radical and simplify exactly.`,
        `Use radical form to find the exact value of ${visibleBase}^{${numerator}/${denominator}}.`,
        `Convert the fractional index ${visibleBase}^{${numerator}/${denominator}} to a root before evaluating it.`,
      ]);
      const verifier = rationalExponentKey(exponent) === rationalExponentKey(rationalExponent(numerator, denominator)) ? result : -1;
      return finish(candidateId, seed, { root, visibleBase, numerator, denominator }, stem, answer,
        integerAnswer(verifier).canonicalKey, rationalDistractors(rational(result)),
        "Interpret p/q as taking the qth root and then the pth power; the visible base was reverse-constructed as a perfect qth power.",
        [`${visibleBase}= ${root}^${denominator}`, `${visibleBase}^{${numerator}/${denominator}}=(${root})^${numerator}=${result}`],
        "Evaluate the fractional-index expression through its exact radical form.");
    }
    case "C012-C": {
      const pair = sriPick(`${seed}:fraction`, [[1, 2], [1, 3], [2, 3], [3, 4], [2, 5]] as const);
      const numerator = pair[0];
      const denominator = pair[1];
      const base = sriPick(`${seed}:base`, [2, 3, 5, 7, 11]);
      const exponent = rationalExponent(numerator, denominator);
      const radical = denominator === 2
        ? `\\sqrt{${base}^{${numerator}}}`
        : `\\sqrt[${denominator}]{${base}^{${numerator}}}`;
      const indexed = `${base}^{${numerator}/${denominator}}`;
      const answer = textAnswer("The two expressions are equal", "T:EQUAL");
      const stem = sriPick(`${seed}:surface`, [
        `Compare ${radical} and ${indexed}.`,
        `Are ${radical} and ${indexed} equal, or is one greater?`,
        `Using exact radical-index equivalence, compare ${radical} with ${indexed}.`,
        `Determine the relation between ${radical} and ${indexed}.`,
      ]);
      const distractors = textDistractors([
        { text: "First expression is greater", key: "T:FIRST_GREATER", misconceptionId: "TREAT_RADICAL_AS_LARGER" },
        { text: "Second expression is greater", key: "T:SECOND_GREATER", misconceptionId: "TREAT_INDEX_FORM_AS_LARGER" },
        { text: "Cannot be compared exactly", key: "T:UNKNOWN", misconceptionId: "MISS_EQUIVALENT_REPRESENTATION" },
      ]);
      return finish(candidateId, seed, { base, numerator, denominator }, stem, answer,
        `T:${rationalExponentKey(exponent) === rationalExponentKey(rationalExponent(numerator, denominator)) ? "EQUAL" : "UNKNOWN"}`, distractors,
        "A qth root is exactly exponent 1/q; the power inside the root supplies numerator p.",
        [`${radical}=${base}^{${numerator}/${denominator}}`, "Both expressions have the same exact rational exponent."],
        "Compare the radical and fractional-index representations exactly.");
    }
    case "C012-D": {
      const base = sriPick(`${seed}:base`, [2, 3, 5]);
      const targetExponent = sriInt(`${seed}:target-exponent`, 2, 5);
      const shift = sriInt(`${seed}:shift`, -3, 4);
      const solution = 2 * targetExponent - shift;
      const target = Number(pow(base, targetExponent));
      const exponentAfterRootNumerator = solution + shift;
      const answer = integerAnswer(solution);
      const shiftText = shift >= 0 ? `x+${shift}` : `x${shift}`;
      const stem = sriPick(`${seed}:surface`, [
        `Solve \\sqrt{${base}^{${shiftText}}}=${target}.`,
        `Find x if \\sqrt{${base}^{${shiftText}}}=${target}.`,
        `Convert the radical to an index and solve \\sqrt{${base}^{${shiftText}}}=${target}.`,
        `Determine x from the mixed radical-index equation \\sqrt{${base}^{${shiftText}}}=${target}.`,
      ]);
      const verifier = exponentAfterRootNumerator === 2 * targetExponent ? solution : Number.NaN;
      return finish(candidateId, seed, { base, targetExponent, shift, target, solution }, stem, answer,
        Number.isFinite(verifier) ? integerAnswer(verifier).canonicalKey : "R:NaN/1", rationalDistractors(rational(solution)),
        "Replace the square root by exponent 1/2, express the integer target as a power of the same base, then equate exponents.",
        [`${target}=${base}^${targetExponent}`, `(${shiftText})/2=${targetExponent}`, `x=${solution}`],
        "Solve the equation using both radical and index structure.");
    }
    case "C012-E": {
      const m = sriInt(`${seed}:m`, 2, 9);
      const r = BigInt(sriPick(`${seed}:r`, [2, 3, 5, 6, 7, 10, 11, 13]));
      const radicand = BigInt(m * m) * r;
      const solver = rational(1, m * m);
      const verifier = rational(r, BigInt(m * m) * r);
      const answer = rationalAnswer(solver);
      const stem = sriPick(`${seed}:surface`, [
        `Evaluate ${r}×(\\sqrt{${radicand}})^{-2}.`,
        `First simplify the surd, then find ${r}(\\sqrt{${radicand}})^{-2}.`,
        `Use surd simplification and a negative index to evaluate ${r}×(\\sqrt{${radicand}})^{-2}.`,
        `Find the exact value of ${r}/(\\sqrt{${radicand}})^2.`,
      ]);
      return finish(candidateId, seed, { m, r: r.toString(), radicand: radicand.toString() }, stem, answer,
        rationalAnswer(verifier).canonicalKey, rationalDistractors(solver),
        "Simplify √(m²r)=m√r, then apply the negative exponent and cancel the remaining factor r.",
        [`\\sqrt{${radicand}}=${m}\\sqrt{${r}}`, `(${m}\\sqrt{${r}})^{-2}=1/(${m * m}×${r})`, `${r}×1/(${m * m}×${r})=1/${m * m}`],
        "Evaluate the transformed target using one surd step and one index step.");
    }
    default:
      throw new Error(`Unknown SRI-CP-012 candidate: ${candidateId}`);
  }
}
