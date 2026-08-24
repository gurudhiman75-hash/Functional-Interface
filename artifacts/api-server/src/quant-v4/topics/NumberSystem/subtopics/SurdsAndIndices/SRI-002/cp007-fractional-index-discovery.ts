import {
  addRationalExponent,
  formatExponentLatex,
  negateRationalExponent,
  proofEvent,
  rationalExponent,
  rationalExponentKey,
  sriPick,
  type RationalExponent,
} from "../../../../../shared/surds-indices";
import { finalizeSriDiscoveryQuestion, type SriDistractor } from "../discovery-runtime";
import type { SriCandidateAnswer, SriDiscoveryQuestion } from "../discovery-types";

function exponentKey(value: RationalExponent): string {
  return `E:${rationalExponentKey(value)}`;
}

function exponentAsPower(value: RationalExponent): string {
  return `a^{${formatExponentLatex(value)}}`;
}

function exponentAsRadical(value: RationalExponent): string {
  if (value.denominator === 1n) return exponentAsPower(value);
  const numerator = value.numerator;
  const denominator = value.denominator;
  return denominator === 2n
    ? `\\sqrt{a^{${numerator}}}`
    : `\\sqrt[${denominator}]{a^{${numerator}}}`;
}

function buildDistractors(correct: RationalExponent, renderAsRadical: boolean): SriDistractor[] {
  const candidates: readonly { exponent: RationalExponent; misconceptionId: string }[] = [
    { exponent: rationalExponent(correct.denominator, correct.numerator), misconceptionId: "INVERT_FRACTIONAL_EXPONENT" },
    { exponent: addRationalExponent(correct, rationalExponent(1)), misconceptionId: "ADD_ONE_TO_EXPONENT" },
    { exponent: negateRationalExponent(correct), misconceptionId: "SIGN_ERROR" },
    { exponent: rationalExponent(correct.numerator * correct.denominator), misconceptionId: "MULTIPLY_NUMERATOR_AND_DENOMINATOR" },
    { exponent: rationalExponent(0), misconceptionId: "DROP_RADICAL_POWER" },
  ];
  const seen = new Set<string>([exponentKey(correct)]);
  const output: SriDistractor[] = [];
  for (const candidate of candidates) {
    const key = exponentKey(candidate.exponent);
    if (!seen.has(key)) {
      seen.add(key);
      output.push({
        text: renderAsRadical ? exponentAsRadical(candidate.exponent) : exponentAsPower(candidate.exponent),
        canonicalKey: key,
        misconceptionId: candidate.misconceptionId,
      });
    }
    if (output.length >= 3) break;
  }
  if (output.length < 3) throw new Error("CP007-F requires three canonically distinct exponent distractors");
  return output;
}

export function generateSriCp007FractionalIndexCandidate(seed: string): SriDiscoveryQuestion {
  const pair = sriPick(`${seed}:pair`, [[1, 2], [1, 3], [2, 3], [3, 4], [2, 5]] as const);
  const numerator = pair[0];
  const index = pair[1];
  const exponent = rationalExponent(numerator, index);
  const direction = sriPick(`${seed}:direction`, ["RADICAL_TO_INDEX", "INDEX_TO_RADICAL"] as const);
  const radicalText = exponentAsRadical(exponent);
  const exponentText = exponentAsPower(exponent);
  const answer: SriCandidateAnswer = {
    text: direction === "RADICAL_TO_INDEX" ? exponentText : radicalText,
    canonicalKey: exponentKey(exponent),
  };
  const stem = direction === "RADICAL_TO_INDEX"
    ? sriPick(`${seed}:surface`, [
        `Write ${radicalText} using a fractional index.`,
        `Convert ${radicalText} to exponent notation.`,
        `Which power of a is equivalent to ${radicalText}?`,
        `Express ${radicalText} without a radical sign.`,
      ])
    : sriPick(`${seed}:surface`, [
        `Write ${exponentText} in radical notation.`,
        `Convert ${exponentText} to an equivalent radical.`,
        `Which radical is equivalent to ${exponentText}?`,
        `Express ${exponentText} using a root sign.`,
      ]);

  return finalizeSriDiscoveryQuestion({
    packageId: "SRI-002",
    checkpointId: "SRI-CP-007",
    candidateId: "C007-F",
    seed,
    state: { index, numerator, direction },
    stem,
    answer,
    canonicalSolverKey: exponentKey(exponent),
    independentVerifierKey: `E:${rationalExponentKey(rationalExponent(numerator, index))}`,
    distractors: buildDistractors(exponent, direction === "INDEX_TO_RADICAL"),
    explanation: {
      given: stem.replace(/\?$/, ""),
      asked: "Convert between radical and fractional-index notation.",
      method: "An nth root contributes denominator n to the exponent; the power inside the radical supplies the numerator.",
      working: [`${radicalText} = a^{${numerator}/${index}}`, `Reduced exponent = ${formatExponentLatex(exponent)}.`],
      answer: answer.text,
    },
    proofEvents: [proofEvent("NORMALIZE", "radical and rational exponent equivalence", { radical: radicalText }, { exponent: rationalExponentKey(exponent) })],
  });
}
