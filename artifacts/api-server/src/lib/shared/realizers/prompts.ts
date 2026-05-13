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
      "{baseText}",
      "What is asked in the following?\n\n{baseText}",
      "What is the correct value on the basis of the following?\n\n{baseText}",
    );
  } else if (
    profileConfig.wordingStyle ===
    "inference-heavy"
  ) {
    variants.push(
      "From the information given below, determine the answer.\n\n{baseText}",
      "Answer according to the following data.\n\n{baseText}",
    );
  } else {
    variants.push(
      "Directions: Study the following and answer the question that follows.\n\n{baseText}",
      "What is the correct answer on the basis of the following?\n\n{baseText}",
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
  ).replace(/^:\s*/, "");
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
