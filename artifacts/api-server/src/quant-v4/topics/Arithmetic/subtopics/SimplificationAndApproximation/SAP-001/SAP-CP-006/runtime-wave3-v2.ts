import {
  SAP_CP006_DATA_SUFFICIENCY_CLASSES,
  SAP_CP006_WAVE3_PROTOTYPE_IDS,
  generateSapCp006Wave3 as generateBase,
  type SapCp006Wave3Package,
  type SapCp006Wave3PrototypeId,
} from "./runtime-wave3";

export {
  SAP_CP006_DATA_SUFFICIENCY_CLASSES,
  SAP_CP006_WAVE3_PROTOTYPE_IDS,
};
export type {
  SapCp006DataSufficiencyClass,
  SapCp006Wave3Package,
  SapCp006Wave3PrototypeId,
} from "./runtime-wave3";

function rotate<T>(items: readonly T[], offset: number): T[] {
  const shift = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

export function generateSapCp006Wave3(
  prototypeId: SapCp006Wave3PrototypeId,
  seed: number,
): SapCp006Wave3Package {
  const base = generateBase(prototypeId, seed);
  const byValue = new Map(base.options.map((option) => [option.value, option]));
  const canonicalOrder = SAP_CP006_DATA_SUFFICIENCY_CLASSES.map((value) => byValue.get(value)!);
  const independentShift = Math.floor((seed - 1) / 4) % 4;
  const options = Object.freeze(rotate(canonicalOrder, independentShift));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const errors = [...base.validation.errors].filter((error) => error !== "Correct option is not answer-bound.");
  if (options[correctIndex]?.value !== base.canonicalAnswer) errors.push("Correct option is not answer-bound after independent option rotation.");

  return Object.freeze({
    ...base,
    options,
    correctIndex,
    generationIdentity: `${base.generationIdentity}:POSITION-V2:${independentShift}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

export function generateSapCp006Wave3Sweep(count = 400): readonly SapCp006Wave3Package[] {
  if (!Number.isInteger(count) || count < 4) throw new Error("count must be an integer of at least 4.");
  return Object.freeze(Array.from({ length: count }, (_, index) => generateSapCp006Wave3(SAP_CP006_WAVE3_PROTOTYPE_IDS[0], index + 1)));
}
