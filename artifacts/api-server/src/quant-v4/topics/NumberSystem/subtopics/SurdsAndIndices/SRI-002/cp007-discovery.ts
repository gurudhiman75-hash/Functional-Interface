import {
  exactNthRoot,
  extractPerfectPower,
  formatExponentLatex,
  proofEvent,
  rational,
  rationalExponent,
  rationalExponentKey,
  squareSurd,
  sriInt,
  sriPick,
} from "../../../../../shared/surds-indices";
import { textDistractors } from "../discovery-answer-utils";
import { finalizeSriDiscoveryQuestion, type SriDistractor } from "../discovery-runtime";
import type { SriCandidateAnswer, SriCandidateDescriptor, SriDiscoveryQuestion } from "../discovery-types";
import {
  classificationDistractors,
  formatNthRadical,
  nthRadical,
  nthRadicalAnswer,
  nthRadicalKey,
} from "./surd-discovery-utils";

export const SRI_CP007_CANDIDATES: readonly SriCandidateDescriptor[] = [
  { candidateId: "C007-A", checkpointId: "SRI-CP-007", title: "simplify square root by extracting perfect squares", sourceDisposition: "KEEP" },
  { candidateId: "C007-B", checkpointId: "SRI-CP-007", title: "simplify cube root by extracting perfect cubes", sourceDisposition: "KEEP" },
  { candidateId: "C007-C", checkpointId: "SRI-CP-007", title: "simplify supported nth root by extracting perfect nth powers", sourceDisposition: "NEW" },
  { candidateId: "C007-D", checkpointId: "SRI-CP-007", title: "identify whether a radical is rational or a surd", sourceDisposition: "NEW" },
  { candidateId: "C007-E", checkpointId: "SRI-CP-007", title: "classify rational or irrational outcome of exact radical arithmetic", sourceDisposition: "NEW" },
  { candidateId: "C007-F", checkpointId: "SRI-CP-007", title: "convert between radical and fractional-index representations", sourceDisposition: "NEW" },
] as const;

function power(base: number, exponent: number): bigint {
  return BigInt(base) ** BigInt(exponent);
}

function nthDistractors(index: number, outside: bigint, residual: bigint): SriDistractor[] {
  const variants = [
    nthRadical(rational(outside + 1n), index, residual),
    nthRadical(rational(outside > 1n ? outside - 1n : outside + 2n), index, residual),
    nthRadical(rational(outside), index, residual + 1n),
    nthRadical(rational(-outside), index, residual),
  ];
  const correctKey = nthRadicalKey(nthRadical(rational(outside), index, residual));
  const output: SriDistractor[] = [];
  const seen = new Set<string>([correctKey]);
  const misconceptions = ["EXTRACT_TOO_MUCH", "EXTRACT_TOO_LITTLE", "RADICAND_ERROR", "SIGN_ERROR"];
  variants.forEach((variant, idx) => {
    const answer = nthRadicalAnswer(variant);
    if (!seen.has(answer.canonicalKey)) {
      seen.add(answer.canonicalKey);
      output.push({ ...answer, misconceptionId: misconceptions[idx]! });
    }
  });
  return output.slice(0, 3);
}

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
  asked = "Simplify or classify the radical exactly.",
): SriDiscoveryQuestion {
  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-002",
    checkpointId: "SRI-CP-007",
    candidateId,
    seed,
    state,
    stem,
    answer,
    canonicalSolverKey: answer.canonicalKey,
    independentVerifierKey: verifierKey,
    distractors,
    explanation: { given: stem.replace(/\?$/, ""), asked, method, working, answer: answer.text },
    proofEvents: [proofEvent("NORMALIZE", method, { stem }, { answer: answer.text })],
  });
}

