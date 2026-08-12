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

export function generateSapCp008(prototypeId: SapCp008PrototypeId, seed: number): SapCp008Package {
  if (prototypeId === "SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS") return correctedDifferenceBound(seed);
  return generateV1(prototypeId, seed);
}

export function generateSapCp008Sweep(seedsPerMode = 100): readonly SapCp008Package[] {
  if (!Number.isInteger(seedsPerMode) || seedsPerMode < 1) throw new Error("seedsPerMode must be positive.");
  return Object.freeze(SAP_CP008_PROTOTYPE_IDS.flatMap((prototypeId) => Array.from({ length: seedsPerMode }, (_, index) => generateSapCp008(prototypeId, index + 1))));
}
