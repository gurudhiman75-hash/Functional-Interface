import { withCae001SaturationWave1 } from "./causal-world-saturation-wave1.ts";
import { generateCaeQuestion } from "./chapter-generator.ts";
import type { CaeLocale, GeneratedCaeQuestion } from "./types.ts";

const REJECTED_DIRECT_STATE_FRAGMENTS = [
  "variant:drill|graph:HIDDEN_CHAIN|direction:bridge>effect",
] as const;

function isEditoriallySafe(question: GeneratedCaeQuestion): boolean {
  return !REJECTED_DIRECT_STATE_FRAGMENTS.some((fragment) => question.causalStateId.includes(fragment));
}

/**
 * Review-only CP001 quality gate. The frozen V3 graph remains unchanged, but
 * two-statement review output must not overclaim a direct edge when the pair
 * still depends on an omitted initiating event. Wave 1 saturation is scoped to
 * each synchronous generation attempt and is restored immediately afterwards.
 */
export function generateReviewedCp001Question(
  input: Readonly<{ locale: CaeLocale; seed: number }>,
): GeneratedCaeQuestion {
  for (let offset = 0; offset < 32; offset += 1) {
    const internalSeed = (input.seed + offset) >>> 0;
    const question = withCae001SaturationWave1(() => generateCaeQuestion({ qlId: "CAE-QL-001", locale: input.locale, seed: internalSeed }));
    if (!isEditoriallySafe(question)) continue;
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
