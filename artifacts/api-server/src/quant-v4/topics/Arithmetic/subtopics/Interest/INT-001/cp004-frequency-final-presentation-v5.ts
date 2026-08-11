import { deepFreeze, type Cp004MathematicalState, type Cp004Representation } from "./cp004-frequency-math";

type Presentation = Readonly<{ representation: Cp004Representation; stemFamilyId: string; stem: string }>;

function naturalTimeGrammar(text: string): string {
  return text
    .replace(/\bthe first 1 year\b/giu, "the first year")
    .replace(/\bfor the first 1 year\b/giu, "for the first year")
    .replace(/\bduring the first 1 year\b/giu, "during the first year")
    .replace(/\bthe next 1 year\b/giu, "the next year")
    .replace(/\bfor the next 1 year\b/giu, "for the next year")
    .replace(/\bduring the next 1 year\b/giu, "during the next year")
    .replace(/\b1 complete year\b/giu, "1 year")
    .replace(/\b(\d+) complete years\b/giu, "$1 years")
    .replace(/\b1 complete period\b/giu, "1 period")
    .replace(/\b(\d+) complete periods\b/giu, "$1 periods")
    .replace(/\bextra months\b/giu, "remaining months")
    .replace(/\bfor the complete years\b/giu, "for those years")
    .replace(/\bafter the complete years\b/giu, "after those years");
}

export function finalizeCp004PresentationLanguageV5(
  _state: Cp004MathematicalState,
  presentation: Presentation,
): Presentation {
  const stem = naturalTimeGrammar(presentation.stem);
  return stem === presentation.stem ? presentation : deepFreeze({ ...presentation, stem });
}
