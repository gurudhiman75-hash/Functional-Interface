import { generatePolCp008ReviewBatchV6 } from "./pol-cp008-review-generator-v6";

const VICE_PRESIDENT_QUALIFICATIONS = [
  "Article 66 gives the complete eligibility set for election as Vice-President.",
  "",
  "**Qualifications:**",
  "• Citizen of India",
  "• At least 35 years old",
  "• Qualified for election to Rajya Sabha",
  "• Must not hold a disqualifying office of profit; Article 66 provides specified constitutional exceptions",
].join("\n");

export function generatePolCp008ReviewBatchV7() {
  const base = generatePolCp008ReviewBatchV6();
  return base.map((q, index) => ({
    ...q,
    questionId: `POL-CP008-V7-${String(index + 1).padStart(3, "0")}`,
    explanation: q.qlId === "POL-008-QL-009" ? VICE_PRESIDENT_QUALIFICATIONS : q.explanation,
  }));
}
