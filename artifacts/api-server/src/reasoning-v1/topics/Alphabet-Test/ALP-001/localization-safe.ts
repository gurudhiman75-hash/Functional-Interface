import { renderAlpExplanation, renderAlpStem as renderBaseStem } from "./localization";
import type { AlpInstanceData, AlpLocale, AlpQuestionLogic } from "./types";

function text(locale: AlpLocale, en: string, hi: string, pa: string): string {
  return locale === "en-IN" ? en : locale === "hi-IN" ? hi : pa;
}

function side(locale: AlpLocale, direction: "LEFT" | "RIGHT"): string {
  return text(
    locale,
    direction === "LEFT" ? "left" : "right",
    direction === "LEFT" ? "बाईं ओर" : "दाईं ओर",
    direction === "LEFT" ? "ਖੱਬੇ ਪਾਸੇ" : "ਸੱਜੇ ਪਾਸੇ",
  );
}

export function renderAlpStem(ql: AlpQuestionLogic, data: AlpInstanceData, locale: AlpLocale): string {
  if (ql.solveMode === "SHIFT_RIGHT_FROM_LETTER_BOUNDED" || ql.solveMode === "SHIFT_LEFT_FROM_LETTER_BOUNDED") {
    return text(
      locale,
      `Which letter is ${data.offset} places to the ${side(locale, data.direction!)} of ${data.letter}?`,
      `${data.letter} से ${side(locale, data.direction!)} ${data.offset} स्थान पर कौन-सा अक्षर है?`,
      `${data.letter} ਤੋਂ ${side(locale, data.direction!)} ${data.offset} ਥਾਵਾਂ ਉੱਤੇ ਕਿਹੜਾ ਅੱਖਰ ਹੈ?`,
    );
  }
  return renderBaseStem(ql, data, locale);
}

export { renderAlpExplanation };
