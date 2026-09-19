import type { PolCp013ReviewQuestion } from "./pol-cp013-review-types";
import { generatePolCp013ReviewBatchV1 } from "./pol-cp013-review-generator-v1";

const HIGH_COURT_JUDGE_QUALIFICATIONS = [
  "Article 217(2) gives the complete qualification set for appointment as a High Court Judge.",
  "",
  "**Qualifications:**",
  "• Citizen of India",
  "• At least 10 years in judicial office in India; or",
  "• At least 10 years as an advocate of a High Court, including qualifying service in two or more High Courts in succession",
  "• No separate numerical minimum appointment age is prescribed by Article 217",
].join("\n");

export function generatePolCp013ReviewBatchV2(): PolCp013ReviewQuestion[] {
  return generatePolCp013ReviewBatchV1().map((q, index) => ({
    ...q,
    questionId: `POL-CP013-V2-${String(index + 1).padStart(3, "0")}`,
    explanation: q.qlId === "POL-013-QL-005" ? HIGH_COURT_JUDGE_QUALIFICATIONS : q.explanation,
  }));
}
