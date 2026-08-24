import {
  TSD_CP009_FINAL_HINDI_LOCALIZATION,
  TSD_CP009_FINAL_PUNJABI_LOCALIZATION,
} from "./localization-review-final";
import type { TsdCp009LocalizationRegistry } from "./localization-types";

function replaceEverywhere(registry: TsdCp009LocalizationRegistry, replacements: readonly (readonly [string, string])[]): TsdCp009LocalizationRegistry {
  const clean = (value: string): string => replacements.reduce((output, [from, to]) => output.split(from).join(to), value);
  return Object.freeze({
    ...registry,
    qls: Object.freeze(registry.qls.map((ql) => Object.freeze({
      ...ql,
      learnerContract: clean(ql.learnerContract),
      objectPool: Object.freeze(ql.objectPool.map(clean)),
      families: Object.freeze(ql.families.map((family) => Object.freeze({
        ...family,
        stem: clean(family.stem),
        explanationGuide: clean(family.explanationGuide),
      }))),
    }))),
  });
}

export const TSD_CP009_NATIVE_FINAL_HINDI_LOCALIZATION = replaceEverywhere(
  TSD_CP009_FINAL_HINDI_LOCALIZATION,
  Object.freeze([
    ["गश्ती", "सुरक्षा"],
  ] as const),
);

export const TSD_CP009_NATIVE_FINAL_PUNJABI_LOCALIZATION = replaceEverywhere(
  TSD_CP009_FINAL_PUNJABI_LOCALIZATION,
  Object.freeze([
    ["ਗਸ਼ਤੀ", "ਸੁਰੱਖਿਆ"],
    ["ਨਿਗਰਾਨੀ", "ਸੁਰੱਖਿਆ"],
  ] as const),
);
