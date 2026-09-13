import { generateCp008MultiEventQuestion } from "./cp008-multi-event.ts";
import type { CaeLocale, GeneratedCaeQuestion } from "./types.ts";

const CLAIMS: Record<CaeLocale, Readonly<Record<string, string>>> = {
  "en-IN": {
    P_TO_Q: "P is the immediate cause of Q.",
    Q_TO_R: "Q is the immediate cause of R.",
    R_TO_S: "R is the immediate cause of S.",
    P_IMMEDIATE_S: "P is the immediate cause of S.",
  },
  "hi-IN": {
    P_TO_Q: "P, Q का तात्कालिक कारण है।",
    Q_TO_R: "Q, R का तात्कालिक कारण है।",
    R_TO_S: "R, S का तात्कालिक कारण है।",
    P_IMMEDIATE_S: "P, S का तात्कालिक कारण है।",
  },
  "pa-IN": {
    P_TO_Q: "P, Q ਦਾ ਤੁਰੰਤ ਕਾਰਨ ਹੈ।",
    Q_TO_R: "Q, R ਦਾ ਤੁਰੰਤ ਕਾਰਨ ਹੈ।",
    R_TO_S: "R, S ਦਾ ਤੁਰੰਤ ਕਾਰਨ ਹੈ।",
    P_IMMEDIATE_S: "P, S ਦਾ ਤੁਰੰਤ ਕਾਰਨ ਹੈ।",
  },
};

/** Final reviewed CP-008 surface. Keeps semantic generation in cp008-multi-event.ts
 * while guaranteeing that relation-claim options are localized in every locale. */
export function generateReviewedCp008Question(input: Readonly<{ locale: CaeLocale; seed: number }>): GeneratedCaeQuestion {
  const base = generateCp008MultiEventQuestion(input);
  if (base.answerId !== "P_IMMEDIATE_S") return base;
  const optionMetadata = base.optionMetadata.map((option) => ({
    ...option,
    text: CLAIMS[input.locale][option.id] ?? option.text,
  }));
  return Object.freeze({
    ...base,
    options: optionMetadata.map((option) => option.text),
    optionMetadata,
  });
}
