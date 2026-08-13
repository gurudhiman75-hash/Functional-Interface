import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009 as generateEditorial,
  type SapCp009Package,
  type SapCp009PrototypeId,
} from "./editorial-runtime";
import type { SapCp009Option } from "./runtime";

export { SAP_CP009_CATALOGUE, SAP_CP009_POLICY, SAP_CP009_PROTOTYPE_IDS };
export type { SapCp009Package, SapCp009PrototypeId };

function wrong(value: string, misconceptionId: string, analysis: string): SapCp009Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

function finalRatioDiagnosis(seed: number): SapCp009Package {
  const mode = 17;
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[mode]!;
  const base = generateEditorial(prototypeId, seed);
  const d = base.oracle.data;
  const correctValue = `Use the nearest-hundred values: ${d.numeratorRounded}:${d.denominatorRounded}`;
  const wrongDenominator = Number(d.wrongDenominator);
  const numeratorRounded = Number(d.numeratorRounded);
  const denominatorRounded = Number(d.denominatorRounded);
  const candidates: SapCp009Option[] = [
    wrong(`Keep ${numeratorRounded}:${wrongDenominator}`, "KEEP_UNSAFE_CONVENIENT_VALUE", "The denominator was moved away from its nearest-hundred value just to make the ratio look convenient."),
    wrong(`Use ${numeratorRounded + 100}:${wrongDenominator}`, "MOVE_BOTH_AWAY", "Changing the numerator too does not correct the denominator's wrong rounding."),
    wrong(`Use ${numeratorRounded}:${denominatorRounded + 100}`, "DENOMINATOR_TOO_HIGH", "The denominator should be rounded to its nearest hundred, not pushed one hundred higher."),
    wrong("Do not estimate the ratio", "REJECT_VALID_ESTIMATION", "The ratio can be estimated safely when both terms are rounded normally to the stated place."),
  ];
  const unique = candidates.filter((item, index, all) => item.value !== correctValue && all.findIndex((other) => other.value === item.value) === index);
  const correct: SapCp009Option = Object.freeze({ value: correctValue, isCorrect: true, misconceptionId: null, analysis: "Correct." });
  const options = [...unique.slice(0, 3)];
  const correctIndex = ((seed - 1) + mode) % 4;
  options.splice(correctIndex, 0, correct);
  const stem = `For ${d.numerator}:${d.denominator}, a student uses ${numeratorRounded}:${wrongDenominator} to make the calculation easier. Which is the safer estimate using nearest hundreds?`;
  const data = Object.freeze({ ...d, finalEditorialVersion: 2 });
  return Object.freeze({
    ...base,
    stem,
    canonicalAnswer: correctValue,
    options: Object.freeze(options),
    correctIndex,
    explanation: Object.freeze({
      coreConcept: "Use the actual nearest-hundred value for each term. Do not push one term farther away just to make the arithmetic easier.",
      steps: Object.freeze([
        `${d.numerator} → ${numeratorRounded} and ${d.denominator} → ${denominatorRounded} to the nearest hundred.`,
        `So use ${numeratorRounded}:${denominatorRounded}, not ${numeratorRounded}:${wrongDenominator}.`,
      ]),
      finalAnswer: `Answer: ${correctValue}.`,
      verification: Object.freeze([
        `${denominatorRounded} is the nearest hundred to ${d.denominator}.`,
        `${wrongDenominator} is one hundred farther away and distorts the ratio unnecessarily.`,
      ]),
    }),
    oracle: Object.freeze({ kind: prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer: correctValue, data, finalRuntime: 2 }),
    generationIdentity: `${prototypeId}:final-v2:${seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: true, errors: Object.freeze([]) }),
  });
}

export function generateSapCp009(prototypeId: SapCp009PrototypeId, seed: number): SapCp009Package {
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[17]) return finalRatioDiagnosis(seed);
  return generateEditorial(prototypeId, seed);
}

export function generateSapCp009Sweep(seedsPerMode = 100): readonly SapCp009Package[] {
  return Object.freeze(SAP_CP009_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp009(prototypeId, index + 1)),
  ));
}
