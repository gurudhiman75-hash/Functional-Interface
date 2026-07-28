import { withCodPedagogicalExplanation } from "./pedagogical-explanation";

interface QuestionLike {
  locale: string;
  explanation: unknown;
  [key: string]: unknown;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function localizeConditionTerms(text: string, locale: string): string {
  if (locale === "hi-IN") {
    return text
      .replaceAll("ODD_EVEN", "विषम–सम")
      .replaceAll("EVEN_ODD", "सम–विषम")
      .replaceAll("ODD_ODD", "विषम–विषम")
      .replaceAll("EVEN_EVEN", "सम–सम")
      .replaceAll("VOWEL_CONSONANT", "स्वर–व्यंजन")
      .replaceAll("CONSONANT_VOWEL", "व्यंजन–स्वर")
      .replaceAll("VOWEL_VOWEL", "स्वर–स्वर")
      .replaceAll("CONSONANT_CONSONANT", "व्यंजन–व्यंजन")
      .replace(/\bODD\b/gu, "विषम")
      .replace(/\bEVEN\b/gu, "सम")
      .replace(/\bVOWEL\b/gu, "स्वर")
      .replace(/\bCONSONANT\b/gu, "व्यंजन");
  }
  if (locale === "pa-IN") {
    return text
      .replaceAll("ODD_EVEN", "ਬੇ-ਜੋੜ–ਜੋੜ")
      .replaceAll("EVEN_ODD", "ਜੋੜ–ਬੇ-ਜੋੜ")
      .replaceAll("ODD_ODD", "ਬੇ-ਜੋੜ–ਬੇ-ਜੋੜ")
      .replaceAll("EVEN_EVEN", "ਜੋੜ–ਜੋੜ")
      .replaceAll("VOWEL_CONSONANT", "ਸਵਰ–ਵਿਅੰਜਨ")
      .replaceAll("CONSONANT_VOWEL", "ਵਿਅੰਜਨ–ਸਵਰ")
      .replaceAll("VOWEL_VOWEL", "ਸਵਰ–ਸਵਰ")
      .replaceAll("CONSONANT_CONSONANT", "ਵਿਅੰਜਨ–ਵਿਅੰਜਨ")
      .replace(/\bODD\b/gu, "ਬੇ-ਜੋੜ")
      .replace(/\bEVEN\b/gu, "ਜੋੜ")
      .replace(/\bVOWEL\b/gu, "ਸਵਰ")
      .replace(/\bCONSONANT\b/gu, "ਵਿਅੰਜਨ");
  }
  return text;
}

function mapStrings(value: unknown, locale: string): unknown {
  if (typeof value === "string") return localizeConditionTerms(value, locale);
  if (Array.isArray(value)) return value.map((item) => mapStrings(item, locale));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, mapStrings(item, locale)]),
  );
}

export function finalizeCodPedagogicalQuestion<T extends QuestionLike>(question: T): T {
  const enhanced = withCodPedagogicalExplanation(question);
  if (enhanced.locale === "en-IN") return enhanced;
  return {
    ...enhanced,
    explanation: mapStrings(asRecord(enhanced.explanation), enhanced.locale),
  } as T;
}
