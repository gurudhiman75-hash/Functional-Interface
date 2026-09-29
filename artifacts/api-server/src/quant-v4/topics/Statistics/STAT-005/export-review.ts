import { generateStat005Question } from "./partition-dispersion";
import { STAT005_PERMANENT_QLS } from "./permanent-ql-registry";

const lines = [
  "# Statistics — STAT-005 Partition Values & Dispersion Review V1",
  "",
  "**Review status:** English representative review candidate; awaiting content approval.",
  "**Profiles:** SSC CGL Tier II and JSO. **Lifecycle:** controlled review only.",
  "",
  "Each example is generated deterministically from its permanent QL contract. The formula convention that controls the answer is stated in the stem.",
  "",
];
for (const descriptor of STAT005_PERMANENT_QLS) {
  const question = generateStat005Question({ seed: `STAT005-REVIEW-REPRESENTATIVE:${descriptor.qlId}`, examProfile: "SSC_CGL_JSO", contractId: descriptor.contractId });
  lines.push(`## ${descriptor.qlId} — ${descriptor.label}`, "", `**Semantic contract:** ${descriptor.semanticContract}`, "", question.stem, "");
  question.options.forEach((option, index) => lines.push(`${String.fromCharCode(65 + index)}. ${option}`));
  lines.push("", `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`, "", `**Explanation:** ${question.explanation}`, "");
}
lines.push("## Review checkpoints", "", "- Confirm stems, data presentation, and explanations read like SSC CGL JSO Paper II questions.",
  "- Confirm the stated partition convention is acceptable for each intended format.",
  "- Confirm rounding, absolute-dispersion, and relative-dispersion treatment.",
  "- This review file does not authorize Question Bank storage, tests, mock tests, localization, publication, or production release.", "");
console.log(lines.join("\n"));
