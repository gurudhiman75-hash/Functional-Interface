import type { Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";

function polishSharedExplanation(text: string, locale: Sea001TranslatedLocale): string {
  if (locale === "hi-IN") {
    return text
      // Approved-English case sketches use: "Case N: A → B clockwise."
      // Preserve the same directional statement in native learner language.
      .replace(/ clockwise\./g, " घड़ी की दिशा में।")
      // Approved-English grouped clue labels can use: "Clues 3, 5 and 6..."
      // The sentence itself is already localized; translate only the list conjunction.
      .replace(/(संकेत\s+[0-9, ]+) and (\d+)/g, "$1 और $2");
  }

  return text
    .replace(/ clockwise\./g, " ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ।")
    .replace(/(ਸੰਕੇਤ\s+[0-9, ]+) and (\d+)/g, "$1 ਅਤੇ $2");
}

/**
 * Final script-only polish for two diagram/list labels inherited verbatim from
 * the approved English teaching presentation. It changes no semantic field and
 * no teaching role; it only renders those labels in the target script.
 */
export function polishSea001ExplanationParityScript(
  candidate: Sea001LocalizedReviewCaselet,
  locale: Sea001TranslatedLocale,
): Sea001LocalizedReviewCaselet {
  return {
    ...candidate,
    sharedExplanation: polishSharedExplanation(candidate.sharedExplanation, locale),
  };
}
