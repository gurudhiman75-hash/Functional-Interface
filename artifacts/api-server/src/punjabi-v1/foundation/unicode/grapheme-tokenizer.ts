/**
 * Gurmukhi Grapheme Cluster Tokenizer & Carrier Binding Validator
 *
 * Breaks Gurmukhi text into orthographic syllables / grapheme clusters:
 * [Base Consonant | Vowel Carrier] + [Subjoined Virama + Dutt Letter]? + [Lagan]? + [Lagakhar]?
 */

import {
  GURMUKHI_DUTT_LETTERS,
  GURMUKHI_VOWEL_CARRIERS,
  type GurmukhiVowelCarrier,
  normalizeGurmukhi,
} from "./gurmukhi-normalizer";

export interface GurmukhiGrapheme {
  raw: string;
  base: string;
  subjoined?: string; // e.g. ਹ in ਪੜ੍ਹ
  lagan?: string;     // e.g. ਾ, ਿ, ੀ...
  lagakhar?: string;  // e.g. ਂ, ੰ, ੱ
  isValidBinding: boolean;
  errorReason?: string;
}

/**
 * Valid Lagan bindings for the three vowel carriers in Gurmukhi:
 * ੳ: ਔਂਕੜ (ੁ), ਦੁਲੈਂਕੜ (ੂ), ਹੋੜਾ (open-top ਓ)
 * ਅ: ਮੁਕਤਾ (inherent), ਕੰਨਾ (ਾ), ਦੁਲਾਵਾਂ (ੈ), ਕਨੌੜਾ (ੌ)
 * ੲ: ਸਿਹਾਰੀ (ਿ), ਬਿਹਾਰੀ (ੀ), ਲਾਂ (ੇ)
 */
export const CARRIER_LAGAN_MAP: Record<GurmukhiVowelCarrier, readonly string[]> = {
  "ੳ": ["\u0A41", "\u0A42", "\u0A4B"], // ਔਂਕੜ, ਦੁਲੈਂਕੜ, ਹੋੜਾ
  "ਅ": ["", "\u0A3E", "\u0A48", "\u0A4C"], // ਮੁਕਤਾ, ਕੰਨਾ, ਦੁਲਾਵਾਂ, ਕਨੌੜਾ
  "ੲ": ["\u0A3F", "\u0A40", "\u0A47"], // ਸਿਹਾਰੀ, ਬਿਹਾਰੀ, ਲਾਂ
};

/**
 * Tokenizes a Gurmukhi word into grapheme clusters.
 */
export function tokenizeGurmukhiWord(word: string): GurmukhiGrapheme[] {
  const normalized = normalizeGurmukhi(word);
  const clusters: GurmukhiGrapheme[] = [];

  // Match: (Base Consonant/Carrier) followed by optional (Virama + Dutt), optional Lagan, optional Lagakhar
  // Gurmukhi characters:
  // Base: [\u0A05-\u0A39\u0A59-\u0A5E\u0A72-\u0A74]
  // Virama: \u0A4D
  // Dutt: [\u0A39\u0A30\u0A35]
  // Lagan: [\u0A3E-\u0A4C]
  // Lagakhar: [\u0A02\u0A70\u0A71]
  const clusterRegex = /([\u0A05-\u0A39\u0A59-\u0A5E\u0A72-\u0A74])(?:\u0A4D([\u0A39\u0A30\u0A35]))?([\u0A3E-\u0A4C])?([\u0A02\u0A70\u0A71])?/g;

  let match: RegExpExecArray | null;
  while ((match = clusterRegex.exec(normalized)) !== null) {
    const raw = match[0];
    const base = match[1]!;
    const subjoined = match[2];
    const lagan = match[3];
    const lagakhar = match[4];

    let isValidBinding = true;
    let errorReason: string | undefined;

    // Validate vowel carrier rules if base is ੳ, ਅ, or ੲ
    if (GURMUKHI_VOWEL_CARRIERS.includes(base as any)) {
      const carrier = base as GurmukhiVowelCarrier;
      const allowed = CARRIER_LAGAN_MAP[carrier];
      const activeLagan = lagan || "";

      if (!allowed.includes(activeLagan)) {
        isValidBinding = false;
        errorReason = `ਸਵਰ ਵਾਹਕ '${carrier}' ਨਾਲ ਲਗ '${activeLagan || "ਮੁਕਤਾ"}' ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਜਾਇਜ਼ ਨਹੀਂ ਹੈ।`;
      }
    }

    clusters.push({
      raw,
      base,
      subjoined,
      lagan,
      lagakhar,
      isValidBinding,
      errorReason,
    });
  }

  return clusters;
}

/**
 * Validates whether an entire Gurmukhi string obeys all orthographic and carrier binding rules.
 */
export function validateGurmukhiWord(word: string): { isValid: boolean; errors: string[] } {
  const clusters = tokenizeGurmukhiWord(word);
  const errors: string[] = [];

  for (const c of clusters) {
    if (!c.isValidBinding && c.errorReason) {
      errors.push(c.errorReason);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
