import { polishNumberSystemEnglishStem } from "./english-stem-style";

function divisibilityPhrase(value: unknown): string | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const divisors = value.map((item) => String(item));
  if (divisors.length === 1) return `divisible by ${divisors[0]}`;
  if (divisors.length === 2) return `divisible by both ${divisors[0]} and ${divisors[1]}`;
  return `divisible by each of ${divisors.join(", ")}`;
}

export function polishNumCp003RetainedStem(
  temporaryTemplateLabel: string,
  rawStem: string,
  hiddenState: Readonly<Record<string, unknown>>,
): string {
  const match = temporaryTemplateLabel.match(/^NUM-CP003-QLT2-(\d{2})$/);
  if (!match) return rawStem;
  const qlNumber = Number(match[1]);
  if (!Number.isInteger(qlNumber) || qlNumber < 1 || qlNumber > 17) return rawStem;
  const qlId = `NUM-QL-${String(qlNumber).padStart(3, "0")}` as const;

  let stem = rawStem;
  if (qlNumber === 4 && hiddenState.template !== undefined) {
    const condition = divisibilityPhrase(hiddenState.divisors);
    if (condition) {
      stem = `How many digits can replace X in ${String(hiddenState.template)} so that the number is ${condition}?`;
    }
  }

  return polishNumberSystemEnglishStem(qlId, stem, hiddenState);
}
