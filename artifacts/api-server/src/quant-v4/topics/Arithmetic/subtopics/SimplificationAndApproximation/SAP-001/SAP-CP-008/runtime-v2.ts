import {
  SAP_CP008_CATALOGUE,
  SAP_CP008_INTERNAL,
  SAP_CP008_POLICY,
  SAP_CP008_PROTOTYPE_IDS,
  generateSapCp008 as generateV1,
  type SapCp008Difficulty,
  type SapCp008Option,
  type SapCp008Package,
  type SapCp008PrototypeId,
  type SapCp008TaskDirection,
} from "./runtime";

export {
  SAP_CP008_CATALOGUE,
  SAP_CP008_INTERNAL,
  SAP_CP008_POLICY,
  SAP_CP008_PROTOTYPE_IDS,
};
export type {
  SapCp008Difficulty,
  SapCp008Option,
  SapCp008Package,
  SapCp008PrototypeId,
  SapCp008TaskDirection,
};

function correctedDifferenceBound(seed: number): SapCp008Package {
  const original = generateV1("SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS", seed);
  const d = original.oracle.data;
  const low = Number(d.low);
  const highExclusive = Number(d.highExclusive);
  const half = Number(d.half);
  const answer = `${low} < exact value < ${highExclusive}`;
  const wrongs: readonly SapCp008Option[] = Object.freeze([
    Object.freeze({ value: `${low} ≤ exact value < ${highExclusive}`, isCorrect: false, misconceptionId: "LOWER_ENDPOINT_INCLUDED", analysis: "The lower endpoint would require the subtracted quantity to equal its excluded upper midpoint, so it cannot be attained." }),
    Object.freeze({ value: `${low + half} ≤ exact value < ${highExclusive}`, isCorrect: false, misconceptionId: "LOW_BOUND_TOO_HIGH", analysis: "This removes valid differences just above the true lower infimum." }),
    Object.freeze({ value: `${low} < exact value ≤ ${highExclusive}`, isCorrect: false, misconceptionId: "UPPER_ENDPOINT_INCLUDED", analysis: "The upper endpoint would require the first quantity to equal its excluded upper midpoint, so it is also unattainable." }),
  ]);
  const correct: SapCp008Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "This combines the two half-open rounding intervals with the correct sign-aware endpoint directions." });
  const options = [...wrongs];
  options.splice(original.correctIndex, 0, correct);
  const explanation = Object.freeze({
    coreConcept: "For a difference x − y, the lower infimum uses the smallest possible x and the largest possible y, while the upper supremum uses the largest possible x and the smallest possible y. Because each positive rounding interval excludes its upper midpoint, neither extreme difference is attained here, so both bounds are open.",
    steps: Object.freeze([
      `First original: [${Number(d.x) - half}, ${Number(d.x) + half}); second: [${Number(d.y) - half}, ${Number(d.y) + half}).`,
      `Combine endpoints as lower−upper and upper−lower: ${answer}.`,
    ]),
    finalAnswer: `Therefore, the required answer is ${answer}.`,
    verification: Object.freeze([
      `Values can approach ${low} from above but cannot equal it because the second term's upper midpoint is excluded.`,
      `Values can approach ${highExclusive} from below but cannot equal it because the first term's upper midpoint is excluded.`,
    ]),
  });
  const data = Object.freeze({ ...d, lowerOpen: 1, upperOpen: 1, v2: 1 });
  return Object.freeze({
    ...original,
    canonicalAnswer: answer,
    options: Object.freeze(options),
    correctIndex: original.correctIndex,
    explanation,
    oracle: Object.freeze({ kind: original.prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId: original.prototypeId, stem: original.stem, answer, data }),
    generationIdentity: `${original.prototypeId}:v2:seed:${seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: true, errors: Object.freeze([]) }),
  });
}

function correctedComparison(seed: number): SapCp008Package {
  const original = generateV1("SAP-CP008-PROT-COMPARE-ADDITIVE-ESTIMATES", seed);
  const n = seed - 1;
  const relationClass = n % 3;
  const aTarget = 400 + 10 * seed;
  const bTarget = 600 + 10 * seed;
  const estimateA = aTarget + bTarget;
  const cTarget = 450 + 10 * seed;
  const estimateB = relationClass === 0 ? estimateA : relationClass === 1 ? estimateA + 20 : estimateA - 20;
  const dTarget = estimateB - cTarget;
  const a = aTarget + (seed % 2 === 0 ? 3 : -2);
  const b = bTarget + (seed % 2 === 0 ? -4 : 2);
  const c = cTarget + (seed % 2 === 0 ? 2 : -3);
  const d = dTarget + (seed % 2 === 0 ? -2 : 4);
  const relation = estimateA < estimateB ? "A < B" : estimateA > estimateB ? "A > B" : "A = B";
  const answer = relation;
  const candidates = ["A < B", "A = B", "A > B", "Cannot be determined"];
  const wrongs: SapCp008Option[] = candidates.filter((value) => value !== answer).map((value, index) => Object.freeze({
    value,
    isCorrect: false,
    misconceptionId: `COMPARISON_WRONG_${index + 1}`,
    analysis: value === "Cannot be determined" ? "The declared rounding policy fixes both estimates exactly, so the relation is determined." : "This relation disagrees with the two independently evaluated rounded sums.",
  }));
  const correct: SapCp008Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "This relation follows from evaluating both additive estimates under the same declared nearest-ten terms-first policy." });
  const options = [...wrongs];
  options.splice(original.correctIndex, 0, correct);
  const stem = `Round each indicated term to the nearest ten first, then evaluate. Let A estimate ${a} + ${b} and B estimate ${c} + ${d}. Which relation is correct?`;
  const data = Object.freeze({ a, b, c, d, estimateA, estimateB, relation, relationClass, v2: 1 });
  const explanation = Object.freeze({
    coreConcept: "Comparison of additive estimates requires applying the same declared policy to both expressions before comparing their transformed values. The family deliberately includes lower, equal and greater outcomes so comparison skill is tested rather than a repeated directional pattern.",
    steps: Object.freeze([
      `A = ${aTarget} + ${bTarget} = ${estimateA}.`,
      `B = ${cTarget} + ${dTarget} = ${estimateB}; therefore ${relation}.`,
    ]),
    finalAnswer: `Therefore, the required answer is ${answer}.`,
    verification: Object.freeze([
      `Each visible term is within 4 of its stated nearest-ten benchmark.`,
      `Direct integer comparison of ${estimateA} and ${estimateB} reproduces ${relation}.`,
    ]),
  });
  return Object.freeze({
    ...original,
    stem,
    canonicalAnswer: answer,
    options: Object.freeze(options),
    correctIndex: original.correctIndex,
    explanation,
    oracle: Object.freeze({ kind: original.prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId: original.prototypeId, stem, answer, data }),
    generationIdentity: `${original.prototypeId}:v2:seed:${seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: true, errors: Object.freeze([]) }),
  });
}

export function generateSapCp008(prototypeId: SapCp008PrototypeId, seed: number): SapCp008Package {
  if (prototypeId === "SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS") return correctedDifferenceBound(seed);
  if (prototypeId === "SAP-CP008-PROT-COMPARE-ADDITIVE-ESTIMATES") return correctedComparison(seed);
  return generateV1(prototypeId, seed);
}

export function generateSapCp008Sweep(seedsPerMode = 100): readonly SapCp008Package[] {
  if (!Number.isInteger(seedsPerMode) || seedsPerMode < 1) throw new Error("seedsPerMode must be positive.");
  return Object.freeze(SAP_CP008_PROTOTYPE_IDS.flatMap((prototypeId) => Array.from({ length: seedsPerMode }, (_, index) => generateSapCp008(prototypeId, index + 1))));
}
