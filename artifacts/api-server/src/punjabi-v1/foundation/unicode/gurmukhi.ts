const FORBIDDEN_INVISIBLES = /[\u200B-\u200F\u202A-\u202E\u2060\u2066-\u2069\uFEFF]/u;
const DISALLOWED_CONTROLS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/u;
const LATIN_OR_DEVANAGARI = /[A-Za-z\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;

export interface PunjabiDisplayValidation {
  normalized: string;
  hasGurmukhi: boolean;
}

/**
 * Canonicalize Unicode without repairing malformed orthography.
 *
 * The donor engine used to silently strip invisible characters and reorder
 * combining marks. The forward-port intentionally does neither: hidden or
 * suspicious formatting is rejected so generated content cannot become valid
 * merely because the validator rewrote it.
 */
export function normalizePunjabiText(input: string): string {
  if (FORBIDDEN_INVISIBLES.test(input)) {
    throw new Error("Punjabi text contains a forbidden invisible or bidi-control character.");
  }
  if (DISALLOWED_CONTROLS.test(input)) {
    throw new Error("Punjabi text contains a forbidden control character.");
  }
  return input.normalize("NFC");
}

/**
 * Validate ordinary learner-facing Punjabi text. Explicit translation tasks
 * can opt out of the mixed-script check at their own CP boundary; CP001 cannot.
 */
export function assertPunjabiDisplayText(input: string): PunjabiDisplayValidation {
  const normalized = normalizePunjabiText(input).trim();
  if (!normalized) throw new Error("Punjabi display text must not be empty.");
  if (!GURMUKHI.test(normalized)) {
    throw new Error("Punjabi display text must contain Gurmukhi script.");
  }
  if (LATIN_OR_DEVANAGARI.test(normalized)) {
    throw new Error("Unexpected non-Punjabi script leaked into Punjabi display text.");
  }
  return { normalized, hasGurmukhi: true };
}

/** Segment by Unicode grapheme cluster, never by UTF-16 code unit. */
export function splitGurmukhiGraphemes(input: string): string[] {
  const normalized = normalizePunjabiText(input);
  const Segmenter = (Intl as unknown as {
    Segmenter?: new (locale?: string, options?: { granularity: "grapheme" }) => {
      segment(value: string): Iterable<{ segment: string }>;
    };
  }).Segmenter;

  if (!Segmenter) {
    throw new Error("Intl.Segmenter is required for grapheme-safe Punjabi processing.");
  }

  const segmenter = new Segmenter("pa", { granularity: "grapheme" });
  return Array.from(segmenter.segment(normalized), (part) => part.segment);
}

/**
 * Detect collisions before an authority table is admitted. Two visually or
 * canonically equivalent records must not become separate answer identities.
 */
export function assertNoNormalizationCollisions(values: readonly string[], label: string): void {
  const seen = new Map<string, string>();
  for (const raw of values) {
    const normalized = normalizePunjabiText(raw).trim();
    const previous = seen.get(normalized);
    if (previous !== undefined && previous !== raw) {
      throw new Error(`${label} normalization collision: ${JSON.stringify(previous)} vs ${JSON.stringify(raw)}`);
    }
    if (previous !== undefined) {
      throw new Error(`${label} duplicate normalized value: ${JSON.stringify(raw)}`);
    }
    seen.set(normalized, raw);
  }
}

/** ਹ/ਰ/ਵ are ordinary base letters; "pairin" status exists only in context. */
export function hasSubjoinedLetter(grapheme: string, letter: "ਹ" | "ਰ" | "ਵ"): boolean {
  return normalizePunjabiText(grapheme).includes(`\u0A4D${letter}`);
}

export function containsGurmukhi(input: string): boolean {
  return GURMUKHI.test(input);
}
