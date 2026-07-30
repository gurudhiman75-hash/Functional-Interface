import { polishNumberSystemEnglishStem } from "./english-stem-style";

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
  if (qlNumber === 4 && hiddenState.template !== undefined && hiddenState.divisor !== undefined) {
    stem = `How many digits can replace X in ${String(hiddenState.template)} so that the number is divisible by ${String(hiddenState.divisor)}?`;
  }

  return polishNumberSystemEnglishStem(qlId, stem, hiddenState);
}
