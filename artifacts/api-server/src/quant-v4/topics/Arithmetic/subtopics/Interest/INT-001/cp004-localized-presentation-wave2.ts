import type { IntCp004QlId } from "./cp004-frequency-math";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import { cp004CompoundingText } from "./cp004-localization-language-pack";
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

function polishFrequencyComparisonTable(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  stem: string,
): string {
  if (source.qlId !== "INT-QL-075" || source.representation === "STANDARD_PROSE") return stem;

  const firstRule = cp004CompoundingText(locale, source.mathematicalState.frequency);
  const secondRule = cp004CompoundingText(locale, source.mathematicalState.comparisonFrequency);
  return stem
    .split("\n")
    .map((line) => {
      if (locale === "hi-IN") {
        if (line === "| जानकारी | मान |") return "| योजना/जानकारी | विवरण |";
        if (line.startsWith("| योजना A:")) return `| योजना A | ${firstRule} |`;
        if (line.startsWith("| योजना B:")) return `| योजना B | ${secondRule} |`;
      } else {
        if (line === "| ਜਾਣਕਾਰੀ | ਮੁੱਲ |") return "| ਯੋਜਨਾ/ਜਾਣਕਾਰੀ | ਵੇਰਵਾ |";
        if (line.startsWith("| ਯੋਜਨਾ A:")) return `| ਯੋਜਨਾ A | ${firstRule} |`;
        if (line.startsWith("| ਯੋਜਨਾ B:")) return `| ਯੋਜਨਾ B | ${secondRule} |`;
      }
      return line;
    })
    .join("\n");
}

export function renderCp004LocalizedPresentationWave2(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): string {
  if (!(INT_CP004_PRESENTATION_WAVE2_QL_IDS as readonly IntCp004QlId[]).includes(source.qlId)) {
    throw new Error(`${source.qlId}: unsupported CP-004 presentation Wave 2 QL.`);
  }
  return polishFrequencyComparisonTable(
    source,
    locale,
    renderCp004EditorialStemV2(source, locale),
  );
}
