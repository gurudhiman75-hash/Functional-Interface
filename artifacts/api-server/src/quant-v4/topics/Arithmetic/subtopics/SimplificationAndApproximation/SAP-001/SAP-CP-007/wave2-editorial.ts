import {
  SAP_CP007_WAVE2_CATALOGUE,
  SAP_CP007_WAVE2_PROTOTYPE_IDS,
  generateSapCp007Wave2 as generateBase,
  type SapCp007Wave2Package,
  type SapCp007Wave2PrototypeId,
} from "./runtime-wave2-v5";

export { SAP_CP007_WAVE2_CATALOGUE, SAP_CP007_WAVE2_PROTOTYPE_IDS };
export type { SapCp007Wave2Package, SapCp007Wave2PrototypeId } from "./runtime-wave2-v5";

function placeWord(unit: number): string {
  if (unit === 10) return "ten";
  if (unit === 100) return "hundred";
  return "thousand";
}

export function generateSapCp007Wave2(prototypeId: SapCp007Wave2PrototypeId, seed: number): SapCp007Wave2Package {
  const base = generateBase(prototypeId, seed);
  if (prototypeId === "SAP-CP007-PROT-MAXIMUM-POSSIBLE-ROUNDING-ERROR") {
    const stem = base.stem
      .replace("to the 1 decimal place", "to 1 decimal place")
      .replace("to the 2 decimal places", "to 2 decimal places");
    if (stem === base.stem) return base;
    return Object.freeze({
      ...base,
      stem,
      canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer: base.canonicalAnswer, data: base.oracle.data, editorial: 1 }),
      generationIdentity: `${base.generationIdentity}:EDITORIAL-WORDING`,
    });
  }
  if (prototypeId === "SAP-CP007-PROT-RELATIVE-ROUNDING-ERROR") {
    const unit = Number(base.oracle.data.unit);
    const stem = base.stem.replace(`nearest ${unit}`, `nearest ${placeWord(unit)}`);
    return Object.freeze({
      ...base,
      stem,
      canonicalPayloadKey: JSON.stringify({ prototypeId, stem, answer: base.canonicalAnswer, data: base.oracle.data, editorial: 1 }),
      generationIdentity: `${base.generationIdentity}:EDITORIAL-WORDING`,
    });
  }
  return base;
}
