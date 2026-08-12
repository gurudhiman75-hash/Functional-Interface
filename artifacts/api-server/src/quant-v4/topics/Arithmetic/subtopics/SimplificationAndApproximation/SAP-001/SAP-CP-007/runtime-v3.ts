import {
  SAP_CP007_CATALOGUE,
  SAP_CP007_PROTOTYPE_IDS,
  SAP_CP007_TIE_RULE,
  formatScaled,
  generateSapCp007 as generateV2,
  roundIntegerToUnitHalfAway,
  roundScaledHalfAway,
  type SapCp007Difficulty,
  type SapCp007Option,
  type SapCp007Package,
  type SapCp007PrototypeId,
  type SapCp007TaskDirection,
} from "./runtime-v2";

export {
  SAP_CP007_CATALOGUE,
  SAP_CP007_PROTOTYPE_IDS,
  SAP_CP007_TIE_RULE,
  formatScaled,
  roundIntegerToUnitHalfAway,
  roundScaledHalfAway,
};
export type {
  SapCp007Difficulty,
  SapCp007Option,
  SapCp007Package,
  SapCp007PrototypeId,
  SapCp007TaskDirection,
} from "./runtime-v2";

const LIFECYCLE: SapCp007Package["lifecycle"] = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

function correctIndex(seed: number): number {
  const zeroBased = seed - 1;
  return (zeroBased % 4 + Math.floor(zeroBased / 4)) % 4;
}

function makeNegativeTieOptions(answer: string, rounded: bigint, targetDp: number, seed: number): readonly SapCp007Option[] {
  const correct: SapCp007Option = Object.freeze({
    value: answer,
    isCorrect: true,
    misconceptionId: null,
    analysis: "This applies the explicitly declared half-away-from-zero rule to an exact negative midpoint.",
  });
  const wrong: SapCp007Option[] = [
    Object.freeze({
      value: formatScaled(rounded + 1n, targetDp),
      isCorrect: false,
      misconceptionId: "NEGATIVE_TIE_TOWARD_ZERO",
      analysis: "This moves the negative halfway value toward zero, which directly contradicts the tie rule stated in the question.",
    }),
    Object.freeze({
      value: formatScaled(rounded - 1n, targetDp),
      isCorrect: false,
      misconceptionId: "NEGATIVE_TIE_EXTRA_STEP",
      analysis: "This moves one extra retained unit away from zero after the halfway adjustment has already been completed.",
    }),
    Object.freeze({
      value: formatScaled(-rounded, targetDp),
      isCorrect: false,
      misconceptionId: "NEGATIVE_SIGN_DROPPED",
      analysis: "This preserves the rounded magnitude but incorrectly removes the negative sign from the original number.",
    }),
  ];
  const values = new Set([answer, ...wrong.map((option) => option.value)]);
  if (values.size !== 4) throw new Error(`Negative halfway options collapsed for seed ${seed}.`);
  const options: SapCp007Option[] = [...wrong];
  options.splice(correctIndex(seed), 0, correct);
  return Object.freeze(options);
}

function generateNegativeHalfway(seed: number): SapCp007Package {
  const prototypeId = "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE" as const;
  const targetDp = seed % 2 === 0 ? 0 : 1;
  const inputDp = targetDp + 1;
  // Direct seed-derived magnitudes guarantee a large non-collapsing pool while
  // keeping every state exactly halfway at the discarded place.
  const retainedMagnitude = targetDp === 0
    ? 20 + seed * 3
    : 200 + seed * 7;
  const scaled = -BigInt(retainedMagnitude * 10 + 5);
  const rounded = roundScaledHalfAway(scaled, inputDp, targetDp);
  const answer = formatScaled(rounded, targetDp);
  const original = formatScaled(scaled, inputDp);
  const catalogue = SAP_CP007_CATALOGUE.find((item) => item.prototypeId === prototypeId)!;
  const stem = `Use this rule: if a value is exactly halfway, round away from zero. Round ${original} to ${targetDp === 0 ? "the nearest integer" : "1 decimal place"}.`;
  const data = Object.freeze({
    scaled: Number(scaled),
    inputDp,
    targetDp,
    roundedScaled: Number(rounded),
    retainedMagnitude,
    exactHalfway: 1,
    v3: 1,
  });
  const options = makeNegativeTieOptions(answer, rounded, targetDp, seed);
  const partial: Omit<SapCp007Package, "validation"> = Object.freeze({
    checkpointId: "SAP-CP-007",
    prototypeId,
    proposedPermanentQlId: catalogue.proposedPermanentQlId,
    seed,
    difficulty: catalogue.difficulty as SapCp007Difficulty,
    taskDirection: catalogue.taskDirection as SapCp007TaskDirection,
    tieRule: SAP_CP007_TIE_RULE,
    stem,
    canonicalAnswer: answer,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    explanation: Object.freeze({
      coreConcept: "An exact halfway value is equidistant from the two neighbouring rounded values, so the declared tie rule is decisive. Under half away from zero, a negative midpoint is rounded to the neighbour with the larger absolute magnitude, not toward zero.",
      steps: Object.freeze([
        `${original} is exactly halfway between the two neighbouring values at the requested precision.`,
        `The declared rule says to move away from zero, so choose the negative neighbour with the larger absolute magnitude: ${answer}.`,
      ]),
      finalAnswer: `Therefore, the answer is ${answer}.`,
      verification: Object.freeze([
        `The discarded part is exactly half of one unit at the requested precision.`,
        `${answer} is the equidistant neighbour farther from zero, so it satisfies the declared tie rule.`,
      ]),
    }),
    oracle: Object.freeze({ kind: prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer, data }),
    generationIdentity: `${prototypeId}:v3:seed:${seed}:${JSON.stringify(data)}`,
    lifecycle: LIFECYCLE,
  });
  const errors: string[] = [];
  if (options.length !== 4 || new Set(options.map((option) => option.value)).size !== 4) errors.push("Negative halfway options must be four distinct values.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one negative halfway option must be correct.");
  if (options[partial.correctIndex]?.value !== answer) errors.push("Correct index is not answer-bound.");
  if (!stem.includes("away from zero")) errors.push("Explicit tie rule is missing from the stem.");
  return Object.freeze({ ...partial, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

export function generateSapCp007(prototypeId: SapCp007PrototypeId, seed: number): SapCp007Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  if (prototypeId === "SAP-CP007-PROT-NEGATIVE-HALFWAY-EXPLICIT-RULE") return generateNegativeHalfway(seed);
  return generateV2(prototypeId, seed);
}

export function generateSapCp007Sweep(seedsPerMode = 100): readonly SapCp007Package[] {
  if (!Number.isInteger(seedsPerMode) || seedsPerMode < 1) throw new Error("seedsPerMode must be positive.");
  return Object.freeze(SAP_CP007_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp007(prototypeId, index + 1)),
  ));
}
