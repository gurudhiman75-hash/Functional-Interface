import type { Sea001LocalizedReviewCaselet } from "./candidate-localizer.ts";
import { localizedSea001Name, SEA001_REVIEW_CANONICAL_NAMES } from "./name-pack.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertNoNamedPersonGenderAgreement(text: string, locale: Sea001TranslatedLocale): void {
  for (const canonicalName of SEA001_REVIEW_CANONICAL_NAMES) {
    const person = localizedSea001Name(canonicalName, locale);
    if (locale === "hi-IN") {
      if (text.includes(`${person} मिलता है`) || text.includes(`अदला-बदली में ${person} वहाँ आ जाता है`)) {
        throw new Error(`SEA-001 explanation language polish left gender-assuming Hindi agreement for ${person}`);
      }
    } else if (text.includes(`${person} ਮਿਲਦਾ ਹੈ`) || text.includes(`ਅਦਲਾ-ਬਦਲੀ ਵਿੱਚ ${person} ਉੱਥੇ ਆ ਜਾਂਦਾ ਹੈ`)) {
      throw new Error(`SEA-001 explanation language polish left gender-assuming Punjabi agreement for ${person}`);
    }
  }
}

function neutralizeNamedPersonAgreement(text: string, locale: Sea001TranslatedLocale): string {
  let output = text;
  for (const canonicalName of SEA001_REVIEW_CANONICAL_NAMES) {
    const person = localizedSea001Name(canonicalName, locale);
    const escaped = escapeRegExp(person);
    if (locale === "hi-IN") {
      output = output
        .replace(new RegExp(`${escaped} मिलता है`, "g"), `वहाँ ${person} है`)
        .replace(new RegExp(`अदला-बदली में ${escaped} वहाँ आ जाता है`, "g"), `अदला-बदली के बाद उस सीट पर ${person} है`);
    } else {
      output = output
        .replace(new RegExp(`${escaped} ਮਿਲਦਾ ਹੈ`, "g"), `ਉੱਥੇ ${person} ਹੈ`)
        .replace(new RegExp(`ਅਦਲਾ-ਬਦਲੀ ਵਿੱਚ ${escaped} ਉੱਥੇ ਆ ਜਾਂਦਾ ਹੈ`, "g"), `ਅਦਲਾ-ਬਦਲੀ ਤੋਂ ਬਾਅਦ ਉਸ ਸੀਟ 'ਤੇ ${person} ਹੈ`);
    }
  }
  assertNoNamedPersonGenderAgreement(output, locale);
  return output;
}

/**
 * Native-language grammar polish that deliberately avoids assigning gender to
 * participant names (several names are unisex). It preserves the same English
 * reasoning while changing only agreement-sensitive surface wording.
 */
export function polishSea001ExplanationParityLanguage(
  candidate: Sea001LocalizedReviewCaselet,
  locale: Sea001TranslatedLocale,
): Sea001LocalizedReviewCaselet {
  const polished: Sea001LocalizedReviewCaselet = {
    ...candidate,
    sharedExplanation: neutralizeNamedPersonAgreement(candidate.sharedExplanation, locale),
    children: candidate.children.map((child) => ({
      ...child,
      explanation: neutralizeNamedPersonAgreement(child.explanation, locale),
      options: child.options.map((option) => ({
        ...option,
        explanation: neutralizeNamedPersonAgreement(option.explanation, locale),
      })),
    })),
  };

  assertNoNamedPersonGenderAgreement(polished.sharedExplanation, locale);
  for (const child of polished.children) {
    assertNoNamedPersonGenderAgreement(child.explanation, locale);
    for (const option of child.options) assertNoNamedPersonGenderAgreement(option.explanation, locale);
  }
  return polished;
}
