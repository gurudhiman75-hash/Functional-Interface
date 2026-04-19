/**
 * Cleans Punjabi (Gurmukhi) text by:
 *  - NFC normalising (combinin diacritics → canonical form)
 *  - Stripping zero-width spaces (\u200B) that sneak in via copy-paste/CSV
 *  - Replacing non-breaking spaces (\u00A0) with regular spaces
 *  - Collapsing multiple consecutive whitespace into a single space
 *  - Trimming leading/trailing whitespace
 *
 * Returns null when the input is null/undefined/empty (after cleaning).
 */
export function cleanPunjabiText(text: string | null | undefined): string | null {
  if (text == null) return null;
  const cleaned = text
    .normalize("NFC")
    .replace(/\u200B/g, "")       // zero-width space
    .replace(/\u200C/g, "")       // zero-width non-joiner (sometimes appears in ZWSP-infected text)
    .replace(/\u00A0/g, " ")      // non-breaking space → regular space
    .replace(/\s+/g, " ")         // collapse multiple whitespace
    .trim();
  return cleaned || null;
}
