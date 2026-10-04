import type { GeneratedCaeQuestion } from "./types.ts";
import {
  CAE_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY,
} from "./post-closure-current-state.ts";

export { CAE_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY };

export function assertCaeGeneratedAnswerIntegrity(question: GeneratedCaeQuestion): void {
  if (question.options.length !== question.optionMetadata.length) {
    throw new Error(`${question.itemVariantId}: option metadata cardinality mismatch`);
  }
  if (new Set(question.options).size !== question.options.length) {
    throw new Error(`${question.itemVariantId}: duplicate learner option text`);
  }
  const semanticCorrect = question.optionMetadata
    .flatMap((option, index) => option.isCorrect ? [index] : []);
  if (semanticCorrect.length !== 1) {
    throw new Error(`${question.itemVariantId}: expected exactly one graph-proved correct option`);
  }
  if (semanticCorrect[0] !== question.correctIndex) {
    throw new Error(`${question.itemVariantId}: correctIndex disagrees with graph-proved option metadata`);
  }
  const correctMeta = question.optionMetadata[question.correctIndex];
  if (!correctMeta || correctMeta.id !== question.answerId) {
    throw new Error(`${question.itemVariantId}: answerId disagrees with graph-proved option metadata`);
  }
  for (let index = 0; index < question.options.length; index += 1) {
    if (question.options[index] !== question.optionMetadata[index]!.text) {
      throw new Error(`${question.itemVariantId}: learner option text drifted from semantic option metadata`);
    }
  }
}

export function assertCaeQuestionStudioMappingIntegrity(
  generated: GeneratedCaeQuestion,
  mapped: Readonly<Record<string, unknown>>,
): void {
  assertCaeGeneratedAnswerIntegrity(generated);

  const mappedOptions = Array.isArray(mapped.options) ? mapped.options.map(String) : [];
  if (JSON.stringify(mappedOptions) !== JSON.stringify(generated.options)) {
    throw new Error(`${generated.itemVariantId}: Question Studio option order/content drifted`);
  }
  if (Number(mapped.correctIndex) !== generated.correctIndex || Number(mapped.correct) !== generated.correctIndex) {
    throw new Error(`${generated.itemVariantId}: Question Studio correct index drifted`);
  }
  const expectedAnswer = generated.options[generated.correctIndex]!;
  if (String(mapped.answer ?? "") !== expectedAnswer || String(mapped.canonicalAnswer ?? "") !== expectedAnswer) {
    throw new Error(`${generated.itemVariantId}: Question Studio answer text drifted`);
  }
  if (String(mapped.causalStateId ?? "") !== generated.causalStateId) {
    throw new Error(`${generated.itemVariantId}: Question Studio causal-state identity drifted`);
  }
  if (String(mapped.itemVariantId ?? "") !== generated.itemVariantId) {
    throw new Error(`${generated.itemVariantId}: Question Studio item-variant identity drifted`);
  }
  if (String(mapped.answerId ?? "") !== generated.answerId) {
    throw new Error(`${generated.itemVariantId}: Question Studio answerId drifted`);
  }
}
