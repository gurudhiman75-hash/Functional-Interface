import type { PolCp012ReviewQuestion } from "./pol-cp012-review-types";
import { generatePolCp012ReviewBatchV2 } from "./pol-cp012-review-generator-v2";

const SUPREME_COURT_JUDGE_QUALIFICATIONS = [
  "Article 124(3) gives the complete qualification set for appointment as a Supreme Court Judge.",
  "",
  "**Qualifications:**",
  "• Citizen of India",
  "• At least 5 years as a High Court Judge; or",
  "• At least 10 years as a High Court advocate; or",
  "• A distinguished jurist in the President's opinion",
].join("\n");

export function generatePolCp012ReviewBatchV3(): PolCp012ReviewQuestion[] {
  return generatePolCp012ReviewBatchV2().map((q, index) => ({
    ...q,
    questionId: `POL-CP012-V3-${String(index + 1).padStart(3, "0")}`,
    explanation: q.qlId === "POL-012-QL-004" ? SUPREME_COURT_JUDGE_QUALIFICATIONS : q.explanation,
  }));
}
