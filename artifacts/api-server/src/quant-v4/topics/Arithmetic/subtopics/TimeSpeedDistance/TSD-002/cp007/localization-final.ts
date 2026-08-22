import {
  TSD_CP007_EFFECTIVE_HINDI_LOCALIZATION,
  TSD_CP007_EFFECTIVE_PUNJABI_LOCALIZATION,
} from "./localization-effective";
import type { TsdCp007LocalizedQlSpec } from "./localization-authoring";

function normalizeHindiTerminology(value: string): string {
  return value.replace(/चाल/g, "गति");
}

function normalizeHindiRegistry(source: readonly TsdCp007LocalizedQlSpec[]): readonly TsdCp007LocalizedQlSpec[] {
  return Object.freeze(source.map((ql) => Object.freeze({
    ...ql,
    learnerContract: normalizeHindiTerminology(ql.learnerContract),
    objectPool: Object.freeze(ql.objectPool.map(normalizeHindiTerminology)),
    stemFamilies: Object.freeze(ql.stemFamilies.map((family) => Object.freeze({
      ...family,
      stem: normalizeHindiTerminology(family.stem),
      explanationGuide: normalizeHindiTerminology(family.explanationGuide),
    }))),
  })));
}

export const TSD_CP007_FINAL_HINDI_LOCALIZATION = normalizeHindiRegistry(TSD_CP007_EFFECTIVE_HINDI_LOCALIZATION);
export const TSD_CP007_FINAL_PUNJABI_LOCALIZATION = TSD_CP007_EFFECTIVE_PUNJABI_LOCALIZATION;
