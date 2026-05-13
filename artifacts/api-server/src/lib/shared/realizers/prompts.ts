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
      "Find the correct answer from the following.\n\n{baseText}",
      "Answer the following question.\n\n{baseText}",
    );
  } else if (
    profileConfig.wordingStyle ===
    "inference-heavy"
  ) {
    variants.push(
      "From the information given below, determine the answer.\n\n{baseText}",
      "Answer according to the following data.\n\n{baseText}",
      "Use the data below to select the only correct option.\n\n{baseText}",
    );
  } else {
    variants.push(
      "Directions: Study the following and answer the question that follows.\n\n{baseText}",
      "What is the correct answer on the basis of the following?\n\n{baseText}",
      "Directions: Read the information below carefully and answer.\n\n{baseText}",
      "Study the following and mark the correct answer.\n\n{baseText}",
    );
  }

  if (
    examProfile === "ibps" ||
    examProfile === "sbi"
  ) {
    variants.push(
      "Directions: Each question below is based on the information given. Find the correct answer.\n\n{baseText}",
      "What should come in place of the question mark?\n\n{baseText}",
      "Which of the following is correct?\n\n{baseText}",
    );
  }

  if (
    examProfile === "ssc" ||
    examProfile === "rrb" ||
    examProfile === "punjab_state"
  ) {
    variants.push(
      "Choose the correct answer from the alternatives given below.\n\n{baseText}",
      "What is the result of the following?\n\n{baseText}",
    );
  }

  if (examProfile === "punjab_state") {
    variants.push(
      "Directions: Answer on the basis of the following.\n\n{baseText}",
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
