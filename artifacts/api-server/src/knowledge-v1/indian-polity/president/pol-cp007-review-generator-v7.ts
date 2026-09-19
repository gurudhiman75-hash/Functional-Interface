import { generatePolCp007ReviewBatchV6 } from "./pol-cp007-review-generator-v6";

const PRESIDENT_QUALIFICATIONS = [
  "Article 58 gives the complete eligibility set for election as President.",
  "",
  "**Qualifications:**",
  "• Citizen of India",
  "• At least 35 years old",
  "• Qualified for election to Lok Sabha",
  "• Must not hold a disqualifying office of profit; Article 58 provides specified constitutional exceptions",
].join("\n");

export function generatePolCp007ReviewBatchV7() {
  const base = generatePolCp007ReviewBatchV6();
  return base.map((q, index) => ({
    ...q,
    questionId: `POL-CP007-V7-${String(index + 1).padStart(3, "0")}`,
    explanation: q.qlId === "POL-007-QL-007" ? PRESIDENT_QUALIFICATIONS : q.explanation,
  }));
}
