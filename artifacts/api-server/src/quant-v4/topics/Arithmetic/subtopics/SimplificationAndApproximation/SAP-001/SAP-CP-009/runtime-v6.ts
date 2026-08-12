import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009 as generateV5,
  type SapCp009Package,
  type SapCp009PrototypeId,
} from "./runtime-v5";
import type { SapCp009Option } from "./runtime";

export { SAP_CP009_CATALOGUE, SAP_CP009_POLICY, SAP_CP009_PROTOTYPE_IDS };
export type { SapCp009Package, SapCp009PrototypeId };

const LIFECYCLE: SapCp009Package["lifecycle"] = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

function wrong(value: string, misconceptionId: string, analysis: string): SapCp009Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

function missingDivisor(seed: number): SapCp009Package {
  const mode = 11;
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[mode]!;
  const quotient = 4 + ((seed - 1) % 17);
  const block = Math.floor((seed - 1) / 17);
  const divisor = [10, 20, 30, 40, 50][(seed - 1) % 5]! + block * 50;
  const dividend = quotient * divisor;
  const answer = String(divisor);
  const candidates = [
    wrong(String(divisor + 10), "DIVISOR_ONE_STEP_HIGH", "The divisor is one convenient step too high."),
    wrong(String(divisor + 20), "DIVISOR_TWO_STEPS_HIGH", "The divisor is two convenient steps too high."),
    wrong(String(divisor + 30), "DIVISOR_THREE_STEPS_HIGH", "The divisor is three convenient steps too high."),
    wrong(String(divisor + 40), "DIVISOR_FOUR_STEPS_HIGH", "The divisor is four convenient steps too high."),
  ];
  const correct: SapCp009Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct rounded divisor." });
  const options = [...candidates.slice(0, 3)];
  const correctIndex = ((seed - 1) + mode) % 4;
  options.splice(correctIndex, 0, correct);
  const data = Object.freeze({ quotient, divisor, dividend, stateBlock: block });
  const stem = `Using rounded values, ${dividend} ÷ □ ≈ ${quotient}. What rounded divisor should replace □?`;
  return Object.freeze({
    checkpointId: "SAP-CP-009",
    prototypeId,
    proposedPermanentQlId: SAP_CP009_CATALOGUE[mode]!.proposedPermanentQlId,
    seed,
    difficulty: SAP_CP009_CATALOGUE[mode]!.difficulty,
    taskDirection: SAP_CP009_CATALOGUE[mode]!.taskDirection,
    policy: SAP_CP009_POLICY,
    stem,
    canonicalAnswer: answer,
    options: Object.freeze(options),
    correctIndex,
    explanation: Object.freeze({
      coreConcept: "If dividend ÷ divisor = quotient, find the divisor by dividing the dividend by the quotient.",
      steps: Object.freeze([`□ ≈ ${dividend} ÷ ${quotient}.`, `${dividend} ÷ ${quotient} = ${divisor}.`]),
      finalAnswer: `Answer: ${divisor}.`,
      verification: Object.freeze([`${dividend} ÷ ${divisor} = ${quotient}.`, "The divisor is positive and non-zero."]),
    }),
    oracle: Object.freeze({ kind: prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer, data, runtime: "v6" }),
    generationIdentity: `${prototypeId}:v6:${seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: true, errors: Object.freeze([]) }),
    lifecycle: LIFECYCLE,
  });
}

export function generateSapCp009(prototypeId: SapCp009PrototypeId, seed: number): SapCp009Package {
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[11]) return missingDivisor(seed);
  return generateV5(prototypeId, seed);
}

export function generateSapCp009Sweep(seedsPerMode = 100): readonly SapCp009Package[] {
  return Object.freeze(SAP_CP009_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp009(prototypeId, index + 1)),
  ));
}
