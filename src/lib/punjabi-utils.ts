/**
 * Cleans Punjabi (Gurmukhi) text by:
 *  - NFC normalising (combining diacritics → canonical form)
 *  - Stripping zero-width spaces (\u200B) that sneak in via copy-paste/CSV
 *  - Stripping zero-width non-joiners (\u200C) common in ZWSP-infected text
 *  - Replacing non-breaking spaces (\u00A0) with regular spaces
 *  - Collapsing multiple consecutive whitespace into a single space
 *  - Trimming leading/trailing whitespace
 *
 * Returns null/undefined (matching input) when input is null/undefined/empty.
 */
export function cleanPunjabiText(text: string | null | undefined): string | undefined {
  if (text == null) return undefined;
  const cleaned = text
    .normalize("NFC")
    .replace(/\u200B/g, "")       // zero-width space
    .replace(/\u200C/g, "")       // zero-width non-joiner
    .replace(/\u00A0/g, " ")      // non-breaking space → regular space
    .replace(/\s+/g, " ")         // collapse multiple whitespace
    .trim();
  return cleaned || undefined;
}
