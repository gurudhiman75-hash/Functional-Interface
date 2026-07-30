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
  const template = hiddenState.template === undefined ? null : String(hiddenState.template);
  const condition = divisibilityPhrase(hiddenState.divisors);

  if (template && condition) {
    switch (qlNumber) {
      case 3: {
        const direction = String(hiddenState.extremumDirection).toLowerCase();
        if (direction === "largest" || direction === "smallest") {
          stem = `What is the ${direction} digit X that makes ${template} ${condition}?`;
        }
        break;
      }
      case 4:
        stem = `How many digits can replace X in ${template} so that the number is ${condition}?`;
        break;
      case 5:
        stem = `What is the sum of all digits that can replace X in ${template} so that the number is ${condition}?`;
        break;
      case 6:
        stem = `Which set contains all digits that can replace X in ${template} so that the number is ${condition}?`;
        break;
      case 7: {
        const direction = String(hiddenState.extremumDirection).startsWith("GREATEST")
          ? "greatest"
          : "smallest";
        stem = `What is the ${direction} number obtained by replacing X in ${template} so that the completed number is ${condition}?`;
        break;
      }
      default:
        break;
    }
  }

  return polishNumberSystemEnglishStem(qlId, stem, hiddenState);
}
