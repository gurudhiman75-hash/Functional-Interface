import { isEditoriallySafeCp001Question } from "./cp001-reviewed-quality-guard.ts";
import {
  generateCaeSourceProfileQuestion,
  type CaeSourceProfileId,
  type GeneratedCaeSourceProfileQuestion,
} from "./source-profiles.ts";
import type { CaeLocale, CaeQlId } from "./types.ts";

export type GenerateReviewedCaeSourceProfileInput = Readonly<{
  qlId: CaeQlId;
  locale: CaeLocale;
  seed: number;
  sourceProfileId: CaeSourceProfileId;
}>;

/**
 * Review/Question-Studio facade for source-profile rendering.
 *
 * The frozen source-profile authority stays unchanged underneath. QL001 uses
 * the same narrow editorial safety rule as the reviewed direct-relation path,
 * so Bank/Punjab/SSC source-shaped review output cannot resurface a state that
 * CP001 already rejected. The external seed is preserved; any deterministic
 * retry is recorded in causal/item identity.
 */
export function generateReviewedCaeSourceProfileQuestion(
  input: GenerateReviewedCaeSourceProfileInput,
): GeneratedCaeSourceProfileQuestion {
  if (input.qlId !== "CAE-QL-001") return generateCaeSourceProfileQuestion(input);

  const externalSeed = input.seed >>> 0;
  for (let offset = 0; offset < 32; offset += 1) {
    const internalSeed = (externalSeed + offset) >>> 0;
    const question = generateCaeSourceProfileQuestion({ ...input, seed: internalSeed });
    if (!isEditoriallySafeCp001Question(question)) continue;
    if (offset === 0) return question;

    const marker = `source-profile-editorial-remap:${externalSeed}->${internalSeed}`;
    const causalStateId = `${question.causalStateId}|${marker}`;
    const itemSuffix = question.itemVariantId.startsWith(question.causalStateId)
      ? question.itemVariantId.slice(question.causalStateId.length)
      : `|source-item:${question.itemVariantId}`;
    const itemVariantId = `${causalStateId}${itemSuffix}`;
    return Object.freeze({
      ...question,
      seed: input.seed,
      causalStateId,
      itemVariantId,
      semanticInstanceId: itemVariantId,
    });
  }

  throw new Error(`${input.sourceProfileId}/CAE-QL-001 seed ${externalSeed}: no editorially safe source-profile state found.`);
}
