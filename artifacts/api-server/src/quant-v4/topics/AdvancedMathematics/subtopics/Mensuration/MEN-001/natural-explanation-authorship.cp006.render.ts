const KEEP_FINAL_WORKING = new Set([
  "MEN-001-QL-412",
  "MEN-001-QL-414",
  "MEN-001-QL-415",
  "MEN-001-QL-416",
  "MEN-001-QL-417",
  "MEN-001-QL-422",
  "MEN-001-QL-430",
  "MEN-001-QL-431",
  "MEN-001-QL-433",
  "MEN-001-QL-435",
  "MEN-001-QL-436",
]);

const SKIP_REPEATED_FIRST_WORKING = new Set([
  "MEN-001-QL-411",
  "MEN-001-QL-418",
  "MEN-001-QL-420",
  "MEN-001-QL-432",
]);

export function selectMen001Cp006WorkingLines(
  questionLanguageId: string,
  authoredLines: readonly string[],
) {
  const working = authoredLines.slice(1, -1);
  const selected = KEEP_FINAL_WORKING.has(questionLanguageId)
    ? [...working]
    : working.slice(0, -1);

  if (SKIP_REPEATED_FIRST_WORKING.has(questionLanguageId)) {
    const withoutRepeatedOpening = working.slice(1);
    return withoutRepeatedOpening.length >= 3
      ? withoutRepeatedOpening
      : selected;
  }

  return selected;
}
