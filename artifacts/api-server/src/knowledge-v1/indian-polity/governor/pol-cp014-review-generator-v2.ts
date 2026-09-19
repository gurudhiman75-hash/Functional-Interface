import type { PolCp014ReviewQuestion } from "./pol-cp014-review-types";
import { generatePolCp014ReviewBatchV1 } from "./pol-cp014-review-generator-v1";

const GOVERNOR_QUALIFICATIONS = [
  "Article 157 gives the complete constitutional qualifications for appointment as Governor.",
  "",
  "**Qualifications:**",
  "• Citizen of India",
  "• At least 35 years old",
].join("\n");

const QUALIFICATION_IDS = new Set(["POL-CP014-V1-017", "POL-CP014-V1-018"]);

export function generatePolCp014ReviewBatchV2(): PolCp014ReviewQuestion[] {
  return generatePolCp014ReviewBatchV1().map((q, index) => ({
    ...q,
    questionId: `POL-CP014-V2-${String(index + 1).padStart(3, "0")}`,
    explanation: QUALIFICATION_IDS.has(q.questionId) ? GOVERNOR_QUALIFICATIONS : q.explanation,
  }));
}
