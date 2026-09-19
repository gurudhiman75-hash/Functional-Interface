import type { PolCp016ReviewQuestion } from "./pol-cp016-review-types";
import { generatePolCp016ReviewBatchV1 } from "./pol-cp016-review-generator-v1";

const STATE_LEGISLATURE_MEMBERSHIP_QUALIFICATIONS = [
  "Article 173 gives the core constitutional qualifications for State Legislature membership.",
  "",
  "**Qualifications:**",
  "• Citizen of India",
  "• Make the prescribed oath or affirmation before the authorized person",
  "• At least 25 years old for the Legislative Assembly or 30 for the Legislative Council",
  "• Meet any other qualifications prescribed by Parliament by law",
].join("\n");

const AGE_QUESTION_IDS = new Set(["POL-CP016-V1-019", "POL-CP016-V1-020"]);

export function generatePolCp016ReviewBatchV2(): PolCp016ReviewQuestion[] {
  return generatePolCp016ReviewBatchV1().map((q, index) => ({
    ...q,
    questionId: `POL-CP016-V2-${String(index + 1).padStart(3, "0")}`,
    explanation: AGE_QUESTION_IDS.has(q.questionId) ? STATE_LEGISLATURE_MEMBERSHIP_QUALIFICATIONS : q.explanation,
  }));
}
