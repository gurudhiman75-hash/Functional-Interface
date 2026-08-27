import { assertKnowledgeQuestionValid } from "../question-validation";
import { generateCom002ReviewQuestionV2 } from "./com002-review-synthesis-v2";
import {
  generateCom002SafeQl013V2,
  patchCom002Ql004SafetyV2,
} from "./com002-review-synthesis-v2-safety";
import type { Com002ReviewQuestion } from "./com002-review-types";

export const COM002_ENGLISH_GENERATOR_VERSION_V3 =
  "COM-002-ENGLISH-GENERATOR-V3-CANDIDATE-1" as const;

export function generateCom002ReviewQuestionV3(input: {
  qlId: string;
  seed: string;
}): Com002ReviewQuestion {
  let question = input.qlId === "COM-002-QL-013"
    ? generateCom002SafeQl013V2(input.seed)
    : generateCom002ReviewQuestionV2(input);

  if (input.qlId === "COM-002-QL-004") {
    question = patchCom002Ql004SafetyV2(question);
  }

  assertKnowledgeQuestionValid({
    stem: question.stem,
    explanation: question.explanation,
    options: question.options,
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
  });

  const baseQuestionId = question.questionId.replace(/-V2$/, "");
  return {
    ...question,
    questionId: `${baseQuestionId}-V3`,
  };
}

export function listCom002ReviewV3QlIds() {
  return Array.from(
    { length: 13 },
    (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
  );
}
