import { assertKnowledgeQuestionValid } from "../question-validation";
import { generateCom002ReviewQuestionV3 } from "./com002-review-synthesis-v3";
import type { Com002ReviewQuestion } from "./com002-review-types";

export const COM002_ENGLISH_GENERATOR_VERSION_V4 =
  "COM-002-ENGLISH-GENERATOR-V4-CANDIDATE-1" as const;

/**
 * V4 is a deliberately narrow editorial correction over executed V3.
 *
 * V3 correctly rebound the kernel-core provenance, but COMPONENT_TO_ROLE can
 * still deterministically target the kernel-core classification fact. In that
 * case a "principal role" stem is semantically mismatched with the answer
 * "core component of an operating system". V4 changes only that learner-facing
 * stem to an identity/description formulation; options, answer index, target
 * fact, provenance and solver authority remain unchanged.
 */
function patchQl004CoreDescriptionV4(
  question: Com002ReviewQuestion,
): Com002ReviewQuestion {
  if (
    question.qlId !== "COM-002-QL-004" ||
    question.surfaceMode !== "COMPONENT_TO_ROLE" ||
    question.targetFactId !== "com002-kernel-core"
  ) {
    return question;
  }

  return {
    ...question,
    stem: "Which statement correctly identifies the kernel in an operating system?",
    explanation: "The kernel is the core component of an operating system.",
  };
}

export function generateCom002ReviewQuestionV4(input: {
  qlId: string;
  seed: string;
}): Com002ReviewQuestion {
  const v3 = generateCom002ReviewQuestionV3(input);
  const question = patchQl004CoreDescriptionV4(v3);

  assertKnowledgeQuestionValid({
    stem: question.stem,
    explanation: question.explanation,
    options: question.options,
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
  });

  const baseQuestionId = question.questionId.replace(/-V3$/, "");
  return {
    ...question,
    questionId: `${baseQuestionId}-V4`,
  };
}

export function listCom002ReviewV4QlIds() {
  return Array.from(
    { length: 13 },
    (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
  );
}
