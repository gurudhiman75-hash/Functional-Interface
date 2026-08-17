import {
  SAP_CP007_WAVE2_CATALOGUE,
  SAP_CP007_WAVE2_PROTOTYPE_IDS,
  generateSapCp007Wave2 as generateBase,
  type SapCp007Wave2Package,
  type SapCp007Wave2PrototypeId,
} from "./runtime-wave2";
import { SAP_CP007_TIE_RULE, type SapCp007Option } from "./runtime-v4";

export { SAP_CP007_WAVE2_CATALOGUE, SAP_CP007_WAVE2_PROTOTYPE_IDS };
export type { SapCp007Wave2Package, SapCp007Wave2PrototypeId } from "./runtime-wave2";

const LIFECYCLE: SapCp007Wave2Package["lifecycle"] = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

function correctIndex(seed: number): number {
  const n = seed - 1;
  return (n % 4 + Math.floor(n / 4)) % 4;
}

function wrong(value: string, misconceptionId: string, analysis: string): SapCp007Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

function makeOptions(answer: string, seed: number, distractors: readonly SapCp007Option[]): readonly SapCp007Option[] {
  const correct: SapCp007Option = Object.freeze({
    value: answer,
    isCorrect: true,
    misconceptionId: null,
    analysis: "This is exactly half of one rounding unit, which is the maximum possible absolute error.",
  });
  const values = new Set([answer, ...distractors.map((option) => option.value)]);
  if (distractors.length !== 3 || values.size !== 4) throw new Error(`${answer}: maximum-error options are not distinct.`);
  const options = [...distractors];
  options.splice(correctIndex(seed), 0, correct);
  return Object.freeze(options);
}

function generateMaximumError(seed: number): SapCp007Wave2Package {
  const prototypeId = "SAP-CP007-PROT-MAXIMUM-POSSIBLE-ROUNDING-ERROR" as const;
  const n = seed - 1;
  const caseIndex = n % 4;
  const sequence = Math.floor(n / 4) + 1;
  const cases = [
    { label: "nearest ten", reported: (120 + sequence) * 10, answer: "5", fullUnit: "10", smaller: "1" },
    { label: "nearest hundred", reported: (30 + sequence) * 100, answer: "50", fullUnit: "100", smaller: "10" },
    { label: "1 decimal place", reported: `${10 + sequence}.${sequence % 10}`, answer: "0.05", fullUnit: "0.10", smaller: "0.01" },
    { label: "2 decimal places", reported: `${5 + sequence}.${String((sequence * 7) % 100).padStart(2, "0")}`, answer: "0.005", fullUnit: "0.010", smaller: "0.001" },
  ] as const;
  const chosen = cases[caseIndex]!;
  const stem = `A value is reported as ${chosen.reported} after rounding to the ${chosen.label}. What is the maximum possible absolute rounding error under the declared half-away-from-zero rule?`;
  const options = makeOptions(chosen.answer, seed, [
    wrong(chosen.fullUnit, "FULL_UNIT_USED_AS_ERROR", "This uses one complete rounding unit, but the farthest an original value can lie from the reported rounded value is only half that unit."),
    wrong(chosen.smaller, "WRONG_PLACE_VALUE_ERROR", "This uses a smaller place-value step instead of the half-unit boundary determined by the stated rounding precision."),
    wrong("0", "ASSUMED_NO_ROUNDING_ERROR", "A displayed rounded value need not equal the original exactly, so the maximum possible error is not zero."),
  ]);
  const data = Object.freeze({ caseIndex, sequence, reported: String(chosen.reported), answer: chosen.answer, v2Surface: 1 });
  const partial: Omit<SapCp007Wave2Package, "validation"> = Object.freeze({
    checkpointId: "SAP-CP-007",
    prototypeId,
    proposedPermanentQlId: "SAP-QL-126",
    seed,
    difficulty: "MEDIUM",
    taskDirection: "ERROR",
    tieRule: SAP_CP007_TIE_RULE,
    stem,
    canonicalAnswer: chosen.answer,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    explanation: Object.freeze({
      coreConcept: "A rounded reported value represents all originals within half of one rounding unit. Therefore the maximum possible absolute rounding error is exactly half of the unit implied by the declared place or decimal precision.",
      steps: Object.freeze([
        `The report ${chosen.reported} was rounded to the ${chosen.label}, so first identify one complete rounding unit.`,
        `The maximum possible distance from the reported value is half of that unit, which is ${chosen.answer}.`,
      ]),
      finalAnswer: `Therefore, the answer is ${chosen.answer}.`,
      verification: Object.freeze([
        `An original value exactly one half-unit from ${chosen.reported} is a boundary case handled by the declared tie rule.`,
        `Any original farther than ${chosen.answer} from ${chosen.reported} would round to a neighbouring reported value instead.`,
      ]),
    }),
    oracle: Object.freeze({ kind: prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer: chosen.answer, data }),
    generationIdentity: `${prototypeId}:v2:seed:${seed}:${JSON.stringify(data)}`,
    lifecycle: LIFECYCLE,
  });
  const errors: string[] = [];
  if (options.length !== 4 || new Set(options.map((option) => option.value)).size !== 4) errors.push("Maximum-error options must be four distinct values.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one maximum-error option must be correct.");
  if (options[partial.correctIndex]?.value !== chosen.answer) errors.push("Correct index is not answer-bound.");
  return Object.freeze({ ...partial, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

export function generateSapCp007Wave2(prototypeId: SapCp007Wave2PrototypeId, seed: number): SapCp007Wave2Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  if (prototypeId === "SAP-CP007-PROT-MAXIMUM-POSSIBLE-ROUNDING-ERROR") return generateMaximumError(seed);
  return generateBase(prototypeId, seed);
}

export function generateSapCp007Wave2Sweep(seedsPerMode = 100): readonly SapCp007Wave2Package[] {
  return Object.freeze(SAP_CP007_WAVE2_PROTOTYPE_IDS.flatMap((prototypeId) => Array.from({ length: seedsPerMode }, (_, index) => generateSapCp007Wave2(prototypeId, index + 1))));
}
