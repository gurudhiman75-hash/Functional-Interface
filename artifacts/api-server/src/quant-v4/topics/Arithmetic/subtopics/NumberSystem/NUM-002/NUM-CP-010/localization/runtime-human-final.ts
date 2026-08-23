import type { NumCp010PermanentQlId } from "../permanent-allocation.ts";
import { generateNumCp010LocalizedHumanReview } from "./runtime-human-review.ts";
import type { NumCp010LocalizedLanguage, NumCp010LocalizedPackage } from "./types.ts";

export function generateNumCp010LocalizedHumanFinal(
  qlId: NumCp010PermanentQlId,
  seed: number,
  language: NumCp010LocalizedLanguage,
): NumCp010LocalizedPackage {
  const q = generateNumCp010LocalizedHumanReview(qlId, seed, language);
  return Object.freeze({
    ...q,
    lifecycle: Object.freeze({
      ...q.lifecycle,
      reviewStatus: "MULTILINGUAL_FROZEN" as const,
      localizationStatus: "HI_PA_FROZEN" as const,
    }),
  }) as NumCp010LocalizedPackage;
}