export function generateSriCp007Candidate(candidateId: string, seed: string): SriDiscoveryQuestion {
  const residual = BigInt(sriPick(`${seed}:residual`, [2, 3, 5, 6, 7, 10, 11, 13]));
  const outside = sriInt(`${seed}:outside`, 2, 6);

  switch (candidateId) {
    case "C007-A": {
      const radicand = power(outside, 2) * residual;
      const decomposition = extractPerfectPower(radicand, 2);
      const solver = nthRadical(rational(decomposition.outside), 2, decomposition.residual);
      const verifier = nthRadical(rational(outside), 2, residual);
      const answer = nthRadicalAnswer(solver);
      const stem = sriPick(`${seed}:surface`, [
        `Simplify \\sqrt{${radicand}}.`,
        `Write \\sqrt{${radicand}} in simplest surd form.`,
        `Extract the greatest perfect-square factor from \\sqrt{${radicand}}.`,
        `Which is the simplest form of \\sqrt{${radicand}}?`,
      ]);
      return finish(candidateId, seed, { radicand: radicand.toString(), index: 2 }, stem, answer, nthRadicalKey(verifier),
        nthDistractors(2, decomposition.outside, decomposition.residual),
        "Separate the largest perfect-square factor and take its square root outside the radical.",
        [`${radicand} = ${outside}^2 × ${residual}`, `\\sqrt{${radicand}} = ${outside}\\sqrt{${residual}}`]);
    }
    case "C007-B": {
      const cubeResidual = BigInt(sriPick(`${seed}:cube-residual`, [2, 3, 5, 6, 7, 10, 11]));
      const radicand = power(outside, 3) * cubeResidual;
      const decomposition = extractPerfectPower(radicand, 3);
      const solver = nthRadical(rational(decomposition.outside), 3, decomposition.residual);
      const verifier = nthRadical(rational(outside), 3, cubeResidual);
      const answer = nthRadicalAnswer(solver);
      const stem = sriPick(`${seed}:surface`, [
        `Simplify \\sqrt[3]{${radicand}}.`,
        `Write \\sqrt[3]{${radicand}} in simplest radical form.`,
        `Extract the greatest perfect-cube factor from \\sqrt[3]{${radicand}}.`,
        `Find the simplified form of \\sqrt[3]{${radicand}}.`,
      ]);
      return finish(candidateId, seed, { radicand: radicand.toString(), index: 3 }, stem, answer, nthRadicalKey(verifier),
        nthDistractors(3, decomposition.outside, decomposition.residual),
        "Separate the largest perfect-cube factor and take its cube root outside.",
        [`${radicand} = ${outside}^3 × ${cubeResidual}`, `\\sqrt[3]{${radicand}} = ${outside}\\sqrt[3]{${cubeResidual}}`]);
    }
    case "C007-C": {
      const index = sriPick(`${seed}:index`, [4, 5]);
      const nthResidual = BigInt(sriPick(`${seed}:nth-residual`, [2, 3, 5, 7]));
      const smallOutside = sriInt(`${seed}:nth-outside`, 2, 4);
      const radicand = power(smallOutside, index) * nthResidual;
      const decomposition = extractPerfectPower(radicand, index);
      const solver = nthRadical(rational(decomposition.outside), index, decomposition.residual);
      const verifier = nthRadical(rational(smallOutside), index, nthResidual);
      const answer = nthRadicalAnswer(solver);
      const rootText = `\\sqrt[${index}]{${radicand}}`;
      const stem = sriPick(`${seed}:surface`, [
        `Simplify ${rootText}.`,
        `Write ${rootText} after extracting the perfect ${index}th-power factor.`,
        `Find the simplest exact radical form of ${rootText}.`,
        `Reduce ${rootText} to index-free radicand form.`,
      ]);
      return finish(candidateId, seed, { radicand: radicand.toString(), index }, stem, answer, nthRadicalKey(verifier),
        nthDistractors(index, decomposition.outside, decomposition.residual),
        `Factor out the largest perfect ${index}th power from the radicand.`,
        [`${radicand} = ${smallOutside}^${index} × ${nthResidual}`, `${rootText} = ${formatNthRadical(verifier)}`]);
    }
    case "C007-D": {
      const index = sriPick(`${seed}:class-index`, [2, 3]);
      const isRational = sriPick(`${seed}:class-mode`, [true, false]);
      const root = sriInt(`${seed}:class-root`, 2, 9);
      const nonPerfectFactor = sriPick(`${seed}:class-factor`, [2, 3, 5, 7]);
      const radicand = isRational ? power(root, index) : power(root, index) * BigInt(nonPerfectFactor);
      const exact = exactNthRoot(radicand, index);
      const solverClass = exact === null ? "SURD" : "RATIONAL";
      const verifierClass = isRational ? "RATIONAL" : "SURD";
      const rootText = index === 2 ? `\\sqrt{${radicand}}` : `\\sqrt[${index}]{${radicand}}`;
      const answer = { text: solverClass === "RATIONAL" ? "Rational" : "Surd", canonicalKey: `T:${solverClass}` };
      const stem = sriPick(`${seed}:surface`, [
        `Classify ${rootText} as rational or a surd.`,
        `Is ${rootText} rational or a surd?`,
        `Choose the correct classification of ${rootText}.`,
        `Determine whether ${rootText} has an exact rational value.`,
      ]);
      return finish(candidateId, seed, { radicand: radicand.toString(), index }, stem, answer, `T:${verifierClass}`,
        classificationDistractors(solverClass),
        "Check whether the radicand is an exact power of the root index.",
        exact === null ? [`${radicand} is not a perfect ${index}th power, so the radical remains irrational.`] : [`${radicand} = ${exact}^${index}, so the radical equals ${exact}.`],
        "Classify the given radical.");
    }
    case "C007-E": {
      const r = BigInt(sriPick(`${seed}:irr-r`, [2, 3, 5, 6, 7, 10]));
      const coefficient = sriInt(`${seed}:irr-c`, 2, 6);
      const cancellation = sriPick(`${seed}:irr-mode`, [true, false]);
      const radicand = BigInt(coefficient * coefficient) * r;
      const normalizedFirst = squareSurd(rational(1), radicand);
      const secondCoefficient = cancellation ? -coefficient : coefficient;
      const combined = squareSurd(rational(normalizedFirst.coefficient.numerator + BigInt(secondCoefficient), normalizedFirst.coefficient.denominator), r);
      const solverClass = combined.coefficient.numerator === 0n || combined.radicand === 1n ? "RATIONAL" : "IRRATIONAL";
      const verifierClass = cancellation ? "RATIONAL" : "IRRATIONAL";
      const sign = cancellation ? "-" : "+";
      const stem = sriPick(`${seed}:surface`, [
        `Classify \\sqrt{${radicand}} ${sign} ${coefficient}\\sqrt{${r}} as rational or irrational.`,
        `Is \\sqrt{${radicand}} ${sign} ${coefficient}\\sqrt{${r}} rational or irrational?`,
        `After exact simplification, classify \\sqrt{${radicand}} ${sign} ${coefficient}\\sqrt{${r}}.`,
        `Determine the number type of \\sqrt{${radicand}} ${sign} ${coefficient}\\sqrt{${r}}.`,
      ]);
      const answer = { text: solverClass === "RATIONAL" ? "Rational" : "Irrational", canonicalKey: `T:${solverClass}` };
      return finish(candidateId, seed, { radicand: radicand.toString(), coefficient, residual: r.toString(), operation: sign }, stem,
        answer, `T:${verifierClass}`, classificationDistractors(solverClass),
        "Simplify the first radical to a like surd, combine coefficients, then classify the result.",
        [`\\sqrt{${radicand}} = ${coefficient}\\sqrt{${r}}`, cancellation ? "The two like surds cancel to 0, which is rational." : `The result is ${2 * coefficient}\\sqrt{${r}}, which is irrational.`],
        "Simplify and classify the exact result.");
    }
    case "C007-F": {
      const index = sriPick(`${seed}:convert-index`, [2, 3, 4, 5]);
      const numerator = sriInt(`${seed}:convert-num`, 1, 5);
      const exponent = rationalExponent(numerator, index);
      const direction = sriPick(`${seed}:direction`, ["RADICAL_TO_INDEX", "INDEX_TO_RADICAL"] as const);
      const canonical = rationalExponentKey(exponent);
      const exponentText = formatExponentLatex(exponent);
      const radicalText = index === 2 ? `\\sqrt{a^{${numerator}}}` : `\\sqrt[${index}]{a^{${numerator}}}`;
      const answerText = direction === "RADICAL_TO_INDEX" ? `a^{${exponentText}}` : radicalText;
      const answer = { text: answerText, canonicalKey: `E:${canonical}` };
      const distractorData = [
        { text: `a^{${index}/${numerator}}`, key: `E:${index}/${numerator}`, misconceptionId: "INVERT_FRACTIONAL_EXPONENT" },
        { text: `a^{${numerator * index}}`, key: `E:${numerator * index}/1`, misconceptionId: "MULTIPLY_INSTEAD_OF_DIVIDE" },
        { text: `a^{${numerator + index}}`, key: `E:${numerator + index}/1`, misconceptionId: "ADD_INDEX_AND_POWER" },
        { text: "a", key: "E:1/1", misconceptionId: "DROP_ROOT_AND_POWER" },
      ].filter((item) => item.key !== answer.canonicalKey).slice(0, 3);
      const stem = direction === "RADICAL_TO_INDEX"
        ? sriPick(`${seed}:surface`, [
            `Write ${radicalText} using a fractional index.`,
            `Convert ${radicalText} to exponent notation.`,
            `Which power of a is equivalent to ${radicalText}?`,
            `Express ${radicalText} without a radical sign.`,
          ])
        : sriPick(`${seed}:surface`, [
            `Write a^{${exponentText}} in radical notation.`,
            `Convert a^{${exponentText}} to an equivalent radical.`,
            `Which radical represents a^{${exponentText}}?`,
            `Express a^{${exponentText}} using a root sign.`,
          ]);
      return finish(candidateId, seed, { index, numerator, direction }, stem, answer, `E:${rationalExponentKey(rationalExponent(numerator, index))}`,
        textDistractors(distractorData),
        "Use the identity that an nth root contributes denominator n to the exponent.",
        [`${radicalText} = a^{${numerator}/${index}}`, `Reduced exponent = ${exponentText}.`],
        "Convert between radical and fractional-index notation.");
    }
    default:
      throw new Error(`Unknown SRI-CP-007 candidate: ${candidateId}`);
  }
}
