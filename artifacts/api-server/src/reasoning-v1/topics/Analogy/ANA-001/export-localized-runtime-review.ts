import { writeFileSync } from "node:fs";
import { generateLocalizedAnalogy } from "./localization/runtime";

const LETTERS = ["A", "B", "C", "D"] as const;

function renderValue(value: string | readonly [string, string]): string {
  return Array.isArray(value) ? `${value[0]} : ${value[1]}` : value;
}

function exportLocale(locale: "hi-IN" | "pa-IN", outputPath: string): void {
  const language = locale === "hi-IN" ? "Hindi" : "Punjabi";
  const lines: string[] = [
    `# ANA-001 ${language} Runtime Question Review`,
    "",
    "**Source:** Exact output from the production locale-aware TypeScript runtime.",
    "",
    "**Coverage:** Two seeded samples for every active QL (`ANA-QL-001`–`ANA-QL-060`).",
    "",
  ];

  for (let ordinal = 1; ordinal <= 60; ordinal += 1) {
    const qlId = `ANA-QL-${String(ordinal).padStart(3, "0")}`;
    for (const [sampleIndex, seed] of [ordinal, ordinal + 1000].entries()) {
      const question = generateLocalizedAnalogy(qlId, locale, seed);
      lines.push(`## ${qlId} · Sample ${sampleIndex + 1} · \`${question.ruleId}\``, "");
      lines.push(`**Question:** ${question.stem}`, "");
      question.options.forEach((option, index) => {
        lines.push(`${LETTERS[index]}. ${renderValue(option.value)}`);
      });
      lines.push("");
      lines.push(`**Answer:** ${LETTERS[question.correctIndex]} — ${renderValue(question.options[question.correctIndex].value)}`, "");
      lines.push(`**Relationship:** ${question.explanation.ruleStatement}`, "");
      lines.push(`**Given pair:** ${question.explanation.sourceDemonstration}`, "");
      lines.push(`**Target pair:** ${question.explanation.targetApplication}`, "");
      lines.push(`**Conclusion:** ${question.explanation.conclusion}`, "");
      lines.push(`**Trap rejection:** ${question.explanation.closestTrapRejection}`, "");
      lines.push(`**Seed:** \`${seed}\``, "");
      lines.push("**Reviewer decision:** ☐ Approve  ☐ Revise", "");
      lines.push("**Reviewer notes:**", "", "---", "");
    }
  }

  writeFileSync(outputPath, lines.join("\n"), "utf8");
}

exportLocale("hi-IN", "ana-001-hindi-runtime-review.md");
exportLocale("pa-IN", "ana-001-punjabi-runtime-review.md");
console.log("Generated exact ANA-001 Hindi and Punjabi runtime review files.");
