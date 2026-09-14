import { withCae001SaturationWave2 } from "./causal-world-saturation-wave2.ts";
import { generateCaeQuestion } from "./chapter-generator.ts";
import type { CaeLocale, CaeQuestionProfile, GeneratedCaeQuestion } from "./types.ts";

const REJECTED_DIRECT_STATE_FRAGMENTS = [
  "variant:drill|graph:HIDDEN_CHAIN|direction:bridge>effect",
] as const;

export function isEditoriallySafeCp001Question(question: GeneratedCaeQuestion): boolean {
  return !REJECTED_DIRECT_STATE_FRAGMENTS.some((fragment) => question.causalStateId.includes(fragment));
}

/**
 * Review-only CP001 quality gate. The frozen V3 graph remains unchanged, but
 * two-statement review output must not overclaim a direct edge when the pair
 * still depends on an omitted initiating event. The same guard applies to both
 * supported relationship profiles so FIVE_WAY review cannot bypass FOUR_WAY
 * editorial safety. Saturation overlays are scoped to each synchronous
 * generation attempt and restored immediately afterwards.
 */
export function generateReviewedCp001Question(
  input: Readonly<{ locale: CaeLocale; seed: number; questionProfile?: CaeQuestionProfile }>,
): GeneratedCaeQuestion {
  for (let offset = 0; offset < 32; offset += 1) {
    const internalSeed = (input.seed + offset) >>> 0;
    const question = withCae001SaturationWave2(() => generateCaeQuestion({
      qlId: "CAE-QL-001",
      locale: input.locale,
      seed: internalSeed,
      questionProfile: input.questionProfile,
    }));
    if (!isEditoriallySafeCp001Question(question)) continue;
    if (offset === 0) return question;

    const causalStateId = `${question.causalStateId}|editorial-remap:${input.seed}->${internalSeed}`;
    const itemVariantId = `${causalStateId}|presentation:${question.optionMetadata.map((option) => option.id).join(">")}`;
    return Object.freeze({
      ...question,
      seed: input.seed,
      causalStateId,
      itemVariantId,
      semanticInstanceId: itemVariantId,
    });
  }
  throw new Error(`CAE-QL-001 seed ${input.seed}: no editorially safe direct-relation state found.`);
}
