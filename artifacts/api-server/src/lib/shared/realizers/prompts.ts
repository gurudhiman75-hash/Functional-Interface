import type {
  ExamProfileId,
  QuantArchetype,
  QuantArchetypeContext,
} from "../../core/generator-engine";
import {
  buildPrompt,
  getExamProfileConfig,
} from "../../core/exam-realism";

export function buildQuantPrompt(
  archetype: QuantArchetype,
  context: QuantArchetypeContext,
  examProfile: ExamProfileId,
) {
  const profileConfig =
    getExamProfileConfig(examProfile);
  const variants = [
    ...archetype.wordingVariants,
  ];

  if (profileConfig.wordingStyle === "concise") {
    variants.push(
      "Answer quickly: {baseText}",
      "Find the answer: {baseText}",
    );
  }

  return buildPrompt(
    variants,
    {
      baseText: context.baseText,
      topic: context.pattern.topic,
      subtopic:
        context.pattern.subtopic,
    },
  );
}

export function buildComparisonPrompt(
  variants: string[],
  replacements: Record<
    string,
    string | number
  >,
) {
  return buildPrompt(
    variants,
    replacements,
  );
}
