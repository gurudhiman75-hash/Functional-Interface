import {
  SAP_CP007_WAVE2_CATALOGUE,
  SAP_CP007_WAVE2_PROTOTYPE_IDS,
  generateSapCp007Wave2 as generateV4,
  type SapCp007Wave2Package,
  type SapCp007Wave2PrototypeId,
} from "./runtime-wave2-v4";
import { SAP_CP007_TIE_RULE, formatScaled, roundScaledHalfAway, type SapCp007Option } from "./runtime-v4";

export { SAP_CP007_WAVE2_CATALOGUE, SAP_CP007_WAVE2_PROTOTYPE_IDS };
export type { SapCp007Wave2Package, SapCp007Wave2PrototypeId } from "./runtime-wave2-v4";

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

function generatePrematureDiagnosis(seed: number): SapCp007Wave2Package {
  const prototypeId = "SAP-CP007-PROT-PREMATURE-ROUNDING-DIAGNOSIS" as const;
  const aWhole = 20 + seed;
  const bWhole = 5 + 2 * seed;
  const hundredths = seed % 2 === 0 ? 49 : 51;
  const aScaled = BigInt(aWhole * 100 + hundredths);
  const bScaled = BigInt(bWhole * 100 + hundredths);
  const exactSum = aScaled + bScaled;
  const correctRounded = roundScaledHalfAway(exactSum, 2, 0);
  const aEarly = roundScaledHalfAway(aScaled, 2, 0);
  const bEarly = roundScaledHalfAway(bScaled, 2, 0);
  const premature = aEarly + bEarly;
  if (premature === correctRounded) throw new Error(`Seed ${seed}: premature-rounding state did not change the result.`);
  const originalA = formatScaled(aScaled, 2);
  const originalB = formatScaled(bScaled, 2);
  const answer = `Premature rounding changed the result; the correct final answer is ${correctRounded}`;
  const distractors: SapCp007Option[] = [
    wrong(`The student's method is valid; ${premature} is the correct final answer`, "PREMATURE_ROUNDING_ACCEPTED", "Rounding the two inputs before performing the required exact addition changes the final result in this case, so the reported answer is not valid."),
    wrong(`The only error is arithmetic; the correct final answer is ${premature}`, "ARITHMETIC_BLAMED_NOT_ROUNDING", "The student's addition of the rounded integers is arithmetically consistent; the actual mistake is rounding the inputs before the required operation."),
    wrong("Both methods are equivalent because each input was rounded correctly", "ROUNDING_DISTRIBUTED_ILLEGALLY", "Correctly rounding each input separately does not make rounding distributive over addition, so the two routes need not agree."),
  ];
  const correct: SapCp007Option = Object.freeze({
    value: answer,
    isCorrect: true,
    misconceptionId: null,
    analysis: "This keeps both addends exact until after addition and rounds only the final sum, as the instruction requires.",
  });
  const options = [...distractors];
  options.splice(correctIndex(seed), 0, correct);
  const stem = `A student must add ${originalA} and ${originalB}, then round the final sum to the nearest integer. The student first rounds the two numbers to ${aEarly} and ${bEarly}, adds them, and reports ${premature}. Which diagnosis is correct?`;
  const data = Object.freeze({ aScaled: Number(aScaled), bScaled: Number(bScaled), exactSum: Number(exactSum), aEarly: Number(aEarly), bEarly: Number(bEarly), premature: Number(premature), correctRounded: Number(correctRounded), inputDp: 2, v5: 1 });
  const partial: Omit<SapCp007Wave2Package, "validation"> = Object.freeze({
    checkpointId: "SAP-CP-007",
    prototypeId,
    proposedPermanentQlId: "SAP-QL-128",
    seed,
    difficulty: "MEDIUM",
    taskDirection: "DIAGNOSIS",
    tieRule: SAP_CP007_TIE_RULE,
    stem,
    canonicalAnswer: answer,
    options: Object.freeze(options),
    correctIndex: options.findIndex((option) => option.isCorrect),
    explanation: Object.freeze({
      coreConcept: "Rounding is not generally distributive over addition. When the instruction is to round the final result, keep every input exact through the arithmetic operation and round only once at the end; otherwise the separate input errors can combine and change the final rounded answer.",
      steps: Object.freeze([
        `Add first without rounding: ${originalA} + ${originalB} = ${formatScaled(exactSum, 2)}.`,
        `Round only that exact sum: ${formatScaled(exactSum, 2)} → ${correctRounded}; the early-rounded route instead produced ${premature}.`,
      ]),
      finalAnswer: `Therefore, the answer is ${answer}.`,
      verification: Object.freeze([
        `The exact and premature routes differ by ${correctRounded >= premature ? correctRounded - premature : premature - correctRounded}.`,
        `The rounded-input addition itself is correct, so the discrepancy is caused specifically by rounding before the required final step.`,
      ]),
    }),
    oracle: Object.freeze({ kind: prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer, data }),
    generationIdentity: `${prototypeId}:v5:seed:${seed}:${JSON.stringify(data)}`,
    lifecycle: LIFECYCLE,
  });
  const errors: string[] = [];
  if (options.length !== 4 || new Set(options.map((option) => option.value)).size !== 4) errors.push("Premature-rounding options must be four distinct values.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one premature-rounding diagnosis must be correct.");
  if (options[partial.correctIndex]?.value !== answer) errors.push("Premature-rounding correct index is not answer-bound.");
  return Object.freeze({ ...partial, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

export function generateSapCp007Wave2(prototypeId: SapCp007Wave2PrototypeId, seed: number): SapCp007Wave2Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  if (prototypeId === "SAP-CP007-PROT-PREMATURE-ROUNDING-DIAGNOSIS") return generatePrematureDiagnosis(seed);
  return generateV4(prototypeId, seed);
}

export function generateSapCp007Wave2Sweep(seedsPerMode = 100): readonly SapCp007Wave2Package[] {
  return Object.freeze(SAP_CP007_WAVE2_PROTOTYPE_IDS.flatMap((prototypeId) => Array.from({ length: seedsPerMode }, (_, index) => generateSapCp007Wave2(prototypeId, index + 1))));
}
