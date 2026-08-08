import type { IntCp004QlId } from "./cp004-frequency-math";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import { renderCp004EditorialStemV2 } from "./cp004-localized-editorial-v2";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";

export const INT_CP004_PRESENTATION_WAVE3_QL_IDS = Object.freeze([
  "INT-QL-079",
  "INT-QL-080",
  "INT-QL-081",
  "INT-QL-082",
  "INT-QL-083",
  "INT-QL-084",
  "INT-QL-085",
] as const satisfies readonly IntCp004QlId[]);

export type IntCp004PresentationWave3QlId = typeof INT_CP004_PRESENTATION_WAVE3_QL_IDS[number];

export function renderCp004LocalizedPresentationWave3(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  if (!(INT_CP004_PRESENTATION_WAVE3_QL_IDS as readonly IntCp004QlId[]).includes(source.qlId)) {
    throw new Error(`${source.qlId}: unsupported CP-004 presentation Wave 3 QL.`);
  }
  return renderCp004EditorialStemV2(source, locale);
}
