import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { COD_SOURCE_GAP_RULES, generateSourceGapPrototype } from "./source-gap-prototype";

const outputPath = resolve(process.argv[2] ?? "cod-001-source-gap-review.md");
const seeds = [1, 7, 19] as const;

const lines: string[] = [
  "# COD-001 Source-Gap Remediation — Human Review",
  "",
  "Status: prototype-only; no permanent QL allocation.",
  "",
  "This pack shows three deterministic samples for each newly source-backed rule authority.",
  "",
];

for (const ruleId of COD_SOURCE_GAP_RULES) {
  lines.push(`## ${ruleId}`, "");
  for (const seed of seeds) {
    const question = generateSourceGapPrototype(ruleId, seed);
    lines.push(`### Seed ${seed}`, "", question.stem, "");
    question.options.forEach((option, index) => {
      lines.push(`${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? "  **[Correct]**" : ""}`);
    });
    lines.push(
      "",
      `**Difficulty:** ${question.difficulty}`,
      `**Target owner:** ${question.ownerCheckpoint}`,
      "",
      `**Core rule:** ${question.explanation.coreRule}`,
      "",
      "**Step-by-step solution:**",
      ...question.explanation.stepByStep.map((step, index) => `${index + 1}. ${step}`),
      "",
      "**Visual working:**",
      "```text",
      ...question.explanation.visualAlignment,
      "```",
      "",
      `**Exam-speed method:** ${question.explanation.examShortcut}`,
      "",
      `**Common trap:** ${question.explanation.commonTrap}`,
      "",
      "---",
      "",
    );
  }
}

writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
