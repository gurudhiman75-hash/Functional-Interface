import { generatePolCp002ReviewBatchV1 } from "./pol-cp002-review-generator-v1";
import type { PolCp002ReviewQuestion } from "./pol-cp002-review-types";

const QL001_STEMS_BY_ANSWER: Readonly<Record<string, string>> = Object.freeze({
  "11 December 1946": "When was Rajendra Prasad elected President of the Constituent Assembly?",
  "13 December 1946": "When did Jawaharlal Nehru move the Objectives Resolution in the Constituent Assembly?",
  "22 January 1947": "When did the Constituent Assembly adopt the Objectives Resolution?",
});

export function generatePolCp002ReviewBatchV2(): PolCp002ReviewQuestion[] {
  return generatePolCp002ReviewBatchV1().map((question) => {
    if (question.qlId !== "POL-002-QL-001") return question;

    const stem = QL001_STEMS_BY_ANSWER[question.canonicalAnswer];
    if (!stem) {
      throw new Error(`Missing approved POL-002-QL-001 stem for ${question.canonicalAnswer}`);
    }

    return {
      ...question,
      stem,
    };
  });
}
