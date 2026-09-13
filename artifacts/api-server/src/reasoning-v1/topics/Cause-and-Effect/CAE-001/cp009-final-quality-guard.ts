import { CAE_001_CAUSAL_WORLDS, familyForCae001 } from "./causal-world-authorities.ts";
import { generateReviewedCp009Question as generateTargetedPairCp009Question } from "./cp009-targeted-pair-polish.ts";
import type { CaeLocale, CaeRenderedOption, CaeSemanticCandidateAuthority, GeneratedCaeQuestion } from "./types.ts";

function mix32(value: number): number {
  let x = value | 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function shuffled<T>(values: readonly T[], seed: number): readonly T[] {
  const result = [...values];
  let state = mix32(seed ^ 0x9e3779b9);
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = mix32(state + index);
    const swap = state % (index + 1);
    [result[index], result[swap]] = [result[swap]!, result[index]!];
  }
  return result;
}

function scenarioAlternatives(
  base: GeneratedCaeQuestion,
  locale: CaeLocale,
  mode: string,
): readonly CaeSemanticCandidateAuthority[] {
  const world = CAE_001_CAUSAL_WORLDS.find((entry) => entry.id === base.causalWorldId);
  if (!world) throw new Error(`${base.causalWorldId}: CP009 reviewed world not found.`);
  const family = familyForCae001(world.scenarioFamilyId);
  const variant = family.variants.find((entry) => entry.id === world.scenarioVariantId);
  if (!variant) throw new Error(`${world.id}: CP009 reviewed scenario variant not found.`);

  const preferred = mode === "NEXT_OUTCOME"
    ? [...variant.semanticEffectCandidateEvents, ...variant.semanticBridgeCandidateEvents, ...variant.semanticCandidateEvents]
    : [...variant.semanticBridgeCandidateEvents, ...variant.semanticCandidateEvents, ...variant.semanticEffectCandidateEvents];
  const blocked = new Set([
    ...base.optionMetadata.filter((option) => option.isCorrect).map((option) => option.text.trim()),
  ]);
  const lowerStem = base.stem.toLocaleLowerCase(locale);
  return [...new Map(preferred
    .filter((event) => !blocked.has(event.text[locale].trim()) && !lowerStem.includes(event.text[locale].trim().toLocaleLowerCase(locale)))
    .map((event) => [event.text[locale].trim(), event])).values()];
}

function rewriteEventDistractors(base: GeneratedCaeQuestion, locale: CaeLocale, mode: string): GeneratedCaeQuestion {
  if (mode !== "MISSING_SINGLE" && mode !== "NEXT_OUTCOME") return base;
  const wrongOptions = base.optionMetadata.filter((option) => !option.isCorrect);
  const alternatives = shuffled(scenarioAlternatives(base, locale, mode), mix32((base.seed >>> 0) ^ 0x9917));
  if (alternatives.length < wrongOptions.length) {
    throw new Error(`${base.causalStateId}: CP009 ${mode} needs ${wrongOptions.length} exact-scenario distractors but found ${alternatives.length}.`);
  }

  let index = 0;
  const optionMetadata: readonly CaeRenderedOption[] = base.optionMetadata.map((option) => {
    if (option.isCorrect) return option;
    const alternative = alternatives[index++]!;
    return {
      ...option,
      id: `EDITORIAL_SAME_SCENARIO:${base.scenarioVariantId}:${alternative.id}`,
      text: alternative.text[locale],
      distractorRole: alternative.mechanism,
    };
  });
  if (new Set(optionMetadata.map((option) => option.text)).size !== optionMetadata.length) {
    throw new Error(`${base.causalStateId}: same-scenario CP009 distractors must remain unique.`);
  }
  const correctIndex = optionMetadata.findIndex((option) => option.isCorrect);
  const itemVariantId = `${base.causalStateId}|surface:same-scenario-event-distractors-v1|presentation:${optionMetadata.map((option) => option.id).join(">")}`;
  return Object.freeze({
    ...base,
    itemVariantId,
    semanticInstanceId: itemVariantId,
    options: optionMetadata.map((option) => option.text),
    optionMetadata,
    correctIndex,
  });
}

/** Final CP009 review surface: targeted pair errors plus exact-scenario event alternatives. */
export function generateReviewedCp009Question(
  input: Readonly<{ locale: CaeLocale; seed: number }>,
): GeneratedCaeQuestion {
  const base = generateTargetedPairCp009Question(input);
  return rewriteEventDistractors(base, input.locale, base.causalStructure.split(":")[1] ?? "");
}
