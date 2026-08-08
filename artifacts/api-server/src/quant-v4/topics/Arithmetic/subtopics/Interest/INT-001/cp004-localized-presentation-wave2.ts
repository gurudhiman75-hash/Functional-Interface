import type { IntCp004QlId } from "./cp004-frequency-math";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import { renderCp004EditorialStemV2 } from "./cp004-localized-editorial-v2";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";

export const INT_CP004_PRESENTATION_WAVE2_QL_IDS = Object.freeze([
  "INT-QL-073",
  "INT-QL-074",
  "INT-QL-075",
  "INT-QL-076",
  "INT-QL-077",
  "INT-QL-078",
] as const satisfies readonly IntCp004QlId[]);

export type IntCp004PresentationWave2QlId = typeof INT_CP004_PRESENTATION_WAVE2_QL_IDS[number];

export function renderCp004LocalizedPresentationWave2(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  if (!(INT_CP004_PRESENTATION_WAVE2_QL_IDS as readonly IntCp004QlId[]).includes(source.qlId)) {
    throw new Error(`${source.qlId}: unsupported CP-004 presentation Wave 2 QL.`);
  }
  return renderCp004EditorialStemV2(source, locale);
}
