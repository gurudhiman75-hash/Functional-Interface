export const APPROVED_SENTENCE_CODE_DISPLAY_TOKENS = [
  "ka", "mi", "zo", "tu", "la", "pe", "ri", "vu",
  "xe", "qo", "du", "fi", "ga", "ne", "bo", "ki",
  "za", "lu", "po", "re", "si", "va", "jo", "te",
] as const;

export function assertApprovedDisplayToken(token: string): void {
  if (!APPROVED_SENTENCE_CODE_DISPLAY_TOKENS.includes(token as never)) {
    throw new Error(`Unapproved sentence-code display token '${token}'`);
  }
}
