import {
  SAP_E1_INACTIVE_LIFECYCLE,
  sapE1BaseValidation,
  sapE1Math,
  sapE1Options,
  type SapE1CandidatePackage,
} from "../../SAP-E1-CANDIDATE-TYPES";

export const SAP_CP005_E1_TELESCOPING_CANDIDATE_ID = "SAP-CP005-E1-CAND-NUMERIC-PARTIAL-FRACTION-TELESCOPING" as const;

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x || 1;
}

function fraction(n: number, d: number): string {
  if (d === 0) throw new Error("Zero denominator.");
  const sign = d < 0 ? -1 : 1;
  const g = gcd(n, d);
  const nn = sign * n / g;
  const dd = Math.abs(d) / g;
  return dd === 1 ? String(nn) : `${nn}/${dd}`;
}

function texFraction(n: number, d: number): string {
  return `\\frac{${n}}{${d}}`;
}

export function generateSapCp005E1Telescoping(seed: number): SapE1CandidatePackage {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  const i = seed - 1;
  const start = 2 + (i % 20);
  const termCount = 4 + (Math.floor(i / 20) % 5);
  const endPlusOne = start + termCount;
  const denominator = start * endPlusOne;
  const terms = Array.from({ length: termCount }, (_, index) => {
    const k = start + index;
    return `\\frac{1}{${k} \\times ${k + 1}}`;
  });
  const stem = `Find the exact value of ${sapE1Math(terms.join(" + "))}.`;
  const answer = fraction(termCount, denominator);
  const correctIndex = i % 4;
  const options = sapE1Options(answer, [
    { value: fraction(1, start), misconceptionId: "LAST_ENDPOINT_NOT_SUBTRACTED", analysis: "The first surviving endpoint is kept, but the final endpoint is not subtracted." },
    { value: fraction(1, endPlusOne), misconceptionId: "FIRST_ENDPOINT_DROPPED", analysis: "Only the last endpoint is retained after cancellation, so the starting term is lost." },
    { value: fraction(termCount + 1, denominator), misconceptionId: "TERM_COUNT_ONE_HIGH", analysis: "The telescoping structure is recognised, but the number of surviving unit differences is counted one too high." },
    { value: fraction(Math.max(1, termCount - 1), denominator), misconceptionId: "TERM_COUNT_ONE_LOW", analysis: "The endpoint denominator is formed correctly, but one surviving unit difference is omitted." },
    { value: fraction(termCount + 2, denominator), misconceptionId: "TERM_COUNT_TWO_HIGH", analysis: "The endpoint denominator is formed correctly, but two extra unit differences are counted." },
  ], correctIndex);
  const firstDecomposition = `${sapE1Math(`\\frac{1}{${start} \\times ${start + 1}} = ${texFraction(1, start)} - ${texFraction(1, start + 1)}`)}`;
  const lastK = endPlusOne - 1;
  const lastDecomposition = `${sapE1Math(`\\frac{1}{${lastK} \\times ${lastK + 1}} = ${texFraction(1, lastK)} - ${texFraction(1, lastK + 1)}`)}`;
  const steps = Object.freeze([
    `Use ${sapE1Math("\\frac{1}{k(k+1)} = \\frac{1}{k} - \\frac{1}{k+1}")}; for example, ${firstDecomposition}.`,
    `The middle fractions cancel; the last term is ${lastDecomposition}.`,
    `${sapE1Math(`${texFraction(1, start)} - ${texFraction(1, endPlusOne)} = ${answer.includes("/") ? `\\frac{${answer.split("/")[0]}}{${answer.split("/")[1]}}` : answer}`)}.`
  ]);
  const verification = Object.freeze([`Independent endpoint check: 1/${start} - 1/${endPlusOne} = ${answer}.`]);
  const errors = [...sapE1BaseValidation({ stem, answer, options, correctIndex, steps })];
  if (termCount < 4 || termCount > 8) errors.push("Term count is outside the bounded E1 range.");
  if (options.some((option) => /^Alternative\s/i.test(option.value))) errors.push("Generic fallback distractor leaked into learner options.");
  const data = Object.freeze({ start, termCount, endPlusOne, answerNumerator: termCount, answerDenominator: denominator });
  return Object.freeze({
    packageId: "SAP-001",
    checkpointId: "SAP-CP-005",
    candidateId: SAP_CP005_E1_TELESCOPING_CANDIDATE_ID,
    candidateStatus: "E1_PROVISIONAL_UNALLOCATED",
    sourceDisposition: "E1_ADD_BOUNDED_NUMERIC_PARTIAL_FRACTION_TELESCOPING",
    seed,
    locale: "en-IN",
    difficulty: termCount >= 7 ? "HARD" : "MEDIUM",
    stem,
    canonicalAnswer: answer,
    options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: "Split each adjacent reciprocal product into a difference, then cancel the repeated middle fractions.",
      steps,
      finalAnswer: `Therefore, the exact value is ${answer}.`,
      verification,
    }),
    oracle: Object.freeze({ kind: "FINITE_NUMERIC_PARTIAL_FRACTION_TELESCOPING", data }),
    canonicalPayloadKey: JSON.stringify({ candidateId: SAP_CP005_E1_TELESCOPING_CANDIDATE_ID, seed, data, answer }),
    generationIdentity: `${SAP_CP005_E1_TELESCOPING_CANDIDATE_ID}:${seed}:${start}:${termCount}`,
    lifecycle: SAP_E1_INACTIVE_LIFECYCLE,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}
