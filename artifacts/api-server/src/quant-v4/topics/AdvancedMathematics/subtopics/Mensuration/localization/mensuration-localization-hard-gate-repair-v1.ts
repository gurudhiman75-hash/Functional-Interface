import type { MensurationLocalizedLanguage } from "./mensuration-localization-foundation-v3";

/**
 * Narrow post-localization repairs for machine-hard-gate surface defects.
 * These rewrites are presentation-only: they do not alter numbers, operators,
 * formula variables, option order, or answer semantics.
 */
export function repairMensurationLocalizedHardGateSurface(
  text: string,
  language: MensurationLocalizedLanguage,
) {
  if (language === "hi") {
    return text.replace(/लंबाईs\b/g, "लंबाइयाँ");
  }
  return text
    // U+0964 danda belongs to the Devanagari Unicode block and is therefore
    // intentionally normalized to ASCII punctuation on Punjabi learner text.
    .replace(/।/g, ".")
    .replace(/ਲੰਬਾਈs\b/g, "ਲੰਬਾਈਆਂ");
}
